// U9 场景 1（MC）：b1–b6 —— 钩子 4 行 vs 29 行、Cypher 介绍、
// 给顶点起符号名、箭头就是边、CREATE 建四个顶点、两行连边。
// 分镜：skill-ch02/beats-u9.md U9 一节；原文：DDIA §2.12（书页 p52–53，PDF p74–75），Example 2-3。
// 注意：旁白用“节点”代“顶点”（TTS 在“顶点”处确定性截断，见 beats-u9.md r1 注）；
// 画面文字统一用“顶点”，与原图/代码一致。
// 时长全部来自 timeline/u9.json（beat() 驱动），不手写 waitFor。
// 颜色、字号、安全区一律取自 lib/theme，不手写十六进制色值。
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

  // b1：4 行 vs 29 行
  const g1 = createRef<Node>();
  const c4 = createRef<Rect>();
  const c29 = createRef<Rect>();
  const q1 = createRef<Txt>();
  // b2：Cypher 介绍
  const g2 = createRef<Node>();
  const tCypher = createRef<Txt>();
  const sDecl = createRef<Txt>();
  const sNeo = createRef<Txt>();
  const film = createRef<Rect>();
  const notPwd = createRef<Txt>();
  // b3：三个顶点方框 + 符号名标签
  const g3 = createRef<Node>();
  const vUsa = createRef<Rect>();
  const vIdaho = createRef<Rect>();
  const vLucy = createRef<Rect>();
  const lUsa = createRef<Txt>();
  const lIdaho = createRef<Txt>();
  const lLucy = createRef<Txt>();
  // b4：Idaho → USA 箭头
  const eArrow = createRef<Line>();
  const lWithin = createRef<Txt>();
  const lTail = createRef<Txt>();
  const lHead = createRef<Txt>();
  // b5：CREATE 代码卡
  const card = createRef<Rect>();
  const lCreate = createRef<Txt>();
  const lV1 = createRef<Txt>();
  const lV2 = createRef<Txt>();
  const lV3 = createRef<Txt>();
  const lV4 = createRef<Txt>();
  // b6：两行连边 + 小图
  const g6 = createRef<Node>();
  const eLine1 = createRef<Txt>();
  const eLine2 = createRef<Txt>();
  const mNa = createRef<Rect>();
  const mUsa = createRef<Rect>();
  const mIdaho = createRef<Rect>();
  const mLucy = createRef<Rect>();
  const mE1 = createRef<Line>();
  const mE2 = createRef<Line>();
  const mE3 = createRef<Line>();

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

      <Node ref={g1} opacity={0}>
        <Rect ref={c4} position={[-290, -40]} width={420} height={200} radius={16} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt position={[0, -30]} fontSize={SIZE.title} fill={T.text} fontFamily={FONT.sans} text={'4 行'} />
          <Txt position={[0, 45]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'Cypher'} />
        </Rect>
        <Rect ref={c29} position={[290, -40]} width={420} height={200} radius={16} fill={T.card} stroke={T.red} lineWidth={2} opacity={0}>
          <Txt position={[0, -30]} fontSize={SIZE.title} fill={T.text} fontFamily={FONT.sans} text={'29 行'} />
          <Txt position={[0, 45]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'SQL'} />
        </Rect>
        <Txt ref={q1} position={[0, -40]} fontSize={SIZE.title} fill={T.yellow} fontFamily={FONT.sans} text={'?'} opacity={0} />
      </Node>

      <Node ref={g2} opacity={0}>
        <Txt ref={tCypher} position={[0, -130]} fontSize={SIZE.title} fill={T.text} fontFamily={FONT.mono} text={'Cypher'} opacity={0} />
        <Txt ref={sDecl} position={[0, -40]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'属性图的声明式查询语言'} opacity={0} />
        <Txt ref={sNeo} position={[0, 10]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'给 Neo4j 图数据库做的'} opacity={0} />
        <Rect ref={film} position={[-220, 140]} width={160} height={90} radius={8} fill={T.card} stroke={T.yellow} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'电影'} />
        </Rect>
        <Txt ref={notPwd} position={[60, 140]} fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.sans} text={'不是密码'} opacity={0} />
      </Node>

      <Node ref={g3} opacity={0}>
        <Rect ref={vUsa} position={[-400, 0]} width={240} height={90} radius={12} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'顶点'} />
        </Rect>
        <Rect ref={vIdaho} position={[0, 0]} width={240} height={90} radius={12} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'顶点'} />
        </Rect>
        <Rect ref={vLucy} position={[400, 0]} width={240} height={90} radius={12} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'顶点'} />
        </Rect>
        <Txt ref={lUsa} position={[-400, -80]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'USA'} opacity={0} />
        <Txt ref={lIdaho} position={[0, -80]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'Idaho'} opacity={0} />
        <Txt ref={lLucy} position={[400, -80]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'Lucy'} opacity={0} />
        <Line ref={eArrow} points={[[-120, 0], [-280, 0]]} stroke={T.blue} lineWidth={3} endArrow opacity={0} />
        <Txt ref={lWithin} position={[-200, -45]} fontSize={SIZE.min} fill={T.text} fontFamily={FONT.mono} text={'WITHIN'} opacity={0} />
        <Txt ref={lTail} position={[0, 85]} fontSize={SIZE.min} fill={T.muted} fontFamily={FONT.sans} text={'尾顶点'} opacity={0} />
        <Txt ref={lHead} position={[-400, 85]} fontSize={SIZE.min} fill={T.muted} fontFamily={FONT.sans} text={'头顶点'} opacity={0} />
      </Node>

      <Rect ref={card} position={[0, -10]} width={1000} height={440} radius={16} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
        <Txt ref={lCreate} position={[0, -180]} fontSize={24} fill={T.blue} fontFamily={FONT.mono} text={'CREATE'} opacity={0} />
        <Txt ref={lV1} position={[0, -120]} fontSize={20} fill={T.text} fontFamily={FONT.mono} text={"(NAmerica:Location {name: 'North America', type: 'continent'}),"} opacity={0} />
        <Txt ref={lV2} position={[0, -60]} fontSize={20} fill={T.text} fontFamily={FONT.mono} text={"(USA:Location {name: 'United States', type: 'country'}),"} opacity={0} />
        <Txt ref={lV3} position={[0, 0]} fontSize={20} fill={T.text} fontFamily={FONT.mono} text={"(Idaho:Location {name: 'Idaho', type: 'state'}),"} opacity={0} />
        <Txt ref={lV4} position={[0, 60]} fontSize={20} fill={T.text} fontFamily={FONT.mono} text={"(Lucy:Person {name: 'Lucy'})"} opacity={0} />
      </Rect>

      <Node ref={g6} opacity={0}>
        <Txt ref={eLine1} position={[-560, -60]} offset={[-1, 0]} textAlign={'left'} fontSize={20} fill={T.text} fontFamily={FONT.mono} text={'(Idaho) -[:WITHIN]-> (USA) -[:WITHIN]-> (NAmerica)'} opacity={0} />
        <Txt ref={eLine2} position={[-560, 0]} offset={[-1, 0]} textAlign={'left'} fontSize={20} fill={T.text} fontFamily={FONT.mono} text={'(Lucy) -[:BORN_IN]-> (Idaho)'} opacity={0} />
        <Rect ref={mNa} position={[430, -140]} width={180} height={56} radius={10} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.min} fill={T.text} fontFamily={FONT.sans} text={'北美洲'} />
        </Rect>
        <Rect ref={mUsa} position={[430, -40]} width={180} height={56} radius={10} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.min} fill={T.text} fontFamily={FONT.sans} text={'美国'} />
        </Rect>
        <Rect ref={mIdaho} position={[430, 60]} width={180} height={56} radius={10} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.min} fill={T.text} fontFamily={FONT.sans} text={'Idaho'} />
        </Rect>
        <Rect ref={mLucy} position={[180, 60]} width={180} height={56} radius={10} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.min} fill={T.text} fontFamily={FONT.sans} text={'Lucy'} />
        </Rect>
        <Line ref={mE1} points={[[430, 32], [430, -12]]} stroke={T.line} lineWidth={2} endArrow opacity={0} />
        <Line ref={mE2} points={[[430, -68], [430, -112]]} stroke={T.line} lineWidth={2} endArrow opacity={0} />
        <Line ref={mE3} points={[[270, 60], [340, 60]]} stroke={T.line} lineWidth={2} endArrow opacity={0} />
      </Node>
    </>
  );

  say('4 行对 29 行');
  yield* beat('b1',
    all(g1().opacity(1, 0.4), c4().opacity(1, 0.5), c4().scale(1.03, beat.dur('b1'))),
    at('另一种要写二十九行', c29().opacity(1, 0.5)),
    at('差在哪', q1().opacity(1, 0.4)),
  );

  say('Cypher');
  yield* beat('b2',
    all(g1().opacity(0, 0.4), g2().opacity(1, 0.4), tCypher().opacity(1, 0.5)),
    at('声明式查询语言', sDecl().opacity(1, 0.4)),
    at('Neo4j', sNeo().opacity(1, 0.4)),
    at('电影《黑客帝国》', film().opacity(1, 0.4)),
    at('跟密码学里的 cipher 没关系', notPwd().opacity(1, 0.4)),
  );

  say('先给顶点起名字');
  yield* beat('b3a',
    all(g2().opacity(0, 0.4), g3().opacity(1, 0.4)),
    at('先看往库里插数据', vUsa().opacity(1, 0.4)),
    at('每个节点', vIdaho().opacity(1, 0.4)),
    at('符号名', vLucy().opacity(1, 0.4)),
  );

  say('先给顶点起名字');
  yield* beat('b3b',
    at('美国这个顶点', lUsa().opacity(1, 0.4)),
    at('符号名就叫', lIdaho().opacity(1, 0.4)),
    at('USA', lLucy().opacity(1, 0.4)),
  );

  say('箭头就是边');
  yield* beat('b4',
    at('箭头画出来', eArrow().opacity(1, 0.5)),
    at('箭头上标 WITHIN', lWithin().opacity(1, 0.4)),
    at('尾顶点', lTail().opacity(1, 0.4)),
    at('头顶点', lHead().opacity(1, 0.4)),
  );

  say('CREATE 建四个顶点');
  yield* beat('b5a',
    all(g3().opacity(0, 0.4), card().opacity(1, 0.4), card().scale(1.03, beat.dur('b5a'))),
    at('CREATE 开头', lCreate().opacity(1, 0.4)),
  );

  say('CREATE 建四个顶点');
  yield* beat('b5b',
    at('北美洲', lV1().opacity(1, 0.4)),
    at('美国', lV2().opacity(1, 0.4)),
    at('Idaho', lV3().opacity(1, 0.4)),
    at('Lucy', lV4().opacity(1, 0.4)),
  );

  say('两行连边');
  yield* beat('b6',
    all(card().opacity(0, 0.4), g6().opacity(1, 0.4), mNa().opacity(1, 0.4), mUsa().opacity(1, 0.4), mIdaho().opacity(1, 0.4), mLucy().opacity(1, 0.4)),
    at('Idaho 在美国里', chain(eLine1().opacity(1, 0.4), mE1().opacity(1, 0.4))),
    at('美国在北美洲里', mE2().opacity(1, 0.4)),
    at('Lucy 出生在 Idaho', chain(eLine2().opacity(1, 0.4), mE3().opacity(1, 0.4))),
  );
});
