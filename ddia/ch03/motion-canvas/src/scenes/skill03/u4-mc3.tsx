// U4 场景 3（MC，r5）：d22–d29c —— 改值写回页、原地覆盖 vs 只追加、覆盖一页的硬件操作、
// 分裂写一半崩溃出孤儿页、预写日志先写后改、崩溃后日志重放（深度延伸，画面标“延伸 · 原文之外”）。
// r5：d22a 拆拍——d22a 恢复 r4 原文原音，新增 d22a2 只念加总句，小标换成
// “日志 1 条 + 树页 1 处 = 2 次”；d25 加 tally“日志 3 条 + 树页 3 处 = 6 次”
// （d26 断电时淡出）；d27 加“还指着旧页的位置”小标；d29b 规则直白化，画面加两行
// 序号比较（日志 4、5 ≤ 页上 5 → 跳过；日志 6 > 页上 5 → 重做）。
// r5 修复（首轮 QA 1 error）：d27 叶页 B 的“孤儿页”标牌下移 20px——原位置与漂移落点后的页框底边重叠 9px。
// r5 修复（抽帧定格 error）：d29c 开场过渡句 6.33s 无动作——日志条按旁白分步出现（改值句日志本轻推、
// 分裂句日志 7 出现、走查开始日志 8/9 出现、两叶页最新描绿），最长定格降到 3s 内。
// d29c 加一拍分裂断电重放走查（日志 7/8 写两页新叶页、日志 9 父页加边界 337）。
// r7（判定 #31）：日志编号重算——日志从 1 号起，改值 1 号、分裂 2/3/4 号；d29a 日志条 1–4、251 那页序号 1；
// d29b 同一条日志走两种情况（写过跳过 / 没写重做）；d29c 两叶页序号 2/3、父页 0→4、日志 4 补边界与引用；
// d26/d27 点名两片新叶页写了、父页没写 + 按旧父页去查的后果；d24 擦除块 512 KB / 128 倍小标。
// 分镜：skill-ch03/beats-u4.md；原文：DDIA §3.4（书页 p81–82，PDF p103–104）。
// 深度延伸依据：Graefe《Modern B-Tree Techniques》（本书参考文献 [5]）、Mohan & Levine ARIES/IM（[20]）。
// 时长全部来自 timeline/u4.json（beat() 驱动），不手写 waitFor。
import {Circle, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, chain, createRef} from '@motion-canvas/core';
import {at, makeBeats} from '../../lib/beats';
import {FONT, SAFE, SIZE, T} from '../../lib/theme';
import {tag} from '../../lib/schemas';
import timeline from '../../timeline/u4.json';

type Cell = {t: string; w: number; bold?: boolean};
function Page({cells, id}: {cells: Cell[]; id: string}) {
  const total = cells.reduce((s, c) => s + c.w, 0);
  let x = -total / 2;
  const centers = cells.map(c => {
    const cx = x + c.w / 2;
    x += c.w;
    return cx;
  });
  return (
    <Node>
      <Rect width={total} height={44} fill={T.card} stroke={T.line} lineWidth={2} radius={6} />
      {cells.map((c, i) => (
        <Node key={`${id}-c${i}`}>
          {i > 0 && <Rect position={[centers[i] - c.w / 2, 0]} width={2} height={44} fill={T.line} />}
          <Txt
            position={[centers[i], 0]}
            fontSize={c.bold ? 22 : 20}
            fontWeight={c.bold ? 700 : 400}
            fill={T.text}
            fontFamily={FONT.mono}
            text={c.t}
          />
        </Node>
      ))}
    </Node>
  );
}

const KEY = 56;
const VAL = 44;
const LEAF_251: Cell[] = [250, 251, 252, 253, 254].reduce<Cell[]>(
  (acc, k, i) => (i === 0 ? [{t: String(k), w: KEY}, {t: 'val', w: VAL}] : acc.concat([{t: String(k), w: KEY}, {t: 'val', w: VAL}])),
  [],
);  // r6 P2-5：与 d7 同一页，保持 5 个键

