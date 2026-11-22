// 渲染 QA 的通用测试场景：与任何教材无关，一拍一个用例。
// 每拍期望的结果写在同目录的 expect.json；scripts/qa_selftest.py 会把它放进工程渲染（--qa）并逐拍比对。
// 改 qa.ts 的判定规则、或者在新章节里发现误报/漏报时：先在这里加一拍能复现它的用例，再改规则，
// 直到 qa_selftest 全部通过——这样规则是按“通用视觉规则”调的，而不是按某一章调的。
import {Circle, Line, Node, Rect, Txt, TxtProps, makeScene2D} from '@motion-canvas/2d';
import {all, chain, createRef, waitFor} from '@motion-canvas/core';
import {at, makeBeats} from '../../lib/beats';
import {attach, edgePointIn, row} from '../../lib/layout';
import {FONT, SIZE, T} from '../../lib/theme';
import timeline from '../../timeline/qa-fixture.json';

const label = (text: string, extra: TxtProps = {}) => (
  <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={text} {...extra} />
);

export default makeScene2D(function* (view) {
  view.fill(T.bg);
  const beat = makeBeats(timeline);
  const G = Array.from({length: 24}, () => createRef<Node>());
  const r = {
    bar02: createRef<Rect>(),
    bar03: createRef<Rect>(),
    lab03: createRef<Txt>(),
    box05: createRef<Rect>(),
    lab05: createRef<Txt>(),
    old15: createRef<Node>(),
    new15: createRef<Node>(),
    dot16: createRef<Circle>(),
    box19: createRef<Rect>(),
    box20: createRef<Rect>(),
    seg21: [0, 1, 2].map(() => createRef<Rect>()),
    dot22: createRef<Circle>(),
    node22: createRef<Rect>(),
    bar23: createRef<Rect>(),
    lab23: createRef<Txt>(),
    bar24: createRef<Rect>(),
    lab24: createRef<Txt>(),
  };
  const xs08 = row(3, 150, 24, [0, 0]);

  view.add(
    <>
      {/* f01 文字在自己的卡片里 → 干净 */}
      <Node ref={G[0]} opacity={0}>
        <Rect width={320} height={120} radius={16} fill={T.card} stroke={T.blue} lineWidth={2}>
          {label('卡片标题')}
        </Rect>
      </Node>

      {/* f02 柱子从底部长高，扫过上方别人的标签（类 A）→ error covered */}
      <Node ref={G[1]} opacity={0}>
        {label('邻居标签', {position: [0, -60]})}
        <Rect ref={r.bar02} position={[0, 80]} offset={[0, 1]} width={200} height={60} fill={T.blue} />
      </Node>

      {/* f03 标签 attach 在柱子右端，柱子变长时跟着走 → 干净 */}
      <Node ref={G[2]} opacity={0}>
        <Rect ref={r.bar03} position={[-300, 0]} offset={[-1, 0]} width={0} height={44} fill={T.green} />
        <Txt ref={r.lab03} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} text={'服务端 50 ms'} />
      </Node>

      {/* f04 文字压在容器边框上（类 E）→ error edge */}
      <Node ref={G[3]} opacity={0}>
        <Rect width={600} height={300} radius={12} fill={T.card} stroke={T.line} lineWidth={2} />
        {label('压在边框上的提示', {position: [0, -150]})}
      </Node>

      {/* f05 文字 attach 在容器内侧、留内边距 → 干净 */}
      <Node ref={G[4]} opacity={0}>
        <Rect ref={r.box05} width={600} height={300} radius={12} fill={T.card} stroke={T.line} lineWidth={2} />
        <Txt ref={r.lab05} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'容器里的提示'} />
      </Node>

      {/* f06 上一个例子没退场，新例子放在同一位置（类 D）→ error text-overlap */}
      <Node ref={G[5]} opacity={0}>
        {label('旧例子')}
        {label('新例子', {position: [6, 4]})}
      </Node>

      {/* f07 手算间距小于方块宽度（类 C）→ error covered */}
      <Node ref={G[6]} opacity={0}>
        {[-60, 0, 60].map((x, i) => (
          <Rect key={`f07-${i}`} position={[x, 0]} width={150} height={110} radius={12} fill={T.card} stroke={T.blue} lineWidth={2}>
            {label(`方块${i + 1}`)}
          </Rect>
        ))}
      </Node>

      {/* f08 同样三个方块，用 row() 排开 → 干净 */}
      <Node ref={G[7]} opacity={0}>
        {xs08.map((p, i) => (
          <Rect key={`f08-${i}`} position={p} width={150} height={110} radius={12} fill={T.card} stroke={T.blue} lineWidth={2}>
            {label(`方块${i + 1}`)}
          </Rect>
        ))}
      </Node>

      {/* f09 线从文字中间穿过 → error crossed */}
      <Node ref={G[8]} opacity={0}>
        {label('被线穿过的字')}
        <Line points={[[-220, -60], [220, 60]]} stroke={T.yellow} lineWidth={3} />
      </Node>

      {/* f10 线在不透明卡片下面，卡片托着文字 → 干净 */}
      <Node ref={G[9]} opacity={0}>
        <Line points={[[-400, 0], [400, 0]]} stroke={T.yellow} lineWidth={3} />
        <Rect width={260} height={90} radius={14} fill={T.card} stroke={T.red} lineWidth={2}>
          {label('卡片上的字')}
        </Rect>
      </Node>

      {/* f11 只有描边的高亮框画在文字上面、把文字框在里面 → 干净 */}
      <Node ref={G[10]} opacity={0}>
        {label('被高亮的字')}
        <Rect width={300} height={100} radius={14} stroke={T.yellow} lineWidth={4} />
      </Node>

      {/* f12 圆里的短文字、旋转卡片上的文字 → 干净 */}
      <Node ref={G[11]} opacity={0}>
        <Circle position={[-250, 0]} width={160} height={160} fill={T.card} stroke={T.purple} lineWidth={3} />
        {label('黑洞', {position: [-250, 0]})}
        <Rect position={[250, 0]} rotation={-18} width={280} height={90} radius={14} fill={T.card} stroke={T.red} lineWidth={2} />
        {label('倾斜的卡片', {position: [250, 0], rotation: -18})}
      </Node>

      {/* f13 半透明高亮盖在文字上 → 只有 warn */}
      <Node ref={G[12]} opacity={0}>
        {label('半透明高亮下的字')}
        <Rect width={320} height={70} fill={T.yellow} opacity={0.3} />
      </Node>

      {/* f14 背景色遮罩盖住内容（雾、暗场）→ 只有 warn */}
      <Node ref={G[13]} opacity={0}>
        {label('被雾遮住的字')}
        <Rect width={500} height={160} fill={T.bg} opacity={0.9} />
      </Node>

      {/* f15 转场叠化：旧组淡出、新组淡入，同一位置 → 不应有 error */}
      <Node ref={G[14]} opacity={0}>
        <Node ref={r.old15}>{label('旧画面的字')}</Node>
        <Node ref={r.new15} opacity={0}>
          <Rect width={300} height={90} radius={14} fill={T.card} stroke={T.green} lineWidth={2} />
        </Node>
      </Node>

      {/* f16 小点很快飞过文字（只在一个采样点上重叠）→ 不应有 error */}
      <Node ref={G[15]} opacity={0}>
        {label('路过的字')}
        <Circle ref={r.dot16} position={[-420, 0]} width={40} height={40} fill={T.yellow} />
      </Node>

      {/* f17 有意划掉：划线节点 key 以 qa-ignore 开头 → 干净 */}
      <Node ref={G[16]} opacity={0}>
        {label('easy fix')}
        <Line key={'qa-ignore-strike'} points={[[-90, 0], [90, 0]]} stroke={T.red} lineWidth={4} />
      </Node>

      {/* f18 文字一半在画面外 → error offscreen */}
      <Node ref={G[17]} opacity={0}>{label('画面外面的字', {position: [600, 0]})}</Node>

      {/* f19 动画比旁白长 → error overrun */}
      <Node ref={G[18]} opacity={0}>
        <Rect ref={r.box19} width={100} height={100} fill={T.blue} />
      </Node>

      {/* f20 动画 0.5 秒做完，这一拍还有 7 秒多 → error idle */}
      <Node ref={G[19]} opacity={0}>
        <Rect ref={r.box20} width={100} height={100} fill={T.blue} opacity={0} />
      </Node>

      {/* f21 同样一拍，三个动作用 at() 跟着旁白展开 → 不应有 error */}
      <Node ref={G[20]} opacity={0}>
        {r.seg21.map((s, i) => (
          <Rect key={`f21-${i}`} ref={s} position={[-300 + i * 220, 0]} offset={[-1, 0]} width={0} height={60} fill={T.blue} />
        ))}
      </Node>

      {/* f22 小点停在节点旁边（edgePointIn），不停在节点中间的字上 → 不应有 error */}
      <Node ref={G[21]} opacity={0}>
        <Rect ref={r.node22} position={[200, 0]} width={180} height={80} radius={14} fill={T.card} stroke={T.blue} lineWidth={2}>
          {label('小步')}
        </Rect>
        <Circle ref={r.dot22} position={[-300, 0]} width={30} height={30} fill={T.yellow} />
      </Node>

      {/* f23 标签 attach 在柱子上，但柱子要到拍尾才长出来：大半拍里标签旁边什么都没有 → error orphan */}
      <Node ref={G[22]} opacity={0}>
        <Rect ref={r.bar23} position={[-300, 0]} offset={[-1, 0]} width={0} height={44} fill={T.red} />
        <Txt ref={r.lab23} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'更长'} />
      </Node>

      {/* f24 同样的柱子和标签，标签和柱子同时出现 → 干净 */}
      <Node ref={G[23]} opacity={0}>
        <Rect ref={r.bar24} position={[-300, 0]} offset={[-1, 0]} width={0} height={44} fill={T.red} />
        <Txt ref={r.lab24} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} opacity={0} text={'更长'} />
      </Node>
    </>,
  );

  attach(r.lab03(), r.bar03(), 'right', 12);
  attach(r.lab05(), r.box05(), 'top', 20, true);
  attach(r.lab23(), r.bar23(), 'right', 12);
  attach(r.lab24(), r.bar24(), 'right', 12);

  // 每拍开头瞬间切到对应的组（不叠化），只有 f15 自己演叠化
  const show = (k: number) => G.forEach((g, i) => g().opacity(i === k ? 1 : 0));

  show(0);
  yield* beat('f01');
  show(1);
  yield* beat('f02', r.bar02().height(200, 1.5));
  show(2);
  yield* beat('f03', r.bar03().width(420, 2));
  show(3);
  yield* beat('f04');
  show(4);
  yield* beat('f05');
  show(5);
  yield* beat('f06');
  show(6);
  yield* beat('f07');
  show(7);
  yield* beat('f08');
  show(8);
  yield* beat('f09');
  show(9);
  yield* beat('f10');
  show(10);
  yield* beat('f11');
  show(11);
  yield* beat('f12');
  show(12);
  yield* beat('f13');
  show(13);
  yield* beat('f14');
  show(14);
  yield* beat('f15', all(r.old15().opacity(0, 1.0), r.new15().opacity(1, 1.0)));
  show(15);
  yield* beat('f16', chain(waitFor(1.7), r.dot16().position([420, 0], 0.6)));
  show(16);
  yield* beat('f17');
  show(17);
  yield* beat('f18');
  show(18);
  yield* beat('f19', r.box19().rotation(180, 3));
  show(19);
  yield* beat('f20', r.box20().opacity(1, 0.5));
  show(20);
  yield* beat(
    'f21',
    at('处理', r.seg21[0]().width(200, 1.2)),
    at('网络', r.seg21[1]().width(200, 1.2)),
    at('排队', r.seg21[2]().width(200, 1.2)),
  );
  show(21);
  yield* beat('f22', r.dot22().position(edgePointIn(r.dot22(), r.node22(), 'left', 24), 1.5));
  show(22);
  yield* beat('f23', chain(waitFor(0.8), r.bar23().width(300, 0.3)));
  show(23);
  yield* beat('f24', chain(waitFor(0.3), all(r.bar24().width(300, 0.6), r.lab24().opacity(1, 0.3))));
});
