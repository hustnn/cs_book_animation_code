// U12 场景 3（MC，r7）：l28–l33 —— 向量化处理（一级缓存 + 紧凑循环 + 按位算子直接算压缩块）、
// 别的压缩方案一句带过、列族 ≠ 列式存储（点名 Cassandra、HBase、Bigtable）、
// 磁盘带宽之外还有 CPU 带宽（内存 → CPU 缓存、分支预测、流水线气泡、SIMD）、回扣。
// r7（修 r6 新手测试 P2-2/P2-3/P2-4）：l29b2 在“八个零”之前补桥接句（九、一只写十行、缺 8 个零按十八行补；十、二只写十二行、缺 6 个零也一样补），
// 桥接时两段尾零轻脉冲；l29c 追加层次桥接（整块 = 一次循环跑完整个压缩块，一段段 = 循环里按游程一段段对齐着算），桥接处各轻脉冲；
// l32d 三术语各加半句解释（提前猜“如果”/等判断时空转/一条指令同时算好几位），解释处三标签各轻脉冲，流水线注脚改成“等判断时空转”与旁白一致。
// r6（修 r5 新手测试 15 项中的 mc3 部分）：l28 缓存框内加行刻度 + “压前 3 行，压后 9 行（示意）”；
// l29a 补“逐条：18 行调 18 次函数 vs 一次整块算”对照；l29b2 游程表重做——每段标数字、
// 多出/切出的格填黄 + 文字标注、缓存框淡出、游程表放大居中；l29c 不再提“一次算一片”；
// l31b Bigtable → Cassandra/HBase 画继承箭头；l31c 屏上字改成“没法按列压”；
// l32d 开头加“压小后要搬的数据变少了”的因果，省带宽与算子无分支两条线分开说；
// l33 “一张位图”改成“几张位图”。
// 分镜：skill-ch03/beats-u12.md（l 系）；原文：DDIA §3.11（书页 p98–99，PDF p120–121）。
// 与 r1 的差别：拍号 b 系 → l 系；叙事顺序按设计走查表：向量化处理在 l28–l29（接在按位运算之后），
// 列族在 l31a–l31c（l31b 加三枚系统名牌），磁盘带宽在 l32a–l32d 作收束前的回望；
// l29a 明说“比逐条记录调函数、判条件快得多”的对比（r1 P2 #2）；l31b 点名原文侧栏的三个系统（r1 P2 #1）。
// 时长全部来自 timeline/u12.json（beat() 驱动），不手写 waitFor。
import {Circle, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, chain, createRef} from '@motion-canvas/core';
import {at, makeBeats} from '../../lib/beats';
import {FONT, SAFE, SIZE, T} from '../../lib/theme';
import timeline from '../../timeline/u12.json';

