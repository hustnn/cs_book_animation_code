// U14 场景 3（MC，r3）：n23–n29 —— 五维超立方体、查总数不用扫数百万行、价格不是维度、保留原始数据、回扣。
// 分镜：skill-ch03/beats-u14.md；原文：DDIA §3.14（书页 p102–103，PDF p124–125）。
// r3 改动：拍号改用设计的 n 拍号；n23/n24 拆拍，n24 加计数器（只查 1 格）；n25 旁白去掉“图里”指代（r2 P2 #1）。
// 时长全部来自 timeline/u14.json（beat() 驱动），不手写 waitFor。
import {Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, chain, createRef} from '@motion-canvas/core';
import {at, makeBeats} from '../../lib/beats';
import {Counter} from '../../lib/schemas';
import {FONT, SAFE, SIZE, T} from '../../lib/theme';
import timeline from '../../timeline/u14.json';

const DIMS = ['日期', '产品', '商店', '促销', '顾客'];

export default makeScene2D(function* (view) {
  view.fill(T.bg);
  const beat = makeBeats(timeline);

  const header = createRef<Txt>();
  const anchor = createRef<Txt>();
  const say = (text: string) => anchor().text(text);

  // ---- n25：五个维度 → 超立方体 ----
  const g19 = createRef<Node>();
  const dimChips = DIMS.map(() => createRef<Rect>());
  const cubeNode = createRef<Rect>();

  // ---- n26：一格 + 五个方向汇总 ----
  const g20 = createRef<Node>();
  const centerCell = createRef<Rect>();
  const sumArrows = [0, 1, 2, 3, 4].map(() => createRef<Line>());
  const sumLabs = DIMS.map(() => createRef<Txt>());

  // ---- n23/n24：查总数不用扫数百万行 ----
  const g21 = createRef<Node>();
  const rowsNode = createRef<Node>();
  const totalCard = createRef<Rect>();
  const scanCounter = new Counter([330, 90], '只查 ', ' 格');

  // ---- n27：价格不是维度 ----
  const g22 = createRef<Node>();
  const priceCard = createRef<Rect>();
  const cross1 = createRef<Line>();
  const cross2 = createRef<Line>();
  const priceTag = createRef<Txt>();

  // ---- n28：保留原始数据 ----
  const g23 = createRef<Node>();
  const rawBox = createRef<Rect>();
  const miniCube = createRef<Rect>();

  // ---- n29：回扣 ----
  const g24 = createRef<Node>();
  const leftCard = createRef<Rect>();
  const rightCard = createRef<Rect>();
  const recapArrow = createRef<Line>();

  view.add(
    <>
      <Txt
        ref={header}
        position={[-SAFE.halfW, -SAFE.halfH]}
        offset={[-1, -1]}
        fontSize={SIZE.label}
        fill={T.muted}
        fontFamily={FONT.sans}
        text={'聚合：立方体与物化视图'}
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

      {/* n25 */}
      <Node ref={g19} opacity={0}>
        {DIMS.map((d, i) => (
          <Rect
            key={`dim-${i}`}
            ref={dimChips[i]}
            position={[-440 + i * 220, -60]}
            width={200}
            height={100}
            radius={14}
            fill={T.card}
            stroke={T.purple}
            lineWidth={2}
            opacity={0}
          >
            <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={d} />
          </Rect>
        ))}
        <Rect ref={cubeNode} position={[0, -60]} width={420} height={240} radius={18} fill={T.card} stroke={T.purple} lineWidth={3} opacity={0}>
          <Txt position={[0, -40]} fontSize={SIZE.title} fontWeight={700} fill={T.text} fontFamily={FONT.serif} text={'超立方体'} />
          <Txt position={[0, 30]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'五个维度，一个格子是一个组合'} />
        </Rect>
      </Node>

      {/* n26 */}
      <Node ref={g20} opacity={0}>
        <Rect ref={centerCell} position={[0, -60]} width={130} height={90} radius={12} fill={T.card} stroke={T.yellow} lineWidth={3} opacity={0}>
          <Txt fontSize={SIZE.label} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'一格'} />
        </Rect>
        <Line ref={sumArrows[0]} points={[[0, -108], [0, -168]]} stroke={T.blue} lineWidth={3} endArrow opacity={0} />
        <Line ref={sumArrows[1]} points={[[68, -60], [138, -60]]} stroke={T.blue} lineWidth={3} endArrow opacity={0} />
        <Line ref={sumArrows[2]} points={[[0, -12], [0, 48]]} stroke={T.blue} lineWidth={3} endArrow opacity={0} />
        <Line ref={sumArrows[3]} points={[[-68, -60], [-138, -60]]} stroke={T.blue} lineWidth={3} endArrow opacity={0} />
        <Line ref={sumArrows[4]} points={[[48, -102], [108, -158]]} stroke={T.blue} lineWidth={3} endArrow opacity={0} />
        <Txt ref={sumLabs[0]} position={[0, -198]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'日期'} opacity={0} />
        <Txt ref={sumLabs[1]} position={[190, -60]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'产品'} opacity={0} />
        <Txt ref={sumLabs[2]} position={[0, 78]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'商店'} opacity={0} />
        <Txt ref={sumLabs[3]} position={[-190, -60]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'促销'} opacity={0} />
        <Txt ref={sumLabs[4]} position={[140, -188]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'顾客'} opacity={0} />
      </Node>

      {/* n23/n24 */}
      <Node ref={g21} opacity={0}>
        <Node ref={rowsNode}>
          {[0, 1, 2, 3, 4].map(i => (
            <Rect
              key={`rbar-${i}`}
              position={[-300, -200 + i * 60]}
              width={500}
              height={36}
              radius={10}
              fill={T.card}
              stroke={T.line}
              lineWidth={2}
            />
          ))}
          <Txt position={[-300, -248]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'数百万行'} />
        </Node>
        <Rect ref={totalCard} position={[330, -60]} width={360} height={170} radius={16} fill={T.card} stroke={T.line} lineWidth={2} opacity={0}>
          <Txt position={[0, -40]} fontSize={SIZE.title} fontWeight={700} fill={T.text} fontFamily={FONT.serif} text={'总计'} />
          <Txt position={[0, 30]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'昨天每家店的总销售额'} />
        </Rect>
      </Node>
      {scanCounter.node}

      {/* n27 */}
      <Node ref={g22} opacity={0}>
        <Rect ref={priceCard} position={[-160, -60]} width={480} height={130} radius={16} fill={T.card} stroke={T.line} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'价格超过一百美元'} />
        </Rect>
        <Line ref={cross1} points={[[160, -100], [240, -20]]} stroke={T.red} lineWidth={6} opacity={0} />
        <Line ref={cross2} points={[[160, -20], [240, -100]]} stroke={T.red} lineWidth={6} opacity={0} />
        <Txt ref={priceTag} position={[0, 80]} fontSize={SIZE.body} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'价格不是维度'} opacity={0} />
      </Node>

      {/* n28 */}
      <Node ref={g23} opacity={0}>
        <Rect ref={rawBox} position={[-140, -60]} width={560} height={180} radius={18} fill={T.card} stroke={T.line} lineWidth={2} opacity={0}>
          <Txt position={[0, -30]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'原始数据'} />
          <Txt position={[0, 30]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'尽量保留'} />
        </Rect>
        <Rect ref={miniCube} position={[400, -60]} width={280} height={150} radius={16} fill={T.card} stroke={T.purple} lineWidth={2} opacity={0}>
          <Txt position={[0, -28]} fontSize={SIZE.label} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'数据立方体'} />
          <Txt position={[0, 28]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} text={'性能提升'} />
        </Rect>
      </Node>

      {/* n29 */}
      <Node ref={g24} opacity={0}>
        <Rect ref={leftCard} position={[-280, -60]} width={420} height={140} radius={16} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt position={[0, -28]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'算好的总数'} />
          <Txt position={[0, 32]} fontSize={44} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'✓'} />
        </Rect>
        <Line ref={recapArrow} points={[[-60, -60], [60, -60]]} stroke={T.yellow} lineWidth={3} endArrow opacity={0} />
        <Rect ref={rightCard} position={[280, -60]} width={420} height={140} radius={16} fill={T.card} stroke={T.yellow} lineWidth={2} opacity={0}>
          <Txt position={[0, -28]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'事先想好的问题'} />
          <Txt position={[0, 32]} fontSize={44} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'?'} />
        </Rect>
      </Node>
    </>
  );

  say('某些查询变得非常快');
  yield* beat('n23',
    all(g20().opacity(0, 0.5), g21().opacity(1, 0.5), totalCard().opacity(1, 0.5)),
    at('变得非常快', totalCard().stroke(T.yellow, 0.4)),
  );

  say('查总数，不用扫数百万行');
  yield* beat('n24',
    at('昨天每家店的总销售额', totalCard().scale(1.05, 0.8)),
    at('直接看总计就行', chain(scanCounter.node.opacity(1, 0.3), scanCounter.bump())),
    at('不用扫数百万行', rowsNode().opacity(0.15, 1.0)),
  );

  say('五个维度，原理相同');
  yield* beat('n25',
    all(g21().opacity(0, 0.5), g19().opacity(1, 0.5), scanCounter.node.opacity(0, 0.4)),
    at('日期', dimChips[0]().opacity(1, 0.5)),
    at('产品', dimChips[1]().opacity(1, 0.5)),
    at('商店', dimChips[2]().opacity(1, 0.5)),
    at('促销', dimChips[3]().opacity(1, 0.5)),
    at('顾客', dimChips[4]().opacity(1, 0.5)),
    at('五维的超立方体', all(dimChips[0]().opacity(0, 0.4), dimChips[1]().opacity(0, 0.4), dimChips[2]().opacity(0, 0.4), dimChips[3]().opacity(0, 0.4), dimChips[4]().opacity(0, 0.4), cubeNode().opacity(1, 0.5))),
    at('原理和二维完全相同', all(cubeNode().stroke(T.green, 0.5), cubeNode().scale(1.03, 1.5))),
  );

  say('每格是一个组合的销售额');
  yield* beat('n26',
    all(g19().opacity(0, 0.5), g20().opacity(1, 0.5)),
    at('某一个日期、产品、商店、促销、顾客组合', centerCell().opacity(1, 0.5)),
    at('沿着每个维度反复汇总', chain(
      all(sumArrows[0]().opacity(1, 0.4), sumLabs[0]().opacity(1, 0.4)),
      all(sumArrows[1]().opacity(1, 0.4), sumLabs[1]().opacity(1, 0.4)),
      all(sumArrows[2]().opacity(1, 0.4), sumLabs[2]().opacity(1, 0.4)),
      all(sumArrows[3]().opacity(1, 0.4), sumLabs[3]().opacity(1, 0.4)),
      all(sumArrows[4]().opacity(1, 0.4), sumLabs[4]().opacity(1, 0.4)),
    )),
  );

  say('价格不是维度，算不出来');
  yield* beat('n27',
    all(g20().opacity(0, 0.5), g22().opacity(1, 0.5), priceCard().opacity(1, 0.5)),
    at('价格不是维度', priceTag().opacity(1, 0.5)),
    at('超过一百美元', all(cross1().opacity(1, 0.4), cross2().opacity(1, 0.4))),
  );

  say('保留原始数据');
  yield* beat('n28',
    all(g22().opacity(0, 0.5), g23().opacity(1, 0.5), rawBox().opacity(1, 0.5)),
    at('保留原始数据', rawBox().stroke(T.green, 0.4)),
    at('性能提升', miniCube().opacity(1, 0.5)),
  );

  say('只限于事先想好的问题');
  yield* beat('n29',
    all(g23().opacity(0, 0.5), g24().opacity(1, 0.5)),
    at('算好的总数', leftCard().opacity(1, 0.5)),
    at('事先想好的那些问题', all(rightCard().opacity(1, 0.5), recapArrow().opacity(1, 0.4))),
  );
});
