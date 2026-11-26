// U15 场景 2（MC）：b8–b20 —— 两派点名、原地更新、N1 两大学派对照卡（总结小结）、随机写变顺序写。
// r7：b18 对照卡第五行左右格收窄（行标“崩溃恢复”不再被压）+ 两“日志”区分小标；b20 补因果链小标。
// 分镜：skill-ch03/beats-u15.md；原文：DDIA §3.15（书页 p103，PDF p125）；对照卡内容全部来自 §3.2–§3.5 的逐条论述。
// 时长全部来自 timeline/u15.json（beat() 驱动），不手写 waitFor。
import {Circle, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, chain, createRef} from '@motion-canvas/core';
import {at, makeBeats} from '../../lib/beats';
import {FONT, SAFE, SIZE, T} from '../../lib/theme';
import timeline from '../../timeline/u15.json';

const NAMES_CONCEPT = ['Bitcask', 'SSTable', 'LSM 树'];
const NAMES_SYSTEM = ['LevelDB', 'Cassandra', 'HBase', 'Lucene'];
// r4：七张名牌按 3+4 两排分组——上排三个概念（各加一行中文意思），下排四个系统；
// 每排上方一个组标签（“三个概念”/“拿它们搭出来的系统”），让 3+4=7 看得见、“它们”有所指。
// r3：前三张牌各加一行中文意思（与 b10a 旁白念到的两个关键名对应，Bitcask 牌上是“哈希表”）
const NAMES_GLOSS = ['哈希表', '有序字符串表', '日志结构合并树'];
const CARD_ROWS: [string, string, string][] = [
  ['写', '追加写', '原地写'],
  ['切分', '变长段', '4 KB 页'],
  ['写放大', '多次重写', '至少两次'],
  ['读', '查多段', '一键一处'],
  ['崩溃恢复', '重建、快照、恢复日志', '预写日志'],
];
const ROW_Y = [-160, -98, -36, 26, 88];

