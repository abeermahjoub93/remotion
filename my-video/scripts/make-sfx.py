# Synthesizes the sound effects used in the video (no music).
import numpy as np
from scipy.signal import butter, sosfilt
from scipy.io import wavfile

SR = 48000
OUT = 'public/sfx/'
rng = np.random.default_rng(7)


def t(d):
    return np.arange(int(SR * d)) / SR


def env(n, a, r, curve=4.0):
    x = np.linspace(0, 1, n)
    e = np.minimum(x / max(a, 1e-4), 1.0)
    return e * np.exp(-curve * np.clip((x - a) / max(r, 1e-4), 0, None))


def bp(x, lo, hi, order=2):
    return sosfilt(butter(order, [lo, hi], 'bandpass', fs=SR, output='sos'), x)


def lp(x, f, order=2):
    return sosfilt(butter(order, f, 'lowpass', fs=SR, output='sos'), x)


def hp(x, f, order=2):
    return sosfilt(butter(order, f, 'highpass', fs=SR, output='sos'), x)


def save(name, x, gain=0.8):
    x = x / (np.max(np.abs(x)) + 1e-9) * gain
    st = np.stack([x, x], axis=1)
    wavfile.write(OUT + name, SR, (st * 32767).astype(np.int16))


def sweep_noise(d, f0, f1, q=0.6):
    n = int(SR * d)
    noise = rng.standard_normal(n)
    out = np.zeros(n)
    blk = 512
    for i in range(0, n, blk):
        p = i / n
        f = f0 * (f1 / f0) ** p
        seg = noise[max(0, i - 2048):i + blk]
        y = bp(seg, max(40, f * (1 - q)), min(SR / 2 - 100, f * (1 + q)))
        out[i:i + blk] = y[-len(out[i:i + blk]):]
    return out


# whoosh: band-passed noise sweeping up then down, bell-shaped envelope
d = 0.7
x = sweep_noise(d, 300, 2400)
w = np.sin(np.linspace(0, np.pi, len(x))) ** 2
save('whoosh.wav', x * w, 0.7)

d = 0.4
x = sweep_noise(d, 600, 4000)
w = np.sin(np.linspace(0, np.pi, len(x))) ** 3
save('swish.wav', x * w, 0.55)

# pop: sine with fast pitch drop
tt = t(0.14)
f = 900 * np.exp(-tt * 25) + 260
x = np.sin(2 * np.pi * np.cumsum(f) / SR) * env(len(tt), 0.004, 0.25, 6)
save('pop.wav', x, 0.7)

# click: two filtered transients (mouse down / up)
x = np.zeros(int(SR * 0.12))
for off, g in [(0, 1.0), (0.055, 0.6)]:
    i = int(off * SR)
    b = hp(rng.standard_normal(500), 2500) * env(500, 0.001, 0.15, 8)
    x[i:i + 500] += b * g
save('click.wav', x, 0.75)

# tick: woodblock
tt = t(0.09)
x = (np.sin(2 * np.pi * 1850 * tt) + 0.5 * np.sin(2 * np.pi * 3300 * tt)) * env(len(tt), 0.001, 0.2, 9)
x += hp(rng.standard_normal(len(tt)), 3000) * env(len(tt), 0.0005, 0.04, 10) * 0.4
save('tick.wav', x, 0.6)

# tock (last countdown beat, lower)
tt = t(0.12)
x = (np.sin(2 * np.pi * 1100 * tt) + 0.4 * np.sin(2 * np.pi * 2200 * tt)) * env(len(tt), 0.001, 0.3, 8)
save('tock.wav', x, 0.65)

# alert: two-tone soft square warning
tt = t(0.5)
f = np.where(tt < 0.25, 880, 660)
sq = np.sign(np.sin(2 * np.pi * np.cumsum(f) / SR))
x = lp(sq, 2500) * env(len(tt), 0.01, 0.9, 2.5)
x *= np.where((tt % 0.25) < 0.2, 1, 0.0)
save('alert.wav', lp(x, 3000), 0.45)

