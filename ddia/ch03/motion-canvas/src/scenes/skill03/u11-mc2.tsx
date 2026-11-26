// U11 场景 2（MC，r5）：k6–k15 —— 转置演出：行表 8 行 × 8 列逐列抽出、落成 8 个列文件、
// 按同顺序拼回整行（第 3 个 / 第 8 个）。分镜：skill-ch03/beats-u11.md；原文：DDIA §3.10。
// 原图 3-10 按处置“改编”：行表与列文件内容按原图图片逐格核对重新生成；
// r7：k7 补半句旁白 + 绿/黄图例；k12 加“还是刚才那张表”小标；k15 拍首即清除 k14 的底部条。
// r5：只讲这张八行八列的表，不提另一张表，k12 的跨组标注条已去掉。
// 时长全部来自 timeline/u11.json（beat() 驱动），不手写 waitFor。
import {Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, chain, createRef} from '@motion-canvas/core';
import {at, makeBeats} from '../../lib/beats';
import {KV} from '../../lib/schemas';
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
const ROW8 = FILE_VALS.map(col => col[7]); // 第 8 行：140103 / 31 / 8 / NULL / 233 / 1 / 0.99 / 0.99

const TAB_X = (ci: number) => -455 + ci * 130;
const TAB_Y = (ri: number) => -163 + ri * 32; // ri=-1 为表头
const FILE_VAL_X = (j: number) => -272 + j * 102;
const FILE_Y = (i: number) => -240 + i * 40;

