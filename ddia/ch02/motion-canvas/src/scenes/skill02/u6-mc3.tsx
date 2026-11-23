// U6 场景 3（MC）：b26–b35 —— 命令式 JS 的两个问题、CSS 自动修正、
// 结论、老办法回扣、收束与下一站。分镜：skill-ch02/beats-u6.md；原文：DDIA §2.8（书页 p44–46）。
// 时长全部来自 timeline/u6.json（beat() 驱动），不手写 waitFor。
import {Circle, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, chain, createRef} from '@motion-canvas/core';
import {at, makeBeats} from '../../lib/beats';
import {FONT, SAFE, SIZE, T} from '../../lib/theme';
import {row} from '../../lib/layout';
import timeline from '../../timeline/u6.json';

export default makeScene2D(function* (view) {
  view.fill(T.bg);
  const beat = makeBeats(timeline);

  const header = createRef<Txt>();
  const anchor = createRef<Txt>();
  const say = (text: string) => anchor().text(text);

  const g26 = createRef<Node>();
  const g26lines = [0, 1, 2, 3].map(() => createRef<Txt>());
  const g27 = createRef<Node>();
  const g27t1 = createRef<Rect>();
  const g27t2 = createRef<Rect>();
  const g28 = createRef<Node>();
  const g28cursor = createRef<Circle>();
  const g28sel = createRef<Rect>();
  const g28blue = createRef<Rect>();
  const g28still = createRef<Txt>();
  const g28rerun = createRef<Txt>();
  const g28reload = createRef<Txt>();
  const g29 = createRef<Node>();
  const g29blueS = createRef<Rect>();
  const g29blueW = createRef<Rect>();
  const g29lab = createRef<Txt>();
  const g30 = createRef<Node>();
  const g30rewrite = createRef<Txt>();
  const g30gear = createRef<Circle>();
  const g30same = createRef<Txt>();
  const g31 = createRef<Node>();
  const g31eq = createRef<Txt>();
  const g31c1 = createRef<Txt>();
  const g31c2 = createRef<Txt>();
  const g32 = createRef<Node>();
  const g32hl = createRef<Rect>();
  const g32lab = createRef<Txt>();
  const g32tag = createRef<Txt>();
  const g33 = createRef<Node>();
  const g33x = createRef<Txt>();
  const g33gear = createRef<Circle>();
  const g33dot = createRef<Circle>();
  const g34 = createRef<Node>();
  const g34q = createRef<Txt>();
  const g35 = createRef<Node>();
  const g35cards = [0, 1, 2].map(() => createRef<Rect>());
  const g35lab = createRef<Txt>();
  const g35next = createRef<Txt>();

  const recRow = row(5, 150, 24, [0, -60]);
  const obsRow = row(3, 300, 30, [0, -60]);

  view.add(
    <>
      <Txt
        ref={header}
        position={[-SAFE.halfW, -SAFE.halfH]}
        offset={[-1, -1]}
        fontSize={SIZE.label}
        fill={T.muted}
        fontFamily={FONT.sans}
        text={'只说要什么'}
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

      {/* b26：一长串 JS 代码 */}
      <Node ref={g26} opacity={0}>
        <Rect position={[0, -40]} width={980} height={360} radius={18} fill={T.card} stroke={T.red} lineWidth={2} />
        <Txt ref={g26lines[0]} position={[0, -160]} fontSize={SIZE.label} maxWidth={920} textWrap fill={T.text} fontFamily={FONT.mono} text={'var liElements = document.getElementsByTagName("li");'} opacity={0} />
        <Txt ref={g26lines[1]} position={[0, -100]} fontSize={SIZE.label} maxWidth={920} textWrap fill={T.text} fontFamily={FONT.mono} text={'for (var i = 0; i < liElements.length; i++) {'} opacity={0} />
        <Txt ref={g26lines[2]} position={[0, -40]} fontSize={SIZE.label} maxWidth={920} textWrap fill={T.text} fontFamily={FONT.mono} text={'  for (var j = 0; j < children.length; j++) {'} opacity={0} />
        <Txt ref={g26lines[3]} position={[0, 20]} fontSize={SIZE.label} maxWidth={920} textWrap fill={T.text} fontFamily={FONT.mono} text={'    if (…) setAttribute("style", "blue"); } }'} opacity={0} />
        <Txt position={[0, 100]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'JavaScript + 文档对象模型接口'} />
      </Node>

      {/* b27：还有两个严重问题 */}
      <Node ref={g27} opacity={0}>
        <Rect position={[0, -40]} width={900} height={260} radius={18} fill={T.card} stroke={T.red} lineWidth={3}>
          <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'一长串命令式代码'} />
        </Rect>
        <Rect ref={g27t1} position={[-280, 180]} width={420} height={80} radius={12} fill={T.card} stroke={T.red} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'问题一：蓝色去不掉'} />
        </Rect>
        <Rect ref={g27t2} position={[280, 180]} width={420} height={80} radius={12} fill={T.card} stroke={T.red} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'问题二：换接口要重写'} />
        </Rect>
      </Node>

      {/* b28：点了鲸鱼，鲨鱼还蓝着 */}
      <Node ref={g28} opacity={0}>
        <Rect position={[-220, -80]} width={360} height={90} radius={12} fill={T.card} stroke={T.yellow} lineWidth={2}>
          <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'鲨鱼'} />
        </Rect>
        <Rect position={[-220, 40]} width={360} height={90} radius={12} fill={T.card} stroke={T.line} lineWidth={2}>
          <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'鲸鱼'} />
        </Rect>
        <Rect ref={g28sel} position={[-220, -80]} width={380} height={106} radius={14} stroke={T.yellow} lineWidth={3} />
        <Rect ref={g28blue} position={[280, -80]} width={360} height={90} radius={12} fill={T.blue} />
        <Txt position={[280, -80]} fontSize={SIZE.body} fontWeight={700} fill={T.white} fontFamily={FONT.sans} text={'鲨鱼标题'} />
        <Circle ref={g28cursor} position={[-420, -80]} width={28} height={28} fill={T.yellow} />
        <Txt ref={g28still} position={[280, 40]} fontSize={SIZE.body} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'还蓝着！'} opacity={0} />
        <Txt ref={g28rerun} position={[280, 120]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'↻ 代码重跑一遍，蓝色不动'} opacity={0} />
        <Txt ref={g28reload} position={[0, 210]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'只能等整页重载'} opacity={0} />
      </Node>

      {/* b29：CSS 自动去掉蓝色 */}
      <Node ref={g29} opacity={0}>
        <Rect position={[-220, -80]} width={360} height={90} radius={12} fill={T.card} stroke={T.line} lineWidth={2}>
          <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'鲨鱼'} />
        </Rect>
        <Rect position={[-220, 40]} width={360} height={90} radius={12} fill={T.card} stroke={T.yellow} lineWidth={2}>
          <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'鲸鱼'} />
        </Rect>
        <Rect position={[-220, 40]} width={380} height={106} radius={14} stroke={T.yellow} lineWidth={3} />
        <Rect ref={g29blueS} position={[280, -80]} width={360} height={90} radius={12} fill={T.blue} />
        <Txt position={[280, -80]} fontSize={SIZE.body} fontWeight={700} fill={T.white} fontFamily={FONT.sans} text={'鲨鱼标题'} />
        <Rect ref={g29blueW} position={[280, 40]} width={360} height={90} radius={12} fill={T.blue} opacity={0} />
        <Txt position={[280, 40]} fontSize={SIZE.body} fontWeight={700} fill={T.white} fontFamily={FONT.sans} text={'鲸鱼标题'} />
        <Txt ref={g29lab} position={[0, 170]} fontSize={SIZE.body} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'CSS：规则一失效，蓝色立刻去掉'} opacity={0} />
      </Node>

      {/* b30：换接口要重写，CSS 不用动 */}
      <Node ref={g30} opacity={0}>
        <Rect position={[-300, 0]} width={400} height={240} radius={16} fill={T.card} stroke={T.red} lineWidth={2}>
          <Txt position={[0, -70]} fontSize={SIZE.body} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'JS 代码'} />
          <Txt position={[0, 0]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'想用新接口提速'} />
        </Rect>
        <Txt ref={g30rewrite} position={[-300, 80]} fontSize={SIZE.label} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'↻ 必须全部重写'} opacity={0} />
        <Rect position={[300, 0]} width={400} height={240} radius={16} fill={T.card} stroke={T.green} lineWidth={2}>
          <Txt position={[0, -70]} fontSize={SIZE.body} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'CSS'} />
          <Txt position={[0, 0]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'浏览器厂商来提速'} />
        </Rect>
        <Circle ref={g30gear} position={[300, 70]} width={60} height={60} stroke={T.green} lineWidth={3} opacity={0} />
        <Txt ref={g30same} position={[300, -110]} fontSize={SIZE.label} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'一字不动 ✓'} opacity={0} />
      </Node>

      {/* b31：两个地方，同一结论 */}
      <Node ref={g31} opacity={0}>
        <Rect position={[-300, 0]} width={400} height={220} radius={16} fill={T.card} stroke={T.green} lineWidth={2}>
          <Txt position={[0, -50]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'浏览器'} />
          <Txt position={[0, 10]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'声明式样式'} />
          <Txt ref={g31c1} position={[0, 70]} fontSize={SIZE.label} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'远好于命令式 ✓'} opacity={0} />
        </Rect>
        <Txt ref={g31eq} position={[0, 0]} fontSize={56} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'='} opacity={0} />
        <Rect position={[300, 0]} width={400} height={220} radius={16} fill={T.card} stroke={T.green} lineWidth={2}>
          <Txt position={[0, -50]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'数据库'} />
          <Txt position={[0, 10]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'声明式查询'} />
          <Txt ref={g31c2} position={[0, 70]} fontSize={SIZE.label} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'远胜命令式 ✓'} opacity={0} />
        </Rect>
      </Node>

      {/* b32：老办法，一条条翻 */}
      <Node ref={g32} opacity={0}>
        {recRow.map(([x, y], i) => (
          <Rect key={`g32r-${i}`} position={[x, y]} width={150} height={90} radius={12} fill={T.card} stroke={T.line} lineWidth={2}>
            <Txt fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.mono} text={`记录 ${i + 1}`} />
          </Rect>
        ))}
        <Rect ref={g32hl} position={[recRow[0][0], recRow[0][1]]} width={170} height={106} radius={14} stroke={T.yellow} lineWidth={3} />
        <Txt ref={g32lab} position={[0, 80]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'一次一条记录地翻'} opacity={0} />
        <Txt ref={g32tag} position={[0, 150]} fontSize={SIZE.label} fill={T.red} fontFamily={FONT.sans} text={'用的就是命令式代码'} opacity={0} />
      </Node>

      {/* b33：回到开头，两扇门 */}
      <Node ref={g33} opacity={0}>
        <Rect position={[-300, -40]} width={340} height={280} radius={16} fill={T.card} stroke={T.red} lineWidth={2}>
          <Txt position={[0, -100]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'怎么做'} />
        </Rect>
        {[0, 1, 2].map(i => (
          <Circle key={`g33d-${i}`} position={[-300, -40 + i * 50]} width={16} height={16} fill={T.muted} />
        ))}
        <Txt ref={g33x} position={[-300, 80]} fontSize={SIZE.title} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'钉死了 ✗'} opacity={0} />
        <Rect position={[300, -40]} width={340} height={280} radius={16} fill={T.card} stroke={T.green} lineWidth={2}>
          <Txt position={[0, -100]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'要什么'} />
        </Rect>
        <Circle ref={g33gear} position={[300, 20]} width={110} height={110} stroke={T.yellow} lineWidth={3} opacity={0} />
        <Circle ref={g33dot} position={[300, 20]} width={36} height={36} fill={T.yellow} opacity={0} />
        <Txt position={[300, 90]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'优化器 · 并行'} />
      </Node>

      {/* b34：你的查询在说什么 */}
      <Node ref={g34} opacity={0}>
        <Rect position={[-300, -40]} width={340} height={220} radius={16} fill={T.card} stroke={T.green} lineWidth={3}>
          <Txt fontSize={SIZE.title} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'要什么'} />
        </Rect>
        <Rect position={[300, -40]} width={340} height={220} radius={16} fill={T.card} stroke={T.red} lineWidth={2}>
          <Txt fontSize={SIZE.title} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'怎么做'} />
        </Rect>
        <Txt ref={g34q} position={[0, -40]} fontSize={72} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'?'} opacity={0} />
      </Node>

      {/* b35：下一站 MapReduce */}
      <Node ref={g35} opacity={0}>
        {obsRow.map(([x, y], i) => (
          <Rect key={`g35c-${i}`} ref={g35cards[i]} position={[x, y]} width={300} height={140} radius={14} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'鲨鱼观察记录'} />
          </Rect>
        ))}
        <Txt ref={g35lab} position={[0, 80]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'按月分组统计'} opacity={0} />
        <Txt ref={g35next} position={[0, 160]} fontSize={SIZE.title} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'下一站：MapReduce →'} opacity={0} />
      </Node>
    </>
  );

  say('一长串命令式代码');
  yield* beat('b26',
    all(g26().opacity(1, 0.5)),
    at('先取所有列表项', g26lines[0]().opacity(1, 0.4)),
    at('两层循环', all(g26lines[1]().opacity(1, 0.4), g26lines[2]().opacity(1, 0.4))),
    at('一个个检查', g26lines[3]().opacity(1, 0.4)),
  );

  say('还有两个问题');
  yield* beat('b27',
    all(g26().opacity(0, 0.5), g27().opacity(1, 0.5)),
    at('两个严重问题', all(g27t1().opacity(1, 0.4), g27t2().opacity(1, 0.4))),
  );

  say('点了鲸鱼，鲨鱼还蓝');
  yield* beat('b28',
    all(g27().opacity(0, 0.5), g28().opacity(1, 0.5)),
    at('点了鲸鱼页', all(g28cursor().position([-420, 40], 0.6), g28sel().position([-220, 40], 0.6))),
    at('蓝色却不会跟着去掉', g28still().opacity(1, 0.4)),
    at('重跑一遍', g28rerun().opacity(1, 0.4)),
    at('整页重载', g28reload().opacity(1, 0.4)),
  );

  say('CSS 自动去掉蓝色');
  yield* beat('b29',
    all(g28().opacity(0, 0.5), g29().opacity(1, 0.5)),
    at('立刻把蓝色去掉', all(g29blueS().opacity(0, 0.5), g29blueW().opacity(1, 0.5), g29lab().opacity(1, 0.4))),
  );

  say('换接口要重写');
  yield* beat('b30',
    all(g29().opacity(0, 0.5), g30().opacity(1, 0.5)),
    at('必须重写代码', g30rewrite().opacity(1, 0.4)),
    at('改进 CSS 的性能', chain(g30gear().opacity(1, 0.3), g30gear().scale(1.15, 0.3), g30gear().scale(1, 0.3))),
    at('不用破坏兼容性', g30same().opacity(1, 0.4)),
  );

  say('两个地方，同一结论');
  yield* beat('b31',
    all(g30().opacity(0, 0.5), g31().opacity(1, 0.5)),
    at('结论一样', g31eq().opacity(1, 0.4)),
    at('远好于', g31c1().opacity(1, 0.4)),
    at('远胜', g31c2().opacity(1, 0.4)),
  );

  say('老办法：一条条翻');
  yield* beat('b32',
    all(g31().opacity(0, 0.5), g32().opacity(1, 0.5)),
    chain(g32hl().position([recRow[1][0], recRow[1][1]], 0.5), g32hl().position([recRow[2][0], recRow[2][1]], 0.5), g32hl().position([recRow[3][0], recRow[3][1]], 0.5), g32hl().position([recRow[4][0], recRow[4][1]], 0.5)),
    at('一次一条记录', g32lab().opacity(1, 0.4)),
    at('命令式代码', g32tag().opacity(1, 0.4)),
  );

  say('只说要什么');
  yield* beat('b33',
    all(g32().opacity(0, 0.5), g33().opacity(1, 0.5)),
    at('把每一步都钉死', g33x().opacity(1, 0.4)),
    at('只说要什么', all(g33gear().opacity(1, 0.4), g33dot().opacity(1, 0.4))),
  );

  say('你的查询在说什么？');
  yield* beat('b34',
    all(g33().opacity(0, 0.5), g34().opacity(1, 0.5)),
    at('要什么', g34q().opacity(1, 0.4)),
  );

  say('下一站：MapReduce');
  yield* beat('b35',
    all(g34().opacity(0, 0.5), g35().opacity(1, 0.5)),
    at('每月看到几条鲨鱼', all(...g35cards.map(c => c().opacity(1, 0.4)))),
    at('三种写法', all(g35lab().opacity(1, 0.4), g35next().opacity(1, 0.4))),
  );
});
