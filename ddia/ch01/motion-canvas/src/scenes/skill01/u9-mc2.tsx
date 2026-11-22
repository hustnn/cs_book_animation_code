// U9 场景 2（MC）：b17–b32 —— 可演化性、Agile、Twitter 重构之问、全章总结、三把尺子收束。
// 分镜：skill-ch01/ch01-beats.md U9 一节；原文：DDIA §1.14–1.15（书页 p21–23，PDF p43–45）。
// 时长全部来自 timeline/u9.json（beat() 驱动），不手写 waitFor。
// 颜色、字号、安全区一律取自 lib/theme，不手写十六进制色值。
import {Circle, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, chain, createRef, sequence, waitFor} from '@motion-canvas/core';
import {makeBeats} from '../../lib/beats';
import {FONT, SAFE, SIZE, T} from '../../lib/theme';
import timeline from '../../timeline/u9.json';

export default makeScene2D(function* (view) {
  view.fill(T.bg);
  const beat = makeBeats(timeline);

  const header = createRef<Txt>();
  const anchor = createRef<Txt>();
  const g17 = createRef<Node>();
  const reqChips = [0, 1, 2, 3, 4, 5, 6].map(() => createRef<Rect>());
  const g18 = createRef<Node>();
  const driverBadges = [0, 1, 2, 3, 4, 5, 6].map(() => createRef<Rect>());
  const g19 = createRef<Node>();
  const cycleNodes = [0, 1, 2, 3].map(() => createRef<Rect>());
  const cycleDot = createRef<Circle>();
  const agileTags = [0, 1].map(() => createRef<Rect>());
  const g20 = createRef<Node>();
  const srcFiles = [0, 1, 2].map(() => createRef<Rect>());
  const g21 = createRef<Node>();
  const v1Panel = createRef<Rect>();
  const v2Panel = createRef<Rect>();
  const refactorArrow = createRef<Txt>();
  const sysTag = createRef<Txt>();
  const g22 = createRef<Node>();
  const simpleBar = createRef<Rect>();
  const changeBar = createRef<Rect>();
  const tieBand = createRef<Rect>();
  const g23 = createRef<Node>();
  const g24 = createRef<Node>();
  const funcChips = [0, 1, 2, 3].map(() => createRef<Rect>());
  const nonfuncChips = [0, 1, 2, 3, 4, 5].map(() => createRef<Rect>());
  const g25 = createRef<Node>();
  const faultDolls = [0, 1, 2].map(() => createRef<Circle>());
  const ftCover = createRef<Rect>();
  const g26 = createRef<Node>();
  const loadBlock = createRef<Rect>();
  const perfBlock = createRef<Rect>();
  const rulers = [0, 1, 2].map(() => createRef<Rect>());
  const g27 = createRef<Node>();
  const loadBar = createRef<Rect>();
  const capBar = createRef<Rect>();
  const greenLight = createRef<Circle>();
  const g28 = createRef<Node>();
  const people = [0, 1].map(() => createRef<Circle>());
  const checkTags = [0, 1, 2].map(() => createRef<Txt>());
  const g29 = createRef<Node>();
  const pillBottle = createRef<Rect>();
  const crossLines = [0, 1].map(() => createRef<Line>());
  const g30 = createRef<Node>();
  const motifs = [0, 1, 2, 3, 4].map(() => createRef<Circle>());
  const nextDoor = createRef<Rect>();
  const g31 = createRef<Node>();
  const figThumb = createRef<Rect>();
  const part3Tag = createRef<Txt>();
  const g32 = createRef<Node>();
  const toolbox = createRef<Rect>();
  const rulerSlats = [0, 1, 2].map(() => createRef<Rect>());
  const nextChapter = createRef<Txt>();

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
        text={'第 1 章 · 简单、可演化与总结'}
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

      {/* b17：需求清单逐条变色 */}
      <Node ref={g17} opacity={0}>
        <Txt position={[0, -240]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'需求清单'} />
        {[
          {x: -380, y: -160, label: '学到新事实'},
          {x: 0, y: -160, label: '冒出没预见过的用例'},
          {x: 380, y: -160, label: '业务优先级变'},
          {x: -380, y: -60, label: '用户要新功能'},
          {x: 0, y: -60, label: '新平台取代旧平台'},
          {x: 380, y: -60, label: '法律法规变'},
          {x: 0, y: 60, label: '增长逼着架构变'},
        ].map((c, i) => (
          <Rect
            key={`u9-req-${i}`}
            ref={reqChips[i]}
            position={[c.x, c.y]}
            width={330}
            height={70}
            radius={14}
            fill={T.card}
            stroke={T.line}
            lineWidth={2}
          >
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} textWrap maxWidth={300} text={c.label} />
          </Rect>
        ))}
      </Node>

      {/* b18：七种变化驱动轮流亮起 */}
      <Node ref={g18} opacity={0}>
        {[
          {x: -440, n: '1'},
          {x: -300, n: '2'},
          {x: -160, n: '3'},
          {x: -20, n: '4'},
          {x: 120, n: '5'},
          {x: 260, n: '6'},
          {x: 400, n: '7'},
        ].map((b, i) => (
          <Rect
            key={`u9-driver-${i}`}
            ref={driverBadges[i]}
            position={[b.x, -60]}
            width={110}
            height={110}
            radius={55}
            fill={T.card}
            stroke={T.line}
            lineWidth={2}
            opacity={0}
          >
            <Txt fontSize={SIZE.title} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={b.n} />
          </Rect>
        ))}
        <Txt position={[0, 120]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'七种变化驱动'} />
      </Node>

      {/* b19：小步快跑的循环，TDD 与重构标签 */}
      <Node ref={g19} opacity={0}>
        {[
          {x: 0, y: -200, label: '小步'},
          {x: 220, y: -60, label: '快跑'},
          {x: 0, y: 80, label: '反馈'},
          {x: -220, y: -60, label: '调整'},
        ].map((n, i) => (
          <Rect
            key={`u9-cycle-${i}`}
            ref={cycleNodes[i]}
            position={[n.x, n.y]}
            width={180}
            height={80}
            radius={14}
            fill={T.card}
            stroke={T.blue}
            lineWidth={2}
          >
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={n.label} />
          </Rect>
        ))}
        <Circle ref={cycleDot} position={[0, -200]} width={30} height={30} fill={T.yellow} />
        {[
          {x: -380, label: 'TDD 测试驱动开发'},
          {x: 380, label: '重构'},
        ].map((t, i) => (
          <Rect
            key={`u9-agile-${i}`}
            ref={agileTags[i]}
            position={[t.x, 160]}
            width={300}
            height={80}
            radius={14}
            fill={T.card}
            stroke={T.green}
            lineWidth={2}
            opacity={0}
          >
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} textWrap maxWidth={270} text={t.label} />
          </Rect>
        ))}
      </Node>

      {/* b20：几个源文件小范围重构 */}
      <Node ref={g20} opacity={0}>
        {[0, 1, 2].map(i => (
          <Rect
            key={`u9-src-${i}`}
            ref={srcFiles[i]}
            position={[-300 + i * 300, -60]}
            width={220}
            height={140}
            radius={12}
            fill={T.card}
            stroke={T.blue}
            lineWidth={2}
          >
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={`源文件 ${i + 1}`} />
          </Rect>
        ))}
        <Txt position={[0, 120]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'同一个应用里的几个源文件'} />
      </Node>

      {/* b21：小文件重构放大成整个 Twitter 架构重构 */}
      <Node ref={g21} opacity={0}>
        <Rect ref={v1Panel} position={[-280, -60]} width={420} height={200} radius={16} fill={T.card} stroke={T.red} lineWidth={2}>
          <Txt position={[0, -50]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'做法 1'} />
          <Txt position={[0, 20]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'读时组装'} />
        </Rect>
        <Txt ref={refactorArrow} position={[0, -60]} fontSize={SIZE.title} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'→'} />
        <Rect ref={v2Panel} position={[280, -60]} width={420} height={200} radius={16} fill={T.card} stroke={T.green} lineWidth={2}>
          <Txt position={[0, -50]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'做法 2'} />
          <Txt position={[0, 20]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'写时扇出'} />
        </Rect>
        <Txt position={[0, 120]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'Twitter 时间线怎么重构？'} />
        <Txt ref={sysTag} position={[0, 180]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} opacity={0} text={'大数据系统可能由几个不同应用组成'} />
      </Node>

      {/* b22：简单与可改两根线绑在一起 */}
      <Node ref={g22} opacity={0}>
        <Rect ref={simpleBar} position={[0, -140]} width={700} height={56} radius={12} fill={T.blue}>
          <Txt fontSize={SIZE.label} fill={T.white} fontFamily={FONT.sans} text={'简单易懂'} />
        </Rect>
        <Rect ref={changeBar} position={[0, -20]} width={700} height={56} radius={12} fill={T.green}>
          <Txt fontSize={SIZE.label} fill={T.white} fontFamily={FONT.sans} text={'容易改'} />
        </Rect>
        <Rect ref={tieBand} position={[280, -80]} width={60} height={180} radius={10} fill={T.yellow} opacity={0} />
      </Node>

      {/* b23：术语卡 evolvability */}
      <Node ref={g23} opacity={0}>
        <Rect position={[0, -40]} width={860} height={260} radius={20} fill={T.card} stroke={T.yellow} lineWidth={3}>
          <Txt position={[0, -70]} fontSize={SIZE.title} fontWeight={700} fill={T.white} fontFamily={FONT.serif} text={'evolvability'} />
          <Txt position={[0, 10]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'可演化性'} />
          <Txt position={[0, 70]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'也叫 extensibility / modifiability / plasticity'} />
        </Rect>
      </Node>

      {/* b24：功能 vs 非功能，两列清单对照 */}
      <Node ref={g24} opacity={0}>
        <Txt position={[-300, -230]} fontSize={SIZE.body} fill={T.blue} fontFamily={FONT.sans} text={'功能需求'} />
        <Txt position={[300, -230]} fontSize={SIZE.body} fill={T.yellow} fontFamily={FONT.sans} text={'非功能需求'} />
        {[
          {label: '存'},
          {label: '取'},
          {label: '搜'},
          {label: '处理'},
        ].map((c, i) => (
          <Rect
            key={`u9-func-${i}`}
            ref={funcChips[i]}
            position={[-300, -150 + i * 85]}
            width={260}
            height={64}
            radius={12}
            fill={T.card}
            stroke={T.blue}
            lineWidth={2}
            opacity={0}
          >
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={c.label} />
          </Rect>
        ))}
        {[
          {label: '安全'},
          {label: '可靠'},
          {label: '合规'},
          {label: '可扩展'},
          {label: '兼容'},
          {label: '可维护'},
        ].map((c, i) => (
          <Rect
            key={`u9-nonfunc-${i}`}
            ref={nonfuncChips[i]}
            position={[300, -150 + i * 62]}
            width={260}
            height={52}
            radius={12}
            fill={T.card}
            stroke={T.yellow}
            lineWidth={2}
            opacity={0}
          >
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={c.label} />
          </Rect>
        ))}
      </Node>

      {/* b25：三类故障小人偶排队，容错罩子盖住 */}
      <Node ref={g25} opacity={0}>
        {[
          {x: -300, label: '硬件'},
          {x: 0, label: '软件'},
          {x: 300, label: '人'},
        ].map((d, i) => (
          <Circle
            key={`u9-doll-${i}`}
            ref={faultDolls[i]}
            position={[d.x, -60]}
            width={110}
            height={110}
            fill={T.red}
            opacity={0.9}
          />
        ))}
        {[
          {x: -300, label: '硬件'},
          {x: 0, label: '软件'},
          {x: 300, label: '人'},
        ].map((d, i) => (
          <Txt key={`u9-dollt-${i}`} position={[d.x, 50]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={d.label} />
        ))}
        <Rect ref={ftCover} position={[0, -60]} width={1000} height={220} radius={20} fill={T.green} opacity={0} />
        <Txt position={[0, 140]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'容错把某些故障藏起来'} />
      </Node>

      {/* b26：负载与性能两块拼回三把尺子 */}
      <Node ref={g26} opacity={0}>
        <Rect ref={loadBlock} position={[-280, -60]} width={380} height={160} radius={16} fill={T.card} stroke={T.blue} lineWidth={2}>
          <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'负载'} />
          <Txt position={[0, 40]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'Twitter 时间线'} />
        </Rect>
        <Rect ref={perfBlock} position={[280, -60]} width={380} height={160} radius={16} fill={T.card} stroke={T.yellow} lineWidth={2}>
          <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'性能'} />
          <Txt position={[0, 40]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'响应时间百分位'} />
        </Rect>
        {[
          {x: -320, label: '可靠'},
          {x: 0, label: '可扩展'},
          {x: 320, label: '可维护'},
        ].map((r, i) => (
          <Rect
            key={`u9-ruler-${i}`}
            ref={rulers[i]}
            position={[r.x, -60]}
            width={200}
            height={220}
            radius={16}
            fill={T.blue}
            opacity={0}
          >
            <Txt fontSize={SIZE.label} fill={T.white} fontFamily={FONT.sans} text={r.label} />
          </Rect>
        ))}
      </Node>

      {/* b27：加容量，高负载下绿灯仍亮 */}
      <Node ref={g27} opacity={0}>
        <Rect position={[0, -140]} width={900} height={40} radius={20} fill={T.card} stroke={T.line} lineWidth={2} />
        <Rect ref={loadBar} position={[-450, -140]} offset={[-1, 0]} width={0} height={40} radius={20} fill={T.red} />
        <Txt position={[0, -70]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'负载上升'} />
        <Rect position={[0, 20]} width={900} height={40} radius={20} fill={T.card} stroke={T.line} lineWidth={2} />
        <Rect ref={capBar} position={[-450, 20]} offset={[-1, 0]} width={0} height={40} radius={20} fill={T.green} />
        <Txt position={[0, 90]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'处理容量加上去'} />
        <Circle ref={greenLight} position={[0, 170]} width={54} height={54} fill={T.green} opacity={0} />
        <Txt position={[0, 230]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} text={'高负载下仍可靠'} />
      </Node>

      {/* b28：工程师与运维的日子变轻松 */}
      <Node ref={g28} opacity={0}>
        <Circle ref={people[0]} position={[-200, -80]} width={120} height={120} fill={T.blue} />
        <Txt position={[-200, -80]} fontSize={SIZE.label} fill={T.white} fontFamily={FONT.sans} text={'工程'} />
        <Circle ref={people[1]} position={[200, -80]} width={120} height={120} fill={T.green} />
        <Txt position={[200, -80]} fontSize={SIZE.label} fill={T.white} fontFamily={FONT.sans} text={'运维'} />
        <Txt ref={checkTags[0]} position={[-200, 60]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} opacity={0} text={'好抽象降复杂度'} />
        <Txt ref={checkTags[1]} position={[200, 60]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} opacity={0} text={'易改易适配'} />
        <Txt ref={checkTags[2]} position={[0, 140]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} opacity={0} text={'看清健康，有效管理'} />
      </Node>

      {/* b29：速效药瓶子打叉 */}
      <Node ref={g29} opacity={0}>
        <Rect ref={pillBottle} position={[0, -60]} width={220} height={280} radius={20} fill={T.card} stroke={T.red} lineWidth={3}>
          <Txt position={[0, -80]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'速效解'} />
          <Txt position={[0, 0]} fontSize={SIZE.body} fill={T.red} fontFamily={FONT.sans} text={'easy fix'} />
        </Rect>
        <Line ref={crossLines[0]} points={[[-140, -180], [140, 60]]} stroke={T.red} lineWidth={8} opacity={0} />
        <Line ref={crossLines[1]} points={[[140, -180], [-140, 60]]} stroke={T.red} lineWidth={8} opacity={0} />
        <Txt position={[0, 160]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'没有速效解'} />
      </Node>

      {/* b30：模式花纹反复出现，翻到下一章 */}
      <Node ref={g30} opacity={0}>
        {[-400, -200, 0, 200, 400].map((x, i) => (
          <Circle
            key={`u9-motif-${i}`}
            ref={motifs[i]}
            position={[x, -80]}
            width={80}
            height={80}
            fill={i % 2 === 0 ? T.blue : T.yellow}
            opacity={0}
          />
        ))}
        <Rect ref={nextDoor} position={[0, 100]} width={420} height={110} radius={16} fill={T.card} stroke={T.green} lineWidth={3} opacity={0}>
          <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'后面几章：数据系统实例'} />
        </Rect>
      </Node>

      {/* b31：多组件系统缩略图再现 */}
      <Node ref={g31} opacity={0}>
        <Rect ref={figThumb} position={[0, -60]} width={760} height={280} radius={20} fill={T.card} stroke={T.line} lineDash={[14, 10]} lineWidth={3}>
          <Txt position={[0, -90]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'多组件系统'} />
          <Txt position={[0, 0]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'API 藏起实现细节 · 构件拼合'} />
        </Rect>
        <Txt ref={part3Tag} position={[0, 150]} fontSize={SIZE.title} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} opacity={0} text={'以后再见'} />
      </Node>

      {/* b32：三把尺子收进工具箱，下一章的门打开 */}
      <Node ref={g32} opacity={0}>
        {[
          {x: -200, label: '可靠'},
          {x: 0, label: '可扩展'},
          {x: 200, label: '可维护'},
        ].map((r, i) => (
          <Rect
            key={`u9-slat-${i}`}
            ref={rulerSlats[i]}
            position={[r.x, -160]}
            width={150}
            height={200}
            radius={12}
            fill={T.blue}
          >
            <Txt fontSize={SIZE.label} fill={T.white} fontFamily={FONT.sans} text={r.label} />
          </Rect>
        ))}
        <Rect ref={toolbox} position={[0, 60]} width={700} height={130} radius={16} fill={T.card} stroke={T.yellow} lineWidth={3} />
        <Txt ref={nextChapter} position={[0, 200]} fontSize={SIZE.body} fill={T.green} fontFamily={FONT.sans} opacity={0} text={'下一章：第一个真正的数据系统'} />
      </Node>
    </>,
  );

  // b17：需求一直在变——清单逐条变色
  say('需求一直在变');
  yield* beat(
    'b17',
    all(
      g17().opacity(1, 0.5),
      ...[0, 1, 2, 3, 4, 5, 6].map(i => chain(waitFor(0.5 + i * 0.7), reqChips[i]().stroke(T.yellow, 0.4))),
    ),
  );

  // b18：七种变化驱动轮流亮起
  say('七种变化驱动');
  yield* beat(
    'b18',
    all(
      g17().opacity(0, 0.5),
      g18().opacity(1, 0.5),
      ...[0, 1, 2, 3, 4, 5, 6].map(i =>
        chain(waitFor(0.5 + i * 1.2), driverBadges[i]().opacity(1, 0.5), driverBadges[i]().fill(T.yellow, 0.5)),
      ),
    ),
  );

  // b19：小步快跑的循环，TDD 与重构标签
  say('Agile · TDD');
  yield* beat(
    'b19',
    all(
      g18().opacity(0, 0.5),
      g19().opacity(1, 0.5),
      sequence(
        2,
        cycleDot().position([220, -60], 2),
        cycleDot().position([0, 80], 2),
        cycleDot().position([-220, -60], 2),
        cycleDot().position([0, -200], 2),
      ),
      ...[0, 1].map(i => chain(waitFor(6 + i * 1.5), agileTags[i]().opacity(1, 0.6))),
    ),
  );

  // b20：Agile 常只谈小尺度——几个源文件
  say('Agile 常只谈小尺度');
  yield* beat(
    'b20',
    all(
      g19().opacity(0, 0.5),
      g20().opacity(1, 0.5),
      g20().scale(1.02, 5),
      ...[0, 1, 2].map(i => chain(waitFor(0.5 + i * 0.8), srcFiles[i]().stroke(T.yellow, 0.6))),
    ),
  );

  // b21：小文件重构放大成整个 Twitter 架构重构
  say('Twitter 架构怎么重构');
  yield* beat(
    'b21',
    sequence(
      1.5,
      all(g20().opacity(0, 0.5), g21().opacity(1, 0.5), v1Panel().scale(1.06, 2), sysTag().opacity(1, 1.5)),
      all(v1Panel().scale(1, 1.5), v2Panel().scale(1.06, 2)),
      all(v2Panel().scale(1, 1.5), refactorArrow().scale(1.3, 1)),
    ),
  );

  // b22：简单与可改两根线绑在一起
  say('简单所以易改');
  yield* beat(
    'b22',
    all(
      g21().opacity(0, 0.5),
      g22().opacity(1, 0.5),
      tieBand().opacity(1, 1),
      tieBand().width(120, 2.5),
      simpleBar().position([0, -110], 3),
      changeBar().position([0, -50], 3),
    ),
  );

  // b23：术语卡 evolvability
  say('evolvability');
  yield* beat('b23', all(g22().opacity(0, 0.5), g23().opacity(1, 0.8), g23().scale(1.04, 5)));

  // b24：功能 vs 非功能，两列清单对照
  say('功能 vs 非功能');
  yield* beat(
    'b24',
    all(
      g23().opacity(0, 0.5),
      g24().opacity(1, 0.5),
      g24().scale(1.02, 11),
      ...[0, 1, 2, 3].map(i => chain(waitFor(0.5 + i * 1.2), funcChips[i]().opacity(1, 0.5))),
      ...[0, 1, 2, 3, 4, 5].map(i => chain(waitFor(0.5 + i * 1.2), nonfuncChips[i]().opacity(1, 0.5))),
    ),
  );

  // b25：三类故障排队，容错罩子盖住
  say('容错把故障藏起来');
  yield* beat(
    'b25',
    all(
      g24().opacity(0, 0.5),
      g25().opacity(1, 0.5),
      ftCover().opacity(0.35, 2.5),
      chain(waitFor(2.5), ftCover().scale(1.04, 3.5)),
      ...faultDolls.map(d => d().fill(T.green, 2.5)),
    ),
  );

  // b26：负载与性能两块拼回三把尺子
  say('先定量，再谈扩展');
  yield* beat(
    'b26',
    sequence(
      2,
      all(g25().opacity(0, 0.5), g26().opacity(1, 0.5)),
      all(loadBlock().position([-140, -60], 1.5), perfBlock().position([140, -60], 1.5)),
      all(
        loadBlock().opacity(0, 1),
        perfBlock().opacity(0, 1),
        ...[0, 1, 2].map(i => chain(waitFor(i * 0.8), rulers[i]().opacity(1, 0.6))),
      ),
    ),
  );

  // b27：加容量，高负载下绿灯仍亮
  say('加容量，保可靠');
  yield* beat(
    'b27',
    all(
      g26().opacity(0, 0.5),
      g27().opacity(1, 0.5),
      loadBar().width(700, 2),
      capBar().width(900, 3.5),
      chain(waitFor(3.5), greenLight().opacity(1, 0.6)),
    ),
  );

  // b28：工程师与运维的日子变轻松
  say('让工程运维日子更好过');
  yield* beat(
    'b28',
    all(
      g27().opacity(0, 0.5),
      g28().opacity(1, 0.5),
      g28().scale(1.02, 11),
      ...[0, 1].map(i => chain(waitFor(1 + i * 2), people[i]().scale(1.1, 1.5))),
      ...[0, 1, 2].map(i => chain(waitFor(4 + i * 2), checkTags[i]().opacity(1, 0.6))),
    ),
  );

  // b29：速效药瓶子打叉
  say('没有速效解');
  yield* beat(
    'b29',
    all(
      g28().opacity(0, 0.5),
      g29().opacity(1, 0.5),
      crossLines[0]().opacity(1, 1),
      chain(waitFor(1), crossLines[1]().opacity(1, 1)),
      pillBottle().rotation(-6, 4),
    ),
  );

  // b30：模式反复出现，翻到下一章
  say('模式反复出现');
  yield* beat(
    'b30',
    all(
      g29().opacity(0, 0.5),
      g30().opacity(1, 0.5),
      ...[0, 1, 2, 3, 4].map(i => chain(waitFor(0.5 + i * 1.2), motifs[i]().opacity(1, 0.5))),
      chain(waitFor(5.5), nextDoor().opacity(1, 0.8)),
    ),
  );

  // b31：Figure 1-1 缩略图再现，Part III（r3 补：旁白重录后 b31 只剩 3.16s，figThumb 缩放 4s 会顺延 0.84s，改短至 2.5s）
  say('以后再见');
  yield* beat(
    'b31',
    all(
      g30().opacity(0, 0.5),
      g31().opacity(1, 0.5),
      figThumb().scale(1.03, 2.5),
      chain(waitFor(1.5), part3Tag().opacity(1, 0.6)),
    ),
  );

  // b32：三把尺子收进工具箱，下一章的门打开
  say('拿着三把尺子往下走');
  yield* beat(
    'b32',
    all(
      g31().opacity(0, 0.5),
      g32().opacity(1, 0.5),
      ...[0, 1, 2].map(i => chain(waitFor(0.5 + i * 0.7), rulerSlats[i]().position([rulerSlats[i]().position.x(), -40], 1.5))),
      chain(waitFor(3), nextChapter().opacity(1, 0.6)),
    ),
  );
});
