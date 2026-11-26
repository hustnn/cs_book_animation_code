// U3 r4 · 场景 1：站牌 c0 + 钩子 + 写入路径（h1–h4、w1–w14），改编自 skill 示例 examples/lsm/scenes/lsm-write.tsx。
// 图式：全景图常驻（左内存 / 右磁盘），每次写入是一个有身份的键值块：先追加进日志，再有序插进 memtable
// （其余块让位）；满了冻结、新树接着收写入；冻结的树按顺序整棵刷成 SSTable；刷完丢日志。
// 设计：ch03-design.md；分镜：beats-u3.md。时长全部来自 timeline/u3.json（beat() 驱动），不手写 waitFor。
import {Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {Vector2, all, chain, createRef, easeInOutCubic, sequence, waitFor} from '@motion-canvas/core';
import {at, makeBeats} from '../../lib/beats';
import {UnitTitle} from '../../lib/opening';
import {CHAPTER} from '../../lib/chapter';
import {CHIP_H, KV, Meter, Slots, zone} from '../../lib/schemas';
import {FROZEN, IN, MEM_A, SST_TOP, SST_X, WAL_CELL, sst, sstCenter, walFrame, walPos} from './u3-stage';
import {FONT, SIZE, T} from '../../lib/theme';
import timeline from '../../timeline/u3.json';

export default makeScene2D(function* (view) {
  view.fill(T.bg);
  const beat = makeBeats(timeline);
  const world = createRef<Node>();
  const anchor = createRef<Txt>();
  const say = (text: string) => anchor().text(text);

  // 单元站牌（c0，r4，skill v1.11.0 开篇规则）：第 3 站，h1 开头收成左上角页眉；旧静态页眉已删。
  const unit = new UnitTitle(CHAPTER, 'u3');

  view.add(
    <>
      {unit.nodes()}
      <Node ref={world} />
      <Txt ref={anchor} position={[0, 290]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={''} />
    </>,
  );
  const W = world();

  // ---- 全景图 ----
  const [memZone, memName] = zone([-325, -25], 500, 450, '内存');
  const [diskZone, diskName] = zone([255, -25], 630, 450, '磁盘');
  W.add([memZone, memName, diskZone, diskName]);

  const memA = new Slots(MEM_A, 'col', 5, {title: 'memtable'});
  const memB = new Slots(MEM_A, 'col', 5, {title: 'memtable（新）'});
  const meter = new Meter([-322, -20], memA.frame.height(), {title: '大小'});
  W.add([memA.frame, memA.title, memB.frame, memB.title, ...meter.nodes()]);
  // B6：字母顺序标尺（w5 立起，w10 冻结时退场）
  const orderLab = new Txt({position: [-570, 102], offset: [-1, 0], fontSize: SIZE.min, fontFamily: FONT.sans, fill: T.muted, text: '键按字母顺序排', opacity: 0});
  const orderScale = new Txt({position: [-570, 128], offset: [-1, 0], fontSize: SIZE.min, fontFamily: FONT.mono, fill: T.muted, text: 'handbag < handful < handiwork < handoff', opacity: 0});
  W.add([orderLab, orderScale]);

  const [walBox, walTitle] = walFrame();
  W.add([walBox, walTitle]);
  const wal: KV[] = [];

  const sstA = new Slots(sstCenter(SST_X[0], 5), 'col', 5, {cross: 150, title: 'SSTable A'});
  W.add([sstA.frame, sstA.title]);

  // ---- 一次写入：出现在入口 → 拷一份追加进日志 → 本体有序插进 memtable ----
  function* arrive(kv: KV): Generator<any, void, any> {
    W.add(kv.node);
    kv.node.stroke(T.yellow);
    yield* kv.appear(IN, 0.35);
  }
  function* logIt(kv: KV, dur = 0.8): Generator<any, void, any> {
    const c = kv.clone('key', {w: WAL_CELL});
    W.add(c.node);
    c.node.opacity(1);
    wal.push(c);
    yield* c.moveTo(walPos(wal.length - 1), dur);
  }
  function* intoMem(kv: KV, mem: Slots, dur = 0.9): Generator<any, void, any> {
    yield* all(mem.insertSorted(kv, dur), kv.node.stroke(T.blue, dur));
  }

  // ---- c0：单元站牌；h1–h4：钩子、回扣、SSTable 定义（开场，全景图出现之前） ----
  yield* beat('c0', unit.enter());

  const intro: Node[] = [];
  const logBar = new Rect({
    position: [-460, -60],
    offset: [-1, 0],
    width: 0,
    height: 40,
    radius: 8,
    fill: T.card,
    stroke: T.line,
    lineWidth: 2,
    opacity: 0,
  });
  const pile = [0, 1, 2].map(
    i =>
      new Rect({
        position: [-300 + i * 220, 30],
        width: 180,
        height: 44,
        radius: 8,
        fill: T.card,
        stroke: T.blue,
        lineWidth: 2,
        opacity: 0,
      }),
  );
  const hookQ = new Txt({position: [380, 30], fontSize: 72, fontWeight: 700, fontFamily: FONT.sans, fill: T.yellow, text: '？', opacity: 0});
  W.add([logBar, ...pile, hookQ]);
  intro.push(logBar, ...pile, hookQ);
  say('段越攒越多，怎么收拾？');
  yield* beat(
    'h1',
    unit.toHeader(),
    at('日志越写越长', all(logBar.opacity(1, 0.3), logBar.width(920, 1.2, easeInOutCubic))),
    at('段越攒越多', sequence(0.3, ...pile.map(p => p.opacity(1, 0.4)))),
    at('怎么收拾', hookQ.opacity(1, 0.5)),
  );

  const rowA = new Slots(new Vector2(0, -60), 'row', 3, {item: 220, cross: CHIP_H, gap: 16});
  const rowB = new Slots(new Vector2(0, 30), 'row', 3, {item: 220, cross: CHIP_H, gap: 16});
  const aKeys = [new KV('handful', '40308'), new KV('handbag', '8786'), new KV('handicap', '65995')];
  const bKeys = [new KV('handful', '44662'), new KV('handcuffs', '2729'), new KV('handicap', '70836')];
  // P1-1（r5）：两段各套一个分段框（段 1 / 段 2）；两个重复键的旧值用同一标记（划掉变灰），
  // 新值描边变绿；划掉处加“旧值还在，只是被盖住了”，与 c1“旧值还占着空间”一致。
  const segFrameA = new Rect({position: [0, -60], width: 730, height: 66, radius: 10, stroke: T.line, lineWidth: 2, opacity: 0});
  const segFrameB = new Rect({position: [0, 30], width: 730, height: 66, radius: 10, stroke: T.line, lineWidth: 2, opacity: 0});
  const segLabA = new Txt({position: [-378, -60], offset: [1, 0], fontSize: SIZE.label, fontFamily: FONT.sans, fill: T.muted, text: '段 1 · 先写', opacity: 0});
  const segLabB = new Txt({position: [-378, 30], offset: [1, 0], fontSize: SIZE.label, fontFamily: FONT.sans, fill: T.muted, text: '段 2 · 后写', opacity: 0});
  const capNote = new Txt({position: [0, 110], fontSize: SIZE.label, fontFamily: FONT.sans, fill: T.text, text: '旧值还在，只是被盖住了', opacity: 0});
  W.add([segFrameA, segFrameB, segLabA, segLabB, capNote]);
  [...aKeys, ...bKeys].forEach(k => W.add(k.node));
  intro.push(...aKeys.map(k => k.node), ...bKeys.map(k => k.node), segFrameA, segFrameB, segLabA, segLabB, capNote);
  say('后写的优先');
  yield* beat(
    'h2',
    all(...intro.slice(0, 5).map(n => n.opacity(0, 0.4)), segFrameA.opacity(1, 0.4), segFrameB.opacity(1, 0.4), segLabA.opacity(1, 0.4), segLabB.opacity(1, 0.4)),
    at('这两段是上一节攒下的', sequence(0.2, ...[...aKeys, ...bKeys].map((k, i) => k.appear(i < 3 ? rowA.pos(i) : rowB.pos(i - 3), 0.4)))),
    at('后面的值优先', chain(all(aKeys[0].stale(0.5), aKeys[2].stale(0.5)), all(bKeys[0].node.stroke(T.green, 0.4), bKeys[2].node.stroke(T.green, 0.4)), capNote.opacity(1, 0.5))),
  );

  // P1-1（r5）：h3 只用前面两段里的四个不同键（handiwork 不再凭空出现，handicap 只留一个），
  // 值先不画——旁白与“只看键，值先不画”小标都点明这是“只看键的顺序”的示意；
  // 键块在拍首就出现（at('除此之外') 在拍首触发），去掉 h3 首帧全空。
  const sortRow = new Slots(new Vector2(0, -40), 'row', 4, {item: 150, cross: CHIP_H, gap: 18});
  const sortKeys = ['handful', 'handicap', 'handbag', 'handcuffs'].map(k => new KV(k, '', 'key'));
  sortKeys.forEach(k => W.add(k.node));
  const keyOnlyLab = new Txt({position: [0, 30], fontSize: SIZE.min, fontFamily: FONT.sans, fill: T.muted, text: '只看键，值先不画', opacity: 0});
  W.add(keyOnlyLab);
  intro.push(...sortKeys.map(k => k.node), keyOnlyLab);
  const sorted = [...sortKeys].sort((a, b) => (a.key < b.key ? -1 : 1));
  say('按键排好序');
  yield* beat(
    'h3',
    all(...[...aKeys, ...bKeys].map(k => k.hide(0.4)), segFrameA.opacity(0, 0.4), segFrameB.opacity(0, 0.4), segLabA.opacity(0, 0.4), segLabB.opacity(0, 0.4), capNote.opacity(0, 0.4)),
    at('除此之外', sequence(0.15, ...sortKeys.map((k, i) => k.appear(sortRow.pos(i), 0.35)))),
    // r5 定格修（前段）：旁白前 8s 只讲“顺序无关紧要”，键块静置 7.57s（freeze error）；念到“顺序无关紧要”时对调两键、念到“只改一点”时再对调另外两键——顺序本来就不重要，换位正好演示这一点；排序随后照常进行
    at('顺序无关紧要', all(sortKeys[0].moveTo(sortRow.pos(2), 0.8), sortKeys[2].moveTo(sortRow.pos(0), 0.8))),
    at('只改一点', all(sortKeys[1].moveTo(sortRow.pos(3), 0.8), sortKeys[3].moveTo(sortRow.pos(1), 0.8))),
    at('按键排好序', all(...sorted.map((k, i) => k.moveTo(sortRow.pos(i), 1.2)))),
    at('只看键', keyOnlyLab.opacity(1, 0.5)),
    // r5 定格修：旁白 16.6s、排序约 10s 做完，尾部静止 7.57s（freeze error）；念到“四个不同的键”时四个键按排好的顺序依次轻跳放大，把尾部分成两段短静止
    // 注意：只闪描边不行——描边变色改动的像素太少，低于 freezedetect 的噪声阈值，仍记 7.57s 定格；改成缩放脉冲才算动
    at('四个不同的键', sequence(0.6, ...sorted.map(k => chain(k.node.scale(1.12, 0.25), k.node.scale(1, 0.3))))),
  );

  // P1-2（r5）：SSTable 框里放 h3 的四个键，各出现一次、排好序；handful 出现两次，
  // 旧值划掉、新值落位，其余三个各一个——不再是“只装一个键的段”。
  const sstRow = new Slots(new Vector2(0, -40), 'row', 4, {item: 220, cross: CHIP_H, gap: 16});
  const h4Bag = new KV('handbag', '8786');
  const h4Cuf = new KV('handcuffs', '2729');
  const h4FulOld = new KV('handful', '40308');
  const h4FulNew = new KV('handful', '44662');
  const h4Cap = new KV('handicap', '70836');
  W.add([h4Bag.node, h4Cuf.node, h4FulOld.node, h4FulNew.node, h4Cap.node]);
  intro.push(h4Bag.node, h4Cuf.node, h4FulOld.node, h4FulNew.node, h4Cap.node);
  const sstFrame = new Rect({position: [0, -40], width: 980, height: 90, radius: 10, fill: T.card, stroke: T.green, lineWidth: 2, opacity: 0});
  const sstTag = new Txt({position: [0, -110], fontSize: SIZE.body, fontWeight: 700, fontFamily: FONT.sans, fill: T.text, text: 'SSTable', opacity: 0});
  W.add([sstFrame, sstTag]);
  intro.push(sstFrame, sstTag);
  // 名字牌在下、键块在上：把键块移到最上层，免得实心牌子盖住它们
  [h4Bag, h4Cuf, h4FulOld, h4FulNew, h4Cap].forEach(k => {
    k.node.remove();
    W.add(k.node);
  });
  say('SSTable');
  yield* beat(
    'h4',
    all(...sortKeys.map(k => k.hide(0.4)), keyOnlyLab.opacity(0, 0.4)),
    at(
      '只出现一次',
      chain(
        all(h4Bag.appear(sstRow.pos(0), 0.4), h4Cuf.appear(sstRow.pos(1), 0.4), h4FulOld.appear(sstRow.pos(2), 0.4), h4Cap.appear(sstRow.pos(3), 0.4), h4FulNew.appear([sstRow.pos(2).x, 35], 0.4)),
        all(h4FulOld.stale(0.4), h4FulOld.hide(0.4)),
        h4FulNew.moveTo(sstRow.pos(2), 0.8),
      ),
    ),
    at('排好序的表', all(sstFrame.opacity(1, 0.5), sstTag.opacity(1, 0.5))),
  );

  // ---- w1：乱序进来，排好序出去（整段的预告） ----
  const teaser = ['handoff', 'handbag', 'handsome', 'handful'].map(k => new KV(k, '', 'key'));
  const row = new Slots(new Vector2(0, -40), 'row', 4, {item: 150, cross: CHIP_H, gap: 18});
  teaser.forEach(t => W.add(t.node));
  say('乱序写入 → 有序的段');
  yield* beat(
    'w1',
    all(...intro.map(n => n.opacity(0, 0.4))),
    at('乱序', sequence(0.25, ...teaser.map((t, i) => t.appear(row.pos(i), 0.35)))),
    at('排好序', all(...[...teaser].sort((a, b) => (a.key < b.key ? -1 : 1)).map((t, i) => t.moveTo(row.pos(i), 1.2)))),
    at('走一遍', all(...teaser.map(t => t.node.stroke(T.green, 0.5)))),
  );

  say('内存 | 磁盘');
  yield* beat(
    'w2',
    all(...teaser.map(t => t.hide(0.4))),
    at('左边是内存', all(memZone.opacity(1, 0.5), memName.opacity(1, 0.5))),
    at('右边是磁盘', all(diskZone.opacity(1, 0.5), diskName.opacity(1, 0.5))),
  );
  teaser.forEach(t => t.node.remove());

  // ---- w3–w5：第一次写入，两步 ----
  // P1-4（r5，修法 a：统一键值）：handiwork 的值改为 16912，与合并场景一致
  const kWork = new KV('handiwork', '16912');
  // B6：第一次写入就把记号讲全（w4 开头退场）
  const kvLab = new Txt({position: [130, -282], offset: [-1, 0], fontSize: SIZE.min, fontFamily: FONT.sans, fill: T.muted, text: '键 handiwork，值 16912', opacity: 0});
  W.add(kvLab);
  say('① 先追加日志');
  yield* beat(
    'w3',
    at('写入', arrive(kWork)),
    at('第一步', all(walBox.opacity(1, 0.5), walTitle.opacity(1, 0.5), kvLab.opacity(1, 0.5))),
    at('末尾追加', logIt(kWork, 1.0)),
  );

  const recover = new Line({
    points: [
      [-44, 70],
      [-200, 120],
      [-340, 96],
    ],
    radius: 60,
    stroke: T.purple,
    lineWidth: 2,
    lineDash: [8, 6],
    endArrow: true,
    arrowSize: 10,
    end: 0,
  });
  const recoverLab = new Txt({
    position: [-200, 150],
    fontSize: SIZE.min,
    fontFamily: FONT.sans,
    fill: T.purple,
    text: '崩溃后用它恢复',
    opacity: 0,
  });
  W.add([recover, recoverLab]);
  say('日志：只追加，用来恢复');
  yield* beat(
    'w4',
    kvLab.opacity(0, 0.4),
    at('只追加', chain(walTitle.fill(T.yellow, 0.3), waitFor(1.2), walTitle.fill(T.muted, 0.5))),
    at('恢复内存', all(recover.end(1, 0.9), recoverLab.opacity(1, 0.6))),
  );

  say('② 插进 memtable');
  yield* beat(
    'w5',
    all(recover.opacity(0, 0.5), recoverLab.opacity(0, 0.5)),
    at('排好序的结构', all(memA.show(0.5), meter.show(0.5))),
    at('memtable', all(intoMem(kWork, memA, 1.1), meter.to(0.2, 1.1))),
    at('键按字母顺序排', all(orderLab.opacity(1, 0.5), orderScale.opacity(1, 0.5))),
  );
  recover.remove();
  recoverLab.remove();

  // ---- w6–w8：再写几次：有序插入，其余让位；同键覆盖 ----
  const kBag = new KV('handbag', '8786');
  say('有序插入，其余让位');
  yield* beat(
    'w6',
    at('再写', arrive(kBag)),
    at('它比', logIt(kBag, 0.8)),
    at('插到前面', all(intoMem(kBag, memA, 1.4), meter.to(0.4, 1.4))),
  );

  const kFul = new KV('handful', '40308');
  const kOff = new KV('handoff', '5741');
  say('各自落到排好的位置');
  yield* beat(
    'w7',
    at('handful', chain(arrive(kFul), all(logIt(kFul, 0.7), intoMem(kFul, memA, 0.9), meter.to(0.6, 0.9)))),
    at('handoff', chain(arrive(kOff), all(logIt(kOff, 0.7), intoMem(kOff, memA, 0.9), meter.to(0.8, 0.9)))),
  );

  // P1-4（r5，修法 a）：handful 改两次——40308 → 42307 → 44662，使写场景产出的值
  // 与合并场景（handful 三份 40308 / 42307 / 44662）完全对上；日志随之多一条。
  const kFul2 = new KV('handful', '42307');
  const kFul3 = new KV('handful', '44662');
  say('同一个键：覆盖两次');
  yield* beat(
    'w8',
    at('新值', arrive(kFul2)),
    at('再追加一条', logIt(kFul2, 0.8)),
    at('直接把旧值盖掉', chain(kFul2.moveTo(memA.find('handful')!.node.position(), 0.8), all(kFul2.hide(0.2), memA.find('handful')!.setValue('42307')))),
  );
  kFul2.node.remove();
  // w8b（r5）：w8 原两句并一拍时 TTS 出坏音频（截断 + 后半句重复成乱码），拆成两拍；第二改单独一拍
  // cue 用“内存里”而不用句尾的“把旧值盖掉”：盖值动作 1.0s，句尾 cue 会 overrun（QA：动画 7.10s > 旁白 6.78s）
  say('同一个键：再盖一次');
  yield* beat(
    'w8b',
    at('又变了', arrive(kFul3)),
    at('添上一条', logIt(kFul3, 0.8)),
    at('内存里', chain(kFul3.moveTo(memA.find('handful')!.node.position(), 0.8), all(kFul3.hide(0.2), memA.find('handful')!.setValue('44662')))),
  );
  kFul3.node.remove();

  // ---- w9–w10：满了就冻结，新树接着收 ----
  const cap = new Line({
    points: [
      [-338, -126],
      [-306, -126],
    ],
    stroke: T.yellow,
    lineWidth: 3,
    end: 0,
  });
  const capLab = new Txt({
    position: [-298, -126],
    offset: [-1, 0],
    fontSize: SIZE.min,
    fontFamily: FONT.sans,
    fill: T.yellow,
    text: '上限：几 MB',
    opacity: 0,
  });
  // P2-#6（r6）：“示意：只画几个键”——几 MB 上限 vs 画面几个小键，标明是示意
  const w9note = new Txt({position: [-298, -100], offset: [-1, 0], fontSize: SIZE.min, fontFamily: FONT.sans, fill: T.muted, text: '示意：只画几个键', opacity: 0});
  W.add([cap, capLab, w9note]);
  const kSome = new KV('handsome', '86478');
  say('上限：几 MB');
  yield* beat(
    'w9',
    at('大小上限', all(cap.end(1, 0.5), capLab.opacity(1, 0.5), w9note.opacity(1, 0.5))),
    at('handsome', chain(arrive(kSome), all(logIt(kSome, 0.7), intoMem(kSome, memA, 0.9), meter.to(1, 0.9), meter.fill.fill(T.yellow, 0.9)))),
  );

  const kCuf = new KV('handcuffs', '2729');
  say('满了就冻结');
  yield* beat(
    'w10',
    all(capLab.opacity(0, 0.3), cap.opacity(0, 0.3), w9note.opacity(0, 0.3), orderLab.opacity(0, 0.4), orderScale.opacity(0, 0.4)),
    at('冻结', all(memA.moveTo(FROZEN, 1.0), memA.frame.stroke(T.purple, 1.0), memA.title.text('冻结 · 只读', 0), meter.to(0, 0.6), meter.fill.fill(T.green, 0.6))),
    at('新的空树', chain(memB.show(0.3), arrive(kCuf), all(logIt(kCuf, 0.6), intoMem(kCuf, memB, 0.8), meter.to(0.2, 0.8))), 0.5),
  );
  cap.remove();
  capLab.remove();
  w9note.remove();

  // ---- w11–w13：整棵刷盘成 SSTable，顺序写，刷完丢日志 ----
  const flushed = memA.items.map(x => x.clone('key', {w: 150}));
  flushed.forEach(f => {
    W.add(f.node);
    f.node.stroke(T.purple); // 拷贝出发时才显形，免得叠在原块上
  });
  say('整棵刷盘 → SSTable');
  yield* beat(
    'w11',
    at(
      '按顺序',
      all(
        sstA.show(0.5),
        sequence(0.5, ...flushed.map((f, i) => all(f.node.opacity(1, 0.2), f.moveTo(sstA.pos(i), 1.0), f.node.stroke(T.blue, 1.0)))),
      ),
    ),
  );
  sstA.items = flushed;

  const sweep = new Line({
    points: [
      [SST_X[0] + 92, sstA.pos(0).y - 14],
      [SST_X[0] + 92, sstA.pos(4).y + 14],
    ],
    stroke: T.yellow,
    lineWidth: 4,
    endArrow: true,
    arrowSize: 10,
    end: 0,
  });
  const sweepLab = new Txt({
    position: [SST_X[0] + 108, sstA.pos(2).y],
    offset: [-1, 0],
    fontSize: SIZE.min,
    fontFamily: FONT.sans,
    fill: T.yellow,
    text: '顺序写',
    opacity: 0,
  });
  W.add([sweep, sweepLab]);
  say('顺序写，不用再排序');
  yield* beat(
    'w12',
    at('本来就有序', sequence(0.25, ...memA.items.map(x => x.flash(T.yellow, 0.2)))),
    at('从头到尾', all(sweep.end(1, 1.6), sweepLab.opacity(1, 0.5), sequence(0.3, ...flushed.map(f => f.flash(T.yellow, 0.2))))),
  );

  const oldWal = wal.slice(0, 7); // r5：日志多了一条（handful 改两次），冻结树对应前 7 条
  // P2-#7（r6）：每棵树配一份日志——剩下的那条属于新树，标出来
  // QA 返修：原位置 [30,195] 骑在磁盘框底边上（edge 0.84）；改放日志框内、紧贴剩下的那条（框 x -48..558 / y 75..179，条目右缘约 x=88）
  const newLogLab = new Txt({position: [120, 112], offset: [-1, 0], fontSize: SIZE.min, fontFamily: FONT.sans, fill: T.muted, text: '新树的日志，接着记', opacity: 0});
  W.add(newLogLab);
  say('刷完：丢掉冻结的树和日志');
  yield* beat(
    'w13',
    all(sweep.opacity(0, 0.4), sweepLab.opacity(0, 0.4)),
    at('冻结的树', memA.hide(0.6)),
    at('日志里', chain(sequence(0.12, ...oldWal.map(w => w.stale(0.4))), all(...oldWal.map(w => w.hide(0.4))), wal[7].moveTo(walPos(0), 0.7))),
    at('旧日志随旧树一起丢', newLogLab.opacity(1, 0.5)),
  );
  sweep.remove();
  sweepLab.remove();
  oldWal.forEach(w => w.node.remove());
  wal.splice(0, 7);

  // ---- w14：快进：越攒越多，越往左越新 ----
  const mkSst = (x: number, title: string, keys: string[]) => {
    const s = sst(x, title, keys);
    W.add([s.frame, s.title, ...s.items.map(k => k.node)]);
    s.items.forEach((k, i) => k.node.position(s.pos(i)));
    return s;
  };
  const sstB = mkSst(SST_X[1], 'SSTable B', ['handcuffs', 'handkerchief', 'handlebars']);
  const sstC = mkSst(SST_X[0], 'SSTable C', ['handicap', 'handprinted', 'handwaving']);
  const kWri = new KV('handwriting', '22846');
  W.add(kWri.node);
  const walWri = new KV('handwriting', '', 'key', {w: WAL_CELL});
  W.add(walWri.node);
  say('越往左越新');
  yield* beat(
    'w14',
    newLogLab.opacity(0, 0.4),
    at('一直写下去', all(memB.items[0].hide(0.5), wal[0].hide(0.5))),
    at('再写几轮', all(sstA.moveTo(sstCenter(SST_X[2], 5), 1.0), meter.to(0, 0.6))),
    at('又刷出', chain(all(sstB.show(0.5), ...sstB.items.map(k => k.node.opacity(1, 0.5))), all(sstC.show(0.5), ...sstC.items.map(k => k.node.opacity(1, 0.5))))),
    at('越往左越新', all(kWri.appear(memB.pos(0), 0.5), walWri.appear(walPos(0), 0.5), meter.to(0.2, 0.5), memB.title.text('memtable', 0.5))),
  );
});
