// 布局辅助：让“不压字”成为默认写法。复制到 motion-canvas/src/lib/layout.ts（与 theme.ts 同目录）。
//
// 文字被压、骑边、互叠，几乎都来自“按绝对坐标手摆”：标签离它描述的对象只隔着几个像素，
// 对象一长大、一移动、一换位置，就压上去了。这里的函数把位置交给对象本身来算：
//
//   attach(label, bar, 'right')        标签贴在柱子的右端外侧，柱子变长时一起往右走（终态也不会被盖住）
//   attach(title, card, 'top', 14, true) 标题放在卡片里、离上边框 14px（不会骑在边框上）
//   row(3, 150, 24, [-300, -40])       3 个宽 150 的方块横排、间距 24（手算间距常常小于方块宽度）
//   edgePoint(node, 'left', 18)        节点左边框外 18px 的点：动画小点停在节点旁边，而不是停在节点中间的字上
//
// 所有坐标都是世界坐标换算的，label 和 target 不必在同一个父节点下；target 有 offset、缩放也照样对。
// attach 还会记下标签说明的对象，渲染 QA 会检查“标签先于对象出现、对象退场后标签还在”（orphan）。

import {Layout, Node} from '@motion-canvas/2d';
import {BBox, PossibleVector2, Vector2} from '@motion-canvas/core';

export type Side = 'top' | 'bottom' | 'left' | 'right' | 'center';

/** 节点自身内容（不含子节点）在世界坐标里的外接矩形。 */
export function worldRect(target: Node): BBox {
  const local: BBox = (target as any).getCacheBBox();
  return BBox.fromPoints(...local.transformCorners(target.localToWorld()));
}

/**
 * target 某条边外侧 gap 处的点（世界坐标）；inside=true 时为内侧 gap 处（gap 当内边距用）。
 * 在生成器里直接调用得到当前位置；放进函数里（如 attach）则随 target 实时更新。
 */
export function edgePoint(target: Node, side: Side, gap = 12, inside = false): Vector2 {
  const r = worldRect(target);
  const d = inside ? -gap : gap;
  switch (side) {
    case 'top':
      return new Vector2(r.center.x, r.top - d);
    case 'bottom':
      return new Vector2(r.center.x, r.bottom + d);
    case 'left':
      return new Vector2(r.left - d, r.center.y);
    case 'right':
      return new Vector2(r.right + d, r.center.y);
    default:
      return r.center;
  }
}

/** edgePoint 换算到 node 的父节点坐标系：用来给 position 补间当终点（如 dot().position(stop(...), 1)）。 */
export function edgePointIn(node: Node, target: Node, side: Side, gap = 12, inside = false): Vector2 {
  return edgePoint(target, side, gap, inside).transformAsPoint(node.worldToParent());
}

const OUTSIDE_OFFSET: Record<Side, [number, number]> = {
  top: [0, 1],
  bottom: [0, -1],
  left: [1, 0],
  right: [-1, 0],
  center: [0, 0],
};

/**
 * 让 label 一直贴着 target 的某条边：外侧（默认）或内侧（inside=true，gap 为内边距）。
 * target 变大、移动、出现在别的父节点下都没关系，label 跟着走。返回 label。
 */
export function attach<T extends Layout>(label: T, target: Node, side: Side, gap = 12, inside = false): T {
  const o = OUTSIDE_OFFSET[side];
  label.offset(inside ? [-o[0], -o[1]] : o);
  label.absolutePosition(() => edgePoint(target, side, gap, inside));
  // 记下“这个标签说明的是谁”：渲染 QA 据此检查标签已经看得清、对象却还没出现或已退场（orphan）
  (label as any).__qaSubject = target;
  return label;
}

/**
 * n 个尺寸为 size 的元素沿 x 轴等距排开（相邻元素之间留 gap），整体中心在 center；返回每个元素的中心。
 * 间距由尺寸推出来，元素不会互相叠住。
 */
export function row(n: number, size: number, gap: number, center: PossibleVector2 = [0, 0]): [number, number][] {
  const c = new Vector2(center);
  const step = size + gap;
  return Array.from({length: n}, (_, i) => [c.x + (i - (n - 1) / 2) * step, c.y]);
}

/** 同 row，沿 y 轴排开。 */
export function column(n: number, size: number, gap: number, center: PossibleVector2 = [0, 0]): [number, number][] {
  const c = new Vector2(center);
  const step = size + gap;
  return Array.from({length: n}, (_, i) => [c.x, c.y + (i - (n - 1) / 2) * step]);
}
