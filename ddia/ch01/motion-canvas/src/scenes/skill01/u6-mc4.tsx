// U6 场景 4（MC）：b30–b32 —— 回扣（在用户那一侧量）、想一想、下一站。
// 分镜：skill-ch01/ch01-beats.md U6 一节；原文：DDIA §1.9 后半（书页 p15–17）。
// b31 的读数取自 b20–b21 的引申公式 1−0.99^N：N=7 时约 7%，N=100 时约 63%，与前文一致。
// 时长全部来自 timeline/u6.json（beat() 驱动），不手写 waitFor。
import {Circle, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, chain, createRef, sequence, waitFor} from '@motion-canvas/core';
import {makeBeats} from '../../lib/beats';
import {FONT, SAFE, SIZE, T} from '../../lib/theme';
import timeline from '../../timeline/u6.json';

export default makeScene2D(function* (view) {
  view.fill(T.bg);
  const beat = makeBeats(timeline);

  const header = createRef<Txt>();
  const anchor = createRef<Txt>();
  const g30 = createRef<Node>();
  const chips = [0, 1, 2].map(() => createRef<Node>());
  const g31 = createRef<Node>();
  const knob = createRef<Circle>();
  const ampBar = createRef<Rect>();
  const ampRead = createRef<Txt>();
  const ampRead2 = createRef<Txt>();
  const g32 = createRef<Node>();
  const climbDot = createRef<Circle>();

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

      {/* b30：回到 b1 的画面——服务器日志全绿，但队列被“照亮”；三条回扣依次出现 */}
      <Node ref={g30} opacity={0}>
        <Rect position={[-280, -120]} width={420} height={150} radius={20} fill={T.card} stroke={T.green} lineWidth={3}>
          <Txt position={[0, -30]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'服务器日志'} />
          <Txt position={[0, 30]} fontSize={SIZE.body} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'50 ms ✓'} />
        </Rect>
        <Rect position={[280, -120]} width={420} height={150} radius={20} fill={T.card} stroke={T.yellow} lineWidth={3}>
          <Txt position={[0, -30]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'队列'} />
          <Txt position={[0, 30]} fontSize={SIZE.body} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'它看不见队列'} />
        </Rect>
        {[
          {x: -380, t: '在用户那一侧量'},
          {x: 0, t: '按真实节奏压测'},
          {x: 380, t: '扇出会放大尾巴'},
        ].map((c, i) => (
          // r2：位置放在 Node 上（Rect 在 [0,0]），这样 chips[i].scale() 才是原地脉冲，
          // 而不是绕画面中心缩放导致芯片位移。
          <Node key={`u6-chip-${i}`} ref={chips[i]} position={[c.x, 90]} opacity={0}>
            <Rect position={[0, 0]} width={340} height={80} radius={12} fill={T.card} stroke={T.blue} lineWidth={2}>
              <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={c.t} />
            </Rect>
          </Node>
        ))}
      </Node>

      {/* b31：后端数量旋钮，放大倍数跟着变 */}
      <Node ref={g31} opacity={0}>
        <Txt position={[0, -240]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'一次操作调几个后端？'} />
        <Line points={[[-420, -80], [420, -80]]} stroke={T.line} lineWidth={4} />
        <Txt position={[-420, -130]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'N = 1'} />
        <Txt position={[420, -130]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'N = 100'} />
        <Circle ref={knob} position={[-420, -80]} width={56} height={56} fill={T.yellow} />
        <Txt position={[0, 20]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'撞上慢调用的概率'} />
        <Rect position={[0, 100]} width={920} height={26} radius={13} fill={T.card} stroke={T.line} lineWidth={2} />
        <Rect ref={ampBar} position={[-460, 100]} offset={[-1, 0]} width={0} height={26} radius={13} fill={T.red} />
        <Txt ref={ampRead} position={[0, 160]} fontSize={SIZE.label} fill={T.red} fontFamily={FONT.sans} text={'N = 1：约 1%'} />
        <Txt ref={ampRead2} position={[0, 160]} fontSize={SIZE.label} fill={T.red} fontFamily={FONT.sans} opacity={0} text={'N = 100：约 63%'} />
      </Node>

      {/* b32：下一站——负载曲线爬升 */}
      <Node ref={g32} opacity={0}>
        <Txt position={[0, -140]} fontSize={SIZE.title} fontWeight={700} fill={T.white} fontFamily={FONT.serif} text={'下一站：怎么扛负载'} />
        <Line points={[[-400, 100], [-200, 60], [0, 70], [200, -20], [400, -90]]} stroke={T.blue} lineWidth={4} endArrow />
        {/* r2（P2 1-4）：黄点沿负载曲线爬升，填满拍尾 */}
        <Circle ref={climbDot} position={[-400, 100]} width={30} height={30} fill={T.yellow} opacity={0} />
        <Txt position={[0, 160]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'负载继续长大，架构要怎么跟着变？'} />
      </Node>
    </>,
  );

  // b30：服务器没撒谎，它只是看不见队列——队列被照亮，三条回扣依次出现
  // r2（P2 1-3）：三枚 chips 在 5.6s 内出齐，之后约 4.8s 静态；
  // 出齐后逐枚轻微高亮扫过（原地缩放脉冲，5.8s 起、每枚 1.4s，总 10.0s < 10.44s）。
  say('在用户那一侧量');
  yield* beat(
    'b30',
    all(
      g30().opacity(1, 0.6),
      sequence(2.5, chips[0]().opacity(1, 0.6), chips[1]().opacity(1, 0.6), chips[2]().opacity(1, 0.6)),
      chain(
        waitFor(5.8),
        chips[0]().scale(1.06, 0.7),
        chips[0]().scale(1, 0.7),
        chips[1]().scale(1.06, 0.7),
        chips[1]().scale(1, 0.7),
        chips[2]().scale(1.06, 0.7),
        chips[2]().scale(1, 0.7),
      ),
    ),
  );

  // b31：后端数量旋钮从 N=1 推到 N=100，撞上慢调用的概率跟着涨（1% → 63%）；旋钮到位后读数切换
  say('你调了几个后端');
  yield* beat(
    'b31',
    all(
      g30().opacity(0, 0.5),
      g31().opacity(1, 0.6),
      chain(
        knob().position([420, -80], 5.5),
        all(ampRead().opacity(0, 0.3), ampRead2().opacity(1, 0.5)),
      ),
      ampBar().width(580, 5.5),
    ),
  );

  // b32：下一单元，负载继续长大，架构要怎么跟着变？
  // r2（P2 1-4）：淡入只有 0.6s，黄点沿负载曲线爬升填满拍尾（4.7s < 6.038s）。
  say('下一站：怎么扛负载');
  yield* beat(
    'b32',
    all(
      g31().opacity(0, 0.5),
      g32().opacity(1, 0.6),
      chain(
        climbDot().opacity(1, 0.3),
        climbDot().position([-200, 60], 1.1),
        climbDot().position([0, 70], 1.1),
        climbDot().position([200, -20], 1.1),
        climbDot().position([400, -90], 1.1),
      ),
    ),
  );
});
