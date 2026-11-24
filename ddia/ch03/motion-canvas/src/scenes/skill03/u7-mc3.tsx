// U7 场景 3（MC）：b22a–b27d —— 磁盘别扭但持久便宜、内存变便宜、Memcached 只做缓存、
// 内存数据库持久性的四种办法（特殊硬件、变更日志、定期快照、复制到别的机器）。
// 分镜：skill-ch03/beats-u7.md；原文：DDIA §3.6 后半（书页 p88–89）。
// 时长全部来自 timeline/u7.json（beat() 驱动），不手写 waitFor。
import {Circle, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
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

  // 磁盘 vs 内存
  const diskG = createRef<Node>();
  const diskPlate = createRef<Circle>();
  const diskHub = createRef<Circle>();
  const memBar = createRef<Rect>();
  const hardTag = createRef<Txt>();

  // 排布讲究
  const layoutG = createRef<Node>();
  const layB1 = createRef<Rect>();
  const layB2 = createRef<Rect>();
  const layB3 = createRef<Rect>();
  const layB4 = createRef<Rect>();

  // 磁盘的两个优点
  const badgeG = createRef<Node>();
  const badgeDur = createRef<Rect>();
  const badgeCheap = createRef<Rect>();

  // 内存变便宜
  const priceG = createRef<Node>();
  const priceLine = createRef<Line>();
  const priceTag = createRef<Txt>();

  // 数据集放进内存 / 分布到多台机器
  const fitG = createRef<Node>();
  const fitData = createRef<Rect>();
  const fitMem = createRef<Rect>();
  const fitM1 = createRef<Rect>();
  const fitM2 = createRef<Rect>();
  const fitM3 = createRef<Rect>();

  // Memcached 只做缓存
  const cacheG = createRef<Node>();
  const cacheBox = createRef<Rect>();
  const cacheC1 = createRef<Rect>();
  const cacheC2 = createRef<Rect>();
  const cacheC3 = createRef<Rect>();
  const cachePlate = createRef<Rect>();
  const cacheOk = createRef<Txt>();

  // 持久性四种办法
  const fourG = createRef<Node>();
  const fourHw = createRef<Rect>();
  const fourLog = createRef<Rect>();
  const fourSnap = createRef<Rect>();
  const fourRepl = createRef<Rect>();

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

      {/* 磁盘 vs 内存 */}
      <Node ref={diskG} opacity={0}>
        <Circle ref={diskPlate} position={[-280, -60]} width={280} height={280} fill={T.card} stroke={T.muted} lineWidth={3} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'磁盘'} />
        </Circle>
        <Circle ref={diskHub} position={[-280, -60]} width={90} height={90} stroke={T.muted} lineWidth={2} opacity={0} />
        <Rect ref={memBar} position={[280, -60]} width={220} height={280} radius={16} fill={T.card} stroke={T.green} lineWidth={3} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'内存'} />
        </Rect>
        <Txt ref={hardTag} position={[0, 140]} fontSize={SIZE.body} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'难打交道'} opacity={0} />
      </Node>

      {/* 排布讲究 */}
      <Node ref={layoutG} opacity={0}>
        <Rect position={[0, -60]} width={700} height={180} radius={16} fill={T.card} stroke={T.line} lineWidth={2} />
        <Rect ref={layB1} position={[-240, -60]} width={120} height={100} radius={10} fill={T.green} opacity={0.35} />
        <Rect ref={layB2} position={[-80, -60]} width={120} height={100} radius={10} fill={T.green} opacity={0.35} />
        <Rect ref={layB3} position={[80, -60]} width={120} height={100} radius={10} fill={T.green} opacity={0.35} />
        <Rect ref={layB4} position={[240, -60]} width={120} height={100} radius={10} fill={T.green} opacity={0.35} />
        <Txt position={[0, 90]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'排布讲究，读和写才有好性能'} />
      </Node>

      {/* 磁盘的两个优点 */}
      <Node ref={badgeG} opacity={0}>
        <Rect ref={badgeDur} position={[-280, -40]} width={380} height={160} radius={16} fill={T.card} stroke={T.green} lineWidth={3} opacity={0}>
          <Txt position={[0, -36]} fontSize={SIZE.body} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'持久'} />
          <Txt position={[0, 30]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'断电也不丢内容'} />
        </Rect>
        <Rect ref={badgeCheap} position={[280, -40]} width={380} height={160} radius={16} fill={T.card} stroke={T.green} lineWidth={3} opacity={0}>
          <Txt position={[0, -36]} fontSize={SIZE.body} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'更便宜'} />
          <Txt position={[0, 30]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'每吉字节成本更低'} />
        </Rect>
      </Node>

      {/* 内存变便宜 */}
      <Node ref={priceG} opacity={0}>
        <Line ref={priceLine} points={[[-420, -190], [0, -70], [420, 50]]} stroke={T.green} lineWidth={4} opacity={0} />
        <Txt ref={priceTag} position={[0, -230]} fontSize={SIZE.body} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'内存越来越便宜'} opacity={0} />
      </Node>

      {/* 数据集放进内存 / 分布到多台机器 */}
      <Node ref={fitG} opacity={0}>
        <Rect ref={fitMem} position={[0, -80]} width={560} height={220} radius={16} fill={T.card} stroke={T.green} lineWidth={3} opacity={0}>
          <Txt position={[0, -70]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'内存'} />
        </Rect>
        <Rect ref={fitData} position={[0, -40]} width={380} height={110} radius={14} fill={T.blue} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.bg} fontFamily={FONT.sans} text={'数据集'} />
        </Rect>
        <Rect ref={fitM1} position={[-330, 120]} width={260} height={90} radius={14} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'机器一'} />
        </Rect>
        <Rect ref={fitM2} position={[0, 120]} width={260} height={90} radius={14} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'机器二'} />
        </Rect>
        <Rect ref={fitM3} position={[330, 120]} width={260} height={90} radius={14} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'机器三'} />
        </Rect>
      </Node>

      {/* Memcached 只做缓存 */}
      <Node ref={cacheG} opacity={0}>
        <Rect ref={cachePlate} position={[0, -200]} width={360} height={70} radius={14} fill={T.card} stroke={T.purple} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.purple} fontFamily={FONT.mono} text={'Memcached'} />
        </Rect>
        <Rect ref={cacheBox} position={[0, -40]} width={560} height={200} radius={16} fill={T.card} stroke={T.line} lineWidth={2} opacity={0}>
          <Txt position={[0, -70]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'缓存'} />
        </Rect>
        <Rect ref={cacheC1} position={[-160, -10]} width={130} height={80} radius={10} fill={T.blue} opacity={0} />
        <Rect ref={cacheC2} position={[0, -10]} width={130} height={80} radius={10} fill={T.blue} opacity={0} />
        <Rect ref={cacheC3} position={[160, -10]} width={130} height={80} radius={10} fill={T.blue} opacity={0} />
        <Txt ref={cacheOk} position={[0, 130]} fontSize={SIZE.body} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'重启丢了数据也能接受'} opacity={0} />
      </Node>

      {/* 持久性四种办法 */}
      <Node ref={fourG} opacity={0}>
        <Rect ref={fourHw} position={[-405, -40]} width={260} height={170} radius={14} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt position={[0, -44]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'特殊硬件'} />
          <Txt position={[0, 30]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'电池供电的内存'} />
        </Rect>
        <Rect ref={fourLog} position={[-135, -40]} width={260} height={170} radius={14} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt position={[0, -44]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'变更日志'} />
          <Txt position={[0, 30]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'写到磁盘'} />
        </Rect>
        <Rect ref={fourSnap} position={[135, -40]} width={260} height={170} radius={14} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt position={[0, -44]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'定期快照'} />
          <Txt position={[0, 30]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'存到磁盘'} />
        </Rect>
        <Rect ref={fourRepl} position={[405, -40]} width={260} height={170} radius={14} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt position={[0, -44]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'复制'} />
          <Txt position={[0, 30]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'搬到别的机器'} />
        </Rect>
      </Node>
    </>
  );

  say('回答磁盘的局限');
  yield* beat('b22a',
    all(diskG().opacity(1, 0.5), diskPlate().opacity(1, 0.5), diskHub().opacity(1, 0.5)),
    at('被逼出来的', diskPlate().stroke(T.yellow, 0.4)),
  );

  say('磁盘难打交道');
  yield* beat('b22b',
    all(memBar().opacity(1, 0.5)),
    at('比内存麻烦得多', all(diskPlate().stroke(T.red, 0.4), hardTag().opacity(1, 0.5))),
  );

  say('排布讲究才好用');
  yield* beat('b23a',
    all(diskG().opacity(0, 0.5), layoutG().opacity(1, 0.5)),
    at('得仔细排布', all(layB1().opacity(0.9, 0.4), layB2().opacity(0.9, 0.4), layB3().opacity(0.9, 0.4), layB4().opacity(0.9, 0.4))),
  );

  say('磁盘有两个优点');
  yield* beat('b23b',
    all(layoutG().opacity(0, 0.5), badgeG().opacity(1, 0.5)),
    at('两个显著的优点', all(badgeDur().opacity(1, 0.5), badgeCheap().opacity(1, 0.5))),
    at('值得容忍这种别扭', chain(
      all(badgeDur().scale(1.03, 0.3), badgeCheap().scale(1.03, 0.3)),
      all(badgeDur().scale(1.0, 0.3), badgeCheap().scale(1.0, 0.3)),
    )),
  );

  say('持久，每吉字节更便宜');
  yield* beat('b24',
    at('持久', badgeDur().stroke(T.yellow, 0.4)),
    at('每吉字节', badgeCheap().stroke(T.yellow, 0.4)),
  );

  say('成本论点被削弱');
  yield* beat('b25a',
    all(badgeG().opacity(0, 0.5), priceG().opacity(1, 0.5)),
    at('内存越来越便宜', all(priceLine().opacity(1, 0.6), priceTag().opacity(1, 0.5))),
    at('成本的论点被削弱了', chain(priceTag().scale(1.08, 0.3), priceTag().scale(1.0, 0.3))),
  );

  say('整个放进内存');
  yield* beat('b25b',
    all(priceG().opacity(0, 0.5), fitG().opacity(1, 0.5), fitMem().opacity(1, 0.5)),
    at('整个放进内存', fitData().opacity(1, 0.5)),
  );

  say('分布在几台机器上');
  yield* beat('b25c',
    at('几台机器', all(fitM1().opacity(1, 0.5), fitM2().opacity(1, 0.5), fitM3().opacity(1, 0.5))),
  );

  say('只做缓存');
  yield* beat('b26a',
    all(fitG().opacity(0, 0.5), cacheG().opacity(1, 0.5), cacheBox().opacity(1, 0.5)),
    at('只用来做缓存', all(cachePlate().opacity(1, 0.5), cacheC1().opacity(1, 0.5), cacheC2().opacity(1, 0.5), cacheC3().opacity(1, 0.5))),
  );

  say('丢了也行');
  yield* beat('b26b',
    at('丢了数据也能接受', chain(
      all(cacheC1().opacity(0, 0.4), cacheC2().opacity(0, 0.4), cacheC3().opacity(0, 0.4)),
      cacheOk().opacity(1, 0.5),
    )),
  );

  say('四种办法：硬件、日志');
  yield* beat('b27b',
    all(cacheG().opacity(0, 0.5), fourG().opacity(1, 0.5), fourHw().opacity(1, 0.5)),
    at('特殊硬件', fourHw().stroke(T.yellow, 0.4)),
    at('变更日志写磁盘', fourLog().opacity(1, 0.5)),
  );

  say('定期快照');
  yield* beat('b27c',
    at('隔一阵子存一份快照', fourSnap().opacity(1, 0.5)),
  );

  say('复制到别的机器');
  yield* beat('b27d',
    at('把内存状态搬到别的机器上', fourRepl().opacity(1, 0.5)),
  );
});
