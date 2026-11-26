// U7 场景 3（MC）：g28–g35b —— 磁盘别扭但持久便宜、内存变便宜、数据集放进内存、
// 磁盘只是追加写日志（重启重载）、反缓存走查：数据集比内存大、最近最少用逐出到磁盘、
// 访问时加载回来、记录粒度 vs 整页、索引仍须完全放进内存。
// 分镜：skill-ch03/beats-u7.md；原文：DDIA §3.6 后半（书页 p88–90）。
// 时长全部来自 timeline/u7.json（beat() 驱动），不手写 waitFor。
// 左区是内存 / 磁盘栈（反缓存主舞台），右区是磁盘圆盘、价格线、机器、操作系统页。
import {Circle, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {Vector2, all, chain, createRef} from '@motion-canvas/core';
import {at, makeBeats} from '../../lib/beats';
import {FONT, SAFE, SIZE, T} from '../../lib/theme';
import {Counter, Meter} from '../../lib/schemas';
import timeline from '../../timeline/u7.json';

// 内存框里的 6 条记录（R1 最久未用 → R6 最近用）
const REC_LABELS = ['记录 1 · 最久未用', '记录 2', '记录 3', '记录 4', '记录 5', '记录 6 · 最近用'];
const REC_Y = [-205, -165, -125, -85, -45, -5];

export default makeScene2D(function* (view) {
  view.fill(T.bg);
  const beat = makeBeats(timeline);

  const header = createRef<Txt>();
  const anchor = createRef<Txt>();
  const say = (text: string) => anchor().text(text);

  // g28：磁盘圆盘 + 排布
  const diskG = createRef<Node>();
  const headLine = createRef<Line>();
  const blockRefs = [0, 1, 2, 3].map(() => createRef<Rect>());
  const badge1 = createRef<Rect>();
  const badge2 = createRef<Rect>();

  // g29：价格线
  const priceG = createRef<Node>();
  const priceLine = createRef<Line>();
  const smallData = createRef<Rect>();
  const dataBlock = createRef<Rect>();
  const machG = createRef<Node>();

  // 内存 / 磁盘栈
  const memG = createRef<Node>();
  const memBox = createRef<Rect>();
  const diskBox = createRef<Rect>();
  const recRefs = REC_LABELS.map(() => createRef<Rect>());
  // r4 B27：记录标签要能改（记录 1 回来变“最近用”、记录 6 去掉“最近用”）
  const recTxtRefs = REC_LABELS.map(() => createRef<Txt>());
  // r4 B27：新记录 7
  const newRec = createRef<Rect>();
  const recRing = createRef<Circle>();
  const logBar = createRef<Rect>();
  const logLab = createRef<Txt>();
  const readA1 = createRef<Line>();
  const readA2 = createRef<Line>();
  const restartBtn = createRef<Rect>();
  const reloadA = createRef<Line>();
  const specialTag = createRef<Txt>();
  const meter = new Meter(new Vector2(-20, -110), 200, {w: 20, title: '内存占用', tone: T.red});
  // r6 P2-7c：逐出计数是累计数（磁盘框里任何时刻只有最近逐出的一条）
  const evictCount = new Counter([-280, 258], '累计逐出 ', ' 条');
  // r6 P2-7a：格子号与新近度排序是两回事（小标，随 g31 出现、g33 收起）
  const orderNote = createRef<Txt>();

  // g30：比内存大的数据集
  const bigData = createRef<Rect>();
  const bigQ = createRef<Txt>();
  const diskCent = createRef<Rect>();
  const diskCentX = createRef<Txt>();

  // g33：磁盘文件 + 三枚标签
  const fileG = createRef<Node>();
  const tagBackup = createRef<Rect>();
  const tagInspect = createRef<Rect>();
  const tagAnalyze = createRef<Rect>();

  // g34/g35：操作系统页 vs 记录粒度
  const osPage = createRef<Rect>();
  const osLab = createRef<Txt>();
  const swapLab = createRef<Txt>();
  const pageGrey = createRef<Rect>();
  const grainLab = createRef<Txt>();
  const indexCard = createRef<Rect>();

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

      {/* g28：磁盘圆盘 */}
      <Node ref={diskG} opacity={0}>
        <Circle position={[300, -110]} width={200} height={200} fill={T.card} stroke={T.line} lineWidth={3} />
        <Circle position={[300, -110]} width={60} height={60} fill={T.bg} stroke={T.line} lineWidth={2} />
        <Line ref={headLine} points={[[300, -110], [420, -110]]} stroke={T.yellow} lineWidth={3} endArrow />
        <Txt position={[300, -240]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'磁盘'} />
        {[0, 1, 2, 3].map(i => (
          <Rect
            key={`blk-${i}`}
            ref={blockRefs[i]}
            position={[160 + i * 90, 40]}
            width={80}
            height={44}
            fill={T.card}
            stroke={T.line}
            lineWidth={2}
          />
        ))}
        <Txt position={[300, 90]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'数据排布整齐'} />
      </Node>
      <Rect ref={badge1} position={[190, 190]} width={220} height={80} radius={14} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
        <Txt position={[0, -14]} fontSize={SIZE.body} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'持久'} />
        <Txt position={[0, 20]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'断电不丢内容'} />
      </Rect>
      <Rect ref={badge2} position={[430, 190]} width={260} height={80} radius={14} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
        <Txt position={[0, -14]} fontSize={SIZE.body} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'每吉字节更便宜'} />
        <Txt position={[0, 20]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'成本比内存低'} />
      </Rect>

      {/* g29：价格线 */}
      <Node ref={priceG} opacity={0}>
        <Txt position={[300, -240]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'内存价格'} />
        <Line ref={priceLine} points={[[140, -200], [460, -20]]} stroke={T.green} lineWidth={4} endArrow end={0} />
        <Txt position={[300, 30]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} text={'越来越便宜'} />
      </Node>
      <Rect ref={smallData} position={[300, -60]} width={220} height={130} radius={14} fill={T.card} stroke={T.blue} lineWidth={3} opacity={0}>
        <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'数据集（不大）'} />
      </Rect>
      <Rect ref={dataBlock} position={[300, -60]} width={220} height={130} radius={14} fill={T.card} stroke={T.blue} lineWidth={3} opacity={0}>
        <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'数据集'} />
      </Rect>
      <Node ref={machG} opacity={0}>
        {[0, 1, 2].map(i => (
          <Rect key={`m-${i}`} position={[140 + i * 160, 190]} width={140} height={90} radius={14} fill={T.card} stroke={T.blue} lineWidth={2}>
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={`机器 ${i + 1}`} />
          </Rect>
        ))}
      </Node>

      {/* 内存 / 磁盘栈 */}
      <Node ref={memG} opacity={0}>
        <Rect ref={memBox} position={[-280, -110]} width={460} height={260} radius={16} fill={T.card} stroke={T.green} lineWidth={3} />
        <Txt position={[-480, -260]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'内存'} />
        <Rect ref={diskBox} position={[-280, 170]} width={460} height={110} radius={16} fill={T.card} stroke={T.red} lineWidth={3} />
        <Txt position={[-480, 100]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'磁盘'} />
      </Node>
      {REC_LABELS.map((lab, i) => (
        <Rect
          key={`rec-${i}`}
          ref={recRefs[i]}
          position={[-280, REC_Y[i]]}
          width={360}
          height={36}
          radius={8}
          fill={i === 0 ? T.yellow : T.blue}
          opacity={0}
        >
          <Txt ref={recTxtRefs[i]} fontSize={SIZE.label} fill={T.bg} fontFamily={FONT.sans} text={lab} />
        </Rect>
      ))}
      {/* r4 B27：新记录 7，进来占 1 号格 */}
      <Rect ref={newRec} position={[-280, -205]} width={360} height={36} radius={8} fill={T.green} opacity={0}>
        <Txt fontSize={SIZE.label} fill={T.bg} fontFamily={FONT.sans} text={'记录 7 · 新来的'} />
      </Rect>
      <Circle ref={recRing} position={[-280, -205]} width={380} height={52} stroke={T.yellow} lineWidth={3} opacity={0} />
      {meter.nodes()}
      {evictCount.node}
      <Txt ref={orderNote} position={[300, 200]} fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.sans} text={'格子是位置，上下按新近度排'} opacity={0} />
      <Rect ref={logBar} position={[-280, 170]} width={420} height={30} radius={8} fill={T.yellow} opacity={0} />
      <Txt ref={logLab} position={[-280, 215]} fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.sans} text={'追加写日志'} opacity={0} />
      <Line ref={readA1} points={[[-380, -280], [-380, -240]]} stroke={T.green} lineWidth={3} endArrow end={0} />
      <Line ref={readA2} points={[[-180, -280], [-180, -240]]} stroke={T.green} lineWidth={3} endArrow end={0} />
      <Rect ref={restartBtn} position={[300, 110]} width={200} height={80} radius={14} fill={T.card} stroke={T.yellow} lineWidth={2} opacity={0}>
        <Txt fontSize={SIZE.body} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'重启'} />
      </Rect>
      <Line ref={reloadA} points={[[-280, 120], [-280, 20]]} stroke={T.green} lineWidth={3} endArrow end={0} />
      <Txt ref={specialTag} position={[300, 220]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'特殊硬件除外'} opacity={0} />

      {/* g30：比内存大的数据集 */}
      <Rect ref={bigData} position={[300, -60]} width={220} height={130} radius={14} fill={T.card} stroke={T.red} lineWidth={3} opacity={0}>
        <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'数据集'} />
      </Rect>
      <Txt ref={bigQ} position={[480, -190]} fontSize={72} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'?'} opacity={0} />
      <Rect ref={diskCent} position={[300, 60]} width={300} height={110} radius={14} fill={T.card} stroke={T.red} lineWidth={3} opacity={0}>
        <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'磁盘中心架构'} />
      </Rect>
      <Txt key="qa-ignore-打叉-磁盘中心" ref={diskCentX} position={[300, 60]} fontSize={72} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'✗'} opacity={0} />

      {/* g33：磁盘文件 + 三枚标签 */}
      <Node ref={fileG} opacity={0}>
        <Rect position={[300, -60]} width={260} height={120} radius={14} fill={T.card} stroke={T.blue} lineWidth={3} />
        <Txt position={[300, -60]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'磁盘文件'} />
        <Rect ref={tagBackup} position={[300, 80]} width={200} height={56} radius={12} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'容易备份'} />
        </Rect>
        <Rect ref={tagInspect} position={[300, 150]} width={200} height={56} radius={12} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'容易检查'} />
        </Rect>
        <Rect ref={tagAnalyze} position={[300, 220]} width={220} height={56} radius={12} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'外部工具能分析'} />
        </Rect>
      </Node>

      {/* g34/g35：操作系统页 vs 记录粒度 */}
      <Rect ref={osPage} position={[300, -60]} width={400} height={200} radius={14} fill={T.card} stroke={T.blue} lineWidth={3} opacity={0}>
        <Txt position={[0, -60]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'操作系统：整页'} />
        <Txt position={[0, 0]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'一页里有很多条记录'} />
        <Txt position={[0, 50]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'整页换出'} />
      </Rect>
      <Txt ref={osLab} position={[300, -190]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'操作系统'} opacity={0} />
      <Txt ref={swapLab} position={[300, 90]} fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.sans} text={'交换文件'} opacity={0} />
      <Rect ref={pageGrey} position={[300, -60]} width={400} height={200} radius={14} fill={T.line} opacity={0}>
        <Txt fontSize={SIZE.body} fontWeight={700} fill={T.muted} fontFamily={FONT.sans} text={'整页粒度'} />
      </Rect>
      <Txt ref={grainLab} position={[300, 90]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} text={'记录粒度'} opacity={0} />
      <Rect ref={indexCard} position={[-280, -262]} width={220} height={52} radius={10} fill={T.yellow} opacity={0}>
        <Txt fontSize={SIZE.label} fontWeight={700} fill={T.bg} fontFamily={FONT.sans} text={'索引（全在内存）'} />
      </Rect>
    </>
  );

  say('磁盘难打交道');
  yield* beat('g28',
    all(diskG().opacity(1, 0.5)),
    at('数据结构', all(...blockRefs.map(b => b().fill(T.blue, 0.4)))),
    at('磁盘逼出来', headLine().points([[300, -110], [360, -200]], 0.8)),
  );

  say('持久，每吉字节更便宜');
  yield* beat('g28b',
    at('磁盘难打交道', diskG().scale(1.02, 0.6)),
    at('持久', badge1().opacity(1, 0.5)),
    at('每吉字节比内存便宜', badge2().opacity(1, 0.5)),
  );

  say('成本论点被削弱');
  yield* beat('g29',
    all(diskG().opacity(0, 0.5), badge1().opacity(0, 0.4), badge2().opacity(0, 0.4), priceG().opacity(1, 0.5)),
    at('内存的价格', priceLine().end(1, 1.2)),
  );

  say('数据集不大');
  yield* beat('g29a',
    at('数据也没那么多', smallData().opacity(1, 0.5)),
  );

  say('整个放进内存');
  yield* beat('g29b',
    all(priceG().opacity(0, 0.5), smallData().opacity(0, 0.4), memG().opacity(1, 0.5), dataBlock().opacity(1, 0.4)),
    at('整个放进内存', chain(
      dataBlock().position([-280, -110], 1.2),
      all(dataBlock().opacity(0, 0.4), ...recRefs.map(r => r().opacity(1, 0.4))),
    )),
    at('分布在几台机器上', machG().opacity(1, 0.5)),
  );

  say('磁盘只是日志，读走内存');
  yield* beat('g29c',
    all(machG().opacity(0, 0.5)),
    at('追加写日志', all(logBar().opacity(1, 0.4), logLab().opacity(1, 0.4))),
    at('读完全由内存服务', all(readA1().end(1, 0.8), readA2().end(1, 0.8))),
    at('重启时', chain(
      restartBtn().opacity(1, 0.4),
      all(...recRefs.map(r => r().opacity(0.15, 0.5))),
      reloadA().end(1, 0.8),
      all(...recRefs.map(r => r().opacity(1, 0.5))),
    )),
    at('特殊硬件', specialTag().opacity(1, 0.4)),
  );

  say('比内存大的数据集？');
  yield* beat('g30',
    all(readA1().end(0, 0.3), readA2().end(0, 0.3), reloadA().end(0, 0.3), restartBtn().opacity(0, 0.4), specialTag().opacity(0, 0.4), logBar().opacity(0, 0.4), logLab().opacity(0, 0.4)),
    at('装下比可用内存大的数据', chain(
      all(bigData().opacity(1, 0.5), bigQ().opacity(1, 0.4)),
      all(bigData().scale(1.35, 1.2), ...meter.nodes().map(n => n.opacity(1, 0.4)), meter.to(1.0, 0.8)),
    )),
  );

  say('不用带回磁盘架构');
  yield* beat('g30b',
    at('磁盘为中心', all(diskCent().opacity(1, 0.5), diskCentX().opacity(1, 0.4))),
  );

  say('反缓存：逐出到磁盘');
  yield* beat('g31',
    all(bigData().opacity(0, 0.5), bigQ().opacity(0, 0.4), diskCent().opacity(0, 0.5), diskCentX().opacity(0, 0.4)),
    at('反缓存', evictCount.node.opacity(1, 0.4)),
    // r5 #7：内存里上面是最久未用、下面是最近用
    at('上面是最久未用', chain(recRefs[0]().scale(1.08, 0.3), recRefs[0]().scale(1, 0.3))),
    at('下面是最近用', chain(recRefs[5]().scale(1.08, 0.3), recRefs[5]().scale(1, 0.3))),
    at('内存不够时', meter.to(1.0, 0.4)),
    at('逐出到磁盘', chain(
      recRefs[0]().position([-280, 170], 1.2),
      chain(evictCount.n(1, 0.6)),
    )),
    // r4 B27：新记录 7 进来，占 1 号格
    at('新记录七进来', newRec().opacity(1, 0.4)),
    // r6 QA：idle 补——'占一号格'与尾句各跟一步，免得尾部静止超 6s
    at('占一号格', chain(newRec().scale(1.08, 0.3), newRec().scale(1, 0.3))),
    // r6 P2-7a：一号格只是空出来的位置，上下顺序按新近度排
    at('一号格只是空出来的位置', orderNote().opacity(1, 0.4)),
    at('上下顺序按新近度排', chain(newRec().scale(1.08, 0.3), newRec().scale(1, 0.3), recRefs[5]().scale(1.08, 0.3), recRefs[5]().scale(1, 0.3))),
  );

  say('访问时再加载回来');
  yield* beat('g32',
    at('访问被逐出的记录', all(recRing().opacity(1, 0.4), recRing().position([-280, 170], 0.3))),
    // r4 B27：记录 1 加载回来变最近用（落到最下一格），最久未用的记录 2 顶替它去磁盘，其余记录各上移一格
    // r6 P2-7b：标签随状态及时更新——记录 1 落地时即改标“最近用”（不再等到“变成最近用的”才改），记录 6 同步去掉“最近用”
    at('加载回内存', chain(
      recRefs[1]().position([-380, 170], 1.2),
      all(
        recRefs[2]().position([-280, -205], 0.8),
        recRefs[3]().position([-280, -165], 0.8),
        recRefs[4]().position([-280, -125], 0.8),
        recRefs[5]().position([-280, -85], 0.8),
        newRec().position([-280, -45], 0.8),
        recRefs[0]().position([-280, -5], 1.2),
        recTxtRefs[0]().text('记录 1 · 最近用', 0),
        recTxtRefs[5]().text('记录 6', 0),
      ),
      recRing().opacity(0, 0.4),
    )),
    at('变成最近用的', chain(
      recRefs[0]().scale(1.08, 0.3), recRefs[0]().scale(1, 0.3),
      evictCount.n(2, 0.6),
    )),
  );

  // r6 P2-7a：记录 7 也按新近度往下排，落到倒数第二（g32 加长句 TTS 坏——尾部幻觉重复“第四个”，
  // 按 r3/r5 拆拍做法：g32 恢复 r5 原句原音频，本句拆成短拍 g32c 单录）
  say('记录 7 落到倒数第二');
  yield* beat('g32c',
    at('记录七也按新近度往下排', chain(newRec().scale(1.08, 0.3), newRec().scale(1, 0.3))),
  );

  // r5 #8：再访问记录 2 也一样——它回来变最新，轮到记录 3 被逐出（只点明顺序，不移动卡片）
  say('再访问记录 2 也一样');
  yield* beat('g32b',
    at('再访问记录二也一样', chain(recRefs[1]().scale(1.08, 0.3), recRefs[1]().scale(1, 0.3))),
    // r6 P2-7c：累计逐出数随之变 3（磁盘框里仍只有最近逐出的一条）
    at('轮到记录三被逐出', chain(recRefs[2]().scale(1.08, 0.3), recRefs[2]().scale(1, 0.3), evictCount.n(3, 0.6))),
  );

  say('易备份、易检查、易分析');
  yield* beat('g33',
    all(fileG().opacity(1, 0.5), orderNote().opacity(0, 0.4)),
    at('备份', tagBackup().opacity(1, 0.4)),
    at('检查', tagInspect().opacity(1, 0.4)),
    at('分析', tagAnalyze().opacity(1, 0.4)),
  );

  say('像操作系统的换页');
  yield* beat('g34',
    all(fileG().opacity(0, 0.5), osPage().opacity(1, 0.5), osLab().opacity(1, 0.4)),
    at('虚拟内存和交换文件', chain(
      all(osPage().position([760, -60], 1.2), osPage().opacity(0, 0.5)),
      swapLab().opacity(1, 0.4),
    )),
  );

  say('记录粒度，比整页更细');
  yield* beat('g35',
    all(osPage().opacity(0, 0.4), swapLab().opacity(0, 0.4), pageGrey().opacity(0.55, 0.5)),
    at('更高效', grainLab().opacity(1, 0.4)),
    // r4 B27：g32 已把记录 2 逐出到磁盘（[-380, 170]），这里记录 3 也滑到磁盘；
    // 磁盘框只有 460 宽、单张记录卡就 360 宽，并排会重叠——两张卡改上下叠放，
    // 都居中在 [-280]（框内），记录 2 上移 [-280, 140]、记录 3 落 [-280, 195]
    at('单个记录为粒度', all(
      recRefs[1]().position([-280, 140], 0.8),
      recRefs[2]().position([-280, 195], 1.2),
    )),
    at('整个内存页', pageGrey().opacity(0.25, 0.4)),
  );

  say('索引仍须全进内存');
  yield* beat('g35b',
    all(indexCard().opacity(1, 0.5)),
    at('索引仍须完全放进内存', indexCard().scale(1.08, 0.3)),
  );
});
