"""U11 Datalog 场景 A（b1–b16b）：事实与规则。

分镜：ch02/skill-ch02/beats-u11.md；原文：DDIA §2.15（书 p60–62，PDF p83–84）。
工具：Manim（事实 + 规则推导新事实）。画面不贴原图截图，全部重画。
旁白、画面、字幕里不出现书页、图号、“书里/原图/原表/Part”、单元编号。

渲染（在 ch02/manim/ 目录下，须先拿渲染锁，拿锁失败绝不渲染）：
  .venv/bin/manim -qm skill02/u11_facts.py U11FactsRules
产物：media/videos/u11_facts/720p30/U11FactsRules.mp4（1280x720 30fps）
"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from manim import *  # noqa: F401,F403
from beats import Beats
from theme import T, txt

config.background_color = T.bg

MONO = "Noto Sans Mono"
TITLE_Y = 3.55
CONTENT_TOP = 2.85


def code(s, size=26, color=T.text, bold=False):
    """等宽代码行（ASCII），不走 LaTeX。"""
    return Text(s, font=MONO, font_size=size, color=color,
                weight=BOLD if bold else NORMAL)


def title_mob(s):
    return txt(s, size=26, color=T.yellow, bold=True).move_to([0, TITLE_Y, 0])


def card(w, h, color=T.card):
    return RoundedRectangle(
        corner_radius=0.12, width=w, height=h,
        fill_color=color, fill_opacity=1, stroke_color=T.line, stroke_width=2,
    )


class U11FactsRules(Scene):
    def construct(self):
        self.camera.background_color = T.bg
        b = Beats(self, os.path.join(
            os.path.dirname(os.path.abspath(__file__)),
            "..", "..", "skill-ch02", "timeline", "u11.json"))
        title = None

        def show_title(s):
            nonlocal title
            new = title_mob(s)
            if title is None:
                self.play(FadeIn(new, shift=UP * 0.1), run_time=0.5)
            else:
                self.play(FadeOut(title, shift=UP * 0.1),
                          FadeIn(new, shift=UP * 0.1), run_time=0.5)
            title = new

        def hide_title():
            nonlocal title
            if title is not None:
                self.play(FadeOut(title), run_time=0.4)
                title = None

        # ---------- b1 钩子 ----------
        with b.beat("b1"):
            show_title("规则自己长出新事实")
            sel = code("SELECT", size=44, color=T.blue).move_to([0, 0.4, 0])
            self.play(FadeIn(sel, shift=UP * 0.2), run_time=0.7)
            q = txt("？", size=64, color=T.yellow).move_to([0, 0.4, 0])
            self.play(FadeOut(sel), FadeIn(q, scale=1.3), run_time=0.7)
            f1 = code("name(namerica, 'North America').", size=22).move_to([-3.4, -0.9, 0], aligned_edge=LEFT)
            f2 = code("within(usa, namerica).", size=22).move_to([-3.4, -1.6, 0], aligned_edge=LEFT)
            f3 = code("born_in(lucy, idaho).", size=22).move_to([-3.4, -2.3, 0], aligned_edge=LEFT)
            self.play(FadeOut(q), FadeIn(f1, shift=UP * 0.1), run_time=0.6)
            self.play(FadeIn(f2, shift=UP * 0.1), run_time=0.6)
            self.play(FadeIn(f3, shift=UP * 0.1), run_time=0.6)

        # ---------- b2a 三层 ----------
        with b.beat("b2a"):
            hide_title()
            show_title("1980 年代的地基")
            self.play(FadeOut(f1), FadeOut(f2), FadeOut(f3), run_time=0.5)
            line = Line([-6, -0.6, 0], [6, -0.6, 0], color=T.line, stroke_width=3)
            dl = VGroup(card(3.4, 1.0), txt("Datalog", size=30, bold=True).move_to([0, 0, 0]),
                        txt("1980 年代", size=20, color=T.muted).move_to([0, 0, 0]))
            dl[1].move_to(dl[0].get_center() + UP * 0.22)
            dl[2].move_to(dl[0].get_center() + DOWN * 0.28)
            dl.move_to([-3.4, -1.9, 0])
            sp = VGroup(card(2.6, 0.8), txt("SPARQL", size=26, bold=True))
            sp[1].move_to(sp[0].get_center())
            sp.move_to([-3.4, 1.3, 0])
            cy = VGroup(card(2.6, 0.8), txt("Cypher", size=26, bold=True))
            cy[1].move_to(cy[0].get_center())
            cy.move_to([3.4, 1.3, 0])
            self.play(Create(line), run_time=0.9)
            self.play(FadeIn(dl, shift=UP * 0.2), run_time=0.9)
            self.play(FadeIn(sp, shift=DOWN * 0.2), run_time=0.8)
            self.play(FadeIn(cy, shift=DOWN * 0.2), run_time=0.8)
            self.wait(1.0)
            self.play(Circumscribe(dl, run_time=1.0), run_time=1.0)

        # ---------- b2b 地基 ----------
        with b.beat("b2b"):
            show_title("后来语言的地基")
            found = Rectangle(width=3.4, height=0.28, fill_color=T.yellow,
                              fill_opacity=0.9, stroke_width=0).move_to([-3.4, -2.62, 0])
            self.play(FadeIn(found, shift=UP * 0.1), run_time=0.9)
            self.play(Circumscribe(dl, run_time=1.0), run_time=1.0)
            self.play(sp.animate.shift(UP * 0.25), cy.animate.shift(UP * 0.25), run_time=0.9)

        # ---------- b3a Datomic ----------
        with b.beat("b3a"):
            show_title("Datomic")
            self.play(FadeOut(line), FadeOut(dl), FadeOut(sp), FadeOut(cy),
                      FadeOut(found), run_time=0.5)
            dat = VGroup(card(4.6, 1.4),
                         txt("Datomic", size=32, bold=True),
                         txt("查询语言就是 Datalog", size=22, color=T.green))
            dat[1].move_to(dat[0].get_center() + UP * 0.32)
            dat[2].move_to(dat[0].get_center() + DOWN * 0.35)
            dat.move_to([-2.4, 0.3, 0])
            self.play(FadeIn(dat, shift=UP * 0.2), run_time=1.1)

        # ---------- b3b Cascalog ----------
        with b.beat("b3b"):
            show_title("Cascalog")
            cas = VGroup(card(4.6, 1.4),
                         txt("Cascalog", size=32, bold=True),
                         txt("Hadoop 上的 Datalog", size=22, color=T.green))
            cas[1].move_to(cas[0].get_center() + UP * 0.32)
            cas[2].move_to(cas[0].get_center() + DOWN * 0.35)
            cas.move_to([2.4, 0.3, 0])
            self.play(FadeIn(cas, shift=UP * 0.2), run_time=1.2)
            self.play(Circumscribe(dat, run_time=0.9), Circumscribe(cas, run_time=0.9),
                      run_time=0.9)

        # ---------- b4a Prolog 语法 ----------
        with b.beat("b4a"):
            show_title("Prolog 语法")
            self.play(FadeOut(dat), FadeOut(cas), run_time=0.5)
            pro = VGroup(card(6.4, 1.6),
                         txt("Prolog", size=34, bold=True),
                         code("within_recursive(Location, Name) :- name(Location, Name).", size=20, color=T.muted))
            pro[1].move_to(pro[0].get_center() + UP * 0.4)
            pro[2].move_to(pro[0].get_center() + DOWN * 0.38)
            pro.move_to([0, 0.3, 0])
            self.play(FadeIn(pro, shift=UP * 0.2), run_time=1.2)

        # ---------- b4b 子集 ----------
        with b.beat("b4b"):
            show_title("Prolog 的子集")
            sub = VGroup(card(3.2, 0.9, color=T.blue),
                         txt("Datalog", size=28, bold=True, color=T.white))
            sub[1].move_to(sub[0].get_center())
            sub.move_to([0, -1.9, 0])
            self.play(FadeIn(sub, shift=UP * 0.2), run_time=1.0)
            self.play(Circumscribe(sub, run_time=0.9), run_time=0.9)

        # ---------- b5a 三元组翻面 ----------
        with b.beat("b5a"):
            show_title("三元组翻个面")
            self.play(FadeOut(pro), FadeOut(sub), run_time=0.5)
            tri = code("(lucy, born_in, idaho)", size=32).move_to([0, 0.6, 0])
            self.play(FadeIn(tri, shift=UP * 0.15), run_time=0.8)
            arc = CurvedArrow([-2.5, 1.5, 0], [2.5, 1.5, 0], angle=-TAU / 3,
                              color=T.yellow, stroke_width=4)
            self.play(Create(arc), run_time=0.9)
            pred = code("born_in(lucy, idaho).", size=32, color=T.green).move_to([0, -1.2, 0])
            self.play(FadeIn(pred, shift=UP * 0.15), run_time=0.8)

        # ---------- b5b 谓词 ----------
        with b.beat("b5b"):
            show_title("写成谓词")
            lab = txt("谓词", size=24, color=T.yellow, bold=True).next_to(pred, UP, buff=0.35)
            box = SurroundingRectangle(pred, color=T.yellow, buff=0.12)
            self.play(Create(box), FadeIn(lab, shift=DOWN * 0.1), run_time=1.0)
            self.play(Indicate(pred, scale_factor=1.05), run_time=1.0)

        # ---------- b6 名字/类型事实 ----------
        with b.beat("b6"):
            show_title("事实：名字和类型")
            self.play(FadeOut(tri), FadeOut(arc), FadeOut(pred), FadeOut(box),
                      FadeOut(lab), run_time=0.5)
            facts = [
                "name(namerica, 'North America').",
                "type(namerica, continent).",
                "name(usa, 'United States').",
                "type(usa, country).",
                "name(idaho, 'Idaho').",
                "type(idaho, state).",
                "name(lucy, 'Lucy').",
            ]
            fact_mobs = []
            for i, f in enumerate(facts):
                m = code(f, size=24).move_to([-6.0, 2.4 - i * 0.55, 0], aligned_edge=LEFT)
                fact_mobs.append(m)
            for m in fact_mobs:
                self.play(FadeIn(m, shift=RIGHT * 0.15), run_time=0.75)

        # ---------- b7 关系事实 ----------
        with b.beat("b7"):
            show_title("事实：在哪里")
            rels = [
                "within(usa, namerica).",
                "within(idaho, usa).",
                "born_in(lucy, idaho).",
            ]
            for j, f in enumerate(rels):
                m = code(f, size=24, color=T.blue).move_to(
                    [-6.0, 2.4 - (7 + j) * 0.55, 0], aligned_edge=LEFT)
                fact_mobs.append(m)
                self.play(FadeIn(m, shift=RIGHT * 0.15), run_time=1.0)
            self.play(Indicate(fact_mobs[7], scale_factor=1.03),
                      Indicate(fact_mobs[8], scale_factor=1.03),
                      Indicate(fact_mobs[9], scale_factor=1.03), run_time=1.2)

        # ---------- b8 三条规则 + 查询 ----------
        with b.beat("b8"):
            show_title("三条规则，一行查询")
            self.play(*[FadeOut(m) for m in fact_mobs], run_time=0.5)
            r1 = VGroup(card(4.0, 1.1), txt("规则一", size=26, bold=True, color=T.blue),
                        code("within_recursive(...)", size=18, color=T.muted))
            r1[1].move_to(r1[0].get_center() + UP * 0.22)
            r1[2].move_to(r1[0].get_center() + DOWN * 0.28)
            r1.move_to([-4.4, 1.2, 0])
            r2 = VGroup(card(4.0, 1.1), txt("规则二", size=26, bold=True, color=T.green),
                        code("within_recursive(...)", size=18, color=T.muted))
            r2[1].move_to(r2[0].get_center() + UP * 0.22)
            r2[2].move_to(r2[0].get_center() + DOWN * 0.28)
            r2.move_to([0, 1.2, 0])
            r3 = VGroup(card(4.0, 1.1), txt("规则三", size=26, bold=True, color=T.purple),
                        code("migrated(...)", size=18, color=T.muted))
            r3[1].move_to(r3[0].get_center() + UP * 0.22)
            r3[2].move_to(r3[0].get_center() + DOWN * 0.28)
            r3.move_to([4.4, 1.2, 0])
            q = code("?- migrated(Who, 'United States', 'Europe').", size=24,
                     color=T.yellow).move_to([0, -1.3, 0])
            self.play(FadeIn(r1, shift=UP * 0.15), run_time=0.8)
            self.play(FadeIn(r2, shift=UP * 0.15), run_time=0.8)
            self.play(FadeIn(r3, shift=UP * 0.15), run_time=0.8)
            self.play(FadeIn(q, shift=UP * 0.15), run_time=0.9)

        # ---------- b9 规则一 ----------
        with b.beat("b9"):
            show_title("规则一：名字即包含")
            self.play(FadeOut(r2), FadeOut(r3), FadeOut(q), run_time=0.5)
            self.play(r1.animate.move_to([0, 1.6, 0]).scale(1.25), run_time=0.9)
            formula = code("within_recursive(Location, Name) :- name(Location, Name).",
                           size=24).move_to([0, -0.2, 0])
            self.play(FadeIn(formula, shift=UP * 0.1), run_time=0.9)
            f = code("name(namerica, 'North America')", size=24, color=T.blue).move_to([0, -1.3, 0])
            gen = code("within_recursive(namerica, 'North America')", size=24,
                       color=T.green).move_to([0, -2.4, 0])
            arr = Arrow([0, -1.6, 0], [0, -2.0, 0], color=T.green, stroke_width=4)
            self.play(FadeIn(f, shift=UP * 0.1), run_time=0.8)
            self.play(Create(arr), FadeIn(gen, shift=UP * 0.1), run_time=0.9)

        # ---------- b10 规则二 ----------
        with b.beat("b10"):
            show_title("规则二：递归")
            self.play(FadeOut(r1), FadeOut(formula), FadeOut(f), FadeOut(arr),
                      FadeOut(gen), run_time=0.5)
            formula2 = code("within_recursive(Location, Name) :-", size=26).move_to([0, 1.5, 0])
            p1 = code("within(Location, Via),", size=26, color=T.blue).move_to([0, 0.4, 0])
            p2 = code("within_recursive(Via, Name).", size=26, color=T.green).move_to([0, -0.7, 0])
            self.play(FadeIn(formula2, shift=UP * 0.1), run_time=0.9)
            self.play(FadeIn(p1, shift=RIGHT * 0.15), run_time=1.0)
            self.play(FadeIn(p2, shift=RIGHT * 0.15), run_time=1.0)
            self.play(Indicate(p2, scale_factor=1.05), run_time=0.9)

        # ---------- b11 规则三 ----------
        with b.beat("b11"):
            show_title("规则三：五个条件")
            self.play(FadeOut(formula2), FadeOut(p1), FadeOut(p2), run_time=0.5)
            head = code("migrated(Name, BornIn, LivingIn) :-", size=24).move_to([0, 2.2, 0])
            conds = [
                "name(Person, Name),",
                "born_in(Person, BornLoc),",
                "within_recursive(BornLoc, BornIn),",
                "lives_in(Person, LivingLoc),",
                "within_recursive(LivingLoc, LivingIn).",
            ]
            cond_mobs = [code(c, size=24, color=T.blue).move_to([-4.6, 1.3 - i * 0.62, 0], aligned_edge=LEFT)
                         for i, c in enumerate(conds)]
            self.play(FadeIn(head, shift=UP * 0.1), run_time=0.8)
            for m in cond_mobs:
                self.play(FadeIn(m, shift=RIGHT * 0.15), run_time=0.8)

        # ---------- b12a SELECT 对比 ----------
        with b.beat("b12a"):
            show_title("一上来就 SELECT")
            self.play(FadeOut(head), *[FadeOut(m) for m in cond_mobs], run_time=0.5)
            sel = VGroup(card(4.4, 1.3), code("SELECT ...", size=30, bold=True, color=T.blue))
            sel[1].move_to(sel[0].get_center())
            sel.move_to([-3.2, 0.5, 0])
            rul = VGroup(card(4.4, 1.3), txt("定义规则", size=30, bold=True, color=T.green))
            rul[1].move_to(rul[0].get_center())
            rul.move_to([3.2, 0.5, 0])
            self.play(FadeIn(sel, shift=UP * 0.15), run_time=0.9)
            self.play(FadeIn(rul, shift=UP * 0.15), run_time=0.9)
            self.play(Circumscribe(sel, run_time=0.9), run_time=0.9)

        # ---------- b12b 先定义规则 ----------
        with b.beat("b12b"):
            show_title("先定义规则")
            self.play(sel.animate.set_opacity(0.35).move_to([-4.5, -0.5, 0]).scale(0.8),
                      run_time=0.9)
            self.play(rul.animate.scale(1.12).move_to([0, 0.5, 0]), run_time=1.1)
            self.play(Circumscribe(rul, run_time=0.9), run_time=0.9)
            self.wait(1.0)
            self.play(Circumscribe(rul, run_time=0.9), run_time=0.9)

        # ---------- b13a 两个新谓词 ----------
        with b.beat("b13a"):
            show_title("两个新谓词")
            self.play(FadeOut(sel), FadeOut(rul), run_time=0.5)
            n1 = VGroup(card(4.6, 1.0), code("within_recursive", size=26, bold=True, color=T.green))
            n1[1].move_to(n1[0].get_center())
            n1.move_to([-2.6, 0.8, 0])
            n2 = VGroup(card(4.6, 1.0), code("migrated", size=26, bold=True, color=T.purple))
            n2[1].move_to(n2[0].get_center())
            n2.move_to([2.6, 0.8, 0])
            self.play(FadeIn(n1, shift=UP * 0.15), run_time=1.0)
            self.play(FadeIn(n2, shift=UP * 0.15), run_time=1.0)
            self.wait(1.0)
            self.play(Circumscribe(n1, run_time=0.9), run_time=0.9)

        # ---------- b13b 派生 ----------
        with b.beat("b13b"):
            show_title("派生出来的")
            db = VGroup(card(5.2, 1.0),
                        code("name / within / born_in ...", size=22, color=T.muted))
            db[1].move_to(db[0].get_center())
            db.move_to([0, -1.6, 0])
            arr1 = Arrow(n1.get_bottom(), db.get_top() + LEFT * 1.2,
                         color=T.yellow, stroke_width=4)
            arr2 = Arrow(n2.get_bottom(), db.get_top() + RIGHT * 1.2,
                         color=T.yellow, stroke_width=4)
            lab = txt("派生", size=24, color=T.yellow, bold=True).move_to([4.6, -0.5, 0])
            self.play(FadeIn(db, shift=UP * 0.15), run_time=0.9)
            self.play(Create(arr1), Create(arr2), FadeIn(lab, shift=LEFT * 0.1), run_time=1.1)

        # ---------- b14a 规则搭积木 ----------
        with b.beat("b14a"):
            show_title("规则搭积木")
            self.play(FadeOut(n1), FadeOut(n2), FadeOut(db), FadeOut(arr1),
                      FadeOut(arr2), FadeOut(lab), run_time=0.5)
            blk1 = VGroup(card(4.2, 0.9), txt("规则一", size=26, bold=True, color=T.blue))
            blk1[1].move_to(blk1[0].get_center())
            blk1.move_to([0, -1.9, 0])
            blk2 = VGroup(card(4.2, 0.9), txt("规则二", size=26, bold=True, color=T.green))
            blk2[1].move_to(blk2[0].get_center())
            blk2.move_to([0, -0.85, 0])
            blk3 = VGroup(card(4.2, 0.9), txt("规则三", size=26, bold=True, color=T.purple))
            blk3[1].move_to(blk3[0].get_center())
            blk3.move_to([0, 0.2, 0])
            self.play(FadeIn(blk1, shift=UP * 0.15), run_time=0.9)
            self.play(FadeIn(blk2, shift=DOWN * 0.15), run_time=0.9)
            self.play(FadeIn(blk3, shift=DOWN * 0.15), run_time=0.9)
            self.wait(1.2)
            self.play(Circumscribe(VGroup(blk1, blk2, blk3), run_time=1.0), run_time=1.0)

        # ---------- b14b 一次搭一小块 ----------
        with b.beat("b14b"):
            show_title("一次搭一小块")
            flag = txt("▲", size=30, color=T.yellow).next_to(blk3, UP, buff=0.15)
            self.play(FadeIn(flag, shift=DOWN * 0.1), run_time=0.8)
            self.play(Circumscribe(VGroup(blk1, blk2, blk3), run_time=0.9), run_time=0.9)

        # ---------- b15a 大写字母是变量 ----------
        with b.beat("b15a"):
            show_title("大写字母是变量")
            self.play(FadeOut(blk1), FadeOut(blk2), FadeOut(blk3), FadeOut(flag),
                      run_time=0.5)
            rule = code("within_recursive(Location, Name) :- name(Location, Name).",
                        size=24).move_to([0, 0.6, 0])
            self.play(FadeIn(rule, shift=UP * 0.1), run_time=1.0)
            box_loc = SurroundingRectangle(rule, color=T.yellow, buff=0.08)
            self.play(Create(box_loc), run_time=0.8)
            self.play(Indicate(rule, scale_factor=1.03), run_time=0.7)

        # ---------- b15b 两个变量 ----------
        with b.beat("b15b"):
            show_title("变量要绑定")
            self.play(FadeOut(box_loc), FadeOut(rule), run_time=0.4)
            nm = code("name(Location, Name)", size=32).move_to([0, 0.6, 0])
            t1 = txt("变量", size=22, color=T.yellow).move_to([-1.9, -0.4, 0])
            t2 = txt("变量", size=22, color=T.yellow).move_to([1.3, -0.4, 0])
            self.play(FadeIn(nm, shift=UP * 0.1), run_time=0.9)
            self.play(FadeIn(t1, shift=UP * 0.1), FadeIn(t2, shift=UP * 0.1), run_time=0.9)

        # ---------- b15c 绑定 ----------
        with b.beat("b15c"):
            show_title("地点与名字")
            fact = code("name(namerica, 'North America')", size=28, color=T.blue).move_to([0, -1.8, 0])
            self.play(FadeIn(fact, shift=UP * 0.1), run_time=1.0)
            b1a = Arrow([-1.9, -0.7, 0], [-2.6, -1.4, 0], color=T.yellow, stroke_width=4)
            b2a_ = Arrow([1.3, -0.7, 0], [1.6, -1.4, 0], color=T.yellow, stroke_width=4)
            self.play(Create(b1a), run_time=0.8)
            self.play(Create(b2a_), run_time=0.8)
            bind = code("Location = namerica   Name = 'North America'", size=22,
                        color=T.green).move_to([0, -2.9, 0])
            self.play(FadeIn(bind, shift=UP * 0.1), run_time=0.9)

        # ---------- b16a 适用条件 ----------
        with b.beat("b16a"):
            show_title("条件全满足才适用")
            self.play(FadeOut(nm), FadeOut(t1), FadeOut(t2), FadeOut(fact),
                      FadeOut(b1a), FadeOut(b2a_), FadeOut(bind), run_time=0.5)
            r2line = code("within_recursive(Location, Name) :-", size=26).move_to([0, 1.6, 0])
            c1 = code("within(Location, Via),", size=26, color=T.blue).move_to([0, 0.5, 0])
            c2 = code("within_recursive(Via, Name).", size=26, color=T.green).move_to([0, -0.6, 0])
            self.play(FadeIn(r2line, shift=UP * 0.1), run_time=0.8)
            self.play(FadeIn(c1, shift=RIGHT * 0.15), run_time=0.8)
            tick1 = txt("✓", size=30, color=T.green).next_to(c1, RIGHT, buff=0.4)
            self.play(FadeIn(tick1, scale=1.3), run_time=0.6)
            self.play(FadeIn(c2, shift=RIGHT * 0.15), run_time=0.8)
            tick2 = txt("✓", size=30, color=T.green).next_to(c2, RIGHT, buff=0.4)
            self.play(FadeIn(tick2, scale=1.3), run_time=0.6)

        # ---------- b16b 结论加进数据库 ----------
        with b.beat("b16b"):
            show_title("结论加进数据库")
            concl = code("within_recursive(Location, Name)", size=26, color=T.yellow).move_to([0, -1.8, 0])
            self.play(FadeIn(concl, shift=UP * 0.1), run_time=1.0)
            dbline = code("→ 加进数据库", size=24, color=T.green).next_to(concl, DOWN, buff=0.3)
            self.play(FadeIn(dbline, shift=UP * 0.1), run_time=1.0)
            self.play(Indicate(concl, scale_factor=1.04), run_time=1.0)
            self.wait(0.5)
            self.wait(1.0)
            self.play(Indicate(dbline, scale_factor=1.05), run_time=0.9)
