"""旁白驱动的时间轴（Manim 版）。复制到 manim/beats.py。

用法：
    b = Beats(self, "timeline/tail-latency.json")   # 或 Beats(self, beats=[{"id": "b1", "text": "…"}])
    with b.beat("b1"):
        self.play(Create(ax), run_time=1.2)      # with 块结束时自动补等到 b1 的音频时长

timeline 来自 scripts/audio_timeline.py：{"beats": [{"id", "dur", "text"}]}。
没有 dur 时按字数估算（约每秒 4.5 个汉字），先把节奏搭起来，有音频后自动替换。
依赖 Scene.time（Manim CE 0.22 起可用）。
"""
import json
import logging
import re
from contextlib import contextmanager

CJK_PER_SEC = 4.5
PAD = 0.35  # 与 audio_timeline.py 的 --pad 一致
MIN_WAIT = 1 / 30  # 少于一帧就不等

log = logging.getLogger("beats")


def estimate_duration(text=""):
    cjk = len(re.findall(r"[㐀-鿿豈-﫿]", text))
    words = len(re.findall(r"[A-Za-z0-9.%]+", text))
    return (cjk + words * 1.5) / CJK_PER_SEC + PAD


class Beats:
    def __init__(self, scene, timeline_path=None, beats=None):
        if timeline_path:
            with open(timeline_path, encoding="utf-8") as f:
                data = json.load(f)
            beats = data["beats"] if isinstance(data, dict) else data
        if beats is None:
            raise ValueError("需要 timeline_path 或 beats")
        self.scene = scene
        self.durations = {
            b["id"]: b["dur"] if b.get("dur") is not None else estimate_duration(b.get("text", ""))
            for b in beats
        }

    @contextmanager
    def beat(self, beat_id):
        if beat_id not in self.durations:
            raise KeyError(f'beat "{beat_id}" 不在 timeline 里（有：{", ".join(self.durations)}）')
        dur = self.durations[beat_id]
        start = self.scene.time
        yield
        spent = self.scene.time - start
        if spent > dur + 0.05:
            log.warning("beat %s: 动画 %.2fs > 旁白 %.2fs，已顺延", beat_id, spent, dur)
        if dur - spent >= MIN_WAIT:
            self.scene.wait(dur - spent)
