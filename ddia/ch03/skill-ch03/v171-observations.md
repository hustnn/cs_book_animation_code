# v1.7.1 观察记录（第 3 章 r2 重做）

任务：观察“渲染成功后自动验证解码输出”（skill v1.7.1 候选补丁）是否需要。
规则：只观察、只记录。**不要改 skill、不要开 PR。**证据汇总到整章汇报里由协调人定夺。

记录格式（每条一例）：
- 日期 / 单元 / 轮次 / 场景文件
- QA 输出（0 error 的证据：qa-summary.md 或场景 qa.json 的相关行）
- 落盘文件的问题证据（ffprobe 输出、ffmpeg 全片解码输出、时长/帧数）
- 处理：重渲后是否干净（重渲命令、重渲后复核结果）

## 记录

### 2026-11-25（UTC 11-24 16:41）/ U0 / r2 / `ch03/motion-canvas/src/scenes/skill03/u0-mc1.tsx`

- 经过：本单元直接渲染（`node scripts/render.mjs u0-mc1 --qa`，RENDER_LOCK_PATH=工作区 `.render-lock`）先通过，QA 0 error / 35 warn（全是单采样点转场叠化），落盘 `output/u0-mc1.mp4` 67.63s / 2029 帧、全片解码 0 错误；据此拼出快照成片 `rounds/u0/r2/u0.mp4`（同样 67.633s / 2029 帧、解码 0 错误）。随后跑整章 `qa_chapter.py --project motion-canvas --dir src/scenes/skill03 --md skill-ch03/rounds/u0/r2/qa.md` 时，它重渲 u0-mc1 撞上 600s 超时被杀，落盘文件被截断。
- QA 输出：该次重渲没有写出 `output/u0-mc1.qa.json`（文件缺失；直接渲染那份 35-warn 的 qa.json 也随重渲被清掉、未恢复）；`output/u0-mc1.qa.log` 末尾只有一行 `[render] timeout after 600s`，此前满屏 Vite HMR 热更新（并行单元在改场景文件）。没有“QA 0 error”的假通过——这次是 QA 根本没跑完。
- 落盘文件的问题证据：`output/u0-mc1.mp4`（2026-11-24 16:41:53 UTC，599356 字节）ffprobe：`duration=15.466667`，`nb_frames=464`（预期 67.63s / 2029 帧）；`ffmpeg -v error -i … -f null -` 输出为空、退出码 0——**截断文件解码“干净”，只比时长/帧数才看得出**。与 v1.7.1 补丁要防的情形同类：光看“能解码”不够，必须拿落盘文件对预期时长/帧数。
- 疑似诱因（待协调人确认）：同一时段另一路渲染（u2-mc1，pid 13077/18513）在走默认 `/tmp/textbook-to-animation.render-lock`，而本单元走工作区 `.render-lock`——两把不同的锁，两个渲染并行跑在 1.5 核共享 CPU 上；加并行改文件引发的 HMR 风暴，600s 默认超时不够。
- 处理：整章扫掠已停（26 分钟仅推进 2/53 场景，u0 记为“失败（退出码 1）”），改用作用域命令 `qa_chapter.py --project motion-canvas u0-mc1 --timeout 1200 --md skill-ch03/rounds/u0/r2/qa.md` 重渲。**重渲后干净**：u0-mc1 通过，0 error / 35 warn（covered 19 / edge 9 / text-overlap 5 / crossed 2，与第一次直接渲染的 35 条一致）；落盘 `output/u0-mc1.mp4` 恢复为 67.633s / 2029 帧、全片解码 0 错误，`u0-mc1.qa.json` 与指纹 `u0-mc1.qa.deps.json` 均已写出。快照成片 `rounds/u0/r2/u0.mp4` 来自第一次直接渲染的干净产物，不受此次截断影响（已复核：67.633s / 2029 帧 / 解码 0 错误）。

### 2026-11-25（UTC 11-24 16:31–16:52）/ U5 / r2 / 探针场景 `u2-mc1`（非 QA 渲染，非严格触发条件，仅记录同类故障）

