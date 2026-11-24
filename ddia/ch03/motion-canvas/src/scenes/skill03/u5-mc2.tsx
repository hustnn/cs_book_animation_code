// U5 场景 2（MC）：b9–b19 —— 写放大计数器（N3）、固态盘磨损、带宽、顺序写、碎片、固态盘固件。
// 分镜：skill-ch03/beats-u5.md；原文：DDIA §3.5（书页 p84，PDF p106）。
// N3 标注“示意：倍数随配置与负载而变”出现在画面（紫色标注）与旁白里；计数器数字是示意倍数，不是原书数字。
// 时长全部来自 timeline/u5.json（beat() 驱动），不手写 waitFor。
import {Circle, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, chain, createRef} from '@motion-canvas/core';
import {at, makeBeats} from '../../lib/beats';
import {FONT, SAFE, SIZE, T} from '../../lib/theme';
import timeline from '../../timeline/u5.json';

export default makeScene2D(function* (view) {
  view.fill(T.bg);
  const beat = makeBeats(timeline);

  const header = createRef<Txt>();
  const anchor = createRef<Txt>();
  const say = (text: string) => anchor().text(text);

  // ---- 第 1 页：写放大计数器（N3）+ 固态盘磨损 + 带宽 ----
  const p1 = createRef<Node>();
  const funnel = createRef<Txt>();
  const funnelLab = createRef<Txt>();
  const segBoxes = [0, 1, 2].map(() => createRef<Rect>());
  const dataBall = createRef<Circle>();
  const onceBox = createRef<Rect>();
  const countTxt = createRef<Txt>();
  const countN = createRef<Txt>();
  const waLab = createRef<Txt>();
  const waNote = createRef<Txt>();
  const ssdBox = createRef<Rect>();
  const ssdCells = [0, 1, 2, 3, 4, 5].map(() => createRef<Rect>());
  const bwBar = createRef<Rect>();
  const bwFill = createRef<Rect>();
  const bwLab = createRef<Txt>();
  const perSec = createRef<Rect>();
  const perSecLab = createRef<Txt>();

  // ---- 第 2 页：写吞吐 + 顺序写 vs 覆盖写 + 机械硬盘 ----
  const p2 = createRef<Node>();
  const lsmBar = createRef<Rect>();
  const btreeBar = createRef<Rect>();
  const cfgNote = createRef<Txt>();
  const seqArrow = createRef<Line>();
  const seqFile = createRef<Rect>();
  const rndArrows = [0, 1].map(() => createRef<Line>());
  const treePages = [0, 1, 2].map(() => createRef<Rect>());
  const disk = createRef<Circle>();
  const headDot = createRef<Circle>();
  const seqSpeed = createRef<Rect>();
  const rndSpeed = createRef<Rect>();

  // ---- 第 3 页：碎片 + 定期重写 + 固态盘固件 ----
  const p3 = createRef<Node>();
  const lsmFile = createRef<Rect>();
  const btreePage = createRef<Rect>();
  const holes = [0, 1, 2].map(() => createRef<Rect>());
  const holeLab = createRef<Txt>();
  const rewriteLab = createRef<Txt>();
  const fwBox = createRef<Rect>();
  const fwIn = createRef<Line>();
  const fwOut = createRef<Line>();
  const compactFile = createRef<Rect>();
  const reqDots = [0, 1, 2, 3].map(() => createRef<Circle>());

  view.add(
    <>
      <Txt
        ref={header}
        position={[-SAFE.halfW, -SAFE.halfH]}
        offset={[-1, -1]}
        fontSize={SIZE.label}
        fill={T.muted}
        fontFamily={FONT.sans}
        text={'两大学派对决：写快还是读快'}
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
        <Txt ref={funnel} position={[0, -200]} fontSize={64} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'▼'} opacity={0} />
        <Txt ref={funnelLab} position={[0, -130]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'压缩合并'} opacity={0} />
        {[0, 1, 2].map(i => (
          <Rect
            key={`seg-${i}`}
            ref={segBoxes[i]}
            position={[-360 + i * 360, -60]}
            width={320}
            height={90}
            radius={12}
            fill={T.card}
            stroke={T.blue}
            lineWidth={2}
            opacity={0}
          >
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={`段 ${i + 1}`} />
          </Rect>
        ))}
        <Circle ref={dataBall} position={[-360, 10]} width={30} height={30} fill={T.yellow} opacity={0} />
        <Rect ref={onceBox} position={[-380, 110]} width={340} height={80} radius={12} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'数据库写 1 次'} />
        </Rect>
        <Txt ref={countTxt} position={[280, 110]} fontSize={SIZE.body} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'磁盘写 ×1'} opacity={0} />
        <Txt ref={countN} position={[280, 110]} fontSize={SIZE.body} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'磁盘写 ×N'} opacity={0} />
        <Txt ref={waLab} position={[0, 190]} fontSize={SIZE.body} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'写放大'} opacity={0} />
        <Txt ref={waNote} position={[0, 235]} fontSize={SIZE.label} fill={T.purple} fontFamily={FONT.sans} text={'示意：倍数随配置与负载而变'} opacity={0} />
        <Rect ref={ssdBox} position={[0, -60]} width={560} height={220} radius={14} fill={T.card} stroke={T.line} lineWidth={2} opacity={0}>
          <Txt position={[0, -82]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'固态硬盘'} />
        </Rect>
        {[0, 1, 2, 3, 4, 5].map(i => (
          <Rect
            key={`cell-${i}`}
            ref={ssdCells[i]}
            position={[-180 + (i % 3) * 180, -30 + Math.floor(i / 3) * 90]}
            width={150}
            height={70}
            radius={8}
            fill={T.card}
            stroke={T.green}
            lineWidth={2}
            opacity={0}
          />
        ))}
        <Rect ref={bwBar} position={[0, -60]} width={900} height={60} radius={30} fill={T.card} stroke={T.line} lineWidth={2} opacity={0} />
        <Rect ref={bwFill} position={[-450, -60]} offset={[-1, 0]} width={200} height={60} radius={30} fill={T.red} opacity={0} />
        <Txt ref={bwLab} position={[0, 10]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'磁盘带宽'} opacity={0} />
        <Rect ref={perSec} position={[0, 110]} width={420} height={64} radius={12} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt ref={perSecLab} position={[0, 0]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'每秒能处理的写'} opacity={0} />
        </Rect>
      </Node>

      {/* 第 2 页 */}
      <Node ref={p2} opacity={0}>
        <Rect ref={lsmBar} position={[-300, -160]} offset={[-1, 0]} width={60} height={64} radius={10} fill={T.green} opacity={0}>
          <Txt position={[0, -52]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'日志结构树'} />
        </Rect>
        <Rect ref={btreeBar} position={[-300, -60]} offset={[-1, 0]} width={60} height={64} radius={10} fill={T.blue} opacity={0}>
          <Txt position={[0, -52]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'B 树'} />
        </Rect>
        <Txt ref={cfgNote} position={[0, 30]} fontSize={SIZE.label} fill={T.purple} fontFamily={FONT.sans} text={'有时更低，看配置和负载'} opacity={0} />
        <Line ref={seqArrow} points={[[-480, -145], [480, -145]]} stroke={T.green} lineWidth={4} endArrow opacity={0} />
        <Rect ref={seqFile} position={[0, -60]} width={900} height={70} radius={12} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'紧凑的文件，一路顺序写进去'} />
        </Rect>
        {[0, 1].map(i => (
          <Line
            key={`rnd-${i}`}
            ref={rndArrows[i]}
            points={[[-380 + i * 760, 40], [-80 + i * 160, 140]]}
            stroke={T.red}
            lineWidth={3}
            endArrow
            opacity={0}
          />
        ))}
        {[0, 1, 2].map(i => (
          <Rect
            key={`tp-${i}`}
            ref={treePages[i]}
            position={[-360 + i * 360, 140]}
            width={300}
            height={80}
            radius={12}
            fill={T.card}
            stroke={T.blue}
            lineWidth={2}
            opacity={0}
          >
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={`树页 ${i + 1}`} />
          </Rect>
        ))}
        <Circle ref={disk} position={[0, -60]} width={300} height={300} fill={T.card} stroke={T.line} lineWidth={2} opacity={0} />
        <Circle ref={headDot} position={[-120, -60]} width={26} height={26} fill={T.yellow} opacity={0} />
        <Rect ref={seqSpeed} position={[-300, 140]} offset={[-1, 0]} width={60} height={50} radius={10} fill={T.green} opacity={0}>
          <Txt position={[0, -42]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'顺序写'} />
        </Rect>
        <Rect ref={rndSpeed} position={[-300, 235]} offset={[-1, 0]} width={60} height={50} radius={10} fill={T.red} opacity={0}>
          <Txt position={[0, -42]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'随机写'} />
        </Rect>
      </Node>

      {/* 第 3 页 */}
      <Node ref={p3} opacity={0}>
        <Rect ref={lsmFile} position={[-300, -120]} width={440} height={90} radius={12} fill={T.green} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'日志结构：压得紧实'} />
        </Rect>
        <Rect ref={btreePage} position={[300, -120]} width={440} height={90} radius={12} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt position={[0, -70]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'B 树页'} />
        </Rect>
        {[0, 1, 2].map(i => (
          <Rect
            key={`hole-${i}`}
            ref={holes[i]}
            position={[170 + i * 130, -120]}
            width={90}
            height={60}
            radius={8}
            fill={T.bg}
            stroke={T.red}
            lineWidth={2}
            opacity={0}
          />
        ))}
        <Txt ref={holeLab} position={[300, -40]} fontSize={SIZE.label} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'碎片：用不上的空洞'} opacity={0} />
        <Txt ref={rewriteLab} position={[0, 60]} fontSize={SIZE.body} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'定期重写去碎片，分层压缩更省'} opacity={0} />
        <Rect ref={fwBox} position={[0, -60]} width={700} height={200} radius={14} fill={T.card} stroke={T.purple} lineWidth={2} opacity={0}>
          <Txt position={[0, -72]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'固态硬盘固件'} />
        </Rect>
        <Line ref={fwIn} points={[[-480, -100], [-360, -60]]} stroke={T.red} lineWidth={3} endArrow opacity={0} />
        <Line ref={fwOut} points={[[360, -60], [480, -100]]} stroke={T.green} lineWidth={3} endArrow opacity={0} />
        <Rect ref={compactFile} position={[0, 130]} width={700} height={70} radius={12} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'数据更紧凑，同样带宽里请求更多'} />
        </Rect>
        {[0, 1, 2, 3].map(i => (
          <Circle
            key={`req-${i}`}
            ref={reqDots[i]}
            position={[-260 + i * 170, 200]}
            width={24}
            height={24}
            fill={T.green}
            opacity={0}
          />
        ))}
      </Node>
    </>
  );

  say('反复压缩，多次重写');
  yield* beat('b9',
    all(p1().opacity(1, 0.5), funnel().opacity(1, 0.5), funnelLab().opacity(1, 0.5), segBoxes[0]().opacity(1, 0.5), dataBall().opacity(1, 0.5)),
    at('反复压缩', chain(funnel().position([0, -190], 0.8), segBoxes[1]().opacity(1, 0.5))),
    at('重写好多遍', all(dataBall().position([360, 10], 1.2), segBoxes[2]().opacity(1, 0.5))),
  );

  say('1 次写 → N 次磁盘写');
  yield* beat('b10',
    all(funnel().opacity(0, 0.4), funnelLab().opacity(0, 0.4), segBoxes[0]().opacity(0, 0.4), segBoxes[1]().opacity(0, 0.4), segBoxes[2]().opacity(0, 0.4), dataBall().opacity(0, 0.4),
      onceBox().opacity(1, 0.5), countTxt().opacity(1, 0.5)),
    at('多次写', chain(countTxt().opacity(0, 0.4), countN().opacity(1, 0.5), countN().scale(1.15, 0.6), countN().scale(1, 0.6))),
    at('写放大', chain(waLab().opacity(1, 0.5), waNote().opacity(1, 0.4))),
  );

  say('固态盘，写多了会磨损');
  yield* beat('b11',
    all(onceBox().opacity(0, 0.4), countTxt().opacity(0, 0.4), countN().opacity(0, 0.4), waLab().opacity(0, 0.4), waNote().opacity(0, 0.4),
      ssdBox().opacity(1, 0.5)),
    at('只能被覆盖有限次数', all(ssdCells[0]().opacity(1, 0.4), ssdCells[1]().opacity(1, 0.4), ssdCells[2]().opacity(1, 0.4))),
    at('磨损', all(ssdCells[3]().opacity(1, 0.4), ssdCells[4]().opacity(1, 0.4), ssdCells[5]().opacity(1, 0.4),
      ssdCells[0]().fill(T.red, 0.5), ssdCells[1]().fill(T.red, 0.5))),
  );

  say('瓶颈是写磁盘的速度');
  yield* beat('b12a',
    all(ssdBox().opacity(0, 0.4), ...ssdCells.map(c => c().opacity(0, 0.4)),
      bwBar().opacity(1, 0.5), bwFill().opacity(1, 0.5), bwLab().opacity(1, 0.4)),
    at('瓶颈', chain(bwFill().width(700, 1.5))),
  );

  say('带宽被放大吃掉');
  yield* beat('b12b',
    all(perSec().opacity(1, 0.5), perSecLab().opacity(1, 0.4)),
    at('越少', perSec().width(260, 0.8)),
  );

  say('有时写放大更低');
  yield* beat('b13',
    all(p1().opacity(0, 0.5), p2().opacity(1, 0.5), lsmBar().opacity(1, 0.5), btreeBar().opacity(1, 0.5)),
    at('更高的写吞吐', chain(lsmBar().width(760, 1.5), btreeBar().width(420, 1.5))),
    at('看配置和负载', cfgNote().opacity(1, 0.5)),
  );

  say('顺序写紧凑文件');
  yield* beat('b14',
    all(lsmBar().opacity(0, 0.4), btreeBar().opacity(0, 0.4), cfgNote().opacity(0, 0.4),
      seqArrow().opacity(1, 0.5), seqFile().opacity(1, 0.5)),
    at('不用去覆盖', chain(...treePages.map(t => t().opacity(1, 0.4)), rndArrows[0]().opacity(0.6, 0.4), rndArrows[1]().opacity(0.6, 0.4))),
  );

  say('顺序写比随机写快得多');
  yield* beat('b15',
    all(seqArrow().opacity(0, 0.4), seqFile().opacity(0, 0.4), rndArrows[0]().opacity(0, 0.4), rndArrows[1]().opacity(0, 0.4), ...treePages.map(t => t().opacity(0, 0.4)),
      disk().opacity(1, 0.5), headDot().opacity(1, 0.5), seqSpeed().opacity(1, 0.5), rndSpeed().opacity(1, 0.5)),
    at('顺序写', all(headDot().position([120, -60], 1.2), seqSpeed().width(760, 1.2))),
    at('随机写', all(headDot().position([-120, 60], 1.0), rndSpeed().width(300, 1.0))),
  );

  say('B 树页里留空洞');
  yield* beat('b16',
    all(p2().opacity(0, 0.5), p3().opacity(1, 0.5), lsmFile().opacity(1, 0.5), btreePage().opacity(1, 0.5),
      lsmFile().scale(1.02, 8.0), btreePage().scale(1.02, 8.0)),
    at('剩用不上的空洞', chain(holes[0]().opacity(1, 0.4), holes[1]().opacity(1, 0.4), holes[2]().opacity(1, 0.4), holeLab().opacity(1, 0.5))),
  );

  say('定期重写去碎片');
  yield* beat('b17',
    all(holes[0]().opacity(0, 0.5), holes[1]().opacity(0, 0.5), holes[2]().opacity(0, 0.5), holeLab().opacity(0, 0.4),
      rewriteLab().opacity(1, 0.5)),
    at('定期重写', chain(btreePage().width(300, 1.5))),
    at('分层压缩', chain(rewriteLab().scale(1.05, 1.0), rewriteLab().scale(1, 1.0))),
  );

  say('固态盘内部也是日志结构');
  yield* beat('b18',
    all(lsmFile().opacity(0, 0.4), btreePage().opacity(0, 0.4), rewriteLab().opacity(0, 0.4),
      fwBox().opacity(1, 0.5), fwIn().opacity(1, 0.5), fwBox().scale(1.02, 9.0)),
    at('转成芯片上的顺序写', chain(fwOut().opacity(1, 0.5), fwBox().stroke(T.green, 0.8))),
  );

  say('更紧凑，带宽里请求更多');
  yield* beat('b19',
    all(compactFile().opacity(1, 0.5), compactFile().scale(1.02, 9.0)),
    at('同样带宽里能处理更多', chain(reqDots[0]().opacity(1, 0.4), reqDots[1]().opacity(1, 0.4), reqDots[2]().opacity(1, 0.4), reqDots[3]().opacity(1, 0.4))),
  );
});
