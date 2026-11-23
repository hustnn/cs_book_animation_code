// U10 场景 2（MC）：b7–b13 —— Turtle 三元组表（Example 2-6 的 14 行逐行填入，
// _: 前缀高亮、三处同名 Idaho 连线、分号合并、每节点一行）。
// 分镜：skill-ch02/beats-u10.md U10 一节；原文：DDIA §2.14 Example 2-6/2-7
// （书页 p56–57，PDF p78）。表行按原文逐字核对：Lucy 3 行、Idaho 4 行、
// 美国 4 行、北美洲 3 行，共 14 行；宾语是字符串字面量时加引号，是节点时写 _:名。
// 时长全部来自 timeline/u10.json（beat() 驱动），不手写 waitFor。
// 颜色、字号、安全区一律取自 lib/theme，不手写十六进制色值。
// 行用单层 map 生成（不嵌套 map，避免整行静默丢失）；逐拍看全分辨率帧核对行数。
import {Layout, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, chain, createRef} from '@motion-canvas/core';
import {at, makeBeats} from '../../lib/beats';
import {FONT, SAFE, SIZE, T} from '../../lib/theme';
import timeline from '../../timeline/u10.json';

const SUBJ_X = -560;
const PRED_X = -260;
const OBJ_X = 60;
const ROW_H = 36;
const ROW_Y0 = -238;
const rowY = (i: number) => ROW_Y0 + i * ROW_H;

// Example 2-6 的 14 行（按原文顺序）
const ROWS: {s: string; p: string; o: string; oIsNode: boolean}[] = [
  {s: 'lucy', p: 'a', o: ':Person', oIsNode: false},
  {s: 'lucy', p: ':name', o: '"Lucy"', oIsNode: false},
  {s: 'lucy', p: ':bornIn', o: 'idaho', oIsNode: true},
  {s: 'idaho', p: 'a', o: ':Location', oIsNode: false},
  {s: 'idaho', p: ':name', o: '"Idaho"', oIsNode: false},
  {s: 'idaho', p: ':type', o: '"state"', oIsNode: false},
  {s: 'idaho', p: ':within', o: 'usa', oIsNode: true},
  {s: 'usa', p: 'a', o: ':Location', oIsNode: false},
  {s: 'usa', p: ':name', o: '"United States"', oIsNode: false},
  {s: 'usa', p: ':type', o: '"country"', oIsNode: false},
  {s: 'usa', p: ':within', o: 'namerica', oIsNode: true},
  {s: 'namerica', p: 'a', o: ':Location', oIsNode: false},
  {s: 'namerica', p: ':name', o: '"North America"', oIsNode: false},
  {s: 'namerica', p: ':type', o: '"continent"', oIsNode: false},
];
// 宾语是节点的行（_:idaho / _:usa / _:namerica）
const OBJ_NODE_ROWS = [2, 6, 10];
// b11 高亮的五处 _:idaho（r2：旁白“出现三次”改“出现了五次”后补全）：
// 第 3 行宾语（宾语列）+ 第 4–7 行主语（主语列）
const IDAHO_HL: {row: number; x: number}[] = [
  {row: 2, x: OBJ_X + 75},
  {row: 3, x: SUBJ_X + 75},
  {row: 4, x: SUBJ_X + 75},
  {row: 5, x: SUBJ_X + 75},
  {row: 6, x: SUBJ_X + 75},
];