- 经过：U5 r2 渲染前按 SETUP 跑环境探针 `bash env-probe.sh`（写文件 + ffmpeg testsrc + `node scripts/render.mjs u2-mc1 --port 9024 --timeout 600` 非 QA 模式，RENDER_LOCK_PATH=工作区 `.render-lock`）。探针渲染进程 pid 18513 持锁约 20 分钟、CPU 仅 0:03，落盘 `output/u2-mc1.mp4` 写于 16:47 后不再变化，进程始终不退出；16:52 杀掉探针会话后进程自行退出，锁自动转给下一等待者（pid 19464，`u2-mc1 --qa`）。
- QA 输出：无——探针是非 QA 渲染，没有 qa.json / QA 0 error 的说法；**不满足 v1.7.1 的严格触发条件**（QA 报 0 error 但文件解不出），只记录“渲染写出看似正常、实则解不出的文件”这一同类故障。
- 落盘文件的问题证据：`output/u2-mc1.mp4`（2026-11-24 16:47 UTC，1889970 字节）ffprobe：`duration=86.533333`，`nb_frames=2596`，1280×720 h264——头部数据看似正常；`ffmpeg -nostdin -v error -i … -f null -` 退出码 69，1696 处 `Invalid NAL unit size` / `Error splitting the input into NAL units` / `no frame`，全片解码失败（复核时写进程已退出，非边写边读）。
- 疑似诱因（待协调人确认）：同一时段另有多个渲染在跑（`ps` 见 u2-mc1 --qa、u3-mc1 --qa、u1-mc1 --qa、u6-mc1 --qa、u0-mc1 排队）；U0 单元的记录称同一时段有另一路 u2-mc1 渲染在走默认 `/tmp` 锁路径——若属实，机器锁被 split 成两把，两个渲染并行跑在 1.5 核共享 CPU 上。另：两个探针同用 `--port 9024`（pid 13077 16:26、18513 16:31），Vite 端口也可能冲突。
- 处理：探针文件不是交付物，不影响 U5；重跑双探针（待锁空闲）后再开工，探针会重写该文件。U5 场景本身的 v1.7.1 观察待渲染后补记。

### 2026-11-25（UTC 11-24 17:35–18:34）/ U5 / r2 / 探针场景 `u2-mc1`（非 QA 渲染，非严格触发条件，仅记录）

- 经过：按协调人通知改用 U5 独占端口 9025 重跑双探针（`/tmp/probe-u5.sh`，env-probe.sh 步骤 + 全片解码复核）。第一次通过：渲染 114.5s，ffprobe 99.4s，解码 0 错误，PROBE-PASS。第二次：渲染退出 0（`set -e` 未中断），ffprobe 有时长输出，解码打印了 NAL 错误但退出码 0（"decode OK"），PROBE-PASS。两次均按探针自身标准通过，可以开工。
- QA 输出：无——探针是非 QA 渲染；**不满足 v1.7.1 严格触发条件**。
- 落盘文件的问题证据（第二次探针解码，`tail -4` 仅保留 2 行错误，文件随后被他人渲染覆盖，未能量化）：`[h264] Error splitting the input into NAL units`、`[dec:h264] Decoding error: Invalid data found when processing input`，但 ffmpeg 退出码 0——**文件含少量损坏 NAL、仍“解得出”**，与 U0 截断案（解码干净、只比时长才看得出）互为镜像：光看退出码不够，须数错误行。当前 `output/u2-mc1.mp4` 已是他人渲染中的 48 字节截断态（18:34），与本条无关。
- 环境备注：第二次探针等锁 43 分钟（锁是 mkdir 竞争、无 FIFO 队列，约 8 个等待者轮流中奖）；另有 3 路探针渲染（9027/9028 端口）各持锁约 10 分钟、CPU 仅 ~1s、超时未产出任何文件；中途一次运行时重启清掉了 /tmp 与全部渲染进程，锁死锁后自动清理。
- 处理：按探针标准两次通过，U5 正式渲染照常进行；每段 U5 落盘文件均做 ffprobe 时长/帧数 + 全片解码错误计数复核（协调人通知第 4 条），有问题即作用域重渲并另行记录。
- U2 r2 复核（2026-11-25，同一文件，1889970 字节，16:47 UTC）：ffprobe duration 86.53s（u2-mc1 按 timeline b1–b13 应为 99.37s）；`ffprobe -count_frames` 实际读出 1915 帧（元数据 nb_frames=2596，应约 2981 帧）；`ffmpeg -nostdin -v error -i … -f null -` 全片解码 3138 行报错，其中 966 行 `Invalid NAL unit size`（另有大量 `missing picture in access unit` / `Error splitting the input into NAL units` / `no frame!`）。结论一致：只看 ffprobe duration 与元数据帧数不够，必须全片解码并对预期帧数。本单元的 QA 渲染（pid 19464，持工作区锁）随后重渲覆盖该文件，装配前再对场景文件逐个 ffprobe + 全片解码复核。

