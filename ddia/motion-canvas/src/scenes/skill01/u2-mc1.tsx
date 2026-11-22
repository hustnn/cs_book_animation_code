// U2 场景 1（MC）：b1–b18 —— 钩子（照片）、用户四条期望、可靠定义、
// fault vs failure、容错机制挡住故障、不可靠部件搭出可靠系统。
// 分镜：skill-ch01/ch01-beats.md U2 一节；原文：DDIA §1.2（书页 p6–7，PDF p28–29）
// 与 §1.6（书页 p10，PDF p32）。时长全部来自 timeline/u2.json（beat() 驱动），不手写 waitFor。
// 颜色、字号、安全区一律取自 lib/theme，不手写十六进制色值。
// b2 拆拍说明：原文 b2 旁白三次合成均在 ~0.8s 处截断（中部 9.63s 静音），
// 改写法后拆成 b2a/b2b（见 beats-u2.json 与 audio/u2/synth.log）。
import {Circle, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, chain, createRef, sequence} from '@motion-canvas/core';
import {makeBeats} from '../../lib/beats';
import {FONT, SAFE, SIZE, T} from '../../lib/theme';
import timeline from '../../timeline/u2.json';

export default makeScene2D(function* (view) {
  view.fill(T.bg);
  const beat = makeBeats(timeline);

  const anchor = createRef<Txt>();
  const g1 = createRef<Node>();
  const photos = [0, 1, 2, 3, 4, 5].map(() => createRef<Rect>());
  const dbBad = createRef<Txt>();
  const g2 = createRef<Node>();
  const bigQ = createRef<Txt>();
  const g3 = createRef<Node>();
  const cards = [0, 1, 2, 3].map(() => createRef<Rect>());
  const cardNum = [0, 1, 2, 3].map(() => createRef<Txt>());
  const cardTxt = [0, 1, 2, 3].map(() => createRef<Txt>());
  const g8 = createRef<Node>();
  const sysBox = createRef<Rect>();
  const faultDot = createRef<Circle>();
  const outOk = createRef<Txt>();
  const g9 = createRef<Node>();
  const termA = createRef<Rect>();
  const termB = createRef<Rect>();
  const g10 = createRef<Node>();
  const allFaultTxt = createRef<Txt>();
  const strike = createRef<Line>();
  const g11 = createRef<Node>();
  const earth = createRef<Circle>();
  const earthLabel = createRef<Txt>();
  const hole = createRef<Circle>();
  const priceTag = createRef<Txt>();
  const g12 = createRef<Node>();
  const checkRows = [0, 1, 2, 3].map(() => createRef<Txt>());
  const g13 = createRef<Node>();
  const faultCard = createRef<Rect>();
  const failureCard = createRef<Rect>();
  const g14 = createRef<Node>();
  const part = createRef<Rect>();
  const g15 = createRef<Node>();
  const machine = createRef<Rect>();
  const userDot = createRef<Circle>();
  const noService = createRef<Txt>();
  const g16 = createRef<Node>();
  const dots16 = [0, 1, 2].map(() => createRef<Circle>());
  const barrier = createRef<Rect>();
  const gate = createRef<Txt>();
  const g17 = createRef<Node>();
  const dot17 = createRef<Circle>();
  const layers17 = [0, 1, 2].map(() => createRef<Rect>());
  const g18 = createRef<Node>();
  const parts18 = [0, 1, 2, 3].map(() => createRef<Rect>());
  const machine18 = createRef<Rect>();

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

      {/* b1/b2：父母的相册，六张照片 */}
      <Node ref={g1} opacity={0}>
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
            key={`u2-photo-${i}`}
            ref={photos[i]}
            position={[p.x, p.y]}
            width={220}
            height={150}
            radius={12}
            fill={T.blue}
            stroke={T.line}
            lineWidth={2}
          />
        ))}
        <Txt
          ref={dbBad}
          position={[255, 90]}
          fontSize={SIZE.body}
          fill={T.red}
          fontFamily={FONT.sans}
          opacity={0}
          text={'数据库坏了'}
        />
      </Node>

      {/* b2a/b2b：问号升起 */}
      <Node ref={g2} opacity={0}>
        <Txt
          ref={bigQ}
          position={[0, -40]}
          fontSize={120}
          fontWeight={700}
          fill={T.yellow}
          fontFamily={FONT.sans}
          opacity={0}
          text={'?'}
        />
      </Node>

      {/* b3–b8：四张期望卡 */}
      <Node ref={g3} opacity={0}>
        {[
          {x: -435, label: '1'},
          {x: -145, label: '2'},
          {x: 145, label: '3'},
          {x: 435, label: '4'},
        ].map((c, i) => (
          <Rect
            key={`u2-card-${i}`}
            ref={cards[i]}
            position={[c.x, -40]}
            width={260}
            height={170}
            radius={16}
            fill={T.card}
            stroke={T.line}
            lineWidth={2}
          >
            <Txt ref={cardNum[i]} position={[0, -50]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={c.label} />
            <Txt
              ref={cardTxt[i]}
              position={[0, 20]}
              fontSize={SIZE.label}
              fill={T.text}
              fontFamily={FONT.sans}
              opacity={0}
              text={['完成功能', '容忍犯错', '性能够好', '防滥用'][i]}
            />
          </Rect>
        ))}
      </Node>

      {/* b8：系统挨一击，输出仍正确 */}
      <Node ref={g8} opacity={0}>
        <Rect
          ref={sysBox}
          position={[-80, -40]}
          width={300}
          height={160}
          radius={16}
          fill={T.card}
          stroke={T.blue}
          lineWidth={3}
        >
          <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'系统'} />
        </Rect>
        <Circle ref={faultDot} position={[-480, -40]} width={40} height={40} fill={T.red} />
        <Txt position={[-480, 20]} fontSize={SIZE.label} fill={T.red} fontFamily={FONT.sans} text={'故障'} />
        <Txt
          ref={outOk}
          position={[280, -40]}
          fontSize={SIZE.body}
          fill={T.green}
          fontFamily={FONT.sans}
          opacity={0}
          text={'✓ 正确输出'}
        />
      </Node>

      {/* b9：术语卡 fault-tolerant / resilient */}
      <Node ref={g9} opacity={0}>
        <Rect ref={termA} position={[0, -80]} width={760} height={110} radius={16} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'fault-tolerant  容错'} />
        </Rect>
        <Rect ref={termB} position={[0, 60]} width={760} height={110} radius={16} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'resilient  有韧性'} />
        </Rect>
      </Node>

      {/* b10：“容忍一切故障”被打问号 */}
      <Node ref={g10} opacity={0}>
        <Txt
          ref={allFaultTxt}
          position={[0, -40]}
          fontSize={SIZE.title}
          fontWeight={700}
          fill={T.white}
          fontFamily={FONT.serif}
          text={'容忍一切故障'}
        />
        <Line ref={strike} points={[[-260, -40], [260, -40]]} stroke={T.red} lineWidth={6} opacity={0} />
        <Txt position={[330, -40]} fontSize={64} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'?'} />
      </Node>

      {/* b11：黑洞吞掉地球，太空托管标价 */}
      <Node ref={g11} opacity={0}>
        <Circle ref={earth} position={[-260, -40]} width={180} height={180} fill={T.blue} />
        <Txt ref={earthLabel} position={[-260, -40]} fontSize={SIZE.label} fill={T.white} fontFamily={FONT.sans} text={'地球'} />
        <Circle ref={hole} position={[200, -40]} width={60} height={60} fill={T.card} stroke={T.purple} lineWidth={4} />
        <Txt position={[200, -40]} fontSize={SIZE.label} fill={T.purple} fontFamily={FONT.sans} text={'黑洞'} />
        <Txt
          ref={priceTag}
          position={[0, 160]}
          fontSize={SIZE.body}
          fill={T.yellow}
          fontFamily={FONT.sans}
          opacity={0}
          text={'太空托管：预算批不下来'}
        />
      </Node>

      {/* b12：故障清单，只勾选其中几类 */}
      <Node ref={g12} opacity={0}>
        <Txt position={[0, -220]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'能容忍的故障类型'} />
        {['硬盘坏了  ✓', '软件 bug  ✓', '人为错误  ✓', '黑洞吞地球  ✗'].map((t, i) => (
          <Txt
            key={`u2-check-${i}`}
            ref={checkRows[i]}
            position={[0, -140 + i * 80]}
            fontSize={SIZE.body}
            fill={i < 3 ? T.green : T.red}
            fontFamily={FONT.sans}
            opacity={0}
            text={t}
          />
        ))}
      </Node>

      {/* b13：fault 与 failure 两张卡分开 */}
      <Node ref={g13} opacity={0}>
        <Rect
          ref={faultCard}
          position={[0, -40]}
          width={420}
          height={140}
          radius={16}
          fill={T.card}
          stroke={T.yellow}
          lineWidth={2}
        >
          <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'fault  故障'} />
        </Rect>
        <Rect
          ref={failureCard}
          position={[0, -40]}
          width={420}
          height={140}
          radius={16}
          fill={T.card}
          stroke={T.red}
          lineWidth={2}
        >
          <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'failure  失效'} />
        </Rect>
      </Node>

      {/* b14：一个零件变红偏离轨道 */}
      <Node ref={g14} opacity={0}>
        <Line points={[[-500, -40], [500, -40]]} stroke={T.line} lineWidth={3} />
        {[0, 2, 3].map(i => (
          <Rect
            key={`u2-part-${i}`}
            position={[-360 + i * 240, -40]}
            width={90}
            height={90}
            radius={12}
            fill={T.card}
            stroke={T.line}
            lineWidth={2}
          />
        ))}
        <Rect
          ref={part}
          position={[-120, -40]}
          width={90}
          height={90}
          radius={12}
          fill={T.blue}
          stroke={T.line}
          lineWidth={2}
        />
        <Txt position={[-120, 60]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'一个零件偏离 spec'} />
      </Node>

      {/* b15：整台机器停摆，用户收不到服务 */}
      <Node ref={g15} opacity={0}>
        <Rect
          ref={machine}
          position={[-160, -40]}
          width={420}
          height={220}
          radius={16}
          fill={T.card}
          stroke={T.line}
          lineWidth={3}
        >
          <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'整个系统'} />
        </Rect>
        <Circle ref={userDot} position={[380, -100]} width={90} height={90} fill={T.card} stroke={T.blue} lineWidth={3} />
        <Txt position={[380, -100]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'用户'} />
        <Txt
          ref={noService}
          position={[380, 40]}
          fontSize={SIZE.label}
          fill={T.red}
          fontFamily={FONT.sans}
          opacity={0}
          text={'收不到服务'}
        />
      </Node>

      {/* b16：故障小点被容错机制挡在失效大门外 */}
      <Node ref={g16} opacity={0}>
        {[0, 1, 2].map(i => (
          <Circle
            key={`u2-dot16-${i}`}
            ref={dots16[i]}
            position={[-500, -140 + i * 100]}
            width={36}
            height={36}
            fill={T.red}
          />
        ))}
        <Rect ref={barrier} position={[-40, -40]} width={36} height={360} radius={10} fill={T.green} opacity={0.9} />
        <Txt position={[-40, -230]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} text={'容错机制'} />
        <Txt ref={gate} position={[330, -40]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'失效大门：关着'} />
      </Node>

      {/* b17：故障小点穿过层层机制，每过一层小一圈 */}
      <Node ref={g17} opacity={0}>
        {[0, 1, 2].map(i => (
          <Rect
            key={`u2-layer-${i}`}
            ref={layers17[i]}
            position={[-240 + i * 240, -40]}
            width={24}
            height={300}
            radius={8}
            fill={T.green}
            opacity={0.85}
          />
        ))}
        <Circle ref={dot17} position={[-520, -40]} width={64} height={64} fill={T.red} />
        <Txt position={[0, -230]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'每过一层，小一圈'} />
      </Node>

      {/* b18：不可靠的小零件拼成可靠的机器 */}
      <Node ref={g18} opacity={0}>
        {[0, 1, 2, 3].map(i => (
          <Rect
            key={`u2-part18-${i}`}
            ref={parts18[i]}
            position={[-420 + i * 180, 140]}
            width={120}
            height={80}
            radius={12}
            fill={T.card}
            stroke={T.red}
            lineWidth={2}
          >
            <Txt fontSize={SIZE.label} fill={T.red} fontFamily={FONT.sans} text={'不可靠'} />
          </Rect>
        ))}
        <Rect
          ref={machine18}
          position={[0, -80]}
          width={520}
          height={200}
          radius={16}
          fill={T.card}
          stroke={T.green}
          lineWidth={3}
          opacity={0}
        >
          <Txt fontSize={SIZE.body} fill={T.green} fontFamily={FONT.sans} text={'可靠的系统'} />
        </Rect>
      </Node>
    </>,
  );

  // b1：相册照片一张张消失（7.55s：六张依次变暗 + “数据库坏了”出现）
  say('照片全没了怎么办');
  yield* beat(
    'b1',
    sequence(
      0.5,
      all(g1().opacity(1, 0.6)),
      ...[0, 1, 2, 3, 4, 5].map(i => photos[i]().opacity(0.12, 0.5)),
      dbBad().opacity(1, 0.6),
    ),
  );

  // b2a：回到相册，问号升起（3.11s）；r2：顺手把“数据库坏了”红字淡出（P2 1-11）
  say('什么叫可靠');
  yield* beat('b2a', all(g1().opacity(0, 0.4), dbBad().opacity(0, 0.4), g2().opacity(1, 0.5), bigQ().opacity(1, 0.8)));

  // b2b：问号放大，照片重新亮起一角（4.62s）
  say('什么叫可靠');
  yield* beat(
    'b2b',
    all(
      bigQ().scale(1.25, 2),
      g1().opacity(0.35, 1.5),
      photos[0]().opacity(0.9, 1.5),
      photos[1]().opacity(0.9, 1.5),
    ),
  );

  // b3：四张期望卡空白待填，卡号 1–4 依次亮起（5.92s；r2：卡号错开亮起；r3：sequence 只错开起跑时间、
  // 任务并行跑，改 chain 真串行，修 P1 1-1 的 5.10s 尾部静止）
  say('用户的四条期望');
  yield* beat(
    'b3',
    chain(
      all(g1().opacity(0, 0.5), g2().opacity(0, 0.5), g3().opacity(1, 0.6)),
      cardNum[0]().fill(T.yellow, 0.7),
      cardNum[1]().fill(T.yellow, 0.7),
      cardNum[2]().fill(T.yellow, 0.7),
      cardNum[3]().fill(T.yellow, 0.7),
    ),
  );

  // b4：第一张卡亮起（3.64s）
  say('功能符合预期');
  yield* beat('b4', all(cards[0]().stroke(T.green, 0.8), cardTxt[0]().opacity(1, 0.8)));

  // b5：第二张卡亮起（4.02s）
  say('容忍用户犯错');
  yield* beat('b5', all(cards[1]().stroke(T.green, 0.8), cardTxt[1]().opacity(1, 0.8)));

  // b6：第三张卡亮起（5.10s）
  say('预期负载下够快');
  yield* beat('b6', all(cards[2]().stroke(T.green, 0.8), cardTxt[2]().opacity(1, 0.8)));

  // b7：第四张卡亮起（3.18s）
  say('防未授权访问');
  yield* beat('b7', all(cards[3]().stroke(T.green, 0.8), cardTxt[3]().opacity(1, 0.8)));

  // b8：四张卡合进一句话，系统挨一击，输出仍正确（6.42s）
  say('出错还能正确工作');
  yield* beat(
    'b8',
    sequence(
      0,
      all(g3().opacity(0, 0.5), g8().opacity(1, 0.5)),
      faultDot().position([0, -40], 1.2),
      sysBox().stroke(T.red, 0.4),
      sysBox().stroke(T.green, 0.8),
      outOk().opacity(1, 0.8),
    ),
  );

  // b9：术语卡 fault-tolerant / resilient（8.15s；r2：两张卡错开淡入 + 轻微呼吸；
  // r3：改 chain 真串行，修 P1 1-1 的 6.12s 尾部静止）
  say('容错 · 有韧性');
  yield* beat(
    'b9',
    chain(
      all(g8().opacity(0, 0.5), g9().opacity(1, 0.5)),
      termA().opacity(1, 2.2),
      termB().opacity(1, 2.2),
      all(termA().scale(1.03, 1.8), termB().scale(1.03, 1.8)),
    ),
  );

  // b10：“容忍一切故障”出现，又被打问号（4.91s）
  say('什么都能容忍？');
  yield* beat(
    'b10',
    sequence(
      0,
      all(g9().opacity(0, 0.5), g10().opacity(1, 0.5)),
      all(strike().opacity(1, 0.8), allFaultTxt().opacity(0.5, 0.8)),
    ),
  );

  // b11：黑洞吞掉地球，太空托管标价（9.54s：地球缓慢缩进黑洞，黑洞缓慢长大，标价出现；
  // r2：地球 3s→4s、黑洞 2s→3s 拉长；r3：改 chain 真串行，修 P1 1-1 的 6.07s 尾部静止）
  say('黑洞来了怎么办');
  yield* beat(
    'b11',
    chain(
      all(g10().opacity(0, 0.5), g11().opacity(1, 0.5)),
      all(earth().position([200, -40], 4), earth().width(40, 4), earth().height(40, 4), earthLabel().position([200, -40], 4), earthLabel().opacity(0, 4)),
      all(hole().width(260, 3), hole().height(260, 3)),
      priceTag().opacity(1, 0.8),
    ),
  );

  // b12：故障清单上只勾选其中几类（3.88s）
  say('只容忍特定类型');
  yield* beat(
    'b12',
    sequence(
      0.3,
      all(g11().opacity(0, 0.5), g12().opacity(1, 0.5)),
      ...[0, 1, 2, 3].map(i => checkRows[i]().opacity(1, 0.4)),
    ),
  );

  // b13：fault 与 failure 两张卡分开（6.59s）
  say('故障 ≠ 失效');
  yield* beat(
    'b13',
    all(
      g12().opacity(0, 0.5),
      g13().opacity(1, 0.6),
      faultCard().position([-300, -40], 2.5),
      failureCard().position([300, -40], 2.5),
    ),
  );

  // b14：一个零件变红偏离轨道（4.31s）
  say('一个零件偏离 spec');
  yield* beat(
    'b14',
    sequence(
      0,
      all(g13().opacity(0, 0.5), g14().opacity(1, 0.5)),
      all(part().fill(T.red, 0.8), part().position([-120, -140], 1.5)),
    ),
  );

  // b15：整台机器停摆，用户收不到服务（4.12s）
  say('整个系统停了服务');
  yield* beat(
    'b15',
    all(
      g14().opacity(0, 0.5),
      g15().opacity(1, 0.6),
      machine().opacity(0.4, 1.5),
      noService().opacity(1, 1),
    ),
  );

  // b16：故障小点飞来，被容错机制挡在失效大门外（6.28s）
  say('别让故障变失效');
  yield* beat(
    'b16',
    sequence(
      0,
      all(g15().opacity(0, 0.5), g16().opacity(1, 0.5)),
      ...[0, 1, 2].map(i => dots16[i]().position([-120, -140 + i * 100], 1.2)),
      all(dots16[0]().opacity(0.2, 0.6), dots16[1]().opacity(0.2, 0.6), dots16[2]().opacity(0.2, 0.6)),
    ),
  );

  // b17：故障小点穿过层层机制，每过一层小一圈（4.36s）
  say('机制层层挡住故障');
  yield* beat(
    'b17',
    sequence(
      0,
      all(g16().opacity(0, 0.5), g17().opacity(1, 0.5)),
      all(dot17().position([480, -40], 3), dot17().width(16, 3), dot17().height(16, 3)),
    ),
  );

  // b18：几个不可靠的小零件拼成一台可靠的机器（5.34s）
  say('不可靠部件，可靠系统');
  yield* beat(
    'b18',
    sequence(
      0,
      all(g17().opacity(0, 0.5), g18().opacity(1, 0.5)),
      ...[0, 1, 2, 3].map(i => parts18[i]().position([-90 + (i % 2) * 180, -80 + Math.floor(i / 2) * 40], 1.2)),
      all(
        parts18[0]().opacity(0, 0.8),
        parts18[1]().opacity(0, 0.8),
        parts18[2]().opacity(0, 0.8),
        parts18[3]().opacity(0, 0.8),
        machine18().opacity(1, 0.8),
      ),
    ),
  );
});
