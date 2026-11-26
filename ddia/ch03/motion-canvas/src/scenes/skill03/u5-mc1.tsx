// U5 场景 1（MC，r4）：e0–e8 —— e0 单元站牌（UnitTitle：第 5 站），e1 钩子天平、经验法则（含 C1 让步句 e2a）、B 树一次写至少写两次（N3 计数器前半）。
// r4：e3 补内存表/稀疏索引两张小牌（P2-13）；e8 双写重做走查——顺序缓冲区落点 + 树页落点，计数器拍首即归零、1→2→3 逐次走（P2-1/2）；
// r5：e2b 加 LSM 桥接小标“日志结构的树，就是 LSM 树”；e8 补“缓冲区那份先写完、落稳了”绿字。
// e0 站牌（r4 恢复轮次，skill v1.11.0 开篇规则）：UnitTitle，e1 开头收成左上角页眉；原静态 header 已撤，改由 unit.header 承担。
// 分镜：skill-ch03/beats-u5.md；原文：DDIA §3.5（书页 p83–84，PDF p105–106）。
// N3 写放大计数器（Counter）：e4 磁盘写 1 次（预写日志），e5 跳到 2 次（树页），“至少两次”；
// e6a 分裂两新页各 +1（2→4），e6b 父页 +1（4→5）；e8 换一家引擎重数：拍首第一帧计数器即归零，
// 再数预写日志 1 次 + 顺序缓冲区 1 次 + 树页 1 次 = 3 次（断电可能写到一半留半页，树页写坏了从缓冲区那份恢复）。
// 时长全部来自 timeline/u5.json（beat() 驱动），不手写 waitFor。
import {Circle, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, chain, createRef} from '@motion-canvas/core';
import {at, makeBeats} from '../../lib/beats';
import {UnitTitle} from '../../lib/opening';
import {CHAPTER} from '../../lib/chapter';
import {FONT, SAFE, SIZE, T} from '../../lib/theme';
import {Counter} from '../../lib/schemas';
import timeline from '../../timeline/u5.json';

