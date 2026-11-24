// U13 场景 2（MC）：b12–b20 —— 第二排序键、同日同产品聚在一起、排序帮压缩、越往后越乱。
// 分镜：skill-ch03/beats-u13.md；原文：DDIA §3.12（书页 p100，PDF p122）。
// 6 行示例：同一天同一产品各有两行，演示“聚在一起”；压缩演示只用示意段长，不编造行数。
// 时长全部来自 timeline/u13.json（beat() 驱动），不手写 waitFor。
import {Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, chain, createRef} from '@motion-canvas/core';
import {at, makeBeats} from '../../lib/beats';
import {FONT, SAFE, SIZE, T} from '../../lib/theme';
import timeline from '../../timeline/u13.json';

const COL_X = [-340, 0, 340];
const COL_HEAD = ['date_key', 'product_sk', 'quantity'];
const ROW_Y = [-205, -165, -125, -85, -45, -5];
// 已按日期、产品排好的 6 行：同日同产品各两行
const DATA = [
  ['140101', '32', '7'],
  ['140101', '32', '4'],
  ['140101', '69', '3'],
  ['140102', '32', '5'],
  ['140102', '32', '9'],
  ['140102', '33', '2'],
];

export default makeScene2D(function* (view) {
  view.fill(T.bg);
  const beat = makeBeats(timeline);

  const header = createRef<Txt>();
  const anchor = createRef<Txt>();
  const say = (text: string) => anchor().text(text);

  const tab = createRef<Node>();
  const headCells = [0, 1, 2].map(() => createRef<Rect>());
  const cellRects = [0, 1, 2, 3, 4, 5].map(() => [0, 1, 2].map(() => createRef<Rect>()));
  const dateBox1 = createRef<Rect>();
  const dateBox2 = createRef<Rect>();
  const groupBox1 = createRef<Rect>();
  const groupBox2 = createRef<Rect>();
  const groupChip = createRef<Node>();
  const funnel = createRef<Txt>();
  const groupLab = createRef<Txt>();
  const filterLab = createRef<Txt>();

  // 压缩演示：日期列的 6 个格 + 两段长条 + 游程编码
  const comp = createRef<Node>();
  const compCells = [0, 1, 2, 3, 4, 5].map(() => createRef<Rect>());
  const compArrow = createRef<Line>();
  const compSmall = createRef<Node>();
  const bar1 = createRef<Rect>();
  const bar2 = createRef<Rect>();
  const rle1 = createRef<Node>();
  const rle2 = createRef<Node>();
  const kbBlock = createRef<Node>();
  const bigLab = createRef<Txt>();
  const strongTag = createRef<Node>();

  // 三列对比：第一 / 第二 / 第三排序键的段长
  const strips = createRef<Node>();
  const stripLabs = [0, 1, 2].map(() => createRef<Txt>());
  const seg1 = [0, 1].map(() => createRef<Rect>());
  const seg2 = [0, 1, 2, 3].map(() => createRef<Rect>());
  const seg3 = Array.from({length: 8}, () => createRef<Rect>());
  const randomTag = createRef<Txt>();
  const winChip = createRef<Node>();

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

      {/* 六行事实表（已按日期、产品排好） */}
      <Node ref={tab} opacity={0}>
        {[0, 1, 2].map(i => (
          <Rect
            key={`hc-${i}`}
            ref={headCells[i]}
            position={[COL_X[i], -250]}
            width={210}
            height={40}
            radius={10}
            fill={T.card}
            stroke={T.blue}
            lineWidth={2}
          >
            <Txt fontSize={20} fill={T.text} fontFamily={FONT.mono} text={COL_HEAD[i]} />
          </Rect>
        ))}
        {[0, 1, 2, 3, 4, 5].flatMap(r =>
          [0, 1, 2].map(c => (
            <Rect
              key={`cell-${r}-${c}`}
              ref={cellRects[r][c]}
              position={[COL_X[c], ROW_Y[r]]}
              width={210}
              height={36}
              radius={8}
              fill={T.card}
              stroke={T.line}
              lineWidth={2}
            >
              <Txt fontSize={20} fill={T.text} fontFamily={FONT.mono} text={DATA[r][c]} />
            </Rect>
          )),
        )}
        <Rect ref={dateBox1} position={[0, -165]} width={780} height={128} radius={14} stroke={T.yellow} lineWidth={3} opacity={0} />
        <Rect ref={dateBox2} position={[0, -45]} width={780} height={128} radius={14} stroke={T.yellow} lineWidth={3} opacity={0} />
        <Rect ref={groupBox1} position={[0, -185]} width={780} height={88} radius={14} stroke={T.green} lineWidth={3} opacity={0} />
        <Rect ref={groupBox2} position={[0, -65]} width={780} height={88} radius={14} stroke={T.green} lineWidth={3} opacity={0} />
        <Txt ref={funnel} position={[500, -185]} fontSize={40} fill={T.green} fontFamily={FONT.sans} text={'▼'} opacity={0} />
        <Txt ref={groupLab} position={[500, -130]} fontSize={SIZE.label} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'分组'} opacity={0} />
        <Txt ref={filterLab} position={[500, -65]} fontSize={SIZE.label} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'过滤'} opacity={0} />
      </Node>
      <Node ref={groupChip} position={[0, 110]} opacity={0}>
        <Rect width={340} height={56} radius={12} fill={T.card} stroke={T.green} lineWidth={2}>
          <Txt fontSize={SIZE.label} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'同日同产品'} />
        </Rect>
      </Node>

      {/* 压缩演示 */}
      <Node ref={comp} opacity={0}>
        <Txt ref={bigLab} position={[-300, -275]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'一列有几十亿项'} opacity={0} />
        {[0, 1, 2, 3, 4, 5].map(i => (
          <Rect
            key={`cc-${i}`}
            ref={compCells[i]}
            position={[-300, -205 + i * 40]}
            width={200}
            height={36}
            radius={8}
            fill={T.card}
            stroke={T.line}
            lineWidth={2}
          >
            <Txt fontSize={20} fill={T.text} fontFamily={FONT.mono} text={i < 3 ? '140101' : '140102'} />
          </Rect>
        ))}
        <Rect ref={bar1} position={[-300, -165]} width={200} height={10} radius={8} fill={T.blue} opacity={0} />
        <Rect ref={bar2} position={[-300, -45]} width={200} height={10} radius={8} fill={T.purple} opacity={0} />
        <Line ref={compArrow} points={[[-180, -105], [-40, -105]]} stroke={T.green} lineWidth={3} endArrow opacity={0} />
        <Node ref={compSmall} position={[120, -105]} opacity={0}>
          <Rect width={180} height={80} radius={12} fill={T.card} stroke={T.green} lineWidth={2}>
            <Txt fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} text={'变小了'} />
          </Rect>
        </Node>
        <Node ref={rle1} position={[-300, -165]} opacity={0}>
          <Rect width={260} height={56} radius={12} fill={T.card} stroke={T.blue} lineWidth={2}>
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'140101 × 3'} />
          </Rect>
        </Node>
        <Node ref={rle2} position={[-300, -45]} opacity={0}>
          <Rect width={260} height={56} radius={12} fill={T.card} stroke={T.purple} lineWidth={2}>
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'140102 × 3'} />
          </Rect>
        </Node>
        <Node ref={kbBlock} position={[120, -105]} opacity={0}>
          <Rect width={180} height={80} radius={12} fill={T.card} stroke={T.yellow} lineWidth={3}>
            <Txt fontSize={SIZE.body} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'几 KB'} />
          </Rect>
        </Node>
      </Node>
      <Node ref={strongTag} position={[0, 150]} opacity={0}>
        <Rect width={340} height={56} radius={12} fill={T.card} stroke={T.yellow} lineWidth={2}>
          <Txt fontSize={SIZE.label} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'压缩最强'} />
        </Rect>
      </Node>

      {/* 三列段长对比 */}
      <Node ref={strips} opacity={0}>
        {[0, 1, 2].map(i => (
          <Txt key={`sl-${i}`} ref={stripLabs[i]} position={[[-380, 0, 380][i], -275]} fontSize={SIZE.label} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={['第一排序键', '第二', '第三'][i]} />
        ))}
        {[0, 1].map(i => (
          <Rect key={`s1-${i}`} ref={seg1[i]} position={[-380, -165 + i * 120]} width={180} height={100} radius={8} fill={T.blue} />
        ))}
        {[0, 1, 2, 3].map(i => (
          <Rect key={`s2-${i}`} ref={seg2[i]} position={[0, -195 + i * 60]} width={180} height={50} radius={8} fill={i % 2 ? T.purple : T.blue} />
        ))}
        {Array.from({length: 8}, (_, i) => (
          <Rect key={`s3-${i}`} ref={seg3[i]} position={[380, -208 + i * 30]} width={180} height={24} radius={6} fill={[T.blue, T.purple, T.green, T.yellow][i % 4]} />
        ))}
        <Txt ref={randomTag} position={[380, 80]} fontSize={SIZE.label} fontWeight={700} fill={T.muted} fontFamily={FONT.sans} text={'基本随机'} opacity={0} />
      </Node>
      <Node ref={winChip} position={[0, 150]} opacity={0}>
        <Rect width={480} height={56} radius={12} fill={T.card} stroke={T.green} lineWidth={2}>
          <Txt fontSize={SIZE.label} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'前几列排好序，总体赢'} />
        </Rect>
      </Node>
    </>
  );

  say('第二排序键');
  yield* beat('b12',
    all(tab().opacity(1, 0.5)),
    at('第一列值相同的行', all(
      dateBox1().opacity(1, 0.5),
      cellRects[0][0]().stroke(T.yellow, 0.4),
      cellRects[1][0]().stroke(T.yellow, 0.4),
      cellRects[2][0]().stroke(T.yellow, 0.4),
    )),
    at('再按什么排', dateBox2().opacity(1, 0.5)),
  );

  say('同日同产品聚一起');
  yield* beat('b13',
    all(dateBox1().opacity(0, 0.4), dateBox2().opacity(0, 0.4)),
    at('同一天里再按产品排', all(groupBox1().opacity(1, 0.5), groupBox2().opacity(1, 0.5))),
    at('聚在了一起', groupChip().opacity(1, 0.5)),
  );

  say('分组、过滤都方便');
  yield* beat('b14',
    at('分组', all(funnel().opacity(1, 0.4), groupLab().opacity(1, 0.4))),
    at('过滤', filterLab().opacity(1, 0.4)),
  );

  say('排序帮压缩');
  yield* beat('b15',
    all(tab().opacity(0, 0.5), groupChip().opacity(0, 0.4), comp().opacity(1, 0.5)),
    at('帮压缩', all(compArrow().opacity(1, 0.5), compSmall().opacity(1, 0.5))),
  );

  say('同一值连成一段');
  yield* beat('b16',
    all(bigLab().opacity(1, 0.4)),
    at('连成很长的一段', all(
      compCells[0]().opacity(0, 0.3), compCells[1]().opacity(0, 0.3), compCells[2]().opacity(0, 0.3),
      compCells[3]().opacity(0, 0.3), compCells[4]().opacity(0, 0.3), compCells[5]().opacity(0, 0.3),
      bar1().opacity(1, 0.4), bar2().opacity(1, 0.4),
      bar1().height(118, 1.2), bar2().height(118, 1.2),
    )),
  );

  say('几十亿行 → 几 KB');
  yield* beat('b17',
    all(compArrow().opacity(0, 0.4), compSmall().opacity(0, 0.4)),
    at('游程编码', all(bar1().opacity(0, 0.4), bar2().opacity(0, 0.4), rle1().opacity(1, 0.5), rle2().opacity(1, 0.5))),
    at('几 KB', kbBlock().opacity(1, 0.5)),
    at('几十亿行', bigLab().fill(T.yellow, 0.4)),
  );

  say('第一排序键最强');
  yield* beat('b18',
    at('第一排序键', all(strongTag().opacity(1, 0.5), rle1().scale(1.06, 0.8), rle2().scale(1.06, 0.8))),
    at('最强', chain(rle1().scale(1, 0.5), rle2().scale(1, 0.5))),
  );

  say('越往后越乱');
  yield* beat('b19',
    all(comp().opacity(0, 0.5), strongTag().opacity(0, 0.4)),
    at('越来越乱', strips().opacity(1, 0.5)),
  );

  say('总体上还是赢');
  yield* beat('b20',
    at('随机顺序', all(
      seg3[0]().fill(T.line, 0.4), seg3[1]().fill(T.line, 0.4), seg3[2]().fill(T.line, 0.4), seg3[3]().fill(T.line, 0.4),
      seg3[4]().fill(T.line, 0.4), seg3[5]().fill(T.line, 0.4), seg3[6]().fill(T.line, 0.4), seg3[7]().fill(T.line, 0.4),
      randomTag().opacity(1, 0.5),
    )),
    at('总体上还是赢', winChip().opacity(1, 0.5)),
  );
});
