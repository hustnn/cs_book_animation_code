// U10 场景 1（MC）：b1–b9 —— 钩子、一笔销售的四个问题、星型模式引言、事实表居中、
// 八列四行（按原图数值）、独立示例说明、属性列 vs 外键列、六个问题。
// 分镜：skill-ch03/beats-u10.md；原文：DDIA §3.9（书页 p93–94，PDF p115–116）。
// 事实表按清单 3.9-3补重画：4 行数值逐格核对过原图图片。
// 时长全部来自 timeline/u10.json（beat() 驱动），不手写 waitFor。
import {Circle, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, chain, createRef} from '@motion-canvas/core';
import {at, makeBeats} from '../../lib/beats';
import {FONT, SAFE, SIZE, T} from '../../lib/theme';
import timeline from '../../timeline/u10.json';
import {DataTable, makeTableRefs} from '../../components/starTable';

const FACT_HEADS = ['date_key', 'product_sk', 'store_sk', 'promotion_sk', 'customer_sk', 'quantity', 'net_price', 'discount_price'];
const FACT_COLS = [70, 70, 60, 92, 84, 52, 64, 110];
const FACT_ROWS = [
  ['140102', '31', '3', 'NULL', 'NULL', '1', '2.49', '2.49'],
  ['140102', '69', '5', '19', 'NULL', '3', '14.99', '9.99'],
  ['140102', '74', '3', '23', '191', '1', '4.49', '3.89'],
  ['140102', '33', '8', 'NULL', '235', '4', '0.99', '0.99'],
];
const Q_LABELS = ['谁买的', '买了什么', '在哪买', '什么时候', '怎么买', '为什么买'];
const Q_X = [-425, -255, -85, 85, 255, 425];

