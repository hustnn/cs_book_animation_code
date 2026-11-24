// U10 场景 2（MC）：b10–b19 —— 星型生长（五张维度表逐张长出、外键箭头逐根亮起）、
// 产品维度放大、一种产品一行、日期维度放大（节假日）、星星的光芒。
// 分镜：skill-ch03/beats-u10.md；原文：DDIA §3.9（书页 p94–95，PDF p116–117）。
// 五张维度表与外键箭头按原图图片重画：行内容、箭头落点（31→鱼食、3→帕洛阿尔托、
// 140102→1 月 2 日、191→鲍勃、19→水族促销）逐格核对过；箭头走表外空隙，不穿文字。
// 时长全部来自 timeline/u10.json（beat() 驱动），不手写 waitFor。
import {Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, chain, createRef} from '@motion-canvas/core';
import {at, makeBeats} from '../../lib/beats';
import {FONT, SAFE, SIZE, T} from '../../lib/theme';
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

  // b16：产品维度放大
  const zoomProd = createRef<Node>();
  const zoomProdTab = makeTableRefs(3, 5, createRef);
  const zoomProdTitle = createRef<Txt>();
  const extraTags = [0, 1].map(() => createRef<Rect>());

  // b17：一种产品一行
  const twoRows = createRef<Node>();
  const twoCards = [0, 1].map(() => createRef<Rect>());
  const twoLab = createRef<Txt>();

  // b18：日期维度放大
  const zoomDate = createRef<Node>();
  const zoomDateTab = makeTableRefs(3, 6, createRef);
  const zoomDateTitle = createRef<Txt>();
  const holTag = createRef<Txt>();
  const normalTag = createRef<Txt>();

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

      {/* b16：产品维度放大 */}
      <Node ref={zoomProd} opacity={0}>
        <Txt ref={zoomProdTitle} position={[0, -258]} fontSize={SIZE.label} fontWeight={700} fill={T.text} fontFamily={FONT.mono} text={'dim_product · 产品维度表'} />
        {DataTable({
          key: 'zprod', x0: -260, y0: -220, cols: [90, 80, 110, 90, 95], heads: PROD_HEADS, rows: PROD_ROWS,
          headH: 34, rowH: 36, headSize: 14, cellSize: 18, sansCols: [2, 3, 4], refs: zoomProdTab,
        })}
        {['＋ 脂肪含量', '＋ 包装尺寸'].map((t, i) => (
          <Rect
            key={`ex-${i}`}
            ref={extraTags[i]}
            position={[-180 + i * 360, 60]}
            width={300}
            height={64}
            radius={12}
            fill={T.card}
            stroke={T.purple}
            lineWidth={2}
            opacity={0}
          >
            <Txt fontSize={SIZE.label} fontWeight={700} fill={T.purple} fontFamily={FONT.sans} text={t} />
          </Rect>
        ))}
      </Node>

      {/* b17：一种产品一行 */}
      <Node ref={twoRows} opacity={0}>
        <Txt ref={twoLab} position={[0, 80]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'同一位顾客，一次买了两种产品'} opacity={0} />
        {[0, 1].map(i => (
          <Rect
            key={`tw-${i}`}
            ref={twoCards[i]}
            position={[-280 + i * 560, 150]}
            width={480}
            height={80}
            radius={14}
            fill={T.card}
            stroke={T.blue}
            lineWidth={2}
            opacity={0}
          >
            <Txt fontSize={SIZE.label} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={['第 1 行：买了鱼食', '第 2 行：又买了牛角包'][i]} />
          </Rect>
        ))}
      </Node>

      {/* b18：日期维度放大 */}
      <Node ref={zoomDate} opacity={0}>
        <Txt ref={zoomDateTitle} position={[0, -240]} fontSize={SIZE.label} fontWeight={700} fill={T.text} fontFamily={FONT.mono} text={'dim_date · 日期维度表'} />
        {DataTable({
          key: 'zdate', x0: -330, y0: -200, cols: [90, 60, 70, 50, 80, 90], heads: DATE_HEADS, rows: DATE_ROWS,
          headH: 34, rowH: 36, headSize: 14, cellSize: 18, refs: zoomDateTab,
        })}
        <Txt ref={holTag} position={[340, -147]} fontSize={SIZE.body} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'节假日'} opacity={0} />
        <Txt ref={normalTag} position={[340, -93]} fontSize={SIZE.body} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'平时'} opacity={0} />
      </Node>
    </>
  );

  say('产品表长出来了');
  yield* beat('b10',
    all(prodWrap().opacity(1, 0.5)),
    at('先看产品', prod.hlRows[1]().opacity(0.35, 0.5)),
    at('产品编号 31', all(fact.hlCols[1]().opacity(1, 0.4), aProd().opacity(1, 0.6))),
    at('鱼食', prod.hlRows[1]().opacity(1, 0.4)),
  );

  say('商店表长出来了');
  yield* beat('b11',
    all(storeWrap().opacity(1, 0.5)),
    at('再看商店', store.hlRows[2]().opacity(0.35, 0.5)),
    at('商店编号 3', all(fact.hlCols[2]().opacity(1, 0.4), aStore().opacity(1, 0.6))),
    at('帕洛阿尔托', store.hlRows[2]().opacity(1, 0.4)),
  );

  say('日期表长出来了');
  yield* beat('b12',
    all(dateWrap().opacity(1, 0.5)),
    at('日期也一样', date.hlRows[1]().opacity(0.35, 0.5)),
    at('2014 年 1 月 2 日', all(fact.hlCols[0]().opacity(1, 0.4), aDate().opacity(1, 0.6))),
    at('星期四', date.hlRows[1]().opacity(1, 0.4)),
    at('不是节假日', date.hlRows[1]().stroke(T.green, 0.4)),
  );

  say('顾客表长出来了');
  yield* beat('b13',
    all(custWrap().opacity(1, 0.5)),
    at('顾客编号 191', all(fact.hlCols[4]().opacity(1, 0.4), aCust().opacity(1, 0.6))),
    at('鲍勃', cust.hlRows[1]().opacity(1, 0.4)),
  );

  say('促销表长出来了');
  yield* beat('b14',
    all(promoWrap().opacity(1, 0.5)),
    at('促销编号 19', all(fact.hlCols[3]().opacity(1, 0.4), aPromo().opacity(1, 0.6))),
    at('水族促销', promo.hlRows[1]().opacity(1, 0.4)),
  );

  say('事实在中间，五维围一圈');
  yield* beat('b15',
    at('五张维度表', chain(aProd().stroke(T.yellow, 0.4), aStore().stroke(T.yellow, 0.4), aDate().stroke(T.yellow, 0.4), aCust().stroke(T.yellow, 0.4), aPromo().stroke(T.yellow, 0.4))),
    at('星型模式', starWrap().scale(1.02, 2.5)),
  );

  say('一行，一种产品');
  yield* beat('b16a',
    chain(starWrap().opacity(0, 0.4), zoomProd().opacity(1, 0.5)),
    at('货号', zoomProdTab.headTxt[1]().fill(T.yellow, 0.4)),
    at('描述', zoomProdTab.headTxt[2]().fill(T.yellow, 0.4)),
    at('品牌', zoomProdTab.headTxt[3]().fill(T.yellow, 0.4)),
    at('类别', zoomProdTab.headTxt[4]().fill(T.yellow, 0.4)),
  );

  say('脂肪含量、包装尺寸');
  yield* beat('b16b',
    at('脂肪含量', extraTags[0]().opacity(1, 0.5)),
    at('包装尺寸', extraTags[1]().opacity(1, 0.5)),
  );

  say('一种产品，一行');
  yield* beat('b17',
    chain(zoomProd().opacity(0, 0.4), all(starWrap().opacity(1, 0.5), prodWrap().opacity(0, 0.4), storeWrap().opacity(0, 0.4), dateWrap().opacity(0, 0.4), custWrap().opacity(0, 0.4), promoWrap().opacity(0, 0.4), aProd().opacity(0, 0.4), aStore().opacity(0, 0.4), aDate().opacity(0, 0.4), aCust().opacity(0, 0.4), aPromo().opacity(0, 0.4), fact.hlCols[0]().opacity(0, 0.4), fact.hlCols[1]().opacity(0, 0.4), fact.hlCols[2]().opacity(0, 0.4), fact.hlCols[3]().opacity(0, 0.4), fact.hlCols[4]().opacity(0, 0.4), twoRows().opacity(1, 0.5))),
    at('几种不同的产品', twoLab().opacity(1, 0.5)),
    at('好几行', chain(twoCards[0]().opacity(1, 0.5), twoCards[1]().opacity(1, 0.5))),
    at('一种产品一行', chain(fact.hlRows[0]().opacity(1, 0.4), fact.hlRows[1]().opacity(1, 0.4))),
  );

  say('节假日，分开算');
  yield* beat('b18',
    chain(all(twoRows().opacity(0, 0.4), starWrap().opacity(0, 0.4)), zoomDate().opacity(1, 0.5)),
    at('多带一份信息', zoomDateTab.hlCols[5]().opacity(1, 0.5)),
    at('公共节假日', all(holTag().opacity(1, 0.5), zoomDateTab.hlRows[0]().opacity(1, 0.4))),
    at('分开算', normalTag().opacity(1, 0.5)),
  );

  say('连线像星星的光芒');
  yield* beat('b19',
    chain(zoomDate().opacity(0, 0.4), all(starWrap().opacity(1, 0.5), prodWrap().opacity(1, 0.5), storeWrap().opacity(1, 0.5), dateWrap().opacity(1, 0.5), custWrap().opacity(1, 0.5), promoWrap().opacity(1, 0.5), aProd().opacity(1, 0.5), aStore().opacity(1, 0.5), aDate().opacity(1, 0.5), aCust().opacity(1, 0.5), aPromo().opacity(1, 0.5))),
    at('被维度表包围', chain(aProd().stroke(T.yellow, 0.5), aStore().stroke(T.yellow, 0.5), aDate().stroke(T.yellow, 0.5), aCust().stroke(T.yellow, 0.5), aPromo().stroke(T.yellow, 0.5))),
    at('星星的光芒', starWrap().scale(1.02, 3.0)),
  );
});
