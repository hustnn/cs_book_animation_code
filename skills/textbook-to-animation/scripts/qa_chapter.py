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
每个场景渲完还会验证刚落盘的 output/<场景>.mp4（atom 结构、ffprobe 时长/帧数、全片解码、
与 timeline 预期时长比对）：验证失败也算渲染失败，不写指纹——QA 是对直播页面采样，
不看法盘文件，渲染报成功不等于文件可用。
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


# ---------- 落盘文件验证（v1.10.1）----------
# QA 是对直播页面采样的，不看法盘文件；渲染报成功也不等于文件可用：编码器可能中途停写，
# 落盘文件截断、双 moov、NAL 损坏，而 QA 仍报 0 error（制作里两例：85 秒的场景只落盘 18.93 秒、
# 132.67 秒的场景只落盘 16.17 秒，全片解码都“干净”，只比时长才看得出）。
# 每个场景渲完，顺手验证刚落盘的文件；验证失败的场景记为渲染失败、不写指纹，
# 下次照样重渲，--no-render 也不会拿它当通过。
VERIFY_DUR_TOL = 0.5    # 秒：容器/视频轨时长差、文件时长与预期时长差
VERIFY_FRAME_TOL = 2    # 帧：帧数与 时长×帧率 之差
VERIFY_ERROR_RX = re.compile(r"error|invalid|missing picture|no frame|partial file", re.IGNORECASE)
BEAT_CALL_RX = re.compile(r"\bbeat\(\s*['\"]([^'\"]+)['\"]")
TIMELINE_IMPORT_RX = re.compile(r"import\s+\w+\s+from\s+['\"]([^'\"]+\.json)['\"]")
CJK_PER_SEC = 4.5  # 与 beats.ts / lint_scenes.py 一致：中文 TTS 常见语速
VERIFY_PAD = 0.35  # 每拍末尾留白，与 beats.ts / audio_timeline.py 的 --pad 一致


def estimate_duration(text: str) -> float:
    """没有 dur 的拍按旁白字数估算，与 beats.ts estimateDuration 一致。"""
    cjk = len(re.findall(r"[㐀-鿿豈-﫿]", text))
    words = len(re.findall(r"[A-Za-z0-9.%]+", text))
    return (cjk + words * 1.5) / CJK_PER_SEC + VERIFY_PAD


def expected_duration(scene: Path):
    """场景 import 的 timeline 里，本场景用到的拍的 dur 之和（与 lint_scenes.py 的算法一致）。
    返回 (秒或 None, timeline 里没有的拍)：没有 timeline、或场景没用 beat() 时返回 (None, [])。"""
    src = read(scene)
    m = TIMELINE_IMPORT_RX.search(src)
    if not m:
        return None, []
    p = (scene.parent / m.group(1)).resolve()
    if not p.exists():
        return None, []
    try:
        data = json.loads(p.read_text(encoding="utf-8"))
    except ValueError:
        return None, []
    beats = data["beats"] if isinstance(data, dict) else data
    dur = {}
    for b in beats:
        if not isinstance(b, dict) or "id" not in b:
            continue
        dur[b["id"]] = float(b["dur"]) if b.get("dur") is not None else \
            estimate_duration(b.get("text", "")) + float(b.get("hold") or 0)
    calls = BEAT_CALL_RX.findall(src)
    if not calls:
        return None, []
    return sum(dur.get(b, 0.0) for b in calls), sorted(set(calls) - set(dur))


def check_atoms(path: Path):
    """顶层 atom 结构：返回 [问题]。恰好一个 moov；walk 走完整个文件；没有 atom 越过 EOF。
    双 moov（两个文件拼在一起）、字节截断、48 字节空头文件都在这里拦下。"""
    try:
        data = path.read_bytes()
    except OSError as e:
        return [f"读不到落盘文件：{e}"]
    size = len(data)
    if size < 8:
        return [f"文件只有 {size} 字节，没有完整的 atom 头"]
    pos, moovs = 0, 0
    while pos < size:
        if pos + 8 > size:
            return [f"文件尾 {size - pos} 字节凑不够一个 atom 头"]
        atom_size = int.from_bytes(data[pos:pos + 4], "big")
        atom_type = data[pos + 4:pos + 8].decode("latin-1")
        if atom_size == 1:  # 64 位 largesize
            if pos + 16 > size:
                return ["largesize atom 头被截断"]
            atom_size = int.from_bytes(data[pos + 8:pos + 16], "big")
        elif atom_size == 0:  # 到文件尾
            atom_size = size - pos
        if atom_size < 8:
            return [f"atom {atom_type!r} 的 size {atom_size} 不合法"]
        if pos + atom_size > size:
            return [f"atom {atom_type!r} 越过文件尾（size {atom_size}，剩余 {size - pos} 字节）：文件被截断"]
        if atom_type == "moov":
            moovs += 1
        pos += atom_size
    if moovs == 0:
        return ["没有 moov atom（空头文件或写盘未完成）"]
    if moovs > 1:
        return [f"有 {moovs} 个 moov atom（疑似两个文件拼在一起）"]
    return []


