import {makeCardScene} from '../../components/TitleCard';

// 1.13 简单性 · 补段（30s）：好抽象的例子、找好抽象很难、本书持续留意好抽象。
export default makeCardScene(
  '第 1 章 · 1.13 简单性',
  '好抽象的例子',
  [
    {text: '高级语言藏机器码 / CPU 寄存器 / 系统调用', size: 28},
    {text: 'SQL 藏磁盘与内存数据结构、并发请求、崩溃后不一致', size: 26},
    {text: '找好抽象很难，分布式系统尤其如此'},
  ],
  '本书将持续留意好抽象：拆成定义良好、可复用的组件。',
  30,
);
