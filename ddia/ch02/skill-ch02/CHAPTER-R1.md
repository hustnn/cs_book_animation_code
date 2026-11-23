# DDIA 第 2 章 · 整章 r1

> 成片：`videos/ch02-skill-r1.mp4` —— **3312.64s（55 分 13 秒），70MB，1280×720/30fps，984 条字幕，473 拍，13 个单元**。
> 拼装脚本：`ch02/skill-ch02/assemble-ch02-r1.py`；章级复核脚本：`ch02/skill-ch02/verify-ch02-r1.py`；
> 合并字幕：`ch02/skill-ch02/subs/ch02-r1.srt`；章级 QA 汇总：`ch02/motion-canvas/output/qa-summary-ch02-r1.md`（+ `.json`）。
> **未写任何 FINAL**——等用户看过整章确认后才写。

## 1. 单元总表（全部 0 P0 / 0 P1）

| 单元 | 标题 | 轮次 | 时长 | 拍 / 字幕 | QA error / warn / idle | 定格 ≥3s（个数 / 最长） | 新手测试 | P2（接受） |
|---|---|---|---|---|---|---|---|---|
| U0 | 开场总述 | r1 | 61.07s | 12 / 18 | 0 / 8 / 0 | 2 / b5 3.77s | 自测模拟 2/2 | 5 |
| U1 | 模型决定你怎么写代码 | r3 | 260.23s | 34 / 73 | 0 / 25 / 0 | 14 / b14 5.17s | 自测模拟 3/3 | 0 |
| U2 | 同一份简历，两种长相 | r5 | 187.27s | 32 / 57 | 0 / 148 / 0 | 3 / b21 4.17s | r4 沿用 + b12 单拍自测 3/3 | 8 |
| U3 | 名字还是编号 | r1 | 198.97s | 29 / 59 | 0 / 104 / 3 | 11 / b12 4.00s | 自测模拟 | 见 r1 review 问题表（含 11 拍定格） |
| U4 | 历史重演 | r2 | 270.10s | 34 / 79 | 0 / 51 / 0 | 11 / b26 4.27s | 沿用 r1，自测模拟 3/3 | 7 |
| U5 | 今天怎么选 | r2 | 386.90s | 57 / 119 | 0 / 101 / 12 | 33 / b40 5.97s | 沿用 r1，自测模拟 3/3 | 见 review §5 |
| U6 | 只说要什么 | r1 | 276.87s | 38 / 74 | 0 / 175 / 4 | 17 / b33 5.43s | 自测模拟 3/3 | 12 |
| U7 | MapReduce | r3 | 277.03s | 42 / 92 | 0 / 103 / 12 | 11 / b30 5.63s | 自测模拟 3/3 | 见 review |
| U8 | 数据是图 | r2 | 286.77s | 40 / 76 | 0 / 1 / 1 | 13 / b32 4.87s | 自测模拟 3/3 | 8 |
| U9 | 查图：Cypher 与 SQL | r2 | 311.60s | 42 / 104 | 0 / 19 / 0 | 0 / 最长 b2 2.67s | 自测模拟 3/3 | 6 |
| U10 | 三元组与 SPARQL | r3 | 350.83s | 40 / 102 | 0 / 23 / 0 | 20 / b35a 4.73s | 自测模拟 3/3 | 10 |
| U11 | Datalog | r1 | 259.10s | 46 / 80 | Manim，不在 qa_chapter 范围（lint 8/8） | 0 / 最长 b10 2.90s | 自测模拟 3/3 | 2 |
| U12 | 小结 | r1 | 185.87s | 27 / 51 | 0 / 37 / 1 | 2 / b23c 3.20s | 自测模拟 3/3 | 3 |
| **合计** | — | — | **3312.60s** | **473 / 984** | **0 error / 795 warn / 33 idle** | **137 拍 ≥3s，全部 < 6s** | 全部自测模拟 | — |

- 各单元详情（四道审查结论、P2 清单、试听窗口、联系表）见 `ch02/skill-ch02/rounds/u<N>/r<M>/review.md`。
- 章内起始偏移（秒）：U0 0.000、U1 61.067、U2 321.300、U3 508.567、U4 707.534、U5 977.634、U6 1364.534、U7 1641.401、U8 1918.434、U9 2205.201、U10 2516.801、U11 2867.634、U12 3126.734。

