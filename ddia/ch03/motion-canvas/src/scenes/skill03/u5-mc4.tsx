// U5 场景 4（MC）：b28–b36 —— N2 同一键 251 走三条查找路径、一键一处、锁附树上、收尾。
// 分镜：skill-ch03/beats-u5.md；原文：DDIA §3.5（书页 p85，PDF p107）+ §3.2–§3.4 回扣的查找路径。
// N2 标注“为便于比较，三条路径用同一键演示”出现在画面（紫色横幅）与旁白里；
// 三条路径的数字按各自原图：哈希索引（内存表、一次定位）、稀疏索引（跳块再扫）、B 树（三级下钻，200 ≤ 键 < 300）。
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

  // ---- 第 1 页：三条查找路径（N2）----
  const p1 = createRef<Node>();
  const keyChip = createRef<Rect>();
  const noteBanner = createRef<Txt>();
  const cardH = createRef<Rect>();
  const cardS = createRef<Rect>();
  const cardB = createRef<Rect>();
  const memRow = createRef<Txt>();
  const jumpArrow = createRef<Line>();
  const jumpDot = createRef<Circle>();
  const blockHead = createRef<Rect>();
  const scanCells = [0, 1, 2, 3].map(() => createRef<Rect>());
  const scanDot = createRef<Circle>();
  const lvlRoot = createRef<Rect>();
  const lvlMid = createRef<Rect>();
  const lvlLeaf = createRef<Rect>();
  const drillDot = createRef<Circle>();

  // ---- 第 2 页：一键一处 vs 多处副本 + 锁 ----
  const p2 = createRef<Node>();
  const btreeCard = createRef<Rect>();
  const oneKey = createRef<Txt>();
  const segCards = [0, 1, 2].map(() => createRef<Rect>());
  const lockBox = createRef<Rect>();

  // ---- 第 3 页：收尾 ----
  const p3 = createRef<Node>();
  const bigTree = createRef<Rect>();
  const sprout = createRef<Rect>();
  const noRule = createRef<Txt>();
  const sumCards = [0, 1, 2].map(() => createRef<Rect>());
  const checks = [0, 1, 2].map(() => createRef<Txt>());

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
        <Rect ref={keyChip} position={[0, -245]} width={220} height={64} radius={32} fill={T.yellow} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.bg} fontFamily={FONT.mono} text={'键 251'} />
        </Rect>
        <Txt ref={noteBanner} position={[0, -195]} fontSize={SIZE.label} fill={T.purple} fontFamily={FONT.sans} text={'为便于比较，三条路径用同一键演示'} opacity={0} />
        <Rect ref={cardH} position={[-400, -20]} width={340} height={300} radius={14} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt position={[0, -120]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'哈希索引'} />
          <Txt ref={memRow} position={[0, -40]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.mono} text={'内存表：251 → 位置'} opacity={0} />
        </Rect>
        <Rect ref={cardS} position={[0, -20]} width={340} height={300} radius={14} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt position={[0, -120]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'稀疏索引'} />
          <Rect ref={blockHead} position={[0, -40]} width={240} height={54} radius={8} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'块头'} />
          </Rect>
        </Rect>
        <Rect ref={cardB} position={[400, -20]} width={340} height={300} radius={14} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt position={[0, -120]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'B 树'} />
        </Rect>
        <Line ref={jumpArrow} points={[[-400, 40], [-400, 110]]} stroke={T.yellow} lineWidth={3} endArrow opacity={0} />
        <Circle ref={jumpDot} position={[-400, 40]} width={26} height={26} fill={T.yellow} opacity={0} />
        {[0, 1, 2, 3].map(i => (
          <Rect
            key={`scan-${i}`}
            ref={scanCells[i]}
            position={[-120 + i * 80, 60]}
            width={70}
            height={56}
            radius={8}
            fill={T.card}
            stroke={T.line}
            lineWidth={2}
            opacity={0}
          />
        ))}
        <Circle ref={scanDot} position={[-120, 60]} width={24} height={24} fill={T.yellow} opacity={0} />
        <Rect ref={lvlRoot} position={[400, -80]} width={240} height={56} radius={10} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'根页：200–300'} />
        </Rect>
        <Rect ref={lvlMid} position={[400, 0]} width={240} height={56} radius={10} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'中间页：再细分'} />
        </Rect>
        <Rect ref={lvlLeaf} position={[400, 80]} width={240} height={56} radius={10} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'叶页：251'} />
        </Rect>
        <Circle ref={drillDot} position={[540, -80]} width={24} height={24} fill={T.yellow} opacity={0} />
      </Node>

      {/* 第 2 页 */}
      <Node ref={p2} opacity={0}>
        <Rect ref={btreeCard} position={[-320, -60]} width={440} height={280} radius={14} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt position={[0, -110]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'B 树'} />
          <Txt ref={oneKey} position={[0, -20]} fontSize={SIZE.body} fontWeight={700} fill={T.green} fontFamily={FONT.mono} text={'251 只出现一次'} opacity={0} />
        </Rect>
        {[0, 1, 2].map(i => (
          <Rect
            key={`segc-${i}`}
            ref={segCards[i]}
            position={[320, -160 + i * 110]}
            width={440}
            height={90}
            radius={12}
            fill={T.card}
            stroke={T.blue}
            lineWidth={2}
            opacity={0}
          >
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={['段 1：251（旧值）', '段 2：251（新值）', '段 3：251（最新）'][i]} />
          </Rect>
        ))}
        <Rect ref={lockBox} position={[-320, 130]} width={280} height={64} radius={32} fill={T.yellow} opacity={0}>
          <Txt fontSize={SIZE.label} fontWeight={700} fill={T.bg} fontFamily={FONT.sans} text={'锁，附在树上'} />
        </Rect>
      </Node>

      {/* 第 3 页 */}
      <Node ref={p3} opacity={0}>
        <Rect ref={bigTree} position={[-260, -80]} width={420} height={260} radius={14} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt position={[0, -100]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'B 树'} />
          <Txt position={[0, -40]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'根深蒂固，一直很好'} />
        </Rect>
        <Rect ref={sprout} position={[300, -40]} width={300} height={180} radius={14} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt position={[0, -55]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'日志结构'} />
          <Txt position={[0, 0]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'越来越流行'} />
        </Rect>
        <Txt ref={noRule} position={[0, 130]} fontSize={SIZE.body} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'没有快速简单的规则'} opacity={0} />
        {[0, 1, 2].map(i => (
          <Rect
            key={`sum-${i}`}
            ref={sumCards[i]}
            position={[-380 + i * 380, -40]}
            width={340}
            height={150}
            radius={14}
            fill={T.card}
            stroke={T.green}
            lineWidth={2}
            opacity={0}
          >
            <Txt position={[0, -35]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={['写放大', '读路径', '尾延迟'][i]} />
            <Txt ref={checks[i]} position={[0, 35]} fontSize={SIZE.body} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'✓ 算清了'} opacity={0} />
          </Rect>
        ))}
      </Node>
    </>
  );

  say('同一键 251，走三条路');
  yield* beat('b28',
    all(p1().opacity(1, 0.5), keyChip().opacity(1, 0.5), noteBanner().opacity(1, 0.4),
      cardH().opacity(1, 0.5), cardS().opacity(1, 0.5), cardB().opacity(1, 0.5),
      cardH().scale(1.02, 9.0), cardS().scale(1.02, 9.0), cardB().scale(1.02, 9.0)),
    at('各走一遍', chain(keyChip().scale(1.1, 0.6), keyChip().scale(1, 0.6))),
  );

  say('查内存表，一次定位');
  yield* beat('b29',
    all(cardH().stroke(T.green, 0.5), memRow().opacity(1, 0.5), jumpDot().opacity(1, 0.4)),
    at('一次定位', chain(jumpDot().position([-400, 110], 0.9), jumpArrow().opacity(1, 0.4))),
  );

  say('跳块，再扫');
  yield* beat('b30',
    all(cardH().stroke(T.blue, 0.5), cardS().stroke(T.green, 0.5), blockHead().opacity(1, 0.5), scanDot().opacity(1, 0.4)),
    at('跳到离它最近的块开头', all(...scanCells.map(c => c().opacity(1, 0.3)))),
    at('往后扫到它', all(scanDot().position([120, 60], 1.5), scanCells[3]().stroke(T.green, 0.4))),
  );

  say('三级下钻');
  yield* beat('b31',
    all(cardS().stroke(T.blue, 0.5), cardB().stroke(T.green, 0.5), lvlRoot().opacity(1, 0.5), drillDot().opacity(1, 0.4)),
    at('中间页再细分', chain(lvlMid().opacity(1, 0.5), drillDot().position([540, 0], 0.8))),
    at('叶页里找到它', chain(lvlLeaf().opacity(1, 0.5), drillDot().position([540, 80], 0.8))),
  );

  say('一键一处，还是多处副本');
  yield* beat('b32',
    all(p1().opacity(0, 0.5), p2().opacity(1, 0.5), btreeCard().opacity(1, 0.5), oneKey().opacity(1, 0.5)),
    at('好几个副本', chain(segCards[0]().opacity(1, 0.4), segCards[1]().opacity(1, 0.4), segCards[2]().opacity(1, 0.4))),
  );

  say('锁能附在树上');
  yield* beat('b33',
    all(lockBox().opacity(1, 0.5)),
    at('直接附在树上', chain(lockBox().position([-320, 100], 0.8), btreeCard().stroke(T.yellow, 0.5))),
  );

  say('B 树不会很快消失');
  yield* beat('b34',
    all(p2().opacity(0, 0.5), p3().opacity(1, 0.5), bigTree().opacity(1, 0.5)),
    at('一直很好', chain(bigTree().scale(1.05, 1.2), bigTree().scale(1, 1.2))),
  );

  say('没有快速简单的规则');
  yield* beat('b35',
    all(sprout().opacity(1, 0.5), noRule().opacity(1, 0.5), bigTree().scale(1.02, 8.0)),
    at('越来越流行', chain(sprout().scale(1.06, 1.2), sprout().scale(1, 1.2))),
  );

  say('三笔账算完，不再凭感觉');
  yield* beat('b36',
    all(bigTree().opacity(0, 0.5), sprout().opacity(0, 0.5), noRule().opacity(0, 0.5), p3().scale(1.02, 5.5)),
    at('写放大', chain(sumCards[0]().opacity(1, 0.5), checks[0]().opacity(1, 0.4))),
    at('读路径', chain(sumCards[1]().opacity(1, 0.5), checks[1]().opacity(1, 0.4))),
    at('尾延迟', chain(sumCards[2]().opacity(1, 0.5), checks[2]().opacity(1, 0.4))),
  );
});
