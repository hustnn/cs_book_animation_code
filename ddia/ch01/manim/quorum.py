"""DDIA Ch.5 Quorum 证明：读写集合为什么必相交 (Manim demo)

渲染：
  低质迭代：.venv/bin/manim -pql quorum.py QuorumIntersection
  定稿：    .venv/bin/manim -pqm quorum.py QuorumIntersection
产物：media/videos/quorum/720p30/QuorumIntersection.mp4

公式路线：本机无 LaTeX，MathTex 不可用。复用 queueing.py 的套路：
用 Pango Text 写 Unicode 公式（W + R > N、|W ∩ R| ≥ 1），中文用
Noto Serif CJK SC，不依赖 LaTeX / Typst，渲染可复现。
"""
from manim import *

# 统一视觉（与 queueing.py 一致）
BG = "#0F172A"
BLUE = "#38BDF8"
YELLOW = "#FBBF24"
RED = "#F87171"
GREEN = "#34D399"
PURPLE = "#A78BFA"
FONT = "Noto Serif CJK SC"

config.background_color = BG


def C(text, size=32, color=WHITE, weight=BOLD):
    return Text(text, font=FONT, font_size=size, color=color, weight=weight)


def C2(text, size=28, color=WHITE):
    return Text(text, font=FONT, font_size=size, color=color)


