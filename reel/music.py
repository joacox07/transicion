"""Banda sonora original del Reel (sintetizada, libre de derechos).

96 BPM -> 1 compás = 2.5 s, así cada cambio de escena cae en un tiempo fuerte.
Instrumentos: colchón de cuerdas suave, celesta/caja de música en arpegios, bajo,
pulso tipo latido, campanitas en los momentos clave y "whooshes" en la entrada de cada carta.

Uso:  python3 reel/music.py   -> reel/build/music.wav
"""
import os
import wave

import numpy as np

SR = 48000
DUR = 45.0
BPM = 96
BEAT = 60 / BPM          # 0.625 s
BAR = BEAT * 4           # 2.5 s
N = int((DUR + 4) * SR)
rng = np.random.default_rng(12)

L = np.zeros(N)
R = np.zeros(N)


def mtof(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def add(sig, t0, gain=1.0, pan=0.0):
    """Suma una señal mono (o estéreo si sig es tupla) en el instante t0 con paneo -1..1."""
    i0 = int(round(t0 * SR))
    if i0 >= N:
        return
    if isinstance(sig, tuple):
        l, r = sig
    else:
        a = (pan + 1) * np.pi / 4
        l, r = sig * np.cos(a), sig * np.sin(a)
    if i0 < 0:
        l, r, i0 = l[-i0:], r[-i0:], 0
    n = min(len(l), N - i0)
    L[i0:i0 + n] += l[:n] * gain
    R[i0:i0 + n] += r[:n] * gain


def smooth_env(n, att, rel, total):
    t = np.arange(n) / SR
    a = np.clip(t / att, 0, 1) if att > 0 else np.ones(n)
    a = a * a * (3 - 2 * a)
    r = np.clip((total - t) / rel, 0, 1)
    r = r * r * (3 - 2 * r)
    return a * r


# ------------------------------------------------------------------ armonía (Re mayor)
CH = {
    'D': [50, 54, 57, 62], 'Bm': [47, 50, 54, 59], 'G': [43, 47, 50, 55],
    'A': [45, 49, 52, 57], 'Em': [40, 43, 47, 52], 'Gadd9': [43, 47, 50, 57],
}
PROG = ['D', 'Bm', 'G', 'A', 'D', 'A', 'Bm', 'G', 'D', 'A', 'G', 'A', 'Bm', 'G', 'Em', 'A', 'D', 'D']
ROOT = {'D': 38, 'Bm': 35, 'G': 31, 'A': 33, 'Em': 40, 'Gadd9': 31}

# ------------------------------------------------------------------ colchón (pad)
def pad_note(f, dur, detune=0.0016, harmonics=9, bright=1.45):
    n = int(dur * SR)
    t = np.arange(n) / SR
    outL = np.zeros(n)
    outR = np.zeros(n)
    vib = 1 + 0.0012 * np.sin(2 * np.pi * 4.6 * t)
    for k in range(1, harmonics + 1):
        amp = 1 / k ** bright
        ph = rng.random(4) * 6.283
        outL += amp * (np.sin(2 * np.pi * f * (1 - detune) * k * t * vib + ph[0]) + np.sin(2 * np.pi * f * (1 + detune * .6) * k * t + ph[1]))
        outR += amp * (np.sin(2 * np.pi * f * (1 + detune) * k * t * vib + ph[2]) + np.sin(2 * np.pi * f * (1 - detune * .6) * k * t + ph[3]))
    return outL, outR


for b, name in enumerate(PROG):
    t0 = b * BAR
    last = b == len(PROG) - 1
    dur = BAR + 1.2 if not last else 4.5
    env = smooth_env(int(dur * SR), 0.7 if b else 0.05, 1.3 if not last else 3.5, dur)
    # intensidad según la sección
    lvl = 0.75 if b < 2 else (0.8 if b < 6 else (0.95 if b < 14 else (0.7 if b == 14 else 1.0)))
    for m in CH[name]:
        l, r = pad_note(mtof(m + 12), dur)
        add((l * env * lvl, r * env * lvl), t0 - (0.4 if b else 0), gain=0.010)
    # voz alta suave
    l, r = pad_note(mtof(CH[name][-1] + 24), dur, harmonics=4, bright=2.2)
    add((l * env * lvl, r * env * lvl), t0 - (0.4 if b else 0), gain=0.0045)


# ------------------------------------------------------------------ celesta / caja de música
def celesta(f, dur=1.8, bright=1.0):
    n = int(dur * SR)
    t = np.arange(n) / SR
    s = (np.sin(2 * np.pi * f * t) * np.exp(-t * 2.6)
         + 0.35 * bright * np.sin(2 * np.pi * f * 2 * t) * np.exp(-t * 4.5)
         + 0.12 * bright * np.sin(2 * np.pi * f * 4.07 * t) * np.exp(-t * 9)
         + 0.05 * bright * np.sin(2 * np.pi * f * 6.8 * t) * np.exp(-t * 16))
    att = np.clip(t / 0.004, 0, 1)
    return s * att


ARP = [0, 1, 2, 3, 2, 1, 2, 3]
for b, name in enumerate(PROG[:-1]):
    pcs = CH[name]
    notes = [pcs[0] + 24, pcs[1] + 24, pcs[2] + 24, pcs[0] + 36]
    if b < 2:          # gancho: sólo negras, muy suave
        steps, div, g = [0, 2, 4, 6], 2, 0.06
    elif b < 4:
        steps, div, g = [0, 2, 3, 4, 6, 7], 2, 0.05
    elif b == 14:      # Eutrapelia: respiro
        steps, div, g = [0, 4], 2, 0.045
    else:
        steps, div, g = list(range(8)), 2, 0.055
    for s in steps:
        t0 = b * BAR + s * BEAT / div
        m = notes[ARP[s % 8]]
        vel = 1.0 if s % 2 == 0 else 0.7
        add(celesta(mtof(m)), t0, gain=g * vel, pan=(-0.35 if s % 2 else 0.35))
    # melodía simple en los compases centrales (una nota larga por medio compás)
    if 6 <= b <= 13 or b in (15, 16):
        mel = [pcs[2] + 36, pcs[1] + 36]
        for j, m in enumerate(mel):
            add(celesta(mtof(m), 2.4, 0.6), b * BAR + j * BAR / 2 + 0.005, gain=0.03, pan=0.0)

# ------------------------------------------------------------------ bajo
for b, name in enumerate(PROG):
    if b < 2:
        continue
    dur = BAR * (1 if b < len(PROG) - 1 else 1.8)
    n = int((dur + .8) * SR)
    t = np.arange(n) / SR
    f = mtof(ROOT[name])
    s = (np.sin(2 * np.pi * f * t) + 0.25 * np.sin(2 * np.pi * 2 * f * t) + 0.08 * np.sin(2 * np.pi * 3 * f * t))
    env = np.clip(t / 0.02, 0, 1) * np.exp(-t * 0.7) * smooth_env(n, 0, 0.6, dur + .8)
    add(s * env, b * BAR, gain=0.12 if b != 14 else 0.07)


# ------------------------------------------------------------------ latido / pulso
def thump(f0=95, f1=42, dur=0.45):
    n = int(dur * SR)
    t = np.arange(n) / SR
    f = f1 + (f0 - f1) * np.exp(-t * 22)
    ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph) * np.exp(-t * 9) * np.clip(t / 0.002, 0, 1)