## 2. 本轮（r1）改动

r1 为首次整章拼装，无上一版成片可比。各单元轮次如上表；拼装本身只做拼接与字幕合并，不改任何单元画面、旁白、时间轴。

两件拼装时发现并处理的事：

1. **章级 QA 报告过期（u0-mc1、u8-mc1），已重渲修复。** 首次 `--no-render` 汇总时 39 个 MC 场景中 37 个通过、2 个“报告比代码旧”。查证：两场景的代码指纹（SHA-1）与报告记录完全一致，代码未变；原因是 `.qa.json` 的修改时间晚于 `.qa.deps.json`——u0-mc1 的报告在 09:31、u8-mc1 的在 07:22 被直接 `render.mjs` 重写过（探针渲染与早轮直接渲染的遗留），未刷新指纹，按 skill 规则算过期。处理：两次连续全探针通过后持锁重渲两场景（qa_chapter 正式路径，报告与指纹同写），复核落盘完整性（时长 + 解码 0 错误），再跑全章汇总。**现 39 场景全部通过，0 error。**
2. **Figure 2-6 处置表纠正（inventory，非成片改动）。** U11 r1 复核发现处置表“图里说了什么”格写“规则 2 一次后新增 usa / North America 一行”不完整：对照原图（PDF p84）表 2 为 5 行，规则 2 一次实际新增两行（usa / North America、idaho / United States）；表 3 为 6 行（新增 idaho / North America 一行）。已修正处置表该格与清单点 2.15-13（附 2026-11-23 纠正注）；分镜 b20a–b20c 本来就按原图演出了两行，成片无需改动。

## 3. 章级 QA 结论

- `qa_chapter.py --project motion-canvas --dir src/scenes/skill02 --no-render`（2026-11-23 09:46）：**39 个 MC 场景，全部有最新报告，0 error，gate 通过**；warn 795 条（covered 419、edge 161、text-overlap 146、crossed 36、idle 33），uncovered 0。
- U11 为纯 Manim 单元，不在 qa_chapter 范围；代以 lint 8/8 PASS + 全量抽帧人工核对（230 帧）+ 成片解码 0 错误。
- 各单元轮次 QA 均为 0 error（见上表）；idle warn 33 条全在 3.0–5.4s 之间，分属 U3（3）、U5（12）、U6（4）、U7（12）、U8（1）、U12（1），各单元 review 已逐条说明理由（概念图完成后静止、旁白继续讲的“看图听讲”，或小元素动作未过 freezedetect 0.0003 阈值）。

## 4. 章级复核（verify-ch02-r1.py，全过）

- 全片解码 0 错误（`ffmpeg -f null -`，decode-errors.log 为空）。
- 合并字幕 984 条 = 各单元字幕数之和（18+73+57+59+79+119+74+92+76+104+102+80+51）；内嵌字幕轨抽出计数同样 984 条。
- 13 个单元的首条 cue 与累计偏移一致，误差 ≤ 0.001s（毫秒舍入）。
- 12 个交界点各取 −0.5s / 0.0s / +0.5s 共 36 帧，平均亮度 23.6–29.9（深色底正常值），无黑帧。
- 成片时长 3312.642s，与各单元时长之和 3312.600s 差 +0.042s（帧取整，与第 1 章同类情况一致）。
- 13 个单元成片流参数一致：h264 High 1280×720 yuv420p 30fps、AAC 24kHz 单声道、mov_text 字幕，可直接流拷贝拼接。

## 5. 已知局限与未验证事项

### 5.1 TTS 英文术语/数字读法——全部需人耳试听（未验证）

时间均为**单元内时间**；章内时间 = 上表“章内起始偏移”+ 单元内时间。各单元 review.md 有完整窗口。

