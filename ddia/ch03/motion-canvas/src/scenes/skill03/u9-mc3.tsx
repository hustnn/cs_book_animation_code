// U9 场景 3（MC）r4：i25–i28e —— 分析师查仓库、关系模型与 SQL、
// 图形化分析工具（下钻/切片/切块）、大企业有小公司没有、
// 仓库针对分析优化、交易的索引不擅长分析。“费大力气”用 Meter 计量。
// r4 改动（B35）：i27a 后加三拍演示——同一张分析表走一遍下钻（月汇总→天行）、
// r5 改动（r4 新手测试）：i27 画出 SQL 查询卡（工具生成的查询，示意）；i27b 月汇总卡补“本月共卖 4 件”；i28c 加因果小注；i28e 改触发词 + 加“查几百万次”小注。
// r6 改动（r5 新手测试）：i27 柱状图改成两根柱子对上 SQL 结果（140102 卖 1 件、140103 卖 3 件，柱高 1:3），加横轴“日期”、纵轴“数量”、日期与数值标签、标题“可视化结果 · 产品 31”；i27b 下钻表一开始就摆三行、产品 28 的行念到时先灰掉，i27c/i27d 旁白改“灰掉了，先不看它 / 只剩这一行还亮着”；i28d 模式牌与“分析访问模式”标签提前到“一大优点”时出现，旁白加半句挂钩。
// r7 改动（r6 新手测试 P2-4）：i27b 旁白加“140102 就是 2014 年 1 月 2 日”（画面出日期展开小标）与算式“1 件加 3 件，就是这 4 件”（两行产品 31 轻 pulse）。
// r8 改动（r7 新手测试 P2-5）：i27b 旁白加“1401 就是 2014 年 1 月”；表下加绿色“合计 4 件”标，与日期小标并排在表下（日期小标左移至 [-210,70]，合计标 [210,70]；两标之间空隙大，不碰表底与操作牌）。
// 帧级审查修复 F2：月汇总卡加高（总数文字被卡底边划过）；F3：柱状图缩放 1.12 改 1.05（柱子顶出卡片）。
// 切片（固定产品 31）、切块（产品 31 + 140102）；演示表三行里 140102|31|1 是
// i20 分析表里的原行，另两行是示意数据，角标“示意”。i28e 补一句为什么。
// 分镜：skill-ch03/beats-u9.md；原文：DDIA §3.8（书页 p92–93，PDF p114–115）。
// 时长全部来自 timeline/u9.json（beat() 驱动），不手写 waitFor。
import {Circle, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, chain, createRef} from '@motion-canvas/core';
import {at, makeBeats} from '../../lib/beats';
import {Meter, tag} from '../../lib/schemas';
import {FONT, SAFE, SIZE, T} from '../../lib/theme';
import timeline from '../../timeline/u9.json';

