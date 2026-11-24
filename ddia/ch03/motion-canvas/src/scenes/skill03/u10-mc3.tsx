// U10 场景 3（MC）：b20–b26 —— 按单个事件记的灵活、几十 PB 的事实表、
// 一百多列的宽表、商店维度的宽字段、雪花模式、星型 vs 雪花、回扣收束。
// 分镜：skill-ch03/beats-u10.md；原文：DDIA §3.9（书页 p94–95，PDF p116–117）。
// 数字按原文：几十 PB（苹果 / 沃尔玛 / 易贝）、事实表常有一百多列、有时几百列。
// 时长全部来自 timeline/u10.json（beat() 驱动），不手写 waitFor。
import {Circle, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, chain, createRef} from '@motion-canvas/core';
import {at, makeBeats} from '../../lib/beats';
import {FONT, SAFE, SIZE, T} from '../../lib/theme';
import timeline from '../../timeline/u10.json';
import {DataTable, makeTableRefs} from '../../components/starTable';

const STORE_HEADS = ['store_sk', 'state', 'city'];
const STORE_COLS = [90, 60, 140];
const STORE_ROWS = [
  ['1', 'WA', 'Seattle'],
  ['2', 'CA', 'San Francisco'],
  ['3', 'CA', 'Palo Alto'],
];
const PROD_HEADS = ['product_sk', 'sku', 'description', 'brand', 'category'];
const PROD_COLS = [78, 60, 86, 74, 80];
const PROD_ROWS = [
  ['30', 'OK4012', 'Bananas', 'Freshmax', 'Fresh fruit'],
  ['31', 'KA9511', 'Fish food', 'Aquatech', 'Pet supplies'],
  ['32', 'AB1234', 'Croissant', 'Dealicious', 'Bakery'],
];
const FIELD_TAGS = ['提供哪些服务', '店内面包房', '面积多大', '开业日期', '翻新时间', '离高速多远'];
const FIELD_POS: [number, number][] = [[0, -180], [320, -180], [0, -90], [320, -90], [0, 0], [320, 0]];

