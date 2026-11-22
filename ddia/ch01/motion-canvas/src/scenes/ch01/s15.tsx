import {Circle, Line, Rect, Txt, View2D, makeScene2D} from '@motion-canvas/2d';
import {createRef, waitFor} from '@motion-canvas/core';
import {all} from '@motion-canvas/core/lib/flow';

// 1.5 人为错误（45s）
// 时间轴：标题 0.5 + 输错配置 9.5 (=10) + 三道防线 22 (=32) + 收尾 13 (=45)
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

const DEFENSES = [
  {x: -400, title: '沙盒演练', desc: '非生产沙盒，用真实数据安全试'},
  {x: 0, title: '好抽象与界面', desc: '做对的事容易，做错的事难'},
  {x: 400, title: '一键回滚', desc: '出事立刻回到上一版'},
];

export default makeScene2D(function* (view: View2D) {
  view.add(<Rect width={1280} height={720} fill={BG} />);
  view.fill(BG);

  const title = createRef<Txt>();
  const narration = createRef<Txt>();
  const operator = createRef<Circle>();
  const arrow = createRef<Line>();
  const config = createRef<Rect>();
  const alert = createRef<Txt>();
  const closing = createRef<Rect>();
  const cardRefs = DEFENSES.map(() => createRef<Rect>());
  const checkRefs = DEFENSES.map(() => createRef<Txt>());

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
        text={'第 1 章 · 1.5 人为错误'}
      />
      <Txt
        ref={narration}
        position={[0, 308]}
        fontSize={26}
        fill={'#E2E8F0'}
        fontFamily={SANS}
        text={''}
      />
      {/* 操作员输错配置 */}
      <Circle
        ref={operator}
        position={[-380, -60]}
        size={130}
        fill={BLUE}
        opacity={0}
      >
        <Txt
          fontSize={28}
          fontWeight={700}
          fill={'#0F172A'}
          fontFamily={SANS}
          text={'操作员'}
        />
      </Circle>
      <Line
        ref={arrow}
        points={[
          [-300, -60],
          [-60, -60],
        ]}
        stroke={LINE}
        lineWidth={3}
        endArrow
        opacity={0}
      />
      <Rect
        ref={config}
        position={[250, -60]}
        width={560}
        height={130}
        radius={14}
        fill={CARD}
        stroke={LINE}
        lineWidth={2}
        opacity={0}
      >
        <Txt
          position={[0, -20]}
          fontSize={24}
          fill={'#E2E8F0'}
          fontFamily={SANS}
          text={'配置：max_connections = 10000'}
        />
        <Txt
          position={[0, 30]}
          fontSize={20}
          fill={SLATE}
          fontFamily={SANS}
          text={'本应是 1000，多打了一个 0'}
        />
      </Rect>
      <Txt
        ref={alert}
        position={[0, 120]}
        fontSize={32}
        fontWeight={700}
        fill={RED}
        fontFamily={SANS}
        opacity={0}
        text={'告警：配置错误！'}
      />
      {/* 三道防线 */}
      {DEFENSES.map((d, i) => (
        <Rect
          key={String(i)}
          ref={cardRefs[i]}
          position={[d.x, 40]}
          width={360}
          height={220}
          radius={18}
          fill={CARD}
          stroke={GREEN}
          lineWidth={2}
          opacity={0}
        >
          <Txt
            ref={checkRefs[i]}
            position={[0, -70]}
            fontSize={40}
            fontWeight={700}
            fill={GREEN}
            fontFamily={SANS}
            opacity={0}
            text={'✓'}
          />
          <Txt
            position={[0, -10]}
            fontSize={28}
            fontWeight={700}
            fill={'#FFFFFF'}
            fontFamily={SANS}
            text={d.title}
          />
          <Txt
            position={[0, 50]}
            fontSize={20}
            fill={SLATE}
            fontFamily={SANS}
            text={d.desc}
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
          position={[0, 0]}
          fontSize={36}
          fontWeight={700}
          fill={'#FFFFFF'}
          fontFamily={SERIF}
          text={'好的系统让人难犯错、易纠错。'}
        />
      </Rect>
    </>,
  );

  const say = (text: string) => narration().text(text);

  // 0–0.5s 标题淡入
  yield* title().opacity(1, 0.5);

  // 0–10s 操作员输错配置，告警亮起（9.5s）
  say('还有一类故障经常被低估：人犯的错。\n配错一个配置，系统就可能出事。');
  yield* operator().opacity(1, 0.8);
  yield* arrow().opacity(1, 0.8);
  yield* config().opacity(1, 0.8);
  yield* config().fill('#991B1B', 0.5);
  yield* alert().opacity(1, 0.5);
  yield* waitFor(6.1);

  // 10–32s 三道防线依次升起打勾（22s：每道 6.8 + 尾停 1.6）
  say('不要只责备人，要减少犯错的机会：\n沙盒演练、好抽象与界面、一键回滚。');
  yield* all(
    operator().opacity(0, 0.5),
    arrow().opacity(0, 0.5),
    config().opacity(0, 0.5),
    alert().opacity(0, 0.5),
  );
  for (let i = 0; i < DEFENSES.length; i++) {
    yield* all(
      cardRefs[i]().opacity(1, 0.8),
      checkRefs[i]().opacity(1, 0.4),
    );
    yield* waitFor(6.0);
  }
  yield* waitFor(1.1);

  // 32–45s 收尾卡（12.5s + 淡出 0.5s）
  say('再加上监控和培训，好系统让人难犯错、易纠错。');
  yield* all(...cardRefs.map(r => r().opacity(0, 0.8)));
  yield* closing().opacity(1, 0.8);
  yield* waitFor(10.9);
  yield* all(
    title().opacity(0, 0.5),
    narration().opacity(0, 0.5),
    closing().opacity(0, 0.5),
  );
});
