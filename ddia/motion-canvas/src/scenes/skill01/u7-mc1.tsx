// U7 场景 1（MC）：b1–b8 —— 钩子（10 倍负载）、每数量级重想架构、纵向 vs 横向、
// shared-nothing、单机简单但高端贵、务实混合、算总账。
// 分镜：skill-ch01/ch01-beats.md U7 一节；原文：DDIA §1.10（书页 p17，PDF p39）。
// 时长全部来自 timeline/u7.json（beat() 驱动），不手写 waitFor 魔法数字。
// 错峰出现用 sequence / delay（Motion Canvas 标准流控），动画尽量铺满整拍。
// 颜色、字号、安全区一律取自 lib/theme，不手写十六进制色值。
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
  const g1 = createRef<Node>();
  const archBox = createRef<Rect>();
  const loadArrow = createRef<Line>();
  const crack1 = createRef<Line>();
  const crack2 = createRef<Line>();
  const g2 = createRef<Node>();
  const step1 = createRef<Node>();
  const step2 = createRef<Node>();
  const step3 = createRef<Node>();
  const g3 = createRef<Node>();
  const bigMachine = createRef<Rect>();
  const priceTag = createRef<Txt>();
  const g4 = createRef<Node>();
  const smallMachines = [0, 1, 2, 3].map(() => createRef<Rect>());
  const loadDots = [0, 1, 2, 3].map(() => createRef<Circle>());
  const g5 = createRef<Node>();
  const snMachines = [0, 1, 2, 3].map(() => createRef<Node>());
  const snTerm = createRef<Txt>();
  const g6 = createRef<Node>();
  const cheapBar = createRef<Rect>();
  const priceBar = createRef<Rect>();
  const g7 = createRef<Node>();
  const strongGroup = createRef<Node>();
  const vmGroup = createRef<Node>();
  const check7 = createRef<Txt>();
  const g8 = createRef<Node>();
  const costBars = [0, 1, 2].map(() => createRef<Rect>());

  const say = (text: string) => anchor().text(text);

  const dotTargets: [number, number][] = [
    [-330, -120],
    [-110, -120],
    [110, -120],
    [330, -120],
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

      {/* b1：负载 ×10，架构图裂开 */}
      <Node ref={g1} opacity={0}>
        <Rect ref={archBox} position={[0, -60]} width={520} height={220} radius={20} fill={T.card} stroke={T.blue} lineWidth={3}>
          <Txt position={[0, -50]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'今天的架构'} />
          <Txt position={[0, 30]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'数据库 · 缓存 · 队列'} />
        </Rect>
        <Line ref={loadArrow} points={[[-420, -60], [-280, -60]]} stroke={T.yellow} lineWidth={4} endArrow opacity={0} />
        <Txt position={[-460, -120]} fontSize={SIZE.body} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'负载 ×10'} />
        {/* r3：两道裂缝原穿过框内文字（crack1 过“天/缓”，crack2 过“队”）；改走框内左右留白，裂缝仍穿透框顶/框底，文字不再被压 */}
        <Line ref={crack1} points={[[-190, -170], [-140, -60], [-190, 50]]} stroke={T.red} lineWidth={4} opacity={0} />
        <Line ref={crack2} points={[[190, -170], [140, -60], [190, 50]]} stroke={T.red} lineWidth={4} opacity={0} />
      </Node>

      {/* b2：每 ×10 重想一次架构：×1 → ×10 → ×100 三步 */}
      <Node ref={g2} opacity={0}>
        {[
          {x: -360, label: '负载 ×1', sub: '这套架构'},
          {x: 0, label: '负载 ×10', sub: '重想一次'},
          {x: 360, label: '负载 ×100', sub: '再重想一次'},
        ].map((s, i) => (
          <Node key={`u7-step-${i}`} ref={[step1, step2, step3][i]} position={[s.x, -40]} opacity={0}>
            <Rect width={300} height={200} radius={16} fill={T.card} stroke={i === 0 ? T.blue : T.yellow} lineWidth={2}>
              <Txt position={[0, -40]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={s.label} />
              <Txt position={[0, 40]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={s.sub} />
            </Rect>
          </Node>
        ))}
        <Txt position={[0, 140]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'甚至更频繁'} />
      </Node>

      {/* b3：纵向扩展——一台机器越变越大，越变越贵 */}
      <Node ref={g3} opacity={0}>
        <Txt position={[0, -220]} fontSize={SIZE.title} fontWeight={700} fill={T.white} fontFamily={FONT.serif} text={'纵向扩展 scaling up'} />
        <Rect ref={bigMachine} position={[0, -20]} width={220} height={160} radius={16} fill={T.card} stroke={T.blue} lineWidth={3}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'一台更强的机器'} />
        </Rect>
        <Txt ref={priceTag} position={[0, 170]} fontSize={SIZE.body} fontWeight={700} fill={T.red} fontFamily={FONT.sans} opacity={0} text={'越来越贵'} />
      </Node>

      {/* b4：横向扩展——一台变多台，负载分流 */}
      <Node ref={g4} opacity={0}>
        <Txt position={[0, -220]} fontSize={SIZE.title} fontWeight={700} fill={T.white} fontFamily={FONT.serif} text={'横向扩展 scaling out'} />
        {[-330, -110, 110, 330].map((x, i) => (
          <Rect key={`u7-m4-${i}`} ref={smallMachines[i]} position={[x, -40]} width={180} height={140} radius={14} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'小机器'} />
          </Rect>
        ))}
        {[-330, -110, 110, 330].map((x, i) => (
          <Circle key={`u7-dot-${i}`} ref={loadDots[i]} position={[x, -190]} width={26} height={26} fill={T.yellow} opacity={0} />
        ))}
        <Txt position={[0, 140]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'负载分给多台小机器'} />
      </Node>

      {/* b5：shared-nothing——机器之间不共享东西，各干各的 */}
      <Node ref={g5} opacity={0}>
        <Txt position={[0, -220]} fontSize={SIZE.title} fontWeight={700} fill={T.white} fontFamily={FONT.serif} text={'shared-nothing 架构'} />
        {[-330, -110, 110, 330].map((x, i) => (
          <Node key={`u7-sn-${i}`} ref={snMachines[i]} position={[x, -40]} opacity={0}>
            <Rect width={180} height={140} radius={14} fill={T.card} stroke={T.green} lineWidth={2}>
              <Txt position={[0, -20]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'机器'} />
              <Txt position={[0, 30]} fontSize={SIZE.min} fill={T.muted} fontFamily={FONT.sans} text={'自己的数据'} />
            </Rect>
          </Node>
        ))}
        <Txt ref={snTerm} position={[0, 140]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} opacity={0} text={'不共享，各干各的'} />
      </Node>

      {/* b6：单机简单便宜起步，高端机器标价飙升 */}
      <Node ref={g6} opacity={0}>
        <Txt position={[-300, -230]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'单机起步'} />
        <Rect position={[-300, -40]} width={220} height={160} radius={16} fill={T.card} stroke={T.green} lineWidth={2} />
        <Txt position={[-300, -40]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'简单 · 便宜'} />
        <Rect ref={cheapBar} position={[-300, 120]} offset={[0, 1]} width={220} height={10} radius={6} fill={T.green} />
        <Txt position={[300, -230]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'高端机器'} />
        <Rect position={[300, -40]} width={220} height={160} radius={16} fill={T.card} stroke={T.red} lineWidth={2} />
        <Txt position={[300, -40]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'很贵'} />
        <Rect ref={priceBar} position={[300, 120]} offset={[0, 1]} width={220} height={10} radius={6} fill={T.red} />
        <Txt position={[300, 170]} fontSize={SIZE.label} fill={T.red} fontFamily={FONT.sans} text={'重负载绕不开横向'} />
      </Node>

      {/* b7：务实混合——几台强机 vs 一大群小虚拟机 */}
      <Node ref={g7} opacity={0}>
        <Node ref={strongGroup} opacity={0}>
          <Txt position={[-300, -230]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'几台比较强的机器'} />
          {[-390, -300, -210].map((x, i) => (
            <Rect key={`u7-strong-${i}`} position={[x, -40]} width={150} height={130} radius={14} fill={T.card} stroke={T.green} lineWidth={2} />
          ))}
        </Node>
        <Node ref={vmGroup} opacity={0}>
          <Txt position={[300, -230]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'一大群小虚拟机'} />
          {[-60, 0, 60, -30, 30].map((dx, i) => (
            <Rect key={`u7-vm-${i}`} position={[300 + dx, -90 + Math.floor(i / 3) * 110]} width={80} height={70} radius={10} fill={T.card} stroke={T.muted} lineWidth={2} />
          ))}
          <Txt position={[300, 110]} fontSize={SIZE.min} fill={T.muted} fontFamily={FONT.sans} text={'……还有很多'} />
        </Node>
        <Txt ref={check7} position={[-300, 140]} fontSize={SIZE.body} fontWeight={700} fill={T.green} fontFamily={FONT.sans} opacity={0} text={'✓ 更简单、更便宜'} />
      </Node>

      {/* b8：混合也要算总账——简单、便宜、运维成本一起算 */}
      <Node ref={g8} opacity={0}>
        <Txt position={[0, -230]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'算总账，不只看单价'} />
        {[
          {x: -360, label: '简单', h: 150, c: T.green},
          {x: 0, label: '便宜', h: 110, c: T.blue},
          {x: 360, label: '运维成本', h: 190, c: T.yellow},
        ].map((b, i) => (
          <Node key={`u7-cost-${i}`} position={[b.x, 0]}>
            <Rect ref={costBars[i]} position={[0, 80]} offset={[0, 1]} width={180} height={10} radius={8} fill={b.c} />
            <Txt position={[0, 140]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={b.label} />
          </Node>
        ))}
      </Node>
    </>,
  );

  // b1：钩子——适合今天负载的架构，扛得住 10 倍负载吗？
  // 箭头画满 1.5s，两道裂缝错开出现（旁白说到“大概率扛不住”时裂开）
  say('10 倍负载扛得住吗');
  yield* beat(
    'b1',
    all(
      g1().opacity(1, 0.6),
      sequence(1.2, loadArrow().opacity(1, 0.2), crack1().opacity(1, 0.5), crack2().opacity(1, 0.5)),
    ),
  );

  // b2：每增一个数量级，就要重新思考一次架构——三步依次出现
  say('每数量级重想一次架构');
  yield* beat(
    'b2',
    all(
      g1().opacity(0, 0.5),
      g2().opacity(1, 0.5),
      sequence(1.8, step1().opacity(1, 0.6), step2().opacity(1, 0.6), step3().opacity(1, 0.6)),
    ),
  );

  // b3：纵向扩展——机器越变越大，标价随后出现
  say('纵向扩展 scaling up');
  yield* beat(
    'b3',
    all(
      g2().opacity(0, 0.5),
      g3().opacity(1, 0.6),
      bigMachine().width(420, 2.6),
      bigMachine().height(240, 2.6),
      delay(2.8, priceTag().opacity(1, 0.6)),
    ),
  );

  // b4：横向扩展——一台变多台，负载点依次落下分流
  say('横向扩展');
  yield* beat(
    'b4',
    all(
      g3().opacity(0, 0.5),
      g4().opacity(1, 0.5),
      sequence(0.7, ...smallMachines.map(m => m().opacity(1, 0.5))),
      sequence(0.7, ...loadDots.map((d, i) => all(d().opacity(1, 0.4), d().position(dotTargets[i], 1.2)))),
    ),
  );

  // b5：shared-nothing——机器各自独立出现
  say('shared-nothing');
  yield* beat(
    'b5',
    all(
      g4().opacity(0, 0.5),
      g5().opacity(1, 0.5),
      sequence(0.6, ...snMachines.map(m => m().opacity(1, 0.5))),
      delay(3.2, snTerm().opacity(1, 0.6)),
    ),
  );

  // b6：单机简单便宜，高端机器标价飙升——价格条慢慢涨满整拍
  say('单机简单，高端贵');
  yield* beat(
    'b6',
    all(
      g5().opacity(0, 0.5),
      g6().opacity(1, 0.6),
      cheapBar().height(40, 2.0),
      priceBar().height(240, 4.5),
    ),
  );

  // b7：务实混合——强机组先出，虚拟机群后出，结论最后出
  say('几台强机更划算');
  yield* beat(
    'b7',
    all(
      g6().opacity(0, 0.5),
      g7().opacity(1, 0.5),
      delay(0.5, strongGroup().opacity(1, 0.6)),
      delay(2.5, vmGroup().opacity(1, 0.6)),
      delay(5.5, check7().opacity(1, 0.6)),
    ),
  );

  // b8：算总账——三项成本条一起长
  say('算总账，不只看单价');
  yield* beat(
    'b8',
    all(
      g7().opacity(0, 0.5),
      g8().opacity(1, 0.6),
      costBars[0]().height(150, 2.5),
      costBars[1]().height(110, 2.5),
      costBars[2]().height(190, 2.5),
    ),
  );
});
