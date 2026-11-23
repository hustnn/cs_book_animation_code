// U8 场景 4（MC）：b26–b33 —— 多标签、地区结构对比、国家套国家与粒度不一、
// 过敏原分支与可演化、回扣、停下来想一想、下一单元过渡。
// 分镜：skill-ch02/beats-u8.md U8 一节；原文：DDIA §2.11（书页 p51–52，PDF p73–74）。
// 过敏原例子按原文机制具体化：花生过敏原 → 含花生的酱料（不安全）/ 不含花生的饼干（安全），
// 食物名是教学示意，不是原书内容。
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

  // b26：三种标签的边（married 无箭头，born_in / lives_in 有箭头）
  const g26 = createRef<Node>();
  const g26a = createRef<Circle>();
  const g26b = createRef<Circle>();
  const g26c = createRef<Circle>();
  const g26d = createRef<Circle>();
  const g26lines = [0, 1, 2].map(() => createRef<Line>());
  const g26labs = [0, 1, 2].map(() => createRef<Txt>());
  const g26cap = createRef<Txt>();
  // b27：法国（省 → 大区 → 法国）vs 美国（县 → 州 → 美国）
  const g27 = createRef<Node>();
  const g27fr = [0, 1, 2].map(() => createRef<Rect>());
  const g27us = [0, 1, 2].map(() => createRef<Rect>());
  const g27frLines = [0, 1].map(() => createRef<Line>());
  const g27usLines = [0, 1].map(() => createRef<Line>());
  // b28：国家套国家 + 粒度不一
  const g28 = createRef<Node>();
  const g28uk = createRef<Rect>();
  const g28eng = createRef<Rect>();
  const g28london = createRef<Rect>();
  const g28idaho = createRef<Rect>();
  const g28tag1 = createRef<Txt>();
  const g28tag2 = createRef<Txt>();
  // b29/b30：过敏原分支
  const g29 = createRef<Node>();
  const g29lucy = createRef<Rect>();
  const g29aller = createRef<Rect>();
  const g29food1 = createRef<Rect>();
  const g29food2 = createRef<Rect>();
  const g29e1 = createRef<Line>();
  const g29e2 = createRef<Line>();
  const g29e3 = createRef<Line>();
  const g29ok = createRef<Txt>();
  const g29no = createRef<Txt>();
  const g29feat = createRef<Rect>();
  // b31：回扣小图
  const g31 = createRef<Node>();
  const g31a = createRef<Circle>();
  const g31b = createRef<Circle>();
  const g31edge = createRef<Line>();
  const g31t1 = createRef<Txt>();
  const g31t2 = createRef<Txt>();
  const g31t3 = createRef<Txt>();
  // b32：空白方框 + 空白边
  const g32 = createRef<Node>();
  const g32box = createRef<Rect>();
  const g32edge = createRef<Line>();
  const g32q = createRef<Txt>();
  // b33：过渡卡
  const g33 = createRef<Node>();
  const g33card = createRef<Rect>();
  const g33usa = createRef<Rect>();
  const g33eu = createRef<Rect>();
  const g33q = createRef<Line>();

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

      {/* b26：同一张图，三种标签各一种颜色 */}
      <Node ref={g26} opacity={0}>
        <Circle ref={g26a} position={[-380, -40]} width={120} height={120} fill={T.card} stroke={T.blue} lineWidth={3} opacity={0}>
          <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'Lucy'} />
        </Circle>
        <Circle ref={g26b} position={[0, -40]} width={120} height={120} fill={T.card} stroke={T.blue} lineWidth={3} opacity={0}>
          <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'Alain'} />
        </Circle>
        <Circle ref={g26c} position={[380, -40]} width={120} height={120} fill={T.card} stroke={T.green} lineWidth={3} opacity={0}>
          <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'London'} />
        </Circle>
        <Circle ref={g26d} position={[-200, 180]} width={100} height={100} fill={T.card} stroke={T.green} lineWidth={3} opacity={0}>
          <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'Idaho'} />
        </Circle>
        <Line ref={g26lines[0]} points={[[-320, -40], [-60, -40]]} stroke={T.blue} lineWidth={3} opacity={0} />
        <Line ref={g26lines[1]} points={[[-380, 20], [-260, 130]]} stroke={T.green} lineWidth={3} endArrow opacity={0} />
        <Line ref={g26lines[2]} points={[[60, -40], [320, -40]]} stroke={T.yellow} lineWidth={3} endArrow opacity={0} />
        <Txt ref={g26labs[0]} position={[-190, -90]} fontSize={SIZE.label} fill={T.blue} fontFamily={FONT.mono} text={'married'} opacity={0} />
        <Txt ref={g26labs[1]} position={[-330, 110]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.mono} text={'born_in'} opacity={0} />
        <Txt ref={g26labs[2]} position={[190, -90]} fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.mono} text={'lives_in'} opacity={0} />
        <Txt ref={g26cap} position={[0, 210]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'一种标签，一种关系'} opacity={0} />
      </Node>

      {/* b27：法国（省 → 大区 → 法国）vs 美国（州 → 美国） */}
      <Node ref={g27} opacity={0}>
        <Rect ref={g27fr[0]} position={[-320, 120]} width={320} height={80} radius={12} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'省'} />
        </Rect>
        <Rect ref={g27fr[1]} position={[-320, 0]} width={320} height={80} radius={12} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'大区'} />
        </Rect>
        <Rect ref={g27fr[2]} position={[-320, -120]} width={320} height={80} radius={12} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'法国'} />
        </Rect>
        <Line ref={g27frLines[0]} points={[[-320, 80], [-320, 40]]} stroke={T.line} lineWidth={2} endArrow opacity={0} />
        <Line ref={g27frLines[1]} points={[[-320, -40], [-320, -80]]} stroke={T.line} lineWidth={2} endArrow opacity={0} />
        <Rect ref={g27us[0]} position={[320, 180]} width={320} height={80} radius={12} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'县'} />
        </Rect>
        <Rect ref={g27us[1]} position={[320, 60]} width={320} height={80} radius={12} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'州'} />
        </Rect>
        <Rect ref={g27us[2]} position={[320, -60]} width={320} height={80} radius={12} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'美国'} />
        </Rect>
        <Line ref={g27usLines[0]} points={[[320, 140], [320, 100]]} stroke={T.line} lineWidth={2} endArrow opacity={0} />
        <Line ref={g27usLines[1]} points={[[320, 20], [320, -20]]} stroke={T.line} lineWidth={2} endArrow opacity={0} />
      </Node>

      {/* b28：英格兰套在英国里；伦敦（城市）vs Idaho（州） */}
      <Node ref={g28} opacity={0}>
        <Rect ref={g28uk} position={[-300, -80]} width={380} height={220} radius={16} fill={T.card} stroke={T.blue} lineWidth={3} opacity={0}>
          <Txt position={[0, -80]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'英国'} />
        </Rect>
        <Rect ref={g28eng} position={[-300, -30]} width={240} height={90} radius={12} fill={T.card} stroke={T.yellow} lineWidth={3} opacity={0}>
          <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'英格兰'} />
        </Rect>
        <Txt ref={g28tag1} position={[-300, 110]} fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.sans} text={'国家套国家'} opacity={0} />
        <Rect ref={g28london} position={[300, -120]} width={260} height={90} radius={12} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'London · 城市'} />
        </Rect>
        <Rect ref={g28idaho} position={[300, 20]} width={260} height={90} radius={12} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'Idaho · 州'} />
        </Rect>
        <Txt ref={g28tag2} position={[300, 130]} fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.sans} text={'粒度不一'} opacity={0} />
      </Node>

      {/* b29/b30：Lucy → 花生过敏原 → 饼干 / 酱料 */}
      <Node ref={g29} opacity={0}>
        <Rect ref={g29lucy} position={[-400, -40]} width={240} height={100} radius={12} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'Lucy'} />
        </Rect>
        <Rect ref={g29aller} position={[0, -40]} width={240} height={100} radius={12} fill={T.card} stroke={T.red} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'花生'} />
        </Rect>
        <Rect ref={g29food1} position={[380, -140]} width={220} height={90} radius={12} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'饼干'} />
        </Rect>
        <Rect ref={g29food2} position={[380, 60]} width={220} height={90} radius={12} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'酱料'} />
        </Rect>
        <Line ref={g29e1} points={[[-280, -40], [-120, -40]]} stroke={T.line} lineWidth={2} endArrow opacity={0} />
        <Line ref={g29e2} points={[[120, -60], [270, -120]]} stroke={T.line} lineWidth={2} endArrow opacity={0} />
        <Line ref={g29e3} points={[[120, -20], [270, 40]]} stroke={T.line} lineWidth={2} endArrow opacity={0} />
        <Txt ref={g29ok} position={[380, -235]} fontSize={64} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'✓'} opacity={0} />
        <Txt ref={g29no} position={[380, 155]} fontSize={64} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'✗'} opacity={0} />
        <Rect ref={g29feat} position={[0, 200]} width={420} height={80} radius={12} fill={T.card} stroke={T.purple} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'新功能'} />
        </Rect>
      </Node>

      {/* b31：回扣小图 */}
      <Node ref={g31} opacity={0}>
        <Circle ref={g31a} position={[-300, -40]} width={110} height={110} fill={T.card} stroke={T.blue} lineWidth={3} opacity={0} />
        <Circle ref={g31b} position={[300, -40]} width={110} height={110} fill={T.card} stroke={T.green} lineWidth={3} opacity={0} />
        <Line ref={g31edge} points={[[-245, -40], [245, -40]]} stroke={T.yellow} lineWidth={3} endArrow opacity={0} />
        <Txt ref={g31t1} position={[-300, 80]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'点是东西'} opacity={0} />
        <Txt ref={g31t2} position={[300, 80]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'线是关系'} opacity={0} />
        <Txt ref={g31t3} position={[0, -160]} fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.sans} text={'标签说明关系是哪一种'} opacity={0} />
      </Node>

      {/* b32：空白方框 + 空白边 + 问号 */}
      <Node ref={g32} opacity={0}>
        <Rect ref={g32box} position={[-260, -40]} width={260} height={110} radius={12} fill={T.card} stroke={T.line} lineWidth={2} lineDash={[12, 8]} opacity={0} />
        <Line ref={g32edge} points={[[ -130, -40], [130, -40]]} stroke={T.line} lineWidth={3} lineDash={[12, 8]} endArrow opacity={0} />
        <Txt ref={g32q} position={[300, -40]} fontSize={72} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'?'} opacity={0} />
      </Node>

      {/* b33：下一站查图 */}
      <Node ref={g33} opacity={0}>
        <Rect ref={g33card} position={[0, -200]} width={420} height={100} radius={14} fill={T.card} stroke={T.yellow} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.title} fill={T.text} fontFamily={FONT.sans} text={'下一站：查图'} />
        </Rect>
        <Rect ref={g33usa} position={[-320, 40]} width={280} height={100} radius={12} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'美国'} />
        </Rect>
        <Rect ref={g33eu} position={[320, 40]} width={280} height={100} radius={12} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'欧洲'} />
        </Rect>
        <Line ref={g33q} points={[[-180, 40], [180, 40]]} stroke={T.yellow} lineWidth={3} lineDash={[12, 8]} endArrow opacity={0} />
      </Node>
    </>
  );

  say('一种标签，一种关系');
  yield* beat('b26',
    all(g26().opacity(1, 0.5)),
    at('不同标签', chain(g26a().opacity(1, 0.4), g26b().opacity(1, 0.4), g26c().opacity(1, 0.4), g26d().opacity(1, 0.4))),
    at('不同种类的关系', chain(g26lines[0]().opacity(1, 0.3), g26labs[0]().opacity(1, 0.3), g26lines[1]().opacity(1, 0.3), g26labs[1]().opacity(1, 0.3), g26lines[2]().opacity(1, 0.3), g26labs[2]().opacity(1, 0.3))),
    at('模型还保持干净', g26cap().opacity(1, 0.4)),
  );

  say('法国有省和大区');
  yield* beat('b27',
    all(g26().opacity(0, 0.5), g27().opacity(1, 0.5)),
    at('法国有省和大区', chain(g27fr[0]().opacity(1, 0.4), g27frLines[0]().opacity(1, 0.3), g27fr[1]().opacity(1, 0.4), g27frLines[1]().opacity(1, 0.3), g27fr[2]().opacity(1, 0.4))),
    at('美国有县和州', chain(g27us[0]().opacity(1, 0.4), g27usLines[0]().opacity(1, 0.3), g27us[1]().opacity(1, 0.4), g27usLines[1]().opacity(1, 0.3), g27us[2]().opacity(1, 0.4))),
    at('不同国家的地区结构本来就不一样', chain(g27fr[2]().lineWidth(4, 0.4), g27us[2]().lineWidth(4, 0.4))),
  );

  say('国家套国家，粒度不一');
  yield* beat('b28',
    all(g27().opacity(0, 0.5), g28().opacity(1, 0.5)),
    at('英格兰本身是个国家', g28eng().opacity(1, 0.5)),
    at('却又在英国这个国家里面', chain(g28uk().opacity(1, 0.5), g28tag1().opacity(1, 0.4))),
    at('现居地具体到城市', g28london().opacity(1, 0.5)),
    at('出生地只具体到州', chain(g28idaho().opacity(1, 0.5), g28tag2().opacity(1, 0.4))),
  );

  say('图上长出过敏原');
  yield* beat('b29',
    all(g28().opacity(0, 0.5), g29().opacity(1, 0.5)),
    at('给 Lucy 加一个过敏原顶点', chain(g29lucy().opacity(1, 0.4), g29aller().opacity(1, 0.4))),
    at('连一条边', g29e1().opacity(1, 0.4)),
    at('对什么过敏', chain(g29e1().lineWidth(4, 0.3), g29e1().lineWidth(2, 0.3))),
    at('再把过敏原连到含它的食物上', chain(g29food1().opacity(1, 0.4), g29e2().opacity(1, 0.4), g29food2().opacity(1, 0.4), g29e3().opacity(1, 0.4))),
  );

  say('可演化');
  yield* beat('b30',
    at('每人吃什么安全', chain(g29ok().opacity(1, 0.5), g29no().opacity(1, 0.5))),
    at('图跟着长出来就行', g29feat().opacity(1, 0.5)),
  );

  say('点是东西，线是关系');
  yield* beat('b31',
    all(g29().opacity(0, 0.5), g31().opacity(1, 0.5)),
    at('点是东西', chain(g31a().opacity(1, 0.4), g31t1().opacity(1, 0.4))),
    at('线是关系', chain(g31b().opacity(1, 0.4), g31edge().opacity(1, 0.4), g31t2().opacity(1, 0.4))),
    at('标签说明关系是哪一种', g31t3().opacity(1, 0.4)),
  );

  say('先加顶点，还是先加边？');
  yield* beat('b32',
    all(g31().opacity(0, 0.5), g32().opacity(1, 0.5), g32box().opacity(1, 0.5)),
    at('先加顶点', g32box().lineWidth(4, 0.4)),
    at('还是先加边', chain(g32edge().opacity(1, 0.5), g32q().opacity(1, 0.5))),
  );

  say('下一站：查图');
  yield* beat('b33',
    all(g32().opacity(0, 0.5), g33().opacity(1, 0.5)),
    at('拿这张图查一个问题', chain(g33card().opacity(1, 0.5), g33usa().opacity(1, 0.4), g33eu().opacity(1, 0.4))),
    at('谁从美国移民到了欧洲', g33q().opacity(1, 0.5)),
  );
});
