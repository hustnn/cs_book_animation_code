// U2 场景 2（MC）：b12–b20 —— 六张表全貌、行里嵌套、文本列黑盒、
// 合回 JSON 文档、文档库、失配收窄、留待后面的问题。
// 分镜：skill-ch02/beats-u2.md U2 一节；原文：DDIA §2.3（书页 p30–32，PDF p52–54）。
// 六张表按原图复现：users（含 region_id / industry_id / photo_id 第二行）、
// regions、industries、positions、education、contact_info；外键连线按原图画出（r5）：
// us:91→regions、131→industries、251→positions/education/contact_info 三表 user_id 列；
// 251 单元格仍黄色高亮。251 三线因左右分栏，止于目标表左缘、两行 251 的中点高度，
// 不穿表内文字（落点取舍见 rounds/u2/r5/review.md“图表核对”）。
// 时长全部来自 timeline/u2.json（beat() 驱动），不手写 waitFor。
// 颜色、字号、安全区一律取自 lib/theme，不手写十六进制色值。
import {Circle, Line, Node, Rect, Spline, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, chain, createRef, waitFor} from '@motion-canvas/core';
import {at, makeBeats} from '../../lib/beats';
import {FONT, SAFE, SIZE, T} from '../../lib/theme';
import timeline from '../../timeline/u2.json';

const ROW_H = 26;
const HEAD_H = 28;
// r5：251 三支的落点高度 = 三表两行 251 的中点（positions −174、education −30、contact_info 116）
const FK3_Y = [-174, -30, 116];

