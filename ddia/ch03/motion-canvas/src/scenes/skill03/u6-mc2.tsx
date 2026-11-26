// U6 场景 2（MC，r5）：f14–f25c —— 索引值的两种可能、堆文件（只存一份、原地覆盖 / 变大搬家 /
// 更新索引或转发指针）、聚集索引（行住在索引里，InnoDB 主键聚集、SQL Server 指定一个）、覆盖索引。
// r10：f14 回扣“行号列表就是这里说的引用”、f23b 补“按 user_id 的那个索引也一样”（idxTxt1“姓名索引”改“user_id 索引”）、
// f24a 三表拼合示意、f24c 切换点、f24d2 聚集键、f24f 行号只是代号、f24g2 搬家前也是两跳（preHopLab）。
// r9：f22 小标“行号不变，变的是位置”（idLab）、f23 拆 f23 + f23b（旧键上海删掉、新键指旧槽，
// 旁白不念“转发指针”——TTS 在该词上连续坏音频 5 次，画面三处仍写“转发指针”）、f24a“按主键查，一次就到”。
// r8：f15–f17 按表拆框（收货表堆文件，两索引同属收货表；f18–f19 订单表堆文件，f20 起切回收货表）、
// f19 键/值小标、f20 换例子换槽、f21 行 19 新槽两行卡、f22 键改+代价+空槽、f23 转发指针+代价+旧键、
// f24a 跳两次脉冲+跳数口径、f24c/f24f 二级索引记主键（InnoDB）、f24d 拆 f24d2、f24f 旧页/新页标、
// f25b 键/值多带标注、f25c 切用户表索引；删 f15 死码 newChip/delTag。
// r7 补修：f18/f19 各加一处 pulse（成片定格 6.40s/6.47s 超 6s 线；r6 成片测 3.53s/3.30s，
// 是小面积变色贴近 freezedetect 噪声底线的测值浮动，见 review.md 观感审）。
// r7：f17 标签与旁白改“同一张表的堆文件”、f16 旁白加“每张表各有自己的堆文件，这里只画其中一份”（N1）；
// f25c 旁白加“先由用户表定位行十二”并补左侧小标（N1）。
// r6：f18 堆文件四格（补回行 23·北京）；f23 角落标“延伸 · 原文之外”+ 半句“选哪种，是实现上的取舍”；
// f24a–d 索引行改用走查数据（行 7/12/19），f24a 回扣 f14 第一种可能；f24g/f24g2 补“主键索引”框、两根箭头、计数器改 2 跳；
// f25b 覆盖索引改例为订单表同一张表的两列（订单号、金额），f25c 对应改查姓名、回堆文件行 12。
// r5：f18/f19 明说“大”是占的地方；f24e 加“换个假设”标签；f24f 后加 f24g–f24g2，搬完后查一遍
// （二级索引得主键，再查主键索引，一跳到新页）；f25b 给具体查询例子（查 42 的姓名和城市），f25c
// 列不在索引里回堆文件；r5 补修：f25c 标签 missLab 从箭头正中移到箭头右侧（[330, 132]），红箭头不再穿字（QA crossed error）。
// 要的列不在索引里（订单金额）时回堆文件取行。
// 分镜：skill-ch03/beats-u6.md；原文：DDIA §3.6 前半（书页 p86–87，PDF p108–109）。
// 时长全部来自 timeline/u6.json（beat() 驱动），不手写 waitFor。
import {Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, chain, createRef} from '@motion-canvas/core';
import {at, makeBeats} from '../../lib/beats';
import {FONT, SAFE, SIZE, T} from '../../lib/theme';
import {Counter, tag} from '../../lib/schemas';
import timeline from '../../timeline/u6.json';

