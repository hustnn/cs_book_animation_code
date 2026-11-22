"""U5 Manim 场景（b12–b25）：100 根请求柱子、均值、排序变百分位、p50、1-0.5^n 引申、p95/p99。

分镜：ch01/skill-ch01/ch01-beats.md U5 一节；原文：DDIA §1.9 前半（书页 p14–15，PDF p36–37）。
Figure 1-4 读法：100 根按到达顺序的灰条 + 四条横线（均值、中位数 p50、95th、99th），
图上没有 p99.9 线，不画。均值横线只讲“说不出多少人等了多久”，绝不用 M/M/1 平均值曲线讲尾部。

数据（U6 复用同一份）：固定种子 seed=35，对数正态分布 lognormvariate(mu=ln(200), sigma=1.35)，
100 个请求，单位毫秒。运行时现算并显示：均值 ≈ 400 ms、p50 ≈ 200 ms、p95 ≈ 1.5 s、p99 ≈ 2.1 s、
最大值 ≈ 2.6 s。排序是动画演出来的变换（柱子保持各自高度平移到名次位置），横轴标签随之
从“到达顺序”换成“快 → 慢”。1-0.5^n 曲线角落标“引申”（紫色）。

渲染（在 manim/ 目录下）：
  .venv/bin/manim -qm skill01/u5-distribution.py U5Distribution
产物：media/videos/u5-distribution/720p30/U5Distribution.mp4（1280x720 30fps）
"""
import math
import os
import random
import statistics
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from manim import *  # noqa: F401,F403
from beats import Beats
from theme import T, txt

# ---------- 数据：固定种子，U6 复用同一份 ----------
SEED = 35
MU = math.log(200)
SIGMA = 1.35
N = 100

random.seed(SEED)
ARRIVAL = [random.lognormvariate(MU, SIGMA) for _ in range(N)]  # 到达顺序（不排序）
SORTED = sorted(ARRIVAL)


def percentile(values, p):
    """线性插值百分位，与 numpy.percentile 默认方法一致。"""
    k = (len(values) - 1) * p / 100.0
    f = math.floor(k)
    c = math.ceil(k)
    return values[f] + (values[c] - values[f]) * (k - f)


MEAN = statistics.mean(ARRIVAL)
P50 = percentile(SORTED, 50)
P95 = percentile(SORTED, 95)
P99 = percentile(SORTED, 99)
VMAX = max(ARRIVAL)
# 运行时现算：均值 ≈ 400 ms、p50 ≈ 204 ms、p95 ≈ 1506 ms、p99 ≈ 2122 ms、最大 ≈ 2570 ms

config.background_color = T.bg

# ---------- 几何 ----------
BASE_Y = -2.3
X0, X1 = -6.9, 6.9
STEP = (X1 - X0) / N
BAR_W = STEP * 0.92
SCALE = 4.4 / VMAX  # 最高柱 4.4 单位
ANCHOR_Y = -3.55


def bar_height(v):
    return max(v * SCALE, 0.03)


def bar_x(i):
    return X0 + STEP * (i + 0.5)