- **U0**（偏移 0s）：b6b 约 38s NoSQL；b8a 约 43.5s SQL、44.9s Cypher、45.8s SPARQL、46.7s Datalog；b8b 约 48.7s MapReduce。中文数字已写成汉字，无数字读法风险。
- **U1**（偏移 61.07s）：b2 维特根斯坦/《逻辑哲学论》/1922、b3 二十五到三十年、b7b 传感器（STT 两模型首音节听感模糊）、b12 别扭（STT 听感误差，已判 TTS 读对）、b15 SQL/科德/1970、b16 1980 年代中期、b17 1960–70 年代、b21a/b21b XML、b25 NoSQL、b26 2009/推特、b27 Not Only SQL、b30 polyglot persistence。重点：b7b、b30、b27。
- **U2**（偏移 321.30s）：r5 无重录、无新英文术语，无新增窗口；沿用 r4 试听窗口，见 `rounds/u2/r4/review.md`。
- **U3**（偏移 508.57s）：b2 user_id 251、region_id、us:91（7.1–18.4s）、b11 normalization、schema（74.5–84.9s）、b14b/b15 join（104.4–118.1s）、b18b 10,001+（旁白念“一万多名员工”，142.8–147.0s）、b22 join（170.3–179.9s）。
- **U4**（偏移 707.53s）：b4 hierarchical model、b5 JSON/join、b8 CODASYL、b12 access path、b15 cursor、b16 n、b23 query optimizer（具体秒数见 r2 review）；另 audio_timeline 1 warn（b13 冒号后 1.08s 自然停顿，已接受）。
- **U5**（偏移 977.63s）：b3 schema、b4 join、b17 schemaless/schema、b19a schema-on-read、b19b schema-on-write、b28 MySQL、b37 Spanner/Oracle/Bigtable（具体秒数见 r2 review §7）。
- **U6**（偏移 1364.53s）：b2/b7/b8/b16 SQL、b23/b29/b30 CSS、b26 JavaScript、b35 MapReduce（具体秒数见 r1 review）；σ 在旁白里读“西格玛”，family/Sharks/li.selected/XSL/XPath 只在画面文字里，不用试听。
- **U7**（偏移 1641.40s）：b3 PostgreSQL/SQL、b4 WHERE/family/Sharks、b8 MapReduce/Google、b8b MongoDB/CouchDB/NoSQL、b9b map/reduce、b12b 2013-12、b14 拉丁名、b16a reduce/1995-12、b17 monthlySharkReport、b24 JavaScript、b26 MongoDB 2.2/aggregation pipeline/$match/$group、b27 SQL/JSON、b28a NoSQL/SQL、b29 SQL/MapReduce；另 b4、b10a 的 1 秒级分句停顿是否自然需人耳判断。
- **U8**（偏移 1918.43s）：b6 PageRank、b10 Idaho/Beaune、b14 Côte-d'Or/Bourgogne/Burgundy、b16 Cypher/SPARQL/Datalog、b17 Gremlin/Pregel、b21 born_in、b24 schema（见 r1 review）。
- **U9**（偏移 2205.20s）：b2 Cypher/Neo4j/cipher（0:07–0:20）、b3b–b6 USA/Idaho/Lucy/WITHIN/BORN_IN（0:24–0:59）、b8a–b12 BORN_IN/LIVES_IN/MATCH/RETURN/United States/Europe（1:05–1:56）、b17 SQL、b21a WITHIN（*0..）、b22a–b22c WITH RECURSIVE/PostgreSQL/DB2/Oracle/SQL Server、b23 Cypher/SQL、b24–b28 in_usa/UNION/born_in_usa/lives_in_europe/SELECT/join、b32 SPARQL（5:02–5:12）。
- **U10**（偏移 2516.80s）：b5 Lucy/age 33（26.3–36.1s）、b7 Turtle（43.7–50.9s）、b10 冒号 Lucy、冒号 Idaho（61.3–70.7s）、b11 Idaho 出现了五次（70.7–79.6s）、b18 Datomic（139.5–148.5s）、b19 Turtle/XML/RDF（148.5–156.1s）、b21 WITHIN（163.5–172.7s）、b25 SPARQL/sparkle/Cypher（199.0–210.0s）、b28 within（223.6–232.3s）；另 b11 有一句间长停顿 1.12s（4.48s 处，自然断句，画面第二组高亮正好在停顿后亮起，已接受不重录）。
- **U11**（偏移 2867.63s）：b2a SPARQL/Cypher/Datalog/1980、b3a Datomic、b3b Cascalog/Hadoop、b4a/b4b Prolog、b13a within_recursive/migrated、b15c namerica/North America、b23a within_recursive、b25a migrated。另：faster-whisper tiny 模型常听错英文术语（如 within_recursive 听成 recursive），属模型噪声，不能作为 TTS 读错的证据。
- **U12**（偏移 3126.73s）：b17 Cypher/SPARQL（106.8–111.8s）、b18 Datalog/Lucy（111.8–117.2s）、b19 MapReduce（117.2–126.7s）、b22 CSS/XPath（140.5–150.0s）、b23a–b23d DNA/PB（150.0–178.3s，尤以 b23b 154.0–165.9s 语速慢为重）。

