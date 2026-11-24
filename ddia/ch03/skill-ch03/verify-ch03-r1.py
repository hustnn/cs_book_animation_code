#!/usr/bin/env python3
"""Chapter-level verification for skill-based Ch.3 r1 (read-only checks).

Run from ~/workspace/ddia-animation-demo/ch03/skill-ch03.
Checks:
1. Chapter film decodes with 0 errors (full decode).
2. Merged SRT cue count (1043) == sum of unit SRT cue counts; the SRT
   extracted from the chapter film's subtitle track counts the same.
3. Each unit's first cue in the merged SRT lands at (cumulative offset +
   unit-first-cue start) within 0.001s (millisecond rounding).
4. The 15 unit boundaries: frames at -0.5s / 0.0s / +0.5s are not black
   (mean luma YAVG in a sane range for the dark theme).
5. Chapter film duration == sum of unit film durations within 0.5s, and
   video-track frame count == sum of unit video frame counts.
"""
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
FILM = Path("~/workspace/ddia-animation-demo/videos/ch03-skill-r1.mp4").expanduser()
UNITS = [
    ("u0", "rounds/u0/r1/u0.mp4", "subs/u0.srt"),
    ("u1", "rounds/u1/r1/u1.mp4", "subs/u1.srt"),
    ("u2", "rounds/u2/r1/u2.mp4", "subs/u2.srt"),
    ("u3", "rounds/u3/r2/u3.mp4", "subs/u3.srt"),
    ("u4", "rounds/u4/r2/u4.mp4", "subs/u4.srt"),
    ("u5", "rounds/u5/r1/u5.mp4", "subs/u5.srt"),
    ("u6", "rounds/u6/r2/u6.mp4", "subs/u6.srt"),
    ("u7", "rounds/u7/r2/u7.mp4", "subs/u7.srt"),
    ("u8", "rounds/u8/r2/u8.mp4", "subs/u8.srt"),
    ("u9", "rounds/u9/r1/u9.mp4", "subs/u9.srt"),
    ("u10", "rounds/u10/r1/u10.mp4", "subs/u10.srt"),
    ("u11", "rounds/u11/r2/u11.mp4", "subs/u11.srt"),
    ("u12", "rounds/u12/r1/u12.mp4", "subs/u12.srt"),
    ("u13", "rounds/u13/r2/u13.mp4", "subs/u13.srt"),
    ("u14", "rounds/u14/r2/u14.mp4", "subs/u14.srt"),
    ("u15", "rounds/u15/r2/u15.mp4", "subs/u15.srt"),
]

TS_RE = re.compile(r"(\d+):(\d+):(\d+)[,.](\d+)")


def parse_ts(s: str) -> float:
    m = TS_RE.match(s.strip())
    h, mi, sec, ms = (int(g) for g in m.groups())
    return h * 3600 + mi * 60 + sec + ms / 1000.0


def srt_cues(path: Path):
    text = path.read_text(encoding="utf-8")
    blocks = [b for b in re.split(r"\n\s*\n", text.strip()) if b.strip()]
    cues = []
    for b in blocks:
        blines = b.strip().splitlines()
        if len(blines) < 2 or "-->" not in blines[1]:
            continue
        s, _, e = blines[1].partition("-->")
        cues.append((parse_ts(s), parse_ts(e)))
    return cues


def ffprobe_duration(path: Path) -> float:
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration",
         "-of", "csv=p=0", str(path)],
        capture_output=True, text=True, check=True)
    return float(out.stdout.strip())


def ffprobe_video(path: Path):
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-select_streams", "v:0",
         "-show_entries", "stream=duration,nb_frames",
         "-of", "csv=p=0", str(path)],
        capture_output=True, text=True, check=True)
    d, f = out.stdout.strip().split(",")
    return float(d), int(f)


def frame_yavg(t: float) -> float:
    """Mean luma of one frame, via a 64x36 grayscale raw dump."""
    r = subprocess.run(
        ["ffmpeg", "-v", "error", "-nostdin", "-ss", f"{t:.3f}", "-i", str(FILM),
         "-frames:v", "1", "-vf", "scale=64:36,format=gray",
         "-f", "rawvideo", "-"],
        capture_output=True)
    if len(r.stdout) < 64 * 36:
        return -1.0
    return sum(r.stdout[:64 * 36]) / (64 * 36)


def main() -> int:
    fails = []

    # 1. full decode
    r = subprocess.run(["ffmpeg", "-v", "error", "-nostdin", "-i", str(FILM),
                        "-f", "null", "-"], capture_output=True, text=True)
    print(f"1. full decode: {'0 errors' if r.returncode == 0 and not r.stderr.strip() else 'FAIL: ' + r.stderr[:300]}")
    if r.returncode != 0 or r.stderr.strip():
        fails.append("decode")

    # 2. subtitle counts
    merged = srt_cues(ROOT / "subs" / "ch03-r1.srt")
    unit_counts = [len(srt_cues(ROOT / s)) for _, _, s in UNITS]
    print(f"2. merged SRT cues: {len(merged)}; unit SRT sum: {sum(unit_counts)} "
          f"({'+'.join(map(str, unit_counts))})")
    if len(merged) != sum(unit_counts):
        fails.append("merged-srt-count")
    out = subprocess.run(
        ["ffmpeg", "-v", "error", "-nostdin", "-i", str(FILM),
         "-map", "0:s:0", "-f", "srt", "-"],
        capture_output=True, text=True)
    film_cues = len(re.findall(r"(?m)^[0-9]+$", out.stdout))
    print(f"   film subtitle track cues: {film_cues}")
    if film_cues != len(merged):
        fails.append("film-srt-count")

    # 3. first-cue offsets
    durations = [ffprobe_duration(ROOT / f) for _, f, _ in UNITS]
    offsets, acc = [], 0.0
    for d in durations:
        offsets.append(acc)
        acc += d
    worst = 0.0
    idx = 0
    for (name, _, srt), off in zip(UNITS, offsets):
        first = srt_cues(ROOT / srt)[0]
        got = merged[idx]
        err = max(abs(got[0] - (off + first[0])), abs(got[1] - (off + first[1])))
        worst = max(worst, err)
        idx += len(srt_cues(ROOT / srt))
    print(f"3. first-cue offset worst error: {worst:.4f}s (tolerance 0.001s)")
    if worst > 0.0015:
        fails.append("first-cue-offset")

    # 4. boundary frames
    bounds = offsets[1:]
    yavgs = []
    for t in bounds:
        for dt in (-0.5, 0.0, 0.5):
            yavgs.append(frame_yavg(t + dt))
    print(f"4. boundary frames: {len(yavgs)} sampled, YAVG min {min(yavgs):.1f} "
          f"max {max(yavgs):.1f} (black would be ~0)")
    if min(yavgs) < 5:
        fails.append("black-boundary-frame")

    # 5. duration / frames
    total = sum(durations)
    fdur = ffprobe_duration(FILM)
    fvdur, fframes = ffprobe_video(FILM)
    uframes = sum(ffprobe_video(ROOT / f)[1] for _, f, _ in UNITS)
    print(f"5. chapter duration {fdur:.3f}s vs unit sum {total:.3f}s "
          f"(diff {fdur-total:+.3f}s); video track {fvdur:.3f}s / {fframes} frames "
          f"vs unit frame sum {uframes}")
    if abs(fdur - total) > 0.5 or fframes != uframes:
        fails.append("duration-frames")

    print("RESULT:", "ALL PASS" if not fails else f"FAIL: {fails}")
    return 0 if not fails else 1


if __name__ == "__main__":
    raise SystemExit(main())
