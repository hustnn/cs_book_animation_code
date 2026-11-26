// U12 场景 2（MC，r7）：l18–l27b —— 稀疏位图、游程编码逐行压短、
// 按位或（30、68、69 三张位图，结果命中 9 行）、按位与（31 与商店编号 3，结果命中 3 行）与第 k 位对同一行。
// r7（修 r6 新手测试 P2-1）：l18 补总量示意 tally（打个比方，八十亿行：一张 1 GB，二百张 200 GB 放得下，十万张 100 TB 放不下，标“示意”；验算见 review.md），l19 开头随对照一起淡出。
// r6（修 r5 新手测试 15 项中的 mc2 部分）：l18 注脚不再淡到 0.45（保持全亮到拍末），
// 并补“二百张 vs 十万张（×500）”条形对照；l20 开头补三十缺六个零；l27a 补半句
// “写的时候，每列都按同一顺序存下来”（行顺序谁保证，3.11-7 + 3.12-1）。
// 分镜：skill-ch03/beats-u12.md（l 系）；原文：DDIA §3.11（书页 p98–99，PDF p120–121）。
// 游程编码数字按原图：29：9, 1；30：10, 2；31：5, 4, 3, 3；68：15, 1；69：0, 4, 12, 2；74：4, 1。
// 按位与里的商店编号 3 位图不在原图里：画成示意行（标“示意”），1 在第 6、8、13、17 位，
// 与 31 的位图按位与后得第 6、8、13 位，只演“同顺序、第 k 位对同一行”的机制。
// 与 r1 的差别：拍号 b 系 → l 系；位图行改用 lib/schemas.ts 的 Bits 组件（r1 是手摆 Rect 格子）：
// 置位的格子填绿、未置位是底色，探查时用 mark() 描边（1 描黄、0 描红）；l24 对结果行的 9 个 1 mark 描黄边，
// 并用 Counter 数出“命中 9 行”；l27a 在第 6、8 列画两支对齐箭头、两行对应格子 mark 描黄边，
// l27b 用 Counter 数出“命中 3 行”；l27 拆回 l27a/l27b（沿用 r1 的 b24a/b24b 配音）。
// 时长全部来自 timeline/u12.json（beat() 驱动），不手写 waitFor。
import {Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {Vector2, all, chain, createRef} from '@motion-canvas/core';
import {at, makeBeats} from '../../lib/beats';
import {FONT, SAFE, SIZE, T} from '../../lib/theme';
import {Bits, Counter} from '../../lib/schemas';
import timeline from '../../timeline/u12.json';

const VALUES = [69, 69, 69, 69, 74, 31, 31, 31, 31, 29, 30, 30, 31, 31, 31, 68, 69, 69];
const BITMAPS: {v: number; bits: number[]}[] = [
  {v: 29, bits: [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0]},
  {v: 30, bits: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0]},
  {v: 31, bits: [0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0]},
  {v: 68, bits: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0]},
  {v: 69, bits: [1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1]},
  {v: 74, bits: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]},
];
// 游程编码行：值、编码、括号说明（按原图）
const RLE: {v: number; code: string; note: string}[] = [
  {v: 29, code: '9，1', note: '9 个 0、1 个 1，其余 0'},
  {v: 30, code: '10，2', note: '10 个 0、2 个 1，其余 0'},
  {v: 31, code: '5，4，3，3', note: '5 个 0、4 个 1、3 个 0、3 个 1，其余 0'},
  {v: 68, code: '15，1', note: '15 个 0、1 个 1，其余 0'},
  {v: 69, code: '0，4，12，2', note: '0 个 0、4 个 1、12 个 0、2 个 1'},
  {v: 74, code: '4，1', note: '4 个 0、1 个 1，其余 0'},
];
const CELL_W = 40;
const CELL_H = 28;
const PITCH = 43;
const cellX = (i: number) => -365 + i * PITCH;
const VAL_Y = -258;
const ROW_Y = [-214, -176, -138, -100, -62, -24];
const RLE_Y = [42, 76, 110, 144, 178, 212];
// 按位或：30、68、69 三张位图叠加，结果的 1 在第 1–4、11、12、16、17、18 位
const OR_ROWS = [1, 3, 4];
const OR_RESULT = [1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1];
const OR_ONES = [0, 1, 2, 3, 10, 11, 15, 16, 17];
// 按位与：31 的位图（按原图）与商店编号 3 的位图（示意：1 在第 6、8、13、17 位）
const STORE3 = [0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0];
// 商店编号列的 18 个原值（示意数据，r4 l25b）：编号三在第 6、8、13、17 行，与 STORE3 一致
const STORE_COL = [1, 2, 1, 4, 2, 3, 5, 3, 1, 2, 4, 1, 3, 2, 5, 1, 3, 4];
const AND_RESULT = [0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0];
const AND_ONES = [5, 7, 12];
const ONES = (bits: number[]) => bits.map((b, i) => (b ? i : -1)).filter(i => i >= 0);

