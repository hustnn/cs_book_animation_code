Motion Canvas
用代码编排图解动画，适合流程演示、原理讲解。
https://github.com/motion-canvas/motion-canvas
https://motion-canvas.io/docs/

Manim
制作数学公式、几何图形和推导过程的动画。
https://github.com/ManimCommunity/manim
https://docs.manim.community/en/stable/

学习使用这个项目，我现在想把DDAI这本书重新以动画形式更生动的呈现
https://github.com/ajaydubey777/SystemDesignArchitecture/blob/main/Designing%20Data%20Intensive%20Applications.pdf

## Agent Skills

[`skills/`](skills/) 目录按 [Agent Skills](https://agentskills.io) 开放规范组织，不绑定某一个 agent：
Claude Code、Codex、Cursor、Gemini CLI、GitHub Copilot、OpenCode、Kimi Code、Qwen Code、Trae 等支持 Agent Skills 的编码代理都能用
（[完整列表](https://github.com/vercel-labs/skills#supported-agents)）。

### 安装

用 [`skills`](https://github.com/vercel-labs/skills) CLI 安装（需要 Node.js 22.20+）：

```bash
npx skills add hustnn/cs_book_animation_code
```

默认装到当前项目，并让你选择装给哪些 agent；加 `-g` 装到用户目录，所有项目都能用。不想交互时指定 skill 和 agent：

```bash
npx skills add hustnn/cs_book_animation_code --skill textbook-to-animation -g -a codex -a claude-code -y
```

或者用 GitHub CLI 安装（`gh skill` 目前是 preview 功能）：

```bash
gh skill install hustnn/cs_book_animation_code textbook-to-animation --agent codex --scope user
```

更新：`npx skills update`（或 `gh skill update`）。卸载：`npx skills remove textbook-to-animation`。

### 让 agent 帮你装

把下面这段直接发给你正在用的 agent：

> 请在本机安装 Agent Skill `textbook-to-animation`，来源是 GitHub 仓库 `hustnn/cs_book_animation_code` 的 `skills/textbook-to-animation` 目录。
> 1. 先确定你自己对应的 agent 名（如 `claude-code`、`codex`、`cursor`、`gemini-cli`、`github-copilot`、`opencode`、`qwen-code`、`trae`），
>    名单见 https://github.com/vercel-labs/skills/blob/main/docs/agents.md 。默认装到用户级（所有项目可用）；如果我指定了项目，就装到项目级。
> 2. 本机有 Node.js 22.20+ 时，执行：
>    `npx skills add hustnn/cs_book_animation_code --skill textbook-to-animation -g -a <agent 名> -y`（项目级去掉 `-g`，在项目根目录执行）
> 3. 否则，如果有带 `gh skill` 命令的 GitHub CLI，执行：
>    `gh skill install hustnn/cs_book_animation_code textbook-to-animation --agent <agent 名> --scope user`（项目级用 `--scope project`）
> 4. 两者都没有时，按 README 的“手动安装”一节，下载到下表中你对应的 skills 目录。
> 5. 校验：安装目录下有 `textbook-to-animation/SKILL.md`，并且
>    `python3 <安装目录>/textbook-to-animation/scripts/lint_scenes.py --help` 能正常运行。告诉我装到了哪个目录。

### 手动安装

先从下表找到你的 agent 的 skills 目录：

| Agent | 用户级目录 | 项目级目录 |
|---|---|---|
| Claude Code | `~/.claude/skills/` | `.claude/skills/` |
| Codex、Kimi Code CLI、Cline、Warp、Zed | `~/.agents/skills/` | `.agents/skills/` |
| Cursor | `~/.cursor/skills/` | `.agents/skills/` |
| Gemini CLI | `~/.gemini/skills/` | `.agents/skills/` |
| GitHub Copilot | `~/.copilot/skills/` | `.agents/skills/` |
| OpenCode | `~/.config/opencode/skills/` | `.agents/skills/` |
| Qwen Code | `~/.qwen/skills/` | `.qwen/skills/` |
| Trae | `~/.trae/skills/` | `.trae/skills/` |
| Windsurf | `~/.codeium/windsurf/skills/` | `.windsurf/skills/` |
| 其他 | 见 [supported agents](https://github.com/vercel-labs/skills/blob/main/docs/agents.md) | |

然后只下载这个 skill 目录（不需要 clone 整个仓库）：

```bash
SKILLS_DIR="$HOME/.agents/skills"   # 换成上表中你的 agent 的目录
mkdir -p "$SKILLS_DIR"
rm -rf "$SKILLS_DIR/textbook-to-animation"   # 有旧版本时先删掉；首次安装可忽略
curl -fsSL https://github.com/hustnn/cs_book_animation_code/archive/refs/heads/main.tar.gz \
  | tar -xz -C "$SKILLS_DIR" --strip-components=2 \
      cs_book_animation_code-main/skills/textbook-to-animation
test -f "$SKILLS_DIR/textbook-to-animation/SKILL.md" && echo "installed: $SKILLS_DIR/textbook-to-animation"
```

## 可用的 skills

### `textbook-to-animation`

把教材、技术书、课程讲义的章节改编成 Motion Canvas + Manim 动画讲解视频。
内容包括：分级要点清单（每张原图都看图本身并定处置）、教学设计、旁白先行的分镜、音频驱动的时间轴、无头渲染管线，防压字的摆位写法（标签挂在对象上、按尺寸排开、动作跟着旁白展开），一组自动检查（场景静态 lint、渲染 QA 查文字被压或重叠和长时间静止（整章一条命令跑完并汇总）、按拍抽帧与定格测量、配音缺陷筛查）及其通用测试用例，以及以原文为准的多轮迭代：每轮做“忠实 / 反查原文 / 语义 / 观感”四道审查，每轮产物单独保留便于对比，最后由你验收定稿。

> Example prompt: `把《XXX》第 3 章 3.2 节做成动画讲解视频，先给我要点清单和教学设计`

做视频时需要的环境（安装 skill 本身不需要这些）：

| 依赖 | 用途 |
|---|---|
| Python 3.8+（只用标准库） | skill 自带的 `scripts/` |
| ffmpeg / ffprobe | 读取非 wav 音频时长、拼接视频段、混音 |
| Node.js 18+，以及 Motion Canvas 项目依赖 | Motion Canvas 场景和无头渲染（模板在 skill 的 `assets/motion-canvas/`，依赖清单写在 `render/vite.config.ts` 文件头） |
| Python 3.10+ 和 `manim==0.22.1` | Manim 场景（模板在 skill 的 `assets/manim/`） |
| Noto Sans CJK SC / Noto Serif CJK SC 字体 | 中文画面文字 |
| 一个 TTS 引擎 | 生成每拍旁白音频；要求全书同一音色，输出同采样率的 PCM wav |

第一次在项目里使用时，agent 会按 SKILL.md 的“搭建”一节，把 `assets/` 里的模板复制到项目里对应的位置。
