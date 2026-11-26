// U4 场景 1（MC，r5）：d0–d12 —— 站牌、钩子、B 树来历、同是排序哲学不同、变长段 vs 4 KB 固定页、
// r7（判定 #31）：d1 日志结构一路加“第二、三站”小标；d3b 同；d4a2 点名主语（指针存磁盘地址）；
// d5 两端引用小标；d9 fewStrip 加标“一格是一个引用”。
// 页间指针、根页与范围边界、按原图复现查 251 三级下钻（读页计数器 1→2→3）、分支因子、
// 四层树 256 TB、范围查询、111 兄弟页不在路径上。分镜：skill-ch03/beats-u4.md；
// r5：新增首拍 d0 站牌（UnitTitle：第 4 站“B 树”，第一部分“事务型存储”），d1 开头收成左上角页眉；
// 旧静态 header 已删，改由 unit.header 承担（U12 l0 / U2 b0 先例）。
// d5b 只留一根箭头，从黄框标出的 200–300 那格引用引出，落到真正的第二层页
// （210/230/250/270/290，标“第二层页”）；两个无范围子页框删除。d11 开场淡出 d9 的
// fewStrip（一排蓝色空框，“更多引用”示意），不再泄漏进 d11–d12b。
// 原文：DDIA §3.4（书页 p79–81，PDF p101–103）。
// 原图 3-6 按处置“改编”：根页 100/200/300/400/500、兄弟页 111/135/152/169/190（100–200，虚线，
// 不在 251 路径上）、210/230/250/270/290 页、叶页 250/251/252/253/254 均按原图重新生成；
// 根页 200–300 的实线箭头直指 210 页，再沿 250 ≤ key < 270 下到叶页。
// 时长全部来自 timeline/u4.json（beat() 驱动），不手写 waitFor。
import {Circle, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, chain, createRef} from '@motion-canvas/core';
import {at, makeBeats} from '../../lib/beats';
import {UnitTitle} from '../../lib/opening';
import {CHAPTER} from '../../lib/chapter';
import {FONT, SAFE, SIZE, T} from '../../lib/theme';
import {Counter} from '../../lib/schemas';
import timeline from '../../timeline/u4.json';

type Cell = {t: string; w: number; bold?: boolean};
function cellCenters(cells: Cell[]): number[] {
  const total = cells.reduce((s, c) => s + c.w, 0);
  let x = -total / 2;
  return cells.map(c => {
    const cx = x + c.w / 2;
    x += c.w;
    return cx;
  });
}
// 一页：外框 + 竖分隔线 + 每格文字。id 保证 key 全局唯一。
function Page({cells, id}: {cells: Cell[]; id: string}) {
  const total = cells.reduce((s, c) => s + c.w, 0);
  const centers = cellCenters(cells);
  return (
    <Node>
      <Rect width={total} height={44} fill={T.card} stroke={T.line} lineWidth={2} radius={6} />
      {cells.map((c, i) => (
        <Node key={`${id}-c${i}`}>
          {i > 0 && <Rect position={[centers[i] - c.w / 2, 0]} width={2} height={44} fill={T.line} />}
          <Txt
            position={[centers[i], 0]}
            fontSize={c.bold ? 22 : 20}
            fontWeight={c.bold ? 700 : 400}
            fill={T.text}
            fontFamily={FONT.mono}
            text={c.t}
          />
        </Node>
      ))}
    </Node>
  );
}

const REF = 46;
const NUM = 58;
const refCell = (): Cell => ({t: 'ref', w: REF});
const numCell = (n: number): Cell => ({t: String(n), w: NUM});
// 原图 3-6 根页：ref/100/ref/200/ref/300/ref/400/ref/500/ref
const ROOT_CELLS: Cell[] = [refCell(), numCell(100), refCell(), numCell(200), refCell(), numCell(300), refCell(), numCell(400), refCell(), numCell(500), refCell()];
// 原图 3-6 兄弟页（100–200）：ref/111/ref/135/ref/152/ref/169/ref/190/ref
const SIB_CELLS: Cell[] = [refCell(), numCell(111), refCell(), numCell(135), refCell(), numCell(152), refCell(), numCell(169), refCell(), numCell(190), refCell()];
// 原图 3-6 210 页：ref/210/ref/230/ref/250/ref/270/ref/290/ref
const MID_CELLS: Cell[] = [refCell(), numCell(210), refCell(), numCell(230), refCell(), numCell(250), refCell(), numCell(270), refCell(), numCell(290), refCell()];
const KEY = 56;
const VAL = 44;
// 原图 3-6 叶页：250/val/251/val/252/val/253/val/254/val
const LEAF_CELLS: Cell[] = [251, 252, 253, 254].reduce<Cell[]>(
  (acc, k) => acc.concat([{t: String(k), w: KEY}, {t: 'val', w: VAL}]),
  [{t: '250', w: KEY}, {t: 'val', w: VAL}],
);

