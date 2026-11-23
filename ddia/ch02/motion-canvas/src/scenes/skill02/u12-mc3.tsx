// U12 场景 3（MC）：b16–b24 —— 查询语言对比总表 N2（总结性原创表，右上角标“总结”）、
// 六种语言卡片、没提到的模型（DNA / 几百 PB / 全文搜索）、三条路收束。
// 分镜：skill-ch02/beats-u12.md U12 一节；原文：DDIA §2.16（书页 p63–64）。
// N2 行数口径见分镜头注：Cypher 4 / SPARQL 6 / Datalog 9 / 聚合管道 10 / MapReduce 14 / SQL 29，
// 4 行 vs 29 行是原文数字，其余按原文例子数；聚合管道与 MapReduce 数的不是移民问题，
// 是按月数鲨鱼，画面脚注与旁白都注明。表行用 flatMap 展平（map 嵌套 map 会丢整行）。
// 时长全部来自 timeline/u12.json（beat() 驱动），不手写 waitFor。
// 颜色、字号、安全区一律取自 lib/theme，不手写十六进制色值。
import {Circle, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, chain, createRef} from '@motion-canvas/core';
import {at, makeBeats} from '../../lib/beats';
import {FONT, SAFE, SIZE, T} from '../../lib/theme';
import timeline from '../../timeline/u12.json';

const ROWS = [
  {name: 'Cypher', lines: 4, color: T.blue, y: -185},
  {name: 'SPARQL', lines: 6, color: T.purple, y: -123},
  {name: 'Datalog', lines: 9, color: T.green, y: -61},
  {name: '聚合管道', lines: 10, color: T.yellow, y: 1},
  {name: 'MapReduce', lines: 14, color: T.blue, y: 63},
  {name: 'SQL', lines: 29, color: T.red, y: 125},
] as const;
const BAR_PX = 18; // 每行代码 18px 横条
const BAR_X0 = -320;

