#!/usr/bin/env python3
"""教学设计（design.md）的结构检查：第 2 步的门槛里能机械判断的部分，写完 design.md 就跑。

用法：
  python check_design.py <chapter>/design.md [--beats-json <chapter>/beats.json] [--strict]

按 references/templates.md 的 design.md 模板解析（完整样本：examples/lsm/design.md）。每个以“## 单元”开头的小节
（“## 单元总览”除外）检查：

  1. P0 机制      “- P0 机制（≤ 3）：A；B；C” 一行，1–3 个（密度上限：装不下就拆单元）。
                  总述、小结这类不讲机制的单元写 “- P0 机制（≤ 3）：无（总述）”，2–4 项就不查了
  2. 走查题       “- 学习目标：” 下面至少一条带 [走查] 标记（给一组具体数据，让人走一遍机制）
  3. 图式         “- 图式” 下面四问都填了：流动的东西、分区、步骤、要数的代价（不能是 <占位>）
  4. 机制走查     每个 P0 机制都有一节 “### 机制走查：<机制名>”，表里至少 3 步、拍号合起来至少 4 拍
  5. 深度延伸     有 “### 深度延伸” 表时，每一行的“依据”都填了
  6. 拍号存在     给了 --beats-json 时，走查表和深度延伸表里写到的拍号都在 beats.json 里

有 FAIL 时退出码为 1（--strict 时 WARN 也算）。只查结构，内容对不对仍靠第 7 步的审查。
"""
import argparse
import json
import re
import sys
from pathlib import Path

ASKS = ["流动的东西", "分区", "步骤", "要数的代价"]
SEP = re.compile(r"[；;、，,]")
BEAT_TOKEN = re.compile(r"([A-Za-z]+)(\d+)([a-z]?)(?:\s*[–\-~～]\s*(?:([A-Za-z]+))?(\d+)([a-z]?))?")
PLACEHOLDER = re.compile(r"^\s*(<[^>]*>|…|\.\.\.|待定|TODO)?\s*$")


def units(text: str):
    """[(单元标题, 正文)]：以 ## 单元 开头、不是总览的二级标题。"""
    parts = re.split(r"(?m)^## ", text)
    out = []
    for p in parts[1:]:
        title, _, body = p.partition("\n")
        if title.startswith("单元") and not title.startswith("单元总览"):
            out.append((title.strip(), body))
    return out


def bullet_block(body: str, label: str):
    """“- label…” 这一行，以及它下面缩进的子行（到下一个顶层 “- ” 或标题为止）。"""
    lines = body.splitlines()
    for i, ln in enumerate(lines):
        if re.match(rf"^- {re.escape(label)}", ln):
            block = [ln]
            for nxt in lines[i + 1:]:
                if re.match(r"^(- |#)", nxt):
                    break
                block.append(nxt)
            return block
    return None


def table_rows(section: str):
    """markdown 表格的数据行（去掉表头和分隔行），每行是单元格列表。"""
    rows = [ln for ln in section.splitlines() if ln.strip().startswith("|")]
    if len(rows) < 2:
        return [], []
    cells = lambda ln: [c.strip() for c in ln.strip().strip("|").split("|")]
    return cells(rows[0]), [cells(r) for r in rows[2:]]


def beats_in(cell: str):
    """“w3–w5、r2” → {w3, w4, w5, r2}；同前缀的范围展开。"""
    out = set()
    for m in BEAT_TOKEN.finditer(cell):
        pre, a, sa, pre2, b, sb = m.groups()
        if b and (pre2 in (None, pre)) and not sa and not sb:
            out.update(f"{pre}{i}" for i in range(int(a), int(b) + 1))
        else:
            out.add(f"{pre}{a}{sa}")
            if b:
                out.add(f"{pre2 or pre}{b}{sb}")
    return out


def h3_sections(body: str):
    """{三级标题: 内容}。"""
    parts = re.split(r"(?m)^### ", body)
    return {p.partition("\n")[0].strip(): p.partition("\n")[2] for p in parts[1:]}


