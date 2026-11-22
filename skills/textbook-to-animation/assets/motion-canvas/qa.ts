// 渲染 QA：自动检查“文字有没有被图形压住、被线穿过、彼此重叠、出画”，以及动画是否超过旁白。
// 复制到 motion-canvas/src/lib/qa.ts（与 beats.ts 同目录）。
//
// 只在 QA 模式下运行：`node scripts/render.mjs <场景> --qa` → headless.ts 设置 window.__MC_QA__。
// beat() 在每一拍的 5 个时刻（拍首 +0.15s、25%、50%、75%、拍末 −0.15s）调用 qaCheck，
// 只读场景树、不改任何属性，所以 QA 渲染出的画面和时长与正常渲染完全一致。
// 结果写进 window.__qaReport，由 render.mjs 存成 output/<场景>.qa.json。
//
// 判定（文字框四边各内缩 2px，避免“贴边”误报；文字和图形的重叠在图形自身坐标系里按精确多边形求交，
// 圆按 32 边形，旋转也不影响；坐标是世界坐标，原点在画面左上角）：
//   covered       error  不透明图形画在文字之上（绘制顺序更靠后），盖住文字框 ≥ 2%
//   crossed       error  线（Line、Spline、贝塞尔等）从文字框中间穿过；线若被文字下面的不透明底板挡住则不算
//   edge          error  文字骑在图形的边上（10%–90% 在图形里），压住 ≥ 10%；
//                        图形在下层时文字压着边框，在上层且只有描边时边框从文字中间穿过
//   text-overlap  error  两段文字互相重叠 ≥ 15%（较小那段的面积）
//   offscreen     error  文字超出画面
//   overrun       error  这一拍的动画比旁白长，被顺延了
//   idle          error  动画做完后这一拍还要静止 ≥ 6s（3–6s 为 warn）：旁白在讲、画面不动
//   orphan        error  用 attach() 挂上的标签已经看得清，它说明的对象却还没出现（透明、宽或高不到 1px）或已退场
// 降为 warn 的情况（仍会列出，供对照联系表扫一眼）：
//   - 转场叠化：文字或图形的不透明度 < 0.6；
//   - 半透明高亮：画在文字之上的填充，实际不透明度（节点 × 颜色 alpha）< 0.5，文字仍看得清；
//   - 遮罩层：用画面背景色填充、或盖住半个画面以上的图形（雾、暗场、擦除）——本来就是要挡住下面的内容；
//   - 瞬时：同一对元素只在一个采样点重叠（元素正在飞入、散开、穿过），持续到第二个采样点才算 error。
//     判断“同一对”按节点身份，不按坐标，所以正在变长的柱子压字也会被认作持续的同一个问题。
// 有意的划掉、打叉、遮罩：给那个节点设 key="qa-ignore-<说明>"，它和它的子节点都不参与检查。

import {Circle, Curve, Node, Polygon, Rect, Shape, Txt, useScene2D} from '@motion-canvas/2d';
import {BBox, ThreadGenerator, Vector2, useScene, useTime, waitFor} from '@motion-canvas/core';

export type QaKind = 'covered' | 'crossed' | 'text-overlap' | 'offscreen' | 'edge' | 'overrun' | 'idle' | 'orphan';

export interface QaFinding {
  scene: string;
  beat: string;
  kind: QaKind;
  severity: 'error' | 'warn';
  text: string;
  other?: string;
  ratio?: number;
  note?: string;
  /** 另一方节点的 key：按节点身份去重（坐标会随动画变化） */
  otherId?: string;
  times: number[];
}

const g = globalThis as any;

/**
 * 判定阈值。每一项都对应一条与具体教材无关的视觉规则（理由见 references/qa-rules.md）；
 * 要调整时先在 qa-fixtures 里加一个能复现问题的用例，改完跑 scripts/qa_selftest.py 全部通过再用。
 * 工程里也可以在 project.ts 里设 globalThis.__MC_QA_CONFIG__ = {...} 临时覆盖。
 */
