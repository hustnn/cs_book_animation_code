// U0 开场总述（MC，单场景）：b1–b10 —— 三把尺子 + 本章路线图（9 个单元路标），再交还给 U1 的钩子。
// 分镜：skill-ch01/beats-u0.md；原文：DDIA §1.0（书页 p3）、§1.1 三把尺子定义（书页 p5–6）。
// 时长全部来自 timeline/u0.json（beat() 驱动），不手写 waitFor 魔法数字。
// 颜色、字号、安全区一律取自 lib/theme，不手写十六进制色值。
// 画面标题不带单元编号；旁白与画面均不出现 "U0" 字样。
import {Circle, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, chain, createRef} from '@motion-canvas/core';
import {makeBeats} from '../../lib/beats';
import {FONT, SAFE, SIZE, T} from '../../lib/theme';
import timeline from '../../timeline/u0.json';

const RULERS = [
  {x: -360, label: '可靠', sub: 'Reliability'},
  {x: 0, label: '可扩展', sub: 'Scalability'},
  {x: 360, label: '可维护', sub: 'Maintainability'},
];

const CHIPS = [
  {x: -380, y: -190, label: '拼出来的系统'},
  {x: 0, y: -190, label: '可靠是什么意思'},
  {x: 380, y: -190, label: '故障从哪来'},
  {x: -380, y: -70, label: 'Twitter 时间线'},
  {x: 0, y: -70, label: '性能是分布'},
  {x: 380, y: -70, label: '尾巴从哪来'},
  {x: -380, y: 50, label: '扛住更大负载'},
  {x: 0, y: 50, label: '维护与运维'},
  {x: 380, y: 50, label: '简单可演化'},
];

const ROW_TAGS = ['先看系统与可靠', '再看负载与性能', '最后看扩展与维护'];
const ROW_TAG_Y = [-258, -130, -10]; // r2：行间中点，标签与路标边框上下各留 ≥7px

