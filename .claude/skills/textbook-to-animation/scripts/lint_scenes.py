#!/usr/bin/env python3
"""动画场景静态检查：渲染前跑一遍，把“会动的 PPT”拦在门外。

用法：
  python lint_scenes.py MC_SCENE_DIR [--manim MANIM_DIR] [--json out.json] [--strict]

检查项（门槛可用参数调整）：
  1. 文字卡时长占比（makeCardScene 场景时长 / 总时长）          ≤ --max-card-share（默认 0.15）
  2. 非卡片场景静止占比（空拍或字面量等待 / 场景时长）           ≤ --max-static（默认 0.40）
  3. 单次静止（最长的空拍 / waitFor / self.wait）                ≤ --max-hold（默认 6s）
  4. 文字宽度估算超出安全区（未设 maxWidth/textWrap 的 Txt、卡片行）≤ --safe-width（默认 1160px）
  5. 文字卡行数                                                  ≤ --max-card-lines（默认 3）
  另外给出提示（不计入门槛）：硬编码的十六进制颜色、多个列表共用 key={String(i)}。

时长从哪来：
- 用 beat() 写的场景（含 assets/motion-canvas/card.tsx 的文字卡）：解析场景里 `import x from '….json'`
  引用的 timeline，累加本场景用到的拍的 dur；没有 dur 的拍按旁白字数估算（与 beats.ts 一致）。
  只有旁白、没有动画的 `beat('id')` 记为静止。
- 手写 waitFor 的场景：时长取文件头注释里的“（60s）”这类声明，静止 = 字面量 waitFor 之和。
- 位置参数写法的文字卡 makeCardScene(kicker, title, lines, closing, duration) 取第 5 个参数。
宽度按“汉字 = 字号，其他字符 = 0.55 × 字号”估算，偏保守；结论以渲染抽帧为准。
"""
import argparse
import json
import re
import sys
import unicodedata
from pathlib import Path

CJK_PER_SEC = 4.5  # 与 beats.ts / beats.py 一致
PAD = 0.35
STR = r"""(['"`])((?:\\.|(?!\1).)*)\1"""


# ---------- 通用 ----------

def text_width(s: str, fs: float) -> float:
    widths = [sum(fs if unicodedata.east_asian_width(ch) in "WF" else fs * 0.55 for ch in line)
              for line in s.split("\\n")]
    return max(widths) if widths else 0.0


def estimate_duration(text: str) -> float:
    cjk = len(re.findall(r"[㐀-鿿豈-﫿]", text))
    words = len(re.findall(r"[A-Za-z0-9.%]+", text))
    return (cjk + words * 1.5) / CJK_PER_SEC + PAD


def split_top_level_args(src: str, open_idx: int):
    """src[open_idx] == '('，返回顶层参数字符串列表（处理括号嵌套与字符串）。"""
    depth, i, start, args, quote = 0, open_idx, open_idx + 1, [], None
    while i < len(src):
        c = src[i]
        if quote:
            if c == "\\":
                i += 2
                continue
            if c == quote:
                quote = None
        elif c in "'\"`":
            quote = c
        elif c in "([{":
            depth += 1
        elif c in ")]}":
            depth -= 1
            if depth == 0:
                args.append(src[start:i])
                return [a.strip() for a in args if a.strip()]
        elif c == "," and depth == 1:
            args.append(src[start:i])
            start = i + 1
        i += 1
    return [a.strip() for a in args if a.strip()]


def jsx_elements(src: str, tag: str):
    """取出 <Tag ...> 的属性文本（按花括号深度找结束的 '>'，避免被 '=>' 截断）。"""
    for m in re.finditer(rf"<{tag}\b", src):
        i, depth = m.end(), 0
        while i < len(src):
            c = src[i]
            if c == "{":
                depth += 1
            elif c == "}":
                depth -= 1
            elif c == ">" and depth == 0:
                yield src[m.end():i], src.count("\n", 0, m.start()) + 1
                break
            i += 1


def declared_duration(src: str):
    head = "\n".join(src.splitlines()[:15])
    m = re.search(r"[（(]\s*(\d+(?:\.\d+)?)\s*s\s*[，,）)]", head)
    return float(m.group(1)) if m else None


def load_timeline(scene: Path, src: str):
    """解析场景 import 的 timeline JSON，返回 {beat_id: 秒}；没有则返回 None。"""
    for m in re.finditer(r"import\s+\w+\s+from\s+['\"]([^'\"]+\.json)['\"]", src):
        p = (scene.parent / m.group(1)).resolve()
        if not p.exists():
            return {"__missing__": str(p)}
        data = json.loads(p.read_text(encoding="utf-8"))
        beats = data["beats"] if isinstance(data, dict) else data
        return {b["id"]: (b.get("dur") if b.get("dur") is not None else estimate_duration(b.get("text", "")))
                for b in beats}
    return None


# ---------- Motion Canvas ----------

