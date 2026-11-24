// U8 场景 3（MC）：b20–b30 —— 对照表逐行亮起（按原表重画，红表头改主题色）、五组对照小结、
// 起初同一个库、1980 年代末到 1990 年代初分家、数据仓库、收束。
// 分镜：skill-ch03/beats-u8.md；原文：DDIA §3.7（书页 p91，PDF p113，Table 3-1 原表）。
// 原表逐格核对：主读模式 / 主写模式 / 主要使用者 / 数据代表什么 / 数据集大小 × 事务处理 / 分析系统。
// 时长全部来自 timeline/u8.json（beat() 驱动），不手写 waitFor。
import {Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, chain, createRef} from '@motion-canvas/core';
import {at, makeBeats} from '../../lib/beats';
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

  // b27：起初同一个库
  const g27 = createRef<Node>();
  const g27db = createRef<Rect>();
  const g27labL = createRef<Txt>();
  const g27labR = createRef<Txt>();
  const g27sql = createRef<Rect>();

  // b28：分家时间线
  const g28 = createRef<Node>();
  const g28oltp = createRef<Rect>();
  const g28new = createRef<Rect>();
  const g28arrow = createRef<Line>();
  const g28moveLab = createRef<Txt>();
  const g28line = createRef<Line>();
  const g28tick1 = createRef<Line>();
  const g28tick2 = createRef<Line>();
  const g28lab1 = createRef<Txt>();
  const g28lab2 = createRef<Txt>();

  // b29：数据仓库
  const g29tag = createRef<Txt>();

  // b30：收束两卡
  const g30 = createRef<Node>();
  const g30fast = createRef<Rect>();
  const g30full = createRef<Rect>();
  const g30wh = createRef<Rect>();
  const g30arrow = createRef<Line>();

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
      </Node>

      {/* b27 */}
      <Node ref={g27} opacity={0}>
        <Rect ref={g27db} position={[0, -60]} width={400} height={160} radius={16} fill={T.card} stroke={T.blue} lineWidth={3}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'数据库'} />
        </Rect>
        <Txt ref={g27labL} position={[-380, -60]} fontSize={SIZE.body} fontWeight={700} fill={T.blue} fontFamily={FONT.sans} text={'事务处理'} opacity={0} />
        <Txt ref={g27labR} position={[380, -60]} fontSize={SIZE.body} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'分析查询'} opacity={0} />
        <Rect ref={g27sql} position={[0, -240]} width={200} height={70} radius={12} fill={T.card} stroke={T.yellow} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.yellow} fontFamily={FONT.mono} text={'SQL'} />
        </Rect>
      </Node>

      {/* b28 */}
      <Node ref={g28} opacity={0}>
        <Rect ref={g28oltp} position={[-320, -80]} width={380} height={140} radius={16} fill={T.card} stroke={T.blue} lineWidth={3}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'事务处理的系统'} />
        </Rect>
        <Rect ref={g28new} position={[320, -80]} width={380} height={140} radius={16} fill={T.card} stroke={T.line} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'单独的数据库'} />
        </Rect>
        <Line ref={g28arrow} points={[[-120, -80], [120, -80]]} stroke={T.green} lineWidth={3} endArrow opacity={0} />
        <Txt ref={g28moveLab} position={[0, -170]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} text={'分析改到单独的库跑'} opacity={0} />
        <Line ref={g28line} points={[[-500, 180], [500, 180]]} stroke={T.line} lineWidth={3} opacity={0} />
        <Line ref={g28tick1} points={[[-250, 165], [-250, 195]]} stroke={T.yellow} lineWidth={3} opacity={0} />
        <Line ref={g28tick2} points={[[250, 165], [250, 195]]} stroke={T.yellow} lineWidth={3} opacity={0} />
        <Txt ref={g28lab1} position={[-250, 235]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'一九八零年代末'} opacity={0} />
        <Txt ref={g28lab2} position={[250, 235]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'一九九零年代初'} opacity={0} />
      </Node>
      <Txt ref={g29tag} position={[320, -190]} fontSize={SIZE.body} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'数据仓库'} opacity={0} />

      {/* b30 */}
      <Node ref={g30} opacity={0}>
        <Rect ref={g30fast} position={[-290, -100]} width={420} height={130} radius={16} fill={T.card} stroke={T.blue} lineWidth={3}>
          <Txt fontSize={SIZE.title} fontWeight={700} fill={T.blue} fontFamily={FONT.sans} text={'接单要快'} />
        </Rect>
        <Rect ref={g30full} position={[290, -100]} width={420} height={130} radius={16} fill={T.card} stroke={T.green} lineWidth={3}>
          <Txt fontSize={SIZE.title} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'算账要全'} />
        </Rect>
        <Line ref={g30arrow} points={[[290, -25], [290, 55]]} stroke={T.green} lineWidth={3} endArrow opacity={0} />
        <Rect ref={g30wh} position={[290, 120]} width={260} height={70} radius={12} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'数据仓库'} />
        </Rect>
      </Node>
    </>
  );

  const showRow = (r: number) =>
    chain(
      rowBg[r]().opacity(1, 0.4),
      rowHl[r]().opacity(0.16, 0.4),
      all(rowTxt[r][0]().opacity(1, 0.3), rowTxt[r][1]().opacity(1, 0.3), rowTxt[r][2]().opacity(1, 0.3)),
    );

  say('特征、事务处理、分析系统');
  yield* beat('b20',
    all(tab().opacity(1, 0.5)),
    at('特征', all(tabTitle().opacity(1, 0.4), tabHeadBg().opacity(1, 0.4), tabHeadTxt[0]().opacity(1, 0.4))),
    at('事务处理', tabHeadTxt[1]().opacity(1, 0.4)),
    at('分析系统', tabHeadTxt[2]().opacity(1, 0.4)),
  );

  say('主读模式');
  yield* beat('b21',
    showRow(0),
    at('少量记录、按键取', rowTxt[0][1]().fill(T.yellow, 0.4)),
    at('海量记录做聚合', rowTxt[0][2]().fill(T.yellow, 0.4)),
    tab().scale(1.01, beat.dur('b21') - 0.6),
  );

  say('主写模式');
  yield* beat('b22',
    showRow(1),
    at('低延迟', rowTxt[1][1]().fill(T.yellow, 0.4)),
    at('批量导入', rowTxt[1][2]().fill(T.yellow, 0.4)),
    tab().scale(1.01, beat.dur('b22') - 0.6),
  );

  say('主要使用者');
  yield* beat('b23',
    showRow(2),
    at('终端用户、顾客', rowTxt[2][1]().fill(T.yellow, 0.4)),
    at('内部分析师', rowTxt[2][2]().fill(T.yellow, 0.4)),
    tab().scale(1.01, beat.dur('b23') - 0.6),
  );

  say('数据代表什么');
  yield* beat('b24',
    showRow(3),
    at('最新状态', rowTxt[3][1]().fill(T.yellow, 0.4)),
    at('随时间发生的事件历史', rowTxt[3][2]().fill(T.yellow, 0.4)),
    tab().scale(1.01, beat.dur('b24') - 0.6),
  );

  say('数据集大小');
  yield* beat('b25a',
    chain(
      rowBg[4]().opacity(1, 0.4),
      rowHl[4]().opacity(0.16, 0.4),
      all(rowTxt[4][0]().opacity(1, 0.3), rowTxt[4][1]().opacity(1, 0.3)),
    ),
    at('GB 到 TB', rowTxt[4][1]().fill(T.yellow, 0.4)),
  );

  say('TB 到 PB');
  yield* beat('b25b',
    all(rowTxt[4][2]().opacity(1, 0.4)),
    at('TB 到 PB', rowTxt[4][2]().fill(T.yellow, 0.4)),
  );

  say('接单要快，算账要全');
  yield* beat('b26',
    all(tabBorder().opacity(1, 0.5)),
    at('接单要快', tagFast().opacity(1, 0.5)),
    at('算账要全', tagFull().opacity(1, 0.5)),
    tab().scale(1.01, beat.dur('b26') - 0.6),
  );

  say('一个库，两边都适用');
  yield* beat('b27',
    all(tab().opacity(0, 0.5), g27().opacity(1, 0.5)),
    at('事务处理', g27labL().opacity(1, 0.4)),
    at('分析查询', g27labR().opacity(1, 0.4)),
    at('SQL', g27sql().opacity(1, 0.5)),
    g27().scale(1.02, beat.dur('b27') - 0.6),
  );

  say('一九八零年代末到一九九零年代初');
  yield* beat('b28',
    all(g27().opacity(0, 0.5), g28().opacity(1, 0.5)),
    at('一九八零年代末', all(g28line().opacity(1, 0.4), g28tick1().opacity(1, 0.4), g28lab1().opacity(1, 0.4))),
    at('一九九零年代初', all(g28tick2().opacity(1, 0.4), g28lab2().opacity(1, 0.4))),
    at('不再拿事务处理的系统做分析', all(g28arrow().opacity(1, 0.4), g28moveLab().opacity(1, 0.4))),
    at('单独的数据库', g28new().opacity(1, 0.5)),
    g28().scale(1.01, beat.dur('b28') - 0.6),
  );

  say('数据仓库');
  yield* beat('b29',
    all(g29tag().opacity(1, 0.5)),
    at('数据仓库', g28new().stroke(T.green, 0.4)),
  );

  say('接单要快，算账要全');
  yield* beat('b30',
    all(g28().opacity(0, 0.5), g29tag().opacity(0, 0.4), g30().opacity(1, 0.5)),
    at('分析搬了家', all(g30arrow().opacity(1, 0.4), g30wh().opacity(1, 0.5))),
    g30().scale(1.02, beat.dur('b30') - 0.6),
  );
});
