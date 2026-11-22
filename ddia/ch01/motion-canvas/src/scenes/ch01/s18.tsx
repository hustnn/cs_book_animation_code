import {Circle, Line, Node, Rect, Txt, View2D, makeScene2D} from '@motion-canvas/2d';
import {createRef, waitFor} from '@motion-canvas/core';
import {all} from '@motion-canvas/core/lib/flow';

// 1.8 描述负载（60s）
// 时间轴：标题 0.5 + 四参数卡 11.5 (=12) + 推特扇出 28 (=40) + 对比卡 20 (=60)
// 取舍：关注者用 20×10=200 个小点阵表示数量级，
// 时间线亮起用一层绿色点阵淡入叠加，不逐个改 200 个点的颜色。
const BG = '#0F172A';
const CARD = '#1E293B';
const GREEN = '#34D399';
const BLUE = '#38BDF8';
const YELLOW = '#FBBF24';
const SLATE = '#94A3B8';
const LINE = '#475569';
const SANS = '"Noto Sans CJK SC", sans-serif';
const SERIF = '"Noto Serif CJK SC", serif';

const PARAMS = [
  {x: -465, title: '请求率', sub: '每秒多少请求'},
  {x: -155, title: '读写比', sub: '读占几成，写占几成'},
  {x: 155, title: '同时活跃用户', sub: '同时在线多少人'},
  {x: 465, title: '缓存命中率', sub: '缓存命中率多少'},
];

const FAN_COLS = 20;
const FAN_ROWS = 10;
const FAN_COUNT = FAN_COLS * FAN_ROWS; // 200
const fanX = (i: number) => ((i % FAN_COLS) - (FAN_COLS - 1) / 2) * 24;
const fanY = (i: number) => (Math.floor(i / FAN_COLS) - (FAN_ROWS - 1) / 2) * 24 + 110;

