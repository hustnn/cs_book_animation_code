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

整章的设计（两个以上单元，或者有开篇单元）另查开篇（样本：examples/opening/design.md）：

  7. 开篇单元     有且只有一个，排在第一个（标题或 P0 行里有“开篇 / 开场 / 总述”），P0 机制写“无（开篇）”
  8. 开篇三项     “- 章标题：”“- 一句话主旨：”“- 开篇拍：标题 o1；…；路线图 o5–o8；…”都填了；
                  “- 和上一章的关系：”没写记 WARN（第一章写“无（第一章）”）
  9. 路线图       “### 路线图” 表：2–4 个部分，每部分写了它回答的问题；站写成 “U3 站名”，站名 ≤ 5 个字（超了记 WARN）；
                  其余单元一个不漏、不多、顺序和 design.md 一致（只写了开篇单元时不查覆盖）
 10. 标题拍       给了 --beats-json 且里面有开篇的拍时：标题拍是第一拍，旁白念出了章名；开篇估计 ≤ 90 秒（超了记 WARN）

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
OPEN_WORDS = re.compile(r"开篇|开场|总述")
UNIT_ID = re.compile(r"(?<![A-Za-z0-9])[Uu](\d{1,2})(?![0-9])")
CJK = re.compile(r"[\u3400-\u9fff\uf900-\ufaff]")
WORD = re.compile(r"[A-Za-z0-9.%]+")
OPENING_MAX = 90  # 秒：开篇超过这个长度，观众还没进正题就走神了


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


def first_table(section: str) -> str:
    """section 里第一张连续的 markdown 表（后面跟着的别的表不算）。"""
    out = []
    for ln in section.splitlines():
        if ln.strip().startswith("|"):
            out.append(ln)
        elif out:
            break
    return "\n".join(out)


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


def p0_line_of(body: str):
    return next((ln for ln in body.splitlines() if re.match(r"^- P0 机制", ln)), None)


def is_opening(title: str, body: str) -> bool:
    """开篇单元：标题或 P0 行里有“开篇 / 开场 / 总述”。"""
    return bool(OPEN_WORDS.search(title) or OPEN_WORDS.search(p0_line_of(body) or ""))


def unit_id(title: str):
    m = UNIT_ID.search(title)
    return f"U{int(m.group(1))}" if m else None


def field(body: str, label: str):
    """“- label…：值” 这一行的值；没有这一行返回 None。"""
    for ln in body.splitlines():
        m = re.match(rf"^- {re.escape(label)}[^：:\n]*[：:]\s*(.*)$", ln)
        if m:
            return m.group(1).strip()
    return None


def est_seconds(text: str, hold: float = 0.0) -> float:
    """与 beats.ts 的 estimateDuration 一致：汉字 1、英文词 1.5，每秒 4.5，另加 0.35s 留白。"""
    return (len(CJK.findall(text)) + 1.5 * len(WORD.findall(text))) / 4.5 + 0.35 + hold


def chapter_name(title_field: str) -> str:
    """“第 3 章 存储与检索（Storage and Retrieval）” → “存储与检索”。"""
    name = re.sub(r"^\s*第\s*\S+?\s*章[\s:：·、，,]*", "", title_field)
    return re.sub(r"[（(].*?[)）]", "", name).strip()


def check_unit(title: str, body: str, known_beats):
    rows = []  # (级别, 检查项, 说明)
    referenced = set()

    if is_opening(title, body):
        rows.append(("PASS", "P0 机制", "开篇单元：不讲机制，开篇的结构在“整章”一节里查"))
        return rows
    p0_line = p0_line_of(body)
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


