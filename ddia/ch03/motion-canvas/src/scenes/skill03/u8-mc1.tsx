// U8 场景 1（MC）：h1–h11 —— 钩子、两股人流直觉、一笔交易 = 一次写、OLTP 查少量记录、低延迟。
// 分镜：skill-ch03/beats-u8.md；原文：DDIA §3.7（书页 p90，PDF p112）。
// 时长全部来自 timeline/u8.json（beat() 驱动），不手写 waitFor。
import {Circle, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, chain, createRef, linear} from '@motion-canvas/core';
import {at, makeBeats} from '../../lib/beats';
import {CHAPTER} from '../../lib/chapter';
import {UnitTitle} from '../../lib/opening';
import {Counter} from '../../lib/schemas';
import {FONT, SAFE, SIZE, T} from '../../lib/theme';
import timeline from '../../timeline/u8.json';

export default makeScene2D(function* (view) {
  view.fill(T.bg);
  const beat = makeBeats(timeline);

  const anchor = createRef<Txt>();
  const say = (text: string) => anchor().text(text);

  // h1：一个数据库，两股来向
  const g1 = createRef<Node>();
  const g1db = createRef<Rect>();
  const g1inL = createRef<Line>();
  const g1inR = createRef<Line>();
  const g1labL = createRef<Txt>();
  const g1labR = createRef<Txt>();
  const g1q = createRef<Txt>();

  // h2：左股人流——一笔生意落进数据库
  const g2 = createRef<Node>();
  const g2card = createRef<Rect>();
  const g2flow = createRef<Line>();
  const g2dots = [0, 1, 2].map(() => createRef<Circle>());
  const g2db = createRef<Rect>();
  const wCount = new Counter([330, 80], '已写 ', ' 次');

  // h3：右股人流——一条一条读过去，扫海量记录，算出报表要的数（r5：不再数“3 个数”）
  const g3 = createRef<Node>();
  const g3dots = Array.from({length: 24}, () => createRef<Circle>());
  const g3scan = createRef<Rect>();
  const g3rep = createRef<Rect>();
  const g3agg = createRef<Txt>();

  // h4：三笔生意
  const g4 = createRef<Node>();
  const g4cards = [0, 1, 2].map(() => createRef<Rect>());
  const g4arrows = [0, 1, 2].map(() => createRef<Line>());
  const g4db = createRef<Rect>();
  const g4dbLab = createRef<Txt>();

  // h4b：一单进来，两处改动合成一次写
  const g4b = createRef<Node>();
  const g4bframe = createRef<Rect>();
  const g4b1 = createRef<Rect>();
  const g4b2 = createRef<Rect>();
  const g4b1sub = createRef<Txt>();
  const g4b2sub = createRef<Txt>();
  const g4blab = createRef<Txt>();
  const twoCount = new Counter([0, 150], '一次写：', ' 处改动');

  // h5：一组读写，一个逻辑单元
  const g5 = createRef<Node>();
  const g5frame = createRef<Rect>();
  const g5read = createRef<Rect>();
  const g5write = createRef<Rect>();
  const g5lab = createRef<Txt>();
  const g5sub = createRef<Txt>();

  // h5e：失败情形——第二处不成，第一处也作废（延伸 · 原文之外）
  const g5e = createRef<Node>();
  const g5e1 = createRef<Rect>();
  const g5e2 = createRef<Rect>();
  const g5ex = createRef<Txt>();
  const g5e2note = createRef<Txt>();
  const g5estock = createRef<Txt>();
  const g5etag = createRef<Txt>();

  // h5b：四个属性，不一定非要有（r6：h5b 前两个、h5d 后两个，各加一句白话展开）
  const g5b = createRef<Node>();
  const g5bchips = [0, 1, 2, 3].map(() => createRef<Rect>());
  const g5bexp = [0, 1, 2, 3].map(() => createRef<Txt>());
  const g5btag = createRef<Txt>();

  // h5c：低延迟读写 vs 批处理
  const g5c = createRef<Node>();
  const g5cfast = createRef<Rect>();
  const g5carrow = createRef<Line>();
  const g5cbatch = createRef<Rect>();
  const g5cnote = createRef<Txt>();

  // h6：查订单，只动一条记录（r6：卡改成“查订单”，箭头改成从数据库出来的读走向）
  const g6 = createRef<Node>();
  const g6order = createRef<Rect>();
  const g6arrow = createRef<Line>();
  const g6db = createRef<Rect>();
  const g6row = createRef<Rect>();
  const g6ok = createRef<Rect>();
  const oneCount = new Counter([120, 90], '只动 ', ' 条记录');

  // h7：按键查少量记录
  const g7 = createRef<Node>();
  const g7rows = [0, 1, 2].map(() => createRef<Rect>());
  const g7hl = createRef<Rect>();
  const g7key = createRef<Line>();
  const g7keyLab = createRef<Txt>();
  const g7ins = createRef<Line>();
  const g7upd = createRef<Line>();
  const g7plate = createRef<Rect>();

  // h8：越用越广
  const g8 = createRef<Node>();
  const g8cards = [0, 1, 2].map(() => createRef<Rect>());
  const g8subs = [0, 1, 2].map(() => createRef<Txt>());
  const g8arrows = [0, 1, 2].map(() => createRef<Line>());
  const g8db = createRef<Rect>();

  // h9：三张卡各伸出一支键箭头，指向少量记录
  const g9 = createRef<Node>();
  const g9arrows = [0, 1, 2].map(() => createRef<Line>());
  const g9chip = createRef<Rect>();

  // h10：读、写两条快箭头，低延迟
  const g10 = createRef<Node>();
  const g10read = createRef<Rect>();
  const g10write = createRef<Rect>();
  const g10aR = createRef<Line>();
  const g10aW = createRef<Line>();
  const g10db = createRef<Rect>();
  const g10fast = createRef<Rect>();
  const g10echo = createRef<Rect>();
  const g10ms = createRef<Txt>();

  // h11：一次查询只碰几条记录
  const g11 = createRef<Node>();
  const g11dots = Array.from({length: 12}, () => createRef<Circle>());
  const fewCount = new Counter([0, 30], '一次查询：', ' 条记录');
  const g11fast = createRef<Rect>();
  const g11tag = createRef<Txt>();
  const g11disk = createRef<Txt>();

  const DOT_X = (i: number) => 40 + (i % 6) * 80;
  const DOT_Y = (i: number) => -160 + Math.floor(i / 6) * 70;
  const D11_X = (i: number) => -440 + i * 80;

  view.add(
    <>
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

      {/* h1 */}
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

      {/* h2 */}
      <Node ref={g2} opacity={0}>
        <Rect ref={g2card} position={[-420, -60]} width={280} height={120} radius={16} fill={T.card} stroke={T.blue} lineWidth={3}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'一笔生意'} />
        </Rect>
        <Line
          ref={g2flow}
          points={[[-270, -60], [170, -60]]}
          stroke={T.blue}
          lineWidth={3}
          lineDash={[14, 10]}
          endArrow
          opacity={0}
        />
        {g2dots.map((r, i) => (
          <Circle key={`g2d-${i}`} ref={r} position={[-270, -60]} width={20} height={20} fill={T.blue} opacity={0} />
        ))}
        <Rect ref={g2db} position={[330, -60]} width={300} height={130} radius={16} fill={T.card} stroke={T.blue} lineWidth={3}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'数据库'} />
        </Rect>
        {wCount.node}
      </Node>

      {/* h3 */}
      <Node ref={g3} opacity={0}>
        <Rect ref={g3rep} position={[-430, -60]} width={220} height={110} radius={14} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'报表'} />
        </Rect>
        {g3dots.map((r, i) => (
          <Circle key={`g3d-${i}`} ref={r} position={[DOT_X(i), DOT_Y(i)]} width={16} height={16} fill={T.muted} opacity={0} />
        ))}
        <Rect ref={g3scan} position={[240, -160]} width={440} height={10} fill={T.yellow} opacity={0} />
        <Txt ref={g3agg} position={[240, 190]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'算出报表要的数'} opacity={0} />
      </Node>

      {/* h4 */}
      <Node ref={g4} opacity={0}>
        {[0, 1, 2].map(i => (
          <Rect
            key={`g4c-${i}`}
            ref={g4cards[i]}
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
            key={`g4a-${i}`}
            ref={g4arrows[i]}
            points={[[-400 + i * 400, 10], [-400 + i * 400, 105]]}
            stroke={T.blue}
            lineWidth={3}
            endArrow
            opacity={0}
          />
        ))}
        <Rect ref={g4db} position={[0, 150]} width={700} height={70} radius={12} fill={T.card} stroke={T.line} lineWidth={2} opacity={0}>
          <Txt ref={g4dbLab} position={[0, 0]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'数据库'} opacity={0} />
        </Rect>
      </Node>

      {/* h4b */}
      <Node ref={g4b} opacity={0}>
        <Rect ref={g4bframe} position={[0, -60]} width={700} height={160} radius={16} fill={T.card} stroke={T.blue} lineWidth={2}>
          <Txt position={[0, 0]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={''} />
        </Rect>
        <Rect ref={g4b1} position={[-180, -60]} width={300} height={90} radius={12} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'记一行订单'} />
        </Rect>
        <Rect ref={g4b2} position={[180, -60]} width={300} height={90} radius={12} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'库存扣一件'} />
        </Rect>
        <Txt ref={g4blab} position={[0, -190]} fontSize={SIZE.body} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'一次写'} opacity={0} />
        <Txt ref={g4b1sub} position={[-180, 50]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} text={'添一条新记录'} opacity={0} />
        <Txt ref={g4b2sub} position={[180, 50]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} text={'改一条已有的记录'} opacity={0} />
        {twoCount.node}
      </Node>

      {/* h5 */}
      <Node ref={g5} opacity={0}>
        <Rect ref={g5frame} position={[0, -60]} width={400} height={160} radius={16} fill={T.card} stroke={T.blue} lineWidth={2}>
          <Txt position={[0, 0]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={''} />
        </Rect>
        <Rect ref={g5read} position={[-95, -60]} width={140} height={80} radius={12} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'读'} />
        </Rect>
        <Rect ref={g5write} position={[95, -60]} width={140} height={80} radius={12} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'写'} />
        </Rect>
        <Txt ref={g5lab} position={[0, -190]} fontSize={SIZE.body} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'一个逻辑单元'} opacity={0} />
        <Txt ref={g5sub} position={[0, 90]} fontSize={SIZE.body} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'原子性：要么一起成，要么一起不成'} opacity={0} />
      </Node>

      {/* h5e */}
      <Node ref={g5e} opacity={0}>
        <Rect ref={g5e1} position={[-280, -60]} width={300} height={90} radius={12} fill={T.card} stroke={T.green} lineWidth={2}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'记一行订单'} />
        </Rect>
        <Rect ref={g5e2} position={[280, -60]} width={300} height={90} radius={12} fill={T.card} stroke={T.green} lineWidth={2}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'库存扣一件'} />
        </Rect>
        <Txt ref={g5ex} position={[-280, -60]} fontSize={SIZE.title} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'✕'} opacity={0} />
        <Txt ref={g5e2note} position={[280, 20]} fontSize={SIZE.label} fill={T.red} fontFamily={FONT.sans} text={'扣不下去'} opacity={0} />
        <Txt ref={g5estock} position={[280, 60]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'库存不动'} opacity={0} />
        <Txt ref={g5etag} position={[0, -190]} fontSize={SIZE.label} fill={T.purple} fontFamily={FONT.sans} text={'延伸 · 原文之外'} opacity={0} />
      </Node>

      {/* h5b */}
      <Node ref={g5b} opacity={0}>
        {[0, 1, 2, 3].map(i => (
          <Rect
            key={`g5bc-${i}`}
            ref={g5bchips[i]}
            position={[-435 + i * 290, -60]}
            width={260}
            height={100}
            radius={14}
            fill={T.card}
            stroke={T.line}
            lineWidth={2}
            opacity={0}
          >
            <Txt position={[0, -20]} fontSize={SIZE.label} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={['原子性', '一致性', '隔离性', '持久性'][i]} />
            <Txt position={[0, 22]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={['全或无', '合规矩', '互不踩', '不丢失'][i]} />
          </Rect>
        ))}
        <Txt ref={g5btag} position={[0, -190]} fontSize={SIZE.body} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'不一定非要有'} opacity={0} />
        {[0, 1, 2, 3].map(i => (
          <Txt
            key={`g5be-${i}`}
            ref={g5bexp[i]}
            position={[-435 + i * 290, 30]}
            fontSize={SIZE.label}
            fill={T.muted}
            fontFamily={FONT.sans}
            textAlign={'center'}
            textWrap
            maxWidth={260}
            text={['出错了，整笔作废', '库存不能变负数', '同时进行，互不干扰', '提交了，就丢不掉'][i]}
            opacity={0}
          />
        ))}
      </Node>

      {/* h5c */}
      <Node ref={g5c} opacity={0}>
        <Rect ref={g5cfast} position={[-290, -60]} width={480} height={200} radius={16} fill={T.card} stroke={T.blue} lineWidth={3}>
          <Txt position={[0, -60]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'低延迟读写'} />
        </Rect>
        <Line ref={g5carrow} points={[[-480, 20], [-100, 20]]} stroke={T.blue} lineWidth={3} endArrow opacity={0} />
        <Rect ref={g5cbatch} position={[290, -60]} width={480} height={200} radius={16} fill={T.card} stroke={T.line} lineWidth={2}>
          <Txt position={[0, -60]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'批处理作业'} />
          <Txt position={[0, 30]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'每天一次'} />
          <Txt ref={g5cnote} position={[0, 70]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'定期报表，不用立刻出结果'} opacity={0} />
        </Rect>
      </Node>

      {/* h6 */}
      <Node ref={g6} opacity={0}>
        <Rect ref={g6order} position={[-400, -60]} width={260} height={120} radius={16} fill={T.card} stroke={T.blue} lineWidth={3}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'查订单'} />
        </Rect>
        <Line ref={g6arrow} points={[[-170, -60], [-260, -60]]} stroke={T.blue} lineWidth={3} endArrow />
        <Rect ref={g6db} position={[120, -60]} width={380} height={130} radius={16} fill={T.card} stroke={T.line} lineWidth={2}>
          <Txt position={[0, -38]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'数据库'} />
          <Rect ref={g6row} position={[0, 25]} width={300} height={40} radius={8} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'一条记录'} />
          </Rect>
        </Rect>
        <Rect ref={g6ok} position={[430, -60]} width={180} height={90} radius={14} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'好了'} />
        </Rect>
        {oneCount.node}
      </Node>

      {/* h7 */}
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

      {/* h8 */}
      <Node ref={g8} opacity={0}>
        {[0, 1, 2].map(i => (
          <Rect
            key={`g8c-${i}`}
            ref={g8cards[i]}
            position={[-400 + i * 400, -60]}
            width={320}
            height={120}
            radius={16}
            fill={T.card}
            stroke={T.blue}
            lineWidth={2}
            opacity={0}
          >
            <Txt position={[0, -20]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={['博客评论', '游戏动作', '通讯录联系人'][i]} />
            <Txt ref={g8subs[i]} position={[0, 30]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={['写一条记录', '写一条记录', '读一条记录'][i]} opacity={0} />
          </Rect>
        ))}
        {[0, 1, 2].map(i => (
          <Line
            key={`g8a-${i}`}
            ref={g8arrows[i]}
            points={[[-400 + i * 400, 10], [-400 + i * 400, 105]]}
            stroke={T.blue}
            lineWidth={3}
            endArrow
            opacity={0}
          />
        ))}
        <Rect ref={g8db} position={[0, 150]} width={700} height={70} radius={12} fill={T.card} stroke={T.line} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'数据库'} />
        </Rect>
      </Node>

      {/* h9：键箭头指向少量记录 */}
      <Node ref={g9} opacity={0}>
        {[0, 1, 2].map(i => (
          <Line
            key={`g9a-${i}`}
            ref={g9arrows[i]}
            points={[[-400 + i * 400, 10], [-400 + i * 400, 105]]}
            stroke={T.yellow}
            lineWidth={3}
            endArrow
            opacity={0}
          />
        ))}
        <Rect ref={g9chip} position={[0, 225]} width={260} height={56} radius={12} fill={T.card} stroke={T.yellow} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'少量记录'} />
        </Rect>
      </Node>

      {/* h10 */}
      <Node ref={g10} opacity={0}>
        <Rect ref={g10read} position={[-420, -140]} width={240} height={90} radius={14} fill={T.card} stroke={T.blue} lineWidth={2}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'读'} />
        </Rect>
        <Rect ref={g10write} position={[-420, 20]} width={240} height={90} radius={14} fill={T.card} stroke={T.blue} lineWidth={2}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'写'} />
        </Rect>
        <Line ref={g10aR} points={[[-290, -140], [-60, -140]]} stroke={T.blue} lineWidth={3} endArrow opacity={0} />
        <Line ref={g10aW} points={[[-290, 20], [-60, 20]]} stroke={T.blue} lineWidth={3} endArrow opacity={0} />
        <Rect ref={g10db} position={[200, -60]} width={420} height={170} radius={16} fill={T.card} stroke={T.line} lineWidth={2}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'数据库'} />
        </Rect>
        <Rect ref={g10fast} position={[200, -195]} width={220} height={60} radius={12} fill={T.card} stroke={T.yellow} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'低延迟'} />
        </Rect>
        <Rect ref={g10echo} position={[200, 110]} width={280} height={60} radius={12} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'毫秒级回音'} />
        </Rect>
        <Txt ref={g10ms} position={[200, 190]} fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.sans} text={'1 毫秒 = 千分之一秒'} opacity={0} />
      </Node>

      {/* h11 */}
      <Node ref={g11} opacity={0}>
        {g11dots.map((r, i) => (
          <Circle key={`g11d-${i}`} ref={r} position={[D11_X(i), -100]} width={26} height={26} fill={T.muted} opacity={0} />
        ))}
        {fewCount.node}
        <Rect ref={g11fast} position={[-200, 150]} width={220} height={60} radius={12} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fontWeight={700} fill={T.blue} fontFamily={FONT.sans} text={'低延迟'} />
        </Rect>
        <Txt ref={g11tag} position={[200, 150]} fontSize={SIZE.title} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'快'} opacity={0} />
        <Txt ref={g11disk} position={[0, 215]} fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.sans} text={'记录在磁盘上，只读碰到的几条'} opacity={0} />
      </Node>
    </>
  );

  // h0：单元站牌（r7，skill v1.11.0 开篇规则）：站牌在 h1 开头收成左上角页眉
  const unit = new UnitTitle(CHAPTER, 'u8');
  view.add(unit.nodes());

  yield* beat('h0', unit.enter());

  say('又要接单，又要算报表？');
  yield* beat('h1',
    unit.toHeader(),
    all(g1().opacity(1, 0.5)),
    at('又要接单', all(g1inL().opacity(1, 0.4), g1labL().opacity(1, 0.4))),
    at('算报表', all(g1inR().opacity(1, 0.4), g1labR().opacity(1, 0.4))),
    at('行吗', g1q().opacity(1, 0.4)),
  );

  say('一笔生意，就是一次写');
  yield* beat('h2',
    all(g1().opacity(0, 0.5), g2().opacity(1, 0.5), wCount.node.opacity(1, 0.4)),
    at('一笔生意', chain(
      g2flow().opacity(1, 0.4),
      chain(g2dots[0]().opacity(1, 0.15), g2dots[0]().position([170, -60], 0.8), g2dots[0]().opacity(0, 0.15)),
      chain(g2dots[1]().opacity(1, 0.15), g2dots[1]().position([170, -60], 0.8), g2dots[1]().opacity(0, 0.15)),
      chain(g2dots[2]().opacity(1, 0.15), g2dots[2]().position([170, -60], 0.8), g2dots[2]().opacity(0, 0.15)),
    )),
    at('一次写', chain(g2flow().lineDashOffset(-480, 1.2, linear), wCount.n(1, 0.3))),
  );

  say('一条一条读过去，算出报表要的数');
  yield* beat('h3',
    all(g2().opacity(0, 0.5), g3().opacity(1, 0.5)),
    at('一条一条读过去', chain(
      g3scan().opacity(1, 0.3),
      g3scan().position([240, 50], 1.2),
      all(...g3dots.slice(0, 6).map(r => r().opacity(1, 0.3))),
      all(...g3dots.slice(6, 12).map(r => r().opacity(1, 0.3))),
      all(...g3dots.slice(12, 18).map(r => r().opacity(1, 0.3))),
      all(...g3dots.slice(18, 24).map(r => r().opacity(1, 0.3))),
    )),
    at('算出报表要的数', g3agg().opacity(1, 0.5)),
    at('报表', g3rep().opacity(1, 0.5)),
  );

  say('一次写，就是一笔生意');
  yield* beat('h4',
    all(g3().opacity(0, 0.5), g4().opacity(1, 0.5),
      g4cards[0]().opacity(1, 0.5), g4cards[1]().opacity(1, 0.5), g4cards[2]().opacity(1, 0.5),
      g4db().opacity(1, 0.5), g4dbLab().opacity(1, 0.5)),
    at('卖东西', g4arrows[0]().opacity(1, 0.4)),
    at('给供应商下单', g4arrows[1]().opacity(1, 0.4)),
    at('发员工工资', g4arrows[2]().opacity(1, 0.4)),
  );

  say('一次写，2 处改动，碰 2 条记录');
  yield* beat('h4b',
    all(g4().opacity(0, 0.5), g4b().opacity(1, 0.5), twoCount.node.opacity(1, 0.4)),
    at('合成一次写', g4blab().opacity(1, 0.5)),
    at('记一行订单', g4b1().opacity(1, 0.4)),
    at('库存扣一件', chain(g4b2().opacity(1, 0.4), twoCount.n(2, 0.5))),
    at('添一条新记录', g4b1sub().opacity(1, 0.4)),
    at('改一条已有的记录', g4b2sub().opacity(1, 0.4)),
  );

  say('一组读写，一个逻辑单元');
  yield* beat('h5',
    all(g4b().opacity(0, 0.5), g5().opacity(1, 0.5)),
    at('交易这个词', all(g5read().opacity(1, 0.4), g5write().opacity(1, 0.4))),
    at('逻辑单元', g5lab().opacity(1, 0.5)),
  );

  say('原子性：要么一起成，要么一起不成');
  yield* beat('h5a',
    all(g5sub().opacity(1, 0.5)),
  );

  say('第二处不成，第一处也作废');
  yield* beat('h5e',
    all(g5().opacity(0, 0.5), g5e().opacity(1, 0.5), g5etag().opacity(1, 0.4)),
    at('第二处不成', chain(g5e2().stroke(T.red, 0.4), g5e2note().opacity(1, 0.4))),
    at('第一处也作废', chain(g5e1().opacity(0.35, 0.4), g5ex().opacity(1, 0.4))),
    at('库存一动不动', g5estock().opacity(1, 0.4)),
  );

  say('不一定非要有');
  yield* beat('h5b',
    all(g5e().opacity(0, 0.5), g5b().opacity(1, 0.5)),
    at('常常有的好性质', all(g5bchips[0]().opacity(1, 0.4), g5bchips[1]().opacity(1, 0.4))),
    at('原子性', g5bchips[0]().stroke(T.yellow, 0.4)),
    at('出错了整笔作废', g5bexp[0]().opacity(1, 0.4)),
    at('一致性', g5bchips[1]().stroke(T.yellow, 0.4)),
    at('库存不能变成负数', g5bexp[1]().opacity(1, 0.4)),
    at('不一定非要有', g5btag().opacity(1, 0.5)),
  );

  say('互不踩，不丢失');
  yield* beat('h5d',
    at('隔离性', g5bchips[2]().opacity(1, 0.4)),
    at('互不干扰', g5bexp[2]().opacity(1, 0.4)),
    at('持久性', g5bchips[3]().opacity(1, 0.4)),
    at('提交，就是交易做完', g5bexp[3]().opacity(1, 0.4)),
    at('丢不掉', g5bchips[3]().stroke(T.yellow, 0.4)),
  );

  say('低延迟读写，批处理每天一次');
  yield* beat('h5c',
    all(g5b().opacity(0, 0.5), g5c().opacity(1, 0.5)),
    at('低延迟地读写', g5carrow().opacity(1, 0.5)),
    at('批处理作业', g5cbatch().stroke(T.yellow, 0.4)),
    at('定期报表', g5cnote().opacity(1, 0.5)),
    at('跑分析的一种方式', g5cbatch().stroke(T.green, 0.4)),
  );

  say('只动一条记录');
  yield* beat('h6',
    all(g5c().opacity(0, 0.5), g6().opacity(1, 0.5), oneCount.node.opacity(1, 0.4)),
    at('按键找到那一行', chain(g6row().opacity(1, 0.4), g6row().fill(T.green, 0.4))),
    at('只动这一条记录', oneCount.n(1, 0.3)),
    at('好了', g6ok().opacity(1, 0.5)),
  );

  say('按键查少量记录');
  yield* beat('h7',
    all(g6().opacity(0, 0.5), g7().opacity(1, 0.5)),
    at('记录按用户输入', chain(g7rows[0]().opacity(1, 0.4), g7rows[1]().opacity(1, 0.4), g7rows[2]().opacity(1, 0.4), g7hl().opacity(1, 0.4), g7key().opacity(1, 0.4), g7keyLab().opacity(1, 0.4))),
    at('插入或更新', chain(g7ins().opacity(1, 0.4), g7upd().opacity(1, 0.4))),
    at('联机事务处理', g7plate().opacity(1, 0.5)),
    g7().scale(1.02, beat.dur('h7') - 0.6),
  );

  say('越用越广，还是老样子');
  yield* beat('h8',
    all(g7().opacity(0, 0.5), g8().opacity(1, 0.5)),
    at('博客评论', all(g8cards[0]().opacity(1, 0.4), g8arrows[0]().opacity(1, 0.4), g8db().opacity(1, 0.4))),
    at('游戏里的动作', all(g8cards[1]().opacity(1, 0.4), g8arrows[1]().opacity(1, 0.4))),
    at('通讯录里的联系人', all(g8cards[2]().opacity(1, 0.4), g8arrows[2]().opacity(1, 0.4))),
    at('访问的样子', g8db().stroke(T.yellow, 0.4)),
  );

  say('发一条评论就是写一条记录');
  yield* beat('h8b',
    at('发一条评论', g8subs[0]().opacity(1, 0.4)),
    at('游戏里的动作', g8subs[1]().opacity(1, 0.4)),
    at('查一个联系人', g8subs[2]().opacity(1, 0.4)),
  );

  say('每次只查少量记录');
  yield* beat('h9',
    all(g9().opacity(1, 0.5)),
    at('评论、动作还是联系人', chain(g9arrows[0]().opacity(1, 0.4), g9arrows[1]().opacity(1, 0.4), g9arrows[2]().opacity(1, 0.4))),
    at('少量记录', g9chip().opacity(1, 0.5)),
  );

  say('读和写都要低延迟');
  yield* beat('h10',
    all(g8().opacity(0, 0.5), g9().opacity(0, 0.5), g10().opacity(1, 0.5)),
    at('读和写', all(g10aR().opacity(1, 0.5), g10aW().opacity(1, 0.5))),
    at('低延迟', g10fast().opacity(1, 0.5)),
    at('毫秒级就有回音', g10echo().opacity(1, 0.5)),
    at('毫秒是千分之一秒', g10ms().opacity(1, 0.5)),
  );

  say('查得少，动得少，回得快');
  yield* beat('h11',
    all(g10().opacity(0, 0.5), g11().opacity(1, 0.5), fewCount.node.opacity(1, 0.4)),
    at('只碰几条记录', chain(
      all(...g11dots.slice(0, 4).map(r => r().opacity(1, 0.3))),
      all(...g11dots.slice(4, 8).map(r => r().opacity(1, 0.3))),
      all(...g11dots.slice(8, 12).map(r => r().opacity(1, 0.3))),
      g11dots[0]().fill(T.yellow, 0.4), g11dots[5]().fill(T.yellow, 0.4), g11dots[9]().fill(T.yellow, 0.4),
      fewCount.n(3, 0.8),
    )),
    at('只读碰到的那几条', g11disk().opacity(1, 0.5)),
  );

  say('延迟压得下来');
  yield* beat('h11b',
    at('延迟才压得下来', g11fast().opacity(1, 0.5)),
    at('要的快', g11tag().opacity(1, 0.5)),
  );
});
