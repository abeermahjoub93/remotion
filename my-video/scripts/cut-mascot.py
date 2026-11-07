# Cuts the SecureLogX mascot poses out of the character sheet into transparent PNGs.
# Usage: python3 -I scripts/cut-mascot.py <sheet.jpg> public/mascot
import sys
import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage

src, out = sys.argv[1], sys.argv[2]
im = np.asarray(Image.open(src).convert("RGB")).astype(int)
H, W, _ = im.shape

# figure rows (label rows excluded) and columns, measured from the sheet
ROWS = [(0, 238), (262, 466), (487, 677), (698, 881), (901, 1080)]
COLS = [(0, 236), (236, 437), (437, 634), (634, 812), (812, 1023), (1023, 1187), (1187, W)]
NAMES = [
    ["laptop", "reading", "thinking", "idea", "very-happy", "thumbs-up", "hello"],
    ["thanks", "coffee", "explore", "tablet", "presenting", "confused", "dont-know"],
    ["angry", "furious", "sad", "crying", "tired", "yawning", "worried"],
    ["rushing", "celebrate", "protect", "secure", "pointing", "inspect", "relax"],
    ["writing", "solve-problem", "solution", "launch", "announce", "world", "gift"],
]

for r, (y0, y1) in enumerate(ROWS):
    for c, (x0, x1) in enumerate(COLS):
        cell = im[y0:y1, x0:x1]
        lum = cell.mean(2)
        sat = cell.max(2) - cell.min(2)
        light = (lum > 218) & (sat < 26)
        # background = light pixels connected to the cell border
        lab, _ = ndimage.label(light)
        border = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
        bg = np.isin(lab, list(border))
        fg = ~bg
        # keep the largest blob plus anything big enough nearby (accessories)
        blobs, n = ndimage.label(ndimage.binary_closing(fg, iterations=2))
        sizes = ndimage.sum(fg, blobs, range(1, n + 1))
        keep = np.zeros_like(fg)
        for i, s in enumerate(sizes):
            if s >= max(150, sizes.max() * 0.02):
                keep |= blobs == i + 1
        alpha = (keep & fg).astype(np.uint8) * 255
        a = Image.fromarray(alpha).filter(ImageFilter.GaussianBlur(0.7))
        rgba = np.dstack([cell.astype(np.uint8), np.asarray(a)])
        ys, xs = np.where(np.asarray(a) > 20)
        rgba = rgba[ys.min():ys.max() + 1, xs.min():xs.max() + 1]
        img = Image.fromarray(rgba, "RGBA")
        img = img.resize((img.width * 2, img.height * 2), Image.LANCZOS)
        img.save(f"{out}/{NAMES[r][c]}.png")
print("done")
