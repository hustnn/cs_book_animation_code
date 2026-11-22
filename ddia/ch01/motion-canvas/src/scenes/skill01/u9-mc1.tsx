// U9 场景 1（MC）：b1–b16 —— 钩子、复杂度症状、big ball of mud、偶然 vs 本质、抽象。
// 分镜：skill-ch01/ch01-beats.md U9 一节；原文：DDIA §1.13（书页 p20–21，PDF p42–43）。
// 时长全部来自 timeline/u9.json（beat() 驱动），不手写 waitFor。
// 颜色、字号、安全区一律取自 lib/theme，不手写十六进制色值。
import {Circle, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, chain, createRef, sequence, waitFor} from '@motion-canvas/core';
import {makeBeats} from '../../lib/beats';
import {FONT, SAFE, SIZE, T} from '../../lib/theme';
import timeline from '../../timeline/u9.json';

export default makeScene2D(function* (view) {
  view.fill(T.bg);
  const beat = makeBeats(timeline);

  const header = createRef<Txt>();
  const anchor = createRef<Txt>();
  const g1 = createRef<Node>();
  const codeLines = [0, 1, 2, 3, 4].map(() => createRef<Rect>());
  const qmark = createRef<Txt>();
  const g2 = createRef<Node>();
  const pillars = [0, 1, 2].map(() => createRef<Rect>());
  const g3 = createRef<Node>();
  const cleanLines = [0, 1, 2].map(() => createRef<Rect>());
  const messyLines = [0, 1, 2, 3, 4, 5].map(() => createRef<Rect>());
  const g4 = createRef<Node>();
  const symptomChips = [0, 1, 2, 3, 4, 5].map(() => createRef<Rect>());
  const tangle = [0, 1, 2].map(() => createRef<Line>());
  const g5 = createRef<Node>();
  const mudBall = createRef<Circle>();
  const mudTag = createRef<Txt>();
  const mudBits = [0, 1, 2].map(() => createRef<Circle>());
  const g6 = createRef<Node>();
  const walkers = [0, 1, 2].map(() => createRef<Circle>());
  const costBar = createRef<Rect>();
  const g7 = createRef<Node>();
  const budgetBar = createRef<Rect>();
  const bugDots = [0, 1, 2].map(() => createRef<Circle>());
  const g8 = createRef<Node>();
  const mudOuter = createRef<Circle>();
  const cleanCore = createRef<Circle>();
  const g9 = createRef<Node>();
  const funcBar = createRef<Rect>();
  const accLayer = createRef<Rect>();
  const g10 = createRef<Node>();
  const g11 = createRef<Node>();
  const essentialBlob = createRef<Circle>();
  const accidentalBlob = createRef<Circle>();
  const g12 = createRef<Node>();
  const sqlLine = createRef<Rect>();
  const sqlDetails = [0, 1, 2].map(() => createRef<Rect>());
  const g13 = createRef<Node>();
  const absBox = createRef<Rect>();
  const appBoxes = [0, 1, 2].map(() => createRef<Rect>());
  const g14 = createRef<Node>();
  const langPanel = createRef<Rect>();
  const sqlPanel = createRef<Rect>();
  const langDetails = [0, 1, 2].map(() => createRef<Rect>());
  const sqlDetails2 = [0, 1, 2].map(() => createRef<Rect>());
  const g15 = createRef<Node>();
  const algoChips = [0, 1, 2, 3, 4, 5].map(() => createRef<Rect>());
  const cleanBox = createRef<Rect>();
  const g16 = createRef<Node>();
  const bigSystem = createRef<Rect>();
  const components = [0, 1, 2].map(() => createRef<Rect>());

  const say = (text: string) => anchor().text(text);

  view.add(
    <>
      <Txt
        ref={header}
        position={[-SAFE.halfW, -SAFE.halfH]}
        offset={[-1, -1]}
        fontSize={SIZE.label}
        fill={T.muted}
        fontFamily={FONT.sans}
        text={'第 1 章 · 简单、可演化与总结'}
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

      {/* b1：代码越滚越长，工程师皱眉——五行代码逐行冒出，最后一行变红，问号升起 */}
      <Node ref={g1} opacity={0}>
        {[
          {x: -260, w: 420},
          {x: -220, w: 500},
          {x: -280, w: 380},
          {x: -200, w: 540},
          {x: -240, w: 460},
        ].map((l, i) => (
          <Rect
            key={`u9-code-${i}`}
            ref={codeLines[i]}
            position={[l.x, -180 + i * 52]}
            offset={[-1, 0]}
            width={l.w}
            height={18}
            radius={9}
            fill={i === 4 ? T.red : T.blue}
            opacity={0}
          />
        ))}
        <Txt ref={qmark} position={[380, -80]} fontSize={64} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} opacity={0} text={'?'} />
      </Node>

      {/* b2：三根支柱，第二、三根亮起 */}
      <Node ref={g2} opacity={0}>
        {[
          {x: -320, label: '可运维性'},
          {x: 0, label: '简单性'},
          {x: 320, label: '可演化性'},
        ].map((p, i) => (
          <Rect
            key={`u9-pillar-${i}`}
            ref={pillars[i]}
            position={[p.x, 60]}
            offset={[0, 1]}
            width={200}
            height={60}
            radius={16}
            fill={T.card}
            stroke={T.line}
            lineWidth={2}
          >
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={p.label} />
          </Rect>
        ))}
      </Node>

      {/* b3：小清新代码长成一团乱麻 */}
      <Node ref={g3} opacity={0}>
        <Rect position={[0, -100]} width={520} height={180} radius={16} fill={T.card} stroke={T.blue} lineWidth={2}>
          <Txt position={[0, -78]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'小项目'} />
        </Rect>
        {[0, 1, 2].map(i => (
          <Rect
            key={`u9-clean-${i}`}
            ref={cleanLines[i]}
            position={[-220, -140 + i * 44]}
            offset={[-1, 0]}
            width={340 - i * 40}
            height={16}
            radius={8}
            fill={T.green}
          />
        ))}
        {[
          {x: -300, y: 120, w: 300, r: 12},
          {x: -100, y: 170, w: 380, r: -8},
          {x: 80, y: 110, w: 260, r: 20},
          {x: -260, y: 210, w: 420, r: -15},
          {x: 120, y: 220, w: 300, r: 10},
          {x: -40, y: 160, w: 340, r: -22},
        ].map((l, i) => (
          <Rect
            key={`u9-messy-${i}`}
            ref={messyLines[i]}
            position={[l.x, l.y]}
            width={l.w}
            height={14}
            radius={7}
            rotation={l.r}
            fill={T.red}
            opacity={0}
          />
        ))}
      </Node>

      {/* b4：复杂度六种症状，标签轮流亮起，依赖线越缠越紧 */}
      <Node ref={g4} opacity={0}>
        <Line ref={tangle[0]} points={[[-480, -180], [480, 140]]} stroke={T.line} lineWidth={2} opacity={0} />
        <Line ref={tangle[1]} points={[[-480, 140], [480, -180]]} stroke={T.line} lineWidth={2} opacity={0} />
        <Line ref={tangle[2]} points={[[-480, 0], [480, 40]]} stroke={T.line} lineWidth={2} opacity={0} />
        {[
          {x: -360, y: -160, label: '状态空间爆炸'},
          {x: 0, y: -160, label: '模块紧耦合'},
          {x: 360, y: -160, label: '依赖纠缠'},
          {x: -360, y: -40, label: '命名术语不一致'},
          {x: 0, y: -40, label: '为性能打补丁'},
          {x: 360, y: -40, label: '为绕过别处问题做特殊处理'},
        ].map((c, i) => (
          <Rect
            key={`u9-symptom-${i}`}
            ref={symptomChips[i]}
            position={[c.x, c.y]}
            width={330}
            height={76}
            radius={14}
            fill={T.card}
            stroke={T.line}
            lineWidth={2}
            opacity={0}
          >
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} textWrap maxWidth={300} text={c.label} />
          </Rect>
        ))}
      </Node>

      {/* b5：big ball of mud——泥球越滚越大 */}
      <Node ref={g5} opacity={0}>
        {[
          {x: -300, y: 120},
          {x: 280, y: 140},
          {x: 0, y: 200},
        ].map((p, i) => (
          <Circle
            key={`u9-bit-${i}`}
            ref={mudBits[i]}
            position={[p.x, p.y]}
            width={22}
            height={22}
            fill={T.blue}
          />
        ))}
        <Circle ref={mudBall} position={[0, -40]} width={60} height={60} fill={T.line} stroke={T.muted} lineWidth={3} />
        <Txt ref={mudTag} position={[0, 150]} fontSize={SIZE.title} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} opacity={0} text={'big ball of mud'} />
      </Node>

      {/* b6：复杂拖慢所有人，成本条上涨 */}
      <Node ref={g6} opacity={0}>
        {[0, 1, 2].map(i => (
          <Circle
            key={`u9-walker-${i}`}
            ref={walkers[i]}
            position={[-420, -120 + i * 90]}
            width={44}
            height={44}
            fill={T.blue}
          />
        ))}
        <Txt position={[-420, 200]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'所有人走路变慢'} />
        <Rect position={[300, 80]} offset={[0, 1]} width={120} height={220} radius={8} fill={T.card} stroke={T.line} lineWidth={2} />
        <Rect ref={costBar} position={[300, 80]} offset={[0, 1]} width={120} height={10} radius={8} fill={T.red} />
        <Txt position={[300, 130]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'维护成本 ↑'} />
      </Node>

      {/* b7：预算超支，改一行冒出三个 bug */}
      <Node ref={g7} opacity={0}>
        <Txt position={[0, -200]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'预算条'} />
        <Rect position={[0, -140]} width={920} height={40} radius={20} fill={T.card} stroke={T.line} lineWidth={2} />
        <Rect ref={budgetBar} position={[-460, -140]} offset={[-1, 0]} width={0} height={40} radius={20} fill={T.green} />
        <Txt position={[0, -80]} fontSize={SIZE.label} fill={T.red} fontFamily={FONT.sans} text={'超支'} />
        <Rect position={[-300, 60]} width={420} height={60} radius={12} fill={T.card} stroke={T.blue} lineWidth={2}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'改一行代码'} />
        </Rect>
        {[
          {x: 180, y: 20},
          {x: 300, y: 90},
          {x: 200, y: 140},
        ].map((p, i) => (
          <Circle
            key={`u9-bug-${i}`}
            ref={bugDots[i]}
            position={[p.x, p.y]}
            width={40}
            height={40}
            fill={T.red}
            opacity={0}
          />
        ))}
        <Txt position={[280, 190]} fontSize={SIZE.label} fill={T.red} fontFamily={FONT.sans} text={'冒出三个 bug'} />
      </Node>

      {/* b8：泥球被剥掉一层，露出干净内核 */}
      <Node ref={g8} opacity={0}>
        <Circle ref={mudOuter} position={[0, -40]} width={340} height={340} fill={T.card} stroke={T.muted} lineWidth={3} />
        <Circle ref={cleanCore} position={[0, -40]} width={60} height={60} fill={T.green} opacity={0} />
        <Txt position={[0, 180]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'剥掉一层，露出干净内核'} />
      </Node>

      {/* b9：功能条不动，偶然复杂度那层被剥掉 */}
      <Node ref={g9} opacity={0}>
        <Txt position={[0, -180]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'功能'} />
        <Rect ref={funcBar} position={[0, -110]} width={700} height={56} radius={12} fill={T.green} />
        <Txt position={[0, -40]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'偶然复杂度'} />
        <Rect ref={accLayer} position={[0, 30]} width={700} height={56} radius={12} fill={T.red} />
        <Txt position={[0, 120]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'功能条不动，偶然层被剥掉'} />
      </Node>

      {/* b10：偶然复杂度定义卡 */}
      <Node ref={g10} opacity={0}>
        <Rect position={[0, -40]} width={860} height={260} radius={20} fill={T.card} stroke={T.yellow} lineWidth={3}>
          <Txt position={[0, -70]} fontSize={SIZE.title} fontWeight={700} fill={T.white} fontFamily={FONT.serif} text={'偶然复杂度'} />
          <Txt position={[0, 10]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'不是问题本身固有的'} />
          <Txt position={[0, 70]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'只源于实现'} />
        </Rect>
      </Node>

      {/* b11：两团对照——本质躲不掉，偶然可拆 */}
      <Node ref={g11} opacity={0}>
        <Circle ref={essentialBlob} position={[-280, -60]} width={260} height={260} fill={T.blue} opacity={0.85} />
        <Txt position={[-280, -60]} fontSize={SIZE.body} fill={T.white} fontFamily={FONT.sans} text={'本质复杂度'} />
        <Txt position={[-280, 110]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'躲不掉'} />
        <Circle ref={accidentalBlob} position={[280, -60]} width={260} height={260} fill={T.red} opacity={0.85} />
        <Txt position={[280, -60]} fontSize={SIZE.body} fill={T.white} fontFamily={FONT.sans} text={'偶然复杂度'} />
        <Txt position={[280, 110]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'可拆'} />
      </Node>

      {/* b12：深度演示——一行 SQL 展开成复杂度，再折叠回去 */}
      <Node ref={g12} opacity={0}>
        <Rect ref={sqlLine} position={[0, -180]} width={640} height={80} radius={14} fill={T.card} stroke={T.blue} lineWidth={3}>
          <Txt fontSize={SIZE.body} fontFamily={FONT.mono} fill={T.text} text={'SELECT … FROM …'} />
        </Rect>
        {[
          {x: -300, label: '磁盘结构'},
          {x: 0, label: '并发请求'},
          {x: 300, label: '崩溃后不一致'},
        ].map((d, i) => (
          <Rect
            key={`u9-sqld-${i}`}
            ref={sqlDetails[i]}
            position={[d.x, -60]}
            width={280}
            height={90}
            radius={14}
            fill={T.card}
            stroke={T.yellow}
            lineWidth={2}
            opacity={0}
          >
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={d.label} />
          </Rect>
        ))}
        <Txt position={[0, 120]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'好抽象把细节藏起来'} />
      </Node>

      {/* b13：一个抽象盒子被多个应用共用，改进的光波及全部 */}
      <Node ref={g13} opacity={0}>
        <Rect ref={absBox} position={[0, -60]} width={300} height={140} radius={16} fill={T.blue}>
          <Txt fontSize={SIZE.body} fill={T.white} fontFamily={FONT.sans} text={'好抽象'} />
        </Rect>
        {[
          {x: -360, label: '应用 A'},
          {x: 0, label: '应用 B'},
          {x: 360, label: '应用 C'},
        ].map((a, i) => (
          <Rect
            key={`u9-app-${i}`}
            ref={appBoxes[i]}
            position={[a.x, 140]}
            width={220}
            height={90}
            radius={14}
            fill={T.card}
            stroke={T.line}
            lineWidth={2}
          >
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={a.label} />
          </Rect>
        ))}
      </Node>

      {/* b14：高级语言与 SQL 各展开一次再折叠 */}
      <Node ref={g14} opacity={0}>
        <Rect ref={langPanel} position={[-280, -160]} width={480} height={100} radius={14} fill={T.card} stroke={T.blue} lineWidth={2}>
          <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'高级语言'} />
        </Rect>
        <Rect ref={sqlPanel} position={[280, -160]} width={480} height={100} radius={14} fill={T.card} stroke={T.blue} lineWidth={2}>
          <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'SQL'} />
        </Rect>
        {[
          {x: -420, label: '机器码'},
          {x: -280, label: 'CPU 寄存器'},
          {x: -140, label: '系统调用'},
        ].map((d, i) => (
          <Rect
            key={`u9-lang-${i}`}
            ref={langDetails[i]}
            position={[d.x, -40]}
            width={140}
            height={64}
            radius={12}
            fill={T.card}
            stroke={T.yellow}
            lineWidth={2}
            opacity={0}
          >
            <Txt fontSize={SIZE.min} fill={T.text} fontFamily={FONT.sans} text={d.label} />
          </Rect>
        ))}
        {[
          {x: 140, label: '磁盘结构'},
          {x: 280, label: '并发请求'},
          {x: 420, label: '崩溃不一致'},
        ].map((d, i) => (
          <Rect
            key={`u9-sql2-${i}`}
            ref={sqlDetails2[i]}
            position={[d.x, -40]}
            width={140}
            height={64}
            radius={12}
            fill={T.card}
            stroke={T.yellow}
            lineWidth={2}
            opacity={0}
          >
            <Txt fontSize={SIZE.min} fill={T.text} fontFamily={FONT.sans} text={d.label} />
          </Rect>
        ))}
        <Txt position={[0, 120]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'展开看看，再折叠回去'} />
      </Node>

      {/* b15：满桌好算法，拼不成一个干净盒子 */}
      <Node ref={g15} opacity={0}>
        {[
          {x: -400, y: -140},
          {x: -240, y: -140},
          {x: -80, y: -140},
          {x: -400, y: -40},
          {x: -240, y: -40},
          {x: -80, y: -40},
        ].map((p, i) => (
          <Rect
            key={`u9-algo-${i}`}
            ref={algoChips[i]}
            position={[p.x, p.y]}
            width={130}
            height={64}
            radius={12}
            fill={T.purple}
            opacity={0.9}
          >
            <Txt fontSize={SIZE.min} fill={T.white} fontFamily={FONT.sans} text={'好算法'} />
          </Rect>
        ))}
        <Rect ref={cleanBox} position={[330, -90]} width={300} height={220} radius={16} fill={T.card} stroke={T.green} lineWidth={3} lineDash={[12, 8]}>
          <Txt fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'干净的抽象？'} />
        </Rect>
        <Txt position={[330, 80]} fontSize={SIZE.label} fill={T.red} fontFamily={FONT.sans} text={'还远不清楚'} />
      </Node>

      {/* b16：大系统拆成几个干净组件 */}
      <Node ref={g16} opacity={0}>
        <Rect ref={bigSystem} position={[0, -60]} width={900} height={220} radius={20} fill={T.card} stroke={T.muted} lineWidth={3}>
          <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'大系统'} />
        </Rect>
        {[
          {x: -320, label: '组件 1'},
          {x: 0, label: '组件 2'},
          {x: 320, label: '组件 3'},
        ].map((c, i) => (
          <Rect
            key={`u9-comp-${i}`}
            ref={components[i]}
            position={[c.x, -60]}
            width={240}
            height={160}
            radius={16}
            fill={T.blue}
            opacity={0}
          >
            <Txt fontSize={SIZE.label} fill={T.white} fontFamily={FONT.sans} text={c.label} />
          </Rect>
        ))}
        <Txt position={[0, 120]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'定义良好，可以复用'} />
      </Node>
    </>,
  );

  // b1：钩子——代码越写越乱
  say('代码越写越乱');
  yield* beat(
    'b1',
    all(
      g1().opacity(1, 0.5),
      ...[0, 1, 2, 3, 4].map(i => chain(waitFor(i * 0.5), codeLines[i]().opacity(1, 0.4))),
      chain(waitFor(2.2), qmark().opacity(1, 0.5)),
    ),
  );

  // b2：三根支柱，第二、三根亮起
  say('第二、三根支柱');
  yield* beat(
    'b2',
    all(
      g1().opacity(0, 0.5),
      g2().opacity(1, 0.5),
      pillars[0]().height(260, 3.5),
      pillars[1]().height(260, 3.5),
      pillars[2]().height(260, 3.5),
      chain(waitFor(1.5), pillars[1]().fill(T.blue, 1)),
      chain(waitFor(2.5), pillars[2]().fill(T.blue, 1)),
    ),
  );

  // b3：小项目代码长成一团乱麻
  say('项目一大就变复杂');
  yield* beat(
    'b3',
    all(
      g2().opacity(0, 0.5),
      g3().opacity(1, 0.5),
      ...[0, 1, 2, 3, 4, 5].map(i => chain(waitFor(1.5 + i * 0.7), messyLines[i]().opacity(1, 0.5))),
      chain(waitFor(1.5), cleanLines[0]().fill(T.red, 1.5)),
    ),
  );

  // b4：复杂度六种症状轮流亮起，依赖线越缠越紧
  say('复杂度六种症状');
  yield* beat(
    'b4',
    all(
      g3().opacity(0, 0.5),
      g4().opacity(1, 0.5),
      tangle[0]().opacity(0.7, 4),
      tangle[1]().opacity(0.7, 6),
      tangle[2]().opacity(0.7, 8),
      ...[0, 1, 2, 3, 4, 5].map(i =>
        chain(waitFor(0.6 + i * 1.4), symptomChips[i]().opacity(1, 0.5), symptomChips[i]().stroke(T.red, 0.5)),
      ),
    ),
  );

  // b5：big ball of mud——泥球越滚越大
  say('big ball of mud');
  yield* beat(
    'b5',
    all(
      g4().opacity(0, 0.4),
      g5().opacity(1, 0.4),
      mudBall().width(340, 3),
      mudBall().height(340, 3),
      ...mudBits.map(b => b().opacity(0, 2.5)),
      chain(waitFor(2.2), mudTag().opacity(1, 0.6)),
    ),
  );

  // b6：复杂拖慢所有人，维护成本上涨
  say('复杂拖慢所有人');
  yield* beat(
    'b6',
    all(
      g5().opacity(0, 0.4),
      g6().opacity(1, 0.4),
      ...walkers.map((w, i) => w().position([120, -120 + i * 90], 2.8)),
      costBar().height(180, 2.8),
    ),
  );

  // b7：预算超支，改一行冒出三个 bug
  say('改动容易引入 bug');
  yield* beat(
    'b7',
    all(
      g6().opacity(0, 0.5),
      g7().opacity(1, 0.5),
      budgetBar().width(920, 4),
      chain(waitFor(4), budgetBar().fill(T.red, 1)),
      ...[0, 1, 2].map(i => chain(waitFor(5 + i * 1.2), bugDots[i]().opacity(1, 0.5))),
    ),
  );

  // b8：泥球被剥掉一层，露出干净内核
  say('降复杂度极改善维护');
  yield* beat(
    'b8',
    all(
      g7().opacity(0, 0.5),
      g8().opacity(1, 0.5),
      mudOuter().opacity(0.35, 3),
      cleanCore().opacity(1, 1),
      cleanCore().width(180, 3),
      cleanCore().height(180, 3),
    ),
  );

  // b9：功能条不动，偶然层被剥掉
  say('简单 ≠ 功能少');
  yield* beat(
    'b9',
    all(
      g8().opacity(0, 0.5),
      g9().opacity(1, 0.5),
      accLayer().position([560, 30], 3),
      accLayer().opacity(0, 3),
    ),
  );

  // b10：偶然复杂度定义卡
  say('偶然复杂度：实现带来的');
  yield* beat('b10', all(g9().opacity(0, 0.5), g10().opacity(1, 0.8), g10().scale(1.04, 7)));

  // b11：两团对照——本质躲不掉，偶然可拆
  say('本质躲不掉，偶然可拆');
  yield* beat(
    'b11',
    all(
      g10().opacity(0, 0.5),
      g11().opacity(1, 0.5),
      // r3：红团只缩到 180——缩到 140 会比“偶然复杂度”五字（约 150px）窄，圆边穿字。
      accidentalBlob().width(180, 3),
      accidentalBlob().height(180, 3),
    ),
  );

  // b12：深度演示——一行 SQL 展开成复杂度，再折叠回去
  say('好抽象藏细节');
  yield* beat(
    'b12',
    sequence(
      2.5,
      all(g11().opacity(0, 0.5), g12().opacity(1, 0.5)),
      all(
        ...sqlDetails.map(d => d().opacity(1, 1)),
        ...sqlDetails.map(d => d().position([d().position.x(), 30], 2.5)),
      ),
      all(
        ...sqlDetails.map(d => d().opacity(0, 1.5)),
        ...sqlDetails.map(d => d().position([d().position.x(), -60], 1.5)),
      ),
    ),
  );

  // b13：好抽象被多个应用复用，改进的光波及全部
  say('复用惠及所有应用');
  yield* beat(
    'b13',
    all(
      g12().opacity(0, 0.5),
      g13().opacity(1, 0.5),
      chain(waitFor(1), absBox().fill(T.green, 1)),
      ...[0, 1, 2].map(i => chain(waitFor(2.5 + i * 1.5), appBoxes[i]().stroke(T.green, 1))),
      chain(waitFor(5.5), absBox().fill(T.blue, 1)),
    ),
  );

  // b14：高级语言与 SQL 各展开一次再折叠
  say('高级语言 · SQL 藏细节');
  yield* beat(
    'b14',
    sequence(
      2.7,
      all(g13().opacity(0, 0.5), g14().opacity(1, 0.5)),
      all(...langDetails.map(d => d().opacity(1, 2))),
      all(...langDetails.map(d => d().opacity(0, 2))),
      all(...sqlDetails2.map(d => d().opacity(1, 2))),
      all(...sqlDetails2.map(d => d().opacity(0, 2))),
    ),
  );

  // b15：满桌好算法，拼不成一个干净盒子
  say('找好抽象很难');
  yield* beat(
    'b15',
    all(
      g14().opacity(0, 0.5),
      g15().opacity(1, 0.5),
      ...[0, 1, 2, 3, 4, 5].map(i => chain(waitFor(i * 0.6), algoChips[i]().position([algoChips[i]().position.x() + 90, algoChips[i]().position.y()], 1.5))),
      ...[0, 1, 2, 3, 4, 5].map(i => chain(waitFor(3.5 + i * 0.4), algoChips[i]().position([algoChips[i]().position.x(), algoChips[i]().position.y()], 1.5))),
    ),
  );

  // b16：大系统拆成几个干净组件
  say('留意好抽象');
  yield* beat(
    'b16',
    all(
      g15().opacity(0, 0.5),
      g16().opacity(1, 0.5),
      chain(waitFor(1), bigSystem().opacity(0, 1)),
      ...[0, 1, 2].map(i => chain(waitFor(1.5 + i * 0.8), components[i]().opacity(1, 0.6))),
    ),
  );
});