export default makeScene2D(function* (view) {
  view.fill(T.bg);
  const beat = makeBeats(timeline);

  // 单元站牌（d0）：这一站在全章的位置 + 单元标题；d1 开头收成左上角页眉。
  // 页眉与场景原有的左上角标题同一位置同一样式，旧 header 已删，改由 unit.header 承担。
  const unit = new UnitTitle(CHAPTER, 'u4');

  // 查 251 走查：每读一页计数器 +1（d5 根页 → d6 第二页 → d7 叶页）。
  const readCounter = new Counter([440, -305], '读页：', ' 页');

  const anchor = createRef<Txt>();
  const say = (text: string) => anchor().text(text);

  // d1：内存框里的小树 + 两条路
  const g1 = createRef<Node>();
  const g1box = createRef<Rect>();
  const g1tree = createRef<Node>();
  const g1q = createRef<Txt>();
  const g2 = createRef<Node>();
  const g2log = createRef<Rect>();
  const g2btree = createRef<Rect>();
  const g2logNote = createRef<Txt>();  // r7 #22：日志结构那一路（第二、三站）桥接小标
  // d2：时间线
  const g3 = createRef<Node>();
  const g3line = createRef<Line>();
  const g3y1970 = createRef<Txt>();
  const g3ten = createRef<Txt>();
  const g3today = createRef<Txt>();
  const g3rel = createRef<Rect>();
  const g3non = createRef<Rect>();
  // d3a：两行排好序的键
  const g4 = createRef<Node>();
  const g4row1 = [0, 1, 2, 3, 4].map(() => createRef<Rect>());
  const g4row2 = [0, 1, 2, 3, 4].map(() => createRef<Rect>());
  const g4lab1 = createRef<Txt>();
  const g4lab2 = createRef<Txt>();
  // d3b/d3c：变长段 vs 固定页 vs 磁盘块
  const g5 = createRef<Node>();
  const g5segs = [0, 1, 2, 3].map(() => createRef<Rect>());
  const g5mb = createRef<Txt>();
  const g5logNote = createRef<Txt>();  // r7 #22：第二、三站那一路小标
  const g5pages = [0, 1, 2, 3, 4, 5].map(() => createRef<Rect>());
  const g5disk = [0, 1, 2, 3, 4, 5].map(() => createRef<Rect>());
  const g5diskLab = createRef<Txt>();
  // d4a：页间指针
  const g6 = createRef<Node>();
  const g6a = createRef<Rect>();
  const g6addr = createRef<Txt>();
  const g6arr = createRef<Line>();
  const g6b = createRef<Rect>();
  const g6ptr = createRef<Rect>();
  const g6disk = createRef<Rect>();
  const g6mem = createRef<Rect>();
  // d4b：页搭成的树
  const g7 = createRef<Node>();
  const g7root = createRef<Rect>();
  const g7c1 = createRef<Rect>();
  const g7c2 = createRef<Rect>();
  const g7a1 = createRef<Line>();
  const g7a2 = createRef<Line>();
  // d5：根页与范围边界
  const g8 = createRef<Node>();
  const g8root = createRef<Node>();
  const g8mid = createRef<Node>();
  const g8midLab = createRef<Txt>();
  const g8arr = createRef<Line>();
  const g8range = createRef<Txt>();
  const g8labL = createRef<Txt>();  // r7 #13：根页两端引用小标
  const g8labR = createRef<Txt>();
  const g8hl = createRef<Rect>();
  // d6/d7/d8/d9/d11/d12：原图 3-6
  const fig = createRef<Node>();
  const figRoot = createRef<Node>();
  const figSib = createRef<Node>();
  const figMid = createRef<Node>();
  const figLeaf = createRef<Node>();
  const arrSib = createRef<Line>();
  const arrMid = createRef<Line>();
  const arrLeaf = createRef<Line>();
  const lab100 = createRef<Txt>();
  const lab200 = createRef<Txt>();
  const lab250 = createRef<Txt>();
  const dots = createRef<Txt>();
  const dots2 = createRef<Txt>();
  const hl = createRef<Rect>();
  const hl2 = createRef<Rect>();
  const refChip = createRef<Node>();
  const refLine = createRef<Line>();
  const fewStrip = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(() => createRef<Rect>());
  const fewLab = createRef<Txt>();  // r7 #23：12 格小方格是“更多引用”示意
  const g12chip = [0, 1, 2].map(() => createRef<Rect>());
  // d10：四层树 256 TB
  const g10 = createRef<Node>();
  const g10bars = [0, 1, 2, 3].map(() => createRef<Rect>());
  const g10f1 = createRef<Txt>();
  const g10f2 = createRef<Txt>();
  const g10f3 = createRef<Txt>();
  const g10bf = createRef<Txt>();

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
      {readCounter.node}

      {/* d1：内存框里的小树 + 两条路 */}
      <Node ref={g1} opacity={0}>
        <Rect ref={g1box} position={[0, -60]} width={560} height={220} radius={16} fill={T.card} stroke={T.blue} lineWidth={3}>
          <Txt position={[-240, -80]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'内存'} />
        </Rect>
        <Node ref={g1tree} position={[0, -60]} scale={0.5}>
          <Circle position={[0, -60]} width={44} height={44} fill={T.blue} />
          <Circle position={[-90, 30]} width={36} height={36} fill={T.blue} />
          <Circle position={[90, 30]} width={36} height={36} fill={T.blue} />
          <Line points={[[0, -38], [-90, 12]]} stroke={T.line} lineWidth={3} />
          <Line points={[[0, -38], [90, 12]]} stroke={T.line} lineWidth={3} />
        </Node>
        <Txt ref={g1q} position={[0, 110]} fontSize={72} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'?'} opacity={0} />
      </Node>
      <Node ref={g2} opacity={0}>
        <Rect ref={g2log} position={[-290, -60]} width={380} height={160} radius={16} fill={T.card} stroke={T.line} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'变长段'} />
          <Txt position={[0, 45]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'日志结构那一路'} />
        </Rect>
        <Txt ref={g2logNote} position={[-290, 70]} fontSize={18} fill={T.muted} fontFamily={FONT.sans} text={'第二、三站：只追加、不原地改'} opacity={0} />
        <Rect ref={g2btree} position={[290, -60]} width={380} height={160} radius={16} fill={T.card} stroke={T.blue} lineWidth={3} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'固定页'} />
          <Txt position={[0, 45]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'B 树'} />
        </Rect>
      </Node>

      {/* d2：时间线 */}
      <Node ref={g3} opacity={0}>
        <Line ref={g3line} points={[[-480, -60], [480, -60]]} stroke={T.line} lineWidth={3} opacity={0} />
        <Txt ref={g3y1970} position={[-480, -10]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.mono} text={'1970'} opacity={0} />
        <Txt ref={g3ten} position={[-120, -10]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'不到十年'} opacity={0} />
        <Txt ref={g3today} position={[480, -10]} fontSize={SIZE.body} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'今天'} opacity={0} />
        <Rect ref={g3rel} position={[-80, -190]} width={300} height={90} radius={14} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'关系库'} />
        </Rect>
        <Rect ref={g3non} position={[280, -190]} width={300} height={90} radius={14} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'非关系库'} />
        </Rect>
      </Node>

      {/* d3a：两行排好序的键 */}
      <Node ref={g4} opacity={0}>
        {[100, 150, 200, 250, 300].map((k, i) => (
          <Rect key={`g4r1-${i}`} ref={g4row1[i]} position={[-220 + i * 110, -120]} width={90} height={44} fill={T.card} stroke={T.line} lineWidth={2} opacity={0}>
            <Txt fontSize={20} fill={T.text} fontFamily={FONT.mono} text={String(k)} />
          </Rect>
        ))}
        {[100, 150, 200, 250, 300].map((k, i) => (
          <Rect key={`g4r2-${i}`} ref={g4row2[i]} position={[-220 + i * 110, 40]} width={90} height={44} fill={T.card} stroke={T.line} lineWidth={2} opacity={0}>
            <Txt fontSize={20} fill={T.text} fontFamily={FONT.mono} text={String(k)} />
          </Rect>
        ))}
        <Txt ref={g4lab1} position={[-460, -120]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'变长段'} opacity={0} />
        <Txt ref={g4lab2} position={[-460, 40]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'固定页'} opacity={0} />
      </Node>

      {/* d3b/d3c：变长段 vs 固定页 vs 磁盘块 */}
      <Node ref={g5} opacity={0}>
        {[150, 260, 110, 200].map((w, i) => (
          <Rect
            key={`g5s-${i}`}
            ref={g5segs[i]}
            position={[-309 + [0, 221, 422, 593][i], -160]}
            width={w}
            height={56}
            radius={10}
            fill={T.card}
            stroke={T.line}
            lineWidth={2}
            opacity={0}
          />
        ))}
        <Txt ref={g5mb} position={[0, -110]} fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.sans} text={'每段几兆字节'} opacity={0} />
        <Txt ref={g5logNote} position={[0, -72]} fontSize={18} fill={T.muted} fontFamily={FONT.sans} text={'第二、三站那一路：只追加、不原地改'} opacity={0} />
        {[0, 1, 2, 3, 4, 5].map(i => (
          <Rect key={`g5p-${i}`} ref={g5pages[i]} position={[-310 + i * 124, -20]} width={110} height={56} radius={8} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
            <Txt fontSize={18} fill={T.text} fontFamily={FONT.mono} text={'4 KB'} />
          </Rect>
        ))}
        {[0, 1, 2, 3, 4, 5].map(i => (
          <Rect key={`g5d-${i}`} ref={g5disk[i]} position={[-310 + i * 124, 130]} width={110} height={56} radius={8} fill={T.card} stroke={T.muted} lineWidth={2} opacity={0} />
        ))}
        <Txt ref={g5diskLab} position={[-460, 130]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'磁盘块'} opacity={0} />
      </Node>

      {/* d4a：页间指针 */}
      <Node ref={g6} opacity={0}>
        <Rect ref={g6a} position={[-220, -60]} width={220} height={120} radius={14} fill={T.card} stroke={T.blue} lineWidth={3} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'一页'} />
        </Rect>
        <Txt ref={g6addr} position={[-220, -150]} fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.mono} text={'地址'} opacity={0} />
        <Line ref={g6arr} points={[[-110, -60], [110, -60]]} stroke={T.yellow} lineWidth={3} endArrow opacity={0} />
        <Rect ref={g6b} position={[220, -60]} width={220} height={120} radius={14} fill={T.card} stroke={T.blue} lineWidth={3} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'另一页'} />
        </Rect>
        <Rect ref={g6ptr} position={[0, -210]} width={300} height={64} radius={12} fill={T.card} stroke={T.yellow} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.sans} text={'像一枚指针'} />
        </Rect>
        <Rect ref={g6disk} position={[0, 140]} width={340} height={64} radius={12} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} text={'在磁盘上'} />
        </Rect>
        <Rect ref={g6mem} position={[-380, 140]} width={200} height={64} radius={12} fill={T.card} stroke={T.line} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'内存'} />
        </Rect>
      </Node>

      {/* d4b：页搭成的树 */}
      <Node ref={g7} opacity={0}>
        <Rect ref={g7root} position={[0, -180]} width={200} height={80} radius={14} fill={T.card} stroke={T.blue} lineWidth={3} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'根页'} />
        </Rect>
        <Line ref={g7a1} points={[[-60, -140], [-260, -20]]} stroke={T.yellow} lineWidth={3} endArrow opacity={0} />
        <Line ref={g7a2} points={[[60, -140], [260, -20]]} stroke={T.yellow} lineWidth={3} endArrow opacity={0} />
        <Rect ref={g7c1} position={[-280, 40]} width={200} height={80} radius={14} fill={T.card} stroke={T.line} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'子页'} />
        </Rect>
        <Rect ref={g7c2} position={[280, 40]} width={200} height={80} radius={14} fill={T.card} stroke={T.line} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'子页'} />
        </Rect>
      </Node>

      {/* d5：根页与范围边界 */}
      <Node ref={g8} opacity={0}>
        <Node ref={g8root} position={[0, -100]} opacity={0}>
          <Page cells={ROOT_CELLS} id={'g8root'} />
        </Node>
        <Line ref={g8arr} points={[[-52, -78], [-52, 112]]} stroke={T.yellow} lineWidth={3} endArrow opacity={0} />
        <Node ref={g8mid} position={[0, 140]} opacity={0}>
          <Page cells={MID_CELLS} id={'g8mid'} />
        </Node>
        <Txt ref={g8midLab} position={[0, 195]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'第二层页'} opacity={0} />
        <Txt ref={g8range} position={[0, -170]} fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.mono} text={'200 ≤ key < 300'} opacity={0} />
        <Txt ref={g8labL} position={[-260, -152]} fontSize={18} fill={T.muted} fontFamily={FONT.mono} text={'key < 100'} opacity={0} />
        <Txt ref={g8labR} position={[260, -152]} fontSize={18} fill={T.muted} fontFamily={FONT.mono} text={'key ≥ 500'} opacity={0} />
        <Rect ref={g8hl} position={[-52, -100]} width={52} height={50} stroke={T.yellow} lineWidth={3} opacity={0} />
      </Node>

      {/* d6/d7/d8/d9/d11/d12：原图 3-6 */}
      <Node ref={fig} opacity={0}>
        <Node ref={figRoot} position={[0, -235]}>
          <Page cells={ROOT_CELLS} id={'figRoot'} />
        </Node>
        <Node ref={figSib} position={[-300, -105]} opacity={0}>
          <Page cells={SIB_CELLS} id={'figSib'} />
        </Node>
        <Node ref={figMid} position={[283, -105]} opacity={0}>
          <Page cells={MID_CELLS} id={'figMid'} />
        </Node>
        <Node ref={figLeaf} position={[120, 45]} opacity={0}>
          <Page cells={LEAF_CELLS} id={'figLeaf'} />
        </Node>
        <Line ref={arrSib} points={[[-156, -213], [-178, -170], [-200, -127]]} stroke={T.muted} lineWidth={2} endArrow opacity={0} />
        <Line ref={arrMid} points={[[-52, -213], [100, -170], [180, -127]]} stroke={T.yellow} lineWidth={3} endArrow opacity={0} />
        <Line ref={arrLeaf} points={[[283, -83], [250, -30], [180, 23]]} stroke={T.yellow} lineWidth={3} endArrow opacity={0} />
        <Txt ref={lab100} position={[-300, -185]} fontSize={18} fill={T.muted} fontFamily={FONT.mono} text={'100 ≤ key < 200'} opacity={0} />
        <Txt ref={lab200} position={[283, -185]} fontSize={18} fill={T.yellow} fontFamily={FONT.mono} text={'200 ≤ key < 300'} opacity={0} />
        <Txt ref={lab250} position={[380, -25]} fontSize={18} fill={T.yellow} fontFamily={FONT.mono} text={'250 ≤ key < 270'} opacity={0} />
        <Txt ref={dots} position={[-300, -60]} fontSize={22} fill={T.muted} fontFamily={FONT.sans} text={'…'} opacity={0} />
        <Txt ref={dots2} position={[200, -60]} fontSize={22} fill={T.muted} fontFamily={FONT.sans} text={'…'} opacity={0} />
        <Rect ref={hl} position={[-52, -235]} width={52} height={50} stroke={T.yellow} lineWidth={3} opacity={0} />
        <Rect ref={hl2} position={[48, 45]} width={50} height={50} stroke={T.green} lineWidth={3} opacity={0} />
        <Line ref={refLine} points={[[48, 67], [48, 100]]} stroke={T.purple} lineWidth={2} endArrow opacity={0} />
        <Node ref={refChip} position={[48, 140]} opacity={0}>
          <Rect width={220} height={54} radius={12} fill={T.card} stroke={T.purple} lineWidth={2}>
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'值所在页的引用'} />
          </Rect>
        </Node>
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(i => (
          <Rect key={`few-${i}`} ref={fewStrip[i]} position={[330 + i * 21, -235]} width={17} height={30} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0} />
        ))}
        <Txt ref={fewLab} position={[445, -195]} fontSize={18} fill={T.muted} fontFamily={FONT.sans} text={'一格是一个引用'} opacity={0} />
        {[['根页', -300], ['第二页', 0], ['叶页', 300]].map(([t, x], i) => (
          <Rect key={`g12c-${i}`} ref={g12chip[i]} position={[x as number, 210]} width={200} height={56} radius={12} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
            <Txt fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} text={t as string} />
          </Rect>
        ))}
      </Node>

      {/* d10：四层树 256 TB */}
      <Node ref={g10} opacity={0}>
        {[120, 240, 360, 480].map((w, i) => (
          <Rect key={`g10b-${i}`} ref={g10bars[i]} position={[-560 + w / 2, -200 + i * 80]} width={w} height={40} radius={8} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
            <Txt position={[-w / 2 + 60, 0]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={`第 ${i + 1} 层`} />
          </Rect>
        ))}
        <Txt ref={g10bf} position={[280, -220]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'分支因子 500'} opacity={0} />
        <Txt ref={g10f1} position={[280, -150]} fontSize={28} fill={T.text} fontFamily={FONT.mono} text={'500 × 500 × 500 × 500'} opacity={0} />
        <Txt ref={g10f2} position={[280, -90]} fontSize={28} fill={T.text} fontFamily={FONT.mono} text={'× 4 KB'} opacity={0} />
        <Txt ref={g10f3} position={[280, 0]} fontSize={44} fontWeight={700} fill={T.yellow} fontFamily={FONT.mono} text={'= 256 TB'} opacity={0} />
      </Node>
    </>
  );

  // d0：单元站牌（演示拍，念完留 0.8s）
  yield* beat('d0', unit.enter());

  say('内存装不下');
  yield* beat('d1',
    unit.toHeader(),
    all(g1().opacity(1, 0.5), g1tree().scale(1.1, 1.2)),
    at('树怎么长还不倒', g1q().opacity(1, 0.4)),
    at('日志结构', chain(g1().opacity(0, 0.5), g2().opacity(1, 0.5), g2log().opacity(1, 0.5), g2logNote().opacity(1, 0.5))),
    at('最常用的索引结构', g2log().opacity(0.35, 0.5)),
    at('B 树', g2btree().opacity(1, 0.5)),
  );

  say('1970 年提出');
  yield* beat('d2',
    all(g2().opacity(0, 0.5), g3().opacity(1, 0.5)),
    at('一九七零年', all(g3line().opacity(1, 0.5), g3y1970().opacity(1, 0.4))),
    at('不到十年', g3ten().opacity(1, 0.5)),
    at('今天', all(g3today().opacity(1, 0.5), g3rel().opacity(1, 0.5))),
    at('许多非关系库', g3non().opacity(1, 0.5)),
  );

  say('同是排序，哲学不同');
  yield* beat('d3a',
    all(g3().opacity(0, 0.5), g4().opacity(1, 0.5)),
    at('排好序', chain(g4row1[0]().opacity(1, 0.3), g4row1[1]().opacity(1, 0.3), g4row1[2]().opacity(1, 0.3), g4row1[3]().opacity(1, 0.3), g4row1[4]().opacity(1, 0.3), g4row2[0]().opacity(1, 0.3), g4row2[1]().opacity(1, 0.3), g4row2[2]().opacity(1, 0.3), g4row2[3]().opacity(1, 0.3), g4row2[4]().opacity(1, 0.3))),
    at('设计哲学', all(g4lab1().opacity(1, 0.5), g4lab2().opacity(1, 0.5))),
  );

  say('切成变长的段');
  yield* beat('d3b',
    all(g4().opacity(0, 0.5), g5().opacity(1, 0.5)),
    at('切成', chain(g5segs[0]().opacity(1, 0.3), g5segs[1]().opacity(1, 0.3), g5segs[2]().opacity(1, 0.3), g5segs[3]().opacity(1, 0.3))),
    at('几兆字节', g5mb().opacity(1, 0.5)),
    at('顺序写', g5mb().fill(T.green, 0.4)),
    at('第二、三站', g5logNote().opacity(1, 0.5)),
  );

  say('固定页，4 KB');
  yield* beat('d3c',
    at('固定大小', chain(g5pages[0]().opacity(1, 0.3), g5pages[1]().opacity(1, 0.3), g5pages[2]().opacity(1, 0.3), g5pages[3]().opacity(1, 0.3), g5pages[4]().opacity(1, 0.3), g5pages[5]().opacity(1, 0.3))),
    at('四 KB', g5pages[2]().stroke(T.yellow, 0.4)),
    at('磁盘', chain(g5disk[0]().opacity(1, 0.3), g5disk[1]().opacity(1, 0.3), g5disk[2]().opacity(1, 0.3), g5disk[3]().opacity(1, 0.3), g5disk[4]().opacity(1, 0.3), g5disk[5]().opacity(1, 0.3), g5diskLab().opacity(1, 0.4))),
    at('贴着硬件', g5().scale(1.02, 1.5)),
  );

  say('页能指向页');
  yield* beat('d4a',
    all(g5().opacity(0, 0.5), g6().opacity(1, 0.5)),
    at('地址', all(g6a().opacity(1, 0.5), g6addr().opacity(1, 0.4))),
    at('指向另一页', all(g6arr().opacity(1, 0.5), g6b().opacity(1, 0.5))),
    at('像一枚指针', g6ptr().opacity(1, 0.5)),
  );

  say('页引用存磁盘地址');  // r7 #24：点名主语——页引用（原书术语）存的是磁盘地址；第三版：避开“这枚指针”开头截断
  yield* beat('d4a2',
    at('磁盘上', all(g6disk().opacity(1, 0.5), g6mem().opacity(1, 0.5))),
    at('不在内存里', all(g6mem().opacity(0.35, 0.8), g6disk().scale(1.04, 1.5))),
  );

  say('页搭成的树');
  yield* beat('d4b',
    all(g6().opacity(0, 0.5), g7().opacity(1, 0.5)),
    at('搭起来', chain(g7root().opacity(1, 0.4), g7a1().opacity(1, 0.4), g7a2().opacity(1, 0.4))),
    at('从根页开始', chain(g7root().scale(1.06, 0.6), g7root().scale(1, 0.6))),
    at('每个子页', chain(g7c1().opacity(1, 0.4), g7c2().opacity(1, 0.4))),
    at('一段连续的键范围', chain(g7c1().scale(1.05, 0.6), g7c1().scale(1, 0.6))),
  );

  say('根页长这样');
  yield* beat('d5',
    all(g7().opacity(0, 0.5), g8().opacity(1, 0.5), readCounter.node.opacity(1, 0.4)),
    at('根页长这样', g8root().opacity(1, 0.5)),
    at('最前面', g8labL().opacity(1, 0.5)),
    at('最后面', g8labR().opacity(1, 0.5)),
  );

  say('200 到 300，往下走');
  yield* beat('d5b',
    at('二百到三百', all(g8range().opacity(1, 0.5), g8hl().opacity(1, 0.4))),
    at('往下走', all(g8arr().opacity(1, 0.4), g8mid().opacity(1, 0.5), g8midLab().opacity(1, 0.4), readCounter.bump())),
  );

  say('250 到 270，往下走');
  yield* beat('d6',
    all(g8().opacity(0, 0.5), fig().opacity(1, 0.5)),
    at('到了这一页', all(figMid().opacity(1, 0.5), lab200().opacity(1, 0.5), arrMid().opacity(1, 0.6))),
    at('二百五十到二百七十', all(lab250().opacity(1, 0.5), hl().opacity(1, 0.4), hl().position([283, -105], 0.6))),
    at('叶页', all(arrLeaf().opacity(1, 0.6), figLeaf().opacity(1, 0.5), readCounter.bump())),
  );

  say('251 的值在这儿');
  yield* beat('d7',
    all(hl().position([-102, 45], 0.4), hl().width(62, 0.4)),
    at('二百五十一', hl().position([-2, 45], 0.5)),
    at('二百五十二', hl().position([98, 45], 0.5)),
    at('二百五十三', hl().position([198, 45], 0.5)),
    at('二百五十四', hl().position([298, 45], 0.5)),
    at('值就在这儿', all(hl().position([-2, 45], 0.5), hl2().opacity(1, 0.4), readCounter.bump())),
    at('这页管二百五十到二百七十', chain(hl().position([120, 45], 0.5), hl().width(500, 0.6))),
    at('眼下只写了', chain(hl().position([-102, 45], 0.4), hl().width(62, 0.4))),
    at('其余是留给以后写的空位', chain(hl().position([298, 45], 0.5), hl().width(62, 0.4))),
  );

  say('分支因子是 6');
  yield* beat('d8',
    chain(
      hl().position([-260, -235], 0.5),
      hl().position([-156, -235], 0.5),
      hl().position([-52, -235], 0.5),
      hl().position([52, -235], 0.5),
      hl().position([156, -235], 0.5),
      hl().position([260, -235], 0.5),
    ),
    at('这张图里是六', hl().lineWidth(5, 0.4)),
  );

  say('实际通常几百');
  yield* beat('d9',
    at('几百', chain(fewStrip[0]().opacity(1, 0.15), fewStrip[1]().opacity(1, 0.15), fewStrip[2]().opacity(1, 0.15), fewStrip[3]().opacity(1, 0.15), fewStrip[4]().opacity(1, 0.15), fewStrip[5]().opacity(1, 0.15), fewStrip[6]().opacity(1, 0.15), fewStrip[7]().opacity(1, 0.15), fewStrip[8]().opacity(1, 0.15), fewStrip[9]().opacity(1, 0.15), fewStrip[10]().opacity(1, 0.15), fewStrip[11]().opacity(1, 0.15), fewLab().opacity(1, 0.5))),
    at('多少空间', fig().scale(1.02, 1.2)),
  );

  say('四层树，256 TB');
  yield* beat('d10',
    all(fig().opacity(0, 0.5), g10().opacity(1, 0.5)),
    at('三四层', chain(g10bars[0]().opacity(1, 0.4), g10bars[1]().opacity(1, 0.4), g10bars[2]().opacity(1, 0.4), g10bars[3]().opacity(1, 0.4))),
    at('分支因子五百', all(g10bf().opacity(1, 0.5), g10f1().opacity(1, 0.5), g10f2().opacity(1, 0.5))),
    at('二百五十六 TB', g10f3().opacity(1, 0.5)),
  );

  say('顺着扫');
  yield* beat('d11',
    all(g10().opacity(0, 0.5), fig().opacity(1, 0.5), figMid().opacity(1, 0.4), figLeaf().opacity(1, 0.4), figSib().opacity(0.4, 0.4), hl().opacity(1, 0.4), hl().position([-102, 45], 0.4), hl().width(62, 0.4), fewLab().opacity(0, 0.4), ...fewStrip.map(r => r().opacity(0, 0.4))),
    at('顺着扫', chain(hl().position([-2, 45], 0.4), hl().position([98, 45], 0.4), hl().position([198, 45], 0.4), hl().position([298, 45], 0.4))),
    at('值所在页', refLine().opacity(1, 0.5)),
    at('引用', refChip().opacity(1, 0.5)),
    at('到值所在的那页去取', chain(refChip().scale(1.06, 0.5), refChip().scale(1, 0.5))),
  );

  say('不在这条路上');
  yield* beat('d12a',
    all(refChip().opacity(0, 0.4), refLine().opacity(0, 0.4), hl().opacity(0, 0.4), hl2().opacity(0, 0.4)),
    at('一百一十一', all(figSib().opacity(0.45, 0.5), lab100().opacity(1, 0.5), arrSib().opacity(0.6, 0.5), dots().opacity(1, 0.4))),
  );

  say('三步到值');
  yield* beat('d12b',
    at('三步到值', chain(g12chip[0]().opacity(1, 0.4), g12chip[1]().opacity(1, 0.4), g12chip[2]().opacity(1, 0.4))),
  );
});
