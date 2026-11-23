// U6 场景 1（MC）：b1–b13 —— 钩子、声明式 vs 命令式、鲨鱼例子、
// 优化器、引擎藏细节。分镜：skill-ch02/beats-u6.md；原文：DDIA §2.7（书页 p42–43）。
// 时长全部来自 timeline/u6.json（beat() 驱动），不手写 waitFor。
// 颜色、字号、安全区一律取自 lib/theme，不手写十六进制色值。
import {Circle, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, chain, createRef} from '@motion-canvas/core';
import {at, makeBeats} from '../../lib/beats';
import {FONT, SAFE, SIZE, T} from '../../lib/theme';
import {column, row} from '../../lib/layout';
import timeline from '../../timeline/u6.json';

export default makeScene2D(function* (view) {
  view.fill(T.bg);
  const beat = makeBeats(timeline);

  const header = createRef<Txt>();
  const anchor = createRef<Txt>();
  const say = (text: string) => anchor().text(text);

  const g1 = createRef<Node>();
  const g1q = createRef<Txt>();
  const g1dots = [0, 1, 2].map(() => createRef<Circle>());
  const g2 = createRef<Node>();
  const g2imp = createRef<Txt>();
  const g2decl = createRef<Txt>();
  const g2sql = createRef<Rect>();
  const g2old = createRef<Txt>();
  const g3 = createRef<Node>();
  const g3fn = createRef<Rect>();
  const g3basket = createRef<Rect>();
  const g3hl = createRef<Rect>();
  const g4 = createRef<Node>();
  const g4rows = [0, 1, 2, 3, 4].map(() => createRef<Rect>());
  const g4hl = createRef<Rect>();
  const g4count = createRef<Txt>();
  const g4basket = createRef<Rect>();
  const g5 = createRef<Node>();
  const g5sigma = createRef<Txt>();
  const g5mid = createRef<Txt>();
  const g5tail = createRef<Txt>();
  const g6 = createRef<Node>();
  const g6rows = [0, 1, 2, 3, 4].map(() => createRef<Rect>());
  const g6lab = createRef<Txt>();
  const g6arrow = createRef<Txt>();
  const g7 = createRef<Node>();
  const g7s1 = createRef<Txt>();
  const g7s2 = createRef<Txt>();
  const g7s3 = createRef<Txt>();
  const g8 = createRef<Node>();
  const g8r1 = createRef<Rect>();
  const g8r2 = createRef<Txt>();
  const g8r3 = createRef<Txt>();
  const g8basket = createRef<Rect>();
  const g9 = createRef<Node>();
  const g9dots = [0, 1, 2].map(() => createRef<Circle>());
  const g10 = createRef<Node>();
  const g10hl = createRef<Rect>();
  const g10var = createRef<Rect>();
  const g10loop = createRef<Txt>();
  const g11 = createRef<Node>();
  const g11chips = [0, 1, 2, 3].map(() => createRef<Rect>());
  const g12 = createRef<Node>();
  const g12gear = createRef<Circle>();
  const g12cards = [0, 1, 2].map(() => createRef<Rect>());
  const g13 = createRef<Node>();
  const g13lid = createRef<Rect>();
  const g13simple = createRef<Txt>();

  const listRows = column(5, 70, 20, [-300, 0]);
  const chipRow = row(4, 200, 24, [0, 80]);
  const gearCards = row(3, 220, 20, [330, 150]);
  const species = ['鲨鱼', '鲸鱼', '鲨鱼', '海豚', '鲨鱼'];

  view.add(
    <>
      <Txt
        ref={header}
        position={[-SAFE.halfW, -SAFE.halfH]}
        offset={[-1, -1]}
        fontSize={SIZE.label}
        fill={T.muted}
        fontFamily={FONT.sans}
        text={'只说要什么'}
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

      {/* b1：两扇门 */}
      <Node ref={g1} opacity={0}>
        <Rect position={[-300, -40]} width={340} height={280} radius={16} fill={T.card} stroke={T.blue} lineWidth={2}>
          <Txt position={[0, -100]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'怎么做'} />
        </Rect>
        {[0, 1, 2].map(i => (
          <Circle key={`g1d-${i}`} ref={g1dots[i]} position={[-300, -40 + i * 50]} width={16} height={16} fill={T.muted} />
        ))}
        <Rect position={[300, -40]} width={340} height={280} radius={16} fill={T.card} stroke={T.green} lineWidth={2}>
          <Txt position={[0, -100]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'要什么'} />
        </Rect>
        <Circle position={[300, 20]} width={110} height={110} stroke={T.yellow} lineWidth={3} />
        <Circle position={[300, 20]} width={36} height={36} fill={T.yellow} />
        <Txt ref={g1q} position={[0, -40]} scale={0.3} fontSize={72} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'?'} opacity={0} />
      </Node>

      {/* b2：声明式 vs 命令式 */}
      <Node ref={g2} opacity={0}>
        <Rect position={[-300, -40]} width={340} height={280} radius={16} fill={T.card} stroke={T.red} lineWidth={2}>
          <Txt position={[0, -100]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'怎么做'} />
        </Rect>
        <Rect position={[300, -40]} width={340} height={280} radius={16} fill={T.card} stroke={T.green} lineWidth={2}>
          <Txt position={[0, -100]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'要什么'} />
        </Rect>
        <Circle position={[300, 20]} width={110} height={110} stroke={T.yellow} lineWidth={3} />
        <Circle position={[300, 20]} width={36} height={36} fill={T.yellow} />
        <Txt ref={g2imp} position={[-300, -210]} fontSize={SIZE.title} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'命令式'} opacity={0} />
        <Txt ref={g2decl} position={[300, -210]} fontSize={SIZE.title} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'声明式'} opacity={0} />
        <Rect ref={g2sql} position={[300, 180]} width={300} height={80} radius={12} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.green} fontFamily={FONT.mono} text={'SQL'} />
        </Rect>
        <Txt ref={g2old} position={[-300, 180]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'层次 · 网状'} opacity={0} />
      </Node>

      {/* b3：动物名单 + 空篮子 + 函数 */}
      <Node ref={g3} opacity={0}>
        {listRows.map(([x, y], i) => (
          <Rect key={`g3r-${i}`} position={[x, y]} width={360} height={70} radius={10} fill={T.card} stroke={T.line} lineWidth={2}>
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={species[i]} />
          </Rect>
        ))}
        <Rect ref={g3fn} position={[320, -210]} width={400} height={70} radius={12} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'function getSharks() {'} />
        </Rect>
        <Rect ref={g3basket} position={[320, -40]} width={240} height={180} radius={16} fill={T.card} stroke={T.yellow} lineWidth={2} opacity={0}>
          <Txt position={[0, -40]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'篮子'} />
          <Txt position={[0, 30]} fontSize={SIZE.body} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'空'} />
        </Rect>
        <Rect ref={g3hl} position={[-300, -180]} width={380} height={86} radius={12} stroke={T.yellow} lineWidth={3} opacity={0} />
      </Node>

      {/* b4：逐条扫描，鲨鱼进篮子 */}
      <Node ref={g4} opacity={0}>
        {listRows.map(([x, y], i) => (
          <Rect key={`g4r-${i}`} ref={g4rows[i]} position={[x, y]} width={360} height={70} radius={10} fill={T.card} stroke={species[i] === '鲨鱼' ? T.line : T.line} lineWidth={2}>
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={species[i]} />
          </Rect>
        ))}
        <Rect ref={g4hl} position={[-300, -180]} width={380} height={86} radius={12} stroke={T.yellow} lineWidth={3} />
        <Rect ref={g4basket} position={[320, -40]} width={240} height={180} radius={16} fill={T.card} stroke={T.yellow} lineWidth={2}>
          <Txt position={[0, -40]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'篮子'} />
        </Rect>
        <Txt ref={g4count} position={[320, 20]} fontSize={SIZE.body} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'3 条鲨鱼'} opacity={0} />
      </Node>

      {/* b5：关系代数一行算式 */}
      <Node ref={g5} opacity={0}>
        <Txt ref={g5sigma} position={[-360, -60]} fontSize={52} fontWeight={700} fill={T.text} fontFamily={FONT.mono} text={'σ'} />
        <Txt ref={g5mid} position={[-40, -60]} fontSize={44} fill={T.text} fontFamily={FONT.mono} text={'family = "Sharks"'} />
        <Txt ref={g5tail} position={[330, -60]} fontSize={44} fill={T.text} fontFamily={FONT.mono} text={'(animals)'} />
        <Txt position={[0, 80]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'关系代数'} />
      </Node>

      {/* b6：挑选算子筛出鲨鱼 */}
      <Node ref={g6} opacity={0}>
        <Txt position={[120, -230]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.mono} text={'σ family = "Sharks" (animals)'} />
        <Txt ref={g6lab} position={[120, -170]} fontSize={SIZE.label} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'σ 是挑选算子'} opacity={0} />
        {listRows.map(([x, y], i) => (
          <Rect key={`g6r-${i}`} ref={g6rows[i]} position={[x - 40, y - 60]} width={300} height={56} radius={10} fill={T.card} stroke={T.line} lineWidth={2}>
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={species[i]} />
          </Rect>
        ))}
        <Txt ref={g6arrow} position={[180, -60]} fontSize={48} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'→'} opacity={0} />
        <Rect position={[330, -60]} width={200} height={120} radius={14} fill={T.card} stroke={T.green} lineWidth={2}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'3 条鲨鱼'} />
        </Rect>
      </Node>

      {/* b7：SQL 三段 */}
      <Node ref={g7} opacity={0}>
        <Rect position={[0, -40]} width={820} height={280} radius={18} fill={T.card} stroke={T.green} lineWidth={2} />
        <Txt ref={g7s1} position={[0, -130]} fontSize={SIZE.title} fontWeight={700} fill={T.text} fontFamily={FONT.mono} text={'SELECT *'} opacity={0} />
        <Txt ref={g7s2} position={[0, -40]} fontSize={SIZE.title} fontWeight={700} fill={T.text} fontFamily={FONT.mono} text={'FROM animals'} opacity={0} />
        <Txt ref={g7s3} position={[0, 50]} fontSize={SIZE.title} fontWeight={700} fill={T.text} fontFamily={FONT.mono} text={"WHERE family = 'Sharks'"} opacity={0} />
      </Node>

      {/* b8：三种写法并排 */}
      <Node ref={g8} opacity={0}>
        <Rect ref={g8r1} position={[-40, -180]} width={880} height={90} radius={12} fill={T.card} stroke={T.red} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'命令式：getSharks() { for … if … push … }'} />
        </Rect>
        <Txt ref={g8r2} position={[-40, -40]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.mono} text={'σ family = "Sharks" (animals)'} opacity={0} />
        <Txt ref={g8r3} position={[-40, 100]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.mono} text={"SELECT * FROM animals WHERE family = 'Sharks'"} opacity={0} />
        <Rect ref={g8basket} position={[470, -40]} width={180} height={140} radius={14} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'3 条鲨鱼'} />
        </Rect>
      </Node>

      {/* b9：一步一步走代码 */}
      <Node ref={g9} opacity={0}>
        <Rect position={[0, -40]} width={900} height={320} radius={18} fill={T.card} stroke={T.red} lineWidth={2} />
        <Txt position={[0, -160]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'function getSharks() {'} />
        <Txt position={[0, -100]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'  var sharks = [];'} />
        <Txt position={[0, -40]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'  for (var i = 0; i < animals.length; i++) {'} />
        <Txt position={[0, 20]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'    if (animals[i].family === "Sharks") …'} />
        <Txt position={[0, 80]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'  return sharks; }'} />
        {[0, 1, 2].map(i => (
          <Circle key={`g9d-${i}`} ref={g9dots[i]} position={[-420, -160 + i * 60]} width={18} height={18} fill={T.yellow} opacity={0} />
        ))}
      </Node>

      {/* b10：判断、更新、绕回去 */}
      <Node ref={g10} opacity={0}>
        <Rect position={[0, -60]} width={900} height={300} radius={18} fill={T.card} stroke={T.red} lineWidth={2} />
        <Txt position={[0, -170]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'function getSharks() {'} />
        <Txt position={[0, -110]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'  var sharks = [];'} />
        <Txt position={[0, -50]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'  for (var i = 0; i < animals.length; i++) {'} />
        <Txt position={[0, 10]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'    if (animals[i].family === "Sharks") …'} />
        <Txt position={[0, 70]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'  return sharks; }'} />
        <Rect ref={g10hl} position={[0, 10]} width={860} height={56} radius={10} stroke={T.yellow} lineWidth={3} opacity={0} />
        <Rect ref={g10var} position={[0, 180]} width={420} height={70} radius={12} fill={T.card} stroke={T.yellow} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.mono} text={'i = 0 → 1 → 2 …'} />
        </Rect>
        <Txt ref={g10loop} position={[0, 245]} fontSize={SIZE.label} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'↺ 绕回循环开头'} opacity={0} />
      </Node>

      {/* b11：只说要什么 */}
      <Node ref={g11} opacity={0}>
        <Rect position={[0, -140]} width={820} height={130} radius={16} fill={T.card} stroke={T.green} lineWidth={2}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={"SELECT * FROM animals WHERE family = 'Sharks'"} />
        </Rect>
        {chipRow.map(([x, y], i) => (
          <Rect key={`g11c-${i}`} ref={g11chips[i]} position={[x, y]} width={200} height={80} radius={12} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={['WHERE 条件', '排序', '分组', '汇总'][i]} />
          </Rect>
        ))}
      </Node>

      {/* b12：优化器定怎么做 */}
      <Node ref={g12} opacity={0}>
        <Rect position={[-330, -60]} width={420} height={140} radius={16} fill={T.card} stroke={T.green} lineWidth={2}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={"SELECT * … WHERE …"} />
        </Rect>
        <Circle ref={g12gear} position={[330, -60]} width={170} height={170} stroke={T.blue} lineWidth={3} />
        <Txt position={[330, -60]} fontSize={SIZE.label} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'优化器'} />
        {gearCards.map(([x, y], i) => (
          <Rect key={`g12c-${i}`} ref={g12cards[i]} position={[x, y]} width={220} height={70} radius={10} fill={T.card} stroke={T.line} lineWidth={2} opacity={0}>
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={['索引', '连接方法', '执行顺序'][i]} />
          </Rect>
        ))}
      </Node>

      {/* b13：引擎盖上，细节藏起来 */}
      <Node ref={g13} opacity={0}>
        <Rect position={[0, -60]} width={700} height={300} radius={18} fill={T.card} stroke={T.line} lineWidth={2}>
          <Txt position={[0, -170]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'数据库引擎'} />
        </Rect>
        <Circle position={[0, -40]} width={130} height={130} stroke={T.muted} lineWidth={2} />
        <Txt position={[0, -40]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'优化器'} />
        <Rect ref={g13lid} position={[0, -60]} width={700} height={300} radius={18} fill={T.bg} stroke={T.line} lineWidth={2} opacity={0}>
          <Txt position={[0, -170]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'数据库引擎'} />
          <Txt position={[0, -40]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'内部细节 · 不用管'} />
        </Rect>
        <Rect position={[-350, 200]} width={300} height={80} radius={12} fill={T.card} stroke={T.green} lineWidth={2}>
          <Txt fontSize={SIZE.label} fontWeight={700} fill={T.green} fontFamily={FONT.mono} text={'SQL 查询'} />
        </Rect>
        <Line points={[[-190, 200], [-60, 90]]} stroke={T.green} lineWidth={2} />
        <Txt ref={g13simple} position={[300, 200]} fontSize={SIZE.title} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'简洁'} opacity={0} />
      </Node>
    </>
  );

  say('怎么做？要什么？');
  yield* beat('b1',
    all(g1().opacity(1, 0.5)),
    at('差别在哪', all(g1q().opacity(1, 0.3), g1q().scale(1, 0.4))),
  );

  say('声明式 vs 命令式');
  yield* beat('b2',
    all(g1().opacity(0, 0.5), g2().opacity(1, 0.5)),
    at('SQL 是声明式', all(g2decl().opacity(1, 0.4), g2sql().opacity(1, 0.4))),
    at('层次和网状系统', g2old().opacity(1, 0.4)),
    at('命令式代码', g2imp().opacity(1, 0.4)),
  );

  say('一份动物名单');
  yield* beat('b3',
    all(g2().opacity(0, 0.5), g3().opacity(1, 0.5)),
    at('写个函数', g3fn().opacity(1, 0.4)),
    at('空篮子', g3basket().opacity(1, 0.4)),
    at('一条一条看', g3hl().opacity(1, 0.4)),
  );

  say('挑出 3 条鲨鱼');
  yield* beat('b4',
    all(g3().opacity(0, 0.5), g4().opacity(1, 0.5)),
    chain(g4hl().position([-300, -90], 0.5), g4hl().position([-300, 0], 0.5), g4hl().position([-300, 90], 0.5), g4hl().position([-300, 180], 0.5)),
    at('放进篮子', all(g4rows[0]().stroke(T.green, 0.3), g4rows[2]().stroke(T.green, 0.3), g4rows[4]().stroke(T.green, 0.3), g4count().opacity(1, 0.4))),
    at('就是答案', chain(g4basket().scale(1.06, 0.3), g4basket().scale(1, 0.3))),
  );

  say('一行算式');
  yield* beat('b5',
    all(g4().opacity(0, 0.5), g5().opacity(1, 0.5)),
    at('西格玛', all(g5sigma().fill(T.yellow, 0.3), chain(g5sigma().scale(1.15, 0.3), g5sigma().scale(1, 0.3)))),
    at('家族等于鲨鱼', g5mid().fill(T.yellow, 0.3)),
    at('动物名单', g5tail().fill(T.yellow, 0.3)),
  );

  say('挑选算子 σ');
  yield* beat('b6',
    all(g5().opacity(0, 0.5), g6().opacity(1, 0.5)),
    at('挑选算子', g6lab().opacity(1, 0.4)),
    at('只返回', all(g6rows[0]().stroke(T.green, 0.3), g6rows[2]().stroke(T.green, 0.3), g6rows[4]().stroke(T.green, 0.3), g6arrow().opacity(1, 0.4))),
  );

  say('SELECT … WHERE …');
  yield* beat('b7',
    all(g6().opacity(0, 0.5), g7().opacity(1, 0.5)),
    at('选出', g7s1().opacity(1, 0.4)),
    at('动物表里', g7s2().opacity(1, 0.4)),
    at('家族是鲨鱼', g7s3().opacity(1, 0.4)),
  );

  say('三种写法，同一批鲨鱼');
  yield* beat('b8',
    all(g7().opacity(0, 0.5), g8().opacity(1, 0.5)),
    at('命令式一长串', g8r1().opacity(1, 0.4)),
    at('关系代数一行', g8r2().opacity(1, 0.4)),
    at('SQL 一行半', g8r3().opacity(1, 0.4)),
    at('同一批鲨鱼', all(g8basket().opacity(1, 0.4), chain(g8basket().scale(1.08, 0.3), g8basket().scale(1, 0.3)))),
  );

  say('一步一步');
  yield* beat('b9',
    all(g8().opacity(0, 0.5), g9().opacity(1, 0.5)),
    at('一步一步', chain(g9dots[0]().opacity(1, 0.3), g9dots[1]().opacity(1, 0.3), g9dots[2]().opacity(1, 0.3))),
  );

  say('判断、更新、绕回去');
  yield* beat('b10',
    all(g9().opacity(0, 0.5), g10().opacity(1, 0.5)),
    at('判断条件', g10hl().opacity(1, 0.4)),
    at('更新变量', g10var().opacity(1, 0.4)),
    at('绕回去', g10loop().opacity(1, 0.4)),
  );

  say('只说要什么');
  yield* beat('b11',
    all(g10().opacity(0, 0.5), g11().opacity(1, 0.5)),
    at('满足什么条件', g11chips[0]().opacity(1, 0.4)),
    at('排序', g11chips[1]().opacity(1, 0.4)),
    at('分组', g11chips[2]().opacity(1, 0.4)),
    at('汇总', g11chips[3]().opacity(1, 0.4)),
  );

  say('优化器来定怎么做');
  yield* beat('b12',
    all(g11().opacity(0, 0.5), g12().opacity(1, 0.5)),
    at('查哪个索引', all(g12cards[0]().opacity(1, 0.4), chain(g12gear().scale(1.05, 0.3), g12gear().scale(1, 0.3)))),
    at('用什么连接方法', g12cards[1]().opacity(1, 0.4)),
    at('先算哪一部分', g12cards[2]().opacity(1, 0.4)),
  );

  say('细节藏起来了');
  yield* beat('b13',
    all(g12().opacity(0, 0.5), g13().opacity(1, 0.5)),
    at('更简洁', g13simple().opacity(1, 0.4)),
    at('藏起来了', g13lid().opacity(1, 0.5)),
  );
});
