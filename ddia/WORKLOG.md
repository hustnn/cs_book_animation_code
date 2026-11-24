# DDIA 动画重做 — 工作过程记录

> 更新时间：2026-11-21。状态：skill 版第 1 章整章 r2 已出（2026-11-21，2276.83 秒，10 个单元全部 0 P0/P1），待用户验收；v2 最终版（1814.63 秒）与 r1（2218.03 秒）未动。

## 1. 目标与分工

把 Martin Kleppmann《Designing Data-Intensive Applications》（613 页，12 章）重新做成动画视频，
不以旧的交互式网页教程为底本，从零按 Motion Canvas + Manim 重做。

- **Motion Canvas**（TypeScript，锁定 3.17.2）：流程 / 结构 / 多节点互动，如复制、分区、共识、存储引擎。
- **Manim**（Python，manim 0.22.1，项目级 `.venv`）：公式 / 曲线 / 证明，如排队论、Quorum 证明。
  本机无 LaTeX，公式一律用 Pango Text 写 Unicode，不用 MathTex。
- 统一视觉：深色背景 `#0F172A`，蓝 `#38BDF8` / 绿 `#34D399` / 红 `#F87171` / 黄 `#FBBF24` / 紫 `#A78BFA`，
  1280×720 30fps，无音频，中文画面文字（Noto Serif CJK SC）。

## 2. 时间线

| 时间 | 做了什么 | 产物 |
|---|---|---|
| 11-20 上午 | 学 Motion Canvas、Manim 文档，对比两者 | 各自的评估结论：按内容分工 |
| 11-20 中午 | 做 3 个 demo 对比：Motion Canvas 版、Manim 版、配合版 | `videos/motion-canvas-replication-lag.mp4`（Ch5 复制延迟，44s）、`videos/manim-queueing.mp4`（Ch1 排队论，32.1s）、`videos/combined-motion-manim.mp4`（76.1s，两段拼接） |
| 11-20 中午 | 第 5 章单章配合样片 | `videos/ch05-combined.mp4`（81.6s：复制延迟 44s + Manim Quorum 证明 37.6s，`manim/quorum.py`） |
| 11-20 下午 | 全书分镜总表：按目录 181 个标题，193 段，约 2h53m | `PLAN.md` |
| 11-20 下午 | 第 1 章成片 v1：16 段，811 秒 | `videos/ch01-combined.mp4`（后被覆盖，旧版备份在 `ch01-combined-v1-811s.mp4`） |
| 11-20 下午 | 发现脚本 1.7 节吞吐量写错：1 MB/s → 100 MB/s（100k 请求/秒 × 1KB = 3 请求/分钟 × 2GB），已改 | `ch01-script.md` |
| 11-20 下午 | 第 1 章图审计：5 张图，1-1、1-4 有，1-2、1-3 只有一半，1-5 全缺 | 补两段各 45s（1.8b、1.9b），第 1 章变 18 段、901 秒 |
| 11-20 下午 | 全书图版对照表：89 张图，Table 3-1 一张 | `figures.md`（注意：它写的页码换算“书页 = PDF 页 − 24”是错的，实测是 −22） |
| 11-20 下午 | **新 pipeline**：脚本只当 outline，生成时以正文全文为准，生成完 review 查缺补漏、多轮迭代 | 见第 3 节 |

## 3. 新 pipeline（当前在用的做法）

1. **全文逐节通读**：每小节先读对应页的原文全文，图注也一起读，写全文要点清单，
   再对照脚本标出已有 / 缺失 / 写错。
2. **按全文重生成**：脚本只当 outline，清单里有、成片里没有的都补上；能复用的段先核对过才复用。
3. **Review 多轮迭代**：拼好后拿着要点清单逐条打勾，发现缺漏就修，修完再 review，直到一轮零缺漏。
4. **新成片单独存**：不覆盖旧版，方便两版对比。

第 1 章按新 pipeline 的结果（`ch01-fulltext-notes.md`、`ch01-script-v2.md`、`ch01-review.md`）：
- 全文要点清单 **149 条**：旧脚本只覆盖 66 条（44%），写错 8 处。
  最严重的是 §1.6“几个 9 换算”，原书根本没有这段（原文讲核电站、空管、业务 bug、电商宕机等），已整段换掉。
- 新版 **1814.7 秒（30 分 15 秒），42 段**：复用 8 段，重做/新增 34 段，8 处写错全改。
- 第 1 轮 review：149 条里 126 条完整覆盖，23 条部分覆盖，0 条完全缺失，共 29 个问题；
  18 段要改的源码都改好了，其中 14 段已重渲。
- **最终版（2026-11-20 20:18 SGT 环境恢复后完成）**：探针（写文件 + ffmpeg 抽帧 + s19a 渲染）通过；
  最后 4 段 s112b（45.03s）、s113（45.03s）、s114b（45.03s）、s115（45.03s）逐段重渲、抽帧核对修法文字后拷入
  `videos/`，重拼成片 `ch01-combined-pipeline.mp4`（1814.63 秒 = 30 分 15 秒，1280×720，h264，30fps，无音频，22MB）；
  第 2 轮 review：**149/149 完整覆盖，0 个问题，第 1 轮 29 个问题全部修掉，零缺漏通过**。旧版 901 秒成片未动。

## 4. 目录结构（本包内容）

