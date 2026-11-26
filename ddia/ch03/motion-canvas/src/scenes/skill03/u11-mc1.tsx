// U11 场景 1（MC，r6）：k0–k5 —— 站牌、事实表规模、钩子（100 列只用 3 列）、
// 行 vs 列直觉、行表引入、行式存储与文档。分镜：skill-ch03/beats-u11.md；原文：DDIA §3.10。
// r7：k0 站名改成“按列排”（chapter.ts）；k2 亮起 3 格加列名标注（日期/产品/数量）；k5 文档条改成文档块、字节格终帧亮色收尾。
// r6：新增首拍 k0 站牌（UnitTitle：第 11 站“按列存”，第三部分“列式存储”），k1 开头收成左上角页眉；
// 旧静态 header 已删，改由 unit.header 承担（U12 l0 / U10 j0 / U8 h0 先例）。
// r5：k3 的一行标为“第一行”，k4 点明它就是八行表的第一行（不再提另一张表）；
// k5 一行逐格出现、字节格 24 格全亮。
// 时长全部来自 timeline/u11.json（beat() 驱动），不手写 waitFor。
import {Circle, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, chain, createRef} from '@motion-canvas/core';
import {at, makeBeats} from '../../lib/beats';
import {UnitTitle} from '../../lib/opening';
import {CHAPTER} from '../../lib/chapter';
import {KV} from '../../lib/schemas';
import {FONT, SAFE, SIZE, T} from '../../lib/theme';
import timeline from '../../timeline/u11.json';

// 100 列示意：2 行 × 50 格
const GRID_COLS = 50;
const CELL_W = 21;
const CELL_H = 26;
const PITCH = 23;
const gridX = (i: number) => -563.5 + (i % GRID_COLS) * PITCH;
const gridY = (i: number) => (i < GRID_COLS ? -100 : -60);
const ROW1 = ['140102', '69', '4', 'NULL', 'NULL', '1', '13.99', '13.99'];
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
const TAB_X = (ci: number) => -455 + ci * 130;
const TAB_Y = (ri: number) => -163 + ri * 32;

