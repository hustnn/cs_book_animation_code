// U9 场景 5（MC）：b26–b32 —— 欧洲圈、两组人、求交集、4 行 vs 29 行、
// 模型为用例而设计、下一站三元组与 SPARQL。
// 分镜：skill-ch02/beats-u9.md U9 一节；原文：DDIA §2.13（书页 p55，PDF p77）、§2.16 过渡。
// 时长全部来自 timeline/u9.json（beat() 驱动），不手写 waitFor。
import {Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, chain, createRef} from '@motion-canvas/core';
import {at, makeBeats} from '../../lib/beats';
import {FONT, SAFE, SIZE, T} from '../../lib/theme';
import timeline from '../../timeline/u9.json';

export default makeScene2D(function* (view) {
  view.fill(T.bg);
  const beat = makeBeats(timeline);

  const header = createRef<Txt>();
  const anchor = createRef<Txt>();
  const say = (text: string) => anchor().text(text);

  // b26：欧洲圈（美国圈沿用 mc4 的右圈位置）
  const g26 = createRef<Node>();
  const washUsa = createRef<Rect>();
  const usaChip = createRef<Txt>();
  const washEu = createRef<Rect>();
  const euChip = createRef<Txt>();
  const ukChip = createRef<Rect>();
  const londonChip = createRef<Rect>();
  // b27：两组人
  const g27 = createRef<Node>();
  const cBorn = createRef<Rect>();
  const cLives = createRef<Rect>();
  // b28：求交集
  const inter = createRef<Rect>();
  const lucyName = createRef<Txt>();
  const selLine = createRef<Txt>();
  // b29：4 行 vs 29 行
  const g29 = createRef<Node>();
  const cyCard = createRef<Rect>();
  const sqlCard = createRef<Node>();
  const eqMark = createRef<Txt>();
  const sameQ = createRef<Txt>();
  // b30：天平
  const beam = createRef<Line>();
  const capCy = createRef<Txt>();
  const capSql = createRef<Txt>();
  // b31：挑对模型
  const g31 = createRef<Node>();
  const pickTitle = createRef<Txt>();
  const shortCard = createRef<Rect>();
  const longCard = createRef<Rect>();
  // b32：下一站
  const g32 = createRef<Node>();
  const nextTitle = createRef<Txt>();
  const sparqlTag = createRef<Txt>();
  const sCards = [0, 1, 2].map(() => createRef<Rect>());

  view.add(
    <>
      <Txt
        ref={header}
        position={[-SAFE.halfW, -SAFE.halfH]}
        offset={[-1, -1]}
        fontSize={SIZE.label}
        fill={T.muted}
        fontFamily={FONT.sans}
        text={'查图：Cypher 与 SQL'}
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

      <Node ref={g26} opacity={0}>
        <Rect ref={washUsa} position={[300, 0]} width={300} height={300} radius={24} fill={T.green} opacity={0.18} />
        <Txt ref={usaChip} position={[300, 0]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'美国'} />
        <Rect ref={washEu} position={[-300, 0]} width={300} height={300} radius={24} fill={T.blue} opacity={0} />
        <Txt ref={euChip} position={[-300, -60]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'Europe'} opacity={0} />
        <Rect ref={ukChip} position={[-380, 60]} width={160} height={56} radius={10} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.min} fill={T.text} fontFamily={FONT.sans} text={'英国'} />
        </Rect>
        <Rect ref={londonChip} position={[-220, 60]} width={160} height={56} radius={10} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.min} fill={T.text} fontFamily={FONT.sans} text={'伦敦'} />
        </Rect>
      </Node>

      <Node ref={g27} opacity={0}>
        <Rect ref={cBorn} position={[300, 0]} width={440} height={260} radius={16} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt position={[0, -80]} fontSize={SIZE.label} fill={T.blue} fontFamily={FONT.mono} text={'born_in_usa'} />
          <Txt position={[0, -10]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'Lucy'} />
          <Txt position={[0, 60]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'…'} />
        </Rect>
        <Rect ref={cLives} position={[-300, 0]} width={440} height={260} radius={16} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt position={[0, -80]} fontSize={SIZE.label} fill={T.blue} fontFamily={FONT.mono} text={'lives_in_europe'} />
          <Txt position={[0, -10]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'Lucy'} />
          <Txt position={[0, 60]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'…'} />
        </Rect>
        <Rect ref={inter} position={[0, 0]} width={80} height={260} radius={12} fill={'#00000000'} stroke={T.green} lineWidth={3} opacity={0} />
        <Txt ref={lucyName} position={[0, -180]} fontSize={SIZE.body} fill={T.green} fontFamily={FONT.sans} text={'Lucy'} opacity={0} />
        <Txt ref={selLine} position={[0, 210]} fontSize={20} fill={T.text} fontFamily={FONT.mono} text={'SELECT name'} opacity={0} />
      </Node>

      <Node ref={g29} opacity={0}>
        <Rect ref={cyCard} position={[-300, 0]} width={440} height={300} radius={16} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt position={[0, -100]} fontSize={22} fill={T.blue} fontFamily={FONT.mono} text={'MATCH'} />
          <Txt position={[0, -40]} fontSize={16} fill={T.text} fontFamily={FONT.mono} text={'(person) -[:BORN_IN]-> …'} />
          <Txt position={[0, 10]} fontSize={16} fill={T.text} fontFamily={FONT.mono} text={'(person) -[:LIVES_IN]-> …'} />
          <Txt position={[0, 70]} fontSize={22} fill={T.green} fontFamily={FONT.mono} text={'RETURN person.name'} />
          <Txt position={[0, 120]} fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.sans} text={'4 行'} />
        </Rect>
        <Node ref={sqlCard} position={[300, 0]} opacity={0}>
          <Rect width={440} height={400} radius={16} fill={T.card} stroke={T.red} lineWidth={2} />
          {[...Array(29)].map((_, i) => (
            <Rect key={`sqlbar2-${i}`} position={[0, -182 + i * 13]} width={380} height={7} radius={3} fill={T.line} />
          ))}
        </Node>
        <Txt ref={eqMark} position={[0, 0]} fontSize={SIZE.title} fill={T.yellow} fontFamily={FONT.sans} text={'='} opacity={0} />
        <Txt ref={sameQ} position={[0, -230]} fontSize={SIZE.body} fill={T.yellow} fontFamily={FONT.sans} text={'同一个问题'} opacity={0} />
        <Txt ref={capCy} position={[-300, 225]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} text={'为查图而生'} opacity={0} />
        <Txt ref={capSql} position={[300, 225]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'为查表而生'} opacity={0} />
        <Line ref={beam} points={[[-520, -245], [520, -245]]} stroke={T.line} lineWidth={3} opacity={0} />
      </Node>

      <Node ref={g31} opacity={0}>
        <Txt ref={pickTitle} position={[0, -200]} fontSize={40} fill={T.text} fontFamily={FONT.sans} text={'挑对模型'} opacity={0} />
        <Rect ref={shortCard} position={[-280, 0]} width={380} height={200} radius={16} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt position={[0, -40]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'4 行查询'} />
          <Txt position={[0, 30]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} text={'短'} />
        </Rect>
        <Rect ref={longCard} position={[280, 0]} width={380} height={200} radius={16} fill={T.card} stroke={T.line} lineWidth={2} opacity={0}>
          <Txt position={[0, -40]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'29 行查询'} />
          <Txt position={[0, 30]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'绕大弯'} />
        </Rect>
      </Node>

      <Node ref={g32} opacity={0}>
        <Txt ref={nextTitle} position={[0, -120]} fontSize={40} fill={T.text} fontFamily={FONT.sans} text={'下一站：三元组'} opacity={0} />
        <Txt ref={sparqlTag} position={[0, -50]} fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.mono} text={'SPARQL'} opacity={0} />
        {['主语', '谓语', '宾语'].map((s, i) => (
          <Rect key={`s-${i}`} ref={sCards[i]} position={[-360 + i * 360, 30]} width={240} height={100} radius={12} fill={T.card} stroke={T.purple} lineWidth={2} opacity={0}>
            <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={s} />
          </Rect>
        ))}
      </Node>
    </>
  );

  say('欧洲圈同理');
  yield* beat('b26',
    all(g26().opacity(1, 0.4), washUsa().opacity(0.18, 0.4)),
    chain(washEu().opacity(0.18, 0.4), euChip().opacity(1, 0.4), ukChip().opacity(1, 0.3), londonChip().opacity(1, 0.3)),
  );

  say('两组人，各找各的');
  yield* beat('b27',
    all(g26().opacity(0, 0.4), g27().opacity(1, 0.4), g27().scale(1.02, beat.dur('b27'))),
    at('born_in_usa', cBorn().opacity(1, 0.5)),
    at('lives_in_europe', cLives().opacity(1, 0.5)),
  );

  say('求交集，返回名字');
  yield* beat('b28',
    all(cBorn().position([180, 0], 0.8), cLives().position([-180, 0], 0.8)),
    at('SELECT', selLine().opacity(1, 0.4)),
    at('求交集', inter().opacity(1, 0.4)),
    at('返回他们的名字', lucyName().opacity(1, 0.4)),
  );

  say('同一个问题');
  yield* beat('b29',
    all(g27().opacity(0, 0.4), g29().opacity(1, 0.4), cyCard().opacity(1, 0.5), sqlCard().opacity(1, 0.5)),
    at('同一个问题', chain(eqMark().opacity(1, 0.4), sameQ().opacity(1, 0.4))),
  );

  say('模型为用例而设计');
  yield* beat('b30',
    all(sameQ().opacity(0, 0.3), capCy().opacity(1, 0.4), capSql().opacity(1, 0.4)),
    at('不同的数据模型', beam().opacity(1, 0.5)),
    at('为不同的用例设计的', all(
      chain(capCy().scale(1.12, 0.3), capCy().scale(1, 0.3)),
      chain(capSql().scale(1.12, 0.3), capSql().scale(1, 0.3)),
    )),
  );

  say('模型对了，查询就短');
  yield* beat('b31',
    all(g29().opacity(0, 0.4), g31().opacity(1, 0.4), g31().scale(1.02, beat.dur('b31'))),
    at('挑数据模型', pickTitle().opacity(1, 0.4)),
    at('模型对了', chain(shortCard().opacity(1, 0.5), shortCard().lineWidth(4, 0.3), shortCard().lineWidth(2, 0.3))),
    at('模型不对', chain(longCard().opacity(1, 0.5), longCard().opacity(0.45, 0.4))),
  );

  say('下一站：三元组');
  yield* beat('b32',
    all(g31().opacity(0, 0.4), g32().opacity(1, 0.4)),
    at('三元组', chain(nextTitle().opacity(1, 0.4), sCards[0]().opacity(1, 0.3), sCards[1]().opacity(1, 0.3), sCards[2]().opacity(1, 0.3))),
    at('SPARQL', sparqlTag().opacity(1, 0.4)),
    at('它又怎么写', all(
      chain(sCards[0]().lineWidth(4, 0.3), sCards[0]().lineWidth(2, 0.3)),
      chain(sCards[1]().lineWidth(4, 0.3), sCards[1]().lineWidth(2, 0.3)),
      chain(sCards[2]().lineWidth(4, 0.3), sCards[2]().lineWidth(2, 0.3)),
    )),
  );
});
