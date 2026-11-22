// U1 场景 4（MC）：b27–b38 —— 四个棘手问题、其他影响因素、三把尺子与页码、三点定义、回扣与下一站。
// 分镜：skill-ch01/ch01-beats.md U1 一节；原文：DDIA §1.1（书页 p5–6，PDF p27–28）。
// 时长全部来自 timeline/u1.json（beat() 驱动），不手写 waitFor 魔法数字。
// 颜色、字号、安全区一律取自 lib/theme，不手写十六进制色值。
import {Circle, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, chain, createRef} from '@motion-canvas/core';
import {makeBeats} from '../../lib/beats';
import {FONT, SAFE, SIZE, T} from '../../lib/theme';
import timeline from '../../timeline/u1.json';

export default makeScene2D(function* (view) {
  view.fill(T.bg);
  const beat = makeBeats(timeline);

  const header = createRef<Txt>();
  const anchor = createRef<Txt>();
  const g27 = createRef<Node>();
  const redPart = createRef<Circle>();
  const g28 = createRef<Node>();
  const yellowPart = createRef<Rect>();
  const perfBar = createRef<Rect>();
  const g29 = createRef<Node>();
  const loadDot = createRef<Circle>();
  const apiBox = createRef<Rect>();
  const g30 = createRef<Node>();
  const tags30 = [0, 1, 2, 3, 4].map(() => createRef<Rect>());
  const g31 = createRef<Node>();
  const cards31 = [0, 1, 2].map(() => createRef<Rect>());
  const faultDots = [0, 1, 2].map(() => createRef<Circle>());
  const growthLines = [0, 1, 2].map(() => createRef<Line>());
  const people = [0, 1, 2].map(() => createRef<Node>());
  const fog = createRef<Rect>();
  const g36 = createRef<Node>();
  const appIcon = createRef<Rect>();
  const slots36 = [0, 1, 2, 3, 4].map(() => createRef<Rect>());
  const g37 = createRef<Node>();
  const rulers37 = [0, 1, 2].map(() => createRef<Rect>());
  const door = createRef<Rect>();

  const say = (text: string) => anchor().text(text);

  view.add(
    <>
      <Txt
        ref={header}
        position={[-SAFE.halfW, -SAFE.halfH]}
        offset={[-1, -1]}
        fontSize={SIZE.label}
        fill={T.muted}
        fontFamily={FONT.sans}
        text={'第 1 章 · 拼出来的数据系统'}
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

      {/* b27：第一个棘手问题——内部出错，数据怎么保持正确完整 */}
      <Node ref={g27} opacity={0}>
        <Rect position={[0, -80]} width={760} height={170} radius={16} fill={T.card} stroke={T.yellow} lineWidth={3}>
          <Txt position={[0, -40]} fontSize={SIZE.body} fontWeight={700} fill={T.white} fontFamily={FONT.sans} text={'问题一：内部出错'} />
          <Txt position={[0, 30]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'数据怎么保持正确完整？'} />
        </Rect>
        {/* r2：红点原在 [-320, 80]，压住“一个零件变红”前两个字，左移至 -420 */}
        <Circle ref={redPart} position={[-420, 80]} width={60} height={60} fill={T.red} opacity={0} />
        <Txt position={[-220, 80]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'一个零件变红，数据仍完整'} />
      </Node>

      {/* b28：第二个问题——部分零件变差，性能还好吗 */}
      <Node ref={g28} opacity={0}>
        <Rect position={[0, -80]} width={760} height={170} radius={16} fill={T.card} stroke={T.yellow} lineWidth={3}>
          <Txt position={[0, -40]} fontSize={SIZE.body} fontWeight={700} fill={T.white} fontFamily={FONT.sans} text={'问题二：部分零件变差'} />
          <Txt position={[0, 30]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'怎么还给客户持续好的性能？'} />
        </Rect>
        <Rect ref={yellowPart} position={[-320, 80]} width={90} height={60} radius={10} fill={T.yellow} opacity={0} />
        <Txt position={[-220, 80]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'构件变黄'} />
        <Rect position={[180, 60]} width={420} height={26} radius={13} fill={T.card} stroke={T.line} lineWidth={2} />
        <Rect ref={perfBar} position={[180, 60]} width={420} height={26} radius={13} fill={T.green} />
        <Txt position={[180, 110]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} text={'客户侧性能保持绿色'} />
      </Node>

      {/* b29：第三、四个问题——负载长大怎么扩，好 API 长什么样 */}
      <Node ref={g29} opacity={0}>
        <Rect position={[-280, -80]} width={460} height={170} radius={16} fill={T.card} stroke={T.yellow} lineWidth={3}>
          <Txt position={[0, -40]} fontSize={SIZE.body} fontWeight={700} fill={T.white} fontFamily={FONT.sans} text={'问题三：负载长大了'} />
          <Txt position={[0, 30]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'怎么扩容？'} />
        </Rect>
        <Rect ref={apiBox} position={[280, -80]} width={460} height={170} radius={16} fill={T.card} stroke={T.blue} lineWidth={3}>
          <Txt position={[0, -40]} fontSize={SIZE.body} fontWeight={700} fill={T.white} fontFamily={FONT.sans} text={'问题四：好 API'} />
          <Txt position={[0, 30]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'长什么样？'} />
        </Rect>
        <Line points={[[-460, 80], [-100, 80]]} stroke={T.line} lineWidth={3} />
        <Circle ref={loadDot} position={[-460, 80]} width={24} height={24} fill={T.red} opacity={0} />
        <Txt position={[-280, 130]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'负载曲线爬升'} />
      </Node>

      {/* b30：五个影响因素标签轮流闪过 */}
      <Node ref={g30} opacity={0}>
        {['人的经验', '遗留系统', '交付时间', '风险容忍', '监管约束'].map((label, i) => (
          <Rect
            key={`u1-tag30-${i}`}
            ref={tags30[i]}
            position={[-440 + i * 220, -60]}
            width={190}
            height={90}
            radius={14}
            fill={T.card}
            stroke={T.line}
            lineWidth={2}
            opacity={0}
          >
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={label} />
          </Rect>
        ))}
        <Txt position={[0, 100]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'每种情况都不一样'} />
      </Node>

      {/* b31：三张卡片 + 三点定义（可靠/可扩展/可维护） */}
      <Node ref={g31} opacity={0}>
        {[
          {x: -360, label: '可靠', sub: 'Reliability'},
          {x: 0, label: '可扩展', sub: 'Scalability'},
          {x: 360, label: '可维护', sub: 'Maintainability'},
        ].map((r, i) => (
          <Rect
            key={`u1-card31-${i}`}
            ref={cards31[i]}
            position={[r.x, -60]}
            width={300}
            height={200}
            radius={16}
            fill={T.card}
            stroke={T.yellow}
            lineWidth={3}
            opacity={0}
          >
            <Txt position={[0, -50]} fontSize={SIZE.body} fontWeight={700} fill={T.white} fontFamily={FONT.sans} text={r.label} />
            <Txt position={[0, 10]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={r.sub} />
          </Rect>
        ))}
        {/* b32：三个故障图标撞上来又被弹开 */}
        {[0, 1, 2].map(i => (
          <Circle
            key={`u1-fault-${i}`}
            ref={faultDots[i]}
            position={[-360 + i * 360, 180]}
            width={44}
            height={44}
            fill={T.red}
            opacity={0}
          />
        ))}
        {/* b33：三条增长曲线各配一个应对办法 */}
        {[
          {points: [[-480, 180], [-360, 180], [-240, 120]] as [number, number][]},
          {points: [[-120, 180], [0, 180], [120, 120]] as [number, number][]},
          {points: [[240, 180], [360, 180], [480, 120]] as [number, number][]},
        ].map((g, i) => (
          <Line key={`u1-growth-${i}`} ref={growthLines[i]} points={g.points} stroke={T.green} lineWidth={3} endArrow opacity={0} />
        ))}
        {/* b34：不同角色的小人轮流走进系统 */}
        {[0, 1, 2].map(i => (
          <Node key={`u1-person-${i}`} ref={people[i]} position={[-360 + i * 360, 180]} opacity={0}>
            <Circle width={44} height={44} fill={T.blue} />
            <Rect position={[0, 45]} width={60} height={50} radius={10} fill={T.card} stroke={T.line} lineWidth={2} />
          </Node>
        ))}
        {/* b35：雾罩住三个词，又散开 */}
        <Rect ref={fog} position={[0, -60]} width={1100} height={260} radius={16} fill={T.bg} opacity={0} />
      </Node>

      {/* b36：你用的 App 背后最可能藏着哪几个构件 */}
      <Node ref={g36} opacity={0}>
        <Rect ref={appIcon} position={[0, -120]} width={200} height={200} radius={28} fill={T.card} stroke={T.blue} lineWidth={3}>
          <Txt fontSize={SIZE.title} fontWeight={700} fill={T.white} fontFamily={FONT.sans} text={'App'} />
        </Rect>
        {[0, 1, 2, 3, 4].map(i => (
          <Rect
            key={`u1-slot36-${i}`}
            ref={slots36[i]}
            position={[-440 + i * 220, 110]}
            width={180}
            height={100}
            radius={14}
            fill={T.card}
            stroke={T.line}
            lineWidth={2}
            lineDash={[8, 6]}
            opacity={0}
          />
        ))}
        <Txt position={[0, 200]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'五个构件槽位空着等填'} />
      </Node>

      {/* b37/b38：三把尺子并排，镜头推向第一把“可靠”，放大成下一单元的门 */}
      <Node ref={g37} opacity={0}>
        {[
          {x: -360, label: '可靠'},
          {x: 0, label: '可扩展'},
          {x: 360, label: '可维护'},
        ].map((r, i) => (
          <Rect
            key={`u1-ruler37-${i}`}
            ref={rulers37[i]}
            position={[r.x, -40]}
            width={300}
            height={180}
            radius={16}
            fill={T.card}
            stroke={T.yellow}
            lineWidth={3}
            opacity={0}
          >
            <Txt fontSize={SIZE.body} fontWeight={700} fill={T.white} fontFamily={FONT.sans} text={r.label} />
          </Rect>
        ))}
        <Rect ref={door} position={[0, -40]} width={300} height={180} radius={16} fill={T.card} stroke={T.green} lineWidth={4} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.white} fontFamily={FONT.sans} text={'可靠'} />
          <Txt position={[0, 50]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} text={'下一单元的门'} />
        </Rect>
      </Node>
    </>,
  );

  // b27：四个棘手问题之一——内部出错，数据怎么保持正确完整（红点撞上来又弹回）
  // r2：sequence(0) 是重叠跑不是串行，改 chain
  say('内部出错，数据还对吗');
  yield* beat(
    'b27',
    chain(
      all(g27().opacity(1, 0.6)),
      all(redPart().opacity(1, 0.8), redPart().position([-420, 40], 2.0)),
      all(redPart().position([-420, 80], 2.0)),
    ),
  );

  // b28：第二，部分零件变差了，怎么还给客户持续好的性能
  // r2：删掉 yellowPart().fill(T.red, …)——“变差”是降级（黄），不是坏（红）；变红会与问题一的“出错”混淆
  say('部分降级，性能还好吗');
  yield* beat(
    'b28',
    all(
      g27().opacity(0, 0.5),
      g28().opacity(1, 0.6),
      yellowPart().opacity(1, 1.0),
      perfBar().width(420, 3.5),
    ),
  );

  // b29a：负载长大了，怎么扩容
  say('负载长大怎么扩');
  yield* beat('b29a', all(g28().opacity(0, 0.4), g29().opacity(1, 0.5), loadDot().opacity(1, 0.4), loadDot().position([-100, 80], 1.4)));

  // b29b：第四，好 API 长什么样
  say('好 API 长什么样');
  yield* beat('b29b', all(apiBox().stroke(T.yellow, 1.2), apiBox().opacity(1, 0.5)));

  // b30：设计还受很多别的影响——五个小标签轮流闪过
  say('还要看具体情况');
  yield* beat(
    'b30',
    all(
      g29().opacity(0, 0.5),
      g30().opacity(1, 0.6),
      tags30[0]().opacity(1, 1.5),
      tags30[1]().opacity(1, 3.0),
      tags30[2]().opacity(1, 4.5),
      tags30[3]().opacity(1, 6.0),
      tags30[4]().opacity(1, 7.5),
    ),
  );

  // b31a：这一章只盯住三个最普遍的关注点——三张卡片出现
  say('三把尺子');
  yield* beat(
    'b31a',
    all(
      g30().opacity(0, 0.5),
      g31().opacity(1, 0.6),
      cards31[0]().opacity(1, 1.0),
      cards31[1]().opacity(1, 1.8),
      cards31[2]().opacity(1, 2.6),
    ),
  );

  // b31b：三张卡片描边依次变绿
  say('可靠性 · 可扩展性 · 可维护性');
  yield* beat(
    'b31b',
    all(
      cards31[0]().stroke(T.green, 3.0),
      cards31[1]().stroke(T.green, 4.0),
      cards31[2]().stroke(T.green, 5.0),
    ),
  );

  // b32：可靠性——面对硬件故障、软件故障、甚至人为错误，系统还能继续正确工作
  // 三个故障图标依次撞上来又被弹开（每颗两步：撞上去、弹回来）
  // r2：sequence(0) 是重叠跑不是串行，改 chain
  say('面对逆境还正确');
  yield* beat(
    'b32',
    chain(
      all(cards31[0]().fill(T.green, 1.5), cards31[1]().opacity(0.4, 1.5), cards31[2]().opacity(0.4, 1.5)),
      all(faultDots[0]().opacity(1, 0.4), faultDots[0]().position([-360, 100], 1.2)),
      all(faultDots[0]().position([-360, 180], 1.2)),
      all(faultDots[1]().opacity(1, 0.4), faultDots[1]().position([0, 100], 1.2)),
      all(faultDots[1]().position([0, 180], 1.2)),
      all(faultDots[2]().opacity(1, 0.4), faultDots[2]().position([360, 100], 1.2)),
      all(faultDots[2]().position([360, 180], 1.0)),
    ),
  );

  // b33：可扩展性——数据量、流量、复杂度长大了，有合理办法应对
  say('长大了有办法');
  yield* beat(
    'b33',
    all(
      faultDots[0]().opacity(0, 0.5),
      faultDots[1]().opacity(0, 0.5),
      faultDots[2]().opacity(0, 0.5),
      cards31[0]().opacity(0.4, 0.8),
      cards31[1]().opacity(1, 0.8),
      cards31[1]().fill(T.green, 1.5),
      growthLines[0]().opacity(1, 1.5),
      growthLines[1]().opacity(1, 3.0),
      growthLines[2]().opacity(1, 4.5),
    ),
  );

  // b34：可维护性——许多不同的人都要在系统上干活，他们都能高效地干
  say('许多人都能高效干');
  yield* beat(
    'b34',
    all(
      growthLines[0]().opacity(0, 0.5),
      growthLines[1]().opacity(0, 0.5),
      growthLines[2]().opacity(0, 0.5),
      cards31[1]().opacity(0.4, 0.8),
      cards31[2]().opacity(1, 0.8),
      cards31[2]().fill(T.green, 1.5),
      people[0]().opacity(1, 1.5),
      people[1]().opacity(1, 3.0),
      people[2]().opacity(1, 4.5),
      people[0]().position([-360, 140], 4.5),
      people[1]().position([0, 140], 4.5),
      people[2]().position([360, 140], 4.5),
    ),
  );

  // b35：这三个词常被挂在嘴边，却很少有人说清它们到底是什么意思——雾罩住，又散开
  // r2：sequence(0) 是重叠跑不是串行，改 chain（原来雾的淡入淡出同属性冲突、雾从未出现）
  say('挂在嘴边，说不清');
  yield* beat(
    'b35',
    chain(
      all(people[0]().opacity(0, 0.5), people[1]().opacity(0, 0.5), people[2]().opacity(0, 0.5)),
      all(fog().opacity(0.92, 2.0)),
      all(fog().opacity(0, 2.2)),
    ),
  );

  // b36：停下来想一想——你用的那个 App，背后最可能藏着哪几个构件
  say('你用的 App 藏着谁');
  yield* beat(
    'b36',
    all(
      g31().opacity(0, 0.5),
      g36().opacity(1, 0.6),
      appIcon().width(240, 2.5),
      appIcon().height(240, 2.5),
      slots36[0]().opacity(1, 1.2),
      slots36[1]().opacity(1, 2.0),
      slots36[2]().opacity(1, 2.8),
      slots36[3]().opacity(1, 3.6),
      slots36[4]().opacity(1, 4.4),
    ),
  );

  // b37：这一章就干这件事——把可靠、可扩展、可维护，一个一个想清楚
  say('先想清楚可靠');
  yield* beat(
    'b37',
    all(
      g36().opacity(0, 0.5),
      g37().opacity(1, 0.6),
      rulers37[0]().opacity(1, 1.0),
      rulers37[1]().opacity(1, 2.0),
      rulers37[2]().opacity(1, 3.0),
      rulers37[0]().stroke(T.green, 4.0),
    ),
  );

  // b38：下一单元，我们先问：什么叫可靠——“可靠”放大成下一单元的门
  say('下一站：可靠');
  yield* beat(
    'b38',
    all(
      rulers37[1]().opacity(0, 0.5),
      rulers37[2]().opacity(0, 0.5),
      rulers37[0]().opacity(0, 0.5),
      door().opacity(1, 0.8),
      door().width(420, 2.5),
      door().height(260, 2.5),
    ),
  );
});
