// U1 场景 1（MC）：b1、b3–b11 —— 钩子、路线图、三把尺子、CPU 不是瓶颈、五种标准构件。
// 分镜：skill-ch01/ch01-beats.md U1 一节；原文：DDIA §1.0–1.1（书页 p3–4，PDF p25–26）。
// 时长全部来自 timeline/u1.json（beat() 驱动），不手写 waitFor 魔法数字。
// 颜色、字号、安全区一律取自 lib/theme，不手写十六进制色值。
// 每拍动画尽量占满该拍时长：用 all() 里不同时长的补间实现错峰出现，不用 chain(waitFor)。
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
  const g1 = createRef<Node>();
  const phone = createRef<Rect>();
  const chips1 = [0, 1, 2, 3, 4].map(() => createRef<Rect>());
  const g3 = createRef<Node>();
  const roadLine1 = createRef<Rect>();
  const roadLine2 = createRef<Rect>();
  const roadDot1 = createRef<Circle>();
  const roadDot2 = createRef<Circle>();
  const g4 = createRef<Node>();
  const rulers = [0, 1, 2].map(() => createRef<Rect>());
  const g5 = createRef<Node>();
  const needle = createRef<Line>();
  const bars5 = [0, 1, 2].map(() => createRef<Rect>());
  const g6 = createRef<Node>();
  const labels6 = [0, 1, 2].map(() => createRef<Txt>());
  const g7 = createRef<Node>();
  const slots = [0, 1, 2, 3, 4].map(() => createRef<Rect>());
  const dbBox = createRef<Rect>();
  const dbRow = createRef<Rect>();
  const cacheBox = createRef<Rect>();
  const slowDot = createRef<Circle>();
  const fastDot = createRef<Circle>();
  const g9 = createRef<Node>();
  const kwTag = createRef<Rect>();
  const hitRow = createRef<Rect>();
  const g10 = createRef<Node>();
  const msgDot = createRef<Circle>();
  const g11 = createRef<Node>();
  const pile = [0, 1, 2].map(() => createRef<Rect>());
  const timer11 = createRef<Rect>();

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

      {/* b1：手机 App 打开，背后五个构件图标拼合 */}
      <Node ref={g1} opacity={0}>
        <Rect ref={phone} position={[-380, -40]} width={220} height={380} radius={28} fill={T.card} stroke={T.blue} lineWidth={3}>
          <Txt position={[0, -120]} fontSize={SIZE.title} fontWeight={700} fill={T.white} fontFamily={FONT.sans} text={'App'} />
          <Txt position={[0, -40]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'每天打开的'} />
          <Txt position={[0, 0]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'那个应用'} />
        </Rect>
        {['数据库', '缓存', '搜索索引', '流处理', '批处理'].map((label, i) => (
          <Rect
            key={`u1-c1-${i}`}
            ref={chips1[i]}
            position={[120 + (i % 3) * 180, -160 + Math.floor(i / 3) * 220]}
            width={170}
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
      </Node>

      {/* b3：路线图——原理与实践两条线 */}
      <Node ref={g3} opacity={0}>
        <Txt position={[0, -200]} fontSize={SIZE.title} fontWeight={700} fill={T.white} fontFamily={FONT.serif} text={'一趟原理与实践之旅'} />
        {/* r3：标签原在 [-420, -80] / [-420, 40]，正压在两条横条（中心 y=-80 / 40，宽 920）上，横条从字中穿过；移到各自横条上方 */}
        <Txt position={[-420, -125]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'原理'} />
        <Rect position={[0, -80]} width={920} height={10} radius={5} fill={T.card} stroke={T.line} lineWidth={2} />
        <Rect ref={roadLine1} position={[-460, -80]} offset={[-1, 0]} width={0} height={10} radius={5} fill={T.blue} />
        <Circle ref={roadDot1} position={[-460, -80]} width={26} height={26} fill={T.blue} />
        <Txt position={[-420, -5]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'实践'} />
        <Rect position={[0, 40]} width={920} height={10} radius={5} fill={T.card} stroke={T.line} lineWidth={2} />
        <Rect ref={roadLine2} position={[-460, 40]} offset={[-1, 0]} width={0} height={10} radius={5} fill={T.green} />
        <Circle ref={roadDot2} position={[-460, 40]} width={26} height={26} fill={T.green} />
      </Node>

      {/* b4：三把尺子并排亮起 */}
      <Node ref={g4} opacity={0}>
        {[
          {x: -360, label: '可靠', sub: 'Reliability'},
          {x: 0, label: '可扩展', sub: 'Scalability'},
          {x: 360, label: '可维护', sub: 'Maintainability'},
        ].map((r, i) => (
          <Rect
            key={`u1-ruler-${i}`}
            ref={rulers[i]}
            position={[r.x, -40]}
            width={300}
            height={180}
            radius={16}
            fill={T.card}
            stroke={T.yellow}
            lineWidth={3}
            opacity={0}
          >
            <Txt position={[0, -30]} fontSize={SIZE.body} fontWeight={700} fill={T.white} fontFamily={FONT.sans} text={r.label} />
            <Txt position={[0, 40]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={r.sub} />
          </Rect>
        ))}
      </Node>

      {/* b5：CPU 表盘指针不动，三条条上涨 */}
      <Node ref={g5} opacity={0}>
        <Circle position={[-380, -80]} width={220} height={220} fill={T.card} stroke={T.line} lineWidth={3} />
        <Txt position={[-380, -205]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'CPU'} />
        <Line ref={needle} points={[[-380, -80], [-380, -170]]} stroke={T.green} lineWidth={6} />
        <Txt position={[-380, 80]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'指针不动'} />
        {[
          {x: -60, h: 120, label: '数据量'},
          {x: 160, h: 190, label: '复杂度'},
          {x: 380, h: 260, label: '变化速度'},
        ].map((b, i) => (
          <Rect
            key={`u1-bar5-${i}`}
            ref={bars5[i]}
            position={[b.x, 120]}
            offset={[0, 1]}
            width={110}
            height={10}
            radius={8}
            fill={T.red}
          />
        ))}
        <Txt position={[-60, 170]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'数据量'} />
        <Txt position={[160, 170]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'复杂度'} />
        <Txt position={[380, 170]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'变化速度'} />
      </Node>

      {/* b6：三条条分别标出量、复杂度、变化速度 */}
      <Node ref={g6} opacity={0}>
        {['量', '复杂度', '变化速度'].map((label, i) => (
          <Txt
            key={`u1-lab6-${i}`}
            ref={labels6[i]}
            position={[-300 + i * 300, -240]}
            fontSize={SIZE.body}
            fontWeight={700}
            fill={T.yellow}
            fontFamily={FONT.sans}
            opacity={0}
            text={label}
          />
        ))}
        {/* r2 #7：原 [0, 120] 与柱条基线同高、压住两根柱条底部，移到柱顶之上 */}
        <Txt position={[0, -180]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'这三件事，才是难的地方'} />
      </Node>

      {/* b7：五个构件槽位 + 数据库圆柱 */}
      <Node ref={g7} opacity={0}>
        {[0, 1, 2, 3, 4].map(i => (
          <Rect
            key={`u1-slot-${i}`}
            ref={slots[i]}
            position={[-440 + i * 220, -140]}
            width={180}
            height={120}
            radius={14}
            fill={T.card}
            stroke={T.line}
            lineWidth={2}
            lineDash={[8, 6]}
            opacity={0}
          />
        ))}
        <Rect ref={dbBox} position={[-440, -140]} width={180} height={120} radius={14} fill={T.card} stroke={T.blue} lineWidth={3} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'数据库'} />
        </Rect>
        <Rect ref={dbRow} position={[-440, 60]} width={180} height={26} radius={8} fill={T.blue} opacity={0} />
        <Txt position={[-440, 120]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'存入一行数据'} />
      </Node>

      {/* b8：缓存盒子——慢算结果存入，第二次直接取 */}
      <Node ref={cacheBox} opacity={0}>
        <Rect position={[-220, -140]} width={180} height={120} radius={14} fill={T.card} stroke={T.green} lineWidth={3}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'缓存'} />
        </Rect>
        <Circle ref={slowDot} position={[-440, 60]} width={26} height={26} fill={T.yellow} opacity={0} />
        <Circle ref={fastDot} position={[-220, 60]} width={26} height={26} fill={T.green} opacity={0} />
        <Txt position={[-220, 120]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'第二次直接取'} />
      </Node>

      {/* b9：搜索索引——关键词高亮命中 */}
      <Node ref={g9} opacity={0}>
        <Rect position={[0, -140]} width={220} height={120} radius={14} fill={T.card} stroke={T.yellow} lineWidth={3}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'搜索索引'} />
        </Rect>
        <Rect ref={kwTag} position={[0, -20]} width={220} height={54} radius={10} fill={T.card} stroke={T.yellow} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.sans} text={'关键词'} />
        </Rect>
        <Rect ref={hitRow} position={[0, 80]} width={420} height={54} radius={10} fill={T.card} stroke={T.line} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'命中的结果'} />
        </Rect>
      </Node>

      {/* b10：流处理——消息沿队列飞向另一进程 */}
      <Node ref={g10} opacity={0}>
        <Rect position={[-380, -60]} width={220} height={120} radius={14} fill={T.card} stroke={T.blue} lineWidth={3}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'进程 A'} />
        </Rect>
        <Line points={[[-260, -60], [260, -60]]} stroke={T.line} lineWidth={3} endArrow />
        <Rect position={[0, -110]} width={220} height={40} radius={8} fill={T.card} stroke={T.line} lineWidth={2}>
          <Txt fontSize={SIZE.min} fill={T.muted} fontFamily={FONT.sans} text={'消息队列'} />
        </Rect>
        <Rect position={[380, -60]} width={220} height={120} radius={14} fill={T.card} stroke={T.blue} lineWidth={3}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'进程 B'} />
        </Rect>
        <Circle ref={msgDot} position={[-260, -60]} width={30} height={30} fill={T.yellow} opacity={0} />
        <Txt position={[0, 80]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'异步去办'} />
      </Node>

      {/* b11：批处理——成堆数据推进管道，定时触发 */}
      <Node ref={g11} opacity={0}>
        <Rect position={[0, -80]} width={920} height={70} radius={35} fill={T.card} stroke={T.line} lineWidth={2} />
        <Txt position={[0, -160]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'批处理管道 · 定期触发'} />
        {[0, 1, 2].map(i => (
          <Rect
            key={`u1-pile-${i}`}
            ref={pile[i]}
            position={[-420 + i * 60, -80]}
            width={40}
            height={40}
            radius={8}
            fill={T.blue}
            opacity={0}
          />
        ))}
        <Rect position={[0, 60]} width={920} height={26} radius={13} fill={T.card} stroke={T.line} lineWidth={2} />
        <Rect ref={timer11} position={[-460, 60]} offset={[-1, 0]} width={0} height={26} radius={13} fill={T.green} />
        <Txt position={[0, 120]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'攒下来的数据一次算完'} />
      </Node>
    </>,
  );

  // b1：钩子——一个 App，背后多个工具拼合（图标错峰出现后缓慢向手机靠拢，动画占满整拍）
  say('一个 App，多个工具');
  yield* beat(
    'b1',
    all(
      g1().opacity(1, 0.6),
      phone().position([-320, -40], 2.5),
      chips1[0]().opacity(1, 0.8),
      chips1[1]().opacity(1, 1.6),
      chips1[2]().opacity(1, 2.4),
      chips1[3]().opacity(1, 3.2),
      chips1[4]().opacity(1, 4.0),
      chips1[0]().position([90, -160], 6.0),
      chips1[1]().position([270, -160], 6.0),
      chips1[2]().position([450, -160], 6.0),
      chips1[3]().position([90, 60], 6.0),
      chips1[4]().position([270, 60], 6.0),
    ),
  );

  // b3：好的基础设施感觉不到存在——这本书带你看清它怎么搭起来
  say('原理与实践之旅');
  yield* beat(
    'b3',
    all(
      g1().opacity(0, 0.5),
      g3().opacity(1, 0.6),
      roadLine1().width(920, 4),
      roadLine2().width(920, 5),
      roadDot1().position([460, -80], 4),
      roadDot2().position([460, 40], 5),
    ),
  );

  // b4：整本书只量三件事——三把尺子并排亮起
  say('三把尺子');
  yield* beat(
    'b4',
    all(
      g3().opacity(0, 0.5),
      g4().opacity(1, 0.6),
      rulers[0]().opacity(1, 1.2),
      rulers[1]().opacity(1, 2.4),
      rulers[2]().opacity(1, 3.6),
    ),
  );

  // b5：数据密集型应用，瓶颈不在 CPU——表盘不动，三条条上涨
  say('瓶颈不在 CPU');
  yield* beat(
    'b5',
    all(
      g4().opacity(0, 0.5),
      g5().opacity(1, 0.6),
      bars5[0]().height(120, 2.5),
      bars5[1]().height(190, 3.5),
      bars5[2]().height(260, 4.5),
    ),
  );

  // b6：量、复杂度、变化速度——三条条分别标出来
  say('量 · 复杂度 · 速度');
  yield* beat(
    'b6',
    all(
      labels6[0]().opacity(1, 1.2),
      labels6[1]().opacity(1, 2.4),
      labels6[2]().opacity(1, 3.6),
      g6().opacity(1, 0.6),
      bars5[0]().height(140, 5),
      bars5[1]().height(210, 5),
      bars5[2]().height(280, 5),
    ),
  );

  // b7a：通常由五种标准构件搭起来——五个空槽位出现
  say('五种标准构件');
  yield* beat(
    'b7a',
    all(
      g5().opacity(0, 0.5),
      g6().opacity(0, 0.5),
      g7().opacity(1, 0.6),
      slots[0]().opacity(1, 0.8),
      slots[1]().opacity(1, 1.4),
      slots[2]().opacity(1, 2.0),
      slots[3]().opacity(1, 2.6),
      slots[4]().opacity(1, 3.2),
    ),
  );

  // b7b：第一种，数据库——圆柱出现，存入一行数据（数据行缓慢滑入，占满整拍）
  // r2：sequence(0) 是重叠跑不是串行，改 chain
  say('数据库：存数据');
  yield* beat(
    'b7b',
    chain(
      all(slots[0]().opacity(0, 0.4), dbBox().opacity(1, 0.8)),
      all(dbRow().opacity(1, 0.5), dbRow().position([-440, -80], 3.2)),
    ),
  );

  // b8a：第二种是缓存——缓存盒子出现
  say('缓存');
  yield* beat('b8a', all(cacheBox().opacity(1, 0.5)));

  // b8b：慢算结果存入缓存，第二次直接取
  // r2：sequence(0) 是重叠跑不是串行，改 chain（先慢后快，顺序不能丢）
  say('缓存：记下结果');
  yield* beat(
    'b8b',
    chain(
      all(slowDot().opacity(1, 0.4), slowDot().position([-220, -80], 1.4)),
      all(fastDot().opacity(1, 0.4), fastDot().position([-220, -80], 0.8)),
    ),
  );

  // b9：第三种，搜索索引——关键词高亮命中
  say('搜索索引：按词搜');
  yield* beat(
    'b9',
    all(
      cacheBox().opacity(0, 0.5),
      slowDot().opacity(0, 0.3),
      fastDot().opacity(0, 0.3),
      g7().opacity(0, 0.5),
      g9().opacity(1, 0.6),
      kwTag().opacity(1, 1.2),
      hitRow().opacity(1, 2.0),
    ),
  );

  // b10：第四种，流处理——消息沿队列飞向另一进程
  say('流处理：异步发消息');
  yield* beat(
    'b10',
    all(
      g9().opacity(0, 0.5),
      g10().opacity(1, 0.6),
      msgDot().opacity(1, 0.5),
      msgDot().position([260, -60], 3.2),
    ),
  );

  // b11：第五种，批处理——成堆数据推进管道，定时触发
  say('批处理：定期算');
  yield* beat(
    'b11',
    all(
      g10().opacity(0, 0.5),
      g11().opacity(1, 0.6),
      pile[0]().opacity(1, 0.6),
      pile[1]().opacity(1, 1.2),
      pile[2]().opacity(1, 1.8),
      pile[0]().position([300, -80], 3.5),
      pile[1]().position([360, -80], 3.5),
      pile[2]().position([420, -80], 3.5),
      timer11().width(920, 4.0),
    ),
  );
});
