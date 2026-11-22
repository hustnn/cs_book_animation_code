import {makeCardScene} from '../../components/TitleCard';

// 1.14 可演化性 · 补段（45s）：需求变化的驱动、Agile 与 TDD/重构、
// 小尺度 vs 大系统层面、Twitter 重构之问、与简单性的关联、术语与别名。
export default makeCardScene(
  '第 1 章 · 1.14 可演化性',
  '可演化性：变化的驱动与敏捷',
  [
    {text: '需求变化的驱动：新事实 · 未预见用例 · 业务优先级 · 法律法规 · 增长迫使架构变 · 用户要新功能 · 新平台取代旧平台', size: 22},
    {text: 'Agile 提供适应变化的框架；TDD 与重构是其技术工具', size: 26},
    {text: 'Agile 多聚焦小尺度；本书要在大数据系统层面找敏捷', size: 26},
    {text: '如把 Twitter 时间线从做法 1“重构”到做法 2', size: 28},
    {text: '简单易懂的系统通常更易改：可演化性与简单性紧密相关', size: 26},
    {text: 'evolvability：数据系统层面的敏捷；别名 extensibility / modifiability / plasticity', size: 22},
  ],
  '需求极不可能不变，更可能持续变化。',
  45,
);
