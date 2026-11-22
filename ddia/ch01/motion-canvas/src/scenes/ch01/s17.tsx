import {Circle, Rect, Txt, View2D, makeScene2D} from '@motion-canvas/2d';
import {createRef, waitFor} from '@motion-canvas/core';
import {all} from '@motion-canvas/core/lib/flow';

// 1.7 可扩展性（60s）
// 时间轴：标题 0.5 + 红字卡 9.5 (=10) + 双系统对照 28 (=38) + 收尾 22 (=60)
// 数字（原书 p.17 算例）：左 10 万请求/秒 × 1KB，右 3 请求/分钟 × 2GB，
// 两者吞吐量相同，都是 100 MB/s（10 万 × 1KB = 100 MB/s；3 × 2GB/分钟 = 100 MB/s），
// 顶部同一条吞吐量条“100 MB/s”对齐。
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

// 左系统雨点：12 个小请求，右系统大块：3 个
// 雨点落点 RAIN_END_Y=140：左面板标签在绝对 y=180，雨点须停在其上方，
// 否则圆点会压在“大量小请求 · 分片集群”文字上。
const RAIN_START: [number, number][] = Array.from({length: 12}, (_, i) => [
  -560 + (i % 6) * 88,
  -120 + Math.floor(i / 6) * 60,
] as [number, number]);
const RAIN_END_Y = 140;
const BLOCK_START: [number, number][] = [
  [140, -120],
  [320, -120],
  [500, -120],
];

