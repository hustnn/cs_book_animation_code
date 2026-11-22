#!/usr/bin/env python3
"""自检规则的通用测试：确认 lint 和渲染 QA 在“与任何教材无关”的用例上判定全部符合预期。

用法：
  python qa_selftest.py --project <motion-canvas 工程目录> [--lint-only] [--port 9100] [--keep]

什么时候跑：
  - 改了 qa.ts / beats.ts / layout.ts / lint_scenes.py 的规则之后；
  - 在某一章里发现误报或漏报、往 qa-fixtures 里补了复现用例之后（先看它失败，改规则，再看全部通过）；
  - 新环境第一次搭好之后。
做什么：
  1. lint：对 assets/motion-canvas/qa-fixtures/lint-fixture.tsx 跑 lint_scenes.py，
     核对并行补间冲突、观众可见文字的命中，以及不该命中的写法（p99、拍号、key）确实没被报。
  2. 渲染 QA：把 qa-fixture.tsx 和它的时间轴临时放进工程（src/scenes/qa-fixtures/、src/timeline/），
     在 src/project.ts 里临时登记这个场景，用 qa_chapter.py（内部调 render.mjs --qa）渲染，
     逐拍对照 expect.json。无论成败，结束时都恢复 project.ts、删掉临时放进去的文件（--keep 可保留）。
  3. 汇总：核对 qa_chapter.py 的汇总——门槛判为未通过、列出的 error 拍与 expect.json 一致、idle / overrun 带秒数。
  工程里的 lib/qa.ts、beats.ts、layout.ts 与 skill 里的不一致时会先提示：自检测的是工程里的那一份。
有不符合预期的用例时退出码为 1。
"""
import argparse
import filecmp
import json
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

SKILL = Path(__file__).resolve().parents[1]
FIX = SKILL / "assets" / "motion-canvas" / "qa-fixtures"
LIB_FILES = ["qa.ts", "beats.ts", "layout.ts"]


def check_lint():
    rows = []
    with tempfile.TemporaryDirectory() as tmp:
        shutil.copy(FIX / "lint-fixture.tsx", Path(tmp) / "lint-fixture.tsx")
        out = Path(tmp) / "lint.json"
        subprocess.run([sys.executable, "-I", str(SKILL / "scripts" / "lint_scenes.py"), tmp, "--json", str(out)],
                       capture_output=True, text=True, stdin=subprocess.DEVNULL)
        data = json.loads(out.read_text(encoding="utf-8"))
    targets = sorted(c[2] for c in data.get("conflicts", []))
    rows.append(("lint 并行补间冲突 = box().opacity、dot().position",
                 targets == ["box().opacity", "dot().position"], f"实际 {targets}"))
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
    ap.add_argument("--port", default="9100", help="渲染用的端口，避免和正在跑的渲染冲突")
    ap.add_argument("--keep", action="store_true", help="保留临时放进工程的测试场景和时间轴")
    a = ap.parse_args()
    rows = check_lint()
    if not a.lint_only:
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
