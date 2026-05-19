from PIL import Image, ImageDraw, ImageFont
from pathlib import Path

# === Tokens (re-importables) ===
INK = (19, 19, 26)
WHITE = (255, 255, 255)
YELLOW = (240, 180, 0)
AZUL_MARINO = (19, 49, 92)
AZUL_MEDIO = (40, 80, 140)
PAPER = (246, 244, 239)

FONT_BOLD = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
FONT_REG = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
SIZE = 1080

def font(p, sz): return ImageFont.truetype(p, sz)

def tw(draw, t, f):
    b = draw.textbbox((0,0), t, font=f)
    return b[2]-b[0], b[3]-b[1]

def wrap(text, fnt, max_w, draw):
    words = text.split()
    lines, cur = [], ""
    for w in words:
        t = (cur + " " + w).strip()
        bw, _ = tw(draw, t, fnt)
        if bw <= max_w: cur = t
        else:
            if cur: lines.append(cur)
            cur = w
    if cur: lines.append(cur)
    return lines

def hex2rgb(s):
    h = s.lstrip("#")
    return tuple(int(h[i:i+2], 16) for i in (0,2,4))

def banda_lateral(img, color, ancho=56):
    d = ImageDraw.Draw(img)
    d.rectangle([0, 0, ancho, SIZE], fill=color)

