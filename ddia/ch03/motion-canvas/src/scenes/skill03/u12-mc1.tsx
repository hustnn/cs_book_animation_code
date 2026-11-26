// U12 场景 1（MC，r7）：l0–l17 —— 站牌、钩子、只读列再压缩、重复是好兆头、位图编码、
// 18 个值落位、6 张位图逐行生成（每张两拍：行出现 + 对位核对）、数量级对照、位图定义。
// r7：新增首拍 l0 站牌（UnitTitle：第 12 站“位图压缩”，第三部分“列式存储”），l1 开头收成左上角页眉；
// 旧静态 header 已删，改由 unit.header 承担（U10 j0 / U8 h0 先例）。
// r6（修 r5 新手测试 15 项中的 mc1 部分）：l3 加“示意”标签（8 个值只作演示）；
// l6 次数黄字补全六种值；l17 tally 改成“三张 14 个，再加另外三张 4 个，正好 18”，
// 念到“压完只剩有 1 的地方”时三行里的 0 淡掉只留 1 亮着（N2）。
// 分镜：skill-ch03/beats-u12.md（l 系）；原文：DDIA §3.11（书页 p97–98，PDF p119–120）。
// 原图按处置“改编”：列值 18 个、6 张位图、1 的位置均按原图重新生成（逐格核对）；
// 18 个值是独立示例，与前面那张 8 行的表不是同一批数据（l5 旁白 + 画面标注条）。
// 与 r1 的差别：拍号 b 系 → l 系；位图行改用 lib/schemas.ts 的 Bits 组件（r1 是手摆 Rect 格子）：
// 置位的格子填绿、未置位是底色，探查时用 mark() 描边（1 描黄、0 描红）；l8 用 Cam 推近看 29 那一行拆误区
// （替代 r1 的 g7 演示页），并对第 10 位 mark 描黄边；l9–l12 把 30/31 各拆成两拍（行出现、对位核对）；
// l15 只留拍锚“六张位图，齐了”，删场景内重复标签（r1 P2 #3）。
// 时长全部来自 timeline/u12.json（beat() 驱动），不手写 waitFor。
import {Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {Vector2, all, chain, createRef} from '@motion-canvas/core';
import {at, makeBeats} from '../../lib/beats';
import {UnitTitle} from '../../lib/opening';
import {CHAPTER} from '../../lib/chapter';
import {FONT, SAFE, SIZE, T} from '../../lib/theme';
import {Bits, Cam} from '../../lib/schemas';
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
const ONES = (bits: number[]) => bits.map((b, i) => (b ? i : -1)).filter(i => i >= 0);

export default makeScene2D(function* (view) {
  view.fill(T.bg);
  const beat = makeBeats(timeline);

  // 单元站牌（l0）：这一站在全章的位置 + 单元标题；l1 开头收成左上角页眉。
  // 页眉与场景原有的左上角标题同一位置同一样式（“列压缩：位图”），旧 header 已删，改由 unit.header 承担。
  const unit = new UnitTitle(CHAPTER, 'u12');

  const anchor = createRef<Txt>();
  const world = createRef<Node>();
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
  // r6 l3：8 个值不是 18 个值的前 8 个，只作演示——加“示意”标签
  const g3tag = createRef<Txt>();
  const g4 = createRef<Node>();
  const g4title = createRef<Rect>();
  const g4sub = createRef<Txt>();
  const g5 = createRef<Node>();
  const g5long = createRef<Rect>();
  const g5short = createRef<Rect>();
  const g5concl = createRef<Txt>();
  const g6 = createRef<Node>();
  // r5 l17：1 的个数加起来 = 行数（十万张位图为什么还省的账）
  const g6tally = createRef<Txt>();

  // ---- 第 2 页：18 个值 + 6 张位图 ----
  const fig = createRef<Node>();
  const figHead = createRef<Txt>();
  const valCells = VALUES.map(() => createRef<Rect>());
  const noteStrip = createRef<Rect>();
  const countLab = createRef<Txt>();
  const q29 = createRef<Txt>();
  const ok29 = createRef<Txt>();

  const G3VALS = [69, 31, 69, 31, 69, 31, 69, 31];
  // l17（r4）：三张完整 18 位位图行，按 l4–l5 的示例数据逐位对上（B45：修掉 8 位缩略行）；
  // 不再是示意，去掉值卡与“示意”标；行标签是 Bits 组件自带的 label。
  const G6ROWS = [0, 2, 4]; // BITMAPS 里 29、31、69 的行号
  const g6Bits = G6ROWS.map(
    (br, r) =>
      new Bits(new Vector2(40, -150 + r * 110), 18, `= ${BITMAPS[br].v}`, {
        cell: 34,
        cellH: 30,
        font: 18,
        gap: 4,
        set: ONES(BITMAPS[br].bits),
      }),
  );

  // 位图行（Bits 组件）：置位填绿，未置位是底色；行标签是组件自带的 label
  const figBits = BITMAPS.map(
    (bm, r) =>
      new Bits(new Vector2(0, ROW_Y[r]), 18, `= ${bm.v}`, {
        cell: CELL_W,
        cellH: CELL_H,
        font: 18,
        gap: 3,
        set: ONES(bm.bits),
      }),
  );

  view.add(
    <>
      {unit.nodes()}
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

      <Node ref={world}>
      {/* l1：数量对照 + 问号 */}
      <Node ref={g1} opacity={0}>
        <Rect ref={g1barLong} position={[-260, -100]} width={460} height={90} radius={14} fill={T.card} stroke={T.blue} lineWidth={3}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'几十亿行'} />
        </Rect>
        <Rect ref={g1barShort} position={[330, -100]} width={160} height={90} radius={14} fill={T.card} stroke={T.green} lineWidth={3}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'十万种值'} />
        </Rect>
        <Txt ref={g1q} position={[0, 80]} fontSize={72} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'?'} opacity={0} />
      </Node>

      {/* l2：只读要用的列，再压一压 */}
      <Node ref={g2} opacity={0}>
        <Rect ref={g2card} position={[0, -120]} width={560} height={90} radius={14} fill={T.card} stroke={T.blue} lineWidth={3}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'只读要用的列'} />
        </Rect>
        <Txt ref={g2arrow} position={[0, -20]} fontSize={48} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'▼'} opacity={0} />
        <Rect ref={g2flat} position={[0, 80]} width={300} height={60} radius={14} fill={T.card} stroke={T.green} lineWidth={3} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} text={'压扁一截'} />
        </Rect>
      </Node>

      {/* l3：一列值，重复亮同色 */}
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
        <Txt ref={g3tag} position={[180, 100]} fontSize={SIZE.label} fill={T.purple} fontFamily={FONT.sans} text={'示意：8 个值作演示'} opacity={0} />
      </Node>

      {/* l4：位图编码标题 */}
      <Node ref={g4} opacity={0}>
        <Rect ref={g4title} position={[0, -60]} width={520} height={140} radius={20} fill={T.card} stroke={T.blue} lineWidth={3} opacity={0}>
          <Txt fontSize={SIZE.title} fontWeight={700} fill={T.text} fontFamily={FONT.serif} text={'位图编码'} />
        </Rect>
        <Txt ref={g4sub} position={[0, 90]} fontSize={SIZE.body} fill={T.muted} fontFamily={FONT.sans} text={'数据仓库里特别管用的一招'} opacity={0} />
      </Node>

      {/* l16：几十亿笔 vs 十万种 */}
      <Node ref={g5} opacity={0}>
        <Rect ref={g5long} position={[0, -140]} width={1000} height={70} radius={12} fill={T.card} stroke={T.blue} lineWidth={3} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'几十亿笔销售交易'} />
        </Rect>
        <Rect ref={g5short} position={[0, -20]} width={220} height={70} radius={12} fill={T.card} stroke={T.green} lineWidth={3} opacity={0}>
          <Txt fontSize={SIZE.label} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'十万种产品'} />
        </Rect>
        <Txt ref={g5concl} position={[0, 110]} fontSize={SIZE.body} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'不同值的个数，远小于行数'} opacity={0} />
      </Node>

      {/* l17：三种值 → 三张完整 18 位位图行（r4：按示例数据，不再缩略） */}
      <Node ref={g6} opacity={0}>
        <Txt ref={g6tally} position={[0, 180]} fontSize={24} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'1 的个数加起来 = 行数'} opacity={0} />
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
        <Rect ref={noteStrip} position={[0, 130]} width={700} height={56} radius={12} fill={T.card} stroke={T.purple} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'另一组示例，别拼成上一张表'} />
        </Rect>
        <Txt ref={countLab} position={[0, 130]} fontSize={SIZE.body} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'69 六次，31 七次，74、29、68 各一次，30 两次'} opacity={0} />
        <Txt ref={q29} position={[0, 60]} fontSize={SIZE.body} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'是不是 29？'} opacity={0} />
        <Txt ref={ok29} position={[330, 60]} fontSize={SIZE.body} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'✓'} opacity={0} />
      </Node>
      </Node>
    </>
  );
  const cam = new Cam(world());
  fig().add(figBits.map(b => b.group));
  g6().add(g6Bits.map(b => b.group));

  // l0：单元站牌（演示拍，念完留 0.8s）
  yield* beat('l0', unit.enter());

  say('几十亿行，十万种值');
  yield* beat('l1',
    unit.toHeader(),
    all(g1().opacity(1, 0.5)),
    at('十万种值', g1barShort().stroke(T.green, 0.4)),
    at('几十亿行', g1barLong().stroke(T.yellow, 0.4)),
    at('怎么压', g1q().opacity(1, 0.4)),
  );

  say('只读要用的列，再压一压');
  yield* beat('l2',
    all(g1().opacity(0, 0.5), g2().opacity(1, 0.5)),
    at('只读要用的列', g2card().opacity(1, 0.5)),
    at('还能再省吗', g2arrow().opacity(1, 0.5)),
    at('压一压', chain(g2flat().opacity(1, 0.4), g2card().width(300, 0.7))),
  );

  say('重复越多，越好压');
  yield* beat('l3',
    all(g2().opacity(0, 0.5), g3().opacity(1, 0.5)),
    at('每列的值', chain(...g3cells.map(c => c().opacity(1, 0.25)), g3tag().opacity(1, 0.5))),
    at('翻来覆去', g3note().opacity(1, 0.5)),
    at('重复得越多', chain(g3count().opacity(1, 0.5), g3cells[0]().stroke(T.yellow, 0.3), g3cells[0]().stroke(T.blue, 0.3))),
  );

  say('位图编码');
  yield* beat('l4',
    all(g3().opacity(0, 0.5), g4().opacity(1, 0.5)),
    at('数据仓库', g4sub().opacity(1, 0.5)),
    at('位图编码', g4title().opacity(1, 0.6)),
    at('一组示例', chain(
      all(g4().opacity(0, 0.4), fig().opacity(1, 0.4)),
      figHead().opacity(1, 0.4),
      chain(...valCells.map(c => c().opacity(1, 0.1))),
    )),
  );

  say('别拼成上一张表');
  yield* beat('l5',
    at('独立的', noteStrip().opacity(1, 0.5)),
    at('不是同一批数据', noteStrip().stroke(T.yellow, 0.5)),
  );

  say('69 六次，31 七次，74、29、68 各一次，30 两次');
  yield* beat('l6',
    all(noteStrip().opacity(0, 0.4)),
    at('六十九出现六次', chain(
      all(...IDX_69.map(i => valCells[i]().scale(1.2, 0.3))),
      all(...IDX_69.map(i => valCells[i]().scale(1, 0.3))),
    )),
    at('三十一七次', chain(
      all(...IDX_31.map(i => valCells[i]().scale(1.2, 0.3))),
      all(...IDX_31.map(i => valCells[i]().scale(1, 0.3))),
    )),
    // r6 l6：次数黄字补全六种值——等旁白把六种值都报完（六十八一次是最后一个）再亮出
    at('六十八一次', chain(valCells[15]().scale(1.25, 0.4).to(1, 0.4), countLab().opacity(1, 0.5))),
  );

  say('29：只有第 10 位是 1');
  yield* beat('l7',
    all(countLab().opacity(0, 0.4)),
    at('二十九的位图', figBits[0].group.opacity(1, 0.6)),
    at('第十行', valCells[9]().scale(1.25, 0.4).to(1, 0.4)),
    at('第十位是一', figBits[0].cells[9].scale(1.3, 0.4).to(1, 0.4)),
  );

  // l8：推近看 29 那一行（值行 + 位图行），行标签淡出避出画；第 10 位 mark 描黄边
  say('不是把值换成 0 和 1');
  yield* beat('l8',
    all(cam.focus([0, -196], 1.25, 1.2), figBits[0].label.opacity(0, 0.4)),
    at('值还在', valCells[9]().scale(1.25, 0.4).to(1, 0.4)),
    at('是不是这个值', chain(q29().opacity(1, 0.5), ok29().opacity(1, 0.5), figBits[0].mark([9], 0.3))),
  );

  say('30 的位图');
  yield* beat('l9',
    all(cam.reset(1.2), q29().opacity(0, 0.4), ok29().opacity(0, 0.4), figBits[0].unmark([9], 0.3), figBits[0].label.opacity(1, 0.4)),
    at('三十的位图', figBits[1].group.opacity(1, 0.6)),
    at('第十一、十二位', chain(
      figBits[1].cells[10].scale(1.25, 0.3).to(1, 0.3),
      figBits[1].cells[11].scale(1.25, 0.3).to(1, 0.3),
    )),
  );

  say('第 11、12 位，对得上');
  yield* beat('l10',
    at('第十一、十二位', chain(
      all(valCells[10]().scale(1.25, 0.3), figBits[1].cells[10].scale(1.25, 0.3)),
      all(valCells[10]().scale(1, 0.3), figBits[1].cells[10].scale(1, 0.3)),
    )),
    at('两个三十', chain(
      all(valCells[11]().scale(1.25, 0.3), figBits[1].cells[11].scale(1.25, 0.3)),
      all(valCells[11]().scale(1, 0.3), figBits[1].cells[11].scale(1, 0.3)),
    )),
  );

  say('31 的位图');
  yield* beat('l11',
    at('三十一的位图', figBits[2].group.opacity(1, 0.6)),
    at('第六到九位', chain(
      all(figBits[2].cells[5].scale(1.25, 0.3), figBits[2].cells[6].scale(1.25, 0.3), figBits[2].cells[7].scale(1.25, 0.3), figBits[2].cells[8].scale(1.25, 0.3)),
      all(figBits[2].cells[5].scale(1, 0.3), figBits[2].cells[6].scale(1, 0.3), figBits[2].cells[7].scale(1, 0.3), figBits[2].cells[8].scale(1, 0.3)),
    )),
  );

  say('七个 1，都对得上');
  yield* beat('l12',
    at('第十三到十五位', chain(
      all(figBits[2].cells[12].scale(1.25, 0.3), figBits[2].cells[13].scale(1.25, 0.3), figBits[2].cells[14].scale(1.25, 0.3)),
      all(figBits[2].cells[12].scale(1, 0.3), figBits[2].cells[13].scale(1, 0.3), figBits[2].cells[14].scale(1, 0.3)),
    )),
    at('都对得上', chain(
      all(...IDX_31.map(i => valCells[i]().scale(1.15, 0.3))),
      all(...IDX_31.map(i => valCells[i]().scale(1, 0.3))),
    )),
  );

  say('68、74 的位图');
  yield* beat('l13',
    at('第十六位', chain(
      figBits[3].group.opacity(1, 0.6),
      figBits[3].cells[15].scale(1.25, 0.3).to(1, 0.3),
    )),
    at('第五位是一', chain(
      figBits[5].group.opacity(1, 0.6),
      figBits[5].cells[4].scale(1.25, 0.3).to(1, 0.3),
    )),
  );

  say('69 的位图');
  yield* beat('l14',
    at('第一到四位', chain(
      figBits[4].group.opacity(1, 0.6),
      all(figBits[4].cells[0].scale(1.2, 0.3), figBits[4].cells[1].scale(1.2, 0.3), figBits[4].cells[2].scale(1.2, 0.3), figBits[4].cells[3].scale(1.2, 0.3)),
      all(figBits[4].cells[0].scale(1, 0.3), figBits[4].cells[1].scale(1, 0.3), figBits[4].cells[2].scale(1, 0.3), figBits[4].cells[3].scale(1, 0.3)),
    )),
    at('第十七、十八位', chain(
      all(figBits[4].cells[16].scale(1.2, 0.3), figBits[4].cells[17].scale(1.2, 0.3)),
      all(figBits[4].cells[16].scale(1, 0.3), figBits[4].cells[17].scale(1, 0.3)),
    )),
  );

  say('六张位图，齐了');
  yield* beat('l15',
    at('六张位图，齐了', chain(
      all(...figBits.map(b => b.group.scale(1.02, 0.35))),
      all(...figBits.map(b => b.group.scale(1, 0.35))),
    )),
  );

  say('几十亿行，十万种值');
  yield* beat('l16',
    all(fig().opacity(0, 0.5), g5().opacity(1, 0.5)),
    at('几十亿笔', g5long().opacity(1, 0.6)),
    at('十万种', g5short().opacity(1, 0.6)),
    at('远小于', g5concl().opacity(1, 0.5)),
  );

  say('每种值一张位图');
  yield* beat('l17',
    all(g5().opacity(0, 0.5), g6().opacity(1, 0.5)),
    at('几种不同值', chain(g6Bits[0].group.opacity(1, 0.4), g6Bits[1].group.opacity(1, 0.4), g6Bits[2].group.opacity(1, 0.4))),
    at('每种值一张', chain(
      g6Bits[0].group.scale(1.03, 0.3).to(1, 0.3),
      g6Bits[1].group.scale(1.03, 0.3).to(1, 0.3),
      g6Bits[2].group.scale(1.03, 0.3).to(1, 0.3),
    )),
    at('每行一位', chain(
      ...g6Bits.map(b => all(...b.cells.filter((_, i) => b.isOn(i)).map(c => c.scale(1.25, 0.25).to(1, 0.25)))),
    )),
    // r5 l17：十万张位图为什么还省——1 的个数加起来正好等于行数
    at('正好等于行数', g6tally().opacity(1, 0.5)),
    // r5 QA 修：长旁白尾段加动作，破 8.7s 定格——1 的位置与 tally 跟着后半句依次轻脉冲
    at('每行只在一个值上是一', chain(
      ...g6Bits.map(b => all(...b.cells.filter((_, i) => b.isOn(i)).map(c => c.scale(1.25, 0.25).to(1, 0.25)))),
    )),
    // r6 N2：念到“压完只剩有 1 的地方”时，三行里的 0 淡掉只留 1 亮着——0 怎么“没了”就看得见了
    at('压完只剩有 1 的地方', chain(
      all(...g6Bits.flatMap(b => b.cells.filter((_, i) => !b.isOn(i)).map(c => c.opacity(0.12, 0.5)))),
      g6tally().scale(1.06, 0.4).to(1, 0.4),
    )),
    at('所以还是省', chain(
      ...g6Bits.map(b => b.group.scale(1.03, 0.3).to(1, 0.3)),
    )),
    // r6 l17：画面只画三行，1 只有 14 个——tally 改写，点明另外三张还有 4 个，正好 18
    at('三张画出来的', chain(
      g6tally().text('三张 14 个，再加另外三张 4 个，正好 18', 0),
      g6tally().scale(1.05, 0.4).to(1, 0.4),
    )),
    // r6 QA 修：新句尾段（“再加另外三张的四个，正好十八个”）约 5 秒没有动作，闲出 7.3s error——
    // 尾句两处各加一个动作，末尾的 1 格慢脉冲收到拍末附近；
    // 注意用 all() 并行：chain() 会把三行串起来 4.8s，直接 overrun（第一次 QA 的教训）
    at('再加另外三张的四个', g6tally().scale(1.05, 0.4).to(1, 0.4)),
    at('正好十八个', all(
      ...g6Bits.map(b => all(...b.cells.filter((_, i) => b.isOn(i)).map(c => c.scale(1.3, 0.8).to(1, 0.8)))),
    )),
  );
});
