import {COLORS, makeCardScene} from '../../components/TitleCard';

// 1.0 章首引言 · 补段（45s）：Alan Kay 引言 + 本书定位（原理与实践之旅、逐层展开）。
export default makeCardScene(
  '第 1 章 · 1.0 章首引言',
  'Alan Kay 的引言（2012）',
  [
    {text: '“The Internet was done so well that', size: 24},
    {text: 'most people think of it as a natural', size: 24},
    {text: 'resource like the Pacific Ocean,', size: 24},
    {text: 'rather than something that was man-made.”', size: 24},
    {text: '本书：走一遍数据系统的原理与实践', color: COLORS.GREEN},
    {text: '本章先讲 fundamentals，后续逐层讲设计决策', color: COLORS.BLUE},
  ],
  'Alan Kay，2012 年 Dr Dobb\'s Journal 访谈',
  45,
);
