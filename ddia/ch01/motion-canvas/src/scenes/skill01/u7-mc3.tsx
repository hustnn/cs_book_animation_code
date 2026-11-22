// U7 场景 3（MC）：b17–b24 —— 没有万能扩展秘方、瓶颈清单、读多与写多、
// 100 MB/s 对比（两边对齐同一条线）、围绕常见/罕见假设建、假设错了反噬。
// 分镜：skill-ch01/ch01-beats.md U7 一节；原文：DDIA §1.10（书页 p18，PDF p40）。
// 100 MB/s 算例已验算：100,000 × 1kB = 100 MB/s；3 × 2GB/分钟 = 6 GB/分钟 = 100 MB/s。
// 时长全部来自 timeline/u7.json（beat() 驱动），不手写 waitFor 魔法数字。
// 错峰出现用 sequence / delay（Motion Canvas 标准流控）。
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
  const g17 = createRef<Node>();
  const bottle = createRef<Node>();
  const crossX1 = createRef<Line>();
  const crossX2 = createRef<Line>();
  const g18 = createRef<Node>();
  const bottleneckChips = [0, 1, 2, 3, 4, 5, 6].map(() => createRef<Node>());
  const g19 = createRef<Node>();
  const readSys = createRef<Node>();
  const writeSys = createRef<Node>();
  const g20 = createRef<Node>();
  const leftRate = createRef<Txt>();
  const rightRate = createRef<Txt>();
  const midLine = createRef<Line>();
  const midTag = createRef<Txt>();
  const g21 = createRef<Node>();
  const smallReqs = [0, 1, 2, 3, 4, 5, 6, 7].map(() => createRef<Circle>());
  const bigBlocks = [0, 1, 2].map(() => createRef<Rect>());
  const g22 = createRef<Node>();
  const manyNodeSys = createRef<Node>();
  const bigChannelSys = createRef<Node>();
  const g23 = createRef<Node>();
  const commonCol = createRef<Node>();
  const rareCol = createRef<Node>();
  const g24 = createRef<Node>();
  const readHeavyArch = createRef<Node>();
  const writeFlood = createRef<Node>();
  const crack24 = createRef<Line>();

  const say = (text: string) => anchor().text(text);

  const bottleneckLabels = ['读量', '写量', '存储量', '数据复杂度', '响应时间要求', '访问模式', '它们的混合'];
  const bottleneckPos: [number, number][] = [
    [-360, -160],
    [0, -160],
    [360, -160],
    [-360, -20],
    [0, -20],
    [360, -20],
    [0, 120],
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

      {/* b17：万能扩展秘方瓶子打叉（叉分两笔划） */}
      <Node ref={g17} opacity={0}>
        <Node ref={bottle}>
          <Rect position={[0, -40]} width={220} height={260} radius={24} fill={T.card} stroke={T.yellow} lineWidth={3} />
          <Rect position={[0, -190]} width={90} height={50} radius={10} fill={T.card} stroke={T.yellow} lineWidth={3} />
          <Txt position={[0, -40]} fontSize={SIZE.body} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'万能扩展秘方'} />
          <Txt position={[0, 40]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'magic scaling sauce'} />
        </Node>
        {/* 有意打叉：key 以 qa-ignore 开头，渲染 QA 不把它当成“线穿过文字” */}
        <Line key={'qa-ignore-cross-1'} ref={crossX1} points={[[-160, -200], [160, 120]]} stroke={T.red} lineWidth={10} opacity={0} />
        <Line key={'qa-ignore-cross-2'} ref={crossX2} points={[[-160, 120], [160, -200]]} stroke={T.red} lineWidth={10} opacity={0} />
      </Node>

      {/* b18：瓶颈清单轮流亮起 */}
      <Node ref={g18} opacity={0}>
        {bottleneckLabels.map((label, i) => (
          <Node key={`u7-bn-${i}`} ref={bottleneckChips[i]} position={bottleneckPos[i]} opacity={0}>
            <Rect width={label.length > 4 ? 340 : 220} height={80} radius={12} fill={T.card} stroke={T.yellow} lineWidth={2}>
              <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={label} />
            </Rect>
          </Node>
        ))}
      </Node>

      {/* b19：读多与写多，瓶颈各标一处 */}
      <Node ref={g19} opacity={0}>
        <Node ref={readSys}>
          <Rect position={[-280, -40]} width={400} height={200} radius={16} fill={T.card} stroke={T.blue} lineWidth={2} />
          <Txt position={[-280, -100]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'读量大的系统'} />
          <Txt position={[-280, 0]} fontSize={SIZE.label} fill={T.red} fontFamily={FONT.sans} text={'瓶颈在这里：读'} />
        </Node>
        <Node ref={writeSys}>
          <Rect position={[280, -40]} width={400} height={200} radius={16} fill={T.card} stroke={T.yellow} lineWidth={2} />
          <Txt position={[280, -100]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'写量大的系统'} />
          <Txt position={[280, 0]} fontSize={SIZE.label} fill={T.red} fontFamily={FONT.sans} text={'瓶颈在这里：写'} />
        </Node>
      </Node>

      {/* b20：两边数字对齐到同一条 100 MB/s 线 */}
      <Node ref={g20} opacity={0}>
        <Txt ref={leftRate} position={[-330, -140]} fontSize={SIZE.body} fontWeight={700} fill={T.blue} fontFamily={FONT.sans} opacity={0} text={'10 万请求/秒 × 1kB'} />
        <Txt ref={rightRate} position={[330, -140]} fontSize={SIZE.body} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} opacity={0} text={'3 请求/分钟 × 2GB'} />
        <Line ref={midLine} points={[[-460, 40], [460, 40]]} stroke={T.green} lineWidth={4} opacity={0} />
        <Txt ref={midTag} position={[0, 110]} fontSize={SIZE.title} fontWeight={700} fill={T.green} fontFamily={FONT.sans} opacity={0} text={'都是 100 MB/s'} />
      </Node>

      {/* b21：左边无数小请求涌入，右边三个大块缓缓移动 */}
      <Node ref={g21} opacity={0}>
        <Txt position={[-330, -220]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'每秒 10 万个小请求'} />
        {smallReqs.map((r, i) => (
          <Circle key={`u7-sr-${i}`} ref={r} position={[-480 + (i % 4) * 90, -120 + Math.floor(i / 4) * 90]} width={34} height={34} fill={T.blue} opacity={0} />
        ))}
        <Txt position={[330, -220]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'每分钟 3 个大请求'} />
        {[0, 1, 2].map(i => (
          <Rect key={`u7-bb-${i}`} ref={bigBlocks[i]} position={[180, -120 + i * 110]} width={260} height={70} radius={12} fill={T.yellow} opacity={0}>
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'2GB'} />
          </Rect>
        ))}
      </Node>

      {/* b22：吞吐一样，系统迥异 */}
      <Node ref={g22} opacity={0}>
        <Node ref={manyNodeSys}>
          <Txt position={[-300, -230]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'多节点 · 小请求'} />
          {[-390, -300, -210].map((x, i) => (
            <Rect key={`u7-mn-${i}`} position={[x, -40]} width={150} height={130} radius={14} fill={T.card} stroke={T.blue} lineWidth={2} />
          ))}
          <Txt position={[-300, 140]} fontSize={SIZE.label} fill={T.blue} fontFamily={FONT.sans} text={'100 MB/s'} />
        </Node>
        <Node ref={bigChannelSys}>
          <Txt position={[300, -230]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'单通道 · 大块头'} />
          <Rect position={[300, -40]} width={360} height={130} radius={14} fill={T.card} stroke={T.yellow} lineWidth={2} />
          <Txt position={[300, -40]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'一个大通道'} />
          <Txt position={[300, 140]} fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.sans} text={'100 MB/s'} />
        </Node>
      </Node>

      {/* b23：常见操作 vs 罕见操作两列清单 */}
      <Node ref={g23} opacity={0}>
        <Node ref={commonCol}>
          <Txt position={[-280, -230]} fontSize={SIZE.body} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'常见操作（例如）'} />
          {['读时间线', '发推', '搜关键词'].map((t, i) => (
            <Rect key={`u7-cm-${i}`} position={[-280, -120 + i * 100]} width={360} height={70} radius={12} fill={T.card} stroke={T.green} lineWidth={2}>
              <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={t} />
            </Rect>
          ))}
        </Node>
        <Node ref={rareCol} opacity={0}>
          <Txt position={[280, -230]} fontSize={SIZE.body} fontWeight={700} fill={T.muted} fontFamily={FONT.sans} text={'罕见操作（例如）'} />
          {['删账号', '改用户名', '导全量数据'].map((t, i) => (
            <Rect key={`u7-rr-${i}`} position={[280, -120 + i * 100]} width={360} height={70} radius={12} fill={T.card} stroke={T.muted} lineWidth={2}>
              <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={t} />
            </Rect>
          ))}
        </Node>
      </Node>

      {/* b24：按读多建的架构，遇上写多就垮掉 */}
      <Node ref={g24} opacity={0}>
        <Node ref={readHeavyArch}>
          <Rect position={[0, -60]} width={620} height={220} radius={20} fill={T.card} stroke={T.blue} lineWidth={3} />
          <Txt position={[0, -120]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'按“读多写少”建的架构'} />
          <Txt position={[0, -40]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'读路径很强，写路径很弱'} />
        </Node>
        <Node ref={writeFlood} opacity={0}>
          <Txt position={[0, 90]} fontSize={SIZE.body} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'实际：写多读少 →'} />
          <Txt position={[0, 150]} fontSize={SIZE.label} fill={T.red} fontFamily={FONT.sans} text={'扩容白费，甚至适得其反'} />
        </Node>
        {/* r3：裂缝原穿过框内文字（过“按/读”）；改走框内左侧留白，裂缝仍穿透框顶/框底，文字不再被压 */}
        <Line ref={crack24} points={[[-260, -170], [-210, -60], [-260, 50]]} stroke={T.red} lineWidth={4} opacity={0} />
      </Node>
    </>,
  );

  // b17：没有万能扩展秘方——瓶子出现，叉分两笔划上，瓶子随之变暗
  say('没有万能扩展秘方');
  yield* beat(
    'b17',
    all(
      g17().opacity(1, 0.6),
      delay(2.5, crossX1().opacity(1, 0.5)),
      delay(4.5, crossX2().opacity(1, 0.5)),
      delay(5.5, bottle().opacity(0.4, 1.0)),
    ),
  );

  // b18：瓶颈可能是其中任何一个——清单轮流亮起
  say('瓶颈可能是其中任何一个');
  yield* beat(
    'b18',
    all(
      g17().opacity(0, 0.5),
      g18().opacity(1, 0.5),
      sequence(1.1, ...bottleneckChips.map(c => c().opacity(1, 0.5))),
    ),
  );

  // b19：读多与写多，瓶颈根本不在一个地方
  say('读多与写多瓶颈不同');
  yield* beat('b19', all(g18().opacity(0, 0.5), g19().opacity(1, 0.6)));

  // b20：两边数字对齐到同一条 100 MB/s 线
  say('都是 100 MB/s');
  yield* beat(
    'b20',
    all(
      g19().opacity(0, 0.5),
      g20().opacity(1, 0.5),
      delay(0.6, leftRate().opacity(1, 0.6)),
      delay(2.4, rightRate().opacity(1, 0.6)),
      delay(4.2, all(midLine().opacity(1, 0.6), midTag().opacity(1, 0.6))),
    ),
  );

  // b21：小请求多 vs 大请求少——两边同时动
  say('小请求多 vs 大请求少');
  yield* beat(
    'b21',
    all(
      g20().opacity(0, 0.5),
      g21().opacity(1, 0.5),
      sequence(
        0.35,
        ...smallReqs.map((r, i) => all(r().opacity(1, 0.3), r().position([-480 + (i % 4) * 90 + 130, -120 + Math.floor(i / 4) * 90], 2.0))),
      ),
      sequence(
        1.0,
        ...bigBlocks.map((b, i) => all(b().opacity(1, 0.5), b().position([330, -120 + i * 110], 1.5))),
      ),
    ),
  );

  // b22：吞吐一样，系统迥异
  say('吞吐一样，系统迥异');
  yield* beat('b22', all(g21().opacity(0, 0.5), g22().opacity(1, 0.6)));

  // b23：围绕常见 / 罕见建架构——常见列先出，罕见列后出
  say('围绕常见 / 罕见建');
  yield* beat(
    'b23',
    all(
      g22().opacity(0, 0.5),
      g23().opacity(1, 0.5),
      delay(3.0, rareCol().opacity(1, 0.8)),
    ),
  );

  // b24：假设错了，架构垮掉
  say('假设错了白费甚至反噬');
  yield* beat(
    'b24',
    all(
      g23().opacity(0, 0.5),
      g24().opacity(1, 0.6),
      delay(2.0, all(writeFlood().opacity(1, 0.6), crack24().opacity(1, 0.5))),
      delay(3.5, readHeavyArch().opacity(0.45, 1.0)),
    ),
  );
});
