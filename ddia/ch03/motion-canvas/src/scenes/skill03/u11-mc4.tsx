// U11 场景 4（MC，r6）：k25–k30 —— 只读三列、按星期几分组、Parquet 边界、
// 各列同顺序才能拼回、回扣与收尾。分镜：skill-ch03/beats-u11.md；原文：DDIA §3.10。
// 不发明分组结果数字：星期几分组只展示分组方式，不编造哪天卖得多。
// r5：k27 圆点逐天落位并说明圆点含义；k28a 文档卡拆出字段块（KV 数据块，
// 字段名“标题/作者/地址·城市”为示意）；字段块用 KV，场景不再只用框、线、文字。
// r7：k25 列卡拍首即现；k27 承诺句式改（at 短语随之改）；k28 文档框放字段内容、Parquet→Dremel 箭头 + “借鉴”；k28a“地址·城市”拆成地址/城市、四字段引线指列文件；k29 列名标注 + 左标题“顺序乱了”；k30 行卡不灰暗、列卡加“分析查询用这个”。
// r8：k27/k28 只改旁白（k27 加“每天各画一个绿点、一个紫点，是示意，不是真实分布”，
// k28“它”→“Dremel”）；at 短语与新旁白逐一核对过，全部仍命中（k27 六处、k28 七处）。
// r8 轮内补修：k27 新句处两色圆点各轻闪一次（念到“绿点”绿点闪、念到“紫点”紫点闪），
// 切断 dotNote 与 sumNote 之间 7.57s 的静止段（首版抽帧 freeze error）；mc4 只为这一处重渲。
// r6：k27 补第二行说明“哪天卖得最多，要看加总后的数量”（原书 Example 3-1 只给 SQL，
// 不给分组结果数字，不编答案）；k28 补 Dremel 半句说明，标注换成“谷歌的嵌套数据查询系统”。
// 时长全部来自 timeline/u11.json（beat() 驱动），不手写 waitFor。
import {Circle, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, chain, createRef} from '@motion-canvas/core';
import {at, makeBeats} from '../../lib/beats';
import {KV} from '../../lib/schemas';
import {FONT, SAFE, SIZE, T} from '../../lib/theme';
import timeline from '../../timeline/u11.json';

const WEEKDAYS = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
const COL_LABS = ['date_key', 'product_sk', 'quantity'];
// 分组标记：每天绿紫各一（每天两类都有），只表示“按星期分组”，不表示具体数值高低
const FRUIT_DAYS = [0, 1, 2, 3, 4, 5, 6];
const CANDY_DAYS = [0, 1, 2, 3, 4, 5, 6];

