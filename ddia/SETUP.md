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
  mp3 转 24kHz 单声道 PCM wav 后由 `scripts/audio_timeline.py` 生成时间轴。
  具体调用与验证见下文“配音”一节

## 视觉规范（全章统一）

- 画布 1280×720，30fps；成片 h264 + AAC（24kHz 单声道）+ mov_text 软字幕
- 深色底 `#0F172A`；蓝 `#38BDF8` / 绿 `#34D399` / 红 `#F87171` / 黄 `#FBBF24` / 紫
  `#A78BFA`，颜色语义全章一致（红 = 坏 / 慢，绿 = 好 / 已同步……）
- 字体：中文 Noto Sans CJK SC（正文）/ Noto Serif CJK SC（衬线、Manim 公式中文），
  等宽 JetBrains Mono + Noto Sans Mono CJK SC。颜色、字体一律从 theme 引用
  （`motion-canvas/src/lib/theme.ts`、`manim/theme.py`），不要在场景里手写
- 屏幕文字只做锚点（术语、关键数字、一句结论，同屏 ≤ 3 行），不要代替旁白

## 配音

- 工具 `/opt/hatch/bin/tts`，音色 Helio（`avocado_v2:MAI_03`），中文。标准调用
  （每拍一个文件）：

```bash
/opt/hatch/bin/tts speak --text "<旁白>" --voice avocado_v2:MAI_03 --language zh --format mp3 --output audio/<unit>/<拍号>.mp3
```

- 转格式：`ffmpeg -i <拍号>.mp3 -ar 24000 -ac 1 -c:a pcm_s16le <拍号>.wav`
  （24kHz 单声道 PCM wav，全章统一），再由 `scripts/audio_timeline.py` 生成
  时间轴与字幕
- 语速默认 100；`--speed` 非线性，同一句在 100 / 115 / 130 下时长差很大，
  150 会截断个别句子——只在 65–130 之间调，不要用 150
- 每拍录完先验证再往下走：核对时长与静音结构（详见 skill SKILL.md 第 5 节）。
  坏音频不要原句重试：后端缓存会返回同一个坏文件；拆拍或改写法重录，
  原文件存 `audio/<unit>/_orig/`。冒号、逗号后长停顿是分段触发点，拆句去标点可解
- 细节与坑见 skill `references/motion-canvas.md` 坑表（TTS 文本触发型缺陷）

## 安装

```bash
cd ch01/motion-canvas && npm ci        # 装 Motion Canvas 及渲染驱动
cd ../manim && python -m venv .venv && .venv/bin/pip install -r requirements.txt
# 注意：移动工程目录后需重建 venv——venv 的 bin/* shebang 写的是旧绝对路径
```

macOS 上 `pycairo` 没有现成的 wheel，上面的 pip 会从源码编译、要求本机有 cairo 和 pkg-config。不想装系统包时用 conda-forge
建隔离环境：`conda create -p <目录> -c conda-forge python=3.12 pycairo`，再用它的 python 装其余依赖
（`uv pip install --native-tls --python <目录>/bin/python -r requirements.txt`；公司网络下 pip 报证书错误时 `--native-tls` 用系统证书）。
没装 `Noto Sans CJK SC` 时 Manim 会回退到别的中文字体并刷警告，正式渲染前装好。

## 渲染

