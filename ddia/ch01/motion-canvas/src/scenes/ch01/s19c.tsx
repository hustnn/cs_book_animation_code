import {Rect, Txt, View2D, makeScene2D} from '@motion-canvas/2d';
import {createRef, waitFor} from '@motion-canvas/core';
import {all} from '@motion-canvas/core/lib/flow';

// 1.9b 尾部延迟放大（45s，补 Figure 1-5）
// 时间轴：标题 0.5 + 7 个后端亮起 7.5 (=8) + 耗时条依次长出 14.7 (=22.7)
//   + 终端总耗时条 9.3 (=32) + 收尾卡 13 (=45.0)
// Figure 1-5（原书 p.17）：一个终端请求并行调用 7 个后端，耗时分别为
//   92、76、103、143、86、487、133 毫秒；最慢的 Backend 6（487ms）决定了
//   整个终端请求的快慢。哪怕只有一小部分后端调用变慢，终端请求变慢的
//   比例也会被放大——尾部延迟放大（tail latency amplification）。
// 条形比例：0.9 px/ms，487ms → 438px。
const BG = '#0F172A';
const CARD = '#1E293B';
const GREEN = '#34D399';
const BLUE = '#38BDF8';
const RED = '#F87171';
const SLATE = '#94A3B8';
const SANS = '"Noto Sans CJK SC", sans-serif';
const SERIF = '"Noto Serif CJK SC", serif';

const START_X = -430;
const PX_PER_MS = 0.9;
const BACKENDS = [
  {name: 'Backend 1', ms: 92},
  {name: 'Backend 2', ms: 76},
  {name: 'Backend 3', ms: 103},
  {name: 'Backend 4', ms: 143},
  {name: 'Backend 5', ms: 86},
  {name: 'Backend 6', ms: 487},
  {name: 'Backend 7', ms: 133},
];
const ROW_Y = [-170, -120, -70, -20, 30, 80, 130];
const barWidth = (ms: number) => Math.round(ms * PX_PER_MS);
const barEndX = (ms: number) => START_X + barWidth(ms);

export default makeScene2D(function* (view: View2D) {
  view.add(<Rect width={1280} height={720} fill={BG} />);
  view.fill(BG);

  const title = createRef<Txt>();
  const narration = createRef<Txt>();
  const totalLabel = createRef<Txt>();
  const totalBar = createRef<Rect>();
  const totalMs = createRef<Txt>();
  const nameRefs = BACKENDS.map(() => createRef<Txt>());
  const barRefs = BACKENDS.map(() => createRef<Rect>());
  const msRefs = BACKENDS.map(() => createRef<Txt>());
  const closing = createRef<Rect>();

  view.add(
    <>
      <Txt
        ref={title}
        position={[0, -322]}
        fontSize={36}
        fontWeight={700}
        fill={'#FFFFFF'}
        fontFamily={SERIF}
        opacity={0}
        text={'第 1 章 · 1.9b 尾部延迟放大'}
      />
      <Txt
        ref={narration}
        position={[0, 308]}
        fontSize={26}
        fill={'#E2E8F0'}
        fontFamily={SANS}
        text={''}
      />
      {/* 终端请求总耗时条 */}
      <Txt
        ref={totalLabel}
        position={[-580, -245]}
        fontSize={22}
        fontWeight={700}
        fill={'#FFFFFF'}
        fontFamily={SANS}
        opacity={0}
        text={'终端请求'}
      />
      <Rect
        ref={totalBar}
        position={[START_X, -245]}
        width={0}
        height={30}
        radius={6}
        fill={RED}
        opacity={0}
      />
      <Txt
        ref={totalMs}
        position={[80, -245]}
        fontSize={24}
        fontWeight={700}
        fill={RED}
        fontFamily={SANS}
        opacity={0}
        text={'487 ms'}
      />
      {/* 7 个后端耗时条 */}
      {BACKENDS.map((b, i) => (
        <Txt
          key={'n' + String(i)}
          ref={nameRefs[i]}
          position={[-580, ROW_Y[i]]}
          fontSize={22}
          fill={i === 5 ? RED : '#FFFFFF'}
          fontWeight={i === 5 ? 700 : 400}
          fontFamily={SANS}
          opacity={0}
          text={b.name}
        />
      ))}
      {BACKENDS.map((b, i) => (
        <Rect
          key={'b' + String(i)}
          ref={barRefs[i]}
          position={[START_X, ROW_Y[i]]}
          width={0}
          height={26}
          radius={6}
          fill={i === 5 ? RED : BLUE}
          opacity={0}
        />
      ))}
      {BACKENDS.map((b, i) => (
        <Txt
          key={'m' + String(i)}
          ref={msRefs[i]}
          position={[barEndX(b.ms) + 48, ROW_Y[i]]}
          fontSize={22}
          fontWeight={i === 5 ? 700 : 400}
          fill={i === 5 ? RED : SLATE}
          fontFamily={SANS}
          opacity={0}
          text={b.ms + ' ms'}
        />
      ))}
      {/* 收尾卡 */}
      <Rect
        ref={closing}
        position={[0, 205]}
        width={1060}
        height={100}
        radius={18}
        fill={CARD}
        stroke={RED}
        lineWidth={3}
        opacity={0}
      >
        <Txt
          fontSize={32}
          fontWeight={700}
          fill={RED}
          fontFamily={SANS}
          text={'一个慢调用，拖慢整个请求'}
        />
      </Rect>
    </>,
  );

  const say = (text: string) => narration().text(text);

  // 0–0.5s 标题淡入
  yield* title().opacity(1, 0.5);

  // 0.5–8s：7 个后端亮起（7.5s）
  say('一个终端请求，要并行调用 7 个后端。');
  yield* all(...nameRefs.map(r => r().opacity(1, 0.8)));
  yield* totalLabel().opacity(1, 0.5);
  yield* waitFor(6.2);

  // 8–22.7s：耗时条依次长出（每根 2.1s × 7 = 14.7s）
  say('每个后端耗时不同，条越长，等得越久。');
  for (let i = 0; i < BACKENDS.length; i++) {
    const w = barWidth(BACKENDS[i].ms);
    yield* all(
      barRefs[i]().opacity(1, 0.3),
      barRefs[i]().width(w, 1.6),
      barRefs[i]().position([START_X + w / 2, ROW_Y[i]], 1.6),
    );
    yield* msRefs[i]().opacity(1, 0.5);
  }

  // 22.7–32s：终端总耗时条长到 487ms（9.3s）
  say('终端请求的总耗时，就是最慢的那个后端：\nBackend 6，487 毫秒。');
  yield* all(
    totalBar().opacity(1, 0.3),
    totalBar().width(barWidth(487), 2.0),
    totalBar().position([START_X + barWidth(487) / 2, -245], 2.0),
  );
  yield* totalMs().opacity(1, 0.5);
  yield* waitFor(6.8);

  // 32–45s：收尾卡（12.5s + 淡出 0.5s）
  say('哪怕只有一小部分调用变慢，\n终端变慢的比例也会被放大。');
  yield* closing().opacity(1, 0.8);
  yield* waitFor(11.7);
  yield* all(
    title().opacity(0, 0.5),
    narration().opacity(0, 0.5),
    closing().opacity(0, 0.5),
  );
});
