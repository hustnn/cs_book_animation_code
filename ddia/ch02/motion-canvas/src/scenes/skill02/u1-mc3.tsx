// U1 场景 3（MC）：b15–b22 —— 表是无序的行集合、关系模型从理论到首选、
// 大型机商业数据处理、藏起实现细节、三代挑战者升起落下。
// 分镜：skill-ch02/beats-u1.md U1 一节；原文：DDIA §2.1（书页 p28–29）。
// 时长全部来自 timeline/u1.json（beat() 驱动），不手写 waitFor。
// 颜色、字号、安全区一律取自 lib/theme，不手写十六进制色值。
import {Circle, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
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

  // b15：表，行打乱重排
  const g15 = createRef<Node>();
  const g15rows = [0, 1, 2].map(() => createRef<Rect>());
  const g15tag = createRef<Txt>();
  // b16：理论卡片 → 时间线
  const g16 = createRef<Node>();
  const g16theory = createRef<Rect>();
  const g16line = createRef<Line>();
  const g16ticks = [0, 1, 2].map(() => createRef<Txt>());
  const g16rdbms = createRef<Rect>();
  const g16first = createRef<Txt>();
  // b17：大型机 + 业务单据
  const g17 = createRef<Node>();
  const g17main = createRef<Rect>();
  const g17docs = [0, 1, 2, 3, 4, 5, 6].map(() => createRef<Rect>());
  const g17labTx = createRef<Txt>();
  const g17labBatch = createRef<Txt>();
  // b18：齿轮箱盖上黑盒
  const g18 = createRef<Node>();
  const g18gears = [0, 1, 2].map(() => createRef<Circle>());
  const g18cover = createRef<Rect>();
  const g18iface = createRef<Txt>();
  // b19–b22：挑战者时间线（沿用 b16 的时间线位置）
  const g19 = createRef<Node>();
  const g19line = createRef<Line>();
  const g19ch1 = createRef<Node>();
  const g19ch2 = createRef<Node>();
  const g19ch3 = createRef<Node>();
  const g19ch3tag = createRef<Txt>();
  const g19rel = createRef<Line>();
  const g19relLab = createRef<Txt>();

  const docPos = row(7, 140, 12, [0, 150]);
  const docNames = ['销售', '银行', '机票', '库存', '发票', '工资', '报表'];
  const docCues = ['卖货', '银行交易', '订机票', '管库存', '开发票', '发工资', '做报表'];

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

      {/* b15：表 */}
      <Node ref={g15} opacity={0}>
        <Rect position={[0, -160]} width={480} height={56} radius={12} fill={T.card} stroke={T.line} lineWidth={2}>
          <Txt fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.mono} text={'城市'} />
        </Rect>
        {[0, 1, 2].map(i => (
          <Rect
            key={`g15r-${i}`}
            ref={g15rows[i]}
            position={[0, -90 + i * 70]}
            width={480}
            height={56}
            radius={12}
            fill={T.card}
            stroke={T.blue}
            lineWidth={2}
          >
            <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={['北京', '上海', '广州'][i]} />
          </Rect>
        ))}
        <Txt ref={g15tag} position={[0, 150]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'顺序变了，内容没变'} opacity={0} />
      </Node>

      {/* b16：理论 → 时间线 */}
      <Node ref={g16} opacity={0}>
        <Rect ref={g16theory} position={[0, -60]} width={440} height={130} radius={16} fill={T.card} stroke={T.purple} lineWidth={2}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'纸上的理论'} />
        </Rect>
        <Line ref={g16line} points={[[-480, -40], [480, -40]]} stroke={T.line} lineWidth={3} opacity={0} />
        <Txt ref={g16ticks[0]} position={[-480, 0]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.mono} text={'1970'} opacity={0} />
        <Txt ref={g16ticks[1]} position={[0, 0]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.mono} text={'1985'} opacity={0} />
        <Txt ref={g16ticks[2]} position={[480, 0]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.mono} text={'今天'} opacity={0} />
        <Rect ref={g16rdbms} position={[0, -140]} width={300} height={90} radius={14} fill={T.card} stroke={T.green} lineWidth={3} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'关系库 · SQL'} />
        </Rect>
        <Txt ref={g16first} position={[0, 90]} fontSize={SIZE.title} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'首选'} opacity={0} />
      </Node>

      {/* b17：大型机 */}
      <Node ref={g17} opacity={0}>
        <Rect ref={g17main} position={[0, -110]} width={520} height={180} radius={18} fill={T.card} stroke={T.blue} lineWidth={3}>
          <Txt position={[0, -40]} fontSize={SIZE.title} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'大型机'} />
          <Txt position={[0, 30]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'1960–70 年代'} />
        </Rect>
        {docPos.map((p, i) => (
          <Rect key={`g17d-${i}`} ref={g17docs[i]} position={p} width={140} height={70} radius={10} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={docNames[i]} />
          </Rect>
        ))}
        <Txt ref={g17labTx} position={[-228, 85]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'交易处理'} opacity={0} />
        <Txt ref={g17labBatch} position={[304, 85]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'批处理'} opacity={0} />
      </Node>

      {/* b18：齿轮箱盖上黑盒 */}
      <Node ref={g18} opacity={0}>
        <Rect position={[0, -60]} width={560} height={260} radius={18} fill={T.card} stroke={T.line} lineWidth={2}>
          <Txt position={[0, -90]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'内部表示'} />
        </Rect>
        {[0, 1, 2].map(i => (
          <Circle key={`g18g-${i}`} ref={g18gears[i]} position={[-180 + i * 180, -40]} width={90} height={90} stroke={T.blue} lineWidth={4} />
        ))}
        <Rect ref={g18cover} position={[0, -60]} width={560} height={260} radius={18} fill={T.bg} stroke={T.yellow} lineWidth={3} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'黑盒'} />
        </Rect>
        <Txt ref={g18iface} position={[0, 130]} fontSize={SIZE.body} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'只剩一个干净的接口'} opacity={0} />
      </Node>

      {/* b19–b22：挑战者时间线 */}
      <Node ref={g19} opacity={0}>
        <Line ref={g19line} points={[[-480, 60], [480, 60]]} stroke={T.line} lineWidth={3} />
        <Txt position={[-480, 100]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.mono} text={'1970'} />
        <Txt position={[480, 100]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.mono} text={'今天'} />
        <Node ref={g19ch1} opacity={0}>
          <Rect position={[-360, -120]} width={200} height={80} radius={12} fill={T.card} stroke={T.red} lineWidth={2}>
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'网状'} />
          </Rect>
          <Rect position={[-360, -30]} width={200} height={80} radius={12} fill={T.card} stroke={T.red} lineWidth={2}>
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'层次'} />
          </Rect>
        </Node>
        <Node ref={g19ch2} opacity={0}>
          <Rect position={[-140, -120]} width={220} height={90} radius={12} fill={T.card} stroke={T.red} lineWidth={2}>
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'对象库'} />
          </Rect>
        </Node>
        <Node ref={g19ch3} opacity={0}>
          <Rect position={[130, -120]} width={220} height={90} radius={12} fill={T.card} stroke={T.red} lineWidth={2}>
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'XML 库'} />
          </Rect>
        </Node>
        <Txt ref={g19ch3tag} position={[130, -30]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'只亮一小片'} opacity={0} />
        <Line ref={g19rel} points={[[-480, 160], [480, 160]]} stroke={T.green} lineWidth={5} opacity={0.3} />
        <Txt ref={g19relLab} position={[0, 210]} fontSize={SIZE.body} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'关系库'} opacity={0} />
      </Node>
    </>,
  );

  say('表 = 无序的一组行');
  yield* beat('b15',
    all(g15().opacity(1, 0.5)),
    at('SQL', g15rows[0]().stroke(T.yellow, 0.4)),
    at('一九七零年', g15rows[1]().stroke(T.yellow, 0.4)),
    at('数据组织成关系', g15rows[2]().stroke(T.yellow, 0.4)),
    at('无序的一组行', chain(
      all(g15rows[0]().opacity(0, 0.3), g15rows[2]().opacity(0, 0.3)),
      all(g15rows[0]().position([0, 50], 0.01), g15rows[2]().position([0, -90], 0.01)),
      all(g15rows[0]().opacity(1, 0.4), g15rows[2]().opacity(1, 0.4)),
      g15tag().opacity(1, 0.4),
    )),
  );

  say('1970 理论 → 1980 年代中期首选');
  yield* beat('b16',
    all(g15().opacity(0, 0.5), g16().opacity(1, 0.5)),
    at('纸上的理论', g16theory().scale(1.04, 0.4)),
    at('一九八零年代中期', chain(g16theory().opacity(0, 0.5), g16line().opacity(1, 0.5), all(...g16ticks.map(t => t().opacity(1, 0.4))), g16rdbms().opacity(1, 0.5))),
    at('首选', g16first().opacity(1, 0.5)),
  );

  say('大型机上的商业数据处理');
  yield* beat('b17',
    all(g16().opacity(0, 0.5), g17().opacity(1, 0.5)),
    at('大型机', g17main().stroke(T.yellow, 0.4)),
    at('交易处理', g17labTx().opacity(1, 0.4)),
    ...docCues.map((cue, i) => at(cue, g17docs[i]().opacity(1, 0.4))),
    at('批处理', g17labBatch().opacity(1, 0.4)),
  );

  say('藏起实现细节');
  yield* beat('b18',
    all(g17().opacity(0, 0.5), g18().opacity(1, 0.5)),
    at('内部表示', chain(g18gears[0]().scale(1.15, 0.4), g18gears[1]().scale(1.15, 0.4), g18gears[2]().scale(1.15, 0.4))),
    at('藏到一个干净的接口', all(g18cover().opacity(1, 0.6), g18iface().opacity(1, 0.4))),
  );

  say('1970 年代：网状、层次');
  yield* beat('b19',
    all(g18().opacity(0, 0.5), g19().opacity(1, 0.5)),
    at('一九七零年代', g19ch1().opacity(0.5, 0.5)),
    at('网状模型', g19ch1().opacity(1, 0.6)),
    at('层次模型', g19rel().opacity(0.3, 0.4)),
  );

  say('1980 年代末：对象库');
  yield* beat('b20',
    at('对象数据库', g19ch2().opacity(1, 0.6)),
    at('昙花一现', all(g19ch2().opacity(0.25, 0.6), g19ch2().position([0, 60], 0.6))),
  );

  say('2000 年代初：XML 库');
  yield* beat('b21a',
    at('XML 数据库', g19ch3().opacity(1, 0.5)),
  );

  say('只在小圈子里有人用');
  yield* beat('b21b',
    at('小圈子', all(g19ch3().opacity(0.45, 0.5), g19ch3tag().opacity(1, 0.4))),
  );

  say('挑战者来去匆匆，关系库留下');
  yield* beat('b22',
    at('没有一个持久', all(g19ch1().opacity(0.25, 0.6), g19ch3().opacity(0.25, 0.6))),
    at('一直画到今天', all(g19rel().opacity(1, 0.6), g19rel().lineWidth(8, 0.6), g19relLab().opacity(1, 0.5))),
  );
});