class QuorumIntersection(Scene):
    def construct(self):
        self.camera.background_color = BG

        # ---------- 1. 标题 ----------
        title = C("第 5 章 · Quorum：读写集合为什么必相交", size=34)
        subtitle = C2("复制 · 读到最新值的数学保证", size=26, color=BLUE)
        subtitle.next_to(title, DOWN, buff=0.4)
        self.play(Write(title), run_time=1.5)
        self.play(FadeIn(subtitle, shift=UP * 0.2), run_time=1)
        self.wait(0.8)
        self.play(FadeOut(title), FadeOut(subtitle), run_time=0.8)

        # ---------- 2. 画 5 个节点横排 ----------
        # 节点行放在画面中上部，下方留足空间给标注，避免标注贴到节点上
        header = C2("5 个副本节点，N = 5", size=28, color=BLUE)
        header.to_edge(UP, buff=0.6)
        nodes = VGroup()
        labels = []
        for i in range(5):
            circle = Circle(radius=0.55, color=WHITE, stroke_width=3)
            circle.set_fill(GREY, opacity=0.15)
            label = C(f"N{i + 1}", size=30)
            label.move_to(circle.get_center())
            nodes.add(VGroup(circle, label))
            labels.append(label)
        nodes.arrange(RIGHT, buff=0.7)
        nodes.shift(UP * 1.0)

        self.play(Write(header), run_time=1)
        self.play(LaggedStart(*[Create(n) for n in nodes], lag_ratio=0.4),
                  run_time=2)
        self.wait(0.6)

        # ---------- 3. 写集合 W 逐个亮蓝 ----------
        w_text = C2("写集合  W = {N1, N2, N3}", size=28, color=BLUE)
        w_text.next_to(nodes, UP, buff=0.9)
        self.play(Write(w_text), run_time=1)
        self.play(
            LaggedStart(
                *[nodes[i][0].animate.set_fill(BLUE, opacity=0.85)
                  for i in range(3)],
                lag_ratio=0.6),
            run_time=1.8)
        self.wait(0.6)

        # ---------- 4. 读集合 R 逐个亮红；N3 既在 W 又在 R，变紫 ----------
        r_text = C2("读集合  R = {N3, N4, N5}", size=28, color=RED)
        r_text.next_to(nodes, DOWN, buff=1.0)
        self.play(Write(r_text), run_time=1)
        self.play(
            LaggedStart(
                *[nodes[i][0].animate.set_fill(RED, opacity=0.85)
                  for i in (3, 4)],
                lag_ratio=0.6),
            run_time=1.2)
        # N3 最后变紫：同时属于写集合和读集合
        self.play(nodes[2][0].animate.set_fill(PURPLE, opacity=0.9),
                  run_time=0.8)
        self.wait(0.5)

        # ---------- 5. 高亮交集 N3，标注离节点足够远 ----------
        ring = Circle(radius=0.85, color=YELLOW, stroke_width=5)
        ring.move_to(nodes[2].get_center())
        inter_label = C("交集 N3：一定存着最新值", size=30, color=YELLOW)
        inter_label.next_to(nodes, DOWN, buff=2.0)
        self.play(Create(ring), run_time=0.8)
        self.play(nodes[2].animate.scale(1.15), run_time=0.6)
        self.play(Write(inter_label), run_time=1.2)
        self.wait(1.0)
        self.play(FadeOut(header), FadeOut(w_text), FadeOut(r_text),
                  FadeOut(nodes), FadeOut(ring), FadeOut(inter_label),
                  run_time=0.8)

        # ---------- 6. 公式变形 ----------
        eq1 = C("W + R > N", size=52, color=BLUE)
        eq1_note = C2("写集合 + 读集合 > 节点总数", size=26)
        eq1_note.next_to(eq1, DOWN, buff=0.5)
        self.play(Write(eq1), run_time=1.2)
        self.play(FadeIn(eq1_note, shift=UP * 0.2), run_time=0.8)
        self.wait(0.6)

        eq2 = C("|W ∩ R| ≥ 1", size=52, color=YELLOW)
        eq2_note = C2("两个集合一定相交，至少有 1 个共同节点", size=26)
        eq2_note.next_to(eq2, DOWN, buff=0.5)
        self.play(FadeTransform(eq1, eq2),
                  FadeTransform(eq1_note, eq2_note), run_time=1.5)
        numbers = C2("W = 3，R = 3，N = 5，  3 + 3 = 6 > 5", size=28,
                     color=GREEN)
        numbers.next_to(eq2_note, DOWN, buff=0.6)
        self.play(Write(numbers), run_time=1.2)
        self.wait(1.0)
        self.play(FadeOut(eq2), FadeOut(eq2_note), FadeOut(numbers),
                  run_time=0.8)

        # ---------- 7. 反例一闪：W=2, R=2, N=5 ----------
        counter_title = C("反例：条件不能少", size=36, color=RED)
        counter_title.to_edge(UP, buff=0.7)
        self.play(Write(counter_title), run_time=1)

        small = VGroup()
        for i in range(5):
            circle = Circle(radius=0.45, color=WHITE, stroke_width=3)
            circle.set_fill(GREY, opacity=0.15)
            label = C(f"N{i + 1}", size=26)
            label.move_to(circle.get_center())
            small.add(VGroup(circle, label))
        small.arrange(RIGHT, buff=0.6)
        small.shift(UP * 0.3)
        self.play(LaggedStart(*[Create(n) for n in small], lag_ratio=0.3),
                  run_time=1.5)
        # W={N1,N2} 亮蓝，R={N4,N5} 亮红，N3 灰色：没有交集
        self.play(
            small[0][0].animate.set_fill(BLUE, opacity=0.85),
            small[1][0].animate.set_fill(BLUE, opacity=0.85),
            small[3][0].animate.set_fill(RED, opacity=0.85),
            small[4][0].animate.set_fill(RED, opacity=0.85),
            run_time=1.2)
        cross = C("✕", size=72, color=RED)
        cross.next_to(small, DOWN, buff=0.5)
        counter_note = C2("W = 2，R = 2，N = 5：2 + 2 = 4 < 5，交集可以为空",
                          size=26, color=RED)
        counter_note.next_to(cross, DOWN, buff=0.4)
        self.play(Write(cross), run_time=0.8)
        self.play(Write(counter_note), run_time=1.2)
        self.wait(1.0)
        self.play(FadeOut(counter_title), FadeOut(small),
                  FadeOut(cross), FadeOut(counter_note), run_time=0.8)

        # ---------- 8. 收尾 ----------
        closing = VGroup(
            C("读 Quorum 一定碰到写 Quorum", size=40),
            C2("所以读到最新值", size=30, color=BLUE),
        ).arrange(DOWN, buff=0.4)
        self.play(Write(closing), run_time=2)
        self.wait(2)
