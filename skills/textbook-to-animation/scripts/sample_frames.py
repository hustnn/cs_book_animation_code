#!/usr/bin/env python3
"""从成片按拍抽帧、拼联系表，并量出每拍真实的“画面定格”时长。

用法：
  python sample_frames.py VIDEO --timeline timeline.json -o OUTDIR
         [--scene scene.tsx | --beats b1:b5 | --beats b1,b2,b7] [--per-beat 5|1]
         [--freeze-warn 3] [--freeze-error 6] [--ffmpeg PATH]

- VIDEO 是一个单元的成片，或单个场景的渲染。单个场景时用 --scene（自动读出场景里 beat('…') 用到的拍）
  或 --beats 指定它覆盖的拍，时间会换算到场景起点。
- 每拍抽 --per-beat 帧（5：拍首 +0.15s、25%、50%、75%、拍末 −0.15s；1：只抽中点）。
  OUTDIR/frames/ 下是全分辨率帧（核对文字时看这个），OUTDIR/sheet-NN.png 是联系表：
  一行一拍、每帧左上角标“拍号 序号 时间”。所有 ffmpeg 调用都带 -nostdin。
- freezedetect 量出画面完全不动的区间（噪声容差 0.0003，小圆点移动、边框变色都算在动），
  按拍汇总最长定格：≥ --freeze-warn 记 warn，≥ --freeze-error 记 error。
  这是渲染后的真实值，补足 lint_scenes.py 的静态估算（lint 看不出“动画 0.5 秒做完、剩下 6 秒静止”）。
  旁白在继续、画面不动的时间太长，观众会觉得卡住了。
输出：frames/*.png、sheet-*.png、frames.md（联系表索引 + 定格表）、freeze.json
"""
import argparse
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

FONT_CANDIDATES = [
    "/System/Library/Fonts/Supplemental/Arial.ttf",
    "/System/Library/Fonts/Helvetica.ttc",
    "/Library/Fonts/Arial.ttf",
    "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    "/usr/share/fonts/dejavu/DejaVuSans.ttf",
    "/usr/share/fonts/TTF/DejaVuSans.ttf",
]
THUMB_W = 480


def find_ffmpeg(arg):
    ff = arg or os.environ.get("FFMPEG") or shutil.which("ffmpeg")
    if not ff:
        sys.exit("找不到 ffmpeg：用 --ffmpeg 指定，或设置 FFMPEG 环境变量"
                 "（Motion Canvas 工程里有一份：node_modules/@ffmpeg-installer/<平台>/ffmpeg）")
    return ff


def probe(ff, video):
    err = subprocess.run([ff, "-nostdin", "-hide_banner", "-i", str(video)], capture_output=True, text=True).stderr
    d = re.search(r"Duration:\s*(\d+):(\d+):([\d.]+)", err)
    fps = re.search(r"([\d.]+) fps", err)
    if not d:
        sys.exit(f"读不出 {video} 的时长")
    return int(d.group(1)) * 3600 + int(d.group(2)) * 60 + float(d.group(3)), float(fps.group(1)) if fps else 30.0


def select_beats(timeline, scene, spec):
    beats = timeline["beats"] if isinstance(timeline, dict) else timeline
    ids = [b["id"] for b in beats]
    if scene:
        src = Path(scene).read_text(encoding="utf-8")
        used = re.findall(r"\bbeat\(\s*['\"]([^'\"]+)['\"]", src)
        used += re.findall(r"\b(?:beat|titleBeat)\s*:\s*['\"]([^'\"]+)['\"]", src)
        wanted = [i for i in ids if i in set(used)]
    elif spec and ":" in spec:
        a, b = spec.split(":", 1)
        wanted = ids[ids.index(a):ids.index(b) + 1]
    elif spec:
        wanted = [i for i in ids if i in set(spec.split(","))]
    else:
        wanted = ids
    chosen = [b for b in beats if b["id"] in set(wanted)]
    if not chosen:
        sys.exit("没有选中任何拍：检查 --scene / --beats")
    # 换算到视频起点：第一拍的 start 记为 0；没有 start 字段时按 dur 累加
    t, base, out = 0.0, None, []
    for b in beats:
        start = b.get("start", t)
        t = start + b["dur"]
        if b in chosen:
            base = start if base is None else base
            out.append({"id": b["id"], "start": start - base, "end": start - base + b["dur"]})
    return out


