// U3 场景 2（MC）：b8–b13 —— 新段赢旧段丢、稀疏索引找 handiwork、几 KB 扫过、
// 二分查找脚注、块压缩。原图 3-5 按处置“改编”：稀疏索引表（hammock 100491、
// handbag 102134、handsome 104667、hangout 106812）与阴影块 9 个键按原图重新生成，
// 静态对照改成逐步演出：先跳到 handbag 的索引项，再在块内逐格扫到 handiwork。
// 分镜：skill-ch03/beats-u3.md；原文：DDIA §3.3（书页 p76–77，PDF p98–99）。
// 时长全部来自 timeline/u3.json（beat() 驱动），不手写 waitFor。
import {Circle, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, chain, createRef} from '@motion-canvas/core';
import {at, makeBeats} from '../../lib/beats';
import {FONT, SAFE, SIZE, T} from '../../lib/theme';
import timeline from '../../timeline/u3.json';

// b8 三段新旧对照（每段 3 个键；段 3 最新）
const WIN_ROWS = [
  ['handful:44662', 'handicap:70836', 'handiwork:45521'],
  ['handful:42307', 'handicap:67884', 'handiwork:16912'],
  ['handful:40308', 'handicap:65995', 'handkerchief:16324'],
];
// 原图 3-5 阴影块的 9 个键（与合并结果相同）
const BLOCK = [
  'handbag:8786', 'handcuffs:2729', 'handful:44662',
  'handicap:70836', 'handiwork:45521', 'handkerchief:20952',
  'handlebars:3869', 'handoff:5741', 'handprinted:33632',
];
// 原图 3-5 稀疏索引
const INDEX_ROWS: [string, string][] = [
  ['hammock', '100491'],
  ['handbag', '102134'],
  ['handsome', '104667'],
  ['hangout', '106812'],
];
const blockPos = (i: number): [number, number] => [170 - 198 + (i % 3) * 198, -120 + Math.floor(i / 3) * 60];