export default makeScene2D(function* (view) {
  view.fill(T.bg);
  const beat = makeBeats(timeline);

  const header = createRef<Txt>();
  const anchor = createRef<Txt>();
  const say = (text: string) => anchor().text(text);

  // b20：切面
  const g20 = createRef<Node>();
  const rowCard = createRef<Rect>();
  const slices = [0, 1, 2].map(() => createRef<Rect>());

  // b21：几十 PB
  const g21 = createRef<Node>();
  const tallBar = createRef<Rect>();
  const tallLab = createRef<Txt>();
  const pbBig = createRef<Txt>();
  const companies = createRef<Txt>();
  const pbSub = createRef<Txt>();

  // b22：宽表
  const g22 = createRef<Node>();
  const wideBar = createRef<Rect>();
  const wideCells = Array.from({length: 10}, () => createRef<Rect>());
  const wideDots = createRef<Txt>();
  const wideLab = createRef<Txt>();
  const dimWide = createRef<Rect>();

  // b23：商店维度变宽
  const g23 = createRef<Node>();
  const storeTab = makeTableRefs(3, 3, createRef);
  const storeTitle = createRef<Txt>();
  const fieldTags = FIELD_TAGS.map(() => createRef<Rect>());

  // b24：雪花
  const g24 = createRef<Node>();
  const snowProd = makeTableRefs(3, 5, createRef);
  const brandTab = makeTableRefs(3, 1, createRef);
  const catTab = makeTableRefs(3, 1, createRef);
  const brandWrap = createRef<Node>();
  const catWrap = createRef<Node>();
  const aBrand = createRef<Line>();
  const aCat = createRef<Line>();
  const snowLab = createRef<Txt>();

  // b25：对照
  const g25 = createRef<Node>();
  const starRing = createRef<Circle>();
  const snowLab2 = createRef<Txt>();
  const starLab2 = createRef<Txt>();

  // b26：收束
  const g26 = createRef<Node>();
  const closeLine1 = createRef<Txt>();
  const closeLine2 = createRef<Txt>();

  view.add(
    <>
      <Txt
        ref={header}
        position={[-SAFE.halfW, -SAFE.halfH]}
        offset={[-1, -1]}
        fontSize={SIZE.label}
        fill={T.muted}
        fontFamily={FONT.sans}
        text={'星型模式：事实在中间'}
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

      {/* b20：按单个事件记 */}
      <Node ref={g20} opacity={0}>
        <Rect ref={rowCard} position={[0, -100]} width={700} height={80} radius={14} fill={T.card} stroke={T.blue} lineWidth={2}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'一行事实：一位顾客买了鱼食'} />
        </Rect>
        {['按产品切', '按商店切', '按日期切'].map((t, i) => (
          <Rect
            key={`sl-${i}`}
            ref={slices[i]}
            position={[-360 + i * 360, 80]}
            width={300}
            height={80}
            radius={14}
            fill={T.card}
            stroke={T.green}
            lineWidth={2}
            opacity={0}
          >
            <Txt fontSize={SIZE.label} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={t} />
          </Rect>
        ))}
      </Node>

      {/* b21：几十 PB */}
      <Node ref={g21} opacity={0}>
        <Rect ref={tallBar} position={[-320, 20]} width={120} height={60} radius={12} fill={T.card} stroke={T.blue} lineWidth={2} />
        <Txt ref={tallLab} position={[-320, 170]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'事实表'} opacity={0} />
        <Txt ref={pbBig} position={[200, -60]} fontSize={64} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'几十 PB'} opacity={0} />
        <Txt ref={companies} position={[200, 40]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'苹果 · 沃尔玛 · 易贝'} opacity={0} />
        <Txt ref={pbSub} position={[200, 100]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'交易历史，大多在事实表里'} opacity={0} />
      </Node>

      {/* b22：宽表 */}
      <Node ref={g22} opacity={0}>
        <Rect ref={wideBar} position={[0, -80]} width={1100} height={90} radius={14} fill={T.card} stroke={T.line} lineWidth={2} />
        {wideCells.map((r, i) => (
          <Rect key={`wc-${i}`} ref={r} position={[-495 + i * 100, -80]} width={70} height={50} radius={8} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0} />
        ))}
        <Txt ref={wideDots} position={[480, -80]} fontSize={SIZE.title} fontWeight={700} fill={T.muted} fontFamily={FONT.sans} text={'…'} opacity={0} />
        <Txt ref={wideLab} position={[0, 40]} fontSize={SIZE.body} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'一百多列，有时几百列'} opacity={0} />
        <Rect ref={dimWide} position={[0, 130]} width={700} height={60} radius={12} fill={T.card} stroke={T.purple} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'维度表也可以很宽'} />
        </Rect>
      </Node>

      {/* b23：商店维度变宽 */}
      <Node ref={g23} opacity={0}>
        <Txt ref={storeTitle} position={[-375, -215]} fontSize={SIZE.label} fontWeight={700} fill={T.text} fontFamily={FONT.mono} text={'dim_store · 商店维度表'} />
        {DataTable({
          key: 'storeW', x0: -520, y0: -180, cols: STORE_COLS, heads: STORE_HEADS, rows: STORE_ROWS,
          headH: 34, rowH: 36, headSize: 14, cellSize: 18, sansCols: [2], refs: storeTab,
        })}
        {FIELD_TAGS.map((t, i) => (
          <Rect
            key={`ft-${i}`}
            ref={fieldTags[i]}
            position={[FIELD_POS[i][0], FIELD_POS[i][1]]}
            width={280}
            height={60}
            radius={12}
            fill={T.card}
            stroke={T.purple}
            lineWidth={2}
            opacity={0}
          >
            <Txt fontSize={SIZE.label} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={t} />
          </Rect>
        ))}
      </Node>

      {/* b24：雪花 */}
      <Node ref={g24} opacity={0}>
        {DataTable({
          key: 'snowProd', x0: -560, y0: -160, cols: PROD_COLS, heads: PROD_HEADS, rows: PROD_ROWS,
          headH: 24, rowH: 24, headSize: 11, cellSize: 13, sansCols: [2, 3, 4], refs: snowProd,
        })}
        <Node ref={brandWrap} opacity={0}>
          {DataTable({
            key: 'brand', x0: 60, y0: -200, cols: [110], heads: ['brand'], rows: [['Freshmax'], ['Aquatech'], ['Dealicious']],
            headH: 24, rowH: 24, headSize: 11, cellSize: 13, sansCols: [0], refs: brandTab,
          })}
        </Node>
        <Node ref={catWrap} opacity={0}>
          {DataTable({
            key: 'cat', x0: 60, y0: 20, cols: [130], heads: ['category'], rows: [['Fresh fruit'], ['Pet supplies'], ['Bakery']],
            headH: 24, rowH: 24, headSize: 11, cellSize: 13, sansCols: [0], refs: catTab,
          })}
        </Node>
        <Line ref={aBrand} points={[[-182, -140], [60, -140]]} stroke={T.purple} lineWidth={3} endArrow opacity={0} />
        <Line ref={aCat} points={[[-182, -60], [20, -60], [20, 80], [60, 80]]} stroke={T.purple} lineWidth={3} endArrow opacity={0} />
        <Txt ref={snowLab} position={[0, 210]} fontSize={SIZE.title} fontWeight={700} fill={T.purple} fontFamily={FONT.sans} text={'雪花模式'} opacity={0} />
      </Node>

      {/* b25：雪花 vs 星型 */}
      <Node ref={g25} opacity={0}>
        <Circle position={[-320, -40]} width={90} height={90} fill={T.card} stroke={T.purple} lineWidth={3} />
        <Txt position={[-320, -40]} fontSize={SIZE.label} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'事实'} />
        {[[-320, -180], [-450, 40], [-190, 40]].map(([x, y], i) => (
          <Circle key={`sn-${i}`} position={[x, y]} width={44} height={44} fill={T.card} stroke={T.purple} lineWidth={2} />
        ))}
        <Circle position={[-450, 100]} width={36} height={36} fill={T.card} stroke={T.purple} lineWidth={2} />
        <Line points={[[-320, -85], [-320, -158]]} stroke={T.purple} lineWidth={2} />
        <Line points={[[-360, -8], [-428, 22]]} stroke={T.purple} lineWidth={2} />
        <Line points={[[-280, -8], [-212, 22]]} stroke={T.purple} lineWidth={2} />
        <Line points={[[-450, 62], [-450, 82]]} stroke={T.purple} lineWidth={2} />
        <Txt ref={snowLab2} position={[-320, 170]} fontSize={SIZE.body} fontWeight={700} fill={T.purple} fontFamily={FONT.sans} text={'雪花：更规范化'} opacity={0} />
        <Circle position={[320, -40]} width={90} height={90} fill={T.card} stroke={T.yellow} lineWidth={3} />
        <Txt position={[320, -40]} fontSize={SIZE.label} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'事实'} />
        <Circle ref={starRing} position={[320, -40]} width={260} height={260} stroke={T.yellow} lineWidth={3} opacity={0} />
        {[[320, -180], [450, -90], [400, 80], [240, 80], [190, -90]].map(([x, y], i) => (
          <Circle key={`st-${i}`} position={[x, y]} width={44} height={44} fill={T.card} stroke={T.blue} lineWidth={2} />
        ))}
        <Txt ref={starLab2} position={[320, 170]} fontSize={SIZE.body} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'星型：更简单'} opacity={0} />
      </Node>

      {/* b26：收束 */}
      <Node ref={g26} opacity={0}>
        <Rect position={[0, -60]} width={260} height={80} radius={14} fill={T.card} stroke={T.yellow} lineWidth={3}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'事实表'} />
        </Rect>
        {[[0, -200], [150, -130], [130, 40], [-130, 40], [-150, -130]].map(([x, y], i) => (
          <Circle key={`cl-${i}`} position={[x, y]} width={52} height={52} fill={T.card} stroke={T.blue} lineWidth={2} />
        ))}
        {[[[0, -100], [0, -174]], [[60, -90], [128, -112]], [[90, -30], [112, 22]], [[-90, -30], [-112, 22]], [[-60, -90], [-128, -112]]].map(([a, b], i) => (
          <Line key={`cll-${i}`} points={[a as [number, number], b as [number, number]]} stroke={T.yellow} lineWidth={2} />
        ))}
        <Txt ref={closeLine1} position={[0, 130]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'一笔销售是一行事实'} opacity={0} />
        <Txt ref={closeLine2} position={[0, 180]} fontSize={SIZE.body} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'五个维度围成一颗星'} opacity={0} />
      </Node>
    </>
  );

  say('按单个事件记');
  yield* beat('b20',
    all(g20().opacity(1, 0.5)),
    at('单个事件', rowCard().stroke(T.yellow, 0.5)),
    at('最灵活', chain(slices[0]().opacity(1, 0.4), slices[1]().opacity(1, 0.4), slices[2]().opacity(1, 0.4))),
    at('想怎么切', rowCard().stroke(T.green, 0.6)),
  );

  say('几十 PB，大多在事实表里');
  yield* beat('b21',
    chain(g20().opacity(0, 0.4), g21().opacity(1, 0.5)),
    at('变得极大', chain(tallBar().height(240, 3.0), tallLab().opacity(1, 0.5))),
    at('苹果', companies().opacity(1, 0.5)),
    at('几十 PB', pbBig().opacity(1, 0.5)),
    at('大多都在事实表里', pbSub().opacity(1, 0.5)),
  );

  say('一百多列，有时几百列');
  yield* beat('b22',
    chain(g21().opacity(0, 0.4), g22().opacity(1, 0.5)),
    at('一百多列', chain(...wideCells.map(c => c().opacity(1, 0.25)), wideDots().opacity(1, 0.4))),
    at('几百列', wideLab().opacity(1, 0.5)),
    at('维度表也可以很宽', dimWide().opacity(1, 0.5)),
  );

  say('商店表也能很宽');
  yield* beat('b23',
    chain(g22().opacity(0, 0.4), g23().opacity(1, 0.5)),
    at('提供哪些服务', fieldTags[0]().opacity(1, 0.4)),
    at('店内面包房', fieldTags[1]().opacity(1, 0.4)),
    at('面积多大', fieldTags[2]().opacity(1, 0.4)),
    at('哪天开业', fieldTags[3]().opacity(1, 0.4)),
    at('哪天翻新', fieldTags[4]().opacity(1, 0.4)),
    at('离最近的高速多远', all(fieldTags[5]().opacity(1, 0.4), g23().scale(1.015, 2.0))),
  );

  say('品牌、类别，各成一张表');
  yield* beat('b24',
    chain(g23().opacity(0, 0.4), g24().opacity(1, 0.5)),
    at('各成一张表', chain(brandWrap().opacity(1, 0.5), catWrap().opacity(1, 0.5), aBrand().opacity(1, 0.5), aCat().opacity(1, 0.5))),
    at('只留外键', chain(snowProd.hlCols[3]().stroke(T.purple, 0.3), snowProd.hlCols[3]().opacity(1, 0.4), snowProd.hlCols[4]().stroke(T.purple, 0.3), snowProd.hlCols[4]().opacity(1, 0.4))),
    at('雪花模式', snowLab().opacity(1, 0.5)),
  );

  say('星型，更简单');
  yield* beat('b25',
    chain(g24().opacity(0, 0.4), g25().opacity(1, 0.5)),
    at('更规范化', snowLab2().opacity(1, 0.5)),
    at('更受青睐', starRing().opacity(1, 0.6)),
    at('更简单', starLab2().opacity(1, 0.5)),
  );

  say('一笔销售，一行事实');
  yield* beat('b26',
    chain(g25().opacity(0, 0.4), g26().opacity(1, 0.5)),
    at('一笔销售是一行事实', all(closeLine1().opacity(1, 0.6), g26().scale(1.02, 4.0))),
    at('五个维度围成一颗星', closeLine2().opacity(1, 0.6)),
    at('分析的形状就定下来了', g26().scale(1.03, 1.2)),
  );
});
