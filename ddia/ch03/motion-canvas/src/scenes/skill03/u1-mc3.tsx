// U1 场景 3（MC）：a24–a34 —— 写代价按动作数（1 / 2 / 4 个动作）、
// 读：扫全文件 vs 一次跳转、天平与手工选、边界三问题、log 两层意思、回扣。
// 分镜：skill-ch03/beats-u1.md；原文：DDIA §3.1。
// 时长全部来自 timeline/u1.json（beat() 驱动）。
// r2 新版：拍号 a 系；动作计数器数出 1 / 2 / 4；a32 应用日志三行随拍首出现。
// r4：第 5 行写具体值“42 → 唐人街”（示意，与 a19 同一套标注；第 4 行“渔人码头”旁也补“示意”）；
// a29a 跷跷板加已有数字（读 扫 3 行 → 0 行，写 1 个动作 → 4 个动作）；a30a 三张卡随旁白点名逐个出现；
// 新增 a33c/a33d 两拍（文本行与二进制的关系，TTS 拆拍）。
// r6：a24 写块飞入改到“再写一个四十二”处（旁白点名唐人街）；a26 三张卡更新块按各索引的键写
// （42 / 唐人街 / 时间），末句“时间也从值里读出来”时第三张卡描黄；a29b 按时间查、按地点查也一样（两张卡随点名描绿）。
import {Circle, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, chain, createRef} from '@motion-canvas/core';
import {at, makeBeats} from '../../lib/beats';
import {FONT, SAFE, SIZE, T} from '../../lib/theme';
import {Counter, KV} from '../../lib/schemas';
import timeline from '../../timeline/u1.json';

