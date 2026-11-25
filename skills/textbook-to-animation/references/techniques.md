# 技法目录：两个工具里不只有“框和线”

## 目录
1. 怎么用这份目录
2. 按教学场景反查
3. Motion Canvas 技法
4. Manim 技法
5. 做示例时踩过的坑

---

## 1. 怎么用这份目录

先按 `visual-schemas.md` 选图式（数据长什么样、住在哪、怎么动、要数什么），再到这里挑实现它的技法。
每种技法都在 skill 自带的示例里演过一遍，用的是一个真实的小机制和具体的数据（所以示例本身也是“讲深”的样本）：

| 示例 | 内容 | 看法 |
|---|---|---|
| `examples/lsm/` | 完整单元：LSM 树写入、读取、压缩合并（3 个场景、42 拍） | `frames/` 关键帧；`README.md` 图式 → 拍 → 代码 |
| `examples/mc-gallery/` | Motion Canvas 技法图库（2 个场景、21 拍） | `frames/`；`README.md` 技法 → 拍 → 代码 |
| `examples/manim-gallery/` | Manim 技法图库（3 个场景、9 拍） | `frames/`；`README.md` |

没用过的技法，先 `python <skill>/scripts/examples.py render <示例> --project <工程>`（Manim 用 `--manim`）看一眼成片，再照着示例的代码写。
下面“示例”一列写的是示例名和拍号，到示例的 `README.md` 里能找到对应的代码位置。

## 2. 按教学场景反查

| 要讲的东西 | 首选技法 | 示例 |
|---|---|---|
| 这章讲什么、分几部分、现在讲到哪（开篇、单元开头、小结） | `ChapterTitle` + `Roadmap`（逐行点亮、念到的站闪、标下一站）；`UnitTitle` 站牌；小结 `Roadmap.complete()` | opening o1–o9；lsm w0 |
| 数据结构内部怎么变（插入、覆盖、分裂、合并） | 有身份的数据块 + 槽位容器；reparent；Layout 只补间尺寸 | lsm w1–w14；mc-gallery s5–s9 |
| 算法一步步怎么走 | Code 逐行高亮 + 信号驱动的指针 | mc-gallery s1–s4 |
| 分区、路由、哈希、归属 | 圆弧 + createComputed 派生归属 | mc-gallery s10–s12 |
| 消息、请求、复制流 | 虚线流动；沿曲线移动；本地 SVG 图标 | mc-gallery f1–f5 |
| 吞吐、排队、背压、持续负载 | 后台任务（spawn / cancel）+ loop；派生位置；计数器 | mc-gallery f6–f7 |
| 查询只碰一部分数据（范围扫描、索引命中） | 遮罩聚光；推镜头 | mc-gallery f8–f9；lsm r4 |
| 部件内部的机制（过滤器、索引页） | 剖面放大（全景虚化退后） | lsm r8–r11 |
| 代价（读几次、写几遍、占多少） | 计数器、计量条 | lsm r1–r6、c6、c13–c14 |
| 范围、层级、重叠 | 共享坐标轴 | lsm c8–c14 |
| 一个量随另一个量怎么变、概率 | Manim ValueTracker + always_redraw；推镜头看关键点 | manim-gallery m1、m3 |
| 推导、改写公式 | Manim TransformMatchingShapes；MC Latex + tex 变形 | manim-gallery m2；mc-gallery s12 |
| 传播、拓扑 | Manim Graph + ShowPassingFlash + MoveAlongPath | manim-gallery m4–m6 |
| 分布、统计量 | Manim 排序动画（LaggedStart）+ Table | manim-gallery m7–m9 |

## 3. Motion Canvas 技法

### 数据与容器（`lib/schemas.ts`）

