// U4 场景 2（MC，r5）：d13–d21 —— 叶页快满、加键 334、叶页裂成两半、父页长出新边界 337、
// r7（判定 #31）：一页 6 个键位（d13 点明、d16 334 填进最后一格去红叉、d18 每页 3 键 + 3 格空位）；
// d13/d14 补 334 找页；d17 裂点规则；d19/d20 父页新引用；d21 树图补一层成四层 + 裂到根长新根。
// 树永远平衡。分镜：skill-ch03/beats-u4.md；原文：DDIA §3.4（书页 p81，PDF p103）。
// r5：d17 旁白加裂点规则，右叶 337 格描黄框标“右页首键”；d19 父页 337 格描同色黄框与之对应；
// d21 旁白加算数，画面加算式行“500 × 500 × 500 × 500 × 4 KB = 256 TB”（照录书数）。
// r5 修复（首轮 QA 3 error 均由 r5 旁白加长引起）：d17 分裂按旁白分步展开（换页→裂开→标首键→
// 337 脉冲→两页落定），d21 算式分三段跟着旁白出现（500^4 → × 4 KB → = 256 TB）。
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
function Page({cells, id, emptyRef}: {cells: Cell[]; id: string; emptyRef?: any}) {
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
            ref={emptyRef && c.t === '（空位）' && i === cells.length - 1 ? emptyRef : undefined}
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
).concat([{t: '（空位）', w: 130}]);  // r7：行末一个空位格，d16 由 334 填进，（空位）字随之淡出（QA 4 error 之二）
// 分裂后左叶：333/val/334（加粗）/val/335/val/（空位）
const LEAF_L: Cell[] = [
  {t: '333', w: KEY}, {t: 'val', w: VAL}, {t: '334', w: KEY, bold: true}, {t: 'val', w: VAL},
  {t: '335', w: KEY}, {t: 'val', w: VAL},
  {t: '（空位）', w: 130}, {t: '（空位）', w: 130}, {t: '（空位）', w: 130},
];
// 分裂后右叶：337/val/340/val/342/val/（空位）
const LEAF_R: Cell[] = [
  {t: '337', w: KEY}, {t: 'val', w: VAL}, {t: '340', w: KEY}, {t: 'val', w: VAL},
  {t: '342', w: KEY}, {t: 'val', w: VAL},
  {t: '（空位）', w: 130}, {t: '（空位）', w: 130}, {t: '（空位）', w: 130},
];