export default makeScene2D(function* (view) {
  view.fill(T.bg);
  const beat = makeBeats(timeline);

  const header = createRef<Txt>();
  const anchor = createRef<Txt>();
  const say = (text: string) => anchor().text(text);

  // ---- 写代价：文件 + 三张索引卡 + 动作计数器 ----
  const writeG = createRef<Node>();
  const wFile = createRef<Rect>();
  const wRow1 = createRef<Txt>();
  const wRow2 = createRef<Txt>();
  const wRow3 = createRef<Txt>();
  const wRow4 = createRef<Txt>();
  const wRow5 = createRef<Txt>();
  const wRow4Note = createRef<Txt>();
  const wRow5Note = createRef<Txt>();
  const wCardA = createRef<Rect>();
  const wCardB = createRef<Rect>();
  const wCardC = createRef<Rect>();
  const scan = createRef<Rect>();
  const dot = createRef<Circle>();
  const jumpTag = createRef<Txt>();

  // ---- 天平 + 手工选 ----
  const scaleG = createRef<Node>();
  const beam = createRef<Line>();
  const fulcrum = createRef<Txt>();
  const panRead = createRef<Rect>();
  const panWrite = createRef<Rect>();
  const readNum = createRef<Txt>();
  const writeNum = createRef<Txt>();
  const pick = createRef<Node>();
  const pickCard = createRef<Rect>();
  const patCards = [0, 1, 2].map(() => createRef<Rect>());
  const patTag = createRef<Txt>();

  // ---- 边界三问题 + 日志条 ----
  const issues = createRef<Node>();
  const issueCards = [0, 1, 2].map(() => createRef<Rect>());
  const logBar = createRef<Rect>();

  // ---- log 两层意思 ----
  const logs = createRef<Node>();
  const appLog = createRef<Rect>();
  const appLogTitle = createRef<Txt>();
  const appLogLines = createRef<Node>();
  const binLog = createRef<Rect>();
  const binLogTitle = createRef<Txt>();
  const binLogLines = createRef<Node>();
  const notEq = createRef<Txt>();
  const notEqTag = createRef<Txt>();

  // ---- 收尾：文件 + 路标 ----
  const fin = createRef<Node>();
  const finFile = createRef<Rect>();
  const finRow1 = createRef<Txt>();
  const finRow2 = createRef<Txt>();
  const finCard = createRef<Rect>();
  const finArrow = createRef<Line>();
  const finDot = createRef<Circle>();

  const actCounter = new Counter([0, 230], '动作：', ' 个');
  const writeChip = new KV('42', '唐人街');
  const upA = new KV('42', '第 5 行');
  // r6：更新块按各索引的键写（协调人另注：a26 三张卡条目全是“42: 第 5 行”是画面错误）
  const upB = new KV('唐人街', '第 5 行');
  const upC = new KV('时间', '第 5 行');

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

      {/* 写代价 */}
      <Node ref={writeG} opacity={0}>
        <Rect ref={wFile} position={[-320, -20]} width={480} height={320} radius={16} fill={T.card} stroke={T.line} lineWidth={2}>
          <Txt position={[0, -138]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'数据文件'} />
        </Rect>
        <Txt ref={wRow1} position={[-320, -100]} fontSize={20} fill={T.text} fontFamily={FONT.mono} text={'123456 → 伦敦'} />
        <Txt ref={wRow2} position={[-320, -40]} fontSize={20} fill={T.muted} fontFamily={FONT.mono} text={'42 → 金门大桥（旧）'} />
        <Txt ref={wRow3} position={[-320, 20]} fontSize={20} fill={T.text} fontFamily={FONT.mono} text={'42 → 探索馆'} />
        <Txt ref={wRow4} position={[-320, 80]} fontSize={20} fill={T.text} fontFamily={FONT.mono} text={'42 → 渔人码头'} />
        <Txt ref={wRow4Note} position={[-220, 80]} offset={[-1, 0]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'示意'} opacity={0} />
        <Txt ref={wRow5} position={[-320, 120]} fontSize={20} fill={T.green} fontFamily={FONT.mono} text={'42 → 唐人街'} opacity={0} />
        <Txt ref={wRow5Note} position={[-240, 120]} offset={[-1, 0]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'示意'} opacity={0} />
        <Rect ref={wCardA} position={[320, -150]} width={280} height={100} radius={16} fill={T.card} stroke={T.blue} lineWidth={3} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'索引 1：按键查'} />
        </Rect>
        <Rect ref={wCardB} position={[320, 0]} width={280} height={100} radius={16} fill={T.card} stroke={T.blue} lineWidth={3} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'索引 2：按名字查'} />
        </Rect>
        <Rect ref={wCardC} position={[320, 150]} width={280} height={100} radius={16} fill={T.card} stroke={T.blue} lineWidth={3} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'索引 3：按时间查'} />
        </Rect>
        <Txt ref={jumpTag} position={[0, -230]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} text={'跳 1 次'} opacity={0} />
        <Circle ref={dot} position={[180, -150]} width={22} height={22} fill={T.yellow} opacity={0} />
      </Node>
      <Rect ref={scan} position={[-320, -130]} width={480} height={6} fill={T.yellow} opacity={0} />

      {/* 天平 */}
      <Node ref={scaleG} opacity={0}>
        <Rect ref={panRead} position={[-350, -150]} width={220} height={90} radius={16} fill={T.card} stroke={T.green} lineWidth={3}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'读快'} />
        </Rect>
        <Txt ref={readNum} position={[-350, -70]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} text={'读：扫 3 行 → 0 行'} opacity={0} />
        <Rect ref={panWrite} position={[350, 40]} width={220} height={90} radius={16} fill={T.card} stroke={T.red} lineWidth={3}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'写慢'} />
        </Rect>
        <Txt ref={writeNum} position={[350, 115]} fontSize={SIZE.label} fill={T.red} fontFamily={FONT.sans} text={'写：1 个动作 → 4 个动作'} opacity={0} />
        <Line ref={beam} points={[[-350, -105], [350, 85]]} stroke={T.line} lineWidth={4} />
        <Txt ref={fulcrum} position={[0, 60]} fontSize={44} fill={T.muted} fontFamily={FONT.sans} text={'▲'} />
      </Node>

      {/* 手工选 */}
      <Node ref={pick} opacity={0}>
        <Rect ref={pickCard} position={[0, -180]} width={640} height={110} radius={16} fill={T.card} stroke={T.blue} lineWidth={3}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'手工选：按查询模式挑'} />
        </Rect>
        {[0, 1, 2].map(i => (
          <Rect
            key={`pat-${i}`}
            ref={patCards[i]}
            position={[-400 + i * 400, -20]}
            width={340}
            height={150}
            radius={16}
            fill={T.card}
            stroke={T.line}
            lineWidth={2}
            opacity={0}
          >
            <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={['按用户查', '按时间查', '按地点查'][i]} />
          </Rect>
        ))}
        <Txt ref={patTag} position={[-400, -130]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} text={'收益最大'} opacity={0} />
      </Node>

      {/* 边界三问题 */}
      <Node ref={issues} opacity={0}>
        {[0, 1, 2].map(i => (
          <Rect
            key={`iss-${i}`}
            ref={issueCards[i]}
            position={[-400 + i * 400, -100]}
            width={340}
            height={130}
            radius={16}
            fill={T.card}
            stroke={T.yellow}
            lineWidth={2}
            opacity={0}
          >
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={['并发控制', '回收磁盘空间', '写一半的记录'][i]} />
          </Rect>
        ))}
      </Node>
      <Rect ref={logBar} position={[0, 60]} width={800} height={70} radius={12} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
        <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'追加写的日志'} />
      </Rect>

      {/* log 两层意思 */}
      <Node ref={logs} opacity={0}>
        <Rect ref={appLog} position={[-300, -40]} width={480} height={240} radius={16} fill={T.card} stroke={T.blue} lineWidth={2}>
          <Txt ref={appLogTitle} position={[0, -88]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'应用日志'} opacity={0} />
          <Node ref={appLogLines} opacity={0}>
            <Txt position={[0, -30]} fontSize={20} fill={T.text} fontFamily={FONT.mono} text={'正在启动……'} />
            <Txt position={[0, 15]} fontSize={20} fill={T.text} fontFamily={FONT.mono} text={'收到请求……'} />
            <Txt position={[0, 60]} fontSize={20} fill={T.text} fontFamily={FONT.mono} text={'写入完成……'} />
          </Node>
        </Rect>
        <Rect ref={binLog} position={[300, -40]} width={480} height={240} radius={16} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt ref={binLogTitle} position={[0, -88]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'追加写序列'} opacity={0} />
          <Node ref={binLogLines} opacity={0}>
            <Txt position={[0, -30]} fontSize={20} fill={T.text} fontFamily={FONT.mono} text={'01001000 01100101'} />
            <Txt position={[0, 15]} fontSize={20} fill={T.text} fontFamily={FONT.mono} text={'01101100 01101100'} />
            <Txt position={[0, 60]} fontSize={20} fill={T.text} fontFamily={FONT.mono} text={'01101111 00100000'} />
          </Node>
        </Rect>
        <Txt ref={notEq} position={[0, -40]} fontSize={56} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'≠'} opacity={0} />
        <Txt ref={notEqTag} position={[0, 150]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'两个意思不一样'} opacity={0} />
      </Node>

      {/* 收尾：文件 + 路标 */}
      <Node ref={fin} opacity={0}>
        <Rect ref={finFile} position={[-280, -40]} width={560} height={200} radius={16} fill={T.card} stroke={T.line} lineWidth={2}>
          <Txt position={[0, -78]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'数据文件'} />
        </Rect>
        <Txt ref={finRow1} position={[-280, -40]} fontSize={22} fill={T.text} fontFamily={FONT.mono} text={'123456 → 伦敦'} opacity={0} />
        <Txt ref={finRow2} position={[-280, 20]} fontSize={22} fill={T.text} fontFamily={FONT.mono} text={'42 → 探索馆'} opacity={0} />
        <Rect ref={finCard} position={[380, -40]} width={300} height={130} radius={16} fill={T.card} stroke={T.yellow} lineWidth={3}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'索引：路标'} />
        </Rect>
        <Line ref={finArrow} points={[[225, -40], [10, -20]]} stroke={T.yellow} lineWidth={3} endArrow opacity={0} />
        <Circle ref={finDot} position={[-500, -40]} width={22} height={22} fill={T.yellow} opacity={0} />
      </Node>
    </>
  );
  view.add(actCounter.node);
  writeG().add(writeChip.node);
  writeG().add(upA.node);
  writeG().add(upB.node);
  writeG().add(upC.node);

  say('写：1 个动作');
  yield* beat('a24',
    all(writeG().opacity(1, 0.5), actCounter.node.opacity(1, 0.4), wRow4Note().opacity(1, 0.4)),
    // r6：写块在“再写一个四十二”处飞入（P2-6：旁白点名唐人街，写落到画面第 5 行）
    at('再写一个四十二', chain(writeChip.appear([-320, -200]), writeChip.moveTo([-320, 120], 0.9))),
    at('只追加', all(wRow5().opacity(1, 0.4), wRow5Note().opacity(1, 0.4), writeChip.hide(0.3), actCounter.n(1, 0.5))),
  );

  say('写：2 个动作');
  yield* beat('a25',
    all(wCardA().opacity(1, 0.5)),
    at('更新索引', chain(upA.appear([-40, 120]), upA.moveTo([320, -75], 0.9))),
    at('两个动作', actCounter.n(2, 0.5)),
    // r4：两处写轮流点亮——文件尾的新行、路标卡上的数（修 idle：原旁白加长后静止 7.3s）
    at('追加是往文件尾写一行', wRow5().fill(T.yellow, 0.4)),
    at('更新路标是往另一处改一个数', chain(upA.node.opacity(0.4, 0.3), upA.node.opacity(1, 0.3))),
    at('合并不了', wCardA().stroke(T.yellow, 0.4)),
  );

  say('写：4 个动作');
  yield* beat('a26',
    all(wCardB().opacity(1, 0.5), wCardC().opacity(1, 0.5), writeG().scale(1.015, beat.dur('a26'))),
    at('更新三次', chain(
      upA.node.opacity(0.35, 0.3), upA.node.opacity(1, 0.3),
      upB.appear([-40, 120]), upB.moveTo([320, 75], 0.9),
      upC.appear([-40, 120]), upC.moveTo([320, 225], 0.9),
    )),
    at('四个动作', actCounter.n(4, 0.5)),
    at('很难比单纯追加更快', wRow5().fill(T.yellow, 0.4)),
    // r6：时间也从值里读出来（P2-4b）——第三张卡描黄
    at('时间也从值里读出来', wCardC().stroke(T.yellow, 0.4)),
  );

  say('没索引，扫全文件');
  yield* beat('a27',
    chain(scan().opacity(1, 0.3), scan().position([-320, 120], 2.4), scan().opacity(0, 0.3)),
    at('扫全文件', chain(wRow1().opacity(0.4, 0.15), wRow1().opacity(1, 0.15), wRow3().opacity(0.4, 0.15), wRow3().opacity(1, 0.15), wRow5().opacity(0.4, 0.15), wRow5().opacity(1, 0.15))),
  );

  say('有索引，一次跳转');
  yield* beat('a28',
    all(scan().opacity(0, 0.4), dot().opacity(1, 0.4)),
    at('直接跳过去', chain(dot().position([-80, 20], 1.0), jumpTag().opacity(1, 0.4))),
  );

  say('读快，写慢');
  yield* beat('a29a',
    all(writeG().opacity(0, 0.5), scan().opacity(0, 0.4), actCounter.node.opacity(0, 0.4), scaleG().opacity(1, 0.5)),
    at('读越快', all(panRead().stroke(T.green, 0.4), readNum().opacity(1, 0.4))),
    at('写越慢', all(panWrite().stroke(T.red, 0.4), writeNum().opacity(1, 0.4))),
  );

  say('按查询模式挑');
  yield* beat('a29b',
    // r4：整拍慢推镜头（修 idle：原旁白加长后静止 10.4s；三张卡已随“手工选”出现）
    all(scaleG().opacity(0, 0.5), pick().opacity(1, 0.5), pick().scale(1.03, beat.dur('a29b')), patCards[0]().opacity(1, 0.4), patCards[1]().opacity(1, 0.4), patCards[2]().opacity(1, 0.4)),
    at('手工选', all(pickCard().stroke(T.yellow, 0.4), patCards[0]().stroke(T.green, 0.4), patTag().opacity(1, 0.4))),
    // r6：按时间查、按地点查也一样（P2-4c）——两张卡随点名描绿
    at('按时间查', patCards[1]().stroke(T.green, 0.4)),
    at('按地点查', patCards[2]().stroke(T.green, 0.4)),
  );

  say('还有更多问题');
  yield* beat('a30a',
    all(pick().opacity(0, 0.5), issues().opacity(1, 0.5)),
    at('并发控制', issueCards[0]().opacity(1, 0.4)),
    at('回收磁盘空间', issueCards[1]().opacity(1, 0.4)),
    at('写一半的记录', issueCards[2]().opacity(1, 0.4)),
  );

  say('基本原理一样');
  yield* beat('a30b',
    all(issues().opacity(0, 0.5), logBar().opacity(1, 0.5)),
    at('基本原理一样', logBar().stroke(T.yellow, 0.4)),
    at('日志', logBar().scale(1.03, 0.5)),
    at('多次遇到', logBar().stroke(T.blue, 0.4)),
  );

  say('应用日志：描述在发生什么');
  yield* beat('a32',
    all(logBar().opacity(0, 0.4), logs().opacity(1, 0.5), appLogTitle().opacity(1, 0.4), appLogLines().opacity(1, 0.4)),
    at('应用日志', appLog().stroke(T.yellow, 0.4)),
    at('描述正在发生什么', chain(appLogLines().opacity(0.6, 0.3), appLogLines().opacity(1, 0.3))),
  );

  say('追加写序列');
  yield* beat('a33a',
    all(binLog().opacity(1, 0.5), binLogTitle().opacity(1, 0.4)),
    at('追加写的记录序列', binLogLines().opacity(1, 0.5)),
  );

  say('可二进制');
  yield* beat('a33b',
    at('二进制', all(notEq().opacity(1, 0.4), notEqTag().opacity(1, 0.4))),
  );

  say('文本行 → 二进制');
  yield* beat('a33c',
    all(logs().scale(1.02, beat.dur('a33c'))),
    at('二进制', binLog().stroke(T.yellow, 0.4)),
  );

  say('每个字、每个逗号');
  yield* beat('a33d',
    all(logs().scale(1.03, beat.dur('a33d'))),
    at('每个字', chain(binLogLines().opacity(0.6, 0.3), binLogLines().opacity(1, 0.3))),
    at('每个逗号', binLog().stroke(T.green, 0.4)),
  );

  say('追加最快，找要路标');
  yield* beat('a34',
    all(logs().opacity(0, 0.5), fin().opacity(1, 0.5), finRow1().opacity(1, 0.4), finRow2().opacity(1, 0.4)),
    at('从头扫', chain(finDot().opacity(1, 0.4), finDot().position([-500, 20], 1.0))),
    at('路标', all(finArrow().opacity(1, 0.4), finCard().stroke(T.yellow, 0.4))),
  );
});
