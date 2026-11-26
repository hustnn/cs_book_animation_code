// U6 场景 1（MC，r5）：f0–f13b —— f0 单元站牌（UnitTitle：第 6 站），f1 钩子、主键唯一标识一行、二级索引（user_id = 42 在三张表里）、
// 键不唯一两种解法（值变行标识符列表 / 键后追加行标识符）、全文索引回扣。
// r10：f6b 值框只留行号、行内容移出卡外（valNote“行 7 的内容”）+ 两级映射“键 → 行号 → 槽”（mapLab）、
// f9 加“对比：旧解法”标签（oldLab）；f5/f6b/f7/f9b 旁白见 beats-u6.md。
// r9：f5 旁白与画面都不再提“命令”（卡片“一次建两个索引”、小标“每张表各建一次”）、f6b 加“变的是它住哪——索引里记的位置”+ defNote 脉冲、
// f7 一次问三张表各给行号、f9b 解法二的值就是行本身；f33 拆拍不涉及本场景。
// r8：f5 姓名索引用途、f6b 行号定义句、f8 表名标、f9b 三索引各扫一次、f10 两板图标+站别回扣、
// f11“就是这一个值”回扣、f13b“……一共几十篇”；f24d 拆拍不涉及本场景。
// r7：f6a 加“姓名索引同理”小标（N3）。
// r6：f5 用户表一条命令建两个索引（user_id · 姓名）+ 小标“每张表各一条命令”，其余两表命令卡写明建 user_id 索引；
// f9b 开场淡出上方解法一三键框；f11 小标改“键 → 值，同一套结构不用换”+ 半句为什么。
// r5：f5 每张表各画一次建索引命令（三张命令卡，各连自家表）；f6a/f6b 画三个分开的键框（各管各的表，
// 各自的值是单元素列表）；f9 后加 f9b，按“42”开头扫出三把键的值；f13 箭头分叉到三张文档卡，f13b 讲
// 为什么不用第二种解法（一个词挂很多文档，追加键得每篇文档一把，列表一把键就够）。
// 分镜：skill-ch03/beats-u6.md；原文：DDIA §3.6 前半（书页 p85–86，PDF p107–108）。
// 本单元无原书图，画面均为按原文重新生成的示意图。
// 时长全部来自 timeline/u6.json（beat() 驱动），不手写 waitFor。
import {Circle, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, chain, createRef} from '@motion-canvas/core';
import {at, makeBeats} from '../../lib/beats';
import {UnitTitle} from '../../lib/opening';
import {CHAPTER} from '../../lib/chapter';
import {FONT, SAFE, SIZE, T} from '../../lib/theme';
import {Counter, KV} from '../../lib/schemas';
import timeline from '../../timeline/u6.json';