export default makeScene2D(function* (view: View2D) {
  view.add(<Rect width={1280} height={720} fill={BG} />);
  view.fill(BG);

  const title = createRef<Txt>();
  const narration = createRef<Txt>();
  const warnCard = createRef<Rect>();
  const bar = createRef<Rect>();
  const panelL = createRef<Rect>();
  const panelR = createRef<Rect>();
  const closing = createRef<Rect>();
  const rainRefs = RAIN_START.map(() => createRef<Circle>());
  const blockRefs = BLOCK_START.map(() => createRef<Rect>());

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
        text={'第 1 章 · 1.7 可扩展性'}
      />
      <Txt
        ref={narration}
        position={[0, 308]}
        fontSize={26}
        fill={'#E2E8F0'}
        fontFamily={SANS}
        text={''}
      />
      {/* 红字卡 */}
      <Rect
        ref={warnCard}
        position={[0, -40]}
        width={900}
        height={200}
        radius={24}
        fill={CARD}
        stroke={RED}
        lineWidth={3}
        opacity={0}
      >
        <Txt
          position={[0, 0]}
          fontSize={40}
          fontWeight={700}
          fill={RED}
          fontFamily={SERIF}
          text={'今天可靠 ≠ 未来可靠'}
        />
      </Rect>
      {/* 顶部同一条吞吐量条 */}
      <Rect
        ref={bar}
        position={[0, -250]}
        width={920}
        height={56}
        radius={12}
        fill={CARD}
        stroke={GREEN}
        lineWidth={2}
        opacity={0}
      >
        <Txt
          position={[0, 0]}
          fontSize={28}
          fontWeight={700}
          fill={GREEN}
          fontFamily={SANS}
          text={'吞吐量 100 MB/s'}
        />
      </Rect>
      {/* 左系统：10 万请求/秒 × 1KB */}
      <Rect
        ref={panelL}
        position={[-320, 20]}
        width={560}
        height={380}
        radius={18}
        fill={CARD}
        stroke={BLUE}
        lineWidth={2}
        opacity={0}
      >
        <Txt
          position={[0, -150]}
          fontSize={28}
          fontWeight={700}
          fill={BLUE}
          fontFamily={SANS}
          text={'10 万请求/秒 × 1KB'}
        />
        <Txt
          position={[0, 160]}
          fontSize={22}
          fill={SLATE}
          fontFamily={SANS}
          text={'大量小请求 · 分片集群'}
        />
      </Rect>
      {/* 右系统：3 请求/分钟 × 2GB */}
      <Rect
        ref={panelR}
        position={[320, 20]}
        width={560}
        height={380}
        radius={18}
        fill={CARD}
        stroke={YELLOW}
        lineWidth={2}
        opacity={0}
      >
        <Txt
          position={[0, -150]}
          fontSize={28}
          fontWeight={700}
          fill={YELLOW}
          fontFamily={SANS}
          text={'3 请求/分钟 × 2GB'}
        />
        <Txt
          position={[0, 160]}
          fontSize={22}
          fill={SLATE}
          fontFamily={SANS}
          text={'少量大请求 · 流式处理'}
        />
      </Rect>
      {/* 雨点与大块（初始位置在面板内顶部） */}
      {RAIN_START.map((p, i) => (
        <Circle
          key={String(i)}
          ref={rainRefs[i]}
          position={p}
          size={14}
          fill={BLUE}
          opacity={0}
        />
      ))}
      {BLOCK_START.map((p, i) => (
        <Rect
          key={String(i)}
          ref={blockRefs[i]}
          position={p}
          width={120}
          height={70}
          radius={10}
          fill={YELLOW}
          opacity={0}
        />
      ))}
      {/* 收尾卡 */}
      <Rect
        ref={closing}
        position={[0, -10]}
        width={1080}
        height={260}
        radius={24}
        fill={CARD}
        stroke={GREEN}
        lineWidth={3}
        opacity={0}
      >
        <Txt
          position={[0, -55]}
          fontSize={32}
          fontWeight={700}
          fill={'#FFFFFF'}
          fontFamily={SERIF}
          text={'扩展性 = 应对负载增长的能力；'}
        />
        <Txt
          position={[0, 45]}
          fontSize={32}
          fontWeight={700}
          fill={GREEN}
          fontFamily={SERIF}
          text={'要问：增长时有何选项、如何加资源。'}
        />
      </Rect>
    </>,
  );

  const say = (text: string) => narration().text(text);

  // 0–0.5s 标题淡入
  yield* title().opacity(1, 0.5);

  // 0–10s 红字卡（9.5s）
  say('可扩展性：今天可靠，不等于未来可靠。\n负载从 1 万长到 10 万并发用户，系统就可能退化。');
  yield* warnCard().opacity(1, 0.8);
  yield* waitFor(8.7);

  // 10–38s 双系统对照（28s：入场 1.5 + 3 波雨点/大块各 8.0 + 尾停 2.5）
  say('同样是每秒传 100 兆数据，一个系统是 10 万个请求、每个 1KB，\n另一个是每分钟 3 个请求、每个 2GB——吞吐量一样，架构完全不同。');
  yield* warnCard().opacity(0, 0.5);
  yield* all(
    bar().opacity(1, 0.5),
    panelL().opacity(1, 1.0),
    panelR().opacity(1, 1.0),
  );
  for (let w = 0; w < 3; w++) {
    // 回到顶部，重新落下
    rainRefs.forEach((r, i) => r().position(RAIN_START[i]));
    blockRefs.forEach((r, i) => r().position(BLOCK_START[i]));
    yield* all(
      ...rainRefs.map((r, i) =>
        r().position([RAIN_START[i][0], RAIN_END_Y], 1.8),
      ),
      ...blockRefs.map((r, i) =>
        r().position([BLOCK_START[i][0], 128], 2.2),
      ),
      ...rainRefs.map(r => r().opacity(1, 0.3)),
      ...blockRefs.map(r => r().opacity(1, 0.3)),
    );
    yield* waitFor(5.8);
  }
  yield* waitFor(2.5);

  // 38–60s 收尾卡（21.5s + 淡出 0.5s）
  say('所以别问“X 可不可扩展”——这不是一维标签。\n要问：以某种方式增长时，有何选项、如何加资源。');
  yield* all(
    bar().opacity(0, 0.8),
    panelL().opacity(0, 0.8),
    panelR().opacity(0, 0.8),
    ...rainRefs.map(r => r().opacity(0, 0.8)),
    ...blockRefs.map(r => r().opacity(0, 0.8)),
  );
  yield* closing().opacity(1, 0.8);
  yield* waitFor(19.9);
  yield* all(
    title().opacity(0, 0.5),
    narration().opacity(0, 0.5),
    closing().opacity(0, 0.5),
  );
});
