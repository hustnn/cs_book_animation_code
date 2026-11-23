# U11 “Datalog” r1 审查报告

- 轮次：r1（首轮成片审查；此前分镜/配音/渲染中的缺陷已在成片前修复，见“本轮前已修复”）
- 时长：259.08s（4m19s）；46 拍；80 条字幕
- 场景：Manim ×2——`u11_facts.py`（b1–b16b，事实与规则）、`u11_tables.py`（b17–b27b，三张表逐轮长行）
- 结论：**0 P0 / 0 P1 / 2 P2**（见“观感”）。不写 FINAL（用户确认整章后才写）。

## 审查结论

### 1. 忠实性（对照 inventory §2.15 要点 2.15-1～2.15-15）

| 要点 | 级别 | 载体拍号 | 核对 |
|---|---|---|---|
| 2.15-1 1980 年代地基 | P0 | b2a/b2b | 旁白 + 三代语言画面，Datalog 在底层 |
| 2.15-2 Datomic / Cascalog | P1 | b3a/b3b | 两张卡齐全 |
| 2.15-3 脚注（Prolog 语法易读、功能无区别） | P2 | b4a | 旁白一句带过；Clojure S 表达式细节未提（P2，可接受） |
| 2.15-4 三元组翻面成谓词 | P0 | b5a/b5b | 弧线翻面 + 谓词框 |
| 2.15-5 Example 2-10 十条事实 | P1 | b6/b7 | b6 七条（name×4、type×3）+ b7 三条（within×2、born_in×1），与原文逐字一致 |
| 2.15-6 Example 2-11 三条规则 + 查询 + 答案 | P0 | b9/b10/b11、b25a、b25b | 三条规则逐字核对；查询 `?- migrated(Who, 'United States', 'Europe').`；答案 Who = 'Lucy' |
| 2.15-7 SELECT vs 定义规则、两个新谓词 | P0 | b12a/b12b、b13a/b13b | SELECT 卡 vs 定义规则卡；within_recursive / migrated 两张新谓词卡 + 派生箭头 |
| 2.15-8 规则引用规则如函数调用 | P1 | b14a/b14b | 三块积木叠放 + 一次搭一小块 |
| 2.15-9 大写字母是变量、变量绑定 | P0 | b15a/b15b/b15c | 变量框注 + 绑定箭头 + Location = namerica、Name = 'North America' |
| 2.15-10 规则适用条件、左端加入数据库 | P1 | b16a/b16b | 条件全满足才适用 + 结论加入数据库 |
| 2.15-11 步骤 1–3 | P1 | b17–b21 | 三步推导逐行演出；另：原图规则二一轮实际长出两行，b20b 补了 idaho / United States（见“图表核对”） |
| 2.15-12 反复应用、Figure 2-6 说明 | P0 | b17–b22b | 三轮演出 + 行数清点（3→5→6） |
| 2.15-13 Figure 2-6 | P1 | b17–b22b | 见“图表核对” |
| 2.15-14 规则三 + 查询 | P1 | b23a–b25b | BornIn = 美国、LivingIn = 欧洲、Who 留作变量 |
| 2.15-15 规则组合复用、一次性查询不方便 | P0 | b26a/b26b | 规则二接另一个查询 + 一次性查询 vs 复杂数据两卡对比 |

无遗漏要点；无 P0/P1 缺口。

### 2. 反查原文（逐项核对 §2.15 原文，书 p60–62）

- 事实清单与 Example 2-10 逐行一致：name(namerica, 'North America'). / type(namerica, continent). / name(usa, 'United States'). / type(usa, country). / within(usa, namerica). / name(idaho, 'Idaho'). / type(idaho, state). / within(idaho, usa). / name(lucy, 'Lucy'). / born_in(lucy, idaho).（b6/b7 画面十条全出）
- 三条规则与 Example 2-11 逐字一致：规则一 `within_recursive(Location, Name) :- name(Location, Name).`；规则二 `within_recursive(Location, Name) :- within(Location, Via), within_recursive(Via, Name).`；规则三 `migrated(Name, BornIn, LivingIn) :- name(Person, Name), born_in(Person, BornLoc), within_recursive(BornLoc, BornIn), lives_in(Person, LivingLoc), within_recursive(LivingLoc, LivingIn).`（五个条件顺序与原文一致）
- 查询与答案：`?- migrated(Who, 'United States', 'Europe').`，Who = 'Lucy'，与原文答案一致
- 关键论断均有原文依据：“1980 年代被学术界广泛研究”（widely studied by academics in the 1980s）、“后来语言建立的基础”（the foundation on which later query languages are built）、“规则可以引用别的规则，就像函数可以调用别的函数，甚至递归调用自己”（rules can refer to other rules, just like functions can call other functions or even call themselves recursively）、“规则适用时就好像左端被加进了数据库”（it is as if the left-hand side was added to the database）
- 旁白、画面、字幕里无书页、图号、“书里/原图/原表/Part”、内部编号；标题只用中文标题（lint 第 7 项 PASS）

