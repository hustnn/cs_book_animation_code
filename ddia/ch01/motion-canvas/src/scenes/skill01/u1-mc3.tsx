// U1 场景 3（MC）：b20–b26 —— Figure 1-1 按原图复现：API 藏起实现细节，五条流向依次走，拼出新系统、给保证、你也是设计者。
// 分镜：skill-ch01/ch01-beats.md U1 一节；原文：DDIA §1.1（书页 p4–5，PDF p26–27），Figure 1-1 在 PDF p27。
// 原图要素：顶部客户 → API 横杠 → 虚线框内：应用代码（上）、内存缓存（左）、主数据库（中）、全文索引（中右）、
// 消息队列（右）、应用代码（下）；变更捕获 → 失效/更新缓存、推给搜索索引；异步任务 → 消息队列 → 应用代码 → 发邮件 → 外部世界。
// 时长全部来自 timeline/u1.json（beat() 驱动），不手写 waitFor 魔法数字。
// 颜色、字号、安全区一律取自 lib/theme，不手写十六进制色值。
import {attach} from '../../lib/layout';
import {Circle, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, chain, createRef} from '@motion-canvas/core';
import {makeBeats} from '../../lib/beats';
import {FONT, SAFE, SIZE, T} from '../../lib/theme';
import timeline from '../../timeline/u1.json';

