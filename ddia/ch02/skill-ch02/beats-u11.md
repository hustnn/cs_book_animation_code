## 单元 U11：Datalog（§2.15）

> 原文：DDIA §2.15（书 p60–62，PDF p83–84），含 Figure 2-6（PDF p84）。
> 原图读法（逐张看过 `/tmp/ch02-figs/f26-084.png` 本身，不只读图注）：
> 三张并排的 within_recursive 表，表头都是 Location / Name 两列。
> 表 1“用过规则一之后”3 行：namerica / North America、usa / United States、idaho / Idaho。
> 表 2“规则二用一次之后”5 行：namerica / North America、usa / North America（新行，灰底）、usa / United States、idaho / United States（新行，灰底）、idaho / Idaho。
> 表 3“规则二用两次之后”6 行：namerica / North America、usa / North America、idaho / North America（新行，灰底）、usa / United States、idaho / United States、idaho / Idaho。
> 行序读法：先按名字分三组（北美洲、美国、爱达荷），组内按地点链排列（北美洲、美国、爱达荷）。
> 虚线连对应行（同行跨表对齐）；椭圆标出匹配的事实：within(usa, namerica) 指向表 2 的 usa / North America 新行，within(idaho, usa) 指向表 2 的 idaho / United States 新行与表 3 的 idaho / North America 新行。
> 注意一处与清单/任务转述不同的地方，以原图为准（见 review 图表核对）：
> 规则二跑一轮长出两行新行，不是一行——除了 usa / North America，还有 idaho / United States
> （within(idaho, usa) 配上规则一生成的 within_recursive(usa, 'United States') 得到的）；
> 正文步骤 1–3 只走了北美洲链，没有提这一行，清单 2.15-11 / 2.15-13 也只写了北美洲链。
> 分镜 b20a–b20c 按原图把这一行演出来。
> 处置（inventory 图表处置表 Figure 2-6 行）：改编——三张静态表改成三轮演出（b17–b22b）：
> 规则一 → 规则二一次 → 规则二两次，新行逐个长出，虚线箭头连对应行间关系；表头、行内容、行数、行序读法按原图。
> 工具：Manim（事实 + 规则推导新事实，三张表逐轮长行）。画面不贴原图截图，全部重画。
> 旁白里不出现书页、图号、“书里/原图/原表/Part”、单元编号；英文代码值（namerica、North America、within_recursive 等）只出现在画面与字幕里，旁白用中文讲，个别绑定值在旁白里读英文原词，见 TTS 试听窗口。

