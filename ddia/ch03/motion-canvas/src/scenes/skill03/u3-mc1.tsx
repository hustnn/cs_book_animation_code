// U3 场景 1（MC）：b1–b7b —— 钩子、段的顺序无关紧要、SSTable 定义、合并像归并排序、
// 原图 3-4 三段归并（按处置“改编”：数字与顺序按原图重新生成，静态对照改成逐步演出：
// 首键并排比较、最小键逐个抄进输出段，同键旧值变灰丢掉）。
// 分镜：skill-ch03/beats-u3.md；原文：DDIA §3.3（书页 p76–77，PDF p98–99）。
// 时长全部来自 timeline/u3.json（beat() 驱动），不手写 waitFor。
// 2026-11-24 注：r2 落盘 mp4 全片解码损坏（NAL 错误，62.00s ≠ 时间轴 66.71s），
// QA 报告（浏览器内检查）不受影响——故加此行改指纹强制重渲，渲后必须全片解码复核。
import {Circle, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, chain, createRef} from '@motion-canvas/core';
import {at, makeBeats} from '../../lib/beats';
import {FONT, SAFE, SIZE, T} from '../../lib/theme';
import timeline from '../../timeline/u3.json';

// 原图 3-4 的三段（每段 6 个键，已排好序；段 3 最新）
const S1 = [
  'handbag:8786', 'handful:40308', 'handicap:65995',
  'handkerchief:16324', 'handlebars:3869', 'handprinted:11150',
];
const S2 = [
  'handcuffs:2729', 'handful:42307', 'handicap:67884',
  'handiwork:16912', 'handkerchief:20952', 'handprinted:15725',
];
const S3 = [
  'handful:44662', 'handicap:70836', 'handiwork:45521',
  'handlebars:3869', 'handoff:5741', 'handprinted:33632',
];
const SEG_ROWS = [S1, S2, S3];
const segPos = (r: number, i: number): [number, number] => [-420 + i * 164, -210 + r * 60];
// 输出段 3 行 × 3 格（合并结果，同样排好序）
const outPos = (k: number): [number, number] => [-360 + (k % 3) * 360, 10 + Math.floor(k / 3) * 55];
// 合并顺序：输出格 k 取自哪段的第几个键
const OUT_SRC: [number, number][] = [
  [0, 0], [1, 0], [2, 0], [2, 1], [2, 2], [1, 4], [2, 3], [2, 4], [2, 5],
];

