import {Circle, Line, Rect, Txt, View2D, makeScene2D} from '@motion-canvas/2d';
import {createRef, waitFor} from '@motion-canvas/core';
import {all} from '@motion-canvas/core/lib/flow';
import {ServerNode} from '../../components/ServerNode';

// 1.4 软件错误（60s）
// 时间轴：标题 0.5 + 对比卡 9.5 (=10) + 闰秒扩散 18 (=28)
//        + 级联与隔离墙 20 (=48) + 收尾 12 (=60)
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
  const contrast = createRef<Rect>();
  const timeline = createRef<Line>();
  const marker = createRef<Txt>();
  const bugDot = createRef<Circle>();
  const wall = createRef<Rect>();
  const wallLabel = createRef<Txt>();
  const closing = createRef<Rect>();
  const nodeA = createRef<ServerNode>();
  const nodeB = createRef<ServerNode>();
  const nodeC = createRef<ServerNode>();
  const lineAB = createRef<Line>();
  const lineBC = createRef<Line>();

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
        text={'第 1 章 · 1.4 软件错误'}
      />
      <Txt
        ref={narration}
        position={[0, 308]}
        fontSize={26}
        fill={'#E2E8F0'}
        fontFamily={SANS}
        text={''}
      />
      {/* 对比卡 */}
      <Rect
        ref={contrast}
        position={[0, -40]}
        width={1000}
        height={200}
        radius={24}
        fill={CARD}
        stroke={LINE}
        lineWidth={2}
        opacity={0}
      >
        <Txt
          position={[0, -45]}
          fontSize={32}
          fontWeight={700}
          fill={'#E2E8F0'}
          fontFamily={SANS}
          text={'硬件故障：一次坏一台'}
        />
        <Txt
          position={[0, 45]}
          fontSize={32}
          fontWeight={700}
          fill={RED}
          fontFamily={SANS}
          text={'软件错误：一次坏一片'}
        />
      </Rect>
      {/* 时间线 + 闰秒标记 */}
      <Line
        ref={timeline}
        points={[
          [-520, -200],
          [520, -200],
        ]}
        stroke={LINE}
        lineWidth={3}
        opacity={0}
      />
      <Txt
        ref={marker}
        position={[0, -250]}
        fontSize={28}
        fontWeight={700}
        fill={YELLOW}
        fontFamily={SANS}
        opacity={0}
        text={'2012 年 6 月 30 日闰秒'}
      />
      <Circle
        ref={bugDot}
        position={[0, -200]}
        size={26}
        fill={RED}
        opacity={0}
      />
      {/* 三台机器 + 级联连线 */}
      <Line
        ref={lineAB}
        points={[
          [-250, 0],
          [-150, 0],
        ]}
        stroke={LINE}
        lineWidth={3}
        endArrow
        opacity={0}
      />
      <Line
        ref={lineBC}
        points={[
          [150, 0],
          [250, 0],
        ]}
        stroke={LINE}
        lineWidth={3}
        endArrow
        opacity={0}
      />
      <ServerNode
        ref={nodeA}
        position={[-400, 0]}
        title={'服务 A'}
        role={'应用服务'}
        initialValue={'正常'}
        accent={BLUE}
        initialStatus={'运行中'}
        statusColor={GREEN}
        opacity={0}
      />
      <ServerNode
        ref={nodeB}
        position={[0, 0]}
        title={'服务 B'}
        role={'调用 A 的上游'}
        initialValue={'正常'}
        accent={BLUE}
        initialStatus={'运行中'}
        statusColor={GREEN}
        opacity={0}
      />
      <ServerNode
        ref={nodeC}
        position={[400, 0]}
        title={'服务 C'}
        role={'再上游'}
        initialValue={'正常'}
        accent={BLUE}
        initialStatus={'运行中'}
        statusColor={GREEN}
        opacity={0}
      />
      {/* 隔离墙 */}
      <Rect
        ref={wall}
        position={[200, 0]}
        width={24}
        height={260}
        radius={8}
        fill={YELLOW}
        opacity={0}
      />
      <Txt
        ref={wallLabel}
        position={[200, -165]}
        fontSize={24}
        fontWeight={700}
        fill={YELLOW}
        fontFamily={SANS}
        opacity={0}
        text={'隔离墙'}
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
          fontSize={34}
          fontWeight={700}
          fill={'#FFFFFF'}
          fontFamily={SERIF}
          text={'隔离、崩溃重启与监控自检才是兜底。'}
        />
      </Rect>
    </>,
  );

  const say = (text: string) => narration().text(text);

  // 0–0.5s 标题淡入
  yield* title().opacity(1, 0.5);

  // 0–10s 对比卡（9.5s）
  say('软件错误和硬件不一样，它是系统性的：\n一个 bug 能同时放倒所有节点。');
  yield* contrast().opacity(1, 0.8);
  yield* waitFor(8.7);

  // 10–28s 闰秒：小红点出现，多台机器依次变红（18s）
  say('最有名的例子是闰秒 bug：\n2012 年 6 月 30 日闰秒，Linux 内核 bug 让好多系统同时 hang 住。');
  yield* contrast().opacity(0, 0.5);
  yield* timeline().opacity(1, 0.5);
  yield* marker().opacity(1, 0.5);
  yield* bugDot().opacity(1, 0.5);
  yield* all(
    nodeA().opacity(1, 1.0),
    nodeB().opacity(1, 1.0),
    nodeC().opacity(1, 1.0),
    lineAB().opacity(1, 1.0),
    lineBC().opacity(1, 1.0),
  );
  yield* nodeA().setStatus('故障 ✗', RED, 0.5);
  yield* nodeB().setStatus('故障 ✗', RED, 0.5);
  yield* nodeC().setStatus('故障 ✗', RED, 0.5);
  yield* waitFor(13.5);

  // 28–48s 级联扩散，隔离墙升起挡住红色（20s）
  say('更麻烦的是级联失效：一个小错拖垮上游，\n上游再拖垮更多，最后整个系统雪崩。');
  yield* lineAB().stroke(RED, 0.5);
  yield* lineBC().stroke(RED, 0.5);
  yield* all(wall().opacity(1, 0.8), wallLabel().opacity(1, 0.5));
  yield* waitFor(18.2);

  // 48–60s 收尾卡（11.5s + 淡出 0.5s）
  say('光靠测试不够，还得靠隔离、崩溃重启与监控。');
  yield* all(
    timeline().opacity(0, 0.8),
    marker().opacity(0, 0.8),
    bugDot().opacity(0, 0.8),
    nodeA().opacity(0, 0.8),
    nodeB().opacity(0, 0.8),
    nodeC().opacity(0, 0.8),
    lineAB().opacity(0, 0.8),
    lineBC().opacity(0, 0.8),
    wall().opacity(0, 0.8),
    wallLabel().opacity(0, 0.8),
  );
  yield* closing().opacity(1, 0.8);
  yield* waitFor(9.9);
  yield* all(
    title().opacity(0, 0.5),
    narration().opacity(0, 0.5),
    closing().opacity(0, 0.5),
  );
});
