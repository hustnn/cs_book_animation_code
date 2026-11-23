// U7 场景 2（MC）：b18a–b30 —— 纯函数限制、随便搬随便重跑、
// 分布式不是专利、聚合管道第三种写法、重新发明 SQL、回扣。
// 分镜：skill-ch02/beats-u7.md U7 一节；原文：DDIA §2.9（书页 p46–48）。
// 时长全部来自 timeline/u7.json（beat() 驱动），不手写 waitFor。
// 颜色、字号、安全区一律取自 lib/theme，不手写十六进制色值。
import {Circle, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, chain, createRef} from '@motion-canvas/core';
import {at, makeBeats} from '../../lib/beats';
import {FONT, SAFE, SIZE, T} from '../../lib/theme';
import timeline from '../../timeline/u7.json';

export default makeScene2D(function* (view) {
  view.fill(T.bg);
  const beat = makeBeats(timeline);

  const header = createRef<Txt>();
  const anchor = createRef<Txt>();
  const say = (text: string) => anchor().text(text);

  const g18 = createRef<Node>();
  const g18map = createRef<Rect>();
  const g18red = createRef<Rect>();
  const g18stamp = createRef<Txt>();
  const g18in = createRef<Txt>();
  const g18x1 = createRef<Txt>();
  const g18x2 = createRef<Txt>();
  const g19 = createRef<Node>();
  const g19ban1 = createRef<Txt>();
  const g19ban2 = createRef<Txt>();
  const g20 = createRef<Node>();
  const g20blocks = [0, 1, 2].map(() => createRef<Rect>());
  const g20bad = createRef<Rect>();
  const g20tag = createRef<Txt>();
  const g21 = createRef<Node>();
  const g21low = createRef<Txt>();
  const g21cluster = createRef<Node>();
  const g22 = createRef<Node>();
  const g22sql = createRef<Rect>();
  const g22ops = [0, 1, 2].map(() => createRef<Rect>());
  const g22alt = createRef<Node>();
  const g22single = createRef<Rect>();
  const g23 = createRef<Node>();
  const g23js = createRef<Rect>();
  const g23sql = createRef<Rect>();
  const g24 = createRef<Node>();
  const g24f1 = createRef<Rect>();
  const g24f2 = createRef<Rect>();
  const g24knot = createRef<Txt>();
  const g24one = createRef<Rect>();
  const g25 = createRef<Node>();
  const g25gear = createRef<Circle>();
  const g25bar = createRef<Rect>();
  const g25barFill = createRef<Rect>();
  const g26 = createRef<Node>();
  const g26match = createRef<Rect>();
  const g26group = createRef<Rect>();
  const g27 = createRef<Node>();
  const g27sql = createRef<Rect>();
  const g27json = createRef<Rect>();
  const g27eq = createRef<Txt>();
  const g27taste = createRef<Txt>();
  const g28 = createRef<Node>();
  const g28bottle = createRef<Rect>();
  const g28label = createRef<Txt>();
  const g28mask = createRef<Rect>();
  const g29 = createRef<Node>();
  const g29cards = [0, 1, 2].map(() => createRef<Rect>());
  const g29seven = createRef<Txt>();
  const g30 = createRef<Node>();
  const g30a = createRef<Rect>();
  const g30b = createRef<Rect>();
  const g30q = createRef<Txt>();

  view.add(
    <>
      <Txt
        ref={header}
        position={[-SAFE.halfW, -SAFE.halfH]}
        offset={[-1, -1]}
        fontSize={SIZE.label}
        fill={T.muted}
        fontFamily={FONT.sans}
        text={'MapReduce'}
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

      {/* b18a/b18b：纯函数，只留一个输入口 */}
      <Node ref={g18} opacity={0}>
        <Rect ref={g18map} position={[-220, -40]} width={300} height={150} radius={14} fill={T.card} stroke={T.green} lineWidth={2}>
          <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.mono} text={'map'} />
        </Rect>
        <Rect ref={g18red} position={[220, -40]} width={300} height={150} radius={14} fill={T.card} stroke={T.purple} lineWidth={2}>
          <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.mono} text={'reduce'} />
        </Rect>
        <Txt ref={g18stamp} position={[0, -200]} fontSize={SIZE.title} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'纯函数'} opacity={0} />
        <Txt ref={g18in} position={[0, 100]} fontSize={SIZE.label} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'输入 → 只用传进来的数据'} opacity={0} />
        <Txt ref={g18x1} position={[-220, 170]} fontSize={SIZE.label} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'✗ 别的口'} opacity={0} />
        <Txt ref={g18x2} position={[220, 170]} fontSize={SIZE.label} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'✗ 别的口'} opacity={0} />
      </Node>

      {/* b19：两条禁令 */}
      <Node ref={g19} opacity={0}>
        <Rect position={[-280, -40]} width={420} height={180} radius={16} fill={T.card} stroke={T.red} lineWidth={2}>
          <Txt position={[0, -30]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'额外查库'} />
          <Txt ref={g19ban1} position={[0, 40]} fontSize={64} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'✗'} opacity={0} />
        </Rect>
        <Rect position={[280, -40]} width={420} height={180} radius={16} fill={T.card} stroke={T.red} lineWidth={2}>
          <Txt position={[0, -30]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'副作用'} />
          <Txt ref={g19ban2} position={[0, 40]} fontSize={64} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'✗'} opacity={0} />
        </Rect>
        <Txt position={[0, 130]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'不改库里的数据，不碰外面的世界'} />
      </Node>

      {/* b20：随便搬，随便重跑 */}
      <Node ref={g20} opacity={0}>
        {[0, 1, 2].map(i => (
          <Rect key={`g20b-${i}`} ref={g20blocks[i]} position={[-360 + i * 360, -60]} width={280} height={160} radius={14} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={['map · 机器 1', 'map · 机器 2', 'map · 机器 3'][i]} />
          </Rect>
        ))}
        <Rect ref={g20bad} position={[0, -60]} width={280} height={160} radius={14} fill={T.card} stroke={T.red} lineWidth={3} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'机器 2 失败了'} />
        </Rect>
        <Txt ref={g20tag} position={[0, 140]} fontSize={SIZE.title} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'重跑一遍就行'} opacity={0} />
      </Node>

      {/* b21：底层的分布式模型 */}
      <Node ref={g21} opacity={0}>
        <Line points={[[-500, 100], [500, 100]]} stroke={T.line} lineWidth={3} />
        <Txt position={[-460, 160]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'底层'} />
        <Txt position={[460, 160]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'高级'} />
        <Txt ref={g21low} position={[-320, -40]} fontSize={SIZE.title} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'MapReduce'} opacity={0} />
        <Node ref={g21cluster} opacity={0}>
          {[0, 1, 2].map(i => (
            <Rect key={`g21c-${i}`} position={[240 + i * 130, -40]} width={110} height={110} radius={12} fill={T.card} stroke={T.blue} lineWidth={2}>
              <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'机'} />
            </Rect>
          ))}
          <Txt position={[370, 60]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'机器集群'} />
        </Node>
      </Node>

      {/* b22a/b22b/b22c：SQL 也能分布式 */}
      <Node ref={g22} opacity={0}>
        <Rect ref={g22sql} position={[0, -160]} width={420} height={110} radius={14} fill={T.card} stroke={T.blue} lineWidth={2}>
          <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.mono} text={'SQL'} />
        </Rect>
        {[0, 1, 2].map(i => (
          <Rect key={`g22o-${i}`} ref={g22ops[i]} position={[-360 + i * 360, -20]} width={280} height={90} radius={12} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={['操作 1', '操作 2', '操作 3'][i]} />
          </Rect>
        ))}
        <Node ref={g22alt} opacity={0}>
          <Line points={[[-500, 130], [500, 130]]} stroke={T.green} lineWidth={3} />
          <Txt position={[0, 190]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} text={'另一条路：直通机器集群'} />
        </Node>
        <Rect ref={g22single} position={[-420, 130]} width={180} height={80} radius={12} fill={T.card} stroke={T.line} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'单机'} />
        </Rect>
      </Node>

      {/* b23a/b23b：代码标签从 MapReduce 飘到 SQL */}
      <Node ref={g23} opacity={0}>
        <Rect position={[-300, -60]} width={360} height={180} radius={16} fill={T.card} stroke={T.purple} lineWidth={2}>
          <Txt position={[0, -40]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'MapReduce'} />
        </Rect>
        <Rect ref={g23sql} position={[300, -60]} width={360} height={180} radius={16} fill={T.card} stroke={T.blue} lineWidth={2}>
          <Txt position={[0, -40]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.mono} text={'SQL'} />
        </Rect>
        <Rect ref={g23js} position={[-300, 60]} width={280} height={80} radius={12} fill={T.card} stroke={T.yellow} lineWidth={2}>
          <Txt fontSize={SIZE.label} fontWeight={700} fill={T.yellow} fontFamily={FONT.mono} text={'JavaScript'} />
        </Rect>
      </Node>

      {/* b24：两个函数 vs 一个查询 */}
      <Node ref={g24} opacity={0}>
        <Rect ref={g24f1} position={[-360, -80]} width={300} height={140} radius={14} fill={T.card} stroke={T.yellow} lineWidth={2}>
          <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.mono} text={'map'} />
        </Rect>
        <Rect ref={g24f2} position={[-360, 100]} width={300} height={140} radius={14} fill={T.card} stroke={T.yellow} lineWidth={2}>
          <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.mono} text={'reduce'} />
        </Rect>
        <Txt ref={g24knot} position={[-180, 10]} fontSize={48} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'✗'} opacity={0} />
        <Rect ref={g24one} position={[280, 0]} width={380} height={220} radius={16} fill={T.card} stroke={T.green} lineWidth={3}>
          <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'一个查询'} />
          <Txt position={[0, 50]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} text={'一句话就够了'} />
        </Rect>
      </Node>

      {/* b25：优化器更能发挥 */}
      <Node ref={g25} opacity={0}>
        <Circle ref={g25gear} position={[-320, -60]} width={170} height={170} fill={T.card} stroke={T.yellow} lineWidth={3}>
          <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'优化器'} />
        </Circle>
        <Rect ref={g25bar} position={[180, -60]} width={480} height={60} radius={10} fill={T.card} stroke={T.line} lineWidth={2}>
          <Rect ref={g25barFill} position={[-210, 0]} width={60} height={44} radius={8} fill={T.green} />
        </Rect>
        <Txt position={[180, 20]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'性能'} />
      </Node>

      {/* b26：聚合管道两段 */}
      <Node ref={g26} opacity={0}>
        <Rect ref={g26match} position={[-280, -40]} width={400} height={220} radius={16} fill={T.card} stroke={T.green} lineWidth={2}>
          <Txt position={[0, -60]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.mono} text={'$match'} />
          <Txt position={[0, 20]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.mono} text={'{ family: "Sharks" }'} />
        </Rect>
        <Rect ref={g26group} position={[280, -40]} width={400} height={220} radius={16} fill={T.card} stroke={T.blue} lineWidth={2}>
          <Txt position={[0, -60]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.mono} text={'$group'} />
          <Txt position={[0, 20]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.mono} text={'按年月分组 · 求和'} />
        </Rect>
        <Txt position={[0, 130]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'MongoDB 2.2 · 聚合管道'} />
      </Node>

      {/* b27：SQL vs JSON，表达力差不多 */}
      <Node ref={g27} opacity={0}>
        <Rect ref={g27sql} position={[-320, -40]} width={420} height={220} radius={16} fill={T.card} stroke={T.blue} lineWidth={2}>
          <Txt position={[0, -60]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'SQL'} />
          <Txt position={[0, 10]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'英语句子式语法'} />
        </Rect>
        <Txt ref={g27eq} position={[0, -40]} fontSize={64} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'='} opacity={0} />
        <Rect ref={g27json} position={[320, -40]} width={420} height={220} radius={16} fill={T.card} stroke={T.green} lineWidth={2}>
          <Txt position={[0, -60]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'JSON'} />
          <Txt position={[0, 10]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'JSON 语法'} />
        </Rect>
        <Txt ref={g27taste} position={[0, 140]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'差别也许只是品味问题'} opacity={0} />
      </Node>

      {/* b28a/b28b：新瓶装旧 SQL，面具滑落 */}
      <Node ref={g28} opacity={0}>
        <Rect ref={g28bottle} position={[0, -40]} width={420} height={300} radius={20} fill={T.card} stroke={T.green} lineWidth={3}>
          <Txt ref={g28label} position={[0, -60]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.mono} text={'SQL'} opacity={0} />
          <Txt position={[0, 40]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'新瓶子'} />
        </Rect>
        <Rect ref={g28mask} position={[0, -160]} width={460} height={110} radius={16} fill={T.purple} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.white} fontFamily={FONT.sans} text={'NoSQL 新面具'} />
        </Rect>
      </Node>

      {/* b29：三种写法汇聚到 7 */}
      <Node ref={g29} opacity={0}>
        {[0, 1, 2].map(i => (
          <Rect key={`g29c-${i}`} ref={g29cards[i]} position={[-380 + i * 380, -120]} width={320} height={130} radius={14} fill={T.card} stroke={T.line} lineWidth={2} opacity={0}>
            <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={['SQL 一句', 'MapReduce 两个函数', '聚合管道两段'][i]} />
          </Rect>
        ))}
        <Txt ref={g29seven} position={[0, 110]} fontSize={96} fontWeight={700} fill={T.green} fontFamily={FONT.mono} text={'7'} opacity={0} />
        <Txt position={[0, 210]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'同一个答案'} />
      </Node>

      {/* b30：只说要什么 vs 写两段代码 */}
      <Node ref={g30} opacity={0}>
        <Rect ref={g30a} position={[-300, -40]} width={420} height={200} radius={16} fill={T.card} stroke={T.green} lineWidth={3}>
          <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'只说要什么'} />
        </Rect>
        <Rect ref={g30b} position={[300, -40]} width={420} height={200} radius={16} fill={T.card} stroke={T.blue} lineWidth={2}>
          <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'写两段代码告诉怎么做'} />
        </Rect>
        <Txt ref={g30q} position={[0, -40]} fontSize={72} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'?'} opacity={0} />
      </Node>
    </>
  );

  say('必须是纯函数');
  yield* beat('b18a',
    all(g18().opacity(1, 0.5)),
    at('纯函数', g18stamp().opacity(1, 0.5)),
  );

  say('只用传进来的数据');
  yield* beat('b18b',
    all(g18in().opacity(1, 0.4), g18x1().opacity(1, 0.4), g18x2().opacity(1, 0.4)),
  );

  say('不能查库，不能改库');
  yield* beat('b19',
    all(g18().opacity(0, 0.5), g19().opacity(1, 0.5)),
    at('额外的数据库查询', g19ban1().opacity(1, 0.4)),
    at('副作用', g19ban2().opacity(1, 0.4)),
  );

  say('随便搬，随便重跑');
  yield* beat('b20',
    all(g19().opacity(0, 0.5), g20().opacity(1, 0.5)),
    at('任何地方', chain(g20blocks[0]().opacity(1, 0.3), g20blocks[1]().opacity(1, 0.3), g20blocks[2]().opacity(1, 0.3))),
    at('失败了重跑', chain(g20bad().opacity(1, 0.4), g20bad().opacity(0, 0.5), g20tag().opacity(1, 0.5))),
  );

  say('底层的分布式模型');
  yield* beat('b21',
    all(g20().opacity(0, 0.5), g21().opacity(1, 0.5)),
    at('相当底层', g21low().opacity(1, 0.5)),
    at('机器集群', g21cluster().opacity(1, 0.5)),
  );

  say('高级语言也能分布式');
  yield* beat('b22a',
    all(g21().opacity(0, 0.5), g22().opacity(1, 0.5)),
    at('一串这样的操作', chain(g22ops[0]().opacity(1, 0.3), g22ops[1]().opacity(1, 0.3), g22ops[2]().opacity(1, 0.3))),
  );

  say('不用它也能分布式');
  yield* beat('b22b',
    all(g22alt().opacity(1, 0.5)),
  );

  say('不限于单机');
  yield* beat('b22c',
    all(g22single().opacity(1, 0.5)),
  );

  say('查询中间能写代码');
  yield* beat('b23a',
    all(g22().opacity(0, 0.5), g23().opacity(1, 0.5)),
    at('查询中间写代码', g23js().position([-300, -200], 0.6)),
  );

  say('不只它有这功能');
  yield* beat('b23b',
    all(g23js().position([300, 60], 0.6)),
  );

  say('两个函数，一个查询');
  yield* beat('b24',
    all(g23().opacity(0, 0.5), g24().opacity(1, 0.5)),
    at('精心协调', g24knot().opacity(1, 0.4)),
    at('单个查询', g24one().stroke(T.green, 0.4)),
  );

  say('优化器更能发挥');
  yield* beat('b25',
    all(g24().opacity(0, 0.5), g25().opacity(1, 0.5)),
    at('优化器', g25gear().lineWidth(5, 0.3)),
    at('改进性能', all(g25barFill().width(420, 1.2), g25barFill().position([-30, 0], 1.2))),
  );

  say('第三种写法');
  yield* beat('b26',
    all(g25().opacity(0, 0.5), g26().opacity(1, 0.5)),
    at('先 match 鲨鱼', g26match().stroke(T.yellow, 0.4)),
    at('再 group', g26group().stroke(T.yellow, 0.4)),
  );

  say('表达力差不多');
  yield* beat('b27',
    all(g26().opacity(0, 0.5), g27().opacity(1, 0.5)),
    at('表达力', g27eq().opacity(1, 0.4)),
    at('SQL 的一个子集', g27sql().stroke(T.yellow, 0.4)),
    at('JSON 语法', g27json().stroke(T.yellow, 0.4)),
    at('英语句子式', g27sql().stroke(T.blue, 0.4)),
    at('品味问题', g27taste().opacity(1, 0.4)),
  );

  say('重新发明了 SQL');
  yield* beat('b28a',
    all(g27().opacity(0, 0.5), g28().opacity(1, 0.5)),
    at('重新发明了一遍', chain(g28mask().opacity(1, 0.4), g28label().opacity(1, 0.4))),
  );

  say('换了个伪装');
  yield* beat('b28b',
    all(g28mask().position([0, -320], 0.6), g28mask().opacity(0, 0.4)),
  );

  say('三种写法，同一个答案');
  yield* beat('b29',
    all(g28().opacity(0, 0.5), g29().opacity(1, 0.5)),
    at('SQL 一句', g29cards[0]().opacity(1, 0.3)),
    at('MapReduce 两个函数', g29cards[1]().opacity(1, 0.3)),
    at('聚合管道两段', g29cards[2]().opacity(1, 0.3)),
    at('殊途同归', g29seven().opacity(1, 0.5)),
  );

  say('你的查询像哪一种？');
  yield* beat('b30',
    all(g29().opacity(0, 0.5), g30().opacity(1, 0.5)),
    at('只说要什么', g30a().stroke(T.green, 0.4)),
    at('写两段代码', g30b().stroke(T.blue, 0.4)),
    at('怎么做', g30q().opacity(1, 0.4)),
  );
});
