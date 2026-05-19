#!/usr/bin/env python3
"""
render_pillow.py - Renderizador 100% Python (sin navegador)

Genera imagenes PNG 1080x1080 para Instagram/TikTok directamente con Pillow.

Tipos soportados:
  - actualitat  : single post (1 PNG)
  - llei        : carrusel 4 slides (4 PNGs: slide-1.png ... slide-4.png)

Uso:
    python3 render_pillow.py --tipo actualitat --datos paquete/datos.json --output paquete/imagen.png
    python3 render_pillow.py --tipo llei --datos paquete/datos.json --output paquete/slide.png
"""

import argparse
import json
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


# === Tokens ===
INK = (19, 19, 26)
INK_SOFT = (58, 58, 69)
WHITE = (255, 255, 255)
YELLOW = (240, 180, 0)
YELLOW_SOFT = (255, 233, 121)
AZUL_MARINO = (19, 49, 92)
AZUL_MEDIO = (40, 80, 140)
PAPER = (246, 244, 239)

# Fuentes Linux
FONT_BOLD = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
FONT_REG = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
FONT_OBLIQUE = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Oblique.ttf"

SIZE = 1080


def font(path, sz):
    return ImageFont.truetype(path, sz)


def text_wh(draw, text, fnt):
    bbox = draw.textbbox((0, 0), text, font=fnt)
    return bbox[2] - bbox[0], bbox[3] - bbox[1]


def wrap_text(text, font_obj, max_width, draw):
    words = text.split()
    lines = []
    current = ""
    for w in words:
        test = (current + " " + w).strip()
        bw, _ = text_wh(draw, test, font_obj)
        if bw <= max_width:
            current = test
        else:
            if current:
                lines.append(current)
            current = w
    if current:
        lines.append(current)
    return lines


def hex_to_rgb(hex_str):
    h = hex_str.lstrip("#")
    return tuple(int(h[i:i+2], 16) for i in (0, 2, 4))


def draw_banda_lateral(img, color, ancho=56):
    """Banda lateral izquierda con color de rama."""
    draw = ImageDraw.Draw(img)
    draw.rectangle([0, 0, ancho, SIZE], fill=color)
    return draw


