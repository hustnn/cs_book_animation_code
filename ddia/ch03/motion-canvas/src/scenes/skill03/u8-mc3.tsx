// U8 场景 3（MC）：h20–h26d —— 对照表逐行亮起（按原表重画，红表头改主题色）、
// 起初同一个库、1980 年代末到 1990 年代初分家、数据仓库、收束。
// 分镜：skill-ch03/beats-u8.md；原文：DDIA §3.7（书页 p91，PDF p113，Table 3-1 原表）。
// 原表逐格核对：主读模式 / 主写模式 / 主要使用者 / 数据代表什么 / 数据集大小 × 事务处理 / 分析系统。
// 时长全部来自 timeline/u8.json（beat() 驱动），不手写 waitFor。
import {Circle, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, chain, createRef} from '@motion-canvas/core';
import {at, makeBeats} from '../../lib/beats';
import {Counter} from '../../lib/schemas';
import {FONT, SAFE, SIZE, T} from '../../lib/theme';
import timeline from '../../timeline/u8.json';

// 表格几何：三列（200 / 440 / 440），六行（表头 56 + 五行 × 62）
const COL_X = [-460, -120, 340];
const COL_W = [200, 440, 440];
const ROW_Y = [-232, -173, -111, -49, 13, 75];
const ROW_H = [56, 62, 62, 62, 62, 62];
const HEADER = ['特征', '事务处理 OLTP', '分析系统 OLAP'];
const ROWS: string[][] = [
  ['主读模式', '每次少量记录、按键取', '对海量记录做聚合'],
  ['主写模式', '用户输入的随机写，要求低延迟', '批量导入，或者事件流'],
  ['主要使用者', '终端用户、顾客，通过网络应用', '内部分析师，为决策支持服务'],
  ['数据代表什么', '最新状态，也就是当前这一刻', '随时间发生的事件历史'],
  ['数据集大小', 'GB 到 TB', 'TB 到 PB'],
];

