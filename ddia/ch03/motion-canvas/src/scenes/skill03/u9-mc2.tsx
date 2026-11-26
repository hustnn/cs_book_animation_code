// U9 场景 2（MC）r3：i12–i24 —— Figure 3-8（三列业务系统汇入数据仓库）、
// 转换框展开（剖面放大：全景虚化退后，前景放大讲“转格式 + 清脏数据”）、
// 加载（KV 数据块沿加载箭头移动 + 计数器“已汇入 N 路”）、ETL 链。
// r4 改动（B34）：流程图列头改成两行——路名 + 选的抽取办法（销售：定期转储 /
// r5 改动（r4 新手测试）：i14 旁白点名销售路选定期转储（列头副标随念到亮起）；i19/i20 杂乱记录改销售味网单 + 字段对应三行；i21 删展开标签；i23 加载箭头逐路亮起、计数器逐路加一。
// r6 改动（r5 新手测试）：i16/i18 旁白点名库存/地理路选的抽取办法（列头副标改随“选的是……”亮起，与 i14 同 pattern）；i20 下方补库存、地理两路各自的分析表小画面（书里没有这两张表，列名与数值都是示意，标“示意”）；i21/i22 脏数据三张名字牌各配一行真实例子，随名字一起清掉。
// r7 改动（r6 新手测试 5 项 P2）：i14 加 unpack（转储 = 隔一段时间拷一次快照、更新流 = 数据一变就送过来；两次转储之间数据是旧的）：念到哪种办法、哪种办法的标签变黄，念到“两次转储之间”出小标；i22 旁白改成三类脏数据各半句“删掉”（本视频的约定，画面逐个消失）。
// r8 改动（r7 新手测试 3 项 P2）：P2-2 i16 旁白加半句“连续更新流那路，数据一变就送过来，仓库里一直是新的”，画面在库存/地理两转换框之间出绿色小标（与 r7 的 staleTag 对称）；P2-3 i14 旁白加半句前指“抽出来的数据，接下来进转换框，第二步再讲”；P2-4 i21 旁白加“三路都一样”。
// 帧级审查修复 F1：网单记录首行文字溢出红框，改短文字并加宽记录框。
// 库存：连续更新流 / 地理：定期转储，任选其一示例），随 i14/i16/i18 逐路亮起；
// i20 表下标“销售这一路的分析表”；i23 加载块改名销售表/库存表/地理表，明说各进各的分析表。
// Figure 3-8 按处置“改编”：三列与箭头读法按原图重新生成；小人图标改为示意人物。
// 分镜：skill-ch03/beats-u9.md；原文：DDIA §3.8（书页 p92，PDF p114）。
// 时长全部来自 timeline/u9.json（beat() 驱动），不手写 waitFor。
import {Circle, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, chain, createRef, sequence} from '@motion-canvas/core';
import {at, makeBeats} from '../../lib/beats';
import {Counter, KV} from '../../lib/schemas';
import {FONT, SAFE, SIZE, T} from '../../lib/theme';
import timeline from '../../timeline/u9.json';

const COL_X = [-380, 0, 380];
const PERSON = ['顾客', '仓库工人', '卡车司机'];
const APP = ['电商网站', '库存管理应用', '车辆路线规划器'];
const DB = ['销售数据库', '库存数据库', '地理数据库'];
const LOAD_TARGET = [-20, 150, 320];

