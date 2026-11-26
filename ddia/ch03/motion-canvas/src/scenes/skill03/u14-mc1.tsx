// U14 场景 1（MC，r4）：n0–n11b —— n0 单元站牌（UnitTitle：第 14 站），n1 钩子、聚合函数、虚拟 vs 物化视图、写代价。
// r4：新增首拍 n0 站牌，n1 开头收成左上角页眉；旧 header 已删，改由 unit.header 承担；其余拍一字未动。
// 分镜：skill-ch03/beats-u14.md；原文：DDIA §3.14（书页 p101–102，PDF p123–124）。
// 时长全部来自 timeline/u14.json（beat() 驱动），不手写 waitFor。
// r3 改动：拍号改用设计的 n 拍号；n4 加计数器（扫了几遍）；新增 n9（读物化视图不用重新算）。
import {Circle, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, chain, createRef, waitFor} from '@motion-canvas/core';
import {at, makeBeats} from '../../lib/beats';
import {CHAPTER} from '../../lib/chapter';
import {UnitTitle} from '../../lib/opening';
import {Counter} from '../../lib/schemas';
import {FONT, SAFE, SIZE, T} from '../../lib/theme';
import timeline from '../../timeline/u14.json';

const AGGS: [string, string][] = [
  ['COUNT', '计数'],
  ['SUM', '求和'],
  ['AVG', '平均'],
  ['MIN', '最小'],
  ['MAX', '最大'],
];

