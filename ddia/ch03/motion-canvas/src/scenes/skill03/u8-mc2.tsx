// U8 场景 2（MC）：h12–h19b（含 h19c）—— 三个分析问题、海量扫描、业务分析师与商业智能、OLAP 定义、聚合返回、差别在访问模式。
// 分镜：skill-ch03/beats-u8.md；原文：DDIA §3.7（书页 p90–91，PDF p112–113）。
// 时长全部来自 timeline/u8.json（beat() 驱动），不手写 waitFor。
import {Circle, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, chain, createRef} from '@motion-canvas/core';
import {at, makeBeats} from '../../lib/beats';
import {Counter} from '../../lib/schemas';
import {FONT, SAFE, SIZE, T} from '../../lib/theme';
import timeline from '../../timeline/u8.json';

export default makeScene2D(function* (view) {
  view.fill(T.bg);
  const beat = makeBeats(timeline);

  const header = createRef<Txt>();
  const anchor = createRef<Txt>();
  const say = (text: string) => anchor().text(text);

  // h12：转场 + 问题一
  const g12 = createRef<Node>();
  const g12card = createRef<Rect>();
  const g12dots = Array.from({length: 24}, () => createRef<Circle>());
  const g12scan = createRef<Rect>();
  const g12q = createRef<Rect>();

  // h13：问题一走查——一月份挑出来，按店加总
  const g13 = createRef<Node>();
  const g13q = createRef<Rect>();
  const g13rows = [0, 1, 2].map(() => createRef<Rect>());
  const g13jan = [0, 1, 2].map(() => createRef<Rect>());
  const g13scan = createRef<Rect>();
  const g13tot = [0, 1, 2].map(() => createRef<Rect>());
  const g13note = createRef<Txt>();

  // h14：问题二，香蕉销量促销期 vs 平时
  const g14 = createRef<Node>();
  const g14q = createRef<Rect>();
  const g14barN = createRef<Rect>();
  const g14barP = createRef<Rect>();
  const g14labN = createRef<Txt>();
  const g14labP = createRef<Txt>();
  const g14note = createRef<Txt>();

  // h15：问题二走查——分开比销量
  const g15 = createRef<Node>();
  const g15barN = createRef<Rect>();
  const g15barP = createRef<Rect>();
  const g15gap = createRef<Txt>();
  const g15sub = createRef<Txt>();
  const g15def = createRef<Txt>();

  // h16：问题三，婴儿食品 + 尿布一起买
  const g16 = createRef<Node>();
  const g16q = createRef<Rect>();
  const g16a = createRef<Rect>();
  const g16b = createRef<Rect>();
  const g16link = createRef<Line>();

  // h17：问题三走查——扫过全部交易，数出来排名
  const g17 = createRef<Node>();
  const g17dots = Array.from({length: 10}, () => createRef<Circle>());
  const g17a = createRef<Rect>();
  const g17b = createRef<Rect>();
  const g17link = createRef<Line>();
  const g17ranks = [0, 1, 2].map(() => createRef<Rect>());
  const g17rule = createRef<Txt>();
  const g17note = createRef<Txt>();
  const rankCount = new Counter([0, 225], '已数出 ', ' 个组合');

  // h18：分析师 → 报告 → 决策
  const g18 = createRef<Node>();
  const g18ana = createRef<Rect>();
  const g18rep = createRef<Rect>();
  const g18dec = createRef<Rect>();
  const g18a1 = createRef<Line>();
  const g18a2 = createRef<Line>();
  const g18bi = createRef<Txt>();

  // h18b：OLTP vs OLAP 两块名牌
  const g18b = createRef<Node>();
  const g18boltp = createRef<Rect>();
  const g18bolap = createRef<Rect>();

  // h19：聚合返回，少数几列
  const g19 = createRef<Node>();
  const g19dots = Array.from({length: 24}, () => createRef<Circle>());
  const g19raw = createRef<Rect>();
  const g19chips = [0, 1, 2].map(() => createRef<Rect>());

  // h19c：拿总收入问题点名三列与几百万条量级
  const g19c = createRef<Node>();
  const g19cmag = createRef<Txt>();
  const g19ccols = [0, 1, 2].map(() => createRef<Rect>());
  const g19chead = [0, 1, 2].map(() => createRef<Txt>());
  const g19cnote = createRef<Txt>();

  // h19b：左右分屏对照
  const g19b = createRef<Node>();
  const g19bleft = createRef<Rect>();
  const g19bright = createRef<Rect>();
  const g19bdot = createRef<Circle>();
  const g19bdots = Array.from({length: 12}, () => createRef<Circle>());
  const g19btag = createRef<Txt>();

  const DOT_X = (i: number) => 40 + (i % 6) * 80;
  const DOT_Y = (i: number) => -160 + Math.floor(i / 6) * 70;
  // h19c 三列点亮：第 1 列（日期，黄）、第 3 列（店，蓝）、第 5 列（金额，绿）
  const CHEADS: [number, number][] = [[40, -215], [200, -215], [360, -215]];
  const CHEAD_FILL = [T.yellow, T.blue, T.green];
  const R_X = (i: number) => 130 + (i % 4) * 100;
  const R_Y = (i: number) => -140 + Math.floor(i / 4) * 70;
  const D17_X = (i: number) => -450 + i * 100;

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

      {/* h12 */}
      <Node ref={g12} opacity={0}>
        <Rect ref={g12card} position={[-430, -60]} width={220} height={110} radius={14} fill={T.card} stroke={T.blue} lineWidth={2}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'接单'} />
        </Rect>
        {g12dots.map((r, i) => (
          <Circle key={`g12d-${i}`} ref={r} position={[DOT_X(i), DOT_Y(i)]} width={16} height={16} fill={T.muted} opacity={0} />
        ))}
        <Rect ref={g12scan} position={[240, -160]} width={440} height={10} fill={T.yellow} opacity={0} />
        <Rect ref={g12q} position={[240, -215]} width={700} height={80} radius={14} fill={T.card} stroke={T.yellow} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'每家店一月份总收入多少？'} />
        </Rect>
      </Node>

      {/* h13 */}
      <Node ref={g13} opacity={0}>
        <Rect ref={g13q} position={[0, -190]} width={820} height={100} radius={14} fill={T.card} stroke={T.yellow} lineWidth={2}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'每家店一月份总收入多少？'} />
        </Rect>
        {[0, 1, 2].map(i => (
          <Rect
            key={`g13r-${i}`}
            ref={g13rows[i]}
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
        <Rect ref={g13scan} position={[0, -60]} width={700} height={56} radius={10} stroke={T.yellow} lineWidth={3} opacity={0} />
        {[0, 1, 2].map(i => (
          <Rect
            key={`g13j-${i}`}
            ref={g13jan[i]}
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
        {[0, 1, 2].map(i => (
          <Rect
            key={`g13t-${i}`}
            ref={g13tot[i]}
            position={[-350 + i * 350, 190]}
            width={280}
            height={100}
            radius={12}
            fill={T.card}
            stroke={T.green}
            lineWidth={2}
            opacity={0}
          >
            <Txt position={[0, -22]} fontSize={SIZE.label} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={['店 A 总收入', '店 B 总收入', '店 C 总收入'][i]} />
            <Txt position={[0, 20]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={['12 + 18 = 30', '25 + 30 = 55', '40 + 22 = 62'][i]} />
          </Rect>
        ))}
        <Txt ref={g13note} position={[480, 252]} fontSize={SIZE.label} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'金额示意 · 两个数作样子'} opacity={0} />
      </Node>

      {/* h14 */}
      <Node ref={g14} opacity={0}>
        <Rect ref={g14q} position={[0, -190]} width={860} height={100} radius={14} fill={T.card} stroke={T.yellow} lineWidth={2}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'促销期间香蕉销量比平时多多少？'} />
        </Rect>
        <Txt ref={g14labN} position={[-380, -80]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'平时'} opacity={0} />
        <Rect ref={g14barN} position={[-260, -30]} width={220} height={60} radius={10} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'120 件'} />
        </Rect>
        <Txt ref={g14labP} position={[-380, 60]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'促销期'} opacity={0} />
        <Rect ref={g14barP} position={[-140, 110]} width={460} height={60} radius={10} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'200 件'} />
        </Rect>
        <Txt ref={g14note} position={[380, 0]} fontSize={SIZE.label} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'数字示意'} opacity={0} />
      </Node>

      {/* h15 */}
      <Node ref={g15} opacity={0}>
        <Rect ref={g15barN} position={[-350, -80]} width={220} height={56} radius={10} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'平时 120 件'} />
        </Rect>
        <Rect ref={g15barP} position={[-230, 10]} width={460} height={56} radius={10} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'促销期 200 件'} />
        </Rect>
        <Txt ref={g15gap} position={[-350, 100]} fontSize={SIZE.body} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'多出这一截'} opacity={0} />
        <Txt ref={g15sub} position={[0, 170]} fontSize={SIZE.body} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'200 件 - 120 件 = 多出 80 件'} opacity={0} />
        <Txt ref={g15def} position={[0, 230]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'平时 = 促销前同样长的一段时间（示意）'} opacity={0} />
      </Node>

      {/* h16 */}
      <Node ref={g16} opacity={0}>
        <Rect ref={g16q} position={[0, -190]} width={980} height={100} radius={14} fill={T.card} stroke={T.yellow} lineWidth={2}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'哪个牌子的婴儿食品最常跟某牌尿布一起买？'} />
        </Rect>
        <Rect ref={g16a} position={[-280, 40]} width={360} height={120} radius={16} fill={T.card} stroke={T.blue} lineWidth={3} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'婴儿食品'} />
        </Rect>
        <Rect ref={g16b} position={[280, 40]} width={360} height={120} radius={16} fill={T.card} stroke={T.green} lineWidth={3} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'某牌尿布'} />
        </Rect>
        <Line ref={g16link} points={[[-90, 40], [90, 40]]} stroke={T.yellow} lineWidth={3} endArrow opacity={0} />
      </Node>

      {/* h17 */}
      <Node ref={g17} opacity={0}>
        {g17dots.map((r, i) => (
          <Circle key={`g17d-${i}`} ref={r} position={[D17_X(i), -160]} width={18} height={18} fill={T.muted} opacity={0} />
        ))}
        <Txt ref={g17rule} position={[0, -95]} fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.sans} text={'同一单里同时出现才算一起买，次数多的排前面'} textWrap maxWidth={900} opacity={0} />
        <Rect ref={g17a} position={[-280, -20]} width={340} height={110} radius={16} fill={T.card} stroke={T.blue} lineWidth={3} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'婴儿食品'} />
        </Rect>
        <Rect ref={g17b} position={[280, -20]} width={340} height={110} radius={16} fill={T.card} stroke={T.green} lineWidth={3} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'某牌尿布'} />
        </Rect>
        <Line ref={g17link} points={[[-100, -20], [100, -20]]} stroke={T.yellow} lineWidth={3} endArrow opacity={0} />
        {[0, 1, 2].map(i => (
          <Rect
            key={`g17r-${i}`}
            ref={g17ranks[i]}
            position={[-350 + i * 350, 130]}
            width={280}
            height={120}
            radius={10}
            fill={T.card}
            stroke={T.line}
            lineWidth={2}
            opacity={0}
          >
            <Txt position={[0, -28]} fontSize={SIZE.label} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={['第 1 名 · 320 次', '第 2 名 · 210 次', '第 3 名 · 150 次'][i]} />
            <Txt position={[0, 22]} fontSize={SIZE.min} fill={T.muted} fontFamily={FONT.sans} textAlign={'center'} textWrap maxWidth={260} text={['阳光婴儿食品 × 小月亮尿布', '金装婴儿食品 × 安睡宝尿布', '田园婴儿食品 × 云朵尿布'][i]} />
          </Rect>
        ))}
        <Txt ref={g17note} position={[0, -215]} fontSize={SIZE.label} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'示意：牌子名与次数是例子'} opacity={0} />
        {rankCount.node}
      </Node>

      {/* h18 */}
      <Node ref={g18} opacity={0}>
        <Rect ref={g18ana} position={[-400, -60]} width={300} height={140} radius={16} fill={T.card} stroke={T.blue} lineWidth={3}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'业务分析师'} />
        </Rect>
        <Line ref={g18a1} points={[[-240, -60], [-160, -60]]} stroke={T.blue} lineWidth={3} endArrow opacity={0} />
        <Rect ref={g18rep} position={[0, -60]} width={300} height={140} radius={16} fill={T.card} stroke={T.yellow} lineWidth={3} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'报告'} />
        </Rect>
        <Line ref={g18a2} points={[[160, -60], [240, -60]]} stroke={T.blue} lineWidth={3} endArrow opacity={0} />
        <Rect ref={g18dec} position={[400, -60]} width={300} height={140} radius={16} fill={T.card} stroke={T.green} lineWidth={3} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'更好的决策'} />
        </Rect>
        <Txt ref={g18bi} position={[0, -210]} fontSize={SIZE.body} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'商业智能'} opacity={0} />
      </Node>

      {/* h18b */}
      <Node ref={g18b} opacity={0}>
        <Rect ref={g18boltp} position={[-290, -60]} width={420} height={130} radius={16} fill={T.card} stroke={T.blue} lineWidth={3}>
          <Txt position={[0, -28]} fontSize={SIZE.title} fontWeight={700} fill={T.blue} fontFamily={FONT.mono} text={'OLTP'} />
          <Txt position={[0, 30]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'联机事务处理'} />
        </Rect>
        <Rect ref={g18bolap} position={[290, -60]} width={420} height={130} radius={16} fill={T.card} stroke={T.green} lineWidth={3} opacity={0}>
          <Txt position={[0, -28]} fontSize={SIZE.title} fontWeight={700} fill={T.green} fontFamily={FONT.mono} text={'OLAP'} />
          <Txt position={[0, 30]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'联机分析处理'} />
        </Rect>
      </Node>

      {/* h19 */}
      <Node ref={g19} opacity={0}>
        <Rect ref={g19raw} position={[0, -255]} width={320} height={56} radius={12} fill={T.card} stroke={T.line} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'原始数据'} />
        </Rect>
        {g19dots.map((r, i) => (
          <Circle key={`g19d-${i}`} ref={r} position={[DOT_X(i), DOT_Y(i)]} width={16} height={16} fill={(i % 6 === 1 || i % 6 === 4) ? T.blue : T.muted} opacity={0} />
        ))}
        {[0, 1, 2].map(i => (
          <Rect
            key={`g19c-${i}`}
            ref={g19chips[i]}
            position={[-350 + i * 350, 180]}
            width={260}
            height={70}
            radius={12}
            fill={T.card}
            stroke={T.green}
            lineWidth={2}
            opacity={0}
          >
            <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={['计数', '求和', '平均'][i]} />
          </Rect>
        ))}
      </Node>

      {/* h19c */}
      <Node ref={g19c} opacity={0}>
        <Txt ref={g19cmag} position={[420, -255]} fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.sans} text={'一月份几百万条记录'} opacity={0} />
        {[0, 1, 2].map(i => (
          <Txt
            key={`g19ch-${i}`}
            ref={g19chead[i]}
            position={CHEADS[i]}
            fontSize={SIZE.label}
            fontWeight={700}
            fill={CHEAD_FILL[i]}
            fontFamily={FONT.sans}
            text={['日期', '店', '金额'][i]}
            opacity={0}
          />
        ))}
        <Txt ref={g19cnote} position={[0, 240]} fontSize={SIZE.label} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'示意：只画 24 个点作例子'} opacity={0} />
        {[0, 1, 2].map(i => (
          <Rect
            key={`g19cc-${i}`}
            ref={g19ccols[i]}
            position={[-280 + i * 280, 105]}
            width={200}
            height={52}
            radius={10}
            fill={T.card}
            stroke={T.yellow}
            lineWidth={2}
            opacity={0}
          >
            <Txt fontSize={SIZE.label} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={['日期', '店', '金额'][i]} />
          </Rect>
        ))}
      </Node>

      {/* h19b */}
      <Node ref={g19b} opacity={0}>
        <Rect ref={g19bleft} position={[-290, -60]} width={480} height={240} radius={16} fill={T.card} stroke={T.blue} lineWidth={3}>
          <Txt position={[0, 80]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'动一条记录'} />
        </Rect>
        <Circle ref={g19bdot} position={[-290, -80]} width={26} height={26} fill={T.green} opacity={0} />
        <Rect ref={g19bright} position={[290, -60]} width={480} height={240} radius={16} fill={T.card} stroke={T.green} lineWidth={3}>
          <Txt position={[0, 80]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'扫海量记录，算聚合'} />
        </Rect>
        {g19bdots.map((r, i) => (
          <Circle key={`g19bd-${i}`} ref={r} position={[R_X(i), R_Y(i)]} width={14} height={14} fill={T.muted} opacity={0} />
        ))}
        <Txt ref={g19btag} position={[0, -250]} fontSize={SIZE.body} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'差别在访问模式'} opacity={0} />
      </Node>
    </>
  );

  say('每家店一月份总收入？');
  yield* beat('h12',
    all(g12().opacity(1, 0.5)),
    at('数据分析', chain(
      all(...g12dots.slice(0, 6).map(r => r().opacity(1, 0.3))),
      all(...g12dots.slice(6, 12).map(r => r().opacity(1, 0.3))),
      all(...g12dots.slice(12, 18).map(r => r().opacity(1, 0.3))),
      all(...g12dots.slice(18, 24).map(r => r().opacity(1, 0.3))),
    )),
    at('访问模式很不一样', chain(g12scan().opacity(1, 0.3), g12scan().position([240, 50], 1.2))),
    at('每家店一月份总收入多少', g12q().opacity(1, 0.5)),
  );

  say('一月份挑出来，按店加总');
  yield* beat('h13',
    all(g12().opacity(0, 0.5), g13().opacity(1, 0.5),
      g13rows[0]().opacity(1, 0.4), g13rows[1]().opacity(1, 0.4), g13rows[2]().opacity(1, 0.4)),
    at('一月份', chain(
      g13jan[0]().opacity(1, 0.4), g13jan[1]().opacity(1, 0.4), g13jan[2]().opacity(1, 0.4),
      g13scan().opacity(1, 0.3), g13scan().position([0, 100], 1.2),
    )),
    at('按店加总', chain(g13tot[0]().opacity(1, 0.4), g13tot[1]().opacity(1, 0.4), g13tot[2]().opacity(1, 0.4), g13note().opacity(1, 0.4))),
    at('三家店，就有三个数', all(g13tot[0]().stroke(T.yellow, 0.4), g13tot[1]().stroke(T.yellow, 0.4), g13tot[2]().stroke(T.yellow, 0.4))),
    g13().scale(1.02, beat.dur('h13') - 0.6),
  );

  say('香蕉销量比平时多多少？');
  yield* beat('h14',
    all(g13().opacity(0, 0.5), g14().opacity(1, 0.5)),
    at('香蕉销量', all(g14labN().opacity(1, 0.4), g14barN().opacity(1, 0.4), g14note().opacity(1, 0.4))),
    at('平时', g14barN().stroke(T.blue, 0.4)),
    at('促销期间', all(g14labP().opacity(1, 0.4), g14barP().opacity(1, 0.4))),
  );

  say('分开比销量');
  yield* beat('h15',
    all(g14().opacity(0, 0.5), g15().opacity(1, 0.5)),
    at('促销期和平时分开', all(g15barN().opacity(1, 0.4), g15barP().opacity(1, 0.4))),
    at('比一比', g15gap().opacity(1, 0.5)),
    at('减去', g15sub().opacity(1, 0.5)),
    at('平时就是促销前', g15def().opacity(1, 0.5)),
    at('平时卖 120 件', g15barN().stroke(T.yellow, 0.4)),
    at('促销期卖 200 件', g15barP().stroke(T.yellow, 0.4)),
  );

  say('婴儿食品常跟哪牌尿布一起买？');
  yield* beat('h16',
    all(g15().opacity(0, 0.5), g16().opacity(1, 0.5)),
    at('婴儿食品', g16a().opacity(1, 0.5)),
    at('某牌尿布', g16b().opacity(1, 0.5)),
    at('一起买', g16link().opacity(1, 0.5)),
  );

  say('数出来，排个名');
  yield* beat('h17',
    all(g16().opacity(0, 0.5), g17().opacity(1, 0.5), rankCount.node.opacity(1, 0.4)),
    at('扫过全部交易', chain(
      all(...g17dots.slice(0, 5).map(r => r().opacity(1, 0.25))),
      all(...g17dots.slice(5, 10).map(r => r().opacity(1, 0.25))),
    )),
    at('数出来', chain(g17a().opacity(1, 0.4), g17b().opacity(1, 0.4), g17link().opacity(1, 0.4))),
    at('排个名', chain(
      all(g17ranks[0]().opacity(1, 0.3), rankCount.n(1, 0.3)),
      all(g17ranks[1]().opacity(1, 0.3), rankCount.n(2, 0.3)),
      all(g17ranks[2]().opacity(1, 0.3), rankCount.n(3, 0.3)),
    )),
    at('同一单里同时出现', g17rule().opacity(1, 0.5)),
    at('比如示意', g17note().opacity(1, 0.4)),
    at('第一名是阳光婴儿食品', g17ranks[0]().stroke(T.yellow, 0.4)),
    at('第二名是金装婴儿食品', g17ranks[1]().stroke(T.yellow, 0.4)),
    at('第三名是田园婴儿食品', g17ranks[2]().stroke(T.yellow, 0.4)),
    at('出现 150 次', g17ranks[2]().stroke(T.green, 0.4)),
  );

  say('分析师写查询，报告帮决策');
  yield* beat('h18',
    all(g17().opacity(0, 0.5), g18().opacity(1, 0.5)),
    at('业务分析师', g18a1().opacity(1, 0.4)),
    at('报告', all(g18rep().opacity(1, 0.4), g18a2().opacity(1, 0.4))),
    at('更好的决策', g18dec().opacity(1, 0.4)),
    at('商业智能', g18bi().opacity(1, 0.5)),
  );

  say('联机分析处理，OLAP');
  yield* beat('h18b',
    all(g18().opacity(0, 0.5), g18b().opacity(1, 0.5)),
    at('联机分析处理', g18bolap().opacity(1, 0.5)),
    at('OLAP', g18bolap().stroke(T.yellow, 0.4)),
  );

  say('扫海量记录，算聚合');
  yield* beat('h19',
    all(g18b().opacity(0, 0.5), g19().opacity(1, 0.5),
      ...g19dots.map(r => r().opacity(1, 0.12))),
    at('原始数据', g19raw().opacity(1, 0.4)),
    at('计数、求和、平均', chain(g19chips[0]().opacity(1, 0.4), g19chips[1]().opacity(1, 0.4), g19chips[2]().opacity(1, 0.4))),
    at('少数几列', all(g19dots[1]().fill(T.yellow, 0.4), g19dots[7]().fill(T.yellow, 0.4), g19dots[13]().fill(T.yellow, 0.4), g19dots[19]().fill(T.yellow, 0.4))),
    at('聚合统计', g19raw().opacity(0.35, 0.6)),
    g19().scale(1.02, beat.dur('h19') - 0.6),
  );

  say('每条只读日期、店、金额三列');
  yield* beat('h19c',
    // r6：开场先把点阵复位成全灰，不留 h19 的亮色（不读作答案）；三列仍按旁白点名时亮起
    all(g19c().opacity(1, 0.5), ...g19dots.map(r => r().fill(T.muted, 0.3))),
    at('几百万条', all(g19cmag().opacity(1, 0.5), g19cnote().opacity(1, 0.5))),
    at('日期、店、金额', chain(
      g19ccols[0]().opacity(1, 0.4), g19ccols[1]().opacity(1, 0.4), g19ccols[2]().opacity(1, 0.4),
      all(...g19dots.map((r, i) => r().fill(i % 6 === 0 ? T.yellow : i % 6 === 2 ? T.blue : i % 6 === 4 ? T.green : T.muted, 0.4))),
      all(g19chead[0]().opacity(1, 0.4), g19chead[1]().opacity(1, 0.4), g19chead[2]().opacity(1, 0.4)),
    )),
  );

  say('差别在访问模式');
  yield* beat('h19b',
    all(g19().opacity(0, 0.5), g19c().opacity(0, 0.5), g19b().opacity(1, 0.5)),
    at('接单动一条记录', g19bdot().opacity(1, 0.5)),
    at('分析扫海量记录算聚合', chain(...g19bdots.map(r => r().opacity(1, 0.12)))),
    at('不只是查询大一点小一点', g19btag().opacity(1, 0.5)),
    g19b().scale(1.02, beat.dur('h19b') - 0.6),
  );
});
