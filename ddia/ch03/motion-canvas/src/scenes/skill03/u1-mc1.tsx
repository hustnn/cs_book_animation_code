// U1 场景 1（MC）：a1–a13 —— 钩子、db_set/db_get 代码、追加写日志文件
// （42 两次写，旧值变灰；约略像 CSV）、tail -n 1 取最后一次、文件长到
// 3000 行、O(n) 翻倍演示。分镜：skill-ch03/beats-u1.md；原文：DDIA §3.1。
// 时长全部来自 timeline/u1.json（beat() 驱动），不手写 waitFor。
// r2 新版：拍号 a 系；a9 用 Cam 推近看 tail -n 1；a10 文件长到 3000 行。
// r5：a2 分工小标改行首限定；a13b 新句处 tally 两行同亮。
// r6：新增 a0 站牌（UnitTitle：第 1 站，a1 开头收成左上角页眉；旧 header 已删）；
// a2 grep 小标改行首“42,”限定；a4b 值里不能带换行（JSON 卡下加小标）。
import {Circle, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, chain, createRef} from '@motion-canvas/core';
import {at, makeBeats} from '../../lib/beats';
import {FONT, SAFE, SIZE, T} from '../../lib/theme';
import {Cam, KV} from '../../lib/schemas';
import {UnitTitle} from '../../lib/opening';
import {CHAPTER} from '../../lib/chapter';
import timeline from '../../timeline/u1.json';

