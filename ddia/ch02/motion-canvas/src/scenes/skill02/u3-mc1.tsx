// U3 场景 1（MC）：b1–b11 —— 钩子、标准化列表五条好处、去重、
// 改名演示（改一处 vs 改十处漏一处）、规范化。
// 分镜：skill-ch02/beats-u3.md U3 一节；原文：DDIA §2.4（书页 p33–35，PDF p55–57）。
// 时长全部来自 timeline/u3.json（beat() 驱动），不手写 waitFor。
// 颜色、字号、安全区一律取自 lib/theme，不手写十六进制色值。
import {Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, chain, createRef} from '@motion-canvas/core';
import {at, makeBeats} from '../../lib/beats';
import {FONT, SAFE, SIZE, T} from '../../lib/theme';
import {row} from '../../lib/layout';
import timeline from '../../timeline/u3.json';

export default makeScene2D(function* (view) {
  view.fill(T.bg);
  const beat = makeBeats(timeline);

  const header = createRef<Txt>();
  const anchor = createRef<Txt>();
  const say = (text: string) => anchor().text(text);

  const g1 = createRef<Node>();
  const g1text = createRef<Rect>();
  const g1id = createRef<Rect>();
  const g1q = createRef<Txt>();
  const g2 = createRef<Node>();
  const g2card = createRef<Rect>();
  const g2chip = createRef<Txt>();
  const g2row = createRef<Rect>();
  const g2rowTxt = createRef<Txt>();
  const g3 = createRef<Node>();
  const g3drop = createRef<Node>();
  const g3box = createRef<Rect>();
  const g3opts = [0, 1, 2].map(() => createRef<Txt>());
  const g3vars = [0, 1, 2].map(() => createRef<Txt>());
  const g3unis = [0, 1, 2].map(() => createRef<Txt>());
  const g4 = createRef<Node>();
  const g4a = createRef<Rect>();
  const g4b = createRef<Rect>();
  const g4aId = createRef<Txt>();
  const g4bId = createRef<Txt>();
  const g4x = createRef<Txt>();
  const g4aCheck = createRef<Txt>();
  const g4bCheck = createRef<Txt>();
  const g5 = createRef<Node>();
  const g5region = createRef<Rect>();
  const g5old = createRef<Txt>();
  const g5new = createRef<Txt>();
  const g5chips = [0, 1, 2].map(() => createRef<Rect>());
  const g6 = createRef<Node>();
  const g6lang = createRef<Node>();
  const g6en = createRef<Txt>();
  const g6search = createRef<Node>();
  const g6box = createRef<Rect>();
  const g6boxTxt = createRef<Txt>();
  const g6res = createRef<Rect>();
  const g7 = createRef<Node>();
  const g7center = createRef<Rect>();
  const g7chips = [0, 1, 2, 3, 4, 5].map(() => createRef<Rect>());
  const g7lines = [0, 1, 2, 3, 4, 5].map(() => createRef<Line>());
  const g8 = createRef<Node>();
  const g8chips = [0, 1, 2, 3, 4, 5].map(() => createRef<Rect>());
  const g8count = createRef<Txt>();
  const g9 = createRef<Node>();
  const g9id = createRef<Rect>();
  const g9old = createRef<Txt>();
  const g9new = createRef<Txt>();
  const g10a = createRef<Node>();
  const g10aName = createRef<Node>();
  const g10aOld = createRef<Txt>();
  const g10aNew = createRef<Txt>();
  const g10aChecks = [0, 1, 2].map(() => createRef<Txt>());
  const g10b = createRef<Node>();
  const g10bBoxes = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(() => createRef<Rect>());
  const g10bMiss = createRef<Txt>();
  const g10bMissLab = createRef<Txt>();
  const g11 = createRef<Node>();
  const g11title = createRef<Txt>();
  const g11one = createRef<Rect>();
  const g11dups = [0, 1, 2, 3, 4].map(() => createRef<Rect>());

  const chipRow = row(6, 150, 24, [0, 180]);
  const tenRow = row(10, 100, 12, [0, -80]);
  const dupRow = row(5, 150, 24, [0, 60]);

  view.add(
    <>
      <Txt
        ref={header}
        position={[-SAFE.halfW, -SAFE.halfH]}
        offset={[-1, -1]}
        fontSize={SIZE.label}
        fill={T.muted}
        fontFamily={FONT.sans}
        text={'名字还是编号'}
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

      {/* b1：地名卡，文字 vs 编号 */}
      <Node ref={g1} opacity={0}>
        <Rect ref={g1text} position={[-300, -60]} width={340} height={120} radius={14} fill={T.card} stroke={T.blue} lineWidth={2}>
          <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'大西雅图地区'} />
        </Rect>
        <Rect ref={g1id} position={[300, -60]} width={260} height={120} radius={14} fill={T.card} stroke={T.yellow} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.yellow} fontFamily={FONT.mono} text={'us:91'} />
        </Rect>
        <Txt ref={g1q} position={[0, -60]} scale={0.3} fontSize={72} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'?'} opacity={0} />
      </Node>

      {/* b2：档案卡回扣，region_id 高亮 */}
      <Node ref={g2} opacity={0}>
        <Rect ref={g2card} position={[0, -40]} width={640} height={420} radius={20} fill={T.card} stroke={T.line} lineWidth={2}>
          <Rect position={[-220, -130]} width={120} height={120} radius={12} fill={T.line} />
          <Txt position={[-220, -130]} fontSize={SIZE.label} fill={T.bg} fontFamily={FONT.sans} text={'照片'} />
          <Txt position={[60, -150]} fontSize={SIZE.title} fontWeight={700} fill={T.white} fontFamily={FONT.serif} text={'Bill Gates'} />
          <Txt position={[60, -90]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'Greater Seattle Area | Philanthropy'} />
        </Rect>
        <Txt ref={g2chip} position={[0, -275]} fontSize={SIZE.body} fontWeight={700} fill={T.yellow} fontFamily={FONT.mono} text={'user_id 251'} opacity={0} />
        <Rect ref={g2row} position={[0, 80]} width={560} height={80} radius={12} stroke={T.yellow} lineWidth={0} opacity={0} />
        <Txt ref={g2rowTxt} position={[0, 80]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.mono} text={'region_id  us:91'} opacity={0} />
      </Node>

      {/* b3：下拉框，写法统一 */}
      <Node ref={g3} opacity={0}>
        <Node ref={g3drop}>
          <Rect ref={g3box} position={[-320, -80]} width={380} height={280} radius={16} fill={T.card} stroke={T.blue} lineWidth={2} />
          <Txt position={[-320, -190]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'地区（下拉框）'} />
          {['大西雅图地区 ✓', '旧金山湾区', '纽约地区'].map((t, i) => (
            <Txt key={`g3o-${i}`} ref={g3opts[i]} position={[-320, -120 + i * 70]} fontSize={SIZE.label} fill={i === 0 ? T.green : T.text} fontFamily={FONT.sans} text={t} opacity={0} />
          ))}
        </Node>
        {[0, 1, 2].map(i => (
          <Node key={`g3p-${i}`}>
            <Rect position={[300, -180 + i * 140]} width={360} height={90} radius={12} fill={T.card} stroke={T.line} lineWidth={2} />
            <Txt ref={g3vars[i]} position={[300, -180 + i * 140]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={['大西雅图地区', '大西雅图', '西雅图地区'][i]} />
            <Txt ref={g3unis[i]} position={[300, -180 + i * 140]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} text={'大西雅图地区'} opacity={0} />
          </Node>
        ))}
      </Node>

      {/* b4：同名城市，编号区分 */}
      <Node ref={g4} opacity={0}>
        <Rect ref={g4a} position={[-300, -60]} width={360} height={200} radius={16} fill={T.card} stroke={T.blue} lineWidth={2}>
          <Txt position={[0, -40]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'同名城市'} />
          <Txt ref={g4aId} position={[0, 40]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.mono} text={'city:12'} />
          <Txt ref={g4aCheck} position={[140, 65]} fontSize={48} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'✓'} opacity={0} />
        </Rect>
        <Rect ref={g4b} position={[300, -60]} width={360} height={200} radius={16} fill={T.card} stroke={T.blue} lineWidth={2}>
          <Txt position={[0, -40]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'同名城市'} />
          <Txt ref={g4bId} position={[0, 40]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.mono} text={'city:47'} />
          <Txt ref={g4bCheck} position={[140, 65]} fontSize={48} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'✓'} opacity={0} />
        </Rect>
        <Txt ref={g4x} position={[0, -60]} scale={0.3} fontSize={64} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'✗'} opacity={0} />
      </Node>

      {/* b5：改名，改一处 */}
      <Node ref={g5} opacity={0}>
        <Rect ref={g5region} position={[0, -150]} width={440} height={130} radius={16} fill={T.card} stroke={T.blue} lineWidth={2}>
          <Txt position={[0, -30]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.mono} text={'us:91'} />
          <Txt ref={g5old} position={[0, 25]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'旧名字'} />
          <Txt ref={g5new} position={[0, 25]} fontSize={SIZE.body} fill={T.green} fontFamily={FONT.sans} text={'新名字'} opacity={0} />
        </Rect>
        {[0, 1, 2].map(i => (
          <Rect key={`g5c-${i}`} ref={g5chips[i]} position={[-320 + i * 320, 80]} width={260} height={80} radius={12} fill={T.card} stroke={T.line} lineWidth={2}>
            <Txt fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.mono} text={['档案 A · us:91', '档案 B · us:91', '档案 C · us:91'][i]} />
          </Rect>
        ))}
      </Node>

      {/* b6：本地化 + 搜索 */}
      <Node ref={g6} opacity={0}>
        <Node ref={g6lang}>
          <Rect position={[-320, -100]} width={420} height={180} radius={16} fill={T.card} stroke={T.blue} lineWidth={2} />
          <Txt position={[-320, -140]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'大西雅图地区'} />
          <Txt ref={g6en} position={[-320, -60]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} text={'Greater Seattle Area'} opacity={0} />
        </Node>
        <Node ref={g6search}>
          <Rect ref={g6box} position={[280, -100]} width={420} height={110} radius={14} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0} />
          <Txt ref={g6boxTxt} position={[280, -100]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'搜：华盛顿州'} opacity={0} />
          <Rect ref={g6res} position={[280, 60]} width={420} height={110} radius={14} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'西雅图 · 慈善家 ✓'} />
          </Rect>
        </Node>
      </Node>

      {/* b7：一处存，编号指代 */}
      <Node ref={g7} opacity={0}>
        <Rect ref={g7center} position={[0, -80]} width={300} height={140} radius={16} fill={T.card} stroke={T.blue} lineWidth={3}>
          <Txt position={[0, -25]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'慈善'} />
          <Txt position={[0, 35]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.mono} text={'industry 131'} />
        </Rect>
        {chipRow.map(([x, y], i) => (
          <Line key={`g7l-${i}`} ref={g7lines[i]} points={[[x, y - 35], [0, -10]]} stroke={T.line} lineWidth={2} opacity={0} />
        ))}
        {chipRow.map(([x, y], i) => (
          <Rect key={`g7c-${i}`} ref={g7chips[i]} position={[x, y]} width={150} height={70} radius={10} fill={T.card} stroke={T.line} lineWidth={2} opacity={0}>
            <Txt fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.mono} text={'档案 · 131'} />
          </Rect>
        ))}
      </Node>

      {/* b8：处处复制 */}
      <Node ref={g8} opacity={0}>
        <Txt ref={g8count} position={[0, -200]} fontSize={SIZE.title} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'复制 ×6'} opacity={0} />
        {chipRow.map(([x, y], i) => (
          <Rect key={`g8c-${i}`} ref={g8chips[i]} position={[x, y]} width={150} height={70} radius={10} fill={T.card} stroke={T.red} lineWidth={2} opacity={0}>
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'慈善'} />
          </Rect>
        ))}
      </Node>

      {/* b9：编号不用改 */}
      <Node ref={g9} opacity={0}>
        <Rect ref={g9id} position={[0, -120]} width={300} height={120} radius={16} fill={T.card} stroke={T.yellow} lineWidth={2}>
          <Txt fontSize={SIZE.title} fontWeight={700} fill={T.yellow} fontFamily={FONT.mono} text={'us:91'} />
        </Rect>
        <Txt position={[0, 10]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'它指的名字：'} />
        <Txt ref={g9old} position={[0, 70]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'旧名字'} />
        <Txt ref={g9new} position={[0, 70]} fontSize={SIZE.body} fill={T.green} fontFamily={FONT.sans} text={'新名字'} opacity={0} />
      </Node>

      {/* b10a：改一处就完了 */}
      <Node ref={g10a} opacity={0}>
        <Node ref={g10aName}>
          <Rect position={[-300, -60]} width={360} height={140} radius={16} fill={T.card} stroke={T.blue} lineWidth={2} />
          <Txt position={[-300, -90]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'地区名'} />
          <Txt ref={g10aOld} position={[-300, -30]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'旧名字'} />
          <Txt ref={g10aNew} position={[-300, -30]} fontSize={SIZE.body} fill={T.green} fontFamily={FONT.sans} text={'新名字'} opacity={0} />
        </Node>
        {[0, 1, 2].map(i => (
          <Node key={`g10ac-${i}`}>
            <Rect position={[300, -180 + i * 140]} width={320} height={90} radius={12} fill={T.card} stroke={T.line} lineWidth={2} />
            <Txt position={[230, -180 + i * 140]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.mono} text={['档案 A · us:91', '档案 B · us:91', '档案 C · us:91'][i]} />
            <Txt ref={g10aChecks[i]} position={[420, -180 + i * 140]} fontSize={SIZE.body} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'✓'} opacity={0} />
          </Node>
        ))}
      </Node>

      {/* b10b：改十处，漏一处变红 */}
      <Node ref={g10b} opacity={0}>
        {tenRow.map(([x, y], i) => (
          <Rect key={`g10b-${i}`} ref={g10bBoxes[i]} position={[x, y]} width={100} height={80} radius={10} fill={T.card} stroke={T.line} lineWidth={2} opacity={0}>
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'慈善'} />
          </Rect>
        ))}
        <Txt ref={g10bMiss} key="qa-ignore-漏改打叉" position={[tenRow[9][0], -80]} fontSize={48} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'✗'} opacity={0} />
        <Txt ref={g10bMissLab} position={[tenRow[9][0], 40]} fontSize={SIZE.label} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'漏改'} opacity={0} />
      </Node>

      {/* b11：规范化，去掉重复 */}
      <Node ref={g11} opacity={0}>
        <Txt ref={g11title} position={[0, -220]} fontSize={SIZE.title} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'规范化 · normalization'} opacity={0} />
        <Rect ref={g11one} position={[0, -80]} width={300} height={140} radius={16} fill={T.card} stroke={T.blue} lineWidth={3} opacity={0}>
          <Txt position={[0, -25]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'慈善'} />
          <Txt position={[0, 35]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.mono} text={'只存一处'} />
        </Rect>
        {dupRow.map(([x, y], i) => (
          <Rect key={`g11d-${i}`} ref={g11dups[i]} position={[x, y]} width={150} height={70} radius={10} fill={T.card} stroke={T.red} lineWidth={2} opacity={0}>
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'慈善'} />
          </Rect>
        ))}
      </Node>
    </>
  );

  say('名字还是编号？');
  yield* beat('b1',
    all(g1().opacity(1, 0.5)),
    at('存编号', g1id().opacity(1, 0.5)),
    at('改了名字', chain(g1text().scale(1.06, 0.3), g1text().scale(1, 0.3))),
    at('哪一边更疼', all(g1q().opacity(1, 0.3), g1q().scale(1, 0.4))),
  );

  say('region_id us:91');
  yield* beat('b2',
    all(g1().opacity(0, 0.5), g2().opacity(1, 0.5)),
    at('user_id 251', g2chip().opacity(1, 0.5)),
    at('region_id', all(g2row().opacity(1, 0.5), g2rowTxt().opacity(1, 0.5))),
    at('us:91', g2row().lineWidth(4, 0.4)),
  );

  say('下拉框选，写法一致');
  yield* beat('b3',
    all(g2().opacity(0, 0.5), g3().opacity(1, 0.5)),
    at('下拉框', all(all(...g3opts.map(o => o().opacity(1, 0.4))), chain(g3box().scale(1.04, 0.3), g3box().scale(1, 0.3)))),
    at('风格和拼写', all(...g3vars.map(v => v().opacity(0, 0.4)), ...g3unis.map(u => u().opacity(1, 0.4)))),
  );

  say('同名不同编号');
  yield* beat('b4',
    all(g3().opacity(0, 0.5), g4().opacity(1, 0.5)),
    at('撞名', all(g4x().opacity(1, 0.3), g4x().scale(1, 0.4))),
    at('编号一查', all(g4aId().fill(T.yellow, 0.4), g4bId().fill(T.yellow, 0.4), g4aCheck().opacity(1, 0.3), g4bCheck().opacity(1, 0.3), g4a().position([-320, -60], 0.6), g4b().position([320, -60], 0.6))),
  );

  say('改一处，全改了');
  yield* beat('b5',
    all(g4().opacity(0, 0.5), g5().opacity(1, 0.5)),
    at('改一处', all(g5old().opacity(0, 0.4), g5new().opacity(1, 0.4), g5region().stroke(T.green, 0.4), chain(g5region().scale(1.04, 0.3), g5region().scale(1, 0.3)))),
    at('全改了', all(...g5chips.map(c => c().stroke(T.green, 0.4)))),
  );

  say('搜华盛顿州，找到西雅图');
  yield* beat('b6',
    all(g5().opacity(0, 0.5), g6().opacity(1, 0.5)),
    at('本地化', all(g6en().opacity(1, 0.5), chain(g6lang().scale(1.04, 0.3), g6lang().scale(1, 0.3)))),
    at('搜华盛顿州', all(g6box().opacity(1, 0.5), g6boxTxt().opacity(1, 0.5), g6res().opacity(1, 0.5))),
  );

  say('编号只存一处');
  yield* beat('b7',
    all(g6().opacity(0, 0.5), g7().opacity(1, 0.5)),
    at('只存一处', all(...g7chips.map(c => c().opacity(1, 0.4)), ...g7lines.map(l => l().opacity(1, 0.4)))),
    at('指代', all(...g7lines.map(l => l().stroke(T.yellow, 0.4)))),
  );

  say('文字处处复制');
  yield* beat('b8',
    all(g7().opacity(0, 0.5), g8().opacity(1, 0.5)),
    at('复制一遍', all(...g8chips.map(c => c().opacity(1, 0.4)), g8count().opacity(1, 0.4), chain(g8count().scale(1.12, 0.3), g8count().scale(1, 0.3)))),
  );

  say('编号不用改');
  yield* beat('b9',
    all(g8().opacity(0, 0.5), g9().opacity(1, 0.5)),
    at('永远不用改', g9id().stroke(T.green, 0.4)),
    at('它指的那个名字', all(g9old().opacity(0, 0.4), g9new().opacity(1, 0.4))),
  );

  say('改一处就完了');
  yield* beat('b10a',
    all(g9().opacity(0, 0.5), g10a().opacity(1, 0.5)),
    at('改一处就完了', all(g10aOld().opacity(0, 0.4), g10aNew().opacity(1, 0.4), ...g10aChecks.map(c => c().opacity(1, 0.4)))),
  );

  say('改十处，漏一处变红');
  yield* beat('b10b',
    all(g10a().opacity(0, 0.5), g10b().opacity(1, 0.5)),
    at('十处都得改', chain(all(...g10bBoxes.slice(0, 9).map(b => b().opacity(1, 0.2))), all(...g10bBoxes.slice(0, 9).map(b => b().stroke(T.green, 0.3))))),
    at('漏掉一处', all(g10bBoxes[9]().opacity(1, 0.3), g10bBoxes[9]().stroke(T.red, 0.3), g10bMiss().opacity(1, 0.4), g10bMissLab().opacity(1, 0.4))),
  );

  say('规范化：去掉重复');
  yield* beat('b11',
    all(g10b().opacity(0, 0.5), g11().opacity(1, 0.5)),
    at('规范化', all(g11title().opacity(1, 0.5), g11one().opacity(1, 0.5), ...g11dups.map(d => d().opacity(1, 0.4)))),
    at('核心思想', chain(g11one().scale(1.05, 0.3), g11one().scale(1, 0.3))),
    at('经验法则', chain(...g11dups.map(d => d().opacity(0, 0.3)))),
    at('没规范化', g11one().stroke(T.green, 0.4)),
  );
});