export default makeScene2D(function* (view) {
  view.fill(T.bg);
  const beat = makeBeats(timeline);

  const W = createRef<Node>();
  const HUD = createRef<Node>();
  const header = createRef<Txt>();
  const anchor = createRef<Txt>();
  const say = (text: string) => anchor().text(text);

  // ---- i12–i18, i23, i25：Figure 3-8 ----
  const fig = createRef<Node>();
  const colGuides = [0, 1, 2].map(() => createRef<Rect>());
  const heads = [0, 1, 2].map(() => createRef<Circle>());
  const personLabs = [0, 1, 2].map(() => createRef<Txt>());
  const appBoxes = [0, 1, 2].map(() => createRef<Rect>());
  const dbBodies = [0, 1, 2].map(() => createRef<Rect>());
  const dbLids = [0, 1, 2].map(() => createRef<Circle>());
  const trBoxes = [0, 1, 2].map(() => createRef<Rect>());
  const extArrows = [0, 1, 2].map(() => createRef<Line>());
  const dumpLab = createRef<Txt>();
  const streamLab = createRef<Txt>();
  const staleTag = createRef<Txt>();
  const freshTag = createRef<Txt>();
  const snapPkt = createRef<Circle>();
  const loadArrows = [0, 1, 2].map(() => createRef<Line>());
  const whBody = createRef<Rect>();
  const whLid = createRef<Circle>();
  const whLab = createRef<Txt>();
  const analyst = createRef<Rect>();
  const qArrow = createRef<Line>();
  const zoneLab = createRef<Txt>();
  const colChips = [0, 1, 2].map(() => createRef<Rect>());
  const methodLabs = [0, 1, 2].map(() => createRef<Txt>());
  const loadPkts = ['销售表', '库存表', '地理表'].map(
    name => new KV(name, '', 'key', {w: 110}),
  );
  const LOAD_FINAL: [number, number][] = [[40, 175], [150, 175], [260, 175]];
  const loadCount = new Counter([480, 240], '已汇入 ', ' 路');

  // ---- i19–i20：转换演示 ----
  const g19 = createRef<Node>();
  const trBox19 = createRef<Rect>();
  const trTag19 = createRef<Txt>();
  const messy = [0, 1, 2].map(() => createRef<Rect>());
  const tidyBox = createRef<Rect>();
  const salesTag = createRef<Txt>();
  const mapLines = [0, 1, 2].map(() => createRef<Txt>());
  const invTable = createRef<Rect>();
  const geoTable = createRef<Rect>();

  // ---- i21–i22：转换框剖面放大（HUD 前景）----
  const cut = createRef<Node>();
  const trBoxC = createRef<Rect>();
  const fmtBox = createRef<Rect>();
  const cleanBox = createRef<Rect>();
  const dirtyChips = [0, 1, 2].map(() => createRef<Rect>());
  const dirtyEx = [0, 1, 2].map(() => createRef<Rect>());

  // ---- i24：ETL 链 ----
  const g24 = createRef<Node>();
  const etlBoxes = [0, 1, 2].map(() => createRef<Rect>());
  const etlArrows = [0, 1].map(() => createRef<Line>());
  const etlPlate = createRef<Txt>();
  const whBody24 = createRef<Rect>();
  const whLid24 = createRef<Circle>();
  const pkt24 = createRef<Circle>();

  view.add(
    <>
      <Node ref={W}>
        {/* Figure 3-8 */}
        <Node ref={fig} opacity={0}>
          {[0, 1, 2].map(i => (
            <Rect
              key={`guide-${i}`}
              ref={colGuides[i]}
              position={[COL_X[i], -140]}
              width={320}
              height={300}
              radius={16}
              fill={T.bg}
              stroke={T.line}
              lineWidth={2}
              lineDash={[8, 6]}
              opacity={0}
            />
          ))}
          {[0, 1, 2].map(i => (
            <Circle key={`head-${i}`} ref={heads[i]} position={[COL_X[i], -272]} width={30} height={30} fill={T.bg} stroke={T.text} lineWidth={2} opacity={0} />
          ))}
          {[0, 1, 2].map(i => (
            <Txt key={`pl-${i}`} ref={personLabs[i]} position={[COL_X[i], -242]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={PERSON[i]} opacity={0} />
          ))}
          {[0, 1, 2].map(i => (
            <Rect
              key={`app-${i}`}
              ref={appBoxes[i]}
              position={[COL_X[i], -150]}
              width={300}
              height={70}
              radius={12}
              fill={T.card}
              stroke={T.line}
              lineWidth={2}
              opacity={0}
            >
              <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={APP[i]} />
            </Rect>
          ))}
          {[0, 1, 2].map(i => (
            <Rect
              key={`db-${i}`}
              ref={dbBodies[i]}
              position={[COL_X[i], -40]}
              width={260}
              height={80}
              radius={12}
              fill={T.card}
              stroke={T.blue}
              lineWidth={2}
              opacity={0}
            >
              <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={DB[i]} />
            </Rect>
          ))}
          {[0, 1, 2].map(i => (
            <Circle key={`lid-${i}`} ref={dbLids[i]} position={[COL_X[i], -80]} width={260} height={32} fill={T.bg} stroke={T.blue} lineWidth={2} opacity={0} />
          ))}
          {[0, 1, 2].map(i => (
            <Rect
              key={`tr-${i}`}
              ref={trBoxes[i]}
              position={[COL_X[i], 90]}
              width={240}
              height={60}
              radius={12}
              fill={T.card}
              stroke={T.line}
              lineWidth={2}
              opacity={0}
            >
              <Txt fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'转换'} />
            </Rect>
          ))}
          {[0, 1, 2].map(i => (
            <Line key={`ext-${i}`} ref={extArrows[i]} points={[[COL_X[i], 0], [COL_X[i], 60]]} stroke={T.yellow} lineWidth={3} endArrow opacity={0} />
          ))}
          {/* r7：快照包——沿销售路抽取箭头下滑，1.0s（转储：隔一段时间拷一次）/ 0.6s（更新流：数据一变就送），破 i14 定格 */}
          <Circle ref={snapPkt} position={[-380, 6]} width={20} height={20} fill={T.text} opacity={0} />
          <Txt ref={dumpLab} position={[-240, 18]} fontSize={SIZE.min} fill={T.muted} fontFamily={FONT.sans} text={'定期转储'} opacity={0} />
          <Txt ref={streamLab} position={[-240, 48]} fontSize={SIZE.min} fill={T.muted} fontFamily={FONT.sans} text={'连续更新流'} opacity={0} />
          {/* r7：两行，卡进两路转换框之间的空隙（x -260..-120），不骑任何框的边 */}
          <Txt ref={staleTag} position={[-190, 96]} fontSize={SIZE.min} fill={T.yellow} fontFamily={FONT.sans} text={'两次转储之间，数据是旧的'} textAlign={'center'} textWrap maxWidth={140} opacity={0} />
          {/* r8：与 staleTag 对称的另一半——更新流那路的新鲜度。两行，卡进库存/地理两转换框之间的空隙（x 120..260）；实测行宽 126px，左右各留 7px（与 staleTag 同款余量） */}
          <Txt ref={freshTag} position={[190, 96]} fontSize={SIZE.min} fill={T.green} fontFamily={FONT.sans} text={'更新流那路，一直是新的'} textAlign={'center'} textWrap maxWidth={140} opacity={0} />
          {[0, 1, 2].map(i => (
            <Line
              key={`load-${i}`}
              ref={loadArrows[i]}
              points={[[COL_X[i], 120], [COL_X[i], 145], [LOAD_TARGET[i], 158]]}
              stroke={T.green}
              lineWidth={3}
              endArrow
              opacity={0}
            />
          ))}
          <Rect ref={whBody} position={[150, 200]} width={340} height={90} radius={16} fill={T.card} stroke={T.blue} lineWidth={3} opacity={0}>
            <Txt ref={whLab} position={[0, 12]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'数据仓库'} opacity={0} />
          </Rect>
          <Circle ref={whLid} position={[150, 155]} width={340} height={40} fill={T.bg} stroke={T.blue} lineWidth={3} opacity={0} />
          <Rect ref={analyst} position={[-480, 200]} width={200} height={70} radius={12} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'业务分析师'} />
          </Rect>
          <Line ref={qArrow} points={[[-380, 200], [-20, 200]]} stroke={T.green} lineWidth={3} endArrow opacity={0} />
          <Txt ref={zoneLab} position={[520, 30]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'分析系统'} opacity={0} />
          {['销售库', '库存库', '地理库'].map((t, i) => (
            <Rect
              key={`col-${i}`}
              ref={colChips[i]}
              position={[-300 + i * 300, -316]}
              width={220}
              height={64}
              radius={10}
              fill={T.card}
              stroke={T.yellow}
              lineWidth={2}
              opacity={0}
            >
              <Txt position={[0, -13]} fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.sans} text={t} />
              <Txt ref={methodLabs[i]} position={[0, 13]} fontSize={SIZE.min} fill={T.muted} fontFamily={FONT.sans} text={['抽取：定期转储', '抽取：连续更新流', '抽取：定期转储'][i]} opacity={0} />
            </Rect>
          ))}
          {loadPkts.map((kv, i) => (
            <Node key={`lp-${i}`}>{kv.node}</Node>
          ))}
        </Node>

        {/* i19–i20：转换演示 */}
        <Node ref={g19} opacity={0}>
          {[0, 1, 2].map(i => (
            <Rect
              key={`messy-${i}`}
              ref={messy[i]}
              position={[-420, -160 + i * 80]}
              width={260}
              height={56}
              radius={10}
              fill={T.card}
              stroke={T.red}
              lineWidth={2}
              opacity={0}
            >
              <Txt fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.mono} text={['网单：31号 1件 140102', '订单：31 × 1，140102', '31号 1件 2014-01-02'][i]} />
            </Rect>
          ))}
          <Rect ref={trBox19} position={[0, -80]} width={260} height={90} radius={14} fill={T.card} stroke={T.yellow} lineWidth={3} opacity={0}>
            <Txt fontSize={SIZE.body} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'转换'} />
          </Rect>
          <Txt ref={trTag19} position={[0, -5]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'转换框 · 每路一个'} opacity={0} />
          <Rect ref={tidyBox} position={[400, -80]} width={280} height={150} radius={14} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
            <Txt position={[0, -40]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'日期 | 产品 | 数量'} />
            <Txt position={[0, 0]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'140102 | 31 | 1'} />
            <Txt position={[0, 40]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'适合分析的模式'} />
          </Rect>
          <Txt ref={salesTag} position={[400, 25]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'销售这一路的分析表'} opacity={0} />
          {['日期 ← 网单里的日子', '产品 ← 网单里的商品号', '数量 ← 网单里的件数'].map((t, i) => (
            <Txt key={`map-${i}`} ref={mapLines[i]} position={[400, 50 + i * 28]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={t} opacity={0} />
          ))}
          {/* r6：库存、地理两路各自的分析表（书里没有这两张表，列名与数值都是示意） */}
          <Rect ref={invTable} position={[-300, 195]} width={380} height={120} radius={14} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
            <Txt position={[0, -40]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'库存这一路的分析表 · 示意'} />
            <Txt position={[0, 0]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'日期 | 商品 | 库存量（件）'} />
            <Txt position={[0, 38]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'140102 | 31 | 120'} />
          </Rect>
          <Rect ref={geoTable} position={[300, 195]} width={380} height={120} radius={14} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
            <Txt position={[0, -40]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'地理这一路的分析表 · 示意'} />
            <Txt position={[0, 0]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'日期 | 路线 | 里程（公里）'} />
            <Txt position={[0, 38]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'140102 | 7号线 | 320'} />
          </Rect>
        </Node>

        {/* i24：ETL 链 */}
        <Node ref={g24} opacity={0}>
          {['抽取', '转换', '加载'].map((t, i) => (
            <Rect
              key={`etl-${i}`}
              ref={etlBoxes[i]}
              position={[-380 + i * 380, -80]}
              width={260}
              height={90}
              radius={14}
              fill={T.card}
              stroke={i === 2 ? T.yellow : T.line}
              lineWidth={2}
            >
              <Txt fontSize={SIZE.body} fontWeight={700} fill={i === 2 ? T.yellow : T.text} fontFamily={FONT.sans} text={t} />
            </Rect>
          ))}
          <Line ref={etlArrows[0]} points={[[-250, -80], [-130, -80]]} stroke={T.blue} lineWidth={3} endArrow opacity={0} />
          <Line ref={etlArrows[1]} points={[[130, -80], [250, -80]]} stroke={T.blue} lineWidth={3} endArrow opacity={0} />
          <Txt ref={etlPlate} position={[0, 60]} fontSize={SIZE.title} fontWeight={700} fill={T.yellow} fontFamily={FONT.mono} text={'ETL'} opacity={0} />
          <Rect ref={whBody24} position={[380, 170]} width={260} height={80} radius={14} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'数据仓库'} />
          </Rect>
          <Circle ref={whLid24} position={[380, 130]} width={260} height={34} fill={T.bg} stroke={T.blue} lineWidth={2} opacity={0} />
          <Circle ref={pkt24} position={[380, -35]} width={22} height={22} fill={T.yellow} opacity={0} />
        </Node>
      </Node>

      <Node ref={HUD}>
        <Txt
          ref={header}
          position={[-SAFE.halfW, -SAFE.halfH]}
          offset={[-1, -1]}
          fontSize={SIZE.label}
          fill={T.muted}
          fontFamily={FONT.sans}
          text={'数据仓库与 ETL'}
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
        {loadCount.node}
        {/* i21–i22：转换框剖面放大（前景） */}
        <Node ref={cut} opacity={0}>
          <Rect ref={trBoxC} position={[0, -140]} width={300} height={100} radius={14} fill={T.card} stroke={T.yellow} lineWidth={3}>
            <Txt fontSize={SIZE.body} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'转换'} />
          </Rect>
          <Rect ref={fmtBox} position={[-200, -140]} width={240} height={100} radius={14} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
            <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'转格式'} />
          </Rect>
          <Rect ref={cleanBox} position={[200, -140]} width={240} height={100} radius={14} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
            <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'清脏数据'} />
          </Rect>
          {['缺失值', '重复行', '错格式'].map((t, i) => (
            <Rect
              key={`dirty-${i}`}
              ref={dirtyChips[i]}
              position={[-320 + i * 320, -10]}
              width={220}
              height={60}
              radius={10}
              fill={T.card}
              stroke={T.red}
              lineWidth={2}
              opacity={0}
            >
              <Txt fontSize={SIZE.label} fill={T.red} fontFamily={FONT.sans} text={t} />
            </Rect>
          ))}
          {/* r6：每种脏数据一行真实例子（随名字牌一起出现、一起清掉） */}
          <Rect ref={dirtyEx[0]} position={[-320, 80]} width={220} height={64} radius={10} fill={T.card} stroke={T.red} lineWidth={2} opacity={0}>
            <Txt fontSize={SIZE.min} fill={T.muted} fontFamily={FONT.mono} text={'140102 | 31 | （空）'} />
          </Rect>
          <Rect ref={dirtyEx[1]} position={[0, 80]} width={220} height={64} radius={10} fill={T.card} stroke={T.red} lineWidth={2} opacity={0}>
            <Txt position={[0, -12]} fontSize={SIZE.min} fill={T.muted} fontFamily={FONT.mono} text={'140102 | 31 | 1'} />
            <Txt position={[0, 12]} fontSize={SIZE.min} fill={T.muted} fontFamily={FONT.mono} text={'140102 | 31 | 1'} />
          </Rect>
          <Rect ref={dirtyEx[2]} position={[320, 80]} width={220} height={64} radius={10} fill={T.card} stroke={T.red} lineWidth={2} opacity={0}>
            <Txt position={[0, -12]} fontSize={SIZE.min} fill={T.muted} fontFamily={FONT.mono} text={'应写：140102'} />
            <Txt position={[0, 12]} fontSize={SIZE.min} fill={T.muted} fontFamily={FONT.mono} text={'写成：2014/01/02'} />
          </Rect>
        </Node>
      </Node>
    </>
  );

  say('三路业务系统汇入一仓');
  yield* beat('i12',
    all(fig().opacity(1, 0.5), whBody().opacity(1, 0.5), whLid().opacity(1, 0.5), whLab().opacity(1, 0.4), zoneLab().opacity(1, 0.4)),
    at('三路业务系统', all(colChips[0]().opacity(1, 0.4), colChips[1]().opacity(1, 0.4), colChips[2]().opacity(1, 0.4), colGuides[0]().opacity(1, 0.4), colGuides[1]().opacity(1, 0.4), colGuides[2]().opacity(1, 0.4))),
    at('数据仓库', whBody().stroke(T.yellow, 0.5)),
  );

  say('销售库');
  yield* beat('i13',
    fig().scale(1.02, beat.dur('i13')),
    at('顾客', chain(heads[0]().opacity(1, 0.3), personLabs[0]().opacity(1, 0.3), appBoxes[0]().opacity(1, 0.4), dbBodies[0]().opacity(1, 0.4), dbLids[0]().opacity(1, 0.4))),
  );

  say('抽取：转储或更新流');
  yield* beat('i14',
    // r7：本拍 17.44s、旁白密但画面小改动少——fig 缓慢放大（i13/i15/i17 同法，实测能破定格），1.02→1.03（顶上库名框只剩 1px 余量，1.05 会裁切，见 frames 核对）。
    fig().scale(1.03, beat.dur('i14')),
    at('抽取', all(extArrows[0]().opacity(1, 0.4), trBoxes[0]().opacity(1, 0.4))),
    at('定期转储', dumpLab().opacity(1, 0.4)),
    at('选的是定期转储', methodLabs[0]().opacity(1, 0.4)),
    at('连续的更新流', streamLab().opacity(1, 0.4)),
    // r7：unpack 两个词的字面区别——念到哪种办法，哪种办法的标签变黄；两次转储之间数据会旧，出小标。
    at('隔一段时间', dumpLab().fill(T.yellow, 0.4)),
    at('数据一变', streamLab().fill(T.yellow, 0.4)),
    // r7：快照包沿抽取箭头下滑，破定格（转储慢 1.0s、更新流快 0.6s，呼应“隔一段时间拷一次”与“数据一变就送”）。
    at('隔一段时间', chain(snapPkt().opacity(1, 0.2), snapPkt().position([-380, 55], 1.0), snapPkt().opacity(0, 0.3))),
    at('数据一变', chain(snapPkt().position([-380, 6], 0), snapPkt().opacity(1, 0.15), snapPkt().position([-380, 55], 0.6), snapPkt().opacity(0, 0.3))),
    at('两次转储之间', staleTag().opacity(1, 0.4)),
    at('仓库里的数据是旧的', chain(staleTag().scale(1.12, 0.3), staleTag().scale(1, 0.3))),
  );

  say('库存库');
  yield* beat('i15',
    // r7：i14 到头 1.03，i15 改缩回 1.02（速率同 r6 的 0.15%/s），否则本拍无缩放动效会定格 3.45s；i17 再涨回 1.03。
    fig().scale(1.02, beat.dur('i15')),
    at('仓库工人', chain(heads[1]().opacity(1, 0.3), personLabs[1]().opacity(1, 0.3), appBoxes[1]().opacity(1, 0.4), dbBodies[1]().opacity(1, 0.4), dbLids[1]().opacity(1, 0.4))),
  );

  say('抽取 → 转换');
  yield* beat('i16',
    at('选的是连续更新流', methodLabs[1]().opacity(1, 0.4)),
    at('抽取', all(extArrows[1]().opacity(1, 0.4), trBoxes[1]().opacity(1, 0.4))),
    at('转换', trBoxes[1]().stroke(T.yellow, 0.4)),
    // r8 P2-2：更新流那路的新鲜度（与 i14 只讲转储那路“数据是旧的”对称），小标与 staleTag 对称出在另一侧空隙
    at('仓库里一直是新的', freshTag().opacity(1, 0.4)),
  );

  say('地理库');
  yield* beat('i17',
    // r7：承 i15 的 1.02 涨回 1.03（与 i15 对调，保持两拍都有缩放动效；顶上余量 1px，不超 1.03）。
    fig().scale(1.03, beat.dur('i17')),
    at('卡车司机', chain(heads[2]().opacity(1, 0.3), personLabs[2]().opacity(1, 0.3), appBoxes[2]().opacity(1, 0.4), dbBodies[2]().opacity(1, 0.4), dbLids[2]().opacity(1, 0.4))),
  );

  say('抽取 → 转换');
  yield* beat('i18',
    at('选的是定期转储', methodLabs[2]().opacity(1, 0.4)),
    at('抽取', all(extArrows[2]().opacity(1, 0.4), trBoxes[2]().opacity(1, 0.4))),
    at('转换', trBoxes[2]().stroke(T.yellow, 0.4)),
  );

  say('第二步：转换');
  yield* beat('i19',
    all(fig().opacity(0, 0.5), g19().opacity(1, 0.5), g19().scale(1.02, beat.dur('i19'))),
    at('转换', all(trBox19().opacity(1, 0.5), trTag19().opacity(1, 0.4), messy[0]().opacity(1, 0.3), messy[1]().opacity(1, 0.3), messy[2]().opacity(1, 0.3))),
  );

  say('转成适合分析的模式');
  yield* beat('i20',
    at('进了转换框', chain(
      all(messy[0]().position([0, -80], 0.6), messy[0]().opacity(0, 0.3)),
      all(messy[1]().position([0, -80], 0.6), messy[1]().opacity(0, 0.3)),
      all(messy[2]().position([0, -80], 0.6), messy[2]().opacity(0, 0.3)),
    )),
    at('整齐的分析表', tidyBox().opacity(1, 0.5)),
    at('这是销售这一路的表', salesTag().opacity(1, 0.4)),
    at('各归各的列', all(mapLines[0]().opacity(1, 0.3), mapLines[1]().opacity(1, 0.3), mapLines[2]().opacity(1, 0.3))),
    at('各有自己的分析表', all(invTable().opacity(1, 0.5), geoTable().opacity(1, 0.5))),
  );

  say('转格式 + 清脏数据');
  yield* beat('i21',
    all(W().opacity(0.25, 0.6), W().filters.blur(6, 0.6), cut().opacity(1, 0.6), trBox19().opacity(0, 0.4), trTag19().opacity(0, 0.4), tidyBox().opacity(0, 0.4), salesTag().opacity(0, 0.4), mapLines[0]().opacity(0, 0.4), mapLines[1]().opacity(0, 0.4), mapLines[2]().opacity(0, 0.4), invTable().opacity(0, 0.4), geoTable().opacity(0, 0.4)),
    at('先转格式', all(trBoxC().opacity(0, 0.4), fmtBox().opacity(1, 0.5))),
    at('再清脏数据', all(cleanBox().opacity(1, 0.5), dirtyChips[0]().opacity(1, 0.3), dirtyChips[1]().opacity(1, 0.3), dirtyChips[2]().opacity(1, 0.3), dirtyEx[0]().opacity(1, 0.3), dirtyEx[1]().opacity(1, 0.3), dirtyEx[2]().opacity(1, 0.3))),
  );

  say('清脏数据');
  yield* beat('i22',
    at('缺失值', chain(dirtyChips[0]().stroke(T.red, 0.3), all(dirtyChips[0]().opacity(0, 0.4), dirtyEx[0]().opacity(0, 0.4)))),
    at('重复行', chain(dirtyChips[1]().stroke(T.red, 0.3), all(dirtyChips[1]().opacity(0, 0.4), dirtyEx[1]().opacity(0, 0.4)))),
    at('错格式', chain(dirtyChips[2]().stroke(T.red, 0.3), all(dirtyChips[2]().opacity(0, 0.4), dirtyEx[2]().opacity(0, 0.4)))),
    at('消失了', all(fmtBox().stroke(T.green, 0.4), cleanBox().stroke(T.green, 0.4))),
  );

  say('三路各进各的分析表');
  yield* beat('i23',
    all(cut().opacity(0, 0.5), W().opacity(1, 0.6), W().filters.blur(0, 0.6), g19().opacity(0, 0.5), fig().opacity(1, 0.5), loadCount.node.opacity(1, 0.3)),
    at('三条加载箭头', sequence(1.2,
      chain(loadArrows[0]().opacity(1, 0.3), loadPkts[0].appear([COL_X[0], 125], 0.2), loadPkts[0].moveTo([COL_X[0], 150], 0.8), loadPkts[0].moveTo(LOAD_FINAL[0], 0.8), loadCount.bump()),
      chain(loadArrows[1]().opacity(1, 0.3), loadPkts[1].appear([COL_X[1], 125], 0.2), loadPkts[1].moveTo([COL_X[1], 150], 0.8), loadPkts[1].moveTo(LOAD_FINAL[1], 0.8), loadCount.bump()),
      chain(loadArrows[2]().opacity(1, 0.3), loadPkts[2].appear([COL_X[2], 125], 0.2), loadPkts[2].moveTo([COL_X[2], 150], 0.8), loadPkts[2].moveTo(LOAD_FINAL[2], 0.8), loadCount.bump()),
    )),
    at('汇入数据仓库', whBody().stroke(T.yellow, 0.5)),
  );

  say('抽取 · 转换 · 加载');
  yield* beat('i24',
    all(fig().opacity(0, 0.5), loadCount.node.opacity(0, 0.3), g24().opacity(1, 0.5)),
    at('加载', all(etlArrows[0]().opacity(1, 0.4), etlArrows[1]().opacity(1, 0.4), pkt24().opacity(1, 0.3), pkt24().position([380, 100], 1.2), whBody24().opacity(1, 0.4), whLid24().opacity(1, 0.4))),
    at('简称 ETL', etlPlate().opacity(1, 0.4)),
  );
});
