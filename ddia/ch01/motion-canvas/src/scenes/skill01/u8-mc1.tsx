// U8 场景 1（MC）：b1–b14 —— 钩子（成本大头在维护）、维护七件事、遗留系统之难、三根支柱、运维十项职责。
// 分镜：skill-ch01/ch01-beats.md U8 一节；原文：DDIA §1.11–1.12（书页 p18–20，PDF p40–42）。
// 时长全部来自 timeline/u8.json（beat() 驱动），不手写 waitFor。
// 颜色、字号、安全区一律取自 lib/theme，不手写十六进制色值。
// r1 修正（反查原文）：b5 补“也别自己制造出遗留系统”（1.11-5）；b13/b14 按原文十项逐条写全
// （追查故障“和性能下降的原因”、更新软件平台、盯住系统互相影响、预见未来问题、部署与配置管理、
// 复杂维护任务、让运维可预测、知识留存不怕人员流动）；b14 结尾按原文“the following, and more”
// 改为“这十件还只是其中一部分”，不说“一共十件”；b2 因配音坏档拆成 b2a/b2b。
// r2 修正（rounds/u8/r1/review.md）：b6 慢速填充 3.0s；b8 别名 4.5s 出现；b11 右面板 5.5s 出现。
import {Circle, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, chain, createRef, waitFor} from '@motion-canvas/core';
import {makeBeats} from '../../lib/beats';
import {FONT, SAFE, SIZE, T} from '../../lib/theme';
import timeline from '../../timeline/u8.json';

