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
  6. 并行补间冲突：同一 ref().属性 在一组 all(…) / sequence(0, …) 里被补间多次（动作会互相覆盖、播不出来）
     另列 warn（不计入门槛）：同一拍 beat(id, …) 的几个并行部分（at() 只推迟开始）补间同一个对象的同一属性，
     且按旁白估出的时间窗重叠——块会在两条路径之间抽动；要先后发生，放进同一个 at() 里的 chain(…)
  7. 观众可见文字：画面文字（text=、say()、card 的 title/lines、Manim 的 txt()/Text()）和旁白
     （场景 import 的 timeline、--narration 指定的 JSON）里不出现书页、图号、“书里/原图”、内部编号；
     “p6”这类可能是页码的写法记 warn（p50/p99 等百分位不算）
  8. 时间轴副本一致（给了 --timeline-dir 时）：场景 import 的 timeline 与章节目录里那份逐个比对
  另外给出提示（不计入门槛）：sequence(0, …)、硬编码的十六进制颜色、多个列表共用 key={String(i)}。

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
        return {b["id"]: (b.get("dur") if b.get("dur") is not None
                          else estimate_duration(b.get("text", "")) + float(b.get("hold") or 0))
                for b in beats}
    return None


def timeline_path(scene: Path, src: str):
    m = re.search(r"import\s+\w+\s+from\s+['\"]([^'\"]+\.json)['\"]", src)
    return (scene.parent / m.group(1)).resolve() if m else None


def load_beats_texts(p: Path):
    """读 timeline / beats JSON 里的旁白文本：[(拍号, 文本)]。"""
    try:
        data = json.loads(p.read_text(encoding="utf-8"))
    except (OSError, ValueError):
        return []
    beats = data.get("beats", []) if isinstance(data, dict) else data
    return [(b.get("id", "?"), b.get("text", "")) for b in beats if isinstance(b, dict) and b.get("text")]


# ---------- 并行补间冲突 ----------
# 同一个节点的同一个属性，在一组并行动画（all(...) 或 sequence(0, ...)）里被补间两次，
# 两个补间会在同一帧互相覆盖，想要的“先去再回”之类的动作根本播不出来。

TARGET = re.compile(r"([A-Za-z_$][\w$]*(?:\[[^\]]+\])?)\(\)\s*\.\s*([A-Za-z_]\w*)\s*\(")
PAR_ALL = re.compile(r"(?<![\w.$])all\s*\(")
PAR_SEQ0 = re.compile(r"(?<![\w.$])sequence\s*\(\s*0(?:\.0+)?\s*,")


def top_level_args(src: str, open_idx: int):
    """同 split_top_level_args，但返回 [(在 src 中的起始下标, 去掉首尾空白的文本)]。"""
    depth, i, start, out, quote = 0, open_idx, open_idx + 1, [], None
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
                out.append((start, src[start:i]))
                break
        elif c == "," and depth == 1:
            out.append((start, src[start:i]))
            start = i + 1
        i += 1
    return [(s + len(t) - len(t.lstrip()), t.strip()) for s, t in out if t.strip()]


def parallel_targets(src: str, open_idx: int, skip_first: bool = False):
    """一组并行动画里每个参数直接驱动的 (ref, 属性, 位置)；嵌套的 all / sequence(0, …) 一并展开。"""
    out = []
    args = top_level_args(src, open_idx)[1 if skip_first else 0:]
    for pos, text in args:
        if re.match(r"all\s*\(", text):
            out += parallel_targets(src, pos + text.index("("))
        elif re.match(r"sequence\s*\(\s*0(?:\.0+)?\s*,", text):
            out += parallel_targets(src, pos + text.index("("), skip_first=True)
        else:
            m = TARGET.match(text)
            if m:
                out.append((m.group(1), m.group(2), pos))
    return out


def tween_conflicts(src: str):
    """返回 [(行号, 'ref().属性', 次数)]。"""
    found = {}
    for rx, skip in ((PAR_ALL, False), (PAR_SEQ0, True)):
        for m in rx.finditer(src):
            groups = {}
            for ref, prop, pos in parallel_targets(src, src.index("(", m.start()), skip):
                groups.setdefault((ref, prop), []).append(pos)
            for (ref, prop), poss in groups.items():
                if len(poss) > 1:
                    second = sorted(poss)[1]
                    found[second] = (src.count("\n", 0, second) + 1, f"{ref}().{prop}", len(poss))
    return [found[k] for k in sorted(found)]


