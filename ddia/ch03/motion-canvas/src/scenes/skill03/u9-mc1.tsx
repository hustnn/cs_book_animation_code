// U9 场景 1（MC）r5：i1–i11 —— 钩子、几十个业务系统各自为政、管理员看守、
// 分析查询拖垮交易（走查拆成 i6/i7）、独立数据仓库（走查拆成 i8/i9）、
// 只读副本（走查拆成 i10/i11）。排队用 Counter 计数；副本数据包沿曲线飞入仓库。
// r4 改动（B33）：i9 加一句并画面对照——排队计数器归零变绿、仓库旁大查询进度条慢慢涨。
// r5 改动（r4 新手测试）：i2 屏幕字改“比如这六个，各自为政”；i10 加小注“三路是例子，其余系统同样汇入”。
// r7 改动（r6 新手测试 5 项 P2 + 站牌）：新增 i0 站牌（UnitTitle：第 9 站，i1 开头收成左上角页眉；旧 header 已删）；
// i6a 扫描线扫过的点变黄（前 8 列），线停在第 8/9 列之间，未扫过的 2 列保持灰色；i11 加“写进去的，是加载过程”半句 + 小标。
// r8 改动（r7 新手测试 P2-1）：i9 分析师→仓库的绿箭头旁加绿色小标“查询”（箭头本就是查询方向，Figure 3-8 原图 analyst —query→ 仓库；与 i11 只读对齐）。
// 分镜：skill-ch03/beats-u9.md；原文：DDIA §3.8（书页 p91–92，PDF p113–114）。
// 时长全部来自 timeline/u9.json（beat() 驱动），不手写 waitFor。
import {Circle, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, chain, createRef, sequence} from '@motion-canvas/core';
import {at, makeBeats} from '../../lib/beats';
import {Counter, Meter} from '../../lib/schemas';
import {FONT, SAFE, SIZE, T} from '../../lib/theme';
import {UnitTitle} from '../../lib/opening';
import {CHAPTER} from '../../lib/chapter';
import timeline from '../../timeline/u9.json';

const SYS_NAMES = ['网站', '实体店收银', '库存', '路线规划', '供应商', '员工管理'];
const SYS_POS: [number, number][] = [
  [-380, -170], [0, -170], [380, -170],
  [-380, -30], [0, -30], [380, -30],
];

