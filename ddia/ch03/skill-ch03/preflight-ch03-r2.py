#!/usr/bin/env python3
"""Pre-flight for Ch.3 r2 assembly: per-unit ffprobe + full decode + embedded SRT count.
Read-only; exits 1 if any unit fails the r1 tolerances."""
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
UNITS = [
    ("u0", "rounds/u0/r4/u0.mp4", "subs/u0.srt", 78.73, 23),
    ("u1", "rounds/u1/r2/u1.mp4", "subs/u1.srt", 206.30, 52),
    ("u2", "rounds/u2/r2/u2.mp4", "subs/u2.srt", 307.60, 85),
    ("u3", "rounds/u3/r3/u3.mp4", "subs/u3.srt", 357.57, 103),
    ("u4", "rounds/u4/r3/u4.mp4", "subs/u4.srt", 363.33, 99),
    ("u5", "rounds/u5/r2/u5.mp4", "subs/u5.srt", 278.73, 75),
    ("u6", "rounds/u6/r4/u6.mp4", "subs/u6.srt", 282.37, 77),
    ("u7", "rounds/u7/r3/u7.mp4", "subs/u7.srt", 349.57, 95),
    ("u8", "rounds/u8/r3/u8.mp4", "subs/u8.srt", 241.20, 62),
    ("u9", "rounds/u9/r3/u9.mp4", "subs/u9.srt", 259.23, 73),
    ("u10", "rounds/u10/r2/u10.mp4", "subs/u10.srt", 256.20, 72),
    ("u11", "rounds/u11/r4/u11.mp4", "subs/u11.srt", 208.20, 58),
    ("u12", "rounds/u12/r3/u12.mp4", "subs/u12.srt", 264.70, 73),
    ("u13", "rounds/u13/r3/u13.mp4", "subs/u13.srt", 216.63, 58),
    ("u14", "rounds/u14/r3/u14.mp4", "subs/u14.srt", 203.47, 54),
    ("u15", "rounds/u15/r4/u15.mp4", "subs/u15.srt", 249.67, 70),
]


def srt_cues(path):
    text = Path(path).read_text(encoding="utf-8")
    blocks = [b for b in re.split(r"\n\s*\n", text.strip()) if b.strip()]
    n = 0
    for b in blocks:
        bl = b.strip().splitlines()
        if len(bl) >= 2 and "-->" in bl[1]:
            n += 1
    return n


def probe(path):
    out = subprocess.run(["ffprobe", "-v", "error", "-show_entries",
                          "format=duration,size",
                          "-of", "csv=p=0", str(path)],
                         capture_output=True, text=True, check=True)
    dur, size = out.stdout.strip().split(",")
    out = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0",
                          "-show_entries",
                          "stream=codec_name,profile,width,height,pix_fmt,r_frame_rate,duration,nb_frames",
                          "-of", "csv=p=0", str(path)],
                         capture_output=True, text=True, check=True)
    v = out.stdout.strip().split(",")
    out = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "a:0",
                          "-show_entries", "stream=codec_name,sample_rate,channels",
                          "-of", "csv=p=0", str(path)],
                         capture_output=True, text=True, check=True)
    a = out.stdout.strip().split(",")
    return float(dur), int(size), v, a


def decode_errors(path):
    r = subprocess.run(["ffmpeg", "-v", "error", "-nostdin", "-i", str(path),
                        "-f", "null", "-"], capture_output=True, text=True)
    return r.returncode, r.stderr.strip()


def embedded_cues(path):
    r = subprocess.run(["ffmpeg", "-v", "error", "-nostdin", "-i", str(path),
                        "-map", "0:s:0", "-f", "srt", "-"],
                       capture_output=True, text=True)
    return len(re.findall(r"(?m)^[0-9]+$", r.stdout))


def main():
    fails = []
    total_dur = 0.0
    total_frames = 0
    for name, film, srt, exp_dur, exp_cues in UNITS:
        p = ROOT / film
        dur, size, v, a = probe(p)
        vdur = float(v[6])
        frames = int(v[7])
        exp_frames = round(vdur * 30)
        rc, derr = decode_errors(p)
        fcues = srt_cues(ROOT / srt)
        ecues = embedded_cues(p)
        ok = (abs(dur - vdur) <= 0.5 and abs(frames - exp_frames) <= 2
              and rc == 0 and not derr and fcues == exp_cues == exp_cues
              and abs(dur - exp_dur) <= 0.5)
        print(f"{name}: {film} container {dur:.3f}s (expect {exp_dur}) "
              f"video {vdur:.3f}s frames {frames} (expect ~{exp_frames}) "
              f"size {size} v={v[0]}/{v[1]}/{v[2]}x{v[3]}/{v[4]}/{v[5]}fps "
              f"a={a[0]}/{a[1]}Hz/{a[2]}ch "
              f"decode rc={rc} errors={'0' if not derr else derr[:200]} "
              f"srt {fcues} embedded {ecues} (expect {exp_cues}) "
              f"{'OK' if ok else 'FAIL'}")
        if not ok:
            fails.append(name)
        total_dur += dur
        total_frames += frames
    print(f"TOTAL duration {total_dur:.3f}s frames {total_frames}")
    print("RESULT:", "ALL PASS" if not fails else f"FAIL: {fails}")
    return 0 if not fails else 1


if __name__ == "__main__":
    raise SystemExit(main())