# ---------- 同一拍里几个并行部分驱动同一对象 ----------
# beat(id, a, at('词', b), …) 的各部分并行运行，at() 只推迟开始时间。两部分补间同一个对象的同一属性，
# 时间窗一重叠，两个补间就在同一帧互相覆盖：块在两条路径之间抽动、或者干脆停在半路。
# 静态只能估：开始时刻按旁白位置算（与 beats.ts 的 at() 一致），每个补间的时间窗按 all / chain / waitFor 的结构
# 和字面量时长推算（时长不是字面量时按 0.6s），所以只记 warn。要先后发生的动作，放进同一个 at() 里用 chain(…) 串起来。

CUE_PROPS = ("position|x|y|scale|opacity|rotation|width|height|size|fill|stroke|end|start|"
             "absolutePosition|moveTo|moveBy|hide|show|appear")
CUE_CALL = re.compile(r"\.\s*(" + CUE_PROPS + r")\s*\(")
BEAT_CALL = re.compile(r"(?<![\w.$])beat\s*\(")
AT_CALL = re.compile(r"at\s*\(")
NUM = re.compile(r"^\d+(?:\.\d+)?$")
W_CJK = re.compile(r"[㐀-鿿豈-﫿]")
W_WORD = re.compile(r"[A-Za-z0-9.%]+")
W_PAUSE = re.compile(r"[，。、：；！？,;:!?]")


def speech_weight(text: str) -> float:
    """与 beats.ts 的 weight() 一致：汉字 1、英文词 1.5、标点停顿 0.5。"""
    return len(W_CJK.findall(text)) + len(W_WORD.findall(text)) * 1.5 + len(W_PAUSE.findall(text)) * 0.5


def load_speech(scene: Path, src: str):
    """{拍号: (念旁白的秒数, 旁白)}，给 at() 估开始时刻用。"""
    p = timeline_path(scene, src)
    if not p or not p.exists():
        return {}
    data = json.loads(p.read_text(encoding="utf-8"))
    beats = data["beats"] if isinstance(data, dict) else data
    out = {}
    for b in beats:
        text = b.get("text", "")
        speech = b.get("speech")
        if speech is None:
            speech = max(0.0, (b.get("dur") or estimate_duration(text)) - PAD)
        out[b["id"]] = (float(speech), text)
    return out


def receiver(src: str, dot: int) -> str:
    """`.属性(` 前面的对象表达式（kv、kv.node、q()、r.seg[0]()），去掉空白。"""
    i, depth = dot, 0
    while i > 0:
        c = src[i - 1]
        if c in ")]":
            depth += 1
        elif c in "([":
            if depth == 0:
                break
            depth -= 1
        elif not (c.isalnum() or c in "_$." or depth > 0):
            break
        i -= 1
    return re.sub(r"\s+", "", src[i:dot])


STRUCT = re.compile(r"^(?:yield\*\s*)?(all|chain|sequence|waitFor|delay)\s*\(")
TWEEN_CALL = re.compile(r"\.\s*(" + CUE_PROPS + r"|to)\s*\(")
LAMBDA_PARAM = re.compile(r"\(?\s*([A-Za-z_$][\w$]*)\s*(?:,\s*[A-Za-z_$][\w$]*\s*)?\)?\s*=>")


def literal(text: str, default: float) -> float:
    return float(text) if NUM.match(text.strip()) else default


def whole_call(text: str) -> bool:
    """text 是不是一个完整的调用 f(…)，括号在末尾闭合。"""
    i = text.index("(")
    depth, quote = 0, None
    for k in range(i, len(text)):
        c = text[k]
        if quote:
            if c == "\\":
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
                return not text[k + 1:].strip()
    return False


