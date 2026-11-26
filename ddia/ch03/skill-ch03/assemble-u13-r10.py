#!/usr/bin/env python3
"""Assemble U13 r10 unit film from the 4 rendered scenes + voice + subtitles.

Run from ~/workspace/ddia-animation-demo/ch03/skill-ch03, under the render lock:
  export RENDER_LOCK_PATH=~/workspace/ddia-animation-demo/.render-lock
  python ~/workspace/custom-skills/textbook-to-animation/scripts/render_lock.py \\
    run u13-assemble-r10 -- python assemble-u13-r10.py

Steps (skill references/motion-canvas.md §6):
1. Pre-flight: each scene mp4's video-track duration must match its container
   duration and its frame count must match duration x 30fps (a truncated scene
   file can hide behind a full-length audio track).
2. Concat the 4 scene videos (re-encode, no -shortest) -> rounds/u13/r10/u13-silent.mp4
3. Concat the voice wavs per audio/u13.txt -> rounds/u13/r10/u13-voice.wav
4. Mux silent + voice + subs/u13.srt (mov_text soft subtitles) -> rounds/u13/r10/u13.mp4
5. Verify: ffprobe duration/size/streams, full-decode 0 errors, subtitle count.
"""
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent  # skill-ch03/
MC = ROOT.parent / "motion-canvas"
R10 = ROOT / "rounds" / "u13" / "r10"
SCENES = ["u13-mc1", "u13-mc2", "u13-mc3", "u13-mc4"]


def run(cmd, **kw):
    r = subprocess.run(cmd, capture_output=True, text=True, **kw)
    if r.returncode != 0:
        print("FAIL:", " ".join(str(c) for c in cmd))
        print(r.stdout[-2000:])
        print(r.stderr[-2000:])
        sys.exit(1)
    return r


def probe(path):
    """ffprobe JSON: {'format': {'duration': ...}, 'streams': [{codec_type, duration, nb_frames}]}."""
    import json
    out = run(["ffprobe", "-v", "error", "-show_entries",
               "format=duration:stream=codec_type,duration,nb_frames",
               "-of", "json", str(path)]).stdout
    return json.loads(out)


def main():
    R10.mkdir(parents=True, exist_ok=True)
    # 1. Pre-flight on scene files
    total_frames = 0
    for s in SCENES:
        p = MC / "output" / f"{s}.mp4"
        if not p.exists() or p.stat().st_size == 0:
            print(f"FAIL: missing/empty scene file {p}")
            sys.exit(1)
        data = probe(p)
        dur = float(data["format"]["duration"])
        vs = [x for x in data["streams"] if x["codec_type"] == "video"][0]
        vdur, nframes = float(vs["duration"]), int(vs["nb_frames"])
        expect = round(vdur * 30)
        print(f"{s}: {p.stat().st_size}B container={dur}s video dur={vdur}s frames={nframes} expect~{expect}")
        if abs(vdur - dur) > 0.05:
            print(f"FAIL: {s} video-track duration != container duration")
            sys.exit(1)
        if abs(nframes - expect) > 2:
            print(f"FAIL: {s} frame count {nframes} != duration x 30fps ({expect})")
            sys.exit(1)
        total_frames += nframes

    # 2. Concat video
    vlist = R10 / "u13-video.txt"
    vlist.write_text("".join(f"file '{MC / 'output' / (s + '.mp4')}'\n" for s in SCENES))
    silent = R10 / "u13-silent.mp4"
    run(["ffmpeg", "-nostdin", "-y", "-f", "concat", "-safe", "0", "-i", str(vlist),
         "-c:v", "libx264", "-crf", "18", "-pix_fmt", "yuv420p", "-r", "30", "-an", str(silent)])
    # 3. Concat voice
    voice = R10 / "u13-voice.wav"
    run(["ffmpeg", "-nostdin", "-y", "-f", "concat", "-safe", "0", "-i", str(ROOT / "audio" / "u13.txt"),
         "-c:a", "pcm_s16le", str(voice)])
    # 4. Mux (no -shortest)
    film = R10 / "u13.mp4"
    run(["ffmpeg", "-nostdin", "-y", "-i", str(silent), "-i", str(voice),
         "-i", str(ROOT / "subs" / "u13.srt"),
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
    srt = (ROOT / "subs" / "u13.srt").read_text(encoding="utf-8")
    n_sub = srt.count("-->")
    print(f"subtitles: {n_sub}, film size: {film.stat().st_size}B")
    print("ASSEMBLE-OK", film)


if __name__ == "__main__":
    main()
