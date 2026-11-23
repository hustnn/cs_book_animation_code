// U10 场景 1（MC）：b1–b6 —— 三段话装整张图、三元组与属性图同一件事、
// 主语/宾语两种可能（值 vs 节点）。
// 分镜：skill-ch02/beats-u10.md U10 一节；原文：DDIA §2.14（书页 p55–56，PDF p77–78）。
// 时长全部来自 timeline/u10.json（beat() 驱动），不手写 waitFor。
// 颜色、字号、安全区一律取自 lib/theme，不手写十六进制色值。
import {Circle, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, chain, createRef} from '@motion-canvas/core';
import {at, makeBeats} from '../../lib/beats';
import {FONT, SAFE, SIZE, T} from '../../lib/theme';
import timeline from '../../timeline/u10.json';

export default makeScene2D(function* (view) {
  view.fill(T.bg);
  const beat = makeBeats(timeline);

  const header = createRef<Txt>();
  const anchor = createRef<Txt>();
  const say = (text: string) => anchor().text(text);

  // b1：三张小卡
  const g1 = createRef<Node>();
  const g1a = createRef<Rect>();
  const g1b = createRef<Rect>();
  const g1c = createRef<Rect>();
  const g1bar = createRef<Rect>();
  // b2：同一张小图，左右两套词
  const g2 = createRef<Node>();
  const g2lucy = createRef<Circle>();
  const g2alain = createRef<Circle>();
  const g2edge = createRef<Line>();
  const g2labL = createRef<Txt>();
  const g2labR = createRef<Txt>();
  const g2tag = createRef<Txt>();
  // b3：吉姆喜欢香蕉
  const g3 = createRef<Node>();
  const g3a = createRef<Rect>();
  const g3b = createRef<Rect>();
  const g3c = createRef<Rect>();
  const g3la = createRef<Txt>();
  const g3lb = createRef<Txt>();
  const g3lc = createRef<Txt>();
  const g3bar = createRef<Rect>();
  // b4：Lucy 节点
  const g4 = createRef<Node>();
  const g4lucy = createRef<Circle>();
  const g4tag = createRef<Txt>();
  // b5：属性小纸条
  const g5 = createRef<Node>();
  const g5lucy = createRef<Circle>();
  const g5note = createRef<Rect>();
  const g5key = createRef<Txt>();
  const g5val = createRef<Txt>();
  // b6：宾语是节点，就是边
  const g6 = createRef<Node>();
  const g6lucy = createRef<Circle>();
  const g6alain = createRef<Circle>();
  const g6edge = createRef<Line>();
  const g6lab = createRef<Txt>();
  const g6tail = createRef<Txt>();
  const g6head = createRef<Txt>();

  view.add(
    <>
      <Txt
        ref={header}
        position={[-SAFE.halfW, -SAFE.halfH]}
        offset={[-1, -1]}
        fontSize={SIZE.label}
        fill={T.muted}
        fontFamily={FONT.sans}
        text={'三元组与 SPARQL'}
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

      {/* b1：三张小卡依次出现，随后拼成一句话 */}
      <Node ref={g1} opacity={0}>
        <Rect ref={g1a} position={[-380, -80]} width={300} height={150} radius={16} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.title} fill={T.text} fontFamily={FONT.sans} text={'主语'} />
        </Rect>
        <Rect ref={g1b} position={[0, -80]} width={300} height={150} radius={16} fill={T.card} stroke={T.yellow} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.title} fill={T.text} fontFamily={FONT.sans} text={'谓语'} />
        </Rect>
        <Rect ref={g1c} position={[380, -80]} width={300} height={150} radius={16} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.title} fill={T.text} fontFamily={FONT.sans} text={'宾语'} />
        </Rect>
        <Rect ref={g1bar} position={[0, 140]} width={940} height={90} radius={14} fill={T.card} stroke={T.line} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'主语 + 谓语 + 宾语 = 一句话'} />
        </Rect>
      </Node>

      {/* b2：同一张小图，左右两套词 */}
      <Node ref={g2} opacity={0}>
        <Txt ref={g2labL} position={[-470, -40]} fontSize={SIZE.title} fontWeight={700} fill={T.blue} fontFamily={FONT.sans} text={'属性图'} opacity={0} />
        <Txt ref={g2labR} position={[470, -40]} fontSize={SIZE.title} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'三元组'} opacity={0} />
        <Circle ref={g2lucy} position={[-140, -40]} width={110} height={110} fill={T.card} stroke={T.blue} lineWidth={3} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'Lucy'} />
        </Circle>
        <Circle ref={g2alain} position={[140, -40]} width={110} height={110} fill={T.card} stroke={T.blue} lineWidth={3} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'Alain'} />
        </Circle>
        <Line ref={g2edge} points={[[-85, -40], [85, -40]]} stroke={T.yellow} lineWidth={3} endArrow opacity={0} />
        <Txt ref={g2tag} position={[0, 110]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'图不变，叫法换了'} opacity={0} />
      </Node>

      {/* b3：吉姆喜欢香蕉，三段依次亮起，下方合一 */}
      <Node ref={g3} opacity={0}>
        <Rect ref={g3a} position={[-380, -80]} width={300} height={150} radius={16} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.title} fill={T.text} fontFamily={FONT.sans} text={'吉姆'} />
        </Rect>
        <Rect ref={g3b} position={[0, -80]} width={300} height={150} radius={16} fill={T.card} stroke={T.yellow} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.title} fill={T.text} fontFamily={FONT.sans} text={'喜欢'} />
        </Rect>
        <Rect ref={g3c} position={[380, -80]} width={300} height={150} radius={16} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.title} fill={T.text} fontFamily={FONT.sans} text={'香蕉'} />
        </Rect>
        <Txt ref={g3la} position={[-380, 30]} fontSize={SIZE.label} fill={T.blue} fontFamily={FONT.sans} text={'主语'} opacity={0} />
        <Txt ref={g3lb} position={[0, 30]} fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.sans} text={'谓语'} opacity={0} />
        <Txt ref={g3lc} position={[380, 30]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} text={'宾语'} opacity={0} />
        <Rect ref={g3bar} position={[0, 150]} width={700} height={90} radius={14} fill={T.card} stroke={T.line} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'吉姆 喜欢 香蕉'} />
        </Rect>
      </Node>

      {/* b4：Lucy 节点居中，宾语是值 */}
      <Node ref={g4} opacity={0}>
        <Circle ref={g4lucy} position={[0, -40]} width={150} height={150} fill={T.card} stroke={T.blue} lineWidth={3} opacity={0}>
          <Txt fontSize={SIZE.title} fill={T.text} fontFamily={FONT.sans} text={'Lucy'} />
        </Circle>
        <Txt ref={g4tag} position={[0, 110]} fontSize={SIZE.title} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'宾语是值'} opacity={0} />
      </Node>

      {/* b5：节点上贴属性小纸条 age 33 */}
      <Node ref={g5} opacity={0}>
        <Circle ref={g5lucy} position={[-180, -40]} width={150} height={150} fill={T.card} stroke={T.blue} lineWidth={3} opacity={0}>
          <Txt fontSize={SIZE.title} fill={T.text} fontFamily={FONT.sans} text={'Lucy'} />
        </Circle>
        <Rect ref={g5note} position={[180, -40]} width={260} height={110} radius={12} fill={T.card} stroke={T.yellow} lineWidth={2} opacity={0}>
          <Txt ref={g5key} position={[-60, 0]} fontSize={SIZE.body} fill={T.blue} fontFamily={FONT.mono} text={'age'} opacity={0} />
          <Txt ref={g5val} position={[60, 0]} fontSize={SIZE.body} fill={T.green} fontFamily={FONT.mono} text={'33'} opacity={0} />
        </Rect>
      </Node>

      {/* b6：宾语是节点，谓语就是边；主语尾顶点，宾语头顶点 */}
      <Node ref={g6} opacity={0}>
        <Circle ref={g6lucy} position={[-280, -40]} width={150} height={150} fill={T.card} stroke={T.blue} lineWidth={3} opacity={0}>
          <Txt fontSize={SIZE.title} fill={T.text} fontFamily={FONT.sans} text={'Lucy'} />
        </Circle>
        <Circle ref={g6alain} position={[280, -40]} width={150} height={150} fill={T.card} stroke={T.blue} lineWidth={3} opacity={0}>
          <Txt fontSize={SIZE.title} fill={T.text} fontFamily={FONT.sans} text={'Alain'} />
        </Circle>
        <Line ref={g6edge} points={[[-205, -40], [205, -40]]} stroke={T.yellow} lineWidth={3} endArrow opacity={0} />
        <Txt ref={g6lab} position={[0, -120]} fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.sans} text={'marriedTo'} opacity={0} />
        <Txt ref={g6tail} position={[-280, 90]} fontSize={SIZE.label} fill={T.blue} fontFamily={FONT.sans} text={'尾顶点：主语'} opacity={0} />
        <Txt ref={g6head} position={[280, 90]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} text={'头顶点：宾语'} opacity={0} />
      </Node>
    </>
  );

  say('主语–谓语–宾语');
  yield* beat('b1',
    all(g1().opacity(1, 0.5)),
    at('主语', g1a().opacity(1, 0.4)),
    at('谓语', g1b().opacity(1, 0.4)),
    at('宾语', g1c().opacity(1, 0.4)),
    at('能装下整张图吗', g1bar().opacity(1, 0.5)),
  );

  say('同一件事，两套词');
  yield* beat('b2',
    all(g1().opacity(0, 0.5), g2().opacity(1, 0.5)),
    at('属性图', chain(g2lucy().opacity(1, 0.4), g2alain().opacity(1, 0.4), g2edge().opacity(1, 0.4), g2labL().opacity(1, 0.4))),
    at('三元组存储', g2labR().opacity(1, 0.4)),
    at('换了一套词', g2tag().opacity(1, 0.4)),
  );

  say('吉姆，喜欢，香蕉');
  yield* beat('b3',
    all(g2().opacity(0, 0.5), g3().opacity(1, 0.5)),
    at('主语', chain(g3a().opacity(1, 0.4), g3la().opacity(1, 0.4))),
    at('谓语', chain(g3b().opacity(1, 0.4), g3lb().opacity(1, 0.4))),
    at('宾语', chain(g3c().opacity(1, 0.4), g3lc().opacity(1, 0.4))),
    at('吉姆喜欢香蕉', g3bar().opacity(1, 0.5)),
  );

  say('宾语是值');
  yield* beat('b4',
    all(g3().opacity(0, 0.5), g4().opacity(1, 0.5)),
    at('主语就是图里的一个节点', g4lucy().opacity(1, 0.5)),
    at('宾语是个值', g4tag().opacity(1, 0.4)),
    at('比如一个数字', g4lucy().scale(1.05, 0.5).to(1, 0.5)),
  );

  say('年龄 33');
  yield* beat('b5',
    all(g4().opacity(0, 0.5), g5().opacity(1, 0.5), g5lucy().opacity(1, 0.5)),
    at('谓语和宾语', g5lucy().scale(1.05, 0.5).to(1, 0.5)),
    at('Lucy 年龄 33', chain(g5note().opacity(1, 0.4), g5key().opacity(1, 0.3), g5val().opacity(1, 0.3))),
    at('小纸条', g5note().scale(1.06, 0.5).to(1, 0.5)),
  );

  say('宾语是节点，就是边');
  yield* beat('b6',
    all(g5().opacity(0, 0.5), g6().opacity(1, 0.5)),
    at('宾语是另一个节点', chain(g6lucy().opacity(1, 0.4), g6alain().opacity(1, 0.4))),
    at('谓语就是图里的一条边', chain(g6edge().opacity(1, 0.5), g6lab().opacity(1, 0.4))),
    at('起点', g6tail().opacity(1, 0.4)),
    at('终点', g6head().opacity(1, 0.4)),
  );
});
