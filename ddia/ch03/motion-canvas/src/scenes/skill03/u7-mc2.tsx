// U7 场景 2（MC）：g16–g27 —— 精确查不到相似键、编辑距离 1（banana/bannana 走查、cat 三变）、
// Lucene 词典小索引、LevelDB 稀疏键、字符自动机（trie）走查：状态记“读了几个字母、已用几次编辑”（延伸）、
// 走到 b-a-n-a-n-a 命中 banana、Lucene 默认编辑距离 1–2（延伸）、走偏分支剪掉、一次遍历求交。
// 分镜：skill-ch03/beats-u7.md；原文：DDIA §3.6 后半（书页 p88）。
// 时长全部来自 timeline/u7.json（beat() 驱动），不手写 waitFor。
// 词典：banana / orange / mango 三条分叉；查询词 bannana（多一个 n，编辑距离 1）。
import {Circle, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, chain, createRef} from '@motion-canvas/core';
import {at, makeBeats} from '../../lib/beats';
import {FONT, SAFE, SIZE, T} from '../../lib/theme';
import {tag} from '../../lib/schemas';
import timeline from '../../timeline/u7.json';

// trie 坐标：根 (-500,-60)；banana 行 y=-200，orange 行 y=-60，mango 行 y=80；字母间距 72。
const TX0 = -420;
const TSTEP = 72;
const tpos = (i: number, y: number): [number, number] => [TX0 + i * TSTEP, y];

