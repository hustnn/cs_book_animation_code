import {makeCardScene} from '../../components/TitleCard';

// 1.9 描述性能 · 补段（45s）：SLA 例子（99.9% 在此才是原文出处）、
// head-of-line blocking、客户端测量、压测方法、调用次数越多越易撞上慢调用。
export default makeCardScene(
  '第 1 章 · 1.9 描述性能',
  '排队、SLA 与压测方法',
  [
    {text: 'SLA：中位数 < 200ms 且 p99 < 1s，否则等同宕机；可用性 ≥ 99.9%，可索赔', size: 22},
    {text: '排队延迟占高百分位大头：少量慢请求堵住后续请求（服务器并行能力有限，如 CPU 核数）', size: 26},
    {text: '这叫 head-of-line blocking'},
    {text: '调用次数越多，撞上慢调用的概率越高'},
    {text: '要在客户端测响应时间'},
    {text: '压测：发请求的客户端须独立于响应时间'},
    {text: '等上一个完成再发下一个，会人为缩短队列、扭曲测量', size: 26},
  ],
  '排队等待，是尾部延迟的大头。',
  45,
);