另有三处 audio_timeline 检查器结论已验证接受：U2 b18b 疑似重复、b16 语速过快（r1 已 STT 验证的误报）；U11 b2a、b3b 为按中文字数算语速的人工误报（46 拍 faster-whisper 全量核查无缺失）；U4 b13、U6 b25b、U10 b11 的句间停顿均为自然断句。

### 5.2 新手测试——全部为自测模拟，验收时需独立复测

13 个单元的新手测试均为制作人自测模拟（只给旁白 + 抽帧，答设计里的学习目标题），**没有一次是另开无上下文会话的独立实测**（subagent 无法另开独立会话）。结果：U0 2/2、U1 3/3、U2（r4 完整测试沿用 + r5 b12 单拍 3/3）、U3 自测通过、U4 沿用 r1 3/3、U5 沿用 r1 3/3、U6 3/3、U7 3/3、U8 3/3、U9 3/3、U10 3/3、U11 3/3、U12 3/3。用户验收时建议独立重测，重点：U2 的 251 三支落点指认（圆点在表左缘、需凭行高对上黄色的 251）、U5（U4 自测曾为自测模拟的说明见各 review）。

### 5.3 定格 ≥3s——137 拍，全部 < 6s，均已接受为“看图听讲”

按单元：U0 2、U1 14、U2 3、U3 11、U4 11、U5 33、U6 17、U7 11、U8 13、U9 0、U10 20、U11 0、U12 2。最长为 U5 b40 5.97s，其次 U7 b30 5.63s、U6 b33 5.43s、U8 b2 5.37s。**没有任何一拍 ≥ 6s**（error 线）。接受口径与第 1 章一致：概念图完成后静止、旁白继续讲；另有部分是小元素动作（线宽脉冲、细线淡入、小字变色）未过 freezedetect 0.0003 阈值，人眼可见变化——U8 b29/b32、U10 b10/b15、U11 同类情况均属此类。经验沉淀：小字变色、细线淡入过不了阈值，定格只能靠大元素缩放脉冲破（U10 r3 review 过程记录）。

### 5.4 接受为现状的 P2（要点）

- **U0**：5 个 P2（见 r1 review；b8a audio_timeline error 经 STT 验证为误报，未重录）。
- **U1**：0 P2（r3 结论 0 P0 / 0 P1 / 0 P2）。
- **U2**：8 个（r4 的 6 个照旧 + r5 新增 2 个：251 三支止于目标表左缘、131 Philanthropy 行保留）。
- **U3**：定格 warn 11 拍等（见 r1 review 问题表；另 2 处有意 qa-ignore：mc1 b10b 漏改打叉、mc2 b18a 光标点在可点文字上）。
- **U4**：7 个（audio 目录 .mp3 与 .wav 同名并存的提示音等，见 r2 review）。
- **U5**：见 r2 review §5（含 b40 5.97s 定格接受）。
- **U6**：12 个（含 b19/b33 的 5.3–5.4s 定格、.mp3 留底提示）。
- **U7**：见 r3 review（长定格 11 拍等）。
- **U8**：8 个（含 b29/b32 亚阈值脉冲、b27 idle 3.7s、r1 沿用的 P2 #5–#9/#12–#14：Facebook 未点名、PostgreSQL 未提、b28 省略括号 caveat、b5b 只讲道路未讲铁路、过敏原食物名是教学示意、“节点”代“顶点”TTS 规避）。
- **U9**：6 个（b27 派生边未画、b12 顶点闪烁未实现、b2 电影 chip、b9 空卡、音频 1 error / 3 warn 已验证接受、“节点”代“顶点”TTS 规避）。
- **U10**：10 个（含 2.14-1 的“值得讨论因为工具多”动机句未进旁白——次要细节，不补；20 拍定格 ≥3s 接受为“看图听讲”）。
- **U11**：2 个（三表并排构图偏上，源图固有；新行点亮时绿底短暂闪黄 0.9s，读作高亮）。
- **U12**：3 个（见 r1 review；N1/N2 带“总结”角标）。

