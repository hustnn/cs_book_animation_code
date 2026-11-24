// U9 场景 2（MC）：b11–b18 —— 转换框展开（按正文展开：转格式 + 清脏数据）、
// 加载与 ETL、Figure 3-8（三列业务系统汇入数据仓库）、大企业有、小公司没有。
// 分镜：skill-ch03/beats-u9.md；原文：DDIA §3.8（书页 p92，PDF p114）。
// Figure 3-8 按处置“改编”：三列（顾客→电商网站→销售数据库、仓库工人→库存管理应用→
// 库存数据库、卡车司机→车辆路线规划器→地理数据库）与箭头读法按原图重新生成；
// 小人图标改为示意人物，不复刻原图画风。
// 时长全部来自 timeline/u9.json（beat() 驱动），不手写 waitFor。
import {Circle, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, chain, createRef} from '@motion-canvas/core';
import {at, makeBeats} from '../../lib/beats';
import {FONT, SAFE, SIZE, T} from '../../lib/theme';
import timeline from '../../timeline/u9.json';

const COL_X = [-380, 0, 380];
const PERSON = ['顾客', '仓库工人', '卡车司机'];
const APP = ['电商网站', '库存管理应用', '车辆路线规划器'];
const DB = ['销售数据库', '库存数据库', '地理数据库'];

