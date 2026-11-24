// U7 场景 1（MC）：b1–b12b —— 钩子（地图框餐馆）、二维范围查询（SQL 四个数字原样出现）、
// 一维筛子演示（纬度筛/经度筛/两者同时筛不出）、空间填充曲线、R 树、颜色立方体、日期 × 温度。
// 分镜：skill-ch03/beats-u7.md；原文：DDIA §3.6 后半（书页 p87–88）。
// 时长全部来自 timeline/u7.json（beat() 驱动），不手写 waitFor。
// 布局避让：筛子带是半透明填充（<0.5），只盖圆点不盖文字；SQL 卡与各组切换时旧组先淡出。
import {Circle, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, chain, createRef} from '@motion-canvas/core';
import {at, makeBeats} from '../../lib/beats';
import {FONT, SAFE, SIZE, T} from '../../lib/theme';
import timeline from '../../timeline/u7.json';

// 地图上的餐馆圆点（14 个）。纬度带 y∈[-160,40] 含 d8/d9/d12/d13；
// 经度带 x∈[-120,240] 含 d3/d4/d5/d10/d11；两者交集故意为空（b6 筛不出来）。
const DOTS: [number, number][] = [
  [-420, -200], [-300, -170], [-180, -210], [-60, -180],
  [60, -200], [180, -170], [300, -200], [420, -180],
  [-360, -60], [-200, -30], [-40, 90], [120, 100],
  [280, -70], [420, -40],
];
const IN_LAT = [8, 9, 12, 13];
const OUT_LAT = [0, 1, 2, 3, 4, 5, 6, 7, 10, 11];
const IN_LON = [3, 4, 5, 10, 11];
const OUT_LON = [0, 1, 2, 6, 7, 8, 9, 12, 13];

