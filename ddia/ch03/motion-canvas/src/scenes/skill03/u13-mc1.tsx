// U13 场景 1（MC）r9：m0–m9 —— m0 单元站牌（UnitTitle：第 13 站），m1 钩子、插入顺序、整行整行排序、第一排序键、只扫上个月。
// r9（判定 #38）：P2-1 m1 旁白改“行按什么顺序存，结果都一样；但读起来快慢，可就差远了”（cue '不一定重要'→'读起来快慢'）；
// P2-2 m9 月条 12 号下标“12 · 140101”（140101 对应第 12 格），past12Lab 并入“每月 300 行”。
// r8（判定 #37）：P1-1 m2 表回插入顺序改淡出重排（r7 的同时竖移会让对调的行半途重叠，且藏起的第 6 行再没回来）；
// P2-4 m9 加小字“12 条是过去 12 个月，到上个月为止”（演示措辞）。
// r7（判定 #35）：P1-1 m1 钩子前提排好序（表先排好序 + 绿点沿日期列走读路线 + 写箭头标“写”被“？”拦住，终帧留到 m2 开头再收；m2 开头表回插入顺序）；
// P1-2 m6 高亮行改第 3 行（140101·69·3，与绿框同一行）；P2-1 m9 绿格上方标“上个月”、三角移到段左边界、两行右缘小字分开。
// 分镜：skill-ch03/beats-u13.md；原文：DDIA §3.12（书页 p99–100，PDF p121–122）。
// 事实表概念：日期 / 产品 / 数量三列，6 行示例数据（r5 起全章统一用这张 6 行表；与图 3-10 的 8 行不是同一批数据，只借列名）。
// m9 加计数器“只扫 1 / 12 个月”（设计：要数的代价）。
// r5：m9 旁白明说映射（140101 三行当上个月、140102 三行当这个月）+ 定位办法（从第一排序键的边界直接定位）；扫描框移到 [495,-40] 正框第 12 条月条（r4 P2-1）。
// 时长全部来自 timeline/u13.json（beat() 驱动），不手写 waitFor。
import {Circle, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, chain, createRef} from '@motion-canvas/core';
import {at, makeBeats} from '../../lib/beats';
import {UnitTitle} from '../../lib/opening';
import {CHAPTER} from '../../lib/chapter';
import {Counter} from '../../lib/schemas';
import {FONT, SAFE, SIZE, T} from '../../lib/theme';
import timeline from '../../timeline/u13.json';

const COL_X = [-340, 0, 340];
const COL_HEAD = ['date_key', 'product_sk', 'quantity'];
const ROW_Y = [-205, -165, -125, -85, -45, -5];
// 6 行示例数据（插入顺序）：R0 140102/32/5，R1 140101/69/3，R2 140102/33/2，R3 140101/32/7，R4 140102/32/9，R5 140101/32/4
const DATA = [
  ['140102', '32', '5'],
  ['140101', '69', '3'],
  ['140102', '33', '2'],
  ['140101', '32', '7'],
  ['140102', '32', '9'],
  ['140101', '32', '4'],
];
// 整行整行排序后（按日期，再按产品）：R3, R5, R1, R0, R4, R2（与 mc2 的 6 行表顺序一致）
// 各列独立排序后每列的行次序：日期列 R1,R3,R5,R0,R2,R4；产品列 R0,R3,R4,R5,R2,R1；数量列 R2,R1,R5,R0,R3,R4
const SORTED_ROW = [3, 5, 1, 0, 4, 2];
const INDEP_ROW = [
  [1, 3, 5, 0, 2, 4],
  [0, 3, 4, 5, 2, 1],
  [2, 1, 5, 0, 3, 4],
];

