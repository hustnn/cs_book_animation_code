// U10 场景 3（MC）：j22–j32 —— 星型长出来（事实居中 j22、产品维度先长 j23/j23b、
// 其余四维 j24、五维就位 j25、五根箭头如星芒 j26、六个问题 j27/j27b）、雪花模式（j28–j29）、
// 一百多列的宽表（j30–j31）、回扣收束（j32）。
// r3：j27 拆成 j27（前四个问题各指一张表）+ j27b（怎么买、为什么买共用促销表）；
// 每张问题牌下方亮出它对应的表名。
// r4：j23b 脂肪含量/包装尺寸改成真正的列（各带三行示例值，鱼食行 8%/500 克，标“示意”）；
// j26 箭头逐根亮起时事实表外键列头与维度表键列头同步亮起；j27b 把怎么买/为什么买指到列上；
// j29 补“查牌子多连一张表”小标；j30 补“比如：售价、进货成本……”小标。
// r5：j23b/j23c 脂肪含量、包装尺寸真正做进 dim_product 表成为第 6、第 7 列；j26 商店、促销、顾客
// 三根箭头重排走线、落到维度表键列一侧；j27b 去掉与旁白锚同义的共用促销表小标、
// “怎么买”牌下方补“广告类型 + 优惠券类型”小字；j28 品牌/类别表加键列、产品表填对应编号、
// 逐行高亮“鱼食 → Aquatech”；j29 补重复示意演示、对比图圆圈逐个打表名；j30 两格标上“售价”
// “进货成本”、补售价与净价不是同一列的小标、维度表条横向拉宽。
// 分镜：skill-ch03/beats-u10.md（r2）；原文：DDIA §3.9（书页 p94–95，PDF p116–117）。
// 数字按原文：几十 PB（苹果 / 沃尔玛 / 易贝）、事实表常有一百多列、有时几百列。
// j28 修 r1 P2-3：拆完后产品表品牌、类别两列换成外键（列名 brand_sk / category_sk，
// 格子只留引用箭头，不编造编号）；j26 修 r1 P2-2：箭头逐根亮起时整星缓慢放大。
// 时长全部来自 timeline/u10.json（beat() 驱动），不手写 waitFor。
import {Circle, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, chain, createRef} from '@motion-canvas/core';
import {at, makeBeats} from '../../lib/beats';
import {FONT, SAFE, SIZE, T} from '../../lib/theme';
import {Cam} from '../../lib/schemas';
import timeline from '../../timeline/u10.json';
import {DataTable, makeTableRefs} from '../../components/starTable';

const FACT_HEADS = ['date_key', 'product_sk', 'store_sk', 'promotion_sk', 'customer_sk', 'quantity', 'net_price', 'discount_price'];
const FACT_COLS = [66, 66, 56, 88, 80, 50, 60, 94];
const FACT_ROWS = [
  ['140102', '31', '3', 'NULL', 'NULL', '1', '2.49', '2.49'],
  ['140102', '69', '5', '19', 'NULL', '3', '14.99', '9.99'],
  ['140102', '74', '3', '23', '191', '1', '4.49', '3.89'],
  ['140102', '33', '8', 'NULL', '235', '4', '0.99', '0.99'],
];
const PROD_HEADS = ['product_sk', 'sku', 'description', 'brand', 'category'];
const PROD_COLS = [78, 60, 86, 74, 80];
const PROD_ROWS = [
  ['30', 'OK4012', 'Bananas', 'Freshmax', 'Fresh fruit'],
  ['31', 'KA9511', 'Fish food', 'Aquatech', 'Pet supplies'],
  ['32', 'AB1234', 'Croissant', 'Dealicious', 'Bakery'],
];
const STORE_HEADS = ['store_sk', 'state', 'city'];
const STORE_COLS = [70, 46, 104];
const STORE_ROWS = [
  ['1', 'WA', 'Seattle'],
  ['2', 'CA', 'San Francisco'],
  ['3', 'CA', 'Palo Alto'],
];
const DATE_HEADS = ['date_key', 'year', 'month', 'day', 'weekday', 'is_holiday'];
const DATE_COLS = [70, 40, 46, 36, 56, 70];
const DATE_ROWS = [
  ['140101', '2014', 'jan', '1', 'wed', 'yes'],
  ['140102', '2014', 'jan', '2', 'thu', 'no'],
  ['140103', '2014', 'jan', '3', 'fri', 'no'],
];
const CUST_HEADS = ['customer_sk', 'name', 'date_of_birth'];
const CUST_COLS = [96, 52, 96];
const CUST_ROWS = [
  ['190', 'Alice', '1979-03-29'],
  ['191', 'Bob', '1961-09-02'],
  ['192', 'Cecil', '1991-12-13'],
];
const PROMO_HEADS = ['promotion_sk', 'name', 'ad_type', 'coupon_type'];
const PROMO_COLS = [96, 148, 76, 76];
const PROMO_ROWS = [
  ['18', 'New Year sale', 'Poster', 'NULL'],
  ['19', 'Aquarium deal', 'Direct mail', 'Leaflet'],
  ['20', 'Coffee & cake bundle', 'In-store sign', 'NULL'],
];
const FIELD_TAGS = ['提供哪些服务', '店内面包房', '面积多大', '开业日期', '翻新时间', '离高速多远'];
const FIELD_POS: [number, number][] = [[0, -180], [320, -180], [0, -90], [320, -90], [0, 0], [320, 0]];
const Q_LABELS = ['谁买的', '买了什么', '在哪买', '什么时候', '怎么买', '为什么买'];
const Q_TABLES = ['→ 顾客表', '→ 产品表', '→ 商店表', '→ 日期表', '→ 促销表', '→ 促销表'];
const Q_X = [-425, -255, -85, 85, 255, 425];