export const QA_CONFIG = {
  /** 不透明度低于它视为正在淡入淡出（转场叠化），此时的重叠只记 warn */
  solid: 0.6,
  /** 压在文字上的填充实际不透明度（节点 × 颜色 alpha）低于它视为半透明高亮，文字仍可读，记 warn */
  translucent: 0.5,
  /** 图形盖住文字框的比例低于它忽略（抗锯齿、描边外扩带来的贴边） */
  coverMin: 0.02,
  /** 文字框落在图形里的比例在 [edgeMin, insideMax) 之间算“骑在边上” */
  edgeMin: 0.1,
  insideMax: 0.9,
  /** 两段文字的重叠面积占较小那段的比例，超过算互叠 */
  overlapMin: 0.15,
  /** 填充色等于画面背景色、或面积超过画面这个比例的图形，视为遮罩层（有意遮挡），记 warn */
  maskArea: 0.5,
  /** 同一对元素至少在这么多个采样点出现才算 error；更少视为瞬时（飞过、散开） */
  minSamples: 2,
  /** 动画做完后到这一拍结束的静止时长：≥ idleWarn 记 warn，≥ idleError 记 error */
  idleWarn: 3,
  idleError: 6,
  /** attach() 的对象宽或高小于它（像素）视为还没出现：标签不该先于对象出现 */
  subjectMin: 1,
};

const cfg = () => ({...QA_CONFIG, ...(g.__MC_QA_CONFIG__ ?? {})});

export function qaEnabled(): boolean {
  return !!g.__MC_QA__;
}

function report(f: Omit<QaFinding, 'times'>, t: number) {
  const list: QaFinding[] = (g.__qaReport ??= []);
  const id = (x: {scene: string; beat: string; kind: string; text: string; otherId?: string; other?: string}) =>
    `${x.scene}|${x.beat}|${x.kind}|${x.text}|${x.otherId ?? x.other ?? ''}`;
  const key = id(f);
  let hit = list.find(x => id(x) === key);
  if (!hit) {
    hit = {...f, times: []};
    list.push(hit);
  } else {
    if (f.severity === 'error' && hit.severity === 'warn') {
      hit.severity = 'error';
      hit.note = f.note;
    }
    hit.other = f.other; // 显示最近一次的位置
  }
  const time = Math.round(t * 100) / 100;
  if (!hit.times.includes(time)) hit.times.push(time);
  hit.ratio = Math.max(hit.ratio ?? 0, f.ratio ?? 0) || undefined;
}

/** 渲染结束后由 render.mjs 调用：只在一个采样点出现的重叠降为 warn（瞬时），返回最终报告。 */
g.__qaFinalize = (): QaFinding[] => {
  const list: QaFinding[] = g.__qaReport ?? [];
  for (const f of list) {
    if (f.kind !== 'overrun' && f.kind !== 'idle' && f.severity === 'error' && f.times.length < cfg().minSamples) {
      f.severity = 'warn';
      f.note = '瞬时：只在一个采样点出现';
    }
  }
  return list;
};

/** 动画做完后，这一拍还要静止 idle 秒（旁白还在讲、画面不动）。 */
export function qaReportIdle(beat: string, idle: number, dur: number) {
  if (!qaEnabled()) return;
  const c = cfg();
  if (idle < c.idleWarn) return;
  report(
    {
      scene: useScene().name,
      beat,
      kind: 'idle',
      severity: idle >= c.idleError ? 'error' : 'warn',
      text: `动画做完后静止 ${idle.toFixed(1)}s（这一拍 ${dur.toFixed(1)}s）`,
      note: '把动作跟着旁白分步展开（at(phrase, …)），或加一段持续的慢动作',
    },
    useTime(),
  );
}

export function qaReportOverrun(beat: string, spent: number, dur: number) {
  if (!qaEnabled()) return;
  report(
    {
      scene: useScene().name,
      beat,
      kind: 'overrun',
      severity: 'error',
      text: `动画 ${spent.toFixed(2)}s > 旁白 ${dur.toFixed(2)}s`,
    },
    useTime(),
  );
}

