// 全书统一视觉。复制到 motion-canvas/src/lib/theme.ts；与 assets/manim/theme.py 保持同步。
// 场景里不要再写十六进制色值，一律从这里取，便于全书换肤，也让颜色语义保持一致。

export const T = {
  bg: '#0F172A',
  card: '#1E293B',
  text: '#E2E8F0',
  white: '#FFFFFF',
  muted: '#94A3B8',
  line: '#475569',
  blue: '#38BDF8',
  green: '#34D399',
  red: '#F87171',
  yellow: '#FBBF24',
  purple: '#A78BFA',
} as const;

// 颜色语义：全书固定，审查时据此检查“颜色在说什么”。
export const SEM = {
  normal: T.blue, // 正常请求 / 数据
  ok: T.green, // 成功 / 已同步 / 正确
  bad: T.red, // 故障 / 慢 / 错误示范
  accent: T.yellow, // 强调 / 阈值 / 当前焦点
  meta: T.purple, // 元信息 / 示意模型标注
} as const;

export const FONT = {
  sans: '"Noto Sans CJK SC", sans-serif',
  serif: '"Noto Serif CJK SC", serif',
  mono: '"JetBrains Mono", "Noto Sans Mono CJK SC", monospace',
} as const;

// 720p 下的字号阶梯：小于 min 基本看不清。
export const SIZE = {title: 46, body: 30, label: 22, min: 18} as const;

// 安全区：1280×720，左右各留 60px、上下各留 40px。文字一律设 maxWidth={SAFE.width}。
export const SAFE = {width: 1160, height: 640, halfW: 580, halfH: 320} as const;
