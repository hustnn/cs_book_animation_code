// U5 场景 4（MC，r4）：e28–e34b —— 压缩跟不上写入（段数计数器走查）、基准测试没定论。
// r4：e30/e31 段框与计数器同帧逐个出现（all 并行；r3 的 chain 串行让计数器晚一帧）（P2-6/7）；
// “配好”标签改成“配好的标准”，转入“没配好”时淡出并出“现在：没配好，跟不上”，底部锚点不再重复“配好”（P2-8）；
// e32a 红条标“磁盘占用”，“快满了”→“满了”两步走（P2-9）；e33 点名监控看未合并段数与磁盘占用、满了才停（P2-10）；
// e29 旁白补库变大→压缩带宽的因果链（P2-5）。
// r5：e33c/e33d“未合并段数”/“磁盘占用”两标签轮流点亮（e33c 亮前者、e33d 亮后者、前者变暗）。
// 分镜：skill-ch03/beats-u5.md；原文：DDIA §3.5（书页 p85，PDF p107）。
// 压缩跟不上走查（Counter“未合并段”）：e30 段 1–3 出现各计一次（到 3），e31 段 4–5 出现各计一次（到 5）；
// e30 补“配好”标准：压缩带宽跟得上写入带宽；e32b 交代没有别的原因、就是要查的段变多了。
// e30 定格修（r3 抽帧：218.37–224.37 曾静止 6.00s）：‘压缩带宽’处标准标签轻跳，‘跟不上’处带宽条
// 蓝段变长、黄段缩短（压缩份额掉下来），用现成带宽条走查，不加新元素。
// e29 旁白补上 r1 漏的“最初的写，就是记日志、把内存表刷盘”。
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
  const segCounter = new Counter([380, -120], '未合并段 ', '', {size: SIZE.label, tone: T.text});

  // ---- 第 1 页：压缩跟不上 ----
  const p1 = createRef<Node>();
  const bwBar = createRef<Rect>();
  const bwInit = createRef<Rect>();
  const bwComp = createRef<Rect>();
  const bwInitLab = createRef<Txt>();
  const bwCompLab = createRef<Txt>();
  const dbBox = createRef<Rect>();
  const pileSegs = [0, 1, 2, 3, 4].map(() => createRef<Rect>());
  const diskBar = createRef<Rect>();
  const diskFill = createRef<Rect>();
  const lookDot = createRef<Circle>();
  const monitor = createRef<Rect>();
  const monitorLight = createRef<Circle>();
  const monitorLab = createRef<Txt>();
  const writeArrow = createRef<Line>();
  const stdLab = createRef<Txt>();
  // r4（P2-8）：“现在：没配好，跟不上”——与“配好的标准”同一位置交接。
  const nowLab = createRef<Txt>();
  // r5（P2-11）：e33c/e33d 轮流点亮的两个数标签。
  const segNumLab = createRef<Txt>();
  const diskUseLab = createRef<Txt>();
  // r4（P2-9）：红条标注“磁盘占用”与“快满了”→“满了”两步状态。
  const diskLab = createRef<Txt>();
  const almostLab = createRef<Txt>();
  const fullLab = createRef<Txt>();

  // ---- 第 2 页：基准测试榜单 + 自己的负载 ----
  const p2 = createRef<Node>();
  const board = createRef<Rect>();
  const boardBars = [0, 1, 2].map(() => createRef<Rect>());
  const boardQ = createRef<Txt>();
  const loadCard = createRef<Rect>();
  const loadRow1 = createRef<Rect>();
  const loadRow2 = createRef<Rect>();
  const loadDot = createRef<Circle>();

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
      {segCounter.node}

      {/* 第 1 页 */}
      <Node ref={p1} opacity={0}>
        <Rect ref={bwBar} position={[0, -180]} width={1000} height={64} radius={14} fill={T.card} stroke={T.line} lineWidth={2} opacity={0} />
        <Rect ref={bwInit} position={[-500, -180]} offset={[-1, 0]} width={1000} height={64} radius={14} fill={T.blue} opacity={0} />
        <Rect ref={bwComp} position={[0, -180]} offset={[-1, 0]} width={500} height={64} radius={14} fill={T.yellow} opacity={0} />
        <Txt ref={bwInitLab} position={[-150, -180]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'最初的写'} opacity={0} />
        <Txt ref={bwCompLab} position={[250, -180]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'后台压缩'} opacity={0} />
        <Rect ref={dbBox} position={[0, -60]} width={500} height={80} radius={12} fill={T.card} stroke={T.line} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'数据库越来越大'} />
        </Rect>
        {[0, 1, 2, 3, 4].map(i => (
          <Rect
            key={`pile-${i}`}
            ref={pileSegs[i]}
            position={[-400 + i * 200, 60]}
            width={180}
            height={70}
            radius={10}
            fill={T.card}
            stroke={T.blue}
            lineWidth={2}
            opacity={0}
          >
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={`段 ${i + 1}`} />
          </Rect>
        ))}
        <Rect ref={diskBar} position={[0, 150]} width={900} height={40} radius={20} fill={T.card} stroke={T.line} lineWidth={2} opacity={0} />
        <Rect ref={diskFill} position={[-450, 150]} offset={[-1, 0]} width={60} height={40} radius={20} fill={T.red} opacity={0} />
        <Txt ref={diskLab} position={[0, 108]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'磁盘占用'} opacity={0} />
        <Txt ref={almostLab} position={[0, 198]} fontSize={SIZE.label} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'快满了'} opacity={0} />
        <Txt ref={fullLab} position={[0, 198]} fontSize={SIZE.label} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'满了'} opacity={0} />
        <Circle ref={lookDot} position={[-400, 0]} width={26} height={26} fill={T.yellow} opacity={0} />
        <Line ref={writeArrow} points={[[-480, -60], [480, -60]]} stroke={T.green} lineWidth={4} endArrow opacity={0} />
        <Rect ref={monitor} position={[0, 150]} width={520} height={90} radius={14} fill={T.card} stroke={T.red} lineWidth={2} opacity={0}>
          <Txt position={[40, 0]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'要显式监控'} />
        </Rect>
        <Circle ref={monitorLight} position={[-180, 150]} width={36} height={36} fill={T.red} opacity={0} />
        <Txt ref={monitorLab} position={[0, 220]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'盯两个数：未合并段数、磁盘占用'} opacity={0} />
        <Txt ref={stdLab} position={[-380, -120]} fontSize={SIZE.label} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'配好的标准：压缩带宽 ≥ 写入带宽'} opacity={0} />
        <Txt ref={nowLab} position={[-380, -120]} fontSize={SIZE.label} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'现在：没配好，跟不上'} opacity={0} />
        <Txt ref={segNumLab} position={[-130, 80]} fontSize={SIZE.label} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'● 未合并段数'} opacity={0} />
        <Txt ref={diskUseLab} position={[130, 80]} fontSize={SIZE.label} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'● 磁盘占用'} opacity={0} />
      </Node>

      {/* 第 2 页 */}
      <Node ref={p2} opacity={0}>
        <Rect ref={board} position={[0, -60]} width={760} height={280} radius={14} fill={T.card} stroke={T.line} lineWidth={2}>
          <Txt position={[0, -110]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'基准测试榜单'} />
        </Rect>
        {[0, 1, 2].map(i => (
          <Rect
            key={`bar-${i}`}
            ref={boardBars[i]}
            position={[-280, -40 + i * 70]}
            offset={[-1, 0]}
            width={[520, 380, 460][i]}
            height={40}
            radius={8}
            fill={T.blue}
            opacity={0}
          />
        ))}
        <Txt ref={boardQ} position={[0, 155]} fontSize={SIZE.body} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'分不出高下？'} opacity={0} />
        <Rect ref={loadCard} position={[0, -60]} width={760} height={280} radius={14} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt position={[0, -110]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'自己的负载'} />
        </Rect>
        <Rect ref={loadRow1} position={[-140, -40]} width={420} height={64} radius={10} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'写多读少'} />
        </Rect>
        <Rect ref={loadRow2} position={[-140, 50]} width={420} height={64} radius={10} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'读多写少'} />
        </Rect>
        <Circle ref={loadDot} position={[140, -40]} width={30} height={30} fill={T.yellow} opacity={0} />
      </Node>
    </>
  );

  say('写得很猛的时候');
  yield* beat('e28',
    all(p1().scale(1.02, beat.dur('e28')), p1().opacity(1, 0.5), bwBar().opacity(1, 0.5), bwInit().opacity(1, 0.5), bwInitLab().opacity(1, 0.4), writeArrow().opacity(1, 0.5)),
    at('写得很猛', chain(writeArrow().stroke(T.yellow, 0.6), writeArrow().stroke(T.green, 0.6))),
  );

  say('库越大，压缩要得越多');
  yield* beat('e29',
    all(bwInit().width(500, 1.0), bwComp().opacity(1, 0.5), bwComp().width(500, 1.0), bwComp().position([0, -180], 1.0),
      bwInitLab().position([-250, -180], 1.0), bwCompLab().opacity(1, 0.4), writeArrow().opacity(0, 0.4)),
    at('可数据库越大', all(dbBox().opacity(1, 0.5), dbBox().scale(1.08, 1.2), bwComp().width(700, 1.5), bwComp().position([-200, -180], 1.5), bwInit().width(300, 1.5), bwCompLab().position([150, -180], 1.5), bwInitLab().position([-350, -180], 1.5))),
    // r4 恢复轮次（QA：e29 idle 7.3s）：尾巴两句“要合的段与数据越多，压缩要的带宽就越多”之前没有动作，
    // 跟着两句再分两步把后台压缩段变长（700→800→850），标签跟着走；e30“跟不上”处会复位。
    at('要合的段与数据越多', all(bwComp().width(800, 1.5), bwComp().position([-300, -180], 1.5), bwInit().width(200, 1.5), bwCompLab().position([100, -180], 1.5), bwInitLab().position([-400, -180], 1.5))),
    at('压缩要的带宽就越多', all(bwComp().width(850, 1.2), bwComp().position([-350, -180], 1.2), bwInit().width(150, 1.2), bwCompLab().position([75, -180], 1.2), bwInitLab().position([-425, -180], 1.2))),
  );

  say('跟不上，段就开始堆');
  yield* beat('e30',
    all(segCounter.node.opacity(1, 0.4)),
    at('配好，就是', stdLab().opacity(1, 0.4)),
    at('压缩带宽', chain(stdLab().scale(1.08, 0.4), stdLab().scale(1, 0.4))),
    // r4（P2-8）：“跟不上”处标准标签淡出，同一位置出“现在：没配好，跟不上”。
    at('跟不上', all(bwInit().width(500, 1.0), bwComp().width(500, 1.0), bwComp().position([0, -180], 1.0),
      bwInitLab().position([-250, -180], 1.0), bwCompLab().position([250, -180], 1.0),
      stdLab().opacity(0, 0.4), nowLab().opacity(1, 0.4))),
    // r4（P2-6）：段框与计数器用 all 并行、同帧变化；旁白把三段摊开念，不再挤在拍尾一句里。
    at('一段', all(pileSegs[0]().opacity(1, 0.5), segCounter.bump())),
    at('两段', all(pileSegs[1]().opacity(1, 0.5), segCounter.bump())),
    at('三段', all(pileSegs[2]().opacity(1, 0.5), segCounter.bump())),
  );

  say('先是四段');
  yield* beat('e31a',
    // r4（P2-7）：第 4 个框出现的那一帧，计数器就是 4——all 并行，不用 chain 串行。
    at('四段', all(pileSegs[3]().opacity(1, 0.5), segCounter.bump())),
  );

  say('段越堆越多');
  yield* beat('e31b',
    at('五段', all(pileSegs[4]().opacity(1, 0.5), segCounter.bump())),
    at('越堆越多', chain(segCounter.node.scale(1.15, 0.4), segCounter.node.scale(1, 0.4))),
  );

  say('磁盘占用一路涨');
  yield* beat('e32a',
    all(diskBar().opacity(1, 0.5), diskFill().opacity(1, 0.5), diskLab().opacity(1, 0.4), lookDot().opacity(1, 0.4)),
    // r4（P2-9）：红条先涨到“快满了”。
    at('快满了', all(diskFill().width(700, 1.2), almostLab().opacity(1, 0.4))),
  );

  say('磁盘写满，读变慢');
  yield* beat('e32a2',
    // r4（P2-9）：再涨满标“满了”。
    at('直到写满', all(diskFill().width(880, 1.2), almostLab().opacity(0, 0.3), fullLab().opacity(1, 0.4))),
    at('查更多段', chain(lookDot().position([0, 0], 0.7), lookDot().position([400, 0], 0.7))),
  );

  say('就是段多了');
  yield* beat('e32b',
    all(p1().scale(1.02, beat.dur('e32b'))),
    at('段变多了', chain(lookDot().scale(1.3, 0.4), lookDot().scale(1, 0.4))),
  );

  say('不降速，满了才停');
  yield* beat('e33a',
    all(diskBar().opacity(0, 0.4), diskFill().opacity(0, 0.4), diskLab().opacity(0, 0.4), almostLab().opacity(0, 0.4), fullLab().opacity(0, 0.4),
      ...pileSegs.map(s => s().opacity(0, 0.4)), lookDot().opacity(0, 0.4), dbBox().opacity(0, 0.4), segCounter.node.opacity(0, 0.4), stdLab().opacity(0, 0.4), nowLab().opacity(0, 0.4),
      monitor().opacity(1, 0.5), monitorLight().opacity(1, 0.5)),
    at('不会把写入速度降下来', chain(writeArrow().opacity(1, 0.5), monitorLight().scale(1.3, 0.8), monitorLight().scale(1, 0.8))),
    // r4（P2-9）：满了才停——红灯再脉冲一次。
    at('满了才停', chain(monitorLight().scale(1.4, 0.5), monitorLight().scale(1, 0.5))),
  );

  say('要显式监控');
  yield* beat('e33b',
    // r4（P2-10）：监控看哪两个数，写在仪表盘下标。
    all(monitorLab().opacity(1, 0.4)),
    at('显式监控', chain(monitorLight().scale(1.3, 0.5), monitorLight().scale(1, 0.5))),
  );

  say('看两个数');
  yield* beat('e33c',
    // r5（P2-11）：念到第一个数时点亮“未合并段数”。
    at('段堆了多少', all(chain(monitorLight().scale(1.3, 0.5), monitorLight().scale(1, 0.5)), segNumLab().opacity(1, 0.4))),
  );

  say('磁盘越用越多');
  yield* beat('e33d',
    // r5（P2-11）：念到第二个数时点亮“磁盘占用”，“未合并段数”变暗——两拍画面区分开。
    at('越用越多', all(chain(monitorLight().scale(1.3, 0.5), monitorLight().scale(1, 0.5)), segNumLab().opacity(0.3, 0.4), diskUseLab().opacity(1, 0.4))),
  );

  say('基准测试常常没定论');
  yield* beat('e34a',
    all(p1().opacity(0, 0.5), p2().opacity(1, 0.5), board().opacity(1, 0.5)),
    at('没有定论', all(boardBars[0]().opacity(1, 0.4), boardBars[1]().opacity(1, 0.4), boardBars[2]().opacity(1, 0.4))),
    at('很敏感', all(boardQ().opacity(1, 0.5), boardBars[0]().fill(T.muted, 0.5), boardBars[1]().fill(T.muted, 0.5), boardBars[2]().fill(T.muted, 0.5))),
  );

  say('拿自己的负载测');
  yield* beat('e34b',
    all(board().opacity(0, 0.4), boardBars[0]().opacity(0, 0.4), boardBars[1]().opacity(0, 0.4), boardBars[2]().opacity(0, 0.4), boardQ().opacity(0, 0.4),
      loadCard().opacity(1, 0.5), loadRow1().opacity(1, 0.5), loadRow2().opacity(1, 0.5), loadDot().opacity(1, 0.4)),
    at('自己的具体负载', chain(loadDot().position([140, 50], 2.0), loadRow2().stroke(T.green, 0.5))),
  );
});
