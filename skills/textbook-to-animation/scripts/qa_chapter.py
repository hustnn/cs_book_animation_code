#!/usr/bin/env python3
"""整章（或一批场景）的渲染 QA：逐个渲染、汇总成一张表，给出能不能进人工审查的结论。

用法（在哪个目录下运行都行）：
  python qa_chapter.py --project <motion-canvas 工程> --dir src/scenes/<chapter>    # 这一章的全部场景
  python qa_chapter.py --project <工程> u5-mc1 u5-mc2                                # 只看这几个场景
  python qa_chapter.py --project <工程> --dir src/scenes/<chapter> --no-render       # 不渲染，只汇总已有报告

默认只重渲“报告比代码旧”的场景：场景文件、或者它 import 的任何文件（lib、组件、时间轴 json……按 import
关系逐层找）的内容和上次渲染时不一样，才重渲。修完两个场景再跑一遍，只渲那两个；切分支、复制出一模一样的文件不算改动。
（每次渲染成功后在 output/<场景>.qa.deps.json 记下这些文件的指纹。只认带指纹的报告：直接用 render.mjs 渲染的、
渲染中途失败留下的报告都没有指纹，会被重渲一次——宁可多渲，也不拿一份可能不完整的报告当“通过”。）
  --all        全部重渲（改了 render.mjs、headless.ts 这类不被场景 import 的文件时用）
  --no-render  不渲染；报告缺失或比代码旧的场景记为未通过
  --port / --timeout  传给 render.mjs（默认 9000 / 每个场景 600 秒）
  --lock-timeout      每个场景等渲染锁最多多少分钟（默认 90）。render.mjs 每渲一个场景拿一次锁，别的单元的渲染
                      可以插在两个场景之间，不会被一次整章 QA 堵住；等锁超时就停下，剩下的场景记为未渲染
  --md / --json  汇总写到哪里（默认 <工程>/output/qa-summary.md、qa-summary.json）
  --strict     门槛没过时退出码为 1
  --design PATH        这一章的教学设计（默认在工程上一级目录里找 design.md / *-design.md，深两层）
  --design-beats PATH  给 check_design.py 核对拍号用的 beats.json（可选）
  --no-design          不查教学设计：不讲机制的工程，或设计早于 skill v1.9 结构的已定稿章节；汇总里会写明跳过了

教学设计门槛（先于渲染）：渲染前先对 design.md 跑 check_design.py。没过（有 FAIL）、找不到、找到不止一份，
都直接停下、不渲染，退出码 2——机制没设计清楚，渲染出来的画面也要推倒重做。SKILL.md 第 2 步的门槛就是它。

渲染门槛：选中的场景都有最新的报告（渲染成功）、error 总数为 0。
汇总里另列：idle warn（动画做完后静止 3–6s 的拍，人工审查时要逐条说得出理由）、fast-move warn（看得清的文字
一次移动不到 0.5s 就走了 ≥ 150px，观众跟不上，逐条看一眼是不是机制的主角）、各类 warn 的条数、
没有用 beat() 计时的场景（QA 查不到，标为“未覆盖”，要人工看帧）。Manim 段不在范围内。
每类 error 怎么修，见 references/qa-rules.md 第 5 节。
"""
import argparse
import datetime
import hashlib
import json
import re
import subprocess
import sys
import time
from collections import Counter
from pathlib import Path

CHECK_DESIGN = Path(__file__).resolve().parent / "check_design.py"
DESIGN_EXIT = 2


def find_design(project: Path):
    """工程上一级（章节目录）里的 design.md / *-design.md，最多深两层。"""
    chapter = project.parent
    pats = ("design.md", "*-design.md", "*/design.md", "*/*-design.md")
    return sorted({p.resolve() for pat in pats for p in chapter.glob(pat) if "node_modules" not in p.parts})


