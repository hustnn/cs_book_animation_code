#!/usr/bin/env python3
"""Assemble U0 r4 unit film from the single rendered scene + voice + subtitles.

Run from ~/workspace/ddia-animation-demo/ch03/skill-ch03, under the render lock:
  export RENDER_LOCK_PATH=~/workspace/ddia-animation-demo/.render-lock
  python ~/workspace/custom-skills/textbook-to-animation/scripts/render_lock.py \
    run u0-assemble-r4 -- python assemble-u0-r4.py

Steps (skill references/motion-canvas.md §6):
1. Pre-flight: scene mp4's video-track duration must match its container
   duration and its frame count must match duration x 30fps (a truncated scene
   file can hide behind a full-length audio track).
2. Copy scene video -> rounds/u0/r4/u0-silent.mp4
3. Concat the voice wavs per audio/u0.txt -> rounds/u0/r4/u0-voice.wav
4. Mux silent + voice + subs/u0.srt (mov_text soft subtitles) -> rounds/u0/r4/u0.mp4
5. Verify: ffprobe duration/size/streams, full-decode 0 errors, subtitle count.
"""
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent  # skill-ch03/
MC = ROOT.parent / "motion-canvas"
R4 = ROOT / "rounds" / "u0" / "r4"


def run(cmd, **kw):
    r = subprocess.run(cmd, capture_output=True, text=True, **kw)
    if r.returncode != 0:
        print("FAIL:", " ".join(str(c) for c in cmd))
        print(r.stdout[-2000:])
        print(r.stderr[-2000:])
        sys.exit(1)
    return r


def probe(path):
    import json
    out = run(["ffprobe", "-v", "error", "-show_entries",
               "format=duration:stream=duration,nb_frames,codec_type",
               "-of", "json", str(path)]).stdout
    d = json.loads(out)
    return d  # {"format": {"duration": ...}, "streams": [{...}, ...]}


def main():
    R4.mkdir(parents=True, exist_ok=True)
    # 1. Pre-flight on scene file
    p = MC / "output" / "u0-mc1.mp4"
    if not p.exists() or p.stat().st_size == 0:
        print(f"FAIL: missing/empty scene file {p}")
        sys.exit(1)
    vals = probe(p)
    dur = float(vals["format"]["duration"])
    vstream = [s for s in vals["streams"] if s["codec_type"] == "video"][0]
    vdur = float(vstream["duration"])
    nframes = int(vstream["nb_frames"])
    print(f"u0-mc1: {p.stat().st_size}B container={dur}s video-track={vdur}s frames={nframes}")
    if abs(dur - vdur) > 0.5:
        print(f"FAIL: container/video duration mismatch {dur} vs {vdur}")
        sys.exit(1)
    if abs(nframes - dur * 30) > 2:
        print(f"FAIL: frame count {nframes} != duration*30 ({dur * 30:.1f})")
        sys.exit(1)
    # 2. Silent copy
    silent = R4 / "u0-silent.mp4"
    run(["cp", str(p), str(silent)])
    print(f"silent: {silent} {silent.stat().st_size}B")
    # 3. Voice concat
    voice = R4 / "u0-voice.wav"
    run(["ffmpeg", "-nostdin", "-y", "-f", "concat", "-safe", "0", "-i",
         str(ROOT / "audio" / "u0.txt"), "-c", "copy", str(voice)])
    vvals = probe(voice)
    print(f"voice: {voice} {voice.stat().st_size}B duration={vvals['format']['duration']}s")
    # 4. Mux (no -shortest: subtitle stream ends first, would truncate audio)
    film = R4 / "u0.mp4"
    run(["ffmpeg", "-nostdin", "-y", "-i", str(silent), "-i", str(voice),
         "-i", str(ROOT / "subs" / "u0.srt"),
         "-map", "0:v", "-map", "1:a", "-map", "2:s",
         "-c:v", "copy", "-c:a", "aac", "-c:s", "mov_text",
         "-metadata:s:s:0", "language=zho", str(film)])
    # 5. Verify
    fvals = probe(film)
    fdur = float(fvals["format"]["duration"])
    print(f"film: {film} {film.stat().st_size}B duration={fdur}s streams={[s['codec_type'] for s in fvals['streams']]}")
    nsub = sum(1 for line in (ROOT / "subs" / "u0.srt").read_text(encoding="utf-8").splitlines()
               if line.strip().isdigit())
    print(f"subtitle cues in srt: {nsub}")
    r = subprocess.run(["ffmpeg", "-nostdin", "-v", "error", "-i", str(film), "-f", "null", "-"],
                       capture_output=True, text=True)
    if r.returncode != 0 or r.stderr.strip():
        print("FAIL: full decode errors:", r.stderr[-2000:])
        sys.exit(1)
    print("decode: 0 errors")
    print("OK")


if __name__ == "__main__":
    main()
