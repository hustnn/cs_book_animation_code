// U5 场景 3（MC，r4）：e16–e27 —— N2 同一键 251 走三条查找路径（正式走查机制）、尾延迟百分位曲线。
// r5：百分位曲线重画为累积分布（先陡后平；p50 在纵轴一半高处、p99 在 99% 高处；纵轴“0/一半/全部”三档刻度；
// B 树线在橙线之上、蓝色 p99 竖线更靠左）；e18“没有 251 的位置”、e19 扫描逐格停并标“251 在这格”、e22 三绿点标路名并露尾巴、
// e23 满格说明、e24/e25 箭头与红条加标。
// 分镜：skill-ch03/beats-u5.md；原文：DDIA §3.5（书页 p84–85，PDF p106–107）+ §3.2–§3.4 回扣的查找路径。
// N2 标注“为便于比较，三条路径用同一键演示”出现在画面（紫色横幅）与旁白里；
// 三条路径的数字按各自原图：哈希索引（内存表、一次定位）、稀疏索引（跳块再扫）、B 树（三级下钻，200 ≤ 键 < 300）。
// 每条路径配一个磁盘读计数器（Counter）：哈希 ×1、稀疏 ×1、B 树 ×3，e21 一拍对照。
// 稀疏索引口径：查内存表、查段名都不读盘，读在跳块那一下（跳块加块内扫是同一次磁盘读，计数器在跳块时 +1）；
// 251 在旧的段 2，一共两段。e25a 拿一次查询走一遍撞上压缩的路径。
// 尾延迟曲线是示意分布：画面标紫色“示意：分布形状”，不引用具体数字；横轴补“响应时间 →”标注（修 r1 P2）；
// e26b 在 p99 处加竖直虚线阈值线，标“99% 的请求都在左边”；e27 加一条画在橙线之上的 B 树对比曲线 + 更靠左的蓝色 p99 竖线，“更可预测”看得见。
// 时长全部来自 timeline/u5.json（beat() 驱动），不手写 waitFor。
import {Circle, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, chain, createRef} from '@motion-canvas/core';
import {at, makeBeats} from '../../lib/beats';
import {FONT, SAFE, SIZE, T} from '../../lib/theme';
import {Counter} from '../../lib/schemas';
import timeline from '../../timeline/u5.json';