def timed_tweens(src: str, pos: int, text: str, t: float, skip: set):
    """估算一段动画表达式里每个补间的时间窗：返回 (结束时刻, [(对象.属性, 开始, 结束, 位置)])。
    all / sequence(0, …) 并行取最长，chain 依次相加，waitFor / delay 推迟；其余按补间调用本身的时长。"""
    m = STRUCT.match(text)
    if m and whole_call(text):
        kind = m.group(1)
        args = top_level_args(src, pos + text.index("("))
        if kind == "waitFor":
            return t + (literal(args[0][1], 0.5) if args else 0.0), []
        if kind == "delay":
            if len(args) < 2:
                return t, []
            return timed_tweens(src, args[1][0], args[1][1], t + literal(args[0][1], 0.5), skip)
        if kind == "chain":
            out, cur = [], t
            for a_pos, a_text in args:
                cur, got = timed_tweens(src, a_pos, a_text, cur, skip)
                out += got
            return cur, out
        step = 0.0
        if kind == "sequence":
            step, args = (literal(args[0][1], 0.2), args[1:]) if args else (0.0, [])
        out, end = [], t
        for k, (a_pos, a_text) in enumerate(args):
            e, got = timed_tweens(src, a_pos, a_text, t + k * step, skip)
            out += got
            end = max(end, e)
        return end, out
    # 叶子：x().prop(v, d).to(v2, d2)… 或 kv.moveTo(p, d)；多个补间调用（比如 map 展开）按同时开始算
    out, end, last_target, cur = [], t, None, t
    for c in TWEEN_CALL.finditer(text):
        args = top_level_args(src, pos + c.end() - 1)
        if c.group(1) == "to":
            if last_target and args:
                d = literal(args[-1][1], 0.6)
                out.append((last_target, cur, cur + d, pos + c.start()))
                cur += d
                end = max(end, cur)
            continue
        if len(args) < 2:  # 读取或瞬间设置，不是补间
            last_target = None
            continue
        recv = receiver(src, pos + c.start())
        root = re.split(r"[.(\[]", recv, 1)[0]
        if not recv or recv in ("yield*", "this") or root in skip:
            last_target = None
            continue
        d = literal(args[-1][1], 0.6)
        last_target = f"{recv}.{c.group(1)}"
        out.append((last_target, t, t + d, pos + c.start()))
        cur = t + d
        end = max(end, cur)
    return end, out


def cue_overlaps(src: str, speech: dict):
    """返回 [(行号, 拍号, '对象.属性')]：同一拍的两个并行部分补间同一对象同一属性，估出的时间窗重叠。"""
    out = []
    for m in BEAT_CALL.finditer(src):
        args = top_level_args(src, src.index("(", m.start()))
        if len(args) < 3:
            continue
        bid = args[0][1].strip("'\"`")
        windows = []  # (部分序号, 目标, 开始, 结束, 位置)
        for k, (pos, text) in enumerate(args[1:]):
            t0, body_pos, body = 0.0, pos, text
            if AT_CALL.match(text):
                at_args = top_level_args(src, pos + text.index("("))
                if len(at_args) < 2:
                    continue
                phrase = at_args[0][1].strip("'\"`")
                body_pos, body = at_args[1]
                lead = float(at_args[2][1]) if len(at_args) > 2 and NUM.match(at_args[2][1]) else 0.2
                sp, narration = speech.get(bid, (None, ""))
                i = narration.find(phrase)
                if sp is None or i < 0:
                    continue  # 旁白里没有这个词：渲染时 at() 会直接报错
                total = speech_weight(narration)
                t0 = max(0.0, (sp * speech_weight(narration[:i]) / total if total else 0.0) - lead)
            skip = set(LAMBDA_PARAM.findall(body))  # 箭头函数的参数名：不同部分里同名不等于同一个对象
            _, tweens = timed_tweens(src, body_pos, body, t0, skip)
            windows += [(k, *w) for w in tweens]
        seen = set()
        for i, (ka, ta, sa, ea, _) in enumerate(windows):
            for kb, tb, sb, eb, wb in windows[i + 1:]:
                if ka != kb and ta == tb and sa < eb - 0.01 and sb < ea - 0.01 and (bid, ta) not in seen:
                    seen.add((bid, ta))
                    out.append((src.count("\n", 0, wb) + 1, bid, ta))
    return out


# ---------- 观众可见文字 ----------
# 动画要自包含：画面和旁白里不出现书的页码、图号、“书里/原图”这类说法，也不出现内部编号（U3、b27）。