```
ddia-animation-demo/
├── PLAN.md                    全书分镜总表（193 段，后补图改为 195 段）
├── figures.md                 全书 89 张图 + Table 3-1 对照表
├── WORKLOG.md                 本文件
├── SETUP.md                   环境与渲染说明（各章通用）
├── videos/                    成片（本地，不推仓库）
├── ch01/                      第 1 章全部产物（skill 生成物，与通用 skill 分开）
│   ├── ch01-script.md         第 1 章旧脚本（outline，18 段、901 秒版）
│   ├── ch01-script-v2.md      第 1 章新脚本（42 段，每段注明书页、图号、清单编号）
│   ├── ch01-fulltext-notes.md 第 1 章全文要点清单（149 条）
│   ├── ch01-review.md         第 1 章第 1、2 轮 review 记录 + 环境故障定位 + 恢复步骤
│   ├── motion-canvas/         Motion Canvas 项目（锁定 3.17.2）
│   │   ├── package.json / package-lock.json
│   │   ├── vite.config.ts / src/project.ts / src/headless.ts
│   │   ├── scripts/render.mjs 无头单场景渲染脚本（3.17.2 无官方 CLI，自己写的驱动）
│   │   ├── src/components/    ServerNode.tsx、TitleCard.tsx 等复用组件
│   │   └── src/scenes/        ch01/ 为 v2 版各段场景（s10.tsx … s19g.tsx 等）；
│   │                          skill01/ 为 skill 版各单元场景（u0-mc1.tsx 等）
│   ├── manim/                 Manim 项目（项目级 .venv，不含在本包内，见下）
│   │   ├── README.md
│   │   ├── queueing.py        Ch1 排队论（UtilizationLatency）
│   │   ├── quorum.py          Ch5 Quorum 证明（QuorumIntersection，暂放此处）
│   │   ├── ch01/availability.py   Ch1 可用性换算；ch01/percentiles.py  百分位直方图
│   │   └── skill01/           skill 版 Manim 场景（u5-distribution.py 等）
│   └── skill-ch01/            第 1 章 skill 版过程文件（beats、时间轴、字幕、
│                              CHAPTER-R*.md、各轮次 review.md 与 FINAL）
└── （仓库根目录另有 skills/textbook-to-animation/：通用 skill，不在本包内）
```

**本包不含**：`ch01/motion-canvas/node_modules/`、`ch01/manim/.venv/`、`ch01/manim/media/`、
`ch01/motion-canvas/output/`、`videos/`（渲染产物，已在对话里发过；也在
`~/workspace/ddia-animation-demo/videos/` 里）。要复现渲染：Motion Canvas 装依赖用
`npm ci`（锁定 3.17.2），Manim 用项目级 venv 装 `manim==0.22.1`；
渲染命令见各脚本文件头和 `ch01/manim/README.md`、`ch01/motion-canvas/README.md`。

## 5. 已解决：环境故障（2026-11-20 17:01–20:18 SGT）

- 2026-11-20 约 17:01（SGT）起沙箱故障：Chromium 启动时 `mmap(/proc/self/mem, MAP_SHARED)`
  返回 EPERM，随后被内核 SIGTRAP 处死（exit 133）；ffmpeg 写文件、`cp` 大文件也时断时续报
  `Operation not permitted`。主会话 17:24 复测仍未恢复。
- 20:18 SGT 复测通过（写文件、ffmpeg 抽帧、Chrome 启动均正常），随即收尾：探针渲染 s19a（8.37s）成功；
  s112b → s113 → s114b → s115 逐段重渲（各 45.03s）、抽帧核对、拷入、重拼、第 2 轮 review 零缺漏通过。
  故障期间的定位与恢复步骤仍保留在 `ch01-review.md` 末尾，供以后参考。

## 6. Skill 版第 1 章重做（2026-11-20 晚 – 2026-11-21，已完成整章 r1）

- **整章 r1 已完成**：`videos/ch01-skill-r1.mp4`，**2218.028 秒（36 分 58 秒）**，9 单元全部 0 P0/P1
  （U1 r2、U2 r4、U3 r2、U4 r3、U5 r3 FINAL、U6 r2、U7 r2、U8 r2、U9 r2 定稿），
  拼接方法与整章级复核见 `skill-ch01/CHAPTER-R1.md`，拼接脚本 `skill-ch01/assemble-ch01.py`。
  实际 37.0 分钟，比早先估计的约 40 分钟略短，比 v2 的 30.2 分钟长约 22%。

- 用户把 textbook-to-animation skill（v1.1.0，旁白先行、分级清单 P0/P1/P2、学习单元、音频驱动场景、四道审查、轮次快照）
  加进仓库后，Muse 安装到 `~/workspace/custom-skills/textbook-to-animation/`（22 个文件），按 skill 重做第 1 章，
  v2 最终版（1814.63 秒）全程不动。过程文件在 `skill-ch01/`（inventory 149 条 P0 42/P1 91/P2 16、
  design 9 个学习单元、beats 316 拍、beats-u1..u9.json）。
- **U5 样片先行并定型**：U5“性能是一个分布”4 分 18 秒、38 拍、Helio 音色旁白，三轮审查 r3 达 0 P0 / 0 P1 / 5 P2、
  新手测试 3/3，用户原话“感觉不错”验收通过（`rounds/u5/FINAL`，2026-11-21），随后铺开整章。
- **U9 已定稿**：250.17 秒、32 拍，r2 达 0 P0 / 0 P1；配音 15 拍坏音频全部修好（拆拍拼接 9、变速重录 7）。
- **其余 7 个单元截至 2026-11-21 09:47 SGT 的状态（全部停在渲染前，半成品齐全）**：

  | 单元 | 状态 | 已完成 | 待恢复后做 |
  |---|---|---|---|
  | U1 | r1 渲染中断 | 配音 47 拍、时间轴 252.23s、5 场景、lint PASS；card + mc1 已渲好 | 渲 mc2–mc4、拼片、正式审查、修 2 个 P1 进 r2 |
  | U2 | r2 完成，r3 待渲 | r2 成片 205.34s；r3 代码改完（10 拍改 chain 真串行） | 渲 mc1/mc2、重拼、r3 审查 |
  | U3 | r1 完成，r2 待渲 | r1 成片 318.04s；r2 代码改完（6 P1 + 8 P2） | 渲 mc1/mc2/mc3、拼片、r2 审查 |
  | U4 | 渲染全未完成 | 配音 42 拍、时间轴 291.08s、4 场景、lint PASS；sequence() 时序修正已做未验证 | 渲 mc1–mc4、拼片、r1 审查 |
  | U6 | 渲染中断 | 配音 32 拍、时间轴 225.96s、7 场景、lint PASS；mc1/mc3 已渲好 | 渲剩余 5 段、拼片、正式 r1 审查 |
  | U7 | 渲染中断 | 配音 31 拍、4 段 MC 已渲好；b19/b21 已重录、2 个 P2 已修 | 重算时间轴、渲 Manim + 4 段 MC、拼片、正式审查 |
  | U8 | r1 完成，r2 待渲 | r1 成片 192.03s（3m12s，无需补拍）；r2 代码改完（P1 + 7 P2） | 渲 mc1/mc2、拼片、r2 审查 |

