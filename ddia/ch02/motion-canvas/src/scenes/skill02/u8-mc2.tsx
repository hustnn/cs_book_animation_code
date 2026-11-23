// U8 场景 2（MC）：b9–b17 —— 原图逐步生长（先出两个人，再出出生地/居住地，
// 最后 within 链逐级亮起）+ 两种模型、三种语言、Gremlin / Pregel。
// 分镜：skill-ch02/beats-u8.md U8 一节；原文：DDIA §2.10（书页 p49–50，PDF p71–72）。
// 原图读法按 /tmp/ch02-figs/f25-072.png 本身：方框=顶点（type/name 两到三行属性），
// 箭头=边（小写 lives_in / born_in / within）；married 在原图里是无箭头的横线，按原图画；
// name_fr / name_en 是大区（région）顶点的属性，不是 Côte-d'Or 的，按原图画。
// 顶点、边、标签全部显式写出，不用嵌套 map（map 嵌套 map 会静默丢整行，QA 检不出）。
// 时长全部来自 timeline/u8.json（beat() 驱动），不手写 waitFor。
// 颜色、字号、安全区一律取自 lib/theme，不手写十六进制色值。
import {Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, chain, createRef} from '@motion-canvas/core';
import {at, makeBeats} from '../../lib/beats';
import {FONT, SAFE, SIZE, T} from '../../lib/theme';
import timeline from '../../timeline/u8.json';

