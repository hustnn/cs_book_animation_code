import {makeCardScene} from '../../components/TitleCard';

// 1.9 描述性能 · 标题卡（8s）——v2：修正延迟定义。
// 原文 p14 小框：响应时间 = 服务时间 + 网络延迟 + 排队延迟；
// 延迟 = 请求等待被处理的时间（latent，awaiting service）。
export default makeCardScene(
  '第 1 章 · 1.9 描述性能',
  '响应时间 ≠ 延迟',
  [
    {text: '响应时间 = 服务时间 + 网络延迟 + 排队延迟', size: 28},
    {text: '延迟 = 请求等待被处理的时间', size: 28},
  ],
  '响应时间是客户端看到的。',
  8,
);