export default makeScene2D(function* (view) {
  view.fill(T.bg);
  const beat = makeBeats(timeline);

  const anchor = createRef<Txt>();
  const say = (text: string) => anchor().text(text);

  // ---- i1–i3：六个系统 ----
  const g1 = createRef<Node>();
  const sysCards = SYS_NAMES.map(() => createRef<Rect>());
  const sysLabs = SYS_NAMES.map(() => createRef<Txt>());
  const sysTeams = SYS_NAMES.map(() => createRef<Txt>());
  const sysLinks = [0, 1, 2].map(() => createRef<Line>());
  const g1q = createRef<Txt>();

  // ---- i4：高可用、低延迟 ----
  const g4 = createRef<Node>();
  const txCard = createRef<Rect>();
  const txArrow = createRef<Line>();
  const dbBox = createRef<Rect>();
  const lowLat = createRef<Txt>();
  const highAv = createRef<Txt>();

  // ---- i5：管理员看守 ----
  const g5 = createRef<Node>();
  const guardCard = createRef<Rect>();
  const guardPlate = createRef<Txt>();
  const db5 = createRef<Rect>();
  const analystCard = createRef<Rect>();
  const blockedTag = createRef<Txt>();

  // ---- i6–i7：分析查询拖垮交易 ----
  const g6 = createRef<Node>();
  const dots = Array.from({length: 40}, () => createRef<Rect>());
  const scanLine = createRef<Line>();
  const scanTag = createRef<Txt>();
  const queueCards = [0, 1, 2, 3].map(() => createRef<Rect>());
  const queueTag = createRef<Txt>();
  const queueCount = new Counter([380, 200], '排队 ', ' 笔');

  // ---- i8–i11：独立仓库 + 只读副本 ----
  const g7 = createRef<Node>();
  const oldDb = createRef<Rect>();
  const whBody = createRef<Rect>();
  const whLid = createRef<Circle>();
  const whTag = createRef<Txt>();
  const whLab = createRef<Txt>();
  const analyst7 = createRef<Rect>();
  const qArrow = createRef<Line>();
  const qLab = createRef<Txt>();
  const txArrow7 = createRef<Line>();
  const txCard7 = createRef<Rect>();
  const packets = [0, 1, 2].map(() => createRef<Circle>());
  const miniDbs = [0, 1, 2].map(() => createRef<Rect>());
  const roTag = createRef<Txt>();
  const writeTag = createRef<Txt>();
  const othersTag = createRef<Txt>();
  const whQuery = new Meter([540, -60], 120, {title: '仓库里的大查询', tone: T.green});

  const dotPos = (i: number): [number, number] => {
    const col = i % 10;
    const row = Math.floor(i / 10);
    return [-520 + col * 44, -200 + row * 44];
  };

  view.add(
    <>
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

      {/* i1–i3：六个系统 */}
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

      {/* i4：高可用、低延迟 */}
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

      {/* i5：管理员看守 */}
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

      {/* i6–i7：分析查询拖垮交易 */}
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
      {queueCount.node}
      {whQuery.nodes()}

      {/* i8–i11：独立仓库 */}
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
        {/* r8：箭头中点右侧的小标，点明这支箭头是“查询”不是写（与 i11 只读对齐）；箭头在 y=35 处 x≈90，小标 [130,35] 离线 18px、离仓库底边 19px */}
        <Txt ref={qLab} position={[130, 35]} fontSize={SIZE.label} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'查询'} opacity={0} />
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
        <Txt ref={writeTag} position={[280, 140]} fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.sans} text={'写进去的是加载过程'} opacity={0} />
        <Txt ref={othersTag} position={[280, 105]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'三路是例子，其余系统同样汇入'} opacity={0} />
      </Node>
    </>
  );

  // i0：单元站牌（r7，skill v1.11.0 开篇规则）：站牌在 i1 开头收成左上角页眉
  const unit = new UnitTitle(CHAPTER, 'u9');
  view.add(unit.nodes());

  yield* beat('i0', unit.enter());

  say('几十个库，怎么凑一起算？');
  yield* beat('i1',
    unit.toHeader(),
    all(g1().opacity(1, 0.5)),
    at('几十个业务库', chain(sysCards[0]().opacity(1, 0.4), sysCards[1]().opacity(1, 0.4), sysCards[2]().opacity(1, 0.4), sysCards[3]().opacity(1, 0.4), sysCards[4]().opacity(1, 0.4), sysCards[5]().opacity(1, 0.4))),
    at('凑到一起算', chain(g1q().opacity(1, 0.4), g1q().scale(1.15, 0.8))),
  );

  say('比如这六个，各自为政');
  yield* beat('i2',
    at('网站', sysLabs[0]().opacity(1, 0.4)),
    at('实体店收银', sysLabs[1]().opacity(1, 0.4)),
    at('库存', sysLabs[2]().opacity(1, 0.4)),
    at('路线规划', sysLabs[3]().opacity(1, 0.4)),
    at('供应商', sysLabs[4]().opacity(1, 0.4)),
    at('员工管理', sysLabs[5]().opacity(1, 0.4)),
  );

  say('各自独立运行');
  yield* beat('i3',
    all(sysLinks[0]().opacity(0.5, 0.4), sysLinks[1]().opacity(0.5, 0.4), sysLinks[2]().opacity(0.5, 0.4)),
    at('一个团队', chain(sysTeams[0]().opacity(1, 0.3), sysTeams[1]().opacity(1, 0.3), sysTeams[2]().opacity(1, 0.3), sysTeams[3]().opacity(1, 0.3), sysTeams[4]().opacity(1, 0.3), sysTeams[5]().opacity(1, 0.3))),
    at('各自独立运行', all(sysLinks[0]().opacity(0.12, 0.6), sysLinks[1]().opacity(0.12, 0.6), sysLinks[2]().opacity(0.12, 0.6))),
  );

  say('高可用、低延迟');
  yield* beat('i4',
    all(g1().opacity(0, 0.5), g4().opacity(1, 0.5)),
    at('高可用', highAv().opacity(1, 0.4)),
    at('低延迟', all(lowLat().opacity(1, 0.4), txArrow().opacity(1, 0.4))),
    at('至关重要', dbBox().stroke(T.green, 0.5)),
  );

  say('管理员严密看守');
  yield* beat('i5',
    all(g4().opacity(0, 0.5), g5().opacity(1, 0.5)),
    at('严密看守', guardPlate().opacity(1, 0.4)),
    at('分析师', analystCard().opacity(1, 0.5)),
    at('即席分析查询', blockedTag().opacity(1, 0.4)),
    at('想查什么就查什么', blockedTag().scale(1.08, 0.5)),
  );

  say('分析查询很贵');
  yield* beat('i6',
    all(g5().opacity(0, 0.5), g6().opacity(1, 0.5), ...dots.map(d => d().opacity(1, 0.4))),
  );

  say('扫数据集的大部分');
  yield* beat('i6a',
    // r7：线扫过的点变黄（前 8 列 = 大部分），线停在第 8/9 列之间（x=-190），未扫过的 2 列保持灰色；
    // 线 2.2s 走完 330px，每列约 0.29s，点变色与线的位置同步。
    at('扫数据集的大部分', all(
      scanLine().opacity(1, 0.4),
      scanTag().opacity(1, 0.4),
      scanLine().position([330, 0], 2.2),
      sequence(0.29, ...Array.from({length: 8}, (_, c) =>
        all(...dots.filter((_, i) => i % 10 === c).map(d => d().fill(T.yellow, 0.3))),
      )),
    )),
  );

  say('并发事务排队变慢');
  yield* beat('i7',
    at('并发执行的事务', chain(
      all(queueCards[0]().opacity(1, 0.25), queueCount.node.opacity(1, 0.3), queueCount.bump()),
      all(queueCards[1]().opacity(1, 0.25), queueCount.bump()),
      all(queueCards[2]().opacity(1, 0.25), queueCount.bump()),
      all(queueCards[3]().opacity(1, 0.25), queueCount.bump()),
    )),
    at('越等越慢', queueTag().opacity(1, 0.3)),
  );

  say('独立仓库');
  yield* beat('i8',
    all(g6().opacity(0, 0.5), queueCount.node.opacity(0, 0.3), g7().opacity(1, 0.5)),
    at('另建一个库', all(whBody().opacity(1, 0.5), whLid().opacity(1, 0.5))),
    at('数据仓库', all(whLab().opacity(1, 0.4), whTag().opacity(1, 0.4))),
  );

  say('排队归零，也不堵交易');
  yield* beat('i9',
    at('尽情查询', all(analyst7().opacity(1, 0.4), qArrow().opacity(1, 0.5), qLab().opacity(1, 0.4))),
    at('不影响交易', all(txCard7().opacity(1, 0.4), txArrow7().opacity(1, 0.4))),
    at('排队的交易恢复正常', chain(queueCount.node.opacity(1, 0.3), queueCount.reset(1.2), queueCount.node.fill(T.green, 0.4))),
    at('仓库里的大查询', chain(whQuery.show(0.5), whQuery.to(0.7, 2.5))),
  );

  say('全部业务库的副本');
  yield* beat('i10',
    at('其余的系统', othersTag().opacity(1, 0.4)),
    at('全部业务库数据', chain(
      miniDbs[0]().opacity(1, 0.3),
      miniDbs[1]().opacity(1, 0.3),
      miniDbs[2]().opacity(1, 0.3),
      all(
        packets[0]().opacity(1, 0.2), packets[0]().position([-120, -290], 0.9),
        packets[1]().opacity(1, 0.2), packets[1]().position([-120, -220], 0.9),
        packets[2]().opacity(1, 0.2), packets[2]().position([-120, -150], 0.9),
      ),
      all(
        packets[0]().position([280, -60], 0.9),
        packets[1]().position([280, -60], 0.9),
        packets[2]().position([280, -60], 0.9),
      ),
    )),
  );

  say('只读副本');
  yield* beat('i11',
    at('只读的', all(roTag().opacity(1, 0.3), whBody().stroke(T.green, 0.5))),
    at('只能查', qArrow().stroke(T.green, 0.4)),
    at('写进去的', writeTag().opacity(1, 0.4)),
  );
});