class U5Distribution(Scene):
    def construct(self):
        self.camera.background_color = T.bg
        b = Beats(self, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "skill-ch01", "timeline", "u5.json"))

        # ---------- 柱子（到达顺序） ----------
        bars = VGroup()
        for i, v in enumerate(ARRIVAL):
            h = bar_height(v)
            bar = Rectangle(
                width=BAR_W, height=h, fill_color=T.muted, fill_opacity=0.9,
                stroke_width=0,
            )
            bar.move_to([bar_x(i), BASE_Y + h / 2.0, 0])
            bars.add(bar)
        baseline = Line([X0, BASE_Y, 0], [X1, BASE_Y, 0], color=T.text, stroke_width=3)
        header = txt("100 个请求 · 响应时间（毫秒）", 26, T.blue).to_edge(UP, buff=0.35).to_edge(LEFT, buff=0.5)
        xlabel = txt("到达顺序", 22, T.muted).next_to(baseline, DOWN, buff=0.25)
        anchor = txt("100 次请求，各不相同", 26, T.text).move_to([0, ANCHOR_Y, 0])
        bars_group = VGroup(bars, baseline, header, xlabel)
        self.add(anchor)

        def say(text):
            anchor.become(txt(text, 26, T.text).move_to([0, ANCHOR_Y, 0]))

        # ---------- 百分位横线（运行时现算的数值） ----------
        def hline(value, color, dashed=False):
            y = BASE_Y + value * SCALE
            line = (DashedLine if dashed else Line)(
                [X0, y, 0], [X1, y, 0], color=color, stroke_width=3)
            return line

        # r2 #2：线型按原图 Figure 1-4——均值实线、中位数虚线（r1 是反的）
        mean_line = hline(MEAN, T.text, dashed=False)
        p50_line = hline(P50, T.yellow, dashed=True)
        p95_line = hline(P95, T.yellow)
        p99_line = hline(P99, T.yellow)

        def line_label(text, value, color, x=5.5, dy=0.32):
            y = BASE_Y + value * SCALE
            return txt(text, 22, color).move_to([x, y + dy, 0])

        # 均值线与 p50 线只差约 0.33 单位，标签放同侧会重叠：均值放左端，p50 放右端。
        # r2 #2：p50 标签贴在自己那条线正中（dy=0），加底色衬底，虚线/柱子不再穿字；
        # 均值线在其上方 0.33 处，衬底顶沿（约 +0.22）碰不到它。
        # r3 #2-3：标签仍骑在线上（虚线穿框中部），下移半行（dy=-0.32），紧贴虚线下方。
        mean_label = line_label("均值 ≈ 400 ms", MEAN, T.text, x=-5.5)
        mean_label.add_background_rectangle(color=T.bg, opacity=1, buff=0.07)
        p50_label = line_label("p50 ≈ 200 ms", P50, T.yellow, dy=-0.32)
        p50_label.add_background_rectangle(color=T.bg, opacity=1, buff=0.07)
        p95_label = line_label("p95 ≈ 1.5 s", P95, T.yellow)
        p95_label.add_background_rectangle(color=T.bg, opacity=1, buff=0.07)
        p99_label = line_label("p99 ≈ 2.1 s", P99, T.yellow)
        p99_label.add_background_rectangle(color=T.bg, opacity=1, buff=0.07)
        p999_note = txt("p99.9 × 图上没有这条线", 22, T.red).move_to([4.3, 2.4, 0])
        lines_group = VGroup(mean_line, p50_line, p95_line, p99_line,
                             mean_label, p50_label, p95_label, p99_label, p999_note)

        # 名次：rank[r] = 第 r 小的柱子在 bars 里的下标
        order = sorted(range(N), key=lambda i: ARRIVAL[i])
        rank_of = {idx: r for r, idx in enumerate(order)}
        sorted_bars = [bars[idx] for idx in order]

        # ---------- b12：100 次请求，各不相同 ----------
        say("100 次请求，各不相同")
        # r2 #10：标题与坐标轴开场即出现（r1：开场约 1s 空图）
        # r3 #2-13：横轴“到达顺序”文字也开场即出现（r2：约 2s 后才随柱子出现）
        self.add(header, baseline, xlabel)
        with b.beat("b12"):
            self.play(
                LaggedStart(*[GrowFromEdge(bar, DOWN) for bar in bars],
                           lag_ratio=0.01, run_time=5),
            )

        # ---------- b13：慢请求本身就贵（处理的数据更多） ----------
        say("慢请求处理更多数据")
        tallest = sorted(range(N), key=lambda i: ARRIVAL[i])[-5:]
        tag13 = txt("数据多", 22, T.yellow).move_to(
            [bar_x(tallest[-1]), BASE_Y + bar_height(ARRIVAL[tallest[-1]]) + 0.45, 0])
        with b.beat("b13"):
            # r3 #2-12：五根高柱逐根变黄（2.0s 扫过），“数据多”标签淡入后保留到拍末
            # （r2：高亮 + 标签只闪约 1.2s）；复原放在 b14 开头做。
            self.play(
                LaggedStart(*[bars[i].animate.set_fill(T.yellow, opacity=0.95) for i in tallest],
                           lag_ratio=0.2, run_time=2.0),
            )
            self.play(FadeIn(tag13, shift=UP * 0.15), run_time=0.8)

        # ---------- b14：随机延迟哪都有（原因标签一次只出现一个） ----------
        say("随机延迟哪都有")
        # r2 #15：旁白五个原因逐一标注（r1 代码只写了三个）；每枚可见约 1.2s
        causes = [
            ("抢 CPU", tallest[-1]),
            ("丢包重传", tallest[-2]),
            ("GC 停顿", tallest[-3]),
            ("缺页读盘", tallest[-4]),
            ("机架振动", tallest[-5]),
        ]
        with b.beat("b14"):
            # r3 #2-12：先把 b13 留下的高亮与“数据多”标签收掉，再逐个讲五个原因
            self.play(
                *[bars[i].animate.set_fill(T.muted, opacity=0.9) for i in tallest],
                FadeOut(tag13),
                run_time=0.6)
            for text, idx in causes:
                tag = txt(text, 20, T.yellow).move_to(
                    [bar_x(idx), BASE_Y + bar_height(ARRIVAL[idx]) + 0.45, 0])
                self.play(FadeIn(tag, shift=UP * 0.15), run_time=0.4)
                self.wait(0.5)
                self.play(FadeOut(tag), run_time=0.3)

        # ---------- b15：100 根灰条，大多快，偶有离群值 ----------
        say("100 个请求，大多快")
        req_label = txt("requests", 20, T.muted).move_to([6.2, BASE_Y - 0.45, 0])
        bars_group.add(req_label)
        sweep = Line([X0, BASE_Y, 0], [X0, BASE_Y + 4.4, 0], color=T.yellow, stroke_width=2)
        # r2 #16：扫线加标签（r1：无标注竖线扫过全图）；标签贴线顶、左右各留半字宽防出画
        sweep_label = txt("逐个看过去", 20, T.yellow).move_to([X0 + 0.8, BASE_Y + 4.75, 0])
        with b.beat("b15"):
            self.play(FadeIn(req_label), run_time=0.6)
            self.play(FadeIn(sweep_label), run_time=0.4)
            self.play(sweep.animate.move_to([X1, BASE_Y + 2.2, 0]),
                      sweep_label.animate.move_to([X1 - 0.8, BASE_Y + 4.75, 0]),
                      run_time=4, rate_func=linear)
            self.play(FadeOut(sweep), FadeOut(sweep_label), run_time=0.4)

        # ---------- b16：四条线落下；p99.9 不画 ----------
        say("四条线，没有 p99.9")
        with b.beat("b16"):
            self.play(Create(mean_line), FadeIn(mean_label, shift=UP * 0.1), run_time=0.8)
            self.play(Create(p50_line), FadeIn(p50_label, shift=UP * 0.1), run_time=0.8)
            self.play(Create(p95_line), FadeIn(p95_label, shift=UP * 0.1), run_time=0.8)
            self.play(Create(p99_line), FadeIn(p99_label, shift=UP * 0.1), run_time=0.8)
            self.play(FadeIn(p999_note), run_time=0.6)

        # ---------- b17：均值 = n 个数加起来 / n ----------
        say("均值 = 加起来除以 n")
        formula = txt("均值 = n 个数加起来 / n", 30, T.white).move_to([0, 2.95, 0])
        demo = txt("100 个数加起来 ÷ 100", 24, T.muted).move_to([0, 2.35, 0])
        # r3：只淡三条非均值线、不淡标签——标签带底色衬底，淡标签会把衬底也淡掉（r2 实测：b17–b19 衬底变半透明、柱子穿字）。
        # 标签保持全亮、线淡到 0.35，焦点仍在加粗的均值线与公式上；b20/b24 的“恢复 1”动画留作无操作。
        with b.beat("b17"):
            self.play(FadeIn(formula, shift=DOWN * 0.2), run_time=0.8)
            self.play(mean_line.animate.set_stroke(width=6), run_time=0.8)
            self.play(FadeIn(demo, shift=DOWN * 0.15), run_time=0.8)
            self.play(
                p50_line.animate.set_opacity(0.35), p95_line.animate.set_opacity(0.35),
                p99_line.animate.set_opacity(0.35),
                run_time=0.8)

        # ---------- b18：均值说不出多少人等了多久 ----------
        say("均值说不出多少人等了多久")
        above = [i for i in range(N) if ARRIVAL[i] > MEAN][:6]
        below = [i for i in range(N) if ARRIVAL[i] <= MEAN][:6]
        with b.beat("b18"):
            # r3 #2-16：分镜写“线上下各有一小撮柱子闪烁”，r1/r2 实片无闪烁（旧漏检）；
            # 现在红/蓝两撮各闪两次（亮 → 暗 → 亮），再复原。
            self.play(
                *[bars[i].animate.set_fill(T.red, opacity=0.95) for i in above],
                run_time=0.7)
            self.play(
                *[bars[i].animate.set_fill(T.blue, opacity=0.95) for i in below],
                run_time=0.7)
            self.play(
                *[bars[i].animate.set_fill(T.red, opacity=0.4) for i in above],
                *[bars[i].animate.set_fill(T.blue, opacity=0.4) for i in below],
                run_time=0.4)
            self.play(
                *[bars[i].animate.set_fill(T.red, opacity=0.95) for i in above],
                *[bars[i].animate.set_fill(T.blue, opacity=0.95) for i in below],
                run_time=0.4)
            self.play(
                *[bars[i].animate.set_fill(T.muted, opacity=0.9) for i in above + below],
                run_time=0.6)

        # ---------- b19：从快到慢排好队（排序演出来，横轴标签跟着换） ----------
        say("从快到慢排好队")
        new_xlabel = txt("快 → 慢", 22, T.muted).move_to(xlabel.get_center())
        with b.beat("b19"):
            # r2 #17：横轴标签在排序开始前就切为“快 → 慢”（r1：排序过半仍写“到达顺序”）
            self.play(FadeOut(formula), FadeOut(demo), Transform(xlabel, new_xlabel), run_time=0.5)
            self.play(
                *[bars[idx].animate.move_to(
                    [bar_x(rank_of[idx]),
                     BASE_Y + bar_height(ARRIVAL[idx]) / 2.0, 0])
                  for idx in range(N)],
                run_time=2.8, rate_func=smooth)

        # ---------- b20：正中间那根就是中位数 p50 ----------
        say("p50：一半快一半慢")
        with b.beat("b20"):
            self.play(sorted_bars[49].animate.set_fill(T.yellow, opacity=0.95), run_time=0.8)
            self.play(
                p50_line.animate.set_opacity(1), p50_label.animate.set_opacity(1),
                run_time=0.5)

        # ---------- b21：比如中位数 200 ms（一半快、一半慢，分色） ----------
        say("中位数 200 ms 的意思")
        readout21 = txt("p50 ≈ 200 ms：一半不到 200 ms，一半超过 200 ms", 26, T.text).move_to([0, 2.95, 0])
        # r3 #2-6：收口句“典型等待时间”在画面上也有小字（r2：只在旁白，画面无此词）
        typical21 = txt("典型等待时间", 24, T.yellow).move_to([0, 2.35, 0])
        with b.beat("b21"):
            self.play(FadeIn(readout21, shift=DOWN * 0.15), run_time=0.8)
            # r3 #2-1：旁白已放慢重录（speech 7.68s → 10.344s，语速 6.12 → 4.54 单位/s）；
            # 左半 49 根逐根变蓝，拉长到 5.5s，跟旁白“不到 200 毫秒”同步。
            self.play(
                LaggedStart(*[sorted_bars[r].animate.set_fill(T.blue, opacity=0.9)
                              for r in range(0, 49)],
                           lag_ratio=0.03, run_time=5.5),
            )
            # 右半轻闪一下（“另一半超过 200 毫秒”，不含第 50 根中位数柱本身），再亮出“典型等待时间”
            self.play(
                *[sorted_bars[r].animate.set_fill(T.muted, opacity=0.55) for r in range(50, 100)],
                run_time=0.45)
            self.play(
                *[sorted_bars[r].animate.set_fill(T.muted, opacity=0.9) for r in range(50, 100)],
                FadeIn(typical21, shift=DOWN * 0.15),
                run_time=0.8)
            self.play(p50_line.animate.set_stroke(width=6), run_time=0.5)
            self.play(p50_line.animate.set_stroke(width=3), run_time=0.5)

        # ---------- b22：一次操作发好几个请求 ----------
        say("发多个，至少一个慢")
        coins = VGroup(*[
            Circle(radius=0.35, fill_color=T.blue, fill_opacity=0.9,
                   stroke_color=T.text, stroke_width=2).move_to([-4 + i * 2, 0, 0])
            for i in range(5)])
        coin_text = txt("至少一个慢于 p50", 26, T.red).move_to([0, 1.6, 0])
        with b.beat("b22"):
            self.play(FadeOut(bars_group), FadeOut(lines_group), FadeOut(readout21),
                      FadeOut(typical21),
                      run_time=0.8)
            self.play(LaggedStart(*[FadeIn(c, shift=UP * 0.2) for c in coins],
                                  lag_ratio=0.2, run_time=1.5))
            self.play(coins[0].animate.set_fill(T.red, opacity=0.95), run_time=0.6)
            self.play(FadeIn(coin_text, shift=DOWN * 0.15), run_time=0.6)

        # ---------- b23：1 − 0.5^n 曲线（引申） ----------
        say("n=5，约 97%")
        ax = Axes(
            x_range=[0, 10, 5], y_range=[0, 1, 0.5],
            x_length=9, y_length=4.5,
            axis_config={"color": T.line}, tips=False,
        ).move_to([0, -0.2, 0])
        ticks = VGroup(*[
            txt(lab, 20, T.muted).move_to(ax.c2p(xv, 0) + DOWN * 0.4)
            for xv, lab in [(0, "0"), (5, "5"), (10, "10")]] + [
            txt(lab, 20, T.muted).move_to(ax.c2p(0, yv) + LEFT * 0.7)
            for yv, lab in [(0, "0"), (0.5, "50%"), (1, "100%")]])
        n_tracker = ValueTracker(1)
        curve = always_redraw(lambda: ax.plot(
            lambda x: 1 - 0.5 ** x,
            x_range=[1, max(1.5, n_tracker.get_value()), 0.1],
            color=T.yellow))
        readout23 = always_redraw(lambda: txt(
            f"n = {n_tracker.get_value():.0f}   P(至少一个慢) = {1 - 0.5 ** n_tracker.get_value():.0%}",
            26, T.yellow).move_to([0, 3.3, 0]))
        curve_label = txt("1 − 0.5ⁿ", 28, T.text).move_to([-4.2, 2.7, 0])
        derived = txt("引申", 22, T.purple).to_corner(UR, buff=0.4)
        with b.beat("b23"):
            self.play(FadeOut(coins), FadeOut(coin_text), run_time=0.5)
            self.play(Create(ax), FadeIn(ticks), run_time=1.0)
            self.add(curve, readout23)
            self.play(FadeIn(curve_label), FadeIn(derived), run_time=0.5)
            # r3 #2-2：n 与 P 同步步进——只在整数 n 处更新标签（50% / 75% / 88% / 94% / 97%），
            # 不再用连续扫值驱动 P（r2：扫值过程出现 n=1/64%、n=3/86%–89% 等错误配对）。
            # 注意：ValueTracker.set_value() + self.wait() 不会触发 always_redraw 重绘
            # （实测：读数冻结在 n=1，曲线停在 x=1.5），必须用 self.play 驱动；
            # rate_func 用阶梯函数，使插值全程停在旧整数值、只在最后一瞬跳变，
            # 中间帧永不出现错误配对。曲线由同一 tracker 驱动，随读数同步步进。
            for n in (2, 3, 4, 5):
                self.play(n_tracker.animate.set_value(n), run_time=0.2,
                          rate_func=lambda t: 1.0 if t >= 1 else 0.0)
                self.wait(0.45)

        # ---------- b24：高百分位 p95、p99 ----------
        say("p95 · p99")
        # r3 #2-5：分镜写“p999 提示闪一下”，实片从未出现“p999”字样；
        # 现在在 p99.9 提示下方闪出“= p999”小字（旁白说到“p99.9 也写作 p999”时出现，保留到拍末）。
        p999_tag = txt("= p999", 22, T.yellow).move_to([4.3, 2.0, 0])
        with b.beat("b24"):
            self.remove(curve, readout23, curve_label, derived, ax, ticks)
            self.play(FadeIn(bars_group), FadeIn(lines_group), run_time=0.8)
            # r3 #2-1：两根高亮各拉长到 2.0s，高亮时把对应的标签亮度也恢复，跟旁白节奏走
            self.play(sorted_bars[94].animate.set_fill(T.yellow, opacity=0.95),
                      p95_label.animate.set_opacity(1),
                      run_time=2.0)
            self.play(sorted_bars[98].animate.set_fill(T.red, opacity=0.95),
                      p99_label.animate.set_opacity(1),
                      run_time=2.0)
            self.play(Indicate(p999_note, scale_factor=1.12), run_time=1.2)
            self.play(FadeIn(p999_tag, shift=UP * 0.1), run_time=0.8)

        # ---------- b25：p95 = 1.5 s 的意思（最右 5 根变红） ----------
        # r3 #2-8：底部 caption 的“=”改“≈”，与图上“p95 ≈ 1.5 s”一致（r1 #13③ 残留）
        say("p95 ≈ 1.5 s 的意思")
        readout25 = txt("p95 ≈ 1.5 s：95 个不到 1.5 s，5 个至少 1.5 s", 26, T.text).move_to([0, 2.95, 0])
        with b.beat("b25"):
            self.play(
                *[sorted_bars[r].animate.set_fill(T.red, opacity=0.95) for r in range(95, 100)],
                run_time=0.8)
            self.play(FadeIn(readout25, shift=DOWN * 0.15), run_time=0.8)

        # ---------- 段尾补足（r2 #4） ----------
        # 逐拍尾 wait 按帧取整会累计丢帧（r1 实测整段比时间轴短 0.247s），
        # 段尾按时间轴 b12–b25 总长一次补足，使段总长与时间轴一致（误差 ≤ 1 帧），
        # 图表消失点与 b26 音频起点对齐、交界不再留近黑间隙。
        target = sum(b.durations[f"b{i}"] for i in range(12, 26))
        remaining = target - self.time
        if remaining > 1 / 30:
            self.wait(remaining)