## 整章拼装与章级 QA 阶段（2026-11-25，结论：本轮未复现严格触发条件）

- 经过：拼装前逐轨预检（`preflight-ch03-r2.py`）对 16 个单元成片逐个 ffprobe + 全片解码 + 内嵌字幕抽取计数，ALL PASS；`assemble-ch03-r2.py` 内预检 16/16 OK；ffmpeg 拼接一次成功，成片 `videos/ch03-skill-r2.mp4` 全片解码 0 错误（`verify-ch03-r2.py` ALL PASS）。随后整章 `qa_chapter.py --dir src/scenes/skill03`（2026-11-25 00:18–00:48，54 场景，0 error）重渲 21 个场景（u3-mc1/mc2/mc3、u6-mc1/mc2/mc3、u7-mc1/mc2/mc3/mc4、u8-mc3、u9-mc1/mc3/mc4、u11-mc1/mc3/mc4、u12-mc1/mc3、u15-mc1/mc3），逐个复核落盘文件：ffprobe 时长/帧数与时长×30fps 一致、全片解码 0 错误、时长 ≥ QA 最大采样点；U3 三场景时长之和 357.57s、U6 三场景 282.37s、U7 四场景 349.57s，与对应单元成片分毫不差（u8-mc3 85.00s / 2550 帧、u9-mc1 59.00s / 1770 帧、u7-mc1 100.00s / 3000 帧，均与单元制作时的干净落盘一致）。
- QA 输出：章级 QA 0 error / 984 warn，gate 通过；拼装预检与复核 0 error。
- 落盘文件的问题证据：无。三处检查（拼装前预检、拼装后复核、21 个重渲场景落盘复核）均未发现“QA 报 0 error 但落盘文件解不出/截断/时长帧数对不上”的情况。
- 判定：**严格触发条件在本轮拼装与章级 QA 阶段未复现**。本轮单元制作阶段的同类故障与严格触发案例（U0 截断、U4 mc1/mc3、U8 mc3、U9 mc1）见上文各条，拼装阶段无新增条目。

### 2026-11-25（UTC 11-24 18:26）/ U4 / r3 / `ch03/motion-canvas/src/scenes/skill03/u4-mc3.tsx`