export default makeScene2D(function* (view) {
  view.fill(T.bg);
  const beat = makeBeats(timeline);

  const header = createRef<Txt>();
  const anchor = createRef<Txt>();
  const say = (text: string) => anchor().text(text);

  // —— b16–b21：对比总表 ——
  const gTable = createRef<Node>();
  const rowName = ROWS.map(() => createRef<Txt>());
  const rowBar = ROWS.map(() => createRef<Rect>());
  const rowNum = ROWS.map(() => createRef<Txt>());
  const gRule1 = createRef<Txt>();
  const gRule2 = createRef<Txt>();
  const gRule3 = createRef<Txt>();
  const gLucy = createRef<Txt>();
  const gFootnote = createRef<Txt>();
  const gSqlBorder = createRef<Rect>();
  // —— b22：六种语言卡片 ——
  const g22 = createRef<Node>();
  const g22cards = [0, 1, 2, 3, 4, 5].map(() => createRef<Node>());
  const g22css = createRef<Node>();
  const g22xpath = createRef<Node>();
  const g22dash = createRef<Node>();
  // —— b23a–b23d：没提到的模型 ——
  const g23dna = createRef<Node>();
  const g23dnaStr = createRef<Txt>();
  const g23lib1 = createRef<Txt>();
  const g23lib2 = createRef<Txt>();
  const g23lib3 = createRef<Txt>();
  const g23sweep = createRef<Rect>();
  const g23match = createRef<Txt>();
  const g23pb = createRef<Node>();
  const g23pbBar = createRef<Rect>();
  const g23search = createRef<Node>();
  const g23mag = createRef<Node>();
  // —— b24：收束 ——
  const g24 = createRef<Node>();
  const g24dot = createRef<Circle>();
  const g24arms = createRef<Node>();
  const g24close = createRef<Txt>();
  const g24next = createRef<Node>();

  view.add(
    <>
      <Txt
        ref={header}
        position={[-SAFE.halfW, -SAFE.halfH]}
        offset={[-1, -1]}
        fontSize={SIZE.label}
        fill={T.muted}
        fontFamily={FONT.sans}
        text={'小结'}
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

      {/* b16–b21：对比总表（行用 flatMap 展平） */}
      <Node ref={gTable} opacity={0}>
        <Txt position={[0, -262]} fontSize={SIZE.title} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'同一个问题，六种写法'} />
        <Rect position={[430, -262]} width={90} height={44} radius={8} fill={T.purple} opacity={0.9}>
          <Txt fontSize={SIZE.label} fontWeight={700} fill={T.white} fontFamily={FONT.sans} text={'总结'} />
        </Rect>
        {ROWS.flatMap((r, i) => [
          <Node key={r.name}>
            <Txt ref={rowName[i]} position={[-340, r.y]} offset={[1, 0]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={r.name} opacity={0} />
            <Rect ref={rowBar[i]} position={[BAR_X0, r.y]} offset={[-1, 0]} width={0} height={34} radius={6} fill={r.color} opacity={0} />
            <Txt ref={rowNum[i]} position={[BAR_X0 + r.lines * BAR_PX + 12, r.y]} offset={[-1, 0]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={`${r.lines} 行`} opacity={0} />
          </Node>,
        ])}
        <Txt ref={gRule1} position={[-100, -61]} offset={[-1, 0]} fontSize={SIZE.min} fill={T.muted} fontFamily={FONT.sans} text={'规则 1'} opacity={0} />
        <Txt ref={gRule2} position={[0, -61]} offset={[-1, 0]} fontSize={SIZE.min} fill={T.muted} fontFamily={FONT.sans} text={'规则 2'} opacity={0} />
        <Txt ref={gRule3} position={[100, -61]} offset={[-1, 0]} fontSize={SIZE.min} fill={T.muted} fontFamily={FONT.sans} text={'规则 3'} opacity={0} />
        <Txt ref={gLucy} position={[330, -61]} offset={[-1, 0]} fontSize={SIZE.body} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'Lucy'} opacity={0} />
        <Txt ref={gFootnote} position={[0, 225]} fontSize={SIZE.min} fill={T.muted} fontFamily={FONT.sans} text={'这两行数的不是移民问题，是按月数鲨鱼，仅比篇幅'} opacity={0} />
        <Rect ref={gSqlBorder} position={[0, 125]} width={1060} height={56} radius={10} stroke={T.red} lineWidth={3} opacity={0} />
      </Node>

      {/* b22：六种语言卡片 */}
      <Node ref={g22} opacity={0}>
        {['SQL', 'MapReduce', '聚合管道', 'Cypher', 'SPARQL', 'Datalog'].map((name, i) => (
          <Node key={name} ref={g22cards[i]} position={[[-425, -255, -85, 85, 255, 425][i], -40]} opacity={0}>
            <Rect position={[0, 0]} width={160} height={110} radius={12} fill={T.card} stroke={T.blue} lineWidth={2}>
              <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={name} />
            </Rect>
          </Node>
        ))}
        <Node ref={g22css} opacity={0}>
          <Rect position={[-170, 140]} width={130} height={80} radius={10} fill={T.card} stroke={T.muted} lineWidth={2}>
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'CSS'} />
          </Rect>
        </Node>
        <Node ref={g22xpath} opacity={0}>
          <Rect position={[170, 140]} width={130} height={80} radius={10} fill={T.card} stroke={T.muted} lineWidth={2}>
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'XPath'} />
          </Rect>
        </Node>
        <Node ref={g22dash} opacity={0}>
          <Rect position={[0, 140]} width={560} height={110} radius={12} stroke={T.muted} lineWidth={2} lineDash={[8, 6]} />
          <Txt position={[0, 225]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'不是数据库语言'} />
        </Node>
      </Node>

      {/* b23a–b23b：DNA */}
      <Node ref={g23dna} opacity={0}>
        <Rect position={[-380, -20]} width={300} height={300} radius={16} fill={T.card} stroke={T.green} lineWidth={2}>
          <Txt position={[0, -120]} fontSize={SIZE.label} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'基因组'} />
        </Rect>
        <Txt ref={g23dnaStr} position={[-380, -60]} fontSize={SIZE.min} fill={T.text} fontFamily={FONT.mono} textAlign={'center'} textWrap maxWidth={260} text={'ACGTACGTACGTACGTACGTACGT'} opacity={0} />
        <Rect ref={g23sweep} position={[-500, -32]} width={60} height={5} radius={2} fill={T.yellow} opacity={0} />
        <Txt ref={g23lib1} position={[-380, -10]} fontSize={SIZE.min} fill={T.muted} fontFamily={FONT.mono} text={'ACGTACGTTGCA'} opacity={0} />
        <Txt ref={g23lib2} position={[-380, 25]} fontSize={SIZE.min} fill={T.muted} fontFamily={FONT.mono} text={'ACGTACTTACGT'} opacity={0} />
        <Txt ref={g23lib3} position={[-380, 60]} fontSize={SIZE.min} fill={T.muted} fontFamily={FONT.mono} text={'ACGTACGCGTTA'} opacity={0} />
        <Txt ref={g23match} position={[-380, 95]} fontSize={SIZE.label} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'✓ 匹配'} opacity={0} />
      </Node>

      {/* b23c：几百 PB */}
      <Node ref={g23pb} opacity={0}>
        <Rect position={[0, -20]} width={300} height={300} radius={16} fill={T.card} stroke={T.blue} lineWidth={2}>
          <Txt position={[0, -120]} fontSize={SIZE.label} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'粒子物理'} />
        </Rect>
        <Txt position={[0, -50]} fontSize={SIZE.title} fontWeight={700} fill={T.text} fontFamily={FONT.mono} text={'几百 PB'} />
        <Rect ref={g23pbBar} position={[-120, 30]} offset={[-1, 0]} width={0} height={24} radius={6} fill={T.blue} />
      </Node>

      {/* b23d：全文搜索 */}
      <Node ref={g23search} opacity={0}>
        <Rect position={[380, -20]} width={300} height={300} radius={16} fill={T.card} stroke={T.purple} lineWidth={2}>
          <Txt position={[0, -120]} fontSize={SIZE.label} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'全文搜索'} />
        </Rect>
        <Rect position={[380, -50]} width={220} height={56} radius={10} fill={T.bg} stroke={T.line} lineWidth={2} />
        <Node ref={g23mag} position={[460, 60]}>
          <Circle position={[0, 0]} width={52} height={52} fill={T.bg} stroke={T.green} lineWidth={3} />
          <Line points={[[18, 18], [38, 38]]} stroke={T.green} lineWidth={4} />
        </Node>
      </Node>

      {/* b24：三条路收束 */}
      <Node ref={g24} opacity={0}>
        <Node ref={g24arms}>
          <Line points={[[-380, -180], [0, -80]]} stroke={T.green} lineWidth={2} />
          <Line points={[[0, -240], [0, -80]]} stroke={T.blue} lineWidth={2} />
          <Line points={[[380, -180], [0, -80]]} stroke={T.purple} lineWidth={2} />
          <Txt position={[-380, -210]} fontSize={SIZE.title} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'树'} />
          <Txt position={[0, -270]} fontSize={SIZE.title} fontWeight={700} fill={T.blue} fontFamily={FONT.sans} text={'表'} />
          <Txt position={[380, -210]} fontSize={SIZE.title} fontWeight={700} fill={T.purple} fontFamily={FONT.sans} text={'文档 · 图'} />
        </Node>
        <Circle ref={g24dot} position={[0, -80]} width={52} height={52} fill={T.yellow} />
        <Txt ref={g24close} position={[0, 40]} fontSize={SIZE.title} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'没有银弹，看数据、看查询'} opacity={0} />
        <Node ref={g24next} opacity={0}>
          <Rect position={[0, 160]} width={460} height={76} radius={12} fill={T.card} stroke={T.blue} lineWidth={2}>
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'下一章：实现时的取舍'} />
          </Rect>
        </Node>
      </Node>
    </>
  );

  say('同一个问题，六种写法');
  yield* beat('b16',
    all(gTable().opacity(1, 0.5)),
    at('查询语言', chain(rowName[0]().opacity(1, 0.3), rowName[1]().opacity(1, 0.3))),
    at('同一个问题', rowName[2]().opacity(1, 0.3)),
    at('谁从美国移民到欧洲', rowName[3]().opacity(1, 0.3)),
    at('六种语言', chain(rowName[4]().opacity(1, 0.3), rowName[5]().opacity(1, 0.3))),
  );

  say('Cypher 4 行，SPARQL 6 行');
  yield* beat('b17',
    at('Cypher', chain(rowBar[0]().opacity(1, 0.2), rowBar[0]().width(4 * BAR_PX, 0.8), rowNum[0]().opacity(1, 0.4))),
    at('SPARQL', chain(rowBar[1]().opacity(1, 0.2), rowBar[1]().width(6 * BAR_PX, 0.8), rowNum[1]().opacity(1, 0.4))),
    at('画出要找的形状', all(rowBar[0]().scale(1.06, 0.4), rowBar[1]().scale(1.06, 0.4))),
  );

  say('Datalog 9 行，答案是 Lucy');
  yield* beat('b18',
    at('Datalog', chain(rowBar[2]().opacity(1, 0.2), rowBar[2]().width(9 * BAR_PX, 0.8), rowNum[2]().opacity(1, 0.4))),
    at('三条规则', chain(gRule1().opacity(1, 0.3), gRule2().opacity(1, 0.3), gRule3().opacity(1, 0.3))),
    at('答案还是 Lucy', gLucy().opacity(1, 0.5)),
  );

  say('聚合管道 10 行，MapReduce 14 行');
  yield* beat('b19',
    at('聚合管道', chain(rowBar[3]().opacity(1, 0.2), rowBar[3]().width(10 * BAR_PX, 0.8), rowNum[3]().opacity(1, 0.4))),
    at('MapReduce', chain(rowBar[4]().opacity(1, 0.2), rowBar[4]().width(14 * BAR_PX, 0.8), rowNum[4]().opacity(1, 0.4))),
    at('不是移民', all(gFootnote().opacity(1, 0.3), gFootnote().position([0, 205], 0.5))),
    at('只比篇幅长短', gFootnote().scale(1.05, 0.5)),
  );

  say('SQL 29 行');
  yield* beat('b20',
    at('最长的是 SQL', chain(rowBar[5]().opacity(1, 0.2), rowBar[5]().width(29 * BAR_PX, 0.8), rowNum[5]().opacity(1, 0.4))),
    at('二十九行', gSqlBorder().opacity(1, 0.5)),
    at('模型和用例不对付', chain(gSqlBorder().lineWidth(5, 0.4), gSqlBorder().lineWidth(3, 0.4))),
  );

  say('行数多少，不等于好坏');
  yield* beat('b21',
    at('行数多少不等于好坏', chain(all(rowBar[0]().scale(1.15, 0.4), rowBar[1]().scale(1.15, 0.4), rowBar[2]().scale(1.15, 0.4), rowBar[3]().scale(1.15, 0.4), rowBar[4]().scale(1.15, 0.4), rowBar[5]().scale(1.15, 0.4)), all(rowBar[0]().scale(1, 0.4), rowBar[1]().scale(1, 0.4), rowBar[2]().scale(1, 0.4), rowBar[3]().scale(1, 0.4), rowBar[4]().scale(1, 0.4), rowBar[5]().scale(1, 0.4)))),
    at('不同模型', chain(all(rowBar[0]().scale(1.12, 0.4), rowBar[1]().scale(1.12, 0.4), rowBar[2]().scale(1.12, 0.4), rowBar[3]().scale(1.12, 0.4), rowBar[4]().scale(1.12, 0.4), rowBar[5]().scale(1.12, 0.4)), all(rowBar[0]().scale(1, 0.4), rowBar[1]().scale(1, 0.4), rowBar[2]().scale(1, 0.4), rowBar[3]().scale(1, 0.4), rowBar[4]().scale(1, 0.4), rowBar[5]().scale(1, 0.4)))),
    at('不同用例', chain(all(rowBar[0]().scale(1.12, 0.4), rowBar[1]().scale(1.12, 0.4), rowBar[2]().scale(1.12, 0.4), rowBar[3]().scale(1.12, 0.4), rowBar[4]().scale(1.12, 0.4), rowBar[5]().scale(1.12, 0.4)), all(rowBar[0]().scale(1, 0.4), rowBar[1]().scale(1, 0.4), rowBar[2]().scale(1, 0.4), rowBar[3]().scale(1, 0.4), rowBar[4]().scale(1, 0.4), rowBar[5]().scale(1, 0.4)))),
  );

  say('六种语言，外加两个旁亲');
  yield* beat('b22',
    all(gTable().opacity(0, 0.5), g22().opacity(1, 0.5)),
    at('SQL', g22cards[0]().opacity(1, 0.4)),
    at('MapReduce', g22cards[1]().opacity(1, 0.4)),
    at('聚合管道', g22cards[2]().opacity(1, 0.4)),
    at('Cypher', g22cards[3]().opacity(1, 0.4)),
    at('SPARQL', g22cards[4]().opacity(1, 0.4)),
    at('Datalog', g22cards[5]().opacity(1, 0.4)),
    at('CSS', g22css().opacity(1, 0.4)),
    at('XPath', g22xpath().opacity(1, 0.4)),
    at('不是数据库语言', g22dash().opacity(1, 0.5)),
    at('道理相通', all(g22cards[0]().scale(1.05, 0.4), g22cards[5]().scale(1.05, 0.4))),
  );

  say('还有很多模型没提');
  yield* beat('b23a',
    all(g22().opacity(0, 0.5), g23dna().opacity(1, 0.5)),
    at('基因组研究', g23dnaStr().opacity(1, 0.5)),
  );

  say('DNA 字符串比对');
  yield* beat('b23b',
    at('要拿一条', g23dnaStr().scale(1.06, 0.5)),
    at('DNA 字符串', all(g23dnaStr().fill(T.yellow, 1.0), chain(g23dnaStr().scale(1.12, 0.5), g23dnaStr().scale(1, 0.5)))),
    at('，在一大库', chain(g23sweep().opacity(1, 0.3), g23sweep().position([-260, -32], 2.5))),
    at('相似的字符串', chain(g23lib1().opacity(1, 0.6), g23lib2().opacity(1, 0.6), g23lib3().opacity(1, 0.6))),
    at('找匹配', chain(g23match().opacity(1, 0.5), g23sweep().opacity(0, 0.5))),
  );

  say('几百 PB 的数据');
  yield* beat('b23c',
    all(g23pb().opacity(1, 0.5)),
    at('几十年', g23pbBar().width(80, 0.6)),
    at('大规模数据分析', g23pbBar().width(170, 1.2)),
    at('几百 PB', g23pbBar().width(240, 0.8)),
  );

  say('全文搜索是专门学问');
  yield* beat('b23d',
    all(g23search().opacity(1, 0.5)),
    at('全文搜索', g23mag().scale(1.15, 0.5)),
    at('数据库一起用', g23mag().scale(1, 0.5)),
  );

  say('没有银弹，看数据、看查询');
  yield* beat('b24',
    all(g23dna().opacity(0, 0.5), g23pb().opacity(0, 0.5), g23search().opacity(0, 0.5), g24().opacity(1, 0.5)),
    at('看数据长什么样', chain(g24arms().opacity(0, 0.6), g24dot().scale(1.4, 0.6), g24close().opacity(1, 0.5))),
    at('查询要什么样', g24dot().scale(1.55, 0.5)),
    at('下一章', g24next().opacity(1, 0.5)),
  );
});