export default makeScene2D(function* (view) {
  view.fill(T.bg);
  const beat = makeBeats(timeline);

  const header = createRef<Txt>();
  const anchor = createRef<Txt>();
  const say = (text: string) => anchor().text(text);

  // ---- 第 1 页：18 个值 + 6 张位图 + 游程编码 ----
  const p1 = createRef<Node>();
  const valCells = VALUES.map(() => createRef<Rect>());
  const rleLines = RLE.map(() => createRef<Node>());
  const compactLab = createRef<Txt>();
  const countryCard = createRef<Rect>();
  // r5 l18：国家列“二百张位图，每行一位，直接存”注脚
  const countryNote = createRef<Txt>();
  // r6 l18：二百张 vs 十万张的条形对照（条长不按比例，数字 ×500 是实的）
  const cmpLab200 = createRef<Txt>();
  const cmpBar200 = createRef<Rect>();
  const cmpLab10w = createRef<Txt>();
  const cmpBar10w = createRef<Rect>();
  const cmpX500 = createRef<Txt>();
  const cmpTag = createRef<Txt>();
  // r7 l18：总量示意 tally（八十亿行：一张 1 GB；二百张 200 GB 放得下，十万张 100 TB 放不下）
  // r7-fix：QA 2 error——×500 与黄条右端重叠 11%（三采样点命中）+ tally 只亮一次后静止 15.4s。
  // tally 改成三步跟旁白走（同位轮换），步间各有脉冲；×500 右移避开黄条。
  const cmpTot1 = createRef<Txt>();
  const cmpTot2 = createRef<Txt>();
  const cmpTot3 = createRef<Txt>();
  // r5 l21：69 的游程加起来正好 18 行（0 + 4 + 12 + 2 = 18）
  const rle69Tally = createRef<Txt>();
  // r4 l19b：解码 tally（9 + 1 + 8（补）= 18 行）
  const decodeTally = createRef<Txt>();

  // ---- 第 2 页：按位或 ----
  const p2 = createRef<Node>();
  const orQuery = createRef<Rect>();
  const orAns = createRef<Txt>();
  const orResultLab = createRef<Txt>();
  // r4 l24：“为什么快”的落点句
  const whyTag = createRef<Txt>();

  // ---- 第 3 页：按位与 ----
  const p3 = createRef<Node>();
  const andQ1 = createRef<Rect>();
  const andQ2 = createRef<Rect>();
  const andWord = createRef<Txt>();
  const andTag = createRef<Txt>();
  const andResultLab = createRef<Txt>();
  // r4 l25b：商店编号列 18 个原值（示意）+ 标签
  const storeValCells = STORE_COL.map(() => createRef<Rect>());
  const storeValLab = createRef<Txt>();
  const storeValTag = createRef<Txt>();
  // r4 l27a：共用行号标尺（1–18）+ 两端数字
  const rulerLab = createRef<Txt>();
  const ruler1 = createRef<Txt>();
  const ruler18 = createRef<Txt>();

  const orRowY = [-170, -100, -30];
  const andRowY = [-150, -50];

  // 位图行（Bits 组件）
  const p1Bits = BITMAPS.map(
    (bm, r) =>
      new Bits(new Vector2(0, ROW_Y[r]), 18, `= ${bm.v}`, {
        cell: CELL_W,
        cellH: CELL_H,
        font: 16,
        gap: 3,
        set: ONES(bm.bits),
      }),
  );
  const orBits = OR_ROWS.map(
    (r, k) =>
      new Bits(new Vector2(0, orRowY[k]), 18, `= ${BITMAPS[r].v}`, {
        cell: CELL_W,
        cellH: CELL_H,
        font: 16,
        gap: 3,
        set: ONES(BITMAPS[r].bits),
      }),
  );
  const orResultBits = new Bits(new Vector2(0, 60), 18, '', {
    cell: CELL_W,
    cellH: CELL_H,
    font: 16,
    gap: 3,
    set: OR_ONES,
  });
  const andBits31 = new Bits(new Vector2(0, andRowY[0]), 18, '= 31', {
    cell: CELL_W,
    cellH: CELL_H,
    font: 16,
    gap: 3,
    set: ONES(BITMAPS[2].bits),
  });
  const andBitsS = new Bits(new Vector2(0, andRowY[1]), 18, '商店 = 3', {
    cell: CELL_W,
    cellH: CELL_H,
    font: 16,
    gap: 3,
    set: ONES(STORE3),
  });
  const andResultBits = new Bits(new Vector2(0, 60), 18, '', {
    cell: CELL_W,
    cellH: CELL_H,
    font: 16,
    gap: 3,
    set: AND_ONES,
  });
  // r3：商店位图 4 个 1 格的位置序号签（第 6、8、13、17 位），挂在商店行下方，随 l26 逐个亮出。
  // 放下方不放上方：l27a 的对齐箭头从 31 行直通商店行顶边，上方会穿过序号签。
  const STORE_ONES = [5, 7, 12, 16];
  const storePosLabs = STORE_ONES.map(
    i =>
      new Txt({
        position: andBitsS.center(i).add([0, CELL_H / 2 + 18]),
        fontSize: 18,
        fontWeight: 700,
        fill: T.yellow,
        fontFamily: FONT.mono,
        text: String(i + 1),
        opacity: 0,
      }),
  );
  const orCounter = new Counter([0, 210], '命中 ', ' 行');
  const andCounter = new Counter([0, 150], '命中 ', ' 行');

  view.add(
    <>
      <Txt
        ref={header}
        position={[-SAFE.halfW, -SAFE.halfH]}
        offset={[-1, -1]}
        fontSize={SIZE.label}
        fill={T.muted}
        fontFamily={FONT.sans}
        text={'列压缩：位图'}
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

      {/* 第 1 页 */}
      <Node ref={p1} opacity={0}>
        {VALUES.map((v, i) => (
          <Rect
            key={`v-${i}`}
            ref={valCells[i]}
            position={[cellX(i), VAL_Y]}
            width={CELL_W}
            height={CELL_H}
            radius={6}
            fill={T.card}
            stroke={T.blue}
            lineWidth={1}
            opacity={0}
          >
            <Txt fontSize={18} fill={T.text} fontFamily={FONT.mono} text={String(v)} />
          </Rect>
        ))}
        {RLE.map((row, r) => (
          <Node key={`rle-${r}`} ref={rleLines[r]} opacity={0}>
            <Txt position={[-380, RLE_Y[r]]} offset={[-1, 0]} fontSize={20} fill={T.text} fontFamily={FONT.mono} text={`${row.v}：${row.code}`} />
            <Txt position={[80, RLE_Y[r]]} offset={[-1, 0]} fontSize={20} fill={T.muted} fontFamily={FONT.sans} text={`（${row.note}）`} />
          </Node>
        ))}
        <Rect ref={countryCard} position={[480, -130]} width={180} height={90} radius={12} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt position={[0, -22]} fontSize={20} fill={T.green} fontFamily={FONT.sans} text={'国家列'} />
          <Txt position={[0, 20]} fontSize={20} fill={T.text} fontFamily={FONT.sans} text={'二百来种值'} />
        </Rect>
        <Txt ref={countryNote} position={[480, -60]} fontSize={18} fill={T.yellow} fontFamily={FONT.sans} text={'二百张位图，每行一位，直接存'} textWrap maxWidth={180} textAlign={'center'} opacity={0} />
        {/* r6 l18：十万张 vs 二百张的对照（下半屏空处；RLE 行此时还没出现） */}
        <Txt ref={cmpLab200} position={[-430, 150]} offset={[1, 0]} fontSize={20} fill={T.text} fontFamily={FONT.sans} text={'二百张'} opacity={0} />
        <Rect ref={cmpBar200} position={[-290, 150]} width={60} height={30} radius={8} fill={T.green} opacity={0} />
        <Txt ref={cmpLab10w} position={[-430, 200]} offset={[1, 0]} fontSize={20} fill={T.text} fontFamily={FONT.sans} text={'十万张'} opacity={0} />
        <Rect ref={cmpBar10w} position={[-140, 200]} width={360} height={30} radius={8} fill={T.yellow} opacity={0} />
        <Txt ref={cmpX500} position={[95, 200]} fontSize={20} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'×500'} opacity={0} />
        <Txt ref={cmpTag} position={[150, 200]} offset={[-1, 0]} fontSize={16} fill={T.muted} fontFamily={FONT.sans} text={'（条长不按比例）'} opacity={0} />
        {/* r7 l18：总量示意 tally——三步跟旁白走，同位轮换（一步一行，念到哪步亮哪步） */}
        <Txt ref={cmpTot1} position={[0, 245]} fontSize={18} fill={T.yellow} fontFamily={FONT.sans} text={'打个比方：八十亿行，一张位图 1 GB（示意）'} opacity={0} />
        <Txt ref={cmpTot2} position={[0, 245]} fontSize={18} fill={T.yellow} fontFamily={FONT.sans} text={'二百张合起来 200 GB，仓库放得下（示意）'} opacity={0} />
        <Txt ref={cmpTot3} position={[0, 245]} fontSize={18} fill={T.yellow} fontFamily={FONT.sans} text={'十万张是它的五百倍，一百 TB，放不下（示意）'} opacity={0} />
        <Txt ref={compactLab} position={[0, 225]} fontSize={SIZE.body} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'非常紧凑'} opacity={0} />
        <Txt ref={decodeTally} position={[0, 8]} fontSize={22} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'解码：9 + 1 + 8（补）= 18 行（这列的行数）'} opacity={0} />
        <Txt ref={rle69Tally} position={[0, 8]} fontSize={22} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'69：0 + 4 + 12 + 2 = 18'} opacity={0} />
      </Node>

      {/* 第 2 页：按位或 */}
      <Node ref={p2} opacity={0}>
        <Rect ref={orQuery} position={[0, -250]} width={620} height={64} radius={14} fill={T.card} stroke={T.blue} lineWidth={3} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'查产品编号 30、68、69 的行'} />
        </Rect>
        <Txt ref={orResultLab} position={[-430, 60]} offset={[1, 0]} fontSize={20} fill={T.green} fontFamily={FONT.mono} text={'或 ='} opacity={0} />
        <Txt ref={orAns} position={[0, 150]} fontSize={SIZE.body} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'是一的位，就是答案所在的行'} opacity={0} />
        <Txt ref={whyTag} position={[0, 105]} fontSize={22} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'位图压得紧，一次整块算'} opacity={0} />
      </Node>

      {/* 第 3 页：按位与 */}
      <Node ref={p3} opacity={0}>
        {/* r4 l25b：商店编号列 18 个原值（示意），与下方两张位图行同 pitch、上下对齐 */}
        {STORE_COL.map((v, i) => (
          <Rect
            key={`sv-${i}`}
            ref={storeValCells[i]}
            position={[cellX(i), -195]}
            width={CELL_W}
            height={CELL_H}
            radius={6}
            fill={T.card}
            stroke={T.green}
            lineWidth={1}
            opacity={0}
          >
            <Txt fontSize={18} fill={T.text} fontFamily={FONT.mono} text={String(v)} />
          </Rect>
        ))}
        <Txt ref={storeValLab} position={[-410, -195]} offset={[1, 0]} fontSize={18} fill={T.muted} fontFamily={FONT.sans} text={'商店编号'} opacity={0} />
        <Txt ref={storeValTag} position={[480, -195]} offset={[-1, 0]} fontSize={SIZE.label} fill={T.purple} fontFamily={FONT.sans} text={'示意'} opacity={0} />
        <Txt ref={rulerLab} position={[-430, -100]} offset={[1, 0]} fontSize={18} fill={T.purple} fontFamily={FONT.sans} text={'行号标尺'} opacity={0} />
        <Txt ref={ruler1} position={[-396, -100]} offset={[1, 0]} fontSize={14} fill={T.muted} fontFamily={FONT.mono} text={'1'} opacity={0} />
        <Txt ref={ruler18} position={[396, -100]} offset={[-1, 0]} fontSize={14} fill={T.muted} fontFamily={FONT.mono} text={'18'} opacity={0} />
        <Rect ref={andQ1} position={[-300, -250]} width={420} height={64} radius={14} fill={T.card} stroke={T.blue} lineWidth={3} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'产品编号 31'} />
        </Rect>
        <Txt ref={andWord} position={[0, -250]} fontSize={SIZE.body} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'而且'} opacity={0} />
        <Rect ref={andQ2} position={[300, -250]} width={420} height={64} radius={14} fill={T.card} stroke={T.green} lineWidth={3} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'商店编号 3'} />
        </Rect>
        <Txt ref={andTag} position={[480, andRowY[1]]} offset={[-1, 0]} fontSize={SIZE.label} fill={T.purple} fontFamily={FONT.sans} text={'示意'} opacity={0} />
        <Txt ref={andResultLab} position={[-430, 60]} offset={[1, 0]} fontSize={20} fill={T.green} fontFamily={FONT.mono} text={'与 ='} opacity={0} />
      </Node>
    </>
  );
  p1().add(p1Bits.map(b => b.group));
  p2().add([...orBits.map(b => b.group), orResultBits.group, orCounter.node]);
  p3().add([andBits31.group, andBitsS.group, andResultBits.group, andCounter.node, ...storePosLabs]);
  // l27a 的对齐箭头：第 6、8 列上下两行之间（p3 坐标系）
  const arrow6 = new Line({
    points: [andBits31.center(5).add([0, CELL_H / 2]), andBitsS.center(5).add([0, -CELL_H / 2])],
    stroke: T.yellow,
    lineWidth: 2,
    endArrow: true,
    arrowSize: 8,
    end: 0,
  });
  const arrow8 = new Line({
    points: [andBits31.center(7).add([0, CELL_H / 2]), andBitsS.center(7).add([0, -CELL_H / 2])],
    stroke: T.yellow,
    lineWidth: 2,
    endArrow: true,
    arrowSize: 8,
    end: 0,
  });
  // r4 l27a：共用行号标尺——两行之间横贯整行的线（1–18），对齐箭头穿过它
  const rulerLine = new Line({
    points: [[-386, -100], [386, -100]],
    stroke: T.purple,
    lineWidth: 2,
    end: 0,
  });
  p3().add([arrow6, arrow8, rulerLine]);

  say('稀疏位图，零很多');
  yield* beat('l18',
    all(p1().opacity(1, 0.5), p1().scale(1.015, 8.5)),
    at('零就越多', chain(
      ...valCells.map(c => c().opacity(1, 0.15)),
      ...p1Bits.map(b => b.group.opacity(1, 0.3)),
    )),
    at('稀疏位图', all(...p1Bits.flatMap(b => b.cells.filter((_, i) => !b.isOn(i)).map(c => c.opacity(0.35, 0.5))))),
    at('二百来种值', countryCard().opacity(1, 0.5)),
    // r5 l18：二百种值就是二百张位图，每张按每行一位直接存，不用再压
    at('直接存', countryNote().opacity(1, 0.5)),
    // r6 l18：注脚保持全亮到拍末（r5 淡到 0.45 适得其反）；“十万种值就不行”时亮出二百张 vs 十万张对照
    at('值少，位图就少', countryCard().scale(1.04, 0.4).to(1, 0.4)),
    at('十万种值就不行', chain(
      countryCard().scale(1.04, 0.4).to(1, 0.4),
      all(cmpLab200().opacity(1, 0.4), cmpBar200().opacity(1, 0.4), cmpLab10w().opacity(1, 0.4), cmpBar10w().opacity(1, 0.4), cmpX500().opacity(1, 0.4), cmpTag().opacity(1, 0.4)),
    )),
    at('十万张对二百张', chain(
      cmpBar10w().scale(1.06, 0.4).to(1, 0.4),
      cmpX500().scale(1.2, 0.3).to(1, 0.3),
    )),
    // r7 P2-1：总量示意 tally 三步跟旁白走（同位轮换，步间脉冲不断档）——
    // 第一步“一张 1 GB”念到“打个比方”时亮起，念到“八十亿行”“合一个 GB”时各轻脉冲一次；
    // 第二步“二百张 200 GB 放得下”念到“二百张合起来二百 GB”时轮换上；第三步“十万张 100 TB 放不下”念到“十万张是它的五百倍”时轮换上，
    // 念到“一百 TB”时再轻脉冲一次收尾（r7-fix：一步亮完静止 15.4s 是 QA idle error）
    at('打个比方', cmpTot1().opacity(1, 0.5)),
    at('八十亿行', cmpTot1().scale(1.05, 0.3).to(1, 0.3)),
    at('合一个 GB', cmpTot1().scale(1.05, 0.3).to(1, 0.3)),
    at('二百张合起来二百 GB', all(cmpTot1().opacity(0, 0.3), cmpTot2().opacity(1, 0.4))),
    at('十万张是它的五百倍', all(cmpTot2().opacity(0, 0.3), cmpTot3().opacity(1, 0.4))),
    at('一百 TB', cmpTot3().scale(1.05, 0.3).to(1, 0.3)),
  );

  say('游程编码：只记连着几次');
  yield* beat('l19',
    all(countryCard().opacity(0, 0.4), countryNote().opacity(0, 0.4),
      cmpLab200().opacity(0, 0.4), cmpBar200().opacity(0, 0.4), cmpLab10w().opacity(0, 0.4),
      cmpBar10w().opacity(0, 0.4), cmpX500().opacity(0, 0.4), cmpTag().opacity(0, 0.4),
      cmpTot1().opacity(0, 0.4), cmpTot2().opacity(0, 0.4), cmpTot3().opacity(0, 0.4)),
    at('再压一遍', p1Bits[0].cells[9].scale(1.3, 0.5).to(1, 0.5)),
    at('连着出现几次', rleLines[0]().opacity(1, 0.5)),
    at('游程编码', rleLines[0]().scale(1.03, 0.5)),
    at('二十九记成九、一', rleLines[0]().scale(1.03, 0.4).to(1, 0.4)),
    at('三十记成十、二', rleLines[1]().opacity(1, 0.5)),
  );

  // r4 l19b：解码 tally——29 的 9、1 只加到 10，末尾缺的 8 个零按已知 18 行补上
  // r5：18 行就是这列的行数；尾段加动作，破 8.6s 定格
  say('9 + 1 + 8（补）= 18');
  yield* beat('l19b',
    at('九个零、一个一', rleLines[0]().scale(1.03, 0.4).to(1, 0.4)),
    at('末尾缺的八个零', chain(
      all(...[10, 11, 12, 13, 14, 15, 16, 17].map(i => p1Bits[0].cells[i].opacity(1, 0.4))),
      decodeTally().opacity(1, 0.5),
      all(...[10, 11, 12, 13, 14, 15, 16, 17].map(i => p1Bits[0].cells[i].scale(1.25, 0.3).to(1, 0.3))),
    )),
    at('十八行就是这一列的行数', decodeTally().scale(1.04, 0.4).to(1, 0.4)),
    at('就知道总数', chain(
      all(...valCells.map(c => c().scale(1.1, 0.25))),
      all(...valCells.map(c => c().scale(1, 0.25))),
    )),
  );

  say('31：5，4，3，3');
  yield* beat('l20',
    // r6 N1：l19–l22 只讲了 29 缺 8、31 缺 3、68 缺 2、69 不缺、74 缺 13，唯独 30 的缺 6 没提——
    // 在这里先把 30 带上一句：三十是十、二，缺六个零（第 13–18 位），解码时也按十八行补上
    at('三十是十、二', chain(
      all(...[12, 13, 14, 15, 16, 17].map(i => p1Bits[1].cells[i].opacity(1, 0.4))),
      rleLines[1]().scale(1.03, 0.4).to(1, 0.4),
      all(...[12, 13, 14, 15, 16, 17].map(i => p1Bits[1].cells[i].scale(1.25, 0.3))),
      all(...[12, 13, 14, 15, 16, 17].map(i => p1Bits[1].cells[i].scale(1, 0.3))),
    )),
    at('五、四、三、三', chain(rleLines[2]().opacity(1, 0.5), decodeTally().opacity(0, 0.4))),
    at('五个零、四个一', rleLines[2]().scale(1.02, 0.6)),
    // r5 l20：31 末尾缺的 3 个零（第 16–18 位），解码时一样按 18 行补上
    at('末尾缺的三个零', chain(
      all(...[15, 16, 17].map(i => p1Bits[2].cells[i].scale(1.3, 0.3))),
      all(...[15, 16, 17].map(i => p1Bits[2].cells[i].scale(1, 0.3))),
    )),
    // r5 QA 修：尾句加动作，破 4.4s 定格
    at('一样按十八行补上', rleLines[2]().scale(1.03, 0.4).to(1, 0.4)),
  );

  say('68、69 的游程编码');
  yield* beat('l21',
    at('六十八是十五、一', rleLines[3]().opacity(1, 0.5)),
    // r5 l21：68 末尾缺的 2 个零（第 17–18 位），解码时一样按 18 行补上
    at('末尾缺的两个零', chain(
      all(...[16, 17].map(i => p1Bits[3].cells[i].scale(1.3, 0.3))),
      all(...[16, 17].map(i => p1Bits[3].cells[i].scale(1, 0.3))),
    )),
    at('零、四、十二、二', rleLines[4]().opacity(1, 0.5)),
    at('开头就是一', rleLines[4]().scale(1.02, 0.4).to(1, 0.4)),
    at('连着四个一', rleLines[4]().scale(1.02, 0.4).to(1, 0.4)),
    at('再十二个零', rleLines[4]().scale(1.02, 0.4).to(1, 0.4)),
    at('最后两个一', rleLines[4]().scale(1.03, 0.4).to(1, 0.4)),
    // r5 l21：69 的游程加起来正好 18 行，一个零也不缺
    at('正好十八行', rle69Tally().opacity(1, 0.5)),
  );

  say('压成六行短数字');
  yield* beat('l22',
    all(
      ...p1Bits.map(b => b.group.opacity(0.25, 0.5)),
      ...valCells.map(c => c().opacity(0.25, 0.5)),
    ),
    at('七十四是四、一', rleLines[5]().opacity(1, 0.5)),
    // r5 l22：74 末尾缺的 13 个零（第 6–18 位），解码时一样按 18 行补上
    at('末尾缺的十三个零', chain(
      all(...[5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17].map(i => p1Bits[5].cells[i].scale(1.3, 0.3))),
      all(...[5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17].map(i => p1Bits[5].cells[i].scale(1, 0.3))),
    )),
    at('压成六行', chain(...rleLines.map(l => l().scale(1.03, 0.4)))),
    at('非常紧凑', compactLab().opacity(1, 0.5)),
  );

  say('查 30、68、69');
  yield* beat('l23',
    all(p1().opacity(0, 0.5), p2().opacity(1, 0.5)),
    at('最适合', orQuery().opacity(1, 0.5)),
    at('要查', chain(orBits[0].group.opacity(1, 0.5), orBits[1].group.opacity(1, 0.5), orBits[2].group.opacity(1, 0.5))),
    at('加载这三张位图', chain(...orBits.map(b => b.group.scale(1.02, 0.5)))),
  );

  say('三张一叠加，就是答案');
  yield* beat('l24',
    all(orResultBits.group.opacity(1, 0.5), orResultLab().opacity(1, 0.4)),
    at('一叠加', chain(
      orResultBits.mark(OR_ONES, 0.3),
      ...OR_ONES.map(i => orResultBits.cells[i].scale(1.25, 0.25)),
      ...OR_ONES.map(i => orResultBits.cells[i].scale(1, 0.25)),
    )),
    at('答案所在的行', chain(orAns().opacity(1, 0.5), orCounter.node.opacity(1, 0.4), orCounter.n(9, 1.0))),
    // r4 l24：把“效率很高”的断言换成原因——位图压得紧、一次整块算
    at('一次整块算', chain(
      whyTag().opacity(1, 0.4),
      all(...orBits.map(b => b.group.opacity(0.45, 0.4))),
      all(...OR_ONES.map(i => orResultBits.cells[i].scale(1.25, 0.25))),
      all(...OR_ONES.map(i => orResultBits.cells[i].scale(1, 0.25))),
      orAns().fill(T.yellow, 0.4),
    )),
  );

  say('31，而且商店是 3');
  yield* beat('l25',
    all(p2().opacity(0, 0.5), p3().opacity(1, 0.5)),
    at('条件更多', chain(andQ1().opacity(1, 0.5), andQ2().opacity(1, 0.5))),
    at('产品编号是三十一', andQ1().stroke(T.yellow, 0.4)),
    at('商店编号是三', andWord().opacity(1, 0.5)),
  );

  say('商店列：三在 6、8、13、17');
  yield* beat('l25b',
    at('商店编号这一列', chain(
      storeValLab().opacity(1, 0.4),
      storeValTag().opacity(1, 0.4),
      chain(...storeValCells.map(c => c().opacity(1, 0.12))),
    )),
    at('编号三出现四次', chain(
      all(storeValCells[5]().scale(1.3, 0.3), storeValCells[7]().scale(1.3, 0.3), storeValCells[12]().scale(1.3, 0.3), storeValCells[16]().scale(1.3, 0.3)),
      all(storeValCells[5]().scale(1, 0.3), storeValCells[7]().scale(1, 0.3), storeValCells[12]().scale(1, 0.3), storeValCells[16]().scale(1, 0.3)),
    )),
    at('第六', storeValCells[5]().scale(1.3, 0.3).to(1, 0.3)),
    at('第八', storeValCells[7]().scale(1.3, 0.3).to(1, 0.3)),
    at('第十三', storeValCells[12]().scale(1.3, 0.3).to(1, 0.3)),
    at('第十七行', storeValCells[16]().scale(1.3, 0.3).to(1, 0.3)),
  );

  say('商店的 1 在第 6、8、13、17 位');
  yield* beat('l26',
    at('三十一的位图', andBits31.group.opacity(1, 0.6)),
    at('商店编号三的位图', chain(andBitsS.group.opacity(1, 0.6), andTag().opacity(1, 0.4))),
    at('按位与', andBits31.group.scale(1.02, 0.6)),
    // r3：商店位图 4 个 1 格随旁白逐个脉冲并亮出序号（对齐 l11/l12 对 =31 的七个 1 的待遇）；
    // 每格先 mark 描黄边、再脉冲、序号签亮出，描边留到 l27a/l27b（与 AND 结果对照）。
    // r4：上方商店列原值行里对应的四个三同步脉冲（B47：位图由原值生成，看得见来处）。
    at('第六', chain(
      andBitsS.mark([5], 0.3),
      all(andBitsS.cells[5].scale(1.3, 0.3), storePosLabs[0].opacity(1, 0.3), storeValCells[5]().scale(1.3, 0.3)),
      all(andBitsS.cells[5].scale(1, 0.3), storeValCells[5]().scale(1, 0.3)),
    )),
    at('第八', chain(
      andBitsS.mark([7], 0.3),
      all(andBitsS.cells[7].scale(1.3, 0.3), storePosLabs[1].opacity(1, 0.3), storeValCells[7]().scale(1.3, 0.3)),
      all(andBitsS.cells[7].scale(1, 0.3), storeValCells[7]().scale(1, 0.3)),
    )),
    at('第十三', chain(
      andBitsS.mark([12], 0.3),
      all(andBitsS.cells[12].scale(1.3, 0.3), storePosLabs[2].opacity(1, 0.3), storeValCells[12]().scale(1.3, 0.3)),
      all(andBitsS.cells[12].scale(1, 0.3), storeValCells[12]().scale(1, 0.3)),
    )),
    at('第十七位', chain(
      andBitsS.mark([16], 0.3),
      all(andBitsS.cells[16].scale(1.3, 0.3), storePosLabs[3].opacity(1, 0.3), storeValCells[16]().scale(1.3, 0.3)),
      all(andBitsS.cells[16].scale(1, 0.3), storeValCells[16]().scale(1, 0.3)),
    )),
  );

  say('共用同一把行号标尺');
  yield* beat('l27a',
    all(arrow6.end(1, 0.5), arrow8.end(1, 0.5)),
    at('行顺序一模一样', chain(
      all(andBits31.mark([5, 7], 0.3), andBitsS.mark([5, 7], 0.3)),
      all(andBits31.cells[5].scale(1.3, 0.3), andBitsS.cells[5].scale(1.3, 0.3)),
      all(andBits31.cells[5].scale(1, 0.25), andBitsS.cells[5].scale(1, 0.25)),
      all(andBits31.cells[7].scale(1.3, 0.3), andBitsS.cells[7].scale(1.3, 0.3)),
      all(andBits31.cells[7].scale(1, 0.25), andBitsS.cells[7].scale(1, 0.25)),
    )),
    // r6 l27a：行顺序是谁保证的——写的时候，每列都按同一顺序存下来（3.11-7 + 3.12-1）
    at('写的时候', chain(
      andBits31.group.scale(1.02, 0.4).to(1, 0.4),
      andBitsS.group.scale(1.02, 0.4).to(1, 0.4),
    )),
    // r4 l27a（B50）：行顺序是谁保证的——两列共用同一把行号标尺（r6 旁白改成“写的时候每列都按同一顺序存下来”，标尺亮在“第几行，就是第几位”处）
    at('第几行，就是第几位', chain(
      rulerLine.end(1, 0.5),
      all(rulerLab().opacity(1, 0.4), ruler1().opacity(1, 0.4), ruler18().opacity(1, 0.4)),
    )),
  );

  say('第 k 位，都是同一行');
  yield* beat('l27b',
    all(andResultBits.group.opacity(1, 0.5), andResultLab().opacity(1, 0.4)),
    at('第 k 位', chain(
      andResultBits.cells[5].scale(1.3, 0.3).to(1, 0.3),
      andResultBits.cells[7].scale(1.3, 0.3).to(1, 0.3),
      andResultBits.cells[12].scale(1.3, 0.3).to(1, 0.3),
    )),
    at('同一行', chain(andCounter.node.opacity(1, 0.3), andCounter.n(3, 0.6))),
    // r5 l27b：旁白补 AND 结果——第 6、8、13 行，一共 3 行
    at('第 6、8、13 行', chain(
      all(andResultBits.cells[5].scale(1.3, 0.3), andResultBits.cells[7].scale(1.3, 0.3), andResultBits.cells[12].scale(1.3, 0.3)),
      all(andResultBits.cells[5].scale(1, 0.3), andResultBits.cells[7].scale(1, 0.3), andResultBits.cells[12].scale(1, 0.3)),
    )),
  );
});
