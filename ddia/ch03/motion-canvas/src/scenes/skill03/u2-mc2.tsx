// U2 场景 2（MC）：b14a–b24 —— 日志切段、压缩、段合并、每段一张哈希表、逐段查找。
// 分镜：skill-ch03/beats-u2.md；原文：DDIA §3.2（书页 p73–74，PDF p95–96）。
// 原图 3-2（12 格 → 3 格）与原图 3-3（24 格 → 4 格）按处置“改编”：数字与顺序按原图重新生成，
// 静态前后对照改成逐步演出：逐格变灰、最新值逐个落进压缩段 / 合并段。
// 时长全部来自 timeline/u2.json（beat() 驱动），不手写 waitFor。
import {Circle, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, chain, createRef} from '@motion-canvas/core';
import {at, makeBeats} from '../../lib/beats';
import {FONT, SAFE, SIZE, T} from '../../lib/theme';
import timeline from '../../timeline/u2.json';

const SEG1 = [
  'mew:1078', 'purr:2103', 'purr:2104', 'mew:1079', 'mew:1080', 'mew:1081',
  'purr:2105', 'purr:2106', 'purr:2107', 'yawn:511', 'purr:2108', 'mew:1082',
];
const SEG2 = [
  'purr:2109', 'purr:2110', 'mew:1083', 'scratch:252', 'mew:1084', 'mew:1085',
  'purr:2111', 'mew:1086', 'purr:2112', 'purr:2113', 'mew:1087', 'purr:2114',
];
// 原图 3-2 压缩后剩下的 3 格（按原图顺序）；原图 3-3 合并后剩下的 4 格（按原图顺序）
const KEEP1 = [9, 10, 11];
const KEEP2 = ['yawn:511', 'scratch:252', 'mew:1087', 'purr:2114'];

