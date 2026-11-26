// U3 r3 · 场景 3：两种压缩合并策略（c1–c16、c2b）与收尾（h5–h9），改编自 skill 示例 examples/lsm/scenes/lsm-compact.tsx。
// 图式：
//   - 先具体后抽象：按大小合并先用真实键值块演一次（同键三份只留最新），再抽象成“小段 / 中段 / 大段”三级；
//   - 键范围轴：按层合并的每一层画在同一根 a→z 的键轴上，段的位置和宽度就是它的键范围——
//     第 0 层的段互相重叠、往下每层互不重叠、挑一个段只和下一层重叠的几个合并，都能直接看出来；
//   - 计数器：读要查几个段、同一份数据写了几次盘；对比表：两种策略的取舍（示意）。
// 原文只有两句：两种策略的名字和一句话描述、谁用哪种、按层合并“更增量、占用更少磁盘空间”。
// 每层上限 10 倍、10 MB / 100 MB（LevelDB 的默认值）、四个一合、合并时临时占两份空间、读写放大的取舍是延伸，画面标“延伸”。
import {Circle, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {Vector2, all, chain, createRef, easeInOutCubic, sequence, waitFor} from '@motion-canvas/core';
import {at, makeBeats} from '../../lib/beats';
import {Counter, KV, Slots, tag} from '../../lib/schemas';
import {FONT, SAFE, SIZE, T} from '../../lib/theme';
import timeline from '../../timeline/u3.json';

const txt = (text: string, p: [number, number], o: {size?: number; fill?: string; offset?: [number, number]; bold?: boolean; mono?: boolean} = {}) =>
  new Txt({
    position: p,
    offset: o.offset ?? [0, 0],
    fontSize: o.size ?? SIZE.label,
    fontWeight: o.bold ? 700 : 400,
    fontFamily: o.mono ? FONT.mono : FONT.sans,
    fill: o.fill ?? T.text,
    text,
    opacity: 0,
  });
const box = (p: [number, number], w: number, h: number, stroke: string, o: {fill?: string; label?: string; dash?: boolean} = {}) =>
  new Rect({
    position: p,
    width: w,
    height: h,
    radius: 8,
    fill: o.fill ?? T.card,
    stroke,
    lineWidth: 2,
    lineDash: o.dash ? [8, 6] : [],
    opacity: 0,
    children: o.label ? [new Txt({fontSize: SIZE.min, fontFamily: FONT.mono, fill: T.text, text: o.label})] : [],
  });

// ---- 键范围轴（按层合并）----
const AX0 = -410;
const AXW = 990;
const X = (i: number) => AX0 + (i * AXW) / 26;
const li = (c: string) => c.charCodeAt(0) - 97;
const LY = {l0a: -205, l0b: -157, l1: -45, l2: 85};
function rangeBox(r: string, y: number, stroke: string = T.blue): Rect {
  const [s, e] = r.split('–');
  const x0 = X(li(s)) + 2;
  const x1 = X(li(e) + 1) - 2;
  const b = box([(x0 + x1) / 2, y], x1 - x0, 40, stroke);
  b.add(new Txt({position: [-(x1 - x0) / 2 + 8, 0], offset: [-1, 0], fontSize: SIZE.min, fontFamily: FONT.mono, fill: T.text, text: r}));
  return b;
}

export default makeScene2D(function* (view) {
  view.fill(T.bg);
  const beat = makeBeats(timeline);
  const world = createRef<Node>();
  const anchor = createRef<Txt>();
  const say = (text: string) => anchor().text(text);
  view.add(
    <>
      <Node ref={world} />
      <Txt
        position={[-SAFE.halfW, -SAFE.halfH]}
        offset={[-1, -1]}
        fontSize={SIZE.label}
        fill={T.muted}
        fontFamily={FONT.sans}
        text={'排好序的段：SSTable 与 LSM 树'}
      />
      <Txt ref={anchor} position={[0, 290]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={''} />
    </>,
  );
  const W = world();
  const ext = tag([SAFE.halfW, 290], '延伸 · 原文之外');
  view.add(ext);
  const fadeAll = (nodes: Node[], d = 0.5) => all(...nodes.map(n => n.opacity(0, d)));

  // ================= c1：段越攒越多 =================
  const tabs = [
    ['handful', 'handicap', 'handsome'],
    ['handcuffs', 'handiwork', 'handprinted'],
    ['handful', 'handkerchief', 'handoff'],
    ['handbag', 'handicap', 'handwaving'],
    ['handful', 'handlebars', 'handprinted'],
    ['handbag', 'handiwork', 'handwriting'],
  ];
  const segs = tabs.map((keys, i) => {
    const s = new Slots(new Vector2(-440 + i * 176, -30), 'col', 3, {cross: 150});
    s.items = keys.map(k => new KV(k, '', 'key'));
    W.add([s.frame, ...s.items.map(k => k.node)]);
    s.items.forEach((k, j) => k.node.position(s.pos(j)));
    return s;
  });
  const seen = new Set<string>();
  const stale: KV[] = [];
  for (const s of segs) for (const k of s.items) (seen.has(k.key) ? stale.push(k) : seen.add(k.key));
  const ageLine = new Line({
    points: [
      [-490, -125],
      [490, -125],
    ],
    stroke: T.line,
    lineWidth: 2,
    startArrow: true,
    endArrow: true,
    arrowSize: 8,
    opacity: 0,
  });
  const ageNew = txt('新', [-505, -125], {size: SIZE.min, fill: T.muted, offset: [1, 0]});
  const ageOld = txt('旧', [505, -125], {size: SIZE.min, fill: T.muted, offset: [-1, 0]});
  const sweep = new Line({
    points: [
      [-523, 52],
      [523, 52],
    ],
    stroke: T.yellow,
    lineWidth: 4,
    endArrow: true,
    arrowSize: 10,
    end: 0,
  });
  const sweepLab = txt('读一个键，最坏要查 6 个段', [0, 88], {size: SIZE.label, fill: T.yellow});
  W.add([ageLine, ageNew, ageOld, sweep, sweepLab]);
  const segIn = (s: Slots) => all(s.frame.opacity(1, 0.4), ...s.items.map(k => k.node.opacity(1, 0.4)));
  for (const s of segs.slice(3)) {
    s.frame.opacity(1);
    s.items.forEach(k => k.node.opacity(1));
  }

  say('段越攒越多');
  yield* beat(
    'c1',
    all(ageLine.opacity(1, 0.4), ageNew.opacity(1, 0.4), ageOld.opacity(1, 0.4)),
    at('段越攒越多', sequence(0.5, ...[2, 1, 0].map(i => segIn(segs[i])))),
    at('读要查的段', all(sweep.end(1, 1.4), sweepLab.opacity(1, 0.6))),
    at('被覆盖的旧值', sequence(0.15, ...stale.map(k => k.stale(0.4)))),
  );

  // ================= c2：两种做法 =================
  const c1Nodes: Node[] = [ageLine, ageNew, ageOld, sweep, sweepLab, ...segs.flatMap(s => [s.frame, ...s.items.map(k => k.node)])];
  const cardL = box([-290, -30], 520, 300, T.blue, {fill: T.card});
  const cardR = box([290, -30], 520, 300, T.green, {fill: T.card});
  const cardLT = txt('按大小合并', [-290, -140], {size: SIZE.body, bold: true});
  const cardRT = txt('按层合并', [290, -140], {size: SIZE.body, bold: true});
  // 左卡预览：一级比一级大的段
  const prevL = [
    box([-470, 60], 40, 30, T.blue),
    box([-420, 60], 40, 30, T.blue),
    box([-330, 55], 100, 40, T.blue),
    box([-160, 50], 200, 50, T.blue),
  ];
  // 右卡预览：第 0 层重叠、往下切成互不重叠的小段
  const prevR = [
    box([200, -50], 180, 22, T.purple),
    box([260, -20], 200, 22, T.purple),
    ...[0, 1, 2, 3].map(i => box([110 + 30 + i * 103, 30], 99, 26, T.green)),
    ...[0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => box([62 + 23 + i * 46, 80], 42, 26, T.green)),
  ];
  W.add([cardL, cardR, cardLT, cardRT, ...prevL, ...prevR]);
  say('后台合并：两种做法');
  yield* beat(
    'c2',
    chain(fadeAll(c1Nodes, 0.5), all(cardL.opacity(1, 0.5), cardR.opacity(1, 0.5))),
    at('按大小合并', all(cardLT.opacity(1, 0.5), sequence(0.2, ...prevL.map(b => b.opacity(1, 0.4))))),
    at('按层合并', all(cardRT.opacity(1, 0.5), sequence(0.08, ...prevR.map(b => b.opacity(1, 0.3))))),
  );

  // ================= c3–c5：按大小合并，先用真实的键演一次 =================
  const c2Nodes: Node[] = [cardL, cardR, cardLT, cardRT, ...prevL, ...prevR];
  const inData = [
    [['handbag', '8786'], ['handful', '40308']],
    [['handful', '42307'], ['handiwork', '16912']],
    [['handcuffs', '2729'], ['handoff', '5741']],
    [['handful', '44662'], ['handsome', '86478']],
  ];
  const ins = inData.map((kv, i) => {
    // P1-5（r5，修法 a）：段按最新在最左排开（段 4、段 3、段 2、段 1 左到右），与 w14“越往左越新”一致
    const s = new Slots(new Vector2(-342 + (3 - i) * 228, -175), 'col', 2, {title: i === 3 ? '段 4（最新）' : `段 ${i + 1}`});
    s.items = kv.map(([k, v]) => new KV(k, v));
    W.add([s.frame, s.title, ...s.items.map(k => k.node)]);
    s.items.forEach((k, j) => k.node.position(s.pos(j)));
    return s;
  });
  const insLTR = [...ins].reverse(); // 屏幕上左到右：段 4（最新）、段 3、段 2、段 1
  const out = new Slots(new Vector2(0, 75), 'col', 6, {title: '合并后的段'});
  W.add([out.frame, out.title]);
  const pick = (seg: number, key: string) => ins[seg].find(key)!;
  // 抄进输出段后描边复位成蓝色：赢下来的块不留黄/绿标记，输出段里六块颜色一致
  const take = (kv: KV) => chain(kv.flash(T.yellow, 0.05), out.append(kv, 0.7), kv.node.stroke(T.blue, 0.2));

  // c2b：合并像归并排序——先看每段第一个键，最小的先抄进输出段（r3 新增）
  // P1-3（r5）：四段首键同时亮起并保持（不再一闪而过），最小的 handbag 描边变绿 +“最小”标注，
  // 真的抄进输出段；念到“再重复”时段 1 新的首键也亮起，第二小的 handcuffs 描边变绿（c3 抄进去）。
  const smallestLab = txt('最小', [480, -196], {size: SIZE.label, fill: T.green, bold: true});
  W.add(smallestLab);
  say('看首键，抄最小的');
  yield* beat(
    'c2b',
    chain(fadeAll(c2Nodes, 0.4), sequence(0.25, ...insLTR.map(s => all(s.show(0.4), ...s.items.map(k => k.node.opacity(1, 0.4)))))),
    at('第一个键', all(...ins.map(s => s.items[0].node.stroke(T.yellow, 0.4)))),
    at('最小的', all(pick(0, 'handbag').node.stroke(T.green, 0.4), smallestLab.opacity(1, 0.4), out.show(0.3))),
    at('抄进输出段', all(take(pick(0, 'handbag')), smallestLab.opacity(0, 0.3))),
    at('再重复', all(pick(0, 'handful').node.stroke(T.yellow, 0.3), pick(2, 'handcuffs').node.stroke(T.green, 0.4))),
    // P2-#17（r6）：同键多份时留最新那段的——段 4（最新）框描黄闪
    at('最新那段', chain(ins[3].frame.stroke(T.yellow, 0.3), ins[3].frame.stroke(T.line, 0.4))),
  );

  say('四个差不多大的段 → 一个');
  yield* beat(
    'c3',
    at('四个', sequence(0.15, ...insLTR.map(s => chain(s.frame.stroke(T.yellow, 0.2), s.frame.stroke(T.line, 0.4))))),
    // P2-5（r5）：handcuffs 是第二小的，在 c3“并成一个”时走进输出段——不再是 c4 开头无声走进
    at('并成一个', take(pick(2, 'handcuffs'))),
  );

  const fuls = [pick(0, 'handful'), pick(1, 'handful'), pick(3, 'handful')];
  say('同一个键：只留最新的');
  yield* beat(
    'c4',
    at('handful', all(...fuls.map(k => k.flash(T.yellow, 0.8)))),
    at('只留最新', chain(all(fuls[0].stale(0.4), fuls[1].stale(0.4)), take(fuls[2])), 0.4),
  );

  // 抽象成三级：小段 / 中段 / 大段
  const tierY = [-170, -20, 140];
  const tierLab = ['小段', '中段', '大段'].map((t, i) => txt(t, [-560, tierY[i]], {size: SIZE.label, fill: T.muted, offset: [-1, 0]}));
  const mids = [0, 1, 2, 3].map(i => box([-350 + i * 125, tierY[1]], 110, 50, T.blue, {label: i === 0 ? '6 个键' : ''}));
  const big = box([-115, tierY[2]], 480, 60, T.blue);
  const smalls = [0, 1].map(i => box([-370 + i * 60, tierY[0]], 50, 40, T.blue));
  W.add([...tierLab, ...mids, big, ...smalls]);
  // P2-5（r5）：收尾小结——输出段 6 块齐全后闪一下 +“六个键都进来了，两份旧值丢掉了”，8 → 6 + 2 的账算清
  const sumLab = txt('六个键都进来了，两份旧值丢掉了', [0, 250], {size: SIZE.label, fill: T.yellow});
  W.add(sumLab);
  const outNodes = () => [out.frame, out.title, sumLab, ...out.items.map(k => k.node), ...ins.flatMap(s => [s.frame, s.title, ...s.items.map(k => k.node)])];

  say('一级一级往上长');
  yield* beat(
    'c5',
    at('并出来的段', sequence(0.25, take(pick(1, 'handiwork')), take(pick(2, 'handoff')), take(pick(3, 'handsome')))),
    at('六个键都进来了', all(out.frame.stroke(T.yellow, 0.4), sumLab.opacity(1, 0.5))),
    // P2-6（r5）：中段框逐个出现，配旁白“过一段时间，又攒出三个这样的段”——攒够四个是随时间积累的
    // 等最后一个块落位再淡出：一边飞一边消失，观众看不清它去了哪（QA fast-move 报出来的）
    at('又攒出', chain(waitFor(0.3), all(fadeAll(outNodes(), 0.4), tierLab[1].opacity(1, 0.4), mids[0].opacity(1, 0.5)))),
    at('大段也攒够四个', sequence(0.3, ...mids.slice(1).map(m => m.opacity(1, 0.3)))),
    at(
      '再并成更大的段',
      chain(
        all(...mids.map((m, i) => m.position([[-295, -175, -55, 65][i], tierY[2]], 0.8, easeInOutCubic)), tierLab[2].opacity(1, 0.4)),
        all(...mids.map(m => m.opacity(0, 0.3)), big.opacity(1, 0.3)),
      ),
    ),
    at('一级一级', all(tierLab[0].opacity(1, 0.4), sequence(0.2, ...smalls.map(s => s.opacity(1, 0.3))))),
  );

  // c6：代价一：同一个键散在几级里
  const mid2 = box([-350, tierY[1]], 110, 50, T.blue);
  W.add(mid2);
  const hf = [
    new KV('handful', '', 'key', {w: 110, tone: T.yellow}),
    new KV('handful', '', 'key', {w: 110}),
    new KV('handful', '', 'key', {w: 110}),
  ];
  hf.forEach(k => W.add(k.node));
  const hfAt: [number, number][] = [
    [-235, tierY[0]],
    [-235, tierY[1]],
    [200, tierY[2]],
  ];
  // P2-7（r5）：三块带值并标新旧（小段最新 → 大段最旧），与 P1-4 的键值统一一并做
  const hfLab = [
    txt('44662 · 最新', [-110, tierY[0]], {size: SIZE.min, fill: T.green}),
    txt('42307 · 较新', [-110, tierY[1]], {size: SIZE.min, fill: T.yellow}),
    txt('40308 · 最旧', [330, tierY[2]], {size: SIZE.min, fill: T.muted}),
  ];
  W.add(hfLab);
  const lvl = new Counter([140, -170], '读 handful：查了 ', ' 级', {size: SIZE.label, offset: [-1, 0]});
  W.add(lvl.node);
  // B8：上界标签（一个键最多散在 3 级里，读最多查 3 个段）
  const c6bound = txt('一个键最多散在 3 级里，读最多查 3 个段', [140, -132], {size: SIZE.label, fill: T.yellow, offset: [-1, 0]});
  W.add(c6bound);
  say('代价：读要多查几级');
  yield* beat(
    'c6',
    mid2.opacity(1, 0.4),
    at('新旧值', sequence(0.3, ...hf.map((k, i) => all(k.appear(hfAt[i], 0.4), hfLab[i].opacity(1, 0.4))))),
    at('读最多查', all(chain(lvl.node.opacity(1, 0.3), ...hf.map(k => all(k.flash(T.yellow, 0.05), lvl.bump()))), c6bound.opacity(1, 0.5))),
  );

  // c7：代价二：合并时临时占两份空间
  const baseY = 90;
  const colIn = new Rect({position: [380, baseY], offset: [0, 1], width: 70, height: 140, radius: 6, fill: T.blue, opacity: 0});
  const colOut = new Rect({position: [470, baseY], offset: [0, 1], width: 70, height: 0, radius: 6, fill: T.purple, opacity: 0});
  const colInLab = txt('旧段', [380, baseY + 22], {size: SIZE.min, fill: T.muted});
  const colOutLab = txt('新段', [470, baseY + 22], {size: SIZE.min, fill: T.muted});
  const spaceTitle = txt('合并这部分数据时的磁盘占用', [425, -95], {size: SIZE.min, fill: T.muted});
  const twice = txt('两份', [425, -70], {size: SIZE.label, fill: T.yellow, bold: true});
  W.add([colIn, colOut, colInLab, colOutLab, spaceTitle, twice]);
  say('代价：临时占两份空间');
  yield* beat(
    'c7',
    all(lvl.node.opacity(0, 0.4), c6bound.opacity(0, 0.4), ext.opacity(1, 0.5)),
    at('合并期间', all(spaceTitle.opacity(1, 0.4), colIn.opacity(1, 0.4), colInLab.opacity(1, 0.4), colOut.opacity(1, 0.4), colOutLab.opacity(1, 0.4))),
    at('同时存在', colOut.height(140, 1.4, easeInOutCubic)),
    at('临时', twice.opacity(1, 0.4)),
    at('两份空间', all(colIn.stroke(T.yellow, 0.3), colOut.stroke(T.yellow, 0.3), colIn.lineWidth(3, 0.3), colOut.lineWidth(3, 0.3))),
    // P2-#19（r6）：合并完成就换上新段，旧段删掉——旧段柱变淡
    at('旧段删掉', all(colIn.opacity(0.25, 0.5), colInLab.opacity(0.25, 0.5))),
  );

  // ================= c8–c14：按层合并，画在同一根键轴上 =================
  const sizeNodes: Node[] = [...tierLab, ...mids, big, ...smalls, mid2, ...hf.map(k => k.node), ...hfLab, lvl.node, colIn, colOut, colInLab, colOutLab, spaceTitle, twice];
  const axis = new Line({
    points: [
      [X(0), -250],
      [X(26), -250],
    ],
    stroke: T.line,
    lineWidth: 2,
    endArrow: true,
    arrowSize: 8,
    opacity: 0,
  });
  const axA = txt('a', [X(0) - 14, -250], {size: SIZE.min, fill: T.muted, offset: [1, 0], mono: true});
  const axZ = txt('键 → z', [X(26) - 4, -272], {size: SIZE.min, fill: T.muted, offset: [1, 0]});
  const lab0 = txt('第 0 层', [-580, (LY.l0a + LY.l0b) / 2], {offset: [-1, 0], fill: T.muted});
  // P2-#20（r6）：第 0 层不按 MB 限，按文件数触发（LevelDB doc/impl.md：第 0 层触发靠文件数）
  const cap0 = txt('不按 MB 限，按文件数触发', [-580, LY.l0b + 24], {size: SIZE.min, offset: [-1, 0], fill: T.muted});
  const lab1 = txt('第 1 层', [-580, LY.l1 - 12], {offset: [-1, 0], fill: T.muted});
  const cap1 = txt('上限 10 MB', [-580, LY.l1 + 16], {size: SIZE.min, offset: [-1, 0], fill: T.muted});
  const lab2 = txt('第 2 层', [-580, LY.l2 - 12], {offset: [-1, 0], fill: T.muted});
  const cap2 = txt('上限 100 MB', [-580, LY.l2 + 16], {size: SIZE.min, offset: [-1, 0], fill: T.muted});
  const l0 = [rangeBox('b–r', LY.l0a, T.purple), rangeBox('d–w', LY.l0b, T.purple)];
  const overlap = new Rect({
    key: 'qa-ignore-overlap-band',
    position: [(X(li('d')) + X(li('r') + 1)) / 2, (LY.l0a + LY.l0b) / 2],
    width: X(li('r') + 1) - X(li('d')),
    height: 100,
    radius: 8,
    fill: 'rgba(251,191,36,0.22)',
    opacity: 0,
  });
  const L1R = ['a–e', 'f–j', 'k–o', 'p–z'];
  const L2R = ['a–b', 'c–d', 'e–f', 'g–h', 'i–j', 'k–l', 'm–n', 'o–p', 'q–s', 't–z'];
  const l1 = L1R.map(r => rangeBox(r, LY.l1));
  const l2 = L2R.map(r => rangeBox(r, LY.l2));
  // 竖向的引导线画在段的下面：段是不透明的，线从段后面穿过，不压字
  const guide = [li('k'), li('o') + 1].map(
    i =>
      new Line({
        points: [
          [X(i), LY.l1 - 30],
          [X(i), LY.l2 + 30],
        ],
        stroke: T.yellow,
        lineWidth: 2,
        lineDash: [6, 6],
        opacity: 0,
      }),
  );
  const hx = (X(li('h')) + X(li('h') + 1)) / 2;
  const probe = new Line({
    points: [
      [hx, -235],
      [hx, LY.l2 + 30],
    ],
    stroke: T.yellow,
    lineWidth: 2,
    lineDash: [6, 6],
    end: 0,
  });
  W.add([overlap, ...guide, probe, axis, axA, axZ, lab0, cap0, lab1, cap1, lab2, cap2, ...l0, ...l1, ...l2]);
  // B9：规则 tally 卡（右下角；每立一条规则加一行，c15 小结时六行完整呈现）
  const tallyFrame = box([485, 190], 200, 164, T.line);
  // P2-8（r5）：第 5 行改成“往下每层一段”，与本拍大字一致
  const tallyLines = ['1. 第零层重叠', '2. 下层不重叠', '3. 上限 10 倍', '4. 只挑一段', '5. 往下每层一段', '6. 写重写多次'].map((t, i) =>
    txt(t, [397, 124 + i * 24], {size: SIZE.min, fill: T.text, offset: [-1, 0]}),
  );
  W.add([tallyFrame, ...tallyLines]);
  // P2-9（r5）：每加一行，新行轻闪一次（变黄 1 秒再复原），积累可见
  const tally = (i: number) => chain(tallyLines[i].opacity(1, 0.3), tallyLines[i].fill(T.yellow, 0.2), waitFor(0.5), tallyLines[i].fill(T.text, 0.5));

  say('第 0 层：键范围互相重叠');
  yield* beat(
    'c8',
    all(fadeAll(sizeNodes, 0.5), ext.opacity(0, 0.4), tallyFrame.opacity(1, 0.5)),
    at('按层合并', all(axis.opacity(1, 0.5), axA.opacity(1, 0.5), axZ.opacity(1, 0.5))),
    at('第零层', all(lab0.opacity(1, 0.4), sequence(0.4, ...l0.map(b => b.opacity(1, 0.5))), tally(0))),
    at('互相重叠', all(overlap.opacity(1, 0.6), ...l0.map(b => b.stroke(T.yellow, 0.6)))),
  );

  say('往下：互不重叠，每层大十倍');
  yield* beat(
    'c9',
    all(...l0.map(b => b.stroke(T.purple, 0.5))),
    at('往下每一层', all(lab1.opacity(1, 0.4), sequence(0.12, ...l1.map(b => b.opacity(1, 0.4))))),
    at('互不重叠', all(lab2.opacity(1, 0.4), sequence(0.08, ...l2.map(b => b.opacity(1, 0.3))), tally(1))),
    at('十倍', all(cap1.opacity(1, 0.4), cap2.opacity(1, 0.4), cap0.opacity(1, 0.4), ext.opacity(1, 0.4), cap2.fill(T.yellow, 0.4), tally(2))),
    // P2-#20（r6）：段有大小上限（LevelDB 每 2MB 一个新文件），层越大段越多，所以越往下切得越碎
    at('段有大小上限', chain(sequence(0.08, ...l2.map(b => b.stroke(T.yellow, 0.15))), all(...l2.map(b => b.stroke(T.blue, 0.3))))),
    at('切得越碎', chain(cap2.scale(1.12, 0.2), cap2.scale(1, 0.25))),
  );

  // c10–c12：挑一个段，只和下一层重叠的几个合并
  const pickBox = l1[2]; // k–o
  const hit = [5, 6, 7].map(i => l2[i]); // k–l、m–n、o–p
  say('第 1 层超了：挑一个段');
  yield* beat(
    'c10',
    cap2.fill(T.muted, 0.3),
    at('超了上限', chain(cap1.fill(T.red, 0.3), cap1.text('超了上限', 0))),
    at('挑出', all(pickBox.stroke(T.yellow, 0.4), pickBox.position.y(LY.l1 - 8, 0.4), tally(3))),
  );

  const newHit = ['k–l', 'm–n', 'o–p'].map(r => rangeBox(r, LY.l2, T.green));
  // P2-#22（r6）：新段范围标注——三个新段合起来还是 k–p
  const newRangeLab = txt('新段：k–p', [85, 125], {size: SIZE.min, fill: T.muted});
  W.add(newHit);
  W.add(newRangeLab);
  say('只和下一层重叠的几个合并');
  yield* beat(
    'c11',
    at('重叠的那几个段', all(...guide.map(g => g.opacity(1, 0.4)), ...hit.map(b => b.stroke(T.yellow, 0.4)))),
    at('合并', chain(pickBox.position.y(LY.l2, 0.9, easeInOutCubic), all(pickBox.opacity(0, 0.3), ...hit.map(b => b.opacity(0, 0.3)), ...newHit.map(b => b.opacity(1, 0.4)), newRangeLab.opacity(1, 0.4)))),
    at('其余的段都不动', all(cap1.text('上限 10 MB', 0), cap1.fill(T.muted, 0.3), ...guide.map(g => g.opacity(0, 0.4)))),
    // P2-#22（r6）：不重叠的键也一起写进新段——新段范围标黄闪
    at('不重叠的键', chain(newRangeLab.fill(T.yellow, 0.2), newRangeLab.fill(T.muted, 0.4))),
  );

  // c12：再来一次（p–z），旧数据往下沉
  const pick2 = l1[3];
  const hit2 = [7, 8, 9].map(i => (i === 7 ? newHit[2] : l2[i])); // o–p（刚写的）、q–s、t–z
  const newHit2 = ['o–p', 'q–s', 't–z'].map(r => rangeBox(r, LY.l2, T.green));
  const sink = new Line({
    points: [
      [-430, LY.l0a],
      [-430, LY.l2],
    ],
    stroke: T.purple,
    lineWidth: 3,
    endArrow: true,
    arrowSize: 10,
    end: 0,
  });
  // P2-#22（r6）：新段范围标注——三个新段合起来是 o–z（放段上方，避开右下 tally 框）
  const newRangeLab2 = txt('新段：o–z', [371, 55], {size: SIZE.min, fill: T.muted});
  W.add([...newHit2, sink, newRangeLab2]);
  say('一次动一小块，旧数据往下沉');
  yield* beat(
    'c12',
    all(...newHit.map(b => b.stroke(T.blue, 0.5)), newRangeLab.opacity(0, 0.3)),
    at('一小块', chain(all(pick2.stroke(T.yellow, 0.3), ...hit2.map(b => b.stroke(T.yellow, 0.3))), pick2.position.y(LY.l2, 0.8, easeInOutCubic), all(pick2.opacity(0, 0.3), ...hit2.map(b => b.opacity(0, 0.3)), ...newHit2.map(b => b.opacity(1, 0.4)), newRangeLab2.opacity(1, 0.4)))),
    at('往下沉', sink.end(1, 1.0)),
  );

  // c13：读：第 1 层往下每层最多一个段
  const q = new KV('读 handful', '', 'key', {w: 160, tone: T.yellow});
  const looked = new Counter([200, 160], '查了 ', ' 个段', {size: SIZE.label});
  W.add([q.node, looked.node]);
  const l0hits = l0;
  const l1hit = l1[1]; // f–j
  const l2hit = l2[3]; // g–h
  say('第 0 层两段都查，往下每层一段');
  yield* beat(
    'c13',
    all(sink.opacity(0, 0.4), ...newHit2.map(b => b.stroke(T.blue, 0.5)), overlap.opacity(0, 0.4), newRangeLab2.opacity(0, 0.3)),
    at('读的时候', all(q.appear([hx, 160], 0.4), looked.node.opacity(1, 0.4), probe.end(1, 1.0))),
    at('第零层重叠', chain(...l0hits.map(b => all(b.stroke(T.yellow, 0.25), looked.bump())))),
    at(
      '第一层往下',
      all(
        chain(all(l1hit.stroke(T.yellow, 0.3), looked.bump()), all(l2hit.stroke(T.yellow, 0.3), looked.bump())),
        tally(4),
      ),
    ),
    at('看一眼', all(l1hit.lineWidth(4, 0.3), l2hit.lineWidth(4, 0.3))),
    // P2-#23（r6）：层数少时还看不出——层数多了，每层最多查一段的优势才出来
    at('层数多了', tally(4)),
  );

  // c14：代价：同一份数据写了好几次
  const dot = new Circle({size: 16, fill: T.yellow, position: [hx, LY.l0b], opacity: 0});
  const writes = new Counter([200, 160], '这份数据写盘 ', ' 次', {size: SIZE.label});
  W.add([dot, writes.node]);
  say('沉到第二层，重写两次');
  yield* beat(
    'c14',
    all(q.hide(0.4), looked.node.opacity(0, 0.4), probe.opacity(0, 0.4), ...l0hits.map(b => b.stroke(T.purple, 0.4)), ...[l1hit, l2hit].map(b => all(b.stroke(T.blue, 0.4), b.lineWidth(2, 0.4)))),
    at('一个键', chain(all(dot.opacity(1, 0.3), writes.node.opacity(1, 0.3)), writes.bump())),
    at('沉到第二层', chain(dot.position.y(LY.l1, 0.8, easeInOutCubic), writes.bump(), dot.position.y(LY.l2, 0.8, easeInOutCubic), writes.bump())),
    at('重写两次', all(writes.node.fill(T.red, 0.4), tally(5))),
  );

  // ================= c15–c16：取舍（示意） =================
  const levelNodes: Node[] = [overlap, axis, axA, axZ, lab0, cap0, lab1, cap1, lab2, cap2, ...l0, ...l1, ...l2, ...newHit, ...newHit2, dot, writes.node];
  const colX = [-40, 340];
  const rowY = [-110, -30, 50];
  const heads = [txt('按大小合并', [colX[0], -190], {bold: true}), txt('按层合并', [colX[1], -190], {bold: true})];
  const rows = ['读要查的段', '占用空间', '写盘次数'].map((t, i) => txt(t, [-560, rowY[i]], {offset: [-1, 0], fill: T.muted}));
  const bar = (x: number, y: number, long: boolean) =>
    new Rect({position: [x - 120, y], offset: [-1, 0], width: 0, height: 26, radius: 6, fill: long ? T.red : T.green, opacity: 0});
  // [行][列]：按大小合并 = 读多、空间多、写少；按层合并 = 读少、空间少、写多
  const longs = [
    [true, false],
    [true, false],
    [false, true],
  ];
  const bars = rowY.map((y, r) => colX.map((x, c) => bar(x, y, longs[r][c])));
  const wOf = (r: number, c: number) => (longs[r][c] ? 240 : 80);
  const sketch = tag([SAFE.halfW, 290], '示意');
  const users = [
    txt('HBase', [colX[0], 130], {fill: T.blue}),
    txt('LevelDB、RocksDB', [colX[1], 130], {fill: T.green}),
    txt('Cassandra：两种都支持', [150, 190], {fill: T.purple}),
  ];
  // C3：LevelDB 之名源于“层”
  const nameNote = txt("名字就来自'层'", [colX[1], 162], {size: SIZE.min, fill: T.muted});
  // P2-#26（r6）：对比条加已有数字小标（按大小读最多 3 段见 c6、按层写 3 次见 c14）
  const read3Lab = txt('最多 3 段', [90, -110], {size: SIZE.min, fill: T.muted, offset: [-1, 0]});
  const write3Lab = txt('写 3 次', [470, 50], {size: SIZE.min, fill: T.muted, offset: [-1, 0]});
  W.add([...heads, ...rows, ...bars.flat(), ...users, nameNote]);
  W.add([read3Lab, write3Lab]);
  view.add(sketch);
  const grow = (r: number, c: number) => all(bars[r][c].opacity(1, 0.2), bars[r][c].width(wOf(r, c), 0.7, easeInOutCubic));

  say('各有取舍');
  yield* beat(
    'c15',
    all(fadeAll(levelNodes, 0.5), ext.opacity(0, 0.4), sketch.opacity(1, 0.5), ...heads.map(h => h.opacity(1, 0.5)), ...rows.map(r => r.opacity(1, 0.5)), tallyFrame.stroke(T.yellow, 0.4)),
    at('读得少', grow(0, 1)),
    at('占空间少', grow(1, 1)),
    at('写得多', all(grow(2, 1), write3Lab.opacity(1, 0.4))),
    at('正好相反', all(grow(0, 0), grow(1, 0), grow(2, 0), read3Lab.opacity(1, 0.4))),
  );

  say('谁用哪种');
  yield* beat(
    'c16',
    fadeAll([tallyFrame, ...tallyLines], 0.5),
    at('LevelDB', users[1].opacity(1, 0.5)),
    at('HBase', users[0].opacity(1, 0.5)),
    at('Cassandra', users[2].opacity(1, 0.5)),
    at('名字就来自', nameNote.opacity(1, 0.5)),
  );

  // ================= h5–h9：引擎与命名、词典、收尾（r3 新增） =================
  const outro: Node[] = [];
  // h5：四家引擎 + Bigtable
  const engNames = ['LevelDB', 'RocksDB', 'Cassandra', 'HBase'];
  const engCards = engNames.map(
    (n, i) =>
      new Rect({
        position: [-420 + i * 280, -60],
        width: 240,
        height: 64,
        radius: 10,
        fill: T.card,
        stroke: i < 2 ? T.green : T.blue,
        lineWidth: 2,
        opacity: 0,
        children: [new Txt({fontSize: SIZE.label, fontFamily: FONT.sans, fill: T.text, text: n})],
      }),
  );
  const bigCard = new Rect({
    position: [0, 60],
    width: 300,
    height: 64,
    radius: 10,
    fill: T.card,
    stroke: T.purple,
    lineWidth: 2,
    opacity: 0,
    children: [new Txt({fontSize: SIZE.label, fontFamily: FONT.sans, fill: T.text, text: 'Bigtable'})],
  });
  W.add([...engCards, bigCard]);
  outro.push(...engCards, bigCard);
  // C3：h5 两处次要子句的画面落点（h6 开头随名牌一起退场，不进 outro 切片）
  const libLab = new Txt({position: [-280, 0], fontSize: SIZE.min, fontFamily: FONT.sans, fill: T.muted, text: '可以嵌进别的程序里用', opacity: 0});
  const paperLab = new Txt({position: [0, 112], fontSize: SIZE.min, fontFamily: FONT.sans, fill: T.muted, text: 'SSTable 与 memtable 这两个名字，也出自 Bigtable 那篇论文', opacity: 0});
  W.add([libLab, paperLab]);
  say('LevelDB、RocksDB 等');
  yield* beat(
    'h5',
    all(fadeAll([...heads, ...rows, ...bars.flat(), ...users, tallyFrame, ...tallyLines, nameNote, read3Lab, write3Lab], 0.5), sketch.opacity(0, 0.5), ext.opacity(0, 0.4)),
    at('LevelDB', sequence(0.3, ...engCards.slice(0, 2).map(c => c.opacity(1, 0.5)))),
    at('Cassandra', sequence(0.3, ...engCards.slice(2).map(c => c.opacity(1, 0.5)))),
    at('Bigtable', bigCard.opacity(1, 0.5)),
    at('嵌进别的程序', libLab.opacity(1, 0.5)),
    at('这两个名字', paperLab.opacity(1, 0.5)),
  );

  // h6：Riak 里替代 Bitcask；LSM 树之名与日志结构文件系统渊源
  const riakCard = new Rect({
    position: [-380, -60],
    width: 200,
    height: 64,
    radius: 10,
    fill: T.card,
    stroke: T.purple,
    lineWidth: 2,
    opacity: 0,
    children: [new Txt({fontSize: SIZE.label, fontFamily: FONT.sans, fill: T.text, text: 'Riak'})],
  });
  const lvChip = new KV('LevelDB', '', 'key', {w: 170});
  const bitChip = new KV('Bitcask', '', 'key', {w: 170});
  W.add([riakCard, lvChip.node, bitChip.node]);
  outro.push(riakCard, lvChip.node, bitChip.node);
  const fsLab = new Txt({position: [-420, 130], offset: [-1, 0], fontSize: SIZE.min, fontFamily: FONT.sans, fill: T.muted, text: '日志结构文件系统', opacity: 0});
  const fsArrow = new Line({points: [[-280, 130], [-120, 130]], stroke: T.purple, lineWidth: 2, endArrow: true, arrowSize: 8, end: 0});
  const lsmPlate = new Rect({
    position: [150, 130],
    width: 480,
    height: 64,
    radius: 10,
    fill: T.card,
    stroke: T.green,
    lineWidth: 2,
    opacity: 0,
    children: [new Txt({fontSize: SIZE.body, fontWeight: 700, fontFamily: FONT.sans, fill: T.text, text: '日志结构合并树（LSM 树）'})],
  });
  W.add([fsLab, fsArrow, lsmPlate]);
  outro.push(fsLab, fsArrow, lsmPlate);
  say('LSM 树');
  yield* beat(
    'h6',
    all(...outro.slice(0, 5).map(n => n.opacity(0, 0.4)), libLab.opacity(0, 0.4), paperLab.opacity(0, 0.4)),
    at('Riak', chain(all(riakCard.opacity(1, 0.5), lvChip.appear([-140, -60], 0.4), bitChip.appear([80, -60], 0.4)), bitChip.stale(0.5))),
    at('日志结构合并树', all(lsmPlate.opacity(1, 0.5), fsArrow.end(1, 0.8))),
    at('日志结构文件系统', fsLab.opacity(1, 0.5)),
    at('工作之上', lsmPlate.stroke(T.yellow, 0.5)),
  );

  // h7：全文搜索的词典——词 → 文档编号列表
  const termCard = new Rect({
    position: [-350, -40],
    width: 160,
    height: 64,
    radius: 10,
    fill: T.card,
    stroke: T.blue,
    lineWidth: 2,
    opacity: 0,
    children: [new Txt({fontSize: SIZE.body, fontWeight: 700, fontFamily: FONT.sans, fill: T.text, text: '词'})],
  });
  const termArrow = new Line({points: [[-260, -40], [-150, -40]], stroke: T.blue, lineWidth: 2, endArrow: true, arrowSize: 8, end: 0});
  const docChips = ['文档 1', '文档 2', '文档 3'].map(
    (d, i) =>
      new Rect({
        position: [150, -90 + i * 50],
        width: 170,
        height: 40,
        radius: 8,
        fill: T.card,
        stroke: T.green,
        lineWidth: 2,
        opacity: 0,
        children: [new Txt({fontSize: SIZE.min, fontFamily: FONT.mono, fill: T.text, text: d})],
      }),
  );
  const docLab = new Txt({position: [150, 50], fontSize: SIZE.min, fontFamily: FONT.sans, fill: T.muted, text: '文档编号列表', opacity: 0});
  W.add([termCard, termArrow, ...docChips, docLab]);
  outro.push(termCard, termArrow, ...docChips, docLab);
  say('词 → 文档编号列表');
  yield* beat(
    'h7',
    all(...outro.slice(5, 11).map(n => n.opacity(0, 0.4))),
    at('键是词', all(termCard.opacity(1, 0.5), termArrow.end(1, 0.8))),
    // P2-11（r5）：“全文索引比键值索引复杂得多”一句已删（不展开就不提），此处不再点亮 docLab
    at('文档编号列表', all(sequence(0.25, ...docChips.map(c => c.opacity(1, 0.4))), docLab.opacity(1, 0.4))),
  );

  // h8：数据比内存大得多，照样工作；排好序，范围查询高效
  const memSmall = new Rect({
    position: [-400, -60],
    width: 180,
    height: 120,
    radius: 10,
    fill: T.card,
    stroke: T.blue,
    lineWidth: 2,
    opacity: 0,
    children: [new Txt({fontSize: SIZE.label, fontFamily: FONT.sans, fill: T.text, text: '内存'})],
  });
  const dataBig = new Rect({
    position: [150, -60],
    width: 640,
    height: 200,
    radius: 10,
    fill: T.card,
    stroke: T.green,
    lineWidth: 2,
    opacity: 0,
    children: [new Txt({position: [0, -78], fontSize: SIZE.min, fontFamily: FONT.sans, fill: T.muted, text: '数据比内存大得多'})],
  });
  const rangeKeys = ['handbag', 'handful', 'handicap', 'handiwork', 'handprinted'].map(
    (k, i) => new KV(k, '', 'key', {w: 120}),
  );
  W.add([memSmall, dataBig]);
  rangeKeys.forEach((k, i) => {
    W.add(k.node);
    k.node.position([-100 + i * 125, -20]);
  });
  const rangeHi = new Rect({key: 'qa-ignore-range-box', position: [212, -20], width: 495, height: 60, radius: 8, fill: 'rgba(251,191,36,0.12)', stroke: T.yellow, lineWidth: 2, opacity: 0});
  const minLab = new Txt({position: [-35, -68], fontSize: SIZE.min, fontFamily: FONT.sans, fill: T.yellow, text: '最小值', opacity: 0});
  const maxLab = new Txt({position: [475, -68], offset: [-1, 0], fontSize: SIZE.min, fontFamily: FONT.sans, fill: T.yellow, text: '最大值', opacity: 0});
  W.add([rangeHi, minLab, maxLab]);
  // P2-12（r5）：范围里的键挨在一起，一次顺序读完——扫线从左到右扫过范围里的键
  const rangeSweep = new Line({points: [[-100, 30], [400, 30]], stroke: T.green, lineWidth: 3, endArrow: true, arrowSize: 10, end: 0});
  const rangeSweepLab = new Txt({position: [150, 70], fontSize: SIZE.min, fontFamily: FONT.sans, fill: T.green, text: '一次顺序读完', opacity: 0});
  W.add([rangeSweep, rangeSweepLab]);
  outro.push(memSmall, dataBig, rangeHi, minLab, maxLab, ...rangeKeys.map(k => k.node), rangeSweep, rangeSweepLab);
  say('大而有序，照样工作');
  yield* beat(
    'h8',
    all(...outro.slice(11, 17).map(n => n.opacity(0, 0.4))),
    at('数据比内存大得多', all(memSmall.opacity(1, 0.5), dataBig.opacity(1, 0.5), sequence(0.12, ...rangeKeys.map(k => k.node.opacity(1, 0.3))))),
    at('范围查询', all(rangeHi.opacity(1, 0.5), minLab.opacity(1, 0.4), maxLab.opacity(1, 0.4))),
    at('一次顺序读完', all(rangeSweep.end(1, 1.0), rangeSweepLab.opacity(1, 0.4))),
  );

  // h9：磁盘写是顺序的，写吞吐高；猫视频回扣——合并还是只留最新值
  const seqArrow = new Line({points: [[-400, -100], [400, -100]], stroke: T.green, lineWidth: 3, endArrow: true, arrowSize: 10, end: 0});
  const seqLab = new Txt({position: [0, -130], fontSize: SIZE.min, fontFamily: FONT.sans, fill: T.green, text: '顺序写', opacity: 0});
  const barFrame = new Rect({position: [0, -20], width: 600, height: 30, radius: 8, fill: T.card, stroke: T.line, lineWidth: 2, opacity: 0});
  const barFill = new Rect({position: [-300, -20], offset: [-1, 0], width: 0, height: 30, radius: 8, fill: T.green, opacity: 0});
  const catFrame = new Rect({position: [0, 90], width: 920, height: 60, radius: 10, fill: T.card, stroke: T.blue, lineWidth: 2, opacity: 0});
  const catKeys = [new KV('mew', '1087'), new KV('purr', '2114'), new KV('scratch', '252'), new KV('yawn', '511')];
  W.add([seqArrow, seqLab, barFrame, barFill, catFrame]);
  catKeys.forEach((k, i) => {
    W.add(k.node);
    k.node.position([-330 + i * 220, 90]);
  });
  say('顺序写，吞吐高');
  yield* beat(
    'h9',
    all(...outro.slice(17).map(n => n.opacity(0, 0.4))),
    at('顺序的', all(seqArrow.end(1, 1.2), seqLab.opacity(1, 0.5), barFrame.opacity(1, 0.4), all(barFill.opacity(1, 0.2), barFill.width(600, 1.2, easeInOutCubic)))),
    // P2-13（r5）：“回到猫视频”已删——旁白改成“再看合并”，不依赖本单元没有的前文
    at('再看合并', all(catFrame.opacity(1, 0.5), sequence(0.3, ...catKeys.map(k => k.node.opacity(1, 0.4))))),
    at('只留最新值', all(...catKeys.map(k => k.node.stroke(T.green, 0.4)))),
  );
});
