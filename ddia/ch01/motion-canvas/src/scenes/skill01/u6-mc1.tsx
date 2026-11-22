// U6 场景 1（MC）：b1–b5 —— 钩子（50ms vs 3s）、排队、队头阻塞、尾巴主要是排出来的。
// 分镜：skill-ch01/ch01-beats.md U6 一节；原文：DDIA §1.9 后半（书页 p15–16，PDF p37–38）。
// 时长全部来自 timeline/u6.json（beat() 驱动），不手写 waitFor。
// 颜色、字号、安全区一律取自 lib/theme，不手写十六进制色值。
// 队头阻塞队列场景是示意（inventory N6）：2 个处理窗口，窗口数与耗时是演示设定。
import {attach} from '../../lib/layout';
import {Circle, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, sequence} from '@motion-canvas/core';
import {makeBeats} from '../../lib/beats';
import {FONT, SAFE, SIZE, T} from '../../lib/theme';
import timeline from '../../timeline/u6.json';

export default makeScene2D(function* (view) {
  view.fill(T.bg);
  const beat = makeBeats(timeline);

  const header = createRef<Txt>();
  const anchor = createRef<Txt>();
  const g1 = createRef<Node>();
  const g2 = createRef<Node>();
  const winA = createRef<Rect>();
  const winB = createRef<Rect>();
  const queueDots = [0, 1, 2, 3, 4].map(() => createRef<Rect>());
  const g3 = createRef<Node>();
  const slowBlock = createRef<Rect>();
  const waitBar = createRef<Rect>();
  const waitLabels = [0, 1, 2].map(() => createRef<Txt>());
  const g4 = createRef<Node>();
  const fastTags = [0, 1, 2].map(() => createRef<Txt>());
  const g5 = createRef<Node>();
  const barP50 = createRef<Rect>();
  const barP99proc = createRef<Rect>();
  const barP99queue = createRef<Rect>();
  const queueTag = createRef<Txt>();

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
        text={'第 1 章 · 尾巴从哪来，又怎么量'}
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

      {/* b1：服务器日志全绿 50ms，右边手机转圈 3s */}
      <Node ref={g1} opacity={0}>
        <Rect position={[-280, -60]} width={420} height={220} radius={20} fill={T.card} stroke={T.line} lineWidth={2}>
          <Txt position={[0, -60]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'服务器日志'} />
          <Txt position={[0, 20]} fontSize={52} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'50 ms'} />
        </Rect>
        <Rect position={[280, -60]} width={420} height={220} radius={20} fill={T.card} stroke={T.line} lineWidth={2}>
          <Txt position={[0, -60]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'用户手机'} />
          <Txt position={[0, 20]} fontSize={52} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'3 s'} />
        </Rect>
        <Txt position={[0, -60]} fontSize={64} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'?'} />
      </Node>

      {/* b2：2 个处理窗口 + 一条队列 */}
      <Node ref={g2} opacity={0}>
        <Txt position={[0, -240]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'服务器同时能处理的请求有限'} />
        <Rect ref={winA} position={[-300, -100]} width={200} height={110} radius={16} fill={T.card} stroke={T.blue} lineWidth={3}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'窗口 1'} />
        </Rect>
        <Rect ref={winB} position={[0, -100]} width={200} height={110} radius={16} fill={T.card} stroke={T.blue} lineWidth={3}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'窗口 2'} />
        </Rect>
        <Txt position={[300, -100]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'受 CPU 核数限制'} />
        {[0, 1, 2, 3, 4].map(i => (
          <Rect
            key={`u6-q-${i}`}
            ref={queueDots[i]}
            position={[-420 + i * 110, 80]}
            width={80}
            height={80}
            radius={12}
            fill={T.blue}
            opacity={0}
          />
        ))}
        <Txt position={[0, 170]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'多出来的只能排队'} />
      </Node>

      {/* b3：红色大方块卡住窗口，后面挤成一串，等待计时一起涨 */}
      <Node ref={g3} opacity={0}>
        <Rect ref={slowBlock} position={[-300, -100]} width={200} height={110} radius={16} fill={T.red}>
          <Txt fontSize={SIZE.label} fill={T.white} fontFamily={FONT.sans} text={'慢请求'} />
        </Rect>
        <Rect position={[0, -100]} width={200} height={110} radius={16} fill={T.card} stroke={T.blue} lineWidth={3}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'窗口 2'} />
        </Rect>
        <Txt position={[0, -240]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'队头阻塞 head-of-line blocking'} />
        <Rect position={[0, 60]} width={920} height={26} radius={13} fill={T.card} stroke={T.line} lineWidth={2} />
        <Rect ref={waitBar} position={[-460, 60]} offset={[-1, 0]} width={0} height={26} radius={13} fill={T.red} />
        <Txt position={[0, 110]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'等待时间一起涨'} />
        {[0, 1, 2].map(i => (
          <Txt
            key={`u6-wait-${i}`}
            ref={waitLabels[i]}
            position={[-300 + i * 300, 170]}
            fontSize={SIZE.label}
            fill={T.red}
            fontFamily={FONT.sans}
            opacity={0}
            text={`等 ${i + 1} s`}
          />
        ))}
      </Node>

      {/* b4：后面的方块本身很快，但等待计时仍在涨 */}
      <Node ref={g4} opacity={0}>
        {[0, 1, 2].map(i => (
          <Txt
            key={`u6-fast-${i}`}
            ref={fastTags[i]}
            fontSize={SIZE.label}
            fill={T.green}
            fontFamily={FONT.sans}
            opacity={0}
            text={'本身很快 ✓'}
          />
        ))}
      </Node>

      {/* b5：p50 短柱 vs p99 高柱；p99 柱分两段：下面处理（蓝、小），上面排队（红、大） */}
      <Node ref={g5} opacity={0}>
        <Txt position={[0, -240]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'高百分位里，排队占了大头'} />
        <Rect ref={barP50} position={[-280, 80]} offset={[0, 1]} width={130} height={10} radius={8} fill={T.blue} />
        <Txt position={[-280, 120]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'p50 · 处理'} />
        <Rect ref={barP99proc} position={[180, 80]} offset={[0, 1]} width={130} height={10} radius={8} fill={T.blue} />
        <Rect ref={barP99queue} position={[180, -10]} offset={[0, 1]} width={130} height={10} radius={8} fill={T.red} opacity={0} />
        <Txt position={[180, 120]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'p99'} />
        <Txt ref={queueTag} position={[420, -60]} fontSize={SIZE.label} fill={T.red} fontFamily={FONT.sans} opacity={0} text={'排队占大头'} />
        <Line points={[[320, -60], [255, -60]]} stroke={T.red} lineWidth={2} />
      </Node>
    </>,
  );

  // QA r4（类 B）：“本身很快 ✓”原借用窗口的 x 坐标摆在 y=-40，压在“慢请求”“窗口 2”框的下边上，
  // 读起来像在说慢请求本身很快；改挂在它描述的排队请求（“等 N s”）下面
  fastTags.forEach((t, i) => attach(t(), waitLabels[i](), 'bottom', 10));

  // b1：钩子——服务器说 50ms，用户等了 3s，谁在撒谎？
  // r2（P2 1-4）：淡入只有 0.6s，尾部加缓慢缩放填满拍尾（5.9s < 6.422s）。
  say('50 ms vs 3 s');
  yield* beat('b1', all(g1().opacity(1, 0.6), g1().scale(1.04, 5.9)));

  // b2：先看排队——2 个窗口，请求方块逐个排进来
  say('并行有限，只能排队');
  yield* beat(
    'b2',
    all(
      g1().opacity(0, 0.5),
      g2().opacity(1, 0.6),
      sequence(1.2, ...queueDots.map(q => q().opacity(1, 0.4))),
    ),
  );

  // b3：慢请求占着窗口，后面的全被挡住——等待条涨满整拍，等 1s/2s/3s 依次出现
  say('队头阻塞');
  yield* beat(
    'b3',
    all(
      g2().opacity(0, 0.5),
      g3().opacity(1, 0.6),
      slowBlock().opacity(1, 0.6),
      waitBar().width(920, 5.5),
      sequence(1.5, waitLabels[0]().opacity(1, 0.5), waitLabels[1]().opacity(1, 0.5), waitLabels[2]().opacity(1, 0.5)),
    ),
  );

  // b4：后面的本身很快，但等待计时仍在涨——“本身很快”标签逐个出现，等待条继续涨
  say('后面的也跟着慢');
  yield* beat(
    'b4',
    all(
      g4().opacity(1, 0.4),
      sequence(1.6, fastTags[0]().opacity(1, 0.5), fastTags[1]().opacity(1, 0.5), fastTags[2]().opacity(1, 0.5)),
      waitBar().width(920, 5.5),
    ),
  );

  // b5：排队延迟在高百分位里占了大头——p50 短柱先长，p99 柱分两段长出，红段标“排队占大头”
  // r2（P2 1-4）：sequence(0, …) 的各步在 t=0 并行开始、2.0s 即跑完，
  // 并行加一段缓慢缩放填满拍尾（5.9s < 6.158s）。
  say('尾巴主要是排出来的');
  yield* beat(
    'b5',
    all(
      sequence(
        0,
        all(g3().opacity(0, 0.5), g4().opacity(0, 0.5), g5().opacity(1, 0.6)),
        all(barP50().height(90, 1.2)),
        all(barP99proc().height(90, 1.2)),
        all(barP99queue().opacity(1, 0.4), barP99queue().height(200, 2.0)),  // r3 补：原 230 长到标题行（局部 y=-240）盖住「头」字（P1），改 200 留约 20px 间隙；红段仍远大于蓝段（90），「排队占大头」不变
        all(queueTag().opacity(1, 0.6)),
      ),
      g5().scale(1.04, 5.9),
    ),
  );
});
