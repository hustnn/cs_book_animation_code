// U10 场景 3（MC）：b14–b25 —— 语义网与 RDF、Turtle vs XML、URI 命名空间、
// SPARQL 登场（比 Cypher 早、模式匹配被借去）。
// 分镜：skill-ch02/beats-u10.md U10 一节；原文：DDIA §2.14（书页 p57–59，PDF p79–80）。
// “意思 A / 意思 B”是示意写法：原文只说别人的 within 意思不一样，未给出具体
// 意思，画面不编造具体含义。
// 时长全部来自 timeline/u10.json（beat() 驱动），不手写 waitFor。
// 颜色、字号、安全区一律取自 lib/theme，不手写十六进制色值。
import {Circle, Layout, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, chain, createRef} from '@motion-canvas/core';
import {at, makeBeats} from '../../lib/beats';
import {FONT, SAFE, SIZE, T} from '../../lib/theme';
import timeline from '../../timeline/u10.json';

export default makeScene2D(function* (view) {
  view.fill(T.bg);
  const beat = makeBeats(timeline);

  const header = createRef<Txt>();
  const anchor = createRef<Txt>();
  const say = (text: string) => anchor().text(text);

  // b14：网站卡 + 机器可读卡
  const g14 = createRef<Node>();
  const g14web = createRef<Rect>();
  const g14webTitle = createRef<Txt>();
  const g14webPic = createRef<Rect>();
  const g14data = createRef<Rect>();
  // b15：多站成网
  const g15 = createRef<Node>();
  const g15cards = [0, 1, 2].map(() => createRef<Rect>());
  const g15lines = [0, 1, 2].map(() => createRef<Line>());
  const g15core = createRef<Txt>();
  // b16：炒作曲线 + 三张灰卡
  const g16 = createRef<Node>();
  const g16curve = createRef<Line>();
  const g16cards = [0, 1, 2].map(() => createRef<Rect>());
  // b17：内部模型卡
  const g17 = createRef<Node>();
  const g17card = createRef<Rect>();
  // b18：三元组卡 vs 五元组卡
  const g18 = createRef<Node>();
  const g18tri = createRef<Node>();
  const g18quin = createRef<Node>();
  const g18extra = [0, 1].map(() => createRef<Rect>());
  const g18meta = createRef<Txt>();
  // b19/b20：Turtle vs XML + 互转箭头
  const g19 = createRef<Node>();
  const g19turtle = createRef<Rect>();
  const g19xml = createRef<Rect>();
  const g20arrow = createRef<Line>();
  const g20lab = createRef<Txt>();
  // b21：谓语拉长成网址
  const g21 = createRef<Node>();
  const g21box = createRef<Rect>();
  const g21short = createRef<Txt>();
  const g21long = createRef<Txt>();
  // b22/b23：两个 within 打架 / 各用各的网址
  const g22 = createRef<Node>();
  const g22a = createRef<Rect>();
  const g22b = createRef<Rect>();
  const g22ma = createRef<Txt>();
  const g22mb = createRef<Txt>();
  const g22x = createRef<Txt>();
  const g23 = createRef<Node>();
  const g23a = createRef<Rect>();
  const g23b = createRef<Rect>();
  const g23nsa = createRef<Txt>();
  const g23nsb = createRef<Txt>();
  // b24：前缀声明一次
  const g24 = createRef<Node>();
  const g24prefix = createRef<Txt>();
  const g24table = createRef<Node>();
  // b25：SPARQL 时间线
  const g25 = createRef<Node>();
  const g25card = createRef<Rect>();
  const g25line = createRef<Line>();
  const g25dotS = createRef<Circle>();
  const g25dotC = createRef<Circle>();
  const g25labS = createRef<Txt>();
  const g25labC = createRef<Txt>();
  const g25arrow = createRef<Line>();
  const g25borrow = createRef<Txt>();

  view.add(
    <>
      <Txt
        ref={header}
        position={[-SAFE.halfW, -SAFE.halfH]}
        offset={[-1, -1]}
        fontSize={SIZE.label}
        fill={T.muted}
        fontFamily={FONT.sans}
        text={'三元组与 SPARQL'}
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

      {/* b14：网站（文字+图片）与机器可读数据 */}
      <Node ref={g14} opacity={0}>
        <Rect ref={g14web} position={[-310, -40]} width={420} height={280} radius={16} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt ref={g14webTitle} position={[0, -70]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'文字'} opacity={0} />
          <Rect ref={g14webPic} position={[0, 40]} width={280} height={110} radius={10} fill={T.bg} stroke={T.line} lineWidth={2} opacity={0}>
            <Txt fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'图片'} />
          </Rect>
        </Rect>
        <Rect ref={g14data} position={[310, -40]} width={420} height={280} radius={16} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt position={[0, -80]} fontSize={20} fill={T.text} fontFamily={FONT.mono} text={'_:lucy :name "Lucy".'} />
          <Txt position={[0, -20]} fontSize={20} fill={T.text} fontFamily={FONT.mono} text={'_:lucy :bornIn _:idaho.'} />
          <Txt position={[0, 40]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} text={'机器可读的数据'} />
        </Rect>
      </Node>

      {/* b15：多张网站卡连成网，网心是万物数据库 */}
      <Node ref={g15} opacity={0}>
        {[0, 1, 2].map(i => (
          <Rect key={`g15c-${i}`} ref={g15cards[i]} position={[[-400, 0, 400][i], -180]} width={300} height={150} radius={14} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={['网站 A', '网站 B', '网站 C'][i]} />
          </Rect>
        ))}
        {[0, 1, 2].map(i => (
          <Line key={`g15l-${i}`} ref={g15lines[i]} points={[[[-400, 0, 400][i], -105], [0, 90]]} stroke={T.line} lineWidth={2} opacity={0} />
        ))}
        <Txt ref={g15core} position={[0, 130]} fontSize={SIZE.title} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'全网的万物数据库'} opacity={0} />
      </Node>

      {/* b16：炒作曲线升起又落下，三张灰卡 */}
      <Node ref={g16} opacity={0}>
        <Line ref={g16curve} points={[[-500, 60], [-250, -40], [0, -190], [250, -60], [500, 60]]} stroke={T.red} lineWidth={4} endOffset={0} />
        {[0, 1, 2].map(i => (
          <Rect key={`g16c-${i}`} ref={g16cards[i]} position={[[-380, 0, 380][i], 170]} width={320} height={90} radius={12} fill={T.card} stroke={T.line} lineWidth={2} opacity={0}>
            <Txt fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={['一堆缩略语', '过于复杂的标准', '傲慢'][i]} />
          </Rect>
        ))}
      </Node>

      {/* b17：内部模型卡 */}
      <Node ref={g17} opacity={0}>
        <Rect ref={g17card} position={[0, -40]} width={760} height={200} radius={16} fill={T.card} stroke={T.green} lineWidth={3} opacity={0}>
          <Txt fontSize={SIZE.title} fill={T.text} fontFamily={FONT.sans} text={'应用内部的数据模型'} />
        </Rect>
      </Node>

      {/* b18：三元组卡 vs 五元组卡，多两格管版本 */}
      <Node ref={g18} opacity={0}>
        <Node ref={g18tri} position={[-330, -40]} opacity={0}>
          <Layout layout direction={'row'} gap={12}>
            <Rect width={150} height={110} radius={12} fill={T.card} stroke={T.blue} lineWidth={2}><Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'主语'} /></Rect>
            <Rect width={150} height={110} radius={12} fill={T.card} stroke={T.yellow} lineWidth={2}><Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'谓语'} /></Rect>
            <Rect width={150} height={110} radius={12} fill={T.card} stroke={T.green} lineWidth={2}><Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'宾语'} /></Rect>
          </Layout>
          <Txt position={[0, 110]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'三元组'} />
        </Node>
        <Node ref={g18quin} position={[330, -40]} opacity={0}>
          <Layout layout direction={'row'} gap={12}>
            <Rect width={88} height={110} radius={12} fill={T.card} stroke={T.blue} lineWidth={2}><Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'主语'} /></Rect>
            <Rect width={88} height={110} radius={12} fill={T.card} stroke={T.yellow} lineWidth={2}><Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'谓语'} /></Rect>
            <Rect width={88} height={110} radius={12} fill={T.card} stroke={T.green} lineWidth={2}><Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'宾语'} /></Rect>
            <Rect ref={g18extra[0]} width={88} height={110} radius={12} fill={T.card} stroke={T.purple} lineWidth={2} opacity={0}><Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'版本'} /></Rect>
            <Rect ref={g18extra[1]} width={88} height={110} radius={12} fill={T.card} stroke={T.purple} lineWidth={2} opacity={0}><Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'版本'} /></Rect>
          </Layout>
          <Txt position={[0, 110]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'五元组（Datomic）'} />
          <Txt ref={g18meta} position={[110, 170]} fontSize={SIZE.label} fill={T.purple} fontFamily={FONT.sans} text={'多出的两项管版本'} opacity={0} />
        </Node>
      </Node>

      {/* b19/b20：Turtle vs XML，XML 明显更长更密；双向转换箭头 */}
      <Node ref={g19} opacity={0}>
        <Rect ref={g19turtle} position={[-300, -20]} width={520} height={330} radius={16} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt position={[0, -110]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'Turtle'} />
          <Txt position={[0, -40]} fontSize={20} fill={T.text} fontFamily={FONT.mono} text={'_:lucy :name "Lucy".'} />
          <Txt position={[0, 10]} fontSize={20} fill={T.text} fontFamily={FONT.mono} text={'_:idaho :within _:usa.'} />
          <Txt position={[0, 60]} fontSize={20} fill={T.text} fontFamily={FONT.mono} text={'_:usa :name "United States".'} />
        </Rect>
        <Rect ref={g19xml} position={[300, -20]} width={520} height={330} radius={16} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt position={[0, -130]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.sans} text={'XML'} />
          <Txt position={[0, -80]} fontSize={18} fill={T.muted} fontFamily={FONT.mono} text={'<rdf:RDF xmlns="urn:example:">'} />
          <Txt position={[0, -40]} fontSize={18} fill={T.muted} fontFamily={FONT.mono} text={'<Location rdf:nodeID="idaho">'} />
          <Txt position={[0, 0]} fontSize={18} fill={T.muted} fontFamily={FONT.mono} text={'<name>Idaho</name>'} />
          <Txt position={[0, 40]} fontSize={18} fill={T.muted} fontFamily={FONT.mono} text={'<within><Location …>'} />
          <Txt position={[0, 80]} fontSize={18} fill={T.muted} fontFamily={FONT.mono} text={'</Location></rdf:RDF>'} />
        </Rect>
        <Line ref={g20arrow} points={[[-200, 210], [200, 210]]} stroke={T.yellow} lineWidth={3} startArrow endArrow opacity={0} />
        <Txt ref={g20lab} position={[0, 165]} fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.sans} text={'自动转换'} opacity={0} />
      </Node>

      {/* b21：短谓语 WITHIN 拉长成带网址的长谓语 */}
      <Node ref={g21} opacity={0}>
        <Rect ref={g21box} position={[0, -40]} width={220} height={100} radius={14} fill={T.card} stroke={T.yellow} lineWidth={2} opacity={0}>
          <Txt ref={g21short} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.mono} text={'WITHIN'} />
          <Txt ref={g21long} fontSize={18} fill={T.text} fontFamily={FONT.mono} text={'<http://my-company.com/namespace#within>'} opacity={0} />
        </Rect>
      </Node>

      {/* b22：两个 within，意思不一样，打叉 */}
      <Node ref={g22} opacity={0}>
        <Rect ref={g22a} position={[-300, -40]} width={420} height={220} radius={16} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt position={[0, -50]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.mono} text={'within'} />
          <Txt ref={g22ma} position={[0, 30]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'意思 A'} opacity={0} />
        </Rect>
        <Rect ref={g22b} position={[300, -40]} width={420} height={220} radius={16} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt position={[0, -50]} fontSize={SIZE.body} fill={T.text} fontFamily={FONT.mono} text={'within'} />
          <Txt ref={g22mb} position={[0, 30]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'意思 B'} opacity={0} />
        </Rect>
        <Txt ref={g22x} position={[0, -40]} fontSize={72} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'×'} opacity={0} />
      </Node>

      {/* b23：各用各的网址，不打架 */}
      <Node ref={g23} opacity={0}>
        <Rect ref={g23a} position={[0, -140]} width={900} height={110} radius={14} fill={T.card} stroke={T.blue} lineWidth={2} opacity={0}>
          <Layout layout direction={'row'} gap={0}>
            <Txt ref={g23nsa} fontSize={18} fill={T.text} fontFamily={FONT.mono} text={'<http://my-company.com/namespace'} />
            <Txt fontSize={18} fill={T.text} fontFamily={FONT.mono} text={'#within>'} />
          </Layout>
        </Rect>
        <Rect ref={g23b} position={[0, 0]} width={900} height={110} radius={14} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Layout layout direction={'row'} gap={0}>
            <Txt ref={g23nsb} fontSize={18} fill={T.text} fontFamily={FONT.mono} text={'<http://other.org/foo'} />
            <Txt fontSize={18} fill={T.text} fontFamily={FONT.mono} text={'#within>'} />
          </Layout>
        </Rect>
      </Node>

      {/* b24：前缀声明一次，随后淡出 */}
      <Node ref={g24} opacity={0}>
        <Txt ref={g24prefix} position={[0, -260]} fontSize={22} fill={T.yellow} fontFamily={FONT.mono} text={'@prefix : <urn:example:>.'} opacity={0} />
        <Node ref={g24table} opacity={0}>
          <Txt position={[0, -120]} fontSize={20} fill={T.text} fontFamily={FONT.mono} text={'_:lucy :name "Lucy".'} />
          <Txt position={[0, -60]} fontSize={20} fill={T.text} fontFamily={FONT.mono} text={'_:idaho :within _:usa.'} />
          <Txt position={[0, 0]} fontSize={20} fill={T.text} fontFamily={FONT.mono} text={'_:usa :name "United States".'} />
        </Node>
      </Node>

      {/* b25：SPARQL 在前，Cypher 在后，模式匹配借过去 */}
      <Node ref={g25} opacity={0}>
        <Rect ref={g25card} position={[0, -180]} width={560} height={150} radius={16} fill={T.card} stroke={T.yellow} lineWidth={2} opacity={0}>
          <Txt position={[0, -25]} fontSize={SIZE.title} fill={T.text} fontFamily={FONT.sans} text={'SPARQL'} />
          <Txt position={[0, 35]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'读作 sparkle'} />
        </Rect>
        <Line ref={g25line} points={[[-400, 80], [400, 80]]} stroke={T.line} lineWidth={3} opacity={0} />
        <Circle ref={g25dotS} position={[-200, 80]} width={36} height={36} fill={T.yellow} opacity={0} />
        <Circle ref={g25dotC} position={[200, 80]} width={36} height={36} fill={T.blue} opacity={0} />
        <Txt ref={g25labS} position={[-200, 140]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'SPARQL 在前'} opacity={0} />
        <Txt ref={g25labC} position={[200, 140]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'Cypher 在后'} opacity={0} />
        <Line ref={g25arrow} points={[[-160, 80], [160, 80]]} stroke={T.yellow} lineWidth={3} endArrow opacity={0} />
        <Txt ref={g25borrow} position={[0, 20]} fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.sans} text={'模式匹配借过去'} opacity={0} />
      </Node>
    </>
  );

  say('给机器一份能读的数据');
  yield* beat('b14',
    all(g14().opacity(1, 0.5), g14web().opacity(1, 0.5)),
    at('语义网的想法', g14web().scale(1.02, 0.5).to(1, 0.5)),
    at('文字', g14webTitle().opacity(1, 0.4)),
    at('图片', g14webPic().opacity(1, 0.4)),
    at('给机器一份能读的数据', g14data().opacity(1, 0.5)),
  );

  say('全网的万物数据库');
  yield* beat('b15',
    all(g14().opacity(0, 0.5), g15().opacity(1, 0.5)),
    at('资源描述框架', chain(g15cards[0]().opacity(1, 0.4), g15cards[1]().opacity(1, 0.4), g15cards[2]().opacity(1, 0.4))),
    at('本意就是让', g15().scale(1.02, 0.5).to(1, 0.5)),
    at('一致的格式', all(g15lines[0]().opacity(1, 0.4), g15().scale(1.02, 0.5).to(1, 0.5))),
    at('自动拼成', all(chain(g15lines[1]().opacity(1, 0.4), g15lines[2]().opacity(1, 0.4)), g15().scale(1.02, 0.5).to(1, 0.5))),
    at('万物数据库', g15core().opacity(1, 0.5)),
  );

  say('被过度炒作');
  yield* beat('b16',
    all(g15().opacity(0, 0.5), g16().opacity(1, 0.5)),
    at('2000 年代初', g16curve().endOffset(0.5, 2)),
    at('过度炒作', g16curve().endOffset(1, 2.5)),
    at('没有真正实现', g16curve().stroke(T.muted, 1)),
    at('缩略语', g16cards[0]().opacity(1, 0.4)),
    at('过于复杂的标准', g16cards[1]().opacity(1, 0.4)),
    at('傲慢', g16cards[2]().opacity(1, 0.4)),
  );

  say('内部模型也很好用');
  yield* beat('b17',
    all(g16().opacity(0, 0.5), g17().opacity(1, 0.5)),
    at('全盘否定', g17card().opacity(1, 0.5)),
    at('应用内部', g17card().scale(1.04, 0.8).to(1, 0.8)),
  );

  say('五元组，多两项管版本');
  yield* beat('b18',
    all(g17().opacity(0, 0.5), g18().opacity(1, 0.5), g18tri().opacity(1, 0.5)),
    at('Datomic', g18quin().opacity(1, 0.5)),
    at('五元组', chain(g18extra[0]().opacity(1, 0.4), g18extra[1]().opacity(1, 0.4))),
    at('管版本的元数据', g18meta().opacity(1, 0.4)),
  );

  say('Turtle 更顺眼');
  yield* beat('b19',
    all(g18().opacity(0, 0.5), g19().opacity(1, 0.5)),
    at('Turtle 是 RDF 的人类可读写法', g19turtle().opacity(1, 0.5)),
    at('RDF 也能写成 XML', g19xml().opacity(1, 0.5)),
    at('啰嗦得多', g19xml().scale(1.03, 0.6).to(1, 0.6)),
  );

  say('格式可以互转');
  yield* beat('b20',
    all(g20arrow().opacity(1, 0.5), g20lab().opacity(1, 0.4)),
    at('不用手工重写', g20arrow().scale(1.08, 0.5).to(1, 0.5)),
  );

  say('谓语常常是网址');
  yield* beat('b21',
    all(g19().opacity(0, 0.5), g21().opacity(1, 0.5), g21box().opacity(1, 0.5)),
    at('常常是网址', g21box().scale(1.03, 0.5).to(1, 0.5)),
    at('谓语不只是 WITHIN 这一个词', chain(g21box().width(640, 1.2), g21short().opacity(0, 0.4))),
    at('带着网址的 WITHIN', g21long().opacity(1, 0.5)),
  );

  say('意思不一样，会打架');
  yield* beat('b22',
    all(g21().opacity(0, 0.5), g22().opacity(1, 0.5), g22a().opacity(1, 0.5)),
    at('拼在一起不打架', g22a().scale(1.02, 0.5).to(1, 0.5)),
    at('别人的数据', g22b().opacity(1, 0.5)),
    at('意思却不一样', chain(g22ma().opacity(1, 0.4), g22mb().opacity(1, 0.4), g22mb().fill(T.red, 0.4), g22x().opacity(1, 0.4))),
  );

  say('各用各的网址，不打架');
  yield* beat('b23',
    all(g22().opacity(0, 0.5), g23().opacity(1, 0.5), g23a().opacity(1, 0.5)),
    at('一个是你公司的', chain(g23nsa().fill(T.yellow, 0.4), g23b().opacity(1, 0.5))),
    at('一个是别人家的', g23nsb().fill(T.yellow, 0.4)),
    at('不会冲突', g23a().scale(1.02, 0.6).to(1, 0.6)),
  );

  say('声明一次，之后忘了它');
  yield* beat('b24',
    all(g23().opacity(0, 0.5), g24().opacity(1, 0.5), g24table().opacity(1, 0.5)),
    at('这个网址不一定真能打开', g24prefix().opacity(1, 0.5)),
    at('只是一个命名空间', all(g24prefix().scale(1.05, 0.4).to(1, 0.4), g24table().scale(1.02, 0.5).to(1, 0.5))),
    at('声明一次前缀', all(g24prefix().scale(1.05, 0.5).to(1, 0.5), g24table().scale(1.02, 0.5).to(1, 0.5))),
    at('之后就可以忘了它', g24prefix().opacity(0, 0.8)),
  );

  say('SPARQL，读作 sparkle');
  yield* beat('b25',
    all(g24().opacity(0, 0.5), g25().opacity(1, 0.5), g25card().opacity(1, 0.5)),
    at('比 Cypher 还早', chain(g25line().opacity(1, 0.4), g25dotS().opacity(1, 0.4), g25labS().opacity(1, 0.4))),
    at('借来的', chain(g25arrow().opacity(1, 0.5), g25borrow().opacity(1, 0.4))),
    at('看起来很像', chain(g25dotC().opacity(1, 0.4), g25labC().opacity(1, 0.4))),
  );
});
