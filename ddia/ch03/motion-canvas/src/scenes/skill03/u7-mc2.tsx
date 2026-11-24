// U7 场景 2（MC）：b13–b21 —— 精确查不到相似键、同义词/变体/邻近词、
// 编辑距离 1（cat → cats/ct/cut）、Lucene 词典小索引、LevelDB 稀疏键、字符自动机、莱文斯坦自动机。
// 分镜：skill-ch03/beats-u7.md；原文：DDIA §3.6 后半（书页 p88）。
// 时长全部来自 timeline/u7.json（beat() 驱动），不手写 waitFor。
import {Circle, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, chain, createRef} from '@motion-canvas/core';
import {at, makeBeats} from '../../lib/beats';
import {FONT, SAFE, SIZE, T} from '../../lib/theme';
import timeline from '../../timeline/u7.json';

export default makeScene2D(function* (view) {
  view.fill(T.bg);
  const beat = makeBeats(timeline);

  const header = createRef<Txt>();
  const anchor = createRef<Txt>();
  const say = (text: string) => anchor().text(text);

  // 精确查找 vs 拼错的词
  const exactG = createRef<Node>();
  const exactCard = createRef<Rect>();
  const exactTick = createRef<Txt>();
  const missCard = createRef<Rect>();
  const missX = createRef<Txt>();

  // 一个词的三条枝
  const branchG = createRef<Node>();
  const centerWord = createRef<Rect>();
  const brSyn = createRef<Rect>();
  const brVar = createRef<Rect>();
  const brNear = createRef<Rect>();
  const brLine1 = createRef<Line>();
  const brLine2 = createRef<Line>();
  const brLine3 = createRef<Line>();

  // Lucene
  const lucG = createRef<Node>();
  const lucPlate = createRef<Rect>();
  const lucArrow = createRef<Line>();
  const lucFound = createRef<Rect>();

  // 编辑距离 1：cat 三变
  const editG = createRef<Node>();
  const catWord = createRef<Txt>();
  const edAdd = createRef<Rect>();
  const edDel = createRef<Rect>();
  const edSub = createRef<Rect>();
  const edLine1 = createRef<Line>();
  const edLine2 = createRef<Line>();
  const edLine3 = createRef<Line>();

  // 词典 + 小索引
  const dictG = createRef<Node>();
  const memIdx = createRef<Rect>();
  const idxArrow = createRef<Line>();
  const offMark = createRef<Rect>();
  const sparse1 = createRef<Circle>();
  const sparse2 = createRef<Circle>();
  const lvlPlate = createRef<Rect>();

  // 字符自动机（trie：cat / cut / dog）
  const trieG = createRef<Node>();
  const trieHi = createRef<Circle>();
  const levTag = createRef<Txt>();
  const levRing = createRef<Rect>();

  // 文档分类 / 机器学习
  const mlG = createRef<Node>();
  const mlCls = createRef<Rect>();
  const mlLearn = createRef<Rect>();

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

      {/* 精确查找 */}
      <Node ref={exactG} opacity={0}>
        <Rect ref={exactCard} position={[0, -80]} width={520} height={130} radius={16} fill={T.card} stroke={T.green} lineWidth={3} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'精确查找'} />
        </Rect>
        <Txt ref={exactTick} position={[220, -80]} fontSize={SIZE.title} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'✓'} opacity={0} />
        <Rect ref={missCard} position={[0, 110]} width={520} height={110} radius={16} fill={T.card} stroke={T.red} lineWidth={3} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'拼错的词'} />
        </Rect>
        <Txt ref={missX} position={[220, 110]} fontSize={SIZE.title} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'✗'} opacity={0} />
      </Node>

      {/* 一个词的三条枝 */}
      <Node ref={branchG} opacity={0}>
        <Rect ref={centerWord} position={[0, -160]} width={360} height={90} radius={16} fill={T.card} stroke={T.blue} lineWidth={3} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'一个词'} />
        </Rect>
        <Line ref={brLine1} points={[[-120, -115], [-380, -20]]} stroke={T.line} lineWidth={2} opacity={0} />
        <Line ref={brLine2} points={[[0, -115], [0, -20]]} stroke={T.line} lineWidth={2} opacity={0} />
        <Line ref={brLine3} points={[[120, -115], [380, -20]]} stroke={T.line} lineWidth={2} opacity={0} />
        <Rect ref={brSyn} position={[-380, 40]} width={300} height={100} radius={14} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'同义词'} />
        </Rect>
        <Rect ref={brVar} position={[0, 40]} width={300} height={100} radius={14} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'语法变体'} />
        </Rect>
        <Rect ref={brNear} position={[380, 40]} width={300} height={100} radius={14} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'邻近词'} />
        </Rect>
      </Node>

      {/* Lucene */}
      <Node ref={lucG} opacity={0}>
        <Rect ref={lucPlate} position={[0, -160]} width={360} height={90} radius={14} fill={T.card} stroke={T.purple} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.purple} fontFamily={FONT.mono} text={'Lucene'} />
        </Rect>
        <Rect position={[-260, 20]} width={360} height={100} radius={14} fill={T.card} stroke={T.red} lineWidth={2}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'拼错的词'} />
        </Rect>
        <Line ref={lucArrow} points={[[-60, 20], [60, 20]]} stroke={T.green} lineWidth={3} endArrow opacity={0} />
        <Rect ref={lucFound} position={[260, 20]} width={360} height={100} radius={14} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'编辑距离内的词'} />
        </Rect>
      </Node>

      {/* 编辑距离 1 */}
      <Node ref={editG} opacity={0}>
        <Txt ref={catWord} position={[0, -180]} fontSize={72} fontWeight={700} fill={T.text} fontFamily={FONT.mono} text={'cat'} opacity={0} />
        <Line ref={edLine1} points={[[-120, -120], [-380, -30]]} stroke={T.line} lineWidth={2} opacity={0} />
        <Line ref={edLine2} points={[[0, -120], [0, -30]]} stroke={T.line} lineWidth={2} opacity={0} />
        <Line ref={edLine3} points={[[120, -120], [380, -30]]} stroke={T.line} lineWidth={2} opacity={0} />
        <Rect ref={edAdd} position={[-380, 40]} width={320} height={120} radius={14} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt position={[0, -28]} fontSize={SIZE.body} fontWeight={700} fill={T.green} fontFamily={FONT.mono} text={'cats'} />
          <Txt position={[0, 28]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'加一个字母'} />
        </Rect>
        <Rect ref={edDel} position={[0, 40]} width={320} height={120} radius={14} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt position={[0, -28]} fontSize={SIZE.body} fontWeight={700} fill={T.green} fontFamily={FONT.mono} text={'ct'} />
          <Txt position={[0, 28]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'删一个字母'} />
        </Rect>
        <Rect ref={edSub} position={[380, 40]} width={320} height={120} radius={14} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt position={[0, -28]} fontSize={SIZE.body} fontWeight={700} fill={T.green} fontFamily={FONT.mono} text={'cut'} />
          <Txt position={[0, 28]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'换一个字母'} />
        </Rect>
      </Node>

      {/* 词典 + 小索引 */}
      <Node ref={dictG} opacity={0}>
        <Rect ref={memIdx} position={[0, -215]} width={420} height={70} radius={14} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'小的内存索引'} />
        </Rect>
        <Line ref={idxArrow} points={[[0, -180], [0, -118]]} stroke={T.yellow} lineWidth={3} endArrow opacity={0} />
        <Rect position={[0, 0]} width={700} height={240} radius={16} fill={T.card} stroke={T.line} lineWidth={2} />
        <Txt position={[-290, -90]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.mono} text={'apple'} />
        <Txt position={[-290, -30]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.mono} text={'cat'} />
        <Txt position={[-290, 30]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.mono} text={'dog'} />
        <Txt position={[-290, 90]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.mono} text={'fish'} />
        <Rect ref={offMark} position={[0, -30]} width={700} height={60} stroke={T.yellow} lineWidth={3} opacity={0} />
        <Circle ref={sparse1} position={[-340, -90]} width={18} height={18} fill={T.yellow} opacity={0} />
        <Circle ref={sparse2} position={[-340, 30]} width={18} height={18} fill={T.yellow} opacity={0} />
        <Rect ref={lvlPlate} position={[0, 170]} width={360} height={64} radius={14} fill={T.card} stroke={T.purple} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.purple} fontFamily={FONT.mono} text={'LevelDB'} />
        </Rect>
      </Node>

      {/* 字符自动机 */}
      <Node ref={trieG} opacity={0}>
        <Circle position={[0, -210]} width={54} height={54} fill={T.card} stroke={T.blue} lineWidth={3}>
          <Txt fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.mono} text={'·'} />
        </Circle>
        <Line points={[[-20, -190], [-200, -140]]} stroke={T.line} lineWidth={2} />
        <Line points={[[20, -190], [200, -140]]} stroke={T.line} lineWidth={2} />
        <Circle ref={trieHi} position={[-220, -120]} width={54} height={54} fill={T.card} stroke={T.blue} lineWidth={3} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'c'} />
        </Circle>
        <Circle position={[220, -120]} width={54} height={54} fill={T.card} stroke={T.blue} lineWidth={3}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'d'} />
        </Circle>
        <Line points={[[-240, -100], [-310, -50]]} stroke={T.line} lineWidth={2} />
        <Line points={[[-200, -100], [-130, -50]]} stroke={T.line} lineWidth={2} />
        <Line points={[[220, -100], [220, -50]]} stroke={T.line} lineWidth={2} />
        <Circle position={[-330, -30]} width={54} height={54} fill={T.card} stroke={T.blue} lineWidth={3}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'a'} />
        </Circle>
        <Circle position={[-110, -30]} width={54} height={54} fill={T.card} stroke={T.blue} lineWidth={3}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'u'} />
        </Circle>
        <Circle position={[220, -30]} width={54} height={54} fill={T.card} stroke={T.blue} lineWidth={3}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'o'} />
        </Circle>
        <Line points={[[-330, -10], [-360, 40]]} stroke={T.line} lineWidth={2} />
        <Line points={[[-110, -10], [-80, 40]]} stroke={T.line} lineWidth={2} />
        <Line points={[[220, -10], [220, 40]]} stroke={T.line} lineWidth={2} />
        <Circle position={[-380, 60]} width={54} height={54} fill={T.card} stroke={T.blue} lineWidth={3}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'t'} />
        </Circle>
        <Circle position={[-60, 60]} width={54} height={54} fill={T.card} stroke={T.blue} lineWidth={3}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'t'} />
        </Circle>
        <Circle position={[220, 60]} width={54} height={54} fill={T.card} stroke={T.blue} lineWidth={3}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'g'} />
        </Circle>
        <Rect ref={levRing} position={[-85, 15]} width={220} height={190} stroke={T.yellow} lineWidth={3} opacity={0} />
        <Txt ref={levTag} position={[0, 170]} fontSize={SIZE.body} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'莱文斯坦自动机'} opacity={0} />
      </Node>

      {/* 文档分类 / 机器学习 */}
      <Node ref={mlG} opacity={0}>
        <Rect ref={mlCls} position={[-280, 0]} width={380} height={140} radius={16} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'文档分类'} />
        </Rect>
        <Rect ref={mlLearn} position={[280, 0]} width={380} height={140} radius={16} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'机器学习'} />
        </Rect>
      </Node>
    </>
  );

  say('精确查不到相似键');
  yield* beat('b13',
    all(exactG().opacity(1, 0.5), exactCard().opacity(1, 0.5), exactTick().opacity(1, 0.4)),
    at('默认数据精确', exactCard().stroke(T.yellow, 0.4)),
    at('搜不了相似的键', all(missCard().opacity(1, 0.5), missX().opacity(1, 0.4))),
  );

  say('同义词、变体、邻近词');
  yield* beat('b14',
    all(exactG().opacity(0, 0.5), branchG().opacity(1, 0.5), centerWord().opacity(1, 0.5)),
    at('同义词', all(brLine1().opacity(1, 0.4), brSyn().opacity(1, 0.5))),
    at('语法变体', all(brLine2().opacity(1, 0.4), brVar().opacity(1, 0.5))),
    at('彼此靠近的词', all(brLine3().opacity(1, 0.4), brNear().opacity(1, 0.5))),
  );

  say('拼错了也找得到');
  yield* beat('b15',
    all(branchG().opacity(0, 0.5), lucG().opacity(1, 0.5)),
    at('Lucene', lucPlate().opacity(1, 0.5)),
    at('编辑距离', all(lucArrow().opacity(1, 0.5), lucFound().opacity(1, 0.5))),
  );

  say('增、删或替换一个字母');
  yield* beat('b16',
    all(lucG().opacity(0, 0.5), editG().opacity(1, 0.5)),
    at('编辑距离一', catWord().opacity(1, 0.5)),
    at('增', all(edLine1().opacity(1, 0.4), edAdd().opacity(1, 0.5))),
    at('删', all(edLine2().opacity(1, 0.4), edDel().opacity(1, 0.5))),
    at('替换', all(edLine3().opacity(1, 0.4), edSub().opacity(1, 0.5))),
  );

  say('小索引指到偏移处');
  yield* beat('b17',
    all(editG().opacity(0, 0.5), dictG().opacity(1, 0.5)),
    at('小的内存索引', memIdx().opacity(1, 0.5)),
    at('偏移处', all(idxArrow().opacity(1, 0.5), offMark().opacity(1, 0.5))),
  );

  say('LevelDB：稀疏键集合');
  yield* beat('b18',
    at('LevelDB', lvlPlate().opacity(1, 0.5)),
    at('稀疏集合', all(sparse1().opacity(1, 0.5), sparse2().opacity(1, 0.5))),
  );

  say('字符自动机，像分叉树');
  yield* beat('b19',
    all(dictG().opacity(0, 0.5), trieG().opacity(1, 0.5)),
    at('有限状态自动机', trieHi().opacity(1, 0.5)),
    at('按字母分叉', trieHi().stroke(T.yellow, 0.4)),
  );

  say('转成莱文斯坦自动机');
  yield* beat('b20',
    at('莱文斯坦自动机', all(levRing().opacity(1, 0.5), levTag().opacity(1, 0.5))),
    at('给定编辑距离内的词', levRing().stroke(T.green, 0.5)),
  );

  say('分类、机器学习方向');
  yield* beat('b21',
    all(trieG().opacity(0, 0.5), mlG().opacity(1, 0.5), mlCls().opacity(1, 0.5)),
    at('文档分类', mlCls().stroke(T.yellow, 0.4)),
    at('机器学习', mlLearn().opacity(1, 0.5)),
    at('信息检索教材', chain(
      all(mlCls().scale(1.03, 0.3), mlLearn().scale(1.03, 0.3)),
      all(mlCls().scale(1.0, 0.3), mlLearn().scale(1.0, 0.3)),
    )),
  );
});
