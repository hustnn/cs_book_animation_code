#!/usr/bin/env python3
"""Assemble U14 r4 unit film from the 3 rendered scenes + voice + subtitles.

r4 只加站牌：mc1 重渲（含新首拍 n0），mc2/mc3 沿用 r3 渲染（内容未动，
时长不变：mc2 68.73s / mc3 51.90s）。由 assemble-u8-r7.py 改编，只改轮次
与期望值。

Run from ~/workspace/ddia-animation-demo/ch03/skill-ch03, under the render lock:
  export RENDER_LOCK_PATH=~/workspace/ddia-animation-demo/.render-lock
  python ~/workspace/custom-skills/textbook-to-animation/scripts/render_lock.py \
    run u14-assemble-r4 -- python assemble-u14-r4.py

Steps (skill references/motion-canvas.md §6):
1. Pre-flight: each scene mp4's video-track duration must match its container
   duration and its frame count must match duration x 30fps (a truncated scene
   file can hide behind a full-length audio track).
2. Concat the 3 scene videos (re-encode, no -shortest) -> rounds/u14/r4/u14-silent.mp4
3. Concat the voice wavs per audio/u14.txt -> rounds/u14/r4/u14-voice.wav
4. Mux silent + voice + subs/u14.srt (mov_text soft subtitles) -> rounds/u14/r4/u14.mp4
5. Verify: ffprobe duration/size/streams, full-decode 0 errors, subtitle count.
"""
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent  # skill-ch03/
MC = ROOT.parent / "motion-canvas"
R4 = ROOT / "rounds" / "u14" / "r4"
SCENES = ["u14-mc1", "u14-mc2", "u14-mc3"]


def run(cmd, **kw):
    r = subprocess.run(cmd, capture_output=True, text=True, **kw)
    if r.returncode != 0:
        print("FAIL:", " ".join(str(c) for c in cmd))
        print(r.stdout[-2000:])
        print(r.stderr[-2000:])
        sys.exit(1)
    return r


def probe(path):
    out = run(["ffprobe", "-v", "error", "-show_entries",
               "format=duration:stream=duration,nb_frames,codec_type",
               "-of", "csv=p=0", str(path)]).stdout.strip().splitlines()
    # csv=p=0 行不带节名：单字段行是 format duration，多字段行是 stream
    vals = {"format": [], "stream": []}
    for line in out:
        parts = line.split(",")
        if len(parts) == 1:
            vals["format"].append([parts[0]])
        else:
            vals["stream"].append(parts)
    return vals


def main():
    R4.mkdir(parents=True, exist_ok=True)
    # 1. Pre-flight on scene files
    total_frames = 0
    for s in SCENES:
        p = MC / "output" / f"{s}.mp4"
        if not p.exists() or p.stat().st_size == 0:
            print(f"FAIL: missing/empty scene file {p}")
            sys.exit(1)
        vals = probe(p)
        dur = float(vals["format"][0][0]) if "format" in vals else None
        print(f"{s}: {p.stat().st_size}B container={dur}s")
        out = run(["ffprobe", "-v", "error", "-select_streams", "v:0",
                   "-show_entries", "stream=duration,nb_frames,r_frame_rate",
                   "-of", "default=noprint_wrappers=1", str(p)]).stdout
        d = dict(line.split("=", 1) for line in out.strip().splitlines() if "=" in line)
        vdur, nframes = float(d["duration"]), int(d["nb_frames"])
        expect = round(vdur * 30)
        print(f"  video dur={vdur}s frames={nframes} expect~{expect}")
        if abs(vdur - dur) > 0.05:
            print(f"FAIL: {s} video-track duration != container duration")
            sys.exit(1)
        if abs(nframes - expect) > 2:
            print(f"FAIL: {s} frame count {nframes} != duration x 30fps ({expect})")
            sys.exit(1)
        total_frames += nframes

    # 2. Concat video
    vlist = R4 / "u14-video.txt"
    vlist.write_text("".join(f"file '{MC / 'output' / (s + '.mp4')}'\n" for s in SCENES))
    silent = R4 / "u14-silent.mp4"
    run(["ffmpeg", "-nostdin", "-y", "-f", "concat", "-safe", "0", "-i", str(vlist),
         "-c:v", "libx264", "-crf", "18", "-pix_fmt", "yuv420p", "-r", "30", "-an", str(silent)])
    # 3. Concat voice
    voice = R4 / "u14-voice.wav"
    run(["ffmpeg", "-nostdin", "-y", "-f", "concat", "-safe", "0", "-i", str(ROOT / "audio" / "u14.txt"),
         "-c:a", "pcm_s16le", str(voice)])
    # 4. Mux (no -shortest)
    film = R4 / "u14.mp4"
    run(["ffmpeg", "-nostdin", "-y", "-i", str(silent), "-i", str(voice),
         "-i", str(ROOT / "subs" / "u14.srt"),
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
    srt = (ROOT / "subs" / "u14.srt").read_text(encoding="utf-8")
    n_sub = srt.count("-->")
    print(f"subtitles: {n_sub}, film size: {film.stat().st_size}B")
    print("ASSEMBLE-OK", film)


if __name__ == "__main__":
    main()