export default makeScene2D(function* (view) {
  view.fill(T.bg);
  const beat = makeBeats(timeline);

  const header = createRef<Txt>();
  const anchor = createRef<Txt>();
  const say = (text: string) => anchor().text(text);

  // b1：钩子
  const g1 = createRef<Node>();
  const receipt = createRef<Rect>();
  const fishChip = createRef<Rect>();
  const qChips = [0, 1, 2, 3].map(() => createRef<Rect>());

  // b2：对照
  const g2 = createRef<Node>();
  const messy = [0, 1, 2].map(() => createRef<Rect>());
  const starOutline = createRef<Node>();
  const starCenter = createRef<Circle>();
  const starLab = createRef<Txt>();

  // 事实表
  const fact = makeTableRefs(4, 8, createRef);
  const factWrap = createRef<Node>();
  const factTitle = createRef<Txt>();
  const factOutline = createRef<Rect>();
  const webCard = createRef<Rect>();
  const badge = createRef<Rect>();
  const badgeSub = createRef<Txt>();
  const dimLab = createRef<Txt>();
  const bizCard = createRef<Rect>();

  // b8/b9：六个问题牌
  const qRow = createRef<Node>();
  const qCards = [0, 1, 2, 3, 4, 5].map(() => createRef<Rect>());
  const qMarks = [0, 1, 2, 3, 4, 5].map(() => createRef<Txt>());
  const qLabs = [0, 1, 2, 3, 4, 5].map(() => createRef<Txt>());

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

      {/* b1：收银台钩子 */}
      <Node ref={g1} opacity={0}>
        <Rect ref={receipt} position={[0, -90]} width={560} height={110} radius={16} fill={T.card} stroke={T.line} lineWidth={2}>
          <Txt position={[0, -22]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'收银台'} />
          <Txt position={[0, 22]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'一位顾客，买了一包鱼食'} />
        </Rect>
        <Rect ref={fishChip} position={[380, -90]} width={180} height={64} radius={12} fill={T.card} stroke={T.yellow} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'鱼食 × 1'} />
        </Rect>
        {['谁？', '什么？', '何处？', '何时？'].map((t, i) => (
          <Rect
            key={`q-${i}`}
            ref={qChips[i]}
            position={[-420 + i * 280, 90]}
            width={240}
            height={64}
            radius={12}
            fill={T.card}
            stroke={T.blue}
            lineWidth={2}
            opacity={0}
          >
            <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={t} />
          </Rect>
        ))}
      </Node>

      {/* b2：杂乱业务表 vs 规整星型 */}
      <Node ref={g2} opacity={0}>
        {['订单表', '库存表', '顾客表'].map((t, i) => (
          <Rect
            key={`m-${i}`}
            ref={messy[i]}
            position={[-380, -170 + i * 130]}
            width={300}
            height={100}
            radius={14}
            fill={T.card}
            stroke={T.line}
            lineWidth={2}
            opacity={0}
          >
            <Txt fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={t} />
          </Rect>
        ))}
        <Txt position={[-380, 190]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'做交易的系统：五花八门'} />
        <Node ref={starOutline} opacity={0}>
          <Circle ref={starCenter} position={[330, -40]} width={90} height={90} fill={T.card} stroke={T.yellow} lineWidth={3} />
          <Txt position={[330, -40]} fontSize={SIZE.label} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'事实'} />
          {[
            [330, -190], [470, -90], [420, 80], [240, 80], [190, -90],
          ].map(([x, y], i) => (
            <Circle key={`s-${i}`} position={[x, y]} width={44} height={44} fill={T.card} stroke={T.blue} lineWidth={2} />
          ))}
          {[
            [[330, -85], [330, -168]], [[372, -62], [448, -80]], [[368, -8], [402, 58]],
            [[292, -8], [258, 58]], [[288, -62], [212, -80]],
          ].map(([a, b], i) => (
            <Line key={`sl-${i}`} points={[a as [number, number], b as [number, number]]} stroke={T.yellow} lineWidth={2} />
          ))}
        </Node>
        <Txt ref={starLab} position={[330, 190]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'分析这边：同一种套路'} opacity={0} />
      </Node>

      {/* 事实表（b3 先出表头，b5 再填四行） */}
      <Node ref={factWrap} opacity={0}>
        {DataTable({
          key: 'fact', x0: -305, y0: -110, cols: FACT_COLS, heads: FACT_HEADS, rows: FACT_ROWS,
          headH: 30, rowH: 32, headSize: 12, cellSize: 16, hideRows: true, refs: fact,
        })}
      </Node>
      <Txt ref={factTitle} position={[0, -152]} fontSize={SIZE.label} fontWeight={700} fill={T.text} fontFamily={FONT.mono} text={'fact_sales · 事实表'} opacity={0} />
      <Rect ref={factOutline} position={[-4, -31]} width={610} height={166} radius={10} stroke={T.yellow} lineWidth={3} opacity={0} />
      <Rect ref={webCard} position={[0, 150]} width={640} height={90} radius={14} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
        <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'网站流量：一行就是一次浏览，或者一次点击'} />
      </Rect>
      <Rect ref={badge} position={[425, -140]} width={240} height={64} radius={12} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
        <Txt fontSize={SIZE.body} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'独立示例'} />
      </Rect>
      <Txt ref={badgeSub} position={[425, -92]} fontSize={18} fill={T.green} fontFamily={FONT.sans} text={'和另外的示例表不是一批数据'} opacity={0} />
      <Txt ref={dimLab} position={[0, 210]} fontSize={SIZE.label} fontWeight={700} fill={T.blue} fontFamily={FONT.sans} text={'外键 → 维度表'} opacity={0} />
      <Rect ref={bizCard} position={[0, 150]} width={640} height={90} radius={14} fill={T.card} stroke={T.red} lineWidth={2} opacity={0}>
        <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'业务表：原样搬过来？'} />
      </Rect>

      {/* b8/b9：六个问题牌 */}
      <Node ref={qRow} opacity={0}>
        {[0, 1, 2, 3, 4, 5].map(i => (
          <Rect
            key={`qc-${i}`}
            ref={qCards[i]}
            position={[Q_X[i], 150]}
            width={160}
            height={60}
            radius={12}
            fill={T.card}
            stroke={T.blue}
            lineWidth={2}
          >
            <Txt ref={qMarks[i]} fontSize={SIZE.body} fontWeight={700} fill={T.muted} fontFamily={FONT.sans} text={'?'} />
            <Txt ref={qLabs[i]} fontSize={SIZE.label} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={Q_LABELS[i]} opacity={0} />
          </Rect>
        ))}
      </Node>
    </>
  );

  say('一笔销售，怎么摆？');
  yield* beat('b1',
    all(g1().opacity(1, 0.5)),
    at('买了一包鱼食', chain(fishChip().opacity(1, 0.5), fishChip().position([380, -110], 1.2), fishChip().position([380, -90], 0.8))),
    at('涉及谁', chain(qChips[0]().opacity(1, 0.4), qChips[1]().opacity(1, 0.4), qChips[2]().opacity(1, 0.4), qChips[3]().opacity(1, 0.4))),
    at('该怎么摆', g1().scale(1.02, 2.0)),
  );

  say('分析这边，样子固定');
  yield* beat('b2',
    all(g1().opacity(0, 0.5), g2().opacity(1, 0.5)),
    at('五花八门', chain(messy[0]().opacity(1, 0.4), messy[1]().opacity(1, 0.4), messy[2]().opacity(1, 0.4))),
    at('样子就固定', all(starOutline().opacity(1, 0.6), starLab().opacity(1, 0.4))),
    at('星型模式', starCenter().fill(T.yellow, 0.6)),
  );

  say('事实表在中间');
  yield* beat('b3',
    chain(g2().opacity(0, 0.4), factWrap().opacity(1, 0.5)),
    at('事实表', factTitle().opacity(1, 0.5)),
    at('每一行', fact.root().scale(1.015, 2.5)),
  );

  say('一行，就是一件事');
  yield* beat('b4',
    at('一位顾客买一件产品', fact.hlRows[0]().opacity(1, 0.5)),
    at('换成网站流量', webCard().opacity(1, 0.5)),
    at('一次点击', webCard().stroke(T.green, 0.5)),
  );

  say('八列，四行');
  yield* beat('b5',
    all(webCard().opacity(0, 0.4)),
    at('日期', fact.headTxt[0]().fill(T.yellow, 0.4)),
    at('产品', fact.headTxt[1]().fill(T.yellow, 0.4)),
    at('商店', fact.headTxt[2]().fill(T.yellow, 0.4)),
    at('促销', fact.headTxt[3]().fill(T.yellow, 0.4)),
    at('顾客', fact.headTxt[4]().fill(T.yellow, 0.4)),
    at('数量、净价和折扣价', chain(fact.headTxt[5]().fill(T.yellow, 0.4), fact.headTxt[6]().fill(T.yellow, 0.4), fact.headTxt[7]().fill(T.yellow, 0.4))),
    at('四行示例', chain(fact.rows[0]().opacity(1, 0.4), fact.rows[1]().opacity(1, 0.4), fact.rows[2]().opacity(1, 0.4), fact.rows[3]().opacity(1, 0.4))),
    at('同一天', fact.hlCols[0]().opacity(1, 0.5)),
  );

  say('四行，独立示例');
  yield* beat('b6',
    all(badge().opacity(1, 0.5), fact.hlCols[0]().opacity(0, 0.4), fact.hlRows[0]().opacity(0, 0.4)),
    at('独立示例', badgeSub().opacity(1, 0.5)),
    at('不是一批数据', chain(factOutline().opacity(1, 0.5), factOutline().opacity(0, 1.5))),
  );

  say('属性列，外键列');
  yield* beat('b7',
    all(badge().opacity(0, 0.4), badgeSub().opacity(0, 0.4)),
    at('属性', chain(fact.hlCols[5]().stroke(T.green, 0.3), fact.hlCols[5]().opacity(1, 0.4), fact.hlCols[6]().stroke(T.green, 0.3), fact.hlCols[6]().opacity(1, 0.4), fact.hlCols[7]().stroke(T.green, 0.3), fact.hlCols[7]().opacity(1, 0.4))),
    at('外键', chain(fact.hlCols[0]().stroke(T.blue, 0.3), fact.hlCols[0]().opacity(1, 0.4), fact.hlCols[1]().stroke(T.blue, 0.3), fact.hlCols[1]().opacity(1, 0.4), fact.hlCols[2]().stroke(T.blue, 0.3), fact.hlCols[2]().opacity(1, 0.4), fact.hlCols[3]().stroke(T.blue, 0.3), fact.hlCols[3]().opacity(1, 0.4), fact.hlCols[4]().stroke(T.blue, 0.3), fact.hlCols[4]().opacity(1, 0.4))),
    at('维度表', dimLab().opacity(1, 0.5)),
    at('不是把业务表原样搬过来', chain(bizCard().opacity(1, 0.5), bizCard().opacity(0, 1.0))),
  );

  say('六个问题');
  yield* beat('b8',
    all(dimLab().opacity(0, 0.4), qRow().opacity(1, 0.5), fact.hlCols[0]().opacity(0, 0.4), fact.hlCols[1]().opacity(0, 0.4), fact.hlCols[2]().opacity(0, 0.4), fact.hlCols[3]().opacity(0, 0.4), fact.hlCols[4]().opacity(0, 0.4), fact.hlCols[5]().opacity(0, 0.4), fact.hlCols[6]().opacity(0, 0.4), fact.hlCols[7]().opacity(0, 0.4)),
    at('六个问题', all(fact.hlRows[0]().opacity(1, 0.4), qRow().scale(1.02, 1.0))),
  );

  say('谁、什么、何处、何时、如何、为什么');
  yield* beat('b9',
    at('谁买的', all(chain(qMarks[0]().opacity(0, 0.2), qLabs[0]().opacity(1, 0.3)), fact.hlCols[4]().stroke(T.yellow, 0.3), fact.hlCols[4]().opacity(1, 0.4))),
    at('买了什么', all(chain(qMarks[1]().opacity(0, 0.2), qLabs[1]().opacity(1, 0.3)), fact.hlCols[1]().stroke(T.yellow, 0.3), fact.hlCols[1]().opacity(1, 0.4))),
    at('在哪买', all(chain(qMarks[2]().opacity(0, 0.2), qLabs[2]().opacity(1, 0.3)), fact.hlCols[2]().stroke(T.yellow, 0.3), fact.hlCols[2]().opacity(1, 0.4))),
    at('什么时候', all(chain(qMarks[3]().opacity(0, 0.2), qLabs[3]().opacity(1, 0.3)), fact.hlCols[0]().stroke(T.yellow, 0.3), fact.hlCols[0]().opacity(1, 0.4))),
    at('怎么买', all(chain(qMarks[4]().opacity(0, 0.2), qLabs[4]().opacity(1, 0.3)), fact.hlCols[3]().stroke(T.yellow, 0.3), fact.hlCols[3]().opacity(1, 0.4))),
    at('为什么买', all(chain(qMarks[5]().opacity(0, 0.2), qLabs[5]().opacity(1, 0.3)), fact.hlRows[0]().stroke(T.yellow, 0.3), fact.hlRows[0]().opacity(1, 0.4))),
  );
});
