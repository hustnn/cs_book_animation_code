#!/usr/bin/env python3
"""Pre-flight for Ch.3 r3 assembly: per-unit ffprobe + full decode + embedded SRT count.
Read-only; exits 1 if any unit fails the r2 tolerances."""
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
UNITS = [
    ("u0", "rounds/u0/r5/u0.mp4", "subs/u0.srt", 65.33, 16),
    ("u1", "rounds/u1/r6/u1.mp4", "subs/u1.srt", 366.9, 95),
    ("u2", "rounds/u2/r6/u2.mp4", "subs/u2.srt", 496.1, 130),
    ("u3", "rounds/u3/r6/u3.mp4", "subs/u3.srt", 470.8, 133),
    ("u4", "rounds/u4/r7/u4.mp4", "subs/u4.srt", 557.7, 148),
    ("u5", "rounds/u5/r6/u5.mp4", "subs/u5.srt", 449.47, 121),
    ("u6", "rounds/u6/r10/u6.mp4", "subs/u6.srt", 523.4, 138),
    ("u7", "rounds/u7/r6/u7.mp4", "subs/u7.srt", 546.7, 147),
    ("u8", "rounds/u8/r7/u8.mp4", "subs/u8.srt", 492.97, 128),
    ("u9", "rounds/u9/r8/u9.mp4", "subs/u9.srt", 416.97, 117),
    ("u10", "rounds/u10/r6/u10.mp4", "subs/u10.srt", 423.2, 111),
    ("u11", "rounds/u11/r8/u11.mp4", "subs/u11.srt", 276.93, 77),
    ("u12", "rounds/u12/r7/u12.mp4", "subs/u12.srt", 468.2, 119),
    ("u13", "rounds/u13/r10/u13.mp4", "subs/u13.srt", 447.93, 126),
    ("u14", "rounds/u14/r4/u14.mp4", "subs/u14.srt", 206.87, 55),
    ("u15", "rounds/u15/r7/u15.mp4", "subs/u15.srt", 277.67, 78),
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
              and rc == 0 and not derr and fcues == ecues == exp_cues
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