export default makeScene2D(function* (view) {
  view.fill(T.bg);
  const beat = makeBeats(timeline);

  const header = createRef<Txt>();
  const anchor = createRef<Txt>();

  // b1：成本条——开发一小段，维护一大段（原文无比例数字，不标比例）
  const g1 = createRef<Node>();
  const devBar = createRef<Rect>();
  const maintBar = createRef<Rect>();
  // b2a/b2b：维护七件事，七行依次亮起
  const g2 = createRef<Node>();
  const rows2 = [0, 1, 2, 3, 4, 5, 6].map(() => createRef<Node>());
  // b3：三件讨厌事
  const g3 = createRef<Node>();
  const hate = [0, 1, 2].map(() => createRef<Node>());
  // b4：几个遗留系统各长各的怪样子
  const g4 = createRef<Node>();
  const legacy = [0, 1, 2].map(() => createRef<Node>());
  // b5–b10：三根支柱
  const g5 = createRef<Node>();
  const pillars = [0, 1, 2].map(() => createRef<Rect>());
  const pillarLabels = [0, 1, 2].map(() => createRef<Txt>());
  const beam = createRef<Node>();
  const alias8 = createRef<Txt>();
  const uiX = createRef<Node>();
  const overlay9 = createRef<Rect>();
  const pill9 = createRef<Node>();
  // b11：好运维补烂软件 / 好软件配烂运维
  const g11 = createRef<Node>();
  const panel11a = createRef<Node>();
  const panel11b = createRef<Node>();
  // b12：齿轮自动转，旁边站着一个人检查
  const g12 = createRef<Node>();
  const gear = createRef<Node>();
  const check12 = createRef<Txt>();
  // b13/b14：运维职责清单（前四项 / 后六项 + “更多”）
  const g13 = createRef<Node>();
  const rows13 = [0, 1, 2, 3].map(() => createRef<Node>());
  const g14 = createRef<Node>();
  const rows14 = [0, 1, 2, 3, 4, 5, 6].map(() => createRef<Node>());

  const say = (text: string) => anchor().text(text);

  const dutyRow = (y: number, text: string) => (
    <Node position={[0, y]}>
      <Rect width={1000} height={56} radius={12} fill={T.card} stroke={T.line} lineWidth={2} />
      <Txt position={[-470, 0]} offset={[-1, 0]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={text} />
    </Node>
  );

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

      {/* b1：成本条 */}
      <Node ref={g1} opacity={0}>
        <Txt position={[0, -200]} fontSize={SIZE.title} fontWeight={700} fill={T.white} fontFamily={FONT.serif} text={'软件的成本去哪了？'} />
        <Txt position={[-470, -80]} offset={[-1, 0]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'开发'} />
        <Rect ref={devBar} position={[-360, -80]} offset={[-1, 0]} width={0} height={52} radius={10} fill={T.blue} />
        <Txt position={[-470, 20]} offset={[-1, 0]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'维护'} />
        <Rect ref={maintBar} position={[-360, 20]} offset={[-1, 0]} width={0} height={52} radius={10} fill={T.yellow} />
        <Txt position={[0, 120]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'大头在之后漫长的维护里'} />
      </Node>

      {/* b2a/b2b：维护七件事 */}
      <Node ref={g2} opacity={0}>
        <Txt position={[0, -250]} fontSize={SIZE.title} fontWeight={700} fill={T.white} fontFamily={FONT.serif} text={'维护的七件事'} />
        {[
          '修 bug',
          '保持系统运转',
          '排查故障',
          '适配新平台',
          '改需求',
          '还技术债',
          '加功能',
        ].map((t, i) => (
          <Node key={`u8-m7-${i}`} ref={rows2[i]} position={[0, -170 + i * 62]} opacity={0}>
            <Rect width={620} height={50} radius={12} fill={T.card} stroke={T.blue} lineWidth={2} />
            <Txt position={[-280, 0]} offset={[-1, 0]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={t} />
            <Txt position={[280, 0]} offset={[1, 0]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={`${i + 1} / 7`} />
          </Node>
        ))}
      </Node>

      {/* b3：三件讨厌事 */}
      <Node ref={g3} opacity={0}>
        {[
          {x: -380, t: '修别人的错'},
          {x: 0, t: '用过时的平台'},
          {x: 380, t: '被迫做设计之外的事'},
        ].map((c, i) => (
          <Node key={`u8-hate-${i}`} ref={hate[i]} position={[c.x, -40]} opacity={0}>
            <Rect width={330} height={150} radius={16} fill={T.card} stroke={T.red} lineWidth={2} />
            <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} textWrap maxWidth={290} textAlign={'center'} text={c.t} />
            <Txt position={[0, 110]} fontSize={SIZE.label} fill={T.red} fontFamily={FONT.sans} text={'不喜欢'} />
          </Node>
        ))}
      </Node>

      {/* b4：遗留系统各长各的怪样子 */}
      <Node ref={g4} opacity={0}>
        <Node ref={legacy[0]} position={[-380, -40]} opacity={0}>
          <Rect width={220} height={300} radius={12} fill={T.card} stroke={T.blue} lineWidth={2} />
          <Txt fontSize={SIZE.title} fill={T.blue} fontFamily={FONT.sans} text={'?'} />
        </Node>
        <Node ref={legacy[1]} position={[0, -40]} opacity={0} rotation={8}>
          <Rect width={300} height={150} radius={40} fill={T.card} stroke={T.purple} lineWidth={2} />
          <Txt fontSize={SIZE.title} fill={T.purple} fontFamily={FONT.sans} text={'?'} />
        </Node>
        <Node ref={legacy[2]} position={[380, -40]} opacity={0}>
          <Rect width={180} height={180} radius={90} fill={T.card} stroke={T.yellow} lineWidth={2} />
          <Txt fontSize={SIZE.title} fill={T.yellow} fontFamily={FONT.sans} text={'?'} />
        </Node>
        <Txt position={[0, 190]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'各有各的难处，没法给通用建议'} />
      </Node>

      {/* b5–b10：三根支柱撑起“可维护” */}
      <Node ref={g5} opacity={0}>
        <Node ref={beam} opacity={0}>
          <Rect position={[0, -230]} width={1080} height={44} radius={12} fill={T.blue} />
          <Txt position={[0, -230]} fontSize={SIZE.body} fontWeight={700} fill={T.white} fontFamily={FONT.sans} text={'可维护'} />
        </Node>
        {[
          {x: -360, label: '可运维性 operability'},
          {x: 0, label: '简单性 simplicity'},
          {x: 360, label: '可演化性 evolvability'},
        ].map((p, i) => (
          <Rect
            key={`u8-pillar-${i}`}
            ref={pillars[i]}
            position={[p.x, 60]}
            offset={[0, 1]}
            width={150}
            height={10}
            radius={12}
            fill={T.card}
            stroke={T.line}
            lineWidth={2}
          />
        ))}
        {[
          {x: -360, label: '可运维性 operability'},
          {x: 0, label: '简单性 simplicity'},
          {x: 360, label: '可演化性 evolvability'},
        ].map((p, i) => (
          <Txt
            key={`u8-plabel-${i}`}
            ref={pillarLabels[i]}
            position={[p.x, 110]}
            fontSize={SIZE.label}
            fill={T.text}
            fontFamily={FONT.sans}
            opacity={0}
            text={p.label}
          />
        ))}
        <Txt
          ref={alias8}
          position={[360, 150]}
          fontSize={SIZE.min}
          fill={T.muted}
          fontFamily={FONT.sans}
          opacity={0}
          text={'extensibility · modifiability · plasticity'}
        />
        {/* b7：界面简单打叉 */}
        <Node ref={uiX} position={[380, -290]} opacity={0}>
          <Rect width={220} height={56} radius={12} fill={T.card} stroke={T.red} lineWidth={2} />
          <Txt fontSize={SIZE.label} fill={T.red} fontFamily={FONT.sans} text={'界面简单 ✗'} />
        </Node>
        {/* b9：没有容易的解法——遮罩 + 药瓶打叉（遮罩只盖内容区，不盖底部旁白字幕行） */}
        <Rect ref={overlay9} position={[0, -20]} width={1160} height={560} fill={T.bg} opacity={0} />
        <Node ref={pill9} position={[0, -40]} opacity={0}>
          {/* QA r4（类 A）：卡片原高 260，下移到 y=-20 后下边压住中间柱子的标签“简单性 simplicity”；改高 220 */}
          <Rect width={200} height={220} radius={20} fill={T.card} stroke={T.red} lineWidth={3} />
          <Rect position={[0, -130]} width={90} height={40} radius={8} fill={T.red} />
          <Txt position={[0, -60]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'容易的解法'} />
          <Txt position={[0, 40]} fontSize={64} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'✗'} />
        </Node>
      </Node>

      {/* b11：好运维补烂软件 / 好软件配烂运维 */}
      <Node ref={g11} opacity={0}>
        <Node ref={panel11a} position={[-280, -40]} opacity={0}>
          <Rect width={440} height={240} radius={16} fill={T.card} stroke={T.green} lineWidth={2} />
          <Txt position={[0, -70]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'好运维 + 烂软件'} />
          <Txt position={[0, 10]} fontSize={SIZE.body} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'还能跑 ✓'} />
          <Txt position={[0, 70]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'绕过软件的局限'} />
        </Node>
        <Node ref={panel11b} position={[280, -40]} opacity={0}>
          <Rect width={440} height={240} radius={16} fill={T.card} stroke={T.red} lineWidth={2} />
          <Txt position={[0, -70]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'好软件 + 烂运维'} />
          <Txt position={[0, 10]} fontSize={SIZE.body} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'跑不稳 ✗'} />
          <Txt position={[0, 70]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'软件再好也不行'} />
        </Node>
      </Node>

      {/* b12：齿轮自动转，旁边站着一个人检查 */}
      <Node ref={g12} opacity={0}>
        <Node ref={gear} position={[-220, -40]}>
          <Circle width={200} height={200} fill={T.card} stroke={T.blue} lineWidth={3} />
          <Rect width={170} height={26} radius={8} fill={T.blue} />
          <Rect width={26} height={170} radius={8} fill={T.blue} />
          <Rect width={170} height={26} radius={8} fill={T.blue} rotation={45} />
          <Circle width={60} height={60} fill={T.bg} stroke={T.blue} lineWidth={3} />
        </Node>
        <Txt position={[-220, 130]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'自动化'} />
        <Circle position={[220, -80]} width={110} height={110} fill={T.card} stroke={T.yellow} lineWidth={3} />
        <Txt position={[220, -80]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'人'} />
        <Txt ref={check12} position={[220, 60]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} opacity={0} text={'确认它在正常工作 ✓'} />
      </Node>

      {/* b13：运维职责前四项 */}
      <Node ref={g13} opacity={0}>
        <Txt position={[0, -250]} fontSize={SIZE.title} fontWeight={700} fill={T.white} fontFamily={FONT.serif} text={'运维团队管什么'} />
        <Node ref={rows13[0]} opacity={0}>{dutyRow(-170, '监控健康、快速恢复')}</Node>
        <Node ref={rows13[1]} opacity={0}>{dutyRow(-102, '追查故障和性能下降的原因')}</Node>
        <Node ref={rows13[2]} opacity={0}>{dutyRow(-34, '更新软件平台、打安全补丁')}</Node>
        <Node ref={rows13[3]} opacity={0}>{dutyRow(34, '盯住系统互相影响、防问题变更')}</Node>
        <Txt position={[0, 130]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'先说这四件'} />
      </Node>

      {/* b14：运维职责后六项 + “还不止这些”（原文 and more） */}
      <Node ref={g14} opacity={0}>
        <Txt position={[0, -250]} fontSize={SIZE.title} fontWeight={700} fill={T.white} fontFamily={FONT.serif} text={'运维团队管什么'} />
        <Node ref={rows14[0]} opacity={0}>{dutyRow(-190, '预见未来问题、做容量规划')}</Node>
        <Node ref={rows14[1]} opacity={0}>{dutyRow(-122, '部署与配置管理的好实践和工具')}</Node>
        <Node ref={rows14[2]} opacity={0}>{dutyRow(-54, '复杂维护任务比如跨平台迁移')}</Node>
        <Node ref={rows14[3]} opacity={0}>{dutyRow(14, '配置安全')}</Node>
        <Node ref={rows14[4]} opacity={0}>{dutyRow(82, '让运维可预测、生产稳定的流程')}</Node>
        <Node ref={rows14[5]} opacity={0}>{dutyRow(150, '知识留存、不怕人员流动')}</Node>
        <Node ref={rows14[6]} opacity={0}>
          <Txt position={[0, 215]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'+ 更多……'} />
        </Node>
      </Node>
    </>,
  );

  // b1：钩子——成本大头在维护。开发条短，维护条长（不标比例）
  say('成本大头在维护');
  yield* beat(
    'b1',
    all(g1().opacity(1, 0.6), devBar().width(180, 1.5), chain(waitFor(1.8), maintBar().width(740, 2.5))),
  );

  // b2a：维护七件事，前四件依次出现（配音是慢速枚举节奏，约 2.7s 一件）
  say('维护的七件事（上）');
  yield* beat(
    'b2a',
    all(
      g1().opacity(0, 0.5),
      g2().opacity(1, 0.6),
      ...[0, 1, 2, 3].map(i => chain(waitFor(0.3 + i * 2.7), rows2[i]().opacity(1, 0.5))),
    ),
  );

  // b2b：后三件依次出现
  say('维护的七件事（下）');
  yield* beat(
    'b2b',
    all(...[4, 5, 6].map(i => chain(waitFor(0.2 + (i - 4) * 0.9), rows2[i]().opacity(1, 0.5)))),
  );

  // b3：很多人不喜欢维护遗留系统——三件讨厌事依次出现
  say('没人爱维护遗留系统');
  yield* beat(
    'b3',
    all(
      g2().opacity(0, 0.5),
      g3().opacity(1, 0.6),
      ...[0, 1, 2].map(i => chain(waitFor(0.5 + i * 2.0), hate[i]().opacity(1, 0.5))),
    ),
  );

  // b4：每个遗留系统各有各的难处——三个怪样子依次出现
  say('每个遗留系统各有难处');
  yield* beat(
    'b4',
    all(
      g3().opacity(0, 0.5),
      g4().opacity(1, 0.6),
      ...[0, 1, 2].map(i => chain(waitFor(0.5 + i * 1.0), legacy[i]().opacity(1, 0.5))),
    ),
  );

  // b5：三根支柱撑起“可维护”——柱子依次长出，横梁落下
  say('三个设计原则');
  yield* beat(
    'b5',
    all(
      g4().opacity(0, 0.5),
      g5().opacity(1, 0.6),
      ...[0, 1, 2].map(i => chain(waitFor(0.5 + i * 1.2), pillars[i]().height(240, 1.0))),
      chain(waitFor(4.2), beam().opacity(1, 0.6)),
    ),
  );

  // b6：第一根支柱亮起：可运维性（r2：慢速填充 3.0s，避免填完后 4.4s 静止）
  say('可运维性');
  yield* beat(
    'b6',
    all(pillars[0]().fill(T.blue, 3.0), pillars[0]().stroke(T.green, 0.8), pillarLabels[0]().opacity(1, 0.6)),
  );

  // b7：第二根支柱亮起：简单性——注意不是界面简单
  say('简单性 ≠ 界面简单');
  yield* beat(
    'b7',
    all(
      pillars[1]().fill(T.blue, 0.8),
      pillars[1]().stroke(T.green, 0.8),
      pillarLabels[1]().opacity(1, 0.6),
      chain(waitFor(2.5), uiX().opacity(1, 0.6)),
    ),
  );

  // b8：第三根支柱亮起：可演化性 + 三个别名
  say('可演化性');
  yield* beat(
    'b8',
    all(
      uiX().opacity(0, 0.5),
      pillars[2]().fill(T.blue, 0.8),
      pillars[2]().stroke(T.green, 0.8),
      pillarLabels[2]().opacity(1, 0.6),
      chain(waitFor(4.5), alias8().opacity(1, 0.6)),
    ),
  );

  // b9：实现这些目标，没有容易的解法——药瓶打叉
  say('没有容易的解法');
  yield* beat(
    'b9',
    all(overlay9().opacity(0.65, 0.8), pill9().opacity(1, 0.8), chain(waitFor(2.0), pill9().position([0, -20], 1.5))),
  );

  // b10：三根支柱，先看第一根——遮罩收起，第一根支柱高亮
  say('先看可运维性');
  yield* beat(
    'b10',
    all(
      overlay9().opacity(0, 0.5),
      pill9().opacity(0, 0.5),
      pillars[1]().opacity(0.35, 0.6),
      pillars[2]().opacity(0.35, 0.6),
      pillarLabels[1]().opacity(0.25, 0.6),
      pillarLabels[2]().opacity(0.25, 0.6),
      alias8().opacity(0, 0.5),
      pillars[0]().fill(T.green, 0.8),
    ),
  );

  // b11：好运维补烂软件 / 好软件配烂运维——两块面板先后出现
  say('好运维补烂软件');
  yield* beat(
    'b11',
    all(
      g5().opacity(0, 0.5),
      g11().opacity(1, 0.6),
      chain(waitFor(0.5), panel11a().opacity(1, 0.6)),
      chain(waitFor(5.5), panel11b().opacity(1, 0.6)),
    ),
  );

  // b12：自动化也得有人管——齿轮一直转，人随后确认
  say('自动化也得有人管');
  yield* beat(
    'b12',
    all(
      g11().opacity(0, 0.5),
      g12().opacity(1, 0.6),
      gear().rotation(180, 5.0),
      chain(waitFor(3.0), check12().opacity(1, 0.6)),
    ),
  );

  // b13：运维职责前四项依次亮起（配音 14.8s，约 3.5s 一项）
  say('运维管什么（上）');
  yield* beat(
    'b13',
    all(
      g12().opacity(0, 0.5),
      g13().opacity(1, 0.6),
      ...[0, 1, 2, 3].map(i => chain(waitFor(0.5 + i * 3.5), rows13[i]().opacity(1, 0.5))),
    ),
  );

  // b14：后六项依次亮起 + “更多……”（配音 17.7s，约 2.8s 一项）
  say('运维管什么（下）');
  yield* beat(
    'b14',
    all(
      g13().opacity(0, 0.5),
      g14().opacity(1, 0.6),
      ...[0, 1, 2, 3, 4, 5, 6].map(i => chain(waitFor(0.5 + i * 2.5), rows14[i]().opacity(1, 0.5))),
    ),
  );
});