def check_unit(title: str, body: str, known_beats):
    rows = []  # (级别, 检查项, 说明)
    referenced = set()

    p0_line = next((ln for ln in body.splitlines() if re.match(r"^- P0 机制", ln)), None)
    mechs = []
    none_ = p0_line and re.split(r"[：:]", p0_line, 1)[-1].strip().startswith("无")
    if none_:
        rows.append(("PASS", "P0 机制", "无（不讲机制的单元，不查走查题、图式、机制走查）"))
        return rows
    if not p0_line:
        rows.append(("FAIL", "P0 机制", "没有 “- P0 机制（≤ 3）：…” 这一行"))
    else:
        mechs = [m.strip() for m in SEP.split(re.split(r"[：:]", p0_line, 1)[-1]) if m.strip() and not PLACEHOLDER.match(m)]
        if not mechs:
            rows.append(("FAIL", "P0 机制", "这一行是空的或还是占位"))
        elif len(mechs) > 3:
            rows.append(("FAIL", "P0 机制", f"{len(mechs)} 个，超过密度上限 3：拆成两个单元"))
        else:
            rows.append(("PASS", "P0 机制", f"{len(mechs)} 个：{'、'.join(mechs)}"))

    goals = bullet_block(body, "学习目标")
    walk_goals = [g for g in (goals or []) if "[走查]" in g]
    if goals is None:
        rows.append(("FAIL", "走查题", "没有 “- 学习目标” 一项"))
    elif not walk_goals:
        rows.append(("FAIL", "走查题", "学习目标里没有带 [走查] 的题：至少一题让人用具体数据走一遍机制"))
    else:
        rows.append(("PASS", "走查题", f"{len(walk_goals)} 题"))

    schema = bullet_block(body, "图式")
    if schema is None:
        rows.append(("FAIL", "图式", "没有 “- 图式” 一项（visual-schemas.md 的四个问题）"))
    else:
        missing = []
        for ask in ASKS:
            ln = next((x for x in schema if re.match(rf"^\s+- {ask}", x)), None)
            val = re.split(r"[：:]", ln, 1)[-1] if ln and re.search(r"[：:]", ln) else ""
            if not ln or PLACEHOLDER.match(val):
                missing.append(ask)
        rows.append(("FAIL", "图式", f"没填：{'、'.join(missing)}") if missing else ("PASS", "图式", "四问都填了"))

    secs = h3_sections(body)
    walks = {k.split("：", 1)[-1].split(":", 1)[-1].strip(): v for k, v in secs.items() if k.startswith("机制走查")}
    for mech in mechs:
        name = next((w for w in walks if mech in w or w in mech), None)
        if not name:
            rows.append(("FAIL", f"机制走查 · {mech}", f"没有 “### 机制走查：{mech}” 一节"))
            continue
        head, data = table_rows(walks[name])
        bcol = next((i for i, h in enumerate(head) if "拍" in h), None)
        beats = set()
        for r in data:
            if bcol is not None and bcol < len(r):
                beats |= beats_in(r[bcol])
        referenced |= beats
        problems = []
        if len(data) < 3:
            problems.append(f"只有 {len(data)} 步（至少 3 步）")
        if bcol is None:
            problems.append("表里没有“拍号”列")
        elif len(beats) < 4:
            problems.append(f"只覆盖 {len(beats)} 拍（至少 4 拍）")
        rows.append(("FAIL", f"机制走查 · {mech}", "；".join(problems)) if problems
                    else ("PASS", f"机制走查 · {mech}", f"{len(data)} 步、{len(beats)} 拍"))

    ext = next((v for k, v in secs.items() if k.startswith("深度延伸")), None)
    if ext is not None:
        head, data = table_rows(ext)
        src = next((i for i, h in enumerate(head) if "依据" in h), None)
        bcol = next((i for i, h in enumerate(head) if "拍" in h), None)
        if src is None:
            rows.append(("FAIL", "深度延伸", "表里没有“依据”列"))
        else:
            empty = [r[0] for r in data if src >= len(r) or PLACEHOLDER.match(r[src])]
            rows.append(("FAIL", "深度延伸", f"{len(empty)} 条没写依据：{'；'.join(e[:20] for e in empty)}") if empty
                        else ("PASS", "深度延伸", f"{len(data)} 条，都写了依据"))
        if bcol is not None:
            for r in data:
                if bcol < len(r):
                    referenced |= beats_in(r[bcol])
    else:
        rows.append(("WARN", "深度延伸", "没有 “### 深度延伸” 表：确认这个单元没有原文之外的机制细节"))

    if known_beats is not None and referenced:
        unknown = sorted(referenced - known_beats)
        rows.append(("FAIL", "拍号存在", f"beats.json 里没有：{', '.join(unknown)}") if unknown
                    else ("PASS", "拍号存在", f"{len(referenced)} 个拍号都在"))
    return rows


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("design", type=Path)
    ap.add_argument("--beats-json", type=Path)
    ap.add_argument("--strict", action="store_true")
    a = ap.parse_args()
    text = a.design.read_text(encoding="utf-8")
    known = None
    if a.beats_json:
        data = json.loads(a.beats_json.read_text(encoding="utf-8"))
        known = {b["id"] for b in (data["beats"] if isinstance(data, dict) else data)}
    us = units(text)
    if not us:
        sys.exit(f"{a.design}：没有找到 “## 单元…” 小节（模板见 references/templates.md，样本见 examples/lsm/design.md）")
    fails = warns = 0
    for title, body in us:
        print(f"## {title}")
        for level, item, note in check_unit(title, body, known):
            print(f"  [{level}] {item}：{note}")
            fails += level == "FAIL"
            warns += level == "WARN"
    print(f"\n{len(us)} 个单元：{fails} FAIL / {warns} WARN")
    sys.exit(1 if fails or (a.strict and warns) else 0)


if __name__ == "__main__":
    main()
