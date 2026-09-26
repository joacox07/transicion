"""Prepara los recursos gráficos del Reel "Misión Rosario" a partir de las fotos originales.

- Endereza (corrección de perspectiva) cada carta, la caja y el lomo.
- Extrae los logos impresos en la caja como máscaras alfa limpias (para colorearlos por CSS).
- Genera la textura de papel del fondo.

Uso:  python3 reel/prepare_assets.py
"""
import json
import os

import numpy as np
from PIL import Image, ImageFilter, ImageOps

HERE = os.path.dirname(os.path.abspath(__file__))
PH = os.path.join(HERE, "assets", "photos")
OUT = os.path.join(HERE, "assets", "cut")
os.makedirs(OUT, exist_ok=True)

CREAM = np.array([246, 241, 232], dtype=np.float32)


def quad(im, corners, size):
    """corners = TL, TR, BR, BL  ->  imagen rectificada de tamaño `size`."""
    TL, TR, BR, BL = corners
    return im.transform(size, Image.QUAD, data=(*TL, *BL, *BR, *TR), resample=Image.BICUBIC)


def neutralize(im, region, strength=0.75):
    """Balance de blancos usando una zona que en la realidad es crema (texto de la carta)."""
    a = np.asarray(im).astype(np.float32)
    x0, y0, x1, y1 = region
    patch = a[y0:y1, x0:x1].reshape(-1, 3)
    lum = patch.mean(1)
    sel = patch[lum > np.percentile(lum, 60)]  # sólo papel, sin tinta
    ref = sel.mean(0)
    gain = 1 + (CREAM / ref - 1) * strength
    a = np.clip(a * gain, 0, 255)
    return Image.fromarray(a.astype(np.uint8))


def finish(im):
    return im.filter(ImageFilter.UnsharpMask(radius=1.6, percent=55, threshold=2))


# ---------------------------------------------------------------- cartas
cards = json.load(open(os.path.join(HERE, "assets", "cards.json")))
mesa = Image.open(os.path.join(PH, "cartas-mesa.jpg"))
CW, CH = 840, 1200
for key, c in cards.items():
    card = quad(mesa, c, (CW, CH))
    card = neutralize(card, (60, int(CH * 0.80), CW - 60, CH - 40))
    finish(card).save(os.path.join(OUT, f"card-{key}.jpg"), quality=93)

# ---------------------------------------------------------------- caja
frente = Image.open(os.path.join(PH, "caja-frente.jpg"))
BOX = [(297, 352), (1676, 326), (1703, 2370), (297, 2375)]
box_native = quad(frente, BOX, (1392, 2032))
box_native = neutralize(box_native, (80, 1700, 1300, 1950), 0.6)
box = box_native.resize((1044, 1524), Image.LANCZOS)
finish(box).save(os.path.join(OUT, "box-front.jpg"), quality=93)

# Ilustración de la Virgen (parte superior de la caja) para el gancho inicial
art = box_native.crop((0, 0, 1392, 1180))
finish(art).save(os.path.join(OUT, "art-virgen.jpg"), quality=93)

lomo = Image.open(os.path.join(PH, "caja-lomo.jpg"))
SPINE = [(252, 778), (2288, 762), (2272, 1012), (252, 1030)]
spine = quad(lomo, SPINE, (2036, 252))
spine = neutralize(spine, (300, 20, 1900, 230), 0.6)
spine = spine.resize((1524, 188), Image.LANCZOS).rotate(-90, expand=True)
finish(spine).save(os.path.join(OUT, "box-spine.jpg"), quality=93)


# ---------------------------------------------------------------- logos
def ink_alpha(img, region, ink_lum, pad=14, scale=3):
    """Devuelve una máscara alfa suave (blanco + alfa) del logo impreso."""
    x0, y0, x1, y1 = region
    crop = img.crop((x0 - pad, y0 - pad, x1 + pad, y1 + pad))
    L = np.asarray(crop.convert("L")).astype(np.float32)
    bg = np.asarray(
        crop.convert("L").filter(ImageFilter.MaxFilter(21)).filter(ImageFilter.GaussianBlur(12))
    ).astype(np.float32)
    a = np.clip((bg - L - 10) / (bg - ink_lum - 10), 0, 1)
    m = Image.fromarray((a * 255).astype(np.uint8))
    m = m.resize((m.width * scale, m.height * scale), Image.LANCZOS).filter(ImageFilter.GaussianBlur(scale * 0.55))
    # curva de contraste: bordes nítidos tipo vector
    arr = np.asarray(m).astype(np.float32) / 255
    arr = np.clip((arr - 0.30) / 0.36, 0, 1)
    arr = arr * arr * (3 - 2 * arr)
    alpha = Image.fromarray((arr * 255).astype(np.uint8))
    bbox = alpha.point(lambda v: 255 if v > 20 else 0).getbbox()
    alpha = alpha.crop((max(bbox[0] - 8, 0), max(bbox[1] - 8, 0), bbox[2] + 8, bbox[3] + 8))
    out = Image.new("LA", alpha.size, 255)
    out.putalpha(alpha)
    return out, crop


