# Favicon: znak Q na białym tle. Źródło: tools/q-light-big.png (tworzy go tools/logo-light.py).
# Użycie: python3 tools/favicon.py   (wymaga: pillow)
from PIL import Image, ImageDraw
A = "src/assets/"
q = Image.open("tools/q-light-big.png").convert("RGBA")
q = q.crop(q.getbbox())                                   # przytnij do samego znaku

def icon(size, pad, radius):
    """Biały kwadrat (opcjonalnie zaokrąglony), Q wyśrodkowane optycznie z marginesem `pad`."""
    S = size * 4                                          # rysujemy 4x większe i zmniejszamy: gładkie krawędzie
    box = round(S * (1 - 2 * pad))
    k = min(box / q.width, box / q.height)
    g = q.resize((round(q.width * k), round(q.height * k)), Image.LANCZOS)
    bg = Image.new("RGBA", (S, S), (255, 255, 255, 255))
    bg.alpha_composite(g, ((S - g.width) // 2, (S - g.height) // 2))
    if radius:
        m = Image.new("L", (S, S), 0)
        ImageDraw.Draw(m).rounded_rectangle((0, 0, S - 1, S - 1), radius=round(S * radius), fill=255)
        bg.putalpha(m)
    return bg.resize((size, size), Image.LANCZOS)

icon(512, 0.14, 0).convert("RGB").save(A + "brand/icon-512.png", optimize=True)     # Android: pełny kwadrat, zapas na maskę
icon(192, 0.14, 0).convert("RGB").save(A + "brand/icon-192.png", optimize=True)
icon(180, 0.12, 0).convert("RGB").save(A + "apple-touch-icon.png", optimize=True)   # iOS sam zaokrągla rogi
icon(32, 0.06, 0.2).save(A + "favicon-32.png", optimize=True)                       # karta przeglądarki
ico = [icon(s, 0.06 if s > 16 else 0.03, 0.2) for s in (48, 32, 16)]
ico[0].save(A + "favicon.ico", sizes=[(48, 48), (32, 32), (16, 16)], append_images=ico[1:])
