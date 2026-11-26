// U15 场景 1（MC）：b0–b7 —— b0 单元站牌（UnitTitle：第 15 站），b1 钩子、存与取、两大类、事务只碰少量记录、分析扫数百万条。
// 分镜：skill-ch03/beats-u15.md；原文：DDIA §3.15（书页 p103，PDF p125）。
// 时长全部来自 timeline/u15.json（beat() 驱动），不手写 waitFor。
import {Circle, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, chain, createRef} from '@motion-canvas/core';
import {at, makeBeats} from '../../lib/beats';
import {UnitTitle} from '../../lib/opening';
import {CHAPTER} from '../../lib/chapter';
import {FONT, SAFE, SIZE, T} from '../../lib/theme';
import timeline from '../../timeline/u15.json';

export default makeScene2D(function* (view) {
  view.fill(T.bg);
  const beat = makeBeats(timeline);

  // 单元站牌（b0）：这一站在全章的位置 + 单元标题；b1 开头收成左上角页眉。
  // 页眉与场景原有的左上角标题同一位置同一样式，旧 header 已删，改由 unit.header 承担。
  const unit = new UnitTitle(CHAPTER, 'u15');

  const anchor = createRef<Txt>();
  const say = (text: string) => anchor().text(text);

  // b1：两条路分叉
  const g1 = createRef<Node>();
  const g1left = createRef<Rect>();
  const g1right = createRef<Rect>();
  const g1forkL = createRef<Line>();
  const g1forkR = createRef<Line>();
  const g1dot = createRef<Circle>();
  const g1q = createRef<Txt>();

  // b2：存进去 / 要回来
  const g2 = createRef<Node>();
  const g2db = createRef<Rect>();
  const g2in = createRef<Line>();
  const g2inLab = createRef<Txt>();
  const g2out = createRef<Line>();
  const g2outLab = createRef<Txt>();

  // b3：两大类
  const g3 = createRef<Node>();
  const g3left = createRef<Rect>();
  const g3right = createRef<Rect>();

  // b4：事务只碰少量记录
  const g4 = createRef<Node>();
  const g4card = createRef<Rect>();
  const g4users = [0, 1, 2].map(() => createRef<Circle>());
  const g4flow = createRef<Line>();
  const g4recs = [0, 1, 2].map(() => createRef<Rect>());
  const g4hl = createRef<Rect>();

  // b5：拿键要记录，索引找数据
  const g5 = createRef<Node>();
  const g5key = createRef<Rect>();
  const g5idx = createRef<Rect>();
  const g5rec = createRef<Rect>();
  const g5a1 = createRef<Line>();
  const g5a2 = createRef<Line>();

  // b6：分析师，查询少但重
  const g6 = createRef<Node>();
  const g6man = createRef<Rect>();
  const g6query = createRef<Rect>();
  const g6heavy = createRef<Txt>();

  // b7：一次扫数百万条
  const g7 = createRef<Node>();
  const g7dots = Array.from({length: 24}, () => createRef<Circle>());
  const g7scan = createRef<Rect>();
  const g7count = createRef<Txt>();

  const DOT_X = (i: number) => -280 + (i % 6) * 112;
  const DOT_Y = (i: number) => -190 + Math.floor(i / 6) * 70;

  view.add(
    <>
      {unit.nodes()}
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

      {/* b1 */}
      <Node ref={g1} opacity={0}>
        <Rect ref={g1left} position={[-300, -60]} width={420} height={150} radius={16} fill={T.card} stroke={T.blue} lineWidth={3}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'事务处理'} />
        </Rect>
        <Rect ref={g1right} position={[300, -60]} width={420} height={150} radius={16} fill={T.card} stroke={T.green} lineWidth={3}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'分析'} />
        </Rect>
        <Circle ref={g1dot} position={[0, 110]} width={22} height={22} fill={T.yellow} opacity={0} />
        <Line ref={g1forkL} points={[[0, 110], [-260, 20]]} stroke={T.yellow} lineWidth={3} opacity={0} />
        <Line ref={g1forkR} points={[[0, 110], [260, 20]]} stroke={T.yellow} lineWidth={3} opacity={0} />
        <Txt ref={g1q} position={[0, 190]} fontSize={72} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'?'} opacity={0} />
      </Node>

      {/* b2 */}
      <Node ref={g2} opacity={0}>
        <Rect ref={g2db} position={[0, -60]} width={500} height={180} radius={16} fill={T.card} stroke={T.blue} lineWidth={3}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'数据库'} />
        </Rect>
        <Line ref={g2in} points={[[-560, -60], [-260, -60]]} stroke={T.blue} lineWidth={3} endArrow opacity={0} />
        <Txt ref={g2inLab} position={[-410, -130]} fontSize={SIZE.label} fill={T.blue} fontFamily={FONT.sans} text={'存进去'} opacity={0} />
        <Line ref={g2out} points={[[260, -60], [560, -60]]} stroke={T.green} lineWidth={3} endArrow opacity={0} />
        <Txt ref={g2outLab} position={[410, -130]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} text={'要回来'} opacity={0} />
      </Node>

      {/* b3：两大类（r6：删两卡下方英文小字，标题居中） */}
      <Node ref={g3} opacity={0}>
        <Rect ref={g3left} position={[-300, -60]} width={440} height={180} radius={16} fill={T.card} stroke={T.blue} lineWidth={3}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'事务处理'} />
        </Rect>
        <Rect ref={g3right} position={[300, -60]} width={440} height={180} radius={16} fill={T.card} stroke={T.green} lineWidth={3}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'分析'} />
        </Rect>
      </Node>

      {/* b4 */}
      <Node ref={g4} opacity={0}>
        <Rect ref={g4card} position={[-330, -80]} width={380} height={140} radius={16} fill={T.card} stroke={T.blue} lineWidth={3}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'事务处理'} />
        </Rect>
        {[0, 1, 2].map(i => (
          <Circle key={`g4u-${i}`} ref={g4users[i]} position={[180 + i * 100, -140]} width={28} height={28} fill={T.blue} opacity={0} />
        ))}
        <Line ref={g4flow} points={[[430, -80], [-130, -80]]} stroke={T.blue} lineWidth={3} endArrow opacity={0} />
        {[0, 1, 2].map(i => (
          <Rect
            key={`g4r-${i}`}
            ref={g4recs[i]}
            position={[-320 + i * 320, 150]}
            width={260}
            height={60}
            radius={10}
            fill={T.card}
            stroke={T.line}
            lineWidth={2}
            opacity={0}
          >
            <Txt fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={['记录 1', '记录 2', '记录 3'][i]} />
          </Rect>
        ))}
        <Rect ref={g4hl} position={[-320, 150]} width={260} height={60} radius={10} stroke={T.yellow} lineWidth={3} opacity={0} />
      </Node>

      {/* b5 */}
      <Node ref={g5} opacity={0}>
        <Rect ref={g5key} position={[-420, -60]} width={220} height={90} radius={14} fill={T.card} stroke={T.blue} lineWidth={3}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'键'} />
        </Rect>
        <Line ref={g5a1} points={[[-300, -60], [-140, -60]]} stroke={T.yellow} lineWidth={3} endArrow opacity={0} />
        <Rect ref={g5idx} position={[0, -60]} width={260} height={110} radius={14} fill={T.card} stroke={T.yellow} lineWidth={3}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'索引'} />
        </Rect>
        <Line ref={g5a2} points={[[140, -60], [300, -60]]} stroke={T.yellow} lineWidth={3} endArrow opacity={0} />
        <Rect ref={g5rec} position={[420, -60]} width={220} height={90} radius={14} fill={T.card} stroke={T.green} lineWidth={3}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'记录'} />
        </Rect>
      </Node>

      {/* b6 */}
      <Node ref={g6} opacity={0}>
        <Rect ref={g6man} position={[-350, -60]} width={360} height={150} radius={16} fill={T.card} stroke={T.blue} lineWidth={3}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'业务分析师'} />
        </Rect>
        <Rect ref={g6query} position={[300, -60]} width={420} height={170} radius={16} fill={T.card} stroke={T.green} lineWidth={3}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'查询'} />
        </Rect>
        <Txt ref={g6heavy} position={[300, 70]} fontSize={SIZE.body} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'量少，但很重'} opacity={0} />
      </Node>

      {/* b7 */}
      <Node ref={g7} opacity={0}>
        {g7dots.map((r, i) => (
          <Circle key={`g7d-${i}`} ref={r} position={[DOT_X(i), DOT_Y(i)]} width={16} height={16} fill={T.muted} opacity={0} />
        ))}
        <Rect ref={g7scan} position={[0, -200]} width={620} height={10} fill={T.yellow} opacity={0} />
        <Txt ref={g7count} position={[0, 130]} fontSize={SIZE.title} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'数百万条记录'} opacity={0} />
      </Node>
    </>
  );

  yield* beat('b0', unit.enter());

  say('两条路，怎么选？');
  yield* beat('b1',
    unit.toHeader(),
    all(g1().opacity(1, 0.5)),
    at('两条路', chain(g1dot().opacity(1, 0.4), g1forkL().opacity(1, 0.5), g1forkR().opacity(1, 0.5))),
    at('怎么选', g1q().opacity(1, 0.4)),
  );

  say('存进去，再要回来');
  yield* beat('b2',
    all(g1().opacity(0, 0.5), g2().opacity(1, 0.5)),
    at('存进去', all(g2in().opacity(1, 0.5), g2inLab().opacity(1, 0.4))),
    at('再问它要', all(g2out().opacity(1, 0.5), g2outLab().opacity(1, 0.4))),
  );

  say('两大类：事务 / 分析');
  yield* beat('b3',
    all(g2().opacity(0, 0.5), g3().opacity(1, 0.5)),
    at('事务处理', g3left().stroke(T.yellow, 0.4)),
    at('分析优化', g3right().stroke(T.yellow, 0.4)),
    g3().scale(1.02, beat.dur('b3') - 0.6),
  );

  say('每次只碰少量记录');
  yield* beat('b4',
    all(g3().opacity(0, 0.5), g4().opacity(1, 0.5)),
    at('直接面对用户', chain(g4users[0]().opacity(1, 0.4), g4users[1]().opacity(1, 0.4), g4users[2]().opacity(1, 0.4), g4flow().opacity(1, 0.5))),
    at('只碰少量记录', chain(g4recs[0]().opacity(1, 0.3), g4recs[1]().opacity(1, 0.3), g4recs[2]().opacity(1, 0.3), g4hl().opacity(1, 0.3))),
  );

  say('拿键要记录，索引找数据');
  yield* beat('b5',
    all(g4().opacity(0, 0.5), g5().opacity(1, 0.5)),
    at('拿一个键', g5a1().opacity(1, 0.5)),
    at('用索引找到', chain(g5a2().opacity(1, 0.5), g5rec().stroke(T.yellow, 0.4))),
  );

  say('查询少，每个都很重');
  yield* beat('b6',
    all(g5().opacity(0, 0.5), g6().opacity(1, 0.5)),
    at('业务分析师', g6man().stroke(T.yellow, 0.4)),
    at('每个查询都很重', g6heavy().opacity(1, 0.5)),
    g6().scale(1.02, beat.dur('b6') - 0.6),
  );

  say('一次扫数百万条');
  yield* beat('b7',
    all(g6().opacity(0, 0.5), g7().opacity(1, 0.5),
      chain(
        all(...g7dots.slice(0, 12).map(r => r().opacity(1, 0.15))),
        all(...g7dots.slice(12, 24).map(r => r().opacity(1, 0.15))),
      )),
    at('扫过数百万条记录', chain(
      g7scan().opacity(1, 0.3),
      g7scan().position([0, 50], 0.8),
      g7count().opacity(1, 0.4),
    )),
  );
});
