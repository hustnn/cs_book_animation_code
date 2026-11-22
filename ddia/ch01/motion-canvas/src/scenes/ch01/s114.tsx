import {Line, Rect, Txt, View2D, makeScene2D} from '@motion-canvas/2d';
import {createRef, waitFor} from '@motion-canvas/core';
import {all} from '@motion-canvas/core/lib/flow';

// 1.14 可演化性（45s）
// 时间轴：标题 0.5 + 时间轴 v1→v2→v3 11.5 (=12) + schema 演进 20 (=32)
//        + 下一章卡片 13 (=45)
const BG = '#0F172A';
const CARD = '#1E293B';
const GREEN = '#34D399';
const BLUE = '#38BDF8';
const YELLOW = '#FBBF24';
const SLATE = '#94A3B8';
const LINE = '#475569';
const SANS = '"Noto Sans CJK SC", sans-serif';
const SERIF = '"Noto Serif CJK SC", serif';

const VERSIONS = [
  {x: -400, title: 'v1', desc: '初始需求'},
  {x: 0, title: 'v2', desc: '加字段'},
  {x: 400, title: 'v3', desc: '业务换了'},
];

export default makeScene2D(function* (view: View2D) {
  view.add(<Rect width={1280} height={720} fill={BG} />);
  view.fill(BG);

  const title = createRef<Txt>();
  const narration = createRef<Txt>();
  const timeline = createRef<Line>();
  const schemaV1 = createRef<Rect>();
  const schemaV2 = createRef<Rect>();
  const oldNote = createRef<Txt>();
  const nextCard = createRef<Rect>();
  const verRefs = VERSIONS.map(() => createRef<Rect>());

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
        text={'第 1 章 · 1.14 可演化性'}
      />
      <Txt
        ref={narration}
        position={[0, 308]}
        fontSize={26}
        fill={'#E2E8F0'}
        fontFamily={SANS}
        text={''}
      />
      {/* 时间轴 */}
      <Line
        ref={timeline}
        points={[
          [-520, -160],
          [520, -160],
        ]}
        stroke={LINE}
        lineWidth={3}
        opacity={0}
      />
      {VERSIONS.map((v, i) => (
        <Rect
          key={String(i)}
          ref={verRefs[i]}
          position={[v.x, -40]}
          width={300}
          height={150}
          radius={14}
          fill={CARD}
          stroke={BLUE}
          lineWidth={2}
          opacity={0}
        >
          <Txt
            position={[0, -25]}
            fontSize={32}
            fontWeight={700}
            fill={'#FFFFFF'}
            fontFamily={SANS}
            text={v.title}
          />
          <Txt
            position={[0, 30]}
            fontSize={22}
            fill={SLATE}
            fontFamily={SANS}
            text={v.desc}
          />
        </Rect>
      ))}
      {/* schema 演进：新旧版本并排 */}
      <Rect
        ref={schemaV1}
        position={[-320, 140]}
        width={520}
        height={180}
        radius={14}
        fill={CARD}
        stroke={LINE}
        lineWidth={2}
        opacity={0}
      >
        <Txt
          position={[0, -55]}
          fontSize={24}
          fontWeight={700}
          fill={SLATE}
          fontFamily={SANS}
          text={'schema v1'}
        />
        <Txt
          position={[0, 0]}
          fontSize={22}
          fill={'#E2E8F0'}
          fontFamily={SANS}
          text={'name: string'}
        />
        <Txt
          position={[0, 45]}
          fontSize={22}
          fill={'#E2E8F0'}
          fontFamily={SANS}
          text={'age: int'}
        />
      </Rect>
      <Rect
        ref={schemaV2}
        position={[320, 140]}
        width={520}
        height={180}
        radius={14}
        fill={CARD}
        stroke={GREEN}
        lineWidth={2}
        opacity={0}
      >
        <Txt
          position={[0, -55]}
          fontSize={24}
          fontWeight={700}
          fill={GREEN}
          fontFamily={SANS}
          text={'schema v2'}
        />
        <Txt
          position={[0, -10]}
          fontSize={22}
          fill={'#E2E8F0'}
          fontFamily={SANS}
          text={'name: string · age: int'}
        />
        <Txt
          position={[0, 35]}
          fontSize={22}
          fontWeight={700}
          fill={YELLOW}
          fontFamily={SANS}
          text={'email: string（新增）· 类型放宽'}
        />
      </Rect>
      <Txt
        ref={oldNote}
        position={[0, 260]}
        fontSize={24}
        fontWeight={700}
        fill={GREEN}
        fontFamily={SANS}
        opacity={0}
        text={'旧数据仍能读 ✓ 新旧版本并排共存'}
      />
      {/* 下一章卡片 */}
      <Rect
        ref={nextCard}
        position={[0, -20]}
        width={900}
        height={220}
        radius={24}
        fill={CARD}
        stroke={BLUE}
        lineWidth={3}
        opacity={0}
      >
        <Txt
          position={[0, -45]}
          fontSize={36}
          fontWeight={700}
          fill={'#FFFFFF'}
          fontFamily={SERIF}
          text={'格式怎么演进？'}
        />
        <Txt
          position={[0, 45]}
          fontSize={32}
          fontWeight={700}
          fill={BLUE}
          fontFamily={SANS}
          text={'见第 4 章 →'}
        />
      </Rect>
    </>,
  );

  const say = (text: string) => narration().text(text);

  // 0–0.5s 标题淡入
  yield* title().opacity(1, 0.5);

  // 0–12s 时间轴上需求卡片 v1→v2→v3 不断出现（11.5s）
  say('需求一定会变：今天要这个字段，\n明天要那个功能，后天整个业务都换了。');
  yield* timeline().opacity(1, 0.5);
  for (let i = 0; i < VERSIONS.length; i++) {
    yield* verRefs[i]().opacity(1, 0.6);
    yield* waitFor(1.5);
  }
  yield* waitFor(4.7);

  // 12–32s schema 跟着演进（20s）
  say('系统要能跟着变，而且越变越不费劲。\n字段增加、类型放宽，旧数据仍能读。');
  yield* schemaV1().opacity(1, 0.8);
  yield* schemaV2().opacity(1, 0.8);
  yield* oldNote().opacity(1, 0.5);
  yield* waitFor(17.9);

  // 32–45s 箭头指向下一章卡片（12.5s + 淡出 0.5s）
  say('具体怎么让格式演进，我们到第四章再细讲。');
  yield* all(
    timeline().opacity(0, 0.8),
    schemaV1().opacity(0, 0.8),
    schemaV2().opacity(0, 0.8),
    oldNote().opacity(0, 0.8),
    ...verRefs.map(r => r().opacity(0, 0.8)),
  );
  yield* nextCard().opacity(1, 0.8);
  yield* waitFor(10.9);
  yield* all(
    title().opacity(0, 0.5),
    narration().opacity(0, 0.5),
    nextCard().opacity(0, 0.5),
  );
});
