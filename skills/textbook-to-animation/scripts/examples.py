#!/usr/bin/env python3
"""skill 自带示例：列出、渲染、整体校验、抽关键帧。

示例在 skill 的 examples/<名字>/ 下，每个目录有 example.json（清单）和 README.md（看什么、对应哪条规则）。
Motion Canvas 示例不能原地渲染：本脚本把它临时装进一个工程（场景复制到 src/scenes/example-<名字>/，
时间轴复制成 src/timeline/example-<名字>.json，在 project.ts 里临时登记），用 qa_chapter.py 带 --qa 渲染，
结束后恢复 project.ts、删掉复制进去的文件（--keep 保留）。Manim 示例用给定的 manim 可执行文件渲染。

用法：
  python examples.py list
  python examples.py render <名字> --project <motion-canvas 工程> [--keep] [--port 9200]
  python examples.py render <名字> --manim <manim 可执行文件> [-q m]       # Manim 示例
  python examples.py check --project <motion-canvas 工程>                    # 全部 MC 示例：QA 0 error、0 fast-move、lint 通过
  python examples.py frames <名字> --video-dir <渲染出的 mp4 所在目录>       # 按清单里的时刻抽关键帧进 examples/<名字>/frames/

什么时候用：
  - 第一次用本 skill、或要做一种没做过的画面时：render 一个最接近的示例，看成片、对照代码（README 里有图式 → 拍 → 代码的对照表）。
  - 改了 qa.ts / lint_scenes.py / schemas.ts 之后：check。示例是“按规则做对了”的样本，规则改完它们仍应全部通过；
    不通过时先判断是规则误报（补 qa-fixtures 用例再改规则）还是示例真有问题（修示例）。
"""
import argparse
import json
import shutil
import subprocess
import sys
from pathlib import Path

SKILL = Path(__file__).resolve().parent.parent
EXAMPLES = SKILL / "examples"
SCRIPTS = SKILL / "scripts"
ANCHOR = "import {makeProject} from '@motion-canvas/core';"


def manifest(name: str) -> dict:
    p = EXAMPLES / name / "example.json"
    if not p.exists():
        sys.exit(f"没有这个示例：{name}（python examples.py list 看有哪些）")
    m = json.loads(p.read_text(encoding="utf-8"))
    m["name"] = name
    m["dir"] = p.parent
    return m


def all_manifests():
    return [manifest(p.parent.name) for p in sorted(EXAMPLES.glob("*/example.json"))]


def cmd_list(_):
    for m in all_manifests():
        scenes = ", ".join(m.get("scenes", []))
        print(f"{m['name']:<16}{m['kind']:<14}{scenes}")
        print(f"{'':<16}{m.get('summary', '')}")


class Installed:
    """把一个 MC 示例临时装进工程；with 块结束时恢复（keep=True 时保留）。"""

    def __init__(self, m: dict, project: Path, keep: bool):
        self.m, self.project, self.keep = m, project, keep
        self.scene_dir = project / "src" / "scenes" / f"example-{m['name']}"
        self.timeline = project / "src" / "timeline" / f"example-{m['name']}.json"
        self.proj_ts = project / "src" / "project.ts"
        self.added_lib = []
        self.original = None

    def __enter__(self):
        if self.scene_dir.exists() or self.timeline.exists():
            sys.exit(f"{self.scene_dir} 或 {self.timeline} 已存在：上次可能没清理干净（或用了 --keep），确认后手动删除再跑")
        original = self.proj_ts.read_text(encoding="utf-8")
        if ANCHOR not in original or "scenes: [" not in original:
            sys.exit("src/project.ts 不是预期的 makeProject({scenes: [...]}) 写法，无法临时登记示例场景")
        lib = self.project / "src" / "lib"
        for name in self.m.get("lib", []):
            mine, theirs = SKILL / "assets" / "motion-canvas" / name, lib / name
            if not theirs.exists():
                shutil.copy(mine, theirs)
                self.added_lib.append(theirs)
                print(f"[info] 工程里没有 src/lib/{name}，临时从 skill 复制一份")
            elif theirs.read_bytes() != mine.read_bytes():
                print(f"[warn] 工程里的 src/lib/{name} 与 skill 的不一致：示例按工程里的版本渲染")
        self.original = original
        self.scene_dir.mkdir(parents=True)
        for f in (self.m["dir"] / "scenes").iterdir():
            if f.suffix in (".ts", ".tsx"):
                shutil.copy(f, self.scene_dir / f.name)
        shutil.copy(self.m["dir"] / self.m["timeline"], self.timeline)
        imports, regs = [], []
        for s in self.m["scenes"]:
            var = "ex_" + s.replace("-", "_")
            imports.append(f"import {var} from './scenes/example-{self.m['name']}/{s}?scene';")
            regs.append(f"    {var},")
        patched = original.replace(ANCHOR, ANCHOR + "\n" + "\n".join(imports), 1)
        patched = patched.replace("scenes: [", "scenes: [\n" + "\n".join(regs), 1)
        self.proj_ts.write_text(patched, encoding="utf-8")
        return self

    def __exit__(self, *exc):
        self.proj_ts.write_text(self.original, encoding="utf-8")
        if self.keep:
            print(f"[keep] 保留了 {self.scene_dir}、{self.timeline}（project.ts 已恢复）")
            return False
        shutil.rmtree(self.scene_dir, ignore_errors=True)
        self.timeline.unlink(missing_ok=True)
        for p in self.added_lib:
            p.unlink(missing_ok=True)
        for s in self.m["scenes"]:
            (self.project / "output" / f"{s}.qa.deps.json").unlink(missing_ok=True)  # 场景已删，指纹没用了
        return False


