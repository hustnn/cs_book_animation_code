import {makeCardScene} from '../../components/TitleCard';

// 1.1 思考数据系统 · 补段（45s）：选型难、组合难、类别边界模糊、拆分+缝合。
export default makeCardScene(
  '第 1 章 · 1.1 思考数据系统',
  '选型难，组合更难',
  [
    {text: '现实没那么简单：需求不同 → 数据库特性各异'},
    {text: '数据库 vs 消息队列：表面都存数据，访问模式不同'},
    {text: '类别边界在模糊：Redis 又被当消息队列用'},
    {text: 'Kafka 有数据库式 durability 保证'},
    {text: '拆成单工具能高效完成的任务，再用应用代码缝合'},
  ],
  '单一工具常无法满足全部需求。',
  45,
);
