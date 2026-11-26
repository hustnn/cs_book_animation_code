// 开篇与站牌：整章第一拍的章标题、全章路线图、每个单元第一拍的站牌。复制到 motion-canvas/src/lib/opening.tsx。
// 为什么要有：观众一打开视频就被扔进第一个机制，不知道这章讲什么、分几部分、现在讲到哪——开头显得突兀，
// 中途也容易迷路。规则见 SKILL.md 第 2 步“开篇与站牌”，样本见 examples/opening/（整章开篇）和 examples/lsm/（单元站牌）。
//
//   ChapterTitle  整章第一拍：章号 + 章名（+ 原名），下一拍收成左上角的页眉
//   Roadmap       全章路线图：2–4 个部分，一部分一行——部分名、它回答的问题、一串站（一个单元一站）。
//                 开篇逐部分点亮（showRow），旁白念到哪站哪站闪（pulseStop）；focus(站) 标出“下一站”；
//                 末单元用 complete() 全部点亮、收束全章
//   UnitTitle     每个单元第一拍：“章名 · 第 k 站 / 共 n 站” + 单元标题 + 迷你路线条（走过的、当前、没到的），
//                 下一拍收成左上角的页眉
//
// 章的数据（部分、站）一章一份，写在 src/lib/chapter.ts，所有场景共用（样本：examples/opening/scenes/chapter.ts）。
// 站的 id 是内部编号（不上屏）；name 是路线图上的站名（≤ 5 个字）；title 是单元标题（站牌和页眉用）。
// 页眉和场景里常见的左上角标题同一个位置、同一个样式（安全区左上角，SIZE.label，muted），收起后画面无缝接上。
// 收起用淡出 + 缩小，不把大标题飞到角落：大字在 0.5s 内走几百像素会被渲染 QA 记 fast-move。
// 约定同 schemas.ts：所有节点创建时 opacity 0，由场景决定什么时候出现。
import {Circle, Line, Node, Txt} from '@motion-canvas/2d';
import {ThreadGenerator, all, chain, easeOutBack, easeOutCubic, sequence, waitFor} from '@motion-canvas/core';
import {FONT, SAFE, SIZE, T} from './theme';

export interface Stop {
  id: string; // 内部编号，如 'u3'（不上屏）
  name: string; // 路线图上的站名，≤ 5 个字
  title: string; // 单元标题：站牌和页眉用
}
export interface Part {
  title: string; // 部分名
  question: string; // 这一部分回答的问题（一句）
  stops: Stop[];
}
export interface Chapter {
  number?: number; // 章号，上屏为“第 N 章”
  title: string; // 章名
  en?: string; // 原书章名（可选）
  parts: Part[];
}

const DIGITS = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
/** 1–99 的中文数字：路线图的部分序号。 */
export function cnNum(n: number): string {
  if (n < 10) return DIGITS[n];
  const tens = Math.floor(n / 10);
  return `${tens > 1 ? DIGITS[tens] : ''}十${n % 10 ? DIGITS[n % 10] : ''}`;
}

/** 左上角页眉：开篇和站牌收起后留在这里。 */
export function pageHeader(text: string): Txt {
  return new Txt({
    position: [-SAFE.halfW, -SAFE.halfH],
    offset: [-1, -1],
    fontSize: SIZE.label,
    fill: T.muted,
    fontFamily: FONT.sans,
    text,
    opacity: 0,
  });
}

/** 按 id 找站：[部分序号, 部分内序号, 全章序号（从 1 起）, 全章站数]。 */
export function locate(ch: Chapter, id: string): [number, number, number, number] {
  let k = 0;
  let found: [number, number, number] | null = null;
  ch.parts.forEach((p, i) =>
    p.stops.forEach((s, j) => {
      k += 1;
      if (s.id === id) found = [i, j, k];
    }),
  );
  if (!found) throw new Error(`chapter.ts 里没有站 ${id}`);
  const [i, j, idx] = found;
  return [i, j, idx, k];
}

// ---------------------------------------------------------------- 章标题

export class ChapterTitle {
  readonly root: Node;
  readonly kicker: Txt;
  readonly title: Txt;
  readonly en: Txt;
  readonly rule: Line;
  readonly header: Txt;

