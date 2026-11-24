#!/usr/bin/env python3
"""每拍音频 → timeline.json（+ 可选 SRT 字幕、ffmpeg 拼接清单），并自动检查每拍配音。

动画的每一拍时长由旁白音频决定：MC 的 beats.ts、Manim 的 beats.py 都读这里生成的 timeline.json。

用法：
  python audio_timeline.py AUDIO_DIR -o timeline.json [-o motion-canvas/src/timeline/<unit>.json] \
      [--beats beats.json] [--srt subs.srt] [--concat-list audio.txt] [--pad 0.35] [--unit NAME] \
      [--strict]

- AUDIO_DIR 里每拍一个音频，文件名去掉扩展名就是拍号（b1.wav、a12.mp3……）；以 _ 开头的文件忽略。
  同一拍号既有 .wav 又有别的格式（如转格式后留下的 .mp3）时，只用 .wav 并给出警告——
  否则两者撞键，会静默用错文件、丢掉垫音。
- -o 可以给多次：一次运行同时写出章节目录和 Motion Canvas 工程里的两份 timeline，避免两份拷贝不同步。
- 给了 --beats（[{id, text}]）时按它的顺序排拍，并把旁白文本写进 timeline 和字幕；
  否则按文件名自然排序（a2 排在 a10 前面）。
- 时长：.wav 用标准库读取；其他格式调用 ffprobe（没有 ffprobe 时退回解析 `ffmpeg -i` 的输出）。
- --pad：每拍末尾的留白（秒），会计入 dur；--concat-list 生成的清单会在拍与拍之间插入同样长的静音，
  所以拼出来的音轨和 timeline 严格对齐。
- 演示拍：beats.json 里某拍写 "hold": 秒数，旁白念完后再多留这么久的静音给画面（复杂变换演完、让观众看清）。
  hold 计入 dur、写进 timeline，拼接清单在这一拍后面插入 pad + hold 秒静音。

配音检查（PCM wav 自动进行，给了 --beats 才能算语速）：
- 疑似重复 / 多读  error：有声段语速（扣掉停顿后）比全单元中位数慢 30% 以上。TTS 在固定位置截断、
  把后半句重复几遍时就是这个特征——时长被“说话声”撑长，而不是被停顿撑长。
- 长停顿          warn ：句中单次静音 ≥ 1.0s（列举、冒号、逗号后常见），观众会以为卡住了。
- 语速过快        warn ：整拍语速比中位数快 40% 以上，可能吞字或截断。
- 首尾静音过长    warn ：开头 > 0.5s 或结尾 > 0.8s。
有 error 时退出码为 1（--strict 时 warn 也算）。检查只是筛查，最终以人耳试听为准。
"""
import argparse
import array
import json
import math
import re
import shutil
import statistics
import subprocess
import sys
import wave
from pathlib import Path

AUDIO_EXT = {".wav", ".mp3", ".m4a", ".aac", ".ogg", ".flac", ".opus"}


def natural_key(s):
    return [int(t) if t.isdigit() else t for t in re.split(r"(\d+)", s)]


def duration_of(path: Path) -> float:
    if path.suffix.lower() == ".wav":
        try:
            with wave.open(str(path)) as w:
                return w.getnframes() / float(w.getframerate())
        except wave.Error:
            pass  # 非 PCM wav，交给 ffprobe
    if shutil.which("ffprobe"):
        out = subprocess.run(
            ["ffprobe", "-v", "error", "-show_entries", "format=duration",
             "-of", "default=nw=1:nk=1", str(path)],
            capture_output=True, text=True, check=True,
        ).stdout.strip()
        return float(out)
    if shutil.which("ffmpeg"):
        err = subprocess.run(["ffmpeg", "-nostdin", "-hide_banner", "-i", str(path)],
                             capture_output=True, text=True).stderr
        m = re.search(r"Duration:\s*(\d+):(\d+):([\d.]+)", err)
        if m:
            return int(m.group(1)) * 3600 + int(m.group(2)) * 60 + float(m.group(3))
    sys.exit(f"需要 ffprobe 或 ffmpeg 来读取 {path.name} 的时长（或把配音统一转成 PCM .wav）")


