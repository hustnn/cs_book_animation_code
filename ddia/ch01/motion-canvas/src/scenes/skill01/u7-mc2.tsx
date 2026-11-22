// U7 场景 2（MC）：b12–b16b —— 无状态好分、有状态难、单节点先纵向扩、
// 传统共识、共识可能改变、分布式可能成默认。
// 分镜：skill-ch01/ch01-beats.md U7 一节；原文：DDIA §1.10（书页 p17–18，PDF p39–40）。
// b13 配音偏慢（--speed 90，11.47s）：数据分片滑入 + 复杂度团慢慢膨胀，动作铺满整拍。
// 时长全部来自 timeline/u7.json（beat() 驱动），不手写 waitFor 魔法数字。
// 错峰出现用 sequence / delay（Motion Canvas 标准流控）。
import {row} from '../../lib/layout';
import {Circle, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, delay, sequence} from '@motion-canvas/core';
import {makeBeats} from '../../lib/beats';
import {FONT, SAFE, SIZE, T} from '../../lib/theme';
import timeline from '../../timeline/u7.json';

export default makeScene2D(function* (view) {
  view.fill(T.bg);
  const beat = makeBeats(timeline);

  const header = createRef<Txt>();
  const anchor = createRef<Txt>();
  const g12 = createRef<Node>();
  const statelessNodes = [0, 1, 2].map(() => createRef<Rect>());
  const statefulNode = createRef<Rect>();
  const statefulData = createRef<Rect>();
  const g13 = createRef<Node>();
  const singleNode = createRef<Rect>();
  const dragData = [0, 1, 2].map(() => createRef<Rect>());
  const dragLines = [0, 1, 2].map(() => createRef<Line>());
  const complexity = createRef<Circle>();
  const g14 = createRef<Node>();
  const scaleBar = createRef<Rect>();
  const costWall = createRef<Line>();
  const wallTag = createRef<Txt>();
  const splitNodes = [0, 1, 2].map(() => createRef<Rect>());
  const g15 = createRef<Node>();
  const timeArrow = createRef<Line>();
  const futureTag = createRef<Txt>();
  const g16 = createRef<Node>();
  const distNodes = [0, 1, 2].map(() => createRef<Rect>());
  const defaultTag = createRef<Txt>();
  const smallTag1 = createRef<Txt>();
  const smallTag2 = createRef<Txt>();

  const say = (text: string) => anchor().text(text);

  // b13 三块数据分片的目标位置；出场时从左侧滑入
  const dragTargets: [number, number][] = [
    [-60, -140],
    [120, 20],
    [320, -120],
  ];
  const dragLinePts: [number, number][][] = [
    [[-280, -40], [-150, -140]],
    [[-280, -40], [30, 20]],
    [[-280, -40], [230, -120]],
  ];

  view.add(
    <>
      <Txt
        ref={header}
        position={[-SAFE.halfW, -SAFE.halfH]}
        offset={[-1, -1]}
        fontSize={SIZE.label}
        fill={T.muted}
        fontFamily={FONT.sans}
        text={'第 1 章 · 怎么扛住更大的负载'}
      />
      <Txt
        ref={anchor}
        position={[0, 280]}
        fontSize={SIZE.body}
        fill={T.text}
        fontFamily={FONT.sans}
        textAlign={'center'}
        textWrap
        maxWidth={SAFE.width}
        text={''}
      />

      {/* b12：无状态随便加 vs 有状态拖着数据 */}
      <Node ref={g12} opacity={0}>
        <Txt position={[-300, -230]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'无状态服务'} />
        {/* QA r4（类 C）：原 x = -390/-300/-210，间距 90 小于方块宽 150，三个方块互相叠住；改用 row() 由宽度算间距 */}
        {row(3, 150, 20, [-300, -40]).map(([x], i) => (
          <Rect key={`u7-sl-${i}`} ref={statelessNodes[i]} position={[x, -40]} width={150} height={130} radius={14} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'节点'} />
          </Rect>
        ))}
        <Txt position={[-300, 140]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} text={'随便加'} />
        <Txt position={[300, -230]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'有状态的数据系统'} />
        <Rect ref={statefulNode} position={[300, -80]} width={200} height={140} radius={14} fill={T.card} stroke={T.yellow} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'节点'} />
        </Rect>
        <Rect ref={statefulData} position={[300, 60]} width={200} height={70} radius={12} fill={T.card} stroke={T.red} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'拖着数据'} />
        </Rect>
      </Node>

      {/* b13：有状态变分布式，复杂度团膨胀 */}
      <Node ref={g13} opacity={0}>
        <Rect ref={singleNode} position={[-380, -40]} width={200} height={150} radius={16} fill={T.card} stroke={T.blue} lineWidth={3}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'单节点'} />
        </Rect>
        {dragTargets.map(([x, y], i) => (
          <Node key={`u7-drag-${i}`}>
            <Line ref={dragLines[i]} points={dragLinePts[i]} stroke={T.red} lineWidth={3} opacity={0} />
            <Rect ref={dragData[i]} position={[x - 260, y]} width={170} height={90} radius={12} fill={T.card} stroke={T.red} lineWidth={2} opacity={0}>
              <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'数据分片'} />
            </Rect>
          </Node>
        ))}
        <Circle ref={complexity} position={[160, -160]} width={60} height={60} fill={T.red} opacity={0} />
        <Txt position={[140, 140]} fontSize={SIZE.label} fill={T.red} fontFamily={FONT.sans} text={'复杂度膨胀'} />
      </Node>

      {/* b14：单节点一路纵向扩，走到成本墙才分 */}
      <Node ref={g14} opacity={0}>
        <Rect ref={scaleBar} position={[-360, 80]} offset={[0, 1]} width={140} height={10} radius={8} fill={T.blue} />
        <Txt position={[-360, 140]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'单节点纵向扩'} />
        <Line ref={costWall} points={[[60, -220], [60, 180]]} stroke={T.red} lineWidth={4} opacity={0} />
        <Txt ref={wallTag} position={[180, -230]} fontSize={SIZE.label} fill={T.red} fontFamily={FONT.sans} opacity={0} text={'成本墙 / 高可用要求'} />
        {[160, 330, 480].map((x, i) => (
          <Rect key={`u7-split-${i}`} ref={splitNodes[i]} position={[x, -40]} width={130} height={120} radius={14} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'分布式'} />
          </Rect>
        ))}
      </Node>

      {/* b15：时间线向未来延伸 */}
      <Node ref={g15} opacity={0}>
        <Txt position={[-380, -180]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'过去：单节点是共识'} />
        <Line ref={timeArrow} points={[[-460, -40], [460, -40]]} stroke={T.line} lineWidth={4} endArrow />
        <Txt ref={futureTag} position={[330, -120]} fontSize={SIZE.body} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} opacity={0} text={'未来：共识可能改变'} />
      </Node>

      {/* b16a/b16b：分布式变成默认，哪怕数据量和流量都不大 */}
      <Node ref={g16} opacity={0}>
        {[[-330, 0], [-110, 0], [110, 0]].map(([x, y], i) => (
          <Rect key={`u7-dist-${i}`} ref={distNodes[i]} position={[x, y]} width={180} height={140} radius={14} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'分布式节点'} />
          </Rect>
        ))}
        <Txt ref={defaultTag} position={[330, -40]} fontSize={SIZE.body} fontWeight={700} fill={T.green} fontFamily={FONT.sans} opacity={0} text={'✓ 默认选项'} />
        <Txt ref={smallTag1} position={[-220, 140]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} opacity={0} text={'数据量不大'} />
        <Txt ref={smallTag2} position={[220, 140]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} opacity={0} text={'流量也不大'} />
      </Node>
    </>,
  );

  // b12：无状态随便加，有状态拖着数据
  say('无状态好分，有状态难');
  yield* beat(
    'b12',
    all(
      g12().opacity(1, 0.5),
      sequence(0.6, ...statelessNodes.map(n => n().opacity(1, 0.5))),
      delay(2.2, all(statefulNode().opacity(1, 0.5), statefulData().opacity(1, 0.5))),
    ),
  );

  // b13：三块数据分片依次滑入，复杂度团最后慢慢膨胀（配音慢，动作铺满整拍）
  say('有状态变分布式很复杂');
  yield* beat(
    'b13',
    all(
      g12().opacity(0, 0.5),
      g13().opacity(1, 0.5),
      sequence(
        2.5,
        ...dragTargets.map(([x, y], i) =>
          all(dragLines[i]().opacity(1, 0.6), dragData[i]().opacity(1, 0.6), dragData[i]().position([x, y], 2.0)),
        ),
      ),
      delay(7.5, all(complexity().opacity(0.7, 1.0), complexity().width(200, 3.0), complexity().height(200, 3.0))),
    ),
  );

  // b14：单节点一路纵向扩，走到成本墙才分
  say('先单节点，逼急了再分');
  yield* beat(
    'b14',
    all(
      g13().opacity(0, 0.5),
      g14().opacity(1, 0.5),
      scaleBar().height(260, 4.5),
      delay(4.0, all(costWall().opacity(1, 0.6), wallTag().opacity(1, 0.6))),
      delay(5.2, sequence(0.7, ...splitNodes.map(n => n().opacity(1, 0.5)))),
    ),
  );

  // b15：时间线向未来延伸
  say('共识可能改变');
  yield* beat(
    'b15',
    all(
      g14().opacity(0, 0.5),
      g15().opacity(1, 0.5),
      delay(1.2, futureTag().opacity(1, 0.6)),
    ),
  );

  // b16a：分布式可能变成默认
  say('分布式可能成默认');
  yield* beat(
    'b16a',
    all(
      g15().opacity(0, 0.5),
      g16().opacity(1, 0.5),
      sequence(0.6, ...distNodes.map(n => n().opacity(1, 0.5))),
      delay(2.2, defaultTag().opacity(1, 0.6)),
    ),
  );

  // b16b：哪怕数据量和流量都不大
  say('数据量不大也默认');
  yield* beat('b16b', all(smallTag1().opacity(1, 0.6), smallTag2().opacity(1, 0.6)));
});