export default makeScene2D(function* (view) {
  view.fill(T.bg);
  const beat = makeBeats(timeline);
  // 深度延伸角标：d29a/d29b 的 WAL 重放机制是原文之外的延伸内容。
  // tag() 默认 offset [1,0] 是右缘锚点，放在 x=-580 会向左伸出画外；改左缘锚点 [-1,0]。
  const extTag = tag([-580, -255], '延伸 · 原文之外', [-1, 0]);

  const header = createRef<Txt>();
  const anchor = createRef<Txt>();
  const say = (text: string) => anchor().text(text);

  // d22：改值写回页
  const h22 = createRef<Node>();
  const h22leaf = createRef<Node>();
  const h22hl = createRef<Rect>();
  const h22write = createRef<Line>();
  const h22disk = createRef<Rect>();
  const h22parent = createRef<Rect>();
  const h22ref = createRef<Line>();
  const h22tally = createRef<Txt>();
  const h22tally2 = createRef<Txt>();
  const h22note = createRef<Txt>();  // r6 P1-1：d22a2 的“日志”是预写日志，不是 d1 的日志结构
  // d23：原地覆盖 vs 只追加
  const g20 = createRef<Node>();
  const g20cover = createRef<Rect>();
  const g20old = createRef<Txt>();
  const g20new = createRef<Txt>();
  const g20append = createRef<Rect>();
  const g20segs = [0, 1, 2].map(() => createRef<Rect>());
  const g20pos = createRef<Txt>();
  const g20ref = createRef<Line>();
  // d24：硬盘 vs 固态
  const g21 = createRef<Node>();
  const g21platter = createRef<Circle>();
  const g21head = createRef<Circle>();
  const g21sector = createRef<Rect>();
  const g21chip = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(() => createRef<Rect>());
  const g21block = createRef<Rect>();
  const g21headLab = createRef<Txt>();  // r6 P2-6：磁头标注，跟着磁头走
  const g21platterLab = createRef<Txt>();
  const g21sectorLab = createRef<Txt>();
  const g21chipLab = createRef<Txt>();
  const g21spoke = createRef<Node>();  // 盘片辐条：转到位置看得见
  const g21eraseLab = createRef<Txt>();
  const g21blockNote = createRef<Txt>();  // r7 #25：擦除块 512 KB，是一页的 128 倍
  const g21rewriteLab = createRef<Txt>();
  // d25/d26/d27：一次写三页 / 孤儿页
  const g22 = createRef<Node>();
  const g22a = createRef<Rect>();
  const g22b = createRef<Rect>();
  const g22p = createRef<Rect>();
  const g22aCheck = createRef<Txt>();
  const g22bCheck = createRef<Txt>();
  const g22pMiss = createRef<Txt>();
  const g22flash = createRef<Rect>();
  const g22orph1 = createRef<Txt>();
  const g22orph2 = createRef<Txt>();
  const g22oldRef = createRef<Txt>();
  const g22oldResult = createRef<Txt>();  // r7 #8：按旧父页去查的后果
  const g22tally = createRef<Txt>();
  // d28：预写日志
  const g23 = createRef<Node>();
  const g23log = createRef<Rect>();
  const g23e1 = createRef<Txt>();
  const g23e2 = createRef<Txt>();
  const g23redo = createRef<Txt>();
  const g23tree = createRef<Rect>();
  const g23arr = createRef<Line>();
  const g23chip = createRef<Circle>();
  const g23gray = createRef<Rect>();
  // d29a/d29b：WAL 重放（深度延伸）
  const g29 = createRef<Node>();
  const g29log = createRef<Rect>();
  const g29e1 = createRef<Txt>();  // r7：日志从 1 号起
  const g29e2 = createRef<Txt>();
  const g29e3 = createRef<Txt>();
  const g29e4 = createRef<Txt>();
  const g29skip1 = createRef<Txt>();
  const g29cmp1 = createRef<Txt>();
  const g29cmp2 = createRef<Txt>();
  const g29page = createRef<Rect>();
  const g29lsn1 = createRef<Txt>();  // 251 那页：页上序号 1
  const g29lsn0 = createRef<Txt>();  // 还没写过：页上序号 0
  const g29lsn1g = createRef<Txt>();  // 重做后：页上序号 1（绿）
  const g29new = createRef<Txt>();
  const g29gray = createRef<Rect>();
  // d29c：分裂断电重放走查（深度延伸）
  const g29c = createRef<Node>();
  const g29cLog = createRef<Rect>();
  const g29cE2 = createRef<Txt>();  // r7：分裂日志 2/3/4
  const g29cE3 = createRef<Txt>();
  const g29cE4 = createRef<Txt>();
  const g29cSkip1 = createRef<Txt>();
  const g29cSkip2 = createRef<Txt>();
  const g29cParent = createRef<Rect>();
  const g29cLsn0 = createRef<Txt>();  // r7：父页重放前序号 0（建树后没改过）
  const g29cLsn4 = createRef<Txt>();  // 重做后：序号 4
  const g29cNew = createRef<Txt>();
  const g29cLeafA = createRef<Rect>();
  const g29cLeafB = createRef<Rect>();
  const g29cOrphA = createRef<Txt>();
  const g29cOrphB = createRef<Txt>();
  const g29cBackA = createRef<Txt>();
  const g29cBackB = createRef<Txt>();
  const g29cLink = createRef<Line>();

  view.add(
    <>
      <Txt
        ref={header}
        position={[-SAFE.halfW, -SAFE.halfH]}
        offset={[-1, -1]}
        fontSize={SIZE.label}
        fill={T.muted}
        fontFamily={FONT.sans}
        text={'B 树：把数据切成页'}
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
      {extTag}

      {/* d22：改值写回页 */}
      <Node ref={h22} opacity={0}>
        <Rect ref={h22parent} position={[0, -250]} width={300} height={80} radius={14} fill={T.card} stroke={T.blue} lineWidth={3} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'父页'} />
        </Rect>
        <Line ref={h22ref} points={[[0, -210], [0, -152]]} stroke={T.yellow} lineWidth={2} opacity={0} />
        <Node ref={h22leaf} position={[0, -130]} opacity={0}>
          <Page cells={LEAF_251} id={'h22leaf'} />
        </Node>
        <Rect ref={h22hl} position={[-72, -130]} width={50} height={50} stroke={T.yellow} lineWidth={3} opacity={0} />
        <Line ref={h22write} points={[[0, -108], [0, 8]]} stroke={T.yellow} lineWidth={3} endArrow opacity={0} />
        <Rect ref={h22disk} position={[0, 52]} width={500} height={44} radius={8} fill={T.card} stroke={T.muted} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'磁盘'} />
        </Rect>
        <Txt ref={h22tally} position={[0, 130]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} text={'这 1 处是写树页'} opacity={0} />
        <Txt ref={h22note} position={[0, 170]} fontSize={18} fill={T.muted} fontFamily={FONT.sans} text={'这里的日志，是改树前先记的一笔'} opacity={0} />
        <Txt ref={h22tally2} position={[0, 130]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} text={'日志 1 条 + 树页 1 处 = 2 次'} opacity={0} />
      </Node>

      {/* d23：原地覆盖 vs 只追加 */}
      <Node ref={g20} opacity={0}>
        <Rect ref={g20cover} position={[-290, -60]} width={400} height={180} radius={16} fill={T.card} stroke={T.yellow} lineWidth={3} opacity={0}>
          <Txt position={[0, -60]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'原地覆盖'} />
          <Txt ref={g20old} position={[0, 10]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.mono} text={'旧值'} opacity={0} />
          <Txt ref={g20new} position={[0, 10]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.mono} text={'新值'} opacity={0} />
          <Txt position={[0, 55]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'同一页，同一个位置'} />
        </Rect>
        <Rect ref={g20append} position={[290, -60]} width={400} height={180} radius={16} fill={T.card} stroke={T.blue} lineWidth={3} opacity={0}>
          <Txt position={[0, -60]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'只追加'} />
          {[0, 1, 2].map(i => (
            <Rect key={`g20s-${i}`} ref={g20segs[i]} position={[180 + i * 110, 20]} width={90} height={50} radius={8} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0} />
          ))}
          <Txt position={[0, 55]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'新内容写到文件尾'} />
        </Rect>
        <Txt ref={g20pos} position={[-290, 70]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} text={'位置不变'} opacity={0} />
        <Line ref={g20ref} points={[[-290, 95], [-290, 150]]} stroke={T.yellow} lineWidth={3} endArrow opacity={0} />
      </Node>

      {/* d24：硬盘 vs 固态 */}
      <Node ref={g21} opacity={0}>
        <Circle ref={g21platter} position={[-280, -60]} width={220} height={220} fill={T.card} stroke={T.line} lineWidth={3} opacity={0} />
        <Node ref={g21spoke} position={[-280, -60]} opacity={0}>
          <Line points={[[0, 0], [0, -80]]} stroke={T.muted} lineWidth={2} />
          <Circle position={[0, -80]} width={14} height={14} fill={T.yellow} />
        </Node>
        <Circle ref={g21head} position={[-280, -160]} width={26} height={26} fill={T.yellow} opacity={0} />
        <Txt ref={g21headLab} position={[-280, -205]} fontSize={18} fill={T.yellow} fontFamily={FONT.sans} text={'磁头'} opacity={0} />
        <Txt ref={g21platterLab} position={[-280, 15]} fontSize={18} fill={T.muted} fontFamily={FONT.sans} text={'盘片'} opacity={0} />
        <Txt ref={g21sectorLab} position={[-110, -60]} fontSize={18} fill={T.yellow} fontFamily={FONT.sans} text={'扇区'} opacity={0} />
        <Rect ref={g21sector} position={[-180, -60]} width={60} height={36} radius={8} fill={T.yellow} opacity={0} />
        <Txt position={[-280, 90]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'机械硬盘'} />
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(i => (
          <Rect key={`g21c-${i}`} ref={g21chip[i]} position={[140 + (i % 4) * 90, -130 + Math.floor(i / 4) * 70]} width={76} height={56} radius={8} fill={T.card} stroke={T.line} lineWidth={2} opacity={0} />
        ))}
        <Rect ref={g21block} position={[185, -95]} width={166} height={126} radius={10} stroke={T.red} lineWidth={3} opacity={0} />
        <Txt ref={g21chipLab} position={[185, -185]} fontSize={18} fill={T.muted} fontFamily={FONT.sans} text={'芯片块'} opacity={0} />
        <Txt ref={g21eraseLab} position={[185, 60]} fontSize={SIZE.label} fill={T.red} fontFamily={FONT.sans} text={'擦除'} opacity={0} />
        <Txt ref={g21rewriteLab} position={[185, 60]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} text={'重写'} opacity={0} />
        <Txt ref={g21blockNote} position={[185, 130]} fontSize={18} fill={T.muted} fontFamily={FONT.sans} text={'擦除块：512 KB，是一页的 128 倍'} opacity={0} />
        <Txt position={[275, 90]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'固态硬盘'} />
      </Node>

      {/* d25/d26/d27：一次写三页 / 孤儿页 */}
      <Node ref={g22} opacity={0}>
        <Rect ref={g22a} position={[-380, -60]} width={220} height={110} radius={14} fill={T.card} stroke={T.line} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'叶页 A'} />
          <Txt ref={g22aCheck} position={[0, 32]} fontSize={SIZE.label} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'✓ 已写'} opacity={0} />
        </Rect>
        <Rect ref={g22b} position={[0, -60]} width={220} height={110} radius={14} fill={T.card} stroke={T.line} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'叶页 B'} />
          <Txt ref={g22bCheck} position={[0, 32]} fontSize={SIZE.label} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'✓ 已写'} opacity={0} />
        </Rect>
        <Rect ref={g22p} position={[380, -60]} width={220} height={110} radius={14} fill={T.card} stroke={T.line} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'父页'} />
          <Txt ref={g22pMiss} position={[0, 32]} fontSize={SIZE.label} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'✗ 没写'} opacity={0} />
        </Rect>
        <Rect ref={g22flash} width={1280} height={720} fill={T.white} opacity={0} />
        <Txt ref={g22orph1} position={[-420, 160]} fontSize={SIZE.label} fill={T.red} fontFamily={FONT.sans} text={'孤儿页'} opacity={0} />
        <Txt ref={g22orph2} position={[-40, 200]} fontSize={SIZE.label} fill={T.red} fontFamily={FONT.sans} text={'孤儿页'} opacity={0} />
        <Txt ref={g22oldRef} position={[380, 30]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'还指着旧页的位置'} opacity={0} />
        <Txt ref={g22oldResult} position={[380, 130]} fontSize={18} fill={T.muted} fontFamily={FONT.sans} text={'按旧父页去查：只有旧键，没有 334'} opacity={0} />
        <Txt ref={g22tally} position={[0, 90]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} text={'日志 3 条 + 树页 3 处 = 6 次'} opacity={0} />
      </Node>

      {/* d28：预写日志 */}
      <Node ref={g23} opacity={0}>
        <Rect ref={g23log} position={[-320, -60]} width={400} height={220} radius={16} fill={T.card} stroke={T.green} lineWidth={3} opacity={0}>
          <Txt position={[0, -80]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'预写日志'} />
          <Txt ref={g23e1} position={[0, -10]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'改页：先记下来'} opacity={0} />
          <Txt ref={g23e2} position={[0, 35]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'改页：再记一条'} opacity={0} />
        </Rect>
        <Txt ref={g23redo} position={[-320, 90]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'也叫重做日志'} opacity={0} />
        <Rect ref={g23tree} position={[280, -60]} width={300} height={160} radius={16} fill={T.card} stroke={T.blue} lineWidth={3} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'树页'} />
        </Rect>
        <Line ref={g23arr} points={[[-120, -60], [130, -60]]} stroke={T.green} lineWidth={3} endArrow opacity={0} />
        <Circle ref={g23chip} position={[-120, -60]} width={24} height={24} fill={T.green} opacity={0} />
        <Rect ref={g23gray} position={[280, -60]} width={300} height={160} radius={16} fill={T.bg} opacity={0} />
      </Node>

      {/* d29a/d29b：WAL 重放（深度延伸） */}
      <Node ref={g29} opacity={0}>
        <Rect ref={g29log} position={[-320, -60]} width={400} height={280} radius={16} fill={T.card} stroke={T.green} lineWidth={3} opacity={0}>
          <Txt position={[0, -110]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'预写日志'} />
          <Txt ref={g29e1} position={[0, -60]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'日志 1：改 251 那页'} opacity={0} />
          <Txt ref={g29e2} position={[0, -20]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'日志 2：写左叶页'} opacity={0} />
          <Txt ref={g29e3} position={[0, 20]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'日志 3：写右叶页'} opacity={0} />
          <Txt ref={g29e4} position={[0, 60]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'日志 4：父页加 337 和新右页的引用'} opacity={0} />
          <Txt ref={g29skip1} position={[150, -60]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'跳过'} opacity={0} />
        </Rect>
        <Rect ref={g29page} position={[280, -60]} width={300} height={160} radius={16} fill={T.card} stroke={T.blue} lineWidth={3} opacity={0}>
          <Txt position={[0, -45]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'251 那页'} />
          <Txt ref={g29lsn1} position={[0, 5]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'页上序号：1'} opacity={0} />
          <Txt ref={g29lsn0} position={[0, 5]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'页上序号：0'} opacity={0} />
          <Txt ref={g29lsn1g} position={[0, 5]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.mono} text={'页上序号：1'} opacity={0} />
          <Txt ref={g29new} position={[0, 45]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} text={'值已更新'} opacity={0} />
        </Rect>
        <Rect ref={g29gray} position={[280, -60]} width={300} height={160} radius={16} fill={T.bg} opacity={0} />
        <Txt ref={g29cmp1} position={[0, 85]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'页已写过：日志 1 ≤ 页上 1 → 跳过'} opacity={0} />
        <Txt ref={g29cmp2} position={[0, 125]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'页还没写：日志 1 > 页上 0 → 重做'} opacity={0} />
      </Node>

      {/* d29c：分裂断电重放走查（深度延伸，沿用 d29a/d29b 的延伸角标） */}
      <Node ref={g29c} opacity={0}>
        <Rect ref={g29cLog} position={[-320, -60]} width={400} height={240} radius={16} fill={T.card} stroke={T.green} lineWidth={3} opacity={0}>
          <Txt position={[0, -90]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'预写日志'} />
          <Txt ref={g29cE2} position={[0, -35]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'日志 2：写左叶页'} opacity={0} />
          <Txt ref={g29cE3} position={[0, 5]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'日志 3：写右叶页'} opacity={0} />
          <Txt ref={g29cE4} position={[0, 45]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'日志 4：父页加 337 和新右页的引用'} opacity={0} />
          <Txt ref={g29cSkip1} position={[150, -35]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'跳过'} opacity={0} />
          <Txt ref={g29cSkip2} position={[150, 5]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'跳过'} opacity={0} />
        </Rect>
        <Rect ref={g29cParent} position={[280, -140]} width={300} height={130} radius={16} fill={T.card} stroke={T.blue} lineWidth={3} opacity={0}>
          <Txt position={[0, -35]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'父页'} />
          <Txt ref={g29cLsn0} position={[0, 10]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'页上序号：0'} opacity={0} />
          <Txt ref={g29cLsn4} position={[0, 10]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.mono} text={'页上序号：4'} opacity={0} />
          <Txt ref={g29cNew} position={[0, 45]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} text={'边界 337 和引用已补'} opacity={0} />
        </Rect>
        <Rect ref={g29cLeafA} position={[185, 60]} width={170} height={80} radius={12} fill={T.card} stroke={T.line} lineWidth={2} opacity={0}>
          <Txt position={[0, -18]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'左叶页'} />
          <Txt position={[0, 18]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.mono} text={'序号：2'} />
        </Rect>
        <Rect ref={g29cLeafB} position={[375, 60]} width={170} height={80} radius={12} fill={T.card} stroke={T.line} lineWidth={2} opacity={0}>
          <Txt position={[0, -18]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'右叶页'} />
          <Txt position={[0, 18]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.mono} text={'序号：3'} />
        </Rect>
        <Line ref={g29cLink} points={[[280, -75], [280, 20]]} stroke={T.green} lineWidth={3} endArrow opacity={0} />
        <Txt ref={g29cOrphA} position={[185, 125]} fontSize={SIZE.label} fill={T.red} fontFamily={FONT.sans} text={'孤儿页'} opacity={0} />
        <Txt ref={g29cOrphB} position={[375, 125]} fontSize={SIZE.label} fill={T.red} fontFamily={FONT.sans} text={'孤儿页'} opacity={0} />
        <Txt ref={g29cBackA} position={[185, 125]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} text={'✓ 已接回'} opacity={0} />
        <Txt ref={g29cBackB} position={[375, 125]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} text={'✓ 已接回'} opacity={0} />
      </Node>
    </>
  );

  say('找到叶页，改掉值');
  yield* beat('d22a',
    all(h22().opacity(1, 0.5)),
    at('找到含这个键的叶页', h22leaf().opacity(1, 0.5)),
    at('改掉值', all(h22hl().opacity(1, 0.4), h22hl().stroke(T.green, 0.4))),
    at('写回磁盘', all(h22write().opacity(1, 0.5), h22disk().opacity(1, 0.5))),
    at('这 1 处', h22tally().opacity(1, 0.5)),
  );

  say('一共写两次');
  yield* beat('d22a2',
    at('先写日志一条', h22note().opacity(1, 0.5)),
    at('一共写两次', all(h22tally().opacity(0, 0.3), h22tally2().opacity(1, 0.5))),
  );

  say('引用还有效');
  yield* beat('d22b',
    at('覆盖不改变页的位置', h22leaf().scale(1.02, 0.8)),
    at('引用还有效', all(h22parent().opacity(1, 0.5), h22ref().opacity(1, 0.5))),
  );

  say('原地覆盖页');
  yield* beat('d23',
    all(h22().opacity(0, 0.5), g20().opacity(1, 0.5)),
    at('只追加', all(g20append().opacity(1, 0.5), g20segs[0]().opacity(1, 0.4), g20segs[1]().opacity(1, 0.4), g20segs[2]().opacity(1, 0.4))),
    at('原地覆盖', all(g20cover().opacity(1, 0.5), g20old().opacity(1, 0.4))),
    at('磁盘上的页', all(g20old().opacity(0, 0.4), g20new().opacity(1, 0.4))),
  );

  say('磁头寻道再写');
  yield* beat('d24',
    all(g20().opacity(0, 0.5), g21().opacity(1, 0.5)),
    at('移磁头', all(
      chain(g21platter().opacity(1, 0.5), g21head().opacity(1, 0.4), g21head().position([-190, -60], 1.2), g21head().position([-280, -160], 1.0)),
      chain(g21headLab().opacity(1, 0.4), g21headLab().position([-190, -100], 1.2), g21headLab().position([-280, -205], 1.0)),
      chain(g21platterLab().opacity(1, 0.4), g21spoke().opacity(1, 0.4)),
    )),
    at('盘片转到位置', g21spoke().rotation(90, 1.0)),
    at('覆盖扇区', all(g21sector().opacity(1, 0.5), g21sectorLab().opacity(1, 0.4))),
    at('固态硬盘', all(chain(g21chip[0]().opacity(1, 0.2), g21chip[1]().opacity(1, 0.2), g21chip[2]().opacity(1, 0.2), g21chip[3]().opacity(1, 0.2), g21chip[4]().opacity(1, 0.2), g21chip[5]().opacity(1, 0.2), g21chip[6]().opacity(1, 0.2), g21chip[7]().opacity(1, 0.2), g21chip[8]().opacity(1, 0.2), g21chip[9]().opacity(1, 0.2), g21chip[10]().opacity(1, 0.2), g21chip[11]().opacity(1, 0.2)), g21chipLab().opacity(1, 0.4))),
    at('擦除', all(g21block().opacity(1, 0.4), g21block().stroke(T.red, 0.4), g21eraseLab().opacity(1, 0.4))),
    at('重写', all(g21block().stroke(T.green, 0.6), g21eraseLab().opacity(0, 0.3), g21rewriteLab().opacity(1, 0.4))),
    at('五百一十二 KB', g21blockNote().opacity(1, 0.5)),
  );

  say('一次写三页');
  yield* beat('d25',
    all(g21().opacity(0, 0.5), g22().opacity(1, 0.5)),
    at('分裂时', chain(g22a().opacity(1, 0.4), g22b().opacity(1, 0.4), g22p().opacity(1, 0.4))),
    at('父页', g22p().stroke(T.yellow, 0.4)),
    at('一共三页', g22().scale(1.02, 0.8)),
    at('一共写六次', g22tally().opacity(1, 0.5)),
  );

  say('孤儿页');
  yield* beat('d26',
    at('断电', chain(g22flash().opacity(0.3, 0.15), g22flash().opacity(0, 0.4))),
    at('两片新叶页写了', all(g22aCheck().opacity(1, 0.4), g22bCheck().opacity(1, 0.4), g22pMiss().opacity(1, 0.4))),
    at('索引就坏了', all(g22p().stroke(T.red, 0.4), g22tally().opacity(0, 0.4))),
  );

  say('孤儿页');
  yield* beat('d27',
    at('孤儿页', all(g22a().position([-420, 80], 1.0), g22b().position([-40, 120], 1.0), g22orph1().opacity(1, 0.5), g22orph2().opacity(1, 0.5))),
    at('父页还指着旧页的位置', g22oldRef().opacity(1, 0.5)),
    at('按旧父页去查', g22oldResult().opacity(1, 0.5)),
    at('新加的三百三十四找不到了', chain(g22oldResult().scale(1.08, 0.5), g22oldResult().scale(1, 0.5))),
  );

  say('预写日志');
  yield* beat('d28',
    all(g22().opacity(0, 0.5), g23().opacity(1, 0.5)),
    at('预写日志', all(g23log().opacity(1, 0.5), g23e1().opacity(1, 0.4), g23tree().opacity(1, 0.5))),
    at('重做日志', all(g23redo().opacity(1, 0.5), g23e2().opacity(1, 0.4))),
    at('先把修改写进', all(g23arr().opacity(1, 0.4), g23chip().opacity(1, 0.4))),
    at('再去改树的页', chain(g23chip().position([130, -60], 1.0), g23tree().stroke(T.green, 0.4))),
  );

  say('日志记序号');
  yield* beat('d29a',
    all(g23().opacity(0, 0.5), g29().opacity(1, 0.5), g29log().opacity(1, 0.5), g29page().opacity(1, 0.5)),
    at('改了哪页', chain(g29e1().opacity(1, 0.4), g29e2().opacity(1, 0.4), g29e3().opacity(1, 0.4), g29e4().opacity(1, 0.4))),
    at('日志序号', all(g29lsn1().opacity(1, 0.5), extTag.opacity(1, 0.4))),
  );

  say('日志恢复树');
  yield* beat('d29b',
    at('崩溃重启', g29gray().opacity(0.7, 0.5)),
    at('日志一条一条重放', chain(g29log().scale(1.02, 0.5), g29log().scale(1, 0.5))),
    at('日志序号比页上序号大', g29cmp1().opacity(1, 0.5)),
    at('否则跳过', chain(g29cmp1().scale(1.08, 0.5), g29cmp1().scale(1, 0.5))),
    at('页写过了就跳过', chain(g29page().scale(1.05, 0.5), g29page().scale(1, 0.5))),
    at('没写过就重做', g29cmp2().opacity(1, 0.5)),
    at('二百五十一那页已经写过', chain(g29page().scale(1.05, 0.5), g29page().scale(1, 0.5))),
    at('页上序号是一', chain(g29lsn1().scale(1.25, 0.4), g29lsn1().scale(1, 0.4))),
    at('日志一号跳过', all(g29e1().opacity(0.45, 0.4), g29skip1().opacity(1, 0.4))),
    at('要是这页还没写', chain(g29page().scale(1.05, 0.5), g29page().scale(1, 0.5))),
    at('页上序号是零', all(g29lsn1().opacity(0, 0.4), g29lsn0().opacity(1, 0.4), g29page().scale(1.05, 0.4).to(1, 0.4))),
    at('日志一号就重做', all(chain(g29e1().opacity(1, 0.4), g29e1().fill(T.green, 0.4), g29skip1().opacity(0, 0.3), g29lsn0().opacity(0, 0.4), g29lsn1g().opacity(1, 0.4), g29new().opacity(1, 0.4)), g29page().scale(1.05, 0.4).to(1, 0.4))),
    at('恢复到一致的状态', g29gray().opacity(0, 0.6)),
  );

  say('分裂断电重放');
  yield* beat('d29c',
    all(g29().opacity(0, 0.5), g29c().opacity(1, 0.5), g29cLog().opacity(1, 0.5), g29cParent().opacity(1, 0.5), g29cLsn0().opacity(1, 0.4), g29cLeafA().opacity(1, 0.5), g29cLeafB().opacity(1, 0.5), g29cOrphA().opacity(1, 0.4), g29cOrphB().opacity(1, 0.4)),
    at('改值那次是一号', chain(g29cLog().scale(1.03, 0.8), g29cLog().scale(1, 0.8))),
    at('分裂那次是二、三、四号', g29cE2().opacity(1, 0.4)),
    at('分裂断电', chain(g29cE3().opacity(1, 0.4), g29cE4().opacity(1, 0.4))),
    at('两页新叶页序号已是最新', all(g29cLeafA().stroke(T.green, 0.5), g29cLeafB().stroke(T.green, 0.5))),
    at('跳过', all(g29cE2().opacity(0.45, 0.4), g29cE3().opacity(0.45, 0.4), g29cSkip1().opacity(1, 0.4), g29cSkip2().opacity(1, 0.4))),
    at('父页还没写', all(g29cE4().fill(T.green, 0.4), g29cParent().stroke(T.yellow, 0.4))),
    at('补上边界', chain(g29cLsn0().opacity(0, 0.4), g29cLsn4().opacity(1, 0.4), g29cNew().opacity(1, 0.4), g29cLink().opacity(1, 0.4))),
    at('孤儿页有了父页', all(g29cOrphA().opacity(0, 0.4), g29cOrphB().opacity(0, 0.4), g29cBackA().opacity(1, 0.4), g29cBackB().opacity(1, 0.4))),
    at('树恢复一致', all(g29cParent().stroke(T.green, 0.4), g29c().scale(1.02, 0.8))),
  );
});
