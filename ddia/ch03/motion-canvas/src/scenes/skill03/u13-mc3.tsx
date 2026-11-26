// U13 场景 3（MC）r10：m14–m21 —— 同一份数据多几种排法（C-Store / Vertica）、复制防丢、
// r10（判定 #41）：P1-1 m15 小字改“提出主意的 C-Store，照做的 Vertica”（r9 的“提出这个主意的两个名字”把 Vertica 也写成提出者，与旁白矛盾；
// 措辞已对旁白核对：旁白“这个主意最早来自 C-Store，商业数据仓库 Vertica 就这么干”——提出者是 C-Store，Vertica 是照做的）；
// P2-3 m17 撤 m16 残留“数据还在另外一台上”，右份“这次不用”改待命处理（不 dim、不变灰）；
// P2-4 m19 两贴片间加“或者”，画出第三份副本（先按产品、再按日期排的迷你表）；
// P2-9 m20 两张二级索引卡片，各一支箭头。
// r9（判定 #38）：P2-4 m15 两块牌子上方加小标签（选 (b)，牌子不改上下叠放）；
// P2-5 m16 旁白“同款副本”→“同样的数据”；P2-6 m19 旁白“再存一份先按产品、再按日期排的副本”（演示措辞），copyChip 文案同步。
// r7（判定 #35）：P2-4 m15 两块牌子并排居中，不再各贴一份副本下；P2-5 m17 加小字“刚才那台只是假设坏了，平时两份都在”；
// P2-6 m19 切到产品查询时把按日期那份的黄框淡出。
// 走查：查上个月用日期那份、查某产品用产品那份；与多个二级索引的对比：行存有指针，列存只有含值的列。
// 分镜：skill-ch03/beats-u13.md；原文：DDIA §3.12（书页 p100–101，PDF p122–123）。
// 机器框里各有一行该副本排法下的首行数据（空框测试：框里是具体数据，不是只有类别名）。
// r5：两份迷你表补 quantity 列（三列都在）并改成 6 行（与 mc1/mc2 同一张表）；机器统一成两份
// （与 m14/m18 一致）；m17 红叉改成“这次不用”灰标（红叉只留给 m16“机器坏了”的示意）；
// m18/m19 点名具体值（上个月就是 140101 这三行、比如产品 32）；m19 开头把 m18 的绿箭头淡出（r4 P2-3）。
// 时长全部来自 timeline/u13.json（beat() 驱动），不手写 waitFor。
import {Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, chain, createRef} from '@motion-canvas/core';
import {at, makeBeats} from '../../lib/beats';
import {KV} from '../../lib/schemas';
import {FONT, SAFE, SIZE, T} from '../../lib/theme';
import timeline from '../../timeline/u13.json';

