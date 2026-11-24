// U4 场景 4（MC）：b26a–b33 —— 写时复制、键缩写、叶页顺序、兄弟指针、分形树、两派回扣、
// 结尾句。分镜：skill-ch03/beats-u4.md；原文：DDIA §3.4（书页 p82–83，PDF p104–105）。
// 时长全部来自 timeline/u4.json（beat() 驱动），不手写 waitFor。
import {Circle, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, chain, createRef} from '@motion-canvas/core';
import {at, makeBeats} from '../../lib/beats';
import {FONT, SAFE, SIZE, T} from '../../lib/theme';
import timeline from '../../timeline/u4.json';

export default makeScene2D(function* (view) {
  view.fill(T.bg);
  const beat = makeBeats(timeline);

  const header = createRef<Txt>();
  const anchor = createRef<Txt>();
  const say = (text: string) => anchor().text(text);

  // b26：写时复制
  const g26 = createRef<Node>();
  const g26parent = createRef<Rect>();
  const g26parent2 = createRef<Rect>();
  const g26old = createRef<Rect>();
  const g26new = createRef<Rect>();
  const g26lmdb = createRef<Txt>();
  const g26arrOld = createRef<Line>();
  const g26arrNew = createRef<Line>();
  const g26latch = createRef<Txt>();
  // b27：键缩写
  const g27 = createRef<Node>();
  const g27page = createRef<Rect>();
  const g27full = [0, 1, 2].map(() => createRef<Txt>());
  const g27pre = [0, 1, 2].map(() => createRef<Txt>());
  const g27tick = [0, 1, 2].map(() => createRef<Rect>());
  const g27branch = createRef<Txt>();
  const g27level = createRef<Rect>();
  const g27levelLab = createRef<Txt>();
  const g27bplus = createRef<Txt>();
  // b28/b29：叶页顺序
  const g28 = createRef<Node>();
  const g28disk = createRef<Rect>();
  const g28leaf = [0, 1, 2, 3, 4].map(() => createRef<Rect>());
  const g28dot = createRef<Circle>();
  const g28seek = createRef<Txt>();
  const g29 = createRef<Node>();
  const g29leaf = [0, 1, 2, 3, 4].map(() => createRef<Rect>());
  const g29grow = createRef<Rect>();
  const g29seg = createRef<Rect>();
  const g29keys = [0, 1, 2, 3, 4].map(() => createRef<Txt>());
  // b30：兄弟指针
  const g30 = createRef<Node>();
  const g30leaf = [0, 1, 2, 3].map(() => createRef<Rect>());
  const g30arr = [0, 1, 2].map(() => createRef<Line>());
  const g30parent = createRef<Rect>();
  const g30dot = createRef<Circle>();
  // b31：分形树
  const g31 = createRef<Node>();
  const g31card = createRef<Rect>();
  const g31long = createRef<Line>();
  const g31short = createRef<Line>();
  const g31note = createRef<Txt>();
  // b32：两派回扣
  const g32 = createRef<Node>();
  const g32left = createRef<Rect>();
  const g32right = createRef<Rect>();
  const g32segs = [0, 1, 2, 3].map(() => createRef<Rect>());
  const g32page = createRef<Rect>();
  const g32wal = createRef<Rect>();
  // b33：结尾
  const g33 = createRef<Node>();
  const g33c = [0, 1, 2].map(() => createRef<Rect>());

  view.add(
    <>
      <Txt
        ref={header}
        position={[-SAFE.halfW, -SAFE.halfH]}
        offset={[-1, -1]}
        fontSize={SIZE.label}
        fill={T.muted}
        fontFamily={FONT.sans}
        text={'B 树：把数据切成页'}
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

      {/* b26：写时复制 */}
      <Node ref={g26} opacity={0}>
        <Rect ref={g26parent} position={[0, -230]} width={300} height={80} radius={14} fill={T.card} stroke={T.blue} lineWidth={3} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'父页'} />
        </Rect>
        <Rect ref={g26parent2} position={[0, -230]} width={300} height={80} radius={14} fill={T.card} stroke={T.yellow} lineWidth={3} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'父页的新版本'} />
        </Rect>
        <Rect ref={g26old} position={[-300, -60]} width={220} height={120} radius={14} fill={T.card} stroke={T.line} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'旧页'} />
        </Rect>
        <Rect ref={g26new} position={[-300, -60]} width={220} height={120} radius={14} fill={T.card} stroke={T.green} lineWidth={3} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} text={'新位置'} />
        </Rect>
        <Txt ref={g26lmdb} position={[-300, 50]} fontSize={SIZE.label} fill={T.purple} fontFamily={FONT.mono} text={'LMDB'} opacity={0} />
        <Line ref={g26arrOld} points={[[0, -190], [-300, -120]]} stroke={T.muted} lineWidth={2} endArrow opacity={0} />
        <Line ref={g26arrNew} points={[[0, -190], [300, -120]]} stroke={T.green} lineWidth={3} endArrow opacity={0} />
        <Txt ref={g26latch} position={[0, 140]} fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.sans} text={'并发控制也有用'} opacity={0} />
      </Node>

      {/* b27：键缩写 */}
      <Node ref={g27} opacity={0}>
        <Rect ref={g27page} position={[0, -120]} width={760} height={200} radius={16} fill={T.card} stroke={T.blue} lineWidth={3} opacity={0}>
          <Txt position={[-320, -75]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'内部页'} />
        </Rect>
        {['user_0001234567', 'user_0001234987', 'user_0001235111'].map((k, i) => (
          <Txt key={`g27f-${i}`} ref={g27full[i]} position={[0, -180 + i * 60]} fontSize={20} fill={T.text} fontFamily={FONT.mono} text={k} opacity={0} />
        ))}
        {['user_0001…', 'user_0001…', 'user_0001…'].map((k, i) => (
          <Txt key={`g27p-${i}`} ref={g27pre[i]} position={[0, -180 + i * 60]} fontSize={20} fill={T.yellow} fontFamily={FONT.mono} text={k} opacity={0} />
        ))}
        {[0, 1, 2].map(i => (
          <Rect key={`g27t-${i}`} ref={g27tick[i]} position={[-260, -180 + i * 60]} width={10} height={30} fill={T.yellow} opacity={0} />
        ))}
        <Txt ref={g27branch} position={[0, 40]} fontSize={SIZE.body} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'分支因子更高'} opacity={0} />
        <Rect ref={g27level} position={[-200, 140]} width={400} height={40} radius={8} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'层数'} />
        </Rect>
        <Txt ref={g27levelLab} position={[150, 140]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} text={'层数更少'} opacity={0} />
        <Txt ref={g27bplus} position={[330, 40]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.mono} text={'B+ 树'} opacity={0} />
      </Node>

      {/* b28/b29：叶页顺序 */}
      <Node ref={g28} opacity={0}>
        <Rect ref={g28disk} position={[0, 0]} width={1000} height={360} radius={16} fill={T.card} stroke={T.muted} lineWidth={2} opacity={0}>
          <Txt position={[440, -150]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'磁盘'} />
        </Rect>
        {[[-380, -110], [-80, -150], [220, -90], [-250, 80], [150, 100]].map(([x, y], i) => (
          <Rect key={`g28l-${i}`} ref={g28leaf[i]} position={[x, y]} width={180} height={70} radius={12} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'叶页'} />
          </Rect>
        ))}
        <Circle ref={g28dot} position={[-380, -158]} width={26} height={26} fill={T.yellow} opacity={0} />
        <Txt ref={g28seek} position={[0, 210]} fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.sans} text={'每跳一次，都要寻道'} opacity={0} />
      </Node>
      <Node ref={g29} opacity={0}>
        {[[-380, -110], [-80, -150], [220, -90], [-250, 80], [150, 100]].map(([x, y], i) => (
          <Rect key={`g29l-${i}`} ref={g29leaf[i]} position={[x, y]} width={180} height={70} radius={12} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'叶页'} />
          </Rect>
        ))}
        <Rect ref={g29grow} position={[0, -230]} width={500} height={50} radius={10} fill={T.card} stroke={T.purple} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.purple} fontFamily={FONT.sans} text={'树长大，新的一层'} />
        </Rect>
        <Rect ref={g29seg} position={[0, 0]} width={1000} height={70} radius={12} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt position={[-440, 0]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} text={'合并重写'} />
        </Rect>
        {[100, 200, 300, 400, 500].map((k, i) => (
          <Txt key={`g29k-${i}`} ref={g29keys[i]} position={[-300 + i * 150, 0]} fontSize={20} fill={T.text} fontFamily={FONT.mono} text={String(k)} opacity={0} />
        ))}
      </Node>

      {/* b30：兄弟指针 */}
      <Node ref={g30} opacity={0}>
        <Rect ref={g30parent} position={[0, -220]} width={260} height={70} radius={14} fill={T.card} stroke={T.line} lineWidth={2} opacity={0.4}>
          <Txt fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'父页'} />
        </Rect>
        {[-420, -140, 140, 420].map((x, i) => (
          <Rect key={`g30l-${i}`} ref={g30leaf[i]} position={[x, -40]} width={220} height={90} radius={14} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'叶页'} />
          </Rect>
        ))}
        <Line ref={g30arr[0]} points={[[-310, -40], [-250, -40]]} stroke={T.green} lineWidth={3} endArrow opacity={0} />
        <Line ref={g30arr[1]} points={[[-30, -40], [30, -40]]} stroke={T.green} lineWidth={3} endArrow opacity={0} />
        <Line ref={g30arr[2]} points={[[250, -40], [310, -40]]} stroke={T.green} lineWidth={3} endArrow opacity={0} />
        <Circle ref={g30dot} position={[-420, -95]} width={26} height={26} fill={T.yellow} opacity={0} />
      </Node>

      {/* b31：分形树 */}
      <Node ref={g31} opacity={0}>
        <Rect ref={g31card} position={[0, -60]} width={420} height={180} radius={16} fill={T.card} stroke={T.purple} lineWidth={3} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'分形树'} />
          <Txt position={[0, 50]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'借日志结构的思路'} />
        </Rect>
        <Line ref={g31long} points={[[-480, 140], [-80, 140]]} stroke={T.red} lineWidth={3} endArrow opacity={0} />
        <Txt position={[-280, 180]} fontSize={SIZE.label} fill={T.red} fontFamily={FONT.sans} text={'寻道：长'} />
        <Line ref={g31short} points={[[80, 140], [200, 140]]} stroke={T.green} lineWidth={3} endArrow opacity={0} />
        <Txt position={[140, 180]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} text={'寻道：短'} />
        <Txt ref={g31note} position={[0, 230]} fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.sans} text={'和分形没关系'} opacity={0} />
      </Node>

      {/* b32：两派回扣 */}
      <Node ref={g32} opacity={0}>
        <Rect ref={g32left} position={[-290, -60]} width={380} height={180} radius={16} fill={T.card} stroke={T.line} lineWidth={2} opacity={0}>
          <Txt position={[0, -60]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'变长段 · 只追加'} />
        </Rect>
        {[0, 1, 2, 3].map(i => (
          <Rect key={`g32s-${i}`} ref={g32segs[i]} position={[-425 + i * 90, 20]} width={80} height={50} radius={8} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0} />
        ))}
        <Rect ref={g32right} position={[290, -60]} width={380} height={180} radius={16} fill={T.card} stroke={T.yellow} lineWidth={3} opacity={0}>
          <Txt position={[0, -60]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'固定页 · 原地改'} />
        </Rect>
        <Rect ref={g32page} position={[290, -10]} width={200} height={60} radius={10} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'一页'} />
        </Rect>
        <Rect ref={g32wal} position={[290, 55]} width={200} height={44} radius={10} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} text={'预写日志'} />
        </Rect>
      </Node>

      {/* b33：结尾 */}
      <Node ref={g33} opacity={0}>
        {[['固定页', -360], ['平衡树', 0], ['原地写回', 360]].map(([t, x], i) => (
          <Rect key={`g33c-${i}`} ref={g33c[i]} position={[x as number, -60]} width={240} height={100} radius={16} fill={T.card} stroke={T.yellow} lineWidth={3} opacity={0}>
            <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={t as string} />
          </Rect>
        ))}
      </Node>
    </>
  );

  say('改了写别处');
  yield* beat('b26a',
    all(g26().opacity(1, 0.5)),
    at('写时复制', all(g26parent().opacity(1, 0.5), g26old().opacity(1, 0.5), g26arrOld().opacity(1, 0.4))),
    at('LMDB', g26lmdb().opacity(1, 0.5)),
    at('写到别处', all(g26new().opacity(1, 0.5), g26new().position([300, -60], 1.4))),
  );

  say('父页指新址');
  yield* beat('b26b',
    at('父页的新版本', all(g26parent().opacity(0, 0.4), g26parent2().opacity(1, 0.4))),
    at('指向新位置', all(g26arrOld().opacity(0, 0.4), g26arrNew().opacity(1, 0.5))),
    at('并发控制', g26latch().opacity(1, 0.5)),
  );

  say('边界键只存前缀');
  yield* beat('b27a',
    all(g26().opacity(0, 0.5), g27().opacity(1, 0.5)),
    at('键缩写', all(g27page().opacity(1, 0.5), g27full[0]().opacity(1, 0.4), g27full[1]().opacity(1, 0.4), g27full[2]().opacity(1, 0.4))),
    at('只存缩写', all(g27full[0]().opacity(0, 0.4), g27full[1]().opacity(0, 0.4), g27full[2]().opacity(0, 0.4), g27pre[0]().opacity(1, 0.4), g27pre[1]().opacity(1, 0.4), g27pre[2]().opacity(1, 0.4))),
    at('范围边界', all(g27tick[0]().opacity(1, 0.4), g27tick[1]().opacity(1, 0.4), g27tick[2]().opacity(1, 0.4))),
  );

  say('更多键，更少层');
  yield* beat('b27b',
    at('更多键', g27branch().opacity(1, 0.5)),
    at('层数更少', all(g27level().opacity(1, 0.5), g27level().width(240, 1.2), g27levelLab().opacity(1, 0.5))),
    at('B 加树', g27bplus().opacity(1, 0.5)),
  );

  say('叶页不必相邻');
  yield* beat('b28a',
    all(g27().opacity(0, 0.5), g28().opacity(1, 0.5)),
    at('任何位置', all(g28disk().opacity(1, 0.5), g28leaf[0]().opacity(1, 0.4), g28leaf[1]().opacity(1, 0.4), g28leaf[2]().opacity(1, 0.4), g28leaf[3]().opacity(1, 0.4), g28leaf[4]().opacity(1, 0.4))),
    at('不必相邻', all(g28leaf[0]().stroke(T.yellow, 0.4), g28leaf[2]().stroke(T.yellow, 0.4))),
  );

  say('每页一次寻道');
  yield* beat('b28b',
    at('每读一页', chain(g28dot().opacity(1, 0.3), g28dot().position([-80, -198], 0.6), g28dot().position([220, -138], 0.6), g28dot().position([-250, 32], 0.6), g28dot().position([150, 52], 0.6))),
    at('一次寻道', g28seek().opacity(1, 0.5)),
  );

  say('顺序难维持');
  yield* beat('b29a',
    all(g28().opacity(0, 0.5), g29().opacity(1, 0.5), g29leaf[0]().opacity(1, 0.4), g29leaf[1]().opacity(1, 0.4), g29leaf[2]().opacity(1, 0.4), g29leaf[3]().opacity(1, 0.4), g29leaf[4]().opacity(1, 0.4)),
    at('顺序出现', all(g29leaf[0]().position([-400, 0], 1.2), g29leaf[1]().position([-200, 0], 1.2), g29leaf[2]().position([0, 0], 1.2), g29leaf[3]().position([200, 0], 1.2), g29leaf[4]().position([400, 0], 1.2))),
    at('很难维持', all(g29grow().opacity(1, 0.5), g29leaf[0]().position([-380, -110], 1.2), g29leaf[1]().position([-80, -150], 1.2), g29leaf[2]().position([220, -90], 1.2), g29leaf[3]().position([-250, 80], 1.2), g29leaf[4]().position([150, 100], 1.2))),
  );

  say('合并重写更整齐');
  yield* beat('b29b',
    at('重写大段存储', all(g29grow().opacity(0, 0.4), g29leaf[0]().opacity(0, 0.3), g29leaf[1]().opacity(0, 0.3), g29leaf[2]().opacity(0, 0.3), g29leaf[3]().opacity(0, 0.3), g29leaf[4]().opacity(0, 0.3), g29seg().opacity(1, 0.5))),
    at('靠在一起', chain(g29keys[0]().opacity(1, 0.2), g29keys[1]().opacity(1, 0.2), g29keys[2]().opacity(1, 0.2), g29keys[3]().opacity(1, 0.2), g29keys[4]().opacity(1, 0.2))),
  );

  say('叶页加兄弟引用');
  yield* beat('b30a',
    all(g29().opacity(0, 0.5), g30().opacity(1, 0.5), g30leaf[0]().opacity(1, 0.4), g30leaf[1]().opacity(1, 0.4), g30leaf[2]().opacity(1, 0.4), g30leaf[3]().opacity(1, 0.4)),
  );

  say('指向左右兄弟页');
  yield* beat('b30c',
    at('指向左右的兄弟页', all(g30arr[0]().opacity(1, 0.4), g30arr[1]().opacity(1, 0.4), g30arr[2]().opacity(1, 0.4), g30dot().opacity(1, 0.4), g30dot().position([-140, -95], 0.8))),
    at('兄弟指针', g30dot().position([140, -95], 0.6)),
  );

  say('不用跳回父页');
  yield* beat('b30b',
    all(g30dot().position([420, -95], 0.8), g30parent().opacity(0.25, 0.5)),
  );

  say('和分形没关系');
  yield* beat('b31',
    all(g30().opacity(0, 0.5), g31().opacity(1, 0.5)),
    at('分形树', g31card().opacity(1, 0.5)),
    at('减少寻道', all(g31long().opacity(1, 0.5), g31short().opacity(1, 0.5))),
    at('和分形没关系', g31note().opacity(1, 0.5)),
  );

  say('同是排序，哲学不同');
  yield* beat('b32a',
    all(g31().opacity(0, 0.5), g32().opacity(1, 0.5), g32left().opacity(1, 0.5), g32right().opacity(1, 0.5)),
  );

  say('两派对照');
  yield* beat('b32b',
    at('只追加不改', all(g32segs[0]().opacity(1, 0.3), g32segs[1]().opacity(1, 0.3), g32segs[2]().opacity(1, 0.3), g32segs[3]().opacity(1, 0.3))),
    at('原地改', all(g32page().opacity(1, 0.5), g32page().stroke(T.yellow, 0.4))),
    at('靠日志保命', g32wal().opacity(1, 0.5)),
  );

  say('页固定，树平衡');
  yield* beat('b33',
    all(g32().opacity(0, 0.5), g33().opacity(1, 0.5)),
    at('固定大小', g33c[0]().opacity(1, 0.5)),
    at('永远平衡', g33c[1]().opacity(1, 0.5)),
    at('原地写回去', g33c[2]().opacity(1, 0.5)),
  );
});
