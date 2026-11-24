// U6 场景 1（MC）：b1–b8 —— 钩子、主键唯一标识一行、二级索引（user_id 找同一用户的各行）、
// 键不唯一两种解法、索引值的两种可能、堆文件。
// 分镜：skill-ch03/beats-u6.md；原文：DDIA §3.6 前半（书页 p85–86，PDF p107–108）。
// 本单元无原书图，画面均为按原文重新生成的示意图。
// 时长全部来自 timeline/u6.json（beat() 驱动），不手写 waitFor。
import {Circle, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, chain, createRef} from '@motion-canvas/core';
import {at, makeBeats} from '../../lib/beats';
import {FONT, SAFE, SIZE, T} from '../../lib/theme';
import timeline from '../../timeline/u6.json';

export default makeScene2D(function* (view) {
  view.fill(T.bg);
  const beat = makeBeats(timeline);

  const header = createRef<Txt>();
  const anchor = createRef<Txt>();
  const say = (text: string) => anchor().text(text);

  // ---- 第 1 页：订单表（b1–b2）----
  const pA = createRef<Node>();
  const pkHl = createRef<Rect>();
  const rowHl = createRef<Rect>();
  const qMark = createRef<Txt>();
  const refCard = createRef<Rect>();
  const refArrow = createRef<Line>();

  // ---- 第 2 页：user_id 找同一用户的各行（b3）----
  const pB = createRef<Node>();
  const cmdChip = createRef<Rect>();
  const hlL1 = createRef<Rect>();
  const hlL3 = createRef<Rect>();
  const hlR1 = createRef<Rect>();
  const link1 = createRef<Line>();
  const link2 = createRef<Line>();
  const linkDot = createRef<Circle>();

  // ---- 第 3 页：键不唯一两种解法（b4–b5c）----
  const pC = createRef<Node>();
  const keyCard = createRef<Rect>();
  const rowChips = [0, 1, 2].map(() => createRef<Rect>());
  const listBox = createRef<Rect>();
  const listTxt = createRef<Txt>();
  const keyChips = [0, 1, 2].map(() => createRef<Rect>());
  const plateB = createRef<Rect>();
  const plateL = createRef<Rect>();
  const bothLab = createRef<Txt>();

  // ---- 第 4 页：值是行还是引用、堆文件（b6–b8）----
  const pD = createRef<Node>();
  const idxCard = createRef<Rect>();
  const optRow = createRef<Rect>();
  const optRef = createRef<Rect>();
  const heapBox = createRef<Rect>();
  const heapRows = [0, 1, 2, 3].map(() => createRef<Txt>());
  const heapArrow = createRef<Line>();
  const newChip = createRef<Rect>();
  const delTag = createRef<Txt>();
  const idxA = createRef<Rect>();
  const idxB = createRef<Rect>();
  const arrowA = createRef<Line>();
  const arrowB = createRef<Line>();
  const onceLab = createRef<Txt>();

  view.add(
    <>
      <Txt
        ref={header}
        position={[-SAFE.halfW, -SAFE.halfH]}
        offset={[-1, -1]}
        fontSize={SIZE.label}
        fill={T.muted}
        fontFamily={FONT.sans}
        text={'不止主键：二级索引与聚集索引'}
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

      {/* 第 1 页 */}
      <Node ref={pA} opacity={0}>
        <Rect position={[0, -50]} width={780} height={230} radius={16} fill={T.card} stroke={T.line} lineWidth={2}>
          <Txt position={[0, -85]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'订单表'} />
          <Txt position={[-100, -45]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'订单号（主键）'} />
          <Txt position={[95, -45]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'用户   金额'} />
          <Txt position={[0, -5]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'1001   张伟   128'} />
          <Txt position={[0, 30]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'1002   李伟   96'} />
          <Txt position={[0, 65]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'1003   王敏   210'} />
        </Rect>
        <Rect ref={pkHl} position={[-100, -95]} width={170} height={44} radius={10} stroke={T.yellow} lineWidth={3} opacity={0} />
        <Rect ref={rowHl} position={[0, -55]} width={760} height={44} radius={10} stroke={T.yellow} lineWidth={3} opacity={0} />
        <Txt ref={qMark} position={[0, 150]} fontSize={72} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'?'} opacity={0} />
        <Rect ref={refCard} position={[0, 175]} width={380} height={64} radius={14} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'另一张表引用 1001'} />
        </Rect>
        <Line ref={refArrow} points={[[0, 140], [0, 70]]} stroke={T.blue} lineWidth={3} endArrow opacity={0} />
      </Node>

      {/* 第 2 页 */}
      <Node ref={pB} opacity={0}>
        <Rect position={[-290, -60]} width={460} height={210} radius={16} fill={T.card} stroke={T.line} lineWidth={2}>
          <Txt position={[0, -80]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'订单表'} />
          <Txt position={[0, -45]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'user_id  用户  金额'} />
          <Txt position={[0, -10]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'101  张伟  128'} />
          <Txt position={[0, 25]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'102  李伟  96'} />
          <Txt position={[0, 60]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'101  张伟  210'} />
        </Rect>
        <Rect position={[290, -60]} width={460} height={210} radius={16} fill={T.card} stroke={T.line} lineWidth={2}>
          <Txt position={[0, -80]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'用户表'} />
          <Txt position={[0, -45]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'user_id  姓名  城市'} />
          <Txt position={[0, -10]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'101  张伟  上海'} />
          <Txt position={[0, 25]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'102  李伟  北京'} />
        </Rect>
        <Rect ref={hlL1} position={[-290, -70]} width={440} height={40} radius={10} stroke={T.yellow} lineWidth={3} opacity={0} />
        <Rect ref={hlL3} position={[-290, 0]} width={440} height={40} radius={10} stroke={T.yellow} lineWidth={3} opacity={0} />
        <Rect ref={hlR1} position={[290, -70]} width={440} height={40} radius={10} stroke={T.yellow} lineWidth={3} opacity={0} />
        <Line ref={link1} points={[[-55, -70], [55, -70]]} stroke={T.yellow} lineWidth={3} endArrow opacity={0} />
        <Line ref={link2} points={[[-55, 0], [55, -70]]} stroke={T.yellow} lineWidth={3} endArrow opacity={0} />
        <Circle ref={linkDot} position={[-55, -70]} width={22} height={22} fill={T.yellow} opacity={0} />
        <Rect ref={cmdChip} position={[0, 150]} width={380} height={64} radius={14} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'一条建索引的命令'} />
        </Rect>
      </Node>

      {/* 第 3 页 */}
      <Node ref={pC} opacity={0}>
        <Rect ref={keyCard} position={[0, -200]} width={460} height={80} radius={16} fill={T.card} stroke={T.blue} lineWidth={3}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.mono} text={'键：城市 = 上海'} />
        </Rect>
        {[0, 1, 2].map(i => (
          <Rect
            key={`rc-${i}`}
            ref={rowChips[i]}
            position={[-360 + i * 360, -90]}
            width={300}
            height={70}
            radius={14}
            fill={T.card}
            stroke={T.line}
            lineWidth={2}
            opacity={0}
          >
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={['行 2 · 上海', '行 5 · 上海', '行 9 · 上海'][i]} />
          </Rect>
        ))}
        <Rect ref={listBox} position={[0, 10]} width={640} height={90} radius={14} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt ref={listTxt} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'值 = 行标识符列表：行 2、行 5、行 9'} />
        </Rect>
        {[0, 1, 2].map(i => (
          <Rect
            key={`kc-${i}`}
            ref={keyChips[i]}
            position={[-360 + i * 360, 110]}
            width={320}
            height={64}
            radius={14}
            fill={T.card}
            stroke={T.green}
            lineWidth={2}
            opacity={0}
          >
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={['上海 · 行 2', '上海 · 行 5', '上海 · 行 9'][i]} />
          </Rect>
        ))}
        <Rect ref={plateB} position={[-280, 110]} width={420} height={80} radius={16} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'B 树'} />
        </Rect>
        <Rect ref={plateL} position={[280, 110]} width={420} height={80} radius={16} fill={T.card} stroke={T.purple} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'日志结构索引'} />
        </Rect>
        <Txt ref={bothLab} position={[0, 205]} fontSize={SIZE.body} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'都能拿来做二级索引'} opacity={0} />
      </Node>

      {/* 第 4 页 */}
      <Node ref={pD} opacity={0}>
        <Rect ref={idxCard} position={[-350, -140]} width={400} height={110} radius={16} fill={T.card} stroke={T.blue} lineWidth={3}>
          <Txt position={[0, -25]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'索引'} />
          <Txt position={[0, 25]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.mono} text={'键 → 值'} />
        </Rect>
        <Rect ref={optRow} position={[-350, 10]} width={400} height={64} radius={14} fill={T.card} stroke={T.line} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'值是整行'} />
        </Rect>
        <Rect ref={optRef} position={[-350, 100]} width={400} height={64} radius={14} fill={T.card} stroke={T.line} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'值是引用 →'} />
        </Rect>
        <Rect ref={heapBox} position={[300, -60]} width={460} height={260} radius={16} fill={T.card} stroke={T.line} lineWidth={2} opacity={0}>
          <Txt position={[0, -100]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'堆文件'} />
        </Rect>
        <Txt ref={heapRows[0]} position={[300, -120]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'行 5 · 王敏'} opacity={0} />
        <Txt ref={heapRows[1]} position={[300, -85]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'行 2 · 张伟'} opacity={0} />
        <Txt ref={heapRows[2]} position={[300, -50]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'行 9 · 李伟'} opacity={0} />
        <Txt ref={heapRows[3]} position={[300, -15]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'行 7 · 赵磊'} opacity={0} />
        <Line ref={heapArrow} points={[[-140, -100], [60, -100]]} stroke={T.yellow} lineWidth={3} endArrow opacity={0} />
        <Rect ref={newChip} position={[300, 115]} width={420} height={64} radius={14} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.green} fontFamily={FONT.mono} text={'新记录 → 行 12，追加到尾'} />
        </Rect>
        <Txt ref={delTag} position={[300, 185]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'行 9 已删，以后可覆盖'} opacity={0} />
        <Rect ref={idxA} position={[-350, -160]} width={400} height={80} radius={16} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'索引一：按姓名'} />
        </Rect>
        <Rect ref={idxB} position={[-350, -40]} width={400} height={80} radius={16} fill={T.card} stroke={T.purple} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'索引二：按城市'} />
        </Rect>
        <Line ref={arrowA} points={[[-140, -160], [60, -120]]} stroke={T.blue} lineWidth={3} endArrow opacity={0} />
        <Line ref={arrowB} points={[[-140, -40], [60, -50]]} stroke={T.purple} lineWidth={3} endArrow opacity={0} />
        <Txt ref={onceLab} position={[0, 235]} fontSize={SIZE.body} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'数据只存一份'} opacity={0} />
      </Node>
    </>
  );

  say('主键之外怎么找？');
  yield* beat('b1',
    all(pA().opacity(1, 0.5)),
    at('主键之外', pkHl().opacity(1, 0.5)),
    at('别的列', chain(qMark().opacity(1, 0.4), qMark().position([0, 140], 0.5))),
  );

  say('主键唯一标识一行');
  yield* beat('b2',
    all(qMark().opacity(0, 0.4)),
    at('订单号', rowHl().opacity(1, 0.5)),
    at('别的记录', chain(refCard().opacity(1, 0.5), refArrow().opacity(1, 0.5))),
    at('主键来引用', rowHl().stroke(T.green, 0.5)),
  );

  say('二级索引：另一把钥匙');
  yield* beat('b3',
    all(pA().opacity(0, 0.5), pB().opacity(1, 0.5)),
    at('建索引的命令', cmdChip().opacity(1, 0.5)),
    at('同一用户', chain(
      all(hlL1().opacity(1, 0.4), hlL3().opacity(1, 0.4), hlR1().opacity(1, 0.4), link1().opacity(1, 0.4)),
      linkDot().opacity(1, 0.3),
      linkDot().position([55, -70], 1.2),
    )),
    at('常常就靠它', all(link2().opacity(1, 0.4), linkDot().position([-55, 0], 0.6))),
  );

  say('键不唯一');
  yield* beat('b4',
    all(pB().opacity(0, 0.5), pC().opacity(1, 0.5)),
    at('键值索引', keyCard().stroke(T.yellow, 0.5)),
    at('键不唯一', chain(rowChips[0]().opacity(1, 0.4), rowChips[1]().opacity(1, 0.4), rowChips[2]().opacity(1, 0.4))),
  );

  say('值变行标识符列表');
  yield* beat('b5a',
    at('第一种解法', all(listBox().opacity(1, 0.5), rowChips[0]().opacity(0.3, 0.5), rowChips[1]().opacity(0.3, 0.5), rowChips[2]().opacity(0.3, 0.5))),
    at('标识符列表', listTxt().fill(T.yellow, 0.4)),
    at('像全文索引里', chain(rowChips[0]().opacity(1, 0.4), rowChips[1]().opacity(1, 0.4), rowChips[2]().opacity(1, 0.4))),
    at('挂着好几行', listBox().scale(1.03, 1.2)),
  );

  say('键后追加行标识符');
  yield* beat('b5b',
    all(listBox().opacity(0, 0.4)),
    at('第二种解法', chain(keyChips[0]().opacity(1, 0.4), keyChips[1]().opacity(1, 0.4), keyChips[2]().opacity(1, 0.4))),
    at('追加行标识符', chain(keyChips[0]().stroke(T.yellow, 0.4), keyChips[1]().stroke(T.yellow, 0.4), keyChips[2]().stroke(T.yellow, 0.4))),
  );

  say('两种索引都能用');
  yield* beat('b5c',
    all(keyChips[0]().opacity(0, 0.4), keyChips[1]().opacity(0, 0.4), keyChips[2]().opacity(0, 0.4)),
    at('B 树', plateB().opacity(1, 0.5)),
    at('日志结构', plateL().opacity(1, 0.5)),
    at('都能拿来做二级索引', bothLab().opacity(1, 0.5)),
  );

  say('值是行，还是引用？');
  yield* beat('b6',
    all(pC().opacity(0, 0.5), pD().opacity(1, 0.5)),
    at('要么是行本身', all(optRow().opacity(1, 0.5), optRow().stroke(T.green, 0.4))),
    at('行的引用', all(optRef().opacity(1, 0.5), optRef().stroke(T.yellow, 0.4))),
  );

  say('行住在堆文件里');
  yield* beat('b7a',
    at('堆文件', chain(heapBox().opacity(1, 0.5), heapRows[0]().opacity(1, 0.4), heapRows[1]().opacity(1, 0.4), heapRows[2]().opacity(1, 0.4), heapRows[3]().opacity(1, 0.4))),
    at('没有特定顺序', chain(heapArrow().opacity(1, 0.5), heapBox().stroke(T.yellow, 0.4), heapBox().stroke(T.line, 1.0))),
  );

  say('追加，或留空位覆盖');
  yield* beat('b7b',
    at('往后追加', newChip().opacity(1, 0.5)),
    at('删掉的行', chain(heapRows[2]().fill(T.muted, 0.5), delTag().opacity(1, 0.5))),
    at('用新数据覆盖', delTag().fill(T.green, 0.5)),
  );

  say('数据只存一份');
  yield* beat('b8',
    all(optRow().opacity(0, 0.4), optRef().opacity(0, 0.4)),
    at('避免了重复数据', all(idxCard().opacity(0, 0.5), heapArrow().opacity(0, 0.5), idxA().opacity(1, 0.5), idxB().opacity(1, 0.5), arrowA().opacity(1, 0.4), arrowB().opacity(1, 0.4))),
    at('只存一份', chain(onceLab().opacity(1, 0.5), heapBox().stroke(T.green, 0.5))),
  );
});