export default makeScene2D(function* (view) {
  view.fill(T.bg);
  const beat = makeBeats(timeline);

  const header = createRef<Txt>();
  const anchor = createRef<Txt>();
  const say = (text: string) => anchor().text(text);

  // ---- 第 1 页：切段 + 压缩（原图 3-2）----
  const p1 = createRef<Node>();
  const logBar = createRef<Rect>();
  const diskBar = createRef<Rect>();
  const diskFill = createRef<Rect>();
  const segs = [0, 1, 2].map(() => createRef<Rect>());
  const funnel = createRef<Txt>();
  const funnelLab = createRef<Txt>();
  const cells1 = SEG1.map(() => createRef<Rect>());
  const compBox = createRef<Rect>();
  const compLab = createRef<Txt>();

  // ---- 第 2 页：合并（原图 3-3）----
  const p2 = createRef<Node>();
  const cellsA = SEG1.map(() => createRef<Rect>());
  const cellsB = SEG2.map(() => createRef<Rect>());
  const mergeSym = createRef<Txt>();
  const mergeBox = createRef<Rect>();
  const mergeLab = createRef<Txt>();

  // ---- 第 3 页：后台合并 + 逐段查 ----
  const p3 = createRef<Node>();
  const oldSegs = [0, 1].map(() => createRef<Rect>());
  const roStamp = [0, 1].map(() => createRef<Txt>());
  const bgChip = createRef<Rect>();
  const newSeg = createRef<Rect>();
  const rwArrow = createRef<Line>();
  const switchArrow = createRef<Line>();
  const lookSegs = [0, 1, 2].map(() => createRef<Rect>());
  const lookTabs = [0, 1, 2].map(() => createRef<Txt>());
  const lookDot = createRef<Circle>();
  const fewLab = createRef<Txt>();

  const cellPos1 = (i: number): [number, number] => {
    const row = i < 6 ? 0 : 1;
    const col = i % 6;
    return [-425 + col * 170, -200 + row * 60];
  };
  const cellPosA = (i: number): [number, number] => {
    const row = i < 6 ? 0 : 1;
    const col = i % 6;
    return [-325 + col * 130, -215 + row * 50];
  };
  const cellPosB = (i: number): [number, number] => {
    const row = i < 6 ? 0 : 1;
    const col = i % 6;
    return [-325 + col * 130, -85 + row * 50];
  };

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

      {/* 第 1 页 */}
      <Node ref={p1} opacity={0}>
        <Rect ref={logBar} position={[0, -80]} width={1000} height={70} radius={12} fill={T.card} stroke={T.line} lineWidth={2}>
          <Txt fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'追加写日志：只进不出'} />
        </Rect>
        <Rect ref={diskBar} position={[0, 40]} width={1000} height={36} radius={18} fill={T.card} stroke={T.line} lineWidth={2} />
        <Rect ref={diskFill} position={[-500, 40]} offset={[-1, 0]} width={60} height={36} radius={18} fill={T.red} opacity={0} />
        {[0, 1, 2].map(i => (
          <Rect
            key={`seg-${i}`}
            ref={segs[i]}
            position={[-340 + i * 340, -80]}
            width={320}
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
        <Txt ref={funnel} position={[0, -60]} fontSize={64} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'▼'} opacity={0} />
        <Txt ref={funnelLab} position={[0, 20]} fontSize={SIZE.body} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'压缩'} opacity={0} />
        <Rect ref={compBox} position={[0, 30]} width={1080} height={80} radius={14} fill={T.card} stroke={T.green} lineWidth={2} opacity={0} />
        <Txt ref={compLab} position={[-490, 30]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'压缩段'} opacity={0} />
        {SEG1.map((v, i) => (
          <Rect
            key={`c1-${i}`}
            ref={cells1[i]}
            position={cellPos1(i)}
            width={160}
            height={52}
            radius={10}
            fill={T.card}
            stroke={T.blue}
            lineWidth={2}
            opacity={0}
          >
            <Txt fontSize={20} fill={T.text} fontFamily={FONT.mono} text={v} />
          </Rect>
        ))}
      </Node>

      {/* 第 2 页 */}
      <Node ref={p2} opacity={0}>
        <Rect ref={mergeBox} position={[0, 70]} width={1080} height={70} radius={14} fill={T.card} stroke={T.green} lineWidth={2} opacity={0} />
        <Txt ref={mergeLab} position={[-490, 70]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'合并段'} opacity={0} />
        {SEG1.map((v, i) => (
          <Rect
            key={`cA-${i}`}
            ref={cellsA[i]}
            position={cellPosA(i)}
            width={124}
            height={44}
            radius={8}
            fill={T.card}
            stroke={T.blue}
            lineWidth={2}
            opacity={0}
          >
            <Txt fontSize={17} fill={T.text} fontFamily={FONT.mono} text={v} />
          </Rect>
        ))}
        <Txt ref={mergeSym} position={[0, -125]} fontSize={24} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'⊕'} opacity={0} />
        {SEG2.map((v, i) => (
          <Rect
            key={`cB-${i}`}
            ref={cellsB[i]}
            position={cellPosB(i)}
            width={124}
            height={44}
            radius={8}
            fill={T.card}
            stroke={T.green}
            lineWidth={2}
            opacity={0}
          >
            <Txt fontSize={17} fill={T.text} fontFamily={FONT.mono} text={v} />
          </Rect>
        ))}
      </Node>

      {/* 第 3 页 */}
      <Node ref={p3} opacity={0}>
        {[0, 1].map(i => (
          <Rect
            key={`old-${i}`}
            ref={oldSegs[i]}
            position={[-280 + i * 560, -140]}
            width={480}
            height={110}
            radius={14}
            fill={T.card}
            stroke={T.line}
            lineWidth={2}
            opacity={0}
          >
            <Txt position={[0, -25]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={`旧段 ${i + 1}`} />
            <Txt ref={roStamp[i]} position={[0, 25]} fontSize={SIZE.label} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'写好后不再改'} opacity={0} />
          </Rect>
        ))}
        <Rect ref={bgChip} position={[0, -20]} width={360} height={70} radius={14} fill={T.card} stroke={T.purple} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fontWeight={700} fill={T.purple} fontFamily={FONT.sans} text={'后台线程在合并'} />
        </Rect>
        <Rect ref={newSeg} position={[0, 90]} width={60} height={70} radius={14} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} text={'新段'} />
        </Rect>
        <Line ref={rwArrow} points={[[-480, -200], [-280, -200]]} stroke={T.blue} lineWidth={3} endArrow opacity={0} />
        <Line ref={switchArrow} points={[[280, 90], [280, -40]]} stroke={T.yellow} lineWidth={3} endArrow opacity={0} />
        {[0, 1, 2].map(i => (
          <Rect
            key={`look-${i}`}
            ref={lookSegs[i]}
            position={[-360 + i * 360, -60]}
            width={320}
            height={120}
            radius={14}
            fill={T.card}
            stroke={T.blue}
            lineWidth={2}
            opacity={0}
          >
            <Txt position={[0, -30]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={['最新段', '次新段', '更旧的段'][i]} />
            <Txt ref={lookTabs[i]} position={[0, 25]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.mono} text={'哈希表'} opacity={0} />
          </Rect>
        ))}
        <Circle ref={lookDot} position={[-360, -60]} width={26} height={26} fill={T.yellow} opacity={0} />
        <Txt ref={fewLab} position={[0, 130]} fontSize={SIZE.body} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'段数一直很少'} opacity={0} />
      </Node>
    </>
  );

  say('只追加，迟早写满');
  yield* beat('b14a',
    all(p1().opacity(1, 0.5), logBar().opacity(1, 0.5)),
    at('写满', chain(diskFill().opacity(1, 0.5), diskFill().width(980, 1.0))),
  );

  say('切成一段一段');
  yield* beat('b14b',
    all(logBar().opacity(0, 0.4)),
    at('切成一段一段', chain(segs[0]().opacity(1, 0.4), segs[1]().opacity(1, 0.4), segs[2]().opacity(1, 0.4))),
  );

  say('只留最新值');
  yield* beat('b15',
    all(segs[0]().opacity(0, 0.4), segs[1]().opacity(0, 0.4), segs[2]().opacity(0, 0.4), diskBar().opacity(0, 0.4), diskFill().opacity(0, 0.4)),
    at('压缩', chain(funnel().opacity(1, 0.5), funnelLab().opacity(1, 0.5), funnel().position([0, -45], 2.5))),
  );

  say('12 格 → 3 格');
  yield* beat('b16',
    all(funnel().opacity(0, 0.4), funnelLab().opacity(0, 0.4)),
    at('十二格', chain(...cells1.map(c => c().opacity(1, 0.35)))),
  );

  say('yawn:511、mew:1082、purr:2108');
  yield* beat('b17',
    all(compBox().opacity(1, 0.5), compLab().opacity(1, 0.4)),
    at('压成三格', chain(
      all(...cells1.filter((_, i) => !KEEP1.includes(i)).map(c => c().opacity(0.2, 0.6))),
      cells1[9]().position([-340, 30], 1.0),
      cells1[10]().position([0, 30], 1.0),
      cells1[11]().position([340, 30], 1.0),
    )),
    at('各留最后一次', chain(compBox().stroke(T.yellow, 0.4), compBox().stroke(T.green, 1.0))),
  );

  say('边压缩，边合并');
  yield* beat('b18',
    all(p1().opacity(0, 0.5), p2().opacity(1, 0.5)),
    at('小得多', chain(...cellsA.map(c => c().opacity(1, 0.25)))),
    at('合并', mergeSym().opacity(1, 0.5)),
  );

  say('24 格 → 4 格');
  yield* beat('b19',
    at('二十四格', chain(...cellsB.map(c => c().opacity(1, 0.3)))),
    at('四格', all(mergeBox().opacity(1, 0.5), mergeLab().opacity(1, 0.4))),
  );

  say('yawn:511、scratch:252、mew:1087、purr:2114');
  yield* beat('b20',
    at('逐个挑进合并段', chain(
      all(
        ...cellsA.filter((_, i) => ![9, 10, 11].includes(i)).map(c => c().opacity(0.2, 0.6)),
        ...cellsB.filter((_, i) => ![3, 10, 11].includes(i)).map(c => c().opacity(0.2, 0.6)),
      ),
      cellsA[9]().position([-292, 70], 0.9),
      cellsB[3]().position([-97, 70], 0.9),
      cellsB[10]().position([97, 70], 0.9),
      cellsB[11]().position([292, 70], 0.9),
    )),
    at('抓挠的 252', cellsB[3]().stroke(T.yellow, 0.4)),
    at('喵留 1087', chain(mergeBox().stroke(T.yellow, 0.5), mergeBox().stroke(T.green, 1.5))),
  );

  say('后台合并，读写不停');
  yield* beat('b21',
    all(p2().opacity(0, 0.5), p3().opacity(1, 0.5)),
    at('再也不改', chain(oldSegs[0]().opacity(1, 0.5), oldSegs[1]().opacity(1, 0.5), roStamp[0]().opacity(1, 0.4), roStamp[1]().opacity(1, 0.4))),
    at('后台', all(bgChip().opacity(1, 0.5), newSeg().opacity(1, 0.5), newSeg().width(480, 2.5))),
    at('照常用旧段', rwArrow().opacity(1, 0.5)),
  );

  say('切换新段，删旧段');
  yield* beat('b22',
    at('切换', chain(switchArrow().opacity(1, 0.5), oldSegs[0]().opacity(0.15, 0.8), oldSegs[1]().opacity(0.15, 0.8), bgChip().opacity(0, 0.5))),
    at('删掉', newSeg().stroke(T.green, 0.4)),
  );

  say('从新到旧，逐段查');
  yield* beat('b23',
    all(oldSegs[0]().opacity(0, 0.4), oldSegs[1]().opacity(0, 0.4), bgChip().opacity(0, 0.4), newSeg().opacity(0, 0.4), rwArrow().opacity(0, 0.4), switchArrow().opacity(0, 0.4), lookSegs[0]().opacity(1, 0.5), lookTabs[0]().opacity(1, 0.4), lookDot().opacity(1, 0.4)),
    at('最新段', lookSegs[0]().stroke(T.yellow, 0.4)),
    at('次新', all(lookSegs[1]().opacity(1, 0.5), lookTabs[1]().opacity(1, 0.4), lookDot().position([0, -60], 0.8))),
    at('往前', all(lookSegs[2]().opacity(1, 0.5), lookTabs[2]().opacity(1, 0.4), lookDot().position([360, -60], 0.8))),
  );

  say('段少，查得少');
  yield* beat('b24',
    at('很少', all(fewLab().opacity(1, 0.5), lookDot().position([0, -60], 1.2))),
  );
});
