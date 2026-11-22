"""U6 Manim 场景 2（b20–b21）：1 − 0.99^N 曲线——扇出 N 个后端，至少撞上一个慢调用的概率。

分镜：skill-ch01/ch01-beats.md U6 一节；原文：DDIA §1.9 “Percentiles in Practice”小框（书页 p16）
只给了定性说法（“调用越多越容易撞上”），这条曲线是引申（inventory N3），画面角落标“引申”，
旁白说明“假设每个后端独立、慢概率都是 1%”。
读数按整数 N 步进（照 U5 b23 的做法：阶梯 rate_func，中间帧永不出现错误配对）：
N=10 → 10%、N=25 → 22%、N=50 → 39%、N=75 → 53%、N=100 → 63%（运行时现算）。

渲染（在 manim/ 目录下）：
  .venv/bin/manim -qm skill01/u6-amplification.py U6Amplification
产物：media/videos/u6-amplification/720p30/U6Amplification.mp4（1280x720 30fps）
"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from manim import *  # noqa: F401,F403
from beats import Beats
from theme import T, txt

config.background_color = T.bg

ANCHOR_Y = -3.55


class U6Amplification(Scene):
    def construct(self):
        self.camera.background_color = T.bg
        b = Beats(self, "/home/hatch/workspace/ddia-animation-demo/skill-ch01/timeline/u6.json")

        anchor = txt("N=100，约 63%", 26, T.text).move_to([0, ANCHOR_Y, 0])
        self.add(anchor)

        def say(text):
            anchor.become(txt(text, 26, T.text).move_to([0, ANCHOR_Y, 0]))

        # ---------- 坐标系：N 0–100，P 0–100% ----------
        ax = Axes(
            x_range=[0, 100, 50], y_range=[0, 1, 0.5],
            x_length=9, y_length=4.5,
            axis_config={"color": T.line}, tips=False,
        ).move_to([0, -0.2, 0])
        ticks = VGroup(*[
            txt(lab, 20, T.muted).move_to(ax.c2p(xv, 0) + DOWN * 0.4)
            for xv, lab in [(0, "0"), (50, "50"), (100, "100")]] + [
            txt(lab, 20, T.muted).move_to(ax.c2p(0, yv) + LEFT * 0.7)
            for yv, lab in [(0, "0"), (0.5, "50%"), (1, "100%")]])
        xlabel = txt("扇出后端数 N", 22, T.muted).move_to(ax.c2p(100, 0) + DOWN * 0.85 + LEFT * 0.5)
        ylabel = txt("至少撞上一个慢调用", 22, T.muted).move_to(ax.c2p(0, 1) + UP * 0.4 + LEFT * 0.2)
        n_tracker = ValueTracker(1)
        curve = always_redraw(lambda: ax.plot(
            lambda x: 1 - 0.99 ** x,
            x_range=[1, max(1.5, n_tracker.get_value()), 0.5],
            color=T.yellow))
        dot = always_redraw(lambda: Dot(
            ax.c2p(n_tracker.get_value(), 1 - 0.99 ** n_tracker.get_value()),
            color=T.red, radius=0.11))
        readout = always_redraw(lambda: txt(
            f"N = {n_tracker.get_value():.0f}   P(至少一个慢) = {1 - 0.99 ** n_tracker.get_value():.0%}",
            26, T.yellow).move_to([0, 3.3, 0]))
        # r2（新发现 P2）：原位置 [-4.2, 2.7] 与 y 轴标签“至少撞上一个慢调用”重叠
        # （b20 中点帧：两行字叠在一起）；移到曲线右上空白处，远离 y 轴标签与顶部读数。
        curve_label = txt("1 − 0.99ᴺ", 28, T.text).move_to([1.8, 2.2, 0])
        derived = txt("引申", 22, T.purple).to_corner(UR, buff=0.4)

        # ---------- b20：假设每个后端独立，扇出 N 个，至少撞上一个慢调用的概率是 1 − 0.99^N ----------
        say("N=100，约 63%")
        with b.beat("b20"):
            self.play(Create(ax), FadeIn(ticks), FadeIn(xlabel), FadeIn(ylabel), run_time=1.0)
            self.add(curve, dot, readout)
            self.play(FadeIn(curve_label), FadeIn(derived), run_time=0.5)
            # 整数 N 步进：只在 N=10/25/50/75/100 处更新读数（10%/22%/39%/53%/63%）
            for n in (10, 25, 50, 75, 100):
                self.play(n_tracker.animate.set_value(n), run_time=0.2,
                          rate_func=lambda t: 1.0 if t >= 1 else 0.0)
                self.wait(0.8)

        # ---------- b21：调用 100 个后端，撞上慢调用的概率超过六成 ----------
        say("N=100，超过六成")
        big = txt("N = 100，超过六成", 34, T.red).move_to([0, 2.7, 0])
        tail_note = txt("扇出越多，尾巴越长", 26, T.text).move_to([0, 2.05, 0])
        with b.beat("b21"):
            self.play(FadeOut(curve_label), FadeIn(big, shift=DOWN * 0.15), run_time=0.7)
            self.play(Indicate(dot, scale_factor=1.6), run_time=1.0)
            # 对照：点沿曲线滑回 N=7（概率约 7%），再滑回 N=100（约 63%）——扇出越多，概率越高
            self.play(n_tracker.animate.set_value(7), run_time=1.5, rate_func=linear)
            self.play(n_tracker.animate.set_value(100), run_time=1.5, rate_func=linear)
            self.play(FadeIn(tail_note, shift=DOWN * 0.15), run_time=0.6)

        # ---------- 段尾补足（照 U5 的做法） ----------
        target = sum(b.durations[f"b{i}"] for i in range(20, 22))
        remaining = target - self.time
        if remaining > 1 / 30:
            self.wait(remaining)
