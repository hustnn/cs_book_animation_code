// U4 场景 3（MC）：b23–b33 —— 优化器接管、加索引、建一次人人受益、
// 通用方案长远胜出、文档库退回层次、 外键 = 文档引用、读取时解析、回扣、思考、下一站。
// 分镜：skill-ch02/beats-u4.md U4 一节；原文：DDIA §2.5（书页 p37–38，PDF p59–60）。
// 时长全部来自 timeline/u4.json（beat() 驱动），不手写 waitFor。
// 颜色、字号、安全区一律取自 lib/theme，不手写十六进制色值。
import {Circle, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, chain, createRef, waitFor} from '@motion-canvas/core';
import {at, makeBeats} from '../../lib/beats';
import {FONT, SAFE, SIZE, T} from '../../lib/theme';
import timeline from '../../timeline/u4.json';

export default makeScene2D(function* (view) {
  view.fill(T.bg);
  const beat = makeBeats(timeline);

  const header = createRef<Txt>();
  const anchor = createRef<Txt>();
  const say = (text: string) => anchor().text(text);

  const g23 = createRef<Node>();
  const g23gear = createRef<Circle>();
  const g23steps = [0, 1, 2].map(() => createRef<Rect>());
  const g23tag = createRef<Txt>();
  const g24 = createRef<Node>();
  const g24manual = createRef<Rect>();
  const g24auto = createRef<Rect>();
  const g24dev = createRef<Txt>();
  const g25 = createRef<Node>();
  const g25table = createRef<Rect>();
  const g25idx = createRef<Rect>();
  const g25query = createRef<Txt>();
  const g25bar = createRef<Rect>();
  const g26 = createRef<Node>();
  const g26gear = createRef<Circle>();
  const g26apps = [0, 1, 2, 3].map(() => createRef<Rect>());
  const g26lines = [0, 1, 2, 3].map(() => createRef<Line>());
  const g27 = createRef<Node>();
  const g27hand = createRef<Rect>();
  const g27gen = createRef<Rect>();
  const g27flag = createRef<Txt>();
  const g28 = createRef<Node>();
  const g28doc = createRef<Rect>();
  const g28rows = [0, 1, 2].map(() => createRef<Txt>());
  const g28tree = createRef<Txt>();
  const g29 = createRef<Node>();
  const g29fk = createRef<Rect>();
  const g29ref = createRef<Rect>();
  const g29line = createRef<Line>();
  const g29chip = createRef<Rect>();
  const g30 = createRef<Node>();
  const g30id = createRef<Rect>();
  const g30target = createRef<Rect>();
  const g30line = createRef<Line>();
  const g30road = createRef<Rect>();
  const g30x = createRef<Txt>();
  const g31 = createRef<Node>();
  const g31tree = createRef<Rect>();
  const g31doc = createRef<Rect>();
  const g31chain = createRef<Line>();
  const g31x = createRef<Txt>();
  const g32 = createRef<Node>();
  const g32a = createRef<Rect>();
  const g32b = createRef<Rect>();
  const g32q = createRef<Txt>();
  const g33 = createRef<Node>();
  const g33card = createRef<Rect>();
  const g33icons = [0, 1, 2].map(() => createRef<Rect>());

  view.add(
    <>
      <Txt
        ref={header}
        position={[-SAFE.halfW, -SAFE.halfH]}
        offset={[-1, -1]}
        fontSize={SIZE.label}
        fill={T.muted}
        fontFamily={FONT.sans}
        text={'历史重演'}
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

      {/* b23：优化器接管排序 */}
      <Node ref={g23} opacity={0}>
        <Circle ref={g23gear} position={[-380, -40]} width={180} height={180} fill={T.card} stroke={T.yellow} lineWidth={3}>
          <Txt fontSize={SIZE.label} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'优化器'} />
        </Circle>
        {[0, 1, 2].map(i => (
          <Rect key={`g23s-${i}`} ref={g23steps[i]} position={[220, -180 + i * 140]} width={420} height={90} radius={12} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={['步骤 A：扫表', '步骤 B：过滤', '步骤 C：用索引'][i]} />
          </Rect>
        ))}
        <Txt ref={g23tag} position={[220, 220]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'顺序由优化器定'} opacity={0} />
      </Node>

      {/* b24：手动选 vs 优化器自动选 */}
      <Node ref={g24} opacity={0}>
        <Rect ref={g24manual} position={[-280, -40]} width={380} height={240} radius={16} fill={T.card} stroke={T.red} lineWidth={2} opacity={0}>
          <Txt position={[0, -50]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'开发者手动选路径'} />
          <Txt position={[0, 40]} fontSize={SIZE.label} fill={T.red} fontFamily={FONT.sans} text={'每条查询都得想'} />
        </Rect>
        <Rect ref={g24auto} position={[280, -40]} width={380} height={240} radius={16} fill={T.card} stroke={T.green} lineWidth={3} opacity={0}>
          <Txt position={[0, -50]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'优化器自动选'} />
          <Txt position={[0, 40]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} text={'路径自动定好'} />
        </Rect>
        <Txt ref={g24dev} position={[0, 160]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'开发者转身去写别的代码了'} opacity={0} />
      </Node>

      {/* b25：加一个索引 */}
      <Node ref={g25} opacity={0}>
        <Rect ref={g25table} position={[0, -100]} width={640} height={180} radius={16} fill={T.card} stroke={T.line} lineWidth={2}>
          <Txt position={[0, -40]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.mono} text={'users'} />
          <Txt position={[0, 30]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'251   Bill   Gates'} />
        </Rect>
        <Rect ref={g25idx} position={[380, -100]} width={200} height={80} radius={12} fill={T.card} stroke={T.green} lineWidth={3} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} text={'新索引'} />
        </Rect>
        <Txt ref={g25query} position={[0, 60]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'查询（一字不动）'} opacity={0} />
        <Rect position={[-280, 140]} width={560} height={30} radius={15} fill={T.card} stroke={T.line} lineWidth={2} />
        <Rect ref={g25bar} position={[-280, 140]} offset={[-1, 0]} width={140} height={30} radius={15} fill={T.green} />
      </Node>

      {/* b26：建一次，人人受益 */}
      <Node ref={g26} opacity={0}>
        <Circle ref={g26gear} position={[0, -60]} width={200} height={200} fill={T.card} stroke={T.yellow} lineWidth={3}>
          <Txt fontSize={SIZE.label} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'优化器'} />
        </Circle>
        {[0, 1, 2, 3].map(i => (
          <Line key={`g26l-${i}`} ref={g26lines[i]} points={[[0, 40], [-450 + i * 300, 160]]} stroke={T.line} lineWidth={2} opacity={0} />
        ))}
        {[0, 1, 2, 3].map(i => (
          <Rect key={`g26a-${i}`} ref={g26apps[i]} position={[-450 + i * 300, 230]} width={200} height={80} radius={12} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={['应用 1', '应用 2', '应用 3', '应用 4'][i]} />
          </Rect>
        ))}
      </Node>

      {/* b27：手写路径 vs 通用优化器赛跑 */}
      <Node ref={g27} opacity={0}>
        <Txt position={[-520, -160]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'手写路径'} />
        <Rect position={[-520, -110]} offset={[-1, 0]} width={900} height={30} radius={15} fill={T.card} stroke={T.line} lineWidth={2} />
        <Rect ref={g27hand} position={[-520, -110]} offset={[-1, 0]} width={60} height={30} radius={15} fill={T.red} />
        <Txt position={[-520, 10]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'通用优化器'} />
        <Rect position={[-520, 60]} offset={[-1, 0]} width={900} height={30} radius={15} fill={T.card} stroke={T.line} lineWidth={2} />
        <Rect ref={g27gen} position={[-520, 60]} offset={[-1, 0]} width={60} height={30} radius={15} fill={T.green} />
        <Txt ref={g27flag} position={[470, 60]} fontSize={SIZE.title} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'✓ 终点'} opacity={0} />
      </Node>

      {/* b28：嵌套记录回来了 */}
      <Node ref={g28} opacity={0}>
        <Rect ref={g28doc} position={[0, -40]} width={560} height={340} radius={16} fill={T.card} stroke={T.green} lineWidth={2}>
          <Txt position={[0, -130]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.mono} text={'一份文档'} />
        </Rect>
        {[0, 1, 2].map(i => (
          <Txt key={`g28r-${i}`} ref={g28rows[i]} position={[0, -60 + i * 70]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={['工作经历（嵌在里面）', '教育经历（嵌在里面）', '联系方式（嵌在里面）'][i]} opacity={0} />
        ))}
        <Txt ref={g28tree} position={[430, -40]} fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.sans} text={'像一棵层次树'} opacity={0} />
      </Node>

      {/* b29：外键 = 文档引用 */}
      <Node ref={g29} opacity={0}>
        <Rect ref={g29fk} position={[-320, -40]} width={300} height={140} radius={14} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'外键'} />
        </Rect>
        <Rect ref={g29ref} position={[320, -40]} width={300} height={140} radius={14} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'文档引用'} />
        </Rect>
        <Line ref={g29line} points={[[-170, -40], [170, -40]]} stroke={T.yellow} lineWidth={3} opacity={0} />
        <Rect ref={g29chip} position={[0, -40]} width={130} height={70} radius={10} fill={T.card} stroke={T.yellow} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.body} fill={T.yellow} fontFamily={FONT.mono} text={'251'} />
        </Rect>
      </Node>

      {/* b30：读取时解析，网状路打叉 */}
      <Node ref={g30} opacity={0}>
        <Rect ref={g30id} position={[-320, -100]} width={240} height={90} radius={12} fill={T.card} stroke={T.yellow} lineWidth={2}>
          <Txt fontSize={SIZE.body} fill={T.yellow} fontFamily={FONT.mono} text={'251'} />
        </Rect>
        <Rect ref={g30target} position={[320, -100]} width={240} height={90} radius={12} fill={T.card} stroke={T.blue} lineWidth={2}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'相关条目'} />
        </Rect>
        <Line ref={g30line} points={[[-200, -100], [200, -100]]} stroke={T.yellow} lineWidth={3} opacity={0} />
        <Rect ref={g30road} position={[0, 110]} width={420} height={110} radius={14} fill={T.card} stroke={T.line} lineWidth={2} opacity={0.9}>
          <Txt fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'网状模型那条路'} />
        </Rect>
        <Txt ref={g30x} position={[160, 110]} fontSize={64} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'✗'} opacity={0} />
      </Node>

      {/* b31：回扣 */}
      <Node ref={g31} opacity={0}>
        <Rect ref={g31tree} position={[-300, -60]} width={340} height={220} radius={16} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt position={[0, -50]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'层次树'} />
          <Txt position={[0, 30]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'老形状回来了'} />
        </Rect>
        <Rect ref={g31doc} position={[300, -60]} width={340} height={220} radius={16} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt position={[0, -50]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'今天的文档'} />
          <Txt position={[0, 30]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'嵌套记录'} />
        </Rect>
        <Line ref={g31chain} points={[[-300, 140], [300, 140]]} stroke={T.red} lineWidth={3} opacity={0} />
        <Txt ref={g31x} key="qa-ignore-划掉指针链" position={[0, 140]} fontSize={64} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'✗'} opacity={0} />
      </Node>

      {/* b32：想一想 */}
      <Node ref={g32} opacity={0}>
        <Rect ref={g32a} position={[-280, -40]} width={380} height={220} radius={16} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt position={[0, -40]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'只说要什么'} />
        </Rect>
        <Rect ref={g32b} position={[280, -40]} width={380} height={220} radius={16} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt position={[0, -40]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'一步步告诉怎么走'} />
        </Rect>
        <Txt ref={g32q} position={[0, 140]} fontSize={72} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'?'} opacity={0} />
      </Node>

      {/* b33：下一站 */}
      <Node ref={g33} opacity={0}>
        <Rect ref={g33card} position={[0, -80]} width={560} height={200} radius={18} fill={T.card} stroke={T.yellow} lineWidth={3} opacity={0}>
          <Txt fontSize={SIZE.title} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'今天怎么选'} />
        </Rect>
        {[0, 1, 2].map(i => (
          <Rect key={`g33i-${i}`} ref={g33icons[i]} position={[-300 + i * 300, 140]} width={200} height={80} radius={12} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={['文档', '关系', '图'][i]} />
          </Rect>
        ))}
      </Node>
    </>
  );

  say('优化器接管选择');
  yield* beat('b23',
    all(g23().opacity(1, 0.5)),
    at('查询优化器', chain(g23gear().opacity(1, 0.4), g23steps[0]().opacity(1, 0.4))),
    at('会自动决定', g23steps[1]().opacity(1, 0.4)),
    at('先执行查询的哪一部分', chain(g23steps[2]().opacity(1, 0.4), g23steps[2]().position([220, -180], 0.6), g23steps[0]().position([220, -40], 0.6), g23steps[1]().position([220, 100], 0.6))),
    at('用哪些索引', g23tag().opacity(1, 0.4)),
  );

  say('路径还是那条路，人不用选了');
  yield* beat('b24',
    all(g23().opacity(0, 0.5), g24().opacity(1, 0.5)),
    at('访问路径', g24manual().opacity(1, 0.5)),
    at('优化器自动做', g24auto().opacity(1, 0.5)),
    at('很少需要想它们', g24dev().opacity(1, 0.4)),
  );

  say('加一个索引，查询自动变快');
  yield* beat('b25',
    all(g24().opacity(0, 0.5), g25().opacity(1, 0.5)),
    at('声明一个新索引', g25idx().opacity(1, 0.5)),
    at('自动用最合适的索引', g25bar().width(560, 1.5)),
    at('不用改查询', g25query().opacity(1, 0.4)),
  );

  say('建一次，人人受益');
  yield* beat('b26',
    all(g25().opacity(0, 0.5), g26().opacity(1, 0.5)),
    at('复杂的家伙', g26gear().scale(1.08, 0.6)),
    at('只需建一次', g26gear().scale(1, 0.6)),
    at('所有用这个数据库的应用都能受益', chain(
      all(g26lines[0]().opacity(1, 0.3), g26apps[0]().opacity(1, 0.3), g26apps[0]().position([-450, 200], 0.3)),
      all(g26lines[1]().opacity(1, 0.3), g26apps[1]().opacity(1, 0.3), g26apps[1]().position([-150, 200], 0.3)),
      all(g26lines[2]().opacity(1, 0.3), g26apps[2]().opacity(1, 0.3), g26apps[2]().position([150, 200], 0.3)),
      all(g26lines[3]().opacity(1, 0.3), g26apps[3]().opacity(1, 0.3), g26apps[3]().position([450, 200], 0.3)),
    )),
  );

  say('通用方案长远胜出');
  yield* beat('b27',
    all(g26().opacity(0, 0.5), g27().opacity(1, 0.5)),
    at('手写访问路径', g27hand().width(300, 1.0)),
    at('通用优化器', g27gen().width(900, 2.5)),
    at('长远看', g27flag().opacity(1, 0.4)),
  );

  say('嵌套记录回来了');
  yield* beat('b28',
    all(g27().opacity(0, 0.5), g28().opacity(1, 0.5)),
    at('嵌套记录', chain(g28rows[0]().opacity(1, 0.4), g28rows[1]().opacity(1, 0.4), g28rows[2]().opacity(1, 0.4))),
    at('层次模型', g28tree().opacity(1, 0.4)),
  );

  say('外键 = 文档引用');
  yield* beat('b29',
    all(g28().opacity(0, 0.5), g29().opacity(1, 0.5)),
    at('没有本质不同', g29fk().opacity(1, 0.5)),
    at('唯一标识符', chain(g29line().opacity(1, 0.4), g29chip().opacity(1, 0.4), g29ref().opacity(1, 0.5))),
    at('外键', g29fk().lineWidth(4, 0.4)),
    at('文档引用', g29ref().lineWidth(4, 0.4)),
  );

  say('读取时才解析，没走那条路');
  yield* beat('b30',
    all(g29().opacity(0, 0.5), g30().opacity(1, 0.5)),
    at('读取时', g30line().opacity(1, 0.5)),
    at('文档库没有走网状模型那条路', chain(g30road().opacity(1, 0.4), g30x().opacity(1, 0.4))),
  );

  say('捡回了树，没碰指针链');
  yield* beat('b31',
    all(g30().opacity(0, 0.5), g31().opacity(1, 0.5)),
    at('层次模型的老形状', g31tree().opacity(1, 0.3)),
    at('但它没碰', g31doc().opacity(1, 0.5)),
    at('手写访问路径', chain(g31chain().opacity(1, 0.4), g31x().opacity(1, 0.4))),
  );

  say('你的查询像哪一种？');
  yield* beat('b32',
    all(g31().opacity(0, 0.5), g32().opacity(1, 0.5)),
    at('只说要什么', g32a().opacity(1, 0.3)),
    at('一步步告诉数据库怎么走', g32b().opacity(1, 0.4)),
    at('想一想', g32q().opacity(1, 0.4)),
  );

  say('下一站：今天怎么选');
  yield* beat('b33',
    all(g32().opacity(0, 0.5), g33().opacity(1, 0.5)),
    at('今天怎么选', g33card().opacity(1, 0.3)),
    at('选模型看流行度', g33icons[0]().opacity(1, 0.4)),
    at('看你的数据长什么样', chain(g33icons[1]().opacity(1, 0.4), g33icons[2]().opacity(1, 0.4))),
  );
});
