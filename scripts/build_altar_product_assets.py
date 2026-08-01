"""Convert the 105 source altar-product PNGs into optimized, git-tracked static assets.

Source: tasks/seeder-alter-customize/product-png-images/product-<group>[-<n>].png (gitignored, 221 MB).
Output: public/assets/images/altar-customizer/products/<slug>/<NN>.png (git-tracked, target <=18 MB).

Per product: image 1 (by source `-n` suffix, or the single file for a 1-image group) becomes
the altar overlay (01.png); the rest become gallery images (02.png..NN.png) in suffix order.
"""

import os
import re
import sys
from PIL import Image

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
SRC_DIR = os.path.join(REPO_ROOT, "tasks", "seeder-alter-customize", "product-png-images")
OUT_DIR = os.path.join(
    os.path.dirname(os.path.abspath(__file__)), "..",
    "public", "assets", "images", "altar-customizer", "products",
)
MAX_SIDE = 900
QUANT_COLORS = 256

# Group -> product slug. Copied verbatim from plan.md's canonical catalog table.
# Group 17 does not exist in the source set.
GROUP_TO_SLUG = {
    18: "bat-huong-men-lam-ve-rong-h20",
    1: "lo-hoa-men-lam-h35",
    2: "lo-hoa-men-lam-h30",
    3: "lo-hoa-men-lam-h20",
    11: "choe-tho-men-lam-h19",
    10: "choe-tho-men-lam-h14",
    15: "bat-sam-men-lam-ve-rong-phuong",
    6: "bat-sam-men-lam-co-nap",
    7: "bat-tho-men-lam-co-nap",
    14: "bat-tho-men-lam-nho",
    8: "nam-ruou-men-lam-h25",
    9: "nam-ruou-men-lam-h20",
    19: "ky-5-chen-men-lam-de-rong",
    16: "ky-3-chen-men-lam-de-rong",
    20: "chen-tho-men-lam-bo-3",
    21: "bo-nam-ruou-ky-chen-men-lam",
    13: "den-dau-tho-men-lam-h28",
    22: "den-dau-tho-men-lam-ve-phuong",
    12: "den-dau-tho-men-lam-doi",
    4: "ong-huong-men-lam-h31",
    5: "ong-huong-men-lam-h25",
    23: "dia-tho-men-lam-d20",
    24: "bo-nam-ruou-ky-chen-men-lam-ve-vang",
    25: "nam-ruou-men-lam-ve-vang-h28",
    26: "doi-hac-tho-men-lam-ve-vang",
}

FILENAME_RE = re.compile(r"^product-(\d+)(?:-(\d+))?\.png$")


def discover_groups():
    """Map group number -> sorted list of (suffix, filename)."""
    groups = {}
    for fname in os.listdir(SRC_DIR):
        m = FILENAME_RE.match(fname)
        if not m:
            continue
        group = int(m.group(1))
        suffix = int(m.group(2)) if m.group(2) else 1
        groups.setdefault(group, []).append((suffix, fname))
    for group in groups:
        groups[group].sort()
    return groups


def convert_one(src_path, dst_path):
    im = Image.open(src_path).convert("RGBA")
    bbox = im.getbbox()
    if bbox:
        im = im.crop(bbox)
    w, h = im.size
    longest = max(w, h)
    if longest > MAX_SIDE:
        scale = MAX_SIDE / longest
        im = im.resize((max(1, round(w * scale)), max(1, round(h * scale))), Image.LANCZOS)
    im = im.quantize(colors=QUANT_COLORS, method=Image.Quantize.FASTOCTREE)
    os.makedirs(os.path.dirname(dst_path), exist_ok=True)
    im.save(dst_path, optimize=True)
    return im.size


def main():
    groups = discover_groups()
    missing = set(GROUP_TO_SLUG) - set(groups)
    if missing:
        print(f"ERROR: groups in mapping but not found on disk: {sorted(missing)}", file=sys.stderr)
        sys.exit(1)
    extra = set(groups) - set(GROUP_TO_SLUG)
    if extra:
        print(f"ERROR: groups found on disk but not in mapping: {sorted(extra)}", file=sys.stderr)
        sys.exit(1)

    total_bytes = 0
    file_count = 0
    overlay_sizes = {}
    for group, slug in sorted(GROUP_TO_SLUG.items()):
        files = groups[group]
        for idx, (suffix, fname) in enumerate(files, start=1):
            src_path = os.path.join(SRC_DIR, fname)
            dst_path = os.path.join(OUT_DIR, slug, f"{idx:02d}.png")
            size = convert_one(src_path, dst_path)
            total_bytes += os.path.getsize(dst_path)
            file_count += 1
            if idx == 1:
                overlay_sizes[slug] = size
        print(f"group {group:>3} -> {slug:45s} {len(files):2d} images")

    print(f"\n{file_count} files written, {total_bytes / (1024*1024):.2f} MB total")
    print("\nOverlay aspect ratios (01.png):")
    for slug, (w, h) in sorted(overlay_sizes.items()):
        print(f"  {slug:45s} {w:4d}x{h:4d}  w/h={w/h:.4f}")


if __name__ == "__main__":
    main()
