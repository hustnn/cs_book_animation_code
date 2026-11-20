#!/usr/bin/env python3
"""每拍音频 → timeline.json（+ 可选 SRT 字幕、ffmpeg 拼接清单）。

动画的每一拍时长由旁白音频决定：MC 的 beats.ts、Manim 的 beats.py 都读这里生成的 timeline.json。

用法：
  python audio_timeline.py AUDIO_DIR -o timeline.json \
      [--beats beats.json] [--srt subs.srt] [--concat-list audio.txt] [--pad 0.35] [--unit NAME]

- AUDIO_DIR 里每拍一个音频，文件名去掉扩展名就是拍号（b1.wav、a12.mp3……）。
- 给了 --beats（[{id, text}]）时按它的顺序排拍，并把旁白文本写进 timeline 和字幕；
  否则按文件名自然排序（a2 排在 a10 前面）。
- 时长：.wav 用标准库读取；其他格式调用 ffprobe（需要已安装 ffmpeg）。
- --pad：每拍末尾的留白（秒），会计入 dur；--concat-list 生成的清单会在拍与拍之间插入同样长的静音，
  所以拼出来的音轨和 timeline 严格对齐。
"""
import argparse
import json
import re
import shutil
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
    if not shutil.which("ffprobe"):
        sys.exit(f"需要 ffprobe 来读取 {path.name} 的时长（安装 ffmpeg，或改用 PCM .wav）")
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration",
         "-of", "default=nw=1:nk=1", str(path)],
        capture_output=True, text=True, check=True,
    ).stdout.strip()
    return float(out)


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


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("audio_dir", type=Path)
    ap.add_argument("-o", "--out", type=Path, required=True)
    ap.add_argument("--beats", type=Path, help="beats.json：[{id, text}]，决定顺序并提供字幕文本")
    ap.add_argument("--srt", type=Path)
    ap.add_argument("--concat-list", type=Path, help="写出 ffmpeg concat 清单（音频文件按拍序）")
    ap.add_argument("--pad", type=float, default=0.35, help="每拍末尾留白秒数，计入 dur")
    ap.add_argument("--unit", default=None, help="单元名，写进 timeline")
    args = ap.parse_args()

    files = {p.stem: p for p in args.audio_dir.iterdir() if p.suffix.lower() in AUDIO_EXT}
    if not files:
        sys.exit(f"{args.audio_dir} 里没有音频文件")

    if args.beats:
        beats = json.loads(args.beats.read_text(encoding="utf-8"))
        order = [b["id"] for b in beats]
        texts = {b["id"]: b.get("text", "") for b in beats}
        missing = [i for i in order if i not in files]
        extra = sorted(set(files) - set(order), key=natural_key)
        if missing:
            sys.exit(f"缺少这些拍的音频：{', '.join(missing)}")
        if extra:
            print(f"[warn] 这些音频不在 beats.json 里，已忽略：{', '.join(extra)}", file=sys.stderr)
    else:
        order = sorted(files, key=natural_key)
        texts = {}

    t = 0.0
    out_beats = []
    for bid in order:
        speech = duration_of(files[bid])
        dur = round(speech + args.pad, 3)
        out_beats.append({
            "id": bid, "start": round(t, 3), "dur": dur, "speech": round(speech, 3),
            "file": files[bid].name, "text": texts.get(bid, ""),
        })
        t += dur

    timeline = {"unit": args.unit or args.audio_dir.name, "total": round(t, 3), "pad": args.pad,
                "beats": out_beats}
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(timeline, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"timeline: {len(out_beats)} 拍，共 {t:.2f}s → {args.out}")

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
        args.srt.write_text("\n".join(lines), encoding="utf-8")
        print(f"srt: {n - 1} 条 → {args.srt}")

    if args.concat_list:
        write_concat_list(args, out_beats)


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
    if args.pad > 0 and len(params) == 1 and None not in params:
        nch, width, rate = params.pop()
        pad_path = args.concat_list.parent.resolve() / f"_pad_{int(args.pad * 1000)}ms.wav"
        with wave.open(str(pad_path), "wb") as w:
            w.setnchannels(nch)
            w.setsampwidth(width)
            w.setframerate(rate)
            w.writeframes(b"\x00" * int(rate * args.pad) * nch * width)
        for p in paths:
            lines += [f"file '{p}'", f"file '{pad_path}'"]
        note = f"已插入 {args.pad}s 静音（{pad_path.name}）"
    else:
        lines = [f"file '{p}'" for p in paths]
        note = ("音频不是同参数的 PCM wav，未插入静音：先用 "
                f"ffmpeg -i X -af apad=pad_dur={args.pad} X.padded.wav 逐个补齐，或把 TTS 输出统一成 wav")
    args.concat_list.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"concat 清单 → {args.concat_list}；{note}")


if __name__ == "__main__":
    main()
