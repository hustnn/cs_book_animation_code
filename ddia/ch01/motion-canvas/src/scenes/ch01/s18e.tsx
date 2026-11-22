import {makeCardScene} from '../../components/TitleCard';

// 1.8 描述负载 · 补段（30s）：Figure 1-3 三个收件人的邮箱内容各异 + 先描述负载才能讨论增长。
export default makeCardScene(
  '第 1 章 · 1.8 描述负载',
  'Figure 1-3 · 三个收件人的邮箱',
  [
    {text: '收件人 1：T7 T5 T3 T1'},
    {text: '收件人 2：T8 T6 T5'},
    {text: '收件人 3：T8 T7 T4 T3'},
    {text: 'All tweets：T8 … T1；Get home timeline (website, API)'},
    {text: '只有先描述负载，才能讨论增长；最佳参数取决于系统架构', size: 24},
    {text: '平均情况 vs 少数极端情况：极端可能主导瓶颈'},
  ],
  '每个收件人拿到不同的推文子集。',
  30,
);