export default makeScene2D(function* (view) {
  view.fill(T.bg);
  const beat = makeBeats(timeline);

  const header = createRef<Txt>();
  const anchor = createRef<Txt>();
  const say = (text: string) => anchor().text(text);

  // ---- 第 1 页：列族 vs 列式存储 ----
  const p1 = createRef<Node>();
  const otherTag = createRef<Rect>();
  const famCard = createRef<Rect>();
  const colCard = createRef<Rect>();
  const neq = createRef<Txt>();
  const famChips = [0, 1, 2].map(() => createRef<Rect>());
  const colFiles = [0, 1, 2].map(() => createRef<Rect>());
  const famCap = createRef<Txt>();
  const colCap = createRef<Txt>();
  const noComp = createRef<Txt>();
  const rowish = createRef<Txt>();
  const sysTags = [0, 1, 2].map(() => createRef<Rect>());

  // ---- 第 2 页：磁盘 / 内存 / CPU 流水线 ----
  const p2 = createRef<Node>();
  const diskBox = createRef<Rect>();
  const memBox = createRef<Rect>();
  const cpuBox = createRef<Rect>();
  const arr1 = createRef<Txt>();
  const arr2 = createRef<Txt>();
  const bar1 = createRef<Rect>();
  const bar1Lab = createRef<Txt>();
  const bar2 = createRef<Rect>();
  const bar2Lab = createRef<Txt>();
  const oneOf = createRef<Txt>();
  const tagBranch = createRef<Rect>();
  const tagBubble = createRef<Rect>();
  const tagSimd = createRef<Rect>();

  // ---- 第 3 页：一级缓存 + 紧凑循环 + 向量化 ----
  const p3 = createRef<Node>();
  const l1Box = createRef<Rect>();
  const l1Title = createRef<Txt>();
  const chunk = createRef<Rect>();
  const chunkLab = createRef<Txt>();
  const loopDot = createRef<Circle>();
  const moreRows = createRef<Txt>();
  // r6 l28：缓存框内的行刻度（9 道）+ 压前/压后行数对照（示意数字）
  const rowTicks = [0, 1, 2, 3, 4, 5, 6, 7, 8].map(() => createRef<Rect>());
  const moreRowsSub = createRef<Txt>();
  // r6 l29a：“逐条 vs 一次整块算”对照
  const cmpSlow = createRef<Txt>();
  const cmpFast = createRef<Txt>();
  const opAnd = createRef<Rect>();
  const opOr = createRef<Rect>();
  const vecTitle = createRef<Txt>();
  // r4 l29b2：游程对齐演示——29 的 9，1 对 30 的 10，2，按位或得 9，3，6
  // 每行一个单位 16px，18 行共 288px，左起 x=-144；每段 [中心 x，宽度，是否 1]，
  // 段按对齐切分点切开（29 的 0×8 切成 0×2 + 0×6；30 的 0×10 切成 0×9 + 0×1）
  const rleDemo = createRef<Node>();
  const rleALab = createRef<Txt>();
  const rleBLab = createRef<Txt>();
  const rleRLab = createRef<Txt>();
  const rleRFull = createRef<Txt>();
  const rleCursor = createRef<Line>();
  const rleASegs = [0, 1, 2, 3].map(() => createRef<Rect>());
  const rleBSegs = [0, 1, 2, 3].map(() => createRef<Rect>());
  const rleRSegs = [0, 1, 2, 3].map(() => createRef<Rect>()); // R0、R1a、R1b、R2
  // r6 l29b2：每段标数字（A：9，1，2，6；B：9，1，2，6；结果：9，3，6——“3”跨 R1a+R1b 一整块）
  const rleANums = [0, 1, 2, 3].map(() => createRef<Txt>());
  const rleBNums = [0, 1, 2, 3].map(() => createRef<Txt>());
  const rleRNums = [0, 1, 2].map(() => createRef<Txt>());
  // r6 l29b2：多出/切出的格的文字标注（只靠一根黄竖线指不出是哪一格）
  const rleExtraLab = createRef<Txt>();
  const rleCutLab = createRef<Txt>();
  const RLE_A: [number, number, boolean][] = [[-72, 144, false], [8, 16, true], [32, 32, false], [96, 96, false]];
  const RLE_B: [number, number, boolean][] = [[-72, 144, false], [8, 16, false], [32, 32, true], [96, 96, false]];
  const RLE_R: [number, number, boolean][] = [[-72, 144, false], [8, 16, true], [32, 32, true], [96, 96, false]];

  // ---- 回扣 ----
  const p4 = createRef<Node>();
  const backNote = createRef<Txt>();
  const backCard1 = createRef<Rect>();
  const backCard2 = createRef<Rect>();
  const backArrow = createRef<Txt>();
  const backConcl = createRef<Txt>();

  view.add(
    <>
      <Txt
        ref={header}
        position={[-SAFE.halfW, -SAFE.halfH]}
        offset={[-1, -1]}
        fontSize={SIZE.label}
        fill={T.muted}
        fontFamily={FONT.sans}
        text={'列压缩：位图'}
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

      {/* 第 1 页 */}
      <Node ref={p1} opacity={0}>
        <Rect ref={otherTag} position={[0, -60]} width={420} height={70} radius={14} fill={T.card} stroke={T.line} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'还有别的压缩方案'} />
        </Rect>
        <Rect ref={famCard} position={[-290, -60]} width={460} height={240} radius={16} fill={T.card} stroke={T.blue} lineWidth={3} opacity={0}>
          <Txt position={[0, -90]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'列族'} />
        </Rect>
        <Rect ref={colCard} position={[290, -60]} width={460} height={240} radius={16} fill={T.card} stroke={T.green} lineWidth={3} opacity={0}>
          <Txt position={[0, -90]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'列式存储'} />
        </Rect>
        <Txt ref={neq} position={[0, -60]} fontSize={64} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'≠'} opacity={0} />
        {['行键', '列 A', '列 B'].map((t, i) => (
          <Rect
            key={`fam-${i}`}
            ref={famChips[i]}
            position={[-450 + i * 140, -95]}
            width={120}
            height={56}
            radius={10}
            fill={T.bg}
            stroke={T.blue}
            lineWidth={2}
            opacity={0}
          >
            <Txt fontSize={20} fill={T.text} fontFamily={FONT.sans} text={t} />
          </Rect>
        ))}
        {['列 A 文件', '列 B 文件', '列 C 文件'].map((t, i) => (
          <Rect
            key={`col-${i}`}
            ref={colFiles[i]}
            position={[290, -95 + i * 55]}
            width={200}
            height={40}
            radius={10}
            fill={T.bg}
            stroke={T.green}
            lineWidth={2}
            opacity={0}
          >
            <Txt fontSize={20} fill={T.text} fontFamily={FONT.sans} text={t} />
          </Rect>
        ))}
        <Txt ref={famCap} position={[-290, 90]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'一行的全部列存在一起'} opacity={0} />
        <Txt ref={colCap} position={[290, 90]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'每列单独成文件'} opacity={0} />
        <Txt ref={noComp} position={[-290, 140]} fontSize={SIZE.label} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'没法按列压'} opacity={0} />
        <Txt ref={rowish} position={[-290, 190]} fontSize={SIZE.body} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'整体还是行式'} opacity={0} />
        {['Cassandra', 'HBase', 'Bigtable'].map((t, i) => (
          <Rect
            key={`sys-${i}`}
            ref={sysTags[i]}
            position={[-450 + i * 160, 240]}
            width={150}
            height={44}
            radius={10}
            fill={T.card}
            stroke={T.purple}
            lineWidth={2}
            opacity={0}
          >
            <Txt fontSize={20} fill={T.purple} fontFamily={FONT.sans} text={t} />
          </Rect>
        ))}
      </Node>

      {/* 第 2 页 */}
      <Node ref={p2} opacity={0}>
        <Rect ref={diskBox} position={[-400, -80]} width={280} height={120} radius={16} fill={T.card} stroke={T.blue} lineWidth={3} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'磁盘'} />
        </Rect>
        <Rect ref={memBox} position={[0, -80]} width={280} height={120} radius={16} fill={T.card} stroke={T.blue} lineWidth={3} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'内存'} />
        </Rect>
        <Rect ref={cpuBox} position={[400, -80]} width={280} height={120} radius={16} fill={T.card} stroke={T.blue} lineWidth={3} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'CPU'} />
        </Rect>
        <Txt ref={arr1} position={[-200, -80]} fontSize={SIZE.title} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'→'} opacity={0} />
        <Txt ref={arr2} position={[200, -80]} fontSize={SIZE.title} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'→'} opacity={0} />
        <Rect ref={bar1} position={[-200, 60]} width={200} height={30} radius={15} fill={T.blue} opacity={0} />
        <Txt ref={bar1Lab} position={[-200, 115]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'磁盘到内存的带宽'} opacity={0} />
        <Rect ref={bar2} position={[200, 60]} width={200} height={30} radius={15} fill={T.blue} opacity={0} />
        <Txt ref={bar2Lab} position={[200, 115]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'内存到 CPU 缓存的带宽'} opacity={0} />
        <Txt ref={oneOf} position={[-200, 160]} fontSize={20} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'只是其中一个瓶颈'} opacity={0} />
        {/* r4 l32d：每张标签下加一句白话注脚（B51：术语密集无视觉落点） */}
        <Rect ref={tagBranch} position={[-380, 220]} width={200} height={76} radius={12} fill={T.card} stroke={T.purple} lineWidth={2} opacity={0}>
          <Txt position={[0, -16]} fontSize={20} fill={T.text} fontFamily={FONT.sans} text={'分支预测'} />
          <Txt position={[0, 16]} fontSize={15} fill={T.muted} fontFamily={FONT.sans} text={'猜错了，要重算'} />
        </Rect>
        <Rect ref={tagBubble} position={[0, 220]} width={220} height={76} radius={12} fill={T.card} stroke={T.purple} lineWidth={2} opacity={0}>
          <Txt position={[0, -16]} fontSize={20} fill={T.text} fontFamily={FONT.sans} text={'流水线气泡'} />
          <Txt position={[0, 16]} fontSize={15} fill={T.muted} fontFamily={FONT.sans} text={'等判断时空转'} />
        </Rect>
        <Rect ref={tagSimd} position={[380, 220]} width={220} height={76} radius={12} fill={T.card} stroke={T.purple} lineWidth={2} opacity={0}>
          <Txt position={[0, -16]} fontSize={20} fill={T.text} fontFamily={FONT.sans} text={'单指令多数据'} />
          <Txt position={[0, 16]} fontSize={15} fill={T.muted} fontFamily={FONT.sans} text={'一条指令，算多份数据'} />
        </Rect>
      </Node>

      {/* 第 3 页 */}
      <Node ref={p3} opacity={0}>
        <Rect ref={l1Box} position={[0, -100]} width={760} height={260} radius={20} fill={T.card} stroke={T.blue} lineWidth={3} opacity={0}>
          <Txt ref={l1Title} position={[0, -95]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'一级缓存'} opacity={0} />
        </Rect>
        <Rect ref={chunk} position={[0, -60]} width={300} height={130} radius={14} fill={T.bg} stroke={T.green} lineWidth={3} opacity={0}>
          <Txt ref={chunkLab} position={[0, -40]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} text={'压缩列数据'} opacity={0} />
        </Rect>
        <Circle ref={loopDot} position={[-280, -125]} width={22} height={22} fill={T.yellow} opacity={0} />
        <Txt ref={moreRows} position={[0, 110]} fontSize={SIZE.body} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'同样大小的缓存，装进更多行'} opacity={0} />
        {/* r6 l28：行刻度——压缩块变宽后，块里出现 9 道刻度，每道是一行 */}
        {rowTicks.map((_, i) => (
          <Rect key={`tick-${i}`} ref={rowTicks[i]} position={[-240 + i * 60, -30]} width={8} height={60} radius={4} fill={T.green} opacity={0} />
        ))}
        <Txt ref={moreRowsSub} position={[0, 150]} fontSize={20} fill={T.muted} fontFamily={FONT.sans} text={'压前 3 行，压后 9 行（示意）'} opacity={0} />
        {/* r6 l29a：逐条 vs 一次整块算（与 l28 的行数对照同槽，先后出现） */}
        <Txt ref={cmpSlow} position={[0, 140]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'逐条：18 行调 18 次函数'} opacity={0} />
        <Txt ref={cmpFast} position={[0, 180]} fontSize={SIZE.label} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'一次整块算'} opacity={0} />
        <Rect ref={opAnd} position={[-150, -25]} width={200} height={60} radius={12} fill={T.card} stroke={T.yellow} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'按位与'} />
        </Rect>
        <Rect ref={opOr} position={[150, -25]} width={200} height={60} radius={12} fill={T.card} stroke={T.yellow} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'按位或'} />
        </Rect>
        <Txt ref={vecTitle} position={[0, 190]} fontSize={40} fontWeight={700} fill={T.yellow} fontFamily={FONT.serif} text={'向量化处理'} opacity={0} />
        {/* r4 l29b2：游程对齐演示（29：9，1；30：10，2；或 = 9，3，6），在缓存框下方 */}
        <Node ref={rleDemo} opacity={0}>
          <Txt ref={rleALab} position={[-180, 45]} offset={[1, 0]} fontSize={20} fill={T.text} fontFamily={FONT.mono} text={'29：9，1'} opacity={0} />
          <Txt ref={rleBLab} position={[-180, 90]} offset={[1, 0]} fontSize={20} fill={T.text} fontFamily={FONT.mono} text={'30：10，2'} opacity={0} />
          {/* r5：按位或标签放大（r4 只有 20px，太小） */}
          <Txt ref={rleRLab} position={[-180, 135]} offset={[1, 0]} fontSize={28} fontWeight={700} fill={T.green} fontFamily={FONT.mono} text={'按位或 ='} opacity={0} />
          <Txt ref={rleRFull} position={[-180, 135]} offset={[1, 0]} fontSize={28} fontWeight={700} fill={T.green} fontFamily={FONT.mono} text={'按位或 = 9，3，6'} opacity={0} />
          {RLE_A.map(([x, w, one], i) => (
            <Rect key={`ra-${i}`} ref={rleASegs[i]} position={[x, 45]} width={w} height={28} radius={4} fill={one ? T.green : T.card} stroke={T.line} lineWidth={1} opacity={0} />
          ))}
          {RLE_B.map(([x, w, one], i) => (
            <Rect key={`rb-${i}`} ref={rleBSegs[i]} position={[x, 90]} width={w} height={28} radius={4} fill={one ? T.green : T.card} stroke={T.line} lineWidth={1} opacity={0} />
          ))}
          {RLE_R.map(([x, w, one], i) => (
            // r5 P2 #1：结果行 1×3 两段（R1a、R1b）去缝——描边同绿、无圆角，拼成一整块
            <Rect key={`rr-${i}`} ref={rleRSegs[i]} position={[x, 135]} width={w} height={28} radius={one ? 0 : 4} fill={one ? T.green : T.card} stroke={one ? T.green : T.line} lineWidth={1} opacity={0} />
          ))}
          {/* r6 l29b2：每段标数字——段宽就是游程值，数字写在段上 */}
          {['9', '1', '2', '6'].map((t, i) => (
            <Txt key={`na-${i}`} ref={rleANums[i]} position={[RLE_A[i][0], 45]} fontSize={18} fontWeight={700} fill={RLE_A[i][2] ? T.bg : T.text} fontFamily={FONT.mono} text={t} opacity={0} />
          ))}
          {['9', '1', '2', '6'].map((t, i) => (
            <Txt key={`nb-${i}`} ref={rleBNums[i]} position={[RLE_B[i][0], 90]} fontSize={18} fontWeight={700} fill={RLE_B[i][2] ? T.bg : T.text} fontFamily={FONT.mono} text={t} opacity={0} />
          ))}
          <Txt ref={rleRNums[0]} position={[-72, 135]} fontSize={18} fontWeight={700} fill={T.text} fontFamily={FONT.mono} text={'9'} opacity={0} />
          <Txt ref={rleRNums[1]} position={[24, 135]} fontSize={18} fontWeight={700} fill={T.bg} fontFamily={FONT.mono} text={'3'} opacity={0} />
          <Txt ref={rleRNums[2]} position={[96, 135]} fontSize={18} fontWeight={700} fill={T.text} fontFamily={FONT.mono} text={'6'} opacity={0} />
          {/* r6 l29b2：多出/切出的格各配一句文字标注，写在演示表右侧 */}
          <Txt ref={rleExtraLab} position={[170, 90]} offset={[-1, 0]} fontSize={18} fill={T.yellow} fontFamily={FONT.sans} text={'多出 1 个 0 → 留给下一段'} opacity={0} />
          <Txt ref={rleCutLab} position={[170, 45]} offset={[-1, 0]} fontSize={18} fill={T.yellow} fontFamily={FONT.sans} text={'切出 2 个 0 对两个 1'} opacity={0} />
          <Line ref={rleCursor} position={[-144, 0]} points={[[0, 28], [0, 152]]} stroke={T.yellow} lineWidth={3} opacity={0} />
        </Node>
      </Node>

      {/* 回扣 */}
      <Node ref={p4} opacity={0}>
        <Txt ref={backNote} position={[0, -180]} fontSize={SIZE.body} fill={T.muted} fontFamily={FONT.sans} text={'重复的值不用存几十亿遍'} opacity={0} />
        <Rect ref={backCard1} position={[-300, -60]} width={360} height={110} radius={16} fill={T.card} stroke={T.yellow} lineWidth={3} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'几张位图'} />
        </Rect>
        <Txt ref={backArrow} position={[0, -60]} fontSize={SIZE.title} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'+'} opacity={0} />
        <Rect ref={backCard2} position={[300, -60]} width={360} height={110} radius={16} fill={T.card} stroke={T.yellow} lineWidth={3} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'一次按位运算'} />
        </Rect>
        <Txt ref={backConcl} position={[0, 90]} fontSize={40} fontWeight={700} fill={T.green} fontFamily={FONT.serif} text={'查询就答完了'} opacity={0} />
      </Node>
    </>
  );

  // r6 N6：Cassandra / HBase → Bigtable 的继承箭头——按 UML 画法，箭头从子指向父（它们继承自 Bigtable）；
  // 肘形线从两枚牌顶边向上绕到 y=168 再垂进 Bigtable 牌顶边。y=168 夹在“没法按列压”红字下沿与
  // “整体还是行式”黄字上沿之间；两根竖线分别落在 x=-450、x=-130，都在“整体还是行式”
  // （x -380..-200）的范围之外，不穿字（第一次 QA 里 Bigtable → 两枚牌的方向竖线穿过该行字，crossed）。
  const arrBTH = new Line({
    points: [[-290, 218], [-290, 168], [-130, 168], [-130, 218]],
    stroke: T.yellow,
    lineWidth: 3,
    endArrow: true,
    arrowSize: 10,
    end: 0,
  });
  const arrBTC = new Line({
    points: [[-450, 218], [-450, 168], [-130, 168], [-130, 218]],
    stroke: T.yellow,
    lineWidth: 3,
    endArrow: true,
    arrowSize: 10,
    end: 0,
  });
  p1().add([arrBTH, arrBTC]);

  say('整块塞进一级缓存跑');
  yield* beat('l28',
    all(p3().opacity(1, 0.5), l1Box().opacity(1, 0.5), l1Title().opacity(1, 0.4)),
    at('取一小块', chain(chunk().opacity(1, 0.5), chunkLab().opacity(1, 0.4))),
    at('一级缓存', chain(l1Box().scale(1.02, 0.4).to(1, 0.4), chunk().scale(1.05, 0.4).to(1, 0.4))),
    at('紧凑循环', chain(
      loopDot().opacity(1, 0.3),
      loopDot().position([280, -125], 0.9),
      loopDot().position([280, 5], 0.9),
      loopDot().position([-280, 5], 0.9),
      loopDot().position([-280, -125], 0.9),
    )),
    at('装进更多行', all(
      chunk().width(560, 0.8),
      moreRows().opacity(1, 0.5),
      // r6 l28：“装进更多行”要有画面支撑——块变宽时块里出现 9 道行刻度，下方给压前/压后行数对照（示意）
      ...rowTicks.map(t => t().opacity(1, 0.4)),
      moreRowsSub().opacity(1, 0.5),
    )),
  );

  say('跑循环，比逐条快');
  yield* beat('l29a',
    // r6 l29a：行数对照让位给“逐条 vs 一次整块算”对照（同槽，先后出现）；
    // 行刻度也在这里淡出——l29b 的按位与/或卡片落在同一位置，刻度留着会和卡片文字叠边（第一次 QA 的 edge）
    all(moreRowsSub().opacity(0, 0.4), ...rowTicks.map(t => t().opacity(0, 0.4))),
    at('这种循环', chain(
      loopDot().position([280, -125], 0.9),
      loopDot().position([280, 5], 0.9),
      loopDot().position([-280, 5], 0.9),
      loopDot().position([-280, -125], 0.9),
    )),
    // r6 l24/l29a：“比逐条快”要有画面对照——逐条是 18 行调 18 次函数，这里一次整块算完
    at('逐条是十八行', cmpSlow().opacity(1, 0.5)),
    at('一次整块算完', chain(
      cmpFast().opacity(1, 0.5),
      cmpFast().scale(1.05, 0.3).to(1, 0.3),
    )),
  );

  say('直接在压缩块上算');
  yield* beat('l29b',
    at('按位与、按位或', chain(opAnd().opacity(1, 0.5), opOr().opacity(1, 0.5))),
    at('压缩好的数据块', chain(opAnd().stroke(T.green, 0.4), opOr().stroke(T.green, 0.4))),
  );

  // r5 l29b2：点名按位或，讲清游程在边界处切开重分（多出的一个零留给下一段；8 个零切出 2 个对两个一）。
  // 对齐切分点（单位）：9、10、12、18；结果 0×9、1×3、0×6 = 9，3，6（与位图按位或一致：1 在第 10、11、12 位）。
  // 结果行的 1 段分两段出现（R1a 是第 2 步的 1×1，R1b 是第 3 步的 1×2），拼成一段 1×3（r5 去缝）。
  say('游程对齐着算，不用解开');
  yield* beat('l29b2',
    // r6 l29b2：游程表放大居中（×1.2，上移），一级缓存框淡出——上半屏让给游程表；
    // 行数对照与逐条对照也一并淡出
    all(rleDemo().opacity(1, 0.5), moreRows().opacity(0, 0.4), moreRowsSub().opacity(0, 0.4),
      cmpSlow().opacity(0, 0.4), cmpFast().opacity(0, 0.4),
      l1Box().opacity(0, 0.5), l1Title().opacity(0, 0.4), chunk().opacity(0, 0.4),
      loopDot().opacity(0, 0.4), opAnd().opacity(0, 0.4), opOr().opacity(0, 0.4),
      ...rowTicks.map(t => t().opacity(0, 0.4)),
      rleDemo().scale(1.2, 0.6), rleDemo().position([0, -24], 0.6)),
    // r5：先点名算的是按位或，再拿两张游程表
    at('按位或', rleRLab().opacity(1, 0.4)),
    at('二十九的九、一', chain(
      rleALab().opacity(1, 0.4),
      ...rleASegs.map(s => s().opacity(1, 0.4)),
      // r6：每段标数字（9，1，2，6）
      ...rleANums.map(n => n().opacity(1, 0.4)),
    )),
    at('三十的十、二', chain(
      rleBLab().opacity(1, 0.4),
      ...rleBSegs.map(s => s().opacity(1, 0.4)),
      // r6：每段标数字（9，1，2，6）
      ...rleBNums.map(n => n().opacity(1, 0.4)),
    )),
    at('游程一段段对齐', chain(
      rleCursor().opacity(1, 0.4),
    )),
    at('九个零对十个零', chain(
      rleCursor().position([0, 0], 0.5),
      all(rleASegs[0]().stroke(T.yellow, 0.3), rleASegs[0]().lineWidth(3, 0.3), rleBSegs[0]().stroke(T.yellow, 0.3), rleBSegs[0]().lineWidth(3, 0.3)),
      rleRSegs[0]().opacity(1, 0.4),
      rleRNums[0]().opacity(1, 0.4),
    )),
    // r6：多出的一个零——30 的 10 个零里，第 10 个零留给下一段，对 29 的 1；
    // r5 只描黄边，采样帧里只剩一根黄竖线指不出是哪一格——这回整格填黄 + 文字标注
    at('多出的一个零', chain(
      all(rleBSegs[1]().stroke(T.yellow, 0.3), rleBSegs[1]().lineWidth(3, 0.3), rleBSegs[1]().fill(T.yellow, 0.3)),
      rleExtraLab().opacity(1, 0.4),
    )),
    at('一个一对一个零', chain(
      all(rleASegs[0]().stroke(T.line, 0.3), rleASegs[0]().lineWidth(1, 0.3), rleBSegs[0]().stroke(T.line, 0.3), rleBSegs[0]().lineWidth(1, 0.3), rleBSegs[1]().stroke(T.line, 0.3), rleBSegs[1]().lineWidth(1, 0.3), rleBSegs[1]().fill(T.card, 0.3)),
      rleExtraLab().opacity(0, 0.3),
      rleCursor().position([16, 0], 0.5),
      all(rleASegs[1]().stroke(T.yellow, 0.3), rleASegs[1]().lineWidth(3, 0.3), rleBSegs[1]().stroke(T.yellow, 0.3), rleBSegs[1]().lineWidth(3, 0.3)),
      rleRSegs[1]().opacity(1, 0.4),
    )),
    // r7 P2-2：桥接句——九、一只写了十行，末尾缺的 8 个零（2 + 6 两段）按十八行补上；十、二只写了十二行，末尾缺的 6 个零也一样补上。
    // r7-fix2：段本身的 1.08 倍缩放脉冲太小，定格检测看不见（同 r6 l32d 箭头的教训：小元素只变色/小缩放不够，必须一次改上千像素）。
    // 改成游程演示整体 1.26 倍脉冲（大元素，必检出）+ 尾段描黄边点名：桥接五处锚点各脉冲一次。
    at('只写了十行', rleDemo().scale(1.26, 0.4).to(1.2, 0.4)),
    at('末尾缺的八个零', all(
      rleDemo().scale(1.26, 0.4).to(1.2, 0.4),
      all(rleASegs[2]().stroke(T.yellow, 0.3), rleASegs[2]().lineWidth(3, 0.3), rleASegs[3]().stroke(T.yellow, 0.3), rleASegs[3]().lineWidth(3, 0.3)),
    )),
    at('按十八行补上', rleDemo().scale(1.26, 0.4).to(1.2, 0.4)),
    at('只写了十二行', rleDemo().scale(1.26, 0.4).to(1.2, 0.4)),
    at('末尾缺的六个零', all(
      rleDemo().scale(1.26, 0.4).to(1.2, 0.4),
      all(rleBSegs[3]().stroke(T.yellow, 0.3), rleBSegs[3]().lineWidth(3, 0.3)),
    )),
    // r6：切出两个零——29 末尾 8 个零里先切出 2 个对 30 的两个一；“3”在 1×3 拼满时亮出
    at('八个零对两个一', chain(
      all(rleASegs[1]().stroke(T.line, 0.3), rleASegs[1]().lineWidth(1, 0.3), rleBSegs[1]().stroke(T.line, 0.3), rleBSegs[1]().lineWidth(1, 0.3)),
      rleCursor().position([48, 0], 0.5),
      all(rleASegs[2]().stroke(T.yellow, 0.3), rleASegs[2]().lineWidth(3, 0.3), rleASegs[2]().fill(T.yellow, 0.3), rleBSegs[2]().stroke(T.yellow, 0.3), rleBSegs[2]().lineWidth(3, 0.3)),
      rleCutLab().opacity(1, 0.4),
      rleRSegs[2]().opacity(1, 0.4),
      rleRNums[1]().opacity(1, 0.4),
    )),
    at('六个零对六个零', chain(
      all(rleASegs[2]().stroke(T.line, 0.3), rleASegs[2]().lineWidth(1, 0.3), rleASegs[2]().fill(T.card, 0.3), rleBSegs[2]().stroke(T.line, 0.3), rleBSegs[2]().lineWidth(1, 0.3)),
      rleCutLab().opacity(0, 0.3),
      rleCursor().position([144, 0], 0.5),
      all(rleASegs[3]().stroke(T.yellow, 0.3), rleASegs[3]().lineWidth(3, 0.3), rleBSegs[3]().stroke(T.yellow, 0.3), rleBSegs[3]().lineWidth(3, 0.3)),
      rleRSegs[3]().opacity(1, 0.4),
      rleRNums[2]().opacity(1, 0.4),
    )),
    at('九、三、六', chain(
      all(rleASegs[3]().stroke(T.line, 0.3), rleASegs[3]().lineWidth(1, 0.3), rleBSegs[3]().stroke(T.line, 0.3), rleBSegs[3]().lineWidth(1, 0.3)),
      rleCursor().opacity(0, 0.4),
      all(rleRLab().opacity(0, 0.3), rleRFull().opacity(1, 0.3)),
      all(...rleRSegs.map(s => s().scale(1.04, 0.25))),
      all(...rleRSegs.map(s => s().scale(1, 0.25))),
    )),
  );

  // r5 l29c：把三者接起来——一段段对齐算、一次算一片，就是紧凑循环里直接在压缩块上算的向量化处理；
  // 游程演示留在屏上当对照，不再淡出。
  // r6 N4：l29c 不再提“一次算一片”（“片”此前没出现过，l32d 才接上）；
  // 演示表已放大到 1.2 倍，脉冲按 1.23 → 1.2 走，不再缩回 1.0。
  say('向量化处理');
  yield* beat('l29c',
    at('一段段对齐算', chain(rleDemo().scale(1.23, 0.4).to(1.2, 0.4))),
    at('向量化处理', vecTitle().opacity(1, 0.5)),
    // r6 QA 修：新 l29c 只有 6.1s，标题亮起后约 4 秒没有动作，闲出 4.1s warn——
    // 念到“直接在压缩好的数据块上算”时结果行再轻脉冲一次
    at('直接在压缩好的数据块上算', chain(
      all(...rleRSegs.map(s => s().scale(1.04, 0.3))),
      all(...rleRSegs.map(s => s().scale(1, 0.3))),
    )),
    // r7 P2-4：层次桥接——整块 = 一次循环跑完整个压缩块（不用逐条调函数）；一段段 = 循环里按游程一段段对齐着算。
    // 三处轻脉冲把新加的约 9s 旁白切开，不留 ≥6s 定格。
    at('整块是指一次循环跑完整个压缩块', chain(rleDemo().scale(1.23, 0.4).to(1.2, 0.4))),
    at('不用逐条调函数', vecTitle().scale(1.05, 0.3).to(1, 0.3)),
    at('一段段是指循环里按游程一段段对齐着算', chain(
      all(...rleRSegs.map(s => s().scale(1.04, 0.3))),
      all(...rleRSegs.map(s => s().scale(1, 0.3))),
    )),
    // r7-fix：QA l29c 尾部 idle warn 3.56s——桥接尾句念完前结果行再轻脉冲一次收尾
    at('对齐着算', chain(
      all(...rleRSegs.map(s => s().scale(1.04, 0.3))),
      all(...rleRSegs.map(s => s().scale(1, 0.3))),
    )),
  );

  say('还有别的压缩方案');
  yield* beat('l30',
    all(p3().opacity(0, 0.5), p1().opacity(1, 0.5), otherTag().opacity(1, 0.5)),
    at('别的压缩方案', otherTag().stroke(T.yellow, 0.4)),
    at('不细讲', otherTag().opacity(0.4, 0.5)),
  );

  say('列族 ≠ 列式存储');
  yield* beat('l31a',
    all(otherTag().opacity(0, 0.4), famCard().opacity(1, 0.5), colCard().opacity(1, 0.5)),
    at('列族不是列式存储', neq().opacity(1, 0.5)),
  );

  say('列族：Cassandra、HBase，继承自 Bigtable');
  yield* beat('l31b',
    at('列族的概念', chain(sysTags[0]().opacity(1, 0.4), sysTags[1]().opacity(1, 0.4))),
    // r6 N6：“它们继承自 Bigtable”——Cassandra、HBase 牌顶边各画一根肘形箭头指向 Bigtable（UML 子→父方向）
    at('继承自 Bigtable', chain(
      sysTags[2]().opacity(1, 0.4),
      arrBTH.end(1, 0.6),
      arrBTC.end(1, 0.6),
    )),
  );

  say('一行存在一起，还是行式');
  yield* beat('l31c',
    // r6 QA 修：继承箭头在 l31b 讲完使命就淡出——“整体还是行式”出现在 l31c，
    // 箭头竖线（x=-290）正穿过它；箭头若留到 l31c 末尾就是 crossed（第一次 QA 的教训）
    all(arrBTH.opacity(0, 0.4), arrBTC.opacity(0, 0.4)),
    at('列族里', chain(famChips[0]().opacity(1, 0.4), famChips[1]().opacity(1, 0.4), famChips[2]().opacity(1, 0.4))),
    at('和行键存在一起', chain(famCap().opacity(1, 0.5), colFiles[0]().opacity(1, 0.4), colFiles[1]().opacity(1, 0.4), colFiles[2]().opacity(1, 0.4), colCap().opacity(1, 0.5))),
    // r5 l31c：行键就是这一行的名字，找行先找它
    at('行键就是这一行的名字', chain(
      famChips[0]().scale(1.15, 0.3).to(1, 0.3),
      famChips[0]().stroke(T.yellow, 0.3),
    )),
    // r6 定格修：l31c 念到“找行先找它”之后到“没法按列压”之间 7.37s 画面全静；
    // 念到“一行的列都跟着行键走”时三枚列族芯片一起脉冲，把定格劈成两段
    at('一行的列都跟着行键走', all(
      famChips[0]().scale(1.12, 0.3).to(1, 0.3),
      famChips[1]().scale(1.12, 0.3).to(1, 0.3),
      famChips[2]().scale(1.12, 0.3).to(1, 0.3),
    )),
    at('没法按列压', noComp().opacity(1, 0.5)),
    at('还是行式的', chain(rowish().opacity(1, 0.5), famCard().stroke(T.red, 0.5))),
  );

  say('不只磁盘带宽');
  yield* beat('l32a',
    all(p1().opacity(0, 0.5), p2().opacity(1, 0.5), diskBox().opacity(1, 0.4), memBox().opacity(1, 0.4), cpuBox().opacity(1, 0.4), arr1().opacity(1, 0.3), arr2().opacity(1, 0.3)),
    at('不只省磁盘', diskBox().stroke(T.yellow, 0.4)),
  );

  say('磁盘到内存的带宽');
  yield* beat('l32b',
    at('扫几百万行', chain(bar1().opacity(1, 0.5), bar1().width(260, 1.0))),
    at('从磁盘取进内存', bar1Lab().opacity(1, 0.5)),
  );

  say('只是其中一个瓶颈');
  yield* beat('l32c',
    at('其中一个瓶颈', oneOf().opacity(1, 0.5)),
  );

  say('还要操心 CPU 带宽');
  yield* beat('l32d',
    // r6 N3：开头加半句因果——压得小，内存到 CPU 之间要搬的数据也变少了；
    // “省带宽”与“算子没分支”是两条线：先让内存 → CPU 的箭头亮一下，再亮带宽条与三术语
    at('要搬的数据也变少了', chain(arr2().fill(T.green, 0.4), arr2().scale(1.2, 0.3).to(1, 0.3))),
    // r6 定格修：l32d 开头到“内存到 CPU 缓存”之间 7.40s 画面全静；
    // 念到“先松了一口气”时内存 → CPU 的箭头再闪一次，把定格劈成两段。
    // 注意：单字箭头“→”只有约 300 像素，颜色闪（绿→黄→绿）实测只亮约 0.3s、
    // 帧平均差约 0.00017，低于定格检测的噪声阈值 0.0003，第一次修没起作用；
    // 所以颜色闪之外再加 1.6 倍缩放（并行），放大的字形一次改上千像素才够格
    at('先松了一口气', all(
      chain(arr2().fill(T.yellow, 0.4), arr2().fill(T.green, 0.4)),
      arr2().scale(1.6, 0.4).to(1, 0.4),
    )),
    at('内存到 CPU 缓存', chain(bar2().opacity(1, 0.5), bar2Lab().opacity(1, 0.5))),
    at('分支预测', tagBranch().opacity(1, 0.5)),
    at('流水线起泡', tagBubble().opacity(1, 0.5)),
    at('单指令多数据', tagSimd().opacity(1, 0.5)),
    // r7 P2-3：三术语各加半句解释——解释处对应标签轻脉冲一次（只解释到“为什么位图算子沾不上这三件事”为止，不展开 CPU 体系结构）
    at('提前猜', tagBranch().scale(1.06, 0.3).to(1, 0.3)),
    at('等判断时会空转', tagBubble().scale(1.06, 0.3).to(1, 0.3)),
    at('同时算好几位', tagSimd().scale(1.06, 0.3).to(1, 0.3)),
    // r7-fix2：定格——“提前猜”脉冲到流水线标签出现之间空 5.03s（warn），“同时算好几位”脉冲到尾句描亮之间空 4.43s（warn）。
    // 各补一处脉冲：念到“猜错了要重算”时分支标签再脉冲一次；念到“位图算子只是按位操作”时三标签一起轻脉冲（转折处，三条线收束）。
    at('猜错了要重算', tagBranch().scale(1.06, 0.3).to(1, 0.3)),
    at('位图算子只是按位操作', all(
      tagBranch().scale(1.04, 0.3).to(1, 0.3),
      tagBubble().scale(1.04, 0.3).to(1, 0.3),
      tagSimd().scale(1.04, 0.3).to(1, 0.3),
    )),
    // r5 l32d：三术语各与位图算子接一句——没有分支可猜错、流水线不用等判断、一次算一片
    at('没有分支可猜错', tagBranch().stroke(T.yellow, 0.4)),
    at('流水线不用等判断', tagBubble().stroke(T.yellow, 0.4)),
    at('一次算一片', tagSimd().stroke(T.yellow, 0.4)),
  );

  say('几张位图，一次运算');
  yield* beat('l33',
    all(p2().opacity(0, 0.5), p4().opacity(1, 0.5)),
    at('不用存几十亿遍', backNote().opacity(1, 0.5)),
    at('几张位图', chain(backCard1().opacity(1, 0.5), backArrow().opacity(1, 0.4), backCard2().opacity(1, 0.5))),
    at('查询就答完了', backConcl().opacity(1, 0.5)),
  );
});
