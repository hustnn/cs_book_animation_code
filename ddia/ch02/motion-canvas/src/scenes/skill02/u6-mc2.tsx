// U6 场景 2（MC）：b14–b25b —— 顺序与优化、并行、浏览器 CSS 例子。
// 分镜：skill-ch02/beats-u6.md；原文：DDIA §2.7 末–§2.8（书页 p43–45）。
// 时长全部来自 timeline/u6.json（beat() 驱动），不手写 waitFor。
import {Circle, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, chain, createRef} from '@motion-canvas/core';
import {at, makeBeats} from '../../lib/beats';
import {FONT, SAFE, SIZE, T} from '../../lib/theme';
import {column, row} from '../../lib/layout';
import timeline from '../../timeline/u6.json';

export default makeScene2D(function* (view) {
  view.fill(T.bg);
  const beat = makeBeats(timeline);

  const header = createRef<Txt>();
  const anchor = createRef<Txt>();
  const say = (text: string) => anchor().text(text);

  const g14 = createRef<Node>();
  const g14sql = createRef<Rect>();
  const g14idx = createRef<Txt>();
  const g14join = createRef<Txt>();
  const g14bar = createRef<Rect>();
  const g15a = createRef<Node>();
  const g15aLab = createRef<Txt>();
  const g15b = createRef<Node>();
  const g15bRows = [0, 1, 2, 3, 4].map(() => createRef<Rect>());
  const g15bTxts = [0, 1, 2, 3, 4].map(() => createRef<Txt>());
  const g15bFrags = [0, 1, 2].map(() => createRef<Rect>());
  const g16 = createRef<Node>();
  const g16q = createRef<Txt>();
  const g16sql = createRef<Rect>();
  const g16imp = createRef<Rect>();
  const g16x = createRef<Txt>();
  const g17 = createRef<Node>();
  const g17lock = createRef<Rect>();
  const g17box = createRef<Rect>();
  const g17c = createRef<Node>();
  const g17cBox = createRef<Rect>();
  const g17cCheck = createRef<Txt>();
  const g18 = createRef<Node>();
  const g18freq = createRef<Txt>();
  const g18cores = [0, 1, 2, 3].map(() => createRef<Rect>());
  const g18n = createRef<Txt>();
  const g19 = createRef<Node>();
  const g19cores = [0, 1, 2, 3].map(() => createRef<Rect>());
  const g19x = createRef<Txt>();
  const g20 = createRef<Node>();
  const g20res = createRef<Txt>();
  const g20cores = [0, 1, 2, 3].map(() => createRef<Rect>());
  const g21 = createRef<Node>();
  const g21win = createRef<Rect>();
  const g22 = createRef<Node>();
  const g22sel = createRef<Rect>();
  const g22shark = createRef<Rect>();
  const g23 = createRef<Node>();
  const g23css = createRef<Rect>();
  const g23blue = createRef<Rect>();
  const g23title = createRef<Txt>();
  const g24 = createRef<Node>();
  const g24segs = [0, 1, 2].map(() => createRef<Txt>());
  const g24ok = createRef<Txt>();
  const g24no = createRef<Txt>();
  const g25a = createRef<Node>();
  const g25aXsl = createRef<Rect>();
  const g25b = createRef<Node>();
  const g25bEq = createRef<Txt>();
  const g25bTitle = createRef<Txt>();

  const listRows = column(5, 70, 20, [-300, 0]);
  const species = ['1 鲨鱼', '2 鲸鱼', '3 鲨鱼', '4 海豚', '5 鲨鱼'];
  const coreRow = row(4, 90, 20, [300, -40]);
  const coreRow2 = row(4, 150, 30, [0, 40]);

  view.add(
    <>
      <Txt
        ref={header}
        position={[-SAFE.halfW, -SAFE.halfH]}
        offset={[-1, -1]}
        fontSize={SIZE.label}
        fill={T.muted}
        fontFamily={FONT.sans}
        text={'只说要什么'}
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

      {/* b14：查询不动，引擎变快 */}
      <Node ref={g14} opacity={0}>
        <Rect ref={g14sql} position={[0, -220]} width={760} height={90} radius={14} fill={T.card} stroke={T.green} lineWidth={2}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={"SELECT * FROM animals WHERE family = 'Sharks'"} />
        </Rect>
        <Rect position={[0, 30]} width={900} height={300} radius={18} fill={T.card} stroke={T.line} lineWidth={2}>
          <Txt position={[0, -120]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'数据库引擎'} />
        </Rect>
        <Txt ref={g14idx} position={[-220, -20]} fontSize={SIZE.label} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'索引 ✓ 已换新'} opacity={0} />
        <Txt ref={g14join} position={[220, -20]} fontSize={SIZE.label} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'连接方法 ✓ 已换新'} opacity={0} />
        <Rect position={[0, 90]} width={700} height={30} radius={15} fill={T.line} />
        <Rect ref={g14bar} position={[-350, 90]} offset={[-1, 0]} width={60} height={30} radius={15} fill={T.green} />
        <Txt position={[0, 140]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'查询速度'} />
      </Node>

      {/* b15a：名单有固定顺序 */}
      <Node ref={g15a} opacity={0}>
        {listRows.map(([x, y], i) => (
          <Rect key={`g15ar-${i}`} position={[x, y]} width={360} height={70} radius={10} fill={T.card} stroke={T.line} lineWidth={2}>
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={species[i]} />
          </Rect>
        ))}
        <Line points={[[-80, -180], [-80, 180]]} stroke={T.muted} lineWidth={2} />
        <Txt ref={g15aLab} position={[300, -60]} fontSize={SIZE.title} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'固定顺序'} opacity={0} />
      </Node>

      {/* b15b：挪动记录，顺序变了 */}
      <Node ref={g15b} opacity={0}>
        {listRows.map(([x, y], i) => (
          <Rect key={`g15br-${i}`} ref={g15bRows[i]} position={[x, y]} width={360} height={70} radius={10} fill={T.card} stroke={T.line} lineWidth={2}>
            <Txt ref={g15bTxts[i]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={species[i]} />
          </Rect>
        ))}
        {[0, 1, 2].map(i => (
          <Rect key={`g15bf-${i}`} ref={g15bFrags[i]} position={[300, -120 + i * 120]} width={220} height={80} radius={10} fill={T.card} stroke={T.muted} lineWidth={2} opacity={0}>
            <Txt fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'磁盘碎块'} />
          </Rect>
        ))}
      </Node>

      {/* b16：SQL 不在意顺序，命令式不敢动 */}
      <Node ref={g16} opacity={0}>
        <Txt ref={g16q} position={[0, -230]} fontSize={72} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'?'} opacity={0} />
        <Rect ref={g16sql} position={[-300, 0]} width={400} height={220} radius={16} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt position={[0, -60]} fontSize={SIZE.body} fontWeight={700} fill={T.green} fontFamily={FONT.mono} text={'SQL'} />
          <Txt position={[0, 0]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'不保证顺序'} />
          <Txt position={[0, 60]} fontSize={SIZE.label} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'没关系 ✓'} />
        </Rect>
        <Rect ref={g16imp} position={[300, 0]} width={400} height={220} radius={16} fill={T.card} stroke={T.red} lineWidth={2} opacity={0}>
          <Txt position={[0, -60]} fontSize={SIZE.body} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'命令式代码'} />
          <Txt position={[0, 0]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'写死顺序'} />
          <Txt ref={g16x} position={[0, 60]} fontSize={SIZE.label} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'不敢动 ✗'} opacity={0} />
        </Rect>
      </Node>

      {/* b17：限制换来空间 */}
      <Node ref={g17} opacity={0}>
        <Rect ref={g17lock} position={[-300, -60]} width={220} height={220} radius={20} fill={T.card} stroke={T.yellow} lineWidth={3}>
          <Txt fontSize={SIZE.title} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'限制'} />
        </Rect>
        <Txt position={[0, -60]} fontSize={56} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'→'} />
        <Rect ref={g17box} position={[300, -60]} width={380} height={220} radius={16} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'自动优化空间'} />
        </Rect>
      </Node>

      {/* b17c：限制换来了自由 */}
      <Node ref={g17c} opacity={0}>
        <Rect position={[-300, -60]} width={220} height={220} radius={20} fill={T.card} stroke={T.green} lineWidth={3}>
          <Txt fontSize={SIZE.title} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'限制'} />
        </Rect>
        <Txt ref={g17cCheck} position={[-300, 105]} fontSize={56} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'✓ 打开了'} opacity={0} />
        <Txt position={[0, -60]} fontSize={56} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'→'} />
        <Rect ref={g17cBox} position={[300, -60]} width={380} height={220} radius={16} fill={T.card} stroke={T.green} lineWidth={3}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'自动优化空间'} />
        </Rect>
        <Txt position={[300, 120]} fontSize={SIZE.title} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'自由'} />
      </Node>

      {/* b18：靠加核变快 */}
      <Node ref={g18} opacity={0}>
        <Rect position={[-320, -40]} width={340} height={220} radius={16} fill={T.card} stroke={T.line} lineWidth={2}>
          <Txt position={[0, -70]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'单核'} />
        </Rect>
        <Rect position={[-320, 20]} width={300} height={24} radius={12} fill={T.line} />
        <Rect position={[-320, 20]} width={280} height={24} radius={12} fill={T.muted} />
        <Txt ref={g18freq} position={[-320, 105]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'主频：几乎不动'} opacity={0} />
        {coreRow.map(([x, y], i) => (
          <Rect key={`g18c-${i}`} ref={g18cores[i]} position={[x, y]} width={90} height={90} radius={12} fill={T.card} stroke={T.line} lineWidth={2} opacity={0}>
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'核'} />
          </Rect>
        ))}
        <Txt ref={g18n} position={[300, 80]} fontSize={SIZE.title} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'4 核'} opacity={0} />
      </Node>

      {/* b19：单链拆不开 */}
      <Node ref={g19} opacity={0}>
        {row(4, 150, 30, [0, -120]).map(([x, y], i) => (
          <Rect key={`g19s-${i}`} position={[x, y]} width={150} height={90} radius={12} fill={T.card} stroke={T.blue} lineWidth={2}>
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={`步骤 ${i + 1}`} />
          </Rect>
        ))}
        <Line points={[[-300, -30], [300, -30]]} stroke={T.blue} lineWidth={3} />
        <Txt position={[0, 10]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'一条链，必须按顺序'} />
        {coreRow2.map(([x, y], i) => (
          <Rect key={`g19c-${i}`} ref={g19cores[i]} position={[x, y + 80]} width={150} height={90} radius={12} fill={T.card} stroke={T.line} lineWidth={2} opacity={0}>
            <Txt fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'核 · 空闲'} />
          </Rect>
        ))}
        <Txt ref={g19x} position={[0, 230]} fontSize={SIZE.title} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'拆不开 ✗'} opacity={0} />
      </Node>

      {/* b20：结果定，算法自由 */}
      <Node ref={g20} opacity={0}>
        <Circle position={[0, -180]} width={110} height={110} stroke={T.yellow} lineWidth={3} />
        <Circle position={[0, -180]} width={36} height={36} fill={T.yellow} />
        <Txt ref={g20res} position={[0, -80]} fontSize={SIZE.body} fontWeight={700} fill={T.text} fontFamily={FONT.sans} text={'结果：3 条鲨鱼'} opacity={0} />
        {coreRow2.map(([x, y], i) => (
          <Rect key={`g20c-${i}`} ref={g20cores[i]} position={[x, y]} width={150} height={90} radius={12} fill={T.card} stroke={T.line} lineWidth={2} opacity={0}>
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'各算一块'} />
          </Rect>
        ))}
        <Txt position={[0, 150]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'四个核同时算，结果汇到一处'} />
      </Node>

      {/* b21：换个地方：浏览器 */}
      <Node ref={g21} opacity={0}>
        <Rect ref={g21win} position={[0, -20]} width={900} height={380} radius={18} fill={T.card} stroke={T.line} lineWidth={2}>
          <Rect position={[0, -160]} width={900} height={60} radius={18} fill={T.line} />
          <Txt position={[0, -160]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'海洋动物网站'} />
        </Rect>
        <Txt position={[0, 60]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'浏览器里的页面，也要查数据、定样式'} />
      </Node>

      {/* b22：鲨鱼页已选 */}
      <Node ref={g22} opacity={0}>
        <Rect position={[0, -20]} width={900} height={380} radius={18} fill={T.card} stroke={T.line} lineWidth={2}>
          <Rect position={[0, -160]} width={900} height={60} radius={18} fill={T.line} />
          <Txt position={[0, -160]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'海洋动物网站'} />
        </Rect>
        <Rect ref={g22shark} position={[-220, -60]} width={360} height={90} radius={12} fill={T.card} stroke={T.line} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'鲨鱼'} />
        </Rect>
        <Rect position={[-220, 60]} width={360} height={90} radius={12} fill={T.card} stroke={T.line} lineWidth={2}>
          <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'鲸鱼'} />
        </Rect>
        <Rect ref={g22sel} position={[-220, -60]} width={380} height={106} radius={14} stroke={T.yellow} lineWidth={3} opacity={0} />
        <Txt position={[280, -60]} fontSize={SIZE.label} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'已选'} />
      </Node>

      {/* b23：一行 CSS，鲨鱼标题变蓝 */}
      <Node ref={g23} opacity={0}>
        <Rect position={[-220, -100]} width={360} height={90} radius={12} fill={T.card} stroke={T.yellow} lineWidth={2}>
          <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'鲨鱼'} />
        </Rect>
        <Rect position={[-220, 20]} width={360} height={90} radius={12} fill={T.card} stroke={T.line} lineWidth={2}>
          <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'鲸鱼'} />
        </Rect>
        <Rect ref={g23blue} position={[280, -100]} width={360} height={90} radius={12} fill={T.blue} opacity={0} />
        <Txt ref={g23title} position={[280, -100]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'鲨鱼'} />
        <Rect ref={g23css} position={[0, 170]} width={940} height={80} radius={12} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'li.selected > p { background-color: blue; }'} />
        </Rect>
      </Node>

      {/* b24：鲨鱼符合，鲸鱼不符 */}
      <Node ref={g24} opacity={0}>
        <Txt ref={g24segs[0]} position={[-220, -200]} fontSize={SIZE.title} fontWeight={700} fill={T.text} fontFamily={FONT.mono} text={'li.selected'} />
        <Txt ref={g24segs[1]} position={[0, -200]} fontSize={SIZE.title} fontWeight={700} fill={T.text} fontFamily={FONT.mono} text={'>'} />
        <Txt ref={g24segs[2]} position={[220, -200]} fontSize={SIZE.title} fontWeight={700} fill={T.text} fontFamily={FONT.mono} text={'p'} />
        <Rect position={[-220, -80]} width={360} height={90} radius={12} fill={T.blue}>
          <Txt fontSize={SIZE.body} fontWeight={700} fill={T.white} fontFamily={FONT.sans} text={'鲨鱼'} />
        </Rect>
        <Txt ref={g24ok} position={[120, -80]} fontSize={SIZE.title} fontWeight={700} fill={T.green} fontFamily={FONT.sans} text={'✓ 符合'} opacity={0} />
        <Rect position={[-220, 40]} width={360} height={90} radius={12} fill={T.card} stroke={T.line} lineWidth={2}>
          <Txt fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'鲸鱼'} />
        </Rect>
        <Txt ref={g24no} position={[120, 40]} fontSize={SIZE.title} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'✗ 不符'} opacity={0} />
        <Txt position={[0, 160]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'鲸鱼的父项没有已选标记'} />
      </Node>

      {/* b25a：换一种样式表语言 */}
      <Node ref={g25a} opacity={0}>
        <Rect position={[0, -140]} width={940} height={90} radius={12} fill={T.card} stroke={T.green} lineWidth={2}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'li.selected > p { background-color: blue; }'} />
        </Rect>
        <Rect ref={g25aXsl} position={[0, 0]} width={940} height={90} radius={12} fill={T.card} stroke={T.purple} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'<xsl:template match="li[@class=\'selected\']/p">'} />
        </Rect>
      </Node>

      {/* b25b：路径表达式等价 */}
      <Node ref={g25b} opacity={0}>
        <Rect position={[0, -140]} width={940} height={90} radius={12} fill={T.card} stroke={T.green} lineWidth={2}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'li.selected > p { background-color: blue; }'} />
        </Rect>
        <Rect position={[0, 0]} width={940} height={90} radius={12} fill={T.card} stroke={T.purple} lineWidth={2}>
          <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'<xsl:template match="li[@class=\'selected\']/p">'} />
        </Rect>
        <Txt ref={g25bEq} position={[0, 100]} fontSize={56} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'='} opacity={0} />
        <Txt ref={g25bTitle} position={[0, 180]} fontSize={SIZE.body} fontWeight={700} fill={T.blue} fontFamily={FONT.sans} text={'同一个变蓝的标题'} opacity={0} />
      </Node>
    </>
  );

  say('查询不动，引擎变快');
  yield* beat('b14',
    all(g14().opacity(1, 0.5)),
    at('不用改你的查询', chain(g14sql().scale(1.04, 0.3), g14sql().scale(1, 0.3))),
    at('加个索引', g14idx().opacity(1, 0.4)),
    at('换种连接方法', g14join().opacity(1, 0.4)),
    at('跑得更快', g14bar().width(620, 0.8)),
  );

  say('名单有固定顺序');
  yield* beat('b15a',
    all(g14().opacity(0, 0.5), g15a().opacity(1, 0.5)),
    at('固定顺序', g15aLab().opacity(1, 0.4)),
  );

  say('顺序变了');
  yield* beat('b15b',
    all(g15a().opacity(0, 0.5), g15b().opacity(1, 0.5)),
    at('回收没用的磁盘空间', all(...g15bFrags.map(f => f().opacity(1, 0.4)))),
    at('挪动记录', all(g15bRows[0]().position([-300, 180], 0.6), g15bRows[4]().position([-300, -180], 0.6), g15bRows[1]().position([-300, 90], 0.6), g15bRows[3]().position([-300, -90], 0.6))),
    at('顺序就变了', all(...g15bTxts.map(t => t().fill(T.red, 0.3)))),
  );

  say('SQL 不在意顺序');
  yield* beat('b16',
    all(g15b().opacity(0, 0.5), g16().opacity(1, 0.5)),
    at('这样做安全吗', g16q().opacity(1, 0.4)),
    at('从不保证顺序', g16sql().opacity(1, 0.4)),
    at('写死了顺序', g16imp().opacity(1, 0.4)),
    at('不敢确定', g16x().opacity(1, 0.4)),
  );

  say('限制换来空间');
  yield* beat('b17',
    all(g16().opacity(0, 0.5), g17().opacity(1, 0.5)),
    at('更受限', chain(g17lock().scale(1.06, 0.3), g17lock().scale(1, 0.3))),
    at('更大的自动优化空间', g17box().opacity(1, 0.4)),
  );

  say('限制换来自由');
  yield* beat('b17c',
    all(g17().opacity(0, 0.5), g17c().opacity(1, 0.5)),
    at('换来了自由', all(g17cCheck().opacity(1, 0.4), chain(g17cBox().scale(1.04, 0.3), g17cBox().scale(1, 0.3)))),
  );

  say('靠加核变快');
  yield* beat('b18',
    all(g17c().opacity(0, 0.5), g18().opacity(1, 0.5)),
    at('主频', g18freq().opacity(1, 0.4)),
    at('加核变快', all(...g18cores.map(c => c().opacity(1, 0.4)), g18n().opacity(1, 0.4))),
  );

  say('单链拆不开');
  yield* beat('b19',
    all(g18().opacity(0, 0.5), g19().opacity(1, 0.5)),
    at('很难拆', all(...g19cores.map(c => c().opacity(1, 0.4)))),
    at('按顺序执行', g19x().opacity(1, 0.4)),
  );

  say('结果定，算法自由');
  yield* beat('b20',
    all(g19().opacity(0, 0.5), g20().opacity(1, 0.5)),
    at('结果长什么样', g20res().opacity(1, 0.4)),
    at('并行实现', all(...g20cores.map(c => c().opacity(1, 0.4)), ...g20cores.map(c => c().stroke(T.green, 0.3)))),
  );

  say('换个地方：浏览器');
  yield* beat('b21',
    all(g20().opacity(0, 0.5), g21().opacity(1, 0.5)),
    at('网页浏览器', chain(g21win().scale(1.03, 0.3), g21win().scale(1, 0.3))),
  );

  say('鲨鱼页 · 已选');
  yield* beat('b22',
    all(g21().opacity(0, 0.5), g22().opacity(1, 0.5)),
    at('鲨鱼页', g22shark().opacity(1, 0.4)),
    at('标着已选', g22sel().opacity(1, 0.4)),
  );

  say('一行 CSS 就够');
  yield* beat('b23',
    all(g22().opacity(0, 0.5), g23().opacity(1, 0.5)),
    at('CSS 一行就够', g23css().opacity(1, 0.4)),
    at('背景变蓝', all(g23blue().opacity(1, 0.4), g23title().fill(T.white, 0.4))),
  );

  say('鲨鱼符合，鲸鱼不符');
  yield* beat('b24',
    all(g23().opacity(0, 0.5), g24().opacity(1, 0.5)),
    at('直接父项', all(...g24segs.map(s => s().fill(T.yellow, 0.3)))),
    at('鲨鱼那行符合', g24ok().opacity(1, 0.4)),
    at('鲸鱼那行不符合', g24no().opacity(1, 0.4)),
  );

  say('意思完全一样');
  yield* beat('b25a',
    all(g24().opacity(0, 0.5), g25a().opacity(1, 0.5)),
    at('同样的意思', g25aXsl().opacity(1, 0.4)),
  );

  say('路径表达式等价');
  yield* beat('b25b',
    all(g25a().opacity(0, 0.5), g25b().opacity(1, 0.5)),
    at('等价', g25bEq().opacity(1, 0.4)),
    at('声明文档样式', g25bTitle().opacity(1, 0.4)),
  );
});
