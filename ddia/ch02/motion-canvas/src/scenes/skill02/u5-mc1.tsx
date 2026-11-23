// U5 场景 1（MC）：b1–b16 —— 钩子、定范围、双方论点、文档式结构、
// shredding、嵌套指代、join、互联程度排队、schema 灵活。
// 分镜：skill-ch02/beats-u5.md U5 一节；原文：DDIA §2.6（书页 p38–39）。
// 时长全部来自 timeline/u5.json（beat() 驱动），不手写 waitFor。
// 颜色、字号、安全区一律取自 lib/theme，不手写十六进制色值。
import {Circle, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, chain, createRef, easeInOutCubic, waitFor} from '@motion-canvas/core';
import {at, makeBeats} from '../../lib/beats';
import {FONT, SAFE, SIZE, T} from '../../lib/theme';
import timeline from '../../timeline/u5.json';

export default makeScene2D(function* (view) {
  view.fill(T.bg);
  const beat = makeBeats(timeline);

  const header = createRef<Txt>();
  const anchor = createRef<Txt>();
  const say = (text: string) => anchor().text(text);

  const g1 = createRef<Node>();
  const g1q = createRef<Txt>();
  const g2 = createRef<Node>();
  const g2t1 = createRef<Rect>();
  const g2t2 = createRef<Rect>();
  const g2card = createRef<Rect>();
  const g3 = createRef<Node>();
  const g3c = [0, 1, 2].map(() => createRef<Rect>());
  const g4 = createRef<Node>();
  const g4a = createRef<Rect>();
  const g4b = createRef<Rect>();
  const g5 = createRef<Node>();
  const g5root = createRef<Rect>();
  const g5kids = [0, 1, 2].map(() => createRef<Node>());
  const g6 = createRef<Node>();
  const g6t = [0, 1, 2].map(() => createRef<Rect>());
  const g6red = createRef<Txt>();
  const g7 = createRef<Node>();
  const g7r2 = createRef<Rect>();
  const g7lab = createRef<Txt>();
  const g8 = createRef<Node>();
  const g8ok = createRef<Txt>();
  const g9 = createRef<Node>();
  const g9q = createRef<Txt>();
  const g10 = createRef<Node>();
  const g10dots = [0, 1, 2, 3].map(() => createRef<Circle>());
  const g11 = createRef<Node>();
  const g11b = createRef<Rect>();
  const g11sync = createRef<Txt>();
  const g12 = createRef<Node>();
  const g12bar1 = createRef<Rect>();
  const g12bar2 = createRef<Rect>();
  const g13 = createRef<Node>();
  const g13dense = createRef<Node>();
  const g14 = createRef<Node>();
  const g14doc = createRef<Rect>();
  const g14rel = createRef<Rect>();
  const g14graph = createRef<Rect>();
  const g15 = createRef<Node>();
  const g15c = [0, 1, 2].map(() => createRef<Rect>());
  const g16 = createRef<Node>();
  const g16r = createRef<Txt>();
  const g16q = createRef<Txt>();

  view.add(
    <>
      <Txt
        ref={header}
        position={[-SAFE.halfW, -SAFE.halfH]}
        offset={[-1, -1]}
        fontSize={SIZE.label}
        fill={T.muted}
        fontFamily={FONT.sans}
        text={'今天怎么选'}
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

      {/* b1：三个模型 + 问号 */}
      <Node ref={g1} opacity={0}>
        {[['文档模型', -360, T.green], ['关系模型', 0, T.blue], ['图模型', 360, T.purple]].map(([label, x, c]) => (
          <Rect key={`g1-${label}`} position={[x as number, -60]} width={260} height={160} radius={16} fill={T.card} stroke={c as string} lineWidth={2}>
            <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={label as string} />
          </Rect>
        ))}
        <Txt ref={g1q} position={[0, 120]} fontSize={72} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'?'} opacity={0} />
      </Node>

      {/* b2：容错 / 并发飘走，留下数据模型 */}
      <Node ref={g2} opacity={0}>
        <Rect ref={g2t1} position={[-320, -120]} width={240} height={90} radius={12} fill={T.card} stroke={T.line} lineWidth={2}>
          <Txt fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'容错'} />
        </Rect>
        <Rect ref={g2t2} position={[320, -120]} width={240} height={90} radius={12} fill={T.card} stroke={T.line} lineWidth={2}>
          <Txt fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'并发'} />
        </Rect>
        <Rect ref={g2card} position={[0, 40]} width={460} height={140} radius={16} fill={T.card} stroke={T.blue} lineWidth={3}>
          <Txt fontSize={SIZE.title} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'数据模型'} />
        </Rect>
      </Node>

      {/* b3：文档的三张牌 */}
      <Node ref={g3} opacity={0}>
        {['schema 灵活', '局部性好', '离应用更近'].map((label, i) => (
          <Rect key={`g3-${i}`} ref={g3c[i]} position={[-360 + i * 360, -40]} width={300} height={180} radius={16} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
            <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={label} />
          </Rect>
        ))}
      </Node>

      {/* b4：关系的两张牌 */}
      <Node ref={g4} opacity={0}>
        <Rect ref={g4a} position={[-280, -40]} width={380} height={180} radius={16} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'join 更好'} />
        </Rect>
        <Rect ref={g4b} position={[280, -40]} width={380} height={180} radius={16} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'多对一 · 多对多'} />
        </Rect>
      </Node>

      {/* b5：档案树一次亮起 */}
      <Node ref={g5} opacity={0}>
        <Rect ref={g5root} position={[0, -200]} width={280} height={80} radius={14} fill={T.card} stroke={T.green} lineWidth={3}>
          <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'用户 251'} />
        </Rect>
        {['工作经历', '教育经历', '联系方式'].map((label, i) => (
          <Node key={`g5k-${i}`} ref={g5kids[i]} opacity={0}>
            <Line points={[[0, -160], [-320 + i * 320, -90]]} stroke={T.line} lineWidth={2} />
            <Rect position={[-320 + i * 320, -40]} width={240} height={90} radius={12} fill={T.card} stroke={T.green} lineWidth={2}>
              <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={label} />
            </Rect>
          </Node>
        ))}
        <Txt position={[0, 110]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'整棵树，一次加载'} />
      </Node>

      {/* b6：撕开成三张表 */}
      <Node ref={g6} opacity={0}>
        {['工作表', '教育表', '联系表'].map((label, i) => (
          <Rect key={`g6-${i}`} ref={g6t[i]} position={[-360 + i * 360, -60]} width={280} height={170} radius={14} fill={T.card} stroke={T.red} lineWidth={2} opacity={0}>
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={label} />
          </Rect>
        ))}
        <Txt ref={g6red} position={[0, 130]} fontSize={SIZE.title} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'变笨拙 · 变复杂'} opacity={0} />
      </Node>

      {/* b7：数着指第二项 */}
      <Node ref={g7} opacity={0}>
        <Rect position={[0, -60]} width={560} height={300} radius={16} fill={T.card} stroke={T.blue} lineWidth={2}>
          <Txt position={[0, -110]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'用户 251 · 工作经历'} />
          <Txt position={[0, -50]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'第 1 项'} />
          <Txt position={[0, 50]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'第 3 项'} />
        </Rect>
        <Rect ref={g7r2} position={[0, 0]} width={420} height={60} radius={10} fill={T.card} stroke={T.yellow} lineWidth={3} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.sans} text={'第 2 项 ← 只能数着指'} />
        </Rect>
        <Txt ref={g7lab} position={[0, 150]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'不能直接指，只能数着指'} opacity={0} />
      </Node>

      {/* b8：嵌得不深 */}
      <Node ref={g8} opacity={0}>
        {[0, 1, 2].map(i => (
          <Rect key={`g8-${i}`} position={[-300 + i * 300, -40]} width={220} height={60} radius={10} fill={T.card} stroke={T.blue} lineWidth={2}>
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={['第 1 层', '第 2 层', '第 3 层'][i]} />
          </Rect>
        ))}
        <Txt ref={g8ok} position={[0, 110]} fontSize={SIZE.title} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'✓ 嵌得不深就没事'} opacity={0} />
      </Node>

      {/* b9：join 弱，是问题吗 */}
      <Node ref={g9} opacity={0}>
        <Rect position={[0, -60]} width={420} height={180} radius={16} fill={T.card} stroke={T.yellow} lineWidth={3}>
          <Txt fontSize={SIZE.title} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'join 支持弱'} />
        </Rect>
        <Txt ref={g9q} position={[0, 120]} fontSize={64} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'?'} opacity={0} />
      </Node>

      {/* b10：事件流时间线 */}
      <Node ref={g10} opacity={0}>
        <Line points={[[-500, -40], [500, -40]]} stroke={T.line} lineWidth={3} />
        {[0, 1, 2, 3].map(i => (
          <Circle key={`g10-${i}`} ref={g10dots[i]} position={[-360 + i * 240, -40]} width={36} height={36} fill={T.blue} opacity={0} />
        ))}
        <Txt position={[0, 60]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'什么时间，发生了什么事'} />
        <Txt position={[0, 130]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} text={'没有交叉连线 · 不用多对多'} />
      </Node>

      {/* b11：复制了就得保持一致 */}
      <Node ref={g11} opacity={0}>
        <Rect position={[-280, -60]} width={360} height={200} radius={16} fill={T.card} stroke={T.blue} lineWidth={2}>
          <Txt position={[0, -40]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'原件'} />
          <Txt position={[0, 40]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} text={'已更新'} />
        </Rect>
        <Rect ref={g11b} position={[-280, -60]} width={360} height={200} radius={16} fill={T.card} stroke={T.red} lineWidth={2} opacity={0}>
          <Txt position={[0, -40]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'副本'} />
          <Txt ref={g11sync} position={[0, 40]} fontSize={SIZE.label} fill={T.red} fontFamily={FONT.sans} text={'还没同步'} opacity={0} />
        </Rect>
      </Node>

      {/* b12：应用里模拟 join，又慢又复杂 */}
      <Node ref={g12} opacity={0}>
        <Txt position={[0, -180]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'应用多发几次请求，模拟 join'} />
        <Rect position={[-200, -60]} width={300} height={90} radius={12} fill={T.card} stroke={T.yellow} lineWidth={2}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'应用里模拟：3 趟'} />
        </Rect>
        <Rect ref={g12bar1} position={[-200, 40]} width={140} height={30} radius={8} fill={T.yellow} opacity={0} />
        <Rect position={[200, -60]} width={300} height={90} radius={12} fill={T.card} stroke={T.green} lineWidth={2}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'库里专门的 join'} />
        </Rect>
        <Rect ref={g12bar2} position={[200, 40]} width={280} height={30} radius={8} fill={T.green} opacity={0} />
      </Node>

      {/* b13：关键看数据是什么关系 */}
      <Node ref={g13} opacity={0}>
        <Txt position={[0, -180]} fontSize={SIZE.title} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'关键看数据是什么关系'} />
        <Node ref={g13dense} opacity={0}>
          {[0, 1, 2, 3, 4, 5].map(i => (
            <Circle key={`g13-${i}`} position={[-400 + (i % 3) * 400, -80 + Math.floor(i / 3) * 140]} width={60} height={60} fill={T.blue} />
          ))}
          <Line points={[[-400, -80], [0, -80]]} stroke={T.line} lineWidth={2} />
          <Line points={[[0, -80], [400, 60]]} stroke={T.line} lineWidth={2} />
          <Line points={[[-400, 60], [0, -80]]} stroke={T.line} lineWidth={2} />
        </Node>
      </Node>

      {/* b14：三种模型按互联程度排队 */}
      <Node ref={g14} opacity={0}>
        <Rect ref={g14doc} position={[-360, -40]} width={300} height={200} radius={16} fill={T.card} stroke={T.line} lineWidth={2} opacity={0}>
          <Txt position={[0, -40]} fontSize={SIZE.body} fill={T.muted} fontFamily={FONT.sans} text={'文档模型'} />
          <Txt position={[0, 40]} fontSize={SIZE.label} fill={T.red} fontFamily={FONT.sans} text={'别扭 ✗'} />
        </Rect>
        <Rect ref={g14rel} position={[0, -40]} width={300} height={200} radius={16} fill={T.card} stroke={T.yellow} lineWidth={2} opacity={0}>
          <Txt position={[0, -40]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'关系模型'} />
          <Txt position={[0, 40]} fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.sans} text={'还能接受'} />
        </Rect>
        <Rect ref={g14graph} position={[360, -40]} width={300} height={200} radius={16} fill={T.card} stroke={T.green} lineWidth={3} opacity={0}>
          <Txt position={[0, -40]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'图模型'} />
          <Txt position={[0, 40]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} text={'最自然 ✓'} />
        </Rect>
      </Node>

      {/* b15：谁强制 schema */}
      <Node ref={g15} opacity={0}>
        {['文档库', '关系库 JSON', '关系库 XML'].map((label, i) => (
          <Rect key={`g15-${i}`} ref={g15c[i]} position={[-360 + i * 360, -60]} width={300} height={190} radius={16} fill={T.card} stroke={i === 2 ? T.blue : T.green} lineWidth={2} opacity={0}>
            <Txt position={[0, -40]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={label} />
            <Txt position={[0, 40]} fontSize={SIZE.label} fill={i === 2 ? T.blue : T.green} fontFamily={FONT.sans} text={i === 2 ? '可选校验' : '不强制'} />
          </Rect>
        ))}
      </Node>

      {/* b16：读时没有任何保证 */}
      <Node ref={g16} opacity={0}>
        <Rect position={[-200, -60]} width={380} height={220} radius={16} fill={T.card} stroke={T.green} lineWidth={2}>
          <Txt position={[0, -50]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'"任意键": 任意值'} />
          <Txt position={[0, 20]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'"新字段": 随便加'} />
        </Rect>
        <Txt ref={g16r} position={[200, -120]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'读的一端'} opacity={0} />
        <Txt ref={g16q} position={[200, -40]} fontSize={64} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'?'} opacity={0} />
        <Txt position={[200, 60]} fontSize={SIZE.label} fill={T.red} fontFamily={FONT.sans} text={'没有任何保证'} />
      </Node>
    </>
  );

  say('看流行度，还是看数据？');
  yield* beat('b1',
    all(g1().opacity(1, 0.5)),
    at('流行度', waitFor(0.01)),
    at('数据长什么样', g1q().opacity(1, 0.4)),
  );

  say('今天只比数据模型');
  yield* beat('b2',
    all(g1().opacity(0, 0.5), g2().opacity(1, 0.5)),
    at('容错、并发', chain(g2t1().opacity(0, 0.4), g2t2().opacity(0, 0.4))),
    at('只比数据模型本身', g2card().lineWidth(4, 0.4)),
  );

  say('文档的三张牌');
  yield* beat('b3',
    all(g2().opacity(0, 0.5), g3().opacity(1, 0.5)),
    at('schema 灵活', g3c[0]().opacity(1, 0.4)),
    at('局部性', g3c[1]().opacity(1, 0.4)),
    at('离应用的数据结构更近', g3c[2]().opacity(1, 0.4)),
  );

  say('关系也不让步');
  yield* beat('b4',
    all(g3().opacity(0, 0.5), g4().opacity(1, 0.5)),
    at('join 做得更好', g4a().opacity(1, 0.4)),
    at('多对一、多对多', g4b().opacity(1, 0.4)),
  );

  say('整棵树，一次加载');
  yield* beat('b5',
    all(g4().opacity(0, 0.5), g5().opacity(1, 0.5)),
    at('整棵树通常一次加载', chain(g5kids[0]().opacity(1, 0.4), g5kids[1]().opacity(1, 0.4), g5kids[2]().opacity(1, 0.4))),
    at('用文档模型', g5root().lineWidth(5, 0.4)),
  );

  say('拆成表，就变复杂');
  yield* beat('b6',
    all(g5().opacity(0, 0.5), g6().opacity(1, 0.5)),
    at('拆成多张表', chain(g6t[0]().opacity(1, 0.4), g6t[1]().opacity(1, 0.4), g6t[2]().opacity(1, 0.4))),
    at('变笨拙', g6red().opacity(1, 0.4)),
  );

  say('只能数着指');
  yield* beat('b7',
    all(g6().opacity(0, 0.5), g7().opacity(1, 0.5)),
    at('第二项', g7r2().opacity(1, 0.5)),
    at('不能直接指', g7lab().opacity(1, 0.4)),
  );

  say('嵌得不深就没事');
  yield* beat('b8',
    all(g7().opacity(0, 0.5), g8().opacity(1, 0.5)),
    at('不会嵌得太深', g8ok().opacity(1, 0.5)),
  );

  say('先看连接查询');
  yield* beat('b9a',
    all(g8().opacity(0, 0.5), g9().opacity(1, 0.5)),
    at('比较弱', waitFor(0.01)),
  );

  say('join 弱，是问题吗？');
  yield* beat('b9b',
    all(),
    at('根本不是问题', g9q().opacity(1, 0.4)),
  );

  say('记事件，不用多对多');
  yield* beat('b10',
    all(g9().opacity(0, 0.5), g10().opacity(1, 0.5)),
    at('什么时间发生了什么事', chain(g10dots[0]().opacity(1, 0.3), g10dots[1]().opacity(1, 0.3), g10dots[2]().opacity(1, 0.3), g10dots[3]().opacity(1, 0.3))),
  );

  say('复制了，就得保持一致');
  yield* beat('b11',
    all(g10().opacity(0, 0.5), g11().opacity(1, 0.5)),
    at('反规范化', all(g11b().opacity(1, 0.3), g11b().position([280, -60], 2, easeInOutCubic))),
    at('复制出来的数据一致', g11sync().opacity(1, 0.4)),
  );

  say('模拟 join');
  yield* beat('b12a',
    all(g11().opacity(0, 0.5), g12().opacity(1, 0.5)),
    at('多发几次请求', g12bar1().opacity(1, 0.5)),
  );

  say('模拟 join，又慢又复杂');
  yield* beat('b12b',
    all(),
    at('库里专门的 join', g12bar2().opacity(1, 0.5)),
  );

  say('关键看数据是什么关系');
  yield* beat('b13',
    all(g12().opacity(0, 0.5), g13().opacity(1, 0.5)),
    at('数据项之间是什么关系', g13dense().opacity(1, 0.6)),
  );

  say('越连越密，图最自然');
  yield* beat('b14',
    all(g13().opacity(0, 0.5), g14().opacity(1, 0.5)),
    at('文档模型别扭', g14doc().opacity(1, 0.4)),
    at('关系模型还能接受', g14rel().opacity(1, 0.4)),
    at('图模型最自然', g14graph().opacity(1, 0.4)),
  );

  say('谁强制 schema？');
  yield* beat('b15a',
    all(g14().opacity(0, 0.5), g15().opacity(1, 0.5)),
    at('不强制 schema', chain(g15c[0]().opacity(1, 0.4), g15c[1]().opacity(1, 0.4))),
  );

  say('关系库 XML 可选校验');
  yield* beat('b15b',
    all(),
    at('可选的校验', g15c[2]().opacity(1, 0.4)),
  );

  say('读时没有任何保证');
  yield* beat('b16',
    all(g15().opacity(0, 0.5), g16().opacity(1, 0.5)),
    at('读的时候', g16r().opacity(1, 0.4)),
    at('没有任何保证', g16q().opacity(1, 0.4)),
  );
});
