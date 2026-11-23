// U10 场景 4（MC）：b26–b38 —— SPARQL 三行查询、变量绑定、与 Cypher 对齐、
// 好工具、四点区别（网状模型 vs 图数据库）、回扣与过渡。
// 分镜：skill-ch02/beats-u10.md U10 一节；原文：DDIA §2.14 Example 2-9 与
// 边栏“图数据库与网状模型之比较”（书页 p59–60，PDF p80）。
// SPARQL 行按 Example 2-9 原文：?person :bornIn / :within* / :name "United States"；
// Cypher 对照行按原文：(person) -[:BORN_IN]-> () -[:WITHIN*0..]-> (location)。
// 时长全部来自 timeline/u10.json（beat() 驱动），不手写 waitFor。
// 颜色、字号、安全区一律取自 lib/theme，不手写十六进制色值。
import {Circle, Layout, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, chain, createRef} from '@motion-canvas/core';
import {at, makeBeats} from '../../lib/beats';
import {FONT, SAFE, SIZE, T} from '../../lib/theme';
import timeline from '../../timeline/u10.json';

export default makeScene2D(function* (view) {
  view.fill(T.bg);
  const beat = makeBeats(timeline);

  const header = createRef<Txt>();
  const anchor = createRef<Txt>();
  const say = (text: string) => anchor().text(text);

  // b26–b29：SPARQL 三行 + 小亮点走图
  const g26 = createRef<Node>();
  const g26card = createRef<Rect>();
  const g26tag = createRef<Txt>();
  const l1row = createRef<Layout>();
  const l1v1 = createRef<Txt>();
  const l1v2 = createRef<Txt>();
  const l2txt = createRef<Txt>();
  const l3txt = createRef<Txt>();
  const hl1 = createRef<Rect>();
  const hl2 = createRef<Rect>();
  const hl3 = createRef<Rect>();
  const g28 = createRef<Node>();
  const g28dot = createRef<Circle>();
  const g28usa = createRef<Circle>();
  const g29 = createRef<Node>();
  const g29dot = createRef<Circle>();
  const g29eu = createRef<Circle>();
  // b30：Cypher 与 SPARQL 对齐
  const g30 = createRef<Node>();
  const cyRow = createRef<Layout>();
  const spRow = createRef<Layout>();
  const cyB = createRef<Txt>();
  const cyW = createRef<Txt>();
  const spB = createRef<Txt>();
  const spW = createRef<Txt>();
  // b31：变量绑定
  const g31 = createRef<Node>();
  const b31row = createRef<Layout>();
  const b31var = createRef<Txt>();
  const b31node = createRef<Circle>();
  const b31line = createRef<Line>();
  // b32：工具箱
  const g32 = createRef<Node>();
  const g32box = createRef<Rect>();
  const g32card = createRef<Rect>();
  // b33：网状模型 vs 图数据库
  const g33 = createRef<Node>();
  const g33q = createRef<Txt>();
  const g33x = createRef<Txt>();
  const g33four = createRef<Txt>();
  // b34a/b34b/b35a/b35b：四点区别
  const g34a = createRef<Node>();
  const g34aX = createRef<Line>();
  const g34aGraph = createRef<Node>();
  const g34b = createRef<Node>();
  const g34bPath = createRef<Node>();
  const g34bId = createRef<Node>();
  const g34bIdx = createRef<Rect>();
  const g35a = createRef<Node>();
  const g35aOrder = createRef<Node>();
  const g35aResult = createRef<Txt>();
  const g35b = createRef<Node>();
  const g35bLeft = createRef<Rect>();
  const g35bX = createRef<Txt>();
  const g35bRight = createRef<Rect>();
  // b36：回扣小结
  const g36 = createRef<Node>();
  const g36graph = createRef<Node>();
  const g36sparql = createRef<Rect>();
  const g36usa = createRef<Circle>();
  // b37：空白三元组框
  const g37 = createRef<Node>();
  const g37q1 = createRef<Txt>();
  const g37q2 = createRef<Txt>();
  // b38：翻面成谓词
  const g38 = createRef<Node>();
  const g38card = createRef<Rect>();
  const g38lab = createRef<Txt>();
  const g38r1 = createRef<Txt>();
  const g38r2 = createRef<Txt>();

  view.add(
    <>
      <Txt
        ref={header}
        position={[-SAFE.halfW, -SAFE.halfH]}
        offset={[-1, -1]}
        fontSize={SIZE.label}
        fill={T.muted}
        fontFamily={FONT.sans}
        text={'三元组与 SPARQL'}
      />
      <Txt
        ref={anchor}
        position={[0, 280]}
        fontSize={SIZE.body}
        fill={T.text}
        fontFamily={FONT.sans}
        textAlign={'center'}
        textWrap
        maxWidth={SAFE.width}
        text={''}
      />

      {/* b26–b29：SPARQL 三行查询卡 */}
      <Node ref={g26} opacity={0}>
        <Rect ref={g26card} position={[0, -120]} width={1060} height={280} radius={16} fill={T.card} stroke={T.yellow} lineWidth={2} opacity={0}>
          <Rect ref={hl1} position={[0, -90]} width={1000} height={64} radius={8} fill={T.yellow} opacity={0} />
          <Rect ref={hl2} position={[0, 0]} width={1000} height={64} radius={8} fill={T.yellow} opacity={0} />
          <Rect ref={hl3} position={[0, 90]} width={1000} height={64} radius={8} fill={T.yellow} opacity={0} />
          <Layout ref={l1row} layout direction={'row'} gap={0} position={[0, -90]}>
            <Txt ref={l1v1} fontSize={22} fill={T.text} fontFamily={FONT.mono} text={'?person'} />
            <Txt fontSize={22} fill={T.text} fontFamily={FONT.mono} text={' :name '} />
            <Txt ref={l1v2} fontSize={22} fill={T.text} fontFamily={FONT.mono} text={'?personName.'} />
          </Layout>
          <Txt ref={l2txt} position={[0, 0]} fontSize={22} fill={T.text} fontFamily={FONT.mono} text={'?person :bornIn / :within* / :name "United States".'} opacity={0} />
          <Txt ref={l3txt} position={[0, 90]} fontSize={22} fill={T.text} fontFamily={FONT.mono} text={'?person :livesIn / :within* / :name "Europe".'} opacity={0} />
        </Rect>
        <Txt ref={g26tag} position={[500, -285]} offset={[1, 0]} textAlign={'right'} fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.sans} text={'3 行'} opacity={0} />
        {/* b28：亮点沿 bornIn 走到 Idaho，再沿 within 走到美国 */}
        <Node ref={g28} opacity={0}>
          <Circle position={[-420, 150]} width={90} height={90} fill={T.card} stroke={T.blue} lineWidth={3}>
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'人'} />
          </Circle>
          <Circle position={[0, 150]} width={90} height={90} fill={T.card} stroke={T.blue} lineWidth={3}>
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'Idaho'} />
          </Circle>
          <Circle ref={g28usa} position={[420, 150]} width={90} height={90} fill={T.card} stroke={T.blue} lineWidth={3}>
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'美国'} />
          </Circle>
          <Line points={[[-375, 150], [-45, 150]]} stroke={T.line} lineWidth={2} endArrow />
          <Line points={[[45, 150], [375, 150]]} stroke={T.line} lineWidth={2} endArrow />
          <Txt position={[-210, 105]} fontSize={18} fill={T.yellow} fontFamily={FONT.mono} text={'bornIn'} />
          <Txt position={[210, 105]} fontSize={18} fill={T.yellow} fontFamily={FONT.mono} text={'within'} />
          <Circle ref={g28dot} position={[-375, 150]} width={26} height={26} fill={T.yellow} opacity={0} />
        </Node>
        {/* b29：亮点沿 livesIn 走到伦敦，再沿 within 走到欧洲 */}
        <Node ref={g29} opacity={0}>
          <Circle position={[-420, 150]} width={90} height={90} fill={T.card} stroke={T.blue} lineWidth={3}>
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'人'} />
          </Circle>
          <Circle position={[0, 150]} width={90} height={90} fill={T.card} stroke={T.blue} lineWidth={3}>
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'伦敦'} />
          </Circle>
          <Circle ref={g29eu} position={[420, 150]} width={90} height={90} fill={T.card} stroke={T.blue} lineWidth={3}>
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'欧洲'} />
          </Circle>
          <Line points={[[-375, 150], [-45, 150]]} stroke={T.line} lineWidth={2} endArrow />
          <Line points={[[45, 150], [375, 150]]} stroke={T.line} lineWidth={2} endArrow />
          <Txt position={[-210, 105]} fontSize={18} fill={T.yellow} fontFamily={FONT.mono} text={'livesIn'} />
          <Txt position={[210, 105]} fontSize={18} fill={T.yellow} fontFamily={FONT.mono} text={'within'} />
          <Circle ref={g29dot} position={[-375, 150]} width={26} height={26} fill={T.yellow} opacity={0} />
        </Node>
      </Node>

      {/* b30：Cypher 在上，SPARQL 在下，对应部分同时亮起 */}
      <Node ref={g30} opacity={0}>
        <Txt position={[0, -220]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'Cypher'} />
        <Layout ref={cyRow} layout direction={'row'} gap={0} position={[0, -140]}>
          <Txt fontSize={20} fill={T.text} fontFamily={FONT.mono} text={'(person) -[:'} />
          <Txt ref={cyB} fontSize={20} fill={T.text} fontFamily={FONT.mono} text={'BORN_IN'} />
          <Txt fontSize={20} fill={T.text} fontFamily={FONT.mono} text={']-> () -[:'} />
          <Txt ref={cyW} fontSize={20} fill={T.text} fontFamily={FONT.mono} text={'WITHIN*0..'} />
          <Txt fontSize={20} fill={T.text} fontFamily={FONT.mono} text={']-> (location)'} />
        </Layout>
        <Txt position={[0, -40]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'SPARQL'} />
        <Layout ref={spRow} layout direction={'row'} gap={0} position={[0, 40]}>
          <Txt fontSize={20} fill={T.text} fontFamily={FONT.mono} text={'?person :'} />
          <Txt ref={spB} fontSize={20} fill={T.text} fontFamily={FONT.mono} text={'bornIn'} />
          <Txt fontSize={20} fill={T.text} fontFamily={FONT.mono} text={' / :'} />
          <Txt ref={spW} fontSize={20} fill={T.text} fontFamily={FONT.mono} text={'within*'} />
          <Txt fontSize={20} fill={T.text} fontFamily={FONT.mono} text={' ?location.'} />
        </Layout>
      </Node>

      {/* b31：?usa 绑定到名字是美国的节点 */}
      <Node ref={g31} opacity={0}>
        <Layout ref={b31row} layout direction={'row'} gap={0} position={[0, -160]}>
          <Txt ref={b31var} fontSize={22} fill={T.text} fontFamily={FONT.mono} text={'?usa'} />
          <Txt fontSize={22} fill={T.text} fontFamily={FONT.mono} text={' :name "United States".'} />
        </Layout>
        <Line ref={b31line} points={[[-150, -130], [0, 5]]} stroke={T.yellow} lineWidth={3} endArrow opacity={0} />
        <Circle ref={b31node} position={[0, 65]} width={120} height={120} fill={T.card} stroke={T.blue} lineWidth={3} opacity={0}>
          <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'美国'} />
        </Circle>
      </Node>

      {/* b32：工具箱，SPARQL 卡落进去 */}
      <Node ref={g32} opacity={0}>
        <Rect ref={g32box} position={[0, -20]} width={720} height={320} radius={16} fill={T.card} stroke={T.line} lineWidth={2} opacity={0}>
          <Txt position={[0, -120]} fontSize={SIZE.title} fill={T.text} fontFamily={FONT.sans} text={'工具箱'} />
        </Rect>
        <Rect ref={g32card} position={[0, -280]} width={380} height={110} radius={14} fill={T.card} stroke={T.yellow} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'SPARQL'} />
        </Rect>
      </Node>

      {/* b33：网状模型 vs 图数据库，是换皮吗？不是 */}
      <Node ref={g33} opacity={0}>
        <Rect position={[-290, -40]} width={400} height={200} radius={16} fill={T.card} stroke={T.red} lineWidth={2}>
          <Txt fontSize={SIZE.title} fill={T.text} fontFamily={FONT.sans} text={'网状模型'} />
        </Rect>
        <Rect position={[290, -40]} width={400} height={200} radius={16} fill={T.card} stroke={T.green} lineWidth={2}>
          <Txt fontSize={SIZE.title} fill={T.text} fontFamily={FONT.sans} text={'图数据库'} />
        </Rect>
        <Txt ref={g33q} position={[0, -40]} fontSize={72} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'?'} opacity={0} />
        <Txt ref={g33x} position={[0, -40]} fontSize={72} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'×'} opacity={0} />
        <Txt ref={g33four} position={[0, 150]} fontSize={SIZE.title} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'四点区别'} opacity={0} />
      </Node>

      {/* b34a：第一点，不限连边 */}
      <Node ref={g34a} opacity={0}>
        <Txt position={[0, -280]} fontSize={SIZE.body} fill={T.yellow} fontFamily={FONT.sans} text={'第一点'} />
        <Rect position={[-300, -40]} width={460} height={220} radius={16} fill={T.card} stroke={T.blue} lineWidth={2}>
          <Txt position={[0, -50]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'schema 规定嵌套'} />
          <Txt position={[0, 20]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'哪种记录能嵌套在哪种'} />
        </Rect>
        <Line key="qa-ignore-划掉" ref={g34aX} points={[[-510, -140], [-90, 60]]} stroke={T.red} lineWidth={4} opacity={0} />
        <Node ref={g34aGraph} opacity={0}>
          <Circle position={[180, -110]} width={90} height={90} fill={T.card} stroke={T.green} lineWidth={3} />
          <Circle position={[420, -110]} width={90} height={90} fill={T.card} stroke={T.green} lineWidth={3} />
          <Circle position={[300, 50]} width={90} height={90} fill={T.card} stroke={T.green} lineWidth={3} />
          <Line points={[[225, -110], [375, -110]]} stroke={T.line} lineWidth={2} />
          <Line points={[[210, -70], [270, 10]]} stroke={T.line} lineWidth={2} />
          <Line points={[[390, -70], [330, 10]]} stroke={T.line} lineWidth={2} />
          <Txt position={[300, 150]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} text={'任意连边'} />
        </Node>
      </Node>

      {/* b34b：第二点，直接找到 */}
      <Node ref={g34b} opacity={0}>
        <Txt position={[0, -280]} fontSize={SIZE.body} fill={T.yellow} fontFamily={FONT.sans} text={'第二点'} />
        <Node ref={g34bPath} opacity={0}>
          <Circle position={[-360, -120]} width={60} height={60} fill={T.card} stroke={T.line} lineWidth={2} />
          <Circle position={[-160, -120]} width={60} height={60} fill={T.card} stroke={T.line} lineWidth={2} />
          <Circle position={[40, -120]} width={60} height={60} fill={T.card} stroke={T.line} lineWidth={2} />
          <Line points={[[-330, -120], [-190, -120]]} stroke={T.line} lineWidth={2} endArrow />
          <Line points={[[-130, -120], [10, -120]]} stroke={T.line} lineWidth={2} endArrow />
          <Txt position={[-160, -50]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'访问路径，一步步走'} />
        </Node>
        <Node ref={g34bId} opacity={0}>
          <Txt position={[-420, 100]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'编号'} />
          <Line points={[[-340, 100], [-180, 100]]} stroke={T.yellow} lineWidth={3} endArrow />
          <Circle position={[-80, 100]} width={110} height={110} fill={T.card} stroke={T.green} lineWidth={3}>
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'节点'} />
          </Circle>
        </Node>
        <Rect ref={g34bIdx} position={[300, 100]} width={360} height={110} radius={14} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'索引：按值找'} />
        </Rect>
      </Node>

      {/* b35a：第三点，无序 */}
      <Node ref={g35a} opacity={0}>
        <Txt position={[0, -280]} fontSize={SIZE.body} fill={T.yellow} fontFamily={FONT.sans} text={'第三点'} />
        <Node ref={g35aOrder} opacity={0}>
          <Rect position={[-220, -80]} width={130} height={130} radius={12} fill={T.card} stroke={T.blue} lineWidth={2}>
            <Txt fontSize={SIZE.title} fill={T.text} fontFamily={FONT.sans} text={'1'} />
          </Rect>
          <Rect position={[0, -80]} width={130} height={130} radius={12} fill={T.card} stroke={T.blue} lineWidth={2}>
            <Txt fontSize={SIZE.title} fill={T.text} fontFamily={FONT.sans} text={'2'} />
          </Rect>
          <Rect position={[220, -80]} width={130} height={130} radius={12} fill={T.card} stroke={T.blue} lineWidth={2}>
            <Txt fontSize={SIZE.title} fill={T.text} fontFamily={FONT.sans} text={'3'} />
          </Rect>
          <Line points={[[-155, -80], [-65, -80]]} stroke={T.line} lineWidth={2} endArrow />
          <Line points={[[65, -80], [155, -80]]} stroke={T.line} lineWidth={2} endArrow />
          <Rect position={[0, 110]} width={260} height={100} radius={12} fill={T.card} stroke={T.yellow} lineWidth={2}>
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'新记录'} />
          </Rect>
          <Txt position={[210, 110]} fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.sans} text={'放哪？'} />
        </Node>
        <Txt ref={g35aResult} position={[0, -40]} fontSize={SIZE.title} fill={T.green} fontFamily={FONT.sans} text={'查的时候才排结果'} opacity={0} />
      </Node>

      {/* b35b：第四点，声明式 */}
      <Node ref={g35b} opacity={0}>
        <Txt position={[0, -280]} fontSize={SIZE.body} fill={T.yellow} fontFamily={FONT.sans} text={'第四点'} />
        <Rect ref={g35bLeft} position={[-290, -40]} width={440} height={220} radius={16} fill={T.card} stroke={T.red} lineWidth={2} opacity={0}>
          <Txt position={[0, -50]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'命令式'} />
          <Txt position={[0, 20]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'难写，schema 一变就容易坏'} />
        </Rect>
        <Txt ref={g35bX} position={[-110, -100]} fontSize={48} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'×'} opacity={0} />
        <Rect ref={g35bRight} position={[290, -40]} width={440} height={220} radius={16} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt position={[0, -50]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'声明式'} />
          <Txt position={[0, 20]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'Cypher / SPARQL'} />
        </Rect>
      </Node>

      {/* b36：回扣，三段话一张图 */}
      <Node ref={g36} opacity={0}>
        <Rect position={[-330, -180]} width={260} height={110} radius={14} fill={T.card} stroke={T.blue} lineWidth={2}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'主语'} />
        </Rect>
        <Rect position={[0, -180]} width={260} height={110} radius={14} fill={T.card} stroke={T.yellow} lineWidth={2}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'谓语'} />
        </Rect>
        <Rect position={[330, -180]} width={260} height={110} radius={14} fill={T.card} stroke={T.green} lineWidth={2}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'宾语'} />
        </Rect>
        <Rect ref={g36sparql} position={[0, -20]} width={320} height={90} radius={14} fill={T.card} stroke={T.yellow} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'SPARQL 一问'} />
        </Rect>
        <Node ref={g36graph} opacity={0}>
          <Circle position={[-300, 150]} width={100} height={100} fill={T.card} stroke={T.blue} lineWidth={3}>
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'Lucy'} />
          </Circle>
          <Circle position={[0, 150]} width={100} height={100} fill={T.card} stroke={T.blue} lineWidth={3}>
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'Idaho'} />
          </Circle>
          <Circle ref={g36usa} position={[300, 150]} width={100} height={100} fill={T.card} stroke={T.blue} lineWidth={3}>
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'美国'} />
          </Circle>
          <Line points={[[-250, 150], [-50, 150]]} stroke={T.line} lineWidth={2} endArrow />
          <Line points={[[50, 150], [250, 150]]} stroke={T.line} lineWidth={2} endArrow />
        </Node>
      </Node>

      {/* b37：空白三元组框，谓语宾语留空 */}
      <Node ref={g37} opacity={0}>
        <Rect position={[-380, -40]} width={300} height={130} radius={14} fill={T.card} stroke={T.blue} lineWidth={2}>
          <Txt fontSize={SIZE.title} fill={T.text} fontFamily={FONT.sans} text={'Lucy'} />
        </Rect>
        <Rect position={[0, -40]} width={300} height={130} radius={14} fill={T.card} stroke={T.line} lineWidth={2}>
          <Txt ref={g37q1} fontSize={72} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'?'} opacity={0} />
        </Rect>
        <Rect position={[380, -40]} width={300} height={130} radius={14} fill={T.card} stroke={T.line} lineWidth={2}>
          <Txt ref={g37q2} fontSize={72} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'?'} opacity={0} />
        </Rect>
      </Node>

      {/* b38：三元组翻面成谓词，新事实行长出 */}
      <Node ref={g38} opacity={0}>
        <Txt ref={g38lab} position={[0, -240]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'三元组翻个面，写成谓词'} opacity={0} />
        <Rect ref={g38card} position={[0, -140]} width={640} height={120} radius={14} fill={T.card} stroke={T.purple} lineWidth={2} opacity={0}>
          <Txt fontSize={26} fill={T.text} fontFamily={FONT.mono} text={'born_in(Lucy, Idaho)'} />
        </Rect>
        <Txt ref={g38r1} position={[0, 0]} fontSize={22} fill={T.text} fontFamily={FONT.mono} text={'within(Idaho, USA)'} opacity={0} />
        <Txt ref={g38r2} position={[0, 70]} fontSize={22} fill={T.text} fontFamily={FONT.mono} text={'within(USA, North America)'} opacity={0} />
      </Node>
    </>
  );

  say('三行就够了');
  yield* beat('b26',
    all(g26().opacity(1, 0.5), g26card().opacity(1, 0.5)),
    at('移民到了欧洲', l2txt().opacity(1, 0.4)),
    at('还简洁', l3txt().opacity(1, 0.4)),
    at('只有三行', g26tag().opacity(1, 0.4)),
  );

  say('变量以问号开头');
  yield* beat('b27',
    at('第一行', hl1().opacity(0.2, 0.4)),
    at('变量名', chain(l1v1().fill(T.yellow, 0.4), l1v1().scale(1.2, 0.3).to(1, 0.3))),
    at('问他的名字', hl1().scale(1.03, 0.4).to(1, 0.4)),
    at('问号开头', chain(l1v2().fill(T.yellow, 0.4), l1v2().scale(1.2, 0.3).to(1, 0.3))),
  );

  say('出生在美国');
  yield* beat('b28',
    all(g28().opacity(1, 0.5), hl2().opacity(0.2, 0.4)),
    at('出生边', chain(g28dot().opacity(1, 0.3), g28dot().position([-45, 150], 1))),
    at('within 边', g28dot().position([375, 150], 1)),
    at('最后名字是美国', g28usa().stroke(T.green, 0.4)),
  );

  say('现在住在欧洲');
  yield* beat('b29',
    all(g28().opacity(0, 0.5), g29().opacity(1, 0.5), hl2().opacity(0, 0.3), hl3().opacity(0.2, 0.4)),
    at('现在住在欧洲', chain(g29dot().opacity(1, 0.3), g29dot().position([-45, 150], 1))),
    at('终点换成了欧洲', chain(g29dot().position([375, 150], 1), g29eu().stroke(T.green, 0.4))),
  );

  say('同一个意思，两种写法');
  yield* beat('b30',
    all(g26().opacity(0, 0.5), g30().opacity(1, 0.5)),
    at('对齐看就明白了', cyRow().scale(1.03, 0.4).to(1, 0.4)),
    at('下面是 SPARQL', all(
      chain(spB().fill(T.yellow, 0.4), spB().scale(1.15, 0.3).to(1, 0.3)),
      chain(cyB().fill(T.yellow, 0.4), cyB().scale(1.15, 0.3).to(1, 0.3)),
    )),
    at('同一件事', all(
      chain(spW().fill(T.yellow, 0.4), spW().scale(1.15, 0.3).to(1, 0.3)),
      chain(cyW().fill(T.yellow, 0.4), cyW().scale(1.15, 0.3).to(1, 0.3)),
    )),
  );

  say('变量绑定到节点上');
  yield* beat('b31',
    all(g30().opacity(0, 0.5), g31().opacity(1, 0.5)),
    at('不区分属性和边', b31row().scale(1.03, 0.4).to(1, 0.4)),
    at('谓语表示', b31row().scale(1.03, 0.4).to(1, 0.4)),
    at('同一个语法', b31row().scale(1.03, 0.4).to(1, 0.4)),
    at('问号变量', chain(b31var().fill(T.yellow, 0.4), b31var().scale(1.2, 0.3).to(1, 0.3))),
    at('美国', chain(b31node().opacity(1, 0.4), b31line().opacity(1, 0.5))),
  );

  say('好工具，不只为语义网');
  yield* beat('b32',
    all(g31().opacity(0, 0.5), g32().opacity(1, 0.5), g32box().opacity(1, 0.5)),
    at('SPARQL 是个好工具', chain(g32card().opacity(1, 0.4), g32card().position([0, 10], 1))),
    at('应用内部', g32card().scale(1.04, 0.6).to(1, 0.6)),
  );

  say('是换皮吗？不是');
  yield* beat('b33',
    all(g32().opacity(0, 0.5), g33().opacity(1, 0.5)),
    at('卷土重来', g33().scale(1.02, 0.5).to(1, 0.5)),
    at('乍看确实像', g33q().opacity(1, 0.4)),
    at('答案是否定的', chain(g33q().opacity(0, 0.3), g33x().opacity(1, 0.4))),
    at('四点关键区别', g33four().opacity(1, 0.4)),
  );

  say('不限连边');
  yield* beat('b34a',
    all(g33().opacity(0, 0.5), g34a().opacity(1, 0.5)),
    at('有 schema', g34aX().opacity(1, 0.4)),
    at('任何节点都能连向任何节点', g34aGraph().opacity(1, 0.5)),
  );

  say('直接找到');
  yield* beat('b34b',
    all(g34a().opacity(0, 0.5), g34b().opacity(1, 0.5), g34bPath().opacity(1, 0.5)),
    at('一步步走', g34bPath().scale(1.03, 0.5).to(1, 0.5)),
    at('直接用编号', g34bId().opacity(1, 0.5)),
    at('找到任何节点', g34bId().scale(1.03, 0.5).to(1, 0.5)),
    at('索引按值找', g34bIdx().opacity(1, 0.5)),
  );

  say('无序');
  yield* beat('b35a',
    all(g34b().opacity(0, 0.5), g35a().opacity(1, 0.5), g35aOrder().opacity(1, 0.5)),
    at('维护顺序', g35aOrder().scale(1.02, 0.6).to(1, 0.6)),
    at('没有顺序', g35aOrder().opacity(0, 0.6)),
    at('才排结果', g35aResult().opacity(1, 0.5)),
  );

  say('声明式');
  yield* beat('b35b',
    all(g35a().opacity(0, 0.5), g35b().opacity(1, 0.5), g35bLeft().opacity(1, 0.5)),
    at('命令式', g35bLeft().scale(1.03, 0.5).to(1, 0.5)),
    at('难写', g35bLeft().scale(1.03, 0.5).to(1, 0.5)),
    at('容易坏', g35bX().opacity(1, 0.4)),
    at('也可以写命令式遍历', g35bLeft().scale(1.03, 0.5).to(1, 0.5)),
    at('声明式语言', g35bRight().opacity(1, 0.5)),
  );

  say('三段话，一张图');
  yield* beat('b36',
    all(g35b().opacity(0, 0.5), g36().opacity(1, 0.5)),
    at('主语是节点', g36graph().opacity(1, 0.5)),
    at('变量一问', chain(g36sparql().opacity(1, 0.4), g36usa().stroke(T.green, 0.4))),
  );

  say('写成属性，还是边？');
  yield* beat('b37',
    all(g36().opacity(0, 0.5), g37().opacity(1, 0.5)),
    at('加一条过敏信息', chain(g37q1().opacity(1, 0.4), g37q2().opacity(1, 0.4))),
    at('写成属性', g37q1().scale(1.3, 0.4).to(1, 0.4)),
    at('写成一条边', g37q2().scale(1.3, 0.4).to(1, 0.4)),
  );

  say('下一站：规则长出新事实');
  yield* beat('b38',
    all(g37().opacity(0, 0.5), g38().opacity(1, 0.5), g38card().opacity(1, 0.5)),
    at('写成谓词', g38lab().opacity(1, 0.4)),
    at('长出新事实', chain(g38r1().opacity(1, 0.4), g38r2().opacity(1, 0.4))),
  );
});
