// 技法图库 · 结构类（s1–s12）。每段用一个真实的小机制演一种 Motion Canvas 手法，数据都是具体的：
//   A  Code 逐行高亮 + 信号驱动的指针   —— 稀疏索引里的二分查找（s1–s4）
//   B  reparent 换父节点 + 响应式连线    —— B+ 树叶子页分裂（s5–s7）
//   C  Layout 弹性排版、动画只改尺寸     —— 表里插入一行、删除一行（s8–s9）
//   D  createComputed 派生量 + 圆弧 + Latex 公式变形 —— 一致性哈希加节点（s10–s12）
// 手法说明、适用场景见 references/techniques.md；分镜见 ../beats.md。
import {Circle, Code, Latex, Layout, Line, Node, Rect, Txt, lines, makeScene2D} from '@motion-canvas/2d';
import {
  SimpleSignal,
  Vector2,
  all,
  chain,
  createComputed,
  createRef,
  createSignal,
  easeInOutCubic,
  sequence,
  waitFor,
} from '@motion-canvas/core';
import {at, makeBeats} from '../../lib/beats';
import {Counter, KV} from '../../lib/schemas';
import {FONT, SAFE, SIZE, T} from '../../lib/theme';
import timeline from '../../timeline/example-mc-gallery.json';

const mono = (text: string | (() => string), p: [number, number], o: {size?: number; fill?: string | (() => string); offset?: [number, number]} = {}) =>
  new Txt({position: p, offset: o.offset ?? [0, 0], fontSize: o.size ?? SIZE.label, fontFamily: FONT.mono, fill: o.fill ?? T.text, text});
const xy = (v: Vector2): [number, number] => [v.x, v.y];
const sans = (text: string, p: [number, number], o: {size?: number; fill?: string; offset?: [number, number]} = {}) =>
  new Txt({position: p, offset: o.offset ?? [0, 0], fontSize: o.size ?? SIZE.label, fontFamily: FONT.sans, fill: o.fill ?? T.muted, text});

