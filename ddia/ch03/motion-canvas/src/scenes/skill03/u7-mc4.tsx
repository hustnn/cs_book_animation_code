// U7 场景 4（MC）：b28a–b31e —— 重启从磁盘或副本重载、特殊硬件除外、磁盘只是追加写日志、
// 磁盘文件易备份检查分析、VoltDB / MemSQL / Oracle TimesTen、RAMCloud、Redis / Couchbase 弱持久性。
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

  // 重启重载
  const reloadG = createRef<Node>();
  const srcDisk = createRef<Rect>();
  const srcRepl = createRef<Rect>();
  const arrDisk = createRef<Line>();
  const arrRepl = createRef<Line>();
  const memBox = createRef<Rect>();
  const memFill = createRef<Rect>();
  const hwTag = createRef<Txt>();

  // 磁盘只是日志
  const logG = createRef<Node>();
  const memBox2 = createRef<Rect>();
  const logStrip = createRef<Rect>();
  const readA1 = createRef<Line>();
  const readA2 = createRef<Line>();
  const readA3 = createRef<Line>();
  const readTag = createRef<Txt>();

  // 易备份、易检查、易分析
  const opsG = createRef<Node>();
  const opsBackup = createRef<Rect>();
  const opsCheck = createRef<Rect>();
  const opsAnaly = createRef<Rect>();

  // 产品
  const prodG = createRef<Node>();
  const prodVolt = createRef<Rect>();
  const prodMem = createRef<Rect>();
  const prodTimes = createRef<Rect>();
  const relTag = createRef<Txt>();
  const prodRam = createRef<Rect>();
  const prodRedis = createRef<Rect>();
  const prodCouch = createRef<Rect>();
  const weakTag = createRef<Txt>();

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

      {/* 重启重载 */}
      <Node ref={reloadG} opacity={0}>
        <Rect ref={srcDisk} position={[-420, -60]} width={220} height={140} radius={14} fill={T.card} stroke={T.muted} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'磁盘'} />
        </Rect>
        <Rect ref={srcRepl} position={[420, -60]} width={220} height={140} radius={14} fill={T.card} stroke={T.muted} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'网络上的副本'} />
        </Rect>
        <Line ref={arrDisk} points={[[-300, -60], [-170, -60]]} stroke={T.yellow} lineWidth={3} endArrow opacity={0} />
        <Line ref={arrRepl} points={[[300, -60], [170, -60]]} stroke={T.yellow} lineWidth={3} endArrow opacity={0} />
        <Rect ref={memBox} position={[0, -60]} width={300} height={180} radius={16} fill={T.card} stroke={T.green} lineWidth={3} opacity={0}>
          <Txt position={[0, -60]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'内存'} />
        </Rect>
        <Rect ref={memFill} position={[0, -30]} width={240} height={90} radius={10} fill={T.green} opacity={0} />
        <Txt ref={hwTag} position={[0, 140]} fontSize={SIZE.body} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'特殊硬件除外'} opacity={0} />
      </Node>

      {/* 磁盘只是日志 */}
      <Node ref={logG} opacity={0}>
        <Rect ref={memBox2} position={[0, -110]} width={500} height={180} radius={16} fill={T.card} stroke={T.green} lineWidth={3} opacity={0}>
          <Txt position={[0, -60]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'内存'} />
        </Rect>
        <Rect ref={logStrip} position={[0, 110]} width={700} height={70} radius={14} fill={T.card} stroke={T.muted} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'追加写日志'} />
        </Rect>
        <Line ref={readA1} points={[[-300, -20], [-300, -60]]} stroke={T.green} lineWidth={3} endArrow opacity={0} />
        <Line ref={readA2} points={[[0, -20], [0, -60]]} stroke={T.green} lineWidth={3} endArrow opacity={0} />
        <Line ref={readA3} points={[[300, -20], [300, -60]]} stroke={T.green} lineWidth={3} endArrow opacity={0} />
        <Txt ref={readTag} position={[0, 180]} fontSize={SIZE.body} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'读完全由内存来服务'} opacity={0} />
      </Node>

      {/* 易备份、易检查、易分析 */}
      <Node ref={opsG} opacity={0}>
        <Rect ref={opsBackup} position={[-380, -40]} width={300} height={110} radius={14} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'易备份'} />
        </Rect>
        <Rect ref={opsCheck} position={[0, -40]} width={300} height={110} radius={14} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'易检查'} />
        </Rect>
        <Rect ref={opsAnaly} position={[380, -40]} width={300} height={110} radius={14} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'易分析'} />
        </Rect>
      </Node>

      {/* 产品 */}
      <Node ref={prodG} opacity={0}>
        <Rect ref={prodVolt} position={[-380, -110]} width={300} height={90} radius={14} fill={T.card} stroke={T.purple} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.purple} fontFamily={FONT.mono} text={'VoltDB'} />
        </Rect>
        <Rect ref={prodMem} position={[0, -110]} width={300} height={90} radius={14} fill={T.card} stroke={T.purple} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.purple} fontFamily={FONT.mono} text={'MemSQL'} />
        </Rect>
        <Rect ref={prodTimes} position={[380, -110]} width={300} height={90} radius={14} fill={T.card} stroke={T.purple} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.purple} fontFamily={FONT.mono} text={'Oracle TimesTen'} />
        </Rect>
        <Txt ref={relTag} position={[0, -10]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'带关系模型'} opacity={0} />
        <Rect ref={prodRam} position={[-280, 110]} width={300} height={90} radius={14} fill={T.card} stroke={T.purple} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.purple} fontFamily={FONT.mono} text={'RAMCloud'} />
        </Rect>
        <Rect ref={prodRedis} position={[80, 110]} width={300} height={90} radius={14} fill={T.card} stroke={T.purple} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.purple} fontFamily={FONT.mono} text={'Redis'} />
        </Rect>
        <Rect ref={prodCouch} position={[380, 110]} width={260} height={90} radius={14} fill={T.card} stroke={T.purple} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.purple} fontFamily={FONT.mono} text={'Couchbase'} />
        </Rect>
        <Txt ref={weakTag} position={[0, 200]} fontSize={SIZE.body} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'只提供弱持久性'} opacity={0} />
      </Node>
    </>
  );

  say('重启：从磁盘或副本重载');
  yield* beat('b28a',
    all(reloadG().opacity(1, 0.5), memBox().opacity(1, 0.5)),
    at('从磁盘或网络上的副本重载状态', all(
      srcDisk().opacity(1, 0.5),
      srcRepl().opacity(1, 0.5),
      arrDisk().opacity(1, 0.5),
      arrRepl().opacity(1, 0.5),
      memFill().opacity(0.8, 0.8),
    )),
  );

  say('特殊硬件除外');
  yield* beat('b28b',
    at('除非用了特殊硬件', chain(
      all(arrDisk().opacity(0, 0.4), arrRepl().opacity(0, 0.4)),
      hwTag().opacity(1, 0.5),
    )),
  );

  say('仍是内存数据库');
  yield* beat('b29a',
    all(reloadG().opacity(0, 0.5), logG().opacity(1, 0.5)),
    at('它也写磁盘', all(memBox2().opacity(1, 0.5), logStrip().opacity(1, 0.5))),
    at('仍然是内存数据库', memBox2().stroke(T.yellow, 0.4)),
  );

  say('磁盘只是日志，读走内存');
  yield* beat('b29b',
    at('磁盘只是追加写日志', logStrip().stroke(T.yellow, 0.4)),
    at('读完全由内存来服务', all(readA1().opacity(1, 0.4), readA2().opacity(1, 0.4), readA3().opacity(1, 0.4), readTag().opacity(1, 0.5))),
  );

  say('易备份、易检查、易分析');
  yield* beat('b30b',
    all(logG().opacity(0, 0.5), opsG().opacity(1, 0.5), opsBackup().opacity(1, 0.5)),
    at('容易备份', opsBackup().stroke(T.yellow, 0.4)),
    at('检查', opsCheck().opacity(1, 0.5)),
    at('被外部工具分析', opsAnaly().opacity(1, 0.5)),
  );

  say('VoltDB 等三款产品');
  yield* beat('b31a',
    all(opsG().opacity(0, 0.5), prodG().opacity(1, 0.5)),
    at('VoltDB', prodVolt().opacity(1, 0.5)),
    at('MemSQL', prodMem().opacity(1, 0.5)),
    at('Oracle TimesTen', prodTimes().opacity(1, 0.5)),
  );

  say('带关系模型');
  yield* beat('b31b',
    at('带关系模型', relTag().opacity(1, 0.5)),
  );

  say('RAMCloud 带持久性');
  yield* beat('b31c',
    at('RAMCloud', prodRam().opacity(1, 0.5)),
    at('带持久性', prodRam().stroke(T.yellow, 0.4)),
  );

  say('Redis、Couchbase');
  yield* beat('b31d',
    at('Redis', prodRedis().opacity(1, 0.5)),
    at('Couchbase', prodCouch().opacity(1, 0.5)),
    at('先写内存、后写磁盘', all(prodRedis().stroke(T.yellow, 0.4), prodCouch().stroke(T.yellow, 0.4))),
  );

  say('只提供弱持久性');
  yield* beat('b31e',
    at('只提供弱持久性', weakTag().opacity(1, 0.5)),
  );
});
