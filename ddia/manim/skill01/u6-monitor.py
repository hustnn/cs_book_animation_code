"""U6 Manim 场景 3（b23–b29）：持续算百分位——滚动窗口、近似算法、平均百分位的陷阱。

分镜：skill-ch01/ch01-beats.md U6 一节；原文：DDIA §1.9 “Percentiles in Practice”小框后半（书页 p16，PDF p38）。
演示数据是示意（inventory N5）：A 机 100 个请求（90 个 100 ms、10 个 800 ms，p99 = 800 ms）、
B 机 100 个请求（90 个 100 ms、10 个 200 ms，p99 = 200 ms）；两台 p99 取平均得 500 ms，
合并成一个直方图后真实 p99 = 800 ms。百分位全部运行时现算并显示，画面数字与计算严格一致。
点阵每点代表 5 个请求（A 机 18 点在 100 ms、2 点在 800 ms；B 机 18 点在 100 ms、2 点在 200 ms），
p99 线的位置由运行时算出的值决定，不是手摆的。

渲染（在 manim/ 目录下）：
  .venv/bin/manim -qm skill01/u6-monitor.py U6Monitor
产物：media/videos/u6-monitor/720p30/U6Monitor.mp4（1280x720 30fps）

r2 备注（P2 1-5）：本场景实测 51.367s，比时间轴 50.978s 长 0.389s（重渲确定性复现，
超支全部落在段尾静态停留，疑为 Manim 长场景逐动画帧取整累积，根因未彻底定位）。
拼接时在暂存区把静态尾截到 51.000s，原始渲染文件未动；他人重渲重拼若不截尾会复现约 0.44s 音画差。
"""
import os
import random
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from manim import *  # noqa: F401,F403
from beats import Beats
from theme import T, txt

config.background_color = T.bg

ANCHOR_Y = -3.55

# ---------- 演示数据（示意）：固定值，运行时现算百分位 ----------
A_VALS = [100] * 90 + [800] * 10
B_VALS = [100] * 90 + [200] * 10
MERGED = sorted(A_VALS + B_VALS)


def percentile(values, p):
    k = (len(values) - 1) * p / 100.0
    f = int(k)
    c = min(f + 1, len(values) - 1)
    return values[f] + (values[c] - values[f]) * (k - f)


P99_A = percentile(sorted(A_VALS), 99)   # 800
P99_B = percentile(sorted(B_VALS), 99)   # 200
P99_AVG = (P99_A + P99_B) / 2            # 500
P99_TRUE = percentile(MERGED, 99)        # 800


def ms_x(ms):
    """毫秒 → 画面 x：0–900 ms 映射到 -6–6。"""
    return -6 + ms / 900.0 * 12


