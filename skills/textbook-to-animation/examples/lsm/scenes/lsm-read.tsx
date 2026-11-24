// 示例 LSM · 场景 2：读取路径与布隆过滤器（r1–r12）。
// 图式：同一张全景图（接写入场景的终态）；查询是一个黄色的块，从新往旧逐个“走访”，右上角的计数器
// 记磁盘读了几次；在最旧的段上推镜头，看稀疏索引 → 块 → 找到；布隆过滤器用“剖面放大”：
// 全景虚化退后，放大的比特行在前面演置位和探测，演完回到全景，再读一次，计数器停在 0。
// 布隆过滤器的内部（比特位、三个哈希、约 10 位/键 → 约 1% 误判）是原文之外的延伸，画面标“延伸”，哈希位置是示意。
import {Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {Vector2, all, chain, createRef, sequence, waitFor} from '@motion-canvas/core';
import {at, makeBeats} from '../../lib/beats';
import {Bits, Cam, Counter, KV, hashLines, tag} from '../../lib/schemas';
import {FONT, SAFE, SIZE, T} from '../../lib/theme';
import timeline from '../../timeline/example-lsm.json';
import {IN, finalMap} from './lsm-stage';

// 示意用的哈希位置（16 位）：同一个键在每个过滤器里算出的位置相同
const H: Record<string, number[]> = {
  handful: [6, 10, 13],
  handyman: [3, 7, 12],
  handsaw: [0, 9, 14],
};
const A_OTHERS = [0, 1, 2, 4, 5, 7, 9, 11, 12, 14, 15]; // handbag、handiwork、handoff、handsome 置过的位
const A_ALL = [...A_OTHERS, ...H.handful];

export default makeScene2D(function* (view) {
  view.fill(T.bg);
  const beat = makeBeats(timeline);
  const world = createRef<Node>();
  const hud = createRef<Node>();
  const anchor = createRef<Txt>();
  const say = (text: string) => anchor().text(text);

  view.add(
    <>
      <Node ref={world} />
      <Node ref={hud} />
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
  const cam = new Cam(W);
  const map = finalMap(W);
  const [sC, sB, sA] = map.ssts;
  const reads = new Counter([SAFE.halfW, -SAFE.halfH], '磁盘读 ', ' 次', {offset: [1, -1]});
  const ext = tag([SAFE.halfW, 290], '延伸 · 原文之外');
  hud().add([reads.node, ext]);

  // ---- 查询块：在入口出现，逐站走访 ----
  const MEM_STOP = new Vector2(-455, -190);
  const below = (s: (typeof map.ssts)[number]) => s.center.add([0, s.frame.height() / 2 + 22]);
  const query = (key: string) => {
    const q = new KV(`读 ${key}`, '', 'key', {w: 160, tone: T.yellow});
    W.add(q.node);
    return q;
  };
  function* miss(q: KV, frame: Rect, disk: boolean): Generator<any, void, any> {
    yield* all(frame.stroke(T.red, 0.25), disk ? reads.bump(T.red) : waitFor(0.25));
    yield* frame.stroke(T.line, 0.3);
  }

  // ---- r1–r4：读一个存在的键 ----
  const q1 = query('handful');
  say('从新往旧找');
  yield* beat(
    'r1',
    reads.node.opacity(1, 0.5),
    at('读', q1.appear(IN, 0.4)),
    at('先查内存', chain(q1.moveTo(MEM_STOP, 0.9), miss(q1, map.mem.frame, false))),
  );

  say('每查一个段，读一次磁盘');
  yield* beat(
    'r2',
    at('最新的段', chain(q1.moveTo(below(sC), 0.8), miss(q1, sC.frame, true))),
    at('次新的段', chain(q1.moveTo(below(sB), 0.6), miss(q1, sB.frame, true))),
  );
  yield* beat('r3', chain(reads.node.scale(1.15, 0.3), reads.node.scale(1, 0.4)));

  // 剖面：最旧的段里，稀疏索引 → 块 → 块内扫
  const blk1 = new Rect({
    position: sA.pos(1),
    width: 158,
    height: 3 * 34 + 2 * 8 + 8,
    radius: 10,
    stroke: T.purple,
    lineWidth: 2,
    lineDash: [6, 5],
    opacity: 0,
  });
  const blk2 = new Rect({
    position: sA.pos(3).add(sA.pos(4)).scale(0.5),
    width: 158,
    height: 2 * 34 + 8 + 8,
    radius: 10,
    stroke: T.purple,
    lineWidth: 2,
    lineDash: [6, 5],
    opacity: 0,
  });
  const idxX = 215;
  const idxTitle = new Txt({position: [idxX, sA.pos(0).y - 44], fontSize: SIZE.min, fontFamily: FONT.sans, fill: T.purple, text: '稀疏索引（内存）', opacity: 0});
  const idx = ['handbag', 'handoff'].map(
    (k, i) =>
      new Txt({position: [idxX - 10, sA.pos(i === 0 ? 0 : 3).y], fontSize: SIZE.min, fontFamily: FONT.mono, fill: T.text, text: k, opacity: 0}),
  );
  const idxArrows = [0, 3].map(
    i =>
      new Line({
        points: [
          [idxX + 40, sA.pos(i).y],
          [sA.center.x - 79, sA.pos(i).y],
        ],
        stroke: T.purple,
        lineWidth: 2,
        endArrow: true,
        arrowSize: 8,
        end: 0,
      }),
  );
  const val = new Txt({
    position: sA.pos(1).add([94, 0]),
    offset: [-1, 0],
    fontSize: SIZE.min,
    fontFamily: FONT.mono,
    fill: T.yellow,
    text: '44662',
    opacity: 0,
  });
  W.add([blk1, blk2, idxTitle, ...idx, ...idxArrows, val]);
  // 推镜头时，镜头外的内存一侧整个淡出（否则会被当成“文字出画”），旁边两个段压暗
  const memSide = [map.all[0], map.all[1], map.mem.frame, map.mem.title, ...map.meter.nodes(), ...map.mem.items.map(k => k.node), map.walBox, map.walTitle, ...map.wal.map(k => k.node)];
  const dimOthers = (o: number, d: number) =>
    all(
      ...[sB, sC].flatMap(s => [s.frame.opacity(o, d), s.title.opacity(o, d), ...s.items.map(k => k.node.opacity(o, d))]),
      ...memSide.map(n => n.opacity(o < 1 ? 0 : 1, d)),
    );

  say('稀疏索引 → 块 → 找到');
  yield* beat(
    'r4',
    at('最旧的这一段', chain(q1.moveTo(below(sA), 0.8), all(sA.frame.stroke(T.yellow, 0.3), reads.bump(T.yellow)))),
    at('稀疏索引', all(cam.focus([300, -75], 1.6, 1.0), dimOthers(0.08, 0.8), idxTitle.opacity(1, 0.6), ...idx.map(t => t.opacity(1, 0.6)))),
    at('所在的块', all(idx[0].fill(T.yellow, 0.3), idxArrows[0].end(1, 0.6), blk1.opacity(1, 0.5), blk2.opacity(1, 0.5), idxArrows[1].end(1, 0.6))),
    at('读出来', chain(sA.items[0].flash(T.yellow, 0.15), all(sA.items[1].node.stroke(T.green, 0.3), val.opacity(1, 0.4)))),
  );

  // ---- r5–r6：读一个不存在的键：一路白读 ----
  const q2 = query('handyman');
  say('要是键不存在？');
  yield* beat(
    'r5',
    all(
      cam.reset(1.0),
      dimOthers(1, 0.8),
      q1.hide(0.4),
      ...[blk1, blk2, idxTitle, ...idx, ...idxArrows, val].map(n => n.opacity(0, 0.5)),
      sA.frame.stroke(T.line, 0.5),
      sA.items[1].node.stroke(T.blue, 0.5),
      reads.reset(0.5),
    ),
    at('handyman', q2.appear(IN, 0.4)),
  );

  say('一路白读，才敢说没有');
  yield* beat(
    'r6',
    // 同一个块的走访必须串成一条 chain：分在几个 at() 里会并行补间同一个 position
    at(
      '一路查到',
      chain(
        q2.moveTo(MEM_STOP, 0.6),
        miss(q2, map.mem.frame, false),
        q2.moveTo(below(sC), 0.6),
        miss(q2, sC.frame, true),
        q2.moveTo(below(sB), 0.6),
        miss(q2, sB.frame, true),
        q2.moveTo(below(sA), 0.6),
        miss(q2, sA.frame, true),
      ),
    ),
    at('才敢说没有', q2.node.stroke(T.red, 0.4)),
  );

  // ---- r7：每段一个过滤器，放在内存里 ----
  const rows = [
    new Bits(new Vector2(-354, 120), 16, 'C', {set: [1, 4, 5, 8, 10, 11, 13, 15]}),
    new Bits(new Vector2(-354, 152), 16, 'B', {set: [0, 2, 3, 6, 9, 12, 14]}),
    new Bits(new Vector2(-354, 184), 16, 'A', {set: A_ALL}),
  ];
  const rowsTitle = new Txt({position: [-165, 152], offset: [-1, 0], fontSize: SIZE.min, fontFamily: FONT.sans, fill: T.muted, text: '过滤器', opacity: 0});
  W.add([...rows.map(r => r.group), rowsTitle]);
  say('布隆过滤器：每段一个，在内存');
  yield* beat(
    'r7',
    q2.hide(0.4),
    reads.reset(0.4),
    at('每个段配一个', sequence(0.35, ...rows.map(r => r.group.opacity(1, 0.5)))),
    at('放在内存里', all(rowsTitle.opacity(1, 0.4), ...rows.map(r => r.label.fill(T.yellow, 0.4)))),
  );

  // ---- r8–r11：剖面放大：一个过滤器的比特行 ----
  const ov = new Node({opacity: 0});
  hud().add(ov);
  const big = new Bits(new Vector2(0, 20), 16, '', {cell: 54, cellH: 60, font: SIZE.body, gap: 6, set: A_OTHERS, index: true});
  big.group.opacity(1);
  const ovTitle = new Txt({position: [0, -210], fontSize: SIZE.label, fontFamily: FONT.sans, fill: T.muted, text: 'SSTable A 的过滤器（放大）'});
  const caption = new Txt({position: [0, 120], fontSize: SIZE.min, fontFamily: FONT.sans, fill: T.muted, text: '已经写入 handbag、handiwork、handoff、handsome'});
  const verdict = new Txt({position: [0, 185], fontSize: SIZE.body, fontWeight: 700, fontFamily: FONT.sans, fill: T.text, text: ''});
  const note = new Txt({position: [0, 228], fontSize: SIZE.min, fontFamily: FONT.sans, fill: T.muted, text: '', opacity: 0});
  ov.add([ovTitle, big.group, caption, verdict, note]);
  const KEY_AT = new Vector2(0, -125);
  let pill: KV | null = null;
  let lines: Line[] = [];
  function* probe(key: string): Generator<any, void, any> {
    pill = new KV(key, '', 'key', {tone: T.yellow});
    ov.add(pill.node);
    yield* pill.appear(KEY_AT, 0.35);
    lines = hashLines(KEY_AT.add([0, 18]), big, H[key]);
    ov.add(lines);
    yield* sequence(0.25, ...lines.map(l => l.end(1, 0.5)));
  }
  function* clearProbe(): Generator<any, void, any> {
    const old = [pill!, lines] as const;
    yield* all(old[0].hide(0.3), ...old[1].map(l => l.opacity(0, 0.3)), big.unmark([...Array(16).keys()], 0.3), verdict.opacity(0, 0.3), note.opacity(0, 0.3));
    old[0].node.remove();
    old[1].forEach(l => l.remove());
  }

  say('三个哈希，三个位置');
  yield* beat(
    'r8',
    at('一串比特位', all(W.opacity(0.25, 0.6), W.filters.blur(6, 0.6), ov.opacity(1, 0.6), ext.opacity(1, 0.6))),
    at('写入一个键', probe('handful')),
    at('置成一', all(big.set(H.handful, 0.4), big.mark(H.handful, 0.4))),
  );

  say('有一个是 0：一定不在');
  yield* beat(
    'r9',
    clearProbe(),
    at('也算出', probe('handyman')),
    at('只要有一个是零', all(big.mark(H.handyman, 0.4), chain(verdict.text('一定不在', 0), verdict.fill(T.red, 0), verdict.opacity(1, 0.4)))),
  );

  say('全是 1：可能在');
  yield* beat(
    'r10',
    clearProbe(),
    at('三个位置全是一', chain(probe('handsaw'), big.mark(H.handsaw, 0.4))),
    at('可能在', chain(verdict.text('可能在 → 还得读磁盘确认', 0), verdict.fill(T.yellow, 0), verdict.opacity(1, 0.4))),
    at('读磁盘确认', chain(note.text('handsaw 其实不在：这就是误判', 0), note.opacity(1, 0.5))),
  );

  say('约 10 位/键 → 约 1% 误判');
  yield* beat(
    'r11',
    all(note.opacity(0, 0.3), verdict.opacity(0, 0.3)),
    at('十位左右', chain(verdict.text('每个键约 10 位 → 误判约 1%', 0), verdict.fill(T.text, 0), verdict.opacity(1, 0.5))),
    at('百分之一', verdict.fill(T.yellow, 0.4)),
  );

  // ---- r12：回到全景，再读一次不存在的键 ----
  const nos = rows.map(r => new Txt({position: [-165, r.at.y], offset: [-1, 0], fontSize: SIZE.min, fontFamily: FONT.sans, fill: T.red, text: '不在', opacity: 0}));
  W.add(nos);
  say('三个过滤器都说不在：0 次磁盘读');
  yield* beat(
    'r12',
    all(clearProbe(), ov.opacity(0, 0.6), W.opacity(1, 0.6), W.filters.blur(0, 0.6), reads.reset(0.3), rowsTitle.opacity(0, 0.4)),
    at('三个过滤器', sequence(0.6, ...rows.map((r, i) => all(r.mark(H.handyman, 0.3), nos[i].opacity(1, 0.3))))),
    at('一次磁盘也不用读', chain(reads.node.fill(T.green, 0.3), reads.node.scale(1.2, 0.3), reads.node.scale(1, 0.4))),
  );
});