export default makeScene2D(function* (view) {
  view.fill(T.bg);
  const beat = makeBeats(timeline);

  const header = createRef<Txt>();
  const anchor = createRef<Txt>();
  const gRulers = createRef<Node>();
  const rulers = [0, 1, 2].map(() => createRef<Rect>());
  const borders = [0, 1, 2].map(() => createRef<Rect>());
  const faultDot = createRef<Circle>();
  const gGrowth = createRef<Node>();
  const bars = [0, 1, 2].map(() => createRef<Rect>());
  const gPeople = createRef<Node>();
  const people = [0, 1, 2].map(() => createRef<Circle>());
  const gRoad = createRef<Node>();
  const chips = [0, 1, 2, 3, 4, 5, 6, 7, 8].map(() => createRef<Rect>());
  const chipBorders = [0, 1, 2, 3, 4, 5, 6, 7, 8].map(() => createRef<Rect>());

  const say = (text: string) => anchor().text(text);

  view.add(
    <>
      <Txt
        ref={header}
        position={[-SAFE.halfW, -SAFE.halfH]}
        offset={[-1, -1]}
        fontSize={SIZE.label}
        fill={T.muted}
        fontFamily={FONT.sans}
        text={'第 1 章 · 三把尺子'}
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

      {/* 三把尺子：b1 剪影、b2 并排亮起、b3–b5 逐个高亮、b9 收回 */}
      <Node ref={gRulers} opacity={0}>
        {RULERS.map((r, i) => (
          <Rect
            key={`u0-ruler-${i}`}
            ref={rulers[i]}
            position={[r.x, -40]}
            width={300}
            height={180}
            radius={16}
            fill={T.card}
            stroke={T.line}
            lineWidth={2}
          >
            <Txt position={[0, -30]} fontSize={SIZE.body} fontWeight={700} fill={T.white} fontFamily={FONT.sans} text={r.label} />
            <Txt position={[0, 40]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={r.sub} />
          </Rect>
        ))}
        {RULERS.map((r, i) => (
          <Rect
            key={`u0-border-${i}`}
            ref={borders[i]}
            position={[r.x, -40]}
            width={316}
            height={196}
            radius={20}
            fill={'#00000000'}
            stroke={T.yellow}
            lineWidth={3}
            opacity={0}
          />
        ))}
        {/* b3：故障红点撞上“可靠”尺子又被弹开 */}
        <Circle ref={faultDot} position={[-360, 220]} width={30} height={30} fill={T.red} opacity={0} />
      </Node>

      {/* b4：三条增长曲线在尺子下方爬升 */}
      <Node ref={gGrowth} opacity={0}>
        {[
          {x: -200, h: 70},
          {x: 0, h: 120},
          {x: 200, h: 170},
        ].map((b, i) => (
          <Rect
            key={`u0-bar-${i}`}
            ref={bars[i]}
            position={[b.x, 200]}
            offset={[0, 1]}
            width={110}
            height={10}
            radius={8}
            fill={T.blue}
          />
        ))}
        <Txt position={[0, 240]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'数据量 · 流量 · 复杂度都在长'} />
      </Node>

      {/* b5：不同角色的小人轮流走进系统 */}
      <Node ref={gPeople} opacity={0}>
        {[0, 1, 2].map(i => (
          <Circle
            key={`u0-person-${i}`}
            ref={people[i]}
            position={[-500 - i * 40, 140]}
            width={36}
            height={36}
            fill={i === 1 ? T.green : T.blue}
          />
        ))}
        <Txt position={[0, 200]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'许多不同的人'} />
      </Node>

      {/* b6–b8、b10：本章路线图，9 块路标分三组 */}
      <Node ref={gRoad} opacity={0}>
        {ROW_TAGS.map((tag, i) => (
          <Txt
            key={`u0-rowtag-${i}`}
            position={[0, ROW_TAG_Y[i]]}
            fontSize={SIZE.min}
            fill={T.yellow}
            fontFamily={FONT.sans}
            text={tag}
          />
        ))}
        {CHIPS.map((c, i) => (
          <Rect
            key={`u0-chip-${i}`}
            ref={chips[i]}
            position={[c.x, c.y]}
            width={340}
            height={72}
            radius={14}
            fill={T.card}
            stroke={T.line}
            lineWidth={2}
            opacity={0.45}
          >
            <Txt
              fontSize={SIZE.label}
              fill={T.text}
              fontFamily={FONT.sans}
              textWrap
              maxWidth={320}
              text={c.label}
            />
          </Rect>
        ))}
        {CHIPS.map((c, i) => (
          <Rect
            key={`u0-chipborder-${i}`}
            ref={chipBorders[i]}
            position={[c.x, c.y]}
            width={356}
            height={88}
            radius={18}
            fill={'#00000000'}
            stroke={T.yellow}
            lineWidth={3}
            opacity={0}
          />
        ))}
      </Node>
    </>,
  );

  // b1：钩子——三把尺子剪影由暗变亮
  say('怎么判断好不好');
  yield* beat(
    'b1',
    all(gRulers().opacity(0.55, 2.0), gRulers().scale(1.02, 3.5)),
  );

  // b2：三把尺子并排亮起（尺子组缓慢放大，占满整拍）
  say('三把尺子');
  yield* beat(
    'b2',
    all(
      gRulers().opacity(1, 0.6),
      gRulers().scale(1.04, 4.5),
      borders[0]().opacity(1, 1.2),
      borders[1]().opacity(1, 2.4),
      borders[2]().opacity(1, 3.6),
    ),
  );

  // b3：可靠高亮——故障红点撞上来又被弹开
  say('坏了还正确');
  yield* beat(
    'b3',
    all(
      borders[1]().opacity(0, 0.5),
      borders[2]().opacity(0, 0.5),
      chain(
        all(faultDot().opacity(1, 0.3), faultDot().position([-360, 60], 1.4)),
        faultDot().position([-360, 220], 1.6),
      ),
    ),
  );

  // b4：可扩展高亮——三条增长曲线爬升
  say('长大了有办法');
  yield* beat(
    'b4',
    all(
      borders[0]().opacity(0, 0.5),
      borders[1]().opacity(1, 0.8),
      faultDot().opacity(0, 0.4),
      gRulers().opacity(0.55, 0.8),
      gGrowth().opacity(1, 0.6),
      bars[0]().height(70, 2.5),
      bars[1]().height(120, 3.5),
      bars[2]().height(170, 4.5),
    ),
  );

  // b5：可维护高亮——小人轮流走进系统
  say('许多人都能高效干');
  yield* beat(
    'b5',
    all(
      borders[1]().opacity(0, 0.5),
      borders[2]().opacity(1, 0.8),
      gGrowth().opacity(0, 0.5),
      gPeople().opacity(1, 0.6),
      people[0]().position([500, 140], 4.0),
      people[1]().position([500, 140], 4.2),
      people[2]().position([500, 140], 4.4),
    ),
  );

  // b6：路线图出现，第一组三块路标亮起
  say('先看可靠');
  yield* beat(
    'b6',
    all(
      gRulers().opacity(0, 0.5),
      gPeople().opacity(0, 0.5),
      borders[2]().opacity(0, 0.4),
      gRoad().opacity(1, 0.6),
      chips[0]().opacity(1, 1.2),
      chips[1]().opacity(1, 2.0),
      chips[2]().opacity(1, 2.8),
      chipBorders[0]().opacity(1, 1.2),
      chipBorders[1]().opacity(1, 2.0),
      chipBorders[2]().opacity(1, 2.8),
    ),
  );

  // b7a：第二组第一块路标亮起（Twitter 时间线），缓慢放大占满整拍
  say('Twitter 时间线');
  yield* beat(
    'b7a',
    all(
      chips[0]().opacity(0.45, 0.5),
      chips[1]().opacity(0.45, 0.5),
      chips[2]().opacity(0.45, 0.5),
      chipBorders[0]().opacity(0, 0.5),
      chipBorders[1]().opacity(0, 0.5),
      chipBorders[2]().opacity(0, 0.5),
      chips[3]().opacity(1, 1.0),
      chipBorders[3]().opacity(1, 1.0),
      chips[3]().scale(1.03, 3.5),
      chipBorders[3]().scale(1.03, 3.5),
    ),
  );

  // b7b：第二组后两块路标亮起
  say('分布与尾巴');
  yield* beat(
    'b7b',
    all(
      chips[4]().opacity(1, 1.0),
      chips[5]().opacity(1, 1.8),
      chipBorders[4]().opacity(1, 1.0),
      chipBorders[5]().opacity(1, 1.8),
    ),
  );

  // b8：第三组三块路标亮起
  say('最后看维护');
  yield* beat(
    'b8',
    all(
      chips[3]().opacity(0.45, 0.5),
      chips[4]().opacity(0.45, 0.5),
      chips[5]().opacity(0.45, 0.5),
      chipBorders[3]().opacity(0, 0.5),
      chipBorders[4]().opacity(0, 0.5),
      chipBorders[5]().opacity(0, 0.5),
      chips[6]().opacity(1, 1.2),
      chips[7]().opacity(1, 2.2),
      chips[8]().opacity(1, 3.2),
      chipBorders[6]().opacity(1, 1.2),
      chipBorders[7]().opacity(1, 2.2),
      chipBorders[8]().opacity(1, 3.2),
    ),
  );

  // b9：路线图淡出，三把尺子重新并排亮起
  say('三把尺子收回来');
  yield* beat(
    'b9',
    all(
      gRoad().opacity(0, 0.5),
      chips[6]().opacity(0.45, 0.3),
      chips[7]().opacity(0.45, 0.3),
      chips[8]().opacity(0.45, 0.3),
      chipBorders[6]().opacity(0, 0.3),
      chipBorders[7]().opacity(0, 0.3),
      chipBorders[8]().opacity(0, 0.3),
      gRulers().opacity(1, 0.6),
      gRulers().scale(1, 1.0),
      borders[0]().opacity(1, 1.5),
      borders[1]().opacity(1, 2.5),
      borders[2]().opacity(1, 3.5),
    ),
  );

  // b10：交还给 U1 的钩子——第一块路标缓慢放大亮起（r2：删掉穿字的箭头）
  say('一个 App，多个工具');
  yield* beat(
    'b10',
    all(
      gRulers().opacity(0, 0.5),
      borders[0]().opacity(0, 0.4),
      borders[1]().opacity(0, 0.4),
      borders[2]().opacity(0, 0.4),
      gRoad().opacity(1, 0.6),
      chips[0]().opacity(1, 1.2),
      chipBorders[0]().opacity(1, 1.2),
      chips[0]().scale(1.05, 5.0),
      chipBorders[0]().scale(1.05, 5.0),
    ),
  );
});
