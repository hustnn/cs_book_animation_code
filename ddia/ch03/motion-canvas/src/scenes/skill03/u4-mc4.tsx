// U4 场景 4（MC，r3）：d30a–d32f —— 删键更复杂、闩锁与后台原子换段、写时复制、键缩写、
// B 加树、叶页顺序、兄弟指针、分形树、两派回扣、结尾句。分镜：skill-ch03/beats-u4.md；
// r7（判定 #31）：d30a 删除“页删空了要合并，边界要重算”加脉冲；d30b3 混搭例子提前到拍首走一遍；
// d30c 闩锁定义“动哪页，锁哪页，用完就放”；d31a 新版本一路传到根的链 + 旧页回收 + 根指针原子切换；
// d31b 砍掉的后缀标出来；d32d 每个内部节点带一个缓冲的小条。
// 原文：DDIA §3.4（书页 p82–83，PDF p104–105）。
// 时长全部来自 timeline/u4.json（beat() 驱动），不手写 waitFor。
import {Circle, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, chain, createRef} from '@motion-canvas/core';
import {at, makeBeats} from '../../lib/beats';
import {FONT, SAFE, SIZE, T} from '../../lib/theme';
import timeline from '../../timeline/u4.json';

export default makeScene2D(function* (view) {
  view.fill(T.bg);
  const beat = makeBeats(timeline);

  const header = createRef<Txt>();
  const anchor = createRef<Txt>();
  const say = (text: string) => anchor().text(text);

  // d30a：删键更复杂
  const g30a = createRef<Node>();
  const g30ains = createRef<Rect>();
  const g30adel = createRef<Rect>();
  const g30aknot = createRef<Node>();  // r6 P2-1：缠绕的线结，不是禁止符号
  // d30b/d30c：闩锁
  const g25 = createRef<Node>();
  const g25warn = createRef<Rect>();
  const g25t1 = createRef<Line>();
  const g25t2 = createRef<Line>();
  const g25d1 = createRef<Circle>();
  const g25d2 = createRef<Circle>();
  const g25mixP = createRef<Rect>();  // r6 P2-10：混搭的树——父页是旧的，叶页是新的
  const g25mixL = createRef<Rect>();
  const g25mixArr = createRef<Line>();
  const g25bad = createRef<Txt>();
  const g25latchDef = createRef<Txt>();  // r7 #17：闩锁定义——动哪页，锁哪页，用完就放
  const g25latch = createRef<Rect>();
  const g25old = createRef<Rect>();
  const g25new = createRef<Rect>();
  const g25swap = createRef<Txt>();
  const g25q = createRef<Circle>();
  // d31a：写时复制
  const g26 = createRef<Node>();
  const g26parent = createRef<Rect>();
  const g26parent2 = createRef<Rect>();
  const g26old = createRef<Rect>();
  const g26new = createRef<Rect>();
  const g26lmdb = createRef<Txt>();  // r6 P2-8：标题，不再贴在旧页卡片下
  const g26read = createRef<Txt>();  // r6 P2-9：读的人还走旧页
  const g26write = createRef<Txt>();  // 写的人走新页
  const g26arrOld = createRef<Line>();
  const g26arrNew = createRef<Line>();
  const g26latch = createRef<Txt>();
  const g26ch1 = createRef<Rect>();  // r7 #18：新版本一路传到根的链
  const g26ch2 = createRef<Rect>();
  const g26ch3 = createRef<Rect>();
  const g26ch4 = createRef<Rect>();
  const g26chArr1 = createRef<Line>();
  const g26chArr2 = createRef<Line>();
  const g26chArr3 = createRef<Line>();
  const g26recycle = createRef<Txt>();  // 旧页等没人读了再回收
  const g26rootSw = createRef<Txt>();  // 根指针原子切换
  // d31b/d31c：键缩写
  const g27 = createRef<Node>();
  const g27page = createRef<Rect>();
  const g27full = [0, 1, 2].map(() => createRef<Txt>());
  const g27cut = [0, 1, 2].map(() => createRef<Txt>());  // r7 #19：砍掉的后缀
  const g27pre = [0, 1, 2, 3, 4, 5].map(() => createRef<Txt>());  // r6 P2-7：真的前缀文字，各行不同
  const g27count = createRef<Txt>();  // 原来 3 个 → 现在 6 个
  const g27branch = createRef<Txt>();
  const g27level = createRef<Rect>();
  const g27levelLab = createRef<Txt>();
  const g27bplus = createRef<Txt>();
  const g27note = createRef<Txt>();
  // d32a/d32b：叶页顺序
  const g28 = createRef<Node>();
  const g28disk = createRef<Rect>();
  const g28leaf = [0, 1, 2, 3, 4].map(() => createRef<Rect>());
  const g28dot = createRef<Circle>();
  const g28seek = createRef<Txt>();
  const g28rangeNote = createRef<Txt>();  // r6 P2-12：黄框双叶范围相邻却不相邻
  const g29 = createRef<Node>();
  const g29leaf = [0, 1, 2, 3, 4].map(() => createRef<Rect>());
  const g29grow = createRef<Rect>();
  const g29seg = createRef<Rect>();
  const g29keys = [0, 1, 2, 3, 4].map(() => createRef<Txt>());
  // d32c：兄弟指针
  const g30 = createRef<Node>();
  const g30leaf = [0, 1, 2, 3].map(() => createRef<Rect>());
  const g30arr = [0, 1, 2].map(() => createRef<Line>());
  const g30parent = createRef<Rect>();
  const g30dot = createRef<Circle>();
  // d32d：分形树
  const g31 = createRef<Node>();
  const g31card = createRef<Rect>();
  const g31long = createRef<Line>();
  const g31short = createRef<Line>();
  const g31note = createRef<Txt>();
  const g31buf = createRef<Rect>();  // r7 #20：每个内部节点带一个缓冲
  // d32e：两派回扣
  const g32 = createRef<Node>();
  const g32left = createRef<Rect>();
  const g32right = createRef<Rect>();
  const g32segs = [0, 1, 2, 3].map(() => createRef<Rect>());
  const g32page = createRef<Rect>();
  const g32wal = createRef<Rect>();
  // d32f：结尾
  const g33 = createRef<Node>();
  const g33c = [0, 1, 2].map(() => createRef<Rect>());

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

      {/* d30a：删键更复杂 */}
      <Node ref={g30a} opacity={0}>
        <Rect ref={g30ains} position={[-300, 190]} width={220} height={60} radius={12} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} text={'插新键：顺滑落入'} />
        </Rect>
        <Rect ref={g30adel} position={[300, 190]} width={220} height={60} radius={12} fill={T.card} stroke={T.red} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.red} fontFamily={FONT.sans} text={'删键：打个结'} />
        </Rect>
        <Node ref={g30aknot} position={[480, 190]} opacity={0}>
          <Circle width={46} height={46} fill={T.bg} stroke={T.red} lineWidth={3} />
          <Line points={[[-24, -8], [-6, 12], [10, -12], [24, 8]]} stroke={T.red} lineWidth={3} />
        </Node>
      </Node>

      {/* d30b/d30c：闩锁 */}
      <Node ref={g25} opacity={0}>
        <Rect ref={g25warn} position={[0, -200]} width={340} height={70} radius={12} fill={T.card} stroke={T.yellow} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.sans} text={'原地改页，小心并发'} />
        </Rect>
        <Line ref={g25t1} points={[[-480, 120], [-80, -60]]} stroke={T.blue} lineWidth={3} endArrow opacity={0} />
        <Line ref={g25t2} points={[[-480, 180], [-80, -20]]} stroke={T.purple} lineWidth={3} endArrow opacity={0} />
        <Circle ref={g25d1} position={[-480, 120]} width={22} height={22} fill={T.blue} opacity={0} />
        <Circle ref={g25d2} position={[-480, 180]} width={22} height={22} fill={T.purple} opacity={0} />
        <Rect ref={g25mixP} position={[220, 55]} width={200} height={46} radius={10} fill={T.card} stroke={T.muted} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'父页（旧）'} />
        </Rect>
        <Line ref={g25mixArr} points={[[220, 78], [340, 108]]} stroke={T.red} lineWidth={3} endArrow opacity={0} />
        <Rect ref={g25mixL} position={[340, 130]} width={180} height={44} radius={10} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} text={'叶页（新）'} />
        </Rect>
        <Txt ref={g25bad} position={[280, 190]} fontSize={SIZE.label} fill={T.red} fontFamily={FONT.sans} text={'这个线程看到的是混搭的树'} opacity={0} />
        <Txt ref={g25latchDef} position={[280, 45]} fontSize={18} fill={T.muted} fontFamily={FONT.sans} text={'动哪页，锁哪页，用完就放'} opacity={0} />
        <Rect ref={g25latch} position={[280, -60]} width={300} height={160} radius={16} fill={T.card} stroke={T.yellow} lineWidth={3} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'树页 + 闩锁'} />
        </Rect>
        <Rect ref={g25old} position={[-320, 120]} width={260} height={70} radius={12} fill={T.card} stroke={T.line} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'旧段'} />
        </Rect>
        <Rect ref={g25new} position={[-320, 120]} width={260} height={70} radius={12} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} text={'新段'} />
        </Rect>
        <Txt ref={g25swap} position={[-320, 190]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} text={'原子换段'} opacity={0} />
        <Circle ref={g25q} position={[-480, 120]} width={34} height={34} fill={T.yellow} opacity={0} />
      </Node>

      {/* d31a：写时复制 */}
      <Node ref={g26} opacity={0}>
        <Rect ref={g26parent} position={[0, -230]} width={300} height={80} radius={14} fill={T.card} stroke={T.blue} lineWidth={3} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'父页（旧版）'} />
        </Rect>
        <Rect ref={g26parent2} position={[330, -230]} width={300} height={80} radius={14} fill={T.card} stroke={T.yellow} lineWidth={3} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'父页的新版本'} />
        </Rect>
        <Rect ref={g26old} position={[-300, -60]} width={220} height={120} radius={14} fill={T.card} stroke={T.line} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'旧页'} />
        </Rect>
        <Rect ref={g26new} position={[-300, -60]} width={220} height={120} radius={14} fill={T.card} stroke={T.green} lineWidth={3} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} text={'新位置'} />
        </Rect>
        <Txt ref={g26lmdb} position={[0, -315]} fontSize={SIZE.body} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'写时复制（例：LMDB）'} opacity={0} />
        <Txt ref={g26read} position={[-300, 40]} fontSize={18} fill={T.muted} fontFamily={FONT.sans} text={'读的人还走旧页'} opacity={0} />
        <Txt ref={g26write} position={[300, 40]} fontSize={18} fill={T.green} fontFamily={FONT.sans} text={'写的人走新页'} opacity={0} />
        <Line ref={g26arrOld} points={[[0, -190], [-300, -120]]} stroke={T.muted} lineWidth={2} endArrow opacity={0} />
        <Line ref={g26arrNew} points={[[330, -190], [310, -120]]} stroke={T.green} lineWidth={3} endArrow opacity={0} />
        <Txt ref={g26latch} position={[0, 140]} fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.sans} text={'并发控制也有用'} opacity={0} />
        <Txt ref={g26recycle} position={[-300, 75]} fontSize={18} fill={T.muted} fontFamily={FONT.sans} text={'没人读了再回收'} opacity={0} />
        <Txt ref={g26rootSw} position={[450, 165]} fontSize={18} fill={T.green} fontFamily={FONT.sans} text={'根指针原子切换'} opacity={0} />
        <Rect ref={g26ch1} position={[-450, 210]} width={170} height={44} radius={12} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt fontSize={18} fill={T.text} fontFamily={FONT.sans} text={'新叶页'} />
        </Rect>
        <Line ref={g26chArr1} points={[[-365, 210], [-235, 210]]} stroke={T.green} lineWidth={2} endArrow opacity={0} />
        <Rect ref={g26ch2} position={[-150, 210]} width={170} height={44} radius={12} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt fontSize={18} fill={T.text} fontFamily={FONT.sans} text={'父页新版'} />
        </Rect>
        <Line ref={g26chArr2} points={[[-65, 210], [65, 210]]} stroke={T.green} lineWidth={2} endArrow opacity={0} />
        <Rect ref={g26ch3} position={[150, 210]} width={170} height={44} radius={12} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt fontSize={18} fill={T.text} fontFamily={FONT.sans} text={'爷爷页新版'} />
        </Rect>
        <Line ref={g26chArr3} points={[[235, 210], [365, 210]]} stroke={T.green} lineWidth={2} endArrow opacity={0} />
        <Rect ref={g26ch4} position={[450, 210]} width={170} height={44} radius={12} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt fontSize={18} fill={T.text} fontFamily={FONT.sans} text={'新根'} />
        </Rect>
      </Node>

      {/* d31b/d31c：键缩写 */}
      <Node ref={g27} opacity={0}>
        <Rect ref={g27page} position={[0, -120]} width={760} height={200} radius={16} fill={T.card} stroke={T.blue} lineWidth={3} opacity={0}>
          <Txt position={[-320, -75]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'内部页'} />
        </Rect>
        {['user_0001234567', 'user_0001234987', 'user_0001235111'].map((k, i) => (
          <Txt key={`g27f-${i}`} ref={g27full[i]} position={[0, -186 + i * 30]} fontSize={20} fill={T.text} fontFamily={FONT.mono} text={k} opacity={0} />
        ))}
        {['砍掉 67', '砍掉 87', '砍掉 111'].map((t, i) => (
          <Txt key={`g27c-${i}`} ref={g27cut[i]} position={[170, -186 + i * 30]} fontSize={18} fill={T.red} fontFamily={FONT.mono} text={t} opacity={0} />
        ))}
        {['user_00012345', 'user_00012349', 'user_0001235', 'user_00012362', 'user_00012371', 'user_00012388'].map((k, i) => (
          <Txt key={`g27p-${i}`} ref={g27pre[i]} position={[0, -186 + i * 30]} fontSize={20} fill={T.yellow} fontFamily={FONT.mono} text={k} opacity={0} />
        ))}
        <Txt ref={g27count} position={[0, 10]} fontSize={18} fill={T.yellow} fontFamily={FONT.sans} text={'原来一页 3 个键 → 现在 6 个'} opacity={0} />
        <Txt ref={g27branch} position={[0, 40]} fontSize={SIZE.body} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'分支因子更高'} opacity={0} />
        <Rect ref={g27level} position={[-200, 140]} width={400} height={40} radius={8} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'层数'} />
        </Rect>
        <Txt ref={g27levelLab} position={[150, 140]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} text={'层数更少'} opacity={0} />
        <Txt ref={g27bplus} position={[330, 40]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.mono} text={'B+ 树'} opacity={0} />
        <Txt ref={g27note} position={[330, 80]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'往往不再区分'} opacity={0} />
      </Node>

      {/* d32a/d32b：叶页顺序 */}
      <Node ref={g28} opacity={0}>
        <Rect ref={g28disk} position={[0, 0]} width={1000} height={360} radius={16} fill={T.card} stroke={T.muted} lineWidth={2} opacity={0}>
          <Txt position={[440, -150]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'磁盘'} />
        </Rect>
        {[[-380, -110, '100–200'], [-80, -150, '300–400'], [220, -90, '200–300'], [-250, 80, '400–500'], [150, 100, '500–600']].map(([x, y, r], i) => (
          <Rect key={`g28l-${i}`} ref={g28leaf[i]} position={[x as number, y as number]} width={180} height={70} radius={12} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
            <Txt position={[0, -14]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'叶页'} />
            <Txt position={[0, 16]} fontSize={18} fill={T.muted} fontFamily={FONT.mono} text={r as string} />
          </Rect>
        ))}
        <Circle ref={g28dot} position={[-380, -158]} width={26} height={26} fill={T.yellow} opacity={0} />
        <Txt ref={g28rangeNote} position={[0, 160]} fontSize={18} fill={T.yellow} fontFamily={FONT.sans} text={'这两页范围相邻，却放在磁盘两头'} opacity={0} />
        <Txt ref={g28seek} position={[0, 210]} fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.sans} text={'每跳一次，都要寻道'} opacity={0} />
      </Node>
      <Node ref={g29} opacity={0}>
        {[[-380, -110], [-80, -150], [220, -90], [-250, 80], [150, 100]].map(([x, y], i) => (
          <Rect key={`g29l-${i}`} ref={g29leaf[i]} position={[x, y]} width={180} height={70} radius={12} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'叶页'} />
          </Rect>
        ))}
        <Rect ref={g29grow} position={[0, -230]} width={500} height={50} radius={10} fill={T.card} stroke={T.purple} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.purple} fontFamily={FONT.sans} text={'树长大，新的一层'} />
        </Rect>
        <Rect ref={g29seg} position={[0, 0]} width={1000} height={70} radius={12} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt position={[-440, 0]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} text={'合并重写'} />
        </Rect>
        {[100, 200, 300, 400, 500].map((k, i) => (
          <Txt key={`g29k-${i}`} ref={g29keys[i]} position={[-300 + i * 150, 0]} fontSize={20} fill={T.text} fontFamily={FONT.mono} text={String(k)} opacity={0} />
        ))}
      </Node>

      {/* d32c：兄弟指针 */}
      <Node ref={g30} opacity={0}>
        <Rect ref={g30parent} position={[0, -220]} width={260} height={70} radius={14} fill={T.card} stroke={T.line} lineWidth={2} opacity={0.4}>
          <Txt fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'父页'} />
        </Rect>
        {[-420, -140, 140, 420].map((x, i) => (
          <Rect key={`g30l-${i}`} ref={g30leaf[i]} position={[x, -40]} width={220} height={90} radius={14} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'叶页'} />
          </Rect>
        ))}
        <Line ref={g30arr[0]} points={[[-310, -40], [-250, -40]]} stroke={T.green} lineWidth={3} startArrow endArrow opacity={0} />
        <Line ref={g30arr[1]} points={[[-30, -40], [30, -40]]} stroke={T.green} lineWidth={3} startArrow endArrow opacity={0} />
        <Line ref={g30arr[2]} points={[[250, -40], [310, -40]]} stroke={T.green} lineWidth={3} startArrow endArrow opacity={0} />
        <Circle ref={g30dot} position={[-420, -95]} width={26} height={26} fill={T.yellow} opacity={0} />
      </Node>

      {/* d32d：分形树 */}
      <Node ref={g31} opacity={0}>
        <Rect ref={g31card} position={[0, -60]} width={420} height={180} radius={16} fill={T.card} stroke={T.purple} lineWidth={3} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'分形树'} />
          <Txt position={[0, 50]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'借日志结构的思路'} />
        </Rect>
        <Line ref={g31long} points={[[-480, 140], [-80, 140]]} stroke={T.red} lineWidth={3} endArrow opacity={0} />
        <Txt position={[-280, 180]} fontSize={SIZE.label} fill={T.red} fontFamily={FONT.sans} text={'寻道：长'} />
        <Line ref={g31short} points={[[80, 140], [200, 140]]} stroke={T.green} lineWidth={3} endArrow opacity={0} />
        <Txt position={[140, 180]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} text={'寻道：短'} />
        <Rect ref={g31buf} position={[0, 80]} width={360} height={44} radius={10} fill={T.card} stroke={T.purple} lineWidth={2} opacity={0}>
          <Txt fontSize={18} fill={T.text} fontFamily={FONT.sans} text={'每个内部节点带一个缓冲：攒满一批再往下刷'} />
        </Rect>
        <Txt ref={g31note} position={[0, 230]} fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.sans} text={'和分形没关系'} opacity={0} />
      </Node>

      {/* d32e：两派回扣 */}
      <Node ref={g32} opacity={0}>
        <Rect ref={g32left} position={[-290, -60]} width={380} height={180} radius={16} fill={T.card} stroke={T.line} lineWidth={2} opacity={0}>
          <Txt position={[0, -60]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'变长段 · 只追加'} />
        </Rect>
        {[0, 1, 2, 3].map(i => (
          <Rect key={`g32s-${i}`} ref={g32segs[i]} position={[-425 + i * 90, 20]} width={80} height={50} radius={8} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0} />
        ))}
        <Rect ref={g32right} position={[290, -60]} width={380} height={180} radius={16} fill={T.card} stroke={T.yellow} lineWidth={3} opacity={0}>
          <Txt position={[0, -60]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'固定页 · 原地改'} />
        </Rect>
        <Rect ref={g32page} position={[290, -10]} width={200} height={60} radius={10} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'一页'} />
        </Rect>
        <Rect ref={g32wal} position={[290, 55]} width={200} height={44} radius={10} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} text={'预写日志'} />
        </Rect>
      </Node>

      {/* d32f：结尾 */}
      <Node ref={g33} opacity={0}>
        {[['固定页', -360], ['平衡树', 0], ['原地写回', 360]].map(([t, x], i) => (
          <Rect key={`g33c-${i}`} ref={g33c[i]} position={[x as number, -60]} width={240} height={100} radius={16} fill={T.card} stroke={T.yellow} lineWidth={3} opacity={0}>
            <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={t as string} />
          </Rect>
        ))}
      </Node>
    </>
  );

  say('删键更复杂');
  yield* beat('d30a',
    all(g30a().opacity(1, 0.5)),
    at('插新键', g30ains().opacity(1, 0.5)),
    at('删一个键', all(g30adel().opacity(1, 0.5), g30aknot().opacity(1, 0.5))),
    at('页删空了', g30adel().scale(1.05, 0.5)),
    at('边界要重算', g30aknot().scale(1.1, 0.5)),
  );

  say('多线程要小心');
  yield* beat('d30b',
    all(g30a().opacity(0, 0.5), g25().opacity(1, 0.5), g25warn().opacity(1, 0.5)),
    at('多个线程', all(g25t1().opacity(1, 0.4), g25t2().opacity(1, 0.4), g25d1().opacity(1, 0.4), g25d2().opacity(1, 0.4), g25d1().position([-80, -60], 1.4), g25d2().position([-80, -20], 1.4))),
  );

  say('原地改页就麻烦了');
  yield* beat('d30b2',
    at('麻烦了', g25latch().opacity(1, 0.5)),
  );

  say('会看到不一致的树');
  yield* beat('d30b3',
    at('并发控制', all(g25latch().scale(1.06, 0.8), g25mixP().opacity(1, 0.5), g25mixArr().opacity(1, 0.5), g25mixL().opacity(1, 0.5))),
    at('旧父页往下走', g25mixP().scale(1.06, 0.6)),
    at('换上新叶页', g25mixL().scale(1.06, 0.6)),
    at('一半旧一半新的树', g25bad().opacity(1, 0.5)),
  );

  say('闩锁护树');
  yield* beat('d30c',
    at('闩锁', all(g25latch().stroke(T.yellow, 0.4), g25mixP().opacity(0, 0.4), g25mixArr().opacity(0, 0.4), g25mixL().opacity(0, 0.4), g25bad().opacity(0, 0.4))),
    at('轻量锁', all(g25latchDef().opacity(1, 0.5), g25latch().scale(1.05, 0.5))),
    at('合并在后台做', all(g25old().opacity(1, 0.5), g25swap().opacity(1, 0.5))),
    at('原子地换段', all(g25old().opacity(0, 0.5), g25new().opacity(1, 0.5))),
    at('不干扰正在查的请求', chain(g25q().opacity(1, 0.3), g25q().position([150, -60], 1.2))),
  );

  say('改了写别处');
  yield* beat('d31a',
    all(g25().opacity(0, 0.5), g26().opacity(1, 0.5)),
    at('写时复制', all(g26parent().opacity(1, 0.5), g26old().opacity(1, 0.5), g26arrOld().opacity(1, 0.4), g26lmdb().opacity(1, 0.5))),
    at('写到别处', all(g26new().opacity(1, 0.5), g26new().position([300, -60], 1.4))),
    at('父页的新版本', g26parent2().opacity(1, 0.4)),
    at('指向新位置', g26arrNew().opacity(1, 0.5)),
    at('读的人还走旧页', all(g26read().opacity(1, 0.5), g26write().opacity(1, 0.5))),
    at('互不干扰', g26latch().opacity(1, 0.5)),
    at('新版本要一路传到根', chain(g26ch1().opacity(1, 0.3), g26chArr1().opacity(1, 0.3), g26ch2().opacity(1, 0.3), g26chArr2().opacity(1, 0.3), g26ch3().opacity(1, 0.3), g26chArr3().opacity(1, 0.3), g26ch4().opacity(1, 0.3))),
    at('旧页等没人读了再回收', g26recycle().opacity(1, 0.5)),
    at('换根一步到位', g26rootSw().opacity(1, 0.5)),  // 第四版：避开“根指针要么换成新的”循环
  );

  say('边界键只存前缀');
  yield* beat('d31b',
    all(g26().opacity(0, 0.5), g27().opacity(1, 0.5)),
    at('键缩写', all(g27page().opacity(1, 0.5), g27full[0]().opacity(1, 0.4), g27full[1]().opacity(1, 0.4), g27full[2]().opacity(1, 0.4))),
    at('只存缩写', all(g27full[0]().opacity(0, 0.4), g27full[1]().opacity(0, 0.4), g27full[2]().opacity(0, 0.4), g27pre[0]().opacity(1, 0.4), g27pre[1]().opacity(1, 0.4), g27pre[2]().opacity(1, 0.4))),
    at('范围边界', all(g27pre[0]().scale(1.06, 0.4), g27pre[1]().scale(1.06, 0.4), g27pre[2]().scale(1.06, 0.4))),
    at('后面几位砍掉', all(g27cut[0]().opacity(1, 0.4), g27cut[1]().opacity(1, 0.4), g27cut[2]().opacity(1, 0.4))),
    at('一页塞进更多键', all(g27pre[3]().opacity(1, 0.4), g27pre[4]().opacity(1, 0.4), g27pre[5]().opacity(1, 0.4), g27count().opacity(1, 0.5))),
    at('分支因子更高', g27branch().opacity(1, 0.5)),
    at('层数更少', all(g27level().opacity(1, 0.5), g27level().width(240, 1.2), g27levelLab().opacity(1, 0.5))),
  );

  say('B 加树');
  yield* beat('d31c',
    at('B 加树', g27bplus().opacity(1, 0.5)),
    at('往往不再和', g27note().opacity(1, 0.5)),
  );

  say('叶页不必相邻');
  yield* beat('d32a',
    all(g27().opacity(0, 0.5), g28().opacity(1, 0.5)),
    at('任何位置', all(g28disk().opacity(1, 0.5), g28leaf[0]().opacity(1, 0.4), g28leaf[1]().opacity(1, 0.4), g28leaf[2]().opacity(1, 0.4), g28leaf[3]().opacity(1, 0.4), g28leaf[4]().opacity(1, 0.4))),
    at('不必相邻', all(g28leaf[0]().stroke(T.yellow, 0.4), g28leaf[2]().stroke(T.yellow, 0.4), g28rangeNote().opacity(1, 0.5))),
    at('每读一页', chain(g28dot().opacity(1, 0.3), g28dot().position([-80, -198], 0.6), g28dot().position([220, -138], 0.6), g28dot().position([-250, 32], 0.6), g28dot().position([150, 52], 0.6))),
    at('一次寻道', g28seek().opacity(1, 0.5)),
  );

  say('顺序难维持');
  yield* beat('d32b',
    all(g28().opacity(0, 0.5), g29().opacity(1, 0.5), g29leaf[0]().opacity(1, 0.4), g29leaf[1]().opacity(1, 0.4), g29leaf[2]().opacity(1, 0.4), g29leaf[3]().opacity(1, 0.4), g29leaf[4]().opacity(1, 0.4)),
    at('顺序出现', all(g29leaf[0]().position([-400, 0], 1.2), g29leaf[1]().position([-200, 0], 1.2), g29leaf[2]().position([0, 0], 1.2), g29leaf[3]().position([200, 0], 1.2), g29leaf[4]().position([400, 0], 1.2))),
    at('很难维持', all(g29grow().opacity(1, 0.5), g29leaf[0]().position([-380, -110], 1.2), g29leaf[1]().position([-80, -150], 1.2), g29leaf[2]().position([220, -90], 1.2), g29leaf[3]().position([-250, 80], 1.2), g29leaf[4]().position([150, 100], 1.2))),
    at('重写大段存储', all(g29grow().opacity(0, 0.4), g29leaf[0]().opacity(0, 0.3), g29leaf[1]().opacity(0, 0.3), g29leaf[2]().opacity(0, 0.3), g29leaf[3]().opacity(0, 0.3), g29leaf[4]().opacity(0, 0.3), g29seg().opacity(1, 0.5))),
    at('靠在一起', chain(g29keys[0]().opacity(1, 0.2), g29keys[1]().opacity(1, 0.2), g29keys[2]().opacity(1, 0.2), g29keys[3]().opacity(1, 0.2), g29keys[4]().opacity(1, 0.2))),
  );

  say('叶页加兄弟引用');
  yield* beat('d32c',
    all(g29().opacity(0, 0.5), g30().opacity(1, 0.5), g30leaf[0]().opacity(1, 0.4), g30leaf[1]().opacity(1, 0.4), g30leaf[2]().opacity(1, 0.4), g30leaf[3]().opacity(1, 0.4)),
    at('指向左右的兄弟页', all(g30arr[0]().opacity(1, 0.4), g30arr[1]().opacity(1, 0.4), g30arr[2]().opacity(1, 0.4), g30dot().opacity(1, 0.4), g30dot().position([-140, -95], 0.8))),
    at('顺序扫键时', g30dot().position([140, -95], 0.6)),
    at('不用跳回父页', all(g30dot().position([420, -95], 0.8), g30parent().opacity(0.25, 0.5))),
  );

  say('和分形没关系');
  yield* beat('d32d',
    all(g30().opacity(0, 0.5), g31().opacity(1, 0.5)),
    at('分形树', g31card().opacity(1, 0.5)),
    at('减少寻道', all(g31long().opacity(1, 0.5), g31short().opacity(1, 0.5))),
    at('每个内部节点带一个缓冲', g31buf().opacity(1, 0.5)),
    at('插入先攒进缓冲', chain(g31buf().scale(1.06, 0.5), g31buf().scale(1, 0.5))),
    at('攒满一批再往下刷', chain(g31buf().position([0, 92], 0.4), g31buf().position([0, 80], 0.4))),
    at('和分形没关系', g31note().opacity(1, 0.5)),
  );

  say('同是排序，哲学不同');
  yield* beat('d32e',
    all(g31().opacity(0, 0.5), g32().opacity(1, 0.5), g32left().opacity(1, 0.5), g32right().opacity(1, 0.5)),
    at('只追加不改', all(g32segs[0]().opacity(1, 0.3), g32segs[1]().opacity(1, 0.3), g32segs[2]().opacity(1, 0.3), g32segs[3]().opacity(1, 0.3))),
    at('原地改', all(g32page().opacity(1, 0.5), g32page().stroke(T.yellow, 0.4))),
    at('靠日志保命', g32wal().opacity(1, 0.5)),
  );

  say('页固定，树平衡');
  yield* beat('d32f',
    all(g32().opacity(0, 0.5), g33().opacity(1, 0.5)),
    at('固定大小', g33c[0]().opacity(1, 0.5)),
    at('永远平衡', g33c[1]().opacity(1, 0.5)),
    at('原地写回去', g33c[2]().opacity(1, 0.5)),
  );
});