  constructor(ch: Chapter, opts: {y?: number} = {}) {
    const y = opts.y ?? -20;
    this.kicker = new Txt({
      y: y - 96,
      fontSize: SIZE.label + 4,
      fontFamily: FONT.sans,
      fill: T.yellow,
      text: ch.number ? `第 ${ch.number} 章` : '',
      opacity: 0,
    });
    this.title = new Txt({
      y,
      fontSize: 72,
      fontWeight: 700,
      fontFamily: FONT.serif,
      fill: T.white,
      text: ch.title,
      maxWidth: SAFE.width,
      textWrap: true,
      textAlign: 'center',
      opacity: 0,
    });
    this.rule = new Line({
      points: [
        [-170, y + 62],
        [170, y + 62],
      ],
      stroke: T.yellow,
      lineWidth: 3,
      lineCap: 'round',
      end: 0,
      opacity: 0,
    });
    this.en = new Txt({
      y: y + 104,
      fontSize: SIZE.label,
      fontFamily: FONT.mono,
      fill: T.muted,
      text: ch.en ?? '',
      opacity: 0,
    });
    this.header = pageHeader(ch.number ? `第 ${ch.number} 章 · ${ch.title}` : ch.title);
    this.root = new Node({children: [this.kicker, this.title, this.rule, this.en]});
  }

  nodes(): Node[] {
    return [this.root, this.header];
  }

  /** 章号淡入 → 章名浮现 → 下划线展开 → 原名淡入，约 1.6s。 */
  *enter(): ThreadGenerator {
    this.title.scale(0.94);
    yield* all(
      this.kicker.opacity(1, 0.5),
      chain(waitFor(0.25), all(this.title.opacity(1, 0.8), this.title.scale(1, 0.8, easeOutCubic))),
      chain(waitFor(0.7), all(this.rule.opacity(1, 0.1), this.rule.end(1, 0.6, easeOutCubic))),
      chain(waitFor(1.0), this.en.opacity(1, 0.6)),
    );
  }

  /** 大标题收起，左上角页眉亮起（原地淡出，不飞）。 */
  *toHeader(dur = 0.8): ThreadGenerator {
    yield* all(
      this.root.opacity(0, dur),
      this.title.scale(0.9, dur),
      chain(waitFor(dur * 0.4), this.header.opacity(1, dur * 0.6)),
    );
  }
}

// ---------------------------------------------------------------- 路线图

interface RowNodes {
  node: Node;
  title: Txt;
  question: Txt;
  track: Line;
  dots: Circle[];
  names: Txt[];
}

export class Roadmap {
  readonly root: Node;
  readonly rows: RowNodes[] = [];
  readonly ring: Circle;
  readonly flag: Txt;

  /**
   * 一部分一行：左边是部分名和它回答的问题，右边是一条线上的一串站。
   * 站多（间距 < 100px）时站名上下交替摆，免得挤在一起。
   */
  constructor(
    private readonly ch: Chapter,
    opts: {center?: [number, number]; rowH?: number; leftW?: number; maxGap?: number} = {},
  ) {
    const [cx, cy] = opts.center ?? [0, 30];
    const rowH = opts.rowH ?? 120;
    const leftW = opts.leftW ?? 400;
    const maxGap = opts.maxGap ?? 112;
    const x0 = cx - SAFE.halfW + leftW + 50;
    const x1 = cx + SAFE.halfW - 20;
    const n = ch.parts.length;
    ch.parts.forEach((part, i) => {
      const y = cy + (i - (n - 1) / 2) * rowH;
      const gap = Math.min((x1 - x0) / part.stops.length, maxGap);
      const alternate = gap < 100;
      // 部分名往上长、问题往下长：任一个折成两行都不会压到对方
      const title = new Txt({
        position: [cx - SAFE.halfW, y - 4],
        offset: [-1, 1],
        fontSize: SIZE.body - 2,
        fontWeight: 700,
        fontFamily: FONT.sans,
        fill: T.text,
        text: `${cnNum(i + 1)}、${part.title}`,
        maxWidth: leftW,
        textWrap: true,
      });
      const question = new Txt({
        position: [cx - SAFE.halfW, y + 6],
        offset: [-1, -1],
        fontSize: SIZE.min + 2,
        fontFamily: FONT.sans,
        fill: T.muted,
        text: part.question,
        maxWidth: leftW,
        textWrap: true,
      });
      const track = new Line({
        points: [
          [x0 - 16, y],
          [x0 + gap * (part.stops.length - 1) + 16, y],
        ],
        stroke: T.line,
        lineWidth: 4,
        lineCap: 'round',
        end: 0,
      });
      const dots: Circle[] = [];
      const names: Txt[] = [];
      part.stops.forEach((s, j) => {
        const x = x0 + gap * j;
        const below = !alternate || j % 2 === 0;
        dots.push(new Circle({position: [x, y], size: 20, fill: T.bg, stroke: T.blue, lineWidth: 3, scale: 0}));
        names.push(
          new Txt({
            position: [x, y + (below ? 32 : -32)],
            fontSize: SIZE.min,
            fontFamily: FONT.sans,
            fill: T.muted,
            text: s.name,
            maxWidth: alternate ? gap * 2 - 12 : gap - 8,
            opacity: 0,
          }),
        );
      });
      const node = new Node({opacity: 0, children: [track, title, question, ...dots, ...names]});
      this.rows.push({node, title, question, track, dots, names});
    });
    this.ring = new Circle({size: 36, stroke: T.yellow, lineWidth: 3, opacity: 0});
    this.flag = new Txt({fontSize: SIZE.min, fontWeight: 700, fontFamily: FONT.sans, fill: T.yellow, text: '下一站', opacity: 0});
    this.root = new Node({children: [...this.rows.map(r => r.node), this.ring, this.flag]});
  }

