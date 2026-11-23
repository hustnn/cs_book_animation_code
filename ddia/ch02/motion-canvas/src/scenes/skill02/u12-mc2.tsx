// U12 场景 2（MC）：b10–b15 —— schema 写时强制 vs 读时处理、
// 选型三问小结卡 N1（总结性原创表，右上角标“总结”）。
// 分镜：skill-ch02/beats-u12.md U12 一节；原文：DDIA §2.16（书页 p63–64）。
// N1 的三条内容来自 §2.6 的选型讨论（inventory N1 行），画面与旁白均按 inventory 标注为总结。
// 时长全部来自 timeline/u12.json（beat() 驱动），不手写 waitFor。
// 颜色、字号、安全区一律取自 lib/theme，不手写十六进制色值。
import {Circle, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, chain, createRef} from '@motion-canvas/core';
import {at, makeBeats} from '../../lib/beats';
import {FONT, SAFE, SIZE, T} from '../../lib/theme';
import timeline from '../../timeline/u12.json';

export default makeScene2D(function* (view) {
  view.fill(T.bg);
  const beat = makeBeats(timeline);

  const header = createRef<Txt>();
  const anchor = createRef<Txt>();
  const say = (text: string) => anchor().text(text);

  // —— b10：不强制规定结构 ——
  const g10 = createRef<Node>();
  const g10stamp = createRef<Node>();
  const g10doc = createRef<Rect>();
  const g10graph = createRef<Rect>();
  // —— b11：写时盖章 vs 读时解读 ——
  const g11 = createRef<Node>();
  const g11stamp = createRef<Node>();
  const g11mag = createRef<Node>();
  const g11q = createRef<Txt>();
  // —— b12–b15：选型三问小结卡 ——
  const g12 = createRef<Node>();
  const g12q1 = createRef<Txt>();
  const g12q2 = createRef<Txt>();
  const g12q3 = createRef<Txt>();
  const g13q = createRef<Txt>();
  const g13a1 = createRef<Txt>();
  const g13a2 = createRef<Txt>();
  const g14q = createRef<Txt>();
  const g14a1 = createRef<Txt>();
  const g14a2 = createRef<Txt>();
  const g15q = createRef<Txt>();
  const g15a1 = createRef<Txt>();
  const g15a2 = createRef<Txt>();
  const g15grow = createRef<Node>();

  view.add(
    <>
      <Txt
        ref={header}
        position={[-SAFE.halfW, -SAFE.halfH]}
        offset={[-1, -1]}
        fontSize={SIZE.label}
        fill={T.muted}
        fontFamily={FONT.sans}
        text={'小结'}
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

      {/* b10：两张卡头顶的盖章消失 */}
      <Node ref={g10} opacity={0}>
        <Rect ref={g10doc} position={[-300, -40]} width={380} height={240} radius={16} fill={T.card} stroke={T.purple} lineWidth={2}>
          <Txt position={[0, -40]} fontSize={SIZE.title} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'文档库'} />
          <Txt position={[0, 40]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.mono} text={'{ … }'} />
        </Rect>
        <Rect ref={g10graph} position={[300, -40]} width={380} height={240} radius={16} fill={T.card} stroke={T.yellow} lineWidth={2}>
          <Txt position={[0, -40]} fontSize={SIZE.title} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'图库'} />
          <Txt position={[0, 40]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'点 · 线'} />
        </Rect>
        <Node ref={g10stamp}>
          <Rect position={[0, -220]} width={200} height={70} radius={10} fill={T.card} stroke={T.red} lineWidth={3}>
            <Txt fontSize={SIZE.label} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'schema'} />
          </Rect>
        </Node>
      </Node>

      {/* b11：写时盖章 vs 读时解读 */}
      <Node ref={g11} opacity={0}>
        <Rect position={[-320, -40]} width={360} height={220} radius={16} fill={T.card} stroke={T.purple} lineWidth={2}>
          <Txt position={[0, -70]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.mono} text={'{ … }'} />
          <Txt position={[0, 70]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'文档'} />
        </Rect>
        <Node ref={g11stamp} position={[-320, -40]} opacity={0}>
          <Rect position={[0, 0]} width={220} height={80} radius={10} fill={T.bg} stroke={T.red} lineWidth={3}>
            <Txt fontSize={SIZE.label} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'写时盖章'} />
          </Rect>
        </Node>
        <Rect position={[320, -40]} width={360} height={220} radius={16} fill={T.card} stroke={T.yellow} lineWidth={2}>
          <Txt position={[0, -85]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'图'} />
        </Rect>
        <Node ref={g11mag} position={[320, -40]} opacity={0}>
          <Circle position={[0, 0]} width={130} height={130} fill={T.bg} stroke={T.green} lineWidth={4} />
          <Line points={[[48, 48], [90, 90]]} stroke={T.green} lineWidth={5} />
          <Txt position={[0, 0]} fontSize={SIZE.label} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'读时解读'} />
        </Node>
        <Txt ref={g11q} position={[0, -40]} fontSize={72} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'?'} opacity={0} />
      </Node>

      {/* b12–b15：选型三问小结卡 */}
      <Node ref={g12} opacity={0}>
        <Rect position={[0, -20]} width={1020} height={480} radius={18} fill={T.card} stroke={T.blue} lineWidth={2} />
        <Txt position={[-480, -220]} offset={[-1, -1]} fontSize={SIZE.title} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'选模型，先问三问'} />
        <Rect position={[420, -220]} width={90} height={44} radius={8} fill={T.purple} opacity={0.9}>
          <Txt fontSize={SIZE.label} fontWeight={700} fill={T.white} fontFamily={FONT.sans} text={'总结'} />
        </Rect>
        <Txt ref={g12q1} position={[-460, -110]} offset={[-1, 0]} fontSize={SIZE.title} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'?'} opacity={0} />
        <Txt ref={g12q2} position={[-460, 0]} offset={[-1, 0]} fontSize={SIZE.title} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'?'} opacity={0} />
        <Txt ref={g12q3} position={[-460, 110]} offset={[-1, 0]} fontSize={SIZE.title} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'?'} opacity={0} />
        <Txt ref={g13q} position={[-380, -110]} offset={[-1, 0]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'数据是文档式，还是连着的？'} opacity={0} />
        <Txt ref={g13a1} position={[60, -130]} offset={[-1, 0]} fontSize={SIZE.label} fill={T.purple} fontFamily={FONT.sans} text={'文档式 → 文档库'} opacity={0} />
        <Txt ref={g13a2} position={[60, -90]} offset={[-1, 0]} fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.sans} text={'互相连着 → 图库'} opacity={0} />
        <Txt ref={g14q} position={[-380, 0]} offset={[-1, 0]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'要不要连表查？'} opacity={0} />
        <Txt ref={g14a1} position={[60, -20]} offset={[-1, 0]} fontSize={SIZE.label} fill={T.blue} fontFamily={FONT.sans} text={'经常连 → 关系库'} opacity={0} />
        <Txt ref={g14a2} position={[60, 20]} offset={[-1, 0]} fontSize={SIZE.label} fill={T.purple} fontFamily={FONT.sans} text={'很少连 → 文档库'} opacity={0} />
        <Txt ref={g15q} position={[-380, 110]} offset={[-1, 0]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'数据会不会越连越多？'} opacity={0} />
        <Txt ref={g15a1} position={[60, 90]} offset={[-1, 0]} fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.sans} text={'越连越多 → 图库'} opacity={0} />
        <Txt ref={g15a2} position={[60, 130]} offset={[-1, 0]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} text={'图最能跟着长'} opacity={0} />
        <Node ref={g15grow} position={[440, 115]} opacity={0}>
          <Circle position={[0, -25]} width={26} height={26} fill={T.green} />
          <Circle position={[0, 25]} width={26} height={26} fill={T.green} />
          <Line points={[[0, -12], [0, 12]]} stroke={T.green} lineWidth={3} />
        </Node>
      </Node>
    </>
  );

  say('不强制规定结构');
  yield* beat('b10',
    all(g10().opacity(1, 0.5)),
    at('共同点', all(g10doc().scale(1.03, 0.4), g10graph().scale(1.03, 0.4))),
    at('强制规定结构', chain(g10stamp().opacity(0, 0.6), all(g10doc().scale(1.06, 0.5), g10graph().scale(1.06, 0.5)))),
    at('更容易适应', all(g10doc().scale(1.12, 0.6), g10graph().scale(1.12, 0.6))),
  );

  say('写时强制，还是读时处理');
  yield* beat('b11',
    all(g10().opacity(0, 0.5), g11().opacity(1, 0.5), g11q().opacity(1, 0.4)),
    at('某种结构', g11q().scale(1.2, 0.5)),
    at('写的时候强制', chain(g11stamp().opacity(1, 0.4), g11stamp().scale(1.08, 0.4))),
    at('读的时候处理', chain(g11mag().opacity(1, 0.5), g11mag().scale(1.1, 0.5))),
  );

  say('选模型，先问三问');
  yield* beat('b12',
    all(g11().opacity(0, 0.5), g12().opacity(1, 0.5)),
    at('三个问题', chain(g12q1().opacity(1, 0.4), g12q2().opacity(1, 0.4), g12q3().opacity(1, 0.4))),
  );

  say('数据是文档式，还是连着的？');
  yield* beat('b13',
    at('第一问', g13q().opacity(1, 0.5)),
    at('还是互相连着的', g13q().scale(1.05, 0.4)),
    at('文档式选文档库', g13a1().opacity(1, 0.5)),
    at('越连越多选图库', g13a2().opacity(1, 0.5)),
  );

  say('要不要连表查？');
  yield* beat('b14',
    at('第二问', g14q().opacity(1, 0.5)),
    at('经常要连', g14a1().opacity(1, 0.5)),
    at('很少连', g14a2().opacity(1, 0.5)),
  );

  say('数据会不会越连越多？');
  yield* beat('b15',
    at('第三问', g15q().opacity(1, 0.5)),
    at('越连越多', g15a1().opacity(1, 0.5)),
    at('长出新关系', chain(g15a2().opacity(1, 0.5), g15grow().opacity(1, 0.5))),
    at('图最能跟着长', g15grow().scale(1.2, 0.5)),
  );
});
