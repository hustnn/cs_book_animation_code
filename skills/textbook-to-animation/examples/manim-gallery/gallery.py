"""技法图库 · Manim（m1–m9）。每个场景用一个真实的小机制演几种 Manim 手法，数据都是具体的：

  TailLatency     ValueTracker + always_redraw（参数驱动曲线和读数）、TransformMatchingShapes（公式改写）、
                  MovingCameraScene（推镜头）              —— 扇出 N 个后端时的尾延迟放大（m1–m3）
  Gossip          Graph（图结构）、ShowPassingFlash（沿边一闪）、MoveAlongPath（沿路径移动）
                                                          —— 流言式广播，一轮翻一倍（m4–m6）
  PercentileSort  LaggedStart（错开的排序动画）、Table（表格高亮）
                                                          —— 平均值和百分位（m7–m9）

全部只用 Pango Text，不需要 LaTeX（Graph 不开 labels，数字不用 DecimalNumber）。
手法说明、适用场景见 references/techniques.md。渲染：python <skill>/scripts/examples.py render manim-gallery --manim <manim>
"""
import json
from pathlib import Path

from manim import (
    DOWN, LEFT, RIGHT, UL, UP, UR, Axes, Create, DashedLine, Dot, FadeIn, FadeOut, GrowFromEdge, Graph, LaggedStart,
    Line, MoveAlongPath, MovingCameraScene, Rectangle, Restore, Scene, ShowPassingFlash, Table, Transform,
    TransformMatchingShapes, ValueTracker, VGroup, always_redraw, linear,
)

from beats import Beats
from theme import T, txt

BEATS = json.loads(Path(__file__).with_name("beats.json").read_text(encoding="utf-8"))


class Frame:
    """每个场景共用的画面骨架：左上角标题、右上角“手法”、底部一句锚点文字。"""

    def __init__(self, scene):
        self.scene = scene
        scene.camera.background_color = T.bg
        scene.add(txt("技法图库 · Manim", 22, T.muted).to_corner(UL, buff=0.35))
        self.tech_m = None
        self.cap_m = None

    def tech(self, s):
        new = txt(f"手法：{s}", 22, T.purple).to_corner(UR, buff=0.35)
        if self.tech_m:
            self.scene.remove(self.tech_m)
        self.scene.add(new)
        self.tech_m = new

    def say(self, s):
        new = txt(s, 30, T.text).to_edge(DOWN, buff=0.45)
        if self.cap_m:
            self.scene.remove(self.cap_m)
        self.scene.add(new)
        self.cap_m = new


class TailLatency(MovingCameraScene):
    def construct(self):
        f = Frame(self)
        b = Beats(self, beats=BEATS)
        ax = Axes(x_range=[0, 100, 20], y_range=[0, 1, 0.2], x_length=8.4, y_length=3.9,
                  axis_config={"color": T.line, "include_tip": False}).shift(LEFT * 1.3 + UP * 0.35)
        ticks = VGroup(*[txt(str(v), 18, T.muted).next_to(ax.c2p(v, 0), DOWN, buff=0.15) for v in (0, 20, 40, 60, 80, 100)],
                       *[txt(f"{int(v * 100)}%", 18, T.muted).next_to(ax.c2p(0, v), LEFT, buff=0.15) for v in (0.2, 0.6, 1.0)])
        names = VGroup(txt("后端个数 N", 20, T.muted).next_to(ax.c2p(100, 0), RIGHT, buff=0.3),
                       txt("至少碰上一个慢的", 20, T.muted).next_to(ax.y_axis, UP, buff=0.2))
        # 一个参数驱动三样东西：曲线画到哪、点在哪、读数是多少
        n = ValueTracker(1)
        p = lambda x: 1 - 0.99 ** x
        curve = always_redraw(lambda: ax.plot(p, x_range=[0, max(0.01, n.get_value())], color=T.red))
        dot = always_redraw(lambda: Dot(ax.c2p(n.get_value(), p(n.get_value())), color=T.red, radius=0.07))
        readout = always_redraw(lambda: txt(f"N = {n.get_value():.0f}    {p(n.get_value()):.0%}", 28, T.yellow)
                                .next_to(ax.c2p(100, 1), UP + LEFT * 0.2, buff=0.1))

        f.tech("ValueTracker + always_redraw")
        f.say("扇出越多，越容易碰上慢的")
        with b.beat("m1"):
            self.play(Create(ax), FadeIn(ticks, names), run_time=1.2)
            self.add(curve, dot, readout)
            self.play(n.animate.set_value(100), run_time=5, rate_func=linear)

        # 公式改写：相同的字形留在原地，不同的部分变形过去
        f.tech("TransformMatchingShapes 公式改写")
        f.say("反过来算：全部都快的概率")
        # 放在曲线上方的空白处：红字压在红线上会读不清
        f1 = txt("P(全部都快) = 0.99ᴺ", 30, T.text).move_to(ax.c2p(38, 0.85))
        f2 = txt("P(至少一个慢) = 1 − 0.99ᴺ", 30, T.red).move_to(ax.c2p(38, 0.85))
        with b.beat("m2"):
            self.play(FadeIn(f1), run_time=0.8)
            self.wait(1.2)
            self.play(TransformMatchingShapes(f1, f2), run_time=1.6)

        f.tech("MovingCameraScene 推镜头")
        f.say("N = 100：六成多的请求变慢")
        target = ax.c2p(100, p(100))
        note = txt("N = 100 → 63%", 20, T.yellow).next_to(target, DOWN, buff=0.3).shift(LEFT * 0.3)
        frame = self.camera.frame
        frame.save_state()
        with b.beat("m3"):
            self.play(FadeOut(f2), frame.animate.scale(0.45).move_to(target + LEFT * 0.6), run_time=1.6)
            self.play(FadeIn(note), run_time=0.6)
            self.wait(1.6)
            self.play(Restore(frame), run_time=1.4)