export default makeScene2D(function* (view) {
  view.fill(T.bg);
  const beat = makeBeats(timeline);

  const header = createRef<Txt>();
  const anchor = createRef<Txt>();
  const say = (text: string) => anchor().text(text);

  // ---- i25：分析师查仓库 ----
  const g25 = createRef<Node>();
  const whBody25 = createRef<Rect>();
  const whLid25 = createRef<Circle>();
  const analyst25 = createRef<Rect>();
  const qArrow25 = createRef<Line>();

  // ---- i26–i27：关系模型 / 分析工具 ----
  const g26 = createRef<Node>();
  const relTable = createRef<Rect>();
  const sqlPlate = createRef<Txt>();
  const toolCard = createRef<Rect>();
  const chartCard = createRef<Rect>();
  const chartTitle = createRef<Txt>();
  const sqlCard = createRef<Rect>();
  const sqlTag = createRef<Txt>();
  const bars = [0, 1].map(() => createRef<Rect>());
  const barVals = [0, 1].map(() => createRef<Txt>());
  const barDates = [0, 1].map(() => createRef<Txt>());
  const axisLine = createRef<Line>();
  const yLab = createRef<Txt>();
  const xLab = createRef<Txt>();
  const qArrow27 = createRef<Line>();
  const qDot = createRef<Circle>();
  const opCards = [0, 1, 2].map(() => createRef<Rect>());
  const monthCard = createRef<Rect>();
  const monthTotal = createRef<Txt>();
  const prodTag = createRef<Txt>();
  const demoTable = createRef<Rect>();
  const demoRows = [0, 1, 2].map(() => createRef<Rect>());
  const dateTag = createRef<Txt>();
  const totalTag = createRef<Txt>();
  const demoTag = tag([300, -215], '示意', [0, 0]);

  // ---- i28a–i28c：大企业 / 小公司 ----
  const g28 = createRef<Node>();
  const bigCard = createRef<Rect>();
  const bigWh = createRef<Rect>();
  const bigTick = createRef<Txt>();
  const smallCard = createRef<Rect>();
  const smallX = createRef<Txt>();
  const smallDb = createRef<Rect>();
  const sheetCard = createRef<Rect>();
  const miniChips = [0, 1, 2].map(() => createRef<Rect>());
  const heavyTag = createRef<Txt>();
  const causeTag = createRef<Txt>();
  const effort = new Meter([-540, 80], 120, {title: '费力', tone: T.red});

  // ---- i28d：为分析优化 ----
  const g19 = createRef<Node>();
  const whBody19 = createRef<Rect>();
  const whLid19 = createRef<Circle>();
  const modeCard = createRef<Rect>();
  const modeLabel = createRef<Txt>();

  // ---- i28e：交易的索引不擅长分析 ----
  const g20 = createRef<Node>();
  const txIdx = createRef<Rect>();
  const anIdx = createRef<Rect>();
  const anX = createRef<Txt>();
  const whyTag = createRef<Txt>();

  view.add(
    <>
      <Txt
        ref={header}
        position={[-SAFE.halfW, -SAFE.halfH]}
        offset={[-1, -1]}
        fontSize={SIZE.label}
        fill={T.muted}
        fontFamily={FONT.sans}
        text={'数据仓库与 ETL'}
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

      {/* i25：分析师查仓库 */}
      <Node ref={g25} opacity={0}>
        <Rect ref={whBody25} position={[-300, -80]} width={340} height={130} radius={16} fill={T.card} stroke={T.blue} lineWidth={3} opacity={0}>
          <Txt position={[0, 30]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'数据仓库'} />
        </Rect>
        <Circle ref={whLid25} position={[-300, -145]} width={340} height={40} fill={T.bg} stroke={T.blue} lineWidth={3} opacity={0} />
        <Rect ref={analyst25} position={[300, -80]} width={300} height={110} radius={14} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'业务分析师'} />
        </Rect>
        <Line ref={qArrow25} points={[[150, -80], [-130, -80]]} stroke={T.green} lineWidth={3} endArrow opacity={0} />
      </Node>

      {/* i26–i27：关系模型 / 分析工具 */}
      <Node ref={g26} opacity={0}>
        <Rect ref={relTable} position={[0, -80]} width={560} height={180} radius={16} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt position={[0, -55]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'关系表'} />
          <Txt position={[0, 0]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'日期 | 产品 | 数量'} />
          <Txt position={[0, 45]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.mono} text={'140102 | 31 | 1'} />
        </Rect>
        <Txt ref={sqlPlate} position={[0, 60]} fontSize={SIZE.title} fontWeight={700} fill={T.yellow} fontFamily={FONT.mono} text={'SQL'} opacity={0} />
        <Rect ref={toolCard} position={[-320, -80]} width={300} height={110} radius={14} fill={T.card} stroke={T.line} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'图形化分析工具'} />
        </Rect>
        <Line ref={qArrow27} points={[[-170, -80], [-20, -80]]} stroke={T.green} lineWidth={3} endArrow opacity={0} />
        <Circle ref={qDot} position={[-170, -80]} width={22} height={22} fill={T.yellow} opacity={0} />
        <Rect ref={sqlCard} position={[0, 30]} width={600} height={96} radius={14} fill={T.card} stroke={T.yellow} lineWidth={2} opacity={0}>
          <Txt position={[0, -22]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'SELECT 日期， 产品， 数量'} />
          <Txt position={[0, 22]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'FROM 销售分析表 WHERE 产品 = 31'} />
        </Rect>
        <Txt ref={sqlTag} position={[0, -32]} fontSize={SIZE.min} fill={T.muted} fontFamily={FONT.sans} text={'工具生成的查询（示意）'} opacity={0} />
        <Rect ref={chartCard} position={[280, -80]} width={320} height={160} radius={14} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt ref={chartTitle} position={[0, -62]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'可视化结果 · 产品 31'} opacity={0} />
        </Rect>
        {/* r6：两根柱子对上 SQL 结果（140102 卖 1 件、140103 卖 3 件，柱高 1:3），基线 y=-45 */}
        <Line ref={axisLine} points={[[150, -45], [410, -45]]} stroke={T.line} lineWidth={2} opacity={0} />
        {[
          {x: 230, y: -58.5, h: 27, v: '1', d: '140102'},
          {x: 330, y: -85.5, h: 81, v: '3', d: '140103'},
        ].map((b, i) => (
          <Rect
            key={`bar-${i}`}
            ref={bars[i]}
            position={[b.x, b.y]}
            width={60}
            height={b.h}
            radius={8}
            fill={T.blue}
            opacity={0}
          />
        ))}
        <Txt ref={barVals[0]} position={[230, -60]} fontSize={SIZE.label} fill={T.white} fontFamily={FONT.mono} text={'1'} opacity={0} />
        <Txt ref={barVals[1]} position={[330, -113]} fontSize={SIZE.label} fill={T.white} fontFamily={FONT.mono} text={'3'} opacity={0} />
        <Txt ref={barDates[0]} position={[230, -32]} fontSize={SIZE.min} fill={T.text} fontFamily={FONT.mono} text={'140102'} opacity={0} />
        <Txt ref={barDates[1]} position={[330, -32]} fontSize={SIZE.min} fill={T.text} fontFamily={FONT.mono} text={'140103'} opacity={0} />
        <Txt ref={yLab} position={[138, -95]} rotation={-90} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'数量'} opacity={0} />
        <Txt ref={xLab} position={[405, -32]} fontSize={SIZE.min} fill={T.muted} fontFamily={FONT.sans} text={'日期'} opacity={0} />
        {['下钻', '切片', '切块'].map((t, i) => (
          <Rect
            key={`op-${i}`}
            ref={opCards[i]}
            position={[-320 + i * 320, 130]}
            width={240}
            height={64}
            radius={12}
            fill={T.card}
            stroke={T.purple}
            lineWidth={2}
            opacity={0}
          >
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={t} />
          </Rect>
        ))}
        {/* i27b–i27d：同一张分析表走一遍下钻/切片/切块 */}
        <Rect ref={monthCard} position={[0, -80]} width={440} height={120} radius={14} fill={T.card} stroke={T.yellow} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'1401 月 · 产品 31 汇总'} />
        </Rect>
        <Txt ref={monthTotal} position={[0, -48]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} text={'本月共卖 4 件'} opacity={0} />
        <Txt ref={prodTag} position={[0, 8]} fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.sans} text={'先只看产品 31'} opacity={0} />
        <Rect ref={demoTable} position={[0, -80]} width={560} height={240} radius={16} fill={T.card} stroke={T.line} lineWidth={2} opacity={0}>
          <Txt position={[0, -90]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'日期 | 产品 | 数量'} />
        </Rect>
        {['140102 | 31 | 1', '140102 | 28 | 2', '140103 | 31 | 3'].map((t, i) => (
          <Rect
            key={`drow-${i}`}
            ref={demoRows[i]}
            position={[0, -115 + i * 60]}
            width={520}
            height={48}
            radius={10}
            fill={T.card}
            stroke={T.line}
            lineWidth={2}
            opacity={0}
          >
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={t} />
          </Rect>
        ))}
        {demoTag}
        {/* r8：日期小标左移，与合计标并排在表下（表底 y=40、操作牌顶 y=98 之间的空带） */}
        <Txt ref={dateTag} position={[-210, 70]} fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.mono} text={'140102 = 2014 年 1 月 2 日'} opacity={0} />
        <Txt ref={totalTag} position={[210, 70]} fontSize={SIZE.label} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'合计 4 件'} opacity={0} />
      </Node>

      {/* i28a–i28c：大企业 / 小公司 */}
      <Node ref={g28} opacity={0}>
        <Rect ref={bigCard} position={[-300, -80]} width={360} height={220} radius={16} fill={T.card} stroke={T.line} lineWidth={2}>
          <Txt position={[0, -80]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'大企业'} />
        </Rect>
        <Rect ref={bigWh} position={[-300, -10]} width={260} height={80} radius={14} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'数据仓库'} />
        </Rect>
        <Txt ref={bigTick} position={[-300, 60]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} text={'几乎家家都有'} opacity={0} />
        <Rect ref={smallCard} position={[300, -80]} width={360} height={220} radius={16} fill={T.card} stroke={T.line} lineWidth={2}>
          <Txt position={[0, -80]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'小公司'} />
        </Rect>
        <Txt ref={smallX} position={[300, -10]} fontSize={SIZE.title} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'✕ 没有仓库'} opacity={0} />
        <Rect ref={smallDb} position={[300, -10]} width={260} height={80} radius={14} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'常规数据库'} />
        </Rect>
        <Rect ref={sheetCard} position={[300, 90]} width={260} height={64} radius={12} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'电子表格也能分析'} />
        </Rect>
        {[0, 1, 2].map(i => (
          <Rect
            key={`chip-${i}`}
            ref={miniChips[i]}
            position={[-420 + i * 120, 120]}
            width={110}
            height={44}
            radius={10}
            fill={T.card}
            stroke={T.red}
            lineWidth={2}
            opacity={0}
          >
            <Txt fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={['网站', '收银', '库存'][i]} />
          </Rect>
        ))}
        <Txt ref={heavyTag} position={[-300, 195]} fontSize={SIZE.label} fill={T.red} fontFamily={FONT.sans} text={'费大力气'} opacity={0} />
        <Txt ref={causeTag} position={[-300, 235]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'数据散在几十个系统里，搬一次就得协调一回'} opacity={0} />
      </Node>
      {effort.nodes()}

      {/* i28d：为分析优化 */}
      <Node ref={g19} opacity={0}>
        <Rect ref={whBody19} position={[-300, -80]} width={340} height={130} radius={16} fill={T.card} stroke={T.line} lineWidth={2}>
          <Txt position={[0, 30]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'数据仓库'} />
        </Rect>
        <Circle ref={whLid19} position={[-300, -145]} width={340} height={40} fill={T.bg} stroke={T.line} lineWidth={2} />
        <Rect ref={modeCard} position={[300, -80]} width={340} height={130} radius={16} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt position={[0, -25]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'扫海量记录'} />
          <Txt position={[0, 25]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'算聚合'} />
        </Rect>
        <Txt ref={modeLabel} position={[300, -175]} fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.sans} text={'分析访问模式'} opacity={0} />
      </Node>

      {/* i28e：交易的索引不擅长分析 */}
      <Node ref={g20} opacity={0}>
        <Rect ref={txIdx} position={[-300, -80]} width={340} height={130} radius={16} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt position={[0, -25]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'按键查少量记录'} />
          <Txt position={[0, 25]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} text={'对交易很有效'} />
        </Rect>
        <Rect ref={anIdx} position={[300, -80]} width={340} height={130} radius={16} fill={T.card} stroke={T.line} lineWidth={2} opacity={0}>
          <Txt position={[0, -25]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'扫海量记录算聚合'} />
          <Txt position={[0, 25]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'回答分析查询'} />
        </Rect>
        <Txt ref={anX} position={[300, 60]} fontSize={SIZE.label} fill={T.red} fontFamily={FONT.sans} text={'不太擅长'} opacity={0} />
        <Txt ref={whyTag} position={[300, 105]} fontSize={SIZE.label} fill={T.red} fontFamily={FONT.sans} text={'按一个键取一条，查几百万次才扫完'} opacity={0} />
      </Node>
    </>
  );

  say('分析师查仓库');
  yield* beat('i25',
    all(g25().opacity(1, 0.5), whBody25().opacity(1, 0.5), whLid25().opacity(1, 0.5)),
    at('业务分析师', analyst25().opacity(1, 0.5)),
    at('不用再碰业务库', qArrow25().opacity(1, 0.5)),
  );

  say('最常见是关系型');
  yield* beat('i26',
    all(g25().opacity(0, 0.5), g26().opacity(1, 0.5)),
    at('关系型', relTable().opacity(1, 0.5)),
    at('SQL', sqlPlate().opacity(1, 0.4)),
  );

  say('生成 SQL 查询');
  yield* beat('i27',
    all(relTable().opacity(0, 0.4), sqlPlate().opacity(0, 0.4), toolCard().opacity(1, 0.5), chartCard().opacity(1, 0.5)),
    at('生成 SQL 查询', all(qArrow27().opacity(1, 0.4), sqlCard().opacity(1, 0.4), sqlTag().opacity(1, 0.4))),
    at('可视化结果', all(chartTitle().opacity(1, 0.4), bars[0]().opacity(1, 0.4), bars[1]().opacity(1, 0.4), axisLine().opacity(1, 0.4), barVals[0]().opacity(1, 0.3), barVals[1]().opacity(1, 0.3), barDates[0]().opacity(1, 0.3), barDates[1]().opacity(1, 0.3), yLab().opacity(1, 0.3), xLab().opacity(1, 0.3))),
    at('点一点', toolCard().stroke(T.yellow, 0.4)),
    at('送进仓库', chain(qDot().opacity(1, 0.2), qDot().position([-20, -80], 1.2))),
    at('结果再画成图', all(chartCard().stroke(T.green, 0.4), bars[0]().scale(1.05, 0.4), bars[1]().scale(1.05, 0.4))),
  );

  say('下钻、切片、切块');
  yield* beat('i27a',
    at('下钻', opCards[0]().opacity(1, 0.4)),
    at('切片与切块', all(opCards[1]().opacity(1, 0.4), opCards[2]().opacity(1, 0.4))),
  );

  say('下钻：往细里看');
  yield* beat('i27b',
    all(toolCard().opacity(0, 0.4), chartCard().opacity(0, 0.4), chartTitle().opacity(0, 0.3), axisLine().opacity(0, 0.3), barVals[0]().opacity(0, 0.3), barVals[1]().opacity(0, 0.3), barDates[0]().opacity(0, 0.3), barDates[1]().opacity(0, 0.3), yLab().opacity(0, 0.3), xLab().opacity(0, 0.3), qArrow27().opacity(0, 0.4), qDot().opacity(0, 0.4), sqlCard().opacity(0, 0.4), sqlTag().opacity(0, 0.4), bars[0]().opacity(0, 0.3), bars[1]().opacity(0, 0.3), opCards[0]().stroke(T.yellow, 0.4)),
    at('往细里看', monthCard().opacity(1, 0.5)),
    // r8：新加的“1401 就是 2014 年 1 月”半句把月汇总卡的静置拉长到 5.23s——卡片在新句处轻 pulse 一下破定格（同 r7 i14 缩放修法定格的思路；无新文字、无旁白改动）
    at('1401 就是 2014 年 1 月', chain(monthCard().scale(1.04, 0.5), monthCard().scale(1, 0.5))),
    at('这张汇总先只看产品 31', prodTag().opacity(1, 0.4)),
    at('本月一共卖了 4 件', monthTotal().opacity(1, 0.4)),
    at('再钻到每一天', chain(monthCard().opacity(0, 0.4), monthTotal().opacity(0, 0.4), prodTag().opacity(0, 0.4), all(demoTable().opacity(1, 0.5), demoRows[0]().opacity(1, 0.4), demoRows[2]().opacity(1, 0.4), demoTag.opacity(1, 0.4)))),
    at('产品 28 那一行', demoRows[1]().opacity(0.25, 0.4)),
    at('140102 这一天卖了 1 件', demoRows[0]().stroke(T.yellow, 0.4)),
    at('140102 就是 2014 年 1 月 2 日', dateTag().opacity(1, 0.4)),
    at('140103 那天卖了 3 件', demoRows[2]().stroke(T.yellow, 0.4)),
    at('1 件加 3 件', all(
      chain(demoRows[0]().scale(1.03, 0.3), demoRows[0]().scale(1, 0.3)),
      chain(demoRows[2]().scale(1.03, 0.3), demoRows[2]().scale(1, 0.3)),
      // r8 P2-5②：汇总的“4 件”在画面上有了落点（与日期小标并排）
      totalTag().opacity(1, 0.4),
    )),
  );

  say('切片：固定一个条件');
  yield* beat('i27c',
    all(opCards[0]().stroke(T.purple, 0.3), opCards[1]().stroke(T.yellow, 0.4)),
    at('只看产品 31', all(demoRows[0]().stroke(T.green, 0.4), demoRows[2]().stroke(T.green, 0.4))),
    at('灰掉了', chain(demoRows[1]().scale(1.02, 0.3), demoRows[1]().scale(1, 0.3))),
  );

  say('切块：同时固定两个条件');
  yield* beat('i27d',
    all(opCards[1]().stroke(T.purple, 0.3), opCards[2]().stroke(T.yellow, 0.4)),
    at('140102 这一天', all(demoRows[2]().opacity(0.25, 0.5), demoRows[2]().stroke(T.line, 0.3))),
    at('只剩这一行还亮着', all(demoRows[0]().stroke(T.yellow, 0.4), demoRows[0]().scale(1.05, 0.4))),
  );

  say('大企业有，小公司没有');
  yield* beat('i28a',
    all(g26().opacity(0, 0.5), g28().opacity(1, 0.5)),
    at('大企业', all(bigWh().opacity(1, 0.4), bigTick().opacity(1, 0.4))),
    at('小公司', smallX().opacity(1, 0.4)),
  );

  say('小数据，表格也够');
  yield* beat('i28b',
    at('常规数据库', all(smallX().opacity(0, 0.4), smallDb().opacity(1, 0.4))),
    at('电子表格', sheetCard().opacity(1, 0.4)),
  );

  say('大公司费大力气');
  yield* beat('i28c',
    at('费大力气', all(
      chain(miniChips[0]().opacity(1, 0.2), miniChips[1]().opacity(1, 0.2), miniChips[2]().opacity(1, 0.2), heavyTag().opacity(1, 0.3)),
      bigCard().stroke(T.red, 0.5),
      effort.show(),
      effort.to(0.9, 1.5),
    )),
    at('数据散在几十个系统里', causeTag().opacity(1, 0.4)),
  );

  say('为分析优化');
  yield* beat('i28d',
    all(g28().opacity(0, 0.5), ...effort.nodes().map(n => n.opacity(0, 0.3)), g19().opacity(1, 0.5)),
    at('一大优点', all(whBody19().stroke(T.green, 0.5), modeCard().opacity(1, 0.5), modeLabel().opacity(1, 0.5))),
    at('扫海量记录', chain(modeCard().scale(1.03, 0.4), modeCard().scale(1, 0.4))),
  );

  say('交易的索引不擅长分析');
  yield* beat('i28e',
    all(g19().opacity(0, 0.5), g20().opacity(1, 0.5)),
    at('对交易很有效', txIdx().opacity(1, 0.5)),
    at('不太擅长', all(anIdx().opacity(1, 0.5), anX().opacity(1, 0.4))),
    at('按一个键，只能取一条记录', txIdx().stroke(T.yellow, 0.4)),
    at('查几百万次', all(anIdx().stroke(T.yellow, 0.4), whyTag().opacity(1, 0.4))),
  );
});
