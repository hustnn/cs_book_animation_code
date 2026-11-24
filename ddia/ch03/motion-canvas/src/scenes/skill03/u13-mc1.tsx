// U13 场景 1（MC）：b1–b11 —— 钩子、插入顺序、整行整行排序、第一排序键、只扫上个月。
// 分镜：skill-ch03/beats-u13.md；原文：DDIA §3.12（书页 p99–100，PDF p121–122）。
// 事实表概念：日期 / 产品 / 数量三列，4 行示例数据（与图 3-10 的 8 行不是同一批数据，只借列名）。
// 时长全部来自 timeline/u13.json（beat() 驱动），不手写 waitFor。
import {Circle, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, chain, createRef} from '@motion-canvas/core';
import {at, makeBeats} from '../../lib/beats';
import {FONT, SAFE, SIZE, T} from '../../lib/theme';
import timeline from '../../timeline/u13.json';

const COL_X = [-340, 0, 340];
const COL_HEAD = ['date_key', 'product_sk', 'quantity'];
const ROW_Y = [-185, -135, -85, -35];
// 4 行示例数据（插入顺序）：R1 140102/32/5，R2 140101/69/3，R3 140102/33/2，R4 140101/32/7
const DATA = [
  ['140102', '32', '5'],
  ['140101', '69', '3'],
  ['140102', '33', '2'],
  ['140101', '32', '7'],
];
// 整行整行排序后（按日期，再按产品）：R4, R2, R1, R3
const SORTED_ROW = [3, 1, 0, 2];
// 各列独立排序后每列的行次序：日期列 R2,R4,R1,R3；产品列 R1,R4,R3,R2；数量列 R3,R2,R1,R4
const INDEP_ROW = [
  [1, 3, 0, 2],
  [0, 3, 2, 1],
  [2, 1, 0, 3],
];

