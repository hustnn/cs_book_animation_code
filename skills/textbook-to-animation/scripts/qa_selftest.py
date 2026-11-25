#!/usr/bin/env python3
"""自检规则的通用测试：确认 lint 和渲染 QA 在“与任何教材无关”的用例上判定全部符合预期。

用法：
  python qa_selftest.py --project <motion-canvas 工程目录> [--lint-only | --lock-only] [--port 9100] [--keep]

什么时候跑：
  - 改了 qa.ts / beats.ts / layout.ts / lint_scenes.py 的规则之后；改了渲染锁（render_lock.py / render-lock.mjs）之后；
  - 在某一章里发现误报或漏报、往 qa-fixtures 里补了复现用例之后（先看它失败，改规则，再看全部通过）；
  - 新环境第一次搭好之后。
做什么：
  1. lint：对 assets/motion-canvas/qa-fixtures/lint-fixture.tsx 跑 lint_scenes.py，
     核对并行补间冲突、观众可见文字的命中，以及不该命中的写法（p99、拍号、key）确实没被报。
  2. 渲染 QA：把 qa-fixture.tsx 和它的时间轴临时放进工程（src/scenes/qa-fixtures/、src/timeline/），
     在 src/project.ts 里临时登记这个场景，用 qa_chapter.py（内部调 render.mjs --qa）渲染，
     逐拍对照 expect.json。无论成败，结束时都恢复 project.ts、删掉临时放进去的文件（--keep 可保留）。
  3. 汇总：核对 qa_chapter.py 的汇总——门槛判为未通过、列出的 error 拍与 expect.json 一致、idle / overrun 带秒数。
  4. 渲染锁（用临时锁目录，不碰真实的锁）：排队、超时不运行、死锁自动清、不删活锁、嵌套不自等、被 kill 也放锁，
     Python（render_lock.py）与 Node（render-lock.mjs）两边互认，render.mjs 拿不到锁时不渲染；
     以及 render.mjs 的 --help 和不认识的参数不会启动渲染。约 20 秒，不需要 --project。
  6. 渲染中途改源码：渲染用的 Vite 不监视文件，中途改 src/lib/theme.ts 产物照样完整；vite.config.ts 没同步
     （渲染时还监视文件）时，render.mjs 发现页面被重新加载、按失败处理。会把工程里的 theme.ts、vite.config.ts
     临时改掉再恢复，渲出的 qa-fixture.mp4 也先备份再恢复。
  5. 落盘验证：对渲出的 qa-fixture.mp4 现场造截断、双 moov、NAL 损坏、空头文件和预期时长对不上的复现，
     确认 verify_output 全部拦下、干净文件通过；有 ffprobe 和只有 ffmpeg 两种模式都测；缺 ffmpeg 时返回问题、不抛异常；
     注释里的 beat('…') 不计入预期时长。坏文件用例不进版本库。
  工程里的 lib/qa.ts、beats.ts、layout.ts 与 skill 里的不一致时会先提示：自检测的是工程里的那一份。
有不符合预期的用例时退出码为 1。
"""
import argparse
import filecmp
import json
import re
import os
import shutil
import signal
import subprocess
import sys
import tempfile
import threading
import time
from pathlib import Path

SKILL = Path(__file__).resolve().parents[1]
FIX = SKILL / "assets" / "motion-canvas" / "qa-fixtures"
LIB_FILES = ["qa.ts", "beats.ts", "layout.ts"]
RENDER = SKILL / "assets" / "motion-canvas" / "render"
SCRIPT_FILES = ["render.mjs", "render-lock.mjs"]  # 工程里的 scripts/ 下
LOCK_PY = SKILL / "scripts" / "render_lock.py"
NODE_PROBE = """
import {pathToFileURL} from 'node:url';
const [mod, mode, arg] = process.argv.slice(2);
const {acquire} = await import(pathToFileURL(mod).href);
if (mode === 'try') {
  const l = await acquire('node-probe', {timeoutMin: Number(arg), log: () => {}});
  console.log(l ? 'GOT' : 'NONE');
  l?.release();
} else {
  const l = await acquire('node-holder', {log: () => {}});
  console.log('HELD');
  await new Promise(r => setTimeout(r, Number(arg) * 1000));
  l.release();
}
"""


