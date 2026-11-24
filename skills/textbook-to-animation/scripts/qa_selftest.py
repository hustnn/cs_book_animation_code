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
  工程里的 lib/qa.ts、beats.ts、layout.ts 与 skill 里的不一致时会先提示：自检测的是工程里的那一份。
有不符合预期的用例时退出码为 1。
"""
import argparse
import filecmp
import json
import os
import shutil
import signal
import subprocess
import sys
import tempfile
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
                                  "qa-fixture", "--all", "--port", port, "--json", str(summary_path),
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
        rows = check_lint() + check_lock()
    if not a.lint_only and not a.lock_only:
        if not a.project:
            ap.error("渲染 QA 自检需要 --project（只测 lint 用 --lint-only）")
        rows += check_qa(a.project.resolve(), a.port, a.keep)
    fails = [r for r in rows if not r[1]]
    for name, ok, detail in rows:
        print(f"[{'PASS' if ok else 'FAIL'}] {name}" + ("" if ok else f"  ← {detail}"))
    print(f"\n{len(rows) - len(fails)}/{len(rows)} 通过")
    sys.exit(1 if fails else 0)


if __name__ == "__main__":
    main()