export default makeScene2D(function* (view) {
  view.fill(T.bg);
  const beat = makeBeats(timeline);

  const header = createRef<Txt>();
  const anchor = createRef<Txt>();
  const say = (text: string) => anchor().text(text);

  // h20：两边有重叠，随后对照表出现
  const g20 = createRef<Node>();
  const g20oltp = createRef<Rect>();
  const g20olap = createRef<Rect>();
  const g20over = createRef<Rect>();
  const g20overLab = createRef<Txt>();
  const g20note = createRef<Txt>();
  const g20ex = createRef<Txt>();

  // 对照表
  const tab = createRef<Node>();
  const tabTitle = createRef<Txt>();
  const tabHeadBg = createRef<Rect>();
  const tabHeadTxt = HEADER.map(() => createRef<Txt>());
  const rowBg = ROWS.map(() => createRef<Rect>());
  const rowHl = ROWS.map(() => createRef<Rect>());
  const rowTxt = ROWS.map(() => [0, 1, 2].map(() => createRef<Txt>()));
  const tabBorder = createRef<Rect>();
  const tagFast = createRef<Txt>();
  const tagFull = createRef<Txt>();
  const rowCount = new Counter([0, 230], '已对照 ', ' 组');

  // 演示拍例子（r4）：每行一对，接单（蓝）/ 分析（绿），放在表内随表淡出
  const ex20L = createRef<Txt>();
  const ex20R = createRef<Txt>();
  const ex21L = createRef<Txt>();
  const ex21R = createRef<Txt>();
  const ex22L = createRef<Txt>();
  const ex22R = createRef<Txt>();
  const ex23L = createRef<Txt>();
  const ex23R = createRef<Txt>();
  const ex24L = createRef<Txt>();
  const ex24R = createRef<Txt>();
  const g24q = createRef<Txt>();
  const g24t = createRef<Txt>();
  const g21cL = createRef<Txt>();
  const g21cR = createRef<Txt>();

  // h25：预先做好的报表 vs 分析师现写新问题出图（r5：对照）
  const g25 = createRef<Node>();
  const g25rep = createRef<Rect>();
  const g25repSub = createRef<Txt>();
  const g25ana = createRef<Rect>();
  const g25chart = createRef<Rect>();
  const g25bars = [0, 1, 2].map(() => createRef<Rect>());
  const g25lab = createRef<Txt>();
  const g25best = createRef<Txt>();
  const g25storeLabs = [0, 1, 2].map(() => createRef<Txt>());

  // h26：起初同一个库
  const g26 = createRef<Node>();
  const g26db = createRef<Rect>();
  const g26labL = createRef<Txt>();
  const g26labR = createRef<Txt>();
  const g26sql = createRef<Rect>();

  // h26b：分家时间线
  const g26b = createRef<Node>();
  const g26boltp = createRef<Rect>();
  const g26bnew = createRef<Rect>();
  const g26barrow = createRef<Line>();
  const g26bmoveLab = createRef<Txt>();
  const g26bline = createRef<Line>();
  const g26btick1 = createRef<Line>();
  const g26btick2 = createRef<Line>();
  const g26blab1 = createRef<Txt>();
  const g26blab2 = createRef<Txt>();

  // h26c：数据仓库标签 + 收束两卡
  const g26ctag = createRef<Txt>();
  const g26c = createRef<Node>();
  const g26cfast = createRef<Rect>();
  const g26cfull = createRef<Rect>();
  const g26cwh = createRef<Rect>();
  const g26carrow = createRef<Line>();
  const g26dq = [0, 1, 2].map(() => createRef<Circle>());
  const g26dqlab = createRef<Txt>();

  const flatCells = ROWS.flatMap((row, r) =>
    row.map((text, c) => ({r, c, text})),
  );

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

      {/* h20：重叠带 */}
      <Node ref={g20} opacity={0}>
        <Rect ref={g20oltp} position={[-290, -60]} width={440} height={220} radius={16} fill={T.card} stroke={T.blue} lineWidth={3} opacity={0}>
          <Txt position={[0, -70]} fontSize={SIZE.body} fontWeight={700} fill={T.blue} fontFamily={FONT.mono} text={'OLTP'} />
        </Rect>
        <Rect ref={g20olap} position={[290, -60]} width={440} height={220} radius={16} fill={T.card} stroke={T.green} lineWidth={3} opacity={0}>
          <Txt position={[0, -70]} fontSize={SIZE.body} fontWeight={700} fill={T.green} fontFamily={FONT.mono} text={'OLAP'} />
        </Rect>
        <Rect ref={g20over} position={[0, -60]} width={200} height={220} radius={12} fill={T.purple} opacity={0} />
        <Txt ref={g20overLab} position={[0, 0]} fontSize={SIZE.label} fill={T.white} fontFamily={FONT.sans} text={'有重叠'} opacity={0} />
        <Txt ref={g20note} position={[0, 90]} fontSize={SIZE.body} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'起初同一个库，两边都做'} opacity={0} />
        <Txt ref={g20ex} position={[0, 150]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'比如：在接单库上算今日销售额'} opacity={0} />
      </Node>

      {/* 对照表 */}
      <Node ref={tab} opacity={0}>
        <Txt ref={tabTitle} position={[0, -296]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'事务处理和分析系统对照'} opacity={0} />
        <Rect ref={tabHeadBg} position={[0, ROW_Y[0]]} width={1120} height={ROW_H[0]} fill={T.blue} opacity={0} />
        {HEADER.map((text, c) => (
          <Txt
            key={`hh-${c}`}
            ref={tabHeadTxt[c]}
            position={[COL_X[c], ROW_Y[0]]}
            fontSize={SIZE.label}
            fontWeight={700}
            fill={T.white}
            fontFamily={FONT.sans}
            text={text}
            opacity={0}
          />
        ))}
        {ROWS.map((row, r) => (
          <Rect
            key={`rowbg-${r}`}
            ref={rowBg[r]}
            position={[0, ROW_Y[r + 1]]}
            width={1120}
            height={ROW_H[r + 1]}
            fill={T.card}
            stroke={T.line}
            lineWidth={1}
            opacity={0}
          />
        ))}
        {ROWS.map((row, r) => (
          <Rect
            key={`rowhl-${r}`}
            ref={rowHl[r]}
            position={[0, ROW_Y[r + 1]]}
            width={1120}
            height={ROW_H[r + 1]}
            fill={T.yellow}
            opacity={0}
          />
        ))}
        {flatCells.map(({r, c, text}) => (
          <Txt
            key={`cell-${r}-${c}`}
            ref={rowTxt[r][c]}
            position={[COL_X[c], ROW_Y[r + 1]]}
            fontSize={20}
            fill={c === 0 ? T.text : T.text}
            fontFamily={FONT.sans}
            textAlign={'center'}
            textWrap
            maxWidth={COL_W[c] - 24}
            text={text}
            opacity={0}
          />
        ))}
        <Rect ref={tabBorder} position={[0, -78]} width={1124} height={368} stroke={T.yellow} lineWidth={3} opacity={0} />
        <Txt ref={tagFast} position={[-120, 165]} fontSize={SIZE.body} fontWeight={700} fill={T.blue} fontFamily={FONT.sans} text={'接单要快'} opacity={0} />
        <Txt ref={tagFull} position={[340, 165]} fontSize={SIZE.body} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'算账要全'} opacity={0} />
        {/* 演示拍例子 */}
        <Txt ref={ex20L} position={[-290, 175]} fontSize={20} fill={T.blue} fontFamily={FONT.sans} textAlign={'center'} textWrap maxWidth={520} text={'接单：查一个订单，按键找到那一行'} opacity={0} />
        <Txt ref={ex20R} position={[290, 175]} fontSize={20} fill={T.green} fontFamily={FONT.sans} textAlign={'center'} textWrap maxWidth={520} text={'分析：每家店一月份总收入，扫一月份销售按店加总'} opacity={0} />
        <Txt ref={ex21L} position={[-290, 175]} fontSize={20} fill={T.blue} fontFamily={FONT.sans} textAlign={'center'} textWrap maxWidth={520} text={'接单：顾客下单，用户输入的随机写'} opacity={0} />
        <Txt ref={ex21R} position={[290, 175]} fontSize={20} fill={T.green} fontFamily={FONT.sans} textAlign={'center'} textWrap maxWidth={520} text={'分析：每晚批量导，或事件流一直往里记'} opacity={0} />
        <Txt ref={g21cL} position={[-290, 230]} fontSize={20} fill={T.blue} fontFamily={FONT.sans} textAlign={'center'} textWrap maxWidth={520} text={'接单写：用户在等回音，要低延迟'} opacity={0} />
        <Txt ref={g21cR} position={[290, 230]} fontSize={20} fill={T.green} fontFamily={FONT.sans} textAlign={'center'} textWrap maxWidth={520} text={'事件流：记下就走，不等回话'} opacity={0} />
        <Txt ref={ex22L} position={[-290, 175]} fontSize={20} fill={T.blue} fontFamily={FONT.sans} textAlign={'center'} textWrap maxWidth={520} text={'接单：顾客在网上应用里下单'} opacity={0} />
        <Txt ref={ex22R} position={[290, 175]} fontSize={20} fill={T.green} fontFamily={FONT.sans} textAlign={'center'} textWrap maxWidth={520} text={'分析：业务分析师写查询，报告帮决策'} opacity={0} />
        <Txt ref={ex23L} position={[-290, 175]} fontSize={20} fill={T.blue} fontFamily={FONT.sans} textAlign={'center'} textWrap maxWidth={520} text={'接单：库存表里某商品现在还剩几件'} opacity={0} />
        <Txt ref={ex23R} position={[290, 175]} fontSize={20} fill={T.green} fontFamily={FONT.sans} textAlign={'center'} textWrap maxWidth={520} text={'分析：过去一年的销售记录，按时间排着'} opacity={0} />
        <Txt ref={ex24L} position={[-290, 175]} fontSize={20} fill={T.blue} fontFamily={FONT.sans} textAlign={'center'} textWrap maxWidth={520} text={'接单：小店订单库，只有几个 GB'} opacity={0} />
        <Txt ref={ex24R} position={[290, 175]} fontSize={20} fill={T.green} fontFamily={FONT.sans} textAlign={'center'} textWrap maxWidth={520} text={'分析：大厂仓库，能到 PB 级'} opacity={0} />
        <Txt ref={g24q} position={[0, 175]} fontSize={20} fill={T.yellow} fontFamily={FONT.sans} textAlign={'center'} textWrap maxWidth={900} text={'一个 TB 的库是哪边？看接单还是算账，不看大小'} opacity={0} />
        <Txt ref={g24t} position={[-400, 230]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'典型情况，不是两端极端'} opacity={0} />
        {rowCount.node}
      </Node>

      {/* h25 */}
      <Node ref={g25} opacity={0}>
        <Rect ref={g25rep} position={[-320, -60]} width={420} height={160} radius={16} fill={T.card} stroke={T.line} lineWidth={2} opacity={0}>
          <Txt position={[0, -20]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'预先做好的报表'} />
          <Txt ref={g25repSub} position={[0, 40]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'数都定好了'} opacity={0} />
        </Rect>
        <Rect ref={g25ana} position={[320, -140]} width={400} height={100} radius={14} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fontWeight={700} fill={T.text} fontFamily={FONT.sans} textAlign={'center'} textWrap maxWidth={360} text={'上个月哪个店的香蕉卖得最好？'} />
        </Rect>
        <Txt ref={g25best} position={[440, -55]} fontSize={SIZE.label} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'卖得最好'} opacity={0} />
        <Rect ref={g25chart} position={[320, 30]} width={400} height={120} radius={14} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt position={[0, -38]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'现算出来的图'} />
          {[0, 1, 2].map(i => (
            <Rect
              key={`g25b-${i}`}
              ref={g25bars[i]}
              position={[-120 + i * 120, 45 - [15, 27, 40][i]]}
              width={50}
              height={[30, 55, 80][i]}
              radius={6}
              fill={T.green}
              opacity={0}
            />
          ))}
          {[0, 1, 2].map(i => (
            <Txt
              key={`g25s-${i}`}
              ref={g25storeLabs[i]}
              position={[-120 + i * 120, 78]}
              fontSize={SIZE.min}
              fill={T.muted}
              fontFamily={FONT.sans}
              text={['店 A', '店 B', '店 C'][i]}
              opacity={0}
            />
          ))}
        </Rect>
        <Txt ref={g25lab} position={[320, 140]} fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.sans} text={'探索性查询'} opacity={0} />
      </Node>

      {/* h26 */}
      <Node ref={g26} opacity={0}>
        <Rect ref={g26db} position={[0, -60]} width={400} height={160} radius={16} fill={T.card} stroke={T.blue} lineWidth={3}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'数据库'} />
        </Rect>
        <Txt ref={g26labL} position={[-380, -60]} fontSize={SIZE.body} fontWeight={700} fill={T.blue} fontFamily={FONT.sans} text={'事务处理'} opacity={0} />
        <Txt ref={g26labR} position={[380, -60]} fontSize={SIZE.body} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'分析查询'} opacity={0} />
        <Rect ref={g26sql} position={[0, -240]} width={200} height={70} radius={12} fill={T.card} stroke={T.yellow} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.yellow} fontFamily={FONT.mono} text={'SQL'} />
        </Rect>
      </Node>

      {/* h26b */}
      <Node ref={g26b} opacity={0}>
        <Rect ref={g26boltp} position={[-320, -80]} width={380} height={140} radius={16} fill={T.card} stroke={T.blue} lineWidth={3}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'事务处理的系统'} />
        </Rect>
        <Rect ref={g26bnew} position={[320, -80]} width={380} height={140} radius={16} fill={T.card} stroke={T.line} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'单独的数据库'} />
        </Rect>
        <Line ref={g26barrow} points={[[-120, -80], [120, -80]]} stroke={T.green} lineWidth={3} endArrow opacity={0} />
        <Txt ref={g26bmoveLab} position={[0, -170]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} text={'分析改到单独的库跑'} opacity={0} />
        <Line ref={g26bline} points={[[-500, 180], [500, 180]]} stroke={T.line} lineWidth={3} opacity={0} />
        <Line ref={g26btick1} points={[[-250, 165], [-250, 195]]} stroke={T.yellow} lineWidth={3} opacity={0} />
        <Line ref={g26btick2} points={[[250, 165], [250, 195]]} stroke={T.yellow} lineWidth={3} opacity={0} />
        <Txt ref={g26blab1} position={[-250, 235]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'一九八零年代末'} opacity={0} />
        <Txt ref={g26blab2} position={[250, 235]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'一九九零年代初'} opacity={0} />
      </Node>
      <Txt ref={g26ctag} position={[320, -190]} fontSize={SIZE.body} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'数据仓库'} opacity={0} />

      {/* h26c */}
      <Node ref={g26c} opacity={0}>
        <Rect ref={g26cfast} position={[-290, -100]} width={420} height={130} radius={16} fill={T.card} stroke={T.blue} lineWidth={3}>
          <Txt fontSize={SIZE.title} fontWeight={700} fill={T.blue} fontFamily={FONT.sans} text={'接单要快'} />
        </Rect>
        <Rect ref={g26cfull} position={[290, -100]} width={420} height={130} radius={16} fill={T.card} stroke={T.green} lineWidth={3}>
          <Txt fontSize={SIZE.title} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'算账要全'} />
        </Rect>
        <Line ref={g26carrow} points={[[290, -25], [290, 55]]} stroke={T.green} lineWidth={3} endArrow opacity={0} />
        <Rect ref={g26cwh} position={[290, 120]} width={260} height={70} radius={12} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'数据仓库'} />
        </Rect>
        {[0, 1, 2].map(i => (
          <Circle key={`g26dq-${i}`} ref={g26dq[i]} position={[-380 + i * 90, 120]} width={26} height={26} fill={T.blue} opacity={0} />
        ))}
        <Txt ref={g26dqlab} position={[-290, 175]} fontSize={SIZE.label} fill={T.blue} fontFamily={FONT.sans} text={'接单排队'} opacity={0} />
      </Node>
    </>
  );

  const showRow = (r: number) =>
    chain(
      rowBg[r]().opacity(1, 0.4),
      rowHl[r]().opacity(0.16, 0.4),
      all(rowTxt[r][0]().opacity(1, 0.3), rowTxt[r][1]().opacity(1, 0.3), rowTxt[r][2]().opacity(1, 0.3)),
    );

  say('差别并非泾渭分明');
  yield* beat('h20',
    all(g20().opacity(1, 0.5)),
    at('并非总是泾渭分明', chain(g20oltp().opacity(1, 0.4), g20olap().opacity(1, 0.4), g20over().opacity(0.35, 0.5), g20overLab().opacity(1, 0.4))),
    at('起初同一个库', g20note().opacity(1, 0.5)),
    at('比如在接单库上', g20ex().opacity(1, 0.5)),
    tab().scale(1.01, beat.dur('h20') - 0.6),
    at('对照表', all(
      g20oltp().opacity(0, 0.4), g20olap().opacity(0, 0.4), g20over().opacity(0, 0.4), g20overLab().opacity(0, 0.4),
      g20note().opacity(0, 0.4), g20ex().opacity(0, 0.4),
      tab().opacity(1, 0.5),
      tabTitle().opacity(1, 0.4), tabHeadBg().opacity(1, 0.4),
      tabHeadTxt[0]().opacity(1, 0.4), tabHeadTxt[1]().opacity(1, 0.4), tabHeadTxt[2]().opacity(1, 0.4),
      rowCount.node.opacity(1, 0.4),
    )),
  );

  say('主读模式');
  yield* beat('h20b',
    showRow(0),
    rowCount.n(1, 0.3),
    at('少量记录、按键取', rowTxt[0][1]().fill(T.yellow, 0.4)),
    at('海量记录做聚合', rowTxt[0][2]().fill(T.yellow, 0.4)),
    tab().scale(1.01, beat.dur('h20b') - 0.6),
  );

  say('主读模式：查订单 vs 算总收入');
  yield* beat('h20c',
    all(ex20L().opacity(1, 0.4), ex20R().opacity(1, 0.4)),
    at('分析那边', ex20R().fill(T.yellow, 0.4)),
    tab().scale(1.01, beat.dur('h20c') - 0.6),
  );

  say('主写模式');
  yield* beat('h21',
    showRow(1),
    all(ex20L().opacity(0, 0.4), ex20R().opacity(0, 0.4)),
    rowCount.n(2, 0.3),
    at('低延迟', rowTxt[1][1]().fill(T.yellow, 0.4)),
    at('批量导入', rowTxt[1][2]().fill(T.yellow, 0.4)),
    tab().scale(1.01, beat.dur('h21') - 0.6),
  );

  say('主写模式：下单 vs 批量导入');
  yield* beat('h21b',
    all(ex21L().opacity(1, 0.4), ex21R().opacity(1, 0.4)),
    at('分析是每晚', ex21R().fill(T.yellow, 0.4)),
    at('事件流就是交易一发生', rowTxt[1][2]().fill(T.green, 0.4)),
    tab().scale(1.01, beat.dur('h21b') - 0.6),
  );

  say('事件流 vs 随机写，两种都可以');
  yield* beat('h21c',
    at('事件流记下来就走', g21cR().opacity(1, 0.4)),
    at('用户在等回音', g21cL().opacity(1, 0.4)),
    at('两种都可以', ex21R().fill(T.yellow, 0.4)),
    tab().scale(1.01, beat.dur('h21c') - 0.6),
  );

  say('主要使用者');
  yield* beat('h22',
    showRow(2),
    all(ex21L().opacity(0, 0.4), ex21R().opacity(0, 0.4), g21cL().opacity(0, 0.4), g21cR().opacity(0, 0.4)),
    rowCount.n(3, 0.3),
    at('终端用户、顾客', rowTxt[2][1]().fill(T.yellow, 0.4)),
    at('内部分析师', rowTxt[2][2]().fill(T.yellow, 0.4)),
    tab().scale(1.01, beat.dur('h22') - 0.6),
  );

  say('主要使用者：顾客 vs 分析师');
  yield* beat('h22b',
    all(ex22L().opacity(1, 0.4), ex22R().opacity(1, 0.4)),
    at('分析那边', ex22R().fill(T.yellow, 0.4)),
    tab().scale(1.01, beat.dur('h22b') - 0.6),
  );

  say('数据代表什么');
  yield* beat('h23',
    showRow(3),
    all(ex22L().opacity(0, 0.4), ex22R().opacity(0, 0.4)),
    rowCount.n(4, 0.3),
    at('最新状态', rowTxt[3][1]().fill(T.yellow, 0.4)),
    at('随时间发生的事件历史', rowTxt[3][2]().fill(T.yellow, 0.4)),
    tab().scale(1.01, beat.dur('h23') - 0.6),
  );

  say('数据代表什么：还剩几件 vs 销售记录');
  yield* beat('h23b',
    all(ex23L().opacity(1, 0.4), ex23R().opacity(1, 0.4)),
    at('分析那边', ex23R().fill(T.yellow, 0.4)),
    tab().scale(1.01, beat.dur('h23b') - 0.6),
  );

  say('数据集大小');
  yield* beat('h24',
    chain(
      rowBg[4]().opacity(1, 0.4),
      rowHl[4]().opacity(0.16, 0.4),
      all(rowTxt[4][0]().opacity(1, 0.3), rowTxt[4][1]().opacity(1, 0.3)),
    ),
    all(ex23L().opacity(0, 0.4), ex23R().opacity(0, 0.4)),
    rowCount.n(5, 0.3),
    at('GB 到 TB', rowTxt[4][1]().fill(T.yellow, 0.4)),
  );

  say('TB 到 PB，两边都含 TB');
  yield* beat('h24b',
    all(rowTxt[4][2]().opacity(1, 0.4)),
    at('TB 到 PB', rowTxt[4][2]().fill(T.yellow, 0.4)),
    at('看它是接单还是算账', g24q().opacity(1, 0.4)),
    tab().scale(1.01, beat.dur('h24b') - 0.6),
  );

  say('数据集大小：GB 级 vs PB 级');
  yield* beat('h24c',
    all(ex24L().opacity(1, 0.4), ex24R().opacity(1, 0.4), g24q().opacity(0, 0.4)),
    at('分析那边', ex24R().fill(T.yellow, 0.4)),
    at('小店几个 GB', ex24L().fill(T.yellow, 0.4)),
    at('说的是典型情况', g24t().opacity(1, 0.4)),
    tab().scale(1.01, beat.dur('h24c') - 0.6),
  );

  say('不只看报表，还能交互探索');
  yield* beat('h25',
    all(tab().opacity(0, 0.5), g25().opacity(1, 0.5)),
    at('预先做好的报表', all(g25rep().opacity(1, 0.5), g25repSub().opacity(1, 0.4))),
    at('分析师', g25ana().opacity(1, 0.5)),
    at('香蕉卖得最好', g25best().opacity(1, 0.5)),
    at('现写个查询', chain(
      g25chart().opacity(1, 0.5),
      all(g25bars[0]().opacity(1, 0.3), g25bars[1]().opacity(1, 0.3), g25bars[2]().opacity(1, 0.3)),
      all(g25storeLabs[0]().opacity(1, 0.3), g25storeLabs[1]().opacity(1, 0.3), g25storeLabs[2]().opacity(1, 0.3)),
      g25lab().opacity(1, 0.5),
    )),
    g25().scale(1.02, beat.dur('h25') - 0.6),
  );

  say('一个库，两边都适用');
  yield* beat('h26',
    all(g25().opacity(0, 0.5), g26().opacity(1, 0.5)),
    at('事务处理', g26labL().opacity(1, 0.4)),
    at('分析查询', g26labR().opacity(1, 0.4)),
    at('SQL', g26sql().opacity(1, 0.5)),
    g26().scale(1.02, beat.dur('h26') - 0.6),
  );

  say('一九八零年代末到一九九零年代初');
  yield* beat('h26b',
    all(g26().opacity(0, 0.5), g26b().opacity(1, 0.5)),
    at('一九八零年代末', all(g26bline().opacity(1, 0.4), g26btick1().opacity(1, 0.4), g26blab1().opacity(1, 0.4))),
    at('一九九零年代初', all(g26btick2().opacity(1, 0.4), g26blab2().opacity(1, 0.4))),
    at('不再拿事务处理的系统做分析', all(g26barrow().opacity(1, 0.4), g26bmoveLab().opacity(1, 0.4))),
    at('单独的数据库', g26bnew().opacity(1, 0.5)),
    g26b().scale(1.01, beat.dur('h26b') - 0.6),
  );

  say('接单要快，算账要全');
  yield* beat('h26c',
    all(g26ctag().opacity(1, 0.5)),
    at('数据仓库', g26bnew().stroke(T.green, 0.4)),
    at('接单要快', all(g26b().opacity(0, 0.5), g26ctag().opacity(0, 0.4), g26c().opacity(1, 0.5))),
    at('分析搬了家', all(g26carrow().opacity(1, 0.4), g26cwh().opacity(1, 0.5))),
    g26c().scale(1.02, beat.dur('h26c') - 0.6),
  );

  say('库忙着算账，接单就得排队');
  yield* beat('h26d',
    at('分析查询一扫就是海量记录', g26cfull().stroke(T.yellow, 0.4)),
    at('接单就得排队', chain(
      all(g26dq[0]().opacity(1, 0.3), g26dq[1]().opacity(1, 0.3), g26dq[2]().opacity(1, 0.3)),
      g26dqlab().opacity(1, 0.5),
    )),
  );
});