export default makeScene2D(function* (view) {
  view.fill(T.bg);
  const beat = makeBeats(timeline);

  const header = createRef<Txt>();
  const anchor = createRef<Txt>();
  const say = (text: string) => anchor().text(text);

  // g16：精确查找 vs 拼错的词
  const exactG = createRef<Node>();
  const exactTick = createRef<Txt>();
  const missG = createRef<Node>();
  const missX = createRef<Txt>();

  // g17：bannana 字母行 + 编辑距离计数 + 三条枝
  const lettersG = createRef<Node>();
  const letterRefs = 'bannana'.split('').map(() => createRef<Txt>());
  const extraTag = createRef<Txt>();
  const stateTxt = createRef<Txt>();
  const brSyn = createRef<Rect>();
  const brVar = createRef<Rect>();
  const brNear = createRef<Rect>();

  // g18：增 / 删 / 替换三枚标签
  const opG = createRef<Node>();
  const opAdd = createRef<Rect>();
  const opDel = createRef<Rect>();
  const opSub = createRef<Rect>();

  // g19：cat 三变
  const catG = createRef<Node>();
  const catAdd = createRef<Rect>();
  const catDel = createRef<Rect>();
  const catSub = createRef<Rect>();

  // g20：已排序词典文件 + 小内存索引
  const dictG = createRef<Node>();
  const dictHi = createRef<Rect>();
  const idxPlate = createRef<Rect>();
  const idxArrow = createRef<Line>();

  // g21：稀疏键集合
  const sparseG = createRef<Node>();
  const sparseMarks = [0, 3, 6].map(() => createRef<Rect>());
  // r5 #3：banana 卡（索引 1），查 banana 时“再往后扫到它”描边
  const bananaCard = createRef<Rect>();
  const lvPlate = createRef<Rect>();

  // g21b–g27：字符自动机 trie
  const trieG = createRef<Node>();
  const orgG = createRef<Node>();
  const manG = createRef<Node>();
  const banNodes = 'banana'.split('').map(() => createRef<Circle>());
  const orgNodes = 'orange'.split('').map(() => createRef<Circle>());
  const manNodes = 'mango'.split('').map(() => createRef<Circle>());
  const pointer = createRef<Circle>();
  const queryRefs = 'bannana'.split('').map(() => createRef<Txt>());
  const queryG = createRef<Node>();
  const skipTag = createRef<Txt>();
  const hitTag = createRef<Txt>();
  const editCount = createRef<Txt>();
  const lucPlate = createRef<Rect>();
  const lucTag = createRef<Txt>();
  const extTag = tag([560, -300], '延伸 · 原文之外');
  const cutX1 = createRef<Txt>();
  const cutX2 = createRef<Txt>();
  const sweepG = createRef<Node>();
  const sweepX = createRef<Txt>();
  const sweepBar = createRef<Rect>();
  const walkArrow = createRef<Line>();
  const walkLab = createRef<Txt>();
  // r4 B26：偏移数字（演示数字，原文未给具体偏移值）
  const offsetTxt = createRef<Txt>();
  // r4 B26：本例界限（用 1 次 / 上限 2）；r5 #6：找到距离 1 的词之后还继续找距离 2 的词
  const lucExTxt = createRef<Txt>();
  // r6 P2-5：距离 2 的例词卡（bannana → bananas，两处编辑；已验算距离 2）
  const ex2Card = createRef<Rect>();
  const ex2Line1 = createRef<Txt>();
  const ex2Line2 = createRef<Txt>();

  const WORDS = ['apple', 'banana', 'cat', 'cut', 'dog', 'mango', 'orange'];
  const SPARSE = ['apple', 'banana', 'cat', 'cut', 'dog', 'mango', 'orange', 'pear', 'plum'];

  view.add(
    <>
      <Txt
        ref={header}
        position={[-SAFE.halfW, -SAFE.halfH]}
        offset={[-1, -1]}
        fontSize={SIZE.label}
        fill={T.muted}
        fontFamily={FONT.sans}
        text={'超出键值查找：多维、模糊与内存'}
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

      {/* g16：精确查找 vs 拼错的词 */}
      <Node ref={exactG} opacity={0}>
        <Rect position={[-280, -60]} width={380} height={170} radius={16} fill={T.card} stroke={T.green} lineWidth={3} />
        <Txt position={[-280, -110]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'精确查找'} />
        <Txt position={[-280, -50]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.mono} text={'banana'} />
        <Txt ref={exactTick} position={[-150, -20]} fontSize={48} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'✓'} opacity={0} />
      </Node>
      <Node ref={missG} opacity={0}>
        <Rect position={[280, -60]} width={380} height={170} radius={16} fill={T.card} stroke={T.red} lineWidth={3} />
        <Txt position={[280, -110]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'拼错的词'} />
        <Txt position={[280, -50]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.mono} text={'bannana'} />
        <Txt ref={missX} position={[410, -20]} fontSize={48} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'✗'} opacity={0} />
      </Node>

      {/* g17：bannana 字母行 + 三条枝 */}
      <Node ref={lettersG} opacity={0}>
        {'bannana'.split('').map((ch, i) => (
          <Txt
            key={`bl-${i}`}
            ref={letterRefs[i]}
            position={[-105 + i * 35, -140]}
            fontSize={40}
            fontWeight={700}
            fill={T.text}
            fontFamily={FONT.mono}
            text={ch}
          />
        ))}
        <Txt ref={extraTag} position={[0, -80]} fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.sans} text={'多出来的 n'} opacity={0} />
        <Rect ref={brSyn} position={[-320, 120]} width={300} height={90} radius={14} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'同义词'} />
        </Rect>
        <Rect ref={brVar} position={[0, 120]} width={300} height={90} radius={14} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'变体'} />
        </Rect>
        <Rect ref={brNear} position={[320, 120]} width={300} height={90} radius={14} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'邻近词'} />
        </Rect>
      </Node>
      <Txt ref={stateTxt} position={[0, 240]} fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.sans} text={''} opacity={0} />

      {/* g18：增 / 删 / 替换 */}
      <Node ref={opG} opacity={0}>
        <Rect ref={opAdd} position={[-320, -60]} width={280} height={100} radius={14} fill={T.card} stroke={T.green} lineWidth={3} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'增一个字母'} />
        </Rect>
        <Rect ref={opDel} position={[0, -60]} width={280} height={100} radius={14} fill={T.card} stroke={T.yellow} lineWidth={3} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'删一个字母'} />
        </Rect>
        <Rect ref={opSub} position={[320, -60]} width={280} height={100} radius={14} fill={T.card} stroke={T.blue} lineWidth={3} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'替换一个字母'} />
        </Rect>
      </Node>

      {/* g19：cat 三变 */}
      <Node ref={catG} opacity={0}>
        <Rect ref={catAdd} position={[-360, -60]} width={320} height={130} radius={14} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt position={[0, -28]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.mono} text={'cat → cats'} />
          <Txt position={[0, 28]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} text={'加一个字母'} />
        </Rect>
        <Rect ref={catDel} position={[0, -60]} width={320} height={130} radius={14} fill={T.card} stroke={T.yellow} lineWidth={2} opacity={0}>
          <Txt position={[0, -28]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.mono} text={'cat → ct'} />
          <Txt position={[0, 28]} fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.sans} text={'删一个字母'} />
        </Rect>
        <Rect ref={catSub} position={[360, -60]} width={320} height={130} radius={14} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt position={[0, -28]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.mono} text={'cat → cut'} />
          <Txt position={[0, 28]} fontSize={SIZE.label} fill={T.blue} fontFamily={FONT.sans} text={'换一个字母'} />
        </Rect>
      </Node>

      {/* g20：已排序词典文件 + 小内存索引 */}
      <Node ref={dictG} opacity={0}>
        <Rect position={[-220, -40]} width={420} height={400} radius={16} fill={T.card} stroke={T.blue} lineWidth={3} />
        <Txt position={[-220, -270]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'已排序的词典文件（SSTable 式结构）'} />
        {WORDS.map((w, i) => (
          <Txt key={`dw-${i}`} position={[-220, -180 + i * 52]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.mono} text={w} />
        ))}
        <Rect ref={dictHi} position={[-220, -128]} width={380} height={44} stroke={T.yellow} lineWidth={3} opacity={0} />
        <Rect ref={idxPlate} position={[330, -180]} width={300} height={110} radius={14} fill={T.card} stroke={T.purple} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.purple} fontFamily={FONT.sans} text={'小的内存索引'} />
        </Rect>
        <Line ref={idxArrow} points={[[180, -180], [-10, -128]]} stroke={T.purple} lineWidth={3} endArrow end={0} />
      </Node>

      {/* g21：稀疏键集合 */}
      <Node ref={sparseG} opacity={0}>
        <Txt position={[0, -180]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'内存里的索引：只记部分键'} />
        {SPARSE.map((w, i) => (
          <Rect
            key={`sk-${i}`}
            ref={i === 1 ? bananaCard : ([0, 3, 6].includes(i) ? sparseMarks[[0, 3, 6].indexOf(i)] : undefined)}
            position={[-480 + i * 120, -60]}
            width={110}
            height={56}
            fill={T.card}
            stroke={T.line}
            lineWidth={2}
          >
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={w} />
          </Rect>
        ))}
        <Rect ref={lvPlate} position={[0, 90]} width={360} height={80} radius={14} fill={T.card} stroke={T.purple} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.purple} fontFamily={FONT.mono} text={'LevelDB'} />
        </Rect>
      </Node>

      {/* g21b–g27：字符自动机 */}
      <Node ref={trieG} opacity={0}>
        <Circle position={[-500, -60]} width={56} height={56} fill={T.card} stroke={T.text} lineWidth={3} />
        <Txt position={[-500, -60]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'根'} />
        <Line points={[[-472, -80], [-420, -200]]} stroke={T.line} lineWidth={2} />
        <Line points={[[-472, -60], [-420, -60]]} stroke={T.line} lineWidth={2} />
        <Line points={[[-472, -40], [-420, 80]]} stroke={T.line} lineWidth={2} />
        {'banana'.split('').slice(0, 5).map((_, i) => (
          <Line key={`bl-${i}`} points={[tpos(i, -200), tpos(i + 1, -200)]} stroke={T.line} lineWidth={2} />
        ))}
        {'banana'.split('').map((ch, i) => (
          <Circle key={`bn-${i}`} ref={banNodes[i]} position={tpos(i, -200)} width={52} height={52} fill={T.card} stroke={T.blue} lineWidth={2}>
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={ch} />
          </Circle>
        ))}
        <Node ref={orgG}>
          {'orange'.split('').slice(0, 5).map((_, i) => (
            <Line key={`ol-${i}`} points={[tpos(i, -60), tpos(i + 1, -60)]} stroke={T.line} lineWidth={2} />
          ))}
          {'orange'.split('').map((ch, i) => (
            <Circle key={`on-${i}`} ref={orgNodes[i]} position={tpos(i, -60)} width={52} height={52} fill={T.card} stroke={T.blue} lineWidth={2}>
              <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={ch} />
            </Circle>
          ))}
        </Node>
        <Node ref={manG}>
          {'mango'.split('').slice(0, 4).map((_, i) => (
            <Line key={`ml-${i}`} points={[tpos(i, 80), tpos(i + 1, 80)]} stroke={T.line} lineWidth={2} />
          ))}
          {'mango'.split('').map((ch, i) => (
            <Circle key={`mn-${i}`} ref={manNodes[i]} position={tpos(i, 80)} width={52} height={52} fill={T.card} stroke={T.blue} lineWidth={2}>
              <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={ch} />
            </Circle>
          ))}
        </Node>
        <Circle ref={pointer} position={[-500, -60]} width={68} height={68} stroke={T.yellow} lineWidth={4} opacity={0} />
        <Txt ref={skipTag} position={[0, -260]} fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.sans} text={'多一个 n，跳过它'} opacity={0} />
        <Txt ref={hitTag} position={[240, -280]} fontSize={SIZE.body} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'命中'} opacity={0} />
        <Txt ref={editCount} position={[60, -140]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} text={'编辑距离：1'} opacity={0} />
        <Rect ref={lucPlate} position={[330, -200]} width={300} height={90} radius={14} fill={T.card} stroke={T.purple} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.purple} fontFamily={FONT.mono} text={'Lucene'} />
        </Rect>
        <Txt ref={lucTag} position={[330, -120]} fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.sans} text={'默认编辑距离 1–2'} opacity={0} />
        <Txt key="qa-ignore-剪枝打叉-orange" ref={cutX1} position={[-420, -60]} fontSize={48} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'✗'} opacity={0} />
        <Txt key="qa-ignore-剪枝打叉-mango" ref={cutX2} position={[-420, 80]} fontSize={48} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'✗'} opacity={0} />
        <Line ref={walkArrow} points={[[-500, -130], [-60, -130]]} stroke={T.green} lineWidth={3} endArrow end={0} />
        <Txt ref={walkLab} position={[60, -100]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} text={'一次遍历求交'} opacity={0} />
      </Node>
      <Node ref={queryG} opacity={0}>
        {'bannana'.split('').map((ch, i) => (
          <Txt
            key={`q-${i}`}
            ref={queryRefs[i]}
            position={[-105 + i * 35, -280]}
            fontSize={SIZE.label}
            fill={T.muted}
            fontFamily={FONT.mono}
            text={ch}
          />
        ))}
        <Txt position={[-190, -280]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'查：'} />
      </Node>
      {extTag}

      {/* r4 B26：偏移数字与本例界限 */}
      <Txt ref={offsetTxt} position={[330, -40]} fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.sans} text={'banana → 偏移 128'} opacity={0} />
      <Txt ref={lucExTxt} position={[330, -60]} fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.sans} text={'本例：用 1 次，还继续找距离 2 的词'} opacity={0} />

      {/* r6 P2-5：距离 2 的例词卡 */}
      <Rect ref={ex2Card} position={[0, 165]} width={720} height={100} radius={14} fill={T.card} stroke={T.yellow} lineWidth={2} opacity={0}>
        <Txt ref={ex2Line1} position={[0, -22]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'距离 2 的例子：bannana → bananas'} />
        <Txt ref={ex2Line2} position={[0, 22]} fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.sans} text={'删掉多余的 n，再加一个 s'} />
      </Rect>

      {/* g27：逐个比对打叉 */}
      <Node ref={sweepG} opacity={0}>
        <Txt position={[0, 150]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'逐个比对全词典'} />
        {WORDS.map((w, i) => (
          <Rect key={`sw-${i}`} position={[-360 + i * 120, 192]} width={110} height={50} fill={T.card} stroke={T.line} lineWidth={2}>
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={w} />
          </Rect>
        ))}
        <Rect ref={sweepBar} position={[-360, 192]} width={110} height={50} stroke={T.red} lineWidth={3} opacity={0} />
        <Txt ref={sweepX} position={[360, 262]} fontSize={48} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'✗'} opacity={0} />
      </Node>
    </>
  );

  say('精确查不到相似键');
  yield* beat('g16',
    all(exactG().opacity(1, 0.5)),
    at('默认数据精确', exactTick().opacity(1, 0.4)),
    at('搜不了相似的键', missG().opacity(1, 0.5)),
    at('打成了 bannana', missX().opacity(1, 0.4)),
  );

  say('多一个 n，编辑距离 1');
  yield* beat('g17',
    all(exactG().opacity(0, 0.5), missG().opacity(0, 0.5), lettersG().opacity(1, 0.5)),
    at('多了一个 n', chain(letterRefs[3]().fill(T.yellow, 0.4), extraTag().opacity(1, 0.4))),
    at('编辑距离是一', chain(stateTxt().text('编辑距离：1', 0), stateTxt().opacity(1, 0.4))),
    at('同义词', brSyn().opacity(1, 0.4)),
    at('变体', brVar().opacity(1, 0.4)),
    at('邻近词', brNear().opacity(1, 0.4)),
    // r6 P2-8：三者与编辑距离是不同的扩法——三条枝逐个再 pulse 一次
    at('意思相近的词', chain(brSyn().scale(1.08, 0.3), brSyn().scale(1, 0.3))),
    at('同一个词的不同形式', chain(brVar().scale(1.08, 0.3), brVar().scale(1, 0.3))),
    at('挨着出现的词', chain(brNear().scale(1.08, 0.3), brNear().scale(1, 0.3))),
    at('不同的扩法', chain(
      all(brSyn().scale(1.08, 0.3), brVar().scale(1.08, 0.3), brNear().scale(1.08, 0.3)),
      all(brSyn().scale(1, 0.3), brVar().scale(1, 0.3), brNear().scale(1, 0.3)),
    )),
  );

  say('增、删或替换一个字母');
  yield* beat('g18',
    all(lettersG().opacity(0, 0.5), stateTxt().opacity(0, 0.4), opG().opacity(1, 0.5)),
    at('增', opAdd().opacity(1, 0.4)),
    at('删', opDel().opacity(1, 0.4)),
    at('替换', opSub().opacity(1, 0.4)),
  );

  say('cat → cats / ct / cut');
  yield* beat('g19',
    all(opG().opacity(0, 0.5), catG().opacity(1, 0.5)),
    at('加一个字母变 cats', catAdd().opacity(1, 0.4)),
    at('删一个字母变 ct', catDel().opacity(1, 0.4)),
    at('换一个字母变 cut', catSub().opacity(1, 0.4)),
  );

  say('小索引指到偏移处');
  yield* beat('g20',
    all(catG().opacity(0, 0.5), dictG().opacity(1, 0.5)),
    at('小的内存索引', all(idxPlate().opacity(1, 0.4), idxArrow().end(1, 0.8))),
    at('到哪个偏移处找键', dictHi().opacity(1, 0.4)),
    // r5 #3：banana→128 走的是 Lucene 的自动机，每个词对应一个偏移
    at('自动机走到哪个词', chain(idxPlate().scale(1.05, 0.3), idxPlate().scale(1, 0.3))),
    // r4 B26：给一个偏移数字（演示数字）
    at('偏移一百二十八处', offsetTxt().opacity(1, 0.4)),
  );

  say('LevelDB：稀疏键');
  yield* beat('g21',
    all(dictG().opacity(0, 0.5), sparseG().opacity(1, 0.5), offsetTxt().opacity(0, 0.4)),
    at('稀疏集合', all(...sparseMarks.map(m => all(m().stroke(T.yellow, 0.4), m().lineWidth(3, 0.4))))),
    at('隔几个键才记一个', lvPlate().opacity(1, 0.4)),
    // r5 #3：稀疏集合是 LevelDB 的做法——查 banana 先找不大于它的最近记过键 apple，再往后扫
    at('先找到不大于它的最近一个记过的键', chain(sparseMarks[0]().scale(1.1, 0.3), sparseMarks[0]().scale(1, 0.3))),
    at('再往后扫到它', all(bananaCard().stroke(T.yellow, 0.4), bananaCard().lineWidth(3, 0.4))),
  );

  say('字符自动机，像分叉树');
  yield* beat('g21b',
    all(sparseG().opacity(0, 0.5), trieG().opacity(1, 0.5)),
    at('字符上的有限状态自动机', queryG().opacity(1, 0.4)),
    at('像分叉的树', pointer().opacity(1, 0.4)),
  );

  say('状态：读了几个字母、已用几次编辑');
  yield* beat('g22',
    at('沿着字符走', chain(
      pointer().position(tpos(0, -200), 1.0),
      chain(stateTxt().text('读了 1 个字母 · 已用 0 次编辑', 0), stateTxt().opacity(1, 0.4), queryRefs[0]().fill(T.yellow, 0.3)),
      pointer().position(tpos(1, -200), 1.0),
      chain(stateTxt().text('读了 2 个字母 · 已用 0 次编辑', 0), queryRefs[1]().fill(T.yellow, 0.3)),
      pointer().position(tpos(2, -200), 1.0),
      chain(stateTxt().text('读了 3 个字母 · 已用 0 次编辑', 0), queryRefs[2]().fill(T.yellow, 0.3)),
    )),
    at('每个状态', stateTxt().fill(T.yellow, 0.4)),
    at('读了几个字母、已用几次编辑', extTag.opacity(1, 0.4)),
  );

  say('多一个 n，跳过它');
  yield* beat('g23',
    // r4 B26：旁白念出跳过一步（r3 只在画面上）
    at('走到 b、a、n', chain(
      skipTag().opacity(1, 0.4),
      queryRefs[3]().fill(T.red, 0.4),
    )),
    at('跳过它', chain(
      chain(stateTxt().text('读了 4 个字母 · 已用 1 次编辑', 0)),
      pointer().position(tpos(3, -200), 1.0),
    )),
    // r5 #4：跳过的那个字母也算读过——“读了几个字母”是消耗掉的查询词字母数
    at('跳过的字母也算读过', chain(stateTxt().scale(1.08, 0.3), stateTxt().scale(1, 0.3))),
    at('再走 a、n、a', chain(
      chain(queryRefs[4]().fill(T.yellow, 0.3)),
      pointer().position(tpos(4, -200), 1.0),
      chain(queryRefs[5]().fill(T.yellow, 0.3)),
      pointer().position(tpos(5, -200), 1.0),
      chain(queryRefs[6]().fill(T.yellow, 0.3)),
    )),
    at('已用一次编辑', stateTxt().text('读了 7 个字母 · 已用 1 次编辑', 0)),
    at('继续往下走', pointer().scale(1.15, 0.3)),
  );

  say('找到 banana，命中');
  yield* beat('g24',
    all(skipTag().opacity(0, 0.4)),
    at('找到 banana', all(banNodes[5]().stroke(T.green, 0.4), banNodes[5]().lineWidth(4, 0.4), hitTag().opacity(1, 0.4))),
    at('编辑距离一以内，命中', all(editCount().opacity(1, 0.4), pointer().scale(1, 0.3))),
    // r4 B26：命中后跳到同一个偏移数字
    at('跳到偏移一百二十八处', offsetTxt().opacity(1, 0.4)),
  );

  say('默认编辑距离 1–2');
  yield* beat('g25',
    all(lucPlate().opacity(1, 0.5), offsetTxt().opacity(0, 0.4)),
    at('默认搜编辑距离一到二以内', all(lucTag().opacity(1, 0.4), extTag.opacity(1, 0.4))),
    // r4 B26：点明本例界限（只用 1 次，上限是 2）
    at('上限是二', lucExTxt().opacity(1, 0.4)),
    // r5 #6：找到距离 1 的词之后，还继续找距离 2 的词
    at('还继续找距离二的词', chain(lucExTxt().scale(1.08, 0.3), lucExTxt().scale(1, 0.3))),
    // r6 P2-5：距离 2 的例词 bananas（删多余的 n、加一个 s，两处编辑）
    at('比如 bananas', ex2Card().opacity(1, 0.5)),
    at('两处编辑', chain(ex2Card().scale(1.04, 0.3), ex2Card().scale(1, 0.3))),
  );

  say('走偏了，剪掉');
  yield* beat('g26',
    at('走偏的分支呢', all(
      orgG().opacity(0.25, 0.5),
      cutX1().opacity(1, 0.4),
    )),
    // r6 P2-6a：计数规则——每个对不上的字母算一次替换
    // 状态牌随演示一步步走：先讲计数规则，再讲上限规则，走到第 1 个字母计 1 次，走到第 3 个字母才给结论
    // （r5 抽帧：旧版第 3 个字母的高亮只是暗色小圆环变色，低于定格检测阈值，拍内静止 6.37s；
    //  在“用掉一次编辑”处加状态牌计数更新 + 第 2 个字母高亮，把静止拆成三段短间隔）
    at('每个对不上的字母', chain(
      stateTxt().text('每个对不上的字母，算一次替换', 0),
      stateTxt().opacity(1, 0.4),
    )),
    at('超过上限二', chain(
      stateTxt().text('上限 2：编辑次数一超过就剪掉', 0),
      stateTxt().opacity(1, 0.4),
    )),
    at('第一个字母', chain(orgNodes[0]().stroke(T.red, 0.4), orgNodes[0]().lineWidth(4, 0.4))),
    at('用掉一次编辑', chain(
      stateTxt().text('orange：第 1 个字母用了 1 次编辑', 0),
      orgNodes[1]().stroke(T.red, 0.4), orgNodes[1]().lineWidth(4, 0.4),
    )),
    at('第三个字母', chain(
      stateTxt().text('orange：走到第 3 个字母，用了 3 次编辑，超过上限 2', 0),
      orgNodes[2]().stroke(T.red, 0.4), orgNodes[2]().lineWidth(4, 0.4),
    )),
    at('这条分支剪掉', chain(cutX1().scale(1.2, 0.3), cutX1().scale(1, 0.3))),
    // r6 P2-6b：mango 这条也一样——走到第 5 个字母用 3 次，同样剪掉
    // （m 对 b 1 次、a 对 a、n 对 n、g 对 n 2 次、o 对 a 3 次；已验算）
    at('mango 这条也一样', all(
      manG().opacity(0.25, 0.5),
      manNodes[4]().stroke(T.red, 0.4), manNodes[4]().lineWidth(4, 0.4),
    )),
    at('第五个字母', chain(
      stateTxt().text('mango：走到第 5 个字母，用了 3 次编辑，超过上限 2', 0),
      stateTxt().scale(1.05, 0.3), stateTxt().scale(1, 0.3),
    )),
    at('同样剪掉', cutX2().opacity(1, 0.4)),
  );

  say('一次遍历求交');
  yield* beat('g27',
    all(sweepG().opacity(1, 0.5), stateTxt().opacity(0, 0.4), ex2Card().opacity(0, 0.4)),
    at('不用逐个比对全词典', chain(sweepBar().opacity(1, 0.3), sweepBar().position([-360 + 6 * 120, 192], 1.2), sweepX().opacity(1, 0.4))),
    at('一次遍历求交', chain(walkArrow().end(1, 1.2), walkLab().opacity(1, 0.4))),
    at('直接剪掉', all(cutX1().scale(1.2, 0.3), cutX2().scale(1.2, 0.3))),
    // r6 P2-4：自动机不是猜哪条路对——跳过、替换、增删的走法同时都试，走得通的留下
    at('同时都试', chain(
      stateTxt().text('跳过、替换、增删，同时都试', 0),
      stateTxt().opacity(1, 0.4),
    )),
  );
});
