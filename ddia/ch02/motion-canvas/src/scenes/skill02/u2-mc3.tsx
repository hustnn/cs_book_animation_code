// U2 场景 3（MC）：b21–b27 —— 六次查询 vs 一次查询、多路 join、
// 一对多长成树、回扣、想一想、下一站。
// 分镜：skill-ch02/beats-u2.md U2 一节；原文：DDIA §2.3（书页 p32，PDF p54）。
// 树按原图复现：根 user 251；positions 下 job 1/2，education 下 edu 1/2，
// 叶节点为各字段名；“六次查询”为教学设计里的简化说法（原文未给次数）。
// 时长全部来自 timeline/u2.json（beat() 驱动），不手写 waitFor。
// 颜色、字号、安全区一律取自 lib/theme，不手写十六进制色值。
import {Circle, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, chain, createRef, waitFor} from '@motion-canvas/core';
import {at, makeBeats} from '../../lib/beats';
import {FONT, SAFE, SIZE, T} from '../../lib/theme';
import timeline from '../../timeline/u2.json';

export default makeScene2D(function* (view) {
  view.fill(T.bg);
  const beat = makeBeats(timeline);

  const header = createRef<Txt>();
  const anchor = createRef<Txt>();
  const say = (text: string) => anchor().text(text);

  const g21 = createRef<Node>();
  const g21tag = createRef<Txt>();
  const g21chips = [0, 1, 2, 3, 4, 5].map(() => createRef<Rect>());
  const g21badges = [0, 1, 2, 3, 4, 5].map(() => createRef<Circle>());
  const g21total = createRef<Txt>();
  const g22 = createRef<Node>();
  const g23 = createRef<Node>();
  const g23one = createRef<Txt>();
  const g24 = createRef<Node>();
  const g24root = createRef<Circle>();
  const g24level1 = [0, 1, 2, 3, 4].map(() => createRef<Node>());
  const g24level2 = [0, 1, 2, 3].map(() => createRef<Node>());
  const g24leaves = createRef<Node>();
  const g24lab = createRef<Txt>();
  const g25 = createRef<Node>();
  const g25left = createRef<Node>();
  const g25right = createRef<Node>();
  const g25chips = [0, 1, 2].map(() => createRef<Rect>());
  const g25leftLab = createRef<Txt>();
  const g25rightLab = createRef<Txt>();
  const g26 = createRef<Node>();
  const g26left = createRef<Rect>();
  const g26right = createRef<Rect>();
  const g26q = createRef<Txt>();
  const g27 = createRef<Node>();
  const g27text = createRef<Node>();
  const g27id = createRef<Rect>();

  const chipNames = ['users', 'positions', 'education', 'contact_info', 'regions', 'industries'];

  view.add(
    <>
      <Txt
        ref={header}
        position={[-SAFE.halfW, -SAFE.halfH]}
        offset={[-1, -1]}
        fontSize={SIZE.label}
        fill={T.muted}
        fontFamily={FONT.sans}
        text={'同一份简历，两种长相'}
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

      {/* b21：六次查询 */}
      <Node ref={g21} opacity={0}>
        <Txt ref={g21tag} position={[0, -220]} fontSize={SIZE.title} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'局部性'} opacity={0} />
        {[0, 1, 2, 3, 4, 5].map(i => (
          <Rect key={`g21c-${i}`} ref={g21chips[i]} position={[-475 + i * 190, -60]} width={170} height={120} radius={14} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={chipNames[i]} />
          </Rect>
        ))}
        {[0, 1, 2, 3, 4, 5].map(i => (
          <Circle key={`g21b-${i}`} ref={g21badges[i]} position={[-395 + i * 190, -130]} width={44} height={44} fill={T.yellow} opacity={0}>
            <Txt fontSize={SIZE.label} fontWeight={700} fill={T.bg} fontFamily={FONT.sans} text={String(i + 1)} />
          </Circle>
        ))}
        <Txt ref={g21total} position={[0, 120]} fontSize={SIZE.title} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'一共查 6 次'} opacity={0} />
      </Node>

      {/* b22：多路 join */}
      <Node ref={g22} opacity={0}>
        <Rect position={[0, -60]} width={1060} height={220} radius={16} fill={T.card} stroke={T.red} lineWidth={3}>
          <Txt position={[0, -70]} fontSize={SIZE.label} fill={T.red} fontFamily={FONT.mono} text={'users + positions + education + contact_info + regions + industries'} />
          <Txt position={[0, 0]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'251 · Bill · Gates · Co-chair · Microsoft · Harvard · …'} />
          <Txt position={[0, 60]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'列越来越多，行越拼越宽'} />
        </Rect>
      </Node>

      {/* b23：一次查询 */}
      <Node ref={g23} opacity={0}>
        <Rect position={[0, -60]} width={520} height={340} radius={16} fill={T.card} stroke={T.green} lineWidth={3}>
          <Txt position={[0, -120]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.mono} text={'一份 JSON 文档'} />
          <Txt position={[0, -40]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.mono} text={'{ user_id: 251, … }'} />
          <Txt position={[0, 40]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'工作 · 教育 · 联系方式'} />
          <Txt position={[0, 110]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'都在一处'} />
        </Rect>
        <Txt ref={g23one} position={[0, 190]} fontSize={SIZE.title} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'只查 1 次'} opacity={0} />
      </Node>

      {/* b24：树 */}
      <Node ref={g24} opacity={0}>
        <Circle ref={g24root} position={[0, -230]} width={90} height={90} fill={T.card} stroke={T.yellow} lineWidth={3} opacity={0}>
          <Txt fontSize={SIZE.label} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'251'} />
        </Circle>
        <Txt position={[100, -230]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'user 251'} />
        {[
          {x: -500, label: 'first_name', shape: 'leaf', w: 120},
          {x: -370, label: 'last_name', shape: 'leaf', w: 120},
          {x: -240, label: 'summary', shape: 'leaf', w: 120},
          {x: -90, label: 'positions', shape: 'box', w: 150},
          {x: 190, label: 'education', shape: 'box', w: 150},
        ].map((n, i) => (
          <Node key={`g24l1-${i}`} ref={g24level1[i]} opacity={0}>
            <Line points={[[0, -185], [n.x, -140]]} stroke={T.line} lineWidth={2} />
            <Rect position={[n.x, -100]} width={n.w} height={70} radius={10} fill={T.card} stroke={n.shape === 'box' ? T.blue : T.line} lineWidth={2}>
              <Txt fontSize={SIZE.min} fill={T.text} fontFamily={FONT.mono} text={n.label} />
            </Rect>
          </Node>
        ))}
        {[
          {x: -155, label: 'job 1', parent: -90},
          {x: -25, label: 'job 2', parent: -90},
          {x: 170, label: 'edu 1', parent: 190},
          {x: 300, label: 'edu 2', parent: 190},
        ].map((n, i) => (
          <Node key={`g24l2-${i}`} ref={g24level2[i]} opacity={0}>
            <Line points={[[n.parent, -65], [n.x, 10]]} stroke={T.line} lineWidth={2} />
            <Rect position={[n.x, 50]} width={120} height={60} radius={10} fill={T.card} stroke={T.blue} lineWidth={2}>
              <Txt fontSize={SIZE.min} fill={T.text} fontFamily={FONT.mono} text={n.label} />
            </Rect>
          </Node>
        ))}
        <Node ref={g24leaves} opacity={0}>
          <Txt position={[-90, 140]} fontSize={SIZE.min} fill={T.muted} fontFamily={FONT.mono} text={'job_title · organization'} />
          <Txt position={[210, 140]} fontSize={SIZE.min} fill={T.muted} fontFamily={FONT.mono} text={'school_name · start · end'} />
        </Node>
        <Txt ref={g24lab} position={[0, 210]} fontSize={SIZE.title} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'一对多就是一棵树'} opacity={0} />
      </Node>

      {/* b25：回扣 */}
      <Node ref={g25} opacity={0}>
        <Node ref={g25left}>
          {[0, 1, 2].map(i => (
            <Rect key={`g25t-${i}`} ref={g25chips[i]} position={[-380, -160 + i * 120]} width={300} height={90} radius={12} fill={T.card} stroke={T.blue} lineWidth={2}>
              <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={['users · regions', 'positions · education', 'contact_info · industries'][i]} />
            </Rect>
          ))}
          <Txt ref={g25leftLab} position={[-380, 150]} fontSize={SIZE.label} fill={T.red} fontFamily={FONT.sans} text={'取出来要一张张拼'} opacity={0} />
        </Node>
        <Node ref={g25right} opacity={0}>
          <Rect position={[320, -60]} width={380} height={300} radius={16} fill={T.card} stroke={T.green} lineWidth={2}>
            <Txt position={[0, -100]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.mono} text={'一份 JSON 文档'} />
            <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.mono} text={'{ … }'} />
            <Txt position={[0, 80]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'整棵树都在里面'} />
          </Rect>
          <Txt ref={g25rightLab} position={[320, 150]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} text={'取出来就是整棵树'} opacity={0} />
        </Node>
      </Node>

      {/* b26：想一想 */}
      <Node ref={g26} opacity={0}>
        <Rect ref={g26left} position={[-300, -40]} width={420} height={240} radius={16} fill={T.card} stroke={T.green} lineWidth={3}>
          <Txt position={[0, -40]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'自包含的文档'} />
          <Txt position={[0, 40]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'一份简历'} />
        </Rect>
        <Rect ref={g26right} position={[300, -40]} width={420} height={240} radius={16} fill={T.card} stroke={T.blue} lineWidth={3}>
          <Txt position={[0, -40]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'互相引用的网'} />
          <Txt position={[0, 40]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'人 · 地点 · 组织'} />
        </Rect>
        <Txt ref={g26q} position={[0, -40]} fontSize={72} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'?'} opacity={0} />
      </Node>

      {/* b27：下一站 */}
      <Node ref={g27} opacity={0}>
        <Node ref={g27text}>
          <Rect position={[0, -60]} width={640} height={200} radius={16} fill={T.card} stroke={T.blue} lineWidth={2}>
            <Txt position={[0, -40]} fontSize={SIZE.title} fontWeight={700} fill={T.white} fontFamily={FONT.serif} text={'大西雅图地区'} />
            <Txt position={[0, 40]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'地名存文字，还是存编号？'} />
          </Rect>
        </Node>
        <Rect ref={g27id} position={[0, -60]} width={640} height={200} radius={16} fill={T.card} stroke={T.yellow} lineWidth={3} opacity={0}>
          <Txt position={[0, -40]} fontSize={SIZE.title} fontWeight={700} fill={T.yellow} fontFamily={FONT.mono} text={'us:91'} />
          <Txt position={[0, 40]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'一个编号就够了？'} />
        </Rect>
      </Node>
    </>
  );

  say('查六次');
  yield* beat('b21',
    all(g21().opacity(1, 0.4)),
    at('局部性', g21tag().opacity(1, 0.4)),
    at('一张表一张表地查', chain(
      all(g21chips[0]().opacity(1, 0.3), g21badges[0]().opacity(1, 0.3)),
      all(g21chips[1]().opacity(1, 0.3), g21badges[1]().opacity(1, 0.3)),
      all(g21chips[2]().opacity(1, 0.3), g21badges[2]().opacity(1, 0.3)),
      all(g21chips[3]().opacity(1, 0.3), g21badges[3]().opacity(1, 0.3)),
      all(g21chips[4]().opacity(1, 0.3), g21badges[4]().opacity(1, 0.3)),
      all(g21chips[5]().opacity(1, 0.3), g21badges[5]().opacity(1, 0.3)),
      g21total().opacity(1, 0.3),
    )),
  );

  say('一次多路 join，又乱');
  yield* beat('b22',
    all(g21().opacity(0, 0.5), g22().opacity(1, 0.5)),
    at('多路 join', g22().scale(1.03, 1.2)),
  );

  say('查一次就够');
  yield* beat('b23',
    all(g22().opacity(0, 0.5), g23().opacity(1, 0.5)),
    at('一处', g23().scale(1.02, 0.8)),
    at('一次查询', g23one().opacity(1, 0.5)),
  );

  say('一对多就是一棵树');
  yield* beat('b24',
    all(g23().opacity(0, 0.5), g24().opacity(1, 0.5)),
    chain(waitFor(0.5), g24root().opacity(1, 0.5)),
    at('一棵树', chain(
      all(g24level1[0]().opacity(1, 0.5), g24level1[1]().opacity(1, 0.5), g24level1[2]().opacity(1, 0.5), g24level1[3]().opacity(1, 0.5), g24level1[4]().opacity(1, 0.5)),
      all(g24level2[0]().opacity(1, 0.5), g24level2[1]().opacity(1, 0.5), g24level2[2]().opacity(1, 0.5), g24level2[3]().opacity(1, 0.5)),
      g24leaves().opacity(1, 0.5),
    )),
    at('显形', g24lab().opacity(1, 0.4)),
  );

  say('拆成表要拼，合进文档是整棵树');
  yield* beat('b25',
    all(g24().opacity(0, 0.5), g25().opacity(1, 0.5)),
    g25().scale(1.02, beat.dur('b25')),
    chain(waitFor(1.5), g25chips[0]().stroke(T.yellow, 0.4), waitFor(1.5), g25chips[1]().stroke(T.yellow, 0.4), waitFor(1.5), g25chips[2]().stroke(T.yellow, 0.4)),
    at('一张张拼', g25leftLab().opacity(1, 0.4)),
    at('合进文档', g25right().opacity(1, 0.6)),
    at('整棵树', g25rightLab().opacity(1, 0.4)),
  );

  say('你的数据像哪一种？');
  yield* beat('b26',
    all(g25().opacity(0, 0.5), g26().opacity(1, 0.5)),
    g26().scale(1.015, beat.dur('b26')),
    at('自包含的文档', g26left().lineWidth(5, 0.5)),
    at('互相引用的网', all(g26right().lineWidth(5, 0.5), g26q().opacity(1, 0.5))),
  );

  say('下一站：名字还是编号');
  yield* beat('b27',
    all(g26().opacity(0, 0.5), g27().opacity(1, 0.5)),
    g27().scale(1.02, beat.dur('b27')),
    at('名字还是编号', all(g27id().opacity(1, 0.5), g27text().opacity(0, 0.5))),
    at('改名时谁更疼', all(g27id().opacity(0, 0.6), g27text().opacity(1, 0.6))),
  );
});
