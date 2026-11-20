# DDIA 动画重做 — 工作过程记录

> 更新时间：2026-11-20。状态：第 1 章按新 pipeline 重做中，第 2 轮 review 被沙箱环境故障卡住（见第 5 节）。

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

## 4. 目录结构（本包内容）

```
ddia-animation-demo/
├── PLAN.md                    全书分镜总表（193 段，后补图改为 195 段）
├── figures.md                 全书 89 张图 + Table 3-1 对照表
├── ch01-script.md             第 1 章旧脚本（outline，18 段、901 秒版）
├── ch01-script-v2.md          第 1 章新脚本（42 段，每段注明书页、图号、清单编号）
├── ch01-fulltext-notes.md     第 1 章全文要点清单（149 条）
├── ch01-review.md             第 1 章第 1 轮 review 记录 + 环境故障定位 + 恢复步骤
├── WORKLOG.md                 本文件
├── motion-canvas/             Motion Canvas 项目（锁定 3.17.2）
│   ├── package.json / package-lock.json
│   ├── vite.config.ts / src/project.ts / src/headless.ts
│   ├── scripts/render.mjs     无头单场景渲染脚本（3.17.2 无官方 CLI，自己写的驱动）
│   ├── src/components/        ServerNode.tsx、TitleCard.tsx 等复用组件
│   └── src/scenes/ch01/       第 1 章各段场景（s10.tsx … s19g.tsx 等）
└── manim/                     Manim 项目（项目级 .venv，不含在本包内，见下）
    ├── README.md
    ├── queueing.py            Ch1 排队论（UtilizationLatency）
    ├── quorum.py              Ch5 Quorum 证明（QuorumIntersection）
    └── ch01/availability.py   Ch1 可用性换算；ch01/percentiles.py  百分位直方图
```

**本包不含**：`motion-canvas/node_modules/`、`manim/.venv/`、`manim/media/`、
`motion-canvas/output/`、`videos/`（渲染产物，已在对话里发过；也在
`~/workspace/ddia-animation-demo/videos/` 里）。要复现渲染：Motion Canvas 装依赖用
`npm ci`（锁定 3.17.2），Manim 用项目级 venv 装 `manim==0.22.1`；
渲染命令见各脚本文件头和 `manim/README.md`、`motion-canvas/README.md`。

## 5. 当前卡住的地方（环境故障，不是代码问题）

- 2026-11-20 约 17:01（SGT）起沙箱故障：Chromium 启动时 `mmap(/proc/self/mem, MAP_SHARED)`
  返回 EPERM，随后被内核 SIGTRAP 处死（exit 133）；ffmpeg 写文件、`cp` 大文件也时断时续报
  `Operation not permitted`。主会话 17:24 复测仍未恢复。
- 因此最后 4 段（s112b、s113、s114b、s115）没渲成，成片 `ch01-combined-pipeline.mp4`
  仍是第 1 轮的 1814.7 秒旧版，第 2 轮 review 尚未执行，不能报 149/149。
- 恢复后步骤（已写在 `ch01-review.md` 末尾）：先跑 `chrome --dump-dom about:blank` 和
  ffmpeg 抽帧确认恢复，再逐段重渲 s112b → s113 → s114b → s115、拷入 `videos/`、
  重拼 `ch01-combined-pipeline.mp4`、做第 2 轮 review 直到零缺漏。
