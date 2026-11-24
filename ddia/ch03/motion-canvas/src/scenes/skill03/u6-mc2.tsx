// U6 场景 2（MC）：b9a–b13 —— 堆文件更新（原地覆盖 / 变大搬家 / 更新索引或转发指针）、
// 聚集索引（行住在索引里，InnoDB 主键聚集、SQL Server 指定一个）、覆盖索引、重复的代价、单键不够用。
// 分镜：skill-ch03/beats-u6.md；原文：DDIA §3.6 前半（书页 p86–87，PDF p108–109）。
// 时长全部来自 timeline/u6.json（beat() 驱动），不手写 waitFor。
import {Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, chain, createRef} from '@motion-canvas/core';
import {at, makeBeats} from '../../lib/beats';
import {FONT, SAFE, SIZE, T} from '../../lib/theme';
import timeline from '../../timeline/u6.json';

export default makeScene2D(function* (view) {
  view.fill(T.bg);
  const beat = makeBeats(timeline);

  const header = createRef<Txt>();
  const anchor = createRef<Txt>();
  const say = (text: string) => anchor().text(text);

  // ---- 第 1 页：堆文件搬家（b9a–b9d）----
  const pE = createRef<Node>();
  const heap2 = createRef<Rect>();
  const slot1 = createRef<Rect>();
  const valOld = createRef<Txt>();
  const valNew = createRef<Txt>();
  const bigChip = createRef<Rect>();
  const tailSlot = createRef<Rect>();
  const moveArrow = createRef<Line>();
  const optUpdate = createRef<Rect>();
  const optFwd = createRef<Rect>();
  const fwdChip = createRef<Rect>();
  const fwdLine = createRef<Line>();

  // ---- 第 2 页：聚集索引（b10a–b10d）----
  const pF = createRef<Node>();
  const clusIdx = createRef<Rect>();
  const clusRows = [0, 1, 2].map(() => createRef<Txt>());
  const heapMini = createRef<Rect>();
  const hopArrow = createRef<Line>();
  const innoCard = createRef<Rect>();
  const innoLab = createRef<Txt>();
  const secChip = createRef<Rect>();
  const secArrow = createRef<Line>();
  const sqlCard = createRef<Rect>();
  const heapTxt = createRef<Txt>();
  const heapStrike = createRef<Line>();

  // ---- 第 3 页：覆盖索引、代价、单键局限（b11–b13）----
  const pG = createRef<Node>();
  const coverIdx = createRef<Rect>();
  const extraHl = createRef<Rect>();
  const queryChip = createRef<Rect>();
  const queryArrow = createRef<Line>();
  const answerLab = createRef<Txt>();
  const readCard = createRef<Rect>();
  const writeCard = createRef<Rect>();
  const consistLab = createRef<Txt>();
  const singleCard = createRef<Rect>();
  const colQ = createRef<Rect>();
  const crossX = createRef<Txt>();

  view.add(
    <>
      <Txt
        ref={header}
        position={[-SAFE.halfW, -SAFE.halfH]}
        offset={[-1, -1]}
        fontSize={SIZE.label}
        fill={T.muted}
        fontFamily={FONT.sans}
        text={'不止主键：二级索引与聚集索引'}
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
      <Node ref={pE} opacity={0}>
        <Rect ref={heap2} position={[0, -130]} width={1000} height={180} radius={16} fill={T.card} stroke={T.line} lineWidth={2}>
          <Txt position={[-440, -70]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'堆文件'} />
        </Rect>
        <Rect ref={slot1} position={[-300, -130]} width={280} height={100} radius={14} fill={T.card} stroke={T.line} lineWidth={2}>
          <Txt position={[0, -22]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.mono} text={'行 3'} />
        </Rect>
        <Txt ref={valOld} position={[-300, -115]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'上海·浦东'} />
        <Txt ref={valNew} position={[-300, -115]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.mono} text={'上海'} opacity={0} />
        <Rect position={[0, -130]} width={280} height={100} radius={14} fill={T.card} stroke={T.line} lineWidth={2}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'行 5 · 北京'} />
        </Rect>
        <Rect position={[300, -130]} width={280} height={100} radius={14} fill={T.card} stroke={T.line} lineWidth={2}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'行 7 · 广州'} />
        </Rect>
        <Rect ref={bigChip} position={[0, 20]} width={560} height={70} radius={14} fill={T.card} stroke={T.red} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.red} fontFamily={FONT.sans} text={'新值：上海市浦东新区…'} />
        </Rect>
        <Rect ref={tailSlot} position={[0, 130]} width={300} height={80} radius={14} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.green} fontFamily={FONT.mono} text={'新位置：行 12'} />
        </Rect>
        <Line ref={moveArrow} points={[[-300, -80], [-300, 130], [-160, 130]]} stroke={T.yellow} lineWidth={3} endArrow opacity={0} />
        <Rect ref={optUpdate} position={[-300, 215]} width={440} height={60} radius={14} fill={T.card} stroke={T.line} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'更新所有索引'} />
        </Rect>
        <Rect ref={optFwd} position={[300, 215]} width={440} height={60} radius={14} fill={T.card} stroke={T.line} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'旧位置留转发指针'} />
        </Rect>
        <Rect ref={fwdChip} position={[-300, 20]} width={260} height={70} radius={14} fill={T.card} stroke={T.yellow} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.sans} text={'转发指针 → 行 12'} />
        </Rect>
        <Line ref={fwdLine} points={[[-300, 55], [-170, 130]]} stroke={T.yellow} lineWidth={3} endArrow opacity={0} />
      </Node>

      {/* 第 2 页 */}
      <Node ref={pF} opacity={0}>
        <Rect ref={clusIdx} position={[0, -120]} width={800} height={200} radius={16} fill={T.card} stroke={T.blue} lineWidth={3}>
          <Txt position={[0, -70]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'索引'} />
        </Rect>
        <Txt ref={clusRows[0]} position={[0, -150]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'1001 · 张伟 · 上海'} opacity={0} />
        <Txt ref={clusRows[1]} position={[0, -110]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'1002 · 李伟 · 北京'} opacity={0} />
        <Txt ref={clusRows[2]} position={[0, -70]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'1003 · 王敏 · 广州'} opacity={0} />
        <Rect ref={heapMini} position={[350, 60]} width={300} height={80} radius={14} fill={T.card} stroke={T.line} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'堆文件'} />
        </Rect>
        <Line ref={hopArrow} points={[[0, -20], [350, 20]]} stroke={T.red} lineWidth={3} endArrow opacity={0} />
        <Rect ref={innoCard} position={[-280, 110]} width={420} height={80} radius={16} fill={T.card} stroke={T.purple} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.purple} fontFamily={FONT.mono} text={'InnoDB'} />
        </Rect>
        <Txt ref={innoLab} position={[-280, 175]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'主键总是聚集索引'} opacity={0} />
        <Rect ref={secChip} position={[280, 110]} width={420} height={80} radius={16} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'二级索引记主键'} />
        </Rect>
        <Line ref={secArrow} points={[[70, 110], [70, -20], [0, -20]]} stroke={T.blue} lineWidth={3} endArrow opacity={0} />
        <Rect ref={sqlCard} position={[280, 200]} width={420} height={60} radius={14} fill={T.card} stroke={T.line} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'SQL Server：每表一个'} />
        </Rect>
        <Txt ref={heapTxt} position={[-280, 240]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'堆文件位置'} opacity={0} />
        <Line key={'qa-ignore-堆文件位置划掉'} ref={heapStrike} points={[[-400, 240], [-160, 240]]} stroke={T.red} lineWidth={3} opacity={0} />
      </Node>

      {/* 第 3 页 */}
      <Node ref={pG} opacity={0}>
        <Rect ref={coverIdx} position={[0, -140]} width={760} height={170} radius={16} fill={T.card} stroke={T.blue} lineWidth={3}>
          <Txt position={[0, -55]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'索引：user_id'} />
          <Txt position={[-160, -5]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.mono} text={'user_id ·'} />
          <Txt position={[80, -5]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.mono} text={'姓名 · 城市'} />
        </Rect>
        <Rect ref={extraHl} position={[80, -135]} width={260} height={60} radius={10} stroke={T.yellow} lineWidth={3} opacity={0} />
        <Rect ref={queryChip} position={[0, 60]} width={560} height={70} radius={14} fill={T.card} stroke={T.line} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'只查姓名和城市'} />
        </Rect>
        <Line ref={queryArrow} points={[[0, 25], [0, -55]]} stroke={T.green} lineWidth={3} endArrow opacity={0} />
        <Txt ref={answerLab} position={[0, 150]} fontSize={SIZE.body} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'答案直接出来'} opacity={0} />
        <Rect ref={readCard} position={[-280, 0]} width={380} height={90} radius={16} fill={T.card} stroke={T.green} lineWidth={3} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'读快'} />
        </Rect>
        <Rect ref={writeCard} position={[280, 0]} width={380} height={90} radius={16} fill={T.card} stroke={T.red} lineWidth={3} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'写：多花功夫'} />
        </Rect>
        <Txt ref={consistLab} position={[0, 120]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'应用看不到因重复而产生的不一致'} opacity={0} />
        <Rect ref={singleCard} position={[-260, -100]} width={420} height={90} radius={16} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'单键索引：只连一列'} />
        </Rect>
        <Rect ref={colQ} position={[260, 20]} width={360} height={80} radius={16} fill={T.card} stroke={T.line} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'还要同时查另一列？'} />
        </Rect>
        <Txt ref={crossX} position={[0, -40]} fontSize={64} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'✗'} opacity={0} />
      </Node>
    </>
  );

  say('不大就原地覆盖');
  yield* beat('b9a',
    all(pE().opacity(1, 0.5)),
    at('只改值', slot1().stroke(T.yellow, 0.5)),
    at('原地覆盖', chain(valOld().opacity(0, 0.4), valNew().opacity(1, 0.4))),
  );

  say('变大了，得搬家');
  yield* beat('b9b',
    all(valNew().opacity(0, 0.4), valOld().opacity(1, 0.4), slot1().stroke(T.line, 0.4)),
    at('更大', bigChip().opacity(1, 0.5)),
    at('新位置', chain(tailSlot().opacity(1, 0.5), moveArrow().opacity(1, 0.5))),
  );

  say('更新所有索引');
  yield* beat('b9c',
    at('更新所有索引', all(optUpdate().opacity(1, 0.5), optUpdate().stroke(T.yellow, 0.4))),
    at('新位置', tailSlot().stroke(T.yellow, 0.4)),
  );

  say('旧位置留转发指针');
  yield* beat('b9d',
    all(moveArrow().opacity(0, 0.4), bigChip().opacity(0, 0.4), optUpdate().stroke(T.line, 0.4)),
    at('转发指针', all(optFwd().opacity(1, 0.5), optFwd().stroke(T.yellow, 0.4), fwdChip().opacity(1, 0.5), fwdLine().opacity(1, 0.5))),
    at('新家去', fwdChip().position([-300, 10], 1.0)),
  );

  say('行就住在索引里');
  yield* beat('b10a',
    all(pE().opacity(0, 0.5), pF().opacity(1, 0.5)),
    at('多跳一次', chain(heapMini().opacity(1, 0.5), hopArrow().opacity(1, 0.5))),
    at('聚集索引', all(heapMini().opacity(0, 0.5), hopArrow().opacity(0, 0.5), clusRows[0]().opacity(1, 0.4), clusRows[1]().opacity(1, 0.4), clusRows[2]().opacity(1, 0.4), clusIdx().stroke(T.green, 0.5))),
  );

  say('InnoDB：主键聚集');
  yield* beat('b10b',
    at('InnoDB', innoCard().opacity(1, 0.5)),
    at('聚集索引', innoLab().opacity(1, 0.5)),
  );

  say('二级索引记主键');
  yield* beat('b10c',
    at('二级索引', chain(secChip().opacity(1, 0.5), secArrow().opacity(1, 0.5))),
    at('主键', secChip().stroke(T.yellow, 0.4)),
    at('而不是', all(heapTxt().opacity(1, 0.5), heapStrike().opacity(1, 0.5))),
  );

  say('每表指定一个');
  yield* beat('b10d',
    at('SQL Server', sqlCard().opacity(1, 0.5)),
    at('指定一个', sqlCard().stroke(T.yellow, 0.4)),
  );

  say('索引里多带几列');
  yield* beat('b11',
    all(pF().opacity(0, 0.5), pG().opacity(1, 0.5)),
    at('覆盖索引', extraHl().opacity(1, 0.5)),
    at('多带几列', chain(queryChip().opacity(1, 0.5), queryArrow().opacity(1, 0.5))),
    at('覆盖了这个查询', answerLab().opacity(1, 0.5)),
  );

  say('读快，维护贵');
  yield* beat('b12',
    all(coverIdx().opacity(0, 0.4), extraHl().opacity(0, 0.4), queryChip().opacity(0, 0.4), queryArrow().opacity(0, 0.4), answerLab().opacity(0, 0.4)),
    at('读得快', chain(readCard().opacity(1, 0.5), readCard().scale(1.04, 1.5))),
    at('多花功夫', chain(writeCard().opacity(1, 0.5), writeCard().scale(1.04, 1.5))),
    at('不一致', consistLab().opacity(1, 0.5)),
  );

  say('单键不够用了');
  yield* beat('b13',
    all(readCard().opacity(0, 0.4), writeCard().opacity(0, 0.4), consistLab().opacity(0, 0.4)),
    at('单个键', singleCard().opacity(1, 0.5)),
    at('好几列', chain(colQ().opacity(1, 0.5), crossX().opacity(1, 0.5))),
  );
});