| 技法 | 看起来 | 适合 | 不适合 | 最小写法 | 示例 |
|---|---|---|---|---|---|
| 有身份的数据块 `KV` | 一个块就是一条数据，带真实的键和值，从一处走到另一处 | 任何“数据在系统里怎么变”的机制 | 只表示“有这么个组件”的架构图 | `kv.appear(p)`、`kv.moveTo(p, 0.8)`、`kv.setValue('44662')`、`kv.stale()`、`kv.clone()` | lsm 全片 |
| 槽位容器 `Slots` | 有序插入时其余块先让位；追加排到末尾 | 有序表、日志、页、缓冲区 | 元素会换行、大小不一的列表（用 Layout） | `slots.insertSorted(kv)`、`slots.append(kv)` | lsm w5–w10 |
| 计数器 / 计量条 | 角落一个数随事件加一；竖条涨到上限线 | 代价、容量、水位 | 精确的连续数值曲线（用 Manim） | `counter.bump()`、`meter.to(0.8)` | lsm r1–r6、w5–w9 |

### 信号与派生

| 技法 | 看起来 | 适合 | 不适合 | 最小写法 | 示例 |
|---|---|---|---|---|---|
| 信号驱动的属性 | 补间一个数，所有依赖它的位置、颜色、文字一起平滑地变 | 指针、游标、进度、范围 | 只动一次的单个元素（直接补间更简单） | `const lo = createSignal(0)`；`x={() => xs(lo())}`；`yield* lo(4, 1)` | mc-gallery s2–s4 |
| `createComputed` 派生量 | 改一个输入，归属、计数、表格自动重算 | 归属关系、统计量、规则推出的结论 | 有先后步骤、要一步步演的过程（派生会一下跳到结果） | `const owner = createComputed(() => f(sweep()))`；`fill={() => color(owner())}` | mc-gallery s10–s11 |
| 端点绑定节点的连线 | 节点移动、分裂时连线一直连着 | 树、图、指针、引用 | 静止的图（多此一举） | `new Line({points: () => [a.position(), b.position()]})` | mc-gallery s5–s7 |
| 派生位置（插值到会变的目标） | 飞行中的块目标变了也平滑转向，不会两个补间抢同一个 position | 队列、排队、目标在变的移动 | 目标固定的简单移动 | `node.position(() => Vector2.lerp(from, target(), t()))`，补间 `t` 和目标 | mc-gallery f6–f7 |

### 结构与排版

| 技法 | 看起来 | 适合 | 不适合 | 最小写法 | 示例 |
|---|---|---|---|---|---|
| `Code` 逐行高亮 | 代码里当前那几行亮着，其余变暗；旁边的数据同步变化 | 算法、查询、配置、协议伪代码 | 大段代码（> 12 行看不过来）；只想展示语法 | `<Code code={SRC} fontFamily={FONT.mono} />`；`code().selection(lines(3), 0.4)` | mc-gallery s1–s4 |
| `reparent` 换父节点 | 元素换容器时画面位置不变，之后跟着新容器走 | 页分裂、分区迁移、任务转移 | 只是挪个位置（直接 moveTo） | `cell.reparent(newPage.node)`，再补间 `newPage.node.position(...)` | mc-gallery s5–s7 |
| `Layout` + 只补间尺寸 | 插入的行高度从 0 长出来，下面的行自己让开；删除时收起来 | 表格、列表、卡片排 | 元素要走自定义路线（Layout 管位置，补间 position 无效） | `table().insert(row, 3)`；`row.height(44, 1)`；删除 `row.height(0, 1)` 后 `remove()` | mc-gallery s8–s9 |
| 圆弧 | `Circle` 的 `startAngle` / `endAngle` 画一段弧，可补间 | 哈希环、环形缓冲、进度、占比 | 精确的统计图（用 Manim） | `new Circle({size, stroke, closed: false, startAngle: () => a(), endAngle: () => b()})` | mc-gallery s10–s11 |
| `Latex` 公式 | MathJax 排版的公式，`{{…}}` 分段可以变形 | 短公式、条件（`w + r > n`、`h mod N`） | 长推导（用 Manim）；中文（MathJax 不排中文，用 Txt） | `<Latex tex={'{{h}}\\bmod{{3}}'} height={44} />`；`tex().tex('{{h}}\\bmod{{4}}', 0.8)` | mc-gallery s12 |

`Latex` 不需要系统 LaTeX：MathJax 随 `@motion-canvas/2d` 一起装好了。

