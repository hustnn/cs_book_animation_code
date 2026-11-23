// U8 场景 3（MC）：b18a–b25b —— 顶点四件套、边五件套、图折叠成两张表、
// 建表语句、三点厉害（任意连边、双向遍历、多标签）。
// 分镜：skill-ch02/beats-u8.md U8 一节；原文：DDIA §2.11（书页 p50–52，PDF p72–74），
// Example 2-2 建表语句按原文照录（PostgreSQL json 类型、edges_tails / edges_heads 索引）。
// 不编造编号：Lucy 顶点的“编号”只画标签，不写具体数字（251 是另一单元的 user_id）。
// 时长全部来自 timeline/u8.json（beat() 驱动），不手写 waitFor。
// 颜色、字号、安全区一律取自 lib/theme，不手写十六进制色值。
import {Circle, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
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

  // b18a/b18b/b19a/b19b：Lucy 顶点拆解
  const g18 = createRef<Node>();
  const g18lucy = createRef<Rect>();
  const g18id = createRef<Txt>();
  const g18out = createRef<Txt>();
  const g18in = createRef<Txt>();
  const g18props = createRef<Txt>();
  const g18outArrows = [0, 1].map(() => createRef<Line>());
  const g18inArrows = [0, 1].map(() => createRef<Line>());
  const g18rowType = createRef<Txt>();
  const g18rowName = createRef<Txt>();
  // b20a/b20b/b21：边拆解
  const g20 = createRef<Node>();
  const g20lucy = createRef<Rect>();
  const g20idaho = createRef<Rect>();
  const g20edge = createRef<Line>();
  const g20id = createRef<Txt>();
  const g20tail = createRef<Txt>();
  const g20head = createRef<Txt>();
  const g20label = createRef<Txt>();
  const g20props = createRef<Txt>();
  const g20tailTag = createRef<Txt>();
  const g20headTag = createRef<Txt>();
  // b22a/b22b：两张表（edges 表第一行数据：1 | [Lucy] | [Idaho] | born_in，高亮格就是单元格本身；首行空框随表出，数据在 b22b 填满）
  const g22 = createRef<Node>();
  const g22vtab = createRef<Node>();
  const g22etab = createRef<Node>();
  const g22tailCol = createRef<Rect>();
  const g22headCol = createRef<Rect>();
  const g22eId = createRef<Txt>();
  const g22eLabel = createRef<Txt>();
  // b23a/b23b：建表语句（按 Example 2-2 原文）；每行一个 ref，逐行出现
  const g23 = createRef<Node>();
  const g23vcard = createRef<Rect>();
  const g23vL1 = createRef<Txt>();
  const g23vL2 = createRef<Txt>();
  const g23vL3 = createRef<Txt>();
  const g23vL4 = createRef<Txt>();
  const g23ecard = createRef<Rect>();
  const g23eL1 = createRef<Txt>();
  const g23eL2 = createRef<Txt>();
  const g23eL3 = createRef<Txt>();
  const g23eL4 = createRef<Txt>();
  const g23eL5 = createRef<Txt>();
  const g23eL6 = createRef<Txt>();
  const g23eL7 = createRef<Txt>();
  const g23idx1 = createRef<Txt>();
  const g23idx2 = createRef<Txt>();
  // b24：任意连边
  const g24 = createRef<Node>();
  const g24a = createRef<Rect>();
  const g24b = createRef<Rect>();
  const g24edge = createRef<Line>();
  const g24lock = createRef<Txt>();
  // b25a/b25b：双向遍历
  const g25 = createRef<Node>();
  const g25c = createRef<Rect>();
  const g25in = [0, 1].map(() => createRef<Line>());
  const g25out = [0, 1].map(() => createRef<Line>());
  const g25dot = createRef<Circle>();
  const g25idx = createRef<Txt>();

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

      {/* b18a/b18b/b19a/b19b：Lucy 顶点居中，四件套围在四周 */}
      <Node ref={g18} opacity={0}>
        <Rect ref={g18lucy} position={[-300, -40]} width={300} height={150} radius={14} fill={T.card} stroke={T.blue} lineWidth={3} opacity={0}>
          <Txt ref={g18rowType} position={[0, -30]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'type: person'} opacity={0} />
          <Txt ref={g18rowName} position={[0, 30]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'name: Lucy'} opacity={0} />
        </Rect>
        <Txt ref={g18id} position={[-300, -180]} fontSize={SIZE.title} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'编号'} opacity={0} />
        <Txt ref={g18out} position={[80, -40]} fontSize={SIZE.title} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'出边'} opacity={0} />
        <Txt ref={g18in} position={[-515, -40]} fontSize={SIZE.title} fontWeight={700} fill={T.blue} fontFamily={FONT.sans} text={'入边'} opacity={0} />
        <Txt ref={g18props} position={[-300, 130]} fontSize={SIZE.title} fontWeight={700} fill={T.purple} fontFamily={FONT.sans} text={'属性（键值对）'} opacity={0} />
        <Line ref={g18outArrows[0]} points={[[-150, -80], [40, -80]]} stroke={T.green} lineWidth={3} endArrow opacity={0} />
        <Line ref={g18outArrows[1]} points={[[-150, 0], [40, 0]]} stroke={T.green} lineWidth={3} endArrow opacity={0} />
        <Line ref={g18inArrows[0]} points={[[-540, -80], [-450, -80]]} stroke={T.blue} lineWidth={3} endArrow opacity={0} />
        <Line ref={g18inArrows[1]} points={[[-540, 0], [-450, 0]]} stroke={T.blue} lineWidth={3} endArrow opacity={0} />
      </Node>

      {/* b20a/b20b/b21：一条 born_in 边居中放大 */}
      <Node ref={g20} opacity={0}>
        <Rect ref={g20lucy} position={[-380, -40]} width={260} height={110} radius={12} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'Lucy'} />
        </Rect>
        <Rect ref={g20idaho} position={[380, -40]} width={260} height={110} radius={12} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'Idaho'} />
        </Rect>
        <Line ref={g20edge} points={[[-250, -40], [250, -40]]} stroke={T.yellow} lineWidth={3} endArrow opacity={0} />
        <Txt ref={g20id} position={[0, -180]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'编号'} opacity={0} />
        <Txt ref={g20tail} position={[-380, -140]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'起点'} opacity={0} />
        <Txt ref={g20head} position={[380, -140]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'终点'} opacity={0} />
        <Txt ref={g20label} position={[0, -100]} fontSize={SIZE.title} fontWeight={700} fill={T.yellow} fontFamily={FONT.mono} text={'born_in'} opacity={0} />
        <Txt ref={g20props} position={[0, 100]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'属性（键值对）'} opacity={0} />
        <Txt ref={g20tailTag} position={[-380, 80]} fontSize={SIZE.label} fontWeight={700} fill={T.blue} fontFamily={FONT.sans} text={'尾顶点'} opacity={0} />
        <Txt ref={g20headTag} position={[380, 80]} fontSize={SIZE.label} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'头顶点'} opacity={0} />
      </Node>

      {/* b22a/b22b：两张表 */}
      <Node ref={g22} opacity={0}>
        <Node ref={g22vtab} opacity={0}>
          <Rect position={[-320, -160]} width={440} height={70} radius={10} fill={T.card} stroke={T.blue} lineWidth={2}>
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'vertices'} />
          </Rect>
          <Rect position={[-320, -70]} width={440} height={60} radius={8} fill={T.card} stroke={T.line} lineWidth={2}>
            <Txt fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.mono} text={'vertex_id | properties'} />
          </Rect>
          <Rect position={[-320, 10]} width={440} height={60} radius={8} fill={T.card} stroke={T.line} lineWidth={2}>
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'Lucy …'} />
          </Rect>
          <Rect position={[-320, 90]} width={440} height={60} radius={8} fill={T.card} stroke={T.line} lineWidth={2}>
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'Idaho …'} />
          </Rect>
        </Node>
        <Node ref={g22etab} opacity={0}>
          <Rect position={[330, -160]} width={460} height={70} radius={10} fill={T.card} stroke={T.green} lineWidth={2}>
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'edges'} />
          </Rect>
          <Rect position={[330, -70]} width={460} height={60} radius={8} fill={T.card} stroke={T.line} lineWidth={2}>
            <Txt fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.mono} text={'edge_id | tail | head | label'} />
          </Rect>
          <Rect position={[330, 10]} width={460} height={60} radius={8} fill={T.card} stroke={T.line} lineWidth={2} />
          <Txt ref={g22eId} position={[135, 10]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'1'} opacity={0} />
          <Rect ref={g22tailCol} position={[230, 10]} width={130} height={60} radius={8} fill={T.card} stroke={T.yellow} lineWidth={2} opacity={0}>
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'Lucy'} />
          </Rect>
          <Rect ref={g22headCol} position={[410, 10]} width={130} height={60} radius={8} fill={T.card} stroke={T.yellow} lineWidth={2} opacity={0}>
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'Idaho'} />
          </Rect>
          <Txt ref={g22eLabel} position={[510, 10]} fontSize={18} fill={T.text} fontFamily={FONT.mono} text={'born_in'} opacity={0} />
          <Rect position={[330, 90]} width={460} height={60} radius={8} fill={T.card} stroke={T.line} lineWidth={2}>
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'… lives_in …'} />
          </Rect>
        </Node>
      </Node>

      {/* b23a/b23b：建表语句（按 Example 2-2 原文） */}
      <Node ref={g23} opacity={0}>
        <Rect ref={g23vcard} position={[0, -40]} width={980} height={260} radius={16} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt ref={g23vL1} position={[0, -80]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'CREATE TABLE vertices ('} opacity={0} />
          <Txt ref={g23vL2} position={[0, -30]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'vertex_id integer PRIMARY KEY,'} opacity={0} />
          <Txt ref={g23vL3} position={[0, 20]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'properties json'} opacity={0} />
          <Txt ref={g23vL4} position={[0, 70]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={');'} opacity={0} />
        </Rect>
        <Rect ref={g23ecard} position={[0, -40]} width={980} height={380} radius={16} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt ref={g23eL1} position={[0, -150]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'CREATE TABLE edges ('} opacity={0} />
          <Txt ref={g23eL2} position={[0, -105]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'edge_id integer PRIMARY KEY,'} opacity={0} />
          <Txt ref={g23eL3} position={[0, -60]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'tail_vertex integer REFERENCES vertices (vertex_id),'} opacity={0} />
          <Txt ref={g23eL4} position={[0, -15]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'head_vertex integer REFERENCES vertices (vertex_id),'} opacity={0} />
          <Txt ref={g23eL5} position={[0, 30]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'label text,'} opacity={0} />
          <Txt ref={g23eL6} position={[0, 75]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'properties json'} opacity={0} />
          <Txt ref={g23eL7} position={[0, 120]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={');'} opacity={0} />
        </Rect>
        <Txt ref={g23idx1} position={[0, 190]} fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.mono} text={'CREATE INDEX edges_tails ON edges (tail_vertex);'} opacity={0} />
        <Txt ref={g23idx2} position={[0, 230]} fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.mono} text={'CREATE INDEX edges_heads ON edges (head_vertex);'} opacity={0} />
      </Node>

      {/* b24：任意两个节点连边，schema 锁划掉 */}
      <Node ref={g24} opacity={0}>
        <Rect ref={g24a} position={[-300, -40]} width={240} height={100} radius={12} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'节点 A'} />
        </Rect>
        <Rect ref={g24b} position={[300, -40]} width={240} height={100} radius={12} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'节点 B'} />
        </Rect>
        <Line ref={g24edge} points={[[-180, -40], [180, -40]]} stroke={T.yellow} lineWidth={3} endArrow opacity={0} />
        <Txt ref={g24lock} position={[0, 140]} fontSize={SIZE.title} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'schema 不做限制'} opacity={0} />
      </Node>

      {/* b25a/b25b：一个节点，入边出边双向走 */}
      <Node ref={g25} opacity={0}>
        <Rect ref={g25c} position={[0, -40]} width={260} height={110} radius={12} fill={T.card} stroke={T.blue} lineWidth={3} opacity={0}>
          <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'一个节点'} />
        </Rect>
        <Line ref={g25in[0]} points={[[-420, -80], [-130, -40]]} stroke={T.blue} lineWidth={3} endArrow opacity={0} />
        <Line ref={g25in[1]} points={[[-420, 0], [-130, -40]]} stroke={T.blue} lineWidth={3} endArrow opacity={0} />
        <Line ref={g25out[0]} points={[[130, -80], [420, -80]]} stroke={T.green} lineWidth={3} endArrow opacity={0} />
        <Line ref={g25out[1]} points={[[130, 0], [420, 0]]} stroke={T.green} lineWidth={3} endArrow opacity={0} />
        <Circle ref={g25dot} position={[-420, -40]} width={28} height={28} fill={T.yellow} opacity={0} />
        <Txt ref={g25idx} position={[0, 140]} fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.mono} text={'edges_tails · edges_heads'} opacity={0} />
      </Node>
    </>
  );

  say('顶点四件套');
  yield* beat('b18a',
    all(g18().opacity(1, 0.5)),
    at('属性图模型', g18lucy().opacity(1, 0.5)),
    at('四样东西', g18lucy().lineWidth(4, 0.3)),
  );

  say('编号、出边、入边、属性');
  yield* beat('b18b',
    at('唯一标识符', g18id().opacity(1, 0.5)),
    at('一组出边', g18out().opacity(1, 0.5)),
    at('一组入边', g18in().opacity(1, 0.5)),
    at('一组属性', g18props().opacity(1, 0.5)),
  );

  say('编号');
  yield* beat('b19a',
    at('拿 Lucy 这个顶点拆开看', chain(g18rowType().opacity(1, 0.4), g18rowName().opacity(1, 0.4))),
    at('编号是她的唯一标识符', g18id().scale(1.15, 1.0)),
  );

  say('出边、入边、属性');
  yield* beat('b19b',
    at('出去的边', chain(g18outArrows[0]().opacity(1, 0.4), g18outArrows[1]().opacity(1, 0.4))),
    at('进来的边', chain(g18inArrows[0]().opacity(1, 0.4), g18inArrows[1]().opacity(1, 0.4))),
    at('名字、类型', chain(g18rowType().fill(T.yellow, 0.3), g18rowName().fill(T.yellow, 0.3))),
    at('键值对', g18props().scale(1.15, 0.8)),
  );

  say('边五件套');
  yield* beat('b20a',
    all(g18().opacity(0, 0.5), g20().opacity(1, 0.5)),
    at('每条边也有五样', chain(g20lucy().opacity(1, 0.4), g20idaho().opacity(1, 0.4), g20edge().opacity(1, 0.4))),
    at('唯一标识符', g20id().opacity(1, 0.4)),
    at('起点顶点', g20tail().opacity(1, 0.4)),
    at('终点顶点', g20head().opacity(1, 0.4)),
  );

  say('标签、属性');
  yield* beat('b20b',
    at('关系种类的标签', g20label().opacity(1, 0.5)),
    at('一组属性', g20props().opacity(1, 0.5)),
  );

  say('尾顶点、头顶点');
  yield* beat('b21',
    at('起点是 Lucy', g20tailTag().opacity(1, 0.4)),
    at('终点是 Idaho', g20headTag().opacity(1, 0.4)),
    at('标签就是 born_in', g20label().scale(1.2, 0.4)),
    at('起点叫尾顶点', g20tailTag().scale(1.2, 0.4)),
    at('终点叫头顶点', g20headTag().scale(1.2, 0.4)),
  );

  say('图就是两张表');
  yield* beat('b22a',
    all(g20().opacity(0, 0.5), g22().opacity(1, 0.5)),
    at('一张存顶点', g22vtab().opacity(1, 0.5)),
    at('一张存边', g22etab().opacity(1, 0.5)),
  );

  say('按列查入边出边');
  yield* beat('b22b',
    at('头尾顶点', chain(g22tailCol().opacity(1, 0.4), g22headCol().opacity(1, 0.4), g22eId().opacity(1, 0.3), g22eLabel().opacity(1, 0.3))),
    at('按列查就行', chain(g22tailCol().lineWidth(4, 0.3), g22headCol().lineWidth(4, 0.3))),
  );

  say('顶点表');
  yield* beat('b23a',
    // 旧表先退场、新卡再进场（并行交叉淡入会让新卡盖住旧表文字，QA covered）
    chain(g22().opacity(0, 0.35), g23().opacity(1, 0.35)),
    at('顶点表', g23vcard().opacity(1, 0.5)),
    at('存编号和属性', chain(g23vL1().opacity(1, 0.3), g23vL2().opacity(1, 0.3), g23vL3().opacity(1, 0.3))),
    at('建表语句就是这样写的', g23vL4().opacity(1, 0.3)),
  );

  say('边表，两个索引');
  yield* beat('b23b',
    chain(g23vcard().opacity(0, 0.35), g23ecard().opacity(1, 0.35)),
    at('边表', chain(g23eL1().opacity(1, 0.3), g23eL2().opacity(1, 0.3))),
    at('尾顶点、头顶点、标签和属性', chain(g23eL3().opacity(1, 0.3), g23eL4().opacity(1, 0.3), g23eL5().opacity(1, 0.3), g23eL6().opacity(1, 0.3), g23eL7().opacity(1, 0.3))),
    at('尾顶点和头顶点两列上', chain(g23idx1().opacity(1, 0.5), g23idx2().opacity(1, 0.5))),
    at('各建一个索引', chain(g23eL3().fill(T.yellow, 0.5), g23eL4().fill(T.yellow, 0.5))),
  );

  say('谁都能连谁');
  yield* beat('b24',
    all(g23().opacity(0, 0.5), g24().opacity(1, 0.5)),
    at('任意两个节点都能连边', chain(g24a().opacity(1, 0.4), g24b().opacity(1, 0.4), g24edge().opacity(1, 0.4))),
    at('schema 不做限制', g24lock().opacity(1, 0.5)),
  );

  say('入边出边都能找到');
  yield* beat('b25a',
    all(g24().opacity(0, 0.5), g25().opacity(1, 0.5)),
    at('随便拿一个节点', g25c().opacity(1, 0.5)),
    at('入边出边都能高效找到', chain(g25in[0]().opacity(1, 0.4), g25in[1]().opacity(1, 0.4), g25out[0]().opacity(1, 0.4), g25out[1]().opacity(1, 0.4))),
  );

  say('正着走，反着走');
  yield* beat('b25b',
    // 圆点沿边走，穿过节点时隐身再现（不压住节点里的文字），正反各一趟
    at('正着走', chain(
      g25dot().opacity(1, 0.3),
      g25dot().position([-130, -40], 0.6),
      g25dot().opacity(0, 0.2),
      g25dot().position([130, -40], 0.01),
      g25dot().opacity(1, 0.2),
      g25dot().position([420, -40], 0.6),
      g25dot().position([130, -40], 0.6),
      g25dot().opacity(0, 0.2),
      g25dot().position([-130, -40], 0.01),
      g25dot().opacity(1, 0.2),
      g25dot().position([-420, -40], 0.6),
    )),
    at('两列上都建索引', g25idx().opacity(1, 0.5)),
  );
});