def text_weight(text: str) -> float:
    """旁白“字数”：汉字算 1，英文词/数字算 1.5（与 beats.ts 的估算一致）。"""
    cjk = len(re.findall(r"[㐀-鿿豈-﫿]", text))
    words = len(re.findall(r"[A-Za-z0-9.%]+", text))
    return cjk + 1.5 * words


def analyze_wav(path: Path, win=0.02):
    """返回 {lead, trail, pauses:[(起点, 时长)], voiced}；不是 16-bit PCM wav 时返回 None。"""
    try:
        with wave.open(str(path)) as w:
            if w.getsampwidth() != 2:
                return None
            rate, nch, n = w.getframerate(), w.getnchannels(), w.getnframes()
            data = array.array("h", w.readframes(n))
    except (wave.Error, EOFError):
        return None
    if sys.byteorder == "big":
        data.byteswap()
    if nch > 1:
        data = data[::nch]
    step = max(1, int(rate * win))
    rms = [math.sqrt(sum(x * x for x in data[i:i + step]) / max(1, len(data[i:i + step])))
           for i in range(0, len(data), step)]
    if not rms or max(rms) == 0:
        return {"lead": len(rms) * win, "trail": 0.0, "pauses": [], "voiced": 0.0}
    thr = max(max(rms) * 10 ** (-35 / 20), 60.0)  # 比峰值低 35dB 视为静音
    voiced = [r >= thr for r in rms]
    first = voiced.index(True)
    last = len(voiced) - 1 - voiced[::-1].index(True)
    pauses, run = [], 0
    for i in range(first, last + 1):
        if not voiced[i]:
            run += 1
        else:
            if run * win >= 0.25:
                pauses.append((round((i - run) * win, 2), round(run * win, 2)))
            run = 0
    span = (last - first + 1) * win
    return {"lead": round(first * win, 2), "trail": round((len(rms) - 1 - last) * win, 2),
            "pauses": pauses, "voiced": round(span - sum(p[1] for p in pauses), 2)}


def check_audio(beats, files):
    """逐拍检查配音；返回 [(级别, 拍号, 问题)] 和单元中位语速。"""
    rows = []
    for b in beats:
        info = analyze_wav(files[b["id"]])
        weight = text_weight(b.get("text", ""))
        if info and weight > 0 and info["voiced"] > 0:
            rows.append((b, info, weight / info["voiced"], weight / b["speech"]))
    if len(rows) < 3:
        return [], None
    med_voiced = statistics.median(r[2] for r in rows)
    med_rate = statistics.median(r[3] for r in rows)
    issues = []
    for b, info, voiced_rate, rate in rows:
        if voiced_rate < 0.7 * med_voiced:
            issues.append(("error", b["id"],
                           f"疑似重复/多读：有声段 {info['voiced']:.2f}s，语速 {voiced_rate:.2f} 字/秒"
                           f"（单元中位 {med_voiced:.2f}），去听尾句是否重复"))
        if rate > 1.4 * med_rate:
            issues.append(("warn", b["id"], f"语速过快：{rate:.2f} 字/秒（中位 {med_rate:.2f}），可能吞字或截断"))
        for at, length in info["pauses"]:
            if length >= 1.0:
                issues.append(("warn", b["id"], f"长停顿 {length:.2f}s（在 {at:.2f}s 处）"))
        if info["lead"] > 0.5:
            issues.append(("warn", b["id"], f"开头静音 {info['lead']:.2f}s"))
        if info["trail"] > 0.8:
            issues.append(("warn", b["id"], f"结尾静音 {info['trail']:.2f}s"))
    return issues, med_rate


def srt_time(t: float) -> str:
    ms = int(round(t * 1000))
    h, ms = divmod(ms, 3_600_000)
    m, ms = divmod(ms, 60_000)
    s, ms = divmod(ms, 1000)
    return f"{h:02d}:{m:02d}:{s:02d},{ms:03d}"


