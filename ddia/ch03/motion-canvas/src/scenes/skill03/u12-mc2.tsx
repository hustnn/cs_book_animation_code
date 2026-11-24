// U12 场景 2（MC）：b13–b24 —— 稀疏位图、游程编码逐行压短、
// 按位或（30、68、69 三张位图）、按位与（31 与商店编号 3）。
// 分镜：skill-ch03/beats-u12.md；原文：DDIA §3.11（书页 p98–99，PDF p120–121）。
// 游程编码数字按原图：29：9, 1；30：10, 2；31：5, 4, 3, 3；68：15, 1；69：0, 4, 12, 2；74：4, 1。
// 按位与里的商店编号 3 位图不在原图里：画成示意行（标“示意”），1 在第 6、8、13、17 位，
// 与 31 的位图按位与后得第 6、8、13 位，只演“同顺序、第 k 位对同一行”的机制。
// 时长全部来自 timeline/u12.json（beat() 驱动），不手写 waitFor。
import {Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, chain, createRef} from '@motion-canvas/core';
import {at, makeBeats} from '../../lib/beats';
import {FONT, SAFE, SIZE, T} from '../../lib/theme';
import timeline from '../../timeline/u12.json';

const VALUES = [69, 69, 69, 69, 74, 31, 31, 31, 31, 29, 30, 30, 31, 31, 31, 68, 69, 69];
const BITMAPS: {v: number; bits: number[]}[] = [
  {v: 29, bits: [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0]},
  {v: 30, bits: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0]},
  {v: 31, bits: [0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0]},
  {v: 68, bits: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0]},
  {v: 69, bits: [1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1]},
  {v: 74, bits: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]},
];
// 游程编码行：值、编码、括号说明（按原图）
const RLE: {v: number; code: string; note: string}[] = [
  {v: 29, code: '9，1', note: '9 个 0、1 个 1，其余 0'},
  {v: 30, code: '10，2', note: '10 个 0、2 个 1，其余 0'},
  {v: 31, code: '5，4，3，3', note: '5 个 0、4 个 1、3 个 0、3 个 1，其余 0'},
  {v: 68, code: '15，1', note: '15 个 0、1 个 1，其余 0'},
  {v: 69, code: '0，4，12，2', note: '0 个 0、4 个 1、12 个 0、2 个 1'},
  {v: 74, code: '4，1', note: '4 个 0、1 个 1，其余 0'},
];
const CELL_W = 40;
const CELL_H = 28;
const PITCH = 43;
const cellX = (i: number) => -365 + i * PITCH;
const VAL_Y = -258;
const ROW_Y = [-214, -176, -138, -100, -62, -24];
const RLE_Y = [42, 76, 110, 144, 178, 212];
// 按位或：30、68、69 三张位图叠加，结果的 1 在第 1–4、11、12、16、17、18 位
const OR_ROWS = [1, 3, 4];
const OR_RESULT = [1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1];
// 按位与：31 的位图（按原图）与商店编号 3 的位图（示意：1 在第 6、8、13、17 位）
const STORE3 = [0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0];
const AND_RESULT = [0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0];

