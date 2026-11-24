// U12 场景 3（MC）：b25–b32 —— 别的压缩方案一句带过、列族 ≠ 列式存储、
// 磁盘带宽之外还有 CPU 带宽（内存 → CPU 缓存、分支预测、流水线气泡、SIMD）、
// 向量化处理（一级缓存 + 紧凑循环 + 按位算子直接算压缩块）、回扣。
// 分镜：skill-ch03/beats-u12.md；原文：DDIA §3.11（书页 p98–99，PDF p120–121）。
// 时长全部来自 timeline/u12.json（beat() 驱动），不手写 waitFor。
import {Circle, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, chain, createRef} from '@motion-canvas/core';
import {at, makeBeats} from '../../lib/beats';
import {FONT, SAFE, SIZE, T} from '../../lib/theme';
import timeline from '../../timeline/u12.json';

export default makeScene2D(function* (view) {
  view.fill(T.bg);
  const beat = makeBeats(timeline);

  const header = createRef<Txt>();
  const anchor = createRef<Txt>();
  const say = (text: string) => anchor().text(text);

  // ---- 第 1 页：列族 vs 列式存储 ----
  const p1 = createRef<Node>();
  const otherTag = createRef<Rect>();
  const famCard = createRef<Rect>();
  const colCard = createRef<Rect>();
  const neq = createRef<Txt>();
  const famChips = [0, 1, 2].map(() => createRef<Rect>());
  const colFiles = [0, 1, 2].map(() => createRef<Rect>());
  const famCap = createRef<Txt>();
  const colCap = createRef<Txt>();
  const noComp = createRef<Txt>();
  const rowish = createRef<Txt>();

  // ---- 第 2 页：磁盘 / 内存 / CPU 流水线 ----
  const p2 = createRef<Node>();
  const diskBox = createRef<Rect>();
  const memBox = createRef<Rect>();
  const cpuBox = createRef<Rect>();
  const arr1 = createRef<Txt>();
  const arr2 = createRef<Txt>();
  const bar1 = createRef<Rect>();
  const bar1Lab = createRef<Txt>();
  const bar2 = createRef<Rect>();
  const bar2Lab = createRef<Txt>();
  const oneOf = createRef<Txt>();
  const tagBranch = createRef<Rect>();
  const tagBubble = createRef<Rect>();
  const tagSimd = createRef<Rect>();

  // ---- 第 3 页：一级缓存 + 紧凑循环 + 向量化 ----
  const p3 = createRef<Node>();
  const l1Box = createRef<Rect>();
  const l1Title = createRef<Txt>();
  const chunk = createRef<Rect>();
  const chunkLab = createRef<Txt>();
  const loopDot = createRef<Circle>();
  const moreRows = createRef<Txt>();
  const opAnd = createRef<Rect>();
  const opOr = createRef<Rect>();
  const vecTitle = createRef<Txt>();

  // ---- 回扣 ----
  const p4 = createRef<Node>();
  const backNote = createRef<Txt>();
  const backCard1 = createRef<Rect>();
  const backCard2 = createRef<Rect>();
  const backArrow = createRef<Txt>();
  const backConcl = createRef<Txt>();

  view.add(
    <>
      <Txt
        ref={header}
        position={[-SAFE.halfW, -SAFE.halfH]}
        offset={[-1, -1]}
        fontSize={SIZE.label}
        fill={T.muted}
        fontFamily={FONT.sans}
        text={'列压缩：位图'}
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
        <Rect ref={otherTag} position={[0, -60]} width={420} height={70} radius={14} fill={T.card} stroke={T.line} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'还有别的压缩方案'} />
        </Rect>
        <Rect ref={famCard} position={[-290, -60]} width={460} height={240} radius={16} fill={T.card} stroke={T.blue} lineWidth={3} opacity={0}>
          <Txt position={[0, -90]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'列族'} />
        </Rect>
        <Rect ref={colCard} position={[290, -60]} width={460} height={240} radius={16} fill={T.card} stroke={T.green} lineWidth={3} opacity={0}>
          <Txt position={[0, -90]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'列式存储'} />
        </Rect>
        <Txt ref={neq} position={[0, -60]} fontSize={64} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'≠'} opacity={0} />
        {['行键', '列 A', '列 B'].map((t, i) => (
          <Rect
            key={`fam-${i}`}
            ref={famChips[i]}
            position={[-450 + i * 140, -95]}
            width={120}
            height={56}
            radius={10}
            fill={T.bg}
            stroke={T.blue}
            lineWidth={2}
            opacity={0}
          >
            <Txt fontSize={20} fill={T.text} fontFamily={FONT.sans} text={t} />
          </Rect>
        ))}
        {['列 A 文件', '列 B 文件', '列 C 文件'].map((t, i) => (
          <Rect
            key={`col-${i}`}
            ref={colFiles[i]}
            position={[290, -95 + i * 55]}
            width={200}
            height={40}
            radius={10}
            fill={T.bg}
            stroke={T.green}
            lineWidth={2}
            opacity={0}
          >
            <Txt fontSize={20} fill={T.text} fontFamily={FONT.sans} text={t} />
          </Rect>
        ))}
        <Txt ref={famCap} position={[-290, 90]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'一行的全部列存在一起'} opacity={0} />
        <Txt ref={colCap} position={[290, 90]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'每列单独成文件'} opacity={0} />
        <Txt ref={noComp} position={[-290, 140]} fontSize={SIZE.label} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'不用列压缩'} opacity={0} />
        <Txt ref={rowish} position={[-290, 190]} fontSize={SIZE.body} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'整体还是行式'} opacity={0} />
      </Node>

      {/* 第 2 页 */}
      <Node ref={p2} opacity={0}>
        <Rect ref={diskBox} position={[-400, -80]} width={280} height={120} radius={16} fill={T.card} stroke={T.blue} lineWidth={3} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'磁盘'} />
        </Rect>
        <Rect ref={memBox} position={[0, -80]} width={280} height={120} radius={16} fill={T.card} stroke={T.blue} lineWidth={3} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'内存'} />
        </Rect>
        <Rect ref={cpuBox} position={[400, -80]} width={280} height={120} radius={16} fill={T.card} stroke={T.blue} lineWidth={3} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'CPU'} />
        </Rect>
        <Txt ref={arr1} position={[-200, -80]} fontSize={SIZE.title} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'→'} opacity={0} />
        <Txt ref={arr2} position={[200, -80]} fontSize={SIZE.title} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'→'} opacity={0} />
        <Rect ref={bar1} position={[-200, 60]} width={200} height={30} radius={15} fill={T.blue} opacity={0} />
        <Txt ref={bar1Lab} position={[-200, 115]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'磁盘到内存的带宽'} opacity={0} />
        <Rect ref={bar2} position={[200, 60]} width={200} height={30} radius={15} fill={T.blue} opacity={0} />
        <Txt ref={bar2Lab} position={[200, 115]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'内存到 CPU 缓存的带宽'} opacity={0} />
        <Txt ref={oneOf} position={[-200, 160]} fontSize={20} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'只是其中一个瓶颈'} opacity={0} />
        <Rect ref={tagBranch} position={[-380, 220]} width={200} height={50} radius={12} fill={T.card} stroke={T.purple} lineWidth={2} opacity={0}>
          <Txt fontSize={20} fill={T.text} fontFamily={FONT.sans} text={'分支预测'} />
        </Rect>
        <Rect ref={tagBubble} position={[0, 220]} width={220} height={50} radius={12} fill={T.card} stroke={T.purple} lineWidth={2} opacity={0}>
          <Txt fontSize={20} fill={T.text} fontFamily={FONT.sans} text={'流水线气泡'} />
        </Rect>
        <Rect ref={tagSimd} position={[380, 220]} width={220} height={50} radius={12} fill={T.card} stroke={T.purple} lineWidth={2} opacity={0}>
          <Txt fontSize={20} fill={T.text} fontFamily={FONT.sans} text={'单指令多数据'} />
        </Rect>
      </Node>

      {/* 第 3 页 */}
      <Node ref={p3} opacity={0}>
        <Rect ref={l1Box} position={[0, -100]} width={760} height={260} radius={20} fill={T.card} stroke={T.blue} lineWidth={3} opacity={0}>
          <Txt ref={l1Title} position={[0, -95]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'一级缓存'} opacity={0} />
        </Rect>
        <Rect ref={chunk} position={[0, -60]} width={300} height={130} radius={14} fill={T.bg} stroke={T.green} lineWidth={3} opacity={0}>
          <Txt ref={chunkLab} position={[0, -40]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} text={'压缩列数据'} opacity={0} />
        </Rect>
        <Circle ref={loopDot} position={[-280, -125]} width={22} height={22} fill={T.yellow} opacity={0} />
        <Txt ref={moreRows} position={[0, 110]} fontSize={SIZE.body} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'同样大小的缓存，装进更多行'} opacity={0} />
        <Rect ref={opAnd} position={[-150, -25]} width={200} height={60} radius={12} fill={T.card} stroke={T.yellow} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'按位与'} />
        </Rect>
        <Rect ref={opOr} position={[150, -25]} width={200} height={60} radius={12} fill={T.card} stroke={T.yellow} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'按位或'} />
        </Rect>
        <Txt ref={vecTitle} position={[0, 190]} fontSize={40} fontWeight={700} fill={T.yellow} fontFamily={FONT.serif} text={'向量化处理'} opacity={0} />
      </Node>

      {/* 回扣 */}
      <Node ref={p4} opacity={0}>
        <Txt ref={backNote} position={[0, -180]} fontSize={SIZE.body} fill={T.muted} fontFamily={FONT.sans} text={'重复的值不用存几十亿遍'} opacity={0} />
        <Rect ref={backCard1} position={[-300, -60]} width={360} height={110} radius={16} fill={T.card} stroke={T.yellow} lineWidth={3} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'一张位图'} />
        </Rect>
        <Txt ref={backArrow} position={[0, -60]} fontSize={SIZE.title} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'+'} opacity={0} />
        <Rect ref={backCard2} position={[300, -60]} width={360} height={110} radius={16} fill={T.card} stroke={T.yellow} lineWidth={3} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'一次按位运算'} />
        </Rect>
        <Txt ref={backConcl} position={[0, 90]} fontSize={40} fontWeight={700} fill={T.green} fontFamily={FONT.serif} text={'查询就答完了'} opacity={0} />
      </Node>
    </>
  );

  say('还有别的压缩方案');
  yield* beat('b25',
    all(p1().opacity(1, 0.5), otherTag().opacity(1, 0.5)),
    at('别的压缩方案', otherTag().stroke(T.yellow, 0.4)),
    at('不细讲', otherTag().opacity(0.4, 0.5)),
  );

  say('列族 ≠ 列式存储');
  yield* beat('b26',
    all(otherTag().opacity(0, 0.4), famCard().opacity(1, 0.5), colCard().opacity(1, 0.5)),
    at('列族不是列式存储', neq().opacity(1, 0.5)),
  );

  say('一行存在一起，还是行式');
  yield* beat('b27',
    at('列族的概念', chain(famChips[0]().opacity(1, 0.4), famChips[1]().opacity(1, 0.4), famChips[2]().opacity(1, 0.4))),
    at('和行键存在一起', chain(famCap().opacity(1, 0.5), colFiles[0]().opacity(1, 0.4), colFiles[1]().opacity(1, 0.4), colFiles[2]().opacity(1, 0.4), colCap().opacity(1, 0.5))),
    at('不用列压缩', noComp().opacity(1, 0.5)),
    at('还是行式的', chain(rowish().opacity(1, 0.5), famCard().stroke(T.red, 0.5))),
  );

  say('不只磁盘带宽');
  yield* beat('b28a',
    all(p1().opacity(0, 0.5), p2().opacity(1, 0.5), diskBox().opacity(1, 0.4), memBox().opacity(1, 0.4), cpuBox().opacity(1, 0.4), arr1().opacity(1, 0.3), arr2().opacity(1, 0.3)),
    at('不只省磁盘', diskBox().stroke(T.yellow, 0.4)),
  );

  say('磁盘到内存的带宽');
  yield* beat('b28b',
    at('扫几百万行', chain(bar1().opacity(1, 0.5), bar1().width(260, 1.0))),
    at('从磁盘取进内存', bar1Lab().opacity(1, 0.5)),
  );

  say('只是其中一个瓶颈');
  yield* beat('b28c',
    at('其中一个瓶颈', oneOf().opacity(1, 0.5)),
  );

  say('还要操心 CPU 带宽');
  yield* beat('b29',
    at('内存到 CPU 缓存', chain(bar2().opacity(1, 0.5), bar2Lab().opacity(1, 0.5))),
    at('分支预测', tagBranch().opacity(1, 0.5)),
    at('流水线起泡', tagBubble().opacity(1, 0.5)),
    at('单指令多数据', tagSimd().opacity(1, 0.5)),
  );

  say('整块塞进一级缓存跑');
  yield* beat('b30',
    all(p2().opacity(0, 0.5), p3().opacity(1, 0.5)),
    at('一级缓存', chain(l1Box().opacity(1, 0.5), l1Title().opacity(1, 0.4), chunk().opacity(1, 0.5), chunkLab().opacity(1, 0.4))),
    at('紧凑循环', chain(
      loopDot().opacity(1, 0.3),
      loopDot().position([280, -125], 0.9),
      loopDot().position([280, 5], 0.9),
      loopDot().position([-280, 5], 0.9),
      loopDot().position([-280, -125], 0.9),
    )),
    at('装进更多行', all(chunk().width(560, 0.8), moreRows().opacity(1, 0.5))),
  );

  say('直接在压缩块上算');
  yield* beat('b31a',
    at('按位与、按位或', chain(opAnd().opacity(1, 0.5), opOr().opacity(1, 0.5))),
    at('压缩好的数据块', chain(opAnd().stroke(T.green, 0.4), opOr().stroke(T.green, 0.4))),
  );

  say('向量化处理');
  yield* beat('b31b',
    at('向量化处理', vecTitle().opacity(1, 0.5)),
  );

  say('一张位图，一次运算');
  yield* beat('b32',
    all(p3().opacity(0, 0.5), p4().opacity(1, 0.5)),
    at('不用存几十亿遍', backNote().opacity(1, 0.5)),
    at('一张位图', chain(backCard1().opacity(1, 0.5), backArrow().opacity(1, 0.4), backCard2().opacity(1, 0.5))),
    at('查询就答完了', backConcl().opacity(1, 0.5)),
  );
});
