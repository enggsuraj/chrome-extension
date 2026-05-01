#!/usr/bin/env python3
"""Generate CalmScreen toolbar PNGs.

Produces icons/icon-{16,32,48,128}.png. Requires Pillow:
    pip install pillow

Design: a "Resting Eye" — a calm closed-eye lid curve with short lashes
hanging beneath, on a rounded square with the cool→warm gradient that
mirrors the extension's Day → Evening → Night spectrum.
"""
from __future__ import annotations

import math
from pathlib import Path

try:
    from PIL import Image, ImageDraw
except ImportError:
    raise SystemExit("Install Pillow: pip install pillow") from None

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "icons"

# Palette (matches popup.css --accent-grad)
C1 = (91, 141, 239)    # #5b8def — cool blue
C2 = (167, 139, 250)   # #a78bfa — soft purple
C3 = (232, 155, 90)    # #e89b5a — warm amber

# Lash anchor points on the 128px design grid: (x, y_top, x_bottom, y_bottom).
LASHES_128 = [
    (36, 78, 32, 86),
    (50, 84, 48, 94),
    (64, 86, 64, 96),
    (78, 84, 80, 94),
    (92, 78, 96, 86),
]


def lerp(a, b, t):
    return tuple(round(a[i] + (b[i] - a[i]) * t) for i in range(3))


def diagonal_gradient(size: int) -> Image.Image:
    """3-stop diagonal gradient (top-left → middle → bottom-right)."""
    grad = Image.new("RGB", (size, size))
    px = grad.load()
    denom = max(1, 2 * (size - 1))
    for y in range(size):
        for x in range(size):
            t = (x + y) / denom
            if t < 0.55:
                col = lerp(C1, C2, t / 0.55)
            else:
                col = lerp(C2, C3, (t - 0.55) / 0.45)
            px[x, y] = col
    return grad


def rounded_mask(size: int, radius: int) -> Image.Image:
    mask = Image.new("L", (size, size), 0)
    ImageDraw.Draw(mask).rounded_rectangle(
        [0, 0, size - 1, size - 1], radius=radius, fill=255
    )
    return mask


def render_icon(size: int) -> Image.Image:
    """Compose: gradient bg → eyelid curve → lashes."""
    rad = max(3, round(size * 0.22))
    grad = diagonal_gradient(size)
    out = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    out.paste(grad, (0, 0), rounded_mask(size, rad))

    s = size / 128.0
    draw = ImageDraw.Draw(out)

    # ---- Eyelid curve ----
    # The SVG path "M22 64 Q64 92 106 64" is a quadratic Bézier — at t=0.5 it
    # passes through (64, 78). Three points (22,64), (64,78), (106,64) lie on
    # a circle whose center is at (64, 8) with radius 70 (solved analytically
    # from the perpendicular bisector). We render that circular arc with
    # ImageDraw.arc, which gives a perfectly smooth curve at any size.
    cx, cy, r = 64 * s, 8 * s, 70 * s
    bbox = (cx - r, cy - r, cx + r, cy + r)
    # Arc spans the angles that hit the start (22,64) and end (106,64).
    # Computed: atan2(56, ±42). PIL's arc uses image-space degrees (CW from east).
    start_deg = math.degrees(math.atan2(56, 42))   # ≈ 53.13°
    end_deg = math.degrees(math.atan2(56, -42))    # ≈ 126.87°

    lid_w = max(2, round(6 * s))
    draw.arc(bbox, start=start_deg, end=end_deg, fill=(255, 255, 255, 255), width=lid_w)

    # ---- Lashes ----
    # At very small sizes the 5 thin lines blur into the lid — render only
    # 3 stronger lashes for 16px so the eye reads cleanly in the toolbar.
    if size < 24:
        lashes = [LASHES_128[0], LASHES_128[2], LASHES_128[4]]
        lash_w = max(2, round(5 * s))
    else:
        lashes = LASHES_128
        lash_w = max(2, round(4 * s))

    for x1, y1, x2, y2 in lashes:
        draw.line(
            [(x1 * s, y1 * s), (x2 * s, y2 * s)],
            fill=(255, 255, 255, 255),
            width=lash_w,
        )

    return out


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for size in (16, 32, 48, 128):
        im = render_icon(size)
        path = OUT / f"icon-{size}.png"
        im.save(path)
        print(f"Wrote {path}")


if __name__ == "__main__":
    main()
