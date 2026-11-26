// U13 场景 4（MC）r10：m22–m30 —— 读快写难、原地更新行不通、LSM 式写缓冲、查询两边拼结果、结尾回扣。
// r10（判定 #41）：P2-5 m22 天平真倾斜 12°（写难一侧下沉；r9 的 rotation(-0.1) 是按弧度写的，API 单位是度，-0.1° 肉眼不可见，
// 本轮改 12° 并让两端标签跟着走），m30 回正；三根列条内加列名；B 树箭头旁标“每列都不行”；分析师三颗空心圆改一颗；
// P2-6 m25b 下一笔虚影行插进内存中间 + 整段重写示意；P2-7 m28c “遮住”画在磁盘表第 6 行本身（盖灰 + ✗）；
// P2-8 m26c 另一份合并画成小图（旧 6 行 + 3 笔 → 新文件 9 行），并点名“读的那份：按日期排这份”；
// P2-10 选 (b)：m24 加“回到最初的 6 行演示表”过渡标签；m25 三笔改值，140103·33·4 → 140103·40·5（避开 m23b 追加行）。
// P2-9 m27 旁白加对应句，TTS 四次坏音频后拆拍（m27b 单立后半句；m27“视频名就是键”改“视频名是键”，“拿…当键”改“日期加产品合起来是一行，数量是一列”）；
// P2-8 m28c 旁白“下次合并时再把磁盘那份旧行清掉”，fateTag2 小字同步改“下次合并再把磁盘旧行清掉”。
// r8（判定 #37）：P1-2 m23 插行后重编号（新行得 4 号，下面三行改 5、6、7 号）；P2-1 m23b 选 (a)：m23 插的行留下来，
// 140103·33·4 追加为第 8 行；P2-2 m26c 把按产品排那份的合并画出来（小框）；P2-3 m30 天平下三列框各标列名。
// r7（判定 #35）：P1-4 蓝箭头 qDisk 终点移到磁盘第 6 行（140102·33·2）；P2-8 m24 内存框保持空，三笔在 m25 再出现；
// P2-9 m26c 贴片改“另一份也要单独并一次（同理）”；P2-10 m27 新总数变绿时 +4/+11 淡出；P2-11 m28 结果贴片改“查询要同时看两边”；
// P2-12 m26 合并完成时三支红写箭头淡出，m28a 新写改一支单独绿箭头送进内存；P2-13 m29 旁白改“替你同时查了两边，你只看到一份结果”，删无说明的 ✓，加“只看到一份结果”贴片。
// 分镜：skill-ch03/beats-u13.md；原文：DDIA §3.13（书页 p101，PDF p123）。
// 猫视频回扣用 U2 的计数：mew 1082、purr 2114、yawn 511、scratch 252（只留最新值）。
// 磁盘列文件 + 内存写缓冲用 Slots（装着已排序的真值）+ Counter（攒了几笔）；不用 Motion Canvas 的 Camera 组件。
// r5：小表与磁盘列文件改成 6 行（与 mc1/mc2/mc3 同一张表）；m23 新行换成真正落中间的 140102·20·4，
// m23b 另用 140103·33·4 落末尾；m26 合并后画出 9 行新文件、内存清掉；m28a 新拍：又来一笔 140102·33·9 进内存；
// m28 合并绿线（m26 的 mergeArrow）在查询拍去掉；m27 猫视频加 +4/+11 与“没人播”标记；
// 既有 P2 顺带修：updateTag 移到 [0,215]（与 rewriteTag 错开）、verticaTag 移到 [-350,215]（避开“行式 ✓”卡片）、
// 磁盘列标题间距拉到 130（date_key / product_sk / quantity 不再挤在一起）。
// 时长全部来自 timeline/u13.json（beat() 驱动），不手写 waitFor。
import {Circle, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {Vector2, all, chain, createRef} from '@motion-canvas/core';
import {at, makeBeats} from '../../lib/beats';
import {Counter, KV, Slots} from '../../lib/schemas';
import {FONT, SAFE, SIZE, T} from '../../lib/theme';
import timeline from '../../timeline/u13.json';

export default makeScene2D(function* (view) {
  view.fill(T.bg);
  const beat = makeBeats(timeline);

  const header = createRef<Txt>();
  const anchor = createRef<Txt>();
  const say = (text: string) => anchor().text(text);

  // b26–b30：天平与列文件
  const balance = createRef<Node>();
  const balBar = createRef<Rect>();
  const readLab = createRef<Txt>();
  const writeLab = createRef<Txt>();
  const writeLab2 = createRef<Txt>();
  const cols = createRef<Node>();
  const colStrips = [0, 1, 2].map(() => createRef<Rect>());
  const readArrow = createRef<Line>();
  const writeArrow = createRef<Line>();
  const analysts = createRef<Node>();
  const bigQuery = createRef<Node>();
  const thinWrite = createRef<Node>();
  const btree = createRef<Node>();
  const inplaceArrow = createRef<Line>();
  const inplaceX = createRef<Txt>();
  // r10 P2-5：B 树箭头所指交代——就地改写对每一列都不行（不是只指第一列）
  const inplaceLab = createRef<Txt>();
  // r6 F5：B 树叶节点标“一页”+ 就地改写 vs 整段移位的对比
  const pageTag1 = createRef<Txt>();
  const pageTag2 = createRef<Txt>();
  const contrastChip = createRef<Node>();
  // m22：为什么原地更新行不通——列是压过的，插一行整段都变
  const whyChip = createRef<Node>();

  // b29–b30：已排序小表 + 位置编号（6 行，与 mc1/mc2/mc3 同一张表）
  const miniTab = createRef<Node>();
  const miniCells = [0, 1, 2, 3, 4, 5].map(() => [0, 1, 2].map(() => createRef<Rect>()));
  const newRow = createRef<Node>();
  const rewriteTag = createRef<Node>();
  const posNums = [0, 1, 2, 3, 4, 5].map(() => createRef<Txt>());
  // r8 P1-2：m23 插进中间的新行自己的位置编号（4 号）
  const posNumIns = createRef<Txt>();
  const updateTag = createRef<Node>();
  // m23b：落在末尾直接追加——另一行 140103·33·4 落到表尾成第 8 行（r8 P2-1 选 (a)：m23 插的行留下来，m23b 从 7 行起步）
  const newRowB = createRef<Node>();
  const posNumNew = createRef<Txt>();
  const appendChip = createRef<Node>();
  // r8 P2-2：按产品排那份的合并小框（m26c）
  const otherMerge = createRef<Node>();
  // r10 P2-6：m25b 下一笔的虚影行（插进内存中间）+ 整段重写小字
  const ghostRow = createRef<Node>();
  const midRewriteTag = createRef<Txt>();
  // r10 P2-10：m24 回到最初 6 行演示表的过渡标签
  const backChip = createRef<Node>();
  // r10 P2-8：m26c 点名“读的那份”是按日期排这份
  const readCopyTag = createRef<Txt>();
  // r10 P2-7：m28c “遮住”画在磁盘表第 6 行本身（盖灰 + ✗，有意遮挡，key 标 qa-ignore）
  const rowCover = createRef<Rect>();
  const rowX = createRef<Txt>();

  // m24–m26 / m28：磁盘列文件 + 内存盒（Slots + 计数器）
  const diskMem = createRef<Node>();
  const diskLab = createRef<Txt>();
  const memFill = createRef<Rect>();
  const lsmTag = createRef<Txt>();
  const wArrows = [0, 1, 2].map(() => createRef<Line>());
  const rowCard = createRef<Node>();
  const colCard = createRef<Node>();
  const mergeArrow = createRef<Line>();
  const newFile = createRef<Node>();
  const verticaTag = createRef<Node>();
  // r6 F6：m24 起内存框即画出已排序结构雏形 + LSM 回扣小字
  const recallChip = createRef<Node>();
  // r6 F7④：旧文件被新文件替掉
  const oldFileTag = createRef<Txt>();
  // r6 F4：每种排法各并各的
  const multiBufChip = createRef<Node>();
  // m26b：阈值贴片（比如 1000 笔 / 几兆才合并；示意量级）
  const threshChip = createRef<Node>();

  // 磁盘上的三列文件（已排序的真值，与 m23 小表排好的顺序一致；6 行）
  const DISK_VALS = [
    ['140101', '140101', '140101', '140102', '140102', '140102'],
    ['32', '32', '69', '32', '32', '33'],
    ['7', '4', '3', '5', '9', '2'],
  ];
  const diskSlots = ['date_key', 'product_sk', 'quantity'].map(
    (t, i) => new Slots(new Vector2(-480 + i * 130, -60), 'col', 6, {item: 40, cross: 88, gap: 6, title: t}),
  );
  const diskKVs = DISK_VALS.flatMap(col => col.map(v => new KV(v, '', 'key', {w: 88})));
  // 内存写缓冲：三行新写数据（插入顺序：先 40·5，再 32·1 插到前面，最后 69·2；r10 P2-10：中间一笔由 33·4 改成 40·5，
  // 避开 m23b 追加进磁盘的 140103·33·4；三笔日期都比磁盘最大日期 140102 大，仍都落在末尾，且按（日期，产品）排好）
  const memSlots = new Slots(new Vector2(150, -60), 'col', 3, {item: 44, cross: 380, gap: 8, title: '内存'});
  const memKVs = ['140103 · 40 · 5', '140103 · 32 · 1', '140104 · 69 · 2', '140102 · 33 · 9'].map(
    r => new KV(r, '', 'key', {w: 380}),
  );
  // m26 合并后的新文件：磁盘 6 行 + 内存 3 笔按（日期，产品）排好合并成 9 行（r10 P2-10：内存中间一笔改成 140103·40·5）
  const MERGED_VALS = [
    ['140101', '140101', '140101', '140102', '140102', '140102', '140103', '140103', '140104'],
    ['32', '32', '69', '32', '32', '33', '32', '40', '69'],
    ['7', '4', '3', '5', '9', '2', '1', '5', '2'],
  ];
  const mergedFile = createRef<Node>();
  const memCount = new Counter([430, -60], '攒了 ', ' 笔');

  // b34：猫视频
  const cats = createRef<Node>();
  const catCards = [0, 1, 2, 3].map(() => createRef<Rect>());
  const catOld = [0, 1, 2, 3].map(() => createRef<Txt>());
  const catNew = [0, 1, 2, 3].map(() => createRef<Txt>());
  const mergeChip = createRef<Node>();
  // r6 F8：键/计数与销售表行/数量的桥接
  const bridgeChip = createRef<Node>();
  // m27：这段时间的新增播放（mew +4、purr +11）与没人播的标记（yawn、scratch）
  const plusTag = [0, 1].map(() => createRef<Txt>());
  const noPlayTag = [2, 3].map(() => createRef<Txt>());

  // b35–b37：查询拼结果 + 结尾
  const qDisk = createRef<Line>();
  const qMem = createRef<Line>();
  const resultChip = createRef<Node>();
  const optLid = createRef<Node>();
  const freshWrite = createRef<Node>();
  // r7 P2-12：m28a 新写用一支单独的绿箭头送进内存（m26 的三支红写箭头在合并完成时已淡出）
  const freshArrow = createRef<Line>();
  // r7 P2-13：只看到一份结果（替 m29 原先无说明的 ✓）
  const oneResultChip = createRef<Node>();
  // m28b/m28c：同一行两边都有——磁盘旧值 vs 内存新值，内存为准
  const dedupOld = createRef<Node>();
  const dedupOldRect = createRef<Rect>();
  const dedupX = createRef<Txt>();
  const dedupNew = createRef<Node>();
  const dedupRes = createRef<Node>();
  // r6 F9：标出两边是同一行（对应关系）
  const matchTag = createRef<Node>();
  // r6 F9：旧行去向——查询时跳过，下次合并再清掉
  const fateTag1 = createRef<Txt>();
  const fateTag2 = createRef<Txt>();

  const CAT_NAMES = ['mew', 'purr', 'yawn', 'scratch'];
  const CAT_OLD = ['1078', '2103', '511', '252'];
  const CAT_NEW = ['1082', '2114', '511', '252'];
  const CAT_PLUS = ['+4', '+11'];
  const MINI = [
    ['140101', '32', '7'],
    ['140101', '32', '4'],
    ['140101', '69', '3'],
    ['140102', '32', '5'],
    ['140102', '32', '9'],
    ['140102', '33', '2'],
  ];

  view.add(
    <>
      <Txt
        ref={header}
        position={[-SAFE.halfW, -SAFE.halfH]}
        offset={[-1, -1]}
        fontSize={SIZE.label}
        fill={T.muted}
        fontFamily={FONT.sans}
        text={'排序与写入：列存的两难'}
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

      {/* 天平：读 vs 写 */}
      <Node ref={balance} opacity={0}>
        <Rect ref={balBar} position={[0, -200]} width={700} height={14} radius={7} fill={T.line} />
        <Circle position={[0, -200]} width={26} height={26} fill={T.muted} />
        <Txt ref={readLab} position={[-320, -155]} fontSize={SIZE.body} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'读快'} opacity={0} />
        {/* r10 P2-5：写难标签初始位置跟着倾斜后的横杆右端走（横杆 +12° 时右端下沉到约 -132，标签在 -95） */}
        <Txt ref={writeLab} position={[320, -95]} fontSize={SIZE.body} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'写难'} opacity={0} />
        <Txt ref={writeLab2} position={[320, -155]} fontSize={SIZE.body} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'写有着落'} opacity={0} />
      </Node>
      <Node ref={cols} opacity={0}>
        {/* r10 P2-5：三根列条里直接标列名（r8 的 m30 下方 colLabs 已删，列名跟条走，m22/m30 都有） */}
        {[0, 1, 2].map(i => (
          <Rect key={`cs-${i}`} ref={colStrips[i]} position={[-220 + i * 220, -20]} width={110} height={200} radius={10} fill={T.card} stroke={T.blue} lineWidth={2}>
            <Txt fontSize={16} fill={T.muted} fontFamily={FONT.mono} text={['date_key', 'product_sk', 'quantity'][i]} />
          </Rect>
        ))}
        <Line ref={readArrow} points={[[-560, -20], [-340, -20]]} stroke={T.green} lineWidth={3} endArrow opacity={0} />
        <Line ref={writeArrow} points={[[560, -20], [340, -20]]} stroke={T.red} lineWidth={3} endArrow opacity={0} />
      </Node>
      {/* r10 P2-5：分析师只剩一个圆（r9 的三颗空心圆没说明是什么，去掉两颗，只留一个分析师图标） */}
      <Node ref={analysts} position={[0, 120]} opacity={0}>
        <Circle position={[0, 0]} width={64} height={64} fill={T.card} stroke={T.blue} lineWidth={2} />
        <Txt position={[0, 60]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'分析师'} />
      </Node>
      <Node ref={bigQuery} position={[0, -250]} opacity={0}>
        <Rect width={420} height={60} radius={12} fill={T.card} stroke={T.blue} lineWidth={2}>
          <Txt fontSize={SIZE.label} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'大型只读查询'} />
        </Rect>
      </Node>
      <Node ref={thinWrite} position={[430, 120]} opacity={0}>
        <Line points={[[0, 0], [90, 0]]} stroke={T.red} lineWidth={2} endArrow />
        <Txt position={[45, -35]} fontSize={SIZE.label} fill={T.red} fontFamily={FONT.sans} text={'写很少'} />
      </Node>

      {/* B 树原地更新 */}
      <Node ref={btree} opacity={0}>
        <Rect position={[-420, -200]} width={120} height={48} radius={10} fill={T.card} stroke={T.blue} lineWidth={2}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'B 树'} />
        </Rect>
        <Rect position={[-480, -110]} width={100} height={44} radius={10} fill={T.card} stroke={T.line} lineWidth={2} />
        <Rect position={[-360, -110]} width={100} height={44} radius={10} fill={T.card} stroke={T.line} lineWidth={2} />
        <Txt ref={pageTag1} position={[-480, -110]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'一页'} opacity={0} />
        <Txt ref={pageTag2} position={[-360, -110]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'一页'} opacity={0} />
        <Line points={[[-420, -176], [-480, -132]]} stroke={T.line} lineWidth={2} />
        <Line points={[[-420, -176], [-360, -132]]} stroke={T.line} lineWidth={2} />
        <Line ref={inplaceArrow} points={[[-280, -130], [-180, -80]]} stroke={T.red} lineWidth={3} endArrow opacity={0} />
        <Txt ref={inplaceX} position={[-230, -150]} fontSize={48} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'✗'} opacity={0} />
        {/* r10 P2-5：B 树箭头指的不是只一列——就地改写对每一列都不行（标在第一、二列条之间的空档） */}
        <Txt ref={inplaceLab} position={[-110, -60]} fontSize={20} fill={T.red} fontFamily={FONT.sans} text={'每列都不行'} opacity={0} />
      </Node>
      {/* r6 F5：一格值就地改写 vs 列段整段移位（r6 QA：[0,215] 会盖住“分析师”标签，移到 225） */}
      <Node ref={contrastChip} position={[0, 225]} opacity={0}>
        <Rect width={660} height={56} radius={12} fill={T.card} stroke={T.yellow} lineWidth={2}>
          <Txt fontSize={SIZE.label} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'行存：一格值就地盖写；列存：整段都要移位'} />
        </Rect>
      </Node>

      {/* m22：为什么行不通——列是压过的 */}
      <Node ref={whyChip} position={[0, -320]} opacity={0}>
        <Rect width={620} height={52} radius={12} fill={T.card} stroke={T.red} lineWidth={2}>
          <Txt fontSize={SIZE.label} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'列是压过的：插一行，整段游程都变了'} />
        </Rect>
      </Node>

      {/* 已排序小表 + 新行插入 */}
      <Node ref={miniTab} opacity={0}>
        {[0, 1, 2, 3, 4, 5].flatMap(r =>
          [0, 1, 2].map(c => (
            <Rect
              key={`mc-${r}-${c}`}
              ref={miniCells[r][c]}
              position={[-200 + c * 200, -170 + r * 40]}
              width={160}
              height={36}
              radius={8}
              fill={T.card}
              stroke={T.line}
              lineWidth={2}
            >
              <Txt fontSize={20} fill={T.text} fontFamily={FONT.mono} text={MINI[r][c]} />
            </Rect>
          )),
        )}
        {[0, 1, 2, 3, 4, 5].map(i => (
          <Txt key={`pn-${i}`} ref={posNums[i]} position={[-290, -170 + i * 40]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.mono} text={String(i + 1)} />
        ))}
      </Node>
      <Node ref={newRow} position={[0, 120]} opacity={0}>
        <Rect width={520} height={44} radius={8} fill={T.card} stroke={T.yellow} lineWidth={3}>
          <Txt fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.mono} text={'新行 140102 · 20 · 4'} />
        </Rect>
      </Node>
      {/* m23b：第 7 号位置编号 + 另一行落末尾（140103 · 33 · 4） */}
      <Node ref={newRowB} position={[0, 120]} opacity={0}>
        <Rect width={520} height={44} radius={8} fill={T.card} stroke={T.green} lineWidth={3}>
          <Txt fontSize={SIZE.label} fill={T.green} fontFamily={FONT.mono} text={'新行 140103 · 33 · 4'} />
        </Rect>
      </Node>
      <Txt ref={posNumNew} position={[-290, 110]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.mono} text={'8'} opacity={0} />
      {/* r8 P1-2：m23 插进中间的新行自己的位置编号（4 号，落在第 4 个位置 [-290,-50]） */}
      <Txt ref={posNumIns} position={[-290, -50]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.mono} text={'4'} opacity={0} />
      <Node ref={appendChip} position={[0, 195]} opacity={0}>
        <Rect width={440} height={56} radius={12} fill={T.card} stroke={T.green} lineWidth={2}>
          <Txt fontSize={SIZE.label} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'落在末尾：直接追加，不用重写'} />
        </Rect>
      </Node>
      <Node ref={rewriteTag} position={[0, 150]} opacity={0}>
        <Rect width={420} height={56} radius={12} fill={T.card} stroke={T.red} lineWidth={2}>
          <Txt fontSize={SIZE.label} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'全部列文件重写'} />
        </Rect>
      </Node>
      <Node ref={updateTag} position={[0, 215]} opacity={0}>
        <Rect width={420} height={56} radius={12} fill={T.card} stroke={T.red} lineWidth={2}>
          <Txt fontSize={SIZE.label} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'全部列都要更新'} />
        </Rect>
      </Node>

      {/* 磁盘列文件 + 内存盒（Slots 由代码加进 diskMem） */}
      <Node ref={diskMem} opacity={0}>
        <Txt ref={diskLab} position={[-350, -258]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'磁盘列文件'} />
        <Rect ref={memFill} position={[150, -60]} width={360} height={10} radius={5} fill={T.green} opacity={0} />
        <Txt ref={lsmTag} position={[150, -220]} fontSize={SIZE.label} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'LSM 树的思路'} opacity={0} />
        {[0, 1, 2].map(i => (
          <Line key={`wa-${i}`} ref={wArrows[i]} points={[[60 + i * 90, 230], [60 + i * 90, 30]]} stroke={T.red} lineWidth={3} endArrow opacity={0} />
        ))}
        <Line ref={mergeArrow} points={[[-60, -60], [-272, -60]]} stroke={T.green} lineWidth={3} endArrow opacity={0} />
        <Node ref={newFile} position={[-350, 110]} opacity={0}>
          <Rect width={300} height={56} radius={12} fill={T.card} stroke={T.green} lineWidth={2}>
            <Txt fontSize={SIZE.label} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'新文件 · 9 行'} />
          </Rect>
        </Node>
        {/* r6 F7④：旧文件被新文件替掉（“新文件 · 9 行”贴片正下方；m28a 时淡出，m29 的查询优化器盖子同位置随后出现） */}
        <Txt ref={oldFileTag} position={[-350, 170]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'旧文件被新文件替掉'} opacity={0} />
        {/* r6 F6：LSM 回扣——前面第三站：写先进内存，攒够再批量写盘 */}
        <Node ref={recallChip} position={[150, 215]} opacity={0}>
          <Rect width={520} height={56} radius={12} fill={T.card} stroke={T.yellow} lineWidth={2}>
            <Txt fontSize={SIZE.label} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'前面第三站：写先进内存，攒够再批量写盘'} />
          </Rect>
        </Node>
        <Node ref={verticaTag} position={[-350, 215]} opacity={0}>
          <Rect width={300} height={52} radius={12} fill={T.card} stroke={T.purple} lineWidth={2}>
            <Txt fontSize={SIZE.label} fill={T.purple} fontFamily={FONT.mono} text={'Vertica 的做法'} />
          </Rect>
        </Node>
        {/* m26 合并后的新文件：三列 × 9 行（与磁盘列文件同位置，合并时替换旧列） */}
        <Node ref={mergedFile} opacity={0}>
          {MERGED_VALS.map((col, ci) => (
            <Rect key={`mf-${ci}`} position={[-480 + ci * 130, -60]} width={104} height={282} radius={12} fill={T.bg} stroke={T.green} lineWidth={2} />
          ))}
          {MERGED_VALS.flatMap((col, ci) =>
            col.map((v, ri) => (
              <Txt key={`mfc-${ci}-${ri}`} position={[-480 + ci * 130, -180 + ri * 30]} fontSize={18} fill={T.text} fontFamily={FONT.mono} text={v} />
            )),
          )}
        </Node>
        {/* r10 P2-10 (b)：m24 回到最初 6 行演示表的过渡标签（m23/m23b 的 8 行表是插行演示，LSM 一段回到 6 行表讲） */}
        <Node ref={backChip} position={[-350, 215]} opacity={0}>
          <Rect width={340} height={52} radius={12} fill={T.card} stroke={T.yellow} lineWidth={2}>
            <Txt fontSize={SIZE.label} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'回到最初的 6 行演示表'} />
          </Rect>
        </Node>
        {/* r10 P2-6：m25b 下一笔的虚影行——140103·35·3（在内存三笔中间：32·1 与 40·5 之间），虚线框表示还没写、只是可能落在这 */}
        <Node ref={ghostRow} position={[150, -60]} opacity={0}>
          <Rect width={380} height={44} radius={8} fill={T.card} stroke={T.yellow} lineWidth={2} lineDash={[8, 6]}>
            <Txt fontSize={18} fill={T.yellow} fontFamily={FONT.mono} text={'140103 · 35 · 3'} />
          </Rect>
        </Node>
        {/* r10 P2-6：插进中间的后果——整段都要重写 */}
        <Txt ref={midRewriteTag} position={[470, 40]} fontSize={20} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'插进中间，整段重写'} opacity={0} />
        {/* r10 P2-8：m26c 点名“读的那份”是按日期排这份（左面正在并的这份） */}
        <Txt ref={readCopyTag} position={[-350, -222]} fontSize={SIZE.label} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'读的那份：按日期排这份'} opacity={0} />
        {/* r10 P2-7：m28c “遮住”画在磁盘表第 6 行本身——盖灰 + ✗（有意遮挡；key 标 qa-ignore，免得 QA 记 covered error） */}
        <Rect key="qa-ignore-遮住旧行" ref={rowCover} position={[-350, -30]} width={400} height={32} radius={8} fill={T.line} opacity={0} />
        <Txt ref={rowX} position={[-150, -30]} fontSize={36} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'✗'} opacity={0} />
      </Node>
      {/* m26b：阈值贴片（示意量级：比如 1000 笔 / 几兆才合并；放内存盒下方，避开列式卡片） */}
      <Node ref={threshChip} position={[380, 60]} opacity={0}>
        <Rect width={360} height={56} radius={12} fill={T.card} stroke={T.yellow} lineWidth={2}>
          <Txt fontSize={SIZE.label} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'比如：1000 笔 / 几兆才合并'} />
        </Rect>
      </Node>
      {/* r7 P2-9：每种排法各并各的 → 另一份也要单独并一次（同理）；r6 只有一句贴片、第二份副本的合并一次也没画 */}
      <Node ref={multiBufChip} position={[380, 130]} opacity={0}>
        <Rect width={400} height={56} radius={12} fill={T.card} stroke={T.yellow} lineWidth={2}>
          <Txt fontSize={SIZE.label} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'另一份也要单独并一次（同理）'} />
        </Rect>
      </Node>
      {/* r10 P2-8：把另一份（按产品排那份）的合并画出来——小图：旧 6 行 + 内存 3 笔 → 新文件 9 行（r8 只有文字框；r7 的 (b) 措辞未解决“没有画面”） */}
      <Node ref={otherMerge} position={[380, 212]} opacity={0}>
        <Txt position={[0, -40]} fontSize={20} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'按产品排的那份也在并'} />
        <Rect position={[-105, 5]} width={180} height={48} radius={10} fill={T.card} stroke={T.green} lineWidth={2}>
          <Txt fontSize={18} fill={T.text} fontFamily={FONT.sans} text={'旧 6 行 + 3 笔'} />
        </Rect>
        <Line points={[[-8, 5], [18, 5]]} stroke={T.green} lineWidth={3} endArrow />
        <Rect position={[110, 5]} width={170} height={48} radius={10} fill={T.card} stroke={T.green} lineWidth={2}>
          <Txt fontSize={18} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'新文件 · 9 行'} />
        </Rect>
      </Node>
      <Node ref={rowCard} position={[-150, 150]} opacity={0}>
        <Rect width={240} height={52} radius={10} fill={T.card} stroke={T.blue} lineWidth={2}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'行式 ✓'} />
        </Rect>
      </Node>
      <Node ref={colCard} position={[150, 150]} opacity={0}>
        <Rect width={240} height={52} radius={10} fill={T.card} stroke={T.blue} lineWidth={2}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'列式 ✓'} />
        </Rect>
      </Node>

      {/* 猫视频回扣 */}
      <Node ref={cats} opacity={0}>
        {[0, 1, 2, 3].map(i => (
          <Rect
            key={`cat-${i}`}
            ref={catCards[i]}
            position={[-450 + i * 300, -60]}
            width={260}
            height={180}
            radius={16}
            fill={T.card}
            stroke={T.blue}
            lineWidth={2}
          >
            <Txt position={[0, -50]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.mono} text={CAT_NAMES[i]} />
            <Txt ref={catOld[i]} position={[0, 25]} fontSize={SIZE.title} fontWeight={700} fill={T.yellow} fontFamily={FONT.mono} text={CAT_OLD[i]} />
            <Txt ref={catNew[i]} position={[0, 25]} fontSize={SIZE.title} fontWeight={700} fill={T.green} fontFamily={FONT.mono} text={CAT_NEW[i]} opacity={0} />
            <Txt position={[0, 70]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'播放次数'} />
          </Rect>
        ))}
        {/* m27：新增播放标记（mew +4、purr +11）与没人播标记（yawn、scratch） */}
        <Txt ref={plusTag[0]} position={[-450, 60]} fontSize={SIZE.label} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'+4'} opacity={0} />
        <Txt ref={plusTag[1]} position={[-150, 60]} fontSize={SIZE.label} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'+11'} opacity={0} />
        <Txt ref={noPlayTag[0]} position={[150, 60]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'没人播'} opacity={0} />
        <Txt ref={noPlayTag[1]} position={[450, 60]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'没人播'} opacity={0} />
      </Node>
      <Node ref={mergeChip} position={[0, 150]} opacity={0}>
        <Rect width={420} height={56} radius={12} fill={T.card} stroke={T.green} lineWidth={2}>
          <Txt fontSize={SIZE.label} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'先攒着，再合并'} />
        </Rect>
      </Node>
      {/* r6 F8：键 ≈ 视频名，计数 ≈ 播放次数 */}
      <Node ref={bridgeChip} position={[0, 215]} opacity={0}>
        <Rect width={480} height={56} radius={12} fill={T.card} stroke={T.yellow} lineWidth={2}>
          <Txt fontSize={SIZE.label} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'键 ≈ 视频名，计数 ≈ 播放次数'} />
        </Rect>
      </Node>

      {/* 查询拼结果 */}
      {/* r7 P1-4：蓝箭头终点移到磁盘第 6 行（140102·33·2）那一格；r7 QA 修：直连 [0,230]→[-350,-30] 会穿过去重条的“33”字（crossed error ×5），改走折线——先沿 y=255 下沿左行（去重条底沿 248 之下、字幕顶沿 266 之上），再沿磁盘文件左沿（x=-560）上行，最后向右指到第 6 行日期格左沿 [-530,-30] */}
      <Line ref={qDisk} points={[[0, 255], [-560, 255], [-560, -30], [-530, -30]]} stroke={T.blue} lineWidth={3} endArrow opacity={0} />
      <Line ref={qMem} points={[[0, 230], [150, 70]]} stroke={T.green} lineWidth={3} endArrow opacity={0} />
      <Node ref={resultChip} position={[0, 170]} opacity={0}>
        <Rect width={420} height={56} radius={12} fill={T.card} stroke={T.blue} lineWidth={2}>
          <Txt fontSize={SIZE.label} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'查询要同时看两边'} />
        </Rect>
      </Node>
      {/* r5 修复：原在 [-185, 108]，与“新文件 · 9 行”贴片（x -500..-200，y 82..138）重叠，QA 记 edge error；
          移到新文件贴片正下方 [-350, 170]（贴片底边 138，留 4px 间隙；与结果贴片 x -210..210 留 10px），
          m29 时 Vertica 贴片已在 m28a 淡出，此处无其他节点。 */}
      <Node ref={optLid} position={[-350, 170]} opacity={0}>
        <Rect width={220} height={56} radius={16} fill={T.bg} stroke={T.yellow} lineWidth={3}>
          <Txt fontSize={SIZE.label} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'查询优化器'} />
        </Rect>
      </Node>
      <Node ref={freshWrite} position={[150, -220]} opacity={0}>
        <Rect width={300} height={52} radius={12} fill={T.card} stroke={T.green} lineWidth={2}>
          <Txt fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} text={'新写的数据'} />
        </Rect>
      </Node>
      {/* r7 P2-12：m28a 单独的绿箭头（与 m26 的三支红写箭头同式，一支） */}
      <Line ref={freshArrow} points={[[150, 230], [150, 30]]} stroke={T.green} lineWidth={3} endArrow opacity={0} />
      {/* r7 P2-13：只看到一份结果 */}
      <Node ref={oneResultChip} position={[0, 170]} opacity={0}>
        <Rect width={420} height={56} radius={12} fill={T.card} stroke={T.green} lineWidth={2}>
          <Txt fontSize={SIZE.label} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'只看到一份结果'} />
        </Rect>
      </Node>
      {/* m28b/m28c：同一行两边都有——旧值灰条打叉，新值绿条，结果只留新值（示意：140102 · 33 由 2 改成 9） */}
      <Node ref={dedupOld} position={[0, 100]} opacity={0}>
        <Rect ref={dedupOldRect} width={480} height={56} radius={12} fill={T.card} stroke={T.line} lineWidth={2}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'磁盘旧值：140102 · 33 · 2'} />
        </Rect>
      </Node>
      <Txt ref={dedupX} position={[210, 100]} fontSize={SIZE.body} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'✗'} opacity={0} />
      <Node ref={dedupNew} position={[0, 160]} opacity={0}>
        <Rect width={480} height={56} radius={12} fill={T.card} stroke={T.green} lineWidth={2}>
          <Txt fontSize={SIZE.label} fontWeight={700} fill={T.green} fontFamily={FONT.mono} text={'内存新值：140102 · 33 · 9'} />
        </Rect>
      </Node>
      <Node ref={dedupRes} position={[0, 220]} opacity={0}>
        <Rect width={480} height={56} radius={12} fill={T.card} stroke={T.green} lineWidth={2}>
          <Txt fontSize={SIZE.label} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'结果只留新值，内存为准'} />
        </Rect>
      </Node>
      {/* r6 F9：两边是同一行——竖线连起旧值条与新值条，旁边标“同一行” */}
      <Node ref={matchTag} opacity={0}>
        <Line points={[[272, 108], [272, 152]]} stroke={T.yellow} lineWidth={3} />
        <Txt position={[335, 130]} fontSize={SIZE.label} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'同一行'} />
      </Node>
      {/* r6 F9：旧行去向——查询时跳过，下次合并再清掉；r9 P2-8：小字点名是磁盘那份旧行 */}
      <Txt ref={fateTag1} position={[450, 100]} fontSize={20} fill={T.muted} fontFamily={FONT.sans} text={'查询时跳过'} opacity={0} />
      <Txt ref={fateTag2} position={[450, 160]} fontSize={20} fill={T.muted} fontFamily={FONT.sans} text={'下次合并再把磁盘旧行清掉'} opacity={0} />
    </>
  );

  // 把 Slots / KV / 计数器挂进 diskMem（外框、标题先显形，diskMem 本身 opacity 0 兜底）
  diskSlots.forEach((s, i) => {
    s.frame.opacity(1);
    s.title.opacity(1);
    diskMem().add([s.frame, s.title]);
    const kvs = diskKVs.slice(i * 6, i * 6 + 6);
    s.place(kvs);
    diskMem().add(kvs.map(kv => kv.node));
  });
  memSlots.frame.opacity(1);
  memSlots.title.opacity(1);
  diskMem().add([memSlots.frame, memSlots.title, memCount.node]);
  memKVs.forEach(kv => {
    kv.node.position([150, 120]).opacity(0);
    diskMem().add(kv.node);
  });

  // m25：内存排法标出来——把内存盒的标题改成带排法的写法
  const setMemTitle = function* () {
    memSlots.title.text('内存 · 按日期，再按产品排');
  };

  say('读快了，写难了');
  yield* beat('m22',
    all(balance().opacity(1, 0.4), cols().opacity(1, 0.4)),
    at('读快了', all(readLab().opacity(1, 0.4), readArrow().opacity(1, 0.4))),
    // r10 P2-5：天平真的倾斜——横杆 +12°（API 单位是度；r9 的 -0.1 是按弧度写的，等于 -0.1°，肉眼不可见），
    // 写难一侧（右）下沉、读快一侧（左）上扬；两端标签跟着横杆走（读快上移、写难已在倾斜后的位置出现）
    at('写却难了', all(writeLab().opacity(1, 0.4), writeArrow().opacity(1, 0.4), balBar().rotation(12, 0.8), readLab().position([-320, -235], 0.8))),
    at('分析师', analysts().opacity(1, 0.5)),
    at('大型只读查询', bigQuery().opacity(1, 0.5)),
    at('写本来就少', thinWrite().opacity(1, 0.5)),
    at('B 树原地更新', all(btree().opacity(1, 0.5), inplaceArrow().opacity(1, 0.4))),
    at('对压缩过的列行不通', all(inplaceX().opacity(1, 0.4), inplaceLab().opacity(1, 0.4), colStrips[0]().stroke(T.red, 0.4), colStrips[1]().stroke(T.red, 0.4), colStrips[2]().stroke(T.red, 0.4))),
    at('第四站讲过', all(pageTag1().opacity(1, 0.4), pageTag2().opacity(1, 0.4), contrastChip().opacity(1, 0.5))),
    at('列是压过的', whyChip().opacity(1, 0.5)),
    // r5 修复：m22 旁白加了“列是压过的……”后半句（18.4s），贴片出现后约 8s 再无动作，QA 记 idle error 9.1s。
    // 后半句每到一个分句就让贴片轻 pulse 一下，动作跟着旁白走，静止不断超过 3s。
    at('一个值连成一段', chain(whyChip().scale(1.04, 0.4), whyChip().scale(1, 0.4))),
    at('中间插一行', chain(whyChip().scale(1.04, 0.4), whyChip().scale(1, 0.4))),
    at('整段的游程', chain(whyChip().scale(1.04, 0.4), whyChip().scale(1, 0.4))),
    at('没法只盖写一页', chain(whyChip().scale(1.04, 0.4), whyChip().scale(1, 0.4))),
  );

  say('中间插一行，全列重写');
  yield* beat('m23',
    all(balance().opacity(0, 0.4), cols().opacity(0, 0.4), btree().opacity(0, 0.4), whyChip().opacity(0, 0.4),
      pageTag1().opacity(0, 0.4), pageTag2().opacity(0, 0.4), contrastChip().opacity(0, 0.4), inplaceLab().opacity(0, 0.4),
      analysts().opacity(0, 0.4), bigQuery().opacity(0, 0.4), thinWrite().opacity(0, 0.4), miniTab().opacity(1, 0.5)),
    at('中间插一行', chain(
      newRow().opacity(1, 0.4),
      all(
        newRow().position([0, -50], 1.0),
        miniCells[3][0]().position([-200, -10], 0.8), miniCells[3][1]().position([0, -10], 0.8), miniCells[3][2]().position([200, -10], 0.8),
        miniCells[4][0]().position([-200, 30], 0.8), miniCells[4][1]().position([0, 30], 0.8), miniCells[4][2]().position([200, 30], 0.8),
        miniCells[5][0]().position([-200, 70], 0.8), miniCells[5][1]().position([0, 70], 0.8), miniCells[5][2]().position([200, 70], 0.8),
        posNums[3]().position([-290, -10], 0.8), posNums[4]().position([-290, 30], 0.8), posNums[5]().position([-290, 70], 0.8),
      ),
      // r8 P1-2：插行后重编号——新行得 4 号，下面三行依次改 5、6、7 号（行落位后再翻号，号跟着行走）
      (function* () {
        posNums[3]().text('5');
        posNums[4]().text('6');
        posNums[5]().text('7');
      })(),
      posNumIns().opacity(1, 0.4),
    )),
    at('重写全部列文件', rewriteTag().opacity(1, 0.5)),
    // r8 P1-2：黄链 7 个号 × 0.25s = 1.75s，要在“一致更新全部列”cue（间隔 1.95s）之前跑完，否则尾号与红 cue 时间窗重叠（lint warn）
    at('位置标识', chain(posNums[0]().fill(T.yellow, 0.25), posNums[1]().fill(T.yellow, 0.25), posNums[2]().fill(T.yellow, 0.25), posNums[3]().fill(T.yellow, 0.25), posNums[4]().fill(T.yellow, 0.25), posNums[5]().fill(T.yellow, 0.25), posNumIns().fill(T.yellow, 0.25))),
    at('一致更新全部列', all(
      posNums[0]().fill(T.red, 0.4), posNums[1]().fill(T.red, 0.4), posNums[2]().fill(T.red, 0.4), posNums[3]().fill(T.red, 0.4), posNums[4]().fill(T.red, 0.4), posNums[5]().fill(T.red, 0.4), posNumIns().fill(T.red, 0.4),
      updateTag().opacity(1, 0.5),
    )),
  );

  say('落在末尾，直接追加');
  yield* beat('m23b',
    // r8 P2-1 选 (a)：m23 插进中间的新行留下来——小表不复原成 6 行、不把行移回去；只收掉两张贴片、把位置编号颜色复原
    all(rewriteTag().opacity(0, 0.4), updateTag().opacity(0, 0.4),
      posNums[0]().fill(T.muted, 0.4), posNums[1]().fill(T.muted, 0.4), posNums[2]().fill(T.muted, 0.4), posNums[3]().fill(T.muted, 0.4), posNums[4]().fill(T.muted, 0.4), posNums[5]().fill(T.muted, 0.4), posNumIns().fill(T.muted, 0.4)),
    at('落在最后面', all(
      newRowB().opacity(1, 0.4),
      // r8 P2-1(a)：表从 7 行起步，140103·33·4 追加为第 8 行（y=110，第 8 号位置编号）
      newRowB().position([0, 110], 1.0), posNumNew().opacity(1, 0.4),
    )),
    at('不用重写', appendChip().opacity(1, 0.5)),
  );

  say('借 LSM 树的思路');
  yield* beat('m24',
    all(miniTab().opacity(0, 0.4), updateTag().opacity(0, 0.4), newRow().opacity(0, 0.4), newRowB().opacity(0, 0.4), rewriteTag().opacity(0, 0.4),
      appendChip().opacity(0, 0.4), posNumNew().opacity(0, 0.4), posNumIns().opacity(0, 0.4), diskMem().opacity(1, 0.5),
      // r10 P2-10 (b)：回到最初 6 行演示表的过渡标签随磁盘列文件一起亮起
      backChip().opacity(1, 0.5)),
    at('LSM 树的思路', all(lsmTag().opacity(1, 0.5), memSlots.frame.stroke(T.yellow, 0.4))),
    // r7 P2-8：m24 内存框保持空（r6 的 0.35 雏形预览被新手实测证伪——具体值半透明下仍可读，且 m24 旁白未提新写）；三行在 m25 随“新来了三笔”再出现
    at('第三站讲过的', recallChip().opacity(1, 0.5)),
    // r6 QA 修复：m24 尾部 5.7s 无动作（idle warn），回扣贴片 pulse 一下
    at('攒够再批量写盘', chain(recallChip().scale(1.03, 0.5), recallChip().scale(1, 0.5))),
  );

  say('写先进内存');
  yield* beat('m25',
    // r10 P2-10 (b)：过渡标签只在 m24 出现，新写进来时收掉
    all(backChip().opacity(0, 0.4)),
    at('新来了三笔写', memSlots.frame.stroke(T.yellow, 0.4)),
    at('先进入内存', all(
      chain(wArrows[0]().opacity(1, 0.4), wArrows[1]().opacity(1, 0.4), wArrows[2]().opacity(1, 0.4)),
      memCount.node.opacity(1, 0.4),
    )),
    at('已排序的结构', chain(
      all(memKVs[0].node.opacity(1, 0.4), memSlots.insertSorted(memKVs[0], 0.8)), memCount.bump(),
      all(memKVs[1].node.opacity(1, 0.4), memSlots.insertSorted(memKVs[1], 0.8)), memCount.bump(),
      all(memKVs[2].node.opacity(1, 0.4), memSlots.insertSorted(memKVs[2], 0.8)), memCount.bump(),
    )),
    at('行式还是列式', all(rowCard().opacity(1, 0.4), colCard().opacity(1, 0.4))),
    at('按同样的顺序', setMemTitle()),
    // r9 P2-7：新句“它们碰巧都落在末尾”——三笔都落在末尾是碰巧，下一笔可能在中间；内存框轻 pulse 跟着旁白走
    at('碰巧都落在末尾', chain(memSlots.frame.scale(1.03, 0.5), memSlots.frame.scale(1, 0.5))),
  );

  // r10 P2-6：m25b 画出“下一笔可能落在中间”——虚影行 140103·35·3 插进内存三笔中间（32·1 与 40·5 之间），
  // 下面的行让位下移、内存框跟着长高；“一插行就要重写”时亮起“插进中间，整段重写”；本拍末尾虚影收掉、框与行复原
  // （下一笔只是可能，不是真写进来，合并时不算它）。
  // 注意：注释不要写进 beat() 的参数之间——lint 的顶层切分认不出 // 注释，会把后面的 at() 当成 t0=0 的并行部分误报重叠。
  say('下一笔可能落在中间');
  yield* beat('m25b',
    at('下一笔可能落在中间', all(
      chain(rowCard().scale(1.05, 0.4), rowCard().scale(1, 0.4)),
      ghostRow().opacity(0.9, 0.5),
      memSlots.frame.height(216, 0.8),
      memSlots.frame.position([150, -34], 0.8),
      memKVs[0].node.position([150, -8], 0.8),
      memKVs[2].node.position([150, 44], 0.8),
    )),
    at('一插行就要重写全部列文件', all(
      chain(colCard().scale(1.05, 0.4), colCard().scale(1, 0.4)),
      midRewriteTag().opacity(1, 0.5),
    )),
    at('所以先攒着', chain(memSlots.frame.scale(1.03, 0.5), memSlots.frame.scale(1, 0.5))),
    at('等攒够一批再合并', all(
      chain(recallChip().scale(1.03, 0.5), recallChip().scale(1, 0.5)),
      ghostRow().opacity(0, 0.4),
      midRewriteTag().opacity(0, 0.4),
      memSlots.frame.height(164, 0.8),
      memSlots.frame.position([150, -60], 0.8),
      memKVs[0].node.position([150, -60], 0.8),
      memKVs[2].node.position([150, -8], 0.8),
    )),
  );

  say('攒够一批，批量合并');
  yield* beat('m26',
    // r6 QA 修复：行式/列式卡（m25 留下）盖住“旧文件被新文件替掉”小字，m26 开头淡出
    at('攒够足够多的一批', all(memFill().opacity(1, 0.5), memFill().height(140, 1.6), recallChip().opacity(0, 0.4), rowCard().opacity(0, 0.4), colCard().opacity(0, 0.4))),
    at('并进已有的列文件', mergeArrow().opacity(1, 0.5)),
    at('批量写进新文件', all(
      ...diskSlots.map(s => s.frame.opacity(0, 0.5)),
      ...diskSlots.map(s => s.title.opacity(0, 0.5)),
      ...diskKVs.map(kv => kv.node.opacity(0, 0.5)),
      diskLab().opacity(0, 0.5),
      mergedFile().opacity(1, 0.5),
      newFile().opacity(1, 0.5),
    )),
    at('旧的列文件被新文件替掉', oldFileTag().opacity(1, 0.5)),
    at('清掉了', all(
      ...memKVs.slice(0, 3).map(kv => kv.node.opacity(0, 0.4)),
      memCount.reset(),
      memFill().height(10, 0.8),
      memFill().opacity(0, 0.4),
      // r7 P2-12：合并完成，三支红写箭头淡出（不再指着已清空的内存框）
      wArrows[0]().opacity(0, 0.4), wArrows[1]().opacity(0, 0.4), wArrows[2]().opacity(0, 0.4),
    )),
  );

  say('比如 1000 笔 / 几兆才合并');
  yield* beat('m26b',
    at('Vertica 的做法', verticaTag().opacity(1, 0.5)),
    at('真要到这个量级', threshChip().opacity(1, 0.5)),
  );

  // r7 P2-9：每种排法各并各的 → 另一份也要单独并一次（同理）
  // r8 P2-2：光贴片不够（r7 的 (b) 措辞选项未解决“没有画面”），把按产品排那份的合并画出来（小框 otherMerge）
  say('另一份也要单独并一次');
  yield* beat('m26c',
    at('几份排法就并几遍', all(multiBufChip().opacity(1, 0.5), otherMerge().opacity(1, 0.5))),
    // r10 P2-8：点名“读的那份”是左面这份（按日期排），正在并的新文件 pulse 一下
    at('读的那份才跟得上', all(
      readCopyTag().opacity(1, 0.5),
      chain(mergedFile().scale(1.02, 0.4), mergedFile().scale(1, 0.4)),
      chain(
        all(multiBufChip().scale(1.04, 0.5), otherMerge().scale(1.04, 0.5)),
        all(multiBufChip().scale(1, 0.4), otherMerge().scale(1, 0.4)),
      ),
    )),
  );

  // r9 P2-9：m27 旁白“视频名就是键，播放次数就是计数”改“视频名是键，播放次数是计数”（TTS 坏音频：“就是键/就是计数”三次幻觉循环，改“是”后干净）；
  // 新句“销售表里，日期加产品合起来是一行，数量是一列”点明对应关系（键是（日期，产品）这一行，计数是数量那一列）。
  // 注意：注释不要写进 beat() 的参数之间——lint 的顶层切分认不出 // 注释，会把后面的 at() 当成 t0=0 的并行部分误报重叠。
  say('猫视频：先攒着再合并');
  yield* beat('m27',
    all(diskMem().opacity(0, 0.5), rowCard().opacity(0, 0.4), colCard().opacity(0, 0.4), threshChip().opacity(0, 0.4), multiBufChip().opacity(0, 0.4), otherMerge().opacity(0, 0.4), cats().opacity(1, 0.5)),
    at('猫视频', chain(catCards[0]().stroke(T.yellow, 0.3), catCards[1]().stroke(T.yellow, 0.3), catCards[2]().stroke(T.yellow, 0.3), catCards[3]().stroke(T.yellow, 0.3))),
    at('先攒着', mergeChip().opacity(1, 0.5)),
    at('合并时再加总', chain(mergeChip().scale(1.04, 0.5), mergeChip().scale(1, 0.4))),
    at('视频名是键', bridgeChip().opacity(1, 0.5)),
    // r6 定格修复：桥接句 ~6s 无动作（7.37s error），分句 pulse
    at('播放次数是计数', chain(bridgeChip().scale(1.04, 0.5), bridgeChip().scale(1, 0.4))),
    at('跟销售表里的行和数量一个道理', chain(mergeChip().scale(1.04, 0.5), mergeChip().scale(1, 0.4))),
    at('日期加产品合起来是一行', chain(bridgeChip().scale(1.04, 0.5), bridgeChip().scale(1, 0.4))),
  );

  // r9 P2-9：m27 拆拍——后半句单立 m27b（TTS 坏音频：整句两次 + 拆后前半句两次均在“视频名就是键/播放次数就是计数”附近幻觉循环；
  // 前半句改“视频名是键，播放次数是计数”后干净；m27b“yawn 和 scratch 没人播”改“没人播的是 yawn 和 scratch”后干净）。
  // r5 修复：旁白加长到 23.2s 后，+4/+11 同时出现、到“没人播”之间 6.2s 无动作，定格 error。
  // 分开出现（mew +4 先、purr +11 后），中间“先攒在内存里”时合并贴片再 pulse 一下，动作跟着旁白走。
  say('先攒在内存里');
  yield* beat('m27b',
    at('又被播了 4 次', plusTag[0]().opacity(1, 0.5)),
    at('purr 被播了 11 次', plusTag[1]().opacity(1, 0.5)),
    at('先攒在内存里', chain(mergeChip().scale(1.04, 0.5), mergeChip().scale(1, 0.4))),
    at('没人播', all(noPlayTag[0]().opacity(1, 0.5), noPlayTag[1]().opacity(1, 0.5))),
    // r6 定格修复：结尾句 ~10s 无动作（8.00s error），分句 pulse
    at('新总数是旧总数加这段时间攒下的次数', chain(mergeChip().scale(1.04, 0.5), mergeChip().scale(1, 0.4))),
    at('中间过程不留', chain(plusTag[0]().scale(1.1, 0.4), plusTag[0]().scale(1, 0.4), plusTag[1]().scale(1.1, 0.4), plusTag[1]().scale(1, 0.4))),
    at('只留最后这个总数', all(
      catOld[0]().opacity(0, 0.4), catOld[1]().opacity(0, 0.4),
      catNew[0]().opacity(1, 0.4), catNew[1]().opacity(1, 0.4),
      // r7 P2-10：新总数变绿的同时把“+4”“+11”淡出，免得再加一次
      plusTag[0]().opacity(0, 0.4), plusTag[1]().opacity(0, 0.4),
    )),
  );

  say('又来一笔，进内存');
  yield* beat('m28a',
    all(cats().opacity(0, 0.5), mergeChip().opacity(0, 0.4), bridgeChip().opacity(0, 0.4), diskMem().opacity(1, 0.5), verticaTag().opacity(0, 0.4), oldFileTag().opacity(0, 0.4), memFill().opacity(0, 0.4), mergeArrow().opacity(0, 0.4)),
    at('140102 这天产品 33 的数量改成 9', all(
      memKVs[3].node.opacity(1, 0.4),
      memKVs[3].node.position(memSlots.pos(0), 1.0),
      memCount.bump(),
      // r7 P2-12：新写用一支单独的绿箭头送进内存
      freshArrow().opacity(1, 0.4),
    )),
  );

  say('磁盘 + 内存，两边拼');
  yield* beat('m28',
    all(freshArrow().opacity(0, 0.4)),
    at('磁盘上的列数据', qDisk().opacity(1, 0.5)),
    at('内存里的近期写', qMem().opacity(1, 0.5)),
    at('拼起来', resultChip().opacity(1, 0.5)),
  );

  say('同一行两边都有，内存为准');
  yield* beat('m28b',
    all(resultChip().opacity(0, 0.4)),
    at('列文件里数量还是旧值 2', dedupOld().opacity(1, 0.5)),
    at('内存里已经改成 9', dedupNew().opacity(1, 0.5)),
  );

  // r6 F9：认行依据单立 m28b2——“磁盘上那一行”合录两次触发 TTS 幻觉循环，改用不依赖“认出”机制的说法 + 画面标出对应关系
  say('内存里这笔写的是同一行');
  yield* beat('m28b2',
    at('写的是同一行', matchTag().opacity(1, 0.5)),
    at('数量 2 改成 9', chain(matchTag().scale(1.04, 0.5), matchTag().scale(1, 0.4))),
  );

  say('同一行两边都有，内存为准');
  yield* beat('m28c',
    // r10 P2-7：“遮住”画在磁盘表第 6 行本身——那行盖灰 + 打叉（不只打在下方汇总条上）
    at('以内存为准', all(dedupOldRect().fill(T.line, 0.4), dedupX().opacity(1, 0.4), rowCover().opacity(0.6, 0.4), rowX().opacity(1, 0.4))),
    at('查询时先跳过它', fateTag1().opacity(1, 0.5)),
    at('结果里只留一行', dedupRes().opacity(1, 0.5)),
    // r9 P2-8：旁白“下次合并时再把磁盘那份旧行清掉”，cue 跟着改（“把它”所指点明是磁盘那份旧行）
    at('下次合并时再把磁盘那份旧行清掉', fateTag2().opacity(1, 0.5)),
  );

  say('改完立刻看得到');
  yield* beat('m29',
    all(lsmTag().opacity(0, 0.4), dedupOld().opacity(0, 0.4), dedupNew().opacity(0, 0.4), dedupRes().opacity(0, 0.4), dedupX().opacity(0, 0.4), matchTag().opacity(0, 0.4), fateTag1().opacity(0, 0.4), fateTag2().opacity(0, 0.4)),
    at('查询优化器', optLid().opacity(1, 0.5)),
    // r7 P2-13：旁白改“替你同时查了两边，你只看到一份结果”；“藏”的画面改成一道结果贴片，删无说明的 ✓
    at('同时查了两边', optLid().scale(1.03, 0.6)),
    at('只看到一份结果', oneResultChip().opacity(1, 0.5)),
    at('刚改过的数据', freshWrite().opacity(1, 0.5)),
    at('立刻就能看到', all(freshWrite().position([150, -200], 1.0), chain(oneResultChip().scale(1.04, 0.5), oneResultChip().scale(1, 0.4)))),
  );

  say('读和写各记一笔');
  yield* beat('m30',
    all(diskMem().opacity(0, 0.5), optLid().opacity(0, 0.4), freshWrite().opacity(0, 0.4), resultChip().opacity(0, 0.4), oneResultChip().opacity(0, 0.4), qDisk().opacity(0, 0.4), qMem().opacity(0, 0.4),
      balance().opacity(1, 0.5), cols().opacity(1, 0.5), balBar().rotation(0, 0.8),
      // r10 P2-5：天平回正时“读快”标签也回原位；列名在列条里（跟条走），不再另标
      readLab().position([-320, -155], 0.8),
      colStrips[0]().stroke(T.blue, 0.4), colStrips[1]().stroke(T.blue, 0.4), colStrips[2]().stroke(T.blue, 0.4)),
    at('借老办法解决的', all(writeArrow().stroke(T.green, 0.5), writeLab().opacity(0, 0.4), writeLab2().opacity(1, 0.4))),
    at('读和写各记一笔', chain(readLab().scale(1.1, 0.5), writeLab2().scale(1.1, 0.5))),
  );
});