| 拍 | 旁白 | 画面动作 | 屏幕文字 | 要点 | 工具 |
|---|---|---|---|---|---|
| b1 | 不用写 SELECT，规则自己就能长出新事实？ | 写着 SELECT 的卡片出现又淡出；一张空白表旁浮出问号，随后三行事实逐条出现 | 规则自己长出新事实 | 钩子 | Manim |
| b2a | Datalog 比 SPARQL、Cypher 古老得多，1980 年代学术界就在广泛研究它。 | 三层时间线出现：最底层 Datalog（1980 年代），上面叠着 SPARQL、Cypher | 1980 年代的地基 | 2.15-1 | Manim |
| b2b | 软件工程师里它不太出名，但它很重要，是后来查询语言打下的地基。 | Datalog 层亮起，地基线向下伸出，托住上面的两层 | 后来语言的地基 | 2.15-1 | Manim |
| b3a | 实际用在哪呢？Datomic 的查询语言就是 Datalog。 | Datomic 小卡出现，卡上亮起“Datalog”标签 | Datomic | 2.15-2 | Manim |
| b3b | Cascalog 是在 Hadoop 上查大数据的 Datalog 实现。 | Cascalog 小卡在旁边出现，卡上亮起“Datalog”标签 | Cascalog | 2.15-2 | Manim |
| b4a | 例子用 Prolog 语法写，好读一点，功能上没有区别。 | Prolog 卡片出现，上面一行 Datalog 规则由 Prolog 写法逐字浮现 | Prolog 语法 | 2.15-3 | Manim |
| b4b | Datalog 本来就是 Prolog 的一个子集。 | Datalog 卡片从 Prolog 卡片里面框出来（子集圈） | Prolog 的子集 | 2.15-3 | Manim |
| b5a | 数据模型和三元组很像，只是写法翻个面。 | 一个三元组 (lucy, born_in, idaho) 出现，随后翻转 | 三元组翻个面 | 2.15-4 | Manim |
| b5b | 不写主语、谓语、宾语三段，写成谓词、主语、宾语。 | 翻转后定格为 born_in(lucy, idaho)；“谓词”标签亮起在 born_in 上 | 写成谓词 | 2.15-4 | Manim |
| b6 | 先看事实：名字和类型——北美洲是大陆，美国是国家，爱达荷是州，露西是个人。 | 四条 name / type 事实逐条出现：name(namerica, 'North America')、type(namerica, continent)、name(usa, 'United States')、type(usa, country)、name(idaho, 'Idaho')、type(idaho, state)、name(lucy, 'Lucy') | 事实：名字和类型 | 2.15-5 | Manim |
| b7 | 再看关系：美国在北美洲里，爱达荷在美国里，露西出生在爱达荷。 | 三条关系事实逐条出现：within(usa, namerica)、within(idaho, usa)、born_in(lucy, idaho) | 事实：在哪里 | 2.15-5 | Manim |
| b8 | 同一个问题，谁从美国移民到欧洲——Datalog 不写 SELECT，写三条规则，加一行查询。 | 三条规则卡并排出现，下方一行查询浮现 | 三条规则，一行查询 | 2.15-6 | Manim |
| b9 | 规则一：一个地方的名字，就是它包含的地方——名字是北美洲，这个地方就在北美洲里。 | 规则一卡放大：within_recursive(Location, Name) :- name(Location, Name)；name(namerica, 'North America') 亮起，箭头指向 within_recursive(namerica, 'North America') | 规则一：名字即包含 | 2.15-6 | Manim |
| b10 | 规则二：一个地方在另一个地方里，那个地方又在某地里，这个地方也在某地里。 | 规则二卡放大：within_recursive(Location, Name) :- within(Location, Via), within_recursive(Via, Name)；within 与 within_recursive 两段先后亮起 | 规则二：递归 | 2.15-6 | Manim |
| b11 | 规则三最长：找一个人，出生在某地，又住在某地——五个条件同时满足，才算移民。 | 规则三卡放大：migrated(Name, BornIn, LivingIn) :- name(Person, Name), born_in(Person, BornLoc), within_recursive(BornLoc, BornIn), lives_in(Person, LivingLoc), within_recursive(LivingLoc, LivingIn)；五个条件逐条亮起 | 规则三：五个条件 | 2.15-6 | Manim |
| b12a | 和前面两种语言不一样，Cypher、SPARQL 一上来就写 SELECT。 | SELECT 卡片与规则卡片并排出现；SELECT 卡片先亮起 | 一上来就 SELECT | 2.15-7 | Manim |
| b12b | Datalog 一次只走一小步，先定义规则，告诉数据库什么是新谓词。 | SELECT 卡片退后变暗，规则卡片上前放大 | 先定义规则 | 2.15-7 | Manim |
| b13a | 这里定义了两个新谓词：within_recursive，和 migrated。 | 两个新谓词标签从规则卡里长出：within_recursive、migrated | 两个新谓词 | 2.15-7 | Manim |
| b13b | 它们不是存在库里的三元组，是从数据、或者别的规则里派生出来的。 | 数据库三元组卡片保持不动，新谓词标签旁亮起“派生”箭头 | 派生出来的 | 2.15-7 | Manim |
| b14a | 规则还能引用别的规则，就像函数能调用别的函数，也能递归调用自己。 | 三块积木（规则一、规则二、规则三）出现，规则二搭在规则一上，规则三搭在规则二上 | 规则搭积木 | 2.15-8 | Manim |
| b14b | 复杂查询就这样，一次一小块搭起来。 | 积木塔顶浮出一面小旗，塔身轻微一亮 | 一次搭一小块 | 2.15-8 | Manim |
| b15a | 规则里，大写字母开头的词是变量。 | 规则一里 Location、Name 两个词亮起，大写首字母描边加粗 | 大写字母是变量 | 2.15-9 | Manim |
| b15b | 比如 name，地点和名字是两个变量。 | name(Location, Name) 一行居中，Location、Name 下方各浮出“变量”小标签 | 变量要绑定 | 2.15-9 | Manim |
| b15c | 碰上北美洲这条事实，地点绑成 namerica，名字绑成 North America。 | 事实 name(namerica, 'North America') 出现，与 name(Location, Name) 并排；两根绑定箭头先后连起：Location → namerica，Name → North America | 地点与名字 | 2.15-9 | Manim |
| b16a | 规则什么时候适用？右边所有条件都找到匹配，规则才适用。 | 规则二右侧两个条件逐个打勾 | 条件全满足才适用 | 2.15-10 | Manim |
| b16b | 一旦适用，左边的结论，变量换成匹配到的值，就像被加进了数据库。 | 左边结论行淡入，落进下方的事实表 | 结论加进数据库 | 2.15-10 | Manim |
| b17 | 第一步：北美洲的名字在库里，规则一适用，生成一条新事实：北美洲在北美洲里。 | 第一张表出现（表头 within_recursive，地点、名字两列）；第一行 namerica / North America 长出；规则一卡在表上方亮起 | 第一步：规则一 | 2.15-11 | Manim |
| b18a | 规则一对每一条名字事实都适用，三行很快长齐。 | 表 1 其余两行逐行长出：usa / United States、idaho / Idaho | 三行长齐 | 2.15-12 | Manim |
| b18b | 北美洲、美国、爱达荷，各自的名字，就是各自包含的地方。 | 表 1 三行逐行闪一下；表上方标题“用过规则一之后”亮起 | 名字就是包含 | 2.15-13 | Manim |
| b19a | 第二步：美国在北美洲里，这条事实在库里；刚才生成的那条也在。 | 椭圆 within(usa, namerica) 出现；表 1 的 namerica / North America 行与椭圆同时亮起 | 第二步：规则二 | 2.15-11 | Manim |
| b19b | 规则二适用，生成一条新事实：美国在北美洲里。 | 第二张表出现（同表头同行序）；新行 usa / North America 灰底高亮长出，插在 namerica / North America 行之后；椭圆向新行画出实线箭头，表 1 与表 2 对应行之间画出虚线 | 美国在北美洲里 | 2.15-11 | Manim |
| b20a | 规则二跑一轮，不只长出这一行。 | 表 2 的 usa / North America 新行闪一下；椭圆 within(idaho, usa) 在表下出现 | 一轮不只一行 | 2.15-13 | Manim |
| b20b | 爱达荷在美国里，美国的名字是美国，所以爱达荷也在美国里。 | 表 2 里新行 idaho / United States 灰底高亮长出，插在 usa / United States 行之前；椭圆 within(idaho, usa) 向新行画出实线箭头 | 爱达荷也在美国里 | 2.15-13 | Manim |
| b20c | 第二张表其实长出两行新行，一共五行。 | 表 2 两行新行先后闪一下，行数“5”在表角亮起 | 一共五行 | 2.15-13 | Manim |
| b21 | 第三步：爱达荷在美国里，美国在北美洲里，规则二再用一次——爱达荷在北美洲里。 | 第三张表出现（同表头同行序）；新行 idaho / North America 灰底高亮长出，插在 usa / North America 行之后；椭圆 within(idaho, usa) 向新行画出实线箭头，表 2 与表 3 对应行之间画出虚线 | 爱达荷在北美洲里 | 2.15-11 | Manim |
| b22a | 三张表摆在一起看：规则一用过之后三行，规则二用一次变五行，再用一次变六行。 | 三张表并排（按原图读法：表头相同，行按名字分组、组内按地点链排列；新行灰底）；对应行之间虚线连起 | 三行、五行、六行 | 2.15-12 | Manim |
| b22b | 爱达荷在北美洲里，答案就长在表里。 | 表 3 的 idaho / North America 行亮起，整行描边加粗 | 答案长在表里 | 2.15-12 | Manim |
| b23a | 反复用规则一和规则二，within_recursive 能告诉我们，北美洲包含的所有地方。 | 三张表上“北美洲”那一组三行依次亮起（北美洲、美国、爱达荷） | 包含的所有地方 | 2.15-12 | Manim |
| b23b | 换成任何一个地点名，也一样。 | “北美洲”组暗下，“美国”组两行亮起（美国、爱达荷） | 换个名字也一样 | 2.15-12 | Manim |
| b24 | 再看规则三：找出生在某地、住在某地的人；现在问：出生在美国、住在欧洲，人是谁？ | 规则三卡重现；BornIn = 'United States'、LivingIn = 'Europe' 两处亮起，Who 变量处浮出问号 | 出生在美国，住在欧洲 | 2.15-14 | Manim |
| b25a | 查询只有一行：migrated，谁，美国，欧洲——谁留作变量，让系统去找谁能填进来。 | 查询行 ?- migrated(Who, 'United States', 'Europe'). 出现，Who 处亮起 | 谁留作变量 | 2.15-6 | Manim |
| b25b | 答案是露西，和前面两种语言查到的答案一模一样。 | Lucy 卡片落进答案位置：Who = 'Lucy' | 答案是露西 | 2.15-14 | Manim |
| b26a | 这种办法，换一种思考方式，但规则可以组合，可以在不同查询里复用。 | 规则积木拆开重组：规则二搭到另一组查询上 | 规则可以组合复用 | 2.15-15 | Manim |
| b26b | 简单的一次性查询，用它不太方便；数据复杂时，它应付得更好。 | 一边“一次性查询”小卡变灰，一边“复杂数据”卡亮起 | 数据复杂时更好 | 2.15-15 | Manim |
| b27a | 回到开头：不用写 SELECT，规则自己长出新事实。 | 三张表缩小居中，表末浮出一个空白虚线行 | 规则自己长出新事实 | 回扣 | Manim |
| b27b | 再想一想：如果再加一个地点，这张表会怎么长？ | 空白虚线行旁浮出问号，描边加粗 | 再加一个地点呢？ | 回扣 | Manim |
