#!/usr/bin/env python3
"""Assemble U6 r3 film: concat 3 scene mp4s + voice wav + srt -> rounds/u6/r3/u6.mp4.
Usage (under the render lock):
  export RENDER_LOCK_PATH=~/workspace/ddia-animation-demo/.render-lock
  python3 <skill>/scripts/render_lock.py run u6-assemble-r3 -- python3 u6-assemble-r3.py
Checks each scene mp4 first (ffprobe duration + full decode 0 errors); no -shortest.
"""
import json
import subprocess
import sys
from pathlib import Path

ROOT = Path("~/workspace/ddia-animation-demo/ch03").expanduser()
MC = ROOT / "motion-canvas"
SK = ROOT / "skill-ch03"
R3 = SK / "rounds" / "u6" / "r3"
SCENES = ["u6-mc1", "u6-mc2", "u6-mc3"]


def run(cmd, **kw):
    print("+", " ".join(str(c) for c in cmd))
    r = subprocess.run(cmd, **kw)
    if r.returncode != 0:
        print("FAILED", cmd[0], file=sys.stderr)
        sys.exit(1)
    return r


def probe(p):
    r = subprocess.run(["ffprobe", "-v", "error", "-show_entries",
                        "format=duration:stream=duration,nb_frames,codec_type",
                        "-of", "json", str(p)], capture_output=True, text=True)
    d = json.loads(r.stdout)
    v = [s for s in d["streams"] if s["codec_type"] == "video"][0]
    return float(d["format"]["duration"]), float(v["duration"]), int(v["nb_frames"])


def decode_check(p):
    r = subprocess.run(["ffmpeg", "-nostdin", "-v", "error", "-i", str(p),
                        "-f", "null", "-"], capture_output=True, text=True)
    return r.returncode, r.stderr.strip()


def main():
    R3.mkdir(parents=True, exist_ok=True)
    total = 0.0
    for name in SCENES:
        p = MC / "output" / f"{name}.mp4"
        dur, vdur, frames = probe(p)
        exp = round(vdur * 30)
        ok = abs(dur - vdur) <= 0.5 and abs(frames - exp) <= 2
        print(f"{name}: container {dur:.3f}s video {vdur:.3f}s frames {frames} (expect ~{exp}) {'OK' if ok else 'FAIL'}")
        if not ok:
            print(f"PRE-FLIGHT FAIL on {name}", file=sys.stderr)
            return 1
        code, err = decode_check(p)
        print(f"{name}: decode exit {code} {err[:200]}")
        if code != 0:
            print(f"DECODE FAIL on {name}", file=sys.stderr)
            return 1
        total += dur
    print(f"scene total: {total:.3f}s")

    # silent concat
    lst = R3 / "u6-video.txt"
    lst.write_text("".join(f"file '{(MC / 'output' / f'{n}.mp4').resolve()}'\n" for n in SCENES), encoding="utf-8")
    silent = R3 / "u6-silent.mp4"
    run(["ffmpeg", "-nostdin", "-y", "-f", "concat", "-safe", "0", "-i", str(lst),
         "-c", "copy", str(silent)])
    # voice wav from audio/u6.txt concat list
    voice = R3 / "u6-voice.wav"
    run(["ffmpeg", "-nostdin", "-y", "-f", "concat", "-safe", "0", "-i", str(SK / "audio" / "u6.txt"),
         "-c:a", "pcm_s16le", str(voice)])
    # mux (no -shortest)
    out = R3 / "u6.mp4"
    run(["ffmpeg", "-nostdin", "-y", "-i", str(silent), "-i", str(voice), "-i", str(SK / "subs" / "u6.srt"),
         "-map", "0:v", "-map", "1:a", "-map", "2",
         "-c:v", "copy", "-c:a", "aac", "-b:a", "160k", "-c:s", "mov_text", str(out)])
    dur, vdur, frames = probe(out)
    print(f"film: container {dur:.3f}s video {vdur:.3f}s frames {frames} (scene total {total:.3f}s, diff {dur-total:+.3f}s)")
    code, err = decode_check(out)
    print(f"film decode exit {code} {err[:200]}")
    r = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "stream=index,codec_type,codec_name",
                        "-of", "csv=p=0", str(out)], capture_output=True, text=True)
    print("streams:", r.stdout.strip().replace("\n", " | "))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
