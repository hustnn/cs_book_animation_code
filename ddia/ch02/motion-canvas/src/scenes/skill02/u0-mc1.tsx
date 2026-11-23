// U0 场景 1（MC）：b1–b6b —— 钩子、三条路分叉、时间线 1968 → 1970 → 2009。
// 分镜：skill-ch02/beats-u0.md U0 一节；原文：DDIA §2.0（书页 p27–28）、§2.1（Codd 1970）、
// §2.2（NoSQL 2009）、§2.5（IMS 1968）。
// 时长全部来自 timeline/u0.json（beat() 驱动），不手写 waitFor。
// 颜色、字号、安全区一律取自 lib/theme，不手写十六进制色值。
import {Circle, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, chain, createRef} from '@motion-canvas/core';
import {at, makeBeats} from '../../lib/beats';
import {attach} from '../../lib/layout';
import {FONT, SAFE, SIZE, T} from '../../lib/theme';
import timeline from '../../timeline/u0.json';

export default makeScene2D(function* (view) {
  view.fill(T.bg);
  const beat = makeBeats(timeline);

  const header = createRef<Txt>();
  const anchor = createRef<Txt>();
  const say = (text: string) => anchor().text(text);

  // —— 分叉图 ——
  const gData = createRef<Node>();
  const gRoads = createRef<Node>();
  const qTxt = createRef<Txt>();
  const hlData = createRef<Rect>();
  const hlTree = createRef<Rect>();
  const hlTable = createRef<Rect>();
  const hlDG = createRef<Rect>();
  const glyphTreeRoot = createRef<Node>();
  const glyphTreeKids = [0, 1].map(() => createRef<Node>());
  const glyphTableRow1 = createRef<Node>();
  const glyphTableRow2 = createRef<Node>();
  const glyphDoc = createRef<Node>();
  const glyphGraphDots = createRef<Node>();
  const glyphGraphLine1 = createRef<Line>();
  const glyphGraphLine2 = createRef<Line>();

  // —— 时间线 ——
  const gTimeline = createRef<Node>();
  const dot68 = createRef<Circle>();
  const dot70 = createRef<Circle>();
  const dot09 = createRef<Circle>();
  const year68 = createRef<Txt>();
  const year70 = createRef<Txt>();
  const year09 = createRef<Txt>();
  const lab68 = createRef<Txt>();
  const lab70 = createRef<Txt>();
  const lab09 = createRef<Txt>();

  view.add(
    <>
      <Txt
        ref={header}
        position={[-SAFE.halfW, -SAFE.halfH]}
        offset={[-1, -1]}
        fontSize={SIZE.label}
        fill={T.muted}
        fontFamily={FONT.sans}
        text={'数据模型与查询语言'}
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

      {/* 数据卡 */}
      <Node ref={gData} opacity={0}>
        <Rect position={[-440, -40]} width={220} height={120} radius={16} fill={T.card} stroke={T.blue} lineWidth={2}>
          <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'一份数据'} />
        </Rect>
        <Rect ref={hlData} position={[-440, -40]} width={220} height={120} radius={16} stroke={T.yellow} lineWidth={3} opacity={0} />
      </Node>

      {/* 三条路：树 / 表 / 文档·图 */}
      <Node ref={gRoads} opacity={0}>
        <Line points={[[-330, -40], [-160, -40]]} stroke={T.line} lineWidth={2} />
        <Line points={[[-160, -40], [110, -200]]} stroke={T.green} lineWidth={2} />
        <Line points={[[-160, -40], [110, -40]]} stroke={T.blue} lineWidth={2} />
        <Line points={[[-160, -40], [110, 120]]} stroke={T.purple} lineWidth={2} />
        {/* 树卡 */}
        <Node position={[300, -200]}>
          <Rect width={380} height={110} radius={14} fill={T.card} stroke={T.green} lineWidth={2} />
          <Txt position={[-155, 0]} fontSize={SIZE.title} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'树'} />
          <Node ref={glyphTreeRoot} opacity={0}>
            <Rect position={[80, -28]} width={130} height={34} radius={8} fill={T.card} stroke={T.green} lineWidth={2} />
            <Line points={[[80, -11], [15, 12]]} stroke={T.green} lineWidth={2} />
            <Line points={[[80, -11], [135, 12]]} stroke={T.green} lineWidth={2} />
          </Node>
          <Node ref={glyphTreeKids[0]} opacity={0}>
            <Rect position={[15, 28]} width={100} height={28} radius={8} fill={T.card} stroke={T.green} lineWidth={2} />
          </Node>
          <Node ref={glyphTreeKids[1]} opacity={0}>
            <Rect position={[135, 28]} width={100} height={28} radius={8} fill={T.card} stroke={T.green} lineWidth={2} />
          </Node>
        </Node>
        {/* 表卡 */}
        <Node position={[300, -40]}>
          <Rect width={380} height={110} radius={14} fill={T.card} stroke={T.blue} lineWidth={2} />
          <Txt position={[-155, 0]} fontSize={SIZE.title} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'表'} />
          <Node ref={glyphTableRow1} opacity={0}>
            {[-72, 0, 72].map(x => (
              <Rect key={`r1-${x}`} position={[80 + x, -16]} width={70} height={26} radius={6} fill={T.card} stroke={T.blue} lineWidth={2} />
            ))}
          </Node>
          <Node ref={glyphTableRow2} opacity={0}>
            {[-72, 0, 72].map(x => (
              <Rect key={`r2-${x}`} position={[80 + x, 16]} width={70} height={26} radius={6} fill={T.card} stroke={T.blue} lineWidth={2} />
            ))}
          </Node>
        </Node>
        {/* 文档·图卡 */}
        <Node position={[300, 120]}>
          <Rect width={380} height={110} radius={14} fill={T.card} stroke={T.purple} lineWidth={2} />
          <Txt position={[-120, 0]} fontSize={SIZE.label} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'文档 · 图'} />
          <Node ref={glyphDoc} opacity={0}>
            <Rect position={[10, 0]} width={130} height={80} radius={10} fill={T.card} stroke={T.purple} lineWidth={2}>
              <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'{ … }'} />
            </Rect>
          </Node>
          <Node ref={glyphGraphDots} opacity={0}>
            <Circle position={[130, -25]} width={22} height={22} fill={T.yellow} />
            <Circle position={[170, 15]} width={22} height={22} fill={T.yellow} />
            <Circle position={[120, 30]} width={22} height={22} fill={T.yellow} />
          </Node>
          <Line ref={glyphGraphLine1} points={[[130, -25], [170, 15]]} stroke={T.yellow} lineWidth={2} opacity={0} />
          <Line ref={glyphGraphLine2} points={[[170, 15], [120, 30]]} stroke={T.yellow} lineWidth={2} opacity={0} />
        </Node>
        <Rect ref={hlTree} position={[300, -200]} width={380} height={110} radius={14} stroke={T.yellow} lineWidth={3} opacity={0} />
        <Rect ref={hlTable} position={[300, -40]} width={380} height={110} radius={14} stroke={T.yellow} lineWidth={3} opacity={0} />
        <Rect ref={hlDG} position={[300, 120]} width={380} height={110} radius={14} stroke={T.yellow} lineWidth={3} opacity={0} />
      </Node>
      <Txt ref={qTxt} position={[-160, -130]} fontSize={72} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'?'} opacity={0} />

      {/* 时间线：1968 → 1970 → 2009 */}
      <Node ref={gTimeline} opacity={0}>
        <Line points={[[-500, -40], [500, -40]]} stroke={T.line} lineWidth={3} />
        <Circle ref={dot68} position={[-380, -40]} width={28} height={28} fill={T.green} opacity={0.25} />
        <Circle ref={dot70} position={[0, -40]} width={28} height={28} fill={T.blue} opacity={0.25} />
        <Circle ref={dot09} position={[380, -40]} width={28} height={28} fill={T.purple} opacity={0.25} />
        <Txt ref={year68} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.mono} text={'1968'} opacity={0.25} />
        <Txt ref={year70} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.mono} text={'1970'} opacity={0.25} />
        <Txt ref={year09} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.mono} text={'2009'} opacity={0.25} />
        <Txt ref={lab68} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'层次模型'} opacity={0.25} />
        <Txt ref={lab70} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'关系模型'} opacity={0.25} />
        <Txt ref={lab09} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'文档 · 图'} opacity={0.25} />
      </Node>
    </>
  );

  // 时间线标签挂到它说明的节点上（对象亮起时标签跟着亮）。
  attach(year68(), dot68(), 'top', 14);
  attach(year70(), dot70(), 'top', 14);
  attach(year09(), dot09(), 'top', 14);
  attach(lab68(), dot68(), 'bottom', 14);
  attach(lab70(), dot70(), 'bottom', 14);
  attach(lab09(), dot09(), 'bottom', 14);

  say('换个模型，代码重写？');
  yield* beat('b1',
    all(gData().opacity(1, 0.5)),
    at('数据模型', gRoads().opacity(1, 0.5)),
    at('重写吗', qTxt().opacity(1, 0.4)),
  );

  say('模型决定写法和想法');
  yield* beat('b2',
    at('最重要', hlTree().opacity(1, 0.6)),
    at('怎么写代码', hlTable().opacity(1, 0.6)),
    at('怎么想问题', all(hlDG().opacity(1, 0.6), hlData().opacity(1, 0.5))),
  );

  say('树：一层套一层');
  yield* beat('b3',
    at('树', all(glyphTreeRoot().opacity(1, 0.5), hlTable().opacity(0.15, 0.5), hlDG().opacity(0.15, 0.5))),
    at('一层套一层', chain(glyphTreeKids[0]().opacity(1, 0.5), glyphTreeKids[1]().opacity(1, 0.5))),
  );

  say('表：摊平成行');
  yield* beat('b4',
    at('表', all(glyphTableRow1().opacity(1, 0.5), hlTable().opacity(1, 0.5), hlTree().opacity(0.15, 0.5))),
    at('摊平', glyphTableRow2().opacity(1, 0.5)),
  );

  say('文档和图：两条新路');
  yield* beat('b5',
    at('第三条路', all(hlDG().opacity(1, 0.5), hlTable().opacity(0.15, 0.5))),
    at('文档', glyphDoc().opacity(1, 0.5)),
    at('图', glyphGraphDots().opacity(1, 0.5)),
    at('一张网', glyphGraphLine1().opacity(1, 0.5)),
    at('连起来', glyphGraphLine2().opacity(1, 0.5)),
  );

  say('1968：层次模型');
  yield* beat('b6a',
    all(gData().opacity(0, 0.5), gRoads().opacity(0, 0.5), qTxt().opacity(0, 0.5), gTimeline().opacity(1, 0.5)),
    at('一九六八年', all(dot68().opacity(1, 0.5), year68().opacity(1, 0.5), lab68().opacity(1, 0.5))),
  );

  say('1970 · 2009');
  yield* beat('b6b',
    at('一九七〇年', all(dot70().opacity(1, 0.5), year70().opacity(1, 0.5), lab70().opacity(1, 0.5))),
    at('二〇〇九年', all(dot09().opacity(1, 0.5), year09().opacity(1, 0.5), lab09().opacity(1, 0.5))),
    at('走上台前', all(dot68().scale(1.25, 0.4), dot70().scale(1.25, 0.4), dot09().scale(1.25, 0.4))),
  );
});
