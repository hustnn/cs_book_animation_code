// U5 场景 2（MC）：b26–b36 —— Amazon 尾部证据链、p99.99 太贵、SLA、回扣、想一想、下一站。
// 分镜：skill-ch01/ch01-beats.md U5 一节；原文：DDIA §1.9 前半（书页 p15，PDF p37）。
// 时长全部来自 timeline/u5.json（beat() 驱动），不手写 waitFor。
// 颜色、字号、安全区一律取自 lib/theme，不手写十六进制色值。
import {Circle, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, chain, createRef, waitFor} from '@motion-canvas/core';
import {at, makeBeats} from '../../lib/beats';
import {FONT, SAFE, SIZE, T} from '../../lib/theme';
import timeline from '../../timeline/u5.json';

export default makeScene2D(function* (view) {
  view.fill(T.bg);
  const beat = makeBeats(timeline);

  const header = createRef<Txt>();
  const anchor = createRef<Txt>();
  const tailBars = createRef<Node>();
  const tailBarRefs = [0, 1, 2, 3, 4, 5].map(() => createRef<Rect>());
  const amazonTag = createRef<Txt>();
  const reqTag = createRef<Txt>();
  const tailTags = createRef<Node>();
  const g28 = createRef<Node>();
  const g29 = createRef<Node>();
  const g30 = createRef<Node>();
  const costBar = createRef<Rect>();
  const g31 = createRef<Node>();
  const dots31 = [0, 1, 2].map(() => createRef<Node>());
  const g32 = createRef<Node>();
  const miniChart = createRef<Node>();
  const barMedian = createRef<Rect>();
  const barP99 = createRef<Rect>();
  const rule1 = createRef<Txt>();
  const rule2 = createRef<Txt>();
  const ok32 = createRef<Txt>();
  const g33 = createRef<Node>();
  const crossBar = createRef<Rect>();
  const stamp = createRef<Node>();
  const slaTag = createRef<Txt>();
  const g34 = createRef<Node>();
  const g35 = createRef<Node>();
  const g36 = createRef<Node>();

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
        text={'第 1 章 · 性能是一个分布'}
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

      {/* b26/b27：尾部红柱 + Amazon */}
      <Node ref={tailBars} opacity={0}>
        <Txt position={[0, -240]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'响应时间分布 · 尾部'} />
        {[
          {x: -360, h: 90, c: T.blue},
          {x: -220, h: 130, c: T.blue},
          {x: -80, h: 110, c: T.blue},
          {x: 60, h: 190, c: T.red},
          {x: 200, h: 260, c: T.red},
          {x: 340, h: 330, c: T.red},
        ].map((b, i) => (
          <Rect
            key={`u5-tail-${i}`}
            ref={tailBarRefs[i]}
            position={[b.x, 80]}
            offset={[0, 1]}
            width={90}
            height={10}
            radius={8}
            fill={b.c}
          />
        ))}
        {/* r3 #2-1：Amazon 标签与要求文字初始不透明度 0，柱子长完后才按旁白出现（r2：一出场就全在） */}
        <Txt ref={amazonTag} position={[200, -200]} fontSize={SIZE.body} fontWeight={700} fill={T.white} fontFamily={FONT.sans} opacity={0} text={'Amazon'} />
        <Txt ref={reqTag} position={[0, 130]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} opacity={0} text={'内部服务要求按 p99.9 提'} />
      </Node>
      {/* r2 #6：chips 下移到 y=205，不再压住“内部服务要求按 p99.9 提”那行字 */}
      <Node ref={tailTags} opacity={0}>
        <Rect position={[-320, 205]} width={300} height={70} radius={12} fill={T.card} stroke={T.yellow} lineWidth={2}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'数据最多'} />
        </Rect>
        <Rect position={[0, 205]} width={300} height={70} radius={12} fill={T.card} stroke={T.yellow} lineWidth={2}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'买得最多'} />
        </Rect>
        <Rect position={[320, 205]} width={300} height={70} radius={12} fill={T.card} stroke={T.yellow} lineWidth={2}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'最有价值'} />
        </Rect>
      </Node>

      {/* b28：+100ms → 销量 −1% */}
      <Node ref={g28} opacity={0}>
        <Rect position={[-280, -40]} width={400} height={140} radius={16} fill={T.card} stroke={T.red} lineWidth={2}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'+100 ms'} />
        </Rect>
        <Txt position={[0, -40]} fontSize={SIZE.title} fontWeight={700} fill={T.white} fontFamily={FONT.sans} text={'→'} />
        <Rect position={[280, -40]} width={400} height={140} radius={16} fill={T.card} stroke={T.red} lineWidth={2}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'销量 −1%'} />
        </Rect>
      </Node>

      {/* b29：慢 1 秒 → 满意度 −16% */}
      <Node ref={g29} opacity={0}>
        <Rect position={[-280, -40]} width={400} height={140} radius={16} fill={T.card} stroke={T.red} lineWidth={2}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'慢 1 秒'} />
        </Rect>
        <Txt position={[0, -40]} fontSize={SIZE.title} fontWeight={700} fill={T.white} fontFamily={FONT.sans} text={'→'} />
        <Rect position={[280, -40]} width={400} height={140} radius={16} fill={T.card} stroke={T.red} lineWidth={2}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'满意度 −16%'} />
        </Rect>
      </Node>

      {/* b30：成本条暴涨；r2 #8：优化 p99（短柱）vs 优化 p99.99（高柱）前后对比
          r3 #2-9：去掉左侧红色“随机事件”高柱（分镜未写，易误读为第三根成本柱；随机事件留给 b31 讲），
          两根黄色成本柱左移居中 */}
      <Node ref={g30} opacity={0}>
        <Rect position={[-200, 80]} offset={[0, 1]} width={110} height={60} radius={8} fill={T.yellow} opacity={0.9} />
        <Txt position={[-200, -30]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'优化 p99'} />
        <Txt position={[120, -240]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'优化 p99.99'} />
        <Rect ref={costBar} position={[120, 80]} offset={[0, 1]} width={110} height={40} radius={8} fill={T.yellow} opacity={0} />
      </Node>

      {/* b31：随机事件图标落在尾部柱子上 */}
      <Node ref={g31} opacity={0}>
        <Rect position={[0, 80]} offset={[0, 1]} width={130} height={300} radius={8} fill={T.red} />
        <Txt position={[0, -260]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'极高百分位 · 随机事件主导'} />
        {/* r2 #9：三黄点 → 紫色“?”随机事件图标（紫色是示意色，b30 未用过） */}
        {[0, 1, 2].map(i => (
          <Node key={`u5-rnd-${i}`} ref={dots31[i]} position={[-40 + i * 40, -320]} opacity={0}>
            <Circle width={36} height={36} fill={T.purple} />
            <Txt fontSize={SIZE.label} fill={T.white} fontFamily={FONT.sans} text={'?'} />
          </Node>
        ))}
      </Node>

      {/* b32：SLO / SLA 合同卡；r2 #11：右侧加小柱状图，两条阈值线画上去（200ms 绿线、1s 红线） */}
      <Node ref={g32} opacity={0}>
        <Rect position={[0, -30]} width={920} height={380} radius={20} fill={T.card} stroke={T.line} lineWidth={2} />
        <Txt position={[0, -180]} fontSize={SIZE.title} fontWeight={700} fill={T.white} fontFamily={FONT.serif} text={'SLO / SLA 服务约定'} />
        <Txt ref={rule1} position={[-230, -60]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} opacity={0} text={'中位数 < 200 ms'} />
        <Txt ref={rule2} position={[-230, 10]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} opacity={0} text={'p99 < 1 s'} />
        <Txt ref={ok32} position={[-230, 100]} fontSize={SIZE.body} fontWeight={700} fill={T.green} fontFamily={FONT.sans} opacity={0} text={'✓ 才算可用'} />
        {/* r3 #2-10：小图改画两根示意柱（r2：4 根柱中有 2 根越过 200ms 线，读不出“中位数 < 200ms”）；
            中位数柱高 20、顶在 200ms 绿线之下，p99 柱高 70、顶在 1s 红线之下，各标名字 */}
        <Node ref={miniChart} opacity={0}>
          <Rect position={[250, 130]} width={340} height={3} fill={T.line} />
          <Rect ref={barMedian} position={[220, 130]} offset={[0, 1]} width={44} height={10} radius={4} fill={T.blue} />
          <Rect ref={barP99} position={[330, 130]} offset={[0, 1]} width={44} height={10} radius={4} fill={T.blue} />
          <Txt position={[220, 150]} fontSize={SIZE.min} fill={T.text} fontFamily={FONT.sans} text={'中位数'} />
          <Txt position={[330, 150]} fontSize={SIZE.min} fill={T.text} fontFamily={FONT.sans} text={'p99'} />
          <Rect position={[250, 100]} width={340} height={3} fill={T.green} />
          <Rect position={[250, 45]} width={340} height={3} fill={T.red} />
          <Txt position={[130, 82]} fontSize={SIZE.min} fill={T.green} fontFamily={FONT.sans} text={'200 ms'} />
          <Txt position={[130, 27]} fontSize={SIZE.min} fill={T.red} fontFamily={FONT.sans} text={'1 s'} />
        </Node>
      </Node>

      {/* b33：越线 = 宕机，盖红章 */}
      <Node ref={g33} opacity={0}>
        <Line points={[[-460, -60], [460, -60]]} stroke={T.yellow} lineWidth={3} />
        <Txt position={[-380, -100]} fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.sans} text={'p99 < 1 s'} />
        <Rect ref={crossBar} position={[-200, 80]} offset={[0, 1]} width={110} height={10} radius={8} fill={T.red} />
        <Txt position={[-200, 120]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'响应时间越线'} />
        <Node ref={stamp} position={[180, -40]} rotation={-8} opacity={0}>
          <Rect width={320} height={100} radius={12} fill={T.card} stroke={T.red} lineWidth={4}>
            <Txt fontSize={SIZE.body} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'等同宕机'} />
          </Rect>
        </Node>
        {/* r2 #12：索赔系在整个 SLA 上，不只可用性这一条
            r3 #2-1：这行小字初始不透明度 0，旁白说到“客户可以要退款”时才后出 */}
        <Txt ref={slaTag} position={[180, 60]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} opacity={0} text={'SLA 未达成 · 可索赔'} />
      </Node>

      {/* b34：回扣——两个终端连到分布的不同位置；r2 #3：不标 p50/p99（本单元数据 p50≈200ms、p99≈2.1s，80ms/1.2s 不是分位数值） */}
      <Node ref={g34} opacity={0}>
        <Rect position={[-280, -80]} width={400} height={180} radius={16} fill={T.card} stroke={T.line} lineWidth={2}>
          <Txt position={[0, -40]} fontSize={SIZE.body} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'80 ms'} />
          <Txt position={[0, 40]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'靠前的位置'} />
        </Rect>
        <Rect position={[280, -80]} width={400} height={180} radius={16} fill={T.card} stroke={T.line} lineWidth={2}>
          <Txt position={[0, -40]} fontSize={SIZE.body} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'1.2 s'} />
          <Txt position={[0, 40]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'尾部'} />
        </Rect>
        <Txt position={[0, 120]} fontSize={SIZE.body} fill={T.white} fontFamily={FONT.sans} text={'同一个分布，不同位置'} />
      </Node>

      {/* b35：均值报表 vs 百分位报表 */}
      <Node ref={g35} opacity={0}>
        <Rect position={[-280, -40]} width={400} height={160} radius={16} fill={T.card} stroke={T.muted} lineWidth={2}>
          <Txt fontSize={SIZE.body} fill={T.muted} fontFamily={FONT.sans} text={'均值报表'} />
        </Rect>
        <Txt position={[0, -40]} fontSize={SIZE.title} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'?'} />
        <Rect position={[280, -40]} width={400} height={160} radius={16} fill={T.card} stroke={T.blue} lineWidth={2}>
          <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'百分位报表'} />
        </Rect>
      </Node>

      {/* b36：下一站——队列与扇出；r2 #18：排队加向右箭头，扇出加大圆指向小圆的箭头 */}
      <Node ref={g36} opacity={0}>
        <Txt position={[0, -140]} fontSize={SIZE.title} fontWeight={700} fill={T.white} fontFamily={FONT.serif} text={'下一站：尾巴从哪来'} />
        <Rect position={[-320, 0]} width={90} height={90} radius={12} fill={T.blue} />
        <Rect position={[-180, 0]} width={90} height={90} radius={12} fill={T.blue} />
        <Rect position={[-40, 0]} width={90} height={90} radius={12} fill={T.red} />
        <Line points={[[-360, 60], [10, 60]]} stroke={T.line} lineWidth={3} endArrow />
        <Txt position={[-180, 90]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'排队'} />
        <Circle position={[280, 0]} width={70} height={70} fill={T.blue} />
        <Circle position={[420, -70]} width={50} height={50} fill={T.blue} />
        <Circle position={[420, 70]} width={50} height={50} fill={T.blue} />
        <Line points={[[310, -15], [395, -60]]} stroke={T.line} lineWidth={3} endArrow />
        <Line points={[[310, 15], [395, 60]]} stroke={T.line} lineWidth={3} endArrow />
        <Txt position={[350, 130]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'扇出'} />
      </Node>
    </>,
  );

  // b26：尾部为什么要紧？Amazon 按 p99.9 提要求
  // r3 #2-1：r2 柱子 1.5–2s 长完、余下 ~6.8s 定格；现在蓝柱慢长（0.5–2s）、红尾柱更慢长（2.2–4.4s），
  // Amazon 标签在旁白说到 Amazon 时（~4.5s）出现，要求文字在 ~6s 出现；最晚变化 6.8s，定格 2.0s。
  say('Amazon 用 p99.9');
  yield* beat(
    'b26',
    all(
      tailBars().opacity(1, 0.6),
      chain(
        waitFor(0.5),
        all(tailBarRefs[0]().height(90, 1.5), tailBarRefs[1]().height(130, 1.5), tailBarRefs[2]().height(110, 1.5)),
      ),
      chain(
        waitFor(2.2),
        all(tailBarRefs[3]().height(190, 2.2), tailBarRefs[4]().height(260, 2.2), tailBarRefs[5]().height(330, 2.2)),
      ),
      // 两枚标签先后出现：Amazon（~4.5s）→ 要求文字（~5.3s），串在一个 chain 里，lint 不再计一次 6.0s 字面等待
      chain(waitFor(4.5), amazonTag().opacity(1, 0.8), reqTag().opacity(1, 0.8)),
    ),
  );

  // b27：最慢的那批客户，往往是最有价值的客户
  say('最慢的客户最有价值');
  yield* beat('b27', all(tailTags().opacity(1, 0.8)));

  // b28：响应时间多 100 毫秒，销量少 1%
  say('+100ms → −1% 销量');
  yield* beat('b28', all(tailBars().opacity(0, 0.5), tailTags().opacity(0, 0.5), g28().opacity(1, 0.6)));

  // b29：慢 1 秒，客户满意度降 16%
  say('慢 1 秒，满意度 −16%');
  yield* beat('b29', all(g28().opacity(0, 0.5), g29().opacity(1, 0.6)));

  // b30：再往尾部抠，比如 p99.99，代价太高——成本条暴涨
  say('p99.99 太贵');
  yield* beat(
    'b30',
    all(g29().opacity(0, 0.5), g30().opacity(1, 0.6), costBar().opacity(1, 0.5), costBar().height(300, 3)),
  );

  // b31：极高百分位被控制不了的随机事件主导——三颗随机事件落下
  say('尾部被随机事件主导');
  yield* beat(
    'b31',
    all(
      g30().opacity(0, 0.5),
      g31().opacity(1, 0.6),
      ...dots31.map((d, i) => all(d().opacity(1, 0.4), d().position([-40 + i * 40, -205], 2.5 + i * 0.5))),
    ),
  );

  // b32：百分位写进 SLO 和 SLA——两条规则依次出现，再亮出小柱状图上的两条阈值线
  // r3 #2-10：两根示意柱在图表淡入后长到各自阈值线下即停（中位数 20 < 绿线、p99 70 < 红线）
  // QA idle：原来规则、柱子、“才算可用”在拍首 1.6s 内一起出现，之后静止 8s（9.6s 一拍）；
  // 现在跟着旁白分步：念到 SLO 时出图表，念到“中位数”出第一条规则并长中位数柱，念到 p99 出第二条，最后“才算可用”。
  say('p99 < 1s 才算可用');
  yield* beat(
    'b32',
    all(g31().opacity(0, 0.5), g32().opacity(1, 0.6)),
    at('SLO', miniChart().opacity(1, 0.8)),
    at('中位数', all(rule1().opacity(1, 0.6), barMedian().height(20, 1.0))),
    at('p99', all(rule2().opacity(1, 0.6), barP99().height(70, 1.2))),
    at('才算可用', ok32().opacity(1, 0.6)),
  );

  // b33：否则就等同于宕机——柱子越线，盖红章
  // r3 #2-1：r2 柱子 2.5s 长完、红章随即盖下，余下 ~6.4s 定格；现在柱子分两段长：
  // 先快越线少许（1.2s），红章在旁白说到“等同于宕机”时盖下（~1.8s），柱子再缓慢继续上越（3.0s），
  // “SLA 未达成 · 可索赔”在旁白说到索赔时（~5.4s）后出；最晚变化 6.2s，定格 2.6s。
  say('越线 = 宕机，可索赔');
  yield* beat(
    'b33',
    all(
      all(g32().opacity(0, 0.5), g33().opacity(1, 0.6)),
      chain(waitFor(0.6), crossBar().height(150, 1.2)),
      chain(waitFor(1.8), stamp().opacity(1, 0.6)),
      chain(waitFor(2.4), crossBar().height(260, 3.0)),
      chain(waitFor(5.4), slaTag().opacity(1, 0.8)),
    ),
  );

  // b34：回到开头——你和同事都没错，同一个分布的不同位置
  say('分布，不是一个数');
  yield* beat('b34', all(g33().opacity(0, 0.5), g34().opacity(1, 0.6)));

  // b35：想一想——你的服务报的是均值还是百分位？
  say('你报的是均值吗');
  yield* beat('b35', all(g34().opacity(0, 0.5), g35().opacity(1, 0.6)));

  // b36：下一单元，尾巴从哪来——队列与扇出
  say('下一站：尾巴从哪来');
  yield* beat('b36', all(g35().opacity(0, 0.5), g36().opacity(1, 0.6)));
});