### 3. 语义

- 三元组 → 谓词的“翻面”讲法与原文一致（不把三元组写作 (subject, predicate, object)，而写作 predicate(subject, object)）
- 变量绑定演示正确：name(Location, Name) 匹配 name(namerica, 'North America')，Location = namerica、Name = 'North America'
- 三轮推导的因果链正确：规则二的每次适用都同时用了一个库内事实（within）和一个上一轮生成的新行（within_recursive），椭圆标出的匹配事实与箭头指向的新行一一对应
- 规则三的 BornIn/LivingIn 固定、Who 留作变量，与原文查询语义一致；b27a/b27b 的收尾提问（“再加一个地点呢？”）是设问，不是事实断言

### 4. 观感（逐拍看帧：230 帧，联系表 8 张）

- 文字/图形重叠：最终成片 0 处（初版发现的 4 类问题已修，见“本轮前已修复”）
- 卡片高亮：初版 `Indicate` 会把整张卡片闪成黄色整块（文字不可读），已全部改用 `Circumscribe` 描边；文字与表行的 `Indicate` 保留，读作短暂点亮
- 定格：≥3s 的拍 0 个；最长定格 2.90s（b10，7.98s）；定格 ≥1s 区间合计 91.63s（35%），多为旁白继续、画面停在稳定示意图上的阅读时间，可接受
- P2-1：三张表并排时表在画面上半部、下半部只有椭圆与箭头，构图偏上——源图本身就是宽而矮的三张表，属改编固有形态，可接受
- P2-2：新行 `Indicate` 点亮时会把该行绿底短暂闪成黄色（0.9s，b20a、b23a 等）——读作行高亮，可接受

## 本轮前已修复（初版成片审查发现，r1 快照前修好并重渲复核）

| # | 缺陷 | 级别 | 修复 |
|---|---|---|---|
| F1 | 规则一提示行（画面底部）与 b19b–b22a 的椭圆、箭头重叠，文字压文字 | P1 | b19a 开头淡出规则一 |
| F2 | b21 表 3 新行 idaho / North America 漂移到画面底部（先从 group 里 remove 再 scale/move，新行留在局部坐标） | P1 | b21 改为先 scale/move 再 remove 新行；复核帧确认新行落在表 3 第三行 |
| F3 | 卡片 `Indicate` 闪黄整块（b2b、b3b、b4b、b12a、b12b、b14b、b25b、b26b） | P1 | 卡片改用 `Circumscribe` 描边；复核帧确认只剩细黄描边 |
| F4 | b12b 定义规则卡与 SELECT 卡重叠约 1.5 单位 | P1 | SELECT 移到左下、缩小到 0.8、变淡；复核帧确认无重叠 |
| F5 | 9 拍定格 ≥3s（最长 b17 5.00s） | P1 | 各拍加尾部动作（等待 + 描边/点亮）；重抽帧后 ≥3s 的拍 0 个，最长 2.90s |
| F6 | b12b 定格 3.14s（F5 修复后仅剩的一处） | P1 | 再加一次尾部描边；重抽帧后 b12b 最长定格 1.37s |
| F7 | 场景 B 初版 -ql 超时 0.55s（b19b 动画 5.9s > 旁白 5.32s，顺延导致后续拍音画错位） | P1 | b19b 动画压到 5.2s、b21 压到 6.9s；-qm 复核 A +0.22s、B −0.37s，拼片时逐段 trim/tpad 到精确跨度（只动段尾静态等待帧） |

## 图表核对（Figure 2-6）

- 原图：`/tmp/ch02-figs/f26-084.png`（PDF p84，150dpi）及放大裁剪 `/tmp/f26-crop.png`，逐行读过图本身
- 读法（与原图一致）：三张 `within_recursive` 表，表头 Location / Name；行序按名字分三组（北美洲、美国、爱达荷），组内按地点链排列
  - 表 1“规则一之后”3 行：namerica / North America、usa / United States、idaho / Idaho
  - 表 2“规则二一次之后”5 行，新增 **2 行**：usa / North America、idaho / United States
  - 表 3“规则二两次之后”6 行，新增 1 行：idaho / North America
