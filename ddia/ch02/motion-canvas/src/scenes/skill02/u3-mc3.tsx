// U3 场景 3（MC）：b19–b25 —— 推荐与换照片、多对多（两个虚线框共用实体）、
// 框内文档框外引用、回扣、想一想、下一站预告。
// 分镜：skill-ch02/beats-u3.md U3 一节；原文：DDIA §2.4（书页 p33–35，PDF p55–57）。
// 时长全部来自 timeline/u3.json（beat() 驱动），不手写 waitFor。
// 颜色、字号、安全区一律取自 lib/theme，不手写十六进制色值。
import {Circle, Line, Node, Polygon, Rect, Spline, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, chain, createRef} from '@motion-canvas/core';
import {at, makeBeats} from '../../lib/beats';
import {FONT, SAFE, SIZE, T} from '../../lib/theme';
import timeline from '../../timeline/u3.json';

export default makeScene2D(function* (view) {
  view.fill(T.bg);
  const beat = makeBeats(timeline);

  const header = createRef<Txt>();
  const anchor = createRef<Txt>();
  const say = (text: string) => anchor().text(text);

  const g19 = createRef<Node>();
  const g19rec = createRef<Rect>();
  const g19photo = createRef<Rect>();
  const g19name = createRef<Txt>();
  const g20 = createRef<Node>();
  const g20author = createRef<Rect>();
  const g20recs = [0, 1].map(() => createRef<Rect>());
  const g20old = createRef<Txt>();
  const g20new = createRef<Txt>();
  const g20thumbsOld = [0, 1].map(() => createRef<Txt>());
  const g20thumbsNew = [0, 1].map(() => createRef<Txt>());
  const g20arrow = createRef<Line>();
  const g21 = createRef<Node>();
  const g21left = createRef<Node>();
  const g21mid = createRef<Node>();
  const g21right = createRef<Node>();
  const g21arrows = createRef<Node>();
  const g22 = createRef<Node>();
  const g22docL = createRef<Rect>();
  const g22docR = createRef<Rect>();
  const g22refs = createRef<Node>();
  const g22join = createRef<Txt>();
  const g23 = createRef<Node>();
  const g23hl1 = createRef<Rect>();
  const g23hl2 = createRef<Rect>();
  const g23p1 = createRef<Txt>();
  const g23p2 = createRef<Txt>();
  const g24 = createRef<Node>();
  const g24q = createRef<Txt>();
  const g24right = createRef<Rect>();
  const g25 = createRef<Node>();
  const g25mark = createRef<Node>();
  const g25tree = createRef<Node>();

  // Figure 2-4 的引用连线（左框 → 中间实体，右框 → 中间实体，用户之间）
  const refArrows: [number, number, number, number][] = [
    [-310, -227, -32, -230], // 左 job 1 → org 1（从 job 1 顶边出发，避开 job_title 标签）
    [-272, -125, -32, -70], // 左 job 2 → org 3（从 job 2 右边出发）
    [-274, -45, -30, 30], // 左 edu 1 → school 1
    [-274, 45, -30, 110], // 左 edu 2 → school 2
    [310, -227, 32, -150], // 右 job 1 → org 2（从 job 1 顶边出发，避开 job_title 标签）
    [272, -125, 32, -70], // 右 job 2 → org 3（从 job 2 左边出发）
    [274, -45, 30, 30], // 右 edu 1 → school 1
    [274, 45, 30, 190], // 右 edu 2 → school 3
  ];

  view.add(
    <>
      <Txt
        ref={header}
        position={[-SAFE.halfW, -SAFE.halfH]}
        offset={[-1, -1]}
        fontSize={SIZE.label}
        fill={T.muted}
        fontFamily={FONT.sans}
        text={'名字还是编号'}
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

      {/* b19：推荐卡 */}
      <Node ref={g19} opacity={0}>
        <Rect position={[-320, -40]} width={420} height={380} radius={20} fill={T.card} stroke={T.line} lineWidth={2}>
          <Txt position={[0, -120]} fontSize={SIZE.title} fontWeight={700} fill={T.white} fontFamily={FONT.serif} text={'Bill Gates'} />
          <Txt position={[0, -60]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.mono} text={'user_id 251'} />
          <Txt position={[0, 20]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'简历'} />
        </Rect>
        <Rect ref={g19rec} position={[300, -40]} width={380} height={260} radius={18} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Rect ref={g19photo} position={[-120, -60]} width={80} height={80} radius={10} fill={T.line} stroke={T.line} lineWidth={2} />
          <Txt position={[-120, -60]} fontSize={SIZE.label} fill={T.bg} fontFamily={FONT.sans} text={'照片'} />
          <Txt ref={g19name} position={[40, -80]} fontSize={SIZE.label} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'推荐人 user 467'} opacity={0} />
          <Txt position={[40, -20]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'写了一段推荐'} />
        </Rect>
      </Node>

      {/* b20：换照片，推荐跟着变 */}
      <Node ref={g20} opacity={0}>
        <Rect ref={g20author} position={[0, -190]} width={340} height={110} radius={16} fill={T.card} stroke={T.blue} lineWidth={2}>
          <Rect position={[-110, 0]} width={70} height={70} radius={10} fill={T.line} />
          <Txt ref={g20old} position={[-110, 0]} fontSize={SIZE.label} fill={T.bg} fontFamily={FONT.sans} text={'旧照片'} />
          <Txt ref={g20new} position={[-110, 0]} fontSize={SIZE.label} fill={T.bg} fontFamily={FONT.sans} text={'新照片'} opacity={0} />
          <Txt position={[50, 0]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'user 467'} />
        </Rect>
        {[0, 1].map(i => (
          <Node key={`g20r-${i}`}>
            <Rect ref={g20recs[i]} position={[-280 + i * 560, 60]} width={380} height={130} radius={14} fill={T.card} stroke={T.line} lineWidth={2} />
            <Rect position={[-420 + i * 560, 60]} width={56} height={56} radius={8} fill={T.line} />
            <Txt ref={g20thumbsOld[i]} position={[-420 + i * 560, 60]} fontSize={SIZE.min} fill={T.bg} fontFamily={FONT.sans} text={'旧'} />
            <Txt ref={g20thumbsNew[i]} position={[-420 + i * 560, 60]} fontSize={SIZE.min} fill={T.bg} fontFamily={FONT.sans} text={'新'} opacity={0} />
            <Txt position={[-290 + i * 560, 60]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'推荐'} />
          </Node>
        ))}
        <Line ref={g20arrow} points={[[0, -135], [0, -135]]} stroke={T.yellow} lineWidth={2} endArrow opacity={0} />
      </Node>

      {/* b21：两个虚线框共用中间实体（按原图结构） */}
      <Node ref={g21} opacity={0}>
        <Rect position={[-360, -20]} width={380} height={440} radius={8} fill={T.bg} stroke={T.muted} lineWidth={2} lineDash={[8, 6]} />
        <Rect position={[360, -20]} width={380} height={440} radius={8} fill={T.bg} stroke={T.muted} lineWidth={2} lineDash={[8, 6]} />
        <Node ref={g21left} opacity={0}>
          <Circle position={[-500, -20]} width={52} height={52} fill={T.card} stroke={T.blue} lineWidth={2} />
          <Txt position={[-540, -20]} rotation={-90} fontSize={SIZE.min} fill={T.muted} fontFamily={FONT.mono} text={'user 251'} />
          <Line points={[[-470, -35], [-490, -170]]} stroke={T.line} lineWidth={2} />
          <Line points={[[-470, -20], [-490, -35]]} stroke={T.line} lineWidth={2} />
          <Line points={[[-490, 5], [-490, 113]]} stroke={T.line} lineWidth={2} />
          <Rect position={[-430, -175]} width={120} height={44} radius={8} fill={T.card} stroke={T.blue} lineWidth={2}>
            <Txt fontSize={SIZE.min} fill={T.text} fontFamily={FONT.mono} text={'positions'} />
          </Rect>
          <Rect position={[-310, -205]} width={76} height={44} radius={8} fill={T.card} stroke={T.blue} lineWidth={2}>
            <Txt fontSize={SIZE.min} fill={T.text} fontFamily={FONT.mono} text={'job 1'} />
          </Rect>
          <Rect position={[-310, -125]} width={76} height={44} radius={8} fill={T.card} stroke={T.blue} lineWidth={2}>
            <Txt fontSize={SIZE.min} fill={T.text} fontFamily={FONT.mono} text={'job 2'} />
          </Rect>
          <Txt position={[-310, -168]} fontSize={SIZE.min} fill={T.muted} fontFamily={FONT.mono} text={'job_title'} />
          <Txt position={[-310, -88]} fontSize={SIZE.min} fill={T.muted} fontFamily={FONT.mono} text={'job_title'} />
          <Line points={[[-370, -185], [-348, -205]]} stroke={T.line} lineWidth={2} endArrow />
          <Line points={[[-370, -165], [-348, -125]]} stroke={T.line} lineWidth={2} endArrow />
          <Rect position={[-430, -35]} width={120} height={44} radius={8} fill={T.card} stroke={T.blue} lineWidth={2}>
            <Txt fontSize={SIZE.min} fill={T.text} fontFamily={FONT.mono} text={'education'} />
          </Rect>
          <Polygon position={[-300, -45]} sides={3} radius={26} fill={T.card} stroke={T.blue} lineWidth={2} />
          <Polygon position={[-300, 45]} sides={3} radius={26} fill={T.card} stroke={T.blue} lineWidth={2} />
          <Txt position={[-300, -8]} fontSize={SIZE.min} fill={T.muted} fontFamily={FONT.mono} text={'edu 1'} />
          <Txt position={[-300, 82]} fontSize={SIZE.min} fill={T.muted} fontFamily={FONT.mono} text={'edu 2'} />
          <Line points={[[-370, -35], [-326, -45]]} stroke={T.line} lineWidth={2} endArrow />
          <Line points={[[-370, -35], [-326, 45]]} stroke={T.line} lineWidth={2} endArrow />
          <Rect position={[-425, 135]} width={180} height={44} radius={8} fill={T.card} stroke={T.blue} lineWidth={2}>
            <Txt fontSize={SIZE.min} fill={T.text} fontFamily={FONT.mono} text={'recommendations'} />
          </Rect>
          <Circle position={[-300, 140]} width={44} height={44} fill={T.card} stroke={T.blue} lineWidth={2} />
          <Txt position={[-300, 182]} fontSize={SIZE.min} fill={T.muted} fontFamily={FONT.mono} text={'rec 1'} />
          <Line points={[[-335, 135], [-322, 140]]} stroke={T.line} lineWidth={2} endArrow />
        </Node>
        <Node ref={g21mid} opacity={0}>
          <Rect position={[0, -230]} width={64} height={64} radius={8} fill={T.card} stroke={T.green} lineWidth={2}>
            <Txt fontSize={SIZE.min} fill={T.text} fontFamily={FONT.mono} text={'org 1'} />
          </Rect>
          <Rect position={[0, -150]} width={64} height={64} radius={8} fill={T.card} stroke={T.green} lineWidth={2}>
            <Txt fontSize={SIZE.min} fill={T.text} fontFamily={FONT.mono} text={'org 2'} />
          </Rect>
          <Rect position={[0, -70]} width={64} height={64} radius={8} fill={T.card} stroke={T.green} lineWidth={2}>
            <Txt fontSize={SIZE.min} fill={T.text} fontFamily={FONT.mono} text={'org 3'} />
          </Rect>
          <Polygon position={[0, 30]} sides={3} radius={28} fill={T.card} stroke={T.green} lineWidth={2} />
          <Txt position={[0, 62]} fontSize={SIZE.min} fill={T.text} fontFamily={FONT.mono} text={'school 1'} />
          <Polygon position={[0, 110]} sides={3} radius={28} fill={T.card} stroke={T.green} lineWidth={2} />
          <Txt position={[0, 142]} fontSize={SIZE.min} fill={T.text} fontFamily={FONT.mono} text={'school 2'} />
          <Polygon position={[0, 190]} sides={3} radius={28} fill={T.card} stroke={T.green} lineWidth={2} />
          <Txt position={[0, 222]} fontSize={SIZE.min} fill={T.text} fontFamily={FONT.mono} text={'school 3'} />
        </Node>
        <Node ref={g21right} opacity={0}>
          <Circle position={[500, -20]} width={52} height={52} fill={T.card} stroke={T.blue} lineWidth={2} />
          <Txt position={[540, -20]} rotation={-90} fontSize={SIZE.min} fill={T.muted} fontFamily={FONT.mono} text={'user 467'} />
          <Line points={[[470, -35], [490, -170]]} stroke={T.line} lineWidth={2} />
          <Line points={[[470, -20], [490, -35]]} stroke={T.line} lineWidth={2} />
          <Rect position={[430, -175]} width={120} height={44} radius={8} fill={T.card} stroke={T.blue} lineWidth={2}>
            <Txt fontSize={SIZE.min} fill={T.text} fontFamily={FONT.mono} text={'positions'} />
          </Rect>
          <Rect position={[310, -205]} width={76} height={44} radius={8} fill={T.card} stroke={T.blue} lineWidth={2}>
            <Txt fontSize={SIZE.min} fill={T.text} fontFamily={FONT.mono} text={'job 1'} />
          </Rect>
          <Rect position={[310, -125]} width={76} height={44} radius={8} fill={T.card} stroke={T.blue} lineWidth={2}>
            <Txt fontSize={SIZE.min} fill={T.text} fontFamily={FONT.mono} text={'job 2'} />
          </Rect>
          <Txt position={[310, -168]} fontSize={SIZE.min} fill={T.muted} fontFamily={FONT.mono} text={'job_title'} />
          <Txt position={[310, -88]} fontSize={SIZE.min} fill={T.muted} fontFamily={FONT.mono} text={'job_title'} />
          <Line points={[[370, -185], [348, -205]]} stroke={T.line} lineWidth={2} endArrow />
          <Line points={[[370, -165], [348, -125]]} stroke={T.line} lineWidth={2} endArrow />
          <Rect position={[430, -35]} width={120} height={44} radius={8} fill={T.card} stroke={T.blue} lineWidth={2}>
            <Txt fontSize={SIZE.min} fill={T.text} fontFamily={FONT.mono} text={'education'} />
          </Rect>
          <Polygon position={[300, -45]} sides={3} radius={26} fill={T.card} stroke={T.blue} lineWidth={2} />
          <Polygon position={[300, 45]} sides={3} radius={26} fill={T.card} stroke={T.blue} lineWidth={2} />
          <Txt position={[300, -8]} fontSize={SIZE.min} fill={T.muted} fontFamily={FONT.mono} text={'edu 1'} />
          <Txt position={[300, 82]} fontSize={SIZE.min} fill={T.muted} fontFamily={FONT.mono} text={'edu 2'} />
          <Line points={[[370, -35], [326, -45]]} stroke={T.line} lineWidth={2} endArrow />
          <Line points={[[370, -35], [326, 45]]} stroke={T.line} lineWidth={2} endArrow />
        </Node>
        <Node ref={g21arrows} opacity={0}>
          {refArrows.map(([x1, y1, x2, y2], i) => (
            <Line key={`g21a-${i}`} points={[[x1, y1], [x2, y2]]} stroke={T.yellow} lineWidth={2} endArrow />
          ))}
          <Spline points={[[-300, 162], [0, 250], [350, 210], [480, 120], [500, 10]]} stroke={T.yellow} lineWidth={2} endArrow />
        </Node>
      </Node>

      {/* b22：框内是文档，框外是引用 */}
      <Node ref={g22} opacity={0}>
        <Rect ref={g22docL} position={[-300, -60]} width={360} height={220} radius={16} fill={T.card} stroke={T.blue} lineWidth={2}>
          <Txt position={[0, -50]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'文档 · user 251'} />
          <Txt position={[0, 20]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'工作 · 教育 · 推荐'} />
        </Rect>
        <Rect ref={g22docR} position={[300, -60]} width={360} height={220} radius={16} fill={T.card} stroke={T.blue} lineWidth={2}>
          <Txt position={[0, -50]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'文档 · user 467'} />
          <Txt position={[0, 20]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'工作 · 教育'} />
        </Rect>
        <Node ref={g22refs} opacity={0}>
          <Line points={[[-120, -60], [-40, -60]]} stroke={T.yellow} lineWidth={2} endArrow />
          <Line points={[[120, -60], [40, -60]]} stroke={T.yellow} lineWidth={2} endArrow />
          <Rect position={[0, -60]} width={80} height={80} radius={10} fill={T.card} stroke={T.green} lineWidth={2}>
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'实体'} />
          </Rect>
        </Node>
        <Txt ref={g22join} position={[0, 180]} fontSize={SIZE.title} fontWeight={700} fill={T.yellow} fontFamily={FONT.mono} text={'join'} opacity={0} />
      </Node>

      {/* b23：回扣 */}
      <Node ref={g23} opacity={0}>
        <Txt position={[0, -140]} fontSize={SIZE.title} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'地名存文字还是存编号？'} />
        <Rect ref={g23hl1} position={[0, -20]} width={520} height={70} radius={12} fill={T.card} opacity={0} />
        <Rect ref={g23hl2} position={[0, 50]} width={520} height={70} radius={12} fill={T.card} opacity={0} />
        <Txt ref={g23p1} position={[0, -20]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'多对一，用编号'} />
        <Txt ref={g23p2} position={[0, 50]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'多对多，要引用'} />
      </Node>

      {/* b24：想一想 */}
      <Node ref={g24} opacity={0}>
        <Rect position={[-300, -60]} width={360} height={200} radius={16} fill={T.card} stroke={T.green} lineWidth={2}>
          <Txt position={[0, -40]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'只存一处'} />
          <Txt position={[0, 30]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'一个编号'} />
        </Rect>
        <Rect ref={g24right} position={[300, -60]} width={360} height={200} radius={16} fill={T.card} stroke={T.red} lineWidth={2}>
          <Txt position={[0, -40]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'处处复制'} />
          <Txt position={[0, 30]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'十份档案都有'} />
        </Rect>
        <Txt ref={g24q} position={[0, -220]} scale={0.3} fontSize={72} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'?'} opacity={0} />
      </Node>

      {/* b25：下一站，1970 年代 */}
      <Node ref={g25} opacity={0}>
        <Line points={[[-500, 0], [500, 0]]} stroke={T.line} lineWidth={4} />
        <Node ref={g25mark} opacity={0}>
          <Circle position={[-300, 0]} width={24} height={24} fill={T.yellow} />
          <Txt position={[-300, 60]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'1970 年代'} />
        </Node>
        <Node ref={g25tree} opacity={0}>
          <Rect position={[-300, -160]} width={120} height={60} radius={10} fill={T.card} stroke={T.blue} lineWidth={2}>
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'层次树'} />
          </Rect>
          <Line points={[[-330, -130], [-380, -80]]} stroke={T.blue} lineWidth={2} />
          <Line points={[[-270, -130], [-220, -80]]} stroke={T.blue} lineWidth={2} />
          <Rect position={[-380, -60]} width={100} height={50} radius={8} fill={T.card} stroke={T.blue} lineWidth={2} />
          <Rect position={[-220, -60]} width={100} height={50} radius={8} fill={T.card} stroke={T.blue} lineWidth={2} />
        </Node>
        <Txt position={[300, 60]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'今天'} />
      </Node>
    </>
  );

  say('推荐带着名字和照片');
  yield* beat('b19',
    all(g19().opacity(1, 0.5)),
    at('一个人给另一个人写推荐', g19rec().opacity(1, 0.5)),
    at('推荐显示在对方的简历上', chain(g19rec().scale(1.04, 0.35), g19rec().scale(1, 0.35))),
    at('带着推荐人的名字和照片', all(g19name().opacity(1, 0.4), g19photo().stroke(T.yellow, 0.4))),
  );

  say('换照片，推荐跟着变');
  yield* beat('b20',
    all(g19().opacity(0, 0.5), g20().opacity(1, 0.5)),
    at('换了照片', all(g20old().opacity(0, 0.4), g20new().opacity(1, 0.4), ...g20thumbsOld.map(t => t().opacity(0, 0.4)), ...g20thumbsNew.map(t => t().opacity(1, 0.4)), chain(g20author().scale(1.05, 0.35), g20author().scale(1, 0.35)))),
    at('跟着变', all(...g20recs.map(r => chain(r().scale(1.04, 0.35), r().scale(1, 0.35))))),
    at('引用作者的档案', all(g20arrow().opacity(1, 0.2), g20arrow().points([[0, -135], [0, -5]], 0.8))),
  );

  say('两个档案框，共用实体');
  yield* beat('b21',
    all(g20().opacity(0, 0.5), g21().opacity(1, 0.5)),
    at('多对多', chain(g21left().opacity(1, 0.5), g21right().opacity(1, 0.5), g21mid().opacity(1, 0.5))),
    at('共用中间的公司和学校', g21arrows().opacity(1, 0.6)),
  );

  say('框内是文档，框外是引用');
  yield* beat('b22',
    all(g21().opacity(0, 0.5), g22().opacity(1, 0.5)),
    at('归进一个文档', all(chain(g22docL().scale(1.03, 0.35), g22docL().scale(1, 0.35)), chain(g22docR().scale(1.03, 0.35), g22docR().scale(1, 0.35)))),
    at('必须表示为引用', g22refs().opacity(1, 0.5)),
    at('需要 join', g22join().opacity(1, 0.5)),
  );

  say('多对一用编号，多对多要引用');
  yield* beat('b23',
    all(g22().opacity(0, 0.5), g23().opacity(1, 0.5)),
    at('多对一，用编号', all(g23p1().fill(T.green, 0.4), g23hl1().opacity(0.9, 0.4))),
    at('多对多，要引用', all(g23p2().fill(T.green, 0.4), g23hl2().opacity(0.9, 0.4))),
  );

  say('哪个名字被复制得到处都是？');
  yield* beat('b24',
    all(g23().opacity(0, 0.5), g24().opacity(1, 0.5)),
    at('想一想', all(g24q().opacity(1, 0.3), g24q().scale(1, 0.4))),
    at('被复制得到处都是', all(g24right().stroke(T.red, 0.4), chain(g24right().scale(1.04, 0.35), g24right().scale(1, 0.35)))),
  );

  say('下一站：历史重演');
  yield* beat('b25',
    all(g24().opacity(0, 0.5), g25().opacity(1, 0.5)),
    at('历史重演', g25mark().opacity(1, 0.5)),
    at('1970 年代', g25tree().opacity(1, 0.5)),
  );
});
