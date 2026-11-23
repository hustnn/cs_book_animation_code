// U4 场景 2（MC）：b13–b22 —— 链表遍历、多条路径、游标、n 维空间、
// 磁带机、改路径全城变红、摊开的表、任意行、按键读行、join 时机脚注。
// 分镜：skill-ch02/beats-u4.md U4 一节；原文：DDIA §2.5（书页 p37，PDF p59）。
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

  const g13 = createRef<Node>();
  const g13nodes = [0, 1, 2, 3, 4, 5].map(() => createRef<Rect>());
  const g13dot = createRef<Circle>();
  const g13ring = createRef<Rect>();
  const g14 = createRef<Node>();
  const g14starts = [0, 1, 2].map(() => createRef<Rect>());
  const g14lines = [0, 1, 2].map(() => createRef<Line>());
  const g14target = createRef<Rect>();
  const g14tag = createRef<Txt>();
  const g15 = createRef<Node>();
  const g15rows = [0, 1, 2, 3, 4].map(() => createRef<Rect>());
  const g15cursor = createRef<Rect>();
  const g16 = createRef<Node>();
  const g16dot = createRef<Circle>();
  const g16nodes = [0, 1, 2, 3, 4, 5].map(() => createRef<Rect>());
  const g16lines = [0, 1, 2, 3, 4, 5].map(() => createRef<Line>());
  const g16tag = createRef<Txt>();
  const g17 = createRef<Node>();
  const g17tape = createRef<Rect>();
  const g17bar = createRef<Rect>();
  const g17lab = createRef<Txt>();
  const g18 = createRef<Node>();
  const g18path = createRef<Txt>();
  const g18codes = [0, 1, 2, 3, 4].map(() => createRef<Rect>());
  const g19 = createRef<Node>();
  const g19table = createRef<Rect>();
  const g19rows = [0, 1, 2, 3].map(() => createRef<Txt>());
  const g20 = createRef<Node>();
  const g20hl = [0, 1].map(() => createRef<Rect>());
  const g20dim = createRef<Rect>();
  const g20chip = createRef<Txt>();
  const g21 = createRef<Node>();
  const g21key = createRef<Rect>();
  const g21new = createRef<Rect>();
  const g22 = createRef<Node>();
  const g22q = createRef<Rect>();
  const g22i = createRef<Rect>();

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

      {/* b13：链表遍历 */}
      <Node ref={g13} opacity={0}>
        {[0, 1, 2, 3, 4, 5].map(i => (
          <Rect key={`g13n-${i}`} ref={g13nodes[i]} position={[-500 + i * 200, -40]} width={150} height={90} radius={12} fill={T.card} stroke={T.blue} lineWidth={2}>
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={i === 0 ? '表头' : i === 5 ? '目标' : `记录 ${i + 1}`} />
          </Rect>
        ))}
        <Circle ref={g13dot} position={[-500, -40]} width={30} height={30} fill={T.yellow} opacity={0} />
        <Rect ref={g13ring} position={[500, -40]} width={170} height={110} radius={14} stroke={T.yellow} lineWidth={3} opacity={0} />
      </Node>

      {/* b14：三条路径通向同一记录 */}
      <Node ref={g14} opacity={0}>
        {[0, 1, 2].map(i => (
          <Rect key={`g14s-${i}`} ref={g14starts[i]} position={[-360 + i * 360, -200]} width={200} height={80} radius={12} fill={T.card} stroke={[T.blue, T.green, T.purple][i]} lineWidth={2} opacity={0}>
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={['路径 1', '路径 2', '路径 3'][i]} />
          </Rect>
        ))}
        {[0, 1, 2].map(i => (
          <Line key={`g14l-${i}`} ref={g14lines[i]} points={[[-360 + i * 360, -160], [0, 110]]} stroke={[T.blue, T.green, T.purple][i]} lineWidth={3} opacity={0} />
        ))}
        <Rect ref={g14target} position={[0, 150]} width={260} height={90} radius={14} fill={T.card} stroke={T.yellow} lineWidth={3}>
          <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'同一条记录'} />
        </Rect>
        <Txt ref={g14tag} position={[0, -60]} fontSize={SIZE.label} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'都记在脑子里'} opacity={0} />
      </Node>

      {/* b15：游标滑动 */}
      <Node ref={g15} opacity={0}>
        {[0, 1, 2, 3, 4].map(i => (
          <Rect key={`g15r-${i}`} ref={g15rows[i]} position={[-400 + i * 200, -40]} width={160} height={90} radius={12} fill={T.card} stroke={T.blue} lineWidth={2}>
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={`记录 ${i + 1}`} />
          </Rect>
        ))}
        <Rect ref={g15cursor} position={[-400, -40]} width={180} height={110} radius={14} stroke={T.yellow} lineWidth={3} opacity={0} />
      </Node>

      {/* b16：n 维空间导航 */}
      <Node ref={g16} opacity={0}>
        {[0, 1, 2, 3, 4, 5].map(i => (
          <Line key={`g16l-${i}`} ref={g16lines[i]} points={[[0, -40], [-420 + (i % 3) * 420, i < 3 ? -210 : 130]]} stroke={T.line} lineWidth={2} opacity={0} />
        ))}
        {[0, 1, 2, 3, 4, 5].map(i => (
          <Rect key={`g16n-${i}`} ref={g16nodes[i]} position={[-420 + (i % 3) * 420, i < 3 ? -210 : 130]} width={170} height={70} radius={10} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={['父节点', '子记录', '引用', '列表', '索引', '关系'][i]} />
          </Rect>
        ))}
        <Circle ref={g16dot} position={[0, -40]} width={30} height={30} fill={T.yellow} opacity={0} />
        <Txt ref={g16tag} position={[0, 230]} fontSize={SIZE.label} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'在 n 维数据空间里导航'} opacity={0} />
      </Node>

      {/* b17：磁带机榨干硬件 */}
      <Node ref={g17} opacity={0}>
        <Rect ref={g17tape} position={[0, -100]} width={560} height={200} radius={18} fill={T.card} stroke={T.blue} lineWidth={2}>
          <Txt position={[0, -50]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'磁带机'} />
          <Txt position={[0, 30]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'寻道极慢 · 硬件极有限'} />
        </Rect>
        <Rect position={[-280, 60]} width={560} height={30} radius={15} fill={T.card} stroke={T.line} lineWidth={2} />
        <Rect ref={g17bar} position={[-280, 60]} offset={[-1, 0]} width={60} height={30} radius={15} fill={T.green} />
        <Txt ref={g17lab} position={[0, 140]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'性能榨到最干'} opacity={0} />
      </Node>

      {/* b18：改一条路径，全城代码变红 */}
      <Node ref={g18} opacity={0}>
        <Txt ref={g18path} position={[0, -230]} fontSize={SIZE.label} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'访问路径改了'} opacity={0} />
        {[0, 1, 2, 3, 4].map(i => (
          <Rect key={`g18c-${i}`} ref={g18codes[i]} position={[0, -150 + i * 70]} width={640} height={50} radius={10} fill={T.card} stroke={T.line} lineWidth={2} opacity={0}>
            <Txt position={[-250, 0]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.mono} text={`查询代码 ${i + 1}`} />  {/* r2：x 由 -280 改到 -250，文字左端不再探出卡片 */}
            <Txt position={[120, 0]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.mono} text={'沿旧路径找记录 …'} />
          </Rect>
        ))}
      </Node>

      {/* b19–b21：摊开的表 */}
      <Node ref={g19} opacity={0}>
        <Rect ref={g19table} position={[0, -40]} width={760} height={340} radius={16} fill={T.card} stroke={T.line} lineWidth={2}>
          <Txt position={[0, -140]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.mono} text={'users'} />
          <Txt position={[-280, -90]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.mono} text={'user_id'} />
          <Txt position={[0, -90]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.mono} text={'first_name'} />
          <Txt position={[280, -90]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.mono} text={'last_name'} />
        </Rect>
        {[0, 1, 2, 3].map(i => (
          <Txt key={`g19r-${i}`} ref={g19rows[i]} position={[0, -80 + i * 60]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={['251   Bill    Gates', '252   Ada     Lovelace', '253   Alan    Turing', '254   Grace   Hopper'][i]} opacity={0} />
        ))}
      </Node>
      <Node ref={g20} opacity={0}>
        {[0, 1].map(i => (
          <Rect key={`g20h-${i}`} ref={g20hl[i]} position={[0, -20 + i * 120]} width={780} height={56} radius={10} stroke={T.yellow} lineWidth={3} opacity={0} />
        ))}
        <Txt ref={g20chip} position={[0, -240]} fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.sans} text={'按任意条件筛选'} opacity={0} />
      </Node>
      <Node ref={g21} opacity={0}>
        <Rect ref={g21key} position={[-280, -130]} width={170} height={56} radius={10} stroke={T.yellow} lineWidth={3} opacity={0} />
        <Rect ref={g21new} position={[0, 180]} width={760} height={56} radius={10} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>  {/* r2：起始位由 260 改到 180，不再从屏底滑入穿过字幕带（r1 在 164.44s 切断字幕） */}
          <Txt fontSize={SIZE.label} fill={T.green} fontFamily={FONT.mono} text={'255   新用户  新行'} />
        </Rect>
      </Node>

      {/* b22：join 时机对照 */}
      <Node ref={g22} opacity={0}>
        <Rect ref={g22q} position={[-280, -40]} width={380} height={220} radius={16} fill={T.card} stroke={T.green} lineWidth={3} opacity={0}>
          <Txt position={[0, -40]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'关系模型'} />
          <Txt position={[0, 40]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} text={'join 在查询时做'} />
        </Rect>
        <Rect ref={g22i} position={[280, -40]} width={380} height={220} radius={16} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt position={[0, -40]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'网状模型'} />
          <Txt position={[0, 40]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'join 在插入时做'} />
          <Txt position={[150, -70]} fontSize={SIZE.label} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'✓'} />  {/* r2：分镜“插入时一侧打勾” */}
        </Rect>
      </Node>
    </>
  );

  say('像走链表');
  yield* beat('b13',
    all(g13().opacity(1, 0.5)),
    at('从表头开始', g13dot().opacity(1, 0.3)),
    at('一条记录一条记录地看', chain(
      g13dot().position([-300, -40], 0.4), g13dot().position([-100, -40], 0.4),
      g13dot().position([100, -40], 0.4), g13dot().position([300, -40], 0.4),
      g13dot().position([407, -40], 0.4),
    )),
    at('找到想要的', g13ring().opacity(1, 0.4)),
  );

  say('多条路，通向同一条记录');
  yield* beat('b14',
    all(g13().opacity(0, 0.5), g14().opacity(1, 0.5)),
    at('好几条不同的路径', chain(g14starts[0]().opacity(1, 0.4), g14lines[0]().opacity(1, 0.4), g14starts[1]().opacity(1, 0.4), g14lines[1]().opacity(1, 0.4), g14starts[2]().opacity(1, 0.4), g14lines[2]().opacity(1, 0.4))),
    at('记在脑子里', g14tag().opacity(1, 0.4)),
  );

  say('游标在走');
  yield* beat('b15',
    all(g14().opacity(0, 0.5), g15().opacity(1, 0.5)),
    at('移动一个游标', g15cursor().opacity(1, 0.3)),
    at('走来走去', chain(
      g15cursor().position([-200, -40], 0.4), g15cursor().position([0, -40], 0.4),
      g15cursor().position([200, -40], 0.4), g15cursor().position([400, -40], 0.4),
    )),
  );

  say('在 n 维空间里导航');
  yield* beat('b16',
    all(g15().opacity(0, 0.5), g16().opacity(1, 0.5)),
    at('多个父节点', chain(g16nodes[0]().opacity(1, 0.3), g16lines[0]().opacity(1, 0.3), g16nodes[1]().opacity(1, 0.3), g16lines[1]().opacity(1, 0.3), g16nodes[2]().opacity(1, 0.3), g16lines[2]().opacity(1, 0.3))),
    at('记住各种关系', chain(g16nodes[3]().opacity(1, 0.3), g16lines[3]().opacity(1, 0.3), g16nodes[4]().opacity(1, 0.3), g16lines[4]().opacity(1, 0.3), g16nodes[5]().opacity(1, 0.3), g16lines[5]().opacity(1, 0.3), g16dot().opacity(1, 0.3))),
    at('n 维数据空间', all(g16tag().opacity(1, 0.4), chain(g16dot().position([60, -40], 0.5), g16dot().position([-60, -40], 0.5), g16dot().position([0, -40], 0.5)))),
  );

  say('榨干有限的硬件');
  yield* beat('b17',
    all(g16().opacity(0, 0.5), g17().opacity(1, 0.5)),
    at('手动选访问路径', g17bar().width(200, 3.0)),
    at('榨到最干', all(g17bar().width(560, 1.5), g17lab().opacity(1, 0.4))),
  );

  say('改一条路，全城代码变红');
  yield* beat('b18',
    all(g17().opacity(0, 0.5), g18().opacity(1, 0.5)),
    at('查询和更新代码', chain(g18codes[0]().opacity(1, 0.4), g18codes[1]().opacity(1, 0.4))),
    at('没有通向想要数据的路径', chain(g18codes[2]().opacity(1, 0.4), g18codes[3]().opacity(1, 0.4), g18codes[4]().opacity(1, 0.4))),
    at('改一条路径', g18path().opacity(1, 0.4)),
    at('翻遍手写的查询代码重写', chain(
      g18codes[0]().fill(T.red, 0.3), g18codes[1]().fill(T.red, 0.3),
      g18codes[2]().fill(T.red, 0.3), g18codes[3]().fill(T.red, 0.3),
      g18codes[4]().fill(T.red, 0.3),
    )),
  );

  say('表就是行的集合');
  yield* beat('b19',
    all(g18().opacity(0, 0.5), g19().opacity(1, 0.5)),
    at('摊开', chain(g19rows[0]().opacity(1, 0.4), g19rows[1]().opacity(1, 0.4))),
    at('行的集合', chain(g19rows[2]().opacity(1, 0.4), g19rows[3]().opacity(1, 0.4))),
  );

  say('任意行，直接点亮');
  yield* beat('b20',
    all(g20().opacity(1, 0.5)),
    at('任意一行', g20hl[0]().opacity(1, 0.4)),
    at('没有复杂的访问路径', g20chip().opacity(1, 0.4)),
    at('任意条件筛选', g20hl[1]().opacity(1, 0.4)),
  );

  say('按键读行，随便插行');
  yield* beat('b21',
    all(g20().opacity(0, 0.4), g21().opacity(1, 0.5)),
    at('指定某些列为键', g21key().opacity(1, 0.4)),
    at('插新行', chain(g21new().opacity(1, 0.3), g21new().position([0, 210], 0.8))),
  );

  say('join 在查询时做');
  yield* beat('b22',
    all(g19().opacity(0, 0.5), g21().opacity(0, 0.5), g22().opacity(1, 0.5)),
    at('外键约束', g22q().opacity(1, 0.5)),
    at('关系模型并不要求', g22i().opacity(1, 0.5)),
    at('查询时', g22q().lineWidth(4, 0.4)),
    at('插入时', g22i().lineWidth(4, 0.4)),
  );
});