- **环境故障复发（2026-11-21 约 01:26 UTC / 09:26 SGT 起，间歇性翻覆）**：Chrome 启动 exit 133、
  ffmpeg 写帧 EPERM；01:40 UTC 曾短暂恢复（探针渲染 s19a 成功），01:43 UTC 复发且加剧——失败的写操作会把文件
  截断成 0 字节，U7 的三份时间轴文件因此被清空（可从 wav + beats-u7.json 重算，未丢实质数据）。各单元续做步骤
  已写进各自的 `rounds/u<N>/STATUS.md`；渲染锁协议发现竞态漏洞（U3 曾往 U4 持有的锁目录写 owner.txt），
  恢复后收紧规则：只允许锁的创建者写 owner.txt，拿锁前同时确认目录、活进程、owner 三项。
- **清理**：本地多余文件 `ddia-animation-demo/py2.txt` 已删（它曾被误推上 GitHub，下次推仓库时一并处理仓库里的那份）。
- **收尾经过（2026-11-21 09:48–11:45 SGT）**：两次探针全通过后开工，但 s19a 渲染探针两次卡在
  detached-frame 无限重试循环——根因是 0 字节的 `src/timeline/u7.json` 被 u7-mc1~mc4 导入，
  vite 导入失败导致页面帧脱离；用 skill 的 `audio_timeline.py` 从 wav + beats-u7.json 重算时间轴
  （31 拍、212.042s）并同步三份拷贝后渲染链恢复。随后 7 个单元分派并行收尾（渲染锁串行），
  其间又各进一轮：U1 r2、U2 r4、U4 r3、U6 r2、U7 r2（r1 发现 P0：Manim 三条曲线未 `self.add()` 进场景），
  全部修到 0 P0/P1。/tmp 在任务中途被清理过两次，拼接脚本与重要中间件此后一律放工作区。
  两个新增的 skill 坑（`sequence(0)` 语义、ffmpeg 抽帧加 `-nostdin`）已写入本地 skill 副本的
  `references/motion-canvas.md`“坑”表，待下次推仓库时同步到 repo。
- 待办：交用户验收整章 r1（与 v2 对比）；用户确认后写各单元 FINAL；下次推仓库时删仓库里的 `ddia/py2.txt`
  并同步 skill 副本的坑表更新。

## 7. Skill 版第 1 章 r2（2026-11-21，用户审 r1 后的三处修改，已完成）

- **整章 r2 已完成**：`videos/ch01-skill-r2.mp4`，**2276.830 秒（37 分 57 秒）**，U0 开场 + 9 单元全部 0 P0/P1
  （U0 r3、U1 r4、U2 r5、U3 r3、U4 r4、U5 r4、U6 r3、U7 r4、U8 r3、U9 r3），字幕 634 条 cue，
  拼接方法与整章级复核见 `skill-ch01/CHAPTER-R2.md`，拼接脚本 `skill-ch01/assemble-ch01-r2.py`（r1 的 `assemble-ch01.py` 原样保留）。
  比 r1 长 58.8 秒（U0 开场），比 v2 长约 25%。
- 四件事逐项：
  1. **U1 b3 重叠**：「原理」「实践」标签从横条中心（y=-80/40）移到横条上方（[-420,-125]/[-420,-5]），重渲 u1-mc1、抽帧核对通过，进 U1 r3。
  2. **全片排查**：9 单元逐拍中点帧通览 + 32 拍全分辨率复核，又查出 U7 b1、b24 两处红色裂缝穿过框内文字，改走框内留白，进 U7 r3；审查流程新增一条「每拍中点帧检查文字是否被图形压住」，已写进 CHAPTER-R1.md。
  3. **去掉 U1…U9 字眼**：27 个场景文件左上角标题只留中文标题；旁白 0 拍改动（343 拍 grep 为 0），重录 0 拍，时间轴未重算；27 段 MC 全部重渲；核对脚本 `skill-ch01/.r2item3/verify.py` 复跑 PASS（0 处独立 U1–U9 上屏/念出声）。注释、Manim 类名、beats.md 小节标题、文件名里的 U 编号共 104 行有意保留（不上屏）。汇总表 `skill-ch01/rounds/R2-ITEM3-U-NUMBERS-REMOVED.md`。
  4. **U0 开场总述**：11 拍、58.802s，三把尺子 + 九单元路线图，三轮审查 0 P0 / 0 P1，新手测试 3/3；标题「第 1 章 · 三把尺子」，无单元编号。
- **注意：U5 的 FINAL 仍指向 r3。** U5 r4 只改了两个场景标题，内容、旁白、时长一字未变，但按 skill 流程 FINAL 需用户重新确认，不能自行更新到 r4。
- r2 全程环境健康（探针全通过，无 Chrome exit 133、无 ffmpeg EPERM、无 0 字节截断）；两起锁相关教训已记入各轮 review（U0 r2 误删他人锁目录、owner.txt 应写渲染进程 pid）。
- 待办：交用户验收整章 r2（与 r1/v2 对比）；用户确认后把 U5 的 FINAL 更新到 r4、写各单元 FINAL；下次推仓库时删仓库里的 `ddia/py2.txt` 并同步 skill 副本的坑表更新。

