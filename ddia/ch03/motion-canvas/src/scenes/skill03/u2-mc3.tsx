// U2 场景 3（MC）：b25–b32b —— 实现细节：文件格式、墓碑删除、崩溃恢复、半截记录、并发控制。
// 分镜：skill-ch03/beats-u2.md；原文：DDIA §3.2（书页 p74–75，PDF p96–97）。
// 时长全部来自 timeline/u2.json（beat() 驱动），不手写 waitFor。
import {Circle, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, chain, createRef} from '@motion-canvas/core';
import {at, makeBeats} from '../../lib/beats';
import {tag} from '../../lib/schemas';
import {FONT, SAFE, SIZE, T} from '../../lib/theme';
import timeline from '../../timeline/u2.json';

export default makeScene2D(function* (view) {
  view.fill(T.bg);
  const beat = makeBeats(timeline);

  const header = createRef<Txt>();
  const anchor = createRef<Txt>();
  const say = (text: string) => anchor().text(text);
  // 深度延伸角标：b28 墓碑去留、b30 快照存的时机与补读是原文之外的延伸内容
  const extTag = tag([-580, -255], '延伸 · 原文之外', [-1, 0]);

  const g1 = createRef<Node>();
  const csvLine = createRef<Rect>();
  const csvX = createRef<Txt>();
  const escLab = createRef<Txt>();
  const g2 = createRef<Node>();
  const lenBox = createRef<Rect>();
  const rawBox = createRef<Rect>();
  const valLab = createRef<Txt>();
  const valStrLab = createRef<Txt>();
  const valLenBox = createRef<Rect>();
  const valRawBox = createRef<Rect>();
  const g3 = createRef<Node>();
  const fileCells = [0, 1, 2].map(() => createRef<Rect>());
  const tomb = createRef<Rect>();
  const tombLab = createRef<Txt>();
  const lookArrow = createRef<Line>();
  const notFoundLab = createRef<Txt>();
  const dropLab = createRef<Txt>();
  const tombGoneLab = createRef<Txt>();
  const g4 = createRef<Node>();
  const memBox = createRef<Rect>();
  const memTab = createRef<Txt>();
  const fileBar = createRef<Rect>();
  const scanDot = createRef<Circle>();
  const progBar = createRef<Rect>();
  const slowLab = createRef<Txt>();
  const snap = createRef<Rect>();
  const snapLab = createRef<Txt>();
  const snapWhenLab = createRef<Txt>();
  const unsealedLab = createRef<Txt>();
  const g5 = createRef<Node>();
  const recLeft = createRef<Rect>();
  const recRight = createRef<Rect>();
  const sumBadge = createRef<Rect>();
  const sumX = createRef<Txt>();
  const dmgLab = createRef<Txt>();
  const tailLab = createRef<Txt>();
  const g6 = createRef<Node>();
  const writerBox = createRef<Rect>();
  const segBox = createRef<Rect>();
  const readerBoxes = [0, 1, 2].map(() => createRef<Rect>());
  const wArrow = createRef<Line>();
  const wLab = createRef<Txt>();
  const rArrows = [0, 1, 2].map(() => createRef<Line>());
  const rLab = createRef<Txt>();

  view.add(
    <>
      <Txt
        ref={header}
        position={[-SAFE.halfW, -SAFE.halfH]}
        offset={[-1, -1]}
        fontSize={SIZE.label}
        fill={T.muted}
        fontFamily={FONT.sans}
        text={'哈希索引：键就是地址'}
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
      {extTag}

      {/* b25：逗号分隔的文本 */}
      <Node ref={g1} opacity={0}>
        <Rect ref={csvLine} position={[0, -60]} width={1000} height={80} radius={12} fill={T.card} stroke={T.line} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.mono} text={'mew,1078,purr,2103,mew,1079,…'} />
        </Rect>
        <Txt ref={csvX} position={[0, 60]} fontSize={64} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'✗'} opacity={0} />
        <Txt ref={escLab} position={[0, 140]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'值里有逗号、换行 → 加引号、双写引号'} opacity={0} />
      </Node>

      {/* b26：二进制格式：长度 + 原串 */}
      <Node ref={g2} opacity={0}>
        <Rect ref={lenBox} position={[-260, -60]} width={300} height={140} radius={16} fill={T.card} stroke={T.blue} lineWidth={3} opacity={0}>
          <Txt position={[0, -45]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'长度'} />
          <Txt position={[0, 15]} fontSize={SIZE.title} fontWeight={700} fill={T.text} fontFamily={FONT.mono} text={'3'} />
        </Rect>
        <Rect ref={rawBox} position={[260, -60]} width={300} height={140} radius={16} fill={T.card} stroke={T.green} lineWidth={3} opacity={0}>
          <Txt position={[0, -45]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'原始字符串'} />
          <Txt position={[0, 15]} fontSize={SIZE.title} fontWeight={700} fill={T.text} fontFamily={FONT.mono} text={'mew'} />
        </Rect>
        <Txt ref={valLab} position={[0, 70]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'值也一样：长度 + 原串'} opacity={0} />
        {/* b26b 第二组框：值的长度加原串（值 1082：长度 4 + 原串 1082） */}
        <Rect ref={valLenBox} position={[-260, 170]} width={300} height={110} radius={16} fill={T.card} stroke={T.blue} lineWidth={3} opacity={0}>
          <Txt position={[0, -32]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'长度'} />
          <Txt position={[0, 12]} fontSize={SIZE.title} fontWeight={700} fill={T.text} fontFamily={FONT.mono} text={'4'} />
        </Rect>
        <Rect ref={valRawBox} position={[260, 170]} width={300} height={110} radius={16} fill={T.card} stroke={T.green} lineWidth={3} opacity={0}>
          <Txt position={[0, -32]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'原始字符串'} />
          <Txt position={[0, 12]} fontSize={SIZE.title} fontWeight={700} fill={T.text} fontFamily={FONT.mono} text={'1082'} />
        </Rect>
        {/* b26b r6：值框组旁的“当字符串存”标签——数字 1082 先转成字符串再存 */}
        <Txt ref={valStrLab} position={[500, 170]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} text={'当字符串存'} opacity={0} />
      </Node>

      {/* b27/b28：墓碑 */}
      <Node ref={g3} opacity={0}>
        {[0, 1, 2].map(i => (
          <Rect
            key={`fc-${i}`}
            ref={fileCells[i]}
            position={[-360 + i * 360, -80]}
            width={320}
            height={90}
            radius={12}
            fill={T.card}
            stroke={T.blue}
            lineWidth={2}
            opacity={0}
          >
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={['mew:1078', 'mew:1082', 'purr:2108'][i]} />
          </Rect>
        ))}
        {/* b27：墓碑追加在文件尾、最右（最新）位置；一根从新到旧的查表箭头从右向左扫过三张记录卡 */}
        <Rect ref={tomb} position={[360, 60]} width={360} height={90} radius={12} fill={T.card} stroke={T.red} lineWidth={3} opacity={0}>
          <Txt fontSize={SIZE.label} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'删除 mew'} />
        </Rect>
        <Line ref={lookArrow} points={[[520, -20], [-520, -20]]} stroke={T.yellow} lineWidth={3} endArrow opacity={0} />
        <Txt ref={tombLab} position={[0, 140]} fontSize={SIZE.label} fill={T.red} fontFamily={FONT.sans} text={'墓碑：追加的删除记录，写在最后面'} opacity={0} />
        <Txt ref={notFoundLab} position={[0, 175]} fontSize={SIZE.label} fill={T.red} fontFamily={FONT.sans} text={'查到墓碑 = 不存在'} opacity={0} />
        <Txt ref={dropLab} position={[0, 200]} fontSize={SIZE.body} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'合并时，旧值一起丢掉'} opacity={0} />
        <Txt ref={tombGoneLab} position={[0, 240]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'旧值清掉后，墓碑自己也可以丢掉'} opacity={0} />
      </Node>

      {/* b29/b30：崩溃恢复 */}
      <Node ref={g4} opacity={0}>
        <Rect ref={memBox} position={[0, -200]} width={480} height={130} radius={16} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt ref={memTab} position={[0, 0]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'内存哈希表'} opacity={0} />
        </Rect>
        <Rect ref={fileBar} position={[0, -40]} width={1000} height={70} radius={12} fill={T.card} stroke={T.line} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'段文件：从头读到尾'} />
        </Rect>
        <Rect ref={progBar} position={[-500, 40]} offset={[-1, 0]} width={10} height={26} radius={13} fill={T.yellow} opacity={0} />
        <Circle ref={scanDot} position={[-480, -80]} width={24} height={24} fill={T.yellow} opacity={0} />
        <Txt ref={slowLab} position={[0, 130]} fontSize={SIZE.body} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'段大了，很慢，重启很痛苦'} opacity={0} />
        <Rect ref={snap} position={[360, -200]} width={300} height={130} radius={16} fill={T.card} stroke={T.green} lineWidth={3} opacity={0}>
          <Txt fontSize={SIZE.label} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'快照在磁盘上'} />
        </Rect>
        <Txt ref={snapLab} position={[0, 200]} fontSize={SIZE.body} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'从快照加载，快得多'} opacity={0} />
        <Txt ref={snapWhenLab} position={[0, 240]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'快照在段封起来时存'} opacity={0} />
        <Txt ref={unsealedLab} position={[0, 130]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'还没封起来的段没有快照，从头读一遍'} opacity={0} />
      </Node>

      {/* b31：半截记录 */}
      <Node ref={g5} opacity={0}>
        <Rect ref={recLeft} position={[-260, -60]} width={440} height={90} radius={12} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'记录前半'} />
        </Rect>
        <Rect ref={recRight} position={[260, -60]} width={440} height={90} radius={12} fill={T.card} stroke={T.red} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.red} fontFamily={FONT.mono} text={'写到一半断了'} />
        </Rect>
        {/* b31：校验和框贴在记录条上（跟着记录一起存，不宣称具体字节位置） */}
        <Rect ref={sumBadge} position={[0, -60]} width={200} height={70} radius={14} fill={T.card} stroke={T.yellow} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'校验和'} />
        </Rect>
        <Txt ref={sumX} position={[140, -60]} fontSize={48} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'✗'} opacity={0} />
        <Txt ref={dmgLab} position={[0, 150]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'损坏的部分被发现，忽略掉'} opacity={0} />
        <Txt ref={tailLab} position={[0, 195]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'写一半只可能发生在文件尾'} opacity={0} />
      </Node>

      {/* b32：并发 */}
      <Node ref={g6} opacity={0}>
        <Rect ref={writerBox} position={[-520, -160]} width={140} height={70} radius={12} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'写者'} />
        </Rect>
        <Rect ref={segBox} position={[0, -60]} width={200} height={90} radius={12} fill={T.card} stroke={T.line} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'段文件'} />
        </Rect>
        {[0, 1, 2].map(i => (
          <Rect
            key={`rb-${i}`}
            ref={readerBoxes[i]}
            position={[480, -180 + i * 120]}
            width={140}
            height={64}
            radius={12}
            fill={T.card}
            stroke={T.green}
            lineWidth={2}
            opacity={0}
          >
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'读者'} />
          </Rect>
        ))}
        <Line ref={wArrow} points={[[-450, -160], [-100, -60]]} stroke={T.blue} lineWidth={3} endArrow opacity={0} />
        <Txt ref={wLab} position={[-380, -190]} fontSize={SIZE.label} fontWeight={700} fill={T.blue} fontFamily={FONT.sans} text={'一个写线程'} opacity={0} />
        {[0, 1, 2].map(i => (
          <Line
            key={`ra-${i}`}
            ref={rArrows[i]}
            points={[[100, -60], [410, -180 + i * 120]]}
            stroke={T.green}
            lineWidth={3}
            endArrow
            opacity={0}
          />
        ))}
        <Txt ref={rLab} position={[380, 140]} fontSize={SIZE.label} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'多线程同时读'} opacity={0} />
      </Node>
    </>
  );

  say('文本格式不够好');
  yield* beat('b25',
    all(g1().opacity(1, 0.5), csvLine().opacity(1, 0.5)),
    at('逗号分隔', csvLine().stroke(T.yellow, 0.4)),
    at('不是日志最好的格式', csvX().opacity(1, 0.5)),
    at('转义', escLab().opacity(1, 0.5)),
  );

  say('二进制格式更快');
  yield* beat('b26a',
    all(g1().opacity(0, 0.5), g2().opacity(1, 0.5)),
    at('二进制格式', all(lenBox().opacity(1, 0.5), rawBox().opacity(1, 0.5))),
  );

  say('长度 + 原串');
  yield* beat('b26b',
    at('字节长度', lenBox().stroke(T.yellow, 0.4)),
    at('原始字符串', rawBox().stroke(T.yellow, 0.4)),
    at('不用转义', all(lenBox().stroke(T.blue, 0.4), rawBox().stroke(T.green, 0.4))),
    at('值也一样', all(valLab().opacity(1, 0.5), valLenBox().opacity(1, 0.5), valRawBox().opacity(1, 0.5))),
    at('先转成字符串', valStrLab().opacity(1, 0.5)),
  );

  say('墓碑：追加删除记录');
  yield* beat('b27',
    all(g2().opacity(0, 0.5), g3().opacity(1, 0.5)),
    at('删除一条记录', chain(fileCells[0]().opacity(1, 0.4), fileCells[1]().opacity(1, 0.4), fileCells[2]().opacity(1, 0.4))),
    at('追加', tomb().opacity(1, 0.5)),
    at('墓碑', tombLab().opacity(1, 0.5)),
    at('墓碑写在最后面', chain(tomb().scale(1.06, 0.5), tomb().scale(1, 0.5))),
    at('从最新往旧查', lookArrow().opacity(1, 0.5)),
    at('先碰到它', chain(tomb().scale(1.08, 0.5), tomb().scale(1, 0.5))),
    at('查到墓碑就是不存在', notFoundLab().opacity(1, 0.5)),
  );

  say('合并时清掉旧值');
  yield* beat('b28',
    all(tomb().scale(1.04, 2.5), g3().scale(1.02, beat.dur('b28'))),
    at('丢掉', all(fileCells[0]().opacity(0.2, 0.6), fileCells[1]().opacity(0.2, 0.6), dropLab().opacity(1, 0.5), notFoundLab().opacity(0, 0.4))),
    at('旧值清掉后', extTag.opacity(1, 0.5)),
    at('墓碑自己也可以丢掉', tombGoneLab().opacity(1, 0.5)),
    at('它就得留着', tomb().scale(1.12, 1.2)),
  );

  say('重建：从头读，慢');
  yield* beat('b29',
    all(g3().opacity(0, 0.5), extTag.opacity(0, 0.4), g4().opacity(1, 0.5)),
    at('重启', all(memBox().opacity(1, 0.5), memTab().opacity(1, 0.4))),
    at('丢了', all(memBox().opacity(0.2, 0.6), memTab().opacity(0.2, 0.6))),
    at('从头读', all(fileBar().opacity(1, 0.5), scanDot().opacity(1, 0.4), progBar().opacity(1, 0.4), scanDot().position([480, -80], 4.5), progBar().width(980, 4.5))),
    at('很慢', slowLab().opacity(1, 0.5)),
  );

  say('快照在磁盘上');
  yield* beat('b30',
    all(slowLab().opacity(0, 0.4), g4().scale(1.02, beat.dur('b30'))),
    at('快照', chain(snap().opacity(1, 0.5), memBox().opacity(1, 0.4), memTab().opacity(1, 0.4))),
    at('快得多', snapLab().opacity(1, 0.5)),
    at('快照在段封起来时', all(snapWhenLab().opacity(1, 0.5), extTag.opacity(1, 0.5))),
    at('重启先加载快照', snap().scale(1.06, 1.0)),
    at('还没封起来的那段', all(
      unsealedLab().opacity(1, 0.5),
      chain(scanDot().opacity(0, 0.2), scanDot().position([-480, -80], 0.05), scanDot().opacity(1, 0.2), scanDot().position([480, -80], 2.8)),
      chain(progBar().width(10, 0.2), progBar().width(980, 2.8)),
    )),
  );

  say('校验和拦住半截记录');
  yield* beat('b31',
    all(g4().opacity(0, 0.5), extTag.opacity(0, 0.4), g5().opacity(1, 0.5), recLeft().opacity(1, 0.6), g5().scale(1.02, beat.dur('b31'))),
    at('正在追加', recLeft().stroke(T.yellow, 0.4)),
    at('半途', recRight().opacity(1, 0.6)),
    at('校验和', all(sumBadge().opacity(1, 0.5), sumX().opacity(1, 0.4))),
    at('忽略', all(recRight().opacity(0.25, 0.6), dmgLab().opacity(1, 0.5))),
    at('写一半只可能', tailLab().opacity(1, 0.5)),
  );

  say('一写');
  yield* beat('b32a',
    all(g5().opacity(0, 0.5), g6().opacity(1, 0.5), writerBox().opacity(1, 0.5), segBox().opacity(1, 0.5), wArrow().opacity(1, 0.5)),
  );

  yield* beat('b32a2',
    all(g6().scale(1.02, beat.dur('b32a2'))),
    at('一个写线程', wLab().opacity(1, 0.5)),
  );

  say('多读');
  yield* beat('b32b',
    at('多线程同时读', chain(readerBoxes[0]().opacity(1, 0.4), readerBoxes[1]().opacity(1, 0.4), readerBoxes[2]().opacity(1, 0.4), rArrows[0]().opacity(1, 0.4), rArrows[1]().opacity(1, 0.4), rArrows[2]().opacity(1, 0.4), rLab().opacity(1, 0.5))),
  );
});
