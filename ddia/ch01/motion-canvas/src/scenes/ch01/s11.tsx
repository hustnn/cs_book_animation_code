import {Circle, Line, Rect, Txt, View2D, makeScene2D} from '@motion-canvas/2d';
import {createRef, waitFor} from '@motion-canvas/core';
import {all} from '@motion-canvas/core/lib/flow';

// 1.1 思考数据系统（45s）
// 时间轴：标题 0.5 + 对照卡 7.5 (=8) + 五构件 22 (=30) + 收尾 15 (=45)
const BG = '#0F172A';
const CARD = '#1E293B';
const GREEN = '#34D399';
const BLUE = '#38BDF8';
const YELLOW = '#FBBF24';
const SLATE = '#94A3B8';
const LINE = '#475569';
const SANS = '"Noto Sans CJK SC", sans-serif';
const SERIF = '"Noto Serif CJK SC", serif';

const BLOCKS = [
  {x: -440, title: '数据库', sub: '存数据'},
  {x: -220, title: '缓存', sub: '记下昂贵计算的结果'},
  {x: 0, title: '搜索索引', sub: '按关键词找'},
  {x: 220, title: '流处理', sub: '异步发消息'},
  {x: 440, title: '批处理', sub: '定期 crunch\n一大批数据'},
];

export default makeScene2D(function* (view: View2D) {
  view.add(<Rect width={1280} height={720} fill={BG} />);
  view.fill(BG);

  const title = createRef<Txt>();
  const narration = createRef<Txt>();
  const cardCpu = createRef<Rect>();
  const cardData = createRef<Rect>();
  const app = createRef<Circle>();
  const closing = createRef<Rect>();
  const lineRefs = BLOCKS.map(() => createRef<Line>());
  const blockRefs = BLOCKS.map(() => createRef<Rect>());

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
        text={'第 1 章 · 1.1 思考数据系统'}
      />
      <Txt
        ref={narration}
        position={[0, 308]}
        fontSize={26}
        fill={'#E2E8F0'}
        fontFamily={SANS}
        text={''}
      />
      {/* 左右对照卡 */}
      <Rect
        ref={cardCpu}
        position={[-320, -150]}
        width={540}
        height={170}
        radius={18}
        fill={CARD}
        stroke={LINE}
        lineWidth={2}
        opacity={0}
      >
        <Txt
          position={[0, -35]}
          fontSize={32}
          fontWeight={700}
          fill={'#FFFFFF'}
          fontFamily={SANS}
          text={'计算密集型'}
        />
        <Txt
          position={[0, 35]}
          fontSize={26}
          fill={SLATE}
          fontFamily={SANS}
          text={'瓶颈是 CPU'}
        />
      </Rect>
      <Rect
        ref={cardData}
        position={[320, -150]}
        width={540}
        height={170}
        radius={18}
        fill={CARD}
        stroke={BLUE}
        lineWidth={3}
        opacity={0}
      >
        <Txt
          position={[0, -35]}
          fontSize={32}
          fontWeight={700}
          fill={BLUE}
          fontFamily={SANS}
          text={'数据密集型'}
        />
        <Txt
          position={[0, 35]}
          fontSize={22}
          fill={'#E2E8F0'}
          fontFamily={SANS}
          text={'瓶颈是数据量 · 复杂度\n变化速度'}
        />
      </Rect>
      {/* 中央应用图标 */}
      <Circle
        ref={app}
        position={[0, -30]}
        size={110}
        fill={BLUE}
        opacity={0}
      >
        <Txt
          fontSize={30}
          fontWeight={700}
          fill={'#0F172A'}
          fontFamily={SANS}
          text={'应用'}
        />
      </Circle>
      {/* 五条连线 + 五个构件 */}
      {BLOCKS.map((b, i) => (
        <Line
          key={`l${i}`}
          ref={lineRefs[i]}
          points={[
            [0, 30],
            [b.x, 120],
          ]}
          stroke={LINE}
          lineWidth={3}
          opacity={0}
        />
      ))}
      {BLOCKS.map((b, i) => (
        <Rect
          key={`b${i}`}
          ref={blockRefs[i]}
          position={[b.x, 170]}
          width={210}
          height={100}
          radius={14}
          fill={CARD}
          stroke={BLUE}
          lineWidth={2}
          opacity={0}
        >
          <Txt
            position={[0, -22]}
            fontSize={24}
            fontWeight={700}
            fill={'#FFFFFF'}
            fontFamily={SANS}
            text={b.title}
          />
          <Txt
            position={[0, 24]}
            fontSize={18}
            fill={SLATE}
            fontFamily={SANS}
            text={b.sub}
          />
        </Rect>
      ))}
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
          position={[0, -50]}
          fontSize={36}
          fontWeight={700}
          fill={'#FFFFFF'}
          fontFamily={SERIF}
          text={'不用从零写存储引擎，'}
        />
        <Txt
          position={[0, 40]}
          fontSize={36}
          fontWeight={700}
          fill={GREEN}
          fontFamily={SERIF}
          text={'数据库就是现成的工具。'}
        />
      </Rect>
    </>,
  );

  const say = (text: string) => narration().text(text);

  // 0–0.5s 标题淡入
  yield* title().opacity(1, 0.5);

  // 0.5–8s 左右对照卡（7.5s）
  say('先分清两种应用：计算密集型瓶颈是 CPU，\n数据密集型瓶颈是数据本身。');
  yield* all(cardCpu().opacity(1, 0.8), cardData().opacity(1, 0.8));
  yield* waitFor(6.7);

  // 8–30s 中央应用向外长出五个构件（22s：应用 1.0 + 每块 4.2）
  say('一个数据密集型应用，是把五种现成构件拼起来。');
  yield* all(cardCpu().opacity(0, 0.5), cardData().opacity(0, 0.5));
  yield* app().opacity(1, 0.5);
  for (let i = 0; i < BLOCKS.length; i++) {
    yield* all(
      lineRefs[i]().opacity(1, 0.6),
      blockRefs[i]().opacity(1, 0.6),
    );
    yield* waitFor(3.6);
  }

  // 30–45s 收尾卡（14.5s + 淡出 0.5s）
  say('不用从零写存储引擎，数据库就是现成的工具。');
  yield* all(
    app().opacity(0, 0.8),
    ...lineRefs.map(r => r().opacity(0, 0.8)),
    ...blockRefs.map(r => r().opacity(0, 0.8)),
  );
  yield* closing().opacity(1, 0.8);
  yield* waitFor(12.9);
  yield* all(
    title().opacity(0, 0.5),
    narration().opacity(0, 0.5),
    closing().opacity(0, 0.5),
  );
});
