// U4 场景 2（MC）：b14a–b19 —— 改值写回页、加新键、叶页快满、加键 334、叶页裂成两半、
// 父页长出新边界 337、树永远平衡、删键更复杂、四层树 256 TB。分镜：skill-ch03/beats-u4.md；
// 原文：DDIA §3.4（书页 p81，PDF p103）。
// 原图 3-7 按处置“改编”：分裂前父页 310/333/345 + 空位、叶页 333/335/337/340/342、范围
// 333 ≤ key < 345；加键 334 后父页多出加粗边界 337，叶页裂成 333/334/335 + 空位与
// 337/340/342 + 空位，范围分别是 333 ≤ key < 337 与 337 ≤ key < 345。数字按原图核对。
// 时长全部来自 timeline/u4.json（beat() 驱动），不手写 waitFor。
import {Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, chain, createRef} from '@motion-canvas/core';
import {at, makeBeats} from '../../lib/beats';
import {FONT, SAFE, SIZE, T} from '../../lib/theme';
import timeline from '../../timeline/u4.json';

type Cell = {t: string; w: number; bold?: boolean};
function Page({cells, id}: {cells: Cell[]; id: string}) {
  const total = cells.reduce((s, c) => s + c.w, 0);
  let x = -total / 2;
  const centers = cells.map(c => {
    const cx = x + c.w / 2;
    x += c.w;
    return cx;
  });
  return (
    <Node>
      <Rect width={total} height={44} fill={T.card} stroke={T.line} lineWidth={2} radius={6} />
      {cells.map((c, i) => (
        <Node key={`${id}-c${i}`}>
          {i > 0 && <Rect position={[centers[i] - c.w / 2, 0]} width={2} height={44} fill={T.line} />}
          <Txt
            position={[centers[i], 0]}
            fontSize={c.bold ? 22 : 20}
            fontWeight={c.bold ? 700 : 400}
            fill={T.text}
            fontFamily={FONT.mono}
            text={c.t}
          />
        </Node>
      ))}
    </Node>
  );
}

const REF = 46;
const NUM = 58;
const KEY = 56;
const VAL = 44;
const refCell = (): Cell => ({t: 'ref', w: REF});
const numCell = (n: number, bold = false): Cell => ({t: String(n), w: NUM, bold});
// 原图 3-7 分裂前父页：ref/310/ref/333/ref/345/ref/（空位）
const PARENT_BEFORE: Cell[] = [refCell(), numCell(310), refCell(), numCell(333), refCell(), numCell(345), refCell(), {t: '（空位）', w: 130}];
// 原图 3-7 分裂后父页：ref/310/ref/333/ref/337（加粗）/ref/345/ref/（空位）
const PARENT_AFTER: Cell[] = [refCell(), numCell(310), refCell(), numCell(333), refCell(), numCell(337, true), refCell(), numCell(345), refCell(), {t: '（空位）', w: 110}];
// 原图 3-7 分裂前叶页：333/val/335/val/337/val/340/val/342/val
const LEAF_FULL: Cell[] = [333, 335, 337, 340, 342].reduce<Cell[]>(
  (acc, k, i) => (i === 0 ? [{t: String(k), w: KEY}, {t: 'val', w: VAL}] : acc.concat([{t: String(k), w: KEY}, {t: 'val', w: VAL}])),
  [],
);
// 分裂后左叶：333/val/334（加粗）/val/335/val/（空位）
const LEAF_L: Cell[] = [
  {t: '333', w: KEY}, {t: 'val', w: VAL}, {t: '334', w: KEY, bold: true}, {t: 'val', w: VAL},
  {t: '335', w: KEY}, {t: 'val', w: VAL}, {t: '（空位）', w: 130},
];
// 分裂后右叶：337/val/340/val/342/val/（空位）
const LEAF_R: Cell[] = [
  {t: '337', w: KEY}, {t: 'val', w: VAL}, {t: '340', w: KEY}, {t: 'val', w: VAL},
  {t: '342', w: KEY}, {t: 'val', w: VAL}, {t: '（空位）', w: 130},
];