def render_mc(m: dict, project: Path, keep: bool, port: str):
    """渲染一个 MC 示例，返回 (汇总 dict, lint 结果 dict)。"""
    out = project / "output"
    out.mkdir(exist_ok=True)
    summary_json = out / f"example-{m['name']}.qa-summary.json"
    lint_json = out / f"example-{m['name']}.lint.json"
    with Installed(m, project, keep) as inst:
        # 一个场景有类型错误，整个工程都加载不了：先 tsc
        npx = shutil.which("npx") or "npx"
        tsc = subprocess.run([npx, "tsc", "--noEmit"], cwd=project, capture_output=True, text=True, stdin=subprocess.DEVNULL)
        if tsc.returncode != 0:
            print(tsc.stdout[-4000:], tsc.stderr[-2000:])
            sys.exit("tsc 没通过，没有渲染（见上面的错误）")
        subprocess.run([sys.executable, "-I", str(SCRIPTS / "lint_scenes.py"), str(inst.scene_dir),
                        "--json", str(lint_json)], stdin=subprocess.DEVNULL)
        run = subprocess.run([sys.executable, "-I", str(SCRIPTS / "qa_chapter.py"), "--project", str(project),
                              *m["scenes"], "--all", "--port", port, "--json", str(summary_json),
                              "--md", str(out / f"example-{m['name']}.qa-summary.md")], stdin=subprocess.DEVNULL)
        if not summary_json.exists():
            sys.exit(f"qa_chapter.py 没有写出汇总（退出码 {run.returncode}）")
    summary = json.loads(summary_json.read_text(encoding="utf-8"))
    lint = json.loads(lint_json.read_text(encoding="utf-8")) if lint_json.exists() else {}
    print(f"\n成片：{', '.join(str(out / (s + '.mp4')) for s in m['scenes'])}")
    return summary, lint


def render_manim(m: dict, manim: str, quality: str):
    """在临时目录里放好 theme.py / beats.py / 场景文件，逐个场景用渲染锁包着跑 manim。"""
    work = m["dir"] / "media-work"
    work.mkdir(exist_ok=True)
    for f in ("theme.py", "beats.py"):
        shutil.copy(SKILL / "assets" / "manim" / f, work / f)
    shutil.copy(m["dir"] / m["file"], work / m["file"])
    if (m["dir"] / "beats.json").exists():
        shutil.copy(m["dir"] / "beats.json", work / "beats.json")
    ok = True
    for s in m["scenes"]:
        r = subprocess.run([sys.executable, "-I", str(SCRIPTS / "render_lock.py"), "run", f"example-{s}", "--",
                            manim, f"-q{quality}", "--disable_caching", m["file"], s], cwd=work, stdin=subprocess.DEVNULL)
        ok &= r.returncode == 0
    res = {"m": "720p30", "l": "480p15", "h": "1080p60"}[quality]
    print(f"\n成片：{work / 'media' / 'videos' / Path(m['file']).stem / res}/<场景>.mp4（media-work/ 不入库）")
    return ok


