#!/usr/bin/env python3
"""
render.py — Renderizador headless de plantillas InfoPol a PNG

Uso:
    python3 render.py --tipo <tipo> --datos <ruta_datos.json> --output <ruta_imagen.png>

Tipos disponibles:
    - llei        (carrusel 4 slides — genera 4 PNGs: imagen-1.png, imagen-2.png, ...)
    - actualitat  (single post 1080x1080)
    - tip         (carrusel 4-5 slides)
    - comparativa (single post 1080x1080)
    - esquema     (single post 1080x1080)
    - reforma     (single post 1080x1080)

Requisitos:
    pip install playwright
    playwright install chromium

Cómo funciona:
    1. Carga el JSX de la plantilla en /plantillas/
    2. Inyecta los datos del JSON al sustituir el array de ejemplo
    3. Abre el HTML con Chromium headless
    4. Espera a que React renderice
    5. Toma screenshot 1080x1080 (o varios para carruseles)
"""

import argparse
import json
import re
import shutil
import sys
import tempfile
from pathlib import Path

try:
    from playwright.sync_api import sync_playwright
except ImportError:
    print("ERROR: Playwright no instalado.")
    print("Instálalo con:")
    print("  pip install playwright --break-system-packages")
    print("  python3 -m playwright install chromium")
    sys.exit(1)

# Configuración
ROOT = Path(__file__).resolve().parent.parent  # redes-infopol/
PLANTILLAS = ROOT / "plantillas"

TIPOS = {
    "llei": {
        "html": "Plantilla Resum de Llei.html",
        "jsx": "plantilla-llei.jsx",
        "slides": 4,
        "data_var": "LAWS",
    },
    "actualitat": {
        "html": "Plantilla Actualitat Policial.html",
        "jsx": "plantilla-actualitat.jsx",
        "slides": 1,
        "data_var": "NEWS",  # ajustar al ver el archivo real
    },
    "tip": {
        "html": "Plantilla Tips InfoPol.html",
        "jsx": "plantilla-tip.jsx",
        "slides": 5,
        "data_var": "TIPS",
    },
    "comparativa": {
        "html": "Plantilla Comparativa.html",
        "jsx": "plantilla-comparativa.jsx",
        "slides": 1,
        "data_var": "COMPARISONS",
    },
    "esquema": {
        "html": "Plantilla Esquema Visual.html",
        "jsx": "plantilla-esquema.jsx",
        "slides": 1,
        "data_var": "SCHEMAS",
    },
    "reforma": {
        "html": "Plantilla Reforma.html",
        "jsx": "plantilla-reforma.jsx",
        "slides": 1,
        "data_var": "REFORMS",
    },
}


def inject_data(jsx_source: str, data_var: str, new_data: list) -> str:
    """
    Sustituye el array de datos (ej. LAWS = [...]) por uno nuevo.
    Asume formato: 'const VARNAME = [...]; ' en el JSX.
    """
    pattern = re.compile(
        rf"const\s+{data_var}\s*=\s*\[.*?\];",
        re.DOTALL,
    )
    new_block = f"const {data_var} = {json.dumps(new_data, ensure_ascii=False)};"
    if not pattern.search(jsx_source):
        raise RuntimeError(f"No encontré 'const {data_var} = [...]' en el JSX")
    return pattern.sub(new_block, jsx_source, count=1)


def render(tipo: str, datos_path: Path, output_path: Path):
    if tipo not in TIPOS:
        print(f"ERROR: tipo '{tipo}' desconocido. Usa uno de: {list(TIPOS.keys())}")
        sys.exit(1)

    cfg = TIPOS[tipo]
    html_file = PLANTILLAS / cfg["html"]
    jsx_file = PLANTILLAS / cfg["jsx"]

    if not html_file.exists() or not jsx_file.exists():
        print(f"ERROR: faltan archivos plantilla en {PLANTILLAS}")
        print(f"  - {html_file.exists()=}")
        print(f"  - {jsx_file.exists()=}")
        sys.exit(1)

    # Cargar datos
    with open(datos_path, "r", encoding="utf-8") as f:
        datos = json.load(f)

    # Determinar qué meter en el array. Si datos.json tiene
    # "jsx_objeto_LAW" o similar, lo metemos como elemento único del array
    new_data = []
    key_one = next((k for k in datos.keys() if k.startswith("jsx_objeto_") or k.startswith("jsx_object_")), None)
    if key_one:
        new_data = [datos[key_one]]
    elif "jsx_data_array" in datos:
        new_data = datos["jsx_data_array"]
    else:
        # Asumir que datos.json es directamente la lista
        if isinstance(datos, list):
            new_data = datos
        else:
            new_data = [datos]

    # Crear copia temporal de la carpeta plantillas con JSX modificado
    with tempfile.TemporaryDirectory() as tmp:
        tmp_dir = Path(tmp)
        # Copiar todo el bundle (necesita tokens.jsx, shared.jsx, etc.)
        for src in PLANTILLAS.iterdir():
            if src.is_file():
                shutil.copy2(src, tmp_dir / src.name)
        # Sobrescribir el JSX modificado
        jsx_source = (PLANTILLAS / cfg["jsx"]).read_text(encoding="utf-8")
        new_jsx = inject_data(jsx_source, cfg["data_var"], new_data)
        (tmp_dir / cfg["jsx"]).write_text(new_jsx, encoding="utf-8")

        # Renderizar con Playwright
        html_url = (tmp_dir / cfg["html"]).as_uri()
        with sync_playwright() as p:
            browser = p.chromium.launch()
            ctx = browser.new_context(
                viewport={"width": 1080, "height": 1080},
                device_scale_factor=2,  # retina
            )
            page = ctx.new_page()
            page.goto(html_url)
            # Esperar a que React renderice. Buscar un elemento que sepamos existe
            page.wait_for_load_state("networkidle", timeout=20000)
            page.wait_for_timeout(2000)  # dejar margen para babel

            # Capturar
            if cfg["slides"] == 1:
                page.screenshot(path=str(output_path), full_page=False)
                print(f"OK: {output_path}")
            else:
                # Carrusel: el design-canvas suele renderizar todas las slides
                # en una página vertical. Hay que recortar por viewport.
                # Por simplicidad: 1 screenshot por slide haciendo scroll
                base = output_path.with_suffix("")  # quitar .png
                ext = output_path.suffix or ".png"
                for i in range(cfg["slides"]):
                    page.evaluate(f"window.scrollTo(0, {i * 1080})")
                    page.wait_for_timeout(500)
                    out = Path(f"{base}-{i+1}{ext}")
                    page.screenshot(path=str(out), full_page=False)
                    print(f"OK slide {i+1}: {out}")

            browser.close()


def main():
    parser = argparse.ArgumentParser(description="Render InfoPol templates")
    parser.add_argument("--tipo", required=True, choices=list(TIPOS.keys()))
    parser.add_argument("--datos", required=True, type=Path)
    parser.add_argument("--output", required=True, type=Path)
    args = parser.parse_args()
    render(args.tipo, args.datos, args.output)


if __name__ == "__main__":
    main()
