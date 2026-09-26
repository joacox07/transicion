"""Postproceso «sketchbook» (OpenCV): convierte cada cuadro ilustrado en tinta + acuarela sobre papel.

Recibe por stdin, para cada cuadro:  [uint32 len][PNG escena] [uint32 len][PNG capas superiores con alfa] [float32 t]
y escribe cuadros BGR crudos a ffmpeg.

Pasos (equivalen al filtro SVG de sketch.js, pero ~20 veces más rápido):
  1. temblor de trazo: desplazamiento con ruido suave (cambia cada 2 cuadros = «boil» de animación a mano)
  2. tinta: bordes (laplaciano 8 vecinos) de la imagen suavizada, engrosados y desplazados otra vez
  3. acuarela: color corrido del trazo, algo desaturado y aclarado, con manchas del papel
  4. rayado a lápiz en las zonas oscuras
  5. letra / títulos / créditos encima (sin procesar), textura de papel y viñeta
"""
import struct
import subprocess
import sys

import cv2
import numpy as np

W, H = 1920, 1080
FPS_OUT = int(sys.argv[2]) if len(sys.argv) > 2 else 30
DUP = int(sys.argv[3]) if len(sys.argv) > 3 else 2          # cada cuadro dibujado se repite (animación «de a dos»)
out_path = sys.argv[1]
FFMPEG = subprocess.check_output([sys.executable, '-c', 'import imageio_ffmpeg;print(imageio_ffmpeg.get_ffmpeg_exe())']).decode().strip()

rng = np.random.default_rng(7)
yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)


def smooth_noise(cells, octaves=2, seed=0):
    r = np.random.default_rng(seed)
    acc = np.zeros((H, W), np.float32); amp, tot = 1.0, 0.0
    for k in range(octaves):
        cw = max(2, int(cells * 2 ** k)); ch = max(2, int(cw * H / W))
        base = r.random((ch, cw), dtype=np.float32)
        acc += amp * cv2.resize(base, (W, H), interpolation=cv2.INTER_CUBIC); tot += amp; amp *= .5
    return np.clip(acc / tot, 0, 1)


VAR = []
for k in range(3):
    VAR.append(dict(
        wx=(smooth_noise(30, 2, 11 + k) - .5) * 8, wy=(smooth_noise(30, 2, 12 + k) - .5) * 8,
        ix=(smooth_noise(86, 1, 21 + k) - .5) * 4.5, iy=(smooth_noise(86, 1, 22 + k) - .5) * 4.5,
        bx=(smooth_noise(58, 2, 31 + k) - .5) * 14, by=(smooth_noise(58, 2, 32 + k) - .5) * 14,
        pn=np.clip(cv2.GaussianBlur(1.9 - 1.8 * rng.random((H, W), dtype=np.float32), (0, 0), .7), 0, 1),
        blot=.86 + .15 * smooth_noise(21, 3, 41 + k),
    ))

# trama de rayado diagonal
hatch = np.zeros((H, W), np.float32)
for i in range(-H, W, 7):
    cv2.line(hatch, (i, H), (i + H, 0), 1.0, 1, cv2.LINE_AA)
hatch *= .55

# papel: fibras + grano (multiplicativo suave) y viñeta
grain = (rng.normal(0, 1, (H // 2, W // 2)).astype(np.float32))
grain = cv2.resize(grain, (W, H), interpolation=cv2.INTER_LINEAR)
grain = 1 + .022 * grain + .03 * (smooth_noise(40, 3, 99) - .5)
vy, vx = (yy / H - .48) / .70, (xx / W - .5) / .75
vign = 1 - .42 * np.clip((np.sqrt(vx ** 2 + vy ** 2) - .55) / .45, 0, 1) ** 1.5

K8 = np.array([[-1, -1, -1], [-1, 8, -1], [-1, -1, -1]], np.float32)
INK = np.array([.09, .10, .13], np.float32)          # BGR (tinta marrón oscura)
HATCH_C = np.array([.15, .18, .24], np.float32)


def sketch(img, v):
    """img: float32 BGR 0..1"""
    wob = cv2.remap(img, xx + v['wx'], yy + v['wy'], cv2.INTER_LINEAR, borderMode=cv2.BORDER_REFLECT)
    gray = cv2.cvtColor(wob, cv2.COLOR_BGR2GRAY)
    gb = cv2.GaussianBlur(gray, (0, 0), 2.2)
    e = np.abs(cv2.filter2D(gb, -1, K8))
    ink = np.clip(16 * e - .30, 0, 1) ** .8
    ink = cv2.dilate(ink, np.ones((2, 2), np.uint8))
    ink = cv2.remap(ink, xx + v['ix'], yy + v['iy'], cv2.INTER_LINEAR, borderMode=cv2.BORDER_REFLECT) * v['pn']
    bleed = cv2.remap(wob, xx + v['bx'], yy + v['by'], cv2.INTER_LINEAR, borderMode=cv2.BORDER_REFLECT)
    lum = cv2.cvtColor(bleed, cv2.COLOR_BGR2GRAY)[..., None]
    sat = lum + (bleed - lum) * .92
    wash = (sat * .86 + np.array([.10, .12, .13], np.float32)) * v['blot'][..., None]
    dark = np.clip(1.05 - 2.4 * gb, 0, 1) * hatch
    out = wash * (1 - dark[..., None]) + HATCH_C * dark[..., None]
    out = out * (1 - ink[..., None]) + INK * ink[..., None]
    return out


def read_exact(n):
    b = sys.stdin.buffer.read(n)
    if len(b) < n:
        return None
    return b


ff = subprocess.Popen([FFMPEG, '-y', '-loglevel', 'error', '-f', 'rawvideo', '-pix_fmt', 'bgr24', '-s', f'{W}x{H}', '-r', str(FPS_OUT), '-i', '-',
                       '-c:v', 'libx264', '-preset', 'slow', '-crf', '15', '-pix_fmt', 'yuv420p', '-profile:v', 'high',
                       '-color_primaries', 'bt709', '-color_trc', 'bt709', '-colorspace', 'bt709', out_path], stdin=subprocess.PIPE)
n = 0
while True:
    hdr = read_exact(4)
    if hdr is None:
        break
    a = np.frombuffer(read_exact(struct.unpack('<I', hdr)[0]), np.uint8)
    b = np.frombuffer(read_exact(struct.unpack('<I', read_exact(4))[0]), np.uint8)
    t, amt = struct.unpack('<ff', read_exact(8))
    scene = cv2.imdecode(a, cv2.IMREAD_COLOR).astype(np.float32) / 255
    over = cv2.imdecode(b, cv2.IMREAD_UNCHANGED).astype(np.float32) / 255
    v = VAR[int(t * 15 // 2) % 3]
    img = sketch(scene, v) if amt > .999 else (scene if amt < .001 else scene * (1 - amt) + sketch(scene, v) * amt)
    if over.ndim == 2:
        over = cv2.cvtColor(over, cv2.COLOR_GRAY2BGR)
    if over.shape[2] == 3:  # capa superior totalmente opaca (PNG sin alfa)
        over = np.concatenate([over, np.ones_like(over[..., :1])], axis=2)
    oa = over[..., 3:4]
    img = img * (1 - oa) + over[..., :3] * oa
    img = np.clip(img * grain[..., None] * vign[..., None], 0, 1)
    frame = (img * 255 + .5).astype(np.uint8).tobytes()
    for _ in range(DUP):
        ff.stdin.write(frame)
    n += 1
ff.stdin.close(); ff.wait()
print(f'sketchpost: {n} cuadros -> {out_path}', file=sys.stderr)
