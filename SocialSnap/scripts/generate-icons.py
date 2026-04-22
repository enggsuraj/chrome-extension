#!/usr/bin/env python3
"""Generate SocialSnap toolbar PNGs. Requires: pip install pillow"""
from __future__ import annotations

from pathlib import Path

try:
    from PIL import Image, ImageDraw
except ImportError:
    raise SystemExit("Install Pillow: pip install pillow") from None

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "icons"

# Brand gradient endpoints (matches popup.css --accent / --accent-2)
C1 = (124, 92, 255)    # #7c5cff
C2 = (48, 213, 200)    # #30d5c8


def lerp(a: int, b: int, t: float) -> int:
    return round(a + (b - a) * t)


def gradient_tile(size: int, radius: int) -> Image.Image:
    """Rounded-rect tile with a diagonal purple->teal gradient."""
    # Diagonal gradient: t = (x + y) / (2*size)
    grad = Image.new("RGB", (size, size))
    px = grad.load()
    denom = max(1, 2 * (size - 1))
    for y in range(size):
        for x in range(size):
            t = (x + y) / denom
            px[x, y] = (
                lerp(C1[0], C2[0], t),
                lerp(C1[1], C2[1], t),
                lerp(C1[2], C2[2], t),
            )
    # Rounded mask
    mask = Image.new("L", (size, size), 0)
    ImageDraw.Draw(mask).rounded_rectangle(
        [0, 0, size - 1, size - 1], radius=radius, fill=255
    )
    out = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    out.paste(grad, (0, 0), mask)
    return out


def render_icon(size: int) -> Image.Image:
    rad = max(3, round(size * 0.22))
    base = gradient_tile(size, rad)
    draw = ImageDraw.Draw(base)

    s = size / 128.0
    # Share-network glyph: 3 nodes connected by lines
    nodes = [
        (round(90 * s), round(32 * s)),  # top-right
        (round(36 * s), round(64 * s)),  # middle-left
        (round(90 * s), round(96 * s)),  # bottom-right
    ]
    r = max(2, round(11 * s))
    lw = max(2, round(6 * s))

    # Lines
    draw.line([nodes[1], nodes[0]], fill=(255, 255, 255, 235), width=lw)
    draw.line([nodes[1], nodes[2]], fill=(255, 255, 255, 235), width=lw)

    # Nodes (white fill, subtle shadow)
    for cx, cy in nodes:
        draw.ellipse(
            [cx - r, cy - r, cx + r, cy + r],
            fill=(255, 255, 255, 255),
        )
    return base


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for size in (16, 32, 48, 128):
        im = render_icon(size)
        path = OUT / f"icon-{size}.png"
        im.save(path)
        print("Wrote", path)


if __name__ == "__main__":
    main()
