import {Rect, Txt, View2D, makeScene2D} from '@motion-canvas/2d';
import {createRef, waitFor} from '@motion-canvas/core';
import {all} from '@motion-canvas/core/lib/flow';

// 1.10 应对负载的方法（60s）
// 时间轴：标题 0.5 + 分叉卡 11.5 (=12) + 纵向到顶/横向复制 23 (=35)
//        + 节点变灰摊负载 15 (=50) + 收尾 10 (=60)
// 取舍：纵向“长高”用一根服务器矩形的 height 补间实现（不整体缩放，
// 文字不变形）；横向节点用 4 个小矩形，不复用 300 宽的 ServerNode
// （4 个并排会超出 1280 宽）。
const BG = '#0F172A';
const CARD = '#1E293B';
const GREEN = '#34D399';
const RED = '#F87171';
const BLUE = '#38BDF8';
const SLATE = '#94A3B8';
const LINE = '#475569';
const SANS = '"Noto Sans CJK SC", sans-serif';
const SERIF = '"Noto Serif CJK SC", serif';

const NODES_X = [130, 270, 410, 550];

export default makeScene2D(function* (view: View2D) {
  view.add(<Rect width={1280} height={720} fill={BG} />);
  view.fill(BG);

  const title = createRef<Txt>();
  const narration = createRef<Txt>();
  const forkL = createRef<Rect>();
  const forkR = createRef<Rect>();
  const serverV = createRef<Rect>();
  const topLabel = createRef<Txt>();
  const archLabel = createRef<Txt>();
  const spreadNote = createRef<Txt>();
  const closing = createRef<Rect>();
  const nodeRefs = NODES_X.map(() => createRef<Rect>());

  view.add(
    <>
      <Txt
        ref={title}
        position={[0, -322]}
        fontSize={38}
        fontWeight={700}
        fill={'#FFFFFF'}
        fontFamily={SERIF}
        opacity={0}
        text={'第 1 章 · 1.10 应对负载的方法'}
      />
      <Txt
        ref={narration}
        position={[0, 308]}
        fontSize={26}
        fill={'#E2E8F0'}
        fontFamily={SANS}
        text={''}
      />
      {/* 分叉卡 */}
      <Rect
        ref={forkL}
        position={[-320, -60]}
        width={520}
        height={180}
        radius={18}
        fill={CARD}
        stroke={BLUE}
        lineWidth={2}
        opacity={0}
      >
        <Txt
          position={[0, 0]}
          fontSize={32}
          fontWeight={700}
          fill={BLUE}
          fontFamily={SANS}
          text={'纵向：机器变强'}
        />
      </Rect>
      <Rect
        ref={forkR}
        position={[320, -60]}
        width={520}
        height={180}
        radius={18}
        fill={CARD}
        stroke={GREEN}
        lineWidth={2}
        opacity={0}
      >
        <Txt
          position={[0, 0]}
          fontSize={32}
          fontWeight={700}
          fill={GREEN}
          fontFamily={SANS}
          text={'横向：机器变多'}
        />
      </Rect>
      {/* 纵向服务器：长高 */}
      <Rect
        ref={serverV}
        position={[-380, 60]}
        width={220}
        height={140}
        radius={14}
        fill={CARD}
        stroke={BLUE}
        lineWidth={3}
        opacity={0}
      >
        <Txt
          position={[0, -20]}
          fontSize={28}
          fontWeight={700}
          fill={'#FFFFFF'}
          fontFamily={SANS}
          text={'服务器'}
        />
        <Txt
          position={[0, 30]}
          fontSize={20}
          fill={SLATE}
          fontFamily={SANS}
          text={'CPU · 内存'}
        />
      </Rect>
      <Txt
        ref={topLabel}
        position={[-380, 255]}
        fontSize={28}
        fontWeight={700}
        fill={RED}
        fontFamily={SANS}
        opacity={0}
        text={'到头了'}
      />
      {/* 横向节点 */}
      {NODES_X.map((x, i) => (
        <Rect
          key={String(i)}
          ref={nodeRefs[i]}
          position={[x, 60]}
          width={120}
          height={110}
          radius={12}
          fill={CARD}
          stroke={GREEN}
          lineWidth={2}
          opacity={0}
        >
          <Txt
            position={[0, 0]}
            fontSize={22}
            fontWeight={700}
            fill={'#FFFFFF'}
            fontFamily={SANS}
            text={`节点 ${i + 1}`}
          />
        </Rect>
      ))}
      <Txt
        ref={archLabel}
        position={[340, -80]}
        fontSize={24}
        fontWeight={700}
        fill={GREEN}
        fontFamily={SANS}
        opacity={0}
        text={'无共享架构 · 每台独立'}
      />
      <Txt
        ref={spreadNote}
        position={[340, 200]}
        fontSize={24}
        fontWeight={700}
        fill={GREEN}
        fontFamily={SANS}
        opacity={0}
        text={'负载摊到其余节点'}
      />
      {/* 收尾卡 */}
      <Rect
        ref={closing}
        position={[0, -10]}
        width={1000}
        height={240}
        radius={24}
        fill={CARD}
        stroke={GREEN}
        lineWidth={3}
        opacity={0}
      >
        <Txt
          position={[0, 0]}
          fontSize={36}
          fontWeight={700}
          fill={'#FFFFFF'}
          fontFamily={SERIF}
          text={'先确认负载假设，再谈扩展。'}
        />
      </Rect>
    </>,
  );

  const say = (text: string) => narration().text(text);

  // 0–0.5s 标题淡入
  yield* title().opacity(1, 0.5);

  // 0–12s 分叉卡（11.5s）
  say('下一步才是应对。两个方向：\n纵向扩展，是把一台机器变得更强；横向扩展，是把机器变多。');
  yield* all(forkL().opacity(1, 0.8), forkR().opacity(1, 0.8));
  yield* waitFor(10.7);

  // 12–35s 左边长高到顶标红，右边一台台复制排开（23s）
  say('横向扩展常用无共享架构：\n每台机器独立，互不共享内存与磁盘。');
  yield* all(forkL().opacity(0, 0.5), forkR().opacity(0, 0.5));
  yield* serverV().opacity(1, 0.8);
  yield* serverV().height(340, 1.5);
  yield* topLabel().opacity(1, 0.5);
  for (let i = 0; i < nodeRefs.length; i++) {
    yield* nodeRefs[i]().opacity(1, 0.5);
  }
  yield* archLabel().opacity(1, 0.5);
  yield* waitFor(17.2);

  // 35–50s 一台横向节点变灰，负载摊到其余节点（15s）
  say('坏一台不影响别的：节点 3 变灰，\n负载自动摊到其余节点，系统继续服务。');
  yield* nodeRefs[2]().fill('#475569', 0.5);
  yield* spreadNote().opacity(1, 0.5);
  yield* waitFor(14.0);

  // 50–60s 收尾卡（9.5s + 淡出 0.5s）
  say('记住：扩展之前，先确认你的负载假设是对的。');
  yield* all(
    serverV().opacity(0, 0.8),
    topLabel().opacity(0, 0.8),
    archLabel().opacity(0, 0.8),
    spreadNote().opacity(0, 0.8),
    ...nodeRefs.map(r => r().opacity(0, 0.8)),
  );
  yield* closing().opacity(1, 0.8);
  yield* waitFor(7.9);
  yield* all(
    title().opacity(0, 0.5),
    narration().opacity(0, 0.5),
    closing().opacity(0, 0.5),
  );
});
