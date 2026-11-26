// U5 场景 5（MC，r4）：e35a–e36e —— 碎片与定期重写、固态盘固件、一键一处 vs 多处副本、锁附树上、收尾。
// r5：e35c 绿框随重写两步变短（440→300→220）+ 分层压缩半句解释；e35d 箭头标“随机写进/顺序写出”；
// e36b 加“换个例子：三段各一份”小标；e36c 卡里加小 B 树（根页→叶页）+ 黄色键范围框，锁落到范围框上，旁白补强事务语义解释。
// r6：e35c 两步变短加尺寸标 440→300→220（与每步同帧切换）+ 漏斗 V 形 + 三层段排（一层层压）；
// e35d 固件框内加日志小示意（4 格顺序追加）+ 框下定义小字。旁白三拍均不变。
// 时长全部来自 timeline/u5.json（beat() 驱动），不手写 waitFor。
import {Circle, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, chain, createRef} from '@motion-canvas/core';
import {at, makeBeats} from '../../lib/beats';
import {FONT, SAFE, SIZE, T} from '../../lib/theme';
import {KV} from '../../lib/schemas';
import timeline from '../../timeline/u5.json';

export default makeScene2D(function* (view) {
  view.fill(T.bg);
  const beat = makeBeats(timeline);

  const header = createRef<Txt>();
  const anchor = createRef<Txt>();
  const say = (text: string) => anchor().text(text);

  // ---- 第 1 页：碎片 + 定期重写 + 固态盘固件 ----
  const p1 = createRef<Node>();
  const lsmFile = createRef<Rect>();
  const btreePage = createRef<Rect>();
  const holes = [0, 1, 2].map(() => createRef<Rect>());
  const holeLab = createRef<Txt>();
  const rewriteLab = createRef<Txt>();
  // r4（P2-14）：压缩漏斗（落在日志结构文件上重写）与“B 树这边不管它”标。
  const funnelLab = createRef<Txt>();
  const ignoreLab = createRef<Txt>();
  const fwBox = createRef<Rect>();
  const fwIn = createRef<Line>();
  const fwOut = createRef<Line>();
  // r5（P2-13）：e35d 箭头标。
  const fwInLab = createRef<Txt>();
  const fwOutLab = createRef<Txt>();
  // r6（P1）：e35c 尺寸标 + 漏斗 V 形 + 三层段排（层 0/1/2，每层 3 个段块）。
  const sizeLab = createRef<Txt>();
  const funnelL = createRef<Line>();
  const funnelR = createRef<Line>();
  const layerLabs = [0, 1, 2].map(() => createRef<Txt>());
  const layerSegs = [0, 1, 2].map(() => [0, 1, 2].map(() => createRef<Rect>()));
  // r6（P2-3）：e35d 固件框内日志小示意（4 格顺序追加）+ 框下定义小字。
  const logCells = [0, 1, 2, 3].map(() => createRef<Rect>());
  const logLab = createRef<Txt>();
  const fwDef = createRef<Txt>();
  const compactFile = createRef<Rect>();
  const reqDots = [0, 1, 2, 3].map(() => createRef<Circle>());

  // ---- 第 2 页：一键一处 vs 多处副本 + 锁 ----
  // 同一键的三个副本用有身份的数据块 KV（图式组件），不是写着名字的空框。
  const p2 = createRef<Node>();
  const btreeCard = createRef<Rect>();
  const oneKey = createRef<Txt>();
  const segKVs = [0, 1, 2].map(
    i => new KV(`段 ${i + 1}`, `251（${['旧值', '新值', '最新'][i]}）`, 'kv', {w: 400, tone: T.blue, name: `segkv-${i}`}),
  );
  segKVs.forEach((kv, i) => kv.node.position([320, -160 + i * 110]));
  const lockBox = createRef<Rect>();
  // r4（P2-12）：“锁没处可挂”标，落在三副本下方。
  const lockWhyLab = createRef<Txt>();
  // r5（P2-14/15）：e36c 卡里的小 B 树（根页→叶页）与键范围框；e36b 换例子小标。
  const rootMini = createRef<Rect>();
  const leafMini = createRef<Rect>();
  const rangeBox = createRef<Rect>();
  const segNote = createRef<Txt>();

  // ---- 第 3 页：收尾 ----
  const p3 = createRef<Node>();
  const bigTree = createRef<Rect>();
  const sprout = createRef<Rect>();
  const noRule = createRef<Txt>();
  const sumCards = [0, 1, 2].map(() => createRef<Rect>());
  const checks = [0, 1, 2].map(() => createRef<Txt>());

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
        <Rect ref={lsmFile} position={[-300, -120]} width={440} height={90} radius={12} fill={T.green} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'日志结构：压得紧实'} />
        </Rect>
        <Rect ref={btreePage} position={[300, -120]} width={440} height={90} radius={12} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt position={[0, -70]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'B 树页'} />
        </Rect>
        {[0, 1, 2].map(i => (
          <Rect
            key={`hole-${i}`}
            ref={holes[i]}
            position={[170 + i * 130, -120]}
            width={90}
            height={60}
            radius={8}
            fill={T.bg}
            stroke={T.red}
            lineWidth={2}
            opacity={0}
          />
        ))}
        <Txt ref={holeLab} position={[300, -40]} fontSize={SIZE.label} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'碎片：用不上的空洞'} opacity={0} />
        <Txt ref={rewriteLab} position={[0, 60]} fontSize={SIZE.body} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'定期重写去碎片，分层压缩更省'} opacity={0} />
        <Txt ref={funnelLab} position={[-300, -220]} fontSize={SIZE.body} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'▼ 压缩重写'} opacity={0} />
        {/* r6（P1）：漏斗 V 形（标下、框顶之间）+ 框下尺寸标 + 三层段排 */}
        <Line ref={funnelL} points={[[-380, -195], [-300, -168]]} stroke={T.yellow} lineWidth={3} opacity={0} />
        <Line ref={funnelR} points={[[-220, -195], [-300, -168]]} stroke={T.yellow} lineWidth={3} opacity={0} />
        <Txt ref={sizeLab} position={[-300, -48]} fontSize={SIZE.body} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'440'} opacity={0} />
        {[0, 1, 2].map(r => (
          <Txt key={`layer-lab-${r}`} ref={layerLabs[r]} position={[-470, 110 + r * 50]} fontSize={SIZE.label} fontWeight={700} fill={T.muted} fontFamily={FONT.sans} text={`层 ${r}`} opacity={0} />
        ))}
        {layerSegs.flatMap((row, r) =>
          row.map((seg, c) => (
            <Rect key={`layer-seg-${r}-${c}`} ref={seg} position={[-380 + c * 80, 110 + r * 50]} width={64} height={30} radius={8} fill={T.card} stroke={T.green} lineWidth={2} opacity={0} />
          )),
        )}
        <Txt ref={ignoreLab} position={[300, 20]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'B 树这边不管它'} opacity={0} />
        <Rect ref={fwBox} position={[0, -60]} width={700} height={200} radius={14} fill={T.card} stroke={T.purple} lineWidth={2} opacity={0}>
          <Txt position={[0, -72]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'固态硬盘固件'} />
        </Rect>
        <Line ref={fwIn} points={[[-480, -100], [-360, -60]]} stroke={T.red} lineWidth={3} endArrow opacity={0} />
        <Line ref={fwOut} points={[[360, -60], [480, -100]]} stroke={T.green} lineWidth={3} endArrow opacity={0} />
        <Txt ref={fwInLab} position={[-470, -150]} fontSize={SIZE.label} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'随机写进'} opacity={0} />
        <Txt ref={fwOutLab} position={[470, -150]} fontSize={SIZE.label} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'顺序写出'} opacity={0} />
        {/* r6（P2-3）：固件框内日志小示意——4 格从左到右顺序追加 + “顺序追加”标；框下定义小字 */}
        {[0, 1, 2, 3].map(i => (
          <Rect key={`log-${i}`} ref={logCells[i]} position={[-160 + i * 80, 0]} width={56} height={32} radius={8} fill={T.green} opacity={0} />
        ))}
        <Txt ref={logLab} position={[195, 0]} fontSize={SIZE.label} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'顺序追加'} opacity={0} />
        <Txt ref={fwDef} position={[0, 62]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'固件 = 硬盘里自带的小程序'} opacity={0} />
        <Rect ref={compactFile} position={[0, 130]} width={700} height={70} radius={12} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'数据更紧凑，同样带宽里请求更多'} />
        </Rect>
        {[0, 1, 2, 3].map(i => (
          <Circle
            key={`req-${i}`}
            ref={reqDots[i]}
            position={[-260 + i * 170, 200]}
            width={24}
            height={24}
            fill={T.green}
            opacity={0}
          />
        ))}
      </Node>

      {/* 第 2 页 */}
      <Node ref={p2} opacity={0}>
        <Rect ref={btreeCard} position={[-320, -60]} width={440} height={280} radius={14} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt position={[0, -115]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'B 树'} />
          <Rect ref={rootMini} position={[0, -70]} width={260} height={40} radius={8} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'根页：200–300'} />
          </Rect>
          <Rect ref={leafMini} position={[0, -20]} width={300} height={40} radius={8} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'叶页：251 在这里'} />
          </Rect>
          <Txt ref={oneKey} position={[0, 25]} fontSize={SIZE.body} fontWeight={700} fill={T.green} fontFamily={FONT.mono} text={'251 只出现一次'} opacity={0} />
          <Rect ref={rangeBox} position={[0, 75]} width={420} height={56} radius={10} fill={T.card} stroke={T.yellow} lineWidth={2} opacity={0}>
            <Txt position={[-100, 0]} fontSize={SIZE.label} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'键范围：200–300'} />
          </Rect>
        </Rect>
        {segKVs[0].node}
        {segKVs[1].node}
        {segKVs[2].node}
        <Txt ref={segNote} position={[320, 250]} fontSize={SIZE.label} fill={T.purple} fontFamily={FONT.sans} text={'换个例子：三段各一份'} opacity={0} />
        <Rect ref={lockBox} position={[-320, 130]} width={160} height={64} radius={32} fill={T.yellow} opacity={0}>
          <Txt fontSize={SIZE.label} fontWeight={700} fill={T.bg} fontFamily={FONT.sans} text={'锁，附在树上'} />
        </Rect>
        <Txt ref={lockWhyLab} position={[320, 200]} fontSize={SIZE.label} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'锁没处可挂：不知道挂哪一份'} opacity={0} />
      </Node>

      {/* 第 3 页 */}
      <Node ref={p3} opacity={0}>
        <Rect ref={bigTree} position={[-260, -80]} width={420} height={260} radius={14} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt position={[0, -100]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'B 树'} />
          <Txt position={[0, -40]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'根深蒂固，一直很好'} />
        </Rect>
        <Rect ref={sprout} position={[300, -40]} width={300} height={180} radius={14} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt position={[0, -55]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'日志结构'} />
          <Txt position={[0, 0]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'越来越流行'} />
        </Rect>
        <Txt ref={noRule} position={[0, 130]} fontSize={SIZE.body} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'没有快速简单的规则'} opacity={0} />
        {[0, 1, 2].map(i => (
          <Rect
            key={`sum-${i}`}
            ref={sumCards[i]}
            position={[-380 + i * 380, -40]}
            width={340}
            height={150}
            radius={14}
            fill={T.card}
            stroke={T.green}
            lineWidth={2}
            opacity={0}
          >
            <Txt position={[0, -35]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={['写放大', '读路径', '尾延迟'][i]} />
            <Txt ref={checks[i]} position={[0, 35]} fontSize={SIZE.body} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'✓ 算清了'} opacity={0} />
          </Rect>
        ))}
      </Node>
    </>
  );

  say('压得更紧，文件更小');
  yield* beat('e35a',
    all(p1().opacity(1, 0.5), lsmFile().opacity(1, 0.5), btreePage().opacity(1, 0.5),
      lsmFile().scale(1.02, beat.dur('e35a')), btreePage().scale(1.02, beat.dur('e35a'))),
  );

  say('碎片：用不上的空洞');
  yield* beat('e35b',
    at('剩用不上的空洞', chain(holes[0]().opacity(1, 0.4), holes[1]().opacity(1, 0.4), holes[2]().opacity(1, 0.4), holeLab().opacity(1, 0.5))),
  );

  say('定期重写去碎片');
  yield* beat('e35c',
    // r4（P2-14）：B 树页的三个红洞原样保留（不消失），重写动作只落在日志结构这边：漏斗落下，绿框文件变短。
    // r5（P2-12）：绿框随重写两步变短（440→300→220），“分层压缩”处再缩一步。
    // r6（P1）：两步变短要可辨认、带数字——框下尺寸标与每步同帧切换；漏斗 V 形；三层段排在“分层压缩”处出现、“一层层压”处依次下压。
    all(rewriteLab().opacity(1, 0.5), sizeLab().opacity(1, 0.5)),
    at('定期重写', all(funnelLab().opacity(1, 0.5), funnelL().opacity(1, 0.4), funnelR().opacity(1, 0.4),
      lsmFile().width(300, 1.5), sizeLab().text('300', 0), ignoreLab().opacity(1, 0.4))),
    at('分层压缩', all(chain(rewriteLab().scale(1.05, 1.0), rewriteLab().scale(1, 1.0)), lsmFile().width(220, 1.5),
      sizeLab().text('220', 0),
      layerLabs[0]().opacity(1, 0.4), layerLabs[1]().opacity(1, 0.4), layerLabs[2]().opacity(1, 0.4),
      ...layerSegs.flatMap(row => row.map(seg => seg().opacity(1, 0.4))))),
    // r6（P1）：下压时行标跟着自己的行走（层 0 标 110→150、层 1 标 160→180），压完仍与行对齐；层 2 不动。
    at('一层层压', chain(
      all(layerSegs[0][0]().position([-380, 150], 0.6), layerSegs[0][1]().position([-300, 150], 0.6), layerSegs[0][2]().position([-220, 150], 0.6),
        layerLabs[0]().position([-470, 150], 0.6)),
      all(layerSegs[1][0]().position([-380, 180], 0.6), layerSegs[1][1]().position([-300, 180], 0.6), layerSegs[1][2]().position([-220, 180], 0.6),
        layerLabs[1]().position([-470, 180], 0.6)),
    )),
  );

  say('固态盘内部也是日志结构');
  // r5（TTS 坏音频：e35d 原句 48 字录出 17.8s，句中 9.5 秒停顿）：拆成 e35d/e35d2、改写成短句重录，不原句重试。
  yield* beat('e35d',
    all(lsmFile().opacity(0, 0.4), btreePage().opacity(0, 0.4), rewriteLab().opacity(0, 0.4),
      holes[0]().opacity(0, 0.4), holes[1]().opacity(0, 0.4), holes[2]().opacity(0, 0.4),
      holeLab().opacity(0, 0.4), funnelLab().opacity(0, 0.4), ignoreLab().opacity(0, 0.4),
      // r6：e35c 新增元素一并淡出（尺寸标、漏斗 V 形、三层段排），不漏进 e35d/e35e。
      sizeLab().opacity(0, 0.4), funnelL().opacity(0, 0.4), funnelR().opacity(0, 0.4),
      layerLabs[0]().opacity(0, 0.4), layerLabs[1]().opacity(0, 0.4), layerLabs[2]().opacity(0, 0.4),
      ...layerSegs.flatMap(row => row.map(seg => seg().opacity(0, 0.4))),
      fwBox().opacity(1, 0.5), fwIn().opacity(1, 0.5), fwInLab().opacity(1, 0.4), fwBox().scale(1.02, beat.dur('e35d'))),
    // r6（P2-3）：固件框内日志小示意——4 格在“固件内部”处从左到右依次出现，旁标“顺序追加”；框下定义小字在“自带的小程序”处出现。
    at('固件内部', chain(logCells[0]().opacity(1, 0.35), logCells[1]().opacity(1, 0.35), logCells[2]().opacity(1, 0.35), logCells[3]().opacity(1, 0.35), logLab().opacity(1, 0.4))),
    at('自带的小程序', fwDef().opacity(1, 0.4)),
  );

  say('固态盘内部也是日志结构');
  yield* beat('e35d2',
    at('转成芯片上的顺序写', chain(fwOut().opacity(1, 0.5), fwOutLab().opacity(1, 0.4), fwBox().stroke(T.green, 0.8))),
  );

  say('更紧凑，带宽里请求更多');
  yield* beat('e35e',
    all(compactFile().opacity(1, 0.5), compactFile().scale(1.02, beat.dur('e35e'))),
    // r4（P2-15）：念到“写多少字节还是多少”时固件框脉冲，点出“仍然有优势”的原因在字节数上。
    at('写多少字节还是多少', chain(fwBox().scale(1.04, 0.5), fwBox().scale(1, 0.5))),
    at('本来要写的字节就少', chain(compactFile().scale(1.05, 0.5), compactFile().scale(1, 0.5))),
    at('同样带宽里能处理更多', chain(reqDots[0]().opacity(1, 0.4), reqDots[1]().opacity(1, 0.4), reqDots[2]().opacity(1, 0.4), reqDots[3]().opacity(1, 0.4))),
  );

  say('一键一处');
  yield* beat('e36a',
    all(p1().opacity(0, 0.5), p2().opacity(1, 0.5), btreeCard().opacity(1, 0.5), oneKey().opacity(1, 0.5)),
    at('只存在一处', chain(oneKey().scale(1.1, 0.6), oneKey().scale(1, 0.6))),
  );

  say('多处副本');
  yield* beat('e36b',
    // r5（P2-15）：换个例子——同一把键在三个段里各留一份。
    // r5-QA：e36b overrun 0.07s——4 步 chain 串行 1.6s 超出旁白：改并行 all，三段+注同时出现。
    at('好几个副本', all(segKVs[0].node.opacity(1, 0.4), segKVs[1].node.opacity(1, 0.4), segKVs[2].node.opacity(1, 0.4), segNote().opacity(1, 0.4))),
  );

  say('锁能附在树上');
  yield* beat('e36c',
    all(lockBox().opacity(1, 0.5)),
    // r5（P2-14）：卡里出小 B 树（根页→叶页）与黄色键范围框，锁落到范围框右侧（不盖范围标签）；r5-QA：删 ▼（挤在两框之间被边框压住）。
    at('直接挂在树上', all(
      rootMini().opacity(1, 0.4), leafMini().opacity(1, 0.4), rangeBox().opacity(1, 0.4),
      chain(lockBox().position([-210, 15], 0.8), btreeCard().stroke(T.yellow, 0.5)),
    )),
    at('没处可挂', chain(lockWhyLab().opacity(1, 0.5), lockBox().scale(1.08, 0.4), lockBox().scale(1, 0.4))),
  );

  say('B 树不会很快消失');
  yield* beat('e36d',
    all(p2().opacity(0, 0.5), p3().opacity(1, 0.5), bigTree().opacity(1, 0.5)),
    at('深深扎根', chain(bigTree().scale(1.05, 1.2), bigTree().scale(1, 1.2))),
    at('新的数据存储', chain(sprout().opacity(1, 0.5), sprout().scale(1.06, 1.2), sprout().scale(1, 1.2))),
  );

  say('三笔账算完，不再凭感觉');
  yield* beat('e36e',
    all(bigTree().opacity(0, 0.5), sprout().opacity(0, 0.5), noRule().opacity(1, 0.5), p3().scale(1.02, beat.dur('e36e'))),
    at('写放大', chain(sumCards[0]().opacity(1, 0.5), checks[0]().opacity(1, 0.4))),
    at('读路径', chain(sumCards[1]().opacity(1, 0.5), checks[1]().opacity(1, 0.4))),
    at('尾延迟', chain(sumCards[2]().opacity(1, 0.5), checks[2]().opacity(1, 0.4))),
  );
});
