// U1 场景 2（MC）：b12–b19 —— 成功的抽象、现实没那么简单、类别边界变模糊、拆开再缝合、同步是应用代码的事。
// 分镜：skill-ch01/ch01-beats.md U1 一节；原文：DDIA §1.1（书页 p4，PDF p26）。
// 时长全部来自 timeline/u1.json（beat() 驱动），不手写 waitFor 魔法数字。
// 颜色、字号、安全区一律取自 lib/theme，不手写十六进制色值。
import {Circle, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, chain, createRef, delay} from '@motion-canvas/core';
import {makeBeats} from '../../lib/beats';
import {FONT, SAFE, SIZE, T} from '../../lib/theme';
import timeline from '../../timeline/u1.json';

export default makeScene2D(function* (view) {
  view.fill(T.bg);
  const beat = makeBeats(timeline);

  const header = createRef<Txt>();
  const anchor = createRef<Txt>();
  const g12 = createRef<Node>();
  const toolIcons = [0, 1, 2, 3, 4].map(() => createRef<Rect>());
  const toolbox = createRef<Rect>();
  const engineer = createRef<Node>();
  const blueprint = createRef<Rect>();
  const dbTool = createRef<Rect>();
  const g14 = createRef<Node>();
  const variants = [0, 1, 2].map(() => createRef<Rect>());
  const stitchQ = createRef<Node>();
  const g15 = createRef<Node>();
  const boxA = createRef<Rect>();
  const boxB = createRef<Rect>();
  const zig1 = createRef<Line>();
  const zig2 = createRef<Line>();
  const flowB = createRef<Line>();
  const g16 = createRef<Node>();
  const catStore = createRef<Rect>();
  const catQueue = createRef<Rect>();
  const redisTag = createRef<Rect>();
  const kafkaTag = createRef<Rect>();
  const durableBadge = createRef<Rect>();
  const g17 = createRef<Node>();
  const taskBlock = createRef<Rect>();
  const pieces = [0, 1, 2, 3, 4].map(() => createRef<Rect>());
  const stitch = createRef<Line>();
  const g18 = createRef<Node>();
  const mainDb = createRef<Rect>();
  const memBox = createRef<Rect>();
  const esBox = createRef<Rect>();
  const syncA = createRef<Line>();
  const syncB = createRef<Line>();
  const checkA = createRef<Txt>();
  const checkB = createRef<Txt>();

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
        text={'第 1 章 · 拼出来的数据系统'}
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

      {/* b12：五个构件拼成工具箱，工程师直接拿起来用（工具箱框在图标之下） */}
      <Node ref={g12} opacity={0}>
        <Rect ref={toolbox} position={[0, -160]} width={1080} height={180} radius={18} fill={T.card} stroke={T.yellow} lineWidth={3} opacity={0} />
        <Txt position={[0, -272]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'工具箱'} />
        {['数据库', '缓存', '搜索索引', '流处理', '批处理'].map((label, i) => (
          <Rect
            key={`u1-t12-${i}`}
            ref={toolIcons[i]}
            position={[-440 + i * 220, -160]}
            width={180}
            height={100}
            radius={14}
            fill={T.card}
            stroke={T.blue}
            lineWidth={2}
            opacity={0}
          >
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={label} />
          </Rect>
        ))}
        <Node ref={engineer} position={[0, 140]} opacity={0}>
          <Circle width={70} height={70} fill={T.blue} />
          <Rect position={[0, 70]} width={110} height={90} radius={16} fill={T.card} stroke={T.line} lineWidth={2} />
          <Txt position={[0, 70]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'工程师'} />
        </Node>
      </Node>

      {/* b13：放下“从零写引擎”的图纸，拿起数据库工具 */}
      <Node ref={blueprint} opacity={0}>
        <Rect position={[-280, -60]} width={420} height={200} radius={16} fill={T.card} stroke={T.red} lineWidth={2}>
          <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'从零写存储引擎'} />
          <Txt position={[0, 50]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'图纸'} />
        </Rect>
      </Node>
      <Rect ref={dbTool} position={[280, -60]} width={260} height={120} radius={14} fill={T.card} stroke={T.blue} lineWidth={3} opacity={0}>
        <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'数据库'} />
        <Txt position={[0, 36]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'现成的工具'} />
      </Rect>

      {/* b14：同一个数据库图标长出几个不同形态 */}
      <Node ref={g14} opacity={0}>
        <Rect position={[-360, -60]} width={220} height={140} radius={14} fill={T.card} stroke={T.blue} lineWidth={3}>
          <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'数据库'} />
        </Rect>
        {[
          {x: -40, w: 150, h: 100, c: T.green, label: '形态一'},
          {x: 200, w: 220, h: 180, c: T.yellow, label: '形态二'},
          {x: 440, w: 130, h: 220, c: T.purple, label: '形态三'},
        ].map((v, i) => (
          <Rect
            key={`u1-var-${i}`}
            ref={variants[i]}
            position={[v.x, -60]}
            width={v.w}
            height={v.h}
            radius={14}
            fill={T.card}
            stroke={v.c}
            lineWidth={3}
            opacity={0}
          >
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={v.label} />
          </Rect>
        ))}
        <Txt position={[0, 160]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'同一个工具，不同特性'} />
        {/* r2 #2：拼合处打问号——缓存/索引做法各异，几个工具拼起来并不容易 */}
        <Node ref={stitchQ} position={[320, 70]} opacity={0}>
          <Circle width={54} height={54} fill={T.card} stroke={T.yellow} lineWidth={3} />
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'?'} />
        </Node>
      </Node>

      {/* b15：数据库和消息队列——表面像，内部访问箭头不同 */}
      <Node ref={g15} opacity={0}>
        <Rect ref={boxA} position={[-280, -60]} width={380} height={220} radius={16} fill={T.card} stroke={T.blue} lineWidth={2}>
          <Txt position={[0, -70]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'数据库'} />
        </Rect>
        <Rect ref={boxB} position={[280, -60]} width={380} height={220} radius={16} fill={T.card} stroke={T.blue} lineWidth={2}>
          <Txt position={[0, -70]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'消息队列'} />
        </Rect>
        <Line ref={zig1} points={[[-430, -30], [-350, 10], [-270, -30], [-190, 10], [-130, -30]]} stroke={T.yellow} lineWidth={3} endArrow opacity={0} />
        <Line ref={zig2} points={[[-430, 20], [-310, 45], [-190, 20]]} stroke={T.yellow} lineWidth={3} opacity={0} />
        <Line ref={flowB} points={[[140, -20], [280, -20], [420, -20]]} stroke={T.green} lineWidth={3} endArrow opacity={0} />
        <Line points={[[140, 20], [280, 20], [420, 20]]} stroke={T.green} lineWidth={3} opacity={0.5} />
        <Txt position={[-280, 120]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'读写随机'} />
        <Txt position={[280, 120]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'顺序流动'} />
      </Node>

      {/* b16：类别边界变模糊——Redis 与 Kafka 越界 */}
      <Node ref={g16} opacity={0}>
        <Rect ref={catStore} position={[-280, -100]} width={400} height={120} radius={16} fill={T.card} stroke={T.blue} lineWidth={2}>
          <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'数据存储'} />
        </Rect>
        <Rect ref={catQueue} position={[280, -100]} width={400} height={120} radius={16} fill={T.card} stroke={T.green} lineWidth={2}>
          <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'消息队列'} />
        </Rect>
        <Rect ref={redisTag} position={[-280, 40]} width={200} height={70} radius={35} fill={T.card} stroke={T.yellow} lineWidth={3} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'Redis'} />
        </Rect>
        <Rect ref={kafkaTag} position={[280, 40]} width={200} height={70} radius={35} fill={T.card} stroke={T.yellow} lineWidth={3} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'Kafka'} />
        </Rect>
        <Rect ref={durableBadge} position={[280, 140]} width={260} height={60} radius={12} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} text={'数据库式持久保证'} />
        </Rect>
      </Node>

      {/* b17：大任务切成五块，分给五个构件，应用代码连线缝合 */}
      <Node ref={g17} opacity={0}>
        <Rect ref={taskBlock} position={[0, -180]} width={520} height={110} radius={16} fill={T.card} stroke={T.yellow} lineWidth={3}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.white} fontFamily={FONT.sans} text={'一个大任务'} />
        </Rect>
        {[0, 1, 2, 3, 4].map(i => (
          <Rect
            key={`u1-piece-${i}`}
            ref={pieces[i]}
            position={[0, -180]}
            width={160}
            height={80}
            radius={12}
            fill={T.card}
            stroke={T.blue}
            lineWidth={2}
            opacity={0}
          >
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={['数据库', '缓存', '搜索', '流处理', '批处理'][i]} />
          </Rect>
        ))}
        <Line ref={stitch} points={[[-460, 60], [460, 60]]} stroke={T.green} lineWidth={3} opacity={0} />
        <Txt position={[0, 110]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'应用代码缝起来'} />
      </Node>

      {/* b18/b19：主库 + Memcached + Elasticsearch/Solr，同步箭头 */}
      <Node ref={g18} opacity={0}>
        <Rect ref={mainDb} position={[0, -140]} width={280} height={130} radius={14} fill={T.card} stroke={T.blue} lineWidth={3}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'主数据库'} />
        </Rect>
        <Rect ref={memBox} position={[-360, 60]} width={300} height={110} radius={14} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'Memcached'} />
          <Txt position={[0, 32]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'缓存层'} />
        </Rect>
        <Rect ref={esBox} position={[360, 60]} width={300} height={110} radius={14} fill={T.card} stroke={T.yellow} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'Elasticsearch'} />
          <Txt position={[0, 32]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'全文搜索 · Solr'} />
        </Rect>
        <Line ref={syncA} points={[[-140, -90], [-260, 10]]} stroke={T.green} lineWidth={3} endArrow opacity={0} />
        <Line ref={syncB} points={[[140, -90], [260, 10]]} stroke={T.green} lineWidth={3} endArrow opacity={0} />
        <Txt ref={checkA} position={[-300, -40]} fontSize={SIZE.body} fontWeight={700} fill={T.green} fontFamily={FONT.sans} opacity={0} text={'✓ 同步'} />
        <Txt ref={checkB} position={[300, -40]} fontSize={SIZE.body} fontWeight={700} fill={T.green} fontFamily={FONT.sans} opacity={0} text={'✓ 同步'} />
        <Txt position={[0, 180]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'都独立于主库'} />
      </Node>
    </>,
  );

  // b12：五个都是成功的抽象——拼成工具箱，工程师直接拿起来用
  say('成功的抽象');
  yield* beat(
    'b12',
    all(
      g12().opacity(1, 0.6),
      toolIcons[0]().opacity(1, 0.6),
      toolIcons[1]().opacity(1, 1.0),
      toolIcons[2]().opacity(1, 1.4),
      toolIcons[3]().opacity(1, 1.8),
      toolIcons[4]().opacity(1, 2.2),
      toolbox().opacity(1, 3.0),
      engineer().opacity(1, 3.4),
    ),
  );

  // b13：没人会从零写存储引擎——放下图纸，拿起现成的数据库工具
  // r2：sequence(0) 是重叠跑不是串行，改 chain
  say('不用从零写');
  yield* beat(
    'b13',
    chain(
      all(g12().opacity(0, 0.5), blueprint().opacity(1, 0.6)),
      all(blueprint().opacity(0.35, 1.2), dbTool().opacity(1, 1.2), dbTool().position([280, -100], 2.5)),
    ),
  );

  // b14：现实没那么简单——数据库特性各不相同，缓存、搜索索引做法也各不一样；拼起来并不容易
  // r2 #2：旁白补后半句；三形态错峰拉开、末尾拼合处问号亮起（占满 lengthened 10.86s 拍）
  say('需求不同，工具不同');
  yield* beat(
    'b14',
    all(
      blueprint().opacity(0, 0.5),
      dbTool().opacity(0, 0.5),
      g14().opacity(1, 0.6),
      variants[0]().opacity(1, 2.5),
      variants[1]().opacity(1, 5.0),
      variants[2]().opacity(1, 7.5),
      delay(8.5, stitchQ().opacity(1, 1.0)),
    ),
  );

  // b15a：数据库和消息队列，表面看都是存一阵子数据——两个相似的盒子并排
  say('看着像');
  yield* beat('b15a', all(g14().opacity(0, 0.5), g15().opacity(1, 0.6), boxA().opacity(1, 1.0), boxB().opacity(1, 1.0)));

  // b15b：访问模式不同，性能就不同，实现也不同——内部箭头一个随机、一个顺序
  say('用着不一样');
  yield* beat(
    'b15b',
    all(
      zig1().opacity(1, 1.0),
      zig2().opacity(1, 2.0),
      flowB().opacity(1, 2.5),
    ),
  );

  // b16a1：类别边界还在变模糊——两个分类框出现
  say('边界在变模糊');
  yield* beat('b16a1', all(g15().opacity(0, 0.5), g16().opacity(1, 0.6)));

  // b16a2：Redis 本来是数据存储，也被拿来当消息队列用——标签越界滑过去
  say('Redis 也当队列用');
  yield* beat(
    'b16a2',
    all(
      redisTag().opacity(1, 0.5),
      redisTag().position([280, 40], 3.0),
    ),
  );

  // b16b1：再比如 Kafka，本来是消息队列——标签落在队列框里
  say('Kafka 本来是队列');
  yield* beat('b16b1', all(kafkaTag().opacity(1, 0.6), kafkaTag().position([280, 60], 2.5)));

  // b16b2：却有数据库一样的持久保证——持久保证徽章亮起
  say('却有持久保证');
  yield* beat('b16b2', all(durableBadge().opacity(1, 0.8), kafkaTag().stroke(T.green, 1.5)));

  // b17：一个工具包打不了天下——切开，分给最擅长的工具，应用代码缝起来
  // r2：sequence(0) 是重叠跑不是串行，改 chain
  say('拆开，再缝起来');
  yield* beat(
    'b17',
    chain(
      all(g16().opacity(0, 0.5), g17().opacity(1, 0.6)),
      all(
        pieces[0]().opacity(1, 0.8),
        pieces[1]().opacity(1, 1.2),
        pieces[2]().opacity(1, 1.6),
        pieces[3]().opacity(1, 2.0),
        pieces[4]().opacity(1, 2.4),
        pieces[0]().position([-440, -20], 4.5),
        pieces[1]().position([-220, -20], 4.5),
        pieces[2]().position([0, -20], 4.5),
        pieces[3]().position([220, -20], 4.5),
        pieces[4]().position([440, -20], 4.5),
      ),
      all(stitch().opacity(1, 2.0), taskBlock().opacity(0.4, 2.0)),
    ),
  );

  // b18：缓存层用 Memcached，全文搜索用 Elasticsearch 或 Solr，都独立于主库
  say('Memcached · 搜索');
  yield* beat(
    'b18',
    all(
      g17().opacity(0, 0.5),
      g18().opacity(1, 0.6),
      memBox().opacity(1, 2.0),
      esBox().opacity(1, 3.0),
    ),
  );

  // b19：保持缓存和索引跟主库同步，是应用代码的责任——同步箭头亮起
  // r2：sequence(0) 是重叠跑不是串行，改 chain（主库先变蓝再恢复，两支箭头依次亮）
  say('同步是应用代码的事');
  yield* beat(
    'b19',
    chain(
      all(mainDb().fill(T.blue, 1.0), syncA().opacity(1, 1.5)),
      all(syncB().opacity(1, 1.5), checkA().opacity(1, 1.0)),
      all(checkB().opacity(1, 1.0), mainDb().fill(T.card, 3.0)),
    ),
  );
});