- 经过：作用域渲染 `qa_chapter.py --project motion-canvas u4-mc1 u4-mc2 u4-mc3 u4-mc4 --timeout 1200 --port 9028 --md skill-ch03/rounds/u4/r3/qa.md`（RENDER_LOCK_PATH=工作区 `.render-lock`，按协调人 2026-11-25 通知：作用域渲染、独占端口 9028）。u4-mc3 渲染日志 `[render] finished: 0 (0 = Success) in 119.8s`，随后 `[qa] 1 error / 7 warn`，`output/u4-mc3.qa.json` 与指纹 `u4-mc3.qa.deps.json` 均已写出。
- QA 输出：1 error（d29b offscreen“延伸 · 原文之外”，t=60.86 / 62.55 / 64.40 / 66.24 / 67.94）+ 7 warn（d27/d28 edge“孤儿页”各 1、d29a offscreen“延伸 · 原文之外”1、d29b covered 4）。**不满足严格触发条件**（QA 报 0 error 但文件解不出）——QA 本身报了 1 个 error；但 QA 采样到了 67.94s，说明 QA 是对直播页面采样的，不看法盘文件。
- 落盘文件的问题证据：`output/u4-mc3.mp4`（2026-11-24 18:26:31 UTC，409560 字节，写后不再变化）ffprobe：`duration=8.966667`，`nb_frames=269`，1280×720 h264（预期 68.1s / 约 2043 帧）；`ffmpeg -nostdin -v error -i … -f null -` 输出为空、退出码 0——**截断文件解码“干净”，只比时长/帧数才看得出**。渲染进程退出码 0、QA 报告与指纹都已写出：若之后有人跑 `qa_chapter --no-render`，这份 9 秒的文件会被当作通过的渲染产物——与 v1.7.1 补丁要防的情形同类。
- 疑似诱因（待协调人确认）：`u4-mc3.qa.log` 末尾在渲染进行时有大量其他单元的 HMR 热更新（u8-mc1/mc2/mc3）与 `Connection timeout when updating metadata`（u12-mc3、u15-mc1/mc2/mc3 等）；编码器约在 9 秒处停止写盘，而 Chrome 页面继续播放到 68 秒（QA 采样到 67.94s）。另：同一时段锁队列里有多个其他单元的渲染与探针在排队。
- 处理：已解决。先修 d29b offscreen error（角标 tag() 默认右缘锚点致出画，改左缘锚点 [-1,0]），再作用域重渲 u4-mc3（`qa_chapter.py --project motion-canvas u4-mc1 u4-mc2 u4-mc3 u4-mc4 --timeout 1200 --port 9028`，mc1/mc2 因指纹新鲜被跳过）。**重渲后干净**：落盘 `output/u4-mc3.mp4` 恢复为 68.17s / 2045 帧（预期 68.1s / 约 2043 帧）、全片解码 0 错误；QA 0 error / 6 warn（d29b offscreen error 已消失）。同批 u4-mc1 重渲（132.67s / 3980 帧，QA 0 error）与 u4-mc2 重渲（50.60s / 1518 帧，QA 0 error）落盘干净、全片解码 0 错误。注：本轮另有两次运行期重启（约 19:28、21:31 UTC）打断 qa_chapter，第二轮在 mc4 等锁时被杀、第三轮接续；mc3/mc4 的重渲在第三轮完成。

### 2026-11-25（UTC 11-24 18:49–18:51）/ U7 / r3 / 探针场景 `u2-mc1`（非 QA 渲染，非严格触发条件，仅记录）

- 经过：U7 r3 渲染前按 SETUP 跑双探针（`ch03/skill-ch03/u7-r3-render-mc1.sh`：`node scripts/render.mjs u2-mc1 --port 9027 --timeout 600`，RENDER_LOCK_PATH=工作区 `.render-lock`，U7 独占端口 9027）。探针 1 通过：等锁约 22 分钟，渲染 117.0s，落盘 `output/u2-mc1.mp4` 739470 字节 / 99.40s（预期 99.37s），PROBE-PASS 1。探针 2：等锁约 51 分钟，渲染日志 frame 0 / 600 / 1800，`[render] finished: 0 (0 = Success) in 125.7s`。
- QA 输出：无——探针是非 QA 渲染；**不满足 v1.7.1 严格触发条件**（QA 报 0 error 但文件解不出），只记录“渲染报 Success、落盘文件却是空头文件”这一同类故障。
- 落盘文件的问题证据：`output/u2-mc1.mp4`（2026-11-24 18:51:19 UTC，**48 字节**）`od` 内容：`ftyp isom` + `free` + 空 `mdat` 头，无任何媒体数据、无 moov；ffprobe：`moov atom not found` / `Invalid data found when processing input`。预期 99.37s / 约 2981 帧；磁盘剩余 143G，非磁盘满。**与 U5 记录里 18:34 见到的“48 字节截断态”是同一尺寸、同一形状——48 字节空头文件已是第二次出现**，不是孤例：编码器只写了文件头就停了，render.mjs 仍报 Success。
- 疑似诱因（待协调人确认）：(a) @motion-canvas/ffmpeg 导出器不校验落盘文件——写盘中途停了仍报 `finished: 0`；(b) 并发写同一路径：全章多路探针都在反复渲染 `u2-mc1`、写同一个 `output/u2-mc1.mp4`，17:09 已证实锁分裂仍在发生（`/tmp` 锁由一路 u2-mc1 渲染持有、工作区锁由 u6-mc1 持有）；探针 2 渲染时段（18:49–18:51）是否有 `/tmp` 锁一路并行写盘未确认（现查 `/tmp` 锁为空闲）。(c) 与 U4-mc3 案（编码器约 9 秒处停写、页面继续播到 68 秒）同类：写盘停、播放不停。
- 处理：**脚本缺陷一并记录**：`u7-r3-render-mc1.sh` 的探针循环只判 render.mjs 退出码、不判 ffprobe 退出码，探针 2 落盘已坏仍打印 `PROBE-PASS x2` 并继续跑 `u7-mc1 --qa`——该标签不可信，以人工核对为准。u7-mc1 渲染已在排队等锁（锁现由 u2-mc1 pid 2193 持有）；mc1 落盘将人工核对（ffprobe 时长/帧数 + ffmpeg 全片解码），若同样落地损坏则作用域重渲并更新本条。u7-mc1 写 `output/u7-mc1.mp4`，无其他单元并行写同一路径，并发写盘的疑似诱因 (b) 不适用于 mc1。
- 后续（2026-11-25 UTC 19:28）：运行时重启中断了后台脚本，u7-mc1 --qa 死在排队等锁阶段（未拿到锁、未渲染）；`output/u7-mc1.mp4` 仍是 r2 的 06:34 文件（607772 字节），未被触碰。重启后环境复核：`output/u2-mc1.mp4`（19:16 他人探针落盘）99.40s / 2982 帧、全片解码 0 错误——重启后渲染管线可用；据此不再重跑双探针，直接作用域重渲 u7-mc1 --qa（端口 9027，日志 `skill-ch03/u7-mc1-r3-render.log`），落盘仍人工核对。
- 后续（2026-11-25 UTC 20:51）：u7-mc1 首渲**落盘干净**：100.00s / 3000 帧（预期 99.97s / 约 2999 帧）、全片解码 0 错误；QA 5 error / 31 warn（非落盘问题，是场景内 5 处文字骑边/互叠，见下）。重渲后（21:00）同样干净：100.00s / 3000 帧、解码 0 错误，QA **0 error / 19 warn**。结论：探针 2 的 48 字节空头文件未在 u7-mc1 上复现；该故障仍是偶发（本轮 2 次 u2-mc1 探针 1 坏 1 好、u7-mc1 2 次全好）。

