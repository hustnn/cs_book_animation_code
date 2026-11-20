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

## Skill：textbook-to-animation

把教材章节改编成 Motion Canvas + Manim 动画讲解视频的 Claude Code skill，位于
[`.claude/skills/textbook-to-animation/`](.claude/skills/textbook-to-animation/SKILL.md)。
内容包括：分级要点清单、教学设计、旁白先行的分镜、音频驱动的时间轴、无头渲染管线、三道审查和场景静态检查脚本。

在本仓库里打开 Claude Code 时，这个 skill 会作为项目级 skill 自动加载，不需要安装。
要在其他项目里用，按下面的步骤安装。

### 安装（可以整段交给 agent 执行）

> 请帮我安装 Claude Code skill `textbook-to-animation`，来源是 GitHub 仓库 hustnn/cs_book_animation_code
> 里的 `.claude/skills/textbook-to-animation` 目录。
> 默认装成个人级 skill（`~/.claude/skills/`，所有项目可用）；如果我指定了某个项目，就装到 `<项目>/.claude/skills/`。
> 按下面的命令执行，执行完把校验结果告诉我。

```bash
# 1. 选安装位置：个人级用 ~/.claude/skills；项目级改成 <项目路径>/.claude/skills
SKILLS_DIR="$HOME/.claude/skills"
mkdir -p "$SKILLS_DIR"

# 2. 删除旧版本（首次安装时没有，可忽略；更新时会用到）
rm -rf "$SKILLS_DIR/textbook-to-animation"

# 3. 从 GitHub 只下载这个 skill 目录（不需要 clone 整个仓库）
curl -fsSL https://github.com/hustnn/cs_book_animation_code/archive/refs/heads/main.tar.gz \
  | tar -xz -C "$SKILLS_DIR" --strip-components=3 \
      cs_book_animation_code-main/.claude/skills/textbook-to-animation

# 4. 校验：SKILL.md 存在，两个脚本能运行
test -f "$SKILLS_DIR/textbook-to-animation/SKILL.md" && echo "SKILL.md OK"
python3 "$SKILLS_DIR/textbook-to-animation/scripts/lint_scenes.py" --help > /dev/null && echo "lint_scenes.py OK"
python3 "$SKILLS_DIR/textbook-to-animation/scripts/audio_timeline.py" --help > /dev/null && echo "audio_timeline.py OK"
```

装好后新开一个 Claude Code 会话，skill 列表里会出现 `textbook-to-animation`。之后直接说需求即可触发，例如：
“用 textbook-to-animation，把《XXX》第 3 章 3.2 节做成动画，先给我 inventory.md 和 design.md。”

更新：重新执行上面的步骤 1–4。卸载：`rm -rf ~/.claude/skills/textbook-to-animation`。

### 使用时需要的环境

安装 skill 本身只需要 `curl`、`tar` 和 `python3`。真正做视频时还需要：

| 依赖 | 用途 |
|---|---|
| Python 3.8+（只用标准库） | skill 自带的 `scripts/` |
| ffmpeg / ffprobe | 读取非 wav 音频时长、拼接视频段、混音 |
| Node.js 18+，以及 Motion Canvas 项目依赖 | Motion Canvas 场景和无头渲染（模板在 skill 的 `assets/motion-canvas/`，依赖清单写在 `render/vite.config.ts` 文件头） |
| Python 3.10+ 和 `manim==0.22.1` | Manim 场景（模板在 skill 的 `assets/manim/`） |
| Noto Sans CJK SC / Noto Serif CJK SC 字体 | 中文画面文字 |
| 一个 TTS 引擎 | 生成每拍旁白音频；要求全书同一音色，输出同采样率的 PCM wav |

第一次在项目里使用时，skill 会按 SKILL.md 的“搭建”一节，把 `assets/` 里的模板复制到项目里对应的位置。
