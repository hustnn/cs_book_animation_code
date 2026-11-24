// U6 场景 3（MC）：b14a–b17 —— 连接索引（几列拼成一个键）、电话簿（姓，名）→ 电话号码的三次查询、
// 结尾回扣（正门与侧门）。
// 分镜：skill-ch03/beats-u6.md；原文：DDIA §3.6 前半（书页 p87，PDF p109）。
// 时长全部来自 timeline/u6.json（beat() 驱动），不手写 waitFor。
import {Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, chain, createRef} from '@motion-canvas/core';
import {at, makeBeats} from '../../lib/beats';
import {FONT, SAFE, SIZE, T} from '../../lib/theme';
import timeline from '../../timeline/u6.json';


export default makeScene2D(function* (view) {
  view.fill(T.bg);
  const beat = makeBeats(timeline);

  const header = createRef<Txt>();
  const anchor = createRef<Txt>();
  const say = (text: string) => anchor().text(text);

  // ---- 第 1 页：拼键 + 电话簿（b14a–b16c）----
  const pH = createRef<Node>();
  const keyChip = createRef<Rect>();
  const orderLab = createRef<Txt>();
  const book = createRef<Node>();
  const hlSurname = createRef<Rect>();
  const hlName = createRef<Rect>();
  const hlPhone = createRef<Rect>();
  const rowHl1 = createRef<Rect>();
  const rowHl2 = createRef<Rect>();
  const nameHl1 = createRef<Rect>();
  const nameHl3 = createRef<Rect>();
  const phones = [0, 1, 2, 3].map(() => createRef<Txt>());
  const qChip = createRef<Rect>();
  const qA = createRef<Txt>();
  const qB = createRef<Txt>();
  const qC = createRef<Txt>();
  const bigX = createRef<Txt>();

  // ---- 第 2 页：正门与侧门（b17）----
  const pI = createRef<Node>();
  const mainDoor = createRef<Rect>();
  const sideDoor1 = createRef<Rect>();
  const sideDoor2 = createRef<Rect>();
  const costTag = createRef<Txt>();

  view.add(
    <>
      <Txt
        ref={header}
        position={[-SAFE.halfW, -SAFE.halfH]}
        offset={[-1, -1]}
        fontSize={SIZE.label}
        fill={T.muted}
        fontFamily={FONT.sans}
        text={'不止主键：二级索引与聚集索引'}
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

      {/* 第 1 页 */}
      <Node ref={pH} opacity={0}>
        <Rect ref={keyChip} position={[0, 140]} width={640} height={70} radius={14} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'键 = 姓 + 名'} />
        </Rect>
        <Txt ref={orderLab} position={[0, 215]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'顺序：姓在前，名在后'} opacity={0} />
        <Node ref={book} opacity={0}>
          <Rect position={[0, -80]} width={860} height={260} radius={16} fill={T.card} stroke={T.line} lineWidth={2}>
          </Rect>
          <Txt position={[-280, -180]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'姓'} />
          <Txt position={[-80, -180]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'名'} />
          <Txt position={[180, -180]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'电话'} />
          <Txt position={[-280, -140]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'张'} />
          <Txt position={[-80, -140]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'伟'} />
          <Txt position={[-280, -100]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'张'} />
          <Txt position={[-80, -100]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'敏'} />
          <Txt position={[-280, -60]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'李'} />
          <Txt position={[-80, -60]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'伟'} />
          <Txt position={[-280, -20]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'王'} />
          <Txt position={[-80, -20]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'敏'} />
        </Node>
        <Rect ref={hlSurname} position={[-280, -80]} width={140} height={160} radius={10} stroke={T.yellow} lineWidth={3} opacity={0} />
        <Rect ref={hlName} position={[-80, -80]} width={140} height={160} radius={10} stroke={T.yellow} lineWidth={3} opacity={0} />
        <Rect ref={hlPhone} position={[180, -80]} width={220} height={160} radius={10} stroke={T.green} lineWidth={3} opacity={0} />
        <Rect ref={rowHl1} position={[0, -140]} width={820} height={44} radius={10} stroke={T.yellow} lineWidth={3} opacity={0} />
        <Rect ref={rowHl2} position={[0, -100]} width={820} height={44} radius={10} stroke={T.yellow} lineWidth={3} opacity={0} />
        <Rect ref={nameHl1} position={[-80, -140]} width={110} height={44} radius={10} stroke={T.red} lineWidth={3} opacity={0} />
        <Rect ref={nameHl3} position={[-80, -60]} width={110} height={44} radius={10} stroke={T.red} lineWidth={3} opacity={0} />
        <Txt ref={phones[0]} position={[180, -140]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.mono} text={'138-0001'} opacity={0} />
        <Txt ref={phones[1]} position={[180, -100]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.mono} text={'138-0002'} opacity={0} />
        <Txt ref={phones[2]} position={[180, -60]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.mono} text={'139-0003'} opacity={0} />
        <Txt ref={phones[3]} position={[180, -20]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.mono} text={'137-0004'} opacity={0} />
        <Rect ref={qChip} position={[0, 150]} width={460} height={70} radius={14} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
        </Rect>
        <Txt ref={qA} position={[0, 150]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'找姓张的所有人'} opacity={0} />
        <Txt ref={qB} position={[0, 150]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'找张伟'} opacity={0} />
        <Txt ref={qC} position={[0, 150]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'找名叫伟的所有人'} opacity={0} />
        <Txt ref={bigX} position={[330, 150]} fontSize={64} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'✗'} opacity={0} />
      </Node>

      {/* 第 2 页 */}
      <Node ref={pI} opacity={0}>
        <Rect ref={mainDoor} position={[-360, -40]} width={300} height={200} radius={16} fill={T.card} stroke={T.green} lineWidth={3} opacity={0}>
          <Txt position={[0, -50]} fontSize={SIZE.body} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'正门'} />
          <Txt position={[0, 10]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'主键'} />
        </Rect>
        <Rect ref={sideDoor1} position={[0, -40]} width={300} height={200} radius={16} fill={T.card} stroke={T.blue} lineWidth={3} opacity={0}>
          <Txt position={[0, -50]} fontSize={SIZE.body} fontWeight={700} fill={T.blue} fontFamily={FONT.sans} text={'侧门'} />
          <Txt position={[0, 10]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'二级索引'} />
        </Rect>
        <Rect ref={sideDoor2} position={[360, -40]} width={300} height={200} radius={16} fill={T.card} stroke={T.blue} lineWidth={3} opacity={0}>
          <Txt position={[0, -50]} fontSize={SIZE.body} fontWeight={700} fill={T.blue} fontFamily={FONT.sans} text={'侧门'} />
          <Txt position={[0, 10]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'二级索引'} />
        </Rect>
        <Txt ref={costTag} position={[0, 150]} fontSize={SIZE.body} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'门越多，维护越贵'} opacity={0} />
      </Node>
    </>
  );

  say('最常见的多列索引');
  yield* beat('b14a',
    all(pH().opacity(1, 0.5)),
    at('连接索引', keyChip().opacity(1, 0.5)),
  );

  say('几列拼成一个键');
  yield* beat('b14b',
    at('拼成一个键', chain(keyChip().stroke(T.yellow, 0.4), keyChip().scale(1.03, 1.5))),
  );

  say('顺序由定义定');
  yield* beat('b14c',
    at('索引定义', orderLab().opacity(1, 0.5)),
  );

  say('电话簿：姓、名 → 电话');
  yield* beat('b15',
    all(keyChip().opacity(0, 0.4), orderLab().opacity(0, 0.4)),
    at('电话簿', book().opacity(1, 0.5)),
    at('先按姓', hlSurname().opacity(1, 0.5)),
    at('再按名', hlName().opacity(1, 0.5)),
    at('电话号码', hlPhone().opacity(1, 0.5)),
  );

  say('找某一姓的所有人');
  yield* beat('b16a',
    all(hlName().opacity(0, 0.4), hlPhone().opacity(0, 0.4)),
    at('某一姓', chain(qChip().opacity(1, 0.5), qA().opacity(1, 0.4), rowHl1().opacity(1, 0.4), rowHl2().opacity(1, 0.4))),
    at('所有人', chain(phones[0]().opacity(1, 0.4), phones[1]().opacity(1, 0.4))),
  );

  say('找某一姓加名的组合');
  yield* beat('b16b',
    all(rowHl2().opacity(0, 0.4), phones[1]().opacity(0, 0.4), qA().opacity(0, 0.4)),
    at('姓加名', chain(qB().opacity(1, 0.4), rowHl1().stroke(T.green, 0.4))),
    at('组合', phones[0]().fill(T.yellow, 0.4)),
  );

  say('找某一名的所有人，没用');
  yield* beat('b16c',
    all(rowHl1().opacity(0, 0.4), phones[0]().opacity(0, 0.4), qB().opacity(0, 0.4)),
    at('某一名的所有人', chain(qC().opacity(1, 0.4), nameHl1().opacity(1, 0.4), nameHl3().opacity(1, 0.4))),
    at('没用了', bigX().opacity(1, 0.5)),
  );

  say('正门是主键，侧门是二级索引');
  yield* beat('b17',
    all(pH().opacity(0, 0.5), pI().opacity(1, 0.5)),
    at('正门', mainDoor().opacity(1, 0.5)),
    at('侧门', chain(sideDoor1().opacity(1, 0.4), sideDoor2().opacity(1, 0.4))),
    at('维护越贵', all(costTag().opacity(1, 0.5), mainDoor().scale(1.02, 1.0))),
  );
});
