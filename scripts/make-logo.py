#!/usr/bin/env python3
"""Render the OPTQVO mark (hexagon ring + right notch + tapered tail).

All geometry is defined once here so the PNG variants and the SVG stay in sync.
Run: python3 scripts/make-logo.py
"""
import math
from pathlib import Path

from PIL import Image, ImageDraw

PUBLIC = Path(__file__).resolve().parent.parent / "public"

# --- geometry (unit square, 120 x 120) -------------------------------------
VIEW = 120.0
CX, CY = 58.0, 58.0          # ring centre
R = 39.0                     # ring radius
STROKE = 17.0                # ring weight
NOTCH = 15.0                 # square tab on the inner right edge

# pointy-top hexagon: vertices every 60 degrees starting at the top
ANGLES = [90, 150, 210, 270, 330, 30]
HEX = [
    (CX + R * math.cos(math.radians(a)), CY - R * math.sin(math.radians(a)))
    for a in ANGLES
]

# the tail tapers from the lower-left edge down to a sharp point
TAIL = [
    (27.0, 74.0),
    (11.0, 108.0),   # sharp tip
    (45.0, 96.0),
]

NOTCH_RECT = (CX + R - NOTCH - STROKE / 2 - 2, CY - NOTCH / 2,
              CX + R - STROKE / 2 + 2, CY + NOTCH / 2)

GRADIENT_TOP = (124, 77, 255)     # purple
GRADIENT_BOTTOM = (47, 107, 255)  # blue
WHITE = (255, 255, 255)

SS = 8  # supersampling factor


def build_mask(size: int) -> Image.Image:
    px = int(size * SS)
    scale = px / VIEW
    mask = Image.new("L", (px, px), 0)
    draw = ImageDraw.Draw(mask)

    ring = [(x * scale, y * scale) for x, y in HEX]
    draw.line(ring + [ring[0]], fill=255, width=int(STROKE * scale), joint="curve")
    # round the joins explicitly so the corners match the reference art
    r = STROKE * scale / 2
    for x, y in ring:
        draw.ellipse((x - r, y - r, x + r, y + r), fill=255)

    nx0, ny0, nx1, ny1 = (v * scale for v in NOTCH_RECT)
    draw.rectangle((nx0, ny0, nx1, ny1), fill=255)

    tail = [(x * scale, y * scale) for x, y in TAIL]
    draw.polygon(tail, fill=255)
    # blend the tail into the ring so there is no seam
    draw.line([(27.0 * scale, 76.0 * scale), (20.0 * scale, 92.0 * scale)],
              fill=255, width=int(15 * scale))

    return mask.resize((size, size), Image.LANCZOS)


def gradient(size: int) -> Image.Image:
    grad = Image.new("RGB", (1, size))
    for y in range(size):
        t = y / max(size - 1, 1)
        grad.putpixel((0, y), tuple(
            round(GRADIENT_TOP[i] + (GRADIENT_BOTTOM[i] - GRADIENT_TOP[i]) * t)
            for i in range(3)
        ))
    return grad.resize((size, size), Image.BILINEAR)


def render(size: int, color=None, gradient_fill=False) -> Image.Image:
    mask = build_mask(size)
    if gradient_fill:
        base = gradient(size)
    else:
        base = Image.new("RGB", (size, size), color)
    out = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    out.paste(base, (0, 0), mask)
    return out


def write_svg() -> None:
    pts = " ".join(f"{x:.1f},{y:.1f}" for x, y in HEX)
    tail = " ".join(f"{x:.1f},{y:.1f}" for x, y in TAIL)
    svg = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" fill="none">
  <defs>
    <linearGradient id="optqvo" x1="0" y1="0" x2="0.35" y2="1">
      <stop offset="0" stop-color="#7c4dff"/>
      <stop offset="1" stop-color="#2f6bff"/>
    </linearGradient>
  </defs>
  <polygon points="{pts}" stroke="url(#optqvo)" stroke-width="{STROKE}" stroke-linejoin="round"/>
  <rect x="{NOTCH_RECT[0]:.1f}" y="{NOTCH_RECT[1]:.1f}" width="{NOTCH_RECT[2] - NOTCH_RECT[0]:.1f}" height="{NOTCH_RECT[3] - NOTCH_RECT[1]:.1f}" fill="url(#optqvo)"/>
  <polygon points="{tail}" fill="url(#optqvo)"/>
</svg>
"""
    (PUBLIC / "optqvo-mark.svg").write_text(svg)


def main() -> None:
    PUBLIC.mkdir(exist_ok=True)
    render(512, gradient_fill=True).save(PUBLIC / "logo-brand.png")
    render(512, WHITE).save(PUBLIC / "logo-light.png")
    render(180, gradient_fill=True).save(PUBLIC / "apple-touch-icon.png")
    render(64, gradient_fill=True).save(PUBLIC / "favicon-64.png")
    render(32, gradient_fill=True).save(PUBLIC / "favicon-32.png")
    write_svg()
    for name in ("logo-brand.png", "logo-light.png", "apple-touch-icon.png",
                 "favicon-64.png", "favicon-32.png", "optqvo-mark.svg"):
        print(f"{name:24} {(PUBLIC / name).stat().st_size:>7} bytes")


if __name__ == "__main__":
    main()
