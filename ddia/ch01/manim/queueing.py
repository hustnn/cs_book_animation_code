"""DDIA Ch.1 排队论：利用率 rho -> 延迟爆炸 (Manim demo)

渲染：
  低质迭代：.venv/bin/manim -pql queueing.py UtilizationLatency
  定稿：    .venv/bin/manim -pqm queueing.py UtilizationLatency
产物：media/videos/queueing/720p30/UtilizationLatency.mp4

公式路线：本机无 LaTeX，MathTex 不可用。本文件用 Pango Text 写
Unicode 公式（T = 1 / (mu - lambda)），中文用 Noto Serif CJK SC，
不依赖 LaTeX / Typst，渲染可复现。分数用斜杠写法，画面上足够清晰。
"""
from manim import *

# 统一视觉
BG = "#0F172A"
BLUE = "#38BDF8"
YELLOW = "#FBBF24"
RED = "#F87171"
FONT = "Noto Serif CJK SC"

config.background_color = BG


def C(text, size=32, color=WHITE, weight=BOLD):
    return Text(text, font=FONT, font_size=size, color=color, weight=weight)


def C2(text, size=28, color=WHITE):
    return Text(text, font=FONT, font_size=size, color=color)


class UtilizationLatency(Scene):
    def construct(self):
        self.camera.background_color = BG

        # ---------- 1. 标题 ----------
        title = C("排队论：利用率越高，延迟越高", size=36)
        subtitle = C2("第 1 章 · 可靠性与可扩展性", size=26, color=BLUE)
        subtitle.next_to(title, DOWN, buff=0.4)
        self.play(Write(title), run_time=1.5)
        self.play(FadeIn(subtitle, shift=UP * 0.2), run_time=1)
        self.wait(0.8)
        self.play(FadeOut(title), FadeOut(subtitle), run_time=0.8)

        # ---------- 2. 公式 ----------
        # M/M/1 平均响应时间，mu=1 归一化
        eq1 = C("T = 1 / (μ − λ)", size=48, color=BLUE)
        eq1_note = C2("平均响应时间 = 1 /（服务率 − 到达率）", size=26)
        eq1_note.next_to(eq1, DOWN, buff=0.5)
        self.play(Write(eq1), run_time=1.5)
        self.play(FadeIn(eq1_note, shift=UP * 0.2), run_time=0.8)
        self.wait(0.8)

        eq2 = C("T = 1 / (μ (1 − ρ))，  ρ = λ / μ", size=42, color=BLUE)
        eq2_note = C2("令利用率 ρ = λ / μ，ρ 越接近 1，分母越接近 0", size=26)
        eq2_note.next_to(eq2, DOWN, buff=0.5)
        self.play(FadeTransform(eq1, eq2), FadeTransform(eq1_note, eq2_note),
                  run_time=1.5)
        self.wait(1.0)
        self.play(FadeOut(eq2), FadeOut(eq2_note), run_time=0.8)

        # ---------- 3. 坐标系 + 曲线 ----------
        ax = Axes(
            x_range=[0, 1, 0.2],
            y_range=[0, 10, 2],
            x_length=9.5,
            y_length=5.2,
            axis_config={"include_tip": True, "color": WHITE},
        )
        ax.shift(DOWN * 0.4)
        # 默认 Axes 只画刻度不标数字；add_coordinates/add_numbers 默认用
        # MathTex（要 LaTeX），所以改用 Pango Text 手写刻度数字
        tick_labels = VGroup()
        for v in [0, 0.2, 0.4, 0.6, 0.8, 1.0]:
            t = C2(f"{v:.1f}", size=20, color=GRAY_B)
            t.next_to(ax.c2p(v, 0), DOWN, buff=0.12)
            tick_labels.add(t)
        for v in [2, 4, 6, 8, 10]:
            t = C2(f"{v}", size=20, color=GRAY_B)
            t.next_to(ax.c2p(0, v), LEFT, buff=0.15)
            tick_labels.add(t)
        x_label = C2("利用率 ρ", size=24)
        x_label.next_to(ax.x_axis, DOWN, buff=0.5)
        y_label = C2("响应时间 T", size=24)
        y_label.next_to(ax.y_axis, UP, buff=0.2)

        # 曲线只画到 x=0.9（此时 T=10 正好到顶）；超过后用“撞顶”表现爆炸
        curve = ax.plot(lambda x: 1 / (1 - x), x_range=[0, 0.9, 0.01],
                        color=BLUE)

        self.play(Create(ax), Write(x_label), Write(y_label),
                  FadeIn(tick_labels, shift=UP * 0.1), run_time=1.5)
        self.play(Create(curve), run_time=1.5)
        self.wait(0.5)

        # ---------- 4. 黄点扫过曲线 ----------
        rho = ValueTracker(0.05)

        def t_of(r):
            return 1 / (1 - r)

        def dot_pos():
            r = rho.get_value()
            # ρ>0.9 后点停在曲线顶端 (0.9, 9.6)，读数继续涨到 33.3，
            # 避免点脱离曲线飘到空白处
            return ax.c2p(min(r, 0.9), min(t_of(r), 9.6))

        dot = always_redraw(lambda: Dot(dot_pos(), color=YELLOW, radius=0.12))
        # 读数固定在左上角，防止跟随点跑出画面
        readout_fixed = always_redraw(
            lambda: C2(f"ρ = {rho.get_value():.2f}    T = {t_of(rho.get_value()):.1f}",
                       size=28, color=YELLOW).to_corner(UL, buff=0.5)
        )
        area = always_redraw(
            lambda: ax.get_area(
                ax.plot(lambda x: 1 / (1 - x),
                        x_range=[0, min(rho.get_value(), 0.9), 0.01]),
                x_range=[0, min(rho.get_value(), 0.9)],
                color=BLUE, opacity=0.22)
        )
        self.add(area, dot, readout_fixed)
        self.play(rho.animate.set_value(0.8), run_time=5, rate_func=smooth)
        self.wait(0.5)

        # ---------- 5. 拐点 rho=0.8 ----------
        knee = DashedLine(ax.c2p(0.8, 0), ax.c2p(0.8, 5), color=RED)
        knee_label = C2("拐点 ρ = 0.8", size=26, color=RED)
        knee_label.next_to(ax.c2p(0.8, 5), UP, buff=0.2)
        self.play(Create(knee), Write(knee_label), run_time=1)
        self.wait(0.8)

        # ---------- 6. 扫到 0.97，延迟爆炸 ----------
        self.play(rho.animate.set_value(0.97), run_time=5, rate_func=smooth)
        self.wait(0.8)

        # ---------- 7. 收尾 ----------
        closing = VGroup(
            C("利用率接近 1 时，延迟爆炸", size=40),
            C2("不要把系统跑满 —— 留出余量", size=30, color=BLUE),
        ).arrange(DOWN, buff=0.4)
        self.play(
            FadeOut(ax), FadeOut(curve), FadeOut(knee), FadeOut(knee_label),
            FadeOut(tick_labels),
            FadeOut(x_label), FadeOut(y_label),
            FadeOut(area), FadeOut(dot), FadeOut(readout_fixed),
            run_time=1,
        )
        self.play(Write(closing), run_time=2)
        self.wait(2)
