# Motion Canvas 实践笔记（3.x，示例按 3.17.2 写）

## 目录
1. 项目结构
2. 场景写法：用 beat() 代替魔法数字
3. 文字与布局
4. 组件
5. 无头渲染
6. 拼接与混音
7. 坑

---

## 1. 项目结构

```
motion-canvas/
├── src/
│   ├── lib/
│   │   ├── theme.ts              # ← assets/motion-canvas/theme.ts
│   │   ├── beats.ts              # ← assets/motion-canvas/beats.ts
│   │   ├── layout.ts             # ← assets/motion-canvas/layout.ts
│   │   ├── qa.ts                 # ← assets/motion-canvas/qa.ts
│   │   └── card.tsx              # ← assets/motion-canvas/card.tsx
│   ├── components/               # 自己的组件：Node、Queue、Packet、Table、BarSeries…
│   ├── timeline/<unit>.json      # audio_timeline.py 的产物（也可以直接引用章节目录里的那份）
│   ├── scenes/<chapter>/<unit>-*.tsx
│   ├── project.ts                # 可以每章一个 project，减少加载时间
│   └── headless.ts               # ← assets/motion-canvas/render/headless.ts
├── public/headless.html          # ← assets/motion-canvas/render/headless.html
├── scripts/render.mjs            # ← assets/motion-canvas/render/render.mjs
└── vite.config.ts                # ← assets/motion-canvas/render/vite.config.ts
```

- 依赖版本锁死（core、2d、ui、vite-plugin 同一版本），全书中途不要升级。
- 场景名取自文件名，一个文件只能导出一个场景。
- `tsconfig.json` 里要有 `"jsx": "react-jsx"` 和 `"jsxImportSource": "@motion-canvas/2d/lib"`。

## 2. 场景写法：用 beat() 代替魔法数字

```tsx
import {makeScene2D, Rect} from '@motion-canvas/2d';
import {all, createRef} from '@motion-canvas/core';
import {T} from '../../lib/theme';
import {makeBeats} from '../../lib/beats';
import timeline from '../../timeline/tail-latency.json';

export default makeScene2D(function* (view) {
  view.fill(T.bg);
  const beat = makeBeats(timeline);   // 每拍时长来自 TTS 音频
  const q = createRef<Rect>();
  view.add(<Rect ref={q} width={600} height={80} stroke={T.blue} lineWidth={3} opacity={0} />);

  yield* beat('b1', q().opacity(1, 0.6));          // 动画 0.6s，余下时间等旁白念完
  yield* beat('b2', all(q().width(900, 1), q().stroke(T.red, 1)));
  yield* beat('b3');                                 // 这一拍只有旁白，画面不动（尽量少用）
});
```

- `beat(id, anim)`：先跑 `anim`，再补等到该拍音频的时长；动画比音频长时直接顺延，并在 logger 里警告。
- 还没有音频时，可以直接传 `beats.json`（`[{id, text}]`）：按旁白字数估算时长（约每秒 4.5 个汉字），先把节奏搭起来，有音频后换成 timeline。
- 一拍里的动画最好占满这一拍的大部分时间（比如慢慢移动、逐个点亮），而不是 0.5 秒做完再静止 5 秒。
- **一拍里有几个动作时，跟着旁白展开**：`beat(id, at('词1', a), at('词2', b), c)`。`at` 按词在这一拍旁白里的位置
  估出念到它的时刻（提前 0.2s），换了配音会自动重算；词不在旁白里直接报错，旁白改了画面没跟着改，渲染时就能发现。
  不带 `at` 的动画从拍首开始。只有一个信息点、却有很长旁白的拍，加一段铺满整拍的慢动作：`node().scale(1.03, beat.dur(id))`。
  用 `at` 推迟各部分时，**拍首先出整体**（空框、轮廓、坐标轴、总标签），再按词往里填：旁白往往先讲整体，拍首不要留空画面。
