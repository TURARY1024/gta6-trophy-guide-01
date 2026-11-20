#!/usr/bin/env python3
"""Render the guide's four screenshots with headless Chromium and save them as JPEGs.

Reads shots.json (file, path, viewport) and serves from http://127.0.0.1:8080 —
start `node serve.ts` first. Each shot is taken at 1280x800, converted to JPEG,
and kept under the 256 KiB cap the gate sets for screenshots.
"""
import json
import subprocess
import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent
SHOTS = json.loads((ROOT / "shots.json").read_text())
CHROME = Path.home() / ".cache/ms-playwright/chromium_headless_shell-1255/chrome-headless-shell-linux64/chrome-headless-shell"
BASE = "http://127.0.0.1:8080"
OUT = ROOT / "screenshots"
TMP = Path("/tmp/leonida-shots")
TMP.mkdir(exist_ok=True)


def take_shot(shot):
    name = shot["file"]
    url = BASE + shot["path"]
    width = shot["viewport"]["width"]
    height = shot["viewport"]["height"]
    png = TMP / (name + ".png")
    cmd = [
        str(CHROME),
        "--no-sandbox",
        "--disable-gpu",
        f"--screenshot={png}",
        f"--window-size={width},{height}",
        "--virtual-time-budget=8000",
        "--hide-scrollbars",
        url,
    ]
    result = subprocess.run(cmd, capture_output=True, text=True, timeout=120)
    if not png.exists():
        print(f"FAILED {name}: no PNG produced\n{result.stdout}\n{result.stderr}")
        sys.exit(1)
    image = Image.open(png).convert("RGB")
    jpg = OUT / name
    quality = 82
    while True:
        image.save(jpg, "JPEG", quality=quality)
        if jpg.stat().st_size <= 262144 or quality <= 50:
            break
        quality -= 8
    print(f"{name}: {image.size[0]}x{image.size[1]}, {jpg.stat().st_size} bytes, quality {quality}")


def main():
    OUT.mkdir(exist_ok=True)
    for shot in SHOTS:
        take_shot(shot)
    print("done")


if __name__ == "__main__":
    main()
