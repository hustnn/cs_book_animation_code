# 示例：Motion Canvas 技法图库

两个场景、21 拍，把 LSM 示例里没用到的 Motion Canvas 手法各演一遍。每种手法都配一个真实的小机制、一组具体数据，
所以它同时也是“讲深”的样本：画面在演机制，而不是在展示动画效果。
手法的适用场景、最小写法见 `references/techniques.md`；这里是“在哪一拍、哪段代码”。

- `scenes/mc-structures.tsx`：结构类（s1–s12）；`scenes/mc-flows.tsx`：流动与时间类（f1–f9）。
- `beats.json`：旁白（没有配音，时长按字数估算——示例只为演手法，正式单元要走配音流程）。
- `frames/`：14 张关键帧。
- 渲染：`python <skill>/scripts/examples.py render mc-gallery --project <motion-canvas 工程>`。

## 技法 → 拍 → 代码

| 技法 | 拍 | 机制（具体数据） | 代码（场景里的位置） | 关键帧 |
|---|---|---|---|---|
| Code 逐行高亮 + 信号驱动的指针 | s1–s4 | 二分查找：7 个排好序的键里找 handoff，三次比较命中；范围外的键自动变暗 | `mc-structures` 段 A：`lo` / `hi` / `mid` 三个信号；`code().selection(lines(…))` | `s02-code-pointers`、`s04-code-found` |
| reparent + 端点绑定节点的连线 | s5–s7 | B+ 树叶子页（最多 4 个键）插入 33 → 满了分裂，后一半交给新页 → 新页的第一个键 31 复制到父节点当分界 | 段 B：`Page` 类（外框宽度由键数信号决定）、`k33.reparent(L1.node)`、`moved.forEach(c => c.reparent(N.node))`、`link(() => pointer(k), () => page.top())` | `s06-reparent-split`、`s07-separator-up` |
| Layout + 只补间尺寸 | s8–s9 | 按主键存放的表：插入 id 3 挤进 2 和 4 之间；删除 Bob，后面的行补上 | 段 C：`table().insert(carol, 3)` 后 `carol.height(44, 1)`；`bob.height(0, 1)` 后 `remove()` | `s08-layout-insert` |
| createComputed + 圆弧 | s10–s11 | 一致性哈希：6 个键、3 个节点；加节点 D，只有 k3 换了主人 | 段 D：`sweep` 信号 → `owners`（每个键的归属）→ 圆弧端点、键的颜色、右侧表、“换了主人的键”全部派生 | `s11-computed-ring` |
| Latex（MathJax）+ tex 变形 | s12 | 对比按节点数取模：3 台加到 4 台，6 个键里 5 个要搬（真实算出来的：17、29、42、58、71 mod 3 ≠ mod 4） | 段 D 末尾：`<Latex tex={'{{h}}\\bmod{{3}}'}>`、`formula().tex(…, 0.8)` | `s12-latex` |
| 虚线流动 + 逐字打出 | f1–f3 | 主从复制：SET x = 2 写进主库日志 #43；从库 1 重放到 #43，从库 2 网络慢，落后两条，从它读到旧值 1 | `mc-flows` 段 E：`spawn(l1.lineDashOffset(-2400, 60, linear))`（两条流速不同）、`cmd.text('> SET x = 2', 1)`、`lag` 由主从位置派生 | `f02-dash-flow`、`f03-replication-lag` |
| 沿曲线移动 + 本地 SVG 图标 | f4–f5 | 一个请求的往返：客户端 → 负载均衡 → 应用 → 数据库 → 原路返回，每一跳加延迟，合计 52 ms（示意） | 段 F：`ICON.*`（颜色从 theme 传入）、三条 `QuadBezier`、`packet.position = () => hops[hopOf()].getPointAtPercentage(prog())`、`function* hop()` | `f04-curve-path`、`f05-latency-sum` |
| 后台任务 + loop + 派生位置 | f6–f7 | 生产者每秒 2 条、消费者每秒 1.25 条：队列涨到 7；再加两个消费者（约 3.3 条/秒）：积压消化掉 | 段 G：`spawn(loop(…emit…))` 跨两拍、最后 `cancel`；消费者的 `loop` 在前台（次数按拍长算）；消息位置 `Vector2.lerp(from, slotX(slot()), t())` | `f06-queue-grows`、`f07-queue-drains` |
| 遮罩聚光 | f8–f9 | 按日期排好的 12 行日志，查 11-04 到 11-08：先定位起点，再顺着扫，过了终点就停，读了 5 行 | 段 H：`shade`（`cache: true`、`key: 'qa-ignore-spotlight'`）里压暗层 + `compositeOperation: 'destination-out'` 的洞；洞的宽度是信号 | `f09-spotlight` |

## 自检结果（`examples.py check` 会重跑）

渲染 QA 0 error、移动过快 0 条；lint 门槛全部通过，跨 `at()` 同对象补间 0 处。warn 主要是段与段之间的叠化（整组淡入淡出）。

## 做的过程中修掉的问题

- 队列先画反了（队尾离生产者远），新消息从排队的消息上面飞过——改成队尾朝生产者。
- 加消费者那一拍，消费的 `loop` 挂在句尾的词上，开始得太晚，队列没消化掉、文字却变绿——改成从拍首开始取。
- 插入 33 的动作挂在句尾，刚好在拍末做完——给那个 `at()` 加了 0.6 秒提前量。
- 延迟累加最初写成 `lat(lat() + ms, d)`，`lat()` 在拍首就求值了——改成生成器函数。
