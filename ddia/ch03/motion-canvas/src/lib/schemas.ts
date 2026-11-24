// 图式组件：让“数据”在画面上有身份、会移动，而不是一堆写着名字的空框。复制到 motion-canvas/src/lib/schemas.ts。
// 什么时候用哪一个、怎么组合成全景图 / 推镜头 / 剖面放大，见 references/visual-schemas.md。
//
//   KV       有身份的数据块（键值、消息、记录、请求）：appear / moveTo / setValue（覆盖）/ stale（划掉）/ clone
//   Slots    按槽位排列的容器（有序结构、日志、队列、段、缓冲区）：insertSorted 时其余块先让位，append 排到末尾
//   Meter    计量条（大小、上限、占用、水位），值是信号，可补间
//   Counter  计数器（磁盘读次数、写放大、跳数），值是信号，bump() 加一并弹一下
//   Bits     一行比特位 / 格子（位图、布隆过滤器、哈希槽）：set 置位、mark 按位置探测
//   hashLines  从一个点画到几个格子的箭头（哈希、映射）
//   Cam      镜头：缩放、平移整个 world 节点。不要用 Motion Canvas 的 Camera 组件——
//            它把子节点放进一个脱离场景树的 scene 节点，渲染 QA 遍历不到，会“零问题”放行
//   zone / tag  全景图的分区框（内存 / 磁盘、客户端 / 服务器）和“延伸 · 原文之外 / 示意”角标
//
// 约定：所有节点创建时 opacity 0，由场景决定什么时候出现；坐标都是 world 节点里的坐标。
// 移动的默认时长 ≥ 0.8s（渲染 QA 的 fast-move：看得清的文字不到 0.5s 走 150px 以上会记 warn）。
import {Line, Node, Rect, Txt} from '@motion-canvas/2d';
import {
  PossibleVector2,
  SimpleSignal,
  ThreadGenerator,
  Vector2,
  all,
  chain,
  createSignal,
  easeInOutCubic,
  easeOutBack,
  sequence,
  waitFor,
} from '@motion-canvas/core';
import {FONT, SIZE, T} from './theme';

export const CHIP_H = 34;
let strikeSeq = 0;

/** 有身份的键值块。mode 'kv' 显示 key:value，'key' 只显示键。 */
export class KV {
  readonly node: Rect;
  readonly label: Txt;
  private strike: Line | null = null;

  constructor(
    public readonly key: string,
    public value: string,
    public readonly mode: 'kv' | 'key' = 'kv',
    opts: {w?: number; tone?: string; name?: string} = {},
  ) {
    this.label = new Txt({
      fontSize: SIZE.min,
      fontFamily: FONT.mono,
      fill: T.text,
      text: this.text(),
    });
    this.node = new Rect({
      key: opts.name,
      width: opts.w ?? (mode === 'kv' ? 204 : 150),
      height: CHIP_H,
      radius: 8,
      fill: T.card,
      stroke: opts.tone ?? T.blue,
      lineWidth: 2,
      opacity: 0,
      children: [this.label],
    });
  }

  private text() {
    return this.mode === 'kv' ? `${this.key}:${this.value}` : this.key;
  }

  /** 在 at 处出现（轻微弹出）。 */
  *appear(at: PossibleVector2, dur = 0.4): ThreadGenerator {
    this.node.position(at).scale(0.85);
    yield* all(this.node.opacity(1, dur), this.node.scale(1, dur, easeOutBack));
  }

  *moveTo(at: PossibleVector2, dur = 0.8): ThreadGenerator {
    yield* this.node.position(at, dur, easeInOutCubic);
  }

  /** 覆盖成新值：文字换掉，描边闪一下强调色。 */
  *setValue(v: string): ThreadGenerator {
    this.value = v;
    yield* chain(
      all(this.node.stroke(T.yellow, 0.25), this.node.scale(1.08, 0.25)),
      all(this.label.text(this.text(), 0), this.label.fill(T.yellow, 0.2)),
      waitFor(0.5),
      all(this.node.stroke(T.blue, 0.4), this.node.scale(1, 0.4), this.label.fill(T.text, 0.4)),
    );
  }

