// U7 场景 4（MC）：b25–b30 —— 早期产品先迭代功能、Twitter 三版架构、
// 五个通用构件重拼、回扣三句话、想一想、下一站好维护。
// 分镜：skill-ch01/ch01-beats.md U7 一节；原文：DDIA §1.10（书页 p18，PDF p40）。
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
  const g25 = createRef<Node>();
  const team = createRef<Node>();
  const featureBlocks = [0, 1, 2].map(() => createRef<Rect>());
  const laterTag = createRef<Txt>();
  const g26 = createRef<Node>();
  const v1 = createRef<Node>();
  const v2 = createRef<Node>();
  const vMix = createRef<Node>();
  const g27 = createRef<Node>();
  const components = [0, 1, 2, 3, 4].map(() => createRef<Node>());
  const g28 = createRef<Node>();
  const recapLines = [0, 1, 2].map(() => createRef<Txt>());
  const g29 = createRef<Node>();
  const g30 = createRef<Node>();
  const pillars = [0, 1, 2].map(() => createRef<Node>());

  const say = (text: string) => anchor().text(text);

  const componentDefs = [
    {x: -440, label: '数据库', sub: '存数据'},
    {x: -220, label: '缓存', sub: '记结果'},
    {x: 0, label: '搜索索引', sub: '按词搜'},
    {x: 220, label: '流处理', sub: '异步发消息'},
    {x: 440, label: '批处理', sub: '定期算'},
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

      {/* b25：小团队先做功能，扩容留到以后 */}
      <Node ref={g25} opacity={0}>
        <Node ref={team}>
          <Txt position={[-360, -230]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'早期小团队'} />
          {[-420, -360, -300].map((x, i) => (
            <Circle key={`u7-team-${i}`} position={[x, -60]} width={80} height={80} fill={T.blue} />
          ))}
        </Node>
        {['功能 A', '功能 B', '功能 C'].map((t, i) => (
          <Rect key={`u7-feat-${i}`} ref={featureBlocks[i]} position={[120, -140 + i * 110]} width={380} height={70} radius={12} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={t} />
          </Rect>
        ))}
        <Txt ref={laterTag} position={[120, 210]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} opacity={0} text={'扩容留到以后'} />
      </Node>

      {/* b26：Twitter 三版架构依次出现 */}
      <Node ref={g26} opacity={0}>
        <Node ref={v1} opacity={0}>
          <Rect position={[-360, -40]} width={300} height={200} radius={16} fill={T.card} stroke={T.blue} lineWidth={2} />
          <Txt position={[-360, -100]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'做法 1'} />
          <Txt position={[-360, 0]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'读时组装'} />
        </Node>
        <Node ref={v2} opacity={0}>
          <Rect position={[0, -40]} width={300} height={200} radius={16} fill={T.card} stroke={T.blue} lineWidth={2} />
          <Txt position={[0, -100]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'做法 2'} />
          <Txt position={[0, 0]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'写时扇出'} />
        </Node>
        <Node ref={vMix} opacity={0}>
          <Rect position={[360, -40]} width={300} height={200} radius={16} fill={T.card} stroke={T.green} lineWidth={2} />
          <Txt position={[360, -100]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'混合做法'} />
          <Txt position={[360, 0]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'名人例外'} />
        </Node>
        <Txt position={[0, 140]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'每长大一次，重想一次'} />
      </Node>

      {/* b27：五个通用构件拼成新图案 */}
      <Node ref={g27} opacity={0}>
        {componentDefs.map((c, i) => (
          <Node key={`u7-comp-${i}`} ref={components[i]} position={[c.x, -60]} opacity={0}>
            <Rect width={180} height={140} radius={14} fill={T.card} stroke={T.blue} lineWidth={2}>
              <Txt position={[0, -20]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={c.label} />
              <Txt position={[0, 30]} fontSize={SIZE.min} fill={T.muted} fontFamily={FONT.sans} text={c.sub} />
            </Rect>
          </Node>
        ))}
        <Txt position={[0, 140]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'通用构件 · 熟悉的模式'} />
      </Node>

      {/* b28：回扣三句话 */}
      <Node ref={g28} opacity={0}>
        <Txt ref={recapLines[0]} position={[0, -160]} fontSize={SIZE.title} fontWeight={700} fill={T.white} fontFamily={FONT.serif} opacity={0} text={'量对负载参数'} />
        <Txt ref={recapLines[1]} position={[0, -40]} fontSize={SIZE.title} fontWeight={700} fill={T.white} fontFamily={FONT.serif} opacity={0} text={'按假设建架构'} />
        <Txt ref={recapLines[2]} position={[0, 80]} fontSize={SIZE.title} fontWeight={700} fill={T.white} fontFamily={FONT.serif} opacity={0} text={'每数量级重想一次'} />
      </Node>

      {/* b29：想一想——哪个操作最常见？ */}
      <Node ref={g29} opacity={0}>
        <Txt position={[0, -140]} fontSize={SIZE.title} fontWeight={700} fill={T.white} fontFamily={FONT.serif} text={'停下来想一想'} />
        <Rect position={[0, -20]} width={560} height={120} radius={16} fill={T.card} stroke={T.yellow} lineWidth={2}>
          <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'你的系统里，哪个操作最常见？'} />
        </Rect>
        <Txt position={[0, 110]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'架构是按它建的吗？'} />
      </Node>

      {/* b30：下一站——好维护三支柱 */}
      <Node ref={g30} opacity={0}>
        <Txt position={[0, -220]} fontSize={SIZE.title} fontWeight={700} fill={T.white} fontFamily={FONT.serif} text={'下一站：好维护'} />
        {[
          {x: -360, label: '可运维性'},
          {x: 0, label: '简单性'},
          {x: 360, label: '可演化性'},
        ].map((p, i) => (
          <Node key={`u7-pillar-${i}`} ref={pillars[i]} position={[p.x, -40]} opacity={0}>
            <Rect width={260} height={220} radius={16} fill={T.card} stroke={T.green} lineWidth={2}>
              <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={p.label} />
            </Rect>
          </Node>
        ))}
      </Node>
    </>,
  );

  // b25：小团队先做功能——功能块逐个出现，扩容留到以后
  say('先迭代功能，再扩容');
  yield* beat(
    'b25',
    all(
      g25().opacity(1, 0.5),
      sequence(1.8, ...featureBlocks.map(f => f().opacity(1, 0.6))),
      delay(5.5, laterTag().opacity(1, 0.6)),
    ),
  );

  // b26：Twitter 三版依次出现
  say('Twitter 每长大就重想');
  yield* beat(
    'b26',
    all(
      g25().opacity(0, 0.5),
      g26().opacity(1, 0.5),
      sequence(2.0, v1().opacity(1, 0.6), v2().opacity(1, 0.6), vMix().opacity(1, 0.6)),
    ),
  );

  // b27：五个构件逐个出现，拼成新图案
  say('还是那五个构件');
  yield* beat(
    'b27',
    all(
      g26().opacity(0, 0.5),
      g27().opacity(1, 0.5),
      sequence(1.2, ...components.map(c => c().opacity(1, 0.5))),
    ),
  );

  // b28：回扣三句话依次出现
  say('量对参数，按假设建');
  yield* beat(
    'b28',
    all(
      g27().opacity(0, 0.5),
      g28().opacity(1, 0.5),
      sequence(1.8, ...recapLines.map(l => l().opacity(1, 0.6))),
    ),
  );

  // b29：想一想
  say('哪个操作最常见');
  yield* beat('b29', all(g28().opacity(0, 0.5), g29().opacity(1, 0.6)));

  // b30：下一站好维护——三支柱依次亮起
  say('下一站：好维护');
  yield* beat(
    'b30',
    all(
      g29().opacity(0, 0.5),
      g30().opacity(1, 0.5),
      sequence(0.8, ...pillars.map(p => p().opacity(1, 0.5))),
    ),
  );
});