def design_gate(project: Path, design=None, beats=None, skip=False) -> dict:
    """教学设计门槛：{status: pass / fail / missing / ambiguous / skipped, path, fails, note}。"""
    if skip:
        return {"status": "skipped", "note": "用 --no-design 跳过"}
    if design is None:
        hits = find_design(project)
        if not hits:
            return {"status": "missing", "note": f"{project.parent} 下找不到 design.md / *-design.md：用 --design 指定"}
        if len(hits) > 1:
            return {"status": "ambiguous", "candidates": [str(h) for h in hits],
                    "note": f"找到 {len(hits)} 份设计：用 --design 指定这一章用的是哪一份"}
        design = hits[0]
    design = Path(design)
    if not design.exists():
        return {"status": "missing", "note": f"{design} 不存在"}
    cmd = [sys.executable, "-I", str(CHECK_DESIGN), str(design)] + (["--beats-json", str(beats)] if beats else [])
    r = subprocess.run(cmd, capture_output=True, text=True, stdin=subprocess.DEVNULL)
    fails, unit = [], ""
    for ln in r.stdout.splitlines():
        if ln.startswith("## "):
            unit = ln[3:].strip()
        elif "[FAIL]" in ln:
            fails.append(f"{unit}：{ln.split('[FAIL]', 1)[1].strip()}")
    if r.returncode == 0:
        return {"status": "pass", "path": str(design), "fails": [], "note": r.stdout.strip().splitlines()[-1] if r.stdout else ""}
    return {"status": "fail", "path": str(design), "fails": fails, "note": (r.stderr or r.stdout).strip()[-300:] if not fails else ""}


IMPORT = re.compile(r"""(?:\bfrom|\bimport)\s*['"](\.{1,2}/[^'"]+)['"]""")
EXTS = ["", ".ts", ".tsx", ".js", ".jsx", ".json", "/index.ts", "/index.tsx"]
CODE = {".ts", ".tsx", ".js", ".jsx"}


def read(f: Path) -> str:
    return f.read_text(encoding="utf-8", errors="ignore")


def registered(project: Path) -> dict:
    """project.ts 里登记的场景：{场景名: 场景文件}。render.mjs 只能渲染登记过的场景。"""
    txt = read(project / "src" / "project.ts")
    found = {}
    for rel in re.findall(r"""from\s+['"]\./(scenes/[^'"?]+)\?scene['"]""", txt):
        f = resolve(project / "src" / rel)
        if f:
            found[Path(rel).name] = f
    return found


def discover(project: Path, names, scene_dir):
    """返回 [(场景名, 场景文件或 None, 是否已登记)]，保持顺序。"""
    reg = registered(project)
    by_path = {f: n for n, f in reg.items()}
    picked = {}
    if scene_dir:
        d = (scene_dir if scene_dir.is_absolute() else project / scene_dir).resolve()
        if not d.is_dir():
            sys.exit(f"--dir {d} 不是目录")
        for f in sorted(d.rglob("*.tsx")):
            f = f.resolve()
            if f in by_path:
                picked[by_path[f]] = (f, True)
            elif "makeScene2D" in read(f):  # 像场景、却没登记：渲染不了，要报出来
                picked[f.stem] = (f, False)
    for n in names:
        if n in reg:
            picked[n] = (reg[n], True)
        else:
            hits = sorted((project / "src" / "scenes").rglob(f"{n}.tsx"))
            picked[n] = (hits[0].resolve() if hits else None, False)
    if not scene_dir and not names:
        picked = {n: (f, True) for n, f in reg.items()}
    return [(n, f, ok) for n, (f, ok) in picked.items()]


def uses_beats(scene: Path) -> bool:
    """QA 探针挂在 beat() 上：场景（或它用的模板，如文字卡）调用了 makeBeats 才查得到。"""
    for f in deps(scene):
        src = read(f)
        if "function makeBeats" not in src and "makeBeats(" in src:
            return True
    return False


def resolve(base: Path):
    for e in EXTS:
        cand = Path(str(base) + e)
        if cand.is_file():
            return cand.resolve()
    return None