  /** 变灰 + 划掉：旧值、被丢掉的值。 */
  *stale(dur = 0.5): ThreadGenerator {
    if (!this.strike) {
      const w = this.node.width();
      this.strike = new Line({
        key: `qa-ignore-strike-${++strikeSeq}`, // 有意划掉；key 在场景里必须唯一
        points: [
          [-w / 2 + 10, 0],
          [w / 2 - 10, 0],
        ],
        stroke: T.red,
        lineWidth: 3,
        end: 0,
      });
      this.node.add(this.strike);
    }
    yield* all(this.strike.end(1, dur), this.node.opacity(0.45, dur), this.node.stroke(T.line, dur));
  }

  *flash(color: string = T.yellow, hold = 0.4): ThreadGenerator {
    const base = this.node.stroke();
    yield* chain(this.node.stroke(color, 0.2), waitFor(hold), this.node.stroke(base, 0.3));
  }

  *hide(dur = 0.4): ThreadGenerator {
    yield* this.node.opacity(0, dur);
  }

  clone(mode: 'kv' | 'key' = this.mode, opts: {w?: number; tone?: string} = {}): KV {
    const c = new KV(this.key, this.value, mode, opts);
    c.node.position(this.node.position());
    return c;
  }
}

/** 槽位容器：items 按槽位排开（col 从上往下，row 从左往右），frame 是外框。 */
export class Slots {
  items: KV[] = [];
  readonly frame: Rect;
  readonly title: Txt;

  constructor(
    public center: Vector2,
    public readonly dir: 'col' | 'row',
    public readonly cap: number,
    opts: {item?: number; cross?: number; gap?: number; title?: string; tone?: string; dash?: boolean} = {},
  ) {
    this.item = opts.item ?? CHIP_H;
    this.cross = opts.cross ?? 204;
    this.gap = opts.gap ?? 8;
    const along = cap * this.item + (cap - 1) * this.gap + 16;
    const across = this.cross + 16;
    this.frame = new Rect({
      position: center,
      width: dir === 'col' ? across : along,
      height: dir === 'col' ? along : across,
      radius: 12,
      stroke: opts.tone ?? T.line,
      lineWidth: 2,
      lineDash: opts.dash ? [8, 6] : [],
      opacity: 0,
    });
    this.title = new Txt({
      fontSize: SIZE.label,
      fontFamily: FONT.sans,
      fill: T.muted,
      text: opts.title ?? '',
      opacity: 0,
    });
    this.placeTitle();
  }

  private item: number;
  private cross: number;
  private gap: number;

  placeTitle() {
    this.title.position(this.center.add([0, -this.frame.height() / 2 - 18]));
  }

  pos(i: number): Vector2 {
    const off = (i - (this.cap - 1) / 2) * (this.item + this.gap);
    return this.dir === 'col' ? this.center.add([0, off]) : this.center.add([off, 0]);
  }

  /** 把整个容器（外框、标题、里面的块）挪到新位置。 */
  *moveTo(c: PossibleVector2, dur = 0.9): ThreadGenerator {
    const to = new Vector2(c);
    const d = to.sub(this.center);
    this.center = to;
    const half = this.frame.height() / 2;
    yield* all(
      this.frame.position(to, dur, easeInOutCubic),
      this.title.position(to.add([0, -half - 18]), dur, easeInOutCubic),
      ...this.items.map(x => x.node.position(x.node.position().add(d), dur, easeInOutCubic)),
    );
  }

  *show(dur = 0.5): ThreadGenerator {
    yield* all(this.frame.opacity(1, dur), this.title.opacity(1, dur));
  }

  *hide(dur = 0.5): ThreadGenerator {
    yield* all(this.frame.opacity(0, dur), this.title.opacity(0, dur), ...this.items.map(x => x.node.opacity(0, dur)));
  }

  /** 有序插入：其余块先让位，新块再落进它的位置（看得见“排好序”）。 */
  *insertSorted(kv: KV, dur = 0.9): ThreadGenerator {
    let i = this.items.findIndex(x => x.key > kv.key);
    if (i < 0) i = this.items.length;
    this.items.splice(i, 0, kv);
    yield* all(
      ...this.items.filter(x => x !== kv).map(x => x.node.position(this.pos(this.items.indexOf(x)), dur * 0.6, easeInOutCubic)),
      kv.node.position(this.pos(i), dur, easeInOutCubic),
    );
  }

  /** 追加到末尾（日志）。 */
  *append(kv: KV, dur = 0.8): ThreadGenerator {
    this.items.push(kv);
    yield* kv.node.position(this.pos(this.items.length - 1), dur, easeInOutCubic);
  }