## 8. Skill 版第 1 章 r3（2026-11-21，用户审 r2 后的三处修改，已完成）

- **整章 r3 已完成**：`videos/ch01-skill-r3.mp4`，**2260.337 秒（37 分 40 秒），53MB**，U0 开场 + 9 单元全部 0 P0/P1
  （U0 r4、U1 r5、U2 r6、U3 r5、U4 r5、U5 r5、U6 r5、U7 r4 沿用、U8 r4、U9 r4），字幕 631 条 cue，
  拼接方法与整章级复核见 `skill-ch01/CHAPTER-R3.md`，拼接脚本 `skill-ch01/assemble-ch01-r3.py`（r2 的原样保留）。
  比 r2 短 16.5 秒（旁白重录多为缩短），比 v2 长约 25%。r2 与 v2 未动。
- 三件事逐项：
  1. **动画自包含**：旁白 17 拍改写并重录（U0 b2、U1 b3/b4/b20/b31a/b31b、U2 b18/b23/b24、U3 b43、U4 b20/b32、U5 b15/b24、U9 b16/b21/b31），
     全部时长+静音结构验证健康；画面改 6 处（u1-mc4 三卡去 p6/p10/p18、u2-mc2、u3-mc3、u9-mc2 两处、u5-distribution.py 删 fig_label）；
     改后全量 grep 复核：旁白、画面、字幕 0 命中（内部文档与注释的书页对照有意保留）。清单两处处理备注已同步（1.9-13b、1.15-6）。
  2. **U3 b27 一句话重复（TTS 缺陷）**：确认音频 11.23s、31 字仅 2.77 字/秒，6s 后「第六，运行时自检」重复 3 次；
     全片语速扫描（343 拍，中位 5.33 字/秒）+ 静音结构检查 9 拍最慢者，仅 b27 确认为重复；
     ASR 三次尝试均不可用（PEP 668、/tmp 写满、无本地模型），以时长+静音结构为准，不再试 ASR。
     b27 拆成 b27a（4.15s）+ b27b（3.05s，「第六，运行时做自检」）；u3-mc2 新增绿色自检标签。
     注意：同类「第五/第六…」措辞与「监控和分析」是 TTS 文本触发型缺陷（同句重录换写法仍在同一点截断），不要原句重试。
  3. **全片重叠再扫**：每拍 4–5 帧（拍首 +0.15s、25%、50%、75%、拍末 −0.15s，动画进行中与转场帧也抽），文字多的帧全分辨率核对，
     Manim 段同样标准；共扫 313 拍、1436 帧、53 张联系表。14 处修复全部验证通过（U1×3、U4×2、U5×6、U6×1、U8×1、U9×1）。
- **审查中新发现、r3 内修掉的 3 处问题**：
  - U3 b27b 新加的自检标签撞底部字幕（P0，r4 审查发现；标签 [0,260]→[0,125] 上移，进 U3 r5，全分辨率复核通过）。
  - U6 b5 标题末字「头」被红柱顶角盖住约 3.5s（P1，既有问题；红柱 230→200，进 U6 r5）。
  - U6 b24 p50/p95 两根柱子全程缺失（P1，既有问题；根因为 `u6-monitor.py` 的 LaggedStart 列表推导用了上一个 for 循环遗留的变量 `bar`，
    恒为最后一根 p99 红柱，改为按下标取 `p_bars[i]`；进 U6 r5，三柱齐全已验证）。
  - 另有 2 个 P2 观察已接受不修：U4 b42 标题与字幕同文（r2 已有）、U4 b41→b42 转场 0.5s 淡化中文字压卡片边（仅暂停可见）。
- **渲染时发现的两处动画顺延**（旁白重录变短、原动画链没跟上）：U2 b23 chain 6.20s > 旁白 5.80s（改短至 5.0s）、
  U9 b31 figThumb 缩放 4.00s > 旁白 3.16s（改短至 2.5s）；重渲后日志无顺延警告。教训：旁白重录变短后要核对动画链总长是否仍小于新拍长。
- **流程坑（本轮新增，记入各轮 review 与 CHAPTER-R3.md）**：
  - 时间轴有两份拷贝：Motion Canvas 场景 import `ch01/motion-canvas/src/timeline/uN.json`，与 `ch01/skill-ch01/timeline/uN.json` 独立；
    时间轴重算后必须同步到 src/，否则渲染静默用旧时长（u3-mc2 因新增拍号直接报错，u0/u1/u2 六段用旧时长渲出后重渲）。
    主脚本已放工作区（`ch01/skill-ch01/.r2item3/r3-render-master.sh`），/tmp 再清空也不丢。
  - render-batch.sh 的锁检查会把调用方同一行命令里的 `manim -qm` 误判为活进程（LOCK-BUSY），MC 渲染与 Manim 渲染须分两次调用。
  - /tmp 本轮中途被清空一次（虚拟机重启或 tmpfs 重置），r3 备份与扫描证据丢失；工作区完好，审查证据帧已持久化到 `.r2item3/r3-review-u0u4/` 与 `.r2item3/r3-review-u5u9/`。
  - `audio_timeline.py` 的文件映射按 stem 建键，同一拍同时有 .mp3 与 .wav 时会撞键（U3 b20a 曾因此丢 8.34s 垫音）；重算时间轴前先清掉多余的 .mp3。
