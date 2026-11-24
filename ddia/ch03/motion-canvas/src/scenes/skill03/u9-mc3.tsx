// U9 场景 3（MC）：b19–b30 —— 仓库针对分析优化、关系模型与 SQL、
// 表面同是 SQL、内部不同、同一产品两个引擎、商业与开源厂商、
// 误区（不是更大的数据库）、星型模式引出、结尾回扣。
// 分镜：skill-ch03/beats-u9.md；原文：DDIA §3.8（书页 p92–93，PDF p114–115）。
// 时长全部来自 timeline/u9.json（beat() 驱动），不手写 waitFor。
import {Circle, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, chain, createRef} from '@motion-canvas/core';
import {at, makeBeats} from '../../lib/beats';
import {FONT, SAFE, SIZE, T} from '../../lib/theme';
import timeline from '../../timeline/u9.json';

const OSS = ['Hive', 'Spark SQL', 'Impala', 'Presto', 'Tajo', 'Drill'];

export default makeScene2D(function* (view) {
  view.fill(T.bg);
  const beat = makeBeats(timeline);

  const header = createRef<Txt>();
  const anchor = createRef<Txt>();
  const say = (text: string) => anchor().text(text);

  // ---- b19：为分析优化 ----
  const g19 = createRef<Node>();
  const whBody19 = createRef<Rect>();
  const whLid19 = createRef<Circle>();
  const modeCard = createRef<Rect>();

  // ---- b20：交易的索引不擅长分析 ----
  const g20 = createRef<Node>();
  const txIdx = createRef<Rect>();
  const anIdx = createRef<Rect>();
  const anX = createRef<Txt>();

  // ---- b21：路线牌 ----
  const g21 = createRef<Node>();
  const routeCard = createRef<Rect>();

  // ---- b22–b23：关系模型 / 分析工具 ----
  const g22 = createRef<Node>();
  const relTable = createRef<Rect>();
  const sqlPlate = createRef<Txt>();
  const toolCard = createRef<Rect>();
  const chartCard = createRef<Rect>();
  const bars = [0, 1, 2].map(() => createRef<Rect>());
  const qArrow23 = createRef<Line>();
  const opCards = [0, 1, 2].map(() => createRef<Rect>());

  // ---- b24–b25：表面像、内部不同 ----
  const g24 = createRef<Node>();
  const whBox = createRef<Rect>();
  const txBox = createRef<Rect>();
  const plateL = createRef<Txt>();
  const plateR = createRef<Txt>();
  const insideL = createRef<Txt>();
  const insideR = createRef<Txt>();
  const forkTag = createRef<Txt>();

  // ---- b26：同一产品，两个引擎 ----
  const g26 = createRef<Node>();
  const prodBox = createRef<Rect>();
  const prodTag1 = createRef<Txt>();
  const prodTag2 = createRef<Txt>();
  const engTx = createRef<Rect>();
  const engAn = createRef<Rect>();
  const commonPlate = createRef<Txt>();

  // ---- b27a–b27c：厂商 ----
  const g27 = createRef<Node>();
  const vendorCards = [0, 1, 2, 3].map(() => createRef<Rect>());
  const priceTag = createRef<Txt>();
  const rsCard = createRef<Rect>();
  const rsTag = createRef<Txt>();
  const ossCards = OSS.map(() => createRef<Rect>());
  const dremelCard = createRef<Rect>();
  const dremelLines = [0, 1].map(() => createRef<Line>());

  // ---- b28：误区 ----
  const g28 = createRef<Node>();
  const biggerCard = createRef<Rect>();
  const mythTag = createRef<Txt>();
  const trueCards = [0, 1, 2].map(() => createRef<Rect>());

  // ---- b29–b30：星型引出 + 结尾 ----
  const g29 = createRef<Node>();
  const whBody29 = createRef<Rect>();
  const whLid29 = createRef<Circle>();
  const star = createRef<Txt>();
  const nextTag = createRef<Txt>();
  const stepCards = [0, 1, 2].map(() => createRef<Rect>());
  const whBody30 = createRef<Rect>();
  const whLid30 = createRef<Circle>();

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

      {/* b19：为分析优化 */}
      <Node ref={g19} opacity={0}>
        <Rect ref={whBody19} position={[-300, -80]} width={340} height={130} radius={16} fill={T.card} stroke={T.line} lineWidth={2}>
          <Txt position={[0, 30]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'数据仓库'} />
        </Rect>
        <Circle ref={whLid19} position={[-300, -145]} width={340} height={40} fill={T.bg} stroke={T.line} lineWidth={2} />
        <Rect ref={modeCard} position={[300, -80]} width={340} height={130} radius={16} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt position={[0, -25]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'扫海量记录'} />
          <Txt position={[0, 25]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'算聚合'} />
        </Rect>
      </Node>

      {/* b20：交易的索引不擅长分析 */}
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
      </Node>

      {/* b21：路线牌 */}
      <Node ref={g21} opacity={0}>
        <Rect ref={routeCard} position={[0, -80]} width={760} height={100} radius={16} fill={T.card} stroke={T.blue} lineWidth={2}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'下一站：针对分析优化的存储引擎'} />
        </Rect>
      </Node>

      {/* b22–b23：关系模型 / 分析工具 */}
      <Node ref={g22} opacity={0}>
        <Rect ref={relTable} position={[0, -80]} width={560} height={180} radius={16} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt position={[0, -55]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'关系表'} />
          <Txt position={[0, 0]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'日期 | 产品 | 数量'} />
          <Txt position={[0, 45]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.mono} text={'140102 | 31 | 1'} />
        </Rect>
        <Txt ref={sqlPlate} position={[0, 60]} fontSize={SIZE.title} fontWeight={700} fill={T.yellow} fontFamily={FONT.mono} text={'SQL'} opacity={0} />
        <Rect ref={toolCard} position={[-320, -80]} width={300} height={110} radius={14} fill={T.card} stroke={T.line} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'图形化分析工具'} />
        </Rect>
        <Line ref={qArrow23} points={[[-170, -80], [-20, -80]]} stroke={T.green} lineWidth={3} endArrow opacity={0} />
        <Rect ref={chartCard} position={[280, -80]} width={320} height={160} radius={14} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt position={[0, -55]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'可视化结果'} />
        </Rect>
        {[0, 1, 2].map(i => (
          <Rect
            key={`bar-${i}`}
            ref={bars[i]}
            position={[180 + i * 100, -30 - i * 25]}
            width={60}
            height={50 + i * 50}
            radius={8}
            fill={T.blue}
            opacity={0}
          />
        ))}
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
      </Node>

      {/* b24–b25：表面像、内部不同 */}
      <Node ref={g24} opacity={0}>
        <Rect ref={whBox} position={[-300, -80]} width={340} height={150} radius={16} fill={T.card} stroke={T.line} lineWidth={2}>
          <Txt position={[0, -40]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'数据仓库'} />
        </Rect>
        <Rect ref={txBox} position={[300, -80]} width={340} height={150} radius={16} fill={T.card} stroke={T.line} lineWidth={2}>
          <Txt position={[0, -40]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'交易数据库'} />
        </Rect>
        <Txt ref={plateL} position={[-300, -180]} fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.mono} text={'SQL 接口'} opacity={0} />
        <Txt ref={plateR} position={[300, -180]} fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.mono} text={'SQL 接口'} opacity={0} />
        <Txt ref={insideL} position={[-300, 20]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} text={'内部：列式扫描'} opacity={0} />
        <Txt ref={insideR} position={[300, 20]} fontSize={SIZE.label} fill={T.blue} fontFamily={FONT.sans} text={'内部：按键索引'} opacity={0} />
        <Txt ref={forkTag} position={[0, 120]} fontSize={SIZE.label} fill={T.red} fontFamily={FONT.sans} text={'各专注一边'} opacity={0} />
      </Node>

      {/* b26：同一产品，两个引擎 */}
      <Node ref={g26} opacity={0}>
        <Rect ref={prodBox} position={[0, -80]} width={760} height={150} radius={16} fill={T.card} stroke={T.line} lineWidth={2} opacity={0}>
          <Txt position={[0, -45]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'同一产品'} />
        </Rect>
        <Txt ref={prodTag1} position={[-180, -125]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'SQL Server'} opacity={0} />
        <Txt ref={prodTag2} position={[180, -125]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'SAP HANA'} opacity={0} />
        <Rect ref={engTx} position={[-190, -40]} width={320} height={80} radius={12} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'交易引擎'} />
        </Rect>
        <Rect ref={engAn} position={[190, -40]} width={320} height={80} radius={12} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'分析引擎'} />
        </Rect>
        <Txt ref={commonPlate} position={[0, 110]} fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.mono} text={'共用一个 SQL 接口'} opacity={0} />
      </Node>

      {/* b27a–b27c：厂商 */}
      <Node ref={g27} opacity={0}>
        {['Teradata', 'Vertica', 'SAP HANA', 'ParAccel'].map((t, i) => (
          <Rect
            key={`ven-${i}`}
            ref={vendorCards[i]}
            position={[-450 + i * 300, -80]}
            width={260}
            height={90}
            radius={12}
            fill={T.card}
            stroke={T.line}
            lineWidth={2}
            opacity={0}
          >
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={t} />
          </Rect>
        ))}
        <Txt ref={priceTag} position={[0, 30]} fontSize={SIZE.label} fill={T.red} fontFamily={FONT.sans} text={'昂贵的商业许可'} opacity={0} />
        <Rect ref={rsCard} position={[450, 110]} width={260} height={64} radius={12} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'RedShift'} />
        </Rect>
        <Txt ref={rsTag} position={[450, 170]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} text={'托管版，跑在云上'} opacity={0} />
        {OSS.map((t, i) => (
          <Rect
            key={`oss-${i}`}
            ref={ossCards[i]}
            position={[-380 + (i % 3) * 380, -160 + Math.floor(i / 3) * 130]}
            width={260}
            height={90}
            radius={12}
            fill={T.card}
            stroke={T.purple}
            lineWidth={2}
            opacity={0}
          >
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={t} />
          </Rect>
        ))}
        <Rect ref={dremelCard} position={[0, 130]} width={260} height={64} radius={12} fill={T.card} stroke={T.purple} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'Dremel'} />
        </Rect>
        <Line ref={dremelLines[0]} points={[[-80, 98], [-380, 15]]} stroke={T.purple} lineWidth={2} opacity={0} />
        <Line ref={dremelLines[1]} points={[[80, 98], [380, 15]]} stroke={T.purple} lineWidth={2} opacity={0} />
      </Node>

      {/* b28：误区 */}
      <Node ref={g28} opacity={0}>
        <Rect ref={biggerCard} position={[0, -100]} width={520} height={100} radius={16} fill={T.card} stroke={T.line} lineWidth={2}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'更大的数据库'} />
        </Rect>
        <Txt ref={mythTag} position={[0, 0]} fontSize={SIZE.label} fill={T.red} fontFamily={FONT.sans} text={'误区：不是变大，是另起一套'} opacity={0} />
        {['独立的', '只读的', '为分析优化'].map((t, i) => (
          <Rect
            key={`true-${i}`}
            ref={trueCards[i]}
            position={[-320 + i * 320, 110]}
            width={240}
            height={64}
            radius={12}
            fill={T.card}
            stroke={T.green}
            lineWidth={2}
            opacity={0}
          >
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={t} />
          </Rect>
        ))}
      </Node>

      {/* b29–b30：星型引出 + 结尾 */}
      <Node ref={g29} opacity={0}>
        <Rect ref={whBody29} position={[0, -60]} width={400} height={140} radius={16} fill={T.card} stroke={T.blue} lineWidth={2}>
          <Txt position={[0, 40]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'数据仓库'} />
        </Rect>
        <Circle ref={whLid29} position={[0, -130]} width={400} height={44} fill={T.bg} stroke={T.blue} lineWidth={2} />
        <Txt ref={star} position={[0, -80]} fontSize={72} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'★'} opacity={0} />
        <Txt ref={nextTag} position={[0, 110]} fontSize={SIZE.body} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'下一单元：星型模式'} opacity={0} />
        {[0, 1, 2].map(i => (
          <Rect
            key={`step-${i}`}
            ref={stepCards[i]}
            position={[-320 + i * 320, -80]}
            width={240}
            height={80}
            radius={14}
            fill={T.card}
            stroke={T.blue}
            lineWidth={2}
            opacity={0}
          >
            <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={['搬家', '变形', '入库'][i]} />
          </Rect>
        ))}
        <Rect ref={whBody30} position={[0, 110]} width={300} height={80} radius={14} fill={T.card} stroke={T.green} lineWidth={3} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'分析的地盘'} />
        </Rect>
        <Circle ref={whLid30} position={[0, 70]} width={300} height={36} fill={T.bg} stroke={T.green} lineWidth={3} opacity={0} />
      </Node>
    </>
  );

  say('为分析优化');
  yield* beat('b19',
    all(g19().opacity(1, 0.5)),
    at('一大优点', whBody19().stroke(T.green, 0.5)),
    at('针对分析访问模式', modeCard().opacity(1, 0.5)),
  );

  say('交易的索引不擅长分析');
  yield* beat('b20',
    all(g19().opacity(0, 0.5), g20().opacity(1, 0.5)),
    at('对交易很有效', txIdx().opacity(1, 0.5)),
    at('不太擅长', all(anIdx().opacity(1, 0.5), anX().opacity(1, 0.4))),
  );

  say('剩下看分析引擎');
  yield* beat('b21',
    all(g20().opacity(0, 0.5), g21().opacity(1, 0.5)),
    at('针对分析优化的存储引擎', routeCard().scale(1.03, 1.5)),
  );

  say('最常见是关系型');
  yield* beat('b22',
    all(g21().opacity(0, 0.5), g22().opacity(1, 0.5)),
    at('关系型', relTable().opacity(1, 0.5)),
    at('SQL', sqlPlate().opacity(1, 0.4)),
  );

  say('下钻、切片、切块');
  yield* beat('b23',
    all(relTable().opacity(0, 0.4), sqlPlate().opacity(0, 0.4), toolCard().opacity(1, 0.5), chartCard().opacity(1, 0.5)),
    at('生成 SQL 查询', qArrow23().opacity(1, 0.4)),
    at('可视化结果', chain(bars[0]().opacity(1, 0.4), bars[1]().opacity(1, 0.4), bars[2]().opacity(1, 0.4))),
    at('下钻', opCards[0]().opacity(1, 0.4)),
    at('切片与切块', all(opCards[1]().opacity(1, 0.4), opCards[2]().opacity(1, 0.4))),
  );

  say('表面都像：SQL 接口');
  yield* beat('b24',
    all(g22().opacity(0, 0.5), g24().opacity(1, 0.5)),
    at('SQL 查询接口', all(plateL().opacity(1, 0.4), plateR().opacity(1, 0.4))),
  );

  say('内部很不一样');
  yield* beat('b25',
    at('很不一样', all(insideL().opacity(1, 0.4), insideR().opacity(1, 0.4))),
    at('只专注一边', forkTag().opacity(1, 0.4)),
  );

  say('同一产品，两个引擎');
  yield* beat('b26',
    all(g24().opacity(0, 0.5), g26().opacity(1, 0.5), prodBox().opacity(1, 0.5)),
    at('SQL Server', prodTag1().opacity(1, 0.4)),
    at('SAP HANA', prodTag2().opacity(1, 0.4)),
    at('两个独立的存储与查询引擎', all(engTx().opacity(1, 0.4), engAn().opacity(1, 0.4))),
    at('共用一个 SQL 接口', commonPlate().opacity(1, 0.4)),
  );

  say('商业许可，价格昂贵');
  yield* beat('b27a',
    all(g26().opacity(0, 0.5), g27().opacity(1, 0.5), vendorCards[0]().opacity(1, 0.3), vendorCards[1]().opacity(1, 0.3), vendorCards[2]().opacity(1, 0.3), vendorCards[3]().opacity(1, 0.3)),
    at('昂贵的许可', priceTag().opacity(1, 0.4)),
    at('SAP HANA', vendorCards[2]().stroke(T.yellow, 0.4)),
    at('单子上', all(vendorCards[0]().stroke(T.green, 0.3), vendorCards[1]().stroke(T.green, 0.3), vendorCards[3]().stroke(T.green, 0.3))),
  );

  say('RedShift 是托管版');
  yield* beat('b27b',
    at('托管版', rsCard().opacity(1, 0.4)),
    at('跑在云上', rsTag().opacity(1, 0.4)),
  );

  say('开源项目后来居上');
  yield* beat('b27c',
    all(vendorCards[0]().opacity(0, 0.4), vendorCards[1]().opacity(0, 0.4), vendorCards[2]().opacity(0, 0.4), vendorCards[3]().opacity(0, 0.4), priceTag().opacity(0, 0.4), rsCard().opacity(0, 0.4), rsTag().opacity(0, 0.4)),
    at('开源项目', chain(ossCards[0]().opacity(1, 0.3), ossCards[1]().opacity(1, 0.3), ossCards[2]().opacity(1, 0.3), ossCards[3]().opacity(1, 0.3), ossCards[4]().opacity(1, 0.3), ossCards[5]().opacity(1, 0.3))),
    at('Hive', ossCards[0]().stroke(T.yellow, 0.4)),
    at('Dremel', all(dremelCard().opacity(1, 0.4), dremelLines[0]().opacity(1, 0.4), dremelLines[1]().opacity(1, 0.4))),
  );

  say('不是更大的数据库');
  yield* beat('b28',
    all(g27().opacity(0, 0.5), g28().opacity(1, 0.5)),
    at('不是一个更大的数据库', all(biggerCard().stroke(T.red, 0.4), mythTag().opacity(1, 0.4))),
    at('独立的', trueCards[0]().opacity(1, 0.4)),
    at('只读的', trueCards[1]().opacity(1, 0.4)),
    at('为分析优化', trueCards[2]().opacity(1, 0.4)),
  );

  say('下一单元：星型模式');
  yield* beat('b29',
    all(g28().opacity(0, 0.5), g29().opacity(1, 0.5)),
    at('怎么摆', star().opacity(1, 0.5)),
    at('星型模式', nextTag().opacity(1, 0.4)),
  );

  say('数据先搬家、再变形、再入库');
  yield* beat('b30',
    all(whBody29().opacity(0, 0.4), whLid29().opacity(0, 0.4), star().opacity(0, 0.4), nextTag().opacity(0, 0.4)),
    at('先搬家', stepCards[0]().opacity(1, 0.4)),
    at('再变形', stepCards[1]().opacity(1, 0.4)),
    at('再入库', all(stepCards[2]().opacity(1, 0.4), whBody30().opacity(1, 0.4), whLid30().opacity(1, 0.4))),
    at('自己的地盘', whBody30().stroke(T.yellow, 0.5)),
  );
});