def check_lock():
    """渲染锁：两套实现（render_lock.py、render-lock.mjs）在临时锁目录上的行为。"""
    rows = []
    node = shutil.which("node")
    tmp = Path(tempfile.mkdtemp(prefix="lock-selftest-"))
    lock = tmp / "render.lock"
    env = {**os.environ, "RENDER_LOCK_PATH": str(lock)}
    env.pop("RENDER_LOCK_TOKEN", None)
    probe = tmp / "probe.mjs"
    probe.write_text(NODE_PROBE, encoding="utf-8")
    py = [sys.executable, "-I", str(LOCK_PY)]
    # render.mjs 放进临时“工程”里跑：node_modules/vite 是个立即退出的假 vite。锁要是坏了、render.mjs 往下走了，
    # 也只会卡在等 dev server，被下面的超时收掉，不会在 skill 目录里起一个真的 vite
    fake = tmp / "proj"
    (fake / "scripts").mkdir(parents=True)
    (fake / "node_modules" / "vite" / "bin").mkdir(parents=True)
    (fake / "node_modules" / "vite" / "bin" / "vite.js").write_text("process.exit(0);\n", encoding="utf-8")
    for name in SCRIPT_FILES:
        shutil.copy(RENDER / name, fake / "scripts" / name)
    render_mjs = fake / "scripts" / "render.mjs"
    procs = []

    def sh(argv, timeout=60, e=None, **kw):
        """跑到结束；超时不抛异常，返回码记为 None（这一条判 FAIL）。"""
        try:
            return subprocess.run(argv, env=e or env, capture_output=True, text=True, timeout=timeout,
                                  stdin=kw.pop("stdin", subprocess.DEVNULL), **kw)
        except subprocess.TimeoutExpired:
            return subprocess.CompletedProcess(argv, None, "", "超时")

    def run(*args, timeout=60):
        return sh([*py, *args], timeout=timeout)

    def bg(argv, **kw):
        """后台进程：单独的进程组，结束时整组收掉（包括 run 包着的命令）。"""
        pr = subprocess.Popen(argv, env=env, start_new_session=os.name != "nt", **kw)
        procs.append(pr)
        return pr

    def wait(pr, timeout):
        try:
            return pr.wait(timeout=timeout)
        except subprocess.TimeoutExpired:
            return None

    def pyc(code):
        return [sys.executable, "-c", code]

    def wait_held(seconds=10):
        end = time.time() + seconds
        while time.time() < end:
            if (lock / "owner.json").exists():
                return True
            time.sleep(0.05)
        return False

    def node_try(timeout_min):
        return sh([node, str(probe), str(RENDER / "render-lock.mjs"), "try", str(timeout_min)], timeout=60).stdout.strip()

    try:
        r = run("run", "t1", "--", *pyc("import sys; sys.exit(7)"))
        rows.append(("锁 run：退出码等于命令的退出码，跑完锁已放", r.returncode == 7 and not lock.exists(),
                     f"退出码 {r.returncode}，锁{'还在' if lock.exists() else '已放'}"))

        # 一、Python 持锁（直到 go 文件出现），期间：超时的不运行、break 拒绝、Node 拿不到、render.mjs 不渲染；
        #     排队的等它放了再跑
        end_f, start_f, mark, go = tmp / "end", tmp / "start", tmp / "mark", tmp / "go"
        holder = bg([*py, "run", "holder", "--", *pyc(
            "import os, time\n"
            f"t = time.time()\nwhile not os.path.exists({str(go)!r}) and time.time() - t < 60: time.sleep(0.05)\n"
            f"open({str(end_f)!r}, 'w').write(repr(time.time()))")],
            stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        rows.append(("锁 run：拿到锁并写下持锁信息", wait_held(), "10 秒内没看到 owner.json"))
        waiter = bg([*py, "run", "waiter", "--timeout", "1", "--", *pyc(
            f"import time; open({str(start_f)!r}, 'w').write(repr(time.time()))")],
            stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        r = run("run", "late", "--timeout", "0.02", "--", *pyc(f"open({str(mark)!r}, 'w')"))
        rows.append(("锁被占时等锁超时：退出码 3，命令没有运行", r.returncode == 3 and not mark.exists(),
                     f"退出码 {r.returncode}，命令{'运行了' if mark.exists() else '没运行'}"))
        r = run("break")
        rows.append(("锁 break：持锁进程还在时拒绝删锁", r.returncode == 1 and lock.exists(), f"退出码 {r.returncode}"))
        if node:
            got = node_try(0.02)
            rows.append(("Node 认 Python 的锁：锁被占时拿不到", got == "NONE", f"实际 {got!r}"))
            r = sh([node, str(render_mjs), "selftest-scene", "--lock-timeout", "0.02"], timeout=30)
            rows.append(("render.mjs 拿不到锁：退出码 3，没有启动渲染",
                         r.returncode == 3 and "vite ready" not in r.stdout, f"退出码 {r.returncode}"))
        go.touch()
        wait(holder, 30)
        wait(waiter, 90)
        ok = waiter.returncode == 0 and start_f.exists() and end_f.exists() and \
            float(start_f.read_text()) >= float(end_f.read_text())
        rows.append(("排队的等持锁的跑完才开始，跑完锁已放", ok and not lock.exists(),
                     f"waiter 退出码 {waiter.returncode}，锁{'还在' if lock.exists() else '已放'}"))

        if node:
            # 二、Node 持锁，Python 拿不到；Node 放锁后锁目录消失
            h = bg([node, str(probe), str(RENDER / "render-lock.mjs"), "hold", "3"], stdout=subprocess.PIPE, text=True)
            held = h.stdout.readline().strip() == "HELD"
            r = run("run", "late", "--timeout", "0.02", "--", *pyc("pass"))
            wait(h, 30)
            rows.append(("Python 认 Node 的锁：锁被占时退出码 3；Node 放锁后锁已放",
                         held and r.returncode == 3 and not lock.exists(), f"held={held} 退出码 {r.returncode}"))

        # 三、死锁（持锁进程已不在）：两边都自动清掉再拿
        dead = subprocess.Popen(pyc("pass"))
        dead.wait()

        def plant_dead():
            shutil.rmtree(lock, ignore_errors=True)  # 前一条失败时可能留着锁
            lock.mkdir()
            (lock / "owner.json").write_text(json.dumps({
                "owner": "crashed", "token": "dead", "host": __import__("socket").gethostname(),
                "pids": [dead.pid], "started": time.time() - 30, "cmd": "", "cwd": ""}), encoding="utf-8")
        plant_dead()
        t0 = time.time()
        r = run("run", "after-crash", "--timeout", "0.5", "--", *pyc("pass"))
        rows.append(("Python 自动清死锁：持锁进程不在了，不用等", r.returncode == 0 and time.time() - t0 < 10
                     and "清理死锁" in r.stderr and not lock.exists(), f"退出码 {r.returncode}"))
        if node:
            plant_dead()
            got = node_try(0.5)
            rows.append(("Node 自动清死锁", got == "GOT" and not lock.exists(), f"实际 {got!r}"))

        # 四、嵌套：子进程认出锁是上层替它拿的，不自己等自己
        r = run("run", "outer", "--", *py, "run", "inner", "--timeout", "0.02", "--", *pyc("pass"))
        rows.append(("嵌套 run 不自己等自己", r.returncode == 0 and not lock.exists(), f"退出码 {r.returncode}"))
        if node:
            r = run("run", "outer", "--", node, str(probe), str(RENDER / "render-lock.mjs"), "try", "0.02")
            rows.append(("render_lock.py run 里跑的 render.mjs 不自己等自己", "GOT" in r.stdout and r.returncode == 0,
                         f"输出 {r.stdout.strip()!r}"))

        # 五、锁目录刚建、持锁信息还没写：当作正在被拿，不算死锁；放久了（60s 以上）才算
        shutil.rmtree(lock, ignore_errors=True)
        lock.mkdir()
        r = run("run", "x", "--timeout", "0.02", "--", *pyc("pass"))
        fresh_busy = r.returncode == 3
        old = time.time() - 120
        os.utime(lock, (old, old))
        r = run("run", "x", "--timeout", "0.1", "--", *pyc("pass"))
        rows.append(("空锁目录：刚建时算占用，60s 以上没写持锁信息算死锁", fresh_busy and r.returncode == 0 and not lock.exists(),
                     f"刚建时{'等' if fresh_busy else '没等'}，放久后退出码 {r.returncode}"))

        # 六、被 kill（SIGTERM）时也放锁
        if os.name != "nt":
            w = bg([*py, "run", "killed", "--", *pyc("import time; time.sleep(30)")],
                   stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            wait_held()
            time.sleep(0.5)  # 等子进程启动、pid 写进锁
            w.send_signal(signal.SIGTERM)
            code = wait(w, 10)
            rows.append(("run 被 kill 时转发给命令并放锁", code == 143 and not lock.exists(), f"退出码 {code}"))

        if node:
            r = sh([node, str(render_mjs), "--help"], timeout=30)
            rows.append(("render.mjs --help 只打印用法", r.returncode == 0 and "用法" in r.stdout and not lock.exists(),
                         f"退出码 {r.returncode}"))
            r = sh([node, str(render_mjs), "--lock-timout", "5"], timeout=30)
            rows.append(("render.mjs 不认识的参数报错退出、不渲染", r.returncode == 64 and not lock.exists(),
                         f"退出码 {r.returncode}"))
        else:
            rows.append(("Node 一侧的锁测试", False, "找不到 node"))
    finally:
        for pr in procs:
            if pr.poll() is None:
                try:
                    os.killpg(pr.pid, signal.SIGKILL) if os.name != "nt" else pr.kill()
                except OSError:
                    pass
                rows.append((f"后台进程按时结束：{' '.join(map(str, pr.args))[-60:]}", False, "超时，已强制结束"))
        shutil.rmtree(tmp, ignore_errors=True)
    return rows


def check_lint():
    rows = []
    with tempfile.TemporaryDirectory() as tmp:
        # 按工程里的相对位置摆放：场景 import '../../timeline/qa-fixture.json'，at() 的时间窗要靠它估
        scenes = Path(tmp) / "src" / "scenes" / "lint"
        scenes.mkdir(parents=True)
        (Path(tmp) / "src" / "timeline").mkdir()
        shutil.copy(FIX / "lint-fixture.tsx", scenes / "lint-fixture.tsx")
        shutil.copy(FIX / "qa-fixture.json", Path(tmp) / "src" / "timeline" / "qa-fixture.json")
        out = Path(tmp) / "lint.json"
        subprocess.run([sys.executable, "-I", str(SKILL / "scripts" / "lint_scenes.py"), str(scenes), "--json", str(out)],
                       capture_output=True, text=True, stdin=subprocess.DEVNULL)
        data = json.loads(out.read_text(encoding="utf-8"))
    targets = sorted(c[2] for c in data.get("conflicts", []))
    rows.append(("lint 并行补间冲突 = box().opacity、dot().position",
                 targets == ["box().opacity", "dot().position"], f"实际 {targets}"))
    overlaps = sorted(f"{c[2]} {c[3]}" for c in data.get("cue_overlaps", []))
    rows.append(("lint 跨 at() 同对象补间 = f21 dot().position（不报不重叠的、同一 at 里 chain 的）",
                 overlaps == ["f21 dot().position"], f"实际 {overlaps}"))
    visible = data.get("visible", [])
    kinds = {v[3] for v in visible if v[0] == "error"}
    for k in ["页码", "图表编号", "提到原书", "内部编号"]:
        rows.append((f"lint 可见文字报出「{k}」", k in kinds, f"实际 {sorted(kinds)}"))
    bad = [v[4] for v in visible if v[4].startswith(("p99", "p50", "b3", "u7"))]
    rows.append(("lint 不误报百分位、拍号、key", not bad, f"误报 {bad}"))
    ext = [v for v in visible if v[5] == "延伸 · 原文之外"]
    rows.append(("lint 不误报设计规定的“延伸 · 原文之外”标签", not ext, f"误报 {ext}"))
    return rows + check_lint_opening()


def check_lint_opening():
    """lint 的“开头”规则：播 timeline 第一拍的场景要有 UnitTitle / ChapterTitle；一整章要有 ChapterTitle + Roadmap 的开篇。"""
    scene = """import {{makeScene2D}} from '@motion-canvas/2d';
import {{makeBeats}} from '../../lib/beats';
import {{ChapterTitle, Roadmap, UnitTitle}} from '../../lib/opening';
import timeline from '../../timeline/{tl}.json';
export default makeScene2D(function* (view) {{
  const beat = makeBeats(timeline);
  {body}
  yield* beat('{first}');
  yield* beat('{second}');
}});
"""
    rows = []
    with tempfile.TemporaryDirectory() as tmp:
        sc = Path(tmp) / "src" / "scenes" / "ch"
        tl = Path(tmp) / "src" / "timeline"
        sc.mkdir(parents=True)
        tl.mkdir()

        def add(name, first, body):
            (tl / f"{name}.json").write_text(json.dumps([{"id": first, "text": "一"}, {"id": first + "x", "text": "二"}]))
            (sc / f"{name}.tsx").write_text(scene.format(tl=name, first=first, second=first + "x", body=body), encoding="utf-8")

        def lint():
            out = Path(tmp) / "lint.json"
            subprocess.run([sys.executable, "-I", str(SKILL / "scripts" / "lint_scenes.py"), str(sc), "--json", str(out)],
                           capture_output=True, text=True, stdin=subprocess.DEVNULL)
            return sorted(f for f, _ in json.loads(out.read_text(encoding="utf-8")).get("opening", []))

        add("ua", "a1", "// UnitTitle 只写在注释里不算")
        add("ub", "b1", "const u = new UnitTitle(null, null, {title: '第二单元'});")
        got = lint()
        rows.append(("lint 开头：单元第一拍没有标题的场景报出、有 UnitTitle 的不报；两个单元没有开篇报“整章”",
                     got == ["ua.tsx", "（整章）"], f"实际 {got}"))
        add("u0", "o1", "const t = new ChapterTitle({title: '章'} as any);")
        got = lint()
        rows.append(("lint 开头：开篇只有 ChapterTitle、没有 Roadmap → 报开篇缺路线图",
                     got == ["u0.tsx", "ua.tsx"], f"实际 {got}"))
        add("u0", "o1", "const t = new ChapterTitle({title: '章'} as any); const m = new Roadmap({title: '章', parts: []} as any);")
        got = lint()
        rows.append(("lint 开头：开篇有 ChapterTitle + Roadmap → 只剩没有站牌的单元", got == ["ua.tsx"], f"实际 {got}"))
    return rows


def check_design():
    """check_design.py：完整样本（examples/lsm/design.md）全部通过；反例（design-fixtures/bad-design.md）报出预期的 FAIL。"""
    rows = []
    script = SKILL / "scripts" / "check_design.py"
    ex = SKILL / "examples" / "lsm"
    good = subprocess.run([sys.executable, "-I", str(script), str(ex / "design.md"), "--beats-json", str(ex / "beats.json")],
                          capture_output=True, text=True, stdin=subprocess.DEVNULL)
    rows.append(("check_design：示例 LSM 的 design.md 全部通过", good.returncode == 0 and "[FAIL]" not in good.stdout,
                 good.stdout[-400:]))
    bad = subprocess.run([sys.executable, "-I", str(script), str(SKILL / "assets" / "design-fixtures" / "bad-design.md")],
                         capture_output=True, text=True, stdin=subprocess.DEVNULL)
    def found(stdout: str, level: str = "FAIL"):
        out, unit = set(), ""
        for ln in stdout.splitlines():
            if ln.startswith("## 单元 "):
                unit = ln[len("## 单元 "):][:1]
            elif ln.startswith("## "):
                unit = ln[3:].split("：")[0]
            elif f"[{level}]" in ln:
                out.add(f"{unit}:{ln.split(f'[{level}]')[1].split('：')[0].strip()}")
        return out

    fails = found(bad.stdout)
    want = {"A:P0 机制", "A:机制走查 · 写入", "A:机制走查 · 读取", "A:机制走查 · 合并", "A:机制走查 · 分区",
            "B:走查题", "B:图式", "C:机制走查 · 页分裂", "C:深度延伸", "整章:开篇"}
    rows.append(("check_design：反例报出的 FAIL 与预期一致（密度、走查题、图式、走查长度、延伸依据、整章没有开篇；小结单元不查）",
                 bad.returncode == 1 and fails == want, f"多 {sorted(fails - want)}，少 {sorted(want - fails)}"))

    op = SKILL / "examples" / "opening"
    good_op = subprocess.run([sys.executable, "-I", str(script), str(op / "design.md"), "--beats-json", str(op / "beats.json")],
                             capture_output=True, text=True, stdin=subprocess.DEVNULL)
    rows.append(("check_design：示例开篇的 design.md 全部通过（章标题、主旨、开篇拍、路线图、标题拍是第一拍）",
                 good_op.returncode == 0 and "[FAIL]" not in good_op.stdout and "[PASS] 标题拍" in good_op.stdout,
                 good_op.stdout[-400:]))
    fx = SKILL / "assets" / "design-fixtures"
    bad_op = subprocess.run([sys.executable, "-I", str(script), str(fx / "bad-opening.md"),
                             "--beats-json", str(fx / "bad-opening-beats.json")],
                            capture_output=True, text=True, stdin=subprocess.DEVNULL)
    fails, warns = found(bad_op.stdout), found(bad_op.stdout, "WARN")
    want = {"整章:一句话主旨", "整章:路线图覆盖", "整章:标题拍"}
    rows.append(("check_design：开篇反例报出 主旨 / 路线图漏站 / 标题拍不是第一拍 三个 FAIL、站名过长 WARN",
                 bad_op.returncode == 1 and fails == want and "整章:站名" in warns,
                 f"多 {sorted(fails - want)}，少 {sorted(want - fails)}，WARN {sorted(warns)}"))
    return rows


def check_design_gate():
    """qa_chapter.py 的教学设计门槛：好设计放行；坏设计、找不到、找到两份都拦下（不渲染）；--no-design 放行但标“跳过”。"""
    sys.path.insert(0, str(SKILL / "scripts"))
    import qa_chapter  # noqa: E402
    rows = []
    good = SKILL / "examples" / "lsm" / "design.md"
    bad = SKILL / "assets" / "design-fixtures" / "bad-design.md"
    with tempfile.TemporaryDirectory() as tmp:
        ch = Path(tmp) / "chapter"
        proj = ch / "motion-canvas"
        proj.mkdir(parents=True)
        r = qa_chapter.design_gate(proj)
        rows.append(("qa_chapter 设计门槛：章节目录里没有设计 → 拦下", r["status"] == "missing", f"实际 {r['status']}"))
        (ch / "skill-ch").mkdir()
        shutil.copy(good, ch / "skill-ch" / "ch-design.md")
        r = qa_chapter.design_gate(proj)
        rows.append(("qa_chapter 设计门槛：自动找到 */*-design.md，好设计放行", r["status"] == "pass", f"实际 {r}"))
        shutil.copy(bad, ch / "design.md")
        r = qa_chapter.design_gate(proj)
        rows.append(("qa_chapter 设计门槛：找到两份设计 → 拦下，要求 --design", r["status"] == "ambiguous", f"实际 {r['status']}"))
        r = qa_chapter.design_gate(proj, ch / "design.md")
        rows.append(("qa_chapter 设计门槛：坏设计 → 拦下并列出 FAIL", r["status"] == "fail" and len(r["fails"]) == 10,
                     f"实际 {r['status']}，{len(r.get('fails', []))} 条"))
        r = qa_chapter.design_gate(proj, skip=True)
        rows.append(("qa_chapter 设计门槛：--no-design 放行、标为跳过", r["status"] == "skipped", f"实际 {r['status']}"))
        run = subprocess.run([sys.executable, "-I", str(SKILL / "scripts" / "qa_chapter.py"), "--project", str(proj),
                              "--design", str(ch / "design.md"), "--no-render"],
                             capture_output=True, text=True, stdin=subprocess.DEVNULL)
        rows.append(("qa_chapter 设计没过时不渲染、退出码 2", run.returncode == 2 and "不渲染" in run.stdout,
                     f"退出码 {run.returncode}"))
        nb = SKILL / "scripts" / "newbie_pack.py"
        beats = SKILL / "examples" / "lsm" / "beats.json"
        bad_run = subprocess.run([sys.executable, "-I", str(nb), "--design", str(bad), "--unit", "单元 B", "--narration", str(beats),
                                  "-o", str(Path(tmp) / "nb-bad")], capture_output=True, text=True, stdin=subprocess.DEVNULL)
        good_run = subprocess.run([sys.executable, "-I", str(nb), "--design", str(good), "--unit", "LSM", "--narration", str(beats),
                                   "-o", str(Path(tmp) / "nb-good")], capture_output=True, text=True, stdin=subprocess.DEVNULL)
        rows.append(("newbie_pack：单元设计没过不出题包（退出码 2），过了才出", bad_run.returncode == 2
                     and not (Path(tmp) / "nb-bad" / "prompt.md").exists() and good_run.returncode == 0
                     and (Path(tmp) / "nb-good" / "prompt.md").exists(), f"退出码 {bad_run.returncode} / {good_run.returncode}"))
    return rows


def verdict(expect, findings):
    errors = [f for f in findings if f["severity"] == "error"]
    if expect == "clean":
        return not findings
    if expect == "noerror":
        return not errors
    level, kind = expect.split(":", 1)
    if level == "error":
        return any(f["kind"] == kind for f in errors)
    return not errors and any(f["kind"] == kind and f["severity"] == "warn" for f in findings)


def check_summary(summary: dict):
    expect = json.loads((FIX / "expect.json").read_text(encoding="utf-8"))
    want = {b for b, v in expect.items() if not b.startswith("_") and v.startswith("error:")}
    got = {f["beat"] for f in summary["errors"]}
    secs = {f["beat"]: f.get("seconds") for f in summary["errors"] if f["kind"] in ("idle", "overrun")}
    return [
        ("汇总 qa_chapter：有 error 时门槛判为未通过", summary["gate"] is False, f"gate={summary['gate']}"),
        ("汇总 qa_chapter：列出的 error 拍与 expect.json 一致", got == want,
         f"多 {sorted(got - want)}，少 {sorted(want - got)}"),
        ("汇总 qa_chapter：idle / overrun 带秒数", (secs.get("f20") or 0) >= 6 and (secs.get("f19") or 0) > 0,
         f"实际 {secs}"),
    ]


def check_qa(project: Path, port: str, keep: bool):
    rows = []
    lib = project / "src" / "lib"
    for name in LIB_FILES:
        mine, theirs = SKILL / "assets" / "motion-canvas" / name, lib / name
        if not theirs.exists() or not filecmp.cmp(mine, theirs, shallow=False):
            print(f"[warn] 工程里的 src/lib/{name} 与 skill 的不一致（或不存在）：自检测的是工程里的版本")
    if not (project / "vite.config.ts").exists() or not filecmp.cmp(RENDER / "vite.config.ts", project / "vite.config.ts", shallow=False):
        print("[warn] 工程里的 vite.config.ts 与 skill 的不一致（或不存在）：渲染时可能还在监视源码，照 SKILL.md 的复制表补上")
    for name in SCRIPT_FILES:
        theirs = project / "scripts" / name
        if not theirs.exists() or not filecmp.cmp(RENDER / name, theirs, shallow=False):
            print(f"[warn] 工程里的 scripts/{name} 与 skill 的不一致（或不存在）：照 SKILL.md 的复制表补上")
    proj = project / "src" / "project.ts"
    scene_dst = project / "src" / "scenes" / "qa-fixtures" / "qa-fixture.tsx"
    tl_dst = project / "src" / "timeline" / "qa-fixture.json"
    if tl_dst.exists() or scene_dst.exists():
        sys.exit(f"{tl_dst} 或 {scene_dst} 已存在：上次自检可能没清理干净，确认后手动删除再跑")
    original = proj.read_text(encoding="utf-8")
    anchor = "import {makeProject} from '@motion-canvas/core';"
    if anchor not in original or "scenes: [" not in original:
        sys.exit("src/project.ts 不是预期的 makeProject({scenes: [...]}) 写法，无法临时登记测试场景")
    patched = original.replace(anchor, anchor + "\nimport qaFixture from './scenes/qa-fixtures/qa-fixture?scene';", 1)
    patched = patched.replace("scenes: [", "scenes: [\n    qaFixture,", 1)
    try:
        scene_dst.parent.mkdir(parents=True, exist_ok=True)
        tl_dst.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy(FIX / "qa-fixture.tsx", scene_dst)
        shutil.copy(FIX / "qa-fixture.json", tl_dst)
        proj.write_text(patched, encoding="utf-8")
        with tempfile.TemporaryDirectory() as tmp:
            summary_path = Path(tmp) / "summary.json"
            run = subprocess.run([sys.executable, "-I", str(SKILL / "scripts" / "qa_chapter.py"), "--project", str(project),
                                  "qa-fixture", "--all", "--no-design", "--port", port, "--json", str(summary_path),
                                  "--md", str(Path(tmp) / "summary.md")],
                                 capture_output=True, text=True, timeout=900, stdin=subprocess.DEVNULL)
            report_path = project / "output" / "qa-fixture.qa.json"
            if not report_path.exists() or not summary_path.exists():
                print(run.stdout[-3000:], run.stderr[-2000:])
                return rows + [("渲染测试场景", False, f"qa_chapter.py 退出码 {run.returncode}，见 output/qa-fixture.qa.log")]
            report = json.loads(report_path.read_text(encoding="utf-8"))
            rows += check_summary(json.loads(summary_path.read_text(encoding="utf-8")))
            lock = subprocess.run([sys.executable, "-I", str(LOCK_PY), "status", "--json"], capture_output=True, text=True)
            owner = (json.loads(lock.stdout).get("owner") or {}) if lock.returncode == 0 else {}
            rows.append(("渲染完放了渲染锁", "qa-fixture" not in str(owner.get("cmd", "")), f"锁还在：{owner}"))
            rows += check_render_reload(project, port)
    finally:
        proj.write_text(original, encoding="utf-8")
        if not keep:
            scene_dst.unlink(missing_ok=True)
            scene_dst.with_suffix(".meta").unlink(missing_ok=True)  # Motion Canvas 渲染时会在场景旁写 .meta
            (project / "output" / "qa-fixture.qa.deps.json").unlink(missing_ok=True)  # 场景已删，指纹没用了
            tl_dst.unlink(missing_ok=True)
            try:
                scene_dst.parent.rmdir()
            except OSError:
                pass
    expect = json.loads((FIX / "expect.json").read_text(encoding="utf-8"))
    for beat, want in expect.items():
        if beat.startswith("_"):
            continue
        found = [f for f in report if f["beat"] == beat]
        got = ", ".join(sorted({f"{f['severity']}:{f['kind']}" for f in found})) or "无"
        rows.append((f"QA {beat} 期望 {want}", verdict(want, found), f"实际 {got}"))
    return rows


def check_render_reload(project: Path, port: str):
    """渲染中途改源码（需要 qa-fixture 已登记在工程里、output/qa-fixture.mp4 已渲出）。
    1. 用 skill 的 vite.config.ts：中途改 src/lib/theme.ts，页面不刷新，产物时长完整，render.mjs 退出 0；
    2. 换成不关文件监视的旧 vite.config：中途改 theme.ts，页面被重新加载，render.mjs 报出来、退出码非 0。
    theme.ts、vite.config.ts、qa-fixture.mp4 结束后恢复原样。"""
    sys.path.insert(0, str(SKILL / "scripts"))
    import qa_chapter  # noqa: E402
    rows = []
    theme = project / "src" / "lib" / "theme.ts"
    cfg = project / "vite.config.ts"
    mp4 = project / "output" / "qa-fixture.mp4"
    scene = project / "src" / "scenes" / "qa-fixtures" / "qa-fixture.tsx"
    if not (theme.exists() and cfg.exists() and mp4.exists() and scene.exists()):
        return [("渲染中途改源码：需要 theme.ts、vite.config.ts 和已渲出的 qa-fixture", False, "缺文件")]
    keep = {theme: theme.read_bytes(), cfg: cfg.read_bytes(), mp4: mp4.read_bytes()}

    def render_touching():
        """渲染 qa-fixture；Vite 起来 3 秒后（渲染进行中）在 theme.ts 末尾追加一行注释。返回 (退出码, 输出, 改过没有)。"""
        mp4.unlink(missing_ok=True)
        proc = subprocess.Popen(["node", "scripts/render.mjs", "qa-fixture", "--port", port], cwd=project,
                                stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True, stdin=subprocess.DEVNULL)
        out, touched = [], []

        def touch():
            with open(theme, "a", encoding="utf-8") as fh:
                fh.write(f"\n// qa_selftest：渲染中途改动 {time.time()}\n")
            touched.append(True)
        timer = None
        for line in proc.stdout:
            out.append(line)
            if "vite ready" in line and timer is None:
                timer = threading.Timer(3.0, touch)
                timer.start()
        proc.wait()
        if timer:
            timer.cancel()
        theme.write_bytes(keep[theme])
        return proc.returncode, "".join(out), bool(touched)

    try:
        code, out, touched = render_touching()
        problems = qa_chapter.verify_output(mp4, scene, project) if mp4.exists() else ["没有产物"]
        rows.append(("渲染中途改 theme.ts（vite.config 已同步）：页面不刷新、产物完整、退出 0",
                     touched and code == 0 and "重新加载" not in out and not problems,
                     f"改过={touched} 退出码={code} 问题={problems}"))
        old_cfg = keep[cfg].decode("utf-8")
        old_cfg = re.sub(r"\n[^\n]*server:[^\n]*MC_RENDER_NO_WATCH[^\n]*\n", "\n", old_cfg)
        cfg.write_text(old_cfg, encoding="utf-8")
        code, out, touched = render_touching()
        rows.append(("渲染中途改 theme.ts（旧 vite.config，还在监视文件）：render.mjs 发现页面重载、按失败处理",
                     touched and code != 0 and "重新加载" in out and "server:" not in old_cfg,
                     f"改过={touched} 退出码={code}"))
    finally:
        for path, data in keep.items():
            path.write_bytes(data)
    return rows


def check_verify_output(project: Path):
    """落盘验证（qa_chapter.verify_output）：干净文件通过；截断、双 moov、NAL 损坏、空头文件、
    与 timeline 预期时长对不上都必须失败；有拍不在 timeline 里时只查下界，不误报偏长的文件。
    坏文件用渲出的 qa-fixture.mp4 现场造出来，不往版本库里放二进制。"""
    sys.path.insert(0, str(SKILL / "scripts"))
    import qa_chapter  # noqa: E402
    rows = []
    good = project / "output" / "qa-fixture.mp4"
    if not good.exists():
        return [("落盘验证：需要先渲出 qa-fixture.mp4", False, "output/qa-fixture.mp4 不存在")]
    data = good.read_bytes()
    with tempfile.TemporaryDirectory() as tmp:
        tmp = Path(tmp)
        # 场景与 timeline 按工程里的相对位置摆放（src/scenes/… → src/timeline/…），
        # verify_output 才能从场景的 import 算出预期时长
        scene_dir = tmp / "src" / "scenes" / "qa-fixtures"
        scene_dir.mkdir(parents=True)
        (tmp / "src" / "timeline").mkdir(parents=True)
        shutil.copy(FIX / "qa-fixture.tsx", scene_dir / "qa-fixture.tsx")
        shutil.copy(FIX / "qa-fixture.json", tmp / "src" / "timeline" / "qa-fixture.json")
        scene = scene_dir / "qa-fixture.tsx"
        variants = {"good": good}
        trunc = tmp / "trunc.mp4"
        trunc.write_bytes(data[: max(4096, len(data) // 5)])
        variants["trunc"] = trunc
        double = tmp / "double.mp4"
        double.write_bytes(data + data)
        variants["double"] = double
        corrupt = tmp / "corrupt.mp4"
        buf = bytearray(data)
        start = min(100000, len(buf) // 2)
        end = min(start + 10240, len(buf))
        buf[start:end] = b"\x00" * (end - start)
        corrupt.write_bytes(bytes(buf))
        variants["corrupt"] = corrupt
        header = tmp / "header.mp4"
        header.write_bytes(data[:48])
        variants["header"] = header
        for name, path in variants.items():
            problems = qa_chapter.verify_output(path, scene, project)
            want_fail = name != "good"
            rows.append((f"落盘验证：{name} 文件{'必须失败' if want_fail else '必须通过'}",
                         (bool(problems) if want_fail else not problems),
                         f"问题：{problems}"))
        # 预期时长比对：timeline 说 1000 秒、文件只有几十秒，必须失败
        (tmp / "src" / "timeline" / "long.json").write_text(
            json.dumps({"beats": [{"id": "x1", "dur": 1000.0, "text": ""}]}), encoding="utf-8")
        long_scene = scene_dir / "long-scene.tsx"
        long_scene.write_text(
            "import timeline from '../../timeline/long.json';\n"
            "const beat = makeBeats(timeline);\n"
            "yield* beat('x1');\n", encoding="utf-8")
        problems = qa_chapter.verify_output(good, long_scene, project)
        rows.append(("落盘验证：文件比 timeline 预期短得多时失败",
                     bool(problems) and any("预期" in p for p in problems), f"问题：{problems}"))
        # 有拍不在 timeline 里时，预期只是下界：文件比下界长不算错
        (tmp / "src" / "timeline" / "partial.json").write_text(
            json.dumps({"beats": [{"id": "y1", "dur": 1.0, "text": ""}]}), encoding="utf-8")
        partial_scene = scene_dir / "partial-scene.tsx"
        partial_scene.write_text(
            "import timeline from '../../timeline/partial.json';\n"
            "const beat = makeBeats(timeline);\n"
            "yield* beat('y1');\n"
            "yield* beat('y-missing');\n", encoding="utf-8")
        problems = qa_chapter.verify_output(good, partial_scene, project)
        rows.append(("落盘验证：有拍不在 timeline 里时只查下界、不误报偏长的文件",
                     not problems, f"问题：{problems}"))
        # 注释里的 beat('…') 不计入预期时长：x1 在 timeline 里 1000 秒，只出现在注释里，不能让好文件“比预期短”
        commented = scene_dir / "commented-scene.tsx"
        commented.write_text(
            "import timeline from '../../timeline/long.json';\n"
            "// 旧写法：yield* beat('x1');\n"
            "/* yield* beat('x1'); */\n"
            "const icon = 'http://www.w3.org/2000/svg';\n", encoding="utf-8")
        problems = qa_chapter.verify_output(good, commented, project)
        rows.append(("落盘验证：注释里的 beat('…') 不计入预期时长", not problems, f"问题：{problems}"))
        # 工具：只有 ffmpeg（没有 ffprobe）时照样能验，好文件通过、截断和预期时长对不上都拦下
        ffmpeg = qa_chapter.find_tool("ffmpeg", project)
        only = {"ffmpeg": ffmpeg, "ffprobe": None}
        ok_good = not qa_chapter.verify_output(good, scene, tools=only)
        ok_trunc = bool(qa_chapter.verify_output(trunc, scene, tools=only))
        ok_long = any("预期" in x for x in qa_chapter.verify_output(good, long_scene, tools=only))
        rows.append(("落盘验证：只有 ffmpeg 时也能验（好文件过，截断、偏短拦下）", bool(ffmpeg) and ok_good and ok_trunc and ok_long,
                     f"ffmpeg={ffmpeg} 好={ok_good} 截断={ok_trunc} 偏短={ok_long}"))
        # 缺 ffmpeg：返回问题、不抛异常（qa_chapter 主流程会在渲染前就停下）
        try:
            none = qa_chapter.verify_output(good, scene, tools={"ffmpeg": None, "ffprobe": None})
            rows.append(("落盘验证：找不到 ffmpeg 时返回问题、不抛异常", any("找不到 ffmpeg" in x for x in none), f"问题：{none}"))
        except Exception as e:  # noqa: BLE001
            rows.append(("落盘验证：找不到 ffmpeg 时返回问题、不抛异常", False, repr(e)))
        # 环境变量 FFMPEG 优先于 PATH 和工程自带的那份
        old = os.environ.get("FFMPEG")
        os.environ["FFMPEG"] = str(good)  # 任意一个存在的文件，只测查找顺序
        try:
            rows.append(("落盘验证：环境变量 FFMPEG 优先", qa_chapter.find_tool("ffmpeg", project) == str(good),
                         f"实际 {qa_chapter.find_tool('ffmpeg', project)}"))
        finally:
            if old is None:
                os.environ.pop("FFMPEG", None)
            else:
                os.environ["FFMPEG"] = old
    return rows


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--project", type=Path, help="Motion Canvas 工程目录（含 scripts/render.mjs、src/project.ts）")
    ap.add_argument("--lint-only", action="store_true")
    ap.add_argument("--lock-only", action="store_true", help="只测渲染锁和 render.mjs 的参数处理")
    ap.add_argument("--port", default="9100", help="渲染用的端口，避免和正在跑的渲染冲突")
    ap.add_argument("--keep", action="store_true", help="保留临时放进工程的测试场景和时间轴")
    a = ap.parse_args()
    if a.lock_only:
        rows = check_lock()
    else:
        rows = check_lint() + check_design() + check_design_gate() + check_lock()
    if not a.lint_only and not a.lock_only:
        if not a.project:
            ap.error("渲染 QA 自检需要 --project（只测 lint 用 --lint-only）")
        rows += check_qa(a.project.resolve(), a.port, a.keep)
        rows += check_verify_output(a.project.resolve())
    fails = [r for r in rows if not r[1]]
    for name, ok, detail in rows:
        print(f"[{'PASS' if ok else 'FAIL'}] {name}" + ("" if ok else f"  ← {detail}"))
    print(f"\n{len(rows) - len(fails)}/{len(rows)} 通过")
    sys.exit(1 if fails else 0)


if __name__ == "__main__":
    main()