for b in range(len(PROG)):
    if 6 <= b <= 13 or b in (15, 16):
        for beat in (0, 2):
            add(thump(), b * BAR + beat * BEAT, gain=0.20 if beat == 0 else 0.13)


# soft shaker (ruido filtrado) en contratiempos
def band_noise(dur, lo, hi, seed=None):
    n = int(dur * SR)
    x = np.random.default_rng(seed).normal(0, 1, n)
    X = np.fft.rfft(x)
    fr = np.fft.rfftfreq(n, 1 / SR)
    mask = np.clip((fr - lo) / (lo * .5), 0, 1) * np.clip((hi - fr) / (hi * .3), 0, 1)
    return np.fft.irfft(X * mask, n)


for b in range(6, 14):
    for e in range(8):
        if e % 2 == 1:
            n = band_noise(0.12, 5000, 14000, seed=b * 10 + e)
            t = np.arange(len(n)) / SR
            add(n * np.exp(-t * 45), b * BAR + e * BEAT / 2, gain=0.018, pan=0.25 if e % 4 == 1 else -0.25)


# ------------------------------------------------------------------ efectos sincronizados
def whoosh(dur=0.55, peak=0.4, lo=300, hi=5000, seed=1, pan_from=0.8, pan_to=-0.8):
    n0 = band_noise(dur, lo, hi, seed)
    t = np.arange(len(n0)) / SR
    env = np.where(t < peak, (t / peak) ** 2, np.exp(-(t - peak) * 10))
    s = n0 * env / (np.abs(n0).max() + 1e-9)
    pan = np.linspace(pan_from, pan_to, len(s))
    a = (pan + 1) * np.pi / 4
    return s * np.cos(a), s * np.sin(a)


