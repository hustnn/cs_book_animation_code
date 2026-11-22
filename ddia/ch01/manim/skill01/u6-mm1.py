"""U6 Manim 场景 1（b6–b8）：M/M/1 平均等待随利用率上升的示意曲线。

分镜：ch01/skill-ch01/ch01-beats.md U6 一节；原文：DDIA §1.9（书页 p15–16）只说了“排队延迟在高百分位
占大头”，没有给出曲线——这条是示意模型（inventory N1），画面角落标“示意模型”，旁白点明。
曲线是归一化平均等待 W = 1 / (1 − ρ)（单位 1/μ），只讲“利用率越高、排队等得越久”这一个直觉：
ρ = 0.8 处画虚线标“经验阈值”，并明确标“≠ 拐点”（1/(1−ρ) 处处是凸的，没有拐点）；
绝不用这条平均值曲线讲尾部百分位（b8 把曲线淡出、换成尾部柱状图，两者分开）。

渲染（在 manim/ 目录下）：
  .venv/bin/manim -qm skill01/u6-mm1.py U6Utilization
产物：media/videos/u6-mm1/720p30/U6Utilization.mp4（1280x720 30fps）
"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from manim import *  # noqa: F401,F403
from beats import Beats
from theme import T, txt

config.background_color = T.bg

ANCHOR_Y = -3.55


class U6Utilization(Scene):
    def construct(self):
        self.camera.background_color = T.bg
        b = Beats(self, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "skill-ch01", "timeline", "u6.json"))

        anchor = txt("利用率越高，等得越久", 26, T.text).move_to([0, ANCHOR_Y, 0])
        self.add(anchor)

        def say(text):
            anchor.become(txt(text, 26, T.text).move_to([0, ANCHOR_Y, 0]))

        # ---------- 坐标系：ρ 0–1，归一化平均等待 0–10 ----------
        ax = Axes(
            x_range=[0, 1, 0.5], y_range=[0, 10, 5],
            x_length=9, y_length=4.5,
            axis_config={"color": T.line}, tips=False,
        ).move_to([0, -0.2, 0])
        ticks = VGroup(*[
            txt(lab, 20, T.muted).move_to(ax.c2p(xv, 0) + DOWN * 0.4)
            for xv, lab in [(0, "0"), (0.5, "0.5"), (1, "1")]] + [
            txt(lab, 20, T.muted).move_to(ax.c2p(0, yv) + LEFT * 0.7)
            for yv, lab in [(0, "0"), (5, "5"), (10, "10")]])
        xlabel = txt("利用率 ρ", 22, T.muted).move_to(ax.c2p(1, 0) + DOWN * 0.85 + RIGHT * 0.3)
        ylabel = txt("平均等待（倍）", 22, T.muted).move_to(ax.c2p(0, 10) + UP * 0.4 + LEFT * 0.3)
        curve = ax.plot(lambda x: 1 / (1 - x), x_range=[0, 0.9, 0.01], color=T.yellow)
        formula = txt("平均等待 = 1 / (1 − ρ)", 28, T.text).move_to([0, 3.3, 0])
        derived = txt("示意模型", 22, T.purple).to_corner(UR, buff=0.4)

        # ---------- b6：利用率越高，排队等得越久 ----------
        say("利用率越高，等得越久")
        with b.beat("b6"):
            self.play(Create(ax), FadeIn(ticks), FadeIn(xlabel), FadeIn(ylabel), run_time=1.2)
            self.play(Create(curve), run_time=2.2)
            self.play(FadeIn(formula, shift=DOWN * 0.15), FadeIn(derived), run_time=0.6)

        # ---------- b7：ρ=0.8 经验阈值，不是拐点 ----------
        say("0.8 是经验阈值")
        vline = DashedLine(
            [ax.c2p(0.8, 0)[0], ax.c2p(0, 0)[1], 0],
            [ax.c2p(0.8, 5)[0], ax.c2p(0, 5)[1], 0],
            color=T.yellow, stroke_width=3)
        dot80 = Dot(ax.c2p(0.8, 5), color=T.red, radius=0.12)
        tag80 = txt("0.8 经验阈值", 24, T.yellow).move_to(ax.c2p(0.8, 5) + UP * 0.55 + LEFT * 1.2)
        not_inflect = txt("≠ 拐点", 24, T.red).move_to(ax.c2p(0.8, 5) + DOWN * 0.6 + RIGHT * 1.3)
        dot_end = Dot(ax.c2p(0.9, 10), color=T.red, radius=0.12)
        readout7 = txt("ρ = 0.8 → 5 倍；ρ = 0.9 → 10 倍", 24, T.yellow).move_to([0, 2.75, 0])
        with b.beat("b7"):
            self.play(Create(vline), run_time=1.2)
            self.play(FadeIn(dot80), FadeIn(tag80), run_time=0.8)
            # 点沿曲线从 0.8 滑到 0.9：过了阈值，等待涨得特别快（5 → 10）
            self.play(dot80.animate.move_to(ax.c2p(0.9, 10)), run_time=2.2, rate_func=linear)
            self.play(FadeIn(readout7, shift=DOWN * 0.15), FadeIn(not_inflect), run_time=0.8)
            self.play(FadeOut(formula), run_time=0.5)

        # ---------- b8：平均 ≠ 尾部——曲线淡出，尾部柱状图淡入 ----------
        say("平均 ≠ 尾部")
        bars_group = VGroup()
        heights = [0.7, 1.0, 0.9, 1.4, 2.6, 3.6]
        for i, h in enumerate(heights):
            bar = Rectangle(
                width=0.9, height=h, fill_color=T.red if i >= 4 else T.blue,
                fill_opacity=0.9, stroke_width=0,
            )
            bar.move_to([-4.5 + i * 1.8, -2.0 + h / 2.0, 0])
            bars_group.add(bar)
        bar_label = txt("尾部百分位", 26, T.red).move_to([0, 2.2, 0])
        neq = txt("平均 ≠ 尾部", 32, T.text).move_to([0, 2.95, 0])
        with b.beat("b8"):
            self.play(
                FadeOut(ax), FadeOut(ticks), FadeOut(xlabel), FadeOut(ylabel),
                FadeOut(curve), FadeOut(vline), FadeOut(dot80), FadeOut(tag80),
                FadeOut(not_inflect), FadeOut(readout7), FadeOut(derived),
                run_time=0.8)
            self.play(
                LaggedStart(*[GrowFromEdge(bar, DOWN) for bar in bars_group],
                           lag_ratio=0.15, run_time=3.5),
            )
            self.play(FadeIn(bar_label, shift=DOWN * 0.15), FadeIn(neq, shift=DOWN * 0.15), run_time=1.0)

        # ---------- 段尾补足（照 U5 的做法） ----------
        target = sum(b.durations[f"b{i}"] for i in range(6, 9))
        remaining = target - self.time
        if remaining > 1 / 30:
            self.wait(remaining)