export default makeScene2D(function* (view) {
  view.fill(T.bg);
  const beat = makeBeats(timeline);

  const header = createRef<Txt>();
  const anchor = createRef<Txt>();
  const say = (text: string) => anchor().text(text);

  const g12 = createRef<Node>();
  const g12tables = [0, 1, 2, 3, 4, 5].map(() => createRef<Node>());
  const g12fk = createRef<Txt>();
  // r5：b12 外键连线（5 根，按原图 Figure 2-1 的弧线读法；只在 b12 出现，随 g12 退场）
  const g12fk1 = createRef<Spline>();
  const g12fk1dot = createRef<Circle>();
  const g12fk2 = createRef<Line>();
  const g12fk2dot = createRef<Circle>();
  const g12fk3feed = createRef<Line>();
  const g12fk3trunk = createRef<Line>();
  const g12fk3b = [0, 1, 2].map(() => createRef<Line>());
  const g12fk3dots = [0, 1, 2].map(() => createRef<Circle>());
  const g13 = createRef<Node>();
  const g13nested = [0, 1].map(() => createRef<Rect>());
  const g13mag = createRef<Circle>();
  const g13idx = createRef<Txt>();
  const g13dbs = [0, 1, 2, 3].map(() => createRef<Rect>());
  const g13jsonTag = createRef<Rect>();
  const g13jsonDbs = createRef<Txt>();
  const g13col = createRef<Node>();
  const g13doc = createRef<Rect>();
  const g13dark = createRef<Rect>();
  const g13app = createRef<Node>();
  const g13appTags = [0, 1, 2].map(() => createRef<Txt>());
  const g13arrow = createRef<Line>();
  const g13x = createRef<Txt>();
  const g17 = createRef<Node>();
  const g17lines = [0, 1, 2, 3, 4].map(() => createRef<Node>());
  const g17tag = createRef<Txt>();
  const g17slots = [0, 1, 2, 3].map(() => createRef<Rect>());
  const g17names = [0, 1, 2, 3].map(() => createRef<Txt>());
  const g17band = createRef<Node>();
  const g17gap = createRef<Rect>();
  const g17tags = [0, 1].map(() => createRef<Txt>());

  // 一张表：title 在上，header 行深色，数据行文字；251 用黄色。
  // rowHeights：个别行需要两行高（如原图里换行的长单元格）。
  const tableJSX = (title: string, headers: string[], widths: number[], rows: string[][], key: string, rowHeights?: number[]) => {
    const w = widths.reduce((a, b) => a + b, 0);
    const heights = rowHeights ?? rows.map(() => ROW_H);
    const bodyH = heights.reduce((a, b) => a + b, 0);
    const totalH = 22 + HEAD_H + bodyH + 8;
    const xs: number[] = [];
    let acc = -w / 2;
    for (const cw of widths) {
      xs.push(acc + cw / 2);
      acc += cw;
    }
    let yAcc = -totalH / 2 + 22 + HEAD_H;
    const rowYs: number[] = [];
    for (const h of heights) {
      rowYs.push(yAcc + h / 2);
      yAcc += h;
    }
    return (
      <>
        <Rect width={w} height={totalH} radius={8} fill={T.card} stroke={T.line} lineWidth={1} />
        <Txt position={[0, -totalH / 2 + 11]} fontSize={SIZE.min} fill={T.muted} fontFamily={FONT.mono} text={title} />
        <Rect position={[0, -totalH / 2 + 22 + HEAD_H / 2]} width={w} height={HEAD_H} fill={T.bg} />
        {headers.map((h, j) => (
          <Txt key={`${key}-h-${j}`} position={[xs[j], -totalH / 2 + 22 + HEAD_H / 2]} fontSize={SIZE.min} fill={T.muted} fontFamily={FONT.mono} text={h} maxWidth={widths[j] - 6} textWrap />
        ))}
        {rows.flatMap((row, i) =>
          row.map((cell, j) => (
            <Txt
              key={`${key}-r${i}c${j}`}
              position={[xs[j], rowYs[i]]}
              fontSize={SIZE.min}
              fill={cell === '251' ? T.yellow : T.text}
              fontFamily={FONT.mono}
              text={cell}
              maxWidth={widths[j] - 6}
              textWrap
            />
          )),
        )}
      </>
    );
  };

  // r2 修：rows.map 嵌套数组作 fragment 子节点、且 fragment 后跟兄弟节点时，内层子节点挂不上
  // （b12 users 表数据行缺失）；flatMap 展平成一层后正常。

  const usersMain = tableJSX('users', ['user_id', 'first_name', 'last_name', 'summary'], [85, 120, 105, 260],
    [['251', 'Bill', 'Gates', 'Co-chair of … blogger.']], 'users');
  const usersSub = tableJSX('users（续）', ['region_id', 'industry_id', 'photo_id'], [140, 140, 290],
    [['us:91', '131', '57817532']], 'users-sub');
  const regionsT = tableJSX('regions', ['id', 'region_name'], [80, 490],
    [['us:7', 'Greater Boston Area'], ['us:91', 'Greater Seattle Area']], 'regions');
  const industriesT = tableJSX('industries', ['id', 'industry_name'], [80, 490],
    [['43', 'Financial Services'], ['48', 'Construction'], ['131', 'Philanthropy']], 'industries');
  const positionsT = tableJSX('positions', ['id', 'user_id', 'job_title', 'organization'], [65, 85, 160, 260],
    [['458', '251', 'Co-chair', 'Bill & Melinda Gates…'], ['457', '251', 'Co-founder, Chairman', 'Microsoft']], 'positions', [26, 48]);
  const educationT = tableJSX('education', ['id', 'user_id', 'school_name', 'start', 'end'], [65, 85, 240, 90, 90],
    [['807', '251', 'Harvard University', '1973', '1975'], ['806', '251', 'Lakeside School, Seattle', 'NULL', 'NULL']], 'education', [26, 48]);
  const contactT = tableJSX('contact_info', ['id', 'user_id', 'type', 'url'], [65, 85, 90, 330],
    [['155', '251', 'blog', 'http://thegatesnotes.com'], ['156', '251', 'twitter', 'http://twitter.com/BillGates']], 'contact');

  const jsonLines: string[][] = [
    ['{', '"user_id": 251,', '"first_name": "Bill",'],
    ['"last_name": "Gates",', '"summary": "Co-chair of the Bill & Melinda Gates…",', '"region_id": "us:91",'],
    ['"industry_id": 131,', '"photo_url": "/p/7/000/253/05b/308dd6e.jpg",', '"positions": [ … 2 项 … ],'],
    ['"education": [ … 2 项 … ],', '"contact_info": { "blog": "…", "twitter": "…" }'],
    ['}'],
  ];

  view.add(
    <>
      <Txt
        ref={header}
        position={[-SAFE.halfW, -SAFE.halfH]}
        offset={[-1, -1]}
        fontSize={SIZE.label}
        fill={T.muted}
        fontFamily={FONT.sans}
        text={'同一份简历，两种长相'}
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

      {/* b12：六张表 */}
      <Node ref={g12} opacity={0}>
        <Node ref={g12tables[0]} position={[-290, -190]} opacity={0}>
          {usersMain}
          <Node position={[0, 108]}>{usersSub}</Node>
        </Node>
        <Node ref={g12tables[1]} position={[-290, 25]} opacity={0}>
          {regionsT}
        </Node>
        <Node ref={g12tables[2]} position={[-290, 160]} opacity={0}>
          {industriesT}
        </Node>
        <Node ref={g12tables[3]} position={[290, -190]} opacity={0}>
          {positionsT}
        </Node>
        <Node ref={g12tables[4]} position={[290, -45]} opacity={0}>
          {educationT}
        </Node>
        <Node ref={g12tables[5]} position={[290, 95]} opacity={0}>
          {contactT}
        </Node>
        {/* r5：外键连线（5 根），按原图弧线读法；落点与取舍见 review.md“图表核对” */}
        {/* L1：users.region_id us:91 → regions 表 us:91 行（左缘弧线，圆点落在行高处） */}
        <Spline ref={g12fk1} points={[[-505, -48], [-560, -25], [-598, 5], [-592, 40], [-568, 59]]} stroke={T.yellow} lineWidth={3} opacity={0} />
        <Circle ref={g12fk1dot} position={[-568, 59]} width={9} height={9} fill={T.yellow} opacity={0} />
        {/* L2：users.industry_id 131 → industries 表 131 Philanthropy 行（左缘折线）。
            原为 Spline：平滑后上弓穿过 regions 表头 “id”（QA crossed error，r5 初版）；
            第一版折线仍穿 “id”——表头行 y 我算错了（应为 regions 中心 25 − 55 + 36 = 6，
            不是 −16），第二段恰好穿过 “id” 格。第二版改道：从 131 格左侧引出、贴 users（续）
            表底边向左，在 regions 表头带上方（y −34…−25）绕到表左缘再下行；逐段验算，
            与 “us:91” 格底边留 ≥5px、与 “id” 格留 ≥9px，不穿任何文字 */}
        <Line ref={g12fk2} points={[[-385, -56], [-560, -34], [-600, -25], [-603, 60], [-603, 160], [-590, 195], [-557, 207]]} stroke={T.yellow} lineWidth={3} opacity={0} />
        <Circle ref={g12fk2dot} position={[-557, 207]} width={9} height={9} fill={T.yellow} opacity={0} />
        {/* L3–L5：users.user_id 251 → positions / education / contact_info 三表 user_id 列。
            共用一根干线：从 users 表 251 格下方引出，走两盒间空隙进中间缝，再分三支到各表左缘 */}
        <Line ref={g12fk3feed} points={[[-532, -156], [-532, -136], [0, -136]]} stroke={T.yellow} lineWidth={3} opacity={0} />
        <Line ref={g12fk3trunk} points={[[0, FK3_Y[0]], [0, FK3_Y[2]]]} stroke={T.yellow} lineWidth={3} opacity={0} />
        {[0, 1, 2].map(i => (
          <Line key={`g12fk3b-${i}`} ref={g12fk3b[i]} points={[[0, FK3_Y[i]], [8, FK3_Y[i]]]} stroke={T.yellow} lineWidth={3} opacity={0} />
        ))}
        {[0, 1, 2].map(i => (
          <Circle key={`g12fk3d-${i}`} ref={g12fk3dots[i]} position={[11, FK3_Y[i]]} width={9} height={9} fill={T.yellow} opacity={0} />
        ))}
        <Txt ref={g12fk} position={[0, 244]} fontSize={SIZE.label} fill={T.yellow} fontFamily={FONT.sans} text={'外键都指回 users 表：每个 251 都连着同一份档案'} opacity={0} />
      </Node>

      {/* b13–b16：一行、文本列、黑盒 */}
      <Node ref={g13} opacity={0}>
        <Rect position={[0, -180]} width={920} height={110} radius={14} fill={T.card} stroke={T.line} lineWidth={2}>
          <Txt position={[-380, 0]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.mono} text={'user_id 251'} />
          <Txt position={[-180, 0]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'一行'} />
        </Rect>
        <Rect ref={g13nested[0]} position={[180, -180]} width={180} height={70} radius={10} fill={T.bg} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.min} fill={T.text} fontFamily={FONT.mono} text={'结构化类型'} />
        </Rect>
        <Rect ref={g13nested[1]} position={[360, -180]} width={140} height={70} radius={10} fill={T.bg} stroke={T.blue} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.min} fill={T.text} fontFamily={FONT.mono} text={'XML'} />
        </Rect>
        <Circle ref={g13mag} position={[280, -180]} width={80} height={80} stroke={T.yellow} lineWidth={3} opacity={0} />
        <Txt ref={g13idx} position={[280, -107]} fontSize={SIZE.label} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'索引'} opacity={0} />
        {[0, 1, 2, 3].map(i => (
          <Rect key={`g13db-${i}`} ref={g13dbs[i]} position={[-390 + i * 260, -60]} width={230} height={60} radius={10} fill={T.card} stroke={T.line} lineWidth={2} opacity={0}>
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={['Oracle', 'IBM DB2', 'SQL Server', 'PostgreSQL'][i]} />
          </Rect>
        ))}
        <Rect ref={g13jsonTag} position={[0, 30]} width={200} height={60} radius={10} fill={T.card} stroke={T.green} lineWidth={2} opacity={0}>
          <Txt fontSize={SIZE.label} fontWeight={700} fill={T.green} fontFamily={FONT.mono} text={'JSON 类型'} />
        </Rect>
        <Txt ref={g13jsonDbs} position={[0, 82]} fontSize={SIZE.min} fill={T.muted} fontFamily={FONT.mono} text={'IBM DB2 · MySQL · PostgreSQL'} opacity={0} />
        <Node ref={g13col} opacity={0}>
          <Rect position={[-300, 150]} width={260} height={200} radius={14} fill={T.card} stroke={T.line} lineWidth={2}>
            <Txt position={[0, -70]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'一列文本'} />
          </Rect>
          <Rect ref={g13doc} position={[-300, 150]} width={200} height={120} radius={10} fill={T.bg} stroke={T.green} lineWidth={2} opacity={0}>
            <Txt fontSize={SIZE.label} fill={T.text} fontFamily={FONT.mono} text={'{ 简历文档 }'} />
          </Rect>
          <Rect ref={g13dark} position={[-300, 150]} width={260} height={200} radius={14} fill={T.bg} opacity={0} />
          <Txt ref={g13x} position={[-300, 150]} fontSize={64} fontWeight={700} fill={T.red} fontFamily={FONT.sans} text={'✗'} opacity={0} />
          {/* r4 修：点明这是没有类型的文本列，与 b14b 的 JSON 类型对照；放在框外下方，黑盒遮罩盖不到，与底部锚点横向错开 */}
          <Txt position={[-300, 272]} fontSize={SIZE.label} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'文本列（没有类型）'} />
        </Node>
        <Node ref={g13app} opacity={0}>
          <Rect position={[300, 150]} width={260} height={200} radius={14} fill={T.card} stroke={T.blue} lineWidth={2}>
            <Txt position={[0, -70]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'应用'} />
          </Rect>
          <Txt ref={g13appTags[0]} position={[300, 120]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'工作'} opacity={0} />
          <Txt ref={g13appTags[1]} position={[300, 160]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'教育'} opacity={0} />
          <Txt ref={g13appTags[2]} position={[300, 200]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={'联系方式'} opacity={0} />
        </Node>
        <Line ref={g13arrow} points={[[-60, 150], [-140, 150]]} stroke={T.yellow} lineWidth={3} opacity={0} />
      </Node>

      {/* b17–b20：JSON 文档 */}
      <Node ref={g17} opacity={0}>
        <Rect position={[-280, -40]} width={600} height={360} radius={16} fill={T.card} stroke={T.green} lineWidth={2}>
          <Txt position={[0, -150]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.mono} text={'一份 JSON 文档'} />
        </Rect>
        {jsonLines.map((group, gi) => (
          <Node key={`g17l-${gi}`} ref={g17lines[gi]} opacity={0}>
            {group.map((line, li) => (
              <Txt
                key={`g17l-${gi}-${li}`}
                position={[-550, -160 + ([0, 3, 6, 9, 11][gi] + li) * 26]}
                offset={[-1, 0]}
                fontSize={SIZE.min}
                fill={line.startsWith('"') ? T.blue : T.text}
                fontFamily={FONT.mono}
                text={line}
                maxWidth={540}
                textWrap
              />
            ))}
          </Node>
        ))}
        <Txt ref={g17tag} position={[-280, 180]} fontSize={SIZE.label} fill={T.green} fontFamily={FONT.sans} text={'比 XML 简单'} opacity={0} />
        {[0, 1, 2, 3].map(i => (
          <Rect key={`g17s-${i}`} ref={g17slots[i]} position={[330, -200 + i * 85]} width={420} height={64} radius={10} fill={T.card} stroke={T.line} lineWidth={2} opacity={0} />
        ))}
        {[0, 1, 2, 3].map(i => (
          <Txt key={`g17n-${i}`} ref={g17names[i]} position={[330, -200 + i * 85]} fontSize={SIZE.label} fill={T.text} fontFamily={FONT.sans} text={['MongoDB', 'RethinkDB', 'CouchDB', 'Espresso'][i]} opacity={0} />
        ))}
        <Node ref={g17band} opacity={0}>
          <Rect position={[330, 150]} width={460} height={100} radius={12} fill={T.card} stroke={T.yellow} lineWidth={2}>
            <Txt position={[0, -18]} fontSize={SIZE.label} fontWeight={700} fill={T.yellow} fontFamily={FONT.sans} text={'翻译层'} />
          </Rect>
          <Rect ref={g17gap} position={[330, 168]} width={160} height={14} radius={7} fill={T.red} />
        </Node>
        <Txt ref={g17tags[0]} position={[330, 220]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'JSON 的问题 · 后面再讲'} opacity={0} />
        <Txt ref={g17tags[1]} position={[330, 250]} fontSize={SIZE.label} fill={T.muted} fontFamily={FONT.sans} text={'没有 schema · 后面再讨论'} opacity={0} />
      </Node>
    </>
  );

  say('六张表，一份档案');
  yield* beat('b12',
    all(g12().opacity(1, 0.4)),
    at('六张表', chain(g12tables[0]().opacity(1, 0.3), g12tables[1]().opacity(1, 0.3), g12tables[2]().opacity(1, 0.3), g12tables[3]().opacity(1, 0.3), g12tables[4]().opacity(1, 0.3), g12tables[5]().opacity(1, 0.3))),
    // r5：外键连线逐根亮起（5 步 × 0.3s = 1.5s；“外键”约在拍内 2.35s，3.85s 亮完 < 拍长 4.28s）
    at('外键', all(
      g12fk().opacity(1, 0.4),
      chain(
        all(g12fk1().opacity(1, 0.3), g12fk1dot().opacity(1, 0.3)),
        all(g12fk2().opacity(1, 0.3), g12fk2dot().opacity(1, 0.3)),
        all(g12fk3feed().opacity(1, 0.3), g12fk3trunk().opacity(1, 0.3), g12fk3b[0]().opacity(1, 0.3), g12fk3dots[0]().opacity(1, 0.3)),
        all(g12fk3b[1]().opacity(1, 0.3), g12fk3dots[1]().opacity(1, 0.3)),
        all(g12fk3b[2]().opacity(1, 0.3), g12fk3dots[2]().opacity(1, 0.3)),
      ),
    )),
  );

  say('行里也能嵌套');
  yield* beat('b13a',
    all(g12().opacity(0, 0.5), g13().opacity(1, 0.5)),
    at('结构化类型', all(g13nested[0]().opacity(1, 0.5), g13nested[1]().opacity(1, 0.5))),
  );

  say('还能查，还能建索引');
  yield* beat('b13b',
    at('单行里', g13mag().opacity(1, 0.4)),
    at('还能查', g13mag().scale(1.15, 0.8)),
    at('还能建索引', g13idx().opacity(1, 0.4)),
  );

  say('多家数据库支持');
  yield* beat('b14a',
    chain(g13dbs[0]().opacity(1, 0.4), g13dbs[1]().opacity(1, 0.4), g13dbs[2]().opacity(1, 0.4), g13dbs[3]().opacity(1, 0.4)),
  );

  say('JSON 类型也有了');
  yield* beat('b14b', all(g13jsonTag().opacity(1, 0.5), g13jsonDbs().opacity(1, 0.5)));

  say('第三种做法');
  yield* beat('b15a', g13col().opacity(1, 0.5));

  say('编成 JSON 文档');
  yield* beat('b15b',
    at('编成', g13doc().opacity(1, 0.6)),
    g13doc().scale(1.04, beat.dur('b15b')),
  );

  say('应用自己解释');
  yield* beat('b15c',
    all(g13app().opacity(1, 0.5)),
    at('存进一列文本里', g13dark().opacity(0.85, 0.4)),
    at('应用自己解释', chain(g13appTags[0]().opacity(1, 0.4), g13appTags[1]().opacity(1, 0.4), g13appTags[2]().opacity(1, 0.4))),
  );

  say('库里查不到里面');
  yield* beat('b16',
    all(g13arrow().opacity(1, 0.3)),
    at('查不到', chain(g13arrow().points([[-60, 150], [-170, 150]], 0.6), g13arrow().points([[-60, 150], [-100, 150]], 0.7), g13x().opacity(1, 0.4))),
  );

  say('合回一个 JSON');
  yield* beat('b17',
    all(g13().opacity(0, 0.5), g17().opacity(1, 0.5)),
    at('自包含的文档', chain(g17lines[0]().opacity(1, 0.5), g17lines[1]().opacity(1, 0.5))),
    at('JSON 表示', chain(g17lines[2]().opacity(1, 0.5), g17lines[3]().opacity(1, 0.5), g17lines[4]().opacity(1, 0.5))),
    at('比 XML 简单', g17tag().opacity(1, 0.4)),
  );

  say('文档库不少');
  yield* beat('b18a', chain(g17slots[0]().opacity(1, 0.3), g17slots[1]().opacity(1, 0.3), g17slots[2]().opacity(1, 0.3), g17slots[3]().opacity(1, 0.3)));

  say('MongoDB 等文档库');
  yield* beat('b18b',
    at('MongoDB', g17names[0]().opacity(1, 0.4)),
    at('RethinkDB', g17names[1]().opacity(1, 0.4)),
    at('CouchDB', g17names[2]().opacity(1, 0.4)),
    at('Espresso', g17names[3]().opacity(1, 0.4)),
  );

  say('失配小了？');
  yield* beat('b19',
    all(g17band().opacity(1, 0.5)),
    at('失配小了', chain(g17gap().width(30, 0.7), g17gap().fill(T.green, 0.4))),
  );

  say('也有问题，后面再讲');
  yield* beat('b20',
    g17().scale(1.01, beat.dur('b20')),
    at('自己的问题', g17tags[0]().opacity(1, 0.5)),
    at('没有 schema', g17tags[1]().opacity(1, 0.5)),
  );
});