  nodes(): Node[] {
    return [this.root];
  }

  /** 第 i 部分：名字和问题出现，线从左往右长出来，站一个个冒出来（约 dur 秒）。 */
  *showRow(i: number, dur = 1.8): ThreadGenerator {
    const r = this.rows[i];
    const each = Math.min(0.35, (dur * 0.6) / Math.max(1, r.dots.length));
    yield* all(
      r.node.opacity(1, 0.3),
      r.title.opacity(0).opacity(1, 0.5),
      chain(waitFor(0.3), r.question.opacity(0).opacity(1, 0.5)),
      chain(waitFor(0.2), r.track.end(1, dur * 0.5, easeOutCubic)),
      chain(
        waitFor(dur * 0.3),
        sequence(
          each,
          ...r.dots.map((d, j) => all(d.scale(1, 0.35, easeOutBack), r.names[j].opacity(1, 0.35))),
        ),
      ),
    );
  }

  /** 部分 i 闪一下（旁白念到它时提示观众看哪一行）。 */
  *pulseRow(i: number): ThreadGenerator {
    const r = this.rows[i];
    yield* chain(r.title.fill(T.yellow, 0.25), r.title.fill(T.text, 0.5));
  }

  /** 某一站闪一下（旁白念到这一站时）：站名变黄、圆点弹一下，再恢复。 */
  *pulseStop(id: string): ThreadGenerator {
    const [i, j] = locate(this.ch, id);
    const dot = this.rows[i].dots[j];
    const name = this.rows[i].names[j];
    yield* all(
      chain(name.fill(T.yellow, 0.25), waitFor(0.5), name.fill(T.muted, 0.5)),
      chain(all(dot.scale(1.4, 0.25), dot.fill(T.yellow, 0.25)), waitFor(0.5), all(dot.scale(1, 0.4), dot.fill(T.bg, 0.4))),
    );
  }

  /** 标出某一站：其余各行压暗，这一站变黄、套一个圈，旁边写“下一站”（或别的提示）。 */
  *focus(id: string, label = '下一站', dur = 0.8): ThreadGenerator {
    const [i, j] = locate(this.ch, id);
    const r = this.rows[i];
    const dot = r.dots[j];
    const nameBelow = r.names[j].y() > dot.y();
    this.ring.position(dot.position()).scale(1.3);
    this.flag.text(label).position(dot.position().addY(nameBelow ? -34 : 34));
    yield* all(
      ...this.rows.map((row, k) => row.node.opacity(k === i ? 1 : 0.35, dur)),
      ...r.dots.map((d, k) => (k === j ? d.fill(T.yellow, dur) : d.opacity(0.5, dur))),
      ...r.names.map((t, k) => (k === j ? t.fill(T.yellow, dur) : t.opacity(0.5, dur))),
      all(this.ring.opacity(1, dur), this.ring.scale(1, dur, easeOutCubic)),
      chain(waitFor(dur * 0.5), this.flag.opacity(1, dur * 0.5)),
    );
  }

  /** 末单元收束全章：所有站点亮成实心，各行恢复。 */
  *complete(dur = 1.2): ThreadGenerator {
    yield* all(
      this.ring.opacity(0, 0.3),
      this.flag.opacity(0, 0.3),
      ...this.rows.map(r => r.node.opacity(1, 0.4)),
      sequence(
        dur / Math.max(1, this.rows.flatMap(r => r.dots).length),
        ...this.rows.flatMap(r => r.dots.map(d => all(d.opacity(1, 0.3), d.fill(T.blue, 0.3)))),
      ),
    );
  }