export default makeScene2D(function* (view) {
  view.fill(T.bg);
  const beat = makeBeats(timeline);

  const header = createRef<Txt>();
  const anchor = createRef<Txt>();
  const say = (text: string) => anchor().text(text);
  const readH = new Counter([-400, 170], '磁盘读 ×', '', {size: SIZE.label, tone: T.text});
  const readS = new Counter([0, 170], '磁盘读 ×', '', {size: SIZE.label, tone: T.text});
  const readB = new Counter([400, 170], '磁盘读 ×', '', {size: SIZE.label, tone: T.text});

  // ---- 第 1 页：三条查找路径（N2）----
  const p1 = createRef<Node>();
  const keyChip = createRef<Rect>();
  const noteBanner = createRef<Txt>();
  const cardH = createRef<Rect>();
  const cardS = createRef<Rect>();
  const cardB = createRef<Rect>();
  const memRow = createRef<Txt>();
  const jumpArrow = createRef<Line>();
  const jumpDot = createRef<Circle>();
  const memRowS = createRef<Txt>();
  const segA = createRef<Rect>();
  const segB = createRef<Rect>();
  const blockHead = createRef<Rect>();
  const scanCells = [0, 1, 2, 3].map(() => createRef<Rect>());
  const scanDot = createRef<Circle>();
  const lvlRoot = createRef<Rect>();
  const lvlMid = createRef<Rect>();
  const lvlLeaf = createRef<Rect>();
  const drillDot = createRef<Circle>();
  const calibreLab = createRef<Txt>();
  const segMarkLab = createRef<Txt>();

  // ---- 第 2 页：平均响应 + 压缩干扰 + 尾延迟曲线 ----
  const p2 = createRef<Node>();
  const avgAxis = createRef<Line>();
  const avgDots = [0, 1, 2].map(() => createRef<Circle>());
  const avgLab = createRef<Txt>();
  // r5（P2-7/8/9）：e22 三绿点路名 + 尾巴红点；e23 满格说明；e24 读写箭头标；e25 红条标。
  const avgDotLabs = [0, 1, 2].map(() => createRef<Txt>());
  const tailDot = createRef<Circle>();
  const tailLab = createRef<Txt>();
  const thruScaleLab = createRef<Txt>();
  const rwLab1 = createRef<Txt>();
  const rwLab2 = createRef<Txt>();
  const resLab = createRef<Txt>();
  const thruBar = createRef<Rect>();
  const thruFill = createRef<Rect>();
  const thruLab = createRef<Txt>();
  const funnel = createRef<Txt>();
  const rwArrow1 = createRef<Line>();
  const rwArrow2 = createRef<Line>();
  const waitLab = createRef<Txt>();
  const resBar = createRef<Rect>();
  const resFill = createRef<Rect>();
  const axisX = createRef<Line>();
  const axisY = createRef<Line>();
  const axisXLab = createRef<Txt>();
  const axisYLab = createRef<Txt>();
  const curve = createRef<Line>();
  const p50Dot = createRef<Circle>();
  const p50Lab = createRef<Txt>();
  const p99Dot = createRef<Circle>();
  const p99Lab = createRef<Txt>();
  const btreeCurve = createRef<Line>();
  const btreeLab = createRef<Txt>();
  const curveNote = createRef<Txt>();
  const queryDot = createRef<Circle>();
  const queryLab = createRef<Txt>();
  const thresholdLine = createRef<Line>();
  const thresholdLab = createRef<Txt>();
  // r5（P1）：纵轴“0/一半/全部”三档定性刻度；B 树 p99 竖线（更靠左）；e19 末格“251 在这格”标。
  const tick0 = createRef<Txt>();
  const tickHalf = createRef<Txt>();
  const tickFull = createRef<Txt>();
  const btreeThreshold = createRef<Line>();
  const scanLab = createRef<Txt>();
  // r4 恢复轮次（抽帧：e26a 定格 8.40s、e26b 定格 11.69s，均 ≥6s error）：一个请求沿曲线走的白点——
  // 小圆点脉冲改的像素太少，freezedetect 认不出，定格就一直攒；白点一路移动才算真的在动。
  const rankDot = createRef<Circle>();

  view.add(
    <>
      <Txt
        ref={header}
        position={[-SAFE.halfW, -SAFE.halfH]}
        offset={[-1, -1]}
        fontSize={SIZE.label}
        fill={T.muted}
        fontFamily={FONT.sans}
        text={'两大学派对决：写快还是读快'}
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
      {readH.node}
      {readS.node}
      {readB.node}

      {/* 第 1 页 */}
      <Node ref={p1} opacity={0}>
        <Rect ref={keyChip} position={[0, -245]} width={220} height={64} radius={32} fill={T.yellow} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.bg} fontFamily={FONT.mono} text={'键 251'} />
        </Rect>
        <Txt ref={noteBanner} position={[0, -195]} fontSize={SIZE.label} fill={T.purple} fontFamily={FONT.sans} text={'为便于比较，三条路径用同一键演示'} opacity={0} />
        <Rect ref={cardH} position={[-400, -20]} width={340} height={300} radius={14} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt position={[0, -120]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'哈希索引'} />
          <Txt ref={memRow} position={[0, -40]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.mono} text={'内存表：251 → 位置'} opacity={0} />
        </Rect>
        <Rect ref={cardS} position={[0, -20]} width={340} height={300} radius={14} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt position={[0, -120]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'稀疏索引'} />
          <Txt ref={memRowS} position={[0, -75]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.mono} text={'内存表：没有 251 的位置'} opacity={0} />
          <Rect ref={segA} position={[-80, -40]} width={140} height={44} radius={8} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'段 1（新）'} />
          </Rect>
          <Rect ref={segB} position={[80, -40]} width={140} height={44} radius={8} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'段 2（旧）'} />
          </Rect>
          <Rect ref={blockHead} position={[0, 55]} width={280} height={54} radius={8} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'块头：一块的第一个键'} />
          </Rect>
        </Rect>
        <Rect ref={cardB} position={[400, -20]} width={340} height={300} radius={14} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt position={[0, -120]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'B 树'} />
        </Rect>
        <Line ref={jumpArrow} points={[[-400, 40], [-400, 110]]} stroke={T.yellow} lineWidth={3} endArrow opacity={0} />
        <Circle ref={jumpDot} position={[-400, 40]} width={26} height={26} fill={T.yellow} opacity={0} />
        {[0, 1, 2, 3].map(i => (
          <Rect
            key={`scan-${i}`}
            ref={scanCells[i]}
            position={[-120 + i * 80, 110]}
            width={70}
            height={56}
            radius={8}
            fill={T.card}
            stroke={T.line}
            lineWidth={2}
            opacity={0}
          />
        ))}
        <Circle ref={scanDot} position={[-120, 110]} width={24} height={24} fill={T.yellow} opacity={0} />
        <Txt ref={scanLab} position={[180, 165]} fontSize={SIZE.label} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'251 在这格'} opacity={0} />
        <Rect ref={lvlRoot} position={[400, -80]} width={240} height={56} radius={10} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'根页：200–300'} />
        </Rect>
        <Rect ref={lvlMid} position={[400, 0]} width={240} height={56} radius={10} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'中间页：再细分'} />
        </Rect>
        <Rect ref={lvlLeaf} position={[400, 80]} width={240} height={56} radius={10} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'叶页：251'} />
        </Rect>
        <Circle ref={drillDot} position={[540, -80]} width={24} height={24} fill={T.yellow} opacity={0} />
        <Txt ref={calibreLab} position={[0, 205]} fontSize={SIZE.label} fill={T.purple} fontFamily={FONT.sans} text={'段名与块头都在内存表里，查段名不读盘'} opacity={0} />
        <Txt ref={segMarkLab} position={[0, 240]} fontSize={SIZE.label} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'251 在段 2（旧），共 2 段'} opacity={0} />
      </Node>

      {/* 第 2 页 */}
      <Node ref={p2} opacity={0}>
        <Line ref={avgAxis} points={[[-480, -100], [480, -100]]} stroke={T.line} lineWidth={3} opacity={0} />
        {[0, 1, 2].map(i => (
          <Circle
            key={`avg-${i}`}
            ref={avgDots[i]}
            position={[-380 + i * 60, -100]}
            width={26}
            height={26}
            fill={T.green}
            opacity={0}
          />
        ))}
        <Txt ref={avgLab} position={[0, -160]} fontSize={SIZE.body} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'平均很快'} opacity={0} />
        {[0, 1, 2].map(i => (
          <Txt
            key={`avg-lab-${i}`}
            ref={avgDotLabs[i]}
            position={[-380 + i * 60, -55]}
            fontSize={SIZE.label}
            fill={T.muted}
            fontFamily={FONT.sans}
            text={['哈希', '稀疏', 'B 树'][i]}
            opacity={0}
          />
        ))}
        <Circle ref={tailDot} position={[420, -100]} width={26} height={26} fill={T.red} opacity={0} />
        <Txt ref={tailLab} position={[420, -55]} fontSize={SIZE.label} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'尾巴在后面细讲'} opacity={0} />
        <Rect ref={thruBar} position={[0, 20]} width={900} height={46} radius={23} fill={T.card} stroke={T.line} lineWidth={2} opacity={0} />
        <Rect ref={thruFill} position={[-450, 20]} offset={[-1, 0]} width={700} height={46} radius={23} fill={T.green} opacity={0} />
        <Txt ref={thruLab} position={[0, 80]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'吞吐：几乎不受影响'} opacity={0} />
        <Txt ref={thruScaleLab} position={[0, 125]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'满格 = 不受影响时的吞吐'} opacity={0} />
        <Txt ref={funnel} position={[-320, -120]} fontSize={64} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'▼'} opacity={0} />
        <Line ref={rwArrow1} points={[[-480, 20], [-80, 20]]} stroke={T.blue} lineWidth={4} endArrow opacity={0} />
        <Line ref={rwArrow2} points={[[80, 20], [480, 20]]} stroke={T.blue} lineWidth={4} endArrow opacity={0} />
        <Txt ref={rwLab1} position={[-280, -25]} fontSize={SIZE.label} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'读'} opacity={0} />
        <Txt ref={rwLab2} position={[280, -25]} fontSize={SIZE.label} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'写'} opacity={0} />
        <Txt ref={waitLab} position={[-320, 90]} fontSize={SIZE.body} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'等压缩做完'} opacity={0} />
        <Rect ref={resBar} position={[0, -180]} width={900} height={46} radius={23} fill={T.card} stroke={T.line} lineWidth={2} opacity={0} />
        <Rect ref={resFill} position={[-450, -180]} offset={[-1, 0]} width={60} height={46} radius={23} fill={T.red} opacity={0} />
        <Txt ref={resLab} position={[0, -125]} fontSize={SIZE.label} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'磁盘资源：压缩占用中'} opacity={0} />
        <Line ref={axisX} points={[[-480, 160], [480, 160]]} stroke={T.line} lineWidth={3} opacity={0} />
        <Line ref={axisY} points={[[-480, 160], [-480, -220]]} stroke={T.line} lineWidth={3} opacity={0} />
        <Txt ref={axisXLab} position={[430, 195]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'响应时间 →'} opacity={0} />
        <Txt ref={axisYLab} position={[-480, -245]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'累计占比'} opacity={0} />
        {/* r5（P1）：纵轴三档定性刻度——0 / 一半 / 全部（y=160 / -30 / -220）。 */}
        <Txt ref={tick0} position={[-545, 160]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'0'} opacity={0} />
        <Txt ref={tickHalf} position={[-545, -30]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'一半'} opacity={0} />
        <Txt ref={tickFull} position={[-545, -220]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'全部'} opacity={0} />
        {/* r5（P1）：累积分布先陡后平——大多数请求快，曲线一开始就冲上去、越往右越平。
            p50 在纵轴一半高处（y=-30），p99 在 99% 高处（y=-216）。 */}
        <Line
          ref={curve}
          points={[[-480, 140], [-400, 80], [-320, 10], [-240, -30], [-160, -90], [-80, -140], [0, -170], [80, -190], [160, -205], [240, -213], [280, -216], [340, -218], [400, -219]]}
          stroke={T.yellow}
          lineWidth={4}
          opacity={0}
          end={0}
        />
        <Circle ref={p50Dot} position={[-240, -30]} width={26} height={26} fill={T.green} opacity={0} />
        <Txt ref={p50Lab} position={[-200, 70]} fontSize={SIZE.label} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'p50：一半的请求更快'} opacity={0} />
        <Circle ref={p99Dot} position={[280, -216]} width={26} height={26} fill={T.red} opacity={0} />
        <Txt ref={p99Lab} position={[280, -250]} fontSize={SIZE.label} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'p99：尾巴，很慢'} opacity={0} />
        {/* r5（P1）：B 树线画在橙线之上——同响应时间下更多请求已完成；它的 p99 在 x=160，更靠左。 */}
        <Line
          ref={btreeCurve}
          points={[[-480, 140], [-400, 40], [-320, -60], [-240, -110], [-160, -160], [-80, -190], [0, -205], [80, -213], [160, -216], [240, -218], [320, -219], [400, -219]]}
          stroke={T.blue}
          lineWidth={4}
          opacity={0}
        />
        <Txt ref={btreeLab} position={[-60, -250]} fontSize={SIZE.label} fontWeight={700} fill={T.blue} fontFamily={FONT.sans} text={'B 树：更可预测'} opacity={0} />
        <Txt ref={curveNote} position={[280, 235]} fontSize={SIZE.label} fill={T.purple} fontFamily={FONT.sans} text={'示意：分布形状'} opacity={0} />
        <Circle ref={queryDot} position={[-480, 20]} width={26} height={26} fill={T.yellow} opacity={0} />
        <Txt ref={queryLab} position={[-400, -50]} fontSize={SIZE.label} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'查 251'} opacity={0} />
        <Line ref={thresholdLine} points={[[280, 160], [280, -216]]} stroke={T.red} lineWidth={3} lineDash={[8, 6]} opacity={0} />
        <Txt ref={thresholdLab} position={[200, 195]} fontSize={SIZE.label} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'99% 的请求都在左边'} opacity={0} />
        <Line ref={btreeThreshold} points={[[160, 160], [160, -216]]} stroke={T.blue} lineWidth={3} lineDash={[8, 6]} opacity={0} />
        <Circle ref={rankDot} position={[-480, 140]} width={36} height={36} fill={T.white} opacity={0} />
      </Node>
    </>
  );

  say('同一键 251，走三条路');
  yield* beat('e16',
    all(p1().opacity(1, 0.5), keyChip().opacity(1, 0.5), noteBanner().opacity(1, 0.4),
      cardH().opacity(1, 0.5), cardS().opacity(1, 0.5), cardB().opacity(1, 0.5),
      cardH().scale(1.02, beat.dur('e16')), cardS().scale(1.02, beat.dur('e16')), cardB().scale(1.02, beat.dur('e16'))),
    at('各走一遍', chain(keyChip().scale(1.1, 0.6), keyChip().scale(1, 0.6))),
  );

  say('查内存表，一次定位');
  yield* beat('e17',
    all(cardH().stroke(T.green, 0.5), memRow().opacity(1, 0.5), jumpDot().opacity(1, 0.4), readH.node.opacity(1, 0.4)),
    at('一次定位', chain(jumpDot().position([-400, 110], 0.9), jumpArrow().opacity(1, 0.4), readH.bump())),
  );

  say('先查内存表，再逐段查');
  yield* beat('e18',
    all(cardH().stroke(T.blue, 0.5), cardS().stroke(T.green, 0.5)),
    at('内存表', memRowS().opacity(1, 0.5)),
    // r4（P2-3）：段名牌从内存表行下方“长出来”（下滑到位），凭据是段名与块头都在内存表里。
    at('一段一段查', chain(all(segA().opacity(1, 0.4), segA().position([-80, -10], 0.5)), all(segB().opacity(1, 0.4), segB().position([80, -10], 0.5)))),
    at('内存表里', calibreLab().opacity(1, 0.4)),
  );

  say('251 在段 2，跳块再扫');
  yield* beat('e19',
    all(blockHead().opacity(1, 0.5), scanDot().opacity(1, 0.4), readS.node.opacity(1, 0.4)),
    at('旧的段 2', chain(segB().stroke(T.green, 0.4), segMarkLab().opacity(1, 0.4))),
    at('块开头', all(...scanCells.map(c => c().opacity(1, 0.3)), readS.bump())),
    // r5（P2-6）：扫描线逐格扫到 251 那格（逐格停一下），末格标“251 在这格”。
    at('往后扫到它', chain(
      all(scanDot().position([-40, 110], 0.6), scanCells[1]().stroke(T.green, 0.4)),
      all(scanDot().position([40, 110], 0.6), scanCells[2]().stroke(T.green, 0.4)),
      all(scanDot().position([120, 110], 0.6), scanCells[3]().stroke(T.green, 0.4), scanLab().opacity(1, 0.4)),
    )),
  );

  say('三级下钻');
  yield* beat('e20',
    all(cardS().stroke(T.blue, 0.5), cardB().stroke(T.green, 0.5), lvlRoot().opacity(1, 0.5), drillDot().opacity(1, 0.4), readB.node.opacity(1, 0.4), readB.bump()),
    at('中间页再细分', chain(lvlMid().opacity(1, 0.5), drillDot().position([540, 0], 0.8), readB.bump())),
    at('叶页里找到它', chain(lvlLeaf().opacity(1, 0.5), drillDot().position([540, 80], 0.8), readB.bump())),
  );

  say('磁盘读：1 次、1 次、3 次');
  yield* beat('e21',
    all(p1().scale(1.02, beat.dur('e21'))),
    at('哈希一次定位', chain(readH.node.scale(1.2, 0.5), readH.node.scale(1, 0.5))),
    at('稀疏跳块再扫', chain(readS.node.scale(1.2, 0.5), readS.node.scale(1, 0.5))),
    at('B 树读了三页', chain(readB.node.scale(1.2, 0.5), readB.node.scale(1, 0.5))),
  );

  say('平均很快');
  yield* beat('e22',
    all(p1().opacity(0, 0.5), p2().opacity(1, 0.5),
      avgAxis().opacity(1, 0.5), avgDots[0]().opacity(1, 0.4), avgDots[1]().opacity(1, 0.4), avgDots[2]().opacity(1, 0.4), avgLab().opacity(1, 0.5),
      avgDotLabs[0]().opacity(1, 0.4), avgDotLabs[1]().opacity(1, 0.4), avgDotLabs[2]().opacity(1, 0.4),
      readH.node.opacity(0, 0.4), readS.node.opacity(0, 0.4), readB.node.opacity(0, 0.4)),
    // r5（P2-7）：三绿点各标路名；“尾巴”在右端露一下红点。
    at('尾巴里', all(chain(avgLab().scale(1.1, 0.6), avgLab().scale(1, 0.6)), tailDot().opacity(1, 0.5), tailLab().opacity(1, 0.4))),
  );

  say('影响通常很小');
  yield* beat('e23',
    all(thruBar().opacity(1, 0.5), thruFill().opacity(1, 0.5), thruLab().opacity(1, 0.4), thruScaleLab().opacity(1, 0.4)),
    at('很小', chain(thruFill().width(680, 1.0))),
  );

  say('一点一点做压缩');
  yield* beat('e24',
    all(avgAxis().opacity(0, 0.4), avgDots[0]().opacity(0, 0.4), avgDots[1]().opacity(0, 0.4), avgDots[2]().opacity(0, 0.4), avgLab().opacity(0, 0.4),
      avgDotLabs[0]().opacity(0, 0.4), avgDotLabs[1]().opacity(0, 0.4), avgDotLabs[2]().opacity(0, 0.4), tailDot().opacity(0, 0.4), tailLab().opacity(0, 0.4),
      thruBar().opacity(0, 0.4), thruFill().opacity(0, 0.4), thruLab().opacity(0, 0.4), thruScaleLab().opacity(0, 0.4),
      funnel().opacity(1, 0.5), rwArrow1().opacity(1, 0.5), rwArrow2().opacity(1, 0.5), rwLab1().opacity(1, 0.4), rwLab2().opacity(1, 0.4)),
    at('干扰', chain(waitLab().opacity(1, 0.5), rwArrow1().stroke(T.red, 0.5), rwArrow2().stroke(T.red, 0.5))),
    at('一点一点', all(chain(funnel().position([-320, -105], 0.7), funnel().position([-320, -120], 0.7)), rwArrow1().stroke(T.blue, 0.5), rwArrow2().stroke(T.blue, 0.5))),
  );

  say('等一次昂贵的压缩');
  yield* beat('e25',
    all(resBar().opacity(1, 0.5), resFill().opacity(1, 0.5), resLab().opacity(1, 0.4)),
    at('有限', chain(resFill().width(880, 1.2))),
    at('等一次昂贵的压缩', chain(waitLab().opacity(1, 0.5), rwArrow1().stroke(T.red, 0.5))),
  );

  say('一次查询撞上压缩');
  yield* beat('e25a',
    all(queryDot().opacity(1, 0.4), queryLab().opacity(1, 0.4)),
    at('平时查 251', chain(queryDot().position([-320, 20], 1.2))),
    at('撞上压缩', chain(queryDot().fill(T.red, 0.4), waitLab().scale(1.1, 0.6), waitLab().scale(1, 0.6))),
    at('排队等', chain(funnel().position([-320, -105], 0.6), funnel().position([-320, -120], 0.6))),
  );

  say('平均很快，尾巴很慢');
  yield* beat('e26a',
    all(funnel().opacity(0, 0.4), rwArrow1().opacity(0, 0.4), rwArrow2().opacity(0, 0.4), rwLab1().opacity(0, 0.4), rwLab2().opacity(0, 0.4), waitLab().opacity(0, 0.4), resBar().opacity(0, 0.4), resFill().opacity(0, 0.4), resLab().opacity(0, 0.4),
      queryDot().opacity(0, 0.4), queryLab().opacity(0, 0.4),
      axisX().opacity(1, 0.5), axisY().opacity(1, 0.5), axisXLab().opacity(1, 0.4), axisYLab().opacity(1, 0.4),
      tick0().opacity(1, 0.4), tickHalf().opacity(1, 0.4), tickFull().opacity(1, 0.4),
      curve().opacity(1, 0.5),
      // r4 恢复轮次（抽帧：e26a 定格 8.40s）：曲线不再整条淡入，8 秒慢慢画出来，画面一直有变化。
      curve().end(1, 8.0),
      p50Dot().opacity(1, 0.5), p50Lab().opacity(1, 0.4)),
    at('高百分位', chain(p99Dot().opacity(1, 0.5), p99Lab().opacity(1, 0.4), curveNote().opacity(1, 0.4))),
    at('相当高', chain(p99Dot().scale(1.25, 0.5), p99Dot().scale(1, 0.5))),
    // r4（P2-11）：旁白给百分位下定义时，p99 点再脉冲一次，与定义对上。
    at('百分之九十九', chain(p99Dot().scale(1.25, 0.5), p99Dot().scale(1, 0.5))),
    // r5（P1）：白点沿新的累积分布曲线从左走到 p99 处——一开始冲上去、越往右越平。
    at('把一百次请求按快慢排队', chain(rankDot().opacity(1, 0.4),
      rankDot().position([-320, 10], 1.0), rankDot().position([-240, -30], 1.0), rankDot().position([-160, -90], 1.0),
      rankDot().position([-80, -140], 0.9), rankDot().position([0, -170], 0.8), rankDot().position([160, -205], 0.9),
      rankDot().position([280, -216], 0.9),
      rankDot().opacity(0, 0.5))),
  );

  say('过了线，就是尾巴');
  yield* beat('e26b',
    // r4 恢复轮次（抽帧：e26b 定格 11.69s→6.73s，仍 ≥6s error）：定格全在拍首 0–6.7s——纵轴小标签淡入改的像素太少，
    // freezedetect 认不出。白点改走两遍：第一遍跟着“横轴是响应时间，越往右越慢”从左走到右（越往右越慢本身就是走出来的）；
    // 第二遍跟着“大多数请求挤在左边很快……”再走一遍，左边多待一会儿。白点加到 36px，走得也不慢（每帧改的像素才够阈值）。
    all(rankDot().opacity(0, 0), rankDot().position([-480, 140], 0)),
    // r4（P2-11）：纵轴定性标注“累计占比”（无刻度数值轴，只标含义）；讲清曲线画法时两点依次脉冲。
    at('纵轴是累计占比', axisYLab().opacity(1, 0.4)),
    at('横轴是响应时间', chain(rankDot().opacity(1, 0.4),
      rankDot().position([-320, 10], 1.0), rankDot().position([-240, -30], 1.0), rankDot().position([-160, -90], 1.0),
      rankDot().position([-80, -140], 0.9), rankDot().position([0, -170], 0.8), rankDot().position([160, -205], 0.9),
      rankDot().position([280, -216], 0.8),
      rankDot().opacity(0, 0.5))),
    at('大多数请求', all(
      chain(p50Dot().scale(1.25, 0.5), p50Dot().scale(1, 0.5)),
      chain(rankDot().position([-480, 140], 0), rankDot().opacity(1, 0.4),
        rankDot().position([-320, 10], 1.2), rankDot().position([-240, -30], 1.2), rankDot().position([-160, -90], 1.0),
        rankDot().position([-80, -140], 0.9), rankDot().position([0, -170], 0.8), rankDot().position([160, -205], 0.9),
        rankDot().position([280, -216], 0.8),
        rankDot().opacity(0, 0.5)),
    )),
    // r5（P1）：旁白改成“曲线一开始就冲上去，越往右越平”——与累积分布画法一致。
    at('越往右越平', chain(p99Dot().scale(1.25, 0.5), p99Dot().scale(1, 0.5))),
    at('竖线', chain(thresholdLine().opacity(1, 0.5), thresholdLab().opacity(1, 0.4))),
    at('百分之九十九', chain(p99Dot().scale(1.25, 0.5), p99Dot().scale(1, 0.5))),
  );

  say('B 树更可预测');
  yield* beat('e27',
    // r5（P1）：B 树线在橙线之上，它的 p99 竖线（x=160）比橙色 p99 线（x=280）更靠左。
    all(btreeCurve().opacity(1, 0.5), btreeLab().opacity(1, 0.4), btreeThreshold().opacity(1, 0.5)),
    at('更可预测', chain(btreeLab().scale(1.1, 0.7), btreeLab().scale(1, 0.7))),
  );
});
