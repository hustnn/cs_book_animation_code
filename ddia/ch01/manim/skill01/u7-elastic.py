"""U7 Manim 场景（b9–b11）：弹性 vs 手动伸缩——负载曲线爬升，自动扩缩容量线紧贴，
手动扩缩是阶梯加余量。

分镜：ch01/skill-ch01/ch01-beats.md U7 一节；原文：DDIA §1.10（书页 p17，PDF p39）。
负载曲线为示意曲线（书里没有这条曲线，只讲了“检测到负载上升自动加资源”与
“人分析容量后决定加机器”两个机制），画面不标具体数值刻度以外的数字，容量线
始终在负载曲线之上（手动阶梯带余量，与分镜一致）。

渲染（在 manim/ 目录下）：
  .venv/bin/manim -qm skill01/u7-elastic.py U7Elastic
产物：media/videos/u7-elastic/720p30/U7Elastic.mp4（1280x720 30fps）
"""
import math
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from manim import *  # noqa: F401,F403
from beats import Beats
from theme import T, txt


def load(x):
    """示意负载曲线：稳步爬升，中间一个不可预测的尖峰。"""
    return 18 + 6 * x + 10 * math.exp(-((x - 6.5) ** 2) / 1.2)


def auto_cap(x):
    """弹性：容量线紧贴负载，只留一点余量。"""
    return load(x) + 6


def manual_cap(x):
    """手动伸缩：阶梯上升，每级都留余量。"""
    if x < 3.5:
        return 45
    if x < 7:
        return 70
    return 95


config.background_color = T.bg


class U7Elastic(Scene):
    def construct(self):
        self.camera.background_color = T.bg
        b = Beats(self, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "skill-ch01", "timeline", "u7.json"))

        title = txt("负载曲线 vs 容量线", 30, T.white, bold=True).to_edge(UP, buff=0.35)
        ax = Axes(
            x_range=[0, 10, 2],
            y_range=[0, 100, 20],
            x_length=10.5,
            y_length=4.6,
            axis_config={"color": T.muted},
            tips=False,
        ).shift(DOWN * 0.3)
        x_title = txt("时间", 22, T.muted).next_to(ax.x_axis, RIGHT, buff=0.15)
        y_title = txt("负载 / 容量", 22, T.muted).next_to(ax.y_axis, UP, buff=0.15)
        # 手写刻度（无 LaTeX）：只标几个锚点
        ticks = VGroup()
        for xv, label in [(0, "0"), (5, "5"), (10, "10")]:
            ticks.add(txt(label, 18, T.muted).next_to(ax.c2p(xv, 0), DOWN, buff=0.12))
        for yv, label in [(0, "0"), (50, "50"), (100, "100")]:
            ticks.add(txt(label, 18, T.muted).next_to(ax.c2p(0, yv), LEFT, buff=0.15))

        load_t = ValueTracker(0.01)
        load_curve = always_redraw(
            lambda: ax.plot(load, x_range=[0, max(0.02, load_t.get_value())], color=T.blue)
        )
        load_label = txt("负载", 24, T.blue, bold=True).move_to(ax.c2p(8.6, 84))
        auto_t = ValueTracker(0.01)
        auto_curve = always_redraw(
            lambda: ax.plot(auto_cap, x_range=[0, max(0.02, auto_t.get_value())], color=T.green)
        )
        auto_label = txt("弹性：自动紧贴", 24, T.green, bold=True).move_to(ax.c2p(4.6, 88))

        man_t = ValueTracker(0.01)
        man_curve = always_redraw(
            lambda: ax.plot(manual_cap, x_range=[0, max(0.02, man_t.get_value())], color=T.yellow)
        )
        man_label = txt("手动：阶梯 + 余量", 24, T.yellow, bold=True).move_to(ax.c2p(2.2, 96))
        step_dots = VGroup(
            *[
                Dot(ax.c2p(x, manual_cap(x)), color=T.yellow, radius=0.09)
                for x in (3.5, 7.0)
            ]
        )
        step_tag = txt("人决定加机器", 22, T.yellow).move_to(ax.c2p(5.2, 38))
        bottom_tag = txt("手动更简单，运维意外也更少", 24, T.text).to_edge(DOWN, buff=0.3)
        derived = txt("示意", 22, T.purple).to_corner(UR, buff=0.4)

        # r2 修（r1 P0 1-11）：三条 always_redraw 曲线必须加进场景才会渲染；
        # r1 版只 self.add() 了标题与坐标轴，曲线画了但从未显示。tracker 初值 0.01，
        # 加进来时只画出原点处极小一段，无视觉影响。
        self.add(title, ax, x_title, y_title, ticks, load_curve, auto_curve, man_curve)

        # b9：负载曲线爬升，弹性容量线自动紧贴上去（两条线同步画出，贴合拍长）
        with b.beat("b9"):
            self.play(
                load_t.animate.set_value(10),
                auto_t.animate.set_value(10),
                run_time=4.2, rate_func=linear,
            )
            self.play(
                FadeIn(load_label, shift=UP * 0.2),
                FadeIn(auto_label, shift=UP * 0.2),
                FadeIn(derived, shift=UP * 0.1),
                run_time=0.5,
            )

        # b10：手动伸缩——人看仪表盘，手动加机器，容量线阶梯上升
        with b.beat("b10"):
            self.play(
                man_t.animate.set_value(10), run_time=3.2, rate_func=linear,
            )
            self.play(
                FadeIn(man_label, shift=UP * 0.2),
                FadeIn(step_dots, shift=UP * 0.1),
                FadeIn(step_tag, shift=UP * 0.2),
                run_time=0.7,
            )

        # b11：两条容量线对比——自动紧贴 vs 手动阶梯加余量
        with b.beat("b11"):
            dot_t = ValueTracker(0.01)
            dot = always_redraw(
                lambda: Dot(ax.c2p(dot_t.get_value(), load(dot_t.get_value())), color=T.white, radius=0.11)
            )
            self.add(dot)
            self.play(dot_t.animate.set_value(10), run_time=5.5, rate_func=linear)
            self.play(FadeIn(bottom_tag, shift=UP * 0.2), run_time=0.8)
