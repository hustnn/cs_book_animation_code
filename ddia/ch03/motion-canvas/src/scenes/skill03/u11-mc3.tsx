// U11 场景 3（MC，r6）：k16–k24 + k20a/k23a —— Example 3-1 水果 vs 糖果按星期几、只读三列、
// JOIN 两张维度表、行式引擎整行加载再过滤。分镜：skill-ch03/beats-u11.md；原文：DDIA §3.10。
// r5：k19 补一般数字四五列；k20a 亮维度表内容与筛选顺序；k22 索引定位框逐行扫过；
// k23a 过滤例子（第二行是 2014 年，查询只要 2013 年）。
// r7：k17 记录点飞入星期格 + 承诺句式改；k19 高亮移到前 3 格 + 列名标注 + “四五列”再闪 2 格；k20a × 加“筛掉”标注 + 日期表“示例”小标；k20/k16 拍首即现；k22 整行示意注；k23 解析扫过、红字移走；k23a 芯片日期 130102/140102/130103、白锚点删；k24 耗时条 + 行数爬升。
// r8：k17 换表小标 + 旁白改（“不用前面那八行，换成二零一三年全年……”）；k20a 日期表卡下加
// “示例日期不在 2013 年查询范围”小标——图 3-9 日期维度表只有 140101/140102/140103 三行
// （全是 2014 年），书里没有 2013 年日期，换例子会编造，故 140102 不动，选修法 (b)；
// k22“示意：只画 3 行”标签改成“新例子：只画 3 行”。
// r6：k22 补“只画三行作例子”+ 内存框“示意：只画 3 行”标签（三行芯片是查询要扫的行的
// 样子，不是八行表）；k23a“第二行”改成“这三行里的第二行”。
// 时长全部来自 timeline/u11.json（beat() 驱动），不手写 waitFor。
import {Circle, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, chain, createRef} from '@motion-canvas/core';
import {at, makeBeats} from '../../lib/beats';
import {Counter} from '../../lib/schemas';
import {FONT, SAFE, SIZE, T} from '../../lib/theme';
import timeline from '../../timeline/u11.json';

const WEEKDAYS = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
const COL_LABS = ['date_key', 'product_sk', 'quantity'];