export default makeScene2D(function* (view) {
  view.fill(T.bg);
  const beat = makeBeats(timeline);

  const header = createRef<Txt>();
  const anchor = createRef<Txt>();
  const say = (text: string) => anchor().text(text);

  // d13–d20：分裂前后的页
  const g14 = createRef<Node>();
  const g14parent = createRef<Node>();
  const g14leaf = createRef<Node>();
  const g14hl = createRef<Rect>();
  const g14frame = createRef<Rect>();
  const g14ref = createRef<Line>();
  const g14parentLab = createRef<Txt>();  // r7 #5：父页是这页的上一层
  const g15range = createRef<Txt>();
  const g15empty = createRef<Txt>();  // QA：d16 末格（空位）字，334 落下时淡出
  const g15chip = createRef<Node>();
  // d17/d18：分裂
  const leafL = createRef<Node>();
  const leafR = createRef<Node>();
  const parentAfter = createRef<Node>();
  const hlR = createRef<Rect>();
  const labRKey = createRef<Txt>();
  const hlP = createRef<Rect>();
  const hlRef = createRef<Rect>();  // r7 #7：父页新裂出的右页引用格
  const labL = createRef<Txt>();
  const labR = createRef<Txt>();
  const arrL = createRef<Line>();
  const arrR = createRef<Line>();
  // d21：平衡树
  const g18 = createRef<Node>();
  const g18root = createRef<Rect>();
  const g18c1 = createRef<Rect>();
  const g18c2 = createRef<Rect>();
  const g18m1 = createRef<Rect>();  // r7 #4：d21 树图补一层——第三层 4 个子页
  const g18m2 = createRef<Rect>();
  const g18m3 = createRef<Rect>();
  const g18m4 = createRef<Rect>();
  const g18leaf = [0, 1, 2, 3, 4, 5, 6, 7].map(() => createRef<Rect>());
  const g18a = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map(() => createRef<Line>());
  const g18newRoot = createRef<Rect>();  // r7 #15：裂到根长出的新根
  const g18newArr = createRef<Line>();
  const g18depth = createRef<Txt>();
  const g18note = createRef<Txt>();  // r6 P2-14：树图 2 叉只是示意
  const g18calc1 = createRef<Txt>();
  const g18calc2 = createRef<Txt>();
  const g18calc3 = createRef<Txt>();

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

      {/* d13–d20：分裂前后的页 */}
      <Node ref={g14} opacity={0}>
        <Node ref={g14parent} position={[0, -250]}>
          <Page cells={PARENT_BEFORE} id={'pBefore'} />
        </Node>
        <Node ref={g14leaf} position={[0, -130]}>
          <Page cells={LEAF_FULL} id={'leafFull'} emptyRef={g15empty} />
        </Node>
        <Rect ref={g14hl} position={[-287, -130]} width={50} height={50} stroke={T.yellow} lineWidth={3} opacity={0} />
        <Rect ref={g14frame} position={[0, -130]} width={636} height={50} stroke={T.red} lineWidth={3} opacity={0} />
        <Line ref={g14ref} points={[[0, -228], [0, -152]]} stroke={T.yellow} lineWidth={2} opacity={0} />
        <Txt ref={g14parentLab} position={[350, -250]} fontSize={18} fill={T.muted} fontFamily={FONT.sans} text={'父页：上一层'} opacity={0} />
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
        <Rect ref={hlR} position={[-127, 60]} width={56} height={50} stroke={T.yellow} lineWidth={3} opacity={0} />
        <Txt ref={labRKey} position={[-127, 8]} fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.sans} text={'右页首键'} opacity={0} />
        <Rect ref={hlP} position={[-3, -250]} width={58} height={50} stroke={T.yellow} lineWidth={3} opacity={0} />
        <Rect ref={hlRef} position={[49, -250]} width={46} height={50} stroke={T.yellow} lineWidth={3} opacity={0} />
        <Txt ref={labL} position={[-270, 10]} fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.mono} text={'333 ≤ key < 337'} opacity={0} />
        <Txt ref={labR} position={[190, 110]} fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.mono} text={'337 ≤ key < 345'} opacity={0} />
        <Line ref={arrL} points={[[-55, -228], [-180, -150], [-300, -62]]} stroke={T.yellow} lineWidth={3} endArrow opacity={0} />
        <Line ref={arrR} points={[[49, -228], [100, -120], [150, 38]]} stroke={T.yellow} lineWidth={3} endArrow opacity={0} />
      </Node>

      {/* d21：平衡树（r7：四层——根页 → 子页 → 子页 → 叶页；裂到根长新根） */}
      <Node ref={g18} opacity={0}>
        <Rect ref={g18newRoot} position={[0, -300]} width={200} height={56} radius={14} fill={T.card} stroke={T.yellow} lineWidth={3} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'新根'} />
        </Rect>
        <Line ref={g18newArr} points={[[0, -272], [0, -222]]} stroke={T.green} lineWidth={3} endArrow opacity={0} />
        <Rect ref={g18root} position={[0, -190]} width={200} height={64} radius={14} fill={T.card} stroke={T.blue} lineWidth={3} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'根页'} />
        </Rect>
        <Line ref={g18a[0]} points={[[-60, -158], [-200, -132]]} stroke={T.yellow} lineWidth={2} endArrow opacity={0} />
        <Line ref={g18a[1]} points={[[60, -158], [200, -132]]} stroke={T.yellow} lineWidth={2} endArrow opacity={0} />
        <Rect ref={g18c1} position={[-230, -100]} width={180} height={64} radius={14} fill={T.card} stroke={T.line} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'子页'} />
        </Rect>
        <Rect ref={g18c2} position={[230, -100]} width={180} height={64} radius={14} fill={T.card} stroke={T.line} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'子页'} />
        </Rect>
        <Line ref={g18a[2]} points={[[-280, -68], [-330, -38]]} stroke={T.yellow} lineWidth={2} endArrow opacity={0} />
        <Line ref={g18a[3]} points={[[-180, -68], [-110, -38]]} stroke={T.yellow} lineWidth={2} endArrow opacity={0} />
        <Line ref={g18a[4]} points={[[180, -68], [110, -38]]} stroke={T.yellow} lineWidth={2} endArrow opacity={0} />
        <Line ref={g18a[5]} points={[[280, -68], [330, -38]]} stroke={T.yellow} lineWidth={2} endArrow opacity={0} />
        <Rect ref={g18m1} position={[-330, -10]} width={150} height={56} radius={12} fill={T.card} stroke={T.line} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'子页'} />
        </Rect>
        <Rect ref={g18m2} position={[-110, -10]} width={150} height={56} radius={12} fill={T.card} stroke={T.line} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'子页'} />
        </Rect>
        <Rect ref={g18m3} position={[110, -10]} width={150} height={56} radius={12} fill={T.card} stroke={T.line} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'子页'} />
        </Rect>
        <Rect ref={g18m4} position={[330, -10]} width={150} height={56} radius={12} fill={T.card} stroke={T.line} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'子页'} />
        </Rect>
        <Line ref={g18a[6]} points={[[-360, 18], [-420, 56]]} stroke={T.yellow} lineWidth={2} endArrow opacity={0} />
        <Line ref={g18a[7]} points={[[-300, 18], [-300, 56]]} stroke={T.yellow} lineWidth={2} endArrow opacity={0} />
        <Line ref={g18a[8]} points={[[-140, 18], [-180, 56]]} stroke={T.yellow} lineWidth={2} endArrow opacity={0} />
        <Line ref={g18a[9]} points={[[-80, 18], [-60, 56]]} stroke={T.yellow} lineWidth={2} endArrow opacity={0} />
        <Line ref={g18a[10]} points={[[80, 18], [60, 56]]} stroke={T.yellow} lineWidth={2} endArrow opacity={0} />
        <Line ref={g18a[11]} points={[[140, 18], [180, 56]]} stroke={T.yellow} lineWidth={2} endArrow opacity={0} />
        <Line ref={g18a[12]} points={[[300, 18], [300, 56]]} stroke={T.yellow} lineWidth={2} endArrow opacity={0} />
        <Line ref={g18a[13]} points={[[360, 18], [420, 56]]} stroke={T.yellow} lineWidth={2} endArrow opacity={0} />
        {[-420, -300, -180, -60, 60, 180, 300, 420].map((x, i) => (
          <Rect key={`g18l-${i}`} ref={g18leaf[i]} position={[x, 80]} width={110} height={48} radius={12} fill={T.card} stroke={T.line} lineWidth={2} opacity={0}>
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'叶页'} />
          </Rect>
        ))}
        <Txt ref={g18depth} position={[0, 160]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} text={'深度：对数级别'} opacity={0} />
        <Txt ref={g18note} position={[0, 245]} fontSize={18} fill={T.muted} fontFamily={FONT.sans} text={'示意：每页实际分 500 叉'} opacity={0} />
        {/* 算式分三段跟着旁白出现：500^4 → × 4 KB → = 256 TB（单行三段拼回原行，位置按等宽 22px 排） */}
        <Txt ref={g18calc1} position={[-106, 210]} fontSize={22} fill={T.yellow} fontFamily={FONT.mono} text={'500 × 500 × 500 × 500'} opacity={0} />
        <Txt ref={g18calc2} position={[73, 210]} fontSize={22} fill={T.yellow} fontFamily={FONT.mono} text={'× 4 KB'} opacity={0} />
        <Txt ref={g18calc3} position={[178, 210]} fontSize={22} fill={T.yellow} fontFamily={FONT.mono} text={'= 256 TB'} opacity={0} />
      </Node>
    </>
  );

  say('叶页快满了');
  yield* beat('d13',
    all(g14().opacity(1, 0.5), g14leaf().opacity(1, 0.5), g14parent().opacity(1, 0.5)),
    at('加键也从找页开始', g14hl().opacity(1, 0.4)),
    at('顺着父页', g14ref().opacity(1, 0.5)),
    at('三百三十三', g14hl().position([-287, -130], 0.5)),
    at('三百三十五', g14hl().position([-187, -130], 0.5)),
    at('三百三十七', g14hl().position([-87, -130], 0.5)),
    at('三百四十', g14hl().position([13, -130], 0.5)),
    at('三百四十二', g14hl().position([113, -130], 0.5)),
    at('只剩一个空位', chain(g14hl().position([256, -130], 0.5), g14hl().width(130, 0.4))),
  );

  say('管 333 到 345');
  yield* beat('d14',
    at('管三百三十三到三百四十五', g15range().opacity(1, 0.5)),
    at('父页里有三百一十', all(g14hl().position([-169, -250], 0.8), g14hl().width(62, 0.8))),
    at('三百三十三、三百四十五', g14hl().position([-65, -250], 0.5)),
    at('三百四十五三个边界', g14hl().position([39, -250], 0.5)),
    at('三个边界', g14ref().opacity(1, 0.5)),
    at('上一层', g14parentLab().opacity(1, 0.5)),
  );

  say('加键 334');
  yield* beat('d15',
    all(g15chip().opacity(1, 0.4), g15chip().position([0, -175], 1.0), g14frame().opacity(1, 0.6)),
  );

  say('页满了');
  yield* beat('d16',
    at('填进最后一个空位', all(g15chip().position([256, -130], 1.0), g15empty().opacity(0, 0.3))),
    at('六个键位满了', chain(g14leaf().position([8, -130], 0.12), g14leaf().position([-8, -130], 0.12), g14leaf().position([0, -130], 0.12))),
    at('没空位了', g14frame().lineWidth(5, 0.4)),
  );

  say('一页裂成两半');
  yield* beat('d17',
    at('裂成两半', all(
      g14leaf().opacity(0, 0.4), leafL().opacity(1, 0.4), g15chip().opacity(0, 0.4),
      g14hl().opacity(0, 0.3), g14frame().opacity(0, 0.3), g15range().opacity(0, 0.4),
    )),
    at('从中间裂开', all(
      leafL().position([-270, -40], 1.2),
      leafR().opacity(1, 0.4),
      leafR().position([190, 60], 1.2),
    )),
    at('右页第一个键', all(hlR().opacity(1, 0.4), labRKey().opacity(1, 0.4))),
    at('三百三十七', chain(hlR().scale(1.12, 0.7), hlR().scale(1, 0.7))),
    at('就成了父页的新边界', all(leafL().scale(1.02, 1.2), leafR().scale(1.02, 1.2))),
    at('记住这个规矩', chain(hlR().scale(1.12, 0.6), hlR().scale(1, 0.6))),
    at('就是右页的第一个键', chain(labRKey().scale(1.15, 0.5), labRKey().scale(1, 0.5))),
  );

  say('各留一半空位');
  yield* beat('d18',
    at('左页', leafL().scale(1.03, 0.8)),
    at('右页', leafR().scale(1.03, 0.8)),
    at('各留一半空位', all(leafL().scale(1, 0.6), leafR().scale(1, 0.6))),
  );

  say('父页长出 337');
  yield* beat('d19',
    at('多了一个边界', all(g14parent().opacity(0, 0.4), parentAfter().opacity(1, 0.4), hlP().opacity(1, 0.4))),
    at('还多一个引用', hlRef().opacity(1, 0.4)),
  );

  say('范围切成两段');
  yield* beat('d20',
    at('三百三十三到三百三十七', all(arrL().opacity(1, 0.5), labL().opacity(1, 0.5))),
    at('三百三十七到三百四十五', all(arrR().opacity(1, 0.5), labR().opacity(1, 0.5))),
  );

  say('树永远平衡');
  yield* beat('d21',
    all(g14().opacity(0, 0.5), g18().opacity(1, 0.5)),
    at('平衡', chain(g18root().opacity(1, 0.4), g18a[0]().opacity(1, 0.3), g18a[1]().opacity(1, 0.3), g18c1().opacity(1, 0.4), g18c2().opacity(1, 0.4), g18a[2]().opacity(1, 0.3), g18a[3]().opacity(1, 0.3), g18a[4]().opacity(1, 0.3), g18a[5]().opacity(1, 0.3), g18m1().opacity(1, 0.3), g18m2().opacity(1, 0.3), g18m3().opacity(1, 0.3), g18m4().opacity(1, 0.3), g18a[6]().opacity(1, 0.25), g18a[7]().opacity(1, 0.25), g18a[8]().opacity(1, 0.25), g18a[9]().opacity(1, 0.25), g18a[10]().opacity(1, 0.25), g18a[11]().opacity(1, 0.25), g18a[12]().opacity(1, 0.25), g18a[13]().opacity(1, 0.25), g18leaf[0]().opacity(1, 0.25), g18leaf[1]().opacity(1, 0.25), g18leaf[2]().opacity(1, 0.25), g18leaf[3]().opacity(1, 0.25), g18leaf[4]().opacity(1, 0.25), g18leaf[5]().opacity(1, 0.25), g18leaf[6]().opacity(1, 0.25), g18leaf[7]().opacity(1, 0.25))),
    at('裂到根', all(g18newRoot().opacity(1, 0.5), g18newArr().opacity(1, 0.5))),
    at('长出一层新根', chain(g18newRoot().scale(1.08, 0.6), g18newRoot().scale(1, 0.6))),
    at('对数级别', g18depth().opacity(1, 0.5)),
    at('键数翻五百倍', g18note().opacity(1, 0.5)),
    at('各层始终一样深', g18depth().scale(1.1, 0.5)),
    at('算一笔账', g18calc1().opacity(1, 0.5)),
    at('四层相乘', chain(g18calc1().scale(1.05, 0.5), g18calc1().scale(1, 0.5))),
    at('再乘四 KB', g18calc2().opacity(1, 0.5)),
    at('二百五十六 TB', g18calc3().opacity(1, 0.5)),
    at('三四层就够了', chain(g18calc3().scale(1.15, 0.8), g18calc3().scale(1, 0.8))),
  );
});