### 2026-11-24（UTC 11-24 13:40）/ U8 / r3 / `ch03/motion-canvas/src/scenes/skill03/u8-mc3.tsx`

- 经过：**严格触发**。作用域渲染 `qa_chapter.py --project motion-canvas u8-mc1 u8-mc2 u8-mc3 --port 9038 --timeout 1200 --md skill-ch03/rounds/u8/r3/qa.md`（RENDER_LOCK_PATH=工作区 `.render-lock`，U8 独占端口 9038；此前同一命令用默认端口 9000 时撞上他路渲染的 Vite（`Port 9000 is already in use`）失败一次，另一次被运行时重启中断）。本次 mc1/mc2 沿用已有报告，只渲 mc3：`[render] finished: 0 (0 = Success) in 127.0s`，随后 `[qa] 0 error / 8 warn`，`output/u8-mc3.qa.json` 与指纹 `u8-mc3.qa.deps.json` 均已写出，qa.md 结论“通过”。
- QA 输出：0 error / 8 warn（h25 covered ×6、h26b covered ×1 + text-overlap ×1，采样点 t=46.16 / 64.02）——**QA 采样到了 64.02s，说明 QA 是对直播页面采样的，不看法盘文件**。
- 落盘文件的问题证据：`output/u8-mc3.mp4`（2026-11-24 21:40:17 +08，851174 字节）ffprobe：`duration=18.933333`，`nb_frames=568`（预期 85.00s / 2550 帧）；`ffmpeg -nostdin -v error -i … -f null -` 输出为空、退出码 0——**截断文件解码“干净”，只比时长/帧数才看得出**。与 U4-mc3 案（编码器约 9 秒处停写、页面继续播到 68 秒）同类：写盘停、播放不停。
- 疑似诱因（待协调人确认）：渲染中 Vite 页面两次重载 `src/project.ts`（21:38:35–36，他路改动），随后满屏 `Connection timeout when updating metadata`（全部 53 个场景），21:39:39 又有 `u7-mc2.tsx` 的 HMR 热更新；编码器约在 18.9 秒处停止写盘，渲染进程仍报 Success。另：同一文件稍早的直接渲染（`node scripts/render.mjs u8-mc3 --qa --port 9038`）落盘干净：85.00s / 2550 帧、解码 0 错误、QA 同样 0 error / 8 warn（同一组 warn、同一采样点）——同一场景、同一命令，一次干净一次截断，故障偶发。
- 影响范围：快照成片 `rounds/u8/r3/u8.mp4`（241.20s / 62 条字幕、解码干净）是在此次 qa_chapter 重渲之前、从干净的三个场景文件拼出的，**不受此次截断影响**；mc1（87.23s / 2617 帧）、mc2（68.97s / 2069 帧）同批重渲落盘干净。仅 `output/u8-mc3.mp4` 需重渲修复。
- 处理：作用域直接重渲 mc3（`node scripts/render.mjs u8-mc3 --qa --port 9038`），复核时长/帧数/解码后更新本条。
- 处理结果（2026-11-24 22:28 +08）：直接重渲干净——`[render] finished: 0 (0 = Success) in 91.9s`，QA 0 error / 8 warn（与截断那次同一组 warn、同一采样点），落盘 `output/u8-mc3.mp4` 恢复为 **85.00s / 2550 帧、全片解码 0 错误**（851174 字节，与第一次干净渲染字节数相同，编码确定性）。qa.md 的“mc3 通过 0/8”结论不受影响（QA 本就是对直播页面采样）；快照成片 `rounds/u8/r3/u8.mp4` 复核仍为 241.20s / 62 条字幕、解码干净。