def draw_footer_marca(draw, slide_num, total_slides, eyebrow="EN 60 SEGONS"):
    """Footer 72px con iP + paginador."""
    footer_top = SIZE - 72
    # Logo iP a la izquierda
    f_logo = font(FONT_BOLD, 28)
    draw.text((80, footer_top + 22), "iP InfoPol", fill=WHITE, font=f_logo)
    # Eyebrow en el centro
    f_eye = font(FONT_BOLD, 18)
    bw, _ = text_wh(draw, eyebrow, f_eye)
    draw.text(((SIZE - bw) // 2, footer_top + 27), eyebrow,
              fill=(200, 200, 210), font=f_eye)
    # Paginador
    pag = f"{slide_num}/{total_slides}"
    f_pag = font(FONT_BOLD, 22)
    bw, _ = text_wh(draw, pag, f_pag)
    draw.text((SIZE - 60 - bw, footer_top + 25), pag, fill=WHITE, font=f_pag)


# ============================================
# RENDER: ACTUALITAT (single post)
# ============================================
def render_actualitat(datos, output):
    img = Image.new("RGB", (SIZE, SIZE), AZUL_MARINO)
    draw = ImageDraw.Draw(img)

    color_banda = datos.get("color_banda", "#13315C")
    cb = hex_to_rgb(color_banda)
    icon = datos.get("icon_banda", "info")
    fecha_visual = datos.get("fecha_visual", "ACTUALITAT").upper()
    titular = datos.get("titular_largo") or datos.get("titular_corto", "")
    bullets = datos.get("bullets", [])
    font_credit = datos.get("font", "")

    BANDA_H = 90
    draw.rectangle([0, 0, SIZE, BANDA_H], fill=cb)
    f_banda = font(FONT_BOLD, 28)
    draw.text((40, 30), f"●  {fecha_visual}", fill=WHITE, font=f_banda)
    f_logo = font(FONT_BOLD, 36)
    draw.text((SIZE - 70, 26), "i", fill=WHITE, font=f_logo)
    draw.ellipse([SIZE - 80, 22, SIZE - 22, 80], outline=WHITE, width=3)

    BLOQUE_TOP = BANDA_H
    TERCIO_INF_TOP = 660
    BLOQUE_H = TERCIO_INF_TOP - BLOQUE_TOP
    for y in range(BLOQUE_TOP, TERCIO_INF_TOP):
        t = (y - BLOQUE_TOP) / max(1, BLOQUE_H)
        r = int(40 + (15 - 40) * t)
        g = int(80 + (35 - 80) * t)
        b = int(140 + (70 - 140) * t)
        draw.line([(0, y), (SIZE, y)], fill=(r, g, b))

    cx, cy = SIZE // 2, BLOQUE_TOP + BLOQUE_H // 2
    for radio, alpha in [(280, 30), (220, 60), (160, 110), (100, 180)]:
        overlay = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
        od = ImageDraw.Draw(overlay)
        od.ellipse([cx - radio, cy - radio, cx + radio, cy + radio],
                   fill=cb + (alpha,))
        img = Image.alpha_composite(img.convert("RGBA"), overlay).convert("RGB")
        draw = ImageDraw.Draw(img)

    icon_map = {"!": "!", "i": "i", "$": "$"}
    # Forzar caracteres ASCII en lugar de emoji
    icon_chars = {
        "Urgent": "!",
        "Informatiu": "i",
        "Judicial": "§",
        "Internacional": "@",
        "Sindical": "★",
    }
    tipologia = datos.get("tipologia", "Informatiu")
    icon_char = icon_chars.get(tipologia, "i")
    f_big = font(FONT_BOLD, 200)
    bw, bh = text_wh(draw, icon_char, f_big)
    draw.text((cx - bw // 2, cy - bh // 2 - 30), icon_char, fill=WHITE, font=f_big)

    f_tipo = font(FONT_BOLD, 32)
    bw, bh = text_wh(draw, tipologia.upper(), f_tipo)
    pad = 18
    rx, ry = cx - bw // 2 - pad, cy + 120
    draw.rounded_rectangle(
        [rx, ry, rx + bw + pad * 2, ry + bh + pad],
        fill=cb, radius=8
    )
    draw.text((rx + pad, ry + pad // 2), tipologia.upper(), fill=WHITE, font=f_tipo)

    draw.rectangle([0, TERCIO_INF_TOP, SIZE, SIZE], fill=AZUL_MARINO)

    titular_upper = titular.upper()
    titular_size = 56
    while titular_size >= 36:
        f_titular = font(FONT_BOLD, titular_size)
        lines = wrap_text(titular_upper, f_titular, SIZE - 100, draw)
        if len(lines) <= 3:
            break
        titular_size -= 4
    y = TERCIO_INF_TOP + 30
    line_h = int(titular_size * 1.1)
    for line in lines[:3]:
        draw.text((50, y), line, fill=WHITE, font=f_titular)
        y += line_h

    y += 10
    draw.rectangle([50, y, 200, y + 6], fill=YELLOW)
    y += 30

    f_bullet = font(FONT_REG, 26)
    for b in bullets[:3]:
        bullet_lines = wrap_text(b, f_bullet, SIZE - 130, draw)
        for i, bline in enumerate(bullet_lines):
            prefix = "• " if i == 0 else "  "
            draw.text((60, y), prefix + bline, fill=WHITE, font=f_bullet)
            y += 36

    f_footer = font(FONT_REG, 22)
    footer_y = SIZE - 50
    if font_credit:
        draw.text((50, footer_y), f"Font: {font_credit}",
                  fill=(200, 200, 220), font=f_footer)
    handle = "@infopol.app"
    bw, _ = text_wh(draw, handle, f_footer)
    draw.text((SIZE - 50 - bw, footer_y), handle,
              fill=(200, 200, 220), font=f_footer)

    img.save(output, "PNG", optimize=True)
    print(f"OK: {output}")


# ============================================
# RENDER: LLEI EN 60 SEGONS (carrusel 4 slides)
# ============================================
def render_llei_slide_1(datos, color_rama, output):
    """Slide 1 - Portada. Fondo azul marino, num articulo gigante."""
    img = Image.new("RGB", (SIZE, SIZE), AZUL_MARINO)
    draw = ImageDraw.Draw(img)
    draw_banda_lateral(img, color_rama, ancho=56)
    draw = ImageDraw.Draw(img)

    article = datos.get("article", "X")
    band_label = datos.get("bandLabel", "")
    headline = datos.get("headline", "")

    # Banda amarilla con label de la ley
    if band_label:
        f_band = font(FONT_BOLD, 22)
        band_upper = band_label.upper()
        bw, bh = text_wh(draw, band_upper, f_band)
        pad = 14
        rx = (SIZE - bw - pad * 2) // 2
        ry = 200
        draw.rounded_rectangle(
            [rx, ry, rx + bw + pad * 2, ry + bh + pad],
            fill=YELLOW, radius=4
        )
        draw.text((rx + pad, ry + pad // 2 - 2), band_upper, fill=INK, font=f_band)

    # Numero articulo GIGANTE centrado
    f_art = font(FONT_BOLD, 280)
    art_text = str(article)
    bw, bh = text_wh(draw, art_text, f_art)
    cx = SIZE // 2
    cy = SIZE // 2 - 30
    draw.text((cx - bw // 2, cy - bh // 2), art_text, fill=WHITE, font=f_art)

    # "ARTICLE" pequeño arriba del número
    f_label = font(FONT_BOLD, 26)
    label = "ARTICLE"
    bw, _ = text_wh(draw, label, f_label)
    draw.text((cx - bw // 2, cy - bh // 2 - 50), label, fill=(180, 200, 230), font=f_label)

    # "en 60 segons" debajo
    f_60 = font(FONT_BOLD, 48)
    txt60 = "en 60 segons"
    bw, _ = text_wh(draw, txt60, f_60)
    draw.text((cx - bw // 2, cy + bh // 2 + 10), txt60, fill=YELLOW, font=f_60)

    # Headline al fondo
    f_head = font(FONT_REG, 30)
    if headline:
        lines = wrap_text(headline, f_head, SIZE - 180, draw)
        y = SIZE - 220
        for line in lines[:2]:
            bw, _ = text_wh(draw, line, f_head)
            draw.text((cx - bw // 2, y), line, fill=(220, 220, 235), font=f_head)
            y += 40

    # CTA "Llisca →"
    f_cta = font(FONT_BOLD, 22)
    cta = "Llisca  →"
    bw, _ = text_wh(draw, cta, f_cta)
    cta_y = SIZE - 130
    draw.rounded_rectangle(
        [SIZE - bw - 80, cta_y - 8, SIZE - 60, cta_y + 32],
        fill=color_rama, radius=20
    )
    draw.text((SIZE - bw - 70, cta_y), cta, fill=WHITE, font=f_cta)

    # Footer
    draw_footer_marca(draw, 1, 4)
    img.save(output, "PNG", optimize=True)


def render_llei_slide_2(datos, color_rama, output):
    """Slide 2 - Que diu. Fondo blanco/papel, cita textual."""
    img = Image.new("RGB", (SIZE, SIZE), PAPER)
    draw = ImageDraw.Draw(img)
    draw_banda_lateral(img, color_rama, ancho=56)
    draw = ImageDraw.Draw(img)

    quote = datos.get("quote", "")
    quote_ref = datos.get("quoteRef", "")

    # Header pequeño
    f_header = font(FONT_BOLD, 24)
    draw.text((100, 80), "QUÈ DIU", fill=color_rama, font=f_header)
    draw.rectangle([100, 115, 180, 121], fill=color_rama)

    # Comillas grandes amarillas decorativas
    f_quote_marks = font(FONT_BOLD, 220)
    draw.text((85, 130), '"', fill=YELLOW, font=f_quote_marks)

    # Cita textual - autoajuste de tamaño
    quote_size = 38
    margin = 120
    while quote_size >= 22:
        f_quote = font(FONT_BOLD, quote_size)
        lines = wrap_text(quote, f_quote, SIZE - margin * 2, draw)
        line_h = int(quote_size * 1.35)
        total_h = len(lines) * line_h
        if total_h <= 560:
            break
        quote_size -= 2

    y_start = 320
    for line in lines:
        draw.text((margin, y_start), line, fill=INK, font=f_quote)
        y_start += line_h

    # Referencia de la ley
    if quote_ref:
        f_ref = font(FONT_BOLD, 26)
        ref_text = f"— {quote_ref}"
        draw.text((margin, SIZE - 200), ref_text, fill=color_rama, font=f_ref)

    # Footer
    # Fondo oscuro para el footer
    draw.rectangle([0, SIZE - 72, SIZE, SIZE], fill=AZUL_MARINO)
    draw_footer_marca(draw, 2, 4)
    img.save(output, "PNG", optimize=True)


def render_llei_slide_3(datos, color_rama, output):
    """Slide 3 - Exemple practic. Fondo azul medio, bullets."""
    img = Image.new("RGB", (SIZE, SIZE), AZUL_MEDIO)
    draw = ImageDraw.Draw(img)

    # Gradiente azul medio a marino
    for y in range(SIZE):
        t = y / SIZE
        r = int(40 + (19 - 40) * t)
        g = int(80 + (49 - 80) * t)
        b = int(140 + (92 - 140) * t)
        draw.line([(0, y), (SIZE, y)], fill=(r, g, b))

    draw_banda_lateral(img, color_rama, ancho=56)
    draw = ImageDraw.Draw(img)

    example = datos.get("exampleTitle", "")
    bullets = datos.get("bullets", [])

    # Header
    f_header = font(FONT_BOLD, 24)
    draw.text((100, 80), "EXEMPLE PRÀCTIC", fill=YELLOW, font=f_header)
    draw.rectangle([100, 115, 240, 121], fill=YELLOW)

    # Icono grande en circulo
    icon_y = 180
    cx = 250
    draw.ellipse([cx - 70, icon_y, cx + 70, icon_y + 140], fill=color_rama)
    f_icon = font(FONT_BOLD, 90)
    icon_text = "!"  # Generico
    bw, bh = text_wh(draw, icon_text, f_icon)
    draw.text((cx - bw // 2, icon_y + 70 - bh // 2 - 10), icon_text, fill=WHITE, font=f_icon)

    # Ejemplo como texto al lado del icono
    f_ex = font(FONT_BOLD, 28)
    ex_lines = wrap_text(example, f_ex, SIZE - 380, draw)
    y = icon_y + 20
    for line in ex_lines[:3]:
        draw.text((360, y), line, fill=WHITE, font=f_ex)
        y += 38

    # Bullets
    y_bullets_start = 420
    f_bullet_title = font(FONT_BOLD, 22)
    draw.text((100, y_bullets_start), "PUNTS CLAU", fill=YELLOW, font=f_bullet_title)
    y = y_bullets_start + 50

    f_bullet = font(FONT_REG, 30)
    for b in bullets[:3]:
        # Numero en circulito
        num_x = 110
        draw.ellipse([num_x - 22, y - 5, num_x + 22, y + 39], fill=YELLOW)
        f_num = font(FONT_BOLD, 24)
        num_text = str(bullets.index(b) + 1)
        bw, _ = text_wh(draw, num_text, f_num)
        draw.text((num_x - bw // 2, y), num_text, fill=INK, font=f_num)
        # Texto bullet
        b_lines = wrap_text(b, f_bullet, SIZE - 260, draw)
        for i, bline in enumerate(b_lines):
            draw.text((170, y + i * 38), bline, fill=WHITE, font=f_bullet)
        y += 38 * len(b_lines) + 25

    # Footer
    draw.rectangle([0, SIZE - 72, SIZE, SIZE], fill=AZUL_MARINO)
    draw_footer_marca(draw, 3, 4)
    img.save(output, "PNG", optimize=True)


def render_llei_slide_4(datos, color_rama, output):
    """Slide 4 - Recorda. Fondo azul marino, frase destacada + CTA."""
    img = Image.new("RGB", (SIZE, SIZE), AZUL_MARINO)
    draw = ImageDraw.Draw(img)
    draw_banda_lateral(img, color_rama, ancho=56)
    draw = ImageDraw.Draw(img)

    remember = datos.get("remember", {})
    pre = remember.get("pre", "")
    hi = remember.get("hi", "")
    post = remember.get("post", "")

    # Header
    f_header = font(FONT_BOLD, 30)
    draw.text((100, 80), "RECORDA", fill=YELLOW, font=f_header)
    draw.rectangle([100, 122, 240, 130], fill=YELLOW)

    # Frase resumen - autoajuste
    full = pre + hi + post
    sz = 56
    while sz >= 32:
        f_phrase = font(FONT_BOLD, sz)
        # wrap usando la fuente bold del highlight (todo igual de ancho)
        lines = wrap_text(full, f_phrase, SIZE - 180, draw)
        if len(lines) <= 4:
            break
        sz -= 4

    line_h = int(sz * 1.25)
    total_h = len(lines) * line_h
    y_start = (SIZE - 220 - total_h) // 2 + 100

    # Dibujamos linea a linea. Para resaltar 'hi', subrayamos con amarillo
    # Simplificación: dibujamos texto entero blanco y rectángulo amarillo translúcido detrás de hi
    f_phrase = font(FONT_BOLD, sz)
    y = y_start
    full_text = pre + hi + post
    hi_start_idx = len(pre)
    hi_end_idx = hi_start_idx + len(hi)

    for line in lines:
        # Encontrar dónde está 'hi' dentro de esta línea
        # Calcular posición x donde empieza 'hi' en esta línea
        line_start_in_full = full_text.find(line)
        if line_start_in_full < 0:
            line_start_in_full = 0
        line_end_in_full = line_start_in_full + len(line)

        # Si hi está total o parcialmente en esta línea
        hi_in_line_start = max(0, hi_start_idx - line_start_in_full)
        hi_in_line_end = min(len(line), hi_end_idx - line_start_in_full)

        if hi_in_line_start < hi_in_line_end:
            # Hay parte de 'hi' en esta línea — subrayamos con amarillo
            pre_text = line[:hi_in_line_start]
            pre_w, _ = text_wh(draw, pre_text, f_phrase)
            hi_text = line[hi_in_line_start:hi_in_line_end]
            hi_w, hi_h = text_wh(draw, hi_text, f_phrase)
            # Rectángulo amarillo de fondo
            draw.rectangle(
                [90 + pre_w, y + 8, 90 + pre_w + hi_w + 8, y + sz + 12],
                fill=YELLOW
            )
            # Texto pre + hi en INK + post (sobre el rectangulo)
            draw.text((90, y), pre_text, fill=WHITE, font=f_phrase)
            draw.text((90 + pre_w + 4, y), hi_text, fill=INK, font=f_phrase)
            rest = line[hi_in_line_end:]
            rest_w, _ = text_wh(draw, rest, f_phrase)
            draw.text((90 + pre_w + hi_w + 12, y), rest, fill=WHITE, font=f_phrase)
        else:
            draw.text((90, y), line, fill=WHITE, font=f_phrase)
        y += line_h

    # CTA inferior
    f_cta = font(FONT_BOLD, 22)
    cta = "📌 Guarda  ·  🔄 Comparteix  ·  💬 Comenta"
    cta = "GUARDA  -  COMPARTEIX  -  COMENTA"
    bw, _ = text_wh(draw, cta, f_cta)
    cta_y = SIZE - 200
    draw.rounded_rectangle(
        [(SIZE - bw - 60) // 2, cta_y - 12, (SIZE + bw + 60) // 2, cta_y + 38],
        fill=color_rama, radius=24
    )
    draw.text(((SIZE - bw) // 2, cta_y), cta, fill=WHITE, font=f_cta)

    # Footer
    draw_footer_marca(draw, 4, 4)
    img.save(output, "PNG", optimize=True)


def render_llei(datos, output_base):
    """
    Genera los 4 slides del carrusel.
    output_base es el path base (ej. paquete/slide.png).
    Genera: slide-1.png, slide-2.png, slide-3.png, slide-4.png
    """
    color_rama = hex_to_rgb(datos.get("color_rama_hex", "#8B0000"))

    base = Path(output_base)
    parent = base.parent
    stem = base.stem
    ext = base.suffix or ".png"

    outputs = [parent / f"{stem}-{i}{ext}" for i in range(1, 5)]

    render_llei_slide_1(datos, color_rama, outputs[0])
    render_llei_slide_2(datos, color_rama, outputs[1])
    render_llei_slide_3(datos, color_rama, outputs[2])
    render_llei_slide_4(datos, color_rama, outputs[3])

    for o in outputs:
        print(f"OK: {o}")


# ============================================
# Main
# ============================================
def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--tipo", required=True, choices=["actualitat", "llei"])
    parser.add_argument("--datos", required=True, type=Path)
    parser.add_argument("--output", required=True, type=Path)
    args = parser.parse_args()
    with open(args.datos, "r", encoding="utf-8") as f:
        datos = json.load(f)
    if args.tipo == "actualitat":
        render_actualitat(datos, args.output)
    elif args.tipo == "llei":
        render_llei(datos, args.output)


if __name__ == "__main__":
    main()