- 虚线连对应行（表 1→表 2：0→0、1→2、2→4；表 2→表 3：0→0、1→1、2→3、3→4、4→5）；椭圆标出匹配事实：within(usa, namerica) → 表 2 的 usa / North America；within(idaho, usa) → 表 2 的 idaho / United States 与表 3 的 idaho / North America
- 画面核对：三张表逐轮长出行数 3→5→6 与原图一致；新行绿字 + 卡片底；虚线与箭头指向与原图一致；未贴原图截图
- **差异记录**：任务简述与 inventory 处置表“图里说了什么”格写“规则 2 一次后（新增 usa / North America 一行）”是不完整的——规则二跑一轮实际长出两行（idaho / United States 是 within(idaho, usa) 配上规则一生成的 within_recursive(usa, 'United States') 得到的）。分镜 b20a–b20c 已按原图把这一行演出来。按任务指令只改处置表“单元 · 拍号”格，该描述未擅自改动，需协调人定夺是否补一条清单。

## 新手测试（自测模拟，非独立会话）

题目来自设计 U11 的三条学习目标；只用旁白 + 抽帧作答：

1. **Datalog 的事实和规则分别长什么样？**——事实是“谓词 + 小写参数 + 句号”，如 `name(namerica, 'North America').`、`within(usa, namerica).`、`born_in(lucy, idaho).`；规则是“头 :- 体.”，如 `within_recursive(Location, Name) :- name(Location, Name).`，`:-` 读作“如果”，头在左、条件在右。✓（b6/b7、b9–b11）
2. **within_recursive 是怎么一步步长出来的？**——规则一：有名字的地点都有一行，先长出 3 行；规则二跑一次：美国、爱达荷各多一行，变成 5 行；规则二再跑一次：爱达荷又多一行，变成 6 行。✓（b17–b22a，行数清点 3→5→6）
3. **为什么说规则可以组合、复用？**——规则二既用规则一生成的新行，也引用自己（递归）；规则三一次引用规则二两次；定义一次，换个查询还能接着用；简单的一次性查询用它反而麻烦，数据越复杂它越强。✓（b14a/b14b、b26a/b26b）

**3/3 答对。**但这是自测模拟（同一会话内模拟新手作答），非独立会话；用户验收时建议独立复测。

## TTS 与配音

- b14a 真缺陷已修：首版转写“规则还能引用别的规则，就像函数可以调用别的函数，甚至甚至”（截断 + “甚至”重复，音频 5.51s 后 6.06s 尾部静音）；按 skill 规则未原句重试，坏音频原件存 `audio/u11/_orig/`，改写法为“规则还能引用别的规则，就像函数能调用别的函数，也能递归调用自己。”，重录后转写完整、无重复、无截断，时长 7.14s
- audio_timeline 其余 2 error（b2a、b3b）是检查器按中文字数算语速、英文术语多导致的人工误报（b2a 含 SPARQL / Cypher / Datalog，b3b 含 Cascalog / Hadoop / Datalog）；3 个语速过快 warn（b5a、b13b、b20b）转写无吞字；46 拍 faster-whisper 全量转写核查：内容完整、无重复、无截断；未调阈值
- 试听窗口（英文术语/数字读法仍需人耳听，**未验证**）：b2a（SPARQL / Cypher / Datalog / 1980）、b3a（Datomic）、b3b（Cascalog / Hadoop）、b4a/b4b（Prolog）、b13a（within_recursive / migrated）、b15c（namerica / North America）、b23a（within_recursive）、b25a（migrated）
- tiny 模型转写常听错英文术语（如 within_recursive 听成 recursive、namerica 听成 Namaria），属模型噪声，不能作为 TTS 读错的证据

## 锁与探针（过程记录）

- 首次拿锁后探针 shell 因 `set -u` 下笔误 `probe$2`（应为 `probe$1`）退出 127，锁未释放；后用 `render-lock.sh release u11` 放锁，状态恢复 free，无渲染、无文件损坏
- 两次连续全探针通过（写文件 + ffmpeg testsrc + chrome-headless-shell --version + 小 Manim 场景渲染）后开工
- 修复后重渲时 u12 持锁 32 分钟，`acquire u11 90` 正常等待，未无锁开工；拿到锁后渲染两段 -qm 均成功
- 字体：本机未装 JetBrains Mono，代码字体改用已装的 Noto Sans Mono（SETUP 亦列出该字体），渲染无字体告警
- 协调人通知的拿锁设门教训：本单元全部拿锁命令均用 `acquire … || exit 1` 设门或 `&&` 链；自查此前无无锁渲染

## 未验证事项

- 英文术语/数字的 TTS 读法（见试听窗口），需人耳听
- 新手测试为自测模拟，非独立会话；用户验收时建议独立复测
- inventory 处置表 Figure 2-6 行“图里说了什么”格“新增 usa / North America 一行”的不完整描述，需协调人定夺是否补清单
