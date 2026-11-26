// U10 场景 2（MC）：j12–j21 —— 属性列 vs 外键列（j12）、一行事实指向五个维度：
// 产品 31→鱼食（j13）、商店 3→帕洛阿尔托（j14–j15）、促销 19→水族促销（j16–j17）、
// 顾客 191→鲍勃（j18–j19）、日期 140102→2014-01-02 星期四非节假日（j20–j21，含节假日放大）。
// 分镜：skill-ch03/beats-u10.md（r2）；原文：DDIA §3.9（书页 p94–95，PDF p116–117）。
// 五张维度表与外键箭头按原图图片重画：行内容、箭头落点逐格核对过；箭头走表外空隙，不穿文字。
// r3：j12 例子换成表里有的列（数量、净价、折扣价）；j13 旁白读出货号/品牌/类别并给一次映射
// “产品编号 = product_sk”；j14 读出州 CA（就是加州）；j13/j14/j16/j18/j20 各加 1.5s hold。
// r4：j12 逐列点名五个外键、业务表卡淡出 1.0s 放到 2.5s（r3 P2-1 顺带修）；j13–j20 每换一行点明行号
// （第 1 行→第 2 行→第 3 行→四行日期），走查时高亮当前行；j17 把怎么买/为什么买指到列上。
// 时长全部来自 timeline/u10.json（beat() 驱动），不手写 waitFor。
import {Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, chain, createRef} from '@motion-canvas/core';
import {at, makeBeats} from '../../lib/beats';
import {FONT, SAFE, SIZE, T} from '../../lib/theme';
import {KV} from '../../lib/schemas';
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

