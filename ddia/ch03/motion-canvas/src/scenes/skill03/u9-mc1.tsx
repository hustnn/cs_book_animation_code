// U9 场景 1（MC）：b1–b10 —— 钩子、几十个业务系统各自为政、管理员看守、
// 分析查询拖垮交易、独立数据仓库、只读副本、ETL 之抽取与转换。
// 分镜：skill-ch03/beats-u9.md；原文：DDIA §3.8（书页 p91–92，PDF p113–114）。
// 时长全部来自 timeline/u9.json（beat() 驱动），不手写 waitFor。
import {Circle, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, chain, createRef} from '@motion-canvas/core';
import {at, makeBeats} from '../../lib/beats';
import {FONT, SAFE, SIZE, T} from '../../lib/theme';
import timeline from '../../timeline/u9.json';

const SYS_NAMES = ['网站', '收银', '库存', '路线规划', '供应商', '员工管理'];
const SYS_POS: [number, number][] = [
  [-380, -170], [0, -170], [380, -170],
  [-380, -30], [0, -30], [380, -30],
];

export default makeScene2D(function* (view) {
  view.fill(T.bg);
  const beat = makeBeats(timeline);

  const header = createRef<Txt>();
  const anchor = createRef<Txt>();
  const say = (text: string) => anchor().text(text);

  // ---- b1–b3：六个系统 ----
  const g1 = createRef<Node>();
  const sysCards = SYS_NAMES.map(() => createRef<Rect>());
  const sysLabs = SYS_NAMES.map(() => createRef<Txt>());
  const sysTeams = SYS_NAMES.map(() => createRef<Txt>());
  const sysLinks = [0, 1, 2].map(() => createRef<Line>());
  const g1q = createRef<Txt>();

  // ---- b4：高可用、低延迟 ----
  const g4 = createRef<Node>();
  const txCard = createRef<Rect>();
  const txArrow = createRef<Line>();
  const dbBox = createRef<Rect>();
  const lowLat = createRef<Txt>();
  const highAv = createRef<Txt>();

  // ---- b5：管理员看守 ----
  const g5 = createRef<Node>();
  const guardCard = createRef<Rect>();
  const guardPlate = createRef<Txt>();
  const db5 = createRef<Rect>();
  const analystCard = createRef<Rect>();
  const blockedTag = createRef<Txt>();

  // ---- b6：分析查询拖垮交易 ----
  const g6 = createRef<Node>();
  const dots = Array.from({length: 40}, () => createRef<Rect>());
  const scanLine = createRef<Line>();
  const scanTag = createRef<Txt>();
  const queueCards = [0, 1, 2, 3].map(() => createRef<Rect>());
  const queueTag = createRef<Txt>();

  // ---- b7–b8：独立仓库 + 只读副本 ----
  const g7 = createRef<Node>();
  const oldDb = createRef<Rect>();
  const whBody = createRef<Rect>();
  const whLid = createRef<Circle>();
  const whTag = createRef<Txt>();
  const whLab = createRef<Txt>();
  const analyst7 = createRef<Rect>();
  const qArrow = createRef<Line>();
  const txArrow7 = createRef<Line>();
  const txCard7 = createRef<Rect>();
  const packets = [0, 1, 2].map(() => createRef<Circle>());
  const miniDbs = [0, 1, 2].map(() => createRef<Rect>());
  const roTag = createRef<Txt>();

  // ---- b9：抽取 ----
  const g9 = createRef<Node>();
  const extBox = createRef<Rect>();
  const dumpCard = createRef<Rect>();
  const streamCard = createRef<Rect>();
  const extArrowL = createRef<Line>();
  const extArrowR = createRef<Line>();

  // ---- b10：转换 ----
  const g10 = createRef<Node>();
  const trBox = createRef<Rect>();
  const messy = [0, 1, 2].map(() => createRef<Rect>());
  const tidyBox = createRef<Rect>();

  const dotPos = (i: number): [number, number] => {
    const col = i % 10;
    const row = Math.floor(i / 10);
    return [-520 + col * 44, -200 + row * 44];
  };

  view.add(
    <>
      <Txt
        ref={header}
        position={[-SAFE.halfW, -SAFE.halfH]}
        offset={[-1, -1]}
        fontSize={SIZE.label}
        fill={T.muted}
        fontFamily={FONT.sans}
        text={'数据仓库与 ETL'}
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

      {/* b1–b3：六个系统 */}
      <Node ref={g1} opacity={0}>
        {SYS_NAMES.map((name, i) => (
          <Rect
            key={`sys-${i}`}
            ref={sysCards[i]}
            position={SYS_POS[i]}
            width={320}
            height={90}
            radius={14}
            fill={T.card}
            stroke={T.line}
            lineWidth={2}
          >
            <Txt ref={sysLabs[i]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={name} opacity={0} />
          </Rect>
        ))}
        {SYS_NAMES.map((_, i) => (
          <Txt
            key={`team-${i}`}
            ref={sysTeams[i]}
            position={[SYS_POS[i][0], SYS_POS[i][1] + 68]}
            fontSize={SIZE.label}
            fill={T.muted}
            fontFamily={FONT.sans}
            text={'一个团队维护'}
            opacity={0}
          />
        ))}
        <Line ref={sysLinks[0]} points={[[-220, -170], [-160, -170]]} stroke={T.line} lineWidth={2} opacity={0} />
        <Line ref={sysLinks[1]} points={[[160, -170], [220, -170]]} stroke={T.line} lineWidth={2} opacity={0} />
        <Line ref={sysLinks[2]} points={[[-220, -30], [-160, -30]]} stroke={T.line} lineWidth={2} opacity={0} />
        <Txt ref={g1q} position={[0, 150]} fontSize={72} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'?'} opacity={0} />
      </Node>

      {/* b4：高可用、低延迟 */}
      <Node ref={g4} opacity={0}>
        <Rect ref={txCard} position={[-380, -80]} width={300} height={100} radius={14} fill={T.card} stroke={T.blue} lineWidth={2}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'一笔交易'} />
        </Rect>
        <Line ref={txArrow} points={[[-230, -80], [-130, -80]]} stroke={T.blue} lineWidth={3} endArrow opacity={0} />
        <Rect ref={dbBox} position={[200, -80]} width={360} height={100} radius={14} fill={T.card} stroke={T.line} lineWidth={2}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'数据库'} />
        </Rect>
        <Txt ref={lowLat} position={[200, -170]} fontSize={SIZE.body} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'低延迟'} opacity={0} />
        <Txt ref={highAv} position={[200, 20]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} text={'高可用：对业务至关重要'} opacity={0} />
      </Node>

      {/* b5：管理员看守 */}
      <Node ref={g5} opacity={0}>
        <Rect ref={guardCard} position={[-420, -80]} width={220} height={100} radius={14} fill={T.card} stroke={T.green} lineWidth={2}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'管理员'} />
        </Rect>
        <Txt ref={guardPlate} position={[-420, 20]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} text={'严密看守'} opacity={0} />
        <Rect ref={db5} position={[0, -80]} width={360} height={100} radius={14} fill={T.card} stroke={T.line} lineWidth={2}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'交易数据库'} />
        </Rect>
        <Rect ref={analystCard} position={[420, -80]} width={220} height={100} radius={14} fill={T.card} stroke={T.line} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'分析师'} />
        </Rect>
        <Txt ref={blockedTag} position={[420, 20]} fontSize={SIZE.label} fill={T.red} fontFamily={FONT.sans} text={'即席查询：不让跑'} opacity={0} />
      </Node>

      {/* b6：分析查询拖垮交易 */}
      <Node ref={g6} opacity={0}>
        {dots.map((_, i) => (
          <Rect
            key={`dot-${i}`}
            ref={dots[i]}
            position={dotPos(i)}
            width={26}
            height={26}
            radius={6}
            fill={T.card}
            stroke={T.line}
            lineWidth={1}
            opacity={0}
          />
        ))}
        <Line ref={scanLine} points={[[-520, -215], [-520, -55]]} stroke={T.yellow} lineWidth={4} opacity={0} />
        <Txt ref={scanTag} position={[-300, 60]} fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.sans} text={'扫过数据集的大部分'} opacity={0} />
        {[0, 1, 2, 3].map(i => (
          <Rect
            key={`q-${i}`}
            ref={queueCards[i]}
            position={[380, -200 + i * 90]}
            width={300}
            height={64}
            radius={12}
            fill={T.card}
            stroke={T.line}
            lineWidth={2}
            opacity={0}
          >
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'等着执行的事务'} />
          </Rect>
        ))}
        <Txt ref={queueTag} position={[380, 150]} fontSize={SIZE.label} fill={T.red} fontFamily={FONT.sans} text={'排队变慢'} opacity={0} />
      </Node>

      {/* b7–b8：独立仓库 */}
      <Node ref={g7} opacity={0}>
        <Rect ref={oldDb} position={[-80, -60]} width={300} height={110} radius={14} fill={T.card} stroke={T.line} lineWidth={2}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'交易数据库'} />
        </Rect>
        <Rect ref={txCard7} position={[-80, -230]} width={300} height={70} radius={12} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'交易'} />
        </Rect>
        <Line ref={txArrow7} points={[[-80, -195], [-80, -115]]} stroke={T.blue} lineWidth={3} endArrow opacity={0} />
        <Rect ref={whBody} position={[280, -60]} width={340} height={130} radius={16} fill={T.card} stroke={T.blue} lineWidth={3} opacity={0}>
          <Txt ref={whLab} position={[0, 30]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'数据仓库'} opacity={0} />
        </Rect>
        <Circle ref={whLid} position={[280, -125]} width={340} height={44} fill={T.bg} stroke={T.blue} lineWidth={3} opacity={0} />
        <Txt ref={whTag} position={[280, -190]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} text={'独立的数据库'} opacity={0} />
        <Rect ref={analyst7} position={[-80, 130]} width={300} height={70} radius={12} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'分析师'} />
        </Rect>
        <Line ref={qArrow} points={[[70, 130], [110, -60]]} stroke={T.green} lineWidth={3} endArrow opacity={0} />
        {[0, 1, 2].map(i => (
          <Rect
            key={`mini-${i}`}
            ref={miniDbs[i]}
            position={[-480, -250 + i * 70]}
            width={120}
            height={56}
            radius={10}
            fill={T.card}
            stroke={T.line}
            lineWidth={2}
            opacity={0}
          >
            <Txt fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={['销售库', '库存库', '地理库'][i]} />
          </Rect>
        ))}
        {[0, 1, 2].map(i => (
          <Circle key={`pkt-${i}`} ref={packets[i]} position={[-480, -250 + i * 70]} width={22} height={22} fill={T.yellow} opacity={0} />
        ))}
        <Txt ref={roTag} position={[280, 60]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'只读副本'} opacity={0} />
      </Node>

      {/* b9：抽取 */}
      <Node ref={g9} opacity={0}>
        <Rect ref={dumpCard} position={[-400, -80]} width={280} height={90} radius={14} fill={T.card} stroke={T.line} lineWidth={2}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'定期转储'} />
        </Rect>
        <Rect ref={streamCard} position={[400, -80]} width={280} height={90} radius={14} fill={T.card} stroke={T.line} lineWidth={2}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'连续更新流'} />
        </Rect>
        <Line ref={extArrowL} points={[[-260, -80], [-140, -80]]} stroke={T.blue} lineWidth={3} endArrow opacity={0} />
        <Line ref={extArrowR} points={[[260, -80], [140, -80]]} stroke={T.blue} lineWidth={3} endArrow opacity={0} />
        <Rect ref={extBox} position={[0, -80]} width={260} height={90} radius={14} fill={T.card} stroke={T.yellow} lineWidth={3} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'抽取'} />
        </Rect>
      </Node>

      {/* b10：转换 */}
      <Node ref={g10} opacity={0}>
        {[0, 1, 2].map(i => (
          <Rect
            key={`messy-${i}`}
            ref={messy[i]}
            position={[-420, -160 + i * 80]}
            width={240}
            height={56}
            radius={10}
            fill={T.card}
            stroke={T.red}
            lineWidth={2}
            opacity={0}
          >
            <Txt fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.mono} text={['杂：a=1;b=2', '杂：x|y|z', '杂：9?4!'][i]} />
          </Rect>
        ))}
        <Rect ref={trBox} position={[0, -80]} width={260} height={90} radius={14} fill={T.card} stroke={T.yellow} lineWidth={3} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'转换'} />
        </Rect>
        <Rect ref={tidyBox} position={[400, -80]} width={280} height={150} radius={14} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt position={[0, -40]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'日期 | 产品 | 数量'} />
          <Txt position={[0, 0]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'140102 | 31 | 1'} />
          <Txt position={[0, 40]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'适合分析的模式'} />
        </Rect>
      </Node>
    </>
  );

  say('几十个库，怎么凑一起算？');
  yield* beat('b1',
    all(g1().opacity(1, 0.5)),
    at('几十个业务库', chain(sysCards[0]().opacity(1, 0.4), sysCards[1]().opacity(1, 0.4), sysCards[2]().opacity(1, 0.4), sysCards[3]().opacity(1, 0.4), sysCards[4]().opacity(1, 0.4), sysCards[5]().opacity(1, 0.4))),
    at('凑到一起算', chain(g1q().opacity(1, 0.4), g1q().scale(1.15, 0.8))),
  );

  say('六个系统，各自为政');
  yield* beat('b2',
    at('网站', sysLabs[0]().opacity(1, 0.4)),
    at('收银', sysLabs[1]().opacity(1, 0.4)),
    at('库存', sysLabs[2]().opacity(1, 0.4)),
    at('路线规划', sysLabs[3]().opacity(1, 0.4)),
    at('供应商', sysLabs[4]().opacity(1, 0.4)),
    at('员工管理', sysLabs[5]().opacity(1, 0.4)),
  );

  say('各自独立运行');
  yield* beat('b3',
    all(sysLinks[0]().opacity(0.5, 0.4), sysLinks[1]().opacity(0.5, 0.4), sysLinks[2]().opacity(0.5, 0.4)),
    at('一个团队', chain(sysTeams[0]().opacity(1, 0.3), sysTeams[1]().opacity(1, 0.3), sysTeams[2]().opacity(1, 0.3), sysTeams[3]().opacity(1, 0.3), sysTeams[4]().opacity(1, 0.3), sysTeams[5]().opacity(1, 0.3))),
    at('各自独立运行', all(sysLinks[0]().opacity(0.12, 0.6), sysLinks[1]().opacity(0.12, 0.6), sysLinks[2]().opacity(0.12, 0.6))),
  );

  say('高可用、低延迟');
  yield* beat('b4',
    all(g1().opacity(0, 0.5), g4().opacity(1, 0.5)),
    at('高可用', highAv().opacity(1, 0.4)),
    at('低延迟', all(lowLat().opacity(1, 0.4), txArrow().opacity(1, 0.4))),
    at('至关重要', dbBox().stroke(T.green, 0.5)),
  );

  say('管理员严密看守');
  yield* beat('b5',
    all(g4().opacity(0, 0.5), g5().opacity(1, 0.5)),
    at('严密看守', guardPlate().opacity(1, 0.4)),
    at('分析师', analystCard().opacity(1, 0.5)),
    at('即席分析查询', blockedTag().opacity(1, 0.4)),
  );

  say('分析查询拖垮交易');
  yield* beat('b6',
    all(g5().opacity(0, 0.5), g6().opacity(1, 0.5), ...dots.map(d => d().opacity(1, 0.4))),
    at('扫数据集的大部分', all(scanLine().opacity(1, 0.4), scanTag().opacity(1, 0.4), scanLine().position([620, 0], 2.2))),
    at('并发执行的事务', chain(queueCards[0]().opacity(1, 0.25), queueCards[1]().opacity(1, 0.25), queueCards[2]().opacity(1, 0.25), queueCards[3]().opacity(1, 0.25), queueTag().opacity(1, 0.3))),
  );

  say('独立仓库，随便查');
  yield* beat('b7',
    all(g6().opacity(0, 0.5), g7().opacity(1, 0.5)),
    at('另建一个库', all(whBody().opacity(1, 0.5), whLid().opacity(1, 0.5))),
    at('数据仓库', all(whLab().opacity(1, 0.4), whTag().opacity(1, 0.4))),
    at('不影响交易', all(txCard7().opacity(1, 0.4), txArrow7().opacity(1, 0.4), analyst7().opacity(1, 0.4), qArrow().opacity(1, 0.5))),
  );

  say('只读副本');
  yield* beat('b8',
    at('全部业务库数据', chain(miniDbs[0]().opacity(1, 0.3), miniDbs[1]().opacity(1, 0.3), miniDbs[2]().opacity(1, 0.3))),
    at('只读副本', all(
      packets[0]().opacity(1, 0.2), packets[0]().position([280, -60], 0.9),
      packets[1]().opacity(1, 0.2), packets[1]().position([280, -60], 0.9),
      packets[2]().opacity(1, 0.2), packets[2]().position([280, -60], 0.9),
      roTag().opacity(1, 0.3),
    )),
  );

  say('第一步：抽取');
  yield* beat('b9',
    all(g7().opacity(0, 0.5), g9().opacity(1, 0.5)),
    at('抽取', all(extBox().opacity(1, 0.5), extArrowL().opacity(1, 0.4), extArrowR().opacity(1, 0.4))),
    at('定期转储', dumpCard().stroke(T.yellow, 0.4)),
    at('连续的更新流', streamCard().stroke(T.yellow, 0.4)),
  );

  say('第二步：转换');
  yield* beat('b10',
    all(g9().opacity(0, 0.5), g10().opacity(1, 0.5)),
    at('转换', all(trBox().opacity(1, 0.5), messy[0]().opacity(1, 0.3), messy[1]().opacity(1, 0.3), messy[2]().opacity(1, 0.3))),
    at('适合分析的模式', tidyBox().opacity(1, 0.5)),
  );
});
