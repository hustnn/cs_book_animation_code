// U11 场景 1（MC）：b1–b9 —— 钩子、事实表规模、Example 3-1、水果 vs 糖果查询、
// 行式存储与整行加载再过滤。分镜：skill-ch03/beats-u11.md；原文：DDIA §3.10（书页 p95–96，PDF p117–118）。
// 时长全部来自 timeline/u11.json（beat() 驱动），不手写 waitFor。
import {Circle, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, chain, createRef} from '@motion-canvas/core';
import {at, makeBeats} from '../../lib/beats';
import {FONT, SAFE, SIZE, T} from '../../lib/theme';
import timeline from '../../timeline/u11.json';

// 100 列示意：2 行 × 50 格
const GRID_COLS = 50;
const CELL_W = 21;
const CELL_H = 26;
const PITCH = 23;
const gridX = (i: number) => -563.5 + (i % GRID_COLS) * PITCH;
const gridY = (i: number) => (i < GRID_COLS ? -100 : -60);
const WEEKDAYS = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
const ROW1 = ['140102', '69', '4', 'NULL', 'NULL', '1', '13.99', '13.99'];

export default makeScene2D(function* (view) {
  view.fill(T.bg);
  const beat = makeBeats(timeline);

  const header = createRef<Txt>();
  const anchor = createRef<Txt>();
  const say = (text: string) => anchor().text(text);

  // ---- b1–b3：100 列网格 ----
  const pGrid = createRef<Node>();
  const gridCells = Array.from({length: 100}, () => createRef<Rect>());
  const hlA = [0, 1, 2].map(() => createRef<Rect>());
  const hlB = [5, 6, 7, 8, 9].map(() => createRef<Rect>());
  const qChip = createRef<Rect>();
  const qMark = createRef<Txt>();
  const greyTag = createRef<Txt>();

  // ---- b2：规模条 ----
  const pScale = createRef<Node>();
  const factBar = createRef<Rect>();
  const dimBar = createRef<Rect>();
  const dimLab = createRef<Txt>();
  const pbTag = createRef<Txt>();
  const scaleDot = createRef<Circle>();

  // ---- b4–b5：查询卡 ----
  const pQuery = createRef<Node>();
  const fruitCard = createRef<Rect>();
  const candyCard = createRef<Rect>();
  const wdCells = WEEKDAYS.map(() => createRef<Rect>());
  const recStrip = createRef<Rect>();
  const scanDot = createRef<Circle>();
  const colCards = [0, 1, 2].map(() => createRef<Rect>());
  const colLabs = ['date_key', 'product_sk', 'quantity'];

  // ---- b6–b9：行式存储 ----
  const pRow = createRef<Node>();
  const rowCells = ROW1.map(() => createRef<Rect>());
  const rowFrame = createRef<Rect>();
  const rowLab = createRef<Txt>();
  const docCard = createRef<Rect>();
  const byteCells = Array.from({length: 24}, () => createRef<Rect>());
  const idxLab1 = createRef<Txt>();
  const idxLab2 = createRef<Txt>();
  const memBox = createRef<Rect>();
  const memLab = createRef<Txt>();
  const rowChips = [0, 1, 2].map(() => createRef<Rect>());
  const chipLabs = ['第 1 行：140102 / 69 / 4 / …', '第 2 行：140102 / 69 / 5 / …', '第 3 行：140102 / 69 / 5 / …'];
  const filterTag = createRef<Txt>();
  const slowTag = createRef<Txt>();

  view.add(
    <>
      <Txt
        ref={header}
        position={[-SAFE.halfW, -SAFE.halfH]}
        offset={[-1, -1]}
        fontSize={SIZE.label}
        fill={T.muted}
        fontFamily={FONT.sans}
        text={'列式存储：按列排'}
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

      {/* 100 列网格 */}
      <Node ref={pGrid} opacity={0}>
        {gridCells.map((ref, i) => (
          <Rect
            key={`gc-${i}`}
            ref={ref}
            position={[gridX(i), gridY(i)]}
            width={CELL_W}
            height={CELL_H}
            fill={T.card}
            stroke={T.line}
            lineWidth={1}
          />
        ))}
        {hlA.map((ref, k) => (
          <Rect
            key={`hla-${k}`}
            ref={ref}
            position={[gridX(k), gridY(k)]}
            width={CELL_W + 4}
            height={CELL_H + 4}
            stroke={T.yellow}
            lineWidth={3}
            opacity={0}
          />
        ))}
        {hlB.map((ref, k) => (
          <Rect
            key={`hlb-${k}`}
            ref={ref}
            position={[gridX(5 + k), gridY(5 + k)]}
            width={CELL_W + 4}
            height={CELL_H + 4}
            stroke={T.yellow}
            lineWidth={3}
            opacity={0}
          />
        ))}
        <Rect ref={qChip} position={[0, -200]} width={360} height={64} radius={14} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'查询：只用其中 3 列'} />
        </Rect>
        <Txt ref={qMark} position={[0, 130]} fontSize={64} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'?'} opacity={0} />
        <Txt ref={greyTag} position={[0, 40]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'其余列变灰，没被用到'} opacity={0} />
      </Node>

      {/* 规模条 */}
      <Node ref={pScale} opacity={0}>
        <Rect ref={factBar} position={[-500, -140]} offset={[-1, 0]} width={1000} height={64} radius={12} fill={T.card} stroke={T.blue} lineWidth={3}>
          <Txt position={[0, 0]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'事实表：数万亿行'} />
        </Rect>
        <Rect ref={dimBar} position={[-500, -40]} offset={[-1, 0]} width={140} height={64} radius={12} fill={T.card} stroke={T.green} lineWidth={3} />
        <Txt ref={dimLab} position={[-330, -40]} offset={[-1, 0]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'维度表：几百万行'} />
        <Txt ref={pbTag} position={[0, -230]} fontSize={SIZE.body} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'拍字节的数据量'} opacity={0} />
        <Circle ref={scaleDot} position={[-480, -140]} width={22} height={22} fill={T.yellow} opacity={0} />
      </Node>

      {/* 查询卡 */}
      <Node ref={pQuery} opacity={0}>
        <Rect ref={fruitCard} position={[-280, -180]} width={400} height={120} radius={16} fill={T.card} stroke={T.green} lineWidth={3} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'新鲜水果'} />
        </Rect>
        <Rect ref={candyCard} position={[280, -180]} width={400} height={120} radius={16} fill={T.card} stroke={T.purple} lineWidth={3} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.purple} fontFamily={FONT.sans} text={'糖果'} />
        </Rect>
        {WEEKDAYS.map((d, i) => (
          <Rect
            key={`wd-${i}`}
            ref={wdCells[i]}
            position={[-450 + i * 150, -40]}
            width={130}
            height={56}
            radius={10}
            fill={T.card}
            stroke={T.line}
            lineWidth={2}
            opacity={0}
          >
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={d} />
          </Rect>
        ))}
        <Rect ref={recStrip} position={[0, 90]} width={1000} height={36} radius={18} fill={T.card} stroke={T.line} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'2013 年全年的销售记录'} />
        </Rect>
        <Circle ref={scanDot} position={[-480, 90]} width={22} height={22} fill={T.yellow} opacity={0} />
        {colLabs.map((lab, i) => (
          <Rect
            key={`cc-${i}`}
            ref={colCards[i]}
            position={[-330 + i * 330, 190]}
            width={300}
            height={64}
            radius={12}
            fill={T.card}
            stroke={T.yellow}
            lineWidth={2}
            opacity={0}
          >
            <Txt fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.mono} text={lab} />
          </Rect>
        ))}
      </Node>

      {/* 行式存储 */}
      <Node ref={pRow} opacity={0}>
        <Rect ref={rowFrame} position={[0, -170]} width={1080} height={100} radius={14} fill={T.card} stroke={T.blue} lineWidth={3} opacity={0}>
          <Txt ref={rowLab} position={[0, -72]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'一行里的全部值，挨在一起'} opacity={0} />
        </Rect>
        {ROW1.map((v, i) => (
          <Rect
            key={`rc-${i}`}
            ref={rowCells[i]}
            position={[-455 + i * 130, -170]}
            width={120}
            height={54}
            radius={8}
            fill={T.bg}
            stroke={T.line}
            lineWidth={1}
            opacity={0}
          >
            <Txt fontSize={16} fill={T.text} fontFamily={FONT.mono} text={v} />
          </Rect>
        ))}
        <Rect ref={docCard} position={[0, -20]} width={1000} height={80} radius={14} fill={T.card} stroke={T.purple} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'整个文档 = 一段连续的字节'} />
        </Rect>
        {byteCells.map((ref, i) => (
          <Rect
            key={`bc-${i}`}
            ref={ref}
            position={[-460 + i * 41, 70]}
            width={38}
            height={30}
            fill={T.card}
            stroke={T.line}
            lineWidth={1}
            opacity={0}
          />
        ))}
        <Txt ref={idxLab1} position={[-260, 105]} fontSize={SIZE.label} fill={T.blue} fontFamily={FONT.mono} text={'date_key 索引 →'} opacity={0} />
        <Txt ref={idxLab2} position={[260, 105]} fontSize={SIZE.label} fill={T.blue} fontFamily={FONT.mono} text={'product_sk 索引 →'} opacity={0} />
        <Rect ref={memBox} position={[0, 180]} width={1000} height={110} radius={14} fill={T.card} stroke={T.line} lineWidth={2} opacity={0}>
          <Txt ref={memLab} position={[-470, -45]} offset={[-1, 0]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'内存'} opacity={0} />
        </Rect>
        {rowChips.map((ref, i) => (
          <Rect
            key={`chip-${i}`}
            ref={ref}
            position={[-320 + i * 330, -170]}
            width={320}
            height={48}
            radius={10}
            fill={T.bg}
            stroke={T.yellow}
            lineWidth={2}
            opacity={0}
          >
            <Txt fontSize={15} fill={T.text} fontFamily={FONT.mono} text={chipLabs[i]} />
          </Rect>
        ))}
        <Txt ref={filterTag} position={[0, 250]} fontSize={SIZE.label} fill={T.red} fontFamily={FONT.sans} text={'不符合条件的行，过滤掉'} opacity={0} />
        <Txt ref={slowTag} position={[0, -250]} fontSize={SIZE.label} fill={T.red} fontFamily={FONT.sans} text={'耗时很长'} opacity={0} />
      </Node>
    </>
  );

  say('只用 3 列，剩下白读？');
  yield* beat('b1',
    all(pGrid().opacity(1, 0.5), qChip().opacity(1, 0.5)),
    at('三列', chain(hlA[0]().opacity(1, 0.4), hlA[1]().opacity(1, 0.4), hlA[2]().opacity(1, 0.4))),
    at('白读', qMark().opacity(1, 0.5)),
  );

  say('数万亿行，拍字节');
  yield* beat('b2',
    chain(pGrid().opacity(0, 0.4), pScale().opacity(1, 0.4)),
    at('数万亿行', all(factBar().opacity(1, 0.4), dimBar().opacity(1, 0.4), dimLab().opacity(1, 0.4))),
    at('拍字节', chain(pbTag().opacity(1, 0.4), scaleDot().opacity(1, 0.3), scaleDot().position([480, -140], 2.2))),
  );

  say('100 多列，只用 4、5 列');
  yield* beat('b3',
    chain(pScale().opacity(0, 0.4), all(pGrid().opacity(1, 0.4), hlA[0]().opacity(0, 0.3), hlA[1]().opacity(0, 0.3), hlA[2]().opacity(0, 0.3))),
    at('四五列', chain(hlB[0]().opacity(1, 0.3), hlB[1]().opacity(1, 0.3), hlB[2]().opacity(1, 0.3), hlB[3]().opacity(1, 0.3), hlB[4]().opacity(1, 0.3))),
    at('全部列', greyTag().opacity(1, 0.5)),
  );

  say('水果还是糖果？');
  yield* beat('b4',
    chain(pGrid().opacity(0, 0.4), pQuery().opacity(1, 0.4)),
    at('新鲜水果', fruitCard().opacity(1, 0.5)),
    at('糖果', candyCard().opacity(1, 0.5)),
    at('星期几', all(wdCells[0]().opacity(1, 0.5), wdCells[1]().opacity(1, 0.5), wdCells[2]().opacity(1, 0.5), wdCells[3]().opacity(1, 0.5), wdCells[4]().opacity(1, 0.5), wdCells[5]().opacity(1, 0.5), wdCells[6]().opacity(1, 0.5))),
    at('关联过来', all(fruitCard().stroke(T.yellow, 0.4), candyCard().stroke(T.green, 0.4))),
  );

  say('只要 3 列');
  yield* beat('b5',
    all(recStrip().opacity(1, 0.5)),
    at('二零一三年', chain(scanDot().opacity(1, 0.3), scanDot().position([480, 90], 2.0))),
    at('日期', colCards[0]().opacity(1, 0.5)),
    at('产品', colCards[1]().opacity(1, 0.5)),
    at('数量', colCards[2]().opacity(1, 0.5)),
  );

  say('一行，存在一起');
  yield* beat('b6',
    chain(pQuery().opacity(0, 0.4), all(pRow().opacity(1, 0.4), rowFrame().opacity(1, 0.4),
      rowCells[0]().opacity(1, 0.4), rowCells[1]().opacity(1, 0.4), rowCells[2]().opacity(1, 0.4), rowCells[3]().opacity(1, 0.4),
      rowCells[4]().opacity(1, 0.4), rowCells[5]().opacity(1, 0.4), rowCells[6]().opacity(1, 0.4), rowCells[7]().opacity(1, 0.4))),
    at('挨在一起存', all(rowLab().opacity(1, 0.4), rowFrame().stroke(T.yellow, 0.4))),
  );

  say('文档：一段连续字节');
  yield* beat('b7',
    all(docCard().opacity(1, 0.5)),
    at('一段连续的字节', chain(byteCells[0]().opacity(1, 0.2), byteCells[5]().opacity(1, 0.2), byteCells[11]().opacity(1, 0.2), byteCells[17]().opacity(1, 0.2), byteCells[23]().opacity(1, 0.2))),
  );

  say('整行读进内存');
  yield* beat('b8',
    chain(
      all(rowFrame().opacity(0, 0.4), docCard().opacity(0, 0.4),
        rowCells[0]().opacity(0, 0.4), rowCells[1]().opacity(0, 0.4), rowCells[2]().opacity(0, 0.4), rowCells[3]().opacity(0, 0.4),
        rowCells[4]().opacity(0, 0.4), rowCells[5]().opacity(0, 0.4), rowCells[6]().opacity(0, 0.4), rowCells[7]().opacity(0, 0.4)),
      all(memBox().opacity(1, 0.4), memLab().opacity(1, 0.4),
        rowChips[0]().opacity(1, 0.4), rowChips[1]().opacity(1, 0.4), rowChips[2]().opacity(1, 0.4))),
    at('索引', all(idxLab1().opacity(1, 0.4), idxLab2().opacity(1, 0.4))),
    at('整行读进内存', all(rowChips[0]().position([-320, 180], 1.2), rowChips[1]().position([10, 180], 1.2), rowChips[2]().position([340, 180], 1.2), idxLab1().opacity(0, 0.4), idxLab2().opacity(0, 0.4))),
  );

  say('解析，再过滤');
  yield* beat('b9',
    at('解析一遍', all(rowChips[0]().stroke(T.green, 0.4), rowChips[1]().stroke(T.green, 0.4), rowChips[2]().stroke(T.green, 0.4))),
    at('过滤掉', all(rowChips[0]().opacity(0.3, 0.5), rowChips[2]().opacity(0.3, 0.5), filterTag().opacity(1, 0.5))),
    at('耗时很长', slowTag().opacity(1, 0.5)),
  );
});