- **注意：U5 的 FINAL 仍指向 r3。** U5 r5 改了两拍旁白与一处 Manim 标签，内容实质未变，但按 skill 流程 FINAL 需用户重新确认，不能自行更新到 r5。
- 待办：交用户验收整章 r3（与 r2/v2 对比）；用户确认后把 U5 的 FINAL 更新到 r5、写各单元 FINAL；下次推仓库时删仓库里的 `ddia/py2.txt`、
  同步 skill 副本的坑表更新（`sequence(0)`、ffmpeg `-nostdin`、时间轴双拷贝同步、render-batch 锁误判、b27 类 TTS 文本触发缺陷），并决定 skill 版 Ch.1 代码是否随 r3 验收后推仓库。

## 9. 第 1 章验收通过，写 FINAL 并推仓库（2026-11-22）

- **用户确认**：2026-11-22 “现在第一章ok了”。10 个单元全部写 FINAL（各轮次 review 均为 0 P0 / 0 P1，已逐个核对）：
  U0 r4、U1 r5、U2 r6、U3 r5、U4 r5、U5 r5（原 FINAL 指向 r3，已更新）、U6 r5、U7 r4、U8 r4、U9 r4。
- **skill 坑表同步**：本地 skill 副本 `references/motion-canvas.md` 第 7 节新增 4 条——时间轴双拷贝须同步、
  render-batch 锁检查误判 `manim -qm`、audio_timeline.py 按 stem 建键撞键、b27 类 TTS 文本触发缺陷。
- **推送**：分支 `feat/ch01-skill-final-push`（从 main 头 647d6798），commit `4f2f7e76`，
  共 312 个文件、2.10 MiB：skill 版代码（motion-canvas/src/scenes/skill01/ 58 文件、manim/skill01/ 5 文件）、
  skill-ch01 过程文件（beats、timeline、subs、CHAPTER-R1/R2/R3、47 份 review.md、10 份 FINAL）、
  v2 版最新代码与文档、更新后的 skill（22 文件）、依赖清单（package.json + package-lock.json、
  manim/requirements.txt）、新增 SETUP.md。PR #2 已开，等用户合 main。
  同步记录已更新（`cs_book_animation_code.muse-github-snapshot-sync.json`，第 3 条）。
- **未推**：全部视频、音频、抽帧/联系表、node_modules、.venv、manim/media、原书 PDF（连接器只接受 UTF-8 文本）。
  `ddia/py2.txt` 已在 PR #1 里删掉，无需再处理。

## 10. 第 1 章产物与通用 skill 分开存放（2026-11-22）

- **原因**：用户指出第 1 章动画代码是 skill 生成出来的产物，应单独一个文件夹，不要跟通用 skill 混在一起。
  仓库根目录本来就是分开的（`skills/textbook-to-animation/` 通用 skill vs `ddia/` 产物），真正混的是
  `ddia/` 内部：第 1 章产物散在 `motion-canvas/`、`manim/`、`skill-ch01/` 三处，还混着全书级文档。
- **新布局**：`ddia/` 下新建 `ch01/`，第 1 章全部产物收进去——`ch01/motion-canvas/`（整个 MC 工程，
  含 v2 的 `src/scenes/ch01/` 与 skill 版 `src/scenes/skill01/`）、`ch01/manim/`（整个 Manim 工程，
  含 `ch01/`、`skill01/`、`queueing.py`、`quorum.py`）、`ch01/skill-ch01/`（全部过程文件）、
  `ch01/ch01-script-v2.md`、`ch01/ch01-fulltext-notes.md`、`ch01/ch01-review.md`、`ch01/ch01-script.md`。
  全书级文档留在 `ddia/` 根目录：`PLAN.md`、`figures.md`、`WORKLOG.md`、`SETUP.md`。
  注意：`manim/quorum.py` 是第 5 章 Quorum 证明的 demo，按用户要求随整个 manim 工程进了 `ch01/`，
  做第 5 章时再挪到 `ch05/`。
- **路径引用更新**：Manim skill01 五个场景的 timeline 绝对路径改成按 `__file__` 计算的相对路径
  （`os.path.join(dirname(abspath(__file__)), "..", "skill-ch01", "timeline", "uN.json")`），以后再搬也不断；
  assemble 脚本、.r2item3 的 render-batch/r3-render-master/verify/extract-beats/sheet、两份 README、
  SETUP.md、WORKLOG.md 第 4 节目录树与时间轴双拷贝说明、PLAN.md 与 ch01 三份文档里的裸路径引用全部更新。
  各轮次 rounds/ 快照按 skill 规则只读未动（里面的旧路径是当时如实记录）。
  2026-11-22 之前的日志条目提到旧路径的，属历史记录，不改；找文件以本节新布局为准。
- **验证**（移动后，本地工作区 `ddia-animation-demo/` 新布局下全部通过）：
  `ch01/motion-canvas` 内 `npx tsc --noEmit` exit 0；skill 的 `lint_scenes.py`（`motion-canvas/src/scenes/skill01` + `--manim manim/skill01`）
  5 项阈值全 PASS（34 场景，卡片 0%、静止 10%）；MC 小渲染探针 `s19a` 11.8s 出 8.37s 成片；
  Manim 导入正常（0.22.1），`U6Utilization -n 0` 探针渲染通过（验证了改过的 Beats timeline 相对路径），`queueing.py -pql` 全渲染 32.2s；
  新位置上 47 份 `review.md` + 10 份 `FINAL` 齐全。另修了一个真 bug：Manim venv 的 `bin/*` 入口脚本 shebang 曾指向旧绝对路径，
  移动后 `manim` 报错无法执行，已用新 venv 路径 sed 替换并验证 `bin/` 无旧路径残留。已知非回归：v2 的 `manim/ch01/` lint
  静止率仍 FAIL（availability.py 46%、7.0s 停顿），是 v2 旧风格，与移动无关。
