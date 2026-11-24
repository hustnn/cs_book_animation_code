// U4 场景 1（MC）：b1a–b13 —— 钩子、B 树来历、同是排序哲学不同、变长段 vs 4 KB 固定页、
// 页间指针、根页与范围边界、按原图复现查 251 三级下钻、分支因子。分镜：skill-ch03/beats-u4.md；
// 原文：DDIA §3.4（书页 p79–81，PDF p101–103）。
// 原图 3-6 按处置“改编”：根页 100/200/300/400/500、兄弟页 111/135/152/169/190（100–200，虚线，
// 不在 251 路径上）、210/230/250/270/290 页、叶页 250/251/252/253/254 均按原图重新生成；
// 根页 200–300 的实线箭头直指 210 页，再沿 250 ≤ key < 270 下到叶页。
// 时长全部来自 timeline/u4.json（beat() 驱动），不手写 waitFor。
import {Circle, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, chain, createRef} from '@motion-canvas/core';
import {at, makeBeats} from '../../lib/beats';
import {FONT, SAFE, SIZE, T} from '../../lib/theme';
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

  const header = createRef<Txt>();
  const anchor = createRef<Txt>();
  const say = (text: string) => anchor().text(text);

  // b1：内存框里的小树
  const g1 = createRef<Node>();
  const g1box = createRef<Rect>();
  const g1tree = createRef<Node>();
  const g1q = createRef<Txt>();
  // b2：两条路
  const g2 = createRef<Node>();
  const g2log = createRef<Rect>();
  const g2btree = createRef<Rect>();
  // b3：时间线
  const g3 = createRef<Node>();
  const g3line = createRef<Line>();
  const g3y1970 = createRef<Txt>();
  const g3ten = createRef<Txt>();
  const g3today = createRef<Txt>();
  const g3rel = createRef<Rect>();
  const g3non = createRef<Rect>();
  // b4：两行排好序的键
  const g4 = createRef<Node>();
  const g4row1 = [0, 1, 2, 3, 4].map(() => createRef<Rect>());
  const g4row2 = [0, 1, 2, 3, 4].map(() => createRef<Rect>());
  const g4lab1 = createRef<Txt>();
  const g4lab2 = createRef<Txt>();
  // b5：变长段 vs 固定页 vs 磁盘块
  const g5 = createRef<Node>();
  const g5segs = [0, 1, 2, 3].map(() => createRef<Rect>());
  const g5mb = createRef<Txt>();
  const g5pages = [0, 1, 2, 3, 4, 5].map(() => createRef<Rect>());
  const g5disk = [0, 1, 2, 3, 4, 5].map(() => createRef<Rect>());
  const g5diskLab = createRef<Txt>();
  // b6：页间指针
  const g6 = createRef<Node>();
  const g6a = createRef<Rect>();
  const g6addr = createRef<Txt>();
  const g6arr = createRef<Line>();
  const g6b = createRef<Rect>();
  const g6ptr = createRef<Rect>();
  const g6disk = createRef<Rect>();
  const g6mem = createRef<Rect>();
  // b7：页搭成的树
  const g7 = createRef<Node>();
  const g7root = createRef<Rect>();
  const g7c1 = createRef<Rect>();
  const g7c2 = createRef<Rect>();
  const g7a1 = createRef<Line>();
  const g7a2 = createRef<Line>();
  // b8/b9：根页与范围边界
  const g8 = createRef<Node>();
  const g8root = createRef<Node>();
  const g8child1 = createRef<Rect>();
  const g8child2 = createRef<Rect>();
  const g8a1 = createRef<Line>();
  const g8a2 = createRef<Line>();
  const g8range = createRef<Txt>();
  const g8hl = createRef<Rect>();
  // b10–b13：原图 3-6
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

  view.add(
    <>
      <Txt
        ref={header}
        position={[-SAFE.halfW, -SAFE.halfH]}
        offset={[-1, -1]}
        fontSize={SIZE.label}
        fill={T.muted}
        fontFamily={FONT.sans}
        text={'B 树：把数据切成页'}
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

      {/* b1：内存框里的小树 */}
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

      {/* b2：两条路 */}
      <Node ref={g2} opacity={0}>
        <Rect ref={g2log} position={[-290, -60]} width={380} height={160} radius={16} fill={T.card} stroke={T.line} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'变长段'} />
          <Txt position={[0, 45]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'日志结构那一路'} />
        </Rect>
        <Rect ref={g2btree} position={[290, -60]} width={380} height={160} radius={16} fill={T.card} stroke={T.blue} lineWidth={3} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'固定页'} />
          <Txt position={[0, 45]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'B 树'} />
        </Rect>
      </Node>

      {/* b3：时间线 */}
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

      {/* b4：两行排好序的键 */}
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

      {/* b5：变长段 vs 固定页 vs 磁盘块 */}
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

      {/* b6：页间指针 */}
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

      {/* b7：页搭成的树 */}
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

      {/* b8/b9：根页与范围边界 */}
      <Node ref={g8} opacity={0}>
        <Node ref={g8root} position={[0, -100]} opacity={0}>
          <Page cells={ROOT_CELLS} id={'g8root'} />
        </Node>
        <Line ref={g8a1} points={[[-200, -78], [-300, 80]]} stroke={T.yellow} lineWidth={3} endArrow opacity={0} />
        <Line ref={g8a2} points={[[200, -78], [300, 80]]} stroke={T.yellow} lineWidth={3} endArrow opacity={0} />
        <Rect ref={g8child1} position={[-300, 140]} width={220} height={80} radius={14} fill={T.card} stroke={T.line} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'一段连续的键'} />
        </Rect>
        <Rect ref={g8child2} position={[300, 140]} width={220} height={80} radius={14} fill={T.card} stroke={T.line} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'一段连续的键'} />
        </Rect>
        <Txt ref={g8range} position={[0, -170]} fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.mono} text={'200 ≤ key < 300'} opacity={0} />
        <Rect ref={g8hl} position={[-52, -100]} width={52} height={50} stroke={T.yellow} lineWidth={3} opacity={0} />
      </Node>

      {/* b10–b13：原图 3-6 */}
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
      </Node>
    </>
  );

  say('内存装不下');
  yield* beat('b1a', all(g1().opacity(1, 0.5), g1tree().scale(1.1, 1.2)));

  say('树怎么长还不倒？');
  yield* beat('b1b', all(g1q().opacity(1, 0.4), g1tree().scale(1.18, 1.2)));

  say('最常用的是 B 树');
  yield* beat('b2',
    all(g1().opacity(0, 0.5), g2().opacity(1, 0.5)),
    at('日志结构', g2log().opacity(1, 0.5)),
    at('最常用', g2log().opacity(0.35, 0.5)),
    at('B 树', g2btree().opacity(1, 0.5)),
  );

  say('1970 年提出');
  yield* beat('b3a',
    all(g2().opacity(0, 0.5), g3().opacity(1, 0.5)),
    at('一九七零年', all(g3line().opacity(1, 0.5), g3y1970().opacity(1, 0.4))),
    at('不到十年', g3ten().opacity(1, 0.5)),
  );

  say('今天还在用');
  yield* beat('b3b',
    at('今天', all(g3today().opacity(1, 0.5), g3rel().opacity(1, 0.5))),
    at('许多非关系库', g3non().opacity(1, 0.5)),
    g3().scale(1.02, beat.dur('b3b')),
  );

  say('同是排序，哲学不同');
  yield* beat('b4',
    all(g3().opacity(0, 0.5), g4().opacity(1, 0.5)),
    at('排好序', chain(g4row1[0]().opacity(1, 0.3), g4row1[1]().opacity(1, 0.3), g4row1[2]().opacity(1, 0.3), g4row1[3]().opacity(1, 0.3), g4row1[4]().opacity(1, 0.3), g4row2[0]().opacity(1, 0.3), g4row2[1]().opacity(1, 0.3), g4row2[2]().opacity(1, 0.3), g4row2[3]().opacity(1, 0.3), g4row2[4]().opacity(1, 0.3))),
    at('设计哲学', all(g4lab1().opacity(1, 0.5), g4lab2().opacity(1, 0.5))),
    g4().scale(1.02, beat.dur('b4')),
  );

  say('切成变长的段');
  yield* beat('b5a',
    all(g4().opacity(0, 0.5), g5().opacity(1, 0.5)),
    at('切成', chain(g5segs[0]().opacity(1, 0.3), g5segs[1]().opacity(1, 0.3), g5segs[2]().opacity(1, 0.3), g5segs[3]().opacity(1, 0.3))),
  );

  say('几兆字节一段');
  yield* beat('b5d',
    at('几兆字节', g5mb().opacity(1, 0.5)),
    at('顺序写', g5mb().fill(T.green, 0.4)),
  );

  say('固定页，4 KB');
  yield* beat('b5b',
    at('固定大小', chain(g5pages[0]().opacity(1, 0.3), g5pages[1]().opacity(1, 0.3), g5pages[2]().opacity(1, 0.3), g5pages[3]().opacity(1, 0.3), g5pages[4]().opacity(1, 0.3), g5pages[5]().opacity(1, 0.3))),
    at('四 KB', g5pages[2]().stroke(T.yellow, 0.4)),
  );

  say('贴着硬件走');
  yield* beat('b5c',
    at('磁盘', chain(g5disk[0]().opacity(1, 0.3), g5disk[1]().opacity(1, 0.3), g5disk[2]().opacity(1, 0.3), g5disk[3]().opacity(1, 0.3), g5disk[4]().opacity(1, 0.3), g5disk[5]().opacity(1, 0.3), g5diskLab().opacity(1, 0.4))),
    at('贴着硬件', g5().scale(1.02, 1.5)),
  );

  say('页能指向页');
  yield* beat('b6a',
    all(g5().opacity(0, 0.5), g6().opacity(1, 0.5)),
    at('地址', all(g6a().opacity(1, 0.5), g6addr().opacity(1, 0.4))),
    at('指向另一页', all(g6arr().opacity(1, 0.5), g6b().opacity(1, 0.5))),
  );

  say('像一枚指针');
  yield* beat('b6b', all(g6ptr().opacity(1, 0.5)));

  say('在磁盘上，不在内存里');
  yield* beat('b6c',
    at('磁盘上', all(g6disk().opacity(1, 0.5), g6mem().opacity(1, 0.5))),
    at('不在内存里', all(g6mem().opacity(0.35, 0.8), g6disk().scale(1.04, 1.5))),
  );

  say('页搭成的树');
  yield* beat('b7',
    all(g6().opacity(0, 0.5), g7().opacity(1, 0.5)),
    at('搭起来', chain(g7root().opacity(1, 0.4), g7a1().opacity(1, 0.4), g7a2().opacity(1, 0.4), g7c1().opacity(1, 0.4), g7c2().opacity(1, 0.4))),
  );

  say('从根页开始查');
  yield* beat('b8',
    all(g7().opacity(0, 0.5), g8().opacity(1, 0.5)),
    at('根页开始', g8root().opacity(1, 0.5)),
    at('子页引用', all(g8a1().opacity(1, 0.4), g8a2().opacity(1, 0.4))),
    at('一段连续的键范围', all(g8child1().opacity(1, 0.5), g8child2().opacity(1, 0.5))),
    g8().scale(1.02, beat.dur('b8')),
  );

  say('边界键定范围');
  yield* beat('b9',
    at('范围边界', all(g8range().opacity(1, 0.5), g8hl().opacity(1, 0.4))),
    at('两边的键', g8hl().lineWidth(5, 0.4)),
  );

  say('根页：100 到 500');
  yield* beat('b10a',
    all(g8().opacity(0, 0.5), fig().opacity(1, 0.5)),
    at('根页长这样', figRoot().opacity(1, 0.5)),
    at('五百', all(figSib().opacity(1, 0.5), figMid().opacity(0.4, 0.5), figLeaf().opacity(0.4, 0.5))),
    fig().scale(1.015, beat.dur('b10a')),
  );

  say('200 到 300，往下走');
  yield* beat('b10b',
    at('二百到三百', all(lab200().opacity(1, 0.5), hl().opacity(1, 0.4))),
    at('往下走', all(arrMid().opacity(1, 0.6), figMid().opacity(1, 0.5), lab100().opacity(1, 0.5), arrSib().opacity(1, 0.5), dots().opacity(1, 0.4))),
  );

  say('再细分');
  yield* beat('b10c',
    at('细分成', all(dots2().opacity(1, 0.5), figMid().scale(1.03, 1.0))),
  );

  say('250 到 270，往下走');
  yield* beat('b10d',
    at('二百五十到二百七十', all(lab250().opacity(1, 0.5), hl().position([283, -105], 0.6))),
    at('叶页', all(arrLeaf().opacity(1, 0.6), figLeaf().opacity(1, 0.5))),
  );

  say('叶页：键和值');
  yield* beat('b11a',
    all(hl().position([-102, 45], 0.4), hl().width(62, 0.4)),
    at('二百五十一', hl().position([-2, 45], 0.5)),
    at('二百五十二', hl().position([98, 45], 0.5)),
    at('二百五十三', hl().position([198, 45], 0.5)),
    at('二百五十四', hl().position([298, 45], 0.5)),
  );

  say('251 的值在这儿');
  yield* beat('b11b',
    all(hl().position([-2, 45], 0.5), hl2().opacity(1, 0.4)),
  );

  say('值也可是引用');
  yield* beat('b11c',
    hl2().opacity(0, 0.4),
    at('值所在页', refLine().opacity(1, 0.5)),
    at('引用', refChip().opacity(1, 0.5)),
    refChip().scale(1.03, beat.dur('b11c')),
  );

  say('分支因子是 6');
  yield* beat('b12',
    chain(
      hl().position([-260, -235], 0.5),
      hl().position([-156, -235], 0.5),
      hl().position([-52, -235], 0.5),
      hl().position([52, -235], 0.5),
      hl().position([156, -235], 0.5),
      hl().position([260, -235], 0.5),
    ),
    at('分支因子', all(refChip().opacity(0, 0.4), refLine().opacity(0, 0.4))),
  );

  say('实际通常几百');
  yield* beat('b13',
    at('几百', chain(fewStrip[0]().opacity(1, 0.15), fewStrip[1]().opacity(1, 0.15), fewStrip[2]().opacity(1, 0.15), fewStrip[3]().opacity(1, 0.15), fewStrip[4]().opacity(1, 0.15), fewStrip[5]().opacity(1, 0.15), fewStrip[6]().opacity(1, 0.15), fewStrip[7]().opacity(1, 0.15), fewStrip[8]().opacity(1, 0.15), fewStrip[9]().opacity(1, 0.15), fewStrip[10]().opacity(1, 0.15), fewStrip[11]().opacity(1, 0.15))),
    at('多少空间', fig().scale(1.02, 1.5)),
  );
});
