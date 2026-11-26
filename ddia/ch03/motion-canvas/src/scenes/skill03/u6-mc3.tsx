// U6 场景 3（MC，r5）：f26–f34 —— 连接索引：电话簿（姓，名）→ 电话号码的三次查询、
// 重复的代价、单键不够用、结尾回扣（正门与侧门）。
// r10：f26 区分查一个人（姓加名）与查一姓（只要姓）、f32 结尾限定“记位置的索引得更新”。
// r9：f30 计数器上方加“翻完全本”小标（flipLab）、f33 拆 f33 + f33b（一键一值 + 覆盖索引 / 联合查须键本身多列拼）。
// r8：f27/f28 计数器滞后修（f27 并行亮电话+计数、hold 1.0s；f28 开场直接设 1、
// “这一行”只变色不 bump）、f30“散在各处”+红叉小标、f32 框内点名城市索引+回扣、
// f33 红叉小标、f34 正门/侧门小标。
// r7：f30 查询卡“找所有叫 John 的”全程保留（N4，f30 开场不再淡出 qC，改由 f31 开场淡出）；
// f33 补多列拼键卡“键 = 名 + 姓”（电话簿里那把键，N2）。
// r6：f30 补 Smith·John 电话 555-0101 并计找到 2 人；f33 开头改写 + 卡片改“单列键：只连一列”、旁白锚点改“一个键，只映射到一个值”。
// r5：f31 新索引的顺序点名（名在前、姓在后的索引，键 = 名 + 姓）；f32 举不一致的例子（行 19 城市
// 改了、索引还记旧上海，查城市找错行）；f33 与 f25 覆盖索引区分（键单列、值多带几列）；f34 加取舍
// 标准（只给常查的列开侧门）。
// 分镜：skill-ch03/beats-u6.md；原文：DDIA §3.6 前半（书页 p86–87，PDF p109）。
// 时长全部来自 timeline/u6.json（beat() 驱动），不手写 waitFor。
import {Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, chain, createRef, type ThreadGenerator} from '@motion-canvas/core';
import {at, makeBeats} from '../../lib/beats';
import {FONT, SAFE, SIZE, T} from '../../lib/theme';
import {Counter, tag, zone} from '../../lib/schemas';
import timeline from '../../timeline/u6.json';