def probe_file(path: Path):
    """ffprobe 读时长/帧率/帧数。返回 (info, [问题])。"""
    try:
        r = subprocess.run(
            ["ffprobe", "-v", "error", "-show_entries", "format=duration",
             "-show_entries", "stream=codec_type,duration,avg_frame_rate,nb_frames",
             "-of", "json", str(path)],
            capture_output=True, text=True, stdin=subprocess.DEVNULL, timeout=60)
    except subprocess.TimeoutExpired:
        return None, ["ffprobe 60 秒没返回"]
    if r.returncode != 0:
        last = r.stderr.strip().splitlines()[-1] if r.stderr.strip() else "无输出"
        return None, [f"ffprobe 读不出文件：{last}"]
    try:
        info = json.loads(r.stdout)
    except ValueError:
        return None, ["ffprobe 输出不是 JSON"]
    problems = []
    fmt_dur = info.get("format", {}).get("duration")
    videos = [s for s in info.get("streams", []) if s.get("codec_type") == "video"]
    if fmt_dur is None:
        return info, problems + ["ffprobe 没给出容器时长"]
    fmt_dur = float(fmt_dur)
    if not videos:
        return info, problems + ["没有视频轨"]
    v = videos[0]
    if v.get("duration") is not None and abs(float(v["duration"]) - fmt_dur) > VERIFY_DUR_TOL:
        problems.append(f"容器时长 {fmt_dur:.2f}s 与视频轨时长 {float(v['duration']):.2f}s 差超过 {VERIFY_DUR_TOL}s")
    try:
        num, den = (int(x) for x in v.get("avg_frame_rate", "0/0").split("/"))
        fps = num / den if den else 0
    except ValueError:
        fps = 0
    nb = v.get("nb_frames")
    if nb not in (None, "N/A") and fps > 0:
        want = fmt_dur * fps
        if abs(int(nb) - want) > VERIFY_FRAME_TOL:
            problems.append(f"元数据帧数 {nb} 与时长×帧率 {want:.0f} 差超过 {VERIFY_FRAME_TOL} 帧")
    return info, problems


def decode_check(path: Path):
    """ffmpeg 全片解码到 null：退出 0 且没有任何错误行。返回 [问题]。
    注意：截断文件也可能解码退出 0（解码器读到哪算哪），所以只看退出码不够，要数错误行。"""
    try:
        r = subprocess.run(
            ["ffmpeg", "-nostdin", "-v", "error", "-i", str(path), "-f", "null", "-"],
            capture_output=True, text=True, stdin=subprocess.DEVNULL, timeout=600)
    except subprocess.TimeoutExpired:
        return ["全片解码 600 秒没跑完"]
    problems = []
    if r.returncode != 0:
        problems.append(f"全片解码退出码 {r.returncode}")
    err_lines = [ln.strip() for ln in r.stderr.splitlines() if ln.strip() and VERIFY_ERROR_RX.search(ln)]
    if err_lines:
        problems.append(f"全片解码有 {len(err_lines)} 行错误（如：{err_lines[0][:100]}）")
    return problems


def verify_output(mp4: Path, scene: Path):
    """验证刚落盘的 mp4 文件。返回 [问题]，空表表示通过。
    1. atom 结构（双 moov、截断、空头）；2. ffprobe 时长/帧数一致；3. 全片解码无错；
    4. 有预期时长时，文件时长不能比预期短超过 0.5s——截断文件的容器时长自洽（moov 在前），单靠 1–3 查不出来；
    只查下界：动画超过旁白的拍本来就会把场景拖长，QA 已经把 overrun 另记为 error。"""
    path = mp4
    if not path.exists():
        return [f"落盘文件不存在：{path}"]
    problems = check_atoms(path)
    info, probe_problems = probe_file(path)
    problems += probe_problems
    problems += decode_check(path)
    expected, unknown = expected_duration(scene)
    if expected is not None and info is not None and info.get("format", {}).get("duration") is not None:
        actual = float(info["format"]["duration"])
        # 只查下界：文件比预期短就是截断；文件比预期长不算错——动画超过旁白的拍（overrun）
        # 本来就会把场景拖长，QA 已经把 overrun 另记为 error，这里不再重复判。
        if actual < expected - VERIFY_DUR_TOL:
            problems.append(f"文件时长 {actual:.2f}s，比 timeline 预期 {expected:.2f}s 短超过 {VERIFY_DUR_TOL}s")
    return problems


LOCK_TIMEOUT_EXIT = 3  # render.mjs：等渲染锁超时，没有渲染


def render(project: Path, name: str, scene: Path, port: str, timeout: int, lock_timeout: float):
    """渲染一个场景并验证落盘文件。返回 (成功, 用时, 退出码, 验证问题)。
    渲染成功（退出 0/2 且有报告）后还要过 verify_output：验证失败也算渲染失败，
    报告删掉、指纹不写——坏文件拿不到“通过”，下次照样重渲。"""
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
    verify_problems = []
    if ok:
        verify_problems = verify_output(out / f"{name}.mp4", scene)
        if verify_problems:
            ok = False
    if not ok:
        report.unlink(missing_ok=True)  # 旧版 render.mjs 渲染失败时也会写一份空报告，不能留着冒充“0 error”
    side = out / f"{name}.qa.deps.json"
    side.unlink(missing_ok=True)
    return ok, time.time() - t0, code, verify_problems


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
        ok, spent, code, verify_problems = render(project, row["name"], Path(row["file"]), a.port, a.timeout, a.lock_timeout)
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
            if verify_problems:
                # 渲染本身成功了，但落盘文件验证没过：不写指纹，下次照样重渲
                row["note"] = "落盘验证失败：" + "；".join(verify_problems)
                print(f" 落盘验证失败：{'；'.join(verify_problems)}")
            else:
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