export default makeScene2D(function* (view) {
  view.fill(T.bg);
  const beat = makeBeats(timeline);

  const header = createRef<Txt>();
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
  const crossX = createRef<Txt>();

  // SQL 卡
  const sqlG = createRef<Node>();
  const sqlTitle = createRef<Txt>();
  const sqlLine1 = createRef<Txt>();
  const sqlLine2 = createRef<Txt>();

  // 空间填充曲线 + 一维条
  const curve = createRef<Line>();
  const stripG = createRef<Node>();
  const stripLab = createRef<Txt>();

  // R 树
  const rtreeG = createRef<Node>();
  const rtOuter = createRef<Rect>();
  const rtMid = createRef<Rect>();
  const rtInner = createRef<Rect>();
  const rtLab = createRef<Txt>();
  const pgPlate = createRef<Rect>();
  const pgName = createRef<Txt>();
  const pgSub = createRef<Txt>();

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

  // 日期 × 温度网格：4 列（2011–2014）× 3 行（20–25 / 25–30 / 30–35℃）
  const gridG = createRef<Node>();
  const colHi = createRef<Rect>();
  const rowHi = createRef<Rect>();
  const interCell = createRef<Rect>();
  const box2d = createRef<Rect>();
  const hitDots = [0, 1, 2].map(() => createRef<Circle>());
  const hyperPlate = createRef<Rect>();

  // 一维筛子（2013 年记录行）
  const sieveG = createRef<Node>();
  const sieveDots = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(() => createRef<Circle>());
  const KEEP = [2, 5, 9];

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
              width={20}
              height={20}
              fill={T.blue}
            />
          ))}
        </Node>
        <Txt ref={dotLab} position={[-300, -130]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'一家餐馆'} opacity={0} />
        <Rect ref={queryRect} position={[-240, -120]} width={360} height={200} stroke={T.yellow} lineWidth={3} opacity={0} />
        <Txt ref={qMark} position={[350, 100]} fontSize={72} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'?'} opacity={0} />
        <Rect ref={latBand} position={[0, -60]} width={980} height={200} fill={T.green} opacity={0} />
        <Rect ref={lonBand} position={[60, -50]} width={360} height={400} fill={T.blue} opacity={0} />
        <Txt ref={latTag} position={[-300, 190]} fontSize={SIZE.body} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'纬度筛'} opacity={0} />
        <Txt ref={lonTag} position={[300, 190]} fontSize={SIZE.body} fontWeight={700} fill={T.blue} fontFamily={FONT.sans} text={'经度筛'} opacity={0} />
        <Txt ref={anyLon} position={[0, 230]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'经度任意'} opacity={0} />
        <Txt ref={anyLat} position={[0, 230]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'纬度任意'} opacity={0} />
        <Txt ref={crossX} position={[60, -60]} fontSize={72} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'✗'} opacity={0} />
      </Node>

      {/* SQL 卡 */}
      <Node ref={sqlG} opacity={0}>
        <Rect position={[0, -50]} width={780} height={170} radius={16} fill={T.card} stroke={T.blue} lineWidth={3} />
        <Txt ref={sqlTitle} position={[0, -165]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'二维范围查询'} opacity={0} />
        <Txt ref={sqlLine1} position={[0, -80]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.mono} text={'纬度 51.4946 ~ 51.5079'} opacity={0} />
        <Txt ref={sqlLine2} position={[0, -20]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.mono} text={'经度 -0.1162 ~ -0.1004'} opacity={0} />
      </Node>

      {/* 空间填充曲线 */}
      <Line
        ref={curve}
        points={[[-420, -200], [-300, -170], [-180, -210], [-60, -180], [60, -200], [180, -170]]}
        stroke={T.yellow}
        lineWidth={3}
        endArrow
        opacity={0}
      />
      <Node ref={stripG} opacity={0}>
        <Txt position={[0, -120]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'二维位置 → 一个数字'} />
        {[0, 1, 2, 3, 4, 5, 6, 7].map(i => (
          <Rect
            key={`cell-${i}`}
            position={[-315 + i * 90, 20]}
            width={80}
            height={60}
            fill={T.card}
            stroke={T.blue}
            lineWidth={2}
          >
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={String(i + 1)} />
          </Rect>
        ))}
        <Txt ref={stripLab} position={[0, 120]} fontSize={SIZE.body} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'一维索引'} opacity={0} />
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

  say('框出一片餐馆');
  yield* beat('b1',
    all(mapG().opacity(1, 0.5)),
    at('地图上', dotsG().opacity(1, 0.6)),
    at('纬度筛', all(queryRect().opacity(1, 0.5), qMark().opacity(1, 0.4))),
  );

  say('每家餐馆有经纬度');
  yield* beat('b2',
    at('经纬度', dotLab().opacity(1, 0.5)),
    at('哪一片', queryRect().lineWidth(5, 0.4)),
    at('全部餐馆', dotsG().scale(1.02, 1.0)),
  );

  say('二维范围查询');
  yield* beat('b3a',
    all(mapG().opacity(0, 0.5), sqlG().opacity(1, 0.5)),
    at('二维范围查询', sqlTitle().opacity(1, 0.4)),
  );

  say('纬度、经度各一个范围');
  yield* beat('b3b',
    at('纬度大于', sqlLine1().opacity(1, 0.4)),
    at('小于五一点五零七九', sqlLine1().fill(T.yellow, 1.2)),
    at('经度大于', sqlLine2().opacity(1, 0.4)),
    at('小于负零点一零零四', sqlLine2().fill(T.yellow, 1.2)),
  );

  say('纬度筛：经度任意');
  yield* beat('b4',
    all(sqlG().opacity(0, 0.5), mapG().opacity(1, 0.5), dotLab().opacity(0, 0.4), queryRect().opacity(0, 0.4), qMark().opacity(0, 0.4)),
    at('纬度范围', all(
      latBand().opacity(0.22, 0.5),
      latTag().opacity(1, 0.4),
      ...IN_LAT.map(i => dotRefs[i]().fill(T.yellow, 0.4)),
      ...OUT_LAT.map(i => dotRefs[i]().opacity(0.25, 0.4)),
    )),
    at('经度任意', anyLon().opacity(1, 0.4)),
  );

  say('经度筛：纬度任意');
  yield* beat('b5',
    all(
      latBand().opacity(0, 0.4), latTag().opacity(0, 0.4), anyLon().opacity(0, 0.4),
      ...IN_LAT.map(i => dotRefs[i]().fill(T.blue, 0.3)),
      ...OUT_LAT.map(i => dotRefs[i]().opacity(1, 0.3)),
    ),
    at('经度范围', all(
      lonBand().opacity(0.22, 0.5),
      lonTag().opacity(1, 0.4),
      ...IN_LON.map(i => dotRefs[i]().fill(T.yellow, 0.4)),
      ...OUT_LON.map(i => dotRefs[i]().opacity(0.25, 0.4)),
    )),
    at('北极到南极', anyLat().opacity(1, 0.4)),
  );

  say('两者同时，筛不出来');
  yield* beat('b6',
    all(
      latBand().opacity(0.22, 0.4),
      latTag().opacity(1, 0.4),
      anyLat().opacity(0, 0.4),
      ...IN_LON.map(i => dotRefs[i]().fill(T.blue, 0.3)),
      ...DOTS.map((_, i) => dotRefs[i]().opacity(0.25, 0.4)),
    ),
    at('同时满足', all(lonBand().opacity(0.22, 0.4), lonTag().opacity(1, 0.4))),
    at('筛不出来', crossX().opacity(1, 0.4)),
  );

  say('二维压成一维');
  yield* beat('b7',
    at('二维位置', curve().opacity(1, 0.6)),
    at('空间填充曲线', all(mapG().opacity(0, 0.5), curve().opacity(0, 0.4), stripG().opacity(1, 0.5))),
    at('一维索引', stripLab().opacity(1, 0.4)),
  );

  say('专用的空间索引');
  yield* beat('b8a',
    all(stripG().opacity(0, 0.5), rtreeG().opacity(1, 0.5), rtOuter().opacity(1, 0.5)),
    at('专用的空间索引', rtMid().opacity(1, 0.5)),
    at('R 树', all(rtInner().opacity(1, 0.5), rtLab().opacity(1, 0.4))),
  );

  say('R 树，PostGIS 在用');
  yield* beat('b8b',
    at('PostGIS', all(pgPlate().opacity(1, 0.5), pgName().opacity(1, 0.4))),
    at('广义搜索树', pgSub().opacity(1, 0.4)),
    at('做 R 树索引', pgPlate().stroke(T.yellow, 0.4)),
  );

  say('红、绿、蓝三维');
  yield* beat('b9',
    all(rtreeG().opacity(0, 0.5), cubeG().opacity(1, 0.5)),
    at('红、绿、蓝', chain(axR().opacity(1, 0.4), axG().opacity(1, 0.4), axB().opacity(1, 0.4))),
    at('搜某个颜色范围内的产品', chain(
      all(axR().scale(1.15, 0.3), axG().scale(1.15, 0.3), axB().scale(1.15, 0.3)),
      all(axR().scale(1.0, 0.3), axG().scale(1.0, 0.3), axB().scale(1.0, 0.3)),
    )),
  );

  say('颜色是立方体里的点');
  yield* beat('b10',
    at('立方体里的一个点', cubePt().opacity(1, 0.5)),
    at('框出立方体里的一块', cubeBox().opacity(1, 0.5)),
  );

  say('2013 年，25–30℃');
  yield* beat('b11',
    all(cubeG().opacity(0, 0.5), gridG().opacity(1, 0.5)),
    at('二零一三年', colHi().opacity(1, 0.5)),
    at('二十五到三十摄氏度', rowHi().opacity(1, 0.5)),
    at('全部观测', interCell().opacity(0.3, 0.5)),
  );

  say('先扫整年，再滤温度');
  yield* beat('b12a',
    all(gridG().opacity(0, 0.5), sieveG().opacity(1, 0.5)),
    at('再按温度过滤', all(
      ...[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].filter(i => !KEEP.includes(i)).map(i => sieveDots[i]().opacity(0.25, 0.5)),
      ...KEEP.map(i => sieveDots[i]().fill(T.green, 0.5)),
    )),
  );

  say('同时按两维缩小');
  yield* beat('b12b',
    all(sieveG().opacity(0, 0.5), gridG().opacity(1, 0.5)),
    at('同时按', all(box2d().opacity(1, 0.5), chain(hitDots[0]().opacity(1, 0.4), hitDots[1]().opacity(1, 0.4), hitDots[2]().opacity(1, 0.4)))),
    at('HyperDex', hyperPlate().opacity(1, 0.5)),
  );
});