export default makeScene2D(function* (view) {
  view.fill(T.bg);
  const beat = makeBeats(timeline);

  const header = createRef<Txt>();
  const anchor = createRef<Txt>();
  const say = (text: string) => anchor().text(text);

  // ---- 第 1 页：18 个值 + 6 张位图 + 游程编码 ----
  const p1 = createRef<Node>();
  const valCells = VALUES.map(() => createRef<Rect>());
  const bitRowNodes = BITMAPS.map(() => createRef<Node>());
  const bitCells = BITMAPS.map(bm => bm.bits.map(() => createRef<Rect>()));
  const rleLines = RLE.map(() => createRef<Node>());
  const compactLab = createRef<Txt>();
  const countryCard = createRef<Rect>();

  // ---- 第 2 页：按位或 ----
  const p2 = createRef<Node>();
  const orQuery = createRef<Rect>();
  const orRows = OR_ROWS.map(() => createRef<Node>());
  const orCells = OR_ROWS.map(r => BITMAPS[r].bits.map(() => createRef<Rect>()));
  const orResult = createRef<Node>();
  const orResultCells = OR_RESULT.map(() => createRef<Rect>());
  const orAns = createRef<Txt>();

  // ---- 第 3 页：按位与 ----
  const p3 = createRef<Node>();
  const andQ1 = createRef<Rect>();
  const andQ2 = createRef<Rect>();
  const andWord = createRef<Txt>();
  const andRow31 = createRef<Node>();
  const andCells31 = BITMAPS[2].bits.map(() => createRef<Rect>());
  const andRowS = createRef<Node>();
  const andCellsS = STORE3.map(() => createRef<Rect>());
  const andTag = createRef<Txt>();
  const andResult = createRef<Node>();
  const andResultCells = AND_RESULT.map(() => createRef<Rect>());

  const orRowY = [-170, -100, -30];
  const andRowY = [-150, -50];

  view.add(
    <>
      <Txt
        ref={header}
        position={[-SAFE.halfW, -SAFE.halfH]}
        offset={[-1, -1]}
        fontSize={SIZE.label}
        fill={T.muted}
        fontFamily={FONT.sans}
        text={'列压缩：位图'}
      />
      <Txt
        ref={anchor}
        position={[0, 280]}
        fontSize={SIZE.body}
        fill={T.text}
        fontFamily={FONT.sans}
        textAlign={'center'}
        textWrap
        maxWidth={SAFE.width}
        text={''}
      />

      {/* 第 1 页 */}
      <Node ref={p1} opacity={0}>
        {VALUES.map((v, i) => (
          <Rect
            key={`v-${i}`}
            ref={valCells[i]}
            position={[cellX(i), VAL_Y]}
            width={CELL_W}
            height={CELL_H}
            radius={6}
            fill={T.card}
            stroke={T.blue}
            lineWidth={1}
            opacity={0}
          >
            <Txt fontSize={18} fill={T.text} fontFamily={FONT.mono} text={String(v)} />
          </Rect>
        ))}
        {BITMAPS.map((bm, r) => (
          <Node key={`br-${r}`} ref={bitRowNodes[r]} opacity={0}>
            <Txt position={[-430, ROW_Y[r]]} offset={[1, 0]} fontSize={18} fill={T.muted} fontFamily={FONT.mono} text={`= ${bm.v}`} />
            {bm.bits.map((b, i) => (
              <Rect
                key={`bc-${r}-${i}`}
                ref={bitCells[r][i]}
                position={[cellX(i), ROW_Y[r]]}
                width={CELL_W}
                height={CELL_H}
                radius={6}
                fill={b ? T.yellow : T.card}
                stroke={T.line}
                lineWidth={1}
              >
                <Txt fontSize={16} fill={b ? T.bg : T.muted} fontFamily={FONT.mono} text={String(b)} />
              </Rect>
            ))}
          </Node>
        ))}
        {RLE.map((row, r) => (
          <Node key={`rle-${r}`} ref={rleLines[r]} opacity={0}>
            <Txt position={[-380, RLE_Y[r]]} offset={[-1, 0]} fontSize={20} fill={T.text} fontFamily={FONT.mono} text={`${row.v}：${row.code}`} />
            <Txt position={[80, RLE_Y[r]]} offset={[-1, 0]} fontSize={20} fill={T.muted} fontFamily={FONT.sans} text={`（${row.note}）`} />
          </Node>
        ))}
        <Rect ref={countryCard} position={[480, -130]} width={180} height={90} radius={12} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt position={[0, -22]} fontSize={20} fill={T.green} fontFamily={FONT.sans} text={'国家列'} />
          <Txt position={[0, 20]} fontSize={20} fill={T.text} fontFamily={FONT.sans} text={'二百来种值'} />
        </Rect>
        <Txt ref={compactLab} position={[0, 225]} fontSize={SIZE.body} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'非常紧凑'} opacity={0} />
      </Node>

      {/* 第 2 页：按位或 */}
      <Node ref={p2} opacity={0}>
        <Rect ref={orQuery} position={[0, -250]} width={620} height={64} radius={14} fill={T.card} stroke={T.blue} lineWidth={3} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'查产品编号 30、68、69 的行'} />
        </Rect>
        {OR_ROWS.map((r, k) => (
          <Node key={`or-${k}`} ref={orRows[k]} opacity={0}>
            <Txt position={[-430, orRowY[k]]} offset={[1, 0]} fontSize={20} fill={T.muted} fontFamily={FONT.mono} text={`= ${BITMAPS[r].v}`} />
            {BITMAPS[r].bits.map((b, i) => (
              <Rect
                key={`orc-${k}-${i}`}
                ref={orCells[k][i]}
                position={[cellX(i), orRowY[k]]}
                width={CELL_W}
                height={CELL_H}
                radius={6}
                fill={b ? T.yellow : T.card}
                stroke={T.line}
                lineWidth={1}
              >
                <Txt fontSize={16} fill={b ? T.bg : T.muted} fontFamily={FONT.mono} text={String(b)} />
              </Rect>
            ))}
          </Node>
        ))}
        <Node ref={orResult} opacity={0}>
          <Txt position={[-430, 60]} offset={[1, 0]} fontSize={20} fill={T.green} fontFamily={FONT.mono} text={'或 ='} />
          {OR_RESULT.map((b, i) => (
            <Rect
              key={`orr-${i}`}
              ref={orResultCells[i]}
              position={[cellX(i), 60]}
              width={CELL_W}
              height={CELL_H}
              radius={6}
              fill={b ? T.green : T.card}
              stroke={T.line}
              lineWidth={1}
            >
              <Txt fontSize={16} fill={b ? T.bg : T.muted} fontFamily={FONT.mono} text={String(b)} />
            </Rect>
          ))}
        </Node>
        <Txt ref={orAns} position={[0, 150]} fontSize={SIZE.body} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'是一的位，就是答案所在的行'} opacity={0} />
      </Node>

      {/* 第 3 页：按位与 */}
      <Node ref={p3} opacity={0}>
        <Rect ref={andQ1} position={[-300, -250]} width={420} height={64} radius={14} fill={T.card} stroke={T.blue} lineWidth={3} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'产品编号 31'} />
        </Rect>
        <Txt ref={andWord} position={[0, -250]} fontSize={SIZE.body} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'而且'} opacity={0} />
        <Rect ref={andQ2} position={[300, -250]} width={420} height={64} radius={14} fill={T.card} stroke={T.green} lineWidth={3} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'商店编号 3'} />
        </Rect>
        <Node ref={andRow31} opacity={0}>
          <Txt position={[-430, andRowY[0]]} offset={[1, 0]} fontSize={20} fill={T.muted} fontFamily={FONT.mono} text={'= 31'} />
          {BITMAPS[2].bits.map((b, i) => (
            <Rect
              key={`a31-${i}`}
              ref={andCells31[i]}
              position={[cellX(i), andRowY[0]]}
              width={CELL_W}
              height={CELL_H}
              radius={6}
              fill={b ? T.yellow : T.card}
              stroke={T.line}
              lineWidth={1}
            >
              <Txt fontSize={16} fill={b ? T.bg : T.muted} fontFamily={FONT.mono} text={String(b)} />
            </Rect>
          ))}
        </Node>
        <Node ref={andRowS} opacity={0}>
          <Txt position={[-430, andRowY[1]]} offset={[1, 0]} fontSize={20} fill={T.muted} fontFamily={FONT.mono} text={'商店 = 3'} />
          {STORE3.map((b, i) => (
            <Rect
              key={`as-${i}`}
              ref={andCellsS[i]}
              position={[cellX(i), andRowY[1]]}
              width={CELL_W}
              height={CELL_H}
              radius={6}
              fill={b ? T.purple : T.card}
              stroke={T.line}
              lineWidth={1}
            >
              <Txt fontSize={16} fill={b ? T.bg : T.muted} fontFamily={FONT.mono} text={String(b)} />
            </Rect>
          ))}
        </Node>
        <Txt ref={andTag} position={[480, andRowY[1]]} offset={[-1, 0]} fontSize={SIZE.label} fill={T.purple} fontFamily={FONT.sans} text={'示意'} opacity={0} />
        <Node ref={andResult} opacity={0}>
          <Txt position={[-430, 60]} offset={[1, 0]} fontSize={20} fill={T.green} fontFamily={FONT.mono} text={'与 ='} />
          {AND_RESULT.map((b, i) => (
            <Rect
              key={`ar-${i}`}
              ref={andResultCells[i]}
              position={[cellX(i), 60]}
              width={CELL_W}
              height={CELL_H}
              radius={6}
              fill={b ? T.green : T.card}
              stroke={T.line}
              lineWidth={1}
            >
              <Txt fontSize={16} fill={b ? T.bg : T.muted} fontFamily={FONT.mono} text={String(b)} />
            </Rect>
          ))}
        </Node>
      </Node>
    </>
  );

  say('稀疏位图，零很多');
  yield* beat('b13',
    all(p1().opacity(1, 0.5), p1().scale(1.015, 8.5)),
    at('零就越多', chain(
      ...valCells.map(c => c().opacity(1, 0.15)),
      ...bitRowNodes.map(n => n().opacity(1, 0.3)),
    )),
    at('稀疏位图', all(...bitCells.flatMap((row, r) => row.filter((_, i) => BITMAPS[r].bits[i] === 0)).map(c => c().opacity(0.35, 0.5)))),
    at('二百来种值', countryCard().opacity(1, 0.5)),
  );

  say('游程编码：只记连着几次');
  yield* beat('b14',
    all(countryCard().opacity(0, 0.4)),
    at('再压一遍', bitCells[0][9]().scale(1.3, 0.5).to(1, 0.5)),
    at('连着出现几次', rleLines[0]().opacity(1, 0.5)),
    at('游程编码', rleLines[0]().scale(1.03, 0.5)),
  );

  say('29：9，1；30：10，2');
  yield* beat('b15',
    at('九个零、一个一', rleLines[0]().scale(1.03, 0.4).to(1, 0.4)),
    at('记成九、一', rleLines[0]().opacity(0.7, 0.3).to(1, 0.3)),
    at('记成十、二', rleLines[1]().opacity(1, 0.5)),
  );

  say('31：5，4，3，3');
  yield* beat('b16',
    at('五、四、三、三', rleLines[2]().opacity(1, 0.5)),
    at('五个零、四个一', rleLines[2]().scale(1.02, 0.6)),
    at('六十八是十五、一', rleLines[3]().opacity(1, 0.5)),
  );

  say('69：0，4，12，2');
  yield* beat('b17',
    at('零、四、十二、二', rleLines[4]().opacity(1, 0.5)),
    at('开头就是一', rleLines[4]().scale(1.02, 0.6)),
    at('七十四是四、一', rleLines[5]().opacity(1, 0.5)),
  );

  say('压成六行短数字');
  yield* beat('b18',
    all(
      ...bitRowNodes.map(n => n().opacity(0.25, 0.5)),
      ...valCells.map(c => c().opacity(0.25, 0.5)),
    ),
    at('压成六行', chain(...rleLines.map(l => l().scale(1.03, 0.4)))),
    at('非常紧凑', compactLab().opacity(1, 0.5)),
  );

  say('位图最适合查仓库');
  yield* beat('b19',
    all(p1().opacity(0, 0.5), p2().opacity(1, 0.5)),
    at('最适合', orQuery().opacity(1, 0.5)),
    at('数据仓库', orQuery().stroke(T.green, 0.5)),
  );

  say('查 30、68、69');
  yield* beat('b20',
    at('三十、六十八、六十九', chain(orRows[0]().opacity(1, 0.5), orRows[1]().opacity(1, 0.5), orRows[2]().opacity(1, 0.5))),
    at('加载这三张位图', chain(...orRows.map(n => n().scale(1.02, 0.5)))),
    at('按位或', orQuery().stroke(T.yellow, 0.5)),
  );

  say('三张一叠加，就是答案');
  yield* beat('b21',
    all(orResult().opacity(1, 0.5)),
    at('一叠加', chain(
      ...[0, 1, 2, 3, 10, 11, 15, 16, 17].map(i => orResultCells[i]().scale(1.25, 0.25)),
      ...[0, 1, 2, 3, 10, 11, 15, 16, 17].map(i => orResultCells[i]().scale(1, 0.25)),
    )),
    at('答案所在的行', orAns().opacity(1, 0.5)),
    at('效率很高', orAns().fill(T.yellow, 0.4)),
  );

  say('31，而且商店是 3');
  yield* beat('b22',
    all(p2().opacity(0, 0.5), p3().opacity(1, 0.5)),
    at('条件更多', chain(andQ1().opacity(1, 0.5), andQ2().opacity(1, 0.5))),
    at('产品编号是三十一', andQ1().stroke(T.yellow, 0.4)),
    at('商店编号是三', andWord().opacity(1, 0.5)),
  );

  say('两张位图，按位与');
  yield* beat('b23',
    at('三十一的位图', andRow31().opacity(1, 0.6)),
    at('商店编号三的位图', chain(andRowS().opacity(1, 0.6), andTag().opacity(1, 0.4))),
    at('按位与', andRow31().scale(1.02, 0.6)),
  );

  say('各列行顺序一样');
  yield* beat('b24a',
    at('行顺序一模一样', chain(
      all(andCells31[5]().scale(1.3, 0.3), andCellsS[5]().scale(1.3, 0.3)),
      all(andCells31[5]().scale(1, 0.25), andCellsS[5]().scale(1, 0.25)),
      all(andCells31[7]().scale(1.3, 0.3), andCellsS[7]().scale(1.3, 0.3)),
      all(andCells31[7]().scale(1, 0.25), andCellsS[7]().scale(1, 0.25)),
    )),
  );

  say('第 k 位，都是同一行');
  yield* beat('b24b',
    all(andResult().opacity(1, 0.5)),
    at('第 k 位', chain(
      andResultCells[5]().scale(1.3, 0.3).to(1, 0.3),
      andResultCells[7]().scale(1.3, 0.3).to(1, 0.3),
      andResultCells[12]().scale(1.3, 0.3).to(1, 0.3),
    )),
    at('同一行', andResult().scale(1.02, 0.8)),
  );
});