export default makeScene2D(function* (view) {
  view.fill(T.bg);
  const beat = makeBeats(timeline);

  const header = createRef<Txt>();
  const anchor = createRef<Txt>();
  const say = (text: string) => anchor().text(text);

  const gTable = createRef<Node>();
  const tableHead = createRef<Node>();
  const turtleTag = createRef<Txt>();
  const totalTag = createRef<Txt>();
  const rowRefs = ROWS.map(() => createRef<Node>());
  const subjPrefix = ROWS.map(() => createRef<Txt>());
  const objPrefix = OBJ_NODE_ROWS.map(() => createRef<Txt>());
  const idahoHl = IDAHO_HL.map(() => createRef<Rect>());
  const idahoLine = createRef<Line>();

  const gMerged = createRef<Node>();
  const mergedSemi1 = createRef<Txt>();
  const mergedSemi2 = createRef<Txt>();
  const gTable4 = createRef<Node>();
  const t4rows = [0, 1, 2, 3].map(() => createRef<Txt>());

  const showRows = (idxs: number[]) =>
    chain(...idxs.map(i => rowRefs[i]().opacity(1, 0.3)));

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

      {/* b7–b11：14 行三元组表 */}
      <Node ref={gTable} opacity={0}>
        <Node ref={tableHead} opacity={0}>
          <Txt position={[SUBJ_X, -278]} offset={[-1, 0]} textAlign={'left'} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'主语'} />
          <Txt position={[PRED_X, -278]} offset={[-1, 0]} textAlign={'left'} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'谓语'} />
          <Txt position={[OBJ_X, -278]} offset={[-1, 0]} textAlign={'left'} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'宾语'} />
          <Txt ref={turtleTag} position={[560, -278]} offset={[1, 0]} textAlign={'right'} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.mono} text={'Turtle'} opacity={0} />
        </Node>
        {/* b11：五处 _:idaho 高亮（放在行下面，免得盖住字）+ 左侧连线（第 3–7 行） */}
        {IDAHO_HL.map((h, k) => (
          <Rect key={`u10hl-${k}`} ref={idahoHl[k]} position={[h.x, rowY(h.row)]} width={170} height={34} radius={6} fill={T.yellow} opacity={0} />
        ))}
        <Line ref={idahoLine} points={[[-592, rowY(2)], [-592, rowY(6)]]} stroke={T.yellow} lineWidth={3} opacity={0} />
        {ROWS.map((r, i) => (
          <Node key={`u10t-${i}`} ref={rowRefs[i]} position={[0, rowY(i)]} opacity={0}>
            <Txt ref={subjPrefix[i]} position={[SUBJ_X, 0]} offset={[-1, 0]} textAlign={'left'} fontSize={20} fill={T.text} fontFamily={FONT.mono} text={'_:'} />
            <Txt position={[SUBJ_X + 26, 0]} offset={[-1, 0]} textAlign={'left'} fontSize={20} fill={T.text} fontFamily={FONT.mono} text={r.s} />
            <Txt position={[PRED_X, 0]} offset={[-1, 0]} textAlign={'left'} fontSize={20} fill={T.text} fontFamily={FONT.mono} text={r.p} />
            {r.oIsNode ? (
              <>
                <Txt ref={objPrefix[OBJ_NODE_ROWS.indexOf(i)]} position={[OBJ_X, 0]} offset={[-1, 0]} textAlign={'left'} fontSize={20} fill={T.text} fontFamily={FONT.mono} text={'_:'} />
                <Txt position={[OBJ_X + 26, 0]} offset={[-1, 0]} textAlign={'left'} fontSize={20} fill={T.text} fontFamily={FONT.mono} text={r.o} />
              </>
            ) : (
              <Txt position={[OBJ_X, 0]} offset={[-1, 0]} textAlign={'left'} fontSize={20} fill={T.text} fontFamily={FONT.mono} text={r.o} />
            )}
          </Node>
        ))}
        <Txt ref={totalTag} position={[560, rowY(13)]} offset={[1, 0]} textAlign={'right'} fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.sans} text={'14 行'} opacity={0} />
      </Node>

      {/* b12：Lucy 三行并成一行（分号亮起） */}
      <Node ref={gMerged} opacity={0}>
        <Layout layout direction={'row'} gap={0} position={[0, -40]}>
          <Txt fontSize={22} fill={T.text} fontFamily={FONT.mono} text={'_:lucy a :Person'} />
          <Txt ref={mergedSemi1} fontSize={22} fill={T.yellow} fontFamily={FONT.mono} text={';'} />
          <Txt fontSize={22} fill={T.text} fontFamily={FONT.mono} text={' :name "Lucy"'} />
          <Txt ref={mergedSemi2} fontSize={22} fill={T.yellow} fontFamily={FONT.mono} text={';'} />
          <Txt fontSize={22} fill={T.text} fontFamily={FONT.mono} text={' :bornIn _:idaho.'} />
        </Layout>
      </Node>

      {/* b13：合并后的四行表，每节点一行 */}
      <Node ref={gTable4} opacity={0}>
        <Txt ref={t4rows[0]} position={[0, -180]} fontSize={20} fill={T.text} fontFamily={FONT.mono} text={'_:lucy a :Person; :name "Lucy"; :bornIn _:idaho.'} opacity={0} />
        <Txt ref={t4rows[1]} position={[0, -110]} fontSize={20} fill={T.text} fontFamily={FONT.mono} text={'_:idaho a :Location; :name "Idaho"; :type "state"; :within _:usa.'} opacity={0} />
        <Txt ref={t4rows[2]} position={[0, -40]} fontSize={20} fill={T.text} fontFamily={FONT.mono} text={'_:usa a :Location; :name "United States"; :type "country"; :within _:namerica.'} opacity={0} />
        <Txt ref={t4rows[3]} position={[0, 30]} fontSize={20} fill={T.text} fontFamily={FONT.mono} text={'_:namerica a :Location; :name "North America"; :type "continent".'} opacity={0} />
      </Node>
    </>
  );

  say('三元组排成表');
  yield* beat('b7',
    all(gTable().opacity(1, 0.5), tableHead().opacity(1, 0.5)),
    at('三元组长这样', tableHead().scale(1.03, 0.4).to(1, 0.4)),
    at('用的格式叫 Turtle', turtleTag().opacity(1, 0.4)),
    at('Lucy 的三行', showRows([0, 1, 2])),
  );

  say('Idaho 的四行');
  yield* beat('b8',
    at('Idaho 的四行', showRows([3, 4, 5, 6])),
    at('在美国里面', rowRefs[6]().scale(1.03, 0.3).to(1, 0.3)),
  );

  say('14 行装下整张图');
  yield* beat('b9',
    at('美国四行', showRows([7, 8, 9, 10])),
    at('北美洲三行', showRows([11, 12, 13])),
    at('装进了表里', totalTag().opacity(1, 0.4)),
  );

  say('下划线冒号');
  yield* beat('b10',
    at('下划线加冒号', all(
      ...subjPrefix.map(r => r().fill(T.yellow, 0.4)),
      gTable().scale(1.01, 0.5).to(1, 0.5),
    )),
    at('冒号 Lucy', all(
      ...objPrefix.map(r => r().fill(T.yellow, 0.4)),
      gTable().scale(1.01, 0.5).to(1, 0.5),
    )),
    at('没有任何意义', gTable().scale(1.01, 0.6).to(1, 0.6)),
  );

  say('五次出现，同一个节点');
  yield* beat('b11',
    at('同一个节点', chain(idahoHl[0]().opacity(0.28, 0.4), idahoHl[1]().opacity(0.28, 0.4))),
    at('出现了五次', chain(idahoHl[2]().opacity(0.28, 0.4), idahoHl[3]().opacity(0.28, 0.4), idahoHl[4]().opacity(0.28, 0.4))),
    at('同一个 Idaho', idahoLine().opacity(1, 0.5)),
  );

  say('分号并一行');
  yield* beat('b12',
    all(gTable().opacity(0, 0.5), gMerged().opacity(1, 0.5)),
    at('好在可以用分号', gMerged().scale(1.02, 0.5).to(1, 0.5)),
    at('分号', chain(mergedSemi1().scale(1.4, 0.3).to(1, 0.3), mergedSemi2().scale(1.4, 0.3).to(1, 0.3))),
    at('并在一行里写', gMerged().scale(1.02, 0.5).to(1, 0.5)),
  );

  say('每个节点一行');
  yield* beat('b13',
    all(gMerged().opacity(0, 0.5), gTable4().opacity(1, 0.5)),
    at('每个节点一行', chain(t4rows[0]().opacity(1, 0.4), t4rows[1]().opacity(1, 0.4), t4rows[2]().opacity(1, 0.4), t4rows[3]().opacity(1, 0.4))),
    at('冒号后面跟它所有的事', gTable4().scale(1.02, 1).to(1, 1)),
  );
});
