// U15 场景 3（MC）：b21a–b34 —— 瓶颈对照、分析三招、选型三问、收束。
// 分镜：skill-ch03/beats-u15.md；原文：DDIA §3.15（书页 p103–104，PDF p125–126）。
// 时长全部来自 timeline/u15.json（beat() 驱动），不手写 waitFor。
import {Circle, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, chain, createRef} from '@motion-canvas/core';
import {at, makeBeats} from '../../lib/beats';
import {FONT, SAFE, SIZE, T} from '../../lib/theme';
import timeline from '../../timeline/u15.json';

export default makeScene2D(function* (view) {
  view.fill(T.bg);
  const beat = makeBeats(timeline);

  const header = createRef<Txt>();
  const anchor = createRef<Txt>();
  const say = (text: string) => anchor().text(text);

  // b21a/b21b：事务瓶颈是寻道
  const g21 = createRef<Node>();
  const g21card = createRef<Rect>();
  const g21recs = [0, 1, 2].map(() => createRef<Rect>());
  const g21line = createRef<Line>();
  const g21head = createRef<Rect>();
  const g21seek = createRef<Txt>();

  // b22a/b22c/b22b：分析瓶颈是带宽
  const g22 = createRef<Node>();
  const g22card = createRef<Rect>();
  const g22dots = Array.from({length: 12}, () => createRef<Circle>());
  const g22barBg = createRef<Rect>();
  const g22barFill = createRef<Rect>();
  const g22barLab = createRef<Txt>();
  const g22seek = createRef<Txt>();

  // b23：更复杂的索引结构，内存数据库
  const g23 = createRef<Node>();
  const g23idx = createRef<Rect>();
  const g23mem = createRef<Rect>();

  // b24：扫大量行，索引次要
  const g24 = createRef<Node>();
  const g24idx = createRef<Rect>();
  const g24dots = Array.from({length: 24}, () => createRef<Circle>());
  const g24scan = createRef<Rect>();

  // b25：编得紧，读得少
  const g25 = createRef<Node>();
  const g25block = createRef<Rect>();
  const g25readBg = createRef<Rect>();
  const g25readFill = createRef<Rect>();
  const g25col = createRef<Rect>();

  // b26：分析三招
  const g26 = createRef<Node>();
  const g26cards = [0, 1, 2].map(() => createRef<Rect>());
  const g26tag = createRef<Txt>();

  // b27：第一问
  const g27 = createRef<Node>();
  const g27q = createRef<Rect>();
  const g27oltp = createRef<Rect>();
  const g27olap = createRef<Rect>();

  // b28：第二问、第三问
  const g28 = createRef<Node>();
  const g28q2 = createRef<Rect>();
  const g28q3 = createRef<Rect>();
  const g28log = createRef<Rect>();
  const g28btree = createRef<Rect>();

  // b29：排好序才接得住
  const g29 = createRef<Node>();
  const g29sort = createRef<Rect>();
  const g29hash = createRef<Rect>();
  const g29qs = [0, 1, 2].map(() => createRef<Rect>());

  // b30：调参数
  const g30 = createRef<Node>();
  const g30tools = [0, 1, 2].map(() => createRef<Rect>());
  const g30slider = createRef<Rect>();
  const g30knob = createRef<Circle>();

  // b31：不是调优专家
  const g31 = createRef<Node>();
  const g31card = createRef<Rect>();
  const g31x1 = createRef<Line>();
  const g31x2 = createRef<Line>();

  // b32：词汇与想法，看懂文档
  const g32 = createRef<Node>();
  const g32vocab = createRef<Rect>();
  const g32idea = createRef<Rect>();
  const g32doc = createRef<Rect>();

  // b33：参考文献
  const g33 = createRef<Node>();
  const g33card = createRef<Rect>();

  // b34：收束
  const g34 = createRef<Node>();
  const g34forkL = createRef<Line>();
  const g34forkR = createRef<Line>();
  const g34close = createRef<Txt>();
  const g34qs = [0, 1, 2].map(() => createRef<Rect>());

  const D24_X = (i: number) => -280 + (i % 6) * 112;
  const D24_Y = (i: number) => -150 + Math.floor(i / 6) * 70;
  const D12_X = (i: number) => -275 + (i % 6) * 110;
  const D12_Y = (i: number) => -60 + Math.floor(i / 6) * 70;

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

      {/* b21 */}
      <Node ref={g21} opacity={0}>
        <Rect ref={g21card} position={[-300, -120]} width={440} height={130} radius={16} fill={T.card} stroke={T.blue} lineWidth={3}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'事务处理'} />
        </Rect>
        {[0, 1, 2].map(i => (
          <Rect
            key={`g21r-${i}`}
            ref={g21recs[i]}
            position={[-320 + i * 320, 20]}
            width={260}
            height={56}
            radius={10}
            fill={T.card}
            stroke={T.line}
            lineWidth={2}
            opacity={0}
          >
            <Txt fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={['记录 1', '记录 2', '记录 3'][i]} />
          </Rect>
        ))}
        <Line ref={g21line} points={[[-500, 130], [500, 130]]} stroke={T.line} lineWidth={3} opacity={0} />
        <Rect ref={g21head} position={[-400, 130]} width={64} height={30} radius={6} fill={T.red} opacity={0} />
        <Txt ref={g21seek} position={[0, 190]} fontSize={SIZE.body} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'寻道'} opacity={0} />
      </Node>

      {/* b22 */}
      <Node ref={g22} opacity={0}>
        <Rect ref={g22card} position={[0, -190]} width={500} height={100} radius={16} fill={T.card} stroke={T.green} lineWidth={3}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'分析'} />
        </Rect>
        {g22dots.map((r, i) => (
          <Circle key={`g22d-${i}`} ref={r} position={[D12_X(i), D12_Y(i)]} width={16} height={16} fill={T.muted} opacity={0} />
        ))}
        <Rect ref={g22barBg} position={[0, 130]} width={800} height={46} radius={10} fill={T.card} stroke={T.line} lineWidth={2} opacity={0} />
        <Rect ref={g22barFill} position={[-400, 130]} width={0} height={46} radius={10} fill={T.green} offset={[-1, 0]} opacity={0} />
        <Txt ref={g22barLab} position={[0, 70]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} text={'磁盘带宽'} opacity={0} />
        <Txt ref={g22seek} position={[0, 200]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'寻道反而不重要了'} opacity={0} />
      </Node>

      {/* b23 */}
      <Node ref={g23} opacity={0}>
        <Rect ref={g23idx} position={[-300, -60]} width={440} height={130} radius={16} fill={T.card} stroke={T.blue} lineWidth={3}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'更复杂的索引结构'} />
        </Rect>
        <Rect ref={g23mem} position={[300, -60]} width={440} height={130} radius={16} fill={T.card} stroke={T.green} lineWidth={3}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'内存数据库'} />
        </Rect>
      </Node>

      {/* b24 */}
      <Node ref={g24} opacity={0}>
        <Rect ref={g24idx} position={[0, -230]} width={300} height={64} radius={12} fill={T.card} stroke={T.yellow} lineWidth={2}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'索引'} />
        </Rect>
        {g24dots.map((r, i) => (
          <Circle key={`g24d-${i}`} ref={r} position={[D24_X(i), D24_Y(i)]} width={16} height={16} fill={T.muted} opacity={0} />
        ))}
        <Rect ref={g24scan} position={[0, -160]} width={620} height={10} fill={T.yellow} opacity={0} />
      </Node>

      {/* b25 */}
      <Node ref={g25} opacity={0}>
        <Rect ref={g25block} position={[0, -140]} width={700} height={110} radius={14} fill={T.card} stroke={T.blue} lineWidth={3}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'数据'} />
        </Rect>
        <Rect ref={g25readBg} position={[0, 20]} width={800} height={40} radius={10} fill={T.card} stroke={T.line} lineWidth={2} opacity={0} />
        <Rect ref={g25readFill} position={[-400, 20]} width={800} height={40} radius={10} fill={T.blue} offset={[-1, 0]} opacity={0} />
        <Rect ref={g25col} position={[0, 130]} width={420} height={70} radius={12} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'列式存储'} />
        </Rect>
      </Node>

      {/* b26 */}
      <Node ref={g26} opacity={0}>
        {[0, 1, 2].map(i => (
          <Rect
            key={`g26c-${i}`}
            ref={g26cards[i]}
            position={[-380 + i * 380, -60]}
            width={320}
            height={130}
            radius={16}
            fill={T.card}
            stroke={T.green}
            lineWidth={3}
            opacity={0}
          >
            <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={['按列排', '压得紧', '排好序'][i]} />
          </Rect>
        ))}
        <Txt ref={g26tag} position={[0, 120]} fontSize={SIZE.body} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'都是为了少读磁盘'} opacity={0} />
      </Node>

      {/* b27 */}
      <Node ref={g27} opacity={0}>
        <Rect ref={g27q} position={[0, -140]} width={700} height={110} radius={16} fill={T.card} stroke={T.yellow} lineWidth={3}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'第一问：你的负载是事务，还是分析？'} />
        </Rect>
        <Rect ref={g27oltp} position={[-290, 60]} width={400} height={110} radius={14} fill={T.card} stroke={T.blue} lineWidth={3} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'事务'} />
        </Rect>
        <Rect ref={g27olap} position={[290, 60]} width={400} height={110} radius={14} fill={T.card} stroke={T.green} lineWidth={3} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'分析'} />
        </Rect>
      </Node>

      {/* b28 */}
      <Node ref={g28} opacity={0}>
        <Rect ref={g28q2} position={[-300, -140]} width={520} height={110} radius={16} fill={T.card} stroke={T.yellow} lineWidth={3}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'第二问：写多还是读多？'} />
        </Rect>
        <Rect ref={g28q3} position={[300, -140]} width={520} height={110} radius={16} fill={T.card} stroke={T.yellow} lineWidth={3}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'第三问：要不要范围查询？'} />
        </Rect>
        <Rect ref={g28log} position={[-290, 60]} width={380} height={100} radius={14} fill={T.card} stroke={T.blue} lineWidth={3} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'日志结构'} />
        </Rect>
        <Rect ref={g28btree} position={[290, 60]} width={380} height={100} radius={14} fill={T.card} stroke={T.green} lineWidth={3} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'B 树'} />
        </Rect>
      </Node>

      {/* b29 */}
      <Node ref={g29} opacity={0}>
        <Rect ref={g29sort} position={[0, -140]} width={500} height={110} radius={16} fill={T.card} stroke={T.green} lineWidth={3}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'排好序'} />
        </Rect>
        <Rect ref={g29hash} position={[0, 0]} width={420} height={90} radius={14} fill={T.card} stroke={T.line} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.muted} fontFamily={FONT.sans} text={'纯靠哈希，接不住'} />
        </Rect>
        {[0, 1, 2].map(i => (
          <Rect
            key={`g29q-${i}`}
            ref={g29qs[i]}
            position={[-320 + i * 320, 130]}
            width={280}
            height={60}
            radius={12}
            fill={T.card}
            stroke={T.yellow}
            lineWidth={2}
            opacity={0}
          >
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={['第一问', '第二问', '第三问'][i]} />
          </Rect>
        ))}
      </Node>

      {/* b30 */}
      <Node ref={g30} opacity={0}>
        {[0, 1, 2].map(i => (
          <Rect
            key={`g30t-${i}`}
            ref={g30tools[i]}
            position={[-380 + i * 380, -120]}
            width={320}
            height={110}
            radius={16}
            fill={T.card}
            stroke={T.blue}
            lineWidth={2}
            opacity={0}
          >
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={['日志结构引擎', 'B 树引擎', '列式存储'][i]} />
          </Rect>
        ))}
        <Rect ref={g30slider} position={[0, 60]} width={600} height={30} radius={15} fill={T.card} stroke={T.line} lineWidth={2} opacity={0} />
        <Circle ref={g30knob} position={[-200, 60]} width={44} height={44} fill={T.yellow} opacity={0} />
      </Node>

      {/* b31 */}
      <Node ref={g31} opacity={0}>
        <Rect ref={g31card} position={[0, -60]} width={520} height={140} radius={16} fill={T.card} stroke={T.line} lineWidth={3}>
          <Txt fontSize={SIZE.title} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'调优专家'} />
        </Rect>
        <Line key={'qa-ignore-打叉1'} ref={g31x1} points={[[-240, -120], [240, 0]]} stroke={T.red} lineWidth={6} opacity={0} />
        <Line key={'qa-ignore-打叉2'} ref={g31x2} points={[[-240, 0], [240, -120]]} stroke={T.red} lineWidth={6} opacity={0} />
      </Node>

      {/* b32 */}
      <Node ref={g32} opacity={0}>
        <Rect ref={g32vocab} position={[-300, -60]} width={300} height={120} radius={16} fill={T.card} stroke={T.blue} lineWidth={3} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'词汇'} />
        </Rect>
        <Rect ref={g32idea} position={[300, -60]} width={300} height={120} radius={16} fill={T.card} stroke={T.green} lineWidth={3} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'想法'} />
        </Rect>
        <Rect ref={g32doc} position={[0, 130]} width={500} height={80} radius={12} fill={T.card} stroke={T.line} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'数据库的文档'} />
        </Rect>
      </Node>

      {/* b33 */}
      <Node ref={g33} opacity={0}>
        <Rect ref={g33card} position={[0, -60]} width={560} height={160} radius={16} fill={T.card} stroke={T.purple} lineWidth={3}>
          <Txt position={[0, -40]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'参考文献'} />
          <Txt position={[0, 35]} fontSize={SIZE.title} fontWeight={700} fill={T.yellow} fontFamily={FONT.mono} text={'64'} />
        </Rect>
      </Node>

      {/* b34 */}
      <Node ref={g34} opacity={0}>
        <Line ref={g34forkL} points={[[-520, -140], [0, -60]]} stroke={T.yellow} lineWidth={3} opacity={0} />
        <Line ref={g34forkR} points={[[520, -140], [0, -60]]} stroke={T.yellow} lineWidth={3} opacity={0} />
        <Txt ref={g34close} position={[0, -160]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'没有一种引擎适合所有场景'} opacity={0} />
        {[0, 1, 2].map(i => (
          <Rect
            key={`g34q-${i}`}
            ref={g34qs[i]}
            position={[-320 + i * 320, 60]}
            width={280}
            height={60}
            radius={12}
            fill={T.card}
            stroke={T.yellow}
            lineWidth={2}
            opacity={0}
          >
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={['第一问', '第二问', '第三问'][i]} />
          </Rect>
        ))}
      </Node>
    </>
  );

  say('每次只碰少量记录');
  yield* beat('b21a',
    all(g21().opacity(1, 0.5)),
    at('只碰少量记录', chain(g21recs[0]().opacity(1, 0.3), g21recs[1]().opacity(1, 0.3), g21recs[2]().opacity(1, 0.3))),
  );

  say('瓶颈：寻道');
  yield* beat('b21b',
    at('寻道', all(g21line().opacity(1, 0.3), g21head().opacity(1, 0.3), g21head().position([400, 130], 0.9), g21seek().opacity(1, 0.3))),
  );

  say('一次扫数百万条');
  yield* beat('b22a',
    all(g21().opacity(0, 0.5), g22().opacity(1, 0.5)),
    at('数百万条记录', chain(...g22dots.map(r => r().opacity(1, 0.12)))),
  );

  say('瓶颈换成带宽');
  yield* beat('b22c',
    all(g22barBg().opacity(1, 0.4), g22barLab().opacity(1, 0.4), g22barFill().opacity(1, 0.3)),
    at('带宽', g22barFill().width(800, 0.8)),
  );

  say('寻道不重要了');
  yield* beat('b22b',
    at('寻道', g22seek().opacity(1, 0.5)),
    g22().scale(1.02, beat.dur('b22b') - 0.6),
  );

  say('更复杂索引，内存库');
  yield* beat('b23',
    all(g22().opacity(0, 0.5), g23().opacity(1, 0.5)),
    g23().scale(1.02, beat.dur('b23') - 0.6),
  );

  say('扫大量行，索引次要');
  yield* beat('b24',
    all(g23().opacity(0, 0.5), g24().opacity(1, 0.5),
      chain(
        all(...g24dots.slice(0, 12).map(r => r().opacity(1, 0.15))),
        all(...g24dots.slice(12, 24).map(r => r().opacity(1, 0.15))),
      )),
    at('索引', chain(g24idx().opacity(0.35, 0.5), g24scan().opacity(1, 0.3), g24scan().position([0, 60], 0.9))),
  );

  say('编得紧，读得少');
  yield* beat('b25',
    all(g24().opacity(0, 0.5), g25().opacity(1, 0.5)),
    at('编得非常紧凑', chain(g25block().width(300, 1.2))),
    at('读的数据尽可能少', chain(g25readBg().opacity(1, 0.4), g25readFill().opacity(1, 0.4), g25readFill().width(300, 1.2))),
    at('列式存储', g25col().opacity(1, 0.5)),
  );

  say('列存、压缩、排序');
  yield* beat('b26',
    all(g25().opacity(0, 0.5), g26().opacity(1, 0.5)),
    at('按列排', g26cards[0]().opacity(1, 0.4)),
    at('压得紧', g26cards[1]().opacity(1, 0.4)),
    at('排好序', g26cards[2]().opacity(1, 0.4)),
    at('少读磁盘', g26tag().opacity(1, 0.5)),
  );

  say('第一问：事务还是分析？');
  yield* beat('b27',
    all(g26().opacity(0, 0.5), g27().opacity(1, 0.5)),
    at('事务', g27oltp().opacity(1, 0.5)),
    at('分析', g27olap().opacity(1, 0.5)),
  );

  say('写多读多？要范围查吗？');
  yield* beat('b28',
    all(g27().opacity(0, 0.5), g28().opacity(1, 0.5)),
    at('写多', all(g28log().opacity(1, 0.5), g28q2().stroke(T.yellow, 0.4))),
    at('读多', g28btree().opacity(1, 0.5)),
    at('范围查询', g28q3().stroke(T.yellow, 0.4)),
  );

  say('排好序才接得住');
  yield* beat('b29',
    all(g28().opacity(0, 0.5), g29().opacity(1, 0.5)),
    at('排好序', g29sort().stroke(T.yellow, 0.4)),
    at('纯靠哈希', g29hash().opacity(1, 0.5)),
    at('三问问完', chain(g29qs[0]().opacity(1, 0.3), g29qs[1]().opacity(1, 0.3), g29qs[2]().opacity(1, 0.3))),
  );

  say('知道哪种工具适合');
  yield* beat('b30',
    all(g29().opacity(0, 0.5), g30().opacity(1, 0.5),
      chain(g30tools[0]().opacity(1, 0.4), g30tools[1]().opacity(1, 0.4), g30tools[2]().opacity(1, 0.4))),
    at('调参数时', chain(g30slider().opacity(1, 0.4), g30knob().opacity(1, 0.4))),
    at('调高调低', chain(g30knob().position([200, 60], 0.8), g30knob().position([-200, 60], 0.8))),
  );

  say('不是调优专家');
  yield* beat('b31',
    all(g30().opacity(0, 0.5), g31().opacity(1, 0.5)),
    at('调优', chain(g31x1().opacity(1, 0.4), g31x2().opacity(1, 0.4))),
  );

  say('词汇与想法，看懂文档');
  yield* beat('b32',
    all(g31().opacity(0, 0.5), g32().opacity(1, 0.5), g32vocab().opacity(1, 0.5), g32idea().opacity(1, 0.5)),
    at('看得懂', g32doc().opacity(1, 0.5)),
  );

  say('参考文献六十四篇');
  yield* beat('b33',
    all(g32().opacity(0, 0.5), g33().opacity(1, 0.5)),
    g33().scale(1.02, beat.dur('b33') - 0.6),
  );

  say('没有一种引擎适合所有场景');
  yield* beat('b34',
    all(g33().opacity(0, 0.5), g34().opacity(1, 0.5)),
    at('没有一种引擎适合所有场景', chain(g34close().opacity(1, 0.5), g34forkL().opacity(1, 0.5), g34forkR().opacity(1, 0.5))),
    at('该问哪几个问题', chain(g34qs[0]().opacity(1, 0.3), g34qs[1]().opacity(1, 0.3), g34qs[2]().opacity(1, 0.3))),
  );
});