export default makeScene2D(function* (view) {
  view.fill(T.bg);
  const beat = makeBeats(timeline);

  // 单元站牌（e0）：这一站在全章的位置 + 单元标题；e1 开头收成左上角页眉。
  // 页眉与场景原有的左上角标题同一位置同一样式，旧 header 已删，改由 unit.header 承担。
  const unit = new UnitTitle(CHAPTER, 'u5');

  const anchor = createRef<Txt>();
  const say = (text: string) => anchor().text(text);
  const writeCounter = new Counter([0, 200], '磁盘写 ', ' 次', {size: SIZE.body, tone: T.yellow});

  // ---- 第 1 页：天平 + 读要翻好几段 ----
  const p1 = createRef<Node>();
  const beam = createRef<Line>();
  const post = createRef<Rect>();
  const panL = createRef<Rect>();
  const panR = createRef<Rect>();
  const panLTag = createRef<Txt>();
  const panRTag = createRef<Txt>();
  const matureLab = createRef<Txt>();
  const qMark = createRef<Txt>();
  const segs = [0, 1, 2].map(() => createRef<Rect>());
  const segLabs = [0, 1, 2].map(() => createRef<Txt>());
  const hopDot = createRef<Circle>();
  // r4（P2-13）：e3“几个数据结构”补上画面——内存表、稀疏索引两张小牌，与三段文件并列。
  const memChip = createRef<Rect>();
  const idxChip = createRef<Rect>();

  // ---- 第 2 页：一次写，磁盘写两遍 ----
  const p2 = createRef<Node>();
  const ball = createRef<Circle>();
  const walBox = createRef<Rect>();
  const pageBox = createRef<Rect>();
  const walStamp = createRef<Txt>();
  const pageStamp = createRef<Txt>();
  const splitA = createRef<Rect>();
  const splitB = createRef<Rect>();
  const parentBox = createRef<Rect>();
  const smallCell = createRef<Rect>();
  const sameLab = createRef<Txt>();
  const powerLab = createRef<Txt>();
  const guardLab = createRef<Txt>();
  // r5（P2-1）：e2b LSM 桥接小标；e8“缓冲区那份先写完、落稳了”绿字。
  const bridgeLab = createRef<Txt>();
  const bufSafeLab = createRef<Txt>();
  // r4（P2-1）：e8 双写的第二个落点——顺序缓冲区（先写一份到这里，再写进树页），各带“写过✓”。
  const bufBox = createRef<Rect>();
  const bufStamp = createRef<Txt>();

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
      {writeCounter.node}

      {/* 第 1 页 */}
      <Node ref={p1} opacity={0}>
        <Line ref={beam} points={[[-420, -110], [420, -110]]} stroke={T.line} lineWidth={6} />
        <Rect ref={post} position={[0, -40]} width={24} height={140} fill={T.line} />
        <Rect ref={panL} position={[-320, -60]} width={280} height={100} radius={14} fill={T.card} stroke={T.blue} lineWidth={2}>
          <Txt position={[0, -18]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'写快'} />
          <Txt position={[0, 26]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'日志结构树'} />
        </Rect>
        <Rect ref={panR} position={[320, -60]} width={280} height={100} radius={14} fill={T.card} stroke={T.blue} lineWidth={2}>
          <Txt position={[0, -18]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'读快'} />
          <Txt position={[0, 26]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'B 树'} />
        </Rect>
        <Txt ref={panLTag} position={[-320, 60]} fontSize={SIZE.label} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'写更快'} opacity={0} />
        <Txt ref={panRTag} position={[320, 60]} fontSize={SIZE.label} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'读更快'} opacity={0} />
        <Txt ref={matureLab} position={[320, 105]} fontSize={SIZE.label} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'实现更成熟'} opacity={0} />
        <Txt ref={qMark} position={[0, -220]} fontSize={64} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'？'} opacity={0} />
        <Txt ref={bridgeLab} position={[0, 180]} fontSize={SIZE.label} fontWeight={700} fill={T.purple} fontFamily={FONT.sans} text={'日志结构的树，就是 LSM 树'} opacity={0} />
        {[0, 1, 2].map(i => (
          <Rect
            key={`seg-${i}`}
            ref={segs[i]}
            position={[-360 + i * 360, -60]}
            width={320}
            height={120}
            radius={14}
            fill={T.card}
            stroke={T.blue}
            lineWidth={2}
            opacity={0}
          >
            <Txt position={[0, -28]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={['最新段', '较旧的段', '更旧的段'][i]} />
            <Txt ref={segLabs[i]} position={[0, 28]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'压缩阶段不同'} opacity={0} />
          </Rect>
        ))}
        <Circle ref={hopDot} position={[-360, -140]} width={26} height={26} fill={T.yellow} opacity={0} />
        <Rect ref={memChip} position={[-200, -190]} width={200} height={56} radius={10} fill={T.card} stroke={T.purple} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'内存表'} />
        </Rect>
        <Rect ref={idxChip} position={[200, -190]} width={220} height={56} radius={10} fill={T.card} stroke={T.purple} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'稀疏索引'} />
        </Rect>
      </Node>

      {/* 第 2 页 */}
      <Node ref={p2} opacity={0}>
        <Circle ref={ball} position={[0, -230]} width={54} height={54} fill={T.yellow} opacity={0} />
        <Rect ref={walBox} position={[-300, -40]} width={400} height={130} radius={14} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt position={[0, -28]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'预写日志'} />
          <Txt ref={walStamp} position={[0, 30]} fontSize={SIZE.label} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'写过 ✓'} opacity={0} />
        </Rect>
        <Rect ref={pageBox} position={[300, -40]} width={400} height={130} radius={14} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt position={[0, -28]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'树页'} />
          <Txt ref={pageStamp} position={[0, 30]} fontSize={SIZE.label} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'写过 ✓'} opacity={0} />
        </Rect>
        <Rect ref={splitA} position={[160, -40]} width={190} height={130} radius={14} fill={T.card} stroke={T.yellow} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'一半页'} />
        </Rect>
        <Rect ref={splitB} position={[380, -40]} width={190} height={130} radius={14} fill={T.card} stroke={T.yellow} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'一半页'} />
        </Rect>
        <Rect ref={parentBox} position={[270, -160]} width={300} height={56} radius={10} fill={T.card} stroke={T.yellow} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'父页'} />
        </Rect>
        <Rect ref={smallCell} position={[380, -5]} width={60} height={60} radius={8} fill={T.yellow} opacity={0} />
        <Txt ref={sameLab} position={[300, 60]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'没变也重写'} opacity={0} />
        <Rect ref={bufBox} position={[300, 100]} width={400} height={90} radius={12} fill={T.card} stroke={T.yellow} lineWidth={2} opacity={0}>
          <Txt position={[0, -20]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'顺序缓冲区'} />
          <Txt ref={bufStamp} position={[0, 22]} fontSize={SIZE.label} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'写过 ✓'} opacity={0} />
        </Rect>
        <Txt ref={powerLab} position={[0, -170]} fontSize={SIZE.body} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'断电'} opacity={0} />
        {/* r4 恢复轮次（QA：e8 text-overlap）：绿字原来在 [0, 200]，正压着同一位置的计数器“磁盘写 3 次”，挪到断电标语上方。 */}
        <Txt ref={guardLab} position={[0, -230]} fontSize={SIZE.body} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'半页更新，缓冲区能恢复'} opacity={0} />
        <Txt ref={bufSafeLab} position={[-300, 150]} fontSize={SIZE.label} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'缓冲区那份先写完、落稳了'} opacity={0} />
      </Node>
    </>
  );

  // e0：单元站牌（演示拍，念完留 0.8s）
  yield* beat('e0', unit.enter());

  say('写快和读快，都要？');
  yield* beat('e1',
    unit.toHeader(),
    all(p1().opacity(1, 0.5), beam().opacity(1, 0.5), post().opacity(1, 0.5), panL().opacity(1, 0.5), panR().opacity(1, 0.5)),
    at('能不能都要', chain(qMark().opacity(1, 0.5), qMark().scale(1.15, 0.8))),
  );

  say('B 树实现更成熟');
  yield* beat('e2a',
    all(p1().scale(1.02, beat.dur('e2a'))),
    at('更成熟', chain(panR().stroke(T.green, 0.5), matureLab().opacity(1, 0.4))),
  );

  say('日志结构写快，B 树读快');
  yield* beat('e2b',
    all(panLTag().opacity(1, 0.5), panRTag().opacity(1, 0.5)),
    at('日志结构', chain(panL().position([-320, -30], 1.0), panL().stroke(T.green, 0.5), bridgeLab().opacity(1, 0.4))),
    at('B 树读', chain(panR().position([320, -30], 1.0), panR().stroke(T.green, 0.5))),
  );

  say('读，要翻好几段');
  yield* beat('e3',
    all(beam().opacity(0, 0.4), post().opacity(0, 0.4), panL().opacity(0, 0.4), panR().opacity(0, 0.4), panLTag().opacity(0, 0.4), panRTag().opacity(0, 0.4), matureLab().opacity(0, 0.4), qMark().opacity(0, 0.4), bridgeLab().opacity(0, 0.4),
      segs[0]().opacity(1, 0.5), segLabs[0]().opacity(1, 0.4), hopDot().opacity(1, 0.4)),
    at('几个数据结构', all(memChip().opacity(1, 0.5), idxChip().opacity(1, 0.5))),
    at('不同压缩阶段', all(segs[1]().opacity(1, 0.5), segLabs[1]().opacity(1, 0.4), hopDot().position([0, -140], 0.8))),
    at('好几段', all(segs[2]().opacity(1, 0.5), segLabs[2]().opacity(1, 0.4), hopDot().position([360, -140], 0.8))),
  );

  say('一次写，磁盘写 1 次');
  yield* beat('e4',
    all(p1().opacity(0, 0.5), p2().opacity(1, 0.5), ball().opacity(1, 0.5), walBox().opacity(1, 0.5), pageBox().opacity(1, 0.5), writeCounter.node.opacity(1, 0.4)),
    at('写两次', chain(ball().position([-300, -140], 0.9), walStamp().opacity(1, 0.4), writeCounter.bump())),
  );

  say('至少写两次');
  yield* beat('e5',
    all(p2().scale(1.02, beat.dur('e5'))),
    at('树页本身', chain(ball().position([300, -140], 0.9), pageStamp().opacity(1, 0.4), writeCounter.bump())),
  );

  say('分裂：再写两页');
  yield* beat('e6a',
    all(pageBox().opacity(0, 0.4), pageStamp().opacity(0, 0.4), walStamp().opacity(0, 0.4), ball().opacity(0, 0.4)),
    at('页分裂', chain(splitA().opacity(1, 0.5), splitB().opacity(1, 0.5))),
    at('两个新页', chain(writeCounter.bump(), writeCounter.bump())),
    at('父页', parentBox().opacity(1, 0.5)),
  );

  say('分裂：两次变五次');
  yield* beat('e6b',
    at('磁盘写', writeCounter.bump()),
    at('变成五次', chain(writeCounter.node.scale(1.2, 0.4), writeCounter.node.scale(1, 0.4))),
  );

  say('改几个字节，也写整页');
  yield* beat('e7',
    all(splitA().opacity(0, 0.4), splitB().opacity(0, 0.4), parentBox().opacity(0, 0.4),
      pageBox().opacity(1, 0.5)),
    at('只改了几个字节', chain(smallCell().opacity(1, 0.5), sameLab().opacity(1, 0.4))),
  );

  say('双写：一共落盘三次');
  // r5（TTS 坏音频：e8 原句 119 字录出 57.8s，尾部重复碎片）：拆成 e8a/e8b 两拍重录，不原句重试。
  yield* beat('e8a',
    // r4（P2-2）：计数器在拍首第一帧就归零——拍首动作里先藏起计数器并瞬时归零，再在“换一家引擎看”处以 0 淡入，不留上一拍的 5。
    all(smallCell().opacity(0, 0.4), sameLab().opacity(0, 0.4),
      writeCounter.node.opacity(0, 0), writeCounter.reset(0)),
    at('换一家引擎看', writeCounter.node.opacity(1, 0.4)),
    // r6（P2-1）：盖章与计数器一律 all 并行（同帧切换）；chain 串行会让计数器比盖章晚约 0.4s（r5 成片 59.5s 三枚章在、计数器仍 2）。
    at('预写日志一次', all(walStamp().opacity(1, 0.4), writeCounter.bump())),
    // r4（P2-1）：两个落点各带“写过✓”，计数器 1→2→3 逐次走，不跳号。
    at('防断电', chain(powerLab().opacity(1, 0.5), bufBox().opacity(1, 0.5), pageBox().stroke(T.yellow, 0.5))),
    at('顺序缓冲区', all(bufStamp().opacity(1, 0.4), writeCounter.bump())),
    // r6（P2-1）：树页章锚点由“再写进树页”（拍+6.70s）改到“一共落盘三次”（拍+7.74s），2 次状态（缓冲区已盖章、树页未盖、计数器 2）停留约 2.08s；第三枚章落在报总数时，语义仍对。bump 自带弹一下，不再另加 scale 脉冲（同属性双补间会冲突）。
    at('一共落盘三次', all(pageStamp().opacity(1, 0.4), writeCounter.bump())),
    // r5（P2-2）：缓冲区那份为什么能救——先写完、落稳了，才动树页，所以它一定是完整的。
    at('落稳了', bufSafeLab().opacity(1, 0.5)),
  );

  say('断电了，还能恢复');
  yield* beat('e8b',
    at('断电可能', guardLab().opacity(1, 0.5)),
    // r4 恢复轮次（QA：e8 idle 7.4s）：后半句“断电可能正好写到一半……”之前没有动作，跟着尾巴两句补两步——
    // 树页写坏了：树页框描红、“写过✓”消失；从缓冲区恢复：顺序缓冲区框描绿轻跳。
    at('树页写坏了', chain(pageBox().stroke(T.red, 0.5), pageStamp().opacity(0, 0.4))),
    at('从缓冲区那份恢复', chain(bufBox().stroke(T.green, 0.5), bufBox().scale(1.06, 0.4), bufBox().scale(1, 0.4))),
  );
});