  /** 直接放好（不动画），用于场景开头复原上一个场景的状态。 */
  place(kvs: KV[]) {
    this.items = [...kvs];
    kvs.forEach((x, i) => x.node.position(this.pos(i)).opacity(1));
  }

  find(key: string): KV | undefined {
    return this.items.find(x => x.key === key);
  }
}

/** 计量条：竖向，从下往上涨；value 0–1。 */
export class Meter {
  readonly value: SimpleSignal<number>;
  readonly frame: Rect;
  readonly fill: Rect;
  readonly title: Txt;

  constructor(at: PossibleVector2, h: number, opts: {w?: number; title?: string; tone?: string} = {}) {
    const p = new Vector2(at);
    const w = opts.w ?? 16;
    this.value = createSignal(0);
    this.frame = new Rect({position: p, width: w, height: h, radius: w / 2, stroke: T.line, lineWidth: 2, opacity: 0});
    this.fill = new Rect({
      position: p.add([0, h / 2]),
      offset: [0, 1],
      width: w - 6,
      height: () => Math.max(0, (h - 6) * this.value()),
      radius: (w - 6) / 2,
      fill: opts.tone ?? T.green,
      opacity: 0,
    });
    this.title = new Txt({
      position: p.add([0, -h / 2 - 18]),
      fontSize: SIZE.min,
      fontFamily: FONT.sans,
      fill: T.muted,
      text: opts.title ?? '',
      opacity: 0,
    });
  }

  nodes(): Node[] {
    return [this.frame, this.fill, this.title];
  }

  *show(dur = 0.5): ThreadGenerator {
    yield* all(this.frame.opacity(1, dur), this.fill.opacity(1, dur), this.title.opacity(1, dur));
  }

  *to(v: number, dur = 0.6): ThreadGenerator {
    yield* this.value(v, dur, easeInOutCubic);
  }
}

/** 计数器：“前缀 N 后缀”，bump() 加一并弹一下。 */
export class Counter {
  readonly n: SimpleSignal<number>;
  readonly node: Txt;

  constructor(at: PossibleVector2, prefix: string, suffix = '', opts: {size?: number; tone?: string; offset?: PossibleVector2} = {}) {
    this.n = createSignal(0);
    this.node = new Txt({
      position: at,
      offset: opts.offset ?? [0, 0],
      fontSize: opts.size ?? SIZE.label,
      fontFamily: FONT.sans,
      fill: opts.tone ?? T.text,
      text: () => `${prefix}${Math.round(this.n())}${suffix}`,
      opacity: 0,
    });
  }

  *bump(color: string = T.yellow): ThreadGenerator {
    this.n(this.n() + 1);
    const base = this.node.fill();
    yield* chain(all(this.node.scale(1.25, 0.15), this.node.fill(color, 0.15)), all(this.node.scale(1, 0.3), this.node.fill(base, 0.3)));
  }

  *reset(dur = 0.3): ThreadGenerator {
    yield* this.n(0, dur);
  }
}

/** 一行比特位 / 格子（位图、布隆过滤器、哈希槽）。 */
export class Bits {
  readonly cells: Rect[] = [];
  readonly digits: Txt[] = [];
  readonly label: Txt;
  readonly group: Node;
  private on: boolean[];

  private readonly ch: number;

  constructor(
    public readonly at: Vector2,
    public readonly n: number,
    name: string,
    opts: {cell?: number; cellH?: number; font?: number; gap?: number; set?: number[]; index?: boolean} = {},
  ) {
    const cw = opts.cell ?? 20;
    const gap = opts.gap ?? 2;
    this.ch = opts.cellH ?? 26;
    this.on = Array.from({length: n}, (_, i) => (opts.set ?? []).includes(i));
    this.group = new Node({position: at, opacity: 0});
    for (let i = 0; i < n; i++) {
      const d = new Txt({
        fontSize: opts.font ?? SIZE.min,
        fontFamily: FONT.mono,
        fill: this.on[i] ? T.bg : T.muted,
        text: this.on[i] ? '1' : '0',
      });
      const x = (i - (n - 1) / 2) * (cw + gap);
      if (opts.index) {
        this.group.add(
          new Txt({position: [x, this.ch / 2 + 16], fontSize: SIZE.min, fontFamily: FONT.mono, fill: T.line, text: String(i)}),
        );
      }
      const c = new Rect({
        position: [x, 0],
        width: cw,
        height: this.ch,
        radius: 4,
        fill: this.on[i] ? T.green : T.card,
        stroke: T.line,
        lineWidth: 1,
        children: [d],
      });
      this.cells.push(c);
      this.digits.push(d);
      this.group.add(c);
    }
    this.label = new Txt({
      position: [-((n - 1) / 2) * (cw + gap) - cw / 2 - 14, 0],
      offset: [1, 0],
      fontSize: SIZE.min,
      fontFamily: FONT.sans,
      fill: T.muted,
      text: name,
    });
    this.group.add(this.label);
  }

