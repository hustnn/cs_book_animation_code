// U3 场景 3（MC）：b14a–b23b —— 排序从内存树来、写先进 memtable、几 MB 刷盘、
// 读先内存后磁盘、后台合并、崩溃靠日志恢复、LevelDB / RocksDB / Cassandra / HBase、
// LSM 树之名、Lucene 词典、查不存在的键、布隆过滤器。
// 分镜：skill-ch03/beats-u3.md；原文：DDIA §3.3（书页 p77–79，PDF p99–101）。
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

  // ---- 第 1 页：内存树 + 写 / 刷盘 / 读 ----
  const p1 = createRef<Node>();
  const writeArrows = [0, 1, 2].map(() => createRef<Line>());
  const treeBox = createRef<Rect>();
  const treeTitle = createRef<Txt>();
  const treeKeys = ['handbag', 'handcuffs', 'handful', 'handicap'].map(() => createRef<Txt>());
  const memLabel = createRef<Txt>();
  const fillBar = createRef<Rect>();
  const newTree = createRef<Rect>();
  const segNew = createRef<Rect>();
  const segOld = createRef<Rect>();
  const gearChip = createRef<Rect>();
  const mergeArrow = createRef<Line>();

  // ---- 第 2 页：崩溃与日志 ----
  const p2 = createRef<Node>();
  const bolt = createRef<Txt>();
  const lostLab = createRef<Txt>();
  const logBar = createRef<Rect>();
  const logLab = createRef<Txt>();
  const logEntries = [0, 1, 2].map(() => createRef<Rect>());
  const crashMem = createRef<Rect>();
  const rebuilt = createRef<Txt>();

  // ---- 第 3 页：产品点名 + LSM 之名 + Lucene ----
  const p3 = createRef<Node>();
  const plates = [0, 1, 2, 3].map(() => createRef<Rect>());
  const bigPlate = createRef<Rect>();
  const lsmPlate = createRef<Rect>();
  const lsmSub = createRef<Txt>();
  const termCard = createRef<Rect>();
  const postings = [0, 1, 2, 3].map(() => createRef<Rect>());
  const dictSeg = createRef<Rect>();

  // ---- 第 4 页：查不存在的键 + 布隆过滤器 ----
  const p4 = createRef<Node>();
  const missSegs = [0, 1, 2, 3].map(() => createRef<Rect>());
  const missDot = createRef<Circle>();
  const diskTags = [0, 1, 2, 3].map(() => createRef<Txt>());
  const bloomCard = createRef<Rect>();
  const blockedKey = createRef<Txt>();
  const savedLab = createRef<Txt>();

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
        {[0, 1, 2].map(i => (
          <Line
            key={`wa-${i}`}
            ref={writeArrows[i]}
            points={[[-480 + i * 60, 200], [-240, -60 + i * 40]]}
            stroke={T.blue}
            lineWidth={3}
            endArrow
            opacity={0}
          />
        ))}
        <Rect ref={treeBox} position={[0, -80]} width={520} height={260} radius={16} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt ref={treeTitle} position={[0, -100]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'内存里的平衡树'} opacity={0} />
          {['handbag', 'handcuffs', 'handful', 'handicap'].map((k, i) => (
            <Txt key={`tk-${i}`} ref={treeKeys[i]} position={[0, -50 + i * 45]} fontSize={20} fill={T.text} fontFamily={FONT.mono} text={k} opacity={0} />
          ))}
        </Rect>
        <Txt ref={memLabel} position={[0, 90]} fontSize={SIZE.body} fontWeight={700} fill={T.purple} fontFamily={FONT.mono} text={'memtable'} opacity={0} />
        <Rect ref={fillBar} position={[-260, 130]} offset={[-1, 0]} width={60} height={26} radius={13} fill={T.yellow} opacity={0} />
        <Rect ref={newTree} position={[330, -80]} width={300} height={260} radius={16} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} text={'新的内存树'} />
        </Rect>
        <Rect ref={segNew} position={[-330, -80]} width={300} height={120} radius={14} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'最新段'} />
        </Rect>
        <Rect ref={segOld} position={[-330, 80]} width={300} height={120} radius={14} fill={T.card} stroke={T.line} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'次旧段'} />
        </Rect>
        <Rect ref={gearChip} position={[330, 80]} width={300} height={120} radius={14} fill={T.card} stroke={T.purple} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.purple} fontFamily={FONT.sans} text={'后台合并压缩'} />
        </Rect>
        <Line ref={mergeArrow} points={[[180, 80], [-180, 80]]} stroke={T.purple} lineWidth={3} endArrow opacity={0} />
      </Node>

      {/* 第 2 页 */}
      <Node ref={p2} opacity={0}>
        <Txt ref={bolt} position={[0, -180]} fontSize={90} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'!'} opacity={0} />
        <Txt ref={lostLab} position={[0, -80]} fontSize={SIZE.body} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'内存里的最新写丢了'} opacity={0} />
        <Txt ref={logLab} position={[0, -25]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'磁盘上的日志：只用来恢复'} opacity={0} />
        <Rect ref={logBar} position={[0, 40]} width={900} height={70} radius={12} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
        </Rect>
        {[0, 1, 2].map(i => (
          <Rect
            key={`le-${i}`}
            ref={logEntries[i]}
            position={[-300 + i * 300, 40]}
            width={240}
            height={40}
            radius={8}
            fill={T.card}
            stroke={T.green}
            lineWidth={2}
            opacity={0}
          >
            <Txt fontSize={17} fill={T.text} fontFamily={FONT.mono} text={`写 ${i + 1}`} />
          </Rect>
        ))}
        <Rect ref={crashMem} position={[0, 170]} width={520} height={80} radius={14} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'内存树'} />
        </Rect>
        <Txt ref={rebuilt} position={[0, 230]} fontSize={SIZE.label} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'从日志恢复了'} opacity={0} />
      </Node>

      {/* 第 3 页 */}
      <Node ref={p3} opacity={0}>
        {['LevelDB', 'RocksDB', 'Cassandra', 'HBase'].map((name, i) => (
          <Rect
            key={`pl-${i}`}
            ref={plates[i]}
            position={[-450 + i * 300, -140]}
            width={260}
            height={90}
            radius={14}
            fill={T.card}
            stroke={T.blue}
            lineWidth={2}
            opacity={0}
          >
            <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.mono} text={name} />
          </Rect>
        ))}
        <Rect ref={bigPlate} position={[0, -20]} width={500} height={90} radius={14} fill={T.card} stroke={T.purple} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.purple} fontFamily={FONT.mono} text={'Bigtable'} />
        </Rect>
        <Rect ref={lsmPlate} position={[0, 110]} width={560} height={90} radius={14} fill={T.card} stroke={T.yellow} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'日志结构合并树'} />
        </Rect>
        <Txt ref={lsmSub} position={[0, 175]} fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.mono} text={'LSM 树'} opacity={0} />
        <Rect ref={termCard} position={[-330, -40]} width={300} height={110} radius={14} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'词'} />
        </Rect>
        {['文档 3', '文档 7', '文档 12', '文档 25'].map((d, i) => (
          <Rect
            key={`po-${i}`}
            ref={postings[i]}
            position={[330, -140 + i * 70]}
            width={280}
            height={52}
            radius={10}
            fill={T.card}
            stroke={T.green}
            lineWidth={2}
            opacity={0}
          >
            <Txt fontSize={20} fill={T.text} fontFamily={FONT.sans} text={d} />
          </Rect>
        ))}
        <Rect ref={dictSeg} position={[0, 190]} width={700} height={60} radius={12} fill={T.card} stroke={T.line} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'词典段：后台按需合并'} />
        </Rect>
      </Node>

      {/* 第 4 页 */}
      <Node ref={p4} opacity={0}>
        {['内存树', '最新段', '次新段', '最旧的段'].map((name, i) => (
          <Rect
            key={`ms-${i}`}
            ref={missSegs[i]}
            position={[-450 + i * 300, -100]}
            width={260}
            height={130}
            radius={14}
            fill={T.card}
            stroke={T.blue}
            lineWidth={2}
            opacity={0}
          >
            <Txt position={[0, -30]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={name} />
            <Txt ref={diskTags[i]} position={[0, 30]} fontSize={SIZE.label} fill={T.red} fontFamily={FONT.sans} text={'读盘'} opacity={0} />
          </Rect>
        ))}
        <Circle ref={missDot} position={[-450, -100]} width={26} height={26} fill={T.yellow} opacity={0} />
        <Rect ref={bloomCard} position={[0, 90]} width={480} height={90} radius={14} fill={T.card} stroke={T.purple} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.purple} fontFamily={FONT.sans} text={'布隆过滤器'} />
        </Rect>
        <Txt ref={blockedKey} position={[0, 170]} fontSize={SIZE.label} fontWeight={700} fill={T.red} fontFamily={FONT.mono} text={'handzz：不在'} opacity={0} />
        <Txt ref={savedLab} position={[0, 230]} fontSize={SIZE.label} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'省掉不必要的磁盘读'} opacity={0} />
      </Node>
    </>
  );

  say('内存里排好序');
  yield* beat('b14a',
    all(p1().opacity(1, 0.5), treeBox().opacity(1, 0.5)),
    at('顺序任意', chain(writeArrows[0]().opacity(1, 0.4), writeArrows[1]().opacity(1, 0.4), writeArrows[2]().opacity(1, 0.4))),
  );

  say('内存里排好序');
  yield* beat('b14b',
    all(treeBox().opacity(1, 0.5), treeTitle().opacity(1, 0.4)),
    at('容易得多', chain(treeKeys[0]().opacity(1, 0.3), treeKeys[1]().opacity(1, 0.3), treeKeys[2]().opacity(1, 0.3), treeKeys[3]().opacity(1, 0.3))),
  );

  say('写先进内存树');
  yield* beat('b15a',
    all(writeArrows[0]().opacity(0, 0.4), writeArrows[1]().opacity(0, 0.4), writeArrows[2]().opacity(0, 0.4)),
    at('memtable', memLabel().opacity(1, 0.5)),
  );

  say('几 MB 就刷盘');
  yield* beat('b15b',
    at('几 MB', chain(fillBar().opacity(1, 0.4), fillBar().width(520, 2.0))),
    at('新树', all(treeBox().opacity(0, 0.6), segNew().opacity(1, 0.5), newTree().opacity(1, 0.5))),
  );

  say('先内存，再新段');
  yield* beat('b16',
    all(fillBar().opacity(0, 0.4), memLabel().opacity(0, 0.4), segOld().opacity(1, 0.5)),
    at('内存树', newTree().stroke(T.yellow, 0.4)),
    at('最新段', chain(segNew().stroke(T.yellow, 0.4), newTree().stroke(T.green, 0.4))),
    at('次旧段', chain(segOld().stroke(T.yellow, 0.4), segNew().stroke(T.green, 0.4))),
  );

  say('后台合并压缩');
  yield* beat('b17',
    at('后台', chain(gearChip().opacity(1, 0.5), mergeArrow().opacity(1, 0.5))),
    at('丢掉', chain(gearChip().scale(1.04, 0.6), segOld().opacity(0.35, 0.6))),
  );

  say('崩溃丢内存');
  yield* beat('b18a',
    all(p1().opacity(0, 0.5), p2().opacity(1, 0.5)),
    at('崩溃', chain(bolt().opacity(1, 0.5), lostLab().opacity(1, 0.5))),
  );

  say('每次写，立即追加');
  yield* beat('b18c',
    all(bolt().opacity(0, 0.4), lostLab().opacity(0, 0.4), logBar().opacity(1, 0.5), logLab().opacity(1, 0.4)),
    at('追加', chain(logEntries[0]().opacity(1, 0.4), logEntries[1]().opacity(1, 0.4), logEntries[2]().opacity(1, 0.4))),
  );

  say('日志只用来恢复');
  yield* beat('b18d',
    at('恢复', chain(crashMem().opacity(1, 0.5), rebuilt().opacity(1, 0.5))),
    at('丢掉', all(logBar().opacity(0.3, 0.6), logEntries[0]().opacity(0.15, 0.6), logEntries[1]().opacity(0.15, 0.6), logEntries[2]().opacity(0.15, 0.6))),
  );

  say('LevelDB、RocksDB 等');
  yield* beat('b19',
    all(p2().opacity(0, 0.5), p3().opacity(1, 0.5)),
    at('LevelDB', chain(plates[0]().opacity(1, 0.4), plates[1]().opacity(1, 0.4))),
    at('Cassandra', chain(plates[2]().opacity(1, 0.4), plates[3]().opacity(1, 0.4))),
    at('Bigtable', bigPlate().opacity(1, 0.5)),
  );

  say('LSM 树');
  yield* beat('b20',
    all(plates[0]().opacity(0, 0.4), plates[1]().opacity(0, 0.4), plates[2]().opacity(0, 0.4), plates[3]().opacity(0, 0.4), bigPlate().opacity(0, 0.4)),
    at('日志结构合并树', chain(lsmPlate().opacity(1, 0.5), lsmSub().opacity(1, 0.5))),
    at('LSM 存储引擎', lsmPlate().scale(1.03, 1.5)),
  );

  say('词 → 文档编号列表');
  yield* beat('b21',
    all(lsmPlate().opacity(0, 0.4), lsmSub().opacity(0, 0.4), termCard().opacity(1, 0.5)),
    at('文档编号', chain(postings[0]().opacity(1, 0.3), postings[1]().opacity(1, 0.3), postings[2]().opacity(1, 0.3), postings[3]().opacity(1, 0.3))),
    at('词典', dictSeg().opacity(1, 0.5)),
  );

  say('查到底才敢说没有');
  yield* beat('b22a',
    all(p3().opacity(0, 0.5), p4().opacity(1, 0.5)),
    at('内存树', chain(missSegs[0]().opacity(1, 0.4), missDot().opacity(1, 0.4))),
    at('最旧的段', all(missSegs[1]().opacity(1, 0.4), missSegs[2]().opacity(1, 0.4), missSegs[3]().opacity(1, 0.4), missDot().position([450, -100], 1.6))),
  );

  say('每段都可能读盘');
  yield* beat('b22b',
    at('读一次磁盘', chain(diskTags[0]().opacity(1, 0.25), diskTags[1]().opacity(1, 0.25), diskTags[2]().opacity(1, 0.25), diskTags[3]().opacity(1, 0.25))),
  );

  say('先问过滤器');
  yield* beat('b23a',
    all(diskTags[0]().opacity(0, 0.3), diskTags[1]().opacity(0, 0.3), diskTags[2]().opacity(0, 0.3), diskTags[3]().opacity(0, 0.3)),
    at('布隆过滤器', bloomCard().opacity(1, 0.5)),
    at('近似记着', blockedKey().opacity(1, 0.5)),
  );

  say('键不在，省磁盘读');
  yield* beat('b23b',
    at('键不在', chain(blockedKey().fill(T.green, 0.4), savedLab().opacity(1, 0.5))),
    at('磁盘上找', missDot().opacity(0, 0.6)),
  );
});
