import {Line, Rect, Txt, View2D, makeScene2D} from '@motion-canvas/2d';
import {createRef, waitFor} from '@motion-canvas/core';
import {all} from '@motion-canvas/core/lib/flow';
import {ServerNode} from '../../components/ServerNode';

// 1.2 可靠性（60s）
// 时间轴：标题 0.5 + 定义卡 9.5 (=10) + 链路绕行 25 (=35)
//        + 备用也坏 15 (=50) + 收尾 10 (=60)
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

export default makeScene2D(function* (view: View2D) {
  view.add(<Rect width={1280} height={720} fill={BG} />);
  view.fill(BG);

  const title = createRef<Txt>();
  const narration = createRef<Txt>();
  const defCard = createRef<Rect>();
  const note = createRef<Txt>();
  const closing = createRef<Rect>();
  const client = createRef<ServerNode>();
  const service = createRef<ServerNode>();
  const db = createRef<ServerNode>();
  const backup = createRef<ServerNode>();
  const lineCS = createRef<Line>();
  const lineSD = createRef<Line>();
  const lineBypass = createRef<Line>();

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
        text={'第 1 章 · 1.2 可靠性'}
      />
      <Txt
        ref={narration}
        position={[0, 308]}
        fontSize={26}
        fill={'#E2E8F0'}
        fontFamily={SANS}
        text={''}
      />
      {/* 定义卡 */}
      <Rect
        ref={defCard}
        position={[0, -40]}
        width={900}
        height={220}
        radius={24}
        fill={CARD}
        stroke={LINE}
        lineWidth={2}
        opacity={0}
      >
        <Txt
          position={[0, -50]}
          fontSize={44}
          fontWeight={700}
          fill={'#FFFFFF'}
          fontFamily={SERIF}
          text={'故障 ≠ 失效'}
        />
        <Txt
          position={[0, 50]}
          fontSize={24}
          fill={SLATE}
          fontFamily={SANS}
          text={'故障：零件偏离预期 · 失效：整个系统停了服务'}
        />
      </Rect>
      {/* 请求链路 */}
      <Line
        ref={lineCS}
        points={[
          [-310, -40],
          [-190, -40],
        ]}
        stroke={LINE}
        lineWidth={3}
        endArrow
        opacity={0}
      />
      <Line
        ref={lineSD}
        points={[
          [110, -40],
          [230, -40],
        ]}
        stroke={LINE}
        lineWidth={3}
        endArrow
        opacity={0}
      />
      <Line
        ref={lineBypass}
        points={[
          [110, -40],
          [230, 180],
        ]}
        stroke={GREEN}
        lineWidth={3}
        endArrow
        opacity={0}
      />
      <ServerNode
        ref={client}
        position={[-460, -40]}
        title={'客户端'}
        role={'应用 · 发请求'}
        initialValue={'请求'}
        accent={BLUE}
        opacity={0}
      />
      <ServerNode
        ref={service}
        position={[-40, -40]}
        title={'服务'}
        role={'应用服务'}
        initialValue={'处理中'}
        accent={BLUE}
        initialStatus={'运行中'}
        statusColor={GREEN}
        opacity={0}
      />
      <ServerNode
        ref={db}
        position={[380, -40]}
        title={'数据库'}
        role={'主库 · 存数据'}
        initialValue={'数据'}
        accent={GREEN}
        initialStatus={'运行中'}
        statusColor={GREEN}
        opacity={0}
      />
      <ServerNode
        ref={backup}
        position={[380, 180]}
        title={'备用数据库'}
        role={'Standby · 待命'}
        initialValue={'待命'}
        accent={'#64748B'}
        initialStatus={'待命'}
        statusColor={SLATE}
        opacity={0}
      />
      <Txt
        ref={note}
        position={[0, 250]}
        fontSize={28}
        fontWeight={700}
        fill={GREEN}
        fontFamily={SANS}
        opacity={0}
        text={''}
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
          text={'容错 = 预见并容忍特定类型的故障。'}
        />
      </Rect>
    </>,
  );

  const say = (text: string) => narration().text(text);

  // 0–0.5s 标题淡入
  yield* title().opacity(1, 0.5);

  // 0–10s 定义卡（9.5s）
  say('可靠是什么意思？先分清两个词：\n故障，是零件偏离预期；失效，是整个系统停了服务。');
  yield* defCard().opacity(1, 0.8);
  yield* waitFor(8.7);

  // 10–35s 链路绕行备用节点（25s）
  say('数据库出了故障，但链路绕行备用节点，\n系统继续正确工作。');
  yield* defCard().opacity(0, 0.5);
  yield* all(
    client().opacity(1, 1.0),
    service().opacity(1, 1.0),
    db().opacity(1, 1.0),
    lineCS().opacity(1, 1.0),
    lineSD().opacity(1, 1.0),
  );
  yield* db().setStatus('故障 ✗', RED, 0.5);
  yield* lineBypass().opacity(1, 0.8);
  yield* backup().opacity(1, 0.8);
  note().text('系统继续正确工作 ✓');
  yield* note().opacity(1, 0.5);
  yield* waitFor(20.9);

  // 35–50s 备用节点也坏，整体失效（15s）
  say('一个零件坏，不等于系统停；\n但备用节点也坏了，系统就失效了。');
  yield* backup().setStatus('故障 ✗', RED, 0.5);
  note().text('系统失效 ✗');
  yield* note().fill(RED, 0.5);
  yield* waitFor(14.0);

  // 50–60s 收尾卡（9.5s + 淡出 0.5s）
  say('可靠的系统不是不出故障，而是出了故障还能工作。');
  yield* all(
    client().opacity(0, 0.8),
    service().opacity(0, 0.8),
    db().opacity(0, 0.8),
    backup().opacity(0, 0.8),
    lineCS().opacity(0, 0.8),
    lineSD().opacity(0, 0.8),
    lineBypass().opacity(0, 0.8),
    note().opacity(0, 0.8),
  );
  yield* closing().opacity(1, 0.8);
  yield* waitFor(7.9);
  yield* all(
    title().opacity(0, 0.5),
    narration().opacity(0, 0.5),
    closing().opacity(0, 0.5),
  );
});