export default makeScene2D(function* (view) {
  view.fill(T.bg);
  const beat = makeBeats(timeline);

  const header = createRef<Txt>();
  const anchor = createRef<Txt>();
  const say = (text: string) => anchor().text(text);

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
  const bizCard = createRef<Rect>();
  const dimLab = createRef<Txt>();
  const mapChip = createRef<Txt>();
  // r5 小摩擦（j12 图例）：绿框 = 属性、蓝框 = 外键，表下方加一行图例小字
  const legendLab = createRef<Txt>();

  // 外键芯片：有身份的数据块，沿外键箭头走（j13/j14/j16/j18/j20 各一颗）
  const chipProd = new KV('31', '', 'key', {w: 56, tone: T.yellow});
  const chipStore = new KV('3', '', 'key', {w: 48, tone: T.yellow});
  const chipPromo = new KV('19', '', 'key', {w: 56, tone: T.yellow});
  const chipCust = new KV('191', '', 'key', {w: 64, tone: T.yellow});
  const chipDate = new KV('140102', '', 'key', {w: 96, tone: T.yellow});

  // j21：日期维度放大
  const zoomDate = createRef<Node>();
  const zoomDateTab = makeTableRefs(3, 6, createRef);
  const zoomDateTitle = createRef<Txt>();
  const holTag = createRef<Txt>();
  const normalTag = createRef<Txt>();
  // r5 P2-5：节假日 / 平时两组销售额（示意），各归一摞
  const holCard = createRef<Rect>();
  const normCard = createRef<Rect>();

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

      {/* 整星：事实表常驻，五张维度表逐张长出 */}
      <Node ref={starWrap}>
        {DataTable({
          key: 'factS', x0: -280, y0: -135, cols: FACT_COLS, heads: FACT_HEADS, rows: FACT_ROWS,
          headH: 24, rowH: 26, headSize: 11, cellSize: 13, refs: fact,
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
        <Line ref={aStore} points={[[-122, -135], [-122, -160], [540, -160], [540, -196], [510, -196]]} stroke={T.yellow} lineWidth={3} endArrow opacity={0} />
        <Line ref={aDate} points={[[-280, -19], [-560, -19], [-560, 190], [-524, 190]]} stroke={T.yellow} lineWidth={3} endArrow opacity={0} />
        <Line ref={aCust} points={[[280, -45], [545, -45], [545, 190], [522, 190]]} stroke={T.yellow} lineWidth={3} endArrow opacity={0} />
        <Line ref={aPromo} points={[[-50, -7], [-50, 80], [230, 80], [230, 210], [198, 210]]} stroke={T.yellow} lineWidth={3} endArrow opacity={0} />
      </Node>
      {chipProd.node}
      {chipStore.node}
      {chipPromo.node}
      {chipCust.node}
      {chipDate.node}
      <Rect ref={bizCard} position={[0, 60]} width={640} height={90} radius={14} fill={T.card} stroke={T.red} lineWidth={2} opacity={0}>
        <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'业务表：原样搬过来？'} />
      </Rect>
      <Txt ref={dimLab} position={[0, 100]} fontSize={SIZE.label} fontWeight={700} fill={T.blue} fontFamily={FONT.sans} text={'外键 → 维度表'} opacity={0} />
      <Txt ref={legendLab} position={[0, 230]} fontSize={18} fill={T.muted} fontFamily={FONT.sans} text={'绿框 = 属性列（留在本表），蓝框 = 外键列（指到维度表）'} opacity={0} />
      <Txt ref={mapChip} position={[0, 230]} fontSize={SIZE.label} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'产品编号 = product_sk'} opacity={0} />

      {/* j21：日期维度放大 */}
      <Node ref={zoomDate} opacity={0}>
        <Txt ref={zoomDateTitle} position={[0, -240]} fontSize={SIZE.label} fontWeight={700} fill={T.text} fontFamily={FONT.mono} text={'dim_date · 日期维度表'} />
        {DataTable({
          key: 'zdate', x0: -330, y0: -200, cols: [90, 60, 70, 50, 80, 90], heads: DATE_HEADS, rows: DATE_ROWS,
          headH: 34, rowH: 36, headSize: 14, cellSize: 18, refs: zoomDateTab,
        })}
        <Txt ref={holTag} position={[340, -147]} fontSize={SIZE.body} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'节假日'} opacity={0} />
        <Txt ref={normalTag} position={[340, -93]} fontSize={SIZE.body} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'平时'} opacity={0} />
        <Rect ref={holCard} position={[-190, 110]} width={360} height={70} radius={12} fill={T.card} stroke={T.yellow} lineWidth={2} opacity={0}>
          <Txt fontSize={18} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'节假日 · 销售额 12,400（示意）'} />
        </Rect>
        <Rect ref={normCard} position={[190, 110]} width={360} height={70} radius={12} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt fontSize={18} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'平时 · 销售额 8,600（示意）'} />
        </Rect>
      </Node>
    </>
  );

  say('属性列，外键列');
  yield* beat('j12',
    all(starWrap().opacity(1, 0.5)),
    at('原样搬过来', chain(bizCard().opacity(1, 0.5), bizCard().opacity(0, 2.5))),
    at('数量、净价、折扣价', all(
      chain(fact.hlCols[5]().stroke(T.green, 0.3), fact.hlCols[5]().opacity(1, 0.4)),
      chain(fact.hlCols[6]().stroke(T.green, 0.3), fact.hlCols[6]().opacity(1, 0.4)),
      chain(fact.hlCols[7]().stroke(T.green, 0.3), fact.hlCols[7]().opacity(1, 0.4)),
    )),
    at('外键', all(
      chain(fact.hlCols[0]().stroke(T.blue, 0.3), fact.hlCols[0]().opacity(1, 0.4)),
      chain(fact.hlCols[1]().stroke(T.blue, 0.3), fact.hlCols[1]().opacity(1, 0.4)),
      chain(fact.hlCols[2]().stroke(T.blue, 0.3), fact.hlCols[2]().opacity(1, 0.4)),
      chain(fact.hlCols[3]().stroke(T.blue, 0.3), fact.hlCols[3]().opacity(1, 0.4)),
      chain(fact.hlCols[4]().stroke(T.blue, 0.3), fact.hlCols[4]().opacity(1, 0.4)),
    )),
    at('维度表', all(dimLab().opacity(1, 0.5), legendLab().opacity(1, 0.5))),
  );

  say('产品表长出来了');
  yield* beat('j13',
    all(prodWrap().opacity(1, 0.5), dimLab().opacity(0, 0.4), legendLab().opacity(0, 0.4)),
    at('先看第 1 行', fact.hlRows[0]().opacity(1, 0.4)),
    at('产品编号 31', chain(
      all(aProd().opacity(1, 0.6), fact.hlCols[1]().opacity(1, 0.4)),
      chipProd.appear([-181, -160], 0.3),
      chipProd.moveTo([-370, -160], 1.2),
      chipProd.hide(0.3),
    )),
    at('也就是表头写的', mapChip().opacity(1, 0.4)),
    at('指向产品表里', prod.hlRows[1]().opacity(0.35, 0.5)),
    at('鱼食', prod.hlRows[1]().opacity(1, 0.4)),
    at('货号', prod.hlCols[1]().opacity(1, 0.4)),
    at('品牌', prod.hlCols[3]().opacity(1, 0.4)),
    at('类别', prod.hlCols[4]().opacity(1, 0.4)),
    at('买了什么', prod.hlRows[1]().stroke(T.green, 0.4)),
  );

  say('商店表长出来了');
  yield* beat('j14',
    all(storeWrap().opacity(1, 0.5), mapChip().opacity(0, 0.4)),
    at('商店编号 3', chain(
      all(aStore().opacity(1, 0.6), fact.hlCols[2]().opacity(1, 0.4)),
      chipStore.appear([-122, -160], 0.3),
      chipStore.moveTo([200, -160], 1.2),
      chipStore.hide(0.3),
    )),
    at('帕洛阿尔托', store.hlRows[2]().opacity(1, 0.4)),
    at('州写着 CA', store.hlCols[1]().opacity(1, 0.4)),
    at('答案在这里', store.hlRows[2]().stroke(T.green, 0.4)),
  );

  say('一行，一家店');
  yield* beat('j15',
    at('州', store.hlCols[1]().opacity(1, 0.4)),
    at('城市', store.hlCols[2]().opacity(1, 0.4)),
    at('加州', store.hlRows[2]().stroke(T.green, 0.4)),
  );

  say('促销表长出来了');
  yield* beat('j16',
    all(promoWrap().opacity(1, 0.5), fact.hlRows[0]().opacity(0, 0.4)),
    at('换到第 2 行', fact.hlRows[1]().opacity(1, 0.4)),
    at('促销编号 19', chain(
      all(aPromo().opacity(1, 0.6), fact.hlCols[3]().opacity(1, 0.4)),
      chipPromo.appear([-50, 40], 0.3),
      chipPromo.moveTo([-50, 80], 0.6),
      chipPromo.moveTo([140, 80], 0.8),
      chipPromo.hide(0.3),
    )),
    at('水族促销', promo.hlRows[1]().opacity(1, 0.4)),
    at('赶上了水族促销', promo.hlRows[1]().stroke(T.green, 0.4)),
  );

  say('直邮 · 传单');
  yield* beat('j17',
    // r5 P2-2：直邮、传单分两次点名——念到“直邮”只亮 ad_type 列，念到“传单”再亮 coupon_type 列。
    // cue 必须用“写着直邮 / 写着传单”这种只出现一次的短语：旁白开头“靠直邮和传单推出来”里两个词
    // 先出现过一次，at() 取首次出现位置，用裸词会提前亮错。
    at('广告类型', promo.hlCols[2]().opacity(1, 0.4)),
    // r4：j17 中段定格 6.60s（>6s）——小表细框淡入检不出。'写着直邮'处给促销表一个 4% 出入脉冲
    // （大元素整体缩放，定格可检出；出入后回到 1.0，尺寸不变）。
    at('写着直邮', chain(promoWrap().scale(1.04, 0.6), promoWrap().scale(1.0, 0.6))),
    at('优惠券类型', promo.hlCols[3]().opacity(1, 0.4)),
    at('写着传单', promo.hlRows[1]().stroke(T.yellow, 0.4)),
    at('看促销名本身', promo.hlCols[1]().opacity(1, 0.4)),
    at('赶上了水族促销这场活动', promo.hlRows[1]().stroke(T.green, 0.4)),
  );

  say('顾客表长出来了');
  yield* beat('j18',
    all(custWrap().opacity(1, 0.5), fact.hlRows[1]().opacity(0, 0.4)),
    at('再看第 3 行', fact.hlRows[2]().opacity(1, 0.4)),
    at('顾客编号 191', chain(
      all(aCust().opacity(1, 0.6), fact.hlCols[4]().opacity(1, 0.4)),
      chipCust.appear([410, -45], 0.3),
      chipCust.moveTo([545, -45], 0.9),
      chipCust.hide(0.3),
    )),
    at('鲍勃', cust.hlRows[1]().opacity(1, 0.4)),
    at('答案在这里', cust.hlRows[1]().stroke(T.green, 0.4)),
  );

  say('一行，一位顾客');
  yield* beat('j19',
    at('生日', cust.hlCols[2]().opacity(1, 0.4)),
    at('1961 年 9 月 2 日', cust.hlRows[1]().stroke(T.green, 0.4)),
    at('顾客表里存的', cust.hlCols[1]().opacity(1, 0.4)),
    at('买家的背景', cust.hlRows[1]().stroke(T.yellow, 0.4)),
  );

  say('日期表长出来了');
  yield* beat('j20',
    all(dateWrap().opacity(1, 0.5), fact.hlRows[2]().opacity(0, 0.4)),
    at('指向', date.hlRows[1]().opacity(0.35, 0.5)),
    at('2014 年 1 月 2 日', chain(
      all(aDate().opacity(1, 0.6), fact.hlCols[0]().opacity(1, 0.4)),
      chipDate.appear([-420, -19], 0.3),
      chipDate.moveTo([-520, -19], 0.9),
      chipDate.hide(0.3),
    )),
    at('星期四', date.hlRows[1]().opacity(1, 0.4)),
    at('不是节假日', date.hlRows[1]().stroke(T.green, 0.4)),
  );

  say('节假日，分开算');
  yield* beat('j21',
    chain(all(starWrap().opacity(0, 0.4), dimLab().opacity(0, 0.4)), zoomDate().opacity(1, 0.5)),
    at('多带一份信息', zoomDateTab.hlCols[5]().opacity(1, 0.5)),
    at('公共节假日', all(holTag().opacity(1, 0.5), zoomDateTab.hlRows[0]().opacity(1, 0.4))),
    // r5 P2-5：把“分开算”演出来——节假日、平时两组销售额（示意）各归一摞
    at('分开算', all(normalTag().opacity(1, 0.5), holCard().opacity(1, 0.5), normCard().opacity(1, 0.5))),
    at('节假日的销售额', chain(holCard().scale(1.05, 0.5), holCard().scale(1.0, 0.5))),
    at('平时的销售额', chain(normCard().scale(1.05, 0.5), normCard().scale(1.0, 0.5))),
  );
});
