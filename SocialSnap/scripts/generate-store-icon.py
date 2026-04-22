#!/usr/bin/env python3
"""Generate the 128x128 store-listing icon for the Chrome Web Store.

The store icon should leave ~12–16px of transparent padding around the art
so Chrome's own masking at smaller render sizes doesn't clip the artwork.
This builds a 96x96 SocialSnap tile centered in a 128x128 transparent canvas.

Output: SocialSnap/store-assets/icon-store-128.png

Requires: pip install pillow
"""
from __future__ import annotations

from pathlib import Path

try:
    from PIL import Image, ImageDraw
except ImportError:
    raise SystemExit("Install Pillow: pip install pillow") from None

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "store-assets" / "icon-store-128.png"

# Brand gradient endpoints (matches popup.css --accent-grad)
C1 = (124, 92, 255)   # #7c5cff (violet)
C2 = (14, 165, 233)   # #0ea5e9 (sky)


def lerp(a: int, b: int, t: float) -> int:
    return round(a + (b - a) * t)


def gradient_tile(size: int, radius: int) -> Image.Image:
    """Rounded-rect tile with a diagonal violet -> sky gradient."""
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
    mask = Image.new("L", (size, size), 0)
    ImageDraw.Draw(mask).rounded_rectangle(
        [0, 0, size - 1, size - 1], radius=radius, fill=255
    )
    out = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    out.paste(grad, (0, 0), mask)
    return out


def render_tile(size: int) -> Image.Image:
    """Render the SocialSnap tile (gradient square + share glyph) at `size`."""
    rad = max(3, round(size * 0.22))
    base = gradient_tile(size, rad)
    draw = ImageDraw.Draw(base)

    s = size / 128.0
    # Share-network glyph: 3 nodes connected by lines, sized for 128px base.
    nodes = [
        (round(90 * s), round(32 * s)),  # top-right
        (round(36 * s), round(64 * s)),  # middle-left
        (round(90 * s), round(96 * s)),  # bottom-right
    ]
    r = max(2, round(11 * s))
    lw = max(2, round(6 * s))

    # Connecting lines
    draw.line([nodes[1], nodes[0]], fill=(255, 255, 255, 235), width=lw)
    draw.line([nodes[1], nodes[2]], fill=(255, 255, 255, 235), width=lw)

    # Nodes
    for cx, cy in nodes:
        draw.ellipse(
            [cx - r, cy - r, cx + r, cy + r],
            fill=(255, 255, 255, 255),
        )
    return base


def main() -> None:
    OUT.parent.mkdir(parents=True, exist_ok=True)

    # 128x128 transparent canvas with a 96x96 tile centered (16px padding each side).
    canvas = Image.new("RGBA", (128, 128), (0, 0, 0, 0))
    tile = render_tile(96)
    canvas.paste(tile, (16, 16), tile)

    canvas.save(OUT)
    print("Wrote", OUT)


if __name__ == "__main__":
    main()