export default makeScene2D(function* (view) {
  view.fill(T.bg);
  const beat = makeBeats(timeline);

  // 单元站牌（a0）：这一站在全章的位置 + 单元标题；a1 开头收成左上角页眉。
  // 页眉与场景原有的左上角标题同一位置同一样式，旧 header 已删，改由 unit.header 承担。
  const unit = new UnitTitle(CHAPTER, 'u1');

  const anchor = createRef<Txt>();
  const say = (text: string) => anchor().text(text);

  const world = createRef<Node>();

  // ---- 第 1 页：钩子 + 代码 + 键值/JSON ----
  const g1 = createRef<Node>();
  const g1set = createRef<Rect>();
  const g1get = createRef<Rect>();
  const g1q = createRef<Txt>();
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
  const noNl = createRef<Txt>();

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
  const commaTag2 = createRef<Txt>();
  const commaTag3 = createRef<Txt>();
  const pipe1 = createRef<Txt>();
  const pipe2 = createRef<Txt>();
  const pipe3 = createRef<Txt>();
  const dot = createRef<Circle>();
  const chip = createRef<Rect>();
  const tailChip = createRef<Rect>();
  const app = createRef<Node>();
  const appArrow = createRef<Line>();
  const appBar = createRef<Rect>();
  const appBarLab = createRef<Txt>();
  const scan = createRef<Rect>();
  const dense = createRef<Node>();
  const denseRows = Array.from({length: 18}, () => createRef<Rect>());
  const rowCount = createRef<Txt>();
  const timeBar = createRef<Rect>();
  const timeLab = createRef<Txt>();
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
  const onLab = createRef<Txt>();
  const tally1 = createRef<Txt>();
  const tally2 = createRef<Txt>();

  const kv = new KV('123456', '伦敦');

  view.add(
    <>
      {unit.nodes()}
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

      <Node ref={world}>
        {/* a1：两张函数卡 + 问号 */}
        <Node ref={g1} opacity={0}>
          <Rect ref={g1set} position={[-280, -60]} width={480} height={160} radius={16} fill={T.card} stroke={T.blue} lineWidth={3}>
            <Txt fontSize={SIZE.title} fontWeight={700} fill={T.text} fontFamily={FONT.mono} text={'db_set'} />
          </Rect>
          <Rect ref={g1get} position={[280, -60]} width={480} height={160} radius={16} fill={T.card} stroke={T.blue} lineWidth={3}>
            <Txt fontSize={SIZE.title} fontWeight={700} fill={T.text} fontFamily={FONT.mono} text={'db_get'} />
          </Rect>
          <Txt ref={g1q} position={[0, 110]} fontSize={72} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'?'} opacity={0} />
        </Node>

        {/* a2：代码块 */}
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
          {/* r4：db_get 三条命令的分工小标，随旁白逐个出现（修 a2 idle） */}
          {/* r5：小标改成行首限定（P2-3：grep 只找行首是 42 的行，sed 去掉行首的键） */}
          <Txt ref={pipe1} position={[-320, 165]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'grep：只找行首是 42, 的行'} opacity={0} />
          <Txt ref={pipe2} position={[0, 165]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'sed：去掉行首的键、只留值'} opacity={0} />
          <Txt ref={pipe3} position={[320, 165]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'tail：取最后一行'} opacity={0} />
        </Node>

        {/* a4b：键卡 / 值卡 / JSON 文档 */}
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
          {/* r6：值里不能带换行（P2-7）——JSON 卡下小标，随新句出现 */}
          <Txt ref={noNl} position={[0, 215]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'值里不能带换行，不然一行就拆成两行'} opacity={0} />
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
          <Txt ref={oldTag} position={[420, -50]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'旧值'} opacity={0} />
          <Txt ref={commaTag} position={[0, 78]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'每行：键，值 —— 逗号分隔，约略像 CSV 文件'} opacity={0} />
          {/* r4：逗号分工小标，随旁白逐个出现（修 a7 idle）；a9 起始收掉 */}
          <Txt ref={commaTag2} position={[0, 108]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'第一个逗号：分开键和值'} opacity={0} />
          <Txt ref={commaTag3} position={[0, 138]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'值里的逗号：JSON 自己的'} opacity={0} />
          <Circle ref={dot} position={[-500, -80]} width={22} height={22} fill={T.yellow} opacity={0} />
          <Rect ref={chip} position={[0, 180]} width={520} height={56} radius={12} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
            <Txt fontSize={SIZE.label} fill={T.green} fontFamily={FONT.mono} text={'42 → Exploratorium'} />
          </Rect>
          <Rect ref={tailChip} position={[0, 118]} width={260} height={44} radius={10} fill={T.card} stroke={T.yellow} lineWidth={2} opacity={0}>
            <Txt fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.mono} text={'tail -n 1'} />
          </Rect>
          <Node ref={dense} opacity={0}>
            {denseRows.map((_, i) => (
              <Rect key={`dr-${i}`} ref={denseRows[i]} position={[0, -140 + i * 15]} width={900} height={6} fill={T.line} />
            ))}
          </Node>
          <Txt ref={rowCount} position={[0, 185]} fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.sans} text={'3 行 → 3000 行'} opacity={0} />
          <Rect ref={timeBar} position={[-300, 225]} offset={[-1, 0]} width={10} height={26} fill={T.blue} opacity={0} />
          <Txt ref={timeLab} position={[360, 225]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'查找时间 ×1000'} opacity={0} />
        </Node>

        {/* a8：追加箭头 + 速度条 */}
        <Node ref={app} opacity={0}>
          <Line ref={appArrow} points={[[520, -180], [520, -30]]} stroke={T.green} lineWidth={3} endArrow opacity={0} />
          <Rect ref={appBar} position={[-300, 185]} offset={[-1, 0]} width={10} height={30} fill={T.green} opacity={0} />
          <Txt ref={appBarLab} position={[360, 185]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} text={'非常高效'} opacity={0} />
        </Node>

        {/* a8/a11：扫描线 */}
        <Rect ref={scan} position={[0, -170]} width={1060} height={6} fill={T.yellow} opacity={0} />

        {/* a12：O(n) 翻倍演示 */}
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
          <Txt ref={onLab} position={[0, -205]} fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.sans} text={'n 是行数'} opacity={0} />
          <Txt ref={tally1} position={[0, 195]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'n = 3 行 → 时间 ×1'} opacity={0} />
          <Txt ref={tally2} position={[0, 230]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'n = 3000 行 → 时间 ×1000'} opacity={0} />
        </Node>
      </Node>
    </>
  );
  world().add(kv.node);
  const cam = new Cam(world());

  // a0：单元站牌（演示拍，念完留 0.8s）
  yield* beat('a0', unit.enter());

  say('两个 Bash 函数？');
  yield* beat('a1',
    unit.toHeader(),
    all(g1().opacity(1, 0.5)),
    at('函数', g1q().opacity(1, 0.4)),
  );

  say('db_set 存，db_get 找');
  yield* beat('a2',
    all(g1().opacity(0, 0.5), g3().opacity(1, 0.5)),
    at('db_set', g3setLines().opacity(1, 0.5)),
    at('db_get', g3getLines().opacity(1, 0.5)),
    at('负责存', g3setTitle().fill(T.green, 0.4)),
    at('负责找', g3getTitle().fill(T.green, 0.4)),
    // r4：三条命令的分工小标跟着旁白逐个出现（修 idle：原旁白加长后静止 9.3s）
    at('grep', all(pipe1().opacity(1, 0.4), pipe1().fill(T.yellow, 0.4))),
    at('sed', all(pipe2().opacity(1, 0.4), pipe2().fill(T.yellow, 0.4))),
    at('tail', all(pipe3().opacity(1, 0.4), pipe3().fill(T.yellow, 0.4))),
  );

  say('追加到文件末尾');
  yield* beat('a3',
    all(g3().opacity(0, 0.5), file().opacity(1, 0.5), file().scale(1.01, beat.dur('a3'))),
    chain(kv.appear([0, -200]), kv.moveTo([0, -80], 0.8)),
  );

  say('123456 → 伦敦');
  yield* beat('a4a',
    all(kv.hide(0.3), row1().opacity(1, 0.4), file().scale(1.015, beat.dur('a4a'))),
    at('一二三四五六', hl1().opacity(1, 0.4)),
  );

  say('值可以是 JSON 文档');
  yield* beat('a4b',
    all(file().opacity(0, 0.5), g4().opacity(1, 0.5), g4json().opacity(1, 0.5)),
    at('文档', chain(g4j1().opacity(1, 0.4), g4j2().opacity(1, 0.4))),
    // r6：值里不能带换行（P2-7）——新句处小标出现
    at('不能带换行', noNl().opacity(1, 0.4)),
  );

  say('42 → 金门大桥');
  yield* beat('a5',
    all(g4().opacity(0, 0.5), file().opacity(1, 0.5), row2().opacity(1, 0.4)),
    at('四十二', hl1().opacity(0, 0.3)),
    at('金门大桥', hl2().opacity(1, 0.4)),
  );

  say('旧值还在，没被覆盖');
  yield* beat('a6',
    all(row3().opacity(1, 0.4)),
    at('再写一次', hl2().opacity(0, 0.3)),
    at('探索馆', hl3().opacity(1, 0.4)),
    at('没被覆盖', all(row2().fill(T.muted, 0.4), oldTag().opacity(1, 0.4))),
  );

  say('每行一个键值对');
  yield* beat('a7',
    all(fileBox().stroke(T.blue, 0.4)),
    at('每行一个键值对', chain(row1().opacity(0.4, 0.3), row1().opacity(1, 0.3), row2().opacity(0.4, 0.3), row2().opacity(1, 0.3))),
    at('逗号分隔', commaTag().opacity(1, 0.4)),
    at('CSV 文件', commaTag().fill(T.yellow, 0.4)),
    // r4：逗号分工小标跟着旁白逐个出现（修 idle：原旁白加长后静止 6.2s）
    at('每行第一个逗号', commaTag2().opacity(1, 0.4)),
    at('值里面那些逗号', commaTag3().opacity(1, 0.4)),
  );

  say('写快，查要扫全文件');
  yield* beat('a8',
    all(app().opacity(1, 0.5)),
    at('追加到末尾', all(appArrow().opacity(1, 0.4), dot().opacity(0, 0.3))),
    at('非常高效', all(appBar().opacity(1, 0.3), appBar().width(600, 1.2), appBarLab().opacity(1, 0.4))),
    at('查四十二', all(scan().opacity(1, 0.4), scan().position([0, 110], 2.5), chain(row1().opacity(0.4, 0.25), row1().opacity(1, 0.25), row2().opacity(0.4, 0.25), row2().opacity(1, 0.25), row3().opacity(0.4, 0.25), row3().opacity(1, 0.25)))),
    // r4：写不用扫——扫描线收掉、圆点跳到文件末尾、落笔处闪一下（修 idle：原旁白加长后静止 6.3s）
    at('写不用扫全文件', scan().opacity(0, 0.4)),
    at('文件末尾在哪', all(dot().opacity(1, 0.4), dot().position([-500, 110], 1.0))),
    at('跳过去就写', chain(dot().scale(1.6, 0.3), dot().scale(1, 0.3))),
  );

  say('取最后一次出现');
  yield* beat('a9',
    all(app().opacity(0, 0.4), cam.focus([0, 20], 1.3, 1.2), commaTag2().opacity(0, 0.3), commaTag3().opacity(0, 0.3)),
    at('最后一次出现', all(tailChip().opacity(1, 0.4), hl3().stroke(T.green, 0.4), scan().opacity(0, 0.4))),
    at('探索馆', all(chip().opacity(1, 0.5), dot().opacity(1, 0.4), dot().position([-500, 40], 1.0))),
    // r4：旧值/新值对照——先框住旧行，再回到新行、结果块闪一下（修 idle：原旁白加长后静止 8.4s）
    at('旧值还留在文件里', all(hl2().opacity(1, 0.4), row2().fill(T.muted, 0.4))),
    at('新值写在末尾', all(hl2().opacity(0, 0.4), chip().scale(1.06, 0.5))),
    at('就是最新的', chip().stroke(T.yellow, 0.4)),
  );

  say('3000 行');
  yield* beat('a10',
    all(cam.reset(1.2), chip().opacity(0, 0.4), tailChip().opacity(0, 0.4), commaTag().opacity(0, 0.4), oldTag().opacity(0, 0.4), hl1().opacity(0, 0.3), hl2().opacity(0, 0.3), hl3().opacity(0, 0.3)),
    at('三千行', all(dense().opacity(1, 1.2), row1().opacity(0.35, 0.4), row2().opacity(0.35, 0.4), row3().opacity(0.35, 0.4), rowCount().opacity(1, 0.4))),
  );

  say('查找时间 ×1000');
  scan().position([0, -170]);
  yield* beat('a11',
    all(scan().opacity(1, 0.4), scan().position([0, 110], 3.5)),
    at('从头扫到尾', chain(dense().opacity(0.6, 0.3), dense().opacity(1, 0.3))),
    at('一千倍', all(timeBar().opacity(1, 0.4), timeBar().width(600, 1.2), timeLab().opacity(1, 0.4))),
  );

  say('记录 ×2，时间 ×2');
  yield* beat('a12',
    all(file().opacity(0, 0.5), scan().opacity(0, 0.4), app().opacity(0, 0.4), demo().opacity(1, 0.5), demoTitle().opacity(1, 0.5)),
    at('翻倍', chain(
      smallTicks[0]().opacity(1, 0.3), smallTicks[1]().opacity(1, 0.3), smallTicks[2]().opacity(1, 0.3), smallTicks[3]().opacity(1, 0.3),
      bigTicks[0]().opacity(1, 0.2), bigTicks[1]().opacity(1, 0.2), bigTicks[2]().opacity(1, 0.2), bigTicks[3]().opacity(1, 0.2),
      bigTicks[4]().opacity(1, 0.2), bigTicks[5]().opacity(1, 0.2), bigTicks[6]().opacity(1, 0.2), bigTicks[7]().opacity(1, 0.2),
    )),
    at('时间条', all(barSmall().opacity(1, 0.4), barBig().opacity(1, 0.4), barBig().width(400, 1.5), barSmallLab().opacity(1, 0.4), barBigLab().opacity(1, 0.4), demo().scale(1.02, 2.5))),
  );

  say('大 O n');
  yield* beat('a13',
    all(demo().scale(1.03, beat.dur('a13'))),
    at('大 O n', demoTitle().scale(1.15, 0.5)),
    at('n 是行数', onLab().opacity(1, 0.4)),
    at('行数翻倍', all(barSmall().width(260, 1.0), barBig().width(460, 1.0))),
  );

  say('时间跟着行数走');
  yield* beat('a13b',
    all(demo().scale(1.045, beat.dur('a13b'))),
    at('三', tally1().opacity(1, 0.4)),
    at('三千', tally2().opacity(1, 0.4)),
    // r5：O(n) 是趋势说法（P2-5）——新句处两行 tally 同亮
    at('大 O 只说时间跟着行数走', all(tally1().scale(1.08, 0.4), tally2().scale(1.08, 0.4))),
  );
});