- **推送（原方案，旧分支，已废弃）**：先在 PR #2 的分支 `feat/ch01-skill-final-push` 上追加提交——新路径文件用
  push_files 快照推送，commit `34cd6645`（290 个文件）；旧路径文件须逐个 delete_file 删除（连接器快照不支持删除），
  共 286 个旧路径，已删 243 个（`ch01-script-v2.md` + 242 个），剩 43 个（rounds/u6–u9、subs、timeline 等，均不在 main 上）。
  期间遇到两次中断：一次服务重启打断了 25 个并行删除（只 1 个生效，其余逐个核对后重删）；一次 /tmp 被清空，
  删除清单丢失，后凭 PR #2 的 diff（get_files 全量 433 个文件）重建：旧路径在 diff 里以 added 出现即仍在分支上，
  以 renamed 的 previous_filename 出现、或完全不出现（删掉且从未上过 main 的文件），即已删。重建时核对为已删 143 个、
  剩余 143 个，与之前人工计数一致；之后又删 4 批共 100 个，合计 243 个，剩 43 个。并行删除偶发
  `failed to update reference: Update is not a fast forward`，系多删并发抢分支头，重试即过；另有一次 14 个并行只生效 2 个，
  疑似审批后端抖动，重试后全过。
  过程文件（清单、进度、PR diff 原始页）现存 `ddia-animation-demo/.restructure/`（持久目录，不再放 /tmp）。
- **改方案（用户 2026-11-22 决定）**：不再在旧分支上逐个删文件。改开新分支 `feat/ch01-separate-layout`（从 main 头
  `647d6798` 建），把重构后的完整新布局一次性快照推上去，commit `db5ae935`（312 个文件、2.10 MiB，与 PR #2 文件集一致），
  开新 PR #3（https://github.com/hustnn/cs_book_animation_code/pull/3 ，标题“Restructure: 第 1 章产物收进 ddia/ch01/，与通用 skill 分开”）。
  PR #3 diff 核对：共 290 个文件，287 added（286 个 `ddia/ch01/` + `ddia/SETUP.md`）+ 3 modified（`PLAN.md`、`WORKLOG.md`、
  `skills/textbook-to-animation/references/motion-canvas.md`）；`figures.md` 与其余 21 个 skill 文件与 main 完全一致，故不在 diff 里。
- **注意（重要）**：快照推送不能删文件，所以从 main 建的新分支继承了 main 上 104 个旧路径文件
  （`ddia/motion-canvas/`、`ddia/manim/`、`ddia/ch01-*.md`，与 `ddia/ch01/` 下内容重复；已在新分支上实测确认
  `ddia/motion-canvas/package.json` 与 `ddia/ch01-script-v2.md` 仍在，与新路径下同名文件 blob SHA 相同）。
  合并 PR #3 后 main 上新旧两套路径会并存；要得到干净的单一布局，还需再删 main 上那 104 个旧路径文件。
  这一点已写进 PR #3 正文，合之前请用户确认。旧分支 `feat/ch01-skill-final-push` 的删除连接器没有对应工具
  （无 delete_branch），需用户在 github.com 网页上删，删后 PR #2 自动关闭；PR #2 目前仍 open。
  同步记录已更新（`cs_book_animation_code.muse-github-snapshot-sync.json`，第 5 条，新分支 db5ae935）。

## 11. 制作流程自动检查（2026-11-22，skill v1.3.0）

- **原因**：r1–r3 约 45 轮单元审查里，大量时间花在机械性检查上——343 拍逐拍算语速、313 拍 1436 帧肉眼查重叠、
  全量 grep 书页图号、两份时间轴手动同步、翻日志找动画顺延。这些规则明确，改成工具，人工留给忠实审、语义审和新手测试。
- **新增 / 改进的工具**（都在 `skills/textbook-to-animation/`，第 1 章工程已同步）：
  `lint_scenes.py` 新增并行补间冲突、观众可见文字（书页/图号/“书里”/内部编号）、两份时间轴一致性三项；
  `render.mjs --qa` + `lib/qa.ts` 渲染时逐拍 5 个时刻检查文字被压/被线穿过/骑边/互叠/出画和动画超时，画面与正常渲染逐帧相同；
  新增 `sample_frames.py`（按拍抽帧、联系表、每拍实测最长定格）；`audio_timeline.py` 自动配音检查、`.mp3`/`.wav` 撞键修复、`-o` 一次写两份时间轴。
- **在已定稿的第 1 章上的发现**：lint 找出 3 处并行补间冲突（U2 b8、U5 b8、U6 b22，动作根本没播），已修并逐帧验证；
  渲染 QA 全章 39 条 error 归为 14 个问题：10 个真实缺陷（5 个 P1）、4 处有意划掉/遮罩、0 误报；
  实测定格 ≥ 3s 的拍 81 个、≥ 6s 的 3 个。旧 v2 场景上 lint 报出 14 处书页/图号/“本书”。
- **详细记录**：`ch01/skill-ch01/QA-TOOLING-2026-11-22.md`（验证方法、前后对比、缺陷清单）。
- **未做**：10 个缺陷未改；三处修复只重渲了静音场景视频，未重拼单元/整章成片；U2、U5、U6 的 FINAL 未动，需进 r4 由用户确认。

## 12. 缺陷修复与预防、自检沉淀进 skill（2026-11-22，skill v1.4.0）

- **原因**：用户要求修掉第 11 节查出的缺陷，但更重要的是沉淀进 skill，并且要通用——后续章节、其他教材生成时能避免，
  或能被自检查出并修复；QA 规则是在第 1 章上调出来的，也要通用化。
- **做法**：把第 1 章的问题按成因归成十类（A–J），每类在 skill 里补一种预防写法和一个自动检查；
  检查规则用一组与教材无关的测试用例（`assets/motion-canvas/qa-fixtures/`，24 拍 + lint 用例）固定，
  `scripts/qa_selftest.py` 全部通过才算规则可用；新写 `references/qa-rules.md` 说明自检是干什么的、每条规则和阈值的理由、
  修复手册、发现误报漏报时的反馈循环。新增 `lib/layout.ts`（attach / row / edgePointIn）、`beats.ts` 的 `at()`，
  QA 新增 idle（动作做完后静止过久）和 orphan（标签先于对象出现）。
