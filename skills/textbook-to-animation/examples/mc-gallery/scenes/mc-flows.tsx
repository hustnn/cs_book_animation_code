// 技法图库 · 流动与时间类（f1–f9）。每段用一个真实的小机制演一种 Motion Canvas 手法：
//   E  虚线流动（lineDash + lineDashOffset）+ 文字逐字打出 —— 主从复制与复制延迟（f1–f3）
//   F  沿曲线移动（QuadBezier.getPointAtPercentage）+ 本地 SVG 图标 —— 一个请求的往返延迟（f4–f5）
//   G  后台任务（spawn 分叉、cancel 收回）+ loop —— 生产快于消费，队列积压（f6–f7）
//   H  遮罩聚光（cache + compositeOperation）—— 范围扫描只读一段（f8–f9）
// 手法说明、适用场景见 references/techniques.md；分镜见 ../beats.md。
import {Line, Node, QuadBezier, Rect, SVG, Txt, makeScene2D} from '@motion-canvas/2d';
import {
  SimpleSignal,
  ThreadGenerator,
  Vector2,
  all,
  cancel,
  chain,
  createSignal,
  spawn,
  easeInOutCubic,
  linear,
  loop,
  sequence,
  waitFor,
} from '@motion-canvas/core';
import {at, makeBeats} from '../../lib/beats';
import {Counter, KV, tag} from '../../lib/schemas';
import {FONT, SAFE, SIZE, T} from '../../lib/theme';
import timeline from '../../timeline/example-mc-gallery.json';

const sans = (text: string, p: [number, number], o: {size?: number; fill?: string; offset?: [number, number]} = {}) =>
  new Txt({position: p, offset: o.offset ?? [0, 0], fontSize: o.size ?? SIZE.label, fontFamily: FONT.sans, fill: o.fill ?? T.muted, text});
const mono = (text: string | (() => string), p: [number, number], o: {size?: number; fill?: string; offset?: [number, number]} = {}) =>
  new Txt({position: p, offset: o.offset ?? [0, 0], fontSize: o.size ?? SIZE.label, fontFamily: FONT.mono, fill: o.fill ?? T.text, text});
const card = (p: [number, number], w: number, h: number, title: string, tone: string = T.blue) =>
  new Rect({position: p, width: w, height: h, radius: 14, fill: T.card, stroke: tone, lineWidth: 2, children: [sans(title, [0, -h / 2 + 24], {fill: T.text})]});

// 本地 SVG 图标：颜色从 theme 传进去（不在场景里写十六进制色值）；Icon 组件要在线取图标库，无头渲染用不了
const svg = (body: string) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">${body}</svg>`;
const ICON = {
  laptop: (c: string) => svg(`<rect x="10" y="12" width="44" height="30" rx="3" fill="none" stroke="${c}" stroke-width="4"/><rect x="4" y="46" width="56" height="6" rx="2" fill="${c}"/>`),
  balancer: (c: string) => svg(`<circle cx="32" cy="32" r="24" fill="none" stroke="${c}" stroke-width="4"/><path d="M16 32 H46 M37 23 L46 32 L37 41" fill="none" stroke="${c}" stroke-width="4"/>`),
  server: (c: string) => svg(`<rect x="10" y="6" width="44" height="14" rx="3" fill="none" stroke="${c}" stroke-width="4"/><rect x="10" y="25" width="44" height="14" rx="3" fill="none" stroke="${c}" stroke-width="4"/><rect x="10" y="44" width="44" height="14" rx="3" fill="none" stroke="${c}" stroke-width="4"/>`),
  db: (c: string) => svg(`<ellipse cx="32" cy="14" rx="20" ry="7" fill="none" stroke="${c}" stroke-width="4"/><path d="M12 14 V50 A20 7 0 0 0 52 50 V14" fill="none" stroke="${c}" stroke-width="4"/><path d="M12 32 A20 7 0 0 0 52 32" fill="none" stroke="${c}" stroke-width="4"/>`),
};