export default makeScene2D(function* (view) {
  view.fill(T.bg);
  const beat = makeBeats(timeline);
  const caption = createRef<Txt>();
  const technique = createRef<Txt>();
  view.add(
    <>
      <Txt position={[-SAFE.halfW, -SAFE.halfH]} offset={[-1, -1]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'技法图库 · 结构'} />
      <Txt ref={technique} position={[SAFE.halfW, -SAFE.halfH]} offset={[1, -1]} fontSize={SIZE.label} fill={T.purple} fontFamily={FONT.sans} text={''} />
      <Txt ref={caption} position={[0, 290]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={''} />
    </>,
  );
  const say = (s: string) => caption().text(s);
  const tech = (s: string) => technique().text(`手法：${s}`);

  // ======== A：Code 逐行高亮 + 信号驱动的指针 ========
  const A = new Node({});
  view.add(A);
  const keys = ['handbag', 'handcuffs', 'handful', 'handiwork', 'handoff', 'handsome', 'handwriting'];
  const xs = (v: number) => (v - 3) * 162;
  const ROW_Y = -190;
  const chips = keys.map(k => new KV(k, '', 'key'));
  const target = new KV('找 handoff', '', 'key', {w: 180, tone: T.yellow});
  A.add([...chips.map(c => c.node), target.node]);

  // 三个指针都是信号：补间一个数，指针位置、范围外的块变暗、变量面板全部跟着变
  const lo = createSignal(0);
  const hi = createSignal(6);
  const mid = createSignal(3);
  const ptr = (name: string, v: SimpleSignal<number>, y: number, color: string) =>
    new Txt({x: () => xs(v()), y, fontSize: SIZE.min, fontFamily: FONT.mono, fill: color, text: name, opacity: 0});
  const pLo = ptr('lo', lo, ROW_Y + 44, T.blue);
  const pMid = ptr('mid', mid, ROW_Y + 70, T.yellow);
  const pHi = ptr('hi', hi, ROW_Y + 96, T.blue);
  A.add([pLo, pMid, pHi]);

  const SRC = `def find(keys, k):
    lo, hi = 0, len(keys) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if keys[mid] == k: return mid
        if keys[mid] < k: lo = mid + 1
        else: hi = mid - 1
    return None`;
  const code = createRef<Code>();
  A.add(<Code ref={code} code={SRC} fontSize={20} fontFamily={FONT.mono} fill={T.text} position={[-560, 120]} offset={[-1, 0]} opacity={0} />);

  const vars = mono(() => `lo = ${Math.round(lo())}   mid = ${Math.round(mid())}   hi = ${Math.round(hi())}`, [140, 40], {offset: [-1, 0]});
  const cmp = sans('', [140, 90], {offset: [-1, 0], fill: T.text});
  const compares = new Counter([140, 140], '比较了 ', ' 次', {offset: [-1, 0]});
  const note = sans('', [140, 190], {offset: [-1, 0], fill: T.yellow});
  vars.opacity(0);
  A.add([vars, cmp, compares.node, note]);

  tech('Code 逐行高亮 + 信号驱动的指针');
  say('二分查找：代码和数据一起走');
  yield* beat(
    's1',
    at('二分查找', code().opacity(1, 0.6)),
    at('上面是排好序的键', sequence(0.12, ...chips.map((c, i) => c.appear([xs(i), ROW_Y], 0.4)))),
    at('要找的是', target.appear([0, ROW_Y - 62], 0.4)),
  );
  // 块出现之后，不透明度改成由 lo / hi 派生：范围外的键自动变暗
  chips.forEach((c, i) => c.node.opacity(() => (i >= lo() - 0.01 && i <= hi() + 0.01 ? 1 : 0.3)));

  say('排除左半边');
  yield* beat(
    's2',
    at('lo 和 hi', all(pLo.opacity(1, 0.4), pHi.opacity(1, 0.4), vars.opacity(1, 0.4), code().selection(lines(1, 2), 0.4))),
    at('mid 取中间', all(pMid.opacity(1, 0.4), code().selection(lines(3), 0.4))),
    at('handiwork 比', chain(all(chips[3].flash(T.yellow, 0.3), cmp.text('handiwork < handoff', 0), compares.node.opacity(1, 0.3), compares.bump()), code().selection(lines(5), 0.4))),
    at('左半边', lo(4, 1.0, easeInOutCubic)),
  );

  say('排除右半边');
  yield* beat(
    's3',
    at('再取中间', all(code().selection(lines(3), 0.4), mid(5, 0.8, easeInOutCubic))),
    at('handsome 比', chain(all(chips[5].flash(T.yellow, 0.3), cmp.text('handsome > handoff', 0), compares.bump()), code().selection(lines(6), 0.4))),
    at('右边也排除', hi(4, 1.0, easeInOutCubic)),
  );

  say('第三次命中：对数级');
  yield* beat(
    's4',
    at('第三次', all(code().selection(lines(3, 4), 0.4), mid(4, 0.8, easeInOutCubic))),
    at('命中', all(chips[4].node.stroke(T.green, 0.4), cmp.text('handoff == handoff → 找到', 0), cmp.fill(T.green, 0.3), compares.bump(T.green))),
    at('键多十倍', note.text('70 个键：最多比 7 次', 0.6)),
  );

  // ======== B：reparent + 响应式连线 —— B+ 树叶子页分裂 ========
  const B = new Node({opacity: 0});
  view.add(B);
  const CW = 60;
  const STEP = 68;
  const cell = (v: number, tone: string = T.blue) =>
    new Rect({width: CW, height: 44, radius: 6, fill: T.card, stroke: tone, lineWidth: 2, children: [mono(String(v), [0, 0])]});
  const frameW = (n: number) => n * CW + (n - 1) * 8 + 20;
  const slotX = (j: number, n: number) => (j - (n - 1) / 2) * STEP;

  /** 一页：外框宽度由键数 n（信号）决定，键是这一页节点的子节点。 */
  class Page {
    readonly node: Node;
    readonly n: SimpleSignal<number>;
    readonly frame: Rect;
    cells: Rect[];
    constructor(vals: number[], x: number, y: number, tone: string = T.line) {
      this.n = createSignal(vals.length);
      this.node = new Node({position: [x, y]});
      this.frame = new Rect({width: () => frameW(this.n()), height: 64, radius: 10, stroke: tone, lineWidth: 2});
      this.cells = vals.map((v, j) => cell(v).position([slotX(j, vals.length), 0]));
      this.node.add([this.frame, ...this.cells]);
    }
    top() {
      return this.node.position().add([0, -32]);
    }
  }
  const parent = new Page([20, 40], 0, -150);
  const L0 = new Page([5, 12], -420, 60);
  const L1 = new Page([21, 25, 31, 37], -60, 60);
  const L2 = new Page([41, 58], 360, 60);
  // 父节点里第 k 个指针（第 k 个键的左边，k 可以是小数，补间时指针平滑地滑过去）
  const pointer = (k: number) => parent.node.position().add([(k - parent.n() / 2) * STEP, 32]);
  const kL2 = createSignal(2);
  const link = (from: () => Vector2, to: () => Vector2) =>
    new Line({points: () => [from(), to()], stroke: T.muted, lineWidth: 2, endArrow: true, arrowSize: 8, end: 0});
  const links = [link(() => pointer(0), () => L0.top()), link(() => pointer(1), () => L1.top()), link(() => pointer(kL2()), () => L2.top())];
  B.add([...links, parent.node, L0.node, L1.node, L2.node]);
  const cap = sans('叶子页：最多 4 个键', [-420, 140]);
  B.add(cap);

  tech('reparent 换父节点 + 端点绑定节点的连线');
  say('B+ 树：叶子页满了');
  const k33 = cell(33, T.yellow);
  k33.position([-170, -45]).opacity(0);
  B.add(k33);
  yield* beat(
    's5',
    at('B+ 树', chain(all(A.opacity(0, 0.5), B.opacity(1, 0.5)), all(...links.map(l => l.end(1, 0.6))))),
    at('插入 33', k33.opacity(1, 0.4)),
    at('已经满了', chain(
      L1.frame.stroke(T.red, 0.3),
      // 33 交给 L1：reparent 后画面位置不变，再在 L1 里补间到它的槽位；37 让一格，外框随 n 变宽
      () => k33.reparent(L1.node),
      all(L1.n(5, 0.8), L1.cells[2].x(slotX(2, 5), 0.8), L1.cells[3].x(slotX(4, 5), 0.8),
        L1.cells[0].x(slotX(0, 5), 0.8), L1.cells[1].x(slotX(1, 5), 0.8), k33.position([slotX(3, 5), 0], 0.8)),
    ), 0.6),
  );
  L1.cells.splice(3, 0, k33);

  say('分裂：后一半交给新页');
  const N = new Page([], -60 + 68, 60, T.yellow); // 新页先叠在后三个键上
  N.n(3);
  N.frame.opacity(0);
  B.add(N.node);
  const moved = L1.cells.slice(2); // 31、33、37
  yield* beat(
    's6',
    at('后一半的键', chain(
      N.frame.opacity(1, 0.5),
      () => moved.forEach(c => c.reparent(N.node)), // 换父节点：之后挪新页，键跟着走
    )),
    at('挪到右边', all(
      N.node.position([40, 60], 1.2, easeInOutCubic),
      ...moved.map((c, j) => c.position([slotX(j, 3), 0], 1.2, easeInOutCubic)),
      L1.node.position([-230, 60], 1.2, easeInOutCubic),
      L1.n(2, 1.2, easeInOutCubic),
      L1.cells[0].x(slotX(0, 2), 1.2, easeInOutCubic),
      L1.cells[1].x(slotX(1, 2), 1.2, easeInOutCubic),
      L1.frame.stroke(T.line, 0.6),
    )),
  );
  L1.cells = L1.cells.slice(0, 2);
  N.cells = moved;

  say('第一个键复制到父节点当分界');
  const up = cell(31, T.yellow);
  up.position(N.node.position().add([slotX(0, 3), 0])).opacity(0);
  B.add(up);
  const linkN = link(() => pointer(2), () => N.top());
  B.add(linkN);
  linkN.moveToBottom();
  yield* beat(
    's7',
    at('复制一份', chain(
      up.opacity(1, 0.3),
      // 父节点先让出空位（外框随 n 变宽、指针跟着滑），复制出的 31 再直着升进去，不压别的键
      all(parent.n(3, 0.8), kL2(3, 0.8), parent.cells[0].x(slotX(0, 3), 0.8), parent.cells[1].x(slotX(2, 3), 0.8)),
      up.position(parent.node.position(), 1.2, easeInOutCubic),
      () => up.reparent(parent.node),
      linkN.end(1, 0.6),
    )),
    at('比 31 小', chain(up.stroke(T.green, 0.4), waitFor(0.4), up.stroke(T.blue, 0.4))),
  );

  // ======== C：Layout 弹性排版 —— 表里插入一行、删除一行 ========
  const C = new Node({opacity: 0});
  view.add(C);
  const table = createRef<Layout>();
  const row = (id: string, name: string, city: string, o: {head?: boolean; height?: number; opacity?: number} = {}) =>
    new Rect({
      layout: true,
      direction: 'row',
      alignItems: 'center',
      width: 560,
      height: o.height ?? 44,
      radius: 6,
      clip: true,
      opacity: o.opacity ?? 1,
      fill: o.head ? T.bg : T.card,
      stroke: o.head ? T.bg : T.line,
      lineWidth: 1,
      children: [id, name, city].map(
        (s, i) => new Txt({width: [100, 230, 230][i], textAlign: 'center', fontSize: SIZE.label, fontFamily: i === 0 ? FONT.mono : FONT.sans, fill: o.head ? T.muted : T.text, text: s}),
      ),
    });
  C.add(<Layout ref={table} layout direction={'column'} gap={6} position={[60, -40]} />);
  const rows = [row('id', 'name', 'city', {head: true}), row('1', 'Alice', 'Paris'), row('2', 'Bob', 'Lima'), row('4', 'Dana', 'Oslo'), row('5', 'Erin', 'Kyiv')];
  rows.forEach(r => table().add(r));
  C.add(sans('按主键 id 排序存放', [-500, -40], {offset: [-1, 0]}));

  tech('Layout 弹性排版：动画只改高度');
  say('有序的表：插入一行');
  const carol = row('3', 'Carol', 'Rome', {height: 0, opacity: 0});
  carol.stroke(T.yellow);
  yield* beat(
    's8',
    at('表按主键', all(B.opacity(0, 0.5), C.opacity(1, 0.5))),
    at('插入 id', chain(() => table().insert(carol, 3))),
    // 只补间新行的高度：Layout 每一帧重新排版，下面的行自己往下让
    at('自动让开', all(carol.height(44, 1.0, easeInOutCubic), carol.opacity(1, 1.0))),
  );

  say('删除一行：后面的补上');
  const bob = rows[2];
  yield* beat(
    's9',
    at('删除 Bob', bob.stroke(T.red, 0.4)),
    at('补上空位', chain(all(bob.height(0, 1.0, easeInOutCubic), bob.opacity(0, 0.8)), () => bob.remove())),
  );

  // ======== D：createComputed + 圆弧 + Latex —— 一致性哈希 ========
  const D = new Node({opacity: 0});
  view.add(D);
  const O = new Vector2(-230, 0);
  const R = 170;
  const pol = (deg: number, r: number) => O.add(Vector2.fromRadians(((deg - 90) * Math.PI) / 180).scale(r)); // 0° 在正上方，顺时针
  const NODES: Record<string, {deg: number; color: string}> = {
    A: {deg: 40, color: T.blue},
    B: {deg: 130, color: T.green},
    C: {deg: 280, color: T.purple},
    D: {deg: 190, color: T.yellow},
  };
  const HS = [17, 29, 42, 58, 71, 86]; // 六个键的哈希值（0–99），角度 = h × 3.6°
  const kdeg = (i: number) => HS[i] * 3.6;
  const sweep = createSignal(130); // D 的弧扫到哪里：从 B（130°）扫到 D（190°）
  const ownerOf = (i: number) => {
    const d = kdeg(i);
    if (d > 130 && d <= sweep()) return 'D';
    let best = 'A';
    let bestDist = 999;
    for (const n of ['A', 'B', 'C']) {
      const dist = (NODES[n].deg - d + 360) % 360;
      if (dist < bestDist) [best, bestDist] = [n, dist];
    }
    return best;
  };
  const owners = HS.map((_, i) => createComputed(() => ownerOf(i)));
  const before = HS.map((_, i) => ownerOf(i));
  const movedCount = createComputed(() => owners.filter((o, i) => o() !== before[i]).length);

  const arc = (from: () => number, to: () => number, color: string, o = 1) =>
    new Circle({position: O, size: 2 * R, stroke: color, lineWidth: 10, closed: false, startAngle: () => from() - 90, endAngle: () => to() - 90, opacity: o});
  const arcs = [
    arc(() => NODES.C.deg - 360, () => NODES.A.deg, NODES.A.color),
    arc(() => NODES.A.deg, () => NODES.B.deg, NODES.B.color),
    arc(() => sweep(), () => NODES.C.deg, NODES.C.color),
    arc(() => NODES.B.deg, () => sweep(), NODES.D.color),
  ];
  const ring = new Circle({position: O, size: 2 * R, stroke: T.line, lineWidth: 2});
  D.add([ring, ...arcs.map(a => a.opacity(0))]);
  const marker = (n: string) => [
    new Circle({position: pol(NODES[n].deg, R), size: 26, fill: NODES[n].color, opacity: 0}),
    sans(n, xy(pol(NODES[n].deg, R + 38)), {size: SIZE.body, fill: NODES[n].color}).opacity(0),
  ];
  const markers = Object.fromEntries(['A', 'B', 'C', 'D'].map(n => [n, marker(n)]));
  D.add(Object.values(markers).flat());
  const keyDots = HS.map((_, i) => new Circle({position: pol(kdeg(i), R), size: 14, fill: () => NODES[owners[i]()].color, opacity: 0}));
  const keyLabs = HS.map((_, i) => mono(`k${i + 1}`, xy(pol(kdeg(i), R - 34)), {size: SIZE.min, fill: T.muted}).opacity(0));
  D.add([...keyDots, ...keyLabs]);
  D.add(sans('哈希环 0–99', xy(O)));

  // 右侧：键 → 节点，每一行的文字和颜色都由 owners 派生
  const table2 = HS.map((h, i) =>
    mono(() => `k${i + 1}  h=${String(h).padStart(2, '0')}  →  ${owners[i]()}`, [130, -170 + i * 32], {offset: [-1, 0], fill: () => NODES[owners[i]()].color}).opacity(0),
  );
  const movedTxt = sans('', [130, 40], {offset: [-1, 0], fill: T.text});
  movedTxt.text(() => `换了主人的键：${movedCount()} / 6`);
  movedTxt.opacity(0);
  D.add([...table2, movedTxt]);

  tech('createComputed 派生量 + 圆弧');
  say('一致性哈希：顺时针找第一个节点');
  yield* beat(
    's10',
    at('一致性哈希', all(C.opacity(0, 0.5), D.opacity(1, 0.5))),
    at('同一个环上', all(...arcs.slice(0, 3).map(a => a.opacity(1, 0.6)), ...['A', 'B', 'C'].flatMap(n => markers[n].map(m => m.opacity(1, 0.6))))),
    at('每个键归', chain(sequence(0.15, ...keyDots.map((d, i) => all(d.opacity(1, 0.3), keyLabs[i].opacity(1, 0.3)))), sequence(0.1, ...table2.map(t => t.opacity(1, 0.3))))),
  );

  say('加一个节点：只有一段键换主人');
  yield* beat(
    's11',
    at('加一个节点', all(...markers.D.map(m => m.opacity(1, 0.5)), arcs[3].opacity(1, 0.5), movedTxt.opacity(1, 0.5))),
    // 只补间一个数：弧、键的颜色、右边的表、计数全部由它派生
    at('只有 B 和 D', sweep(NODES.D.deg, 2.2, easeInOutCubic)),
    at('原地不动', all(...[0, 1, 3, 4, 5].map(i => keyDots[i].scale(1.4, 0.3).to(1, 0.3)))), // k3 换了主人，其余没动
  );

  tech('Latex 公式（自带 MathJax，不需要系统 LaTeX）');
  say('对比：按节点数取模');
  const formula = createRef<Latex>();
  D.add(<Latex ref={formula} tex={'{{h}}\\bmod{{3}}'} fill={T.text} height={44} position={[250, 110]} opacity={0} />);
  const barMod = new Rect({position: [130, 175], offset: [-1, 0], width: 0, height: 26, radius: 4, fill: T.red});
  const barRing = new Rect({position: [130, 220], offset: [-1, 0], width: 0, height: 26, radius: 4, fill: T.green});
  const labMod = sans('取模：5 / 6 搬家', [400, 175], {offset: [-1, 0], fill: T.red}).opacity(0);
  const labRing = sans('一致性哈希：1 / 6', [400, 220], {offset: [-1, 0], fill: T.green}).opacity(0);
  D.add([barMod, barRing, labMod, labRing]);
  yield* beat(
    's12',
    at('取模', formula().opacity(1, 0.5)),
    at('三台加到四台', formula().tex('{{h}}\\bmod{{4}}', 0.8)),
    at('五个要搬家', all(barMod.width(250, 0.8), labMod.opacity(1, 0.5))),
    at('只搬一个', all(barRing.width(50, 0.8), labRing.opacity(1, 0.5))),
  );
});