export default makeScene2D(function* (view) {
  view.fill(T.bg);
  const beat = makeBeats(timeline);

  const header = createRef<Txt>();
  const anchor = createRef<Txt>();
  const say = (text: string) => anchor().text(text);

  // b14：改值 / 写回 / 加新键
  const g14 = createRef<Node>();
  const g14parent = createRef<Node>();
  const g14leaf = createRef<Node>();
  const g14hl = createRef<Rect>();
  const g14frame = createRef<Rect>();
  const g14write = createRef<Line>();
  const g14disk = createRef<Rect>();
  const g14ref = createRef<Line>();
  const g14chip = createRef<Node>();
  // b15：快满的叶页 + 334
  const g15range = createRef<Txt>();
  const g15chip = createRef<Node>();
  // b16/b17：分裂
  const leafL = createRef<Node>();
  const leafR = createRef<Node>();
  const parentAfter = createRef<Node>();
  const labL = createRef<Txt>();
  const labR = createRef<Txt>();
  const arrL = createRef<Line>();
  const arrR = createRef<Line>();
  // b18：平衡树
  const g18 = createRef<Node>();
  const g18root = createRef<Rect>();
  const g18c1 = createRef<Rect>();
  const g18c2 = createRef<Rect>();
  const g18leaf = [0, 1, 2, 3].map(() => createRef<Rect>());
  const g18a = [0, 1, 2, 3, 4, 5].map(() => createRef<Line>());
  const g18depth = createRef<Txt>();
  const g18ins = createRef<Rect>();
  const g18del = createRef<Rect>();
  const g18x1 = createRef<Line>();
  const g18x2 = createRef<Line>();
  // b19：四层树 256 TB
  const g19 = createRef<Node>();
  const g19bars = [0, 1, 2, 3].map(() => createRef<Rect>());
  const g19f1 = createRef<Txt>();
  const g19f2 = createRef<Txt>();
  const g19f3 = createRef<Txt>();
  const g19bf = createRef<Txt>();

  view.add(
    <>
      <Txt
        ref={header}
        position={[-SAFE.halfW, -SAFE.halfH]}
        offset={[-1, -1]}
        fontSize={SIZE.label}
        fill={T.muted}
        fontFamily={FONT.sans}
        text={'B 树：把数据切成页'}
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

      {/* b14–b17：分裂前后的页 */}
      <Node ref={g14} opacity={0}>
        <Node ref={g14parent} position={[0, -250]}>
          <Page cells={PARENT_BEFORE} id={'pBefore'} />
        </Node>
        <Node ref={g14leaf} position={[0, -130]}>
          <Page cells={LEAF_FULL} id={'leafFull'} />
        </Node>
        <Rect ref={g14hl} position={[28, -130]} width={50} height={50} stroke={T.yellow} lineWidth={3} opacity={0} />
        <Rect ref={g14frame} position={[0, -130]} width={506} height={50} stroke={T.red} lineWidth={3} opacity={0} />
        <Line ref={g14write} points={[[0, -108], [0, 8]]} stroke={T.yellow} lineWidth={3} endArrow opacity={0} />
        <Rect ref={g14disk} position={[0, 52]} width={500} height={44} radius={8} fill={T.card} stroke={T.muted} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'磁盘'} />
        </Rect>
        <Line ref={g14ref} points={[[0, -228], [0, -152]]} stroke={T.yellow} lineWidth={2} opacity={0} />
        <Node ref={g14chip} position={[0, -195]} opacity={0}>
          <Rect width={110} height={50} radius={12} fill={T.card} stroke={T.green} lineWidth={2}>
            <Txt fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} text={'新键'} />
          </Rect>
        </Node>
        <Txt ref={g15range} position={[0, -80]} fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.mono} text={'333 ≤ key < 345'} opacity={0} />
        <Node ref={g15chip} position={[0, -195]} opacity={0}>
          <Rect width={110} height={50} radius={12} fill={T.card} stroke={T.red} lineWidth={2}>
            <Txt fontSize={SIZE.body} fontWeight={700} fill={T.red} fontFamily={FONT.mono} text={'334'} />
          </Rect>
        </Node>
        <Node ref={leafL} position={[0, -130]} opacity={0}>
          <Page cells={LEAF_L} id={'leafL'} />
        </Node>
        <Node ref={leafR} position={[0, -130]} opacity={0}>
          <Page cells={LEAF_R} id={'leafR'} />
        </Node>
        <Node ref={parentAfter} position={[0, -250]} opacity={0}>
          <Page cells={PARENT_AFTER} id={'pAfter'} />
        </Node>
        <Txt ref={labL} position={[-270, 10]} fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.mono} text={'333 ≤ key < 337'} opacity={0} />
        <Txt ref={labR} position={[190, 110]} fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.mono} text={'337 ≤ key < 345'} opacity={0} />
        <Line ref={arrL} points={[[-55, -228], [-180, -150], [-300, -62]]} stroke={T.yellow} lineWidth={3} endArrow opacity={0} />
        <Line ref={arrR} points={[[49, -228], [100, -120], [150, 38]]} stroke={T.yellow} lineWidth={3} endArrow opacity={0} />
      </Node>

      {/* b18：平衡树 */}
      <Node ref={g18} opacity={0}>
        <Rect ref={g18root} position={[0, -210]} width={200} height={64} radius={14} fill={T.card} stroke={T.blue} lineWidth={3} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'根页'} />
        </Rect>
        <Line ref={g18a[0]} points={[[-60, -178], [-230, -72]]} stroke={T.yellow} lineWidth={2} endArrow opacity={0} />
        <Line ref={g18a[1]} points={[[60, -178], [230, -72]]} stroke={T.yellow} lineWidth={2} endArrow opacity={0} />
        <Rect ref={g18c1} position={[-230, -40]} width={180} height={64} radius={14} fill={T.card} stroke={T.line} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'子页'} />
        </Rect>
        <Rect ref={g18c2} position={[230, -40]} width={180} height={64} radius={14} fill={T.card} stroke={T.line} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'子页'} />
        </Rect>
        <Line ref={g18a[2]} points={[[-280, -8], [-330, 92]]} stroke={T.yellow} lineWidth={2} endArrow opacity={0} />
        <Line ref={g18a[3]} points={[[-180, -8], [-110, 92]]} stroke={T.yellow} lineWidth={2} endArrow opacity={0} />
        <Line ref={g18a[4]} points={[[180, -8], [110, 92]]} stroke={T.yellow} lineWidth={2} endArrow opacity={0} />
        <Line ref={g18a[5]} points={[[280, -8], [330, 92]]} stroke={T.yellow} lineWidth={2} endArrow opacity={0} />
        {[-330, -110, 110, 330].map((x, i) => (
          <Rect key={`g18l-${i}`} ref={g18leaf[i]} position={[x, 120]} width={150} height={56} radius={12} fill={T.card} stroke={T.line} lineWidth={2} opacity={0}>
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'叶页'} />
          </Rect>
        ))}
        <Txt ref={g18depth} position={[0, 210]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} text={'深度：对数级别'} opacity={0} />
        <Rect ref={g18ins} position={[-300, 190]} width={220} height={60} radius={12} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} text={'插新键：顺滑落入'} />
        </Rect>
        <Rect ref={g18del} position={[300, 190]} width={220} height={60} radius={12} fill={T.card} stroke={T.red} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.red} fontFamily={FONT.sans} text={'删键：打个结'} />
        </Rect>
        <Line key={'qa-ignore-删键打叉1'} ref={g18x1} points={[[210, 165], [390, 215]]} stroke={T.red} lineWidth={4} opacity={0} />
        <Line key={'qa-ignore-删键打叉2'} ref={g18x2} points={[[390, 165], [210, 215]]} stroke={T.red} lineWidth={4} opacity={0} />
      </Node>

      {/* b19：四层树 256 TB */}
      <Node ref={g19} opacity={0}>
        {[120, 240, 360, 480].map((w, i) => (
          <Rect key={`g19b-${i}`} ref={g19bars[i]} position={[-560 + w / 2, -200 + i * 80]} width={w} height={40} radius={8} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
            <Txt position={[-w / 2 + 60, 0]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={`第 ${i + 1} 层`} />
          </Rect>
        ))}
        <Txt ref={g19bf} position={[280, -220]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'分支因子 500'} opacity={0} />
        <Txt ref={g19f1} position={[280, -150]} fontSize={28} fill={T.text} fontFamily={FONT.mono} text={'500 × 500 × 500 × 500'} opacity={0} />
        <Txt ref={g19f2} position={[280, -90]} fontSize={28} fill={T.text} fontFamily={FONT.mono} text={'× 4 KB'} opacity={0} />
        <Txt ref={g19f3} position={[280, 0]} fontSize={44} fontWeight={700} fill={T.yellow} fontFamily={FONT.mono} text={'= 256 TB'} opacity={0} />
      </Node>
    </>
  );

  say('找到叶页，改掉值');
  yield* beat('b14a',
    all(g14().opacity(1, 0.5), g14leaf().opacity(1, 0.5)),
    at('找到叶页', g14leaf().opacity(1, 0.5)),
    at('改掉值', all(g14hl().opacity(1, 0.4), g14hl().stroke(T.green, 0.4))),
  );

  say('整页写回，引用有效');
  yield* beat('b14c',
    at('写回磁盘', all(g14write().opacity(1, 0.5), g14disk().opacity(1, 0.5))),
    at('引用还有效', all(g14parent().opacity(1, 0.5), g14ref().opacity(1, 0.5))),
  );

  say('加键先进页');
  yield* beat('b14b',
    at('范围包含', g14chip().opacity(1, 0.5)),
    at('加进去', chain(g14chip().position([0, -175], 0.5), g14chip().position([0, -195], 0.5))),
  );

  say('叶页快满了');
  yield* beat('b15a',
    at('快满了', all(g15range().opacity(1, 0.5), g14chip().opacity(0, 0.4), g14write().opacity(0, 0.4))),
    at('三百三十三', g14hl().position([-222, -130], 0.5)),
    at('三百三十五', g14hl().position([-122, -130], 0.5)),
    at('三百三十七', g14hl().position([-22, -130], 0.5)),
    at('三百四十', g14hl().position([78, -130], 0.5)),
    at('三百四十二', g14hl().position([178, -130], 0.5)),
    at('管三百三十三到三百四十五', g14leaf().scale(1.03, 1.0)),
    g14().scale(1.01, beat.dur('b15a')),
  );

  say('加键 334');
  yield* beat('b15b',
    all(g15chip().opacity(1, 0.4), g15chip().position([0, -175], 1.0), g14frame().opacity(1, 0.6)),
  );

  say('一页裂成两半');
  yield* beat('b16',
    at('裂成两半', chain(
      all(g14leaf().opacity(0, 0.4), leafL().opacity(1, 0.4), leafR().opacity(1, 0.4), g15chip().opacity(0, 0.4), g14hl().opacity(0, 0.3), g14frame().opacity(0, 0.3), g14disk().opacity(0, 0.4), g15range().opacity(0, 0.4)),
      all(leafL().position([-270, -40], 2.5), leafR().position([190, 60], 2.5)),
    )),
    at('各留一半空位', all(leafL().scale(1.03, 0.8), leafR().scale(1.03, 0.8))),
  );

  say('父页长出 337');
  yield* beat('b17',
    at('多了一个边界', all(g14parent().opacity(0, 0.4), parentAfter().opacity(1, 0.4))),
    at('三百三十三到三百三十七', all(arrL().opacity(1, 0.5), labL().opacity(1, 0.5))),
    at('三百三十七到三百四十五', all(arrR().opacity(1, 0.5), labR().opacity(1, 0.5))),
  );

  say('树永远平衡');
  yield* beat('b18',
    all(g14().opacity(0, 0.5), g18().opacity(1, 0.5)),
    at('平衡', chain(g18root().opacity(1, 0.4), g18a[0]().opacity(1, 0.3), g18a[1]().opacity(1, 0.3), g18c1().opacity(1, 0.4), g18c2().opacity(1, 0.4), g18a[2]().opacity(1, 0.3), g18a[3]().opacity(1, 0.3), g18a[4]().opacity(1, 0.3), g18a[5]().opacity(1, 0.3), g18leaf[0]().opacity(1, 0.3), g18leaf[1]().opacity(1, 0.3), g18leaf[2]().opacity(1, 0.3), g18leaf[3]().opacity(1, 0.3))),
    at('对数级别', g18depth().opacity(1, 0.5)),
  );

  say('删键更复杂');
  yield* beat('b18b',
    at('插新键', g18ins().opacity(1, 0.5)),
    at('删一个键', all(g18del().opacity(1, 0.5), g18x1().opacity(1, 0.4), g18x2().opacity(1, 0.4))),
    g18del().scale(1.04, beat.dur('b18b')),
  );

  say('四层树，256 TB');
  yield* beat('b19',
    all(g18().opacity(0, 0.5), g19().opacity(1, 0.5)),
    at('三四层', chain(g19bars[0]().opacity(1, 0.4), g19bars[1]().opacity(1, 0.4), g19bars[2]().opacity(1, 0.4), g19bars[3]().opacity(1, 0.4))),
    at('分支因子五百', all(g19bf().opacity(1, 0.5), g19f1().opacity(1, 0.5), g19f2().opacity(1, 0.5))),
    at('二百五十六 TB', g19f3().opacity(1, 0.5)),
  );
});
