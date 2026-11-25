# 示例

规则说“要讲透、要有图式、要用丰富的画面”，示例说“做出来是这个样子”，检查脚本确认“你的产物也是这个样子”。
三样东西对着同一件事：

| 你在做 | 照着写（示例） | 规则 | 怎么验 |
|---|---|---|---|
| 第 2 步：教学设计 | `lsm/design.md`：P0 机制 ≤ 3、[走查] 题、图式四问、每个机制一张走查表、深度延伸带依据 | SKILL.md 第 2 步；`visual-schemas.md` 第 2 节 | `scripts/check_design.py design.md --beats-json beats.json` |
| 第 2 步：开篇 | `opening/design.md`：开篇单元——章标题、一句话主旨、和上一章的关系、开篇拍、路线图表（部分 → 问题 → 站） | SKILL.md 第 2 步“开篇与站牌” | `check_design.py`：开篇单元排第一、路线图覆盖全部单元、标题拍是第一拍且念出章名 |
| 第 3 步：分镜 | `lsm/beats.md`：每拍写“念到哪个词做什么”、终态、用的哪种图式；w0 是站牌拍。`opening/beats.md`：开篇 o1–o9 | SKILL.md 第 3 步；`visual-schemas.md` 第 5 节（节奏） | 人工：只读画面列做空框测试 |
| 第 6 步：选画面手段 | `mc-gallery/`、`manim-gallery/`：每种技法一个真实的小机制 | `techniques.md` | `lint_scenes.py` 的“画面手段”（只用框线字的场景记 warn） |
| 第 6 步：写场景 | `lsm/scenes/`、`mc-gallery/scenes/`：全景图、数据块、计数器、推镜头、剖面放大……；开头用 `opening/scenes/`（`ChapterTitle`、`Roadmap`）和 `lsm/scenes/lsm-write.tsx` 的 w0（`UnitTitle`） | `visual-schemas.md`、`motion-canvas.md` 坑表 | `lint_scenes.py`（含跨 `at()` 冲突、开头有标题）、`qa_chapter.py`（含 fast-move） |
| 第 7 步：新手测试 | `lsm/design.md` 的学习目标就是题 | SKILL.md 第 7 步 | `scripts/newbie_pack.py` 出题包，交给没有上下文的会话作答 |

## 四个示例

| 示例 | 什么 | 先看 | 渲染 |
|---|---|---|---|
| `lsm/` | 完整单元：LSM 树的写入、读取（布隆过滤器）、两种压缩合并。3 个场景、43 拍（w0 是站牌）、约 4 分 20 秒，配音是临时的 | `lsm/frames/`、`lsm/README.md` | `examples.py render lsm --project <工程>` |
| `opening/` | 整章开篇：章标题 → 这章讲什么 → 和上一章的关系 → 路线图逐部分点亮 → 下一站。1 个场景、9 拍、约 70 秒，配音是临时的 | `opening/frames/`、`opening/README.md` | `examples.py render opening --project <工程>` |
| `mc-gallery/` | Motion Canvas 技法图库：13 种技法，2 个场景、22 拍 | `mc-gallery/frames/`、`mc-gallery/README.md` | `examples.py render mc-gallery --project <工程>` |
| `manim-gallery/` | Manim 技法图库：9 种技法，3 个场景、9 拍，不需要 LaTeX | `manim-gallery/frames/`、`manim-gallery/README.md` | `examples.py render manim-gallery --manim <manim>` |

`examples.py` 把示例临时装进你的工程渲染（带 QA），结束后清理，不会留在工程里；`--keep` 可以保留下来改着试。
示例里的数据、数字都是具体的，延伸内容写了依据——它们也是“讲深”的样本，不只是动画效果的样本。

## 示例也是回归用例

改了 `qa.ts`、`lint_scenes.py`、`schemas.ts`、`opening.tsx`、`check_design.py` 之后，除了 `qa_selftest.py`，再跑
`python <skill>/scripts/examples.py check --project <工程>`：示例是“按规则做对了”的样本，规则改完它们仍应全部通过
（QA 0 error、0 fast-move、lint 门槛通过、0 处跨 `at()` 冲突、`design.md` 通过）。不通过时先判断是规则误报还是示例真有问题。
