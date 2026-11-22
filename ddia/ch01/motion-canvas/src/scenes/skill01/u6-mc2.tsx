// U6 场景 2（MC）：b9–b19 —— 在客户端测、闭环 vs 开环压测、Figure 1-5 七个后端。
// 分镜：skill-ch01/ch01-beats.md U6 一节；原文：DDIA §1.9 后半（书页 p16–17，PDF p38–39）。
// Figure 1-5 原值：7 个后端 92 / 76 / 103 / 143 / 86 / 487 / 133 ms，Backend 6 最慢，
// 顶部总耗时条与 487 ms 等长，每个后端下面各连一个数据库。
// 闭环/开环的“2 秒发 1 个 / 20 个”是示意数字（inventory N4），角落标“示意”。
// 时长全部来自 timeline/u6.json（beat() 驱动），不手写 waitFor。
// 颜色、字号、安全区一律取自 lib/theme，不手写十六进制色值。
import {attach} from '../../lib/layout';
import {Circle, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, chain, createRef, sequence, waitFor} from '@motion-canvas/core';
import {makeBeats} from '../../lib/beats';
import {FONT, SAFE, SIZE, T} from '../../lib/theme';
import timeline from '../../timeline/u6.json';

const BACKEND_MS = [92, 76, 103, 143, 86, 487, 133];
const BAR_MAX = 460; // 487 ms 对应的条长

