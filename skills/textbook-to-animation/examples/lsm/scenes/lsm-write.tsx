// 示例 LSM · 场景 1：写入路径（w0–w14）。w0 是单元站牌（UnitTitle：章名 · 第 3 站 / 共 15 站 + 单元标题），w1 开头收成左上角页眉。
// 图式：全景图常驻（左内存 / 右磁盘），每次写入是一个有身份的键值块：先追加进日志，再有序插进 memtable
// （其余块让位）；满了冻结、新树接着收写入；冻结的树按顺序整棵刷成 SSTable；刷完丢日志。
// 设计：../design.md；分镜：../beats.md。时长全部来自 ../timeline.json（装进工程后是 src/timeline/example-lsm.json）。
import {Line, Node, Txt, makeScene2D} from '@motion-canvas/2d';
import {Vector2, all, chain, createRef, easeInOutCubic, sequence, waitFor} from '@motion-canvas/core';
import {at, makeBeats} from '../../lib/beats';
import {UnitTitle} from '../../lib/opening';
import {CHIP_H, KV, Meter, Slots, zone} from '../../lib/schemas';
import {FROZEN, IN, MEM_A, SST_TOP, SST_X, WAL_CELL, sst, sstCenter, walFrame, walPos} from './lsm-stage';
import {FONT, SAFE, SIZE, T} from '../../lib/theme';
import {CHAPTER} from './chapter';
import timeline from '../../timeline/example-lsm.json';

export default makeScene2D(function* (view) {
  view.fill(T.bg);
  const beat = makeBeats(timeline);
  const world = createRef<Node>();
  const anchor = createRef<Txt>();
  const say = (text: string) => anchor().text(text);

  view.add(
    <>
      <Node ref={world} />
      <Txt ref={anchor} position={[0, 290]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={''} />
    </>,
  );
  const W = world();
  // 单元站牌：这一站在全章的位置 + 单元标题；收起后留下左上角页眉（读取、合并两个场景的页眉同一个位置）
  const unit = new UnitTitle(CHAPTER, 'u3');
  view.add(unit.nodes());

  // ---- 全景图 ----
  const [memZone, memName] = zone([-325, -25], 500, 450, '内存');
  const [diskZone, diskName] = zone([255, -25], 630, 450, '磁盘');
  W.add([memZone, memName, diskZone, diskName]);

  const memA = new Slots(MEM_A, 'col', 5, {title: 'memtable'});
  const memB = new Slots(MEM_A, 'col', 5, {title: 'memtable（新）'});
  const meter = new Meter([-322, -20], memA.frame.height(), {title: '大小'});
  W.add([memA.frame, memA.title, memB.frame, memB.title, ...meter.nodes()]);

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

  // ---- w1：乱序进来，排好序出去（整段的预告） ----
  const teaser = ['handoff', 'handbag', 'handsome', 'handful'].map(k => new KV(k, '', 'key'));
  const row = new Slots(new Vector2(0, -40), 'row', 4, {item: 150, cross: CHIP_H, gap: 18});
  teaser.forEach(t => W.add(t.node));
  yield* beat('w0', unit.enter());

  say('乱序写入 → 有序的段');
  yield* beat(
    'w1',
    unit.toHeader(),
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
  const kWork = new KV('handiwork', '45521');
  say('① 先追加日志');
  yield* beat(
    'w3',
    at('写入', arrive(kWork)),
    at('第一步', all(walBox.opacity(1, 0.5), walTitle.opacity(1, 0.5))),
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
    at('只追加', chain(walTitle.fill(T.yellow, 0.3), waitFor(1.2), walTitle.fill(T.muted, 0.5))),
    at('恢复内存', all(recover.end(1, 0.9), recoverLab.opacity(1, 0.6))),
  );

  say('② 插进 memtable');
  yield* beat(
    'w5',
    all(recover.opacity(0, 0.5), recoverLab.opacity(0, 0.5)),
    at('排好序的结构', all(memA.show(0.5), meter.show(0.5))),
    at('memtable', all(intoMem(kWork, memA, 1.1), meter.to(0.2, 1.1))),
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

  const kFul2 = new KV('handful', '44662');
  say('同一个键：覆盖');
  yield* beat(
    'w8',
    at('新值', arrive(kFul2)),
    at('日志照样追加', logIt(kFul2, 0.8)),
    at('直接覆盖', chain(kFul2.moveTo(memA.find('handful')!.node.position(), 0.8), all(kFul2.hide(0.2), memA.find('handful')!.setValue('44662')))),
  );
  kFul2.node.remove();

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
  W.add([cap, capLab]);
  const kSome = new KV('handsome', '86478');
  say('上限：几 MB');
  yield* beat(
    'w9',
    at('大小上限', all(cap.end(1, 0.5), capLab.opacity(1, 0.5))),
    at('handsome', chain(arrive(kSome), all(logIt(kSome, 0.7), intoMem(kSome, memA, 0.9), meter.to(1, 0.9), meter.fill.fill(T.yellow, 0.9)))),
  );

  const kCuf = new KV('handcuffs', '2729');
  say('满了就冻结');
  yield* beat(
    'w10',
    all(capLab.opacity(0, 0.3), cap.opacity(0, 0.3)),
    at('冻结', all(memA.moveTo(FROZEN, 1.0), memA.frame.stroke(T.purple, 1.0), memA.title.text('冻结 · 只读', 0), meter.to(0, 0.6), meter.fill.fill(T.green, 0.6))),
    at('新的空树', chain(memB.show(0.3), arrive(kCuf), all(logIt(kCuf, 0.6), intoMem(kCuf, memB, 0.8), meter.to(0.2, 0.8))), 0.5),
  );
  cap.remove();
  capLab.remove();

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

  const oldWal = wal.slice(0, 6);
  say('刷完：丢掉冻结的树和日志');
  yield* beat(
    'w13',
    all(sweep.opacity(0, 0.4), sweepLab.opacity(0, 0.4)),
    at('冻结的树', memA.hide(0.6)),
    at('日志里', chain(sequence(0.12, ...oldWal.map(w => w.stale(0.4))), all(...oldWal.map(w => w.hide(0.4))), wal[6].moveTo(walPos(0), 0.7))),
  );
  sweep.remove();
  sweepLab.remove();
  oldWal.forEach(w => w.node.remove());
  wal.splice(0, 6);

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
    at('一直这样写', all(memB.items[0].hide(0.5), wal[0].hide(0.5))),
    at('攒下一个', all(sstA.moveTo(sstCenter(SST_X[2], 5), 1.0), meter.to(0, 0.6))),
    at('又一个', chain(all(sstB.show(0.5), ...sstB.items.map(k => k.node.opacity(1, 0.5))), all(sstC.show(0.5), ...sstC.items.map(k => k.node.opacity(1, 0.5))))),
    at('越往左越新', all(kWri.appear(memB.pos(0), 0.5), walWri.appear(walPos(0), 0.5), meter.to(0.2, 0.5), memB.title.text('memtable', 0.5))),
  );
});
