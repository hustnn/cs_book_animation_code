// U1 场景 2（MC）：b13a–b24 —— 索引是路标、派生与写开销、读快写慢天平、
// 手工选索引、边界三问题、log 两层意思、回扣。
// 分镜：skill-ch03/beats-u1.md；原文：DDIA §3.1（书页 p71，PDF p93）。
// 时长全部来自 timeline/u1.json（beat() 驱动），不手写 waitFor。
import {Circle, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, chain, createRef} from '@motion-canvas/core';
import {at, makeBeats} from '../../lib/beats';
import {FONT, SAFE, SIZE, T} from '../../lib/theme';
import timeline from '../../timeline/u1.json';

export default makeScene2D(function* (view) {
  view.fill(T.bg);
  const beat = makeBeats(timeline);

  const header = createRef<Txt>();
  const anchor = createRef<Txt>();
  const say = (text: string) => anchor().text(text);

  // ---- 索引 + 文件 ----
  const idx = createRef<Node>();
  const fileBox = createRef<Rect>();
  const frow1 = createRef<Txt>();
  const frow2 = createRef<Txt>();
  const frow3 = createRef<Txt>();
  const frow4 = createRef<Txt>();
  const card1 = createRef<Rect>();
  const card1Title = createRef<Txt>();
  const card1Line1 = createRef<Txt>();
  const card1Line2 = createRef<Txt>();
  const card2 = createRef<Rect>();
  const arrow1 = createRef<Line>();
  const arrow2 = createRef<Line>();
  const signTag = createRef<Txt>();
  const sameTag = createRef<Txt>();

  // ---- 两条写路径 ----
  const paths = createRef<Node>();
  const pathA = createRef<Rect>();
  const pathB = createRef<Rect>();
  const barA = createRef<Rect>();
  const barB = createRef<Rect>();
  const barALab = createRef<Txt>();
  const barBLab = createRef<Txt>();

  // ---- 天平 ----
  const scale = createRef<Node>();
  const beam = createRef<Line>();
  const fulcrum = createRef<Txt>();
  const panRead = createRef<Rect>();
  const panWrite = createRef<Rect>();

  // ---- 手工选 ----
  const pick = createRef<Node>();
  const pickCard = createRef<Rect>();
  const patCards = [0, 1, 2].map(() => createRef<Rect>());
  const patTag = createRef<Txt>();

  // ---- 边界三问题 ----
  const issues = createRef<Node>();
  const issueCards = [0, 1, 2].map(() => createRef<Rect>());
  const logBar = createRef<Rect>();

  // ---- log 两层意思 ----
  const logs = createRef<Node>();
  const appLog = createRef<Rect>();
  const appLogTitle = createRef<Txt>();
  const appLogLines = createRef<Node>();
  const binLog = createRef<Rect>();
  const binLogTitle = createRef<Txt>();
  const binLogLines = createRef<Node>();
  const notEq = createRef<Txt>();
  const notEqTag = createRef<Txt>();

  // ---- 收尾：文件 + 路标 ----
  const fin = createRef<Node>();
  const finFile = createRef<Rect>();
  const finRow1 = createRef<Txt>();
  const finRow2 = createRef<Txt>();
  const finCard = createRef<Rect>();
  const finArrow = createRef<Line>();
  const finDot = createRef<Circle>();

  view.add(
    <>
      <Txt
        ref={header}
        position={[-SAFE.halfW, -SAFE.halfH]}
        offset={[-1, -1]}
        fontSize={SIZE.label}
        fill={T.muted}
        fontFamily={FONT.sans}
        text={'最简单的数据库：一行一行追加'}
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

      {/* 索引 + 文件 */}
      <Node ref={idx} opacity={0}>
        <Rect ref={fileBox} position={[-280, -40]} width={560} height={280} radius={16} fill={T.card} stroke={T.line} lineWidth={2}>
          <Txt position={[0, -118]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'数据文件'} />
        </Rect>
        <Txt ref={frow1} position={[-280, -120]} fontSize={22} fill={T.text} fontFamily={FONT.mono} text={'123456 → 伦敦'} opacity={0} />
        <Txt ref={frow2} position={[-280, -60]} fontSize={22} fill={T.muted} fontFamily={FONT.mono} text={'42 → 金门大桥（旧）'} opacity={0} />
        <Txt ref={frow3} position={[-280, 0]} fontSize={22} fill={T.text} fontFamily={FONT.mono} text={'42 → 探索馆'} opacity={0} />
        <Txt ref={frow4} position={[-280, 60]} fontSize={22} fill={T.text} fontFamily={FONT.mono} text={'7 → 新记录'} opacity={0} />
        <Rect ref={card1} position={[380, 0]} width={300} height={130} radius={16} fill={T.card} stroke={T.blue} lineWidth={3}>
          <Txt ref={card1Title} position={[0, -38]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'索引：按键查'} />
          <Txt ref={card1Line1} position={[0, 0]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'42 → 第 3 行'} />
          <Txt ref={card1Line2} position={[0, 36]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.mono} text={'7 → 第 4 行'} opacity={0} />
        </Rect>
        <Rect ref={card2} position={[380, -130]} width={300} height={130} radius={16} fill={T.card} stroke={T.purple} lineWidth={3} opacity={0}>
          <Txt position={[0, -38]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'索引：按名字查'} />
          <Txt position={[0, 0]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'伦敦 → 第 1 行'} />
        </Rect>
        <Line ref={arrow1} points={[[225, 0], [10, 0]]} stroke={T.yellow} lineWidth={3} endArrow opacity={0} />
        <Line ref={arrow2} points={[[225, -130], [10, -120]]} stroke={T.yellow} lineWidth={3} endArrow opacity={0} />
        <Txt ref={signTag} position={[380, -210]} fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.sans} text={'路标'} opacity={0} />
        <Txt ref={sameTag} position={[0, 170]} fontSize={SIZE.body} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'内容不变'} opacity={0} />
      </Node>

      {/* 两条写路径 */}
      <Node ref={paths} opacity={0}>
        <Rect ref={pathA} position={[0, -150]} width={700} height={100} radius={16} fill={T.card} stroke={T.green} lineWidth={3}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'只追加：一路直行'} />
        </Rect>
        <Rect ref={pathB} position={[0, 10]} width={700} height={100} radius={16} fill={T.card} stroke={T.red} lineWidth={3}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'写 + 更新索引：多拐一道弯'} />
        </Rect>
        <Rect ref={barA} position={[-300, -70]} offset={[-1, 0]} width={10} height={26} fill={T.green} opacity={0} />
        <Rect ref={barB} position={[-300, 90]} offset={[-1, 0]} width={10} height={26} fill={T.red} opacity={0} />
        <Txt ref={barALab} position={[340, -70]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} text={'最快'} opacity={0} />
        <Txt ref={barBLab} position={[190, 90]} fontSize={SIZE.label} fill={T.red} fontFamily={FONT.sans} text={'更慢'} opacity={0} />
      </Node>

      {/* 天平 */}
      <Node ref={scale} opacity={0}>
        <Rect ref={panRead} position={[-350, -150]} width={220} height={90} radius={16} fill={T.card} stroke={T.green} lineWidth={3}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'读快'} />
        </Rect>
        <Rect ref={panWrite} position={[350, 40]} width={220} height={90} radius={16} fill={T.card} stroke={T.red} lineWidth={3}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'写慢'} />
        </Rect>
        <Line ref={beam} points={[[-350, -105], [350, 85]]} stroke={T.line} lineWidth={4} />
        <Txt ref={fulcrum} position={[0, 60]} fontSize={44} fill={T.muted} fontFamily={FONT.sans} text={'▲'} />
      </Node>

      {/* 手工选 */}
      <Node ref={pick} opacity={0}>
        <Rect ref={pickCard} position={[0, -180]} width={640} height={110} radius={16} fill={T.card} stroke={T.blue} lineWidth={3}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'手工选：按查询模式挑'} />
        </Rect>
        {[0, 1, 2].map(i => (
          <Rect
            key={`pat-${i}`}
            ref={patCards[i]}
            position={[-400 + i * 400, -20]}
            width={340}
            height={150}
            radius={16}
            fill={T.card}
            stroke={T.line}
            lineWidth={2}
            opacity={0}
          >
            <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={['按用户查', '按时间查', '按地点查'][i]} />
          </Rect>
        ))}
        <Txt ref={patTag} position={[-400, -130]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} text={'收益最大'} opacity={0} />
      </Node>

      {/* 边界三问题 */}
      <Node ref={issues} opacity={0}>
        {[0, 1, 2].map(i => (
          <Rect
            key={`iss-${i}`}
            ref={issueCards[i]}
            position={[-400 + i * 400, -100]}
            width={340}
            height={130}
            radius={16}
            fill={T.card}
            stroke={T.yellow}
            lineWidth={2}
            opacity={0}
          >
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={['并发控制', '回收磁盘空间', '写一半的记录'][i]} />
          </Rect>
        ))}
        <Rect ref={logBar} position={[0, 60]} width={800} height={70} radius={12} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'追加写的日志'} />
        </Rect>
      </Node>

      {/* log 两层意思 */}
      <Node ref={logs} opacity={0}>
        <Rect ref={appLog} position={[-300, -40]} width={480} height={240} radius={16} fill={T.card} stroke={T.blue} lineWidth={2}>
          <Txt ref={appLogTitle} position={[0, -88]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'应用日志'} opacity={0} />
          <Node ref={appLogLines} opacity={0}>
            <Txt position={[0, -30]} fontSize={20} fill={T.text} fontFamily={FONT.mono} text={'正在启动……'} />
            <Txt position={[0, 15]} fontSize={20} fill={T.text} fontFamily={FONT.mono} text={'收到请求……'} />
            <Txt position={[0, 60]} fontSize={20} fill={T.text} fontFamily={FONT.mono} text={'写入完成……'} />
          </Node>
        </Rect>
        <Rect ref={binLog} position={[300, -40]} width={480} height={240} radius={16} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt ref={binLogTitle} position={[0, -88]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'追加写序列'} opacity={0} />
          <Node ref={binLogLines} opacity={0}>
            <Txt position={[0, -30]} fontSize={20} fill={T.text} fontFamily={FONT.mono} text={'01001000 01100101'} />
            <Txt position={[0, 15]} fontSize={20} fill={T.text} fontFamily={FONT.mono} text={'01101100 01101100'} />
            <Txt position={[0, 60]} fontSize={20} fill={T.text} fontFamily={FONT.mono} text={'01101111 00100000'} />
          </Node>
        </Rect>
        <Txt ref={notEq} position={[0, -40]} fontSize={56} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'≠'} opacity={0} />
        <Txt ref={notEqTag} position={[0, 150]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'两个意思不一样'} opacity={0} />
      </Node>

      {/* 收尾：文件 + 路标 */}
      <Node ref={fin} opacity={0}>
        <Rect ref={finFile} position={[-280, -40]} width={560} height={200} radius={16} fill={T.card} stroke={T.line} lineWidth={2}>
          <Txt position={[0, -78]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'数据文件'} />
        </Rect>
        <Txt ref={finRow1} position={[-280, -40]} fontSize={22} fill={T.text} fontFamily={FONT.mono} text={'123456 → 伦敦'} opacity={0} />
        <Txt ref={finRow2} position={[-280, 20]} fontSize={22} fill={T.text} fontFamily={FONT.mono} text={'42 → 探索馆'} opacity={0} />
        <Rect ref={finCard} position={[380, -40]} width={300} height={130} radius={16} fill={T.card} stroke={T.yellow} lineWidth={3}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'索引：路标'} />
        </Rect>
        <Line ref={finArrow} points={[[225, -40], [10, -20]]} stroke={T.yellow} lineWidth={3} endArrow opacity={0} />
        <Circle ref={finDot} position={[-500, -40]} width={22} height={22} fill={T.yellow} opacity={0} />
      </Node>
    </>
  );

  say('要找得快，加索引');
  yield* beat('b13a',
    all(idx().opacity(1, 0.5), frow1().opacity(1, 0.4), frow2().opacity(1, 0.4), frow3().opacity(1, 0.4)),
    at('索引', card1Title().fill(T.yellow, 0.4)),
  );

  say('索引是路标');
  yield* beat('b13b',
    all(arrow1().opacity(1, 0.5), signTag().opacity(1, 0.4), idx().scale(1.02, beat.dur('b13b'))),
    at('定位', all(arrow1().stroke(T.green, 0.4))),
    at('数据还在原来的文件里', fileBox().stroke(T.green, 0.4)),
  );

  say('几种查法，几个索引');
  yield* beat('b14',
    all(card2().opacity(1, 0.5)),
    at('几种不同方式', arrow2().opacity(1, 0.5)),
  );

  say('增删索引，内容不变');
  yield* beat('b15',
    all(chain(card1().opacity(0.25, 0.6), card1().opacity(1, 0.6)), chain(card2().opacity(0.25, 0.6), card2().opacity(1, 0.6))),
    at('派生', arrow1().opacity(0.4, 0.4)),
    at('不影响数据库的内容', all(sameTag().opacity(1, 0.4), arrow1().opacity(1, 0.4))),
  );

  say('写数据，索引也得改');
  yield* beat('b16',
    all(frow4().opacity(1, 0.4)),
    at('每次写数据', frow4().fill(T.green, 0.4)),
    at('跟着更新', all(card1Line2().opacity(1, 0.4), card1().stroke(T.yellow, 0.4))),
  );

  say('追加最简单，也最快');
  yield* beat('b17',
    all(idx().opacity(0, 0.5), paths().opacity(1, 0.5)),
    at('最简单的写操作', all(barA().opacity(1, 0.3), barA().width(600, 1.2), barALab().opacity(1, 0.4))),
    at('拖慢写', all(barB().opacity(1, 0.3), barB().width(300, 1.2), barBLab().opacity(1, 0.4))),
  );

  say('读快，写慢');
  yield* beat('b18',
    all(paths().opacity(0, 0.5), scale().opacity(1, 0.5)),
    at('加速读查询', panRead().stroke(T.green, 0.4)),
    at('拖慢写', panWrite().stroke(T.red, 0.4)),
  );

  say('默认不全索引');
  yield* beat('b19a',
    all(scale().opacity(0, 0.5), pick().opacity(1, 0.5)),
    at('手工选', pickCard().stroke(T.yellow, 0.4)),
  );

  say('按查询模式挑');
  yield* beat('b19b',
    all(patCards[0]().opacity(1, 0.4), patCards[1]().opacity(1, 0.4), patCards[2]().opacity(1, 0.4)),
    at('收益最大', all(patCards[0]().stroke(T.green, 0.4), patTag().opacity(1, 0.4))),
    at('不必要开销', all(patCards[1]().opacity(0.4, 0.4), patCards[2]().opacity(0.4, 0.4))),
  );

  say('还有更多问题');
  yield* beat('b20',
    all(pick().opacity(0, 0.5), issues().opacity(1, 0.5), logBar().opacity(1, 0.4)),
    at('并发控制', issueCards[0]().opacity(1, 0.4)),
    at('回收磁盘空间', issueCards[1]().opacity(1, 0.4)),
    at('写了一半的记录', issueCards[2]().opacity(1, 0.4)),
    at('追加写的日志', logBar().stroke(T.yellow, 0.4)),
  );

  say('应用日志：描述在发生什么');
  yield* beat('b21',
    all(issues().opacity(0, 0.5), logs().opacity(1, 0.5), appLogTitle().opacity(1, 0.4)),
    at('应用日志', appLog().stroke(T.yellow, 0.4)),
    at('描述正在发生什么', appLogLines().opacity(1, 0.5)),
  );

  say('追加写序列，可二进制');
  yield* beat('b22',
    all(binLog().opacity(1, 0.5), binLogTitle().opacity(1, 0.4)),
    at('追加写的记录序列', binLogLines().opacity(1, 0.5)),
    at('二进制', all(notEq().opacity(1, 0.4), notEqTag().opacity(1, 0.4))),
  );

  say('选索引，就是选权衡');
  yield* beat('b23',
    all(logs().opacity(0, 0.5), scale().opacity(1, 0.5)),
    at('读快', panRead().stroke(T.green, 0.4)),
    at('写慢', panWrite().stroke(T.red, 0.4)),
  );

  say('追加最快，找要路标');
  yield* beat('b24',
    all(scale().opacity(0, 0.5), fin().opacity(1, 0.5), finRow1().opacity(1, 0.4), finRow2().opacity(1, 0.4)),
    at('从头扫', chain(finDot().opacity(1, 0.4), finDot().position([-500, 20], 1.0))),
    at('路标', all(finArrow().opacity(1, 0.4), finCard().stroke(T.yellow, 0.4))),
  );
});
