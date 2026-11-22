// U4 场景 3（MC）：b26–b33 —— 做法 2 为什么划算、扇出代价 4.6k × 75 = 345k、
// 名人 3000 万关注者与 5 秒送达、Figure 1-3 原图复现与三处速率。
// 分镜：skill-ch01/ch01-beats.md U4 一节；原文：DDIA §1.8（书页 p12，PDF p34）。
// Figure 1-3 按原图复现：All tweets T8…T1；收件人 1：T7 T5 T3 T1；收件人 2：T8 T6 T5；
// 收件人 3：T8 T7 T4 T3；三处速率 4.6k / 345k / 300k；Fan-out 标注 up to 31M。
// 时长全部来自 timeline/u4.json（beat() 驱动），不手写 waitFor 魔法数字。
// 动画排序用 sequence()（先后步骤），不用 chain(waitFor()) 堆字面等待。
import {Circle, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, sequence} from '@motion-canvas/core';
import {makeBeats} from '../../lib/beats';
import {FONT, SAFE, SIZE, T} from '../../lib/theme';
import timeline from '../../timeline/u4.json';

export default makeScene2D(function* (view) {
  view.fill(T.bg);
  const beat = makeBeats(timeline);

  const header = createRef<Txt>();
  const anchor = createRef<Txt>();
  const g26 = createRef<Node>();
  const wBar26 = createRef<Rect>();
  const rBar26 = createRef<Rect>();
  const badge26 = createRef<Txt>();
  const g27 = createRef<Node>();
  const leftPan = createRef<Node>();
  const rightPan = createRef<Node>();
  const ok27 = createRef<Txt>();
  const g28 = createRef<Node>();
  const fan28a = createRef<Node>();
  const fan28b = createRef<Node>();
  const fan28c = createRef<Node>();
  const g29 = createRef<Node>();
  const n1 = createRef<Node>();
  const n2 = createRef<Node>();
  const n3 = createRef<Node>();
  const g30 = createRef<Node>();
  const smallFan = createRef<Node>();
  const bigFan = createRef<Node>();
  const g31 = createRef<Node>();
  const cdBar = createRef<Rect>();
  const g32 = createRef<Node>();
  const queuePart = createRef<Node>();
  const fanPart = createRef<Node>();
  const readPart = createRef<Node>();
  const g33 = createRef<Node>();
  const rate1 = createRef<Txt>();
  const rate2 = createRef<Txt>();
  const rate3 = createRef<Txt>();

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
        text={'第 1 章 · 负载——Twitter 时间线'}
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

      {/* b26：4.6k vs 300k 并排（r2 #2：标题去掉“对数尺度”说法；300k 标签移到读条上方，不再压条） */}
      <Node ref={g26} opacity={0}>
        <Txt position={[0, -200]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'平均速率对比'} />
        <Txt position={[-460, -110]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'发推'} />
        <Rect ref={wBar26} position={[-260, -60]} offset={[-1, 0]} width={10} height={54} radius={8} fill={T.green} />
        <Txt position={[30, -60]} fontSize={SIZE.body} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'4.6k/秒'} />
        <Txt position={[-460, 30]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'读时间线'} />
        <Rect ref={rBar26} position={[-260, 80]} offset={[-1, 0]} width={10} height={54} radius={8} fill={T.blue} />
        <Txt position={[420, 28]} fontSize={SIZE.body} fontWeight={700} fill={T.blue} fontFamily={FONT.sans} text={'300k/秒'} />
        <Txt ref={badge26} position={[0, 180]} fontSize={SIZE.body} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} opacity={0} text={'写比读少将近两个数量级'} />
      </Node>

      {/* b27：天平——写时多干一点，读时省一大截 */}
      <Node ref={g27} opacity={0}>
        <Txt position={[0, -230]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'写时多干活，读时少干活'} />
        <Rect position={[0, 26]} width={36} height={36} rotation={45} fill={T.muted} />
        <Line points={[[-340, -60], [340, 60]]} stroke={T.line} lineWidth={4} />
        <Node ref={leftPan} opacity={0}>
          <Line points={[[-340, -60], [-340, -20]]} stroke={T.line} lineWidth={3} />
          <Rect position={[-340, 25]} width={280} height={90} radius={12} fill={T.card} stroke={T.green} lineWidth={2}>
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'写时多干一点'} />
          </Rect>
        </Node>
        <Node ref={rightPan} opacity={0}>
          <Line points={[[340, 60], [340, 100]]} stroke={T.line} lineWidth={3} />
          <Rect position={[340, 145]} width={280} height={90} radius={12} fill={T.card} stroke={T.blue} lineWidth={2}>
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'读时省一大截'} />
          </Rect>
        </Node>
        <Txt ref={ok27} position={[0, -160]} fontSize={SIZE.body} fontWeight={700} fill={T.green} fontFamily={FONT.sans} opacity={0} text={'✓ 这笔账划算'} />
      </Node>

      {/* b28：一封推文分叉成 75 封（示意 15 个小格代表扇出，分三组出现） */}
      <Node ref={g28} opacity={0}>
        <Rect position={[-420, -40]} width={220} height={90} radius={12} fill={T.yellow}>
          <Txt fontSize={SIZE.label} fill={T.bg} fontFamily={FONT.sans} text={'1 条推文'} />
        </Rect>
        <Node ref={fan28a} opacity={0}>
          {[
            [-80, -160], [40, -160], [160, -160], [280, -160], [400, -160],
          ].map((p, i) => (
            <Rect key={`u4-fan28a-${i}`} position={[p[0], p[1]]} width={80} height={64} radius={8} fill={T.green} />
          ))}
        </Node>
        <Node ref={fan28b} opacity={0}>
          {[
            [-80, -40], [40, -40], [160, -40], [280, -40], [400, -40],
          ].map((p, i) => (
            <Rect key={`u4-fan28b-${i}`} position={[p[0], p[1]]} width={80} height={64} radius={8} fill={T.green} />
          ))}
        </Node>
        <Node ref={fan28c} opacity={0}>
          {[
            [-80, 80], [40, 80], [160, 80], [280, 80], [400, 80],
          ].map((p, i) => (
            <Rect key={`u4-fan28c-${i}`} position={[p[0], p[1]]} width={80} height={64} radius={8} fill={T.green} />
          ))}
        </Node>
        <Line points={[[-310, -40], [-120, -160]]} stroke={T.line} lineWidth={2} endArrow />
        <Line points={[[-310, -40], [-120, -40]]} stroke={T.line} lineWidth={2} endArrow />
        <Line points={[[-310, -40], [-120, 80]]} stroke={T.line} lineWidth={2} endArrow />
        <Txt position={[160, 180]} fontSize={SIZE.body} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'平均扇出约 75 人'} />
        <Txt position={[160, 230]} fontSize={SIZE.min} fill={T.muted} fontFamily={FONT.sans} text={'示意：15 个方块代表 75 位关注者'} />
      </Node>

      {/* b29：4.6k × 75 = 345k 乘法动画 */}
      <Node ref={g29} opacity={0}>
        <Node ref={n1} opacity={0}>
          <Txt position={[-380, -40]} fontSize={52} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'4.6k'} />
          <Txt position={[-380, 30]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'推文/秒'} />
        </Node>
        <Node ref={n2} opacity={0}>
          <Txt position={[0, -40]} fontSize={52} fontWeight={700} fill={T.white} fontFamily={FONT.sans} text={'× 75'} />
          <Txt position={[0, 30]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'每推扇出'} />
        </Node>
        <Node ref={n3} opacity={0}>
          <Txt position={[360, -40]} fontSize={64} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'345k'} />
          <Txt position={[360, 30]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'写/秒'} />
        </Node>
        <Txt position={[0, 140]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'每秒 34.5 万次写'} />
      </Node>

      {/* b30：平均 75 的小扇子 vs 名人 3000 万的巨扇 */}
      <Node ref={g30} opacity={0}>
        <Node ref={smallFan} opacity={0}>
          <Circle position={[-380, -40]} width={60} height={60} fill={T.blue} />
          {[
            [-240, -160], [-200, -100], [-240, -40], [-200, 20], [-240, 80],
            [-140, -130], [-140, -40], [-140, 50],
          ].map((p, i) => (
            <Circle key={`u4-sfan-${i}`} position={[p[0], p[1]]} width={26} height={26} fill={T.green} />
          ))}
          <Txt position={[-260, 150]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'普通用户：平均 75'} />
        </Node>
        <Node ref={bigFan} opacity={0}>
          <Circle position={[200, -40]} width={60} height={60} fill={T.red} />
          {[
            [330, -200], [380, -180], [430, -200], [480, -180], [520, -200],
            [330, -140], [380, -120], [430, -140], [480, -120], [520, -140],
            [330, -80], [380, -60], [430, -80], [480, -60], [520, -80],
            [330, -20], [380, 0], [430, -20], [480, 0], [520, -20],
            [330, 40], [380, 60], [430, 40], [480, 60], [520, 40],
          ].map((p, i) => (
            <Circle key={`u4-bfan-${i}`} position={[p[0], p[1]]} width={22} height={22} fill={T.red} opacity={0.85} />
          ))}
          <Txt position={[360, 150]} fontSize={SIZE.label} fill={T.red} fontFamily={FONT.sans} text={'有人超 3000 万关注者'} />
        </Node>
      </Node>

      {/* b31：巨扇复制 + 5 秒倒计时条走完本拍 */}
      <Node ref={g31} opacity={0}>
        <Txt position={[0, -200]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'一条推文，最多要写 3000 多万次'} />
        <Rect position={[0, -60]} width={700} height={40} radius={20} fill={T.card} stroke={T.line} lineWidth={2} />
        <Rect ref={cdBar} position={[-350, -60]} offset={[-1, 0]} width={700} height={40} radius={20} fill={T.red} />
        <Txt position={[0, 20]} fontSize={SIZE.title} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'5 秒'} />
        <Txt position={[0, 110]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'Twitter 想在 5 秒内送达'} />
      </Node>

      {/* b32/b33：Figure 1-3 原图复现（分三组依次出现） */}
      <Node ref={g32} opacity={0}>
        <Txt position={[0, -296]} fontSize={SIZE.min} fill={T.muted} fontFamily={FONT.sans} text={'Fan-out: deliver tweet to each follower'} />
        <Txt position={[0, -272]} fontSize={SIZE.min} fill={T.muted} fontFamily={FONT.sans} text={'(up to 31M followers per user)'} />
        <Node ref={queuePart} opacity={0}>
          <Circle position={[-540, -40]} width={60} height={60} fill={T.card} stroke={T.blue} lineWidth={3} />
          <Txt position={[-540, -100]} fontSize={SIZE.min} fill={T.muted} fontFamily={FONT.sans} text={'用户发推'} />
          <Line points={[[-505, -40], [-480, -40]]} stroke={T.line} lineWidth={3} endArrow />
          <Txt position={[-300, -110]} fontSize={SIZE.min} fill={T.muted} fontFamily={FONT.sans} text={'All tweets'} />
          {['T8', 'T7', 'T6', 'T5', 'T4', 'T3', 'T2', 'T1'].map((t, i) => (
            <Rect key={`u4-all-${i}`} position={[-458 + i * 44, -40]} width={44} height={44} stroke={T.line} lineWidth={2}>
              <Txt fontSize={SIZE.min} fill={T.text} fontFamily={FONT.sans} text={t} />
            </Rect>
          ))}
        </Node>
        <Node ref={fanPart} opacity={0}>
          <Line points={[[-106, -40], [120, -190]]} stroke={T.line} lineWidth={2} endArrow />
          <Line points={[[-106, -40], [120, -40]]} stroke={T.line} lineWidth={2} endArrow />
          <Line points={[[-106, -40], [120, 110]]} stroke={T.line} lineWidth={2} endArrow />
          <Txt position={[200, -232]} fontSize={SIZE.min} fill={T.muted} fontFamily={FONT.sans} text={'Tweets for recipient 1'} />
          {['T7', 'T5', 'T3', 'T1'].map((t, i) => (
            <Rect key={`u4-r1-${i}`} position={[140 + i * 40, -190]} width={40} height={40} stroke={T.line} lineWidth={2}>
              <Txt fontSize={SIZE.min} fill={T.text} fontFamily={FONT.sans} text={t} />
            </Rect>
          ))}
          <Txt position={[200, -82]} fontSize={SIZE.min} fill={T.muted} fontFamily={FONT.sans} text={'Tweets for recipient 2'} />
          {['T8', 'T6', 'T5'].map((t, i) => (
            <Rect key={`u4-r2-${i}`} position={[140 + i * 40, -40]} width={40} height={40} stroke={T.line} lineWidth={2}>
              <Txt fontSize={SIZE.min} fill={T.text} fontFamily={FONT.sans} text={t} />
            </Rect>
          ))}
          <Txt position={[200, 68]} fontSize={SIZE.min} fill={T.muted} fontFamily={FONT.sans} text={'Tweets for recipient 3'} />
          {['T8', 'T7', 'T4', 'T3'].map((t, i) => (
            <Rect key={`u4-r3-${i}`} position={[140 + i * 40, 110]} width={40} height={40} stroke={T.line} lineWidth={2}>
              <Txt fontSize={SIZE.min} fill={T.text} fontFamily={FONT.sans} text={t} />
            </Rect>
          ))}
        </Node>
        <Node ref={readPart} opacity={0}>
          <Txt position={[430, -232]} fontSize={SIZE.min} fill={T.muted} fontFamily={FONT.sans} text={'Get home timeline'} />
          <Txt position={[430, -208]} fontSize={SIZE.min} fill={T.muted} fontFamily={FONT.sans} text={'(website, API)'} />
          {[-190, -40, 110].map((y, i) => (
            <Circle key={`u4-ru-${i}`} position={[540, y]} width={54} height={54} fill={T.card} stroke={T.blue} lineWidth={3} />
          ))}
          <Line points={[[510, -190], [300, -190]]} stroke={T.line} lineWidth={2} endArrow />
          <Line points={[[510, -40], [260, -40]]} stroke={T.line} lineWidth={2} endArrow />
          <Line points={[[510, 110], [300, 110]]} stroke={T.line} lineWidth={2} endArrow />
        </Node>
      </Node>
      {/* b33：三处速率依次亮起 */}
      <Node ref={g33} opacity={0}>
        <Txt ref={rate1} position={[-300, 40]} fontSize={SIZE.body} fontWeight={700} fill={T.green} fontFamily={FONT.sans} opacity={0} text={'4.6k writes/sec'} />
        <Txt ref={rate2} position={[0, 200]} fontSize={SIZE.body} fontWeight={700} fill={T.red} fontFamily={FONT.sans} opacity={0} text={'345k writes/sec'} />
        <Txt ref={rate3} position={[350, 200]} fontSize={SIZE.body} fontWeight={700} fill={T.blue} fontFamily={FONT.sans} opacity={0} text={'300k reads/sec'} />
      </Node>
    </>,
  );

  // b26：做法 2 为什么更划算——写比读少将近两个数量级（r2 #2：两条读/写条并行生长，拍内大部分时间可见比较）
  say('写比读少两个数量级');
  yield* beat(
    'b26',
    sequence(2.2, g26().opacity(1, 0.6), all(wBar26().width(200, 2.0), rBar26().width(740, 2.5)), badge26().opacity(1, 0.8)),
  );

  // b27：写时多干活，读时少干活——天平两边依次落下
  say('写多干，读少干');
  yield* beat(
    'b27',
    all(
      g26().opacity(0, 0.5),
      sequence(1.0, g27().opacity(1, 0.6), leftPan().opacity(1, 0.6), rightPan().opacity(1, 0.6), ok27().opacity(1, 0.6)),
    ),
  );

  // b28：平均每推扇出约 75 人——三组小格依次出现
  say('平均扇出约 75 人');
  yield* beat(
    'b28',
    all(g27().opacity(0, 0.5), sequence(1.2, g28().opacity(1, 0.6), fan28a().opacity(1, 0.4), fan28b().opacity(1, 0.4), fan28c().opacity(1, 0.4))),
  );

  // b29：4.6k × 75 = 345k——三段依次出现
  say('4.6k × 75');
  yield* beat(
    'b29',
    all(
      g28().opacity(0, 0.5),
      sequence(1.6, g29().opacity(1, 0.6), n1().opacity(1, 0.6), n2().opacity(1, 0.6), n3().opacity(1, 0.6)),
    ),
  );

  // b30：平均数会骗人——小扇子先出现，巨扇随后展开
  say('有人超 3000 万关注者');
  yield* beat(
    'b30',
    all(
      g29().opacity(0, 0.5),
      sequence(1.6, g30().opacity(1, 0.6), smallFan().opacity(1, 0.6), bigFan().opacity(1, 0.6)),
    ),
  );

  // b31：一条推文最多写 3000 多万次，5 秒内送达——倒计时条走完本拍
  say('5 秒内送达');
  yield* beat(
    'b31',
    all(g30().opacity(0, 0.5), sequence(0, g31().opacity(1, 0.6), cdBar().width(0, 4.5))),
  );

  // b32：Figure 1-3 原图——队列、扇出、取时间线三组依次出现
  say('三个邮箱各不相同');
  yield* beat(
    'b32',
    all(g31().opacity(0, 0.5), sequence(1.4, g32().opacity(1, 0.4), queuePart().opacity(1, 0.7), fanPart().opacity(1, 0.7), readPart().opacity(1, 0.7))),
  );

  // b33：图上三处速率——依次亮起（本拍 11.9s，每处约隔 3s，与旁白三处速率同步）
  say('三处速率');
  yield* beat(
    'b33',
    sequence(2.9, g33().opacity(1, 0.4), rate1().opacity(1, 0.6), rate2().opacity(1, 0.6), rate3().opacity(1, 0.6)),
  );
});
