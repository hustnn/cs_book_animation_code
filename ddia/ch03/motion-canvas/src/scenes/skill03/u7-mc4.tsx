// U7 场景 4（MC）：g36–g40 —— Memcached 只做缓存、内存数据库持久性的四种办法、
// 文档分类与机器学习、产品串（VoltDB / MemSQL / Oracle TimesTen / RAMCloud / Redis / Couchbase）、
// 快不是因为不读盘（操作系统缓存、省了编码开销）、磁盘索引难做的数据模型（Redis 优先队列与集合）、
// 非易失性内存、回扣（三条岔路）。
// 分镜：skill-ch03/beats-u7.md；原文：DDIA §3.6 后半（书页 p89–90）。
// 时长全部来自 timeline/u7.json（beat() 驱动），不手写 waitFor。
import {Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, chain, createRef} from '@motion-canvas/core';
import {at, makeBeats} from '../../lib/beats';
import {FONT, SAFE, SIZE, T} from '../../lib/theme';
import timeline from '../../timeline/u7.json';

export default makeScene2D(function* (view) {
  view.fill(T.bg);
  const beat = makeBeats(timeline);

  const header = createRef<Txt>();
  const anchor = createRef<Txt>();
  const say = (text: string) => anchor().text(text);

  // g36/g36b：Memcached 只做缓存
  const memcG = createRef<Node>();
  const memcPlate = createRef<Rect>();
  const cacheChips = [0, 1, 2].map(() => createRef<Rect>());
  const restartBtn2 = createRef<Rect>();
  const okTick = createRef<Txt>();
  const okLab = createRef<Txt>();

  // g36c：四种办法
  const methG = createRef<Node>();
  const methCards = [0, 1, 2, 3].map(() => createRef<Rect>());

  // g36d：文档分类 / 机器学习
  const docG = createRef<Node>();
  const docCard = createRef<Rect>();
  const mlCard = createRef<Rect>();

  // g37–g37c：产品串
  const prodG = createRef<Node>();
  const voltPlate = createRef<Rect>();
  const memsqlPlate = createRef<Rect>();
  const ttPlate = createRef<Rect>();
  const relTag = createRef<Rect>();
  const ramPlate = createRef<Rect>();
  const redisPlate = createRef<Rect>();
  const couchPlate = createRef<Rect>();
  const weakTag = createRef<Rect>();
  // r4 C2：厂商 claim 标签、RAMCloud 日志结构标签
  const claimTag = createRef<Rect>();
  const ramLogTxt = createRef<Txt>();

  // g37d：不用读磁盘（打叉）
  const noDiskG = createRef<Node>();
  const noDiskX = createRef<Txt>();

  // g38/g38b：磁盘引擎 + 操作系统缓存
  const engG = createRef<Node>();
  const engBox = createRef<Rect>();
  const cacheBox = createRef<Rect>();
  const blkRefs = [0, 1, 2].map(() => createRef<Rect>());
  const readArrow = createRef<Line>();

  // g38c/g38d：编码开销
  const costG = createRef<Node>();
  const costCard = createRef<Rect>();
  const costX = createRef<Txt>();
  const speedBar = createRef<Rect>();
  const speedLab = createRef<Txt>();
  const stepEncode = createRef<Rect>();
  const stepDisk = createRef<Rect>();
  const stepDecode = createRef<Rect>();
  const skipArrow = createRef<Line>();
  const skipLab = createRef<Txt>();

  // g38e–g38g：Redis 数据模型
  const modelG = createRef<Node>();
  const diskIdxCard = createRef<Rect>();
  const diskIdxX = createRef<Txt>();
  const redisPlate2 = createRef<Rect>();
  const queueCard = createRef<Rect>();
  const setCard = createRef<Rect>();
  const memBar = createRef<Rect>();
  const simpleTag = createRef<Txt>();

  // g39：非易失性内存
  const nvmG = createRef<Node>();
  const nvmLab = createRef<Txt>();
  const nvmTag = createRef<Txt>();

  // g40：三条岔路
  const forkG = createRef<Node>();
  const forkDim = createRef<Rect>();
  const forkSim = createRef<Rect>();
  const forkMem = createRef<Rect>();
  const closeLine = createRef<Txt>();

  view.add(
    <>
      <Txt
        ref={header}
        position={[-SAFE.halfW, -SAFE.halfH]}
        offset={[-1, -1]}
        fontSize={SIZE.label}
        fill={T.muted}
        fontFamily={FONT.sans}
        text={'超出键值查找：多维、模糊与内存'}
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

      {/* g36：Memcached 只做缓存 */}
      <Node ref={memcG} opacity={0}>
        <Rect ref={memcPlate} position={[-280, -140]} width={360} height={100} radius={14} fill={T.card} stroke={T.purple} lineWidth={2}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.purple} fontFamily={FONT.mono} text={'Memcached'} />
        </Rect>
        <Rect position={[-280, 40]} width={460} height={160} radius={16} fill={T.card} stroke={T.blue} lineWidth={3} />
        <Txt position={[-480, -60]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'缓存'} />
        {[0, 1, 2].map(i => (
          <Rect key={`cc-${i}`} ref={cacheChips[i]} position={[-400 + i * 120, 40]} width={100} height={60} fill={T.blue} opacity={0} />
        ))}
        <Rect ref={restartBtn2} position={[300, -140]} width={200} height={80} radius={14} fill={T.card} stroke={T.yellow} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'重启'} />
        </Rect>
        <Txt ref={okTick} position={[300, 40]} fontSize={48} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'✓'} opacity={0} />
        <Txt ref={okLab} position={[300, 110]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'丢了也行'} opacity={0} />
      </Node>

      {/* g36c：四种办法 */}
      <Node ref={methG} opacity={0}>
        {[
          ['特殊硬件', '电池供电的内存'],
          ['变更日志', '写到磁盘'],
          ['定期快照', '存到磁盘'],
          ['复制到别的机器', '搬到别的机器'],
        ].map(([t, s], i) => (
          <Rect
            key={`mc-${i}`}
            ref={methCards[i]}
            position={[-450 + i * 300, -60]}
            width={260}
            height={130}
            radius={14}
            fill={T.card}
            stroke={T.blue}
            lineWidth={2}
            opacity={0}
          >
            <Txt position={[0, -28]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={t} />
            <Txt position={[0, 28]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={s} />
          </Rect>
        ))}
      </Node>

      {/* g36d：文档分类 / 机器学习 */}
      <Node ref={docG} opacity={0}>
        <Rect ref={docCard} position={[-200, -60]} width={320} height={130} radius={14} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'文档分类'} />
        </Rect>
        <Rect ref={mlCard} position={[200, -60]} width={320} height={130} radius={14} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'机器学习'} />
        </Rect>
      </Node>

      {/* g37–g37c：产品串 */}
      <Node ref={prodG} opacity={0}>
        <Rect ref={voltPlate} position={[-360, -120]} width={300} height={100} radius={14} fill={T.card} stroke={T.purple} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.purple} fontFamily={FONT.mono} text={'VoltDB'} />
        </Rect>
        <Rect ref={memsqlPlate} position={[0, -120]} width={300} height={100} radius={14} fill={T.card} stroke={T.purple} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.purple} fontFamily={FONT.mono} text={'MemSQL'} />
        </Rect>
        <Rect ref={ttPlate} position={[360, -120]} width={300} height={100} radius={14} fill={T.card} stroke={T.purple} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.purple} fontFamily={FONT.mono} text={'Oracle TimesTen'} />
        </Rect>
        <Rect ref={relTag} position={[0, -230]} width={360} height={60} radius={14} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'带关系模型'} />
        </Rect>
        {/* r4 C2：厂商 claim（注明是厂商说法） */}
        <Rect ref={claimTag} position={[0, 230]} width={560} height={60} radius={14} fill={T.card} stroke={T.yellow} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'厂商说：去掉磁盘结构开销，性能大提升'} />
        </Rect>
        <Rect ref={ramPlate} position={[-360, 40]} width={300} height={100} radius={14} fill={T.card} stroke={T.purple} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.purple} fontFamily={FONT.mono} text={'RAMCloud'} />
        </Rect>
        {/* r4 C2：内存和磁盘上的数据都用日志结构方法 */}
        <Txt ref={ramLogTxt} position={[-360, 115]} fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.sans} text={'内存和磁盘都用日志结构'} opacity={0} />
        <Rect ref={redisPlate} position={[0, 40]} width={300} height={100} radius={14} fill={T.card} stroke={T.purple} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.purple} fontFamily={FONT.mono} text={'Redis'} />
        </Rect>
        <Rect ref={couchPlate} position={[360, 40]} width={300} height={100} radius={14} fill={T.card} stroke={T.purple} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.purple} fontFamily={FONT.mono} text={'Couchbase'} />
        </Rect>
        <Rect ref={weakTag} position={[0, 160]} width={360} height={60} radius={14} fill={T.card} stroke={T.yellow} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'异步写磁盘，只提供弱持久性'} />
        </Rect>
      </Node>

      {/* g37d：不用读磁盘（打叉） */}
      <Node ref={noDiskG} opacity={0}>
        <Rect position={[0, -60]} width={460} height={120} radius={16} fill={T.card} stroke={T.red} lineWidth={3} />
        <Txt position={[0, -60]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'不用读磁盘'} />
        <Txt key="qa-ignore-打叉-不用读磁盘" ref={noDiskX} position={[0, -60]} fontSize={96} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'✗'} opacity={0} />
      </Node>

      {/* g38/g38b：磁盘引擎 + 操作系统缓存 */}
      <Node ref={engG} opacity={0}>
        <Rect ref={engBox} position={[-280, -60]} width={380} height={180} radius={16} fill={T.card} stroke={T.red} lineWidth={3} opacity={0}>
          <Txt position={[0, -50]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'磁盘存储引擎'} />
        </Rect>
        <Rect ref={cacheBox} position={[280, -60]} width={380} height={180} radius={16} fill={T.card} stroke={T.green} lineWidth={3} opacity={0}>
          <Txt position={[0, -50]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'操作系统缓存'} />
        </Rect>
        {[0, 1, 2].map(i => (
          <Rect
            key={`eb-${i}`}
            ref={blkRefs[i]}
            position={[-340 + i * 90, -20]}
            width={70}
            height={50}
            fill={T.blue}
            opacity={0}
          />
        ))}
        <Line ref={readArrow} points={[[470, 80], [280, 80]]} stroke={T.green} lineWidth={3} endArrow end={0} />
        <Txt position={[375, 120]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} text={'读只进缓存'} />
      </Node>

      {/* g38c/g38d：编码开销 */}
      <Node ref={costG} opacity={0}>
        <Rect ref={costCard} position={[0, -140]} width={400} height={110} radius={14} fill={T.card} stroke={T.red} lineWidth={3} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'编码开销'} />
        </Rect>
        <Txt key="qa-ignore-打叉-编码开销" ref={costX} position={[0, -140]} fontSize={72} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'✗'} opacity={0} />
        <Rect ref={speedBar} position={[-160, -20]} width={200} height={40} radius={20} fill={T.green} opacity={0} />
        <Txt ref={speedLab} position={[-160, 40]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'省了这一步，更快'} opacity={0} />
        <Rect ref={stepEncode} position={[-360, -140]} width={260} height={100} radius={14} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'编码'} />
        </Rect>
        <Rect ref={stepDisk} position={[0, -140]} width={260} height={100} radius={14} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'落盘'} />
        </Rect>
        <Rect ref={stepDecode} position={[360, -140]} width={260} height={100} radius={14} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'解码'} />
        </Rect>
        <Line ref={skipArrow} points={[[-490, 60], [490, 60]]} stroke={T.green} lineWidth={4} endArrow end={0} />
        <Txt ref={skipLab} position={[0, 110]} fontSize={SIZE.body} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'内存数据库：跳过这一步'} opacity={0} />
      </Node>

      {/* g38e–g38g：Redis 数据模型 */}
      <Node ref={modelG} opacity={0}>
        <Rect ref={diskIdxCard} position={[-280, -60]} width={360} height={140} radius={14} fill={T.card} stroke={T.red} lineWidth={3} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'磁盘索引'} />
        </Rect>
        <Txt key="qa-ignore-打叉-磁盘索引" ref={diskIdxX} position={[-280, -60]} fontSize={72} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'✗'} opacity={0} />
        <Rect ref={redisPlate2} position={[280, -60]} width={320} height={140} radius={14} fill={T.card} stroke={T.purple} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.purple} fontFamily={FONT.mono} text={'Redis'} />
        </Rect>
        <Rect ref={queueCard} position={[-200, -60]} width={300} height={120} radius={14} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'优先队列'} />
        </Rect>
        <Rect ref={setCard} position={[200, -60]} width={300} height={120} radius={14} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'集合'} />
        </Rect>
        <Rect ref={memBar} position={[0, -60]} width={500} height={110} radius={14} fill={T.card} stroke={T.green} lineWidth={3} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'内存条：数据全在内存里'} />
        </Rect>
        <Txt ref={simpleTag} position={[0, 60]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} text={'实现相对简单'} opacity={0} />
      </Node>

      {/* g39：非易失性内存 */}
      <Node ref={nvmG} opacity={0}>
        <Rect position={[0, -60]} width={460} height={130} radius={16} fill={T.card} stroke={T.purple} lineWidth={3} />
        <Txt position={[0, -90]} fontSize={SIZE.body} fontWeight={700} fill={T.purple} fontFamily={FONT.mono} text={'非易失性内存'} />
        {/* r4 fix：NVM 缩写先藏起，随“更广泛地采用”出现，给 g39 长拍加一步动作 */}
        <Txt ref={nvmLab} position={[0, -30]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'NVM'} opacity={0} />
        <Txt ref={nvmTag} position={[0, 80]} fontSize={SIZE.body} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'★ 新领域，值得关注'} opacity={0} />
      </Node>

      {/* g40：三条岔路 */}
      <Node ref={forkG} opacity={0}>
        <Rect ref={forkDim} position={[-360, -60]} width={280} height={120} radius={14} fill={T.card} stroke={T.blue} lineWidth={3} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'维度'} />
        </Rect>
        <Rect ref={forkSim} position={[0, -60]} width={280} height={120} radius={14} fill={T.card} stroke={T.yellow} lineWidth={3} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'相似度'} />
        </Rect>
        <Rect ref={forkMem} position={[360, -60]} width={280} height={120} radius={14} fill={T.card} stroke={T.green} lineWidth={3} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'内存'} />
        </Rect>
        <Txt ref={closeLine} position={[0, 120]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'索引的形状跟着问题走'} opacity={0} />
      </Node>
    </>
  );

  say('只做缓存');
  yield* beat('g36',
    all(memcG().opacity(1, 0.5)),
    at('只用来做缓存', all(...cacheChips.map(c => c().opacity(1, 0.4)))),
    at('Memcached', memcPlate().stroke(T.yellow, 0.4)),
  );

  say('丢了也行');
  yield* beat('g36b',
    all(restartBtn2().opacity(1, 0.5)),
    at('重启', all(...cacheChips.map(c => c().opacity(0.15, 0.5)))),
    at('也能接受', all(okTick().opacity(1, 0.4), okLab().opacity(1, 0.4))),
  );

  say('四种办法');
  yield* beat('g36c',
    all(memcG().opacity(0, 0.5), methG().opacity(1, 0.5), ...methCards.map(c => c().opacity(1, 0.5))),
    at('四种办法', chain(
      all(...methCards.map(c => c().scale(1.04, 0.25))),
      all(...methCards.map(c => c().scale(1, 0.25))),
    )),
    at('特殊硬件', all(methCards[0]().stroke(T.yellow, 0.4), methCards[0]().lineWidth(4, 0.4))),
    at('变更日志', all(methCards[1]().stroke(T.yellow, 0.4), methCards[1]().lineWidth(4, 0.4))),
    at('定期快照', all(methCards[2]().stroke(T.yellow, 0.4), methCards[2]().lineWidth(4, 0.4))),
    at('复制到别的机器', all(methCards[3]().stroke(T.yellow, 0.4), methCards[3]().lineWidth(4, 0.4))),
  );

  say('分类、机器学习方向');
  yield* beat('g36d',
    all(methG().opacity(0, 0.5), docG().opacity(1, 0.5), docCard().opacity(1, 0.5), mlCard().opacity(1, 0.5)),
    at('文档分类', all(docCard().stroke(T.yellow, 0.4), docCard().lineWidth(4, 0.4))),
    at('机器学习', all(mlCard().stroke(T.yellow, 0.4), mlCard().lineWidth(4, 0.4))),
  );

  say('VoltDB、MemSQL、TimesTen');
  yield* beat('g37',
    all(docG().opacity(0, 0.5), prodG().opacity(1, 0.5)),
    at('VoltDB', voltPlate().opacity(1, 0.4)),
    at('MemSQL', memsqlPlate().opacity(1, 0.4)),
    at('Oracle TimesTen', ttPlate().opacity(1, 0.4)),
  );

  say('带关系模型');
  yield* beat('g37a',
    at('带关系模型', relTag().opacity(1, 0.4)),
    // r4 C2：厂商 claim，注明是厂商说法
    at('厂商说', claimTag().opacity(1, 0.4)),
    // r4 fix：g37a 首渲 idle 6.31s error——claimTag 进场后旁白还剩约 6s 无动作；
    // 在收尾句上给 claimTag 一个轻脉冲，把静止段切成 <3s
    at('能带来大的性能提升', chain(claimTag().scale(1.05, 0.3), claimTag().scale(1, 0.3))),
  );

  say('RAMCloud 带持久性');
  yield* beat('g37b',
    at('RAMCloud', ramPlate().opacity(1, 0.4)),
    at('带持久性', ramPlate().stroke(T.green, 0.4)),
    // r4 C2：内存和磁盘上的数据都用日志结构方法
    at('日志结构', ramLogTxt().opacity(1, 0.4)),
  );

  say('弱持久性');
  yield* beat('g37c',
    at('Redis', redisPlate().opacity(1, 0.4)),
    at('Couchbase', couchPlate().opacity(1, 0.4)),
    at('弱持久性', weakTag().opacity(1, 0.4)),
  );

  // r4 C2：g37c 长句版 TTS 在句中停顿 5.3s，拆拍——g37c 恢复 r3 原句，g37c2 只念异步写磁盘
  say('异步写磁盘');
  yield* beat('g37c2',
    at('异步写磁盘', chain(weakTag().scale(1.06, 0.3), weakTag().scale(1, 0.3))),
  );

  say('快，不是因为不读盘');
  yield* beat('g37d',
    all(prodG().opacity(0, 0.5), noDiskG().opacity(1, 0.5)),
    at('不用读磁盘', noDiskX().opacity(1, 0.4)),
  );

  say('也可能永远不读盘');
  yield* beat('g38',
    all(noDiskG().opacity(0, 0.5), engG().opacity(1, 0.5)),
    at('磁盘引擎', engBox().opacity(1, 0.4)),
    at('永远不用读磁盘', cacheBox().opacity(1, 0.4)),
  );

  say('操作系统缓存了磁盘块');
  yield* beat('g38b',
    at('操作系统', all(...blkRefs.map(b => b().opacity(1, 0.4)))),
    at('缓存在内存里', chain(
      all(...blkRefs.map((b, i) => b().position([210 + i * 90, -20], 0.8))),
      readArrow().end(1, 0.6),
    )),
  );

  say('省了编码开销');
  yield* beat('g38c',
    all(engG().opacity(0, 0.5), costG().opacity(1, 0.5)),
    at('省了编码的开销', chain(
      all(costCard().opacity(1, 0.4), costX().opacity(1, 0.4)),
      all(speedBar().opacity(1, 0.4), speedLab().opacity(1, 0.4)),
      speedBar().width(420, 0.8),
    )),
  );

  say('编成落盘样子再解开');
  yield* beat('g38d',
    all(costCard().opacity(0, 0.4), costX().opacity(0, 0.4), speedBar().opacity(0, 0.4), speedLab().opacity(0, 0.4)),
    at('编成能落盘的样子', chain(stepEncode().opacity(1, 0.4), stepDisk().opacity(1, 0.4))),
    at('读回来再解开', stepDecode().opacity(1, 0.4)),
    at('跳过这一步', chain(skipArrow().end(1, 1.0), skipLab().opacity(1, 0.4))),
  );

  say('磁盘索引难做的模型');
  yield* beat('g38e',
    all(costG().opacity(0, 0.5), modelG().opacity(1, 0.5)),
    at('磁盘索引很难实现', all(diskIdxCard().opacity(1, 0.4), diskIdxX().opacity(1, 0.4), redisPlate2().opacity(1, 0.4))),
  );

  say('Redis：队列、集合');
  yield* beat('g38f',
    all(diskIdxCard().opacity(0, 0.4), diskIdxX().opacity(0, 0.4), redisPlate2().opacity(0, 0.4)),
    at('优先队列', queueCard().opacity(1, 0.4)),
    at('集合', setCard().opacity(1, 0.4)),
  );

  say('全在内存里，实现简单');
  yield* beat('g38g',
    all(queueCard().opacity(0, 0.4), setCard().opacity(0, 0.4), diskIdxCard().opacity(0, 0.4), diskIdxX().opacity(0, 0.4), redisPlate2().opacity(0, 0.4), memBar().opacity(1, 0.5)),
    at('实现相对简单', simpleTag().opacity(1, 0.4)),
  );

  say('非易失性内存，值得关注');
  yield* beat('g39',
    all(modelG().opacity(0, 0.5), nvmG().opacity(1, 0.5)),
    // r4 fix：g39 首测定格 8.70s（error；r3 的 4.87s 是渲染顿挫偶然打断的，设计本身只有首尾两步动作）——
    // 按旁白分步展开：NVM 缩写随“更广泛地采用”出现，卡片在后两句各轻 pulse 一次
    at('更广泛地采用', nvmLab().opacity(1, 0.4)),
    at('存储引擎的设计可能还要再变', chain(nvmG().scale(1.02, 0.3), nvmG().scale(1, 0.3))),
    at('现在还是新领域', chain(nvmG().scale(1.02, 0.3), nvmG().scale(1, 0.3))),
    at('值得关注', nvmTag().opacity(1, 0.4)),
  );

  say('维度、相似度、内存');
  yield* beat('g40',
    all(nvmG().opacity(0, 0.5), forkG().opacity(1, 0.5)),
    at('维度', forkDim().opacity(1, 0.4)),
    at('相似度', forkSim().opacity(1, 0.4)),
    at('内存三条岔路', forkMem().opacity(1, 0.4)),
    at('索引的形状跟着问题走', closeLine().opacity(1, 0.4)),
  );
});
