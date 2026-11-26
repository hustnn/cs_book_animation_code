// U9 场景 4（MC）r4：i29a–i33 —— 本章剩下看分析引擎、表面同是 SQL、
// 内部不同、同一产品两个引擎、商业与开源厂商、
// 误区（不是更大的数据库；拷过去也不能直接算）、星型模式引出、结尾回扣。
// i29b/i29c 对比帧加缓慢缩放漂移（修 r1 P2-4 的 5.17s/5.42s 静置）。
// r4 改动（B35/C4）：i30b 后加 i30b2 一拍讲为什么能共用接口；
// r5 改动（r4 新手测试）：i29c 旁白解释列式扫描/按键索引 + 各加小注；i30b2 收口（走哪个引擎由产品内部决定）；i30e 加 Dremel 说明小注、删 Presto/Drill 连线。
// r6 改动（r5 新手测试）：i30b2 画查询进来、由产品内部挑引擎的动作（查询卡落到产品顶边，再由内部叉路挑一个引擎，本拍挑分析引擎演示，不画挑法）；i30e Dremel 牌向上画一根虚线托住六张开源牌整体（横杠 +“借鉴思路”小标），不连具体哪一张、不点名（3.8-12 只说“其中一些”）。
// r8 改动（r7 新手测试 P2-6）：i30b2 产品框顶边标为接口——念到“先到接口”时顶边变黄 + 右上出“SQL 接口”标签（查询卡落点与叉路起点之间正是这条顶边；只画接口在哪，不碰内部挑法）。
// 帧级审查修复 F4：Dremel 小注与“后来居上”标签挤在一起，两处各移开。
// i30c 念出四家厂商名（逐家亮起），i30d 念出 ParAccel 与 RedShift。
// 分镜：skill-ch03/beats-u9.md；原文：DDIA §3.8（书页 p92–93，PDF p114–115）。
// 时长全部来自 timeline/u9.json（beat() 驱动），不手写 waitFor。
import {Circle, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, chain, createRef} from '@motion-canvas/core';
import {at, makeBeats} from '../../lib/beats';
import {Counter, tag} from '../../lib/schemas';
import {FONT, SAFE, SIZE, T} from '../../lib/theme';
import timeline from '../../timeline/u9.json';

const OSS = ['Hive', 'Spark SQL', 'Impala', 'Presto', 'Tajo', 'Drill'];