export default makeScene2D(function* (view) {
  view.fill(T.bg);
  const beat = makeBeats(timeline);
  const caption = new Txt({position: [0, 290], fontSize: SIZE.body, fill: T.text, fontFamily: FONT.sans, text: ''});
  const technique = new Txt({position: [SAFE.halfW, -SAFE.halfH], offset: [1, -1], fontSize: SIZE.label, fill: T.purple, fontFamily: FONT.sans, text: ''});
  view.add([sans('技法图库 · 流动与时间', [-SAFE.halfW, -SAFE.halfH], {offset: [-1, -1]}), technique, caption]);
  const say = (s: string) => caption.text(s);
  const tech = (s: string) => technique.text(`手法：${s}`);

  // ======== E：虚线流动 + 逐字打出 —— 主从复制 ========
  const E = new Node({});
  view.add(E);
  const leader = card([-400, -10], 250, 230, '主库');
  const f1 = card([330, -150], 250, 150, '从库 1', T.line);
  const f2 = card([330, 130], 250, 150, '从库 2', T.line);
  const dash = (to: [number, number]) =>
    new Line({points: [[-275, -10], to], stroke: T.blue, lineWidth: 3, lineDash: [14, 10], end: 0});
  const l1 = dash([205, -150]);
  const l2 = dash([205, 130]);
  E.add([l1, l2, leader, f1, f2]);
  const cmd = mono('>', [-520, -200], {offset: [-1, 0], fill: T.yellow});
  const logRows = [new KV('#41 x=1', '', 'key', {w: 200}), new KV('#42 y=7', '', 'key', {w: 200}), new KV('#43 x=2', '', 'key', {w: 200, tone: T.yellow})];
  const logY = (i: number) => -50 + i * 44;
  E.add([cmd, ...logRows.map(r => r.node)]);
  // 从库的状态都是信号：重放到第几条、x 是多少；落后几条由主库和从库的位置派生
  const leaderPos = createSignal(42);
  const pos1 = createSignal(42);
  const pos2 = createSignal(41);
  const x1 = createSignal(1);
  const st1 = mono(() => `重放到 #${Math.round(pos1())}   x = ${x1()}`, [330, -140], {size: SIZE.min});
  const st2 = mono(() => `重放到 #${Math.round(pos2())}   x = 1`, [330, 140], {size: SIZE.min});
  const lag = sans('', [330, 222], {fill: T.red});
  lag.text(() => `落后 ${leaderPos() - pos2()} 条`);
  st1.opacity(0);
  st2.opacity(0);
  lag.opacity(0);
  E.add([st1, st2, lag]);

  tech('虚线流动 + 文字逐字打出');
  say('主从复制：日志源源不断推给从库');
  // 虚线的流动交给后台任务（spawn 分叉出去并行跑，跨越好几拍），这一段结束时 cancel 收回。
  // 第二条流得慢：同样的时间里偏移量只有四分之一
  const flowTasks = [spawn(l1.lineDashOffset(-2400, 60, linear)), spawn(l2.lineDashOffset(-600, 60, linear))];
  yield* beat(
    'f1',
    at('主从复制', all(sequence(0.15, logRows[0].appear([-400, logY(0)], 0.4), logRows[1].appear([-400, logY(1)], 0.4)), l1.end(1, 0.8), l2.end(1, 0.8), st1.opacity(1, 0.5), st2.opacity(1, 0.5))),
    at('写入先到主库', chain(cmd.text('> SET x = 2', 1.0), logRows[2].appear([-400, logY(2)], 0.4), () => leaderPos(43))),
    at('源源不断', all(l1.lineWidth(5, 0.3).to(3, 0.4), l2.lineWidth(5, 0.3).to(3, 0.4))),
  );

  say('按顺序重放');
  const e43 = logRows[2].clone('key', {w: 160, tone: T.yellow});
  const e42 = logRows[1].clone('key', {w: 160});
  E.add([e43.node, e42.node]);
  yield* beat(
    'f2',
    at('按顺序送达', all(
      chain(all(e43.node.opacity(1, 0.2), e43.moveTo([150, -125], 1.6)), e43.hide(0.3), () => {
        pos1(43);
        x1(2);
      }),
      // 第二个从库网络慢：同一时间只走到半路
      chain(all(e42.node.opacity(1, 0.2), e42.moveTo([-40, 60], 3.2))),
    )),
    at('照着重放', chain(f1.stroke(T.green, 0.3), waitFor(0.5), f1.stroke(T.line, 0.4))),
  );

  say('复制延迟：从落后的从库读到旧值');
  const stale = sans('读 x 得到 1：旧值（主库已经是 2）', [330, 222], {fill: T.red});
  stale.opacity(0);
  E.add(stale);
  yield* beat(
    'f3',
    at('第二个从库', all(f2.stroke(T.red, 0.4), lag.opacity(1, 0.4))),
    at('从它读 x', chain(all(lag.opacity(0, 0.3), stale.opacity(1, 0.4)), st2.fill(T.red, 0.3))),
  );
  cancel(...flowTasks);

  // ======== F：沿曲线移动 + 本地 SVG 图标 —— 一个请求的往返 ========
  const F = new Node({opacity: 0});
  view.add(F);
  const spots: [number, number][] = [[-470, 60], [-170, -110], [150, 60], [450, -110]];
  const names = ['客户端', '负载均衡', '应用服务器', '数据库'];
  const icons = [ICON.laptop(T.blue), ICON.balancer(T.purple), ICON.server(T.green), ICON.db(T.yellow)].map(
    (s, i) => new SVG({svg: s, position: spots[i], width: 72, height: 72, opacity: 0}),
  );
  const iconLabs = names.map((n, i) => sans(n, [spots[i][0], spots[i][1] + 62]).opacity(0));
  // 每一跳一条二次贝塞尔曲线，控制点往上抬，路径是弯的
  const hops = [0, 1, 2].map(i => {
    const a = new Vector2(spots[i]);
    const b = new Vector2(spots[i + 1]);
    return new QuadBezier({p0: a.add([46, 0]), p1: a.add(b).scale(0.5).add([0, -110]), p2: b.add([-46, 0]), stroke: T.line, lineWidth: 3, end: 0});
  });
  F.add([...hops, ...icons, ...iconLabs]);
  const prog = hops.map(() => createSignal(0));
  const hopOf = createSignal(0);
  const at_ = () => hops[hopOf()].getPointAtPercentage(prog[hopOf()]()).position;
  const packet = new Rect({position: () => at_().add([0, -26]), width: 160, height: 34, radius: 17, fill: T.card, stroke: T.yellow, lineWidth: 2, opacity: 0});
  const packetTxt = mono('GET /user/42', [0, 0], {size: SIZE.min});
  packet.add(packetTxt);
  const lat = createSignal(0);
  const latTxt = mono(() => `已用 ${Math.round(lat())} ms`, [0, 190], {size: SIZE.body, fill: T.text});
  latTxt.opacity(0);
  const plus = ['+20 ms', '+1 ms', '+1 ms'].map((s, i) => sans(s, [(spots[i][0] + spots[i + 1][0]) / 2, (spots[i][1] + spots[i + 1][1]) / 2 - 150], {fill: T.yellow}).opacity(0));
  const ext = tag([SAFE.halfW, 250], '示意');
  F.add([packet, latTxt, ...plus, ext]);
  // 生成器函数：lat() 在这一跳真正开始时才读，读到的是累加后的值
  function* addLat(ms: number, d: number): ThreadGenerator {
    yield* lat(lat() + ms, d, easeInOutCubic);
  }
  function* hop(i: number, dir: 1 | -1, ms: number, d = 1.1): ThreadGenerator {
    hopOf(i);
    yield* all(prog[i](dir === 1 ? 1 : 0, d, easeInOutCubic), addLat(ms, d), dir === 1 ? plus[i].opacity(1, 0.4) : waitFor(0));
  }

  tech('沿曲线移动 + 本地 SVG 图标');
  say('一个请求的往返');
  yield* beat(
    'f4',
    at('一个请求的往返', chain(all(E.opacity(0, 0.5), F.opacity(1, 0.5)), sequence(0.15, ...icons.map((ic, i) => all(ic.opacity(1, 0.4), iconLabs[i].opacity(1, 0.4)))), all(...hops.map(h => h.end(1, 0.8))))),
    at('从客户端出发', all(packet.opacity(1, 0.4), latTxt.opacity(1, 0.4), ext.opacity(1, 0.4))),
    at('经过负载均衡', chain(hop(0, 1, 20), hop(1, 1, 1))),
  );

  say('每一跳都加一点延迟');
  yield* beat(
    'f5',
    at('再去查数据库', chain(hop(2, 1, 1), all(icons[3].scale(1.2, 0.3).to(1, 0.3), addLat(8, 0.6)))),
    at('原路返回', chain(packetTxt.text('200 OK', 0.3), hop(2, -1, 1, 0.9), hop(1, -1, 1, 0.9), hop(0, -1, 20, 0.9))),
    at('加起来', latTxt.fill(T.yellow, 0.4)),
  );

  // ======== G：后台任务 + loop —— 队列积压 ========
  const G = new Node({opacity: 0});
  view.add(G);
  // 队头（slot 0）在右边、挨着消费者，队尾朝着生产者：新消息从左边进来，不会从排队的消息上面飞过去
  const QHEAD = 228;
  const slotX = (s: number) => QHEAD - s * 72;
  const prod = card([-470, -20], 170, 120, '生产者');
  prod.add(sans('每秒 2 条', [0, 18]));
  const qFrame = new Rect({position: [-24, -20], width: 8 * 72 + 8, height: 54, radius: 10, stroke: T.line, lineWidth: 2});
  const cons = [card([460, -130], 170, 80, '消费者 1'), card([460, -20], 170, 80, '消费者 2'), card([460, 90], 170, 80, '消费者 3')];
  cons.forEach((c, i) => c.opacity(i === 0 ? 1 : 0));
  const qlen = createSignal(0);
  const qTxt = sans('', [-24, 50], {fill: T.text});
  qTxt.text(() => `队列长度 ${qlen()}`);
  G.add([prod, qFrame, ...cons, qTxt]);

  interface Msg {kv: KV; slot: SimpleSignal<number>; t: SimpleSignal<number>; arrived: boolean}
  const queue: Msg[] = [];
  let seq = 0;
  // 消息的位置是派生的：在路上时从生产者插值到它的槽位，到了以后跟着槽位走；
  // 队头被取走时只补间每条消息的 slot，飞行中的消息目标也跟着变，不会两个补间抢同一个 position
  function* emit(): ThreadGenerator {
    const kv = new KV(`m${++seq}`, '', 'key', {w: 60});
    const m: Msg = {kv, slot: createSignal(queue.length), t: createSignal(0), arrived: false};
    queue.push(m);
    const from = new Vector2(-385, -20);
    kv.node.position(() => Vector2.lerp(from, new Vector2(slotX(m.slot()), -20), m.t()));
    G.add(kv.node);
    yield* all(kv.node.opacity(1, 0.2), m.t(1, 0.7, easeInOutCubic));
    m.arrived = true;
    qlen(queue.filter(x => x.arrived).length);
  }
  // 取走队头：送往消费者的那段动画 spawn 到后台，前台只等队列整体左移，所以取的节奏就是 loop 的节奏
  function* take(to: Rect, shift: number): ThreadGenerator {
    const head = queue[0];
    if (!head || !head.arrived) {
      yield* waitFor(shift);
      return;
    }
    queue.shift();
    qlen(queue.filter(x => x.arrived).length);
    head.kv.node.position(head.kv.node.position()); // 冻结派生位置，再补间到消费者
    spawn(chain(head.kv.moveTo(to.position().add([-120, 0]), 0.8), head.kv.hide(0.2), to.stroke(T.green, 0.15).to(T.blue, 0.3)));
    yield* all(...queue.map(x => x.slot(x.slot() - 1, shift, easeInOutCubic)));
  }

  tech('后台任务（spawn + cancel）+ loop');
  say('生产比消费快：队列越排越长');
  // 生产者是后台任务：每 0.5 秒分叉出一条消息的飞行，跨越 f6、f7 两拍，最后 cancel
  const producer = spawn(loop(() => chain(() => void spawn(emit()), waitFor(0.5))));
  yield* beat(
    'f6',
    all(F.opacity(0, 0.5), G.opacity(1, 0.5)),
    // 消费者 1 每 0.8 秒取一条：放在这一拍的前台，loop 次数按拍长算，不会超时
    loop(Math.floor((beat.dur('f6') - 0.4) / 0.8), () => chain(take(cons[0], 0.3), waitFor(0.5))),
    at('越排越长', chain(qTxt.fill(T.red, 0.4), qFrame.stroke(T.red, 0.4))),
  );

  say('加两个消费者：积压很快消化掉');
  yield* beat(
    'f7',
    all(cons[1].opacity(1, 0.4), cons[2].opacity(1, 0.4)), // 新消费者从拍首就在：下面的 loop 也从拍首开始取
    // 三个消费者轮流取，每 0.3 秒一条（约 3.3 条/秒 > 生产的 2 条/秒）：从拍首就开始取
    loop(Math.floor((beat.dur('f7') - 0.4) / 0.3), i => chain(take(cons[i % 3], 0.25), waitFor(0.05))),
    at('消化掉', chain(qTxt.fill(T.green, 0.4), qFrame.stroke(T.line, 0.4))),
  );
  cancel(producer);

  // ======== H：遮罩聚光 —— 范围扫描 ========
  const H = new Node({opacity: 0});
  view.add(H);
  const days = Array.from({length: 12}, (_, i) => `11-${String(i + 1).padStart(2, '0')}`);
  const CX = (i: number) => (i - 5.5) * 92;
  const cells = days.map((d, i) => new Rect({position: [CX(i), -20], width: 84, height: 56, radius: 8, fill: T.card, stroke: T.line, lineWidth: 2, children: [mono(d, [0, 0], {size: SIZE.min})]}));
  H.add(cells);
  // 遮罩层：cache 让这一组单独画进离屏缓冲；hole 用 destination-out 在压暗层上挖一个洞。
  // 有意遮挡，整组设 qa-ignore key；洞的左边缘和宽度都是信号
  const holeL = createSignal(CX(3) - 46);
  const holeW = createSignal(92);
  const shade = new Node({key: 'qa-ignore-spotlight', cache: true, opacity: 0});
  shade.add(new Rect({position: [0, -20], width: 1180, height: 120, fill: T.bg, opacity: 0.82}));
  shade.add(new Rect({x: () => holeL(), y: -20, offset: [-1, 0], width: () => holeW(), height: 84, radius: 10, fill: T.white, compositeOperation: 'destination-out'}));
  H.add(shade);
  const startLab = sans('起点 11-04', [CX(3), -100], {fill: T.yellow}).opacity(0);
  const endLab = sans('终点 11-08', [CX(7), -100], {fill: T.yellow}).opacity(0);
  const scanned = new Counter([0, 110], '读了 ', ' 行 / 共 12 行', {size: SIZE.body});
  const stop = sans('11-09 超过终点：停', [CX(8) + 40, 70], {fill: T.red}).opacity(0);
  H.add([startLab, endLab, scanned.node, stop]);

  tech('遮罩聚光（cache + compositeOperation）');
  say('范围查询：先定位起点');
  yield* beat(
    'f8',
    at('按日期存的日志', chain(all(G.opacity(0, 0.5), H.opacity(1, 0.5)), sequence(0.05, ...cells.map(c => c.stroke(T.blue, 0.2))))),
    at('查 11 月 4 日到 8 日', all(startLab.opacity(1, 0.4), endLab.opacity(1, 0.4))),
    at('先定位到起点', all(shade.opacity(1, 0.6), scanned.node.opacity(1, 0.6), chain(waitFor(0.3), scanned.bump()))),
  );

  say('顺着往后扫，过了终点就停');
  yield* beat(
    'f9',
    at('顺着往后扫', chain(...[4, 5, 6, 7].map(i => all(holeW(92 * (i - 2), 0.6, easeInOutCubic), chain(waitFor(0.4), scanned.bump()))))),
    at('过了终点就停', all(cells[8].stroke(T.red, 0.4), stop.opacity(1, 0.4))),
    at('不用扫全表', scanned.node.fill(T.green, 0.4)),
  );
});
