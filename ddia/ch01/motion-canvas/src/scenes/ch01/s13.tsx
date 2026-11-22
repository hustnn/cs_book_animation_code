import {Circle, Node, Rect, Txt, View2D, makeScene2D} from '@motion-canvas/2d';
import {createRef, createSignal, waitFor} from '@motion-canvas/core';
import {all} from '@motion-canvas/core/lib/flow';

// 1.3 硬件故障（60s）
// 时间轴：标题 0.5 + 硬盘/MTTF 11.5 (=12) + 阵列翻日 18 (=30)
//        + 冗余接管 18 (=48) + 收尾 12 (=60)
// 取舍：10,000 块盘不用 1 万个节点画，用 40×25=1000 个小点阵
// 表示数量级，配文字“10,000 块盘”。
const BG = '#0F172A';
const CARD = '#1E293B';
const GREEN = '#34D399';
const RED = '#F87171';
const BLUE = '#38BDF8';
const YELLOW = '#FBBF24';
const SLATE = '#94A3B8';
const LINE = '#475569';
const SANS = '"Noto Sans CJK SC", sans-serif';
const SERIF = '"Noto Serif CJK SC", serif';

const COLS = 40;
const ROWS = 25;
const DOT_COUNT = COLS * ROWS; // 1000
const dotX = (i: number) => ((i % COLS) - (COLS - 1) / 2) * 13;
const dotY = (i: number) => (Math.floor(i / COLS) - (ROWS - 1) / 2) * 13 - 30;
// 每天坏一块：前 6 天坏的盘
const BAD = [0, 137, 402, 555, 731, 968];
// 备用盘：阵列末尾的几块
const SPARE = [990, 991, 992, 993, 994];

export default makeScene2D(function* (view: View2D) {
  view.add(<Rect width={1280} height={720} fill={BG} />);
  view.fill(BG);

  const title = createRef<Txt>();
  const narration = createRef<Txt>();
  const disk = createRef<Rect>();
  const mttf = createRef<Txt>();
  const grid = createRef<Node>();
  const gridLabel = createRef<Txt>();
  const counter = createRef<Txt>();
  const okNote = createRef<Txt>();
  const closing = createRef<Rect>();
  const dotRefs = Array.from({length: DOT_COUNT}, () => createRef<Circle>());
  const day = createSignal(0);

  view.add(
    <>
      <Txt
        ref={title}
        position={[0, -322]}
        fontSize={38}
        fontWeight={700}
        fill={'#FFFFFF'}
        fontFamily={SERIF}
        opacity={0}
        text={'第 1 章 · 1.3 硬件故障'}
      />
      <Txt
        ref={narration}
        position={[0, 308]}
        fontSize={26}
        fill={'#E2E8F0'}
        fontFamily={SANS}
        text={''}
      />
      {/* 一块硬盘 + MTTF */}
      <Rect
        ref={disk}
        position={[0, -60]}
        width={420}
        height={170}
        radius={18}
        fill={CARD}
        stroke={BLUE}
        lineWidth={3}
        opacity={0}
      >
        <Txt
          position={[0, -30]}
          fontSize={40}
          fontWeight={700}
          fill={'#FFFFFF'}
          fontFamily={SANS}
          text={'硬盘'}
        />
        <Txt
          position={[0, 40]}
          fontSize={24}
          fill={SLATE}
          fontFamily={SANS}
          text={'一块盘'}
        />
      </Rect>
      <Txt
        ref={mttf}
        position={[0, 120]}
        fontSize={40}
        fontWeight={700}
        fill={YELLOW}
        fontFamily={SANS}
        opacity={0}
        text={'MTTF 10–50 年'}
      />
      {/* 10,000 块盘点阵 */}
      <Node ref={grid} opacity={0}>
        {dotRefs.map((r, i) => (
          <Circle
            key={String(i)}
            ref={r}
            position={[dotX(i), dotY(i)]}
            size={9}
            fill={'#334155'}
          />
        ))}
      </Node>
      <Txt
        ref={gridLabel}
        position={[0, -260]}
        fontSize={32}
        fontWeight={700}
        fill={'#FFFFFF'}
        fontFamily={SANS}
        opacity={0}
        text={'10,000 块盘'}
      />
      <Txt
        ref={counter}
        position={[0, 240]}
        fontSize={28}
        fontWeight={700}
        fill={YELLOW}
        fontFamily={SANS}
        opacity={0}
        text={() => `第 ${day()} 天 · 今天坏了 1 块`}
      />
      <Txt
        ref={okNote}
        position={[0, 240]}
        fontSize={28}
        fontWeight={700}
        fill={GREEN}
        fontFamily={SANS}
        opacity={0}
        text={'系统继续服务 · 冗余接管 ✓'}
      />
      {/* 收尾卡 */}
      <Rect
        ref={closing}
        position={[0, -10]}
        width={1000}
        height={240}
        radius={24}
        fill={CARD}
        stroke={GREEN}
        lineWidth={3}
        opacity={0}
      >
        <Txt
          position={[0, 0]}
          fontSize={36}
          fontWeight={700}
          fill={'#FFFFFF'}
          fontFamily={SERIF}
          text={'冗余不能完全防止失效。'}
        />
      </Rect>
    </>,
  );

  const say = (text: string) => narration().text(text);

  // 0–0.5s 标题淡入
  yield* title().opacity(1, 0.5);

  // 0–12s 一块硬盘 + MTTF（11.5s）
  say('硬件一定会坏：一块硬盘的平均无故障时间，\n大概是 10 到 50 年。');
  yield* disk().opacity(1, 0.8);
  yield* mttf().opacity(1, 0.8);
  yield* waitFor(9.9);

  // 12–30s 阵列翻日，每天坏一块（18s）
  say('听着很长，对吧？但 1 万块盘的集群，\n平均每天就会坏一块。');
  yield* all(disk().opacity(0, 0.8), mttf().opacity(0, 0.8));
  yield* grid().opacity(1, 1.0);
  yield* gridLabel().opacity(1, 0.5);
  yield* counter().opacity(1, 0.5);
  for (let d = 0; d < BAD.length; d++) {
    day(d + 1);
    yield* dotRefs[BAD[d]]().fill(RED, 0.4);
    yield* waitFor(1.8);
  }
  yield* waitFor(2.0);

  // 30–48s 坏盘灰掉，备用盘亮起接管（18s）
  say('机器一多，硬件故障就从偶发变成了日常。\n办法：加冗余，也要软件容错。');
  yield* all(...BAD.map(i => dotRefs[i]().fill('#475569', 0.5)));
  yield* all(...SPARE.map(i => dotRefs[i]().fill(GREEN, 0.5)));
  yield* counter().opacity(0, 0.5);
  yield* okNote().opacity(1, 0.5);
  yield* waitFor(16.0);

  // 48–60s 收尾卡（11.5s + 淡出 0.5s）
  say('单机故障，不等于系统失效。');
  yield* all(
    grid().opacity(0, 0.8),
    gridLabel().opacity(0, 0.8),
    okNote().opacity(0, 0.8),
  );
  yield* closing().opacity(1, 0.8);
  yield* waitFor(9.9);
  yield* all(
    title().opacity(0, 0.5),
    narration().opacity(0, 0.5),
    closing().opacity(0, 0.5),
  );
});