export default makeScene2D(function* (view) {
  view.fill(T.bg);
  const beat = makeBeats(timeline);

  const header = createRef<Txt>();
  const anchor = createRef<Txt>();
  const say = (text: string) => anchor().text(text);

  // ---- k16–k18：查询卡 ----
  const pQuery = createRef<Node>();
  const fruitCard = createRef<Rect>();
  const candyCard = createRef<Rect>();
  const wdCells = WEEKDAYS.map(() => createRef<Rect>());
  const recStrip = createRef<Rect>();
  // r8 P2-1：换表信号——k17 开头亮起，说明下面扫的是另一张全年表，不是前面那八行。
  const switchTag = createRef<Txt>();
  const scanDot = createRef<Circle>();
  // r7 P2-5：记录点——k17 分组时逐个飞入对应的星期格上方，画出“记录落入分组”。
  const recDots = WEEKDAYS.map(() => createRef<Circle>());
  const colCards = [0, 1, 2].map(() => createRef<Rect>());

  // ---- k19：100 列只用 3 列 ----
  const pWide = createRef<Node>();
  const wideCells = Array.from({length: 100}, () => createRef<Rect>());
  const wideDim = createRef<Rect>();
  // r7 P2-1：高亮移到最前面 3 格（与 k2 同位置），上方标列名；P2-2：再亮 2 格闪一下凑成 5 格。
  const wideHl = [0, 1, 2].map(() => createRef<Rect>());
  const wideLab = createRef<Txt>();
  const wideHl45 = [3, 4].map(() => createRef<Rect>());
  const skipArrow = createRef<Line>();
  const skipLab = createRef<Txt>();
  const wgridX = (i: number) => -563.5 + (i % 50) * 23;
  const wgridY = (i: number) => (i < 50 ? -140 : -100);

  // ---- k20–k21：维度表 JOIN ----
  const pDim = createRef<Node>();
  const dimDate = createRef<Rect>();
  const dimProd = createRef<Rect>();
  // r5 k20a：维度表里的一行内容（按图 3-9 的维度表行核对）——日期表 140102 是
  // 2014 年 1 月 2 日星期四；产品表 30 是香蕉/新鲜水果、31 是鱼食/宠物用品。
  const dimDateRow1 = createRef<Txt>();
  const dimDateRow2 = createRef<Txt>();
  // r7 P1-2：日期表卡上角标“示例”（140102 是原值，不动，只框定它是维度表长什么样）。
  const dimExTag = createRef<Txt>();
  // r8 P2-2（修法 b）：示例日期不在查询范围——140102 是 2014 年，查询只要 2013 年；
  // 只借它的星期几查法。140102 本身不动（书上核实过的值；图 3-9 无 2013 年日期可换）。
  const dimScopeNote = createRef<Txt>();
  const dimProdRow1 = createRef<Txt>();
  const dimProdRow2 = createRef<Txt>();
  // r7 P1-2：给红 × 加“筛掉”标注（31 是鱼食，不在水果和糖果里）。
  const dimXNote = createRef<Txt>();
  const joinLine1 = createRef<Line>();
  const joinLine2 = createRef<Line>();
  const dimColChips = [0, 1, 2].map(() => createRef<Rect>());

  // ---- k22–k24：行式引擎 ----
  const pRow = createRef<Node>();
  const idxLab1 = createRef<Txt>();
  const idxLab2 = createRef<Txt>();
  // r5 k22：索引定位框，逐行扫过三行芯片（演“索引定位到要找的行”）。
  const scanFrame = createRef<Rect>();
  const memBox = createRef<Rect>();
  const memLab = createRef<Txt>();
  const rowChips = [0, 1, 2].map(() => createRef<Rect>());
  // r7 P1-1：三行芯片日期改成 130102 / 140102 / 130103——只有第 2 行是 2014 年，
  // 其余两行是 2013 年；其他值不动（第 2 行仍是 140102，仍描红滤掉）。
  const chipLabs = ['第 1 行：130102 / 69 / 4 / …', '第 2 行：140102 / 69 / 5 / …', '第 3 行：130103 / 69 / 5 / …'];
  const filterTag = createRef<Txt>();
  // r7 P2-6：k22 出现的小字——每行有一百多个属性，芯片只画前三个值（不编整行全值）。
  const fullRowNote = createRef<Txt>();
  // r7 P2-6：“解析”的可视动作——解析框逐行扫过三行芯片，扫完描绿。
  const parseFrame = createRef<Rect>();
  // r6 k22：“示意：只画 3 行”标签——内存里的三行芯片是查询要扫的行的样子（示意），
  // 不是刚才那张八行表；其余行没画出来，三行代表全年要扫的那些行。
  // r8 P2-3：改成“新例子：只画 3 行”——三行是新举的例子，不是八行表里的行。
  const schematicTag = createRef<Txt>();
  // r5 k23a：过滤例子的标注（第二行是 2014 年，查询只要 2013 年）。
  const exTag = createRef<Txt>();
  const slowTag = createRef<Txt>();
  // r7 P2-7：k24“表越大越慢”的放大画面——耗时条拉长 + 已加载行数爬升（见 k24）。
  const timeBar = createRef<Rect>();
  const timeLab = createRef<Txt>();
  // 已加载行数计数器：整行飞进内存时逐行加一
  const loaded = new Counter([560, -290], '已加载 ', ' 行', {offset: [1, 0]});

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

      {/* 查询卡 */}
      <Node ref={pQuery} opacity={0}>
        <Rect ref={fruitCard} position={[-280, -180]} width={400} height={120} radius={16} fill={T.card} stroke={T.green} lineWidth={3} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'新鲜水果'} />
        </Rect>
        <Rect ref={candyCard} position={[280, -180]} width={400} height={120} radius={16} fill={T.card} stroke={T.purple} lineWidth={3} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.purple} fontFamily={FONT.sans} text={'糖果'} />
        </Rect>
        {WEEKDAYS.map((d, i) => (
          <Rect
            key={`wd-${i}`}
            ref={wdCells[i]}
            position={[-450 + i * 150, -40]}
            width={130}
            height={56}
            radius={10}
            fill={T.card}
            stroke={T.line}
            lineWidth={2}
            opacity={0}
          >
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={d} />
          </Rect>
        ))}
        <Txt ref={switchTag} position={[0, 140]} fontSize={18} fill={T.yellow} fontFamily={FONT.sans} text={'换一张表：2013 年全年销售记录'} opacity={0} />
        <Rect ref={recStrip} position={[0, 90]} width={1000} height={36} radius={18} fill={T.card} stroke={T.line} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'2013 年全年的销售记录'} />
        </Rect>
        <Circle ref={scanDot} position={[-480, 90]} width={22} height={22} fill={T.yellow} opacity={0} />
        {recDots.map((ref, i) => (
          <Circle
            key={`rd-${i}`}
            ref={ref}
            // 起点在记录条下方（y=112），不压条上的“2013 年全年的销售记录”文字；
            // 飞起时短暂穿过条面，落点在星期格上方 y=-85。
            position={[-450 + i * 150, 112]}
            width={16}
            height={16}
            fill={T.yellow}
            opacity={0}
          />
        ))}
        {COL_LABS.map((lab, i) => (
          <Rect
            key={`cc-${i}`}
            ref={colCards[i]}
            position={[-330 + i * 330, 190]}
            width={300}
            height={64}
            radius={12}
            fill={T.card}
            stroke={T.yellow}
            lineWidth={2}
            opacity={0}
          >
            <Txt fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.mono} text={lab} />
          </Rect>
        ))}
      </Node>

      {/* 100 列只用 3 列 */}
      <Node ref={pWide} opacity={0}>
        {wideCells.map((ref, i) => (
          <Rect
            key={`wc-${i}`}
            ref={ref}
            position={[wgridX(i), wgridY(i)]}
            width={21}
            height={26}
            fill={T.card}
            stroke={T.line}
            lineWidth={1}
          />
        ))}
        <Rect ref={wideDim} position={[0, -120]} width={1150} height={90} fill={T.bg} opacity={0} />
        {wideHl.map((ref, k) => (
          <Rect
            key={`wh-${k}`}
            ref={ref}
            position={[wgridX(k), wgridY(k)]}
            width={25}
            height={30}
            stroke={T.yellow}
            lineWidth={3}
            opacity={0}
          />
        ))}
        <Txt
          ref={wideLab}
          position={[wgridX(1), -180]}
          fontSize={14}
          fill={T.yellow}
          fontFamily={FONT.sans}
          text={'日期 · 产品 · 数量'}
          opacity={0}
        />
        {wideHl45.map((ref, k) => (
          <Rect
            key={`wh45-${k}`}
            ref={ref}
            position={[wgridX(3 + k), wgridY(3 + k)]}
            width={25}
            height={30}
            stroke={T.yellow}
            lineWidth={3}
            opacity={0}
          />
        ))}
        <Line ref={skipArrow} points={[[-560, 110], [560, 110]]} stroke={T.muted} lineWidth={3} endArrow opacity={0} />
        <Txt ref={skipLab} position={[0, 150]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'其余列直接跳过'} opacity={0} />
      </Node>

      {/* 维度表 JOIN */}
      <Node ref={pDim} opacity={0}>
        <Rect ref={dimDate} position={[-290, -120]} width={440} height={150} radius={16} fill={T.card} stroke={T.blue} lineWidth={3} opacity={0}>
          <Txt position={[0, -50]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'日期表'} />
          <Txt position={[0, -12]} fontSize={SIZE.label} fill={T.blue} fontFamily={FONT.sans} text={'星期几'} />
          <Txt ref={dimDateRow1} position={[0, 20]} fontSize={20} fill={T.yellow} fontFamily={FONT.mono} text={'140102 → 星期四'} opacity={0} />
          <Txt ref={dimDateRow2} position={[0, 52]} fontSize={20} fill={T.muted} fontFamily={FONT.sans} text={'2014 年 1 月 2 日'} opacity={0} />
          <Txt ref={dimExTag} position={[180, -58]} fontSize={16} fill={T.muted} fontFamily={FONT.sans} text={'示例'} opacity={0} />
        </Rect>
        <Txt ref={dimScopeNote} position={[-290, 95]} fontSize={18} fill={T.yellow} fontFamily={FONT.sans} text={'示例日期不在 2013 年查询范围'} opacity={0} />
        <Rect ref={dimProd} position={[290, -120]} width={440} height={150} radius={16} fill={T.card} stroke={T.purple} lineWidth={3} opacity={0}>
          <Txt position={[0, -50]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'产品表'} />
          <Txt position={[0, -12]} fontSize={SIZE.label} fill={T.purple} fontFamily={FONT.sans} text={'类别'} />
          <Txt ref={dimProdRow1} position={[0, 20]} fontSize={20} fill={T.green} fontFamily={FONT.sans} text={'30 · 香蕉 → 新鲜水果'} opacity={0} />
          <Txt ref={dimProdRow2} position={[0, 52]} fontSize={20} fill={T.red} fontFamily={FONT.sans} text={'× 31 · 鱼食 → 宠物用品'} opacity={0} />
        </Rect>
        <Txt ref={dimXNote} position={[290, 95]} fontSize={18} fill={T.red} fontFamily={FONT.sans} text={'筛掉：不在水果、糖果里'} opacity={0} />
        <Line ref={joinLine1} points={[[-290, -45], [-150, 60]]} stroke={T.green} lineWidth={3} endArrow opacity={0} />
        <Line ref={joinLine2} points={[[290, -45], [150, 60]]} stroke={T.green} lineWidth={3} endArrow opacity={0} />
        {COL_LABS.map((lab, i) => (
          <Rect
            key={`dc-${i}`}
            ref={dimColChips[i]}
            position={[-330 + i * 330, 150]}
            width={300}
            height={64}
            radius={12}
            fill={T.card}
            stroke={T.yellow}
            lineWidth={2}
            opacity={0}
          >
            <Txt fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.mono} text={lab} />
          </Rect>
        ))}
      </Node>

      {/* 行式引擎 */}
      <Node ref={pRow} opacity={0}>
        <Txt ref={idxLab1} position={[-260, -230]} fontSize={SIZE.label} fill={T.blue} fontFamily={FONT.mono} text={'date_key 索引 →'} opacity={0} />
        <Txt ref={idxLab2} position={[260, -230]} fontSize={SIZE.label} fill={T.blue} fontFamily={FONT.mono} text={'product_sk 索引 →'} opacity={0} />
        <Rect ref={scanFrame} position={[-320, -140]} width={330} height={56} stroke={T.blue} lineWidth={2} opacity={0} />
        <Rect ref={memBox} position={[0, 120]} width={1000} height={180} radius={14} fill={T.card} stroke={T.line} lineWidth={2} opacity={0}>
          <Txt ref={memLab} position={[-470, -70]} offset={[-1, 0]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'内存'} opacity={0} />
        </Rect>
        {rowChips.map((ref, i) => (
          <Rect
            key={`chip-${i}`}
            ref={ref}
            position={[-320 + i * 330, -140]}
            width={320}
            height={48}
            radius={10}
            fill={T.bg}
            stroke={T.yellow}
            lineWidth={2}
            opacity={0}
          >
            <Txt fontSize={15} fill={T.text} fontFamily={FONT.mono} text={chipLabs[i]} />
          </Rect>
        ))}
        {/* r7 P2-6：红字“不符合条件的行，过滤掉”移到 k23a 再出现——位置改到内存框上方
            （[0, 0]，与 k23a 的红标注 [0, 240] 不重叠）；k23 本拍不再亮它。 */}
        <Txt ref={filterTag} position={[0, 0]} fontSize={SIZE.label} fill={T.red} fontFamily={FONT.sans} text={'不符合条件的行，过滤掉'} opacity={0} />
        <Txt ref={fullRowNote} position={[0, 235]} fontSize={18} fill={T.muted} fontFamily={FONT.sans} text={'每行有一百多个属性，芯片只画前三个值'} opacity={0} />
        <Rect ref={parseFrame} position={[-320, 120]} width={330} height={56} stroke={T.yellow} lineWidth={3} opacity={0} />
        <Txt ref={schematicTag} position={[0, 40]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'新例子：只画 3 行'} opacity={0} />
        <Txt ref={exTag} position={[0, 240]} fontSize={SIZE.label} fill={T.red} fontFamily={FONT.sans} text={'比如这三行里的第二行：2014 年，查询只要 2013 年'} opacity={0} />
        <Txt ref={slowTag} position={[0, -290]} fontSize={SIZE.label} fill={T.red} fontFamily={FONT.sans} text={'要花很长时间'} opacity={0} />
        <Txt ref={timeLab} position={[-450, -235]} offset={[-1, 0]} fontSize={18} fill={T.red} fontFamily={FONT.sans} text={'耗时越拖越长'} opacity={0} />
        <Rect ref={timeBar} position={[-450, -195]} offset={[-1, 0]} width={100} height={22} radius={6} fill={T.red} opacity={0} />
      </Node>
    </>
  );
  pRow().add(loaded.node);

  say('水果还是糖果？');
  yield* beat('k16',
    // r7 P2-15：拍首新画面即出现——两张卡随查询卡一起亮起，不留 1–2 秒空屏；
    // 星期格仍在“星期几”处逐个出现。
    all(pQuery().opacity(1, 0.2), fruitCard().opacity(1, 0.2), candyCard().opacity(1, 0.2)),
    at('新鲜水果', fruitCard().scale(1.04, 0.4)),
    at('糖果', candyCard().scale(1.04, 0.4)),
    at('星期几', all(wdCells[0]().opacity(1, 0.5), wdCells[1]().opacity(1, 0.5), wdCells[2]().opacity(1, 0.5), wdCells[3]().opacity(1, 0.5), wdCells[4]().opacity(1, 0.5), wdCells[5]().opacity(1, 0.5), wdCells[6]().opacity(1, 0.5))),
  );

  say('扫全年，按星期分组');
  yield* beat('k17',
    // r8 P2-1：换表小标与记录条同现（旁白“不用前面那八行，换成……”同义，画面 + 旁白双信号）。
    all(recStrip().opacity(1, 0.5), switchTag().opacity(1, 0.5)),
    at('二零一三年', chain(scanDot().opacity(1, 0.3), scanDot().position([480, 90], 2.0))),
    // r7 P2-5：记录点逐个飞入对应的星期格上方，画出“记录落入分组”；
    // 与星期格描黄并行。r7 P1-3：承诺句式已改（“就能看出哪天有这两类购买”），
    // at 短语随新旁白改成“就能看出”。
    at('按星期几',
      all(
        chain(wdCells[0]().stroke(T.yellow, 0.3), wdCells[1]().stroke(T.yellow, 0.3), wdCells[2]().stroke(T.yellow, 0.3), wdCells[3]().stroke(T.yellow, 0.3), wdCells[4]().stroke(T.yellow, 0.3), wdCells[5]().stroke(T.yellow, 0.3), wdCells[6]().stroke(T.yellow, 0.3)),
        chain(...recDots.map((ref, i) =>
          chain(ref().opacity(1, 0.2), ref().position([-450 + i * 150, -85], 0.35)))))),
    at('就能看出', all(fruitCard().scale(1.04, 0.4), candyCard().scale(1.04, 0.4))),
  );

  say('只要 3 列');
  yield* beat('k18',
    at('日期', colCards[0]().opacity(1, 0.5)),
    at('产品', colCards[1]().opacity(1, 0.5)),
    at('数量', colCards[2]().opacity(1, 0.5)),
  );

  say('100 多列，只读 3 列');
  yield* beat('k19',
    chain(pQuery().opacity(0, 0.4), pWide().opacity(1, 0.4)),
    // r7 P2-1：亮起的 3 格与 k2 同位置（最前面 3 格），上方标列名（日期 / 产品 / 数量）。
    // r7 复核：三格各自标注会重叠（格距 23px、每标约 28px）——改成三格上方一行合并标注。
    at('只读这三列', all(wideHl[0]().opacity(1, 0.4), wideHl[1]().opacity(1, 0.4), wideHl[2]().opacity(1, 0.4),
      wideLab().opacity(1, 0.4))),
    at('根本不用碰', all(wideDim().opacity(0.55, 0.5), skipArrow().opacity(1, 0.4), skipLab().opacity(1, 0.4))),
    // r5b：第二句“一般来说”处三格再轻闪一次，填满两句之间的 3.1s 静止段。
    at('一般来说',
      chain(
        all(wideHl[0]().scale(1.1, 0.3), wideHl[1]().scale(1.1, 0.3), wideHl[2]().scale(1.1, 0.3)),
        all(wideHl[0]().scale(1, 0.3), wideHl[1]().scale(1, 0.3), wideHl[2]().scale(1, 0.3)))),
    // r5：补一般数字“一般查询也只用到四五列”（清单 3.10-2）；三格轻闪填拍尾。
    // r7 P2-2：念到“四五列”时再亮 2 格轻闪（共 5 格），“四五列”长什么样画出来。
    at('四五列',
      all(
        chain(wideHl45[0]().opacity(1, 0.3), wideHl45[0]().opacity(0, 0.6)),
        chain(wideHl45[1]().opacity(1, 0.3), wideHl45[1]().opacity(0, 0.6)),
        chain(
          all(wideHl[0]().scale(1.2, 0.4), wideHl[1]().scale(1.2, 0.4), wideHl[2]().scale(1.2, 0.4)),
          all(wideHl[0]().scale(1, 0.4), wideHl[1]().scale(1, 0.4), wideHl[2]().scale(1, 0.4))))),
  );

  say('星期几、类别从哪来？');
  yield* beat('k20',
    // r7 P2-15：拍首新画面即出现——两张维度表卡随 pDim 一起亮起，不留残帧/空屏；
    // “日期表里 / 产品表里”处改为轻闪描边（卡已在位）。
    all(pWide().opacity(0, 0.2), pDim().opacity(1, 0.2), dimDate().opacity(1, 0.2), dimProd().opacity(1, 0.2)),
    at('日期表里', chain(dimDate().scale(1.03, 0.3), dimDate().scale(1, 0.3))),
    at('产品表里', chain(dimProd().scale(1.03, 0.3), dimProd().scale(1, 0.3))),
  );

  say('维度表里写了什么');
  yield* beat('k20a',
    // r5：亮出维度表内容、讲清筛选顺序——先在维度表里筛（产品表挑水果/糖果、
    // 日期表给星期几），再去事实表对。行内容按图 3-9 的维度表行核对。
    // r5b：开头介绍句“日期表里 / 产品表里”处各卡轻闪一次，填满首行出现前的 4.3s 静止段。
    at('日期表里',
      chain(
        all(dimDate().scale(1.03, 0.3)),
        all(dimDate().scale(1, 0.3)))),
    // r7 P1-2：日期表行亮起时“示例”小标同现（140102 是原值，只框定它是示例）。
    // r8 P2-2：星期四行亮起时范围小标同现，140102 的两副面孔当场消解。
    at('星期四', all(dimDateRow1().opacity(1, 0.4), dimDateRow2().opacity(1, 0.4), dimExTag().opacity(1, 0.4), dimScopeNote().opacity(1, 0.4))),
    at('产品表里',
      chain(
        all(dimProd().scale(1.03, 0.3)),
        all(dimProd().scale(1, 0.3)))),
    at('新鲜水果', dimProdRow1().opacity(1, 0.4)),
    at('鱼食', dimProdRow2().opacity(1, 0.4)),
    // r7 P1-2：新句“不在水果和糖果里，先筛掉”处亮起红字标注，× 的含义画出来。
    at('先筛掉', dimXNote().opacity(1, 0.4)),
    at('先从维度表开始',
      chain(
        all(dimDate().scale(1.03, 0.3), dimProd().scale(1.03, 0.3)),
        all(dimDate().scale(1, 0.3), dimProd().scale(1, 0.3)))),
  );

  say('关联过来，还是只读 3 列');
  yield* beat('k21',
    at('关联过来', all(joinLine1().opacity(1, 0.4), joinLine2().opacity(1, 0.4), dimDate().stroke(T.green, 0.4), dimProd().stroke(T.green, 0.4))),
    at('还是只读那三列', all(dimColChips[0]().opacity(1, 0.4), dimColChips[1]().opacity(1, 0.4), dimColChips[2]().opacity(1, 0.4))),
  );

  say('整行读进内存');
  yield* beat('k22',
    // r5：三行芯片逐行出现（原先并行出现）；索引定位框逐行扫过三行芯片，
    // 演“索引定位到要找的行”，填满旁白与飞行之间的静止段。
    chain(pDim().opacity(0, 0.4), all(pRow().opacity(1, 0.4), memBox().opacity(1, 0.4), memLab().opacity(1, 0.4), loaded.node.opacity(1, 0.4)),
      chain(rowChips[0]().opacity(1, 0.5), rowChips[1]().opacity(1, 0.5), rowChips[2]().opacity(1, 0.5))),
    at('索引',
      chain(all(idxLab1().opacity(1, 0.4), idxLab2().opacity(1, 0.4), scanFrame().opacity(1, 0.3)),
        scanFrame().position([10, -140], 1.4),
        scanFrame().position([340, -140], 1.4))),
    at('整行读进内存', all(rowChips[0]().position([-320, 120], 1.2), rowChips[1]().position([10, 120], 1.2), rowChips[2]().position([340, 120], 1.2), idxLab1().opacity(0, 0.4), idxLab2().opacity(0, 0.4), scanFrame().opacity(0, 0.4), chain(loaded.bump(), loaded.bump(), loaded.bump()), fullRowNote().opacity(1, 0.4))),
    // r6：新句“这里只画三行作例子，代表查询要扫的那些行”处亮起“示意”标签——
    // 三行芯片是示意，其余行没画出来；不是刚才那张八行表。
    // r8 P2-3：标签文案改成“新例子：只画 3 行”，出处当场讲清。
    at('只画三行', schematicTag().opacity(1, 0.5)),
  );

  say('解析，再过滤');
  yield* beat('k23',
    // r7 P2-6：k22 的“每行一百多个属性”小字在解析开始时淡出；红字“过滤掉”本拍不出现。
    chain(fullRowNote().opacity(0, 0.3)),
    // r7 P2-6：“解析”加可视动作——解析框逐行扫过三行芯片，扫完三行描绿。
    at('解析一遍', chain(parseFrame().opacity(1, 0.3),
      parseFrame().position([10, 120], 0.6),
      parseFrame().position([340, 120], 0.6),
      parseFrame().opacity(0, 0.3),
      all(rowChips[0]().stroke(T.green, 0.4), rowChips[1]().stroke(T.green, 0.4), rowChips[2]().stroke(T.green, 0.4)))),
  );

  // r7 P1-1：白锚点已删（与红标注重复）——本拍锚文本为空，只留红标注。
  say('');
  yield* beat('k23a',
    // r6：过滤的例子——这三行里的第二行查日期表是 2014 年，查询只要 2013 年，所以过滤掉。
    // “第二行”指内存里这三行芯片中的第二行，不是八行表的第 2 行。
    // 日期 140102 → 2014 年见 k20a 的日期表行；类别条件（水果/糖果）见 k20a 的产品表行。
    // r7 P1-1：三行芯片日期是 130102 / 140102 / 130103，只有第 2 行是 2014 年。
    at('第二行', rowChips[1]().stroke(T.red, 0.4)),
    at('二零一四年的', rowChips[1]().opacity(0.3, 0.5)),
    // r7 P2-6：红字“过滤掉”移到过滤发生时（k23a）再出现，与红标注同现。
    at('过滤掉', all(exTag().opacity(1, 0.5), filterTag().opacity(1, 0.5))),
  );

  say('要花很长时间');
  yield* beat('k24',
    at('要花很长时间', slowTag().opacity(1, 0.5)),
    // r7 P2-7：不再只是多一行红字——耗时条拉长、已加载行数从 3 爬升、内存框涨大，
    // “表越大越慢”有放大的画面。
    at('表越大越慢', all(timeLab().opacity(1, 0.4), timeBar().opacity(1, 0.4),
      timeBar().width(950, 1.2), memBox().scale(1.08, 0.8),
      chain(loaded.bump(), loaded.bump(), loaded.bump()))),
  );
});