export default makeScene2D(function* (view) {
  view.fill(T.bg);
  const beat = makeBeats(timeline);

  const header = createRef<Txt>();
  const anchor = createRef<Txt>();
  const say = (text: string) => anchor().text(text);

  // ---- 第 1 页：钩子 + 顺序无关紧要 + SSTable 定义 ----
  const p0 = createRef<Node>();
  const g1 = createRef<Node>();
  const logBar = createRef<Rect>();
  const logDot = createRef<Circle>();
  const segChips = [0, 1, 2].map(() => createRef<Rect>());
  const hookQ = createRef<Txt>();
  const g2 = createRef<Node>();
  const rowALab = createRef<Txt>();
  const rowBLab = createRef<Txt>();
  const cellsA = [0, 1, 2].map(() => createRef<Rect>());
  const cellsB = [0, 1, 2].map(() => createRef<Rect>());
  const ACELLS = ['handful:40308', 'handbag:8786', 'handicap:65995'];
  const BCELLS = ['handful:44662', 'handcuffs:2729', 'handicap:70836'];
  const g3 = createRef<Node>();
  const sortCells = [0, 1, 2, 3, 4].map(() => createRef<Rect>());
  const SORT_KEYS = ['handiwork', 'handbag', 'handful', 'handicap', 'handcuffs'];
  const dupChip = createRef<Rect>();
  const namePlate = createRef<Rect>();

  // ---- 第 2 页：合并（原图 3-4）----
  const p1 = createRef<Node>();
  const bigFile = createRef<Rect>();
  const memBox = createRef<Rect>();
  const mergeSym = createRef<Txt>();
  const outLab = createRef<Txt>();
  const outBox = createRef<Rect>();
  const segRows = [0, 1, 2].map(() => createRef<Node>());
  const segCells = SEG_ROWS.map(row => row.map(() => createRef<Rect>()));
  const segLabs = [0, 1, 2].map(() => createRef<Txt>());

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
      <Node ref={p0} opacity={0}>
        <Node ref={g1} opacity={0}>
          <Rect ref={logBar} position={[0, -60]} width={1000} height={70} radius={12} fill={T.card} stroke={T.line} lineWidth={2}>
            <Txt fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'键值对日志：越写越长'} />
          </Rect>
          <Circle ref={logDot} position={[-480, -60]} width={24} height={24} fill={T.yellow} />
          {[0, 1, 2].map(i => (
            <Rect
              key={`chip-${i}`}
              ref={segChips[i]}
              position={[-340 + i * 340, 60]}
              width={300}
              height={70}
              radius={12}
              fill={T.card}
              stroke={T.blue}
              lineWidth={2}
              opacity={0}
            >
              <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={`段 ${i + 1}`} />
            </Rect>
          ))}
          <Txt ref={hookQ} position={[0, 170]} fontSize={72} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'?'} opacity={0} />
        </Node>

        <Node ref={g2} opacity={0}>
          <Txt ref={rowALab} position={[-540, -140]} fontSize={20} fill={T.muted} fontFamily={FONT.sans} text={'先写'} opacity={0} />
          <Txt ref={rowBLab} position={[-540, -40]} fontSize={20} fill={T.muted} fontFamily={FONT.sans} text={'后写'} opacity={0} />
          {ACELLS.map((v, i) => (
            <Rect
              key={`ca-${i}`}
              ref={cellsA[i]}
              position={[-300 + i * 300, -140]}
              width={260}
              height={56}
              radius={10}
              fill={T.card}
              stroke={T.blue}
              lineWidth={2}
              opacity={0}
            >
              <Txt fontSize={17} fill={T.text} fontFamily={FONT.mono} text={v} />
            </Rect>
          ))}
          {BCELLS.map((v, i) => (
            <Rect
              key={`cb-${i}`}
              ref={cellsB[i]}
              position={[-300 + i * 300, -40]}
              width={260}
              height={56}
              radius={10}
              fill={T.card}
              stroke={T.green}
              lineWidth={2}
              opacity={0}
            >
              <Txt fontSize={17} fill={T.text} fontFamily={FONT.mono} text={v} />
            </Rect>
          ))}
        </Node>

        <Node ref={g3} opacity={0}>
          {SORT_KEYS.map((v, i) => (
            <Rect
              key={`sc-${i}`}
              ref={sortCells[i]}
              position={[-440 + i * 220, -100]}
              width={200}
              height={56}
              radius={10}
              fill={T.card}
              stroke={T.blue}
              lineWidth={2}
              opacity={0}
            >
              <Txt fontSize={17} fill={T.text} fontFamily={FONT.mono} text={v} />
            </Rect>
          ))}
          <Rect ref={dupChip} position={[0, 10]} width={200} height={56} radius={10} fill={T.card} stroke={T.red} lineWidth={2} opacity={0}>
            <Txt fontSize={17} fill={T.text} fontFamily={FONT.mono} text={'handful ×2'} />
          </Rect>
          <Rect ref={namePlate} position={[0, 130]} width={360} height={80} radius={14} fill={T.card} stroke={T.purple} lineWidth={2} opacity={0}>
            <Txt fontSize={SIZE.body} fontWeight={700} fill={T.purple} fontFamily={FONT.mono} text={'SSTable'} />
          </Rect>
        </Node>
      </Node>

      {/* 第 2 页：合并 */}
      <Node ref={p1} opacity={0}>
        <Rect ref={bigFile} position={[0, -140]} width={760} height={90} radius={14} fill={T.card} stroke={T.line} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'要合并的文件：比内存大得多'} />
        </Rect>
        <Rect ref={memBox} position={[0, -20]} width={240} height={90} radius={14} fill={T.card} stroke={T.yellow} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'内存'} />
        </Rect>
        <Txt ref={mergeSym} position={[-545, -40]} fontSize={30} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'⊕'} opacity={0} />
        <Txt ref={outLab} position={[0, -45]} fontSize={20} fill={T.muted} fontFamily={FONT.sans} text={'输出段'} opacity={0} />
        <Rect ref={outBox} position={[0, 65]} width={1080} height={170} radius={14} fill={T.card} stroke={T.green} lineWidth={2} opacity={0} />
        {SEG_ROWS.map((row, r) => (
          <Node key={`segrow-${r}`} ref={segRows[r]} opacity={0}>
            <Txt ref={segLabs[r]} position={[-540, -210 + r * 60]} fontSize={18} fill={T.muted} fontFamily={FONT.sans} text={`段 ${r + 1}`} />
            {row.map((v, i) => (
              <Rect
                key={`s${r}-${i}`}
                ref={segCells[r][i]}
                position={segPos(r, i)}
                width={150}
                height={42}
                radius={8}
                fill={T.card}
                stroke={r === 2 ? T.green : T.blue}
                lineWidth={2}
              >
                <Txt fontSize={15} fill={T.text} fontFamily={FONT.mono} text={v} />
              </Rect>
            ))}
          </Node>
        ))}
      </Node>
    </>
  );

  say('段越攒越多，怎么收拾？');
  yield* beat('b1',
    all(p0().opacity(1, 0.5), g1().opacity(1, 0.5)),
    chain(logDot().position([480, -60], 1.8), segChips[0]().opacity(1, 0.4), segChips[1]().opacity(1, 0.4), segChips[2]().opacity(1, 0.4), hookQ().opacity(1, 0.4)),
  );

  say('后写的优先');
  yield* beat('b2a',
    all(g1().opacity(0, 0.5), g2().opacity(1, 0.5)),
    at('按写入的顺序', chain(cellsA[0]().opacity(1, 0.4), cellsA[1]().opacity(1, 0.4), cellsA[2]().opacity(1, 0.4), cellsB[0]().opacity(1, 0.4), cellsB[1]().opacity(1, 0.4), cellsB[2]().opacity(1, 0.4), rowALab().opacity(1, 0.4), rowBLab().opacity(1, 0.4))),
    at('后面的值优先', all(cellsA[0]().opacity(0.35, 0.6), cellsB[0]().stroke(T.yellow, 0.4))),
  );

  say('顺序无关紧要');
  yield* beat('b2b',
    at('顺序', chain(
      all(cellsA[0]().position([-300, -180], 0.3), cellsA[1]().position([0, -100], 0.3), cellsB[1]().position([0, -80], 0.3), cellsB[2]().position([300, 0], 0.3)),
      all(cellsA[0]().position([0, -180], 0.6), cellsA[1]().position([-300, -100], 0.6), cellsB[1]().position([300, -80], 0.6), cellsB[2]().position([0, 0], 0.6)),
      all(cellsA[0]().position([0, -140], 0.3), cellsA[1]().position([-300, -140], 0.3), cellsB[1]().position([300, -40], 0.3), cellsB[2]().position([0, -40], 0.3)),
    )),
    at('无关紧要', cellsB[0]().stroke(T.yellow, 0.4)),
  );

  say('按键排好序');
  yield* beat('b3a',
    all(g2().opacity(0, 0.5), g3().opacity(1, 0.5)),
    at('排好序', chain(
      all(sortCells[0]().opacity(1, 0.3), sortCells[1]().opacity(1, 0.3), sortCells[2]().opacity(1, 0.3), sortCells[3]().opacity(1, 0.3), sortCells[4]().opacity(1, 0.3)),
      all(
        sortCells[1]().position([-440, -100], 1.0),
        sortCells[4]().position([-220, -100], 1.0),
        sortCells[2]().position([0, -100], 1.0),
        sortCells[3]().position([220, -100], 1.0),
        sortCells[0]().position([440, -100], 1.0),
      ),
    )),
  );

  say('SSTable');
  yield* beat('b3b',
    at('只出现一次', chain(dupChip().opacity(1, 0.5), dupChip().opacity(0.2, 0.8))),
    at('排好序的表', chain(namePlate().opacity(1, 0.5), namePlate().scale(1.04, 0.6))),
  );

  say('文件比内存大也能合');
  yield* beat('b4a',
    all(p0().opacity(0, 0.5), p1().opacity(1, 0.5), bigFile().opacity(1, 0.5), memBox().opacity(1, 0.5)),
    at('比内存大', chain(bigFile().stroke(T.red, 0.5), bigFile().stroke(T.line, 0.8))),
  );

  say('看首键，抄最小的');
  yield* beat('b4b',
    all(bigFile().opacity(0, 0.4), memBox().opacity(0, 0.4)),
    at('并排读', chain(segRows[0]().opacity(0.5, 0.4), segRows[1]().opacity(0.5, 0.4), segRows[2]().opacity(0.5, 0.4))),
    at('第一个键', all(segCells[0][0]().stroke(T.yellow, 0.4), segCells[1][0]().stroke(T.yellow, 0.4), segCells[2][0]().stroke(T.yellow, 0.4))),
    at('最小的', all(segCells[0][0]().stroke(T.green, 0.4), outBox().opacity(1, 0.5), outLab().opacity(1, 0.4), mergeSym().opacity(1, 0.4))),
  );

  say('三段都排好序');
  yield* beat('b5a',
    all(segRows[0]().opacity(1, 0.5), segRows[1]().opacity(1, 0.5), segRows[2]().opacity(1, 0.5)),
    at('hand 开头', all(segCells[0][0]().scale(1.06, 0.5), segCells[1][0]().scale(1.06, 0.5))),
  );

  say('handbag 最小');
  yield* beat('b5b',
    at('第一个键', all(segCells[0][0]().stroke(T.yellow, 0.4), segCells[1][0]().stroke(T.yellow, 0.4), segCells[2][0]().stroke(T.yellow, 0.4))),
    at('最小', chain(segCells[0][0]().stroke(T.green, 0.4), segCells[0][0]().scale(1.08, 0.5))),
  );

  say('handbag:8786');
  yield* beat('b6a',
    at('先抄进', chain(segCells[0][0]().position(outPos(0), 0.9), segCells[0][0]().stroke(T.green, 0.4))),
  );

  say('只留最新值');
  yield* beat('b6b',
    chain(segCells[1][0]().position(outPos(1), 0.7), segCells[1][0]().stroke(T.green, 0.3)),
    at('三段都有', all(segCells[0][1]().stroke(T.yellow, 0.4), segCells[1][1]().stroke(T.yellow, 0.4), segCells[2][0]().stroke(T.yellow, 0.4))),
    at('最新的', chain(segCells[2][0]().position(outPos(2), 0.9), segCells[2][0]().stroke(T.green, 0.4))),
    at('丢掉', all(segCells[0][1]().opacity(0.15, 0.6), segCells[1][1]().opacity(0.15, 0.6))),
  );

  say('逐个比，逐个抄');
  yield* beat('b7a',
    at('handicap', all(segCells[2][1]().position(outPos(3), 1.0), segCells[2][1]().stroke(T.green, 0.5), segCells[0][2]().opacity(0.15, 0.8), segCells[1][2]().opacity(0.15, 0.8))),
    at('handiwork', all(segCells[2][2]().position(outPos(4), 1.0), segCells[2][2]().stroke(T.green, 0.5), segCells[1][3]().opacity(0.15, 0.8))),
  );

  say('九个键，排好序');
  yield* beat('b7b',
    chain(
      segCells[1][4]().position(outPos(5), 0.55),
      segCells[2][3]().position(outPos(6), 0.55),
      segCells[2][4]().position(outPos(7), 0.55),
      segCells[2][5]().position(outPos(8), 0.55),
    ),
    at('九个键', all(segCells[0][3]().opacity(0.15, 0.4), segCells[1][4]().stroke(T.green, 0.3), segCells[0][5]().opacity(0.15, 0.4), segCells[1][5]().opacity(0.15, 0.4), outBox().stroke(T.yellow, 0.4))),
  );
});
