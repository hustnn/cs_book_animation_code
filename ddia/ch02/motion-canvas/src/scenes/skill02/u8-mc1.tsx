// U8 场景 1（MC）：b1–b8 —— 钩子、多对多 vs 一对多、点与线、三种图、
// 图算法、异构图、边的种类。
// 分镜：skill-ch02/beats-u8.md U8 一节；原文：DDIA §2.10（书页 p49–50，PDF p71–72）。
// 时长全部来自 timeline/u8.json（beat() 驱动），不手写 waitFor。
// 颜色、字号、安全区一律取自 lib/theme，不手写十六进制色值。
import {Circle, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, chain, createRef} from '@motion-canvas/core';
import {at, makeBeats} from '../../lib/beats';
import {FONT, SAFE, SIZE, T} from '../../lib/theme';
import timeline from '../../timeline/u8.json';

export default makeScene2D(function* (view) {
  view.fill(T.bg);
  const beat = makeBeats(timeline);

  const header = createRef<Txt>();
  const anchor = createRef<Txt>();
  const say = (text: string) => anchor().text(text);

  const g1 = createRef<Node>();
  const g1a = createRef<Rect>();
  const g1b = createRef<Rect>();
  const g1c = createRef<Rect>();
  const g1q = createRef<Txt>();
  const g2 = createRef<Node>();
  const g2tree = createRef<Node>();
  const g2root = createRef<Rect>();
  const g2kids = [0, 1, 2].map(() => createRef<Node>());
  const g2solo = createRef<Rect>();
  const g2solotag = createRef<Txt>();
  const g2tag = createRef<Txt>();
  const g2treetag = createRef<Txt>();
  const g2doc = createRef<Txt>();
  const g3 = createRef<Node>();
  const g3nodes = [0, 1, 2, 3, 4, 5].map(() => createRef<Circle>());
  const g3lines = [0, 1, 2, 3, 4, 5, 6, 7].map(() => createRef<Line>());
  const g3tag = createRef<Txt>();
  const g4 = createRef<Node>();
  const g4v1 = createRef<Circle>();
  const g4v2 = createRef<Circle>();
  const g4e = createRef<Line>();
  const g4lv = createRef<Txt>();
  const g4le = createRef<Txt>();
  const g5 = createRef<Node>();
  const g5soc = createRef<Node>();
  const g5web = createRef<Node>();
  const g5road = createRef<Node>();
  const g5socDots = [0, 1, 2].map(() => createRef<Circle>());
  const g5socLines = [0, 1].map(() => createRef<Line>());
  const g5webDots = [0, 1, 2].map(() => createRef<Rect>());
  const g5webLines = [0, 1].map(() => createRef<Line>());
  const g5roadDots = [0, 1, 2].map(() => createRef<Circle>());
  const g5roadLines = [0, 1].map(() => createRef<Line>());
  const g5rank = createRef<Txt>();
  const g5path = createRef<Line>();
  const g6 = createRef<Node>();
  const g7 = createRef<Node>();
  const g7dots = [0, 1, 2, 3, 4].map(() => createRef<Node>());
  const g7lab = createRef<Txt>();
  const g8 = createRef<Node>();
  const g8p2 = createRef<Circle>();
  const g8p2lab = createRef<Txt>();
  const g8lines = [0, 1, 2, 3].map(() => createRef<Line>());
  const g8labs = [0, 1, 2, 3].map(() => createRef<Txt>());

  view.add(
    <>
      <Txt
        ref={header}
        position={[-SAFE.halfW, -SAFE.halfH]}
        offset={[-1, -1]}
        fontSize={SIZE.label}
        fill={T.muted}
        fontFamily={FONT.sans}
        text={'数据是图'}
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

      {/* b1：人、地点、事件三张卡叠在一起 */}
      <Node ref={g1} opacity={0}>
        <Rect ref={g1a} position={[-380, -40]} width={300} height={200} radius={16} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.title} fill={T.text} fontFamily={FONT.sans} text={'人'} />
        </Rect>
        <Rect ref={g1b} position={[0, -40]} width={300} height={200} radius={16} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.title} fill={T.text} fontFamily={FONT.sans} text={'地点'} />
        </Rect>
        <Rect ref={g1c} position={[380, -40]} width={300} height={200} radius={16} fill={T.card} stroke={T.purple} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.title} fill={T.text} fontFamily={FONT.sans} text={'事件'} />
        </Rect>
        <Txt ref={g1q} position={[0, 150]} fontSize={72} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'?'} opacity={0} />
      </Node>

      {/* b2：一对多树 vs 孤立记录 */}
      <Node ref={g2} opacity={0}>
        <Node ref={g2tree}>
          <Rect ref={g2root} position={[-350, -180]} width={240} height={80} radius={12} fill={T.card} stroke={T.blue} lineWidth={2}>
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'一条记录'} />
          </Rect>
          {[0, 1, 2].map(i => (
            <Node key={`g2k-${i}`} ref={g2kids[i]} opacity={0}>
              <Line points={[[-350, -140], [-470 + i * 120, -80]]} stroke={T.line} lineWidth={2} />
              <Rect position={[-470 + i * 120, -30]} width={110} height={70} radius={10} fill={T.card} stroke={T.blue} lineWidth={2}>
                <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'子记录'} />
              </Rect>
            </Node>
          ))}
          <Txt ref={g2treetag} position={[-350, 80]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'一对多，像棵树'} opacity={0} />
        </Node>
        <Rect ref={g2solo} position={[350, -100]} width={280} height={100} radius={12} fill={T.card} stroke={T.line} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'一条记录'} />
        </Rect>
        <Txt ref={g2solotag} position={[350, 0]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'记录之间没什么关系'} opacity={0} />
        <Txt ref={g2tag} position={[0, -260]} fontSize={SIZE.title} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'多对多关系'} opacity={0} />
        <Txt ref={g2doc} position={[0, 200]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} text={'文档模型就够用了'} opacity={0} />
      </Node>

      {/* b3：连线缠成一张网（节点：(-400,-160) (-220,60) (0,-160) (400,60) (-200,140) (200,140)；线先画、节点盖在线上） */}
      <Node ref={g3} opacity={0}>
        <Line ref={g3lines[0]} points={[[-400, -160], [-220, 60]]} stroke={T.line} lineWidth={2} opacity={0} />
        <Line ref={g3lines[1]} points={[[0, -160], [400, 60]]} stroke={T.line} lineWidth={2} opacity={0} />
        <Line ref={g3lines[2]} points={[[-400, -160], [400, 60]]} stroke={T.line} lineWidth={2} opacity={0} />
        <Line ref={g3lines[3]} points={[[0, -160], [-200, 140]]} stroke={T.line} lineWidth={2} opacity={0} />
        <Line ref={g3lines[4]} points={[[-200, 140], [200, 140]]} stroke={T.line} lineWidth={2} opacity={0} />
        <Line ref={g3lines[5]} points={[[400, 60], [-200, 140]]} stroke={T.line} lineWidth={2} opacity={0} />
        <Line ref={g3lines[6]} points={[[-220, 60], [200, 140]]} stroke={T.line} lineWidth={2} opacity={0} />
        <Line ref={g3lines[7]} points={[[0, -160], [200, 140]]} stroke={T.line} lineWidth={2} opacity={0} />
        {[0, 1, 2, 3, 4, 5].map(i => (
          <Circle key={`g3n-${i}`} ref={g3nodes[i]} position={[[-400, -220, 0, 400, -200, 200][i], [-160, 60, -160, 60, 140, 140][i]]} width={56} height={56} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0} />
        ))}
        <Txt ref={g3tag} position={[0, 220]} fontSize={SIZE.title} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'联系一复杂，就画成图'} opacity={0} />
      </Node>

      {/* b4：点与线 */}
      <Node ref={g4} opacity={0}>
        <Circle ref={g4v1} position={[-280, -40]} width={90} height={90} fill={T.card} stroke={T.blue} lineWidth={3} opacity={0} />
        <Circle ref={g4v2} position={[280, -40]} width={90} height={90} fill={T.card} stroke={T.blue} lineWidth={3} opacity={0} />
        <Line ref={g4e} points={[[-235, -40], [235, -40]]} stroke={T.yellow} lineWidth={3} endArrow opacity={0} />
        <Txt ref={g4lv} position={[-280, 80]} fontSize={SIZE.title} fontWeight={700} fill={T.blue} fontFamily={FONT.sans} text={'顶点'} opacity={0} />
        <Txt ref={g4le} position={[280, 80]} fontSize={SIZE.title} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'边'} opacity={0} />
      </Node>

      {/* b5a/b5b/b6：三种图并排（线先画、节点盖在线上；点线初始透明，随词点出现） */}
      <Node ref={g5} opacity={0}>
        <Node ref={g5soc} opacity={0}>
          <Line ref={g5socLines[0]} points={[[-520, -60], [-400, -60]]} stroke={T.line} lineWidth={2} opacity={0} />
          <Line ref={g5socLines[1]} points={[[-400, -60], [-280, -60]]} stroke={T.line} lineWidth={2} opacity={0} />
          {[0, 1, 2].map(i => (
            <Circle key={`g5s-${i}`} ref={g5socDots[i]} position={[-520 + i * 120, -60]} width={64} height={64} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0} />
          ))}
          <Txt position={[-400, 40]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'社交图'} />
        </Node>
        <Node ref={g5web} opacity={0}>
          <Line ref={g5webLines[0]} points={[[-120, -60], [0, -60]]} stroke={T.line} lineWidth={2} opacity={0} />
          <Line ref={g5webLines[1]} points={[[0, -60], [120, -60]]} stroke={T.line} lineWidth={2} opacity={0} />
          {[0, 1, 2].map(i => (
            <Rect key={`g5w-${i}`} ref={g5webDots[i]} position={[-120 + i * 120, -60]} width={80} height={64} radius={8} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
              <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'网页'} />
            </Rect>
          ))}
          <Txt position={[0, 40]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'网页图'} />
          <Txt ref={g5rank} position={[0, -160]} fontSize={SIZE.title} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'第 1 名'} opacity={0} />
        </Node>
        <Node ref={g5road} opacity={0}>
          <Line ref={g5roadLines[0]} points={[[280, -60], [400, -60]]} stroke={T.line} lineWidth={2} opacity={0} />
          <Line ref={g5roadLines[1]} points={[[400, -60], [520, -60]]} stroke={T.line} lineWidth={2} opacity={0} />
          {[0, 1, 2].map(i => (
            <Circle key={`g5r-${i}`} ref={g5roadDots[i]} position={[[280, 400, 520][i], -60]} width={56} height={56} fill={T.card} stroke={T.purple} lineWidth={2} opacity={0} />
          ))}
          <Line ref={g5path} points={[[280, -60], [400, -60], [520, -60]]} stroke={T.yellow} lineWidth={4} opacity={0} />
          <Txt position={[400, 40]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'路网'} />
        </Node>
      </Node>

      {/* b7：异构图，五种顶点混在一起 */}
      <Node ref={g7} opacity={0}>
        {[0, 1, 2, 3, 4].map(i => (
          <Node key={`g7d-${i}`} ref={g7dots[i]} opacity={0}>
            <Circle position={[[-420, -160, 0, 220, 420][i], [-80, -180, 60, -140, 80][i]]} width={90} height={90} fill={T.card} stroke={[T.blue, T.green, T.purple, T.yellow, T.red][i]} lineWidth={3} />
            <Txt position={[[-420, -160, 0, 220, 420][i], [20, -80, 160, -40, 180][i]]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={['人', '地点', '活动', '签到', '评论'][i]} />
          </Node>
        ))}
        <Txt ref={g7lab} position={[0, 220]} fontSize={SIZE.title} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'一张图，多种东西'} opacity={0} />
      </Node>

      {/* b8：边也五花八门（g7 的五个顶点留着，边连在它们身上；朋友边需要第二个人，b8 再补一枚人节点） */}
      <Node ref={g8} opacity={0}>
        <Circle ref={g8p2} position={[-300, 170]} width={90} height={90} fill={T.card} stroke={T.blue} lineWidth={3} opacity={0} />
        <Txt ref={g8p2lab} position={[-300, 240]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'人'} opacity={0} />
        <Line ref={g8lines[0]} points={[[-420, -80], [-300, 170]]} stroke={T.line} lineWidth={2} endArrow opacity={0} />
        <Line ref={g8lines[1]} points={[[220, -140], [-160, -180]]} stroke={T.line} lineWidth={2} endArrow opacity={0} />
        <Line ref={g8lines[2]} points={[[-420, -80], [420, 80]]} stroke={T.line} lineWidth={2} endArrow opacity={0} />
        <Line ref={g8lines[3]} points={[[-420, -80], [0, 60]]} stroke={T.line} lineWidth={2} endArrow opacity={0} />
        <Txt ref={g8labs[0]} position={[-400, 50]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'朋友'} opacity={0} />
        <Txt ref={g8labs[1]} position={[30, -210]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'签到在'} opacity={0} />
        <Txt ref={g8labs[2]} position={[30, -30]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'评论了'} opacity={0} />
        <Txt ref={g8labs[3]} position={[-310, -10]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'参加了'} opacity={0} />
      </Node>
    </>
  );

  say('人、地点、事件');
  yield* beat('b1',
    all(g1().opacity(1, 0.5)),
    at('人、地点、事件', chain(g1a().opacity(1, 0.4), g1b().opacity(1, 0.4), g1c().opacity(1, 0.4))),
    at('怎么放', g1q().opacity(1, 0.4)),
  );

  say('一对多像棵树');
  yield* beat('b2',
    all(g1().opacity(0, 0.5), g2().opacity(1, 0.5)),
    at('多对多关系', g2tag().opacity(1, 0.5)),
    at('像棵树', chain(g2kids[0]().opacity(1, 0.4), g2kids[1]().opacity(1, 0.4), g2kids[2]().opacity(1, 0.4), g2treetag().opacity(1, 0.4))),
    at('没什么关系', chain(g2solo().opacity(1, 0.5), g2solotag().opacity(1, 0.4))),
    at('文档模型', g2doc().opacity(1, 0.5)),
  );

  say('联系一复杂，就画成图');
  yield* beat('b3',
    all(g2().opacity(0, 0.5), g3().opacity(1, 0.5)),
    at('多对多关系到处都是', chain(g3nodes[0]().opacity(1, 0.3), g3nodes[1]().opacity(1, 0.3), g3nodes[2]().opacity(1, 0.3), g3nodes[3]().opacity(1, 0.3), g3nodes[4]().opacity(1, 0.3), g3nodes[5]().opacity(1, 0.3))),
    at('联系一复杂', chain(g3lines[0]().opacity(1, 0.3), g3lines[1]().opacity(1, 0.3), g3lines[2]().opacity(1, 0.3), g3lines[3]().opacity(1, 0.3), g3lines[4]().opacity(1, 0.3), g3lines[5]().opacity(1, 0.3), g3lines[6]().opacity(1, 0.3), g3lines[7]().opacity(1, 0.3))),
    at('画成一张图', g3tag().opacity(1, 0.5)),
  );

  say('点与线');
  yield* beat('b4',
    all(g3().opacity(0, 0.5), g4().opacity(1, 0.5)),
    at('顶点', chain(g4v1().opacity(1, 0.5), g4lv().opacity(1, 0.4))),
    at('边', chain(g4v2().opacity(1, 0.5), g4e().opacity(1, 0.5), g4le().opacity(1, 0.4))),
  );

  say('社交图');
  yield* beat('b5a',
    all(g4().opacity(0, 0.5), g5().opacity(1, 0.5), g5soc().opacity(1, 0.5)),
    at('人是节点', chain(g5socDots[0]().opacity(1, 0.3), g5socDots[1]().opacity(1, 0.3), g5socDots[2]().opacity(1, 0.3))),
    at('认识是边', chain(g5socLines[0]().opacity(1, 0.3), g5socLines[1]().opacity(1, 0.3))),
  );

  say('网页图、路网');
  yield* beat('b5b',
    all(g5web().opacity(1, 0.5)),
    at('网页图', chain(g5webDots[0]().opacity(1, 0.3), g5webDots[1]().opacity(1, 0.3), g5webDots[2]().opacity(1, 0.3))),
    at('链接是边', chain(g5webLines[0]().opacity(1, 0.3), g5webLines[1]().opacity(1, 0.3))),
    at('路网', g5road().opacity(1, 0.5)),
    at('道路是边', chain(g5roadDots[0]().opacity(1, 0.3), g5roadLines[0]().opacity(1, 0.3), g5roadDots[1]().opacity(1, 0.3), g5roadLines[1]().opacity(1, 0.3), g5roadDots[2]().opacity(1, 0.3))),
  );

  say('最短路径、PageRank');
  yield* beat('b6',
    at('导航', g5path().opacity(1, 0.8)),
    at('PageRank', chain(g5webDots[1]().scale(1.25, 0.5), g5rank().opacity(1, 0.5))),
    at('定搜索排名', g5rank().scale(1.15, 0.6)),
  );

  say('一张图，多种东西');
  yield* beat('b7',
    all(g5().opacity(0, 0.5), g7().opacity(1, 0.5)),
    at('人、地点、活动、签到、评论', chain(g7dots[0]().opacity(1, 0.4), g7dots[1]().opacity(1, 0.4), g7dots[2]().opacity(1, 0.4), g7dots[3]().opacity(1, 0.4), g7dots[4]().opacity(1, 0.4))),
    at('完全不同类型', g7lab().opacity(1, 0.5)),
  );

  say('边也五花八门');
  yield* beat('b8',
    all(g8().opacity(1, 0.5)),
    at('谁和谁是朋友', chain(g8p2().opacity(1, 0.4), g8p2lab().opacity(1, 0.4), g8lines[0]().opacity(1, 0.4), g8labs[0]().opacity(1, 0.4))),
    at('签到在哪个地点', chain(g8lines[1]().opacity(1, 0.4), g8labs[1]().opacity(1, 0.4))),
    at('评论了哪个帖子', chain(g8lines[2]().opacity(1, 0.4), g8labs[2]().opacity(1, 0.4))),
    at('参加了哪个活动', chain(g8lines[3]().opacity(1, 0.4), g8labs[3]().opacity(1, 0.4))),
  );
});
