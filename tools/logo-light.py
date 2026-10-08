# Wycięcie logo z ciemnego tła do wersji na jasne tło. Praca w 3x, żeby krawędzie były gładkie.
# Użycie: python3 tools/logo-light.py src/assets/brand/logo-original.jpg src/assets/brand /tmp   (wymaga: pillow, numpy, scipy)
import sys, numpy as np
from PIL import Image
from scipy import ndimage as ndi
src, out_dir, dbg = sys.argv[1], sys.argv[2], sys.argv[3]
K = 3
im = Image.open(src).convert("RGB")
x0, y0, x1, y1 = 72-16, 227-16, 1304+16, 540+14
crop = im.crop((x0, y0, x1, y1))
big = crop.resize((crop.width*K, crop.height*K), Image.LANCZOS)
a = np.asarray(big).astype(float)
sm = ndi.gaussian_filter(a, sigma=(1.2, 1.2, 0))            # wygładzenie szumu JPG
R, G, B = sm[..., 0], sm[..., 1], sm[..., 2]
mx = sm.max(2)
H, W = mx.shape
yy, xx = np.mgrid[0:H, 0:W]
X = lambda v: (v - x0) * K
Y = lambda v: (v - y0) * K
sub = (yy > Y(492)) & (xx > X(405))                                            # podpis ELEKTROINSTALACJE
cy = (xx > X(1008)) & ~sub                                   # kropka + PL (cyjan)
rest = ~sub & ~cy                                            # Q + MALA

# 1) tło-podobne piksele; w strefie cyjanu próg wysoki, żeby poświata liczyła się jako tło
bgl = np.zeros((H, W), bool)
bgl[rest] = np.where(xx < X(405), (mx < 84) & ((B - R) < 52), mx < 112)[rest]   # Q łagodnie, litery MALA ostrzej
bgl[cy] = (mx < 150)[cy]
bgl[sub] = (mx < 138)[sub]
# 2) tło = to, co połączone z brzegiem (kanałem szerszym niż ~5 px) + wnętrza liter
core = ndi.binary_erosion(bgl, iterations=3, border_value=1)
lab, n = ndi.label(core)
seeds = [(2, 2), (H-3, 2), (2, W-3), (H-3, W-3),
         (int(Y(383)), int(X(230))),      # środek Q
         (int(Y(372)), int(X(676))),      # pierwsze A
         (int(Y(372)), int(X(929))),      # drugie A
         (int(Y(352)), int(X(1121)))]     # P
keep = {lab[s] for s in seeds if lab[s] > 0}
print("seed labels", [int(lab[s]) for s in seeds])
bg = np.isin(lab, list(keep))
bg = ndi.binary_dilation(bg, iterations=3) & bgl
fg = ~bg
# podpis: zwykły próg jasności (litery są jasne, tło ciemne)
fg[sub] = (mx >= 138)[sub]
# 3) porządki: usuń drobiny i wypustki po rozbłyskach, zamknij dziurki
fg_c = ndi.binary_opening(fg, structure=ndi.generate_binary_structure(2, 1), iterations=5)
fg = np.where(cy, fg_c, fg)
fg = ndi.binary_opening(fg, iterations=2)
lab2, n2 = ndi.label(fg)
sizes = ndi.sum(fg, lab2, range(1, n2+1))
fg = np.isin(lab2, [i+1 for i, s in enumerate(sizes) if s >= 500])
holes, nh = ndi.label(~fg)
hs = ndi.sum(~fg, holes, range(1, nh+1))
fg |= np.isin(holes, [i+1 for i, s in enumerate(hs) if s < 260])
print("components", int(fg.sum()), n2, nh)

# 4) kolor: piksele przy krawędzi biorą kolor z wnętrza litery (bez ciemnej obwódki)
inner = ndi.binary_erosion(fg, iterations=5)
idx = ndi.distance_transform_edt(~inner, return_distances=False, return_indices=True)
col = a[idx[0], idx[1]]
col = np.where(inner[..., None], a, col)

def finish(col, name, light):
    c = col.copy()
    if light:
        c[sub] = np.array([35., 80., 196.])                               # podpis w błękicie marki
        c[cy] = c[cy] * np.array([0.12, 0.76, 0.90])                      # cyjan ciemniejszy, czytelny na bieli
        q = (xx < X(405)) & ~sub
        mn, mxx = c.min(2), c.max(2)
        k = (np.clip((mn - 120) / 60, 0, 1) * (q & ((mxx - mn) < 95)))[..., None]
        c = c * (1 - k) + c * np.array([0.50, 0.58, 0.74]) * k            # srebrna krawędź Q → stal
    al = ndi.gaussian_filter(fg.astype(float), 0.8)
    rgba = np.dstack([np.clip(c, 0, 255), al * 255]).astype("uint8")
    img = Image.fromarray(rgba, "RGBA")
    if light:  # znak Q w pełnej rozdzielczości roboczej, źródło dla favicon (tools/favicon.py)
        img.crop((0, 0, int(X(405)), img.height)).save("tools/q-light-big.png", optimize=True)
    w = 1140; h = round(img.height * w / img.width)
    img = img.resize((w, h), Image.LANCZOS)
    img.save(f"{out_dir}/{name}", optimize=True)
    return img
light = finish(col, "logo-light.png", True)
qw = round((405 - x0) * light.width / (x1 - x0))
light.crop((0, 0, qw, light.height)).save(f"{out_dir}/q-light.png", optimize=True)
print("size", light.size, "q width", qw)
for nm, box in (("all", None), ("pl", (0.72, 0, 1, 0.82)), ("q", (0, 0, 0.3, 1)), ("mid", (0.27, 0, 0.78, 1))):
    t = Image.new("RGBA", light.size, (255, 255, 255, 255)); t.alpha_composite(light)
    if box:
        t = t.crop((int(box[0]*t.width), int(box[1]*t.height), int(box[2]*t.width), int(box[3]*t.height)))
        t = t.resize((t.width*3, t.height*3), Image.LANCZOS) if nm != "mid" else t.resize((t.width*2, t.height*2), Image.LANCZOS)
    t.save(f"{dbg}/m-{nm}.png")
