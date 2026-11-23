// U3 场景 2（MC）：b12–b18b —— 多对一、文档树装不下、join 的活挪到应用、
// 小列表放内存、字符串长出实体、点公司名弹出实体卡。
// 分镜：skill-ch02/beats-u3.md U3 一节；原文：DDIA §2.4（书页 p33–35，PDF p55–57）。
// 时长全部来自 timeline/u3.json（beat() 驱动），不手写 waitFor。
// 颜色、字号、安全区一律取自 lib/theme，不手写十六进制色值。
import {Circle, Line, Node, Path, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, chain, createRef} from '@motion-canvas/core';
import {at, makeBeats} from '../../lib/beats';
import {FONT, SAFE, SIZE, T} from '../../lib/theme';
import {row} from '../../lib/layout';
import timeline from '../../timeline/u3.json';

export default makeScene2D(function* (view) {
  view.fill(T.bg);
  const beat = makeBeats(timeline);

  const header = createRef<Txt>();
  const anchor = createRef<Txt>();
  const say = (text: string) => anchor().text(text);

  const g12 = createRef<Node>();
  const g12q = createRef<Txt>();
  const g13 = createRef<Node>();
  const g13dots = [0, 1, 2, 3, 4, 5].map(() => createRef<Circle>());
  const g13lines = [0, 1, 2, 3, 4, 5].map(() => createRef<Line>());
  const g13region = createRef<Rect>();
  const g14a = createRef<Node>();
  const g14aTree = createRef<Node>();
  const g14aArrows = [0, 1, 2].map(() => createRef<Line>());
  const g14aX = createRef<Txt>();
  const g14b = createRef<Node>();
  const g14bJoin = createRef<Txt>();
  const g15 = createRef<Node>();
  const g15tag = createRef<Rect>();
  const g15chipOk = createRef<Rect>();
  const g15chipNo = createRef<Rect>();
  const g15arrow = createRef<Line>();
  const g16a = createRef<Node>();
  const g16aList = createRef<Rect>();
  const g16aApp = createRef<Rect>();
  const g16b = createRef<Node>();
  const g16bLong = createRef<Line>();
  const g16bList = createRef<Txt>();
  const g17 = createRef<Node>();
  const g17text = createRef<Node>();
  const g17card = createRef<Rect>();
  const g17web = createRef<Txt>();
  const g18a = createRef<Node>();
  const g18aPtr = createRef<Path>();
  const g18aPop = createRef<Rect>();
  const g18b = createRef<Node>();
  const g18bEmp = createRef<Txt>();
  const g18bWeb = createRef<Txt>();
  const g18bHq = createRef<Txt>();
  const g18bInd = createRef<Txt>();

  const dotRow = row(6, 90, 40, [0, -180]);

  view.add(
    <>
      <Txt
        ref={header}
        position={[-SAFE.halfW, -SAFE.halfH]}
        offset={[-1, -1]}
        fontSize={SIZE.label}
        fill={T.muted}
        fontFamily={FONT.sans}
        text={'名字还是编号'}
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

      {/* b12：规范化 vs 反规范化，天平 */}
      <Node ref={g12} opacity={0}>
        <Line points={[[-400, 0], [400, 0]]} stroke={T.line} lineWidth={4} />
        <Line points={[[-320, 0], [-320, -80]]} stroke={T.line} lineWidth={2} />
        <Line points={[[320, 0], [320, -80]]} stroke={T.line} lineWidth={2} />
        <Rect position={[-320, -140]} width={300} height={120} radius={14} fill={T.card} stroke={T.blue} lineWidth={2}>
          <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'规范化'} />
        </Rect>
        <Rect position={[320, -140]} width={300} height={120} radius={14} fill={T.card} stroke={T.red} lineWidth={2}>
          <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'反规范化'} />
        </Rect>
        <Txt ref={g12q} position={[0, -240]} scale={0.3} fontSize={72} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'?'} opacity={0} />
      </Node>

      {/* b13：多对一箭头汇聚 */}
      <Node ref={g13} opacity={0}>
        {dotRow.map(([x, y], i) => (
          <Circle key={`g13d-${i}`} ref={g13dots[i]} position={[x, y]} width={44} height={44} fill={T.blue} opacity={0} />
        ))}
        {dotRow.map(([x, y], i) => (
          <Line key={`g13l-${i}`} ref={g13lines[i]} points={[[x, y + 22], [0, 30]]} stroke={T.line} lineWidth={2} endArrow opacity={0} />
        ))}
        <Rect ref={g13region} position={[0, 90]} width={340} height={110} radius={16} fill={T.card} stroke={T.blue} lineWidth={2}>
          <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'大西雅图地区'} />
        </Rect>
      </Node>

      {/* b14a：文档树装不下多对一 */}
      <Node ref={g14a} opacity={0}>
        <Node ref={g14aTree} opacity={0}>
          <Rect position={[-420, -40]} width={200} height={110} radius={16} fill={T.card} stroke={T.blue} lineWidth={3}>
            <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'用户'} />
          </Rect>
          {[0, 1, 2].map(i => (
            <Node key={`g14at-${i}`}>
              <Line points={[[-320, -40], [-120, -180 + i * 140]]} stroke={T.blue} lineWidth={3} />
              <Rect position={[20, -180 + i * 140]} width={280} height={90} radius={14} fill={T.card} stroke={T.blue} lineWidth={2}>
                <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={['工作 · 多份', '教育 · 几段', '联系方式 · 多个'][i]} />
              </Rect>
            </Node>
          ))}
        </Node>
        {[0, 1, 2].map(i => (
          <Line key={`g14aa-${i}`} ref={g14aArrows[i]} points={[[480, -180 + i * 140], [220, -180 + i * 140]]} stroke={T.red} lineWidth={3} endArrow opacity={0} />
        ))}
        <Txt ref={g14aX} position={[330, -110]} fontSize={64} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'✗'} opacity={0} />
      </Node>

      {/* b14b：关系表，join 很容易 */}
      <Node ref={g14b} opacity={0}>
        <Rect position={[-300, -60]} width={380} height={220} radius={14} fill={T.card} stroke={T.blue} lineWidth={2}>
          <Txt position={[0, -70]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.mono} text={'users'} />
          <Txt position={[0, -10]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'251 · Bill Gates'} />
          <Txt position={[0, 40]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'467 · …'} />
        </Rect>
        <Rect position={[300, -60]} width={380} height={220} radius={14} fill={T.card} stroke={T.green} lineWidth={2}>
          <Txt position={[0, -70]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.mono} text={'regions'} />
          <Txt position={[0, -10]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'us:91 · 大西雅图地区'} />
        </Rect>
        <Line points={[[-110, -60], [110, -60]]} stroke={T.yellow} lineWidth={2} endArrow />
        <Txt ref={g14bJoin} position={[0, 180]} fontSize={SIZE.title} fontWeight={700} fill={T.yellow} fontFamily={FONT.mono} text={'join'} opacity={0} />
      </Node>

      {/* b15：join 的活从库挪到应用 */}
      <Node ref={g15} opacity={0}>
        <Rect position={[-300, -60]} width={340} height={200} radius={16} fill={T.card} stroke={T.blue} lineWidth={2}>
          <Txt position={[0, -50]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'数据库'} />
          <Txt position={[0, 20]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'查数据'} />
        </Rect>
        <Rect position={[300, -60]} width={340} height={200} radius={16} fill={T.card} stroke={T.green} lineWidth={2}>
          <Txt position={[0, -50]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'应用代码'} />
          <Txt position={[0, 20]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'多次查询'} />
        </Rect>
        <Line ref={g15arrow} points={[[-130, -60], [130, -60]]} stroke={T.yellow} lineWidth={3} endArrow opacity={0} />
        <Rect ref={g15tag} position={[-300, 90]} width={160} height={60} radius={10} fill={T.card} stroke={T.yellow} lineWidth={2}>
          <Txt fontSize={SIZE.label} fontWeight={700} fill={T.yellow} fontFamily={FONT.mono} text={'join'} />
        </Rect>
        <Rect ref={g15chipOk} position={[-390, 180]} width={200} height={60} radius={10} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} text={'支持 join'} />
        </Rect>
        <Rect ref={g15chipNo} position={[-180, 180]} width={200} height={60} radius={10} fill={T.card} stroke={T.red} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.red} fontFamily={FONT.sans} text={'不支持'} />
        </Rect>
      </Node>

      {/* b16a：小列表飞进应用内存 */}
      <Node ref={g16a} opacity={0}>
        <Rect ref={g16aApp} position={[300, -60]} width={340} height={300} radius={16} fill={T.card} stroke={T.green} lineWidth={2}>
          <Txt position={[0, -110]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'应用 · 内存'} />
        </Rect>
        <Rect ref={g16aList} position={[-300, -60]} width={300} height={180} radius={14} fill={T.card} stroke={T.blue} lineWidth={2}>
          <Txt position={[0, -40]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'地区列表'} />
          <Txt position={[0, 10]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'行业列表'} />
          <Txt position={[0, 55]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'小 · 变化慢'} />
        </Rect>
      </Node>

      {/* b16b：查询箭头变短 */}
      <Node ref={g16b} opacity={0}>
        <Rect position={[-300, -60]} width={340} height={220} radius={16} fill={T.card} stroke={T.green} lineWidth={2}>
          <Txt position={[0, -70]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'应用 · 内存'} />
          <Txt ref={g16bList} position={[0, 0]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'地区 · 行业列表'} />
        </Rect>
        <Rect position={[300, -60]} width={340} height={220} radius={16} fill={T.card} stroke={T.blue} lineWidth={2}>
          <Txt position={[0, -70]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'数据库'} />
        </Rect>
        <Line ref={g16bLong} points={[[-130, -60], [130, -60]]} stroke={T.line} lineWidth={2} endArrow />
      </Node>

      {/* b17：经历栏里的公司名是字符串，长出实体卡（按原图经历栏读法） */}
      <Node ref={g17} opacity={0}>
        <Node ref={g17text}>
          <Txt position={[0, -150]} fontSize={SIZE.body} fill={T.muted} fontFamily={FONT.sans} text={'Co-founder, Chairman,'} />
          <Txt position={[0, -70]} fontSize={SIZE.title} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'Microsoft'} />
        </Node>
        <Rect ref={g17card} position={[0, -60]} width={520} height={320} radius={20} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Rect position={[-180, -100]} width={90} height={90} radius={10} fill={T.line} />
          <Txt position={[-180, -100]} fontSize={SIZE.label} fill={T.bg} fontFamily={FONT.sans} text={'logo'} />
          <Txt position={[40, -120]} fontSize={SIZE.title} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'Microsoft'} />
          <Txt ref={g17web} position={[40, -60]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'自己的网页'} />
          <Txt position={[40, 0]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'新闻源'} />
        </Rect>
      </Node>

      {/* b18a：经历栏两行，光标点 Microsoft，弹出实体卡（按原图截图读法，不复现界面） */}
      <Node ref={g18a} opacity={0}>
        <Txt position={[-560, -200]} offset={[-1, 0]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'经历'} />
        <Txt position={[-560, -150]} offset={[-1, 0]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'Co-chair · Bill & Melinda Gates Foundation'} />
        <Txt position={[-560, -110]} offset={[-1, 0]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'2000 – 现在'} />
        <Txt position={[-560, -50]} offset={[-1, 0]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'Co-founder, Chairman,'} />
        <Txt position={[-560, 10]} offset={[-1, 0]} fontSize={SIZE.body} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'Microsoft'} />
        <Txt position={[-560, 60]} offset={[-1, 0]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'1975 – 现在'} />
        <Path ref={g18aPtr} key="qa-ignore-光标点在可点文字上" position={[-430, -5]} data={'M 0 0 L 0 30 L 8 22 L 12 32 L 17 30 L 13 20 L 22 20 Z'} fill={T.white} stroke={T.bg} lineWidth={1} opacity={0} />
        <Rect ref={g18aPop} position={[220, -60]} width={480} height={300} radius={20} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Rect position={[-160, -90]} width={90} height={90} radius={10} fill={T.line} />
          <Txt position={[-160, -90]} fontSize={SIZE.label} fill={T.bg} fontFamily={FONT.sans} text={'logo'} />
          <Txt position={[30, -110]} fontSize={SIZE.title} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'Microsoft'} />
          <Txt position={[30, -50]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'公司实体卡片'} />
        </Rect>
      </Node>

      {/* b18b：卡片详情亮起 */}
      <Node ref={g18b} opacity={0}>
        <Rect position={[0, -50]} width={560} height={400} radius={20} fill={T.card} stroke={T.green} lineWidth={2}>
          <Txt position={[0, -160]} fontSize={SIZE.title} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'Microsoft'} />
          <Txt position={[0, -105]} maxWidth={480} textWrap fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'简介：做你热爱的事，帮助全世界的人和企业实现全部潜能。'} />
          <Txt ref={g18bEmp} position={[0, -35]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.mono} text={'10,001+ 员工'} opacity={0} />
          <Txt ref={g18bWeb} position={[0, 15]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.mono} text={'网址：microsoft.com'} opacity={0} />
          <Txt ref={g18bHq} position={[0, 65]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'总部：大西雅图地区'} opacity={0} />
          <Txt ref={g18bInd} position={[0, 115]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'行业：计算机软件'} opacity={0} />
        </Rect>
      </Node>
    </>
  );

  say('先不评判，后面再讲');
  yield* beat('b12',
    all(g12().opacity(1, 0.5)),
    at('先不评判', all(g12q().opacity(1, 0.3), g12q().scale(1, 0.4))),
  );

  say('多对一：许多人 → 一处');
  yield* beat('b13',
    all(g12().opacity(0, 0.5), g13().opacity(1, 0.5)),
    at('多对一关系', chain(...g13dots.map(d => d().opacity(1, 0.2)), ...g13lines.map(l => l().opacity(1, 0.2)))),
    at('同一个地区', g13region().stroke(T.green, 0.4)),
  );

  say('文档树装不下多对一');
  yield* beat('b14a',
    all(g13().opacity(0, 0.5), g14a().opacity(1, 0.5)),
    at('文档是一棵树', g14aTree().opacity(1, 0.5)),
    at('只能待在一个地方', all(...g14aArrows.map(a => a().opacity(1, 0.4)), g14aX().opacity(1, 0.4))),
  );

  say('关系库里 join 很容易');
  yield* beat('b14b',
    all(g14a().opacity(0, 0.5), g14b().opacity(1, 0.5)),
    at('join', g14bJoin().opacity(1, 0.5)),
  );

  say('join 的活挪到应用');
  yield* beat('b15',
    all(g14b().opacity(0, 0.5), g15().opacity(1, 0.5)),
    at('join 往往很弱', g15arrow().opacity(1, 0.5)),
    at('那时候有的库支持', all(g15chipOk().opacity(1, 0.4), g15chipOk().position([-390, 150], 0.4), g15chipNo().opacity(1, 0.4), g15chipNo().position([-180, 150], 0.4))),
    at('那就只能在应用代码里', chain(g15tag().position([300, 90], 1.2))),
    at('模拟 join', g15tag().stroke(T.green, 0.4)),
  );

  say('小列表放内存');
  yield* beat('b16a',
    all(g15().opacity(0, 0.5), g16a().opacity(1, 0.5)),
    at('变化又慢', chain(g16aList().scale(1.06, 0.3), g16aList().scale(1, 0.3))),
    at('放进内存', chain(g16aList().position([300, 0], 0.8), g16aApp().stroke(T.green, 0.4))),
  );

  say('不用每次都查库');
  yield* beat('b16b',
    all(g16a().opacity(0, 0.5), g16b().opacity(1, 0.5)),
    at('不用每次都查库', all(g16bLong().opacity(0.15, 0.5), g16bList().fill(T.green, 0.5))),
  );

  say('字符串长出实体');
  yield* beat('b17',
    all(g16b().opacity(0, 0.5), g17().opacity(1, 0.5)),
    at('越连越多', chain(g17text().scale(1.05, 0.3), g17text().scale(1, 0.3))),
    at('不该只是字符串', all(g17text().opacity(0, 0.4), g17card().opacity(1, 0.5))),
    at('它们该是实体', chain(g17card().scale(1.03, 0.4), g17card().scale(1, 0.4))),
    at('网页', g17web().fill(T.green, 0.4)),
  );

  say('点公司名，弹出实体卡');
  yield* beat('b18a',
    all(g17().opacity(0, 0.5), g18a().opacity(1, 0.5)),
    at('点一下公司名', g18aPtr().opacity(1, 0.4)),
    at('一张公司卡片', g18aPop().opacity(1, 0.5)),
  );

  say('10,001+ 员工');
  yield* beat('b18b',
    all(g18a().opacity(0, 0.5), g18b().opacity(1, 0.5)),
    at('一万多名员工', all(g18bEmp().opacity(1, 0.5), g18bWeb().opacity(1, 0.5))),
    at('总部在大西雅图地区', all(g18bHq().opacity(1, 0.5), g18bInd().opacity(1, 0.5))),
  );
});