def marks_for(b, per_beat):
    s, e = b["start"], b["end"]
    if per_beat == 1:
        return [(s + e) / 2]
    d = e - s
    return [min(s + 0.15, e), s + 0.25 * d, s + 0.5 * d, s + 0.75 * d, max(e - 0.15, s)]


def extract(ff, video, t, full, thumb, label, font):
    draw = ""
    if font:
        draw = (f",drawtext=fontfile='{font}':text='{label}':x=8:y=8:fontsize=20:"
                "fontcolor=yellow:box=1:boxcolor=black@0.7:boxborderw=4")
    subprocess.run(
        [ff, "-nostdin", "-hide_banner", "-loglevel", "error", "-y", "-ss", f"{t:.3f}", "-i", str(video),
         "-filter_complex", f"[0:v]split=2[a][b];[b]scale={THUMB_W}:-2{draw}[t]",
         "-map", "[a]", "-frames:v", "1", str(full), "-map", "[t]", "-frames:v", "1", str(thumb)],
        check=True,
    )


def make_sheets(ff, thumbs, cols, rows, outdir):
    """thumbs 按顺序排好；每张联系表 cols × rows，最后一张用黑帧补齐。"""
    sheets = []
    per = cols * rows
    for k in range(0, len(thumbs), per):
        chunk = thumbs[k:k + per]
        with tempfile.TemporaryDirectory() as tmp:
            for i in range(per):
                src = chunk[i] if i < len(chunk) else None
                dst = Path(tmp) / f"{i:04d}.png"
                if src:
                    shutil.copy(src, dst)
                else:
                    subprocess.run([ff, "-nostdin", "-hide_banner", "-loglevel", "error", "-y", "-i", str(chunk[0]),
                                    "-vf", "drawbox=t=fill:c=black", "-frames:v", "1", str(dst)], check=True)
            sheet = outdir / f"sheet-{k // per + 1:02d}.png"
            subprocess.run([ff, "-nostdin", "-hide_banner", "-loglevel", "error", "-y", "-framerate", "1",
                            "-i", str(Path(tmp) / "%04d.png"), "-vf", f"tile={cols}x{rows}:padding=4:color=0x333333",
                            "-frames:v", "1", str(sheet)], check=True)
        sheets.append(sheet)
    return sheets


