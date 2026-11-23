// U12 场景 1（MC）：b1–b9 —— 钩子（三条路分叉，各亮一下）、
// 树 → 表 → 文档/图两条路、三种模型各守一块地、仿真别扭、为不同目的用不同系统。
// 分镜：skill-ch02/beats-u12.md U12 一节；原文：DDIA §2.16（书页 p63–64）。
// 三条路分叉图沿用 U0 的画法（数据卡在左，三张路卡在右：树绿 / 表蓝 / 文档·图紫），
// 本单元开头与结尾（mc3 b24）收束呼应。
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

  // —— b1：三条路分叉（沿用 U0 画法） ——
  const g1 = createRef<Node>();
  const g1q = createRef<Txt>();
  const g1hlTree = createRef<Rect>();
  const g1hlTable = createRef<Rect>();
  const g1hlDG = createRef<Rect>();
  // —— b2：树 ——
  const g2 = createRef<Node>();
  const g2root = createRef<Node>();
  const g2kids = [0, 1, 2].map(() => createRef<Node>());
  const g2leaves = [0, 1, 2].map(() => createRef<Node>());
  // —— b3：表 ——
  const g3 = createRef<Node>();
  const g3tag = createRef<Txt>();
  const g3rowsA = [0, 1, 2].map(() => createRef<Node>());
  const g3rowsB = [0, 1, 2].map(() => createRef<Node>());
  // —— b4：两条路 ——
  const g4 = createRef<Node>();
  const g4docLab = createRef<Txt>();
  const g4graphLab = createRef<Txt>();
  const g4docRects = [0, 1, 2].map(() => createRef<Rect>());
  const g4graphDots = [0, 1, 2, 3].map(() => createRef<Circle>());
  // —— b5：文档卡（Bill Gates 档案，user_id 251，与 U2 一致） ——
  const g5 = createRef<Node>();
  const g5card = createRef<Rect>();
  const g5uid = createRef<Txt>();
  // —— b6：图（Lucy / Alain，与 U8 一致：Lucy 生在 Idaho、住伦敦） ——
  const g6 = createRef<Node>();
  const g6lucy = createRef<Circle>();
  const g6alain = createRef<Circle>();
  const g6idaho = createRef<Circle>();
  const g6london = createRef<Circle>();
  const g6married = createRef<Line>();
  const g6born = createRef<Line>();
  const g6lives = createRef<Line>();
  const g6labMarried = createRef<Txt>();
  const g6labBorn = createRef<Txt>();
  const g6labLives = createRef<Txt>();
  // —— b7：三张卡各守一块地 ——
  const g7 = createRef<Node>();
  const g7barDoc = createRef<Rect>();
  const g7barRel = createRef<Rect>();
  const g7barGraph = createRef<Rect>();
  // —— b8：图塞进表里，别扭 ——
  const g8 = createRef<Node>();
  const g8table = createRef<Rect>();
  const g8mini = createRef<Node>();
  const g8line1 = createRef<Line>();
  const g8line2 = createRef<Line>();
  const g8free = createRef<Node>();
  // —— b9：结论 ——
  const g9 = createRef<Txt>();

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

      {/* b1：三条路分叉 */}
      <Node ref={g1} opacity={0}>
        <Rect position={[-440, -40]} width={220} height={120} radius={16} fill={T.card} stroke={T.blue} lineWidth={2}>
          <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'一份数据'} />
        </Rect>
        <Line points={[[-330, -40], [-160, -40]]} stroke={T.line} lineWidth={2} />
        <Line points={[[-160, -40], [110, -200]]} stroke={T.green} lineWidth={2} />
        <Line points={[[-160, -40], [110, -40]]} stroke={T.blue} lineWidth={2} />
        <Line points={[[-160, -40], [110, 120]]} stroke={T.purple} lineWidth={2} />
        <Node position={[300, -200]}>
          <Rect width={380} height={110} radius={14} fill={T.card} stroke={T.green} lineWidth={2} />
          <Txt position={[-155, 0]} fontSize={SIZE.title} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'树'} />
        </Node>
        <Node position={[300, -40]}>
          <Rect width={380} height={110} radius={14} fill={T.card} stroke={T.blue} lineWidth={2} />
          <Txt position={[-155, 0]} fontSize={SIZE.title} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'表'} />
        </Node>
        <Node position={[300, 120]}>
          <Rect width={380} height={110} radius={14} fill={T.card} stroke={T.purple} lineWidth={2} />
          <Txt position={[-120, 0]} fontSize={SIZE.label} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'文档 · 图'} />
        </Node>
        <Rect ref={g1hlTree} position={[300, -200]} width={380} height={110} radius={14} stroke={T.yellow} lineWidth={3} opacity={0} />
        <Rect ref={g1hlTable} position={[300, -40]} width={380} height={110} radius={14} stroke={T.yellow} lineWidth={3} opacity={0} />
        <Rect ref={g1hlDG} position={[300, 120]} width={380} height={110} radius={14} stroke={T.yellow} lineWidth={3} opacity={0} />
      </Node>
      <Txt ref={g1q} position={[-160, -130]} fontSize={72} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'?'} opacity={0} />

      {/* b2：一棵大树 */}
      <Node ref={g2} opacity={0}>
        <Node ref={g2root}>
          <Rect position={[0, -190]} width={220} height={70} radius={12} fill={T.card} stroke={T.green} lineWidth={2}>
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'根'} />
          </Rect>
          <Line points={[[0, -155], [-260, -60]]} stroke={T.green} lineWidth={2} />
          <Line points={[[0, -155], [0, -60]]} stroke={T.green} lineWidth={2} />
          <Line points={[[0, -155], [260, -60]]} stroke={T.green} lineWidth={2} />
        </Node>
        {[0, 1, 2].map(i => (
          <Node key={`g2k-${i}`} ref={g2kids[i]} opacity={0}>
            <Rect position={[[-260, 0, 260][i], -20]} width={180} height={64} radius={10} fill={T.card} stroke={T.green} lineWidth={2}>
              <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'子记录'} />
            </Rect>
          </Node>
        ))}
        {[0, 1, 2].map(i => (
          <Node key={`g2l-${i}`} ref={g2leaves[i]} opacity={0}>
            <Line points={[[-260 + i * 260, 12], [-300 + i * 260, 80]]} stroke={T.green} lineWidth={2} />
            <Line points={[[-260 + i * 260, 12], [-220 + i * 260, 80]]} stroke={T.green} lineWidth={2} />
            <Rect position={[-300 + i * 260, 110]} width={90} height={48} radius={8} fill={T.card} stroke={T.green} lineWidth={2} />
            <Rect position={[-220 + i * 260, 110]} width={90} height={48} radius={8} fill={T.card} stroke={T.green} lineWidth={2} />
          </Node>
        ))}
      </Node>

      {/* b3：摊成表 */}
      <Node ref={g3} opacity={0}>
        <Txt ref={g3tag} position={[0, -240]} fontSize={SIZE.title} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'多对多关系'} opacity={0} />
        <Rect position={[-280, -40]} width={480} height={260} radius={14} fill={T.card} stroke={T.blue} lineWidth={2} />
        <Rect position={[280, -40]} width={480} height={260} radius={14} fill={T.card} stroke={T.blue} lineWidth={2} />
        {[0, 1, 2].map(i => (
          <Node key={`g3a-${i}`} ref={g3rowsA[i]} opacity={0}>
            <Rect position={[-280, -120 + i * 80]} width={420} height={56} radius={8} fill={T.bg} stroke={T.blue} lineWidth={2} />
          </Node>
        ))}
        {[0, 1, 2].map(i => (
          <Node key={`g3b-${i}`} ref={g3rowsB[i]} opacity={0}>
            <Rect position={[280, -120 + i * 80]} width={420} height={56} radius={8} fill={T.bg} stroke={T.blue} lineWidth={2} />
          </Node>
        ))}
      </Node>

      {/* b4：分叉成两条路 */}
      <Node ref={g4} opacity={0}>
        <Node opacity={1}>
          <Rect ref={g4docRects[0]} position={[-300, -140]} width={260} height={90} radius={12} fill={T.card} stroke={T.purple} lineWidth={2}>
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'{ … }'} />
          </Rect>
          <Rect ref={g4docRects[1]} position={[-300, -40]} width={260} height={90} radius={12} fill={T.card} stroke={T.purple} lineWidth={2}>
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'{ … }'} />
          </Rect>
          <Rect ref={g4docRects[2]} position={[-300, 60]} width={260} height={90} radius={12} fill={T.card} stroke={T.purple} lineWidth={2}>
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'{ … }'} />
          </Rect>
          <Txt ref={g4docLab} position={[-300, 170]} fontSize={SIZE.title} fontWeight={700} fill={T.purple} fontFamily={FONT.sans} text={'文档库'} opacity={0} />
        </Node>
        <Node opacity={1}>
          <Circle ref={g4graphDots[0]} position={[300, -140]} width={70} height={70} fill={T.card} stroke={T.yellow} lineWidth={2} />
          <Circle ref={g4graphDots[1]} position={[180, -20]} width={70} height={70} fill={T.card} stroke={T.yellow} lineWidth={2} />
          <Circle ref={g4graphDots[2]} position={[420, -20]} width={70} height={70} fill={T.card} stroke={T.yellow} lineWidth={2} />
          <Circle ref={g4graphDots[3]} position={[300, 100]} width={70} height={70} fill={T.card} stroke={T.yellow} lineWidth={2} />
          <Line points={[[300, -140], [180, -20]]} stroke={T.line} lineWidth={2} />
          <Line points={[[300, -140], [420, -20]]} stroke={T.line} lineWidth={2} />
          <Line points={[[180, -20], [300, 100]]} stroke={T.line} lineWidth={2} />
          <Line points={[[420, -20], [300, 100]]} stroke={T.line} lineWidth={2} />
          <Txt ref={g4graphLab} position={[300, 170]} fontSize={SIZE.title} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'图库'} opacity={0} />
        </Node>
      </Node>

      {/* b5：文档卡放大（Bill Gates 档案） */}
      <Node ref={g5} opacity={0}>
        <Rect ref={g5card} position={[0, -40]} width={460} height={260} radius={16} fill={T.card} stroke={T.purple} lineWidth={3}>
          <Txt position={[0, -70]} fontSize={SIZE.title} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'Bill Gates'} />
          <Txt ref={g5uid} position={[0, 0]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.mono} text={'user_id 251'} />
          <Txt position={[0, 70]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.mono} text={'{ … }'} />
        </Rect>
      </Node>

      {/* b6：图卡放大（Lucy / Alain） */}
      <Node ref={g6} opacity={0}>
        <Circle ref={g6lucy} position={[-320, -120]} width={110} height={110} fill={T.card} stroke={T.yellow} lineWidth={3}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'Lucy'} />
        </Circle>
        <Circle ref={g6alain} position={[320, -120]} width={110} height={110} fill={T.card} stroke={T.yellow} lineWidth={3}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'Alain'} />
        </Circle>
        <Circle ref={g6idaho} position={[-320, 120]} width={110} height={110} fill={T.card} stroke={T.blue} lineWidth={3}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'Idaho'} />
        </Circle>
        <Circle ref={g6london} position={[320, 120]} width={110} height={110} fill={T.card} stroke={T.blue} lineWidth={3}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'伦敦'} />
        </Circle>
        <Line ref={g6married} points={[[-265, -120], [265, -120]]} stroke={T.line} lineWidth={2} opacity={0} />
        <Line ref={g6born} points={[[-320, -65], [-320, 65]]} stroke={T.line} lineWidth={2} endArrow opacity={0} />
        <Line ref={g6lives} points={[[-265, -95], [265, 95]]} stroke={T.line} lineWidth={2} endArrow opacity={0} />
        <Txt ref={g6labMarried} position={[0, -160]} fontSize={SIZE.min} fill={T.muted} fontFamily={FONT.mono} text={'married'} opacity={0} />
        <Txt ref={g6labBorn} position={[-390, 0]} fontSize={SIZE.min} fill={T.muted} fontFamily={FONT.mono} text={'born_in'} opacity={0} />
        <Txt ref={g6labLives} position={[120, 70]} fontSize={SIZE.min} fill={T.muted} fontFamily={FONT.mono} text={'lives_in'} opacity={0} />
      </Node>

      {/* b7：三种模型各守一块地 */}
      <Node ref={g7} opacity={0}>
        <Rect position={[-380, -40]} width={300} height={220} radius={16} fill={T.card} stroke={T.purple} lineWidth={2}>
          <Txt position={[0, -40]} fontSize={SIZE.title} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'文档'} />
          <Txt position={[0, 40]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.mono} text={'{ … }'} />
        </Rect>
        <Rect position={[0, -40]} width={300} height={220} radius={16} fill={T.card} stroke={T.blue} lineWidth={2}>
          <Txt position={[0, -40]} fontSize={SIZE.title} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'关系'} />
          <Txt position={[0, 40]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'表'} />
        </Rect>
        <Rect position={[380, -40]} width={300} height={220} radius={16} fill={T.card} stroke={T.yellow} lineWidth={2}>
          <Txt position={[0, -40]} fontSize={SIZE.title} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'图'} />
          <Txt position={[0, 40]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'点 · 线'} />
        </Rect>
        <Rect ref={g7barDoc} position={[-380, 110]} width={300} height={14} radius={7} fill={T.green} opacity={0} />
        <Rect ref={g7barRel} position={[0, 110]} width={300} height={14} radius={7} fill={T.green} opacity={0} />
        <Rect ref={g7barGraph} position={[380, 110]} width={300} height={14} radius={7} fill={T.green} opacity={0} />
      </Node>

      {/* b8：图塞进表里 */}
      <Node ref={g8} opacity={0}>
        <Rect ref={g8table} position={[0, -40]} width={720} height={300} radius={14} fill={T.card} stroke={T.blue} lineWidth={2} />
        <Node ref={g8mini} opacity={0}>
          <Circle position={[-220, -120]} width={80} height={80} fill={T.card} stroke={T.yellow} lineWidth={2} />
          <Circle position={[220, -120]} width={80} height={80} fill={T.card} stroke={T.yellow} lineWidth={2} />
          <Circle position={[0, 60]} width={80} height={80} fill={T.card} stroke={T.yellow} lineWidth={2} />
          <Line ref={g8line1} points={[[-220, -120], [-40, -40], [220, -120]]} stroke={T.line} lineWidth={2} opacity={0} />
          <Line ref={g8line2} points={[[-220, -120], [40, -20], [0, 60]]} stroke={T.line} lineWidth={2} opacity={0} />
        </Node>
        <Node ref={g8free} opacity={0}>
          <Circle position={[-320, -120]} width={90} height={90} fill={T.card} stroke={T.yellow} lineWidth={2} />
          <Circle position={[320, -120]} width={90} height={90} fill={T.card} stroke={T.yellow} lineWidth={2} />
          <Circle position={[0, 100]} width={90} height={90} fill={T.card} stroke={T.yellow} lineWidth={2} />
          <Line points={[[-320, -120], [320, -120]]} stroke={T.line} lineWidth={2} />
          <Line points={[[-320, -120], [0, 100]]} stroke={T.line} lineWidth={2} />
        </Node>
      </Node>

      {/* b9：结论句 */}
      <Txt ref={g9} position={[0, 200]} fontSize={SIZE.title} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'为不同目的，用不同系统'} opacity={0} />
    </>
  );

  say('没有银弹，怎么选？');
  yield* beat('b1',
    all(g1().opacity(1, 0.5)),
    at('包打天下', chain(g1hlTree().opacity(1, 0.35), g1hlTable().opacity(1, 0.35), g1hlDG().opacity(1, 0.35), all(g1hlTree().opacity(0, 0.3), g1hlTable().opacity(0, 0.3), g1hlDG().opacity(0, 0.3)))),
    at('怎么选', g1q().opacity(1, 0.4)),
  );

  say('一开始，是一棵树');
  yield* beat('b2',
    all(g1().opacity(0, 0.5), g1q().opacity(0, 0.5), g2().opacity(1, 0.5)),
    at('一棵大树', chain(g2root().opacity(1, 0.5), g2kids[0]().opacity(1, 0.4), g2kids[1]().opacity(1, 0.4), g2kids[2]().opacity(1, 0.4))),
    at('一层套一层', chain(g2leaves[0]().opacity(1, 0.4), g2leaves[1]().opacity(1, 0.4), g2leaves[2]().opacity(1, 0.4))),
  );

  say('树 → 表');
  yield* beat('b3',
    all(g2().opacity(0, 0.5), g3().opacity(1, 0.5)),
    at('多对多关系', g3tag().opacity(1, 0.5)),
    at('关系模型', chain(g3rowsA[0]().opacity(1, 0.3), g3rowsA[1]().opacity(1, 0.3), g3rowsA[2]().opacity(1, 0.3))),
    at('摊成一张张表', chain(g3rowsB[0]().opacity(1, 0.3), g3rowsB[1]().opacity(1, 0.3), g3rowsB[2]().opacity(1, 0.3))),
  );

  say('朝两个方向分化');
  yield* beat('b4',
    all(g3().opacity(0, 0.5), g4().opacity(1, 0.5)),
    at('不适合关系模型', chain(all(g4docRects[0]().lineWidth(4, 0.3), g4docRects[1]().lineWidth(4, 0.3), g4docRects[2]().lineWidth(4, 0.3)), all(g4docRects[0]().lineWidth(2, 0.3), g4docRects[1]().lineWidth(2, 0.3), g4docRects[2]().lineWidth(2, 0.3)))),
    at('非关系存储', chain(all(g4graphDots[0]().lineWidth(4, 0.3), g4graphDots[1]().lineWidth(4, 0.3), g4graphDots[2]().lineWidth(4, 0.3), g4graphDots[3]().lineWidth(4, 0.3)), all(g4graphDots[0]().lineWidth(2, 0.3), g4graphDots[1]().lineWidth(2, 0.3), g4graphDots[2]().lineWidth(2, 0.3), g4graphDots[3]().lineWidth(2, 0.3)))),
    at('两个方向分化', chain(g4docLab().opacity(1, 0.4), g4graphLab().opacity(1, 0.4))),
  );

  say('自包含文档');
  yield* beat('b5',
    all(g4().opacity(0, 0.5), g5().opacity(1, 0.5)),
    at('自包含的文档', g5card().scale(1.12, 0.6)),
    at('很少有关系', g5uid().fill(T.yellow, 0.4)),
  );

  say('什么都可能相关');
  yield* beat('b6',
    all(g5().opacity(0, 0.5), g6().opacity(1, 0.5)),
    at('任何东西都可能和一切相关', chain(g6married().opacity(1, 0.4), g6labMarried().opacity(1, 0.4), g6born().opacity(1, 0.4), g6labBorn().opacity(1, 0.4), g6lives().opacity(1, 0.4), g6labLives().opacity(1, 0.4))),
  );

  say('三种模型，各守一块地');
  yield* beat('b7',
    all(g6().opacity(0, 0.5), g7().opacity(1, 0.5)),
    at('各自在自己的地盘上', chain(g7barDoc().opacity(1, 0.4), g7barRel().opacity(1, 0.4), g7barGraph().opacity(1, 0.4))),
  );

  say('仿真得了，别扭');
  yield* beat('b8',
    all(g7().opacity(0, 0.5), g8().opacity(1, 0.5)),
    at('仿真另一种', g8mini().opacity(1, 0.5)),
    at('关系库里也能表示图数据', chain(g8line1().opacity(1, 0.4), g8line2().opacity(1, 0.4))),
    at('常常别扭', chain(g8table().stroke(T.red, 0.4), all(g8table().opacity(0, 0.5), g8mini().opacity(0, 0.5), g8free().opacity(1, 0.5)))),
  );

  say('为不同目的，用不同系统');
  yield* beat('b9',
    all(g8().opacity(0, 0.5), g7().opacity(1, 0.5)),
    at('为不同目的用不同系统', chain(g7barDoc().opacity(1, 0.4), g7barRel().opacity(1, 0.4), g7barGraph().opacity(1, 0.4), g9().opacity(1, 0.5))),
    at('放之四海而皆准', g9().scale(1.06, 0.5)),
  );
});