### 流动与时间

| 技法 | 看起来 | 适合 | 不适合 | 最小写法 | 示例 |
|---|---|---|---|---|---|
| 虚线流动 | 连线上的虚线持续往一个方向流，流速表示快慢 | 复制流、数据管道、持续的连接 | 一次性的单条消息（用数据块沿线走） | `lineDash={[14, 10]}`；`spawn(line.lineDashOffset(-2400, 60, linear))` | mc-gallery f1–f3 |
| 文字逐字打出 | 命令、日志一个字一个字出现 | 用户输入、命令、写日志 | 长句（观众等不及） | `cmd.text('> SET x = 2', 1.0)` | mc-gallery f1 |
| 沿曲线移动 | 消息沿弯曲路径走，比直线更像“经过网络” | 请求往返、跳数、路由 | 路径本身没有意义时（直接 moveTo） | `new QuadBezier({p0, p1, p2})`；`position: () => curve.getPointAtPercentage(t()).position` | mc-gallery f4–f5 |
| 本地 SVG 图标 | 客户端、服务器、数据库的小图标，颜色取 theme | 架构角色、参与方 | 需要演内部机制的部件（用数据块和容器） | `new SVG({svg: icon(T.blue), width: 72, height: 72})` | mc-gallery f4 |
| 后台任务 `spawn` / `cancel` + `loop` | 背景里一直在发生（消息不断进来），前台照常讲 | 持续负载、心跳、背景流量 | 前台的主线动作（要计入这一拍的时长） | `const p = spawn(loop(() => chain(() => void spawn(emit()), waitFor(0.5))))`；用完 `cancel(p)` | mc-gallery f6–f7、f1 |
| 遮罩聚光 | 整片压暗，只有一个洞里的内容亮着，洞可以移动、变宽 | 范围扫描、命中区域、聚焦一部分 | 只需要高亮一两个元素（改描边就够） | 组 `cache: true`；压暗层 + 洞 `compositeOperation: 'destination-out'`；组设 `key: 'qa-ignore-…'` | mc-gallery f8–f9 |
| 推镜头 `Cam` | 整个 world 放大、平移到一处，镜头外先淡出 | 结构里的细节、钻进某个部分 | 全景里的大范围移动 | `cam.focus(p, 1.6, 1.2)`；**不要用 `Camera` 组件** | lsm r4 |
| 剖面放大 | 全景压暗、虚化退后，放大的部件画在前景 | 部件的内部机制 | 部件本身已经够大 | `W.opacity(0.25, .6)` + `W.filters.blur(6, .6)`；前景放 HUD 层 | lsm r8–r11 |

## 4. Manim 技法

全部只用 Pango `Text`（`theme.py` 的 `txt()`），不需要 LaTeX。

