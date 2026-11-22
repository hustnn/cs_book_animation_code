// U1 引言卡（全章唯一文字卡）：b2 —— Alan Kay 引言。
// 分镜：skill-ch01/ch01-beats.md U1 一节；原文：DDIA §1.0（书页 p3，PDF p25）。
// 时长来自 timeline/u1.json（beat() 驱动）。
import {makeCardScene} from '../../lib/card';
import timeline from '../../timeline/u1.json';

export default makeCardScene({
  timeline,
  kicker: 'Alan Kay · 2012',
  title: '互联网做得太好，人们把它当成了太平洋一样的自然资源。',
  titleBeat: 'b2',
  lines: [],
});
