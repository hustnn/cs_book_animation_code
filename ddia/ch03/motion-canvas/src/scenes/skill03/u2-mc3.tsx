// U2 场景 3（MC）：b25–b32b —— 实现细节：文件格式、墓碑删除、崩溃恢复、半截记录、并发控制。
// 分镜：skill-ch03/beats-u2.md；原文：DDIA §3.2（书页 p74–75，PDF p96–97）。
// 时长全部来自 timeline/u2.json（beat() 驱动），不手写 waitFor。
import {Circle, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, chain, createRef} from '@motion-canvas/core';
import {at, makeBeats} from '../../lib/beats';
import {FONT, SAFE, SIZE, T} from '../../lib/theme';
import timeline from '../../timeline/u2.json';

export default makeScene2D(function* (view) {
  view.fill(T.bg);
  const beat = makeBeats(timeline);

  const header = createRef<Txt>();
  const anchor = createRef<Txt>();
  const say = (text: string) => anchor().text(text);

  const g1 = createRef<Node>();
  const csvLine = createRef<Rect>();
  const csvX = createRef<Txt>();
  const g2 = createRef<Node>();
  const lenBox = createRef<Rect>();
  const rawBox = createRef<Rect>();
  const g3 = createRef<Node>();
  const fileCells = [0, 1, 2].map(() => createRef<Rect>());
  const tomb = createRef<Rect>();
  const tombLab = createRef<Txt>();
  const dropLab = createRef<Txt>();
  const g4 = createRef<Node>();
  const memBox = createRef<Rect>();
  const memTab = createRef<Txt>();
  const fileBar = createRef<Rect>();
  const scanDot = createRef<Circle>();
  const progBar = createRef<Rect>();
  const slowLab = createRef<Txt>();
  const snap = createRef<Rect>();
  const snapLab = createRef<Txt>();
  const g5 = createRef<Node>();
  const recLeft = createRef<Rect>();
  const recRight = createRef<Rect>();
  const sumBadge = createRef<Rect>();
  const sumX = createRef<Txt>();
  const dmgLab = createRef<Txt>();
  const g6 = createRef<Node>();
  const wArrow = createRef<Line>();
  const wLab = createRef<Txt>();
  const rArrows = [0, 1, 2].map(() => createRef<Line>());
  const rLab = createRef<Txt>();

  view.add(
    <>
      <Txt
        ref={header}
        position={[-SAFE.halfW, -SAFE.halfH]}
        offset={[-1, -1]}
        fontSize={SIZE.label}
        fill={T.muted}
        fontFamily={FONT.sans}
        text={'哈希索引：键就是地址'}
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

      {/* b25：逗号分隔的文本 */}
      <Node ref={g1} opacity={0}>
        <Rect ref={csvLine} position={[0, -60]} width={1000} height={80} radius={12} fill={T.card} stroke={T.line} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.mono} text={'mew,1078,purr,2103,mew,1079,…'} />
        </Rect>
        <Txt ref={csvX} position={[0, 60]} fontSize={64} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'✗'} opacity={0} />
      </Node>

      {/* b26：二进制格式：长度 + 原串 */}
      <Node ref={g2} opacity={0}>
        <Rect ref={lenBox} position={[-260, -60]} width={300} height={140} radius={16} fill={T.card} stroke={T.blue} lineWidth={3} opacity={0}>
          <Txt position={[0, -45]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'长度'} />
          <Txt position={[0, 15]} fontSize={SIZE.title} fontWeight={700} fill={T.text} fontFamily={FONT.mono} text={'3'} />
        </Rect>
        <Rect ref={rawBox} position={[260, -60]} width={300} height={140} radius={16} fill={T.card} stroke={T.green} lineWidth={3} opacity={0}>
          <Txt position={[0, -45]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'原始字符串'} />
          <Txt position={[0, 15]} fontSize={SIZE.title} fontWeight={700} fill={T.text} fontFamily={FONT.mono} text={'mew'} />
        </Rect>
      </Node>

      {/* b27/b28：墓碑 */}
      <Node ref={g3} opacity={0}>
        {[0, 1, 2].map(i => (
          <Rect
            key={`fc-${i}`}
            ref={fileCells[i]}
            position={[-360 + i * 360, -80]}
            width={320}
            height={90}
            radius={12}
            fill={T.card}
            stroke={T.blue}
            lineWidth={2}
            opacity={0}
          >
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={['mew:1078', 'mew:1082', 'purr:2108'][i]} />
          </Rect>
        ))}
        <Rect ref={tomb} position={[0, 60]} width={360} height={90} radius={12} fill={T.card} stroke={T.red} lineWidth={3} opacity={0}>
          <Txt fontSize={SIZE.label} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'删除 mew'} />
        </Rect>
        <Txt ref={tombLab} position={[0, 140]} fontSize={SIZE.label} fill={T.red} fontFamily={FONT.sans} text={'墓碑：追加的删除记录'} opacity={0} />
        <Txt ref={dropLab} position={[0, 200]} fontSize={SIZE.body} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'合并时，旧值一起丢掉'} opacity={0} />
      </Node>

      {/* b29/b30：崩溃恢复 */}
      <Node ref={g4} opacity={0}>
        <Rect ref={memBox} position={[0, -200]} width={480} height={130} radius={16} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt ref={memTab} position={[0, 0]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'内存哈希表'} opacity={0} />
        </Rect>
        <Rect ref={fileBar} position={[0, -40]} width={1000} height={70} radius={12} fill={T.card} stroke={T.line} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'段文件：从头读到尾'} />
        </Rect>
        <Rect ref={progBar} position={[-500, 40]} offset={[-1, 0]} width={10} height={26} radius={13} fill={T.yellow} opacity={0} />
        <Circle ref={scanDot} position={[-480, -80]} width={24} height={24} fill={T.yellow} opacity={0} />
        <Txt ref={slowLab} position={[0, 130]} fontSize={SIZE.body} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'段大了，很慢，重启很痛苦'} opacity={0} />
        <Rect ref={snap} position={[360, -200]} width={300} height={130} radius={16} fill={T.card} stroke={T.green} lineWidth={3} opacity={0}>
          <Txt fontSize={SIZE.label} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'快照在磁盘上'} />
        </Rect>
        <Txt ref={snapLab} position={[0, 200]} fontSize={SIZE.body} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'从快照加载，快得多'} opacity={0} />
      </Node>

      {/* b31：半截记录 */}
      <Node ref={g5} opacity={0}>
        <Rect ref={recLeft} position={[-260, -60]} width={440} height={90} radius={12} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'记录前半'} />
        </Rect>
        <Rect ref={recRight} position={[260, -60]} width={440} height={90} radius={12} fill={T.card} stroke={T.red} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.red} fontFamily={FONT.mono} text={'写到一半断了'} />
        </Rect>
        <Rect ref={sumBadge} position={[0, 60]} width={280} height={70} radius={14} fill={T.card} stroke={T.yellow} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'校验和'} />
        </Rect>
        <Txt ref={sumX} position={[180, 60]} fontSize={48} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'✗'} opacity={0} />
        <Txt ref={dmgLab} position={[0, 150]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'损坏的部分被发现，忽略掉'} opacity={0} />
      </Node>

      {/* b32：并发 */}
      <Node ref={g6} opacity={0}>
        <Line ref={wArrow} points={[[-480, -160], [-160, -60]]} stroke={T.blue} lineWidth={3} endArrow opacity={0} />
        <Txt ref={wLab} position={[-380, -190]} fontSize={SIZE.label} fontWeight={700} fill={T.blue} fontFamily={FONT.sans} text={'一个写线程'} opacity={0} />
        {[0, 1, 2].map(i => (
          <Line
            key={`ra-${i}`}
            ref={rArrows[i]}
            points={[[160, -60], [480, -180 + i * 120]]}
            stroke={T.green}
            lineWidth={3}
            endArrow
            opacity={0}
          />
        ))}
        <Txt ref={rLab} position={[380, 140]} fontSize={SIZE.label} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'多线程同时读'} opacity={0} />
      </Node>
    </>
  );

  say('文本格式不够好');
  yield* beat('b25',
    all(g1().opacity(1, 0.5), csvLine().opacity(1, 0.5)),
    at('逗号分隔', csvLine().stroke(T.yellow, 0.4)),
    at('不是日志最好的格式', csvX().opacity(1, 0.5)),
  );

  say('二进制格式更快');
  yield* beat('b26a',
    all(g1().opacity(0, 0.5), g2().opacity(1, 0.5)),
    at('二进制格式', all(lenBox().opacity(1, 0.5), rawBox().opacity(1, 0.5))),
  );

  say('长度 + 原串');
  yield* beat('b26b',
    at('字节长度', lenBox().stroke(T.yellow, 0.4)),
    at('原始字符串', rawBox().stroke(T.yellow, 0.4)),
    at('不用转义', all(lenBox().stroke(T.blue, 0.4), rawBox().stroke(T.green, 0.4))),
  );

  say('墓碑：追加删除记录');
  yield* beat('b27',
    all(g2().opacity(0, 0.5), g3().opacity(1, 0.5)),
    at('删除一条记录', chain(fileCells[0]().opacity(1, 0.4), fileCells[1]().opacity(1, 0.4), fileCells[2]().opacity(1, 0.4))),
    at('追加', tomb().opacity(1, 0.5)),
    at('墓碑', tombLab().opacity(1, 0.5)),
  );

  say('合并时清掉旧值');
  yield* beat('b28',
    all(tomb().scale(1.04, 2.5)),
    at('丢掉', all(fileCells[0]().opacity(0.2, 0.6), fileCells[1]().opacity(0.2, 0.6), dropLab().opacity(1, 0.5))),
  );

  say('重建：从头读，慢');
  yield* beat('b29',
    all(g3().opacity(0, 0.5), g4().opacity(1, 0.5)),
    at('重启', all(memBox().opacity(1, 0.5), memTab().opacity(1, 0.4))),
    at('丢了', all(memBox().opacity(0.2, 0.6), memTab().opacity(0.2, 0.6))),
    at('从头读', all(fileBar().opacity(1, 0.5), scanDot().opacity(1, 0.4), progBar().opacity(1, 0.4), scanDot().position([480, -80], 4.5), progBar().width(980, 4.5))),
    at('很慢', slowLab().opacity(1, 0.5)),
  );

  say('快照在磁盘上');
  yield* beat('b30',
    all(slowLab().opacity(0, 0.4)),
    at('快照', chain(snap().opacity(1, 0.5), memBox().opacity(1, 0.4), memTab().opacity(1, 0.4))),
    at('快得多', snapLab().opacity(1, 0.5)),
  );

  say('校验和拦住半截记录');
  yield* beat('b31',
    all(g4().opacity(0, 0.5), g5().opacity(1, 0.5), recLeft().opacity(1, 0.6)),
    at('正在追加', recLeft().stroke(T.yellow, 0.4)),
    at('半途', recRight().opacity(1, 0.6)),
    at('校验和', all(sumBadge().opacity(1, 0.5), sumX().opacity(1, 0.4))),
    at('忽略', all(recRight().opacity(0.25, 0.6), dmgLab().opacity(1, 0.5))),
  );

  say('一写');
  yield* beat('b32a',
    all(g5().opacity(0, 0.5), g6().opacity(1, 0.5), wArrow().opacity(1, 0.5)),
    at('一个写线程', wLab().opacity(1, 0.5)),
  );

  say('多读');
  yield* beat('b32b',
    at('多线程同时读', chain(rArrows[0]().opacity(1, 0.4), rArrows[1]().opacity(1, 0.4), rArrows[2]().opacity(1, 0.4), rLab().opacity(1, 0.5))),
  );
});
