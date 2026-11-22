"""DDIA Ch.1 1.9 后半段：百分位直方图 (Manim)

渲染：
  .venv/bin/manim -pqm ch01/percentiles.py Percentiles
产物：videos/ch01-percentiles.mp4（23 秒，1280x720 30fps）

分镜（ch01-script-v2.md 1.9 节）：100 个请求的响应时间排成直方图，
p50/p95/p99 三条标线依次落下（Figure 1-4 图上只有 mean、median (p50)、
95th、99th 四条线，**没有 p99.9 线**，v2 已删掉），尾部几根柱子标红，
旁注“均值会骗人，尾部才要命”，最后画均值虚线（Figure 1-4 亦有 mean 线）。

数据：Python 随机种子固定（seed 42），右偏对数正态分布
（lognormvariate(mu=4.6, sigma=1.0)），100 个请求按响应时间从快到慢
排成一排矩形；百分位用线性插值（与 numpy.percentile 一致），
运行时算出并显示，数字与画面严格一致。
本机无 LaTeX，中文用 Pango Text（Noto Serif CJK SC），不用 MathTex。
"""
import math
import random

import numpy as np
from manim import *

# 统一视觉（与 queueing.py / quorum.py 一致）
BG = "#0F172A"
BLUE = "#38BDF8"
GREEN = "#34D399"
YELLOW = "#FBBF24"
RED = "#F87171"
GREY = "#94A3B8"
FONT = "Noto Serif CJK SC"

config.background_color = BG


def C(text, size=32, color=WHITE, weight=BOLD):
    return Text(text, font=FONT, font_size=size, color=color, weight=weight)


def C2(text, size=28, color=WHITE):
    return Text(text, font=FONT, font_size=size, color=color)


def percentile(values, p):
    """线性插值百分位，与 numpy.percentile 默认方法一致。"""
    k = (len(values) - 1) * p / 100.0
    f = math.floor(k)
    c = math.ceil(k)
    return values[f] + (values[c] - values[f]) * (k - f)


class Percentiles(Scene):
    def construct(self):
        self.camera.background_color = BG

        # ---------- 数据：固定种子，右偏分布 ----------
        random.seed(42)
        vals = sorted(random.lognormvariate(4.6, 1.0) for _ in range(100))
        p50 = percentile(vals, 50)
        p95 = percentile(vals, 95)
        p99 = percentile(vals, 99)
        p999 = percentile(vals, 99.9)
        mean = float(np.mean(vals))
        vmax = vals[-1]
        # p50 83 / p95 454 / p99 702 / p99.9 974 / 均值 148 / 最大 1004（毫秒）

        # ---------- 几何：100 根柱子从快到慢排开 ----------
        base_y = -2.3
        x0, x1 = -6.9, 6.9
        bar_w = (x1 - x0) / 100.0 * 0.92
        step = (x1 - x0) / 100.0
        scale = 4.2 / vmax  # 最高柱 4.2 单位，顶到 y=1.9
        bars = VGroup()
        for i, v in enumerate(vals):
            h = max(v * scale, 0.03)
            cx = x0 + step * (i + 0.5)
            bar = Rectangle(
                width=bar_w, height=h, fill_color=BLUE, fill_opacity=0.85,
                stroke_width=0,
            )
            bar.move_to([cx, base_y + h / 2.0, 0])
            bars.add(bar)
        baseline = Line([x0, base_y, 0], [x1, base_y, 0], color=WHITE,
                        stroke_width=3)

        header = C2("100 个请求 · 响应时间（毫秒）", size=26, color=BLUE)
        header.to_edge(UP, buff=0.4).to_edge(LEFT, buff=0.5)
        caption = C2("请求按响应时间从快到慢排列", size=22, color=GREY)
        caption.next_to(baseline, DOWN, buff=0.25)

        self.play(Write(header), run_time=0.8)
        self.play(Create(baseline), run_time=0.7)
        self.play(
            LaggedStart(*[GrowFromEdge(b, DOWN) for b in bars],
                       lag_ratio=0.01, run_time=2.5),
        )
        self.play(FadeIn(caption, shift=UP * 0.2), run_time=0.8)
        self.wait(0.2)
        # 小计：0.8 + 0.7 + 2.5 + 0.8 + 0.2 = 5.0

        # ---------- 三条百分位标线依次落下（Figure 1-4：mean、p50、p95、p99，无 p99.9） ----------
        # 标线落在对应名次的柱子上：p50 第 50 根，p95 第 95 根，p99 第 99 根。
        marks = [
            ("p50", p50, 49, BLUE, 2.35, "center"),
            ("p95", p95, 94, GREEN, 2.35, "left"),
            ("p99", p99, 98, YELLOW, 2.95, "right"),
        ]
        for name, value, idx, color, label_y, align in marks:
            cx = x0 + step * (idx + 0.5)
            label = C2(f"{name} = {value:.0f} ms", size=24, color=color)
            if align == "right":
                label.move_to([min(cx, 6.95), label_y, 0], aligned_edge=RIGHT)
            elif align == "left":
                # 标签放在标线左侧，避免与右侧 p99/p99.9 的标线相撞
                label.move_to([cx - 0.2, label_y, 0], aligned_edge=RIGHT)
            else:
                label.move_to([cx, label_y, 0])
            line = DashedLine(
                [cx, label_y - 0.35, 0], [cx, base_y, 0],
                color=color, stroke_width=3, dash_length=0.12,
            )
            self.play(Create(line), run_time=1.2)
            self.play(FadeIn(label, shift=DOWN * 0.15), run_time=0.8)
            self.wait(0.5)
        # 小计：3 × (1.2 + 0.8 + 0.5) = 7.5；累计 12.5

        # ---------- 尾部标红：最慢的 3 根柱子 ----------
        tail = bars[-3:]
        self.play(
            LaggedStart(*[b.animate.set_fill(RED, opacity=0.95)
                          for b in tail], lag_ratio=0.4, run_time=1.2),
        )
        self.wait(0.8)
        # 小计：1.2 + 0.8 = 2.0；累计 14.5

        # ---------- 均值虚线 + 旁注 ----------
        mean_y = base_y + mean * scale
        mean_line = DashedLine(
            [x0, mean_y, 0], [x1, mean_y, 0],
            color=YELLOW, stroke_width=2.5, dash_length=0.15,
        )
        mean_label = C2(f"均值 {mean:.0f} ms", size=22, color=YELLOW)
        mean_label.move_to([x0, mean_y + 0.28, 0], aligned_edge=LEFT)
        self.play(Create(mean_line), run_time=1.0)
        self.play(FadeIn(mean_label, shift=DOWN * 0.15), run_time=0.8)
        note = C("均值会骗人，尾部才要命", size=32, color=RED)
        note.move_to([0, -3.55, 0])
        self.play(Write(note), run_time=1.2)
        self.wait(1.0)
        # 小计：1.0 + 0.8 + 1.2 + 1.0 = 4.0；累计 18.5

        self.wait(2.0)
        # 全片：5.0 + 7.5 + 2.0 + 4.0 + 2.0 = 20.5 秒
