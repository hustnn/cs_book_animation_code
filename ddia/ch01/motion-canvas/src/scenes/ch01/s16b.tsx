import {makeCardScene} from '../../components/TitleCard';

// 1.6 可靠性有多重要 · 补段（30s）：有意识地牺牲可靠性。
export default makeCardScene(
  '第 1 章 · 1.6 可靠性有多重要',
  '有意识地牺牲可靠性',
  [
    {text: '可为降开发成本牺牲可靠性：未验证市场的原型产品', size: 28},
    {text: '可为降运营成本牺牲可靠性：利润极薄的服务', size: 28},
    {text: '但要清醒地意识到，自己在走捷径'},
  ],
  '牺牲可以，但别稀里糊涂地牺牲。',
  30,
);