# ding: bell with inharmonic partials
tt = t(1.6)
x = sum(a * np.sin(2 * np.pi * 1320 * r * tt) * np.exp(-tt * k)
        for r, a, k in [(1, 1, 3), (2.01, 0.5, 4.5), (2.76, 0.35, 6), (5.4, 0.2, 9)])
x *= env(len(tt), 0.002, 1, 0)
save('ding.wav', x, 0.5)

# notification: two-note marimba
x = np.zeros(int(SR * 0.6))
for off, fr in [(0, 1046.5), (0.11, 1568)]:
    tt = t(0.45)
    n = (np.sin(2 * np.pi * fr * tt) + 0.25 * np.sin(2 * np.pi * fr * 4 * tt)) * np.exp(-tt * 9)
    i = int(off * SR)
    x[i:i + len(n)] += n
save('notify.wav', x, 0.6)

# stamp: low thud + paper slap
tt = t(0.45)
f = 140 * np.exp(-tt * 12) + 50
thud = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 10)
slap = bp(rng.standard_normal(len(tt)), 300, 3000) * np.exp(-tt * 40)
save('stamp.wav', thud * 1.0 + slap * 0.7, 0.85)

# scan: rising tone with tremolo (magnifier / highlight)
tt = t(0.7)
f = 500 + 1300 * (tt / tt[-1]) ** 1.5
x = np.sin(2 * np.pi * np.cumsum(f) / SR) * (0.6 + 0.4 * np.sin(2 * np.pi * 28 * tt))
x *= np.sin(np.linspace(0, np.pi, len(tt)))
save('scan.wav', x, 0.35)

# riser: noise rising into a hit
d = 1.2
x = sweep_noise(d, 200, 6000, 0.5)
x *= np.linspace(0, 1, len(x)) ** 2.2
save('riser.wav', x, 0.55)

# typing: keyboard clicks
x = np.zeros(int(SR * 1.0))
p = 0.0
while p < 0.92:
    i = int(p * SR)
    b = bp(rng.standard_normal(700), 1500, 7000) * env(700, 0.0005, 0.12, 9) * rng.uniform(0.5, 1)
    x[i:i + 700] += b
    p += rng.uniform(0.06, 0.13)
save('typing.wav', x, 0.5)

# success: ascending three-note chime
x = np.zeros(int(SR * 1.0))
for k, fr in enumerate([784, 988, 1318.5]):
    tt = t(0.6)
    n = (np.sin(2 * np.pi * fr * tt) + 0.3 * np.sin(2 * np.pi * fr * 2 * tt)) * np.exp(-tt * 6)
    i = int(k * 0.09 * SR)
    x[i:i + len(n)] += n
save('success.wav', x, 0.5)

# glitch: bit-crushed bursts
x = np.zeros(int(SR * 0.35))
for k in range(6):
    i = int(rng.uniform(0, 0.3) * SR)
    L = int(rng.uniform(0.015, 0.05) * SR)
    seg = np.sign(np.sin(2 * np.pi * rng.uniform(200, 1800) * t(L / SR))) * rng.uniform(0.4, 1)
    x[i:i + L] += seg[:len(x[i:i + L])]
x = np.round(x * 4) / 4
save('glitch.wav', lp(x, 6000), 0.35)

# fast clock: rapid ticking for "rushed"
x = np.zeros(int(SR * 1.6))
tick = (np.sin(2 * np.pi * 2400 * t(0.03))) * env(int(SR * 0.03), 0.001, 0.2, 9)
p = 0.0
k = 0
while p < 1.55:
    i = int(p * SR)
    x[i:i + len(tick)] += tick * (1 if k % 2 == 0 else 0.6)
    p += 0.1
    k += 1
save('clock-fast.wav', x, 0.45)

# thud (soft impact for big text)
tt = t(0.35)
f = 90 * np.exp(-tt * 8) + 45
x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 9)
x += lp(rng.standard_normal(len(tt)), 400) * np.exp(-tt * 30) * 0.4
save('thud.wav', x, 0.8)
print('done')
