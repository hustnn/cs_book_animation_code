// U4 场景 1（MC）：b1–b12 —— 钩子、争论回溯、IMS、层次树 vs JSON、
// 两条路、CODASYL、多父节点、指针、访问路径。
// 分镜：skill-ch02/beats-u4.md U4 一节；原文：DDIA §2.5（书页 p36–37，PDF p58–59）。
// 时长全部来自 timeline/u4.json（beat() 驱动），不手写 waitFor。
// 颜色、字号、安全区一律取自 lib/theme，不手写十六进制色值。
import {Circle, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, chain, createRef, waitFor} from '@motion-canvas/core';
import {at, makeBeats} from '../../lib/beats';
import {FONT, SAFE, SIZE, T} from '../../lib/theme';
import timeline from '../../timeline/u4.json';

export default makeScene2D(function* (view) {
  view.fill(T.bg);
  const beat = makeBeats(timeline);

  const header = createRef<Txt>();
  const anchor = createRef<Txt>();
  const say = (text: string) => anchor().text(text);

  const g1 = createRef<Node>();
  const g1old = createRef<Rect>();
  const g1new = createRef<Rect>();
  const g1q = createRef<Txt>();
  const g2 = createRef<Node>();
  const g2line = createRef<Line>();
  const g2today = createRef<Circle>();
  const g2old = createRef<Circle>();
  const g2tag = createRef<Txt>();
  const g3 = createRef<Node>();
  const g3box = createRef<Rect>();
  const g3title = createRef<Txt>();
  const g3sub1 = createRef<Txt>();
  const g3sub2 = createRef<Txt>();
  const g3year = createRef<Txt>();
  const g3apollo = createRef<Txt>();
  const g3today = createRef<Txt>();
  const g4 = createRef<Node>();
  const g4root = createRef<Rect>();
  const g4kids = [0, 1, 2].map(() => createRef<Node>());
  const g4tag = createRef<Txt>();
  const g5 = createRef<Node>();
  const g5tree = createRef<Node>();
  const g5json = createRef<Rect>();
  const g5x = createRef<Txt>();
  const g5tag = createRef<Txt>();
  const g6 = createRef<Node>();
  const g6copy = createRef<Node>();
  const g6manual = createRef<Node>();
  const g7 = createRef<Node>();
  const g7rel = createRef<Rect>();
  const g7net = createRef<Rect>();
  const g7vs = createRef<Txt>();
  const g7tag = createRef<Txt>();
  const g8 = createRef<Node>();
  const g8tree = createRef<Rect>();
  const g8net = createRef<Rect>();
  const g8stamp = createRef<Txt>();
  const g9 = createRef<Node>();
  const g9pa = createRef<Rect>();
  const g9pb = createRef<Rect>();
  const g9kid = createRef<Rect>();
  const g9l1 = createRef<Line>();
  const g9l2 = createRef<Line>();
  const g10 = createRef<Node>();
  const g10hub = createRef<Rect>();
  const g10users = [0, 1, 2].map(() => createRef<Rect>());
  const g10lines = [0, 1, 2].map(() => createRef<Line>());
  const g11 = createRef<Node>();
  const g11a = createRef<Rect>();
  const g11b = createRef<Rect>();
  const g11ptr = createRef<Line>();
  const g11lab = createRef<Txt>();
  const g11disk = createRef<Rect>();
  const g12 = createRef<Node>();
  const g12nodes = [0, 1, 2, 3, 4].map(() => createRef<Rect>());
  const g12segs = [0, 1, 2, 3].map(() => createRef<Line>());
  const g12dot = createRef<Circle>();
  const g12lab = createRef<Txt>();

  view.add(
    <>
      <Txt
        ref={header}
        position={[-SAFE.halfW, -SAFE.halfH]}
        offset={[-1, -1]}
        fontSize={SIZE.label}
        fill={T.muted}
        fontFamily={FONT.sans}
        text={'历史重演'}
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

      {/* b1：1970 年代 vs 今天的文档库 */}
      <Node ref={g1} opacity={0}>
        <Rect ref={g1old} position={[-300, -40]} width={380} height={260} radius={16} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt position={[0, -60]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'1970 年代'} />
          <Txt position={[0, 20]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'层次模型 · 网状模型'} />
        </Rect>
        <Rect ref={g1new} position={[300, -40]} width={380} height={260} radius={16} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt position={[0, -60]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'今天的文档库'} />
          <Txt position={[0, 20]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'嵌套的 JSON 文档'} />
        </Rect>
        <Txt ref={g1q} position={[0, -40]} fontSize={72} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'?'} opacity={0} />
      </Node>

      {/* b2：时间线回溯 */}
      <Node ref={g2} opacity={0}>
        <Line ref={g2line} points={[[-500, -40], [500, -40]]} stroke={T.line} lineWidth={3} />
        <Circle ref={g2today} position={[400, -40]} width={28} height={28} fill={T.green} opacity={0} />
        <Txt position={[400, 30]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'今天'} />
        <Circle ref={g2old} position={[-400, -40]} width={28} height={28} fill={T.yellow} opacity={0} />
        <Txt position={[-400, 30]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'1970 年代'} />
        <Txt ref={g2tag} position={[0, -160]} fontSize={SIZE.title} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'一场更老的争论'} opacity={0} />
      </Node>

      {/* b3：IMS 大型机 */}
      <Node ref={g3} opacity={0}>
        <Rect ref={g3box} position={[0, -60]} width={720} height={300} radius={20} fill={T.card} stroke={T.blue} lineWidth={2}>
          <Txt ref={g3title} position={[0, -90]} fontSize={SIZE.title} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'IBM IMS'} opacity={0} />
          <Txt ref={g3sub1} position={[0, -20]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'业务数据处理 · 大型机'} opacity={0} />
          <Txt ref={g3sub2} position={[0, 40]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'为阿波罗计划做库存管理'} opacity={0} />
        </Rect>
        <Txt ref={g3year} position={[-260, 150]} fontSize={SIZE.title} fontWeight={700} fill={T.yellow} fontFamily={FONT.mono} text={'1968 年'} opacity={0} />
        <Txt ref={g3apollo} position={[140, 150]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'第一次商用'} opacity={0} />
        <Txt ref={g3today} position={[0, 220]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} text={'今天还在大型机上跑'} opacity={0} />
      </Node>

      {/* b4：层次树 */}
      <Node ref={g4} opacity={0}>
        <Rect ref={g4root} position={[0, -220]} width={260} height={80} radius={14} fill={T.card} stroke={T.blue} lineWidth={3}>
          <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'根记录'} />
        </Rect>
        {[0, 1, 2].map(i => (
          <Node key={`g4k-${i}`} ref={g4kids[i]} opacity={0}>
            <Line points={[[0, -180], [-320 + i * 320, -110]]} stroke={T.line} lineWidth={2} />
            <Rect position={[-320 + i * 320, -60]} width={220} height={70} radius={12} fill={T.card} stroke={T.blue} lineWidth={2}>
              <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={['子记录 1', '子记录 2', '子记录 3'][i]} />
            </Rect>
            <Rect position={[-320 + i * 320, 60]} width={180} height={54} radius={10} fill={T.card} stroke={T.line} lineWidth={2}>
              <Txt fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'孙记录'} />
            </Rect>
            <Line points={[[-320 + i * 320, -25], [-320 + i * 320, 33]]} stroke={T.line} lineWidth={2} />
          </Node>
        ))}
        <Txt ref={g4tag} position={[0, 170]} fontSize={SIZE.title} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'记录嵌套记录的树'} opacity={0} />
      </Node>

      {/* b5：层次树 vs JSON 树 */}
      <Node ref={g5} opacity={0}>
        <Node ref={g5tree}>
          <Rect position={[-420, -160]} width={220} height={70} radius={12} fill={T.card} stroke={T.blue} lineWidth={2}>
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'根记录'} />
          </Rect>
          <Line points={[[-420, -125], [-500, -60]]} stroke={T.line} lineWidth={2} />
          <Line points={[[-420, -125], [-340, -60]]} stroke={T.line} lineWidth={2} />
          <Rect position={[-500, -20]} width={160} height={56} radius={10} fill={T.card} stroke={T.blue} lineWidth={2}>
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'子记录'} />
          </Rect>
          <Rect position={[-340, -20]} width={160} height={56} radius={10} fill={T.card} stroke={T.blue} lineWidth={2}>
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'子记录'} />
          </Rect>
          <Txt position={[-420, 90]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'层次模型'} />
        </Node>
        <Rect ref={g5json} position={[320, -80]} width={420} height={280} radius={16} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt position={[0, -100]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.mono} text={'{'} />
          <Txt position={[0, -50]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'"positions": [ … ]'} />
          <Txt position={[0, 0]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'"education": [ … ]'} />
          <Txt position={[0, 50]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'"contact_info": { … }'} />
          <Txt position={[0, 100]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.mono} text={'}'} />
        </Rect>
        <Txt ref={g5x} position={[0, -80]} fontSize={64} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'✗'} opacity={0} />
        <Txt ref={g5tag} position={[0, 150]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'多对多困难 · 不支持 join'} opacity={0} />
      </Node>

      {/* b6：复制 vs 手动解析 */}
      <Node ref={g6} opacity={0}>
        <Node ref={g6copy} opacity={0}>
          <Rect position={[-300, -80]} width={360} height={200} radius={16} fill={T.card} stroke={T.yellow} lineWidth={2}>
            <Txt position={[0, -50]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'复制一份数据'} />
            <Txt position={[0, 30]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'反规范化'} />
          </Rect>
          <Rect position={[-300, 130]} width={200} height={60} radius={10} fill={T.card} stroke={T.yellow} lineWidth={2}>
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'副本'} />
          </Rect>
        </Node>
        <Node ref={g6manual} opacity={0}>
          <Rect position={[300, -80]} width={360} height={200} radius={16} fill={T.card} stroke={T.purple} lineWidth={2}>
            <Txt position={[0, -50]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'手动解析引用'} />
            <Txt position={[0, 30]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'自己去找'} />
          </Rect>
          <Txt position={[300, 130]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'一条记录一条记录地找'} />
        </Node>
      </Node>

      {/* b7：两条路分叉 */}
      <Node ref={g7} opacity={0}>
        <Rect ref={g7rel} position={[-280, 0]} width={380} height={220} radius={16} fill={T.card} stroke={T.green} lineWidth={3} opacity={0}>
          <Txt position={[0, -40]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'关系模型'} />
          <Txt position={[0, 40]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} text={'通向今天'} />
        </Rect>
        <Rect ref={g7net} position={[280, 0]} width={380} height={220} radius={16} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt position={[0, -40]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'网状模型'} />
          <Txt position={[0, 40]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'起初追随者众多'} />
        </Rect>
        <Txt ref={g7vs} position={[0, -40]} fontSize={64} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'VS'} opacity={0} />
        <Txt ref={g7tag} position={[0, 150]} fontSize={SIZE.title} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'大辩论'} opacity={0} />
      </Node>

      {/* b8：CODASYL */}
      <Node ref={g8} opacity={0}>
        <Rect ref={g8tree} position={[0, -60]} width={420} height={200} radius={16} fill={T.card} stroke={T.blue} lineWidth={2}>
          <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'层次模型'} />
        </Rect>
        <Rect ref={g8net} position={[0, -60]} width={420} height={200} radius={16} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'网状模型'} />
        </Rect>
        <Txt ref={g8stamp} position={[0, 90]} fontSize={SIZE.title} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'CODASYL'} opacity={0} />
      </Node>

      {/* b9：一个父节点 → 多个父节点 */}
      <Node ref={g9} opacity={0}>
        <Rect ref={g9pa} position={[-320, -180]} width={220} height={80} radius={12} fill={T.card} stroke={T.blue} lineWidth={2}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'父节点 A'} />
        </Rect>
        <Rect ref={g9pb} position={[320, -180]} width={220} height={80} radius={12} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'父节点 B'} />
        </Rect>
        <Rect ref={g9kid} position={[0, 80]} width={220} height={80} radius={12} fill={T.card} stroke={T.yellow} lineWidth={3}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'一条记录'} />
        </Rect>
        <Line ref={g9l1} points={[[-320, -140], [0, 40]]} stroke={T.blue} lineWidth={3} opacity={0} />
        <Line ref={g9l2} points={[[320, -140], [0, 40]]} stroke={T.green} lineWidth={3} opacity={0} />
      </Node>

      {/* b10：大西雅图地区 */}
      <Node ref={g10} opacity={0}>
        <Rect ref={g10hub} position={[0, -120]} width={340} height={100} radius={14} fill={T.card} stroke={T.yellow} lineWidth={3}>
          <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'大西雅图地区'} />
        </Rect>
        {[0, 1, 2].map(i => (
          <Line key={`g10l-${i}`} ref={g10lines[i]} points={[[-360 + i * 360, 130], [0, -70]]} stroke={T.blue} lineWidth={2} opacity={0} />
        ))}
        {[0, 1, 2].map(i => (
          <Rect key={`g10u-${i}`} ref={g10users[i]} position={[-360 + i * 360, 180]} width={200} height={80} radius={12} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={['用户 1', '用户 2', '用户 3'][i]} />
          </Rect>
        ))}
      </Node>

      {/* b11a/b11b：指针 + 磁盘 */}
      <Node ref={g11} opacity={0}>
        <Rect ref={g11a} position={[-320, -60]} width={260} height={110} radius={14} fill={T.card} stroke={T.blue} lineWidth={2}>
          <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'记录 A'} />
        </Rect>
        <Rect ref={g11b} position={[320, -60]} width={260} height={110} radius={14} fill={T.card} stroke={T.blue} lineWidth={2}>
          <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'记录 B'} />
        </Rect>
        <Line ref={g11ptr} points={[[-190, -60], [190, -60]]} stroke={T.yellow} lineWidth={3} opacity={0} />
        <Txt ref={g11lab} position={[0, -140]} fontSize={SIZE.label} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'指针'} opacity={0} />
        <Rect ref={g11disk} position={[0, 130]} width={340} height={90} radius={12} fill={T.card} stroke={T.line} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'存在磁盘上'} />
        </Rect>
      </Node>

      {/* b12：沿指针链走 */}
      <Node ref={g12} opacity={0}>
        {[0, 1, 2, 3].map(i => (
          <Line key={`g12s-${i}`} ref={g12segs[i]} points={[[-330 + i * 190, -40], [-210 + i * 190, -40]]} stroke={T.line} lineWidth={3} opacity={0} />
        ))}
        {[0, 1, 2, 3, 4].map(i => (
          <Rect key={`g12n-${i}`} ref={g12nodes[i]} position={[-400 + i * 200, -40]} width={130} height={90} radius={12} fill={T.card} stroke={T.blue} lineWidth={2}>
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={['根记录', '记录 2', '记录 3', '记录 4', '目标'][i]} />
          </Rect>
        ))}
        <Circle ref={g12dot} position={[-400, -40]} width={30} height={30} fill={T.yellow} opacity={0} />
        <Txt ref={g12lab} position={[0, 120]} fontSize={SIZE.title} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'访问路径'} opacity={0} />
      </Node>
    </>
  );

  say('1970 年代的错误？');
  yield* beat('b1',
    all(g1().opacity(1, 0.5)),
    at('1970 年代', g1old().opacity(1, 0.4)),
    at('文档库', g1new().opacity(1, 0.4)),
    at('错误', g1q().opacity(1, 0.4)),
  );

  say('争论比 NoSQL 更老');
  yield* beat('b2',
    all(g1().opacity(0, 0.5), g2().opacity(1, 0.5)),
    at('NoSQL', g2today().opacity(1, 0.4)),
    at('最早的', chain(g2old().opacity(1, 0.4), g2tag().opacity(1, 0.5))),
  );

  say('1968 年，阿波罗计划');
  yield* beat('b3',
    all(g2().opacity(0, 0.5), g3().opacity(1, 0.5)),
    at('业务数据处理', g3sub1().opacity(1, 0.5)),
    at('IMS', g3title().opacity(1, 0.5)),
    at('阿波罗计划', chain(g3sub2().opacity(1, 0.5), g3apollo().opacity(1, 0.5))),
    at('1968 年', g3year().opacity(1, 0.5)),
    at('今天还', g3today().opacity(1, 0.5)),
  );

  say('记录嵌套记录的树');
  yield* beat('b4',
    all(g3().opacity(0, 0.5), g4().opacity(1, 0.5)),
    at('层次模型', g4root().opacity(1, 0.5)),
    at('记录嵌套记录', chain(g4kids[0]().opacity(1, 0.5), g4kids[1]().opacity(1, 0.5), g4kids[2]().opacity(1, 0.5))),
    at('树', g4tag().opacity(1, 0.4)),
  );

  say('像 JSON 的树');
  yield* beat('b5',
    all(g4().opacity(0, 0.5), g5().opacity(1, 0.5)),
    at('JSON', g5json().opacity(1, 0.5)),
    at('多对多', g5x().opacity(1, 0.4)),
    at('join', g5tag().opacity(1, 0.4)),
  );

  say('复制，还是手动解析');
  yield* beat('b6',
    all(g5().opacity(0, 0.5), g6().opacity(1, 0.5)),
    at('复制一份', g6copy().opacity(1, 0.5)),
    at('手动去解析引用', g6manual().opacity(1, 0.5)),
  );

  say('两条路，大辩论');
  yield* beat('b7',
    // r2：两张卡随拍首淡入 + 滑入就位（r1 里等词点出现，拍首约 2.5s 空屏）；“大辩论”标签仍跟词点
    all(g6().opacity(0, 0.5), g7().opacity(1, 0.5), g7rel().position([-280, -40], 0.8), g7net().position([280, -40], 0.8), g7rel().opacity(1, 0.5), g7net().opacity(1, 0.5)),
    at('两个最有名的方案', g7vs().opacity(1, 0.4)),
    at('大辩论', g7tag().opacity(1, 0.5)),
  );

  say('CODASYL 模型');
  yield* beat('b8',
    all(g7().opacity(0, 0.5), g8().opacity(1, 0.5)),
    at('CODASYL', chain(g8tree().opacity(0, 0.4), g8net().opacity(1, 0.5), g8stamp().opacity(1, 0.5))),
    at('推广', g8net().lineWidth(4, 0.4)),
  );

  say('一个父节点，多个父节点');
  yield* beat('b9',
    all(g8().opacity(0, 0.5), g9().opacity(1, 0.5)),
    at('恰好一个父节点', g9l1().opacity(1, 0.5)),
    at('多个父节点', chain(g9pb().opacity(1, 0.5), g9l2().opacity(1, 0.5))),
  );

  say('一条记录，多人共用');
  yield* beat('b10',
    all(g9().opacity(0, 0.5), g10().opacity(1, 0.5)),
    at('大西雅图地区', g10hub().opacity(1, 0.5)),
    at('所有住那里的用户', chain(g10users[0]().opacity(1, 0.4), g10lines[0]().opacity(1, 0.4), g10users[1]().opacity(1, 0.4), g10lines[1]().opacity(1, 0.4), g10users[2]().opacity(1, 0.4), g10lines[2]().opacity(1, 0.4))),
    at('多对一', waitFor(0.01)),
  );

  say('链接是像指针的东西');
  yield* beat('b11a',
    all(g10().opacity(0, 0.5), g11().opacity(1, 0.5)),
    at('不是外键', g11ptr().opacity(0.25, 0.4)),
    at('指针', all(g11ptr().opacity(1, 0.5), g11lab().opacity(1, 0.4))),
  );

  say('存在磁盘上');
  yield* beat('b11b',
    all(g11disk().opacity(1, 0.5)),
  );

  say('访问路径');
  yield* beat('b12',
    all(g11().opacity(0, 0.5), g12().opacity(1, 0.5)),
    at('根记录', g12dot().opacity(1, 0.3)),
    at('沿着链接链', chain(g12segs[0]().opacity(1, 0.3), g12dot().position([-200, -40], 0.35))),
    at('一步步', chain(
      g12segs[1]().opacity(1, 0.3), g12dot().position([0, -40], 0.35),
      g12segs[2]().opacity(1, 0.3), g12dot().position([200, -40], 0.35),
      g12segs[3]().opacity(1, 0.3), g12dot().position([317, -40], 0.35),
    )),
    at('访问路径', g12lab().opacity(1, 0.4)),
  );
});
