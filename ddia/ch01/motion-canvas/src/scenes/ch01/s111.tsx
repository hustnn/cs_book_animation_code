import {COLORS, makeCardScene} from '../../components/TitleCard';

// 1.11 可维护性（45s）——v2：删掉原文没有的“开发 1/4 / 维护 3/4”比例数字；
// 原文只说“大头（majority）在维护”。补遗留系统与三原则。
export default makeCardScene(
  '第 1 章 · 1.11 可维护性',
  '可维护性',
  [
    {text: '软件成本，大头在维护，不在开发'},
    {
      text: '遗留系统：修别人的错 · 用过时平台 · 被迫做设计之外的事',
      size: 26,
    },
    {text: '每个遗留系统各有各的难处'},
    {text: '三原则：可运维性 · 简单性 · 可演化性'},
    {text: '简单性 ≠ UI 简单；可演化性又称 extensibility / modifiability / plasticity', size: 24},
    {text: '可维护性：许多不同的人能高效地在系统上工作'},
    {
      text: '修 bug · 保持运转 · 排查故障 · 适配新平台 · 改需求 · 还技术债 · 加功能',
      size: 26,
    },
  ],
  '维护决定系统能活多久。',
  45,
);
