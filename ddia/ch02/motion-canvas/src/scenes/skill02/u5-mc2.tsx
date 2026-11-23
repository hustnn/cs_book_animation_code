// U5 场景 2（MC）：b17–b31 —— schemaless 的误导、隐式 schema、
// schema-on-read vs schema-on-write、动静类型检查、改格式两段代码、
// ALTER 几毫秒 vs MySQL 复制整表、NULL 读时填、异构数据。
// 分镜：skill-ch02/beats-u5.md U5 一节；原文：DDIA §2.6（书页 p39–41）。
// 时长全部来自 timeline/u5.json（beat() 驱动），不手写 waitFor。
// 颜色、字号、安全区一律取自 lib/theme，不手写十六进制色值。
import {Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, chain, createRef, waitFor} from '@motion-canvas/core';
import {at, makeBeats} from '../../lib/beats';
import {FONT, SAFE, SIZE, T} from '../../lib/theme';
import timeline from '../../timeline/u5.json';

export default makeScene2D(function* (view) {
  view.fill(T.bg);
  const beat = makeBeats(timeline);

  const header = createRef<Txt>();
  const anchor = createRef<Txt>();
  const say = (text: string) => anchor().text(text);

  const g17 = createRef<Node>();
  const g17q = createRef<Txt>();
  const g18 = createRef<Node>();
  const g18ghost = createRef<Rect>();
  const g19 = createRef<Node>();
  const g19left = createRef<Rect>();
  const g19sub = createRef<Txt>();
  const g19right = createRef<Rect>();
  const g19stamp = createRef<Txt>();
  const g20 = createRef<Node>();
  const g20a = createRef<Rect>();
  const g20b = createRef<Rect>();
  const g21 = createRef<Node>();
  const g22 = createRef<Node>();
  const g22b = createRef<Rect>();
  const g23 = createRef<Node>();
  const g23new = createRef<Rect>();
  const g23old = createRef<Rect>();
  const g24a = createRef<Node>();
  const g24l = [0, 1, 2].map(() => createRef<Txt>());
  const g24b = createRef<Node>();
  const g24date = createRef<Txt>();
  const g25 = createRef<Node>();
  const g25a = createRef<Rect>();
  const g25b = createRef<Rect>();
  const g26 = createRef<Node>();
  const g26a = createRef<Rect>();
  const g26b = createRef<Rect>();
  const g27 = createRef<Node>();
  const g27tag = createRef<Txt>();
  const g27ms = createRef<Txt>();
  const g28 = createRef<Node>();
  const g28copy = createRef<Rect>();
  const g28hrs = createRef<Txt>();
  const g29 = createRef<Node>();
  const g29rows = [0, 1, 2].map(() => createRef<Rect>());
  const g29fill = createRef<Txt>();
  const g30 = createRef<Node>();
  const g30ext = createRef<Txt>();
  const g31 = createRef<Node>();
  const g31a = createRef<Rect>();
  const g31b = createRef<Rect>();

  view.add(
    <>
      <Txt
        ref={header}
        position={[-SAFE.halfW, -SAFE.halfH]}
        offset={[-1, -1]}
        fontSize={SIZE.label}
        fill={T.muted}
        fontFamily={FONT.sans}
        text={'今天怎么选'}
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

      {/* b17：无 schema？别信一半 */}
      <Node ref={g17} opacity={0}>
        <Rect position={[0, -60]} width={480} height={180} radius={16} fill={T.card} stroke={T.yellow} lineWidth={3}>
          <Txt fontSize={SIZE.title} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'schemaless · 无 schema'} />
        </Rect>
        <Txt ref={g17q} position={[0, 120]} fontSize={SIZE.label} fill={T.red} fontFamily={FONT.sans} text={'这说法有误导性'} opacity={0} />
      </Node>

      {/* b18：隐式 schema 一直都在 */}
      <Node ref={g18} opacity={0}>
        <Rect position={[0, -60]} width={560} height={220} radius={16} fill={T.card} stroke={T.blue} lineWidth={2}>
          <Txt position={[0, -60]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'读数据的代码'} />
          <Txt position={[0, 10]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'总假定某种结构'} />
        </Rect>
        <Rect ref={g18ghost} position={[0, 120]} width={420} height={70} radius={12} fill={T.card} stroke={T.purple} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.purple} fontFamily={FONT.sans} text={'隐式 schema（虚线结构）'} />
        </Rect>
      </Node>

      {/* b19：读时解读 vs 写时盖章 */}
      <Node ref={g19} opacity={0}>
        <Rect ref={g19left} position={[-280, -40]} width={380} height={220} radius={16} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt position={[0, -50]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'schema-on-read'} />
          <Txt ref={g19sub} position={[0, 30]} fontSize={SIZE.label} fill={T.blue} fontFamily={FONT.sans} text={'读时才解读结构'} opacity={0} />
        </Rect>
        <Rect ref={g19right} position={[280, -40]} width={380} height={220} radius={16} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt position={[0, -50]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'schema-on-write'} />
          <Txt position={[0, 30]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} text={'写时就盖章'} />
        </Rect>
        <Txt ref={g19stamp} position={[280, 130]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} text={'库保证每条写入都合规 ✓'} opacity={0} />
      </Node>

      {/* b20：动静类型检查对照 */}
      <Node ref={g20} opacity={0}>
        <Rect ref={g20a} position={[-280, -40]} width={380} height={200} radius={16} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt position={[0, -40]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'动态类型检查'} />
          <Txt position={[0, 30]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'运行时才查 → 读时解读'} />
        </Rect>
        <Rect ref={g20b} position={[280, -40]} width={380} height={200} radius={16} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt position={[0, -40]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'静态类型检查'} />
          <Txt position={[0, 30]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'编译时就查 → 写时盖章'} />
        </Rect>
      </Node>

      {/* b21：没有对错之分 */}
      <Node ref={g21} opacity={0}>
        <Txt position={[-280, -60]} fontSize={SIZE.body} fill={T.blue} fontFamily={FONT.sans} text={'静态派'} />
        <Txt position={[280, -60]} fontSize={SIZE.body} fill={T.green} fontFamily={FONT.sans} text={'动态派'} />
        <Txt position={[0, -60]} fontSize={SIZE.title} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'VS'} />
        <Txt position={[0, 80]} fontSize={SIZE.title} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'没有对错之分'} />
      </Node>

      {/* b22：全名裂开成名和姓 */}
      <Node ref={g22} opacity={0}>
        <Rect position={[0, -160]} width={420} height={100} radius={14} fill={T.card} stroke={T.blue} lineWidth={2}>
          <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'全名（一个字段）'} />
        </Rect>
        <Line points={[[0, -110], [0, -60]]} stroke={T.line} lineWidth={2} />
        <Rect ref={g22b} position={[0, 20]} width={560} height={110} radius={14} fill={T.card} stroke={T.yellow} lineWidth={2} opacity={0}>
          <Txt position={[-140, 0]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'名'} />
          <Txt position={[140, 0]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'姓'} />
        </Rect>
      </Node>

      {/* b23：新旧文档混放 */}
      <Node ref={g23} opacity={0}>
        <Rect ref={g23new} position={[-280, -40]} width={380} height={220} radius={16} fill={T.card} stroke={T.green} lineWidth={3} opacity={0}>
          <Txt position={[0, -50]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'新文档'} />
          <Txt position={[0, 30]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.mono} text={'"first_name": …'} />
        </Rect>
        <Rect ref={g23old} position={[280, -40]} width={380} height={220} radius={16} fill={T.card} stroke={T.muted} lineWidth={2} opacity={0}>
          <Txt position={[0, -50]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'旧文档'} />
          <Txt position={[0, 30]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.mono} text={'"name": …'} />
        </Rect>
        <Txt position={[0, 130]} fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.sans} text={'读到旧文档时，应用代码兜底'} />
      </Node>

      {/* b24a：兜底代码逐行 */}
      <Node ref={g24a} opacity={0}>
        <Rect position={[0, -40]} width={760} height={300} radius={16} fill={T.card} stroke={T.blue} lineWidth={2}>
          <Txt ref={g24l[0]} position={[-340, -90]} offset={[-1, 0]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'if (user && user.name && !user.first_name) {'} opacity={0} />
          <Txt ref={g24l[1]} position={[-340, -20]} offset={[-1, 0]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'    user.first_name = user.name.split(" ")[0];'} opacity={0} />
          <Txt ref={g24l[2]} position={[-340, 50]} offset={[-1, 0]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'}'} opacity={0} />
        </Rect>
      </Node>

      {/* b24b：注释与日期 */}
      <Node ref={g24b} opacity={0}>
        <Rect position={[0, -40]} width={760} height={300} radius={16} fill={T.card} stroke={T.blue} lineWidth={2}>
          <Txt position={[-340, -90]} offset={[-1, 0]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.mono} text={'// 2013 年 12 月 8 日之前写的文档'} />
          <Txt position={[-340, -20]} offset={[-1, 0]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.mono} text={'// 没有 first_name 这个字段'} />
        </Rect>
        <Txt ref={g24date} position={[0, 150]} fontSize={SIZE.title} fontWeight={700} fill={T.yellow} fontFamily={FONT.mono} text={'2013 年 12 月 8 日'} opacity={0} />
      </Node>

      {/* b25：迁移两行语句 */}
      <Node ref={g25} opacity={0}>
        <Rect ref={g25a} position={[0, -110]} width={680} height={100} radius={14} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'① 先加列'} />
        </Rect>
        <Rect ref={g25b} position={[0, 40]} width={680} height={100} radius={14} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'② 再更新'} />
        </Rect>
      </Node>

      {/* b26：两行语句逐行高亮 */}
      <Node ref={g26} opacity={0}>
        <Rect ref={g26a} position={[0, -110]} width={760} height={110} radius={14} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'ALTER TABLE users ADD COLUMN first_name text;'} />
        </Rect>
        <Rect ref={g26b} position={[0, 40]} width={760} height={110} radius={14} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'UPDATE users SET first_name = split_part(name, …);'} />
        </Rect>
      </Node>

      {/* b27：加列只需几毫秒 */}
      <Node ref={g27} opacity={0}>
        <Txt ref={g27tag} position={[0, -120]} fontSize={SIZE.title} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'慢、要停机？'} opacity={0} />
        <Txt position={[0, -20]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'大多数关系库执行加列'} />
        <Txt ref={g27ms} position={[0, 80]} fontSize={SIZE.title} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'只需几毫秒'} opacity={0} />
      </Node>

      {/* b28：MySQL 复制整张表 */}
      <Node ref={g28} opacity={0}>
        <Rect position={[-280, -40]} width={340} height={200} radius={16} fill={T.card} stroke={T.blue} lineWidth={2}>
          <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'MySQL · 旧表'} />
        </Rect>
        <Rect ref={g28copy} position={[280, -40]} width={340} height={200} radius={16} fill={T.card} stroke={T.red} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'复制出来的整张表'} />
        </Rect>
        <Txt ref={g28hrs} position={[0, 130]} fontSize={SIZE.title} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'几分钟，甚至几小时停机'} opacity={0} />
      </Node>

      {/* b29：留空，读时再填 */}
      <Node ref={g29} opacity={0}>
        {[0, 1, 2].map(i => (
          <Rect key={`g29-${i}`} ref={g29rows[i]} position={[-360 + i * 360, -60]} width={280} height={120} radius={12} fill={T.card} stroke={T.line} lineWidth={2} opacity={0}>
            <Txt fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={['第 1 行', '第 2 行', '第 3 行'][i]} />
          </Rect>
        ))}
        <Txt ref={g29fill} position={[0, 110]} fontSize={SIZE.title} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'名留空，读时再填'} opacity={0} />
      </Node>

      {/* b30：结构各不相同 */}
      <Node ref={g30} opacity={0}>
        <Rect position={[-360, -60]} width={200} height={140} radius={12} fill={T.card} stroke={T.blue} lineWidth={2}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'类型 A'} />
        </Rect>
        <Rect position={[-120, -60]} width={200} height={140} radius={12} fill={T.card} stroke={T.green} lineWidth={2}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'类型 B'} />
        </Rect>
        <Rect position={[120, -60]} width={200} height={140} radius={12} fill={T.card} stroke={T.yellow} lineWidth={2}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'类型 C'} />
        </Rect>
        <Rect position={[360, -60]} width={200} height={140} radius={12} fill={T.card} stroke={T.purple} lineWidth={2}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'类型 D…'} />
        </Rect>
        <Txt ref={g30ext} position={[0, 110]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'结构由外部系统决定，随时可能变'} opacity={0} />
      </Node>

      {/* b31：异构用文档，同构用 schema */}
      <Node ref={g31} opacity={0}>
        <Rect ref={g31a} position={[-280, -40]} width={380} height={200} radius={16} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt position={[0, -40]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'异构数据'} />
          <Txt position={[0, 40]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} text={'→ 文档更自然'} />
        </Rect>
        <Rect ref={g31b} position={[280, -40]} width={380} height={200} radius={16} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt position={[0, -40]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'同构记录'} />
          <Txt position={[0, 40]} fontSize={SIZE.label} fill={T.blue} fontFamily={FONT.sans} text={'→ schema 是好机制'} />
        </Rect>
      </Node>
    </>
  );

  say('无 schema？别信一半');
  yield* beat('b17',
    all(g17().opacity(1, 0.5)),
    at('有误导性', g17q().opacity(1, 0.4)),
  );

  say('隐式 schema 一直都在');
  yield* beat('b18',
    all(g17().opacity(0, 0.5), g18().opacity(1, 0.5)),
    at('隐式 schema', g18ghost().opacity(1, 0.5)),
    at('不由数据库强制', waitFor(0.01)),
  );

  say('读时解读');
  yield* beat('b19a',
    all(g18().opacity(0, 0.5), g19().opacity(1, 0.5), g19left().opacity(1, 0.5)),
    at('schema-on-read', g19sub().opacity(1, 0.4)),
  );

  say('写时盖章');
  yield* beat('b19b',
    all(g19right().opacity(1, 0.5)),
    at('库保证每条写入都合规', g19stamp().opacity(1, 0.4)),
  );

  say('像动静类型检查');
  yield* beat('b20a',
    all(g19().opacity(0, 0.5), g20().opacity(1, 0.5)),
    at('动态类型检查', g20a().opacity(1, 0.4)),
  );

  say('像动静类型检查');
  yield* beat('b20b',
    all(),
    at('静态类型检查', g20b().opacity(1, 0.4)),
  );

  say('没有对错之分');
  yield* beat('b21',
    all(g20().opacity(0, 0.5), g21().opacity(1, 0.5)),
  );

  say('改格式时最明显');
  yield* beat('b22a',
    all(g21().opacity(0, 0.5), g22().opacity(1, 0.5)),
  );

  say('全名拆成名和姓');
  yield* beat('b22b',
    all(),
    at('拆成名和姓分开存', g22b().opacity(1, 0.5)),
  );

  say('新旧文档混放，读时兜底');
  yield* beat('b23',
    all(g22().opacity(0, 0.5), g23().opacity(1, 0.5)),
    at('写带新字段的新文档', g23new().opacity(1, 0.4)),
    at('读到旧文档时', g23old().opacity(1, 0.4)),
  );

  say('读时兜底的代码');
  yield* beat('b24a',
    all(g23().opacity(0, 0.5), g24a().opacity(1, 0.5)),
    at('如果用户有全名', g24l[0]().opacity(1, 0.4)),
    at('按空格切开', g24l[1]().opacity(1, 0.4)),
    at('取第一段当名', g24l[2]().opacity(1, 0.4)),
  );

  say('2013 年 12 月 8 日之前');
  yield* beat('b24b',
    all(g24a().opacity(0, 0.5), g24b().opacity(1, 0.5)),
    at('注释里写着', waitFor(0.01)),
    at('2013 年 12 月 8 日', g24date().opacity(1, 0.5)),
  );

  say('两行语句做迁移');
  yield* beat('b25',
    all(g24b().opacity(0, 0.5), g25().opacity(1, 0.5), g25a().opacity(1, 0.5)),
    at('再更新', g25b().opacity(1, 0.4)),
  );

  say('先加列');
  yield* beat('b26a',
    all(g25().opacity(0, 0.5), g26().opacity(1, 0.5)),
    at('先加列', g26a().opacity(1, 0.4)),
  );

  say('再更新');
  yield* beat('b26b',
    all(),
    at('再更新', g26b().opacity(1, 0.4)),
  );

  say('加列只需几毫秒');
  yield* beat('b27',
    all(g26().opacity(0, 0.5), g27().opacity(1, 0.5)),
    at('慢、要停机', g27tag().opacity(1, 0.4)),
    at('只需几毫秒', g27ms().opacity(1, 0.5)),
  );

  say('MySQL 要复制整张表');
  yield* beat('b28',
    all(g27().opacity(0, 0.5), g28().opacity(1, 0.5)),
    at('复制整张表', g28copy().opacity(1, 0.5)),
    at('几小时的停机', g28hrs().opacity(1, 0.4)),
  );

  say('留空，读时再填');
  yield* beat('b29',
    all(g28().opacity(0, 0.5), g29().opacity(1, 0.5)),
    at('每行都要重写', chain(g29rows[0]().opacity(1, 0.3), g29rows[1]().opacity(1, 0.3), g29rows[2]().opacity(1, 0.3))),
    at('读的时候再填', g29fill().opacity(1, 0.4)),
  );

  say('结构各不相同的时候');
  yield* beat('b30',
    all(g29().opacity(0, 0.5), g30().opacity(1, 0.5)),
    at('由外部系统决定', g30ext().opacity(1, 0.5)),
  );

  say('异构用文档，同构用 schema');
  yield* beat('b31',
    all(g30().opacity(0, 0.5), g31().opacity(1, 0.5)),
    at('没有 schema 的文档反而更自然', g31a().opacity(1, 0.4)),
    at('schema 是记录和强制结构的好机制', g31b().opacity(1, 0.4)),
  );
});
