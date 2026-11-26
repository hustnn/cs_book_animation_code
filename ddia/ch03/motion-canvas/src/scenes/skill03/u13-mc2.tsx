// U13 场景 2（MC）r10：m10–m13b —— 第二排序键、同日同产品聚在一起、排序帮压缩、越往后越乱。
// r10（判定 #41）：P2-1 m13 补真表尺度推导步——右上加“真表：几百种值，各记一次”三行示意 + 指向“几 KB”的箭头；
// P2-2 m13b 第二键段条高度按游程 2/1/2/1 改（两倍高/一倍高交替）。
// r9（判定 #38）：P2-3 m13 两处小标签区分演示与真表——×3 编码框旁“演示表（6 行）的游程编码”，“几 KB”框旁“真表才有”。
// r7（判定 #35）：P1-3 m11 分组框只框两对（140101·32、140102·32），单例行不框 +“只有一行的不成组”小字；
// P2-2 m12 长条先长后短再亮“变小了”；P2-3 m13“压缩最强”贴片下移到 y=200，错开“140102 × 3”框下沿。
// 分镜：skill-ch03/beats-u13.md；原文：DDIA §3.12（书页 p100，PDF p122）。
// 6 行示例：同一天同一产品各有两行，演示“聚在一起”；压缩演示只用示意段长，不编造行数。
// r5：m13b 旁白报出演示表自己的段数（第一键 2 段、第二键 4 段、第三键 6 段），三列下方各加一段数标签。
// 恢复更正：第三键原写 8 段是 r4 示意段条的旧数，演示表数量列 6 行值全不同，字面游程是 6 段。
// m13 用 Cam 推近看第一排序键的长串重复值（设计：推镜头；不用 Motion Canvas 的 Camera 组件）。
// 时长全部来自 timeline/u13.json（beat() 驱动），不手写 waitFor。
import {Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, chain, createRef} from '@motion-canvas/core';
import {at, makeBeats} from '../../lib/beats';
import {Cam} from '../../lib/schemas';
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
  const world = createRef<Node>();

  const tab = createRef<Node>();
  const headCells = [0, 1, 2].map(() => createRef<Rect>());
  const cellRects = [0, 1, 2, 3, 4, 5].map(() => [0, 1, 2].map(() => createRef<Rect>()));
  const dateBox1 = createRef<Rect>();
  const dateBox2 = createRef<Rect>();
  const groupBox1 = createRef<Rect>();
  const groupBox2 = createRef<Rect>();
  const groupChip = createRef<Node>();
  // r7 P1-3：单例行不成组——140101·69、140102·33 各只有一行，不框
  const singleLab = createRef<Txt>();
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
  // r9 P2-3：区分演示与真表——×3 编码框旁“演示表（6 行）的游程编码”，“几 KB”框旁“真表才有”
  const demoLab = createRef<Txt>();
  const kbLab = createRef<Txt>();
  const bigLab = createRef<Txt>();
  const strongTag = createRef<Node>();
  // r10 P2-1：真表尺度推导步——右上三行“值 × 几百万行”示意 + 指向“几 KB”的箭头
  const trueRle = createRef<Node>();
  const trueArrow = createRef<Line>();

  // 三列对比：第一 / 第二 / 第三排序键的段长
  const strips = createRef<Node>();
  const stripLabs = [0, 1, 2].map(() => createRef<Txt>());
  const seg1 = [0, 1].map(() => createRef<Rect>());
  const seg2 = [0, 1, 2, 3].map(() => createRef<Rect>());
  const seg3 = Array.from({length: 6}, () => createRef<Rect>());
  const randomTag = createRef<Txt>();
  const winChip = createRef<Node>();
  // r5：三列段数标签（第一键 2 段、第二键 4 段、第三键 6 段，与画面上的段块数一致）
  const segCounts = [0, 1, 2].map(() => createRef<Txt>());
  // r6 F11：段条下标出值序列，说明段数从哪数出来
  const segSeqs = [0, 1, 2].map(() => createRef<Txt>());

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

      <Node ref={world}>
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
        {/* r7 P1-3：只框真正的同（日，产品）对——上框 140101·32 两行（ROW_Y -205/-165），下框 140102·32 两行（-85/-45）；单例行 140101·69、140102·33 不框 */}
        <Rect ref={groupBox1} position={[0, -185]} width={780} height={76} radius={14} stroke={T.green} lineWidth={3} opacity={0} />
        <Rect ref={groupBox2} position={[0, -65]} width={780} height={76} radius={14} stroke={T.green} lineWidth={3} opacity={0} />
        <Txt ref={funnel} position={[500, -185]} fontSize={40} fill={T.green} fontFamily={FONT.sans} text={'▼'} opacity={0} />
        <Txt ref={groupLab} position={[500, -130]} fontSize={SIZE.label} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'分组'} opacity={0} />
        <Txt ref={filterLab} position={[500, -65]} fontSize={SIZE.label} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'过滤'} opacity={0} />
      </Node>
      <Node ref={groupChip} position={[0, 110]} opacity={0}>
        <Rect width={340} height={56} radius={12} fill={T.card} stroke={T.green} lineWidth={2}>
          <Txt fontSize={SIZE.label} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'同日同产品'} />
        </Rect>
      </Node>
      <Txt ref={singleLab} position={[0, 170]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'只有一行的不成组'} opacity={0} />

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
        {/* r9 P2-3：两编码框之间的小字——×3 是演示表（6 行）的游程编码，不是真表尺度 */}
        <Txt ref={demoLab} position={[-300, -105]} fontSize={20} fill={T.muted} fontFamily={FONT.sans} text={'演示表（6 行）的游程编码'} opacity={0} />
        <Node ref={kbBlock} position={[120, -105]} opacity={0}>
          <Rect width={180} height={80} radius={12} fill={T.card} stroke={T.yellow} lineWidth={3}>
            <Txt fontSize={SIZE.body} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'几 KB'} />
          </Rect>
        </Node>
        {/* r9 P2-3：“几 KB”框下方小字——几 KB 是真表才有的压缩效果 */}
        <Txt ref={kbLab} position={[120, -45]} fontSize={20} fill={T.muted} fontFamily={FONT.sans} text={'真表才有'} opacity={0} />
        {/* r10 P2-1：真表尺度推导步——右上三行“值 × 几百万行”示意（几百种值，各记一次），箭头指向“几 KB” */}
        <Node ref={trueRle} position={[180, -235]} opacity={0}>
          <Txt position={[0, -78]} fontSize={20} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'真表：几百种值'} />
          <Rect position={[0, -38]} width={230} height={36} radius={8} fill={T.card} stroke={T.blue} lineWidth={2}>
            <Txt fontSize={18} fill={T.text} fontFamily={FONT.mono} text={'140101 × 几百万行'} />
          </Rect>
          <Rect position={[0, 4]} width={230} height={36} radius={8} fill={T.card} stroke={T.purple} lineWidth={2}>
            <Txt fontSize={18} fill={T.text} fontFamily={FONT.mono} text={'140102 × 几百万行'} />
          </Rect>
          <Txt position={[0, 44]} fontSize={18} fill={T.muted} fontFamily={FONT.sans} text={'…… 还有几百种'} />
        </Node>
        <Line ref={trueArrow} points={[[150, -180], [150, -148]]} stroke={T.green} lineWidth={3} endArrow opacity={0} />
      </Node>
      </Node>
      <Node ref={strongTag} position={[0, 200]} opacity={0}>
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
        {/* r10 P2-2：第二键段条高度按游程 2/1/2/1 行来——第 1、3 段（2 行）为第 2、4 段（1 行）的两倍高 */}
        {[0, 1, 2, 3].map(i => (
          <Rect key={`s2-${i}`} ref={seg2[i]} position={[0, -195 + i * 60]} width={180} height={i % 2 ? 25 : 50} radius={8} fill={i % 2 ? T.purple : T.blue} />
        ))}
        {Array.from({length: 6}, (_, i) => (
          <Rect key={`s3-${i}`} ref={seg3[i]} position={[380, -208 + i * 30]} width={180} height={24} radius={6} fill={[T.blue, T.purple, T.green, T.yellow][i % 4]} />
        ))}
        <Txt ref={randomTag} position={[380, 80]} fontSize={SIZE.label} fontWeight={700} fill={T.muted} fontFamily={FONT.sans} text={'基本随机'} opacity={0} />
        <Txt ref={segCounts[0]} position={[-380, 80]} fontSize={SIZE.label} fontWeight={700} fill={T.blue} fontFamily={FONT.sans} text={'2 段'} opacity={0} />
        <Txt ref={segCounts[1]} position={[0, 80]} fontSize={SIZE.label} fontWeight={700} fill={T.blue} fontFamily={FONT.sans} text={'4 段'} opacity={0} />
        <Txt ref={segCounts[2]} position={[380, 120]} fontSize={SIZE.label} fontWeight={700} fill={T.muted} fontFamily={FONT.sans} text={'6 段'} opacity={0} />
        <Txt ref={segSeqs[0]} position={[-380, 120]} fontSize={20} fill={T.blue} fontFamily={FONT.mono} text={'140101×3，140102×3 → 2 段'} opacity={0} />
        <Txt ref={segSeqs[1]} position={[0, 120]} fontSize={20} fill={T.blue} fontFamily={FONT.mono} text={'32·32·69·32·32·33 → 4 段'} opacity={0} />
        <Txt ref={segSeqs[2]} position={[380, 160]} fontSize={20} fill={T.muted} fontFamily={FONT.mono} text={'7·4·3·5·9·2 → 6 段'} opacity={0} />
      </Node>
      <Node ref={winChip} position={[0, 170]} opacity={0}>
        <Rect width={480} height={56} radius={12} fill={T.card} stroke={T.green} lineWidth={2}>
          <Txt fontSize={SIZE.label} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'前几列排好序，总体赢'} />
        </Rect>
      </Node>
    </>
  );
  const W = world();
  const cam = new Cam(W);

  say('第二排序键');
  yield* beat('m10',
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
  yield* beat('m11',
    all(dateBox1().opacity(0, 0.4), dateBox2().opacity(0, 0.4)),
    at('同一天里再按产品排', all(groupBox1().opacity(1, 0.5), groupBox2().opacity(1, 0.5))),
    at('聚在了一起', all(groupChip().opacity(1, 0.5), singleLab().opacity(1, 0.5))),
    at('分组', all(funnel().opacity(1, 0.4), groupLab().opacity(1, 0.4))),
    at('过滤', filterLab().opacity(1, 0.4)),
  );

  say('同一值连成一段');
  yield* beat('m12',
    all(tab().opacity(0, 0.5), groupChip().opacity(0, 0.4), singleLab().opacity(0, 0.4), comp().opacity(1, 0.5), bigLab().opacity(1, 0.4)),
    at('帮压缩', compArrow().opacity(1, 0.5)),
    // r7 P2-2：“变小了”要有前后对比——两段长条先拉长（未压缩），再缩成短条，“变小了”随收缩出现
    at('连成很长的一段', chain(
      all(
        compCells[0]().opacity(0, 0.3), compCells[1]().opacity(0, 0.3), compCells[2]().opacity(0, 0.3),
        compCells[3]().opacity(0, 0.3), compCells[4]().opacity(0, 0.3), compCells[5]().opacity(0, 0.3),
        bar1().opacity(1, 0.4), bar2().opacity(1, 0.4),
        bar1().height(118, 0.9), bar2().height(118, 0.9),
      ),
      all(bar1().height(24, 0.9), bar2().height(24, 0.9), compSmall().opacity(1, 0.5)),
    )),
  );

  say('几十亿行 → 几 KB');
  yield* beat('m13',
    all(compArrow().opacity(0, 0.4), compSmall().opacity(0, 0.4)),
    // r5 修复：旁白加长到 16.1s 后，拍首 7.7s 无动作（推近到“游程编码”才动），定格 error。
    // 改成开拍就缓慢推近（8s，随旁白从演示表放大到真表尺度），到“游程编码”时正好到位。
    at('演示表只有 6 行', cam.focus([-90, -105], 1.4, 8.0)),
    at('游程编码', all(
      bar1().opacity(0, 0.4), bar2().opacity(0, 0.4), rle1().opacity(1, 0.5), rle2().opacity(1, 0.5), demoLab().opacity(1, 0.5))),
    at('几 KB', all(kbBlock().opacity(1, 0.5), kbLab().opacity(1, 0.5), trueArrow().opacity(1, 0.5))),
    // r10 P2-1：真表尺度推导步——“几十亿行”时亮起右上三行“值 × 几百万行”示意，箭头随“几 KB”出现
    at('几十亿行', all(bigLab().fill(T.yellow, 0.4), trueRle().opacity(1, 0.5))),
    at('第一排序键上最强', all(strongTag().opacity(1, 0.5),
      chain(rle1().scale(1.06, 0.8), rle1().scale(1, 0.5)),
      chain(rle2().scale(1.06, 0.8), rle2().scale(1, 0.5)))),
  );

  say('越往后越乱');
  yield* beat('m13b',
    all(cam.reset(1.2), comp().opacity(0, 0.5), strongTag().opacity(0, 0.4)),
    at('越来越乱', strips().opacity(1, 0.5)),
    at('第一键 2 段', segCounts[0]().opacity(1, 0.5)),
    at('第二键 4 段', segCounts[1]().opacity(1, 0.5)),
    at('第三键 6 段', segCounts[2]().opacity(1, 0.5)),
    at('基本随机', all(
      seg3[0]().fill(T.line, 0.4), seg3[1]().fill(T.line, 0.4), seg3[2]().fill(T.line, 0.4), seg3[3]().fill(T.line, 0.4),
      seg3[4]().fill(T.line, 0.4), seg3[5]().fill(T.line, 0.4),
      randomTag().opacity(1, 0.5),
    )),
    at('总体还是赢', winChip().opacity(1, 0.5)),
    // r6 QA 修复：三条值序列分步出现（原先同 cue 齐出，之后 10.6s 无动作，idle error）
    at('数一数就明白', all(segSeqs[0]().opacity(1, 0.5), chain(segCounts[0]().scale(1.08, 0.4), segCounts[0]().scale(1, 0.4)))),
    at('第二键是 32', all(segSeqs[1]().opacity(1, 0.5), chain(segCounts[1]().scale(1.08, 0.4), segCounts[1]().scale(1, 0.4)))),
    at('第三键是 7', all(segSeqs[2]().opacity(1, 0.5), chain(segCounts[2]().scale(1.08, 0.4), segCounts[2]().scale(1, 0.4)))),
    at('是 6 段', chain(segSeqs[2]().scale(1.05, 0.4), segSeqs[2]().scale(1, 0.4))),
  );
});
