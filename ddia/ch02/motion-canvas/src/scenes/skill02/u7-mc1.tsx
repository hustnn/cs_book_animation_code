// U7 场景 1（MC）：b1–b17 —— 钩子、SQL 三步流水线、MapReduce 登场、
// map 发键值对、两条真实记录、3 + 4 = 7、写进报告集合。
// 分镜：skill-ch02/beats-u7.md U7 一节；原文：DDIA §2.9（书页 p46–48）。
// 时长全部来自 timeline/u7.json（beat() 驱动），不手写 waitFor。
// 颜色、字号、安全区一律取自 lib/theme，不手写十六进制色值。
import {Circle, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, chain, createRef, waitFor} from '@motion-canvas/core';
import {at, makeBeats} from '../../lib/beats';
import {FONT, SAFE, SIZE, T} from '../../lib/theme';
import timeline from '../../timeline/u7.json';

export default makeScene2D(function* (view) {
  view.fill(T.bg);
  const beat = makeBeats(timeline);

  const header = createRef<Txt>();
  const anchor = createRef<Txt>();
  const say = (text: string) => anchor().text(text);

  const g1 = createRef<Node>();
  const g1shark = createRef<Rect>();
  const g1q = createRef<Txt>();
  const g1months = createRef<Node>();
  const g2 = createRef<Node>();
  const g2db = createRef<Rect>();
  const g2cards = [0, 1, 2].map(() => createRef<Rect>());
  const g2report = createRef<Rect>();
  const g3 = createRef<Node>();
  const g3sql = createRef<Rect>();
  const g3steps = [0, 1, 2].map(() => createRef<Rect>());
  const g4 = createRef<Node>();
  const g4rows = [0, 1, 2, 3].map(() => createRef<Rect>());
  const g5 = createRef<Node>();
  const g5line = createRef<Line>();
  const g5dot = createRef<Circle>();
  const g5dec1 = createRef<Txt>();
  const g5tag = createRef<Txt>();
  const g6 = createRef<Node>();
  const g6box = createRef<Rect>();
  const g6r1 = createRef<Rect>();
  const g6r2 = createRef<Rect>();
  const g7 = createRef<Node>();
  const g7sum = createRef<Txt>();
  const g8 = createRef<Node>();
  const g8machines = [0, 1, 2, 3].map(() => createRef<Rect>());
  const g8tag = createRef<Txt>();
  const g8b = createRef<Node>();
  const g8b1 = createRef<Rect>();
  const g8b2 = createRef<Rect>();
  const g8btag = createRef<Txt>();
  const g9 = createRef<Node>();
  const g9decl = createRef<Rect>();
  const g9imp = createRef<Rect>();
  const g9ptr = createRef<Circle>();
  const g9map = createRef<Rect>();
  const g9red = createRef<Rect>();
  const g9gear = createRef<Txt>();
  const g9alias1 = createRef<Txt>();
  const g9alias2 = createRef<Txt>();
  const g10 = createRef<Node>();
  const g10code = createRef<Rect>();
  const g10map = createRef<Txt>();
  const g10red = createRef<Txt>();
  const g10opts = createRef<Txt>();
  const g10out = createRef<Txt>();
  const g11 = createRef<Node>();
  const g11q = createRef<Rect>();
  const g11decl = createRef<Txt>();
  const g11docs = [0, 1, 2].map(() => createRef<Rect>());
  const g11map = createRef<Rect>();
  const g11this = createRef<Txt>();
  const g12 = createRef<Node>();
  const g12map = createRef<Rect>();
  const g12kv = createRef<Rect>();
  const g12key = createRef<Txt>();
  const g12val = createRef<Txt>();
  const g13 = createRef<Node>();
  const g13pile = createRef<Rect>();
  const g13kvs = [0, 1, 2].map(() => createRef<Rect>());
  const g13red = createRef<Rect>();
  const g14 = createRef<Node>();
  const g14c1 = createRef<Rect>();
  const g14c2 = createRef<Rect>();
  const g15 = createRef<Node>();
  const g15kv1 = createRef<Rect>();
  const g15kv2 = createRef<Rect>();
  const g15note = createRef<Txt>();
  const g16 = createRef<Node>();
  const g16red = createRef<Rect>();
  const g16n3 = createRef<Txt>();
  const g16n4 = createRef<Txt>();
  const g16plus = createRef<Txt>();
  const g16seven = createRef<Txt>();
  const g17 = createRef<Node>();
  const g17report = createRef<Rect>();
  const g17seven = createRef<Txt>();
  const g17line = createRef<Txt>();

  view.add(
    <>
      <Txt
        ref={header}
        position={[-SAFE.halfW, -SAFE.halfH]}
        offset={[-1, -1]}
        fontSize={SIZE.label}
        fill={T.muted}
        fontFamily={FONT.sans}
        text={'MapReduce'}
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

      {/* b1：鲨鱼 + 月份刻度 */}
      <Node ref={g1} opacity={0}>
        <Rect ref={g1shark} position={[-320, -60]} width={360} height={140} radius={70} fill={T.card} stroke={T.blue} lineWidth={3}>
          <Txt fontSize={SIZE.title} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'鲨鱼'} />
        </Rect>
        <Node ref={g1months} opacity={0}>
          <Line points={[[-480, 120], [480, 120]]} stroke={T.line} lineWidth={3} />
          {['1 月', '2 月', '3 月', '…', '12 月'].map((m, i) => (
            <Txt key={`g1m-${i}`} position={[-480 + i * 240, 170]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={m} />
          ))}
        </Node>
        <Txt ref={g1q} position={[280, -60]} fontSize={96} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'?'} opacity={0} />
      </Node>

      {/* b2：观察记录落进数据库 */}
      <Node ref={g2} opacity={0}>
        <Rect ref={g2db} position={[0, 60]} width={760} height={220} radius={20} fill={T.card} stroke={T.blue} lineWidth={2}>
          <Txt position={[0, -70]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'数据库 · observations'} />
        </Rect>
        {[0, 1, 2].map(i => (
          <Rect key={`g2c-${i}`} ref={g2cards[i]} position={[-260 + i * 260, -140]} width={220} height={90} radius={12} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={['12 月 25 日 · 鲨鱼', '12 月 12 日 · 鲨鱼', '鲸鱼'][i]} />
          </Rect>
        ))}
        <Rect ref={g2report} position={[330, -160]} width={300} height={110} radius={12} fill={T.card} stroke={T.yellow} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'每月鲨鱼报告'} />
        </Rect>
      </Node>

      {/* b3：SQL 三步流水线 */}
      <Node ref={g3} opacity={0}>
        <Rect ref={g3sql} position={[0, -160]} width={640} height={110} radius={14} fill={T.card} stroke={T.blue} lineWidth={2}>
          <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.mono} text={'SELECT … FROM observations'} />
        </Rect>
        {[0, 1, 2].map(i => (
          <Rect key={`g3s-${i}`} ref={g3steps[i]} position={[-360 + i * 360, 40]} width={300} height={130} radius={14} fill={T.card} stroke={T.line} lineWidth={2} opacity={0}>
            <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={['1 过滤', '2 分组', '3 求和'][i]} />
          </Rect>
        ))}
        <Txt position={[0, 160]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'过滤 → 分组 → 求和'} />
      </Node>

      {/* b4：只留鲨鱼科 */}
      <Node ref={g4} opacity={0}>
        {[0, 1, 2, 3].map(i => (
          <Rect key={`g4r-${i}`} ref={g4rows[i]} position={[0, -180 + i * 110]} width={680} height={80} radius={12} fill={T.card} stroke={T.blue} lineWidth={2}>
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={['鲨鱼 · 12 月 25 日 · 3 条', '鲸鱼', '鲨鱼 · 12 月 12 日 · 4 条', '金枪鱼'][i]} />
          </Rect>
        ))}
      </Node>

      {/* b5a/b5b：时间戳向下取整到月初 */}
      <Node ref={g5} opacity={0}>
        <Line ref={g5line} points={[[-480, 0], [480, 0]]} stroke={T.line} lineWidth={3} />
        <Txt position={[-480, 60]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'12 月 1 日'} />
        <Txt position={[480, 60]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'12 月 31 日'} />
        <Circle ref={g5dot} position={[280, 0]} width={34} height={34} fill={T.yellow} opacity={0} />
        <Txt position={[280, -70]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'12 月 25 日'} />
        <Txt ref={g5dec1} position={[-400, -70]} fontSize={SIZE.label} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'归到 12 月 1 日'} opacity={0} />
        <Txt ref={g5tag} position={[0, 150]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.mono} text={"date_trunc('month', …)"} opacity={0} />
      </Node>

      {/* b6：按月分组 */}
      <Node ref={g6} opacity={0}>
        <Rect ref={g6box} position={[0, 60]} width={560} height={220} radius={16} fill={T.card} stroke={T.yellow} lineWidth={3}>
          <Txt position={[0, -60]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'1995 年 12 月'} />
        </Rect>
        <Rect ref={g6r1} position={[-360, -160]} width={260} height={80} radius={12} fill={T.card} stroke={T.blue} lineWidth={2}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'鲨鱼 · 3 条'} />
        </Rect>
        <Rect ref={g6r2} position={[360, -160]} width={260} height={80} radius={12} fill={T.card} stroke={T.blue} lineWidth={2}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'鲨鱼 · 4 条'} />
        </Rect>
      </Node>

      {/* b7：分组求和 */}
      <Node ref={g7} opacity={0}>
        <Txt position={[-160, -40]} fontSize={64} fontWeight={700} fill={T.blue} fontFamily={FONT.mono} text={'3'} />
        <Txt position={[160, -40]} fontSize={64} fontWeight={700} fill={T.blue} fontFamily={FONT.mono} text={'4'} />
        <Txt ref={g7sum} position={[0, -40]} fontSize={64} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'+'} opacity={0} />
        <Txt position={[0, 120]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.mono} text={'sum(num_animals)'} />
      </Node>

      {/* b8：多台机器批量处理 */}
      <Node ref={g8} opacity={0}>
        {[0, 1, 2, 3].map(i => (
          <Rect key={`g8m-${i}`} ref={g8machines[i]} position={[-420 + i * 280, -40]} width={220} height={180} radius={14} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={['机器 1', '机器 2', '机器 3', '机器 4'][i]} />
          </Rect>
        ))}
        <Txt ref={g8tag} position={[0, 160]} fontSize={SIZE.title} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'MapReduce · Google'} opacity={0} />
      </Node>

      {/* b8b：NoSQL 也支持有限形式 */}
      <Node ref={g8b} opacity={0}>
        <Rect ref={g8b1} position={[-260, -40]} width={420} height={160} radius={14} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.mono} text={'MongoDB'} />
        </Rect>
        <Rect ref={g8b2} position={[260, -40]} width={420} height={160} radius={14} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.mono} text={'CouchDB'} />
        </Rect>
        <Txt ref={g8btag} position={[0, 160]} fontSize={SIZE.title} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'只读查询'} opacity={0} />
      </Node>

      {/* b9a/b9b：介于两者之间 + map/reduce */}
      <Node ref={g9} opacity={0}>
        <Rect ref={g9decl} position={[-330, -80]} width={340} height={180} radius={16} fill={T.card} stroke={T.green} lineWidth={2}>
          <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'声明式'} />
        </Rect>
        <Rect ref={g9imp} position={[330, -80]} width={340} height={180} radius={16} fill={T.card} stroke={T.blue} lineWidth={2}>
          <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'命令式'} />
        </Rect>
        <Circle ref={g9ptr} position={[0, -80]} width={36} height={36} fill={T.yellow} opacity={0} />
        <Rect ref={g9map} position={[-220, 130]} width={300} height={90} radius={12} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.mono} text={'map'} />
        </Rect>
        <Rect ref={g9red} position={[220, 130]} width={300} height={90} radius={12} fill={T.card} stroke={T.purple} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.mono} text={'reduce'} />
        </Rect>
        <Txt ref={g9gear} position={[0, 230]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'处理框架反复调用'} opacity={0} />
        <Txt ref={g9alias1} position={[-220, 200]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.mono} text={'也叫 collect'} opacity={0} />
        <Txt ref={g9alias2} position={[220, 200]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.mono} text={'也叫 fold / inject'} opacity={0} />
      </Node>

      {/* b10a/b10b：mapReduce 调用 */}
      <Node ref={g10} opacity={0}>
        <Rect ref={g10code} position={[0, -40]} width={820} height={360} radius={16} fill={T.card} stroke={T.blue} lineWidth={2}>
          <Txt position={[0, -130]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.mono} text={'db.observations.mapReduce('} />
          <Txt ref={g10map} position={[0, -60]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'map, reduce,'} opacity={0} />
          <Txt ref={g10opts} position={[0, 10]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'{ query: { family: "Sharks" },'} opacity={0} />
          <Txt ref={g10out} position={[0, 80]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'out: "monthlySharkReport" }'} opacity={0} />
          <Txt position={[0, 140]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.mono} text={');'} />
        </Rect>
      </Node>

      {/* b11a/b11b：声明式过滤 + 文档进 map */}
      <Node ref={g11} opacity={0}>
        <Rect ref={g11q} position={[0, -180]} width={640} height={110} radius={14} fill={T.card} stroke={T.green} lineWidth={2}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'query: { family: "Sharks" }'} />
        </Rect>
        <Txt ref={g11decl} position={[0, -80]} fontSize={SIZE.label} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'声明式过滤 · MongoDB 的扩展'} opacity={0} />
        <Rect ref={g11map} position={[0, 110]} width={360} height={110} radius={14} fill={T.card} stroke={T.purple} lineWidth={2}>
          <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.mono} text={'map'} />
        </Rect>
        <Txt ref={g11this} position={[0, 210]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.mono} text={'this = 这条文档'} opacity={0} />
        {[0, 1, 2].map(i => (
          <Rect key={`g11d-${i}`} ref={g11docs[i]} position={[[-420, 420, 0][i], [110, 110, 10][i]]} width={200} height={80} radius={12} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={['文档 1', '文档 2', '文档 3'][i]} />
          </Rect>
        ))}
      </Node>

      {/* b12a/b12b：发出键值对 */}
      <Node ref={g12} opacity={0}>
        <Rect ref={g12map} position={[-320, -40]} width={300} height={150} radius={14} fill={T.card} stroke={T.purple} lineWidth={2}>
          <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.mono} text={'map'} />
        </Rect>
        <Rect ref={g12kv} position={[280, -40]} width={380} height={150} radius={14} fill={T.card} stroke={T.yellow} lineWidth={3} opacity={0}>
          <Txt ref={g12key} position={[0, -30]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.mono} text={'"2013-12"'} opacity={0} />
          <Txt ref={g12val} position={[0, 40]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'值：这次观察的动物数'} opacity={0} />
        </Rect>
      </Node>

      {/* b13：同键分到一组 */}
      <Node ref={g13} opacity={0}>
        <Rect ref={g13pile} position={[0, -60]} width={560} height={220} radius={16} fill={T.card} stroke={T.yellow} lineWidth={3}>
          <Txt position={[0, -60]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'"1995-12"'} />
        </Rect>
        {[0, 1, 2].map(i => (
          <Rect key={`g13k-${i}`} ref={g13kvs[i]} position={[-180 + i * 180, 20]} width={150} height={70} radius={10} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={['3', '4', '…'][i]} />
          </Rect>
        ))}
        <Rect ref={g13red} position={[0, 160]} width={300} height={80} radius={12} fill={T.card} stroke={T.purple} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.mono} text={'reduce'} />
        </Rect>
      </Node>

      {/* b14：两条真实记录 */}
      <Node ref={g14} opacity={0}>
        <Rect ref={g14c1} position={[-300, -40]} width={440} height={260} radius={16} fill={T.card} stroke={T.blue} lineWidth={2}>
          <Txt position={[0, -80]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.mono} text={'1995-12-25'} />
          <Txt position={[0, -10]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'大白鲨'} />
          <Txt position={[0, 60]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'Carcharodon carcharias'} />
          <Txt position={[0, 100]} fontSize={SIZE.title} fontWeight={700} fill={T.yellow} fontFamily={FONT.mono} text={'3 条'} />
        </Rect>
        <Rect ref={g14c2} position={[300, -40]} width={440} height={260} radius={16} fill={T.card} stroke={T.blue} lineWidth={2}>
          <Txt position={[0, -80]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.mono} text={'1995-12-12'} />
          <Txt position={[0, -10]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'公牛鲨'} />
          <Txt position={[0, 60]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'Carcharias taurus'} />
          <Txt position={[0, 100]} fontSize={SIZE.title} fontWeight={700} fill={T.yellow} fontFamily={FONT.mono} text={'4 条'} />
        </Rect>
      </Node>

      {/* b15：发出两个键值对 */}
      <Node ref={g15} opacity={0}>
        <Rect ref={g15kv1} position={[-220, -40]} width={340} height={120} radius={12} fill={T.card} stroke={T.yellow} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.mono} text={'"1995-12" : 3'} />
        </Rect>
        <Rect ref={g15kv2} position={[220, -40]} width={340} height={120} radius={12} fill={T.card} stroke={T.yellow} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.mono} text={'"1995-12" : 4'} />
        </Rect>
        <Txt ref={g15note} position={[0, 120]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'同一把键，两个值'} opacity={0} />
      </Node>

      {/* b16a/b16b：3 + 4 = 7 */}
      <Node ref={g16} opacity={0}>
        <Rect ref={g16red} position={[0, -60]} width={420} height={180} radius={16} fill={T.card} stroke={T.purple} lineWidth={3}>
          <Txt position={[0, -55]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.mono} text={'reduce("1995-12", [3, 4])'} />
          <Txt ref={g16n3} position={[-90, 20]} fontSize={SIZE.title} fontWeight={700} fill={T.blue} fontFamily={FONT.mono} text={'3'} opacity={0} />
          <Txt ref={g16plus} position={[0, 20]} fontSize={SIZE.title} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'+'} opacity={0} />
          <Txt ref={g16n4} position={[90, 20]} fontSize={SIZE.title} fontWeight={700} fill={T.blue} fontFamily={FONT.mono} text={'4'} opacity={0} />
        </Rect>
        <Txt ref={g16seven} position={[0, 140]} fontSize={96} fontWeight={700} fill={T.green} fontFamily={FONT.mono} text={'7'} opacity={0} />
      </Node>

      {/* b17：写进报告集合 */}
      <Node ref={g17} opacity={0}>
        <Rect ref={g17report} position={[0, -30]} width={620} height={240} radius={16} fill={T.card} stroke={T.green} lineWidth={3}>
          <Txt position={[0, -70]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.mono} text={'monthlySharkReport'} />
          <Txt ref={g17line} position={[0, 60]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'1995 年 12 月 → 每月一条结果'} opacity={0} />
        </Rect>
        <Txt ref={g17seven} position={[0, -40]} fontSize={64} fontWeight={700} fill={T.green} fontFamily={FONT.mono} text={'7'} opacity={0} />
      </Node>
    </>
  );

  say('每月看到几条鲨鱼？');
  yield* beat('b1',
    all(g1().opacity(1, 0.5)),
    at('每月', g1months().opacity(1, 0.5)),
    at('鲨鱼', chain(g1shark().opacity(1, 0.4), g1q().opacity(1, 0.4))),
  );

  say('一次观察，一条记录');
  yield* beat('b2',
    all(g1().opacity(0, 0.5), g2().opacity(1, 0.5)),
    at('海洋生物学家', g2cards[0]().opacity(1, 0.4)),
    at('加一条观察记录', chain(
      g2cards[0]().position([-260, 60], 0.5),
      g2cards[1]().opacity(1, 0.4), g2cards[1]().position([0, 60], 0.5),
      g2cards[2]().opacity(1, 0.4), g2cards[2]().position([260, 60], 0.5),
    )),
    at('出份报告', g2report().opacity(1, 0.5)),
  );

  say('SQL：三步流水线');
  yield* beat('b3',
    all(g2().opacity(0, 0.5), g3().opacity(1, 0.5)),
    at('三步走', chain(g3steps[0]().opacity(1, 0.4), g3steps[1]().opacity(1, 0.4), g3steps[2]().opacity(1, 0.4))),
  );

  say('只留鲨鱼科');
  yield* beat('b4',
    all(g3().opacity(0, 0.5), g4().opacity(1, 0.5)),
    at('只留鲨鱼科', all(g4rows[0]().stroke(T.green, 0.4), g4rows[2]().stroke(T.green, 0.4))),
    at('别的动物', chain(g4rows[1]().opacity(0.25, 0.5), g4rows[3]().opacity(0.25, 0.5))),
  );

  say('向下取整到月初');
  yield* beat('b5a',
    all(g4().opacity(0, 0.5), g5().opacity(1, 0.5)),
    at('按月算', g5dot().opacity(1, 0.4)),
    at('向下取整', g5tag().opacity(1, 0.4)),
  );

  say('12 月 25 日归到 12 月');
  yield* beat('b5b',
    all(g5dot().position([-400, 0], 0.8)),
    at('12 月 1 日', g5dec1().opacity(1, 0.4)),
  );

  say('按月分组');
  yield* beat('b6',
    all(g5().opacity(0, 0.5), g6().opacity(1, 0.5)),
    at('按发生月份分组', chain(g6r1().position([-130, 60], 0.6), g6r2().position([130, 60], 0.6))),
  );

  say('分组求和');
  yield* beat('b7',
    all(g6().opacity(0, 0.5), g7().opacity(1, 0.5)),
    at('加起来', g7sum().opacity(1, 0.4)),
  );

  say('跨多台机器批量处理');
  yield* beat('b8',
    all(g7().opacity(0, 0.5), g8().opacity(1, 0.5), chain(g8machines[0]().opacity(1, 0.3), g8machines[1]().opacity(1, 0.3), g8machines[2]().opacity(1, 0.3), g8machines[3]().opacity(1, 0.3))),
    at('跨多台机器', g8machines[0]().stroke(T.yellow, 0.4)),
    at('批量处理', g8machines[1]().stroke(T.yellow, 0.4)),
    at('大量数据', g8machines[2]().stroke(T.yellow, 0.4)),
    at('Google', g8tag().opacity(1, 0.5)),
  );

  say('NoSQL 也支持有限形式');
  yield* beat('b8b',
    all(g8().opacity(0, 0.5), g8b().opacity(1, 0.5)),
    at('MongoDB', g8b1().opacity(1, 0.4)),
    at('CouchDB', g8b2().opacity(1, 0.4)),
    at('有限形式', all(g8b1().stroke(T.yellow, 0.4), g8b2().stroke(T.yellow, 0.4))),
    at('跨多个文档', all(g8b1().stroke(T.green, 0.4), g8b2().stroke(T.green, 0.4))),
    at('只读查询', g8btag().opacity(1, 0.4)),
  );

  say('介于两者之间');
  yield* beat('b9a',
    all(g8b().opacity(0, 0.5), g9().opacity(1, 0.5)),
    at('介于两者之间', g9ptr().opacity(1, 0.4)),
  );

  say('代码片段反复调用');
  yield* beat('b9b',
    all(g9map().opacity(1, 0.5), g9red().opacity(1, 0.5), g9alias1().opacity(1, 0.5), g9alias2().opacity(1, 0.5)),
    at('反复调用', g9gear().opacity(1, 0.4)),
  );

  say('mapReduce 调用');
  yield* beat('b10a',
    all(g9().opacity(0, 0.5), g10().opacity(1, 0.5)),
    at('第一个函数', g10map().opacity(1, 0.4)),
  );

  say('只查鲨鱼，写进报告');
  yield* beat('b10b',
    all(g10opts().opacity(1, 0.5), g10out().opacity(1, 0.5)),
  );

  say('过滤写在查询选项里');
  yield* beat('b11a',
    all(g10().opacity(0, 0.5), g11().opacity(1, 0.5)),
    at('声明式地', g11decl().opacity(1, 0.4)),
  );

  say('每条文档处理一次');
  yield* beat('b11b',
    all(g11docs[0]().opacity(1, 0.4), g11docs[1]().opacity(1, 0.4), g11docs[2]().opacity(1, 0.4), g11this().opacity(1, 0.4)),
    at('逐条', chain(
      g11docs[0]().position([0, 110], 0.4), g11docs[0]().opacity(0, 0.2),
      g11docs[1]().position([0, 110], 0.4), g11docs[1]().opacity(0, 0.2),
      g11docs[2]().position([0, 110], 0.4), g11docs[2]().opacity(0, 0.2),
    )),
  );

  say('发出键值对');
  yield* beat('b12a',
    all(g11().opacity(0, 0.5), g12().opacity(1, 0.5)),
    at('键值对', g12kv().opacity(1, 0.5)),
  );

  say('键是年月，值是数量');
  yield* beat('b12b',
    at('键是年份加月份', g12key().opacity(1, 0.4)),
    at('值是', g12val().opacity(1, 0.4)),
  );

  say('同键分到一组');
  yield* beat('b13',
    all(g12().opacity(0, 0.5), g13().opacity(1, 0.5)),
    at('分到一组', chain(g13kvs[0]().opacity(1, 0.3), g13kvs[1]().opacity(1, 0.3), g13kvs[2]().opacity(1, 0.3))),
    at('reduce', g13red().opacity(1, 0.4)),
  );

  say('两条 12 月的记录');
  yield* beat('b14',
    all(g13().opacity(0, 0.5), g14().opacity(1, 0.5)),
    at('1995 年 12 月 25 日', g14c1().stroke(T.yellow, 0.4)),
    at('1995 年 12 月 12 日', g14c2().stroke(T.yellow, 0.4)),
  );

  say('发出两个键值对');
  yield* beat('b15',
    all(g14().opacity(0, 0.5), g15().opacity(1, 0.5), g15kv1().opacity(1, 0.5)),
    at('1995-12 配 4', all(g15kv2().opacity(1, 0.4), g15note().opacity(1, 0.4))),
  );

  say('3 + 4 = 7');
  yield* beat('b16a',
    all(g15().opacity(0, 0.5), g16().opacity(1, 0.5)),
    at('3 加 4', chain(g16n3().opacity(1, 0.3), g16plus().opacity(1, 0.3), g16n4().opacity(1, 0.3))),
  );

  say('3 + 4 = 7');
  yield* beat('b16b',
    all(g16seven().opacity(1, 0.5)),
  );

  say('写进报告集合');
  yield* beat('b17',
    all(g16().opacity(0, 0.5), g17().opacity(1, 0.5)),
    at('monthlySharkReport', g17seven().opacity(1, 0.5)),
    at('每月一条结果', g17line().opacity(1, 0.4)),
  );
});