BOOK_REFS = [
    (re.compile(r"Figure\s*\d|Fig\.\s*\d|Table\s*\d+\s*[-–.]\s*\d+"), "图表编号"),
    (re.compile(r"[图表]\s*\d+\s*[-–]\s*\d+"), "图表编号"),
    (re.compile(r"第\s*\d+\s*页|书页|页码"), "页码"),
    (re.compile(r"书里|书中|原书|本书|这本书|原图|原表|原文"), "提到原书"),
    (re.compile(r"\bPart\s+(?:I{1,3}|IV|V|\d)\b"), "原书分部"),
]
PAGE_TOKEN = re.compile(r"(?<![A-Za-z0-9])p\.?\s?(\d{1,3})(?![\d.%])")
PERCENTILES = {"1", "5", "10", "25", "50", "75", "90", "95", "99", "999"}
INTERNAL_ID = re.compile(r"(?<![A-Za-z0-9_])(U\d{1,2}|u\d{1,2}-[a-z]+\d*|b\d{1,3}[a-z]?\d?)(?![A-Za-z0-9_])")

MC_VISIBLE = [
    re.compile(r"\btext\s*=\s*\{?\s*" + STR),
    re.compile(r"\b(?:text|title|kicker)\s*:\s*" + STR),
    re.compile(r"(?:\bsay|\.text)\(\s*" + STR),
]
MANIM_VISIBLE = [re.compile(r"\b(?:txt|Text|MarkupText|Paragraph|Tex|MathTex)\(\s*[rfbu]?" + STR)]


def audit_text(text: str):
    """[(级别, 类别, 命中)]：error 为明确违规；warn 为“可能是页码”（如 p6，需人工确认，p50/p99 这类百分位不算）。"""
    hits = []
    for rx, kind in BOOK_REFS:
        hits += [("error", kind, m.group(0)) for m in rx.finditer(text)]
    hits += [("warn", "可能是页码", m.group(0)) for m in PAGE_TOKEN.finditer(text) if m.group(1) not in PERCENTILES]
    hits += [("error", "内部编号", m.group(0)) for m in INTERNAL_ID.finditer(text)]
    return hits


def audit_source(src: str, patterns, where: str):
    out = []
    for rx in patterns:
        for m in rx.finditer(src):
            text = m.group(2)
            for level, kind, hit in audit_text(text):
                out.append((level, where, src.count("\n", 0, m.start()) + 1, kind, hit, text))
    return out


# ---------- Motion Canvas ----------