  /** 第 i 个格子顶边中点（world 坐标系下，假定 group 是 world 的直接子节点）。 */
  top(i: number): Vector2 {
    return this.group.position().add(this.cells[i].position()).add([0, -this.ch / 2]);
  }

  /** 格子的世界坐标中心（group 是 world 的直接子节点时）。 */
  center(i: number): Vector2 {
    return this.group.position().add(this.cells[i].position());
  }

  isOn(i: number) {
    return this.on[i];
  }

  *set(idx: number[], dur = 0.35): ThreadGenerator {
    yield* all(
      ...idx.map(i => {
        this.on[i] = true;
        return all(this.cells[i].fill(T.green, dur), this.digits[i].text('1', 0), this.digits[i].fill(T.bg, dur));
      }),
    );
  }

  /** 高亮几个格子（探测时）：0 的格子标红，1 的格子标黄。 */
  *mark(idx: number[], dur = 0.3): ThreadGenerator {
    yield* all(...idx.map(i => all(this.cells[i].stroke(this.on[i] ? T.yellow : T.red, dur), this.cells[i].lineWidth(3, dur))));
  }

  *unmark(idx: number[], dur = 0.3): ThreadGenerator {
    yield* all(...idx.map(i => all(this.cells[i].stroke(T.line, dur), this.cells[i].lineWidth(1, dur))));
  }
}

/** 从 from 画到几个格子顶边的哈希箭头；返回节点，调用方负责 add 与移除。 */
export function hashLines(from: Vector2, bits: Bits, idx: number[]): Line[] {
  return idx.map(
    i =>
      new Line({
        points: [from, bits.top(i)],
        stroke: T.purple,
        lineWidth: 2,
        endArrow: true,
        arrowSize: 8,
        end: 0,
      }),
  );
}

/** 镜头：缩放、平移整个 world 节点（world 的直接子节点坐标就是“世界坐标”）。 */
export class Cam {
  constructor(private readonly world: Node) {}

  *focus(p: PossibleVector2, zoom: number, dur = 1.2): ThreadGenerator {
    const v = new Vector2(p);
    yield* all(this.world.scale(zoom, dur, easeInOutCubic), this.world.position(v.scale(-zoom), dur, easeInOutCubic));
  }

  *reset(dur = 1.2): ThreadGenerator {
    yield* this.focus([0, 0], 1, dur);
  }
}

/** 全景图分区框（虚线）和左上角的分区名。 */
export function zone(center: PossibleVector2, w: number, h: number, name: string): [Rect, Txt] {
  const c = new Vector2(center);
  return [
    new Rect({position: c, width: w, height: h, radius: 18, stroke: T.line, lineWidth: 2, lineDash: [10, 8], opacity: 0}),
    new Txt({
      position: c.add([-w / 2 + 16, -h / 2 + 12]),
      offset: [-1, -1],
      fontSize: SIZE.label,
      fontWeight: 700,
      fontFamily: FONT.sans,
      fill: T.muted,
      text: name,
      opacity: 0,
    }),
  ];
}

/** “延伸 / 示意”角标：原文之外的内容在画面上标出来。 */
export function tag(at: PossibleVector2, text: string, offset: PossibleVector2 = [1, 0]): Rect {
  return new Rect({
    position: at,
    offset,
    layout: true,
    padding: [4, 12],
    radius: 14,
    stroke: T.purple,
    lineWidth: 2,
    opacity: 0,
    children: [new Txt({fontSize: SIZE.min, fontFamily: FONT.sans, fill: T.purple, text})],
  });
}

/** 一串块依次做同一个动作，每个间隔 gap 秒。 */
export function* stagger(gap: number, ...anims: ThreadGenerator[]): ThreadGenerator {
  yield* sequence(gap, ...anims);
}
