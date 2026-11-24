// U12 场景 1（MC）：b1–b12 —— 钩子、只读列再压缩、重复是好兆头、位图编码、
// 数量级对照、位图定义、误区（不是把值换成 0 和 1）、18 个值落位、6 张位图逐行生成。
// 分镜：skill-ch03/beats-u12.md；原文：DDIA §3.11（书页 p97–98，PDF p119–120）。
// 原图按处置“改编”：列值 18 个、6 张位图、1 的位置均按原图重新生成（逐格核对）；
// 18 个值是独立示例，与前面那张 8 行的表不是同一批数据（b8b 旁白 + 画面标注条）。
// 时长全部来自 timeline/u12.json（beat() 驱动），不手写 waitFor。
import {Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, chain, createRef} from '@motion-canvas/core';
import {at, makeBeats} from '../../lib/beats';
import {FONT, SAFE, SIZE, T} from '../../lib/theme';
import timeline from '../../timeline/u12.json';

// 原图里的 18 个列值（product_sk）
const VALUES = [69, 69, 69, 69, 74, 31, 31, 31, 31, 29, 30, 30, 31, 31, 31, 68, 69, 69];
// 6 张位图（按原图：每行一位，1 的位置与上方列值一一对应）
const BITMAPS: {v: number; bits: number[]}[] = [
  {v: 29, bits: [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0]},
  {v: 30, bits: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0]},
  {v: 31, bits: [0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0]},
  {v: 68, bits: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0]},
  {v: 69, bits: [1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1]},
  {v: 74, bits: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]},
];
const CELL_W = 44;
const CELL_H = 32;
const PITCH = 47;
const cellX = (i: number) => -399 + i * PITCH;
const VAL_Y = -225;
const ROW_Y = [-168, -126, -84, -42, 0, 42];
const IDX_69 = [0, 1, 2, 3, 16, 17];
const IDX_31 = [5, 6, 7, 8, 12, 13, 14];