def deps(scene: Path):
    """场景文件和它（逐层）import 的本地文件。"""
    seen, stack = set(), [scene.resolve()]
    while stack:
        f = stack.pop()
        if f in seen:
            continue
        seen.add(f)
        if f.suffix not in CODE:
            continue
        for rel in IMPORT.findall(read(f)):
            hit = resolve(f.parent / rel.split("?")[0])
            if hit:
                stack.append(hit)
    return seen


def fingerprint(scene: Path) -> dict:
    return {str(f): hashlib.sha1(f.read_bytes()).hexdigest() for f in sorted(deps(scene))}


def stale(scene: Path, report: Path) -> bool:
    if not report.exists():
        return True
    side = report.with_name(report.name.replace(".qa.json", ".qa.deps.json"))
    # 没有指纹、或指纹比报告旧（报告是后来直接用 render.mjs 渲的）：不知道报告对应哪一版代码、是否完整，算过期
    if not side.exists() or side.stat().st_mtime < report.stat().st_mtime - 1:
        return True
    return json.loads(side.read_text(encoding="utf-8")) != fingerprint(scene)


LOCK_TIMEOUT_EXIT = 3  # render.mjs：等渲染锁超时，没有渲染


def render(project: Path, name: str, port: str, timeout: int, lock_timeout: float):
    out = project / "output"
    out.mkdir(exist_ok=True)
    report, log = out / f"{name}.qa.json", out / f"{name}.qa.log"
    report.unlink(missing_ok=True)  # 渲染失败时不能留着上一次的报告冒充结果
    t0 = time.time()
    with open(log, "w", encoding="utf-8") as fh:
        try:
            code = subprocess.run(
                ["node", "scripts/render.mjs", name, "--qa", "--port", port, "--timeout", str(timeout),
                 "--lock-timeout", f"{lock_timeout:g}"],
                cwd=project, stdout=fh, stderr=subprocess.STDOUT, stdin=subprocess.DEVNULL,
                timeout=timeout + lock_timeout * 60 + 180,
            ).returncode
        except subprocess.TimeoutExpired:
            code = "超时"
    ok = code in (0, 2) and report.exists()
    if not ok:
        report.unlink(missing_ok=True)  # 旧版 render.mjs 渲染失败时也会写一份空报告，不能留着冒充“0 error”
    side = out / f"{name}.qa.deps.json"
    side.unlink(missing_ok=True)
    return ok, time.time() - t0, code


def seconds(f):
    if isinstance(f.get("seconds"), (int, float)):
        return float(f["seconds"])
    m = re.search(r"静止 ([\d.]+)s", f.get("text", ""))  # 旧报告没有 seconds 字段
    return float(m.group(1)) if m else None


def cell(s) -> str:
    return str(s).replace("|", "\\|").replace("\n", " ")


def build(project, rows, findings_by_scene, design=None):
    errors, idle, fast, warn_kinds = [], [], [], Counter()
    for r in rows:
        for f in findings_by_scene.get(r["name"], []):
            if f["severity"] == "error":
                errors.append(f)
            else:
                warn_kinds[f["kind"]] += 1
                if f["kind"] == "idle":
                    idle.append(f)
                elif f["kind"] == "fast-move":
                    fast.append(f)
    order = {r["name"]: i for i, r in enumerate(rows)}
    errors.sort(key=lambda f: (order.get(f["scene"], 0), min(f.get("times") or [0])))
    idle.sort(key=lambda f: -(seconds(f) or 0))
    fast.sort(key=lambda f: (order.get(f["scene"], 0), min(f.get("times") or [0])))
    reasons = []
    bad = [r["name"] for r in rows if r["status"] in ("渲染失败", "没有报告", "报告比代码旧")]
    if bad:
        reasons.append(f"{len(bad)} 个场景没有最新的报告：{', '.join(bad)}")
    if errors:
        reasons.append(f"{len(errors)} 条 error")
    if design and design["status"] not in ("pass", "skipped"):
        reasons.append("教学设计检查没过")
    return {
        "generated": datetime.datetime.now().isoformat(timespec="seconds"),
        "project": str(project),
        "gate": not reasons,
        "reasons": reasons,
        "scenes": rows,
        "errors": errors,
        "idle": idle,
        "fastMove": fast,
        "warnKinds": dict(warn_kinds.most_common()),
        "uncovered": [r["name"] for r in rows if r["status"] == "未覆盖"],
        "design": design or {"status": "skipped", "note": "没有传入"},
    }


