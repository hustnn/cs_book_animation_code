// U8 场景 2（MC）：b12–b19 —— 三个分析问题、海量扫描、业务分析师与商业智能、OLAP 定义、差别并非泾渭分明。
// 分镜：skill-ch03/beats-u8.md；原文：DDIA §3.7（书页 p90–91，PDF p112–113）。
// 时长全部来自 timeline/u8.json（beat() 驱动），不手写 waitFor。
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

  // b12：问题一，每家店一月份总收入
  const g12 = createRef<Node>();
  const g12q = createRef<Rect>();
  const g12rows = [0, 1, 2].map(() => createRef<Rect>());
  const g12jan = [0, 1, 2].map(() => createRef<Rect>());

  // b13：问题二，香蕉销量促销期 vs 平时
  const g13 = createRef<Node>();
  const g13q = createRef<Rect>();
  const g13barN = createRef<Rect>();
  const g13barP = createRef<Rect>();
  const g13labN = createRef<Txt>();
  const g13labP = createRef<Txt>();

  // b14：问题三，婴儿食品 + 尿布一起买
  const g14 = createRef<Node>();
  const g14q = createRef<Rect>();
  const g14a = createRef<Rect>();
  const g14b = createRef<Rect>();
  const g14link = createRef<Line>();

  // b15a：海量扫描，按店加总
  const g15a = createRef<Node>();
  const g15adots = Array.from({length: 15}, () => createRef<Circle>());
  const g15ahl = createRef<Rect>();
  const g15atot = [0, 1, 2].map(() => createRef<Rect>());

  // b15b：分开比，数出来排名
  const g15b = createRef<Node>();
  const g15bbarN = createRef<Rect>();
  const g15bbarP = createRef<Rect>();
  const g15bgap = createRef<Txt>();
  const g15branks = [0, 1, 2].map(() => createRef<Rect>());

  // b16：分析师 → 报告 → 决策
  const g16 = createRef<Node>();
  const g16ana = createRef<Rect>();
  const g16rep = createRef<Rect>();
  const g16dec = createRef<Rect>();
  const g16a1 = createRef<Line>();
  const g16a2 = createRef<Line>();
  const g16bi = createRef<Txt>();

  // b17：OLTP vs OLAP 两块名牌
  const g17 = createRef<Node>();
  const g17oltp = createRef<Rect>();
  const g17olap = createRef<Rect>();

  // b18：预先做好的报表 vs 探索性查询
  const g18 = createRef<Node>();
  const g18rep = createRef<Rect>();
  const g18mag = createRef<Circle>();
  const g18lab = createRef<Txt>();

  // b19：两块区域，中间重叠带
  const g19 = createRef<Node>();
  const g19oltp = createRef<Rect>();
  const g19olap = createRef<Rect>();
  const g19over = createRef<Rect>();
  const g19overLab = createRef<Txt>();
  const g19frame = createRef<Rect>();

  const DOTS15_X = (i: number) => -400 + (i % 5) * 200;
  const DOTS15_Y = (i: number) => -80 + Math.floor(i / 5) * 80;

  view.add(
    <>
      <Txt
        ref={header}
        position={[-SAFE.halfW, -SAFE.halfH]}
        offset={[-1, -1]}
        fontSize={SIZE.label}
        fill={T.muted}
        fontFamily={FONT.sans}
        text={'两条路：事务还是分析'}
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

      {/* b12 */}
      <Node ref={g12} opacity={0}>
        <Rect ref={g12q} position={[0, -190]} width={820} height={100} radius={14} fill={T.card} stroke={T.yellow} lineWidth={2}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'每家店一月份总收入多少？'} />
        </Rect>
        {[0, 1, 2].map(i => (
          <Rect
            key={`g12r-${i}`}
            ref={g12rows[i]}
            position={[0, -60 + i * 80]}
            width={700}
            height={56}
            radius={10}
            fill={T.card}
            stroke={T.line}
            lineWidth={2}
            opacity={0}
          >
            <Txt position={[-280, 0]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={['店 A', '店 B', '店 C'][i]} />
          </Rect>
        ))}
        {[0, 1, 2].map(i => (
          <Rect
            key={`g12j-${i}`}
            ref={g12jan[i]}
            position={[220, -60 + i * 80]}
            width={120}
            height={40}
            radius={8}
            fill={T.card}
            stroke={T.yellow}
            lineWidth={2}
            opacity={0}
          >
            <Txt fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.sans} text={'一月'} />
          </Rect>
        ))}
      </Node>

      {/* b13 */}
      <Node ref={g13} opacity={0}>
        <Rect ref={g13q} position={[0, -190]} width={860} height={100} radius={14} fill={T.card} stroke={T.yellow} lineWidth={2}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'促销期间香蕉销量比平时多多少？'} />
        </Rect>
        <Txt ref={g13labN} position={[-380, -80]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'平时'} opacity={0} />
        <Rect ref={g13barN} position={[-260, -30]} width={220} height={60} radius={10} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0} />
        <Txt ref={g13labP} position={[-380, 60]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'促销期'} opacity={0} />
        <Rect ref={g13barP} position={[-140, 110]} width={460} height={60} radius={10} fill={T.card} stroke={T.green} lineWidth={2} opacity={0} />
      </Node>

      {/* b14 */}
      <Node ref={g14} opacity={0}>
        <Rect ref={g14q} position={[0, -190]} width={980} height={100} radius={14} fill={T.card} stroke={T.yellow} lineWidth={2}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'哪个牌子的婴儿食品最常跟某牌尿布一起买？'} />
        </Rect>
        <Rect ref={g14a} position={[-280, 40]} width={360} height={120} radius={16} fill={T.card} stroke={T.blue} lineWidth={3} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'婴儿食品'} />
        </Rect>
        <Rect ref={g14b} position={[280, 40]} width={360} height={120} radius={16} fill={T.card} stroke={T.green} lineWidth={3} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'某牌尿布'} />
        </Rect>
        <Line ref={g14link} points={[[-90, 40], [90, 40]]} stroke={T.yellow} lineWidth={3} endArrow opacity={0} />
      </Node>

      {/* b15a */}
      <Node ref={g15a} opacity={0}>
        {g15adots.map((r, i) => (
          <Circle key={`g15ad-${i}`} ref={r} position={[DOTS15_X(i), DOTS15_Y(i)]} width={18} height={18} fill={T.muted} opacity={0} />
        ))}
        <Rect ref={g15ahl} position={[0, -80]} width={940} height={60} radius={10} stroke={T.yellow} lineWidth={3} opacity={0} />
        {[0, 1, 2].map(i => (
          <Rect
            key={`g15at-${i}`}
            ref={g15atot[i]}
            position={[-350 + i * 350, 180]}
            width={280}
            height={70}
            radius={12}
            fill={T.card}
            stroke={T.green}
            lineWidth={2}
            opacity={0}
          >
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={['店 A 总收入', '店 B 总收入', '店 C 总收入'][i]} />
          </Rect>
        ))}
      </Node>

      {/* b15b */}
      <Node ref={g15b} opacity={0}>
        <Rect ref={g15bbarN} position={[-350, -80]} width={220} height={56} radius={10} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'平时'} />
        </Rect>
        <Rect ref={g15bbarP} position={[-230, 10]} width={460} height={56} radius={10} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'促销期'} />
        </Rect>
        <Txt ref={g15bgap} position={[-350, 100]} fontSize={SIZE.body} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'多出这一截'} opacity={0} />
        {[0, 1, 2].map(i => (
          <Rect
            key={`g15br-${i}`}
            ref={g15branks[i]}
            position={[300, -80 + i * 90]}
            width={420}
            height={64}
            radius={10}
            fill={T.card}
            stroke={T.line}
            lineWidth={2}
            opacity={0}
          >
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={['第 1 名', '第 2 名', '第 3 名'][i]} />
          </Rect>
        ))}
      </Node>

      {/* b16 */}
      <Node ref={g16} opacity={0}>
        <Rect ref={g16ana} position={[-400, -60]} width={300} height={140} radius={16} fill={T.card} stroke={T.blue} lineWidth={3}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'业务分析师'} />
        </Rect>
        <Line ref={g16a1} points={[[-240, -60], [-160, -60]]} stroke={T.blue} lineWidth={3} endArrow opacity={0} />
        <Rect ref={g16rep} position={[0, -60]} width={300} height={140} radius={16} fill={T.card} stroke={T.yellow} lineWidth={3} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'报告'} />
        </Rect>
        <Line ref={g16a2} points={[[160, -60], [240, -60]]} stroke={T.blue} lineWidth={3} endArrow opacity={0} />
        <Rect ref={g16dec} position={[400, -60]} width={300} height={140} radius={16} fill={T.card} stroke={T.green} lineWidth={3} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'更好的决策'} />
        </Rect>
        <Txt ref={g16bi} position={[0, -210]} fontSize={SIZE.body} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'商业智能'} opacity={0} />
      </Node>

      {/* b17 */}
      <Node ref={g17} opacity={0}>
        <Rect ref={g17oltp} position={[-290, -60]} width={420} height={130} radius={16} fill={T.card} stroke={T.blue} lineWidth={3}>
          <Txt position={[0, -28]} fontSize={SIZE.title} fontWeight={700} fill={T.blue} fontFamily={FONT.mono} text={'OLTP'} />
          <Txt position={[0, 30]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'联机事务处理'} />
        </Rect>
        <Rect ref={g17olap} position={[290, -60]} width={420} height={130} radius={16} fill={T.card} stroke={T.green} lineWidth={3} opacity={0}>
          <Txt position={[0, -28]} fontSize={SIZE.title} fontWeight={700} fill={T.green} fontFamily={FONT.mono} text={'OLAP'} />
          <Txt position={[0, 30]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'联机分析处理'} />
        </Rect>
      </Node>

      {/* b18 */}
      <Node ref={g18} opacity={0}>
        <Rect ref={g18rep} position={[-320, -60]} width={420} height={160} radius={16} fill={T.card} stroke={T.line} lineWidth={2}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'预先做好的报表'} />
        </Rect>
        <Circle ref={g18mag} position={[300, -90]} width={130} height={130} stroke={T.yellow} lineWidth={3} opacity={0} />
        <Txt ref={g18lab} position={[300, 40]} fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.sans} text={'探索性查询'} opacity={0} />
      </Node>

      {/* b19 */}
      <Node ref={g19} opacity={0}>
        <Rect ref={g19oltp} position={[-290, -60]} width={440} height={220} radius={16} fill={T.card} stroke={T.blue} lineWidth={3} opacity={0}>
          <Txt position={[0, -70]} fontSize={SIZE.body} fontWeight={700} fill={T.blue} fontFamily={FONT.mono} text={'OLTP'} />
        </Rect>
        <Rect ref={g19olap} position={[290, -60]} width={440} height={220} radius={16} fill={T.card} stroke={T.green} lineWidth={3} opacity={0}>
          <Txt position={[0, -70]} fontSize={SIZE.body} fontWeight={700} fill={T.green} fontFamily={FONT.mono} text={'OLAP'} />
        </Rect>
        <Rect ref={g19over} position={[0, -60]} width={200} height={220} radius={12} fill={T.purple} opacity={0} />
        <Txt ref={g19overLab} position={[0, 0]} fontSize={SIZE.label} fill={T.white} fontFamily={FONT.sans} text={'有重叠'} opacity={0} />
        <Rect ref={g19frame} position={[0, -60]} width={700} height={260} radius={16} fill={T.card} stroke={T.yellow} lineWidth={3} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'对照表'} />
        </Rect>
      </Node>
    </>
  );

  say('每家店一月份总收入？');
  yield* beat('b12',
    all(g12().opacity(1, 0.5),
      g12rows[0]().opacity(1, 0.4), g12rows[1]().opacity(1, 0.4), g12rows[2]().opacity(1, 0.4)),
    at('一月份', chain(g12jan[0]().opacity(1, 0.4), g12jan[1]().opacity(1, 0.4), g12jan[2]().opacity(1, 0.4))),
  );

  say('香蕉销量比平时多多少？');
  yield* beat('b13',
    all(g12().opacity(0, 0.5), g13().opacity(1, 0.5)),
    at('香蕉销量', all(g13labN().opacity(1, 0.4), g13barN().opacity(1, 0.4))),
    at('平时', g13barN().stroke(T.blue, 0.4)),
    at('促销期间', all(g13labP().opacity(1, 0.4), g13barP().opacity(1, 0.4))),
  );

  say('婴儿食品常跟哪牌尿布一起买？');
  yield* beat('b14',
    all(g13().opacity(0, 0.5), g14().opacity(1, 0.5)),
    at('婴儿食品', g14a().opacity(1, 0.5)),
    at('某牌尿布', g14b().opacity(1, 0.5)),
    at('一起买', g14link().opacity(1, 0.5)),
  );

  say('一月份挑出来，按店加总');
  yield* beat('b15a',
    all(g14().opacity(0, 0.5), g15a().opacity(1, 0.5)),
    at('海量记录上扫过', chain(
      all(...g15adots.slice(0, 5).map(r => r().opacity(1, 0.25))),
      all(...g15adots.slice(5, 10).map(r => r().opacity(1, 0.25))),
      all(...g15adots.slice(10, 15).map(r => r().opacity(1, 0.25))),
    )),
    at('一月份的销售挑出来', g15ahl().opacity(1, 0.5)),
    at('按店加总', chain(g15atot[0]().opacity(1, 0.4), g15atot[1]().opacity(1, 0.4), g15atot[2]().opacity(1, 0.4))),
  );

  say('分开比，数出来排名');
  yield* beat('b15b',
    all(g15a().opacity(0, 0.5), g15b().opacity(1, 0.5)),
    at('促销期和平时分开', all(g15bbarN().opacity(1, 0.4), g15bbarP().opacity(1, 0.4))),
    at('比销量', g15bgap().opacity(1, 0.5)),
    at('数出来排个名', chain(g15branks[0]().opacity(1, 0.4), g15branks[1]().opacity(1, 0.4), g15branks[2]().opacity(1, 0.4))),
  );

  say('分析师写查询，报告帮决策');
  yield* beat('b16',
    all(g15b().opacity(0, 0.5), g16().opacity(1, 0.5)),
    at('业务分析师', g16a1().opacity(1, 0.4)),
    at('报告', all(g16rep().opacity(1, 0.4), g16a2().opacity(1, 0.4))),
    at('更好的决策', g16dec().opacity(1, 0.4)),
    at('商业智能', g16bi().opacity(1, 0.5)),
  );

  say('联机分析处理，OLAP');
  yield* beat('b17',
    all(g16().opacity(0, 0.5), g17().opacity(1, 0.5)),
    at('联机分析处理', g17olap().opacity(1, 0.5)),
    at('OLAP', g17olap().stroke(T.yellow, 0.4)),
  );

  say('不只看报表，还能交互探索');
  yield* beat('b18',
    all(g17().opacity(0, 0.5), g18().opacity(1, 0.5)),
    at('预先做好的报表', g18mag().opacity(1, 0.5)),
    at('交互式地做探索性查询', g18lab().opacity(1, 0.5)),
    g18().scale(1.02, beat.dur('b18') - 0.6),
  );

  say('差别并非泾渭分明');
  yield* beat('b19',
    all(g18().opacity(0, 0.5), g19().opacity(1, 0.5)),
    at('并非总是泾渭分明', chain(g19oltp().opacity(1, 0.4), g19olap().opacity(1, 0.4), g19over().opacity(0.35, 0.5), g19overLab().opacity(1, 0.4))),
    at('对照表', all(g19oltp().opacity(0, 0.4), g19olap().opacity(0, 0.4), g19over().opacity(0, 0.4), g19overLab().opacity(0, 0.4), g19frame().opacity(1, 0.5))),
  );
});
