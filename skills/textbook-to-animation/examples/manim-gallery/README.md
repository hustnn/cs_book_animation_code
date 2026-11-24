# 示例：Manim 技法图库

三个场景、9 拍，演 Manim 里适合“定量、推导、拓扑、分布”的手法。全部只用 Pango `Text`，不需要 LaTeX。
手法的适用场景、最小写法见 `references/techniques.md`。

- `gallery.py`：三个场景；`beats.json`：旁白（没有配音，时长按字数估算）。
- `frames/`：9 张关键帧。
- 渲染：`python <skill>/scripts/examples.py render manim-gallery --manim <manim 可执行文件> [-q l|m]`
  （在示例目录下的 `media-work/` 里放好 `theme.py`、`beats.py` 再渲染，`media-work/` 不入库；用渲染锁包着跑）。

## 技法 → 拍 → 代码

| 技法 | 拍 | 机制（具体数据） | 代码 | 关键帧 |
|---|---|---|---|---|
| ValueTracker + always_redraw | m1 | 尾延迟放大：每个后端 1% 慢，扇出 N 个，至少一个慢的概率 1 − 0.99ᴺ；N 从 1 推到 100，读数跟着走 | `TailLatency`：`n = ValueTracker(1)`；曲线、点、读数都是 `always_redraw` | `m1-value-tracker` |
| TransformMatchingShapes | m2 | “反过来算”：P(全部都快) = 0.99ᴺ 改写成 P(至少一个慢) = 1 − 0.99ᴺ | `TransformMatchingShapes(f1, f2)` | `m2-transform-formula` |
| MovingCameraScene | m3 | 推近看 N = 100：63% | `frame.save_state()`、`frame.animate.scale(0.45).move_to(target)`、`Restore(frame)` | `m3-camera-zoom` |
| Graph + MoveAlongPath | m4 | 流言式广播：节点 0 把消息沿边告诉节点 5 | `Graph(V, E, layout='circular')`（不开 labels）、`MoveAlongPath(msg, edge(0, 5).copy())` | `m4-move-along-path` |
| ShowPassingFlash | m5–m6 | 每轮每个已知节点告诉一个邻居：1 → 2 → 4 → 8 → 10，四轮传遍（约 log₂N 轮，标“延伸”） | `spread()`：一轮里几道闪光同时沿边走，到达的节点变绿，计数 `Transform` 成新文字 | `m5-passing-flash`、`m6-graph-done` |
| GrowFromEdge + LaggedStart | m7 | 20 个响应时间按到达顺序长出来；两个慢请求（290、120 ms）把平均值拉到 52 ms | `LaggedStart(*[GrowFromEdge(r, DOWN) …])`；数据固定，统计量运行时现算 | `m7-lagged-grow` |
| 排序动画 | m8 | 从快到慢排好：p50 = 35.5 ms，p95 = 120 ms | `LaggedStart(*[bars[i].animate.set_x(x0 + rank[i] * step) …], lag_ratio=0.06)` | `m8-sorted` |
| Table + 高亮格 | m9 | 平均 / p50 / p95 一张表，p50 绿、p95 红 | `Table(…, element_to_mobject=lambda s: txt(s, 24))`；`get_highlighted_cell` 加到 `add_to_back` | `m9-table` |

## 环境

本机没有 `Noto Sans CJK SC` 时，Pango 会回退到别的中文字体并刷警告（关键帧就是这样渲出来的）；正式渲染前装好字体。
macOS 上 `pycairo` 没有现成的 wheel：用 conda-forge 装 `pycairo`，其余照 `requirements.txt` 装（见 `references/manim.md` 环境一节）。

## 做的过程中修掉的问题

- 红色公式放在红色曲线上，读不清——挪到曲线上方的空白处。
- 横轴名和底部的锚点文字撞在一起——横轴名挪到轴的右端。
- “p95 = 120 ms”标在柱子正上方，压到右边最高的那根——改标在左上方。
