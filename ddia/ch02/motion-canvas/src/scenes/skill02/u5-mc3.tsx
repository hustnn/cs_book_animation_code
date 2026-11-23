// U5 场景 3（MC）：b32–b47 —— 局部性、趋同、回扣与过渡。
// 分镜：skill-ch02/beats-u5.md U5 一节；原文：DDIA §2.6（书页 p41–42）。
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

  const g32 = createRef<Node>();
  const g32json = createRef<Txt>();
  const g32xml = createRef<Txt>();
  const g32bson = createRef<Txt>();
  const g33 = createRef<Node>();
  const g33doc = createRef<Rect>();
  const g33bar = createRef<Rect>();
  const g34 = createRef<Node>();
  const g34t = [0, 1, 2, 3, 4, 5].map(() => createRef<Rect>());
  const g34seek = createRef<Txt>();
  const g35 = createRef<Node>();
  const g35part = createRef<Rect>();
  const g35waste = createRef<Txt>();
  const g36 = createRef<Node>();
  const g36in = createRef<Txt>();
  const g36small = createRef<Txt>();
  const g37 = createRef<Node>();
  const g37c = [0, 1, 2].map(() => createRef<Rect>());
  const g38 = createRef<Node>();
  const g38branch = createRef<Rect>();
  const g38t = [0, 1, 2].map(() => createRef<Txt>());
  const g39 = createRef<Node>();
  const g39p = [0, 1, 2].map(() => createRef<Circle>());
  const g40 = createRef<Node>();
  const g40branch = createRef<Rect>();
  const g40client = createRef<Txt>();
  const g41 = createRef<Node>();
  const g41bar = createRef<Rect>();
  const g42 = createRef<Node>();
  const g42dot = createRef<Circle>();
  const g42mix = createRef<Txt>();
  const g43 = createRef<Node>();
  const g43sign = createRef<Txt>();
  const g44 = createRef<Node>();
  const g44nest = createRef<Rect>();
  const g45 = createRef<Node>();
  const g45doc = createRef<Rect>();
  const g45net = createRef<Rect>();
  const g46 = createRef<Node>();
  const g46a = createRef<Rect>();
  const g46b = createRef<Rect>();
  const g47 = createRef<Node>();
  const g47card = createRef<Rect>();
  const g47code = createRef<Txt>();

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

      {/* b32a/b32b：一串连续的字节 + 三种编码 */}
      <Node ref={g32} opacity={0}>
        <Rect position={[0, -80]} width={860} height={110} radius={14} fill={T.card} stroke={T.green} lineWidth={3}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'01010111 01100001 01110100 01100001 …'} />
        </Rect>
        <Txt ref={g32json} position={[-360, 60]} fontSize={SIZE.title} fontWeight={700} fill={T.blue} fontFamily={FONT.mono} text={'JSON'} opacity={0} />
        <Txt ref={g32xml} position={[0, 60]} fontSize={SIZE.title} fontWeight={700} fill={T.blue} fontFamily={FONT.mono} text={'XML'} opacity={0} />
        <Txt ref={g32bson} position={[360, 60]} fontSize={SIZE.title} fontWeight={700} fill={T.blue} fontFamily={FONT.mono} text={'BSON'} opacity={0} />
      </Node>

      {/* b33：整份文档一次取完 */}
      <Node ref={g33} opacity={0}>
        <Rect position={[0, -60]} width={520} height={260} radius={16} fill={T.card} stroke={T.blue} lineWidth={2}>
          <Txt position={[0, -80]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'网页'} />
          <Txt position={[0, 0]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'整份文档在这里渲染'} />
        </Rect>
        <Rect ref={g33doc} position={[-420, -60]} width={180} height={120} radius={12} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'一份文档'} />
        </Rect>
        <Rect ref={g33bar} position={[0, 130]} width={500} height={28} radius={8} fill={T.green} opacity={0} />
      </Node>

      {/* b34a/b34b：六张表 + 寻道计数 */}
      <Node ref={g34} opacity={0}>
        {[0, 1, 2, 3, 4, 5].map(i => (
          <Rect key={`g34-${i}`} ref={g34t[i]} position={[-420 + (i % 3) * 420, -140 + Math.floor(i / 3) * 150]} width={320} height={110} radius={12} fill={T.card} stroke={T.line} lineWidth={2} opacity={0}>
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={['表 1', '表 2', '表 3', '表 4', '表 5', '表 6'][i]} />
          </Rect>
        ))}
        <Txt ref={g34seek} position={[0, 150]} fontSize={SIZE.title} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'寻道 ×6 · 更花时间'} opacity={0} />
      </Node>

      {/* b35：只取一小块，也要搬整份 */}
      <Node ref={g35} opacity={0}>
        <Rect position={[0, -60]} width={640} height={220} radius={16} fill={T.card} stroke={T.blue} lineWidth={2}>
          <Txt position={[0, -60]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'整份文档'} />
          <Txt position={[0, 20]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'大文档 · 很多内容'} />
        </Rect>
        <Rect ref={g35part} position={[-200, -120]} width={180} height={80} radius={10} fill={T.card} stroke={T.yellow} lineWidth={3} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.sans} text={'只要这一小块'} />
        </Rect>
        <Txt ref={g35waste} position={[0, 130]} fontSize={SIZE.title} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'很浪费'} opacity={0} />
      </Node>

      {/* b36：重写整份，文档保持小 */}
      <Node ref={g36} opacity={0}>
        <Rect position={[0, -80]} width={560} height={180} radius={16} fill={T.card} stroke={T.yellow} lineWidth={2}>
          <Txt position={[0, -30]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'文档被整体重写'} />
          <Txt position={[0, 40]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'改一处，重写全部'} />
        </Rect>
        <Txt ref={g36in} position={[-280, 80]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} text={'等长修改可原地执行 ✓'} opacity={0} />
        <Txt ref={g36small} position={[280, 80]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} text={'文档保持小'} opacity={0} />
      </Node>

      {/* b37：三家都在求局部性 */}
      <Node ref={g37} opacity={0}>
        {['Spanner · 嵌套行', 'Oracle · 聚簇表', 'Bigtable · 列族'].map((label, i) => (
          <Rect key={`g37-${i}`} ref={g37c[i]} position={[-360 + i * 360, -40]} width={300} height={180} radius={16} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={label} />
          </Rect>
        ))}
      </Node>

      {/* b38：关系库长出 XML */}
      <Node ref={g38} opacity={0}>
        <Rect position={[-200, -40]} width={380} height={220} radius={16} fill={T.card} stroke={T.blue} lineWidth={2}>
          <Txt position={[0, -50]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'关系库'} />
          <Txt position={[0, 30]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'2000 年代中期起'} />
        </Rect>
        <Rect ref={g38branch} position={[280, -40]} width={380} height={220} radius={16} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt position={[0, -70]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'XML'} />
          <Txt ref={g38t[0]} position={[0, 0]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'局部修改'} opacity={0} />
          <Txt ref={g38t[1]} position={[0, 40]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'建索引'} opacity={0} />
          <Txt ref={g38t[2]} position={[0, 80]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'查文档'} opacity={0} />
        </Rect>
      </Node>

      {/* b39：版本号时间线 */}
      <Node ref={g39} opacity={0}>
        <Line points={[[-500, -40], [500, -40]]} stroke={T.line} lineWidth={3} />
        {['PostgreSQL 9.3', 'MySQL 5.7', 'IBM DB2 10.5'].map((label, i) => (
          <Node key={`g39-${i}`}>
            <Circle ref={g39p[i]} position={[-360 + i * 360, -40]} width={36} height={36} fill={T.green} opacity={0} />
            <Txt position={[-360 + i * 360, 40]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={label} />
          </Node>
        ))}
      </Node>

      {/* b40：文档库也学 join */}
      <Node ref={g40} opacity={0}>
        <Rect position={[-200, -40]} width={380} height={220} radius={16} fill={T.card} stroke={T.green} lineWidth={2}>
          <Txt position={[0, -50]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'文档库'} />
          <Txt position={[0, 30]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'RethinkDB / MongoDB'} />
        </Rect>
        <Rect ref={g40branch} position={[280, -40]} width={380} height={220} radius={16} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt position={[0, -50]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'关系式 join'} />
          <Txt position={[0, 30]} fontSize={SIZE.label} fill={T.blue} fontFamily={FONT.sans} text={'客户端解析引用'} />
        </Rect>
        <Txt ref={g40client} position={[0, 130]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'其实是在客户端做 join'} opacity={0} />
      </Node>

      {/* b41：客户端 join 更慢 */}
      <Node ref={g41} opacity={0}>
        <Txt position={[0, -180]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'客户端来回跑三趟取数据'} />
        <Rect position={[-200, -60]} width={300} height={90} radius={12} fill={T.card} stroke={T.yellow} lineWidth={2}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'客户端 join'} />
        </Rect>
        <Rect ref={g41bar} position={[-200, 40]} width={140} height={30} radius={8} fill={T.yellow} opacity={0} />
        <Rect position={[200, -60]} width={300} height={90} radius={12} fill={T.card} stroke={T.green} lineWidth={2}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'库里 join'} />
        </Rect>
        <Rect position={[200, 40]} width={280} height={30} radius={8} fill={T.green} />
      </Node>

      {/* b42：两条线汇合 */}
      <Node ref={g42} opacity={0}>
        <Line points={[[-500, -140], [0, -40]]} stroke={T.blue} lineWidth={3} />
        <Line points={[[500, -140], [0, -40]]} stroke={T.green} lineWidth={3} />
        <Circle ref={g42dot} position={[-500, -140]} width={24} height={24} fill={T.yellow} opacity={0} />
        <Txt position={[-380, -180]} fontSize={SIZE.label} fill={T.blue} fontFamily={FONT.sans} text={'关系库'} />
        <Txt position={[380, -180]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} text={'文档库'} />
        <Txt ref={g42mix} position={[0, 60]} fontSize={SIZE.title} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'越来越像 · 这是好事'} opacity={0} />
      </Node>

      {/* b43：混合是未来的一条好路 */}
      <Node ref={g43} opacity={0}>
        <Line points={[[-500, 0], [500, 0]]} stroke={T.green} lineWidth={4} />
        <Txt position={[0, -80]} fontSize={SIZE.title} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'关系 + 文档'} />
        <Txt ref={g43sign} position={[0, 90]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} text={'混合，是未来的一条好路'} opacity={0} />
      </Node>

      {/* b44：最初的描述就允许嵌套 */}
      <Node ref={g44} opacity={0}>
        <Rect position={[-240, -40]} width={400} height={220} radius={16} fill={T.card} stroke={T.yellow} lineWidth={2}>
          <Txt position={[0, -60]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'最初的描述'} />
          <Txt position={[0, 10]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'行里的值'} />
        </Rect>
        <Rect ref={g44nest} position={[-240, 60]} width={260} height={70} radius={10} fill={T.card} stroke={T.purple} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'嵌套的表'} />
        </Rect>
        <Txt position={[280, -40]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'→ 今天的 JSON 与 XML'} />
      </Node>

      {/* b45：回扣 */}
      <Node ref={g45} opacity={0}>
        <Rect ref={g45doc} position={[-280, -40]} width={380} height={200} radius={16} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt position={[0, -40]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'自包含的文档'} />
          <Txt position={[0, 40]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} text={'整棵树一次加载'} />
        </Rect>
        <Rect ref={g45net} position={[280, -40]} width={380} height={200} radius={16} fill={T.card} stroke={T.purple} lineWidth={2} opacity={0}>
          <Txt position={[0, -40]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'互相牵连的网'} />
          <Txt position={[0, 40]} fontSize={SIZE.label} fill={T.purple} fontFamily={FONT.sans} text={'越连越密，图最自然'} />
        </Rect>
      </Node>

      {/* b46：停下来想一想 */}
      <Node ref={g46} opacity={0}>
        <Rect ref={g46a} position={[-280, -40]} width={380} height={200} radius={16} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt position={[0, -40]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'多对多关系多吗？'} />
        </Rect>
        <Rect ref={g46b} position={[280, -40]} width={380} height={200} radius={16} fill={T.card} stroke={T.yellow} lineWidth={2} opacity={0}>
          <Txt position={[0, -40]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'读时兜底？'} />
          <Txt position={[0, 40]} fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.sans} text={'还是写时盖章？'} />
        </Rect>
      </Node>

      {/* b47：下一站，只说要什么 */}
      <Node ref={g47} opacity={0}>
        <Rect ref={g47card} position={[0, -60]} width={520} height={180} radius={16} fill={T.card} stroke={T.yellow} lineWidth={3} opacity={0}>
          <Txt fontSize={SIZE.title} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'只说要什么'} />
        </Rect>
        <Txt ref={g47code} position={[0, 110]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'怎么做 vs 要什么'} opacity={0} />
      </Node>
    </>
  );

  say('一串连续的字节');
  yield* beat('b32a',
    all(g32().opacity(1, 0.5)),
    at('一串连续的字节', waitFor(0.01)),
  );

  say('JSON、XML、BSON');
  yield* beat('b32b',
    all(),
    at('JSON', g32json().opacity(1, 0.4)),
    at('XML', g32xml().opacity(1, 0.4)),
    at('BSON', g32bson().opacity(1, 0.4)),
  );

  say('一次取完');
  yield* beat('b33',
    all(g32().opacity(0, 0.5), g33().opacity(1, 0.5)),
    at('一整份文档', g33doc().opacity(1, 0.5)),
    at('一次取完', g33bar().opacity(1, 0.5)),
  );

  say('多次查找');
  yield* beat('b34a',
    all(g33().opacity(0, 0.5), g34().opacity(1, 0.5)),
    at('多次索引查找', chain(g34t[0]().opacity(1, 0.3), g34t[1]().opacity(1, 0.3), g34t[2]().opacity(1, 0.3), g34t[3]().opacity(1, 0.3), g34t[4]().opacity(1, 0.3), g34t[5]().opacity(1, 0.3))),
  );

  say('更多寻道，更花时间');
  yield* beat('b34b',
    all(),
    at('磁盘寻道', g34seek().opacity(1, 0.5)),
  );

  say('只取一小块，也要搬整份');
  yield* beat('b35',
    all(g34().opacity(0, 0.5), g35().opacity(1, 0.5)),
    at('只取一小部分', g35part().opacity(1, 0.5)),
    at('很浪费', g35waste().opacity(1, 0.4)),
  );

  say('重写整份，文档保持小');
  yield* beat('b36',
    all(g35().opacity(0, 0.5), g36().opacity(1, 0.5)),
    at('重写整个文档', waitFor(0.01)),
    at('原地执行', g36in().opacity(1, 0.4)),
    at('保持相当小', g36small().opacity(1, 0.4)),
  );

  say('三家都在求局部性');
  yield* beat('b37',
    all(g36().opacity(0, 0.5), g37().opacity(1, 0.5)),
    at('Spanner', g37c[0]().opacity(1, 0.4)),
    at('Oracle', g37c[1]().opacity(1, 0.4)),
    at('Bigtable', g37c[2]().opacity(1, 0.4)),
  );

  say('关系库长出 XML');
  yield* beat('b38',
    all(g37().opacity(0, 0.5), g38().opacity(1, 0.5)),
    at('XML', g38branch().opacity(1, 0.5)),
    at('局部改文档', g38t[0]().opacity(1, 0.4)),
    at('建索引', g38t[1]().opacity(1, 0.4)),
    at('查文档', g38t[2]().opacity(1, 0.4)),
  );

  say('9.3、5.7、10.5');
  yield* beat('b39',
    all(g38().opacity(0, 0.5), g39().opacity(1, 0.5)),
    at('9.3', g39p[0]().opacity(1, 0.4)),
    at('5.7', g39p[1]().opacity(1, 0.4)),
    at('10.5', g39p[2]().opacity(1, 0.4)),
  );

  say('文档库也学 join');
  yield* beat('b40',
    all(g39().opacity(0, 0.5), g40().opacity(1, 0.5)),
    at('RethinkDB', g40branch().opacity(1, 0.5)),
    at('MongoDB', waitFor(0.01)),
    at('客户端做 join', g40client().opacity(1, 0.4)),
  );

  say('客户端 join 更慢');
  yield* beat('b41',
    all(g40().opacity(0, 0.5), g41().opacity(1, 0.5)),
    at('多跑几趟网络', g41bar().opacity(1, 0.5)),
  );

  say('越来越像，这是好事');
  yield* beat('b42',
    all(g41().opacity(0, 0.5), g42().opacity(1, 0.5), g42dot().opacity(1, 0.3), g42dot().position([0, -40], beat.dur('b42') - 1, easeInOutCubic)),
    at('越来越像', g42mix().opacity(1, 0.5)),
  );

  say('混合是未来的一条好路');
  yield* beat('b43',
    all(g42().opacity(0, 0.5), g43().opacity(1, 0.5)),
    at('混合', g43sign().opacity(1, 0.5)),
  );

  say('最初的描述就允许嵌套');
  yield* beat('b44',
    all(g43().opacity(0, 0.5), g44().opacity(1, 0.5)),
    at('嵌套的表', g44nest().opacity(1, 0.5)),
  );

  say('先看数据长什么样');
  yield* beat('b45',
    all(g44().opacity(0, 0.5), g45().opacity(1, 0.5), g45doc().opacity(1, 0.5)),
    at('互相牵连的网', g45net().opacity(1, 0.4)),
  );

  say('你的数据像哪一种？');
  yield* beat('b46',
    all(g45().opacity(0, 0.5), g46().opacity(1, 0.5)),
    at('多对多关系多吗', g46a().opacity(1, 0.4)),
    at('读时兜底', g46b().opacity(1, 0.4)),
  );

  say('下一站：只说要什么');
  yield* beat('b47',
    all(g46().opacity(0, 0.5), g47().opacity(1, 0.5)),
    at('只说要什么', g47card().opacity(1, 0.5)),
    at('怎么做和要什么', g47code().opacity(1, 0.4)),
  );
});