- 先后发生的动作用 `chain(a, b)`；往返、脉动用 `a().x(1, d).to(0, d)`。不要在 `all(…)` / `sequence(0, …)` 里对同一属性补间两次（只会播最后一个）。
- 需要精确到帧的对齐（比如音效），才用 `waitUntil('事件名')` 加编辑器里的时间事件；`.meta` 文件会随之变化，要一起提交。

```tsx
import {at, makeBeats} from '../../lib/beats';
// 旁白：“响应时间包括真正处理的时间、网络延迟和排队延迟。”
yield* beat('b10',
  all(prev().opacity(0, 0.5), track().opacity(1, 0.5)),  // 拍首：换场，整条空框先出来
  at('真正处理', all(seg1().width(300, 1.2), lab1().opacity(1, 0.4))),  // 标签和它那段一起出现
  at('网络延迟', all(seg2().width(120, 1.2), lab2().opacity(1, 0.4))),
  at('排队延迟', all(seg3().width(180, 1.2), lab3().opacity(1, 0.4))),
);
```

## 3. 文字与布局

- 字号阶梯（`SIZE`）：标题 46，正文 30，标签 22，最小 18（720p 下小于 18 基本看不清）。
- 所有 `Txt` 都要有宽度约束：`<Txt maxWidth={SAFE.width} textWrap ... />`，或者放进有 `width` 的 `Layout`。不要靠手调字号避免溢出。
- 多行内容用 `<Layout layout direction={'column'} gap={...}>` 自动排版，不要手算每行的 y 坐标。
- 安全区：1280×720 画布左右各留 60px，上下各留 40px（`SAFE`）。
- 中文用 `FONT.sans`，标题可以用 `FONT.serif`。英文撇号尽量用 ASCII `'`：弯撇号 `’` 在 CJK 字体下可能出现间隙。
- 同屏文字不超过 3 行。列表信息优先变成图（并排小卡片、图标、表格），而不是项目符号。

### 摆位：用 `lib/layout.ts`，不要手摆绝对坐标

文字被压、骑边、互叠，大多来自“按绝对坐标把标签摆在会动的图形旁边”。`layout.ts` 把正确的写法变成最省事的写法：

| 写法 | 做什么 | 用在哪 |
|---|---|---|
| `attach(label(), bar(), 'right', 12)` | 标签的 offset 设好，`absolutePosition` 绑定到对象那一边外侧 12px；对象长大、移动、缩放时标签跟着走 | 柱子、进度条、节点旁的数值和说明 |
| `attach(text(), card(), 'bottom', 22, true)` | 放在容器那一边的**内侧**，留 22px 内边距 | 卡片、框里的说明文字，不会骑在边框上 |
| `row(n, size, gap, center)` / `column(…)` | 由元素尺寸和间距算出每个元素的中心 | 一排卡片、一列格子；间距永远不会小于元素尺寸 |
| `edgePointIn(dot(), node(), 'left', 26)` | 对象某一边外侧的点，换算到 `dot` 父节点的坐标 | 运动的小点、箭头终点停在节点旁边，不停在节点中心的字上 |

```tsx
import {attach, row, edgePointIn} from '../../lib/layout';
view.add(<>{/* … */}</>);                               // 先 add，再 attach：要拿得到世界坐标
attach(tag(), bar(), 'right', 16);                      // bar 从 200 长到 700，tag 一直贴在它右边
attach(note(), card(), 'bottom', 22, true);             // 卡片内侧底部
row(3, 150, 20, [-300, -40]).map(([x, y], i) => ...);   // 三张 150 宽的卡，间距 20
yield* dot().position(edgePointIn(dot(), server(), 'left', 26), 0.8);
```

- `attach` 用的是响应式 `absolutePosition`，对象的祖先节点在动（整组平移、缩放）也会跟着走；
  标签不要再手动设 `position`，否则会和绑定打架。
