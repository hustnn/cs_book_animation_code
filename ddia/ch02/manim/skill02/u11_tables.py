"""U11 Datalog 场景 B（b17–b27b）：三张表逐轮长行 + 规则三 + 收束。

分镜：ch02/skill-ch02/beats-u11.md；原文：DDIA §2.15（书 p60–62，PDF p83–84）。
原图 Figure 2-6（PDF p84）读法：三张 within_recursive 表，表头 Location / Name；
表 1（规则一之后）3 行：namerica / North America、usa / United States、idaho / Idaho；
表 2（规则二一次之后）5 行：namerica / North America、usa / North America（新）、
usa / United States、idaho / United States（新）、idaho / Idaho；
表 3（规则二两次之后）6 行：namerica / North America、usa / North America、
idaho / North America（新）、usa / United States、idaho / United States、idaho / Idaho。
行序：先按名字分三组（北美洲、美国、爱达荷），组内按地点链排列。
虚线连对应行；椭圆标出匹配的事实 within(usa, namerica)、within(idaho, usa)。
画面不贴原图截图，全部重画；旁白、画面、字幕里不出现书页、图号、“书里/原图/原表/Part”、单元编号。

渲染（在 ch02/manim/ 目录下，须先拿渲染锁，拿锁失败绝不渲染）：
  .venv/bin/manim -qm skill02/u11_tables.py U11Tables
产物：media/videos/u11_tables/720p30/U11Tables.mp4（1280x720 30fps）
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
TABLE_TOP_Y = 2.75
ROW_H = 0.55
COL_LOC_X = -2.15
COL_NAME_X = -0.15
TABLE_W = 4.6


def code(s, size=26, color=T.text, bold=False):
    return Text(s, font=MONO, font_size=size, color=color,
                weight=BOLD if bold else NORMAL)


def title_mob(s):
    return txt(s, size=26, color=T.yellow, bold=True).move_to([0, TITLE_Y, 0])


def card(w, h, color=T.card):
    return RoundedRectangle(
        corner_radius=0.12, width=w, height=h,
        fill_color=color, fill_opacity=1, stroke_color=T.line, stroke_width=2,
    )


class RTable:
    """within_recursive 表（按原图读法重画）。

    局部坐标：表顶 y=0；表名 within_recursive 在 y=-0.15；
    列头 Location / Name 在 y=-0.6；横线 y=-0.85；
    第 i 行中心 y=-1.13-i*ROW_H；底线在最后一行下 0.28。
    """

    def __init__(self, rows, new=()):
        self.rows_data = list(rows)
        self.new = set(new)
        self._scale = 1.0
        self.group = VGroup()
        self.row_mobs = []
        self._build()

    def _row_y(self, i):
        return -1.13 - i * ROW_H

    def _bottom_y(self):
        return self._row_y(len(self.rows_data) - 1) - 0.28

    def _make_row(self, i, loc, name, is_new):
        y = self._row_y(i)
        bg = Rectangle(width=TABLE_W, height=ROW_H, fill_color=T.card,
                       fill_opacity=0.95 if is_new else 0, stroke_width=0)
        bg.move_to([0, y, 0])
        lc = code(loc, size=20, color=T.green if is_new else T.text)
        lc.move_to([COL_LOC_X, y, 0], aligned_edge=LEFT)
        nc = code(name, size=20, color=T.green if is_new else T.text)
        nc.move_to([COL_NAME_X, y, 0], aligned_edge=LEFT)
        return VGroup(bg, lc, nc)

    def _build(self):
        g = VGroup()
        t = code("within_recursive", size=20, color=T.yellow, bold=True)
        t.move_to([0, -0.15, 0])
        h1 = code("Location", size=18, color=T.muted)
        h1.move_to([COL_LOC_X, -0.6, 0], aligned_edge=LEFT)
        h2 = code("Name", size=18, color=T.muted)
        h2.move_to([COL_NAME_X, -0.6, 0], aligned_edge=LEFT)
        hl = Line([-TABLE_W / 2, -0.85, 0], [TABLE_W / 2, -0.85, 0],
                  color=T.line, stroke_width=2)
        self.topline = hl
        self.bottomline = Line([-TABLE_W / 2, self._bottom_y(), 0],
                               [TABLE_W / 2, self._bottom_y(), 0],
                               color=T.line, stroke_width=2)
        g.add(t, h1, h2, hl, self.bottomline)
        self.row_mobs = [self._make_row(i, loc, name, i in self.new)
                         for i, (loc, name) in enumerate(self.rows_data)]
        for rm in self.row_mobs:
            g.add(rm)
        self.group = g

    def place(self, x, scale=1.0):
        self._scale = scale
        self.group.scale(scale)
        self.group.move_to([x, TABLE_TOP_Y, 0], aligned_edge=UP)
        return self.group

    def row_below(self, prev_row):
        """新行应放的位置：上一行正下方一行高（按表当前缩放后的绝对尺寸）。"""
        return prev_row.get_center() + DOWN * ROW_H * self._scale


class U11Tables(Scene):
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

        def caption_above(table, text, size=20):
            cap = txt(text, size=size, color=T.muted)
            cap.next_to(table.group, UP, buff=0.12)
            return cap

        T1_ROWS = [("namerica", "North America"),
                   ("usa", "United States"),
                   ("idaho", "Idaho")]
        T2_ROWS = [("namerica", "North America"),
                   ("usa", "North America"),
                   ("usa", "United States"),
                   ("idaho", "United States"),
                   ("idaho", "Idaho")]
        T3_ROWS = [("namerica", "North America"),
                   ("usa", "North America"),
                   ("idaho", "North America"),
                   ("usa", "United States"),
                   ("idaho", "United States"),
                   ("idaho", "Idaho")]

        dashes = []   # 虚线连接
        arrows = []   # 实线弯箭头
        overlays = []  # 椭圆、标题、行数标签（b24 时统一清掉）

        def clear_dashes_arrows():
            nonlocal dashes, arrows
            if dashes or arrows:
                self.play(*[FadeOut(m) for m in dashes + arrows], run_time=0.4)
            dashes, arrows = [], []

        # ---------- b17 第一步：表 1 第一行 ----------
        with b.beat("b17"):
            show_title("第一步：规则一")
            t1 = RTable([T1_ROWS[0]])
            t1.place(0, scale=1.0)
            self.play(FadeIn(t1.group, shift=UP * 0.1), run_time=0.8)
            rule1 = code("规则一：within_recursive(Location, Name) :- name(Location, Name).",
                         size=20, color=T.blue).move_to([0, -2.6, 0])
            self.play(FadeIn(rule1, shift=UP * 0.1), run_time=0.9)
            self.play(Indicate(t1.row_mobs[0], scale_factor=1.05), run_time=0.8)
            self.wait(1.5)
            self.play(Indicate(rule1, scale_factor=1.03), run_time=0.8)
            overlays.append(rule1)

        # ---------- b18a 三行长齐 ----------
        with b.beat("b18a"):
            show_title("三行长齐")
            for k in (1, 2):
                t1.rows_data.append(T1_ROWS[k])
                rm = t1._make_row(k, T1_ROWS[k][0], T1_ROWS[k][1], False)
                rm.move_to(t1.row_below(t1.row_mobs[-1]))
                t1.row_mobs.append(rm)
                t1.group.add(rm)
                t1.bottomline.shift(DOWN * ROW_H * t1._scale)
                self.play(FadeIn(rm, shift=UP * 0.1), run_time=1.0)

        # ---------- b18b 名字就是包含 ----------
        with b.beat("b18b"):
            show_title("名字就是包含")
            cap1 = caption_above(t1, "用过规则一之后")
            self.play(FadeIn(cap1, shift=DOWN * 0.1), run_time=0.8)
            overlays.append(cap1)
            for rm in t1.row_mobs:
                self.play(Indicate(rm, scale_factor=1.04), run_time=0.7)

        # ---------- b19a 第二步：椭圆 within(usa, namerica) ----------
        with b.beat("b19a"):
            show_title("第二步：规则二")
            self.play(FadeOut(rule1), run_time=0.5)
            overlays.remove(rule1)
            ell1 = VGroup(Ellipse(width=3.0, height=0.75, color=T.yellow, stroke_width=3),
                          code("within(usa, namerica)", size=18, color=T.yellow))
            ell1[1].move_to(ell1[0].get_center())
            ell1.move_to([3.9, -1.6, 0])
            self.play(FadeIn(ell1, shift=UP * 0.1), run_time=1.0)
            self.play(Indicate(t1.row_mobs[0], scale_factor=1.05), run_time=0.9)
            self.wait(1.2)
            self.play(Circumscribe(ell1, run_time=0.9), run_time=0.9)
            overlays.append(ell1)

        # ---------- b19b 表 2 出现，新行 usa / North America ----------
        with b.beat("b19b"):
            show_title("美国在北美洲里")
            t2 = RTable(T2_ROWS, new={1, 3})
            t2.group.scale(0.85)
            t2._scale = 0.85
            t2.group.move_to([3.4, TABLE_TOP_Y, 0], aligned_edge=UP)
            self.play(t1.group.animate.scale(0.85).move_to([-3.4, TABLE_TOP_Y, 0], aligned_edge=UP),
                      cap1.animate.move_to([-3.4, TABLE_TOP_Y + 0.3, 0]),
                      run_time=0.8)
            t1._scale = 0.85
            # 表 2 先出已有行，两行新行随后逐个长出
            new_row = t2.row_mobs[1]
            hidden_row = t2.row_mobs[3]
            t2.group.remove(new_row, hidden_row)
            self.play(FadeIn(t2.group, shift=UP * 0.1), run_time=0.8)
            t2.group.add(new_row)
            self.play(FadeIn(new_row, shift=UP * 0.1), run_time=0.8)
            # 椭圆移到两表之间下方，箭头指向新行
            self.play(ell1.animate.move_to([0, -2.4, 0]), run_time=0.7)
            ar = CurvedArrow(ell1.get_top(), new_row.get_left() + LEFT * 0.1,
                             angle=-TAU / 4, color=T.yellow, stroke_width=4)
            self.play(Create(ar), run_time=0.8)
            arrows.append(ar)
            # 对应行虚线：t1 行 0/1/2 → t2 行 0/2/4
            for a, bb in ((0, 0), (1, 2), (2, 4)):
                dl = DashedLine(t1.row_mobs[a].get_right(), t2.row_mobs[bb].get_left(),
                                color=T.muted, dash_length=0.12)
                dashes.append(dl)
            self.play(*[Create(d) for d in dashes], run_time=0.8)

        # ---------- b20a 一轮不只一行 ----------
        with b.beat("b20a"):
            show_title("一轮不只一行")
            ell2 = VGroup(Ellipse(width=2.8, height=0.75, color=T.yellow, stroke_width=3),
                          code("within(idaho, usa)", size=18, color=T.yellow))
            ell2[1].move_to(ell2[0].get_center())
            ell2.move_to([0, -3.3, 0])
            self.play(FadeIn(ell2, shift=UP * 0.1), run_time=0.9)
            self.play(Indicate(t2.row_mobs[1], scale_factor=1.05), run_time=0.9)
            overlays.append(ell2)

        # ---------- b20b 新行 idaho / United States 长出 ----------
        with b.beat("b20b"):
            show_title("爱达荷也在美国里")
            t2.group.add(hidden_row)
            self.play(FadeIn(hidden_row, shift=UP * 0.1), run_time=1.0)
            ar2 = CurvedArrow(ell2.get_top(), hidden_row.get_left() + LEFT * 0.1,
                              angle=-TAU / 4, color=T.yellow, stroke_width=4)
            self.play(Create(ar2), run_time=0.9)
            arrows.append(ar2)

        # ---------- b20c 一共五行 ----------
        with b.beat("b20c"):
            show_title("一共五行")
            for i in (1, 3):
                self.play(Indicate(t2.row_mobs[i], scale_factor=1.06), run_time=0.7)
            cnt2 = txt("共 5 行", size=22, color=T.yellow, bold=True)
            cnt2.next_to(t2.group, DOWN, buff=0.15)
            self.play(FadeIn(cnt2, shift=UP * 0.1), run_time=0.8)
            overlays.append(cnt2)

        # ---------- b21 第三步：表 3 出现，新行 idaho / North America ----------
        with b.beat("b21"):
            show_title("爱达荷在北美洲里")
            clear_dashes_arrows()
            self.play(FadeOut(cnt2), run_time=0.3)
            overlays.remove(cnt2)
            t3 = RTable(T3_ROWS, new={2})
            # 三表并排：t1、t2 缩到 0.72，t3 在右侧出现
            self.play(
                t1.group.animate.scale(0.72 / 0.85).move_to([-4.5, TABLE_TOP_Y, 0], aligned_edge=UP),
                t2.group.animate.scale(0.72 / 0.85).move_to([0, TABLE_TOP_Y, 0], aligned_edge=UP),
                cap1.animate.move_to([-4.5, TABLE_TOP_Y + 0.3, 0]),
                run_time=0.9)
            t1._scale = 0.72
            t2._scale = 0.72
            # 先把表 3 缩放到位，再取出新行（否则新行会留在局部坐标处漂移）
            t3.group.scale(0.72)
            t3._scale = 0.72
            t3.group.move_to([4.5, TABLE_TOP_Y, 0], aligned_edge=UP)
            new3 = t3.row_mobs[2]
            t3.group.remove(new3)
            self.play(FadeIn(t3.group, shift=UP * 0.1), run_time=0.8)
            t3.group.add(new3)
            self.play(FadeIn(new3, shift=UP * 0.1), run_time=0.8)
            # 椭圆 2 移到表 2、表 3 之间下方，箭头指向新行
            self.play(ell2.animate.move_to([2.2, -3.0, 0]), run_time=0.7)
            ar3 = CurvedArrow(ell2.get_top(), new3.get_left() + LEFT * 0.1,
                              angle=-TAU / 4, color=T.yellow, stroke_width=4)
            self.play(Create(ar3), run_time=0.8)
            arrows.append(ar3)
            ar1b = CurvedArrow(ell1.get_top(), t2.row_mobs[1].get_left() + LEFT * 0.1,
                               angle=-TAU / 4, color=T.yellow, stroke_width=4)
            self.play(Create(ar1b), run_time=0.7)
            arrows.append(ar1b)
            # 对应行虚线：t1→t2（0→0，1→2，2→4），t2→t3（0→0，1→1，2→3，3→4，4→5）
            for a, bb in ((0, 0), (1, 2), (2, 4)):
                dashes.append(DashedLine(t1.row_mobs[a].get_right(), t2.row_mobs[bb].get_left(),
                                         color=T.muted, dash_length=0.12))
            for a, bb in ((0, 0), (1, 1), (2, 3), (3, 4), (4, 5)):
                dashes.append(DashedLine(t2.row_mobs[a].get_right(), t3.row_mobs[bb].get_left(),
                                         color=T.muted, dash_length=0.12))
            self.play(*[Create(d) for d in dashes], run_time=1.0)

        # ---------- b22a 三张表并排 ----------
        with b.beat("b22a"):
            show_title("三行、五行、六行")
            cap2 = caption_above(t2, "规则二用一次之后")
            cap3 = caption_above(t3, "规则二用两次之后")
            self.play(FadeIn(cap2, shift=DOWN * 0.1), FadeIn(cap3, shift=DOWN * 0.1),
                      run_time=0.9)
            overlays.extend([cap2, cap3])
            cnt1 = txt("共 3 行", size=20, color=T.yellow, bold=True)
            cnt1.next_to(t1.group, DOWN, buff=0.15)
            cnt2b = txt("共 5 行", size=20, color=T.yellow, bold=True)
            cnt2b.next_to(t2.group, DOWN, buff=0.15)
            cnt3 = txt("共 6 行", size=20, color=T.yellow, bold=True)
            cnt3.next_to(t3.group, DOWN, buff=0.15)
            self.play(FadeIn(cnt1, shift=UP * 0.1), FadeIn(cnt2b, shift=UP * 0.1),
                      FadeIn(cnt3, shift=UP * 0.1), run_time=0.9)
            overlays.extend([cnt1, cnt2b, cnt3])
            self.wait(1.5)
            self.play(Circumscribe(t3.row_mobs[2], run_time=0.9), run_time=0.9)

        # ---------- b22b 答案长在表里 ----------
        with b.beat("b22b"):
            show_title("答案长在表里")
            box = SurroundingRectangle(t3.row_mobs[2], color=T.yellow, buff=0.06)
            self.play(Create(box), run_time=0.8)
            self.play(Indicate(t3.row_mobs[2], scale_factor=1.05), run_time=0.9)
            overlays.append(box)

        # ---------- b23a 北美洲包含的所有地方 ----------
        with b.beat("b23a"):
            show_title("包含的所有地方")
            for rm in (t1.row_mobs[0], t2.row_mobs[1], t3.row_mobs[2]):
                self.play(Indicate(rm, scale_factor=1.06), run_time=0.9)

        # ---------- b23b 换个名字也一样 ----------
        with b.beat("b23b"):
            show_title("换个名字也一样")
            for rm in (t3.row_mobs[3], t3.row_mobs[4]):
                self.play(Indicate(rm, scale_factor=1.06), run_time=0.8)

        # ---------- b24 规则三问法 ----------
        with b.beat("b24"):
            show_title("出生在美国，住在欧洲")
            self.play(FadeOut(t1.group), FadeOut(t2.group), FadeOut(t3.group),
                      *[FadeOut(m) for m in dashes + arrows + overlays], run_time=0.6)
            dashes, arrows, overlays = [], [], []
            r3 = code("migrated(Name, BornIn, LivingIn) :-", size=24).move_to([0, 1.8, 0])
            c1 = code("born_in(Person, BornLoc),  within_recursive(BornLoc, BornIn),",
                      size=22, color=T.blue).move_to([0, 0.7, 0])
            c2 = code("lives_in(Person, LivingLoc),  within_recursive(LivingLoc, LivingIn).",
                      size=22, color=T.blue).move_to([0, -0.2, 0])
            self.play(FadeIn(r3, shift=UP * 0.1), run_time=0.8)
            self.play(FadeIn(c1, shift=RIGHT * 0.15), run_time=0.9)
            self.play(FadeIn(c2, shift=RIGHT * 0.15), run_time=0.9)
            q1 = txt("BornIn = 美国", size=24, color=T.yellow, bold=True).move_to([-3.0, -1.6, 0])
            q2 = txt("LivingIn = 欧洲", size=24, color=T.yellow, bold=True).move_to([3.0, -1.6, 0])
            who = txt("Who = ?", size=28, color=T.yellow, bold=True).move_to([0, -2.7, 0])
            self.play(FadeIn(q1, shift=UP * 0.1), FadeIn(q2, shift=UP * 0.1), run_time=0.9)
            self.play(FadeIn(who, scale=1.2), run_time=0.8)

        # ---------- b25a 查询只有一行 ----------
        with b.beat("b25a"):
            show_title("谁留作变量")
            self.play(FadeOut(r3), FadeOut(c1), FadeOut(c2), FadeOut(q1), FadeOut(q2),
                      FadeOut(who), run_time=0.5)
            q = code("?- migrated(Who, 'United States', 'Europe').", size=26,
                     color=T.yellow).move_to([0, 0.6, 0])
            self.play(FadeIn(q, shift=UP * 0.1), run_time=1.0)
            whobox = SurroundingRectangle(q, color=T.yellow, buff=0.12)
            self.play(Create(whobox), run_time=0.8)
            self.play(Indicate(q, scale_factor=1.03), run_time=0.8)
            self.wait(1.5)
            self.play(Circumscribe(q, run_time=0.9), run_time=0.9)

        # ---------- b25b 答案是露西 ----------
        with b.beat("b25b"):
            show_title("答案是露西")
            ans = VGroup(card(4.4, 1.0), code("Who = 'Lucy'", size=28, bold=True, color=T.green))
            ans[1].move_to(ans[0].get_center())
            ans.move_to([0, -1.5, 0])
            self.play(FadeIn(ans, shift=DOWN * 0.2), run_time=1.1)
            self.play(Circumscribe(ans, run_time=0.9), run_time=0.9)

        # ---------- b26a 规则可以组合复用 ----------
        with b.beat("b26a"):
            show_title("规则可以组合复用")
            self.play(FadeOut(q), FadeOut(whobox), FadeOut(ans), run_time=0.5)
            b1m = VGroup(card(3.6, 0.9), txt("规则一", size=24, bold=True, color=T.blue))
            b1m[1].move_to(b1m[0].get_center())
            b1m.move_to([-4.2, 0.6, 0])
            b2m = VGroup(card(3.6, 0.9), txt("规则二", size=24, bold=True, color=T.green))
            b2m[1].move_to(b2m[0].get_center())
            b2m.move_to([0, 0.6, 0])
            b3m = VGroup(card(3.6, 0.9), txt("规则三", size=24, bold=True, color=T.purple))
            b3m[1].move_to(b3m[0].get_center())
            b3m.move_to([4.2, 0.6, 0])
            self.play(FadeIn(b1m, shift=UP * 0.1), FadeIn(b2m, shift=UP * 0.1),
                      FadeIn(b3m, shift=UP * 0.1), run_time=1.0)
            qb = VGroup(card(4.6, 0.9), txt("另一个查询", size=24, bold=True))
            qb[1].move_to(qb[0].get_center())
            qb.move_to([0, -1.6, 0])
            self.play(FadeIn(qb, shift=UP * 0.1), run_time=0.9)
            self.play(b2m.animate.move_to([0, -0.55, 0]), run_time=0.9)

        # ---------- b26b 数据复杂时更好 ----------
        with b.beat("b26b"):
            show_title("数据复杂时更好")
            once = VGroup(card(4.4, 1.0), txt("一次性查询", size=24, bold=True, color=T.muted))
            once[1].move_to(once[0].get_center())
            once.move_to([-3.4, -2.9, 0])
            cx = VGroup(card(4.4, 1.0), txt("复杂数据", size=24, bold=True, color=T.green))
            cx[1].move_to(cx[0].get_center())
            cx.move_to([3.4, -2.9, 0])
            self.play(FadeIn(once, shift=UP * 0.1), FadeIn(cx, shift=UP * 0.1), run_time=1.0)
            self.play(once.animate.set_opacity(0.4), Circumscribe(cx, run_time=1.0),
                      run_time=1.0)
            self.wait(1.0)
            self.play(Circumscribe(cx, run_time=0.9), run_time=0.9)

        # ---------- b27a 回到开头 ----------
        with b.beat("b27a"):
            show_title("规则自己长出新事实")
            self.play(FadeOut(b1m), FadeOut(b2m), FadeOut(b3m), FadeOut(qb),
                      FadeOut(once), FadeOut(cx), run_time=0.5)
            mini = RTable([("namerica", "North America"),
                           ("usa", "North America"),
                           ("idaho", "North America")], new={2})
            mini.group.scale(0.8)
            mini._scale = 0.8
            mini.group.move_to([0, 2.6, 0], aligned_edge=UP)
            self.play(FadeIn(mini.group, shift=UP * 0.1), run_time=1.0)
            blank_y = mini.group.get_bottom()[1] - 0.45
            blank = DashedLine([-1.8, blank_y, 0], [1.8, blank_y, 0], color=T.muted)
            self.play(Create(blank), run_time=0.9)

        # ---------- b27b 再想一想 ----------
        with b.beat("b27b"):
            show_title("再加一个地点呢？")
            qm = txt("？", size=44, color=T.yellow, bold=True)
            qm.next_to(blank, RIGHT, buff=0.4)
            self.play(FadeIn(qm, scale=1.3), run_time=0.9)
            self.play(Indicate(blank, scale_factor=1.05), run_time=0.9)
            self.wait(0.5)
