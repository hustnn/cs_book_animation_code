## 单元 U8：数据是图（§2.10–2.11）

> 原文：DDIA §2.10 图状数据模型（书 p49–50，PDF p71–72）、§2.11 属性图（书 p50–52，PDF p72–74），含 Figure 2-5（PDF p72）。
> 原图读法（逐张看过 `/tmp/ch02-figs/f25-072.png` 本身，不只读图注）：方框 = 顶点，每只方框两到三行属性（type / name，Idaho 多一行 abbreviation: ID，大区多一行 name_en）；箭头 = 边，边标签小写 lives_in / born_in / within。
> 底层一行：Lucy（type: person）— married — Alain（type: person）— born_in → Beaune（type: city）；Lucy — born_in → Idaho（type: state，abbreviation: ID），Lucy — lives_in → London（type: city），Alain — lives_in → London。
> 左链：Idaho — within → United States（type: country）— within → North America（type: continent）。
> 中链：London — within → England（type: country）— within → United Kingdom（type: country）— within → Europe（type: continent）。
> 右链：Beaune — within → Côte-d'Or（type: département）— within → 大区（type: région，name_fr: Bourgogne，name_en: Burgundy）— within → France（type: country）— within → Europe。
> 注意两处与清单/任务转述不同的地方，以原图为准（见 review 图表核对）：(1) name_fr / name_en 属于大区（région）顶点，不是 Côte-d'Or；清单处置表 Figure 2-5 行把这两行属性写在了 Côte-d'Or 名下，画的时候按原图画；(2) married 在原图里是一条无箭头的横线（关系相互），不是带箭头的边，画的时候按原图画无箭头横线。
> 处置（inventory 图表处置表 Figure 2-5 行）：改编——静态整图改成逐步生长（b9–b15）：先出两个人，再出出生地/居住地，最后 within 链逐级亮起；顶点、边、标签读法按原图。边标签用小写，与图一致；Cypher 段用大写（U9 的事，本单元不出现）。