export default makeScene2D(function* (view) {
  view.fill(T.bg);
  const beat = makeBeats(timeline);

  // 单元站牌（m0）：这一站在全章的位置 + 单元标题；m1 开头收成左上角页眉。
  // 页眉与场景原有的左上角标题同一位置同一样式，旧 header 已删，改由 unit.header 承担。
  const unit = new UnitTitle(CHAPTER, 'u13');

  const anchor = createRef<Txt>();
  const say = (text: string) => anchor().text(text);

  const tab = createRef<Node>();
  const headCells = [0, 1, 2].map(() => createRef<Rect>());
  const headTxts = [0, 1, 2].map(() => createRef<Txt>());
  const cells = [0, 1, 2, 3, 4, 5].map(() => [0, 1, 2].map(() => createRef<Node>()));
  const cellRects = [0, 1, 2, 3, 4, 5].map(() => [0, 1, 2].map(() => createRef<Rect>()));
  const orderNums = [0, 1, 2, 3, 4, 5].map(() => createRef<Txt>());
  const readDot = createRef<Circle>();
  const writeArrow = createRef<Line>();
  const writeQ = createRef<Txt>();
  const writeLab = createRef<Txt>();
  const sortArrows = [0, 1, 2].map(() => createRef<Txt>());
  const appendArrows = [0, 1, 2].map(() => createRef<Txt>());
  const chipEach = createRef<Node>();
  const chipWrong = createRef<Node>();
  const chipRight = createRef<Node>();
  const bands = [0, 1, 2, 3, 4, 5].map(() => createRef<Rect>());
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
  const boundMark = createRef<Txt>();
  const boundLab = createRef<Txt>();
  // r7 P2-1：绿格上方直接标“上个月”
  const lastMonthLab = createRef<Txt>();
  // r8 P2-4：12 条是过去 12 个月、到上个月为止（演示措辞：时间轴到上个月为止，这个月还没过完）
  const past12Lab = createRef<Txt>();
  // r6 F1/F2：日期码说明 + 边界定位机制小字
  const dateCodeLab = createRef<Txt>();
  const mechChip = createRef<Txt>();
  const rowTally = createRef<Node>();
  const scanCount = new Counter([445, 110], '只扫 ', ' / 12 个月');

  const moveCells = (rowOf: (r: number, c: number) => number, dur: number) =>
    all(
      ...[0, 1, 2, 3, 4, 5].flatMap(r =>
        [0, 1, 2].map(c => cells[r][c]().position([COL_X[c], ROW_Y[rowOf(r, c)]], dur)),
      ),
    );
  const toSorted = (dur: number) =>
    moveCells((r) => SORTED_ROW.indexOf(r), dur);
  const toIndep = (dur: number) =>
    moveCells((r, c) => INDEP_ROW[c].indexOf(r), dur);

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

      {/* 事实表概念：三列四行 */}
      <Node ref={tab} opacity={0}>
        {[0, 1, 2].map(i => (
          <Rect
            key={`hc-${i}`}
            ref={headCells[i]}
            position={[COL_X[i], -250]}
            width={210}
            height={40}
            radius={10}
            fill={T.card}
            stroke={T.blue}
            lineWidth={2}
          >
            <Txt ref={headTxts[i]} fontSize={20} fill={T.text} fontFamily={FONT.mono} text={COL_HEAD[i]} />
          </Rect>
        ))}
        {[0, 1, 2, 3, 4, 5].flatMap(r =>
          [0, 1, 2].map(c => (
            <Node key={`cell-${r}-${c}`} ref={cells[r][c]} position={[COL_X[c], r === 5 ? ROW_Y[r] + 60 : ROW_Y[r]]} opacity={r === 5 ? 0 : 1}>
              <Rect ref={cellRects[r][c]} width={210} height={36} radius={8} fill={T.card} stroke={T.line} lineWidth={2}>
                <Txt fontSize={22} fill={T.text} fontFamily={FONT.mono} text={DATA[r][c]} />
              </Rect>
            </Node>
          )),
        )}
        <Txt ref={appendArrows[0]} position={[COL_X[0], 28]} fontSize={28} fill={T.green} fontFamily={FONT.sans} text={'↓'} opacity={0} />
        <Txt ref={appendArrows[1]} position={[COL_X[1], 28]} fontSize={28} fill={T.green} fontFamily={FONT.sans} text={'↓'} opacity={0} />
        <Txt ref={appendArrows[2]} position={[COL_X[2], 28]} fontSize={28} fill={T.green} fontFamily={FONT.sans} text={'↓'} opacity={0} />
        {[0, 1, 2, 3, 4, 5].map(i => (
          <Txt key={`on-${i}`} ref={orderNums[i]} position={[-490, ROW_Y[i]]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.mono} text={String(i + 1)} opacity={0} />
        ))}
        <Circle ref={readDot} position={[-450, -110]} width={22} height={22} fill={T.green} opacity={0} />
        <Line ref={writeArrow} points={[[560, -110], [470, -110]]} stroke={T.red} lineWidth={3} endArrow opacity={0} />
        <Txt ref={writeQ} position={[515, -165]} fontSize={56} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'?'} opacity={0} />
        {/* r7 P1-1：写箭头标“写”字 */}
        <Txt ref={writeLab} position={[515, -55]} fontSize={28} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'写'} opacity={0} />
        {[0, 1, 2].map(i => (
          <Txt key={`sa-${i}`} ref={sortArrows[i]} position={[COL_X[i], -285]} fontSize={30} fill={T.yellow} fontFamily={FONT.sans} text={'▼'} opacity={0} />
        ))}
        {[0, 1, 2, 3, 4, 5].map(i => (
          <Rect key={`band-${i}`} ref={bands[i]} position={[0, ROW_Y[i]]} width={1140} height={40} radius={10} fill={T.yellow} opacity={0} />
        ))}
        <Rect ref={dateBand} position={[COL_X[0], -105]} width={230} height={230} radius={12} fill={T.yellow} opacity={0} />
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

      {/* m8：管理员与常见查询 */}
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

      {/* m9：十二个月条带 */}
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
        {/* r9 P2-2：12 号月条下标日期码“12 · 140101”——140101 对应第 12 格（上个月）；其余月条只标号 */}
        {Array.from({length: 12}, (_, i) => (
          <Txt key={`ml-${i}`} ref={monthLabs[i]} position={[-535 + i * 90 + 40, 35]} fontSize={16} fill={T.muted} fontFamily={FONT.mono} text={i === 11 ? '12 · 140101' : String(i + 1)} />
        ))}
        <Rect ref={scanFrame} position={[495, -40]} width={92} height={112} radius={12} stroke={T.yellow} lineWidth={4} opacity={0} />
        <Circle ref={scanDot} position={[410, -40]} width={20} height={20} fill={T.yellow} opacity={0} />
        {/* r7 P2-1：“只扫这里”上移，给绿格上方的“上个月”标让位 */}
        <Txt ref={scanLab} position={[495, -175]} fontSize={SIZE.label} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'只扫这里'} opacity={0} />
        {/* r8 P2-4：12 条是过去 12 个月、到上个月为止（演示措辞）；r9 P2-2：并入“每月 300 行”，言明每月行数 */}
        <Txt ref={past12Lab} position={[-60, -175]} fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.sans} text={'12 条是过去 12 个月，每月 300 行，到上个月为止'} opacity={0} />
        {/* r7 P2-1：绿格上方直接标“上个月” */}
        <Txt ref={lastMonthLab} position={[495, -140]} fontSize={SIZE.label} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'上个月'} opacity={0} />
        {/* r5：定位记号——上个月那段左边界上的三角 + “从边界直接定位”标签；r7 P2-1：三角移到段左边界 x=450（第 11/12 条月条之间）；r7 QA 修：三角上移到 y=-116，避开扫描框上沿（r7 首轮 QA 记 edge error） */}
        <Txt ref={boundMark} position={[450, -116]} fontSize={28} fill={T.yellow} fontFamily={FONT.sans} text={'▼'} opacity={0} />
        {/* r7 P2-1：“从边界直接定位”上移到 y=60，与“只扫 1 / 12 个月”计数器（y=110）分开 */}
        <Txt ref={boundLab} position={[495, 60]} fontSize={SIZE.label} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'从边界直接定位'} opacity={0} />
        {/* r6 F1/F2：日期码说明 + 边界定位机制（排好序了，按边界值一比就知道从哪一段开始） */}
        <Txt ref={dateCodeLab} position={[-280, 150]} fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.sans} text={'140101、140102 只是日期码，当两个月份的示意'} opacity={0} />
        <Txt ref={mechChip} position={[280, 150]} fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.sans} text={'排好序了，按边界值一比就知道从哪一段开始'} opacity={0} />
      </Node>
      {/* m9：量级贴片（一共 3600 行，上个月 300 行；示意量级，与“只扫 1 / 12 个月”一致；放 y=210，避开 r6 新加的两行小字 [y=150]） */}
      <Node ref={rowTally} position={[0, 210]} opacity={0}>
        <Rect width={460} height={56} radius={12} fill={T.card} stroke={T.yellow} lineWidth={2}>
          <Txt fontSize={SIZE.label} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'一共 3600 行 · 上个月 300 行'} />
        </Rect>
      </Node>
    </>
  );

  view.add([scanCount.node]);

  // m0：单元站牌（演示拍，念完留 0.8s）
  yield* beat('m0', unit.enter());

  say('排好序，写怎么办？');
  yield* beat('m1',
    unit.toHeader(),
    all(tab().opacity(1, 0.5)),
    // r7 P1-1：钩子前提“排好序”要在画面上成立——表先排好序（6 行全亮），绿点沿日期列走出读路线，写箭头标“写”再被“？”拦住；终帧不淡出，m2 开头再收
    at('列存排好序', all(
      cells[5][0]().opacity(1, 0.4), cells[5][1]().opacity(1, 0.4), cells[5][2]().opacity(1, 0.4),
      toSorted(1.2),
    )),
    at('读省事了', chain(
      // r7 QA 修：绿点贴着日期列内侧左沿走（x=COL_X[0]-94，圆心在格左沿 + 半径处），不压住居中的日期值；r7 首轮 QA 记 covered error（圆压住 140102）
      readDot().opacity(1, 0.4),
      readDot().position([COL_X[0] - 94, ROW_Y[0]], 0.5),
      readDot().position([COL_X[0] - 94, ROW_Y[1]], 0.4),
      readDot().position([COL_X[0] - 94, ROW_Y[2]], 0.4),
      readDot().position([COL_X[0] - 94, ROW_Y[3]], 0.4),
      readDot().position([COL_X[0] - 94, ROW_Y[4]], 0.4),
      readDot().position([COL_X[0] - 94, ROW_Y[5]], 0.4),
    )),
    at('写怎么办', all(writeArrow().opacity(1, 0.4), writeLab().opacity(1, 0.4), writeQ().opacity(1, 0.4))),
    at('行按什么顺序存', all(orderNums[0]().opacity(1, 0.4), orderNums[1]().opacity(1, 0.4), orderNums[2]().opacity(1, 0.4), orderNums[3]().opacity(1, 0.4), orderNums[4]().opacity(1, 0.4), orderNums[5]().opacity(1, 0.4))),
    // r7 QA 修：m1 尾部 3.8s 静止（idle warn），“？”轻 pulse 一下跟着旁白收尾
    // r9 P2-1：旁白末句改成“结果都一样；但读起来快慢，可就差远了”，cue 跟着改
    at('读起来快慢', chain(writeQ().scale(1.15, 0.4), writeQ().scale(1, 0.4))),
  );

  say('插入顺序最容易');
  yield* beat('m2',
    chain(
      // r8 P1-1：收掉 m1 终帧留下的读点/写箭头
      all(readDot().opacity(0, 0.4), writeArrow().opacity(0, 0.4), writeQ().opacity(0, 0.4), writeLab().opacity(0, 0.4)),
      // r8 P1-1：表回插入顺序——先把整表淡出，再瞬间移回原位、淡回（r7 的同时竖移会让上下对调的行在半途重叠：
      // 140101·69·3 压在 140101·32·4 上、140102·32·5 与 140101·32·7 对穿；淡出重排从构造上没有重叠）。
      // 第 6 行（R5，140101·32·4）先藏起，留给“新行来了”再追加；淡出 0.4 + 淡回 0.4，1.2s 内做完，赶在“新行来了”cue（约 3.2s）之前
      all(...[0, 1, 2, 3, 4, 5].flatMap(r =>
        [0, 1, 2].map(c => cells[r][c]().opacity(0, 0.4)),
      )),
      all(
        ...[0, 1, 2, 3, 4].flatMap(r =>
          [0, 1, 2].map(c => cells[r][c]().position([COL_X[c], ROW_Y[r]], 0.01)),
        ),
        cells[5][0]().position([COL_X[0], ROW_Y[5] + 60], 0.01), cells[5][1]().position([COL_X[1], ROW_Y[5] + 60], 0.01), cells[5][2]().position([COL_X[2], ROW_Y[5] + 60], 0.01),
      ),
      all(...[0, 1, 2, 3, 4].flatMap(r =>
        [0, 1, 2].map(c => cells[r][c]().opacity(1, 0.4)),
      )),
    ),
    at('新行来了', all(
      appendArrows[0]().opacity(1, 0.4), appendArrows[1]().opacity(1, 0.4), appendArrows[2]().opacity(1, 0.4),
      appendArrows[0]().position([COL_X[0], 48], 2.2), appendArrows[1]().position([COL_X[1], 48], 2.2), appendArrows[2]().position([COL_X[2], 48], 2.2),
    )),
    at('往每个列文件尾一追加', chain(
      // r8 P1-1：r7 藏起的第 6 行在这里作为新行追加回来——从藏起的位置上滑到列尾（0.6s），再绿描边；
      // r7 只描了绿边、没把行亮回来，是 m2–m9 丢行的根因
      all(cells[5][0]().opacity(1, 0.6), cells[5][1]().opacity(1, 0.6), cells[5][2]().opacity(1, 0.6),
        cells[5][0]().position([COL_X[0], ROW_Y[5]], 0.6), cells[5][1]().position([COL_X[1], ROW_Y[5]], 0.6), cells[5][2]().position([COL_X[2], ROW_Y[5]], 0.6)),
      all(cellRects[5][0]().stroke(T.green, 0.3), cellRects[5][1]().stroke(T.green, 0.3), cellRects[5][2]().stroke(T.green, 0.3)),
    )),
    at('就完事', all(
      chain(cellRects[5][0]().stroke(T.line, 0.4), cellRects[5][1]().stroke(T.line, 0.4), cellRects[5][2]().stroke(T.line, 0.4)),
      appendArrows[0]().opacity(0, 0.4), appendArrows[1]().opacity(0, 0.4), appendArrows[2]().opacity(0, 0.4),
    )),
  );

  say('顺序本身当索引');
  yield* beat('m3',
    at('强加一个顺序', all(toSorted(1.4), headCells[0]().stroke(T.yellow, 0.5))),
    at('当成一种索引', headTxts[0]().fill(T.yellow, 0.4)),
  );

  say('各列不能各排各的');
  yield* beat('m4',
    all(sortArrows[0]().opacity(1, 0.4), sortArrows[1]().opacity(1, 0.4), sortArrows[2]().opacity(1, 0.4)),
    at('各列不能各排各的', chipEach().opacity(1, 0.5)),
  );

  say('第 k 项对不上同一行');
  yield* beat('m5',
    all(chipEach().opacity(0, 0.4)),
    at('独立排好序', toIndep(1.4)),
    at('拼不回来了', chipWrong().opacity(1, 0.5)),
  );

  say('第 k 项属于同一行');
  yield* beat('m6',
    all(chipWrong().opacity(0, 0.4)),
    at('第 k 项', toSorted(1.4)),
    at('属于同一行', all(
      // r7 P1-2：高亮第 3 行（R1，140101·69·3），与绿框“140101 · 69 · 3 ✓”同一行；r6 错高亮第 6 行
      cellRects[1][0]().stroke(T.yellow, 0.4),
      cellRects[1][1]().stroke(T.yellow, 0.4),
      cellRects[1][2]().stroke(T.yellow, 0.4),
    )),
    at('重组出行', chipRight().opacity(1, 0.5)),
  );

  say('整行整行地排');
  yield* beat('m7',
    at('整行整行地排', chain(
      bands[0]().opacity(0.25, 0.2),
      bands[0]().opacity(0, 0.2),
      bands[1]().opacity(0.25, 0.2),
      bands[1]().opacity(0, 0.2),
      bands[2]().opacity(0.25, 0.2),
      bands[2]().opacity(0, 0.2),
      bands[3]().opacity(0.25, 0.2),
      bands[3]().opacity(0, 0.2),
      bands[4]().opacity(0.25, 0.2),
      bands[4]().opacity(0, 0.2),
      bands[5]().opacity(0.25, 0.2),
      bands[5]().opacity(0, 0.2),
    )),
  );

  say('谁定排法？常查什么');
  yield* beat('m8',
    all(tab().opacity(0.2, 0.5), chipRight().opacity(0, 0.4),
      cellRects[1][0]().stroke(T.line, 0.4), cellRects[1][1]().stroke(T.line, 0.4), cellRects[1][2]().stroke(T.line, 0.4)),
    at('管数据库的人', admin().opacity(1, 0.5)),
    at('常查什么', chain(queryChips[0]().opacity(1, 0.4), queryChips[1]().opacity(1, 0.4), queryChips[2]().opacity(1, 0.4))),
    at('上个月的销售', lastMonthChip().opacity(1, 0.5)),
  );

  say('只扫上个月');
  yield* beat('m9',
    at('第一排序键', all(admin().opacity(0, 0.5), tab().opacity(1, 0.5),
      dateBand().opacity(0.14, 0.5), firstKeyTag().opacity(1, 0.5))),
    // r6 定格修复：m9 前 14s 只有首尾两个动作，6.03s error；分句 pulse 跟着旁白走
    at('拿 140101 这三行当上个月', chain(firstKeyTag().scale(1.08, 0.4), firstKeyTag().scale(1, 0.4))),
    at('日期是示意', chain(dateBand().opacity(0.22, 0.4), dateBand().opacity(0.14, 0.4))),
    at('这 6 行只是示意', chain(firstKeyTag().scale(1.08, 0.4), firstKeyTag().scale(1, 0.4))),
    at('换成一张 3600 行的真表', rowTally().opacity(1, 0.5)),
    at('只扫这三百行', all(tab().opacity(0, 0.5), lastMonthChip().opacity(0, 0.4), dateBand().opacity(0, 0.4), firstKeyTag().opacity(0, 0.4),
      sortArrows[0]().opacity(0, 0.4), sortArrows[1]().opacity(0, 0.4), sortArrows[2]().opacity(0, 0.4),
      orderNums[0]().opacity(0, 0.4), orderNums[1]().opacity(0, 0.4), orderNums[2]().opacity(0, 0.4),
      orderNums[3]().opacity(0, 0.4), orderNums[4]().opacity(0, 0.4), orderNums[5]().opacity(0, 0.4),
      headCells[0]().stroke(T.blue, 0.4), headTxts[0]().fill(T.text, 0.4),
      months().opacity(1, 0.5), scanFrame().opacity(1, 0.5), scanLab().opacity(1, 0.5), lastMonthLab().opacity(1, 0.5), past12Lab().opacity(1, 0.5),
      chain(scanCount.node.opacity(1, 0.4), scanCount.bump()),
      chain(scanDot().opacity(1, 0.4), scanDot().position([480, -40], 0.8)))),
    at('比扫全部三千六百行快得多', chain(scanDot().position([410, -40], 0.1), scanDot().position([480, -40], 1.6))),
    at('从第一排序键的边界直接定位', all(boundMark().opacity(1, 0.5), boundLab().opacity(1, 0.5))),
    at('两个日期码', dateCodeLab().opacity(1, 0.5)),
    at('按边界值一比', mechChip().opacity(1, 0.5)),
  );
});
