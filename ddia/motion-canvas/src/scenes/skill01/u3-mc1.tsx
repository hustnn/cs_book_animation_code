// U3 场景 1（MC）：b1–b15 —— §1.3 硬件故障：每天坏一块盘、冗余、转向软件容错、滚动升级。
// 分镜：skill-ch01/ch01-beats.md U3 一节；原文：DDIA §1.3（书页 p7–8，PDF p29–30）。
// 时长全部来自 timeline/u3.json（beat() 驱动），不手写 waitFor 魔法数字。
// 颜色、字号、安全区一律取自 lib/theme，不手写十六进制色值。
// b5 旁白标点已改（冒号→逗号，TTS 原版在冒号后有 8 秒死寂，见 review）；b20 拆为 b20a/b20b。
import {Circle, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, chain, createRef, waitFor} from '@motion-canvas/core';
import {makeBeats} from '../../lib/beats';
import {FONT, SAFE, SIZE, T} from '../../lib/theme';
import timeline from '../../timeline/u3.json';

export default makeScene2D(function* (view) {
  view.fill(T.bg);
  const beat = makeBeats(timeline);

  const header = createRef<Txt>();
  const anchor = createRef<Txt>();

  // ---------- b1/b4：1 万块盘方阵（每格 = 50 块盘，20×10 = 200 格） ----------
  const grid = createRef<Node>();
  const redCells = [7, 53, 98, 141, 186].map(() => createRef<Rect>());
  const redCells2 = [23, 77, 122, 169].map(() => createRef<Rect>());
  const gridLabel = createRef<Txt>();
  const gridSub = createRef<Txt>();

  // ---------- b2：四种硬件故障 ----------
  const g2 = createRef<Node>();
  const faultCards = [0, 1, 2, 3].map(() => createRef<Node>());

  // ---------- b3：一块盘的寿命条 ----------
  const g3 = createRef<Node>();
  const lifeBar = createRef<Rect>();
  const lifeTag10 = createRef<Txt>();
  const lifeTag50 = createRef<Txt>();

  // ---------- b5：四种冗余手段 ----------
  const g5 = createRef<Node>();
  const redCards = [0, 1, 2, 3].map(() => createRef<Node>());

  // ---------- b6：主件变红，备件接管 ----------
  const g6 = createRef<Node>();
  const mainBox = createRef<Rect>();
  const spareBox = createRef<Rect>();
  const takeArrow = createRef<Line>();

  // ---------- b7：盾牌裂纹 ----------
  const g7 = createRef<Node>();
  const crack = createRef<Rect>();
  const yearsTag = createRef<Txt>();

  // ---------- b8：过去：单机 + 备份恢复 ----------
  const g8 = createRef<Node>();
  const backupDot = createRef<Circle>();

  // ---------- b9：多机冗余只给少数应用 ----------
  const g9 = createRef<Node>();
  const haTag = createRef<Txt>();

  // ---------- b10：机器翻倍，红点成比例变多 ----------
  const g10 = createRef<Node>();
  const row2 = createRef<Node>();
  const dots10 = [0, 1, 2, 3, 4, 5].map(() => createRef<Circle>());

  // ---------- b11：云实例突然消失 ----------
  const g11 = createRef<Node>();
  const vmNodes = [0, 1, 2, 3].map(() => createRef<Node>());
  const vmGone = vmNodes[2];
  const goneTag = createRef<Txt>();

  // ---------- b12：天平：梁 + 托盘在同一节点里，整体倾斜 ----------
  const g12 = createRef<Node>();
  const scale12 = createRef<Node>();

  // ---------- b13：整机被抽走，服务不中断 ----------
  const g13 = createRef<Node>();
  const machineOut = createRef<Node>();
  const svcLine = createRef<Line>();
  const svcOk = createRef<Txt>();

  // ---------- b14：滚动升级 ----------
  const g14 = createRef<Node>();
  const nodes14 = [0, 1, 2, 3].map(() => createRef<Rect>());
  const svc14 = createRef<Line>();

  // ---------- b15：单机打补丁要停机 ----------
  const g15 = createRef<Node>();
  const downSign = createRef<Node>();

  const say = (text: string) => anchor().text(text);

  view.add(
    <>
      <Txt
        ref={header}
        position={[-SAFE.halfW, -SAFE.halfH]}
        offset={[-1, -1]}
        fontSize={SIZE.label}
        fill={T.muted}
        fontFamily={FONT.sans}
        text={'第 1 章 · 故障从哪来'}
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

      {/* b1/b4：盘阵 */}
      <Node ref={grid} opacity={0}>
        <Txt ref={gridLabel} position={[0, -250]} fontSize={SIZE.body} fontWeight={700} fill={T.white} fontFamily={FONT.sans} text={'1 万块硬盘的集群'} />
        {Array.from({length: 200}, (_, i) => {
          const col = i % 20;
          const row = Math.floor(i / 20);
          return (
            <Rect
              key={`u3-grid-${i}`}
              position={[-513 + col * 54, -190 + row * 40]}
              width={36}
              height={24}
              radius={4}
              fill={T.blue}
              opacity={0.55}
            />
          );
        })}
        {[
          {i: 0, x: -513 + 7 * 54, y: -190},
          {i: 1, x: -513 + 13 * 54, y: -110},
          {i: 2, x: -513 + 18 * 54, y: -30},
          {i: 3, x: -513 + 1 * 54, y: 50},
          {i: 4, x: -513 + 6 * 54, y: 130},
        ].map(c => (
          <Rect key={`u3-red1-${c.i}`} ref={redCells[c.i]} position={[c.x, c.y]} width={36} height={24} radius={4} fill={T.red} opacity={0} />
        ))}
        {[
          {i: 0, x: -513 + 3 * 54, y: -150},
          {i: 1, x: -513 + 17 * 54, y: -70},
          {i: 2, x: -513 + 2 * 54, y: 10},
          {i: 3, x: -513 + 9 * 54, y: 90},
        ].map(c => (
          <Rect key={`u3-red2-${c.i}`} ref={redCells2[c.i]} position={[c.x, c.y]} width={36} height={24} radius={4} fill={T.red} opacity={0} />
        ))}
        <Txt ref={gridSub} position={[0, 210]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} opacity={0} text={'每格 = 50 块盘'} />
      </Node>

      {/* b2：四种硬件故障 */}
      <Node ref={g2} opacity={0}>
        {[
          {t: '硬盘 crash', d: '盘突然不转了'},
          {t: '内存坏', d: 'RAM 出错'},
          {t: '电网停电', d: '整排机器断电'},
          {t: '拔错网线', d: '人手一抖就断网'},
        ].map((c, i) => (
          <Node key={`u3-fault-${i}`} ref={faultCards[i]} opacity={0}>
            <Rect position={[-435 + i * 290, -40]} width={260} height={180} radius={16} fill={T.card} stroke={T.red} lineWidth={2} />
            <Txt position={[-435 + i * 290, -70]} fontSize={SIZE.body} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={c.t} />
            <Txt position={[-435 + i * 290, 0]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={c.d} />
          </Node>
        ))}
      </Node>

      {/* b3：一块盘的寿命条 10–50 年 */}
      <Node ref={g3} opacity={0}>
        <Txt position={[0, -160]} fontSize={SIZE.body} fontWeight={700} fill={T.white} fontFamily={FONT.sans} text={'一块硬盘的平均无故障时间'} />
        <Rect position={[0, -40]} width={920} height={40} radius={20} fill={T.card} stroke={T.line} lineWidth={2} />
        <Rect ref={lifeBar} position={[-460, -40]} offset={[-1, 0]} width={0} height={40} radius={20} fill={T.blue} />
        <Txt ref={lifeTag10} position={[-380, 40]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} opacity={0} text={'10 年'} />
        <Txt ref={lifeTag50} position={[380, 40]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} opacity={0} text={'50 年'} />
        <Txt position={[0, 110]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'MTTF：平均无故障时间'} />
      </Node>

      {/* b5：四种冗余手段 */}
      <Node ref={g5} opacity={0}>
        {[
          {t: 'RAID', d: '磁盘做阵列'},
          {t: '双电源', d: '一路断了还有一路'},
          {t: '热插拔 CPU', d: '不用关机就能换'},
          {t: '电池 + 柴油发电机', d: '数据中心备用电源'},
        ].map((c, i) => (
          <Node key={`u3-redun-${i}`} ref={redCards[i]} opacity={0}>
            <Rect position={[-435 + i * 290, -40]} width={260} height={180} radius={16} fill={T.card} stroke={T.green} lineWidth={2} />
            <Txt position={[-435 + i * 290, -70]} fontSize={SIZE.body} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={c.t} />
            <Txt position={[-435 + i * 290, 0]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={c.d} />
          </Node>
        ))}
      </Node>

      {/* b6：主件变红，备件接管 */}
      <Node ref={g6} opacity={0}>
        <Rect ref={mainBox} position={[-260, -40]} width={380} height={180} radius={16} fill={T.card} stroke={T.blue} lineWidth={3}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'主件'} />
        </Rect>
        <Line ref={takeArrow} points={[[-60, -40], [60, -40]]} stroke={T.green} lineWidth={4} endArrow opacity={0} />
        <Rect ref={spareBox} position={[260, -40]} width={380} height={180} radius={16} fill={T.card} stroke={T.green} lineWidth={3} opacity={0.35}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'冗余件'} />
        </Rect>
        <Txt position={[0, 120]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'坏件被换掉的时候，冗余件顶上去'} />
      </Node>

      {/* b7：盾牌裂纹 */}
      <Node ref={g7} opacity={0}>
        <Rect position={[0, -40]} width={340} height={340} radius={40} fill={T.card} stroke={T.green} lineWidth={4} />
        <Txt position={[0, -120]} fontSize={SIZE.title} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'冗余'} />
        <Rect ref={crack} position={[130, -20]} width={10} height={0} radius={5} fill={T.red} rotation={-18} />
        <Txt ref={yearsTag} position={[0, 170]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} opacity={0} text={'一台机器多年不间断地跑'} />
      </Node>

      {/* b8：过去：单机 + 备份恢复 */}
      <Node ref={g8} opacity={0}>
        <Txt position={[0, -220]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'过去很长一段时间'} />
        <Rect position={[-300, -40]} width={360} height={180} radius={16} fill={T.card} stroke={T.blue} lineWidth={3}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'单机'} />
        </Rect>
        <Rect position={[300, -40]} width={360} height={180} radius={16} fill={T.card} stroke={T.blue} lineWidth={3}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'新机器'} />
        </Rect>
        <Line points={[[-110, -40], [110, -40]]} stroke={T.line} lineWidth={3} endArrow />
        <Circle ref={backupDot} position={[-110, -40]} width={26} height={26} fill={T.yellow} />
        <Txt position={[0, 90]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'备份较快恢复到新机器'} />
      </Node>

      {/* b9：多机冗余只给少数应用 */}
      <Node ref={g9} opacity={0}>
        {['普通应用', '普通应用', '关键应用'].map((t, i) => (
          <Rect key={`u3-app-${i}`} position={[-360 + i * 360, -40]} width={300} height={170} radius={16} fill={T.card} stroke={T.line} lineWidth={2}>
            <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={t} />
          </Rect>
        ))}
        <Txt ref={haTag} position={[360, -160]} fontSize={SIZE.label} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} opacity={0} text={'高可用绝对必需'} />
      </Node>

      {/* b10：机器翻倍，红点成比例变多 */}
      <Node ref={g10} opacity={0}>
        <Txt position={[0, -230]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'机器越多，硬件故障越多'} />
        {[0, 1, 2, 3, 4, 5].map(i => (
          <Rect key={`u3-m10a-${i}`} position={[-450 + i * 180, -120]} width={130} height={90} radius={12} fill={T.card} stroke={T.blue} lineWidth={2} />
        ))}
        <Node ref={row2} opacity={0}>
          {[0, 1, 2, 3, 4, 5].map(i => (
            <Rect key={`u3-m10b-${i}`} position={[-450 + i * 180, 20]} width={130} height={90} radius={12} fill={T.card} stroke={T.blue} lineWidth={2} />
          ))}
        </Node>
        {[0, 1, 2, 3, 4, 5].map(i => (
          <Circle
            key={`u3-dot10-${i}`}
            ref={dots10[i]}
            position={[-450 + i * 180, i < 3 ? -120 : 20]}
            width={26}
            height={26}
            fill={T.red}
            opacity={0}
          />
        ))}
      </Node>

      {/* b11：云实例突然消失 */}
      <Node ref={g11} opacity={0}>
        <Txt position={[0, -230]} fontSize={SIZE.body} fontWeight={700} fill={T.white} fontFamily={FONT.sans} text={'AWS 虚拟机实例'} />
        {['实例 A', '实例 B', '实例 C', '实例 D'].map((t, i) => (
          <Node key={`u3-vm-${i}`} ref={vmNodes[i]} opacity={1}>
            <Rect position={[-435 + i * 290, -40]} width={240} height={160} radius={16} fill={T.card} stroke={T.blue} lineWidth={2} />
            <Txt position={[-435 + i * 290, -40]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={t} />
          </Node>
        ))}
        <Txt ref={goneTag} position={[145, -160]} fontSize={SIZE.label} fontWeight={700} fill={T.red} fontFamily={FONT.sans} opacity={0} text={'毫无预警，突然不可用'} />
      </Node>

      {/* b12：天平——r2 #1-2：梁与托盘在同一节点里整体旋转，不再脱节 */}
      <Node ref={g12} opacity={0}>
        <Node ref={scale12}>
          <Line points={[[-320, -40], [320, -40]]} stroke={T.text} lineWidth={5} />
          <Rect position={[-320, 30]} width={220} height={90} radius={12} fill={T.card} stroke={T.yellow} lineWidth={2}>
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'灵活 · 弹性'} />
          </Rect>
          <Rect position={[320, 30]} width={220} height={90} radius={12} fill={T.card} stroke={T.muted} lineWidth={2}>
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'单机可靠'} />
          </Rect>
        </Node>
        <Txt position={[0, 150]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'云平台优先灵活和弹性'} />
      </Node>

      {/* b13：整机被抽走，服务不中断 */}
      <Node ref={g13} opacity={0}>
        <Line ref={svcLine} points={[[-560, -190], [560, -190]]} stroke={T.green} lineWidth={5} />
        <Txt ref={svcOk} position={[0, -230]} fontSize={SIZE.label} fontWeight={700} fill={T.green} fontFamily={FONT.sans} opacity={0} text={'服务线不断'} />
        {['机器 1', '机器 3'].map((t, i) => (
          <Rect key={`u3-m13-${i}`} position={[-360 + i * 720, -40]} width={280} height={170} radius={16} fill={T.card} stroke={T.blue} lineWidth={2}>
            <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={t} />
          </Rect>
        ))}
        <Node ref={machineOut}>
          <Rect position={[0, -40]} width={280} height={170} radius={16} fill={T.card} stroke={T.red} lineWidth={3}>
            <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'机器 2'} />
          </Rect>
        </Node>
      </Node>

      {/* b14：滚动升级 */}
      <Node ref={g14} opacity={0}>
        <Line ref={svc14} points={[[-560, -190], [560, -190]]} stroke={T.green} lineWidth={5} />
        {[0, 1, 2, 3].map(i => (
          <Rect key={`u3-n14-${i}`} ref={nodes14[i]} position={[-435 + i * 290, -40]} width={240} height={170} radius={16} fill={T.card} stroke={T.blue} lineWidth={2}>
            <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={`节点 ${i + 1}`} />
          </Rect>
        ))}
        <Txt position={[0, 120]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'逐个节点打补丁，整个系统不用停机'} />
      </Node>

      {/* b15：单机打补丁要停机 */}
      <Node ref={g15} opacity={0}>
        <Rect position={[0, -40]} width={380} height={200} radius={16} fill={T.card} stroke={T.red} lineWidth={3}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'单机系统'} />
        </Rect>
        <Node ref={downSign} opacity={0}>
          <Rect position={[0, 130]} width={420} height={80} radius={12} fill={T.card} stroke={T.red} lineWidth={3}>
            <Txt fontSize={SIZE.body} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'计划停机'} />
          </Rect>
        </Node>
      </Node>
    </>,
  );

  // b1：钩子——一万块盘，每天坏一块。方阵淡入，红格在 8.5 秒里先后慢慢变红。
  say('每天坏一块盘');
  yield* beat(
    'b1',
    all(
      grid().opacity(1, 0.6),
      gridSub().opacity(1, 0.8),
      redCells[0]().opacity(1, 1.5),
      redCells[1]().opacity(1, 3.0),
      redCells[2]().opacity(1, 4.5),
      redCells[3]().opacity(1, 6.0),
      redCells[4]().opacity(1, 7.5),
    ),
  );

  // b2：四种硬件故障依次闪过（r2 #1-6：sequence(0) 是重叠跑不是串行，改 chain，每张 1.5s）
  say('硬盘、内存、停电、拔错线');
  yield* beat(
    'b2',
    chain(
      all(grid().opacity(0, 0.5), g2().opacity(1, 0.5)),
      faultCards[0]().opacity(1, 1.5),
      faultCards[1]().opacity(1, 1.5),
      faultCards[2]().opacity(1, 1.5),
      faultCards[3]().opacity(1, 1.5),
    ),
  );

  // b3：一块盘的寿命条慢慢拉到 10–50 年
  say('一块盘能用 10–50 年');
  yield* beat(
    'b3',
    all(
      g2().opacity(0, 0.5),
      g3().opacity(1, 0.6),
      lifeBar().width(920, 6.0),
      chain(waitFor(2.0), lifeTag10().opacity(1, 0.6)),
      chain(waitFor(5.0), lifeTag50().opacity(1, 0.6)),
    ),
  );

  // b4：回到方阵——红格继续出现，数量级的力量
  say('1 万块盘，每天坏 1 块');
  yield* beat(
    'b4',
    all(
      g3().opacity(0, 0.5),
      grid().opacity(1, 0.6),
      redCells2[0]().opacity(1, 1.5),
      redCells2[1]().opacity(1, 3.0),
      redCells2[2]().opacity(1, 4.5),
      redCells2[3]().opacity(1, 5.0),
    ),
  );

  // b5：四种冗余手段依次出现（r2 #1-6：改 chain，每张 1.5s）
  say('RAID · 双电源');
  yield* beat(
    'b5',
    chain(
      all(grid().opacity(0, 0.5), g5().opacity(1, 0.5)),
      redCards[0]().opacity(1, 1.5),
      redCards[1]().opacity(1, 1.5),
      redCards[2]().opacity(1, 1.5),
      redCards[3]().opacity(1, 1.5),
    ),
  );

  // b6：主件变红，备件亮起接管
  say('备件顶上去');
  yield* beat(
    'b6',
    all(
      g5().opacity(0, 0.5),
      g6().opacity(1, 0.6),
      mainBox().stroke(T.red, 1.2),
      chain(waitFor(1.2), all(spareBox().opacity(1, 0.6), takeArrow().opacity(1, 0.6))),
    ),
  );

  // b7：冗余不是万能——盾牌裂开一道缝，但机器照常跑多年
  say('冗余不是万能');
  yield* beat(
    'b7',
    all(
      g6().opacity(0, 0.5),
      g7().opacity(1, 0.6),
      crack().height(240, 6.0),
      chain(waitFor(5.5), yearsTag().opacity(1, 0.8)),
    ),
  );

  // b8：过去单机冗余就够了——备份恢复到新机器（r2 #1-6：往返改 chain 串行）
  say('过去单机冗余就够了');
  yield* beat(
    'b8',
    all(
      g7().opacity(0, 0.5),
      g8().opacity(1, 0.6),
      chain(backupDot().position([110, -40], 2.5), backupDot().position([-110, -40], 2.5)),
    ),
  );

  // b9：多机冗余只留给高可用绝对必需的少数应用
  say('多机冗余只给少数应用');
  yield* beat('b9', all(g8().opacity(0, 0.5), g9().opacity(1, 0.6), haTag().opacity(1, 1.5)));

  // b10：机器翻倍，红点成比例变多
  say('机器越多，故障越多');
  yield* beat(
    'b10',
    all(
      g9().opacity(0, 0.5),
      g10().opacity(1, 0.6),
      chain(waitFor(1.5), row2().opacity(1, 0.8)),
      chain(waitFor(2.5), all(dots10[0]().opacity(1, 0.5), dots10[1]().opacity(1, 0.5), dots10[2]().opacity(1, 0.5))),
      chain(waitFor(4.5), all(dots10[3]().opacity(1, 0.5), dots10[4]().opacity(1, 0.5), dots10[5]().opacity(1, 0.5))),
    ),
  );

  // b11：AWS 实例毫无预警突然不可用
  say('AWS 实例说没就没');
  yield* beat(
    'b11',
    all(
      g10().opacity(0, 0.5),
      g11().opacity(1, 0.6),
      chain(waitFor(2.5), all(vmGone().opacity(0, 0.8), goneTag().opacity(1, 0.8))),
    ),
  );

  // b12：天平向灵活/弹性一边倾斜（r2 #1-2：整体旋转，梁与托盘不再脱节）
  say('云优先弹性，不是单机可靠');
  yield* beat(
    'b12',
    all(g11().opacity(0, 0.5), g12().opacity(1, 0.6), scale12().rotation(-7, 3.0)),
  );

  // b13：整台机器被抽走，服务线不断（r2 #2-4：改向下移出，不再穿过服务线）
  say('整机丢掉，服务还在');
  yield* beat(
    'b13',
    all(
      g12().opacity(0, 0.5),
      g13().opacity(1, 0.6),
      chain(waitFor(1.0), machineOut().position([0, 320], 4.0)),
      chain(waitFor(1.0), machineOut().opacity(0, 4.0)),
      chain(waitFor(5.5), svcOk().opacity(1, 0.8)),
    ),
  );

  // b14：滚动升级——节点逐个变灰又亮起（r2 #1-6：改 chain 串行）
  say('滚动升级，不停机');
  yield* beat(
    'b14',
    all(
      g13().opacity(0, 0.5),
      g14().opacity(1, 0.6),
      chain(
        chain(nodes14[0]().opacity(0.25, 0.6), nodes14[0]().opacity(1, 0.6)),
        chain(nodes14[1]().opacity(0.25, 0.6), nodes14[1]().opacity(1, 0.6)),
        chain(nodes14[2]().opacity(0.25, 0.6), nodes14[2]().opacity(1, 0.6)),
        chain(nodes14[3]().opacity(0.25, 0.6), nodes14[3]().opacity(1, 0.6)),
      ),
    ),
  );

  // b15：单机打补丁要计划停机
  say('单机打补丁要停机');
  yield* beat('b15', all(g14().opacity(0, 0.5), g15().opacity(1, 0.6), downSign().opacity(1, 1.2)));
});