- **第 1 章修复**：第 11 节的 10 个缺陷、4 处有意效果（加 `qa-ignore` key）、idle 查出的 U5 b6/b10/b32、
  orphan 查出的 U5 b6/b10、U6 b9；全章 29 个 Motion Canvas 场景 QA error 39 → 0，逐个对照前后帧确认。
- **详细记录**：`ch01/skill-ch01/QA-TOOLING-2026-11-22.md` 第 7 节。
- **未做**：只重渲了静音场景视频，没重拼单元/整章成片；U1、U4、U5、U6、U7、U8、U9 的 FINAL 未动，需进 r4 由用户确认。

## 13. 整章渲染 QA 一条命令跑完（2026-11-22，skill v1.5.0）

- **原因**：渲染 QA 只能一个场景一个场景地跑，整章结果要自己写循环、自己汇总；Muse 做第 2 章前先补上。
- **做法**：新增 `skills/textbook-to-animation/scripts/qa_chapter.py --project <工程> --dir src/scenes/<章>`：
  场景名单取 `project.ts` 里登记的；逐个 `render.mjs --qa` 渲染；汇总写到 `output/qa-summary.md` / `.json`
  （门槛结论、每个场景一行、要修的 error 清单、静止 3–6s 的拍、未覆盖的场景）；`--strict` 未通过时退出码为 1。
  默认只重渲内容改过的场景（按 import 关系逐层找依赖、记指纹），修完再跑只渲改过的那几个。
  `qa.ts` 的 idle / overrun 发现带上 `seconds` 字段。
- **验证**（第 1 章 29 个场景）：全量跑一遍 0 error、58 条 idle warn、370 条 warn，与之前手工汇总一致；
  不改再跑渲染 0 个；只 touch 不改内容渲染 0 个；埋一个压字缺陷只重渲那 1 个场景、列出 error、退出码 1；
  埋一个渲染时抛错，记为“渲染失败”、退出码 1；还原后只重渲那 1 个、通过。自检 33/33（新增 3 条汇总检查）。
- **顺带修的两个漏洞**（埋崩溃时发现）：`render.mjs` 渲染失败时仍会写一份空的 QA 报告，看上去是“0 error”——
  改为失败时不写；汇总脚本原先对没有指纹的报告按修改时间判断，会把这种空报告当成通过——改为只认带指纹的报告。

## 14. 原书的图写进 skill 流程（2026-11-23，skill v1.6.0）

- **原因**：用户问制作时是否参考原书的图。skill 原先只在清单、写场景、忠实审里提到“看图”，但没写怎么看
  （`pdftotext` 只抽得出图注），也没要求每张图都有交代，图漏掉了审查查不出来；全书图表对照表只在本项目（`ddia/figures.md`），不在 skill 里。
- **改动**（只改文档，无代码）：第 0 步加全书图表对照表（`figures.md`，含“图注页 ≠ 讨论页”“pdfimages 数不到矢量图”两个坑）；
  第 1 步把每张图所在页用 `pdftoppm` 渲染成图片逐张看，每张图定处置（重画 / 改编 / 换画面 / 不用，P0 相关的不能不用）并写明落在哪几拍；
  分镜、写场景对照原图图片；质量门槛加“原文的图”；忠实审、反查原文按处置表逐张核对，审查报告加“图表核对”一节；
  “不要做的事”加“不只读图注、不贴原图截图”；failure-modes 第 24 条；templates 加 figures.md 模板和处置表，示例单元补处置表。
- **对本项目**：`ddia/figures.md` 已经是第 0 步的产物，后续章节直接用；从第 2 章起 inventory 要带图表处置表。

## 15. 渲染锁做进 skill（2026-11-24，skill v1.7.0）

- **原因**：第 2 章几个代理并行做不同单元，为了不同时渲染、抢内存，各自写 shell 拿锁、放锁，出过几类事故：
  把拿锁后就退出的等锁 shell 的 pid 当成锁主（U4 错拿 U3 的锁）、超时没拿到也开工、放锁误删别人的锁、
  放锁时路径写错或探针 shell 先退出而忘了放锁（U10、U11）。PR #12 的 `render-lock.sh` 修了前三类，
  但放在章节目录里（每章抄一份、每章一把锁，两章同时做时拦不住），拿锁、放锁仍是两次调用，崩了要等 120 分钟才算死锁。
- **做法**：锁做进 skill，整台机器一把（默认 `/tmp/textbook-to-animation.render-lock`）：
  `render.mjs` 自己拿锁、渲完（出错、被 Ctrl+C 也一样）放锁，`qa_chapter.py` 因此逐个场景各拿一次；
  Manim 等其他重活用新增的 `scripts/render_lock.py run <名字> -- <命令>`（拿锁、跑命令、放锁在同一个进程里）。
  持锁的是真正在渲染的进程，锁里记它的 pid，进程不在了下一个等锁的自动清；等锁超时退出码 3、不渲染。
  两边（Node、Python）同一套协议，嵌套调用不会自己等自己。顺带：`render.mjs` 加 `--help`，不认识的参数报错退出
  （原先 `--help` 会被跳过、场景名为空，直接渲染整个工程）。
- **验证**：自检新增 17 条（排队、超时不运行、死锁自动清、不删活锁、嵌套、被 kill 放锁、两边互认、render.mjs 拿不到锁不渲染、
  `--help` / 未知参数、渲完放锁），全量 50/50；7 处故意改坏都能被测出来。第 1 章两个场景端到端：别人持锁时
  `qa_chapter --lock-timeout 0.05` 4 秒停下、两个场景记为“等渲染锁超时”；默认设置排队等到放锁后渲完、门槛通过、锁已放。
  `ch01`、`ch02` 工程的 `scripts/` 已同步 `render.mjs` 和新的 `render-lock.mjs`。