def lint_mc_scene(path: Path, a):
    src = path.read_text(encoding="utf-8")
    r = {"file": path.name, "kind": "custom", "dur": None, "static": 0.0, "max_hold": 0.0,
         "overflow": [], "hints": []}
    r["conflicts"] = tween_conflicts(src)
    r["cue_overlaps"] = cue_overlaps(src, load_speech(path, src))
    r["visible"] = audit_source(src, MC_VISIBLE, path.name)
    r["timeline_path"] = timeline_path(path, src)
    seq0 = len(PAR_SEQ0.findall(src))
    if seq0:
        r["hints"].append(f"{seq0} 处 sequence(0, …)：等于 all(…)，要串行请用 chain(…)")

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
        # 位置参数写法 makeCardScene('kicker', 'title', [...], 'closing', 45) 里的字符串也会上屏
        for pos, arg in top_level_args(src, card_call + len("makeCardScene")):
            m = re.fullmatch(STR, arg, re.S)
            if m:
                line = src.count("\n", 0, pos) + 1
                r["visible"] += [(lvl, path.name, line, kind, hit, m.group(2)) for lvl, kind, hit in audit_text(m.group(2))]
        # 卡片的文字行：形如 {text: '…', …}
        lines = []
        for m in re.finditer(r"\{[^{}]*?\btext\s*:\s*" + STR + r"[^{}]*\}", src):
            size = re.search(r"\bsize\s*:\s*(\d+)", m.group(0))
            lines.append((m.group(2), int(size.group(1)) if size else a.card_font))
        title = re.search(r"\btitle\s*:\s*" + STR, src)
        r["lines"] = len(lines)
        r["chars"] = sum(len(t) for t, _ in lines) + (len(title.group(2)) if title else 0)
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
            "static": sum(waits), "max_hold": max(waits) if waits else 0.0, "overflow": [], "hints": hints,
            "conflicts": [], "visible": audit_source(src, MANIM_VISIBLE, path.name)}


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
    ap.add_argument("--narration", type=Path, nargs="*", default=[],
                    help="额外检查的旁白 JSON（beats.json / timeline.json，或包含它们的目录）；场景 import 的 timeline 会自动检查")
    ap.add_argument("--timeline-dir", type=Path,
                    help="章节目录里那份 timeline（如 <chapter>/timeline）：逐个和场景 import 的副本比对，不一致即报错")
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

    # 并行补间冲突
    conflicts = [(r["file"], *c) for r in results for c in r.get("conflicts", [])]
    if conflicts:
        print("\n并行补间冲突（同一属性在同一组并行动画里被补间多次，动作播不出来；要先后发生请用 chain）：")
        for f, line, target, n in conflicts:
            print(f"  [error] {f} L{line}: {target} ×{n}")

    overlaps = [(r["file"], *c) for r in results for c in r.get("cue_overlaps", [])]
    if overlaps:
        print("\n同一拍的几个并行部分补间同一对象（at() 只推迟开始，时间窗按旁白估算会重叠；"
              "要先后发生就放进同一个 at() 的 chain）：")
        for f, line, bid, target in overlaps:
            print(f"  [warn] {f} L{line} {bid}: {target}")

    # 观众可见文字：场景里的画面文字 + 旁白（场景 import 的 timeline、--narration）
    visible = [v for r in results for v in r.get("visible", [])]
    imported = {r["timeline_path"] for r in results if r.get("timeline_path")}
    narration_files = set(imported)
    for p in a.narration:
        narration_files |= set(p.rglob("*.json")) if p.is_dir() else {p}
    for p in sorted(narration_files, key=str):
        for bid, text in load_beats_texts(Path(p)):
            visible += [(lvl, f"{Path(p).name} 旁白", bid, kind, hit, text) for lvl, kind, hit in audit_text(text)]
    vis_errors = [v for v in visible if v[0] == "error"]
    if visible:
        print("\n观众可见文字（画面和旁白里不该出现书的页码、图号、“书里/原图”、内部编号）：")
        for lvl, where, line, kind, hit, text in visible[:60]:
            loc = f"L{line}" if isinstance(line, int) else str(line)
            print(f"  [{lvl}] {where} {loc} {kind}「{hit}」：{text[:40]}")
        if len(visible) > 60:
            print(f"  …… 共 {len(visible)} 条")

    # 时间轴两份拷贝
    drift = []
    if a.timeline_dir:
        for p in sorted(imported, key=str):
            twin = a.timeline_dir / Path(p).name
            if not twin.exists():
                drift.append((Path(p).name, "章节目录里没有这一份"))
            elif json.loads(Path(p).read_text(encoding="utf-8")) != json.loads(twin.read_text(encoding="utf-8")):
                drift.append((Path(p).name, "两份内容不一致：渲染会用场景 import 的那份"))
        if drift:
            print(f"\n时间轴副本不一致（场景 import 的 vs {a.timeline_dir}）：")
            for name, why in drift:
                print(f"  [error] {name}：{why}")

    gates = [
        (f"文字卡时长占比 ≤ {a.max_card_share:.0%}", share <= a.max_card_share, f"{share:.0%}"),
        (f"每个非卡片场景静止占比 ≤ {a.max_static:.0%}", all(r["static_ratio"] <= a.max_static for r in custom), ""),
        (f"单次停顿 ≤ {a.max_hold:g}s", all(r["max_hold"] <= a.max_hold for r in results), ""),
        (f"文字不超出 {a.safe_width:g}px 安全宽度", all(not r["overflow"] for r in results), ""),
        (f"文字卡 ≤ {a.max_card_lines} 行", not any(r.get("card_too_long") for r in results), ""),
        ("并行补间没有同属性冲突", not conflicts, f"{len(conflicts)} 处" if conflicts else ""),
        ("观众可见文字不引用书页/图号/内部编号", not vis_errors, f"{len(vis_errors)} 处" if vis_errors else ""),
    ]
    if a.timeline_dir:
        gates.append(("时间轴两份拷贝一致", not drift, f"{len(drift)} 份不一致" if drift else ""))
    print("\n门槛：")
    for name, ok, val in gates:
        print(f"  [{'PASS' if ok else 'FAIL'}] {name}{('  当前 ' + val) if val else ''}")

    if a.json:
        a.json.write_text(json.dumps({"scenes": results, "card_share": share, "conflicts": conflicts,
                                      "cue_overlaps": overlaps,
                                      "visible": visible, "timeline_drift": drift,
                                      "gates": [{"name": n, "pass": ok} for n, ok, _ in gates]},
                                     ensure_ascii=False, indent=2, default=str), encoding="utf-8")
    if a.strict and not all(ok for _, ok, _ in gates):
        sys.exit(1)


if __name__ == "__main__":
    main()