def gate(m: dict, summary: dict, lint: dict):
    rows = [
        ("QA 门槛通过（error 0）", summary.get("gate") is True, "；".join(summary.get("reasons", []))),
        ("没有移动过快（fast-move 0）", not summary.get("fastMove"), f"{len(summary.get('fastMove', []))} 条"),
    ]
    gates = lint.get("gates", [])
    bad = [g["name"] for g in gates if not g["pass"]]
    rows.append(("lint 门槛全部通过", bool(gates) and not bad, "、".join(bad)))
    rows.append(("没有跨 at() 的同对象补间", not lint.get("cue_overlaps"), f"{len(lint.get('cue_overlaps', []))} 处"))
    for name, ok, why in rows:
        print(f"  [{'PASS' if ok else 'FAIL'}] {m['name']}：{name}{'' if ok else '  ' + why}")
    return all(ok for _, ok, _ in rows)


def cmd_render(a):
    m = manifest(a.name)
    if m["kind"] == "manim":
        if not a.manim:
            sys.exit("Manim 示例要给 --manim <manim 可执行文件>（例如 manim/.venv/bin/manim）")
        sys.exit(0 if render_manim(m, a.manim, a.q) else 1)
    if not a.project:
        sys.exit("Motion Canvas 示例要给 --project <motion-canvas 工程目录>")
    summary, lint = render_mc(m, a.project.resolve(), a.keep, a.port)
    print()
    sys.exit(0 if gate(m, summary, lint) else 1)


def cmd_check(a):
    ok = True
    for m in all_manifests():
        if m["kind"] != "motion-canvas":
            continue
        summary, lint = render_mc(m, a.project.resolve(), False, a.port)
        ok &= gate(m, summary, lint)
        design = m["dir"] / "design.md"
        if design.exists():
            r = subprocess.run([sys.executable, "-I", str(SCRIPTS / "check_design.py"), str(design),
                                "--beats-json", str(m["dir"] / "beats.json")], stdin=subprocess.DEVNULL)
            ok &= r.returncode == 0
    print("\n示例校验：" + ("全部通过" if ok else "有未通过的项"))
    sys.exit(0 if ok else 1)


def cmd_frames(a):
    """按 example.json 的 frames（[{scene, t, name}]）从渲染好的 mp4 抽帧，缩到 640 宽存进 frames/。"""
    m = manifest(a.name)
    ffmpeg = shutil.which("ffmpeg") or a.ffmpeg
    if not ffmpeg:
        sys.exit("找不到 ffmpeg：用 --ffmpeg 指定")
    dst = m["dir"] / "frames"
    dst.mkdir(exist_ok=True)
    for f in m.get("frames", []):
        video = a.video_dir / f"{f['scene']}.mp4"
        out = dst / f"{f['name']}.png"
        subprocess.run([ffmpeg, "-nostdin", "-v", "error", "-y", "-ss", str(f["t"]), "-i", str(video),
                        "-frames:v", "1", "-vf", "scale=640:-2", str(out)], check=True)
        print(f"{out.relative_to(SKILL)}  ← {video.name} @ {f['t']}s")


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = ap.add_subparsers(dest="cmd", required=True)
    sub.add_parser("list").set_defaults(fn=cmd_list)
    r = sub.add_parser("render")
    r.add_argument("name")
    r.add_argument("--project", type=Path)
    r.add_argument("--manim")
    r.add_argument("-q", default="m", choices=["l", "m", "h"])
    r.add_argument("--keep", action="store_true")
    r.add_argument("--port", default="9200")
    r.set_defaults(fn=cmd_render)
    c = sub.add_parser("check")
    c.add_argument("--project", type=Path, required=True)
    c.add_argument("--port", default="9200")
    c.set_defaults(fn=cmd_check)
    f = sub.add_parser("frames")
    f.add_argument("name")
    f.add_argument("--video-dir", type=Path, required=True)
    f.add_argument("--ffmpeg")
    f.set_defaults(fn=cmd_frames)
    a = ap.parse_args()
    a.fn(a)


if __name__ == "__main__":
    main()
