// U4 场景 4（MC）：b34–b42 —— 关注者分布是关键负载参数、混合做法（名人例外）、
// 方法论收束、回扣与下一站。
// 分镜：skill-ch01/ch01-beats.md U4 一节；原文：DDIA §1.8（书页 p12–13，PDF p34–35）。
// 分布曲线为长尾示意形状（原文只说“分布极不均匀”，未给曲线，画面不标具体数值）。
// 时长全部来自 timeline/u4.json（beat() 驱动），不手写 waitFor 魔法数字。
// 动画排序用 sequence()（先后步骤），不用 chain(waitFor()) 堆字面等待。
import {attach} from '../../lib/layout';
import {Circle, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, sequence} from '@motion-canvas/core';
import {makeBeats} from '../../lib/beats';
import {FONT, SAFE, SIZE, T} from '../../lib/theme';
import timeline from '../../timeline/u4.json';

export default makeScene2D(function* (view) {
  view.fill(T.bg);
  const beat = makeBeats(timeline);

  const header = createRef<Txt>();
  const anchor = createRef<Txt>();
  const g34 = createRef<Node>();
  const tailSeg = createRef<Line>();
  const keyTag = createRef<Txt>();
  const g35 = createRef<Node>();
  const newPath = createRef<Node>();
  const g36 = createRef<Node>();
  const celebX = createRef<Txt>();
  const noFanTxt = createRef<Txt>();
  const g37 = createRef<Node>();
  const mergeA = createRef<Rect>();
  const mergeB = createRef<Rect>();
  const mergeLabel = createRef<Txt>();
  const g38 = createRef<Node>();
  const ch12 = createRef<Txt>();
  const g39 = createRef<Node>();
  const dash39 = createRef<Txt>();
  const sub39 = createRef<Txt>();
  const g40 = createRef<Node>();
  const readBar40 = createRef<Rect>();
  const writeBar40 = createRef<Rect>();
  const fanArrow = createRef<Line>();
  const cap40 = createRef<Txt>();
  const g41 = createRef<Node>();
  const q41 = createRef<Txt>();
  const card41 = createRef<Rect>();
  const g42 = createRef<Node>();
  const distBars = [0, 1, 2, 3, 4, 5, 6, 7].map(() => createRef<Rect>());

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
        text={'第 1 章 · 负载——Twitter 时间线'}
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

      {/* b34：关注者分布曲线（长尾示意），尾部标红，圈出“关键负载参数”（r2 #9：尾部改走平微降，不再上翘） */}
      <Node ref={g34} opacity={0}>
        <Txt position={[0, -220]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'每个用户有多少关注者'} />
        <Line
          points={[[-450, 100], [-360, 100], [-270, 100], [-180, 100], [-90, 100], [0, 100], [90, 100], [180, 100], [270, 100], [450, 100]]}
          stroke={T.line}
          lineWidth={2}
        />
        <Line
          points={[[-450, -160], [-360, -60], [-270, 10], [-180, 55], [-90, 80], [0, 92], [90, 97], [180, 95]]}
          stroke={T.blue}
          lineWidth={4}
        />
        <Line
          ref={tailSeg}
          points={[[180, 95], [270, 96], [360, 97], [450, 98]]}
          stroke={T.red}
          lineWidth={4}
          opacity={0}
        />
        <Txt position={[-450, 140]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'关注者少的人很多'} />
        <Txt position={[330, 140]} fontSize={SIZE.label} fill={T.red} fontFamily={FONT.sans} text={'极少数人关注者极多'} />
        <Txt ref={keyTag} position={[0, -260]} fontSize={SIZE.body} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} opacity={0} text={'关键负载参数：关注者分布'} />
        <Line points={[[180, -230], [280, 70]]} stroke={T.yellow} lineWidth={3} endArrow />
      </Node>

      {/* b35：做法 2 的图上开出一条新路 */}
      <Node ref={g35} opacity={0}>
        <Rect position={[-260, -80]} width={440} height={140} radius={16} fill={T.card} stroke={T.green} lineWidth={2}>
          <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'做法 2：写时扇出'} />
        </Rect>
        <Node ref={newPath} opacity={0}>
          <Line points={[[-40, -80], [180, 60]]} stroke={T.yellow} lineWidth={4} endArrow />
          <Rect position={[330, 110]} width={360} height={120} radius={16} fill={T.card} stroke={T.yellow} lineWidth={3}>
            <Txt fontSize={SIZE.body} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'混合做法'} />
          </Rect>
        </Node>
      </Node>

      {/* b36：普通用户走扇出，名人被圈出例外 */}
      <Node ref={g36} opacity={0}>
        <Rect position={[-320, -80]} width={400} height={150} radius={16} fill={T.card} stroke={T.green} lineWidth={2}>
          <Txt position={[0, -30]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'普通用户'} />
          <Txt position={[0, 30]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'发推时扇出'} />
        </Rect>
        <Line points={[[-120, -80], [170, -80]]} stroke={T.green} lineWidth={3} endArrow />
        <Rect position={[280, -80]} width={220} height={120} radius={12} fill={T.card} stroke={T.green} lineWidth={2}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'邮箱'} />
        </Rect>
        <Circle position={[-320, 140]} width={90} height={90} fill={T.card} stroke={T.red} lineWidth={3} />
        <Txt position={[-320, 140]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'名人'} />
        <Txt ref={celebX} position={[-160, 140]} fontSize={SIZE.title} fontWeight={700} fill={T.red} fontFamily={FONT.sans} opacity={0} text={'除外 ✕'} />
        <Txt ref={noFanTxt} position={[280, 140]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} opacity={0} text={'不走扇出'} />
      </Node>

      {/* b37：名人推文读时取回，跟时间线合并 */}
      <Node ref={g37} opacity={0}>
        <Circle position={[-380, -140]} width={90} height={90} fill={T.card} stroke={T.red} lineWidth={3} />
        <Txt position={[-380, -140]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'名人'} />
        <Txt position={[-380, -220]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'名人推文'} />
        <Line points={[[-380, -90], [-380, 20]]} stroke={T.red} lineWidth={3} endArrow />
        <Line points={[[-380, 20], [-100, 20]]} stroke={T.red} lineWidth={3} endArrow />
        <Txt position={[-260, -40]} fontSize={SIZE.label} fill={T.red} fontFamily={FONT.sans} text={'读时取回'} />
        <Rect position={[180, -40]} width={560} height={220} radius={16} fill={T.card} stroke={T.blue} lineWidth={2} />
        <Rect ref={mergeA} position={[60, -40]} width={200} height={90} radius={10} fill={T.green} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.bg} fontFamily={FONT.sans} text={'邮箱内容'} />
        </Rect>
        <Rect ref={mergeB} position={[300, -40]} width={200} height={90} radius={10} fill={T.red} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.bg} fontFamily={FONT.sans} text={'名人推文'} />
        </Rect>
        <Txt ref={mergeLabel} position={[180, 50]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} opacity={0} text={'合并成时间线'} />
      </Node>

      {/* b38：混合图稳定运转，第 12 章再回来 */}
      <Node ref={g38} opacity={0}>
        <Rect position={[-300, -60]} width={380} height={140} radius={16} fill={T.card} stroke={T.green} lineWidth={2}>
          <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'普通用户：扇出'} />
        </Rect>
        <Rect position={[300, -60]} width={380} height={140} radius={16} fill={T.card} stroke={T.red} lineWidth={2}>
          <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'名人：读时取回'} />
        </Rect>
        <Line points={[[-110, -60], [110, -60]]} stroke={T.line} lineWidth={3} />
        <Txt position={[0, 60]} fontSize={SIZE.body} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'✓ 性能一直很稳定'} />
        <Txt ref={ch12} position={[0, 140]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} opacity={0} text={'第 12 章还会回来再讲'} />
      </Node>

      {/* b39：Twitter 的图淡出，换成空白应用框，同样的仪表盘 */}
      <Node ref={g39} opacity={0}>
        <Rect position={[0, -60]} width={700} height={220} radius={20} fill={T.card} stroke={T.line} lineWidth={2} />
        <Txt position={[0, -120]} fontSize={SIZE.body} fontWeight={700} fill={T.white} fontFamily={FONT.serif} text={'你的应用'} />
        <Txt ref={dash39} position={[0, -40]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} opacity={0} text={'请求/秒 · 读写比 · 活跃用户'} />
        <Txt ref={sub39} position={[0, 30]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} opacity={0} text={'同样的仪表盘，同样的推理'} />
      </Node>

      {/* b40：回到 b1 的两根速率条，扇出箭头压在中间（r3 #10：300k 标签移到读条上方，与 b26 同款） */}
      <Node ref={g40} opacity={0}>
        <Txt position={[-460, -110]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'读时间线'} />
        <Rect ref={readBar40} position={[-260, -60]} offset={[-1, 0]} width={10} height={54} radius={8} fill={T.blue} />
        <Txt position={[420, -112]} fontSize={SIZE.body} fontWeight={700} fill={T.blue} fontFamily={FONT.sans} text={'300k/秒'} />
        <Txt position={[-460, 30]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'发推'} />
        <Rect ref={writeBar40} position={[-260, 80]} offset={[-1, 0]} width={10} height={54} radius={8} fill={T.green} />
        <Txt position={[30, 80]} fontSize={SIZE.body} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'4.6k/秒'} />
        <Line ref={fanArrow} points={[[0, -25], [0, 45]]} stroke={T.yellow} lineWidth={4} endArrow opacity={0} />
        <Txt ref={cap40} position={[0, 180]} fontSize={SIZE.body} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} opacity={0} text={'扇出把写放大了 75 倍'} />
      </Node>

      {/* b41：负载仪表盘空白，留一个问号 */}
      <Node ref={g41} opacity={0}>
        <Rect ref={card41} position={[0, -40]} width={760} height={260} radius={20} fill={T.card} stroke={T.line} lineWidth={2} />
        <Txt position={[0, -40]} fontSize={96} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'?'} />
        <Txt ref={q41} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} opacity={0} text={'哪个数字翻倍，先扛不住？'} />
      </Node>

      {/* b42：负载仪表盘淡出，响应时间分布图亮起 */}
      <Node ref={g42} opacity={0}>
        <Txt position={[0, -200]} fontSize={SIZE.title} fontWeight={700} fill={T.white} fontFamily={FONT.serif} text={'下一站：性能是分布'} />
        {[50, 70, 60, 90, 80, 120, 200, 320].map((h, i) => (
          <Rect
            key={`u4-dist-${i}`}
            ref={distBars[i]}
            position={[-350 + i * 100, 180]}
            offset={[0, 1]}
            width={70}
            height={10}
            radius={8}
            fill={i >= 6 ? T.red : T.blue}
          />
        ))}
        {/* r3：副标题原在 [0, 160]、与生长的柱子同高被遮——移到柱底（y=180）下方 230，作图下说明。 */}
        <Txt position={[0, 230]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'同样一个请求，为什么每次快慢都不一样？'} />
      </Node>
    </>,
  );

  // QA r4（类 E）：问题原在 y=90，正好压在卡片下边框上；改放在卡片内侧、离下边框 22px
  attach(q41(), card41(), 'bottom', 22, true);

  // b34：关注者分布本身就是关键负载参数——曲线画出，尾部标红，标签后出
  say('分布决定扇出负载');
  yield* beat(
    'b34',
    sequence(2.0, g34().opacity(1, 0.6), tailSeg().opacity(1, 0.8), keyTag().opacity(1, 0.8)),
  );

  // b35：故事还有个转折——做法 2 的图上开出一条新路
  say('后来改成混合做法');
  yield* beat('b35', all(g34().opacity(0, 0.5), sequence(2.5, g35().opacity(1, 0.6), newPath().opacity(1, 0.8))));

  // b36：大多数用户照常扇出，名人除外——“除外”先出，“不走扇出”后出
  say('名人除外');
  yield* beat(
    'b36',
    all(g35().opacity(0, 0.5), sequence(2.0, g36().opacity(1, 0.6), celebX().opacity(1, 0.6), noFanTxt().opacity(1, 0.8))),
  );

  // b37：名人推文读时取回，跟时间线合并——邮箱内容、名人推文、合并标签依次出现
  say('名人推文读时取');
  yield* beat(
    'b37',
    all(
      g36().opacity(0, 0.5),
      sequence(1.8, g37().opacity(1, 0.6), mergeA().opacity(1, 0.7), mergeB().opacity(1, 0.7), mergeLabel().opacity(1, 0.6)),
    ),
  );

  // b38：这样性能一直很稳定，第 12 章再回来
  say('第 12 章再回来');
  yield* beat('b38', all(g37().opacity(0, 0.5), sequence(2.0, g38().opacity(1, 0.6), ch12().opacity(1, 0.6))));

  // b39：你的应用特征可能很不同，但推理方式可以套用——仪表盘两行依次出现
  say('推理方式可套用');
  yield* beat(
    'b39',
    all(g38().opacity(0, 0.5), sequence(1.6, g39().opacity(1, 0.6), dash39().opacity(1, 0.8), sub39().opacity(1, 0.8))),
  );

  // b40：回扣——难题不是发推太多，而是读太多、扇出太大（两条重画，箭头与结论依次出现）
  say('难题是读多、扇出大');
  yield* beat(
    'b40',
    all(
      g39().opacity(0, 0.5),
      sequence(1.2, g40().opacity(1, 0.6), readBar40().width(740, 2.5), writeBar40().width(200, 1.5), fanArrow().opacity(1, 0.6), cap40().opacity(1, 0.8)),
    ),
  );

  // b41：停下来想一想——哪个数字一翻倍，就会先扛不住？
  say('哪个数字先扛不住');
  yield* beat('b41', all(g40().opacity(0, 0.5), sequence(2.8, g41().opacity(1, 0.6), q41().opacity(1, 0.8))));

  // b42：下一单元，性能——分布图柱子依次长出
  say('下一站：性能是分布');
  yield* beat(
    'b42',
    all(
      g41().opacity(0, 0.5),
      sequence(
        0.45,
        g42().opacity(1, 0.6),
        distBars[0]().height(50, 0.4),
        distBars[1]().height(70, 0.4),
        distBars[2]().height(60, 0.4),
        distBars[3]().height(90, 0.4),
        distBars[4]().height(80, 0.4),
        distBars[5]().height(120, 0.4),
        distBars[6]().height(200, 0.4),
        distBars[7]().height(320, 0.4),
      ),
    ),
  );
});