export default makeScene2D(function* (view) {
  view.fill(T.bg);
  const beat = makeBeats(timeline);

  const header = createRef<Txt>();
  const anchor = createRef<Txt>();
  const say = (text: string) => anchor().text(text);

  // ---- 第 1 页：新段赢，旧段丢 ----
  const p1 = createRef<Node>();
  const winRows = [0, 1, 2].map(() => createRef<Node>());
  const winCells = WIN_ROWS.map(row => row.map(() => createRef<Rect>()));
  const winLabs = [0, 1, 2].map(() => createRef<Txt>());

  // ---- 第 2 页：稀疏索引（原图 3-5）----
  const p2 = createRef<Node>();
  const idxBox = createRef<Rect>();
  const idxTitle = createRef<Txt>();
  const idxRows = INDEX_ROWS.map(() => createRef<Node>());
  const idxKeys = INDEX_ROWS.map(() => createRef<Txt>());
  const idxOffs = INDEX_ROWS.map(() => createRef<Txt>());
  const dotsTop = createRef<Txt>();
  const dotsBot = createRef<Txt>();
  const topKey = createRef<Txt>();
  const blockBox = createRef<Rect>();
  const blockCells = BLOCK.map(() => createRef<Rect>());
  const botCells = ['handsome:86478', 'handwaving:44005', 'handwriting:22846'].map(() => createRef<Rect>());
  const jumpArrow = createRef<Line>();
  const blockLab = createRef<Txt>();
  const kbBar = createRef<Rect>();
  const kbFill = createRef<Rect>();
  const kbLab = createRef<Txt>();

  // ---- 第 3 页：二分查找与块压缩 ----
  const p3 = createRef<Node>();
  const fixRow = [0, 1, 2, 3, 4, 5].map(() => createRef<Rect>());
  const binArrow = createRef<Line>();
  const binLab = createRef<Txt>();
  const varRow = [0, 1, 2, 3].map(() => createRef<Rect>());
  const varX = createRef<Txt>();
  const compBox = createRef<Rect>();
  const saveLab = createRef<Txt>();
  const bwLab = createRef<Txt>();

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
        {WIN_ROWS.map((row, r) => (
          <Node key={`win-${r}`} ref={winRows[r]} opacity={0}>
            <Txt ref={winLabs[r]} position={[-540, -180 + r * 110]} fontSize={20} fill={r === 0 ? T.green : T.muted} fontFamily={FONT.sans} text={['最新段', '次新段', '更旧的段'][r]} />
            {row.map((v, i) => (
              <Rect
                key={`w${r}-${i}`}
                ref={winCells[r][i]}
                position={[-300 + i * 300, -180 + r * 110]}
                width={260}
                height={56}
                radius={10}
                fill={T.card}
                stroke={r === 0 ? T.green : T.blue}
                lineWidth={2}
              >
                <Txt fontSize={17} fill={T.text} fontFamily={FONT.mono} text={v} />
              </Rect>
            ))}
          </Node>
        ))}
      </Node>

      {/* 第 2 页：稀疏索引 */}
      <Node ref={p2} opacity={0}>
        <Rect ref={idxBox} position={[-390, -60]} width={340} height={340} radius={16} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt ref={idxTitle} position={[0, -140]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'内存里的稀疏索引'} opacity={0} />
        </Rect>
        <Txt ref={dotsTop} position={[-390, -180]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.mono} text={'…'} opacity={0} />
        {INDEX_ROWS.map(([k, o], i) => (
          <Node key={`idx-${i}`} ref={idxRows[i]} opacity={0}>
            <Txt ref={idxKeys[i]} position={[-500, -110 + i * 55]} fontSize={20} fill={T.text} fontFamily={FONT.mono} text={k} />
            <Txt ref={idxOffs[i]} position={[-280, -110 + i * 55]} fontSize={20} fill={T.muted} fontFamily={FONT.mono} text={o} />
          </Node>
        ))}
        <Txt ref={dotsBot} position={[-390, 140]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.mono} text={'…'} opacity={0} />
        <Txt ref={topKey} position={[170, -210]} fontSize={20} fill={T.muted} fontFamily={FONT.mono} text={'……  hand:91541'} opacity={0} />
        <Rect ref={blockBox} position={[170, -60]} width={640} height={200} radius={14} fill={T.card} stroke={T.line} lineWidth={2} opacity={0} />
        {BLOCK.map((v, i) => (
          <Rect
            key={`blk-${i}`}
            ref={blockCells[i]}
            position={blockPos(i)}
            width={190}
            height={52}
            radius={8}
            fill={T.card}
            stroke={T.blue}
            lineWidth={2}
            opacity={0}
          >
            <Txt fontSize={16} fill={T.text} fontFamily={FONT.mono} text={v} />
          </Rect>
        ))}
        {['handsome:86478', 'handwaving:44005', 'handwriting:22846'].map((v, i) => (
          <Rect
            key={`bot-${i}`}
            ref={botCells[i]}
            position={[170 - 198 + i * 198, 110]}
            width={190}
            height={52}
            radius={8}
            fill={T.card}
            stroke={T.line}
            lineWidth={2}
            opacity={0}
          >
            <Txt fontSize={16} fill={T.text} fontFamily={FONT.mono} text={v} />
          </Rect>
        ))}
        <Txt ref={blockLab} position={[170, 170]} fontSize={20} fill={T.muted} fontFamily={FONT.sans} text={'可压缩块'} opacity={0} />
        <Line ref={jumpArrow} points={[[-215, -55], [-130, -120]]} stroke={T.yellow} lineWidth={3} endArrow opacity={0} />
        <Rect ref={kbBar} position={[0, 220]} width={900} height={30} radius={15} fill={T.card} stroke={T.line} lineWidth={2} opacity={0} />
        <Rect ref={kbFill} position={[-450, 220]} offset={[-1, 0]} width={60} height={30} radius={15} fill={T.green} opacity={0} />
        <Txt ref={kbLab} position={[0, 180]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} text={'几 KB，一扫而过'} opacity={0} />
      </Node>

      {/* 第 3 页 */}
      <Node ref={p3} opacity={0}>
        {[0, 1, 2, 3, 4, 5].map(i => (
          <Rect
            key={`fix-${i}`}
            ref={fixRow[i]}
            position={[-400 + i * 160, -160]}
            width={140}
            height={56}
            radius={10}
            fill={T.card}
            stroke={T.blue}
            lineWidth={2}
            opacity={0}
          >
            <Txt fontSize={17} fill={T.text} fontFamily={FONT.mono} text={`键 ${i + 1}`} />
          </Rect>
        ))}
        <Line ref={binArrow} points={[[-400, -220], [80, -220]]} stroke={T.yellow} lineWidth={3} endArrow opacity={0} />
        <Txt ref={binLab} position={[0, -260]} fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.sans} text={'二分查找：跳到中间'} opacity={0} />
        {[140, 220, 110, 260].map((w, i) => (
          <Rect
            key={`var-${i}`}
            ref={varRow[i]}
            position={[-420 + [0, 160, 400, 530][i] + w / 2 - 0, -20]}
            width={w}
            height={56}
            radius={10}
            fill={T.card}
            stroke={T.red}
            lineWidth={2}
            opacity={0}
          >
            <Txt fontSize={17} fill={T.text} fontFamily={FONT.mono} text={['长短不一', '变长', '难定界', '×'][i]} />
          </Rect>
        ))}
        <Txt ref={varX} position={[0, 60]} fontSize={SIZE.label} fill={T.red} fontFamily={FONT.sans} text={'变长，难定界'} opacity={0} />
        <Rect ref={compBox} position={[0, 170]} width={700} height={70} radius={14} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'整块压缩再写盘'} />
        </Rect>
        <Txt ref={saveLab} position={[-260, 230]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} text={'省空间'} opacity={0} />
        <Txt ref={bwLab} position={[260, 230]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} text={'省读写带宽'} opacity={0} />
      </Node>
    </>
  );

  say('新段赢，旧段丢');
  yield* beat('b8',
    all(p1().opacity(1, 0.5), winRows[0]().opacity(1, 0.4), winRows[1]().opacity(1, 0.4), winRows[2]().opacity(1, 0.4)),
    at('相邻的段', all(winLabs[0]().fill(T.yellow, 0.4), winLabs[1]().fill(T.yellow, 0.4), winLabs[2]().fill(T.yellow, 0.4))),
    at('最新段', all(winCells[0][0]().stroke(T.yellow, 0.4), winLabs[0]().fill(T.yellow, 0.4))),
    at('丢旧段', all(winCells[1][0]().opacity(0.25, 0.6), winCells[2][0]().opacity(0.25, 0.6))),
  );

  say('不用记住所有键');
  yield* beat('b9a',
    all(p1().opacity(0, 0.5), p2().opacity(1, 0.5)),
    at('内存', chain(idxBox().opacity(1, 0.5), idxTitle().opacity(1, 0.4))),
    at('所有键', chain(blockBox().opacity(1, 0.5), blockCells[4]().opacity(1, 0.4), blockCells[4]().stroke(T.yellow, 0.4))),
  );

  say('夹在两者之间');
  yield* beat('b9b',
    at('handbag', all(idxRows[1]().opacity(1, 0.4), idxKeys[1]().fill(T.yellow, 0.4))),
    at('handsome', all(idxRows[2]().opacity(1, 0.4), idxKeys[2]().fill(T.yellow, 0.4))),
    at('夹在中间', chain(blockCells[4]().stroke(T.blue, 0.4), blockCells[1]().opacity(1, 0.3), blockCells[2]().opacity(1, 0.3), blockCells[3]().opacity(1, 0.3))),
  );

  say('稀疏索引');
  yield* beat('b10a',
    all(
      chain(idxRows[0]().opacity(1, 0.4), idxRows[3]().opacity(1, 0.4)),
      chain(dotsTop().opacity(1, 0.4), dotsBot().opacity(1, 0.4), topKey().opacity(1, 0.4)),
      chain(blockCells[0]().opacity(1, 0.4), blockCells[5]().opacity(1, 0.4), blockCells[6]().opacity(1, 0.4), blockCells[7]().opacity(1, 0.4), blockCells[8]().opacity(1, 0.4)),
      chain(botCells[0]().opacity(1, 0.4), botCells[1]().opacity(1, 0.4), botCells[2]().opacity(1, 0.4), blockLab().opacity(1, 0.4)),
    ),
    at('几个键', chain(idxKeys[0]().fill(T.yellow, 0.5), idxKeys[1]().fill(T.yellow, 0.5), idxKeys[2]().fill(T.yellow, 0.5), idxKeys[3]().fill(T.yellow, 0.5))),
    at('偏移', all(idxOffs[0]().fill(T.yellow, 0.4), idxOffs[1]().fill(T.yellow, 0.4), idxOffs[2]().fill(T.yellow, 0.4), idxOffs[3]().fill(T.yellow, 0.4))),
  );

  say('跳到 handbag，再扫');
  yield* beat('b10b',
    at('跳到', jumpArrow().opacity(1, 0.5)),
    at('逐格扫', chain(
      blockCells[1]().stroke(T.yellow, 0.4),
      blockCells[2]().stroke(T.yellow, 0.4),
      blockCells[3]().stroke(T.yellow, 0.4),
      blockCells[4]().stroke(T.yellow, 0.4),
    )),
    at('handiwork', all(blockCells[4]().stroke(T.green, 0.4), blockCells[4]().scale(1.06, 0.4))),
  );

  say('几 KB 一扫而过');
  yield* beat('b11',
    all(kbBar().opacity(1, 0.5), kbLab().opacity(1, 0.4)),
    at('几 KB', chain(kbFill().opacity(1, 0.4), kbFill().width(880, 2.2))),
    at('很快', kbFill().fill(T.yellow, 0.4)),
  );

  say('变长，难定界');
  yield* beat('b12',
    all(p2().opacity(0, 0.5), p3().opacity(1, 0.5)),
    at('固定大小', chain(fixRow[0]().opacity(1, 0.3), fixRow[1]().opacity(1, 0.3), fixRow[2]().opacity(1, 0.3), fixRow[3]().opacity(1, 0.3), fixRow[4]().opacity(1, 0.3), fixRow[5]().opacity(1, 0.3))),
    at('二分查找', all(binArrow().opacity(1, 0.5), binLab().opacity(1, 0.4))),
    at('变长', all(varRow[0]().opacity(1, 0.4), varRow[1]().opacity(1, 0.4), varRow[2]().opacity(1, 0.4), varRow[3]().opacity(1, 0.4), varX().opacity(1, 0.4))),
  );

  say('整块压缩，索引指块头');
  yield* beat('b13',
    at('编成一块', chain(compBox().opacity(1, 0.5), compBox().width(900, 1.5), compBox().width(700, 1.0))),
    at('压缩', saveLab().opacity(1, 0.5)),
    at('块头', bwLab().opacity(1, 0.5)),
  );
});