export default makeScene2D(function* (view) {
  view.fill(T.bg);
  const beat = makeBeats(timeline);

  const header = createRef<Txt>();
  const anchor = createRef<Txt>();
  const say = (text: string) => anchor().text(text);

  // ---- b11：转换框展开 ----
  const g11 = createRef<Node>();
  const trBox = createRef<Rect>();
  const fmtBox = createRef<Rect>();
  const cleanBox = createRef<Rect>();
  const dirtyChips = [0, 1, 2].map(() => createRef<Rect>());
  const expandTag = createRef<Txt>();

  // ---- b12：加载 + ETL ----
  const g12 = createRef<Node>();
  const etlBoxes = [0, 1, 2].map(() => createRef<Rect>());
  const etlArrows = [0, 1].map(() => createRef<Line>());
  const etlPlate = createRef<Txt>();
  const whBody12 = createRef<Rect>();
  const whLid12 = createRef<Circle>();
  const pkt12 = createRef<Circle>();

  // ---- b13–b15：Figure 3-8 ----
  const fig = createRef<Node>();
  const colGuides = [0, 1, 2].map(() => createRef<Rect>());
  const heads = [0, 1, 2].map(() => createRef<Circle>());
  const personLabs = [0, 1, 2].map(() => createRef<Txt>());
  const appBoxes = [0, 1, 2].map(() => createRef<Rect>());
  const dbBodies = [0, 1, 2].map(() => createRef<Rect>());
  const dbLids = [0, 1, 2].map(() => createRef<Circle>());
  const trBoxes = [0, 1, 2].map(() => createRef<Rect>());
  const extArrows = [0, 1, 2].map(() => createRef<Line>());
  const loadArrows = [0, 1, 2].map(() => createRef<Line>());
  const whBody = createRef<Rect>();
  const whLid = createRef<Circle>();
  const whLab = createRef<Txt>();
  const analyst = createRef<Rect>();
  const qArrow = createRef<Line>();
  const zoneLab = createRef<Txt>();

  // ---- b16–b18：大企业 / 小公司 ----
  const g16 = createRef<Node>();
  const bigCard = createRef<Rect>();
  const bigWh = createRef<Rect>();
  const bigTick = createRef<Txt>();
  const smallCard = createRef<Rect>();
  const smallX = createRef<Txt>();
  const smallDb = createRef<Rect>();
  const sheetCard = createRef<Rect>();
  const miniChips = [0, 1, 2].map(() => createRef<Rect>());
  const heavyTag = createRef<Txt>();

  view.add(
    <>
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

      {/* b11：转换框展开 */}
      <Node ref={g11} opacity={0}>
        <Rect ref={trBox} position={[0, -140]} width={300} height={100} radius={14} fill={T.card} stroke={T.yellow} lineWidth={3}>
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
        <Txt ref={expandTag} position={[0, 80]} fontSize={SIZE.label} fill={T.purple} fontFamily={FONT.sans} text={'按正文展开'} opacity={0} />
      </Node>

      {/* b12：加载 + ETL */}
      <Node ref={g12} opacity={0}>
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
        <Rect ref={whBody12} position={[380, 170]} width={260} height={80} radius={14} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'数据仓库'} />
        </Rect>
        <Circle ref={whLid12} position={[380, 130]} width={260} height={34} fill={T.bg} stroke={T.blue} lineWidth={2} opacity={0} />
        <Circle ref={pkt12} position={[380, -35]} width={22} height={22} fill={T.yellow} opacity={0} />
      </Node>

      {/* b13–b15：Figure 3-8 */}
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
          <Circle key={`head-${i}`} ref={heads[i]} position={[COL_X[i], -282]} width={30} height={30} fill={T.bg} stroke={T.text} lineWidth={2} opacity={0} />
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
        {[0, 1, 2].map(i => (
          <Line
            key={`load-${i}`}
            ref={loadArrows[i]}
            points={[[COL_X[i], 120], [COL_X[i], 145], [[-20, 150, 320][i], 158]]}
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
      </Node>

      {/* b16–b18：大企业 / 小公司 */}
      <Node ref={g16} opacity={0}>
        <Rect ref={bigCard} position={[-300, -80]} width={360} height={220} radius={16} fill={T.card} stroke={T.line} lineWidth={2}>
          <Txt position={[0, -80]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'大企业'} />
        </Rect>
        <Rect ref={bigWh} position={[-300, -10]} width={260} height={80} radius={14} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'数据仓库'} />
        </Rect>
        <Txt ref={bigTick} position={[-300, 60]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} text={'几乎家家都有'} opacity={0} />
        <Rect ref={smallCard} position={[300, -80]} width={360} height={220} radius={16} fill={T.card} stroke={T.line} lineWidth={2}>
          <Txt position={[0, -80]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'小公司'} />
        </Rect>
        <Txt ref={smallX} position={[300, -10]} fontSize={SIZE.title} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'✕ 没有仓库'} opacity={0} />
        <Rect ref={smallDb} position={[300, -10]} width={260} height={80} radius={14} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'常规数据库'} />
        </Rect>
        <Rect ref={sheetCard} position={[300, 90]} width={260} height={64} radius={12} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'电子表格也能分析'} />
        </Rect>
        {[0, 1, 2].map(i => (
          <Rect
            key={`chip-${i}`}
            ref={miniChips[i]}
            position={[-420 + i * 120, 120]}
            width={110}
            height={44}
            radius={10}
            fill={T.card}
            stroke={T.red}
            lineWidth={2}
            opacity={0}
          >
            <Txt fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={['网站', '收银', '库存'][i]} />
          </Rect>
        ))}
        <Txt ref={heavyTag} position={[-300, 195]} fontSize={SIZE.label} fill={T.red} fontFamily={FONT.sans} text={'费大力气'} opacity={0} />
      </Node>
    </>
  );

  say('转格式 + 清脏数据');
  yield* beat('b11',
    all(g11().opacity(1, 0.5)),
    at('先转格式', all(trBox().opacity(0, 0.4), fmtBox().opacity(1, 0.5))),
    at('再清脏数据', all(cleanBox().opacity(1, 0.5), dirtyChips[0]().opacity(1, 0.3), dirtyChips[1]().opacity(1, 0.3), dirtyChips[2]().opacity(1, 0.3))),
    at('按正文展开', all(expandTag().opacity(1, 0.4), dirtyChips[0]().stroke(T.muted, 0.4), dirtyChips[1]().stroke(T.muted, 0.4), dirtyChips[2]().stroke(T.muted, 0.4))),
  );

  say('抽取 · 转换 · 加载');
  yield* beat('b12',
    all(g11().opacity(0, 0.5), g12().opacity(1, 0.5)),
    at('加载', all(etlArrows[0]().opacity(1, 0.4), etlArrows[1]().opacity(1, 0.4), pkt12().opacity(1, 0.3), pkt12().position([380, 100], 1.2), whBody12().opacity(1, 0.4), whLid12().opacity(1, 0.4))),
    at('简称 ETL', etlPlate().opacity(1, 0.4)),
  );

  say('三列业务系统汇入一仓');
  yield* beat('b13',
    all(g12().opacity(0, 0.5), fig().opacity(1, 0.5), whBody().opacity(1, 0.5), whLid().opacity(1, 0.5), whLab().opacity(1, 0.4), zoneLab().opacity(1, 0.4)),
    at('三列业务系统', chain(colGuides[0]().opacity(1, 0.4), colGuides[1]().opacity(1, 0.4), colGuides[2]().opacity(1, 0.4))),
    at('数据仓库', whBody().stroke(T.yellow, 0.5)),
  );

  say('销售、库存、地理库');
  yield* beat('b14',
    fig().scale(1.02, beat.dur('b14')),
    at('顾客', chain(heads[0]().opacity(1, 0.3), personLabs[0]().opacity(1, 0.3), appBoxes[0]().opacity(1, 0.4), dbBodies[0]().opacity(1, 0.4), dbLids[0]().opacity(1, 0.4))),
    at('仓库工人', chain(heads[1]().opacity(1, 0.3), personLabs[1]().opacity(1, 0.3), appBoxes[1]().opacity(1, 0.4), dbBodies[1]().opacity(1, 0.4), dbLids[1]().opacity(1, 0.4))),
    at('卡车司机', chain(heads[2]().opacity(1, 0.3), personLabs[2]().opacity(1, 0.3), appBoxes[2]().opacity(1, 0.4), dbBodies[2]().opacity(1, 0.4), dbLids[2]().opacity(1, 0.4))),
  );

  say('汇入仓库，分析师查仓库');
  yield* beat('b15',
    at('抽取', chain(extArrows[0]().opacity(1, 0.4), trBoxes[0]().opacity(1, 0.4), extArrows[1]().opacity(1, 0.4), trBoxes[1]().opacity(1, 0.4), extArrows[2]().opacity(1, 0.4), trBoxes[2]().opacity(1, 0.4))),
    at('转换', all(trBoxes[0]().stroke(T.yellow, 0.4), trBoxes[1]().stroke(T.yellow, 0.4), trBoxes[2]().stroke(T.yellow, 0.4))),
    at('加载箭头', chain(loadArrows[0]().opacity(1, 0.4), loadArrows[1]().opacity(1, 0.4), loadArrows[2]().opacity(1, 0.4))),
    at('业务分析师', all(analyst().opacity(1, 0.4), qArrow().opacity(1, 0.5))),
  );

  say('大企业有，小公司没有');
  yield* beat('b16',
    all(fig().opacity(0, 0.5), g16().opacity(1, 0.5)),
    at('大企业', all(bigWh().opacity(1, 0.4), bigTick().opacity(1, 0.4))),
    at('小公司', smallX().opacity(1, 0.4)),
  );

  say('小数据，表格也够');
  yield* beat('b17',
    at('常规数据库', all(smallX().opacity(0, 0.4), smallDb().opacity(1, 0.4))),
    at('电子表格', sheetCard().opacity(1, 0.4)),
  );

  say('大公司费大力气');
  yield* beat('b18',
    at('费大力气', all(
      chain(miniChips[0]().opacity(1, 0.2), miniChips[1]().opacity(1, 0.2), miniChips[2]().opacity(1, 0.2), heavyTag().opacity(1, 0.3)),
      bigCard().stroke(T.red, 0.5),
    )),
  );
});
