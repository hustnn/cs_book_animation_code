// U10 共用：数据表组件（事实表 / 维度表）。
// 一张表 = 外框 + 列分隔线 + 行分隔线 + 表头 + 数据行；行/列高亮框是只有描边的 Rect（不盖字）。
// 调用方按 Node（整表 / 表头 / 每一行）与高亮框的 ref 做动画；文字用 Txt，全部绝对坐标定位。
import {Line, Node, Rect, Txt} from '@motion-canvas/2d';
import {FONT, T} from '../lib/theme';

export interface TableRefs {
  root: any;
  head: any;
  rows: any[];
  headTxt: any[];
  hlRows: any[];
  hlCols: any[];
}

export interface TableSpec {
  key: string;
  x0: number;
  y0: number;
  cols: number[];
  heads: string[];
  rows: string[][];
  headH: number;
  rowH: number;
  headSize: number;
  cellSize: number;
  /** 用无衬线字体渲染的列（名字、描述等中文/英文词），其余用等宽字体 */
  sansCols?: number[];
  /** 数据行初始隐藏（调用方逐行点亮时用） */
  hideRows?: boolean;
  /** 表头初始隐藏 */
  hideHead?: boolean;
  refs: TableRefs;
}

export function DataTable(s: TableSpec) {
  const W = s.cols.reduce((a, b) => a + b, 0);
  const H = s.headH + s.rows.length * s.rowH;
  const cx: number[] = [];
  let acc = s.x0;
  for (const w of s.cols) {
    cx.push(acc + w / 2);
    acc += w;
  }
  const headY = s.y0 + s.headH / 2;
  const rowY = (i: number) => s.y0 + s.headH + i * s.rowH + s.rowH / 2;
  const seps: any[] = [];
  let x = s.x0;
  for (let i = 1; i < s.cols.length; i++) {
    x += s.cols[i - 1];
    seps.push(
      <Line
        key={`${s.key}-vs${i}`}
        points={[
          [x, s.y0],
          [x, s.y0 + H],
        ]}
        stroke={T.line}
        lineWidth={1}
      />,
    );
  }
  for (let i = 0; i <= s.rows.length; i++) {
    const y = s.y0 + s.headH + i * s.rowH;
    if (i === s.rows.length) {
      // 底边就是外框的边，不另画线
      continue;
    }
    seps.push(
      <Line
        key={`${s.key}-hs${i}`}
        points={[
          [s.x0, y],
          [s.x0 + W, y],
        ]}
        stroke={T.line}
        lineWidth={1}
      />,
    );
  }
  return (
    <Node key={s.key} ref={s.refs.root}>
      <Rect
        position={[s.x0 + W / 2, s.y0 + H / 2]}
        width={W}
        height={H}
        radius={8}
        fill={T.card}
        stroke={T.line}
        lineWidth={2}
      />
      {seps}
      <Node ref={s.refs.head} opacity={s.hideHead ? 0 : 1}>
        {s.heads.map((h, i) => (
          <Txt
            key={`${s.key}-h${i}`}
            ref={s.refs.headTxt[i]}
            position={[cx[i], headY]}
            fontSize={s.headSize}
            fill={T.muted}
            fontFamily={FONT.mono}
            text={h}
          />
        ))}
      </Node>
      {s.rows.map((row, r) => (
        <Node key={`${s.key}-r${r}`} ref={s.refs.rows[r]} opacity={s.hideRows ? 0 : 1}>
          {row.map((v, i) => (
            <Txt
              key={`${s.key}-c${r}-${i}`}
              position={[cx[i], rowY(r)]}
              fontSize={s.cellSize}
              fill={T.text}
              fontFamily={s.sansCols?.includes(i) ? FONT.sans : FONT.mono}
              text={v}
            />
          ))}
        </Node>
      ))}
      {s.rows.map((_, r) => (
        <Rect
          key={`${s.key}-hlr${r}`}
          ref={s.refs.hlRows[r]}
          position={[s.x0 + W / 2, rowY(r)]}
          width={W - 2}
          height={s.rowH - 2}
          radius={6}
          stroke={T.yellow}
          lineWidth={3}
          opacity={0}
        />
      ))}
      {s.cols.map((w, i) => (
        <Rect
          key={`${s.key}-hlc${i}`}
          ref={s.refs.hlCols[i]}
          position={[cx[i], s.y0 + H / 2]}
          width={w - 2}
          height={H - 2}
          radius={6}
          stroke={T.yellow}
          lineWidth={3}
          opacity={0}
        />
      ))}
    </Node>
  );
}

/** 为一张表建好全部 ref（调用方在 view.add 之前建）。 */
export function makeTableRefs(nRows: number, nCols: number, makeRef: <T>() => any): TableRefs {
  return {
    root: makeRef(),
    head: makeRef(),
    rows: Array.from({length: nRows}, () => makeRef()),
    headTxt: Array.from({length: nCols}, () => makeRef()),
    hlRows: Array.from({length: nRows}, () => makeRef()),
    hlCols: Array.from({length: nCols}, () => makeRef()),
  };
}