export default makeScene2D(function* (view) {
  view.fill(T.bg);
  const beat = makeBeats(timeline);

  const header = createRef<Txt>();
  const anchor = createRef<Txt>();
  const say = (text: string) => anchor().text(text);

  // ---- i29a：路线牌 ----
  const g21 = createRef<Node>();
  const routeCard = createRef<Rect>();

  // ---- i29b–i29c：表面像、内部不同 ----
  const g24 = createRef<Node>();
  const whBox = createRef<Rect>();
  const txBox = createRef<Rect>();
  const plateL = createRef<Txt>();
  const plateR = createRef<Txt>();
  const insideL = createRef<Txt>();
  const insideR = createRef<Txt>();
  const scanNote = createRef<Txt>();
  const idxNote = createRef<Txt>();
  const forkTag = createRef<Txt>();

  // ---- i30a–i30b：同一产品，两个引擎 ----
  const g26 = createRef<Node>();
  const prodBox = createRef<Rect>();
  const prodTag1 = createRef<Txt>();
  const prodTag2 = createRef<Txt>();
  const engTx = createRef<Rect>();
  const engAn = createRef<Rect>();
  const commonPlate = createRef<Txt>();
  const qCard = createRef<Rect>();
  const forkTx = createRef<Line>();
  const forkAn = createRef<Line>();
  const pickTag = createRef<Txt>();
  const ifaceEdge = createRef<Line>();
  const ifaceTag = createRef<Txt>();

  // ---- i30c–i30e：厂商 ----
  const g27 = createRef<Node>();
  const vendorCards = [0, 1, 2, 3].map(() => createRef<Rect>());
  const priceTag = createRef<Txt>();
  const rsCard = createRef<Rect>();
  const rsTag = createRef<Txt>();
  const ossCards = OSS.map(() => createRef<Rect>());
  const dremelCard = createRef<Rect>();
  const dremelNote = createRef<Txt>();
  const busH = createRef<Line>();
  const busV = createRef<Line>();
  const borrowTag = createRef<Txt>();
  const laterTag = tag([0, 214], '后来居上', [0, 0]);
  const ossCount = new Counter([0, 245], '开源项目 ', ' 个');

  // ---- i31：误区 ----
  const g28 = createRef<Node>();
  const biggerCard = createRef<Rect>();
  const mythTag = createRef<Txt>();
  const rawCard = createRef<Rect>();
  const trueCards = [0, 1, 2].map(() => createRef<Rect>());

  // ---- i32–i33：星型引出 + 结尾 ----
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

      {/* i29a：路线牌 */}
      <Node ref={g21} opacity={0}>
        <Rect ref={routeCard} position={[0, -80]} width={760} height={100} radius={16} fill={T.card} stroke={T.blue} lineWidth={2}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'下一站：针对分析优化的存储引擎'} />
        </Rect>
      </Node>

      {/* i29b–i29c：表面像、内部不同 */}
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
        <Txt ref={scanNote} position={[-300, 70]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'一次扫一整列，算聚合'} opacity={0} />
        <Txt ref={idxNote} position={[300, 70]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'按一个键，取少量记录'} opacity={0} />
        <Txt ref={forkTag} position={[0, 120]} fontSize={SIZE.label} fill={T.red} fontFamily={FONT.sans} text={'各专注一边'} opacity={0} />
      </Node>

      {/* i30a–i30b：同一产品，两个引擎 */}
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
        {/* r6：查询卡从上方落到产品顶边，内部叉路挑一个引擎（只画“内部挑一个”，不画挑法）。
            叉路从查询卡正下方直接分开（汇合点在“同一产品”标签上方 4px 会穿过标签顶角，改到卡底 -160 处分开） */}
        <Rect ref={qCard} position={[0, -260]} width={260} height={64} radius={12} fill={T.card} stroke={T.yellow} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'一个查询'} />
        </Rect>
        <Line ref={forkTx} points={[[0, -160], [-190, -80]]} stroke={T.line} lineWidth={3} endArrow opacity={0} />
        <Line ref={forkAn} points={[[0, -160], [190, -80]]} stroke={T.line} lineWidth={3} endArrow opacity={0} />
        <Txt ref={pickTag} position={[0, -98]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'内部挑'} opacity={0} />
        {/* r8：产品框顶边就是接口——顶边（prodBox 顶 y=-155）变黄，标签贴在顶边右上（x 264..356，离查询卡、厂商名各 20px 以上；叉路穿过黄边，正合“先到接口再进内部”） */}
        <Line ref={ifaceEdge} points={[[-380, -155], [380, -155]]} stroke={T.yellow} lineWidth={4} opacity={0} />
        <Txt ref={ifaceTag} position={[310, -172]} fontSize={SIZE.label} fontWeight={700} fill={T.yellow} fontFamily={FONT.mono} text={'SQL 接口'} opacity={0} />
      </Node>

      {/* i30c–i30e：厂商 */}
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
        <Txt ref={dremelNote} position={[0, 181]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'谷歌的一个查询思路'} opacity={0} />
        {/* r6：Dremel 牌向上画虚线托住六张开源牌整体（不连具体哪一张、不点名） */}
        <Line ref={busH} points={[[-500, 55], [500, 55]]} stroke={T.purple} lineWidth={2} lineDash={[6, 6]} opacity={0} />
        <Line ref={busV} points={[[0, 55], [0, 95]]} stroke={T.purple} lineWidth={2} lineDash={[6, 6]} opacity={0} />
        <Txt ref={borrowTag} position={[110, 75]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'借鉴思路'} opacity={0} />
        {laterTag}
      </Node>
      {ossCount.node}

      {/* i31：误区 */}
      <Node ref={g28} opacity={0}>
        <Rect ref={biggerCard} position={[0, -100]} width={520} height={100} radius={16} fill={T.card} stroke={T.line} lineWidth={2}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'更大的数据库'} />
        </Rect>
        <Txt ref={mythTag} position={[0, 0]} fontSize={SIZE.label} fill={T.red} fontFamily={FONT.sans} text={'误区：不是变大，是另起一套'} opacity={0} />
        <Rect ref={rawCard} position={[0, 50]} width={520} height={56} radius={12} fill={T.card} stroke={T.line} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'数据拷过去也不能直接算'} />
        </Rect>
        {['独立的', '只读的', '为分析优化'].map((t, i) => (
          <Rect
            key={`true-${i}`}
            ref={trueCards[i]}
            position={[-320 + i * 320, 140]}
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

      {/* i32–i33：星型引出 + 结尾 */}
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

  say('剩下看分析引擎');
  yield* beat('i29a',
    all(g21().opacity(1, 0.5)),
    at('针对分析优化的存储引擎', routeCard().scale(1.03, 1.5)),
  );

  say('表面都像：SQL 接口');
  yield* beat('i29b',
    all(g21().opacity(0, 0.5), g24().opacity(1, 0.5), g24().scale(1.02, beat.dur('i29b'))),
    at('SQL 查询接口', all(plateL().opacity(1, 0.4), plateR().opacity(1, 0.4))),
  );

  say('内部很不一样');
  yield* beat('i29c',
    g24().scale(1.0, beat.dur('i29c')),
    at('很不一样', all(insideL().opacity(1, 0.4), insideR().opacity(1, 0.4))),
    at('列式扫描', scanNote().opacity(1, 0.4)),
    at('按键索引', idxNote().opacity(1, 0.4)),
    at('只专注一边', forkTag().opacity(1, 0.4)),
  );

  say('同一产品');
  yield* beat('i30a',
    all(g24().opacity(0, 0.5), g26().opacity(1, 0.5), prodBox().opacity(1, 0.5)),
    at('SQL Server', prodTag1().opacity(1, 0.4)),
    at('SAP HANA', prodTag2().opacity(1, 0.4)),
  );

  say('两个引擎，一个接口');
  yield* beat('i30b',
    at('两个独立的存储与查询引擎', all(engTx().opacity(1, 0.4), engAn().opacity(1, 0.4))),
    at('共用一个查询接口', commonPlate().opacity(1, 0.4)),
  );

  say('各归各管，接口只管问');
  yield* beat('i30b2',
    at('各归各管', chain(engTx().stroke(T.yellow, 0.3), engAn().stroke(T.yellow, 0.3))),
    at('只管怎么问', commonPlate().scale(1.15, 0.5)),
    at('一个查询进来', chain(qCard().opacity(1, 0.3), qCard().position([0, -195], 0.8))),
    // r8 P2-6：接口有了对应的块——就是产品框这条变黄的顶边（查询卡落点与叉路起点之间）
    at('先到接口', all(ifaceEdge().opacity(1, 0.4), ifaceTag().opacity(1, 0.4))),
    at('由产品内部挑', all(forkTx().opacity(1, 0.4), forkAn().opacity(1, 0.4), forkAn().stroke(T.green, 0.4), engAn().stroke(T.green, 0.3), engTx().stroke(T.blue, 0.3), pickTag().opacity(1, 0.4))),
    at('不用接口操心', chain(engAn().scale(1.03, 0.4), engAn().scale(1, 0.4))),
  );

  say('商业许可，价格昂贵');
  yield* beat('i30c',
    all(g26().opacity(0, 0.5), g27().opacity(1, 0.5), vendorCards[0]().opacity(1, 0.3), vendorCards[1]().opacity(1, 0.3), vendorCards[2]().opacity(1, 0.3), vendorCards[3]().opacity(1, 0.3)),
    at('昂贵的许可', priceTag().opacity(1, 0.4)),
    at('Teradata', vendorCards[0]().stroke(T.yellow, 0.4)),
    at('Vertica', vendorCards[1]().stroke(T.yellow, 0.4)),
    at('SAP HANA', vendorCards[2]().stroke(T.yellow, 0.4)),
    at('ParAccel', vendorCards[3]().stroke(T.yellow, 0.4)),
    at('单子上', all(vendorCards[0]().stroke(T.green, 0.3), vendorCards[1]().stroke(T.green, 0.3), vendorCards[2]().stroke(T.green, 0.3), vendorCards[3]().stroke(T.green, 0.3))),
  );

  say('RedShift 是托管版');
  yield* beat('i30d',
    at('ParAccel', vendorCards[3]().stroke(T.yellow, 0.4)),
    at('托管版', rsCard().opacity(1, 0.4)),
    at('RedShift', rsCard().stroke(T.yellow, 0.4)),
    at('跑在云上', rsTag().opacity(1, 0.4)),
  );

  say('开源项目后来居上');
  yield* beat('i30e',
    all(vendorCards[0]().opacity(0, 0.4), vendorCards[1]().opacity(0, 0.4), vendorCards[2]().opacity(0, 0.4), vendorCards[3]().opacity(0, 0.4), priceTag().opacity(0, 0.4), rsCard().opacity(0, 0.4), rsTag().opacity(0, 0.4), ossCount.node.opacity(1, 0.3)),
    at('开源项目', chain(
      all(ossCards[0]().opacity(1, 0.3), ossCount.bump()),
      all(ossCards[1]().opacity(1, 0.3), ossCount.bump()),
      all(ossCards[2]().opacity(1, 0.3), ossCount.bump()),
      all(ossCards[3]().opacity(1, 0.3), ossCount.bump()),
      all(ossCards[4]().opacity(1, 0.3), ossCount.bump()),
      all(ossCards[5]().opacity(1, 0.3), ossCount.bump()),
    )),
    at('Hive', ossCards[0]().stroke(T.yellow, 0.4)),
    at('Dremel', dremelCard().opacity(1, 0.4)),
    at('借鉴了', all(busH().opacity(1, 0.4), busV().opacity(1, 0.4), borrowTag().opacity(1, 0.4))),
    at('谷歌的一个查询思路', dremelNote().opacity(1, 0.4)),
    at('一争高下', laterTag.opacity(1, 0.4)),
  );

  say('不是更大的数据库');
  yield* beat('i31',
    all(g27().opacity(0, 0.5), ossCount.node.opacity(0, 0.3), g28().opacity(1, 0.5)),
    at('不是一个更大的数据库', all(biggerCard().stroke(T.red, 0.4), mythTag().opacity(1, 0.4), trueCards[0]().opacity(1, 0.4))),
    at('不能直接算', all(rawCard().opacity(1, 0.4), rawCard().stroke(T.red, 0.4), trueCards[1]().opacity(1, 0.4))),
    at('分析没法做', trueCards[2]().opacity(1, 0.4)),
  );

  say('下一单元：星型模式');
  yield* beat('i32',
    all(g28().opacity(0, 0.5), g29().opacity(1, 0.5)),
    at('怎么摆', star().opacity(1, 0.5)),
    at('星型模式', nextTag().opacity(1, 0.4)),
  );

  say('数据先搬家、再变形、再入库');
  yield* beat('i33',
    all(whBody29().opacity(0, 0.4), whLid29().opacity(0, 0.4), star().opacity(0, 0.4), nextTag().opacity(0, 0.4)),
    at('先搬家', stepCards[0]().opacity(1, 0.4)),
    at('再变形', stepCards[1]().opacity(1, 0.4)),
    at('再入库', all(stepCards[2]().opacity(1, 0.4), whBody30().opacity(1, 0.4), whLid30().opacity(1, 0.4))),
    at('自己的地盘', whBody30().stroke(T.yellow, 0.5)),
  );
});
