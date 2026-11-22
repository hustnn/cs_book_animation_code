#!/usr/bin/env python3
"""Assemble skill-based Ch.1 r2: concat the finalized unit films (U0..U9)
in order, merge their SRTs with time offsets, mux as one chapter film.

r2 changes vs r1: U0 opening overview added first; U1 r4 / U2 r5 / U3 r3 /
U4 r4 / U5 r4 / U6 r3 / U7 r4 / U8 r3 / U9 r3 (overlap fixes + U-number
labels removed from on-screen titles). Output is a NEW file
videos/ch01-skill-r2.mp4; r1 and v2 films are untouched.

- Video: stream copy (all units are h264 High 1280x720 yuv420p 30fps).
- Audio: re-encode AAC 160k (all units are AAC 24kHz mono).
- Subtitles: merged SRT (offsets = cumulative film durations), muxed mov_text.
- No -shortest (U6 r1 lesson: it truncates to the shortest subtitle stream).
- Kept in the workspace because /tmp is cleaned mid-task.

Run from ~/workspace/ddia-animation-demo/ch01/skill-ch01.
"""
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent  # skill-ch01/
UNITS = [
    ("u0", "rounds/u0/r3/u0.mp4", "subs/u0.srt"),
    ("u1", "rounds/u1/r4/u1.mp4", "subs/u1.srt"),
    ("u2", "rounds/u2/r5/u2.mp4", "subs/u2.srt"),
    ("u3", "rounds/u3/r3/u3.mp4", "subs/u3.srt"),
    ("u4", "rounds/u4/r4/u4.mp4", "subs/u4.srt"),
    ("u5", "rounds/u5/r4/u5.mp4", "subs/u5.srt"),
    ("u6", "rounds/u6/r3/u6.mp4", "subs/u6.srt"),
    ("u7", "rounds/u7/r4/u7.mp4", "subs/u7.srt"),
    ("u8", "rounds/u8/r3/u8.mp4", "subs/u8.srt"),
    ("u9", "rounds/u9/r3/u9.mp4", "subs/u9.srt"),
]

TS_RE = re.compile(r"(\d+):(\d+):(\d+)[,.](\d+)")


def parse_ts(s: str) -> float:
    m = TS_RE.match(s.strip())
    h, mi, sec, ms = (int(g) for g in m.groups())
    return h * 3600 + mi * 60 + sec + ms / 1000.0


def fmt_ts(t: float) -> str:
    ms = int(round(t * 1000))
    h, ms = divmod(ms, 3_600_000)
    mi, ms = divmod(ms, 60_000)
    sec, ms = divmod(ms, 1000)
    return f"{h:02d}:{mi:02d}:{sec:02d},{ms:03d}"


def probe_duration(path: Path) -> float:
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration",
         "-of", "csv=p=0", str(path)],
        capture_output=True, text=True, check=True,
    )
    return float(out.stdout.strip())


def merge_srt(units, offsets, out_path: Path) -> int:
    """Merge unit SRTs with offsets; returns total cue count."""
    cue_no = 0
    lines = []
    for (name, _film, srt), off in zip(units, offsets):
        text = (ROOT / srt).read_text(encoding="utf-8")
        # Split on blank lines; each block: number, "start --> end", text...
        blocks = [b for b in re.split(r"\n\s*\n", text.strip()) if b.strip()]
        for b in blocks:
            blines = b.strip().splitlines()
            if len(blines) < 2 or "-->" not in blines[1]:
                continue
            start_s, _, end_s = blines[1].partition("-->")
            start = parse_ts(start_s) + off
            end = parse_ts(end_s) + off
            cue_no += 1
            lines.append(str(cue_no))
            lines.append(f"{fmt_ts(start)} --> {fmt_ts(end)}")
            lines.extend(blines[2:])
            lines.append("")
    out_path.write_text("\n".join(lines), encoding="utf-8")
    return cue_no


def main() -> int:
    durations = []
    for name, film, _srt in UNITS:
        d = probe_duration(ROOT / film)
        durations.append(d)
        print(f"{name}: {film} {d:.3f}s")
    total = sum(durations)
    print(f"total film duration: {total:.3f}s ({total/60:.1f} min)")

    offsets = []
    acc = 0.0
    for d in durations:
        offsets.append(acc)
        acc += d

    merged_srt = ROOT / "subs" / "ch01-r2.srt"
    n_cues = merge_srt(UNITS, offsets, merged_srt)
    print(f"merged SRT: {merged_srt} ({n_cues} cues)")

    concat_list = ROOT / "ch01-video-r2.txt"
    concat_list.write_text(
        "".join(f"file '{(ROOT / film).resolve()}'\n" for _, film, _ in UNITS),
        encoding="utf-8",
    )
    out = Path("~/workspace/ddia-animation-demo/videos/ch01-skill-r2.mp4").expanduser()
    out.parent.mkdir(parents=True, exist_ok=True)
    cmd = [
        "ffmpeg", "-y", "-nostdin",
        "-f", "concat", "-safe", "0", "-i", str(concat_list),
        "-i", str(merged_srt),
        "-map", "0:v", "-map", "0:a", "-map", "1",
        "-c:v", "copy", "-c:a", "aac", "-b:a", "160k",
        "-c:s", "mov_text",
        str(out),
    ]
    print("running:", " ".join(cmd))
    r = subprocess.run(cmd)
    if r.returncode != 0:
        print("ffmpeg concat FAILED", file=sys.stderr)
        return 1
    got = probe_duration(out)
    print(f"chapter film: {out} {got:.3f}s (expected {total:.3f}s, diff {got-total:+.3f}s)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
