// U1 场景 4（MC）：b23–b31 —— 关系库泛化到业务处理之外、NoSQL 的诞生、
// 四条驱动力、多语言持久化并存、回扣钩子。
// 分镜：skill-ch02/beats-u1.md U1 一节；原文：DDIA §2.1–2.2（书页 p29）。
// 时长全部来自 timeline/u1.json（beat() 驱动），不手写 waitFor。
// 颜色、字号、安全区一律取自 lib/theme，不手写十六进制色值。
import {Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, chain, createRef} from '@motion-canvas/core';
import {at, makeBeats} from '../../lib/beats';
import {row} from '../../lib/layout';
import {FONT, SAFE, SIZE, T} from '../../lib/theme';
import timeline from '../../timeline/u1.json';

export default makeScene2D(function* (view) {
  view.fill(T.bg);
  const beat = makeBeats(timeline);

  const header = createRef<Txt>();
  const anchor = createRef<Txt>();
  const say = (text: string) => anchor().text(text);

  // b23：关系库放大，射线伸出
  const g23 = createRef<Node>();
  const g23core = createRef<Rect>();
  const g23rays = [0, 1, 2, 3, 4, 5].map(() => createRef<Line>());
  // b24：六个应用图标
  const g24 = createRef<Node>();
  const g24apps = [0, 1, 2, 3, 4, 5].map(() => createRef<Rect>());
  const g24badge = createRef<Txt>();
  // b25：王座与新挑战者
  const g25 = createRef<Node>();
  const g25throne = createRef<Rect>();
  const g25chall = createRef<Rect>();
  // b26/b27：标签翻面
  const g26 = createRef<Node>();
  const g26tag = createRef<Txt>();
  const g26sub = createRef<Txt>();
  const g27tag = createRef<Txt>();
  const g27sub = createRef<Txt>();
  // b28：四条驱动力
  const g28 = createRef<Node>();
  const g28cards = [0, 1, 2, 3].map(() => createRef<Rect>());
  // b29/b30：拼图并存 + 名字
  const g29 = createRef<Node>();
  const g29blocks = [0, 1, 2, 3].map(() => createRef<Rect>());
  const g29name = createRef<Txt>();
  const g29nameSub = createRef<Txt>();
  // b31：回扣——迷你塔 + 黑盒接口
  const g31 = createRef<Node>();
  const g31layers = [0, 1, 2, 3].map(() => createRef<Rect>());
  const g31box = createRef<Rect>();
  const g31concl = createRef<Txt>();

  const appPos = [...row(3, 300, 24, [0, -140]), ...row(3, 300, 24, [0, 0])];
  const appNames = ['网上出版', '讨论', '社交', '电商', '游戏', '在线办公'];
  const appCues = ['网上出版', '讨论', '社交', '电商', '游戏', '在线办公应用'];
  const drvPos = row(4, 260, 20, [0, -60]);
  const drvNames = ['更大扩展性', '免费开源', '专用查询', '更动态的模型'];
  const drvCues = ['更大的扩展性', '免费开源', '专用查询', '更动态'];
  const blockPos = row(4, 260, 20, [0, -40]);
  const blockNames = ['关系库', '文档库', '图库', '其他存储'];
  const rayAngles = [210, 250, 290, 330, 20, 160].map(d => (d * Math.PI) / 180);

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

      {/* b23：关系库放大，射线伸出 */}
      <Node ref={g23} opacity={0}>
        {[0, 1, 2, 3, 4, 5].map(i => (
          <Line
            key={`g23r-${i}`}
            ref={g23rays[i]}
            points={[
              [Math.cos(rayAngles[i]) * 180, -60 + Math.sin(rayAngles[i]) * 150],
              [Math.cos(rayAngles[i]) * 480, -60 + Math.sin(rayAngles[i]) * 260],
            ]}
            stroke={T.green}
            lineWidth={3}
            opacity={0}
          />
        ))}
        <Rect ref={g23core} position={[0, -60]} width={320} height={120} radius={16} fill={T.card} stroke={T.green} lineWidth={3}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'关系库'} />
        </Rect>
      </Node>

      {/* b24：六个应用图标 */}
      <Node ref={g24} opacity={0}>
        {appPos.map((p, i) => (
          <Rect key={`g24a-${i}`} ref={g24apps[i]} position={p} width={300} height={100} radius={14} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
            <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={appNames[i]} />
          </Rect>
        ))}
        <Txt ref={g24badge} position={[0, 130]} fontSize={SIZE.label} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'背后还是关系库'} opacity={0} />
      </Node>

      {/* b25：王座与新挑战者 */}
      <Node ref={g25} opacity={0}>
        <Rect ref={g25throne} position={[-260, -80]} width={380} height={140} radius={16} fill={T.card} stroke={T.yellow} lineWidth={3}>
          <Txt position={[0, -30]} fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.sans} text={'★ 王座'} />
          <Txt position={[0, 20]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'关系库'} />
        </Rect>
        <Rect ref={g25chall} position={[300, 220]} width={300} height={110} radius={14} fill={T.card} stroke={T.red} lineWidth={3} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.mono} text={'NoSQL'} />
        </Rect>
      </Node>

      {/* b26/b27：标签翻面 */}
      <Node ref={g26} opacity={0}>
        <Txt ref={g26tag} position={[0, -80]} fontSize={72} fontWeight={700} fill={T.text} fontFamily={FONT.mono} text={'#NoSQL'} />
        <Txt ref={g26sub} position={[0, 40]} fontSize={SIZE.body} fill={T.muted} fontFamily={FONT.sans} text={'2009 年聚会标签'} opacity={0} />
        <Txt ref={g27tag} position={[0, -80]} fontSize={64} fontWeight={700} fill={T.green} fontFamily={FONT.mono} text={'Not Only SQL'} opacity={0} />
        <Txt ref={g27sub} position={[0, 40]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'不只是 SQL'} opacity={0} />
      </Node>

      {/* b28：四条驱动力 */}
      <Node ref={g28} opacity={0}>
        {drvPos.map((p, i) => (
          <Rect key={`g28c-${i}`} ref={g28cards[i]} position={p} width={260} height={130} radius={14} fill={T.card} stroke={T.yellow} lineWidth={2} opacity={0}>
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={drvNames[i]} textWrap maxWidth={230} position={i === 0 ? [0, -22] : [0, 0]} />
            {i === 0 && <Txt position={[0, 28]} fontSize={18} fill={T.muted} fontFamily={FONT.sans} text={'超大数据集 / 超高写吞吐'} textWrap maxWidth={230} />}
          </Rect>
        ))}
      </Node>

      {/* b29/b30：拼图并存 */}
      <Node ref={g29} opacity={0}>
        {blockPos.map((p, i) => (
          <Rect key={`g29b-${i}`} ref={g29blocks[i]} position={p} width={260} height={130} radius={14} fill={T.card} stroke={i === 0 ? T.green : T.blue} lineWidth={2} opacity={0}>
            <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={blockNames[i]} />
          </Rect>
        ))}
        <Txt ref={g29name} position={[0, -210]} fontSize={SIZE.title} fontWeight={700} fill={T.yellow} fontFamily={FONT.mono} text={'polyglot persistence'} opacity={0} />
        <Txt ref={g29nameSub} position={[0, -150]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'多语言持久化'} opacity={0} />
      </Node>

      {/* b31：回扣——迷你塔 + 黑盒接口 */}
      <Node ref={g31} opacity={0}>
        {[0, 1, 2, 3].map(i => (
          <Rect
            key={`g31l-${i}`}
            ref={g31layers[i]}
            position={[-280, -190 + i * 78]}
            width={380}
            height={64}
            radius={12}
            fill={T.card}
            stroke={T.blue}
            lineWidth={2}
            opacity={0}
          >
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={['现实世界', '对象与数据结构', '通用数据模型', '字节'][i]} />
          </Rect>
        ))}
        <Rect ref={g31box} position={[300, -40]} width={340} height={150} radius={16} fill={T.bg} stroke={T.yellow} lineWidth={3} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'干净的接口'} />
        </Rect>
        <Txt ref={g31concl} position={[0, 210]} fontSize={SIZE.title} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'藏细节，选模型看应用'} opacity={0} />
      </Node>
    </>,
  );

  say('泛化到业务处理之外');
  yield* beat('b23',
    all(g23().opacity(1, 0.5)),
    at('用途越来越多', all(g23rays[0]().opacity(1, 0.6), g23rays[1]().opacity(1, 0.6), g23rays[2]().opacity(1, 0.6))),
    at('泛化开来', all(g23core().scale(1.12, 0.8), g23rays[3]().opacity(1, 0.6), g23rays[4]().opacity(1, 0.6), g23rays[5]().opacity(1, 0.6))),
    at('业务处理', g23core().scale(1, 0.4)),
  );

  say('网上大多东西背后是它');
  yield* beat('b24',
    all(g23().opacity(0, 0.5), g24().opacity(1, 0.5)),
    ...appCues.map((cue, i) => at(cue, g24apps[i]().opacity(1, 0.4))),
    at('背后还是关系库', g24badge().opacity(1, 0.5)),
  );

  say('2010 年代：NoSQL');
  yield* beat('b25',
    all(g24().opacity(0, 0.5), g25().opacity(1, 0.5)),
    at('二零一零年代', g25throne().stroke(T.yellow, 0.4)),
    at('NoSQL', all(g25chall().opacity(1, 0.5), g25chall().position([300, -60], 0.7))),
  );

  say('2009 年聚会标签');
  yield* beat('b26',
    all(g25().opacity(0, 0.5), g26().opacity(1, 0.5)),
    at('不指任何具体技术', g26tag().scale(1.03, 0.4)),
    at('聚会的标签', g26sub().opacity(1, 0.5)),
    at('推特', g26tag().scale(1.06, 0.4)),
  );

  say('Not Only SQL');
  yield* beat('b27',
    all(g26tag().opacity(0, 0.4), g26sub().opacity(0, 0.4)),
    at('Not Only SQL', all(g27tag().opacity(1, 0.5), g27sub().opacity(1, 0.5))),
    at('不只是 SQL', g27tag().scale(1.05, 0.4)),
  );

  say('四股力量推它起来');
  yield* beat('b28',
    all(g26().opacity(0, 0.5), g28().opacity(1, 0.5)),
    ...drvCues.map((cue, i) => at(cue, g28cards[i]().opacity(1, 0.4))),
    at('数据模型', all(...g28cards.map(c => c().stroke(T.green, 0.4)))),
  );

  say('并存下去');
  yield* beat('b29',
    all(g28().opacity(0, 0.5), g29().opacity(1, 0.5)),
    at('不同应用的需求不一样', chain(g29blocks[0]().opacity(1, 0.4), g29blocks[1]().opacity(1, 0.4), g29blocks[2]().opacity(1, 0.4), g29blocks[3]().opacity(1, 0.4))),
    at('并存下去', g29blocks[0]().stroke(T.yellow, 0.4)),
  );

  say('多语言持久化');
  yield* beat('b30',
    g29().scale(1.02, beat.dur('b30')),
    at('polyglot persistence', all(g29name().opacity(1, 0.5), g29nameSub().opacity(1, 0.5))),
    at('多语言持久化', g29name().scale(1.03, 0.4)),
  );

  say('藏细节，选模型看应用');
  yield* beat('b31',
    all(g29().opacity(0, 0.5), g31().opacity(1, 0.5)),
    at('回到开头的问题', chain(g31layers[0]().opacity(1, 0.4), g31layers[1]().opacity(1, 0.4), g31layers[2]().opacity(1, 0.4), g31layers[3]().opacity(1, 0.4))),
    at('藏起来', g31box().opacity(1, 0.6)),
    at('看你的应用长什么样', g31concl().opacity(1, 0.5)),
  );
});
