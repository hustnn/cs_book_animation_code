// U4 场景 2（MC）：b14–b25 —— fan-out 定义、做法 1（读时组装 + SQL + Figure 1-2）、
// 做法 2（写时扇出）、Twitter 从做法 1 切换到做法 2。
// 分镜：skill-ch01/ch01-beats.md U4 一节；原文：DDIA §1.8（书页 p11–12，PDF p33–34）。
// Figure 1-2 的表值按原图复现：follows（17055506 → 12）、users（12 / jack / 1234567.jpg）、
// tweets（20 / 12 / just setting up my twttr / 1142974214）。
// 时长全部来自 timeline/u4.json（beat() 驱动），不手写 waitFor 魔法数字。
// 动画排序用 sequence()（先后步骤），不用 chain(waitFor()) 堆字面等待。
import {Circle, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, sequence} from '@motion-canvas/core';
import {makeBeats} from '../../lib/beats';
import {FONT, SAFE, SIZE, T} from '../../lib/theme';
import timeline from '../../timeline/u4.json';

export default makeScene2D(function* (view) {
  view.fill(T.bg);
  const beat = makeBeats(timeline);

  const header = createRef<Txt>();
  const anchor = createRef<Txt>();
  const g14 = createRef<Node>();
  const fanDots = [0, 1, 2, 3, 4].map(() => createRef<Circle>());
  const g15 = createRef<Node>();
  const out15 = [0, 1, 2].map(() => createRef<Rect>());
  const g16 = createRef<Node>();
  const outArrows = [0, 1, 2].map(() => createRef<Line>());
  const g17 = createRef<Node>();
  const tweet17 = createRef<Rect>();
  const g18 = createRef<Node>();
  const step18 = [0, 1, 2].map(() => createRef<Node>());
  const tl18 = createRef<Node>();
  const g19 = createRef<Node>();
  const hl19 = createRef<Rect>();
  const g20 = createRef<Node>();
  const followsTbl = createRef<Node>();
  const tweetsTbl = createRef<Node>();
  const usersTbl = createRef<Node>();
  const g21 = createRef<Node>();
  const rowHl = createRef<Rect>();
  const arrowA1 = createRef<Line>();
  const arrowA2 = createRef<Line>();
  const arrowA3 = createRef<Line>();
  const tsTag = createRef<Txt>();
  const g22 = createRef<Node>();
  const g22Title = createRef<Txt>();
  const mb22 = [0, 1, 2].map(() => createRef<Node>());
  const g23 = createRef<Node>();
  const copies23 = [0, 1, 2].map(() => createRef<Rect>());
  const g24 = createRef<Node>();
  const readArrows = [0, 1, 2].map(() => createRef<Line>());
  const g25 = createRef<Node>();
  const v1box = createRef<Node>();
  const pile25 = [0, 1, 2, 3].map(() => createRef<Line>());
  const failTag = createRef<Txt>();
  const v2box = createRef<Node>();

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
        text={'第 1 章 · 负载——Twitter 时间线'}
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

      {/* b14：fan-out——一个点向许多点发箭头 */}
      <Node ref={g14} opacity={0}>
        <Circle position={[-380, -40]} width={70} height={70} fill={T.blue} />
        <Txt position={[-380, -40]} fontSize={SIZE.label} fill={T.bg} fontFamily={FONT.sans} text={'1'} />
        {[
          [180, -200],
          [180, -120],
          [180, -40],
          [180, 40],
          [180, 120],
        ].map((p, i) => (
          <Circle key={`u4-fan-${i}`} ref={fanDots[i]} position={[p[0], p[1]]} width={54} height={54} fill={T.green} opacity={0} />
        ))}
        <Line points={[[-340, -40], [150, -200]]} stroke={T.line} lineWidth={3} endArrow />
        <Line points={[[-340, -40], [150, -40]]} stroke={T.line} lineWidth={3} endArrow />
        <Line points={[[-340, -40], [150, 120]]} stroke={T.line} lineWidth={3} endArrow />
        <Txt position={[0, 200]} fontSize={SIZE.title} fontWeight={700} fill={T.white} fontFamily={FONT.serif} text={'fan-out 扇出'} />
      </Node>

      {/* b15：逻辑门——一个输出驱动多个输入（三个输入框依次出现） */}
      <Node ref={g15} opacity={0}>
        <Rect position={[-140, -40]} width={180} height={140} radius={12} fill={T.card} stroke={T.yellow} lineWidth={3}>
          <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'逻辑门'} />
        </Rect>
        <Line points={[[-380, -40], [-230, -40]]} stroke={T.line} lineWidth={3} endArrow />
        <Txt position={[-380, -100]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'输出'} />
        {[0, 1, 2].map(i => (
          <Rect key={`u4-gate-${i}`} ref={out15[i]} position={[330, -160 + i * 120]} width={90} height={90} radius={12} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0} />
        ))}
        <Line points={[[-50, -40], [285, -160]]} stroke={T.line} lineWidth={3} endArrow />
        <Line points={[[-50, -40], [285, -40]]} stroke={T.line} lineWidth={3} endArrow />
        <Line points={[[-50, -40], [285, 80]]} stroke={T.line} lineWidth={3} endArrow />
        <Txt position={[330, 170]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'多个输入'} />
      </Node>

      {/* b16：一个入请求分叉成多个出请求 */}
      <Node ref={g16} opacity={0}>
        <Rect position={[-420, -40]} width={200} height={110} radius={12} fill={T.card} stroke={T.blue} lineWidth={2}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'1 个入请求'} />
        </Rect>
        {[0, 1, 2].map(i => (
          <Rect key={`u4-svc-${i}`} position={[330, -160 + i * 120]} width={220} height={90} radius={12} fill={T.card} stroke={T.green} lineWidth={2}>
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'其他服务'} />
          </Rect>
        ))}
        {[0, 1, 2].map(i => (
          <Line
            key={`u4-out-${i}`}
            ref={outArrows[i]}
            points={[[-320, -40], [220, -160 + i * 120]]}
            stroke={T.green}
            lineWidth={3}
            endArrow
            opacity={0}
          />
        ))}
      </Node>

      {/* b17：做法 1——推文落进全局集合 */}
      <Node ref={g17} opacity={0}>
        <Rect position={[0, 40]} width={700} height={260} radius={20} fill={T.card} stroke={T.blue} lineWidth={3} />
        <Txt position={[0, -60]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'全局推文集合'} />
        <Rect ref={tweet17} position={[0, -260]} width={360} height={64} radius={10} fill={T.yellow} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.bg} fontFamily={FONT.sans} text={'新推文'} />
        </Rect>
        <Txt position={[0, 120]} fontSize={SIZE.body} fontWeight={700} fill={T.white} fontFamily={FONT.serif} text={'做法 1：读时组装'} />
      </Node>

      {/* b18：读时查、找、合并——三步汇成时间线 */}
      <Node ref={g18} opacity={0}>
        {[
          {y: -170, t: '查你关注的人'},
          {y: -40, t: '找他们每个人的推文'},
          {y: 90, t: '按时间合并'},
        ].map((s, i) => (
          <Node key={`u4-step18-${i}`} ref={step18[i]} position={[-300, s.y]} opacity={0}>
            <Rect width={420} height={90} radius={12} fill={T.card} stroke={T.blue} lineWidth={2}>
              <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={s.t} />
            </Rect>
          </Node>
        ))}
        <Node ref={tl18} position={[330, -40]} opacity={0}>
          <Rect width={380} height={280} radius={16} fill={T.card} stroke={T.green} lineWidth={2} />
          <Txt position={[0, -110]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'时间线'} />
          {[0, 1, 2].map(i => (
            <Rect key={`u4-tl18-${i}`} position={[0, -40 + i * 70]} width={300} height={46} radius={8} fill={T.blue} opacity={0.85} />
          ))}
        </Node>
        <Line points={[[-80, -170], [140, -120]]} stroke={T.line} lineWidth={3} endArrow />
        <Line points={[[-80, -40], [140, -40]]} stroke={T.line} lineWidth={3} endArrow />
        <Line points={[[-80, 90], [140, 40]]} stroke={T.line} lineWidth={3} endArrow />
      </Node>

      {/* b19：SQL 逐行高亮 */}
      <Node ref={g19} opacity={0}>
        <Rect position={[0, -40]} width={980} height={280} radius={16} fill={T.card} stroke={T.line} lineWidth={2} />
        <Rect ref={hl19} position={[0, -130]} width={920} height={44} radius={8} fill={T.yellow} opacity={0.25} />
        <Txt position={[0, -130]} fontSize={SIZE.min} fill={T.text} fontFamily={FONT.mono} text={'SELECT tweets.*, users.* FROM tweets'} />
        <Txt position={[0, -80]} fontSize={SIZE.min} fill={T.text} fontFamily={FONT.mono} text={'  JOIN users ON tweets.sender_id = users.id'} />
        <Txt position={[0, -30]} fontSize={SIZE.min} fill={T.text} fontFamily={FONT.mono} text={'  JOIN follows ON follows.followee_id = users.id'} />
        <Txt position={[0, 20]} fontSize={SIZE.min} fill={T.text} fontFamily={FONT.mono} text={'  WHERE follows.follower_id = current_user'} />
        <Txt position={[0, 110]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'关系型数据库里的一条 SQL'} />
      </Node>

      {/* b20/b21：Figure 1-2 原表复现（三张表分三个子节点，b20 依次出现） */}
      <Node ref={g20} opacity={0}>
        <Node ref={followsTbl} opacity={0}>
          <Txt position={[-395, -269]} fontSize={SIZE.min} fill={T.muted} fontFamily={FONT.sans} text={'follows table'} />
          <Rect position={[-395, -193]} width={330} height={110} stroke={T.line} lineWidth={2} />
          <Line points={[[-560, -193], [-230, -193]]} stroke={T.line} lineWidth={2} />
          <Line points={[[-380, -248], [-380, -138]]} stroke={T.line} lineWidth={2} />
          <Txt position={[-470, -220]} fontSize={SIZE.min} fill={T.muted} fontFamily={FONT.sans} text={'follower_id'} />
          <Txt position={[-305, -220]} fontSize={SIZE.min} fill={T.muted} fontFamily={FONT.sans} text={'followee_id'} />
          <Txt position={[-470, -165]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'17055506'} />
          <Txt position={[-305, -165]} fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.sans} text={'12'} />
        </Node>
        <Node ref={tweetsTbl} opacity={0}>
          <Txt position={[270, -269]} fontSize={SIZE.min} fill={T.muted} fontFamily={FONT.sans} text={'tweets table'} />
          <Rect position={[270, -193]} width={580} height={110} stroke={T.line} lineWidth={2} />
          <Line points={[[-20, -193], [560, -193]]} stroke={T.line} lineWidth={2} />
          <Line points={[[40, -248], [40, -138]]} stroke={T.line} lineWidth={2} />
          <Line points={[[140, -248], [140, -138]]} stroke={T.line} lineWidth={2} />
          <Line points={[[400, -248], [400, -138]]} stroke={T.line} lineWidth={2} />
          <Txt position={[10, -220]} fontSize={SIZE.min} fill={T.muted} fontFamily={FONT.sans} text={'id'} />
          <Txt position={[90, -220]} fontSize={SIZE.min} fill={T.muted} fontFamily={FONT.sans} text={'sender_id'} />
          <Txt position={[270, -220]} fontSize={SIZE.min} fill={T.muted} fontFamily={FONT.sans} text={'text'} />
          <Txt position={[480, -220]} fontSize={SIZE.min} fill={T.muted} fontFamily={FONT.sans} text={'timestamp'} />
          <Txt position={[10, -165]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'20'} />
          <Txt position={[90, -165]} fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.sans} text={'12'} />
          <Txt position={[270, -165]} fontSize={SIZE.min} fill={T.text} fontFamily={FONT.sans} text={'just setting up my twttr'} />
          <Txt position={[480, -165]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'1142974214'} />
        </Node>
        <Node ref={usersTbl} opacity={0}>
          <Txt position={[30, -30]} fontSize={SIZE.min} fill={T.muted} fontFamily={FONT.sans} text={'users table'} />
          <Rect position={[30, 46]} width={420} height={110} stroke={T.line} lineWidth={2} />
          <Line points={[[-180, 46], [240, 46]]} stroke={T.line} lineWidth={2} />
          <Line points={[[-110, -9], [-110, 101]]} stroke={T.line} lineWidth={2} />
          <Line points={[[40, -9], [40, 101]]} stroke={T.line} lineWidth={2} />
          <Txt position={[-145, 19]} fontSize={SIZE.min} fill={T.muted} fontFamily={FONT.sans} text={'id'} />
          <Txt position={[-35, 19]} fontSize={SIZE.min} fill={T.muted} fontFamily={FONT.sans} text={'screen_name'} />
          <Txt position={[140, 19]} fontSize={SIZE.min} fill={T.muted} fontFamily={FONT.sans} text={'profile_image'} />
          <Txt position={[-145, 74]} fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.sans} text={'12'} />
          <Txt position={[-35, 74]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'jack'} />
          <Txt position={[140, 74]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'1234567.jpg'} />
        </Node>
      </Node>
      {/* b21：join 箭头与行高亮（与 g20 同屏叠加） */}
      <Node ref={g21} opacity={0}>
        <Rect ref={rowHl} position={[270, -165]} width={580} height={54} radius={6} stroke={T.yellow} lineWidth={3} opacity={0} />
        <Line ref={arrowA1} points={[[-540, -272], [-575, -210], [-520, -165]]} stroke={T.yellow} lineWidth={3} endArrow opacity={0} />
        {/* r3：arrowA2 原终点 [-145, 45] 的大箭头盖住 users 表头 id 的 i——改走横向进 12 格，箭头尖离 12 字 14px，不压字。 */}
        <Line ref={arrowA2} points={[[-305, -138], [-250, -30], [-200, 74], [-170, 74]]} stroke={T.yellow} lineWidth={3} endArrow opacity={0} />
        <Line ref={arrowA3} points={[[-145, 40], [-60, -60], [90, -138]]} stroke={T.yellow} lineWidth={3} endArrow opacity={0} />
        <Txt ref={tsTag} position={[480, -90]} fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.sans} opacity={0} text={'时间戳 1142974214'} />
      </Node>

      {/* b22：每人一个时间线缓存（邮箱），三组依次出现 */}
      <Node ref={g22} opacity={0}>
        {[-380, 0, 380].map((x, i) => (
          <Node key={`u4-mailbox-${i}`} ref={mb22[i]} position={[x, 0]} opacity={0}>
            <Circle position={[0, -140]} width={80} height={80} fill={T.card} stroke={T.blue} lineWidth={3} />
            <Txt position={[0, -140]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={`用户 ${i + 1}`} />
            <Rect position={[0, 20]} width={260} height={150} radius={12} fill={T.card} stroke={T.green} lineWidth={2} />
            <Txt position={[0, -30]} fontSize={SIZE.min} fill={T.muted} fontFamily={FONT.sans} text={'时间线缓存'} />
          </Node>
        ))}
        <Txt ref={g22Title} position={[0, 180]} fontSize={SIZE.body} fontWeight={700} fill={T.white} fontFamily={FONT.serif} text={'做法 2：写时扇出'} />
      </Node>

      {/* b23：推文复制进每个人的邮箱 */}
      <Node ref={g23} opacity={0}>
        <Rect position={[0, -240]} width={300} height={56} radius={10} fill={T.yellow}>
          <Txt fontSize={SIZE.label} fill={T.bg} fontFamily={FONT.sans} text={'新推文'} />
        </Rect>
        {[0, 1, 2].map(i => (
          <Rect key={`u4-copy-${i}`} ref={copies23[i]} position={[-380 + i * 380, 20]} width={200} height={50} radius={8} fill={T.yellow} opacity={0}>
            <Txt fontSize={SIZE.min} fill={T.bg} fontFamily={FONT.sans} text={'新推文'} />
          </Rect>
        ))}
      </Node>

      {/* b24：读时直接取邮箱 */}
      <Node ref={g24} opacity={0}>
        {[0, 1, 2].map(i => (
          <Line
            key={`u4-read-${i}`}
            ref={readArrows[i]}
            points={[[-380 + i * 380, -55], [-380 + i * 380, -100]]}
            stroke={T.green}
            lineWidth={4}
            endArrow
            opacity={0}
          />
        ))}
        <Txt position={[0, 180]} fontSize={SIZE.body} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'结果早就预先算好了'} />
      </Node>

      {/* b25：v1 被读请求压垮 → 切到 v2 */}
      <Node ref={g25} opacity={0}>
        <Node ref={v1box}>
          <Rect position={[-300, -40]} width={420} height={220} radius={16} fill={T.card} stroke={T.red} lineWidth={3}>
            <Txt position={[0, -60]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'做法 1'} />
            <Txt position={[0, 10]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'读时组装'} />
          </Rect>
          {[0, 1, 2, 3].map(i => (
            <Line
              key={`u4-pile-${i}`}
              ref={pile25[i]}
              points={[[-560, -160 + i * 40], [-512, -40]]}
              stroke={T.red}
              lineWidth={3}
              endArrow
              opacity={0}
            />
          ))}
          <Txt ref={failTag} position={[-300, 90]} fontSize={SIZE.label} fill={T.red} fontFamily={FONT.sans} opacity={0} text={'读请求太多，跟不上'} />
        </Node>
        <Node ref={v2box} opacity={0}>
          <Rect position={[300, -40]} width={420} height={220} radius={16} fill={T.card} stroke={T.green} lineWidth={3}>
            <Txt position={[0, -60]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'做法 2'} />
            <Txt position={[0, 10]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'写时扇出'} />
          </Rect>
          <Txt position={[300, 90]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} text={'切换到做法 2'} />
        </Node>
        <Line points={[[-80, -40], [80, -40]]} stroke={T.green} lineWidth={4} endArrow />
      </Node>
    </>,
  );

  // b14：真正的难题叫 fan-out——五个点依次亮起
  say('难题叫扇出 fan-out');
  yield* beat(
    'b14',
    sequence(1.0, g14().opacity(1, 0.6), fanDots[0]().opacity(1, 0.5), fanDots[1]().opacity(1, 0.5), fanDots[2]().opacity(1, 0.5), fanDots[3]().opacity(1, 0.5), fanDots[4]().opacity(1, 0.5)),
  );

  // b15：fan-out 借自电子工程——逻辑门一分多，三个输入框依次出现
  say('借自电子工程');
  yield* beat(
    'b15',
    all(g14().opacity(0, 0.5), sequence(1.6, g15().opacity(1, 0.6), out15[0]().opacity(1, 0.6), out15[1]().opacity(1, 0.6), out15[2]().opacity(1, 0.6))),
  );

  // b16：在事务处理里，一个入请求变多个出请求——三条箭头依次亮起
  say('一个请求变多个');
  yield* beat(
    'b16',
    all(g15().opacity(0, 0.5), sequence(1.6, g16().opacity(1, 0.6), outArrows[0]().opacity(1, 0.6), outArrows[1]().opacity(1, 0.6), outArrows[2]().opacity(1, 0.6))),
  );

  // b17：做法 1，读时组装——推文落进全局集合
  say('做法 1：读时组装');
  yield* beat(
    'b17',
    all(g16().opacity(0, 0.5), sequence(0, g17().opacity(1, 0.6), all(tweet17().opacity(1, 0.4), tweet17().position([0, 40], 3.0)))),
  );

  // b18：读时查、找、合并——三步依次出现，汇成时间线
  say('读时查、找、合并');
  yield* beat(
    'b18',
    all(
      g17().opacity(0, 0.5),
      sequence(1.2, g18().opacity(1, 0.6), step18[0]().opacity(1, 0.6), step18[1]().opacity(1, 0.6), all(step18[2]().opacity(1, 0.6), tl18().opacity(1, 0.6))),
    ),
  );

  // b19：关系型数据库里，就是这样一条 SQL——高亮逐行下移
  say('一条 SQL 拼时间线');
  yield* beat(
    'b19',
    sequence(0.7, all(g18().opacity(0, 0.4), g19().opacity(1, 0.5)), hl19().position([0, -80], 0.7), hl19().position([0, -30], 0.7), hl19().position([0, 20], 0.7)),
  );

  // b20：Figure 1-2 原表——三张表按原值依次出现
  say('关注 jack');
  yield* beat(
    'b20',
    all(g19().opacity(0, 0.5), sequence(1.6, g20().opacity(1, 0.4), followsTbl().opacity(1, 0.8), tweetsTbl().opacity(1, 0.8), usersTbl().opacity(1, 0.8))),
  );

  // b21：jack 的第一条推文——行高亮，join 箭头走一遍（本拍 12.2s，箭头依次走）
  say('第一条推文');
  yield* beat(
    'b21',
    sequence(1.8, g21().opacity(1, 0.4), rowHl().opacity(1, 0.6), arrowA1().opacity(1, 0.6), arrowA2().opacity(1, 0.6), arrowA3().opacity(1, 0.6), tsTag().opacity(1, 0.6)),
  );

  // b22：做法 2，写时扇出——三个邮箱依次出现
  say('做法 2：写时扇出');
  yield* beat(
    'b22',
    all(
      g20().opacity(0, 0.5),
      g21().opacity(0, 0.5),
      sequence(1.6, g22().opacity(1, 0.4), mb22[0]().opacity(1, 0.7), mb22[1]().opacity(1, 0.7), mb22[2]().opacity(1, 0.7)),
    ),
  );

  // b23：发推就复制进每个人的邮箱——三份拷贝依次落下
  say('发推就复制进邮箱');
  yield* beat(
    'b23',
    sequence(1.0, g23().opacity(1, 0.6), copies23[0]().opacity(1, 0.6), copies23[1]().opacity(1, 0.6), copies23[2]().opacity(1, 0.6)),
  );

  // b24：读时直接取——三条读箭头依次亮起（邮箱里的拷贝保留；r2 #1：绿字出现时把 g22 标题淡出，两行不再重叠）
  say('读时直接取');
  yield* beat(
    'b24',
    all(
      g22Title().opacity(0, 0.5),
      sequence(0.7, g24().opacity(1, 0.6), readArrows[0]().opacity(1, 0.5), readArrows[1]().opacity(1, 0.5), readArrows[2]().opacity(1, 0.5)),
    ),
  );

  // b25：v1 被读请求压垮，切到 v2——红箭头堆积，失败标签，再亮出 v2
  say('v1 扛不住，切到 v2');
  yield* beat(
    'b25',
    all(
      g22().opacity(0, 0.5),
      g23().opacity(0, 0.5),
      g24().opacity(0, 0.5),
      sequence(0.7, g25().opacity(1, 0.6), pile25[0]().opacity(1, 0.5), pile25[1]().opacity(1, 0.5), pile25[2]().opacity(1, 0.5), pile25[3]().opacity(1, 0.5), failTag().opacity(1, 0.6), v2box().opacity(1, 0.8)),
    ),
  );
});
