// U0 场景 1（MC）：b1–b11（含 r2 新增 b4a/b4b）—— 开场总述：钩子、德语谚语引言卡（全章唯一文字卡）、
// 存/取两件事、应用与数据库分工、选引擎/调优（3.0-4，r2 从 U1 移回）、排法决定找的速度、两条路分叉图、
// 两大学派时间线、事务与分析路线、结尾句。分镜：skill-ch03/beats-u0.md；原文：DDIA §3.0（书页 p69–70，PDF p91–92）。
// 时长全部来自 timeline/u0.json（beat() 驱动），不手写 waitFor。
import {Circle, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, chain, createRef} from '@motion-canvas/core';
import {at, makeBeats} from '../../lib/beats';
import {FONT, SAFE, SIZE, T} from '../../lib/theme';
import timeline from '../../timeline/u0.json';

const UNORDERED = ['7', '2', '9', '4', '1', '8'];
const ORDERED = ['1', '2', '4', '7', '8', '9'];
const blockX = (i: number) => -325 + i * 130;

export default makeScene2D(function* (view) {
  view.fill(T.bg);
  const beat = makeBeats(timeline);

  const header = createRef<Txt>();
  const anchor = createRef<Txt>();
  const say = (text: string) => anchor().text(text);

  // b1：钩子——数据库框 + 落进去的数据 + 问号
  const g1 = createRef<Node>();
  const g1box = createRef<Rect>();
  const g1chip = createRef<Rect>();
  const g1q = createRef<Txt>();

  // b2：德语谚语引言卡（全章唯一文字卡）
  const cardG = createRef<Node>();
  const cardBox = createRef<Rect>();
  const cardKicker = createRef<Txt>();
  const cardDe = createRef<Txt>();
  const cardZh = createRef<Txt>();

  // b3：存下来 / 还给你
  const g3 = createRef<Node>();
  const g3box = createRef<Rect>();
  const g3chip = createRef<Rect>();
  const g3back = createRef<Txt>();

  // b4：应用这边 vs 数据库这边
  const g4 = createRef<Node>();
  const g4left = createRef<Rect>();
  const g4l1 = createRef<Txt>();
  const g4l2 = createRef<Txt>();
  const g4right = createRef<Rect>();
  const g4r1 = createRef<Txt>();
  const g4r2 = createRef<Txt>();
  const g4arrow = createRef<Line>();

  // b4a/b4b：选引擎 / 调优（3.0-4，r2 从 U1 移回）
  const g4x = createRef<Node>();
  const g4xpick = createRef<Rect>();
  const g4xtune = createRef<Rect>();

  // b5：乱序 vs 有序
  const g5 = createRef<Node>();
  const g5dot = createRef<Circle>();
  const g5mag = createRef<Circle>();
  const g5scanLab = createRef<Txt>();
  const g5fastLab = createRef<Txt>();
  const ordBlocks = [0, 1, 2, 3, 4, 5].map(() => createRef<Rect>());

  // b6/b7/b11：两条路分叉图
  const forkG = createRef<Node>();
  const trunk = createRef<Line>();
  const branchL = createRef<Line>();
  const branchR = createRef<Line>();
  const forkLeft = createRef<Rect>();
  const forkRight = createRef<Rect>();
  const forkArrow = createRef<Line>();
  const forkAppend = createRef<Txt>();
  const forkPageLab = createRef<Txt>();
  const forkPages = [0, 1, 2].map(() => createRef<Rect>());

  // b8a/b8b/b9：两大学派时间线
  const tlG = createRef<Node>();
  const tlLine = createRef<Line>();
  const n1970 = createRef<Circle>();
  const lab1970 = createRef<Txt>();
  const plate1970 = createRef<Rect>();
  const n1990 = createRef<Circle>();
  const lab1990 = createRef<Txt>();
  const plate1990 = createRef<Rect>();
  const n2000 = createRef<Circle>();
  const lab2000 = createRef<Txt>();
  const plate2000 = createRef<Rect>();

  // b10：路线图——前半段存和找，后半段分析
  const routeG = createRef<Node>();
  const routeLeft = createRef<Rect>();
  const routeRight = createRef<Rect>();
  const routeTx = createRef<Rect>();
  const routeAn = createRef<Rect>();
  const routeTxLab = createRef<Txt>();
  const routeAnLab = createRef<Txt>();

  // b11：结尾句
  const endTxt = createRef<Txt>();

  view.add(
    <>
      <Txt
        ref={header}
        position={[-SAFE.halfW, -SAFE.halfH]}
        offset={[-1, -1]}
        fontSize={SIZE.label}
        fill={T.muted}
        fontFamily={FONT.sans}
        text={'开场总述'}
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

      {/* b1：钩子 */}
      <Node ref={g1} opacity={0}>
        <Rect ref={g1box} position={[0, -50]} width={440} height={180} radius={16} fill={T.card} stroke={T.blue} lineWidth={3}>
          <Txt position={[0, -60]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'数据库'} />
        </Rect>
        <Rect ref={g1chip} position={[0, -210]} width={220} height={56} radius={12} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'一份数据'} />
        </Rect>
        <Txt ref={g1q} position={[360, -50]} fontSize={72} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'?'} opacity={0} />
      </Node>

      {/* b2：引言卡 */}
      <Node ref={cardG} opacity={0}>
        <Rect ref={cardBox} position={[0, -60]} width={900} height={260} radius={20} fill={T.card} stroke={T.line} lineWidth={2}>
          <Txt ref={cardKicker} position={[0, -95]} fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.sans} text={'德国谚语'} opacity={0} />
          <Txt ref={cardDe} position={[0, -35]} fontSize={28} fill={T.white} fontFamily={FONT.serif} textAlign={'center'} textWrap maxWidth={840} text={'Wer Ordnung hält, ist nur zu faul zum Suchen.'} opacity={0} />
          <Txt ref={cardZh} position={[0, 35]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} textAlign={'center'} textWrap maxWidth={840} text={'东西收拾得井井有条，只是因为你懒得去找。'} opacity={0} />
        </Rect>
      </Node>

      {/* b3：存下来 / 还给你 */}
      <Node ref={g3} opacity={0}>
        <Rect ref={g3box} position={[0, -50]} width={440} height={180} radius={16} fill={T.card} stroke={T.blue} lineWidth={3}>
          <Txt position={[0, -60]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'数据库'} />
        </Rect>
        <Rect ref={g3chip} position={[0, -210]} width={220} height={56} radius={12} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'一份数据'} />
        </Rect>
        <Txt ref={g3back} position={[0, 120]} fontSize={SIZE.body} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'还给你'} opacity={0} />
      </Node>

      {/* b4：两栏分工 */}
      <Node ref={g4} opacity={0}>
        <Rect ref={g4left} position={[-290, -60]} width={440} height={220} radius={16} fill={T.card} stroke={T.blue} lineWidth={3}>
          <Txt position={[0, -70]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'应用这边'} />
          <Txt ref={g4l1} position={[0, -10]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'给数据'} opacity={0} />
          <Txt ref={g4l2} position={[0, 40]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'提问题'} opacity={0} />
        </Rect>
        <Rect ref={g4right} position={[290, -60]} width={440} height={220} radius={16} fill={T.card} stroke={T.green} lineWidth={3}>
          <Txt position={[0, -70]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'数据库这边'} />
          <Txt ref={g4r1} position={[0, -10]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'怎么存'} opacity={0} />
          <Txt ref={g4r2} position={[0, 40]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'怎么找'} opacity={0} />
        </Rect>
        <Line ref={g4arrow} points={[[-60, -60], [60, -60]]} stroke={T.yellow} lineWidth={3} endArrow opacity={0} />
      </Node>

      {/* b4a/b4b：选引擎 / 调优 */}
      <Node ref={g4x} opacity={0}>
        <Rect ref={g4xpick} position={[0, -140]} width={640} height={110} radius={16} fill={T.card} stroke={T.blue} lineWidth={3}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'选一个合适的引擎'} />
        </Rect>
        <Rect ref={g4xtune} position={[0, 10]} width={640} height={110} radius={16} fill={T.card} stroke={T.blue} lineWidth={3} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'调优到自己的负载'} />
        </Rect>
      </Node>

      {/* b5：乱序 vs 有序 */}
      <Node ref={g5} opacity={0}>
        <Txt position={[-500, -120]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'乱序'} />
        <Txt position={[-500, 20]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'有序'} />
        {UNORDERED.map((v, i) => (
          <Rect key={`u0-un-${i}`} position={[blockX(i), -120]} width={100} height={44} radius={8} fill={T.card} stroke={T.line} lineWidth={2}>
            <Txt fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.mono} text={v} />
          </Rect>
        ))}
        {ORDERED.map((v, i) => (
          <Rect key={`u0-or-${i}`} ref={ordBlocks[i]} position={[blockX(i), 20]} width={100} height={44} radius={8} fill={T.card} stroke={T.blue} lineWidth={2}>
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={v} />
          </Rect>
        ))}
        <Circle ref={g5dot} position={[-325, -85]} width={14} height={14} fill={T.muted} opacity={0} />
        <Circle ref={g5mag} position={[-325, 20]} width={76} height={76} stroke={T.yellow} lineWidth={3} opacity={0} />
        <Txt ref={g5scanLab} position={[480, -120]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'扫全行'} opacity={0} />
        <Txt ref={g5fastLab} position={[480, 20]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} text={'一下找到'} opacity={0} />
      </Node>

      {/* b6/b7/b11：分叉图 */}
      <Node ref={forkG} opacity={0}>
        <Line ref={trunk} points={[[0, -280], [0, -160]]} stroke={T.line} lineWidth={3} />
        <Line ref={branchL} points={[[0, -160], [-320, -40]]} stroke={T.blue} lineWidth={3} />
        <Line ref={branchR} points={[[0, -160], [320, -40]]} stroke={T.green} lineWidth={3} />
        <Rect ref={forkLeft} position={[-320, 30]} width={380} height={120} radius={16} fill={T.card} stroke={T.blue} lineWidth={3} opacity={0}>
          <Txt position={[0, -35]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'日志结构'} />
        </Rect>
        <Rect ref={forkRight} position={[320, 30]} width={380} height={120} radius={16} fill={T.card} stroke={T.green} lineWidth={3} opacity={0}>
          <Txt position={[0, -35]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'页式'} />
        </Rect>
        <Line ref={forkArrow} points={[[-460, 30], [-180, 30]]} stroke={T.green} lineWidth={3} endArrow opacity={0} />
        <Txt ref={forkAppend} position={[-320, 65]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} text={'排法：只往后追加'} opacity={0} />
        <Txt ref={forkPageLab} position={[320, 125]} fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.sans} text={'排法：只改这一页'} opacity={0} />
        {[0, 1, 2].map(i => (
          <Rect
            key={`u0-pg-${i}`}
            ref={forkPages[i]}
            position={[220 + i * 100, 55]}
            width={64}
            height={64}
            radius={8}
            fill={T.card}
            stroke={T.green}
            lineWidth={2}
            opacity={0}
          />
        ))}
      </Node>

      {/* b8a/b8b/b9：时间线 */}
      <Node ref={tlG} opacity={0}>
        <Line ref={tlLine} points={[[-500, 0], [500, 0]]} stroke={T.line} lineWidth={3} />
        <Circle ref={n1970} position={[-400, 0]} width={28} height={28} fill={T.blue} opacity={0} />
        <Txt ref={lab1970} position={[-400, 50]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'1970'} opacity={0} />
        <Rect ref={plate1970} position={[-400, -70]} width={200} height={96} radius={12} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt position={[0, -16]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'B 树'} />
          <Txt position={[0, 20]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'页式一家'} />
        </Rect>
        <Circle ref={n1990} position={[0, 0]} width={28} height={28} fill={T.blue} opacity={0} />
        <Txt ref={lab1990} position={[0, 50]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'1990年代'} opacity={0} />
        <Rect ref={plate1990} position={[0, -70]} width={280} height={64} radius={12} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'日志结构思想'} />
        </Rect>
        <Circle ref={n2000} position={[400, 0]} width={28} height={28} fill={T.blue} opacity={0} />
        <Txt ref={lab2000} position={[400, 50]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'2000年后'} opacity={0} />
        <Rect ref={plate2000} position={[400, -70]} width={280} height={64} radius={12} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'越来越流行'} />
        </Rect>
      </Node>

      {/* b10：路线图 */}
      <Node ref={routeG} opacity={0}>
        <Rect ref={routeLeft} position={[-290, -60]} width={440} height={200} radius={16} fill={T.card} stroke={T.blue} lineWidth={3}>
          <Txt position={[0, -55]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'前半段'} />
          <Txt position={[0, 15]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'存和找'} />
        </Rect>
        <Rect ref={routeRight} position={[290, -60]} width={440} height={200} radius={16} fill={T.card} stroke={T.purple} lineWidth={3}>
          <Txt position={[0, -55]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'后半段'} />
          <Txt position={[0, 15]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'分析用的另一套'} />
        </Rect>
        <Rect ref={routeTx} position={[-290, 130]} width={200} height={64} radius={12} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'事务'} />
        </Rect>
        <Rect ref={routeAn} position={[290, 130]} width={200} height={64} radius={12} fill={T.card} stroke={T.purple} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'分析'} />
        </Rect>
        <Txt ref={routeTxLab} position={[-290, 195]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} textAlign={'center'} textWrap maxWidth={400} text={'一次动少量记录，要快'} opacity={0} />
        <Txt ref={routeAnLab} position={[290, 195]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} textAlign={'center'} textWrap maxWidth={400} text={'一次扫大量记录，算数'} opacity={0} />
      </Node>

      <Txt ref={endTxt} position={[0, 180]} fontSize={SIZE.body} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'两种排法，各自的代价'} opacity={0} />
    </>
  );

  say('存进去，怎么找回来？');
  yield* beat('b1',
    all(g1().opacity(1, 0.5)),
    at('存进去', chain(g1chip().opacity(1, 0.4), g1chip().position([0, -20], 1.0))),
    at('找得回来', g1q().opacity(1, 0.4)),
  );

  say('井井有条，懒得去找');
  yield* beat('b2',
    all(g1().opacity(0, 0.5), cardG().opacity(1, 0.5), cardG().scale(1.02, beat.dur('b2'))),
    at('德国谚语', cardKicker().opacity(1, 0.4)),
    at('井井有条', cardDe().opacity(1, 0.5)),
    at('懒得去找', cardZh().opacity(1, 0.5)),
  );

  say('存下来，还给你');
  yield* beat('b3',
    all(cardG().opacity(0, 0.5), g3().opacity(1, 0.5)),
    at('存下来', chain(g3chip().opacity(1, 0.4), g3chip().position([0, -20], 1.0))),
    at('还给你', all(g3chip().position([0, -210], 0.9), g3back().opacity(1, 0.4))),
  );

  say('给数据问问题，存与找');
  yield* beat('b4',
    all(g3().opacity(0, 0.5), g4().opacity(1, 0.5)),
    at('给数据', g4l1().opacity(1, 0.4)),
    at('提问题', g4l2().opacity(1, 0.4)),
    at('怎么存', all(g4arrow().opacity(1, 0.4), g4r1().opacity(1, 0.4))),
    at('怎么找', g4r2().opacity(1, 0.4)),
  );

  say('为什么要关心底层？');
  yield* beat('b4a',
    all(g4().opacity(0, 0.5), g4x().opacity(1, 0.5)),
    at('关心数据库底层', g4xpick().stroke(T.yellow, 0.4)),
  );

  say('选合适的，调到最好');
  yield* beat('b4b',
    all(g4xtune().opacity(1, 0.5), g4x().scale(1.02, beat.dur('b4b'))),
    at('调优', g4xtune().stroke(T.yellow, 0.4)),
    at('自己的负载', g4xpick().stroke(T.blue, 0.4)),
  );

  say('排法决定找的速度');
  yield* beat('b5',
    all(g4x().opacity(0, 0.5), g5().opacity(1, 0.5)),
    chain(g5dot().opacity(1, 0.3), g5scanLab().opacity(1, 0.4), g5dot().position([325, -85], 2.0)),
    at('问的时候', chain(g5mag().opacity(1, 0.3), g5mag().position([65, 20], 1.2))),
    at('找得多快', all(ordBlocks[3]().stroke(T.yellow, 0.3), g5fastLab().opacity(1, 0.4))),
  );

  say('排法不同，就是两家的区别');
  yield* beat('b6',
    all(g5().opacity(0, 0.5), forkG().opacity(1, 0.5), forkG().scale(1.015, beat.dur('b6'))),
    at('日志结构', forkLeft().opacity(1, 0.5)),
    at('页式存储', forkRight().opacity(1, 0.5)),
  );

  say('追加写，原地改');
  yield* beat('b7',
    at('只往后追加', all(forkArrow().opacity(1, 0.5), forkAppend().opacity(1, 0.4))),
    at('一页一页', chain(forkPages[0]().opacity(1, 0.4), forkPages[1]().opacity(1, 0.4), forkPages[2]().opacity(1, 0.4))),
    at('原地改', all(forkPages[1]().stroke(T.yellow, 0.3), forkPageLab().opacity(1, 0.4))),
  );

  say('1970 年，B 树');
  yield* beat('b8a',
    all(forkG().opacity(0, 0.5), tlG().opacity(1, 0.5)),
    at('页式', all(n1970().opacity(1, 0.4), lab1970().opacity(1, 0.4))),
  );

  say('1970 年，B 树');
  yield* beat('b8b',
    at('B 树', plate1970().opacity(1, 0.5)),
  );

  say('1990 年代，2000 年后');
  yield* beat('b9',
    all(tlG().scale(1.015, beat.dur('b9'))),
    at('上世纪九十年代', all(n1990().opacity(1, 0.4), lab1990().opacity(1, 0.4), plate1990().opacity(1, 0.5))),
    at('两千年之后', all(n2000().opacity(1, 0.4), lab2000().opacity(1, 0.4))),
    at('越来越流行', plate2000().opacity(1, 0.5)),
  );

  say('事务和分析，引擎不一样');
  yield* beat('b10',
    all(tlG().opacity(0, 0.5), routeG().opacity(1, 0.5)),
    at('前半段', routeLeft().stroke(T.blue, 0.3)),
    at('后半段', routeRight().stroke(T.purple, 0.3)),
    at('事务和分析', all(routeTx().opacity(1, 0.5), routeAn().opacity(1, 0.5))),
  );

  say('事务动少量要快，分析扫大量算数');
  yield* beat('b10a',
    all(routeG().scale(1.015, beat.dur('b10a'))),
    at('一次只动少量记录', all(routeTx().stroke(T.yellow, 0.3), routeTxLab().opacity(1, 0.4))),
    at('一次扫大量记录', all(routeAn().stroke(T.yellow, 0.3), routeAnLab().opacity(1, 0.4))),
  );

  say('两种排法，各自的代价');
  yield* beat('b11',
    all(routeG().opacity(0, 0.5), forkG().opacity(1, 0.5)),
    at('两种排法', all(branchL().stroke(T.yellow, 0.4), branchR().stroke(T.yellow, 0.4))),
    at('各自的代价', endTxt().opacity(1, 0.5)),
  );
});
