#!/usr/bin/env python3
"""新手测试的题包：把“只给旁白和联系表、让没上下文的人作答”做成一份可以直接交出去的材料。

用法：
  python newbie_pack.py --design <chapter>/design.md --unit <单元标题里的词> \\
      --narration <chapter>/timeline/<unit>.json --sheet rounds/<unit>/rN/sheet.png [--sheet …] \\
      -o rounds/<unit>/rN/newbie

产物：
  prompt.md   交给测试者的全部材料：作答规则、按拍排好的旁白、要看的联系表、学习目标题（[走查] 题要求一步步写状态）
  answers.md  记录模板：每题贴原样答案、判定（对 / 部分 / 错）、卡在哪一拍、改法

怎么用（SKILL.md 第 7 步）：
  另开一个没有这段对话上下文的会话或子代理（例如 Agent 工具新开一个 general-purpose 代理），只给它 prompt.md 的内容
  和 prompt.md 里列出的图片路径——不给原书、inventory、design、分镜。把它的回答原样贴进 answers.md，再逐题判定。
  做视频的人自己代入新手作答不算：你知道答案，看不出画面哪里没讲清。

门槛：这个单元在 design.md 里的检查（check_design.py）有 FAIL 时不出题包、退出码 2——没有 [走查] 题、没有机制走查表，
新手测试测不出“机制讲没讲透”。
"""
import argparse
import json
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from check_design import bullet_block, check_unit, units  # noqa: E402

RULES = """# 新手测试

你在看一段讲解视频的材料：下面是逐拍的旁白文字，另附每拍一帧的联系表图片。你**没有读过**这段视频依据的那本书。

作答规则：
1. 只根据这里的旁白和图片回答。不要用你自己已有的知识补全——视频没讲到的，就当不知道。
2. 哪里看不懂、旁白和画面对不上、或者视频没交代清楚，直接写“视频没讲清：…”，并写出是哪一拍（拍号在旁白前面）。
3. 标着 [走查] 的题：按题目给的数据一步一步写，每一步之后各处是什么状态，写清楚依据的是哪一拍。
4. 最后用一两句话说：这段视频你觉得最难跟上的是哪里。
"""


def goals_of(body: str):
    block = bullet_block(body, "学习目标") or []
    out = []
    for ln in block[1:]:
        m = re.match(r"^\s+(?:\d+[.、]|-)\s*(.+)$", ln)
        if m:
            out.append(m.group(1).strip())
    return out


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--design", type=Path, required=True)
    ap.add_argument("--unit", required=True, help="单元标题里的一个词，用来在 design.md 里找到这个单元")
    ap.add_argument("--narration", type=Path, required=True, help="timeline.json 或 beats.json（按拍的旁白）")
    ap.add_argument("--sheet", type=Path, action="append", default=[], help="联系表图片，可给多次")
    ap.add_argument("-o", "--out", type=Path, required=True)
    a = ap.parse_args()

    hits = [(t, b) for t, b in units(a.design.read_text(encoding="utf-8")) if a.unit in t]
    if len(hits) != 1:
        sys.exit(f"--unit “{a.unit}” 在 design.md 里匹配到 {len(hits)} 个单元：{[t for t, _ in hits]}")
    title, body = hits[0]
    fails = [f"{item}：{note}" for level, item, note in check_unit(title, body, None) if level == "FAIL"]
    if fails:
        print(f"{title} 的教学设计检查没过，不出题包：")
        for f in fails:
            print(f"  [FAIL] {f}")
        print("先改 design.md（照 examples/lsm/design.md），让 check_design.py 没有 FAIL")
        sys.exit(2)
    goals = goals_of(body)
    if not goals:
        sys.exit(f"单元 {title} 的学习目标是空的：先把题写进 design.md")
    data = json.loads(a.narration.read_text(encoding="utf-8"))
    beats = data["beats"] if isinstance(data, dict) else data
    missing = [p for p in a.sheet if not p.exists()]
    if missing:
        sys.exit(f"联系表不存在：{', '.join(map(str, missing))}（先跑 sample_frames.py）")

    a.out.mkdir(parents=True, exist_ok=True)
    lines = [RULES, "## 旁白（按拍）", ""]
    lines += [f"- {b['id']}：{b.get('text', '')}" for b in beats]
    lines += ["", "## 图片", ""]
    lines += [f"- {p.resolve()}" for p in a.sheet] or ["- （没有给联系表：只凭旁白作答，结论要打折扣）"]
    lines += ["", "## 题目", ""]
    lines += [f"{i}. {g}" for i, g in enumerate(goals, 1)]
    lines += ["", f"{len(goals) + 1}. 这段视频最难跟上的是哪里？"]
    (a.out / "prompt.md").write_text("\n".join(lines) + "\n", encoding="utf-8")

    ans = [f"# 新手测试记录：{title}", "",
           "> 测试者：（另开的会话 / 子代理 / 真人，写清是谁；必须没看过原书、inventory、design、分镜）",
           "> 给了什么：prompt.md + 上面列出的图片", ""]
    for i, g in enumerate(goals + ["这段视频最难跟上的是哪里？"], 1):
        ans += [f"## {i}. {g}", "", "原样答案：", "", "> （贴进来，不改一个字）", "",
                "判定：对 / 部分 / 错", "", "卡在哪一拍、为什么：", "", "改法（改图式或走查例子，不是加一句旁白）：", ""]
    ans += ["## 小结", "", "答对 a / b 题；[走查] 题答对 c / d；记进本轮 review.md，答错的 [走查] 题按 P1 处理。", ""]
    (a.out / "answers.md").write_text("\n".join(ans), encoding="utf-8")
    print(f"题包 → {a.out / 'prompt.md'}（{len(beats)} 拍旁白、{len(a.sheet)} 张图、{len(goals)} 道题）")
    print(f"记录 → {a.out / 'answers.md'}")
    print("下一步：另开一个没有上下文的会话或子代理，只给它 prompt.md 和其中的图片，答案原样贴进 answers.md")


if __name__ == "__main__":
    main()
