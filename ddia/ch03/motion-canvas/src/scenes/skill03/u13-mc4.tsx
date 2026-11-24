// U13 场景 4（MC）：b26–b37 —— 读快写难、原地更新行不通、LSM 式写缓冲、查询两边拼结果、结尾回扣。
// 分镜：skill-ch03/beats-u13.md；原文：DDIA §3.13（书页 p101，PDF p123）。
// 猫视频回扣用 U2 的计数：mew 1082、purr 2114、yawn 511、scratch 252（只留最新值）。
// 时长全部来自 timeline/u13.json（beat() 驱动），不手写 waitFor。
import {Circle, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, chain, createRef} from '@motion-canvas/core';
import {at, makeBeats} from '../../lib/beats';
import {FONT, SAFE, SIZE, T} from '../../lib/theme';
import timeline from '../../timeline/u13.json';

export default makeScene2D(function* (view) {
  view.fill(T.bg);
  const beat = makeBeats(timeline);

  const header = createRef<Txt>();
  const anchor = createRef<Txt>();
  const say = (text: string) => anchor().text(text);

  // b26–b30：天平与列文件
  const balance = createRef<Node>();
  const balBar = createRef<Rect>();
  const readLab = createRef<Txt>();
  const writeLab = createRef<Txt>();
  const writeLab2 = createRef<Txt>();
  const cols = createRef<Node>();
  const colStrips = [0, 1, 2].map(() => createRef<Rect>());
  const readArrow = createRef<Line>();
  const writeArrow = createRef<Line>();
  const analysts = createRef<Node>();
  const bigQuery = createRef<Node>();
  const thinWrite = createRef<Node>();
  const btree = createRef<Node>();
  const inplaceArrow = createRef<Line>();
  const inplaceX = createRef<Txt>();

  // b29–b30：已排序小表 + 位置编号
  const miniTab = createRef<Node>();
  const miniCells = [0, 1, 2, 3].map(() => [0, 1, 2].map(() => createRef<Rect>()));
  const newRow = createRef<Node>();
  const rewriteTag = createRef<Node>();
  const posNums = [0, 1, 2, 3].map(() => createRef<Txt>());
  const updateTag = createRef<Node>();

  // b31–b33 / b35–b36：磁盘列文件 + 内存盒
  const diskMem = createRef<Node>();
  const diskStrips = [0, 1, 2].map(() => createRef<Rect>());
  const memBox = createRef<Rect>();
  const memFill = createRef<Rect>();
  const memLab = createRef<Txt>();
  const lsmTag = createRef<Txt>();
  const memRows = [0, 1, 2].map(() => createRef<Rect>());
  const wArrows = [0, 1, 2].map(() => createRef<Line>());
  const rowCard = createRef<Node>();
  const colCard = createRef<Node>();
  const mergeArrow = createRef<Line>();
  const newFile = createRef<Node>();
  const verticaTag = createRef<Node>();

  // b34：猫视频
  const cats = createRef<Node>();
  const catCards = [0, 1, 2, 3].map(() => createRef<Rect>());
  const catOld = [0, 1, 2, 3].map(() => createRef<Txt>());
  const catNew = [0, 1, 2, 3].map(() => createRef<Txt>());
  const mergeChip = createRef<Node>();

  // b35–b37：查询拼结果 + 结尾
  const qDisk = createRef<Line>();
  const qMem = createRef<Line>();
  const resultChip = createRef<Node>();
  const optLid = createRef<Node>();
  const freshWrite = createRef<Node>();
  const resultCheck = createRef<Txt>();

  const CAT_NAMES = ['mew', 'purr', 'yawn', 'scratch'];
  const CAT_OLD = ['1078', '2103', '511', '252'];
  const CAT_NEW = ['1082', '2114', '511', '252'];
  const MINI = [
    ['140101', '32', '7'],
    ['140101', '69', '3'],
    ['140102', '32', '5'],
    ['140102', '33', '2'],
  ];

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

      {/* 天平：读 vs 写 */}
      <Node ref={balance} opacity={0}>
        <Rect ref={balBar} position={[0, -200]} width={700} height={14} radius={7} fill={T.line} />
        <Circle position={[0, -200]} width={26} height={26} fill={T.muted} />
        <Txt ref={readLab} position={[-320, -155]} fontSize={SIZE.body} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'读快'} opacity={0} />
        <Txt ref={writeLab} position={[320, -155]} fontSize={SIZE.body} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'写难'} opacity={0} />
        <Txt ref={writeLab2} position={[320, -155]} fontSize={SIZE.body} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'写有着落'} opacity={0} />
      </Node>
      <Node ref={cols} opacity={0}>
        {[0, 1, 2].map(i => (
          <Rect key={`cs-${i}`} ref={colStrips[i]} position={[-220 + i * 220, -20]} width={110} height={200} radius={10} fill={T.card} stroke={T.blue} lineWidth={2} />
        ))}
        <Line ref={readArrow} points={[[-560, -20], [-340, -20]]} stroke={T.green} lineWidth={3} endArrow opacity={0} />
        <Line ref={writeArrow} points={[[560, -20], [340, -20]]} stroke={T.red} lineWidth={3} endArrow opacity={0} />
      </Node>
      <Node ref={analysts} position={[0, 120]} opacity={0}>
        {[0, 1, 2].map(i => (
          <Circle key={`an-${i}`} position={[-120 + i * 120, 0]} width={64} height={64} fill={T.card} stroke={T.blue} lineWidth={2} />
        ))}
        <Txt position={[0, 60]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'分析师'} />
      </Node>
      <Node ref={bigQuery} position={[0, -250]} opacity={0}>
        <Rect width={420} height={60} radius={12} fill={T.card} stroke={T.blue} lineWidth={2}>
          <Txt fontSize={SIZE.label} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'大型只读查询'} />
        </Rect>
      </Node>
      <Node ref={thinWrite} position={[430, 120]} opacity={0}>
        <Line points={[[0, 0], [90, 0]]} stroke={T.red} lineWidth={2} endArrow />
        <Txt position={[45, -35]} fontSize={SIZE.label} fill={T.red} fontFamily={FONT.sans} text={'写很少'} />
      </Node>

      {/* B 树原地更新 */}
      <Node ref={btree} opacity={0}>
        <Rect position={[-420, -200]} width={120} height={48} radius={10} fill={T.card} stroke={T.blue} lineWidth={2}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'B 树'} />
        </Rect>
        <Rect position={[-480, -110]} width={100} height={44} radius={10} fill={T.card} stroke={T.line} lineWidth={2} />
        <Rect position={[-360, -110]} width={100} height={44} radius={10} fill={T.card} stroke={T.line} lineWidth={2} />
        <Line points={[[-420, -176], [-480, -132]]} stroke={T.line} lineWidth={2} />
        <Line points={[[-420, -176], [-360, -132]]} stroke={T.line} lineWidth={2} />
        <Line ref={inplaceArrow} points={[[-280, -130], [-180, -80]]} stroke={T.red} lineWidth={3} endArrow opacity={0} />
        <Txt ref={inplaceX} position={[-230, -150]} fontSize={48} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'✗'} opacity={0} />
      </Node>

      {/* 已排序小表 + 新行插入 */}
      <Node ref={miniTab} opacity={0}>
        {[0, 1, 2, 3].flatMap(r =>
          [0, 1, 2].map(c => (
            <Rect
              key={`mc-${r}-${c}`}
              ref={miniCells[r][c]}
              position={[-200 + c * 200, -160 + r * 50]}
              width={160}
              height={40}
              radius={8}
              fill={T.card}
              stroke={T.line}
              lineWidth={2}
            >
              <Txt fontSize={20} fill={T.text} fontFamily={FONT.mono} text={MINI[r][c]} />
            </Rect>
          )),
        )}
        {[0, 1, 2, 3].map(i => (
          <Txt key={`pn-${i}`} ref={posNums[i]} position={[-290, -160 + i * 50]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.mono} text={String(i + 1)} />
        ))}
      </Node>
      <Node ref={newRow} position={[0, 60]} opacity={0}>
        <Rect width={520} height={44} radius={8} fill={T.card} stroke={T.yellow} lineWidth={3}>
          <Txt fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.mono} text={'新行 140103 · 33 · 4'} />
        </Rect>
      </Node>
      <Node ref={rewriteTag} position={[0, 150]} opacity={0}>
        <Rect width={420} height={56} radius={12} fill={T.card} stroke={T.red} lineWidth={2}>
          <Txt fontSize={SIZE.label} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'全部列文件重写'} />
        </Rect>
      </Node>
      <Node ref={updateTag} position={[0, 150]} opacity={0}>
        <Rect width={420} height={56} radius={12} fill={T.card} stroke={T.red} lineWidth={2}>
          <Txt fontSize={SIZE.label} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'全部列都要更新'} />
        </Rect>
      </Node>

      {/* 磁盘列文件 + 内存盒 */}
      <Node ref={diskMem} opacity={0}>
        {[0, 1, 2].map(i => (
          <Rect key={`ds-${i}`} ref={diskStrips[i]} position={[-460 + i * 110, -60]} width={90} height={200} radius={10} fill={T.card} stroke={T.blue} lineWidth={2} />
        ))}
        <Txt position={[-350, -200]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'磁盘列文件'} />
        <Rect ref={memBox} position={[150, -60]} width={460} height={240} radius={16} fill={T.card} stroke={T.green} lineWidth={2} />
        <Rect ref={memFill} position={[150, -60]} width={420} height={10} radius={5} fill={T.green} opacity={0} />
        <Txt ref={memLab} position={[-110, -120]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'内存'} />
        <Txt ref={lsmTag} position={[150, -220]} fontSize={SIZE.label} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'LSM 树的思路'} opacity={0} />
        {[0, 1, 2].map(i => (
          <Rect key={`mr-${i}`} ref={memRows[i]} position={[150, -95 + i * 55]} width={380} height={44} radius={8} fill={T.bg} stroke={T.green} lineWidth={2} opacity={0}>
            <Txt fontSize={20} fill={T.text} fontFamily={FONT.mono} text={['140103 · 33 · 4', '140103 · 32 · 1', '140104 · 69 · 2'][i]} />
          </Rect>
        ))}
        {[0, 1, 2].map(i => (
          <Line key={`wa-${i}`} ref={wArrows[i]} points={[[60 + i * 90, 230], [60 + i * 90, 70]]} stroke={T.red} lineWidth={3} endArrow opacity={0} />
        ))}
        <Line ref={mergeArrow} points={[[-80, -60], [-290, -60]]} stroke={T.green} lineWidth={3} endArrow opacity={0} />
        <Node ref={newFile} position={[-350, 110]} opacity={0}>
          <Rect width={300} height={56} radius={12} fill={T.card} stroke={T.green} lineWidth={2}>
            <Txt fontSize={SIZE.label} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'新文件'} />
          </Rect>
        </Node>
        <Node ref={verticaTag} position={[-350, 180]} opacity={0}>
          <Rect width={300} height={52} radius={12} fill={T.card} stroke={T.purple} lineWidth={2}>
            <Txt fontSize={SIZE.label} fill={T.purple} fontFamily={FONT.mono} text={'Vertica 的做法'} />
          </Rect>
        </Node>
      </Node>
      <Node ref={rowCard} position={[-150, 150]} opacity={0}>
        <Rect width={240} height={52} radius={10} fill={T.card} stroke={T.blue} lineWidth={2}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'行式 ✓'} />
        </Rect>
      </Node>
      <Node ref={colCard} position={[150, 150]} opacity={0}>
        <Rect width={240} height={52} radius={10} fill={T.card} stroke={T.blue} lineWidth={2}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'列式 ✓'} />
        </Rect>
      </Node>

      {/* 猫视频回扣 */}
      <Node ref={cats} opacity={0}>
        {[0, 1, 2, 3].map(i => (
          <Rect
            key={`cat-${i}`}
            ref={catCards[i]}
            position={[-450 + i * 300, -60]}
            width={260}
            height={180}
            radius={16}
            fill={T.card}
            stroke={T.blue}
            lineWidth={2}
          >
            <Txt position={[0, -50]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.mono} text={CAT_NAMES[i]} />
            <Txt ref={catOld[i]} position={[0, 25]} fontSize={SIZE.title} fontWeight={700} fill={T.yellow} fontFamily={FONT.mono} text={CAT_OLD[i]} />
            <Txt ref={catNew[i]} position={[0, 25]} fontSize={SIZE.title} fontWeight={700} fill={T.green} fontFamily={FONT.mono} text={CAT_NEW[i]} opacity={0} />
            <Txt position={[0, 70]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'播放次数'} />
          </Rect>
        ))}
      </Node>
      <Node ref={mergeChip} position={[0, 150]} opacity={0}>
        <Rect width={420} height={56} radius={12} fill={T.card} stroke={T.green} lineWidth={2}>
          <Txt fontSize={SIZE.label} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'先攒着，再合并'} />
        </Rect>
      </Node>

      {/* 查询拼结果 */}
      <Line ref={qDisk} points={[[0, 230], [-350, 50]]} stroke={T.blue} lineWidth={3} endArrow opacity={0} />
      <Line ref={qMem} points={[[0, 230], [150, 70]]} stroke={T.green} lineWidth={3} endArrow opacity={0} />
      <Node ref={resultChip} position={[0, 170]} opacity={0}>
        <Rect width={420} height={56} radius={12} fill={T.card} stroke={T.blue} lineWidth={2}>
          <Txt fontSize={SIZE.label} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'查询结果：两边拼起来'} />
        </Rect>
      </Node>
      <Node ref={optLid} position={[-185, 108]} opacity={0}>
        <Rect width={220} height={56} radius={16} fill={T.bg} stroke={T.yellow} lineWidth={3}>
          <Txt fontSize={SIZE.label} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'查询优化器'} />
        </Rect>
      </Node>
      <Node ref={freshWrite} position={[150, -220]} opacity={0}>
        <Rect width={300} height={52} radius={12} fill={T.card} stroke={T.green} lineWidth={2}>
          <Txt fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} text={'新写的数据'} />
        </Rect>
      </Node>
      <Txt ref={resultCheck} position={[250, 170]} fontSize={SIZE.body} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'✓'} opacity={0} />
    </>
  );

  say('读快了，写难了');
  yield* beat('b26',
    all(balance().opacity(1, 0.4), cols().opacity(1, 0.4)),
    at('读快了', all(readLab().opacity(1, 0.4), readArrow().opacity(1, 0.4))),
    at('写却难了', all(writeLab().opacity(1, 0.4), writeArrow().opacity(1, 0.4), balBar().rotation(-0.1, 0.8))),
  );

  say('大多是只读查询');
  yield* beat('b27',
    at('分析师', analysts().opacity(1, 0.5)),
    at('大型只读查询', bigQuery().opacity(1, 0.5)),
    at('写本来就少', thinWrite().opacity(1, 0.5)),
  );

  say('原地更新行不通');
  yield* beat('b28',
    all(analysts().opacity(0, 0.4), bigQuery().opacity(0, 0.4), thinWrite().opacity(0, 0.4)),
    at('原地更新', all(btree().opacity(1, 0.5), inplaceArrow().opacity(1, 0.4))),
    at('行不通', all(inplaceX().opacity(1, 0.4), colStrips[0]().stroke(T.red, 0.4), colStrips[1]().stroke(T.red, 0.4), colStrips[2]().stroke(T.red, 0.4))),
  );

  say('中间插一行，全列重写');
  yield* beat('b29',
    all(balance().opacity(0, 0.4), cols().opacity(0, 0.4), btree().opacity(0, 0.4), miniTab().opacity(1, 0.5)),
    at('中间插一行', chain(
      newRow().opacity(1, 0.4),
      all(
        newRow().position([0, -60], 1.0),
        miniCells[2][0]().position([-200, -10], 0.8), miniCells[2][1]().position([0, -10], 0.8), miniCells[2][2]().position([200, -10], 0.8),
        miniCells[3][0]().position([-200, 40], 0.8), miniCells[3][1]().position([0, 40], 0.8), miniCells[3][2]().position([200, 40], 0.8),
        posNums[2]().position([-290, -10], 0.8), posNums[3]().position([-290, 40], 0.8),
      ),
    )),
    at('重写全部列文件', rewriteTag().opacity(1, 0.5)),
  );

  say('行由位置标识');
  yield* beat('b30',
    all(newRow().opacity(0, 0.4), rewriteTag().opacity(0, 0.4)),
    at('位置标识', chain(posNums[0]().fill(T.yellow, 0.3), posNums[1]().fill(T.yellow, 0.3), posNums[2]().fill(T.yellow, 0.3), posNums[3]().fill(T.yellow, 0.3))),
    at('一致地更新全部列', all(
      posNums[0]().fill(T.red, 0.4), posNums[1]().fill(T.red, 0.4), posNums[2]().fill(T.red, 0.4), posNums[3]().fill(T.red, 0.4),
      updateTag().opacity(1, 0.5),
    )),
  );

  say('借 LSM 树的思路');
  yield* beat('b31',
    all(miniTab().opacity(0, 0.4), updateTag().opacity(0, 0.4), diskMem().opacity(1, 0.5)),
    at('LSM 树的思路', all(lsmTag().opacity(1, 0.5), memBox().stroke(T.yellow, 0.4))),
  );

  say('写先进内存');
  yield* beat('b32',
    at('先进入内存', chain(wArrows[0]().opacity(1, 0.4), wArrows[1]().opacity(1, 0.4), wArrows[2]().opacity(1, 0.4))),
    at('已排序的结构', chain(memRows[0]().opacity(1, 0.4), memRows[1]().opacity(1, 0.4), memRows[2]().opacity(1, 0.4))),
    at('行式还是列式', all(rowCard().opacity(1, 0.4), colCard().opacity(1, 0.4))),
  );

  say('攒够一批，批量合并');
  yield* beat('b33',
    at('攒够', all(memFill().opacity(1, 0.5), memFill().height(180, 1.6))),
    at('合并', mergeArrow().opacity(1, 0.5)),
    at('批量写进新文件', newFile().opacity(1, 0.5)),
    at('Vertica 的做法', verticaTag().opacity(1, 0.5)),
  );

  say('猫视频：先攒着再合并');
  yield* beat('b34',
    all(diskMem().opacity(0, 0.5), rowCard().opacity(0, 0.4), colCard().opacity(0, 0.4), cats().opacity(1, 0.5)),
    at('猫视频', chain(catCards[0]().stroke(T.yellow, 0.3), catCards[1]().stroke(T.yellow, 0.3), catCards[2]().stroke(T.yellow, 0.3), catCards[3]().stroke(T.yellow, 0.3))),
    at('先攒着', mergeChip().opacity(1, 0.5)),
    at('只留最新值', all(
      catOld[0]().opacity(0, 0.4), catOld[1]().opacity(0, 0.4),
      catNew[0]().opacity(1, 0.4), catNew[1]().opacity(1, 0.4),
    )),
  );

  say('磁盘 + 内存，两边拼');
  yield* beat('b35',
    all(cats().opacity(0, 0.5), mergeChip().opacity(0, 0.4), diskMem().opacity(1, 0.5), newFile().opacity(0, 0.4), verticaTag().opacity(0, 0.4), memFill().opacity(0, 0.4)),
    at('磁盘上的列数据', qDisk().opacity(1, 0.5)),
    at('内存里的近期写', qMem().opacity(1, 0.5)),
    at('拼起来', resultChip().opacity(1, 0.5)),
  );

  say('优化器藏起区别');
  yield* beat('b36a',
    at('查询优化器', optLid().opacity(1, 0.5)),
    at('藏起来了', optLid().scale(1.03, 0.6)),
  );

  say('改完立刻看得到');
  yield* beat('b36b',
    all(lsmTag().opacity(0, 0.4)),
    at('刚改过的数据', freshWrite().opacity(1, 0.5)),
    at('立刻就能看到', all(resultCheck().opacity(1, 0.4), freshWrite().position([150, -200], 1.0))),
  );

  say('读和写各记一笔');
  yield* beat('b37',
    all(diskMem().opacity(0, 0.5), optLid().opacity(0, 0.4), freshWrite().opacity(0, 0.4), resultChip().opacity(0, 0.4), resultCheck().opacity(0, 0.4), qDisk().opacity(0, 0.4), qMem().opacity(0, 0.4),
      balance().opacity(1, 0.5), cols().opacity(1, 0.5), balBar().rotation(0, 0.8),
      colStrips[0]().stroke(T.blue, 0.4), colStrips[1]().stroke(T.blue, 0.4), colStrips[2]().stroke(T.blue, 0.4)),
    at('借老办法解决的', all(writeArrow().stroke(T.green, 0.5), writeLab().opacity(0, 0.4), writeLab2().opacity(1, 0.4))),
    at('读和写各记一笔', chain(readLab().scale(1.1, 0.5), writeLab2().scale(1.1, 0.5))),
  );
});
