import {Rect, Txt, View2D, makeScene2D} from '@motion-canvas/2d';
import {createRef, waitFor} from '@motion-canvas/core';
import {all} from '@motion-canvas/core/lib/flow';

// 文字卡片模板（全书 12 章共用）：深色底 + 左上小字 + 中央大标题 +
// 要点逐条淡入 + 收尾行。时间轴由各卡的 duration 倒推，首尾各留淡入/淡出。
// 注意：Motion Canvas 的场景名取自文件名，一个文件只能导出一个场景，
// 所以每个卡片单独一个文件（src/scenes/ch01/s10.tsx 等），默认导出
// makeCardScene(...) 的结果。
const BG = '#0F172A';
const GREEN = '#34D399';
const BLUE = '#38BDF8';
const YELLOW = '#FBBF24';
const SLATE = '#94A3B8';
const SANS = '"Noto Sans CJK SC", sans-serif';
const SERIF = '"Noto Serif CJK SC", serif';

export interface CardLine {
  text: string;
  color?: string;
  size?: number;
}

export function makeCardScene(
  kicker: string,
  title: string,
  lines: CardLine[],
  closing: string,
  duration: number,
  titleSize = 46,
) {
  return makeScene2D(function* (view: View2D) {
    view.add(<Rect width={1280} height={720} fill={BG} />);
    view.fill(BG);

    const kickerRef = createRef<Txt>();
    const titleRef = createRef<Txt>();
    const lineRefs = lines.map(() => createRef<Txt>());
    const closingRef = createRef<Txt>();

    // 自适应布局：行数多时缩小行距、整体上移，收尾行永远在最后一条要点下方。
    // closingY = startY + blockH + 90（最后一条要点之下 90px）；
    // 旧版曾写成 startY + blockH/2 + 100，收尾行落在要点块中间，与要点重叠。
    const spacing = lines.length > 4 ? 56 : 72;
    const blockH = (lines.length - 1) * spacing;
    const startY = -blockH / 2;
    const titleY = startY - 140;
    const closingY = startY + blockH + 90;
    const lineY = (i: number) => startY + i * spacing;
    const lineSize = (line: CardLine) =>
      line.size ?? (lines.length > 4 ? 28 : 32);
    view.add(
      <>
        <Txt
          ref={kickerRef}
          position={[-600, -320]}
          offset={[-1, 0]}
          fontSize={24}
          fill={YELLOW}
          fontFamily={SANS}
          opacity={0}
          text={kicker}
        />
        <Txt
          ref={titleRef}
          position={[0, titleY]}
          fontSize={titleSize}
          fontWeight={700}
          fill={'#FFFFFF'}
          fontFamily={SERIF}
          opacity={0}
          text={title}
        />
        {lines.map((line, i) => (
          <Txt
            key={String(i)}
            ref={lineRefs[i]}
            position={[0, lineY(i)]}
            fontSize={lineSize(line)}
            fontWeight={700}
            fill={line.color ?? '#E2E8F0'}
            fontFamily={SANS}
            opacity={0}
            text={line.text}
          />
        ))}
        <Txt
          ref={closingRef}
          position={[0, closingY]}
          fontSize={28}
          fill={SLATE}
          fontFamily={SANS}
          opacity={0}
          text={closing}
        />
      </>,
    );

    // 时间预算：标题独占约 20% 时长 → 要点逐条出现（共约 55%）→
    // 收尾行 + 尾停 → 淡出 0.5s。避免改版前“前 10 秒出完、后 19 秒静止”的问题。
    const fadeOut = 0.5;
    const closingIn = 0.8;
    let titleOnly = Math.max(1.5, duration * 0.2);
    let lineHold = (duration * 0.55) / Math.max(1, lines.length);
    // 短卡（8s/12s）按原比例会超时：固定开销（淡入 1.0 + 收尾 0.8 +
    // 淡出 0.5 + 最小尾停 0.3 = 2.6s）之外，可变部分按比例压缩，
    // 保证总时长 = duration。长卡不受影响（可变部分本来就有余量）。
    const fixed = 1.0 + closingIn + fadeOut + 0.3;
    const variable = titleOnly + lines.length * (0.6 + lineHold);
    if (fixed + variable > duration) {
      const scale = (duration - fixed) / variable;
      titleOnly *= scale;
      lineHold *= scale;
    }
    const elapsed =
      1.0 + titleOnly + lines.length * (0.6 + lineHold) + closingIn;
    const tail = Math.max(0.3, duration - elapsed - fadeOut);

    yield* all(kickerRef().opacity(1, 1.0), titleRef().opacity(1, 1.0));
    yield* waitFor(titleOnly);
    for (let i = 0; i < lines.length; i++) {
      yield* lineRefs[i]().opacity(1, 0.6);
      yield* waitFor(lineHold);
    }
    yield* closingRef().opacity(1, closingIn);
    yield* waitFor(tail);
    yield* all(
      kickerRef().opacity(0, fadeOut),
      titleRef().opacity(0, fadeOut),
      closingRef().opacity(0, fadeOut),
      ...lineRefs.map(r => r().opacity(0, fadeOut)),
    );
  });
}

export const COLORS = {GREEN, BLUE, YELLOW, RED: '#F87171', SLATE};