| 拍 | 旁白 | 画面动作 | 屏幕文字 | 要点 | 工具 |
|---|---|---|---|---|---|
| b1 | 人、地点、事件，全塞进一个库里，怎么放才不乱？ | 三张卡并排出现：人、地点、事件，随后三张卡叠在一起打问号 | 人、地点、事件 | 钩子 | MC |
| b2 | 多对多关系，是区分不同数据模型的重要特征；应用里大多是一对多，像棵树，或者记录之间没什么关系，文档模型就够用了。 | 一棵树出现（一对多），旁边一张孤立的记录卡（无关系）；“多对多”标签亮起，树与孤卡之间连线变密 | 一对多像棵树 | 2.10-1 | MC |
| b3 | 可要是多对多关系到处都是呢？关系模型能处理简单的多对多，但联系一复杂，数据就该画成一张图。 | 树上的连线越长越多、缠成一张网；网的标签亮起 | 联系一复杂，就画成图 | 2.10-2 | MC |
| b4 | 图只有两种东西：顶点，也叫节点或实体；边，也叫关系或弧。 | 一个圆点出现（顶点），一根带箭头的线连向另一个圆点（边）；两个词的标签分别挂在点和线上 | 点与线 | 2.10-3 | MC |
| b5a | 先看三个例子，社交图里，人是节点，认识是边。 | 第一张小图长出：人头相连，下方亮起“社交图” | 社交图 | 2.10-4 | MC |
| b5b | 网页图里，网页是顶点，链接是边。路网里，路口是顶点，道路是边。 | 第二、第三张小图长出：网页相连、路口相连，每张图下方亮起名字 | 网页图、路网 | 2.10-4 | MC |
| b6 | 图上有现成的算法：导航在路网里找两点间的最短路径；PageRank 在网页图上算网页的流行度，定搜索排名。 | 路网图上两点间一条路径亮起；网页图上一个网页节点变大、排名数字 1 亮起 | 最短路径、PageRank | 2.10-5 | MC |
| b7 | 图不只装同一种东西：一张图里能同时放人、地点、活动、签到、评论，完全不同类型的对象。 | 一张图里五种不同颜色、不同形状的顶点混在一起出现（人、地点、活动、签到、评论各一枚） | 一张图，多种东西 | 2.10-6 | MC |
| b8 | 边也一样杂：谁和谁是朋友，哪次签到在哪个地点，谁评论了哪个帖子，谁参加了哪个活动。 | 五枚顶点之间逐根连线，每根线亮起时旁边浮出关系词：朋友、签到在、评论了、参加了 | 边也五花八门 | 2.10-6 | MC |
| b9 | 来看一张具体的图，Lucy 和 Alain，两个人，已婚，都住在伦敦。 | 两只方框出现：Lucy（type: person，name: Lucy）、Alain（type: person，name: Alain），中间一条无箭头的横线连起，线上方浮出 married（按原图：married 线无箭头） | Lucy、Alain，已婚 | 2.10-7 | MC |
| b10 | Lucy 出生在 Idaho，Idaho 是个州，缩写是 ID。Alain 出生在法国的 Beaune，一座城市。 | Idaho 方框（type: state，name: Idaho，abbreviation: ID）从 Lucy 左上方长出，Lucy → Idaho 的 born_in 箭头画出；Beaune 方框（type: city，name: Beaune）从 Alain 右侧长出，Alain → Beaune 的 born_in 箭头画出 | 出生地 | 2.10-7 | MC |
| b11 | Lucy 和 Alain 都住在伦敦，同一座城市，两个人共用一个顶点。 | London 方框（type: city，name: London）在两人上方居中出现；Lucy → London、Alain → London 两根 lives_in 箭头先后画出，汇到同一个 London 方框上 | 共用一个伦敦 | 2.10-7 | MC |
| b12 | 再看地方怎么一层层包起来，Idaho 在美国里，美国在北美洲里。 | United States 方框（type: country）在 Idaho 上方出现，Idaho → United States 的 within 箭头画出；随后 North America 方框（type: continent）在更上方出现，United States → North America 的 within 箭头画出 | Idaho → 美国 → 北美洲 | 2.10-7 | MC |
| b13 | 伦敦在英格兰里，英格兰在英国里，英国在欧洲里。 | England 方框（type: country）在 London 上方出现，London → England 的 within 箭头画出；随后 United Kingdom 方框（type: country）出现，England → United Kingdom 的 within 箭头画出；随后 Europe 方框（type: continent）在顶部出现，United Kingdom → Europe 的 within 箭头斜向上画出 | 伦敦 → 英国 → 欧洲 | 2.10-7 | MC |
| b14 | Beaune 在 Côte-d'Or 省里，省在勃艮第大区里，大区在法国里，法国在欧洲里。 | Côte-d'Or 方框（type: département，name: Côte-d'Or）在 Beaune 上方出现，Beaune → Côte-d'Or 的 within 箭头画出；随后大区方框（type: région，name_fr: Bourgogne，name_en: Burgundy）出现，Côte-d'Or → 大区的 within 箭头画出；随后 France 方框（type: country）出现，大区 → France 的 within 箭头画出；最后 France → Europe 的 within 箭头斜向上画出，汇到已有的 Europe 方框上 | Beaune → 法国 → 欧洲 | 2.10-7 | MC |
| b15 | 这张图就是这样长出来的，方框表示顶点，箭头表示边。 | 一颗亮点沿三条 within 链逐条走过（左链、中链、右链），走过的边依次变亮；最后整张图轻微放大定格 | 方框是顶点，箭头是边 | 2.10-7 | MC |
| b16 | 同一张图，有两种玩法：属性图模型，和三元组存储模型；查图的语言有三种声明式的：Cypher、SPARQL、Datalog。 | 两条路分叉：左边“属性图模型”卡（Neo4j、Titan、InfiniteGraph），右边“三元组存储”卡（Datomic、AllegroGraph）；下方三张语言卡并排出现：Cypher、SPARQL、Datalog | 两种模型，三种语言 | 2.10-8 | MC |
| b17 | 另外还有命令式的图查询语言，比如 Gremlin，和图处理框架 Pregel。 | 两张小卡在旁边出现：Gremlin（命令式）、Pregel（图处理框架） | Gremlin、Pregel | 2.10-8 | MC |
| b18a | 先看属性图模型，每个顶点由四样东西组成。 | Lucy 顶点居中放大 | 顶点四件套 | 2.11-1 | MC |
| b18b | 唯一标识符，一组出边，一组入边，一组属性，属性就是键值对。 | 四样东西从顶点四周依次浮出：编号、出边、入边、属性（键值对） | 编号、出边、入边、属性 | 2.11-1 | MC |
| b19a | 拿 Lucy 这个顶点拆开看，编号是她的唯一标识符。 | Lucy 方框拆开，左上角“编号”标签亮起 | 编号 | 2.11-1 | MC |
| b19b | 出去的边、进来的边各一组，名字、类型这些属性都存在键值对里。 | 出边一组向右伸出、入边一组从左进入；方框内 type: person、name: Lucy 两行属性逐行亮起 | 出边、入边、属性 | 2.11-1 | MC |
| b20a | 每条边也有五样，唯一标识符，起点顶点，终点顶点。 | 一条边居中放大，编号、起点、终点依次浮出 | 边五件套 | 2.11-2 | MC |
| b20b | 关系种类的标签，一组属性。 | 标签、属性依次浮出 | 标签、属性 | 2.11-2 | MC |
| b21 | 拿这条 born_in 边举例，起点是 Lucy，终点是 Idaho，标签就是 born_in，起点叫尾顶点，终点叫头顶点。 | Lucy → Idaho 的 born_in 边重现：起点 Lucy 亮起“尾顶点”标签，终点 Idaho 亮起“头顶点”标签，边上的 born_in 标签放大 | 尾顶点、头顶点 | 2.11-2 | MC |
| b22a | 图库可以想成两张表，一张存顶点，一张存边。 | 整张图折叠：顶点落进一张 vertices 表，边落进一张 edges 表（edges 首行先出空框） | 图就是两张表 | 2.11-3 | MC |
| b22b | 每条边的头尾顶点都存在表里，想查入边出边，按列查就行。 | edges 表首行填满（1、Lucy、Idaho、born_in），tail_vertex、head_vertex 两列亮起 | 按列查入边出边 | 2.11-3 | MC |
| b23a | 顶点表存编号和属性，建表语句就是这样写的。 | vertices 建表语句卡出现（vertex_id，properties） | 顶点表 | 2.11-4 | MC |
| b23b | 边表存编号、尾顶点、头顶点、标签和属性，尾顶点和头顶点两列上各建一个索引。 | edges 建表语句卡出现（edge_id，tail_vertex REFERENCES vertices (vertex_id)，head_vertex REFERENCES vertices (vertex_id)，label，properties）；两行索引语句亮起：edges_tails、edges_heads | 边表，两个索引 | 2.11-4 | MC |
| b24 | 这个模型有三点厉害，任意两个节点都能连边，schema 不做限制。 | 任意两个顶点之间一根新边凭空连上；一把 schema 锁图标出现又被划掉 | 谁都能连谁 | 2.11-5 | MC |
| b25a | 随便拿一个节点，入边出边都能高效找到。 | 一个顶点居中，出边箭头向右、入边箭头向左同时亮起 | 入边出边都能找到 | 2.11-5 | MC |
| b25b | 图可以正着走，也可以反着走，两列上都建索引，就是为了这个。 | 亮点沿边正向走一遍、再反向走回来；edges 表两列索引标签闪一下 | 正着走，反着走 | 2.11-5 | MC |
| b26 | 最后，不同标签表示不同种类的关系，一张图里能放好几种信息，模型还保持干净。 | 同一张图里 married、born_in、lives_in、within 四种标签的边同时亮起，各自一种颜色，图面不乱 | 一种标签，一种关系 | 2.11-5 | MC |
| b27 | 这些灵活，正是这张图展示的：法国有省和大区，美国有县和州，不同国家的地区结构本来就不一样。 | 法国链（省 → 大区 → 法国）与美国链（州 → 美国）并排：左边亮起“省、大区”，右边亮起“州”，结构对比 | 法国有省和大区 | 2.11-6 | MC |
| b28 | 还有历史留下的怪事：英格兰本身是个国家，却又在英国这个国家里面；还有粒度不一：Lucy 的现居地具体到城市，出生地只具体到州。 | England 方框套进 United Kingdom 方框里（国家套国家）；London（城市）与 Idaho（州）并排，粒度标签“城市”与“州”分别亮起 | 国家套国家，粒度不一 | 2.11-6 | MC |
| b29 | 图还能往上长：给 Lucy 加一个过敏原顶点，连一条边表示她对什么过敏，再把过敏原连到含它的食物上。 | Lucy 顶点旁长出一个过敏原顶点（花生）；边在“连一条边”处画出，“对什么过敏”处边加粗一闪；过敏原再连向两个食物顶点（饼干、酱料），边画出 | 图上长出过敏原 | 2.11-7 | MC |
| b30 | 然后写个查询，就能算出每人吃什么安全；应用加功能，图跟着长出来就行，这就叫可演化。 | 两个食物顶点上一个打勾（安全）、一个打叉（不安全）；新功能卡片落进图里，图面长出一小枝 | 可演化 | 2.11-7 | MC |
| b31 | 回到开头：多对多越密，图越自然——点是东西，线是关系，标签说明关系是哪一种。 | 整张图（Lucy/Alain 图）缩小居中，三句话标签依次亮起：点是东西、线是关系、标签说明关系 | 点是东西，线是关系 | 回扣 2.10-2/2.10-3/2.11-5 | MC |
| b32 | 停下来想一想，给这张图再加一个人，你会先加顶点，还是先加边？ | 拍首即出一个空白虚线方框（“先加顶点”处描边加粗）；一根空白边并排出现，问号亮起 | 先加顶点，还是先加边？ | 过渡 | MC |
| b33 | 下一单元，拿这张图查一个问题：谁从美国移民到了欧洲？ | “查图”卡片出现，美国与欧洲两个顶点亮起，中间一条虚线问号路径 | 下一站：查图 | 过渡 | MC |
