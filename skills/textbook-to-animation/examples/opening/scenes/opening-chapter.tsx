// 示例 · 整章开篇（o1–o9，约 70 秒）：章标题 → 这章讲什么（存与取、索引的取舍）→ 和上一章的关系
// → 路线图逐部分点亮（念到哪一站，哪一站闪）→ 标出下一站。
// 开篇不讲机制细节：每一拍只回答“这章讲什么、分几部分、从哪开始”；机制留给各单元。
// 设计：../design.md（开篇单元 + 路线图表）；分镜：../beats.md；章数据：./chapter.ts（工程里是 src/lib/chapter.ts）。
import {Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, chain, waitFor} from '@motion-canvas/core';
import {at, makeBeats} from '../../lib/beats';
import {ChapterTitle, Roadmap} from '../../lib/opening';
import {KV, Meter, tag, zone} from '../../lib/schemas';
import {FONT, SIZE, T} from '../../lib/theme';
import {CHAPTER} from './chapter';
import timeline from '../../timeline/example-opening.json';

export default makeScene2D(function* (view) {
  view.fill(T.bg);
  const beat = makeBeats(timeline);
  const title = new ChapterTitle(CHAPTER);
  const map = new Roadmap(CHAPTER);
  const W = new Node({}); // 开篇前半段（存与取、取舍、分层）的画面，路线图出来前整体退场
  view.add([W, ...map.nodes(), ...title.nodes()]);

  // ---- o1：章标题（演示拍：念完留 1.2 秒给标题） ----
  yield* beat('o1', title.enter());

  // ---- o2：数据库就做两件事——存下来、找回来（一条有身份的数据走一个来回） ----
  const [progZone, progName] = zone([-300, -10], 320, 220, '你的程序');
  const [dbZone, dbName] = zone([300, -10], 320, 220, '数据库');
  W.add([progZone, progName, dbZone, dbName]);
  const rec = new KV('handful', '44662');
  const ask = new KV('读 handful', '', 'key', {tone: T.yellow});
  W.add([rec.node, ask.node]);
  const back = new KV('handful', '44662'); // 找回来的那一份：从查询到达的位置出发，回到程序里
  W.add(back.node);
  yield* beat(
    'o2',
    title.toHeader(),
    at('两件事', all(...[progZone, progName, dbZone, dbName].map(n => n.opacity(1, 0.5)))),
    at('交给它', chain(rec.appear([-300, -40]), rec.moveTo([300, -40], 1.2))),
    at('存下来', rec.node.stroke(T.green, 0.4)),
    at('回头要', chain(ask.appear([-300, 40]), ask.moveTo([300, 40], 1.0))),
    at(
      '找回来',
      chain(
        all(ask.hide(0.4), back.node.position([300, 40], 0), back.node.opacity(1, 0.4)),
        all(back.moveTo([-300, 40], 1.1), chain(waitFor(0.8), back.node.stroke(T.green, 0.3))),
      ),
    ),
  );

  // ---- o3：怎么存决定能多快找回来——建索引：查快了，写慢了（示意） ----
  const index = new KV('索引', '', 'key', {tone: T.purple, w: 100});
  const link = new Line({
    points: [
      [300, 28],
      [300, -18],
    ],
    stroke: T.purple,
    lineWidth: 2,
    lineDash: [6, 5],
    endArrow: true,
    arrowSize: 8,
    end: 0,
  });
  const write = new Meter([-330, 0], 180, {w: 18, title: '写入'});
  const read = new Meter([-200, 0], 180, {w: 18, title: '查询'});
  const sketch = tag([-265, 130], '示意', [0, 0]);
  W.add([index.node, link, ...write.nodes(), ...read.nodes(), sketch]);
  write.value(0.6);
  read.value(0.6);
  yield* beat(
    'o3',
    all(progZone.opacity(0, 0.5), progName.opacity(0, 0.5), back.hide(0.5)),
    at('决定了', all(write.show(0.5), read.show(0.5), sketch.opacity(1, 0.5))),
    at('建个索引', chain(index.appear([300, 50]), link.end(1, 0.5))),
    at('查起来就快', read.to(0.95, 0.8)),
    at('写就慢了', all(write.to(0.3, 0.8), write.fill.fill(T.red, 0.8), index.flash(T.red))),
  );

  // ---- o4：和上一章的关系：往下走一层 ----
  const layer = (y: number, text: string, stroke: string) =>
    new Rect({
      position: [0, y],
      width: 620,
      height: 88,
      radius: 14,
      fill: T.card,
      stroke,
      lineWidth: 2,
      opacity: 0,
      children: [new Txt({fontSize: SIZE.body, fontFamily: FONT.sans, fill: T.text, text})],
    });
  const side = (y: number, text: string, fill: string) =>
    new Txt({position: [334, y], offset: [-1, 0], fontSize: SIZE.label, fontFamily: FONT.sans, fill, text, opacity: 0});
  const model = layer(-90, '数据模型：数据长什么样', T.line);
  const engine = layer(70, '存储引擎：在磁盘上怎么放、怎么找', T.yellow);
  const prev = side(-90, '上一章', T.muted);
  const here = side(70, '本章', T.yellow);
  const down = new Line({
    points: [
      [0, -40],
      [0, 20],
    ],
    stroke: T.muted,
    lineWidth: 3,
    endArrow: true,
    arrowSize: 10,
    end: 0,
  });
  W.add([model, engine, prev, here, down]);
  yield* beat(
    'o4',
    all(...[dbZone, dbName, rec.node, index.node, link, ...write.nodes(), ...read.nodes(), sketch].map(n => n.opacity(0, 0.5))),
    at('数据长什么样', all(model.opacity(1, 0.5), prev.opacity(1, 0.5))),
    at('往下走一层', chain(down.end(1, 0.5), all(engine.opacity(1, 0.5), here.opacity(1, 0.5)))),
    at('怎么放', chain(engine.scale(1.04, 0.3), engine.scale(1, 0.4))),
  );

  // ---- o5–o8：路线图，一部分一拍；念到哪一站，哪一站闪 ----
  yield* beat(
    'o5',
    at('分三段', all(...[model, engine, prev, here, down].map(n => n.opacity(0, 0.5)))),
    at('第一段', map.showRow(0)),
    at('追加日志', map.pulseStop('u1')),
    at('哈希索引', map.pulseStop('u2')),
    at('LSM 树', map.pulseStop('u3')),
    at('B 树', map.pulseStop('u4')),
  );
  yield* beat(
    'o6',
    at('第二段', map.showRow(1)),
    at('数据仓库', map.pulseStop('u9')),
    at('星型模式', map.pulseStop('u10')),
  );
  yield* beat(
    'o7',
    at('第三段', map.showRow(2)),
    at('只读', map.pulseStop('u11')),
    at('压缩', map.pulseStop('u12')),
    at('排序', map.pulseStop('u13')),
    at('提前算好', map.pulseStop('u14')),
  );
  yield* beat('o8', at('最后', map.showRow(3)), at('取舍', chain(waitFor(0.6), map.pulseStop('u15'))));

  // ---- o9：下一站 ----
  yield* beat('o9', map.focus('u1', '下一站'));
});
