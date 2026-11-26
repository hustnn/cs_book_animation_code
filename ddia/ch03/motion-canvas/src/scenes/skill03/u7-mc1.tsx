// U7 场景 1（MC）：g1–g15b —— 钩子（地图框餐馆）、二维范围查询（SQL 四个数字原样出现）、
// 一维筛子走查（纬度筛 52 家 / 经度筛 47 家 / 两组结果再过滤剩 12 家）、Z 序曲线（比特交错编 Z 值，延伸）、
// R 树 + PostGIS、颜色立方体、日期 × 温度（一维先扫整年再滤 vs 二维同时缩小）。
// 分镜：skill-ch03/beats-u7.md；原文：DDIA §3.6 后半（书页 p87–88）。
// 时长全部来自 timeline/u7.json（beat() 驱动），不手写 waitFor。
// 地图点位：框内 12 + 纬度带内 40 + 经度带内 35 + 带外 6 = 93 个点全部画出，计数器显示真实计数。
// r2 的 b6“两带交集为空 + 红叉”在几何上是误导（矩形框本身就是两带的交集），r3 改为两组结果再过滤。
// 布局避让：筛子带是半透明填充（<0.5），只盖圆点不盖文字；SQL 卡与各组切换时旧组先淡出。
import {Circle, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {Vector2, all, chain, createRef} from '@motion-canvas/core';
import {at, makeBeats} from '../../lib/beats';
import {CHAPTER} from '../../lib/chapter';
import {UnitTitle} from '../../lib/opening';
import {FONT, SAFE, SIZE, T} from '../../lib/theme';
import {Bits, Counter, tag} from '../../lib/schemas';
import timeline from '../../timeline/u7.json';

// 地图上的餐馆圆点（93 个）。查询矩形 x∈[-300,60]、y∈[-160,40]；
// 纬度带 y∈[-160,40]；经度带 x∈[-300,60]。
const IN_RECT: [number, number][] = [-260, -170, -80, 10].flatMap(x =>
  [-140, -60, 20].map(y => [x, y] as [number, number]),
);
const LAT_OUT: [number, number][] = [-140, -80, -20, 20].flatMap(y =>
  [...[-460, -400, -340], ...[120, 180, 240, 300, 360, 420, 460]].map(x => [x, y] as [number, number]),
);
const LON_OUT: [number, number][] = [-280, -230, -180, -130, -80, -30, 20].flatMap(x =>
  [-235, -195, 65, 100, 135].map(y => [x, y] as [number, number]),
);
const CTX: [number, number][] = [[-450, -230], [-380, 120], [150, -230], [250, 130], [430, -230], [450, 100]];
const DOTS = [...IN_RECT, ...LAT_OUT, ...LON_OUT, ...CTX];
const IN_IDX = DOTS.map((_, i) => i).filter(i => i < 12);
const LAT_IDX = DOTS.map((_, i) => i).filter(i => i < 52);
const LON_IDX = [...IN_IDX, ...DOTS.map((_, i) => i).filter(i => i >= 52 && i < 87)];
const LAT_OUT_IDX = DOTS.map((_, i) => i).filter(i => i >= 12 && i < 52);
const LON_OUT_IDX = DOTS.map((_, i) => i).filter(i => i >= 52 && i < 87);

// Z 序：Z 值 = 经度高位、纬度高位、经度低位、纬度低位交错；16 格按 Z 值 0–15 排序。
// 例：(x=2, y=1) → 经度 10、纬度 01 → Z = 1001₂ = 9。
const Z_ORDER: [number, number][] = [
  [0, 0], [0, 1], [1, 0], [1, 1], [0, 2], [0, 3], [1, 2], [1, 3],
  [2, 0], [2, 1], [3, 0], [3, 1], [2, 2], [2, 3], [3, 2], [3, 3],
];
const zCell = (x: number, y: number): [number, number] => [-410 + x * 100, -210 + y * 100];

export default makeScene2D(function* (view) {
  view.fill(T.bg);
  const beat = makeBeats(timeline);

  const anchor = createRef<Txt>();
  const say = (text: string) => anchor().text(text);

  // 地图组
  const mapG = createRef<Node>();
  const dotsG = createRef<Node>();
  const dotRefs = DOTS.map(() => createRef<Circle>());
  const dotLab = createRef<Txt>();
  const queryRect = createRef<Rect>();
  const qMark = createRef<Txt>();
  const latBand = createRef<Rect>();
  const lonBand = createRef<Rect>();
  const latTag = createRef<Txt>();
  const lonTag = createRef<Txt>();
  const anyLon = createRef<Txt>();
  const anyLat = createRef<Txt>();
  const rectCount = createRef<Txt>();
  const extraTxt = createRef<Txt>();
  const leftTxt = createRef<Txt>();
  // r4 B25：Venn tally（93 = 框内 12 + 仅纬度对 40 + 仅经度对 35 + 两维都错 6）
  const tallyTxt = createRef<Txt>();
  const latCount = new Counter([-280, 232], '纬度筛出 ', ' 家');
  const lonCount = new Counter([280, 232], '经度筛出 ', ' 家');

  // SQL 卡
  const sqlG = createRef<Node>();
  const sqlTitle = createRef<Txt>();
  const sqlLine1 = createRef<Txt>();
  const sqlLine2 = createRef<Txt>();

  // Z 序曲线 + 比特行
  const zG = createRef<Node>();
  const zPath = createRef<Line>();
  const zCellHi = createRef<Rect>();
  const zTag = tag([560, -300], '延伸 · 原文之外');
  // r6 P2-1：轴号（列 0–3、行 0–3）与原点；g12b 念到才出现
  const axisG = createRef<Node>();
  // r6 P2-3：查询框（右上 2×2 四格）+ 四格角标 Z 值
  const zQueryRect = createRef<Rect>();
  const zCornerLabs = [8, 9, 10, 11].map(() => createRef<Txt>());

  // Z 序比特行（经度 10、纬度 01、Z 值 1001）
  const bitsLonRow = new Bits(new Vector2(280, -180), 2, '经度', {cell: 44, cellH: 40, font: 26, set: [0]});
  const bitsLatRow = new Bits(new Vector2(280, -110), 2, '纬度', {cell: 44, cellH: 40, font: 26, set: [1]});
  const bitsZRow = new Bits(new Vector2(280, -40), 4, 'Z 值', {cell: 44, cellH: 40, font: 26, set: [0, 3]});
  const zValTxt = createRef<Txt>();

  // R 树
  const rtreeG = createRef<Node>();
  const rtOuter = createRef<Rect>();
  const rtMid = createRef<Rect>();
  const rtInner = createRef<Rect>();
  const rtLab = createRef<Txt>();
  const pgPlate = createRef<Rect>();
  const pgName = createRef<Txt>();
  const pgSub = createRef<Txt>();

  // 一维条（16 格，按 Z 值 0–15）
  const stripG = createRef<Node>();
  const stripCells = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map(() => createRef<Rect>());
  const stripLab = createRef<Txt>();
  // r4 B28：矩形查询对应的 Z 值区间
  const zRangeTxt = createRef<Txt>();
  // r5 #11：8–11 里可能有框外的点，要再过滤一遍
  const filterTxt = createRef<Txt>();

  // 颜色立方体
  const cubeG = createRef<Node>();
  const cubeFront = createRef<Rect>();
  const cubeBack = createRef<Rect>();
  const cubeEdge1 = createRef<Line>();
  const cubeEdge2 = createRef<Line>();
  const cubeEdge3 = createRef<Line>();
  const cubeEdge4 = createRef<Line>();
  const axR = createRef<Txt>();
  const axG = createRef<Txt>();
  const axB = createRef<Txt>();
  const cubePt = createRef<Circle>();
  const cubeBox = createRef<Rect>();
  // r6 P2-9：小黄框的小标
  const cubeBoxLab = createRef<Txt>();

  // 日期 × 温度网格：4 列（2011–2014）× 3 行（20–25 / 25–30 / 30–35℃）
  const gridG = createRef<Node>();
  const colHi = createRef<Rect>();
  const rowHi = createRef<Rect>();
  const interCell = createRef<Rect>();
  const box2d = createRef<Rect>();
  // r6 P2-10：交集里三个点的小标
  const interLab = createRef<Txt>();
  const hitDots = [0, 1, 2].map(() => createRef<Circle>());
  const hyperPlate = createRef<Rect>();

  // 一维筛子（2013 年记录行）
  const sieveG = createRef<Node>();
  const sieveDots = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(() => createRef<Circle>());
  const KEEP = [2, 5, 9];

  view.add(
    <>
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

      {/* 地图 */}
      <Node ref={mapG} opacity={0}>
        <Rect position={[0, -50]} width={980} height={400} radius={16} fill={T.card} stroke={T.line} lineWidth={2} />
        <Txt position={[-440, -272]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'地图'} />
        <Node ref={dotsG} opacity={0}>
          {DOTS.map(([x, y], i) => (
            <Circle
              key={`dot-${i}`}
              ref={dotRefs[i]}
              position={[x, y]}
              width={18}
              height={18}
              fill={T.blue}
            />
          ))}
        </Node>
        <Txt ref={dotLab} position={[-365, -130]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'一家餐馆'} opacity={0} />
        <Rect ref={queryRect} position={[-120, -60]} width={360} height={200} stroke={T.yellow} lineWidth={3} opacity={0} />
        <Txt ref={qMark} position={[330, 80]} fontSize={72} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'?'} opacity={0} />
        <Rect ref={latBand} position={[0, -60]} width={980} height={200} fill={T.green} opacity={0} />
        <Rect ref={lonBand} position={[-120, -50]} width={360} height={400} fill={T.blue} opacity={0} />
        <Txt ref={latTag} position={[-350, 190]} fontSize={SIZE.body} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'纬度筛'} opacity={0} />
        <Txt ref={lonTag} position={[350, 190]} fontSize={SIZE.body} fontWeight={700} fill={T.blue} fontFamily={FONT.sans} text={'经度筛'} opacity={0} />
        <Txt ref={anyLon} position={[0, 190]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'经度任意'} opacity={0} />
        <Txt ref={anyLat} position={[0, 190]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'纬度任意'} opacity={0} />
      </Node>
      <Txt ref={rectCount} position={[0, 232]} fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.sans} text={'框里 12 家'} opacity={0} />
      <Txt ref={tallyTxt} position={[0, 232]} fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.sans} text={'一共 93 家：纬度 52 · 经度 47 · 重叠 12 · 两维都错 6'} opacity={0} />
      <Txt ref={extraTxt} position={[0, 232]} fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.sans} text={''} opacity={0} />
      <Txt ref={leftTxt} position={[0, 232]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} text={'再过滤一遍，只剩 12 家'} opacity={0} />
      {latCount.node}
      {lonCount.node}

      {/* SQL 卡 */}
      <Node ref={sqlG} opacity={0}>
        <Rect position={[0, -50]} width={780} height={170} radius={16} fill={T.card} stroke={T.blue} lineWidth={3} />
        <Txt ref={sqlTitle} position={[0, -165]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'二维范围查询'} opacity={0} />
        <Txt ref={sqlLine1} position={[0, -80]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.mono} text={'纬度 51.4946 ~ 51.5079'} opacity={0} />
        <Txt ref={sqlLine2} position={[0, -20]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.mono} text={'经度 -0.1162 ~ -0.1004'} opacity={0} />
      </Node>

      {/* Z 序曲线 */}
      <Node ref={zG} opacity={0}>
        <Txt position={[260, -300]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'4×4 网格：经度 × 纬度'} />
        {[0, 1, 2, 3].flatMap(cx =>
          [0, 1, 2, 3].map(cy => (
            <Rect
              key={`zc-${cx}-${cy}`}
              position={zCell(cx, cy)}
              width={100}
              height={100}
              stroke={T.line}
              lineWidth={1}
            />
          )),
        )}
        <Line
          ref={zPath}
          points={Z_ORDER.map(([x, y]) => zCell(x, y))}
          stroke={T.yellow}
          lineWidth={3}
          endArrow
          end={0}
        />
        <Rect ref={zCellHi} position={zCell(2, 1)} width={100} height={100} stroke={T.yellow} lineWidth={4} opacity={0} />
        {/* r6 P2-1：列 0–3（上）、行 0–3（左）、原点在左上角 */}
        <Node ref={axisG} opacity={0}>
          {[0, 1, 2, 3].map(cx => (
            <Txt key={`col-${cx}`} position={[-410 + cx * 100, -282]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={String(cx)} />
          ))}
          {[0, 1, 2, 3].map(cy => (
            <Txt key={`row-${cy}`} position={[-488, -210 + cy * 100]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={String(cy)} />
          ))}
          <Circle position={[-460, -260]} width={14} height={14} fill={T.yellow} />
          <Txt position={[-436, -242]} fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.sans} text={'原点'} />
        </Node>
        {/* r6 P2-3：查询框盖住右上 2×2 四格，角标 Z 值 8/9/10/11 */}
        <Rect ref={zQueryRect} position={[-160, -160]} width={200} height={200} stroke={T.yellow} lineWidth={4} opacity={0} />
        {[[2, 0, 8], [3, 0, 10], [2, 1, 9], [3, 1, 11]].map(([cx, cy, z], i) => (
          <Txt key={`zc-lab-${z}`} ref={zCornerLabs[i]} position={[-410 + cx * 100 - 32, -210 + cy * 100 - 32]} fontSize={SIZE.label} fontWeight={700} fill={T.yellow} fontFamily={FONT.mono} text={String(z)} opacity={0} />
        ))}
        <Txt position={[280, -235]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'取一格：经度 2、纬度 1'} />
        {bitsLonRow.group}
        {bitsLatRow.group}
        {bitsZRow.group}
        {/* r4 B28：算一遍的 Z 值结果，g12b 出现 */}
        <Txt ref={zValTxt} position={[280, 30]} fontSize={SIZE.body} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'Z 值：1001 → 9'} opacity={0} />
      </Node>
      {zTag}

      {/* 一维条 */}
      <Node ref={stripG} opacity={0}>
        <Txt position={[0, -120]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'二维位置 → 一个数字'} />
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map(i => (
          <Rect
            key={`cell-${i}`}
            ref={stripCells[i]}
            position={[-495 + i * 66, 20]}
            width={60}
            height={60}
            fill={T.card}
            stroke={T.blue}
            lineWidth={2}
          >
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={String(i)} />
          </Rect>
        ))}
        <Txt ref={stripLab} position={[0, 120]} fontSize={SIZE.body} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'一维索引'} opacity={0} />
        <Txt ref={zRangeTxt} position={[0, 170]} fontSize={SIZE.body} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'矩形查询 → Z 值 8–11'} opacity={0} />
        <Txt ref={filterTxt} position={[0, 215]} fontSize={SIZE.body} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'8–11 里可能有框外的点，要再过滤一遍'} opacity={0} />
      </Node>

      {/* R 树 */}
      <Node ref={rtreeG} opacity={0}>
        <Rect ref={rtOuter} position={[0, -60]} width={720} height={320} stroke={T.blue} lineWidth={3} opacity={0} />
        <Rect ref={rtMid} position={[0, -60]} width={480} height={210} stroke={T.yellow} lineWidth={3} opacity={0} />
        <Rect ref={rtInner} position={[0, -60]} width={240} height={110} stroke={T.green} lineWidth={3} opacity={0} />
        <Txt ref={rtLab} position={[0, 120]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'矩形框逐层嵌套'} opacity={0} />
        <Rect ref={pgPlate} position={[0, 195]} width={340} height={100} radius={14} fill={T.card} stroke={T.purple} lineWidth={2} opacity={0}>
          <Txt ref={pgName} position={[0, -22]} fontSize={SIZE.body} fontWeight={700} fill={T.purple} fontFamily={FONT.mono} text={'PostGIS'} opacity={0} />
          <Txt ref={pgSub} position={[0, 24]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'广义搜索树'} opacity={0} />
        </Rect>
      </Node>

      {/* 颜色立方体 */}
      <Node ref={cubeG} opacity={0}>
        <Rect ref={cubeBack} position={[45, -105]} width={280} height={280} stroke={T.line} lineWidth={2} />
        <Line ref={cubeEdge1} points={[[-140, 80], [-95, 35]]} stroke={T.line} lineWidth={2} />
        <Line ref={cubeEdge2} points={[[140, 80], [185, 35]]} stroke={T.line} lineWidth={2} />
        <Line ref={cubeEdge3} points={[[-140, -200], [-95, -245]]} stroke={T.line} lineWidth={2} />
        <Line ref={cubeEdge4} points={[[140, -200], [185, -245]]} stroke={T.line} lineWidth={2} />
        <Rect ref={cubeFront} position={[0, -60]} width={280} height={280} stroke={T.blue} lineWidth={3} />
        <Txt ref={axR} position={[0, 105]} fontSize={SIZE.body} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'红'} opacity={0} />
        <Txt ref={axG} position={[215, -60]} fontSize={SIZE.body} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'绿'} opacity={0} />
        <Txt ref={axB} position={[-185, -60]} fontSize={SIZE.body} fontWeight={700} fill={T.blue} fontFamily={FONT.sans} text={'蓝'} opacity={0} />
        <Circle ref={cubePt} position={[40, -90]} width={24} height={24} fill={T.yellow} opacity={0} />
        <Rect ref={cubeBox} position={[40, -90]} width={130} height={100} stroke={T.yellow} lineWidth={3} opacity={0} />
        <Txt ref={cubeBoxLab} position={[10, -25]} fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.sans} text={'要找的一段颜色（示意）'} opacity={0} />
      </Node>

      {/* 日期 × 温度网格 */}
      <Node ref={gridG} opacity={0}>
        <Txt position={[0, -235]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'日期'} />
        <Txt position={[-430, -78]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'温度'} />
        {['2011', '2012', '2013', '2014'].map((y, i) => (
          <Txt key={`gy-${i}`} position={[-225 + i * 150, -200]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.mono} text={y} />
        ))}
        {['20–25℃', '25–30℃', '30–35℃'].map((t, i) => (
          <Txt key={`gt-${i}`} position={[-370, -140 + i * 62]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={t} />
        ))}
        {[0, 1, 2, 3].flatMap(ci =>
          [0, 1, 2].map(ri => (
            <Rect
              key={`gc-${ci}-${ri}`}
              position={[-225 + ci * 150, -140 + ri * 62]}
              width={150}
              height={62}
              stroke={T.line}
              lineWidth={1}
            />
          )),
        )}
        <Rect ref={colHi} position={[75, -78]} width={150} height={186} stroke={T.yellow} lineWidth={3} opacity={0} />
        <Rect ref={rowHi} position={[0, -78]} width={600} height={62} stroke={T.green} lineWidth={3} opacity={0} />
        <Rect ref={interCell} position={[75, -78]} width={150} height={62} fill={T.yellow} opacity={0} />
        <Rect ref={box2d} position={[75, -78]} width={150} height={62} stroke={T.yellow} lineWidth={5} opacity={0} />
        <Txt ref={interLab} position={[75, 60]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} text={'交集里的观测（示意）'} opacity={0} />
        {[0, 1, 2].map(i => (
          <Circle key={`hit-${i}`} ref={hitDots[i]} position={[40 + i * 35, -78]} width={18} height={18} fill={T.green} opacity={0} />
        ))}
        <Rect ref={hyperPlate} position={[0, 150]} width={360} height={64} radius={14} fill={T.card} stroke={T.purple} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.purple} fontFamily={FONT.mono} text={'HyperDex'} />
        </Rect>
      </Node>

      {/* 一维筛子：2013 年记录行 */}
      <Node ref={sieveG} opacity={0}>
        <Txt position={[0, -160]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'2013 年全部记录'} />
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(i => (
          <Circle
            key={`sv-${i}`}
            ref={sieveDots[i]}
            position={[-495 + i * 90, -60]}
            width={28}
            height={28}
            fill={T.blue}
          />
        ))}
        <Txt position={[0, 40]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'不管温度，先扫整年'} />
      </Node>
    </>
  );

  // g0：单元站牌（r6，skill v1.11.0 开篇规则）：站牌在 g1 开头收成左上角页眉
  const unit = new UnitTitle(CHAPTER, 'u7');
  view.add(unit.nodes());

  yield* beat('g0', unit.enter());

  say('框出一片餐馆');
  yield* beat('g1',
    unit.toHeader(),
    all(mapG().opacity(1, 0.5)),
    at('框出', queryRect().opacity(1, 0.5)),
    at('纬度筛', qMark().opacity(1, 0.4)),
  );

  say('每家餐馆有经纬度');
  yield* beat('g2',
    all(dotsG().opacity(1, 1.0)),
    at('经纬度', dotLab().opacity(1, 0.5)),
    at('哪一片', queryRect().lineWidth(5, 0.4)),
    at('全部餐馆', dotsG().scale(1.02, 1.0)),
  );

  say('二维范围查询');
  yield* beat('g3',
    all(mapG().opacity(0, 0.5), sqlG().opacity(1, 0.5)),
    at('二维范围查询', sqlTitle().opacity(1, 0.4)),
  );

  say('纬度、经度各一个范围');
  yield* beat('g4',
    at('纬度大于', sqlLine1().opacity(1, 0.4)),
    at('小于五一点五零七九', sqlLine1().fill(T.yellow, 1.2)),
    at('经度大于', sqlLine2().opacity(1, 0.4)),
    at('小于负零点一零零四', sqlLine2().fill(T.yellow, 1.2)),
  );

  say('框里 12 家');
  yield* beat('g5',
    all(sqlG().opacity(0, 0.5), mapG().opacity(1, 0.5), dotLab().opacity(0, 0.4), qMark().opacity(0, 0.4)),
    at('矩形框', queryRect().opacity(1, 0.5)),
    at('十二家', all(
      ...IN_IDX.map(i => dotRefs[i]().fill(T.yellow, 0.4)),
      rectCount().opacity(1, 0.4),
    )),
  );

  say('纬度筛：52 家');
  yield* beat('g6',
    all(rectCount().opacity(0, 0.4), queryRect().opacity(0, 0.4)),
    at('按纬度筛', all(
      latBand().opacity(0.22, 0.5),
      latTag().opacity(1, 0.4),
      ...LAT_IDX.map(i => dotRefs[i]().fill(T.yellow, 0.4)),
      ...DOTS.map((_, i) => i).filter(i => !LAT_IDX.includes(i)).map(i => dotRefs[i]().opacity(0.25, 0.4)),
    )),
    at('经度错的四十家', all(latCount.node.opacity(1, 0.4), latCount.n(52, 0.8), anyLon().opacity(1, 0.4))),
  );

  say('多出 40 家，经度不对');
  yield* beat('g7',
    at('纬度筛完了', all(
      ...LAT_OUT_IDX.map(i => dotRefs[i]().stroke(T.yellow, 0.8)),
      ...LAT_OUT_IDX.map(i => dotRefs[i]().lineWidth(3, 0.8)),
    )),
    at('多出来的四十家', chain(extraTxt().text('多出 40 家，经度不对', 0), extraTxt().opacity(1, 0.4))),
  );

  say('经度筛：47 家');
  yield* beat('g8',
    all(
      latBand().opacity(0, 0.4), latTag().opacity(0, 0.4), anyLon().opacity(0, 0.4),
      extraTxt().opacity(0, 0.4), latCount.node.opacity(0, 0.4),
      ...LAT_OUT_IDX.map(i => dotRefs[i]().stroke(T.bg, 0.3)),
      ...LAT_OUT_IDX.map(i => dotRefs[i]().lineWidth(0, 0.3)),
      ...DOTS.map((_, i) => i).map(i => dotRefs[i]().fill(T.blue, 0.3)),
      ...DOTS.map((_, i) => i).map(i => dotRefs[i]().opacity(1, 0.3)),
    ),
    at('按经度筛', all(
      lonBand().opacity(0.22, 0.5),
      lonTag().opacity(1, 0.4),
      ...LON_IDX.map(i => dotRefs[i]().fill(T.yellow, 0.4)),
      ...DOTS.map((_, i) => i).filter(i => !LON_IDX.includes(i)).map(i => dotRefs[i]().opacity(0.25, 0.4)),
    )),
    at('三十五家', all(lonCount.node.opacity(1, 0.4), lonCount.n(47, 0.8), anyLat().opacity(1, 0.4))),
  );

  say('多出 35 家，纬度不对');
  yield* beat('g9',
    at('经度筛完了', all(
      ...LON_OUT_IDX.map(i => dotRefs[i]().stroke(T.yellow, 0.8)),
      ...LON_OUT_IDX.map(i => dotRefs[i]().lineWidth(3, 0.8)),
    )),
    at('多出来的三十五家', chain(extraTxt().text('多出 35 家，纬度不对', 0), extraTxt().opacity(1, 0.4))),
  );

  say('两组结果，哪个才对？');
  yield* beat('g10',
    all(
      lonBand().opacity(0.22, 0.4), lonTag().opacity(1, 0.4), anyLat().opacity(0, 0.4),
      extraTxt().opacity(0, 0.4),
      ...LON_OUT_IDX.map(i => dotRefs[i]().stroke(T.bg, 0.3)),
      ...LON_OUT_IDX.map(i => dotRefs[i]().lineWidth(0, 0.3)),
      ...DOTS.map((_, i) => i).map(i => dotRefs[i]().fill(T.blue, 0.3)),
      ...DOTS.map((_, i) => i).map(i => dotRefs[i]().opacity(1, 0.3)),
    ),
    at('两个条件', all(latBand().opacity(0.22, 0.5), latTag().opacity(1, 0.4), latCount.node.opacity(1, 0.4))),
    at('同时满足', qMark().opacity(1, 0.4)),
    // r5 #1：把“一次直接给出来”和“先筛一维再逐家过滤”分开说
    at('给不出只有十二家的结果', chain(
      all(latCount.node.scale(1.15, 0.3), lonCount.node.scale(1.15, 0.3)),
      all(latCount.node.scale(1, 0.3), lonCount.node.scale(1, 0.3)),
    )),
    // r4 B25：念到总数时两计数器退场，Venn tally 出现
    at('一共九十三家', all(latCount.node.opacity(0, 0.4), lonCount.node.opacity(0, 0.4), tallyTxt().opacity(1, 0.4))),
    // r4 fix：tally 进场后旁白还剩约 5s 无动作（首测定格 5.33s）——在收尾句上轻 pulse 一次
    at('重叠的正是', chain(tallyTxt().scale(1.05, 0.3), tallyTxt().scale(1, 0.3))),
    // r5 #2：旁白补“剩下 6 家两维都不对”（画面 tally 本就有这行）
    at('剩下六家两维都不对', chain(tallyTxt().scale(1.05, 0.3), tallyTxt().scale(1, 0.3))),
  );

  say('再过滤一遍，只剩 12 家');
  yield* beat('g11',
    all(
      latBand().opacity(0.22, 0.5), latTag().opacity(1, 0.4), qMark().opacity(0, 0.4),
      lonCount.node.opacity(0, 0.4), lonBand().opacity(0, 0.4), lonTag().opacity(0, 0.4),
      tallyTxt().opacity(0, 0.4),
      ...LAT_IDX.map(i => dotRefs[i]().fill(T.yellow, 0.4)),
      ...DOTS.map((_, i) => i).filter(i => !LAT_IDX.includes(i)).map(i => dotRefs[i]().opacity(0.25, 0.4)),
    ),
    at('再一条一条过滤', all(
      ...LAT_OUT_IDX.map(i => dotRefs[i]().opacity(0.15, 1.2)),
      leftTxt().opacity(1, 0.4),
    )),
    at('另一维', all(...IN_IDX.map(i => dotRefs[i]().fill(T.green, 0.4)))),
  );

  say('二进制位交错，编 Z 值');
  yield* beat('g12',
    all(
      mapG().opacity(0, 0.5), latBand().opacity(0, 0.4), latTag().opacity(0, 0.4),
      latCount.node.opacity(0, 0.4), leftTxt().opacity(0, 0.4),
      zG().opacity(1, 0.5), zTag.opacity(1, 0.4),
    ),
    at('二进制位交错', zPath().end(1, 2.0)),
    at('编成一个 Z 值', chain(
      all(bitsLonRow.group.opacity(1, 0.4), bitsLatRow.group.opacity(1, 0.4), bitsZRow.group.opacity(1, 0.4)),
      zCellHi().opacity(1, 0.4),
    )),
  );

  // r5 #10：交错规则拆成短拍 g12a 单录（g12 加长句两版 TTS 都坏）
  say('交错规则：轮流取位');
  yield* beat('g12a',
    at('轮流取位', chain(
      all(bitsLonRow.group.scale(1.06, 0.3), bitsLatRow.group.scale(1.06, 0.3), bitsZRow.group.scale(1.06, 0.3)),
      all(bitsLonRow.group.scale(1, 0.3), bitsLatRow.group.scale(1, 0.3), bitsZRow.group.scale(1, 0.3)),
    )),
    at('经度先', chain(zCellHi().lineWidth(6, 0.3), zCellHi().lineWidth(4, 0.3))),
  );

  // r4 B28：g12 长句版 TTS 两次坏（8.2s 静音/复读），拆拍——g12 恢复 r3 原句，g12b 只算一遍坐标
  // r6 P2-1：轴号在念到“行从上往下数”时出现；P2-2：真实经纬度到二进制的桥在旁白末句
  say('Z 值：1001 → 9');
  yield* beat('g12b',
    // r4 fix：三行位在 g12 已全亮，g12b 重走一遍时无动作（首测定格 5.63s）——
    // 开拍先收起三行，再随旁白逐行点亮
    all(bitsLonRow.group.opacity(0, 0.3), bitsLatRow.group.opacity(0, 0.3), bitsZRow.group.opacity(0, 0.3)),
    // r6 P2-1：行从上往下数、列从左往右数，都从 0 开始
    at('行从上往下数', axisG().opacity(1, 0.4)),
    // r5 #9：点明 4×4 分格、这个点落在第 2 列第 1 行
    at('第二列、第一行', chain(zCellHi().lineWidth(6, 0.3), zCellHi().lineWidth(4, 0.3))),
    at('经度二写成一零', bitsLonRow.group.opacity(1, 0.4)),
    at('纬度一写成零一', bitsLatRow.group.opacity(1, 0.4)),
    at('交错成一零零一', bitsZRow.group.opacity(1, 0.4)),
    at('Z 值是九', chain(zValTxt().opacity(1, 0.4), zCellHi().lineWidth(6, 0.3))),
    // r5 #9：Z 值就是格子编号
    at('Z 值就是格子编号', chain(zValTxt().scale(1.05, 0.3), zValTxt().scale(1, 0.3))),
    // r6 P2-2：真实经纬度先取整再写二进制、四列四行只是简化演示（QA：桥句约 9s 无动作会报 idle error，分步跟旁白）
    at('先按精度取成整数', chain(axisG().scale(1.05, 0.3), axisG().scale(1, 0.3))),
    at('再写成二进制', chain(bitsZRow.group.scale(1.06, 0.3), bitsZRow.group.scale(1, 0.3))),
    at('格子越小、位越多', chain(gridG().scale(1.02, 0.3), gridG().scale(1, 0.3))),
    at('只是简化演示', chain(zValTxt().scale(1.05, 0.3), zValTxt().scale(1, 0.3))),
  );

  // r5 审查：R 树内容已拆到 g13b/g13c，本拍旁白不再提 R 树，标题去掉“；R 树”（r4 标题匹配当时的旁白）
  // r6 P2-3：查询框画在 Z 网格上（右上 2×2 四格，角标 Z 值 8/9/10/11），随旁白逐角点亮，再过渡到一维条
  say('二维压成一维');
  yield* beat('g13',
    // 开拍：网格仍在（比特行、结果值、取格描边收起），查询框与角标随后随旁白出现
    all(
      bitsLonRow.group.opacity(0, 0.4), bitsLatRow.group.opacity(0, 0.4), bitsZRow.group.opacity(0, 0.4),
      zValTxt().opacity(0, 0.4), zCellHi().opacity(0, 0.4),
    ),
    at('矩形框盖住四格', all(
      zQueryRect().opacity(1, 0.5),
      ...zCornerLabs.map(l => l().opacity(1, 0.4)),
    )),
    at('左上是八', chain(zCornerLabs[0]().scale(1.3, 0.3), zCornerLabs[0]().scale(1, 0.3))),
    at('右上是十', chain(zCornerLabs[1]().scale(1.3, 0.3), zCornerLabs[1]().scale(1, 0.3))),
    at('左下是九', chain(zCornerLabs[2]().scale(1.3, 0.3), zCornerLabs[2]().scale(1, 0.3))),
    at('右下是十一', chain(zCornerLabs[3]().scale(1.3, 0.3), zCornerLabs[3]().scale(1, 0.3))),
    // 念到“所以是八到十一这四段”：网格淡出，一维条出现
    at('所以是八到十一这四段', all(zG().opacity(0, 0.5), zTag.opacity(0, 0.4), stripG().opacity(1, 0.5))),
    at('大致落在', all(
      stripCells[8]().stroke(T.yellow, 0.4), stripCells[9]().stroke(T.yellow, 0.4), stripCells[10]().stroke(T.yellow, 0.4), stripCells[11]().stroke(T.yellow, 0.4),
      stripCells[8]().lineWidth(3, 0.4), stripCells[9]().lineWidth(3, 0.4), stripCells[10]().lineWidth(3, 0.4), stripCells[11]().lineWidth(3, 0.4),
      stripLab().opacity(1, 0.4),
    )),
    // r4 B28：矩形查询对应 Z 值 8–11 四段（2×2 格，演示对应）
    at('八到十一这几段里', zRangeTxt().opacity(1, 0.4)),
    // r5 #11：点明“大致就是不保证”，8–11 里可能有框外的点
    at('大致就是不保证', chain(zRangeTxt().scale(1.05, 0.3), zRangeTxt().scale(1, 0.3))),
    at('要再过滤一遍', filterTxt().opacity(1, 0.4)),
    // r5 #11：R 树一段拆到 g13b，一维条在本拍停留到拍末
  );

  // r5 #12：Z 值压维 vs R 树直接按框索引，拆成 g13b
  say('R 树是另一条路');
  yield* beat('g13b',
    at('R 树是另一条路', all(stripG().opacity(0, 0.5), filterTxt().opacity(0, 0.4), rtreeG().opacity(1, 0.5), rtOuter().opacity(1, 0.5))),
    at('直接按矩形框索引', all(rtMid().opacity(1, 0.5), rtInner().opacity(1, 0.5), rtLab().opacity(1, 0.4))),
  );

  // r5 #12：R 树更常用，PostGIS 用广义搜索树实现 R 树
  say('R 树更常用');
  yield* beat('g13c',
    at('更常用', chain(rtLab().scale(1.05, 0.3), rtLab().scale(1, 0.3))),
    at('PostGIS', all(pgPlate().opacity(1, 0.5), pgName().opacity(1, 0.4), pgSub().opacity(1, 0.4))),
  );

  say('红、绿、蓝三维');
  yield* beat('g14',
    all(rtreeG().opacity(0, 0.5), cubeG().opacity(1, 0.5)),
    at('红、绿、蓝', chain(axR().opacity(1, 0.4), axG().opacity(1, 0.4), axB().opacity(1, 0.4))),
    // r6 P2-9：小黄框加小标“要找的一段颜色（示意）”
    at('搜一段颜色', chain(cubePt().opacity(1, 0.5), cubeBox().opacity(1, 0.5), cubeBoxLab().opacity(1, 0.4))),
  );

  say('先扫整年，再滤温度');
  yield* beat('g15',
    all(cubeG().opacity(0, 0.5), gridG().opacity(1, 0.5)),
    at('二零一三年', colHi().opacity(1, 0.5)),
    at('二十五到三十摄氏度', rowHi().opacity(1, 0.5)),
    at('先扫整年', all(gridG().opacity(0, 0.5), sieveG().opacity(1, 0.5))),
    at('再按温度过滤', all(
      ...[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].filter(i => !KEEP.includes(i)).map(i => sieveDots[i]().opacity(0.25, 0.5)),
      ...KEEP.map(i => sieveDots[i]().fill(T.green, 0.5)),
    )),
  );

  say('同时按两维缩小');
  yield* beat('g15b',
    all(sieveG().opacity(0, 0.5), gridG().opacity(1, 0.5)),
    // r6 P2-10：交集里的三个点加小标“交集里的观测（示意）”
    at('同时按', all(box2d().opacity(1, 0.5), interLab().opacity(1, 0.4), chain(hitDots[0]().opacity(1, 0.4), hitDots[1]().opacity(1, 0.4), hitDots[2]().opacity(1, 0.4)))),
    at('HyperDex', hyperPlate().opacity(1, 0.5)),
  );
});
