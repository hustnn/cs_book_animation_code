import {COLORS, makeCardScene} from '../../components/TitleCard';

// 1.15 Summary（45s，原 30s）——v2：按原文 p22–23（PDF p45 顶部）重写小结，
// 补功能 vs 非功能、三类故障小结、定量描述方法论、可维护性小结、没有速效解、Part III 回访 Figure 1-1。
export default makeCardScene(
  '第 1 章 · 1.15 Summary',
  '本章小结',
  [
    {text: '功能：存 · 取 · 搜 · 处理；非功能：安全 · 可靠 · 合规 · 可扩展 · 兼容 · 可维护', size: 26},
    {text: '故障三类：硬件随机不相关 · 软件系统性 · 人难免犯错；容错可把某些故障对用户隐藏', color: COLORS.GREEN, size: 28},
    {text: '先定量描述负载（Twitter 时间线）与性能（响应时间百分位），再加容量保可靠', color: COLORS.BLUE},
    {text: '可维护 = 让工程与运维团队的日子更好过；好抽象降复杂度、易改易适配', color: COLORS.YELLOW},
    {text: '好可运维性 = 看清系统健康 + 有效管理；没有速效解，但模式与技术反复出现', size: 28},
    {text: '后续章节看实例；Part III 回访 Figure 1-1 的多组件系统', size: 26},
  ],
  '第 1 章完 · 下一章：数据模型与查询语言',
  45,
);
