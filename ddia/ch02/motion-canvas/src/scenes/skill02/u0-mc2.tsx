// U0 场景 2（MC）：b7–b10 —— 本章比较三种模型、每种模型配的查询语言、
// 路线三段、进入下一单元的过渡。
// 分镜：skill-ch02/beats-u0.md U0 一节；原文：DDIA §2.0（书页 p27–28）。
// 时长全部来自 timeline/u0.json（beat() 驱动），不手写 waitFor。
// 颜色、字号、安全区一律取自 lib/theme，不手写十六进制色值。
import {Circle, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, createRef} from '@motion-canvas/core';
import {at, makeBeats} from '../../lib/beats';
import {attach, column, row} from '../../lib/layout';
import {FONT, SAFE, SIZE, T} from '../../lib/theme';
import timeline from '../../timeline/u0.json';

export default makeScene2D(function* (view) {
  view.fill(T.bg);
  const beat = makeBeats(timeline);

  const header = createRef<Txt>();
  const anchor = createRef<Txt>();
  const say = (text: string) => anchor().text(text);

  const gModels = createRef<Node>();
  const relNode = createRef<Node>();
  const docNode = createRef<Node>();
  const graphNode = createRef<Node>();
  const relCard = createRef<Rect>();
  const docCard = createRef<Rect>();
  const graphCard = createRef<Rect>();
  const titleRel = createRef<Txt>();
  const titleDoc = createRef<Txt>();
  const titleGraph = createRef<Txt>();
  const sqlTag = createRef<Txt>();
  const cyTag = createRef<Txt>();
  const spTag = createRef<Txt>();
  const daTag = createRef<Txt>();
  const mrTag = createRef<Txt>();
  const agTag = createRef<Txt>();
  const gSteps = createRef<Node>();
  const step1 = createRef<Node>();
  const step2 = createRef<Node>();
  const step3 = createRef<Node>();
  const arrow1 = createRef<Txt>();
  const arrow2 = createRef<Txt>();
  const hlRel = createRef<Rect>();
  const q2 = createRef<Txt>();

  const stepPos = row(3, 300, 40, [0, 190]);
  const graphTagPos = column(3, 34, 8, [380, 92]);
  const docTagPos = column(2, 34, 8, [0, 71]);

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

      {/* 三种模型 */}
      <Node ref={gModels} opacity={0}>
        <Node ref={relNode} position={[-380, -60]}>
          <Rect ref={relCard} width={320} height={150} radius={16} fill={T.card} stroke={T.blue} lineWidth={2} />
          <Txt ref={titleRel} position={[0, -45]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'关系'} />
          {[-70, 0, 70].map(x => (
            <Rect key={`rel-r1-${x}`} position={[x, 8]} width={64} height={22} radius={6} fill={T.card} stroke={T.blue} lineWidth={2} />
          ))}
          {[-70, 0, 70].map(x => (
            <Rect key={`rel-r2-${x}`} position={[x, 38]} width={64} height={22} radius={6} fill={T.card} stroke={T.blue} lineWidth={2} />
          ))}
        </Node>
        <Node ref={docNode} position={[0, -60]}>
          <Rect ref={docCard} width={320} height={150} radius={16} fill={T.card} stroke={T.purple} lineWidth={2} />
          <Txt ref={titleDoc} position={[0, -45]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'文档'} />
          <Rect position={[0, 22]} width={130} height={64} radius={10} fill={T.card} stroke={T.purple} lineWidth={2}>
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'{ … }'} />
          </Rect>
        </Node>
        <Node ref={graphNode} position={[380, -60]}>
          <Rect ref={graphCard} width={320} height={150} radius={16} fill={T.card} stroke={T.yellow} lineWidth={2} />
          <Txt ref={titleGraph} position={[0, -45]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'图'} />
          <Line points={[[-60, 10], [0, 40]]} stroke={T.yellow} lineWidth={2} />
          <Line points={[[0, 40], [60, 10]]} stroke={T.yellow} lineWidth={2} />
          <Circle position={[-60, 10]} width={22} height={22} fill={T.yellow} />
          <Circle position={[0, 40]} width={22} height={22} fill={T.yellow} />
          <Circle position={[60, 10]} width={22} height={22} fill={T.yellow} />
        </Node>
        <Rect ref={hlRel} position={[-380, -60]} width={320} height={150} radius={16} stroke={T.yellow} lineWidth={3} opacity={0} />
      </Node>

      {/* 查询语言标签 */}
      <Txt ref={sqlTag} fontSize={SIZE.label} fontWeight={700} fill={T.blue} fontFamily={FONT.mono} text={'SQL'} opacity={0} />
      <Txt ref={cyTag} position={graphTagPos[0]} fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.mono} text={'Cypher'} opacity={0} />
      <Txt ref={spTag} position={graphTagPos[1]} fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.mono} text={'SPARQL'} opacity={0} />
      <Txt ref={daTag} position={graphTagPos[2]} fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.mono} text={'Datalog'} opacity={0} />
      <Txt ref={mrTag} position={docTagPos[0]} fontSize={SIZE.label} fill={T.purple} fontFamily={FONT.mono} text={'MapReduce'} opacity={0} />
      <Txt ref={agTag} position={docTagPos[1]} fontSize={SIZE.label} fill={T.purple} fontFamily={FONT.sans} text={'聚合管道'} opacity={0} />

      {/* 路线三段 */}
      <Node ref={gSteps} opacity={0}>
        <Node ref={step1} position={stepPos[0]} opacity={0}>
          <Rect width={300} height={64} radius={12} fill={T.card} stroke={T.blue} lineWidth={2}>
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'关系与文档争'} />
          </Rect>
        </Node>
        <Node ref={step2} position={stepPos[1]} opacity={0}>
          <Rect width={300} height={64} radius={12} fill={T.card} stroke={T.yellow} lineWidth={2}>
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'图怎么查'} />
          </Rect>
        </Node>
        <Node ref={step3} position={stepPos[2]} opacity={0}>
          <Rect width={300} height={64} radius={12} fill={T.card} stroke={T.green} lineWidth={2}>
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'怎么选'} />
          </Rect>
        </Node>
        <Txt ref={arrow1} position={[-170, 190]} fontSize={SIZE.title} fill={T.muted} fontFamily={FONT.sans} text={'→'} opacity={0} />
        <Txt ref={arrow2} position={[170, 190]} fontSize={SIZE.title} fill={T.muted} fontFamily={FONT.sans} text={'→'} opacity={0} />
      </Node>
      <Txt ref={q2} position={[-380, -200]} fontSize={64} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'?'} opacity={0} />
    </>
  );

  // SQL 标签挂在它说明的关系卡下面。
  attach(sqlTag(), relCard(), 'bottom', 14);

  say('比较三种模型');
  yield* beat('b7',
    all(gModels().opacity(1, 0.5)),
    at('三种模型', all(titleRel().fill(T.yellow, 0.4), titleDoc().fill(T.yellow, 0.4), titleGraph().fill(T.yellow, 0.4))),
  );

  say('关系配 SQL');
  yield* beat('b8a',
    at('SQL', sqlTag().opacity(1, 0.4)),
    at('Cypher', cyTag().opacity(1, 0.4)),
    at('SPARQL', spTag().opacity(1, 0.4)),
    at('Datalog', daTag().opacity(1, 0.4)),
  );

  say('文档配 MapReduce');
  yield* beat('b8b',
    at('MapReduce', mrTag().opacity(1, 0.4)),
    at('聚合管道', agTag().opacity(1, 0.4)),
  );

  say('先争，再查，最后选');
  yield* beat('b9',
    all(gSteps().opacity(1, 0.3)),
    at('争', all(step1().opacity(1, 0.4), arrow1().opacity(1, 0.4))),
    at('查', all(step2().opacity(1, 0.4), arrow2().opacity(1, 0.4))),
    at('选', step3().opacity(1, 0.4)),
  );

  say('下一站：凭什么是它');
  yield* beat('b10',
    at('关系库', all(hlRel().opacity(1, 0.5), docNode().opacity(0.25, 0.5), graphNode().opacity(0.25, 0.5), mrTag().opacity(0.25, 0.5), agTag().opacity(0.25, 0.5), cyTag().opacity(0.25, 0.5), spTag().opacity(0.25, 0.5), daTag().opacity(0.25, 0.5))),
    at('凭什么是它', q2().opacity(1, 0.4)),
  );
});