def lint_mc_scene(path: Path, a):
    src = path.read_text(encoding="utf-8")
    r = {"file": path.name, "kind": "custom", "dur": None, "static": 0.0, "max_hold": 0.0,
         "overflow": [], "hints": []}

    timeline = load_timeline(path, src)
    if timeline and "__missing__" in timeline:
        r["hints"].append(f"timeline 不存在：{timeline['__missing__']}")
        timeline = None

    beat_calls = re.findall(r"\bbeat\(\s*['\"]([^'\"]+)['\"]", src)
    empty_beats = re.findall(r"\bbeat\(\s*['\"]([^'\"]+)['\"]\s*\)", src)
    card_beats = re.findall(r"\b(?:beat|titleBeat)\s*:\s*['\"]([^'\"]+)['\"]", src)

    card_call = src.find("makeCardScene(")
    is_card = card_call >= 0 and not re.search(r"export\s+function\s+makeCardScene", src)

    if is_card:
        r["kind"] = "card"
        args = split_top_level_args(src, card_call + len("makeCardScene"))
        # 卡片的文字行：形如 {text: '…', …}
        lines = []
        for m in re.finditer(r"\{[^{}]*?\btext\s*:\s*" + STR + r"[^{}]*\}", src):
            size = re.search(r"\bsize\s*:\s*(\d+)", m.group(0))
            lines.append((m.group(2), int(size.group(1)) if size else a.card_font))
        r["lines"] = len(lines)
        r["chars"] = sum(len(t) for t, _ in lines)
        if len(lines) > a.max_card_lines:
            r["card_too_long"] = True
        for t, fs in lines:
            w = text_width(t, fs)
            if w > a.safe_width:
                r["overflow"].append((round(w), fs, t))
        if card_beats and timeline:
            r["dur"] = sum(timeline.get(b, 0.0) for b in card_beats)
        elif len(args) >= 5:
            try:
                r["dur"] = float(args[4])
            except ValueError:
                r["hints"].append("没解析出卡片时长")
        else:
            r["hints"].append("卡片没有 timeline，无法计时")
        return r

    if beat_calls:
        r["beats"] = len(beat_calls)
        if timeline:
            r["dur"] = sum(timeline.get(b, 0.0) for b in beat_calls)
            holds = [timeline.get(b, 0.0) for b in empty_beats]
            r["static"] = sum(holds)
            r["max_hold"] = max(holds) if holds else 0.0
            unknown = sorted(set(beat_calls) - set(timeline))
            if unknown:
                r["hints"].append(f"timeline 里没有这些拍：{', '.join(unknown)}")
        else:
            r["hints"].append("用了 beat() 但没找到 timeline import，无法计时")
        if empty_beats:
            r["hints"].append(f"{len(empty_beats)}/{len(beat_calls)} 拍只有旁白、画面不动")

    waits = [float(x) for x in re.findall(r"waitFor\(\s*(\d+(?:\.\d+)?)\s*\)", src)]
    if waits:
        r["static"] += sum(waits)
        r["max_hold"] = max(r["max_hold"], max(waits))
        if not beat_calls:
            r["dur"] = declared_duration(src)
            if r["dur"] is None:
                tweens = [float(x) for x in re.findall(r"\.\w+\([^()]*?,\s*(\d+(?:\.\d+)?)\s*\)", src)]
                r["dur"] = sum(waits) + sum(tweens)
                r["hints"].append("时长未声明，按 waitFor + 补间估算")
        else:
            r["hints"].append(f"beat() 场景里还有 {len(waits)} 处字面量 waitFor")

    for props, lineno in jsx_elements(src, "Txt"):
        if re.search(r"\b(maxWidth|textWrap)\b", props):
            continue
        fm = re.search(r"fontSize=\{\s*(\d+(?:\.\d+)?)\s*\}", props)
        tm = re.search(r"text=\{?\s*" + STR, props)
        if not (fm and tm):
            continue
        w = text_width(tm.group(2), float(fm.group(1)))
        if w > a.safe_width:
            r["overflow"].append((round(w), float(fm.group(1)), f"L{lineno}: {tm.group(2)}"))

    hexes = re.findall(r"['\"]#[0-9A-Fa-f]{6}['\"]", src)
    if hexes:
        r["hints"].append(f"{len(hexes)} 处硬编码颜色（应从 theme 取）")
    if src.count("key={String(i)}") > 1:
        r["hints"].append("多个列表共用 key={String(i)}，可能出现重复 key")
    return r


# ---------- Manim ----------

def lint_manim_file(path: Path):
    src = path.read_text(encoding="utf-8")
    waits = [float(x) for x in re.findall(r"self\.wait\(\s*(\d+(?:\.\d+)?)\s*\)", src)]
    waits += [1.0] * len(re.findall(r"self\.wait\(\s*\)", src))
    runtimes = [float(x) for x in re.findall(r"run_time\s*=\s*(\d+(?:\.\d+)?)", src)]
    plays = len(re.findall(r"self\.play\(", src))
    implicit = max(0, plays - len(runtimes)) * 1.0  # 未写 run_time 的 play 默认 1s（粗估）
    hints = []
    if "Beats(" in src:
        hints.append("用了 Beats：时长由 timeline 决定，这里只统计字面量 wait")
    if re.search(r"\bMathTex\(|\bTex\(", src):
        hints.append("用了 MathTex/Tex：确认渲染环境有 LaTeX")
    hexes = re.findall(r"['\"]#[0-9A-Fa-f]{6}['\"]", src)
    if hexes:
        hints.append(f"{len(hexes)} 处硬编码颜色（应从 theme 取）")
    return {"file": path.name, "kind": "manim", "dur": round(sum(waits) + sum(runtimes) + implicit, 1),
            "static": sum(waits), "max_hold": max(waits) if waits else 0.0, "overflow": [], "hints": hints}