export default makeScene2D(function* (view) {
  view.fill(T.bg);
  const beat = makeBeats(timeline);

  const header = createRef<Txt>();
  const anchor = createRef<Txt>();
  const say = (text: string) => anchor().text(text);

  // ---- 第 1 页：电话簿（f26–f31），zone 分区框 + tag 角标 ----
  const pH = createRef<Node>();
  const book = createRef<Node>();
  const hlSurname = createRef<Rect>();
  const hlName = createRef<Rect>();
  const hlPhone = createRef<Rect>();
  const rowHlSJ = createRef<Rect>();
  const rowHlSM = createRef<Rect>();
  const nameHlSJ = createRef<Rect>();
  const nameHlBJ = createRef<Rect>();
  const nameTxtSJ = createRef<Txt>();
  const nameTxtBJ = createRef<Txt>();
  const phones = [0, 1, 2, 3].map(() => createRef<Txt>());
  const qChip = createRef<Rect>();
  const qA = createRef<Txt>();
  const qB = createRef<Txt>();
  const qC = createRef<Txt>();
  const bigX = createRef<Txt>();
  const bigXLab = createRef<Txt>(); // r8 f30：这个索引帮不上忙
  const flipLab = createRef<Txt>(); // r9 f30：翻完全本
  const sweepBar = createRef<Rect>();
  const keyChip = createRef<Rect>();
  const orderArrow = createRef<Line>();
  const newKeyChip = createRef<Rect>();
  const [bookZone, bookZoneTitle] = zone([0, -80], 860, 260, '电话簿');
  const newIdxTag = tag([430, 215], '另建一个索引', [0, 0]);
  const foundCounter = new Counter([430, 100], '找到 ', ' 人');

  // r8：计数器即时设值（不用 reset 补间，避免滞后）
  function* setFound(v: number): ThreadGenerator {
    foundCounter.n(v);
  }

  // ---- 第 2 页：重复的代价（f32）----
  const pJ = createRef<Node>();
  const readCard = createRef<Rect>();
  const writeCard = createRef<Rect>();
  const consistLab = createRef<Txt>();
  const exCard = createRef<Rect>();

  // ---- 第 3 页：单键不够用（f33）----
  const pK = createRef<Node>();
  const singleCard = createRef<Rect>();
  const colQ = createRef<Rect>();
  const crossX = createRef<Txt>();
  const crossXLab = createRef<Txt>(); // r8 f33：不是一回事
  const coverNote = createRef<Rect>();
  const multiCard = createRef<Rect>(); // r7 N2：多列拼键卡“键 = 名 + 姓”（电话簿里那把键）

  // ---- 第 4 页：正门与侧门（f34）----
  const pI = createRef<Node>();
  const mainDoor = createRef<Rect>();
  const mainDoorSub = createRef<Txt>(); // r8 f34：聚集索引就是正门本身
  const sideDoor1 = createRef<Rect>();
  const sideDoor1Sub = createRef<Txt>(); // r8 f34：覆盖索引也是侧门的一种
  const sideDoor2 = createRef<Rect>();
  const costTag = createRef<Txt>();
  const ruleTag = createRef<Txt>();

  view.add(
    <>
      <Txt
        ref={header}
        position={[-SAFE.halfW, -SAFE.halfH]}
        offset={[-1, -1]}
        fontSize={SIZE.label}
        fill={T.muted}
        fontFamily={FONT.sans}
        text={'不止主键：二级索引与聚集索引'}
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
      <Node ref={pH} opacity={0}>
        {bookZone}
        {bookZoneTitle}
        <Node ref={book} opacity={0}>
          <Txt position={[-280, -180]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'姓'} />
          <Txt position={[-80, -180]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'名'} />
          <Txt position={[180, -180]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'电话'} />
          <Txt position={[-280, -140]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'Brown'} />
          <Txt position={[-80, -140]} ref={nameTxtBJ} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'John'} />
          <Txt position={[-280, -100]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'Smith'} />
          <Txt position={[-80, -100]} ref={nameTxtSJ} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'John'} />
          <Txt position={[-280, -60]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'Smith'} />
          <Txt position={[-80, -60]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'Mary'} />
          <Txt position={[-280, -20]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'Wilson'} />
          <Txt position={[-80, -20]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'Mary'} />
        </Node>
        <Rect ref={hlSurname} position={[-280, -80]} width={140} height={80} radius={10} stroke={T.yellow} lineWidth={3} opacity={0} />
        <Rect ref={hlName} position={[-80, -80]} width={140} height={160} radius={10} stroke={T.yellow} lineWidth={3} opacity={0} />
        <Rect ref={hlPhone} position={[180, -80]} width={220} height={160} radius={10} stroke={T.green} lineWidth={3} opacity={0} />
        <Rect ref={rowHlSJ} position={[0, -100]} width={820} height={44} radius={10} stroke={T.yellow} lineWidth={3} opacity={0} />
        <Rect ref={rowHlSM} position={[0, -60]} width={820} height={44} radius={10} stroke={T.yellow} lineWidth={3} opacity={0} />
        <Rect ref={nameHlSJ} position={[-80, -100]} width={110} height={44} radius={10} stroke={T.red} lineWidth={3} opacity={0} />
        <Rect ref={nameHlBJ} position={[-80, -140]} width={110} height={44} radius={10} stroke={T.red} lineWidth={3} opacity={0} />
        <Txt ref={phones[0]} position={[180, -100]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.mono} text={'555-0101'} opacity={0} />
        <Txt ref={phones[1]} position={[180, -60]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.mono} text={'555-0102'} opacity={0} />
        <Txt ref={phones[2]} position={[180, -140]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.mono} text={'555-0103'} opacity={0} />
        <Txt ref={phones[3]} position={[180, -20]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.mono} text={'555-0104'} opacity={0} />
        <Rect ref={qChip} position={[0, 150]} width={460} height={70} radius={14} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
        </Rect>
        <Txt ref={qA} position={[0, 150]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'找所有姓 Smith 的'} opacity={0} />
        <Txt ref={qB} position={[0, 150]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'找 Smith 家的 John'} opacity={0} />
        <Txt ref={qC} position={[0, 150]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'找所有叫 John 的'} opacity={0} />
        <Txt ref={bigX} position={[330, 150]} fontSize={64} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'✗'} opacity={0} />
        <Txt ref={bigXLab} position={[330, 200]} fontSize={SIZE.min} fill={T.red} fontFamily={FONT.sans} text={'这个索引帮不上忙'} opacity={0} />
        <Txt ref={flipLab} position={[430, 62]} fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.sans} text={'翻完全本'} opacity={0} />
        <Rect ref={sweepBar} position={[-400, -80]} width={40} height={240} radius={8} fill={T.yellow} opacity={0} />
        <Rect ref={keyChip} position={[0, 140]} width={640} height={70} radius={14} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'键 = 姓 + 名'} />
        </Rect>
        <Rect ref={newKeyChip} position={[0, 215]} width={640} height={70} radius={14} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'键 = 名 + 姓'} />
        </Rect>
        <Line ref={orderArrow} points={[[-260, -205], [-100, -205]]} stroke={T.yellow} lineWidth={3} endArrow opacity={0} />
        {newIdxTag}
        {foundCounter.node}
      </Node>

      {/* 第 2 页 */}
      <Node ref={pJ} opacity={0}>
        <Rect ref={readCard} position={[-280, 0]} width={380} height={90} radius={16} fill={T.card} stroke={T.green} lineWidth={3} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'读快'} />
        </Rect>
        <Rect ref={writeCard} position={[280, 0]} width={380} height={90} radius={16} fill={T.card} stroke={T.red} lineWidth={3} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'写：多花功夫'} />
        </Rect>
        <Txt ref={consistLab} position={[0, 120]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'应用看不到因重复而产生的不一致'} opacity={0} />
        <Rect ref={exCard} position={[0, 200]} width={760} height={64} radius={14} fill={T.card} stroke={T.line} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'行 19 城市改了，城市索引还记旧上海 → 查到错行'} />
        </Rect>
      </Node>

      {/* 第 3 页 */}
      <Node ref={pK} opacity={0}>
        <Rect ref={singleCard} position={[-260, -100]} width={420} height={90} radius={16} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'单列键：只连一列'} />
        </Rect>
        <Rect ref={colQ} position={[260, 20]} width={360} height={80} radius={16} fill={T.card} stroke={T.line} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'还要同时查另一列？'} />
        </Rect>
        <Txt ref={crossX} position={[0, -40]} fontSize={64} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'✗'} opacity={0} />
        <Txt ref={crossXLab} position={[0, 15]} fontSize={SIZE.min} fill={T.red} fontFamily={FONT.sans} text={'不是一回事'} opacity={0} />
        <Rect ref={coverNote} position={[-260, 80]} width={420} height={80} radius={16} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'覆盖索引：键单列，值多带几列'} />
        </Rect>
        <Rect ref={multiCard} position={[260, -100]} width={360} height={90} radius={16} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt position={[0, -16]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'键 = 名 + 姓'} />
          <Txt position={[0, 16]} fontSize={SIZE.min} fill={T.muted} fontFamily={FONT.sans} text={'电话簿里那把键'} />
        </Rect>
      </Node>

      {/* 第 4 页 */}
      <Node ref={pI} opacity={0}>
        <Rect ref={mainDoor} position={[-360, -40]} width={300} height={200} radius={16} fill={T.card} stroke={T.green} lineWidth={3} opacity={0}>
          <Txt position={[0, -50]} fontSize={SIZE.body} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'正门'} />
          <Txt position={[0, 10]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'主键'} />
          <Txt ref={mainDoorSub} position={[0, 60]} fontSize={SIZE.min} fill={T.muted} fontFamily={FONT.sans} text={'聚集索引就是正门本身'} opacity={0} />
        </Rect>
        <Rect ref={sideDoor1} position={[0, -40]} width={300} height={200} radius={16} fill={T.card} stroke={T.blue} lineWidth={3} opacity={0}>
          <Txt position={[0, -50]} fontSize={SIZE.body} fontWeight={700} fill={T.blue} fontFamily={FONT.sans} text={'侧门'} />
          <Txt position={[0, 10]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'二级索引'} />
          <Txt ref={sideDoor1Sub} position={[0, 60]} fontSize={SIZE.min} fill={T.muted} fontFamily={FONT.sans} text={'覆盖索引也是侧门的一种'} opacity={0} />
        </Rect>
        <Rect ref={sideDoor2} position={[360, -40]} width={300} height={200} radius={16} fill={T.card} stroke={T.blue} lineWidth={3} opacity={0}>
          <Txt position={[0, -50]} fontSize={SIZE.body} fontWeight={700} fill={T.blue} fontFamily={FONT.sans} text={'侧门'} />
          <Txt position={[0, 10]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'二级索引'} />
        </Rect>
        <Txt ref={costTag} position={[0, 150]} fontSize={SIZE.body} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'门越多，维护越贵'} opacity={0} />
        <Txt ref={ruleTag} position={[0, 215]} fontSize={SIZE.body} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'只给常查的列开侧门'} opacity={0} />
      </Node>
    </>
  );

  say('电话簿：姓、名 → 电话');
  yield* beat('f26',
    all(pH().opacity(1, 0.5)),
    at('电话簿', chain(bookZone.opacity(1, 0.5), bookZoneTitle.opacity(1, 0.4), book().opacity(1, 0.5))),
    at('先按姓', hlSurname().opacity(1, 0.5)),
    at('再按名', hlName().opacity(1, 0.5)),
    at('电话号码', hlPhone().opacity(1, 0.5)),
    at('姓加名一起给', all(hlSurname().stroke(T.yellow, 0.4), hlName().stroke(T.yellow, 0.4))),
    at('只要姓就够了', hlSurname().stroke(T.yellow, 0.4)),
  );

  say('找所有姓 Smith 的');
  yield* beat('f27',
    all(hlName().opacity(0, 0.4), hlPhone().opacity(0, 0.4)),
    at('某一姓', chain(qChip().opacity(1, 0.5), qA().opacity(1, 0.4), rowHlSJ().opacity(1, 0.4), rowHlSM().opacity(1, 0.4), foundCounter.node.opacity(1, 0.4))),
    at('顺着扫', all(phones[0]().opacity(1, 0.4), phones[1]().opacity(1, 0.4), setFound(2))),
  );

  say('找 Smith 家的 John');
  yield* beat('f28',
    all(rowHlSM().opacity(0, 0.4), phones[1]().opacity(0, 0.4), qA().opacity(0, 0.4), setFound(1)),
    at('姓加名', chain(qB().opacity(1, 0.4), rowHlSJ().stroke(T.green, 0.4))),
    at('这一行', phones[0]().fill(T.yellow, 0.4)),
  );

  say('找所有叫 John 的');
  yield* beat('f29',
    all(rowHlSJ().opacity(0, 0.4), phones[0]().opacity(0, 0.4), qB().opacity(0, 0.4), foundCounter.node.opacity(0, 0.4)),
    at('某一名的所有人', chain(qC().opacity(1, 0.4), nameHlSJ().opacity(1, 0.4), nameHlBJ().opacity(1, 0.4))),
    at('名在第二位', hlName().opacity(1, 0.4)),
  );

  say('得整本翻一遍');
  yield* beat('f30',
    all(nameHlSJ().opacity(0, 0.4), nameHlBJ().opacity(0, 0.4), hlSurname().opacity(0, 0.4), hlName().opacity(0, 0.4)),
    at('两个 John', all(
      chain(phones[2]().opacity(1, 0.3), phones[2]().scale(1.25, 0.15), phones[2]().scale(1, 0.25)),
      chain(phones[0]().opacity(1, 0.3), phones[0]().scale(1.25, 0.15), phones[0]().scale(1, 0.25)))),
    at('散在各处', all(chain(nameTxtSJ().scale(1.3, 0.15), nameTxtSJ().scale(1, 0.25)), chain(nameTxtBJ().scale(1.3, 0.15), nameTxtBJ().scale(1, 0.25)))),
    at('想找全', chain(sweepBar().opacity(0.5, 0.3), sweepBar().position([400, -80], 1.5))),
    at('整本翻一遍', all(bigX().opacity(1, 0.5), bigXLab().opacity(1, 0.5), flipLab().opacity(1, 0.5), foundCounter.node.opacity(1, 0.4), chain(foundCounter.reset(0.3), foundCounter.bump(), foundCounter.bump()))),
  );

  say('换顺序，另建索引');
  yield* beat('f31',
    all(sweepBar().opacity(0, 0.4), bigX().opacity(0, 0.4), bigXLab().opacity(0, 0.4), flipLab().opacity(0, 0.4), phones[2]().opacity(0, 0.4), phones[0]().opacity(0, 0.4), foundCounter.node.opacity(0, 0.4), qChip().opacity(0, 0.4), qC().opacity(0, 0.4)),
    at('拼的顺序', chain(keyChip().opacity(1, 0.5), orderArrow().opacity(1, 0.5))),
    at('另建一个索引', newIdxTag.opacity(1, 0.5)),
    at('名在前', newKeyChip().opacity(1, 0.5)),
    at('姓在后', newKeyChip().stroke(T.yellow, 0.4)),
  );

  say('读快，维护贵');
  yield* beat('f32',
    all(pH().opacity(0, 0.5), pJ().opacity(1, 0.5)),
    at('读得快', chain(readCard().opacity(1, 0.5), readCard().scale(1.04, 1.5))),
    at('多花功夫', chain(writeCard().opacity(1, 0.5), writeCard().scale(1.04, 1.5))),
    at('多费力气', chain(writeCard().scale(1.05, 0.15), writeCard().scale(1, 0.25))),
    at('不一致', consistLab().opacity(1, 0.5)),
    at('比如行十九', exCard().opacity(1, 0.5)),
    at('要是索引里还记着旧的上海', chain(exCard().scale(1.04, 0.2), exCard().scale(1, 0.3))),
    at('找错行', exCard().stroke(T.red, 0.4)),
    at('记位置的索引', chain(exCard().scale(1.04, 0.2), exCard().scale(1, 0.3))),
  );

  say('一个键，只映射到一个值');
  yield* beat('f33',
    all(pJ().opacity(0, 0.5), pK().opacity(1, 0.5)),
    at('单列', singleCard().opacity(1, 0.5)),
    at('只映射到一个值', chain(singleCard().scale(1.05, 0.15), singleCard().scale(1, 0.25))),
    at('覆盖索引', coverNote().opacity(1, 0.5)),
    at('不用回表', chain(coverNote().scale(1.05, 0.15), coverNote().scale(1, 0.25))),
  );

  say('键本身得由好几列拼出来');
  yield* beat('f33b',
    at('同时按好几列查', colQ().opacity(1, 0.5)),
    at('查是按钥匙找的', all(crossX().opacity(1, 0.5), crossXLab().opacity(1, 0.5), chain(coverNote().scale(1.05, 0.15), coverNote().scale(1, 0.25)))),
    at('这里是要按好几列联合找', chain(colQ().scale(1.05, 0.15), colQ().scale(1, 0.25))),
    at('键本身', all(multiCard().opacity(1, 0.5), colQ().stroke(T.yellow, 0.4), chain(crossX().scale(1.2, 0.15), crossX().scale(1, 0.25)), chain(multiCard().scale(1.05, 0.15), multiCard().scale(1, 0.25)))),
  );

  say('正门是主键，侧门是二级索引');
  yield* beat('f34',
    all(pK().opacity(0, 0.5), pI().opacity(1, 0.5)),
    at('正门', mainDoor().opacity(1, 0.5)),
    at('侧门', chain(sideDoor1().opacity(1, 0.4), sideDoor2().opacity(1, 0.4))),
    at('正门本身', mainDoorSub().opacity(1, 0.5)),
    at('侧门的一种', sideDoor1Sub().opacity(1, 0.5)),
    at('维护越贵', all(costTag().opacity(1, 0.5), mainDoor().scale(1.02, 1.0))),
    at('只给常查的列', ruleTag().opacity(1, 0.5)),
  );
});