export default makeScene2D(function* (view) {
  view.fill(T.bg);
  const beat = makeBeats(timeline);

  const header = createRef<Txt>();
  const anchor = createRef<Txt>();
  const say = (text: string) => anchor().text(text);

  // j22–j27：星型长出来
  const starWrap = createRef<Node>();
  const fact = makeTableRefs(4, 8, createRef);
  const prod = makeTableRefs(3, 5, createRef);
  const store = makeTableRefs(3, 3, createRef);
  const date = makeTableRefs(3, 6, createRef);
  const cust = makeTableRefs(3, 3, createRef);
  const promo = makeTableRefs(3, 4, createRef);
  const prodWrap = createRef<Node>();
  const storeWrap = createRef<Node>();
  const dateWrap = createRef<Node>();
  const custWrap = createRef<Node>();
  const promoWrap = createRef<Node>();
  const aProd = createRef<Line>();
  const aStore = createRef<Line>();
  const aDate = createRef<Line>();
  const aCust = createRef<Line>();
  const aPromo = createRef<Line>();

  // j23：产品维度放大
  const zoomProd = createRef<Node>();
  const zoomProdTab = makeTableRefs(3, 7, createRef);
  const zoomProdTitle = createRef<Txt>();
  // r5 P2-1：脂肪含量、包装尺寸真正做进 dim_product 表成为第 6、第 7 列
  // （r4 的两张脱离产品表的单列表已删掉）；三行值随产品行对齐，鱼食行 8% / 500 克，标“示意”
  const PROD7_HEADS = ['product_sk', 'sku', 'description', 'brand', 'category', 'fat_content', 'package_size'];
  const PROD7_COLS = [78, 62, 96, 74, 96, 84, 92];
  const PROD7_ROWS = [
    ['30', 'OK4012', 'Bananas', 'Freshmax', 'Fresh fruit', '0.3%', '1千克'],
    ['31', 'KA9511', 'Fish food', 'Aquatech', 'Pet supplies', '8%', '500克'],
    ['32', 'AB1234', 'Croissant', 'Dealicious', 'Bakery', '12%', '80克'],
  ];
  const valNote = createRef<Txt>();

  // j27：六个问题牌
  const qRow = createRef<Node>();
  const qCards = [0, 1, 2, 3, 4, 5].map(() => createRef<Rect>());
  const qMarks = [0, 1, 2, 3, 4, 5].map(() => createRef<Txt>());
  const qLabs = [0, 1, 2, 3, 4, 5].map(() => createRef<Txt>());
  const qTabs = [0, 1, 2, 3, 4, 5].map(() => createRef<Txt>());
  // r5 P2-2：“怎么买”牌下方补一行小字，点名广告类型 + 优惠券类型两列
  const howBuyNote = createRef<Txt>();

  // j28：雪花（A 表：拆前原文；B 表：拆后只留外键）
  const g28 = createRef<Node>();
  const snowProdA = makeTableRefs(3, 5, createRef);
  const snowProdB = makeTableRefs(3, 5, createRef);
  const snowProdBWrap = createRef<Node>();
  // r5 P2-3：品牌表、类别表各加一列键（brand_sk / category_sk），产品表对应格填与之对应的编号。
  // 键编号是示意（书图没有 brand_sk / category_sk 值），画面标“示意”。
  const brandTab = makeTableRefs(3, 2, createRef);
  const catTab = makeTableRefs(3, 2, createRef);
  const brandWrap = createRef<Node>();
  const catWrap = createRef<Node>();
  const aBrand = createRef<Line>();
  const aCat = createRef<Line>();
  const fkNote = createRef<Txt>();
  const traceChip = createRef<Txt>();

  // j29：对照
  const g29 = createRef<Node>();
  const starRing = createRef<Circle>();
  const snowLab2 = createRef<Txt>();
  const starLab2 = createRef<Txt>();
  // r4：查牌子多连一张表的小标
  const multiJoinNote = createRef<Txt>();
  // r4（定格修）：j29 中段定格 6.27s（>6s）——规范化解释句整段无可见大动作。
  // 补“重复的信息，只存一份”标语随“规范化就是”出现、随“品牌名只在品牌表里出现一次”变黄。
  const normTag = createRef<Txt>();
  // r5 P2-4：同一品牌在三行产品里重复的示意演示（新增行标“示意”，不动书图的产品行），
  // 再收到品牌表的一行。演示板放在两图之间的空隙里。
  const repDemo = createRef<Node>();
  const repCap = createRef<Txt>();
  const repRows = [0, 1, 2].map(() => createRef<Rect>());
  const repTo = createRef<Node>();
  const repChip = createRef<Rect>();

  // j30：宽表
  const g30 = createRef<Node>();
  const wideBar = createRef<Rect>();
  const wideCells = Array.from({length: 10}, () => createRef<Rect>());
  const wideDots = createRef<Txt>();
  const wideLab = createRef<Txt>();
  const dimWide = createRef<Rect>();
  // r4：事实表多出来的列的例子小标（售价、进货成本——§3.9 正文 3.9-5 的属性例子）
  const extraColLab = createRef<Txt>();
  // r5 P2-6：十个方框中前两格标上列名；售价与净价不是同一列的小标；维度表拉宽画面
  const cellLab0 = createRef<Txt>();
  const cellLab1 = createRef<Txt>();
  const priceNote = createRef<Txt>();
  const dimWideNote = createRef<Txt>();

  // j31：商店维度变宽
  const g31 = createRef<Node>();
  const storeTab = makeTableRefs(3, 3, createRef);
  const storeTitle = createRef<Txt>();
  const fieldTags = FIELD_TAGS.map(() => createRef<Rect>());

  // j32：收束
  const g32 = createRef<Node>();
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

      {/* 整星：事实表居中，五张维度表逐张长出 */}
      <Node ref={starWrap} opacity={0}>
        {DataTable({
          key: 'factS', x0: -280, y0: -135, cols: FACT_COLS, heads: FACT_HEADS, rows: FACT_ROWS,
          headH: 24, rowH: 26, headSize: 11, cellSize: 13, hideRows: true, refs: fact,
        })}
        <Node ref={prodWrap} opacity={0}>
          {DataTable({
            key: 'prod', x0: -544, y0: -280, cols: PROD_COLS, heads: PROD_HEADS, rows: PROD_ROWS,
            headH: 24, rowH: 24, headSize: 11, cellSize: 13, sansCols: [2, 3, 4], refs: prod,
          })}
        </Node>
        <Node ref={storeWrap} opacity={0}>
          {DataTable({
            key: 'store', x0: 290, y0: -280, cols: STORE_COLS, heads: STORE_HEADS, rows: STORE_ROWS,
            headH: 24, rowH: 24, headSize: 11, cellSize: 13, sansCols: [2], refs: store,
          })}
        </Node>
        <Node ref={dateWrap} opacity={0}>
          {DataTable({
            key: 'date', x0: -524, y0: 130, cols: DATE_COLS, heads: DATE_HEADS, rows: DATE_ROWS,
            headH: 24, rowH: 24, headSize: 11, cellSize: 13, refs: date,
          })}
        </Node>
        <Node ref={custWrap} opacity={0}>
          {DataTable({
            key: 'cust', x0: 278, y0: 130, cols: CUST_COLS, heads: CUST_HEADS, rows: CUST_ROWS,
            headH: 24, rowH: 24, headSize: 11, cellSize: 13, sansCols: [1], refs: cust,
          })}
        </Node>
        <Node ref={promoWrap} opacity={0}>
          {DataTable({
            key: 'promo', x0: -198, y0: 150, cols: PROMO_COLS, heads: PROMO_HEADS, rows: PROMO_ROWS,
            headH: 24, rowH: 24, headSize: 11, cellSize: 12, sansCols: [1, 2, 3], refs: promo,
          })}
        </Node>
        <Line ref={aProd} points={[[-181, -135], [-181, -160], [-560, -160], [-560, -220], [-544, -220]]} stroke={T.yellow} lineWidth={3} endArrow opacity={0} />
        {/* r5 P2-A：三根箭头重排走线，落到维度表键列一侧的边上（产品、日期两根原本就在键列一侧）。
            商店：改从左缘进（原从右缘进，远离键列）；走线在事实表顶边上方的空隙里，不穿任何表。
            顾客：改从顶边进、落在键列头上方（原从右缘进）；水平段 y=80 在促销表顶边上方，不穿表。
            促销：改从顶边进、落在键列头上方（原从底边右角进）；竖段 x=-150 距日期表右缘 6px，不穿表。 */}
        <Line ref={aStore} points={[[-122, -135], [-122, -160], [260, -160], [260, -232], [290, -232]]} stroke={T.yellow} lineWidth={3} endArrow opacity={0} />
        <Line ref={aDate} points={[[-280, -19], [-560, -19], [-560, 190], [-524, 190]]} stroke={T.yellow} lineWidth={3} endArrow opacity={0} />
        <Line ref={aCust} points={[[280, -45], [545, -45], [545, 80], [320, 80], [320, 130]]} stroke={T.yellow} lineWidth={3} endArrow opacity={0} />
        <Line ref={aPromo} points={[[-50, -7], [-50, 80], [-150, 80], [-150, 150]]} stroke={T.yellow} lineWidth={3} endArrow opacity={0} />
      </Node>

      {/* j23：产品维度放大（r5：七列，脂肪含量、包装尺寸是表里的第 6、第 7 列） */}
      <Node ref={zoomProd} opacity={0}>
        <Txt ref={zoomProdTitle} position={[0, -218]} fontSize={SIZE.label} fontWeight={700} fill={T.text} fontFamily={FONT.mono} text={'dim_product · 产品维度表'} />
        {DataTable({
          key: 'zprod', x0: -291, y0: -180, cols: PROD7_COLS, heads: PROD7_HEADS, rows: PROD7_ROWS,
          headH: 34, rowH: 36, headSize: 12, cellSize: 16, sansCols: [2, 3, 4, 6], refs: zoomProdTab,
        })}
        <Txt ref={valNote} position={[0, 40]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'数值是示意的示例值'} opacity={0} />
      </Node>

      {/* j27：六个问题牌（r3：每张牌下方亮出对应的表名） */}
      <Node ref={qRow} opacity={0}>
        {[0, 1, 2, 3, 4, 5].map(i => (
          <Rect
            key={`qc-${i}`}
            ref={qCards[i]}
            position={[Q_X[i], 190]}
            width={160}
            height={60}
            radius={12}
            fill={T.card}
            stroke={T.blue}
            lineWidth={2}
          >
            <Txt ref={qMarks[i]} fontSize={SIZE.body} fontWeight={700} fill={T.muted} fontFamily={FONT.sans} text={'?'} />
            <Txt ref={qLabs[i]} position={[0, -12]} fontSize={SIZE.label} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={Q_LABELS[i]} opacity={0} />
            <Txt ref={qTabs[i]} position={[0, 16]} fontSize={16} fontWeight={700} fill={T.blue} fontFamily={FONT.sans} text={Q_TABLES[i]} opacity={0} />
          </Rect>
        ))}
      </Node>
      <Txt ref={howBuyNote} position={[255, 242]} fontSize={16} fontWeight={700} fill={T.blue} fontFamily={FONT.sans} text={'广告类型 + 优惠券类型'} opacity={0} />

      {/* j28：雪花 */}
      <Node ref={g28} opacity={0}>
        {DataTable({
          key: 'snowProdA', x0: -560, y0: -160, cols: PROD_COLS, heads: PROD_HEADS, rows: PROD_ROWS,
          headH: 24, rowH: 24, headSize: 11, cellSize: 13, sansCols: [2, 3, 4], refs: snowProdA,
        })}
        <Node ref={snowProdBWrap} opacity={0}>
          {DataTable({
            key: 'snowProdB', x0: -560, y0: -160, cols: PROD_COLS, heads: ['product_sk', 'sku', 'description', 'brand_sk', 'category_sk'], rows: [
              ['30', 'OK4012', 'Bananas', '201', '301'],
              ['31', 'KA9511', 'Fish food', '202', '302'],
              ['32', 'AB1234', 'Croissant', '203', '303'],
            ],
            headH: 24, rowH: 24, headSize: 11, cellSize: 13, sansCols: [2, 3, 4], refs: snowProdB,
          })}
        </Node>
        <Node ref={brandWrap} opacity={0}>
          {DataTable({
            key: 'brand', x0: 60, y0: -200, cols: [80, 110], heads: ['brand_sk', 'brand'], rows: [['201', 'Freshmax'], ['202', 'Aquatech'], ['203', 'Dealicious']],
            headH: 24, rowH: 24, headSize: 11, cellSize: 13, sansCols: [1], refs: brandTab,
          })}
        </Node>
        <Node ref={catWrap} opacity={0}>
          {DataTable({
            key: 'cat', x0: 60, y0: 20, cols: [110, 130], heads: ['category_sk', 'category'], rows: [['301', 'Fresh fruit'], ['302', 'Pet supplies'], ['303', 'Bakery']],
            headH: 24, rowH: 24, headSize: 11, cellSize: 13, sansCols: [1], refs: catTab,
          })}
        </Node>
        {/* r5 P2-3：品牌箭头从鱼食行（B 表第 2 行，y=-100）斜指 Aquatech 行（品牌表第 2 行，y=-140），
            像 j13 那样逐行追踪“鱼食 → Aquatech”这一根连线 */}
        <Line ref={aBrand} points={[[-182, -100], [60, -140]]} stroke={T.purple} lineWidth={3} endArrow opacity={0} />
        <Line ref={aCat} points={[[-182, -60], [20, -60], [20, 80], [60, 80]]} stroke={T.purple} lineWidth={3} endArrow opacity={0} />
        <Txt ref={fkNote} position={[-371, -30]} fontSize={18} fill={T.purple} fontFamily={FONT.sans} text={'这两列存的是外键（编号是示意）'} opacity={0} />
        <Txt ref={traceChip} position={[330, -60]} fontSize={18} fontWeight={700} fill={T.purple} fontFamily={FONT.sans} text={'鱼食 → Aquatech（品牌 202）'} opacity={0} />
      </Node>

      {/* j29：雪花 vs 星型（r5 P2-4：圆圈逐个打上表名） */}
      <Node ref={g29} opacity={0}>
        <Circle position={[-320, -40]} width={90} height={90} fill={T.card} stroke={T.purple} lineWidth={3} />
        <Txt position={[-320, -40]} fontSize={SIZE.label} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'事实'} />
        {[[-320, -180], [-450, 40], [-190, 40]].map(([x, y], i) => (
          <Circle key={`sn-${i}`} position={[x, y]} width={44} height={44} fill={T.card} stroke={T.purple} lineWidth={2} />
        ))}
        <Txt position={[-320, -180]} fontSize={11} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'产品'} />
        <Txt position={[-450, 40]} fontSize={11} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'品牌'} />
        <Txt position={[-190, 40]} fontSize={11} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'类别'} />
        <Circle position={[-450, 100]} width={36} height={36} fill={T.card} stroke={T.purple} lineWidth={2} />
        <Txt position={[-450, 100]} fontSize={10} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'子维度'} />
        <Line points={[[-320, -85], [-320, -158]]} stroke={T.purple} lineWidth={2} />
        <Line points={[[-360, -8], [-428, 22]]} stroke={T.purple} lineWidth={2} />
        <Line points={[[-280, -8], [-212, 22]]} stroke={T.purple} lineWidth={2} />
        <Line points={[[-450, 62], [-450, 82]]} stroke={T.purple} lineWidth={2} />
        <Txt ref={snowLab2} position={[-320, 170]} fontSize={SIZE.body} fontWeight={700} fill={T.purple} fontFamily={FONT.sans} text={'雪花：更规范化'} opacity={0} />
        <Txt ref={normTag} position={[-320, 215]} fontSize={SIZE.body} fontWeight={700} fill={T.purple} fontFamily={FONT.sans} text={'重复的信息，只存一份'} opacity={0} />
        <Txt ref={multiJoinNote} position={[-320, 250]} fontSize={SIZE.label} fill={T.purple} fontFamily={FONT.sans} text={'查牌子：事实 → 产品 → 品牌，多连一张表'} opacity={0} />
        <Circle position={[320, -40]} width={90} height={90} fill={T.card} stroke={T.yellow} lineWidth={3} />
        <Txt position={[320, -40]} fontSize={SIZE.label} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'事实'} />
        <Circle ref={starRing} position={[320, -40]} width={260} height={260} stroke={T.yellow} lineWidth={3} opacity={0} />
        {[[320, -180], [450, -90], [400, 80], [240, 80], [190, -90]].map(([x, y], i) => (
          <Circle key={`st-${i}`} position={[x, y]} width={44} height={44} fill={T.card} stroke={T.blue} lineWidth={2} />
        ))}
        <Txt position={[320, -180]} fontSize={11} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'产品'} />
        <Txt position={[450, -90]} fontSize={11} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'商店'} />
        <Txt position={[400, 80]} fontSize={11} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'日期'} />
        <Txt position={[240, 80]} fontSize={11} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'顾客'} />
        <Txt position={[190, -90]} fontSize={11} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'促销'} />
        <Txt ref={starLab2} position={[320, 170]} fontSize={SIZE.body} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'星型：更简单'} opacity={0} />
        {/* r5 P2-4：重复示意演示——同一品牌 Aquatech 用在三行产品里，收到品牌表里只剩一行。
            鱼食行是书图原行；猫粮、鸟食两行是新增的示意行，行内标“示意”。 */}
        <Node ref={repDemo} opacity={0}>
          <Txt ref={repCap} position={[0, -175]} fontSize={18} fontWeight={700} fill={T.purple} fontFamily={FONT.sans} text={'示意：同一个品牌，用在三行产品里'} />
          {['鱼食 · Aquatech', '猫粮 · Aquatech（示意）', '鸟食 · Aquatech（示意）'].map((t, i) => (
            <Rect
              key={`rp-${i}`}
              ref={repRows[i]}
              position={[0, -125 + i * 45]}
              width={340}
              height={40}
              radius={8}
              fill={T.card}
              stroke={T.line}
              lineWidth={2}
            >
              <Txt fontSize={16} fill={T.text} fontFamily={FONT.sans} text={t} />
            </Rect>
          ))}
          <Node ref={repTo} opacity={0}>
            <Txt position={[0, 5]} fontSize={18} fontWeight={700} fill={T.purple} fontFamily={FONT.sans} text={'↓ 收到品牌表里'} />
            <Rect ref={repChip} position={[0, 55]} width={340} height={44} radius={8} fill={T.card} stroke={T.purple} lineWidth={2}>
              <Txt fontSize={18} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'品牌表：Aquatech，只存一次'} />
            </Rect>
          </Node>
        </Node>
      </Node>

      {/* j30：宽表 */}
      <Node ref={g30} opacity={0}>
        <Rect ref={wideBar} position={[0, -80]} width={1100} height={90} radius={14} fill={T.card} stroke={T.line} lineWidth={2} />
        {wideCells.map((r, i) => (
          <Rect key={`wc-${i}`} ref={r} position={[-495 + i * 100, -80]} width={70} height={50} radius={8} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0} />
        ))}
        <Txt ref={cellLab0} position={[-495, -80]} fontSize={14} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'售价'} opacity={0} />
        <Txt ref={cellLab1} position={[-395, -80]} fontSize={14} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'进货成本'} opacity={0} />
        <Txt ref={wideDots} position={[480, -80]} fontSize={SIZE.title} fontWeight={700} fill={T.muted} fontFamily={FONT.sans} text={'…'} opacity={0} />
        <Txt ref={wideLab} position={[0, 40]} fontSize={SIZE.body} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'一百多列，有时几百列'} opacity={0} />
        <Txt ref={extraColLab} position={[0, 82]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'比如：售价、进货成本……'} opacity={0} />
        <Txt ref={priceNote} position={[0, 122]} fontSize={18} fill={T.yellow} fontFamily={FONT.sans} text={'售价是举例用的另一个属性列名，和净价、折扣价不是同一列'} opacity={0} />
        <Rect ref={dimWide} position={[0, 175]} width={700} height={60} radius={12} fill={T.card} stroke={T.purple} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'维度表也可以很宽'} />
        </Rect>
        <Txt ref={dimWideNote} position={[0, 228]} fontSize={18} fill={T.purple} fontFamily={FONT.sans} text={'列越加越多 →'} opacity={0} />
      </Node>

      {/* j31：商店维度变宽 */}
      <Node ref={g31} opacity={0}>
        <Txt ref={storeTitle} position={[-375, -215]} fontSize={SIZE.label} fontWeight={700} fill={T.text} fontFamily={FONT.mono} text={'dim_store · 商店维度表'} />
        {DataTable({
          key: 'storeW', x0: -520, y0: -180, cols: [90, 60, 170], heads: STORE_HEADS, rows: STORE_ROWS,
          headH: 34, rowH: 36, headSize: 14, cellSize: 18, sansCols: [2], refs: storeTab,
        })} // 放大表不用环形小表的列宽 [70,46,104]：18px 下 San Francisco 约 150px，城市列须 ≥170 才不被分隔线穿字
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

      {/* j32：收束 */}
      <Node ref={g32} opacity={0}>
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

  // 推镜头（不用 Motion Canvas 的 Camera 组件）：整星缓慢放大 j24–j26
  const cam = new Cam(starWrap());

  say('事实表在中间');
  yield* beat('j22',
    all(starWrap().opacity(1, 0.5)),
    at('四行事实都在', chain(fact.rows[0]().opacity(1, 0.4), fact.rows[1]().opacity(1, 0.4), fact.rows[2]().opacity(1, 0.4), fact.rows[3]().opacity(1, 0.4))),
    at('星星', fact.root().scale(1.015, 1.5)),
  );

  say('一行，一种产品');
  yield* beat('j23',
    all(prodWrap().opacity(1, 0.5)),
    at('一行就是一种在售产品', chain(starWrap().opacity(0, 0.4), zoomProd().opacity(1, 0.5))),
    at('货号', zoomProdTab.headTxt[1]().fill(T.yellow, 0.4)),
    at('描述', zoomProdTab.headTxt[2]().fill(T.yellow, 0.4)),
    at('品牌', zoomProdTab.headTxt[3]().fill(T.yellow, 0.4)),
    at('类别', zoomProdTab.headTxt[4]().fill(T.yellow, 0.4)),
  );

  say('脂肪含量、包装尺寸');
  yield* beat('j23b',
    // r5 P2-1：两列真正长在产品表里，随产品行对齐；念到列名时列头变黄、列框亮起
    at('脂肪含量', all(zoomProdTab.headTxt[5]().fill(T.yellow, 0.4), zoomProdTab.hlCols[5]().opacity(1, 0.4))),
    at('包装尺寸', all(zoomProdTab.headTxt[6]().fill(T.yellow, 0.4), zoomProdTab.hlCols[6]().opacity(1, 0.4))),
  );

  say('脂肪含量 8% · 包装 500 克（示意）');
  yield* beat('j23c',
    // r5 P2-1：鱼食整行高亮横穿七列（不再是两张小表里的两格被圈住）
    at('鱼食这一行', zoomProdTab.hlRows[1]().opacity(1, 0.4)),
    at('脂肪含量 8%', zoomProdTab.hlCols[5]().stroke(T.green, 0.4)),
    at('包装 500 克', zoomProdTab.hlCols[6]().stroke(T.green, 0.4)),
    at('数值是示意的', valNote().opacity(1, 0.4)),
    at('产品表还能再加列', zoomProd().scale(1.015, 1.0)),
  );

  say('四维围成一圈');
  yield* beat('j24',
    chain(zoomProd().opacity(0, 0.4), starWrap().opacity(1, 0.5)),
    at('商店', storeWrap().opacity(1, 0.5)),
    at('日期', dateWrap().opacity(1, 0.5)),
    at('顾客', custWrap().opacity(1, 0.5)),
    at('促销', promoWrap().opacity(1, 0.5)),
    at('围成一圈', cam.focus([0, 0], 1.015, 1.0)),
  );

  say('事实在中间，五维围一圈');
  yield* beat('j25',
    cam.focus([0, 0], 1.03, beat.dur('j25')),
    at('产品', chain(prodWrap().opacity(0.55, 0.3), prodWrap().opacity(1, 0.3))),
    at('商店', chain(storeWrap().opacity(0.55, 0.3), storeWrap().opacity(1, 0.3))),
    at('日期', chain(dateWrap().opacity(0.55, 0.3), dateWrap().opacity(1, 0.3))),
    at('顾客', chain(custWrap().opacity(0.55, 0.3), custWrap().opacity(1, 0.3))),
    at('促销', chain(promoWrap().opacity(0.55, 0.3), promoWrap().opacity(1, 0.3))),
  );

  say('连线像星星的光芒');
  yield* beat('j26',
    cam.focus([0, 0], 1.04, beat.dur('j26')),
    // r4：箭头逐根亮起时，事实表里对应的外键列头与维度表里对应的键列头同步亮起（修 P2-8）
    at('产品', all(aProd().opacity(1, 0.5), fact.headTxt[1]().fill(T.yellow, 0.4), prod.headTxt[0]().fill(T.yellow, 0.4))),
    at('商店', all(aStore().opacity(1, 0.5), fact.headTxt[2]().fill(T.yellow, 0.4), store.headTxt[0]().fill(T.yellow, 0.4))),
    at('日期', all(aDate().opacity(1, 0.5), fact.headTxt[0]().fill(T.yellow, 0.4), date.headTxt[0]().fill(T.yellow, 0.4))),
    at('顾客', all(aCust().opacity(1, 0.5), fact.headTxt[4]().fill(T.yellow, 0.4), cust.headTxt[0]().fill(T.yellow, 0.4))),
    at('促销', all(aPromo().opacity(1, 0.5), fact.headTxt[3]().fill(T.yellow, 0.4), promo.headTxt[0]().fill(T.yellow, 0.4))),
  );

  say('谁、什么、何处、何时');
  yield* beat('j27',
    chain(
      all(prodWrap().opacity(0, 0.4), storeWrap().opacity(0, 0.4), dateWrap().opacity(0, 0.4), custWrap().opacity(0, 0.4), promoWrap().opacity(0, 0.4), aProd().opacity(0, 0.4), aStore().opacity(0, 0.4), aDate().opacity(0, 0.4), aCust().opacity(0, 0.4), aPromo().opacity(0, 0.4)),
      qRow().opacity(1, 0.5),
    ),
    at('六个问题', all(fact.hlRows[0]().opacity(1, 0.4), qRow().scale(1.02, 1.0))),
    at('谁买的', all(chain(qMarks[0]().opacity(0, 0.2), qLabs[0]().opacity(1, 0.3), qTabs[0]().opacity(1, 0.3)), fact.hlCols[4]().stroke(T.yellow, 0.3), fact.hlCols[4]().opacity(1, 0.4))),
    at('买了什么', all(chain(qMarks[1]().opacity(0, 0.2), qLabs[1]().opacity(1, 0.3), qTabs[1]().opacity(1, 0.3)), fact.hlCols[1]().stroke(T.yellow, 0.3), fact.hlCols[1]().opacity(1, 0.4))),
    at('在哪买', all(chain(qMarks[2]().opacity(0, 0.2), qLabs[2]().opacity(1, 0.3), qTabs[2]().opacity(1, 0.3)), fact.hlCols[2]().stroke(T.yellow, 0.3), fact.hlCols[2]().opacity(1, 0.4))),
    at('什么时候', all(chain(qMarks[3]().opacity(0, 0.2), qLabs[3]().opacity(1, 0.3), qTabs[3]().opacity(1, 0.3)), fact.hlCols[0]().stroke(T.yellow, 0.3), fact.hlCols[0]().opacity(1, 0.4))),
  );

  say('怎么买、为什么买，共用促销表');
  yield* beat('j27b',
    at('怎么买', all(chain(qMarks[4]().opacity(0, 0.2), qLabs[4]().opacity(1, 0.3), qTabs[4]().opacity(1, 0.3), howBuyNote().opacity(1, 0.3)), fact.hlCols[3]().stroke(T.yellow, 0.3), fact.hlCols[3]().opacity(1, 0.4))),
    // r5 P2-B：与底部旁白锚同义的“怎么买、为什么买，共用一张促销表”小标已去掉，只留锚
    at('为什么买', all(chain(qMarks[5]().opacity(0, 0.2), qLabs[5]().opacity(1, 0.3), qTabs[5]().opacity(1, 0.3)), fact.hlRows[0]().stroke(T.yellow, 0.3), fact.hlRows[0]().opacity(1, 0.4))),
    at('维度，就是这六个问题的答案', all(fact.hlRows[0]().stroke(T.green, 0.4), qRow().scale(1.02, 1.0))),
  );

  say('品牌、类别，各成一张表');
  yield* beat('j28',
    chain(all(starWrap().opacity(0, 0.4), qRow().opacity(0, 0.4), howBuyNote().opacity(0, 0.4)), g28().opacity(1, 0.5)),
    at('品牌和类别', chain(snowProdA.hlCols[3]().stroke(T.purple, 0.3), snowProdA.hlCols[3]().opacity(1, 0.4), snowProdA.hlCols[4]().stroke(T.purple, 0.3), snowProdA.hlCols[4]().opacity(1, 0.4))),
    at('各成一张表', chain(brandWrap().opacity(1, 0.5), catWrap().opacity(1, 0.5), aBrand().opacity(1, 0.5), aCat().opacity(1, 0.5))),
    at('只留外键', chain(all(snowProdA.root().opacity(0, 0.3)), snowProdBWrap().opacity(1, 0.3), fkNote().opacity(1, 0.3), snowProdB.hlRows[1]().opacity(1, 0.4), brandTab.hlRows[1]().opacity(1, 0.4), traceChip().opacity(1, 0.4))),
    at('不再直接存', snowProdB.hlCols[3]().opacity(1, 0.4)),
    at('这两个词', snowProdB.hlCols[4]().opacity(1, 0.4)),
  );

  say('星型，更简单');
  yield* beat('j29',
    chain(g28().opacity(0, 0.4), g29().opacity(1, 0.5)),
    at('雪花模式', snowLab2().opacity(1, 0.5)),
    // r5 P2-4：规范化解释句配重复示意演示——三行描边变黄（重复三遍），再收到品牌表的一行
    at('规范化就是', all(normTag().opacity(1, 0.5), repDemo().opacity(1, 0.5))),
    at('三行产品都用它', all(repRows[0]().stroke(T.yellow, 0.4), repRows[1]().stroke(T.yellow, 0.4), repRows[2]().stroke(T.yellow, 0.4))),
    at('品牌名在产品表里就写了三遍', normTag().fill(T.yellow, 0.4)),
    at('收到品牌表里', all(repTo().opacity(1, 0.5), repChip().stroke(T.yellow, 0.4))),
    at('就只剩一行', chain(repChip().scale(1.04, 0.5), repChip().scale(1.0, 0.5))),
    at('多连一张表', multiJoinNote().opacity(1, 0.5)),
    at('更受青睐', starRing().opacity(1, 0.6)),
    at('更简单', starLab2().opacity(1, 0.5)),
  );

  say('一百多列，有时几百列');
  yield* beat('j30',
    chain(g29().opacity(0, 0.4), g30().opacity(1, 0.5)),
    at('一百多列', chain(...wideCells.map(c => c().opacity(1, 0.25)), wideDots().opacity(1, 0.4))),
    at('几百列', wideLab().opacity(1, 0.5)),
    // r5 P2-6：例子落到列上——前两格标上“售价”“进货成本”；书 3.9-5 只给属性例子，
    // 未定义售价与净价的关系，不现编：小标言明售价是举例用的另一个属性列名、与净价/折扣价不是同一列
    at('商品的售价', all(extraColLab().opacity(1, 0.5), cellLab0().opacity(1, 0.4))),
    at('从供应商进货的成本', cellLab1().opacity(1, 0.4)),
    at('售价是举例用的', priceNote().opacity(1, 0.5)),
    // r5 P2-6：“维度表也可以很宽”配横向拉宽的画面，不再只有文字框
    at('维度表也可以很宽', chain(dimWide().opacity(1, 0.3), dimWide().width(1100, 1.2), dimWideNote().opacity(1, 0.4))),
  );

  say('商店表也能很宽');
  yield* beat('j31',
    chain(g30().opacity(0, 0.4), g31().opacity(1, 0.5)),
    at('提供哪些服务', fieldTags[0]().opacity(1, 0.4)),
    at('店内面包房', fieldTags[1]().opacity(1, 0.4)),
    at('面积多大', fieldTags[2]().opacity(1, 0.4)),
    at('哪天开业', fieldTags[3]().opacity(1, 0.4)),
    at('哪天翻新', fieldTags[4]().opacity(1, 0.4)),
    at('离最近的高速多远', all(fieldTags[5]().opacity(1, 0.4), g31().scale(1.015, 1.5))),
  );

  say('一笔销售，一行事实');
  yield* beat('j32',
    chain(g31().opacity(0, 0.4), g32().opacity(1, 0.5)),
    at('一笔销售是一行事实', all(closeLine1().opacity(1, 0.6), g32().scale(1.02, 4.0))),
    at('五个维度围成一颗星', closeLine2().opacity(1, 0.6)),
    at('分析的形状就定下来了', g32().scale(1.03, 1.2)),
  );
});