# ---------- 报告 ----------

def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("mc_dir", type=Path, nargs="?")
    ap.add_argument("--manim", type=Path, help="Manim 场景目录或单个 .py")
    ap.add_argument("--max-card-share", type=float, default=0.15)
    ap.add_argument("--max-static", type=float, default=0.40)
    ap.add_argument("--max-hold", type=float, default=6.0)
    ap.add_argument("--safe-width", type=float, default=1160)
    ap.add_argument("--max-card-lines", type=int, default=3)
    ap.add_argument("--card-font", type=int, default=30, help="卡片行未写 size 时的字号（card.tsx 用 SIZE.body = 30）")
    ap.add_argument("--json", type=Path)
    ap.add_argument("--strict", action="store_true", help="有门槛未过时退出码为 1")
    a = ap.parse_args()
    if not a.mc_dir and not a.manim:
        ap.error("至少给一个 MC 场景目录或 --manim")

    results = []
    if a.mc_dir:
        results += [lint_mc_scene(p, a) for p in sorted(a.mc_dir.rglob("*.tsx"))]
    if a.manim:
        files = [a.manim] if a.manim.is_file() else sorted(a.manim.rglob("*.py"))
        results += [lint_manim_file(p) for p in files if p.name not in {"theme.py", "beats.py", "__init__.py"}]

    print(f"{'场景':<20}{'类型':<8}{'时长':>7}{'静止':>7}{'占比':>6}{'最长停':>7}  提示")
    total = card = 0.0
    for r in results:
        dur = r["dur"] or 0.0
        total += dur
        if r["kind"] == "card":
            card += dur
        ratio = (r["static"] / dur) if (dur and r["kind"] != "card") else 0.0
        r["static_ratio"] = round(ratio, 3)
        flag = []
        if r["kind"] != "card" and ratio > a.max_static:
            flag.append("静止过多")
        if r["max_hold"] > a.max_hold:
            flag.append("单次停顿过长")
        if r["overflow"]:
            flag.append(f"{len(r['overflow'])} 行可能超宽")
        if r.get("card_too_long"):
            flag.append(f"文字卡超过 {a.max_card_lines} 行")
        extra = "；".join(flag + r["hints"])
        if r["kind"] == "card":
            extra = f"{r.get('lines', '?')} 行 / {r.get('chars', '?')} 字" + ("；" + extra if extra else "")
        print(f"{r['file']:<20}{r['kind']:<8}{dur:>7.1f}{r['static']:>7.1f}"
              f"{ratio:>6.0%}{r['max_hold']:>7.1f}  {extra}")
        for w, fs, t in r["overflow"]:
            print(f"{'':<20}  ↳ 约 {w}px（字号 {fs:g}）：{t[:60]}")

    share = card / total if total else 0.0
    custom = [r for r in results if r["kind"] != "card" and r["dur"]]
    static_total = sum(r["static"] for r in custom)
    custom_total = sum(r["dur"] for r in custom)
    n_card = sum(r["kind"] == "card" for r in results)
    print()
    print(f"合计 {len(results)} 个场景，约 {total:.1f}s；文字卡 {n_card} 个，{card:.1f}s（{share:.0%}）；"
          f"非卡片场景静止 {static_total:.1f}/{custom_total:.1f}s"
          f"（{(static_total / custom_total if custom_total else 0):.0%}）")

    gates = [
        (f"文字卡时长占比 ≤ {a.max_card_share:.0%}", share <= a.max_card_share, f"{share:.0%}"),
        (f"每个非卡片场景静止占比 ≤ {a.max_static:.0%}", all(r["static_ratio"] <= a.max_static for r in custom), ""),
        (f"单次停顿 ≤ {a.max_hold:g}s", all(r["max_hold"] <= a.max_hold for r in results), ""),
        (f"文字不超出 {a.safe_width:g}px 安全宽度", all(not r["overflow"] for r in results), ""),
        (f"文字卡 ≤ {a.max_card_lines} 行", not any(r.get("card_too_long") for r in results), ""),
    ]
    print("门槛：")
    for name, ok, val in gates:
        print(f"  [{'PASS' if ok else 'FAIL'}] {name}{('  当前 ' + val) if val else ''}")

    if a.json:
        a.json.write_text(json.dumps({"scenes": results, "card_share": share,
                                      "gates": [{"name": n, "pass": ok} for n, ok, _ in gates]},
                                     ensure_ascii=False, indent=2), encoding="utf-8")
    if a.strict and not all(ok for _, ok, _ in gates):
        sys.exit(1)


if __name__ == "__main__":
    main()
