// U3 场景 3（MC）：b29–b46 —— §1.5 人为错误：宕机首因是配错配置、六招应对、回扣三类故障。
// 分镜：skill-ch01/ch01-beats.md U3 一节；原文：DDIA §1.5（书页 p9–10，PDF p31–32）。
// 时长全部来自 timeline/u3.json（beat() 驱动），不手写 waitFor 魔法数字。
// 颜色、字号、安全区一律取自 lib/theme，不手写十六进制色值。
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

  // ---------- b29–b30：宕机原因榜 ----------
  const g29 = createRef<Node>();
  const barConfig = createRef<Rect>();
  const barHw = createRef<Rect>();
  const firstTag = createRef<Txt>();
  const hwRange = createRef<Txt>();
  const goodIntent = createRef<Txt>();

  // ---------- b31–b32：做对容易 / 太严会被绕过 ----------
  const g31 = createRef<Node>();
  const greenBtn = createRef<Rect>();
  const redBtn = createRef<Rect>();
  const means31 = createRef<Txt>();
  const bypass = createRef<Line>();
  const scaleTag = createRef<Txt>();

  // ---------- b33–b34：沙盒与生产区 ----------
  const g33 = createRef<Node>();
  const sandboxDot = createRef<Circle>();
  const dataArrow = createRef<Line>();
  const prodOk = createRef<Txt>();

  // ---------- b35–b36：测试金字塔 ----------
  const g35 = createRef<Node>();
  const pyr = [0, 1, 2].map(() => createRef<Rect>());
  const cornerDot = createRef<Circle>();

  // ---------- b37：快速回滚 ----------
  const g37 = createRef<Node>();
  const verNew = createRef<Txt>();
  const verOld = createRef<Txt>();
  const rollArrow = createRef<Line>();
  const rollDot = createRef<Circle>();

  // ---------- b38：逐步发布 ----------
  const g38 = createRef<Node>();
  const usersNew = [0, 1].map(() => createRef<Circle>());
  const usersOld = [0, 1, 2, 3, 4, 5, 6, 7].map(() => createRef<Circle>());

  // ---------- b39：重算数据 ----------
  const g39 = createRef<Node>();
  const gear = createRef<Node>();
  const oldResult = createRef<Txt>();
  const newResult = createRef<Txt>();

  // ---------- b40：监控 telemetry ----------
  const g40 = createRef<Node>();
  const metricBars = [0, 1, 2, 3].map(() => createRef<Rect>());
  const teleTag = createRef<Txt>();

  // ---------- b41：火箭与遥测 ----------
  const g41 = createRef<Node>();
  const rocket = createRef<Node>();
  const flame = createRef<Rect>();
  const teleCurve = [0, 1, 2, 3, 4].map(() => createRef<Rect>());
  const warnLight = createRef<Circle>();
  const warnText = createRef<Txt>();

  // ---------- b42：监控帮诊断 ----------
  const g42 = createRef<Node>();
  const diagBad = createRef<Txt>();
  const diagArrow = createRef<Line>();

  // ---------- b43：管理培训，本书范围外 ----------
  const g43 = createRef<Node>();
  const manualCard = createRef<Rect>();
  const scopeTag = createRef<Txt>();

  // ---------- b44：回扣——三类故障，三种脾气 ----------
  const g44 = createRef<Node>();
  const recap = [0, 1, 2].map(() => createRef<Node>());

  // ---------- b45：想一想 ----------
  const g45 = createRef<Node>();
  const qLines = [0, 1, 2].map(() => createRef<Txt>());

  // ---------- b46：下一站 ----------
  const g46 = createRef<Node>();
  const loadDial = createRef<Rect>();

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

      {/* b29–b30：宕机原因榜 */}
      <Node ref={g29} opacity={0}>
        <Txt position={[0, -230]} fontSize={SIZE.body} fontWeight={700} fill={T.white} fontFamily={FONT.sans} text={'大型互联网服务宕机的原因'} />
        <Txt position={[-460, -130]} offset={[-1, 0]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'运维配错配置'} />
        <Rect position={[-160, -130]} offset={[-1, 0]} width={760} height={52} radius={10} fill={T.card} stroke={T.line} lineWidth={2} />
        <Rect ref={barConfig} position={[-160, -130]} offset={[-1, 0]} width={0} height={52} radius={10} fill={T.red} />
        <Txt ref={firstTag} position={[560, -130]} offset={[1, 0]} fontSize={SIZE.label} fontWeight={700} fill={T.red} fontFamily={FONT.sans} opacity={0} text={'第 1 位'} />
        <Txt position={[-460, -20]} offset={[-1, 0]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'硬件故障'} />
        <Rect position={[-160, -20]} offset={[-1, 0]} width={760} height={52} radius={10} fill={T.card} stroke={T.line} lineWidth={2} />
        <Rect ref={barHw} position={[-160, -20]} offset={[-1, 0]} width={0} height={52} radius={10} fill={T.blue} />
        <Txt ref={hwRange} position={[560, -20]} offset={[1, 0]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} opacity={0} text={'只占 10–25%'} />
        <Txt position={[0, 100]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'服务器或网络故障'} />
        <Txt ref={goodIntent} position={[0, 170]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} opacity={0} text={'哪怕好心，也会犯错'} />
      </Node>

      {/* b31–b32：绿按钮大、红按钮小；天平摇摆，有人绕路 */}
      <Node ref={g31} opacity={0}>
        <Rect ref={greenBtn} position={[-280, -60]} width={420} height={170} radius={20} fill={T.card} stroke={T.green} lineWidth={3}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'做对的事'} />
        </Rect>
        <Rect ref={redBtn} position={[280, -60]} width={200} height={90} radius={16} fill={T.card} stroke={T.red} lineWidth={3}>
          <Txt fontSize={SIZE.label} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'做错的事'} />
        </Rect>
        <Txt ref={means31} position={[-280, 110]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} opacity={0} text={'好抽象 · 好 API · 好管理界面'} />
        <Line ref={bypass} points={[[380, 60], [520, 160], [380, 220]]} stroke={T.yellow} lineWidth={3} endArrow opacity={0} />
        <Txt ref={scaleTag} position={[0, 170]} fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.sans} opacity={0} text={'太严会被绕过：微妙的平衡'} />
      </Node>

      {/* b33–b34：沙盒与生产区 */}
      <Node ref={g33} opacity={0}>
        <Rect position={[-300, -40]} width={440} height={280} radius={16} fill={T.card} stroke={T.green} lineWidth={3}>
          <Txt position={[0, -100]} fontSize={SIZE.body} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'非生产沙盒'} />
        </Rect>
        <Circle ref={sandboxDot} position={[-300, 40]} width={40} height={40} fill={T.yellow} />
        <Rect position={[300, -40]} width={440} height={280} radius={16} fill={T.card} stroke={T.blue} lineWidth={3}>
          <Txt position={[0, -100]} fontSize={SIZE.body} fontWeight={700} fill={T.blue} fontFamily={FONT.sans} text={'生产区 · 真实用户'} />
        </Rect>
        <Line ref={dataArrow} points={[[-560, -200], [-80, -200]]} stroke={T.yellow} lineWidth={3} endArrow opacity={0} />
        <Txt position={[-300, -240]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'真实数据'} />
        <Txt ref={prodOk} position={[300, 40]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} opacity={0} text={'纹丝不动 ✓'} />
      </Node>

      {/* b35–b36：测试金字塔 */}
      <Node ref={g35} opacity={0}>
        <Rect ref={pyr[0]} position={[0, 80]} width={760} height={80} radius={12} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'单元测试'} />
        </Rect>
        <Rect ref={pyr[1]} position={[0, -10]} width={560} height={80} radius={12} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'全系统集成测试'} />
        </Rect>
        <Rect ref={pyr[2]} position={[0, -100]} width={360} height={80} radius={12} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'手动测试'} />
        </Rect>
        <Circle ref={cornerDot} position={[480, -180]} width={30} height={30} fill={T.red} opacity={0} />
        <Txt position={[0, -210]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'自动化测试覆盖极少出现的边界情况'} />
      </Node>

      {/* b37：快速回滚 */}
      <Node ref={g37} opacity={0}>
        <Txt ref={verNew} position={[0, -120]} fontSize={SIZE.title} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'配置 v2（改错了）'} />
        <Line ref={rollArrow} points={[[-200, -20], [200, -20]]} stroke={T.green} lineWidth={4} endArrow opacity={0} />
        <Circle ref={rollDot} position={[-200, -20]} width={26} height={26} fill={T.green} opacity={0} />
        <Txt ref={verOld} position={[0, 80]} fontSize={SIZE.title} fontWeight={700} fill={T.green} fontFamily={FONT.sans} opacity={0} text={'配置 v1（上一版）'} />
      </Node>

      {/* b38：逐步发布 */}
      <Node ref={g38} opacity={0}>
        <Txt position={[0, -220]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'新代码只推给一小撮用户'} />
        {[0, 1].map(i => (
          <Circle key={`u3-new-${i}`} ref={usersNew[i]} position={[-480 + i * 120, -40]} width={70} height={70} fill={T.green} />
        ))}
        {[0, 1, 2, 3, 4, 5, 6, 7].map(i => (
          <Circle key={`u3-old-${i}`} ref={usersOld[i]} position={[-240 + i * 120, -40]} width={70} height={70} fill={T.blue} />
        ))}
        <Txt position={[0, 100]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'其余人还在旧版'} />
      </Node>

      {/* b39：重算数据 */}
      <Node ref={g39} opacity={0}>
        <Node ref={gear} position={[0, -60]}>
          <Circle width={180} height={180} fill={T.card} stroke={T.yellow} lineWidth={3} />
          <Rect width={180} height={24} fill={T.yellow} />
          <Rect width={24} height={180} fill={T.yellow} />
          <Rect width={180} height={24} fill={T.yellow} rotation={45} />
          <Rect width={180} height={24} fill={T.yellow} rotation={-45} />
        </Node>
        <Txt ref={oldResult} position={[0, 110]} fontSize={SIZE.body} fill={T.red} fontFamily={FONT.sans} text={'旧结果：算错了'} />
        <Txt ref={newResult} position={[0, 170]} fontSize={SIZE.body} fontWeight={700} fill={T.green} fontFamily={FONT.sans} opacity={0} text={'重算一遍：对了'} />
      </Node>

      {/* b40：监控 telemetry */}
      <Node ref={g40} opacity={0}>
        <Txt position={[0, -220]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'性能指标 · 错误率'} />
        {[0, 1, 2, 3].map(i => (
          <Rect key={`u3-met-${i}`} ref={metricBars[i]} position={[-390 + i * 260, 60]} offset={[0, 1]} width={120} height={10} radius={8} fill={T.green} />
        ))}
        <Txt ref={teleTag} position={[0, 150]} fontSize={SIZE.body} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} opacity={0} text={'telemetry（遥测）'} />
      </Node>

      {/* b41：火箭升空，遥测曲线滚动 */}
      <Node ref={g41} opacity={0}>
        <Node ref={rocket} position={[-380, 120]}>
          <Rect width={90} height={170} radius={30} fill={T.card} stroke={T.text} lineWidth={3} />
          <Rect position={[0, -105]} width={44} height={44} rotation={45} fill={T.card} stroke={T.text} lineWidth={3} />
          <Rect position={[-50, 55]} width={20} height={50} radius={6} fill={T.card} stroke={T.text} lineWidth={2} rotation={-25} />
          <Rect position={[50, 55]} width={20} height={50} radius={6} fill={T.card} stroke={T.text} lineWidth={2} rotation={25} />
          <Rect ref={flame} position={[0, 112]} width={30} height={30} rotation={45} fill={T.yellow} />
          <Txt position={[110, -60]} fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.sans} text={'火箭'} />
        </Node>
        {[0, 1, 2, 3, 4].map(i => (
          <Rect
            key={`u3-tele-${i}`}
            ref={teleCurve[i]}
            position={[80 + i * 130, 80]}
            offset={[0, 1]}
            width={70}
            height={10}
            radius={8}
            fill={T.blue}
          />
        ))}
        <Circle ref={warnLight} position={[80, -140]} width={40} height={40} fill={T.yellow} opacity={0} />
        <Txt ref={warnText} position={[200, -140]} fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.sans} opacity={0} text={'早期预警'} />
      </Node>

      {/* b42：监控帮诊断 */}
      <Node ref={g42} opacity={0}>
        {['假设：配置没改错', '约束：错误率 < 1%', '假设：磁盘够用'].map((t, i) => (
          <Txt key={`u3-diag-${i}`} position={[0, -160 + i * 90]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={t} />
        ))}
        <Txt ref={diagBad} position={[0, 70]} fontSize={SIZE.body} fontWeight={700} fill={T.red} fontFamily={FONT.sans} opacity={0} text={'错误率 5%：约束被违反了'} />
        <Line ref={diagArrow} points={[[-300, 130], [300, 130]]} stroke={T.yellow} lineWidth={3} endArrow opacity={0} />
        <Txt position={[0, 180]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'指标对诊断极有价值'} />
      </Node>

      {/* b43：管理培训，超出这一章范围 */}
      <Node ref={g43} opacity={0}>
        <Rect ref={manualCard} position={[0, -40]} width={520} height={220} radius={16} fill={T.card} stroke={T.line} lineWidth={2}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'管理实践 · 培训'} />
        </Rect>
        <Txt ref={scopeTag} position={[0, 130]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} opacity={0} text={'很重要，也很复杂，超出这一章范围'} />
      </Node>

      {/* b44：回扣——三类故障，三种脾气 */}
      <Node ref={g44} opacity={0}>
        {[
          {t: '硬件故障', d: '随机零星', c: T.blue},
          {t: '软件错误', d: '系统相关', c: T.red},
          {t: '人为错误', d: '最常见', c: T.yellow},
        ].map((s, i) => (
          <Node key={`u3-recap-${i}`} ref={recap[i]} opacity={0}>
            <Rect position={[-360 + i * 360, -40]} width={300} height={190} radius={16} fill={T.card} stroke={s.c} lineWidth={3}>
              <Txt position={[0, -40]} fontSize={SIZE.body} fontWeight={700} fill={s.c} fontFamily={FONT.sans} text={s.t} />
              <Txt position={[0, 30]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={s.d} />
            </Rect>
          </Node>
        ))}
        <Txt position={[0, 130]} fontSize={SIZE.body} fontWeight={700} fill={T.white} fontFamily={FONT.sans} text={'三类故障，三种脾气'} />
      </Node>

      {/* b45：想一想 */}
      <Node ref={g45} opacity={0}>
        <Txt position={[0, -120]} fontSize={SIZE.title} fontWeight={700} fill={T.white} fontFamily={FONT.serif} text={'哪个假设会先炸？'} />
        {['假设 1', '假设 2', '假设 3'].map((t, i) => (
          <Txt key={`u3-q-${i}`} ref={qLines[i]} position={[0, -20 + i * 70]} fontSize={SIZE.body} fill={T.muted} fontFamily={FONT.sans} opacity={0} text={t} />
        ))}
      </Node>

      {/* b46：下一站——负载仪表盘 */}
      <Node ref={g46} opacity={0}>
        <Txt position={[0, -160]} fontSize={SIZE.title} fontWeight={700} fill={T.white} fontFamily={FONT.serif} text={'下一站：描述负载'} />
        <Rect position={[0, -20]} width={760} height={200} radius={16} fill={T.card} stroke={T.blue} lineWidth={2} />
        <Rect ref={loadDial} position={[-380, -20]} offset={[-1, 0]} width={0} height={60} radius={10} fill={T.blue} />
        <Txt position={[0, 110]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'系统长大了，怎么描述它有多忙？'} />
      </Node>
    </>,
  );

  // b29：宕机首因是运维配错了配置——配置错误的条最长（r2 #2-6：加“哪怕好心，也会犯错”小字）
  say('宕机首因：配错配置');
  yield* beat(
    'b29',
    all(
      g29().opacity(1, 0.6),
      barConfig().width(600, 5.0),
      chain(waitFor(5.5), firstTag().opacity(1, 0.8)),
      barHw().width(160, 4.0),
      chain(waitFor(5.5), goodIntent().opacity(1, 2.0)),
    ),
  );

  // b30：硬件故障只占 10% 到 25%——硬件条从 10% 的位置慢慢长到 25%
  say('硬件只占 10–25%');
  yield* beat('b30', all(hwRange().opacity(1, 0.8), barHw().width(190, 3.5)));

  // b31：做对的事容易，做错的事难——绿按钮大，红按钮小（r2 #1-5：加三枚手段标签）
  say('做对容易，做错难');
  yield* beat(
    'b31',
    all(
      g29().opacity(0, 0.5),
      g31().opacity(1, 0.6),
      greenBtn().width(460, 3.0),
      means31().opacity(1, 1.0),
    ),
  );

  // b32：界面太严，人会绕过去——绕路箭头出现，天平标签亮起
  say('太严会被绕过');
  yield* beat(
    'b32',
    all(
      bypass().opacity(1, 1.0),
      redBtn().opacity(0.4, 1.5),
      chain(waitFor(2.0), scaleTag().opacity(1, 0.8)),
    ),
  );

  // b33：沙盒与生产区分开——沙盒里的小球随便折腾（r2 #1-6：往返改 chain 串行）
  say('沙盒里随便折腾');
  yield* beat(
    'b33',
    all(
      g31().opacity(0, 0.5),
      g33().opacity(1, 0.6),
      chain(sandboxDot().position([-180, 40], 1.8), sandboxDot().position([-420, 40], 1.8), sandboxDot().position([-300, 40], 1.8)),
    ),
  );

  // b34：真实数据进沙盒，生产区纹丝不动
  say('用真数据，不影响真用户');
  yield* beat(
    'b34',
    all(
      dataArrow().opacity(1, 0.8),
      prodOk().opacity(1, 0.8),
      sandboxDot().position([-180, 40], 2.0),
    ),
  );

  // b35：彻底测试——金字塔从单元到全系统逐层亮起（r2 #1-6：改 chain 串行，每层 1.8s）
  say('单元 → 集成 → 手动');
  yield* beat(
    'b35',
    chain(
      all(g33().opacity(0, 0.5), g35().opacity(1, 0.5)),
      pyr[0]().opacity(1, 1.8),
      pyr[1]().opacity(1, 1.8),
      pyr[2]().opacity(1, 1.8),
    ),
  );

  // b36：自动化测试兜住边界情况
  say('自动化测边界情况');
  yield* beat('b36', all(cornerDot().opacity(1, 0.8), cornerDot().position([480, -100], 2.5)));

  // b37：配置改错了，快速回滚（r2 #2-9：回滚圆点沿箭头走）
  say('快速回滚配置');
  yield* beat(
    'b37',
    all(
      g35().opacity(0, 0.5),
      g37().opacity(1, 0.6),
      chain(waitFor(1.5), all(rollArrow().opacity(1, 0.6), verOld().opacity(1, 0.8), rollDot().opacity(1, 0.6))),
      chain(waitFor(2.1), rollDot().position([200, -20], 2.5)),
    ),
  );

  // b38：新代码逐步发布，只影响一小撮用户
  say('逐步发布，影响一小撮');
  yield* beat(
    'b38',
    all(
      g37().opacity(0, 0.5),
      g38().opacity(1, 0.6),
      usersNew[0]().position([-480, -100], 1.5),
      usersNew[1]().position([-360, -100], 1.5),
    ),
  );

  // b39：重算数据的工具——齿轮转动，旧结果被新结果替换
  say('错了能重算');
  yield* beat(
    'b39',
    all(
      g38().opacity(0, 0.5),
      g39().opacity(1, 0.6),
      gear().rotation(120, 3.0),
      chain(waitFor(2.5), all(oldResult().opacity(0.3, 0.6), newResult().opacity(1, 0.8))),
    ),
  );

  // b40：详细清晰的监控——指标条依次长出，telemetry 术语卡出现（r2 #1-6：改 chain 串行；柱对 2.5s）
  say('监控 telemetry 遥测');
  yield* beat(
    'b40',
    chain(
      all(g39().opacity(0, 0.5), g40().opacity(1, 0.5)),
      all(metricBars[0]().height(120, 2.5), metricBars[1]().height(180, 2.5)),
      all(metricBars[2]().height(150, 2.5), metricBars[3]().height(220, 2.5)),
      teleTag().opacity(1, 1.0),
    ),
  );

  // b41：火箭离地靠遥测——火箭上升，遥测曲线滚动，黄灯预警（r2 #2-2：加鼻锥/尾翼/火焰；预警文字与黄灯同现）
  say('火箭离地靠遥测');
  yield* beat(
    'b41',
    all(
      g40().opacity(0, 0.5),
      g41().opacity(1, 0.6),
      rocket().position([-380, -120], 5.0),
      chain(flame().opacity(0.4, 0.4), flame().opacity(1, 0.4)),
      chain(teleCurve[0]().height(90, 1.2), teleCurve[1]().height(130, 1.2), teleCurve[2]().height(110, 1.2), teleCurve[3]().height(160, 1.2), teleCurve[4]().height(140, 1.2)),
      chain(waitFor(4.5), all(warnLight().opacity(1, 0.6), warnText().opacity(1, 0.6))),
    ),
  );

  // b42：监控检查假设和约束，帮诊断（r2 #2-9：诊断箭头在坏消息之后再出）
  say('监控帮诊断');
  yield* beat(
    'b42',
    all(
      g41().opacity(0, 0.5),
      g42().opacity(1, 0.6),
      chain(waitFor(2.0), diagBad().opacity(1, 0.8)),
      chain(waitFor(3.5), diagArrow().opacity(1, 0.8)),
    ),
  );

  // b43：好的管理实践和培训——很重要，但超出这一章范围（手册合上变暗）
  say('管理培训：超出范围');
  yield* beat(
    'b43',
    all(
      g42().opacity(0, 0.5),
      g43().opacity(1, 0.6),
      scopeTag().opacity(1, 1.0),
      chain(waitFor(2.5), manualCard().opacity(0.35, 1.5)),
    ),
  );

  // b44：回扣——三类故障，三种脾气（r2 #1-6：改 chain 串行，每张 2.2s）
  say('三类故障，三种脾气');
  yield* beat(
    'b44',
    chain(
      all(g43().opacity(0, 0.5), g44().opacity(1, 0.5)),
      recap[0]().opacity(1, 2.2),
      recap[1]().opacity(1, 2.2),
      recap[2]().opacity(1, 2.2),
    ),
  );

  // b45：停下来想一想——哪个假设会先炸（假设逐条浮现；r2 #1-6：改 chain 串行，每条 1.2s）
  say('哪个假设会先炸');
  yield* beat(
    'b45',
    chain(
      all(g44().opacity(0, 0.5), g45().opacity(1, 0.5)),
      qLines[0]().opacity(1, 1.2),
      qLines[1]().opacity(1, 1.2),
      qLines[2]().opacity(1, 1.2),
    ),
  );

  // b46：下一单元——系统长大了，怎么描述它有多忙
  say('下一站：描述负载');
  yield* beat('b46', all(g45().opacity(0, 0.5), g46().opacity(1, 0.6), loadDial().width(760, 4.5)));
});
