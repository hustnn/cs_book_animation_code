// U11 场景 2（MC）：b10–b21 —— 列式思想、Figure 3-10（8 行 × 8 列行表 → 8 个列文件）、
// 转置演出、按同顺序拼回整行、100 列只用 3 列。分镜：skill-ch03/beats-u11.md；原文：DDIA §3.10（书页 p96–97，PDF p118–119）。
// 原图 3-10 按处置“改编”：行表与列文件内容按原图图片逐格核对重新生成；
// 这 8 行是独立示例，与之前那张 4 行的表不是同一批（b12/b17 旁白与画面标注；只有一行完全相同）。
// 时长全部来自 timeline/u11.json（beat() 驱动），不手写 waitFor。
import {Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, chain, createRef} from '@motion-canvas/core';
import {at, makeBeats} from '../../lib/beats';
import {FONT, SAFE, SIZE, T} from '../../lib/theme';
import timeline from '../../timeline/u11.json';

const COLS = ['date_key', 'product_sk', 'store_sk', 'promotion_sk', 'customer_sk', 'quantity', 'net_price', 'discount_price'];
const ROWS: string[][] = [
  ['140102', '69', '4', 'NULL', 'NULL', '1', '13.99', '13.99'],
  ['140102', '69', '5', '19', 'NULL', '3', '14.99', '9.99'],
  ['140102', '69', '5', 'NULL', '191', '1', '14.99', '14.99'],
  ['140102', '74', '3', '23', '202', '5', '0.99', '0.89'],
  ['140103', '31', '2', 'NULL', 'NULL', '1', '2.49', '2.49'],
  ['140103', '31', '3', 'NULL', 'NULL', '3', '14.99', '9.99'],
  ['140103', '31', '3', '21', '123', '1', '49.99', '39.99'],
  ['140103', '31', '8', 'NULL', '233', '1', '0.99', '0.99'],
];
// 每列文件内容（按原图逐列核对，与上方行表同一组值按列重排）
const FILE_VALS: string[][] = [
  ['140102', '140102', '140102', '140102', '140103', '140103', '140103', '140103'],
  ['69', '69', '69', '74', '31', '31', '31', '31'],
  ['4', '5', '5', '3', '2', '3', '3', '8'],
  ['NULL', '19', 'NULL', '23', 'NULL', 'NULL', '21', 'NULL'],
  ['NULL', 'NULL', '191', '202', 'NULL', 'NULL', '123', '233'],
  ['1', '3', '1', '5', '1', '3', '1', '1'],
  ['13.99', '14.99', '14.99', '0.99', '2.49', '14.99', '49.99', '0.99'],
  ['13.99', '9.99', '14.99', '0.89', '2.49', '9.99', '39.99', '0.99'],
];
const ROW3 = FILE_VALS.map(col => col[2]); // 第 3 行：140102 / 69 / 5 / NULL / 191 / 1 / 14.99 / 14.99

const TAB_X = (ci: number) => -455 + ci * 130;
const TAB_Y = (ri: number) => -163 + ri * 32; // ri=-1 为表头
const FILE_LABEL_X = -410;
const FILE_VAL_X = (j: number) => -272 + j * 102;
const FILE_Y = (i: number) => -240 + i * 40;

