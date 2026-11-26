#!/usr/bin/env python3
"""Assemble U15 r5 unit film from the 3 rendered scenes + voice + subtitles.

Run from ~/workspace/ddia-animation-demo/ch03/skill-ch03, under the render lock:
  export RENDER_LOCK_PATH=~/workspace/ddia-animation-demo/.render-lock
  python ~/workspace/custom-skills/textbook-to-animation/scripts/render_lock.py \\
    run u15-assemble-r5 -- python assemble-u15-r5.py

Steps (skill references/motion-canvas.md §6, same pattern as assemble-u4-r3.py):
1. Pre-flight: each scene mp4's video-track duration must match its container
   duration and its frame count must match duration x 30fps.
2. Concat the 3 scene videos (re-encode, no -shortest) -> rounds/u15/r5/u15-silent.mp4
3. Concat the voice wavs per audio/u15.txt -> rounds/u15/r5/u15-voice.wav
4. Mux silent + voice + subs/u15.srt (mov_text soft subtitles) -> rounds/u15/r5/u15.mp4
5. Verify: ffprobe duration/size/streams, full-decode 0 errors, subtitle count.
"""
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent  # skill-ch03/
MC = ROOT.parent / "motion-canvas"
R5 = ROOT / "rounds" / "u15" / "r5"
STAGE = R5 / "stage"  # r5：拼装只用渲染后立即拷好的 stage 副本，不直接读 motion-canvas/output
SCENES = ["u15-mc1", "u15-mc2", "u15-mc3"]


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
    # 1. Pre-flight on scene files
    total_frames = 0
    for s in SCENES:
        p = STAGE / f"{s}.mp4"
        if not p.exists() or p.stat().st_size == 0:
            print(f"FAIL: missing/empty scene file {p}")
            sys.exit(1)
        # container duration (bare float line with csv=p=0) + video stream
        dur = float(run(["ffprobe", "-v", "error", "-show_entries",
                         "format=duration", "-of", "csv=p=0", str(p)]).stdout.strip())
        print(f"{s}: {p.stat().st_size}B container={dur}s")
        out2 = run(["ffprobe", "-v", "error", "-select_streams", "v:0",
                    "-show_entries", "stream=duration,nb_frames,r_frame_rate",
                    "-of", "default=noprint_wrappers=1", str(p)]).stdout
        d = dict(line.split("=", 1) for line in out2.strip().splitlines() if "=" in line)
        vdur, nframes = float(d["duration"]), int(d["nb_frames"])
        expect = round(vdur * 30)
        print(f"  video dur={vdur}s frames={nframes} expect~{expect}")
        if abs(vdur - dur) > 0.05:
            print(f"FAIL: {s} video-track duration != container duration")
            sys.exit(1)
        if abs(nframes - expect) > 2:
            print(f"FAIL: {s} frame count {nframes} != duration x 30fps ({expect})")
            sys.exit(1)
        dec = run(["ffmpeg", "-nostdin", "-v", "error", "-i", str(p),
                   "-f", "null", "-"]).stderr.strip()
        if dec:
            print(f"FAIL: {s} full-decode errors: {dec[:500]}")
            sys.exit(1)
        print(f"  full-decode clean")
        total_frames += nframes

    # 2. Concat video
    vlist = R5 / "u15-video.txt"
    vlist.write_text("".join(f"file '{STAGE / (s + '.mp4')}'\n" for s in SCENES))
    silent = R5 / "u15-silent.mp4"
    run(["ffmpeg", "-nostdin", "-y", "-f", "concat", "-safe", "0", "-i", str(vlist),
         "-c:v", "libx264", "-crf", "18", "-pix_fmt", "yuv420p", "-r", "30", "-an", str(silent)])
    # 3. Concat voice
    voice = R5 / "u15-voice.wav"
    run(["ffmpeg", "-nostdin", "-y", "-f", "concat", "-safe", "0", "-i", str(ROOT / "audio" / "u15.txt"),
         "-c:a", "pcm_s16le", str(voice)])
    # 4. Mux (no -shortest)
    film = R5 / "u15.mp4"
    run(["ffmpeg", "-nostdin", "-y", "-i", str(silent), "-i", str(voice),
         "-i", str(ROOT / "subs" / "u15.srt"),
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
    srt = (ROOT / "subs" / "u15.srt").read_text(encoding="utf-8")
    n_sub = srt.count("-->")
    print(f"subtitles: {n_sub}, film size: {film.stat().st_size}B, total scene frames: {total_frames}")
    print("ASSEMBLE-OK", film)


if __name__ == "__main__":
    main()
