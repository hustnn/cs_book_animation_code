// U5 场景 1（MC）：b1–b11 —— 钩子、两种问法、吞吐量、响应时间 vs 延迟。
// 分镜：skill-ch01/ch01-beats.md U5 一节；原文：DDIA §1.9 前半（书页 p13–14，PDF p35–36）。
// 时长全部来自 timeline/u5.json（beat() 驱动），不手写 waitFor。
// 颜色、字号、安全区一律取自 lib/theme，不手写十六进制色值。
import {Circle, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, chain, createRef, sequence, waitFor} from '@motion-canvas/core';
import {makeBeats} from '../../lib/beats';
import {FONT, SAFE, SIZE, T} from '../../lib/theme';
import timeline from '../../timeline/u5.json';

export default makeScene2D(function* (view) {
  view.fill(T.bg);
  const beat = makeBeats(timeline);

  const header = createRef<Txt>();
  const anchor = createRef<Txt>();
  const g1 = createRef<Node>();
  const g2 = createRef<Node>();
  const panelL = createRef<Node>();
  const panelR = createRef<Node>();
  const perfL = createRef<Rect>();
  const resR = createRef<Rect>();
  const g5 = createRef<Node>();
  const prog5 = createRef<Rect>();
  const recs = [0, 1, 2, 3, 4, 5].map(() => createRef<Rect>());
  const g6 = createRef<Node>();
  const idealBar = createRef<Rect>();
  const actualBar = createRef<Rect>();
  const g7 = createRef<Node>();
  const workers = [0, 1, 2, 3].map(() => createRef<Rect>());
  const slowTag = createRef<Txt>();
  const g8 = createRef<Node>();
  const dot8 = createRef<Circle>();
  const timer8 = createRef<Rect>();
  const g9 = createRef<Node>();
  const timebar = createRef<Node>();
  const seg1 = createRef<Rect>();
  const seg2 = createRef<Rect>();
  const seg3 = createRef<Rect>();
  const latentTag = createRef<Txt>();
  const waitDot = createRef<Circle>();

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
        text={'第 1 章 · 性能是一个分布'}
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

      {/* b1：两个终端，读数一大一小 */}
      <Node ref={g1} opacity={0}>
        <Rect position={[-280, -60]} width={420} height={220} radius={20} fill={T.card} stroke={T.line} lineWidth={2}>
          <Txt position={[0, -60]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'你'} />
          <Txt position={[0, 20]} fontSize={52} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'80 ms'} />
        </Rect>
        <Rect position={[280, -60]} width={420} height={220} radius={20} fill={T.card} stroke={T.line} lineWidth={2}>
          <Txt position={[0, -60]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'同事'} />
          <Txt position={[0, 20]} fontSize={52} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'1.2 s'} />
        </Rect>
        <Txt position={[0, -60]} fontSize={64} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'?'} />
      </Node>

      {/* b2：两种问法 */}
      <Node ref={g2} opacity={0}>
        <Txt position={[0, -120]} fontSize={SIZE.title} fontWeight={700} fill={T.white} fontFamily={FONT.serif} text={'两种问法'} />
        <Rect position={[-260, 40]} width={440} height={130} radius={16} fill={T.card} stroke={T.blue} lineWidth={2}>
          <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'问法 1：性能怎样变？'} />
        </Rect>
        <Rect position={[260, 40]} width={440} height={130} radius={16} fill={T.card} stroke={T.blue} lineWidth={2}>
          <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'问法 2：资源加多少？'} />
        </Rect>
      </Node>

      {/* b3/b4：左右两块面板。左：资源不变，性能跌；右：性能不变，资源涨 */}
      <Node ref={panelL} opacity={0}>
        <Txt position={[-300, -230]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'资源不变'} />
        <Rect position={[-300, -120]} width={220} height={44} radius={8} fill={T.blue} opacity={0.9} />
        <Txt position={[-300, -60]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'资源'} />
        <Rect ref={perfL} position={[-300, 80]} offset={[0, 1]} width={220} height={180} radius={8} fill={T.green} />
        <Txt position={[-300, 120]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'性能 ↓'} />
      </Node>
      <Node ref={panelR} opacity={0}>
        <Txt position={[300, -230]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'性能不变'} />
        <Rect position={[300, -120]} width={220} height={44} radius={8} fill={T.green} opacity={0.9} />
        <Txt position={[300, -60]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'性能'} />
        <Rect ref={resR} position={[300, 80]} offset={[0, 1]} width={220} height={60} radius={8} fill={T.blue} />
        <Txt position={[300, 120]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'资源 ↑'} />
      </Node>

      {/* b5：批处理管道，记录流过，计数条涨满整拍 */}
      <Node ref={g5} opacity={0}>
        <Rect position={[0, -60]} width={920} height={64} radius={32} fill={T.card} stroke={T.line} lineWidth={2} />
        <Txt position={[0, -140]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'记录流过管道'} />
        {[0, 1, 2, 3, 4, 5].map(i => (
          <Rect
            key={`u5-rec-${i}`}
            ref={recs[i]}
            position={[-420, -60]}
            width={34}
            height={34}
            radius={6}
            fill={T.blue}
            opacity={0}
          />
        ))}
        <Rect position={[0, 60]} width={920} height={26} radius={13} fill={T.card} stroke={T.line} lineWidth={2} />
        <Rect ref={prog5} position={[-460, 60]} offset={[-1, 0]} width={0} height={26} radius={13} fill={T.green} />
        <Txt position={[0, 110]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'每秒处理多少记录'} />
      </Node>

      {/* b6：理想时间 vs 实际时间 */}
      <Node ref={g6} opacity={0}>
        <Txt position={[0, -160]} fontSize={SIZE.body} fill={T.white} fontFamily={FONT.sans} text={'理想时间 = 数据集大小 / 吞吐量'} />
        <Txt position={[-380, -40]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'理想'} />
        <Rect ref={idealBar} position={[-260, -40]} offset={[-1, 0]} width={0} height={44} radius={8} fill={T.blue} />
        <Txt position={[-380, 60]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'实际'} />
        <Rect ref={actualBar} position={[-260, 60]} offset={[-1, 0]} width={0} height={44} radius={8} fill={T.red} />
        <Txt position={[500, 60]} fontSize={SIZE.label} fill={T.white} fontFamily={FONT.sans} text={'更长'} />
      </Node>

      {/* b7：四个 worker，柱子高低不均，最慢的拖尾 */}
      <Node ref={g7} opacity={0}>
        <Txt position={[0, -240]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'数据在 worker 之间分布不均'} />
        {[
          {x: -360, h: 110},
          {x: -120, h: 190},
          {x: 120, h: 80},
          {x: 360, h: 300},
        ].map((b, i) => (
          <Rect
            key={`u5-worker-${i}`}
            ref={workers[i]}
            position={[b.x, 80]}
            offset={[0, 1]}
            width={90}
            height={10}
            radius={8}
            fill={T.blue}
          />
        ))}
        {/* r2 #14：最慢的柱子与“等最慢的”标注只在 b7b 出现 */}
        <Txt ref={slowTag} position={[360, -260]} fontSize={SIZE.label} fill={T.red} fontFamily={FONT.sans} opacity={0} text={'等最慢的'} />
      </Node>

      {/* b8：一次请求往返，计时条走满整拍 */}
      <Node ref={g8} opacity={0}>
        <Circle position={[-420, -60]} width={110} height={110} fill={T.card} stroke={T.blue} lineWidth={3} />
        <Txt position={[-420, -60]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'客户端'} />
        <Rect position={[420, -60]} width={180} height={120} radius={16} fill={T.card} stroke={T.blue} lineWidth={3}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'服务器'} />
        </Rect>
        <Line points={[[-360, -60], [330, -60]]} stroke={T.line} lineWidth={3} />
        <Circle ref={dot8} position={[-360, -60]} width={26} height={26} fill={T.yellow} />
        <Txt position={[0, 40]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'发出请求 → 收到响应'} />
        <Rect position={[0, 110]} width={920} height={26} radius={13} fill={T.card} stroke={T.line} lineWidth={2} />
        <Rect ref={timer8} position={[-460, 110]} offset={[-1, 0]} width={0} height={26} radius={13} fill={T.green} />
        <Txt position={[0, 160]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'响应时间'} />
      </Node>

      {/* b9：响应时间 ≠ 延迟 */}
      <Node ref={g9} opacity={0}>
        <Rect position={[-300, -40]} width={400} height={130} radius={16} fill={T.card} stroke={T.blue} lineWidth={2}>
          <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'响应时间'} />
        </Rect>
        <Txt position={[0, -40]} fontSize={SIZE.title} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'≠'} />
        <Rect position={[300, -40]} width={400} height={130} radius={16} fill={T.card} stroke={T.yellow} lineWidth={2}>
          <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'延迟'} />
        </Rect>
      </Node>

      {/* b10/b11：一条时间条切成三段；b11 只高亮“等待”那段 */}
      <Node ref={timebar} opacity={0}>
        <Rect ref={seg1} position={[-450, -40]} offset={[-1, 0]} width={0} height={70} fill={T.blue} />
        <Rect ref={seg2} position={[0, -40]} offset={[-1, 0]} width={0} height={70} fill={T.yellow} />
        <Rect ref={seg3} position={[180, -40]} offset={[-1, 0]} width={0} height={70} fill={T.red} />
        <Txt position={[-225, 50]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'服务时间'} />
        <Txt position={[90, 50]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'网络延迟'} />
        <Txt position={[315, 50]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'排队延迟'} />
        <Txt ref={latentTag} position={[315, -120]} fontSize={SIZE.label} fill={T.red} fontFamily={FONT.sans} opacity={0} text={'latent · awaiting service'} />
        <Circle ref={waitDot} position={[200, -40]} width={22} height={22} fill={T.white} opacity={0} />
      </Node>
    </>,
  );

  // b1：钩子——两个读数一大一小
  say('80 ms ? 1.2 s');
  yield* beat('b1', all(g1().opacity(1, 0.6)));

  // b2：先把负载描述清楚，才能问性能——有两种问法
  say('两种问法');
  yield* beat('b2', all(g1().opacity(0, 0.5), g2().opacity(1, 0.6)));

  // b3：第一种：负载上升，资源不变，性能会怎样变？——性能条跌满整拍
  say('资源不变，性能怎样变');
  yield* beat(
    'b3',
    all(g2().opacity(0, 0.5), panelL().opacity(1, 0.6), perfL().height(60, 3.5), perfL().fill(T.red, 3.5)),
  );

  // b4：第二种：负载上升，要保持性能不变，资源要加多少？——资源条涨满整拍
  say('性能不变，资源加多少');
  yield* beat('b4', all(panelR().opacity(1, 0.6), resR().height(180, 4)));

  // b5a/b5b：批处理关心吞吐量——r2 #1：b5 配音重录失败后拆成两拍；
  // r2 #7：记录错开出发、匀速流过管道，到末端淡出，不在右端堆积；计数条两拍涨满。
  // r3 #2-14：末端淡出各延后 0.3s（b5a）/ 0.2s（b5b），末尾两枚不再同时挤在管口；
  // b5a 末枚淡出恰在拍末结束，b5b 首枚随即进管，交界不再空管 0.3–0.5s。
  // 注意：MC 的 sequence(delay, ...) 是“每隔 delay 起一个任务、任务重叠跑”，不是串行；
  // 要“等一等再做、做完再做下一步”用 chain + waitFor。
  say('批处理看吞吐量');
  yield* beat(
    'b5a',
    all(
      panelL().opacity(0, 0.5),
      panelR().opacity(0, 0.5),
      g5().opacity(1, 0.6),
      prog5().width(460, 3.0),
      ...[0, 1, 2].map(i =>
        chain(
          waitFor(i * 0.45),
          all(recs[i]().opacity(1, 0.3), recs[i]().position([420, -60], 2.2)),
          waitFor(0.3),
          recs[i]().opacity(0, 0.3),
        ),
      ),
    ),
  );
  say('数据集跑完要多久');
  yield* beat(
    'b5b',
    all(
      prog5().width(920, 3.0),
      ...[3, 4, 5].map((ri, i) =>
        chain(
          waitFor(i * 0.45),
          all(recs[ri]().opacity(1, 0.3), recs[ri]().position([420, -60], 2.2)),
          waitFor(0.2),
          recs[ri]().opacity(0, 0.3),
        ),
      ),
    ),
  );

  // b6：理想时间 = 大小 / 吞吐量，但实际常常更长
  say('理想时间 = 大小 / 吞吐量');
  yield* beat(
    'b6',
    sequence(
      0,
      all(g5().opacity(0, 0.5), g6().opacity(1, 0.6)),
      idealBar().width(400, 1.5),
      all(actualBar().width(700, 2.5)),
    ),
  );

  // b7a/b7b：r2 #14：b7 语速 8.2 字/s 且一拍两个信息点，拆成两拍——
  // b7a 只讲分布不均（四根柱子长出），b7b 再讲等最慢的任务（最慢柱变红 + 标注）
  say('skew · 分布不均');
  yield* beat(
    'b7a',
    all(
      g6().opacity(0, 0.5),
      g7().opacity(1, 0.5),
      workers[0]().height(110, 1.2),
      workers[1]().height(190, 1.2),
      workers[2]().height(80, 1.2),
      workers[3]().height(300, 1.2),
    ),
  );
  say('等最慢任务');
  yield* beat('b7b', all(workers[3]().fill(T.red, 0.6), slowTag().opacity(1, 0.6)));

  // b8：在线服务看响应时间——请求往返一次，计时条走满整拍
  say('在线服务看响应时间');
  yield* beat(
    'b8',
    all(
      g7().opacity(0, 0.5),
      g8().opacity(1, 0.6),
      sequence(0, dot8().position([330, -60], 2), dot8().position([-360, -60], 2)),
      timer8().width(920, 6),
    ),
  );

  // b9：响应时间 ≠ 延迟
  say('响应时间 ≠ 延迟');
  yield* beat('b9', all(g8().opacity(0, 0.5), g9().opacity(1, 0.6)));

  // b10：响应时间 = 服务 + 网络 + 排队——三段依次长出
  say('服务 + 网络 + 排队');
  yield* beat(
    'b10',
    sequence(
      0,
      all(g9().opacity(0, 0.5), timebar().opacity(1, 0.5)),
      seg1().width(450, 1.2),
      seg2().width(180, 1.2),
      seg3().width(270, 1.2),
    ),
  );

  // b11：延迟只是其中一段——“等待”那段单独高亮，等着被服务
  say('延迟 = 等待被处理');
  yield* beat(
    'b11',
    all(
      seg1().opacity(0.25, 0.8),
      seg2().opacity(0.25, 0.8),
      latentTag().opacity(1, 0.8),
      waitDot().opacity(1, 0.5),
      waitDot().position([430, -40], 5),
    ),
  );
});
