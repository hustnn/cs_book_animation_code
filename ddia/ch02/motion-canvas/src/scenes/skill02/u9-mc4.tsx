// U9 场景 4（MC）：b19–b25b —— LIVES_IN 能指任何地点、地点层级、
// :WITHIN*0..、WITH RECURSIVE、4 行 vs 29 行、in_usa 一圈圈扩大。
// 分镜：skill-ch02/beats-u9.md U9 一节；原文：DDIA §2.13（书页 p54–55，PDF p76–77），Example 2-5。
// SQL 卡片为示意浓缩（行数与结构按原文，单行用 … 省略重复部分）；
// “递归公用表表达式”只上屏、不念进旁白（TTS 在“递归”处三次读出英文乱码，见 beats-u9.md r1 注）。
// 时长全部来自 timeline/u9.json（beat() 驱动），不手写 waitFor。
import {Circle, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
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

  // b19：五种地点
  const g19 = createRef<Node>();
  const pCards = [0, 1, 2, 3, 4].map(() => createRef<Rect>());
  const pArrows = [0, 1, 2, 3, 4].map(() => createRef<Line>());
  const pLabel = createRef<Txt>();
  // b20：层级塔 + 两支箭头
  const g20 = createRef<Node>();
  const tCity = createRef<Rect>();
  const tRegion = createRef<Rect>();
  const tState = createRef<Rect>();
  const tCountry = createRef<Rect>();
  const shortArrow = createRef<Line>();
  const shortLab = createRef<Txt>();
  const longArrow = createRef<Line>();
  const longLab = createRef<Txt>();
  // b21：*0..
  const g21 = createRef<Node>();
  const codeCard = createRef<Rect>();
  const codePre = createRef<Txt>();
  const codeStar = createRef<Txt>();
  const exZero = createRef<Txt>();
  const exMulti = createRef<Txt>();
  const rxCard = createRef<Rect>();
  // b22：标题 + 数据库卡
  const g22 = createRef<Node>();
  const wrTitle = createRef<Txt>();
  const rcteTitle = createRef<Txt>();
  const y1999 = createRef<Txt>();
  const wrSmall = createRef<Txt>();
  const dbCards = [0, 1, 2, 3].map(() => createRef<Rect>());
  // b23：4 行 vs 29 行
  const g23 = createRef<Node>();
  const cyCard = createRef<Rect>();
  const sqlCard = createRef<Node>();
  const tag29 = createRef<Txt>();
  // b24/b25：in_usa 集合
  const g24 = createRef<Node>();
  const inusaCard = createRef<Rect>();
  const iuL1 = createRef<Txt>();
  const iuL2 = createRef<Txt>();
  const iuL3 = createRef<Txt>();
  const iuUnion = createRef<Txt>();
  const wash = createRef<Rect>();
  const usaChip = createRef<Txt>();
  const idahoChip = createRef<Rect>();
  const dot1 = createRef<Circle>();
  const dot2 = createRef<Circle>();
  const doneCheck = createRef<Txt>();

  const places = ['街道', '城市', '区', '地区', '州'];
  const dbs = ['PostgreSQL', 'DB2', 'Oracle', 'SQL Server'];

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

      <Node ref={g19} opacity={0}>
        {places.map((p, i) => (
          <Rect key={`p-${i}`} ref={pCards[i]} position={[-440 + i * 220, 0]} width={200} height={90} radius={12} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={p} />
          </Rect>
        ))}
        {places.map((_, i) => (
          <Line key={`pa-${i}`} ref={pArrows[i]} points={[[-440 + i * 220, -80], [-440 + i * 220, -48]]} stroke={T.green} lineWidth={3} endArrow opacity={0} />
        ))}
        <Txt ref={pLabel} position={[-440, -120]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.mono} text={'LIVES_IN'} opacity={0} />
      </Node>

      <Node ref={g20} opacity={0}>
        <Rect ref={tCountry} position={[-350, -180]} width={260} height={64} radius={12} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'国家'} />
        </Rect>
        <Rect ref={tState} position={[-350, -95]} width={260} height={64} radius={12} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'州'} />
        </Rect>
        <Rect ref={tRegion} position={[-350, -10]} width={260} height={64} radius={12} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'地区'} />
        </Rect>
        <Rect ref={tCity} position={[-350, 75]} width={260} height={64} radius={12} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'城市'} />
        </Rect>
        <Line ref={shortArrow} points={[[150, -140], [350, -140]]} stroke={T.blue} lineWidth={3} endArrow opacity={0} />
        <Txt ref={shortLab} position={[250, -100]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'直接指到'} opacity={0} />
        <Line ref={longArrow} points={[[420, 100], [420, -160]]} stroke={T.yellow} lineWidth={3} endArrow opacity={0} />
        <Txt ref={longLab} position={[420, 140]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'隔三层'} opacity={0} />
      </Node>

      <Node ref={g21} opacity={0}>
        <Rect ref={codeCard} position={[0, -60]} width={700} height={140} radius={16} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt ref={codePre} position={[-80, 0]} fontSize={40} fill={T.text} fontFamily={FONT.mono} text={':WITHIN'} opacity={0} />
          <Txt ref={codeStar} position={[120, 0]} fontSize={52} fill={T.yellow} fontFamily={FONT.mono} text={'*0..'} opacity={0} />
        </Rect>
        <Txt ref={exZero} position={[-260, 80]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'零次：直接就是美国'} opacity={0} />
        <Txt ref={exMulti} position={[260, 80]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'多次：隔三层'} opacity={0} />
        <Rect ref={rxCard} position={[0, 190]} width={500} height={70} radius={12} fill={T.card} stroke={T.purple} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'正则表达式里的 *'} />
        </Rect>
      </Node>

      <Node ref={g22} opacity={0}>
        <Txt ref={wrTitle} position={[0, -40]} fontSize={SIZE.title} fill={T.text} fontFamily={FONT.mono} text={'WITH RECURSIVE'} opacity={0} />
        <Txt ref={rcteTitle} position={[0, -40]} fontSize={40} fill={T.text} fontFamily={FONT.sans} text={'递归公用表表达式'} opacity={0} />
        <Txt ref={y1999} position={[0, 60]} fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.sans} text={'SQL 1999'} opacity={0} />
        <Txt ref={wrSmall} position={[0, -140]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.mono} text={'WITH RECURSIVE 语法'} opacity={0} />
        {dbs.map((d, i) => (
          <Rect key={`db-${i}`} ref={dbCards[i]} position={[-450 + i * 300, 0]} width={260} height={100} radius={12} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={d} />
          </Rect>
        ))}
      </Node>

      <Node ref={g23} opacity={0}>
        <Rect ref={cyCard} position={[-300, 0]} width={440} height={300} radius={16} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt position={[0, -100]} fontSize={22} fill={T.blue} fontFamily={FONT.mono} text={'MATCH'} />
          <Txt position={[0, -40]} fontSize={16} fill={T.text} fontFamily={FONT.mono} text={'(person) -[:BORN_IN]-> …'} />
          <Txt position={[0, 10]} fontSize={16} fill={T.text} fontFamily={FONT.mono} text={'(person) -[:LIVES_IN]-> …'} />
          <Txt position={[0, 70]} fontSize={22} fill={T.green} fontFamily={FONT.mono} text={'RETURN person.name'} />
          <Txt position={[0, 120]} fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.sans} text={'4 行'} />
        </Rect>
        <Node ref={sqlCard} position={[300, 0]} opacity={0}>
          <Rect width={440} height={400} radius={16} fill={T.card} stroke={T.red} lineWidth={2} />
          {[...Array(29)].map((_, i) => (
            <Rect key={`sqlbar-${i}`} position={[0, -182 + i * 13]} width={380} height={7} radius={3} fill={T.line} />
          ))}
        </Node>
        <Txt ref={tag29} position={[300, -230]} fontSize={SIZE.body} fill={T.red} fontFamily={FONT.sans} text={'29 行'} opacity={0} />
      </Node>

      <Node ref={g24} opacity={0}>
        <Rect ref={inusaCard} position={[-300, 0]} width={480} height={320} radius={16} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt ref={iuL1} position={[-220, -110]} offset={[-1, 0]} textAlign={'left'} fontSize={16} fill={T.text} fontFamily={FONT.mono} text={'WITH RECURSIVE'} opacity={0} />
          <Txt ref={iuL2} position={[-220, -60]} offset={[-1, 0]} textAlign={'left'} fontSize={16} fill={T.blue} fontFamily={FONT.mono} text={'in_usa(vertex_id) AS ('} opacity={0} />
          <Txt ref={iuL3} position={[-220, -10]} offset={[-1, 0]} textAlign={'left'} fontSize={16} fill={T.text} fontFamily={FONT.mono} text={"  … name = 'United States'"} opacity={0} />
          <Txt ref={iuUnion} position={[-220, 40]} offset={[-1, 0]} textAlign={'left'} fontSize={16} fill={T.yellow} fontFamily={FONT.mono} text={'  UNION …'} opacity={0} />
        </Rect>
        <Rect ref={wash} position={[300, 0]} width={300} height={300} radius={24} fill={T.green} opacity={0} />
        <Txt ref={usaChip} position={[300, 0]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'美国'} opacity={0} />
        <Rect ref={idahoChip} position={[300, -70]} width={160} height={56} radius={10} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.min} fill={T.text} fontFamily={FONT.sans} text={'Idaho'} />
        </Rect>
        <Circle ref={dot1} position={[220, 70]} width={24} height={24} fill={T.green} opacity={0} />
        <Circle ref={dot2} position={[380, 70]} width={24} height={24} fill={T.green} opacity={0} />
        <Txt ref={doneCheck} position={[300, -190]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} text={'✓ 全部走过'} opacity={0} />
      </Node>
    </>
  );

  say('能指任何一种地点');
  yield* beat('b19',
    all(g19().opacity(1, 0.4), pCards[0]().opacity(1, 0.4), pCards[1]().opacity(1, 0.4), pCards[2]().opacity(1, 0.4), pCards[3]().opacity(1, 0.4), pCards[4]().opacity(1, 0.4)),
    at('LIVES_IN', pLabel().opacity(1, 0.4)),
    at('街道', pArrows[0]().opacity(1, 0.3)),
    at('城市', pArrows[1]().opacity(1, 0.3)),
    at('区', pArrows[2]().opacity(1, 0.3)),
    at('地区', pArrows[3]().opacity(1, 0.3)),
    at('州', pArrows[4]().opacity(1, 0.3)),
  );

  say('直接指到，或隔几层');
  yield* beat('b20',
    all(g19().opacity(0, 0.4), g20().opacity(1, 0.4)),
    chain(tCity().opacity(1, 0.4), tRegion().opacity(1, 0.4), tState().opacity(1, 0.4), tCountry().opacity(1, 0.4)),
    at('直接指到', chain(shortArrow().opacity(1, 0.4), shortLab().opacity(1, 0.4))),
    at('隔好几层', chain(longArrow().opacity(1, 0.4), longLab().opacity(1, 0.4))),
  );

  say('走零次或多次');
  yield* beat('b21a',
    all(g20().opacity(0, 0.4), g21().opacity(1, 0.4), codeCard().opacity(1, 0.4), codePre().opacity(1, 0.4), codeStar().opacity(1, 0.4)),
    at('星号零点点', chain(codeStar().scale(1.2, 0.3), codeStar().scale(1, 0.3))),
    at('零次', exZero().opacity(1, 0.4)),
    at('多次', exMulti().opacity(1, 0.4)),
  );

  say('走零次或多次');
  yield* beat('b21b',
    rxCard().opacity(1, 0.5),
    at('重复零次或多次', chain(rxCard().lineWidth(4, 0.3), rxCard().lineWidth(2, 0.3))),
  );

  say('递归公用表表达式');
  yield* beat('b22a',
    all(g21().opacity(0, 0.4), g22().opacity(1, 0.4), wrTitle().opacity(1, 0.5)),
  );

  say('');
  yield* beat('b22b',
    chain(wrTitle().opacity(0, 0.3), rcteTitle().opacity(1, 0.5), y1999().opacity(1, 0.4)),
  );

  say('递归公用表表达式');
  yield* beat('b22c',
    all(rcteTitle().opacity(0, 0.3), y1999().opacity(0, 0.3), wrSmall().opacity(1, 0.4)),
    chain(dbCards[0]().opacity(1, 0.4), dbCards[1]().opacity(1, 0.4), dbCards[2]().opacity(1, 0.4), dbCards[3]().opacity(1, 0.4)),
    at('PostgreSQL', dbCards[0]().lineWidth(4, 0.3)),
    at('DB2', dbCards[1]().lineWidth(4, 0.3)),
    at('Oracle', dbCards[2]().lineWidth(4, 0.3)),
    at('SQL Server', dbCards[3]().lineWidth(4, 0.3)),
  );

  say('同一个查询，29 行');
  yield* beat('b23',
    all(g22().opacity(0, 0.4), g23().opacity(1, 0.4), cyCard().opacity(1, 0.5), sqlCard().opacity(1, 0.5)),
    at('二十九行', tag29().opacity(1, 0.4)),
  );

  say('先装一个：美国');
  yield* beat('b24',
    all(g23().opacity(0, 0.4), g24().opacity(1, 0.4), inusaCard().opacity(1, 0.4), iuL1().opacity(1, 0.4), iuL2().opacity(1, 0.4), iuL3().opacity(1, 0.4)),
    at('in_usa', iuL2().fill(T.yellow, 0.3)),
    at('United States', chain(wash().opacity(0.18, 0.5), usaChip().opacity(1, 0.4))),
  );

  say('一圈圈扩大');
  yield* beat('b25a',
    at('UNION', chain(iuUnion().opacity(1, 0.4), wash().scale(1.15, 0.6))),
    at('另一头', chain(idahoChip().opacity(1, 0.4), dot1().opacity(1, 0.3), dot2().opacity(1, 0.3))),
  );

  say('一圈圈扩大');
  yield* beat('b25b',
    wash().scale(1, 2.8),
    at('为止', doneCheck().opacity(1, 0.3)),
  );
});