### 2026-11-25（UTC 11-24 21:08–21:36）/ U9 / r2 / `ch03/motion-canvas/src/scenes/skill03/u9-mc1.tsx`

- 经过：作用域渲染 `qa_chapter.py --project ../motion-canvas u9-mc1 u9-mc2 u9-mc3 u9-mc4 --timeout 1200 --md rounds/u9/r2/qa.md`（RENDER_LOCK_PATH=工作区 `.render-lock`，从 skill-ch03 运行）。mc2/mc3/mc4 通过（0 error / 11、9、9 warn）；mc1 重渲失败。
- QA 输出：mc1 记为“渲染失败（render.mjs 退出码 1，日志 output/u9-mc1.qa.log）”，qa.md 当时结论仍为 error 0 条（其余三场景），但 mc1 明确未通过。**不满足 v1.7.1 严格触发条件**（QA 报 0 error 但文件解不出）——QA 正确报了失败；但落盘文件的问题与 v1.7.1 同类。
- 落盘文件的问题证据：失败渲染把此前干净的 `output/u9-mc1.mp4`（440423 字节，59.0s / 1770 帧，直接渲染 QA 0 error / 13 warn）**覆盖成截断文件**（2026-11-24 21:08 UTC，275864 字节）ffprobe：`duration=37.800000`，`nb_frames=1134`（预期 59.0s / 1770 帧）。截断文件未做全片解码（复核时长/帧数后即重渲覆盖）；渲染日志：`[page] error [mc-logger] {"message":"An error occurred while exporting the video.","remarks":"Method: end<br>Server error: Input stream error: stream.push() after EOF","object":0,"level":"error"}`，`[render] finished: 1 (0 = Success) in 186.3s`；日志中另有一行 `[page] error Connection timeout when updating metadata for virtual:settings`（mc4 重渲日志里也出现过同一行、但渲染成功，疑似无关噪音）。
- 处理：作用域直接重渲 mc1（`node scripts/render.mjs u9-mc1 --qa --port 9121 --timeout 900 --lock-timeout 90`）。**重渲后干净**：退出 0，QA 0 error / 13 warn（与第一次直接渲染的 13 条一致：covered 7 / edge 4 / text-overlap 2，0 idle、0 fast-move）；落盘恢复为 440423 字节、59.0s / 1770 帧、全片解码 0 错误。随后重跑同一条 qa_chapter 命令：仅 mc1 重渲（其余三场景指纹新鲜被跳过），四场景全部通过，0 error / 42 warn（covered 22 / edge 18 / text-overlap 2），qa.md 已更新。注：mc1 重渲命令的会话在最后的解码复核步骤被一次运行时重启 SIGTERM 中断，但渲染本身已在日志里 exit 0，文件随后单独复核无误；/tmp 下的该次渲染日志亦被重启清掉，证据以 qa.json 与 ffprobe 为准。
- 教训（与 U0/U4/U8 案一致）：失败的渲染也会覆盖落盘文件，**“渲染失败”不等于“文件还在”**；每次渲染后必须 ffprobe 时长/帧数 + 全片解码复核，不能只看退出码或 QA 结论。