export default makeScene2D(function* (view) {
  view.fill(T.bg);
  const beat = makeBeats(timeline);

  const header = createRef<Txt>();
  const anchor = createRef<Txt>();
  const fig = createRef<Node>();
  const dashedBox = createRef<Rect>();
  const client = createRef<Node>();
  const apiBar = createRef<Rect>();
  const appTop = createRef<Rect>();
  const cache = createRef<Rect>();
  const primDb = createRef<Rect>();
  const index = createRef<Rect>();
  const queue = createRef<Rect>();
  const appBottom = createRef<Rect>();
  const appRight = createRef<Rect>();
  const outside = createRef<Txt>();
  const readArrow = createRef<Line>();
  const readDot = createRef<Circle>();
  const hitTag = createRef<Txt>();
  const writeArrow = createRef<Line>();
  const writeDot = createRef<Circle>();
  const captureArrow = createRef<Line>();
  const invalidArrow = createRef<Line>();
  const updateArrow = createRef<Line>();
  const invalidTag = createRef<Txt>();
  const updateTag = createRef<Txt>();
  const searchArrow = createRef<Line>();
  const searchDot = createRef<Circle>();
  const searchTag = createRef<Txt>();
  const asyncArrow = createRef<Line>();
  const asyncDot = createRef<Circle>();
  const queueArrow = createRef<Line>();
  const mailDot = createRef<Circle>();
  const mailOut = createRef<Line>();
  const mailTag = createRef<Txt>();
  const stamp = createRef<Node>();
  const designer = createRef<Node>();
  const hat = createRef<Rect>();

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

      {/* Figure 1-1：虚线框 + API 横杠 + 六个构件（各构件初始隐藏，b20 错峰出现） */}
      <Node ref={fig} opacity={0}>
        <Node ref={client} opacity={0}>
          <Circle position={[0, -292]} width={26} height={26} fill={T.text} />
          <Line points={[[0, -279], [0, -250]]} stroke={T.text} lineWidth={3} />
          <Txt position={[60, -268]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'客户'} />
        </Node>
        <Rect ref={apiBar} position={[0, -232]} width={220} height={16} radius={4} fill={T.text} opacity={0} />
        <Txt position={[-160, -232]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'API'} />
        <Rect ref={dashedBox} position={[0, 5]} width={1040} height={400} radius={8} fill={T.card} stroke={T.line} lineWidth={2} lineDash={[10, 8]} opacity={0} />
        <Rect ref={appTop} position={[0, -135]} width={280} height={56} radius={10} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'应用代码'} />
        </Rect>
        <Rect ref={cache} position={[-380, -120]} width={170} height={100} radius={12} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'内存缓存'} />
        </Rect>
        <Rect ref={primDb} position={[-120, 0]} width={170} height={100} radius={12} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'主数据库'} />
        </Rect>
        <Rect ref={index} position={[150, 0]} width={170} height={100} radius={12} fill={T.card} stroke={T.yellow} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'全文索引'} />
        </Rect>
        <Rect ref={queue} position={[390, -40]} width={150} height={110} radius={12} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'消息队列'} />
        </Rect>
        <Rect ref={appBottom} position={[-120, 150]} width={280} height={56} radius={10} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'应用代码'} />
        </Rect>
        <Rect ref={appRight} position={[390, 95]} width={200} height={56} radius={10} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'应用代码'} />
        </Rect>
        <Txt ref={outside} position={[390, 235]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} opacity={0} text={'“外部世界”'} />

        {/* 五条流向的箭头与小点（初始隐藏） */}
        <Line ref={readArrow} points={[[-140, -135], [-280, -135]]} stroke={T.green} lineWidth={3} endArrow opacity={0} />
        <Circle ref={readDot} position={[-140, -135]} width={22} height={22} fill={T.green} opacity={0} />
        <Txt ref={hitTag} fontSize={SIZE.min} fill={T.green} fontFamily={FONT.sans} opacity={0} text={'命中 ✓ 直接回'} />
        <Line ref={writeArrow} points={[[-60, -107], [-100, -50]]} stroke={T.blue} lineWidth={3} endArrow opacity={0} />
        <Circle ref={writeDot} position={[-60, -107]} width={22} height={22} fill={T.blue} opacity={0} />
        <Line ref={captureArrow} points={[[-120, 50], [-120, 122]]} stroke={T.yellow} lineWidth={3} endArrow opacity={0} />
        <Line ref={invalidArrow} points={[[-260, 150], [-360, 100], [-380, -60]]} stroke={T.yellow} lineWidth={3} endArrow opacity={0} />
        <Line ref={updateArrow} points={[[20, 150], [100, 100], [130, 50]]} stroke={T.yellow} lineWidth={3} endArrow opacity={0} />
        {/* r3：invalidTag 原 [-400, 60] 被 invalidArrow 竖段穿字、updateTag 原 [60, 110] 被 updateArrow 斜段穿字——各移开箭头路径。 */}
        <Txt ref={invalidTag} position={[-400, 130]} fontSize={SIZE.min} fill={T.yellow} fontFamily={FONT.sans} opacity={0} text={'失效 / 更新缓存'} />
        <Txt ref={updateTag} position={[-40, 95]} fontSize={SIZE.min} fill={T.yellow} fontFamily={FONT.sans} opacity={0} text={'推给搜索索引'} />
        {/* r2 #1：搜索读流——原图 "Search requests"：应用代码 → 全文索引，结果沿原路回来 */}
        <Line ref={searchArrow} points={[[120, -107], [150, -50]]} stroke={T.green} lineWidth={3} endArrow opacity={0} />
        <Circle ref={searchDot} position={[120, -107]} width={22} height={22} fill={T.green} opacity={0} />
        <Txt ref={searchTag} position={[250, -85]} fontSize={SIZE.min} fill={T.green} fontFamily={FONT.sans} opacity={0} text={'搜索请求'} />
        <Line ref={asyncArrow} points={[[140, -135], [300, -135], [390, -95]]} stroke={T.green} lineWidth={3} endArrow opacity={0} />
        <Circle ref={asyncDot} position={[140, -135]} width={22} height={22} fill={T.green} opacity={0} />
        <Line ref={queueArrow} points={[[390, 15], [390, 60]]} stroke={T.green} lineWidth={3} endArrow opacity={0} />
        <Circle ref={mailDot} position={[390, 60]} width={22} height={22} fill={T.yellow} opacity={0} />
        <Line ref={mailOut} points={[[390, 123], [390, 210]]} stroke={T.yellow} lineWidth={3} endArrow opacity={0} />
        <Txt ref={mailTag} fontSize={SIZE.min} fill={T.yellow} fontFamily={FONT.sans} opacity={0} text={'发邮件'} />
      </Node>

      {/* b25b：一致结果印章（r2 #8：原 [0, -40] 340×100 盖住主数据库标签，移到右上空白处） */}
      <Node ref={stamp} position={[330, -140]} rotation={-8} opacity={0}>
        <Rect width={260} height={76} radius={12} fill={T.card} stroke={T.green} lineWidth={4}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'一致结果 ✓'} />
        </Rect>
      </Node>

      {/* b26：工程师 + 设计者帽子 */}
      <Node ref={designer} position={[0, 0]} opacity={0}>
        <Circle position={[0, -120]} width={80} height={80} fill={T.blue} />
        <Rect position={[0, -20]} width={130} height={110} radius={16} fill={T.card} stroke={T.line} lineWidth={2} />
        <Txt position={[0, -20]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'工程师'} />
        <Rect ref={hat} position={[0, -190]} width={200} height={56} radius={12} fill={T.card} stroke={T.yellow} lineWidth={3} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.sans} text={'设计者'} />
        </Rect>
      </Node>
    </>,
  );

  // QA r4（类 E）：“命中 ✓ 直接回”原在 y=-190，正压在虚线容器的上边框（-195）上；“发邮件”贴着容器右边。
  // 改为挂在它们说明的对象旁边：命中标签在缓存框下方，发邮件标签在出站箭头右侧
  attach(hitTag(), cache(), 'bottom', 8);
  attach(mailTag(), mailOut(), 'right', 10);

  // b20：Figure 1-1——客户只看到一个 API，里面的拼法全被藏起来了
  say('API 藏起实现细节');
  yield* beat(
    'b20',
    all(
      fig().opacity(1, 0.6),
      client().opacity(1, 1.0),
      dashedBox().opacity(0.9, 1.0),
      apiBar().opacity(1, 1.5),
      appTop().opacity(1, 2.0),
      cache().opacity(1, 2.5),
      primDb().opacity(1, 3.0),
      index().opacity(1, 3.5),
      queue().opacity(1, 4.0),
      appBottom().opacity(1, 4.5),
      appRight().opacity(1, 5.0),
      outside().opacity(1, 5.5),
    ),
  );

  // b21：读请求先查内存缓存，命中了就直接回（小点去缓存、回应用代码、再回客户）
  // r2：sequence(0) 是重叠跑不是串行，改 chain
  say('读先查缓存');
  yield* beat(
    'b21',
    chain(
      all(readArrow().opacity(1, 1.0), readDot().opacity(1, 0.5), readDot().position([-280, -135], 1.5)),
      all(cache().stroke(T.green, 1.0), hitTag().opacity(1, 1.0)),
      all(readDot().position([-140, -135], 1.2)),
      all(readDot().position([0, -200], 1.2)),
    ),
  );

  // b22：缓存没命中，或者要写，就走主数据库
  say('未命中走主库');
  yield* beat(
    'b22',
    all(
      readArrow().opacity(0.25, 0.8),
      hitTag().opacity(0, 0.5),
      cache().stroke(T.blue, 0.8),
      writeArrow().opacity(1, 1.0),
      writeDot().opacity(1, 0.5),
      writeDot().position([-100, -50], 2.0),
      primDb().stroke(T.green, 2.0),
    ),
  );

  // b23：数据一变，失效或者更新缓存，再把更新推给搜索索引
  // r2：sequence(0) 是重叠跑不是串行，改 chain
  say('变更 → 失效 / 更新');
  yield* beat(
    'b23',
    chain(
      all(captureArrow().opacity(1, 1.2), primDb().stroke(T.blue, 1.2)),
      all(invalidArrow().opacity(1, 1.5), invalidTag().opacity(1, 1.0), cache().stroke(T.yellow, 1.5)),
      all(updateArrow().opacity(1, 1.5), updateTag().opacity(1, 1.0), index().stroke(T.green, 1.5)),
    ),
  );

  // b23b（r2 #1 新增）：搜索请求直接去问全文索引，查到结果再回来（原图 "Search requests" 走应用代码 → 全文索引）
  say('搜索走索引');
  yield* beat(
    'b23b',
    chain(
      all(searchArrow().opacity(1, 1.0), searchDot().opacity(1, 0.5), searchTag().opacity(1, 1.0), index().stroke(T.green, 1.0)),
      all(searchDot().position([150, -50], 1.2)),
      all(searchDot().position([120, -107], 1.2)),
    ),
  );

  // b24：异步任务走消息队列，交给另一段应用代码，比如发一封邮件给外面的人
  // r2：sequence(0) 是重叠跑不是串行，改 chain
  // r3：黄点原先穿过 appRight 框心、盖住「应用代码」的「用」字（P1）——改在框顶边停住淡出、框底边再亮起，穿框过程不可见，不再压字。
  say('异步任务 → 发邮件');
  yield* beat(
    'b24',
    chain(
      all(asyncArrow().opacity(1, 1.2), asyncDot().opacity(1, 0.5), asyncDot().position([390, -95], 2.0)),
      all(queueArrow().opacity(1, 1.0), appRight().stroke(T.green, 1.0), mailDot().opacity(1, 0.5), mailDot().position([390, 67], 1.0)),
      chain(mailDot().opacity(0, 0.4), mailDot().position([390, 123], 0.3)),
      all(mailOut().opacity(1, 1.2), mailDot().opacity(1, 0.4), mailDot().position([390, 205], 1.6), mailTag().opacity(1, 1.0), outside().fill(T.yellow, 1.5)),
    ),
  );

  // b25a：这样拼出来的，是一个新的专用数据系统——虚线框收拢成一个整体
  say('拼出新系统');
  yield* beat(
    'b25a',
    all(
      invalidArrow().opacity(0.25, 0.8),
      updateArrow().opacity(0.25, 0.8),
      asyncArrow().opacity(0.25, 0.8),
      searchArrow().opacity(0.25, 0.8),
      searchTag().opacity(0.25, 0.8),
      dashedBox().stroke(T.green, 2.0),
      dashedBox().width(980, 2.5),
    ),
  );

  // b25b：它还能给保证——写的时候缓存一定被正确处理，客户看到的结果是一致的
  say('客户看到一致结果');
  yield* beat('b25b', all(stamp().opacity(1, 1.0), stamp().rotation(-4, 3.0), stamp().position([330, -150], 4.5)));

  // b26：到这里，你就不只是应用开发者了，你也是数据系统设计者
  say('你也是设计者');
  yield* beat(
    'b26',
    all(
      fig().opacity(0, 0.5),
      stamp().opacity(0, 0.5),
      designer().opacity(1, 0.6),
      hat().opacity(1, 1.5),
      hat().position([0, -175], 3.0),
    ),
  );
});
