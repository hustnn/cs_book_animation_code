import {makeCardScene} from '../../components/TitleCard';

// 1.9 描述性能 · 收尾卡（12s）
export default makeCardScene(
  '第 1 章 · 1.9 描述性能',
  '看性能，看百分位',
  [
    {text: '批处理不看响应时间，看吞吐量'},
    {text: '看负载，看利用率'},
  ],
  '别把系统跑满。',
  12,
);