export default makeScene2D(function* (view) {
  view.fill(T.bg);
  const beat = makeBeats(timeline);

  const header = createRef<Txt>();
  const anchor = createRef<Txt>();
  const say = (text: string) => anchor().text(text);

  // b8：两派名牌
  const g8 = createRef<Node>();
  const g8left = createRef<Rect>();
  const g8right = createRef<Rect>();
  const g8dot = createRef<Circle>();

  // b9：只追加，不改写好的
  const g9 = createRef<Node>();
  const g9file = createRef<Rect>();
  const g9arrow = createRef<Line>();
  const g9arrowLab = createRef<Txt>();
  const g9old = createRef<Rect>();
  const g9lock = createRef<Txt>();

  // b10：七个名字（r4：上排 3 个概念 + 下排 4 个系统，各排一个组标签）
  const g10 = createRef<Node>();
  const g10lab1 = createRef<Txt>();
  const g10lab2 = createRef<Txt>();
  const g10chips = [0, 1, 2, 3, 4, 5, 6].map(() => createRef<Rect>());

  // b11a：原地更新名牌
  const g11a = createRef<Node>();
  const g11aPlate = createRef<Rect>();

  // b11c/b11d：磁盘是一组页，可覆盖重写
  const g11 = createRef<Node>();
  const g11disk = createRef<Rect>();
  const g11pages = [0, 1, 2, 3].map(() => createRef<Rect>());
  const g11hl = createRef<Rect>();
  const g11cover = createRef<Txt>();

  // b12：B 树
  const g12 = createRef<Node>();
  const g12card = createRef<Rect>();
  const g12rel = createRef<Rect>();
  const g12non = createRef<Rect>();

  // b13–b18：对照卡
  const g13 = createRef<Node>();
  const g13frame = createRef<Rect>();
  const g13headL = createRef<Txt>();
  const g13headR = createRef<Txt>();
  const g13tag = createRef<Txt>();
  const rowTopic = [0, 1, 2, 3, 4].map(() => createRef<Rect>());
  const rowLeft = [0, 1, 2, 3, 4].map(() => createRef<Rect>());
  const rowRight = [0, 1, 2, 3, 4].map(() => createRef<Rect>());
  // r7：b18 两“日志”区分小标（恢复日志：崩了重建时用；预写日志：改页前先写）；
  // 第五行左右格各收窄 30px（r6 帧验：行标“崩溃恢复”两端各被左右格压约 25px，纯右移会把“复”压得更死）。
  const g18why = createRef<Txt>();

  // b19/b20：随机写变顺序写（r6：顺序箭头全程绿 + 流动点三遍加速；机械盘/固态盘两牌区分）
  const g19 = createRef<Node>();
  const g19zig = [0, 1, 2].map(() => createRef<Line>());
  const g19straight = createRef<Line>();
  const g19labR = createRef<Txt>();
  const g19labS = createRef<Txt>();
  const g20flow = createRef<Circle>();
  const g20hdd = createRef<Rect>();
  const g20hddCap = createRef<Txt>();
  const g20ssd = createRef<Rect>();
  const g20ssdCap = createRef<Txt>();
  // r7：b20 因果链小标（随机写磁头来回寻道最花时间，顺序写磁头几乎不用动）。
  const g20why = createRef<Txt>();

  view.add(
    <>
      <Txt
        ref={header}
        position={[-SAFE.halfW, -SAFE.halfH]}
        offset={[-1, -1]}
        fontSize={SIZE.label}
        fill={T.muted}
        fontFamily={FONT.sans}
        text={'小结'}
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

      {/* b8 */}
      <Node ref={g8} opacity={0}>
        <Rect ref={g8left} position={[-300, -60]} width={420} height={130} radius={16} fill={T.card} stroke={T.blue} lineWidth={3}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'日志结构'} />
        </Rect>
        <Rect ref={g8right} position={[300, -60]} width={420} height={130} radius={16} fill={T.card} stroke={T.green} lineWidth={3}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'原地更新'} />
        </Rect>
        <Circle ref={g8dot} position={[0, 110]} width={22} height={22} fill={T.yellow} opacity={0} />
      </Node>

      {/* b9 */}
      <Node ref={g9} opacity={0}>
        <Rect ref={g9file} position={[0, -100]} width={700} height={120} radius={16} fill={T.card} stroke={T.blue} lineWidth={3}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'文件：只追加'} />
        </Rect>
        <Line ref={g9arrow} points={[[-560, -100], [-360, -100]]} stroke={T.blue} lineWidth={3} endArrow opacity={0} />
        <Txt ref={g9arrowLab} position={[-460, -160]} fontSize={SIZE.label} fill={T.blue} fontFamily={FONT.sans} text={'追加'} opacity={0} />
        <Rect ref={g9old} position={[280, 90]} width={340} height={70} radius={12} fill={T.card} stroke={T.red} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.red} fontFamily={FONT.sans} text={'过时文件，删掉'} />
        </Rect>
        <Txt ref={g9lock} position={[-280, 90]} fontSize={SIZE.label} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'写好的文件，绝不改动'} opacity={0} />
      </Node>

      {/* b10：上排三个概念，下排四个系统 */}
      <Node ref={g10} opacity={0}>
        <Txt ref={g10lab1} position={[0, -258]} fontSize={SIZE.label} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'三个概念'} opacity={0} />
        {NAMES_CONCEPT.map((name, i) => (
          <Rect
            key={`n1-${i}`}
            ref={g10chips[i]}
            position={[-390 + i * 390, -175]}
            width={340}
            height={96}
            radius={12}
            fill={T.card}
            stroke={T.blue}
            lineWidth={2}
            opacity={0}
          >
            <Txt position={[0, -16]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={name} />
            <Txt position={[0, 17]} fontSize={SIZE.min} fill={T.muted} fontFamily={FONT.sans} text={NAMES_GLOSS[i]} />
          </Rect>
        ))}
        <Txt ref={g10lab2} position={[0, -78]} fontSize={SIZE.label} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'拿它们搭出来的系统'} opacity={0} />
        {NAMES_SYSTEM.map((name, i) => (
          <Rect
            key={`n2-${i}`}
            ref={g10chips[3 + i]}
            position={[-435 + i * 290, 0]}
            width={260}
            height={64}
            radius={12}
            fill={T.card}
            stroke={T.blue}
            lineWidth={2}
            opacity={0}
          >
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={name} />
          </Rect>
        ))}
      </Node>

      {/* b11a */}
      <Node ref={g11a} opacity={0}>
        <Rect ref={g11aPlate} position={[0, -60]} width={480} height={130} radius={16} fill={T.card} stroke={T.green} lineWidth={3}>
          <Txt fontSize={SIZE.title} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'原地更新'} />
        </Rect>
      </Node>

      {/* b11c/b11d */}
      <Node ref={g11} opacity={0}>
        <Rect ref={g11disk} position={[0, -60]} width={860} height={220} radius={16} fill={T.card} stroke={T.blue} lineWidth={3}>
          <Txt position={[0, -88]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'磁盘'} />
        </Rect>
        {[0, 1, 2, 3].map(i => (
          <Rect
            key={`pg-${i}`}
            ref={g11pages[i]}
            position={[-315 + i * 210, -30]}
            width={180}
            height={130}
            radius={10}
            fill={T.bg}
            stroke={T.line}
            lineWidth={2}
            opacity={0}
          >
            <Txt fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'页'} />
          </Rect>
        ))}
        <Rect ref={g11hl} position={[315, -30]} width={180} height={130} radius={10} stroke={T.red} lineWidth={4} opacity={0} />
        <Txt ref={g11cover} position={[315, 130]} fontSize={SIZE.label} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'覆盖重写'} opacity={0} />
      </Node>

      {/* b12 */}
      <Node ref={g12} opacity={0}>
        <Rect ref={g12card} position={[0, -60]} width={520} height={150} radius={16} fill={T.card} stroke={T.green} lineWidth={3}>
          <Txt position={[0, -25]} fontSize={SIZE.title} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'B 树'} />
          <Txt position={[0, 40]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'最大的例子'} />
        </Rect>
        <Rect ref={g12rel} position={[-420, 130]} width={330} height={80} radius={12} fill={T.card} stroke={T.line} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'主流关系数据库'} />
        </Rect>
        <Rect ref={g12non} position={[420, 130]} width={330} height={80} radius={12} fill={T.card} stroke={T.line} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'非关系数据库'} />
        </Rect>
      </Node>

      {/* b13–b18 对照卡 */}
      <Node ref={g13} opacity={0}>
        <Rect ref={g13frame} position={[0, -55]} width={1160} height={410} radius={18} fill={T.card} stroke={T.line} lineWidth={2} opacity={0} />
        <Txt ref={g13headL} position={[-290, -225]} fontSize={SIZE.body} fontWeight={700} fill={T.blue} fontFamily={FONT.sans} text={'日志结构'} opacity={0} />
        <Txt ref={g13headR} position={[290, -225]} fontSize={SIZE.body} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'原地更新'} opacity={0} />
        <Txt ref={g13tag} position={[0, -225]} fontSize={SIZE.label} fontWeight={700} fill={T.purple} fontFamily={FONT.sans} text={'总结（小结）'} opacity={0} />
        {CARD_ROWS.map(([topic, left, right], i) => (
          <Node key={`row-${i}`}>
            <Rect ref={rowTopic[i]} position={[0, ROW_Y[i]]} width={130} height={52} radius={10} fill={T.bg} stroke={T.line} lineWidth={2} opacity={0}>
              <Txt fontSize={18} fill={T.muted} fontFamily={FONT.sans} text={topic} />
            </Rect>
            {/* r7：第五行（i=4）左右格各收窄 30px、中心外移 15px：行标“崩溃恢复”四字两端不再被压；其余行不动。 */}
            <Rect ref={rowLeft[i]} position={[i === 4 ? -305 : -290, ROW_Y[i]]} width={i === 4 ? 470 : 500} height={52} radius={10} fill={T.bg} stroke={T.blue} lineWidth={2} opacity={0}>
              <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={left} />
            </Rect>
            <Rect ref={rowRight[i]} position={[i === 4 ? 305 : 290, ROW_Y[i]]} width={i === 4 ? 470 : 500} height={52} radius={10} fill={T.bg} stroke={T.green} lineWidth={2} opacity={0}>
              <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={right} />
            </Rect>
          </Node>
        ))}
        {/* r7：b18 两“日志”区分小标——恢复日志崩了重建时用（§3.2–§3.3：重建/恢复内存表），预写日志改页前先写（§3.4：WAL）。 */}
        <Txt ref={g18why} position={[0, 135]} fontSize={20} fill={T.muted} fontFamily={FONT.sans} text={'恢复日志：崩了重建时用；预写日志：改页前先写'} opacity={0} />
      </Node>

      {/* b19/b20 */}
      <Node ref={g19} opacity={0}>
        <Line ref={g19zig[0]} points={[[-520, -160], [-320, -100], [-420, -60], [-180, -140]]} stroke={T.red} lineWidth={3} opacity={0} />
        <Line ref={g19zig[1]} points={[[-80, -160], [120, -90], [20, -60], [220, -140]]} stroke={T.red} lineWidth={3} opacity={0} />
        <Line ref={g19zig[2]} points={[[300, -160], [480, -100], [380, -60], [540, -130]]} stroke={T.red} lineWidth={3} opacity={0} />
        <Txt ref={g19labR} position={[0, -200]} fontSize={SIZE.body} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'随机写'} opacity={0} />
        <Line ref={g19straight} points={[[-520, 40], [520, 40]]} stroke={T.green} lineWidth={4} endArrow opacity={0} />
        <Txt ref={g19labS} position={[0, 100]} fontSize={SIZE.body} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'顺序写'} opacity={0} />
        <Circle ref={g20flow} position={[-480, 40]} width={20} height={20} fill={T.yellow} opacity={0} />
        <Rect ref={g20hdd} position={[-290, 190]} width={400} height={70} radius={12} fill={T.card} stroke={T.line} lineWidth={2} opacity={0}>
          <Circle position={[-155, 0]} width={46} height={46} fill={T.bg} stroke={T.muted} lineWidth={2}>
            <Circle width={12} height={12} fill={T.muted} />
          </Circle>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'机械硬盘'} />
        </Rect>
        <Txt ref={g20hddCap} position={[-290, 245]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'盘片转动，磁头寻道'} opacity={0} />
        <Rect ref={g20ssd} position={[290, 190]} width={400} height={70} radius={12} fill={T.card} stroke={T.line} lineWidth={2} opacity={0}>
          <Rect position={[-155, 0]} width={46} height={34} radius={4} fill={T.bg} stroke={T.muted} lineWidth={2}>
            <Rect position={[-12, 21]} width={6} height={8} fill={T.muted} />
            <Rect position={[0, 21]} width={6} height={8} fill={T.muted} />
            <Rect position={[12, 21]} width={6} height={8} fill={T.muted} />
          </Rect>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'固态硬盘'} />
        </Rect>
        <Txt ref={g20ssdCap} position={[290, 245]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'闪存芯片，不用寻道'} opacity={0} />
        {/* r7：b20 因果链——随机写磁头来回寻道最花时间，顺序写磁头几乎不用动（§3.4 磁头寻道、§3.5 顺序写比随机写快得多）。 */}
        <Txt ref={g20why} position={[0, 138]} fontSize={20} fill={T.text} fontFamily={FONT.sans} text={'随机写：磁头来回寻道，最花时间；顺序写：磁头几乎不用动'} opacity={0} />
      </Node>
    </>
  );

  say('两派：日志结构 / 原地更新');
  yield* beat('b8',
    all(g8().opacity(1, 0.5)),
    at('两派', g8dot().opacity(1, 0.4)),
    at('对照卡', chain(g8left().stroke(T.yellow, 0.3), g8left().stroke(T.blue, 0.3), g8right().stroke(T.yellow, 0.3), g8right().stroke(T.green, 0.3))),
  );

  say('只追加，不改写好的');
  yield* beat('b9',
    all(g8().opacity(0, 0.5), g9().opacity(1, 0.5)),
    at('追加文件', all(g9arrow().opacity(1, 0.5), g9arrowLab().opacity(1, 0.4))),
    at('删掉过时', g9old().opacity(1, 0.5)),
    at('绝不改动', g9lock().opacity(1, 0.5)),
  );

  say('七个名字：三个概念，四个系统');
  yield* beat('b10a',
    all(g9().opacity(0, 0.5), g10().opacity(1, 0.5)),
    at('上面三个', g10lab1().opacity(1, 0.3)),
    at('哈希表', g10chips[0]().opacity(1, 0.3)),
    at('有序字符串表', g10chips[1]().opacity(1, 0.3)),
    at('日志结构合并树', g10chips[2]().opacity(1, 0.3)),
  );

  say('另外四个，都在屏幕上');
  yield* beat('b10b',
    at('另外四个', chain(g10lab2().opacity(1, 0.3), g10chips[3]().opacity(1, 0.3), g10chips[4]().opacity(1, 0.3), g10chips[5]().opacity(1, 0.3), g10chips[6]().opacity(1, 0.3))),
    g10().scale(1.02, beat.dur('b10b') - 0.6),
  );

  say('原地更新');
  yield* beat('b11a',
    all(g10().opacity(0, 0.5), g11a().opacity(1, 0.5)),
    g11a().scale(1.02, beat.dur('b11a') - 0.6),
  );

  say('磁盘是一组页');
  yield* beat('b11c',
    all(g11a().opacity(0, 0.5), g11().opacity(1, 0.5)),
    chain(g11pages[0]().opacity(1, 0.3), g11pages[1]().opacity(1, 0.3), g11pages[2]().opacity(1, 0.3), g11pages[3]().opacity(1, 0.3)),
  );

  say('每页可覆盖重写');
  yield* beat('b11d',
    at('覆盖重写', all(g11hl().opacity(1, 0.4), g11cover().opacity(1, 0.4))),
  );

  say('B 树：最大的例子');
  yield* beat('b12',
    all(g11().opacity(0, 0.5), g12().opacity(1, 0.5)),
    at('主流关系数据库', g12rel().opacity(1, 0.5)),
    at('非关系数据库', g12non().opacity(1, 0.5)),
  );

  say('总结（小结）对照卡');
  yield* beat('b13',
    all(g12().opacity(0, 0.5), g13().opacity(1, 0.5), g13frame().opacity(1, 0.5),
      g13headL().opacity(1, 0.4), g13headR().opacity(1, 0.4)),
    at('对照卡', g13tag().opacity(1, 0.5)),
  );

  say('追加写 / 原地写');
  yield* beat('b14',
    all(rowTopic[0]().opacity(1, 0.4)),
    at('追加写', rowLeft[0]().opacity(1, 0.4)),
    at('原地写', rowRight[0]().opacity(1, 0.4)),
  );

  say('变长段 / 4 KB 页');
  yield* beat('b15',
    all(rowTopic[1]().opacity(1, 0.4)),
    at('变长的段', rowLeft[1]().opacity(1, 0.4)),
    at('固定大小的页', rowRight[1]().opacity(1, 0.4)),
  );

  say('多次重写 / 至少两次');
  yield* beat('b16',
    all(rowTopic[2]().opacity(1, 0.4)),
    at('多次重写', rowLeft[2]().opacity(1, 0.4)),
    at('至少要写两次', rowRight[2]().opacity(1, 0.4)),
  );

  say('查多段 / 一键一处');
  yield* beat('b17',
    all(rowTopic[3]().opacity(1, 0.4)),
    at('查好几段', rowLeft[3]().opacity(1, 0.4)),
    at('只出现一处', rowRight[3]().opacity(1, 0.4)),
  );

  say('重建、快照、恢复日志 / 预写日志');
  yield* beat('b18',
    all(rowTopic[4]().opacity(1, 0.4)),
    at('快照', rowLeft[4]().opacity(1, 0.4)),
    at('预写日志', rowRight[4]().opacity(1, 0.4)),
    at('预写日志', g18why().opacity(1, 0.4)),
  );

  say('随机写 → 顺序写');
  yield* beat('b19',
    all(g13().opacity(0, 0.5), g19().opacity(1, 0.5)),
    at('随机写', chain(g19zig[0]().opacity(1, 0.4), g19zig[1]().opacity(1, 0.4), g19zig[2]().opacity(1, 0.4), g19labR().opacity(1, 0.4))),
    at('顺序写', chain(g19straight().opacity(1, 0.5), g19labS().opacity(1, 0.4))),
  );

  say('写吞吐上去了');
  yield* beat('b20',
    // 顺序箭头全程保持绿色（r5 的变黄已去掉）；流动点沿线跑三遍，一遍比一遍快。
    // r7：因果链小标与流动点同时出现（“写吞吐”一到即亮）。
    at('写吞吐', g20why().opacity(1, 0.4)),
    at('写吞吐', chain(
      g20flow().opacity(1, 0.3),
      g20flow().position([520, 40], 2.0),
      g20flow().position([-480, 40], 0.05),
      g20flow().position([520, 40], 1.3),
      g20flow().position([-480, 40], 0.05),
      g20flow().position([520, 40], 0.8),
      g20flow().opacity(0, 0.3),
    )),
    at('机械硬盘', all(g20hdd().opacity(1, 0.5), g20hddCap().opacity(1, 0.4))),
    at('固态硬盘', all(g20ssd().opacity(1, 0.5), g20ssdCap().opacity(1, 0.4))),
    g19().scale(1.02, beat.dur('b20') - 0.6),
  );
});
