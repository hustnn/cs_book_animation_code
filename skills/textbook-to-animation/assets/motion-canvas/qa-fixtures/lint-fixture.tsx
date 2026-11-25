// lint_scenes.py 的通用测试场景：只给 lint 读，不进工程、不渲染。
// 期望（scripts/qa_selftest.py 会检查）：
//   - 并行补间冲突 2 处：all(...) 里 box().opacity 两次；sequence(0, ...) 里 dot().position 两次
//   - 观众可见文字 error：页码、图表编号、提到原书、内部编号 各至少 1 处
//   - 不应报：p99 / p50 这类百分位写法；beat('b3') 这类拍号参数；key 里的内部代号；
//     设计规定的“延伸 · 原文之外”角标（“原文之外”不是在提原书）
//   - 跨 at() 的同对象补间（warn）只有 1 处：f21 里两个 at() 都补间 dot().position，按旁白估出的时间窗重叠；
//     不应报：box().opacity 的两个 at() 时间窗不重叠；say().opacity 串在同一个 at() 的 chain 里
import {Circle, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, chain, createRef, sequence} from '@motion-canvas/core';
import {at, makeBeats} from '../../lib/beats';
import timeline from '../../timeline/qa-fixture.json';

export default makeScene2D(function* (view) {
  const beat = makeBeats(timeline);
  const box = createRef<Rect>();
  const dot = createRef<Circle>();
  const say = createRef<Txt>();
  view.add(
    <>
      <Rect ref={box} key={'u7-sl-0'} width={100} height={100} />
      <Circle ref={dot} width={20} height={20} />
      <Txt ref={say} text={'p99 < 1s，p50 = 200ms'} />
      <Txt text={'详见第 12 页'} />
      <Txt text={'Figure 2-3 的读法'} />
      <Txt text={'书里也是这么写的'} />
      <Txt text={'U3 的结论'} />
      <Txt text={'延伸 · 原文之外'} />
    </>,
  );
  yield* beat('b3', all(box().opacity(1, 0.5), box().opacity(0, 0.5)));
  yield* beat('b4', sequence(0, dot().position([100, 0], 1), dot().position([0, 0], 1)));
  yield* beat('b5', chain(dot().position([100, 0], 1), dot().position([0, 0], 1)));
  yield* beat(
    'f21',
    at('处理', dot().position([300, 0], 2.5)),
    at('网络', dot().position([0, 0], 1)),
    at('处理', box().opacity(1, 0.5)),
    at('排队', box().opacity(0, 0.5)),
    at('网络', chain(say().opacity(0, 0.5), say().opacity(1, 0.5))),
  );
});
