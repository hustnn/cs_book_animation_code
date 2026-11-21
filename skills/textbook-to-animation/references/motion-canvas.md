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
- 需要在一拍中间对齐某个词时，用 `waitUntil('事件名')` 加编辑器里的时间事件；`.meta` 文件会随之变化，要一起提交。

## 3. 文字与布局

- 字号阶梯（`SIZE`）：标题 46，正文 30，标签 22，最小 18（720p 下小于 18 基本看不清）。
- 所有 `Txt` 都要有宽度约束：`<Txt maxWidth={SAFE.width} textWrap ... />`，或者放进有 `width` 的 `Layout`。不要靠手调字号避免溢出。
- 多行内容用 `<Layout layout direction={'column'} gap={...}>` 自动排版，不要手算每行的 y 坐标。
- 安全区：1280×720 画布左右各留 60px，上下各留 40px（`SAFE`）。
- 中文用 `FONT.sans`，标题可以用 `FONT.serif`。英文撇号尽量用 ASCII `'`：弯撇号 `’` 在 CJK 字体下可能出现间隙。
- 同屏文字不超过 3 行。列表信息优先变成图（并排小卡片、图标、表格），而不是项目符号。

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
| `sequence(delay, …)` 只错开起跑时间、不等前一任务完成；`sequence(0, …)` 等于所有步骤 t=0 并行开始，同属性补间会冲突、动作根本不播（U1 曾有 11 处中招，U3/U5/U6 也遇到过） | 分阶段动作要真串行用 `chain(…)`；`sequence` 的总时长 = 任务数 × delay |
| `ffmpeg` 抽帧循环不加 `-nostdin` 会吞 stdin，导致文件名截断、联系表错乱 | 抽帧命令一律加 `-nostdin` |