export default makeScene2D(function* (view) {
  view.fill(T.bg);
  const beat = makeBeats(timeline);

  const anchor = createRef<Txt>();
  const say = (text: string) => anchor().text(text);

  // ---- 第 1 页：订单表（f1–f2）----
  const pA = createRef<Node>();
  const pkHl = createRef<Rect>();
  const rowHl = createRef<Rect>();
  const qMark = createRef<Txt>();
  const refCard = createRef<Rect>();
  const refArrow = createRef<Line>();
  const key2 = createRef<Rect>();

  // ---- 第 2 页：三张表找同一用户 42（f4–f5）----
  const pB = createRef<Node>();
  const cmdChip1 = createRef<Rect>();
  const cmdChip2 = createRef<Rect>();
  const cmdChip3 = createRef<Rect>();
  const cmdSub2 = createRef<Txt>();
  const cmdNote = createRef<Txt>();
  const hlT1 = createRef<Rect>();
  const hlT2 = createRef<Rect>();
  const hlT3 = createRef<Rect>();
  const rowLab1 = createRef<Txt>();
  const rowLab2 = createRef<Txt>();
  const rowLab3 = createRef<Txt>();
  const link1 = createRef<Line>();
  const link2 = createRef<Line>();
  const link3 = createRef<Line>();

  // ---- 第 3 页：键不唯一两种解法（f6–f11），KV 数据块 + 计数器 ----
  const pC = createRef<Node>();
  const keyCardA = createRef<Rect>();
  const keyCardB = createRef<Rect>();
  const keyCardC = createRef<Rect>();
  const valCardA = createRef<Rect>();
  const valCardB = createRef<Rect>();
  const valCardC = createRef<Rect>();
  const scanChip = createRef<Rect>();
  const plateB = createRef<Rect>();
  const plateL = createRef<Rect>();
  const bothLab = createRef<Txt>();
  const valKV = [new KV('行 7', '订单 128', 'kv', {w: 220}), new KV('行 12', '张伟', 'kv', {w: 220}), new KV('行 19', '上海', 'kv', {w: 220})];
  const keyKV = [new KV('42#7', '', 'key', {w: 170}), new KV('42#12', '', 'key', {w: 170}), new KV('42#19', '', 'key', {w: 170})];
  const gotCounter = new Counter([430, 10], '查到 ', ' 行');
  const idxNote = createRef<Txt>();
  const nameIdxNote = createRef<Txt>(); // r7 N3：姓名索引同理（f6a 小标，f8 随 idxNote 淡出）
  const defNote = createRef<Txt>(); // r8 f6b：行号定义句
  const valNoteA = createRef<Txt>(); // r10 f6b：行内容移出值卡（行 7 的内容）
  const valNoteB = createRef<Txt>();
  const valNoteC = createRef<Txt>();
  const mapLab = createRef<Txt>(); // r10 f6b：两级映射“键 → 行号 → 槽”
  const oldLab = createRef<Txt>(); // r10 f9：“对比：旧解法”标签
  const idxLabA = createRef<Txt>(); // r8 f8：表名标
  const idxLabB = createRef<Txt>();
  const idxLabC = createRef<Txt>();
  const scanTxt = createRef<Txt>(); // r8 f9b：芯片文本
  const bIcon = createRef<Node>(); // r8 f10：B 树图标
  const lIcon = createRef<Node>(); // r8 f10：LSM 图标
  const bStationLab = createRef<Txt>(); // r8 f10：第四站讲过
  const lStationLab = createRef<Txt>(); // r8 f10：第三站讲过

  // ---- 第 4 页：全文索引回扣（f12–f13b）----
  const pD = createRef<Node>();
  const wordCard = createRef<Rect>();
  const docKV = [new KV('文档 3', '', 'key', {w: 190}), new KV('文档 8', '', 'key', {w: 190}), new KV('文档 15', '', 'key', {w: 190})];
  const docArrow1 = createRef<Line>();
  const docArrow2 = createRef<Line>();
  const docArrow3 = createRef<Line>();
  const docLab = createRef<Txt>();
  const altCard = createRef<Rect>();
  const altX = createRef<Txt>();
  const moreLab = createRef<Txt>(); // r8 f13b：几十篇数量感

  view.add(
    <>
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

      {/* 第 1 页 */}
      <Node ref={pA} opacity={0}>
        <Rect position={[0, -50]} width={780} height={230} radius={16} fill={T.card} stroke={T.line} lineWidth={2}>
          <Txt position={[0, -85]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'订单表'} />
          <Txt position={[-100, -45]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'订单号（主键）'} />
          <Txt position={[95, -45]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'用户   金额'} />
          <Txt position={[0, -5]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'1001   张伟   128'} />
          <Txt position={[0, 30]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'1002   李伟   96'} />
          <Txt position={[0, 65]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'1003   王敏   210'} />
        </Rect>
        <Rect ref={pkHl} position={[-100, -95]} width={170} height={44} radius={10} stroke={T.yellow} lineWidth={3} opacity={0} />
        <Rect ref={rowHl} position={[0, -55]} width={760} height={44} radius={10} stroke={T.yellow} lineWidth={3} opacity={0} />
        <Txt ref={qMark} position={[0, 150]} fontSize={72} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'?'} opacity={0} />
        <Rect ref={refCard} position={[0, 175]} width={380} height={64} radius={14} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'另一张表引用 1001'} />
        </Rect>
        <Line ref={refArrow} points={[[0, 140], [0, 70]]} stroke={T.blue} lineWidth={3} endArrow opacity={0} />
        <Rect ref={key2} position={[0, 175]} width={380} height={64} radius={14} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} text={'第二把钥匙：二级索引'} />
        </Rect>
      </Node>

      {/* 第 2 页：三张表 */}
      <Node ref={pB} opacity={0}>
        <Rect position={[-400, -80]} width={360} height={210} radius={16} fill={T.card} stroke={T.line} lineWidth={2}>
          <Txt position={[0, -80]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'订单表'} />
          <Txt position={[0, -45]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'user_id  金额'} />
          <Txt position={[0, -10]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'42  128'} />
          <Txt position={[0, 25]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'17  96'} />
          <Txt position={[0, 60]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'23  210'} />
        </Rect>
        <Rect position={[0, -80]} width={360} height={210} radius={16} fill={T.card} stroke={T.line} lineWidth={2}>
          <Txt position={[0, -80]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'用户表'} />
          <Txt position={[0, -45]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'user_id  姓名'} />
          <Txt position={[0, -10]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'42  张伟'} />
          <Txt position={[0, 25]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'17  李伟'} />
        </Rect>
        <Rect position={[400, -80]} width={360} height={210} radius={16} fill={T.card} stroke={T.line} lineWidth={2}>
          <Txt position={[0, -80]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'收货表'} />
          <Txt position={[0, -45]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'user_id  城市'} />
          <Txt position={[0, -10]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'42  上海'} />
          <Txt position={[0, 25]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'23  北京'} />
        </Rect>
        <Rect ref={hlT1} position={[-400, -90]} width={340} height={40} radius={10} stroke={T.yellow} lineWidth={3} opacity={0} />
        <Rect ref={hlT2} position={[0, -90]} width={340} height={40} radius={10} stroke={T.yellow} lineWidth={3} opacity={0} />
        <Rect ref={hlT3} position={[400, -90]} width={340} height={40} radius={10} stroke={T.yellow} lineWidth={3} opacity={0} />
        <Txt ref={rowLab1} position={[-400, 55]} fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.mono} text={'行 7'} opacity={0} />
        <Txt ref={rowLab2} position={[0, 55]} fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.mono} text={'行 12'} opacity={0} />
        <Txt ref={rowLab3} position={[400, 55]} fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.mono} text={'行 19'} opacity={0} />
        <Line ref={link1} points={[[-400, 80], [-400, 160]]} stroke={T.yellow} lineWidth={3} endArrow opacity={0} />
        <Line ref={link2} points={[[0, 80], [0, 160]]} stroke={T.yellow} lineWidth={3} endArrow opacity={0} />
        <Line ref={link3} points={[[400, 80], [400, 160]]} stroke={T.yellow} lineWidth={3} endArrow opacity={0} />
        <Rect ref={cmdChip1} position={[-400, 195]} width={300} height={64} radius={14} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'建索引：user_id'} />
        </Rect>
        <Rect ref={cmdChip2} position={[0, 195]} width={300} height={64} radius={14} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt position={[0, -14]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'一次建两个索引'} />
          <Txt ref={cmdSub2} position={[0, 14]} fontSize={SIZE.min} fill={T.muted} fontFamily={FONT.mono} text={'user_id · 姓名'} opacity={0} />
        </Rect>
        <Txt ref={cmdNote} position={[0, 245]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'每张表各建一次'} opacity={0} />
        <Rect ref={cmdChip3} position={[400, 195]} width={300} height={64} radius={14} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'建索引：user_id'} />
        </Rect>
      </Node>

      {/* 第 3 页：两种解法 */}
      <Node ref={pC} opacity={0}>
        <Rect ref={keyCardA} position={[-360, -200]} width={360} height={80} radius={16} fill={T.card} stroke={T.blue} lineWidth={3} opacity={0}>
          <Txt position={[0, -20]} fontSize={SIZE.min} fill={T.muted} fontFamily={FONT.sans} text={'订单表'} />
          <Txt position={[0, 18]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'键：user_id = 42'} />
        </Rect>
        <Rect ref={keyCardB} position={[0, -200]} width={360} height={80} radius={16} fill={T.card} stroke={T.blue} lineWidth={3} opacity={0}>
          <Txt position={[0, -20]} fontSize={SIZE.min} fill={T.muted} fontFamily={FONT.sans} text={'用户表'} />
          <Txt position={[0, 18]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'键：user_id = 42'} />
        </Rect>
        <Rect ref={keyCardC} position={[360, -200]} width={360} height={80} radius={16} fill={T.card} stroke={T.blue} lineWidth={3} opacity={0}>
          <Txt position={[0, -20]} fontSize={SIZE.min} fill={T.muted} fontFamily={FONT.sans} text={'收货表'} />
          <Txt position={[0, 18]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'键：user_id = 42'} />
        </Rect>
        <Txt ref={idxNote} position={[0, -135]} fontSize={SIZE.min} fill={T.muted} fontFamily={FONT.sans} text={'三个键框，各管各的表'} opacity={0} />
        <Txt ref={nameIdxNote} position={[0, 10]} fontSize={SIZE.min} fill={T.muted} fontFamily={FONT.sans} text={'姓名索引同理'} opacity={0} />
        <Txt ref={defNote} position={[0, 60]} fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.sans} text={'这个行号就是行的身份，搬了家也不变。'} opacity={0} />
        <Txt ref={idxLabA} position={[-360, 60]} fontSize={SIZE.min} fill={T.muted} fontFamily={FONT.sans} text={'订单表'} opacity={0} />
        <Txt ref={idxLabB} position={[0, 60]} fontSize={SIZE.min} fill={T.muted} fontFamily={FONT.sans} text={'用户表'} opacity={0} />
        <Txt ref={idxLabC} position={[360, 60]} fontSize={SIZE.min} fill={T.muted} fontFamily={FONT.sans} text={'收货表'} opacity={0} />
        <Rect ref={valCardA} position={[-360, -90]} width={300} height={40} radius={14} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'值 = [行 7]'} />
        </Rect>
        <Rect ref={valCardB} position={[0, -90]} width={300} height={40} radius={14} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'值 = [行 12]'} />
        </Rect>
        <Rect ref={valCardC} position={[360, -90]} width={300} height={40} radius={14} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'值 = [行 19]'} />
        </Rect>
        <Txt ref={valNoteA} position={[-360, -45]} fontSize={SIZE.min} fill={T.muted} fontFamily={FONT.mono} text={'行 7 的内容：订单 128'} opacity={0} />
        <Txt ref={valNoteB} position={[0, -45]} fontSize={SIZE.min} fill={T.muted} fontFamily={FONT.mono} text={'行 12 的内容：张伟'} opacity={0} />
        <Txt ref={valNoteC} position={[360, -45]} fontSize={SIZE.min} fill={T.muted} fontFamily={FONT.mono} text={'行 19 的内容：上海'} opacity={0} />
        <Txt ref={mapLab} position={[0, 110]} fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.sans} text={'键 → 行号 → 槽'} opacity={0} />
        <Txt ref={oldLab} position={[0, -262]} fontSize={SIZE.min} fill={T.yellow} fontFamily={FONT.sans} text={'对比：旧解法'} opacity={0} />
        {keyKV.map(kv => kv.node)}
        {valKV.map(kv => kv.node)}
        <Rect ref={scanChip} position={[0, 10]} width={420} height={60} radius={14} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt ref={scanTxt} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'三个索引，各扫一次'} />
        </Rect>
        {gotCounter.node}
        <Rect ref={plateB} position={[-280, 110]} width={420} height={80} radius={16} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'B 树'} />
        </Rect>
        <Rect ref={plateL} position={[280, 110]} width={420} height={80} radius={16} fill={T.card} stroke={T.purple} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'日志结构索引'} />
        </Rect>
        <Node ref={bIcon} position={[-450, 110]} opacity={0}>
          <Circle position={[0, -18]} width={16} height={16} fill={T.text} />
          <Circle position={[-16, 12]} width={16} height={16} fill={T.text} />
          <Circle position={[16, 12]} width={16} height={16} fill={T.text} />
          <Line points={[[-5, -10], [-13, 4]]} stroke={T.text} lineWidth={2} />
          <Line points={[[5, -10], [13, 4]]} stroke={T.text} lineWidth={2} />
        </Node>
        <Node ref={lIcon} position={[110, 110]} opacity={0}>
          <Rect position={[0, -16]} width={44} height={10} radius={3} fill={T.purple} />
          <Rect position={[0, 0]} width={44} height={10} radius={3} fill={T.purple} />
          <Rect position={[0, 16]} width={44} height={10} radius={3} fill={T.purple} />
        </Node>
        <Txt ref={bStationLab} position={[-280, 168]} fontSize={SIZE.min} fill={T.muted} fontFamily={FONT.sans} text={'第四站讲过'} opacity={0} />
        <Txt ref={lStationLab} position={[280, 168]} fontSize={SIZE.min} fill={T.muted} fontFamily={FONT.sans} text={'第三站讲过'} opacity={0} />
        <Txt ref={bothLab} position={[0, 205]} fontSize={SIZE.body} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'键 → 值，同一套结构不用换'} opacity={0} />
      </Node>

      {/* 第 4 页：全文索引回扣 */}
      <Node ref={pD} opacity={0}>
        <Rect ref={wordCard} position={[0, -150]} width={420} height={90} radius={16} fill={T.card} stroke={T.blue} lineWidth={3}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'词：猫'} />
        </Rect>
        {docKV.map(kv => kv.node)}
        <Line ref={docArrow1} points={[[-40, -100], [-340, -55]]} stroke={T.yellow} lineWidth={3} endArrow opacity={0} />
        <Line ref={docArrow2} points={[[0, -100], [0, -55]]} stroke={T.yellow} lineWidth={3} endArrow opacity={0} />
        <Line ref={docArrow3} points={[[40, -100], [340, -55]]} stroke={T.yellow} lineWidth={3} endArrow opacity={0} />
        <Txt ref={docLab} position={[0, 120]} fontSize={SIZE.body} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'查一个词，拿到一串文档'} opacity={0} />
        <Txt ref={moreLab} position={[0, 45]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'……一共几十篇'} opacity={0} />
        <Rect ref={altCard} position={[0, 200]} width={640} height={64} radius={14} fill={T.card} stroke={T.red} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.min} fill={T.text} fontFamily={FONT.mono} text={'解法二：猫#3、猫#8、猫#15……每篇文档一把键'} />
        </Rect>
        <Txt ref={altX} position={[360, 200]} fontSize={48} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'✗'} opacity={0} />
      </Node>
    </>
  );

  // f0：单元站牌（r5，skill v1.11.0 开篇规则）：站牌在 f1 开头收成左上角页眉；旧静态 header 已删，改由 unit.header 承担。
  const unit = new UnitTitle(CHAPTER, 'u6');
  view.add(unit.nodes());

  yield* beat('f0', unit.enter());

  say('主键之外怎么找？');
  yield* beat('f1',
    unit.toHeader(),
    all(pA().opacity(1, 0.5)),
    at('主键之外', pkHl().opacity(1, 0.5)),
    at('别的列', chain(qMark().opacity(1, 0.4), qMark().position([0, 140], 0.5))),
  );

  say('主键唯一标识一行');
  yield* beat('f2',
    all(qMark().opacity(0, 0.4)),
    at('订单号', rowHl().opacity(1, 0.5)),
    at('别的记录', chain(refCard().opacity(1, 0.5), refArrow().opacity(1, 0.5))),
    at('主键来引用', rowHl().stroke(T.green, 0.5)),
  );

  say('二级索引：另一把钥匙');
  yield* beat('f3',
    all(refCard().opacity(0, 0.4), refArrow().opacity(0, 0.4)),
    at('帮不上忙', qMark().opacity(1, 0.4)),
    at('另一把钥匙', chain(qMark().opacity(0, 0.4), key2().opacity(1, 0.5))),
  );

  say('每张表都有用户 42');
  yield* beat('f4',
    all(pA().opacity(0, 0.5), pB().opacity(1, 0.5)),
    at('用户四十二', all(hlT1().opacity(1, 0.5), rowLab1().opacity(1, 0.4))),
    at('不止一行', all(hlT2().opacity(1, 0.4), rowLab2().opacity(1, 0.4), hlT3().opacity(1, 0.4), rowLab3().opacity(1, 0.4))),
  );

  say('关联查询靠它');
  yield* beat('f5',
    at('几个二级索引', all(cmdChip1().opacity(1, 0.5), cmdChip2().opacity(1, 0.5), cmdChip3().opacity(1, 0.5))),
    at('两个索引', all(cmdSub2().opacity(1, 0.5), chain(cmdChip2().scale(1.06, 0.2), cmdChip2().scale(1, 0.3)))),
    at('每张表各建各的', all(link1().opacity(1, 0.4), link2().opacity(1, 0.4), link3().opacity(1, 0.4), cmdNote().opacity(1, 0.5))),
    at('常常就靠它', all(cmdChip1().stroke(T.yellow, 0.4), cmdChip2().stroke(T.yellow, 0.4), cmdChip3().stroke(T.yellow, 0.4))),
    at('按姓名查用户', chain(cmdChip2().scale(1.06, 0.2), cmdChip2().scale(1, 0.3))),
  );

  say('三张表，各一个索引');
  yield* beat('f6a',
    all(pB().opacity(0, 0.5), pC().opacity(1, 0.5)),
    at('第一种解法', all(keyCardA().opacity(1, 0.4), keyCardB().opacity(1, 0.4), keyCardC().opacity(1, 0.4))),
    at('订单表的索引', chain(keyCardA().scale(1.06, 0.15), keyCardA().scale(1, 0.25))),
    at('用户表的索引', chain(keyCardB().scale(1.06, 0.15), keyCardB().scale(1, 0.25))),
    at('收货表的索引', chain(keyCardC().scale(1.06, 0.15), keyCardC().scale(1, 0.25))),
    at('各管各的表', all(idxNote().opacity(1, 0.5), nameIdxNote().opacity(1, 0.5))),
  );

  say('每个索引，值是行标识符列表');
  yield* beat('f6b',
    at('标识符列表', all(valCardA().opacity(1, 0.5), valCardB().opacity(1, 0.5), valCardC().opacity(1, 0.5), valNoteA().opacity(1, 0.5), valNoteB().opacity(1, 0.5), valNoteC().opacity(1, 0.5))),
    at('行七', chain(valCardA().scale(1.08, 0.15), valCardA().scale(1, 0.25))),
    at('行十二', chain(valCardB().scale(1.08, 0.15), valCardB().scale(1, 0.25))),
    at('行十九', chain(valCardC().scale(1.08, 0.15), valCardC().scale(1, 0.25))),
    at('搬了家也不变', defNote().opacity(1, 0.5)),
    at('索引里记的位置', chain(defNote().scale(1.05, 0.15), defNote().scale(1, 0.25))),
    at('行号再指到', mapLab().opacity(1, 0.5)),
    at('槽变了', chain(mapLab().scale(1.05, 0.15), mapLab().scale(1, 0.25))),
  );

  say('一次查到三行');
  yield* beat('f7',
    all(gotCounter.node.opacity(1, 0.4)),
    at('查四十二', all(keyCardA().stroke(T.yellow, 0.3), keyCardB().stroke(T.yellow, 0.3), keyCardC().stroke(T.yellow, 0.3))),
    at('一次就拿到三行', chain(gotCounter.bump(), gotCounter.bump(), gotCounter.bump())),
    at('行七', valCardA().stroke(T.yellow, 0.3)),
    at('行十二', valCardB().stroke(T.yellow, 0.3)),
    at('行十九', chain(valCardC().stroke(T.yellow, 0.3), all(keyCardA().stroke(T.blue, 0.4), keyCardB().stroke(T.blue, 0.4), keyCardC().stroke(T.blue, 0.4)))),
  );

  say('键后追加行标识符');
  yield* beat('f8',
    all(valCardA().opacity(0, 0.4), valCardB().opacity(0, 0.4), valCardC().opacity(0, 0.4), valNoteA().opacity(0, 0.4), valNoteB().opacity(0, 0.4), valNoteC().opacity(0, 0.4), mapLab().opacity(0, 0.4), gotCounter.node.opacity(0, 0.4), idxNote().opacity(0, 0.4), nameIdxNote().opacity(0, 0.4), defNote().opacity(0, 0.4)),
    at('第二种解法', all(chain(keyKV[0].appear([-360, 110], 0.4), keyKV[1].appear([0, 110], 0.4), keyKV[2].appear([360, 110], 0.4)), idxLabA().opacity(1, 0.4), idxLabB().opacity(1, 0.4), idxLabC().opacity(1, 0.4))),
    at('变唯一', all(keyKV[0].node.stroke(T.green, 0.4), keyKV[1].node.stroke(T.green, 0.4), keyKV[2].node.stroke(T.green, 0.4))),
  );

  say('三个键，各不相同');
  yield* beat('f9',
    at('跟行七', all(oldLab().opacity(1, 0.5), chain(keyKV[0].node.scale(1.12, 0.15), keyKV[0].node.scale(1, 0.25)))),
    at('跟行十二', chain(keyKV[1].node.scale(1.12, 0.15), keyKV[1].node.scale(1, 0.25))),
    at('跟行十九', chain(keyKV[2].node.scale(1.12, 0.15), keyKV[2].node.scale(1, 0.25))),
  );

  say('三个索引，各扫一次');
  yield* beat('f9b',
    all(keyCardA().opacity(0, 0.4), keyCardB().opacity(0, 0.4), keyCardC().opacity(0, 0.4), oldLab().opacity(0, 0.4)),
    at('不用先知道行号', scanChip().opacity(1, 0.5)),
    at('三个索引各扫一次', chain(scanChip().stroke(T.yellow, 0.4), keyKV[0].flash(T.yellow, 0.3))),
    at('扫到哪把键', all(keyKV[0].flash(T.yellow, 0.3), keyKV[1].flash(T.yellow, 0.3), keyKV[2].flash(T.yellow, 0.3))),
    at('值就是行本身', chain(scanChip().scale(1.05, 0.15), scanChip().scale(1, 0.25))),
    at('订单表里', chain(keyKV[0].flash(T.yellow, 0.3), valKV[0].appear([-360, 200], 0.4))),
    at('用户表里', chain(keyKV[1].flash(T.yellow, 0.3), valKV[1].appear([0, 200], 0.4))),
    at('收货表里', chain(keyKV[2].flash(T.yellow, 0.3), valKV[2].appear([360, 200], 0.4))),
    at('是上海', all(valKV[0].flash(T.yellow, 0.3), valKV[1].flash(T.yellow, 0.3), valKV[2].flash(T.yellow, 0.3))),
  );

  say('两种索引都能用');
  yield* beat('f10',
    all(keyKV[0].node.opacity(0, 0.4), keyKV[1].node.opacity(0, 0.4), keyKV[2].node.opacity(0, 0.4),
      valKV[0].node.opacity(0, 0.4), valKV[1].node.opacity(0, 0.4), valKV[2].node.opacity(0, 0.4),
      scanChip().opacity(0, 0.4), idxLabA().opacity(0, 0.4), idxLabB().opacity(0, 0.4), idxLabC().opacity(0, 0.4),
      plateB().opacity(1, 0.5), plateL().opacity(1, 0.5), bIcon().opacity(1, 0.5), lIcon().opacity(1, 0.5)),
    at('第四站', bStationLab().opacity(1, 0.5)),
    at('第三站', lStationLab().opacity(1, 0.5)),
    at('都能拿来做二级索引', all(plateB().stroke(T.green, 0.4), plateL().stroke(T.green, 0.4))),
  );

  say('只是键的长相不同');
  yield* beat('f11',
    at('键的长相', bothLab().opacity(1, 0.5)),
    at('不用换', chain(plateB().stroke(T.green, 0.4), plateL().stroke(T.green, 0.4))),
    at('键怎么存', chain(bothLab().scale(1.1, 0.15), bothLab().scale(1, 0.25))),
    at('怎么查都照旧', chain(bothLab().scale(1.1, 0.15), bothLab().scale(1, 0.25))),
    at('一把键', chain(bothLab().scale(1.1, 0.15), bothLab().scale(1, 0.25))),
    at('就是这一个值', chain(bothLab().scale(1.1, 0.15), bothLab().scale(1, 0.25))),
  );

  say('全文索引也是解法一');
  yield* beat('f12',
    all(pC().opacity(0, 0.5), pD().opacity(1, 0.5)),
    at('全文索引', wordCard().stroke(T.yellow, 0.5)),
    at('一串文档', chain(docKV[0].appear([-360, -30], 0.4), docKV[1].appear([0, -30], 0.4), docKV[2].appear([360, -30], 0.4))),
  );

  say('词 → 文档标识符列表');
  yield* beat('f13',
    at('文档标识符列表', all(docArrow1().opacity(1, 0.4), docArrow2().opacity(1, 0.4), docArrow3().opacity(1, 0.4))),
    at('查一个词', all(docKV[0].flash(T.yellow, 0.3), docKV[1].flash(T.yellow, 0.3), docKV[2].flash(T.yellow, 0.3))),
    at('一串文档', docLab().opacity(1, 0.5)),
  );

  say('为什么不用第二种解法');
  yield* beat('f13b',
    at('为什么不用第二种解法', altCard().opacity(1, 0.5)),
    at('很多篇文档', chain(wordCard().scale(1.05, 0.15), wordCard().scale(1, 0.25))),
    at('每篇文档各造一把键', all(altX().opacity(1, 0.5), docKV[0].flash(T.yellow, 0.3), docKV[1].flash(T.yellow, 0.3), docKV[2].flash(T.yellow, 0.3))),
    at('一把键就够了', all(wordCard().stroke(T.green, 0.4), docKV[0].flash(T.yellow, 0.3), docKV[1].flash(T.yellow, 0.3), docKV[2].flash(T.yellow, 0.3))),
    at('几十篇文档', moreLab().opacity(1, 0.5)),
  );
});