export default makeScene2D(function* (view) {
  view.fill(T.bg);
  const beat = makeBeats(timeline);

  const header = createRef<Txt>();
  const anchor = createRef<Txt>();
  const say = (text: string) => anchor().text(text);

  const tab = createRef<Node>();
  const headCells = [0, 1, 2].map(() => createRef<Rect>());
  const headTxts = [0, 1, 2].map(() => createRef<Txt>());
  const cells = [0, 1, 2, 3].map(() => [0, 1, 2].map(() => createRef<Node>()));
  const cellRects = [0, 1, 2, 3].map(() => [0, 1, 2].map(() => createRef<Rect>()));
  const orderNums = [0, 1, 2].map(() => createRef<Txt>());
  const readDot = createRef<Circle>();
  const writeArrow = createRef<Line>();
  const writeQ = createRef<Txt>();
  const sortArrows = [0, 1, 2].map(() => createRef<Txt>());
  const appendArrows = [0, 1, 2].map(() => createRef<Txt>());
  const chipEach = createRef<Node>();
  const chipWrong = createRef<Node>();
  const chipRight = createRef<Node>();
  const bands = [0, 1, 2, 3].map(() => createRef<Rect>());
  const admin = createRef<Node>();
  const adminLab = createRef<Txt>();
  const queryChips = [0, 1, 2].map(() => createRef<Node>());
  const dateBand = createRef<Rect>();
  const firstKeyTag = createRef<Txt>();
  const lastMonthChip = createRef<Node>();
  const months = createRef<Node>();
  const monthBars = Array.from({length: 12}, () => createRef<Rect>());
  const monthLabs = Array.from({length: 12}, () => createRef<Txt>());
  const scanFrame = createRef<Rect>();
  const scanDot = createRef<Circle>();
  const scanLab = createRef<Txt>();

  const moveCells = (rowOf: (r: number, c: number) => number, dur: number) =>
    all(
      ...[0, 1, 2, 3].flatMap(r =>
        [0, 1, 2].map(c => cells[r][c]().position([COL_X[c], ROW_Y[rowOf(r, c)]], dur)),
      ),
    );
  const toSorted = (dur: number) =>
    moveCells((r) => SORTED_ROW.indexOf(r), dur);
  const toIndep = (dur: number) =>
    moveCells((r, c) => INDEP_ROW[c].indexOf(r), dur);

  view.add(
    <>
      <Txt
        ref={header}
        position={[-SAFE.halfW, -SAFE.halfH]}
        offset={[-1, -1]}
        fontSize={SIZE.label}
        fill={T.muted}
        fontFamily={FONT.sans}
        text={'排序与写入：列存的两难'}
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

      {/* 事实表概念：三列四行 */}
      <Node ref={tab} opacity={0}>
        {[0, 1, 2].map(i => (
          <Rect
            key={`hc-${i}`}
            ref={headCells[i]}
            position={[COL_X[i], -240]}
            width={210}
            height={44}
            radius={10}
            fill={T.card}
            stroke={T.blue}
            lineWidth={2}
          >
            <Txt ref={headTxts[i]} fontSize={20} fill={T.text} fontFamily={FONT.mono} text={COL_HEAD[i]} />
          </Rect>
        ))}
        {[0, 1, 2, 3].flatMap(r =>
          [0, 1, 2].map(c => (
            <Node key={`cell-${r}-${c}`} ref={cells[r][c]} position={[COL_X[c], r === 3 ? ROW_Y[r] + 60 : ROW_Y[r]]} opacity={r === 3 ? 0 : 1}>
              <Rect ref={cellRects[r][c]} width={210} height={44} radius={8} fill={T.card} stroke={T.line} lineWidth={2}>
                <Txt fontSize={22} fill={T.text} fontFamily={FONT.mono} text={DATA[r][c]} />
              </Rect>
            </Node>
          )),
        )}
        <Txt ref={appendArrows[0]} position={[COL_X[0], 8]} fontSize={28} fill={T.green} fontFamily={FONT.sans} text={'↓'} opacity={0} />
        <Txt ref={appendArrows[1]} position={[COL_X[1], 8]} fontSize={28} fill={T.green} fontFamily={FONT.sans} text={'↓'} opacity={0} />
        <Txt ref={appendArrows[2]} position={[COL_X[2], 8]} fontSize={28} fill={T.green} fontFamily={FONT.sans} text={'↓'} opacity={0} />
        {[0, 1, 2].map(i => (
          <Txt key={`on-${i}`} ref={orderNums[i]} position={[-490, ROW_Y[i]]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.mono} text={String(i + 1)} opacity={0} />
        ))}
        <Circle ref={readDot} position={[-450, -110]} width={22} height={22} fill={T.green} opacity={0} />
        <Line ref={writeArrow} points={[[560, -110], [470, -110]]} stroke={T.red} lineWidth={3} endArrow opacity={0} />
        <Txt ref={writeQ} position={[515, -165]} fontSize={56} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'?'} opacity={0} />
        {[0, 1, 2].map(i => (
          <Txt key={`sa-${i}`} ref={sortArrows[i]} position={[COL_X[i], -285]} fontSize={30} fill={T.yellow} fontFamily={FONT.sans} text={'▼'} opacity={0} />
        ))}
        {[0, 1, 2, 3].map(i => (
          <Rect key={`band-${i}`} ref={bands[i]} position={[0, ROW_Y[i]]} width={1140} height={48} radius={10} fill={T.yellow} opacity={0} />
        ))}
        <Rect ref={dateBand} position={[COL_X[0], -135]} width={230} height={270} radius={12} fill={T.yellow} opacity={0} />
      </Node>

      {/* 各排各的 / 拼错 / 拼对 三张提示条 */}
      <Node ref={chipEach} position={[0, 90]} opacity={0}>
        <Rect width={420} height={60} radius={12} fill={T.card} stroke={T.red} lineWidth={2}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'各排各的 ✗'} />
        </Rect>
      </Node>
      <Node ref={chipWrong} position={[0, 90]} opacity={0}>
        <Rect width={560} height={60} radius={12} fill={T.card} stroke={T.red} lineWidth={2}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.red} fontFamily={FONT.mono} text={'140101 · 32 · 2 ✗'} />
        </Rect>
      </Node>
      <Node ref={chipRight} position={[0, 90]} opacity={0}>
        <Rect width={560} height={60} radius={12} fill={T.card} stroke={T.green} lineWidth={2}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.green} fontFamily={FONT.mono} text={'140101 · 69 · 3 ✓'} />
        </Rect>
      </Node>

      {/* b9：管理员与常见查询 */}
      <Node ref={admin} opacity={0}>
        <Circle position={[-505, -130]} width={90} height={90} fill={T.card} stroke={T.blue} lineWidth={3} />
        <Txt ref={adminLab} position={[-505, -130]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'管理员'} />
        {[0, 1, 2].map(i => (
          <Node key={`qc-${i}`} ref={queryChips[i]} position={[90, -180 + i * 80]} opacity={0}>
            <Rect width={560} height={64} radius={12} fill={T.card} stroke={T.blue} lineWidth={2}>
              <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={['上个月的销售', '某产品的销量', '按日期分组'][i]} />
            </Rect>
          </Node>
        ))}
      </Node>
      <Txt ref={firstKeyTag} position={[COL_X[0], 40]} fontSize={SIZE.label} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'第一排序键'} opacity={0} />
      <Node ref={lastMonthChip} position={[0, 90]} opacity={0}>
        <Rect width={260} height={56} radius={12} fill={T.card} stroke={T.yellow} lineWidth={2}>
          <Txt fontSize={SIZE.label} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'上个月'} />
        </Rect>
      </Node>

      {/* b11：十二个月条带 */}
      <Node ref={months} opacity={0}>
        {Array.from({length: 12}, (_, i) => (
          <Rect
            key={`mb-${i}`}
            ref={monthBars[i]}
            position={[-535 + i * 90 + 40, -40]}
            width={80}
            height={100}
            radius={10}
            fill={i === 11 ? T.green : T.card}
            stroke={i === 11 ? T.green : T.line}
            lineWidth={2}
            opacity={1}
          />
        ))}
        {Array.from({length: 12}, (_, i) => (
          <Txt key={`ml-${i}`} ref={monthLabs[i]} position={[-535 + i * 90 + 40, 35]} fontSize={16} fill={T.muted} fontFamily={FONT.mono} text={String(i + 1)} />
        ))}
        <Rect ref={scanFrame} position={[445, -40]} width={92} height={112} radius={12} stroke={T.yellow} lineWidth={4} opacity={0} />
        <Circle ref={scanDot} position={[410, -40]} width={20} height={20} fill={T.yellow} opacity={0} />
        <Txt ref={scanLab} position={[445, -140]} fontSize={SIZE.label} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'只扫这里'} opacity={0} />
      </Node>
    </>
  );

  say('排好序，写怎么办？');
  yield* beat('b1',
    all(tab().opacity(1, 0.5)),
    at('读查询', chain(readDot().opacity(1, 0.4), readDot().position([450, -110], 2.0))),
    at('新写进来的数据', all(writeArrow().opacity(1, 0.4), writeQ().opacity(1, 0.4))),
  );

  say('顺序不一定重要');
  yield* beat('b2',
    all(orderNums[0]().opacity(1, 0.4), orderNums[1]().opacity(1, 0.4), orderNums[2]().opacity(1, 0.4)),
    at('行按什么顺序存', chain(readDot().position([-450, -110], 0.1), readDot().opacity(0, 0.4), writeArrow().opacity(0, 0.4), writeQ().opacity(0, 0.4))),
  );

  say('插入顺序最容易');
  yield* beat('b3',
    all(
      cells[3][0]().opacity(1, 0.5), cells[3][1]().opacity(1, 0.5), cells[3][2]().opacity(1, 0.5),
      cells[3][0]().position([COL_X[0], ROW_Y[3]], 1.8), cells[3][1]().position([COL_X[1], ROW_Y[3]], 1.8), cells[3][2]().position([COL_X[2], ROW_Y[3]], 1.8),
    ),
    at('新行来了', all(
      appendArrows[0]().opacity(1, 0.4), appendArrows[1]().opacity(1, 0.4), appendArrows[2]().opacity(1, 0.4),
      appendArrows[0]().position([COL_X[0], 28], 2.2), appendArrows[1]().position([COL_X[1], 28], 2.2), appendArrows[2]().position([COL_X[2], 28], 2.2),
    )),
    at('往每个列文件尾一追加', chain(cellRects[3][0]().stroke(T.green, 0.3), cellRects[3][1]().stroke(T.green, 0.3), cellRects[3][2]().stroke(T.green, 0.3))),
    at('就完事', all(
      chain(cellRects[3][0]().stroke(T.line, 0.4), cellRects[3][1]().stroke(T.line, 0.4), cellRects[3][2]().stroke(T.line, 0.4)),
      appendArrows[0]().opacity(0, 0.4), appendArrows[1]().opacity(0, 0.4), appendArrows[2]().opacity(0, 0.4),
    )),
  );

  say('顺序本身当索引');
  yield* beat('b4',
    at('强加一个顺序', all(toSorted(1.4), headCells[0]().stroke(T.yellow, 0.5))),
    at('当成一种索引', headTxts[0]().fill(T.yellow, 0.4)),
  );

  say('各列不能各排各的');
  yield* beat('b5',
    all(sortArrows[0]().opacity(1, 0.4), sortArrows[1]().opacity(1, 0.4), sortArrows[2]().opacity(1, 0.4)),
    at('各列不能各排各的', chipEach().opacity(1, 0.5)),
  );

  say('第 k 项对不上同一行');
  yield* beat('b6',
    all(chipEach().opacity(0, 0.4)),
    at('独立排好序', toIndep(1.4)),
    at('拼不回来了', chipWrong().opacity(1, 0.5)),
  );

  say('第 k 项属于同一行');
  yield* beat('b7',
    all(chipWrong().opacity(0, 0.4)),
    at('第 k 项', toSorted(1.4)),
    at('属于同一行', all(
      cellRects[1][0]().stroke(T.yellow, 0.4),
      cellRects[1][1]().stroke(T.yellow, 0.4),
      cellRects[1][2]().stroke(T.yellow, 0.4),
    )),
    at('重组出行', chipRight().opacity(1, 0.5)),
  );

  say('整行整行地排');
  yield* beat('b8',
    at('整行整行地排', chain(
      bands[0]().opacity(0.25, 0.4),
      bands[0]().opacity(0, 0.3),
      bands[1]().opacity(0.25, 0.4),
      bands[1]().opacity(0, 0.3),
      bands[2]().opacity(0.25, 0.4),
      bands[2]().opacity(0, 0.3),
      bands[3]().opacity(0.25, 0.4),
      bands[3]().opacity(0, 0.3),
    )),
  );

  say('谁定排法？常查什么');
  yield* beat('b9',
    all(tab().opacity(0.2, 0.5), chipRight().opacity(0, 0.4),
      cellRects[1][0]().stroke(T.line, 0.4), cellRects[1][1]().stroke(T.line, 0.4), cellRects[1][2]().stroke(T.line, 0.4)),
    at('管数据库的人', admin().opacity(1, 0.5)),
    at('常查什么', chain(queryChips[0]().opacity(1, 0.4), queryChips[1]().opacity(1, 0.4), queryChips[2]().opacity(1, 0.4))),
  );

  say('日期：第一排序键');
  yield* beat('b10',
    all(admin().opacity(0, 0.5), tab().opacity(1, 0.5)),
    at('上个月的销售', lastMonthChip().opacity(1, 0.5)),
    at('第一排序键', all(dateBand().opacity(0.14, 0.5), firstKeyTag().opacity(1, 0.5))),
  );

  say('只扫上个月');
  yield* beat('b11',
    all(tab().opacity(0, 0.5), lastMonthChip().opacity(0, 0.4), dateBand().opacity(0, 0.4), firstKeyTag().opacity(0, 0.4),
      sortArrows[0]().opacity(0, 0.4), sortArrows[1]().opacity(0, 0.4), sortArrows[2]().opacity(0, 0.4),
      orderNums[0]().opacity(0, 0.4), orderNums[1]().opacity(0, 0.4), orderNums[2]().opacity(0, 0.4),
      headCells[0]().stroke(T.blue, 0.4), headTxts[0]().fill(T.text, 0.4)),
    at('只扫上个月的行', all(months().opacity(1, 0.5), scanFrame().opacity(1, 0.5), scanLab().opacity(1, 0.5),
      chain(scanDot().opacity(1, 0.4), scanDot().position([480, -40], 1.8)))),
    at('比扫全部行快得多', chain(scanDot().position([410, -40], 0.1), scanDot().position([480, -40], 1.6))),
  );
});