class U6Monitor(Scene):
    def construct(self):
        self.camera.background_color = T.bg
        b = Beats(self, "/home/hatch/workspace/ddia-animation-demo/skill-ch01/timeline/u6.json")

        anchor = txt("滚动窗口：最近 10 分钟", 26, T.text).move_to([0, ANCHOR_Y, 0])
        self.add(anchor)

        def say(text):
            anchor.become(txt(text, 26, T.text).move_to([0, ANCHOR_Y, 0]))

        # ---------- b23：滚动窗口——最近 10 分钟 ----------
        say("滚动窗口：最近 10 分钟")
        axis = Line([-6.5, 0.8, 0], [6.5, 0.8, 0], color=T.line, stroke_width=3)
        tick_now = txt("现在", 22, T.muted).move_to([6.0, 0.25, 0])
        tick_ago = txt("10 分钟前", 22, T.muted).move_to([-5.2, 0.25, 0])
        window = Rectangle(width=3.6, height=1.1, fill_color=T.blue, fill_opacity=0.25,
                           stroke_color=T.blue, stroke_width=3)
        window.move_to([-4.2, 0.8, 0])
        window_label = txt("窗口：最近 10 分钟", 24, T.blue).move_to([-4.2, 1.85, 0])
        with b.beat("b23"):
            self.play(Create(axis), FadeIn(tick_now), FadeIn(tick_ago), run_time=1.0)
            self.play(FadeIn(window), FadeIn(window_label), run_time=0.6)
            self.play(window.animate.move_to([4.2, 0.8, 0]),
                      window_label.animate.move_to([4.2, 1.85, 0]),
                      run_time=3.0, rate_func=linear)

        # ---------- b24：每分钟算一次中位数和各百分位，画到图上 ----------
        say("每分钟算一次")
        # 沿用 U5 同一份分布的现算值：p50 ≈ 200 ms、p95 ≈ 1.5 s、p99 ≈ 2.1 s
        p_bars = VGroup()
        p_data = [("p50", 200, T.blue, 0.8), ("p95", 1500, T.yellow, 2.0), ("p99", 2100, T.red, 2.8)]
        for i, (name, val, color, h) in enumerate(p_data):
            bar = Rectangle(width=1.1, height=0.1, fill_color=color, fill_opacity=0.9, stroke_width=0)
            bar.move_to([-3.6 + i * 2.6, -1.6, 0])
            p_bars.add(bar)
        p_labels = VGroup(*[
            txt(f"{name} ≈ {val if val < 1000 else val / 1000} {'ms' if val < 1000 else 's'}",
                22, T.text).move_to([-3.6 + i * 2.6, -0.9, 0])
            for i, (name, val, _, _) in enumerate(p_data)])
        # r3：三枚标签各加底色衬底——标签贴在自家柱子正中，柱子长起来会从字后穿过（r2 实测：p99 红柱穿字）。
        for lab in p_labels:
            lab.add_background_rectangle(color=T.bg, opacity=1, buff=0.07)
        refresh = txt("每分钟算一次，画到图上", 24, T.yellow).move_to([0, 2.6, 0])
        with b.beat("b24"):
            self.play(FadeIn(refresh), run_time=0.6)
            # r3 补：原写法用裸 `bar.animate`——bar 是上一个 for 循环遗留的变量（恒为最后一根 p99 红柱），
            # 三个动画全长在同一根柱子上，p50/p95 一直保持 0.1 高、肉眼不可见（r2/r3 既有 P1）。
            # 改为按下标取 p_bars[i]，三根柱子各自长高。
            self.play(
                LaggedStart(*[p_bars[i].animate.stretch_to_fit_height(h).move_to(
                    [-3.6 + i * 2.6, -1.6 + h / 2.0, 0])
                    for i, (_, _, _, h) in enumerate(p_data)],
                    lag_ratio=0.25, run_time=2.5),
            )
            self.play(FadeIn(p_labels), run_time=0.6)

        # ---------- b25：朴素做法——把全部响应时间存下来，每分钟排一次序 ----------
        say("存下来，每分钟排序")
        random.seed(7)
        items = []
        vals25 = [120, 90, 300, 150, 210, 80, 450, 180, 260, 110, 190, 520]
        for i, v in enumerate(vals25):
            sq = Rectangle(width=0.55, height=0.15 + v / 900.0, fill_color=T.blue,
                           fill_opacity=0.85, stroke_width=0)
            sq.move_to([-5.5 + i * 1.0, -1.6 + (0.15 + v / 900.0) / 2.0, 0])
            items.append(sq)
        sorted_items = sorted(items, key=lambda s: s.height)
        list_label = txt("窗口里全部响应时间，存成列表", 24, T.text).move_to([0, 2.6, 0])
        sort_label = txt("每分钟排一次序", 24, T.yellow).move_to([0, 2.6, 0])
        with b.beat("b25"):
            self.play(FadeOut(p_bars), FadeOut(p_labels), FadeOut(refresh),
                      FadeOut(window), FadeOut(window_label), FadeOut(axis),
                      FadeOut(tick_now), FadeOut(tick_ago), run_time=0.8)
            self.play(FadeIn(list_label), run_time=0.5)
            self.play(LaggedStart(*[GrowFromEdge(s, DOWN) for s in items],
                                  lag_ratio=0.12, run_time=3.5))
            self.play(FadeOut(list_label), FadeIn(sort_label), run_time=0.5)
            self.play(*[s.animate.move_to(
                [-5.5 + j * 1.0, -1.6 + s.height / 2.0, 0])
                for j, s in enumerate(sorted_items)],
                run_time=1.5)
        self.remove(*items, sort_label)

        # ---------- b26：三个近似算法 ----------
        say("三个近似算法")
        algos = ["forward decay", "t-digest", "HdrHistogram"]
        algo_texts = VGroup(*[
            txt(name, 32, T.text).move_to([0, 1.2 - i * 1.3, 0]) for i, name in enumerate(algos)])
        cheap = txt("很少的 CPU 和内存，够好的近似百分位", 24, T.green).move_to([0, -2.2, 0])
        with b.beat("b26"):
            self.play(
                LaggedStart(*[FadeIn(t, shift=UP * 0.15) for t in algo_texts],
                           lag_ratio=0.4, run_time=5.5),
            )
            self.play(FadeIn(cheap, shift=UP * 0.15), run_time=1.0)
            self.play(Indicate(cheap, scale_factor=1.08), run_time=1.0)

        # ---------- b27：别平均百分位——A、B 两台机器的点阵与各自 p99 ----------
        say("别平均百分位")
        self.play(FadeOut(algo_texts), FadeOut(cheap), run_time=0.5)
        random.seed(11)

        def strip(vals, y, color):
            dots = VGroup()
            for v in vals:
                d = Dot([ms_x(v) + random.uniform(-0.25, 0.25), y + random.uniform(-0.15, 0.15), 0],
                        color=color, radius=0.12)
                dots.add(d)
            return dots

        # 每点代表 5 个请求：A 机 18 点在 100 ms、2 点在 800 ms；B 机 18 点在 100 ms、2 点在 200 ms
        strip_a = strip([100] * 18 + [800] * 2, 1.6, T.blue)
        strip_b = strip([100] * 18 + [200] * 2, -0.4, T.blue)
        label_a = txt("机器 A", 24, T.text).move_to([-6.3, 1.6, 0])
        label_b = txt("机器 B", 24, T.text).move_to([-6.3, -0.4, 0])
        ms_axis = Line([ms_x(0), -1.8, 0], [ms_x(900), -1.8, 0], color=T.line, stroke_width=3)
        ms_ticks = VGroup(*[
            txt(lab, 20, T.muted).move_to([ms_x(v), -2.25, 0])
            for v, lab in [(0, "0"), (300, "300 ms"), (600, "600 ms"), (900, "900 ms")]])
        p99_a_line = DashedLine([ms_x(P99_A), 2.3, 0], [ms_x(P99_A), 0.9, 0], color=T.yellow, stroke_width=3)
        p99_a_tag = txt(f"A 机 p99 = {P99_A:.0f} ms", 22, T.yellow).move_to([ms_x(P99_A), 2.65, 0])
        p99_b_line = DashedLine([ms_x(P99_B), 0.3, 0], [ms_x(P99_B), -1.1, 0], color=T.yellow, stroke_width=3)
        p99_b_tag = txt(f"B 机 p99 = {P99_B:.0f} ms", 22, T.yellow).move_to([ms_x(P99_B), -2.75, 0])
        avg_line = DashedLine([ms_x(P99_AVG), 2.3, 0], [ms_x(P99_AVG), -1.1, 0], color=T.red, stroke_width=3)
        avg_tag = txt(f"平均 p99 = {P99_AVG:.0f} ms", 22, T.red).move_to([ms_x(P99_AVG), 2.65, 0])
        with b.beat("b27"):
            self.play(FadeIn(ms_axis), FadeIn(ms_ticks), run_time=0.7)
            self.play(FadeIn(label_a), LaggedStart(*[FadeIn(d, shift=UP * 0.1) for d in strip_a],
                                                   lag_ratio=0.03, run_time=3.0))
            self.play(FadeIn(label_b), LaggedStart(*[FadeIn(d, shift=UP * 0.1) for d in strip_b],
                                                   lag_ratio=0.03, run_time=3.0))
            self.play(Create(p99_a_line), FadeIn(p99_a_tag), run_time=1.0)
            self.play(Create(p99_b_line), FadeIn(p99_b_tag), run_time=1.0)
            self.play(Create(avg_line), FadeIn(avg_tag), run_time=1.0)

        # ---------- b28：正确做法是把直方图相加——合并后真实 p99 在另一处 ----------
        say("合并直方图")
        merged_dots = strip([100] * 36 + [200] * 2 + [800] * 2, 0.6, T.blue)
        true_line = DashedLine([ms_x(P99_TRUE), 2.3, 0], [ms_x(P99_TRUE), -1.1, 0],
                               color=T.green, stroke_width=4)
        true_tag = txt(f"真实 p99 = {P99_TRUE:.0f} ms", 24, T.green).move_to([ms_x(P99_TRUE), -2.75, 0])
        derived28 = txt("示意", 22, T.purple).to_corner(UR, buff=0.4)
        with b.beat("b28"):
            self.play(FadeOut(strip_a), FadeOut(strip_b), FadeOut(label_a), FadeOut(label_b),
                      FadeOut(p99_a_line), FadeOut(p99_a_tag), FadeOut(p99_b_line), FadeOut(p99_b_tag),
                      run_time=0.8)
            self.play(LaggedStart(*[FadeIn(d, shift=UP * 0.1) for d in merged_dots],
                                  lag_ratio=0.02, run_time=3.0))
            self.play(Create(true_line), FadeIn(true_tag), FadeIn(derived28), run_time=1.2)

        # ---------- b29：平均百分位没有意义，合并直方图才有意义 ----------
        say("平均无意义，合并才对")
        wrong_card = txt(f"平均 p99 = {P99_AVG:.0f} ms  ✗ 没有意义", 26, T.red).move_to([-3.2, 2.6, 0])
        right_card = txt(f"合并后 p99 = {P99_TRUE:.0f} ms  ✓", 26, T.green).move_to([3.2, 2.6, 0])
        with b.beat("b29"):
            # 平均那条线的标签让位给两张对比卡（线本身留着当“错线”）
            self.play(FadeOut(avg_tag), run_time=0.4)
            self.play(FadeIn(wrong_card, shift=DOWN * 0.15), run_time=0.8)
            self.play(FadeIn(right_card, shift=DOWN * 0.15), run_time=0.8)
            self.play(Indicate(wrong_card, scale_factor=1.08), run_time=0.8)
            self.play(wrong_card.animate.set_opacity(0.4),
                      Indicate(right_card, scale_factor=1.08), run_time=0.9)

        # ---------- 段尾补足（照 U5 的做法） ----------
        target = sum(b.durations[f"b{i}"] for i in range(23, 30))
        remaining = target - self.time
        if remaining > 1 / 30:
            self.wait(remaining)
