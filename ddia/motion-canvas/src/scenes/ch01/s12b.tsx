import {makeCardScene} from '../../components/TitleCard';

// 1.2 可靠性 · 补段（45s）：用户四点期望、黑洞例子、概率无法归零、Chaos Monkey、防范优于补救。
export default makeCardScene(
  '第 1 章 · 1.2 可靠性',
  '容错：只容忍特定类型',
  [
    {text: '用户期望：完成功能 · 容忍用错 · 性能够好 · 防未授权访问', size: 26},
    {text: '“容错”略误导：容忍一切故障不可行'},
    {text: '地球被黑洞吞掉，就得把托管搬去太空——预算批不下来', size: 26},
    {text: '故障概率无法归零：设计容错，防止故障变失效', size: 28},
    {text: '主动诱发故障：随机杀进程——Netflix Chaos Monkey', size: 28},
    {text: '安全事件无法撤销：防范优于补救'},
  ],
  '本书主要讲可治愈的故障。',
  45,
);
