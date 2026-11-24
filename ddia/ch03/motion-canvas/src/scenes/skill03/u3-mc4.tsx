// U3 场景 4（MC）：b24a–b29 —— 两种压缩策略（按大小合并 / 按层合并）、谁用哪种、
// 大而有序、范围查询、顺序写高吞吐、猫视频回扣、结尾句。
// 分镜：skill-ch03/beats-u3.md；原文：DDIA §3.3（书页 p79，PDF p101）。
// 时长全部来自 timeline/u3.json（beat() 驱动），不手写 waitFor。
import {Circle, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, chain, createRef} from '@motion-canvas/core';
import {at, makeBeats} from '../../lib/beats';
import {FONT, SAFE, SIZE, T} from '../../lib/theme';
import timeline from '../../timeline/u3.json';

export default makeScene2D(function* (view) {
  view.fill(T.bg);
  const beat = makeBeats(timeline);

  const header = createRef<Txt>();
  const anchor = createRef<Txt>();
  const say = (text: string) => anchor().text(text);

  // ---- 第 1 页：两种压缩策略 ----
  const p1 = createRef<Node>();
  const cardSize = createRef<Rect>();
  const cardLevel = createRef<Rect>();
  const userSize = createRef<Txt>();
  const userLevel = createRef<Txt>();
  const userBoth = createRef<Txt>();
  const smallSegs = [0, 1, 2].map(() => createRef<Rect>());
  const bigSeg = createRef<Rect>();
  const levels = [0, 1, 2].map(() => createRef<Rect>());
  const levelDots = [0, 1].map(() => createRef<Circle>());

  // ---- 第 2 页：大而有序 + 范围查询 + 顺序写 ----
  const p2 = createRef<Node>();
  const bigData = createRef<Rect>();
  const smallMem = createRef<Rect>();
  const rangeBox = createRef<Rect>();
  const rangeKeys = [0, 1, 2, 3, 4, 5].map(() => createRef<Txt>());
  const rangeLab = createRef<Txt>();
  const simpleLab = createRef<Txt>();
  const writeArrow = createRef<Line>();
  const speedBar = createRef<Rect>();
  const speedFill = createRef<Rect>();

  // ---- 第 3 页：猫视频回扣 + 结尾 ----
  const p3 = createRef<Node>();
  const catCards = [0, 1, 2, 3].map(() => createRef<Rect>());
  const catVals = [0, 1, 2, 3].map(() => createRef<Txt>());
  const outSeg = createRef<Rect>();
  const outKeys = [0, 1, 2, 3].map(() => createRef<Txt>());
  const closeCard = createRef<Rect>();
  const closeLab = createRef<Txt>();

  view.add(
    <>
      <Txt
        ref={header}
        position={[-SAFE.halfW, -SAFE.halfH]}
        offset={[-1, -1]}
        fontSize={SIZE.label}
        fill={T.muted}
        fontFamily={FONT.sans}
        text={'排好序的段：SSTable 与 LSM 树'}
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

      {/* 第 1 页 */}
      <Node ref={p1} opacity={0}>
        <Rect ref={cardSize} position={[-290, -160]} width={520} height={130} radius={16} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'按大小合并'} />
        </Rect>
        <Rect ref={cardLevel} position={[290, -160]} width={520} height={130} radius={16} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'按层合并'} />
        </Rect>
        <Txt ref={userSize} position={[-290, -60]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'HBase'} opacity={0} />
        <Txt ref={userLevel} position={[290, -60]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'LevelDB、RocksDB'} opacity={0} />
        <Txt ref={userBoth} position={[0, -10]} fontSize={SIZE.label} fill={T.purple} fontFamily={FONT.sans} text={'Cassandra：两者都支持'} opacity={0} />
        {[0, 1, 2].map(i => (
          <Rect
            key={`ss-${i}`}
            ref={smallSegs[i]}
            position={[-360 + i * 180, 110]}
            width={160}
            height={80}
            radius={12}
            fill={T.card}
            stroke={T.blue}
            lineWidth={2}
            opacity={0}
          >
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={['新段', '小段', '小段'][i]} />
          </Rect>
        ))}
        <Rect ref={bigSeg} position={[330, 110]} width={180} height={80} radius={12} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'大段'} />
        </Rect>
        {[0, 1, 2].map(i => (
          <Rect
            key={`lv-${i}`}
            ref={levels[i]}
            position={[0, 60 + i * 70]}
            width={900 - i * 200}
            height={56}
            radius={12}
            fill={T.card}
            stroke={T.green}
            lineWidth={2}
            opacity={0}
          >
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={['层 0：新数据', '层 1', '层 2：旧数据'][i]} />
          </Rect>
        ))}
        {[0, 1].map(i => (
          <Circle key={`ld-${i}`} ref={levelDots[i]} position={[-430 + i * 100, 60 + i * 70]} width={22} height={22} fill={T.yellow} opacity={0} />
        ))}
      </Node>

      {/* 第 2 页 */}
      <Node ref={p2} opacity={0}>
        <Rect ref={bigData} position={[0, -120]} width={900} height={150} radius={16} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'数据集：比内存大得多'} />
        </Rect>
        <Rect ref={smallMem} position={[0, 10]} width={260} height={80} radius={14} fill={T.card} stroke={T.yellow} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'内存'} />
        </Rect>
        <Rect ref={rangeBox} position={[0, -60]} width={1000} height={120} radius={14} fill={T.card} stroke={T.green} lineWidth={2} opacity={0} />
        {['handbag', 'handcuffs', 'handful', 'handicap', 'handiwork', 'handkerchief'].map((k, i) => (
          <Txt key={`rk-${i}`} ref={rangeKeys[i]} position={[-420 + i * 168, -60]} fontSize={19} fill={T.text} fontFamily={FONT.mono} text={k} opacity={0} />
        ))}
        <Txt ref={rangeLab} position={[0, 30]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} text={'大于最小值，不大于最大值'} opacity={0} />
        <Txt ref={simpleLab} position={[0, 130]} fontSize={SIZE.body} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'简单有效'} opacity={0} />
        <Line ref={writeArrow} points={[[-480, 205], [480, 205]]} stroke={T.blue} lineWidth={4} endArrow opacity={0} />
        <Rect ref={speedBar} position={[0, 245]} width={900} height={26} radius={13} fill={T.card} stroke={T.line} lineWidth={2} opacity={0} />
        <Rect ref={speedFill} position={[-450, 245]} offset={[-1, 0]} width={60} height={26} radius={13} fill={T.green} opacity={0} />
      </Node>

      {/* 第 3 页 */}
      <Node ref={p3} opacity={0}>
        {[0, 1, 2, 3].map(i => (
          <Rect
            key={`cat-${i}`}
            ref={catCards[i]}
            position={[-450 + i * 300, -120]}
            width={260}
            height={150}
            radius={16}
            fill={T.card}
            stroke={T.blue}
            lineWidth={2}
            opacity={0}
          >
            <Txt position={[0, -40]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.mono} text={['mew', 'purr', 'yawn', 'scratch'][i]} />
            <Txt ref={catVals[i]} position={[0, 30]} fontSize={SIZE.title} fontWeight={700} fill={T.yellow} fontFamily={FONT.mono} text={['1087', '2114', '511', '252'][i]} opacity={0} />
          </Rect>
        ))}
        <Rect ref={outSeg} position={[0, 60]} width={1000} height={90} radius={14} fill={T.card} stroke={T.green} lineWidth={2} opacity={0} />
        {[0, 1, 2, 3].map(i => (
          <Txt key={`ok-${i}`} ref={outKeys[i]} position={[-375 + i * 250, 60]} fontSize={20} fill={T.text} fontFamily={FONT.mono} text={['mew:1087', 'purr:2114', 'scratch:252', 'yawn:511'][i]} opacity={0} />
        ))}
        <Rect ref={closeCard} position={[0, 170]} width={1000} height={80} radius={14} fill={T.card} stroke={T.yellow} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'稀疏索引 + 顺序写'} />
        </Rect>
        <Txt ref={closeLab} position={[0, 230]} fontSize={SIZE.label} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'大而有序，写快'} opacity={0} />
      </Node>
    </>
  );

  say('两种压缩策略');
  yield* beat('b24a',
    all(p1().opacity(1, 0.5), cardSize().opacity(1, 0.5), cardLevel().opacity(1, 0.5)),
    at('按大小合并', cardSize().stroke(T.yellow, 0.4)),
    at('按层合并', cardLevel().stroke(T.yellow, 0.4)),
  );

  say('LevelDB 的层');
  yield* beat('b24b',
    at('LevelDB', chain(userLevel().opacity(1, 0.5), userSize().opacity(1, 0.5))),
    at('HBase', userBoth().opacity(1, 0.5)),
    at('两者都支持', userBoth().fill(T.yellow, 0.4)),
  );

  say('小段并进大段');
  yield* beat('b25a',
    all(cardSize().opacity(0, 0.4), cardLevel().opacity(0, 0.4), userSize().opacity(0, 0.4), userLevel().opacity(0, 0.4), userBoth().opacity(0, 0.4)),
    at('陆续', chain(smallSegs[0]().opacity(1, 0.4), smallSegs[1]().opacity(1, 0.4), smallSegs[2]().opacity(1, 0.4), bigSeg().opacity(1, 0.4))),
    at('并进', chain(
      all(smallSegs[0]().position([330, 110], 0.45), smallSegs[0]().opacity(0, 0.45)),
      all(smallSegs[1]().position([330, 110], 0.45), smallSegs[1]().opacity(0, 0.45)),
      all(smallSegs[2]().position([330, 110], 0.45), smallSegs[2]().opacity(0, 0.45)),
    )),
    at('较旧较大的段', bigSeg().scale(1.15, 0.8)),
  );

  say('键切小段，旧数据下移');
  yield* beat('b25b',
    all(smallSegs[0]().opacity(0, 0.4), smallSegs[1]().opacity(0, 0.4), smallSegs[2]().opacity(0, 0.4), bigSeg().opacity(0, 0.4)),
    at('切成更小的段', chain(levels[0]().opacity(1, 0.4), levels[1]().opacity(1, 0.4), levels[2]().opacity(1, 0.4))),
    at('移到单独的层', chain(levelDots[0]().opacity(1, 0.4), levelDots[0]().position([-330, 130], 1.2), levelDots[0]().position([-230, 200], 1.2))),
    at('更增量', levels[2]().stroke(T.yellow, 0.5)),
  );

  say('大而有序，照样工作');
  yield* beat('b26a',
    all(p1().opacity(0, 0.5), p2().opacity(1, 0.5)),
    at('大得多', chain(bigData().opacity(1, 0.5), smallMem().opacity(1, 0.5))),
  );

  say('简单有效');
  yield* beat('b26a3',
    all(simpleLab().opacity(1, 0.5)),
  );

  say('范围能扫');
  yield* beat('b26a2',
    all(bigData().opacity(0, 0.4), smallMem().opacity(0, 0.4), simpleLab().opacity(0, 0.4), rangeBox().opacity(1, 0.5)),
    at('排好序', chain(rangeKeys[0]().opacity(1, 0.3), rangeKeys[1]().opacity(1, 0.3), rangeKeys[2]().opacity(1, 0.3), rangeKeys[3]().opacity(1, 0.3), rangeKeys[4]().opacity(1, 0.3), rangeKeys[5]().opacity(1, 0.3))),
  );

  say('大于最小，不大于最大');
  yield* beat('b26b',
    at('最小值', all(rangeKeys[0]().fill(T.yellow, 0.4), rangeKeys[1]().fill(T.yellow, 0.4))),
    at('最大值', all(rangeKeys[4]().fill(T.yellow, 0.4), rangeKeys[5]().fill(T.yellow, 0.4), rangeLab().opacity(1, 0.5))),
  );

  say('顺序写，吞吐高');
  yield* beat('b27',
    all(rangeBox().opacity(0, 0.4), rangeKeys[0]().opacity(0, 0.3), rangeKeys[1]().opacity(0, 0.3), rangeKeys[2]().opacity(0, 0.3), rangeKeys[3]().opacity(0, 0.3), rangeKeys[4]().opacity(0, 0.3), rangeKeys[5]().opacity(0, 0.3), rangeLab().opacity(0, 0.4)),
    at('顺序', chain(writeArrow().opacity(1, 0.5), speedBar().opacity(1, 0.4), speedFill().opacity(1, 0.4), speedFill().width(880, 1.6))),
  );

  say('还是只留最新值');
  yield* beat('b28',
    all(p2().opacity(0, 0.5), p3().opacity(1, 0.5)),
    at('猫视频', chain(catCards[0]().opacity(1, 0.3), catCards[1]().opacity(1, 0.3), catCards[2]().opacity(1, 0.3), catCards[3]().opacity(1, 0.3))),
    at('最新值', chain(catVals[0]().opacity(1, 0.3), catVals[1]().opacity(1, 0.3), catVals[2]().opacity(1, 0.3), catVals[3]().opacity(1, 0.3), outSeg().opacity(1, 0.5))),
    at('排好了序', chain(outKeys[0]().opacity(1, 0.3), outKeys[1]().opacity(1, 0.3), outKeys[2]().opacity(1, 0.3), outKeys[3]().opacity(1, 0.3))),
  );

  say('大而有序，写快');
  yield* beat('b29',
    all(catCards[0]().opacity(0, 0.4), catCards[1]().opacity(0, 0.4), catCards[2]().opacity(0, 0.4), catCards[3]().opacity(0, 0.4), outSeg().opacity(0, 0.4)),
    at('排好序', chain(closeCard().opacity(1, 0.6), closeLab().opacity(1, 0.5))),
    at('完整形态', closeCard().scale(1.03, 1.2)),
  );
});
