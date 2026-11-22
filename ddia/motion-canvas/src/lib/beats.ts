// 旁白驱动的时间轴。复制到 motion-canvas/src/lib/beats.ts。
//
// 用法：
//   import timeline from '../../timeline/tail-latency.json';
//   const beat = makeBeats(timeline);
//   yield* beat('b1', q().opacity(1, 0.6)); // 动画跑完后，补等到 b1 的音频时长
//   yield* beat('b2');                      // 只有旁白、画面不动（尽量少用）
//
// timeline 来自 scripts/audio_timeline.py：{beats: [{id, dur, text}]}。
// 还没有音频时，也可以直接传 beats.json（[{id, text}]）：按字数估算时长，先把节奏搭起来。

import {ThreadGenerator, useLogger, useTime, waitFor} from '@motion-canvas/core';

export interface BeatSpec {
  id: string;
  dur?: number;
  text?: string;
}

const CJK_PER_SEC = 4.5; // 中文 TTS 常见语速
const PAD = 0.35; // 每拍末尾的留白，与 audio_timeline.py 的 --pad 一致

export function estimateDuration(text = ''): number {
  const cjk = (text.match(/[㐀-鿿豈-﫿]/g) ?? []).length;
  const words = (text.match(/[A-Za-z0-9.%]+/g) ?? []).length;
  return (cjk + words * 1.5) / CJK_PER_SEC + PAD;
}

export function makeBeats(timeline: {beats: BeatSpec[]} | BeatSpec[]) {
  const list = Array.isArray(timeline) ? timeline : timeline.beats;
  const durations = new Map<string, number>();
  for (const b of list) {
    durations.set(b.id, b.dur ?? estimateDuration(b.text));
  }

  return function* beat(id: string, anim?: ThreadGenerator): ThreadGenerator {
    const dur = durations.get(id);
    if (dur === undefined) {
      throw new Error(`beat "${id}" 不在 timeline 里（有：${[...durations.keys()].join(', ')}）`);
    }
    const start = useTime();
    if (anim) {
      yield* anim;
    }
    const spent = useTime() - start;
    if (spent > dur + 0.05) {
      // 动画比旁白长：整体顺延，并提示去改动画或改旁白，否则后期混音会错位。
      useLogger().warn(`beat ${id}: 动画 ${spent.toFixed(2)}s > 旁白 ${dur.toFixed(2)}s，已顺延`);
    }
    yield* waitFor(Math.max(0, dur - spent));
  };
}