export default makeScene2D(function* (view) {
  view.fill(T.bg);
  const beat = makeBeats(timeline);

  const header = createRef<Txt>();
  const anchor = createRef<Txt>();
  const say = (text: string) => anchor().text(text);

  // 跳数计数器：索引 → 堆文件 = 2 跳，聚集索引 = 1 跳（跨页共用，挂在 view 下）
  const hopCounter = new Counter([470, -270], '跳数 ', ' 跳');
  const hopRule = createRef<Txt>(); // r8：一跳 = 查一个地方（跨页共用，挂在 view 下）

  // ---- 第 1 页：值是行还是引用、堆文件、只存一份（f14–f17）----
  const pD = createRef<Node>();
  const idxCard = createRef<Rect>();
  const optRow = createRef<Rect>();
  const optRef = createRef<Rect>();
  const heapBox = createRef<Rect>();
  const heapRows = [0, 1, 2, 3].map(() => createRef<Txt>());
  const heapArrow = createRef<Line>();
  const idxA = createRef<Rect>();
  const idxB = createRef<Rect>();
  const arrowA = createRef<Line>();
  const arrowB = createRef<Line>();
  const onceLab = createRef<Txt>();
  const sameRowLab = createRef<Txt>();

  // ---- 第 2 页：堆文件搬家（f18–f23）----
  const pE = createRef<Node>();
  const heap2 = createRef<Rect>();
  const heapTitle = createRef<Txt>(); // r8：订单表/收货表 · 堆文件
  const slot1 = createRef<Rect>();
  const slot1Title = createRef<Txt>(); // r8：……→ 行 19
  const cityOld = createRef<Txt>();
  const emptyLab = createRef<Txt>();
  const emptyNote = createRef<Txt>(); // r8 f22：空槽以后写新行时再用
  const midSlot = createRef<Rect>();
  const midTitle = createRef<Txt>(); // r8：行 7 → ……
  const amtOld = createRef<Txt>();
  const amtNew = createRef<Txt>();
  const slot3 = createRef<Rect>(); // r8：17 · 96 → ……
  const slot3Title = createRef<Txt>();
  const slot4 = createRef<Rect>(); // r8：23 · 210 → 行 23 · 北京
  const slot4Title = createRef<Txt>();
  const keyLab = createRef<Txt>(); // r8 f19：键：user_id
  const valLab = createRef<Txt>(); // r8 f19：值：行，金额是行里的一格
  const bigChip = createRef<Rect>();
  const tailSlot = createRef<Rect>();
  const moveArrow = createRef<Line>();
  const optUpdate = createRef<Rect>();
  const optFwd = createRef<Rect>();
  const keyChgLab = createRef<Txt>(); // r8 f22：城市索引的键改了
  const idLab = createRef<Txt>(); // r9 f22：行号不变，变的是位置
  const costLab1 = createRef<Txt>(); // r8 f22：写时多花功夫，读仍快
  const newKeyLab = createRef<Txt>(); // r8 f23：旧键上海仍指旧槽；r9：旧键上海删掉，新键指旧槽
  const costLab2 = createRef<Txt>(); // r8 f23：写时便宜，每次读多一跳
  const fwdChip = createRef<Rect>();
  const choiceTag = tag([-480, -275], '延伸 · 原文之外', [0, 0]);
  const fwdLine = createRef<Line>();
  const idxTxt1 = createRef<Txt>();
  const idxTxt2 = createRef<Txt>();

  // ---- 第 3 页：聚集索引（f24a–f24d）----
  const pF = createRef<Node>();
  const clusIdx = createRef<Rect>();
  const clusRows = [0, 1, 2].map(() => createRef<Txt>());
  const heapMini = createRef<Rect>();
  const hopArrow = createRef<Line>();
  const innoCard = createRef<Rect>();
  const innoLab = createRef<Txt>();
  const secChip = createRef<Rect>();
  const secArrow = createRef<Line>();
  const sqlCard = createRef<Rect>();
  const sqlNoteLab = createRef<Txt>(); // r8 f24d2：不一定是主键
  const heapTxt = createRef<Txt>();
  const heapStrike = createRef<Line>();

  // ---- 第 3 页后半：聚集索引改大值走查（f24e–f24g2，新页）----
  const pF2 = createRef<Node>();
  const leafPage = createRef<Rect>();
  const leafRow7 = createRef<Txt>();
  const leafRow12 = createRef<Txt>();
  const leafRow19 = createRef<Txt>();
  const pageL = createRef<Rect>();
  const pageR = createRef<Rect>();
  const oldPageLab = createRef<Txt>(); // r8 f24f：旧页
  const newPageLab = createRef<Txt>(); // r8 f24f：新页
  const newVal = createRef<Rect>();
  const secChip2 = createRef<Rect>();
  const secArrow2 = createRef<Line>();
  const pkIdx = createRef<Rect>();
  const pkArrowA = createRef<Line>();
  const pkArrowB = createRef<Line>();
  const noChangeLab = createRef<Txt>();
  const preHopLab = createRef<Txt>(); // r10 f24g2：搬家前也是 2 跳
  const hypLab = createRef<Txt>();
  const qChip2 = createRef<Rect>();
  const qArrow2 = createRef<Line>();
  const pkLab = createRef<Txt>();

  // ---- 第 4 页：覆盖索引（f25a–f25c）----
  const pG = createRef<Node>();
  const coverIdx = createRef<Rect>();
  const userIdx = createRef<Rect>(); // r8 f25c：用户表 · 索引：user_id
  const extraHl = createRef<Rect>();
  const queryChip = createRef<Rect>();
  const queryChipTxt = createRef<Txt>();
  const queryArrow = createRef<Line>();
  const answerLab = createRef<Txt>();
  const missArrow = createRef<Line>();
  const heapCard2 = createRef<Rect>();
  const missLab = createRef<Txt>();
  const userStepLab = createRef<Txt>(); // r7 N1：f25c 左侧小标“先由用户表定位行 12”

  view.add(
    <>
      <Txt
        ref={header}
        position={[-SAFE.halfW, -SAFE.halfH]}
        offset={[-1, -1]}
        fontSize={SIZE.label}
        fill={T.muted}
        fontFamily={FONT.sans}
        text={'不止主键：二级索引与聚集索引'}
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
      {hopCounter.node}
      <Txt ref={hopRule} position={[470, -232]} fontSize={SIZE.min} fill={T.muted} fontFamily={FONT.sans} text={'一跳 = 查一个地方'} opacity={0} />

      {/* 第 1 页 */}
      <Node ref={pD} opacity={0}>
        <Rect ref={idxCard} position={[-350, -140]} width={400} height={110} radius={16} fill={T.card} stroke={T.blue} lineWidth={3}>
          <Txt position={[0, -25]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'索引'} />
          <Txt position={[0, 25]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.mono} text={'键 → 值'} />
        </Rect>
        <Rect ref={optRow} position={[-350, 10]} width={400} height={64} radius={14} fill={T.card} stroke={T.line} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'值是整行'} />
        </Rect>
        <Rect ref={optRef} position={[-350, 100]} width={400} height={64} radius={14} fill={T.card} stroke={T.line} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'值是引用 →'} />
        </Rect>
        <Rect ref={heapBox} position={[300, -60]} width={460} height={260} radius={16} fill={T.card} stroke={T.line} lineWidth={2} opacity={0}>
          <Txt position={[0, -100]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'收货表 · 堆文件'} />
        </Rect>
        <Txt ref={heapRows[0]} position={[300, -120]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'行 19 · 上海'} opacity={0} />
        <Txt ref={heapRows[1]} position={[300, -85]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'行 23 · 北京'} opacity={0} />
        <Txt ref={heapRows[2]} position={[300, -50]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.mono} text={'……'} opacity={0} />
        <Txt ref={heapRows[3]} position={[300, -15]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'行 23 · 北京'} opacity={0} />
        <Line ref={heapArrow} points={[[-140, -100], [60, -100]]} stroke={T.yellow} lineWidth={3} endArrow opacity={0} />
        <Rect ref={idxA} position={[-350, -160]} width={400} height={80} radius={16} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'索引一：按 user_id'} />
        </Rect>
        <Rect ref={idxB} position={[-350, -40]} width={400} height={80} radius={16} fill={T.card} stroke={T.purple} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'索引二：按城市'} />
        </Rect>
        <Line ref={arrowA} points={[[-140, -160], [60, -120]]} stroke={T.blue} lineWidth={3} endArrow opacity={0} />
        <Line ref={arrowB} points={[[-140, -40], [60, -120]]} stroke={T.purple} lineWidth={3} endArrow opacity={0} />
        <Txt ref={onceLab} position={[0, 235]} fontSize={SIZE.body} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'数据只存一份'} opacity={0} />
        <Txt ref={sameRowLab} position={[300, 30]} fontSize={SIZE.label} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'同一张表的堆文件'} opacity={0} />
      </Node>

      {/* 第 2 页 */}
      <Node ref={pE} opacity={0}>
        <Rect ref={heap2} position={[0, -130]} width={1000} height={180} radius={16} fill={T.card} stroke={T.line} lineWidth={2}>
          <Txt ref={heapTitle} position={[-400, -70]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'订单表 · 堆文件'} />
        </Rect>
        <Rect ref={slot1} position={[-375, -130]} width={220} height={100} radius={14} fill={T.card} stroke={T.line} lineWidth={2}>
          <Txt ref={slot1Title} position={[0, -22]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.mono} text={'……'} />
        </Rect>
        <Txt ref={cityOld} position={[-375, -115]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'上海'} opacity={0} />
        <Txt ref={emptyLab} position={[-375, -115]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.mono} text={'已搬空'} opacity={0} />
        <Txt ref={emptyNote} position={[-375, -55]} fontSize={SIZE.min} fill={T.muted} fontFamily={FONT.mono} text={'空槽：以后写新行时再用'} opacity={0} />
        <Rect ref={midSlot} position={[-125, -130]} width={220} height={100} radius={14} fill={T.card} stroke={T.line} lineWidth={2}>
          <Txt ref={midTitle} position={[0, -22]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.mono} text={'行 7'} />
        </Rect>
        <Txt ref={amtOld} position={[-125, -115]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'128'} />
        <Txt ref={amtNew} position={[-125, -115]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.mono} text={'28'} opacity={0} />
        <Rect ref={slot3} position={[125, -130]} width={220} height={100} radius={14} fill={T.card} stroke={T.line} lineWidth={2}>
          <Txt ref={slot3Title} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'17 · 96'} />
        </Rect>
        <Rect ref={slot4} position={[375, -130]} width={220} height={100} radius={14} fill={T.card} stroke={T.line} lineWidth={2}>
          <Txt ref={slot4Title} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'23 · 210'} />
        </Rect>
        <Txt ref={keyLab} position={[-125, 5]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.mono} text={'键：user_id'} opacity={0} />
        <Txt ref={valLab} position={[-125, 40]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.mono} text={'值：行，金额是行里的一格'} opacity={0} />
        {choiceTag}
        <Rect ref={bigChip} position={[-375, 60]} width={380} height={70} radius={14} fill={T.card} stroke={T.red} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.red} fontFamily={FONT.sans} text={'新值：上海市浦东新区张江'} />
        </Rect>
        <Rect ref={tailSlot} position={[0, 130]} width={420} height={80} radius={14} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt position={[0, -14]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.mono} text={'行 19 · 上海市浦东新区张江'} />
          <Txt position={[0, 16]} fontSize={SIZE.min} fill={T.green} fontFamily={FONT.sans} text={'堆尾的新槽'} />
        </Rect>
        <Txt ref={idxTxt1} position={[380, 100]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} text={'user_id 索引 → 行 19（新槽）'} opacity={0} />
        <Txt ref={idxTxt2} position={[380, 155]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} text={'城市索引 → 行 19（新槽）'} opacity={0} />
        <Txt ref={keyChgLab} position={[380, 55]} fontSize={SIZE.min} fill={T.yellow} fontFamily={FONT.sans} text={'城市索引的键：上海 → 上海市浦东新区张江'} opacity={0} />
        <Txt ref={idLab} position={[380, 10]} fontSize={SIZE.min} fill={T.yellow} fontFamily={FONT.sans} text={'行号不变，变的是位置'} opacity={0} />
        <Txt ref={costLab1} position={[-300, 262]} fontSize={SIZE.min} fill={T.muted} fontFamily={FONT.sans} text={'写时多花功夫，读仍快'} opacity={0} />
        <Txt ref={newKeyLab} position={[380, 10]} fontSize={SIZE.min} fill={T.yellow} fontFamily={FONT.sans} text={'旧键上海删掉，新键指旧槽'} opacity={0} />
        <Txt ref={costLab2} position={[300, 262]} fontSize={SIZE.min} fill={T.muted} fontFamily={FONT.sans} text={'写时便宜，每次读多一跳'} opacity={0} />
        <Line ref={moveArrow} points={[[-375, -80], [-375, 130], [-160, 130]]} stroke={T.yellow} lineWidth={3} endArrow opacity={0} />
        <Rect ref={optUpdate} position={[-300, 215]} width={440} height={60} radius={14} fill={T.card} stroke={T.line} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'更新所有索引'} />
        </Rect>
        <Rect ref={optFwd} position={[300, 215]} width={440} height={60} radius={14} fill={T.card} stroke={T.line} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'旧位置留转发指针'} />
        </Rect>
        <Rect ref={fwdChip} position={[-375, 20]} width={260} height={70} radius={14} fill={T.card} stroke={T.yellow} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.sans} text={'转发指针 → 新槽'} />
        </Rect>
        <Line ref={fwdLine} points={[[-375, 55], [-170, 130]]} stroke={T.yellow} lineWidth={3} endArrow opacity={0} />
      </Node>

      {/* 第 3 页 */}
      <Node ref={pF} opacity={0}>
        <Rect ref={clusIdx} position={[0, -120]} width={800} height={200} radius={16} fill={T.card} stroke={T.blue} lineWidth={3}>
          <Txt position={[0, -70]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'索引'} />
        </Rect>
        <Txt ref={clusRows[0]} position={[0, -150]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'行 7 · 订单 128'} opacity={0} />
        <Txt ref={clusRows[1]} position={[0, -110]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'行 12 · 张伟'} opacity={0} />
        <Txt ref={clusRows[2]} position={[0, -70]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'行 19 · 上海'} opacity={0} />
        <Rect ref={heapMini} position={[350, 60]} width={300} height={80} radius={14} fill={T.card} stroke={T.line} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'堆文件'} />
        </Rect>
        <Line ref={hopArrow} points={[[0, -20], [350, 20]]} stroke={T.red} lineWidth={3} endArrow opacity={0} />
        <Rect ref={innoCard} position={[-280, 110]} width={420} height={80} radius={16} fill={T.card} stroke={T.purple} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.purple} fontFamily={FONT.mono} text={'InnoDB'} />
        </Rect>
        <Txt ref={innoLab} position={[-280, 175]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'主键总是聚集索引'} opacity={0} />
        <Rect ref={secChip} position={[280, 110]} width={420} height={80} radius={16} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'二级索引记主键（InnoDB）'} />
        </Rect>
        <Line ref={secArrow} points={[[70, 110], [70, -20], [0, -20]]} stroke={T.blue} lineWidth={3} endArrow opacity={0} />
        <Rect ref={sqlCard} position={[280, 200]} width={420} height={60} radius={14} fill={T.card} stroke={T.line} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'SQL Server：每表一个'} />
        </Rect>
        <Txt ref={sqlNoteLab} position={[280, 245]} fontSize={SIZE.min} fill={T.yellow} fontFamily={FONT.sans} text={'不一定是主键'} opacity={0} />
        <Txt ref={heapTxt} position={[-280, 240]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'堆文件位置'} opacity={0} />
        <Line key={'qa-ignore-堆文件位置划掉'} ref={heapStrike} points={[[-400, 240], [-160, 240]]} stroke={T.red} lineWidth={3} opacity={0} />
      </Node>

      {/* 第 3 页后半：聚集索引改大值走查 */}
      <Node ref={pF2} opacity={0}>
        <Rect ref={leafPage} position={[0, -120]} width={800} height={200} radius={16} fill={T.card} stroke={T.blue} lineWidth={3}>
          <Txt position={[0, -70]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'索引叶页'} />
        </Rect>
        <Rect ref={pageL} position={[-210, -120]} width={380} height={200} radius={16} fill={T.card} stroke={T.blue} lineWidth={3} opacity={0} />
        <Rect ref={pageR} position={[210, -120]} width={380} height={200} radius={16} fill={T.card} stroke={T.blue} lineWidth={3} opacity={0} />
        <Txt ref={oldPageLab} position={[-210, -195]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'旧页'} opacity={0} />
        <Txt ref={newPageLab} position={[210, -195]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} text={'新页'} opacity={0} />
        <Txt ref={leafRow7} position={[0, -150]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'行 7 · 订单 128'} opacity={0} />
        <Txt ref={leafRow12} position={[0, -110]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'行 12 · 张伟'} opacity={0} />
        <Txt ref={leafRow19} position={[0, -70]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'行 19 · 上海'} opacity={0} />
        <Rect ref={newVal} position={[0, 20]} width={560} height={70} radius={14} fill={T.card} stroke={T.red} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.red} fontFamily={FONT.sans} text={'新值：上海市浦东新区张江'} />
        </Rect>
        <Rect ref={secChip2} position={[280, 135]} width={420} height={80} radius={16} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'二级索引记主键（InnoDB）'} />
        </Rect>
        <Line ref={secArrow2} points={[[280, 95], [230, -20]]} stroke={T.blue} lineWidth={3} endArrow opacity={0} />
        <Rect ref={pkIdx} position={[250, 30]} width={300} height={56} radius={14} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'主键索引'} />
        </Rect>
        <Line ref={pkArrowA} points={[[280, 95], [280, 58]]} stroke={T.blue} lineWidth={3} endArrow opacity={0} />
        <Line ref={pkArrowB} points={[[250, 2], [230, -20]]} stroke={T.blue} lineWidth={3} endArrow opacity={0} />
        <Txt ref={noChangeLab} position={[280, 205]} fontSize={SIZE.label} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'行搬了家，不用改'} opacity={0} />
        <Txt ref={preHopLab} position={[-280, 205]} fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.sans} text={'搬家前也是 2 跳'} opacity={0} />
        <Txt ref={hypLab} position={[0, -245]} fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.sans} text={'换个假设：同一行，住进聚集索引'} opacity={0} />
        <Rect ref={qChip2} position={[-280, 110]} width={420} height={80} radius={16} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} textWrap maxWidth={380} text={'查：城市 = 上海市浦东新区张江'} />
        </Rect>
        <Line ref={qArrow2} points={[[-70, 110], [70, 110]]} stroke={T.blue} lineWidth={3} endArrow opacity={0} />
        <Txt ref={pkLab} position={[450, 30]} fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.sans} text={'主键'} opacity={0} />
      </Node>

      {/* 第 4 页 */}
      <Node ref={pG} opacity={0}>
        <Rect ref={coverIdx} position={[0, -140]} width={760} height={170} radius={16} fill={T.card} stroke={T.blue} lineWidth={3}>
          <Txt position={[0, -55]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'订单表 · 索引：user_id'} />
          <Txt position={[-200, -5]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.mono} text={'键：user_id'} />
          <Txt position={[130, -5]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.mono} text={'值里多带：订单号 · 金额'} />
        </Rect>
        <Rect ref={userIdx} position={[0, -140]} width={760} height={170} radius={16} fill={T.card} stroke={T.blue} lineWidth={3} opacity={0}>
          <Txt position={[0, -55]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'用户表 · 索引：user_id'} />
          <Txt position={[0, -5]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.mono} text={'键：user_id'} />
        </Rect>
        <Rect ref={extraHl} position={[130, -135]} width={340} height={60} radius={10} stroke={T.yellow} lineWidth={3} opacity={0} />
        <Rect ref={queryChip} position={[0, 60]} width={560} height={70} radius={14} fill={T.card} stroke={T.line} lineWidth={2} opacity={0}>
          <Txt ref={queryChipTxt} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'查 42 的订单号和金额'} />
        </Rect>
        <Line ref={queryArrow} points={[[0, 25], [0, -55]]} stroke={T.green} lineWidth={3} endArrow opacity={0} />
        <Txt ref={answerLab} position={[0, 150]} fontSize={SIZE.body} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'答案直接出来'} opacity={0} />
        <Line ref={missArrow} points={[[0, 95], [0, 170]]} stroke={T.red} lineWidth={3} endArrow opacity={0} />
        <Txt ref={missLab} position={[330, 132]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'这列不在索引里，回堆文件取行'} opacity={0} />
        <Txt ref={userStepLab} position={[-330, 132]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'先由用户表的 user_id 索引定位行 12'} opacity={0} />
        <Rect ref={heapCard2} position={[0, 210]} width={560} height={60} radius={14} fill={T.card} stroke={T.line} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'用户表堆文件：行 12 · 张伟'} />
        </Rect>
      </Node>
    </>
  );

  say('值是行，还是引用？');
  yield* beat('f14',
    all(pD().opacity(1, 0.5)),
    at('查询要找的东西', chain(idxCard().scale(1.04, 0.15), idxCard().scale(1, 0.25))),
    at('要么是行本身', all(optRow().opacity(1, 0.5), optRow().stroke(T.green, 0.4))),
    at('行的引用', all(optRef().opacity(1, 0.5), optRef().stroke(T.yellow, 0.4))),
    at('就是这里说的引用', chain(optRef().scale(1.05, 0.15), optRef().scale(1, 0.25))),
  );

  say('行住在堆文件里');
  yield* beat('f15',
    at('堆文件', chain(heapBox().opacity(1, 0.5), heapRows[0]().opacity(1, 0.4), heapRows[1]().opacity(1, 0.4), heapRows[2]().opacity(1, 0.4))),
    at('没有特定顺序', all(heapArrow().opacity(1, 0.5), heapBox().stroke(T.yellow, 0.4), hopCounter.node.opacity(1, 0.4), hopRule().opacity(1, 0.4), chain(hopCounter.bump(), hopCounter.bump()))),
  );

  say('数据只存一份');
  yield* beat('f16',
    all(optRow().opacity(0, 0.4), optRef().opacity(0, 0.4)),
    at('避免了重复数据', all(idxCard().opacity(0, 0.5), heapArrow().opacity(0, 0.5), idxA().opacity(1, 0.5), idxB().opacity(1, 0.5), arrowA().opacity(1, 0.4), arrowB().opacity(1, 0.4))),
    at('只存一份', chain(onceLab().opacity(1, 0.5), heapBox().stroke(T.green, 0.5))),
    at('指向堆文件的位置', all(arrowA().stroke(T.yellow, 0.4), arrowB().stroke(T.yellow, 0.4))),
    at('每张表各有自己的堆文件', chain(heapBox().scale(1.03, 0.15), heapBox().scale(1, 0.25))),
  );

  say('两个索引指同一张表的堆文件');
  yield* beat('f17',
    at('按用户编号', chain(arrowA().stroke(T.yellow, 0.4), heapRows[0]().fill(T.yellow, 0.4))),
    at('按城市', chain(arrowB().stroke(T.yellow, 0.4), heapRows[0]().fill(T.yellow, 0.4))),
    at('同一张表的堆文件', sameRowLab().opacity(1, 0.5)),
  );

  say('占地不大，原地覆盖');
  yield* beat('f18',
    all(pD().opacity(0, 0.5), pE().opacity(1, 0.5), hopCounter.node.opacity(0, 0.4), hopRule().opacity(0, 0.4)),
    at('只改值', midSlot().stroke(T.yellow, 0.5)),
    at('不比旧值大', chain(midSlot().scale(1.05, 0.15), midSlot().scale(1, 0.25))),
    at('原地覆盖', amtOld().fill(T.yellow, 0.4)),
  );

  say('新值占地更小，直接盖住');
  yield* beat('f19',
    all(chain(midSlot().scale(1.03, 0.15), midSlot().scale(1, 0.25))),
    at('行七的金额', all(keyLab().opacity(1, 0.5), valLab().opacity(1, 0.5))),
    at('占的地方更小', chain(chain(amtOld().opacity(0, 0.4), amtNew().opacity(1, 0.4)), chain(midSlot().scale(1.05, 0.15), midSlot().scale(1, 0.25)))),
    at('原位置盖住旧值', midSlot().stroke(T.green, 0.4)),
  );

  say('变大了，得搬家');
  yield* beat('f20',
    at('换一行', all(
      heapTitle().text('收货表 · 堆文件', 0), slot1Title().text('行 19', 0), cityOld().opacity(1, 0.4),
      midTitle().text('……', 0), amtOld().opacity(0, 0.4), amtNew().opacity(0, 0.4),
      slot3Title().text('……', 0), slot4Title().text('行 23 · 北京', 0),
      keyLab().opacity(0, 0.4), valLab().opacity(0, 0.4), midSlot().stroke(T.line, 0.4),
    )),
    at('更大', bigChip().opacity(1, 0.5)),
    at('新位置', chain(slot1().stroke(T.red, 0.4), bigChip().stroke(T.red, 0.4), cityOld().fill(T.red, 0.4))),
  );

  say('整行搬到新槽里');
  yield* beat('f21',
    all(cityOld().opacity(0, 0.4)),
    at('堆文件尾', chain(
      moveArrow().opacity(1, 0.3),
      bigChip().position([0, 130], 1.2),
      all(tailSlot().opacity(1, 0.4), bigChip().opacity(0, 0.4)),
    )),
    at('行还是行十九', chain(tailSlot().scale(1.05, 0.15), tailSlot().scale(1, 0.25))),
  );

  say('更新所有索引');
  yield* beat('f22',
    at('更新所有索引', all(optUpdate().opacity(1, 0.5), optUpdate().stroke(T.yellow, 0.4), idxTxt1().opacity(1, 0.4), idxTxt2().opacity(1, 0.4), emptyLab().opacity(1, 0.4))),
    at('新位置', tailSlot().stroke(T.yellow, 0.4)),
    at('行号没变', idLab().opacity(1, 0.5)),
    at('键也得改', keyChgLab().opacity(1, 0.5)),
    at('写时多花功夫', costLab1().opacity(1, 0.5)),
    at('空出来的旧槽', all(emptyNote().opacity(1, 0.5), moveArrow().opacity(0, 0.4))),
  );

  say('旧位置留转发指针');
  yield* beat('f23',
    all(moveArrow().opacity(0, 0.4), optUpdate().stroke(T.line, 0.4), emptyNote().opacity(0, 0.4), costLab1().opacity(0, 0.4), idLab().opacity(0, 0.4)),
    at('转发', all(optFwd().opacity(1, 0.5), optFwd().stroke(T.yellow, 0.4), fwdChip().opacity(1, 0.5), fwdLine().opacity(1, 0.5), idxTxt1().text('user_id 索引 → 行 19（旧槽）', 0), idxTxt2().text('城市索引 → 行 19（旧槽）', 0), emptyLab().opacity(0, 0.4))),
    at('新家', fwdChip().position([-375, 10], 0.8)),
    at('每次多一跳', costLab2().opacity(1, 0.5)),
  );

  say('旧键删掉，新键指旧槽');
  yield* beat('f23b',
    at('旧键上海得删掉', newKeyLab().opacity(1, 0.5)),
    at('按上海查', chain(newKeyLab().scale(1.05, 0.15), newKeyLab().scale(1, 0.25))),
    at('新键指到旧槽', chain(idxTxt2().scale(1.05, 0.15), idxTxt2().scale(1, 0.25))),
    at('经旧槽再走一跳', chain(fwdChip().scale(1.05, 0.15), fwdChip().scale(1, 0.25))),
    at('也一样', chain(idxTxt1().scale(1.05, 0.15), idxTxt1().scale(1, 0.25))),
    at('多走一跳', chain(fwdChip().scale(1.05, 0.15), fwdChip().scale(1, 0.25))),
    at('实现上的取舍', choiceTag.opacity(1, 0.5)),
  );

  say('行就住在索引里');
  yield* beat('f24a',
    all(pE().opacity(0, 0.5), pF().opacity(1, 0.5), hopCounter.node.opacity(1, 0.4), hopRule().opacity(1, 0.4)),
    at('多跳一次', chain(heapMini().opacity(1, 0.5), hopArrow().opacity(1, 0.5))),
    at('跳两次', heapMini().stroke(T.yellow, 0.4)),
    at('先查索引', chain(hopArrow().stroke(T.yellow, 0.4))),
    at('再跳到堆文件', chain(heapMini().scale(1.05, 0.15), heapMini().scale(1, 0.25))),
    at('聚集索引', all(
      all(heapMini().opacity(0, 0.5), hopArrow().opacity(0, 0.5)),
      all(clusRows[0]().opacity(1, 0.4), clusRows[1]().opacity(1, 0.4), clusRows[2]().opacity(1, 0.4), clusIdx().stroke(T.green, 0.5)),
      chain(hopCounter.reset(0.3), hopCounter.bump()),
    )),
    at('第一种可能', chain(clusIdx().scale(1.05, 0.2), clusIdx().scale(1, 0.3))),
    at('拼在一起', chain(clusIdx().scale(1.05, 0.2), clusIdx().scale(1, 0.3))),
  );

  say('InnoDB：主键聚集');
  yield* beat('f24b',
    at('InnoDB', innoCard().opacity(1, 0.5)),
    at('聚集索引', innoLab().opacity(1, 0.5)),
  );

  say('二级索引记主键');
  yield* beat('f24c',
    at('二级索引', chain(secChip().opacity(1, 0.5), secArrow().opacity(1, 0.5))),
    at('主键', secChip().stroke(T.yellow, 0.4)),
    at('而不是', all(heapTxt().opacity(1, 0.5), heapStrike().opacity(1, 0.5))),
    at('记位置的索引', chain(secChip().scale(1.05, 0.15), secChip().scale(1, 0.25))),
  );

  say('每表指定一个');
  yield* beat('f24d',
    at('SQL Server', sqlCard().opacity(1, 0.5)),
    at('指定一个', sqlCard().stroke(T.yellow, 0.4)),
  );

  say('不一定是主键');
  yield* beat('f24d2',
    at('指定的聚集索引', chain(sqlCard().scale(1.04, 0.15), sqlCard().scale(1, 0.25))),
    at('也可以不是主键', sqlNoteLab().opacity(1, 0.5)),
    at('那时二级索引', chain(sqlCard().scale(1.04, 0.15), sqlCard().scale(1, 0.25))),
    at('聚集键变了', chain(sqlNoteLab().scale(1.05, 0.15), sqlNoteLab().scale(1, 0.25))),
  );

  say('聚集索引里改大值');
  yield* beat('f24e',
    all(pF().opacity(0, 0.5), pF2().opacity(1, 0.5), chain(leafRow7().opacity(1, 0.4), leafRow12().opacity(1, 0.4), leafRow19().opacity(1, 0.4))),
    at('换个假设', chain(hypLab().opacity(1, 0.5), leafRow19().fill(T.yellow, 0.4))),
    at('行十九的城市', newVal().opacity(1, 0.5)),
    at('从上海', chain(newVal().scale(1.06, 0.15), newVal().scale(1, 0.25))),
    at('浦东新区', chain(newVal().scale(1.06, 0.15), newVal().scale(1, 0.25))),
    at('装不下', all(leafPage().stroke(T.red, 0.4), leafRow19().fill(T.red, 0.4))),
  );

  say('页裂开，二级索引不用改');
  yield* beat('f24f',
    at('挪位置', leafRow19().position([0, -30], 0.8)),
    at('裂成两半', all(
      leafPage().opacity(0, 0.4), pageL().opacity(1, 0.4), pageR().opacity(1, 0.4),
      oldPageLab().opacity(1, 0.4), newPageLab().opacity(1, 0.4),
      leafRow7().position([-210, -150], 0.9), leafRow12().position([-210, -110], 0.9),
      chain(leafRow19().text('行 19 · 上海市浦东新区张江', 0), leafRow19().position([210, -70], 1.2)),
      newVal().opacity(0, 0.4),
    )),
    at('二级索引', chain(secChip2().opacity(1, 0.5), secArrow2().opacity(1, 0.5))),
    at('不用改', noChangeLab().opacity(1, 0.5)),
    at('只是代号', chain(noChangeLab().scale(1.05, 0.15), noChangeLab().scale(1, 0.25))),
  );

  say('搬完后怎么找？');
  yield* beat('f24g',
    at('先查二级索引', all(qChip2().opacity(1, 0.5), qArrow2().opacity(1, 0.5), secChip2().stroke(T.yellow, 0.4), secArrow2().opacity(0, 0.4))),
    at('拿到主键', all(pkLab().opacity(1, 0.5), pkIdx().opacity(1, 0.5), pkArrowA().opacity(1, 0.4))),
  );

  say('搬完后怎么找？');
  yield* beat('f24g2',
    at('再查主键索引', chain(pkIdx().stroke(T.yellow, 0.4), all(pkArrowB().opacity(1, 0.4), pkArrowB().stroke(T.yellow, 0.4)))),
    at('第二跳就到新页', chain(pageR().stroke(T.green, 0.4), hopCounter.bump())),
    at('搬家前也是两跳', preHopLab().opacity(1, 0.5)),
  );

  say('索引里多带几列');
  yield* beat('f25a',
    all(pF().opacity(0, 0.5), pF2().opacity(0, 0.5), pG().opacity(1, 0.5), hopCounter.node.opacity(0, 0.4), hopRule().opacity(0, 0.4), preHopLab().opacity(0, 0.4)),
    at('覆盖索引', extraHl().opacity(1, 0.5)),
    at('多带几列', extraHl().stroke(T.green, 0.4)),
  );

  say('索引覆盖了查询');
  yield* beat('f25b',
    at('订单号和金额', queryChip().opacity(1, 0.5)),
    at('索引里都有', chain(queryArrow().opacity(1, 0.5), extraHl().stroke(T.yellow, 0.4))),
    at('只用索引', answerLab().opacity(1, 0.5)),
    at('索引覆盖了这个查询', chain(answerLab().scale(1.1, 0.15), answerLab().scale(1, 0.25))),
  );

  say('列不在索引里，回堆文件');
  yield* beat('f25c',
    all(answerLab().opacity(0, 0.4), queryArrow().opacity(0, 0.4), coverIdx().opacity(0, 0.4), extraHl().opacity(0, 0.4), userIdx().opacity(1, 0.5)),
    at('不在索引里', all(queryChipTxt().text('查 42 的姓名', 0), missLab().opacity(1, 0.5))),
    at('姓名', queryChip().stroke(T.red, 0.4)),
    at('先由用户表的索引定位行十二', userStepLab().opacity(1, 0.5)),
    at('跳回堆文件', all(missArrow().opacity(1, 0.5), heapCard2().opacity(1, 0.5))),
    at('取行', heapCard2().stroke(T.green, 0.4)),
  );
});
