// U7 场景 6（MC）：b38a–b43 —— 数据集比内存大、不用回到磁盘中心、反缓存（逐出到磁盘、
// 访问时加载回来）、像操作系统换页但以记录为粒度、索引仍须全进内存、非易失性内存、收束三条岔路。
// 分镜：skill-ch03/beats-u7.md；原文：DDIA §3.6 后半（书页 p90）。
// 时长全部来自 timeline/u7.json（beat() 驱动），不手写 waitFor。
import {Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, chain, createRef} from '@motion-canvas/core';
import {at, makeBeats} from '../../lib/beats';
import {FONT, SAFE, SIZE, T} from '../../lib/theme';
import timeline from '../../timeline/u7.json';

export default makeScene2D(function* (view) {
  view.fill(T.bg);
  const beat = makeBeats(timeline);

  const header = createRef<Txt>();
  const anchor = createRef<Txt>();
  const say = (text: string) => anchor().text(text);

  // 数据集比内存大
  const bigG = createRef<Node>();
  const bigMem = createRef<Rect>();
  const bigData = createRef<Rect>();
  const oldWay = createRef<Rect>();
  const oldWayX = createRef<Txt>();

  // 反缓存
  const antiG = createRef<Node>();
  const antiMem = createRef<Rect>();
  const antiR1 = createRef<Rect>();
  const antiR2 = createRef<Rect>();
  const antiR3 = createRef<Rect>();
  const antiR4 = createRef<Rect>();
  const antiLru = createRef<Rect>();
  const antiLruLab = createRef<Txt>();
  const antiDisk = createRef<Rect>();

  // 操作系统换页 vs 记录粒度
  const osG = createRef<Node>();
  const osBox = createRef<Rect>();
  const osPage = createRef<Rect>();
  const dbBox = createRef<Rect>();
  const dbRec = createRef<Rect>();
  const dbWin = createRef<Txt>();

  // 索引仍须全进内存
  const idxG = createRef<Node>();
  const idxMem = createRef<Rect>();
  const idxCard = createRef<Rect>();

  // 非易失性内存
  const nvmG = createRef<Node>();
  const nvmPlate = createRef<Rect>();
  const nvmTag = createRef<Txt>();

  // 收束：三条岔路
  const closeG = createRef<Node>();
  const roadDim = createRef<Rect>();
  const roadSim = createRef<Rect>();
  const roadMem = createRef<Rect>();

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

      {/* 数据集比内存大 */}
      <Node ref={bigG} opacity={0}>
        <Rect ref={bigMem} position={[0, -110]} width={520} height={150} radius={16} fill={T.card} stroke={T.green} lineWidth={3} opacity={0}>
          <Txt position={[0, -45]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'内存'} />
        </Rect>
        <Rect ref={bigData} position={[0, -10]} width={640} height={110} radius={14} fill={T.blue} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.bg} fontFamily={FONT.sans} text={'数据集'} />
        </Rect>
        <Rect ref={oldWay} position={[0, 110]} width={380} height={80} radius={14} fill={T.card} stroke={T.muted} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'磁盘中心架构'} />
        </Rect>
        <Txt ref={oldWayX} position={[150, 110]} fontSize={SIZE.title} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'✗'} opacity={0} />
      </Node>

      {/* 反缓存 */}
      <Node ref={antiG} opacity={0}>
        <Rect ref={antiMem} position={[0, -80]} width={460} height={260} radius={16} fill={T.card} stroke={T.green} lineWidth={3} opacity={0}>
          <Txt position={[0, -100]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'内存'} />
        </Rect>
        <Rect ref={antiR1} position={[0, -146]} width={380} height={36} radius={8} fill={T.blue} opacity={0} />
        <Rect ref={antiR2} position={[0, -102]} width={380} height={36} radius={8} fill={T.blue} opacity={0} />
        <Rect ref={antiR3} position={[0, -58]} width={380} height={36} radius={8} fill={T.blue} opacity={0} />
        <Rect ref={antiR4} position={[0, -14]} width={380} height={36} radius={8} fill={T.blue} opacity={0} />
        <Rect ref={antiDisk} position={[0, 160]} width={460} height={90} radius={14} fill={T.card} stroke={T.muted} lineWidth={2} opacity={0}>
          <Txt position={[0, 60]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'磁盘'} />
        </Rect>
        <Rect ref={antiLru} position={[0, 30]} width={380} height={36} radius={8} fill={T.yellow} opacity={0} />
        <Txt ref={antiLruLab} position={[0, 30]} fontSize={SIZE.label} fill={T.bg} fontFamily={FONT.sans} text={'最近最少用'} opacity={0} />
      </Node>

      {/* 操作系统换页 vs 记录粒度 */}
      <Node ref={osG} opacity={0}>
        <Rect ref={osBox} position={[-300, -60]} width={380} height={220} radius={16} fill={T.card} stroke={T.muted} lineWidth={2} opacity={0}>
          <Txt position={[0, -80]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'操作系统：整页换出'} />
        </Rect>
        <Rect ref={osPage} position={[-300, 10]} width={300} height={70} radius={10} fill={T.blue} opacity={0} />
        <Rect ref={dbBox} position={[300, -60]} width={380} height={220} radius={16} fill={T.card} stroke={T.green} lineWidth={3} opacity={0}>
          <Txt position={[0, -80]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'数据库：一条记录换出'} />
        </Rect>
        <Rect ref={dbRec} position={[300, 20]} width={120} height={50} radius={10} fill={T.green} opacity={0} />
        <Txt ref={dbWin} position={[300, 140]} fontSize={SIZE.body} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'更高效'} opacity={0} />
      </Node>

      {/* 索引仍须全进内存 */}
      <Node ref={idxG} opacity={0}>
        <Rect ref={idxMem} position={[0, -80]} width={500} height={220} radius={16} fill={T.card} stroke={T.green} lineWidth={3} opacity={0}>
          <Txt position={[0, -80]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'内存'} />
        </Rect>
        <Rect ref={idxCard} position={[0, -80]} width={380} height={110} radius={14} fill={T.yellow} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.bg} fontFamily={FONT.sans} text={'索引（全在内存里）'} />
        </Rect>
      </Node>

      {/* 非易失性内存 */}
      <Node ref={nvmG} opacity={0}>
        <Rect ref={nvmPlate} position={[0, -60]} width={520} height={110} radius={16} fill={T.card} stroke={T.purple} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'非易失性内存'} />
        </Rect>
        <Txt ref={nvmTag} position={[0, 60]} fontSize={SIZE.body} fontWeight={700} fill={T.purple} fontFamily={FONT.sans} text={'新领域，值得关注'} opacity={0} />
      </Node>

      {/* 收束：三条岔路 */}
      <Node ref={closeG} opacity={0}>
        <Rect ref={roadDim} position={[-380, -20]} width={300} height={110} radius={16} fill={T.card} stroke={T.blue} lineWidth={3} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'维度'} />
        </Rect>
        <Rect ref={roadSim} position={[0, -20]} width={300} height={110} radius={16} fill={T.card} stroke={T.green} lineWidth={3} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'相似度'} />
        </Rect>
        <Rect ref={roadMem} position={[380, -20]} width={300} height={110} radius={16} fill={T.card} stroke={T.purple} lineWidth={3} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'内存'} />
        </Rect>
      </Node>
    </>
  );

  say('比内存大的数据集？');
  yield* beat('b38a',
    all(bigG().opacity(1, 0.5), bigMem().opacity(1, 0.5)),
    at('装下比可用内存大的数据', bigData().opacity(1, 2.0)),
  );

  say('不用带回磁盘架构');
  yield* beat('b38b',
    at('不用回到以磁盘为中心的老路', all(oldWay().opacity(1, 0.5), oldWayX().opacity(1, 0.5))),
  );

  say('反缓存：逐出到磁盘');
  yield* beat('b39a',
    all(bigG().opacity(0, 0.5), antiG().opacity(1, 0.5), antiMem().opacity(1, 0.5)),
    at('把最近最少用的数据逐出到磁盘', chain(
      all(antiR1().opacity(1, 0.4), antiR2().opacity(1, 0.4), antiR3().opacity(1, 0.4), antiR4().opacity(1, 0.4), antiLru().opacity(1, 0.5), antiLruLab().opacity(1, 0.5), antiDisk().opacity(1, 0.5)),
      all(antiLru().position([0, 160], 1.8), antiLruLab().position([0, 160], 1.8)),
    )),
  );

  say('访问时再加载回来');
  yield* beat('b39b',
    at('再把它加载回内存', all(antiLru().position([0, 30], 0.9), antiLruLab().position([0, 30], 0.9))),
  );

  say('像操作系统的换页');
  yield* beat('b40a',
    all(antiG().opacity(0, 0.5), osG().opacity(1, 0.5)),
    at('操作系统用虚拟内存和交换文件', all(osBox().opacity(1, 0.5), dbBox().opacity(1, 0.5), osPage().opacity(1, 0.5), dbRec().opacity(1, 0.5))),
    at('很像', chain(
      all(osPage().scale(1.05, 0.3), dbRec().scale(1.15, 0.3)),
      all(osPage().scale(1.0, 0.3), dbRec().scale(1.0, 0.3)),
    )),
  );

  say('记录粒度更高效');
  yield* beat('b40b',
    at('数据库比操作系统更高效', chain(
      all(osPage().position([-300, 10], 0.1), dbRec().position([300, 20], 0.1)),
      all(osPage().position([-560, 10], 0.9), dbRec().position([300, 90], 0.9), dbWin().opacity(1, 0.5)),
    )),
  );

  say('记录粒度，比整页更细');
  yield* beat('b40c',
    at('以单个记录为粒度工作', dbBox().stroke(T.yellow, 0.4)),
    at('而不是整个内存页', chain(dbRec().scale(1.2, 0.3), dbRec().scale(1.0, 0.3))),
  );

  say('索引仍须全进内存');
  yield* beat('b41',
    all(osG().opacity(0, 0.5), idxG().opacity(1, 0.5), idxMem().opacity(1, 0.5)),
    at('索引得完全放进内存', idxCard().opacity(1, 0.5)),
    at('和前面那个 Bitcask 例子一样', chain(idxCard().scale(1.04, 0.3), idxCard().scale(1.0, 0.3))),
  );

  say('非易失性内存，值得关注');
  yield* beat('b42',
    all(idxG().opacity(0, 0.5), nvmG().opacity(1, 0.5)),
    at('非易失性内存如果更广泛地采用', all(nvmPlate().opacity(1, 0.5), nvmTag().opacity(1, 0.5))),
    at('存储引擎的设计可能还要再变', nvmPlate().stroke(T.yellow, 0.5)),
    at('值得关注', chain(nvmTag().scale(1.1, 0.4), nvmTag().scale(1.0, 0.4))),
  );

  say('维度、相似度、内存');
  yield* beat('b43',
    all(nvmG().opacity(0, 0.5), closeG().opacity(1, 0.5), roadDim().opacity(1, 0.5)),
    at('维度', roadDim().stroke(T.yellow, 0.4)),
    at('相似度', roadSim().opacity(1, 0.5)),
    at('内存三条岔路', roadMem().opacity(1, 0.5)),
    at('索引的形状跟着问题走', chain(
      all(roadDim().scale(1.04, 0.3), roadSim().scale(1.04, 0.3), roadMem().scale(1.04, 0.3)),
      all(roadDim().scale(1.0, 0.3), roadSim().scale(1.0, 0.3), roadMem().scale(1.0, 0.3)),
    )),
  );
});
