// U2 场景 1（MC）：b1–b11 —— 钩子、对象图 vs 表、阻抗失配、ORM、
// 简历档案、名字进表、一对多、规范化拆表。
// 分镜：skill-ch02/beats-u2.md U2 一节；原文：DDIA §2.3（书页 p29–32，PDF p51–54）。
// 时长全部来自 timeline/u2.json（beat() 驱动），不手写 waitFor。
// 颜色、字号、安全区一律取自 lib/theme，不手写十六进制色值。
import {Circle, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, chain, createRef, waitFor} from '@motion-canvas/core';
import {at, makeBeats} from '../../lib/beats';
import {FONT, SAFE, SIZE, T} from '../../lib/theme';
import timeline from '../../timeline/u2.json';

export default makeScene2D(function* (view) {
  view.fill(T.bg);
  const beat = makeBeats(timeline);

  const header = createRef<Txt>();
  const anchor = createRef<Txt>();
  const say = (text: string) => anchor().text(text);

  const g1 = createRef<Node>();
  const g1tables = [0, 1, 2, 3, 4, 5].map(() => createRef<Rect>());
  const g1doc = createRef<Rect>();
  const g1q = createRef<Txt>();
  const g2 = createRef<Node>();
  const g2center = createRef<Rect>();
  const g2branches = [0, 1, 2].map(() => createRef<Node>());
  const g3 = createRef<Node>();
  const g3obj = createRef<Node>();
  const g3tables = createRef<Node>();
  const g3band = createRef<Rect>();
  const g3bandLab = createRef<Txt>();
  const g4 = createRef<Node>();
  const g4x = createRef<Txt>();
  const g4tag = createRef<Txt>();
  const g5 = createRef<Node>();
  const g5dot = createRef<Circle>();
  const g5power = createRef<Rect>();
  const g6 = createRef<Node>();
  const g6orm = createRef<Rect>();
  const g6code = [0, 1, 2].map(() => createRef<Rect>());
  const g7 = createRef<Node>();
  const g7orm = createRef<Rect>();
  const g7gap = createRef<Rect>();
  const g7gapLab = createRef<Txt>();
  const g8 = createRef<Node>();
  const g8card = createRef<Rect>();
  const g8lines = [0, 1, 2].map(() => createRef<Txt>());
  const g8chip = createRef<Rect>();
  const g8chipLab = createRef<Txt>();
  const g9 = createRef<Node>();
  const g9name = createRef<Rect>();
  const g9table = createRef<Node>();
  const g9bill = createRef<Rect>();
  const g10 = createRef<Node>();
  const g10user = createRef<Rect>();
  const g10fork = createRef<Circle>();
  const g10branches = [0, 1, 2].map(() => createRef<Node>());
  const g10lab = createRef<Txt>();
  const g11 = createRef<Node>();
  const g11users = createRef<Node>();
  const g11tables = [0, 1, 2].map(() => createRef<Node>());
  const g11fks = [0, 1, 2].map(() => createRef<Line>());
  const g11tag = createRef<Txt>();

  const tableNames = ['users', 'regions', 'industries', 'positions', 'education', 'contact_info'];

  view.add(
    <>
      <Txt
        ref={header}
        position={[-SAFE.halfW, -SAFE.halfH]}
        offset={[-1, -1]}
        fontSize={SIZE.label}
        fill={T.muted}
        fontFamily={FONT.sans}
        text={'同一份简历，两种长相'}
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

      {/* b1：六张小表 vs 一个文档 */}
      <Node ref={g1} opacity={0}>
        {[0, 1, 2, 3, 4, 5].map(i => (
          <Rect
            key={`g1t-${i}`}
            ref={g1tables[i]}
            position={[-360, -210 + i * 68]}
            width={300}
            height={56}
            radius={12}
            fill={T.card}
            stroke={T.blue}
            lineWidth={2}
            opacity={0}
          >
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={tableNames[i]} />
          </Rect>
        ))}
        <Rect
          ref={g1doc}
          position={[360, -40]}
          width={260}
          height={320}
          radius={16}
          fill={T.card}
          stroke={T.green}
          lineWidth={2}
          opacity={0}
        >
          <Txt position={[0, -110]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'一份文档'} />
          <Txt position={[0, -40]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'简历'} />
          <Txt position={[0, 30]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.mono} text={'{ … }'} />
          <Txt position={[0, 100]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'都在一处'} />
        </Rect>
        <Txt ref={g1q} position={[0, -40]} fontSize={72} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'?'} opacity={0} />
      </Node>

      {/* b2：对象图 */}
      <Node ref={g2} opacity={0}>
        <Rect ref={g2center} position={[-320, -40]} width={220} height={110} radius={16} fill={T.card} stroke={T.blue} lineWidth={3} opacity={0}>
          <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'用户'} />
        </Rect>
        {[0, 1, 2].map(i => (
          <Node key={`g2b-${i}`} ref={g2branches[i]} opacity={0}>
            <Line points={[[-210, -40], [60, -180 + i * 140]]} stroke={T.line} lineWidth={2} />
            <Rect position={[180, -180 + i * 140]} width={240} height={90} radius={14} fill={T.card} stroke={T.blue} lineWidth={2}>
              <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={['工作', '教育', '联系方式'][i]} />
            </Rect>
            <Rect position={[430, -180 + i * 140]} width={150} height={60} radius={10} fill={T.card} stroke={T.line} lineWidth={2}>
              <Txt fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={['工作 1 · 2', '学校 1 · 2', '博客 · 推特'][i]} />
            </Rect>
          </Node>
        ))}
      </Node>

      {/* b3：对象图 vs 表，中间翻译层 */}
      <Node ref={g3} opacity={0}>
        <Node ref={g3obj}>
          <Rect position={[-420, -40]} width={200} height={100} radius={14} fill={T.card} stroke={T.blue} lineWidth={2}>
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'对象'} />
          </Rect>
          <Rect position={[-420, 90]} width={200} height={60} radius={10} fill={T.card} stroke={T.line} lineWidth={2}>
            <Txt fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'一层套一层'} />
          </Rect>
        </Node>
        <Node ref={g3tables} opacity={0}>
          {[0, 1, 2].map(i => (
            <Rect
              key={`g3t-${i}`}
              position={[420, -140 + i * 110]}
              width={260}
              height={80}
              radius={12}
              fill={T.card}
              stroke={T.blue}
              lineWidth={2}
            >
              <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={['users', 'positions', 'education'][i]} />
            </Rect>
          ))}
        </Node>
        <Rect ref={g3band} position={[0, -40]} width={150} height={300} radius={12} fill={T.card} stroke={T.yellow} lineWidth={2} opacity={0} />
        <Txt ref={g3bandLab} position={[0, -40]} fontSize={SIZE.label} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'翻译层'} opacity={0} />
      </Node>

      {/* b4/b5：两段电路，阻抗不匹配 */}
      <Node ref={g4} opacity={0}>
        <Rect position={[-320, -60]} width={360} height={200} radius={16} fill={T.card} stroke={T.blue} lineWidth={2}>
          <Txt position={[0, -50]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'电路 A · 输出'} />
          <Txt position={[0, 30]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'输出阻抗'} />
        </Rect>
        <Rect position={[320, -60]} width={360} height={200} radius={16} fill={T.card} stroke={T.blue} lineWidth={2}>
          <Txt position={[0, -50]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'电路 B · 输入'} />
          <Txt position={[0, 30]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'输入阻抗'} />
        </Rect>
        <Txt ref={g4x} position={[0, -60]} fontSize={64} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'✗'} opacity={0} />
        <Txt ref={g4tag} position={[0, 110]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'这个词来自电子学'} opacity={0} />
      </Node>
      <Node ref={g5} opacity={0}>
        <Rect position={[-320, -60]} width={360} height={200} radius={16} fill={T.card} stroke={T.blue} lineWidth={2}>
          <Txt position={[0, -50]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'电路 A · 输出'} />
          <Txt position={[0, 30]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'输出阻抗'} />
        </Rect>
        <Rect position={[320, -60]} width={360} height={200} radius={16} fill={T.card} stroke={T.blue} lineWidth={2}>
          <Txt position={[0, -50]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'电路 B · 输入'} />
          <Txt position={[0, 30]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'输入阻抗'} />
        </Rect>
        <Txt position={[0, -60]} fontSize={64} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'✗'} />
        <Circle ref={g5dot} position={[-140, -60]} width={28} height={28} fill={T.yellow} />
        <Txt position={[-320, 140]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'功率'} />
        <Rect position={[-500, 190]} offset={[-1, 0]} width={360} height={26} radius={13} fill={T.card} stroke={T.line} lineWidth={2} />
        <Rect ref={g5power} position={[-500, 190]} offset={[-1, 0]} width={360} height={26} radius={13} fill={T.green} />
      </Node>

      {/* b6/b7：ORM 薄层盖住翻译带，缝还在 */}
      <Node ref={g6} opacity={0}>
        <Rect position={[0, -60]} width={220} height={320} radius={12} fill={T.card} stroke={T.yellow} lineWidth={2} opacity={0.9} />
        <Txt position={[0, 155]} fontSize={SIZE.label} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'翻译层'} />
        <Rect ref={g6orm} position={[0, -60]} width={260} height={340} radius={12} fill={T.purple} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.bg} fontFamily={FONT.sans} text={'ORM'} />
        </Rect>
        {[0, 1, 2].map(i => (
          <Rect key={`g6c-${i}`} ref={g6code[i]} position={[-420, -140 + i * 80]} width={220} height={34} radius={8} fill={T.line} />
        ))}
        <Txt position={[-310, 90]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'翻译的样板代码'} />
      </Node>
      <Node ref={g7} opacity={0}>
        <Rect position={[0, -60]} width={220} height={320} radius={12} fill={T.card} stroke={T.yellow} lineWidth={2} opacity={0.9} />
        <Txt position={[0, 155]} fontSize={SIZE.label} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'翻译层'} />
        <Rect ref={g7orm} position={[0, -60]} width={260} height={340} radius={12} fill={T.purple} opacity={0.9}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.bg} fontFamily={FONT.sans} text={'ORM'} />
        </Rect>
        <Rect ref={g7gap} position={[0, 130]} width={260} height={10} radius={5} fill={T.red} opacity={0} />
        <Txt ref={g7gapLab} position={[0, 190]} fontSize={SIZE.label} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'缝还在'} opacity={0} />
      </Node>

      {/* b8：档案卡 */}
      <Node ref={g8} opacity={0}>
        <Rect ref={g8card} position={[0, -40]} width={640} height={420} radius={20} fill={T.card} stroke={T.line} lineWidth={2}>
          <Rect position={[-220, -130]} width={120} height={120} radius={12} fill={T.line} />
          <Txt position={[-220, -130]} fontSize={SIZE.label} fill={T.bg} fontFamily={FONT.sans} text={'照片'} />
          <Txt position={[60, -150]} fontSize={SIZE.title} fontWeight={700} fill={T.white} fontFamily={FONT.serif} text={'Bill Gates'} />
          <Txt position={[60, -90]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'Greater Seattle Area | Philanthropy'} />
        </Rect>
        <Txt ref={g8lines[0]} position={[0, 60]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'Co-chair, Bill & Melinda Gates Foundation'} opacity={0} />
        <Txt ref={g8lines[1]} position={[0, 100]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'Co-founder, Chairman, Microsoft'} opacity={0} />
        <Txt ref={g8lines[2]} position={[0, 140]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'Harvard University, 1973 – 1975'} opacity={0} />
        <Rect ref={g8chip} position={[0, -40]} width={640} height={420} radius={20} stroke={T.yellow} lineWidth={0} opacity={0} />
        <Txt ref={g8chipLab} position={[0, -275]} fontSize={SIZE.body} fontWeight={700} fill={T.yellow} fontFamily={FONT.mono} text={'user_id 251'} opacity={0} />
      </Node>

      {/* b9：名字进 users 表 */}
      <Node ref={g9} opacity={0}>
        <Rect ref={g9name} position={[-380, -60]} width={280} height={100} radius={14} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'Bill Gates'} />
        </Rect>
        <Node ref={g9table} opacity={0}>
          <Rect position={[220, -60]} width={560} height={150} radius={14} fill={T.card} stroke={T.line} lineWidth={2} />
          <Txt position={[220, -110]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.mono} text={'users'} />
          <Txt position={[20, -60]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.mono} text={'user_id'} />
          <Txt position={[220, -60]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.mono} text={'first_name'} />
          <Txt position={[400, -60]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.mono} text={'last_name'} />
          <Txt position={[20, -10]} fontSize={SIZE.body} fill={T.yellow} fontFamily={FONT.mono} text={'251'} />
          <Txt position={[220, -10]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.mono} text={'Bill'} />
          <Txt position={[400, -10]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.mono} text={'Gates'} />
          <Rect ref={g9bill} position={[220, -10]} width={170} height={64} radius={10} stroke={T.yellow} lineWidth={3} opacity={0} />
        </Node>
      </Node>

      {/* b10：一对多分叉 */}
      <Node ref={g10} opacity={0}>
        <Rect ref={g10user} position={[-420, -40]} width={220} height={110} radius={16} fill={T.card} stroke={T.blue} lineWidth={3}>
          <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'用户'} />
        </Rect>
        <Circle ref={g10fork} position={[-260, -40]} width={20} height={20} fill={T.yellow} opacity={0} />
        {[0, 1, 2].map(i => (
          <Node key={`g10b-${i}`} ref={g10branches[i]} opacity={0}>
            <Line points={[[-260, -40], [60, -180 + i * 140]]} stroke={T.blue} lineWidth={3} />
            <Rect position={[200, -180 + i * 140]} width={280} height={90} radius={14} fill={T.card} stroke={T.blue} lineWidth={2}>
              <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={['工作 · 多份', '教育 · 几段', '联系方式 · 多个'][i]} />
            </Rect>
          </Node>
        ))}
        <Txt ref={g10lab} position={[200, 200]} fontSize={SIZE.title} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'一对多'} opacity={0} />
      </Node>

      {/* b11：拆成表，外键指回 */}
      <Node ref={g11} opacity={0}>
        <Node ref={g11users} opacity={0}>
          <Rect position={[-380, -160]} width={300} height={120} radius={14} fill={T.card} stroke={T.blue} lineWidth={2}>
            <Txt position={[0, -30]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.mono} text={'users'} />
            <Txt fontSize={SIZE.body} fill={T.yellow} fontFamily={FONT.mono} text={'251 · Bill Gates'} />
          </Rect>
        </Node>
        {[0, 1, 2].map(i => (
          <Node key={`g11t-${i}`} ref={g11tables[i]} opacity={0}>
            <Rect position={[300, -180 + i * 150]} width={340} height={110} radius={14} fill={T.card} stroke={T.green} lineWidth={2}>
              <Txt position={[0, -25]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.mono} text={['positions', 'education', 'contact_info'][i]} />
              <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={['两份工作', '两段教育', '博客 · 推特'][i]} />
            </Rect>
          </Node>
        ))}
        {[0, 1, 2].map(i => (
          <Line key={`g11f-${i}`} ref={g11fks[i]} points={[[-230, -160], [130, -180 + i * 150]]} stroke={T.yellow} lineWidth={2} opacity={0} />
        ))}
        <Txt ref={g11tag} position={[0, 235]} fontSize={SIZE.min} fill={T.muted} fontFamily={FONT.sans} text={'传统做法 · SQL:1999 之前'} opacity={0} />
      </Node>
    </>
  );

  say('六张表？一个文档？');
  yield* beat('b1',
    all(g1().opacity(1, 0.5)),
    at('六张表', all(...g1tables.map(t => t().opacity(1, 0.4)))),
    at('一个文档', g1doc().opacity(1, 0.5)),
    at('哪个更像它', g1q().opacity(1, 0.4)),
  );

  say('代码里是对象');
  yield* beat('b2',
    all(g1().opacity(0, 0.5), g2().opacity(1, 0.5)),
    at('面向对象', g2center().opacity(1, 0.5)),
    at('一层套一层', chain(g2branches[0]().opacity(1, 0.5), g2branches[1]().opacity(1, 0.5), g2branches[2]().opacity(1, 0.5))),
  );

  say('对象 ≠ 表，中间要翻译');
  yield* beat('b3',
    all(g2().opacity(0, 0.5), g3().opacity(1, 0.5)),
    at('关系表', g3tables().opacity(1, 0.6)),
    at('别扭的翻译', all(g3band().opacity(1, 0.6), g3bandLab().opacity(1, 0.4))),
  );

  say('阻抗失配');
  yield* beat('b4',
    all(g3().opacity(0, 0.5), g4().opacity(1, 0.5)),
    at('阻抗失配', g4x().opacity(1, 0.4)),
    at('电子学', g4tag().opacity(1, 0.5)),
  );

  say('功率传不过去');
  yield* beat('b5',
    all(g4().opacity(0, 0.5), g5().opacity(1, 0.5)),
    at('功率传不过去', g5power().width(120, 1.2)),
    at('反射', chain(g5dot().position([0, -60], 0.6), g5dot().position([-140, -60], 0.6))),
  );

  say('ORM 帮你翻译');
  yield* beat('b6',
    all(g5().opacity(0, 0.5), g6().opacity(1, 0.5)),
    at('ORM', g6orm().opacity(0.9, 0.6)),
    at('样板代码', all(...g6code.map(c => c().opacity(0.15, 0.6)))),
  );

  say('缝还在');
  yield* beat('b7',
    all(g6().opacity(0, 0.5), g7().opacity(1, 0.5)),
    at('盖不住', all(g7orm().position([0, -140], 0.8), g7orm().opacity(0.45, 0.8))),
    at('缝还在', all(g7gap().opacity(1, 0.4), g7gapLab().opacity(1, 0.4))),
  );

  say('user_id 251');
  yield* beat('b8',
    all(g7().opacity(0, 0.5), g8().opacity(1, 0.5)),
    chain(waitFor(2), g8lines[0]().opacity(1, 0.5), waitFor(2), g8lines[1]().opacity(1, 0.5), waitFor(1.5), g8lines[2]().opacity(1, 0.5)),
    at('只认一个编号', all(g8chip().opacity(1, 0.5), g8chipLab().opacity(1, 0.5))),
    at('251', g8chip().lineWidth(4, 0.4)),
  );

  say('名字只出现一次');
  yield* beat('b9',
    all(g8().opacity(0, 0.5), g9().opacity(1, 0.5)),
    at('只出现一次', g9name().opacity(1, 0.5)),
    at('users 表', chain(g9table().opacity(1, 0.5), g9name().opacity(0, 0.5), g9bill().opacity(1, 0.5))),
  );

  say('一对多');
  yield* beat('b10',
    all(g9().opacity(0, 0.5), g10().opacity(1, 0.5)),
    at('不止一份工作', chain(g10fork().opacity(1, 0.3), g10branches[0]().opacity(1, 0.6), g10branches[1]().opacity(1, 0.6), g10branches[2]().opacity(1, 0.6))),
    at('一对多', g10lab().opacity(1, 0.5)),
  );

  say('拆成表，外键指回');
  yield* beat('b11',
    all(g10().opacity(0, 0.5), g11().opacity(1, 0.5)),
    at('规范化', chain(g11users().opacity(1, 0.5), g11tables[0]().opacity(1, 0.5), g11tables[1]().opacity(1, 0.5), g11tables[2]().opacity(1, 0.5), g11tag().opacity(1, 0.4))),
    at('外键指回', all(...g11fks.map(f => f().opacity(1, 0.5)))),
  );
});
