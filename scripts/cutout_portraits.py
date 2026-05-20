"""将头像抠图（去除浅色/白色背景），输出 *-cutout.png"""

from collections import deque

from pathlib import Path



try:

    from PIL import Image, ImageDraw

except ImportError:

    raise SystemExit("需要 Pillow: pip install pillow")



BASE = Path(__file__).resolve().parent.parent / "assets" / "images"

NPC_DIR = BASE / "npc"





def _similar(r1, g1, b1, r2, g2, b2, tol: int) -> bool:

    return abs(r1 - r2) <= tol and abs(g1 - g2) <= tol and abs(b1 - b2) <= tol





def flood_cutout(path: Path, tol: int = 28, white_floor: int = 200) -> Path:

    """从四角泛洪去除连通浅色背景，保留人物本体。"""

    img = Image.open(path).convert("RGBA")

    px = img.load()

    w, h = img.size

    seeds = [(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1)]

    visited = set()

    q = deque()



    for x, y in seeds:

        r, g, b, a = px[x, y]

        if a < 8:

            continue

        if min(r, g, b) >= white_floor:

            q.append((x, y))

            visited.add((x, y))



    while q:

        x, y = q.popleft()

        r, g, b, a = px[x, y]

        px[x, y] = (r, g, b, 0)

        for nx, ny in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)):

            if nx < 0 or ny < 0 or nx >= w or ny >= h:

                continue

            if (nx, ny) in visited:

                continue

            nr, ng, nb, na = px[nx, ny]

            if na < 8:

                continue

            if min(nr, ng, nb) >= white_floor and _similar(r, g, b, nr, ng, nb, tol):

                visited.add((nx, ny))

                q.append((nx, ny))



    out = path.with_name(path.stem + "-cutout.png")

    img.save(out, "PNG")

    print("saved", out)

    return out





def cutout(path: Path, threshold: int = 250, soft_floor: int = 210) -> Path:

    img = Image.open(path).convert("RGBA")

    px = img.load()

    w, h = img.size

    for y in range(h):

        for x in range(w):

            r, g, b, a = px[x, y]

            if r >= threshold and g >= threshold and b >= threshold:

                px[x, y] = (r, g, b, 0)

            elif r >= soft_floor and g >= soft_floor and b >= soft_floor:

                t = min(r, g, b)

                alpha = int((255 - t) * 2.2)

                px[x, y] = (r, g, b, min(255, max(0, alpha)))

    out = path.with_name(path.stem + "-cutout.png")

    img.save(out, "PNG")

    print("saved", out)

    return out





def circle_mask_cutout(path: Path, margin: float = 0.05, white_floor: int = 168, tol: int = 48) -> Path:

    """圆形画幅 NPC：外圈透明，圆内连通浅色背景透明化。"""

    img = Image.open(path).convert("RGBA")

    px = img.load()

    w, h = img.size

    cx, cy = w / 2, h / 2

    r = min(w, h) / 2 * (1 - margin)

    r2 = r * r

    for y in range(h):

        for x in range(w):

            if (x - cx) ** 2 + (y - cy) ** 2 > r2:

                px[x, y] = (0, 0, 0, 0)



    seeds = [

        (0, 0),

        (w - 1, 0),

        (0, h - 1),

        (w - 1, h - 1),

        (int(cx), max(0, int(cy - r) + 2)),

        (int(cx - r * 0.55), int(cy + r * 0.35)),

        (int(cx + r * 0.55), int(cy + r * 0.35)),

    ]

    visited = set()

    q = deque()

    for x, y in seeds:

        if x < 0 or y < 0 or x >= w or y >= h:

            continue

        r0, g0, b0, a0 = px[x, y]

        if a0 < 8:

            continue

        if min(r0, g0, b0) >= white_floor:

            q.append((x, y))

            visited.add((x, y))

    while q:

        x, y = q.popleft()

        r0, g0, b0, a0 = px[x, y]

        px[x, y] = (r0, g0, b0, 0)

        for nx, ny in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)):

            if nx < 0 or ny < 0 or nx >= w or ny >= h or (nx, ny) in visited:

                continue

            nr, ng, nb, na = px[nx, ny]

            if na < 8:

                continue

            if min(nr, ng, nb) >= white_floor and _similar(r0, g0, b0, nr, ng, nb, tol):

                visited.add((nx, ny))

                q.append((nx, ny))



    out = path.with_name(path.stem + "-cutout.png")

    img.save(out, "PNG")

    print("saved", out)

    return out





def rasterize_npc_avatar(name: str, face_color: str, body_color: str, label: str) -> Path:

    """为仅有 SVG 的 NPC 生成透明底半身 PNG 立绘。"""

    size = 320

    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))

    draw = ImageDraw.Draw(img)

    cx, cy = size // 2, size // 2 + 8

    draw.ellipse((cx - 72, cy - 98, cx + 72, cy + 22), fill=face_color)

    draw.rounded_rectangle((cx - 68, cy + 32, cx + 68, cy + 132), radius=22, fill=body_color)

    try:

        from PIL import ImageFont



        font = ImageFont.truetype("msyh.ttc", 56)

    except OSError:

        font = ImageFont.load_default()

    bbox = draw.textbbox((0, 0), label, font=font)

    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]

    draw.text((cx - tw // 2, cy - th // 2 - 6), label, fill="#3a3028", font=font)

    out = NPC_DIR / f"npc-{name}-cutout.png"

    img.save(out, "PNG")

    print("saved", out)

    return out





if __name__ == "__main__":

    if (BASE / "hero-xiaozhan.png").exists():

        flood_cutout(BASE / "hero-xiaozhan.png", tol=32, white_floor=195)

    # 女主立绘：heroine-isapara-cutout.png 由 rembg 单独生成，此处不覆盖



    if (NPC_DIR / "npc-curator.png").exists():

        circle_mask_cutout(NPC_DIR / "npc-curator.png", margin=0.05, white_floor=168, tol=48)

    if (NPC_DIR / "npc-landlord.png").exists():

        circle_mask_cutout(NPC_DIR / "npc-landlord.png", margin=0.06, white_floor=155, tol=55)



    avatar_defs = [

        ("boss", "#d4c4b0", "#4a4038", "老"),

        ("colleague", "#e8d8c8", "#5a5048", "周"),

        ("fan", "#f0c8d8", "#6a4058", "粉"),

        ("reporter", "#c8d8e8", "#3a4858", "记"),

        ("agent", "#d0c0e8", "#4a3858", "纪"),

    ]

    for npc_name, face, body, label in avatar_defs:

        rasterize_npc_avatar(npc_name, face, body, label)

