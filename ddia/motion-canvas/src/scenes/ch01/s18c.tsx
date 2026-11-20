import {makeCardScene} from '../../components/TitleCard';

// 1.8 描述负载 · 补段（45s）：fan-out 词源、v1 切换史、峰值、5 秒送达、分布是关键参数、混合做法。
export default makeCardScene(
  '第 1 章 · 1.8 描述负载',
  'Twitter：做法 1 的来龙去脉',
  [
    {text: 'fan-out：电子工程指一个逻辑门驱动的输入数；事务处理中指为一个入请求向其他服务发的请求数', size: 24},
    {text: 'Twitter 第一版用做法 1，跟不上时间线负载才切换到做法 2', size: 26},
    {text: '发推峰值超 12k req/s（平均 4.6k）'},
    {text: '关注者超 3000 万的单推：力争 5 秒内送达'},
    {text: '关注者分布是关键负载参数：它决定扇出负载', size: 28},
    {text: '混合做法：名人推文读时单独取回再合并，性能持续稳定；第 12 章重访', size: 26},
  ],
  '写时多干活，读时少干活。',
  45,
);