def freezes(ff, video, noise, min_dur):
    err = subprocess.run(
        [ff, "-nostdin", "-hide_banner", "-i", str(video), "-vf", f"freezedetect=n={noise}:d={min_dur}",
         "-map", "0:v:0", "-f", "null", "-"], capture_output=True, text=True).stderr
    starts = [float(x) for x in re.findall(r"freeze_start:\s*([\d.]+)", err)]
    ends = [float(x) for x in re.findall(r"freeze_end:\s*([\d.]+)", err)]
    return list(zip(starts, ends + [None] * (len(starts) - len(ends))))


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("video", type=Path)
    ap.add_argument("--timeline", type=Path, required=True)
    ap.add_argument("-o", "--out", type=Path, required=True)
    ap.add_argument("--scene", type=Path, help="单个场景的源码：只取它用到的拍")
    ap.add_argument("--beats", help="拍的范围 b1:b5 或列表 b1,b2,b7")
    ap.add_argument("--per-beat", type=int, choices=[1, 5], default=5)
    ap.add_argument("--freeze-warn", type=float, default=3.0)
    ap.add_argument("--freeze-error", type=float, default=6.0)
    ap.add_argument("--noise", default="0.0003",
                    help="freezedetect 的噪声容差，按整帧平均差判断（默认 0.0003）。0.003 会把小圆点移动、边框变色"
                         "这类小面积变化也当成静止；在已知动画时长的拍上校准过，0.0003 与 0.0001 结果一致")
    ap.add_argument("--no-frames", action="store_true", help="只量定格，不抽帧")
    ap.add_argument("--ffmpeg")
    a = ap.parse_args()

    ff = find_ffmpeg(a.ffmpeg)
    duration, fps = probe(ff, a.video)
    beats = select_beats(json.loads(a.timeline.read_text(encoding="utf-8")), a.scene, a.beats)
    if beats[-1]["end"] > duration + 0.5:
        print(f"[warn] 选中的拍共 {beats[-1]['end']:.2f}s，视频只有 {duration:.2f}s：检查 --scene/--beats 是否对应这段视频",
              file=sys.stderr)
    a.out.mkdir(parents=True, exist_ok=True)

    sheets, rows_md = [], []
    if not a.no_frames:
        font = next((f for f in FONT_CANDIDATES if Path(f).exists()), None)
        frames_dir = a.out / "frames"
        thumbs_dir = a.out / ".thumbs"
        frames_dir.mkdir(exist_ok=True)
        thumbs_dir.mkdir(exist_ok=True)
        thumbs, n = [], 0
        for b in beats:
            for k, t in enumerate(marks_for(b, a.per_beat), 1):
                t = min(max(t, 0.0), max(duration - 1.0 / fps, 0.0))
                n += 1
                stem = f"{n:04d}_{b['id']}_{k}"
                label = f"{b['id']}  {k}/{a.per_beat}  {t:.2f}s"
                extract(ff, a.video, t, frames_dir / f"{stem}.png", thumbs_dir / f"{stem}.png", label, font)
                thumbs.append(thumbs_dir / f"{stem}.png")
        cols, rows = (5, 6) if a.per_beat == 5 else (6, 5)
        sheets = make_sheets(ff, thumbs, cols, rows, a.out)
        shutil.rmtree(thumbs_dir, ignore_errors=True)
        per_sheet = rows if a.per_beat == 5 else cols * rows
        for i, s in enumerate(sheets):
            ids = [b["id"] for b in beats[i * per_sheet:(i + 1) * per_sheet]]
            rows_md.append(f"| {s.name} | {', '.join(ids)} |")
        print(f"[frames] {n} 帧 → {frames_dir}；联系表 {len(sheets)} 张")

    # 定格：按拍汇总
    fz = freezes(ff, a.video, a.noise, min(1.0, a.freeze_warn))
    report = []
    for b in beats:
        longest = 0.0
        for s, e in fz:
            e = duration if e is None else e
            longest = max(longest, min(e, b["end"]) - max(s, b["start"]))
        level = "error" if longest >= a.freeze_error else "warn" if longest >= a.freeze_warn else "ok"
        report.append({"beat": b["id"], "dur": round(b["end"] - b["start"], 2), "longest_freeze": round(longest, 2),
                       "level": level})
    bad = [r for r in report if r["level"] != "ok"]
    frozen_total = sum(min(e if e is not None else duration, duration) - s for s, e in fz)
    print(f"[freeze] 视频 {duration:.2f}s，定格 ≥{min(1.0, a.freeze_warn):g}s 的区间合计 {frozen_total:.2f}s"
          f"（{frozen_total / duration:.0%}）；超过 {a.freeze_warn:g}s 的拍 {len(bad)} 个")
    for r in bad:
        print(f"[freeze] {r['level']:<5} {r['beat']}: 最长定格 {r['longest_freeze']:.2f}s（这拍 {r['dur']:.2f}s）")

    (a.out / "freeze.json").write_text(json.dumps({"video": str(a.video), "duration": duration,
                                                   "freezes": fz, "beats": report}, ensure_ascii=False, indent=2),
                                       encoding="utf-8")
    md = [f"# 抽帧与定格：{a.video.name}", "", f"时长 {duration:.2f}s；{len(beats)} 拍；每拍 {a.per_beat} 帧", ""]
    if rows_md:
        md += ["## 联系表", "", "| 文件 | 拍 |", "|---|---|", *rows_md, ""]
    md += ["## 每拍最长定格", "", "| 拍 | 时长 | 最长定格 | 级别 |", "|---|---|---|---|"]
    md += [f"| {r['beat']} | {r['dur']:.2f}s | {r['longest_freeze']:.2f}s | {r['level']} |" for r in report]
    (a.out / "frames.md").write_text("\n".join(md) + "\n", encoding="utf-8")
    print(f"→ {a.out / 'frames.md'}")


if __name__ == "__main__":
    main()
