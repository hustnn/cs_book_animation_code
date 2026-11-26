// U1 场景 2（MC）：a14–a23 —— 索引是路标：无索引扫 3 行、建路标跳过去、
// 再写改指行 4、删路标回到扫全文件、两个路标。分镜：skill-ch03/beats-u1.md；
// 原文：DDIA §3.1。时长全部来自 timeline/u1.json（beat() 驱动）。
// r2 新版：拍号 a 系；走查按设计补全五步；计数器数扫描行数；
// a19 第四行是走查用的新值（示例值，非原文）。
// r4：a17b 讲到“路标里四十二指第三行”时连线箭头从路标 42 一格指向文件第 3 行；
// a19 第四行旁加“示意”小标（与 U10/U12 同一套标注）；新增 a23b/a23c 两拍（名字字段）。
// r5：a15 前指加三处跟旁白展开的动作；a19 念到“渔人码头”时新行变黄；
// 新增 a23d（一个名字可以指多行）：按名字查的路标补“旧金山 → 第 2 行、第 3 行”。
// r6：a17b 建路标时同一个键后读到的盖掉先读到的（路标行闪一下）；a19 第四行 JSON 通条亮出
// （名字还是旧金山、景点是渔人码头）；a23d 旧金山条目改成“第 2、3、4 行”，第 4 行同黄。
import {Circle, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, chain, createRef} from '@motion-canvas/core';
import {at, makeBeats} from '../../lib/beats';
import {FONT, SAFE, SIZE, T} from '../../lib/theme';
import {Counter} from '../../lib/schemas';
import timeline from '../../timeline/u1.json';

