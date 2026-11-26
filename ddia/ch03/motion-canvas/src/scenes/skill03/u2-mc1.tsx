// U2 场景 1（MC）：b0–b13 —— b0 单元站牌（UnitTitle：第 2 站），b1 钩子、键值背景、哈希索引、原图 3-1（字节格日志 + 哈希表）、
// Bitcask、猫视频例子。分镜：skill-ch03/beats-u2.md；原文：DDIA §3.2（书页 p72–73，PDF p94–95）。
// 原图 3-1 按处置“改编”：字节格 5 行 × 30 格、标尺 0/10/…/120、123456 → 0、42 → 64 均按原图重新生成。
// 布局避让：箭头走左 margin、不穿格子文字；标尺数字与行间距留白；新记录牌在后续拍淡出。
// 时长全部来自 timeline/u2.json（beat() 驱动），不手写 waitFor。
import {Circle, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, chain, createRef} from '@motion-canvas/core';
import {at, makeBeats} from '../../lib/beats';
import {UnitTitle} from '../../lib/opening';
import {CHAPTER} from '../../lib/chapter';
import {FONT, SAFE, SIZE, T} from '../../lib/theme';
import timeline from '../../timeline/u2.json';

// 原图 3-1 的字节格（5 行，每行 30 格；换行只占一格，画成 "\n" 两字一格）。
// 逐格核对过原图：行 1 字节 0–29、行 2 字节 30–59（以 c 开头、e 结尾）、行 3 字节 60–89
// （" ] } \n 4 2 …，42 的记录从字节 64 开始）、行 4 字节 90–119、行 5 字节 120–128；
// 文件共 129 字节（63+1+64+1），新记录写在字节 129。r4 修正：r3 把 \n 画成两格、
// 行 2 漏了 c、e 两格，导致高亮落在 n 格上、129 写成 130。
const ROWS: string[][] = [
  [...'123456,{"name":"London","attra'],
  [...'ctions":["Big Ben","London Eye'],
  ['"', ']', '}', '\\n', '4', '2', ',', '{', '"', 'n', 'a', 'm', 'e', '"', ':', '"', 'S', 'a', 'n', ' ', 'F', 'r', 'a', 'n', 'c', 'i', 's', 'c', 'o', '"'],
  [...',"attractions":["Golden Gate B'],
  ['r', 'i', 'd', 'g', 'e', '"', ']', '}', '\\n'],
];
const ROW_Y = [-148, -104, -60, -16, 28];
const CELL_W = 36;
const CELL_H = 26;
const GRID_X0 = -540;
const RULER: [number, string][] = [
  [0, '0'], [10, '10'], [20, '20'], [30, '30'], [40, '40'], [50, '50'],
  [60, '60'], [70, '70'], [80, '80'], [90, '90'], [100, '100'], [110, '110'], [120, '120'],
];
const cellX = (idx: number) => GRID_X0 + CELL_W / 2 + idx * CELL_W;
const rulerX = (byte: number) => cellX(byte % 30);

