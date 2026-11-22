import {COLORS, makeCardScene} from '../../components/TitleCard';

// 1.13 简单性（45s）——v2：补复杂度症状、big ball of mud、超支与改动引入 bug、
// 简单 ≠ 减少功能、偶然复杂度定义（Moseley and Marks）、本质 vs 偶然、抽象复用。
// 好抽象的例子与“找好抽象很难”见新增 s113b。
export default makeCardScene(
  '第 1 章 · 1.13 简单性',
  '简单性',
  [
    {text: '症状：状态空间爆炸 · 模块紧耦合 · 依赖纠缠', size: 28},
    {text: '命名不一致 · 为性能打补丁 · 为绕别处问题做特殊处理', size: 26},
    {text: '深陷复杂度 = big ball of mud', color: COLORS.RED},
    {text: '改动更易引入 bug；预算与进度常超支；降复杂度极大改善可维护性'},
    {text: '简单 ≠ 减少功能：去除偶然复杂度'},
    {text: '偶然复杂度非问题本身固有，只源于实现（定义引 Moseley and Marks；概念源自 Brooks）', size: 26},
    {text: '本质复杂度躲不掉；偶然复杂度是我们自己造的'},
    {text: '好抽象藏细节、界面干净简单、可广泛复用：质量改进惠及所有应用', size: 28},
  ],
  '简单 = 管住复杂度，好抽象藏细节。',
  45,
);
