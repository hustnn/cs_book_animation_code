// U9 场景 2（MC）：b7–b12 —— 移民问题、MATCH 四行查询、两条路径、
// 只画形状不画步骤。
// 分镜：skill-ch02/beats-u9.md U9 一节；原文：DDIA §2.12（书页 p52–53，PDF p74–75），Example 2-4。
// 图数据沿用 U8 的 Lucy 图（Figure 2-5 布局，顶点坐标与 u8-mc2.tsx 一致）；
// 图上边标签用小写（born_in / lives_in / within，与原图一致），Cypher 代码段用大写。
// 旁白用“节点”代“顶点”（TTS 规避，见 beats-u9.md r1 注）；画面文字用“顶点”。
// 时长全部来自 timeline/u9.json（beat() 驱动），不手写 waitFor。
import {Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, chain, createRef} from '@motion-canvas/core';
import {at, makeBeats} from '../../lib/beats';
import {FONT, SAFE, SIZE, T} from '../../lib/theme';
import timeline from '../../timeline/u9.json';

export default makeScene2D(function* (view) {
  view.fill(T.bg);
  const beat = makeBeats(timeline);

  const header = createRef<Txt>();
  const anchor = createRef<Txt>();
  const say = (text: string) => anchor().text(text);

  // 图：Lucy 子图（U8 坐标）
  const graph = createRef<Node>();
  const vLucy = createRef<Rect>();
  const vIdaho = createRef<Rect>();
  const vLondon = createRef<Rect>();
  const vUsa = createRef<Rect>();
  const vEngland = createRef<Rect>();
  const vNa = createRef<Rect>();
  const vUk = createRef<Rect>();
  const vEurope = createRef<Rect>();
  const eBorn = createRef<Line>();
  const eLive = createRef<Line>();
  const eW1 = createRef<Line>();
  const eW2 = createRef<Line>();
  const eW3 = createRef<Line>();
  const eW4 = createRef<Line>();
  const eW5 = createRef<Line>();
  const lBorn = createRef<Txt>();
  const lLive = createRef<Txt>();
  const lW1 = createRef<Txt>();
  const lW2 = createRef<Txt>();
  const lW3 = createRef<Txt>();
  const lW4 = createRef<Txt>();
  const lW5 = createRef<Txt>();
  const qMark = createRef<Txt>();
  const retChip = createRef<Txt>();
  // 查询卡
  const qcard = createRef<Rect>();
  const qL0 = createRef<Txt>();
  const qL1 = createRef<Txt>();
  const qL2 = createRef<Txt>();
  const qL3 = createRef<Txt>();
  const qTag4 = createRef<Txt>();
  const ring1 = createRef<Rect>();
  const ring2 = createRef<Rect>();
  const anyTag = createRef<Txt>();
  // 两条路径小图（芯片行）
  const row1 = createRef<Node>();
  const cPerson1 = createRef<Rect>();
  const cBirth = createRef<Rect>();
  const cWithin1 = createRef<Rect>();
  const cUsa = createRef<Rect>();
  const a12 = createRef<Txt>();
  const a23 = createRef<Txt>();
  const a34 = createRef<Txt>();
  const anyTag2 = createRef<Txt>();
  const row2 = createRef<Node>();
  const cPerson2 = createRef<Rect>();
  const cLive = createRef<Rect>();
  const cWithin2 = createRef<Rect>();
  const cEu = createRef<Rect>();
  const b12 = createRef<Txt>();
  const b23 = createRef<Txt>();
  const b34 = createRef<Txt>();
  const check = createRef<Txt>();

  view.add(
    <>
      <Txt
        ref={header}
        position={[-SAFE.halfW, -SAFE.halfH]}
        offset={[-1, -1]}
        fontSize={SIZE.label}
        fill={T.muted}
        fontFamily={FONT.sans}
        text={'查图：Cypher 与 SQL'}
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

      {/* Lucy 子图：顶点与边初始即不透明，显隐由 graph 节点控制 */}
      <Node ref={graph} opacity={0}>
        <Line ref={eBorn} points={[[-430, 177], [-470, 145]]} stroke={T.line} lineWidth={2} endArrow />
        <Line ref={eLive} points={[[-370, 177], [-100, 133]]} stroke={T.line} lineWidth={2} endArrow />
        <Line ref={eW1} points={[[-480, 45], [-480, 8]]} stroke={T.line} lineWidth={2} endArrow />
        <Line ref={eW2} points={[[-480, -68], [-480, -117]]} stroke={T.line} lineWidth={2} endArrow />
        <Line ref={eW3} points={[[-60, 57], [-60, 8]]} stroke={T.line} lineWidth={2} endArrow />
        <Line ref={eW4} points={[[-60, -68], [-60, -117]]} stroke={T.line} lineWidth={2} endArrow />
        <Line ref={eW5} points={[[-30, -193], [70, -243]]} stroke={T.line} lineWidth={2} endArrow />
        <Rect ref={vLucy} position={[-400, 215]} width={230} height={76} radius={12} fill={T.card} stroke={T.blue} lineWidth={2}>
          <Txt position={[0, -13]} fontSize={20} fill={T.muted} fontFamily={FONT.sans} text={'type: person'} />
          <Txt position={[0, 13]} fontSize={20} fill={T.text} fontFamily={FONT.sans} text={'name: Lucy'} />
        </Rect>
        <Rect ref={vIdaho} position={[-480, 95]} width={240} height={100} radius={12} fill={T.card} stroke={T.green} lineWidth={2}>
          <Txt position={[0, -26]} fontSize={20} fill={T.muted} fontFamily={FONT.sans} text={'type: state'} />
          <Txt position={[0, 0]} fontSize={20} fill={T.text} fontFamily={FONT.sans} text={'name: Idaho'} />
          <Txt position={[0, 26]} fontSize={20} fill={T.muted} fontFamily={FONT.sans} text={'abbreviation: ID'} />
        </Rect>
        <Rect ref={vLondon} position={[-60, 95]} width={230} height={76} radius={12} fill={T.card} stroke={T.green} lineWidth={2}>
          <Txt position={[0, -13]} fontSize={20} fill={T.muted} fontFamily={FONT.sans} text={'type: city'} />
          <Txt position={[0, 13]} fontSize={20} fill={T.text} fontFamily={FONT.sans} text={'name: London'} />
        </Rect>
        <Rect ref={vUsa} position={[-480, -30]} width={260} height={76} radius={12} fill={T.card} stroke={T.green} lineWidth={2}>
          <Txt position={[0, -13]} fontSize={20} fill={T.muted} fontFamily={FONT.sans} text={'type: country'} />
          <Txt position={[0, 13]} fontSize={20} fill={T.text} fontFamily={FONT.sans} text={'name: United States'} />
        </Rect>
        <Rect ref={vEngland} position={[-60, -30]} width={230} height={76} radius={12} fill={T.card} stroke={T.green} lineWidth={2}>
          <Txt position={[0, -13]} fontSize={20} fill={T.muted} fontFamily={FONT.sans} text={'type: country'} />
          <Txt position={[0, 13]} fontSize={20} fill={T.text} fontFamily={FONT.sans} text={'name: England'} />
        </Rect>
        <Rect ref={vNa} position={[-480, -155]} width={260} height={76} radius={12} fill={T.card} stroke={T.green} lineWidth={2}>
          <Txt position={[0, -13]} fontSize={20} fill={T.muted} fontFamily={FONT.sans} text={'type: continent'} />
          <Txt position={[0, 13]} fontSize={20} fill={T.text} fontFamily={FONT.sans} text={'name: North America'} />
        </Rect>
        <Rect ref={vUk} position={[-60, -155]} width={260} height={76} radius={12} fill={T.card} stroke={T.green} lineWidth={2}>
          <Txt position={[0, -13]} fontSize={20} fill={T.muted} fontFamily={FONT.sans} text={'type: country'} />
          <Txt position={[0, 13]} fontSize={20} fill={T.text} fontFamily={FONT.sans} text={'name: United Kingdom'} />
        </Rect>
        <Rect ref={vEurope} position={[160, -275]} width={230} height={64} radius={12} fill={T.card} stroke={T.green} lineWidth={2}>
          <Txt position={[0, -11]} fontSize={20} fill={T.muted} fontFamily={FONT.sans} text={'type: continent'} />
          <Txt position={[0, 11]} fontSize={20} fill={T.text} fontFamily={FONT.sans} text={'name: Europe'} />
        </Rect>
        <Txt ref={lBorn} position={[-535, 161]} fontSize={18} fill={T.text} fontFamily={FONT.mono} text={'born_in'} />
        <Txt ref={lLive} position={[-250, 132]} fontSize={18} fill={T.text} fontFamily={FONT.mono} text={'lives_in'} />
        <Txt ref={lW1} position={[-430, 26]} fontSize={18} fill={T.text} fontFamily={FONT.mono} text={'within'} />
        <Txt ref={lW2} position={[-430, -92]} fontSize={18} fill={T.text} fontFamily={FONT.mono} text={'within'} />
        <Txt ref={lW3} position={[-10, 32]} fontSize={18} fill={T.text} fontFamily={FONT.mono} text={'within'} />
        <Txt ref={lW4} position={[-10, -92]} fontSize={18} fill={T.text} fontFamily={FONT.mono} text={'within'} />
        <Txt ref={lW5} position={[-95, -218]} fontSize={18} fill={T.text} fontFamily={FONT.mono} text={'within'} />
        <Txt ref={qMark} position={[-270, -100]} fontSize={40} fill={T.yellow} fontFamily={FONT.sans} text={'?'} opacity={0} />
        <Txt ref={retChip} position={[430, -275]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} text={'返回名字'} opacity={0} />
      </Node>

      {/* Cypher 查询卡：行左对齐，便于 b12 圈出“()” */}
      <Rect ref={qcard} position={[0, -40]} width={1000} height={280} radius={16} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
        <Txt ref={qL0} position={[-470, -100]} offset={[-1, 0]} textAlign={'left'} fontSize={24} fill={T.blue} fontFamily={FONT.mono} text={'MATCH'} opacity={0} />
        <Txt ref={qL1} position={[-470, -50]} offset={[-1, 0]} textAlign={'left'} fontSize={18} fill={T.text} fontFamily={FONT.mono} text={"(person) -[:BORN_IN]-> () -[:WITHIN*0..]-> (us:Location {name:'United States'}),"} opacity={0} />
        <Txt ref={qL2} position={[-470, 0]} offset={[-1, 0]} textAlign={'left'} fontSize={18} fill={T.text} fontFamily={FONT.mono} text={"(person) -[:LIVES_IN]-> () -[:WITHIN*0..]-> (eu:Location {name:'Europe'})"} opacity={0} />
        <Txt ref={qL3} position={[-470, 50]} offset={[-1, 0]} textAlign={'left'} fontSize={24} fill={T.green} fontFamily={FONT.mono} text={'RETURN person.name'} opacity={0} />
        <Txt ref={qTag4} position={[470, -100]} offset={[1, 0]} textAlign={'right'} fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.sans} text={'4 行'} opacity={0} />
        <Rect ref={ring1} key="qa-ignore-highlight-ring1" position={[-211, -50]} width={40} height={32} radius={8} fill={'#00000000'} stroke={T.yellow} lineWidth={2} opacity={0} />
        <Rect ref={ring2} key="qa-ignore-highlight-ring2" position={[-200, 0]} width={40} height={32} radius={8} fill={'#00000000'} stroke={T.yellow} lineWidth={2} opacity={0} />
        <Txt ref={anyTag} position={[0, -215]} fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.sans} text={'任意顶点'} opacity={0} />
      </Rect>

      {/* 两条路径芯片行 */}
      <Node ref={row1} opacity={0}>
        <Rect ref={cPerson1} position={[-450, 150]} width={220} height={56} radius={10} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.min} fill={T.text} fontFamily={FONT.mono} text={'person'} />
        </Rect>
        <Rect ref={cBirth} position={[-150, 150]} width={220} height={56} radius={10} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.min} fill={T.text} fontFamily={FONT.sans} text={'出生地'} />
        </Rect>
        <Rect ref={cWithin1} position={[150, 150]} width={220} height={56} radius={10} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.min} fill={T.text} fontFamily={FONT.mono} text={'WITHIN*0..'} />
        </Rect>
        <Rect ref={cUsa} position={[450, 150]} width={220} height={56} radius={10} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.min} fill={T.text} fontFamily={FONT.sans} text={'美国'} />
        </Rect>
        <Txt ref={a12} position={[-300, 150]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'→'} opacity={0} />
        <Txt ref={a23} position={[0, 150]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'→'} opacity={0} />
        <Txt ref={a34} position={[300, 150]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'→'} opacity={0} />
        <Txt ref={anyTag2} position={[-150, 195]} fontSize={SIZE.min} fill={T.yellow} fontFamily={FONT.sans} text={'任意顶点'} opacity={0} />
      </Node>
      <Node ref={row2} opacity={0}>
        <Rect ref={cPerson2} position={[-450, 235]} width={220} height={56} radius={10} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.min} fill={T.text} fontFamily={FONT.mono} text={'person'} />
        </Rect>
        <Rect ref={cLive} position={[-150, 235]} width={220} height={56} radius={10} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.min} fill={T.text} fontFamily={FONT.sans} text={'居住地'} />
        </Rect>
        <Rect ref={cWithin2} position={[150, 235]} width={220} height={56} radius={10} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.min} fill={T.text} fontFamily={FONT.mono} text={'WITHIN*0..'} />
        </Rect>
        <Rect ref={cEu} position={[450, 235]} width={220} height={56} radius={10} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.min} fill={T.text} fontFamily={FONT.sans} text={'欧洲'} />
        </Rect>
        <Txt ref={b12} position={[-300, 235]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'→'} opacity={0} />
        <Txt ref={b23} position={[0, 235]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'→'} opacity={0} />
        <Txt ref={b34} position={[300, 235]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'→'} opacity={0} />
      </Node>
      <Txt ref={check} position={[0, 192]} fontSize={36} fill={T.green} fontFamily={FONT.sans} text={'✓'} opacity={0} />
    </>
  );

  say('谁从美国移民到欧洲');
  yield* beat('b7',
    graph().opacity(1, 2.0),
    at('美国', chain(vUsa().lineWidth(4, 0.3), vUsa().lineWidth(2, 0.3))),
    at('欧洲', chain(vEurope().lineWidth(4, 0.3), vEurope().lineWidth(2, 0.3), qMark().opacity(1, 0.4))),
  );

  say('两个条件，都要满足');
  yield* beat('b8a',
    at('BORN_IN', chain(
      vLucy().stroke(T.green, 0.3),
      eBorn().stroke(T.green, 0.3),
      eBorn().lineWidth(4, 0.3),
      lBorn().fill(T.green, 0.3),
    )),
    at('美国境内', chain(eW1().stroke(T.green, 0.3), eW2().stroke(T.green, 0.3), lW1().fill(T.green, 0.3), lW2().fill(T.green, 0.3))),
  );

  say('两个条件，都要满足');
  yield* beat('b8b',
    at('LIVES_IN', chain(
      eLive().stroke(T.green, 0.3),
      eLive().lineWidth(4, 0.3),
      lLive().fill(T.green, 0.3),
    )),
    at('欧洲境内', chain(eW3().stroke(T.green, 0.3), eW4().stroke(T.green, 0.3), eW5().stroke(T.green, 0.3), lW3().fill(T.green, 0.3), lW4().fill(T.green, 0.3), lW5().fill(T.green, 0.3))),
    at('返回每个人的名字', retChip().opacity(1, 0.4)),
  );

  say('四行查询');
  yield* beat('b9',
    all(graph().opacity(0, 0.4), qcard().opacity(1, 0.4)),
    at('MATCH', qL0().opacity(1, 0.4)),
    at('两行写出要找的形状', chain(qL1().opacity(1, 0.4), qL2().opacity(1, 0.4))),
    at('RETURN', chain(qL3().opacity(1, 0.4), qTag4().opacity(1, 0.4))),
  );

  say('第一条路：出生在美国');
  yield* beat('b10a',
    all(row1().opacity(1, 0.4), qL1().fill(T.yellow, 0.4)),
    at('person', chain(cPerson1().opacity(1, 0.4), a12().opacity(1, 0.3))),
    at('没名字的节点', chain(cBirth().opacity(1, 0.4), anyTag2().opacity(1, 0.4))),
  );

  say('第一条路：出生在美国');
  yield* beat('b10b',
    at('WITHIN', chain(cWithin1().opacity(1, 0.4), a23().opacity(1, 0.3))),
    at('United States', chain(cUsa().opacity(1, 0.4), a34().opacity(1, 0.3))),
  );

  say('第二条路：住在欧洲');
  yield* beat('b11a',
    all(row2().opacity(1, 0.4), qL1().fill(T.text, 0.3), qL2().fill(T.yellow, 0.4)),
    at('LIVES_IN', chain(cPerson2().opacity(1, 0.4), cLive().opacity(1, 0.4), b12().opacity(1, 0.3))),
    at('Europe', chain(cWithin2().opacity(1, 0.4), b23().opacity(1, 0.3), cEu().opacity(1, 0.4), b34().opacity(1, 0.3))),
  );

  say('第二条路：住在欧洲');
  yield* beat('b11b',
    at('同一个 person', chain(
      check().opacity(1, 0.4),
      cPerson1().lineWidth(4, 0.3),
      cPerson1().lineWidth(2, 0.3),
      cPerson2().lineWidth(4, 0.3),
      cPerson2().lineWidth(2, 0.3),
    )),
  );

  say('画形状，不画步骤');
  yield* beat('b12',
    at('括号里', ring1().opacity(1, 0.4)),
    at('没写名字的节点', ring2().opacity(1, 0.4)),
    at('随便哪个节点都行', chain(
      anyTag().opacity(1, 0.4),
      cBirth().lineWidth(4, 0.3),
      cBirth().lineWidth(2, 0.3),
      cLive().lineWidth(4, 0.3),
      cLive().lineWidth(2, 0.3),
    )),
  );
});
