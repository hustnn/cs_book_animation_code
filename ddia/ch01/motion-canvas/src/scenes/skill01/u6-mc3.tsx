// U6 场景 3（MC）：b22 —— 尾延迟放大：小比例的慢调用，放大成大比例的慢终端请求。
// 分镜：skill-ch01/ch01-beats.md U6 一节；原文：DDIA §1.9 “Percentiles in Practice”小框（书页 p16，PDF p38）。
// “1% → 63%”取自 b20–b21 的引申曲线（N=100 时 1−0.99^100 ≈ 63%），与上一场景的数字一致。
// 时长来自 timeline/u6.json（beat() 驱动），不手写 waitFor。
import {Circle, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, chain, createRef} from '@motion-canvas/core';
import {makeBeats} from '../../lib/beats';
import {FONT, SAFE, SIZE, T} from '../../lib/theme';
import timeline from '../../timeline/u6.json';

export default makeScene2D(function* (view) {
  view.fill(T.bg);
  const beat = makeBeats(timeline);

  const header = createRef<Txt>();
  const anchor = createRef<Txt>();
  const g22 = createRef<Node>();
  const dot = createRef<Circle>();
  const block = createRef<Rect>();
  const smallTag = createRef<Txt>();
  const bigTag = createRef<Txt>();

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

      <Node ref={g22} opacity={0}>
        <Txt position={[0, -240]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'小比例慢调用 → 大比例慢请求'} />
        <Circle ref={dot} position={[0, -40]} width={40} height={40} fill={T.red} />
        <Txt ref={smallTag} position={[0, 40]} fontSize={SIZE.label} fill={T.red} fontFamily={FONT.sans} text={'慢调用 1%'} />
        <Rect ref={block} position={[0, -40]} width={40} height={40} radius={12} fill={T.red} opacity={0} />
        <Txt ref={bigTag} position={[0, 160]} fontSize={SIZE.label} fill={T.red} fontFamily={FONT.sans} opacity={0} text={'慢请求 63%（100 个后端时）'} />
      </Node>
    </>,
  );

  // b22：小红点放大成大红块——尾延迟放大（串联：换块 → 长大 → 换标签 → 轻 pulse）
  say('尾延迟放大');
  yield* beat(
    'b22',
    all(
      g22().opacity(1, 0.6),
      chain(
        all(dot().opacity(0, 0.4), block().opacity(1, 0.4)),
        all(block().width(560, 3.2), block().height(220, 3.2)),
        all(smallTag().opacity(0, 0.4), bigTag().opacity(1, 0.6)),
        // lint（并行补间冲突）：原 all(width→580, width→560) 两个补间同时进行，没有 pulse；改成先放大再回落
        block().width(580, 0.5).to(560, 0.5),
      ),
    ),
  );
});