class Gossip(Scene):
    def construct(self):
        f = Frame(self)
        b = Beats(self, beats=BEATS)
        V = list(range(10))
        ring = [(i, (i + 1) % 10) for i in range(10)]
        E = ring + [(0, 5), (0, 3), (5, 8), (2, 7), (4, 9)]
        g = Graph(V, E, layout="circular", layout_scale=2.5,
                  vertex_config={"radius": 0.2, "color": T.line, "fill_opacity": 1},
                  edge_config={"stroke_color": T.line, "stroke_width": 2}).shift(LEFT * 1.6 + UP * 0.2)
        known = {0}
        count = txt("第 0 轮：知道的节点 1 / 10", 26, T.text).move_to(RIGHT * 4.2 + UP * 1.2)
        tag = txt("延伸 · 原文之外", 18, T.purple).to_corner(UR, buff=0.35).shift(DOWN * 0.5)

        def edge(a, c):
            return g.edges[(a, c)] if (a, c) in g.edges else g.edges[(c, a)]

        def spread(rnd, pairs):
            """这一轮：每个已知节点告诉一个邻居。消息沿边一闪而过，到达的节点变绿。"""
            flashes = []
            for a, c in pairs:
                path = Line(g.vertices[a].get_center(), g.vertices[c].get_center())
                flashes.append(ShowPassingFlash(path.copy().set_stroke(T.yellow, width=8), time_width=0.6))
            self.play(*flashes, run_time=1.2)
            known.update(c for _, c in pairs)
            new_count = txt(f"第 {rnd} 轮：知道的节点 {len(known)} / 10", 26, T.text).move_to(count)
            self.play(*[g.vertices[c].animate.set_fill(T.green) for _, c in pairs], Transform(count, new_count), run_time=0.8)

        f.tech("Graph + MoveAlongPath")
        f.say("流言式广播：每轮告诉一个邻居")
        with b.beat("m4"):
            self.play(Create(g), FadeIn(count, tag), run_time=1.4)
            self.play(g.vertices[0].animate.set_fill(T.green), run_time=0.4)
            msg = Dot(g.vertices[0].get_center(), color=T.yellow, radius=0.1)
            self.add(msg)
            self.play(MoveAlongPath(msg, edge(0, 5).copy()), run_time=1.4)
            self.remove(msg)
            known.add(5)
            self.play(g.vertices[5].animate.set_fill(T.green),
                      Transform(count, txt("第 1 轮：知道的节点 2 / 10", 26, T.text).move_to(count)), run_time=0.6)

        f.tech("ShowPassingFlash 沿边一闪")
        f.say("知道的越多，传得越快")
        with b.beat("m5"):
            spread(2, [(0, 3), (5, 8)])
            spread(3, [(0, 1), (3, 4), (5, 6), (8, 9)])

        f.say("约 log₂N 轮传遍")
        with b.beat("m6"):
            spread(4, [(1, 2), (6, 7)])
            self.play(FadeIn(txt("10 个节点：4 轮\n20 个节点：约 5 轮", 24, T.yellow).next_to(count, DOWN, buff=0.5)), run_time=0.8)


