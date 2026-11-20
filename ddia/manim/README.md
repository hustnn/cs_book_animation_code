# Manim 版 demo — DDIA 第 1 章排队论

场景：`queueing.py` 里的 `UtilizationLatency`，一个 Scene：
标题 → 公式 T = 1/(μ−λ) 变形为 T = 1/(μ(1−ρ)) → 坐标系 + 曲线
T = 1/(1−ρ) → 黄点沿曲线从 ρ=0.05 扫到 0.8（读数联动）→
ρ=0.8 拐点虚线 → 再扫到 0.97（T=33.3）→ 收尾“利用率接近 1 时延迟爆炸，不要把系统跑满”。

## 环境

- Python 3.12.3，项目级虚拟环境 `.venv/`（未装系统 Python）
- `pip install "manim[typst]==0.22.1"`（本机无 `uv`，用 venv + pip）
- 安装耗时约 3.5 分钟；`manim`、`pycairo`、`manimpango` 均从源码构建成功

## LaTeX 问题的处理（选了第 3 条路：Pango Text 降级）

- 本机无 LaTeX（`latex`/`pdflatex`/`dvisvgm` 均无），`MathTex` 不可用；
  `manim checkhealth` 会挂住（疑似在等缺失的 LaTeX），未等它跑完，
  直接跳过——代码本身不依赖 LaTeX。
- 未装 `texlive-full`（数 GB，太重）；也未用 Typst 公式——
  虽然装了 `manim[typst]`（含 `typst` 0.15.2 包），但分数排版用
  Unicode 斜杠写法（`T = 1 / (μ − λ)`）在画面上已足够清晰，
  且中文 + 希腊字母用 Pango `Text`（Noto Serif CJK SC）一次渲染、
  无乱码，确定性最高。`TransformMatchingTex` 因此改用
  `FadeTransform` / `Write` 替代。
- 如后续要做真正的分式排版 / 逐项变形推导，再评估 Typst
  `MathTypst` 或装最小 TeX Live。

## 渲染

```bash
.venv/bin/manim -pql queueing.py UtilizationLatency  # 低质迭代，约 24 秒
.venv/bin/manim -pqm queueing.py UtilizationLatency  # 定稿 720p30
```

- 低质 `-pql`（854×480 @15fps）：约 24 秒，32.2 秒
- 定稿 `-pqm`（1280×720 @30fps）：约 54–68 秒，32.1 秒
- 定稿产物：`media/videos/queueing/720p30/UtilizationLatency.mp4`
  已复制到 `../videos/manim-queueing.mp4`（h264，1280×720，30fps，
  32.1 秒，622,102 字节）

## 遇到的坑

1. `manim checkhealth` 挂住：超时被 SIGTERM 杀掉；绕过，不影响渲染。
2. `Axes` 默认只画刻度不标数字；`add_coordinates(x_values=..., y_values=...)`
   在 0.22.1 里签名是位置参数，且底层 `add_numbers` 默认用 MathTex
   （要 LaTeX）——改用 Pango `Text` 手写刻度数字。
3. 曲线在 ρ>0.9 后超出 y=10 坐标顶：点改为停在曲线顶端 (0.9, 9.6)，
   读数继续涨到 33.3，避免点脱离曲线飘到空白处。
4. x 轴标签曾被顶出画面下沿：`buff` 由 0.75 改为 0.5 后完整显示。
5. `-p` 会调 `xdg-open` 播片，本机无浏览器，报错无害。
