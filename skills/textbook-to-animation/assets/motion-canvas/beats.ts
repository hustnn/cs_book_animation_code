// 旁白驱动的时间轴。复制到 motion-canvas/src/lib/beats.ts。
//
// 用法：
//   import timeline from '../../timeline/tail-latency.json';
//   const beat = makeBeats(timeline);
//   yield* beat('b1', q().opacity(1, 0.6));          // 动画跑完后，补等到 b1 的音频时长
//   yield* beat('b2',                                 // 一拍里有几个动作：跟着旁白念到的词依次出现
//     at('处理', seg1().width(450, 1.2)),
//     at('网络延迟', seg2().width(180, 1.2)),
//     at('排队延迟', seg3().width(270, 1.2)),
//   );
//   yield* beat('b3');                                // 只有旁白、画面不动（尽量少用）
//   beat.dur('b4')                                    // 这一拍的时长，给铺满整拍的慢动作用
//
// timeline 来自 scripts/audio_timeline.py：{beats: [{id, dur, speech, text}]}。
// 还没有音频时，也可以直接传 beats.json（[{id, text}]）：按字数估算时长，先把节奏搭起来。
//
// at(phrase, anim)：按 phrase 在这一拍旁白里的位置（汉字算 1、英文词算 1.5、标点停顿算 0.5）
// 乘以实际配音时长，估出念到它的时刻，提前 lead 秒（默认 0.2）开始 anim。
// phrase 不在旁白里时直接报错——旁白改了、画面没跟着改，在渲染时就能发现。
//
// QA 模式（render.mjs --qa）下，每拍还会：并行跑 qaProbe，在 5 个时刻检查文字重叠/出画；
// 动画比旁白长（overrun）、动画早早做完后画面长时间不动（idle）都记进报告。画面与时长不变。

import {ThreadGenerator, all, chain, useLogger, useTime, waitFor} from '@motion-canvas/core';
import {qaEnabled, qaProbe, qaReportIdle, qaReportOverrun} from './qa';

export interface BeatSpec {
  id: string;
  dur?: number;
  speech?: number;
  text?: string;
}

/** 一个跟旁白对齐的动作：旁白念到 phrase 时开始（提前 lead 秒）。 */
export interface Cue {
  phrase: string;
  anim: ThreadGenerator;
  lead: number;
}

export function at(phrase: string, anim: ThreadGenerator, lead = 0.2): Cue {
  return {phrase, anim, lead};
}

const isCue = (x: unknown): x is Cue =>
  typeof x === 'object' && x !== null && 'phrase' in x && 'anim' in x && 'lead' in x;

const CJK_PER_SEC = 4.5; // 中文 TTS 常见语速
const PAD = 0.35; // 每拍末尾的留白，与 audio_timeline.py 的 --pad 一致

const CJK = /[㐀-鿿豈-﫿]/g;
const WORD = /[A-Za-z0-9.%]+/g;
const PAUSE = /[，。、：；！？,;:!?]/g;

/** 旁白“字数”：汉字 1、英文词 1.5、标点停顿 0.5。 */
function weight(text: string): number {
  return (
    (text.match(CJK) ?? []).length + (text.match(WORD) ?? []).length * 1.5 + (text.match(PAUSE) ?? []).length * 0.5
  );
}

export function estimateDuration(text = ''): number {
  const cjk = (text.match(CJK) ?? []).length;
  const words = (text.match(WORD) ?? []).length;
  return (cjk + words * 1.5) / CJK_PER_SEC + PAD;
}

export function makeBeats(timeline: {beats: BeatSpec[]} | BeatSpec[]) {
  const list = Array.isArray(timeline) ? timeline : timeline.beats;
  const specs = new Map<string, {dur: number; speech: number; text: string}>();
  for (const b of list) {
    const dur = b.dur ?? estimateDuration(b.text);
    specs.set(b.id, {dur, speech: b.speech ?? Math.max(0, dur - PAD), text: b.text ?? ''});
  }

  /** 旁白念到 phrase 的时刻（相对拍首，秒）。 */
  const cueTime = (id: string, phrase: string): number => {
    const s = specs.get(id)!;
    const i = s.text.indexOf(phrase);
    if (i < 0) {
      throw new Error(`beat ${id}: at('${phrase}') 不在这一拍的旁白里（旁白：${s.text}）`);
    }
    const total = weight(s.text);
    return total > 0 ? (s.speech * weight(s.text.slice(0, i))) / total : 0;
  };

  function* beat(id: string, ...parts: (ThreadGenerator | Cue | undefined)[]): ThreadGenerator {
    const spec = specs.get(id);
    if (!spec) {
      throw new Error(`beat "${id}" 不在 timeline 里（有：${[...specs.keys()].join(', ')}）`);
    }
    const dur = spec.dur;
    const threads: ThreadGenerator[] = [];
    for (const p of parts) {
      if (!p) continue;
      if (isCue(p)) {
        const t0 = cueTime(id, p.phrase) - p.lead;
        threads.push(t0 > 0 ? chain(waitFor(t0), p.anim) : p.anim);
      } else {
        threads.push(p);
      }
    }
    const anim = threads.length === 0 ? undefined : threads.length === 1 ? threads[0] : all(...threads);

    const start = useTime();
    let animEnd = start;
    if (qaEnabled()) {
      function* tracked(g: ThreadGenerator): ThreadGenerator {
        yield* g;
        animEnd = useTime();
      }
      yield* anim ? all(tracked(anim), qaProbe(id, dur)) : qaProbe(id, dur);
    } else if (anim) {
      yield* anim;
    }
    const spent = useTime() - start;
    if (spent > dur + 0.05) {
      // 动画比旁白长：整体顺延，并提示去改动画或改旁白，否则后期混音会错位。
      useLogger().warn(`beat ${id}: 动画 ${spent.toFixed(2)}s > 旁白 ${dur.toFixed(2)}s，已顺延`);
      qaReportOverrun(id, spent, dur);
    } else if (qaEnabled()) {
      qaReportIdle(id, start + dur - animEnd, dur);
    }
    yield* waitFor(Math.max(0, dur - spent));
  }

  /** 这一拍的时长（秒）：给需要铺满整拍的慢动作用，例如 node().scale(1.03, beat.dur('b2'))。 */
  const dur = (id: string): number => specs.get(id)?.dur ?? 0;
  return Object.assign(beat, {dur});
}