def design_line(d) -> str:
    d = d or {}
    st = d.get("status")
    if st == "pass":
        return f"教学设计检查：通过（{d.get('path')}）"
    if st == "skipped":
        return f"教学设计检查：**已跳过**（{d.get('note', '')}）——审查时确认这一章确实不需要"
    return f"教学设计检查：**未通过**（{d.get('note') or '；'.join(d.get('fails', [])[:5])}）"


def markdown(s, limit=None) -> str:
    rows = s["scenes"]
    rendered = sum(1 for r in rows if r.get("rendered"))
    reused = sum(1 for r in rows if not r.get("rendered") and r["status"] in ("通过", "有 error"))
    out = [
        f"# 渲染 QA 汇总（{s['generated'].replace('T', ' ')}）",
        "",
        f"场景 {len(rows)} 个：本次渲染 {rendered} 个，沿用已有报告 {reused} 个，未覆盖 {len(s['uncovered'])} 个。",
        "",
        ("结论：**通过**（error 为 0，可以进入人工审查）" if s["gate"] else "结论：**未通过**——" + "；".join(s["reasons"])),
        "",
        design_line(s.get("design")),
        "",
        "## 各场景",
        "",
        "| 场景 | 状态 | error | warn | 最长 idle | error 类型 |",
        "|---|---|---|---|---|---|",
    ]
    for r in rows:
        idle = f"{r['idleMax']:.1f}s" if r.get("idleMax") else "—"
        kinds = ", ".join(f"{k}×{n}" for k, n in r.get("errorKinds", {}).items()) or "—"
        status = r["status"] + (f"（{r['note']}）" if r.get("note") else "")
        out.append(f"| {r['name']} | {status} | {r.get('errors', '—')} | {r.get('warns', '—')} | {idle} | {kinds} |")

    errs = s["errors"] if limit is None else s["errors"][:limit]
    out += ["", f"## 要修的 error（{len(s['errors'])} 条）", ""]
    if s["errors"]:
        out += ["| 场景 | 拍 | 时刻 | 类型 | 文字 | 和谁 | 说明 |", "|---|---|---|---|---|---|---|"]
        for f in errs:
            t = min(f.get("times") or [0])
            out.append(
                f"| {f['scene']} | {f['beat']} | {t:.2f}s | {f['kind']} | {cell(f.get('text', ''))} | "
                f"{cell(f.get('other', '') or '—')} | {cell(f.get('note', '') or '—')} |"
            )
        if limit is not None and len(s["errors"]) > limit:
            out.append(f"| … | 另 {len(s['errors']) - limit} 条见汇总文件 | | | | | |")
        out += ["", "修法见 skill 的 `references/qa-rules.md` 第 5 节；有意的划掉、打叉给节点设 `key=\"qa-ignore-<说明>\"`。"]
    else:
        out.append("无。")

    idle = s["idle"] if limit is None else s["idle"][:limit]
    out += ["", f"## 动画做完后静止 3–6s 的拍（idle warn，{len(s['idle'])} 条：人工审查时逐条说得出理由）", ""]
    if s["idle"]:
        out += ["| 场景 | 拍 | 静止 |", "|---|---|---|"]
        for f in idle:
            sec = seconds(f)
            out.append(f"| {f['scene']} | {f['beat']} | {f'{sec:.1f}s' if sec is not None else cell(f.get('text', ''))} |")
        if limit is not None and len(s["idle"]) > limit:
            out.append(f"| … | 另 {len(s['idle']) - limit} 条见汇总文件 | |")
    else:
        out.append("无。")

    fast = s.get("fastMove", [])
    shown = fast if limit is None else fast[:limit]
    out += ["", f"## 移动过快的文字（fast-move warn，{len(fast)} 条：是机制的主角就放慢、一次一个）", ""]
    if fast:
        out += ["| 场景 | 拍 | 文字 | 距离 | 用时 |", "|---|---|---|---|---|"]
        for f in shown:
            sec = seconds(f)
            out.append(f"| {f['scene']} | {f['beat']} | {cell(f.get('text', ''))} | {f.get('ratio', '?')}px | "
                       f"{f'{sec:.2f}s' if sec is not None else '?'} |")
        if limit is not None and len(fast) > limit:
            out.append(f"| … | 另 {len(fast) - limit} 条见汇总文件 | | | |")
    else:
        out.append("无。")

    if s["uncovered"]:
        out += ["", "## 未覆盖（没有用 beat() 计时，QA 查不到，要人工看帧）", ""]
        out += [f"- {n}" for n in s["uncovered"]]
    if s["warnKinds"]:
        out += ["", "## warn 分类（叠化、瞬时、半透明、遮罩等，看联系表时顺带扫一眼）", ""]
        out += ["| 类型 | 条数 |", "|---|---|"] + [f"| {k} | {n} |" for k, n in s["warnKinds"].items()]
    return "\n".join(out) + "\n"


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("scenes", nargs="*", help="场景名（文件名去掉 .tsx）；不给且不给 --dir 时取 project.ts 里登记的全部场景")
    ap.add_argument("--project", type=Path, required=True, help="Motion Canvas 工程目录（含 scripts/render.mjs）")
    ap.add_argument("--dir", type=Path, help="场景目录（相对工程或绝对路径），取其中登记在 project.ts 里的场景")
    ap.add_argument("--all", action="store_true", help="全部重渲")
    ap.add_argument("--no-render", action="store_true", help="不渲染，只汇总已有报告")
    ap.add_argument("--port", default="9000")
    ap.add_argument("--timeout", type=int, default=600, help="单个场景的渲染超时（秒）")
    ap.add_argument("--lock-timeout", type=float, default=90, help="每个场景等渲染锁最多多少分钟")
    ap.add_argument("--md", type=Path)
    ap.add_argument("--json", type=Path)
    ap.add_argument("--strict", action="store_true", help="门槛没过时退出码为 1")
    ap.add_argument("--design", type=Path, help="教学设计 design.md（默认在工程上一级目录里找）")
    ap.add_argument("--design-beats", type=Path, help="核对拍号用的 beats.json")
    ap.add_argument("--no-design", action="store_true", help="不查教学设计（汇总里写明跳过）")
    a = ap.parse_args()
    if a.all and a.no_render:
        ap.error("--all 和 --no-render 不能同时用")
    project = a.project.resolve()

    # 教学设计门槛：先于渲染。没过就停——机制没设计清楚，渲染出来也要重做
    design = design_gate(project, a.design, a.design_beats, a.no_design)
    if design["status"] not in ("pass", "skipped"):
        print(f"教学设计检查没过，不渲染（{design.get('path') or ''}）：")
        fails = design.get("fails", [])
        for f in fails[:30]:
            print(f"  [FAIL] {f}")
        if len(fails) > 30:
            print(f"  …… 共 {len(fails)} 条 FAIL（完整列表：python {CHECK_DESIGN} {design.get('path')}）")
        if design.get("note"):
            print(f"  {design['note']}")
        for c in design.get("candidates", []):
            print(f"  候选：{c}")
        print("先按 examples/lsm/design.md 的结构改 design.md，直到 check_design.py 没有 FAIL；"
              "不讲机制的工程或已定稿的旧章节用 --no-design。")
        sys.exit(DESIGN_EXIT)
    print(design_line(design))

    if not (project / "scripts" / "render.mjs").exists():
        sys.exit(f"{project} 下没有 scripts/render.mjs：--project 要指向 Motion Canvas 工程目录")

    scenes = discover(project, a.scenes, a.dir)
    if not scenes:
        sys.exit("没有找到场景")
    out = project / "output"
    rows, findings = [], {}
    todo = []
    for name, path, ok in scenes:
        row = {"name": name, "file": str(path) if path else None, "rendered": False}
        rows.append(row)
        if path is None or not ok:
            row["status"] = "没有报告"
            row["note"] = "找不到场景文件" if path is None else "没有登记到 src/project.ts，render.mjs 渲染不了"
            continue
        if not uses_beats(path):
            row["status"] = "未覆盖"
            continue
        is_stale = stale(path, out / f"{name}.qa.json")
        if not a.no_render and (a.all or is_stale):
            todo.append(row)
        elif is_stale:
            row["status"] = "没有报告" if not (out / f"{name}.qa.json").exists() else "报告比代码旧"

    for i, row in enumerate(todo, 1):
        print(f"[{i:>2}/{len(todo)}] {row['name']} 渲染中…", end="", flush=True)
        before = fingerprint(Path(row["file"]))
        ok, spent, code = render(project, row["name"], a.port, a.timeout, a.lock_timeout)
        row.update(rendered=True, renderSeconds=round(spent, 1))
        if ok and fingerprint(Path(row["file"])) == before:  # 渲染期间文件被改过就不记，下次照样重渲
            (out / f"{row['name']}.qa.deps.json").write_text(json.dumps(before, indent=1), encoding="utf-8")
        if code == LOCK_TIMEOUT_EXIT:
            print(f" 等渲染锁超时（{a.lock_timeout:g} 分钟），停止渲染：锁在谁手里见 output/{row['name']}.qa.log，"
                  f"或 python {Path(__file__).parent / 'render_lock.py'} status")
            for rest in todo[i - 1:]:
                rest.update(status="渲染失败", note="等渲染锁超时，没有渲染", rendered=False)
            break
        if not ok:
            row["status"] = "渲染失败"
            row["note"] = f"render.mjs 退出码 {code}，日志 output/{row['name']}.qa.log"
            print(f" 失败（退出码 {code}，见 output/{row['name']}.qa.log）")
        else:
            print(f" {spent:.0f}s")

    for row in rows:
        report = out / f"{row['name']}.qa.json"
        if row.get("status") in ("未覆盖", "渲染失败", "没有报告", "报告比代码旧") or not report.exists():
            row.setdefault("status", "没有报告")
            continue
        fs = json.loads(report.read_text(encoding="utf-8"))
        for f in fs:
            f.setdefault("scene", row["name"])
        findings[row["name"]] = fs
        errs = [f for f in fs if f["severity"] == "error"]
        idles = [seconds(f) or 0 for f in fs if f["kind"] == "idle"]
        row.update(
            status="有 error" if errs else "通过",
            errors=len(errs),
            warns=len(fs) - len(errs),
            idleMax=max(idles) if idles else 0,
            errorKinds=dict(Counter(f["kind"] for f in errs).most_common()),
        )

    summary = build(project, rows, findings, design)
    md_path = a.md or out / "qa-summary.md"
    json_path = a.json or out / "qa-summary.json"
    md_path.parent.mkdir(parents=True, exist_ok=True)
    json_path.parent.mkdir(parents=True, exist_ok=True)
    md_path.write_text(markdown(summary), encoding="utf-8")
    json_path.write_text(json.dumps(summary, ensure_ascii=False, indent=2), encoding="utf-8")
    print()
    print(markdown(summary, limit=15))
    print(f"汇总已写到 {md_path} 和 {json_path}")
    if a.strict and not summary["gate"]:
        sys.exit(1)


if __name__ == "__main__":
    main()
