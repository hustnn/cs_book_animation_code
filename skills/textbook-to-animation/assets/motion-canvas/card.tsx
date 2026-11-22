// 文字卡：只用于章首引言、单元小结这类“本来就是一句话”的拍，每个单元最多 1 张。
// 复制到 motion-canvas/src/lib/card.tsx（与 theme.ts、beats.ts 同目录）。
//
// 和普通场景一样由旁白驱动：标题和每一行各占一拍，时长来自 timeline。
// 最多 3 行——更多内容说明它不该是一张卡，应该交给旁白或画面。
// 整张卡在所有拍里缓慢推近（1 → 1.04），避免引言、小结这类拍长时间完全静止（渲染 QA 的 idle 检查）。
//
// 用法（一个文件只能导出一个场景）：
//   import {makeCardScene} from '../../lib/card';
//   import {T} from '../../lib/theme';
//   import timeline from '../../timeline/unit-summary.json';
//   export default makeCardScene({
//     timeline,
//     kicker: '单元小结',
//     title: '响应时间是一个分布',
//     titleBeat: 's1',
//     lines: [
//       {text: '看百分位，不看平均值', beat: 's2'},
//       {text: '在客户端测量', beat: 's3', color: T.yellow},
//     ],
//   });

import {Layout, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, createRef} from '@motion-canvas/core';
import {BeatSpec, makeBeats} from './beats';
import {FONT, SAFE, SIZE, T} from './theme';

export interface CardLine {
  text: string;
  beat: string;
  color?: string;
  size?: number;
}

export interface CardOptions {
  timeline: {beats: BeatSpec[]} | BeatSpec[];
  title: string;
  titleBeat: string;
  lines: CardLine[];
  kicker?: string;
}

export function makeCardScene(o: CardOptions) {
  if (o.lines.length > 3) {
    throw new Error(`文字卡最多 3 行（现在 ${o.lines.length} 行）：多出来的内容交给旁白或画面`);
  }
  return makeScene2D(function* (view) {
    view.fill(T.bg);
    const beat = makeBeats(o.timeline);

    const kicker = createRef<Txt>();
    const body = createRef<Layout>();
    const title = createRef<Txt>();
    const lineRefs = o.lines.map(() => createRef<Txt>());

    view.add(
      <>
        <Txt
          ref={kicker}
          position={[-SAFE.halfW, -SAFE.halfH]}
          offset={[-1, -1]}
          fontSize={SIZE.label}
          fill={T.yellow}
          fontFamily={FONT.sans}
          opacity={0}
          text={o.kicker ?? ''}
        />
        {/* 纵向自动排版：行数、换行变化时不用手算坐标；透明的行也占位，所以后出现的行不会挤动前面的行 */}
        <Layout ref={body} layout direction={'column'} alignItems={'center'} gap={36} width={SAFE.width}>
          <Txt
            ref={title}
            fontSize={SIZE.title}
            fontWeight={700}
            fill={T.white}
            fontFamily={FONT.serif}
            textAlign={'center'}
            textWrap
            maxWidth={SAFE.width}
            opacity={0}
            text={o.title}
          />
          {o.lines.map((line, i) => (
            <Txt
              key={`card-line-${i}`}
              ref={lineRefs[i]}
              fontSize={line.size ?? SIZE.body}
              fill={line.color ?? T.text}
              fontFamily={FONT.sans}
              textAlign={'center'}
              textWrap
              maxWidth={SAFE.width}
              opacity={0}
              text={line.text}
            />
          ))}
        </Layout>
      </>,
    );

    // 缓慢推近：按各拍时长分段，推近贯穿整张卡
    const ids = [o.titleBeat, ...o.lines.map(l => l.beat)];
    const total = ids.reduce((s, id) => s + beat.dur(id), 0) || 1;
    let elapsed = 0;
    const drift = (id: string) => {
      elapsed += beat.dur(id);
      return body().scale(1 + (0.04 * elapsed) / total, beat.dur(id));
    };

    yield* beat(o.titleBeat, all(kicker().opacity(1, 0.5), title().opacity(1, 0.6), drift(o.titleBeat)));
    for (let i = 0; i < o.lines.length; i++) {
      yield* beat(o.lines[i].beat, all(lineRefs[i]().opacity(1, 0.5), drift(o.lines[i].beat)));
    }
    // 不做淡出：段与段之间的转场在拼接时统一处理，避免多出旁白之外的时长。
  });
}