- 一个标签只描述一个对象，就挂到那个对象上；分镜里没写清它说明的是哪个对象时，先回去补分镜。
- 标签和对象一起出现、一起退场：对象用 `at()` 推迟出现时，标签的淡入放进同一个 `at()`。`attach` 会记下标签说明的对象，QA 的 `orphan` 据此检查。
- 会长大的元素给它留出“生长通道”：按**终态**尺寸检查通道里没有别的文字。

## 4. 组件

把反复出现的视觉元素做成组件，签名里只留“语义”参数（标题、状态、数值），样式从 theme 取。
本 skill 不附带这些组件，下表是系统类教材里值得按需实现的一组（接口仅作建议）：

| 组件 | 用途 | 关键方法 |
|---|---|---|
| `Node` | 服务器 / 数据库 / 客户端：圆角矩形 + 标题 + 状态灯 + 数值 | `setValue()`、`setStatus()`、`flash()` |
| `Packet` | 沿路径飞行的消息 / 请求 | `travel(path, duration)` |
| `Queue` | 队列：入队、出队、阻塞高亮 | `push()`、`pop()`、`block(i)` |
| `Table` | 表、行级高亮、join 连线 | `highlightRow()`、`link(a, b)` |
| `BarSeries` | 条形 / 柱状，支持排序动画 | `grow()`、`sortBy()` |
| `Timeline` | 多节点的本地时间轴，事件标记 | `mark(node, t)` |
| `Callout` | 指向某处的简短说明 | `pointTo(node)` |

组件内列表的 `key` 要全局唯一（例如 `${prefix}-${i}`）。同一个场景里多个列表都写 `key={String(i)}`，会报 `Duplicated node key`。

做数量级时，不用真的画 1 万个对象：画一个点阵代表数量级，再配上真实数字。点阵要整体变色时，叠一层预先画好的彩色点阵整体淡入，比逐个改颜色快得多。

## 5. 无头渲染

Motion Canvas 3.x 没有官方渲染 CLI。本 skill 的做法：Vite dev server + Puppeteer 打开 `public/headless.html` → `src/headless.ts` 调用 `Renderer#render`。

- 单场景：在 `motion-canvas/` 目录下运行 `node scripts/render.mjs <场景名>`（项目里的渲染驱动，不是本 skill 的 scripts/）→ `output/<场景名>.mp4`；可选 `--w --h --fps --port --timeout`。
- `RendererSettings.size` 必须是 `new Vector2(w, h)`；传数组会算出 NaN，ffmpeg 失败。
- 渲染错误不抛异常，只走 `onFinished` 的结果码和 `project.logger`；`headless.ts` 已把它们转到 console，`render.mjs` 会打印出来。
- 任何一个场景有语法错误都会导致整个 project 加载失败，**渲染前先跑 `npx tsc --noEmit`**。
- 在沙箱环境里，Chromium 可能因为 `mmap(/proc/self/mem)` 返回 EPERM 起不来（表现为 exit 133 / `Failed to launch the browser process`）。这是环境问题，换环境或换会话再试，不要去改场景。

### QA 模式：`--qa`

`node scripts/render.mjs <场景名> --qa [--strict]`。`headless.ts` 打开 `window.__MC_QA__`，`beat()` 在每一拍并行跑一个只读的
探针（`lib/qa.ts`），在拍首 +0.15s、25%、50%、75%、拍末 −0.15s 五个时刻遍历场景树，按世界坐标和绘制顺序判断：

| 类型 | 级别 | 含义 |
|---|---|---|
| `covered` | error | 图形画在文字之上，盖住文字 ≥ 2% |
| `crossed` | error | Line / Spline / 贝塞尔从文字中间穿过（线在托住文字的不透明卡片下面时不算） |
| `edge` | error | 文字骑在下层图形的边上：落在图形里的比例在 10%–90% 之间 |
| `text-overlap` | error | 两段文字互相重叠 ≥ 15% |
| `offscreen` | error | 文字超出画面 |
| `overrun` | error | 这一拍的动画比旁白长，被顺延了 |
| `idle` | error / warn | 动画做完后这一拍还要静止 ≥ 6s 为 error，3–6s 为 warn |
| `orphan` | error | `attach` 挂上的标签已经看得清，它说明的对象却还没出现（透明、宽或高 < 1px）或已退场 |