export default makeScene2D(function* (view) {
  view.fill(T.bg);
  const beat = makeBeats(timeline);

  const header = createRef<Txt>();
  const anchor = createRef<Txt>();
  const g9 = createRef<Node>();
  const g9green = [0, 1, 2].map(() => createRef<Rect>());
  const g9red = [0, 1, 2].map(() => createRef<Rect>());
  const g9greenTag = [0, 1, 2].map(() => createRef<Txt>());
  const g9redTag = [0, 1, 2].map(() => createRef<Txt>());
  const g10 = createRef<Node>();
  const g10green = [0, 1, 2].map(() => createRef<Txt>());
  const g10red = [0, 1, 2].map(() => createRef<Txt>());
  const g11 = createRef<Node>();
  const closedDot = createRef<Circle>();
  const stuckTag = createRef<Txt>();
  const openDim = createRef<Node>();
  const g12 = createRef<Node>();
  const openDots = Array.from({length: 20}, () => createRef<Rect>());
  const openCount = createRef<Txt>();
  const p99low = createRef<Txt>();
  const p99high = createRef<Txt>();
  const g13 = createRef<Node>();
  const qClosed = createRef<Rect>();
  const qOpen = createRef<Rect>();
  const skewTag = createRef<Txt>();
  const g14 = createRef<Node>();
  const dbRects = Array.from({length: 7}, () => createRef<Rect>());
  const g16 = createRef<Node>();
  const bars = BACKEND_MS.map(() => createRef<Rect>());
  const barLabels = BACKEND_MS.map(() => createRef<Txt>());
  const g17 = createRef<Node>();
  const totalBar = createRef<Rect>();
  const slowestTag = createRef<Txt>();
  const g19 = createRef<Node>();
  const dots19 = Array.from({length: 100}, () => createRef<Circle>());

  const say = (text: string) => anchor().text(text);
  const barW = (ms: number) => Math.max(24, (ms / 487) * BAR_MAX);
  const barY = (i: number) => -190 + i * 60;

  view.add(
    <>
      <Txt
        ref={header}
        position={[-SAFE.halfW, -SAFE.halfH]}
        offset={[-1, -1]}
        fontSize={SIZE.label}
        fill={T.muted}
        fontFamily={FONT.sans}
        text={'第 1 章 · 尾巴从哪来，又怎么量'}
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

      {/* b9：每个请求两种计时——服务端（绿、短）vs 客户端（红、长），两排计时条先后长出 */}
      <Node ref={g9} opacity={0}>
        <Txt position={[0, -240]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'同一个请求，两种计时'} />
        {[0, 1, 2].map(i => (
          <Node key={`u6-timer-${i}`}>
            <Txt position={[-420, -140 + i * 110]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={`请求 ${i + 1}`} />
            <Rect ref={g9green[i]} position={[-260, -140 + i * 110]} offset={[-1, 0]} width={0} height={40} radius={8} fill={T.green} />
            <Txt ref={g9greenTag[i]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} opacity={0} text={'服务端 50 ms'} />
            <Rect ref={g9red[i]} position={[60, -140 + i * 110]} offset={[-1, 0]} width={0} height={40} radius={8} fill={T.red} />
            <Txt ref={g9redTag[i]} fontSize={SIZE.label} fill={T.red} fontFamily={FONT.sans} opacity={0} text={'客户端 3 s'} />
          </Node>
        ))}
      </Node>

      {/* b10：服务端日志全绿，客户端计时全红，两边并排；日志行逐行出现 */}
      <Node ref={g10} opacity={0}>
        <Rect position={[-280, -60]} width={420} height={220} radius={20} fill={T.card} stroke={T.green} lineWidth={3}>
          <Txt position={[0, -80]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'服务端日志'} />
          {[0, 1, 2].map(i => (
            <Txt key={`u6-log-${i}`} ref={g10green[i]} position={[0, -30 + i * 45]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} opacity={0} text={'50 ms ✓'} />
          ))}
        </Rect>
        <Rect position={[280, -60]} width={420} height={220} radius={20} fill={T.card} stroke={T.red} lineWidth={3}>
          <Txt position={[0, -80]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'客户端计时'} />
          {[0, 1, 2].map(i => (
            <Txt key={`u6-clog-${i}`} ref={g10red[i]} position={[0, -30 + i * 45]} fontSize={SIZE.label} fill={T.red} fontFamily={FONT.sans} opacity={0} text={'3 s'} />
          ))}
        </Rect>
        <Txt position={[0, -60]} fontSize={64} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'?'} />
      </Node>

      {/* b11：闭环压测——等上一个回来才发下一个；服务器卡住 2 秒，左边 2 秒只发 1 个 */}
      <Node ref={g11} opacity={0}>
        <Txt position={[0, -260]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'压测客户端 × 服务器（卡住 2 秒）'} />
        <Txt position={[-310, -200]} fontSize={SIZE.body} fontWeight={700} fill={T.white} fontFamily={FONT.sans} text={'闭环：等上一个回来才发'} />
        <Rect position={[-480, -100]} width={170} height={100} radius={14} fill={T.card} stroke={T.blue} lineWidth={2}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'压测客户端'} />
        </Rect>
        <Rect position={[-150, -100]} width={170} height={100} radius={14} fill={T.card} stroke={T.red} lineWidth={3}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'服务器'} />
        </Rect>
        <Line points={[[-390, -100], [-240, -100]]} stroke={T.line} lineWidth={3} endArrow />
        <Circle ref={closedDot} position={[-390, -100]} width={26} height={26} fill={T.yellow} opacity={0} />
        <Txt ref={stuckTag} position={[-150, 10]} fontSize={SIZE.label} fill={T.red} fontFamily={FONT.sans} opacity={0} text={'卡住 2 秒 · 只发 1 个'} />
        <Txt position={[310, -200]} fontSize={SIZE.body} fontWeight={700} fill={T.white} fontFamily={FONT.sans} text={'开环：按固定节奏一直发'} />
        <Node ref={openDim} opacity={0.35}>
          <Rect position={[160, -100]} width={170} height={100} radius={14} fill={T.card} stroke={T.blue} lineWidth={2}>
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'压测客户端'} />
          </Rect>
          <Rect position={[480, -100]} width={170} height={100} radius={14} fill={T.card} stroke={T.red} lineWidth={3}>
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'服务器'} />
          </Rect>
        </Node>
        <Txt position={[460, 260]} fontSize={SIZE.min} fill={T.purple} fontFamily={FONT.sans} text={'示意'} />
      </Node>

      {/* b12：开环——2 秒内发 20 个，全堆进队列；两边 p99 读数差几倍（只标相对高低，不编具体数字） */}
      <Node ref={g12} opacity={0}>
        {Array.from({length: 20}, (_, i) => (
          <Rect
            key={`u6-open-${i}`}
            ref={openDots[i]}
            position={[160, -100]}
            width={34}
            height={34}
            radius={6}
            fill={T.blue}
            opacity={0}
          />
        ))}
        {/* r2（P1-1 修后复核新发现）：openCount 原在 [320,130]，与点阵最后一行（y=118，半高 17）
            上下重叠，文字压住右下两枚点；移到点阵正下方 [200,160]（点阵底边 135，文字顶边 149），
            与 p99high（y=190）也无重叠 */}
        <Txt ref={openCount} position={[200, 160]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} opacity={0} text={'2 秒发了 20 个，全排进队列'} />
        <Txt ref={p99low} position={[-310, 130]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} opacity={0} text={'闭环 p99：低'} />
        <Txt ref={p99high} position={[320, 190]} fontSize={SIZE.label} fill={T.red} fontFamily={FONT.sans} opacity={0} text={'开环 p99：高几倍'} />
      </Node>

      {/* b13：两边队列长度对比，闭环的队列被人为缩短 */}
      <Node ref={g13} opacity={0}>
        <Txt position={[-310, -200]} fontSize={SIZE.body} fontWeight={700} fill={T.white} fontFamily={FONT.sans} text={'闭环测到的队列'} />
        <Rect ref={qClosed} position={[-310, 80]} offset={[0, 1]} width={160} height={10} radius={8} fill={T.green} />
        <Txt position={[310, -200]} fontSize={SIZE.body} fontWeight={700} fill={T.white} fontFamily={FONT.sans} text={'真实的队列'} />
        <Rect ref={qOpen} position={[310, 80]} offset={[0, 1]} width={160} height={10} radius={8} fill={T.red} />
        <Txt ref={skewTag} position={[-310, -120]} fontSize={SIZE.label} fill={T.red} fontFamily={FONT.sans} opacity={0} text={'失真：人为缩短了'} />
      </Node>

      {/* b14/b15：Figure 1-5 拓扑——用户 → Web 应用 → 7 个后端，各带一个数据库 */}
      <Node ref={g14} opacity={0}>
        <Circle position={[0, -250]} width={64} height={64} fill={T.card} stroke={T.blue} lineWidth={3} />
        <Txt position={[0, -250]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'用户'} />
        <Line points={[[0, -215], [0, -190]]} stroke={T.line} lineWidth={3} endArrow />
        <Rect position={[0, -155]} width={260} height={64} radius={12} fill={T.card} stroke={T.blue} lineWidth={2}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'Web 应用'} />
        </Rect>
        {BACKEND_MS.map((_, i) => (
          <Node key={`u6-be-${i}`}>
            <Line points={[[0, -120], [-480 + i * 160, -40]]} stroke={T.line} lineWidth={2} />
            <Rect position={[-480 + i * 160, 0]} width={140} height={64} radius={12} fill={T.card} stroke={T.blue} lineWidth={2}>
              <Txt fontSize={SIZE.min} fill={T.text} fontFamily={FONT.sans} text={`Backend ${i + 1}`} />
            </Rect>
            <Rect
              ref={dbRects[i]}
              position={[-480 + i * 160, 110]}
              width={70}
              height={44}
              radius={10}
              fill={T.card}
              stroke={T.muted}
              lineWidth={2}
            />
          </Node>
        ))}
        <Txt position={[0, 190]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'每个后端下面各连一个数据库'} />
      </Node>

      {/* b16/b17/b18：7 根条形（原值）+ 顶部总耗时条 */}
      <Node ref={g16} opacity={0}>
        {BACKEND_MS.map((ms, i) => (
          <Node key={`u6-bar-${i}`}>
            <Txt position={[-540, barY(i)]} fontSize={SIZE.min} fill={T.muted} fontFamily={FONT.sans} text={`B${i + 1}`} />
            <Rect
              ref={bars[i]}
              position={[-480, barY(i)]}
              offset={[-1, 0]}
              width={10}
              height={36}
              radius={6}
              fill={T.blue}
            />
            <Txt ref={barLabels[i]} position={[-480 + barW(ms) + 60, barY(i)]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} opacity={0} text={`${ms} ms`} />
          </Node>
        ))}
      </Node>
      <Node ref={g17} opacity={0}>
        <Rect ref={totalBar} position={[-480, -248]} offset={[-1, 0]} width={0} height={30} radius={6} fill={T.text} />
        {/* r2：标题右移至 x=180，避开总条终点（-20）；原 x=60 时左半被总条压住 */}
        <Txt position={[180, -248]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'总耗时 · 跟最慢的一样长'} />
        {/* r2：slowestTag 移到 B6 行右侧空处 [320,110]；原 [60,110] 与“487 ms”标签同位重叠 */}
        <Txt ref={slowestTag} position={[320, 110]} fontSize={SIZE.label} fill={T.red} fontFamily={FONT.sans} opacity={0} text={'Backend 6 最慢：487 ms'} />
      </Node>

      {/* b19：7 根条形化成 N 个小点，约 1% 变红 */}
      <Node ref={g19} opacity={0}>
        {Array.from({length: 100}, (_, i) => (
          <Circle
            key={`u6-dot-${i}`}
            ref={dots19[i]}
            position={[-234 + (i % 10) * 52, -170 + Math.floor(i / 10) * 40]}
            width={20}
            height={20}
            fill={i === 42 ? T.red : T.blue}
            opacity={0}
          />
        ))}
        <Txt position={[0, 90]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'100 个后端里，约 1 个慢'} />
      </Node>
    </>,
  );

  // QA r4（类 A）：计时标签原摆在固定坐标、紧挨计时条的终点，条一长出来就盖住标签开头（只剩“端 50 ms”“户端 3 s”）；
  // 改为贴在计时条右端外侧，条变长时标签跟着往右走
  [0, 1, 2].forEach(i => {
    attach(g9greenTag[i](), g9green[i](), 'right', 12);
    attach(g9redTag[i](), g9red[i](), 'right', 12);
  });

  // b9：服务端只记处理时间，排队的时间只有客户端看得见——绿条短、红条长，三行先后长出
  say('在客户端测');
  yield* beat(
    'b9',
    all(
      g9().opacity(1, 0.6),
      sequence(
        1.4,
        // QA orphan：每行的两个读数和它那一行的计时条一起出现（原来三行读数在拍首一起出现，第三行要空等 2s 才有条）
        ...[0, 1, 2].map(i =>
          all(
            g9green[i]().width(90, 0.9),
            g9red[i]().width(380, 1.2),
            g9greenTag[i]().opacity(1, 0.4),
            g9redTag[i]().opacity(1, 0.4),
          ),
        ),
      ),
    ),
  );

  // b10：只看服务端日志，你会以为一切正常——绿日志行与红计时行逐行出现
  say('服务端日志会骗人');
  yield* beat(
    'b10',
    all(
      g9().opacity(0, 0.5),
      g10().opacity(1, 0.6),
      sequence(
        1.5,
        ...[0, 1, 2].map(i => all(g10green[i]().opacity(1, 0.4), g10red[i]().opacity(1, 0.4))),
      ),
    ),
  );

  // b11：闭环压测——等上一个回来才发下一个；请求点两段走到服务器（服务器卡住 2 秒），标签随后出现
  say('闭环压测');
  yield* beat(
    'b11',
    all(
      g10().opacity(0, 0.5),
      g11().opacity(1, 0.6),
      sequence(
        1.5,
        all(closedDot().opacity(1, 0.4), closedDot().position([-315, -100], 1.5)),
        closedDot().position([-240, -100], 1.5),
        stuckTag().opacity(1, 0.6),
      ),
    ),
  );

  // b12：开环——2 秒内发 20 个，全堆进队列；读数标签跟在点流后面出现
  // r2（P1-1）：g12 容器必须淡入——之前 20 个点与 3 行标签挂在 opacity=0 的 g12 下，
  // b12 从未把 g12 本身淡入，开环一侧全程空白。
  say('开环压测');
  yield* beat(
    'b12',
    all(
      g12().opacity(1, 0.6),
      openDim().opacity(1, 0.6),
      sequence(
        0.7,
        ...openDots.map((d, i) =>
          chain(
            all(d().opacity(1, 0.3), d().position([110 + (i % 5) * 46, -20 + Math.floor(i / 5) * 46], 1.4)),
          ),
        ),
        openCount().opacity(1, 0.6),
        all(p99low().opacity(1, 0.5), p99high().opacity(1, 0.5)),
      ),
    ),
  );

  // b13：闭环会人为地把测试里的队列缩短，测出来的数字就失真了
  // r2（P2 1-4）：sequence(0, …) 的各步都在 t=0 并行开始、2.5s 即跑完，
  // 尾部加一段 2.6s 起的缓慢缩放填满拍尾（总 5.6s < 6.242s）。
  say('闭环会缩短队列');
  yield* beat(
    'b13',
    sequence(
      0,
      all(g11().opacity(0, 0.5), g12().opacity(0, 0.5), g13().opacity(1, 0.6)),
      all(qClosed().height(50, 1.2)),
      all(qOpen().height(260, 2.5)),
      all(skewTag().opacity(1, 0.6)),
      chain(waitFor(2.6), g13().scale(1.02, 3.0)),
    ),
  );

  // b14：一个请求的一生——网页要并行调用 7 个后端
  // r2（P2 1-4）：淡入只有 0.6s，尾部加缓慢缩放填满拍尾（3.9s < 4.598s）。
  say('1 个请求，7 个后端');
  yield* beat('b14', all(g13().opacity(0, 0.5), g14().opacity(1, 0.6), g14().scale(1.03, 3.9)));

  // b15：每个后端下面还各连着一个数据库——数据库图标逐个闪一下亮起
  say('每个后端各带一个库');
  yield* beat(
    'b15',
    sequence(
      0.55,
      ...dbRects.map(d =>
        chain(d().fill(T.yellow, 0.25), d().fill(T.card, 0.25)),
      ),
    ),
  );

  // b16：7 个后端各自用时不同——条形逐根长出，标出毫秒数
  say('7 个后端，各不相同');
  yield* beat(
    'b16',
    sequence(
      0.9,
      all(g14().opacity(0, 0.5), g16().opacity(1, 0.6)),
      ...bars.map((b, i) =>
        all(b().width(barW(BACKEND_MS[i]), 0.7), barLabels[i]().opacity(1, 0.4)),
      ),
    ),
  );

  // b17：整个请求要等最慢的那个——顶部总条分两段慢慢长到与 487 对齐，Backend 6 随后高亮
  say('等最慢的：487 ms');
  yield* beat(
    'b17',
    all(
      g17().opacity(1, 0.5),
      chain(
        totalBar().width(230, 3.5),
        totalBar().width(BAR_MAX, 3.5),
        all(bars[5]().fill(T.red, 0.5), slowestTag().opacity(1, 0.6)),
      ),
    ),
  );

  // b18：哪怕调用是并行的，终端请求还是得等最慢的那个——条形按各自耗时赛跑，总条跟最慢的走
  say('一个慢的拖慢全部');
  yield* beat(
    'b18',
    all(
      slowestTag().opacity(0, 0.5),
      chain(
        all(...bars.map(b => b().width(10, 0.3))),
        all(
          ...bars.map((b, i) => b().width(barW(BACKEND_MS[i]), (BACKEND_MS[i] / 487) * 4.5)),
          totalBar().width(BAR_MAX, 4.5),
        ),
        slowestTag().opacity(1, 0.6),
      ),
    ),
  );

  // b19：每个后端只有 1% 的概率变慢，调用得越多，撞上慢调用的概率越高
  say('每个 1% 慢');
  yield* beat(
    'b19',
    all(
      g16().opacity(0, 0.5),
      g17().opacity(0, 0.5),
      g19().opacity(1, 0.6),
      sequence(0.05, ...dots19.map(d => d().opacity(1, 0.2))),
    ),
  );
});