def riser(dur=0.9, seed=5):
    n0 = band_noise(dur, 1500, 12000, seed)
    t = np.arange(len(n0)) / SR
    env = (t / dur) ** 3
    s = n0 / (np.abs(n0).max() + 1e-9) * env
    return s


def chimes(base=74, t0=0.0, gain=0.05, notes=(0, 4, 7, 12, 16, 19, 24), step=0.055):
    for i, d in enumerate(notes):
        add(celesta(mtof(base + d), 2.6, 0.8), t0 + i * step, gain=gain * (1 - i * 0.06), pan=-0.5 + i / len(notes))


# comienzo: campanita suave inmediata (gancho)
chimes(74, 0.0, 0.035, notes=(0, 7, 12), step=0.09)
# revelación del logo (3.75)
add(riser(0.9, 3), 3.75 - 0.9, gain=0.05)
add(thump(80, 38, 0.9), 3.75, gain=0.25)
chimes(74, 3.75, 0.05)
# caja (8.75)
add(whoosh(0.7, 0.6, 200, 3000, 7, -0.2, 0.2), 8.75 - 0.6, gain=0.07)
# abanico (12.5)
add(whoosh(0.5, 0.35, 800, 9000, 8, -0.6, 0.6), 12.5, gain=0.05)
# cartas: entran desde la derecha
for i, tc in enumerate([15.0, 17.5, 20.0, 22.5]):
    add(whoosh(0.55, 0.38, 350, 6500, 20 + i, 0.8, -0.6), tc - 0.3, gain=0.075)
# extras (25) y atril (30)
add(whoosh(0.6, 0.45, 300, 5000, 31, 0, 0), 25.25 - 0.3, gain=0.06)
chimes(81, 26.7, 0.03, notes=(0, 4, 7), step=0.07)
add(whoosh(0.6, 0.45, 250, 4000, 32, -0.3, 0.3), 30.0 - 0.4, gain=0.05)
# Eutrapelia (35.35)
chimes(79, 35.4, 0.03, notes=(0, 7, 12, 19), step=0.08)
# CTA (38.75)
add(riser(1.1, 9), 38.75 - 1.1, gain=0.05)
add(thump(80, 38, 1.0), 38.75, gain=0.25)
chimes(74, 38.75, 0.055, notes=(0, 4, 7, 12, 16, 19, 24, 28))
chimes(86, 39.9, 0.025, notes=(0, 7, 12), step=0.1)

# ------------------------------------------------------------------ reverberación (IR sintética)
ir_len = int(3.2 * SR)
ti = np.arange(ir_len) / SR


def ir(seed):
    x = np.random.default_rng(seed).normal(0, 1, ir_len) * np.exp(-ti / 0.55)
    k = np.ones(24) / 24               # suaviza -> reverb cálida
    x = np.convolve(x, k, mode='same')
    x[: int(0.018 * SR)] = 0           # pre-delay
    return x / np.sqrt((x ** 2).sum())


def fftconv(a, b):
    n = len(a) + len(b) - 1
    nf = 1 << (n - 1).bit_length()
    return np.fft.irfft(np.fft.rfft(a, nf) * np.fft.rfft(b, nf), nf)[:len(a)]


wetL = fftconv(L, ir(101))
wetR = fftconv(R, ir(202))
mixL = L + wetL * 0.55
mixR = R + wetR * 0.55

# ------------------------------------------------------------------ master
n = int(DUR * SR)
mixL, mixR = mixL[:n], mixR[:n]
t = np.arange(n) / SR
fade = np.clip(t / 0.015, 0, 1) * np.clip((DUR - t) / 1.6, 0, 1) ** 1.5
mixL *= fade
mixR *= fade
rms = np.sqrt(np.mean(np.concatenate([mixL, mixR]) ** 2))
g = 10 ** (-17 / 20) / rms
mixL, mixR = np.tanh(mixL * g * 1.1) / 1.1, np.tanh(mixR * g * 1.1) / 1.1
peak = max(np.abs(mixL).max(), np.abs(mixR).max())
if peak > 0.89:
    mixL, mixR = mixL * 0.89 / peak, mixR * 0.89 / peak

out = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'build', 'music.wav')
os.makedirs(os.path.dirname(out), exist_ok=True)
data = (np.stack([mixL, mixR], 1) * 32767).astype('<i2')
with wave.open(out, 'wb') as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(data.tobytes())
print('ok', out, f'rms={20*np.log10(np.sqrt(np.mean(data.astype(float)**2))/32767):.1f} dBFS')
