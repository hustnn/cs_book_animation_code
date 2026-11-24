// U11 场景 3（MC）：b22–b27 —— Example 3-1 按星期几分组、Parquet 边界、
// 各列同顺序才能拼回、回扣与收尾。分镜：skill-ch03/beats-u11.md；原文：DDIA §3.10（书页 p96–97，PDF p118–119）。
// 不发明分组结果数字：星期几分组只展示分组方式，不编造哪天卖得多。
// 时长全部来自 timeline/u11.json（beat() 驱动），不手写 waitFor。
import {Circle, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, chain, createRef} from '@motion-canvas/core';
import {at, makeBeats} from '../../lib/beats';
import {FONT, SAFE, SIZE, T} from '../../lib/theme';
import timeline from '../../timeline/u11.json';

const WEEKDAYS = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
// 分组标记：每天绿紫各一（每天两类都有），只表示“按星期分组”，不表示具体数值高低
const FRUIT_DAYS = [0, 1, 2, 3, 4, 5, 6];
const CANDY_DAYS = [0, 1, 2, 3, 4, 5, 6];

export default makeScene2D(function* (view) {
  view.fill(T.bg);
  const beat = makeBeats(timeline);

  const header = createRef<Txt>();
  const anchor = createRef<Txt>();
  const say = (text: string) => anchor().text(text);

  // ---- b22：按星期几分组 ----
  const pGroup = createRef<Node>();
  const wdCells = WEEKDAYS.map(() => createRef<Rect>());
  const fruitDots = FRUIT_DAYS.map(() => createRef<Circle>());
  const candyDots = CANDY_DAYS.map(() => createRef<Circle>());
  const fruitLab = createRef<Txt>();
  const candyLab = createRef<Txt>();
  const sweepDot = createRef<Circle>();

  // ---- b23–b24：边界 Parquet ----
  const pBound = createRef<Node>();
  const colChip = createRef<Rect>();
  const relCard = createRef<Rect>();
  const docCard = createRef<Rect>();
  const arrowRel = createRef<Line>();
  const arrowDoc = createRef<Line>();
  const parquetPlate = createRef<Rect>();
  const dremelNote = createRef<Txt>();

  // ---- b25：同顺序对照 ----
  const pOrder = createRef<Node>();
  const leftPanel = createRef<Rect>();
  const rightPanel = createRef<Rect>();
  const leftCells = [0, 1, 2].map(() => createRef<Rect>());
  const rightCells = [0, 1, 2].map(() => createRef<Rect>());
  const cross1 = createRef<Line>();
  const cross2 = createRef<Line>();
  const leftTag = createRef<Txt>();
  const rightTag = createRef<Txt>();

  // ---- b26：压得更小 ----
  const pNext = createRef<Node>();
  const nextCards = [0, 1, 2].map(() => createRef<Rect>());
  const nextArrow = createRef<Line>();
  const nextTag = createRef<Txt>();

  // ---- b27：收尾 ----
  const pClose = createRef<Node>();
  const rowCard = createRef<Rect>();
  const colCard = createRef<Rect>();

  view.add(
    <>
      <Txt
        ref={header}
        position={[-SAFE.halfW, -SAFE.halfH]}
        offset={[-1, -1]}
        fontSize={SIZE.label}
        fill={T.muted}
        fontFamily={FONT.sans}
        text={'列式存储：按列排'}
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

      {/* 按星期几分组 */}
      <Node ref={pGroup} opacity={0}>
        {WEEKDAYS.map((d, i) => (
          <Rect
            key={`gw-${i}`}
            ref={wdCells[i]}
            position={[-450 + i * 150, -60]}
            width={130}
            height={64}
            radius={10}
            fill={T.card}
            stroke={T.line}
            lineWidth={2}
          >
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={d} />
          </Rect>
        ))}
        {FRUIT_DAYS.map((d, k) => (
          <Circle
            key={`fd-${k}`}
            ref={fruitDots[k]}
            position={[-466 + d * 150, -140]}
            width={26}
            height={26}
            fill={T.green}
            opacity={0}
          />
        ))}
        {CANDY_DAYS.map((d, k) => (
          <Circle
            key={`cd-${k}`}
            ref={candyDots[k]}
            position={[-434 + d * 150, -140]}
            width={26}
            height={26}
            fill={T.purple}
            opacity={0}
          />
        ))}
        <Circle ref={sweepDot} position={[-450, 10]} width={22} height={22} fill={T.yellow} opacity={0} />
        <Txt ref={fruitLab} position={[-450, -200]} offset={[-1, 0]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} text={'● 新鲜水果'} opacity={0} />
        <Txt ref={candyLab} position={[450, -200]} offset={[1, 0]} fontSize={SIZE.label} fill={T.purple} fontFamily={FONT.sans} text={'● 糖果'} opacity={0} />
      </Node>

      {/* 边界：Parquet */}
      <Node ref={pBound} opacity={0}>
        <Rect ref={colChip} position={[0, -250]} width={360} height={64} radius={14} fill={T.card} stroke={T.blue} lineWidth={2}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'按列存'} />
        </Rect>
        <Rect ref={relCard} position={[-290, -60]} width={420} height={180} radius={16} fill={T.card} stroke={T.blue} lineWidth={3} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'关系表'} />
        </Rect>
        <Rect ref={docCard} position={[290, -60]} width={420} height={180} radius={16} fill={T.card} stroke={T.purple} lineWidth={3} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'文档'} />
        </Rect>
        <Line ref={arrowRel} points={[[-100, -218], [-290, -150]]} stroke={T.blue} lineWidth={3} endArrow opacity={0} />
        <Line ref={arrowDoc} points={[[100, -218], [290, -150]]} stroke={T.purple} lineWidth={3} endArrow opacity={0} />
        <Rect ref={parquetPlate} position={[290, 70]} width={300} height={70} radius={12} fill={T.card} stroke={T.purple} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.purple} fontFamily={FONT.mono} text={'Parquet'} />
        </Rect>
        <Txt ref={dremelNote} position={[290, 140]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'借鉴谷歌的 Dremel'} opacity={0} />
      </Node>

      {/* 同顺序对照 */}
      <Node ref={pOrder} opacity={0}>
        <Rect ref={leftPanel} position={[-300, -40]} width={480} height={300} radius={16} fill={T.card} stroke={T.red} lineWidth={2} opacity={0}>
          <Txt position={[0, -120]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'各列各排各的'} />
        </Rect>
        <Rect ref={rightPanel} position={[300, -40]} width={480} height={300} radius={16} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt position={[0, -120]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'各列同顺序'} />
        </Rect>
        {[0, 1, 2].map(i => (
          <Rect
            key={`lc-${i}`}
            ref={leftCells[i]}
            position={[-420 + i * 120, -40 + (i % 2 === 0 ? -30 : 30)]}
            width={90}
            height={44}
            radius={8}
            fill={T.bg}
            stroke={T.red}
            lineWidth={2}
            opacity={0}
          >
            <Txt fontSize={15} fill={T.text} fontFamily={FONT.mono} text={['140102', '69', '5'][i]} />
          </Rect>
        ))}
        {[0, 1, 2].map(i => (
          <Rect
            key={`rc-${i}`}
            ref={rightCells[i]}
            position={[180 + i * 120, -40]}
            width={90}
            height={44}
            radius={8}
            fill={T.bg}
            stroke={T.green}
            lineWidth={2}
            opacity={0}
          >
            <Txt fontSize={15} fill={T.text} fontFamily={FONT.mono} text={['140102', '69', '5'][i]} />
          </Rect>
        ))}
        <Line ref={cross1} points={[[-360, 60], [-240, 120]]} stroke={T.red} lineWidth={4} opacity={0} />
        <Line ref={cross2} points={[[-240, 60], [-360, 120]]} stroke={T.red} lineWidth={4} opacity={0} />
        <Txt ref={leftTag} position={[-300, 160]} fontSize={SIZE.body} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'对不上同一行'} opacity={0} />
        <Txt ref={rightTag} position={[300, 160]} fontSize={SIZE.body} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'拼得回整行'} opacity={0} />
      </Node>

      {/* 下一步：压得更小 */}
      <Node ref={pNext} opacity={0}>
        {[0, 1, 2].map(i => (
          <Rect
            key={`nc-${i}`}
            ref={nextCards[i]}
            position={[-330 + i * 330, -80]}
            width={280}
            height={90}
            radius={14}
            fill={T.card}
            stroke={T.yellow}
            lineWidth={2}
          >
            <Txt fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.mono} text={['date_key', 'product_sk', 'quantity'][i]} />
          </Rect>
        ))}
        <Line ref={nextArrow} points={[[0, 30], [0, 130]]} stroke={T.yellow} lineWidth={3} endArrow opacity={0} />
        <Txt ref={nextTag} position={[0, 180]} fontSize={SIZE.body} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'压得更小'} opacity={0} />
      </Node>

      {/* 收尾 */}
      <Node ref={pClose} opacity={0}>
        <Rect ref={rowCard} position={[-290, -40]} width={480} height={200} radius={18} fill={T.card} stroke={T.line} lineWidth={3}>
          <Txt position={[0, -50]} fontSize={SIZE.body} fontWeight={700} fill={T.muted} fontFamily={FONT.sans} text={'行'} />
          <Txt position={[0, 20]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'一次取整行'} />
        </Rect>
        <Rect ref={colCard} position={[290, -40]} width={480} height={200} radius={18} fill={T.card} stroke={T.yellow} lineWidth={3}>
          <Txt position={[0, -50]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'列'} />
          <Txt position={[0, 20]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'只取要用的几列'} />
        </Rect>
      </Node>
    </>
  );

  say('按星期几分组');
  yield* beat('b22',
    all(pGroup().opacity(1, 0.5)),
    at('水果', all(fruitDots[0]().opacity(1, 0.3), fruitDots[1]().opacity(1, 0.3), fruitDots[2]().opacity(1, 0.3), fruitDots[3]().opacity(1, 0.3), fruitDots[4]().opacity(1, 0.3), fruitDots[5]().opacity(1, 0.3), fruitDots[6]().opacity(1, 0.3))),
    at('糖果', all(candyDots[0]().opacity(1, 0.3), candyDots[1]().opacity(1, 0.3), candyDots[2]().opacity(1, 0.3), candyDots[3]().opacity(1, 0.3), candyDots[4]().opacity(1, 0.3), candyDots[5]().opacity(1, 0.3), candyDots[6]().opacity(1, 0.3))),
    at('星期几', chain(wdCells[0]().stroke(T.yellow, 0.3), wdCells[1]().stroke(T.yellow, 0.3), wdCells[2]().stroke(T.yellow, 0.3), wdCells[3]().stroke(T.yellow, 0.3), wdCells[4]().stroke(T.yellow, 0.3), wdCells[5]().stroke(T.yellow, 0.3), wdCells[6]().stroke(T.yellow, 0.3))),
    at('答案就出来了', all(fruitLab().opacity(1, 0.4), candyLab().opacity(1, 0.4))),
    at('只读三列', chain(sweepDot().opacity(1, 0.3), sweepDot().position([-300, 10], 0.35), sweepDot().position([-150, 10], 0.35), sweepDot().position([0, 10], 0.35), sweepDot().position([150, 10], 0.35), sweepDot().position([300, 10], 0.35), sweepDot().position([450, 10], 0.35))),
  );

  say('不只用于关系数据');
  yield* beat('b23',
    all(pGroup().opacity(0, 0.5), pBound().opacity(1, 0.5)),
    at('关系数据', all(relCard().opacity(1, 0.5), arrowRel().opacity(1, 0.4))),
    at('不只适用于关系数据', all(docCard().opacity(1, 0.5), arrowDoc().opacity(1, 0.4))),
  );

  say('Parquet 也支持文档');
  yield* beat('b24',
    at('Parquet', parquetPlate().opacity(1, 0.5)),
    at('文档数据模型', docCard().stroke(T.green, 0.4)),
    at('Dremel', dremelNote().opacity(1, 0.5)),
  );

  say('各列同顺序才拼得回');
  yield* beat('b25',
    all(pBound().opacity(0, 0.5), pOrder().opacity(1, 0.5)),
    pOrder().scale(1.02, beat.dur('b25')),
    at('各排各的', all(leftPanel().opacity(1, 0.5),
      leftCells[0]().opacity(1, 0.4), leftCells[1]().opacity(1, 0.4), leftCells[2]().opacity(1, 0.4),
      cross1().opacity(1, 0.4), cross2().opacity(1, 0.4), leftTag().opacity(1, 0.4))),
    at('顺序必须一致', all(rightPanel().opacity(1, 0.5),
      rightCells[0]().opacity(1, 0.4), rightCells[1]().opacity(1, 0.4), rightCells[2]().opacity(1, 0.4),
      rightTag().opacity(1, 0.4))),
  );

  say('下一步：压得更小');
  yield* beat('b26',
    all(pOrder().opacity(0, 0.5), pNext().opacity(1, 0.5)),
    at('压得更小', chain(nextArrow().opacity(1, 0.3), nextTag().opacity(1, 0.3))),
  );

  say('行取整行，列取要用的');
  yield* beat('b27',
    all(pNext().opacity(0, 0.5), pClose().opacity(1, 0.5)),
    at('一次取整行', rowCard().opacity(0.45, 0.5)),
    at('只取要用的那几列', all(colCard().scale(1.03, 0.8))),
    at('后者', colCard().stroke(T.green, 0.4)),
  );
});
