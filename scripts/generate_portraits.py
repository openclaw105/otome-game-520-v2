"""
生成统一风格的 NPC / 明星友人半身立绘 (PNG 透明底)。
风格：柔和渐变、半写实插画 bust，尺寸统一 420x520。
"""
from __future__ import annotations

import io
import urllib.request
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

BASE = Path(__file__).resolve().parent.parent / "assets" / "images" / "npc"
BASE.mkdir(parents=True, exist_ok=True)

W, H = 420, 520


def _font(size: int):
    for name in ("msyh.ttc", "msyhbd.ttc", "simhei.ttf", "arial.ttf"):
        try:
            return ImageFont.truetype(name, size)
        except OSError:
            continue
    return ImageFont.load_default()


def _gradient_bg(draw: ImageDraw.ImageDraw, top: str, bottom: str):
    t = Image.new("RGBA", (W, H))
    td = ImageDraw.Draw(t)
    for y in range(H):
        ratio = y / max(H - 1, 1)
        tr = int(int(top[1:3], 16) * (1 - ratio) + int(bottom[1:3], 16) * ratio)
        tg = int(int(top[3:5], 16) * (1 - ratio) + int(bottom[3:5], 16) * ratio)
        tb = int(int(top[5:7], 16) * (1 - ratio) + int(bottom[5:7], 16) * ratio)
        td.line([(0, y), (W, y)], fill=(tr, tg, tb, 0))
    return t