export default makeScene2D(function* (view: View2D) {
  view.add(<Rect width={1280} height={720} fill={BG} />);
  view.fill(BG);

  const title = createRef<Txt>();
  const narration = createRef<Txt>();
  const bigV = createRef<Circle>();
  const fanSlate = createRef<Node>();
  const fanGreen = createRef<Node>();
  const fanLabel = createRef<Txt>();
  const modeLabel = createRef<Txt>();
  const compare = createRef<Rect>();
  const cardRefs = PARAMS.map(() => createRef<Rect>());
  const lineRefs = [0, 1, 2, 3, 4].map(() => createRef<Line>());

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
        text={'第 1 章 · 1.8 描述负载'}
      />
      <Txt
        ref={narration}
        position={[0, 308]}
        fontSize={26}
        fill={'#E2E8F0'}
        fontFamily={SANS}
        text={''}
      />
      {/* 四个负载参数卡片 */}
      {PARAMS.map((p, i) => (
        <Rect
          key={String(i)}
          ref={cardRefs[i]}
          position={[p.x, -100]}
          width={290}
          height={160}
          radius={14}
          fill={CARD}
          stroke={BLUE}
          lineWidth={2}
          opacity={0}
        >
          <Txt
            position={[0, -30]}
            fontSize={28}
            fontWeight={700}
            fill={'#FFFFFF'}
            fontFamily={SANS}
            text={p.title}
          />
          <Txt
            position={[0, 30]}
            fontSize={20}
            fill={SLATE}
            fontFamily={SANS}
            text={p.sub}
          />
        </Rect>
      ))}
      {/* 中央大 V */}
      <Circle
        ref={bigV}
        position={[0, -160]}
        size={130}
        fill={BLUE}
        opacity={0}
      >
        <Txt
          fontSize={30}
          fontWeight={700}
          fill={'#0F172A'}
          fontFamily={SANS}
          text={'大 V'}
        />
      </Circle>
      {/* 扇形连线 */}
      {[-440, -220, 0, 220, 440].map((x, i) => (
        <Line
          key={String(i)}
          ref={lineRefs[i]}
          points={[
            [0, -95],
            [x, 10],
          ]}
          stroke={LINE}
          lineWidth={2}
          endArrow
          opacity={0}
        />
      ))}
      {/* 关注者点阵：灰层 + 绿层（亮起时叠加） */}
      <Node ref={fanSlate} opacity={0}>
        {Array.from({length: FAN_COUNT}, (_, i) => (
          <Circle
            key={String(i)}
            position={[fanX(i), fanY(i)]}
            size={10}
            fill={'#334155'}
          />
        ))}
      </Node>
      <Node ref={fanGreen} opacity={0}>
        {Array.from({length: FAN_COUNT}, (_, i) => (
          <Circle
            key={String(i)}
            position={[fanX(i), fanY(i)]}
            size={10}
            fill={GREEN}
          />
        ))}
      </Node>
      <Txt
        ref={fanLabel}
        position={[0, 260]}
        fontSize={24}
        fill={SLATE}
        fontFamily={SANS}
        opacity={0}
        text={'平均 75 个关注者 · 名人超 3000 万'}
      />
      <Txt
        ref={modeLabel}
        position={[0, -260]}
        fontSize={28}
        fontWeight={700}
        fill={YELLOW}
        fontFamily={SANS}
        opacity={0}
        text={'读时组装：用户打开时才现拼时间线'}
      />
      {/* 对比卡 */}
      <Rect
        ref={compare}
        position={[0, -20]}
        width={1000}
        height={260}
        radius={24}
        fill={CARD}
        stroke={GREEN}
        lineWidth={3}
        opacity={0}
      >
        <Txt
          position={[0, -55]}
          fontSize={36}
          fontWeight={700}
          fill={BLUE}
          fontFamily={SANS}
          text={'写时扇出：写重读轻'}
        />
        <Txt
          position={[0, 45]}
          fontSize={36}
          fontWeight={700}
          fill={GREEN}
          fontFamily={SANS}
          text={'读时组装：读重写轻'}
        />
      </Rect>
    </>,
  );

  const say = (text: string) => narration().text(text);

  // 0–0.5s 标题淡入
  yield* title().opacity(1, 0.5);

  // 0–12s 四个负载参数卡片依次亮起（11.5s）
  say('要谈扩展，先得会描述负载：\n每秒多少请求、读写各占几成、同时在线多少人、缓存命中率多少。');
  for (let i = 0; i < PARAMS.length; i++) {
    yield* cardRefs[i]().opacity(1, 0.6);
    yield* waitFor(1.0);
  }
  yield* waitFor(5.1);

  // 12–40s 推特扇出（28s）
  say('推特的时间线：一个大 V 发一条推文，\n平均扇出给 75 个关注者；名人可超 3000 万。');
  yield* all(...cardRefs.map(r => r().opacity(0, 0.8)));
  yield* bigV().opacity(1, 0.8);
  yield* all(...lineRefs.map(r => r().opacity(1, 0.5)));
  yield* fanSlate().opacity(1, 1.0);
  yield* fanGreen().opacity(1, 0.8);
  yield* fanLabel().opacity(1, 0.5);
  yield* modeLabel().opacity(1, 0.5);
  yield* waitFor(23.1);

  // 40–60s 对比卡（19.5s + 淡出 0.5s）
  say('写的时候扇出，还是读的时候再组装？\n两种做法，代价完全不同。');
  yield* all(
    bigV().opacity(0, 0.8),
    fanSlate().opacity(0, 0.8),
    fanGreen().opacity(0, 0.8),
    fanLabel().opacity(0, 0.8),
    modeLabel().opacity(0, 0.8),
    ...lineRefs.map(r => r().opacity(0, 0.8)),
  );
  yield* compare().opacity(1, 0.8);
  yield* waitFor(17.9);
  yield* all(
    title().opacity(0, 0.5),
    narration().opacity(0, 0.5),
    compare().opacity(0, 0.5),
  );
});