### 5.5 与设计的偏差（需用户定夺的事项）

1. **U5 时长 386.90s（6 分 27 秒），超出 skill 的 3–6 分钟单元上限。** §2.6 是全章最密的一节（23 个清单点），中位语速 4.58 字/秒，无填充。协调人建议接受（见 r2 汇报）。
2. **U0 时长 61.07s，设计约 48s。** 开场总述多出约 13s，未压缩。
3. **U2 不需要动。** r5 只修了协调人复核发现的 Figure 2-1 外键连线缺口（5 根箭头），样片其余部分未动；整章拼接未发现 U2 的新问题。
4. **U9 sample_frames.py 的“定格 ≥1s 区间合计”在 r2 报出负数（−58.64s），为脚本求和口径问题**（慢缩放动作使 freezedetect 区间重叠/符号异常）；逐拍最长定格表为准（最长 2.67s），不影响结论。
5. **U10 的 2.14-1 动机句未进旁白**（见 5.4），如用户认为需要补，需另开一轮。
6. **图表处置**：6 张原图全部按处置表“改编”落实（Figure 2-1/2-2 在 U2、2-3/2-4 在 U3、2-5 在 U8、2-6 在 U11），审查报告各有“图表核对”一节；U11 的 Figure 2-6 描述已按原图纠正（见 §2 第 2 条）。U9/U10 无新增原图（沿用 U8 图数据 / §2.14 只有文字例子）。

## 6. 过程记录（本轮）

- 拼装前核对 13 个单元成片流参数一致（h264 High 1280×720 yuv420p 30fps、AAC 24kHz 单声道、mov_text），13 份 `subs/u<N>.srt` 齐全。
- u0-mc1/u8-mc1 重渲：按 SETUP.md 两次连续全探针通过才开工（写文件 + ffmpeg testsrc + Puppeteer Chrome 启动 + u0-mc1 非 QA 渲染，两次均通过，30.4s/30.2s）；持锁 `ch02-assembly`（`render-lock.sh acquire … || exit 1` 设门，trap 自动放锁，已核实 free）；qa_chapter 正式路径重渲两场景（50s/65s），0 error；落盘完整性复核通过。探针脚本已沉淀为 `ch02/skill-ch02/env-probe.sh`（非 QA 渲染，不碰 `.qa.json` 指纹）。
- 锁：本轮无锁事故。U11 r1 曾观察到 u12 持锁 32 分钟、正常等待；无无锁开工。
- `/tmp` 在本轮又被清过一次（`ch02-figs/` 全灭）：已重提 5 张原图页（f21-22-053/054、f23-24-057、f25-072、f26-084，字节数与此前一致），`/tmp/ch02-fulltext.txt` 幸存。
- 渲染与拼装未动 ch01/ 的任何文件；未动任何轮次快照；未推仓库。

## 7. 待用户验收后做的事

- 用户看过整章确认后，按他的原话写 13 个单元的 FINAL（`rounds/u<N>/FINAL`）。
- 仓库推送由用户决定（本次未推）。
- 新手测试独立复测、TTS 试听窗口人耳验收，见 §5.1–5.2。

## 用户确认

- 确认日期：2026-11-23
- 用户原话：“OK，看着ok”
- 13 个单元 FINAL 已更新为本轮：U0 r1、U1 r3、U2 r5、U3 r1、U4 r2、U5 r2、U6 r1、U7 r3、U8 r2、U9 r2、U10 r3、U11 r1、U12 r1。整章成片 videos/ch02-skill-r1.mp4（3312.64 秒）即为定稿。
- 接受为现状的已知事项：U5 386.90 秒超单元 6 分钟上限；137 拍定格 ≥3 秒、全部 <6 秒；新手测试全部自测模拟；TTS 英文读法未验证；U10 §2.14 动机句未进旁白。
