#!/usr/bin/env python3
"""Assemble skill-based Ch.3 r2: concat the unit films (U0..U15) in order,
merge their SRTs with time offsets, mux as one chapter film.

Unit rounds in r2: U0 r4 / U1 r2 / U2 r2 / U3 r3 / U4 r3 / U5 r2 / U6 r4 /
U7 r3 / U8 r3 / U9 r3 / U10 r2 / U11 r4 / U12 r3 / U13 r3 / U14 r3 / U15 r4.
All units 0 P0 / 0 P1 (each verified independently by the coordinator:
ffprobe duration/size/streams, subtitle count, full-decode 0 errors,
review.md 0 P0/0 P1, qa.md pass, snapshot complete).
Output is a NEW file videos/ch03-skill-r2.mp4; no unit film is touched.
(The r1 film videos/ch03-skill-r1.mp4 must never be overwritten.)

- Video: stream copy (all units are h264 High 1280x720 yuv420p 30fps).
- Audio: re-encode AAC 160k (all units are AAC 24kHz mono).
- Subtitles: merged SRT (offsets = cumulative film durations), muxed mov_text.
- No -shortest (Ch.1 U6 r1 lesson: it truncates to the shortest subtitle stream).
- Pre-flight: each unit film's video-track duration must match its container
  duration and its frame count must match duration x 30fps (U10 lesson:
  a truncated scene file can hide behind a full-length audio track, and
  fingerprint reuse can mask it; total duration alone cannot catch it).
- Kept in the workspace because /tmp is cleaned mid-task.
- Run under the render lock:
  RENDER_LOCK_PATH=~/workspace/ddia-animation-demo/.render-lock \
  python ~/workspace/custom-skills/textbook-to-animation/scripts/render_lock.py \
  run ch03-assemble -- python assemble-ch03-r2.py

Run from ~/workspace/ddia-animation-demo/ch03/skill-ch03.
Pre-flight (ffprobe + full decode + embedded SRT count per unit) was done
separately first (preflight-ch03-r2.py, ALL PASS, 2026-11-25); this script
re-checks container vs video-track duration and frame count before concat.
"""
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent  # skill-ch03/
UNITS = [
    ("u0", "rounds/u0/r4/u0.mp4", "subs/u0.srt"),
    ("u1", "rounds/u1/r2/u1.mp4", "subs/u1.srt"),
    ("u2", "rounds/u2/r2/u2.mp4", "subs/u2.srt"),
    ("u3", "rounds/u3/r3/u3.mp4", "subs/u3.srt"),
    ("u4", "rounds/u4/r3/u4.mp4", "subs/u4.srt"),
    ("u5", "rounds/u5/r2/u5.mp4", "subs/u5.srt"),
    ("u6", "rounds/u6/r4/u6.mp4", "subs/u6.srt"),
    ("u7", "rounds/u7/r3/u7.mp4", "subs/u7.srt"),
    ("u8", "rounds/u8/r3/u8.mp4", "subs/u8.srt"),
    ("u9", "rounds/u9/r3/u9.mp4", "subs/u9.srt"),
    ("u10", "rounds/u10/r2/u10.mp4", "subs/u10.srt"),
    ("u11", "rounds/u11/r4/u11.mp4", "subs/u11.srt"),
    ("u12", "rounds/u12/r3/u12.mp4", "subs/u12.srt"),
    ("u13", "rounds/u13/r3/u13.mp4", "subs/u13.srt"),
    ("u14", "rounds/u14/r3/u14.mp4", "subs/u14.srt"),
    ("u15", "rounds/u15/r4/u15.mp4", "subs/u15.srt"),
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


def probe(path: Path):
    """Return (container duration, video-track duration, video nb_frames)."""
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration",
         "-of", "csv=p=0", str(path)],
        capture_output=True, text=True, check=True,
    )
    dur = float(out.stdout.strip())
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-select_streams", "v:0",
         "-show_entries", "stream=duration,nb_frames",
         "-of", "csv=p=0", str(path)],
        capture_output=True, text=True, check=True,
    )
    parts = out.stdout.strip().split(",")
    vdur = float(parts[0])
    frames = int(parts[1])
    return dur, vdur, frames


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
        dur, vdur, frames = probe(ROOT / film)
        expected_frames = round(vdur * 30) if vdur else 0
        ok = (
            dur is not None and vdur is not None and frames is not None
            and abs(dur - vdur) <= 0.5 and abs(frames - expected_frames) <= 2
        )
        print(f"{name}: {film} container {dur:.3f}s video {vdur:.3f}s "
              f"frames {frames} (expect ~{expected_frames}) {'OK' if ok else 'FAIL'}")
        if not ok:
            print(f"PRE-FLIGHT FAIL on {name}: video track does not match "
                  f"container duration/frames; re-render the unit first.",
                  file=sys.stderr)
            return 1
        durations.append(dur)
    total = sum(durations)
    print(f"total film duration: {total:.3f}s ({total/60:.1f} min)")

    offsets = []
    acc = 0.0
    for d in durations:
        offsets.append(acc)
        acc += d

    merged_srt = ROOT / "subs" / "ch03-r2.srt"
    n_cues = merge_srt(UNITS, offsets, merged_srt)
    print(f"merged SRT: {merged_srt} ({n_cues} cues)")

    concat_list = ROOT / "ch03-video-r2.txt"
    concat_list.write_text(
        "".join(f"file '{(ROOT / film).resolve()}'\n" for _, film, _ in UNITS),
        encoding="utf-8",
    )
    out = Path("~/workspace/ddia-animation-demo/videos/ch03-skill-r2.mp4").expanduser()
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
    got, vgot, fgot = probe(out)
    print(f"chapter film: {out} container {got:.3f}s video {vgot:.3f}s "
          f"frames {fgot} (expected {total:.3f}s, diff {got-total:+.3f}s)")
    if abs(got - total) > 0.5 or abs(vgot - total) > 0.5:
        print("DURATION MISMATCH", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
