# U7 “MapReduce” r3 审查

- 轮次：r3
- 成片：277.03s（4 分 37 秒），42 拍，92 条字幕
- 场景：u7-mc1（151.13s，本轮重渲）+ u7-mc2（125.90s，沿用 r2 渲染，未改动）
- 结论：**0 P0 / 0 P1** ✅（本轮只改画面节奏，无旁白/时间轴改动）

## 1. r2 问题核对（2 P1）

| r2 # | 问题 | r3 结果 |
|---|---|---|
| P1 #1 | b8 定格 6.60s（error） | ✅ 6.60 → **2.23s**（机器 1/2/3 在“跨多台机器”“批量处理”“大量数据”处依次描边变黄；sheet-02 已确认三机依次变黄） |
| P1 #2 | b8b 定格 6.63s（error） | ✅ 6.63 → **3.03s**（两张卡在“有限形式”处描边变黄、“跨多个文档”处变回绿；sheet-02 已确认） |

## 2. 忠实审 / 反查原文

- 本轮无内容改动；14 条要点全覆盖的结论沿用 r2（2.9-1 由 b8b 承载，2.9-6 的 out 行在画面，2.9-2 别名、2.9-7 this 均在画面）。
- 反查原文：无新增要点；接受项不变（第 10 章交叉引用、记录时刻、Array.sum）。

## 3. 观感审

- qa_chapter：mc1 本轮 **0 error / 62 warn**（最长 idle 5.0s，b9b）；mc2 沿用 r2（0 error / 41 warn）。合计 **0 error / 103 warn**（covered 54、edge 18、text-overlap 17、idle 12、crossed 2，按 r2 分类；mc1 本轮分类：covered 32、edge 13、idle 8、text-overlap 8、crossed 1）。
- 定格实测（sample_frames）：**全片 0 error**。最长定格：b30 5.63s、b28a 5.37s、b24 5.33s、b9b 5.13s、b6 4.90s、b9a 4.83s、b26 4.63s、b10b 4.57s、b19 4.47s、b11a 4.37s、b15 4.33s——均为 3–6s warn，接受（概念图完成后静止、旁白继续讲是“看图听讲”；QA idle warn 12 条同类，均 <6s）。
- text-overlap/crossed/covered/edge：r1 已逐条核对，全部落在拍首/拍末转场叠化帧或为有意效果；本轮只改了 b8/b8b 的描边动作，未引入新元素，抽查无新增问题。
- lint_scenes.py：**8 项全 PASS**；tsc 通过；两份时间轴一致。

## 4. 图表核对

**本单元无原图。**（同 r1/r2）

## 5. 新手测试（自测模拟，非独立会话）

本轮无内容改动，**3/3（自测模拟，沿用 r1/r2 结论）**。独立会话实测仍待安排。

## 6. TTS 试听窗口（同 r2，时间不变）

b3 12.89–20.44s（PostgreSQL、SQL）、b4 20.44–26.12s（WHERE、family、Sharks）、b8 47.44–58.35s（MapReduce、Google）、b8b 58.35–67.29s（MongoDB、CouchDB、NoSQL）、b9b 74.17–82.56s（map、reduce）、b12b 106.49–113.97s（2013-12）、b14 121.09–128.59s（拉丁名）、b16a 135.71–141.63s（reduce、1995-12）、b17 143.71–151.14s（monthlySharkReport）、b24 206.15–214.83s（JavaScript）、b26 223.05–234.87s（MongoDB 2.2、aggregation pipeline、$match、$group）、b27 234.87–248.06s（SQL、JSON）、b28a 248.06–256.26s（NoSQL、SQL）、b29 258.00–269.82s（SQL、MapReduce）。另：b4、b10a 的 1 秒级分句停顿是否自然需人耳判断。

## 7. 未验证事项

- 英文术语/数字的 TTS 读法只能人耳试听（窗口见上）。
- 新手测试为自测模拟（本 subagent 无法另开无上下文会话），非独立会话实测。
- **未写 FINAL**（按任务要求，用户确认整章后才写）。
- 渲染锁已在本轮完成后释放（release u7）。
