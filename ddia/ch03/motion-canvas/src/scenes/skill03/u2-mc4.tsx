// U2 场景 4（MC）：b33–b40 —— 追加写的好处（顺序写、恢复简单、去碎片）、哈希索引的局限、回扣。
// 分镜：skill-ch03/beats-u2.md；原文：DDIA §3.2（书页 p75，PDF p97）。
// 时长全部来自 timeline/u2.json（beat() 驱动），不手写 waitFor。
import {Circle, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, chain, createRef} from '@motion-canvas/core';
import {at, makeBeats} from '../../lib/beats';
import {FONT, SAFE, SIZE, T} from '../../lib/theme';
import timeline from '../../timeline/u2.json';

export default makeScene2D(function* (view) {
  view.fill(T.bg);
  const beat = makeBeats(timeline);

  const header = createRef<Txt>();
  const anchor = createRef<Txt>();
  const say = (text: string) => anchor().text(text);

  const g1 = createRef<Node>();
  const seqArrow = createRef<Line>();
  const seqLab = createRef<Txt>();
  const seqBar = createRef<Rect>();
  const rndArrow = createRef<Line>();
  const rndLab = createRef<Txt>();
  const rndBar = createRef<Rect>();
  const hdd = createRef<Circle>();
  const hddLab = createRef<Txt>();
  const seekLab = createRef<Txt>();
  const ssd = createRef<Rect>();
  const ssdLab = createRef<Txt>();
  const g2 = createRef<Node>();
  const inplace = createRef<Rect>();
  const spliceX = createRef<Txt>();
  const appendOk = createRef<Rect>();
  const appendTick = createRef<Txt>();
  const g3 = createRef<Node>();
  const frags = [0, 1, 2, 3].map(() => createRef<Rect>());
  const neatBar = createRef<Rect>();
  const fragLab = createRef<Txt>();
  const g4 = createRef<Node>();
  const memBox = createRef<Rect>();
  const keyChips = [0, 1, 2, 3, 4, 5].map(() => createRef<Rect>());
  const overflowLab = createRef<Txt>();
  const diskHash = createRef<Rect>();
  const diskX = createRef<Txt>();
  const limTags = [0, 1, 2].map(() => createRef<Txt>());
  const confLab = createRef<Txt>();
  const g5 = createRef<Node>();
  const kittyChips = [0, 1, 2, 3, 4, 5].map(() => createRef<Rect>());
  const rangeBracket = createRef<Line>();
  const rangeX = createRef<Txt>();
  const tapDot = createRef<Circle>();
  const unorderedLab = createRef<Txt>();
  // B4：b39a 一键跨段扇形演示——一个键要把三段的表各问一遍
  const g5b = createRef<Node>();
  const fanSegs = [0, 1, 2].map(() => createRef<Rect>());
  const fanTabs = [0, 1, 2].map(() => createRef<Txt>());
  const fanKey = createRef<Rect>();
  const fanLines = [0, 1, 2].map(() => createRef<Line>());
  const fanTally = createRef<Txt>();
  const g6 = createRef<Node>();
  const miniLog = createRef<Rect>();
  const miniTab = createRef<Rect>();
  const closeLab = createRef<Txt>();

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

      {/* b33/b34：顺序写 vs 随机写 */}
      <Node ref={g1} opacity={0}>
        <Line ref={seqArrow} points={[[-480, -160], [-80, -160]]} stroke={T.green} lineWidth={4} endArrow opacity={0} />
        <Txt ref={seqLab} position={[-280, -210]} fontSize={SIZE.label} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'顺序写：一路直行'} opacity={0} />
        <Rect ref={seqBar} position={[-480, -110]} offset={[-1, 0]} width={10} height={26} radius={13} fill={T.green} opacity={0} />
        <Line ref={rndArrow} points={[[80, -160], [200, -200], [320, -120], [440, -190], [480, -160]]} stroke={T.red} lineWidth={3} endArrow opacity={0} />
        <Txt ref={rndLab} position={[280, -230]} fontSize={SIZE.label} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'随机写：来回跳'} opacity={0} />
        <Rect ref={rndBar} position={[80, -110]} offset={[-1, 0]} width={10} height={26} radius={13} fill={T.red} opacity={0} />
        <Circle ref={hdd} position={[-280, 60]} width={170} height={170} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'机械硬盘'} />
        </Circle>
        <Txt ref={hddLab} position={[-280, 180]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} text={'少寻道，更快'} opacity={0} />
        <Txt ref={seekLab} position={[-280, 218]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'寻道：磁头移到要读写的位置'} opacity={0} />
        <Rect ref={ssd} position={[280, 60]} width={300} height={170} radius={16} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'固态硬盘'} />
        </Rect>
        <Txt ref={ssdLab} position={[280, 180]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} text={'也更可取'} opacity={0} />
      </Node>

      {/* b35：原地覆盖 vs 只追加 */}
      <Node ref={g2} opacity={0}>
        <Rect ref={inplace} position={[-300, -60]} width={480} height={180} radius={16} fill={T.card} stroke={T.red} lineWidth={2} opacity={0}>
          <Txt position={[0, -55]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'原地覆盖：写一半断开'} />
          <Txt position={[0, 10]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'旧值 + 新值'} />
          <Txt position={[0, 55]} fontSize={SIZE.label} fill={T.red} fontFamily={FONT.sans} text={'拼在一起'} />
        </Rect>
        <Txt ref={spliceX} position={[-300, 80]} fontSize={56} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'✗'} opacity={0} />
        <Rect ref={appendOk} position={[300, -60]} width={480} height={180} radius={16} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt position={[0, -55]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'只追加：断开也完整'} />
          <Txt position={[0, 10]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'旧值 → 新记录'} />
          <Txt position={[0, 55]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} text={'没有拼接'} />
        </Rect>
        <Txt ref={appendTick} position={[300, 80]} fontSize={56} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'✓'} opacity={0} />
      </Node>

      {/* b36：合并去碎片 */}
      <Node ref={g3} opacity={0}>
        {[0, 1, 2, 3].map(i => (
          <Rect
            key={`frag-${i}`}
            ref={frags[i]}
            position={[-420 + i * 280, -120 + (i % 2) * 90]}
            width={220}
            height={60}
            radius={10}
            fill={T.card}
            stroke={T.line}
            lineWidth={2}
            opacity={0}
          >
            <Txt fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'碎片'} />
          </Rect>
        ))}
        <Rect ref={neatBar} position={[0, 80]} width={1000} height={70} radius={12} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} text={'合并成整齐的一段'} />
        </Rect>
        <Txt ref={fragLab} position={[0, 170]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'失效记录散落占地方，合并收拢'} opacity={0} />
      </Node>

      {/* b37/b38：局限一 */}
      <Node ref={g4} opacity={0}>
        <Rect ref={memBox} position={[-260, -80]} width={440} height={260} radius={16} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt position={[0, -100]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'内存'} />
        </Rect>
        {[0, 1, 2, 3, 4, 5].map(i => (
          <Rect
            key={`key-${i}`}
            ref={keyChips[i]}
            position={[-380 + (i % 3) * 130, -140 + Math.floor(i / 3) * 80]}
            width={110}
            height={56}
            radius={10}
            fill={T.card}
            stroke={T.yellow}
            lineWidth={2}
            opacity={0}
          >
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'键'} />
          </Rect>
        ))}
        <Txt ref={overflowLab} position={[-260, 110]} fontSize={SIZE.body} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'键太多，装不下'} opacity={0} />
        <Rect ref={diskHash} position={[300, -100]} width={440} height={240} radius={16} fill={T.card} stroke={T.line} lineWidth={2} opacity={0}>
          <Txt position={[0, -100]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'磁盘上的哈希表'} />
        </Rect>
        <Txt ref={diskX} position={[300, -40]} fontSize={64} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'✗'} opacity={0} />
        {[0, 1, 2].map(i => (
          <Txt
            key={`lim-${i}`}
            ref={limTags[i]}
            position={[300, 40 + i * 50]}
            fontSize={SIZE.label}
            fill={T.red}
            fontFamily={FONT.sans}
            text={['随机读写多', '扩容贵', '冲突难处理'][i]}
            opacity={0}
          />
        ))}
        {/* b38：哈希冲突定义——两个不同的键算到同一个位置 */}
        <Txt ref={confLab} position={[0, 200]} fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.sans} text={'两个不同的键算到同一个位置，就叫哈希冲突'} opacity={0} />
      </Node>

      {/* b39：范围查询 */}
      <Node ref={g5} opacity={0}>
        {[0, 1, 2, 3, 4, 5].map(i => (
          <Rect
            key={`kitty-${i}`}
            ref={kittyChips[i]}
            position={[-450 + i * 180, -80]}
            width={160}
            height={70}
            radius={10}
            fill={T.card}
            stroke={T.blue}
            lineWidth={2}
            opacity={0}
          >
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={`kitty0000${i}`} />
          </Rect>
        ))}
        <Line ref={rangeBracket} points={[[-530, -160], [530, -160]]} stroke={T.red} lineWidth={3} opacity={0} />
        <Txt ref={rangeX} position={[0, -220]} fontSize={SIZE.label} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'范围框：扫不过去'} opacity={0} />
        <Circle ref={tapDot} position={[-450, -80]} width={26} height={26} fill={T.yellow} opacity={0} />
        <Txt position={[0, 60]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'只能逐个查：kitty00000 … kitty99999'} />
        <Txt ref={unorderedLab} position={[0, 120]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'键不按字母顺序排'} opacity={0} />
      </Node>

      {/* b39a：一键问遍三段 */}
      <Node ref={g5b} opacity={0}>
        {[0, 1, 2].map(i => (
          <Rect
            key={`fan-${i}`}
            ref={fanSegs[i]}
            position={[-360 + i * 360, -80]}
            width={320}
            height={120}
            radius={14}
            fill={T.card}
            stroke={T.blue}
            lineWidth={2}
            opacity={0}
          >
            <Txt position={[0, -30]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={['最新段', '次新段', '更旧的段'][i]} />
            <Txt ref={fanTabs[i]} position={[0, 25]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.mono} text={'哈希表'} opacity={0} />
          </Rect>
        ))}
        {[0, 1, 2].map(i => (
          <Line
            key={`fanline-${i}`}
            ref={fanLines[i]}
            points={[[0, 78], [-360 + i * 360, -20]]}
            stroke={T.yellow}
            lineWidth={3}
            endArrow
            opacity={0}
          />
        ))}
        <Rect ref={fanKey} position={[0, 110]} width={300} height={64} radius={12} fill={T.card} stroke={T.yellow} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'kitty00042'} />
        </Rect>
        <Txt ref={fanTally} position={[0, 200]} fontSize={SIZE.body} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'一个键，最多问 3 张表'} opacity={0} />
      </Node>

      {/* b40：回扣 */}
      <Node ref={g6} opacity={0}>
        <Rect ref={miniLog} position={[-260, -60]} width={420} height={120} radius={14} fill={T.card} stroke={T.line} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'日志文件'} />
        </Rect>
        <Rect ref={miniTab} position={[260, -60]} width={420} height={120} radius={14} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'键 → 字节偏移'} />
        </Rect>
        <Txt ref={closeLab} position={[0, 120]} fontSize={SIZE.title} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'键就是地址，但有代价'} opacity={0} />
      </Node>
    </>
  );

  say('顺序写比随机写快');
  yield* beat('b33',
    all(g1().opacity(1, 0.5), g1().scale(1.02, beat.dur('b33')), seqArrow().opacity(1, 0.5), seqLab().opacity(1, 0.4), seqBar().opacity(1, 0.4), rndArrow().opacity(1, 0.5), rndLab().opacity(1, 0.4), rndBar().opacity(1, 0.4)),
    at('顺序写', seqBar().width(400, 1.2)),
    at('随机写', rndBar().width(120, 0.6)),
  );

  say('磁盘、固态都更喜欢');
  yield* beat('b34',
    at('机械硬盘', chain(hdd().opacity(1, 0.5), hddLab().opacity(1, 0.4))),
    at('寻道', seekLab().opacity(1, 0.5)),
    at('固态硬盘', chain(ssd().opacity(1, 0.5), ssdLab().opacity(1, 0.4), hdd().scale(1.03, 1.5))),
  );

  say('不怕新旧拼在一起');
  yield* beat('b35',
    all(g1().opacity(0, 0.5), g2().opacity(1, 0.5), inplace().opacity(1, 0.5), appendOk().opacity(1, 0.5)),
    at('覆盖值的半途', spliceX().opacity(1, 0.4)),
    at('新旧值', appendTick().opacity(1, 0.4)),
  );

  say('合并去碎片');
  yield* beat('b36',
    all(g2().opacity(0, 0.5), g3().opacity(1, 0.5)),
    chain(frags[0]().opacity(1, 0.4), frags[1]().opacity(1, 0.4), frags[2]().opacity(1, 0.4), frags[3]().opacity(1, 0.4)),
    at('碎片化', all(frags[0]().opacity(0.15, 0.6), frags[1]().opacity(0.15, 0.6), frags[2]().opacity(0.15, 0.6), frags[3]().opacity(0.15, 0.6), neatBar().opacity(1, 0.6))),
    at('碎片化就是', fragLab().opacity(1, 0.5)),
  );

  say('键太多，内存装不下');
  yield* beat('b37a',
    all(g3().opacity(0, 0.5), g4().opacity(1, 0.5), memBox().opacity(1, 0.5)),
    at('必须放进内存', chain(keyChips[0]().opacity(1, 0.3), keyChips[1]().opacity(1, 0.3), keyChips[2]().opacity(1, 0.3))),
    at('键太多', chain(keyChips[3]().opacity(1, 0.3), keyChips[4]().opacity(1, 0.3), keyChips[5]().opacity(1, 0.3), overflowLab().opacity(1, 0.5))),
  );

  say('放磁盘很难做好');
  yield* beat('b37b',
    all(diskHash().opacity(1, 0.5), diskX().opacity(1, 0.5), diskX().scale(1.2, 1.2)),
  );

  say('随机多、扩容贵、冲突难');
  yield* beat('b38',
    at('随机读写', limTags[0]().opacity(1, 0.5)),
    at('扩容', limTags[1]().opacity(1, 0.5)),
    at('冲突', limTags[2]().opacity(1, 0.5)),
    at('两个不同的键算到同一个位置', confLab().opacity(1, 0.5)),
  );

  say('范围查不了，只能逐个查');
  yield* beat('b39',
    all(g4().opacity(0, 0.5), g5().opacity(1, 0.5), ...kittyChips.map(c => c().opacity(1, 0.4))),
    at('扫过', chain(rangeBracket().opacity(1, 0.5), rangeX().opacity(1, 0.4))),
    at('不按字母顺序', unorderedLab().opacity(1, 0.5)),
    at('逐个', all(
      tapDot().opacity(1, 0.3),
      tapDot().position([450, -80], 1.8),
    )),
  );

  say('一个键，最多问 3 张表');
  yield* beat('b39a',
    all(g5().opacity(0, 0.5), g5b().opacity(1, 0.5), ...fanSegs.map(s => s().opacity(1, 0.5)), ...fanTabs.map(t => t().opacity(1, 0.4)), fanKey().opacity(1, 0.5)),
    at('三段', chain(fanLines[0]().opacity(1, 0.5), fanLines[1]().opacity(1, 0.5), fanLines[2]().opacity(1, 0.5))),
    at('十万个键', fanTally().opacity(1, 0.5)),
  );

  say('键就是地址，但有代价');
  yield* beat('b40',
    all(g5().opacity(0, 0.5), g5b().opacity(0, 0.5), g6().opacity(1, 0.5), miniLog().opacity(1, 0.5), miniTab().opacity(1, 0.5)),
    at('范围也查不了', closeLab().opacity(1, 0.5)),
  );
});
