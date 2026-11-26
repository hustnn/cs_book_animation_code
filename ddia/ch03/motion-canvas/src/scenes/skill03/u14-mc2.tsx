// U14 场景 2（MC，r3）：n12–n22 —— 数据立方体二维表（按原图 3-12 重新生成）、三个 SQL 标注框、total 陷阱。
// 分镜：skill-ch03/beats-u14.md；原文：DDIA §3.14（书页 p102，PDF p124）。
// 原图数字逐格核对（pg-124.png）：140101 行 149.60、31.01、84.58、28.18，total 40710.53；
// 140102 行 132.18、19.78、82.91、10.96，total 73091.28；140103 行 196.75、0.00、12.52、64.67，
// total 54688.10；140104 行 178.36、9.98、88.75、56.16，total 95121.09；
// 列 total：14967.09、5910.43、7328.85、6885.39；右下角 total 格写着 lots（照原样保留）。
// r3 改动：拍号改用设计的 n 拍号；n14/n15、n16/n17、n21/n22 拆拍；n20 为演示拍（hold 2s），网格推近看省略号。
// 时长全部来自 timeline/u14.json（beat() 驱动），不手写 waitFor。
import {Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, chain, createRef} from '@motion-canvas/core';
import {at, makeBeats} from '../../lib/beats';
import {Cam} from '../../lib/schemas';
import {FONT, SAFE, SIZE, T} from '../../lib/theme';
import timeline from '../../timeline/u14.json';

// 网格几何：列中心 x（标签列 / 4 个产品列 / 省略列 / total 列），行中心 y（表头 / 4 天 / 省略行 / total 行）
const COL_X = [-315, -212.5, -97.5, 17.5, 132.5, 215, 300];
const COL_W = [90, 115, 115, 115, 115, 50, 120];
const ROW_Y = [-187, -141, -95, -49, -3, 43, 89];
const ROW_H = 46;
const ROW_HEADS = ['140101', '140102', '140103', '140104', '……', 'total'];
const COL_HEADS = ['32', '33', '34', '35', '……', 'total'];
const DATA: string[][] = [
  ['149.60', '31.01', '84.58', '28.18'],
  ['132.18', '19.78', '82.91', '10.96'],
  ['196.75', '0.00', '12.52', '64.67'],
  ['178.36', '9.98', '88.75', '56.16'],
];
const ROW_TOTALS = ['40710.53', '73091.28', '54688.10', '95121.09'];
const COL_TOTALS = ['14967.09', '5910.43', '7328.85', '6885.39'];