export default makeScene2D(function* (view) {
  view.fill(T.bg);
  const beat = makeBeats(timeline);

  const header = createRef<Txt>();
  const anchor = createRef<Txt>();
  const say = (text: string) => anchor().text(text);

  // ---- k6–k9、k12：行表 ----
  const pTable = createRef<Node>();
  const tabHead = COLS.map(() => createRef<Txt>());
  const tabCells = ROWS.map(() => Array.from({length: 8}, () => createRef<Txt>()));
  const row2hl = createRef<Rect>();

  // ---- k6–k15：列文件 ----
  const pFiles = createRef<Node>();
  const fileRows = COLS.map(() => createRef<Node>());
  const fileLabels = COLS.map(() => createRef<Txt>());
  const fileRects = COLS.map(() => createRef<Rect>());
  const fileCells = FILE_VALS.map(col => col.map(() => createRef<Rect>()));
  const sweepBar = createRef<Rect>();
  const hl19 = COLS.map(() => createRef<Rect>());
  const hl8 = COLS.map(() => createRef<Rect>());
  const asmRow = createRef<Node>();
  const asmLab = createRef<Txt>();
  const asmLab8 = createRef<Txt>();
  // r7 P2-14：k12 行表重现时角标“还是刚才那张表”。
  const sameTableTag = createRef<Txt>();
  // r7 P2-4：k7 图例（绿：第一次出现；黄：重复的值）——k6 先把整列描黄，
  // 首值再描绿；黄色是主题黄（#FBBF24），新手读来偏橙，图例按实际颜色写“黄”。
  const colorLegend = createRef<Txt>();
  // 拼回的 8 个值：有身份的数据块，从各列文件第 3 个位置飞到拼好的行里
  const asmKVs = ROW3.map((v, i) => new KV(v, '', 'key', {w: 96}));
  asmKVs.forEach((kv, i) => kv.node.position([FILE_VAL_X(2), FILE_Y(i)]));
  // k15 用：第 8 行的 8 个值，从各列文件第 8 个位置飞到拼好的行里
  const asm8KVs = ROW8.map((v, i) => new KV(v, '', 'key', {w: 96}));
  asm8KVs.forEach((kv, i) => kv.node.position([FILE_VAL_X(7), FILE_Y(i)]));
  const tag8 = createRef<Txt>();

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
        <Txt ref={sameTableTag} position={[0, 110]} fontSize={18} fill={T.muted} fontFamily={FONT.sans} text={'还是刚才那张表'} opacity={0} />
        <Txt ref={colorLegend} position={[0, 92]} fontSize={18} fill={T.muted} fontFamily={FONT.sans} text={'绿：第一次出现；黄：重复的值'} opacity={0} />
      </Node>

      {/* 列文件 */}
      <Node ref={pFiles} opacity={0}>
        {COLS.map((c, i) => (
          <Node key={`fr-${i}`} ref={fileRows[i]} opacity={0}>
            <Rect ref={fileRects[i]} position={[-490, FILE_Y(i)]} offset={[-1, 0]} width={980} height={36} radius={8} fill={T.card} stroke={T.line} lineWidth={1}>
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
        {COLS.map((c, i) => (
          <Rect
            key={`h8-${i}`}
            ref={hl8[i]}
            position={[FILE_VAL_X(7), FILE_Y(i)]}
            width={100}
            height={34}
            stroke={T.yellow}
            lineWidth={3}
            opacity={0}
          />
        ))}
        <Node ref={asmRow} opacity={0}>
          <Txt ref={asmLab} position={[-545, 150]} offset={[-1, 0]} fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.sans} text={'第 3 行'} />
          <Txt ref={asmLab8} position={[-545, 150]} offset={[-1, 0]} fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.sans} text={'第 8 个 → 第 8 行'} opacity={0} />
        </Node>
        <Txt ref={tag8} position={[0, 215]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'第 8 个 → 第 8 行'} opacity={0} />
      </Node>
    </>
  );
  pFiles().add(asmKVs.map(kv => kv.node));
  pFiles().add(asm8KVs.map(kv => kv.node));
  // k6–k9：行表与列文件卡不能同区共存（表 y -195..61、列表卡 y -240..40 几乎全重叠，
  // r3 初版因此在 k9/k10 报遮挡 error）。日期/产品两张卡先以“预览条”放在表下方
  // （卡面 y=125 / 180，表底 61、锚文本 280 之间无重叠），k10 再飞回列表位置。
  fileRows[0]().position([0, 365]);
  fileRows[1]().position([0, 380]);

  say('日期列，先抽出来');
  yield* beat('k6',
    all(pTable().opacity(1, 0.5), pFiles().opacity(1, 0.5), fileRows[0]().opacity(1, 0.5)),
    at('第一列', all(tabCells[0][0]().fill(T.yellow, 0.3), tabCells[1][0]().fill(T.yellow, 0.3), tabCells[2][0]().fill(T.yellow, 0.3), tabCells[3][0]().fill(T.yellow, 0.3), tabCells[4][0]().fill(T.yellow, 0.3), tabCells[5][0]().fill(T.yellow, 0.3), tabCells[6][0]().fill(T.yellow, 0.3), tabCells[7][0]().fill(T.yellow, 0.3))),
    at('日期文件', chain(fileCells[0][0]().opacity(1, 0.15), fileCells[0][1]().opacity(1, 0.15), fileCells[0][2]().opacity(1, 0.15), fileCells[0][3]().opacity(1, 0.15), fileCells[0][4]().opacity(1, 0.15), fileCells[0][5]().opacity(1, 0.15), fileCells[0][6]().opacity(1, 0.15), fileCells[0][7]().opacity(1, 0.15))),
  );

  say('值一样，排法换了');
  yield* beat('k7',
    at('日期文件', chain(fileCells[0][0]().stroke(T.yellow, 0.15), fileCells[0][1]().stroke(T.yellow, 0.15), fileCells[0][2]().stroke(T.yellow, 0.15), fileCells[0][3]().stroke(T.yellow, 0.15), fileCells[0][4]().stroke(T.yellow, 0.15), fileCells[0][5]().stroke(T.yellow, 0.15), fileCells[0][6]().stroke(T.yellow, 0.15), fileCells[0][7]().stroke(T.yellow, 0.15))),
    at('一模一样', all(tabCells[0][0]().fill(T.green, 0.3), tabCells[4][0]().fill(T.green, 0.3))),
    at('换了个排法', fileRects[0]().stroke(T.green, 0.4)),
    // r7 P2-4：新句“第一次出现的值标成绿色，重复的值还是黄色”处亮起图例。
    at('第一次出现', colorLegend().opacity(1, 0.4)),
  );

  say('产品列：六九、七四、三一');
  yield* beat('k8',
    fileRows[1]().opacity(1, 0.5),
    at('产品列', all(tabCells[0][1]().fill(T.yellow, 0.3), tabCells[1][1]().fill(T.yellow, 0.3), tabCells[2][1]().fill(T.yellow, 0.3), tabCells[3][1]().fill(T.yellow, 0.3), tabCells[4][1]().fill(T.yellow, 0.3), tabCells[5][1]().fill(T.yellow, 0.3), tabCells[6][1]().fill(T.yellow, 0.3), tabCells[7][1]().fill(T.yellow, 0.3))),
    at('六九', chain(fileCells[1][0]().opacity(1, 0.15), fileCells[1][1]().opacity(1, 0.15), fileCells[1][2]().opacity(1, 0.15))),
    at('七四', fileCells[1][3]().opacity(1, 0.15)),
    at('三一', chain(fileCells[1][4]().opacity(1, 0.15), fileCells[1][5]().opacity(1, 0.15), fileCells[1][6]().opacity(1, 0.15), fileCells[1][7]().opacity(1, 0.15))),
  );

  say('每一格都对得上');
  yield* beat('k9',
    at('产品文件', chain(fileCells[1][0]().stroke(T.green, 0.15), fileCells[1][1]().stroke(T.green, 0.15), fileCells[1][2]().stroke(T.green, 0.15), fileCells[1][3]().stroke(T.green, 0.15), fileCells[1][4]().stroke(T.green, 0.15), fileCells[1][5]().stroke(T.green, 0.15), fileCells[1][6]().stroke(T.green, 0.15), fileCells[1][7]().stroke(T.green, 0.15))),
    at('对得上', all(tabCells[0][1]().fill(T.green, 0.3), tabCells[3][1]().fill(T.green, 0.3), tabCells[4][1]().fill(T.green, 0.3))),
  );

  say('一列接一列落位');
  yield* beat('k10',
    // 先把表淡出，再让两张预览条飞回列表位置（365/380px 用 1.5s，约 122–127px/0.5s，
    // 低于 fast-move 阈值），飞完其余六行卡再出现——飞行途中不与已出现的卡重叠。
    chain(pTable().opacity(0, 0.4),
      all(fileRows[0]().position([0, 0], 1.5), fileRows[1]().position([0, 0], 1.5)),
      all(fileRows[2]().opacity(1, 0.4), fileRows[3]().opacity(1, 0.4), fileRows[4]().opacity(1, 0.4),
        fileRows[5]().opacity(1, 0.4), fileRows[6]().opacity(1, 0.4), fileRows[7]().opacity(1, 0.4))),
    at('商店', chain(fileCells[2][0]().opacity(1, 0.12), fileCells[2][1]().opacity(1, 0.12), fileCells[2][2]().opacity(1, 0.12), fileCells[2][3]().opacity(1, 0.12), fileCells[2][4]().opacity(1, 0.12), fileCells[2][5]().opacity(1, 0.12), fileCells[2][6]().opacity(1, 0.12), fileCells[2][7]().opacity(1, 0.12))),
    at('促销', chain(fileCells[3][0]().opacity(1, 0.12), fileCells[3][1]().opacity(1, 0.12), fileCells[3][2]().opacity(1, 0.12), fileCells[3][3]().opacity(1, 0.12), fileCells[3][4]().opacity(1, 0.12), fileCells[3][5]().opacity(1, 0.12), fileCells[3][6]().opacity(1, 0.12), fileCells[3][7]().opacity(1, 0.12))),
    at('顾客', chain(fileCells[4][0]().opacity(1, 0.12), fileCells[4][1]().opacity(1, 0.12), fileCells[4][2]().opacity(1, 0.12), fileCells[4][3]().opacity(1, 0.12), fileCells[4][4]().opacity(1, 0.12), fileCells[4][5]().opacity(1, 0.12), fileCells[4][6]().opacity(1, 0.12), fileCells[4][7]().opacity(1, 0.12))),
    at('数量', chain(fileCells[5][0]().opacity(1, 0.12), fileCells[5][1]().opacity(1, 0.12), fileCells[5][2]().opacity(1, 0.12), fileCells[5][3]().opacity(1, 0.12), fileCells[5][4]().opacity(1, 0.12), fileCells[5][5]().opacity(1, 0.12), fileCells[5][6]().opacity(1, 0.12), fileCells[5][7]().opacity(1, 0.12))),
    at('两个价格',
      // r5：两个价格列 16 格逐格落位（原先并行亮起后静止 3.5s idle），填满拍尾。
      chain(
        fileCells[6][0]().opacity(1, 0.12), fileCells[6][1]().opacity(1, 0.12),
        fileCells[6][2]().opacity(1, 0.12), fileCells[6][3]().opacity(1, 0.12),
        fileCells[6][4]().opacity(1, 0.12), fileCells[6][5]().opacity(1, 0.12),
        fileCells[6][6]().opacity(1, 0.12), fileCells[6][7]().opacity(1, 0.12),
        fileCells[7][0]().opacity(1, 0.12), fileCells[7][1]().opacity(1, 0.12),
        fileCells[7][2]().opacity(1, 0.12), fileCells[7][3]().opacity(1, 0.12),
        fileCells[7][4]().opacity(1, 0.12), fileCells[7][5]().opacity(1, 0.12),
        fileCells[7][6]().opacity(1, 0.12), fileCells[7][7]().opacity(1, 0.12),
      )),
  );

  say('八列，八个文件');
  yield* beat('k11',
    // r5：扫过带从拍首就缓慢扫过（5.0s，原先 1.6s 且起得晚、拍首静止 5.03s），
    // 扫完在“换了个排法”处淡出。
    at('八个文件',
      all(fileRows[0]().opacity(1, 0.3), fileRows[7]().opacity(1, 0.3),
        chain(sweepBar().opacity(0.12, 0.3), sweepBar().position([-490, 40], 5.0)))),
    at('换了个排法', sweepBar().opacity(0, 0.4)),
  );

  say('只讲这一张表');
  yield* beat('k12',
    // r5：删掉“另一组示例，别拼成同一张表”标注条（另一张表本单元没出现）；
    // 高亮框从第 1 行逐行滑到第 8 行，填满 5.16s hold 尾巴不留静帧。
    chain(pFiles().opacity(0, 0.4), pTable().opacity(1, 0.4)),
    at('独立的例子', chain(row2hl().position([0, TAB_Y(0)], 0), row2hl().opacity(1, 0.5))),
    at('只讲这一张表',
      chain(
        row2hl().position([0, TAB_Y(1)], 0.45),
        row2hl().position([0, TAB_Y(2)], 0.45),
        row2hl().position([0, TAB_Y(3)], 0.45),
        row2hl().position([0, TAB_Y(4)], 0.45),
        row2hl().position([0, TAB_Y(5)], 0.45),
        row2hl().position([0, TAB_Y(6)], 0.45),
        row2hl().position([0, TAB_Y(7)], 0.45),
        row2hl().opacity(0, 0.4),
        // r7 P2-14：画面加“还是刚才那张表”小标，不只靠旁白一句。
        sameTableTag().opacity(1, 0.4))),
  );

  say('顺序必须一样');
  yield* beat('k13',
    chain(pTable().opacity(0, 0.4), pFiles().opacity(1, 0.4)),
    at('顺序必须一模一样', chain(fileCells[0][0]().stroke(T.yellow, 0.15), fileCells[1][0]().stroke(T.yellow, 0.15), fileCells[2][0]().stroke(T.yellow, 0.15), fileCells[3][0]().stroke(T.yellow, 0.15), fileCells[4][0]().stroke(T.yellow, 0.15), fileCells[5][0]().stroke(T.yellow, 0.15), fileCells[6][0]().stroke(T.yellow, 0.15), fileCells[7][0]().stroke(T.yellow, 0.15))),
    at('拼不回去', sweepBar().opacity(0.12, 0.4)),
  );

  say('第 3 个拼回第 3 行');
  yield* beat('k14',
    at('同一个位置',
      all(hl19[0]().opacity(1, 0.4), hl19[1]().opacity(1, 0.4), hl19[2]().opacity(1, 0.4), hl19[3]().opacity(1, 0.4),
        hl19[4]().opacity(1, 0.4), hl19[5]().opacity(1, 0.4), hl19[6]().opacity(1, 0.4), hl19[7]().opacity(1, 0.4))),
    at('第三个拼回第三行',
      all(asmRow().opacity(1, 0.5),
        ...asmKVs.map((kv, i) => chain(kv.node.opacity(1, 0.3), kv.moveTo([FILE_VAL_X(i), 150], 1.2))))),
  );

  say('第 8 个拼回第 8 行');
  yield* beat('k15',
    // r4：第 23 个超出演示表（只有 8 行），改到表内：第 8 个拼回第 8 行。
    // r7 P2-12：拍首即清除 k14 拼好的第 3 行（底部条 + 第 3 个位置高亮 + 飞出的 8 个值），
    // 首帧不留上一拍的拼好行——清除动作放在拍首，不等“第八个拼回第八行”那句。
    all(asmRow().opacity(0, 0.05), asmLab().opacity(0, 0.05),
      ...asmKVs.map(kv => kv.node.opacity(0, 0.05)),
      ...hl19.map(h => h().opacity(0, 0.05))),
    at('第八个拼回第八行',
      all(...hl8.map(h => h().opacity(1, 0.4)),
        asmRow().opacity(1, 0.5),
        ...asm8KVs.map((kv, i) => chain(kv.node.opacity(1, 0.3), kv.moveTo([FILE_VAL_X(i), 150], 1.2))))),
    // r5：拼好后八个值逐个轻闪确认（原先拼好后静止 4.7s idle），填满拍尾。
    at('第八个条目',
      chain(all(asmLab8().opacity(1, 0.4), tag8().opacity(1, 0.5)),
        chain(...asm8KVs.map(kv => chain(kv.node.scale(1.12, 0.15), kv.node.scale(1, 0.15)))))),
  );
});