export default makeScene2D(function* (view) {
  view.fill(T.bg);
  const beat = makeBeats(timeline);

  const header = createRef<Txt>();
  const anchor = createRef<Txt>();
  const say = (text: string) => anchor().text(text);

  // ---- b10–b11：行拆成列 ----
  const pIdea = createRef<Node>();
  const ideaFrame = createRef<Rect>();
  const ideaCells = ROWS[0].map(() => createRef<Rect>());
  const strips = COLS.map(() => createRef<Rect>());
  const stripLabs = COLS.map(() => createRef<Txt>());
  const stripFileTags = COLS.map(() => createRef<Txt>());
  const valFly = ROWS[0].map(() => createRef<Txt>());
  const restTag = createRef<Txt>();

  // ---- b12–b13、b17：行表 ----
  const pTable = createRef<Node>();
  const tabHead = COLS.map(() => createRef<Txt>());
  const tabCells = ROWS.map(() => Array.from({length: 8}, () => createRef<Txt>()));
  const noteBar = createRef<Rect>();
  const row2hl = createRef<Rect>();
  const row2lab = createRef<Txt>();

  // ---- b14–b19：列文件 ----
  const pFiles = createRef<Node>();
  const fileRows = COLS.map(() => createRef<Node>());
  const fileLabels = COLS.map(() => createRef<Txt>());
  const fileCells = FILE_VALS.map(col => col.map(() => createRef<Rect>()));
  const sweepBar = createRef<Rect>();
  const hl19 = COLS.map(() => createRef<Rect>());
  const asmRow = createRef<Node>();
  const asmCells = ROW3.map(() => createRef<Txt>());
  const asmLab = createRef<Txt>();
  const tag23 = createRef<Txt>();

  // ---- b20a–b21：100 列只用 3 列 ----
  const pWide = createRef<Node>();
  const wideCells = Array.from({length: 100}, () => createRef<Rect>());
  const wideDim = createRef<Rect>();
  const wideHl = [20, 21, 22].map(() => createRef<Rect>());
  const wideChips = [0, 1, 2].map(() => createRef<Rect>());
  const wideChipLabs = ['date_key', 'product_sk', 'quantity'];
  const skipArrow = createRef<Line>();
  const skipLab = createRef<Txt>();
  const queryBox = createRef<Rect>();

  const wgridX = (i: number) => -563.5 + (i % 50) * 23;
  const wgridY = (i: number) => (i < 50 ? -140 : -100);

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

      {/* 行拆成列 */}
      <Node ref={pIdea} opacity={0}>
        <Rect ref={ideaFrame} position={[0, -170]} width={1080} height={100} radius={14} fill={T.card} stroke={T.blue} lineWidth={3}>
          <Txt position={[0, -72]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'一行里的全部值'} />
        </Rect>
        {ROWS[0].map((v, i) => (
          <Rect
            key={`ic-${i}`}
            ref={ideaCells[i]}
            position={[TAB_X(i), -170]}
            width={120}
            height={54}
            radius={8}
            fill={T.bg}
            stroke={T.line}
            lineWidth={1}
          />
        ))}
        {COLS.map((c, i) => (
          <Rect
            key={`strip-${i}`}
            ref={strips[i]}
            position={[TAB_X(i), 30]}
            width={120}
            height={150}
            radius={10}
            fill={T.card}
            stroke={T.line}
            lineWidth={2}
            opacity={0}
          />
        ))}
        {COLS.map((c, i) => (
          <Txt
            key={`sl-${i}`}
            ref={stripLabs[i]}
            position={[TAB_X(i), -70]}
            fontSize={13}
            fill={T.muted}
            fontFamily={FONT.mono}
            text={c}
            opacity={0}
          />
        ))}
        {COLS.map((c, i) => (
          <Txt
            key={`sft-${i}`}
            ref={stripFileTags[i]}
            position={[TAB_X(i), 85]}
            fontSize={14}
            fill={T.muted}
            fontFamily={FONT.sans}
            text={'文件'}
            opacity={0}
          />
        ))}
        {ROWS[0].map((v, i) => (
          <Txt
            key={`vf-${i}`}
            ref={valFly[i]}
            position={[TAB_X(i), -170]}
            fontSize={16}
            fill={T.text}
            fontFamily={FONT.mono}
            text={v}
          />
        ))}
        <Txt ref={restTag} position={[0, 180]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'剩下的列，根本不用碰'} opacity={0} />
      </Node>

      {/* 行表 */}
      <Node ref={pTable} opacity={0}>
        {COLS.map((c, i) => (
          <Txt
            key={`th-${i}`}
            ref={tabHead[i]}
            position={[TAB_X(i), -195]}
            fontSize={14}
            fontWeight={700}
            fill={T.text}
            fontFamily={FONT.mono}
            text={c}
          />
        ))}
        {ROWS.flatMap((row, r) =>
          row.map((v, ci) => (
            <Txt
              key={`tc-${r}-${ci}`}
              ref={tabCells[r][ci]}
              position={[TAB_X(ci), TAB_Y(r)]}
              fontSize={16}
              fill={T.text}
              fontFamily={FONT.mono}
              text={v}
            />
          )),
        )}
        <Rect ref={row2hl} position={[0, TAB_Y(1)]} width={1060} height={36} stroke={T.yellow} lineWidth={3} opacity={0} />
        <Rect ref={noteBar} position={[0, 140]} width={720} height={54} radius={12} fill={T.card} stroke={T.yellow} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.sans} text={'另一组示例，别拼成同一张表'} />
        </Rect>
        <Txt ref={row2lab} position={[0, 210]} fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.sans} text={'只有这一行完全相同'} opacity={0} />
      </Node>

      {/* 列文件 */}
      <Node ref={pFiles} opacity={0}>
        {COLS.map((c, i) => (
          <Node key={`fr-${i}`} ref={fileRows[i]} opacity={0}>
            <Rect position={[-490, FILE_Y(i)]} offset={[-1, 0]} width={980} height={36} radius={8} fill={T.card} stroke={T.line} lineWidth={1}>
              <Txt position={[-470, 0]} offset={[-1, 0]} fontSize={15} fill={T.yellow} fontFamily={FONT.mono} text={c} />
            </Rect>
            {FILE_VALS[i].map((v, j) => (
              <Rect
                key={`fc-${i}-${j}`}
                ref={fileCells[i][j]}
                position={[FILE_VAL_X(j), FILE_Y(i)]}
                width={96}
                height={30}
                fill={T.bg}
                stroke={T.line}
                lineWidth={1}
                opacity={0}
              >
                <Txt fontSize={15} fill={T.text} fontFamily={FONT.mono} text={v} />
              </Rect>
            ))}
          </Node>
        ))}
        <Rect ref={sweepBar} position={[-490, -240]} offset={[-1, 0]} width={980} height={42} fill={T.yellow} opacity={0} />
        {COLS.map((c, i) => (
          <Rect
            key={`h19-${i}`}
            ref={hl19[i]}
            position={[FILE_VAL_X(2), FILE_Y(i)]}
            width={100}
            height={34}
            stroke={T.yellow}
            lineWidth={3}
            opacity={0}
          />
        ))}
        <Node ref={asmRow} opacity={0}>
          <Txt ref={asmLab} position={[-545, 150]} offset={[-1, 0]} fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.sans} text={'第 3 行'} />
          {ROW3.map((v, j) => (
            <Txt
              key={`asm-${j}`}
              ref={asmCells[j]}
              position={[FILE_VAL_X(j), 150]}
              fontSize={16}
              fontWeight={700}
              fill={T.yellow}
              fontFamily={FONT.mono}
              text={v}
            />
          ))}
        </Node>
        <Txt ref={tag23} position={[0, 215]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'第 23 个 → 第 23 行'} opacity={0} />
      </Node>

      {/* 100 列只用 3 列 */}
      <Node ref={pWide} opacity={0}>
        {wideCells.map((ref, i) => (
          <Rect
            key={`wc-${i}`}
            ref={ref}
            position={[wgridX(i), wgridY(i)]}
            width={21}
            height={26}
            fill={T.card}
            stroke={T.line}
            lineWidth={1}
          />
        ))}
        <Rect ref={wideDim} position={[0, -120]} width={1150} height={90} fill={T.bg} opacity={0} />
        {wideHl.map((ref, k) => (
          <Rect
            key={`wh-${k}`}
            ref={ref}
            position={[wgridX(20 + k), wgridY(20 + k)]}
            width={25}
            height={30}
            stroke={T.yellow}
            lineWidth={3}
            opacity={0}
          />
        ))}
        <Rect ref={queryBox} position={[0, -210]} width={760} height={110} radius={16} fill={T.card} stroke={T.green} lineWidth={3} opacity={0}>
          <Txt position={[0, -75]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} text={'查询只读这三列'} />
        </Rect>
        {wideChipLabs.map((lab, i) => (
          <Rect
            key={`wch-${i}`}
            ref={wideChips[i]}
            position={[-300 + i * 300, 20]}
            width={200}
            height={56}
            radius={12}
            fill={T.card}
            stroke={T.yellow}
            lineWidth={2}
            opacity={0}
          >
            <Txt fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.mono} text={lab} />
          </Rect>
        ))}
        <Line ref={skipArrow} points={[[-560, 110], [560, 110]]} stroke={T.muted} lineWidth={3} endArrow opacity={0} />
        <Txt ref={skipLab} position={[0, 150]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'其余列直接跳过'} opacity={0} />
      </Node>
    </>
  );

  say('每列的值存在一起');
  yield* beat('b10',
    all(pIdea().opacity(1, 0.5)),
    at('一行的全部值', ideaFrame().stroke(T.yellow, 0.4)),
    at('每列的全部值',
      all(
        strips[0]().opacity(1, 0.4), strips[1]().opacity(1, 0.4), strips[2]().opacity(1, 0.4), strips[3]().opacity(1, 0.4),
        strips[4]().opacity(1, 0.4), strips[5]().opacity(1, 0.4), strips[6]().opacity(1, 0.4), strips[7]().opacity(1, 0.4),
        stripLabs[0]().opacity(1, 0.4), stripLabs[1]().opacity(1, 0.4), stripLabs[2]().opacity(1, 0.4), stripLabs[3]().opacity(1, 0.4),
        stripLabs[4]().opacity(1, 0.4), stripLabs[5]().opacity(1, 0.4), stripLabs[6]().opacity(1, 0.4), stripLabs[7]().opacity(1, 0.4),
        valFly[0]().position([TAB_X(0), 30], 1.2), valFly[1]().position([TAB_X(1), 30], 1.2),
        valFly[2]().position([TAB_X(2), 30], 1.2), valFly[3]().position([TAB_X(3), 30], 1.2),
        valFly[4]().position([TAB_X(4), 30], 1.2), valFly[5]().position([TAB_X(5), 30], 1.2),
        valFly[6]().position([TAB_X(6), 30], 1.2), valFly[7]().position([TAB_X(7), 30], 1.2),
      )),
  );

  say('每列一个文件');
  yield* beat('b11',
    at('每列单独存一个文件',
      all(
        stripFileTags[0]().opacity(1, 0.4), stripFileTags[1]().opacity(1, 0.4), stripFileTags[2]().opacity(1, 0.4), stripFileTags[3]().opacity(1, 0.4),
        stripFileTags[4]().opacity(1, 0.4), stripFileTags[5]().opacity(1, 0.4), stripFileTags[6]().opacity(1, 0.4), stripFileTags[7]().opacity(1, 0.4),
      )),
    at('只读它用的那几列',
      all(
        strips[0]().stroke(T.yellow, 0.4), strips[1]().stroke(T.yellow, 0.4), strips[5]().stroke(T.yellow, 0.4),
        strips[2]().opacity(0.35, 0.5), strips[3]().opacity(0.35, 0.5), strips[4]().opacity(0.35, 0.5),
        strips[6]().opacity(0.35, 0.5), strips[7]().opacity(0.35, 0.5),
        stripLabs[2]().opacity(0.35, 0.5), stripLabs[3]().opacity(0.35, 0.5), stripLabs[4]().opacity(0.35, 0.5),
        stripLabs[6]().opacity(0.35, 0.5), stripLabs[7]().opacity(0.35, 0.5),
        stripFileTags[2]().opacity(0.35, 0.5), stripFileTags[3]().opacity(0.35, 0.5), stripFileTags[4]().opacity(0.35, 0.5),
        stripFileTags[6]().opacity(0.35, 0.5), stripFileTags[7]().opacity(0.35, 0.5),
      )),
    at('省下大量工作', restTag().opacity(1, 0.5)),
  );

  say('八行 × 八列');
  yield* beat('b12',
    chain(pIdea().opacity(0, 0.4), pTable().opacity(1, 0.4)),
    at('八行八列', all(tabHead[0]().opacity(1, 0.3), tabHead[7]().opacity(1, 0.3))),
    at('另一组示例数据', noteBar().opacity(1, 0.5)),
    at('不是同一批', noteBar().stroke(T.red, 0.4)),
  );

  say('每行八个值');
  yield* beat('b13',
    at('日期', tabHead[0]().fill(T.yellow, 0.4)),
    at('数量', tabHead[5]().fill(T.yellow, 0.4)),
    at('两个价格', all(tabHead[6]().fill(T.yellow, 0.4), tabHead[7]().fill(T.yellow, 0.4))),
  );

  say('八列，八个文件');
  yield* beat('b14',
    chain(pTable().opacity(0, 0.4), pFiles().opacity(1, 0.4)),
    at('日期列一个文件', fileRows[0]().opacity(1, 0.5)),
    at('产品列一个文件', fileRows[1]().opacity(1, 0.5)),
    at('八个文件',
      all(fileRows[2]().opacity(1, 0.4), fileRows[3]().opacity(1, 0.4), fileRows[4]().opacity(1, 0.4),
        fileRows[5]().opacity(1, 0.4), fileRows[6]().opacity(1, 0.4), fileRows[7]().opacity(1, 0.4))),
  );

  say('一列接一列落位');
  yield* beat('b15',
    at('第一列', chain(fileCells[0][0]().opacity(1, 0.15), fileCells[0][1]().opacity(1, 0.15), fileCells[0][2]().opacity(1, 0.15), fileCells[0][3]().opacity(1, 0.15), fileCells[0][4]().opacity(1, 0.15), fileCells[0][5]().opacity(1, 0.15), fileCells[0][6]().opacity(1, 0.15), fileCells[0][7]().opacity(1, 0.15))),
    at('产品列', chain(fileCells[1][0]().opacity(1, 0.15), fileCells[1][1]().opacity(1, 0.15), fileCells[1][2]().opacity(1, 0.15), fileCells[1][3]().opacity(1, 0.15), fileCells[1][4]().opacity(1, 0.15), fileCells[1][5]().opacity(1, 0.15), fileCells[1][6]().opacity(1, 0.15), fileCells[1][7]().opacity(1, 0.15))),
    at('商店列', chain(fileCells[2][0]().opacity(1, 0.15), fileCells[2][1]().opacity(1, 0.15), fileCells[2][2]().opacity(1, 0.15), fileCells[2][3]().opacity(1, 0.15), fileCells[2][4]().opacity(1, 0.15), fileCells[2][5]().opacity(1, 0.15), fileCells[2][6]().opacity(1, 0.15), fileCells[2][7]().opacity(1, 0.15))),
    at('一列接一列',
      all(
        fileCells[3][0]().opacity(1, 0.4), fileCells[3][1]().opacity(1, 0.4), fileCells[3][2]().opacity(1, 0.4), fileCells[3][3]().opacity(1, 0.4),
        fileCells[3][4]().opacity(1, 0.4), fileCells[3][5]().opacity(1, 0.4), fileCells[3][6]().opacity(1, 0.4), fileCells[3][7]().opacity(1, 0.4),
        fileCells[4][0]().opacity(1, 0.4), fileCells[4][1]().opacity(1, 0.4), fileCells[4][2]().opacity(1, 0.4), fileCells[4][3]().opacity(1, 0.4),
        fileCells[4][4]().opacity(1, 0.4), fileCells[4][5]().opacity(1, 0.4), fileCells[4][6]().opacity(1, 0.4), fileCells[4][7]().opacity(1, 0.4),
        fileCells[5][0]().opacity(1, 0.4), fileCells[5][1]().opacity(1, 0.4), fileCells[5][2]().opacity(1, 0.4), fileCells[5][3]().opacity(1, 0.4),
        fileCells[5][4]().opacity(1, 0.4), fileCells[5][5]().opacity(1, 0.4), fileCells[5][6]().opacity(1, 0.4), fileCells[5][7]().opacity(1, 0.4),
        fileCells[6][0]().opacity(1, 0.4), fileCells[6][1]().opacity(1, 0.4), fileCells[6][2]().opacity(1, 0.4), fileCells[6][3]().opacity(1, 0.4),
        fileCells[6][4]().opacity(1, 0.4), fileCells[6][5]().opacity(1, 0.4), fileCells[6][6]().opacity(1, 0.4), fileCells[6][7]().opacity(1, 0.4),
        fileCells[7][0]().opacity(1, 0.4), fileCells[7][1]().opacity(1, 0.4), fileCells[7][2]().opacity(1, 0.4), fileCells[7][3]().opacity(1, 0.4),
        fileCells[7][4]().opacity(1, 0.4), fileCells[7][5]().opacity(1, 0.4), fileCells[7][6]().opacity(1, 0.4), fileCells[7][7]().opacity(1, 0.4),
      )),
  );

  say('值一样，排法换了');
  yield* beat('b16',
    at('一模一样', all(fileRows[0]().opacity(1, 0.3), fileRows[7]().opacity(1, 0.3))),
    at('换了个排法', sweepBar().opacity(0.15, 0.4)),
  );

  say('别拼成同一张表');
  yield* beat('b17',
    chain(pFiles().opacity(0, 0.4), all(pTable().opacity(1, 0.4), noteBar().opacity(1, 0.4))),
    at('独立的示例', row2hl().opacity(1, 0.5)),
    at('只有一行', row2lab().opacity(1, 0.5)),
    at('别把两组拼成同一张表', noteBar().stroke(T.red, 0.4)),
  );

  say('顺序必须一样');
  yield* beat('b18',
    chain(pTable().opacity(0, 0.4), pFiles().opacity(1, 0.4)),
    at('顺序必须一模一样', chain(sweepBar().opacity(0.15, 0.3), sweepBar().position([-490, 40], 1.6))),
    at('拼不回去', sweepBar().opacity(0, 0.4)),
  );

  say('第 23 个拼回第 23 行');
  yield* beat('b19',
    at('同一个位置',
      all(hl19[0]().opacity(1, 0.4), hl19[1]().opacity(1, 0.4), hl19[2]().opacity(1, 0.4), hl19[3]().opacity(1, 0.4),
        hl19[4]().opacity(1, 0.4), hl19[5]().opacity(1, 0.4), hl19[6]().opacity(1, 0.4), hl19[7]().opacity(1, 0.4))),
    at('第三个拼回第三行', asmRow().opacity(1, 0.5)),
    at('第二十三个拼回第二十三行', tag23().opacity(1, 0.5)),
  );

  say('100 多列，只读 3 列');
  yield* beat('b20a',
    chain(pFiles().opacity(0, 0.4), pWide().opacity(1, 0.4)),
    at('三列亮起来', all(wideHl[0]().opacity(1, 0.4), wideHl[1]().opacity(1, 0.4), wideHl[2]().opacity(1, 0.4),
      wideChips[0]().opacity(1, 0.4), wideChips[1]().opacity(1, 0.4), wideChips[2]().opacity(1, 0.4))),
  );

  say('其余列变灰跳过');
  yield* beat('b20b',
    at('变灰', wideDim().opacity(0.55, 0.5)),
    at('跳过', all(skipArrow().opacity(1, 0.4), skipLab().opacity(1, 0.4))),
  );

  say('只读要用的列');
  yield* beat('b21',
    all(wideDim().opacity(0, 0.4), skipArrow().opacity(0, 0.4), skipLab().opacity(0, 0.4), queryBox().opacity(1, 0.5)),
    at('只读这三列', all(wideChips[0]().position([-220, -210], 1.0), wideChips[1]().position([0, -210], 1.0), wideChips[2]().position([220, -210], 1.0))),
    at('省下的工作', all(wideChips[0]().scale(1.06, 0.5), wideChips[1]().scale(1.06, 0.5), wideChips[2]().scale(1.06, 0.5))),
  );
});
