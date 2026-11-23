// U1 场景 1（文字卡，全章唯一）：b1–b2 —— 维特根斯坦引言卡。
// 分镜：skill-ch02/beats-u1.md U1 一节；原文：DDIA §2.0（书页 p27）。
// 用 makeCardScene（≤3 行）；时长全部来自 timeline/u1.json。
import {makeCardScene} from '../../lib/card';
import {T} from '../../lib/theme';
import timeline from '../../timeline/u1.json';

export default makeCardScene({
  timeline,
  kicker: '模型决定你怎么写代码',
  title: '语言的边界，就是世界的边界',
  titleBeat: 'b1',
  lines: [{text: '维特根斯坦 · 《逻辑哲学论》 · 1922', beat: 'b2', color: T.muted}],
});
