// U2 场景 2（MC）：b19–b34 —— Chaos Monkey、安全不可撤销、容错技术在后文、
// §1.6 普通应用也要可靠、可以清醒地走捷径、回扣、下一站。
// 分镜：skill-ch01/ch01-beats.md U2 一节；原文：DDIA §1.2（书页 p7，PDF p29）
// 与 §1.6（书页 p10，PDF p32）。时长全部来自 timeline/u2.json（beat() 驱动）。
// 颜色、字号、安全区一律取自 lib/theme，不手写十六进制色值。
import {Circle, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, chain, createRef, sequence} from '@motion-canvas/core';
import {makeBeats} from '../../lib/beats';
import {FONT, SAFE, SIZE, T} from '../../lib/theme';
import timeline from '../../timeline/u2.json';

export default makeScene2D(function* (view) {
  view.fill(T.bg);
  const beat = makeBeats(timeline);

  const anchor = createRef<Txt>();
  const g19 = createRef<Node>();
  const procs19 = [0, 1, 2, 3].map(() => createRef<Rect>());
  const sysLine19 = createRef<Rect>();
  const g20 = createRef<Node>();
  const errCode = createRef<Rect>();
  const drillBar = createRef<Rect>();
  const drillTag = createRef<Txt>();
  const g21 = createRef<Node>();
  const nodes21 = [0, 1, 2, 3, 4].map(() => createRef<Circle>());
  const monkey = createRef<Circle>();
  const g22 = createRef<Node>();
  const sysBox22 = createRef<Rect>();
  const packet = createRef<Rect>();
  const attacker = createRef<Circle>();
  const noBack = createRef<Txt>();
  const g23 = createRef<Node>();
  const shieldCard = createRef<Rect>();
  const wrenchCard = createRef<Rect>();
  const g24 = createRef<Node>();
  const tocRows = [0, 1, 2, 3].map(() => createRef<Txt>());
  const g25 = createRef<Node>();
  const plant = createRef<Rect>();
  const tower = createRef<Rect>();
  const app25 = createRef<Rect>();
  const g26 = createRef<Node>();
  const report = createRef<Rect>();
  const num26 = createRef<Txt>();
  const hours26 = createRef<Rect>();
  const g27 = createRef<Node>();
  const shop = createRef<Rect>();
  const revLine = createRef<Line>();
  const g28 = createRef<Node>();
  const photos28 = [0, 1, 2, 3, 4, 5].map(() => createRef<Rect>());
  const g29 = createRef<Node>();
  const scaleNode = createRef<Node>();
  const beam = createRef<Rect>();
  const panL = createRef<Rect>();
  const panR = createRef<Rect>();
  const costTag = createRef<Txt>();
  const relTag = createRef<Txt>();
  const thinTag = createRef<Txt>();
  const g31 = createRef<Node>();
  const sign = createRef<Rect>();
  const g32 = createRef<Node>();
  const sysBox32 = createRef<Rect>();
  const shield32 = createRef<Rect>();
  const specTag = createRef<Txt>();
  const g33 = createRef<Node>();
  const g34 = createRef<Node>();
  const doors = [0, 1, 2].map(() => createRef<Rect>());

  const say = (text: string) => anchor().text(text);

  view.add(
    <>
      <Txt
        position={[-SAFE.halfW, -SAFE.halfH]}
        offset={[-1, -1]}
        fontSize={SIZE.label}
        fill={T.muted}
        fontFamily={FONT.sans}
        text={'第 1 章 · 可靠是什么意思'}
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

      {/* b19：随机杀进程，系统抖一下又稳住 */}
      <Node ref={g19} opacity={0}>
        {[0, 1, 2, 3].map(i => (
          <Rect
            key={`u2-proc-${i}`}
            ref={procs19[i]}
            position={[-360 + i * 240, -60]}
            width={160}
            height={110}
            radius={12}
            fill={T.card}
            stroke={T.green}
            lineWidth={2}
          >
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={`进程 ${i + 1}`} />
          </Rect>
        ))}
        <Rect ref={sysLine19} position={[0, 120]} width={920} height={20} radius={10} fill={T.green} />
        <Txt position={[0, 170]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'服务照常运转'} />
      </Node>

      {/* b20：错误处理标红，演练计数上涨 */}
      <Node ref={g20} opacity={0}>
        <Rect ref={errCode} position={[0, -120]} width={760} height={120} radius={12} fill={T.card} stroke={T.line} lineWidth={2}>
          <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'错误处理代码'} />
        </Rect>
        <Txt position={[0, -20]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'演练次数'} />
        <Rect position={[0, 50]} width={760} height={26} radius={13} fill={T.card} stroke={T.line} lineWidth={2} />
        <Rect ref={drillBar} position={[-380, 50]} offset={[-1, 0]} width={0} height={26} radius={13} fill={T.green} />
        <Txt ref={drillTag} position={[0, 110]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} opacity={0} text={'平时多练，真出事才顶得住'} />
      </Node>

      {/* b21：Chaos Monkey 随机打掉节点 */}
      <Node ref={g21} opacity={0}>
        {[0, 1, 2, 3, 4].map(i => (
          <Circle
            key={`u2-node21-${i}`}
            ref={nodes21[i]}
            position={[-400 + i * 200, -60]}
            width={110}
            height={110}
            fill={T.card}
            stroke={T.green}
            lineWidth={3}
          />
        ))}
        <Circle ref={monkey} position={[-400, -200]} width={80} height={80} fill={T.purple}>
          <Txt fontSize={SIZE.label} fill={T.white} fontFamily={FONT.sans} text={'猴'} />
        </Circle>
        <Txt position={[0, 120]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'Chaos Monkey'} />
        <Txt position={[0, 180]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'系统反而更经得起折腾'} />
      </Node>

      {/* b22：数据泄露出去，收不回来 */}
      <Node ref={g22} opacity={0}>
        <Rect ref={sysBox22} position={[-320, -40]} width={320} height={180} radius={16} fill={T.card} stroke={T.blue} lineWidth={3}>
          <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'系统'} />
        </Rect>
        <Rect ref={packet} position={[-320, -40]} width={130} height={70} radius={10} fill={T.blue}>
          <Txt fontSize={SIZE.label} fill={T.white} fontFamily={FONT.sans} text={'敏感数据'} />
        </Rect>
        <Circle ref={attacker} position={[380, -40]} width={150} height={150} fill={T.card} stroke={T.red} lineWidth={3} />
        <Txt position={[380, -40]} fontSize={SIZE.label} fill={T.red} fontFamily={FONT.sans} text={'攻击者'} />
        <Txt
          ref={noBack}
          position={[0, 160]}
          fontSize={SIZE.body}
          fill={T.red}
          fontFamily={FONT.sans}
          opacity={0}
          text={'泄露了，收不回来 ✕'}
        />
      </Node>

      {/* b23：防范（盾牌）与补救（扳手），盾牌亮起 */}
      <Node ref={g23} opacity={0}>
        <Rect ref={shieldCard} position={[-280, -40]} width={400} height={180} radius={16} fill={T.card} stroke={T.line} lineWidth={2}>
          <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'防范（盾牌）'} />
        </Rect>
        <Rect ref={wrenchCard} position={[280, -40]} width={400} height={180} radius={16} fill={T.card} stroke={T.line} lineWidth={2}>
          <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'补救（扳手）'} />
        </Rect>
      </Node>

      {/* b24：目录翻过，容错技术章节依次亮起 */}
      <Node ref={g24} opacity={0}>
        <Txt position={[0, -230]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'后面：容错技术'} />
        {['第 5 章  复制', '第 6 章  分区', '第 7 章  事务', '第 9 章  一致性与共识'].map((t, i) => (
          <Txt
            key={`u2-toc-${i}`}
            ref={tocRows[i]}
            position={[0, -150 + i * 80]}
            fontSize={SIZE.body}
            fill={T.muted}
            fontFamily={FONT.sans}
            opacity={0}
            text={t}
          />
        ))}
      </Node>

      {/* b25：核电站、空管塔淡出，普通 App 亮起 */}
      <Node ref={g25} opacity={0}>
        <Rect ref={plant} position={[-320, -40]} width={360} height={180} radius={16} fill={T.card} stroke={T.line} lineWidth={2}>
          <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'核电站'} />
        </Rect>
        <Rect ref={tower} position={[80, -40]} width={360} height={180} radius={16} fill={T.card} stroke={T.line} lineWidth={2}>
          <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'空管塔'} />
        </Rect>
        <Rect
          ref={app25}
          position={[0, 140]}
          width={520}
          height={110}
          radius={16}
          fill={T.card}
          stroke={T.green}
          lineWidth={3}
          opacity={0}
        >
          <Txt fontSize={SIZE.body} fill={T.green} fontFamily={FONT.sans} text={'普通 App 也要可靠'} />
        </Rect>
      </Node>

      {/* b26：报表数字标红，工时白白流掉 */}
      <Node ref={g26} opacity={0}>
        <Rect ref={report} position={[0, -100]} width={760} height={160} radius={16} fill={T.card} stroke={T.line} lineWidth={2}>
          <Txt position={[0, -40]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'业务报表'} />
          <Txt ref={num26} position={[0, 30]} fontSize={SIZE.title} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'12345'} />
        </Rect>
        <Txt position={[0, 40]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'工时'} />
        <Rect position={[0, 110]} width={760} height={26} radius={13} fill={T.card} stroke={T.line} lineWidth={2} />
        <Rect ref={hours26} position={[-380, 110]} offset={[-1, 0]} width={760} height={26} radius={13} fill={T.blue} />
      </Node>

      {/* b27：电商页面挂掉，收入曲线下跌 */}
      <Node ref={g27} opacity={0}>
        <Rect ref={shop} position={[-280, -40]} width={360} height={200} radius={16} fill={T.card} stroke={T.line} lineWidth={2}>
          <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'电商网站'} />
        </Rect>
        <Line
          ref={revLine}
          points={[
            [80, -140],
            [200, -130],
            [320, -60],
            [440, 20],
            [540, 100],
          ]}
          stroke={T.red}
          lineWidth={5}
        />
        <Txt position={[320, 170]} fontSize={SIZE.label} fill={T.red} fontFamily={FONT.sans} text={'收入下跌 · 声誉受损'} />
      </Node>

      {/* b28：相册照片重新一张张亮起，又暗下去 */}
      <Node ref={g28} opacity={0}>
        <Txt position={[0, -240]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'父母的相册'} />
        {[
          {x: -380, y: -90},
          {x: -130, y: -90},
          {x: 120, y: -90},
          {x: 370, y: -90},
          {x: -255, y: 90},
          {x: 5, y: 90},
        ].map((p, i) => (
          <Rect
            key={`u2-photo28-${i}`}
            ref={photos28[i]}
            position={[p.x, p.y]}
            width={220}
            height={150}
            radius={12}
            fill={T.blue}
            stroke={T.line}
            lineWidth={2}
            opacity={0.12}
          />
        ))}
      </Node>

      {/* b29/b30：天平——原型开发成本 vs 可靠性，再加“利润极薄的服务”。
          r2：横梁、吊绳、托盘装进一个 Node，整杆绕支点旋转（左沉右升），修 P2 1-9 的“横梁水平、托盘悬空”。 */}
      <Node ref={g29} opacity={0}>
        <Rect position={[0, -160]} width={20} height={120} radius={8} fill={T.line} />
        <Node ref={scaleNode} position={[0, -100]}>
          <Rect ref={beam} position={[0, 0]} width={900} height={16} radius={8} fill={T.text} />
          <Rect position={[-380, 35]} width={10} height={70} radius={5} fill={T.line} />
          <Rect position={[380, 35]} width={10} height={70} radius={5} fill={T.line} />
          <Rect ref={panL} position={[-380, 120]} width={300} height={100} radius={12} fill={T.card} stroke={T.yellow} lineWidth={2}>
            <Txt ref={costTag} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'原型开发成本'} />
          </Rect>
          <Rect ref={panR} position={[380, 120]} width={300} height={100} radius={12} fill={T.card} stroke={T.green} lineWidth={2}>
            <Txt ref={relTag} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'可靠性'} />
          </Rect>
          <Txt ref={thinTag} position={[-380, 230]} fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.sans} opacity={0} text={'利润极薄的服务'} />
        </Node>
      </Node>

      {/* b31：捷径路牌 */}
      <Node ref={g31} opacity={0}>
        <Rect ref={sign} position={[0, -40]} width={560} height={170} radius={16} fill={T.card} stroke={T.yellow} lineWidth={3}>
          <Txt fontSize={SIZE.title} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'捷径'} />
        </Rect>
        <Txt position={[0, 100]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'清醒地走'} />
      </Node>

      {/* b32：回扣——系统 + 容错机制，补上“特定类型” */}
      <Node ref={g32} opacity={0}>
        <Rect ref={sysBox32} position={[-80, -40]} width={300} height={160} radius={16} fill={T.card} stroke={T.green} lineWidth={3}>
          <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'系统'} />
        </Rect>
        <Rect ref={shield32} position={[180, -40]} width={200} height={160} radius={16} fill={T.card} stroke={T.green} lineWidth={2}>
          <Txt fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} text={'容错机制'} />
        </Rect>
        <Txt
          ref={specTag}
          position={[0, 140]}
          fontSize={SIZE.body}
          fill={T.yellow}
          fontFamily={FONT.sans}
          opacity={0}
          text={'对特定类型的故障'}
        />
      </Node>

      {/* b33：故障清单空白，留一个问号 */}
      <Node ref={g33} opacity={0}>
        {[0, 1, 2].map(i => (
          <Rect
            key={`u2-blank-${i}`}
            position={[0, -140 + i * 110]}
            width={620}
            height={70}
            radius={12}
            fill={T.card}
            stroke={T.line}
            lineWidth={2}
          />
        ))}
        <Txt position={[400, -40]} fontSize={96} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'?'} />
      </Node>

      {/* b34：三扇门——硬件 / 软件 / 人 */}
      <Node ref={g34} opacity={0}>
        {['硬件', '软件', '人'].map((t, i) => (
          <Rect
            key={`u2-door-${i}`}
            ref={doors[i]}
            position={[-360 + i * 360, -40]}
            width={260}
            height={300}
            radius={16}
            fill={T.card}
            stroke={T.blue}
            lineWidth={3}
            opacity={0}
          >
            <Txt fontSize={SIZE.title} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={t} />
          </Rect>
        ))}
      </Node>
    </>,
  );

  // b19：一个进程被随机点掉，系统抖一下又稳住（6.06s；r2：杀进程放慢 + 服务绿线缓慢闪烁；
  // r3：改 chain 真串行，修 P1 1-1 的 5.00s 尾部静止）
  say('随机杀进程');
  yield* beat(
    'b19',
    chain(
      all(g19().opacity(1, 0.5)),
      all(procs19[2]().fill(T.red, 1), procs19[2]().opacity(0.25, 1)),
      chain(sysLine19().opacity(0.4, 0.6), sysLine19().opacity(1, 1)),
      sysLine19().opacity(0.6, 1.2),
    ),
  );

  // b20：错误处理代码处标红，演练次数计数器上涨（6.95s）
  say('bug 是没处理好错误');
  yield* beat(
    'b20',
    sequence(
      0,
      all(g19().opacity(0, 0.5), g20().opacity(1, 0.5)),
      errCode().stroke(T.red, 1),
      all(drillBar().width(760, 3), drillTag().opacity(1, 1)),
    ),
  );

  // b21：猴子随机打掉节点，系统照常运转（7.12s：猴子跳四处，两个节点变红后其余仍绿；
  // r2：补一次慢跳 + 节点轻闪；r3：改 chain 真串行，修 P1 1-1 的 5.07s 尾部静止）
  say('Chaos Monkey');
  yield* beat(
    'b21',
    chain(
      all(g20().opacity(0, 0.5), g21().opacity(1, 0.5)),
      all(monkey().position([0, -200], 1), nodes21[1]().stroke(T.red, 0.5)),
      all(monkey().position([400, -200], 1), nodes21[4]().stroke(T.red, 0.5)),
      all(monkey().position([-200, -200], 1.5), nodes21[0]().stroke(T.yellow, 1)),
      nodes21[0]().stroke(T.green, 1),
    ),
  );

  // b22：数据泄露出去，收不回来，打叉（7.62s；r2：红字缓慢脉动收尾；r3：改 chain 真串行，修 P1 1-1 的 4.69s 尾部静止）
  say('泄露了收不回来');
  yield* beat(
    'b22',
    chain(
      all(g21().opacity(0, 0.5), g22().opacity(1, 0.5)),
      packet().position([380, -40], 2.5),
      all(packet().opacity(0.2, 0.8), noBack().opacity(1, 0.8)),
      noBack().scale(1.06, 1.8),
    ),
  );

  // b23：盾牌与扳手并排，盾牌亮起（7.91s；r2：辉光与缩放拉长 + 缓慢呼吸；r3：改 chain 真串行，修 P1 1-1 的 5.10s 尾部静止；r3 补：旁白重录后 b23 只剩 5.80s，chain 6.2s 会顺延，改短三段至 5.0s）
  say('防范优于补救');
  yield* beat(
    'b23',
    chain(
      all(g22().opacity(0, 0.5), g23().opacity(1, 0.5)),
      all(shieldCard().stroke(T.green, 1.8), shieldCard().scale(1.05, 1.8)),
      wrenchCard().opacity(0.45, 1.2),
      shieldCard().scale(1.08, 1.5),
    ),
  );

  // b24：书的目录翻过，容错技术章节依次亮起（5.15s）
  say('后面一章一章讲');
  yield* beat(
    'b24',
    sequence(
      0.3,
      all(g23().opacity(0, 0.5), g24().opacity(1, 0.5)),
      ...[0, 1, 2, 3].map(i => tocRows[i]().opacity(1, 0.4)),
    ),
  );

  // b25：核电站、空管塔淡出，普通 App 亮起（5.87s）
  say('不只核电站才要可靠');
  yield* beat(
    'b25',
    sequence(
      0,
      all(g24().opacity(0, 0.5), g25().opacity(1, 0.5)),
      all(plant().opacity(0.25, 1.5), tower().opacity(0.25, 1.5)),
      app25().opacity(1, 1),
    ),
  );

  // b26：报表数字标红，工时白白流掉（6.42s）
  say('bug 让白干活、惹官司');
  yield* beat(
    'b26',
    sequence(
      0,
      all(g25().opacity(0, 0.5), g26().opacity(1, 0.5)),
      all(num26().fill(T.red, 1), hours26().width(60, 3)),
    ),
  );

  // b27：电商页面挂掉，收入曲线下跌（4.67s）
  say('宕机丢收入、损声誉');
  yield* beat(
    'b27',
    sequence(
      0,
      all(g26().opacity(0, 0.5), g27().opacity(1, 0.5)),
      all(shop().opacity(0.35, 1.5), shop().stroke(T.red, 1.5)),
      revLine().opacity(1, 0.5),
    ),
  );

  // b28：相册照片重新一张张亮起，又暗下去（6.42s）
  say('照片是全部记忆');
  yield* beat(
    'b28',
    sequence(
      0.4,
      all(g27().opacity(0, 0.5), g28().opacity(1, 0.5)),
      ...[0, 1, 2, 3, 4, 5].map(i => photos28[i]().opacity(0.9, 0.4)),
      ...[0, 1, 2, 3, 4, 5].map(i => photos28[i]().opacity(0.12, 0.4)),
    ),
  );

  // b29：天平一边是原型开发成本，一边是可靠性（8.20s；r2：整杆绕支点缓慢倾斜，左沉右升；
  // r3：改 chain 真串行，修 P1 1-1 的 3.40s 尾部静止；
  // r4：rotation 单位是度（-0.08 rad = -4.6°），修 P2 1-9 天平始终水平）
  say('原型可以少要可靠');
  yield* beat(
    'b29',
    chain(
      all(g28().opacity(0, 0.5), g29().opacity(1, 0.5)),
      scaleNode().rotation(-4.6, 5),
    ),
  );

  // b30：天平另一边加上“利润极薄的服务”（6.28s；r2：标签出现，杆再倾一点；
  // r4：rotation 单位是度（-0.13 rad = -7.4°），修 P2 1-9 天平始终水平）
  say('利润薄也可以');
  yield* beat('b30', all(thinTag().opacity(1, 1), scaleNode().rotation(-7.4, 3.5)));

  // b31：捷径路牌亮起（4.36s）
  say('清醒地走捷径');
  yield* beat('b31', all(g29().opacity(0, 0.5), g31().opacity(1, 0.8), sign().scale(1.06, 1.5)));

  // b32：回扣——系统 + 容错机制，补上“特定类型”（7.72s；r2：辉光拉长 + 机制卡缓慢呼吸；
  // r3：改 chain 真串行，修 P1 1-1 的 5.25s 尾部静止）
  say('出错还能正确工作');
  yield* beat(
    'b32',
    chain(
      all(g31().opacity(0, 0.5), g32().opacity(1, 0.6)),
      all(shield32().scale(1.06, 2.2), sysBox32().stroke(T.green, 2.2)),
      specTag().opacity(1, 1.2),
      shield32().scale(1.1, 2),
    ),
  );

  // b33：故障清单空白，留一个问号（5.87s）
  say('你最怕哪种故障');
  yield* beat('b33', all(g32().opacity(0, 0.5), g33().opacity(1, 0.8)));

  // b34：三扇门出现：硬件 / 软件 / 人（6.47s）
  say('下一站：故障从哪来');
  yield* beat(
    'b34',
    sequence(
      0.4,
      all(g33().opacity(0, 0.5), g34().opacity(1, 0.5)),
      ...[0, 1, 2].map(i => doors[i]().opacity(1, 0.6)),
    ),
  );
});
