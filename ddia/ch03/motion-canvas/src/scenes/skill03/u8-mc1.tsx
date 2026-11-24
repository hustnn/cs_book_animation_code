// U8 场景 1（MC）：b1–b11 —— 钩子、一笔交易 = 一次写、OLTP 查少量记录、OLAP 扫海量记录算聚合。
// 分镜：skill-ch03/beats-u8.md；原文：DDIA §3.7（书页 p90，PDF p112）。
// 时长全部来自 timeline/u8.json（beat() 驱动），不手写 waitFor。
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

  // b1：一个数据库，两股来向
  const g1 = createRef<Node>();
  const g1db = createRef<Rect>();
  const g1inL = createRef<Line>();
  const g1inR = createRef<Line>();
  const g1labL = createRef<Txt>();
  const g1labR = createRef<Txt>();
  const g1q = createRef<Txt>();

  // b2：三笔生意
  const g2 = createRef<Node>();
  const g2cards = [0, 1, 2].map(() => createRef<Rect>());
  const g2arrows = [0, 1, 2].map(() => createRef<Line>());
  const g2db = createRef<Rect>();
  const g2dbLab = createRef<Txt>();

  // b3：一组读写，一个逻辑单元
  const g3 = createRef<Node>();
  const g3frame = createRef<Rect>();
  const g3read = createRef<Rect>();
  const g3write = createRef<Rect>();
  const g3lab = createRef<Txt>();

  // b4：四个属性，不一定非要有
  const g4 = createRef<Node>();
  const g4chips = [0, 1, 2, 3].map(() => createRef<Rect>());
  const g4tag = createRef<Txt>();

  // b5：低延迟读写 vs 批处理
  const g5 = createRef<Node>();
  const g5fast = createRef<Rect>();
  const g5arrow = createRef<Line>();
  const g5batch = createRef<Rect>();

  // b6：越用越广
  const g6 = createRef<Node>();
  const g6cards = [0, 1, 2].map(() => createRef<Rect>());
  const g6arrows = [0, 1, 2].map(() => createRef<Line>());
  const g6db = createRef<Rect>();

  // b7：按键查少量记录
  const g7 = createRef<Node>();
  const g7rows = [0, 1, 2].map(() => createRef<Rect>());
  const g7hl = createRef<Rect>();
  const g7key = createRef<Line>();
  const g7keyLab = createRef<Txt>();
  const g7ins = createRef<Line>();
  const g7upd = createRef<Line>();
  const g7plate = createRef<Rect>();

  // b8：下单，只动一条记录
  const g8 = createRef<Node>();
  const g8order = createRef<Rect>();
  const g8arrow = createRef<Line>();
  const g8db = createRef<Rect>();
  const g8row = createRef<Rect>();
  const g8ok = createRef<Rect>();

  // b9：接单缩小，记录点阵 + 扫描线
  const g9 = createRef<Node>();
  const g9card = createRef<Rect>();
  const g9dots = Array.from({length: 24}, () => createRef<Circle>());
  const g9scan = createRef<Rect>();

  // b10：只读少数几列，算聚合
  const g10 = createRef<Node>();
  const g10dots = Array.from({length: 24}, () => createRef<Circle>());
  const g10raw = createRef<Rect>();
  const g10chips = [0, 1, 2].map(() => createRef<Rect>());

  // b11：左右分屏对照
  const g11 = createRef<Node>();
  const g11left = createRef<Rect>();
  const g11right = createRef<Rect>();
  const g11dot = createRef<Circle>();
  const g11dots = Array.from({length: 12}, () => createRef<Circle>());
  const g11tag = createRef<Txt>();

  const DOT_X = (i: number) => 40 + (i % 6) * 80;
  const DOT_Y = (i: number) => -160 + Math.floor(i / 6) * 70;
  const R_X = (i: number) => 130 + (i % 4) * 100;
  const R_Y = (i: number) => -140 + Math.floor(i / 4) * 70;

  view.add(
    <>
      <Txt
        ref={header}
        position={[-SAFE.halfW, -SAFE.halfH]}
        offset={[-1, -1]}
        fontSize={SIZE.label}
        fill={T.muted}
        fontFamily={FONT.sans}
        text={'两条路：事务还是分析'}
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

      {/* b1 */}
      <Node ref={g1} opacity={0}>
        <Rect ref={g1db} position={[0, -40]} width={360} height={170} radius={16} fill={T.card} stroke={T.blue} lineWidth={3}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'数据库'} />
        </Rect>
        <Line ref={g1inL} points={[[-560, -40], [-190, -40]]} stroke={T.blue} lineWidth={3} endArrow opacity={0} />
        <Line ref={g1inR} points={[[560, -40], [190, -40]]} stroke={T.green} lineWidth={3} endArrow opacity={0} />
        <Txt ref={g1labL} position={[-375, -110]} fontSize={SIZE.body} fontWeight={700} fill={T.blue} fontFamily={FONT.sans} text={'接单'} opacity={0} />
        <Txt ref={g1labR} position={[375, -110]} fontSize={SIZE.body} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'算报表'} opacity={0} />
        <Txt ref={g1q} position={[0, 130]} fontSize={72} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'?'} opacity={0} />
      </Node>

      {/* b2 */}
      <Node ref={g2} opacity={0}>
        {[0, 1, 2].map(i => (
          <Rect
            key={`g2c-${i}`}
            ref={g2cards[i]}
            position={[-400 + i * 400, -60]}
            width={320}
            height={120}
            radius={16}
            fill={T.card}
            stroke={T.blue}
            lineWidth={2}
            opacity={0}
          >
            <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={['卖东西', '给供应商下单', '发员工工资'][i]} />
          </Rect>
        ))}
        {[0, 1, 2].map(i => (
          <Line
            key={`g2a-${i}`}
            ref={g2arrows[i]}
            points={[[-400 + i * 400, 10], [-400 + i * 400, 105]]}
            stroke={T.blue}
            lineWidth={3}
            endArrow
            opacity={0}
          />
        ))}
        <Rect ref={g2db} position={[0, 150]} width={700} height={70} radius={12} fill={T.card} stroke={T.line} lineWidth={2} opacity={0}>
          <Txt ref={g2dbLab} position={[0, 0]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'数据库'} opacity={0} />
        </Rect>
      </Node>

      {/* b3 */}
      <Node ref={g3} opacity={0}>
        <Rect ref={g3frame} position={[0, -60]} width={400} height={160} radius={16} fill={T.card} stroke={T.blue} lineWidth={2}>
          <Txt position={[0, 0]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={''} />
        </Rect>
        <Rect ref={g3read} position={[-95, -60]} width={140} height={80} radius={12} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'读'} />
        </Rect>
        <Rect ref={g3write} position={[95, -60]} width={140} height={80} radius={12} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'写'} />
        </Rect>
        <Txt ref={g3lab} position={[0, -190]} fontSize={SIZE.body} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'一个逻辑单元'} opacity={0} />
      </Node>

      {/* b4 */}
      <Node ref={g4} opacity={0}>
        {[0, 1, 2, 3].map(i => (
          <Rect
            key={`g4c-${i}`}
            ref={g4chips[i]}
            position={[-435 + i * 290, -60]}
            width={260}
            height={100}
            radius={14}
            fill={T.card}
            stroke={T.line}
            lineWidth={2}
            opacity={0}
          >
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={['原子性', '一致性', '隔离性', '持久性'][i]} />
          </Rect>
        ))}
        <Txt ref={g4tag} position={[0, -190]} fontSize={SIZE.body} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'不一定非要有'} opacity={0} />
      </Node>

      {/* b5 */}
      <Node ref={g5} opacity={0}>
        <Rect ref={g5fast} position={[-290, -60]} width={480} height={200} radius={16} fill={T.card} stroke={T.blue} lineWidth={3}>
          <Txt position={[0, -60]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'低延迟读写'} />
        </Rect>
        <Line ref={g5arrow} points={[[-480, 20], [-100, 20]]} stroke={T.blue} lineWidth={3} endArrow opacity={0} />
        <Rect ref={g5batch} position={[290, -60]} width={480} height={200} radius={16} fill={T.card} stroke={T.line} lineWidth={2}>
          <Txt position={[0, -60]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'批处理作业'} />
          <Txt position={[0, 30]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'每天一次'} />
        </Rect>
      </Node>

      {/* b6 */}
      <Node ref={g6} opacity={0}>
        {[0, 1, 2].map(i => (
          <Rect
            key={`g6c-${i}`}
            ref={g6cards[i]}
            position={[-400 + i * 400, -60]}
            width={320}
            height={120}
            radius={16}
            fill={T.card}
            stroke={T.blue}
            lineWidth={2}
            opacity={0}
          >
            <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={['博客评论', '游戏动作', '通讯录联系人'][i]} />
          </Rect>
        ))}
        {[0, 1, 2].map(i => (
          <Line
            key={`g6a-${i}`}
            ref={g6arrows[i]}
            points={[[-400 + i * 400, 10], [-400 + i * 400, 105]]}
            stroke={T.blue}
            lineWidth={3}
            endArrow
            opacity={0}
          />
        ))}
        <Rect ref={g6db} position={[0, 150]} width={700} height={70} radius={12} fill={T.card} stroke={T.line} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'数据库'} />
        </Rect>
      </Node>

      {/* b7 */}
      <Node ref={g7} opacity={0}>
        {[0, 1, 2].map(i => (
          <Rect
            key={`g7r-${i}`}
            ref={g7rows[i]}
            position={[0, -160 + i * 80]}
            width={700}
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
        <Rect ref={g7hl} position={[0, -80]} width={700} height={56} radius={10} stroke={T.yellow} lineWidth={3} opacity={0} />
        <Line ref={g7key} points={[[-520, -80], [-360, -80]]} stroke={T.yellow} lineWidth={3} endArrow opacity={0} />
        <Txt ref={g7keyLab} position={[-500, -140]} fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.sans} text={'键'} opacity={0} />
        <Line ref={g7ins} points={[[420, -160], [360, -160]]} stroke={T.green} lineWidth={3} endArrow opacity={0} />
        <Line ref={g7upd} points={[[420, 0], [360, 0]]} stroke={T.green} lineWidth={3} endArrow opacity={0} />
        <Rect ref={g7plate} position={[0, -255]} width={460} height={64} radius={12} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'联机事务处理 OLTP'} />
        </Rect>
      </Node>

      {/* b8 */}
      <Node ref={g8} opacity={0}>
        <Rect ref={g8order} position={[-400, -60]} width={260} height={120} radius={16} fill={T.card} stroke={T.blue} lineWidth={3}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'下单'} />
        </Rect>
        <Line ref={g8arrow} points={[[-260, -60], [-170, -60]]} stroke={T.blue} lineWidth={3} endArrow />
        <Rect ref={g8db} position={[120, -60]} width={380} height={130} radius={16} fill={T.card} stroke={T.line} lineWidth={2}>
          <Txt position={[0, -38]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'数据库'} />
          <Rect ref={g8row} position={[0, 25]} width={300} height={40} radius={8} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'一条记录'} />
          </Rect>
        </Rect>
        <Rect ref={g8ok} position={[430, -60]} width={180} height={90} radius={14} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'好了'} />
        </Rect>
      </Node>

      {/* b9 */}
      <Node ref={g9} opacity={0}>
        <Rect ref={g9card} position={[-430, -60]} width={220} height={110} radius={14} fill={T.card} stroke={T.blue} lineWidth={2}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'接单'} />
        </Rect>
        {g9dots.map((r, i) => (
          <Circle key={`g9d-${i}`} ref={r} position={[DOT_X(i), DOT_Y(i)]} width={16} height={16} fill={T.muted} opacity={0} />
        ))}
        <Rect ref={g9scan} position={[240, -160]} width={440} height={10} fill={T.yellow} opacity={0} />
      </Node>

      {/* b10 */}
      <Node ref={g10} opacity={0}>
        <Rect ref={g10raw} position={[0, -255]} width={320} height={56} radius={12} fill={T.card} stroke={T.line} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'原始数据'} />
        </Rect>
        {g10dots.map((r, i) => (
          <Circle key={`g10d-${i}`} ref={r} position={[DOT_X(i), DOT_Y(i)]} width={16} height={16} fill={(i % 6 === 1 || i % 6 === 4) ? T.blue : T.muted} opacity={0} />
        ))}
        {[0, 1, 2].map(i => (
          <Rect
            key={`g10c-${i}`}
            ref={g10chips[i]}
            position={[-350 + i * 350, 180]}
            width={260}
            height={70}
            radius={12}
            fill={T.card}
            stroke={T.green}
            lineWidth={2}
            opacity={0}
          >
            <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={['计数', '求和', '平均'][i]} />
          </Rect>
        ))}
      </Node>

      {/* b11 */}
      <Node ref={g11} opacity={0}>
        <Rect ref={g11left} position={[-290, -60]} width={480} height={240} radius={16} fill={T.card} stroke={T.blue} lineWidth={3}>
          <Txt position={[0, 80]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'动一条记录'} />
        </Rect>
        <Circle ref={g11dot} position={[-290, -80]} width={26} height={26} fill={T.green} opacity={0} />
        <Rect ref={g11right} position={[290, -60]} width={480} height={240} radius={16} fill={T.card} stroke={T.green} lineWidth={3}>
          <Txt position={[0, 80]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'扫海量记录，算聚合'} />
        </Rect>
        {g11dots.map((r, i) => (
          <Circle key={`g11d-${i}`} ref={r} position={[R_X(i), R_Y(i)]} width={14} height={14} fill={T.muted} opacity={0} />
        ))}
        <Txt ref={g11tag} position={[0, -250]} fontSize={SIZE.body} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'差别在访问模式'} opacity={0} />
      </Node>
    </>
  );

  say('又要接单，又要算报表？');
  yield* beat('b1',
    all(g1().opacity(1, 0.5)),
    at('又要接单', all(g1inL().opacity(1, 0.4), g1labL().opacity(1, 0.4))),
    at('算报表', all(g1inR().opacity(1, 0.4), g1labR().opacity(1, 0.4))),
    at('行吗', g1q().opacity(1, 0.4)),
  );

  say('一次写，就是一笔生意');
  yield* beat('b2',
    all(g1().opacity(0, 0.5), g2().opacity(1, 0.5),
      g2cards[0]().opacity(1, 0.5), g2cards[1]().opacity(1, 0.5), g2cards[2]().opacity(1, 0.5),
      g2db().opacity(1, 0.5), g2dbLab().opacity(1, 0.5)),
    at('卖东西', g2arrows[0]().opacity(1, 0.4)),
    at('给供应商下单', g2arrows[1]().opacity(1, 0.4)),
    at('发员工工资', g2arrows[2]().opacity(1, 0.4)),
  );

  say('一组读写，一个逻辑单元');
  yield* beat('b3',
    all(g2().opacity(0, 0.5), g3().opacity(1, 0.5)),
    at('交易这个词', all(g3read().opacity(1, 0.4), g3write().opacity(1, 0.4))),
    at('逻辑单元', g3lab().opacity(1, 0.5)),
  );

  say('不一定非要有');
  yield* beat('b4',
    all(g3().opacity(0, 0.5), g4().opacity(1, 0.5)),
    at('原子性', g4chips[0]().opacity(1, 0.4)),
    at('一致性', g4chips[1]().opacity(1, 0.4)),
    at('隔离性', g4chips[2]().opacity(1, 0.4)),
    at('持久性', all(g4chips[3]().opacity(1, 0.4), g4tag().opacity(1, 0.5))),
  );

  say('低延迟读写，批处理每天一次');
  yield* beat('b5',
    all(g4().opacity(0, 0.5), g5().opacity(1, 0.5)),
    at('低延迟地读写', g5arrow().opacity(1, 0.5)),
    at('批处理作业', g5batch().stroke(T.yellow, 0.4)),
  );

  say('越用越广，还是老样子');
  yield* beat('b6',
    all(g5().opacity(0, 0.5), g6().opacity(1, 0.5)),
    at('博客评论', all(g6cards[0]().opacity(1, 0.4), g6arrows[0]().opacity(1, 0.4), g6db().opacity(1, 0.4))),
    at('游戏里的动作', all(g6cards[1]().opacity(1, 0.4), g6arrows[1]().opacity(1, 0.4))),
    at('通讯录里的联系人', all(g6cards[2]().opacity(1, 0.4), g6arrows[2]().opacity(1, 0.4))),
    at('访问的样子', g6db().stroke(T.yellow, 0.4)),
  );

  say('按键查少量记录');
  yield* beat('b7',
    all(g6().opacity(0, 0.5), g7().opacity(1, 0.5)),
    at('按键查少量记录', chain(g7rows[0]().opacity(1, 0.4), g7rows[1]().opacity(1, 0.4), g7rows[2]().opacity(1, 0.4), g7hl().opacity(1, 0.4), g7key().opacity(1, 0.4), g7keyLab().opacity(1, 0.4))),
    at('插入或更新', chain(g7ins().opacity(1, 0.4), g7upd().opacity(1, 0.4))),
    at('联机事务处理', g7plate().opacity(1, 0.5)),
    g7().scale(1.02, beat.dur('b7') - 0.6),
  );

  say('只动一条记录');
  yield* beat('b8',
    all(g7().opacity(0, 0.5), g8().opacity(1, 0.5)),
    at('只动一条记录', g8row().opacity(1, 0.4)),
    at('好了', g8ok().opacity(1, 0.5)),
  );

  say('分析：访问模式很不一样');
  yield* beat('b9',
    all(g8().opacity(0, 0.5), g9().opacity(1, 0.5)),
    at('数据分析', chain(
      all(...g9dots.slice(0, 6).map(r => r().opacity(1, 0.3))),
      all(...g9dots.slice(6, 12).map(r => r().opacity(1, 0.3))),
      all(...g9dots.slice(12, 18).map(r => r().opacity(1, 0.3))),
      all(...g9dots.slice(18, 24).map(r => r().opacity(1, 0.3))),
    )),
    at('访问模式很不一样', chain(g9scan().opacity(1, 0.3), g9scan().position([240, 50], 0.9))),
  );

  say('扫海量记录，算聚合');
  yield* beat('b10',
    all(g9().opacity(0, 0.5), g10().opacity(1, 0.5)),
    at('扫过海量记录', chain(...g10dots.map(r => r().opacity(1, 0.12)))),
    at('少数几列', g10dots[1]().fill(T.yellow, 0.4)),
    at('计数、求和、平均', chain(g10chips[0]().opacity(1, 0.4), g10chips[1]().opacity(1, 0.4), g10chips[2]().opacity(1, 0.4))),
    at('而不是把原始数据还给你', chain(g10raw().opacity(1, 0.4), g10raw().opacity(0.35, 0.6))),
    g10().scale(1.02, beat.dur('b10') - 0.6),
  );

  say('差别在访问模式');
  yield* beat('b11',
    all(g10().opacity(0, 0.5), g11().opacity(1, 0.5)),
    at('接单是动一条记录', g11dot().opacity(1, 0.5)),
    at('分析是扫海量记录算聚合', chain(...g11dots.map(r => r().opacity(1, 0.12)))),
    at('不只是查询大一点小一点', g11tag().opacity(1, 0.5)),
    g11().scale(1.02, beat.dur('b11') - 0.6),
  );
});