// ---------- 几何 ----------

interface Box {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

const area = (b: Box) => Math.max(0, b.x1 - b.x0) * Math.max(0, b.y1 - b.y0);
const shrink = (b: Box, d: number): Box => ({x0: b.x0 + d, y0: b.y0 + d, x1: b.x1 - d, y1: b.y1 - d});
const inter = (a: Box, b: Box): Box => ({
  x0: Math.max(a.x0, b.x0),
  y0: Math.max(a.y0, b.y0),
  x1: Math.min(a.x1, b.x1),
  y1: Math.min(a.y1, b.y1),
});
const contains = (outer: Box, inner: Box) =>
  inner.x0 >= outer.x0 && inner.y0 >= outer.y0 && inner.x1 <= outer.x1 && inner.y1 <= outer.y1;

function aabb(pts: Vector2[]): Box {
  const xs = pts.map(p => p.x);
  const ys = pts.map(p => p.y);
  return {x0: Math.min(...xs), y0: Math.min(...ys), x1: Math.max(...xs), y1: Math.max(...ys)};
}

/** 节点自身内容（不含子节点）的本地包围盒。 */
function localBox(node: Node): Box {
  const b: BBox = (node as any).getCacheBBox();
  return {x0: b.x, y0: b.y, x1: b.x + b.width, y1: b.y + b.height};
}

/** 节点自身内容四角在世界坐标里的位置（各边先内缩 inset）；节点旋转时是一个斜的四边形。 */
function worldQuad(node: Node, inset = 0): Vector2[] {
  const b: BBox = (node as any).getCacheBBox();
  const r = new BBox(b.x + inset, b.y + inset, Math.max(0, b.width - 2 * inset), Math.max(0, b.height - 2 * inset));
  return r.transformCorners(node.localToWorld());
}

function worldBox(node: Node): Box {
  return aabb(worldQuad(node));
}

type P = {x: number; y: number};

function polyArea(p: P[]): number {
  let s = 0;
  for (let i = 0; i < p.length; i++) {
    const j = (i + 1) % p.length;
    s += p[i].x * p[j].y - p[j].x * p[i].y;
  }
  return Math.abs(s) / 2;
}

/** Sutherland–Hodgman：用凸多边形 clip 裁剪多边形 subject，返回交集多边形。 */
function clipPoly(subject: P[], clip: P[]): P[] {
  // 统一成逆时针，内侧 = 叉积 ≥ 0
  let signed = 0;
  for (let i = 0; i < clip.length; i++) {
    const j = (i + 1) % clip.length;
    signed += clip[i].x * clip[j].y - clip[j].x * clip[i].y;
  }
  const c = signed < 0 ? [...clip].reverse() : clip;
  let out = subject;
  for (let i = 0; i < c.length && out.length; i++) {
    const a = c[i];
    const b = c[(i + 1) % c.length];
    const inside = (p: P) => (b.x - a.x) * (p.y - a.y) - (b.y - a.y) * (p.x - a.x) >= 0;
    const cross = (p: P, q: P): P => {
      const a1 = b.y - a.y;
      const b1 = a.x - b.x;
      const c1 = a1 * a.x + b1 * a.y;
      const a2 = q.y - p.y;
      const b2 = p.x - q.x;
      const c2 = a2 * p.x + b2 * p.y;
      const det = a1 * b2 - a2 * b1;
      return det === 0 ? p : {x: (b2 * c1 - b1 * c2) / det, y: (a1 * c2 - a2 * c1) / det};
    };
    const input = out;
    out = [];
    for (let k = 0; k < input.length; k++) {
      const cur = input[k];
      const prev = input[(k + input.length - 1) % input.length];
      if (inside(cur)) {
        if (!inside(prev)) out.push(cross(prev, cur));
        out.push(cur);
      } else if (inside(prev)) {
        out.push(cross(prev, cur));
      }
    }
  }
  return out;
}

/** 图形在自身坐标系里的轮廓：圆/椭圆用 32 边形，其他按包围矩形（圆角忽略）。 */
function outline(n: Node, b: Box): P[] {
  if (n instanceof Circle) {
    const cx = (b.x0 + b.x1) / 2;
    const cy = (b.y0 + b.y1) / 2;
    const rx = (b.x1 - b.x0) / 2;
    const ry = (b.y1 - b.y0) / 2;
    return Array.from({length: 32}, (_, i) => ({
      x: cx + rx * Math.cos((2 * Math.PI * i) / 32),
      y: cy + ry * Math.sin((2 * Math.PI * i) / 32),
    }));
  }
  return [
    {x: b.x0, y: b.y0},
    {x: b.x1, y: b.y0},
    {x: b.x1, y: b.y1},
    {x: b.x0, y: b.y1},
  ];
}

function segmentHitsBox(a: Vector2, b: Vector2, r: Box): boolean {
  // Liang–Barsky 线段裁剪：线段与矩形内部有交集即为穿过
  let t0 = 0;
  let t1 = 1;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const edges: [number, number][] = [
    [-dx, a.x - r.x0],
    [dx, r.x1 - a.x],
    [-dy, a.y - r.y0],
    [dy, r.y1 - a.y],
  ];
  for (const [p, q] of edges) {
    if (p === 0) {
      if (q < 0) return false;
    } else {
      const t = q / p;
      if (p < 0) t0 = Math.max(t0, t);
      else t1 = Math.min(t1, t);
      if (t0 > t1) return false;
    }
  }
  return true;
}

function curvePoints(c: Curve): Vector2[] {
  const m = c.localToWorld();
  const from = c.start();
  const to = c.end();
  if (to - from <= 0.001) return [];
  const n = 32;
  const out: Vector2[] = [];
  for (let i = 0; i <= n; i++) {
    const p = c.getPointAtPercentage(from + ((to - from) * i) / n).position;
    out.push(p.transformAsPoint(m));
  }
  return out;
}

/** 填充/描边的 alpha：null、空串、完全透明返回 0；渐变、图案等无法判断的按 1。 */
function paintAlpha(v: any): number {
  if (v === null || v === undefined || v === '') return 0;
  if (typeof v.alpha === 'function') return v.alpha();
  return 1;
}

function describe(n: Node, b: Box): string {
  const cx = Math.round((b.x0 + b.x1) / 2);
  const cy = Math.round((b.y0 + b.y1) / 2);
  const name = n.constructor.name;
  const txt = n instanceof Txt ? ` “${textOf(n).slice(0, 16)}”` : '';
  // 自动生成的 key 形如 “场景/Rect2[10]”，没有定位价值；只显示手写的 key
  const key = n.key && !n.key.includes('[') ? ` #${n.key}` : '';
  return `${name}${key}${txt} @(${cx},${cy})`;
}

function textOf(t: Txt): string {
  const own = t.text();
  if (own && own.trim()) return own;
  // TxtLeaf 在 3.17 里没有从包入口导出，按结构判断
  return t
    .peekChildren()
    .filter(c => !(c instanceof Txt) && typeof (c as any).text === 'function')
    .map(c => String((c as any).text()))
    .join('');
}

function isAncestor(maybe: Node, n: Node): boolean {
  for (let p = n.parent(); p; p = p.parent()) if (p === maybe) return true;
  return false;
}

interface Item {
  node: Node;
  order: number;
  box: Box;
  opacity: number;
}

// ---------- 检查 ----------

export function qaCheck(beat: string) {
  const view = useScene2D().getView();
  const scene = useScene().name;
  const t = useTime();
  // 世界坐标的原点在画面左上角，画面范围就是 view 自身的世界包围盒
  const frame: Box = shrink(worldBox(view), -2);
  const c = cfg();
  const bg = view.fill();
  const frameArea = area(frame);
  const sameColor = (a: any, b: any) =>
    !!a && !!b && typeof a.hex === 'function' && typeof b.hex === 'function' && a.hex().slice(0, 7) === b.hex().slice(0, 7);

  const texts: (Item & {quad: Vector2[]})[] = [];
  const shapes: (Item & {fillAlpha: number; poly: P[]; toLocal: DOMMatrix; mask: boolean})[] = [];
  const curves: (Item & {pts: Vector2[]})[] = [];
  let order = 0;

  const visit = (n: Node) => {
    const opacity = n.absoluteOpacity();
    if (opacity < 0.05) return; // 整棵子树看不见
    if (n.key.startsWith('qa-ignore')) return;
    const myOrder = order++;
    if (n instanceof Txt) {
      if (textOf(n).trim()) {
        const quad = worldQuad(n, 2);
        texts.push({node: n, order: myOrder, box: aabb(quad), opacity, quad});
      }
      return; // TxtLeaf 不单独检查
    }
    // Rect、Circle、Polygon 在 Motion Canvas 里也继承自 Curve（为了能“描边画出来”），
    // 但它们是面状图形，按包围盒和绘制顺序判断；只有线条类（Line、Spline、贝塞尔、Ray、Path）按折线判断
    const isLine = n instanceof Curve && !(n instanceof Rect || n instanceof Circle || n instanceof Polygon);
    if (isLine) {
      const pts = curvePoints(n as Curve);
      if (pts.length > 1) curves.push({node: n, order: myOrder, box: worldBox(n), opacity, pts});
    } else if (n instanceof Shape && n !== view) {
      const fillAlpha = paintAlpha(n.fill());
      const stroked = paintAlpha(n.stroke()) > 0 && n.lineWidth() > 0;
      if (fillAlpha > 0 || stroked) {
        shapes.push({
          node: n,
          order: myOrder,
          box: worldBox(n),
          opacity,
          fillAlpha,
          poly: outline(n, localBox(n)),
          toLocal: n.worldToLocal(),
          // 遮罩层：用背景色填充（“擦掉”下面的内容），或大到盖住半个画面以上——都是有意遮挡
          mask: fillAlpha > 0 && (sameColor(n.fill(), bg) || area(worldBox(n)) >= c.maskArea * frameArea),
        });
      }
    }
    const kids = [...n.peekChildren()].sort((a, b) => a.zIndex() - b.zIndex());
    kids.forEach(visit);
  };
  visit(view);

  for (const tx of texts) {
    const tb = tx.box; // 已内缩 2px
    const ta = area(tb);
    if (ta <= 0) continue;
    const label = textOf(tx.node as Txt).slice(0, 24);

    if (!contains(frame, tb)) {
      report({scene, beat, kind: 'offscreen', severity: 'error', text: label}, t);
    }

    // attach() 记下了标签说明的对象：标签已经看得清，对象却还没出现（透明、宽或高≈0）或已经退场
    const subject: Node | undefined = (tx.node as any).__qaSubject;
    if (subject && tx.opacity >= c.solid) {
      const sb = worldBox(subject);
      if (subject.absoluteOpacity() < 0.05 || Math.min(sb.x1 - sb.x0, sb.y1 - sb.y0) < c.subjectMin) {
        const note = '标签和它说明的对象一起出现、一起退场';
        report({scene, beat, kind: 'orphan', severity: 'error', text: label, other: describe(subject, sb), otherId: subject.key, note}, t);
      }
    }

    // 画在文字下面、完整托住文字的不透明底板里最靠上的那个：比它更早画的线被底板挡住，不算穿过文字
    let backing = -1;
    for (const s of shapes) {
      // 在图形自己的坐标系里，用文字四边形和图形轮廓求精确交集：图形或文字旋转时都不会因外接矩形变大而误报
      const tq: P[] = tx.quad.map(p => p.transformAsPoint(s.toLocal));
      const tqa = polyArea(tq);
      if (!(tqa > 0)) continue;
      const ratio = polyArea(clipPoly(tq, s.poly)) / tqa;
      const inside = ratio >= 0.98;
      if (inside && s.order < tx.order && s.opacity * s.fillAlpha >= 0.9) backing = Math.max(backing, s.order);
      if (isAncestor(s.node, tx.node)) continue; // 文字在自己的卡片里
      if (ratio < c.coverMin) continue;
      const other = describe(s.node, s.box);
      const fading = Math.min(tx.opacity, s.opacity) < c.solid;
      if (s.order > tx.order && s.fillAlpha > 0) {
        // 有填充的图形画在文字上面
        const translucent = s.opacity * s.fillAlpha < c.translucent;
        const severity = fading || translucent || s.mask ? 'warn' : 'error';
        const note = s.mask
          ? '遮罩层（背景色或大面积），有意遮挡'
          : translucent
            ? '半透明高亮，文字仍可读'
            : fading
              ? '转场叠化'
              : undefined;
        report({scene, beat, kind: 'covered', severity, text: label, other, otherId: s.node.key, ratio: +ratio.toFixed(2), note}, t);
      } else if (ratio < c.insideMax && !s.mask) {
        // 文字骑在图形边上：下层图形的边被文字压着，或上层描边框从文字中间穿过。
        // ≥ 90% 在图形里算“在里面”：文字框是矩形，放进圆里时四个角总会探出一点，不算骑边
        const severity = ratio >= c.edgeMin && !fading ? 'error' : 'warn';
        report({scene, beat, kind: 'edge', severity, text: label, other, otherId: s.node.key, ratio: +ratio.toFixed(2)}, t);
      }
    }

    const inner = shrink(tb, 3);
    for (const ln of curves) {
      if (isAncestor(ln.node, tx.node)) continue;
      if (ln.order < backing) continue; // 线在不透明底板下面，看不见
      let hit = false;
      for (let i = 1; i < ln.pts.length && !hit; i++) hit = segmentHitsBox(ln.pts[i - 1], ln.pts[i], inner);
      if (hit) {
        const severity = Math.min(tx.opacity, ln.opacity) < c.solid ? 'warn' : 'error';
        report({scene, beat, kind: 'crossed', severity, text: label, other: describe(ln.node, ln.box), otherId: ln.node.key}, t);
      }
    }
  }

  for (let i = 0; i < texts.length; i++) {
    for (let j = i + 1; j < texts.length; j++) {
      const a = texts[i];
      const b = texts[j];
      if (isAncestor(a.node, b.node) || isAncestor(b.node, a.node)) continue;
      const ia = area(inter(a.box, b.box));
      const smaller = Math.min(area(a.box), area(b.box));
      if (smaller <= 0 || ia / smaller < c.overlapMin) continue;
      const fading = Math.min(a.opacity, b.opacity) < c.solid;
      report(
        {
          scene,
          beat,
          kind: 'text-overlap',
          severity: fading ? 'warn' : 'error',
          text: textOf(a.node as Txt).slice(0, 24),
          other: describe(b.node, b.box),
          otherId: b.node.key,
          ratio: +(ia / smaller).toFixed(2),
          note: fading ? '转场叠化' : undefined,
        },
        t,
      );
    }
  }
}

/** 在一拍里的 5 个时刻采样检查；总时长不超过 dur，和 beat() 并行跑，不影响画面。 */
export function* qaProbe(beat: string, dur: number): ThreadGenerator {
  const marks = [0.15, dur * 0.25, dur * 0.5, dur * 0.75, dur - 0.15]
    .filter(m => m >= 0 && m <= dur)
    .sort((a, b) => a - b);
  let elapsed = 0;
  for (let i = 0; i < marks.length; i++) {
    if (marks[i] > elapsed) {
      yield* waitFor(marks[i] - elapsed);
      elapsed = marks[i];
    }
    qaCheck(beat);
  }
}
