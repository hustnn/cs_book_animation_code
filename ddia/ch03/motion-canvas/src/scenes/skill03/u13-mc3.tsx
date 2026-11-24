// U13 场景 3（MC）：b21–b25b —— 同一份数据多几种排法（C-Store / Vertica）、复制防丢、
// 与多个二级索引的对比：行存有指针，列存只有含值的列。
// 分镜：skill-ch03/beats-u13.md；原文：DDIA §3.12（书页 p100–101，PDF p122–123）。
// 时长全部来自 timeline/u13.json（beat() 驱动），不手写 waitFor。
import {Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, chain, createRef} from '@motion-canvas/core';
import {at, makeBeats} from '../../lib/beats';
import {FONT, SAFE, SIZE, T} from '../../lib/theme';
import timeline from '../../timeline/u13.json';

export default makeScene2D(function* (view) {
  view.fill(T.bg);
  const beat = makeBeats(timeline);

  const header = createRef<Txt>();
  const anchor = createRef<Txt>();
  const say = (text: string) => anchor().text(text);

  const dataChip = createRef<Node>();
  const tabA = createRef<Node>();
  const tabB = createRef<Node>();
  const plateA = createRef<Node>();
  const plateB = createRef<Node>();

  const machines = createRef<Node>();
  const machBoxes = [0, 1, 2].map(() => createRef<Rect>());
  const machX = createRef<Txt>();
  const machStill = createRef<Txt>();
  const sortLabs = [0, 1, 2].map(() => createRef<Txt>());
  const queryArrow = createRef<Line>();
  const bestTag = createRef<Txt>();

  const compare = createRef<Node>();
  const rowCard = createRef<Rect>();
  const colCard = createRef<Rect>();
  const diffTag = createRef<Txt>();
  const rowChip = createRef<Node>();
  const idxChip = createRef<Node>();
  const ptr1 = createRef<Line>();
  const ptr2 = createRef<Line>();
  const colStrips = [0, 1, 2].map(() => createRef<Rect>());
  const noPtr = createRef<Txt>();

  // A 表：按日期排（日期，产品）；B 表：按产品排（产品，日期）
  const rowsA = [
    ['140101', '32'],
    ['140101', '69'],
    ['140102', '32'],
    ['140102', '33'],
  ];
  const rowsB = [
    ['32', '140101'],
    ['32', '140102'],
    ['33', '140102'],
    ['69', '140101'],
  ];

  view.add(
    <>
      <Txt
        ref={header}
        position={[-SAFE.halfW, -SAFE.halfH]}
        offset={[-1, -1]}
        fontSize={SIZE.label}
        fill={T.muted}
        fontFamily={FONT.sans}
        text={'排序与写入：列存的两难'}
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

      {/* 同一份数据，两种排法 */}
      <Node ref={dataChip} position={[0, -265]} opacity={0}>
        <Rect width={380} height={64} radius={12} fill={T.card} stroke={T.blue} lineWidth={2}>
          <Txt fontSize={SIZE.label} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'同一份数据'} />
        </Rect>
      </Node>
      <Node ref={tabA} position={[-300, -60]} opacity={0}>
        <Rect position={[0, -140]} width={340} height={44} radius={10} fill={T.card} stroke={T.blue} lineWidth={2}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'按日期排'} />
        </Rect>
        {rowsA.map((row, i) => (
          <Node key={`a-${i}`} position={[0, -85 + i * 50]}>
            <Rect position={[-80, 0]} width={150} height={40} radius={8} fill={T.card} stroke={T.line} lineWidth={2}>
              <Txt fontSize={20} fill={T.text} fontFamily={FONT.mono} text={row[0]} />
            </Rect>
            <Rect position={[80, 0]} width={150} height={40} radius={8} fill={T.card} stroke={T.line} lineWidth={2}>
              <Txt fontSize={20} fill={T.text} fontFamily={FONT.mono} text={row[1]} />
            </Rect>
          </Node>
        ))}
      </Node>
      <Node ref={tabB} position={[300, -60]} opacity={0}>
        <Rect position={[0, -140]} width={340} height={44} radius={10} fill={T.card} stroke={T.purple} lineWidth={2}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'按产品排'} />
        </Rect>
        {rowsB.map((row, i) => (
          <Node key={`b-${i}`} position={[0, -85 + i * 50]}>
            <Rect position={[-80, 0]} width={150} height={40} radius={8} fill={T.card} stroke={T.line} lineWidth={2}>
              <Txt fontSize={20} fill={T.text} fontFamily={FONT.mono} text={row[0]} />
            </Rect>
            <Rect position={[80, 0]} width={150} height={40} radius={8} fill={T.card} stroke={T.line} lineWidth={2}>
              <Txt fontSize={20} fill={T.text} fontFamily={FONT.mono} text={row[1]} />
            </Rect>
          </Node>
        ))}
      </Node>
      <Node ref={plateA} position={[-300, 150]} opacity={0}>
        <Rect width={260} height={56} radius={12} fill={T.card} stroke={T.purple} lineWidth={2}>
          <Txt fontSize={SIZE.label} fontWeight={700} fill={T.purple} fontFamily={FONT.mono} text={'C-Store'} />
        </Rect>
      </Node>
      <Node ref={plateB} position={[300, 150]} opacity={0}>
        <Rect width={260} height={56} radius={12} fill={T.card} stroke={T.purple} lineWidth={2}>
          <Txt fontSize={SIZE.label} fontWeight={700} fill={T.purple} fontFamily={FONT.mono} text={'Vertica'} />
        </Rect>
      </Node>

      {/* 三台机器：复制防丢 */}
      <Node ref={machines} opacity={0}>
        {[0, 1, 2].map(i => (
          <Rect
            key={`m-${i}`}
            ref={machBoxes[i]}
            position={[-380 + i * 380, -60]}
            width={300}
            height={220}
            radius={16}
            fill={T.card}
            stroke={T.blue}
            lineWidth={2}
          >
            <Txt position={[0, -70]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'数据副本'} />
          </Rect>
        ))}
        <Txt ref={machX} position={[0, -60]} fontSize={72} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'✗'} opacity={0} />
        <Txt ref={machStill} position={[0, 130]} fontSize={SIZE.label} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'数据还在另外两台上'} opacity={0} />
        {[0, 1, 2].map(i => (
          <Txt key={`sl-${i}`} ref={sortLabs[i]} position={[-380 + i * 380, 10]} fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.sans} text={['按日期排', '按产品排', '按数量排'][i]} opacity={0} />
        ))}
        <Line ref={queryArrow} points={[[0, 230], [-380, 70]]} stroke={T.green} lineWidth={3} endArrow opacity={0} />
        <Txt ref={bestTag} position={[-380, -210]} fontSize={SIZE.label} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'最适合'} opacity={0} />
      </Node>

      {/* 行存 vs 列存 */}
      <Node ref={compare} opacity={0}>
        <Rect ref={rowCard} position={[-300, -60]} width={440} height={300} radius={16} fill={T.card} stroke={T.blue} lineWidth={2}>
          <Txt position={[0, -135]} fontSize={SIZE.label} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'行式存储'} />
        </Rect>
        <Rect ref={colCard} position={[300, -60]} width={440} height={300} radius={16} fill={T.card} stroke={T.purple} lineWidth={2}>
          <Txt position={[0, -135]} fontSize={SIZE.label} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'列式存储'} />
        </Rect>
        <Txt ref={diffTag} position={[0, -240]} fontSize={SIZE.body} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'大区别'} opacity={0} />
        <Node ref={rowChip} position={[-300, -40]} opacity={0}>
          <Rect width={340} height={56} radius={10} fill={T.bg} stroke={T.green} lineWidth={2}>
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'一行完整数据'} />
          </Rect>
        </Node>
        <Node ref={idxChip} position={[-300, 60]} opacity={0}>
          <Rect width={340} height={56} radius={10} fill={T.bg} stroke={T.blue} lineWidth={2}>
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'二级索引'} />
          </Rect>
        </Node>
        <Line ref={ptr1} points={[[-380, 32], [-380, -12]]} stroke={T.blue} lineWidth={3} endArrow opacity={0} />
        <Line ref={ptr2} points={[[-220, 32], [-220, -12]]} stroke={T.blue} lineWidth={3} endArrow opacity={0} />
        {[0, 1, 2].map(i => (
          <Rect key={`cs-${i}`} ref={colStrips[i]} position={[220 + i * 80, -10]} width={56} height={180} radius={8} fill={[T.blue, T.purple, T.green][i]} opacity={0} />
        ))}
        <Txt ref={noPtr} position={[300, 130]} fontSize={SIZE.label} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'没有指针 ✗'} opacity={0} />
      </Node>
    </>
  );

  say('同一份数据，几种排法');
  yield* beat('b21',
    all(dataChip().opacity(1, 0.5)),
    at('同一份数据', dataChip().scale(1.05, 0.6)),
    at('按几种方式排着存', all(tabA().opacity(1, 0.5), tabB().opacity(1, 0.5))),
  );

  say('C-Store / Vertica');
  yield* beat('b22',
    at('C-Store', plateA().opacity(1, 0.5)),
    at('Vertica', plateB().opacity(1, 0.5)),
  );

  say('复制防丢');
  yield* beat('b23a',
    all(dataChip().opacity(0, 0.4), tabA().opacity(0, 0.4), tabB().opacity(0, 0.4), plateA().opacity(0, 0.4), plateB().opacity(0, 0.4)),
    at('复制到多台机器上', machines().opacity(1, 0.5)),
    at('坏了丢数据', all(machBoxes[1]().stroke(T.red, 0.4), machX().opacity(1, 0.4), machStill().opacity(1, 0.4))),
  );

  say('查询用最适合的版本');
  yield* beat('b23b',
    at('按不同方式排', chain(sortLabs[0]().opacity(1, 0.4), sortLabs[1]().opacity(1, 0.4), sortLabs[2]().opacity(1, 0.4))),
    at('最适合的那个版本', all(queryArrow().opacity(1, 0.5), bestTag().opacity(1, 0.4), machBoxes[0]().stroke(T.green, 0.4))),
  );

  say('像多个二级索引');
  yield* beat('b24',
    all(machines().opacity(0, 0.5), compare().opacity(1, 0.5)),
    at('多个二级索引', rowCard().stroke(T.yellow, 0.4)),
    at('大区别', diffTag().opacity(1, 0.5)),
  );

  say('二级索引只有指针');
  yield* beat('b25a',
    at('每行放在一处', rowChip().opacity(1, 0.5)),
    at('指向匹配行的指针', all(idxChip().opacity(1, 0.5), ptr1().opacity(1, 0.4), ptr2().opacity(1, 0.4))),
  );

  say('列存只有含值的列');
  yield* beat('b25b',
    at('没有任何指向别处数据的指针', all(ptr1().opacity(0, 0.4), ptr2().opacity(0, 0.4), noPtr().opacity(1, 0.5))),
    at('只有含值的列', chain(colStrips[0]().opacity(1, 0.4), colStrips[1]().opacity(1, 0.4), colStrips[2]().opacity(1, 0.4))),
  );
});