| 技法 | 看起来 | 适合 | 不适合 | 最小写法 | 示例 |
|---|---|---|---|---|---|
| `ValueTracker` + `always_redraw` | 一个参数推着曲线往前画，点和读数跟着变 | 一个量随另一个量变化、概率放大 | 离散的系统状态（用 MC） | `n = ValueTracker(1)`；`always_redraw(lambda: ax.plot(f, x_range=[0, n.get_value()]))`；`n.animate.set_value(100)` | manim-gallery m1 |
| `TransformMatchingShapes` | 公式改写时，相同的字形留在原地，不同的变形过去 | 推导、等价变形、“反过来算” | 完全不同的两句话（用淡入淡出） | `TransformMatchingShapes(txt('P(全部都快) = 0.99ᴺ'), txt('P(至少一个慢) = 1 − 0.99ᴺ'))` | manim-gallery m2 |
| `MovingCameraScene` 推镜头 | 镜头推到曲线上的关键点，再拉回 | 看清某个点、某段区间的数值 | 结构图（用 MC 的 `Cam`） | `frame.save_state()`；`frame.animate.scale(0.45).move_to(p)`；`Restore(frame)` | manim-gallery m3 |
| `Graph` | 节点和边按布局排好，可以逐个变色 | 拓扑、传播、依赖 | 节点要带复杂内容（用 MC） | `Graph(V, E, layout='circular', vertex_config=…)`；**不要 `labels=True`**（走 LaTeX） | manim-gallery m4–m6 |
| `MoveAlongPath` | 一个点沿路径（边、曲线）移动 | 单条消息的路线 | 很多条同时走（用 ShowPassingFlash） | `MoveAlongPath(dot, edge.copy())` | manim-gallery m4 |
| `ShowPassingFlash` | 一道亮光沿线一闪而过 | 一轮里多条消息同时传 | 要看清每条消息内容的场合 | `ShowPassingFlash(line.copy().set_stroke(T.yellow, 8), time_width=0.6)` | manim-gallery m5 |
| `GrowFromEdge` + `LaggedStart` | 柱子依次从底边长出来 | 按顺序到达的数据 | 一次性的总量（直接 FadeIn） | `LaggedStart(*[GrowFromEdge(b, DOWN) for b in bars], lag_ratio=0.12)` | manim-gallery m7 |
| 排序动画 | 每根柱子错开着移到它在有序序列里的位置，看得出谁去了哪 | 分布、百分位、排序算法 | 数据点很多（> 50 看不清） | `LaggedStart(*[bars[i].animate.set_x(x0 + rank[i] * step) for i in …], lag_ratio=0.06)` | manim-gallery m8 |
| `Table` + 高亮格 | 一张小表，关键格加底色 | 对比、总结数字 | 大表（> 4×4） | `Table(rows, element_to_mobject=lambda s: txt(s, 24))`；`table.get_highlighted_cell((2, 2), color)` 加到 `add_to_back` | manim-gallery m9 |

没有 LaTeX 时的替代：公式用 Unicode（`0.99ᴺ`、`log₂N`、`1 − x`）写进 `Text`；坐标刻度手写 `txt()` 放在 `ax.c2p(...)` 旁；
数字读数用 `always_redraw(lambda: txt(f'{v:.0%}'))`，不用 `DecimalNumber`、`MathTex`、`Graph(labels=True)`、`Axes.add_coordinates()`。

## 5. 做示例时踩过的坑

| 坑 | 规避 |
|---|---|
| `at()` 的第二个参数必须是生成器，传回调（`() => table().insert(...)`）不会执行 | 回调用 `chain(() => …)` 包一层 |
| 补间参数在 `beat(...)` 调用时就求值：`lat(lat() + 20, 1)` 里的 `lat()` 读到的是拍首的值 | 依赖“运行到这里时的当前值”的动作写成生成器函数（`function* addLat(ms) { yield* lat(lat() + ms, 1); }`） |
| 队列画反了：队尾离生产者远，新消息从排队的消息上面飞过去 | 队尾朝生产者、队头朝消费者 |
| 后台任务（`spawn`）不计入拍长；一拍只剩后台在动，QA 会报 idle | 前台留一个覆盖整拍的动作（比如消费者的 `loop`，次数按 `beat.dur(id)` 算）；用完 `cancel` |
| 同一个块的目标在飞行中改变，再补一个 position 会和正在跑的补间打架 | 位置写成派生值（插值到会变的目标），只补间 `t` 和目标 |
| Layout 里插入的行一出现就是满高，下面的行瞬间跳开 | 先 `height: 0, opacity: 0` 插进去，再补间高度 |
| 渲染 QA 只把 `Txt` 当文字：`Code`、`Latex`、`SVG` 里的字不参与压字检查 | 这几类画面逐拍看帧（`sample_frames.py`） |
| `Code` 没装语言解析器时是单色 | 单色够用（选区高亮照样有）；要彩色得装 `@lezer/<语言>` 并设 `Code.defaultHighlighter` |
| Manim：机器上没有 `Noto Sans CJK SC` 时 Pango 会回退到别的中文字体并刷警告 | 能渲染，但全书字体不统一；正式渲染前装好字体（`manim.md` 环境一节） |
| Manim：`pycairo` 在 macOS 上没有现成的 wheel，`pip install` 要本机有 cairo | 用 conda-forge 装 `pycairo`（隔离环境里），其余照 `requirements.txt` 装 |