def split_caption(text: str, limit: int = 26):
    """按标点把一拍旁白切成若干条字幕，每条不超过 limit 个字符（尽量）。"""
    # 中文标点后都可以断；英文标点只在后面跟空白时断（避免把 1.2、p99.9 拆开）
    parts = [p for p in re.split(r"(?<=[。！？；，、：])|(?<=[.!?;,:])(?=\s)", text) if p.strip()]
    chunks, cur = [], ""
    for p in parts:
        if cur and len(cur) + len(p) > limit:
            chunks.append(cur)
            cur = p
        else:
            cur += p
    if cur:
        chunks.append(cur)
    return chunks or [text]


def collect_files(audio_dir: Path):
    """拍号 → 音频文件。同一拍号有多个格式时优先 .wav，其余列入 ignored。"""
    by_stem = {}
    for p in sorted(audio_dir.iterdir()):
        if p.is_file() and p.suffix.lower() in AUDIO_EXT and not p.stem.startswith("_"):
            by_stem.setdefault(p.stem, []).append(p)
    files, ignored = {}, []
    for stem, paths in by_stem.items():
        wavs = [p for p in paths if p.suffix.lower() == ".wav"]
        chosen = wavs[0] if wavs else paths[0]
        files[stem] = chosen
        ignored += [p for p in paths if p != chosen]
    return files, ignored


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("audio_dir", type=Path)
    ap.add_argument("-o", "--out", type=Path, action="append", required=True,
                    help="timeline 输出路径；可给多次，一次写出多份完全相同的拷贝")
    ap.add_argument("--beats", type=Path, help="beats.json：[{id, text}]，决定顺序并提供字幕文本")
    ap.add_argument("--srt", type=Path)
    ap.add_argument("--concat-list", type=Path, help="写出 ffmpeg concat 清单（音频文件按拍序）")
    ap.add_argument("--pad", type=float, default=0.35, help="每拍末尾留白秒数，计入 dur")
    ap.add_argument("--unit", default=None, help="单元名，写进 timeline")
    ap.add_argument("--no-check", action="store_true", help="跳过配音检查")
    ap.add_argument("--strict", action="store_true", help="配音检查有 warn 也返回非零退出码")
    args = ap.parse_args()

    files, ignored = collect_files(args.audio_dir)
    if not files:
        sys.exit(f"{args.audio_dir} 里没有音频文件")
    if ignored:
        print(f"[warn] 同一拍号有多个音频，已只用 .wav，忽略：{', '.join(p.name for p in ignored)}"
              "（建议删掉多余文件，免得以后用错）", file=sys.stderr)

    if args.beats:
        beats = json.loads(args.beats.read_text(encoding="utf-8"))
        beats = beats["beats"] if isinstance(beats, dict) else beats
        order = [b["id"] for b in beats]
        texts = {b["id"]: b.get("text", "") for b in beats}
        holds = {b["id"]: float(b.get("hold") or 0) for b in beats}
        bad = [i for i, h in holds.items() if h < 0 or h > 10]
        if bad:
            sys.exit(f"hold 要在 0–10 秒之间：{', '.join(bad)}（更长的静止该拆拍或加动作）")
        missing = [i for i in order if i not in files]
        extra = sorted(set(files) - set(order), key=natural_key)
        if missing:
            sys.exit(f"缺少这些拍的音频：{', '.join(missing)}")
        if extra:
            print(f"[warn] 这些音频不在 beats.json 里，已忽略：{', '.join(extra)}", file=sys.stderr)
    else:
        order = sorted(files, key=natural_key)
        texts = {}
        holds = {}

    t = 0.0
    out_beats = []
    for bid in order:
        speech = duration_of(files[bid])
        hold = holds.get(bid, 0.0)
        dur = round(speech + args.pad + hold, 3)
        row = {
            "id": bid, "start": round(t, 3), "dur": dur, "speech": round(speech, 3),
            "file": files[bid].name, "text": texts.get(bid, ""),
        }
        if hold:
            row["hold"] = hold
        out_beats.append(row)
        t += dur

    timeline = {"unit": args.unit or args.audio_dir.name, "total": round(t, 3), "pad": args.pad,
                "beats": out_beats}
    payload = json.dumps(timeline, ensure_ascii=False, indent=2)
    for out in args.out:
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(payload, encoding="utf-8")
    print(f"timeline: {len(out_beats)} 拍，共 {t:.2f}s → {', '.join(str(o) for o in args.out)}")

    if args.srt:
        lines, n = [], 1
        for b in out_beats:
            if not b["text"]:
                continue
            chunks = split_caption(b["text"])
            total_chars = sum(len(c) for c in chunks)
            cur = b["start"]
            for c in chunks:
                span = b["speech"] * len(c) / total_chars
                lines += [str(n), f"{srt_time(cur)} --> {srt_time(cur + span)}", c, ""]
                cur += span
                n += 1
        args.srt.parent.mkdir(parents=True, exist_ok=True)
        args.srt.write_text("\n".join(lines), encoding="utf-8")
        print(f"srt: {n - 1} 条 → {args.srt}")

    if args.concat_list:
        write_concat_list(args, out_beats)

    if args.no_check:
        return
    issues, med = check_audio(out_beats, files)
    if med is None:
        print("[check] 配音检查跳过：需要 --beats 提供旁白文本，且至少 3 拍是 16-bit PCM wav")
        return
    errors = [i for i in issues if i[0] == "error"]
    print(f"[check] 配音检查：{len(errors)} error / {len(issues) - len(errors)} warn；单元中位语速 {med:.2f} 字/秒")
    for level, bid, msg in issues:
        print(f"[check] {level:<5} {bid}: {msg}")
    if errors or (args.strict and issues):
        sys.exit(1)