降为 warn 的四种情况：转场叠化（任一方不透明度 < 0.6）、半透明高亮（压在文字上的填充实际不透明度 < 0.5）、
遮罩层（用背景色填充，或面积 ≥ 画面一半）、瞬时（同一对元素只在一个采样点重叠：正在飞入、散开、穿过）。
“同一对”按节点身份判断，正在变长的柱子压字会被认作持续的同一个问题。几何按图形自身坐标系里的精确多边形交集算（圆按 32 边形），旋转、缩放不会造成误报。

每条规则为什么这样定、阈值的理由、每类发现怎么修、规则要改时怎么验证，见 `references/qa-rules.md`；
阈值集中在 `lib/qa.ts` 的 `QA_CONFIG`，改动前后都跑 `scripts/qa_selftest.py --project <工程>`。

报告写到 `output/<场景名>.qa.json`，并在终端列出前 40 条（拍号、时刻、哪段文字、和哪个图形）。`--strict` 时有 error 退出码为 2。

整章一起查用 `python <skill>/scripts/qa_chapter.py --project motion-canvas --dir src/scenes/<chapter>`：逐个场景 `--qa` 渲染（默认只重渲内容改过的场景），
汇总写到 `output/qa-summary.md` / `.json`——门槛结论、每个场景一行、要修的 error 清单（按场景、时刻排好）、
静止 3–6s 的拍、没有用 `beat()` 计时因而查不到的场景。场景名单取 `project.ts` 里登记过的；
目录里有像场景却没登记的文件会被报出来（render.mjs 渲染不了它们）。
“改过”按内容判断：每次渲染成功后记下场景和它 import 的文件的指纹，内容没变（切分支、复制同样的文件）就不重渲；
只认它自己渲染、带指纹的报告，直接用 render.mjs 渲的报告会被重渲一次。场景渲染失败（比如抛错）时
`render.mjs` 不写 QA 报告，汇总里记为“渲染失败”，不会被当成 0 error。

- 画面和时长与正常渲染完全一致：探针只读不写，总长不超过这一拍，直接用 QA 渲染的产物当成片也可以。
- 有意的划掉、打叉、遮罩：给那个节点设 `key="qa-ignore-<说明>"`，它和子节点都不参与检查。
- 判断用的是节点几何，不是像素：文字框按整行算（字形四周的留白也算在内），error 修之前对照帧看一眼是哪种情况；
  确认是误报时，按 `references/qa-rules.md` 第 6 节补一个测试用例再改规则，不要直接调阈值。
- 只覆盖用 `beat()` 计时的 Motion Canvas 场景；Manim 段和不用 `beat()` 的旧场景仍要人工看帧（`sample_frames.py`）。

## 6. 拼接与混音

场景静音渲染（`includeAudio: false`），音频单独处理：

```bash
# 1. 把一个单元的视频段按顺序拼起来（统一重编码，避免时间戳问题）
ffmpeg -f concat -safe 0 -i <unit>-video.txt -c:v libx264 -crf 18 -pix_fmt yuv420p -r 30 -an <unit>-silent.mp4
# 2. 按 timeline 的顺序拼音频（audio_timeline.py --concat-list 生成清单，并在拍间插入 --pad 秒静音）
ffmpeg -f concat -safe 0 -i audio/<unit>.txt -c:a pcm_s16le <unit>-voice.wav
# 3. 混流；字幕作为软字幕放进去，不烧进画面
ffmpeg -i <unit>-silent.mp4 -i <unit>-voice.wav -i subs/<unit>.srt -map 0:v -map 1:a -map 2 \
  -c:v copy -c:a aac -b:a 160k -c:s mov_text -shortest <unit>.mp4
```

