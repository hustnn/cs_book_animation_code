// U4 场景 1（MC）：b1–b13 —— 钩子、§1.7 可扩展性、负载参数、Twitter 2012 年数字。
// 分镜：skill-ch01/ch01-beats.md U4 一节；原文：DDIA §1.7–1.8（书页 p10–11，PDF p32–33）。
// 时长全部来自 timeline/u4.json（beat() 驱动），不手写 waitFor 魔法数字。
// 颜色、字号、安全区一律取自 lib/theme，不手写十六进制色值。
// 速率条示意比例（300k 与 4.6k 差 65 倍，线性画 4.6k 会看不见）；画面标题与 b26 统一为“平均速率对比”，不主张对数尺度。
// 动画排序用 sequence()（先后步骤），不用 chain(waitFor()) 堆字面等待。
import {Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, chain, createRef, sequence} from '@motion-canvas/core';
import {makeBeats} from '../../lib/beats';
import {FONT, SAFE, SIZE, T} from '../../lib/theme';
import timeline from '../../timeline/u4.json';

export default makeScene2D(function* (view) {
  view.fill(T.bg);
  const beat = makeBeats(timeline);

  const header = createRef<Txt>();
  const anchor = createRef<Txt>();
  const g1 = createRef<Node>();
  const readBar = createRef<Rect>();
  const writeBar = createRef<Rect>();
  const g2 = createRef<Node>();
  const sysBox = createRef<Rect>();
  const sysGood = createRef<Txt>();
  const sysBad = createRef<Txt>();
  const g3 = createRef<Node>();
  const dataBar = createRef<Rect>();
  const g4 = createRef<Node>();
  const sub4 = createRef<Txt>();
  const g5 = createRef<Node>();
  const tag5 = createRef<Node>();
  const cross5 = createRef<Txt>();
  const g6 = createRef<Node>();
  const q1 = createRef<Node>();
  const q2 = createRef<Node>();
  const g7 = createRef<Node>();
  const dashNum = createRef<Txt>();
  const term7 = createRef<Txt>();
  const g8 = createRef<Node>();
  const big8 = createRef<Txt>();
  const sub8 = createRef<Txt>();
  const g9 = createRef<Node>();
  const cards9 = [0, 1, 2, 3].map(() => createRef<Node>());
  const g10 = createRef<Node>();
  const avgPtr = createRef<Node>();
  const extPtr = createRef<Node>();
  const g11 = createRef<Node>();
  const op1 = createRef<Node>();
  const op2 = createRef<Node>();
  const g12 = createRef<Node>();
  const avgMark = createRef<Node>();
  const peakMark = createRef<Node>();
  const g13 = createRef<Node>();
  const readBar13 = createRef<Rect>();

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

      {/* b1：300k 读 vs 4.6k 写，两根速率条（r3 #10：300k 标签移到读条上方，与 b26 同款，不再压条；标题与 b26 统一为“平均速率对比”） */}
      <Node ref={g1} opacity={0}>
        <Txt position={[0, -200]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'平均速率对比'} />
        <Txt position={[-460, -110]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'读时间线'} />
        <Rect ref={readBar} position={[-260, -60]} offset={[-1, 0]} width={10} height={54} radius={8} fill={T.blue} />
        <Txt position={[420, -112]} fontSize={SIZE.body} fontWeight={700} fill={T.blue} fontFamily={FONT.sans} text={'300k/秒'} />
        <Txt position={[-460, 30]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'发推'} />
        <Rect ref={writeBar} position={[-260, 80]} offset={[-1, 0]} width={10} height={54} radius={8} fill={T.green} />
        <Txt position={[30, 80]} fontSize={SIZE.body} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'4.6k/秒'} />
        <Txt position={[0, 180]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'读比写多约 65 倍'} />
      </Node>

      {/* b2：用户数 1 万 → 10 万爬升，系统由绿变黄 */}
      <Node ref={g2} opacity={0}>
        <Txt position={[0, -220]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'并发用户数'} />
        <Line
          points={[[-420, 120], [-200, 90], [0, 30], [200, -60], [420, -160]]}
          stroke={T.blue}
          lineWidth={4}
          endArrow
        />
        <Txt position={[-420, 170]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'1 万'} />
        <Txt position={[380, -210]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'10 万'} />
        <Rect ref={sysBox} position={[0, 200]} width={360} height={70} radius={12} fill={T.green} opacity={0.9} />
        <Txt ref={sysGood} position={[0, 200]} fontSize={SIZE.label} fill={T.bg} fontFamily={FONT.sans} text={'系统状态：良好'} />
        <Txt ref={sysBad} position={[0, 200]} fontSize={SIZE.label} fill={T.bg} fontFamily={FONT.sans} opacity={0} text={'系统状态：退化'} />
      </Node>

      {/* b3：数据量 100 万 → 1000 万 */}
      <Node ref={g3} opacity={0}>
        <Txt position={[0, -160]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'数据量'} />
        <Rect position={[-460, -40]} offset={[-1, 0]} width={120} height={54} radius={8} fill={T.blue} />
        <Txt position={[-460, 20]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'100 万'} />
        <Rect ref={dataBar} position={[-460, 100]} offset={[-1, 0]} width={120} height={54} radius={8} fill={T.yellow} />
        <Txt position={[-460, 160]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'1000 万'} />
      </Node>

      {/* b4：可扩展性术语卡；副标题后出 */}
      <Node ref={g4} opacity={0}>
        <Rect position={[0, -40]} width={640} height={180} radius={20} fill={T.card} stroke={T.blue} lineWidth={3}>
          <Txt position={[0, -30]} fontSize={SIZE.title} fontWeight={700} fill={T.white} fontFamily={FONT.serif} text={'可扩展性'} />
          <Txt position={[0, 40]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'scalability'} />
        </Rect>
        <Txt ref={sub4} position={[0, 110]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} opacity={0} text={'应对负载增长的能力'} />
      </Node>

      {/* b5：“可扩展”标签被撕掉 */}
      <Node ref={g5} opacity={0}>
        <Node ref={tag5}>
          <Rect position={[0, -40]} width={420} height={140} radius={16} fill={T.card} stroke={T.yellow} lineWidth={3}>
            <Txt fontSize={SIZE.title} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'可扩展'} />
          </Rect>
        </Node>
        <Txt ref={cross5} position={[0, -40]} fontSize={120} fontWeight={700} fill={T.red} fontFamily={FONT.sans} opacity={0} text={'✕'} />
        <Txt position={[0, 110]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'贴个标签，没有意义'} />
      </Node>

      {/* b6：两个问句卡 */}
      <Node ref={g6} opacity={0}>
        <Node ref={q1} opacity={0}>
          <Rect position={[-280, -40]} width={480} height={150} radius={16} fill={T.card} stroke={T.blue} lineWidth={2}>
            <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'增长了，有什么选项？'} />
          </Rect>
        </Node>
        <Node ref={q2} opacity={0}>
          <Rect position={[280, -40]} width={480} height={150} radius={16} fill={T.card} stroke={T.blue} lineWidth={2}>
            <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'要加多少资源？'} />
          </Rect>
        </Node>
      </Node>

      {/* b7/b8：负载仪表盘 + 术语卡；b8 数字翻倍、问号升起 */}
      <Node ref={g7} opacity={0}>
        <Rect position={[0, -60]} width={760} height={260} radius={20} fill={T.card} stroke={T.line} lineWidth={2} />
        <Txt position={[0, -160]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'当前负载'} />
        <Txt ref={dashNum} position={[0, -60]} fontSize={52} fontWeight={700} fill={T.white} fontFamily={FONT.sans} text={'请求/秒 · 读写比 · 活跃用户'} />
        <Txt ref={term7} position={[0, 30]} fontSize={SIZE.body} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} opacity={0} text={'负载参数 load parameter'} />
      </Node>
      <Node ref={g8} opacity={0}>
        <Txt ref={big8} position={[0, -40]} fontSize={64} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} opacity={0} text={'× 2 = ?'} />
        <Txt ref={sub8} position={[0, 60]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} opacity={0} text={'负载翻倍会怎样？'} />
      </Node>

      {/* b9：四张参数卡依次出现（本拍 19.7s，每张约隔 4s，与旁白四个例子同步） */}
      <Node ref={g9} opacity={0}>
        {[
          {x: -280, y: -110, t1: 'web 服务器', t2: '请求/秒'},
          {x: 280, y: -110, t1: '数据库', t2: '读写比'},
          {x: -280, y: 80, t1: '聊天室', t2: '同时活跃用户'},
          {x: 280, y: 80, t1: '缓存', t2: '命中率'},
        ].map((c, i) => (
          <Node key={`u4-pcard-${i}`} ref={cards9[i]} position={[c.x, c.y]} opacity={0}>
            <Rect width={480} height={140} radius={16} fill={T.card} stroke={T.blue} lineWidth={2}>
              <Txt position={[0, -28]} fontSize={SIZE.body} fontWeight={700} fill={T.white} fontFamily={FONT.sans} text={c.t1} />
              <Txt position={[0, 28]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={c.t2} />
            </Rect>
          </Node>
        ))}
      </Node>

      {/* b10：平均值指针 vs 极端值指针 */}
      <Node ref={g10} opacity={0}>
        <Txt position={[0, -220]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'哪个数字说了算？'} />
        {[60, 80, 70, 90, 300].map((h, i) => (
          <Rect
            key={`u4-avgbar-${i}`}
            position={[-320 + i * 160, 80]}
            offset={[0, 1]}
            width={90}
            height={h}
            radius={8}
            fill={i === 4 ? T.red : T.blue}
          />
        ))}
        <Node ref={avgPtr} opacity={0}>
          <Line points={[[-240, -60], [-240, -10]]} stroke={T.green} lineWidth={3} endArrow />
          <Txt position={[-240, -100]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} text={'平均值'} />
        </Node>
        <Node ref={extPtr} opacity={0}>
          <Line points={[[320, -280], [320, -230]]} stroke={T.red} lineWidth={3} endArrow />
          <Txt position={[320, -310]} fontSize={SIZE.label} fill={T.red} fontFamily={FONT.sans} text={'极端值：瓶颈'} />
        </Node>
      </Node>

      {/* b11：Twitter + 2012 年 11 月数据 + 两个操作（两操作依次出现） */}
      <Node ref={g11} opacity={0}>
        <Txt position={[0, -160]} fontSize={64} fontWeight={700} fill={T.blue} fontFamily={FONT.sans} text={'Twitter'} />
        <Txt position={[0, -80]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'2012 年 11 月发表的数据'} />
        <Node ref={op1} opacity={0}>
          <Rect position={[-260, 60]} width={420} height={120} radius={16} fill={T.card} stroke={T.green} lineWidth={2}>
            <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'发推'} />
          </Rect>
        </Node>
        <Node ref={op2} opacity={0}>
          <Rect position={[260, 60]} width={420} height={120} radius={16} fill={T.card} stroke={T.blue} lineWidth={2}>
            <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'看时间线'} />
          </Rect>
        </Node>
      </Node>

      {/* b12：发推速率条，平均线 4.6k，峰值线 12k */}
      <Node ref={g12} opacity={0}>
        <Txt position={[0, -180]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'发推速率'} />
        <Rect position={[0, -60]} width={900} height={40} radius={20} fill={T.card} stroke={T.line} lineWidth={2} />
        <Rect position={[-450, -60]} offset={[-1, 0]} width={340} height={40} radius={20} fill={T.green} />
        <Node ref={avgMark} opacity={0}>
          <Line points={[[-110, -110], [-110, -10]]} stroke={T.green} lineWidth={3} />
          <Txt position={[-110, -140]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} text={'平均 4.6k'} />
        </Node>
        <Node ref={peakMark} opacity={0}>
          <Line points={[[230, -110], [230, -10]]} stroke={T.red} lineWidth={3} />
          <Txt position={[230, -140]} fontSize={SIZE.label} fill={T.red} fontFamily={FONT.sans} text={'峰值 12k'} />
        </Node>
        <Txt position={[0, 60]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'平均每秒 4.6 千次，峰值超过 1.2 万次'} />
      </Node>

      {/* b13：读速率条 300k，远高于发推条（对数尺度，与 b1 同比例） */}
      <Node ref={g13} opacity={0}>
        <Txt position={[0, -180]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'看时间线速率'} />
        <Rect position={[-460, -60]} offset={[-1, 0]} width={200} height={54} radius={8} fill={T.green} opacity={0.5} />
        <Txt position={[-460, 0]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'发推 4.6k'} />
        <Rect ref={readBar13} position={[-460, 100]} offset={[-1, 0]} width={10} height={54} radius={8} fill={T.blue} />
        <Txt position={[360, 100]} fontSize={SIZE.body} fontWeight={700} fill={T.blue} fontFamily={FONT.sans} text={'300k/秒'} />
      </Node>
    </>,
  );

  // b1：钩子——300k 读 vs 4.6k 写（读条先长，再长写条）
  say('300k 读 · 4.6k 写');
  yield* beat(
    'b1',
    sequence(2.3, g1().opacity(1, 0.6), readBar().width(740, 2.2), writeBar().width(200, 2.0)),
  );

  // b2：今天可靠，不等于未来可靠——用户数爬升，系统由绿变黄（r2 #6：变黄后文字同步改成“退化”，chain 真串行）
  say('1 万 → 10 万用户');
  yield* beat(
    'b2',
    chain(
      all(g1().opacity(0, 0.5), g2().opacity(1, 0.6)),
      sysBox().fill(T.yellow, 5.5),
      all(sysGood().opacity(0, 0.4), sysBad().opacity(1, 0.4)),
    ),
  );

  // b3：数据量 100 万 → 1000 万（r3 #8 根治：b3 用 --speed 80 重录，4.44s / 5.41 字/s，无 ≥0.3s 静音；条形生长 3.2s 不变）
  say('100 万 → 1000 万');
  yield* beat('b3', all(g2().opacity(0, 0.5), sequence(0, g3().opacity(1, 0.6), dataBar().width(900, 3.2))));

  // b4：可扩展性就是应对负载增长的能力——卡片先出，副标题后出
  say('可扩展性');
  yield* beat(
    'b4',
    all(g3().opacity(0, 0.5), sequence(2.0, g4().opacity(1, 0.6), sub4().opacity(1, 0.8))),
  );

  // b5：不是能贴的标签——标签旋转淡出，打叉
  say('不是一维标签');
  yield* beat(
    'b5',
    all(
      g4().opacity(0, 0.5),
      sequence(2.4, g5().opacity(1, 0.6), all(tag5().rotation(-18, 1.2), tag5().opacity(0.15, 1.2)), cross5().opacity(1, 0.8)),
    ),
  );

  // b6：该问的两个问题，依次弹出
  say('增长了怎么办 · 加多少资源');
  yield* beat(
    'b6',
    all(g5().opacity(0, 0.5), sequence(1.8, g6().opacity(1, 0.6), q1().opacity(1, 0.8), q2().opacity(1, 0.8))),
  );

  // b7：先把现在的负载说清楚——仪表盘数字明暗浮动，术语卡后出
  say('负载参数');
  yield* beat(
    'b7',
    all(
      g6().opacity(0, 0.5),
      sequence(2.2, g7().opacity(1, 0.6), dashNum().opacity(0.4, 2.0), dashNum().opacity(1, 2.0), term7().opacity(1, 0.8)),
    ),
  );

  // b8：只有先描述负载，才能讨论增长——“× 2 = ?”先出，问句后出
  say('先描述，才能谈增长');
  yield* beat(
    'b8',
    all(g7().opacity(0, 0.5), g8().opacity(1, 0.4), sequence(2.5, big8().opacity(1, 0.8), sub8().opacity(1, 0.8))),
  );

  // b9：最好的参数取决于架构——四张卡依次出现（本拍 19.7s，每张约隔 4s，与旁白四个例子同步）
  say('请求/秒 · 读写比');
  yield* beat(
    'b9',
    all(
      g8().opacity(0, 0.5),
      sequence(3.8, g9().opacity(1, 0.6), cards9[0]().opacity(1, 1.0), cards9[1]().opacity(1, 1.0), cards9[2]().opacity(1, 1.0), cards9[3]().opacity(1, 1.0)),
    ),
  );

  // b10：平均 vs 极端——两个指针先后指向
  say('平均 vs 极端');
  yield* beat(
    'b10',
    all(g9().opacity(0, 0.5), sequence(1.8, g10().opacity(1, 0.6), avgPtr().opacity(1, 0.8), extPtr().opacity(1, 0.8))),
  );

  // b11：Twitter 例子，2012 年 11 月数据——两操作依次出现
  say('2012 年 11 月数据');
  yield* beat(
    'b11',
    all(g10().opacity(0, 0.5), sequence(2.0, g11().opacity(1, 0.6), op1().opacity(1, 0.8), op2().opacity(1, 0.8))),
  );

  // b12：发推平均 4.6k，峰值 12k——两条标记先后出现
  say('发推 4.6k，峰值 12k');
  yield* beat(
    'b12',
    all(g11().opacity(0, 0.5), sequence(1.2, g12().opacity(1, 0.6), avgMark().opacity(1, 0.8), peakMark().opacity(1, 0.8))),
  );

  // b13：看时间线 300k/秒——读条远长于写条
  say('看时间线 300k/秒');
  yield* beat('b13', all(g12().opacity(0, 0.5), sequence(0, g13().opacity(1, 0.6), readBar13().width(740, 2.8))));
});