def footer_marca(draw, slide_num, total=4, eyebrow="EN 60 SEGONS"):
    ft = SIZE - 72
    f_logo = font(FONT_BOLD, 28)
    draw.text((80, ft+22), "iP InfoPol", fill=WHITE, font=f_logo)
    f_eye = font(FONT_BOLD, 18)
    bw, _ = tw(draw, eyebrow, f_eye)
    draw.text(((SIZE - bw)//2, ft+27), eyebrow, fill=(200,200,210), font=f_eye)
    pag = f"{slide_num}/{total}"
    f_p = font(FONT_BOLD, 22)
    bw, _ = tw(draw, pag, f_p)
    draw.text((SIZE - 60 - bw, ft+25), pag, fill=WHITE, font=f_p)

# === SLIDE 1: Portada ===
def slide1(datos, color_rama, output):
    img = Image.new("RGB", (SIZE, SIZE), AZUL_MARINO)
    draw = ImageDraw.Draw(img)
    banda_lateral(img, color_rama, 56)
    draw = ImageDraw.Draw(img)

    article = str(datos.get("article", "X"))
    band_label = datos.get("bandLabel", "")
    headline = datos.get("headline", "")

    if band_label:
        f_b = font(FONT_BOLD, 22)
        bu = band_label.upper()
        bw, bh = tw(draw, bu, f_b)
        pad = 14
        rx = (SIZE - bw - pad*2)//2
        ry = 200
        draw.rounded_rectangle([rx, ry, rx+bw+pad*2, ry+bh+pad], fill=YELLOW, radius=4)
        draw.text((rx+pad, ry+pad//2 - 2), bu, fill=INK, font=f_b)

    # Article gigante
    f_art = font(FONT_BOLD, 280)
    bw, bh = tw(draw, article, f_art)
    cx = SIZE//2
    cy = SIZE//2 - 30
    # Etiqueta "ARTICLE"
    f_l = font(FONT_BOLD, 26)
    bw_l, _ = tw(draw, "ARTICLE", f_l)
    draw.text((cx - bw_l//2, cy - bh//2 - 50), "ARTICLE", fill=(180,200,230), font=f_l)
    # Numero
    draw.text((cx - bw//2, cy - bh//2), article, fill=WHITE, font=f_art)
    # "en 60 segons"
    f_60 = font(FONT_BOLD, 48)
    txt = "en 60 segons"
    bw, _ = tw(draw, txt, f_60)
    draw.text((cx - bw//2, cy + bh//2 + 10), txt, fill=YELLOW, font=f_60)

    # Headline
    if headline:
        f_h = font(FONT_REG, 30)
        lines = wrap(headline, f_h, SIZE - 180, draw)
        y = SIZE - 220
        for line in lines[:2]:
            bw, _ = tw(draw, line, f_h)
            draw.text((cx - bw//2, y), line, fill=(220,220,235), font=f_h)
            y += 40

    # CTA "Llisca"
    f_cta = font(FONT_BOLD, 22)
    cta = "Llisca  >"
    bw, _ = tw(draw, cta, f_cta)
    cta_y = SIZE - 130
    draw.rounded_rectangle([SIZE-bw-80, cta_y-8, SIZE-60, cta_y+32], fill=color_rama, radius=20)
    draw.text((SIZE-bw-70, cta_y), cta, fill=WHITE, font=f_cta)

    footer_marca(draw, 1)
    img.save(output, "PNG", optimize=True)
    print(f"OK: {output}")


# === SLIDE 2: Que diu ===
def slide2(datos, color_rama, output):
    img = Image.new("RGB", (SIZE, SIZE), PAPER)
    draw = ImageDraw.Draw(img)
    banda_lateral(img, color_rama, 56)
    draw = ImageDraw.Draw(img)

    quote = datos.get("quote", "")
    quote_ref = datos.get("quoteRef", "")

    f_h = font(FONT_BOLD, 24)
    draw.text((100, 80), "QUE DIU", fill=color_rama, font=f_h)
    draw.rectangle([100, 115, 180, 121], fill=color_rama)

    # Comillas decorativas
    f_qm = font(FONT_BOLD, 220)
    draw.text((85, 130), '"', fill=YELLOW, font=f_qm)

    # Cita autoajuste
    sz = 38
    while sz >= 22:
        f_q = font(FONT_BOLD, sz)
        lines = wrap(quote, f_q, SIZE - 240, draw)
        lh = int(sz * 1.35)
        if len(lines) * lh <= 520: break
        sz -= 2

    y = 320
    for line in lines:
        draw.text((120, y), line, fill=INK, font=f_q)
        y += lh

    if quote_ref:
        f_r = font(FONT_BOLD, 26)
        draw.text((120, SIZE - 200), f"— {quote_ref}", fill=color_rama, font=f_r)

    # Footer fondo
    draw.rectangle([0, SIZE-72, SIZE, SIZE], fill=AZUL_MARINO)
    footer_marca(draw, 2)
    img.save(output, "PNG", optimize=True)
    print(f"OK: {output}")


# === SLIDE 3: Exemple practic ===
def slide3(datos, color_rama, output):
    img = Image.new("RGB", (SIZE, SIZE), AZUL_MEDIO)
    draw = ImageDraw.Draw(img)
    # Gradiente
    for y in range(SIZE):
        t = y / SIZE
        r = int(40 + (19-40)*t)
        g = int(80 + (49-80)*t)
        b = int(140 + (92-140)*t)
        draw.line([(0,y),(SIZE,y)], fill=(r,g,b))
    banda_lateral(img, color_rama, 56)
    draw = ImageDraw.Draw(img)

    example = datos.get("exampleTitle", "")
    bullets = datos.get("bullets", [])

    f_h = font(FONT_BOLD, 24)
    draw.text((100, 80), "EXEMPLE PRACTIC", fill=YELLOW, font=f_h)
    draw.rectangle([100, 115, 270, 121], fill=YELLOW)

    # Icono circulo
    icon_y = 180
    cx = 230
    draw.ellipse([cx-70, icon_y, cx+70, icon_y+140], fill=color_rama)
    f_ic = font(FONT_BOLD, 90)
    bw, bh = tw(draw, "!", f_ic)
    draw.text((cx-bw//2, icon_y+70-bh//2-10), "!", fill=WHITE, font=f_ic)

    # Ejemplo
    f_ex = font(FONT_BOLD, 28)
    ex_lines = wrap(example, f_ex, SIZE - 380, draw)
    y = icon_y + 20
    for line in ex_lines[:3]:
        draw.text((340, y), line, fill=WHITE, font=f_ex)
        y += 38

    # Bullets
    yb = 420
    f_bt = font(FONT_BOLD, 22)
    draw.text((100, yb), "PUNTS CLAU", fill=YELLOW, font=f_bt)
    y = yb + 50
    f_b = font(FONT_REG, 28)
    for idx, b in enumerate(bullets[:3], 1):
        nx = 110
        draw.ellipse([nx-22, y-5, nx+22, y+39], fill=YELLOW)
        f_n = font(FONT_BOLD, 24)
        bw, _ = tw(draw, str(idx), f_n)
        draw.text((nx-bw//2, y), str(idx), fill=INK, font=f_n)
        bl = wrap(b, f_b, SIZE - 260, draw)
        for i, bline in enumerate(bl):
            draw.text((160, y + i*36), bline, fill=WHITE, font=f_b)
        y += 36 * len(bl) + 25

    draw.rectangle([0, SIZE-72, SIZE, SIZE], fill=AZUL_MARINO)
    footer_marca(draw, 3)
    img.save(output, "PNG", optimize=True)
    print(f"OK: {output}")


# === SLIDE 4: Recorda ===
def slide4(datos, color_rama, output):
    img = Image.new("RGB", (SIZE, SIZE), AZUL_MARINO)
    draw = ImageDraw.Draw(img)
    banda_lateral(img, color_rama, 56)
    draw = ImageDraw.Draw(img)

    r = datos.get("remember", {})
    pre, hi, post = r.get("pre",""), r.get("hi",""), r.get("post","")

    f_h = font(FONT_BOLD, 30)
    draw.text((100, 80), "RECORDA", fill=YELLOW, font=f_h)
    draw.rectangle([100, 122, 240, 130], fill=YELLOW)

    full = pre + hi + post
    sz = 56
    while sz >= 32:
        f_p = font(FONT_BOLD, sz)
        lines = wrap(full, f_p, SIZE - 180, draw)
        if len(lines) <= 4: break
        sz -= 4

    lh = int(sz * 1.25)
    y_start = (SIZE - 220 - len(lines)*lh)//2 + 100
    f_p = font(FONT_BOLD, sz)

    y = y_start
    hi_s = len(pre)
    hi_e = hi_s + len(hi)
    # Recalcular en cada linea (simplificación)
    for line in lines:
        line_pos = full.find(line)
        if line_pos < 0: line_pos = 0
        line_end = line_pos + len(line)
        sin_line = max(0, hi_s - line_pos)
        ein_line = min(len(line), hi_e - line_pos)
        if sin_line < ein_line:
            pre_t = line[:sin_line]
            pre_w, _ = tw(draw, pre_t, f_p)
            hi_t = line[sin_line:ein_line]
            hi_w, _ = tw(draw, hi_t, f_p)
            draw.rectangle([90+pre_w, y+8, 90+pre_w+hi_w+8, y+sz+12], fill=YELLOW)
            draw.text((90, y), pre_t, fill=WHITE, font=f_p)
            draw.text((90+pre_w+4, y), hi_t, fill=INK, font=f_p)
            rest = line[ein_line:]
            rest_w, _ = tw(draw, rest, f_p)
            draw.text((90+pre_w+hi_w+12, y), rest, fill=WHITE, font=f_p)
        else:
            draw.text((90, y), line, fill=WHITE, font=f_p)
        y += lh

    # CTA
    f_cta = font(FONT_BOLD, 22)
    cta = "GUARDA  -  COMPARTEIX  -  COMENTA"
    bw, _ = tw(draw, cta, f_cta)
    cy = SIZE - 200
    draw.rounded_rectangle([(SIZE-bw-60)//2, cy-12, (SIZE+bw+60)//2, cy+38], fill=color_rama, radius=24)
    draw.text(((SIZE-bw)//2, cy), cta, fill=WHITE, font=f_cta)

    footer_marca(draw, 4)
    img.save(output, "PNG", optimize=True)
    print(f"OK: {output}")


def render_llei(datos, output_base):
    color = hex2rgb(datos.get("color_rama_hex", "#8B0000"))
    base = Path(output_base)
    p = base.parent
    stem = base.stem
    ext = base.suffix or ".png"
    slide1(datos, color, p / f"{stem}-1{ext}")
    slide2(datos, color, p / f"{stem}-2{ext}")
    slide3(datos, color, p / f"{stem}-3{ext}")
    slide4(datos, color, p / f"{stem}-4{ext}")
