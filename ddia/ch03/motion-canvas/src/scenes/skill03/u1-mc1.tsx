// U1 场景 1（MC）：b1–b12 —— 钩子、为什么关心底层、db_set/db_get 代码、
// 追加写日志文件（42 两次写，旧值变灰）、tail -n 1 取最后一次、O(n) 扫描线与翻倍演示。
// 分镜：skill-ch03/beats-u1.md；原文：DDIA §3.0–§3.1（书页 p69–71，PDF p91–93）。
// 时长全部来自 timeline/u1.json（beat() 驱动），不手写 waitFor。
import {Circle, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, chain, createRef} from '@motion-canvas/core';
import {at, makeBeats} from '../../lib/beats';
import {FONT, SAFE, SIZE, T} from '../../lib/theme';
import timeline from '../../timeline/u1.json';

export default makeScene2D(function* (view) {
  view.fill(T.bg);
  const beat = makeBeats(timeline);

  const header = createRef<Txt>();
  const anchor = createRef<Txt>();
  const say = (text: string) => anchor().text(text);

  // ---- 第 1 页：钩子 + 为什么关心底层 + 代码 + 键值/JSON ----
  const g1 = createRef<Node>();
  const g1set = createRef<Rect>();
  const g1get = createRef<Rect>();
  const g1q = createRef<Txt>();
  const g2 = createRef<Node>();
  const g2pick = createRef<Rect>();
  const g2tune = createRef<Rect>();
  const g3 = createRef<Node>();
  const g3code = createRef<Rect>();
  const g3setLines = createRef<Node>();
  const g3getLines = createRef<Node>();
  const g3setTitle = createRef<Txt>();
  const g3getTitle = createRef<Txt>();
  const g4 = createRef<Node>();
  const g4key = createRef<Rect>();
  const g4val = createRef<Rect>();
  const g4json = createRef<Rect>();
  const g4j1 = createRef<Txt>();
  const g4j2 = createRef<Txt>();

  // ---- 第 2 页：日志文件 + 扫描 + O(n) 翻倍演示 ----
  const file = createRef<Node>();
  const fileBox = createRef<Rect>();
  const row1 = createRef<Txt>();
  const row2 = createRef<Txt>();
  const row3 = createRef<Txt>();
  const hl1 = createRef<Rect>();
  const hl2 = createRef<Rect>();
  const hl3 = createRef<Rect>();
  const oldTag = createRef<Txt>();
  const commaTag = createRef<Txt>();
  const dot = createRef<Circle>();
  const chip = createRef<Rect>();
  const app = createRef<Node>();
  const appArrow = createRef<Line>();
  const appBar = createRef<Rect>();
  const appBarLab = createRef<Txt>();
  const scan = createRef<Rect>();
  const demo = createRef<Node>();
  const demoTitle = createRef<Txt>();
  const smallFile = createRef<Rect>();
  const bigFile = createRef<Rect>();
  const smallTicks = [0, 1, 2, 3].map(() => createRef<Rect>());
  const bigTicks = [0, 1, 2, 3, 4, 5, 6, 7].map(() => createRef<Rect>());
  const barSmall = createRef<Rect>();
  const barBig = createRef<Rect>();
  const barSmallLab = createRef<Txt>();
  const barBigLab = createRef<Txt>();

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

      {/* b1：两张函数卡 + 问号 */}
      <Node ref={g1} opacity={0}>
        <Rect ref={g1set} position={[-280, -60]} width={480} height={160} radius={16} fill={T.card} stroke={T.blue} lineWidth={3}>
          <Txt fontSize={SIZE.title} fontWeight={700} fill={T.text} fontFamily={FONT.mono} text={'db_set'} />
        </Rect>
        <Rect ref={g1get} position={[280, -60]} width={480} height={160} radius={16} fill={T.card} stroke={T.blue} lineWidth={3}>
          <Txt fontSize={SIZE.title} fontWeight={700} fill={T.text} fontFamily={FONT.mono} text={'db_get'} />
        </Rect>
        <Txt ref={g1q} position={[0, 110]} fontSize={72} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'?'} opacity={0} />
      </Node>

      {/* b2：选引擎 / 调优 */}
      <Node ref={g2} opacity={0}>
        <Rect ref={g2pick} position={[0, -140]} width={640} height={110} radius={16} fill={T.card} stroke={T.blue} lineWidth={3}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'选一个合适的引擎'} />
        </Rect>
        <Rect ref={g2tune} position={[0, 10]} width={640} height={110} radius={16} fill={T.card} stroke={T.blue} lineWidth={3} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'调优到自己的负载'} />
        </Rect>
      </Node>

      {/* b3：代码块 */}
      <Node ref={g3} opacity={0}>
        <Rect ref={g3code} position={[0, -40]} width={940} height={320} radius={16} fill={T.card} stroke={T.line} lineWidth={2}>
          <Node ref={g3setLines} opacity={0}>
            <Txt ref={g3setTitle} position={[-430, -120]} offset={[-1, 0]} fontSize={19} fill={T.text} fontFamily={FONT.mono} text={'db_set () {'} />
            <Txt position={[-430, -80]} offset={[-1, 0]} fontSize={19} fill={T.text} fontFamily={FONT.mono} text={'  echo "$1,$2" >> database'} />
            <Txt position={[-430, -40]} offset={[-1, 0]} fontSize={19} fill={T.text} fontFamily={FONT.mono} text={'}'} />
          </Node>
          <Node ref={g3getLines} opacity={0}>
            <Txt ref={g3getTitle} position={[-430, 20]} offset={[-1, 0]} fontSize={19} fill={T.text} fontFamily={FONT.mono} text={'db_get () {'} />
            <Txt position={[-430, 60]} offset={[-1, 0]} fontSize={19} fill={T.text} fontFamily={FONT.mono} text={'  grep "^$1," database | sed -e "s/^$1,//" | tail -n 1'} />
            <Txt position={[-430, 100]} offset={[-1, 0]} fontSize={19} fill={T.text} fontFamily={FONT.mono} text={'}'} />
          </Node>
        </Rect>
      </Node>

      {/* b4：键卡 / 值卡 / JSON 文档 */}
      <Node ref={g4} opacity={0}>
        <Rect ref={g4key} position={[-300, -60]} width={300} height={140} radius={16} fill={T.card} stroke={T.blue} lineWidth={3}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'键'} />
        </Rect>
        <Rect ref={g4val} position={[300, -60]} width={300} height={140} radius={16} fill={T.card} stroke={T.blue} lineWidth={3}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'值'} />
        </Rect>
        <Rect ref={g4json} position={[0, 130]} width={780} height={120} radius={16} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt ref={g4j1} position={[0, -28]} fontSize={20} fill={T.text} fontFamily={FONT.mono} text={'{"name": "London",'} opacity={0} />
          <Txt ref={g4j2} position={[0, 28]} fontSize={20} fill={T.text} fontFamily={FONT.mono} text={'"attractions": ["Big Ben", "London Eye"]}'} opacity={0} />
        </Rect>
      </Node>

      {/* 第 2 页：日志文件，三行记录 */}
      <Node ref={file} opacity={0}>
        <Rect ref={fileBox} position={[0, -30]} width={1060} height={300} radius={16} fill={T.card} stroke={T.line} lineWidth={2}>
          <Txt position={[0, -128]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'database —— 文本文件'} />
        </Rect>
        <Txt ref={row1} position={[0, -80]} fontSize={20} fill={T.text} fontFamily={FONT.mono} maxWidth={1020} textWrap text={'123456,{"name":"London","attractions":["Big Ben","London Eye"]}'} opacity={0} />
        <Txt ref={row2} position={[0, -20]} fontSize={20} fill={T.text} fontFamily={FONT.mono} maxWidth={1020} textWrap text={'42,{"name":"San Francisco","attractions":["Golden Gate Bridge"]}'} opacity={0} />
        <Txt ref={row3} position={[0, 40]} fontSize={20} fill={T.text} fontFamily={FONT.mono} maxWidth={1020} textWrap text={'42,{"name":"San Francisco","attractions":["Exploratorium"]}'} opacity={0} />
        <Rect ref={hl1} position={[0, -80]} width={900} height={36} stroke={T.yellow} lineWidth={3} opacity={0} />
        <Rect ref={hl2} position={[0, -20]} width={900} height={36} stroke={T.yellow} lineWidth={3} opacity={0} />
        <Rect ref={hl3} position={[0, 40]} width={900} height={36} stroke={T.yellow} lineWidth={3} opacity={0} />
        <Txt ref={oldTag} position={[470, -20]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'旧值'} opacity={0} />
        <Txt ref={commaTag} position={[0, 92]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'每行：键，值 —— 逗号分隔'} opacity={0} />
        <Circle ref={dot} position={[-500, -80]} width={22} height={22} fill={T.yellow} opacity={0} />
        <Rect ref={chip} position={[0, 185]} width={520} height={56} radius={12} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.green} fontFamily={FONT.mono} text={'42 → Exploratorium'} />
        </Rect>
      </Node>

      {/* b10：追加箭头 + 速度条 */}
      <Node ref={app} opacity={0}>
        <Line ref={appArrow} points={[[520, -180], [520, -30]]} stroke={T.green} lineWidth={3} endArrow opacity={0} />
        <Rect ref={appBar} position={[-300, 185]} offset={[-1, 0]} width={10} height={30} fill={T.green} opacity={0} />
        <Txt ref={appBarLab} position={[360, 185]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} text={'非常高效'} opacity={0} />
      </Node>

      {/* b11：扫描线 */}
      <Rect ref={scan} position={[0, -170]} width={1060} height={6} fill={T.yellow} opacity={0} />

      {/* b12：O(n) 翻倍演示 */}
      <Node ref={demo} opacity={0}>
        <Txt ref={demoTitle} position={[0, -250]} fontSize={40} fontWeight={700} fill={T.yellow} fontFamily={FONT.mono} text={'O(n)'} opacity={0} />
        <Rect ref={smallFile} position={[-320, -80]} width={440} height={220} radius={16} fill={T.card} stroke={T.blue} lineWidth={2}>
          <Txt position={[0, -80]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'4 行'} />
        </Rect>
        <Rect ref={bigFile} position={[320, -80]} width={440} height={220} radius={16} fill={T.card} stroke={T.blue} lineWidth={2}>
          <Txt position={[0, -80]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'8 行'} />
        </Rect>
        {smallTicks.map((_, i) => (
          <Rect key={`st-${i}`} ref={smallTicks[i]} position={[-320, -140 + i * 40]} width={360} height={10} fill={T.line} opacity={0} />
        ))}
        {bigTicks.map((_, i) => (
          <Rect key={`bt-${i}`} ref={bigTicks[i]} position={[320, -135 + i * 20]} width={360} height={8} fill={T.line} opacity={0} />
        ))}
        <Rect ref={barSmall} position={[-320, 90]} width={200} height={26} fill={T.blue} opacity={0} />
        <Rect ref={barBig} position={[320, 90]} width={200} height={26} fill={T.blue} opacity={0} />
        <Txt ref={barSmallLab} position={[-320, 140]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'查找时间 ×1'} opacity={0} />
        <Txt ref={barBigLab} position={[320, 140]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'查找时间 ×2'} opacity={0} />
      </Node>
    </>
  );

  say('两个 Bash 函数？');
  yield* beat('b1',
    all(g1().opacity(1, 0.5)),
    at('函数', g1q().opacity(1, 0.4)),
  );

  say('为什么要关心底层？');
  yield* beat('b2a',
    all(g1().opacity(0, 0.5), g2().opacity(1, 0.5)),
    at('关心数据库底层', g2pick().stroke(T.yellow, 0.4)),
  );

  say('选合适的，调到最好');
  yield* beat('b2b',
    all(g2tune().opacity(1, 0.5), g2().scale(1.02, beat.dur('b2b'))),
    at('调优', g2tune().stroke(T.yellow, 0.4)),
    at('自己的负载', g2pick().stroke(T.blue, 0.4)),
  );

  say('db_set 存，db_get 找');
  yield* beat('b3',
    all(g2().opacity(0, 0.5), g3().opacity(1, 0.5)),
    at('db_set', g3setLines().opacity(1, 0.5)),
    at('db_get', g3getLines().opacity(1, 0.5)),
    at('负责存', g3setTitle().fill(T.green, 0.4)),
    at('负责找', g3getTitle().fill(T.green, 0.4)),
  );

  say('存进去，找回来');
  yield* beat('b4a',
    all(g3().opacity(0, 0.5), g4().opacity(1, 0.5)),
    at('写进去', g4key().stroke(T.green, 0.4)),
    at('找回来', g4val().stroke(T.yellow, 0.4)),
  );

  say('值可以是 JSON 文档');
  yield* beat('b4b',
    all(g4json().opacity(1, 0.5)),
    at('文档', chain(g4j1().opacity(1, 0.4), g4j2().opacity(1, 0.4))),
  );

  say('123456 → 伦敦');
  yield* beat('b5',
    all(g4().opacity(0, 0.5), file().opacity(1, 0.5), row1().opacity(1, 0.4), file().scale(1.015, beat.dur('b5'))),
    at('一二三四五六', hl1().opacity(1, 0.4)),
  );

  say('42 → 金门大桥');
  yield* beat('b6',
    all(row2().opacity(1, 0.4)),
    at('四十二', hl1().opacity(0, 0.3)),
    at('金门大桥', hl2().opacity(1, 0.4)),
  );

  say('每行一个键值对');
  yield* beat('b7',
    all(fileBox().stroke(T.blue, 0.4)),
    at('每行一个键值对', chain(row1().opacity(0.4, 0.3), row1().opacity(1, 0.3), row2().opacity(0.4, 0.3), row2().opacity(1, 0.3))),
    at('逗号分隔', commaTag().opacity(1, 0.4)),
  );

  say('旧值还在，没被覆盖');
  yield* beat('b8',
    all(row3().opacity(1, 0.4)),
    at('再写一次', hl2().opacity(0, 0.3)),
    at('探索馆', hl3().opacity(1, 0.4)),
    at('没被覆盖', all(row2().fill(T.muted, 0.4), oldTag().opacity(1, 0.4))),
  );

  say('取最后一次出现');
  yield* beat('b9',
    all(chip().opacity(1, 0.5), dot().opacity(1, 0.4)),
    at('探索馆', hl3().stroke(T.green, 0.4)),
    at('最后一次出现', dot().position([-500, 40], 1.2)),
  );

  say('追加写，非常高效');
  yield* beat('b10',
    all(chip().opacity(0, 0.4), app().opacity(1, 0.5)),
    at('追加到文件末尾', all(appArrow().opacity(1, 0.4), dot().opacity(0, 0.3))),
    at('非常高效', all(appBar().opacity(1, 0.3), appBar().width(600, 1.2), appBarLab().opacity(1, 0.4))),
    at('日志', appBar().fill(T.green, 0.4)),
  );

  say('查一次，扫全文件');
  yield* beat('b11',
    all(app().opacity(0, 0.5), scan().opacity(1, 0.4), scan().position([0, 110], 3.2)),
    at('扫一遍', chain(row1().opacity(0.4, 0.25), row1().opacity(1, 0.25), row2().opacity(0.4, 0.25), row2().opacity(1, 0.25), row3().opacity(0.4, 0.25), row3().opacity(1, 0.25))),
  );

  say('记录 ×2，时间 ×2');
  yield* beat('b12',
    all(file().opacity(0, 0.5), scan().opacity(0, 0.4), demo().opacity(1, 0.5)),
    at('大 O n', demoTitle().opacity(1, 0.5)),
    at('翻倍', chain(
      smallTicks[0]().opacity(1, 0.3), smallTicks[1]().opacity(1, 0.3), smallTicks[2]().opacity(1, 0.3), smallTicks[3]().opacity(1, 0.3),
      bigTicks[0]().opacity(1, 0.2), bigTicks[1]().opacity(1, 0.2), bigTicks[2]().opacity(1, 0.2), bigTicks[3]().opacity(1, 0.2),
      bigTicks[4]().opacity(1, 0.2), bigTicks[5]().opacity(1, 0.2), bigTicks[6]().opacity(1, 0.2), bigTicks[7]().opacity(1, 0.2),
    )),
    at('记录越多', all(barSmall().opacity(1, 0.4), barBig().opacity(1, 0.4), barBig().width(400, 1.5), barSmallLab().opacity(1, 0.4), barBigLab().opacity(1, 0.4))),
  );
});