export default makeScene2D(function* (view) {
  view.fill(T.bg);
  const beat = makeBeats(timeline);

  const header = createRef<Txt>();
  const anchor = createRef<Txt>();
  const say = (text: string) => anchor().text(text);

  const grid = createRef<Node>();
  const rowHeads = ROW_HEADS.map(() => createRef<Txt>());
  const colHeads = COL_HEADS.map(() => createRef<Txt>());
  const dateKeyLab = createRef<Txt>();
  const prodSkLab = createRef<Txt>();
  const dataVals = DATA.flatMap(row => row.map(() => createRef<Txt>()));
  const ellTxts = Array.from({length: 11}, () => createRef<Txt>());
  const rowTotTxts = ROW_TOTALS.map(() => createRef<Txt>());
  const colTotTxts = COL_TOTALS.map(() => createRef<Txt>());
  const lotsTxt = createRef<Txt>();
  const hlRow0 = createRef<Rect>();
  const hlCol0 = createRef<Rect>();
  const hlCell = createRef<Rect>();
  const hlRowTot = createRef<Rect>();
  const hlColTot = createRef<Rect>();
  const hlLots = createRef<Rect>();
  const hlRowCells = [0, 1, 2, 3].map(() => createRef<Rect>());
  const ellRowHL = createRef<Rect>();
  const ellColHL = createRef<Rect>();
  const rowPlus = [0, 1, 2].map(() => createRef<Txt>());
  const colPlus = [0, 1, 2].map(() => createRef<Txt>());

  const boxA = createRef<Rect>();
  const arrowA = createRef<Line>();
  const boxB = createRef<Rect>();
  const arrowB = createRef<Line>();
  const boxC = createRef<Rect>();
  const arrowC = createRef<Line>();

  const sumTxt = createRef<Txt>();
  const sumRes = createRef<Txt>();

  // 省略号格子的位置：省略行（第 6 行）× 产品列/省略列/ total 列共 5 格（标签列那格已是行头“……”）；
  // 省略列（第 6 列）× 4 天行共 4 格；total 行省略列 1 格。
  // ellTxts[0..3]：省略行 4 格（产品列 0–3）；ellTxts[4]：省略行省略列；ellTxts[5]：省略行 total 列；
  // ellTxts[6..9]：省略列 4 格（天行 0–3）；ellTxts[10]：total 行省略列。
  const ellPos: [number, number][] = [
    [1, 5], [2, 5], [3, 5], [4, 5], [5, 5], [6, 5],
    [5, 1], [5, 2], [5, 3], [5, 4], [5, 6],
  ];

  view.add(
    <>
      <Txt
        ref={header}
        position={[-SAFE.halfW, -SAFE.halfH]}
        offset={[-1, -1]}
        fontSize={SIZE.label}
        fill={T.muted}
        fontFamily={FONT.sans}
        text={'聚合：立方体与物化视图'}
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

      {/* 二维网格：49 个格子框（静态），文字另用 ref 控制出现时机 */}
      <Node ref={grid} opacity={0}>
        {ROW_Y.flatMap((y, r) =>
          COL_X.map((x, c) => (
            <Rect
              key={`cell-${r}-${c}`}
              position={[x, y]}
              width={COL_W[c]}
              height={ROW_H}
              fill={T.card}
              stroke={T.line}
              lineWidth={1}
            />
          )),
        )}
        {ROW_HEADS.map((h, i) => (
          <Txt
            key={`rh-${i}`}
            ref={rowHeads[i]}
            position={[COL_X[0], ROW_Y[i + 1]]}
            fontSize={20}
            fill={T.text}
            fontFamily={FONT.mono}
            text={h}
            opacity={0}
          />
        ))}
        {COL_HEADS.map((h, i) => (
          <Txt
            key={`ch-${i}`}
            ref={colHeads[i]}
            position={[COL_X[i + 1], ROW_Y[0]]}
            fontSize={20}
            fill={T.text}
            fontFamily={FONT.mono}
            text={h}
            opacity={0}
          />
        ))}
        <Txt ref={dateKeyLab} position={[-408, -26]} rotation={-90} fontSize={20} fill={T.muted} fontFamily={FONT.mono} text={'date_key'} opacity={0} />
        <Txt ref={prodSkLab} position={[60, -238]} fontSize={20} fill={T.muted} fontFamily={FONT.mono} text={'product_sk'} opacity={0} />
        {DATA.flatMap((row, r) =>
          row.map((v, c) => (
            <Txt
              key={`v-${r}-${c}`}
              ref={dataVals[r * 4 + c]}
              position={[COL_X[c + 1], ROW_Y[r + 1]]}
              fontSize={19}
              fill={T.text}
              fontFamily={FONT.mono}
              text={v}
              opacity={0}
            />
          )),
        )}
        {ellPos.map(([c, r], i) => (
          <Txt
            key={`ell-${i}`}
            ref={ellTxts[i]}
            position={[COL_X[c], ROW_Y[r]]}
            fontSize={19}
            fill={T.muted}
            fontFamily={FONT.mono}
            text={'……'}
            opacity={0}
          />
        ))}
        {ROW_TOTALS.map((v, i) => (
          <Txt
            key={`rt-${i}`}
            ref={rowTotTxts[i]}
            position={[COL_X[6], ROW_Y[i + 1]]}
            fontSize={19}
            fontWeight={700}
            fill={T.yellow}
            fontFamily={FONT.mono}
            text={v}
            opacity={0}
          />
        ))}
        {COL_TOTALS.map((v, i) => (
          <Txt
            key={`ct-${i}`}
            ref={colTotTxts[i]}
            position={[COL_X[i + 1], ROW_Y[6]]}
            fontSize={19}
            fontWeight={700}
            fill={T.yellow}
            fontFamily={FONT.mono}
            text={v}
            opacity={0}
          />
        ))}
        <Txt ref={lotsTxt} position={[COL_X[6], ROW_Y[6]]} fontSize={19} fontWeight={700} fill={T.yellow} fontFamily={FONT.mono} text={'lots'} opacity={0} />
        {/* 高亮描边（只有描边，不盖文字） */}
        <Rect ref={hlRow0} position={[0, -141]} width={720} height={46} stroke={T.yellow} lineWidth={3} opacity={0} />
        <Rect ref={hlCol0} position={[-212.5, -26]} width={115} height={276} stroke={T.yellow} lineWidth={3} opacity={0} />
        <Rect ref={hlCell} position={[-212.5, -141]} width={115} height={46} stroke={T.yellow} lineWidth={3} opacity={0} />
        <Rect ref={hlRowTot} position={[300, -141]} width={120} height={46} stroke={T.red} lineWidth={3} opacity={0} />
        <Rect ref={hlColTot} position={[-212.5, 89]} width={115} height={46} stroke={T.yellow} lineWidth={3} opacity={0} />
        <Rect ref={hlLots} position={[300, 89]} width={120} height={46} stroke={T.yellow} lineWidth={3} opacity={0} />
        {[0, 1, 2, 3].map(i => (
          <Rect key={`hlc-${i}`} ref={hlRowCells[i]} position={[COL_X[i + 1], -141]} width={115} height={46} stroke={T.yellow} lineWidth={3} opacity={0} />
        ))}
        <Rect ref={ellRowHL} position={[0, 43]} width={720} height={46} stroke={T.yellow} lineWidth={3} opacity={0} />
        <Rect ref={ellColHL} position={[215, -26]} width={50} height={276} stroke={T.yellow} lineWidth={3} opacity={0} />
        {/* ⊕ 号按原图画在格子交界处、表示沿行列求和，是故意的标注，不参与 QA 检查 */}
        <Txt key="qa-ignore-plus-row-1" ref={rowPlus[0]} position={[-155, -141]} fontSize={20} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'⊕'} opacity={0} />
        <Txt key="qa-ignore-plus-row-2" ref={rowPlus[1]} position={[-40, -141]} fontSize={20} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'⊕'} opacity={0} />
        <Txt key="qa-ignore-plus-row-3" ref={rowPlus[2]} position={[75, -141]} fontSize={20} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'⊕'} opacity={0} />
        <Txt key="qa-ignore-plus-col-1" ref={colPlus[0]} position={[-212.5, -118]} fontSize={20} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'⊕'} opacity={0} />
        <Txt key="qa-ignore-plus-col-2" ref={colPlus[1]} position={[-212.5, -72]} fontSize={20} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'⊕'} opacity={0} />
        <Txt key="qa-ignore-plus-col-3" ref={colPlus[2]} position={[-212.5, -26]} fontSize={20} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'⊕'} opacity={0} />
      </Node>

      {/* SQL 标注框 A：查某天某产品的净价之和 → 格子 */}
      <Rect ref={boxA} position={[-212, -282]} width={230} height={76} radius={10} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
        <Txt position={[0, -24]} fontSize={13} fill={T.text} fontFamily={FONT.mono} text={'SELECT SUM(net_price)'} />
        <Txt position={[0, -8]} fontSize={13} fill={T.text} fontFamily={FONT.mono} text={'FROM fact_sales'} />
        <Txt position={[0, 8]} fontSize={13} fill={T.text} fontFamily={FONT.mono} text={'WHERE date_key = 140101'} />
        <Txt position={[0, 24]} fontSize={13} fill={T.text} fontFamily={FONT.mono} text={'AND product_sk = 32'} />
      </Rect>
      <Line ref={arrowA} points={[[-212, -242], [-212, -214]]} stroke={T.yellow} lineWidth={3} endArrow opacity={0} />

      {/* SQL 标注框 B：查某天的净价之和 → 行 total */}
      <Rect ref={boxB} position={[475, -141]} width={190} height={76} radius={10} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
        <Txt position={[0, -18]} fontSize={13} fill={T.text} fontFamily={FONT.mono} text={'SELECT SUM(net_price)'} />
        <Txt position={[0, 0]} fontSize={13} fill={T.text} fontFamily={FONT.mono} text={'FROM fact_sales'} />
        <Txt position={[0, 18]} fontSize={13} fill={T.text} fontFamily={FONT.mono} text={'WHERE date_key = 140101'} />
      </Rect>
      <Line ref={arrowB} points={[[378, -141], [364, -141]]} stroke={T.yellow} lineWidth={3} endArrow opacity={0} />

      {/* SQL 标注框 C：查某产品的净价之和 → 列 total */}
      <Rect ref={boxC} position={[-212, 185]} width={230} height={76} radius={10} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
        <Txt position={[0, -18]} fontSize={13} fill={T.text} fontFamily={FONT.mono} text={'SELECT SUM(net_price)'} />
        <Txt position={[0, 0]} fontSize={13} fill={T.text} fontFamily={FONT.mono} text={'FROM fact_sales'} />
        <Txt position={[0, 18]} fontSize={13} fill={T.text} fontFamily={FONT.mono} text={'WHERE product_sk = 32'} />
      </Rect>
      <Line ref={arrowC} points={[[-212, 145], [-212, 116]]} stroke={T.yellow} lineWidth={3} endArrow opacity={0} />

      {/* n18 加法条 */}
      <Txt ref={sumTxt} position={[-50, 185]} fontSize={22} fill={T.text} fontFamily={FONT.mono} text={'149.60 + 31.01 + 84.58 + 28.18 ='} opacity={0} />
      <Txt ref={sumRes} position={[215, 185]} fontSize={26} fontWeight={700} fill={T.yellow} fontFamily={FONT.mono} text={'293.37'} opacity={0} />
    </>
  );

  // 推镜头：整个网格是 world，镜头只动它（不用 Motion Canvas 的 Camera 组件）。
  const cam = new Cam(grid());

  say('按维度分组的聚合网格');
  yield* beat('n12',
    all(grid().opacity(1, 0.6), cam.focus([0, 0], 1.02, beat.dur('n12'))),
  );

  say('日期 × 产品');
  yield* beat('n13',
    at('日期沿一轴', all(...rowHeads.map(t => t().opacity(1, 0.4)), dateKeyLab().opacity(1, 0.4))),
    at('产品沿另一轴', all(...colHeads.map(t => t().opacity(1, 0.4)), prodSkLab().opacity(1, 0.4))),
  );

  say('每格是预先算好的和');
  yield* beat('n14',
    cam.focus([0, 0], 1.04, beat.dur('n14')),
    at('每个格子', chain(
      all(dataVals[0]().opacity(1, 0.4), dataVals[1]().opacity(1, 0.4), dataVals[2]().opacity(1, 0.4), dataVals[3]().opacity(1, 0.4)),
      all(dataVals[4]().opacity(1, 0.4), dataVals[5]().opacity(1, 0.4), dataVals[6]().opacity(1, 0.4), dataVals[7]().opacity(1, 0.4)),
      all(dataVals[8]().opacity(1, 0.4), dataVals[9]().opacity(1, 0.4), dataVals[10]().opacity(1, 0.4), dataVals[11]().opacity(1, 0.4)),
      all(dataVals[12]().opacity(1, 0.4), dataVals[13]().opacity(1, 0.4), dataVals[14]().opacity(1, 0.4), dataVals[15]().opacity(1, 0.4)),
      all(...ellTxts.map(t => t().opacity(1, 0.4))),
    )),
  );

  say('149.60 是这一格的和');
  yield* beat('n15',
    at('比如', all(boxA().opacity(1, 0.5), arrowA().opacity(1, 0.4))),
    at('一四零一零一', hlRow0().opacity(1, 0.4)),
    at('三十二号产品', hlCol0().opacity(1, 0.4)),
    at('一百四十九点六零', all(hlCell().opacity(1, 0.4), dataVals[0]().fill(T.yellow, 0.4))),
  );

  say('沿行加总');
  yield* beat('n16',
    all(hlRow0().opacity(0, 0.4), hlCol0().opacity(0, 0.4), hlCell().opacity(0, 0.4), boxA().opacity(0, 0.4), arrowA().opacity(0, 0.4)),
    cam.reset(beat.dur('n16')),
    at('沿着每一行加总', all(...rowTotTxts.map(t => t().opacity(1, 0.4)), ...rowPlus.map(t => t().opacity(1, 0.4)))),
  );

  say('沿列加总');
  yield* beat('n17',
    cam.focus([0, 0], 1.03, beat.dur('n17')),
    at('沿着列加总', all(...colTotTxts.map(t => t().opacity(1, 0.4)), ...colPlus.map(t => t().opacity(1, 0.4)))),
  );

  say('可见 4 格 = 293.37');
  yield* beat('n18',
    at('看得见的四格', all(sumTxt().opacity(1, 0.5), sumRes().opacity(1, 0.5))),
    at('加起来', chain(hlRowCells[0]().opacity(1, 0.3), hlRowCells[1]().opacity(1, 0.3), hlRowCells[2]().opacity(1, 0.3), hlRowCells[3]().opacity(1, 0.3))),
    at('二百九十三点三七', sumRes().scale(1.2, 0.5)),
  );

  say('行 total = 40710.53');
  yield* beat('n19',
    at('行末的总计', all(boxB().opacity(1, 0.5), arrowB().opacity(1, 0.4), hlRowTot().opacity(1, 0.4))),
    at('四万零七百一十点五三', rowTotTxts[0]().fill(T.red, 0.4)),
    at('差了一百多倍', hlRowTot().scale(1.08, 0.6)),
  );

  say('隐藏的行列才是大头');
  yield* beat('n20',
    all(sumTxt().opacity(0, 0.4), sumRes().opacity(0, 0.4), ...hlRowCells.map(t => t().opacity(0, 0.4)), boxB().opacity(0, 0.4), arrowB().opacity(0, 0.4), hlRowTot().opacity(0, 0.4)),
    cam.focus([60, 0], 1.15, beat.dur('n20')),
    at('省略号藏着的行和列', all(ellRowHL().opacity(1, 0.5), ellColHL().opacity(1, 0.5))),
    at('总计把它们也算进去了', rowTotTxts[0]().fill(T.green, 0.4)),
    at('隐藏的部分才是大头', all(...ellTxts.map(t => t().fill(T.yellow, 0.4)))),
  );

  say('列 total = 14967.09');
  yield* beat('n21',
    all(ellRowHL().opacity(0, 0.4), ellColHL().opacity(0, 0.4)),
    chain(cam.reset(0.6), cam.focus([0, 0], 1.02, beat.dur('n21') - 0.6)),
    at('列的总计', all(boxC().opacity(1, 0.5), arrowC().opacity(1, 0.4), hlColTot().opacity(1, 0.4))),
    at('一万四千九百六十七点零九', colTotTxts[0]().scale(1.15, 0.5)),
  );

  say('右下角写着 lots');
  yield* beat('n22',
    at('右下角的总计格', lotsTxt().opacity(1, 0.5)),
    at('lots', hlLots().opacity(1, 0.4)),
  );
});
