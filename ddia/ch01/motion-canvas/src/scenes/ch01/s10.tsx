import {COLORS, makeCardScene} from '../../components/TitleCard';

// 1.0 章开场卡（30s）
export default makeCardScene(
  '第 1 章',
  '可靠、可扩展、可维护的应用程序',
  [
    {text: '● 可靠 —— 出了故障还能正确工作', color: COLORS.GREEN},
    {text: '● 可扩展 —— 负载长大了还能跟上', color: COLORS.BLUE},
    {text: '● 可维护 —— 改起来不痛苦', color: COLORS.YELLOW},
  ],
  '这三个词，是全书的尺子。',
  30,
  44,
);
