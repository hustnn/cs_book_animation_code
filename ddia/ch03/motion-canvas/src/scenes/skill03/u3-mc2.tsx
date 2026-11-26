// U3 r3 · 场景 2：读取路径与布隆过滤器（r1–r12、r4b–r4d），改编自 skill 示例 examples/lsm/scenes/lsm-read.tsx。
// 图式：同一张全景图（接写入场景的终态）；查询是一个黄色的块，从新往旧逐个“走访”，右上角的计数器
// 记磁盘读了几次；在最旧的段上推镜头，看稀疏索引 → 块 → 找到；布隆过滤器用“剖面放大”：
// 全景虚化退后，放大的比特行在前面演置位和探测，演完回到全景，再读一次，计数器停在 0。
// 布隆过滤器的内部（比特位、三个哈希、约 10 位/键 → 约 1% 误判）是原文之外的延伸，画面标“延伸”，哈希位置是示意。
import {Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {Vector2, all, chain, createRef, easeInOutCubic, sequence, waitFor} from '@motion-canvas/core';
import {at, makeBeats} from '../../lib/beats';
import {Bits, Cam, Counter, KV, hashLines, tag} from '../../lib/schemas';
import {FONT, SAFE, SIZE, T} from '../../lib/theme';
import timeline from '../../timeline/u3.json';
import {IN, finalMap} from './u3-stage';

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
  yield* beat(
    'r3',
    at('每查一个段', chain(reads.node.scale(1.15, 0.3), reads.node.scale(1, 0.4))),
    at('磁盘', chain(reads.node.scale(1.15, 0.3), reads.node.scale(1, 0.4))),
  );

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
  // P2-#10（r6）：块边界线——两块的分界（rows 2/3 之间，y=-54）
  const blkLine = new Line({points: [[311, -54], [469, -54]], stroke: T.yellow, lineWidth: 3, opacity: 0});
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
  W.add([blk1, blk2, blkLine, idxTitle, ...idx, ...idxArrows, val]);
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
    at('索引里', all(cam.focus([300, -75], 1.6, 1.0), dimOthers(0.08, 0.8), idxTitle.opacity(1, 0.6), ...idx.map(t => t.opacity(1, 0.6)))),
    at('最大那个键', all(idx[0].fill(T.yellow, 0.3), idxArrows[0].end(1, 0.6), blk1.opacity(1, 0.5), blk2.opacity(1, 0.5), blkLine.opacity(1, 0.5), idxArrows[1].end(1, 0.6))),
    at('读出来', chain(sA.items[0].flash(T.yellow, 0.15), all(sA.items[1].node.stroke(T.green, 0.3), val.opacity(1, 0.4)))),
  );

  // ---- r4b–r4d：索引多稀疏、整块压缩、固定大小才能二分查找（r3 新增） ----
  const sweep2 = new Line({
    points: [
      [300, -218],
      [480, -218],
    ],
    stroke: T.yellow,
    lineWidth: 4,
    endArrow: true,
    arrowSize: 10,
    end: 0,
  });
  const sweep2Lab = new Txt({position: [390, -232], fontSize: SIZE.min, fontFamily: FONT.sans, fill: T.yellow, text: '每隔几 KB 记一个键', opacity: 0});
  W.add([sweep2, sweep2Lab]);
  say('几 KB 一扫而过');
  yield* beat(
    'r4b',
    all(cam.reset(1.0), dimOthers(1, 0.8), val.opacity(0, 0.5), sA.frame.stroke(T.line, 0.5), sA.items[1].node.stroke(T.blue, 0.5), idxTitle.opacity(0, 0.5), ...idx.map(t => t.opacity(0, 0.5)), ...idxArrows.map(a => a.opacity(0, 0.5))),
    at('每隔几 KB', sweep2Lab.opacity(1, 0.5)),
    at('扫起来很快', sweep2.end(1, 0.9)),
  );

  const compBlock = new Rect({
    position: [430, -240],
    width: 220,
    height: 40,
    radius: 8,
    fill: T.card,
    stroke: T.blue,
    lineWidth: 2,
    opacity: 0,
    children: [new Txt({fontSize: SIZE.min, fontFamily: FONT.mono, fill: T.text, text: '一块键值对'})],
  });
  const compLab = new Txt({position: [430, -284], fontSize: SIZE.min, fontFamily: FONT.sans, fill: T.muted, text: '整块压缩：省空间、省带宽', opacity: 0});
  // P2-3（r5）：虚线原框留在原处作压缩前对照，块收紧得更明显（220 → 130）
  const compGhost = new Rect({
    position: [430, -240],
    width: 220,
    height: 40,
    radius: 8,
    stroke: T.line,
    lineWidth: 2,
    lineDash: [8, 6],
    opacity: 0,
  });
  // P2-#11（r6）：读时整块解压——省的是读盘的带宽
  // QA 返修：原位置 [430,-200] 与 “SSTable A” 标题重叠（text-overlap 0.57）；改放压缩块左侧同一高度（块左缘 365、虚线原框左缘 320，右对齐到 x=305）
  const r4cNote = new Txt({position: [305, -240], offset: [1, 0], fontSize: SIZE.min, fontFamily: FONT.sans, fill: T.muted, text: '读时整块解压', opacity: 0});
  W.add([compGhost, compBlock, compLab, r4cNote]);
  say('整块压缩，索引指块头');
  yield* beat(
    'r4c',
    all(sweep2.opacity(0, 0.4), sweep2Lab.opacity(0, 0.4)),
    at('编成一块', all(compBlock.opacity(1, 0.5), compGhost.opacity(1, 0.5))),
    at('先压缩', chain(compBlock.width(130, 1.2, easeInOutCubic), compLab.opacity(1, 0.4))),
    at('指着块头', compBlock.stroke(T.yellow, 0.3)),
    at('读时整块解压', r4cNote.opacity(1, 0.4)),
  );

  const eqCells = [0, 1, 2, 3, 4, 5].map(
    i =>
      new Rect({position: [-420 + i * 52, 132], width: 44, height: 34, radius: 6, fill: T.card, stroke: T.blue, lineWidth: 2, opacity: 0}),
  );
  const midMark = new Txt({position: [-316, 102], fontSize: SIZE.min, fontFamily: FONT.sans, fill: T.yellow, text: '二分：先看中间', opacity: 0});
  const unW = [28, 58, 44, 68, 34, 50];
  const unX = [-410, -360, -305, -250, -195, -140];
  const unCells = unW.map(
    (w, i) =>
      new Rect({position: [unX[i], 172], width: w, height: 34, radius: 6, fill: T.card, stroke: T.purple, lineWidth: 2, opacity: 0}),
  );
  const unLab = new Txt({position: [-275, 215], fontSize: SIZE.min, fontFamily: FONT.sans, fill: T.muted, text: '变长，难定界', opacity: 0});
  // P2-4（r5）：演示一次折半（先看中间 → 排除一半 → 再看剩下那一半的中间）；变长格加“边界在哪？”示意
  const excludeLab = new Txt({position: [-212, 102], fontSize: SIZE.min, fontFamily: FONT.sans, fill: T.muted, text: '这一半排除了', opacity: 0});
  const boundaryQ = new Txt({position: [-120, 215], offset: [-1, 0], fontSize: SIZE.min, fontFamily: FONT.sans, fill: T.yellow, text: '边界在哪？', opacity: 0});
  // P2-#12（r6）：格子一般大，中间就是总数折半（6 格 → 第 3 格）
  // QA 返修：原位置 [-290,68] 左端压进内存表内框（右缘 x=-353，edge 0.22）；右移到格子上方右侧（内框右缘 -353、量表右缘约 -340，均留空隙）
  const r4dHalfLab = new Txt({position: [-200, 68], fontSize: SIZE.min, fontFamily: FONT.sans, fill: T.muted, text: '总数 6 格，中间是第 3 格', opacity: 0});
  W.add([...eqCells, midMark, excludeLab, ...unCells, unLab, boundaryQ, r4dHalfLab]);
  say('变长，难定界');
  yield* beat(
    'r4d',
    all(compBlock.opacity(0, 0.4), compGhost.opacity(0, 0.4), compLab.opacity(0, 0.4), r4cNote.opacity(0, 0.4)),
    at('固定大小', sequence(0.1, ...eqCells.map(c => c.opacity(1, 0.3)))),
    at('总数折半', r4dHalfLab.opacity(1, 0.4)),
    at('二分查找', all(midMark.opacity(1, 0.4), eqCells[2].stroke(T.yellow, 0.3))),
    at('排除一半', all(...[3, 4, 5].map(i => eqCells[i].opacity(0.3, 0.4)), excludeLab.opacity(1, 0.4))),
    at('剩下', chain(midMark.text('再看中间', 0), midMark.position([-368, 102], 0.4), eqCells[1].stroke(T.yellow, 0.3))),
    at('变长', all(sequence(0.1, ...unCells.map(c => c.opacity(1, 0.3))), unLab.opacity(1, 0.4), boundaryQ.opacity(1, 0.4))),
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
      ...[blk1, blk2, blkLine, idxTitle, ...idx, ...idxArrows, val, sweep2, sweep2Lab, compBlock, compGhost, compLab, r4cNote, ...eqCells, midMark, excludeLab, ...unCells, unLab, boundaryQ, r4dHalfLab].map(n => n.opacity(0, 0.5)),
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

  // r6b（r6 新增·拆拍）：r6 新句 TTS 坏音频（首句重复两遍、24.4s），按 skill 规则拆拍；
  // r6 恢复 r5 原文与录音，新句单立一拍
  say('索引只能指到块');
  yield* beat('r6b', at('读出来看一眼', chain(q2.node.scale(1.08, 0.25), q2.node.scale(1, 0.3))));

  // ---- r7：每段一个过滤器，放在内存里 ----
  const rows = [
    new Bits(new Vector2(-354, 120), 16, 'C', {set: [1, 4, 5, 8, 10, 11, 13, 15]}),
    new Bits(new Vector2(-354, 152), 16, 'B', {set: [0, 2, 3, 6, 9, 12, 14]}),
    new Bits(new Vector2(-354, 184), 16, 'A', {set: A_ALL}),
  ];
  const rowsTitle = new Txt({position: [-165, 152], offset: [-1, 0], fontSize: SIZE.min, fontFamily: FONT.sans, fill: T.muted, text: '过滤器', opacity: 0});
  // P2-15（r5）：小字回扣写段时刻——过滤器不是读时现造的，是写段时建好的
  const builtNote = new Txt({position: [-529, 222], offset: [-1, 0], fontSize: SIZE.min, fontFamily: FONT.sans, fill: T.muted, text: '写段时已建好，随段进内存', opacity: 0});
  W.add([...rows.map(r => r.group), rowsTitle, builtNote]);
  say('布隆过滤器：每段一个，在内存');
  yield* beat(
    'r7',
    q2.hide(0.4),
    reads.reset(0.4),
    at('每个段配一个', sequence(0.35, ...rows.map(r => r.group.opacity(1, 0.5)))),
    at('放在内存里', all(rowsTitle.opacity(1, 0.4), ...rows.map(r => r.label.fill(T.yellow, 0.4)))),
    at(
      '顺手建好',
      chain(
        all(sC.frame.stroke(T.yellow, 0.3), sB.frame.stroke(T.yellow, 0.3), sA.frame.stroke(T.yellow, 0.3)),
        all(sC.frame.stroke(T.line, 0.3), sB.frame.stroke(T.line, 0.3), sA.frame.stroke(T.line, 0.3), builtNote.opacity(1, 0.5)),
      ),
    ),
  );

  // ---- r8–r11：剖面放大：一个过滤器的比特行 ----
  const ov = new Node({opacity: 0});
  hud().add(ov);
  const big = new Bits(new Vector2(0, 20), 16, '', {cell: 54, cellH: 60, font: SIZE.body, gap: 6, set: A_OTHERS, index: true});
  big.group.opacity(1);
  const ovTitle = new Txt({position: [0, -210], fontSize: SIZE.label, fontFamily: FONT.sans, fill: T.muted, text: 'SSTable A 的过滤器（放大）'});
  // P2-1（r5）： caption 放大一号、提亮，念到“前面四个键”时脉冲一下——不再只靠一行小字解释
  const caption = new Txt({position: [0, 120], fontSize: SIZE.label, fontFamily: FONT.sans, fill: T.text, text: '已经写入 handbag、handiwork、handoff、handsome'});
  const verdict = new Txt({position: [0, 185], fontSize: SIZE.body, fontWeight: 700, fontFamily: FONT.sans, fill: T.text, text: ''});
  const note = new Txt({position: [0, 228], fontSize: SIZE.min, fontFamily: FONT.sans, fill: T.muted, text: '', opacity: 0});
  // P2-#15（r6）：16 位只是示意，实际每键约 10 位
  const r11note = new Txt({position: [0, 262], fontSize: SIZE.min, fontFamily: FONT.sans, fill: T.muted, text: '这里只画 16 位示意，实际每键约 10 位', opacity: 0});
  ov.add([ovTitle, big.group, caption, verdict, note, r11note]);
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
    at('前面四个键', chain(caption.scale(1.12, 0.25), caption.scale(1, 0.3))),
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

  // r9b（r4 新增·撞位演示）：handsaw 的三个位置全是别的键置的，再接 r10 的“可能在”
  say('这三格是别的键置的');
  yield* beat(
    'r9b',
    clearProbe(),
    at('三个位置', chain(probe('handsaw'), big.mark(H.handsaw, 0.4))),
    at('别的键置的', chain(verdict.text('这三格是别的键置的', 0), verdict.fill(T.yellow, 0), verdict.opacity(1, 0.4))),
    // P2-#14（r6）：归属行逐条出现（拆开三步，免得 6s 定格）；新句“重新算一遍”处已写入键名行轻跳
    at('0 号位', chain(note.text('0 号位 handbag 置的', 0), note.opacity(1, 0.5))),
    at('9 号位', note.text('0 号位 handbag 置的，9 号位 handiwork 置的', 0)),
    at('14 号位', note.text('0 号位 handbag 置的，9 号位 handiwork 置的，14 号位 handoff 置的', 0)),
    at('重新算一遍', chain(caption.scale(1.12, 0.25), caption.scale(1, 0.3))),
  );

  say('全是 1：可能在');
  yield* beat(
    'r10',
    at('可能在', chain(verdict.text('可能在 → 还得读磁盘确认', 0), verdict.fill(T.yellow, 0), verdict.opacity(1, 0.4))),
    at('读磁盘确认', chain(note.text('handsaw 其实不在：这就是误判', 0), note.opacity(1, 0.5))),
  );

  say('约 10 位/键 → 约 1% 误判');
  yield* beat(
    'r11',
    all(verdict.opacity(0, 0.3), r11note.opacity(1, 0.5)),
    at('每键分到的位越多', chain(note.text('位越多，撞位越少', 0), note.opacity(1, 0.4))),
    at('十位左右', chain(verdict.text('每个键约 10 位 → 误判约 1%', 0), verdict.fill(T.text, 0), verdict.opacity(1, 0.5))),
    at('百分之一', verdict.fill(T.yellow, 0.4)),
  );

  // ---- r12：回到全景，再读一次不存在的键 ----
  const nos = rows.map(r => new Txt({position: [-165, r.at.y], offset: [-1, 0], fontSize: SIZE.min, fontFamily: FONT.sans, fill: T.red, text: '不在', opacity: 0}));
  W.add(nos);
  say('三个过滤器都说不在：0 次磁盘读');
  yield* beat(
    'r12',
    all(clearProbe(), ov.opacity(0, 0.6), r11note.opacity(0, 0.4), W.opacity(1, 0.6), W.filters.blur(0, 0.6), reads.reset(0.3), rowsTitle.opacity(0, 0.4)),
    at('三个过滤器', sequence(0.6, ...rows.map((r, i) => all(r.mark(H.handyman, 0.3), nos[i].opacity(1, 0.3))))),
    at('一次磁盘也不用读', chain(reads.node.fill(T.green, 0.3), reads.node.scale(1.2, 0.3), reads.node.scale(1, 0.4), waitFor(1.2), reads.node.scale(1.15, 0.3), reads.node.scale(1, 0.4))),
  );
});
