// U7 场景 5（MC）：b32a–b37b —— 快不是因为不读盘、磁盘引擎也可能永远不读盘、
// 操作系统缓存、省了编码开销、磁盘索引难做的数据模型（Redis 优先队列、集合）。
// 分镜：skill-ch03/beats-u7.md；原文：DDIA §3.6 后半（书页 p90）。
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

  // 反直觉：不用读磁盘？
  const mythG = createRef<Node>();
  const mythCard = createRef<Rect>();
  const mythX = createRef<Txt>();

  // 磁盘引擎 + 操作系统缓存
  const cacheG = createRef<Node>();
  const diskBox = createRef<Rect>();
  const osCache = createRef<Rect>();
  const blk1 = createRef<Rect>();
  const blk2 = createRef<Rect>();
  const blk3 = createRef<Rect>();
  const readArr = createRef<Line>();
  const readLab = createRef<Txt>();

  // 编码开销
  const encG = createRef<Node>();
  const encCost = createRef<Rect>();
  const encX = createRef<Txt>();
  const stepEnc = createRef<Rect>();
  const stepDisk = createRef<Rect>();
  const stepDec = createRef<Rect>();
  const skipArr = createRef<Line>();
  const skipLab = createRef<Txt>();

  // 磁盘索引难做的模型
  const modelG = createRef<Node>();
  const diskIdx = createRef<Rect>();
  const diskIdxX = createRef<Txt>();
  const redisPlate = createRef<Rect>();
  const pqCard = createRef<Rect>();
  const setCard = createRef<Rect>();
  const simpleTag = createRef<Txt>();

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

      {/* 反直觉 */}
      <Node ref={mythG} opacity={0}>
        <Rect ref={mythCard} position={[0, -60]} width={560} height={140} radius={16} fill={T.card} stroke={T.muted} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'不用读磁盘'} />
        </Rect>
        <Txt ref={mythX} position={[210, -60]} fontSize={SIZE.title} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'✗'} opacity={0} />
      </Node>

      {/* 磁盘引擎 + 操作系统缓存 */}
      <Node ref={cacheG} opacity={0}>
        <Rect ref={diskBox} position={[-350, -60]} width={320} height={180} radius={16} fill={T.card} stroke={T.muted} lineWidth={2} opacity={0}>
          <Txt position={[0, -60]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'磁盘存储引擎'} />
        </Rect>
        <Rect ref={osCache} position={[120, -60]} width={380} height={180} radius={16} fill={T.card} stroke={T.green} lineWidth={3} opacity={0}>
          <Txt position={[0, -60]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'操作系统缓存'} />
        </Rect>
        <Rect ref={blk1} position={[-380, -60]} width={90} height={60} radius={8} fill={T.blue} opacity={0} />
        <Rect ref={blk2} position={[-380, 0]} width={90} height={60} radius={8} fill={T.blue} opacity={0} />
        <Rect ref={blk3} position={[-270, -60]} width={90} height={60} radius={8} fill={T.blue} opacity={0} />
        <Line ref={readArr} points={[[310, -60], [430, -60]]} stroke={T.green} lineWidth={3} endArrow opacity={0} />
        <Txt ref={readLab} position={[480, -60]} fontSize={SIZE.body} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'读'} opacity={0} />
      </Node>

      {/* 编码开销 */}
      <Node ref={encG} opacity={0}>
        <Rect ref={encCost} position={[0, -140]} width={420} height={110} radius={16} fill={T.card} stroke={T.red} lineWidth={3} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'编码开销'} />
        </Rect>
        <Txt ref={encX} position={[150, -140]} fontSize={SIZE.title} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'✗'} opacity={0} />
        <Rect ref={stepEnc} position={[-380, 40]} width={300} height={100} radius={14} fill={T.card} stroke={T.muted} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'编码'} />
        </Rect>
        <Rect ref={stepDisk} position={[0, 40]} width={300} height={100} radius={14} fill={T.card} stroke={T.muted} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'落盘'} />
        </Rect>
        <Rect ref={stepDec} position={[380, 40]} width={300} height={100} radius={14} fill={T.card} stroke={T.muted} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'解码'} />
        </Rect>
        <Line ref={skipArr} points={[[-380, 140], [380, 140]]} stroke={T.green} lineWidth={3} endArrow opacity={0} />
        <Txt ref={skipLab} position={[0, 190]} fontSize={SIZE.body} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'内存数据库：跳过这一步'} opacity={0} />
      </Node>

      {/* 磁盘索引难做的模型 */}
      <Node ref={modelG} opacity={0}>
        <Rect ref={diskIdx} position={[-350, -60]} width={340} height={180} radius={16} fill={T.card} stroke={T.muted} lineWidth={2} opacity={0}>
          <Txt position={[0, -40]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'磁盘索引'} />
          <Txt position={[0, 40]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'很难实现'} />
        </Rect>
        <Txt ref={diskIdxX} position={[-230, -60]} fontSize={SIZE.title} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'✗'} opacity={0} />
        <Rect ref={redisPlate} position={[250, -190]} width={320} height={70} radius={14} fill={T.card} stroke={T.purple} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.purple} fontFamily={FONT.mono} text={'Redis'} />
        </Rect>
        <Rect ref={pqCard} position={[250, -90]} width={320} height={90} radius={14} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'优先队列'} />
        </Rect>
        <Rect ref={setCard} position={[250, 30]} width={320} height={90} radius={14} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'集合'} />
        </Rect>
        <Txt ref={simpleTag} position={[0, 150]} fontSize={SIZE.body} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'全在内存里，实现简单'} opacity={0} />
      </Node>
    </>
  );

  say('反直觉的一点');
  yield* beat('b32a',
    all(mythG().opacity(1, 0.5), mythCard().opacity(1, 0.5)),
    at('反直觉', mythCard().stroke(T.yellow, 0.4)),
  );

  say('快，不是因为不读盘');
  yield* beat('b32b',
    at('不是因为它不用读磁盘', mythX().opacity(1, 0.5)),
  );

  say('也可能永远不读盘');
  yield* beat('b33a',
    all(mythG().opacity(0, 0.5), cacheG().opacity(1, 0.5), diskBox().opacity(1, 0.5)),
    at('只要内存足够', osCache().opacity(1, 0.5)),
    at('永远不用读磁盘', all(readArr().opacity(1, 0.5), readLab().opacity(1, 0.5))),
  );

  say('操作系统缓存了磁盘块');
  yield* beat('b33b',
    at('最近用的块留在内存里', chain(
      all(blk1().opacity(1, 0.4), blk2().opacity(1, 0.4), blk3().opacity(1, 0.4)),
      all(blk1().position([60, -60], 0.8), blk2().position([60, 0], 0.8), blk3().position([170, -60], 0.8)),
    )),
  );

  say('省了编码开销');
  yield* beat('b34',
    all(cacheG().opacity(0, 0.5), encG().opacity(1, 0.5), encCost().opacity(1, 0.5)),
    at('省掉编码的开销', encX().opacity(1, 0.4)),
  );

  say('编成落盘样子再解开');
  yield* beat('b35',
    at('编成能落盘的样子', all(stepEnc().opacity(1, 0.5), stepDisk().opacity(1, 0.5))),
    at('读回来再解开', stepDec().opacity(1, 0.5)),
    at('跳过这一步', all(skipArr().opacity(1, 0.5), skipLab().opacity(1, 0.5))),
  );

  say('磁盘索引难做的模型');
  yield* beat('b36',
    all(encG().opacity(0, 0.5), modelG().opacity(1, 0.5), diskIdx().opacity(1, 0.5)),
    at('磁盘索引很难实现', diskIdxX().opacity(1, 0.5)),
    at('数据模型', diskIdx().stroke(T.yellow, 0.4)),
  );

  say('Redis：队列、集合');
  yield* beat('b37a',
    at('Redis', redisPlate().opacity(1, 0.5)),
    at('优先队列、集合', all(pqCard().opacity(1, 0.5), setCard().opacity(1, 0.5))),
  );

  say('全在内存里，实现简单');
  yield* beat('b37b',
    at('数据全在内存里', simpleTag().opacity(1, 0.5)),
    at('实现起来相对简单', chain(simpleTag().scale(1.06, 0.3), simpleTag().scale(1.0, 0.3))),
  );
});