def split_colors(img, region, pad=14):
    """Separa tinta azul (texto) de tinta dorada (rosario) del logo Misión Rosario."""
    x0, y0, x1, y1 = region
    crop = img.crop((x0 - pad, y0 - pad, x1 + pad, y1 + pad))
    a = np.asarray(crop.filter(ImageFilter.GaussianBlur(1.2))).astype(np.float32)
    blue = (a[..., 2] - a[..., 0]) > 2
    return blue


logo_region = (440, 1314, 950, 1608)
blue = split_colors(box_native, logo_region)
alpha_all, crop = ink_alpha(box_native, logo_region, ink_lum=70)


def masked_logo(keep_blue, name):
    x0, y0, x1, y1 = logo_region
    pad = 14
    c = box_native.crop((x0 - pad, y0 - pad, x1 + pad, y1 + pad))
    L = np.asarray(c.convert("L")).astype(np.float32)
    bg = np.asarray(c.convert("L").filter(ImageFilter.MaxFilter(21)).filter(ImageFilter.GaussianBlur(12))).astype(np.float32)
    inkL = 85 if keep_blue else 110
    a = np.clip((bg - L - 10) / (bg - inkL - 10), 0, 1)
    bluem = Image.fromarray(blue.astype(np.uint8) * 255)
    if keep_blue:
        sel = np.asarray(bluem.filter(ImageFilter.MaxFilter(5))).astype(np.float32) / 255
    else:  # dorado = todo lo que no está cerca de la tinta azul (evita halos)
        sel = 1 - np.asarray(bluem.filter(ImageFilter.MaxFilter(7))).astype(np.float32) / 255
        h, w = sel.shape
        sel[int(h * 0.94):, : int(w * 0.74)] = 0  # recorta el comienzo de "Con María" debajo
    a = a * sel
    scale = 3
    m = Image.fromarray((a * 255).astype(np.uint8))
    m = m.resize((m.width * scale, m.height * scale), Image.LANCZOS).filter(ImageFilter.GaussianBlur(scale * 0.55))
    arr = np.asarray(m).astype(np.float32) / 255
    arr = np.clip((arr - 0.30) / 0.36, 0, 1)
    arr = arr * arr * (3 - 2 * arr)
    alpha = Image.fromarray((arr * 255).astype(np.uint8))
    if not keep_blue:  # apertura morfológica: elimina motas sueltas, conserva las cuentas
        alpha = alpha.filter(ImageFilter.MinFilter(9)).filter(ImageFilter.MaxFilter(9))
    out = Image.new("LA", alpha.size, 255)
    out.putalpha(alpha)
    out.save(os.path.join(OUT, name))
    return out.size


s1 = masked_logo(True, "logo-mision-texto.png")
s2 = masked_logo(False, "logo-mision-rosario.png")

eu, _ = ink_alpha(box_native, (150, 1820, 470, 1960), ink_lum=100)
eu.save(os.path.join(OUT, "logo-eutrapelia.png"))
fp, _ = ink_alpha(box_native, (920, 1790, 1260, 1990), ink_lum=100)
fp.save(os.path.join(OUT, "logo-familias.png"))

# ---------------------------------------------------------------- fotos ambiente
for name in ("atril-frente", "atril-perfil"):
    im = Image.open(os.path.join(PH, f"{name}.jpg"))
    im = ImageOps.exif_transpose(im).resize((1440, 1920), Image.LANCZOS)
    finish(im).save(os.path.join(OUT, f"{name}.jpg"), quality=92)

# ---------------------------------------------------------------- papel
rng = np.random.default_rng(7)
W, H = 1080, 1920
noise = rng.normal(0, 1, (H // 2, W // 2)).astype(np.float32)
n1 = np.asarray(Image.fromarray(((noise * 40) + 128).clip(0, 255).astype(np.uint8)).resize((W, H), Image.BICUBIC)).astype(np.float32)
fib = Image.fromarray(((rng.normal(0, 1, (H // 6, W // 24)) * 50) + 128).clip(0, 255).astype(np.uint8)).resize((W, H), Image.BICUBIC)
fib = np.asarray(fib.filter(ImageFilter.GaussianBlur(3))).astype(np.float32)
blot = Image.fromarray(((rng.normal(0, 1, (12, 7)) * 60) + 128).clip(0, 255).astype(np.uint8)).resize((W, H), Image.BICUBIC)
blot = np.asarray(blot.filter(ImageFilter.GaussianBlur(60))).astype(np.float32)
base = np.array([244, 238, 227], dtype=np.float32)
tex = (n1 - 128) * 0.10 + (fib - 128) * 0.06 + (blot - 128) * 0.10
paper = np.clip(base[None, None, :] + tex[..., None] * np.array([1, 1, 1.15]), 0, 255).astype(np.uint8)
Image.fromarray(paper).save(os.path.join(OUT, "paper.jpg"), quality=92)

print("ok", s1, s2, eu.size, fp.size)