export default makeScene2D(function* (view) {
  view.fill(T.bg);
  const beat = makeBeats(timeline);

  const header = createRef<Txt>();
  const anchor = createRef<Txt>();
  const say = (text: string) => anchor().text(text);

  const idx = createRef<Node>();
  const fileBox = createRef<Rect>();
  const frow1 = createRef<Txt>();
  const frow2 = createRef<Txt>();
  const frow3 = createRef<Txt>();
  const frow4 = createRef<Txt>();
  const card1 = createRef<Rect>();
  const card1Title = createRef<Txt>();
  const card1Line1 = createRef<Txt>();
  const card1Line2 = createRef<Txt>();
  const card2 = createRef<Rect>();
  const card2Line2 = createRef<Txt>();
  const arrow1 = createRef<Line>();
  const arrow2 = createRef<Line>();
  const signTag = createRef<Txt>();
  const staleTag = createRef<Txt>();
  const fishNote = createRef<Txt>();
  const row4json = createRef<Rect>();
  const sameTag = createRef<Txt>();
  const scan = createRef<Rect>();
  const dot = createRef<Circle>();
  const jumpTag = createRef<Txt>();
  const hl3 = createRef<Rect>();

  const scanCounter = new Counter([0, 230], '已扫 ', ' 行');

  view.add(
    <>
      <Txt
        ref={header}
        position={[-SAFE.halfW, -SAFE.halfH]}
        offset={[-1, -1]}
        fontSize={SIZE.label}
        fill={T.muted}
        fontFamily={FONT.sans}
        text={'最简单的数据库：一行一行追加'}
      />
      <Txt
        ref={anchor}
        position={[0, 280]}
        fontSize={SIZE.body}
        fill={T.text}
        fontFamily={FONT.sans}
        textAlign={'center'}
        textWrap
        maxWidth={SAFE.width}
        text={''}
      />

      {/* 索引 + 文件 */}
      <Node ref={idx} opacity={0}>
        <Rect ref={fileBox} position={[-280, -40]} width={560} height={280} radius={16} fill={T.card} stroke={T.line} lineWidth={2}>
          <Txt position={[0, -118]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'数据文件'} />
        </Rect>
        <Txt ref={frow1} position={[-280, -120]} fontSize={22} fill={T.text} fontFamily={FONT.mono} text={'123456 → 伦敦'} opacity={0} />
        <Txt ref={frow2} position={[-280, -60]} fontSize={22} fill={T.muted} fontFamily={FONT.mono} text={'42 → 金门大桥（旧）'} opacity={0} />
        <Txt ref={frow3} position={[-280, 0]} fontSize={22} fill={T.text} fontFamily={FONT.mono} text={'42 → 探索馆'} opacity={0} />
        <Txt ref={frow4} position={[-280, 60]} fontSize={22} fill={T.text} fontFamily={FONT.mono} text={'42 → 渔人码头'} opacity={0} />
        <Txt ref={fishNote} position={[-180, 60]} offset={[-1, 0]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'示意'} opacity={0} />
        <Rect ref={hl3} position={[-280, 0]} width={480} height={36} stroke={T.yellow} lineWidth={3} opacity={0} />
        <Rect ref={card1} position={[380, 0]} width={300} height={130} radius={16} fill={T.card} stroke={T.blue} lineWidth={3}>
          <Txt ref={card1Title} position={[0, -38]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'索引：按键查'} />
          <Txt ref={card1Line1} position={[0, 0]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'123456 → 第 1 行'} opacity={0} />
          <Txt ref={card1Line2} position={[0, 36]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'42 → 第 3 行'} opacity={0} />
        </Rect>
        <Rect ref={card2} position={[380, -130]} width={300} height={130} radius={16} fill={T.card} stroke={T.purple} lineWidth={3} opacity={0}>
          <Txt position={[0, -38]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'索引：按名字查'} />
          <Txt position={[0, 0]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'伦敦 → 第 1 行'} />
          {/* r5：旧金山条目（P2-4：一个名字可以指多行），a23d 才出现 */}
          {/* r6：第四行的名字也是旧金山（P2-5），条目改成第 2、3、4 行 */}
          <Txt ref={card2Line2} position={[0, 36]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'旧金山 → 第 2、3、4 行'} opacity={0} />
        </Rect>
        <Line ref={arrow1} points={[[225, 0], [10, 0]]} stroke={T.yellow} lineWidth={3} endArrow opacity={0} />
        <Line ref={arrow2} points={[[225, -130], [10, -120]]} stroke={T.yellow} lineWidth={3} endArrow opacity={0} />
        <Txt ref={signTag} position={[380, -210]} fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.sans} text={'路标'} opacity={0} />
        {/* r6：a19 第四行 JSON 通条（P2-3），文件下方亮出，a19b 起收掉 */}
        <Rect ref={row4json} position={[0, 185]} width={1060} height={52} radius={12} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt fontSize={19} fill={T.text} fontFamily={FONT.mono} text={"42,{\"name\":\"San Francisco\",\"attractions\":[\"Fisherman's Wharf\"]}"} />
        </Rect>
        <Txt ref={staleTag} position={[380, 88]} fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.sans} text={'还没更新'} opacity={0} />
        <Txt ref={sameTag} position={[0, 170]} fontSize={SIZE.body} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'内容不变'} opacity={0} />
        <Circle ref={dot} position={[225, 0]} width={22} height={22} fill={T.yellow} opacity={0} />
        <Txt ref={jumpTag} position={[0, 230]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} text={'跳 1 次'} opacity={0} />
      </Node>

      {/* 扫描线 */}
      <Rect ref={scan} position={[-280, -170]} width={560} height={6} fill={T.yellow} opacity={0} />
    </>
  );
  view.add(scanCounter.node);

  say('要找得快，加索引');
  yield* beat('a14',
    all(idx().opacity(1, 0.5), frow1().opacity(1, 0.4), frow2().opacity(1, 0.4), frow3().opacity(1, 0.4)),
    at('索引', card1Title().fill(T.yellow, 0.4)),
    // r4：两种摆法轮流点亮——文件、路标（修 idle：原旁白加长后静止 7.0s）
    at('文件是一种摆法', fileBox().stroke(T.blue, 0.4)),
    at('路标是另一种', card1().stroke(T.yellow, 0.4)),
  );

  say('索引是路标');
  yield* beat('a15',
    all(arrow1().opacity(1, 0.5), signTag().opacity(1, 0.4), idx().scale(1.02, beat.dur('a15'))),
    at('路标', signTag().fill(T.yellow, 0.4)),
    at('定位', all(arrow1().stroke(T.green, 0.4), fileBox().stroke(T.green, 0.4))),
    // r5：前指——路标另外存着，放内存还是放磁盘看索引种类（P2-2；旁白加长后 a15 5.8s → 10.6s，跟旁白分步展开）
    at('另外存着', signTag().scale(1.15, 0.4)),
    at('放内存还是放磁盘', card1().stroke(T.purple, 0.4)),
    at('后面会讲到', arrow1().stroke(T.yellow, 0.4)),
  );

  say('没索引，扫 3 行');
  yield* beat('a16',
    all(card1().opacity(0.25, 0.5), scanCounter.node.opacity(1, 0.4), scan().opacity(1, 0.4), scan().position([-280, 90], 3.0)),
    at('扫三行', chain(scanCounter.bump(), scanCounter.bump(), scanCounter.bump())),
  );

  say('键 → 行号');
  yield* beat('a17a',
    all(card1().opacity(1, 0.5), scan().opacity(0, 0.4)),
    at('路标', card1().stroke(T.yellow, 0.4)),
  );

  say('123456 → 第 1 行，42 → 第 3 行');
  yield* beat('a17b',
    all(card1().stroke(T.blue, 0.4)),
    at('一二三四五六', card1Line1().opacity(1, 0.4)),
    at('四十二', card1Line2().opacity(1, 0.4)),
    at('路标里四十二指第三行', all(arrow1().opacity(1, 0.4), hl3().opacity(1, 0.4))),
    // r6：同一个键后读到的盖掉先读到的（P2-2）——路标行闪一下
    at('盖掉先读到的', chain(card1Line2().scale(1.12, 0.25), card1Line2().scale(1, 0.25))),
    // r4：为什么指第 3 行——箭头、行框先后变绿（修 idle：原旁白加长后静止 8.3s）
    at('因为查四十二要的是最后一次出现', arrow1().stroke(T.green, 0.4)),
    at('第三行就是最后一次', hl3().stroke(T.green, 0.4)),
  );

  say('直接跳到第 3 行');
  yield* beat('a18',
    all(dot().opacity(1, 0.4), scanCounter.node.opacity(0, 0.3), arrow1().opacity(0, 0.3)),
    at('直接跳到第三行', chain(dot().position([10, 0], 0.9), hl3().opacity(1, 0.4))),
    at('不用扫了', jumpTag().opacity(1, 0.4)),
  );

  say('文件追加第 4 行');
  yield* beat('a19',
    all(frow4().opacity(1, 0.4), fishNote().opacity(1, 0.4), dot().opacity(0, 0.3), hl3().opacity(0, 0.3), jumpTag().opacity(0, 0.3)),
    // r5：旁白用“比如”点名新值（P2-1）——念到名字时新行变黄
    at('渔人码头', frow4().fill(T.yellow, 0.4)),
    // r6：第四行也是一份 JSON（P2-3）——念到时 JSON 通条亮出
    at('也是一份 JSON', row4json().opacity(1, 0.4)),
    at('第四行', card1Line2().fill(T.yellow, 0.4)),
    at('还没更新', staleTag().opacity(1, 0.4)),
  );

  dot().position([225, 0]);
  say('旧路标还指第 3 行');
  yield* beat('a19b',
    all(dot().opacity(1, 0.4), row4json().opacity(0, 0.4)),
    at('走路标查四十二', chain(dot().position([10, 0], 0.9), hl3().opacity(1, 0.4))),
    at('第三行', chain(jumpTag().text('走路标查 → 第 3 行', 0), jumpTag().opacity(1, 0.4))),
    at('探索馆', hl3().stroke(T.green, 0.4)),
    // r4：滞后定性——卡变黄、行框回黄、“还没更新”闪一下（修 idle：原旁白加长后静止 8.2s）
    at('写完才算数', card1().stroke(T.yellow, 0.4)),
    at('中间查到的还是旧值', hl3().stroke(T.yellow, 0.4)),
    at('是这次写还没做完', staleTag().scale(1.15, 0.4)),
  );

  say('写数据，索引也得改');
  yield* beat('a20',
    all(idx().scale(1.015, beat.dur('a20')), hl3().opacity(0, 0.3), dot().opacity(0, 0.3), jumpTag().opacity(0, 0.3), staleTag().opacity(0, 0.3)),
    at('改指第四行', chain(card1Line2().opacity(0.2, 0.2), card1Line2().text('42 → 第 4 行', 0), card1Line2().opacity(1, 0.3), card1Line2().fill(T.text, 0.3))),
    at('每次写数据', frow4().fill(T.green, 0.4)),
    at('跟着更新', card1().stroke(T.yellow, 0.4)),
  );

  say('删路标，内容不变');
  yield* beat('a21',
    all(card1().opacity(0, 0.6)),
    at('删掉路标', signTag().opacity(0, 0.4)),
    at('数据原样', all(sameTag().opacity(1, 0.4), fileBox().stroke(T.green, 0.4))),
  );

  say('又回到扫全文件');
  scan().position([-280, -170]);
  yield* beat('a22',
    all(scan().opacity(1, 0.4), scan().position([-280, 90], 3.5), scanCounter.reset(0.3), scanCounter.node.opacity(1, 0.4)),
    at('扫全文件', chain(scanCounter.bump(), scanCounter.bump(), scanCounter.bump(), scanCounter.bump())),
    at('只影响查询的性能', sameTag().fill(T.green, 0.4)),
  );

  say('几种查法，几个索引');
  yield* beat('a23',
    all(card1().opacity(1, 0.5), card2().opacity(1, 0.5), scan().opacity(0, 0.4), scanCounter.node.opacity(0, 0.4), idx().scale(1.03, beat.dur('a23'))),
    at('按键查', card1().stroke(T.blue, 0.4)),
    at('按名字查', all(arrow2().opacity(1, 0.5), card2().stroke(T.purple, 0.4))),
  );

  say('键就是名字');
  yield* beat('a23b',
    all(idx().scale(1.04, beat.dur('a23b'))),
    at('键就是名字', card2().stroke(T.yellow, 0.4)),
  );

  say('名字从值里读出来');
  yield* beat('a23c',
    all(idx().scale(1.05, beat.dur('a23c'))),
    at('名字从值里读出来', all(card2().stroke(T.purple, 0.4), frow1().fill(T.yellow, 0.4))),
  );

  say('一个名字可以指多行');
  yield* beat('a23d',
    all(idx().scale(1.06, beat.dur('a23d'))),
    // r5：一个名字可以指多行（P2-4）——路标补旧金山条目，第 2、3 行变黄
    // （a23c 合句录音 TTS 疑似多读，按 skill 规则拆拍为 a23c + a23d）
    // r6：旧金山条目含第 4 行（P2-5），第 4 行同黄；按名字一查三行都返回（P2-4）
    at('多行', all(card2Line2().opacity(1, 0.4), frow2().fill(T.yellow, 0.4), frow3().fill(T.yellow, 0.4), frow4().fill(T.yellow, 0.4))),
  );
});
