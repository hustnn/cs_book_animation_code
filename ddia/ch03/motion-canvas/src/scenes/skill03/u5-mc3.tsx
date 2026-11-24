// U5 场景 3（MC）：b20–b27 —— 压缩干扰读写、尾延迟百分位曲线、压缩跟不上写入。
// 分镜：skill-ch03/beats-u5.md；原文：DDIA §3.5（书页 p84–85，PDF p106–107）。
// 尾延迟曲线用 Motion Canvas 画（分镜决定：简单百分位曲线，MC 足够，不切 Manim）。
// 曲线是示意分布：画面标紫色“示意：分布形状”，不引用具体数字。
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

  // ---- 第 1 页：压缩干扰 + 尾延迟曲线 ----
  const p1 = createRef<Node>();
  const funnel = createRef<Txt>();
  const rwArrow1 = createRef<Line>();
  const rwArrow2 = createRef<Line>();
  const waitLab = createRef<Txt>();
  const resBar = createRef<Rect>();
  const resFill = createRef<Rect>();
  const axisX = createRef<Line>();
  const axisY = createRef<Line>();
  const curve = createRef<Line>();
  const p50Dot = createRef<Circle>();
  const p50Lab = createRef<Txt>();
  const p99Dot = createRef<Circle>();
  const p99Lab = createRef<Txt>();
  const curveNote = createRef<Txt>();

  // ---- 第 2 页：压缩跟不上 ----
  const p2 = createRef<Node>();
  const bwBar = createRef<Rect>();
  const bwInit = createRef<Rect>();
  const bwComp = createRef<Rect>();
  const bwInitLab = createRef<Txt>();
  const bwCompLab = createRef<Txt>();
  const dbBox = createRef<Rect>();
  const pileSegs = [0, 1, 2, 3, 4].map(() => createRef<Rect>());
  const diskBar = createRef<Rect>();
  const diskFill = createRef<Rect>();
  const lookDot = createRef<Circle>();
  const monitor = createRef<Rect>();
  const monitorLight = createRef<Circle>();
  const monitorLab = createRef<Txt>();
  const writeArrow = createRef<Line>();

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
        <Txt ref={funnel} position={[-320, -120]} fontSize={64} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'▼'} opacity={0} />
        <Line ref={rwArrow1} points={[[-480, 20], [-80, 20]]} stroke={T.blue} lineWidth={4} endArrow opacity={0} />
        <Line ref={rwArrow2} points={[[80, 20], [480, 20]]} stroke={T.blue} lineWidth={4} endArrow opacity={0} />
        <Txt ref={waitLab} position={[-320, 90]} fontSize={SIZE.body} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'等压缩做完'} opacity={0} />
        <Rect ref={resBar} position={[0, -180]} width={900} height={46} radius={23} fill={T.card} stroke={T.line} lineWidth={2} opacity={0} />
        <Rect ref={resFill} position={[-450, -180]} offset={[-1, 0]} width={60} height={46} radius={23} fill={T.red} opacity={0} />
        <Line ref={axisX} points={[[-480, 160], [480, 160]]} stroke={T.line} lineWidth={3} opacity={0} />
        <Line ref={axisY} points={[[-480, 160], [-480, -220]]} stroke={T.line} lineWidth={3} opacity={0} />
        <Line
          ref={curve}
          points={[[-480, 140], [-300, 130], [-120, 110], [60, 70], [200, 0], [300, -80], [380, -180]]}
          stroke={T.yellow}
          lineWidth={4}
          opacity={0}
        />
        <Circle ref={p50Dot} position={[-120, 110]} width={26} height={26} fill={T.green} opacity={0} />
        <Txt ref={p50Lab} position={[-120, 180]} fontSize={SIZE.label} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'平均很快'} opacity={0} />
        <Circle ref={p99Dot} position={[380, -180]} width={26} height={26} fill={T.red} opacity={0} />
        <Txt ref={p99Lab} position={[380, -220]} fontSize={SIZE.label} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'尾巴：很慢'} opacity={0} />
        <Txt ref={curveNote} position={[280, 235]} fontSize={SIZE.label} fill={T.purple} fontFamily={FONT.sans} text={'示意：分布形状'} opacity={0} />
      </Node>

      {/* 第 2 页 */}
      <Node ref={p2} opacity={0}>
        <Rect ref={bwBar} position={[0, -180]} width={1000} height={64} radius={14} fill={T.card} stroke={T.line} lineWidth={2} opacity={0} />
        <Rect ref={bwInit} position={[-500, -180]} offset={[-1, 0]} width={700} height={64} radius={14} fill={T.blue} opacity={0} />
        <Rect ref={bwComp} position={[200, -180]} offset={[-1, 0]} width={300} height={64} radius={14} fill={T.yellow} opacity={0} />
        <Txt ref={bwInitLab} position={[-150, -180]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'最初的写'} opacity={0} />
        <Txt ref={bwCompLab} position={[350, -180]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'后台压缩'} opacity={0} />
        <Rect ref={dbBox} position={[0, -60]} width={500} height={80} radius={12} fill={T.card} stroke={T.line} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'数据库越来越大'} />
        </Rect>
        {[0, 1, 2, 3, 4].map(i => (
          <Rect
            key={`pile-${i}`}
            ref={pileSegs[i]}
            position={[-400 + i * 200, 60]}
            width={180}
            height={70}
            radius={10}
            fill={T.card}
            stroke={T.blue}
            lineWidth={2}
            opacity={0}
          >
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={`段 ${i + 1}`} />
          </Rect>
        ))}
        <Rect ref={diskBar} position={[0, 150]} width={900} height={40} radius={20} fill={T.card} stroke={T.line} lineWidth={2} opacity={0} />
        <Rect ref={diskFill} position={[-450, 150]} offset={[-1, 0]} width={60} height={40} radius={20} fill={T.red} opacity={0} />
        <Circle ref={lookDot} position={[-400, 0]} width={26} height={26} fill={T.yellow} opacity={0} />
        <Line ref={writeArrow} points={[[-480, -60], [480, -60]]} stroke={T.green} lineWidth={4} endArrow opacity={0} />
        <Rect ref={monitor} position={[0, 150]} width={520} height={90} radius={14} fill={T.card} stroke={T.red} lineWidth={2} opacity={0}>
          <Txt position={[40, 0]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'要显式监控'} />
        </Rect>
        <Circle ref={monitorLight} position={[-180, 150]} width={36} height={36} fill={T.red} opacity={0} />
        <Txt ref={monitorLab} position={[0, 220]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'写入不停，压缩跟不上时亮红灯'} opacity={0} />
      </Node>
    </>
  );

  say('压缩会干扰读写');
  yield* beat('b20',
    all(p1().opacity(1, 0.5), funnel().opacity(1, 0.5), rwArrow1().opacity(1, 0.5), rwArrow2().opacity(1, 0.5)),
    at('干扰', chain(waitLab().opacity(1, 0.5), rwArrow1().stroke(T.red, 0.5), rwArrow2().stroke(T.red, 0.5))),
  );

  say('一点一点做压缩');
  yield* beat('b21a',
    all(waitLab().opacity(0, 0.4), rwArrow1().stroke(T.blue, 0.5), rwArrow2().stroke(T.blue, 0.5)),
    at('一点一点', chain(funnel().position([-320, -105], 1.0), funnel().position([-320, -120], 1.0))),
  );

  say('磁盘有限');
  yield* beat('b21b',
    all(resBar().opacity(1, 0.5), resFill().opacity(1, 0.5)),
    at('有限', chain(resFill().width(880, 1.2))),
  );

  say('等一次昂贵的压缩');
  yield* beat('b21c',
    all(waitLab().opacity(1, 0.5), rwArrow1().stroke(T.red, 0.5)),
    at('等', chain(waitLab().scale(1.1, 0.8), waitLab().scale(1, 0.8))),
  );

  say('平均很快，尾巴很慢');
  yield* beat('b22',
    all(funnel().opacity(0, 0.4), rwArrow1().opacity(0, 0.4), rwArrow2().opacity(0, 0.4), waitLab().opacity(0, 0.4), resBar().opacity(0, 0.4), resFill().opacity(0, 0.4),
      axisX().opacity(1, 0.5), axisY().opacity(1, 0.5), curve().opacity(1, 0.5)),
    at('平均', chain(p50Dot().opacity(1, 0.5), p50Lab().opacity(1, 0.4))),
    at('高百分位', chain(p99Dot().opacity(1, 0.5), p99Lab().opacity(1, 0.4), curveNote().opacity(1, 0.4))),
    at('更可预测', chain(p99Dot().scale(1.25, 0.7), p99Dot().scale(1, 0.7))),
  );

  say('写得很猛的时候');
  yield* beat('b23a',
    all(p1().opacity(0, 0.5), p2().opacity(1, 0.5), bwBar().opacity(1, 0.5), writeArrow().opacity(1, 0.5)),
    at('写得很猛', chain(writeArrow().stroke(T.yellow, 0.6), writeArrow().stroke(T.green, 0.6))),
  );

  say('带宽要在写和压缩之间分');
  yield* beat('b23b',
    all(bwInit().opacity(1, 0.5), bwComp().opacity(1, 0.5), bwInitLab().opacity(1, 0.4), bwCompLab().opacity(1, 0.4), writeArrow().opacity(0, 0.4)),
    at('之间分', all(bwInit().width(500, 1.0), bwComp().width(500, 1.0), bwComp().position([0, -180], 1.0))),
  );

  say('库越大，压缩要得越多');
  yield* beat('b24',
    all(dbBox().opacity(1, 0.5)),
    at('越大', all(dbBox().scale(1.08, 1.2), bwComp().width(700, 1.5), bwComp().position([-200, -180], 1.5), bwInit().width(300, 1.5), bwCompLab().position([150, -180], 1.5), bwInitLab().position([-350, -180], 1.5))),
  );

  say('压缩跟不上写入');
  yield* beat('b25',
    all(pileSegs[0]().opacity(1, 0.5), pileSegs[1]().opacity(1, 0.5)),
    at('跟不上', chain(pileSegs[2]().opacity(1, 0.5), pileSegs[3]().opacity(1, 0.5), pileSegs[4]().opacity(1, 0.5))),
  );

  say('段越堆越多，直到写满');
  yield* beat('b26a',
    all(diskBar().opacity(1, 0.5), diskFill().opacity(1, 0.5)),
    at('直到磁盘写满', chain(diskFill().width(880, 2.0))),
  );

  say('读变慢，查更多段');
  yield* beat('b26b',
    all(lookDot().opacity(1, 0.4)),
    at('更多段', chain(lookDot().position([0, 0], 0.8), lookDot().position([400, 0], 0.8))),
  );

  say('不降速，要显式监控');
  yield* beat('b27',
    all(diskBar().opacity(0, 0.4), diskFill().opacity(0, 0.4), ...pileSegs.map(s => s().opacity(0, 0.4)), lookDot().opacity(0, 0.4), dbBox().opacity(0, 0.4),
      monitor().opacity(1, 0.5), monitorLight().opacity(1, 0.5), monitorLab().opacity(1, 0.4)),
    at('不会把写入速度降下来', chain(writeArrow().opacity(1, 0.5), monitorLight().scale(1.3, 0.8), monitorLight().scale(1, 0.8))),
  );
});
