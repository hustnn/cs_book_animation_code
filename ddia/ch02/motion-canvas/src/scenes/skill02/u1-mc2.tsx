// U1 场景 2（MC）：b3–b14 —— 钩子（统治 25–30 年）、模型像镜片、
// 四层叠加塔、每层藏起下层复杂、模型暗含假设、选对模型很重要。
// 分镜：skill-ch02/beats-u1.md U1 一节；原文：DDIA §2.0（书页 p27–28）。
// 时长全部来自 timeline/u1.json（beat() 驱动），不手写 waitFor。
// 颜色、字号、安全区一律取自 lib/theme，不手写十六进制色值。
import {Circle, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, chain, createRef} from '@motion-canvas/core';
import {at, makeBeats} from '../../lib/beats';
import {row} from '../../lib/layout';
import {FONT, SAFE, SIZE, T} from '../../lib/theme';
import timeline from '../../timeline/u1.json';

const LAYER_Y = [-215, -120, -25, 70];
const LAYER_H = 88;

export default makeScene2D(function* (view) {
  view.fill(T.bg);
  const beat = makeBeats(timeline);

  const header = createRef<Txt>();
  const anchor = createRef<Txt>();
  const say = (text: string) => anchor().text(text);

  // b3：王座与 25–30 年刻度条
  const g3 = createRef<Node>();
  const g3card = createRef<Rect>();
  const g3bar = createRef<Rect>();
  const g3star = createRef<Txt>();
  // b4/b5：问题卡 + 镜片
  const g4 = createRef<Node>();
  const g4card = createRef<Rect>();
  const g4shapeA = createRef<Rect>();
  const g4shapeB = createRef<Circle>();
  const g4lens = createRef<Circle>();
  const g4lensLab = createRef<Txt>();
  const g4lensLab2 = createRef<Txt>();
  // b6–b11：四层塔
  const g6 = createRef<Node>();
  const g6layers = [0, 1, 2, 3].map(() => createRef<Rect>());
  const g6subs = [0, 1, 2, 3].map(() => createRef<Txt>());
  const g6under = createRef<Txt>();
  const g6lids = [0, 1, 2, 3].map(() => createRef<Rect>());
  const g6vennA = createRef<Circle>();
  const g6vennB = createRef<Circle>();
  const g6vennLab = createRef<Txt>();
  // b12/b13：同一模型，三种用法
  const g12 = createRef<Node>();
  const g12card = createRef<Rect>();
  const g12slots = [0, 1, 2].map(() => createRef<Rect>());
  const g12slotLabs = [0, 1, 2].map(() => createRef<Txt>());
  const g12verdicts = [0, 1, 2].map(() => createRef<Txt>());
  // b14：书堆
  const g14 = createRef<Node>();
  const g14books = [0, 1, 2, 3, 4].map(() => createRef<Rect>());
  const g14ruler = createRef<Rect>();
  const g14rulerLab = createRef<Txt>();

  const layerTitles = ['现实世界', '对象与数据结构', '通用数据模型', '字节'];
  const layerSubs = [
    '人 · 组织 · 商品 · 行动 · 钱的流动 · 传感器',
    '为自己的应用建的模型',
    '文档 · 关系表 · 图',
    '内存 · 磁盘 · 网络',
  ];
  const slotPos = row(3, 300, 24, [0, 120]);
  const bookTitles = ['关系建模', 'SQL', '范式', '索引', '优化'];

  view.add(
    <>
      <Txt
        ref={header}
        position={[-SAFE.halfW, -SAFE.halfH]}
        offset={[-1, -1]}
        fontSize={SIZE.label}
        fill={T.muted}
        fontFamily={FONT.sans}
        text={'模型决定你怎么写代码'}
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

      {/* b3：王座与刻度条 */}
      <Node ref={g3} opacity={0}>
        <Rect ref={g3card} position={[0, -140]} width={460} height={110} radius={16} fill={T.card} stroke={T.yellow} lineWidth={3}>
          <Txt fontSize={SIZE.title} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'关系数据库'} />
        </Rect>
        <Txt ref={g3star} position={[0, -240]} fontSize={SIZE.title} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'★ 王座'} opacity={0} />
        <Rect position={[0, 10]} width={760} height={30} radius={15} fill={T.card} stroke={T.line} lineWidth={2} />
        <Rect ref={g3bar} position={[-380, 10]} offset={[-1, 0]} width={0} height={30} radius={15} fill={T.green} />
        <Txt position={[-380, 60]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.mono} text={'1970'} />
        <Txt position={[380, 60]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.mono} text={'今天'} />
        <Txt position={[0, 110]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'统治了 25–30 年'} />
      </Node>

      {/* b4/b5：问题卡 + 镜片 */}
      <Node ref={g4} opacity={0}>
        <Rect ref={g4card} position={[0, -60]} width={620} height={220} radius={18} fill={T.card} stroke={T.blue} lineWidth={2}>
          <Txt position={[0, -60]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'同一个问题'} />
          <Txt position={[0, 10]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'这份数据，怎么存？'} />
        </Rect>
        <Rect ref={g4shapeA} position={[-160, 60]} width={90} height={90} radius={10} fill={T.blue} />
        <Circle ref={g4shapeB} position={[160, 60]} width={90} height={90} fill={T.purple} opacity={0} />
        <Circle ref={g4lens} position={[0, -60]} width={300} height={300} stroke={T.yellow} lineWidth={4} opacity={0.9} />
        <Txt ref={g4lensLab} position={[0, -250]} fontSize={SIZE.label} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'镜片一'} opacity={0} />
        <Txt ref={g4lensLab2} position={[0, -250]} fontSize={SIZE.label} fontWeight={700} fill={T.purple} fontFamily={FONT.sans} text={'镜片二'} opacity={0} />
      </Node>

      {/* b6–b11：四层塔 */}
      <Node ref={g6} opacity={0}>
        {[0, 1, 2, 3].map(i => (
          <Rect
            key={`g6l-${i}`}
            ref={g6layers[i]}
            position={[0, LAYER_Y[i]]}
            width={520}
            height={LAYER_H}
            radius={14}
            fill={T.card}
            stroke={T.blue}
            lineWidth={2}
            opacity={0}
          >
            <Txt position={[-240, -20]} offset={[-1, -1]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={layerTitles[i]} />
            <Txt
              ref={g6subs[i]}
              position={[-240, 10]}
              offset={[-1, -1]}
              fontSize={SIZE.label}
              fill={T.muted}
              fontFamily={FONT.sans}
              text={layerSubs[i]}
              opacity={0}
            />
          </Rect>
        ))}
        {[0, 1, 2, 3].map(i => (
          <Rect
            key={`g6lid-${i}`}
            ref={g6lids[i]}
            position={[0, LAYER_Y[i] - LAYER_H / 2]}
            width={520}
            height={10}
            radius={5}
            fill={T.yellow}
            opacity={0}
          />
        ))}
        <Txt ref={g6under} position={[0, 185]} fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.sans} text={'电流 · 光脉冲 · 磁场'} opacity={0} />
        <Circle ref={g6vennA} position={[400, -140]} width={110} height={110} stroke={T.green} lineWidth={3} opacity={0} />
        <Circle ref={g6vennB} position={[470, -140]} width={110} height={110} stroke={T.blue} lineWidth={3} opacity={0} />
        <Txt ref={g6vennLab} position={[435, -40]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'分工协作'} opacity={0} />
      </Node>

      {/* b12/b13：同一模型，三种用法 */}
      <Node ref={g12} opacity={0}>
        <Rect ref={g12card} position={[0, -110]} width={480} height={120} radius={16} fill={T.card} stroke={T.blue} lineWidth={2}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'同一个模型'} />
        </Rect>
        {[0, 1, 2].map(i => (
          <Rect key={`g12s-${i}`} ref={g12slots[i]} position={slotPos[i]} width={300} height={110} radius={14} fill={T.card} stroke={T.line} lineWidth={2}>
            <Txt ref={g12slotLabs[i]} position={[0, -22]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={['用法一', '用法二', '用法三'][i]} />
            <Txt ref={g12verdicts[i]} position={[0, 22]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={['顺手', '别扭', '不支持'][i]} opacity={0} />
          </Rect>
        ))}
      </Node>

      {/* b14：书堆 */}
      <Node ref={g14} opacity={0}>
        {[0, 1, 2, 3, 4].map(i => (
          <Rect
            key={`g14b-${i}`}
            ref={g14books[i]}
            position={[-330, 170 - i * 48]}
            width={300}
            height={42}
            radius={8}
            fill={T.card}
            stroke={i % 2 === 0 ? T.blue : T.purple}
            lineWidth={2}
            opacity={0}
          >
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={bookTitles[i]} />
          </Rect>
        ))}
        <Rect ref={g14ruler} position={[120, -40]} width={16} height={0} fill={T.yellow} opacity={0} />
        <Txt ref={g14rulerLab} position={[330, -40]} fontSize={SIZE.body} fill={T.yellow} fontFamily={FONT.sans} text={'要花很大力气'} opacity={0} />
      </Node>
    </>,
  );

  say('统治 25–30 年，凭什么？');
  yield* beat('b3',
    all(g3().opacity(1, 0.5)),
    at('二十五到三十年', g3bar().width(760, 1.6)),
    at('凭什么是它', all(g3star().opacity(1, 0.4), g3card().stroke(T.yellow, 0.4))),
  );

  say('模型决定怎么写代码');
  yield* beat('b4',
    all(g3().opacity(0, 0.5), g4().opacity(1, 0.5)),
    at('数据模型', g4card().scale(1.03, 0.5)),
    at('最重要的部分', g4lens().opacity(1, 0.5)),
    at('决定软件怎么写', g4shapeA().scale(1.12, 0.4)),
    at('怎么想问题', g4lensLab().opacity(1, 0.4)),
  );

  say('换镜片，换看法');
  yield* beat('b5',
    all(g4shapeA().opacity(0, 0.6), g4shapeB().opacity(1, 0.6)),
    at('换一副镜片', all(g4lens().stroke(T.purple, 0.6), g4lensLab().opacity(0, 0.4), g4lensLab2().opacity(1, 0.4))),
    at('完全不一样', g4lens().scale(1.12, 0.6)),
  );

  say('四层叠起来');
  yield* beat('b6',
    all(g4().opacity(0, 0.5), g6().opacity(1, 0.5)),
    at('叠在另一个上面', chain(g6layers[0]().opacity(1, 0.4), g6layers[1]().opacity(1, 0.4), g6layers[2]().opacity(1, 0.4), g6layers[3]().opacity(1, 0.4))),
    at('四层', g6layers[0]().stroke(T.yellow, 0.4)),
  );

  say('现实世界');
  yield* beat('b7a',
    all(g6layers[0]().stroke(T.blue, 0.4)),
    at('现实世界', g6subs[0]().opacity(1, 0.5)),
    at('钱的流动', g6layers[0]().scale(1.03, 0.5)),
  );

  say('现实世界');
  yield* beat('b7b',
    at('传感器', g6layers[0]().scale(1.06, 0.4)),
  );

  say('对象与数据结构');
  yield* beat('b8',
    all(g6layers[0]().scale(1, 0.4)),
    at('对象和数据结构', g6subs[1]().opacity(1, 0.5)),
    at('自己的应用', g6layers[1]().stroke(T.yellow, 0.4)),
  );

  say('文档、表、图');
  yield* beat('b9',
    all(g6layers[1]().stroke(T.blue, 0.4)),
    at('通用数据模型', g6subs[2]().opacity(1, 0.5)),
    at('或者图', g6layers[2]().stroke(T.yellow, 0.4)),
  );

  say('字节存内存、磁盘、网络');
  yield* beat('b10a',
    g6().scale(1.02, beat.dur('b10a')),
    all(g6layers[2]().stroke(T.blue, 0.4)),
    at('内存、磁盘和网络', g6subs[3]().opacity(1, 0.5)),
    at('最底层是字节', g6layers[3]().stroke(T.yellow, 0.4)),
  );

  say('电流、光、磁场');
  yield* beat('b10b',
    g6().scale(1.04, beat.dur('b10b')),
    all(g6layers[3]().stroke(T.blue, 0.4)),
    at('电流、光脉冲和磁场', g6under().opacity(1, 0.6)),
  );

  say('每层藏起下层的复杂');
  yield* beat('b11',
    all(...g6lids.map(l => l().opacity(1, 0.5))),
    at('藏起来', all(g6vennA().opacity(1, 0.5), g6vennB().opacity(1, 0.5))),
    at('配合得上', g6vennLab().opacity(1, 0.4)),
  );

  say('模型暗含假设');
  yield* beat('b12',
    g12().scale(1.02, beat.dur('b12')),
    all(g6().opacity(0, 0.5), g12().opacity(1, 0.5)),
    at('暗含一套假设', chain(g12slots[0]().opacity(1, 0.4), g12slots[1]().opacity(1, 0.4), g12slots[2]().opacity(1, 0.4))),
    at('根本不支持', g12card().stroke(T.yellow, 0.4)),
  );

  say('顺手、别扭、不支持');
  yield* beat('b13',
    at('绿灯', all(g12slots[0]().fill(T.green, 0.8), g12slotLabs[0]().fill(T.bg, 0.4), g12verdicts[0]().opacity(1, 0.4), g12verdicts[0]().fill(T.bg, 0.4))),
    at('黄灯', all(g12slots[1]().fill(T.yellow, 0.8), g12slotLabs[1]().fill(T.bg, 0.4), g12verdicts[1]().opacity(1, 0.4), g12verdicts[1]().fill(T.bg, 0.4))),
    at('红灯', all(g12slots[2]().fill(T.red, 0.8), g12slotLabs[2]().fill(T.bg, 0.4), g12verdicts[2]().opacity(1, 0.4), g12verdicts[2]().fill(T.bg, 0.4))),
    at('不支持', g12card().stroke(T.blue, 0.4)),
  );

  say('选对模型很重要');
  yield* beat('b14',
    all(g12().opacity(0, 0.5), g14().opacity(1, 0.5)),
    at('很大力气', chain(g14books[0]().opacity(1, 0.4), g14books[1]().opacity(1, 0.4), g14books[2]().opacity(1, 0.4), g14books[3]().opacity(1, 0.4), g14books[4]().opacity(1, 0.4))),
    at('选对模型', all(g14ruler().opacity(1, 0.4), g14ruler().height(240, 0.8), g14rulerLab().opacity(1, 0.4))),
  );
});