export default makeScene2D(function* (view) {
  view.fill(T.bg);
  const beat = makeBeats(timeline);

  const header = createRef<Txt>();
  const anchor = createRef<Txt>();
  const say = (text: string) => anchor().text(text);

  // ---- k25–k26：只读三列 ----
  const pOnly = createRef<Node>();
  const colCards = [0, 1, 2].map(() => createRef<Rect>());
  const greyCards = [0, 1, 2, 3, 4].map(() => createRef<Rect>());
  const queryBox = createRef<Rect>();

  // ---- k27：按星期几分组 ----
  const pGroup = createRef<Node>();
  const wdCells = WEEKDAYS.map(() => createRef<Rect>());
  const fruitDots = FRUIT_DAYS.map(() => createRef<Circle>());
  const candyDots = CANDY_DAYS.map(() => createRef<Circle>());
  const fruitLab = createRef<Txt>();
  const candyLab = createRef<Txt>();
  // r5 k27：圆点含义说明（只表示当天有这类购买，不表示卖了多少）。
  const dotNote = createRef<Txt>();
  // r6 k27：第二行说明（哪天卖得最多，要看加总后的数量；圆点图只看得出哪天有购买）。
  const sumNote = createRef<Txt>();

  // ---- k28：边界 Parquet ----
  const pBound = createRef<Node>();
  const colChip = createRef<Rect>();
  const relCard = createRef<Rect>();
  const docCard = createRef<Rect>();
  const docTitle = createRef<Txt>();
  // r7 P2-8：文档框里的文档内容（三行字段/值，不再是空框）；k28a 开始时淡出，让位给字段块。
  const docLines = ['标题：……', '作者：……', '地址·城市：……'].map(() => createRef<Txt>());
  // r5 k28a：文档卡里的字段块（KV 数据块；字段名是示意：标题/作者/地址·城市，
  // “地址·城市”表示嵌套字段里的小字段）。
  // r7 P2-9：拆成四块——“地址·城市”在“接着拆下去”处拆成地址、城市两块
  // （addrKV / cityKV，初始与第三块同位、透明）；四块各引线指向下方的列文件。
  const docFields = ['标题', '作者', '地址·城市'].map(t => new KV(t, '', 'key', {w: 120, tone: T.purple}));
  docFields[0].node.position([-140, 35]);
  docFields[1].node.position([-25, 35]);
  docFields[2].node.position([95, 35]);
  const addrKV = new KV('地址', '', 'key', {w: 80, tone: T.purple});
  addrKV.node.position([85, 35]);
  const cityKV = new KV('城市', '', 'key', {w: 80, tone: T.purple});
  cityKV.node.position([85, 35]);
  const colFileXs = [150, 265, 375, 455];
  const colFiles = [0, 1, 2, 3].map(() => createRef<Rect>());
  const colFileLabs = ['标题', '作者', '地址·城市', '城市'].map(() => createRef<Txt>());
  const colArrows = [0, 1, 2, 3].map(() => createRef<Line>());
  const arrowRel = createRef<Line>();
  const arrowDoc = createRef<Line>();
  const parquetPlate = createRef<Rect>();
  const dremelNote = createRef<Txt>();
  // r7 P2-8：Parquet 与 Dremel 之间的箭头 + “借鉴”标注。
  const pqArrow = createRef<Line>();
  const borrowLab = createRef<Txt>();

  // ---- k29：同顺序对照 ----
  const pOrder = createRef<Node>();
  const leftPanel = createRef<Rect>();
  const rightPanel = createRef<Rect>();
  const leftCells = [0, 1, 2].map(() => createRef<Rect>());
  const rightCells = [0, 1, 2].map(() => createRef<Rect>());
  // r7 P2-10：两盒数字块上方标列名（date_key / product_sk / quantity）。
  const leftLabs = COL_LABS.map(() => createRef<Txt>());
  const rightLabs = COL_LABS.map(() => createRef<Txt>());
  const cross1 = createRef<Line>();
  const cross2 = createRef<Line>();
  const leftTag = createRef<Txt>();
  const rightTag = createRef<Txt>();

  // ---- k30：收尾 ----
  const pClose = createRef<Node>();
  const rowCard = createRef<Rect>();
  const colCard = createRef<Rect>();
  // r7 P2-11：列卡旁的“分析查询用这个”标注（行卡不再变灰，靠绿框 + 本标注区分）。
  const colUseTag = createRef<Txt>();
  const nextCards = [0, 1, 2].map(() => createRef<Rect>());
  const nextArrow = createRef<Line>();
  const nextTag = createRef<Txt>();

  view.add(
    <>
      <Txt
        ref={header}
        position={[-SAFE.halfW, -SAFE.halfH]}
        offset={[-1, -1]}
        fontSize={SIZE.label}
        fill={T.muted}
        fontFamily={FONT.sans}
        text={'列式存储：按列排'}
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

      {/* 只读三列：查询框必须先声明（在卡片下层），否则卡片飞进框里会被不透明的框面盖住 */}
      <Node ref={pOnly} opacity={0}>
        <Rect ref={queryBox} position={[0, 130]} width={980} height={110} radius={16} fill={T.card} stroke={T.green} lineWidth={3} opacity={0}>
          <Txt position={[0, -75]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} text={'查询只读这三列'} />
        </Rect>
        {COL_LABS.map((lab, i) => (
          <Rect
            key={`oc-${i}`}
            ref={colCards[i]}
            position={[-330 + i * 330, -160]}
            width={300}
            height={90}
            radius={14}
            fill={T.card}
            stroke={T.yellow}
            lineWidth={3}
            opacity={0}
          >
            <Txt fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.mono} text={lab} />
          </Rect>
        ))}
        {greyCards.map((ref, i) => (
          <Rect
            key={`gc-${i}`}
            ref={ref}
            position={[-400 + i * 200, -20]}
            width={170}
            height={64}
            radius={10}
            fill={T.card}
            stroke={T.line}
            lineWidth={1}
            opacity={0}
          >
            <Txt fontSize={14} fill={T.muted} fontFamily={FONT.mono} text={['store_sk', 'promotion_sk', 'customer_sk', 'net_price', 'discount_price'][i]} />
          </Rect>
        ))}
      </Node>

      {/* 按星期几分组 */}
      <Node ref={pGroup} opacity={0}>
        {WEEKDAYS.map((d, i) => (
          <Rect
            key={`gw-${i}`}
            ref={wdCells[i]}
            position={[-450 + i * 150, -60]}
            width={130}
            height={64}
            radius={10}
            fill={T.card}
            stroke={T.line}
            lineWidth={2}
          >
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={d} />
          </Rect>
        ))}
        {FRUIT_DAYS.map((d, k) => (
          <Circle
            key={`fd-${k}`}
            ref={fruitDots[k]}
            position={[-466 + d * 150, -140]}
            width={26}
            height={26}
            fill={T.green}
            opacity={0}
          />
        ))}
        {CANDY_DAYS.map((d, k) => (
          <Circle
            key={`cd-${k}`}
            ref={candyDots[k]}
            position={[-434 + d * 150, -140]}
            width={26}
            height={26}
            fill={T.purple}
            opacity={0}
          />
        ))}
        <Txt ref={fruitLab} position={[-450, -200]} offset={[-1, 0]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} text={'● 新鲜水果'} opacity={0} />
        <Txt ref={candyLab} position={[450, -200]} offset={[1, 0]} fontSize={SIZE.label} fill={T.purple} fontFamily={FONT.sans} text={'● 糖果'} opacity={0} />
        <Txt ref={dotNote} position={[0, 80]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'圆点只表示当天有这类购买，不表示卖了多少'} opacity={0} />
        <Txt ref={sumNote} position={[0, 130]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'哪天卖得最多，要看加总后的数量'} opacity={0} />
      </Node>

      {/* 边界：Parquet */}
      <Node ref={pBound} opacity={0}>
        <Rect ref={colChip} position={[0, -250]} width={360} height={64} radius={14} fill={T.card} stroke={T.blue} lineWidth={2}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'按列存'} />
        </Rect>
        <Rect ref={relCard} position={[-290, -60]} width={420} height={180} radius={16} fill={T.card} stroke={T.blue} lineWidth={3} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'关系表'} />
        </Rect>
        <Rect ref={docCard} position={[290, -60]} width={420} height={180} radius={16} fill={T.card} stroke={T.purple} lineWidth={3} opacity={0}>
          <Txt ref={docTitle} position={[0, -55]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'文档'} />
          {docLines.map((ref, i) => (
            <Txt
              key={`dl-${i}`}
              ref={ref}
              position={[0, -15 + i * 30]}
              fontSize={17}
              fill={T.muted}
              fontFamily={FONT.sans}
              text={['标题：……', '作者：……', '地址·城市：……'][i]}
              opacity={0}
            />
          ))}
        </Rect>
        <Line ref={arrowRel} points={[[-100, -218], [-290, -150]]} stroke={T.blue} lineWidth={3} endArrow opacity={0} />
        <Line ref={arrowDoc} points={[[100, -218], [290, -150]]} stroke={T.purple} lineWidth={3} endArrow opacity={0} />
        <Rect ref={parquetPlate} position={[290, 70]} width={300} height={70} radius={12} fill={T.card} stroke={T.purple} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.purple} fontFamily={FONT.mono} text={'Parquet'} />
        </Rect>
        <Line ref={pqArrow} points={[[290, 108], [290, 128]]} stroke={T.purple} lineWidth={3} endArrow opacity={0} />
        <Txt ref={borrowLab} position={[360, 119]} fontSize={17} fill={T.purple} fontFamily={FONT.sans} text={'借鉴'} opacity={0} />
        <Txt ref={dremelNote} position={[290, 140]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'Dremel：谷歌的嵌套数据查询系统'} opacity={0} />
        {colArrows.map((ref, i) => (
          <Line
            key={`ca-${i}`}
            ref={ref}
            points={[[colFileXs[i], 10], [colFileXs[i], 185]]}
            stroke={T.green}
            lineWidth={3}
            endArrow
            opacity={0}
          />
        ))}
        {colFiles.map((ref, i) => (
          <Rect
            key={`cf-${i}`}
            ref={ref}
            position={[colFileXs[i], 215]}
            width={80}
            height={48}
            radius={8}
            fill={T.card}
            stroke={T.green}
            lineWidth={2}
            opacity={0}
          >
            <Txt ref={colFileLabs[i]} fontSize={15} fill={T.text} fontFamily={FONT.mono} text={['标题', '作者', '地址·城市', '城市'][i]} />
          </Rect>
        ))}
      </Node>

      {/* 同顺序对照 */}
      <Node ref={pOrder} opacity={0}>
        <Rect ref={leftPanel} position={[-300, -40]} width={480} height={300} radius={16} fill={T.card} stroke={T.red} lineWidth={2} opacity={0}>
          {/* r7 P2-10：左盒标题改成“顺序乱了”，不再用易被误读为列存定义的“各列各排各的” */}
          <Txt position={[0, -120]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'顺序乱了'} />
        </Rect>
        <Rect ref={rightPanel} position={[300, -40]} width={480} height={300} radius={16} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt position={[0, -120]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'各列同顺序'} />
        </Rect>
        {[0, 1, 2].map(i => (
          <Rect
            key={`lc-${i}`}
            ref={leftCells[i]}
            position={[-420 + i * 120, -40 + (i % 2 === 0 ? -30 : 30)]}
            width={90}
            height={44}
            radius={8}
            fill={T.bg}
            stroke={T.red}
            lineWidth={2}
            opacity={0}
          >
            <Txt fontSize={15} fill={T.text} fontFamily={FONT.mono} text={['140102', '69', '5'][i]} />
          </Rect>
        ))}
        {[0, 1, 2].map(i => (
          <Txt
            key={`ll-${i}`}
            ref={leftLabs[i]}
            position={[-420 + i * 120, -40 + (i % 2 === 0 ? -30 : 30) - 48]}
            fontSize={13}
            fill={T.muted}
            fontFamily={FONT.mono}
            text={COL_LABS[i]}
            opacity={0}
          />
        ))}
        {[0, 1, 2].map(i => (
          <Rect
            key={`rc-${i}`}
            ref={rightCells[i]}
            position={[180 + i * 120, -40]}
            width={90}
            height={44}
            radius={8}
            fill={T.bg}
            stroke={T.green}
            lineWidth={2}
            opacity={0}
          >
            <Txt fontSize={15} fill={T.text} fontFamily={FONT.mono} text={['140102', '69', '5'][i]} />
          </Rect>
        ))}
        {[0, 1, 2].map(i => (
          <Txt
            key={`rl-${i}`}
            ref={rightLabs[i]}
            position={[180 + i * 120, -88]}
            fontSize={13}
            fill={T.muted}
            fontFamily={FONT.mono}
            text={COL_LABS[i]}
            opacity={0}
          />
        ))}
        <Line ref={cross1} points={[[-360, 60], [-240, 120]]} stroke={T.red} lineWidth={4} opacity={0} />
        <Line ref={cross2} points={[[-240, 60], [-360, 120]]} stroke={T.red} lineWidth={4} opacity={0} />
        <Txt ref={leftTag} position={[-300, 160]} fontSize={SIZE.body} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'对不上同一行'} opacity={0} />
        <Txt ref={rightTag} position={[300, 160]} fontSize={SIZE.body} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'拼得回整行'} opacity={0} />
      </Node>

      {/* 收尾 */}
      <Node ref={pClose} opacity={0}>
        <Rect ref={rowCard} position={[-290, -170]} width={480} height={180} radius={18} fill={T.card} stroke={T.line} lineWidth={3}>
          <Txt position={[0, -45]} fontSize={SIZE.body} fontWeight={700} fill={T.muted} fontFamily={FONT.sans} text={'行'} />
          <Txt position={[0, 20]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'一次取整行'} />
        </Rect>
        <Rect ref={colCard} position={[290, -170]} width={480} height={180} radius={18} fill={T.card} stroke={T.yellow} lineWidth={3}>
          <Txt position={[0, -45]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'列'} />
          <Txt position={[0, 20]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'只取要用的几列'} />
        </Rect>
        <Txt ref={colUseTag} position={[290, -55]} fontSize={20} fill={T.green} fontFamily={FONT.sans} text={'分析查询用这个'} opacity={0} />
        {[0, 1, 2].map(i => (
          <Rect
            key={`nc-${i}`}
            ref={nextCards[i]}
            position={[-330 + i * 330, 60]}
            width={280}
            height={80}
            radius={14}
            fill={T.card}
            stroke={T.yellow}
            lineWidth={2}
            opacity={0}
          >
            <Txt fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.mono} text={COL_LABS[i]} />
          </Rect>
        ))}
        <Line ref={nextArrow} points={[[0, 130], [0, 200]]} stroke={T.yellow} lineWidth={3} endArrow opacity={0} />
        <Txt ref={nextTag} position={[0, 230]} fontSize={SIZE.body} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'压得更小'} opacity={0} />
      </Node>
    </>
  );
  // 字段块是文档卡的子节点（相对卡中心定位），随卡一起出现/消失。
  // r7 P2-9：拆分用的地址/城市两块也挂在卡下，初始透明、与第三块同位。
  docCard().add(docFields.map(kv => kv.node));
  docCard().add([addrKV.node, cityKV.node]);

  say('只读这三列');
  yield* beat('k25',
    // r7 P2-15：拍首新画面即出现——三张列卡随 pOnly 一起亮起，不留空屏；
    // “这三个列文件”处改为轻闪。
    all(pOnly().opacity(1, 0.2), colCards[0]().opacity(1, 0.2), colCards[1]().opacity(1, 0.2), colCards[2]().opacity(1, 0.2)),
    at('这三个列文件', all(colCards[0]().scale(1.05, 0.4), colCards[1]().scale(1.05, 0.4), colCards[2]().scale(1.05, 0.4))),
    at('剩下的列', all(greyCards[0]().opacity(1, 0.4), greyCards[1]().opacity(1, 0.4), greyCards[2]().opacity(1, 0.4), greyCards[3]().opacity(1, 0.4), greyCards[4]().opacity(1, 0.4))),
    at('不用碰', all(greyCards[0]().opacity(0.25, 0.5), greyCards[1]().opacity(0.25, 0.5), greyCards[2]().opacity(0.25, 0.5), greyCards[3]().opacity(0.25, 0.5), greyCards[4]().opacity(0.25, 0.5))),
  );

  say('只读要用的列');
  yield* beat('k26',
    all(queryBox().opacity(1, 0.5)),
    at('不用读整行', all(colCards[0]().position([-330, 130], 1.2), colCards[1]().position([0, 130], 1.2), colCards[2]().position([330, 130], 1.2))),
    at('省下的工作', all(colCards[0]().scale(1.06, 0.5), colCards[1]().scale(1.06, 0.5), colCards[2]().scale(1.06, 0.5))),
  );

  say('按星期几分组');
  yield* beat('k27',
    chain(pOnly().opacity(0, 0.4), pGroup().opacity(1, 0.5)),
    at('每周哪天', chain(wdCells[0]().stroke(T.yellow, 0.3), wdCells[1]().stroke(T.yellow, 0.3), wdCells[2]().stroke(T.yellow, 0.3), wdCells[3]().stroke(T.yellow, 0.3), wdCells[4]().stroke(T.yellow, 0.3), wdCells[5]().stroke(T.yellow, 0.3), wdCells[6]().stroke(T.yellow, 0.3))),
    // r5：圆点逐天落位（原先七天同时出现）；补圆点含义——只表示当天有这类购买，
    // 不表示卖了多少（圆点是示意，不编造分组数字）。
    // r7 P1-3：承诺句式已改（“就能看出每周哪天有水果卖、哪天有糖果卖”），
    // at 短语随新旁白改成“有水果卖 / 有糖果卖”；分镜“答案行亮起”已删。
    at('有水果卖',
      chain(fruitLab().opacity(1, 0.4),
        chain(fruitDots[0]().opacity(1, 0.3), fruitDots[1]().opacity(1, 0.3), fruitDots[2]().opacity(1, 0.3), fruitDots[3]().opacity(1, 0.3), fruitDots[4]().opacity(1, 0.3), fruitDots[5]().opacity(1, 0.3), fruitDots[6]().opacity(1, 0.3)))),
    at('有糖果卖',
      chain(candyLab().opacity(1, 0.4),
        chain(candyDots[0]().opacity(1, 0.3), candyDots[1]().opacity(1, 0.3), candyDots[2]().opacity(1, 0.3), candyDots[3]().opacity(1, 0.3), candyDots[4]().opacity(1, 0.3), candyDots[5]().opacity(1, 0.3), candyDots[6]().opacity(1, 0.3)))),
    at('只表示', dotNote().opacity(1, 0.5)),
    // r8 P2-5（轮内补修）：新句“每天只画一个绿点、一个紫点”处两色圆点各轻闪一次——
    // 念到哪色、哪色闪，与旁白同步；同时切断 dotNote 与 sumNote 之间 7.57s 的静止段。
    at('绿点',
      chain(
        all(...fruitDots.map(d => d().scale(1.25, 0.3))),
        all(...fruitDots.map(d => d().scale(1, 0.3))))),
    at('紫点',
      chain(
        all(...candyDots.map(d => d().scale(1.25, 0.3))),
        all(...candyDots.map(d => d().scale(1, 0.3))))),
    // r6：新句“哪天卖得最多，要看加总后的数量”处出现第二行说明——答案要看加总
    // 后的数量（SQL 里对 quantity 求和），这张圆点图只看得出哪天有购买，不编答案。
    at('加总后的数量', sumNote().opacity(1, 0.5)),
    // r7：尾句“这张图只看得出哪天有购买”处圆点轻闪一次，切断新旁白拉长后的
    // 4.5s 静止尾（探针 mc4 曾报 k27 idle 4.5s），不是真静止。
    at('只看得出哪天有购买',
      chain(
        all(...fruitDots.map(d => d().scale(1.25, 0.3)), ...candyDots.map(d => d().scale(1.25, 0.3))),
        all(...fruitDots.map(d => d().scale(1, 0.3)), ...candyDots.map(d => d().scale(1, 0.3))))),
  );

  say('Parquet 也支持文档');
  yield* beat('k28',
    chain(pGroup().opacity(0, 0.5), pBound().opacity(1, 0.5)),
    at('关系数据', all(relCard().opacity(1, 0.5), arrowRel().opacity(1, 0.4))),
    // r7 P2-8：文档卡出现时卡里已有三行字段内容，不再是空框。
    at('不只适用于关系数据', all(docCard().opacity(1, 0.5), arrowDoc().opacity(1, 0.4),
      docLines[0]().opacity(1, 0.4), docLines[1]().opacity(1, 0.4), docLines[2]().opacity(1, 0.4))),
    at('Parquet', parquetPlate().opacity(1, 0.5)),
    at('文档数据模型', docCard().stroke(T.green, 0.4)),
    // r7 P2-8：Dremel 出现时，Parquet 与 Dremel 之间亮起箭头 + “借鉴”标注。
    at('Dremel', all(dremelNote().opacity(1, 0.5), pqArrow().opacity(1, 0.4), borrowLab().opacity(1, 0.4))),
    // r6：新句“它是谷歌内部用来快速分析海量嵌套数据的查询系统”处标注轻闪两次，
    // 填满新增旁白的尾部（Dremel 是什么：谷歌的嵌套数据查询系统，见 Melnik 等 2010）。
    at('快速分析',
      chain(dremelNote().scale(1.08, 0.4), dremelNote().scale(1, 0.4))),
    at('查询系统',
      chain(dremelNote().scale(1.08, 0.4), dremelNote().scale(1, 0.4))),
  );

  say('字段各存一列');
  yield* beat('k28a',
    // r7 P2-9：本拍聚焦拆字段——Parquet 名牌、Dremel 标注与文档内容行先淡出，
    // 空出的下方放四张列文件；字段块从文档卡里引线指向各自的列文件。
    chain(all(parquetPlate().opacity(0, 0.4), dremelNote().opacity(0, 0.4),
      pqArrow().opacity(0, 0.4), borrowLab().opacity(0, 0.4),
      docLines[0]().opacity(0, 0.4), docLines[1]().opacity(0, 0.4), docLines[2]().opacity(0, 0.4))),
    // r5：文档怎么按列存——把文档拆成字段，每个字段的值各自存成一列；
    // 嵌套的字段（地址里的城市）再拆到最里面的小字段。
    // 旁白用“属性”不用“字段”：句首/分句首的“字段”会让 TTS 截断（已用短句探针验证）。
    at('拆开',
      chain(docTitle().position([0, -55], 0.5),
        all(docFields[0].node.opacity(1, 0.4), docFields[1].node.opacity(1, 0.4), docFields[2].node.opacity(1, 0.4)))),
    at('各自存成一列',
      all(docFields[0].node.stroke(T.green, 0.4), docFields[1].node.stroke(T.green, 0.4), docFields[2].node.stroke(T.green, 0.4),
        colArrows[0]().opacity(1, 0.4), colArrows[1]().opacity(1, 0.4), colArrows[2]().opacity(1, 0.4),
        colFiles[0]().opacity(1, 0.4), colFiles[1]().opacity(1, 0.4), colFiles[2]().opacity(1, 0.4))),
    // r7 P2-9：“地址·城市”拆成地址、城市两块——原块淡出，地址留在原位、城市向右飞出；
    // 第四根引线与第四张列文件同现，第三张列文件的名牌由“地址·城市”换成“地址”。
    at('接着拆下去',
      chain(
        all(docFields[2].node.opacity(0, 0.3), addrKV.node.opacity(1, 0.4),
          colFileLabs[2]().text('地址', 0)),
        all(cityKV.node.opacity(1, 0.4), cityKV.moveTo([165, 35], 0.5),
          colArrows[3]().opacity(1, 0.4), colFiles[3]().opacity(1, 0.4)))),
  );

  say('各列同顺序才拼得回');
  yield* beat('k29',
    chain(pBound().opacity(0, 0.5), pOrder().opacity(1, 0.5)),
    pOrder().scale(1.02, beat.dur('k29')),
    // r7 P2-10：左盒数字块上方标列名；标题已改成“顺序乱了”。
    at('各排各的', all(leftPanel().opacity(1, 0.5),
      leftCells[0]().opacity(1, 0.4), leftCells[1]().opacity(1, 0.4), leftCells[2]().opacity(1, 0.4),
      leftLabs[0]().opacity(1, 0.4), leftLabs[1]().opacity(1, 0.4), leftLabs[2]().opacity(1, 0.4),
      cross1().opacity(1, 0.4), cross2().opacity(1, 0.4), leftTag().opacity(1, 0.4))),
    at('顺序必须一致', all(rightPanel().opacity(1, 0.5),
      rightCells[0]().opacity(1, 0.4), rightCells[1]().opacity(1, 0.4), rightCells[2]().opacity(1, 0.4),
      rightLabs[0]().opacity(1, 0.4), rightLabs[1]().opacity(1, 0.4), rightLabs[2]().opacity(1, 0.4),
      rightTag().opacity(1, 0.4))),
  );

  say('行取整行，列取要用的');
  yield* beat('k30',
    chain(pOrder().opacity(0, 0.5), pClose().opacity(1, 0.5)),
    // r7 P2-11：“行”卡不再变灰——描蓝表示行存是合理用途（一次取整行）；
    // 列卡描绿 + “分析查询用这个”标注，靠这个区分，不靠灰暗。
    at('一次取整行', rowCard().stroke(T.blue, 0.4)),
    at('只取要用的那几列', all(colCard().scale(1.03, 0.8))),
    at('后者', all(colCard().stroke(T.green, 0.4), colUseTag().opacity(1, 0.4))),
    at('压得更小', chain(all(nextCards[0]().opacity(1, 0.4), nextCards[1]().opacity(1, 0.4), nextCards[2]().opacity(1, 0.4)), nextArrow().opacity(1, 0.3), nextTag().opacity(1, 0.3))),
  );
});
