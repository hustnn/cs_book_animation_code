# Manim 实践笔记（Manim Community 0.22.1）

## 1. 环境

- 项目级 venv：`python3 -m venv .venv && .venv/bin/pip install "manim==0.22.1"`（需要 Python ≥ 3.10）。
- **没有 LaTeX 时**：`MathTex` / `Tex` 不可用，`Axes.add_coordinates()` 和 `add_numbers()` 默认也走 LaTeX。
  - 公式用 Pango `Text` 写 Unicode（`T = 1 / (μ − λ)`、`1 − 0.99ᴺ`），中文和希腊字母一次渲染；
  - 刻度数字手写 `Text` 放在 `ax.c2p(...)` 旁边；
  - 需要真正的分式排版或逐项变形推导时，再装最小 TeX（如 TinyTeX 加 `standalone`、`preview` 两个包），不要装 texlive-full。
- `manim checkhealth` 在没有 LaTeX 时可能挂住，可以跳过。
- **macOS 上 `pycairo` 没有现成的 wheel**，`pip install` 会从源码编译、要求本机装了 cairo 和 pkg-config。不想动系统时，
  用 conda-forge 建一个隔离环境装 `python=3.12 pycairo`，再用它的 pip 装 `requirements.txt` 的其余依赖。
- 公司网络下 pip 报 `invalid peer certificate: UnknownIssuer`：用系统证书（`uv pip install --native-tls`，或 conda 设 `ssl_verify: truststore`）。
- 中文字体：`theme.py` 用 `Noto Sans CJK SC`。机器上没有时 Pango 会回退到别的中文字体并刷 `Font … not in` 警告——能渲染，
  但全书字体不统一，正式渲染前装好。
- 没有 LaTeX 时这些也不能用：`MathTex` / `Tex`、`DecimalNumber`（数字走 LaTeX）、`Graph(labels=True)`、`Axes.add_coordinates()`。
  替代写法见 `references/techniques.md` 第 4 节，`examples/manim-gallery/` 全部按这个写法做。

## 2. 场景写法：用 beat() 计时

```python
from manim import *
from theme import T, FONT, txt          # ← assets/manim/theme.py
from beats import Beats                  # ← assets/manim/beats.py

class TailAmplification(Scene):
    def construct(self):
        self.camera.background_color = T.bg
        b = Beats(self, "timeline/tail-latency.json")   # 每拍时长来自 TTS 音频

        ax = Axes(x_range=[0, 100, 20], y_range=[0, 1, 0.2], x_length=9, y_length=4.5)
        with b.beat("b5"):                           # with 块里的动画跑完，自动补等到该拍时长
            self.play(Create(ax), run_time=1.2)
        n = ValueTracker(1)
        curve = always_redraw(lambda: ax.plot(lambda x: 1 - 0.99 ** x,
                                              x_range=[1, max(1.01, n.get_value())], color=T.red))
        readout = always_redraw(lambda: txt(
            f"N = {n.get_value():.0f}   P(至少一个慢) = {1 - 0.99 ** n.get_value():.0%}", 26, T.yellow
        ).to_corner(UL))
        self.add(curve, readout)
        with b.beat("b6"):
            self.play(n.animate.set_value(100), run_time=4, rate_func=linear)
```

- `Scene.time`（0.22.1 已有）是场景当前时间，`Beats` 用它计算还要补等多久。
- 想让 Manim 直接带声音：在每拍开头调用 `self.add_sound(path)`。但更推荐像 MC 一样静音渲染、后期统一混音，两套工具走同一条路径。

## 3. 确定性与数字一致

- 随机数据固定种子；百分位、均值等统计量**运行时现算并显示**，不要手抄数字。
- 原书图表给了具体数字（比如一张图里 7 个后端各自的耗时），就直接用原数字，不要再随机生成。
- 示意模型（书里没有的公式）要在画面角落标“示意”，并保证数学用语正确：
  - 1/(1−ρ) 处处是凸的，**没有拐点**；“0.8”只能叫经验阈值或警戒线；
  - M/M/1 公式给的是**平均**响应时间，不能拿它说明尾部百分位。

## 4. 一张图一种读法

- 坐标轴的含义在整段里不要变；要变换，就用动画把变换过程演出来（例如柱子从“到达顺序”排序成“快慢顺序”，横轴标签随之切换）。
- 重画书里的图时，先按原图的读法画（比如百分位用**横线**标在按到达顺序排列的柱状图上）；
  想换一种读法（比如排序后用名次标百分位），就把“排序”这个变换演出来，并明确说横轴已经变了。

## 5. 渲染

```bash
.venv/bin/manim -ql <chapter>/<file>.py SceneName    # 480p15 迭代
python <skill>/scripts/render_lock.py run <单元> -- .venv/bin/manim -qm <chapter>/<file>.py SceneName    # 720p30 定稿，和 MC 一致
```

`-qm` 是重渲染，和 Motion Canvas 渲染共用一把渲染锁（整台机器同一时间只跑一个）：`render_lock.py run` 拿锁、跑完放锁，
别人在渲染时排队；等锁超时退出码 3，没有渲染。`-ql` 迭代很轻，可以不包。

产物在 `media/videos/<file>/720p30/SceneName.mp4`，拷到 `videos/` 后再拼接。`-p` 会尝试打开播放器，无头环境下报错无害。

## 6. 坑

| 坑 | 规避 |
|---|---|
| 曲线超出坐标系上沿，点飞出画面 | 夹住点的坐标，让读数继续涨 |
| 标签顶出画面下沿 | 调 `buff`，并在 lint 时抽首帧和尾帧检查 |
| 读数跟着点跑出画面 | 读数固定在角落 |
| 大量 `always_redraw` 很慢 | 迭代时用 `-ql`，曲线的采样步长不要太细 |
| 中文字体缺失时静默回退 | 启动时检查 `manimpango.list_fonts()` 里有没有 Noto CJK |
