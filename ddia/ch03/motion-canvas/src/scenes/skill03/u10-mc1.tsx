// U10 场景 1（MC）：j0–j11b —— j0 单元站牌（UnitTitle：第 10 站），j1 钩子、一笔销售的四个问题、星型模式引言、事实表居中、
// 八列（j4）、第 1/2 行（j5/j6）、第 3/4 行 + 独立示例（j7）、一种产品一行（j8/j9）、
// 按单个事件记的灵活（j10）、几十 PB 的事实表（j11）、示意量级 tally（j11b）。
// r6：新增首拍 j0 站牌，j1 开头收成左上角页眉；旧 header 已删，改由 unit.header 承担。
// 分镜：skill-ch03/beats-u10.md（r3）；原文：DDIA §3.9（书页 p93–94，PDF p115–116）。
// 事实表按清单 3.9-3补重画：4 行数值逐格核对过原图图片（PDF p116）。
// r3：j4 给日期含义（140102 = 2014-01-02）、j5 点名 NULL 与折扣价含义、j9 明说重复列照写三遍、
// 新增 j11b 示意量级 tally（画面标“示意”，算术自洽，不当书里数字）。
// 分镜：skill-ch03/beats-u10.md（r2）；原文：DDIA §3.9（书页 p93–94，PDF p115–116）。
// 事实表按清单 3.9-3补重画：4 行数值逐格核对过原图图片（PDF p116）。
// 时长全部来自 timeline/u10.json（beat() 驱动），不手写 waitFor。
import {Circle, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, chain, createRef} from '@motion-canvas/core';
import {at, makeBeats} from '../../lib/beats';
import {UnitTitle} from '../../lib/opening';
import {CHAPTER} from '../../lib/chapter';
import {FONT, SAFE, SIZE, T} from '../../lib/theme';
import {KV} from '../../lib/schemas';
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

