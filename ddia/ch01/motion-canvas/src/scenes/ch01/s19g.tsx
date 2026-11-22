import {makeCardScene} from '../../components/TitleCard';

// 1.9 描述性能 · 补段（45s）：“Percentiles in Practice”小框后半：
// 滚动窗口、朴素实现、近似算法、平均百分位无意义 + Figure 1-5 图面结构。
export default makeCardScene(
  '第 1 章 · 1.9 描述性能',
  'Percentiles in Practice（小框后半）',
  [
    {text: '监控仪表盘要持续高效算百分位'},
    {text: '滚动窗口：最近 10 分钟，每分钟算一次中位数与各百分位', size: 26},
    {text: '朴素实现：存全部响应时间，每分钟排序'},
    {text: '近似算法：forward decay · t-digest · HdrHistogram', size: 28},
    {text: '平均百分位在数学上无意义：正确聚合是把直方图相加', size: 26},
    {text: 'Figure 1-5 图面：用户 → Web 应用 → 7 个后端，各带一个数据库', size: 24},
  ],
  '百分位要持续算、正确聚合。',
  45,
);
