#!/usr/bin/env python3
"""Chapter-level verification for Ch.2 r1 film (videos/ch02-skill-r1.mp4).

Checks:
1. Embedded subtitle cue count == merged SRT cue count (984).
2. Each unit's first merged cue starts at (cumulative offset + unit's own
   first cue start), within 60 ms (SRT ms rounding + frame quantisation).
3. No black frames at unit boundaries (YAVG of frames at offset +/- 0.5s).

Run from ~/workspace/ddia-animation-demo/ch02/skill-ch02.
Full-film decode (0 errors) is run separately with ffmpeg -f null -.
"""
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent  # skill-ch02/
FILM = Path("~/workspace/ddia-animation-demo/videos/ch02-skill-r1.mp4").expanduser()
UNITS = [
    ("u0", "subs/u0.srt", 18),
    ("u1", "subs/u1.srt", 73),
    ("u2", "subs/u2.srt", 57),
    ("u3", "subs/u3.srt", 59),
    ("u4", "subs/u4.srt", 79),
    ("u5", "subs/u5.srt", 119),
    ("u6", "subs/u6.srt", 74),
    ("u7", "subs/u7.srt", 92),
    ("u8", "subs/u8.srt", 76),
    ("u9", "subs/u9.srt", 104),
    ("u10", "subs/u10.srt", 102),
    ("u11", "subs/u11.srt", 80),
    ("u12", "subs/u12.srt", 51),
]
DURATIONS = [  # ffprobe durations from assemble-ch02-r1.py output
    61.067, 260.233, 187.267, 198.967, 270.100, 386.900, 276.867,
    277.033, 286.767, 311.600, 350.833, 259.100, 185.867,
]

TS_RE = re.compile(r"(\d+):(\d+):(\d+)[,.](\d+)")


def parse_ts(s: str) -> float:
    m = TS_RE.match(s.strip())
    h, mi, sec, ms = (int(g) for g in m.groups())
    return h * 3600 + mi * 60 + sec + ms / 1000.0


def parse_srt(path: Path):
    """Return list of (start, end, text) cues."""
    text = path.read_text(encoding="utf-8")
    cues = []
    for b in re.split(r"\n\s*\n", text.strip()):
        if not b.strip():
            continue
        blines = b.strip().splitlines()
        if len(blines) < 2 or "-->" not in blines[1]:
            continue
        s, _, e = blines[1].partition("-->")
        cues.append((parse_ts(s), parse_ts(e), "\n".join(blines[2:])))
    return cues


def yavg_at(t: float) -> float:
    """Mean luma of the frame at t (0-255): extract a 64x36 gray frame."""
    r = subprocess.run(
        ["ffmpeg", "-nostdin", "-v", "error", "-ss", f"{t:.3f}", "-i", str(FILM),
         "-frames:v", "1", "-vf", "scale=64:36,format=gray", "-f", "rawvideo", "-"],
        capture_output=True,
    )
    raw = r.stdout
    if len(raw) != 64 * 36:
        raise RuntimeError(f"bad frame bytes at {t:.3f}s: got {len(raw)} bytes")
    return sum(raw) / len(raw)


def main() -> int:
    ok = True
    merged = parse_srt(ROOT / "subs" / "ch02-r1.srt")
    print(f"merged SRT cues: {len(merged)} (expected {sum(c for _, _, c in UNITS)})")
    if len(merged) != sum(c for _, _, c in UNITS):
        ok = False

    # Embedded subtitle track: extract to SRT and count.
    r = subprocess.run(
        ["ffmpeg", "-nostdin", "-v", "error", "-i", str(FILM),
         "-map", "0:s:0", "-f", "srt", "-"],
        capture_output=True, text=True,
    )
    embedded = len(re.findall(r"^\d+$", r.stdout, flags=re.M))
    print(f"embedded subtitle cues: {embedded}")
    if embedded != len(merged):
        print("MISMATCH: embedded != merged", file=sys.stderr)
        ok = False

    # Boundary offsets: first-cue check.
    offsets = []
    acc = 0.0
    for d in DURATIONS:
        offsets.append(acc)
        acc += d
    cue_idx = 0
    for (name, srt, n), off in zip(UNITS, offsets):
        unit_cues = parse_srt(ROOT / srt)
        first_merged = merged[cue_idx][0]
        expect = off + unit_cues[0][0]
        diff = first_merged - expect
        flag = "OK" if abs(diff) <= 0.06 else "FAIL"
        if flag == "FAIL":
            ok = False
        print(f"{name}: first merged cue {first_merged:.3f}s, "
              f"expected {expect:.3f}s (offset {off:.3f} + unit first {unit_cues[0][0]:.3f}), "
              f"diff {diff:+.3f}s [{flag}]")
        cue_idx += n

    # Boundary black-frame check (12 boundaries).
    print("boundary frames (YAVG, 0=black, 255=white):")
    for i in range(len(UNITS) - 1):
        b = offsets[i + 1]
        for dt, label in ((-0.5, "-0.5s"), (0.0, " 0.0s"), (0.5, "+0.5s")):
            t = max(0.0, b + dt)
            y = yavg_at(t)
            flag = "OK" if y > 5 else "BLACK?"
            if flag != "OK":
                ok = False
            print(f"  {UNITS[i][0]}->{UNITS[i+1][0]} at {b:.3f}s {label}: YAVG {y:.1f} [{flag}]")

    print("ALL CHECKS PASSED" if ok else "CHECKS FAILED")
    return 0 if ok else 1


if __name__ == "__main__":
    raise SystemExit(main())
