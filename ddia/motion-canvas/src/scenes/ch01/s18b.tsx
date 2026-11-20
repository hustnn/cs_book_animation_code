import {Line, Rect, Txt, View2D, makeScene2D} from '@motion-canvas/2d';
import {createRef, waitFor} from '@motion-canvas/core';
import {all} from '@motion-canvas/core/lib/flow';

// 1.8b 推特时间线的两张做法（45s，补 Figure 1-2 / Figure 1-3）
// 时间轴：标题 0.5 + 做法1三张表 18.7 (=19.2) + 做法2数字 19.3 (=38.5) + 收尾卡 6.5 (=45.0)
// Figure 1-2（原书 p.12）：follows 表（17055506 关注 12）、
//   users 表（id 12，jack，1234567.jpg）、tweets 表（id 20，sender 12，
//   "just setting up my twttr"，1142974214），三表 join 拼出时间线 = 做法1读时组装。
// Figure 1-3（原书 p.12，2012 年 11 月数据）：4.6k 条推文/秒 × 平均 75 个关注者
//   = 345k 次写/秒；300k 次读/秒；单个用户最多 31M 关注者。
//   做法2划算：发推文的速率比读时间线的速率低近两个数量级。
const BG = '#0F172A';
const CARD = '#1E293B';
const GREEN = '#34D399';
const BLUE = '#38BDF8';
const YELLOW = '#FBBF24';
const RED = '#F87171';
const SLATE = '#94A3B8';
const LINE = '#475569';
const SANS = '"Noto Sans CJK SC", sans-serif';
const SERIF = '"Noto Serif CJK SC", serif';

function TableCard({
  ref,
  x,
  y,
  title,
  rows,
}: {
  ref: any;
  x: number;
  y: number;
  title: string;
  rows: string[];
}) {
  return (
    <Rect
      ref={ref}
      position={[x, y]}
      width={390}
      height={220}
      radius={14}
      fill={CARD}
      stroke={BLUE}
      lineWidth={2}
      opacity={0}
    >
      <Txt
        position={[0, -78]}
        fontSize={26}
        fontWeight={700}
        fill={'#FFFFFF'}
        fontFamily={SANS}
        text={title}
      />
      {rows.map((r, i) => (
        <Txt
          key={String(i)}
          position={[0, -28 + i * 42]}
          fontSize={20}
          fill={i === 0 ? SLATE : '#E2E8F0'}
          fontFamily={SANS}
          text={r}
        />
      ))}
    </Rect>
  );
}

