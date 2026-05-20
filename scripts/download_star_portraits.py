"""
从网络搜索明星/角色参考图，rembg 抠图，输出统一尺寸立绘。
优先：中文维基百科条目头图；备选：维基共享资源搜索。
"""
from __future__ import annotations

import io
import json
import urllib.parse
import urllib.request
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageOps

try:
    from rembg import remove
except ImportError:
    raise SystemExit("需要 rembg: pip install rembg")

BASE = Path(__file__).resolve().parent.parent / "assets" / "images" / "npc"
HERO = Path(__file__).resolve().parent.parent / "assets" / "images"
W, H = 420, 520

# 文件名 id -> 维基搜索主标题（可多个备选）
STAR_WIKI = {
    "zhoushen": ["周深"],
    "zhuyilong": ["朱一龙"],
    "yangmi": ["杨幂"],
    "baijingting": ["白敬亭"],
    "nini": ["倪妮"],
    "lixian": ["李现"],
    "yangzi": ["杨紫"],
    "dengchao": ["邓超"],
    "xiaozhan": ["肖战"],
}

# 非明星 NPC：维基若有则用，否则保留原图仅抠图
OTHER_WIKI = {
    "landlord": ["房东", "包租公"],
}

# 维基共享资源直链（与明星一一对应，作下载失败时的备选）
COMMONS_FILES = {
    "xiaozhan": "File:Xiao_Zhan_at_the_Weibo_Night_Ceremony_January_11_2020.jpg",
    "zhoushen": "File:Zhou Shen at 2020 (cropped).jpg",
    "zhuyilong": "File:Zhu Yilong in 2019.jpg",
    "yangmi": "File:Yang Mi at the 2018 Toronto International Film Festival (cropped).jpg",
    "baijingting": "File:Bai Jingting 2016.jpg",
    "nini": "File:Ni Ni at the 2018 Toronto International Film Festival (cropped).jpg",
    "lixian": "File:Li Xian in 2019.jpg",
    "yangzi": "File:Yang Zi in 2019.jpg",
    "dengchao": "File:Deng Chao in 2018.jpg",
}


def commons_file_url(file_title: str) -> str | None:
    q = urllib.parse.quote(file_title)
    api = (
        f"https://commons.wikimedia.org/w/api.php?action=query&titles={q}"
        "&prop=imageinfo&iiprop=url&format=json"
    )
    data = fetch_json(api)
    for page in data.get("query", {}).get("pages", {}).values():
        info = page.get("imageinfo", [])
        if info and info[0].get("url"):
            return info[0]["url"]
    return None


def fetch_json(url: str) -> dict:
    req = urllib.request.Request(url, headers={"User-Agent": "OtomeGamePortraitBot/1.0"})
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.loads(resp.read().decode("utf-8"))


def wiki_page_image(title: str, lang: str = "zh", thumb_size: int = 900) -> str | None:
    q = urllib.parse.quote(title.replace(" ", "_"))
    api = (
        f"https://{lang}.wikipedia.org/w/api.php?action=query&titles={q}"
        f"&prop=pageimages&format=json&piprop=original|thumbnail"
        f"&pithumbsize={thumb_size}&pilicense=any"
    )
    data = fetch_json(api)
    pages = data.get("query", {}).get("pages", {})
    for page in pages.values():
        if page.get("missing"):
            continue
        orig = page.get("original", {})
        if orig.get("source"):
            return orig["source"]
        thumb = page.get("thumbnail", {})
        if thumb.get("source"):
            return thumb["source"]
    return None


def commons_search_image(keyword: str) -> str | None:
    api = (
        "https://commons.wikimedia.org/w/api.php?action=query&generator=search"
        f"&gsrsearch={urllib.parse.quote(keyword)}&gsrlimit=5&prop=pageimages"
        "&piprop=thumbnail&pithumbsize=900&format=json"
    )
    data = fetch_json(api)
    pages = data.get("query", {}).get("pages", {})
    for page in sorted(pages.values(), key=lambda p: p.get("index", 99)):
        thumb = page.get("thumbnail", {}).get("source")
        if thumb:
            return thumb
    return None


def download_bytes(url: str) -> bytes:
    req = urllib.request.Request(url, headers={"User-Agent": "OtomeGamePortraitBot/1.0"})
    with urllib.request.urlopen(req, timeout=45) as resp:
        return resp.read()


def cutout_and_save(raw: bytes, dest: Path) -> None:
    out_bytes = remove(raw)
    img = Image.open(io.BytesIO(out_bytes)).convert("RGBA")
    # 裁切透明边并保留半身比例
    bbox = img.getbbox()
    if bbox:
        img = img.crop(bbox)
    img = ImageOps.contain(img, (int(W * 0.92), int(H * 0.88)), Image.Resampling.LANCZOS)
    canvas = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    x = (W - img.width) // 2
    y = H - img.height - 8
    canvas.paste(img, (x, y), img)
    # 底部渐隐
    mask = Image.new("L", (W, H), 0)
    md = ImageDraw.Draw(mask)
    md.ellipse((24, 36, W - 24, H - 4), fill=255)
    mask = mask.filter(ImageFilter.GaussianBlur(10))
    canvas.putalpha(Image.composite(canvas.split()[3], Image.new("L", (W, H), 0), mask))
    canvas.save(dest, "PNG")
    print("saved", dest.name, dest.stat().st_size)


def resolve_image(titles: list[str], star_id: str | None = None) -> bytes | None:
    for title in titles:
        for lang in ("zh", "en"):
            url = wiki_page_image(title, lang=lang)
            if url:
                try:
                    print(f"  wiki-{lang}", title)
                    return download_bytes(url)
                except Exception as e:
                    print("  wiki download fail", lang, title, e)
    if star_id and star_id in COMMONS_FILES:
        url = commons_file_url(COMMONS_FILES[star_id])
        if url:
            try:
                print("  commons-file", star_id)
                return download_bytes(url)
            except Exception as e:
                print("  commons-file fail", star_id, e)
    for title in titles:
        url2 = commons_search_image(title)
        if url2:
            try:
                print("  commons-search", title)
                return download_bytes(url2)
            except Exception as e:
                print("  commons fail", title, e)
    return None


def process_star(star_id: str, titles: list[str], extra_out: Path | None = None) -> bool:
    print("star", star_id, titles)
    data = resolve_image(titles, star_id=star_id)
    if not data:
        print("  SKIP no image")
        return False
    cutout_and_save(data, BASE / f"npc-{star_id}-cutout.png")
    if extra_out:
        cutout_and_save(data, extra_out)
    return True


def process_local_cutout(src_name: str, out_id: str) -> None:
    src = BASE / f"npc-{src_name}.png"
    if not src.exists():
        src = HERO / f"{src_name}.png"
    if not src.exists():
        print("missing local", src_name)
        return
    print("local cutout", src_name)
    cutout_and_save(src.read_bytes(), BASE / f"npc-{out_id}-cutout.png")


def main():
    BASE.mkdir(parents=True, exist_ok=True)
    for sid, titles in STAR_WIKI.items():
        extra = HERO / "hero-xiaozhan-cutout.png" if sid == "xiaozhan" else None
        process_star(sid, titles, extra_out=extra)

    # 房东：原图 rembg
    process_local_cutout("landlord", "landlord")

    # 林姐
    if (BASE / "npc-curator.png").exists():
        process_local_cutout("curator", "curator")


if __name__ == "__main__":
    main()
