import {COLORS, makeCardScene} from '../../components/TitleCard';

// 1.12 可运维性（45s）——v2：补全原文 p20 系统可做的 7 件事的后半句
// （标准工具集成、运维模型、默认值可覆盖、自愈+手动控制、行为可预测）。
export default makeCardScene(
  '第 1 章 · 1.12 可运维性',
  '可运维性：让运维生活轻松',
  [
    {text: '✓ 监控可见性：运行时行为与内部可见性', color: COLORS.GREEN},
    {text: '✓ 自动化 + 与标准工具集成', color: COLORS.BLUE},
    {text: '✓ 不依赖单机：可停机维护而系统整体不停', color: COLORS.YELLOW},
    {text: '✓ 好文档 + 易懂的运维模型（如果我做 X，就会发生 Y）', color: COLORS.GREEN, size: 26},
    {text: '✓ 好默认值，允许管理员在需要时覆盖', color: COLORS.BLUE},
    {text: '✓ 自愈 + 需要时给管理员手动控制', color: COLORS.YELLOW},
    {text: '✓ 行为可预测、少意外', color: COLORS.GREEN},
  ],
  '让例行任务容易，运维聚焦高价值活动。',
  45,
);