def draw_bust(
    name: str,
    skin: str,
    hair: str,
    hair_style: str,
    shirt: str,
    accent: str,
    label: str | None = None,
    accessory: str | None = None,
) -> Image.Image:
    img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    grad = _gradient_bg(ImageDraw.Draw(img), "#1a1428", "#0a0812")
    img = Image.alpha_composite(img, grad)

    cx, cy = W // 2, H // 2 + 30
    draw = ImageDraw.Draw(img)

    # 肩与衣
    draw.rounded_rectangle((cx - 118, cy + 58, cx + 118, cy + 200), radius=36, fill=shirt)
    draw.ellipse((cx - 130, cy + 40, cx + 130, cy + 120), fill=shirt)

    # 颈
    draw.rectangle((cx - 28, cy + 8, cx + 28, cy + 72), fill=skin)

    # 脸
    draw.ellipse((cx - 72, cy - 88, cx + 72, cy + 32), fill=skin)

    # 头发
    if hair_style == "short":
        draw.ellipse((cx - 78, cy - 108, cx + 78, cy + 8), fill=hair)
        draw.rectangle((cx - 78, cy - 40, cx + 78, cy + 20), fill=hair)
    elif hair_style == "long":
        draw.ellipse((cx - 80, cy - 110, cx + 80, cy + 10), fill=hair)
        draw.rectangle((cx - 90, cy - 30, cx - 50, cy + 120), fill=hair)
        draw.rectangle((cx + 50, cy - 30, cx + 90, cy + 120), fill=hair)
    elif hair_style == "bob":
        draw.ellipse((cx - 82, cy - 108, cx + 82, cy + 12), fill=hair)
        draw.rounded_rectangle((cx - 85, cy - 20, cx + 85, cy + 90), radius=40, fill=hair)
    elif hair_style == "wavy":
        draw.ellipse((cx - 84, cy - 112, cx + 84, cy + 6), fill=hair)
        for i in range(-3, 4):
            draw.ellipse((cx + i * 22 - 18, cy + 10, cx + i * 22 + 18, cy + 100), fill=hair)
    else:  # side
        draw.ellipse((cx - 78, cy - 108, cx + 78, cy + 8), fill=hair)
        draw.polygon([(cx + 20, cy - 80), (cx + 95, cy - 20), (cx + 85, cy + 80), (cx + 30, cy + 40)], fill=hair)

    # 五官
    draw.ellipse((cx - 38, cy - 28, cx - 14, cy - 8), fill="#2a2030")
    draw.ellipse((cx + 14, cy - 28, cx + 38, cy - 8), fill="#2a2030")
    draw.arc((cx - 12, cy - 2, cx + 12, cy + 14), start=10, end=170, fill="#b07070", width=2)
    draw.ellipse((cx - 48, cy - 18, cx - 32, cy - 6), fill=(255, 220, 210, 80))
    draw.ellipse((cx + 32, cy - 18, cx + 48, cy - 6), fill=(255, 220, 210, 80))

    # 配饰
    if accessory == "mic":
        draw.rounded_rectangle((cx + 70, cy + 20, cx + 95, cy + 100), radius=8, fill=accent)
        draw.ellipse((cx + 58, cy + 8, cx + 82, cy + 32), fill="#333")
    elif accessory == "glasses":
        draw.ellipse((cx - 46, cy - 32, cx - 10, cy - 4), outline=accent, width=3)
        draw.ellipse((cx + 10, cy - 32, cx + 46, cy - 4), outline=accent, width=3)
        draw.line([(cx - 10, cy - 18), (cx + 10, cy - 18)], fill=accent, width=3)
    elif accessory == "earring":
        draw.ellipse((cx - 76, cy - 8, cx - 68, cy), fill=accent)
    elif accessory == "cap":
        draw.pieslice((cx - 80, cy - 120, cx + 80, cy - 20), 180, 360, fill=accent)
    elif accessory == "scarf":
        draw.polygon([(cx - 40, cy + 30), (cx + 40, cy + 30), (cx + 55, cy + 75), (cx - 55, cy + 75)], fill=accent)

    # 柔光
    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    gd.ellipse((cx - 100, cy - 100, cx + 100, cy + 80), fill=(255, 240, 230, 35))
    img = Image.alpha_composite(img, glow)

    if label:
        f = _font(22)
        bbox = draw.textbbox((0, 0), label, font=f)
        tw = bbox[2] - bbox[0]
        draw.text((cx - tw // 2, H - 42), label, fill=(240, 230, 220, 200), font=f)

    # 边缘羽化透明
    mask = Image.new("L", (W, H), 0)
    md = ImageDraw.Draw(mask)
    md.ellipse((30, 40, W - 30, H - 10), fill=255)
    md.rectangle((0, H - 80, W, H), fill=0)
    img.putalpha(mask.filter(ImageFilter.GaussianBlur(8)))
    return img


def try_download(url: str, dest: Path) -> bool:
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        data = urllib.request.urlopen(req, timeout=25).read()
        raw = Image.open(io.BytesIO(data)).convert("RGBA")
        raw = raw.resize((W, H), Image.Resampling.LANCZOS)
        # 统一加暗角与色调
        overlay = Image.new("RGBA", (W, H), (26, 18, 40, 90))
        raw = Image.alpha_composite(raw, overlay)
        mask = Image.new("L", (W, H), 0)
        md = ImageDraw.Draw(mask)
        md.ellipse((20, 30, W - 20, H - 5), fill=255)
        raw.putalpha(mask.filter(ImageFilter.GaussianBlur(6)))
        raw.save(dest, "PNG")
        print("download ok", dest.name)
        return True
    except Exception as e:
        print("download fail", dest.name, e)
        return False


# id, 显示名, 绘制参数..., 可选 unsplash url
PORTRAITS = [
    ("fan", "粉丝", "#f5d0c8", "#5c3a48", "bob", "#8b4a62", "#e8a4b8", None, "粉"),
    ("reporter", "记者", "#e8d4c0", "#3a3848", "short", "#2a3448", "#c9a227", "glasses", "记"),
    ("agent", "经纪人", "#e0cbb8", "#2e2838", "side", "#1e1a28", "#9a7ab8", None, "纪"),
    ("boss", "老板", "#dcc8b0", "#4a4030", "short", "#3a3428", "#6a5a48", None, "老"),
    ("colleague", "同事", "#f0d8c8", "#4a3828", "long", "#5a4030", "#7a9ab8", None, "周"),
    ("bestie", "闺蜜", "#fad8c8", "#6a2840", "wavy", "#9a4060", "#d4af37", "earring", "蜜"),
    ("zhoushen", "周深", "#f5dcc8", "#3a3048", "short", "#2a3858", "#6a8fd4", "mic", None),
    ("zhuyilong", "朱一龙", "#edd8c8", "#2a2838", "side", "#1a1828", "#4a5a78", None, None),
    ("yangmi", "杨幂", "#fad0c0", "#4a2030", "long", "#6a3040", "#c45d7a", None, None),
    ("baijingting", "白敬亭", "#f0d8c8", "#3a3428", "short", "#4a4838", "#8ab0c8", None, None),
    ("nini", "倪妮", "#ecc8b8", "#2a2830", "bob", "#3a3848", "#b89a6a", "earring", None),
    ("lixian", "李现", "#e8d0b8", "#3a3028", "short", "#4a4030", "#5a7a68", "cap", None),
    ("yangzi", "杨紫", "#fad8c8", "#5a3040", "bob", "#7a4058", "#e8a4b8", "scarf", None),
    ("dengchao", "邓超", "#e8ccb0", "#3a3428", "short", "#4a4438", "#d4af37", None, None),
]

# 仅作氛围参考的 royalty-free 人像（非特定名人肖像）
STOCK_URLS = {
    "fan": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&q=80",
    "reporter": "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&q=80",
    "zhoushen": "https://images.unsplash.com/photo-1507003211169?w=600&q=80",
    "yangmi": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&q=80",
    "zhuyilong": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&q=80",
}


def main():
    for item in PORTRAITS:
        pid = item[0]
        out = BASE / f"npc-{pid}-cutout.png"
        url = STOCK_URLS.get(pid)
        if url and try_download(url, out):
            continue
        img = draw_bust(*item[1:])
        img.save(out, "PNG")
        print("draw ok", out.name)

    # 林姐、房东沿用原图仅做尺寸规范化（若存在）
    for src_name in ("curator", "landlord"):
        src = BASE / f"npc-{src_name}.png"
        if not src.exists():
            continue
        img = Image.open(src).convert("RGBA")
        img.thumbnail((W, H), Image.Resampling.LANCZOS)
        canvas = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        ox = (W - img.width) // 2
        oy = H - img.height - 10
        canvas.paste(img, (ox, oy), img)
        canvas.save(BASE / f"npc-{src_name}-cutout.png", "PNG")
        print("resize ok", src_name)


if __name__ == "__main__":
    main()
