import {Circle, Line, Rect, Txt, View2D, makeScene2D} from '@motion-canvas/2d';
import {createRef, createSignal, tween, waitFor} from '@motion-canvas/core';
import {all, chain} from '@motion-canvas/core/lib/flow';
import {ServerNode} from '../components/ServerNode';

// 统一视觉
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

// 拓扑坐标（1280x720，中心为原点）
const CLIENT_POS: [number, number] = [-470, -30];
const LEADER_POS: [number, number] = [-60, -30];
const FOLLOWER_A_POS: [number, number] = [330, -180];
const FOLLOWER_B_POS: [number, number] = [330, 90];

export default makeScene2D(function* (view: View2D) {
  // ---------- 背景 ----------
  view.add(<Rect width={1280} height={720} fill={BG} />);
  view.fill(BG);

  // ---------- 标题 / 步骤 / 旁白 ----------
  const title = createRef<Txt>();
  const step = createRef<Txt>();
  const narration = createRef<Txt>();
  const lagBadge = createRef<Txt>();
  const alertText = createRef<Txt>();
  const okText = createRef<Txt>();
  const lag = createSignal(0);

  view.add(
    <>
      <Txt
        ref={title}
        position={[0, -322]}
        fontSize={38}
        fontWeight={700}
        fill={'#FFFFFF'}
        fontFamily={SERIF}
        text={'第 5 章 · 主从复制延迟'}
      />
      <Txt
        ref={step}
        position={[440, -322]}
        fontSize={20}
        fill={YELLOW}
        fontFamily={SANS}
        text={''}
      />
      {/* 复制延迟计数 */}
      <Txt
        ref={lagBadge}
        position={[0, -268]}
        fontSize={26}
        fontWeight={700}
        fill={YELLOW}
        fontFamily={SANS}
        opacity={0}
        text={() => `复制延迟 ${Math.round(lag())} ms`}
      />
      {/* 底部旁白条 */}
      <Txt
        ref={narration}
        position={[0, 308]}
        fontSize={28}
        fill={'#E2E8F0'}
        fontFamily={SANS}
        text={''}
      />
    </>,
  );

  const say = (text: string) => narration().text(text);
  const setStep = (text: string) => step().text(text);

  // ---------- 拓扑 ----------
  const client = createRef<ServerNode>();
  const leader = createRef<ServerNode>();
  const followerA = createRef<ServerNode>();
  const followerB = createRef<ServerNode>();
  const lineCL = createRef<Line>();
  const lineLA = createRef<Line>();
  const lineLB = createRef<Line>();

  view.add(
    <>
      <Line
        ref={lineCL}
        points={[
          [CLIENT_POS[0] + 150, CLIENT_POS[1]],
          [LEADER_POS[0] - 150, LEADER_POS[1]],
        ]}
        stroke={LINE}
        lineWidth={3}
        endArrow
        opacity={0}
      />
      <Line
        ref={lineLA}
        points={[
          [LEADER_POS[0] + 150, LEADER_POS[1]],
          [FOLLOWER_A_POS[0] - 150, FOLLOWER_A_POS[1]],
        ]}
        stroke={LINE}
        lineWidth={3}
        endArrow
        opacity={0}
      />
      <Line
        ref={lineLB}
        points={[
          [LEADER_POS[0] + 150, LEADER_POS[1]],
          [FOLLOWER_B_POS[0] - 150, FOLLOWER_B_POS[1]],
        ]}
        stroke={LINE}
        lineWidth={3}
        endArrow
        opacity={0}
      />
      <ServerNode
        ref={client}
        position={CLIENT_POS}
        title={'客户端'}
        role={'应用 · 读写'}
        initialValue={'读写'}
        accent={BLUE}
        opacity={0}
      />
      <ServerNode
        ref={leader}
        position={LEADER_POS}
        title={'主库'}
        role={'Leader · 写'}
        initialValue={'x = 41'}
        accent={GREEN}
        valueColor={'#FFFFFF'}
        initialStatus={'运行中'}
        statusColor={GREEN}
        opacity={0}
      />
      <ServerNode
        ref={followerA}
        position={FOLLOWER_A_POS}
        title={'从库 A'}
        role={'Follower · 读'}
        initialValue={'x = 41'}
        accent={'#64748B'}
        valueColor={'#FFFFFF'}
        initialStatus={'已同步'}
        statusColor={GREEN}
        opacity={0}
      />
      <ServerNode
        ref={followerB}
        position={FOLLOWER_B_POS}
        title={'从库 B'}
        role={'Follower · 读'}
        initialValue={'x = 41'}
        accent={'#64748B'}
        valueColor={'#FFFFFF'}
        initialStatus={'已同步'}
        statusColor={GREEN}
        opacity={0}
      />
    </>,
  );

  // ---------- 数据包 ----------
  const makePacket = (label: string, color: string) => {
    const ref = createRef<Circle>();
    view.add(
      <Circle ref={ref} size={58} fill={color} opacity={0}>
        <Txt
          fontSize={24}
          fontWeight={700}
          fill={'#0F172A'}
          fontFamily={SANS}
          text={label}
        />
      </Circle>,
    );
    return ref;
  };

  function* fly(
    packet: ReturnType<typeof makePacket>,
    from: [number, number],
    to: [number, number],
    duration: number,
  ) {
    packet().position(from);
    yield* packet().opacity(1, 0.2);
    yield* packet().position(to, duration);
    yield* packet().opacity(0, 0.2);
  }

  // ================= 时间轴 =================
  // 0-4s 开场：标题 + 拓扑入场
  yield* title().opacity(0, 0).to(1, 0.8);
  say('第 5 章：主从复制——写进去的数据，多久才能被读到？');
  yield* all(
    client().opacity(1, 0.8),
    leader().opacity(1, 0.8),
    followerA().opacity(1, 0.8),
    followerB().opacity(1, 0.8),
    lineCL().opacity(1, 0.8),
    lineLA().opacity(1, 0.8),
    lineLB().opacity(1, 0.8),
  );
  yield* waitFor(2.5);

  // 4-8s 步骤 1：写主库
  setStep('步骤 1 / 5 · 写主库');
  say('客户端把 x 写成 42，发给主库。');
  const writePacket = makePacket('42', BLUE);
  yield* fly(writePacket, [CLIENT_POS[0] + 150, CLIENT_POS[1]], [LEADER_POS[0] - 150, LEADER_POS[1]], 1.2);
  yield* all(
    leader().setValue('x = 42', GREEN, 0.5),
    leader().setStatus('已更新', GREEN, 0.4),
  );
  say('主库立刻更新：x = 42。');
  yield* waitFor(2.2);

  // 8-14s 步骤 2：复制还没追上
  setStep('步骤 2 / 5 · 复制中');
  say('复制开始了，但还没追上从库。');
  yield* lagBadge().opacity(1, 0.4);
  const repA = makePacket('42', BLUE);
  const repB = makePacket('42', BLUE);
  yield* all(
    tween(2.2, v => lag(180 * v)),
    fly(repA, [LEADER_POS[0] + 150, LEADER_POS[1]], [FOLLOWER_A_POS[0] - 150, FOLLOWER_A_POS[1]], 1.8),
    chain(
      waitFor(0.4),
      fly(repB, [LEADER_POS[0] + 150, LEADER_POS[1]], [FOLLOWER_B_POS[0] - 150, FOLLOWER_B_POS[1]], 1.8),
    ),
  );
  // 复制包“还在路上”：从库仍是旧值
  yield* all(
    followerA().setStatus('旧值', RED, 0.4),
    followerB().setStatus('旧值', RED, 0.4),
    followerA().valueText().fill(RED, 0.4),
    followerB().valueText().fill(RED, 0.4),
  );
  say('这时从库里还是旧值：x = 41。');
  yield* waitFor(2.4);

  // 14-21s 步骤 3：立刻读从库，读到旧值
  setStep('步骤 3 / 5 · 立刻读从库');
  say('如果现在立刻读从库，会发生什么？');
  const readPacket = makePacket('读', RED);
  yield* fly(readPacket, [CLIENT_POS[0] + 150, CLIENT_POS[1] + 40], [FOLLOWER_A_POS[0] - 150, FOLLOWER_A_POS[1]], 1.2);
  const readBack = makePacket('41', RED);
  yield* fly(readBack, [FOLLOWER_A_POS[0] - 150, FOLLOWER_A_POS[1]], [CLIENT_POS[0] + 150, CLIENT_POS[1] + 40], 1.2);
  view.add(
    <Txt
      ref={alertText}
      position={[0, 210]}
      fontSize={56}
      fontWeight={700}
      fill={RED}
      fontFamily={SERIF}
      opacity={0}
      text={'读到旧值！x = 41'}
    />,
  );
  yield* alertText().opacity(1, 0.3);
  yield* alertText().scale(1.12, 0.2).to(1, 0.25);
  say('读到了旧值 x = 41——这就是复制延迟。');
  yield* waitFor(3.5);

  // 21-27s 步骤 4：复制追上
  yield* alertText().opacity(0, 0.4);
  setStep('步骤 4 / 5 · 复制追上');
  say('等一等，复制追上了。');
  lagBadge().text('复制完成 ✓');
  yield* all(
    followerA().setValue('x = 42', GREEN, 0.5),
    followerA().setStatus('已同步', GREEN, 0.4),
  );
  yield* waitFor(0.4);
  yield* all(
    followerB().setValue('x = 42', GREEN, 0.5),
    followerB().setStatus('已同步', GREEN, 0.4),
  );
  say('从库 A 和从库 B 都变成了 x = 42。');
  yield* waitFor(2.2);

  // 27-33s 步骤 5：再读一次
  setStep('步骤 5 / 5 · 再读一次');
  say('再读一次——');
  const readPacket2 = makePacket('读', GREEN);
  yield* fly(readPacket2, [CLIENT_POS[0] + 150, CLIENT_POS[1] + 40], [FOLLOWER_A_POS[0] - 150, FOLLOWER_A_POS[1]], 1.2);
  const readBack2 = makePacket('42', GREEN);
  yield* fly(readBack2, [FOLLOWER_A_POS[0] - 150, FOLLOWER_A_POS[1]], [CLIENT_POS[0] + 150, CLIENT_POS[1] + 40], 1.2);
  view.add(
    <Txt
      ref={okText}
      position={[0, 210]}
      fontSize={56}
      fontWeight={700}
      fill={GREEN}
      fontFamily={SERIF}
      opacity={0}
      text={'读到新值 x = 42'}
    />,
  );
  yield* okText().opacity(1, 0.3);
  say('这次读到的，就是正确的新值 x = 42。');
  yield* waitFor(3.0);

  // 33-48s 小结卡片
  yield* all(
    okText().opacity(0, 0.4),
    lagBadge().opacity(0, 0.4),
    step().opacity(0, 0.4),
    client().opacity(0, 0.5),
    leader().opacity(0, 0.5),
    followerA().opacity(0, 0.5),
    followerB().opacity(0, 0.5),
    lineCL().opacity(0, 0.5),
    lineLA().opacity(0, 0.5),
    lineLB().opacity(0, 0.5),
  );
  const card = createRef<Rect>();
  const cardTitle = createRef<Txt>();
  const cardLine1 = createRef<Txt>();
  const cardLine2 = createRef<Txt>();
  view.add(
    <Rect
      ref={card}
      position={[0, 0]}
      width={980}
      height={400}
      radius={24}
      fill={CARD}
      stroke={LINE}
      lineWidth={2}
      opacity={0}
    >
      <Txt
        ref={cardTitle}
        position={[0, -140]}
        fontSize={40}
        fontWeight={700}
        fill={'#FFFFFF'}
        fontFamily={SERIF}
        text={'小结：复制的取舍'}
      />
      <Txt
        ref={cardLine1}
        position={[0, -40]}
        fontSize={32}
        fontWeight={700}
        fill={GREEN}
        fontFamily={SANS}
        text={'异步复制：低延迟，但短暂不一致'}
      />
      <Txt
        ref={cardLine2}
        position={[0, 50]}
        fontSize={32}
        fontWeight={700}
        fill={YELLOW}
        fontFamily={SANS}
        text={'同步复制：强一致，但延迟更高'}
      />
      <Txt
        position={[0, 140]}
        fontSize={24}
        fill={SLATE}
        fontFamily={SANS}
        text={'没有免费的午餐——选哪种复制，就是在选哪种代价。'}
      />
    </Rect>,
  );
  say('异步复制换速度，同步复制换一致性。');
  yield* card().opacity(1, 0.8);
  yield* all(
    cardLine1().scale(1.05, 0.25).to(1, 0.3),
    cardLine2().scale(1.05, 0.25).to(1, 0.3),
  );
  yield* waitFor(8.0);
  yield* waitFor(2.0);
});