class PercentileSort(Scene):
    def construct(self):
        f = Frame(self)
        b = Beats(self, beats=BEATS)
        ms = [32, 41, 28, 35, 290, 38, 30, 45, 33, 29, 36, 31, 120, 34, 40, 27, 39, 37, 30, 42]  # 固定数据，统计量现算
        srt = sorted(ms)
        mean = sum(ms) / len(ms)
        p50 = (srt[9] + srt[10]) / 2
        p95 = srt[18]
        scale = 4.0 / max(ms)
        x0, step, base = -6.0, 0.4, -2.2
        bars = [Rectangle(width=0.28, height=v * scale, stroke_width=0,
                          fill_color=T.red if v > 100 else T.blue, fill_opacity=1)
                .move_to([x0 + i * step, base + v * scale / 2, 0]) for i, v in enumerate(ms)]
        axis = Line([x0 - 0.3, base, 0], [x0 + 19 * step + 0.3, base, 0], color=T.line)
        mean_y = base + mean * scale
        mean_line = DashedLine([x0 - 0.3, mean_y, 0], [x0 + 19 * step + 0.3, mean_y, 0], color=T.yellow)
        mean_lab = txt(f"平均 {mean:.0f} ms", 20, T.yellow).next_to(mean_line, RIGHT, buff=0.15)

        f.tech("GrowFromEdge + LaggedStart")
        f.say("按到达顺序：平均值被慢请求拉高")
        with b.beat("m7"):
            self.play(Create(axis), run_time=0.5)
            self.play(LaggedStart(*[GrowFromEdge(r, DOWN) for r in bars], lag_ratio=0.12), run_time=3.0)
            self.play(Create(mean_line), FadeIn(mean_lab), run_time=0.8)

        # 排序：每根柱子移到它在有序序列里的位置，错开开始，看得出谁去了哪
        order = sorted(range(len(ms)), key=lambda i: ms[i])
        rank = {i: r for r, i in enumerate(order)}
        f.tech("LaggedStart 排序动画")
        f.say("从快到慢排好：中位数和 p95")
        p50_lab = txt(f"p50 = {p50:.1f} ms", 20, T.green).move_to([x0 + 9.5 * step, base - 0.45, 0])
        # 标在 p95 那根柱子的左上方：右边紧挨着最高的那根，标在正上方会压到它
        p95_lab = txt(f"p95 = {p95} ms", 20, T.red).next_to([x0 + 18 * step - 0.14, base + p95 * scale, 0], LEFT, buff=0.15).shift(UP * 0.15)
        with b.beat("m8"):
            self.play(LaggedStart(*[bars[i].animate.set_x(x0 + rank[i] * step) for i in range(len(ms))], lag_ratio=0.06),
                      run_time=2.6)
            self.play(bars[order[9]].animate.set_fill(T.green), bars[order[10]].animate.set_fill(T.green),
                      FadeIn(p50_lab), run_time=0.8)
            self.play(bars[order[18]].animate.set_fill(T.yellow), FadeIn(p95_lab), run_time=0.8)

        f.tech("Table 表格高亮")
        f.say("中位数看大多数，p95 看慢的那几个")
        table = Table([["平均", f"{mean:.0f} ms"], ["p50", f"{p50:.1f} ms"], ["p95", f"{p95} ms"]],
                      element_to_mobject=lambda s: txt(s, 24, T.text), include_outer_lines=True,
                      line_config={"stroke_color": T.line, "stroke_width": 2}).scale(0.9).move_to(RIGHT * 4.6 + UP * 0.6)
        with b.beat("m9"):
            self.play(Create(table), run_time=1.4)
            for cell, color in (((2, 2), T.green), ((3, 2), T.red)):
                hl = table.get_highlighted_cell(cell, color=color).set_fill(opacity=0.35)
                table.add_to_back(hl)  # 底色放在文字下面
                self.play(FadeIn(hl), run_time=0.6)
