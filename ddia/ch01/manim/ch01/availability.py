"""DDIA Ch.1 1.6 可靠性有多重要：几个 9 换算成每年停机时间 (Manim)

渲染：
  .venv/bin/manim -pqm ch01/availability.py AvailabilityNines
产物：videos/ch01-availability.mp4（45 秒，1280x720 30fps）

分镜（ch01-script.md 1.6 节，一字不改）：
  0-10s   标题卡：“可靠性要做到多好？看业务。”
  10-30s  数字滚动：99.9% -> 0.1% x 8760 小时 -> = 8.76 小时/年；
          随后 99.99% -> = 52.6 分钟/年，两行并排对比。
  30-45s  收尾卡：“每多一个 9，成本翻倍；先定业务能接受的停机时间。”
核对：0.1% x 8760 = 8.76 小时；0.01% x 8760 = 0.876 小时 = 52.6 分钟；
      8.76 小时 = 525.6 分钟，是 52.6 分钟的 10 倍。

公式路线：本机无 LaTeX，MathTex 不可用。中文用 Pango Text（Noto Serif
CJK SC）；数字滚动用 DecimalNumber + ValueTracker，mob_class=Text
（DecimalNumber 默认 mob_class 是 MathTex，会因无 LaTeX 而失败）。
"""
from manim import *

# 统一视觉（与 queueing.py / quorum.py 一致）
BG = "#0F172A"
BLUE = "#38BDF8"
GREEN = "#34D399"
YELLOW = "#FBBF24"
RED = "#F87171"
FONT = "Noto Serif CJK SC"

config.background_color = BG


def C(text, size=32, color=WHITE, weight=BOLD):
    return Text(text, font=FONT, font_size=size, color=color, weight=weight)


def C2(text, size=28, color=WHITE):
    return Text(text, font=FONT, font_size=size, color=color)


class AvailabilityNines(Scene):
    def construct(self):
        self.camera.background_color = BG

        # ---------- 1. 标题卡（0-10s，共 10.0s）----------
        title = C("可靠性要做到多好？看业务。", size=42)
        label = C2("第 1 章 · 1.6  可靠性有多重要", size=26, color=BLUE)
        label.next_to(title, UP, buff=0.5)
        self.play(Write(title), run_time=2.0)
        self.play(FadeIn(label, shift=DOWN * 0.2), run_time=1.0)
        self.wait(6.0)
        self.play(FadeOut(title), FadeOut(label), run_time=1.0)
        # 小计：2.0 + 1.0 + 6.0 + 1.0 = 10.0

        # ---------- 2. 数字滚动，两行对比（10-30s，共 20.0s）----------
        # 第 1 行：99.9% -> 0.1% x 8760 小时 = 8.76 小时/年
        hours = ValueTracker(0.0)
        row1_y = 1.3
        pct1 = C("99.9%", size=50, color=BLUE)
        pct1.move_to([-6.5, row1_y, 0], aligned_edge=LEFT)
        formula1 = C2("0.1% × 8760 小时 =", size=28)
        formula1.next_to(pct1, RIGHT, buff=0.45, aligned_edge=DOWN)
        num1_x = formula1.get_right()[0] + 0.4
        num1 = always_redraw(
            lambda: DecimalNumber(
                hours.get_value(), num_decimal_places=2, mob_class=Text,
                font_size=52, color=YELLOW, group_with_commas=False,
            ).move_to([num1_x, row1_y, 0], aligned_edge=LEFT)
        )
        unit1 = C2("小时/年", size=30, color=YELLOW)
        # 8.76 定宽：数字滚动期间单位不移位
        unit1.move_to(
            [num1_x + DecimalNumber(
                8.76, num_decimal_places=2, mob_class=Text,
                font_size=52, group_with_commas=False,
            ).width + 0.35, row1_y, 0], aligned_edge=LEFT)

        self.play(Write(pct1), run_time=1.2)
        self.play(FadeIn(formula1, shift=UP * 0.2), run_time=1.0)
        self.add(num1)
        self.play(hours.animate.set_value(8.76), run_time=4.0, rate_func=smooth)
        self.play(FadeIn(unit1, shift=UP * 0.2), run_time=0.8)
        self.wait(1.0)
        # 小计：1.2 + 1.0 + 4.0 + 0.8 + 1.0 = 8.0

        # 第 2 行：99.99% -> 0.01% x 8760 小时 = 0.876 小时 = 52.6 分钟/年
        minutes = ValueTracker(0.0)
        row2_y = -1.3
        pct2 = C("99.99%", size=50, color=GREEN)
        pct2.move_to([-6.5, row2_y, 0], aligned_edge=LEFT)
        formula2 = C2("0.01% × 8760 小时 = 0.876 小时 =", size=28)
        formula2.next_to(pct2, RIGHT, buff=0.45, aligned_edge=DOWN)
        num2_x = formula2.get_right()[0] + 0.4
        num2 = always_redraw(
            lambda: DecimalNumber(
                minutes.get_value(), num_decimal_places=1, mob_class=Text,
                font_size=52, color=YELLOW, group_with_commas=False,
            ).move_to([num2_x, row2_y, 0], aligned_edge=LEFT)
        )
        unit2 = C2("分钟/年", size=30, color=YELLOW)
        unit2.move_to(
            [num2_x + DecimalNumber(
                52.6, num_decimal_places=1, mob_class=Text,
                font_size=52, group_with_commas=False,
            ).width + 0.35, row2_y, 0], aligned_edge=LEFT)

        self.play(Write(pct2), run_time=1.2)
        self.play(FadeIn(formula2, shift=UP * 0.2), run_time=1.0)
        self.add(num2)
        # 0.876 小时 x 60 = 52.56 分钟，保留 1 位小数显示为 52.6
        self.play(minutes.animate.set_value(52.56), run_time=4.0,
                  rate_func=smooth)
        self.play(FadeIn(unit2, shift=UP * 0.2), run_time=0.8)
        self.wait(1.0)
        # 小计：1.2 + 1.0 + 4.0 + 0.8 + 1.0 = 8.0

        # 对比注脚：525.6 / 52.56 = 10
        note = C2("只多一个 9，停机时间缩短到 1/10", size=30, color=GREEN)
        note.move_to([0, -2.9, 0])
        self.play(Write(note), run_time=1.2)
        self.wait(2.8)
        # 小计：1.2 + 2.8 = 4.0；本段共 8.0 + 8.0 + 4.0 = 20.0

        # ---------- 3. 收尾卡（30-45s，共 15.0s）----------
        # 冻结数字滚动的 updater，否则 FadeOut 时数字每帧重建、不会淡出
        num1.clear_updaters()
        num2.clear_updaters()
        rows = VGroup(pct1, formula1, num1, unit1,
                      pct2, formula2, num2, unit2, note)
        self.play(FadeOut(rows), run_time=1.0)
        closing = VGroup(
            C("每多一个 9，成本翻倍；", size=40),
            C2("先定业务能接受的停机时间。", size=34, color=BLUE),
        ).arrange(DOWN, buff=0.5)
        self.play(Write(closing[0]), run_time=1.5)
        self.wait(3.0)
        self.play(Write(closing[1]), run_time=1.5)
        self.wait(7.0)
        self.play(FadeOut(closing), run_time=1.0)
        # 小计：1.0 + 1.5 + 3.0 + 1.5 + 7.0 + 1.0 = 15.0
        # 全片：10.0 + 20.0 + 15.0 = 45.0 秒