def wav_params(path: Path):
    try:
        with wave.open(str(path)) as w:
            return (w.getnchannels(), w.getsampwidth(), w.getframerate())
    except (wave.Error, EOFError):
        return None


def write_concat_list(args, out_beats):
    """写 ffmpeg concat 清单，拍与拍之间插入 pad 秒静音，使拼出的音轨和 timeline 严格对齐。

    之后：ffmpeg -f concat -safe 0 -i LIST -c:a pcm_s16le voice.wav
    """
    paths = [(args.audio_dir / b["file"]).resolve() for b in out_beats]
    params = {wav_params(p) for p in paths}
    lines = []
    holds = any(b.get("hold") for b in out_beats)
    if (args.pad > 0 or holds) and len(params) == 1 and None not in params:
        nch, width, rate = params.pop()
        made = {}

        def silence(sec):
            # 文件名以 _ 开头：即使清单写在音频目录里，下次运行也不会被当成一拍
            ms = int(round(sec * 1000))
            if ms not in made:
                path = args.concat_list.parent.resolve() / f"_pad_{ms}ms.wav"
                with wave.open(str(path), "wb") as w:
                    w.setnchannels(nch)
                    w.setsampwidth(width)
                    w.setframerate(rate)
                    w.writeframes(b"\x00" * int(rate * ms / 1000) * nch * width)
                made[ms] = path
            return made[ms]

        for p, b in zip(paths, out_beats):
            lines.append(f"file '{p}'")
            gap = args.pad + b.get("hold", 0)
            if gap > 0:
                lines.append(f"file '{silence(gap)}'")
        note = f"已插入 {args.pad}s 静音" + ("（演示拍另加 hold）" if holds else "")
    else:
        lines = [f"file '{p}'" for p in paths]
        note = ("音频不是同参数的 PCM wav，未插入静音：先用 "
                f"ffmpeg -i X -af apad=pad_dur={args.pad} X.padded.wav 逐个补齐，或把 TTS 输出统一成 wav")
        if holds:
            note += "；演示拍的 hold 也没有插入，timeline 会比音轨长"

    args.concat_list.parent.mkdir(parents=True, exist_ok=True)
    args.concat_list.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"concat 清单 → {args.concat_list}；{note}")


if __name__ == "__main__":
    main()