def check_opening(us, beats):
    """整章的开篇：开篇单元、章标题、一句话主旨、开篇拍、路线图覆盖全部单元、标题拍是第一拍并念出章名。

    us：[(单元标题, 正文)]；beats：beats.json 的拍列表（没给为 None）。
    """
    rows = []
    opens = [(i, t, b) for i, (t, b) in enumerate(us) if is_opening(t, b)]
    if not opens:
        rows.append(("FAIL", "开篇", "整章没有开篇单元：第一个单元写 “## 单元 U0：开篇”，P0 机制写“无（开篇）”，"
                     "章标题、一句话主旨、路线图都在里面（模板见 references/templates.md，样本 examples/opening/design.md）"))
        return rows
    i, title, body = opens[0]
    rows.append(("FAIL", "开篇", f"开篇单元要排在第一个（现在是第 {i + 1} 个）") if i
                else ("FAIL", "开篇", f"有 {len(opens)} 个开篇单元：只留一个") if len(opens) > 1
                else ("PASS", "开篇", title))

    ct = field(body, "章标题")
    gist = field(body, "一句话主旨")
    rel = field(body, "和上一章的关系")
    ob = field(body, "开篇拍")
    rows.append(("FAIL", "章标题", "没有 “- 章标题：第 N 章 章名” 一行：开篇第一拍要亮出来、念出来") if not ct or PLACEHOLDER.match(ct)
                else ("PASS", "章标题", ct))
    rows.append(("FAIL", "一句话主旨", "没有 “- 一句话主旨：…”：这一章到底讲什么，一两句说清") if not gist or PLACEHOLDER.match(gist)
                else ("PASS", "一句话主旨", gist[:40]))
    if not rel or PLACEHOLDER.match(rel):
        rows.append(("WARN", "和上一章的关系", "没写：观众要知道这一章接着上一章的哪里（第一章写“无（第一章）”）"))
    title_beat, map_beats = None, set()
    if not ob or PLACEHOLDER.match(ob):
        rows.append(("FAIL", "开篇拍", "没有 “- 开篇拍：标题 o1；主旨 o2–o3；路线图 o5–o8；下一站 o9” 一行"))
    else:
        mt = re.search(r"标题\s*[：:]?\s*([A-Za-z]+\d+[a-z]?)", ob)
        mm = re.search(r"路线图\s*[：:]?\s*([A-Za-z]+\d+[a-z]?(?:\s*[–\-~～]\s*[A-Za-z]*\d+[a-z]?)?)", ob)
        title_beat = mt.group(1) if mt else None
        map_beats = beats_in(mm.group(1)) if mm else set()
        missing = [n for n, v in (("标题", title_beat), ("路线图", map_beats)) if not v]
        rows.append(("FAIL", "开篇拍", f"没写{'、'.join(missing)}的拍号") if missing
                    else ("PASS", "开篇拍", f"标题 {title_beat}；路线图 {'、'.join(sorted(map_beats))}"))

    rm = next((v for k, v in h3_sections(body).items() if k.startswith("路线图")), None)
    if rm is None:
        rows.append(("FAIL", "路线图", "开篇单元里没有 “### 路线图” 表（部分 | 回答的问题 | 单元（站名））"))
    else:
        head, data = table_rows(first_table(rm))
        qcol = next((k for k, h in enumerate(head) if "问题" in h), None)
        scol = next((k for k, h in enumerate(head) if "单元" in h or "站" in h), None)
        order, problems, long_names = [], [], []
        if qcol is None or scol is None:
            problems.append("表头要有“回答的问题”和“单元（站名）”两列")
        else:
            for r in data:
                if qcol >= len(r) or PLACEHOLDER.match(r[qcol]):
                    problems.append(f"“{r[0][:12]}”没写它回答的问题")
                for entry in SEP.split(r[scol] if scol < len(r) else ""):
                    m = UNIT_ID.search(entry)
                    if not m:
                        continue
                    uid = f"U{int(m.group(1))}"
                    name = entry[m.end():].strip()
                    order.append(uid)
                    if not name:
                        problems.append(f"{uid} 没写站名")
                    elif len(CJK.findall(name)) + 0.5 * len(re.sub(r"[\u3400-\u9fff\uf900-\ufaff\s]", "", name)) > 5:
                        long_names.append(f"{uid} {name}")
        if not 2 <= len(data) <= 4:
            problems.append(f"{len(data)} 个部分（2–4 个：少了看不出结构，多了记不住）")
        rows.append(("FAIL", "路线图", "；".join(problems)) if problems
                    else ("PASS", "路线图", f"{len(data)} 个部分、{len(order)} 站"))
        if long_names:
            rows.append(("WARN", "站名", f"超过 5 个字，路线图上会挤：{'；'.join(long_names)}"))
        content = [unit_id(t) for t, b in us if not is_opening(t, b)]
        content = [u for u in content if u]
        if not content:
            rows.append(("PASS", "路线图覆盖", "只写了开篇单元：覆盖不查（其余单元写进 design.md 后再跑）"))
        else:
            dup = sorted({u for u in order if order.count(u) > 1})
            miss = [u for u in content if u not in order]
            extra = [u for u in order if u not in content]
            bad = []
            if miss:
                bad.append(f"漏了 {'、'.join(miss)}")
            if extra:
                bad.append(f"design.md 里没有 {'、'.join(extra)}")
            if dup:
                bad.append(f"重复 {'、'.join(dup)}")
            if not bad and order != content:
                bad.append(f"顺序和单元顺序不一致（路线图 {'→'.join(order)}）")
            rows.append(("FAIL", "路线图覆盖", "；".join(bad)) if bad
                        else ("PASS", "路线图覆盖", f"{len(content)} 个单元都在路线图上，顺序一致"))

    if beats is not None and ob:
        ids = [b["id"] for b in beats]
        text = {b["id"]: b.get("text", "") for b in beats}
        listed = beats_in(ob)
        here = [b for b in beats if b["id"] in listed]
        if not here:
            rows.append(("WARN", "标题拍", "beats.json 里没有开篇的拍：用开篇那份 beats.json 再跑一次，才能查标题拍"))
        else:
            unknown = sorted((listed | ({title_beat} if title_beat else set())) - set(ids))
            if unknown:
                rows.append(("FAIL", "开篇拍号存在", f"beats.json 里没有：{', '.join(unknown)}"))
            if title_beat in text:
                name = chapter_name(ct or "")
                if ids[0] != title_beat:
                    rows.append(("FAIL", "标题拍", f"标题拍 {title_beat} 要是第一拍（现在第一拍是 {ids[0]}）：先亮标题，再讲别的"))
                elif name and name not in text[title_beat]:
                    rows.append(("FAIL", "标题拍", f"{title_beat} 的旁白没念出章名「{name}」（现在：{text[title_beat][:30]}）"))
                else:
                    rows.append(("PASS", "标题拍", f"{title_beat} 是第一拍，念出了章名"))
            secs = sum(est_seconds(b.get("text", ""), float(b.get("hold", 0) or 0)) for b in here)
            rows.append(("WARN", "开篇长度", f"约 {secs:.0f} 秒（按字数估算），超过 {OPENING_MAX} 秒：机制细节留给各单元") if secs > OPENING_MAX
                        else ("PASS", "开篇长度", f"约 {secs:.0f} 秒（按字数估算）"))
    return rows


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("design", type=Path)
    ap.add_argument("--beats-json", type=Path)
    ap.add_argument("--strict", action="store_true")
    a = ap.parse_args()
    text = a.design.read_text(encoding="utf-8")
    known = beat_list = None
    if a.beats_json:
        data = json.loads(a.beats_json.read_text(encoding="utf-8"))
        beat_list = data["beats"] if isinstance(data, dict) else data
        known = {b["id"] for b in beat_list}
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
    if len(us) >= 2 or any(is_opening(t, b) for t, b in us):
        print("## 整章：开篇与路线图")
        for level, item, note in check_opening(us, beat_list):
            print(f"  [{level}] {item}：{note}")
            fails += level == "FAIL"
            warns += level == "WARN"
    print(f"\n{len(us)} 个单元：{fails} FAIL / {warns} WARN")
    sys.exit(1 if fails or (a.strict and warns) else 0)


if __name__ == "__main__":
    main()