  /** 整张图淡出。 */
  *hide(dur = 0.6): ThreadGenerator {
    yield* this.root.opacity(0, dur);
  }
}

// ---------------------------------------------------------------- 单元站牌

export class UnitTitle {
  readonly root: Node;
  readonly kicker: Txt;
  readonly title: Txt;
  readonly part: Txt;
  readonly dots: Circle[] = [];
  readonly ring: Circle;
  readonly header: Txt;

  /**
   * ch 给了：上方写“章名 · 第 k 站 / 共 n 站”，下方画全章的迷你路线条（按部分分组，走过的实心、当前黄色带圈、没到的空心）。
   * ch 为 null（不属于某一章的独立视频，如技法图库）：只有 opts.kicker 和标题。
   */
  constructor(ch: Chapter | null, id: string | null, opts: {title?: string; kicker?: string; header?: string; y?: number} = {}) {
    const y = opts.y ?? -30;
    let title = opts.title ?? '';
    let kicker = opts.kicker ?? '';
    let partLine = '';
    let current = -1;
    if (ch && id) {
      const [i, j, k, n] = locate(ch, id);
      const stop = ch.parts[i].stops[j];
      title = opts.title ?? stop.title;
      kicker = opts.kicker ?? `${ch.title} · 第 ${k} 站 / 共 ${n} 站`;
      partLine = `${cnNum(i + 1)}、${ch.parts[i].title}`;
      current = k - 1;
      // 迷你路线条：站距 26px，部分之间多空 22px
      const total = ch.parts.reduce((s, p) => s + p.stops.length, 0);
      const width = (total - 1) * 26 + (ch.parts.length - 1) * 22;
      let x = -width / 2;
      let idx = 0;
      ch.parts.forEach((p, pi) => {
        if (pi > 0) x += 22;
        p.stops.forEach(() => {
          const done = idx < current;
          const here = idx === current;
          this.dots.push(
            new Circle({
              position: [x, y + 84],
              size: here ? 16 : 10,
              fill: here ? T.yellow : done ? T.blue : T.bg,
              stroke: here ? T.yellow : done ? T.blue : T.line,
              lineWidth: 2,
              scale: 0,
            }),
          );
          x += 26;
          idx += 1;
        });
      });
    }
    this.kicker = new Txt({
      y: y - 62,
      fontSize: SIZE.label,
      fontFamily: FONT.sans,
      fill: T.muted,
      text: kicker,
      opacity: 0,
    });
    this.title = new Txt({
      y,
      fontSize: SIZE.title + 6,
      fontWeight: 700,
      fontFamily: FONT.sans,
      fill: T.white,
      text: title,
      maxWidth: SAFE.width - 80,
      textWrap: true,
      textAlign: 'center',
      opacity: 0,
    });
    this.part = new Txt({
      y: y + 122,
      fontSize: SIZE.min + 2,
      fontFamily: FONT.sans,
      fill: T.blue,
      text: partLine,
      opacity: 0,
    });
    this.ring = new Circle({
      position: current >= 0 ? this.dots[current].position() : [0, 0],
      size: 28,
      stroke: T.yellow,
      lineWidth: 2,
      opacity: 0,
    });
    this.header = pageHeader(opts.header ?? title);
    this.root = new Node({children: [this.kicker, this.title, this.part, ...this.dots, this.ring]});
  }

  nodes(): Node[] {
    return [this.root, this.header];
  }

  /** 位置行淡入 → 标题浮现 → 路线条从左到右点出来、当前站套圈，约 1.6s。 */
  *enter(): ThreadGenerator {
    this.title.scale(0.94);
    const each = this.dots.length ? Math.min(0.05, 0.7 / this.dots.length) : 0;
    yield* all(
      this.kicker.opacity(1, 0.5),
      chain(waitFor(0.2), all(this.title.opacity(1, 0.7), this.title.scale(1, 0.7, easeOutCubic))),
      chain(waitFor(0.6), sequence(each, ...this.dots.map(d => d.scale(1, 0.3, easeOutBack)))),
      chain(waitFor(1.0), all(this.part.opacity(1, 0.5), this.ring.opacity(this.dots.length ? 1 : 0, 0.5))),
    );
  }

  /** 站牌收起，左上角页眉亮起（原地淡出，不飞）。 */
  *toHeader(dur = 0.8): ThreadGenerator {
    yield* all(
      this.root.opacity(0, dur),
      this.title.scale(0.9, dur),
      chain(waitFor(dur * 0.4), this.header.opacity(1, dur * 0.6)),
    );
  }
}
