// U3 场景 2（MC）：b16–b28 —— §1.4 软件错误：系统相关、闰秒、失控进程、级联失效、潜伏 bug、六条应对。
// 分镜：skill-ch01/ch01-beats.md U3 一节；原文：DDIA §1.4（书页 p8–9，PDF p30–31）。
// 时长全部来自 timeline/u3.json（beat() 驱动），不手写 waitFor 魔法数字。
// 颜色、字号、安全区一律取自 lib/theme，不手写十六进制色值。
// b20 已拆为 b20a（四种资源逐条亮起）/ b20b（被一个进程吸干），因原版 TTS 在 3.5 秒后只剩 11 秒死寂。
// b27 已拆为 b27a（生产中测量、监控、分析）/ b27b（运行时自检），因原版 TTS 重复尾句、改写版又在 1.85 秒后截断；「第六，运行时自检」三种前缀写法均截断，改「运行时做自检」才通过。
import {Circle, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, chain, createRef, waitFor} from '@motion-canvas/core';
import {makeBeats} from '../../lib/beats';
import {FONT, SAFE, SIZE, T} from '../../lib/theme';
import timeline from '../../timeline/u3.json';

export default makeScene2D(function* (view) {
  view.fill(T.bg);
  const beat = makeBeats(timeline);

  const header = createRef<Txt>();
  const anchor = createRef<Txt>();

  // ---------- b16–b18：节点阵（随机零星红 vs 同时变红） ----------
  const nodes = createRef<Node>();
  const nodeRects = Array.from({length: 12}, () => createRef<Rect>());
  const fewRed = [0, 6, 11].map(() => createRef<Rect>());
  const rackHeat = createRef<Rect>();
  const tempTag = createRef<Txt>();

  // ---------- b19：闰秒时钟 ----------
  const g19 = createRef<Node>();
  const frozen = [0, 1, 2, 3].map(() => createRef<Rect>());
  const badInput = createRef<Txt>();

  // ---------- b20a/b20b：四种资源条 ----------
  const g20 = createRef<Node>();
  const resBars = [0, 1, 2, 3].map(() => createRef<Rect>());
  const resLabels = [0, 1, 2, 3].map(() => createRef<Txt>());
  const hog = createRef<Rect>();

  // ---------- b21：依赖的服务变色 ----------
  const g21 = createRef<Node>();
  const svcBox = createRef<Rect>();
  const svcState = createRef<Txt>();
  const svcState2 = createRef<Txt>();
  const svcState3 = createRef<Txt>();

  // ---------- b22：级联失效 ----------
  const g22 = createRef<Node>();
  const cascade = [0, 1, 2, 3].map(() => createRef<Rect>());

  // ---------- b23：潜伏的地雷 ----------
  const g23 = createRef<Node>();
  const conds = [0, 1, 2].map(() => createRef<Txt>());
  const mine = createRef<Circle>();

  // ---------- b24：假设被划掉 ----------
  const g24 = createRef<Node>();
  const strike = createRef<Rect>();
  const alarm = createRef<Txt>();

  // ---------- b25：测试网 + 隔离墙 ----------
  const g25 = createRef<Node>();
  const netBug = createRef<Circle>();
  const wall = createRef<Rect>();

  // ---------- b26：想清假设，崩溃重启 ----------
  const g26 = createRef<Node>();
  const checks = [0, 1, 2].map(() => createRef<Txt>());
  const crashBox = createRef<Rect>();

  // ---------- b27：生产中监控分析 ----------
  const g27 = createRef<Node>();
  const dashCards = [0, 1, 2].map(() => createRef<Node>());
  const curveBars = [0, 1, 2, 3, 4, 5].map(() => createRef<Rect>());
  const selfCheck = createRef<Txt>();

  // ---------- b28：消息队列进出计数 ----------
  const g28 = createRef<Node>();
  const outGood = createRef<Txt>();
  const outBad = createRef<Txt>();
  const alert28 = createRef<Txt>();

  const say = (text: string) => anchor().text(text);

  view.add(
    <>
      <Txt
        ref={header}
        position={[-SAFE.halfW, -SAFE.halfH]}
        offset={[-1, -1]}
        fontSize={SIZE.label}
        fill={T.muted}
        fontFamily={FONT.sans}
        text={'第 1 章 · 故障从哪来'}
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

      {/* b16–b18：12 个节点，4 列 × 3 行 */}
      <Node ref={nodes} opacity={0}>
        {Array.from({length: 12}, (_, i) => {
          const col = i % 4;
          const row = Math.floor(i / 4);
          return (
            <Rect
              key={`u3-node-${i}`}
              ref={nodeRects[i]}
              position={[-390 + col * 260, -160 + row * 140]}
              width={200}
              height={100}
              radius={14}
              fill={T.card}
              stroke={T.blue}
              lineWidth={2}
            />
          );
        })}
        {[0, 6, 11].map((n, k) => {
          const col = n % 4;
          const row = Math.floor(n / 4);
          return (
            <Rect
              key={`u3-fewred-${k}`}
              ref={fewRed[k]}
              position={[-390 + col * 260, -160 + row * 140]}
              width={200}
              height={100}
              radius={14}
              fill={T.red}
              opacity={0}
            />
          );
        })}
        <Rect ref={rackHeat} position={[0, -20]} width={1040} height={340} radius={14} fill={T.red} opacity={0} />
        {/* r2 #1-1：热晕 0.35→0.15，只“热”不“坏” */}
        <Txt ref={tempTag} position={[0, 200]} fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.sans} opacity={0} text={'机架温度高了，整排盘都热'} />
      </Node>

      {/* b19：闰秒 */}
      <Node ref={g19} opacity={0}>
        <Txt position={[0, -220]} fontSize={SIZE.title} fontWeight={700} fill={T.white} fontFamily={FONT.serif} text={'2012 年 6 月 30 日 · 闰秒'} />
        <Txt position={[0, -140]} fontSize={SIZE.body} fill={T.yellow} fontFamily={FONT.sans} text={'23:59:60'} />
        {[0, 1, 2, 3].map(i => (
          <Rect key={`u3-frozen-${i}`} ref={frozen[i]} position={[-435 + i * 290, -20]} width={240} height={130} radius={14} fill={T.card} stroke={T.blue} lineWidth={2}>
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={`应用 ${i + 1}`} />
          </Rect>
        ))}
        <Txt position={[0, 110]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'Linux 内核一个 bug，许多应用同时 hang 住'} />
        <Txt ref={badInput} position={[0, 170]} fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.sans} opacity={0} text={'同一个坏输入，所有实例一起崩'} />
      </Node>

      {/* b20：四种共享资源 */}
      <Node ref={g20} opacity={0}>
        {['CPU 时间', '内存', '磁盘空间', '网络带宽'].map((t, i) => (
          <Node key={`u3-res-${i}`}>
            <Txt ref={resLabels[i]} position={[-460, -190 + i * 100]} offset={[-1, 0]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} opacity={0} text={t} />
            <Rect position={[-160, -190 + i * 100]} offset={[-1, 0]} width={760} height={44} radius={10} fill={T.card} stroke={T.line} lineWidth={2} />
            <Rect ref={resBars[i]} position={[-160, -190 + i * 100]} offset={[-1, 0]} width={0} height={44} radius={10} fill={T.blue} opacity={0} />
          </Node>
        ))}
        <Rect ref={hog} position={[0, 180]} width={420} height={70} radius={12} fill={T.card} stroke={T.red} lineWidth={3} opacity={0}>
          <Txt fontSize={SIZE.label} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'失控进程'} />
        </Rect>
      </Node>

      {/* b21：依赖的服务绿 → 黄 → 红 */}
      <Node ref={g21} opacity={0}>
        <Rect ref={svcBox} position={[0, -40]} width={460} height={200} radius={16} fill={T.card} stroke={T.green} lineWidth={4}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'依赖的服务'} />
        </Rect>
        <Txt ref={svcState} position={[0, 120]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} text={'正常'} />
        <Txt ref={svcState2} position={[0, 120]} fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.sans} opacity={0} text={'变慢了'} />
        <Txt ref={svcState3} position={[0, 120]} fontSize={SIZE.label} fill={T.red} fontFamily={FONT.sans} opacity={0} text={'没反应，返回损坏的响应'} />
      </Node>

      {/* b22：级联失效，4 个组件一串 */}
      <Node ref={g22} opacity={0}>
        {[0, 1, 2, 3].map(i => (
          <Node key={`u3-cas-${i}`}>
            <Rect ref={cascade[i]} position={[-435 + i * 290, -40]} width={240} height={150} radius={14} fill={T.card} stroke={T.blue} lineWidth={2}>
              <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={`组件 ${i + 1}`} />
            </Rect>
            {i < 3 && <Line points={[[-315 + i * 290, -40], [-195 + i * 290, -40]]} stroke={T.line} lineWidth={3} endArrow />}
          </Node>
        ))}
        <Txt position={[0, 110]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'一个小错触发下一个，再触发更多'} />
      </Node>

      {/* b23：潜伏的地雷 */}
      <Node ref={g23} opacity={0}>
        <Line points={[[-560, 40], [560, 40]]} stroke={T.line} lineWidth={3} />
        <Txt position={[0, -220]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'地面之下：bug 潜伏多年'} />
        <Circle ref={mine} position={[0, 140]} width={60} height={60} fill={T.red} opacity={0} />
        {['异常条件 1', '异常条件 2', '异常条件 3'].map((t, i) => (
          <Txt key={`u3-cond-${i}`} ref={conds[i]} position={[-360 + i * 360, -120]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} opacity={0} text={t} />
        ))}
      </Node>

      {/* b24：假设清单，一条被划掉 */}
      <Node ref={g24} opacity={0}>
        {['假设：磁盘不会同时坏', '假设：时钟永远准', '假设：网络不会丢包'].map((t, i) => (
          <Txt key={`u3-asm-${i}`} position={[0, -160 + i * 90]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={t} />
        ))}
        <Rect ref={strike} position={[0, 20]} width={0} height={8} fill={T.red} />
        <Txt ref={alarm} position={[0, 160]} fontSize={SIZE.label} fontWeight={700} fill={T.red} fontFamily={FONT.sans} opacity={0} text={'假设不对了，系统报警'} />
      </Node>

      {/* b25：测试网兜住 bug，隔离墙挡住蔓延 */}
      <Node ref={g25} opacity={0}>
        <Rect position={[-280, -40]} width={420} height={260} radius={16} fill={T.card} stroke={T.green} lineWidth={2}>
          <Txt position={[0, -90]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'彻底测试'} />
        </Rect>
        <Circle ref={netBug} position={[-280, 40]} width={44} height={44} fill={T.red} />
        <Rect ref={wall} position={[40, -40]} width={14} height={0} fill={T.yellow} />
        <Rect position={[320, -40]} width={420} height={260} radius={16} fill={T.card} stroke={T.blue} lineWidth={2}>
          <Txt position={[0, -90]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'进程隔离'} />
        </Rect>
        <Txt position={[320, 20]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'蔓延到这里就停了'} />
      </Node>

      {/* b26：想清假设，崩溃重启 */}
      <Node ref={g26} opacity={0}>
        {['想清假设', '想清交互', '允许崩溃重启'].map((t, i) => (
          <Txt key={`u3-chk-${i}`} ref={checks[i]} position={[-300, -160 + i * 90]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} opacity={0} text={t} />
        ))}
        <Rect ref={crashBox} position={[300, -40]} width={300} height={170} radius={16} fill={T.card} stroke={T.blue} lineWidth={3}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'进程'} />
        </Rect>
        <Txt position={[300, 100]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'崩溃了就重启'} />
      </Node>

      {/* b27：生产中监控分析 */}
      <Node ref={g27} opacity={0}>
        {['测量', '监控', '分析'].map((t, i) => (
          <Node key={`u3-dash-${i}`} ref={dashCards[i]} opacity={0}>
            <Rect position={[-360 + i * 360, -180]} width={300} height={110} radius={14} fill={T.card} stroke={T.blue} lineWidth={2}>
              <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={t} />
            </Rect>
          </Node>
        ))}
        {[0, 1, 2, 3, 4, 5].map(i => (
          <Rect
            key={`u3-curve-${i}`}
            ref={curveBars[i]}
            position={[-400 + i * 160, 80]}
            offset={[0, 1]}
            width={90}
            height={10}
            radius={8}
            fill={T.green}
          />
        ))}
        <Txt position={[0, 180]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'生产环境里的系统行为'} />
        <Txt ref={selfCheck} position={[0, 125]} fontSize={SIZE.label} fontWeight={700} fill={T.green} fontFamily={FONT.sans} opacity={0} text={'✓ 运行时自检'} />{/* r3 补：原 [0,260] 与底部 say 字幕同屏高（≈620）重叠成 P0，移到柱条底（y=80）与「生产环境」标签（y=180）之间的空档 */}
      </Node>

      {/* b28：消息队列进出计数 */}
      <Node ref={g28} opacity={0}>
        <Txt position={[0, -220]} fontSize={SIZE.body} fontWeight={700} fill={T.white} fontFamily={FONT.sans} text={'消息队列自己数数'} />
        <Rect position={[-260, -40]} width={380} height={150} radius={16} fill={T.card} stroke={T.blue} lineWidth={2}>
          <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'进来 100'} />
        </Rect>
        <Rect position={[260, -40]} width={380} height={150} radius={16} fill={T.card} stroke={T.blue} lineWidth={2}>
          <Txt ref={outGood} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'出去 100'} />
          <Txt ref={outBad} fontSize={SIZE.body} fontWeight={700} fill={T.red} fontFamily={FONT.sans} opacity={0} text={'出去 98'} />
        </Rect>
        <Txt ref={alert28} position={[0, 120]} fontSize={SIZE.label} fontWeight={700} fill={T.red} fontFamily={FONT.sans} opacity={0} text={'对不上，告警！'} />
      </Node>
    </>,
  );

  // b16：硬件故障大多随机、互相独立——红点零星亮起
  say('硬件故障随机独立');
  yield* beat(
    'b16',
    all(
      nodes().opacity(1, 0.6),
      chain(waitFor(1.2), fewRed[0]().opacity(1, 0.6)),
      chain(waitFor(2.6), fewRed[1]().opacity(1, 0.6)),
      chain(waitFor(4.0), fewRed[2]().opacity(1, 0.6)),
    ),
  );

  // b17：弱相关还是有的——机架温度高了，整排盘都热
  say('弱相关：机架温度');
  yield* beat(
    'b17',
    all(
      rackHeat().opacity(0.15, 4.0),
      tempTag().opacity(1, 1.2),
      chain(waitFor(4.5), tempTag().opacity(0, 0.8)),
    ),
  );

  // b18：软件错误不一样——所有节点同一时刻一起变红（r2 #1-6：慢速同步变红 6s，填满 8 秒拍）
  say('软件错误：一次坏一片');
  yield* beat(
    'b18',
    all(
      rackHeat().opacity(0, 0.8),
      ...nodeRects.map(r => r().fill(T.red, 6.0)),
      ...fewRed.map(r => r().opacity(0, 0.5)),
    ),
  );

  // b19：2012 年闰秒，Linux 内核 bug 让许多应用同时 hang 住（r2 #2-5：加一般模式小字）
  say('2012 闰秒');
  yield* beat(
    'b19',
    all(
      nodes().opacity(0, 0.5),
      g19().opacity(1, 0.6),
      chain(frozen[0]().stroke(T.red, 1.2), frozen[1]().stroke(T.red, 1.2), frozen[2]().stroke(T.red, 1.2), frozen[3]().stroke(T.red, 1.2)),
      chain(waitFor(2.0), badInput().opacity(1, 0.8)),
    ),
  );

  // b20a：四种共享资源逐条亮起并长出（r2 #1-6：改 chain 串行；初始宽 0，真正生长）
  say('CPU · 内存 · 磁盘 · 带宽');
  yield* beat(
    'b20a',
    chain(
      all(g19().opacity(0, 0.5), g20().opacity(1, 0.5)),
      all(resLabels[0]().opacity(1, 0.5), resBars[0]().opacity(1, 0.5), resBars[0]().width(760, 1.8)),
      all(resLabels[1]().opacity(1, 0.5), resBars[1]().opacity(1, 0.5), resBars[1]().width(760, 1.8)),
      all(resLabels[2]().opacity(1, 0.5), resBars[2]().opacity(1, 0.5), resBars[2]().width(760, 1.8)),
      all(resLabels[3]().opacity(1, 0.5), resBars[3]().opacity(1, 0.5), resBars[3]().width(760, 1.8)),
    ),
  );

  // b20b：共享资源被一个进程吸干——四条资源条一起缩短
  say('失控进程吸干资源');
  yield* beat(
    'b20b',
    all(
      hog().opacity(1, 0.5),
      resBars[0]().width(60, 2.2),
      resBars[1]().width(60, 2.2),
      resBars[2]().width(60, 2.2),
      resBars[3]().width(60, 2.2),
    ),
  );

  // b21：依赖的服务由绿变黄变红（r2 #1-3：改 chain 串行，三阶段不再坍缩）
  say('依赖的服务变坏了');
  yield* beat(
    'b21',
    chain(
      all(g20().opacity(0, 0.5), g21().opacity(1, 0.5)),
      all(svcBox().stroke(T.yellow, 1.5), svcState().opacity(0, 0.8), svcState2().opacity(1, 0.8)),
      all(svcBox().stroke(T.red, 1.5), svcState2().opacity(0, 0.8), svcState3().opacity(1, 0.8)),
    ),
  );

  // b22：级联失效——红点沿依赖链逐个蔓延（r2 #1-4：改 chain 串行，每步 1.2s）
  say('级联失效');
  yield* beat(
    'b22',
    chain(
      all(g21().opacity(0, 0.5), g22().opacity(1, 0.5)),
      cascade[0]().fill(T.red, 1.2),
      cascade[1]().fill(T.red, 1.2),
      cascade[2]().fill(T.red, 1.2),
      cascade[3]().fill(T.red, 1.2),
    ),
  );

  // b23：bug 潜伏多年，异常条件逐个亮起才触发（r2 #1-6：改 chain 串行）
  say('bug 潜伏多年');
  yield* beat(
    'b23',
    chain(
      all(g22().opacity(0, 0.5), g23().opacity(1, 0.5)),
      conds[0]().opacity(1, 1.0),
      conds[1]().opacity(1, 1.0),
      conds[2]().opacity(1, 1.0),
      mine().opacity(1, 1.2),
    ),
  );

  // b24：假设通常是对的，但总有一天不对了——第三条假设被划掉
  say('假设终会失效');
  yield* beat(
    'b24',
    all(
      g23().opacity(0, 0.5),
      g24().opacity(1, 0.6),
      strike().width(560, 2.5),
      chain(waitFor(2.5), alarm().opacity(1, 0.6)),
    ),
  );

  // b25：彻底测试 + 进程隔离（r2 #2-9：墙与 bug 各拉长到 4s）
  say('测试 + 隔离');
  yield* beat(
    'b25',
    all(
      g24().opacity(0, 0.5),
      g25().opacity(1, 0.6),
      wall().height(280, 4.0),
      netBug().position([-280, -20], 4.0),
    ),
  );

  // b26：想清假设和交互，允许进程崩溃重启（r2 #1-6：检查项改 chain 串行，每项 1.2s）
  say('想清假设，崩溃重启');
  yield* beat(
    'b26',
    all(
      g25().opacity(0, 0.5),
      g26().opacity(1, 0.6),
      chain(checks[0]().opacity(1, 1.2), checks[1]().opacity(1, 1.2), checks[2]().opacity(1, 1.2)),
      chain(waitFor(2.5), chain(crashBox().opacity(0.2, 0.5), crashBox().opacity(1, 0.5))),
    ),
  );

  // b27a：生产中测量、监控、分析（r3：原 b27 拆拍；卡片 0.45s、柱对 0.75s，合计 4.0s，配 4.15s 音频）
  say('生产中监控分析');
  yield* beat(
    'b27a',
    chain(
      all(g26().opacity(0, 0.4), g27().opacity(1, 0.4)),
      dashCards[0]().opacity(1, 0.45),
      dashCards[1]().opacity(1, 0.45),
      dashCards[2]().opacity(1, 0.45),
      all(curveBars[0]().height(90, 0.75), curveBars[1]().height(140, 0.75)),
      all(curveBars[2]().height(110, 0.75), curveBars[3]().height(180, 0.75)),
      all(curveBars[4]().height(150, 0.75), curveBars[5]().height(210, 0.75)),
    ),
  );

  // b27b：第六，运行时自检（r3：拆拍；自检标签在「第六，」后 0.6s 亮起，填 0.95s 逗号停顿）
  say('运行时自检');
  yield* beat(
    'b27b',
    chain(waitFor(0.6), selfCheck().opacity(1, 0.6)),
  );

  // b28：消息队列自己数——进来 100，出去 98，对不上就告警（r2 #2-9：告警出现后慢闪一次）
  say('进数 = 出数？');
  yield* beat(
    'b28',
    all(
      g27().opacity(0, 0.5),
      g28().opacity(1, 0.6),
      chain(waitFor(3.0), all(outGood().opacity(0, 0.5), outBad().opacity(1, 0.5), alert28().opacity(1, 0.6))),
      chain(waitFor(5.5), alert28().opacity(0.3, 0.6), alert28().opacity(1, 0.6)),
    ),
  );
});
