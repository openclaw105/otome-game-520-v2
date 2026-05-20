"""下载额外场景背景图"""
import urllib.request
from pathlib import Path

BG = Path(__file__).resolve().parent.parent / "assets" / "images" / "bg"
BG.mkdir(parents=True, exist_ok=True)

URLS = {
    "bg-party.jpg": "https://images.unsplash.com/photo-1429962714454-bb934ec5b04d?w=1920&q=80",
    "bg-salon.jpg": "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920&q=80",
    "bg-rooftop-bar.jpg": "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=1920&q=80",
    "bg-recording.jpg": "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=1920&q=80",
}

for name, url in URLS.items():
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        data = urllib.request.urlopen(req, timeout=30).read()
        (BG / name).write_bytes(data)
        print("ok", name, len(data))
    except Exception as e:
        print("fail", name, e)