export default makeScene2D(function* (view: View2D) {
  view.add(<Rect width={1280} height={720} fill={BG} />);
  view.fill(BG);

  const title = createRef<Txt>();
  const narration = createRef<Txt>();
  const follows = createRef<Rect>();
  const users = createRef<Rect>();
  const tweets = createRef<Rect>();
  const joinLine1 = createRef<Line>();
  const joinLine2 = createRef<Line>();
  const joinLabel = createRef<Txt>();
  const result = createRef<Txt>();
  const verdict = createRef<Rect>();
  const numCard1 = createRef<Rect>();
  const numCard2 = createRef<Rect>();
  const numCard3 = createRef<Rect>();
  const numCard4 = createRef<Rect>();
  const numCard5 = createRef<Rect>();
  const closing = createRef<Rect>();

  view.add(
    <>
      <Txt
        ref={title}
        position={[0, -322]}
        fontSize={36}
        fontWeight={700}
        fill={'#FFFFFF'}
        fontFamily={SERIF}
        opacity={0}
        text={'第 1 章 · 1.8b 推特时间线的两张做法'}
      />
      <Txt
        ref={narration}
        position={[0, 308]}
        fontSize={26}
        fill={'#E2E8F0'}
        fontFamily={SANS}
        text={''}
      />
      {/* Figure 1-2 三张表 */}
      <TableCard
        ref={follows}
        x={-410}
        y={-110}
        title={'follows 表'}
        rows={['follower_id | followee_id', '17055506 | 12']}
      />
      <TableCard
        ref={users}
        x={0}
        y={-110}
        title={'users 表'}
        rows={['id | screen_name | profile_image', '12 | jack | 1234567.jpg']}
      />
      <TableCard
        ref={tweets}
        x={410}
        y={-110}
        title={'tweets 表'}
        rows={['id 20 | sender_id 12', 'just setting up', 'my twttr · 1142974214']}
      />
      <Line
        ref={joinLine1}
        points={[
          [-215, -110],
          [-205, -110],
        ]}
        stroke={LINE}
        lineWidth={3}
        endArrow
        opacity={0}
      />
      <Line
        ref={joinLine2}
        points={[
          [195, -110],
          [215, -110],
        ]}
        stroke={LINE}
        lineWidth={3}
        endArrow
        opacity={0}
      />
      <Txt
        ref={joinLabel}
        position={[0, 40]}
        fontSize={26}
        fontWeight={700}
        fill={YELLOW}
        fontFamily={SANS}
        opacity={0}
        text={'三张表 join，拼出一条时间线'}
      />
      <Txt
        ref={result}
        position={[0, 110]}
        fontSize={24}
        fill={SLATE}
        fontFamily={SANS}
        opacity={0}
        text={'jack 的推文，出现在用户 17055506 的首页'}
      />
      {/* 做法1结论 */}
      <Rect
        ref={verdict}
        position={[0, 210]}
        width={900}
        height={90}
        radius={16}
        fill={CARD}
        stroke={RED}
        lineWidth={2}
        opacity={0}
      >
        <Txt
          fontSize={30}
          fontWeight={700}
          fill={RED}
          fontFamily={SANS}
          text={'做法1：读时组装，每次读都要 join，读很贵'}
        />
      </Rect>
      {/* Figure 1-3 数字卡片 */}
      <Rect
        ref={numCard1}
        position={[-410, -80]}
        width={390}
        height={170}
        radius={14}
        fill={CARD}
        stroke={BLUE}
        lineWidth={2}
        opacity={0}
      >
        <Txt
          position={[0, -28]}
          fontSize={44}
          fontWeight={700}
          fill={'#FFFFFF'}
          fontFamily={SANS}
          text={'4.6k'}
        />
        <Txt
          position={[0, 42]}
          fontSize={22}
          fill={SLATE}
          fontFamily={SANS}
          text={'条推文 / 秒'}
        />
      </Rect>
      <Rect
        ref={numCard2}
        position={[0, -80]}
        width={390}
        height={170}
        radius={14}
        fill={CARD}
        stroke={BLUE}
        lineWidth={2}
        opacity={0}
      >
        <Txt
          position={[0, -28]}
          fontSize={44}
          fontWeight={700}
          fill={'#FFFFFF'}
          fontFamily={SANS}
          text={'× 75'}
        />
        <Txt
          position={[0, 42]}
          fontSize={22}
          fill={SLATE}
          fontFamily={SANS}
          text={'平均每条发给 75 人'}
        />
      </Rect>
      <Rect
        ref={numCard3}
        position={[410, -80]}
        width={390}
        height={170}
        radius={14}
        fill={CARD}
        stroke={GREEN}
        lineWidth={3}
        opacity={0}
      >
        <Txt
          position={[0, -28]}
          fontSize={44}
          fontWeight={700}
          fill={GREEN}
          fontFamily={SANS}
          text={'345k'}
        />
        <Txt
          position={[0, 42]}
          fontSize={22}
          fill={SLATE}
          fontFamily={SANS}
          text={'次写 / 秒'}
        />
      </Rect>
      <Rect
        ref={numCard4}
        position={[-210, 140]}
        width={390}
        height={150}
        radius={14}
        fill={CARD}
        stroke={BLUE}
        lineWidth={2}
        opacity={0}
      >
        <Txt
          position={[0, -24]}
          fontSize={40}
          fontWeight={700}
          fill={'#FFFFFF'}
          fontFamily={SANS}
          text={'300k 次读 / 秒'}
        />
        <Txt
          position={[0, 38]}
          fontSize={20}
          fill={SLATE}
          fontFamily={SANS}
          text={'读时间线，直接取现成的'}
        />
      </Rect>
      <Rect
        ref={numCard5}
        position={[210, 140]}
        width={390}
        height={150}
        radius={14}
        fill={CARD}
        stroke={BLUE}
        lineWidth={2}
        opacity={0}
      >
        <Txt
          position={[0, -24]}
          fontSize={40}
          fontWeight={700}
          fill={'#FFFFFF'}
          fontFamily={SANS}
          text={'最多 31M 关注者'}
        />
        <Txt
          position={[0, 38]}
          fontSize={20}
          fill={SLATE}
          fontFamily={SANS}
          text={'单个用户，2012 年 11 月数据'}
        />
      </Rect>
      {/* 收尾卡 */}
      <Rect
        ref={closing}
        position={[0, 0]}
        width={1060}
        height={220}
        radius={24}
        fill={CARD}
        stroke={GREEN}
        lineWidth={3}
        opacity={0}
      >
        <Txt
          position={[0, -40]}
          fontSize={34}
          fontWeight={700}
          fill={GREEN}
          fontFamily={SANS}
          text={'写比读少近两个数量级'}
        />
        <Txt
          position={[0, 42]}
          fontSize={28}
          fill={'#FFFFFF'}
          fontFamily={SANS}
          text={'所以写时扇出更划算：写时多干活，读时就便宜了'}
        />
      </Rect>
    </>,
  );

  const say = (text: string) => narration().text(text);

  // 0–0.5s 标题淡入
  yield* title().opacity(1, 0.5);

  // 0.5–20s 做法1：三张表 + join（19.5s）
  say('做法1，读时组装：三张表，\n打开时间线时现查、现 join、现拼。');
  yield* follows().opacity(1, 0.8);
  yield* users().opacity(1, 0.8);
  yield* tweets().opacity(1, 0.8);
  yield* all(joinLine1().opacity(1, 0.5), joinLine2().opacity(1, 0.5));
  yield* joinLabel().opacity(1, 0.5);
  yield* result().opacity(1, 0.5);
  yield* waitFor(5.0);
  say('每次打开都要查三张表、做 join——\n读的时候现算，读很贵。');
  yield* verdict().opacity(1, 0.8);
  yield* waitFor(8.2);

  // 20–38s 做法2：Figure 1-3 数字（18s）
  say('做法2，写时扇出：发推文时，\n就把推文写进每个关注者的时间线缓存。');
  yield* all(
    follows().opacity(0, 0.8),
    users().opacity(0, 0.8),
    tweets().opacity(0, 0.8),
    joinLine1().opacity(0, 0.8),
    joinLine2().opacity(0, 0.8),
    joinLabel().opacity(0, 0.8),
    result().opacity(0, 0.8),
    verdict().opacity(0, 0.8),
  );
  yield* numCard1().opacity(1, 0.8);
  yield* numCard2().opacity(1, 0.8);
  yield* numCard3().opacity(1, 0.8);
  yield* all(numCard4().opacity(1, 0.8), numCard5().opacity(1, 0.8));
  yield* waitFor(15.3);

  // 38–45s 收尾卡（6.5s + 淡出 0.5s）
  say('发推文的速率，比读时间线的速率，\n低近两个数量级。');
  yield* all(
    numCard1().opacity(0, 0.8),
    numCard2().opacity(0, 0.8),
    numCard3().opacity(0, 0.8),
    numCard4().opacity(0, 0.8),
    numCard5().opacity(0, 0.8),
  );
  yield* closing().opacity(1, 0.8);
  yield* waitFor(5.2);
  yield* all(
    title().opacity(0, 0.5),
    narration().opacity(0, 0.5),
    closing().opacity(0, 0.5),
  );
});
