// U9 场景 3（MC）：b13–b18b —— 两种执行路线、优化器、图进关系库、join 数量不固定。
// 分镜：skill-ch02/beats-u9.md U9 一节；原文：DDIA §2.12（书页 p53，PDF p75）、§2.13（书页 p53–54，PDF p75–76）。
// 图数据沿用 U8 的 Lucy/Alain 全图（Figure 2-5 布局，顶点坐标与 u8-mc2.tsx 一致）；
// 集合用半透明色块衬底（画在图之后、文字之下不会压字；圆圈描边会穿过顶点文字，
// 经核算改用衬底，见 b15）。
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

  // 全图（U8 坐标）；子元素初始不透明，显隐由 graph 节点控制
  const graph = createRef<Node>();
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
  const okLucy = createRef<Txt>();
  const noAlain = createRef<Txt>();
  const tagIndex = createRef<Txt>();
  const washUsa = createRef<Rect>();
  const washEu = createRef<Rect>();
  // b16：两条路线 + 优化器
  const g16 = createRef<Node>();
  const rScan = createRef<Rect>();
  const rRev = createRef<Rect>();
  const opt = createRef<Rect>();
  const chosen = createRef<Txt>();
  // b17：两张表 + SQL
  const g17 = createRef<Node>();
  const tVertices = createRef<Rect>();
  const tEdges = createRef<Rect>();
  const sqlTitle = createRef<Txt>();
  const hardTag = createRef<Txt>();
  // b18：join 示意
  const g18 = createRef<Node>();
  const j1 = createRef<Rect>();
  const j2 = createRef<Rect>();
  const j3 = createRef<Rect>();
  const jn1 = createRef<Txt>();
  const jn2 = createRef<Txt>();
  const bigQ = createRef<Txt>();
  const qLabel = createRef<Txt>();

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

      {/* 集合衬底：画在图之前（文字之下），淡入时只衬底色块 */}
      <Rect ref={washUsa} position={[-470, -30]} width={300} height={360} radius={24} fill={T.green} opacity={0} />
      <Rect ref={washEu} position={[30, -100]} width={500} height={440} radius={24} fill={T.blue} opacity={0} />

      <Node ref={graph} opacity={0}>
        <Line ref={eMarried} points={[[-285, 215], [-205, 215]]} stroke={T.line} lineWidth={3} />
        <Line ref={eBornLucy} points={[[-430, 177], [-470, 145]]} stroke={T.line} lineWidth={2} endArrow />
        <Line ref={eBornAlain} points={[[25, 215], [215, 215]]} stroke={T.line} lineWidth={2} endArrow />
        <Line ref={eLiveLucy} points={[[-370, 177], [-100, 133]]} stroke={T.line} lineWidth={2} endArrow />
        <Line ref={eLiveAlain} points={[[-85, 177], [-65, 133]]} stroke={T.line} lineWidth={2} endArrow />
        <Line ref={eWIdahoUsa} points={[[-480, 45], [-480, 8]]} stroke={T.line} lineWidth={2} endArrow />
        <Line ref={eWUsaNa} points={[[-480, -68], [-480, -117]]} stroke={T.line} lineWidth={2} endArrow />
        <Line ref={eWLondonEng} points={[[-60, 57], [-60, 8]]} stroke={T.line} lineWidth={2} endArrow />
        <Line ref={eWEngUk} points={[[-60, -68], [-60, -117]]} stroke={T.line} lineWidth={2} endArrow />
        <Line ref={eWUkEu} points={[[-30, -193], [70, -243]]} stroke={T.line} lineWidth={2} endArrow />
        <Line ref={eWBeauneCo} points={[[380, 177], [380, 133]]} stroke={T.line} lineWidth={2} endArrow />
        <Line ref={eWCoBourg} points={[[380, 57], [380, 20]]} stroke={T.line} lineWidth={2} endArrow />
        <Line ref={eWBourgFr} points={[[380, -80], [380, -117]]} stroke={T.line} lineWidth={2} endArrow />
        <Line ref={eWFrEu} points={[[330, -193], [255, -243]]} stroke={T.line} lineWidth={2} endArrow />
        <Rect ref={vLucy} position={[-400, 215]} width={230} height={76} radius={12} fill={T.card} stroke={T.blue} lineWidth={2}>
          <Txt position={[0, -13]} fontSize={20} fill={T.muted} fontFamily={FONT.sans} text={'type: person'} />
          <Txt position={[0, 13]} fontSize={20} fill={T.text} fontFamily={FONT.sans} text={'name: Lucy'} />
        </Rect>
        <Rect ref={vAlain} position={[-90, 215]} width={230} height={76} radius={12} fill={T.card} stroke={T.blue} lineWidth={2}>
          <Txt position={[0, -13]} fontSize={20} fill={T.muted} fontFamily={FONT.sans} text={'type: person'} />
          <Txt position={[0, 13]} fontSize={20} fill={T.text} fontFamily={FONT.sans} text={'name: Alain'} />
        </Rect>
        <Rect ref={vBeaune} position={[330, 215]} width={230} height={76} radius={12} fill={T.card} stroke={T.green} lineWidth={2}>
          <Txt position={[0, -13]} fontSize={20} fill={T.muted} fontFamily={FONT.sans} text={'type: city'} />
          <Txt position={[0, 13]} fontSize={20} fill={T.text} fontFamily={FONT.sans} text={'name: Beaune'} />
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
        <Rect ref={vCotedor} position={[380, 95]} width={250} height={76} radius={12} fill={T.card} stroke={T.green} lineWidth={2}>
          <Txt position={[0, -13]} fontSize={20} fill={T.muted} fontFamily={FONT.sans} text={'type: département'} />
          <Txt position={[0, 13]} fontSize={20} fill={T.text} fontFamily={FONT.sans} text={"name: Côte-d'Or"} />
        </Rect>
        <Rect ref={vUsa} position={[-480, -30]} width={260} height={76} radius={12} fill={T.card} stroke={T.green} lineWidth={2}>
          <Txt position={[0, -13]} fontSize={20} fill={T.muted} fontFamily={FONT.sans} text={'type: country'} />
          <Txt position={[0, 13]} fontSize={20} fill={T.text} fontFamily={FONT.sans} text={'name: United States'} />
        </Rect>
        <Rect ref={vEngland} position={[-60, -30]} width={230} height={76} radius={12} fill={T.card} stroke={T.green} lineWidth={2}>
          <Txt position={[0, -13]} fontSize={20} fill={T.muted} fontFamily={FONT.sans} text={'type: country'} />
          <Txt position={[0, 13]} fontSize={20} fill={T.text} fontFamily={FONT.sans} text={'name: England'} />
        </Rect>
        <Rect ref={vBourg} position={[380, -30]} width={260} height={100} radius={12} fill={T.card} stroke={T.green} lineWidth={2}>
          <Txt position={[0, -26]} fontSize={20} fill={T.muted} fontFamily={FONT.sans} text={'type: région'} />
          <Txt position={[0, 0]} fontSize={20} fill={T.text} fontFamily={FONT.sans} text={'name_fr: Bourgogne'} />
          <Txt position={[0, 26]} fontSize={20} fill={T.muted} fontFamily={FONT.sans} text={'name_en: Burgundy'} />
        </Rect>
        <Rect ref={vNamerica} position={[-480, -155]} width={260} height={76} radius={12} fill={T.card} stroke={T.green} lineWidth={2}>
          <Txt position={[0, -13]} fontSize={20} fill={T.muted} fontFamily={FONT.sans} text={'type: continent'} />
          <Txt position={[0, 13]} fontSize={20} fill={T.text} fontFamily={FONT.sans} text={'name: North America'} />
        </Rect>
        <Rect ref={vUk} position={[-60, -155]} width={260} height={76} radius={12} fill={T.card} stroke={T.green} lineWidth={2}>
          <Txt position={[0, -13]} fontSize={20} fill={T.muted} fontFamily={FONT.sans} text={'type: country'} />
          <Txt position={[0, 13]} fontSize={20} fill={T.text} fontFamily={FONT.sans} text={'name: United Kingdom'} />
        </Rect>
        <Rect ref={vFrance} position={[380, -155]} width={230} height={76} radius={12} fill={T.card} stroke={T.green} lineWidth={2}>
          <Txt position={[0, -13]} fontSize={20} fill={T.muted} fontFamily={FONT.sans} text={'type: country'} />
          <Txt position={[0, 13]} fontSize={20} fill={T.text} fontFamily={FONT.sans} text={'name: France'} />
        </Rect>
        <Rect ref={vEurope} position={[160, -275]} width={230} height={64} radius={12} fill={T.card} stroke={T.green} lineWidth={2}>
          <Txt position={[0, -11]} fontSize={20} fill={T.muted} fontFamily={FONT.sans} text={'type: continent'} />
          <Txt position={[0, 11]} fontSize={20} fill={T.text} fontFamily={FONT.sans} text={'name: Europe'} />
        </Rect>
        <Txt ref={lMarried} position={[-245, 185]} fontSize={18} fill={T.text} fontFamily={FONT.mono} text={'married'} />
        <Txt ref={lBornLucy} position={[-535, 161]} fontSize={18} fill={T.text} fontFamily={FONT.mono} text={'born_in'} />
        <Txt ref={lBornAlain} position={[120, 185]} fontSize={18} fill={T.text} fontFamily={FONT.mono} text={'born_in'} />
        <Txt ref={lLiveLucy} position={[-250, 132]} fontSize={18} fill={T.text} fontFamily={FONT.mono} text={'lives_in'} />
        <Txt ref={lLiveAlain} position={[-30, 150]} fontSize={18} fill={T.text} fontFamily={FONT.mono} text={'lives_in'} />
        <Txt ref={lWIdahoUsa} position={[-430, 26]} fontSize={18} fill={T.text} fontFamily={FONT.mono} text={'within'} />
        <Txt ref={lWUsaNa} position={[-430, -92]} fontSize={18} fill={T.text} fontFamily={FONT.mono} text={'within'} />
        <Txt ref={lWLondonEng} position={[-10, 32]} fontSize={18} fill={T.text} fontFamily={FONT.mono} text={'within'} />
        <Txt ref={lWEngUk} position={[-10, -92]} fontSize={18} fill={T.text} fontFamily={FONT.mono} text={'within'} />
        <Txt ref={lWUkEu} position={[-95, -218]} fontSize={18} fill={T.text} fontFamily={FONT.mono} text={'within'} />
        <Txt ref={lWBeauneCo} position={[430, 155]} fontSize={18} fill={T.text} fontFamily={FONT.mono} text={'within'} />
        <Txt ref={lWCoBourg} position={[430, 38]} fontSize={18} fill={T.text} fontFamily={FONT.mono} text={'within'} />
        <Txt ref={lWBourgFr} position={[430, -98]} fontSize={18} fill={T.text} fontFamily={FONT.mono} text={'within'} />
        <Txt ref={lWFrEu} position={[210, -215]} fontSize={18} fill={T.text} fontFamily={FONT.mono} text={'within'} />
        <Txt ref={okLucy} position={[-545, 215]} fontSize={30} fill={T.green} fontFamily={FONT.sans} text={'✓'} opacity={0} />
        <Txt ref={noAlain} position={[0, 195]} fontSize={30} fill={T.red} fontFamily={FONT.sans} text={'✗'} opacity={0} />
        <Txt ref={tagIndex} position={[-320, -30]} fontSize={SIZE.min} fill={T.yellow} fontFamily={FONT.sans} text={'索引'} opacity={0} />
      </Node>

      <Node ref={g16} opacity={0}>
        <Rect ref={rScan} position={[-300, 40]} width={460} height={220} radius={16} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt position={[0, -40]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'扫描路线'} />
          <Txt position={[0, 30]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'所有人，逐个检查'} />
        </Rect>
        <Rect ref={rRev} position={[300, 40]} width={460} height={220} radius={16} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt position={[0, -40]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'反向路线'} />
          <Txt position={[0, 30]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'从美国、欧洲往回找'} />
        </Rect>
        <Rect ref={opt} position={[0, -200]} width={320} height={90} radius={12} fill={T.card} stroke={T.yellow} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'查询优化器'} />
        </Rect>
        <Txt ref={chosen} position={[0, 220]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} text={'挑预测最高效的策略'} opacity={0} />
      </Node>

      <Node ref={g17} opacity={0}>
        <Txt ref={sqlTitle} position={[-80, -230]} fontSize={SIZE.title} fill={T.text} fontFamily={FONT.mono} text={'SQL'} opacity={0} />
        <Txt ref={hardTag} position={[80, -230]} fontSize={SIZE.label} fill={T.red} fontFamily={FONT.sans} text={'有点难'} opacity={0} />
        <Rect ref={tVertices} position={[-300, 0]} width={460} height={260} radius={16} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt position={[0, -90]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'顶点表 vertices'} />
          <Txt position={[0, -20]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.mono} text={'id | properties'} />
          <Txt position={[0, 40]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'1 | {name: Lucy}'} />
        </Rect>
        <Rect ref={tEdges} position={[300, 0]} width={460} height={260} radius={16} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt position={[0, -90]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'边表 edges'} />
          <Txt position={[0, -20]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.mono} text={'id | tail | head | label'} />
          <Txt position={[0, 40]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'1 | Lucy | Idaho | born_in'} />
        </Rect>
      </Node>

      <Node ref={g18} opacity={0}>
        <Rect ref={j1} position={[-360, 0]} width={240} height={100} radius={12} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'第 1 张表'} />
        </Rect>
        <Rect ref={j2} position={[0, 0]} width={240} height={100} radius={12} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'第 2 张表'} />
        </Rect>
        <Rect ref={j3} position={[360, 0]} width={240} height={100} radius={12} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'第 3 张表'} />
        </Rect>
        <Txt ref={jn1} position={[-180, 0]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.mono} text={'JOIN'} opacity={0} />
        <Txt ref={jn2} position={[180, 0]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.mono} text={'JOIN'} opacity={0} />
        <Txt ref={bigQ} position={[0, -160]} fontSize={SIZE.title} fill={T.yellow} fontFamily={FONT.sans} text={'?'} opacity={0} />
        <Txt ref={qLabel} position={[0, 150]} fontSize={SIZE.body} fill={T.yellow} fontFamily={FONT.sans} text={'join 数量 = ？'} opacity={0} />
      </Node>
    </>
  );

  say('扫一遍，逐个检查');
  yield* beat('b13',
    graph().opacity(1, 0.5),
    at('扫一遍', chain(
      vLucy().lineWidth(4, 0.4),
      vLucy().lineWidth(2, 0.4),
      vAlain().lineWidth(4, 0.4),
      vAlain().lineWidth(2, 0.4),
    )),
    at('只留符合条件的', chain(
      vLucy().stroke(T.green, 0.3),
      okLucy().opacity(1, 0.4),
      vAlain().opacity(0.35, 0.4),
      noAlain().opacity(1, 0.4),
    )),
  );

  say('反过来，从两头找');
  yield* beat('b14',
    all(
      vLucy().stroke(T.blue, 0.3),
      vAlain().opacity(1, 0.3),
      okLucy().opacity(0, 0.3),
      noAlain().opacity(0, 0.3),
    ),
    at('美国和欧洲', chain(
      vUsa().lineWidth(4, 0.3),
      vUsa().lineWidth(2, 0.3),
      vEurope().lineWidth(4, 0.3),
      vEurope().lineWidth(2, 0.3),
    )),
    at('往回找', chain(
      eWUsaNa().stroke(T.green, 0.3),
      eWIdahoUsa().stroke(T.green, 0.3),
      eWUkEu().stroke(T.green, 0.3),
      eWEngUk().stroke(T.green, 0.3),
      eWLondonEng().stroke(T.green, 0.3),
    )),
    at('索引', tagIndex().opacity(1, 0.4)),
    at('一下子就能找到', chain(tagIndex().scale(1.25, 0.3), tagIndex().scale(1, 0.3))),
  );

  say('先找地点，再找人');
  yield* beat('b15',
    all(
      eWUsaNa().stroke(T.line, 0.3),
      eWIdahoUsa().stroke(T.line, 0.3),
      eWUkEu().stroke(T.line, 0.3),
      eWEngUk().stroke(T.line, 0.3),
      eWLondonEng().stroke(T.line, 0.3),
      tagIndex().opacity(0, 0.3),
    ),
    at('美国境内', washUsa().opacity(0.18, 0.6)),
    at('欧洲境内', washEu().opacity(0.18, 0.6)),
    at('找到这些地点上的人', chain(
      vLucy().lineWidth(4, 0.3),
      vLucy().lineWidth(2, 0.3),
      okLucy().opacity(1, 0.4),
    )),
  );

  say('只说要什么');
  yield* beat('b16',
    all(graph().opacity(0, 0.4), washUsa().opacity(0, 0.4), washEu().opacity(0, 0.4), g16().opacity(1, 0.4)),
    at('两种跑法', chain(rScan().opacity(1, 0.5), rRev().opacity(1, 0.5))),
    at('优化器', opt().opacity(1, 0.5)),
    at('预测最高效', chosen().opacity(1, 0.4)),
  );

  say('SQL 也能查，但难');
  yield* beat('b17',
    all(g16().opacity(0, 0.4), g17().opacity(1, 0.4), tVertices().opacity(1, 0.5), tEdges().opacity(1, 0.5)),
    at('SQL', sqlTitle().opacity(1, 0.4)),
    at('有点难', hardTag().opacity(1, 0.4)),
  );

  say('join 数量不固定');
  yield* beat('b18a',
    all(g17().opacity(0, 0.4), g18().opacity(1, 0.4), j1().opacity(1, 0.4), j2().opacity(1, 0.4), j3().opacity(1, 0.4)),
    at('要 join 几张表', chain(jn1().opacity(1, 0.3), jn2().opacity(1, 0.3))),
  );

  say('join 数量不固定');
  yield* beat('b18b',
    at('join 的数量不固定', chain(bigQ().opacity(1, 0.4), qLabel().opacity(1, 0.4))),
  );
});