export default makeScene2D(function* (view) {
  view.fill(T.bg);
  const beat = makeBeats(timeline);

  const header = createRef<Txt>();
  const anchor = createRef<Txt>();
  const say = (text: string) => anchor().text(text);

  const dataChip = createRef<Node>();
  const tabA = createRef<Node>();
  const tabB = createRef<Node>();
  const tabAHead = createRef<Rect>();
  const tabBHead = createRef<Rect>();
  const tabACells = [0, 1, 2, 3, 4, 5].map(() => [0, 1, 2].map(() => createRef<Rect>()));
  const tabBCells = [0, 1, 2, 3, 4, 5].map(() => [0, 1, 2].map(() => createRef<Rect>()));
  const plateA = createRef<Node>();
  const plateB = createRef<Node>();
  // r10 P1-1：小标签区分提出者与照做者——C-Store 提出，Vertica 照做（已对旁白核对）
  const platesLab = createRef<Txt>();
  const qChipA = createRef<Node>();
  const qArrowA = createRef<Line>();
  const qChipB = createRef<Node>();
  const qArrowB = createRef<Line>();
  const twoDimChip = createRef<Node>();
  // m19 后半：或者再存一份按两维排的副本（两维都要贴片下方出现）
  const copyChip = createRef<Node>();
  // r10 P2-4：两贴片之间的“或者”标记 + 第三份副本（先按产品、再按日期排的迷你表，画在两份表中间空档）
  const orChip = createRef<Node>();
  const tabC = createRef<Node>();

  const machines = createRef<Node>();
  const machBoxes = [0, 1].map(() => createRef<Rect>());
  const machX = createRef<Txt>();
  const machStill = createRef<Txt>();
  // r6 F3：明确 ✗ 是“这台坏了”（不是“这次不用”）
  const brokenTag = createRef<Txt>();
  const sortLabs = [0, 1].map(() => createRef<Txt>());
  const queryArrow = createRef<Line>();
  const bestTag = createRef<Txt>();
  // m17：这次不选的中性标记——待命（蓝字小标，机器本身不变暗、不变灰，与“坏了”的红叉 + 变红明确区分）
  const skipTag = createRef<Txt>();
  // r7 P2-5：坏掉的机器悄悄好了——m17 开头交代“刚才那台只是假设坏了，平时两份都在”
  const hypoTag = createRef<Txt>();

  const compare = createRef<Node>();
  const rowCard = createRef<Rect>();
  const colCard = createRef<Rect>();
  const diffTag = createRef<Txt>();
  const rowChip = createRef<Node>();
  // r10 P2-9：两张二级索引卡片（“多个”画出来），各一支箭头指向上面的整行
  const idxChip1 = createRef<Node>();
  const idxChip2 = createRef<Node>();
  const ptr1 = createRef<Line>();
  const ptr2 = createRef<Line>();
  const colStrips = [0, 1, 2].map(() => createRef<Rect>());
  const noPtr = createRef<Txt>();
  // m21b/m21c：位置就是行号——三条列条带上的第 k 个位置横向亮起一条带
  const posBand = createRef<Rect>();
  const posKLab = createRef<Txt>();
  const posChip = createRef<Node>();

  // A 表：按日期排（日期，产品，数量）；B 表：按产品排（产品，日期，数量）；均为 6 行，与 mc1/mc2 同一张表
  const rowsA = [
    ['140101', '32', '7'],
    ['140101', '32', '4'],
    ['140101', '69', '3'],
    ['140102', '32', '5'],
    ['140102', '32', '9'],
    ['140102', '33', '2'],
  ];
  const rowsB = [
    ['32', '140101', '7'],
    ['32', '140101', '4'],
    ['32', '140102', '5'],
    ['32', '140102', '9'],
    ['33', '140102', '2'],
    ['69', '140101', '3'],
  ];

  view.add(
    <>
      <Txt
        ref={header}
        position={[-SAFE.halfW, -SAFE.halfH]}
        offset={[-1, -1]}
        fontSize={SIZE.label}
        fill={T.muted}
        fontFamily={FONT.sans}
        text={'排序与写入：列存的两难'}
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

      {/* 同一份数据，两种排法 */}
      <Node ref={dataChip} position={[0, -265]} opacity={0}>
        <Rect width={380} height={64} radius={12} fill={T.card} stroke={T.blue} lineWidth={2}>
          <Txt fontSize={SIZE.label} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'同一份数据'} />
        </Rect>
      </Node>
      <Node ref={tabA} position={[-300, -60]} opacity={0}>
        <Rect ref={tabAHead} position={[0, -148]} width={340} height={40} radius={10} fill={T.card} stroke={T.blue} lineWidth={2}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'按日期排'} />
        </Rect>
        {['date_key', 'product_sk', 'quantity'].map((h, j) => (
          <Txt key={`ah-${j}`} position={[-115 + j * 115, -112]} fontSize={15} fill={T.muted} fontFamily={FONT.mono} text={h} />
        ))}
        {rowsA.map((row, i) => (
          <Node key={`a-${i}`} position={[0, -78 + i * 38]}>
            {row.map((v, j) => (
              <Rect key={`ac-${i}-${j}`} ref={tabACells[i][j]} position={[-115 + j * 115, 0]} width={105} height={34} radius={8} fill={T.card} stroke={T.line} lineWidth={2}>
                <Txt fontSize={19} fill={T.text} fontFamily={FONT.mono} text={v} />
              </Rect>
            ))}
          </Node>
        ))}
      </Node>
      <Node ref={tabB} position={[300, -60]} opacity={0}>
        <Rect ref={tabBHead} position={[0, -148]} width={340} height={40} radius={10} fill={T.card} stroke={T.purple} lineWidth={2}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'按产品排'} />
        </Rect>
        {['product_sk', 'date_key', 'quantity'].map((h, j) => (
          <Txt key={`bh-${j}`} position={[-115 + j * 115, -112]} fontSize={15} fill={T.muted} fontFamily={FONT.mono} text={h} />
        ))}
        {rowsB.map((row, i) => (
          <Node key={`b-${i}`} position={[0, -78 + i * 38]}>
            {row.map((v, j) => (
              <Rect key={`bc-${i}-${j}`} ref={tabBCells[i][j]} position={[-115 + j * 115, 0]} width={105} height={34} radius={8} fill={T.card} stroke={T.line} lineWidth={2}>
                <Txt fontSize={19} fill={T.text} fontFamily={FONT.mono} text={v} />
              </Rect>
            ))}
          </Node>
        ))}
      </Node>
      {/* r7 P2-4：两块牌子并排放在两份副本中间（不再各贴一份副本下，免得读成各对一种排法） */}
      <Node ref={plateA} position={[-140, 150]} opacity={0}>
        <Rect width={260} height={56} radius={12} fill={T.card} stroke={T.purple} lineWidth={2}>
          <Txt fontSize={SIZE.label} fontWeight={700} fill={T.purple} fontFamily={FONT.mono} text={'C-Store'} />
        </Rect>
      </Node>
      <Node ref={plateB} position={[140, 150]} opacity={0}>
        <Rect width={260} height={56} radius={12} fill={T.card} stroke={T.purple} lineWidth={2}>
          <Txt fontSize={SIZE.label} fontWeight={700} fill={T.purple} fontFamily={FONT.mono} text={'Vertica'} />
        </Rect>
      </Node>
      {/* r10 P1-1：两块牌子上方的小标签——区分提出者（C-Store）与照做者（Vertica），与旁白一致 */}
      <Txt ref={platesLab} position={[0, 105]} fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.sans} text={'提出主意的 C-Store，照做的 Vertica'} opacity={0} />
      <Node ref={qChipA} position={[-300, 140]} opacity={0}>
        <Rect width={300} height={56} radius={12} fill={T.card} stroke={T.blue} lineWidth={2}>
          <Txt fontSize={SIZE.label} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'查上个月'} />
        </Rect>
      </Node>
      <Line ref={qArrowA} points={[[-300, 108], [-300, 88]]} stroke={T.green} lineWidth={3} endArrow opacity={0} />
      <Node ref={qChipB} position={[300, 140]} opacity={0}>
        <Rect width={300} height={56} radius={12} fill={T.card} stroke={T.purple} lineWidth={2}>
          <Txt fontSize={SIZE.label} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'查某产品全年'} />
        </Rect>
      </Node>
      <Line ref={qArrowB} points={[[300, 108], [300, 88]]} stroke={T.green} lineWidth={3} endArrow opacity={0} />
      {/* m19：两维都要——先用其中一份，另一维再筛（qChipB 淡出后居中出现） */}
      <Node ref={twoDimChip} position={[0, 120]} opacity={0}>
        <Rect width={560} height={56} radius={12} fill={T.card} stroke={T.yellow} lineWidth={2}>
          <Txt fontSize={SIZE.label} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'两维都要：先用一份，另一维再筛'} />
        </Rect>
      </Node>
      {/* r10 P2-4：两贴片之间的“或者”——第一种办法（先用一份再筛）与第二种办法（再存一份）二选一，不是先后步骤 */}
      <Node ref={orChip} position={[0, 170]} opacity={0}>
        <Rect width={110} height={36} radius={10} fill={T.card} stroke={T.yellow} lineWidth={2}>
          <Txt fontSize={20} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'或者'} />
        </Rect>
      </Node>
      {/* m19 后半：或者再存一份先按产品、再按日期排的副本（r9 P2-6：点明新副本的维顺序，演示措辞） */}
      <Node ref={copyChip} position={[0, 218]} opacity={0}>
        <Rect width={440} height={56} radius={12} fill={T.card} stroke={T.yellow} lineWidth={2}>
          <Txt fontSize={SIZE.label} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'再存一份：先按产品，再按日期'} />
        </Rect>
      </Node>
      {/* r10 P2-4：第三份副本——先按产品、再按日期排的迷你表（与按产品排那份同样的行顺序，是另外单独一份；演示措辞） */}
      <Node ref={tabC} position={[0, -60]} opacity={0}>
        <Txt position={[0, -125]} fontSize={18} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'第三份：先按产品，再按日期'} />
        {['产品', '日期', '数量'].map((h, j) => (
          <Txt key={`ch-${j}`} position={[-70 + j * 70, -92]} fontSize={15} fill={T.muted} fontFamily={FONT.sans} text={h} />
        ))}
        {[
          ['32', '140101', '7'],
          ['32', '140101', '4'],
          ['32', '140102', '5'],
          ['32', '140102', '9'],
          ['33', '140102', '2'],
          ['69', '140101', '3'],
        ].map((row, i) => (
          <Node key={`c-${i}`} position={[0, -62 + i * 30]}>
            {row.map((v, j) => (
              <Rect key={`cc-${i}-${j}`} position={[-70 + j * 70, 0]} width={62} height={26} radius={6} fill={T.card} stroke={T.line} lineWidth={2}>
                <Txt fontSize={15} fill={T.text} fontFamily={FONT.mono} text={v} />
              </Rect>
            ))}
          </Node>
        ))}
      </Node>

      {/* 两台机器：复制防丢（与 m14/m18 的两份副本一致） */}
      <Node ref={machines} opacity={0}>
        {[0, 1].map(i => (
          <Rect
            key={`m-${i}`}
            ref={machBoxes[i]}
            position={[-300 + i * 600, -60]}
            width={300}
            height={220}
            radius={16}
            fill={T.card}
            stroke={T.blue}
            lineWidth={2}
          >
            <Txt position={[0, -70]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'数据副本'} />
            {i === 1 && <Txt ref={machX} position={[110, -75]} fontSize={48} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'✗'} opacity={0} />}
          </Rect>
        ))}
        <Txt ref={machStill} position={[0, 130]} fontSize={SIZE.label} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'数据还在另外一台上'} opacity={0} />
        <Txt ref={brokenTag} position={[300, -210]} fontSize={SIZE.label} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'这台坏了'} opacity={0} />
        {[0, 1].map(i => (
          <Txt key={`sl-${i}`} ref={sortLabs[i]} position={[-300 + i * 600, 10]} fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.sans} text={['按日期排', '按产品排'][i]} opacity={0} />
        ))}
        <Line ref={queryArrow} points={[[0, 230], [-300, 70]]} stroke={T.green} lineWidth={3} endArrow opacity={0} />
        <Txt ref={bestTag} position={[-300, -210]} fontSize={SIZE.label} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'最适合'} opacity={0} />
        <Txt ref={skipTag} position={[300, 75]} fontSize={SIZE.label} fill={T.blue} fontFamily={FONT.sans} text={'这次不用 · 待命'} opacity={0} />
        <Txt ref={hypoTag} position={[0, -260]} fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.sans} text={'刚才那台只是假设坏了，平时两份都在'} opacity={0} />
      </Node>

      {/* 行存 vs 列存 */}
      <Node ref={compare} opacity={0}>
        <Rect ref={rowCard} position={[-300, -60]} width={440} height={300} radius={16} fill={T.card} stroke={T.blue} lineWidth={2}>
          <Txt position={[0, -135]} fontSize={SIZE.label} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'行式存储'} />
        </Rect>
        <Rect ref={colCard} position={[300, -60]} width={440} height={300} radius={16} fill={T.card} stroke={T.purple} lineWidth={2}>
          <Txt position={[0, -135]} fontSize={SIZE.label} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'列式存储'} />
        </Rect>
        <Txt ref={diffTag} position={[0, -240]} fontSize={SIZE.body} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'大区别'} opacity={0} />
        <Node ref={rowChip} position={[-300, -40]} opacity={0}>
          <Rect width={340} height={56} radius={10} fill={T.bg} stroke={T.green} lineWidth={2}>
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'一行完整数据'} />
          </Rect>
        </Node>
        <Node ref={idxChip1} position={[-390, 60]} opacity={0}>
          <Rect width={160} height={56} radius={10} fill={T.bg} stroke={T.blue} lineWidth={2}>
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'二级索引 1'} />
          </Rect>
        </Node>
        <Node ref={idxChip2} position={[-210, 60]} opacity={0}>
          <Rect width={160} height={56} radius={10} fill={T.bg} stroke={T.blue} lineWidth={2}>
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'二级索引 2'} />
          </Rect>
        </Node>
        <Line ref={ptr1} points={[[-390, 32], [-390, -12]]} stroke={T.blue} lineWidth={3} endArrow opacity={0} />
        <Line ref={ptr2} points={[[-210, 32], [-210, -12]]} stroke={T.blue} lineWidth={3} endArrow opacity={0} />
        {[0, 1, 2].map(i => (
          <Rect key={`cs-${i}`} ref={colStrips[i]} position={[220 + i * 80, -10]} width={56} height={180} radius={8} fill={[T.blue, T.purple, T.green][i]} opacity={0} />
        ))}
        <Txt ref={noPtr} position={[300, 130]} fontSize={SIZE.label} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'没有指针 ✗'} opacity={0} />
        {/* m21b：三条列上的第 k 个位置横向亮起一条带（半透明黄带 + k 标） */}
        <Rect ref={posBand} position={[300, -10]} width={280} height={44} radius={8} fill={T.yellow} opacity={0} />
        <Txt ref={posKLab} position={[140, -10]} fontSize={SIZE.body} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'k'} opacity={0} />
      </Node>
      <Node ref={posChip} position={[0, 150]} opacity={0}>
        <Rect width={480} height={56} radius={12} fill={T.card} stroke={T.yellow} lineWidth={2}>
          <Txt fontSize={SIZE.label} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'位置就是行号：第 k 项 = 第 k 行'} />
        </Rect>
      </Node>
    </>
  );

  // 每台机器框里挂一个有身份的数据块：该副本排法下的首行（空框测试）
  const machKVs = ['140101 · 32 · 7', '32 · 140101 · 7'].map(v => new KV(v, '', 'key', {w: 200}));
  machKVs.forEach((kv, i) => {
    kv.node.position([0, -20]).opacity(1);
    machBoxes[i]().add(kv.node);
  });

  say('同一份数据，几种排法');
  yield* beat('m14',
    all(dataChip().opacity(1, 0.5)),
    at('同一份数据', dataChip().scale(1.05, 0.6)),
    at('按几种方式排着存', all(tabA().opacity(1, 0.5), tabB().opacity(1, 0.5))),
  );

  say('C-Store / Vertica');
  yield* beat('m15',
    at('C-Store', all(plateA().opacity(1, 0.5), platesLab().opacity(1, 0.5))),
    at('Vertica', plateB().opacity(1, 0.5)),
  );

  say('复制防丢');
  yield* beat('m16',
    all(dataChip().opacity(0, 0.4), tabA().opacity(0, 0.4), tabB().opacity(0, 0.4), plateA().opacity(0, 0.4), plateB().opacity(0, 0.4), platesLab().opacity(0, 0.4)),
    at('复制到多台机器上', machines().opacity(1, 0.5)),
    at('坏了丢数据', all(machBoxes[1]().stroke(T.red, 0.4), machX().opacity(1, 0.4), machStill().opacity(1, 0.4), brokenTag().opacity(1, 0.4))),
    at('排法各不相同', all(sortLabs[0]().opacity(1, 0.4), sortLabs[1]().opacity(1, 0.4))),
  );

  say('查询用最适合的版本');
  yield* beat('m17',
    // r10 P2-3：m17 开头撤掉 m16 的残留——“数据还在另外一台上”标签随“这台坏了”一起收掉，不留在终帧
    all(machX().opacity(0, 0.4), brokenTag().opacity(0, 0.4), machStill().opacity(0, 0.4), hypoTag().opacity(1, 0.4)),
    at('按不同方式排', chain(sortLabs[0]().opacity(1, 0.4), sortLabs[1]().opacity(1, 0.4))),
    at('最适合的那个版本', all(queryArrow().opacity(1, 0.5), bestTag().opacity(1, 0.4), machBoxes[0]().stroke(T.green, 0.4))),
    // r10 P2-3：右份“这次不用”不再变灰——机器描边回正常蓝色、框里数据保持全亮，只用蓝字“待命”标区别于“坏了”
    at('产品那份这次不用', all(machBoxes[1]().stroke(T.blue, 0.4), skipTag().opacity(1, 0.5))),
  );

  say('查上个月，用日期那份');
  yield* beat('m18',
    all(machines().opacity(0, 0.5), tabA().opacity(1, 0.5), tabB().opacity(1, 0.5), dataChip().opacity(1, 0.5)),
    at('查上个月的销售', qChipA().opacity(1, 0.5)),
    at('按日期排的那份', all(qArrowA().opacity(1, 0.5), tabAHead().stroke(T.yellow, 0.4))),
    at('上个月就是 140101 这三行', chain(
      tabACells[0][0]().stroke(T.yellow, 0.4), tabACells[0][1]().stroke(T.yellow, 0.4), tabACells[0][2]().stroke(T.yellow, 0.4),
      tabACells[1][0]().stroke(T.yellow, 0.4), tabACells[1][1]().stroke(T.yellow, 0.4), tabACells[1][2]().stroke(T.yellow, 0.4),
      tabACells[2][0]().stroke(T.yellow, 0.4), tabACells[2][1]().stroke(T.yellow, 0.4), tabACells[2][2]().stroke(T.yellow, 0.4),
    )),
    at('一扫就到', chain(qChipA().scale(1.05, 0.5), qChipA().scale(1, 0.4))),
  );

  say('查某产品，用产品那份');
  yield* beat('m19',
    at('就轮到刚才没选的那份', chain(tabB().scale(1.04, 0.5), tabB().scale(1, 0.4))),
    at('查某产品全年的销售', all(qChipA().opacity(0, 0.4), qArrowA().opacity(0, 0.4), qChipB().opacity(1, 0.5),
      // r7 P2-6：切到新查询时把上一份（按日期排）的黄框淡出，终帧只亮本次查询用的那份
      tabACells[0][0]().stroke(T.line, 0.4), tabACells[0][1]().stroke(T.line, 0.4), tabACells[0][2]().stroke(T.line, 0.4),
      tabACells[1][0]().stroke(T.line, 0.4), tabACells[1][1]().stroke(T.line, 0.4), tabACells[1][2]().stroke(T.line, 0.4),
      tabACells[2][0]().stroke(T.line, 0.4), tabACells[2][1]().stroke(T.line, 0.4), tabACells[2][2]().stroke(T.line, 0.4),
      tabAHead().stroke(T.blue, 0.4))),
    at('按产品排的那份', all(qArrowB().opacity(1, 0.5), tabBHead().stroke(T.yellow, 0.4))),
    at('同一产品的行聚在一起', chain(
      tabBCells[0][0]().stroke(T.yellow, 0.4), tabBCells[0][1]().stroke(T.yellow, 0.4), tabBCells[0][2]().stroke(T.yellow, 0.4),
      tabBCells[1][0]().stroke(T.yellow, 0.4), tabBCells[1][1]().stroke(T.yellow, 0.4), tabBCells[1][2]().stroke(T.yellow, 0.4),
      tabBCells[2][0]().stroke(T.yellow, 0.4), tabBCells[2][1]().stroke(T.yellow, 0.4), tabBCells[2][2]().stroke(T.yellow, 0.4),
      tabBCells[3][0]().stroke(T.yellow, 0.4), tabBCells[3][1]().stroke(T.yellow, 0.4), tabBCells[3][2]().stroke(T.yellow, 0.4),
    )),
    at('也是一扫就到', chain(qChipB().scale(1.05, 0.5), qChipB().scale(1, 0.4))),
    at('要是既要按日期', all(qChipB().opacity(0, 0.4), qArrowB().opacity(0, 0.4), twoDimChip().opacity(1, 0.5),
      chain(tabA().scale(1.04, 0.5), tabA().scale(1, 0.4)))),
    at('又要按产品呢', chain(tabB().scale(1.04, 0.5), tabB().scale(1, 0.4))),
    at('先用其中一份', chain(tabA().scale(1.04, 0.5), tabA().scale(1, 0.4))),
    at('另一维再筛一遍', chain(twoDimChip().scale(1.04, 0.5), twoDimChip().scale(1, 0.4))),
    // r10 P2-4：“或者”标记 + 第三份副本随第二种办法一起出现——两贴片是二选一，不是先后步骤
    at('或者再存一份先按产品', all(copyChip().opacity(1, 0.5), orChip().opacity(1, 0.5), tabC().opacity(1, 0.5))),
  );

  say('像多个二级索引');
  yield* beat('m20',
    all(machines().opacity(0, 0.5), tabA().opacity(0, 0.4), tabB().opacity(0, 0.4), dataChip().opacity(0, 0.4),
      qChipA().opacity(0, 0.4), qChipB().opacity(0, 0.4), qArrowA().opacity(0, 0.4), qArrowB().opacity(0, 0.4),
      twoDimChip().opacity(0, 0.4), copyChip().opacity(0, 0.4), orChip().opacity(0, 0.4), tabC().opacity(0, 0.4),
      compare().opacity(1, 0.5)),
    at('多个二级索引', rowCard().stroke(T.yellow, 0.4)),
    at('每行放在一处', rowChip().opacity(1, 0.5)),
    at('指向匹配行的指针', all(idxChip1().opacity(1, 0.5), idxChip2().opacity(1, 0.5), ptr1().opacity(1, 0.4), ptr2().opacity(1, 0.4))),
  );

  say('列存只有含值的列');
  yield* beat('m21',
    at('大区别', diffTag().opacity(1, 0.5)),
    at('没有任何指向别处数据的指针', all(ptr1().opacity(0, 0.4), ptr2().opacity(0, 0.4), noPtr().opacity(1, 0.5))),
    at('只有含值的列', chain(colStrips[0]().opacity(1, 0.4), colStrips[1]().opacity(1, 0.4), colStrips[2]().opacity(1, 0.4))),
  );

  say('位置就是行号');
  yield* beat('m21b',
    at('第几个位置', all(posBand().opacity(0.2, 0.5), posKLab().opacity(1, 0.5))),
  );

  say('第 k 项 = 第 k 行');
  yield* beat('m21c',
    at('第 k 个位置就是第 k 行', posChip().opacity(1, 0.5)),
  );
});
