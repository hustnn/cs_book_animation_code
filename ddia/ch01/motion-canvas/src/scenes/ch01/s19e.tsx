import {makeCardScene} from '../../components/TitleCard';

// 1.9 描述性能 · 补段（45s）：中位数/p95 例子、多次请求的概率、Amazon 尾部证据链、p99.99 太贵。
export default makeCardScene(
  '第 1 章 · 1.9 描述性能',
  '为什么要在乎尾部？',
  [
    {text: '中位数 p50 = 200ms：一半快于它，一半慢于它', size: 28},
    {text: '一次会话多次请求：至少一次慢于中位数的概率远大于 50%', size: 24},
    {text: 'p95 = 1.5s：95/100 快于它，5/100 慢于或等于它', size: 26},
    {text: 'Amazon：用 99.9th percentile 提内部服务要求', size: 28},
    {text: '最慢的客户常是最有价值的：数据最多、买得最多', size: 28},
    {text: '响应时间 +100ms → 销量 −1%；慢 1 秒 → 满意度 −16%', size: 26},
    {text: '优化 p99.99 太贵、收益不足：极高百分位难降', size: 28},
  ],
  '均值会骗人，尾部才要命。',
  45,
);
