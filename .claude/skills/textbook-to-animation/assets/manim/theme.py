"""全书统一视觉（Manim 版）。复制到 manim/theme.py；与 assets/motion-canvas/theme.ts 保持同步。

场景里不要再写十六进制色值，一律从这里取。
"""
from types import SimpleNamespace

from manim import BOLD, NORMAL, Text

T = SimpleNamespace(
    bg="#0F172A",
    card="#1E293B",
    text="#E2E8F0",
    white="#FFFFFF",
    muted="#94A3B8",
    line="#475569",
    blue="#38BDF8",
    green="#34D399",
    red="#F87171",
    yellow="#FBBF24",
    purple="#A78BFA",
)

# 颜色语义：与 MC 一致
SEM = SimpleNamespace(normal=T.blue, ok=T.green, bad=T.red, accent=T.yellow, meta=T.purple)

FONT = "Noto Sans CJK SC"
FONT_SERIF = "Noto Serif CJK SC"

# Manim 画面宽 14.22 单位 ≈ 1280px；安全区左右各留约 0.67 单位（60px）
SAFE_WIDTH = 12.9


def txt(s, size=30, color=T.text, bold=False, font=FONT, max_width=SAFE_WIDTH):
    """中文和 Unicode 公式统一用 Pango Text（无需 LaTeX）；超宽时等比缩小到安全区内。"""
    m = Text(s, font=font, font_size=size, color=color, weight=BOLD if bold else NORMAL)
    if m.width > max_width:
        m.scale_to_fit_width(max_width)
    return m