## U4（2026-11-25 UTC 11-24 22:46，r3 d4b 定格修复重渲）

- 现象：`output/u4-mc1.mp4` 落盘截断——ffprobe 时长 16.17s / 485 帧（预期 132.67s / 约 3980 帧），950392 字节，写后不再增长；ffmpeg 全片解码退出码 0、无任何错误输出（解码“干净”）。
- 触发背景：为修 sample_frames 报的 d4b 定格 error（7.17s，见 r3 定格表）改了 u4-mc1.tsx（d4b 加根页脉冲与子页淡入），tsc 0 error、at() 短语 0 问题，随后作用域重渲 `qa_chapter.py --project motion-canvas u4-mc1 --timeout 1200 --port 9028 --md skill-ch03/rounds/u4/r3/qa-mc1.md`，全程退出码 0。
- QA 输出：`u4-mc1.qa.json` 共 19 条，**0 error**（idle warn 仅 d12a 4.3s、d10 3.2s）；qa_chapter 汇总正常写出，`u4-mc1.qa.deps.json` 指纹已更新——若有人跑 `qa_chapter --no-render`，这份 16 秒文件会被当作通过的渲染产物。
- 判定：**满足 v1.7.1 补丁的严格触发条件**（QA 0 error + 落盘文件截断/不可用）。与本轮早些的 U4 mc3 截断（8.97s，QA 曾报 1 error）不同，本次 QA 完全无 error，是更纯粹的漏网案例。
- 处理：已解决。删除陈旧指纹（`u4-mc1.qa.deps.json`/`u4-mc1.qa.json`/`u4-mc1.qa.log`）后作用域重渲，落盘恢复为 **132.67s / 3980 帧**、全片解码 0 错误；QA 0 error / 19 warn。注意：第一次重渲尝试因指纹新鲜被跳过（90 秒即出汇总、文件未变）——截断文件被指纹“认证”为通过，这正是补丁要堵的口子；删指纹强制重渲后才恢复。

### 2026-11-25（UTC 11-24 18:35–23:24）/ U5 / r2 / 正式渲染 5 场景（结论：本轮未复现严格触发条件）

- 经过：U5 r2 五场景经直接渲染（`node scripts/render.mjs u5-mcN --qa --port 9025`，工作区锁）+ 修复重渲 + `qa_chapter.py --project ../motion-canvas u5-mc1..u5-mc5 --port 9025 --timeout 1200` 汇总重渲，共三轮。每次渲染后立即 ffprobe 时长/帧数 + ffmpeg 全片解码错误计数复核；装配前对 stage 副本再做一轮 pre-flight（容器 vs 视频轨时长、帧数 vs 时长×30fps、全片解码）。
- QA 输出：最终 5 场景全部 0 error（mc1 0/4、mc2 0/1、mc3 0/2、mc4 0/5、mc5 0/1 warn；qa.md 结论“通过”，教学设计检查通过）。
- 落盘文件复核：mc1 47.40s/1422 帧、mc2 48.50s/1455 帧、mc3 71.17s/2135 帧、mc4 45.43s/1363 帧、mc5 66.23s/1987 帧，均与 lint 预期一致、全片解码 0 错误行；成片 `rounds/u5/r2/u5.mp4` 278.73s、8362 帧、全片解码干净。**无“QA 0 error 但落盘文件解不出/截断/时长帧数对不上”的情形——严格触发条件本轮在 U5 正式渲染中未复现。**
- 备注：本轮 U5 仅有的同类故障是开工前两条 u2-mc1 探针记录（见上，非 QA 渲染、非严格触发）。另：第三轮渲染作业（render-u5.sh）与第二轮（render-u5b.sh）各被一次运行时重启中断一次，均在等锁阶段被杀、无渲染进行中；恢复后从已验证的检查点接续，未重复已通过的渲染。
