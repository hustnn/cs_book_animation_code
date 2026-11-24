// U5 场景 1（MC）：b1–b8 —— 钩子天平、经验法则、基准测试没定论、B 树一次写至少写两次。
// 分镜：skill-ch03/beats-u5.md；原文：DDIA §3.5（书页 p83–84，PDF p105–106）。
// 时长全部来自 timeline/u5.json（beat() 驱动），不手写 waitFor。
import {Circle, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, chain, createRef} from '@motion-canvas/core';
import {at, makeBeats} from '../../lib/beats';
import {FONT, SAFE, SIZE, T} from '../../lib/theme';
import timeline from '../../timeline/u5.json';

export default makeScene2D(function* (view) {
  view.fill(T.bg);
  const beat = makeBeats(timeline);

  const header = createRef<Txt>();
  const anchor = createRef<Txt>();
  const say = (text: string) => anchor().text(text);

  // ---- 第 1 页：天平 + 读要翻好几段 ----
  const p1 = createRef<Node>();
  const beam = createRef<Line>();
  const post = createRef<Rect>();
  const panL = createRef<Rect>();
  const panR = createRef<Rect>();
  const panLTag = createRef<Txt>();
  const panRTag = createRef<Txt>();
  const qMark = createRef<Txt>();
  const segs = [0, 1, 2].map(() => createRef<Rect>());
  const segLabs = [0, 1, 2].map(() => createRef<Txt>());
  const hopDot = createRef<Circle>();

  // ---- 第 2 页：基准测试榜单 + 自己的负载 ----
  const p2 = createRef<Node>();
  const board = createRef<Rect>();
  const boardBars = [0, 1, 2].map(() => createRef<Rect>());
  const boardQ = createRef<Txt>();
  const loadCard = createRef<Rect>();
  const loadRow1 = createRef<Rect>();
  const loadRow2 = createRef<Rect>();
  const loadDot = createRef<Circle>();

  // ---- 第 3 页：一次写，磁盘写两遍 ----
  const p3 = createRef<Node>();
  const ball = createRef<Circle>();
  const walBox = createRef<Rect>();
  const pageBox = createRef<Rect>();
  const walStamp = createRef<Txt>();
  const pageStamp = createRef<Txt>();
  const splitA = createRef<Rect>();
  const splitB = createRef<Rect>();
  const smallCell = createRef<Rect>();
  const sameLab = createRef<Txt>();
  const powerLab = createRef<Txt>();
  const guardLab = createRef<Txt>();

  view.add(
    <>
      <Txt
        ref={header}
        position={[-SAFE.halfW, -SAFE.halfH]}
        offset={[-1, -1]}
        fontSize={SIZE.label}
        fill={T.muted}
        fontFamily={FONT.sans}
        text={'两大学派对决：写快还是读快'}
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
      <Node ref={p1} opacity={0}>
        <Line ref={beam} points={[[-420, -110], [420, -110]]} stroke={T.line} lineWidth={6} />
        <Rect ref={post} position={[0, -40]} width={24} height={140} fill={T.line} />
        <Rect ref={panL} position={[-320, -60]} width={280} height={100} radius={14} fill={T.card} stroke={T.blue} lineWidth={2}>
          <Txt position={[0, -18]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'写快'} />
          <Txt position={[0, 26]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'日志结构树'} />
        </Rect>
        <Rect ref={panR} position={[320, -60]} width={280} height={100} radius={14} fill={T.card} stroke={T.blue} lineWidth={2}>
          <Txt position={[0, -18]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'读快'} />
          <Txt position={[0, 26]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'B 树'} />
        </Rect>
        <Txt ref={panLTag} position={[-320, 60]} fontSize={SIZE.label} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'写更快'} opacity={0} />
        <Txt ref={panRTag} position={[320, 60]} fontSize={SIZE.label} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'读更快'} opacity={0} />
        <Txt ref={qMark} position={[0, -220]} fontSize={64} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'？'} opacity={0} />
        {[0, 1, 2].map(i => (
          <Rect
            key={`seg-${i}`}
            ref={segs[i]}
            position={[-360 + i * 360, -60]}
            width={320}
            height={120}
            radius={14}
            fill={T.card}
            stroke={T.blue}
            lineWidth={2}
            opacity={0}
          >
            <Txt position={[0, -28]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={['最新段', '较旧的段', '更旧的段'][i]} />
            <Txt ref={segLabs[i]} position={[0, 28]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'压缩阶段不同'} opacity={0} />
          </Rect>
        ))}
        <Circle ref={hopDot} position={[-360, -140]} width={26} height={26} fill={T.yellow} opacity={0} />
      </Node>

      {/* 第 2 页 */}
      <Node ref={p2} opacity={0}>
        <Rect ref={board} position={[0, -60]} width={760} height={280} radius={14} fill={T.card} stroke={T.line} lineWidth={2}>
          <Txt position={[0, -110]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'基准测试榜单'} />
        </Rect>
        {[0, 1, 2].map(i => (
          <Rect
            key={`bar-${i}`}
            ref={boardBars[i]}
            position={[-280, -40 + i * 70]}
            offset={[-1, 0]}
            width={[520, 380, 460][i]}
            height={40}
            radius={8}
            fill={T.blue}
            opacity={0}
          />
        ))}
        <Txt ref={boardQ} position={[0, 155]} fontSize={SIZE.body} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'分不出高下？'} opacity={0} />
        <Rect ref={loadCard} position={[0, -60]} width={760} height={280} radius={14} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt position={[0, -110]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'自己的负载'} />
        </Rect>
        <Rect ref={loadRow1} position={[-140, -40]} width={420} height={64} radius={10} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'写多读少'} />
        </Rect>
        <Rect ref={loadRow2} position={[-140, 50]} width={420} height={64} radius={10} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'读多写少'} />
        </Rect>
        <Circle ref={loadDot} position={[140, -40]} width={30} height={30} fill={T.yellow} opacity={0} />
      </Node>

      {/* 第 3 页 */}
      <Node ref={p3} opacity={0}>
        <Circle ref={ball} position={[0, -230]} width={54} height={54} fill={T.yellow} opacity={0} />
        <Rect ref={walBox} position={[-300, -40]} width={400} height={130} radius={14} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt position={[0, -28]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'预写日志'} />
          <Txt ref={walStamp} position={[0, 30]} fontSize={SIZE.label} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'写过 ✓'} opacity={0} />
        </Rect>
        <Rect ref={pageBox} position={[300, -40]} width={400} height={130} radius={14} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt position={[0, -28]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'树页'} />
          <Txt ref={pageStamp} position={[0, 30]} fontSize={SIZE.label} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'写过 ✓'} opacity={0} />
        </Rect>
        <Rect ref={splitA} position={[160, -40]} width={190} height={130} radius={14} fill={T.card} stroke={T.yellow} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'一半页'} />
        </Rect>
        <Rect ref={splitB} position={[380, -40]} width={190} height={130} radius={14} fill={T.card} stroke={T.yellow} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'一半页'} />
        </Rect>
        <Rect ref={smallCell} position={[300, -40]} width={60} height={60} radius={8} fill={T.yellow} opacity={0} />
        <Txt ref={sameLab} position={[300, 60]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'没变也重写'} opacity={0} />
        <Txt ref={powerLab} position={[0, -170]} fontSize={SIZE.body} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'断电'} opacity={0} />
        <Txt ref={guardLab} position={[0, 130]} fontSize={SIZE.body} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'半页更新，被挡住了'} opacity={0} />
      </Node>
    </>
  );

  say('写快和读快，都要？');
  yield* beat('b1',
    all(p1().opacity(1, 0.5), beam().opacity(1, 0.5), post().opacity(1, 0.5), panL().opacity(1, 0.5), panR().opacity(1, 0.5)),
    at('能不能都要', chain(qMark().opacity(1, 0.5), qMark().scale(1.15, 0.8))),
  );

  say('日志结构写快，B 树读快');
  yield* beat('b2',
    all(panLTag().opacity(1, 0.5), panRTag().opacity(1, 0.5)),
    at('日志结构', chain(panL().position([-320, -30], 1.0), panL().stroke(T.green, 0.5))),
    at('B 树读', chain(panR().position([320, -30], 1.0), panR().stroke(T.green, 0.5))),
  );

  say('读，要翻好几段');
  yield* beat('b3',
    all(beam().opacity(0, 0.4), post().opacity(0, 0.4), panL().opacity(0, 0.4), panR().opacity(0, 0.4), panLTag().opacity(0, 0.4), panRTag().opacity(0, 0.4), qMark().opacity(0, 0.4),
      segs[0]().opacity(1, 0.5), segLabs[0]().opacity(1, 0.4), hopDot().opacity(1, 0.4)),
    at('不同压缩阶段', all(segs[1]().opacity(1, 0.5), segLabs[1]().opacity(1, 0.4), hopDot().position([0, -140], 0.8))),
    at('好几段', all(segs[2]().opacity(1, 0.5), segLabs[2]().opacity(1, 0.4), hopDot().position([360, -140], 0.8))),
  );

  say('基准测试常常没定论');
  yield* beat('b4',
    all(p1().opacity(0, 0.5), p2().opacity(1, 0.5), board().opacity(1, 0.5)),
    at('没有定论', all(boardBars[0]().opacity(1, 0.4), boardBars[1]().opacity(1, 0.4), boardBars[2]().opacity(1, 0.4))),
    at('很敏感', all(boardQ().opacity(1, 0.5), boardBars[0]().fill(T.muted, 0.5), boardBars[1]().fill(T.muted, 0.5), boardBars[2]().fill(T.muted, 0.5))),
  );

  say('拿自己的负载测');
  yield* beat('b5',
    all(board().opacity(0, 0.4), boardBars[0]().opacity(0, 0.4), boardBars[1]().opacity(0, 0.4), boardBars[2]().opacity(0, 0.4), boardQ().opacity(0, 0.4),
      loadCard().opacity(1, 0.5), loadRow1().opacity(1, 0.5), loadRow2().opacity(1, 0.5), loadDot().opacity(1, 0.4)),
    at('自己的具体负载', chain(loadDot().position([140, 50], 3.0), loadRow2().stroke(T.green, 0.5))),
  );

  say('一次写，磁盘写两遍');
  yield* beat('b6',
    all(p2().opacity(0, 0.5), p3().opacity(1, 0.5), ball().opacity(1, 0.5), walBox().opacity(1, 0.5), pageBox().opacity(1, 0.5)),
    at('预写日志', chain(ball().position([-300, -140], 0.9), walStamp().opacity(1, 0.4))),
    at('树页本身', chain(ball().position([300, -140], 0.9), pageStamp().opacity(1, 0.4))),
  );

  say('改几个字节，也写整页');
  yield* beat('b7',
    all(pageBox().opacity(0, 0.4), pageStamp().opacity(0, 0.4), walStamp().opacity(0, 0.4), ball().opacity(0, 0.4)),
    at('页分裂', chain(splitA().opacity(1, 0.5), splitB().opacity(1, 0.5))),
    at('只改了几个字节', chain(smallCell().opacity(1, 0.5), sameLab().opacity(1, 0.4))),
  );

  say('防断电，同一页写两次');
  yield* beat('b8',
    all(splitA().opacity(0, 0.4), splitB().opacity(0, 0.4), smallCell().opacity(0, 0.4), sameLab().opacity(0, 0.4),
      pageBox().opacity(1, 0.5)),
    at('防断电', all(powerLab().opacity(1, 0.5), pageBox().stroke(T.yellow, 0.5))),
    at('写两次', all(pageStamp().opacity(1, 0.4), guardLab().opacity(1, 0.5), powerLab().opacity(0.2, 0.8))),
  );
});
