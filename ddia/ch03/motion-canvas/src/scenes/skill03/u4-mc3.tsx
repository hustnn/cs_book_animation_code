// U4 场景 3（MC）：b20a–b25b —— 原地覆盖 vs 只追加、覆盖一页的硬件操作、分裂写一半崩溃
// 出孤儿页、预写日志先写后改、崩溃后用日志恢复、闩锁与后台原子换段。分镜：skill-ch03/beats-u4.md；
// 原文：DDIA §3.4（书页 p81–82，PDF p103–104）。时长全部来自 timeline/u4.json（beat() 驱动），不手写 waitFor。
import {Circle, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, chain, createRef} from '@motion-canvas/core';
import {at, makeBeats} from '../../lib/beats';
import {FONT, SAFE, SIZE, T} from '../../lib/theme';
import timeline from '../../timeline/u4.json';

export default makeScene2D(function* (view) {
  view.fill(T.bg);
  const beat = makeBeats(timeline);

  const header = createRef<Txt>();
  const anchor = createRef<Txt>();
  const say = (text: string) => anchor().text(text);

  // b20：原地覆盖 vs 只追加
  const g20 = createRef<Node>();
  const g20cover = createRef<Rect>();
  const g20old = createRef<Txt>();
  const g20new = createRef<Txt>();
  const g20append = createRef<Rect>();
  const g20segs = [0, 1, 2].map(() => createRef<Rect>());
  const g20pos = createRef<Txt>();
  const g20ref = createRef<Line>();
  // b21：硬盘 vs 固态
  const g21 = createRef<Node>();
  const g21platter = createRef<Circle>();
  const g21head = createRef<Circle>();
  const g21sector = createRef<Rect>();
  const g21chip = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(() => createRef<Rect>());
  const g21block = createRef<Rect>();
  // b22：一次写三页 / 孤儿页
  const g22 = createRef<Node>();
  const g22a = createRef<Rect>();
  const g22b = createRef<Rect>();
  const g22p = createRef<Rect>();
  const g22flash = createRef<Rect>();
  const g22orph1 = createRef<Txt>();
  const g22orph2 = createRef<Txt>();
  // b23/b24：预写日志
  const g23 = createRef<Node>();
  const g23log = createRef<Rect>();
  const g23e1 = createRef<Txt>();
  const g23e2 = createRef<Txt>();
  const g23redo = createRef<Txt>();
  const g23tree = createRef<Rect>();
  const g23arr = createRef<Line>();
  const g23chip = createRef<Circle>();
  const g23gray = createRef<Rect>();
  // b25：闩锁
  const g25 = createRef<Node>();
  const g25warn = createRef<Rect>();
  const g25t1 = createRef<Line>();
  const g25t2 = createRef<Line>();
  const g25d1 = createRef<Circle>();
  const g25d2 = createRef<Circle>();
  const g25x1 = createRef<Line>();
  const g25x2 = createRef<Line>();
  const g25bad = createRef<Txt>();
  const g25latch = createRef<Rect>();
  const g25old = createRef<Rect>();
  const g25new = createRef<Rect>();
  const g25swap = createRef<Txt>();
  const g25q = createRef<Circle>();

  view.add(
    <>
      <Txt
        ref={header}
        position={[-SAFE.halfW, -SAFE.halfH]}
        offset={[-1, -1]}
        fontSize={SIZE.label}
        fill={T.muted}
        fontFamily={FONT.sans}
        text={'B 树：把数据切成页'}
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

      {/* b20：原地覆盖 vs 只追加 */}
      <Node ref={g20} opacity={0}>
        <Rect ref={g20cover} position={[-290, -60]} width={400} height={180} radius={16} fill={T.card} stroke={T.yellow} lineWidth={3} opacity={0}>
          <Txt position={[0, -60]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'原地覆盖'} />
          <Txt ref={g20old} position={[0, 10]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.mono} text={'旧值'} opacity={0} />
          <Txt ref={g20new} position={[0, 10]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.mono} text={'新值'} opacity={0} />
          <Txt position={[0, 55]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'同一页，同一个位置'} />
        </Rect>
        <Rect ref={g20append} position={[290, -60]} width={400} height={180} radius={16} fill={T.card} stroke={T.blue} lineWidth={3} opacity={0}>
          <Txt position={[0, -60]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'只追加'} />
          {[0, 1, 2].map(i => (
            <Rect key={`g20s-${i}`} ref={g20segs[i]} position={[180 + i * 110, 20]} width={90} height={50} radius={8} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0} />
          ))}
          <Txt position={[0, 55]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'新内容写到文件尾'} />
        </Rect>
        <Txt ref={g20pos} position={[-290, 70]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} text={'位置不变'} opacity={0} />
        <Line ref={g20ref} points={[[-290, 95], [-290, 150]]} stroke={T.yellow} lineWidth={3} endArrow opacity={0} />
      </Node>

      {/* b21：硬盘 vs 固态 */}
      <Node ref={g21} opacity={0}>
        <Circle ref={g21platter} position={[-280, -60]} width={220} height={220} fill={T.card} stroke={T.line} lineWidth={3} opacity={0} />
        <Circle ref={g21head} position={[-280, -160]} width={26} height={26} fill={T.yellow} opacity={0} />
        <Rect ref={g21sector} position={[-180, -60]} width={60} height={36} radius={8} fill={T.yellow} opacity={0} />
        <Txt position={[-280, 90]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'机械硬盘'} />
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(i => (
          <Rect key={`g21c-${i}`} ref={g21chip[i]} position={[140 + (i % 4) * 90, -130 + Math.floor(i / 4) * 70]} width={76} height={56} radius={8} fill={T.card} stroke={T.line} lineWidth={2} opacity={0} />
        ))}
        <Rect ref={g21block} position={[185, -95]} width={166} height={126} radius={10} stroke={T.red} lineWidth={3} opacity={0} />
        <Txt position={[275, 90]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'固态硬盘'} />
      </Node>

      {/* b22：一次写三页 / 孤儿页 */}
      <Node ref={g22} opacity={0}>
        <Rect ref={g22a} position={[-380, -60]} width={220} height={110} radius={14} fill={T.card} stroke={T.line} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'叶页 A'} />
        </Rect>
        <Rect ref={g22b} position={[0, -60]} width={220} height={110} radius={14} fill={T.card} stroke={T.line} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'叶页 B'} />
        </Rect>
        <Rect ref={g22p} position={[380, -60]} width={220} height={110} radius={14} fill={T.card} stroke={T.line} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'父页'} />
        </Rect>
        <Rect ref={g22flash} width={1280} height={720} fill={T.white} opacity={0} />
        <Txt ref={g22orph1} position={[-420, 160]} fontSize={SIZE.label} fill={T.red} fontFamily={FONT.sans} text={'孤儿页'} opacity={0} />
        <Txt ref={g22orph2} position={[-40, 180]} fontSize={SIZE.label} fill={T.red} fontFamily={FONT.sans} text={'孤儿页'} opacity={0} />
      </Node>

      {/* b23/b24：预写日志 */}
      <Node ref={g23} opacity={0}>
        <Rect ref={g23log} position={[-320, -60]} width={400} height={220} radius={16} fill={T.card} stroke={T.green} lineWidth={3} opacity={0}>
          <Txt position={[0, -80]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'预写日志'} />
          <Txt ref={g23e1} position={[0, -10]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'改页：先记下来'} opacity={0} />
          <Txt ref={g23e2} position={[0, 35]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'改页：再记一条'} opacity={0} />
        </Rect>
        <Txt ref={g23redo} position={[-320, 90]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'也叫重做日志'} opacity={0} />
        <Rect ref={g23tree} position={[280, -60]} width={300} height={160} radius={16} fill={T.card} stroke={T.blue} lineWidth={3} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'树页'} />
        </Rect>
        <Line ref={g23arr} points={[[-120, -60], [130, -60]]} stroke={T.green} lineWidth={3} endArrow opacity={0} />
        <Circle ref={g23chip} position={[-120, -60]} width={24} height={24} fill={T.green} opacity={0} />
        <Rect ref={g23gray} position={[280, -60]} width={300} height={160} radius={16} fill={T.bg} opacity={0} />
      </Node>

      {/* b25：闩锁 */}
      <Node ref={g25} opacity={0}>
        <Rect ref={g25warn} position={[0, -200]} width={340} height={70} radius={12} fill={T.card} stroke={T.yellow} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.sans} text={'原地改页，小心并发'} />
        </Rect>
        <Line ref={g25t1} points={[[-480, 120], [-80, -60]]} stroke={T.blue} lineWidth={3} endArrow opacity={0} />
        <Line ref={g25t2} points={[[-480, 180], [-80, -20]]} stroke={T.purple} lineWidth={3} endArrow opacity={0} />
        <Circle ref={g25d1} position={[-480, 120]} width={22} height={22} fill={T.blue} opacity={0} />
        <Circle ref={g25d2} position={[-480, 180]} width={22} height={22} fill={T.purple} opacity={0} />
        <Line key={'qa-ignore-不一致打叉1'} ref={g25x1} points={[[180, -140], [380, 20]]} stroke={T.red} lineWidth={4} opacity={0} />
        <Line key={'qa-ignore-不一致打叉2'} ref={g25x2} points={[[380, -140], [180, 20]]} stroke={T.red} lineWidth={4} opacity={0} />
        <Txt ref={g25bad} position={[280, 70]} fontSize={SIZE.label} fill={T.red} fontFamily={FONT.sans} text={'不一致的树'} opacity={0} />
        <Rect ref={g25latch} position={[280, -60]} width={300} height={160} radius={16} fill={T.card} stroke={T.yellow} lineWidth={3} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'树页 + 闩锁'} />
        </Rect>
        <Rect ref={g25old} position={[-320, 120]} width={260} height={70} radius={12} fill={T.card} stroke={T.line} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'旧段'} />
        </Rect>
        <Rect ref={g25new} position={[-320, 120]} width={260} height={70} radius={12} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} text={'新段'} />
        </Rect>
        <Txt ref={g25swap} position={[-320, 190]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} text={'原子换段'} opacity={0} />
        <Circle ref={g25q} position={[-480, 120]} width={22} height={22} fill={T.yellow} opacity={0} />
      </Node>
    </>
  );

  say('原地覆盖页');
  yield* beat('b20a',
    all(g20().opacity(1, 0.5)),
    at('只追加', all(g20append().opacity(1, 0.5), g20segs[0]().opacity(1, 0.4), g20segs[1]().opacity(1, 0.4), g20segs[2]().opacity(1, 0.4))),
    at('原地覆盖', all(g20cover().opacity(1, 0.5), g20old().opacity(1, 0.4))),
    at('磁盘上的页', all(g20old().opacity(0, 0.4), g20new().opacity(1, 0.4))),
  );

  say('位置不变，引用有效');
  yield* beat('b20b',
    at('不改变页的位置', g20pos().opacity(1, 0.5)),
    at('引用才一直有效', all(g20ref().opacity(1, 0.5), g20ref().stroke(T.green, 0.4))),
  );

  say('磁头寻道再写');
  yield* beat('b21a',
    all(g20().opacity(0, 0.5), g21().opacity(1, 0.5)),
    at('移磁头', all(g21platter().opacity(1, 0.5), g21head().opacity(1, 0.4), g21head().position([-190, -60], 1.2))),
    at('等盘片转到位置', g21head().position([-280, -160], 1.0)),
    at('覆盖扇区', g21sector().opacity(1, 0.5)),
  );

  say('固态擦写大块');
  yield* beat('b21b',
    all(g21chip[0]().opacity(1, 0.2), g21chip[1]().opacity(1, 0.2), g21chip[2]().opacity(1, 0.2), g21chip[3]().opacity(1, 0.2), g21chip[4]().opacity(1, 0.2), g21chip[5]().opacity(1, 0.2), g21chip[6]().opacity(1, 0.2), g21chip[7]().opacity(1, 0.2), g21chip[8]().opacity(1, 0.2), g21chip[9]().opacity(1, 0.2), g21chip[10]().opacity(1, 0.2), g21chip[11]().opacity(1, 0.2)),
    at('擦除', all(g21block().opacity(1, 0.4), g21block().stroke(T.red, 0.4))),
    at('重写', g21block().stroke(T.green, 0.6)),
  );

  say('一次写三页');
  yield* beat('b22a',
    all(g21().opacity(0, 0.5), g22().opacity(1, 0.5)),
    at('分裂时', chain(g22a().opacity(1, 0.4), g22b().opacity(1, 0.4), g22p().opacity(1, 0.4))),
    at('父页', g22p().stroke(T.yellow, 0.4)),
  );

  say('孤儿页');
  yield* beat('b22b',
    at('断电', chain(g22flash().opacity(0.3, 0.15), all(g22flash().opacity(0, 0.4), g22p().opacity(0.4, 0.5)))),
    at('孤儿页', all(g22a().position([-420, 80], 1.0), g22b().position([-40, 120], 1.0), g22orph1().opacity(1, 0.5), g22orph2().opacity(1, 0.5))),
  );

  say('预写日志');
  yield* beat('b23a',
    all(g22().opacity(0, 0.5), g23().opacity(1, 0.5)),
    at('预写日志', all(g23log().opacity(1, 0.5), g23e1().opacity(1, 0.4), g23tree().opacity(1, 0.5))),
    at('重做日志', all(g23redo().opacity(1, 0.5), g23e2().opacity(1, 0.4))),
  );

  say('先写日志，再改页');
  yield* beat('b23b',
    at('先把这次修改写进', all(g23arr().opacity(1, 0.4), g23chip().opacity(1, 0.4))),
    at('再去改树的页', chain(g23chip().position([130, -60], 1.0), g23tree().stroke(T.green, 0.4))),
  );

  say('日志恢复树');
  yield* beat('b24',
    at('崩溃重启', all(g23gray().opacity(0.7, 0.5), g23chip().opacity(0, 0.3))),
    at('恢复到一致的状态', chain(g23e1().fill(T.green, 0.4), g23e2().fill(T.green, 0.4), g23gray().opacity(0, 0.6))),
  );

  say('还有个麻烦');
  yield* beat('b25a',
    all(g23().opacity(0, 0.5), g25().opacity(1, 0.5), g25warn().opacity(1, 0.5)),
  );

  say('多线程要小心');
  yield* beat('b25d',
    at('多个线程', all(g25t1().opacity(1, 0.4), g25t2().opacity(1, 0.4), g25d1().opacity(1, 0.4), g25d2().opacity(1, 0.4), g25d1().position([-80, -60], 1.4), g25d2().position([-80, -20], 1.4))),
    at('并发控制', g25latch().opacity(1, 0.5)),
  );

  say('会看到不一致的树');
  yield* beat('b25c',
    chain(g25x1().opacity(1, 0.6), g25x2().opacity(1, 0.6)),
    at('不一致的树', g25bad().opacity(1, 0.5)),
    g25latch().scale(1.02, beat.dur('b25c')),
  );

  say('闩锁护树');
  yield* beat('b25b',
    at('闩锁', g25latch().stroke(T.yellow, 0.4)),
    at('合并在后台做', all(g25old().opacity(1, 0.5), g25swap().opacity(1, 0.5))),
    at('原子地换段', all(g25old().opacity(0, 0.5), g25new().opacity(1, 0.5))),
    at('不干扰正在查的请求', chain(g25q().opacity(1, 0.3), g25q().position([280, -60], 2.0))),
    g25latch().scale(1.02, beat.dur('b25b')),
  );
});