export default makeScene2D(function* (view) {
  view.fill(T.bg);
  const beat = makeBeats(timeline);

  const header = createRef<Txt>();
  const anchor = createRef<Txt>();
  const say = (text: string) => anchor().text(text);

  // ---- 第 1 页：钩子 / 压缩 / 重复 / 定义 / 数量级 / 误区 ----
  const g1 = createRef<Node>();
  const g1barLong = createRef<Rect>();
  const g1barShort = createRef<Rect>();
  const g1q = createRef<Txt>();
  const g2 = createRef<Node>();
  const g2card = createRef<Rect>();
  const g2arrow = createRef<Txt>();
  const g2flat = createRef<Rect>();
  const g3 = createRef<Node>();
  const g3cells = [0, 1, 2, 3, 4, 5, 6, 7].map(() => createRef<Rect>());
  const g3note = createRef<Txt>();
  const g3count = createRef<Txt>();
  const g4 = createRef<Node>();
  const g4title = createRef<Rect>();
  const g4sub = createRef<Txt>();
  const g5 = createRef<Node>();
  const g5long = createRef<Rect>();
  const g5short = createRef<Rect>();
  const g5concl = createRef<Txt>();
  const g6 = createRef<Node>();
  const g6chips = [0, 1, 2].map(() => createRef<Rect>());
  const g6rows = [0, 1, 2].map(() => createRef<Node>());
  const g6tag = createRef<Txt>();
  const g7 = createRef<Node>();
  const g7card = createRef<Rect>();
  const g7row = createRef<Node>();
  const g7q = createRef<Txt>();
  const g7ok = createRef<Txt>();

  // ---- 第 2 页：18 个值 + 6 张位图 ----
  const fig = createRef<Node>();
  const figHead = createRef<Txt>();
  const valCells = VALUES.map(() => createRef<Rect>());
  const noteStrip = createRef<Rect>();
  const countLab = createRef<Txt>();
  const doneLab = createRef<Txt>();
  const bitRowNodes = BITMAPS.map(() => createRef<Node>());
  const bitCells = BITMAPS.map(bm => bm.bits.map(() => createRef<Rect>()));

  const G3VALS = [69, 31, 69, 31, 69, 31, 69, 31];
  const G6BITS = [
    [0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 0, 0, 1, 0],
    [1, 1, 0, 0, 1, 0, 0, 1],
  ];
  const G6VALS = ['29', '31', '69'];
  const G7BITS = [0, 0, 1, 0, 1, 0, 0, 1];

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

      {/* b1：数量对照 + 问号 */}
      <Node ref={g1} opacity={0}>
        <Rect ref={g1barLong} position={[-260, -100]} width={460} height={90} radius={14} fill={T.card} stroke={T.blue} lineWidth={3}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'几十亿行'} />
        </Rect>
        <Rect ref={g1barShort} position={[330, -100]} width={160} height={90} radius={14} fill={T.card} stroke={T.green} lineWidth={3}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'十万种值'} />
        </Rect>
        <Txt ref={g1q} position={[0, 80]} fontSize={72} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'?'} opacity={0} />
      </Node>

      {/* b2：只读要用的列，再压一压 */}
      <Node ref={g2} opacity={0}>
        <Rect ref={g2card} position={[0, -120]} width={560} height={90} radius={14} fill={T.card} stroke={T.blue} lineWidth={3}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'只读要用的列'} />
        </Rect>
        <Txt ref={g2arrow} position={[0, -20]} fontSize={48} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'▼'} opacity={0} />
        <Rect ref={g2flat} position={[0, 80]} width={300} height={60} radius={14} fill={T.card} stroke={T.green} lineWidth={3} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} text={'压扁一截'} />
        </Rect>
      </Node>

      {/* b3：一列值，重复亮同色 */}
      <Node ref={g3} opacity={0}>
        {G3VALS.map((v, i) => (
          <Rect
            key={`g3-${i}`}
            ref={g3cells[i]}
            position={[-260, -220 + i * 56]}
            width={130}
            height={48}
            radius={10}
            fill={T.card}
            stroke={v === 69 ? T.blue : T.green}
            lineWidth={2}
            opacity={0}
          >
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={String(v)} />
          </Rect>
        ))}
        <Txt ref={g3note} position={[180, -60]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'同一个值，出现好几次'} opacity={0} />
        <Txt ref={g3count} position={[180, 30]} fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.sans} text={'重复 4 次'} opacity={0} />
      </Node>

      {/* b4：位图编码标题 */}
      <Node ref={g4} opacity={0}>
        <Rect ref={g4title} position={[0, -60]} width={520} height={140} radius={20} fill={T.card} stroke={T.blue} lineWidth={3} opacity={0}>
          <Txt fontSize={SIZE.title} fontWeight={700} fill={T.text} fontFamily={FONT.serif} text={'位图编码'} />
        </Rect>
        <Txt ref={g4sub} position={[0, 90]} fontSize={SIZE.body} fill={T.muted} fontFamily={FONT.sans} text={'数据仓库里特别管用的一招'} opacity={0} />
      </Node>

      {/* b5：几十亿笔 vs 十万种 */}
      <Node ref={g5} opacity={0}>
        <Rect ref={g5long} position={[0, -140]} width={1000} height={70} radius={12} fill={T.card} stroke={T.blue} lineWidth={3} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'几十亿笔销售交易'} />
        </Rect>
        <Rect ref={g5short} position={[0, -20]} width={220} height={70} radius={12} fill={T.card} stroke={T.green} lineWidth={3} opacity={0}>
          <Txt fontSize={SIZE.label} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'十万种产品'} />
        </Rect>
        <Txt ref={g5concl} position={[0, 110]} fontSize={SIZE.body} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'不同值的个数，远小于行数'} opacity={0} />
      </Node>

      {/* b6：几种值 → 几张位图（示意） */}
      <Node ref={g6} opacity={0}>
        {G6VALS.map((v, i) => (
          <Rect
            key={`g6c-${i}`}
            ref={g6chips[i]}
            position={[-480, -150 + i * 110]}
            width={110}
            height={64}
            radius={12}
            fill={T.card}
            stroke={T.blue}
            lineWidth={2}
            opacity={0}
          >
            <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.mono} text={v} />
          </Rect>
        ))}
        {G6BITS.map((bits, r) => (
          <Node key={`g6r-${r}`} ref={g6rows[r]} opacity={0}>
            {bits.map((b, i) => (
              <Rect
                key={`g6b-${r}-${i}`}
                position={[-300 + i * 42, -150 + r * 110]}
                width={36}
                height={30}
                radius={6}
                fill={b ? T.yellow : T.card}
                stroke={T.line}
                lineWidth={1}
              >
                <Txt fontSize={18} fill={b ? T.bg : T.muted} fontFamily={FONT.mono} text={String(b)} />
              </Rect>
            ))}
          </Node>
        ))}
        <Txt ref={g6tag} position={[480, -260]} fontSize={SIZE.label} fill={T.purple} fontFamily={FONT.sans} text={'示意'} opacity={0} />
      </Node>

      {/* b7：值还在，0 和 1 只回答“是不是这个值” */}
      <Node ref={g7} opacity={0}>
        <Rect ref={g7card} position={[-380, -60]} width={200} height={140} radius={16} fill={T.card} stroke={T.blue} lineWidth={3}>
          <Txt fontSize={SIZE.title} fontWeight={700} fill={T.text} fontFamily={FONT.mono} text={'31'} />
        </Rect>
        <Node ref={g7row} opacity={0}>
          {G7BITS.map((b, i) => (
            <Rect
              key={`g7b-${i}`}
              position={[-80 + i * 48, -60]}
              width={42}
              height={36}
              radius={6}
              fill={b ? T.yellow : T.card}
              stroke={T.line}
              lineWidth={1}
            >
              <Txt fontSize={18} fill={b ? T.bg : T.muted} fontFamily={FONT.mono} text={String(b)} />
            </Rect>
          ))}
        </Node>
        <Txt ref={g7q} position={[120, 70]} fontSize={SIZE.body} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'是不是 31？'} opacity={0} />
        <Txt ref={g7ok} position={[330, 70]} fontSize={SIZE.body} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'✓'} opacity={0} />
      </Node>

      {/* 第 2 页：18 个值 + 6 张位图（按原图重画） */}
      <Node ref={fig} opacity={0}>
        <Txt ref={figHead} position={[0, -268]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'产品编号（product_sk）'} opacity={0} />
        {VALUES.map((v, i) => (
          <Rect
            key={`val-${i}`}
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
            <Txt fontSize={20} fill={T.text} fontFamily={FONT.mono} text={String(v)} />
          </Rect>
        ))}
        {BITMAPS.map((bm, r) => (
          <Node key={`brow-${r}`} ref={bitRowNodes[r]} opacity={0}>
            <Txt position={[-470, ROW_Y[r]]} offset={[1, 0]} fontSize={20} fill={T.muted} fontFamily={FONT.mono} text={`= ${bm.v}`} />
            {bm.bits.map((b, i) => (
              <Rect
                key={`bc-${r}-${i}`}
                ref={bitCells[r][i]}
                position={[cellX(i), ROW_Y[r]]}
                width={CELL_W}
                height={CELL_H}
                radius={6}
                fill={b ? T.yellow : T.card}
                stroke={T.line}
                lineWidth={1}
              >
                <Txt fontSize={18} fill={b ? T.bg : T.muted} fontFamily={FONT.mono} text={String(b)} />
              </Rect>
            ))}
          </Node>
        ))}
        <Rect ref={noteStrip} position={[0, 130]} width={700} height={56} radius={12} fill={T.card} stroke={T.purple} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'另一组示例，别拼成上一张表'} />
        </Rect>
        <Txt ref={countLab} position={[0, 130]} fontSize={SIZE.body} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'69 出现 6 次，31 出现 7 次'} opacity={0} />
        <Txt ref={doneLab} position={[0, 130]} fontSize={SIZE.body} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'六张位图，齐了'} opacity={0} />
      </Node>
    </>
  );

  say('几十亿行，十万种值');
  yield* beat('b1',
    all(g1().opacity(1, 0.5)),
    at('十万种值', g1barShort().stroke(T.green, 0.4)),
    at('几十亿行', g1barLong().stroke(T.yellow, 0.4)),
    at('怎么压', g1q().opacity(1, 0.4)),
  );

  say('只读要用的列，再压一压');
  yield* beat('b2',
    all(g1().opacity(0, 0.5), g2().opacity(1, 0.5)),
    at('只读要用的列', g2card().opacity(1, 0.5)),
    at('还能再省吗', g2arrow().opacity(1, 0.5)),
    at('压一压', chain(g2flat().opacity(1, 0.4), g2card().width(300, 0.7))),
  );

  say('重复越多，越好压');
  yield* beat('b3',
    all(g2().opacity(0, 0.5), g3().opacity(1, 0.5)),
    at('每列的值', chain(...g3cells.map(c => c().opacity(1, 0.25)))),
    at('翻来覆去', g3note().opacity(1, 0.5)),
    at('重复得越多', chain(g3count().opacity(1, 0.5), g3cells[0]().stroke(T.yellow, 0.3), g3cells[0]().stroke(T.blue, 0.3))),
  );

  say('位图编码');
  yield* beat('b4',
    all(g3().opacity(0, 0.5), g4().opacity(1, 0.5)),
    at('数据仓库', g4sub().opacity(1, 0.5)),
    at('位图编码', g4title().opacity(1, 0.6)),
  );

  say('几十亿行，十万种值');
  yield* beat('b5',
    all(g4().opacity(0, 0.5), g5().opacity(1, 0.5)),
    at('几十亿笔', g5long().opacity(1, 0.6)),
    at('十万种', g5short().opacity(1, 0.6)),
    at('远小于', g5concl().opacity(1, 0.5)),
  );

  say('每种值一张位图');
  yield* beat('b6',
    all(g5().opacity(0, 0.5), g6().opacity(1, 0.5)),
    at('几种不同值', chain(g6chips[0]().opacity(1, 0.4), g6chips[1]().opacity(1, 0.4), g6chips[2]().opacity(1, 0.4))),
    at('每种值一张', chain(g6rows[0]().opacity(1, 0.4), g6rows[1]().opacity(1, 0.4), g6rows[2]().opacity(1, 0.4))),
    at('每行一位', g6tag().opacity(1, 0.5)),
    at('就是一', chain(g6rows[0]().scale(1.03, 0.7), g6rows[0]().scale(1, 0.7))),
  );

  say('不是把值换成 0 和 1');
  yield* beat('b7',
    all(g6().opacity(0, 0.5), g7().opacity(1, 0.5)),
    at('不是把值换成零和一', g7row().opacity(1, 0.6)),
    at('值还在', g7card().stroke(T.yellow, 0.5)),
    at('是不是这个值', chain(g7q().opacity(1, 0.5), g7ok().opacity(1, 0.5))),
  );

  say('十八个值，独立示例');
  yield* beat('b8a',
    all(g7().opacity(0, 0.5), fig().opacity(1, 0.5), figHead().opacity(1, 0.4)),
    at('一组示例', chain(...valCells.map(c => c().opacity(1, 0.12)))),
    at('十八个', fig().scale(1.01, 1.2)),
  );

  say('别拼成上一张表');
  yield* beat('b8b',
    at('独立的', noteStrip().opacity(1, 0.5)),
    at('不是同一批数据', noteStrip().stroke(T.yellow, 0.5)),
  );

  say('69 六次，31 七次');
  yield* beat('b9',
    all(noteStrip().opacity(0, 0.4)),
    at('六十九出现六次', chain(
      all(...IDX_69.map(i => valCells[i]().scale(1.2, 0.3))),
      all(...IDX_69.map(i => valCells[i]().scale(1, 0.3))),
    )),
    at('三十一七次', chain(
      all(...IDX_31.map(i => valCells[i]().scale(1.2, 0.3))),
      all(...IDX_31.map(i => valCells[i]().scale(1, 0.3))),
      countLab().opacity(1, 0.5),
    )),
    at('六十八一次', valCells[15]().scale(1.25, 0.4).to(1, 0.4)),
  );

  say('29：只有第 10 位是 1');
  yield* beat('b10',
    all(countLab().opacity(0, 0.4)),
    at('二十九的位图', bitRowNodes[0]().opacity(1, 0.6)),
    at('第十行', valCells[9]().scale(1.25, 0.4).to(1, 0.4)),
    at('第十位是一', bitCells[0][9]().scale(1.3, 0.4).to(1, 0.4)),
  );

  say('30、31 的位图');
  yield* beat('b11',
    at('第十一、十二位', chain(
      bitRowNodes[1]().opacity(1, 0.6),
      bitCells[1][10]().scale(1.25, 0.3).to(1, 0.3),
      bitCells[1][11]().scale(1.25, 0.3).to(1, 0.3),
    )),
    at('第六到九位', chain(
      bitRowNodes[2]().opacity(1, 0.6),
      all(bitCells[2][5]().scale(1.25, 0.3), bitCells[2][6]().scale(1.25, 0.3), bitCells[2][7]().scale(1.25, 0.3), bitCells[2][8]().scale(1.25, 0.3)),
      all(bitCells[2][5]().scale(1, 0.3), bitCells[2][6]().scale(1, 0.3), bitCells[2][7]().scale(1, 0.3), bitCells[2][8]().scale(1, 0.3)),
    )),
    at('第十三到十五位', chain(
      all(bitCells[2][12]().scale(1.25, 0.3), bitCells[2][13]().scale(1.25, 0.3), bitCells[2][14]().scale(1.25, 0.3)),
      all(bitCells[2][12]().scale(1, 0.3), bitCells[2][13]().scale(1, 0.3), bitCells[2][14]().scale(1, 0.3)),
    )),
  );

  say('六张位图，齐了');
  yield* beat('b12',
    at('第十六位', chain(
      bitRowNodes[3]().opacity(1, 0.6),
      bitCells[3][15]().scale(1.25, 0.3).to(1, 0.3),
    )),
    at('第一到四位', chain(
      bitRowNodes[4]().opacity(1, 0.6),
      all(bitCells[4][0]().scale(1.2, 0.3), bitCells[4][1]().scale(1.2, 0.3), bitCells[4][2]().scale(1.2, 0.3), bitCells[4][3]().scale(1.2, 0.3)),
      all(bitCells[4][0]().scale(1, 0.3), bitCells[4][1]().scale(1, 0.3), bitCells[4][2]().scale(1, 0.3), bitCells[4][3]().scale(1, 0.3)),
    )),
    at('第十七、十八位', chain(
      all(bitCells[4][16]().scale(1.2, 0.3), bitCells[4][17]().scale(1.2, 0.3)),
      all(bitCells[4][16]().scale(1, 0.3), bitCells[4][17]().scale(1, 0.3)),
    )),
    at('第五位是一', chain(
      bitRowNodes[5]().opacity(1, 0.6),
      bitCells[5][4]().scale(1.25, 0.3).to(1, 0.3),
    )),
    at('六张位图齐了', doneLab().opacity(1, 0.5)),
  );
});
