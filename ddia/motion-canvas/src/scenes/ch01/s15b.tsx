import {makeCardScene} from '../../components/TitleCard';

// 1.5 人为错误 · 补段（45s）：宕机首因研究与 10–25%、好抽象、彻底测试、逐步发布与重算、telemetry。
export default makeCardScene(
  '第 1 章 · 1.5 人为错误',
  '人为错误：数据与对策',
  [
    {text: '研究：大型服务宕机首因是运维配置错误'},
    {text: '硬件故障只占 10–25%'},
    {text: '好抽象 / API / 界面：做对的事容易，做错的事难', size: 28},
    {text: '彻底测试：单元 → 集成 → 手动，覆盖极少出现的边界情况', size: 26},
    {text: '逐步发布新代码：意外 bug 只影响小部分用户', size: 28},
    {text: '提供重算数据的工具：旧计算错了可重算'},
    {text: 'telemetry：火箭离地后遥测不可或缺；早期预警，助诊断', size: 26},
  ],
  '管理实践与培训也很重要，但超出本书范围。',
  45,
);