如果音频和视频的长度差超过 0.3s，说明有某拍的动画比音频长，被 `beat()` 顺延了：查渲染日志里的警告，改动画或改旁白。

## 7. 坑

| 坑 | 规避 |
|---|---|
| 一个文件只能导出一个场景 | 文字卡也一个文件一个 |
| 单引号字符串里写了撇号（`'Dobb's'`），语法错误导致整个 project 加载失败 | 用双引号或模板字符串；渲染前 `tsc --noEmit` |
| `waitFor` 魔法数字，改一处要重算整段 | `beat()` |
| 大量对象逐个改属性很慢 | 预先画好第二层，整体淡入淡出 |
| 标签和画面讲的不是一回事 | 语义审；标签文字从 beats.md 的“屏幕文字”列复制，不要凭记忆写 |
| `npx vite` 偶发 EPERM | `render.mjs` 已优先直接运行本地 `node_modules/vite/bin/vite.js` |
| 路径里有空格时 `new URL(...).pathname` 变成 `%20` | 用 `fileURLToPath`（`render.mjs` 已处理） |
| `sequence(delay, …)` 只错开起跑时间、不等前一任务完成；`sequence(0, …)` 等于所有步骤 t=0 并行开始，同属性补间会冲突、动作根本不播（曾有一章里 11 处分阶段动作因此根本没播出来，人工复审后又漏了 3 处：定格帧看起来是对的） | 分阶段动作要真串行用 `chain(…)`；`sequence` 的总时长 = 任务数 × delay。`lint_scenes.py` 会报出同一 `ref().属性` 在一组并行动画里被补间两次的地方 |
| 按绝对坐标把标签摆在会长大的柱子旁边；柱子长到终态时扫过标签（这类问题定格在开头几帧看不出来） | `attach(label, bar, side)`；QA 的 `covered` / `edge` 会报出来 |
| 标签借用别的组的坐标摆位，离错误的对象更近，读错意思 | 标签挂到它说明的对象上（`attach`）；分镜写清每个标签说明哪个对象 |
| 运动的小点停在节点中心，正好压住节点名 | 停靠点用 `edgePointIn`，停在节点旁边 |
| 一拍里几个动作并行、0.5s 做完，之后静止 5 秒以上（freezedetect 对小物体慢移动不敏感，抽帧也看不出） | `at('词', 动作)` 跟着旁白展开；QA 的 `idle` 会报出来 |
| `ffmpeg` 抽帧循环不加 `-nostdin` 会吞 stdin，导致文件名截断、联系表错乱 | 用 `sample_frames.py`（已加 `-nostdin`）；自己写抽帧命令时一律加 |
| 时间轴有两份拷贝：`timeline/<unit>.json`（章节目录里那份）与 Motion Canvas 场景 import 的 `motion-canvas/src/timeline/<unit>.json` 是独立的；重算时间轴后不把新文件同步到 `src/timeline/`，渲染会静默用旧时长 | `audio_timeline.py` 的 `-o` 给两次，一次写出两份；`lint_scenes.py --timeline-dir` 会比对两份是否一致 |
| 渲染批处理脚本的锁检查会把调用方同一行命令里的 `manim -qm` 误判为活进程（LOCK-BUSY） | Motion Canvas 渲染与 Manim 渲染分两次调用，不要写在同一行命令里 |
| `audio_timeline.py` 按文件名 stem 建键，同一拍同时有 `.mp3` 与 `.wav` 时会撞键，丢掉垫音（曾有一拍因此丢了 8 秒多的垫音） | 已修：同一拍号有多个格式时脚本只用 `.wav` 并警告；仍建议删掉多余的 `.mp3` |
| TTS 文本触发型缺陷：某句旁白在固定位置截断、后半句重复（如旁白「第六，运行时自检」在固定位置截断后重复数次）；同句重录、换写法仍在同一点截断 | 不要原句重试；把这拍拆成两拍或改写法。`audio_timeline.py` 的配音检查会把这类拍标成“疑似重复/多读”（有声段语速明显偏慢） |