- **并入 PR #12（PR #12 关闭）**：PR #12 里还有效的三条搬进这里：skill `motion-canvas.md` §6 混流示例去掉 `-shortest`
  并加一行说明；`SETUP.md` 加“渲染后必查落盘完整性”“混流默认不加 `-shortest`”“qa_chapter 只认带指纹的报告”。
  它的 `render-lock.sh`、改写的锁规则、“render.mjs 没有 `--help`”一句被上面取代，没有搬。`SETUP.md` 的锁规则改指向
  skill 的锁，删掉“Manim 不要和 Motion Canvas 写在同一行命令里”（新锁按 pid 判活，不看进程名），Manim 命令改用 `render_lock.py run`。
- **未做**：第 3 章本地还在用旧的 `render.mjs` 和 `render-lock.sh`（每章一把锁），换成 skill 的 `render.mjs` + `render-lock.mjs`
  之前，第 3 章的渲染和第 1、2 章互不排队；第 3 章代码推上来前要换掉。


## 16. 图式库、讲透机制、节奏规则写进 skill（2026-11-24，skill v1.8.0）

- **原因**：用户看了第 3 章（PR #14），提了三点：技术深度不够（SSTable、LSM 树怎么工作没讲清）；画面只有框和线，干巴；
  12:52“小段并进大段”太快、看不清。查下来根因都在 skill：
  - 单元只有时长上限，没有密度上限：U3 一个单元 24 个要点、272 秒，两种压缩合并策略合计 15 秒；
  - 没有“用具体数据把机制走一遍”的要求，学习目标是复述题；
  - 忠实原则下，原文之外的内容只能当“示意 / 引申”，没有补机制细节的正当通道；
  - 没有图式库：第 3 章 53 个场景只用矩形、文字、线、圆拼；
  - 时长锁死旁白，自检只查超时和静止过久，从不查“太快”（12:52 是三个方框各 0.45 秒飞进大框并淡出）；
  - 新手测试 25 轮里 23 轮是做视频的代理自己代入作答。
- **先做样片验证**：LSM 部分按新图式重做（`ch03/skill-ch03/sample-lsm/`，3 个场景、42 拍、4 分 16 秒，临时配音），用户看过同意方向。
- **skill 改动**：
  - SKILL.md：第三条原则“机制要讲透，而且要演出来”；第 1 步“深度延伸”（原文一两句带过的机制，补它怎么工作，写明依据、画面标“延伸 · 原文之外”）；
    第 2 步密度上限（每单元 P0 机制 ≤ 3 个、每个 ≥ 4 拍）、学习目标至少一题机制走查、选图式、每条 P0 机制写走查例子；
    第 3 步一步一拍、主角移动 ≥ 0.8s、演示拍（`hold`）、空框测试；第 6 步按图式写场景、不用 `Camera` 组件；
    第 7 步新手测试必须交给没有上下文的会话或真人；门槛表加 5 行，“不要做的事”加 5 条。
  - 新增 `references/visual-schemas.md`（选图式的四个问题、空框测试、14 种图式、全景图 / 推镜头 / 剖面放大、节奏、两个工具里常被忽略的手段、
    外部图表工具的取舍、LSM 完整示例）和 `assets/motion-canvas/schemas.ts`（样片里的 KV、Slots、Meter、Counter、Bits、Cam、zone、tag）。
  - 检查：渲染 QA 新增 `fast-move`（warn：逐帧跟踪文字，一次移动到停下或淡出为止不到 0.5s 走了 ≥ 150px），`qa_chapter.py` 汇总里单列；
    lint 新增跨 `at()` 同对象补间（warn：同一拍几个 `at()` 补间同一对象同一属性，按旁白位置和 all / chain / 字面量时长估出的时间窗重叠）；
    `audio_timeline.py`、`beats.ts`、`beats.py` 支持演示拍 `hold`（计入时长，拼接清单插入同样长的静音）。
  - 其余：pedagogy 加“走一遍胜过讲一遍”和 5 个模式；failure-modes 加 25–31；motion-canvas 坑表加 7 条；qa-rules 加 K、L 两类；
    templates、review-rubric、tool-routing 相应更新。
- **验证**：
  - `qa_selftest.py` 54/54：新增 f25（快移应报）、f26（同距离慢移不报）、f27（飞进大框同时淡出，即 12:52 的情形）、lint 跨 `at()` 用例。
    第一版 fast-move 只跟踪看得清的文字，旧 U3 的 b25a 没报出来；加 f27 复现后改成跟踪到淡出为止，现在报出 2 条（“新段”630px / 0.33s、“小段”481px / 0.33s）。
  - 样片也被报出 2 条：r6 查询块最后两跳 0.5s，c5 的块还没落位整组就淡出（边飞边消失）。已改：两跳拉到 0.6s，淡出推后 0.3s。
  - lint 跨 `at()` 在第 3 章旧场景报 5 处（u13-mc1 b11、u14-mc1 b1、u2-mc2 b23、u4-mc3 b21a、u5-mc2 b15），抽看 u13、u2 两处属实，留给第 3 章重做时处理；样片 0 处。
  - 演示拍：样片 r9 加 `"hold": 2.5`，timeline 与拼出的音轨都是 258.64s（原 256.14s），静音插在 r9 之后。
- **工程同步**：`ch03/motion-canvas/src/lib/` 换上新的 `qa.ts`、`beats.ts`，加 `schemas.ts`；`ch01`、`ch02` 已定稿，没换（换了会让 qa_chapter 全部重渲）。
- **下一步**：Muse 按 v1.8 重做第 3 章（r2），配正式音色。
