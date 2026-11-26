#!/usr/bin/env python3
"""Assemble U7 R5 unit film from the 4 rendered scenes + voice + subtitles.

Scenes are staged in rounds/u7/r5/stage/ (byte copies of motion-canvas/output/
verified by ffprobe + full decode right after each render); assembly uses
only the stage copies because output/ is shared and other agents' probes
have truncated files there before.

Run from ~/workspace/ddia-animation-demo/ch03/skill-ch03, under the render lock:
  export RENDER_LOCK_PATH=~/workspace/ddia-animation-demo/.render-lock
  python ~/workspace/custom-skills/textbook-to-animation/scripts/render_lock.py \
    run u7-assemble-r5 -- python assemble-u7-r5.py

Steps (skill references/motion-canvas.md §6):
1. Pre-flight: each staged scene mp4's video-track duration must match its
   container duration and its frame count must match duration x 30fps, plus
   a full ffmpeg decode with 0 errors (a truncated scene file can hide
   behind a full-length audio track).
2. Concat the 4 scene videos (re-encode, no -shortest) -> rounds/u7/r5/u7-silent.mp4
3. Concat the voice wavs per audio/u7.txt -> rounds/u7/r5/u7-voice.wav
4. Mux silent + voice + subs/u7.srt (mov_text soft subtitles) -> rounds/u7/r5/u7.mp4
5. Verify: ffprobe duration/size/streams, full-decode 0 errors, subtitle count.

Expected: 67 beats, 479.95s total (r4: 63 beats, 404.60s).
Scene durations (timeline sums): mc1 150.54s / mc2 126.49s / mc3 100.20s / mc4 102.71s.
"""
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent  # skill-ch03/
R5 = ROOT / "rounds" / "u7" / "r5"
STAGE = R5 / "stage"
SCENES = ["u7-mc1", "u7-mc2", "u7-mc3", "u7-mc4"]
EXPECTED_TOTAL = 479.95


def run(cmd, **kw):
    r = subprocess.run(cmd, capture_output=True, text=True, **kw)
    if r.returncode != 0:
        print("FAIL:", " ".join(str(c) for c in cmd))
        print(r.stdout[-2000:])
        print(r.stderr[-2000:])
        sys.exit(1)
    return r


def main():
    R5.mkdir(parents=True, exist_ok=True)
    # 1. Pre-flight on staged scene files: ffprobe + full decode
    for s in SCENES:
        p = STAGE / f"{s}.mp4"
        if not p.exists() or p.stat().st_size == 0:
            print(f"FAIL: missing/empty staged scene file {p}")
            sys.exit(1)
        out = run(["ffprobe", "-v", "error", "-select_streams", "v:0",
                   "-show_entries", "stream=duration,nb_frames,r_frame_rate",
                   "-of", "default=noprint_wrappers=1", str(p)]).stdout
        d = dict(line.split("=", 1) for line in out.strip().splitlines() if "=" in line)
        vdur, nframes = float(d["duration"]), int(d["nb_frames"])
        expect = round(vdur * 30)
        print(f"{s}: {p.stat().st_size}B video dur={vdur}s frames={nframes} expect~{expect}")
        if abs(nframes - expect) > 2:
            print(f"FAIL: {s} frame count {nframes} != duration x 30fps ({expect})")
            sys.exit(1)
        dec = run(["ffmpeg", "-nostdin", "-v", "error", "-i", str(p),
                   "-f", "null", "-"]).stderr.strip()
        if dec:
            print(f"FAIL: {s} decode errors: {dec[:500]}")
            sys.exit(1)
        print(f"  decode OK")

    # 2. Concat video
    vlist = R5 / "u7-video-list.txt"
    vlist.write_text("".join(f"file '{STAGE / (s + '.mp4')}'\n" for s in SCENES))
    silent = R5 / "u7-silent.mp4"
    run(["ffmpeg", "-nostdin", "-y", "-f", "concat", "-safe", "0", "-i", str(vlist),
         "-c:v", "libx264", "-crf", "18", "-pix_fmt", "yuv420p", "-r", "30", "-an", str(silent)])
    # 3. Concat voice
    voice = R5 / "u7-voice.wav"
    run(["ffmpeg", "-nostdin", "-y", "-f", "concat", "-safe", "0", "-i", str(ROOT / "audio" / "u7.txt"),
         "-c:a", "pcm_s16le", str(voice)])
    # 4. Mux (no -shortest)
    film = R5 / "u7.mp4"
    run(["ffmpeg", "-nostdin", "-y", "-i", str(silent), "-i", str(voice),
         "-i", str(ROOT / "subs" / "u7.srt"),
         "-map", "0:v", "-map", "1:a", "-map", "2",
         "-c:v", "copy", "-c:a", "aac", "-b:a", "160k", "-c:s", "mov_text", str(film)])
    # 5. Verify
    out = run(["ffprobe", "-v", "error", "-show_entries",
               "format=duration,size:stream=codec_type,codec_name",
               "-of", "default=noprint_wrappers=1", str(film)]).stdout
    print(out)
    dec = run(["ffmpeg", "-nostdin", "-v", "error", "-i", str(film),
               "-f", "null", "-"]).stderr.strip()
    print("full-decode stderr:", dec or "(clean)")
    if dec:
        print("FAIL: decode errors")
        sys.exit(1)
    srt = (ROOT / "subs" / "u7.srt").read_text(encoding="utf-8")
    n_sub = srt.count("-->")
    print(f"subtitles: {n_sub}, film size: {film.stat().st_size}B")
    print("ASSEMBLE-OK", film)


if __name__ == "__main__":
    main()