export default makeScene2D(function* (view) {
  view.fill(T.bg);
  const beat = makeBeats(timeline);

  const header = createRef<Txt>();
  const anchor = createRef<Txt>();
  const say = (text: string) => anchor().text(text);

  const graph = createRef<Node>();
  // 顶点（方框）
  const vLucy = createRef<Rect>();
  const vAlain = createRef<Rect>();
  const vBeaune = createRef<Rect>();
  const vIdaho = createRef<Rect>();
  const vLondon = createRef<Rect>();
  const vCotedor = createRef<Rect>();
  const vUsa = createRef<Rect>();
  const vEngland = createRef<Rect>();
  const vBourg = createRef<Rect>();
  const vNamerica = createRef<Rect>();
  const vUk = createRef<Rect>();
  const vFrance = createRef<Rect>();
  const vEurope = createRef<Rect>();
  // 边（线）
  const eMarried = createRef<Line>();
  const eBornLucy = createRef<Line>();
  const eBornAlain = createRef<Line>();
  const eLiveLucy = createRef<Line>();
  const eLiveAlain = createRef<Line>();
  const eWIdahoUsa = createRef<Line>();
  const eWUsaNa = createRef<Line>();
  const eWLondonEng = createRef<Line>();
  const eWEngUk = createRef<Line>();
  const eWUkEu = createRef<Line>();
  const eWBeauneCo = createRef<Line>();
  const eWCoBourg = createRef<Line>();
  const eWBourgFr = createRef<Line>();
  const eWFrEu = createRef<Line>();
  // 边标签
  const lMarried = createRef<Txt>();
  const lBornLucy = createRef<Txt>();
  const lBornAlain = createRef<Txt>();
  const lLiveLucy = createRef<Txt>();
  const lLiveAlain = createRef<Txt>();
  const lWIdahoUsa = createRef<Txt>();
  const lWUsaNa = createRef<Txt>();
  const lWLondonEng = createRef<Txt>();
  const lWEngUk = createRef<Txt>();
  const lWUkEu = createRef<Txt>();
  const lWBeauneCo = createRef<Txt>();
  const lWCoBourg = createRef<Txt>();
  const lWBourgFr = createRef<Txt>();
  const lWFrEu = createRef<Txt>();
  // b16/b17
  const g16 = createRef<Node>();
  const g16prop = createRef<Rect>();
  const g16triple = createRef<Rect>();
  const g16langs = [0, 1, 2].map(() => createRef<Rect>());
  const g17 = createRef<Node>();
  const g17gremlin = createRef<Rect>();
  const g17pregel = createRef<Rect>();

  const vtxt = (y: number, text: string, muted: boolean) => (
    <Txt position={[0, y]} fontSize={20} fill={muted ? T.muted : T.text} fontFamily={FONT.sans} text={text} />
  );

  view.add(
    <>
      <Txt
        ref={header}
        position={[-SAFE.halfW, -SAFE.halfH]}
        offset={[-1, -1]}
        fontSize={SIZE.label}
        fill={T.muted}
        fontFamily={FONT.sans}
        text={'数据是图'}
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

      {/* 原图：13 个顶点 + 14 条边；坐标按原图三列布局（左 Idaho 链、中 London 链、右 Beaune 链） */}
      <Node ref={graph} opacity={0}>
        {/* 边先画，顶点盖在线上 */}
        <Line ref={eMarried} points={[[-285, 215], [-205, 215]]} stroke={T.line} lineWidth={3} opacity={0} />
        <Line ref={eBornLucy} points={[[-430, 177], [-470, 145]]} stroke={T.line} lineWidth={2} endArrow opacity={0} />
        <Line ref={eBornAlain} points={[[25, 215], [215, 215]]} stroke={T.line} lineWidth={2} endArrow opacity={0} />
        <Line ref={eLiveLucy} points={[[-370, 177], [-100, 133]]} stroke={T.line} lineWidth={2} endArrow opacity={0} />
        <Line ref={eLiveAlain} points={[[-85, 177], [-65, 133]]} stroke={T.line} lineWidth={2} endArrow opacity={0} />
        <Line ref={eWIdahoUsa} points={[[-480, 45], [-480, 8]]} stroke={T.line} lineWidth={2} endArrow opacity={0} />
        <Line ref={eWUsaNa} points={[[-480, -68], [-480, -117]]} stroke={T.line} lineWidth={2} endArrow opacity={0} />
        <Line ref={eWLondonEng} points={[[-60, 57], [-60, 8]]} stroke={T.line} lineWidth={2} endArrow opacity={0} />
        <Line ref={eWEngUk} points={[[-60, -68], [-60, -117]]} stroke={T.line} lineWidth={2} endArrow opacity={0} />
        <Line ref={eWUkEu} points={[[-30, -193], [70, -243]]} stroke={T.line} lineWidth={2} endArrow opacity={0} />
        <Line ref={eWBeauneCo} points={[[380, 177], [380, 133]]} stroke={T.line} lineWidth={2} endArrow opacity={0} />
        <Line ref={eWCoBourg} points={[[380, 57], [380, 20]]} stroke={T.line} lineWidth={2} endArrow opacity={0} />
        <Line ref={eWBourgFr} points={[[380, -80], [380, -117]]} stroke={T.line} lineWidth={2} endArrow opacity={0} />
        <Line ref={eWFrEu} points={[[330, -193], [255, -243]]} stroke={T.line} lineWidth={2} endArrow opacity={0} />

        {/* 顶点 */}
        <Rect ref={vLucy} position={[-400, 215]} width={230} height={76} radius={12} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          {vtxt(-13, 'type: person', true)}
          {vtxt(13, 'name: Lucy', false)}
        </Rect>
        <Rect ref={vAlain} position={[-90, 215]} width={230} height={76} radius={12} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          {vtxt(-13, 'type: person', true)}
          {vtxt(13, 'name: Alain', false)}
        </Rect>
        <Rect ref={vBeaune} position={[330, 215]} width={230} height={76} radius={12} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          {vtxt(-13, 'type: city', true)}
          {vtxt(13, 'name: Beaune', false)}
        </Rect>
        <Rect ref={vIdaho} position={[-480, 95]} width={240} height={100} radius={12} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          {vtxt(-26, 'type: state', true)}
          {vtxt(0, 'name: Idaho', false)}
          {vtxt(26, 'abbreviation: ID', true)}
        </Rect>
        <Rect ref={vLondon} position={[-60, 95]} width={230} height={76} radius={12} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          {vtxt(-13, 'type: city', true)}
          {vtxt(13, 'name: London', false)}
        </Rect>
        <Rect ref={vCotedor} position={[380, 95]} width={250} height={76} radius={12} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          {vtxt(-13, 'type: département', true)}
          {vtxt(13, "name: Côte-d'Or", false)}
        </Rect>
        <Rect ref={vUsa} position={[-480, -30]} width={260} height={76} radius={12} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          {vtxt(-13, 'type: country', true)}
          {vtxt(13, 'name: United States', false)}
        </Rect>
        <Rect ref={vEngland} position={[-60, -30]} width={230} height={76} radius={12} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          {vtxt(-13, 'type: country', true)}
          {vtxt(13, 'name: England', false)}
        </Rect>
        <Rect ref={vBourg} position={[380, -30]} width={260} height={100} radius={12} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          {vtxt(-26, 'type: région', true)}
          {vtxt(0, 'name_fr: Bourgogne', false)}
          {vtxt(26, 'name_en: Burgundy', true)}
        </Rect>
        <Rect ref={vNamerica} position={[-480, -155]} width={260} height={76} radius={12} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          {vtxt(-13, 'type: continent', true)}
          {vtxt(13, 'name: North America', false)}
        </Rect>
        <Rect ref={vUk} position={[-60, -155]} width={260} height={76} radius={12} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          {vtxt(-13, 'type: country', true)}
          {vtxt(13, 'name: United Kingdom', false)}
        </Rect>
        <Rect ref={vFrance} position={[380, -155]} width={230} height={76} radius={12} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          {vtxt(-13, 'type: country', true)}
          {vtxt(13, 'name: France', false)}
        </Rect>
        <Rect ref={vEurope} position={[160, -275]} width={230} height={64} radius={12} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          {vtxt(-11, 'type: continent', true)}
          {vtxt(11, 'name: Europe', false)}
        </Rect>

        {/* 边标签（小写，与原图一致；放在线的旁侧，不压线） */}
        <Txt ref={lMarried} position={[-245, 185]} fontSize={18} fill={T.text} fontFamily={FONT.mono} text={'married'} opacity={0} />
        <Txt ref={lBornLucy} position={[-535, 161]} fontSize={18} fill={T.text} fontFamily={FONT.mono} text={'born_in'} opacity={0} />
        <Txt ref={lBornAlain} position={[120, 185]} fontSize={18} fill={T.text} fontFamily={FONT.mono} text={'born_in'} opacity={0} />
        <Txt ref={lLiveLucy} position={[-250, 132]} fontSize={18} fill={T.text} fontFamily={FONT.mono} text={'lives_in'} opacity={0} />
        <Txt ref={lLiveAlain} position={[-30, 150]} fontSize={18} fill={T.text} fontFamily={FONT.mono} text={'lives_in'} opacity={0} />
        <Txt ref={lWIdahoUsa} position={[-430, 26]} fontSize={18} fill={T.text} fontFamily={FONT.mono} text={'within'} opacity={0} />
        <Txt ref={lWUsaNa} position={[-430, -92]} fontSize={18} fill={T.text} fontFamily={FONT.mono} text={'within'} opacity={0} />
        <Txt ref={lWLondonEng} position={[-10, 32]} fontSize={18} fill={T.text} fontFamily={FONT.mono} text={'within'} opacity={0} />
        <Txt ref={lWEngUk} position={[-10, -92]} fontSize={18} fill={T.text} fontFamily={FONT.mono} text={'within'} opacity={0} />
        <Txt ref={lWUkEu} position={[-95, -218]} fontSize={18} fill={T.text} fontFamily={FONT.mono} text={'within'} opacity={0} />
        <Txt ref={lWBeauneCo} position={[430, 155]} fontSize={18} fill={T.text} fontFamily={FONT.mono} text={'within'} opacity={0} />
        <Txt ref={lWCoBourg} position={[430, 38]} fontSize={18} fill={T.text} fontFamily={FONT.mono} text={'within'} opacity={0} />
        <Txt ref={lWBourgFr} position={[430, -98]} fontSize={18} fill={T.text} fontFamily={FONT.mono} text={'within'} opacity={0} />
        <Txt ref={lWFrEu} position={[210, -215]} fontSize={18} fill={T.text} fontFamily={FONT.mono} text={'within'} opacity={0} />
      </Node>

      {/* b16：两种模型 + 三种语言 */}
      <Node ref={g16} opacity={0}>
        <Rect ref={g16prop} position={[-300, -100]} width={440} height={220} radius={16} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt position={[0, -50]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'属性图模型'} />
          <Txt position={[0, 20]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'Neo4j、Titan'} />
          <Txt position={[0, 60]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'InfiniteGraph'} />
        </Rect>
        <Rect ref={g16triple} position={[300, -100]} width={440} height={220} radius={16} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt position={[0, -50]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'三元组存储'} />
          <Txt position={[0, 20]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'Datomic'} />
          <Txt position={[0, 60]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'AllegroGraph'} />
        </Rect>
        {[0, 1, 2].map(i => (
          <Rect key={`g16l-${i}`} ref={g16langs[i]} position={[-360 + i * 360, 140]} width={300} height={90} radius={12} fill={T.card} stroke={T.yellow} lineWidth={2} opacity={0}>
            <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={['Cypher', 'SPARQL', 'Datalog'][i]} />
          </Rect>
        ))}
      </Node>

      {/* b17：Gremlin / Pregel */}
      <Node ref={g17} opacity={0}>
        <Rect ref={g17gremlin} position={[-280, 140]} width={380} height={110} radius={12} fill={T.card} stroke={T.purple} lineWidth={2} opacity={0}>
          <Txt position={[0, -18]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'Gremlin'} />
          <Txt position={[0, 26]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'命令式'} />
        </Rect>
        <Rect ref={g17pregel} position={[280, 140]} width={380} height={110} radius={12} fill={T.card} stroke={T.purple} lineWidth={2} opacity={0}>
          <Txt position={[0, -18]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'Pregel'} />
          <Txt position={[0, 26]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'图处理框架'} />
        </Rect>
      </Node>
    </>
  );

  say('Lucy、Alain，已婚');
  yield* beat('b9',
    all(graph().opacity(1, 0.5)),
    at('Lucy 和 Alain', chain(vLucy().opacity(1, 0.5), vAlain().opacity(1, 0.5))),
    at('已婚', chain(eMarried().opacity(1, 0.4), lMarried().opacity(1, 0.4))),
  );

  say('出生地');
  yield* beat('b10',
    at('Lucy 出生在 Idaho', chain(vIdaho().opacity(1, 0.5), eBornLucy().opacity(1, 0.4), lBornLucy().opacity(1, 0.4))),
    at('Alain 出生在', chain(vBeaune().opacity(1, 0.5), eBornAlain().opacity(1, 0.4), lBornAlain().opacity(1, 0.4))),
  );

  say('共用一个伦敦');
  yield* beat('b11',
    at('都住在伦敦', vLondon().opacity(1, 0.5)),
    at('同一座城市', chain(eLiveLucy().opacity(1, 0.4), lLiveLucy().opacity(1, 0.4), eLiveAlain().opacity(1, 0.4), lLiveAlain().opacity(1, 0.4))),
    at('共用一个顶点', chain(vLondon().lineWidth(4, 0.3), vLondon().lineWidth(2, 0.3))),
  );

  say('Idaho → 美国 → 北美洲');
  yield* beat('b12',
    at('Idaho 在美国里', chain(vUsa().opacity(1, 0.5), eWIdahoUsa().opacity(1, 0.4), lWIdahoUsa().opacity(1, 0.4))),
    at('美国在北美洲里', chain(vNamerica().opacity(1, 0.5), eWUsaNa().opacity(1, 0.4), lWUsaNa().opacity(1, 0.4))),
  );

  say('伦敦 → 英国 → 欧洲');
  yield* beat('b13',
    at('伦敦在英格兰里', chain(vEngland().opacity(1, 0.5), eWLondonEng().opacity(1, 0.4), lWLondonEng().opacity(1, 0.4))),
    at('英格兰在英国里', chain(vUk().opacity(1, 0.5), eWEngUk().opacity(1, 0.4), lWEngUk().opacity(1, 0.4))),
    at('英国在欧洲里', chain(vEurope().opacity(1, 0.5), eWUkEu().opacity(1, 0.4), lWUkEu().opacity(1, 0.4))),
  );

  say('Beaune → 法国 → 欧洲');
  yield* beat('b14',
    at('Beaune 在', chain(vCotedor().opacity(1, 0.5), eWBeauneCo().opacity(1, 0.4), lWBeauneCo().opacity(1, 0.4))),
    at('勃艮第大区里', chain(vBourg().opacity(1, 0.5), eWCoBourg().opacity(1, 0.4), lWCoBourg().opacity(1, 0.4))),
    at('大区在法国里', chain(vFrance().opacity(1, 0.5), eWBourgFr().opacity(1, 0.4), lWBourgFr().opacity(1, 0.4))),
    at('法国在欧洲里', chain(eWFrEu().opacity(1, 0.4), lWFrEu().opacity(1, 0.4))),
  );

  // b15：亮点沿三条 within 链逐个顶点扫过——顶点描边加粗（2→4）并保持，
  // 不用圆点扫：圆点停在顶点中心时会短暂压住框内文字（QA covered warn）。
  say('方框是顶点，箭头是边');
  yield* beat('b15',
    chain(
      vIdaho().lineWidth(4, 0.4),
      vUsa().lineWidth(4, 0.4),
      vNamerica().lineWidth(4, 0.4),
      vLondon().lineWidth(4, 0.55),
      vEngland().lineWidth(4, 0.4),
      vUk().lineWidth(4, 0.4),
      vEurope().lineWidth(4, 0.55),
      vBeaune().lineWidth(4, 0.55),
      vCotedor().lineWidth(4, 0.4),
      vBourg().lineWidth(4, 0.4),
      vFrance().lineWidth(4, 0.4),
      vEurope().lineWidth(4, 0.55),
    ),
  );

  say('两种模型，三种语言');
  yield* beat('b16',
    all(graph().opacity(0, 0.5), g16().opacity(1, 0.5)),
    at('属性图模型', g16prop().opacity(1, 0.5)),
    at('三元组存储模型', g16triple().opacity(1, 0.5)),
    at('Cypher、SPARQL、Datalog', chain(g16langs[0]().opacity(1, 0.4), g16langs[1]().opacity(1, 0.4), g16langs[2]().opacity(1, 0.4))),
  );

  say('Gremlin、Pregel');
  yield* beat('b17',
    all(g16().opacity(0, 0.5), g17().opacity(1, 0.5)),
    at('Gremlin', g17gremlin().opacity(1, 0.5)),
    at('Pregel', g17pregel().opacity(1, 0.5)),
  );
});