export default makeScene2D(function* (view) {
  view.fill(T.bg);
  const beat = makeBeats(timeline);

  // 单元站牌（b0）：这一站在全章的位置 + 单元标题；b1 开头收成左上角页眉。
  // 页眉与场景原有的左上角标题同一位置同一样式，旧 header 已删，改由 unit.header 承担。
  const unit = new UnitTitle(CHAPTER, 'u2');

  const anchor = createRef<Txt>();
  const say = (text: string) => anchor().text(text);

  const g1 = createRef<Node>();
  const g1log = createRef<Rect>();
  const g1dot = createRef<Circle>();
  const g1q = createRef<Txt>();
  const g2 = createRef<Node>();
  const g2kv = createRef<Rect>();
  const g2more = [0, 1].map(() => createRef<Rect>());
  const g3 = createRef<Node>();
  const g3dict = createRef<Rect>();
  const g3tag = createRef<Txt>();
  const g3detail = createRef<Txt>();

  // 原图 3-1：内存哈希表 + 字节格日志
  const fig = createRef<Node>();
  const memBox = createRef<Rect>();
  const memTitle = createRef<Txt>();
  const tabHeadKey = createRef<Txt>();
  const tabHeadOff = createRef<Txt>();
  const tabRow1K = createRef<Txt>();
  const tabRow1V = createRef<Txt>();
  const tabRow2K = createRef<Txt>();
  const tabRow2V = createRef<Txt>();
  const tabRow3 = createRef<Node>();
  const gridRows = [0, 1, 2, 3, 4].map(() => createRef<Node>());
  const rulers = createRef<Node>();
  const arrow0 = createRef<Line>();
  const arrow64 = createRef<Line>();
  const hl0 = createRef<Rect>();
  const hl64 = createRef<Rect>();
  const newChip = createRef<Rect>();
  const oldLab = createRef<Txt>();
  const flipCard = createRef<Node>();
  const flipOld = createRef<Txt>();
  const flipArrow = createRef<Txt>();
  const flipNew = createRef<Txt>();
  const valChip = createRef<Rect>();
  const b6dot = createRef<Circle>();

  const g9 = createRef<Node>();
  const g9plate = createRef<Rect>();
  const g9lab = createRef<Txt>();
  const g10 = createRef<Node>();
  const g10fill = createRef<Rect>();
  const g10vals = [0, 1, 2].map(() => createRef<Rect>());
  const g11 = createRef<Node>();
  const g11dot = createRef<Circle>();
  const g11seek = createRef<Line>();
  const g11cache = createRef<Txt>();
  const g11zero = createRef<Txt>();
  const cacheDef = createRef<Txt>();
  const g12 = createRef<Node>();
  const catCards = [0, 1, 2, 3].map(() => createRef<Rect>());
  const catCounts = [0, 1, 2, 3].map(() => createRef<Txt>());
  const catNames = ['mew', 'purr', 'yawn', 'scratch'];
  const catVals = ['1078', '2103', '511', '252'];
  const g13 = createRef<Node>();
  const g13lab = createRef<Txt>();
  const bridgeLab = createRef<Txt>();

  view.add(
    <>
      {unit.nodes()}
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

      {/* b1：长日志 + 扫描线 */}
      <Node ref={g1} opacity={0}>
        <Rect ref={g1log} position={[0, -60]} width={1000} height={70} radius={12} fill={T.card} stroke={T.line} lineWidth={2}>
          <Txt fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'键值对日志：越写越长'} />
        </Rect>
        <Circle ref={g1dot} position={[-480, -60]} width={24} height={24} fill={T.yellow} />
        <Txt ref={g1q} position={[0, 80]} fontSize={72} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'?'} opacity={0} />
      </Node>

      {/* b2：键值积木 */}
      <Node ref={g2} opacity={0}>
        <Rect ref={g2kv} position={[-260, -60]} width={300} height={140} radius={16} fill={T.card} stroke={T.blue} lineWidth={3}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'键值数据'} />
        </Rect>
        {[0, 1].map(i => (
          <Rect
            key={`g2m-${i}`}
            ref={g2more[i]}
            position={[280, -130 + i * 140]}
            width={360}
            height={110}
            radius={16}
            fill={T.card}
            stroke={T.line}
            lineWidth={2}
            opacity={0}
          >
            <Txt fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={['更复杂的索引', '都从它长出来'][i]} />
          </Rect>
        ))}
      </Node>

      {/* b3：字典卡 */}
      <Node ref={g3} opacity={0}>
        <Rect ref={g3dict} position={[0, -60]} width={520} height={220} radius={20} fill={T.card} stroke={T.blue} lineWidth={3}>
          <Txt position={[0, -60]} fontSize={SIZE.title} fontWeight={700} fill={T.text} fontFamily={FONT.serif} text={'字典'} />
          <Txt position={[0, 20]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'多数编程语言里都有'} />
        </Rect>
        <Txt ref={g3tag} position={[0, 70]} fontSize={SIZE.body} fontWeight={700} fill={T.yellow} fontFamily={FONT.mono} text={'哈希表'} opacity={0} />
        <Txt ref={g3detail} position={[0, 170]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'哈希表本身的细节，这里不展开'} opacity={0} />
      </Node>

      {/* 原图 3-1 */}
      <Node ref={fig} opacity={0}>
        <Rect ref={memBox} position={[0, -250]} width={480} height={130} radius={16} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt ref={memTitle} position={[0, -42]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'内存里的哈希表'} opacity={0} />
          <Txt ref={tabHeadKey} position={[-110, -10]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'键'} opacity={0} />
          <Txt ref={tabHeadOff} position={[110, -10]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'字节偏移'} opacity={0} />
          <Txt ref={tabRow1K} position={[-110, 22]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'123456'} opacity={0} />
          <Txt ref={tabRow1V} position={[110, 22]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'0'} opacity={0} />
          <Txt ref={tabRow2K} position={[-110, 52]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'42'} opacity={0} />
          <Txt ref={tabRow2V} position={[110, 52]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'64'} opacity={0} />
        </Rect>
        <Node ref={tabRow3} opacity={0}>
          <Txt position={[-110, -172]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.mono} text={'999'} />
          <Txt position={[110, -172]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.mono} text={'129'} />
        </Node>
        {ROWS.map((cells, r) => (
          <Node key={`grid-${r}`} ref={gridRows[r]} opacity={0}>
            {cells.map((ch, i) => (
              <Rect
                key={`c-${r}-${i}`}
                position={[cellX(i), ROW_Y[r]]}
                width={CELL_W}
                height={CELL_H}
                stroke={T.line}
                lineWidth={1}
              >
                <Txt fontSize={15} fill={T.text} fontFamily={FONT.mono} text={ch === ' ' ? '' : ch} />
              </Rect>
            ))}
          </Node>
        ))}
        <Node ref={rulers} opacity={0}>
          {RULER.map(([byte, lab]) => (
            <Txt
              key={`rul-${byte}`}
              position={[rulerX(byte), ROW_Y[Math.floor(byte / 30)] + 22]}
              fontSize={13}
              fill={T.muted}
              fontFamily={FONT.mono}
              text={lab}
            />
          ))}
        </Node>
        <Line
          ref={arrow0}
          points={[[-200, -185], [-545, -148]]}
          stroke={T.yellow}
          lineWidth={3}
          endArrow
          opacity={0}
        />
        <Line
          ref={arrow64}
          points={[[100, -185], [-378, -185], [-378, -80]]}
          stroke={T.yellow}
          lineWidth={3}
          endArrow
          opacity={0}
        />
        <Rect ref={hl0} position={[cellX(0), ROW_Y[0]]} width={CELL_W + 2} height={CELL_H + 2} stroke={T.yellow} lineWidth={3} opacity={0} />
        <Rect ref={hl64} position={[cellX(4), ROW_Y[2]]} width={CELL_W + 2} height={CELL_H + 2} stroke={T.yellow} lineWidth={3} opacity={0} />
        <Rect ref={newChip} position={[0, 110]} width={420} height={54} radius={12} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.green} fontFamily={FONT.mono} text={'999, 新记录 → 字节 129'} />
        </Rect>
        <Txt ref={oldLab} position={[0, 170]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'旧值还留在文件里，等压缩再清'} opacity={0} />
        {/* b7 改旧键是另一例：小卡片“另一例：改旧键 42”——42 的偏移 64 翻成 129（64 变灰）；
            主表保持 42 → 64 不动，下一拍 b8 查 42 仍跳字节 64；翻转借用同一条追加记录的位置 129 作示意；
            下方小字“旧值还留在文件里，等压缩再清”只属于改旧键这一例，b8 开头淡出 */}
        <Node ref={flipCard} opacity={0}>
          <Rect position={[400, 110]} width={340} height={100} radius={14} fill={T.card} stroke={T.yellow} lineWidth={2}>
            <Txt position={[0, -28]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'另一例：改旧键 42'} />
            <Txt ref={flipOld} position={[-70, 18]} fontSize={SIZE.title} fontWeight={700} fill={T.text} fontFamily={FONT.mono} text={'64'} />
            <Txt ref={flipArrow} position={[0, 18]} fontSize={SIZE.title} fontWeight={700} fill={T.text} fontFamily={FONT.mono} text={'→'} opacity={0} />
            <Txt ref={flipNew} position={[75, 18]} fontSize={SIZE.title} fontWeight={700} fill={T.green} fontFamily={FONT.mono} text={'129'} opacity={0} />
          </Rect>
        </Node>
        <Rect ref={valChip} position={[410, -230]} width={330} height={90} radius={14} fill={T.card} stroke={T.yellow} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'旧金山的记录'} />
        </Rect>
        <Circle ref={b6dot} position={[-200, -185]} width={20} height={20} fill={T.yellow} opacity={0} />
      </Node>

      {/* b9：Bitcask 名牌 */}
      <Node ref={g9} opacity={0}>
        <Rect ref={g9plate} position={[390, -240]} width={300} height={80} radius={14} fill={T.card} stroke={T.purple} lineWidth={2}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.purple} fontFamily={FONT.mono} text={'Bitcask'} />
        </Rect>
        <Txt ref={g9lab} position={[390, -180]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'Riak 默认的存储引擎'} opacity={0} />
      </Node>

      {/* b10：内存撑满，值留在磁盘 */}
      <Node ref={g10} opacity={0}>
        <Rect ref={g10fill} position={[0, -250]} width={480} height={130} radius={16} stroke={T.yellow} lineWidth={3} opacity={0} />
        {[0, 1, 2].map(i => (
          <Rect
            key={`g10v-${i}`}
            ref={g10vals[i]}
            position={[-360 + i * 360, 130]}
            width={300}
            height={70}
            radius={12}
            fill={T.card}
            stroke={T.line}
            lineWidth={2}
            opacity={0}
          >
            <Txt fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'值可以很大'} />
          </Rect>
        ))}
      </Node>

      {/* b11：一次磁盘定位 / 缓存零次 */}
      <Node ref={g11} opacity={0}>
        <Line ref={g11seek} points={[[-200, -185], [-560, -185], [-560, -60]]} stroke={T.blue} lineWidth={3} opacity={0} />
        <Circle ref={g11dot} position={[-200, -185]} width={26} height={26} fill={T.blue} opacity={0} />
        <Txt ref={g11cache} position={[0, 150]} fontSize={SIZE.body} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'在缓存里'} opacity={0} />
        <Txt ref={g11zero} position={[0, 210]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} text={'磁盘读写一次都不用'} opacity={0} />
        <Txt ref={cacheDef} position={[0, 240]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'缓存：操作系统留在内存里的文件内容'} opacity={0} />
      </Node>

      {/* b12/b13：猫视频计数 */}
      <Node ref={g12} opacity={0}>
        {[0, 1, 2, 3].map(i => (
          <Rect
            key={`cat-${i}`}
            ref={catCards[i]}
            position={[-450 + i * 300, -60]}
            width={260}
            height={190}
            radius={16}
            fill={T.card}
            stroke={T.blue}
            lineWidth={2}
            opacity={0}
          >
            <Txt position={[0, -55]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.mono} text={catNames[i]} />
            <Txt ref={catCounts[i]} position={[0, 25]} fontSize={SIZE.title} fontWeight={700} fill={T.yellow} fontFamily={FONT.mono} text={catVals[i]} opacity={0} />
            <Txt position={[0, 70]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'播放次数'} />
          </Rect>
        ))}
      </Node>
      <Node ref={g13} opacity={0}>
        <Txt ref={g13lab} position={[0, 130]} fontSize={SIZE.body} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'写很多，键只有 4 个'} opacity={0} />
      </Node>
      <Txt ref={bridgeLab} position={[0, 200]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'mew 这些名字，就是视频的标识'} opacity={0} />
    </>
  );

  // b0：单元站牌（演示拍，念完留 0.8s）
  yield* beat('b0', unit.enter());

  say('不用扫全文件？');
  yield* beat('b1',
    unit.toHeader(),
    all(g1().opacity(1, 0.5)),
    chain(g1dot().position([480, -60], 1.8), g1q().opacity(1, 0.4)),
  );

  say('键值：常见构件');
  yield* beat('b2',
    all(g1().opacity(0, 0.5), g2().opacity(1, 0.5)),
    at('键值数据', g2kv().opacity(1, 0.5)),
    at('更复杂索引', chain(g2more[0]().opacity(1, 0.5), g2more[1]().opacity(1, 0.5))),
  );

  say('像字典，用哈希表');
  yield* beat('b3',
    all(g2().opacity(0, 0.5), g3().opacity(1, 0.5)),
    at('哈希表', g3tag().opacity(1, 0.5)),
    at('不展开', g3detail().opacity(1, 0.5)),
  );

  say('键 → 字节偏移');
  yield* beat('b4',
    all(g3().opacity(0, 0.5), fig().opacity(1, 0.5)),
    at('内存', all(memBox().opacity(1, 0.5), memTitle().opacity(1, 0.4))),
    at('哈希表', all(tabHeadKey().opacity(1, 0.4), tabHeadOff().opacity(1, 0.4))),
    at('字节偏移', tabHeadOff().fill(T.yellow, 0.4)),
  );

  say('内存表');
  yield* beat('b5a',
    all(tabRow1K().opacity(1, 0.4), tabRow1V().opacity(1, 0.4), tabRow2K().opacity(1, 0.4), tabRow2V().opacity(1, 0.4)),
  );

  say('磁盘文件');
  yield* beat('b5b',
    chain(
      gridRows[0]().opacity(1, 0.4),
      gridRows[1]().opacity(1, 0.4),
      gridRows[2]().opacity(1, 0.4),
      gridRows[3]().opacity(1, 0.4),
      gridRows[4]().opacity(1, 0.4),
    ),
  );

  say('每格一个字节');
  yield* beat('b5c',
    all(rulers().opacity(1, 0.6)),
  );

  say('123456 → 0，42 → 64 · 偏移指记录开头');
  yield* beat('b6',
    all(fig().scale(1.02, beat.dur('b6'))),
    at('一二三四五六', all(arrow0().opacity(1, 0.5), hl0().opacity(1, 0.4), ...gridRows.map(r => r().opacity(0.25, 0.5)))),
    at('四十二', all(arrow64().opacity(1, 0.5), hl64().opacity(1, 0.4))),
    at('值就写在记录里', chain(hl64().scale(1.08, 0.8), hl64().scale(1, 0.8))),
    at('箭头从表里指向', chain(b6dot().opacity(1, 0.4), b6dot().position([-522, -165], 2.0))),
  );

  say('追加写，顺手改表');
  yield* beat('b7',
    all(...gridRows.map(r => r().opacity(1, 0.5)), fig().scale(1.04, beat.dur('b7'))),
    at('追加', newChip().opacity(1, 0.5)),
    at('改成刚写下的位置', tabRow3().opacity(1, 0.5)),
    at('表里新添一行', newChip().position([0, 100], 1.2)),
    at('另一例，改旧键', flipCard().opacity(1, 0.5)),
    at('翻成一百二十九', chain(flipOld().fill(T.muted, 0.4), flipArrow().opacity(1, 0.4), flipNew().opacity(1, 0.4))),
    at('旧值还留在文件里', oldLab().opacity(1, 0.5)),
    at('等压缩时再清掉', oldLab().scale(1.06, 0.8)),
  );

  say('查表 → 跳过去 → 读值');
  yield* beat('b8',
    all(flipCard().opacity(0, 0.4), oldLab().opacity(0, 0.4)),
    at('表里找到偏移', all(tabRow2K().fill(T.yellow, 0.4), tabRow2V().fill(T.yellow, 0.4))),
    at('跳到那个位置', all(hl64().lineWidth(5, 0.4), valChip().opacity(1, 0.5))),
    at('读出来', valChip().stroke(T.green, 0.4)),
  );

  say('Bitcask 用的就是它');
  yield* beat('b9',
    all(g9().opacity(1, 0.5), valChip().opacity(0, 0.4), oldLab().opacity(0, 0.4), arrow0().opacity(0, 0.4), arrow64().opacity(0, 0.4), hl0().opacity(0, 0.4), hl64().opacity(0, 0.4)),
    at('Riak', g9lab().opacity(1, 0.5)),
  );

  say('键全进内存');
  yield* beat('b10a',
    all(g10().opacity(1, 0.5), g10fill().opacity(1, 0.5), newChip().opacity(0, 0.4), tabRow3().opacity(0, 0.4)),
    at('放进内存', chain(g10vals[0]().opacity(1, 0.5), g10vals[1]().opacity(1, 0.5), g10vals[2]().opacity(1, 0.5))),
  );

  say('表整个在内存里');
  yield* beat('b10b',
    all(g9().opacity(0, 0.4), g10vals[0]().opacity(0.35, 0.5), g10vals[1]().opacity(0.35, 0.5), g10vals[2]().opacity(0.35, 0.5)),
  );

  say('在缓存里：零次；不在：一次定位');
  yield* beat('b11',
    all(g10().opacity(0, 0.5), g11().opacity(1, 0.5), g11().scale(1.02, beat.dur('b11'))),
    at('关键先看要读的那部分', g11dot().opacity(1, 0.4)),
    at('在缓存里磁盘读写一次都不用', all(g11dot().fill(T.green, 0.4), g11cache().opacity(1, 0.5), g11zero().opacity(1, 0.5))),
    at('不在缓存里，就一次磁盘定位', chain(g11dot().fill(T.blue, 0.4), g11seek().opacity(1, 0.5), g11dot().position([-560, -185], 1.2), g11dot().position([-560, -60], 1.6))),
    at('缓存就是操作系统', chain(cacheDef().opacity(1, 0.5), g11dot().scale(1.18, 1.4), g11dot().scale(1, 1.4), g11dot().scale(1.18, 1.4), g11dot().scale(1, 1.4), g11dot().scale(1.18, 1.4), g11dot().scale(1, 1.4))),
  );

  say('键是视频，值是次数');
  yield* beat('b12',
    all(g11().opacity(0, 0.5), fig().opacity(0, 0.5), g12().opacity(1, 0.5)),
    at('猫视频', chain(catCards[0]().opacity(1, 0.4), catCards[1]().opacity(1, 0.4), catCards[2]().opacity(1, 0.4), catCards[3]().opacity(1, 0.4))),
    at('播放次数', chain(catCounts[0]().opacity(1, 0.4), catCounts[1]().opacity(1, 0.4), catCounts[2]().opacity(1, 0.4), catCounts[3]().opacity(1, 0.4))),
    at('mew 这些名字', bridgeLab().opacity(1, 0.5)),
  );

  say('写多，键少');
  yield* beat('b13',
    all(g13().opacity(1, 0.5)),
    at('写很多', chain(catCounts[0]().fill(T.green, 0.3), catCounts[0]().fill(T.yellow, 0.3), catCounts[1]().fill(T.green, 0.3), catCounts[1]().fill(T.yellow, 0.3))),
    at('放得进内存', g13lab().opacity(1, 0.5)),
  );
});
