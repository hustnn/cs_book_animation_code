// U8 场景 2（MC）：b15–b26 —— 好可运维性的七件事、回扣（从救火转到预防）、想一想、下一站。
// 分镜：skill-ch01/ch01-beats.md U8 一节；原文：DDIA §1.12（书页 p20，PDF p42）。
// 时长全部来自 timeline/u8.json（beat() 驱动），不手写 waitFor。
// 颜色、字号、安全区一律取自 lib/theme，不手写十六进制色值。
// r2 修正（rounds/u8/r1/review.md）：b16 计量柱下移（基线 y=200、柱高 60，不再压住“好监控”文字）；
// b20 删轨道内“默认”标签（旋钮拨动后会盖住它）；b21“坏了”移到色块上方、痊愈时淡出；
// b23 金色卡片 2.5s 处重新亮起；b26 第二、三根支柱拍内依次点亮。
import {Circle, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, chain, createRef, waitFor} from '@motion-canvas/core';
import {makeBeats} from '../../lib/beats';
import {FONT, SAFE, SIZE, T} from '../../lib/theme';
import timeline from '../../timeline/u8.json';

export default makeScene2D(function* (view) {
  view.fill(T.bg);
  const beat = makeBeats(timeline);

  const header = createRef<Txt>();
  const anchor = createRef<Txt>();

  // b15/b23：例行任务一键完成 vs 手动做；运维腾出手做高价值事
  const g15 = createRef<Node>();
  const manual15 = createRef<Node>();
  const oneClick15 = createRef<Node>();
  const btn15 = createRef<Rect>();
  const ok15 = createRef<Txt>();
  const gold15 = createRef<Node>();
  // b16：系统内部透视 + 好监控
  const g16 = createRef<Node>();
  const inner16 = [0, 1, 2].map(() => createRef<Rect>());
  const labels16 = [0, 1, 2].map(() => createRef<Txt>());
  const meters16 = [0, 1, 2].map(() => createRef<Rect>());
  // b17：齿轮 + 标准工具插头对接
  const g17 = createRef<Node>();
  const gear17 = createRef<Node>();
  const plug17 = createRef<Line>();
  const tool17 = createRef<Node>();
  // b18：一台机器被抽走检修，服务线不断
  const g18 = createRef<Node>();
  const machine18 = [0, 1, 2].map(() => createRef<Node>());
  // b19：文档翻开，X → Y 因果链
  const g19 = createRef<Node>();
  const doc19 = createRef<Node>();
  const arrow19 = createRef<Line>();
  const y19 = createRef<Node>();
  // b20：默认值开关，管理员拨动它
  const g20 = createRef<Node>();
  const knob20 = createRef<Circle>();
  const override20 = createRef<Txt>();
  // b21：自愈 + 手动控制
  const g21 = createRef<Node>();
  const part21 = createRef<Rect>();
  const crack21 = createRef<Line>();
  const bad21 = createRef<Txt>();
  const heal21 = createRef<Txt>();
  const handle21 = createRef<Node>();
  // b22：同样的操作重复三次，结果都一样
  const g22 = createRef<Node>();
  const rep22 = [0, 1, 2].map(() => createRef<Node>());
  // b24：救火 → 预防
  const g24 = createRef<Node>();
  const fire24 = createRef<Node>();
  const prevent24 = createRef<Node>();
  // b25：例行任务清单空白，留一个问号
  const g25 = createRef<Node>();
  const checks25 = [0, 1, 2].map(() => createRef<Rect>());
  // b26：三根支柱，第二、三根亮起
  const g26 = createRef<Node>();
  const pillars26 = [0, 1, 2].map(() => createRef<Rect>());

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
        text={'第 1 章 · 维护与可运维性'}
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

      {/* b15/b23：手动做 vs 一键完成 */}
      <Node ref={g15} opacity={0}>
        <Node ref={manual15} position={[-310, -60]} opacity={0}>
          <Rect width={420} height={280} radius={16} fill={T.card} stroke={T.muted} lineWidth={2} />
          <Txt position={[0, -100]} fontSize={SIZE.body} fill={T.muted} fontFamily={FONT.sans} text={'手动做'} />
          {[0, 1, 2, 3, 4].map(i => (
            <Rect key={`u8-man-${i}`} position={[0, -40 + i * 36]} width={300} height={20} radius={6} fill={T.line} />
          ))}
        </Node>
        <Node ref={oneClick15} position={[310, -60]} opacity={0}>
          <Rect width={420} height={280} radius={16} fill={T.card} stroke={T.green} lineWidth={2} />
          <Txt position={[0, -100]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'一键完成'} />
          <Rect ref={btn15} position={[0, -10]} width={260} height={90} radius={45} fill={T.green} />
          <Txt position={[0, -10]} fontSize={SIZE.body} fontWeight={700} fill={T.white} fontFamily={FONT.sans} text={'例行任务'} />
          <Txt ref={ok15} position={[0, 80]} fontSize={SIZE.body} fontWeight={700} fill={T.green} fontFamily={FONT.sans} opacity={0} text={'✓ 做完了'} />
        </Node>
        <Node ref={gold15} position={[0, 180]} opacity={0}>
          <Rect width={560} height={76} radius={16} fill={T.card} stroke={T.yellow} lineWidth={2} />
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'运维腾出手，做高价值的事'} />
        </Node>
      </Node>

      {/* b16：系统内部透视 + 好监控 */}
      <Node ref={g16} opacity={0}>
        <Rect position={[0, -90]} width={760} height={280} radius={20} fill={T.card} stroke={T.blue} lineWidth={2} />
        <Txt position={[0, -200]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'系统内部看得见'} />
        {[
          {x: -240, t: '运行时行为'},
          {x: 0, t: '内部状态'},
          {x: 240, t: '监控'},
        ].map((c, i) => (
          <Rect
            key={`u8-in-${i}`}
            ref={inner16[i]}
            position={[c.x, -90]}
            width={200}
            height={120}
            radius={12}
            fill={T.card}
            stroke={T.blue}
            lineWidth={2}
            opacity={0}
          />
        ))}
        {[0, 1, 2].map(i => (
          <Txt key={`u8-in-t-${i}`} ref={labels16[i]} position={[-240 + i * 240, -90]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} opacity={0} text={['运行时行为', '内部状态', '监控'][i]} />
        ))}
        <Txt position={[0, 90]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'好监控：仪表盘亮起'} />
        {[0, 1, 2].map(i => (
          <Rect
            key={`u8-meter-${i}`}
            ref={meters16[i]}
            position={[-200 + i * 200, 200]}
            offset={[0, 1]}
            width={90}
            height={10}
            radius={8}
            fill={T.green}
          />
        ))}
      </Node>

      {/* b17：齿轮 + 标准工具 */}
      <Node ref={g17} opacity={0}>
        <Node ref={gear17} position={[-280, -40]}>
          <Circle width={190} height={190} fill={T.card} stroke={T.blue} lineWidth={3} />
          <Rect width={160} height={24} radius={8} fill={T.blue} />
          <Rect width={24} height={160} radius={8} fill={T.blue} />
          <Rect width={160} height={24} radius={8} fill={T.blue} rotation={45} />
          <Circle width={56} height={56} fill={T.bg} stroke={T.blue} lineWidth={3} />
        </Node>
        <Txt position={[-280, 120]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'好自动化支持'} />
        <Line ref={plug17} points={[[-170, -40], [170, -40]]} stroke={T.line} lineWidth={3} endArrow opacity={0} />
        <Node ref={tool17} position={[320, -40]} opacity={0}>
          <Rect width={280} height={150} radius={16} fill={T.card} stroke={T.green} lineWidth={2} />
          <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'标准工具'} />
          <Txt position={[0, 45]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'插上就能用'} />
        </Node>
      </Node>

      {/* b18：不依赖单机 */}
      <Node ref={g18} opacity={0}>
        <Line points={[[-460, -180], [460, -180]]} stroke={T.green} lineWidth={4} />
        <Txt position={[0, -220]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} text={'服务线不断'} />
        {[
          {x: -320, label: '机器 A'},
          {x: 0, label: '机器 B · 停机维护'},
          {x: 320, label: '机器 C'},
        ].map((m, i) => (
          <Node key={`u8-mach-${i}`} ref={machine18[i]} position={[m.x, -40]}>
            <Rect width={300} height={160} radius={16} fill={T.card} stroke={T.blue} lineWidth={2} />
            <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={m.label} />
          </Node>
        ))}
      </Node>

      {/* b19：文档 + X → Y */}
      <Node ref={g19} opacity={0}>
        <Node ref={doc19} position={[-350, -40]} opacity={0}>
          <Rect width={300} height={220} radius={16} fill={T.card} stroke={T.blue} lineWidth={2} />
          <Txt position={[0, -70]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'好文档'} />
          {[0, 1, 2].map(i => (
            <Rect key={`u8-doc-${i}`} position={[0, -10 + i * 32]} width={220} height={12} radius={6} fill={T.line} />
          ))}
        </Node>
        <Line ref={arrow19} points={[[-180, -40], [180, -40]]} stroke={T.yellow} lineWidth={4} endArrow opacity={0} />
        <Node ref={y19} position={[350, -40]} opacity={0}>
          <Rect width={300} height={220} radius={16} fill={T.card} stroke={T.yellow} lineWidth={2} />
          <Txt position={[0, -50]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'如果做 X'} />
          <Txt position={[0, 20]} fontSize={SIZE.body} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'就会发生 Y'} />
        </Node>
      </Node>

      {/* b20：默认值开关 */}
      <Node ref={g20} opacity={0}>
        <Txt position={[0, -200]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'默认值'} />
        <Rect position={[0, -40]} width={320} height={110} radius={55} fill={T.card} stroke={T.line} lineWidth={2} />
        <Circle ref={knob20} position={[-100, -40]} width={88} height={88} fill={T.green} />
        <Txt ref={override20} position={[0, 90]} fontSize={SIZE.body} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} opacity={0} text={'管理员拨动了它 · 已覆盖'} />
      </Node>

      {/* b21：自愈 + 手动控制 */}
      <Node ref={g21} opacity={0}>
        <Rect ref={part21} position={[-200, -40]} width={320} height={200} radius={16} fill={T.red} opacity={0.85} />
        <Line ref={crack21} points={[[-320, -120], [-80, 40]]} stroke={T.white} lineWidth={4} />
        <Txt ref={bad21} position={[-200, -170]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'坏了'} />
        <Txt ref={heal21} position={[-200, 100]} fontSize={SIZE.body} fontWeight={700} fill={T.green} fontFamily={FONT.sans} opacity={0} text={'自己长好了 ✓'} />
        <Node ref={handle21} position={[280, -40]} opacity={0}>
          <Rect width={60} height={200} radius={12} fill={T.card} stroke={T.yellow} lineWidth={2} />
          <Circle position={[0, -60]} width={70} height={70} fill={T.yellow} />
          <Txt position={[0, 140]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'手动控制'} />
        </Node>
      </Node>

      {/* b22：同样的操作重复三次，结果都一样 */}
      <Node ref={g22} opacity={0}>
        {[-140, -20, 100].map((y, i) => (
          <Node key={`u8-rep-${i}`} ref={rep22[i]} position={[0, y]} opacity={0}>
            <Rect width={760} height={80} radius={14} fill={T.card} stroke={T.line} lineWidth={2} />
            <Txt position={[-280, 0]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'同样的操作'} />
            <Txt position={[0, 0]} fontSize={SIZE.title} fill={T.yellow} fontFamily={FONT.sans} text={'→'} />
            <Txt position={[280, 0]} fontSize={SIZE.body} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'同样的结果 ✓'} />
          </Node>
        ))}
      </Node>

      {/* b24：救火 → 预防 */}
      <Node ref={g24} opacity={0}>
        <Node ref={fire24} position={[-260, -40]}>
          <Rect width={380} height={220} radius={16} fill={T.card} stroke={T.red} lineWidth={2} />
          <Circle position={[0, -40]} width={70} height={70} fill={T.red} />
          <Txt position={[0, 50]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'救火'} />
        </Node>
        <Line points={[[-40, -40], [60, -40]]} stroke={T.yellow} lineWidth={4} endArrow />
        <Node ref={prevent24} position={[280, -40]} opacity={0}>
          <Rect width={380} height={220} radius={16} fill={T.card} stroke={T.green} lineWidth={2} />
          <Txt position={[0, -50]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'预防'} />
          <Txt position={[0, 30]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'望远镜看远方'} />
          <Txt position={[0, 75]} fontSize={SIZE.body} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'提前发现问题'} />
        </Node>
      </Node>

      {/* b25：例行任务清单空白，留一个问号 */}
      <Node ref={g25} opacity={0}>
        <Txt position={[0, -220]} fontSize={SIZE.title} fontWeight={700} fill={T.white} fontFamily={FONT.serif} text={'你的团队里'} />
        {[0, 1, 2].map(i => (
          <Rect
            key={`u8-chk-${i}`}
            ref={checks25[i]}
            position={[-300, -120 + i * 80]}
            width={52}
            height={52}
            radius={10}
            fill={T.bg}
            stroke={T.line}
            lineWidth={3}
            opacity={0}
          />
        ))}
        {[0, 1, 2].map(i => (
          <Rect key={`u8-chk-l-${i}`} position={[-200, -120 + i * 80]} width={420} height={20} radius={6} fill={T.line} />
        ))}
        <Txt position={[330, -40]} fontSize={96} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'?'} />
      </Node>

      {/* b26：三根支柱，第二、三根亮起 */}
      <Node ref={g26} opacity={0}>
        <Rect position={[0, -230]} width={1080} height={44} radius={12} fill={T.blue} />
        <Txt position={[0, -230]} fontSize={SIZE.body} fontWeight={700} fill={T.white} fontFamily={FONT.sans} text={'可维护'} />
        {[
          {x: -360, label: '可运维性', on: false},
          {x: 0, label: '简单性', on: false},
          {x: 360, label: '可演化性', on: false},
        ].map((p, i) => (
          <Rect
            key={`u8-p26-${i}`}
            ref={pillars26[i]}
            position={[p.x, 60]}
            offset={[0, 1]}
            width={150}
            height={240}
            radius={12}
            fill={p.on ? T.blue : T.card}
            stroke={p.on ? T.green : T.line}
            lineWidth={2}
            opacity={p.on ? 1 : 0.4}
          />
        ))}
        <Txt position={[0, 110]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'简单性'} />
        <Txt position={[360, 110]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'可演化性'} />
        <Txt position={[-360, 110]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'可运维性 ✓ 已讲'} />
      </Node>
    </>,
  );

  // b15：好可运维性——例行任务一键完成，运维腾出手做高价值事
  // 两条路径对比：手动做（灰色多步）vs 一键完成（绿钮）
  say('例行任务变容易');
  yield* beat(
    'b15',
    all(
      g15().opacity(1, 0.6),
      chain(waitFor(0.3), manual15().opacity(1, 0.6)),
      chain(waitFor(1.2), oneClick15().opacity(1, 0.6)),
      chain(waitFor(2.8), all(btn15().fill(T.yellow, 0.5), ok15().opacity(1, 0.6))),
      chain(waitFor(4.5), gold15().opacity(1, 0.6)),
    ),
  );

  // b16：第一件事——看得见 + 好监控。内部三块依次亮起，仪表盘柱子长起
  say('看得见 + 好监控');
  yield* beat(
    'b16',
    all(
      g15().opacity(0, 0.5),
      g16().opacity(1, 0.6),
      ...[0, 1, 2].map(i => chain(waitFor(1.0 + i * 2.5), all(inner16[i]().opacity(1, 0.5), labels16[i]().opacity(1, 0.5)))),
      ...[0, 1, 2].map(i => chain(waitFor(6.0 + i * 1.2), meters16[i]().height(60, 1.0))),
    ),
  );

  // b17：第二件事——好自动化支持，还要能跟标准工具接上
  say('自动化 + 接标准工具');
  yield* beat(
    'b17',
    all(
      g16().opacity(0, 0.5),
      g17().opacity(1, 0.6),
      gear17().rotation(120, 4.0),
      chain(waitFor(1.5), all(plug17().opacity(1, 0.5), tool17().opacity(1, 0.6))),
    ),
  );

  // b18：第三件事——不依赖单机。中间机器被抽走检修，服务线不断
  say('不依赖单机');
  yield* beat(
    'b18',
    all(
      g17().opacity(0, 0.5),
      g18().opacity(1, 0.6),
      chain(waitFor(1.5), all(machine18[1]().position([0, 120], 2.0), machine18[1]().opacity(0.3, 2.0))),
    ),
  );

  // b19：第四件事——好文档 + 容易理解的运维模型：做 X，就会发生 Y
  say('如果做 X，就会发生 Y');
  yield* beat(
    'b19',
    all(
      g18().opacity(0, 0.5),
      g19().opacity(1, 0.6),
      chain(waitFor(0.3), doc19().opacity(1, 0.6)),
      chain(waitFor(2.0), arrow19().opacity(1, 0.5)),
      chain(waitFor(2.5), y19().opacity(1, 0.6)),
    ),
  );

  // b20：第五件事——默认值合理，管理员需要时可以覆盖
  // 配音在“第五件事：”后有约 0.9s 停顿，开关拨动放在停顿后（~2.0s）
  say('默认值合理，可覆盖');
  yield* beat(
    'b20',
    all(
      g19().opacity(0, 0.5),
      g20().opacity(1, 0.6),
      chain(waitFor(2.0), all(knob20().position([100, -40], 1.0), knob20().fill(T.yellow, 1.0))),
      chain(waitFor(3.5), override20().opacity(1, 0.6)),
    ),
  );

  // b21：第六件事——适当时自愈，也给管理员手动控制
  say('自愈 + 手动控制');
  yield* beat(
    'b21',
    all(
      g20().opacity(0, 0.5),
      g21().opacity(1, 0.6),
      chain(waitFor(1.5), all(crack21().opacity(0, 0.8), part21().fill(T.green, 1.2), bad21().opacity(0, 0.4), heal21().opacity(1, 0.6))),
      chain(waitFor(3.0), handle21().opacity(1, 0.6)),
    ),
  );

  // b22：第七件事——行为可预测，少意外。同样的操作重复三次，结果都一样
  say('行为可预测，少意外');
  yield* beat(
    'b22',
    all(
      g21().opacity(0, 0.5),
      g22().opacity(1, 0.6),
      ...[0, 1, 2].map(i => chain(waitFor(0.5 + i * 1.5), rep22[i]().opacity(1, 0.5))),
    ),
  );

  // b23：回扣——回到 b15 的画面：例行容易，才能干大事（r2：金色卡片慢速淡入 3.1s，避免淡入后 4.0s 静止；不用 waitFor 延迟，以免 lint 静态静止计数虚增）
  say('例行容易，才能干大事');
  gold15().opacity(0);
  yield* beat(
    'b23',
    all(g22().opacity(0, 0.5), g15().opacity(1, 0.6), gold15().opacity(1, 3.1)),
  );

  // b24：例行任务容易了，运维的注意力从救火转到预防
  say('从救火转到预防');
  yield* beat(
    'b24',
    all(
      g15().opacity(0, 0.5),
      g24().opacity(1, 0.6),
      chain(waitFor(0.3), fire24().opacity(1, 0.6)),
      chain(waitFor(2.0), all(fire24().opacity(0.35, 1.0), prevent24().opacity(1, 0.6))),
    ),
  );

  // b25：停下来想一想——你的团队里，哪些例行任务最花时间？
  say('哪些例行任务最花时间');
  yield* beat(
    'b25',
    all(
      g24().opacity(0, 0.5),
      g25().opacity(1, 0.6),
      ...[0, 1, 2].map(i => chain(waitFor(0.8 + i * 1.2), checks25[i]().opacity(1, 0.5))),
    ),
  );

  // b26：下一单元，简单性与可演化性——第二、三根支柱依次亮起（r2：用 chain 串联两根支柱的点亮动画，
  // 依次亮起且全程有动作；不用 waitFor 延迟，以免 lint 静态静止计数虚增）
  say('下一站：简单与演化');
  yield* beat(
    'b26',
    all(
      g25().opacity(0, 0.5),
      g26().opacity(1, 0.6),
      chain(
        all(pillars26[1]().fill(T.blue, 1.5), pillars26[1]().stroke(T.green, 1.5), pillars26[1]().opacity(1, 1.5)),
        all(pillars26[2]().fill(T.blue, 1.5), pillars26[2]().stroke(T.green, 1.5), pillars26[2]().opacity(1, 1.5)),
      ),
    ),
  );
});
