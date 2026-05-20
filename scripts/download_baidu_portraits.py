"""
从百度百科条目提取封面图，rembg 抠图生成立绘。
"""
from __future__ import annotations

import io
import re
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

# npc 文件 id -> 百度百科搜索名（须为亚洲艺人/角色）
BAIDU_NAMES = {
    # xiaozhan：使用玩家提供的 hero-xiaozhan.png，不在此脚本覆盖
    "zhuyilong": "朱一龙",
    "yangmi": "杨幂",
    "baijingting": "白敬亭",
    "nini": "倪妮",
    "lixian": "李现",
    "yangzi": "杨紫",
    "dengchao": "邓超",
    "curator": "刘涛",  # 刘姐（经纪人形象参考）
    "bestie": "田曦薇",  # 闺蜜薇薇
    "landlord": "倪大红",
    "fan": "赵露思",
    "reporter": "董卿",
    "agent": "黄晓明",
    "boss": "王耀庆",
    "colleague": "张子枫",
}


def fetch_html(url: str) -> str:
    req = urllib.request.Request(
        url,
        headers={
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            "Accept-Language": "zh-CN,zh;q=0.9",
        },
    )
    with urllib.request.urlopen(req, timeout=35) as resp:
        return resp.read().decode("utf-8", "replace")


def baidu_cover_image(name: str) -> str | None:
    url = "https://baike.baidu.com/item/" + urllib.parse.quote(name)
    html = fetch_html(url)
    patterns = [
        r'"descPic"\s*:\s*"(https?://[^"\\]+)"',
        r'"summaryPic"\s*:\s*"(https?://[^"\\]+)"',
        r'property="og:image"\s+content="(https?://[^"]+)"',
        r'"lemmaPic"\s*:\s*"(https?://[^"\\]+)"',
    ]
    for pat in patterns:
        m = re.search(pat, html)
        if m:
            link = m.group(1).replace("\\u002F", "/").replace("\\/", "/")
            if "baike" in link or "bcebos" in link or "bdimg" in link:
                return link
    return None


def download_bytes(url: str) -> bytes:
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=45) as resp:
        return resp.read()


def cutout_and_save(raw: bytes, dest: Path) -> None:
    out_bytes = remove(raw)
    img = Image.open(io.BytesIO(out_bytes)).convert("RGBA")
    bbox = img.getbbox()
    if bbox:
        img = img.crop(bbox)
    img = ImageOps.contain(img, (int(W * 0.92), int(H * 0.88)), Image.Resampling.LANCZOS)
    canvas = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    x = (W - img.width) // 2
    y = H - img.height - 8
    canvas.paste(img, (x, y), img)
    mask = Image.new("L", (W, H), 0)
    md = ImageDraw.Draw(mask)
    md.ellipse((24, 36, W - 24, H - 4), fill=255)
    mask = mask.filter(ImageFilter.GaussianBlur(10))
    canvas.putalpha(Image.composite(canvas.split()[3], Image.new("L", (W, H), 0), mask))
    canvas.save(dest, "PNG")
    print("saved", dest.name, dest.stat().st_size)


def process_id(pid: str, baidu_name: str, extra: Path | None = None) -> bool:
    print(pid, "->", baidu_name)
    img_url = baidu_cover_image(baidu_name)
    if not img_url:
        print("  no cover")
        return False
    print("  ", img_url[:100])
    data = download_bytes(img_url)
    cutout_and_save(data, BASE / f"npc-{pid}-cutout.png")
    if extra:
        cutout_and_save(data, extra)
    return True


def main():
    BASE.mkdir(parents=True, exist_ok=True)
    for pid, name in BAIDU_NAMES.items():
        if pid == "xiaozhan":
            continue
        try:
            process_id(pid, name, extra=None)
        except Exception as e:
            print("fail", pid, e)


if __name__ == "__main__":
    main()