export default makeScene2D(function* (view) {
  view.fill(T.bg);
  const beat = makeBeats(timeline);

  // n0：单元站牌（r4，skill v1.11.1 开篇规则）：站牌在 n1 开头收成左上角页眉
  const unit = new UnitTitle(CHAPTER, 'u14');

  const anchor = createRef<Txt>();
  const say = (text: string) => anchor().text(text);

  // ---- n1：钩子 ----
  const g1 = createRef<Node>();
  const totalCard = createRef<Rect>();
  const rawRows = [0, 1, 2].map(() => createRef<Rect>());
  const scanDot = createRef<Circle>();
  const qmark = createRef<Txt>();

  // ---- n2/n2b：聚合函数牌 ----
  const g2 = createRef<Node>();
  const aggChips = AGGS.map(() => createRef<Rect>());

  // ---- n3：行式也在用 ----
  const g3 = createRef<Node>();
  const colCard = createRef<Rect>();
  const rowCard = createRef<Rect>();

  // ---- n4：同样的聚合算了一遍又一遍 ----
  const g4 = createRef<Node>();
  const qCards = [0, 1, 2].map(() => createRef<Rect>());
  const qArrows = [0, 1, 2].map(() => createRef<Line>());
  const sumChip = createRef<Rect>();
  const rawBar = createRef<Rect>();
  const scanDot2 = createRef<Circle>();
  const scanCounter = new Counter([180, 215], '扫了 ', ' 遍');

  // ---- n5：缓存 ----
  const g5 = createRef<Node>();
  const cacheBox = createRef<Rect>();
  const countChip = createRef<Rect>();
  const sumChip2 = createRef<Rect>();
  const cachedTag = createRef<Txt>();

  // ---- n6–n7b：虚拟视图 ----
  const g6 = createRef<Node>();
  const viewCard = createRef<Rect>();
  const viewSub = createRef<Txt>();
  const shortcutTag = createRef<Txt>();
  const queryBox = createRef<Rect>();
  const expandArrow = createRef<Line>();
  const expandLab = createRef<Txt>();
  const readArrow = createRef<Line>();
  const rawBar2 = createRef<Rect>();
  const arrow2 = createRef<Line>();

  // ---- n8–n10：物化视图 ----
  const g8 = createRef<Node>();
  const ghostView = createRef<Rect>();
  const diskBox = createRef<Rect>();
  const trueTag = createRef<Txt>();
  const directReadTag = createRef<Txt>();
  const rawBar3 = createRef<Rect>();
  const updateArrow = createRef<Line>();
  const writeTag = createRef<Txt>();
  const g10 = createRef<Node>();
  const oltCard = createRef<Rect>();
  const crossMark = createRef<Txt>();
  const whCard = createRef<Rect>();
  const checkMark = createRef<Txt>();
  const condTag = createRef<Txt>();

  view.add(
    <>
      {unit.nodes()}
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

      {/* n1 */}
      <Node ref={g1} opacity={0}>
        <Rect ref={totalCard} position={[0, -220]} width={240} height={64} radius={14} fill={T.card} stroke={T.line} lineWidth={2}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'总数'} />
        </Rect>
        <Txt position={[-500, -172]} offset={[-1, -1]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'原始数据'} />
        {[0, 1, 2].map(i => (
          <Rect
            key={`row-${i}`}
            ref={rawRows[i]}
            position={[0, -120 + i * 60]}
            width={1000}
            height={44}
            radius={10}
            fill={T.card}
            stroke={T.line}
            lineWidth={2}
          />
        ))}
        <Circle ref={scanDot} position={[-480, -120]} width={24} height={24} fill={T.yellow} opacity={0} />
        <Txt ref={qmark} position={[535, -60]} fontSize={72} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'?'} opacity={0} />
      </Node>

      {/* n2/n2b */}
      <Node ref={g2} opacity={0}>
        {AGGS.map(([name, cn], i) => (
          <Rect
            key={`agg-${i}`}
            ref={aggChips[i]}
            position={[-440 + i * 220, -60]}
            width={200}
            height={100}
            radius={14}
            fill={T.card}
            stroke={T.blue}
            lineWidth={2}
            opacity={0}
          >
            <Txt position={[0, -18]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.mono} text={name} />
            <Txt position={[0, 26]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={cn} />
          </Rect>
        ))}
      </Node>

      {/* n3 */}
      <Node ref={g3} opacity={0}>
        <Rect ref={rowCard} position={[-280, -60]} width={420} height={150} radius={16} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt position={[0, -28]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'行式数据库'} />
          <Txt position={[0, 28]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'也在用'} />
        </Rect>
        <Rect ref={colCard} position={[280, -60]} width={420} height={150} radius={16} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt position={[0, -28]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'列式存储'} />
          <Txt position={[0, 28]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'对即席查询更快'} />
        </Rect>
      </Node>

      {/* n4 */}
      <Node ref={g4} opacity={0}>
        {[0, 1, 2].map(i => (
          <Rect
            key={`q-${i}`}
            ref={qCards[i]}
            position={[-420, -160 + i * 100]}
            width={260}
            height={80}
            radius={12}
            fill={T.card}
            stroke={T.line}
            lineWidth={2}
            opacity={0}
          >
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={`查询 ${i + 1}`} />
          </Rect>
        ))}
        {[0, 1, 2].map(i => (
          <Line
            key={`qa-${i}`}
            ref={qArrows[i]}
            points={[[-290, -160 + i * 100], [60, -60]]}
            stroke={T.blue}
            lineWidth={3}
            endArrow
            opacity={0}
          />
        ))}
        <Rect ref={sumChip} position={[180, -60]} width={240} height={120} radius={16} fill={T.card} stroke={T.blue} lineWidth={3} opacity={0}>
          <Txt position={[0, -22]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.mono} text={'SUM'} />
          <Txt position={[0, 26]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'求和'} />
        </Rect>
        <Rect ref={rawBar} position={[180, 140]} width={560} height={56} radius={12} fill={T.card} stroke={T.line} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'原始数据'} />
        </Rect>
        <Circle ref={scanDot2} position={[-80, 140]} width={22} height={22} fill={T.yellow} opacity={0} />
        {scanCounter.node}
      </Node>

      {/* n5 */}
      <Node ref={g5} opacity={0}>
        <Rect ref={cacheBox} position={[0, -60]} width={560} height={200} radius={18} fill={T.card} stroke={T.green} lineWidth={3} opacity={0}>
          <Txt position={[0, -72]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'缓存'} />
        </Rect>
        <Rect ref={countChip} position={[-120, -260]} width={200} height={90} radius={12} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt position={[0, -16]} fontSize={SIZE.label} fontWeight={700} fill={T.text} fontFamily={FONT.mono} text={'COUNT'} />
          <Txt position={[0, 22]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'计数'} />
        </Rect>
        <Rect ref={sumChip2} position={[120, -260]} width={200} height={90} radius={12} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt position={[0, -16]} fontSize={SIZE.label} fontWeight={700} fill={T.text} fontFamily={FONT.mono} text={'SUM'} />
          <Txt position={[0, 22]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'求和'} />
        </Rect>
        <Txt ref={cachedTag} position={[0, 140]} fontSize={SIZE.body} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'已缓存'} opacity={0} />
      </Node>

      {/* n6–n7b */}
      <Node ref={g6} opacity={0}>
        <Rect ref={viewCard} position={[-280, -80]} width={440} height={200} radius={18} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt position={[0, -40]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'虚拟视图'} />
          <Txt ref={viewSub} position={[0, 30]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'像一张表'} opacity={0} />
        </Rect>
        <Txt ref={shortcutTag} position={[-280, 60]} fontSize={SIZE.body} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'只是快捷方式'} opacity={0} />
        <Line ref={expandArrow} points={[[-60, -80], [60, -80]]} stroke={T.blue} lineWidth={3} endArrow opacity={0} />
        <Txt ref={expandLab} position={[0, -125]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'展开'} opacity={0} />
        <Rect ref={queryBox} position={[280, -80]} width={440} height={200} radius={18} fill={T.card} stroke={T.line} lineWidth={2} opacity={0}>
          <Txt position={[0, -30]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'SELECT SUM(净价)'} />
          <Txt position={[0, 20]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'FROM 销售事实表'} />
        </Rect>
        <Line ref={readArrow} points={[[-280, -265], [-280, -185]]} stroke={T.blue} lineWidth={3} endArrow opacity={0} />
        <Line ref={arrow2} points={[[280, 25], [280, 105]]} stroke={T.blue} lineWidth={3} endArrow opacity={0} />
        <Rect ref={rawBar2} position={[280, 140]} width={440} height={60} radius={12} fill={T.card} stroke={T.line} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'原始数据'} />
        </Rect>
      </Node>

      {/* n8–n10 */}
      <Node ref={g8} opacity={0}>
        <Rect ref={rawBar3} position={[0, -260]} width={900} height={44} radius={10} fill={T.card} stroke={T.line} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'原始数据'} />
        </Rect>
        <Line ref={updateArrow} points={[[180, -236], [180, -195]]} stroke={T.yellow} lineWidth={3} endArrow opacity={0} />
        <Rect ref={ghostView} position={[-380, -80]} width={280} height={160} radius={16} fill={T.card} stroke={T.line} lineWidth={2} opacity={0.35}>
          <Txt fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'虚拟视图'} />
        </Rect>
        <Rect ref={diskBox} position={[180, -80]} width={520} height={220} radius={18} fill={T.card} stroke={T.line} lineWidth={2} opacity={0}>
          <Txt position={[0, -80]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'磁盘'} />
          <Rect position={[0, 15]} width={400} height={110} radius={12} fill={T.card} stroke={T.green} lineWidth={2}>
            <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'查询结果表（副本）'} />
          </Rect>
        </Rect>
        <Txt ref={trueTag} position={[180, 80]} fontSize={SIZE.body} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'真副本'} opacity={0} />
        <Txt ref={directReadTag} position={[180, 140]} fontSize={SIZE.body} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'不用重新算，直接读'} opacity={0} />
        <Txt ref={writeTag} position={[430, 80]} fontSize={SIZE.body} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'写变贵'} opacity={0} />
      </Node>

      {/* n11/n11b */}
      <Node ref={g10} opacity={0}>
        <Rect ref={oltCard} position={[-280, -60]} width={440} height={150} radius={16} fill={T.card} stroke={T.line} lineWidth={2} opacity={0}>
          <Txt position={[0, -28]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'交易型数据库'} />
          <Txt ref={crossMark} position={[0, 32]} fontSize={44} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'✗'} opacity={0} />
        </Rect>
        <Rect ref={whCard} position={[280, -60]} width={440} height={150} radius={16} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt position={[0, -28]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'读得多的仓库'} />
          <Txt ref={checkMark} position={[0, 32]} fontSize={44} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'✓'} opacity={0} />
        </Rect>
        <Txt ref={condTag} position={[0, 140]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'是不是真的更快，要看具体情况'} opacity={0} />
      </Node>
    </>
  );

  // n0：单元站牌（演示拍，念完留 0.8s）
  yield* beat('n0', unit.enter());

  say('同样的总数算了又算？');
  yield* beat('n1',
    unit.toHeader(),
    all(g1().opacity(1, 0.5)),
    at('今天算一遍', chain(scanDot().opacity(1, 0.3), scanDot().position([480, -120], 1.2))),
    at('明天还要再算一遍', chain(
      waitFor(0.4),
      scanDot().opacity(0, 0.2), scanDot().position([-480, -60], 0.01), scanDot().opacity(1, 0.2), scanDot().position([480, -60], 1.2),
      scanDot().opacity(0, 0.2), scanDot().position([-480, 0], 0.01), scanDot().opacity(1, 0.2), scanDot().position([480, 0], 1.2),
    )),
    at('先算好', totalCard().stroke(T.yellow, 0.4)),
    at('存起来', qmark().opacity(1, 0.4)),
  );

  say('聚合函数');
  yield* beat('n2',
    all(g1().opacity(0, 0.5), g2().opacity(1, 0.5)),
    chain(aggChips[0]().opacity(1, 0.4), aggChips[1]().opacity(1, 0.4), aggChips[2]().opacity(1, 0.4), aggChips[3]().opacity(1, 0.4), aggChips[4]().opacity(1, 0.4)),
  );

  say('计数、求和、平均……');
  yield* beat('n2b',
    at('计数', aggChips[0]().stroke(T.yellow, 0.4)),
    at('求和', aggChips[1]().stroke(T.yellow, 0.4)),
    at('平均', aggChips[2]().stroke(T.yellow, 0.4)),
    at('最小', aggChips[3]().stroke(T.yellow, 0.4)),
    at('最大', aggChips[4]().stroke(T.yellow, 0.4)),
  );

  say('不一定都是列存');
  yield* beat('n3',
    all(g2().opacity(0, 0.5), g3().opacity(1, 0.5)),
    at('列存', colCard().opacity(1, 0.5)),
    at('行式数据库', rowCard().opacity(1, 0.5)),
    at('即席查询', colCard().stroke(T.yellow, 0.4)),
  );

  say('同样的聚合算了一遍又一遍');
  yield* beat('n4',
    all(g3().opacity(0, 0.5), g4().opacity(1, 0.5), scanCounter.node.opacity(1, 0.4)),
    at('很多查询', chain(qCards[0]().opacity(1, 0.4), qCards[1]().opacity(1, 0.4), qCards[2]().opacity(1, 0.4), sumChip().opacity(1, 0.5))),
    at('同样的聚合', all(qArrows[0]().opacity(1, 0.4), qArrows[1]().opacity(1, 0.4), qArrows[2]().opacity(1, 0.4), sumChip().stroke(T.yellow, 0.4))),
    at('从头扫原始数据', all(
      chain(rawBar().opacity(1, 0.4), scanDot2().opacity(1, 0.3), scanDot2().position([440, 140], 1.8)),
      chain(waitFor(0.5), scanCounter.bump(), scanCounter.bump(), scanCounter.bump()),
    )),
    at('太浪费了', rawBar().stroke(T.red, 0.4)),
  );

  say('先算好，存起来');
  yield* beat('n5',
    all(g4().opacity(0, 0.5), g5().opacity(1, 0.5), cacheBox().opacity(1, 0.5)),
    at('最常用的计数和求和', chain(
      all(countChip().opacity(1, 0.3), countChip().position([-120, -10], 0.8)),
      all(sumChip2().opacity(1, 0.3), sumChip2().position([120, -10], 0.8)),
    )),
    at('缓存起来', cachedTag().opacity(1, 0.5)),
  );

  say('虚拟视图：快捷方式');
  yield* beat('n6',
    all(g5().opacity(0, 0.5), g6().opacity(1, 0.5)),
    at('虚拟视图', viewCard().opacity(1, 0.5)),
    at('一张表', viewSub().opacity(1, 0.4)),
    at('快捷方式', all(queryBox().opacity(1, 0.5), expandArrow().opacity(1, 0.4), expandLab().opacity(1, 0.4), shortcutTag().opacity(1, 0.4))),
  );

  say('读时当场展开');
  yield* beat('n7',
    at('引擎当场', readArrow().opacity(1, 0.5)),
    at('展开成底层的查询', chain(viewCard().opacity(0.15, 0.5), all(queryBox().stroke(T.yellow, 0.5), queryBox().scale(1.06, 1.0)))),
  );

  say('处理展开后的查询');
  yield* beat('n7b',
    at('处理', all(arrow2().opacity(1, 0.4), rawBar2().opacity(1, 0.4))),
  );

  say('物化视图：真副本');
  yield* beat('n8',
    all(g6().opacity(0, 0.5), g8().opacity(1, 0.5)),
    at('真副本', diskBox().opacity(1, 0.5)),
    at('写在磁盘上', trueTag().opacity(1, 0.4)),
  );

  say('不用重新算，直接读');
  yield* beat('n9',
    at('不用重新算', chain(
      all(diskBox().stroke(T.green, 0.4), directReadTag().opacity(1, 0.4)),
      waitFor(0.8),
      diskBox().stroke(T.line, 0.8),
    )),
  );

  say('数据变了，副本要更新');
  yield* beat('n10',
    all(rawBar3().opacity(1, 0.5)),
    at('底层数据变了', rawBar3().stroke(T.red, 0.4)),
    at('跟着更新', chain(updateArrow().opacity(1, 0.4), diskBox().stroke(T.yellow, 0.4), diskBox().stroke(T.line, 1.0))),
    at('写就变贵了', writeTag().opacity(1, 0.5)),
  );

  say('写贵了，读仓库里才值');
  yield* beat('n11',
    all(g8().opacity(0, 0.5), g10().opacity(1, 0.5)),
    g10().scale(1.02, beat.dur('n11')),
    at('交易型数据库', all(oltCard().opacity(1, 0.5), crossMark().opacity(1, 0.4))),
    at('读得多的仓库', all(whCard().opacity(1, 0.5), checkMark().opacity(1, 0.4))),
  );

  say('看具体情况');
  yield* beat('n11b',
    at('看具体情况', condTag().opacity(1, 0.5)),
  );
});