export default makeScene2D(function* (view) {
  view.fill(T.bg);
  const beat = makeBeats(timeline);

  // 单元站牌（j0）：这一站在全章的位置 + 单元标题；j1 开头收成左上角页眉。
  // 页眉与场景原有的左上角标题同一位置同一样式，旧 header 已删，改由 unit.header 承担。
  const unit = new UnitTitle(CHAPTER, 'u10');

  const anchor = createRef<Txt>();
  const say = (text: string) => anchor().text(text);

  // j1：钩子
  const g1 = createRef<Node>();
  const receipt = createRef<Rect>();
  const fishChip = createRef<Rect>();
  const qChips = [0, 1, 2, 3].map(() => createRef<Rect>());

  // j2：对照
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

  // j8/j9：一种产品一行（示意卡，不写事实表行号——修 r1 P2-1）
  // 两张示例卡是有身份的数据块：从事实表下方滑出、落位
  const kvA = new KV('比如：鱼食记一行', '', 'key', {w: 480, tone: T.blue});
  const kvB = new KV('比如：牛角包再记一行', '', 'key', {w: 480, tone: T.blue});
  const twoLab = createRef<Txt>();
  const repeatLab = createRef<Txt>();

  // j10：切面
  const g10 = createRef<Node>();
  const rowCard = createRef<Rect>();
  const slices = [0, 1, 2].map(() => createRef<Rect>());

  // j11：几十 PB
  const g11 = createRef<Node>();
  const tallBar = createRef<Rect>();
  const tallLab = createRef<Txt>();
  const pbBig = createRef<Txt>();
  const companies = createRef<Txt>();
  const pbSub = createRef<Txt>();

  // j11b：示意量级 tally（r3 新增；“就算”打比方、画面标“示意”，算术自洽）
  const g11b = createRef<Node>();
  const tally1 = createRef<Txt>();
  const tally2 = createRef<Txt>();
  const tally3 = createRef<Txt>();
  // r4：第四行——一百字节是按八列窄行打的比方（修 r3 新手测试 P2-10，与一百多列的张力）
  const tally4 = createRef<Txt>();
  // r4：j4 日期格式拆解芯片（修定格 error：格式句整段无可见大动作，7.33s）
  const chip14 = createRef<Rect>();
  const chip01 = createRef<Rect>();
  const chip02 = createRef<Rect>();
  // r5 小摩擦（j1→第 1 行）：j5 加小标，点明第 1 行就是开头收银台那一笔
  const sameRowNote = createRef<Txt>();

  view.add(
    <>
      {unit.nodes()}
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

      {/* j1：收银台钩子 */}
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

      {/* j2：杂乱业务表 vs 规整星型 */}
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

      {/* 事实表（j3 先出表头，j5–j7 再逐行填入） */}
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
      {/* j7 徽章：修 r1 P2-4，徽章上移、副文拉开间距，不再紧贴框沿 */}
      <Rect ref={badge} position={[400, -160]} width={240} height={64} radius={12} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
        <Txt fontSize={SIZE.body} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'独立示例'} />
      </Rect>
      <Txt ref={badgeSub} position={[440, -100]} fontSize={18} fill={T.green} fontFamily={FONT.sans} text={'和另外的示例表不是一批数据'} opacity={0} />
      {/* j4（r4）：日期格式拆解芯片，随“14/01/02”逐个出现；j5 开头收起 */}
      {[
        {ref: chip14, x: -320, t: '14 = 2014 年'},
        {ref: chip01, x: 0, t: '01 = 1 月'},
        {ref: chip02, x: 320, t: '02 = 2 日'},
      ].map(({ref, x, t}) => (
        <Rect key={`dc-${t}`} ref={ref} position={[x, 150]} width={280} height={60} radius={12} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={t} />
        </Rect>
      ))}
      <Txt ref={twoLab} position={[0, 80]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'一次买几种产品'} opacity={0} />
      <Txt ref={sameRowNote} position={[0, 200]} fontSize={18} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'这就是开头收银台那一笔'} opacity={0} />
      <Txt ref={repeatLab} position={[0, 235]} fontSize={SIZE.label} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'日期、商店、顾客，照写三遍'} opacity={0} />
      {kvA.node}
      {kvB.node}

      {/* j10：按单个事件记 */}
      <Node ref={g10} opacity={0}>
        <Rect ref={rowCard} position={[0, -100]} width={700} height={80} radius={14} fill={T.card} stroke={T.blue} lineWidth={2}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'一行事实：一位顾客买了鱼食'} />
        </Rect>
        {['按产品切', '按商店切', '按日期切'].map((t, i) => (
          <Rect
            key={`slice-${i}`}
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

      {/* j11：几十 PB */}
      <Node ref={g11} opacity={0}>
        <Rect ref={tallBar} position={[-320, 20]} width={120} height={60} radius={12} fill={T.card} stroke={T.blue} lineWidth={2} />
        <Txt ref={tallLab} position={[-320, 170]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'事实表'} opacity={0} />
        <Txt ref={pbBig} position={[200, -60]} fontSize={64} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'几十 PB'} opacity={0} />
        <Txt ref={companies} position={[200, 40]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'苹果 · 沃尔玛 · 易贝'} opacity={0} />
        <Txt ref={pbSub} position={[200, 100]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'交易历史，大多在事实表里'} opacity={0} />
      </Node>
      {/* j11b：示意量级 tally（r3 新增） */}
      <Node ref={g11b} opacity={0}>
        <Txt position={[0, -170]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'示意 · 量级算账'} />
        <Txt ref={tally1} position={[0, -70]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'一天一百亿行 × 一行一百字节 = 一 TB/天'} opacity={0} />
        <Txt ref={tally2} position={[0, 10]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'攒十年，约三点六 PB'} opacity={0} />
        <Txt ref={tally3} position={[0, 90]} fontSize={SIZE.body} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'行再宽十倍 → 几十 PB'} opacity={0} />
        <Txt ref={tally4} position={[0, 170]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'一百字节，是按八列窄行打的比方'} opacity={0} />
      </Node>
    </>
  );

  // j0：单元站牌（演示拍，念完留 0.8s）
  yield* beat('j0', unit.enter());

  say('一笔销售，怎么摆？');
  yield* beat('j1',
    unit.toHeader(),
    all(g1().opacity(1, 0.5)),
    at('买了一包鱼食', chain(fishChip().opacity(1, 0.5), fishChip().position([380, -110], 1.2), fishChip().position([380, -90], 0.8))),
    at('涉及谁', chain(qChips[0]().opacity(1, 0.4), qChips[1]().opacity(1, 0.4), qChips[2]().opacity(1, 0.4), qChips[3]().opacity(1, 0.4))),
    at('该怎么摆', g1().scale(1.02, 2.0)),
  );

  say('分析这边，样子固定');
  yield* beat('j2',
    all(g1().opacity(0, 0.5), g2().opacity(1, 0.5)),
    at('五花八门', chain(messy[0]().opacity(1, 0.4), messy[1]().opacity(1, 0.4), messy[2]().opacity(1, 0.4))),
    at('样子就固定', all(starOutline().opacity(1, 0.6), starLab().opacity(1, 0.4))),
    at('星型模式', starCenter().fill(T.yellow, 0.6)),
  );

  say('事实表在中间');
  yield* beat('j3',
    chain(g2().opacity(0, 0.4), factWrap().opacity(1, 0.5)),
    at('事实表', factTitle().opacity(1, 0.5)),
    at('每一行', fact.root().scale(1.015, 2.5)),
    at('换成网站流量', webCard().opacity(1, 0.5)),
    at('一次点击', webCard().stroke(T.green, 0.5)),
  );

  say('八列');
  yield* beat('j4',
    all(webCard().opacity(0, 0.4)),
    at('日期', fact.headTxt[0]().fill(T.yellow, 0.4)),
    at('产品', fact.headTxt[1]().fill(T.yellow, 0.4)),
    at('商店', fact.headTxt[2]().fill(T.yellow, 0.4)),
    at('促销', fact.headTxt[3]().fill(T.yellow, 0.4)),
    at('顾客', fact.headTxt[4]().fill(T.yellow, 0.4)),
    at('数量、净价和折扣价', chain(fact.headTxt[5]().fill(T.yellow, 0.4), fact.headTxt[6]().fill(T.yellow, 0.4), fact.headTxt[7]().fill(T.yellow, 0.4))),
    // r3 定格修：j4 旁白加了日期含义句后长到 14.1s，日期句整段无可见动作、最长定格 9.03s（>6s）。
    // 日期句里补两处可见动作：句首把日期列框淡入（1.5s）并描绿（1.5s），句尾把日期表头变绿，
    // 把定格切成三段、每段 <3s。注意 hlCols[0] 之前只有描边、透明度是 0，描边本身看不见。
    at('日期写成 140102', chain(fact.hlCols[0]().opacity(1, 1.5), fact.hlCols[0]().stroke(T.green, 1.5))),
    // r4：格式句（年取后两位、月和日各取两位）整段只有表头变色小动作，定格 7.33s（>6s）。
    // 补三张拆解芯片随“14/01/02”逐个出现（大元素淡入，定格可检出），表头变绿保留。
    at('14 就是 2014 年', chip14().opacity(1, 0.4)),
    at('01 是 1 月', chip01().opacity(1, 0.4)),
    at('02 是 2 日', chip02().opacity(1, 0.4)),
    at('02 是 2 日', fact.headTxt[0]().fill(T.green, 0.4)),
  );

  say('一行，就是一件事');
  yield* beat('j5',
    // r4：收起 j4 的日期拆解芯片
    all(chip14().opacity(0, 0.4), chip01().opacity(0, 0.4), chip02().opacity(0, 0.4)),
    // r5 小摩擦：点明第 1 行就是 j1 收银台那一笔
    at('第一行亮起', chain(fact.rows[0]().opacity(1, 0.4), fact.hlRows[0]().opacity(1, 0.4), sameRowNote().opacity(1, 0.4))),
    at('产品编号 31', fact.hlCols[1]().opacity(1, 0.4)),
    at('商店编号 3', fact.hlCols[2]().opacity(1, 0.4)),
    at('买了 1 件', fact.hlCols[5]().opacity(1, 0.4)),
    at('净价 2.49', fact.hlCols[6]().opacity(1, 0.4)),
    at('这两列是空的', all(fact.hlCols[3]().opacity(1, 0.4), fact.hlCols[4]().opacity(1, 0.4))),
    at('折扣价也是 2.49', fact.hlCols[7]().opacity(1, 0.4)),
    at('没打折', fact.root().scale(1.01, 1.0)),
  );

  say('第二行：买了 3 件');
  yield* beat('j6',
    // r4：j5 已亮了数量、净价、折扣价三列框，j6 同名 cue 是空操作导致定格 7.70s（>6s）。
    // 拍首先清除三列框（与 j7 开头清除全部列高亮的做法一致），让三处 cue 重新亮起成为可见变化。
    // r5：同时收起 j5 的“收银台那一笔”小标
    all(fact.hlCols[3]().opacity(0, 0.4), fact.hlCols[4]().opacity(0, 0.4), fact.hlCols[5]().opacity(0, 0.4), fact.hlCols[6]().opacity(0, 0.4), fact.hlCols[7]().opacity(0, 0.4), sameRowNote().opacity(0, 0.4)),
    at('第二行', chain(fact.rows[1]().opacity(1, 0.4), fact.hlRows[1]().opacity(1, 0.4))),
    at('买了 3 件', fact.hlCols[5]().opacity(1, 0.4)),
    at('净价 14.99', fact.hlCols[6]().opacity(1, 0.4)),
    at('折扣价 9.99', fact.hlCols[7]().opacity(1, 0.4)),
    at('有促销编号 19', fact.hlCols[3]().opacity(1, 0.4)),
    at('折扣价比净价低', fact.hlCols[7]().stroke(T.green, 0.4)),
  );

  say('四行，独立示例');
  yield* beat('j7',
    all(fact.hlCols[1]().opacity(0, 0.4), fact.hlCols[2]().opacity(0, 0.4), fact.hlCols[3]().opacity(0, 0.4), fact.hlCols[4]().opacity(0, 0.4), fact.hlCols[5]().opacity(0, 0.4), fact.hlCols[6]().opacity(0, 0.4), fact.hlCols[7]().opacity(0, 0.4), fact.hlRows[0]().opacity(0, 0.4), fact.hlRows[1]().opacity(0, 0.4)),
    at('第三、第四行', chain(fact.rows[2]().opacity(1, 0.4), fact.rows[3]().opacity(1, 0.4))),
    at('日期全是同一天', fact.hlCols[0]().opacity(1, 0.5)),
    at('拿来举例', all(badge().opacity(1, 0.5), badgeSub().opacity(1, 0.5))),
    at('拼成同一批', chain(factOutline().opacity(1, 0.5), factOutline().opacity(0, 1.5))),
    at('顺带看一眼', fact.root().scale(1.01, 1.0)),
    at('没促销的两行', fact.hlRows[3]().opacity(1, 0.4)),
    // r4：j7 尾部定格 5.53s 接近 6s 阈值——尾句的 1% 缩放是空操作（j5 已把 fact.root 缩放到 1.01），
    // 行框细描边淡入也检不出。尾句时把“独立示例”徽章淡出（大元素消失，定格可检出；
    // j8 开头本就收徽章，这里只是提前约 2s 收起）。
    at('这只是这四行看起来的样子', chain(badge().opacity(0, 0.5), badgeSub().opacity(0, 0.5))),
  );

  say('一种产品，一行');
  yield* beat('j8',
    all(badge().opacity(0, 0.4), badgeSub().opacity(0, 0.4), fact.hlCols[0]().opacity(0, 0.4)),
    at('几种不同的产品', twoLab().opacity(1, 0.5)),
    at('好几行', all(
      chain(kvA.appear([-280, 110], 0.3), kvA.moveTo([-280, 170], 0.8)),
      chain(kvB.appear([280, 110], 0.3), kvB.moveTo([280, 170], 0.8)),
    )),
  );

  say('比如：鱼食／牛角包');
  yield* beat('j9',
    at('一种产品一行', chain(fact.hlRows[0]().opacity(1, 0.3), fact.hlRows[1]().opacity(1, 0.3))),
    at('鱼食', kvA.flash(T.yellow)),
    at('牛角包', kvB.flash(T.yellow)),
    at('照写三遍', repeatLab().opacity(1, 0.5)),
  );

  say('按单个事件记');
  yield* beat('j10',
    chain(all(kvA.hide(0.4), kvB.hide(0.4), twoLab().opacity(0, 0.4), repeatLab().opacity(0, 0.4), factWrap().opacity(0, 0.4), factTitle().opacity(0, 0.4)), g10().opacity(1, 0.5)),
    at('单个事件', rowCard().stroke(T.yellow, 0.5)),
    at('最灵活', chain(slices[0]().opacity(1, 0.4), slices[1]().opacity(1, 0.4), slices[2]().opacity(1, 0.4))),
    at('想怎么切', rowCard().stroke(T.green, 0.6)),
  );

  say('几十 PB，大多在事实表里');
  yield* beat('j11',
    chain(g10().opacity(0, 0.4), g11().opacity(1, 0.5)),
    at('变得极大', chain(tallBar().height(240, 3.0), tallLab().opacity(1, 0.5))),
    at('苹果', companies().opacity(1, 0.5)),
    at('几十 PB', pbBig().opacity(1, 0.5)),
    at('大多都在事实表里', pbSub().opacity(1, 0.5)),
  );

  say('示意 · 量级算账');
  yield* beat('j11b',
    chain(g11().opacity(0, 0.4), g11b().opacity(1, 0.5)),
    // r4：整拍 3% 慢放检不出（每帧变化率低于 freezedetect 噪声阈值），尾部定格仍有 5.50s。
    // 改按算式分段点亮：tally 行随数字说到才出现、说到数字时变黄强调，每段旁白都有大面积文字变化。
    at('打个比方', tally1().opacity(1, 0.5)),
    at('就算一天记一百亿行', tally1().fill(T.yellow, 0.4)),
    at('一行一百个字节', tally1().fill(T.text, 0.4)),
    at('攒十年', tally2().opacity(1, 0.5)),
    at('三点六 PB', tally2().fill(T.yellow, 0.4)),
    at('行再宽十倍', tally3().opacity(1, 0.5)),
    at('就这么攒出来了', g11b().scale(1.02, 1.0)),
    at('还有一句', tally4().opacity(1, 0.5)),
    at('按这张八列的窄行', tally4().fill(T.yellow, 0.4)),
    // r4 补：尾句“列多了，一行只会更宽，攒得更快”约 5.7s 无动作，QA idle 5.97s（≥6s 即 error）。
    // '列多了'处再推 1%（1.02→1.03，避免与上一个缩放同值成空操作），'攒得更快'处 tally4 变回白字收尾，
    // 最后一根线程在 23.5s 结束，idle 降到约 0.9s。
    // r5 P2-C：收尾强调样式统一——tally2、tally3 也变回白字，四行全白收尾。
    at('列多了', g11b().scale(1.03, 1.0)),
    at('攒得更快', all(tally4().fill(T.text, 0.4), tally2().fill(T.text, 0.4), tally3().fill(T.text, 0.4))),
  );
});
