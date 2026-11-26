// U3 r3 全景图（改编自 skill 示例 examples/lsm/scenes/lsm-stage.ts）：三个场景共用同一套坐标，后一个场景从前一个场景的终态开始（画面连续）。
import {Line, Node, Txt} from '@motion-canvas/2d';
import {Vector2} from '@motion-canvas/core';
import {KV, Meter, Slots, zone} from '../../lib/schemas';
import {FONT, SIZE, T} from '../../lib/theme';

export const IN = new Vector2(0, -282); // 写入 / 查询从这里进来
export const MEM_A = new Vector2(-455, -20); // 活跃的 memtable
export const FROZEN = new Vector2(-195, -20); // 冻结的 memtable
export const SST_X = [40, 215, 390]; // 磁盘上的段：越往左越新
export const SST_TOP = -184;
export const WAL_CELL = 140;
export const walPos = (i: number) => new Vector2(30 + (i % 4) * 150, 105 + Math.floor(i / 4) * 44);
export const sstCenter = (x: number, cap: number) => new Vector2(x, SST_TOP + (cap * 34 + (cap - 1) * 8 + 16) / 2);

export function walFrame(): [Line, Txt] {
  return [
    new Line({
      points: [
        [-48, 75],
        [558, 75],
        [558, 179],
        [-48, 179],
      ],
      closed: true,
      radius: 12,
      stroke: T.line,
      lineWidth: 2,
      opacity: 0,
    }),
    new Txt({
      position: [-44, 57],
      offset: [-1, 0],
      fontSize: SIZE.label,
      fontFamily: FONT.sans,
      fill: T.muted,
      text: '日志：只追加，不排序',
      opacity: 0,
    }),
  ];
}

export function sst(x: number, title: string, keys: string[], cap = keys.length): Slots {
  const s = new Slots(sstCenter(x, cap), 'col', cap, {cross: 150, title});
  s.items = keys.map(k => new KV(k, '', 'key'));
  return s;
}

export interface MapState {
  walBox: Line;
  walTitle: Txt;
  mem: Slots;
  meter: Meter;
  wal: KV[];
  ssts: Slots[]; // [C, B, A]：越往左越新
  all: Node[];
}

/** 写入场景结束时的全景图（直接可见，不动画）。 */
export function finalMap(W: Node): MapState {
  const [memZone, memName] = zone([-325, -25], 500, 450, '内存');
  const [diskZone, diskName] = zone([255, -25], 630, 450, '磁盘');
  const mem = new Slots(MEM_A, 'col', 5, {title: 'memtable'});
  const meter = new Meter([-322, -20], mem.frame.height(), {title: '大小'});
  meter.value(0.2);
  const [wf, wt] = walFrame();
  const kWri = new KV('handwriting', '22846');
  const walWri = new KV('handwriting', '', 'key', {w: WAL_CELL});
  const ssts = [
    sst(SST_X[0], 'SSTable C', ['handicap', 'handprinted', 'handwaving']),
    sst(SST_X[1], 'SSTable B', ['handcuffs', 'handkerchief', 'handlebars']),
    sst(SST_X[2], 'SSTable A', ['handbag', 'handful', 'handiwork', 'handoff', 'handsome']),
  ];
  const all: Node[] = [memZone, memName, diskZone, diskName, mem.frame, mem.title, ...meter.nodes(), wf, wt];
  for (const s of ssts) all.push(s.frame, s.title, ...s.items.map(k => k.node));
  all.push(kWri.node, walWri.node);
  W.add(all);
  all.forEach(n => n.opacity(1));
  mem.place([kWri]);
  walWri.node.position(walPos(0));
  for (const s of ssts) s.place(s.items);
  return {walBox: wf, walTitle: wt, mem, meter, wal: [walWri], ssts, all};
}