export default makeScene2D(function* (view) {
  view.fill(T.bg);
  const beat = makeBeats(timeline);

  // 单元站牌（k0）：这一站在全章的位置 + 单元标题；k1 开头收成左上角页眉。
  // 页眉与场景原有的左上角标题同一位置同一样式（“列式存储：按列排”），旧 header 已删，改由 unit.header 承担。
  const unit = new UnitTitle(CHAPTER, 'u11');

  const anchor = createRef<Txt>();
  const say = (text: string) => anchor().text(text);

  // ---- k1：规模条 ----
  const pScale = createRef<Node>();
  const factBar = createRef<Rect>();
  const dimBar = createRef<Rect>();
  const dimLab = createRef<Txt>();
  const pbTag = createRef<Txt>();
  const scaleDot = createRef<Circle>();

  // ---- k2：100 列网格 ----
  const pGrid = createRef<Node>();
  const gridCells = Array.from({length: 100}, () => createRef<Rect>());
  const hlA = [0, 1, 2].map(() => createRef<Rect>());
  // r7 P2-1：亮起的 3 格上方标列名（日期 / 产品 / 数量），与 k19 同位置。
  const k2Lab = createRef<Txt>();
  const qChip = createRef<Rect>();
  const qMark = createRef<Txt>();

  // ---- k3：行拆成列（直觉） ----
  const pIdea = createRef<Node>();
  const ideaFrame = createRef<Rect>();
  const ideaKVs = ROW1.map(v => new KV(v, '', 'key', {w: 120}));
  ideaKVs.forEach((kv, i) => kv.node.position([TAB_X(i), -170]));
  const strips = COLS.map(() => createRef<Rect>());
  const stripLabs = COLS.map(() => createRef<Txt>());
  const restTag = createRef<Txt>();

  // ---- k4：行表 ----
  const pTable = createRef<Node>();
  const tabHead = COLS.map(() => createRef<Txt>());
  const tabCells = ROWS.map(() => Array.from({length: 8}, () => createRef<Txt>()));
  // r5：高亮框从第 1 行缓慢滑到第 8 行、再回到第 1 行（k4 旁白“刚才那一行，就是这张表的第一行”）。
  const rowHl = createRef<Rect>();

  // ---- k5：行式存储 + 文档 ----
  const pRow = createRef<Node>();
  const rowFrame = createRef<Rect>();
  const rowCells = ROW1.map(() => createRef<Rect>());
  const rowLab = createRef<Txt>();
  const docCard = createRef<Rect>();
  const docTitle = createRef<Txt>();
  const docLine1 = createRef<Txt>();
  const docLine2 = createRef<Txt>();
  const byteCells = Array.from({length: 24}, () => createRef<Rect>());

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
        <Txt
          ref={k2Lab}
          position={[gridX(1), -140]}
          fontSize={14}
          fill={T.yellow}
          fontFamily={FONT.sans}
          text={'日期 · 产品 · 数量'}
          opacity={0}
        />
        <Rect ref={qChip} position={[0, -200]} width={360} height={64} radius={14} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'查询：只用其中 3 列'} />
        </Rect>
        <Txt ref={qMark} position={[0, 130]} fontSize={64} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'?'} opacity={0} />
      </Node>

      {/* 行拆成列 */}
      <Node ref={pIdea} opacity={0}>
        <Rect ref={ideaFrame} position={[0, -170]} width={1080} height={100} radius={14} fill={T.card} stroke={T.blue} lineWidth={3}>
          <Txt position={[0, -72]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'第一行里的全部值'} />
        </Rect>
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
        <Txt ref={restTag} position={[0, 180]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'每列的值，存在一起'} opacity={0} />
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
        <Rect ref={rowHl} position={[0, TAB_Y(0)]} width={1060} height={36} stroke={T.yellow} lineWidth={3} opacity={0} />
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
        {/* r7 P2-3：文档条改成有文档形态的块（标题 + 两行文字），不再是一条文字横条 */}
        <Rect ref={docCard} position={[0, 0]} width={1000} height={120} radius={14} fill={T.card} stroke={T.purple} lineWidth={2} opacity={0}>
          <Txt ref={docTitle} position={[0, -40]} fontSize={SIZE.label} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'文档'} opacity={0} />
          <Txt ref={docLine1} position={[0, -8]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'整个文档 = 一段连续的字节'} opacity={0} />
          <Txt ref={docLine2} position={[0, 24]} fontSize={16} fill={T.muted} fontFamily={FONT.sans} text={'标题 · 作者 · 正文 · ……'} opacity={0} />
        </Rect>
        {byteCells.map((ref, i) => (
          <Rect
            key={`bc-${i}`}
            ref={ref}
            position={[-460 + i * 41, 100]}
            width={38}
            height={30}
            fill={T.card}
            stroke={T.line}
            lineWidth={1}
            opacity={0}
          />
        ))}
      </Node>
    </>
  );
  pIdea().add(ideaKVs.map(kv => kv.node));

  // k0：单元站牌（演示拍，念完留 0.8s）
  yield* beat('k0', unit.enter());

  say('数万亿行，拍字节');
  yield* beat('k1',
    unit.toHeader(),
    all(pScale().opacity(1, 0.5)),
    at('数万亿行', all(factBar().opacity(1, 0.4), dimBar().opacity(1, 0.4), dimLab().opacity(1, 0.4))),
    at('拍字节', chain(pbTag().opacity(1, 0.4), scaleDot().opacity(1, 0.3), scaleDot().position([480, -140], 2.2))),
    // 小圆点移动太小，freezedetect 测不出（1.93–7.97s 定格 6.03s，error）：
    // 后半拍的三个短语各配一个可见变化，把最长定格切到 2s 以内。
    at('存和查都成了难题', factBar().stroke(T.red, 0.4)),
    at('维度表通常小得多', dimLab().fill(T.green, 0.4)),
    at('只有几百万行', dimBar().scale(1.15, 0.4)),
  );

  say('只用 3 列，剩下白读？');
  yield* beat('k2',
    chain(pScale().opacity(0, 0.4), all(pGrid().opacity(1, 0.5), qChip().opacity(1, 0.5))),
    // r7 P2-1：亮起的 3 格加列名标注（日期 / 产品 / 数量），与 k19 同位置。
    // r7 复核：三格各自标注会重叠（格距 23px、每标约 28px）——改成三格上方一行合并标注。
    at('三列', chain(hlA[0]().opacity(1, 0.4), hlA[1]().opacity(1, 0.4), hlA[2]().opacity(1, 0.4),
      k2Lab().opacity(1, 0.4))),
    at('白读', qMark().opacity(1, 0.5)),
  );

  say('行存一起，列存一起');
  yield* beat('k3',
    chain(pGrid().opacity(0, 0.4), all(pIdea().opacity(1, 0.4), ...ideaKVs.map(kv => kv.node.opacity(1, 0.4)))),
    at('行是把', ideaFrame().stroke(T.yellow, 0.4)),
    at('每列的全部值',
      all(
        strips[0]().opacity(1, 0.4), strips[1]().opacity(1, 0.4), strips[2]().opacity(1, 0.4), strips[3]().opacity(1, 0.4),
        strips[4]().opacity(1, 0.4), strips[5]().opacity(1, 0.4), strips[6]().opacity(1, 0.4), strips[7]().opacity(1, 0.4),
        stripLabs[0]().opacity(1, 0.4), stripLabs[1]().opacity(1, 0.4), stripLabs[2]().opacity(1, 0.4), stripLabs[3]().opacity(1, 0.4),
        stripLabs[4]().opacity(1, 0.4), stripLabs[5]().opacity(1, 0.4), stripLabs[6]().opacity(1, 0.4), stripLabs[7]().opacity(1, 0.4),
        ...ideaKVs.map((kv, i) => kv.moveTo([TAB_X(i), 30], 1.2)),
        restTag().opacity(1, 0.5),
      )),
  );

  say('八行 × 八列');
  yield* beat('k4',
    // r5：不再提另一张表；高亮框开场就从第 1 行缓慢滑到第 8 行（3.5s），
    // 念到“第一行”时回到第 1 行、第一行八个值描黄——k3 那一行就是这张表的第一行。
    chain(pIdea().opacity(0, 0.4), pTable().opacity(1, 0.4),
      chain(rowHl().opacity(1, 0.3), rowHl().position([0, TAB_Y(7)], 3.5))),
    at('八行八列', all(tabHead[0]().opacity(1, 0.3), tabHead[7]().opacity(1, 0.3))),
    at('第一行',
      chain(rowHl().position([0, TAB_Y(0)], 0.6),
        all(tabCells[0][0]().fill(T.yellow, 0.3), tabCells[0][1]().fill(T.yellow, 0.3),
          tabCells[0][2]().fill(T.yellow, 0.3), tabCells[0][3]().fill(T.yellow, 0.3),
          tabCells[0][4]().fill(T.yellow, 0.3), tabCells[0][5]().fill(T.yellow, 0.3),
          tabCells[0][6]().fill(T.yellow, 0.3), tabCells[0][7]().fill(T.yellow, 0.3)))),
  );

  say('一行，存在一起');
  yield* beat('k5',
    // r5：一行八个值逐格出现（原先并行出现后静止 3.5s）；字节格 24 格逐格亮起
    // （原先只亮 5 格，示意偏稀疏），文档卡慢淡入 1.5s 填中段。
    chain(all(pTable().opacity(0, 0.4), pRow().opacity(1, 0.4), rowFrame().opacity(1, 0.4)),
      chain(rowCells[0]().opacity(1, 0.35), rowCells[1]().opacity(1, 0.35),
        rowCells[2]().opacity(1, 0.35), rowCells[3]().opacity(1, 0.35),
        rowCells[4]().opacity(1, 0.35), rowCells[5]().opacity(1, 0.35),
        rowCells[6]().opacity(1, 0.35), rowCells[7]().opacity(1, 0.35))),
    at('挨在一起存', all(rowLab().opacity(1, 0.4), rowFrame().stroke(T.yellow, 0.4))),
    // r7 P2-3：文档块（标题 + 两行文字）随卡一起出现，不再是一条文字横条。
    at('文档库也一样', chain(docCard().opacity(1, 1.5),
      all(docTitle().opacity(1, 0.4), docLine1().opacity(1, 0.4), docLine2().opacity(1, 0.4)))),
    at('一段连续的字节',
      chain(byteCells[0]().opacity(1, 0.05), byteCells[1]().opacity(1, 0.05),
        byteCells[2]().opacity(1, 0.05), byteCells[3]().opacity(1, 0.05),
        byteCells[4]().opacity(1, 0.05), byteCells[5]().opacity(1, 0.05),
        byteCells[6]().opacity(1, 0.05), byteCells[7]().opacity(1, 0.05),
        byteCells[8]().opacity(1, 0.05), byteCells[9]().opacity(1, 0.05),
        byteCells[10]().opacity(1, 0.05), byteCells[11]().opacity(1, 0.05),
        byteCells[12]().opacity(1, 0.05), byteCells[13]().opacity(1, 0.05),
        byteCells[14]().opacity(1, 0.05), byteCells[15]().opacity(1, 0.05),
        byteCells[16]().opacity(1, 0.05), byteCells[17]().opacity(1, 0.05),
        byteCells[18]().opacity(1, 0.05), byteCells[19]().opacity(1, 0.05),
        byteCells[20]().opacity(1, 0.05), byteCells[21]().opacity(1, 0.05),
        byteCells[22]().opacity(1, 0.05), byteCells[23]().opacity(1, 0.05),
        // r7 P2-3：终帧保留亮起态——24 格亮满后填成亮黄色收尾，不回落暗灰。
        all(...byteCells.map(b => b().fill(T.yellow, 0.3)), ...byteCells.map(b => b().stroke(T.yellow, 0.3))))),
  );
});
