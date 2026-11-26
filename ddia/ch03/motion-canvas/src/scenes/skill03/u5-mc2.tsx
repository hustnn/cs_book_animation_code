// U5 场景 2（MC，r3）：e9–e15b —— LSM 写一次（日志 + 刷盘）、顺序写、机械盘、反复压缩、写放大计数器（N3 后半）、固态盘磨损、带宽瓶颈。
// 分镜：skill-ch03/beats-u5.md；原文：DDIA §3.5（书页 p84，PDF p106）。
// N3 计数器（Counter）接 mc1：e9 磁盘写 1 次（日志），e10 跳到 2 次（刷盘），e12a 第一遍压缩重写到 3 次，
// e12b 第二遍压缩重写到 4 次，e13 换成“磁盘写 ×N”+“写放大”+ 紫色“示意：倍数随配置与负载而变”；计数器数字是示意倍数，不是原书数字。
// r5：e12a/e12b 合并出一段新段、旧段淡出，并标“计数器数的是磁盘写次数，不是段数”；e15b 框下加“▼ 示意：100 → 60”。
// e11 顺序写与随机写用两个磁头点分别移动，避免同一对象跨 at() 补间（r1 曾报 lint）。
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
  const counterA = new Counter([0, 200], '磁盘写 ', ' 次', {size: SIZE.body, tone: T.yellow});
  const counterB = new Counter([280, 110], '磁盘写 ', ' 次', {size: SIZE.body, tone: T.yellow});
  counterB.n(2); // 接 p1 计好的 2 次（日志 + 刷盘），e12 再加一次压缩重写

  // ---- 第 1 页：LSM 写一次：日志 + 刷盘 ----
  const p1 = createRef<Node>();
  const ball = createRef<Circle>();
  const logBox = createRef<Rect>();
  const memBox = createRef<Rect>();
  const flushArrow = createRef<Line>();
  const seqFile = createRef<Rect>();

  // ---- 第 2 页：机械硬盘：顺序写 vs 随机写 ----
  const p2 = createRef<Node>();
  const disk = createRef<Circle>();
  const headSeq = createRef<Circle>();
  const headRnd = createRef<Circle>();
  const seqSpeed = createRef<Rect>();
  const rndSpeed = createRef<Rect>();

  // ---- 第 3 页：反复压缩 + 计数器 + 固态盘磨损 + 带宽 ----
  const p3 = createRef<Node>();
  const funnel = createRef<Txt>();
  const funnelLab = createRef<Txt>();
  const segBoxes = [0, 1, 2].map(() => createRef<Rect>());
  const dataBall = createRef<Circle>();
  const onceBox = createRef<Rect>();
  const waN = createRef<Txt>();
  const waLab = createRef<Txt>();
  const waNote = createRef<Txt>();
  const ssdBox = createRef<Rect>();
  const ssdCells = [0, 1, 2, 3, 4, 5].map(() => createRef<Rect>());
  const bwBar = createRef<Rect>();
  const bwFill = createRef<Rect>();
  const bwLab = createRef<Txt>();
  const perSec = createRef<Rect>();
  const perSecLab = createRef<Txt>();
  // r5（P2-3）：e12b 合出来的新段 + 计数器口径标；e15b 框下掉下来的示意数。
  const newSeg = createRef<Rect>();
  const counterLab = createRef<Txt>();
  const perSecNum = createRef<Txt>();

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
      {counterA.node}
      {counterB.node}

      {/* 第 1 页 */}
      <Node ref={p1} opacity={0}>
        <Circle ref={ball} position={[0, -230]} width={54} height={54} fill={T.yellow} opacity={0} />
        <Rect ref={logBox} position={[-320, -140]} width={380} height={110} radius={14} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'日志'} />
        </Rect>
        <Rect ref={memBox} position={[320, -140]} width={380} height={110} radius={14} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'内存表'} />
        </Rect>
        <Line ref={flushArrow} points={[[320, -85], [320, -5]]} stroke={T.green} lineWidth={4} endArrow opacity={0} />
        <Rect ref={seqFile} position={[0, 30]} width={900} height={70} radius={12} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'紧凑的文件，一路顺序写进去'} />
        </Rect>
      </Node>

      {/* 第 2 页 */}
      <Node ref={p2} opacity={0}>
        <Circle ref={disk} position={[0, -60]} width={300} height={300} fill={T.card} stroke={T.line} lineWidth={2} opacity={0} />
        <Circle ref={headSeq} position={[-120, -60]} width={26} height={26} fill={T.green} opacity={0} />
        <Circle ref={headRnd} position={[-120, 60]} width={26} height={26} fill={T.red} opacity={0} />
        <Rect ref={seqSpeed} position={[-300, 140]} offset={[-1, 0]} width={60} height={50} radius={10} fill={T.green} opacity={0}>
          <Txt position={[0, -42]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'顺序写'} />
        </Rect>
        <Rect ref={rndSpeed} position={[-300, 235]} offset={[-1, 0]} width={60} height={50} radius={10} fill={T.red} opacity={0}>
          <Txt position={[0, -42]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'随机写'} />
        </Rect>
      </Node>

      {/* 第 3 页 */}
      <Node ref={p3} opacity={0}>
        <Txt ref={funnel} position={[0, -200]} fontSize={64} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'▼'} opacity={0} />
        <Txt ref={funnelLab} position={[0, -130]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'压缩合并'} opacity={0} />
        {[0, 1, 2].map(i => (
          <Rect
            key={`seg-${i}`}
            ref={segBoxes[i]}
            position={[-360 + i * 360, -60]}
            width={320}
            height={90}
            radius={12}
            fill={T.card}
            stroke={T.blue}
            lineWidth={2}
            opacity={0}
          >
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={`段 ${i + 1}`} />
          </Rect>
        ))}
        <Circle ref={dataBall} position={[-360, 10]} width={30} height={30} fill={T.yellow} opacity={0} />
        <Rect ref={newSeg} position={[0, 45]} width={320} height={64} radius={12} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'新段：合出来的'} />
        </Rect>
        <Txt ref={counterLab} position={[0, 235]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'计数器数的是磁盘写次数，不是段数'} opacity={0} />
        <Rect ref={onceBox} position={[-380, 110]} width={340} height={80} radius={12} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'数据库写 1 次'} />
        </Rect>
        <Txt ref={waN} position={[280, 110]} fontSize={SIZE.body} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'磁盘写 ×N'} opacity={0} />
        <Txt ref={waLab} position={[0, 190]} fontSize={SIZE.body} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'写放大'} opacity={0} />
        <Txt ref={waNote} position={[0, 235]} fontSize={SIZE.label} fill={T.purple} fontFamily={FONT.sans} text={'示意：倍数随配置与负载而变'} opacity={0} />
        <Rect ref={ssdBox} position={[0, -60]} width={560} height={220} radius={14} fill={T.card} stroke={T.line} lineWidth={2} opacity={0}>
          <Txt position={[0, -82]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'固态硬盘'} />
        </Rect>
        {[0, 1, 2, 3, 4, 5].map(i => (
          <Rect
            key={`cell-${i}`}
            ref={ssdCells[i]}
            position={[-180 + (i % 3) * 180, -30 + Math.floor(i / 3) * 90]}
            width={150}
            height={70}
            radius={8}
            fill={T.card}
            stroke={T.green}
            lineWidth={2}
            opacity={0}
          />
        ))}
        <Rect ref={bwBar} position={[0, -60]} width={900} height={60} radius={30} fill={T.card} stroke={T.line} lineWidth={2} opacity={0} />
        <Rect ref={bwFill} position={[-450, -60]} offset={[-1, 0]} width={200} height={60} radius={30} fill={T.red} opacity={0} />
        <Txt ref={bwLab} position={[0, 10]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'磁盘带宽'} opacity={0} />
        <Rect ref={perSec} position={[0, 110]} width={420} height={64} radius={12} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt ref={perSecLab} position={[0, 0]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'每秒能处理的写'} />
        </Rect>
        <Txt ref={perSecNum} position={[0, 168]} fontSize={SIZE.label} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'▼ 示意：100 → 60'} opacity={0} />
      </Node>
    </>
  );

  say('先记进日志');
  yield* beat('e9',
    all(p1().opacity(1, 0.5), ball().opacity(1, 0.5), logBox().opacity(1, 0.5), counterA.node.opacity(1, 0.4)),
    at('记进日志', chain(ball().position([-320, -230], 0.9), counterA.bump())),
  );

  say('顺序写紧凑文件');
  yield* beat('e10',
    all(p1().scale(1.02, beat.dur('e10')), memBox().opacity(1, 0.5), flushArrow().opacity(1, 0.5), seqFile().opacity(1, 0.5)),
    at('刷盘', chain(ball().position([320, -230], 0.9), counterA.bump())),
    at('紧凑的文件', seqFile().stroke(T.green, 0.5)),
  );

  say('顺序写比随机写快得多');
  yield* beat('e11',
    all(p1().opacity(0, 0.5), p2().opacity(1, 0.5), disk().opacity(1, 0.5), headSeq().opacity(1, 0.5), headRnd().opacity(1, 0.5), seqSpeed().opacity(1, 0.5), rndSpeed().opacity(1, 0.5), counterA.node.opacity(0, 0.4)),
    at('顺序写', all(headSeq().position([120, -60], 1.2), seqSpeed().width(760, 1.2))),
    at('随机写', all(headRnd().position([120, 60], 0.8), rndSpeed().width(300, 0.8))),
  );

  say('先合一遍：两次变三次');
  yield* beat('e12a',
    all(p2().opacity(0, 0.5), p3().opacity(1, 0.5), funnel().opacity(1, 0.5), funnelLab().opacity(1, 0.5), segBoxes[0]().opacity(1, 0.5), dataBall().opacity(1, 0.5), counterB.node.opacity(1, 0.4)),
    at('反复压缩', funnel().position([0, -190], 0.8)),
    at('先合一遍', all(segBoxes[1]().opacity(1, 0.5), chain(dataBall().position([0, 10], 0.9), counterB.bump()))),
    // r5（QA：e12a idle 5.7s——旁白加长后半段无动作）：念到“旧段随后删掉”时旧段先暗下来。
    at('旧段随后删掉', all(segBoxes[0]().opacity(0.6, 0.5), segBoxes[1]().opacity(0.6, 0.5))),
  );

  say('再合一遍：三次变四次');
  // r5（TTS 坏音频：e12b 原句 52 字录出 25.0s，句间 8.7 秒停顿）：拆成 e12b/e12c 两拍重录，不原句重试。
  yield* beat('e12b',
    // r5（P2-3）：合并是把几段写成一段新的、旧段随后删掉——旧段淡出，漏斗下出一段新段；
    // 计数器数的是磁盘写次数，不是段数。
    at('再合一遍', all(newSeg().opacity(1, 0.5), segBoxes[0]().opacity(0.25, 0.5), segBoxes[1]().opacity(0.25, 0.5),
      chain(dataBall().position([0, 10], 0.6), counterB.bump()))),
    at('没有固定的总次数', chain(counterB.node.scale(1.15, 0.5), counterB.node.scale(1, 0.5))),
  );

  say('计数器数的是磁盘写，不是段数');
  // r5（TTS 坏音频：e12c 首录截断，只念约 1 秒、后 6.9 秒静音）：再拆成 e12c/e12d、改写法重录，不原句重试。
  yield* beat('e12c',
    at('写盘的次数', counterLab().opacity(1, 0.4)),
  );

  say('不是段有几段');
  yield* beat('e12d',
    at('不是段有几段', chain(counterLab().scale(1.1, 0.4), counterLab().scale(1, 0.4))),
  );

  say('1 次写 → N 次磁盘写');
  yield* beat('e13',
    all(p3().scale(1.02, beat.dur('e13')),
      funnel().opacity(0, 0.4), funnelLab().opacity(0, 0.4), segBoxes[0]().opacity(0, 0.4), segBoxes[1]().opacity(0, 0.4), segBoxes[2]().opacity(0, 0.4), dataBall().opacity(0, 0.4),
      newSeg().opacity(0, 0.4), counterLab().opacity(0, 0.4),
      onceBox().opacity(1, 0.5)),
    at('多次写', chain(counterB.node.opacity(0, 0.4), waN().opacity(1, 0.5), waN().scale(1.15, 0.6), waN().scale(1, 0.6))),
    at('写放大', chain(waLab().opacity(1, 0.5), waNote().opacity(1, 0.4))),
  );

  say('固态盘，写多了会磨损');
  yield* beat('e14',
    all(onceBox().opacity(0, 0.4), waN().opacity(0, 0.4), waLab().opacity(0, 0.4), waNote().opacity(0, 0.4),
      ssdBox().opacity(1, 0.5)),
    at('只能被覆盖有限次数', all(ssdCells[0]().opacity(1, 0.4), ssdCells[1]().opacity(1, 0.4), ssdCells[2]().opacity(1, 0.4))),
    at('磨损', all(ssdCells[3]().opacity(1, 0.4), ssdCells[4]().opacity(1, 0.4), ssdCells[5]().opacity(1, 0.4),
      ssdCells[0]().fill(T.red, 0.5), ssdCells[1]().fill(T.red, 0.5))),
  );

  say('瓶颈是写磁盘的速度');
  yield* beat('e15a',
    all(ssdBox().opacity(0, 0.4), ...ssdCells.map(c => c().opacity(0, 0.4)),
      bwBar().opacity(1, 0.5), bwFill().opacity(1, 0.5)),
    at('瓶颈', all(bwLab().opacity(1, 0.4), bwFill().width(700, 1.5))),
  );

  say('带宽被放大吃掉');
  yield* beat('e15b',
    all(perSec().opacity(1, 0.5), perSecLab().opacity(1, 0.4)),
    // r5（QA：e15b overrun 0.2s——chain 串行 0.8+0.4=1.2s 超出旁白）：改并行 all，0.8s 内做完。
    at('越少', all(perSec().width(260, 0.8), perSecNum().opacity(1, 0.4))),
  );
});
