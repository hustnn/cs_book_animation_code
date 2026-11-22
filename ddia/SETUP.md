# DDIA 动画 — 环境与渲染说明（SETUP）

Martin Kleppmann《Designing Data-Intensive Applications》的动画版：第 1 章已完成
（skill 版整章 r3，2260 秒 / 37 分 40 秒，10 个单元全部 FINAL；另有 v2 pipeline 版
1814 秒）。做法见 `skills/textbook-to-animation/SKILL.md`（旁白先行、分拍分镜、
P0/P1/P2 清单、四道审查、每轮快照）。

## 布局

skill 是通用工具，第 1 章动画代码是用 skill 生成出来的产物，两者分开存放：

- `skills/textbook-to-animation/`：通用 skill（以后做后续章节也用它），不要把章节产物放进来
- `ddia/`：DDIA 产物；`ddia/ch01/` 是第 1 章的全部产物（工程 + 过程文件 + 章文档）
- `ddia/PLAN.md`（全书 193 段分镜总表）、`ddia/figures.md`（全书 89 张图对照）、
  `ddia/WORKLOG.md`、`ddia/SETUP.md`（本文件）是全书级文档，留在 `ddia/` 根目录

## 环境（制作时实测的版本）

- Node v24.22.1、npm 10.9.4
- Python 3.12.3
- ffmpeg 8.1.2
- Motion Canvas 3.17.2（core / 2d / ui / vite-plugin 均为精确版本，见
  `ch01/motion-canvas/package.json`；`package-lock.json` 已锁定）
- Manim CE 0.22.1（见 `ch01/manim/requirements.txt`；本机无 LaTeX，公式用 Pango
  `Text` + Unicode 写法，中文用 Noto Serif CJK SC）
- 旁白配音：`/opt/hatch/bin/tts`，音色 Helio（`avocado_v2:MAI_03`），中文；
  mp3 转 24kHz 单声道 PCM wav 后由 `scripts/audio_timeline.py` 生成时间轴

## 安装

```bash
cd ch01/motion-canvas && npm ci        # 装 Motion Canvas 及渲染驱动
cd ../manim && python -m venv .venv && .venv/bin/pip install -r requirements.txt
```

## 渲染

```bash
# Motion Canvas 单场景（产物在 ch01/motion-canvas/output/<场景>.mp4）
cd ch01/motion-canvas && node scripts/render.mjs <场景名>

# Manim 单场景（-qm：720p 中等质量；不要和 Motion Canvas 写在同一行命令里，
# 否则渲染批处理脚本的锁检查会把 manim 进程误判为活进程）
cd ch01/manim && .venv/bin/manim -qm -p skill01/u5-distribution.py U5Distribution

# 单元拼片与整章拼片见 ch01/skill-ch01/assemble-ch01-r3.py；时间轴重算后必须同步两份
# 拷贝：ch01/skill-ch01/timeline/<unit>.json 与 ch01/motion-canvas/src/timeline/<unit>.json
```

## 仓库内容（只推文本，视频/音频不在仓库里）

- `ch01/motion-canvas/`：Motion Canvas 工程——场景源码（`src/scenes/ch01/` 为 v2 版，
  `src/scenes/skill01/` 为 skill 版）、渲染驱动、无头渲染入口
- `ch01/manim/`：Manim 工程——场景（`ch01/` 为 v2 版，`skill01/` 为 skill 版）与依赖清单
- `ch01/skill-ch01/`：第 1 章 skill 版过程文件——inventory（149 点）、design（10 单元）、
  beats、分镜、时间轴、字幕、CHAPTER-R*.md 复核记录、各轮次 review.md 与 FINAL
- `ch01/ch01-script-v2.md`、`ch01/ch01-fulltext-notes.md`、`ch01/ch01-review.md`：
  第 1 章 v2 版脚本、全文要点清单、review 记录
- `skills/textbook-to-animation/`：制作流程 skill（含坑表，见
  `references/motion-canvas.md` 第 7 节）
- `PLAN.md`（全书 193 段分镜总表）、`figures.md`（全书 89 张图对照）、
  `WORKLOG.md`

## 不在仓库里的东西

- 全部视频（`videos/`、各轮次成片 mp4）、全部音频（wav/mp3）、抽帧与联系表、
  `node_modules/`、`.venv/`、Manim 的 `media/` 渲染产物、原书 PDF。
  成片以最新版为准，见 `WORKLOG.md`。