```bash
# 渲染前：类型检查 + 静态 lint（门槛、并行补间冲突、书页/图号/内部编号、两份时间轴是否一致）
cd ch01/motion-canvas && npx tsc --noEmit
python ../../../skills/textbook-to-animation/scripts/lint_scenes.py src/scenes/skill01 --manim ../manim/skill01 \
  --timeline-dir ../skill-ch01/timeline --narration ../skill-ch01

# Motion Canvas 单场景（产物在 ch01/motion-canvas/output/<场景>.mp4）。
# --qa：画面与时长不变，同时逐拍查文字被压/被线穿过/互叠/出画和动画超时，报告在 output/<场景>.qa.json
# render.mjs 自己拿渲染锁（别人在渲染就排队，见下面“环境稳定性”）；参数见 node scripts/render.mjs --help
cd ch01/motion-canvas && node scripts/render.mjs <场景名> --qa
# 注意：qa_chapter.py 只认带 output/<场景>.qa.deps.json 指纹的报告；直接调 render.mjs --qa 渲染的报告没有指纹，
# qa_chapter --no-render 会判“报告比代码旧”；让 qa_chapter 自己渲染，或重渲补指纹（两次渲染字节相同）。
# skill v1.10 起 qa_chapter 渲染前先查教学设计（章节目录里的 *-design.md 跑 check_design.py，没过不渲染）。
# 第 1、2 章已定稿、设计早于这套结构，重跑 qa_chapter 时加 --no-design；第 3 章起不要加，先把 design.md 改到检查通过。

# Manim 单场景（-qm：720p 中等质量）：用 render_lock.py run 包一层，和 Motion Canvas 共用同一把渲染锁
cd ch01/manim && python ../../../skills/textbook-to-animation/scripts/render_lock.py run <场景类> -- \
  .venv/bin/manim -qm -p <文件>.py <场景类>

# 渲染后：按拍抽帧 + 联系表 + 每拍最长定格（ffmpeg 可用工程里自带的那份）
python ../../../skills/textbook-to-animation/scripts/sample_frames.py output/<场景名>.mp4 \
  --timeline ../skill-ch01/timeline/<unit>.json --scene src/scenes/skill01/<场景名>.tsx -o <输出目录> \
  --ffmpeg node_modules/@ffmpeg-installer/<平台>/ffmpeg

# 渲染后必查落盘完整性（QA 只查浏览器内场景，不查落盘文件）：每段 output/<场景>.mp4 用 ffprobe 核时长、用 ffmpeg 解码核 0 错误；曾出现过渲染日志成功但文件含两个 moov atom、解码 0 帧的情况，重渲一次恢复。
# 混流默认不加 -shortest：它按最短的流截断，字幕流常比音频先结束，会把音频截短；只有确认最短的流就是想截到的那条时才加。
# 时间轴：audio_timeline.py 的 -o 给两次，一次写出两份拷贝（不再手动同步）：
#   <章>/skill-*/timeline/<unit>.json 与 <章>/motion-canvas/src/timeline/<unit>.json
# 单元拼片与整章拼片见各章 skill 过程目录下的 assemble 脚本
# （以上命令以 ch01 为例，新章节把 ch01 换成对应章节目录）
```

## 环境稳定性（本沙箱偶发故障，渲染前必读）

- 症状：Chrome 启动报 EPERM 后被 SIGTRAP 处死（exit 133）、ffmpeg 写文件 EPERM；
  失败的写操作会把目标文件截断成 0 字节
- 渲染前连续两次探针通过才开工（写文件 + ffmpeg + Chrome 启动 + 一个小场景渲染）；
  中途一旦出现 EPERM 或 exit 133 立即停手，不要继续渲染。一次探针通过不代表
  接下来稳定，故障会间歇复发
- 内存紧张时不要并行跑两个重渲染；渲染用 skill 的渲染锁串行，整台机器一把，不分章节
  （2026-11-24 起，取代第 2 章各单元现写的 shell 和 `skill-chNN/render-lock.sh`）：
  `render.mjs`（以及调用它的 `qa_chapter.py`）自己拿锁；Manim、拼片等重活用
  `skills/textbook-to-animation/scripts/render_lock.py run <名字> -- <命令>`，拿锁、跑命令、
  放锁在同一个进程里。等锁超时退出码 3：停下汇报，绝不无锁开工。不要手动删锁目录，
  也不要自己写 shell 拿锁/放锁；`render_lock.py status` 看锁在谁手里，持锁进程不在了
  下一个等锁的会自动清。各章 `motion-canvas/scripts/` 要用 skill 里的新版 `render.mjs`
  和 `render-lock.mjs`（从 `assets/motion-canvas/render/` 拷，两份都要），旧版不拿锁

## 新章节（照这个结构建，不要另起一套）

- 新章目录照 `ddia/ch01/` 的结构建：`ddia/ch<NN>/` 下放 `motion-canvas/`（工程）、
  `manim/`（工程）、过程目录（inventory、design、beats、timeline、subs、rounds/）、
  章文档。文件名沿用同一套约定（`beats-<单元>.json`、`timeline/<单元>.json`、
  `subs/<单元>.srt`、`rounds/<单元>/rN/` + `FINAL`）
- 流程照 skill 走（SKILL.md 第 1–7 步）：先做一个单元样片跑完全部审查、定型后再
  铺开；成片只留最新版进仓库，视频/音频不进仓库
- 全书级文档（PLAN.md、figures.md、WORKLOG.md、SETUP.md）留在 `ddia/` 根目录，
  不要挪进章节目录

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
