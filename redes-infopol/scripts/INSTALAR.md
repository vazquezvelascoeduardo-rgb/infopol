# 📦 Cómo instalar el renderizador headless

Para que el agente genere automáticamente las imágenes PNG listas para publicar, necesitas instalar **Playwright** (un navegador automatizable). Es un proceso de **una sola vez**.

## En tu Mac/PC

Abre la Terminal y ejecuta:

```bash
# 1. Instalar Playwright
pip3 install playwright --break-system-packages

# 2. Instalar Chromium (el navegador invisible)
python3 -m playwright install chromium
```

Esto descarga ~150 MB y tarda 1-2 minutos.

## Verificar que funciona

```bash
cd "/Users/edu/Documents/infopol"  # o donde tengas la carpeta infopol
python3 redes-infopol/scripts/render.py --help
```

Si ves la ayuda con los tipos disponibles, está OK.

## Probar render con el ejemplo

```bash
cd "/Users/edu/Documents/infopol"
python3 redes-infopol/scripts/render.py \
  --tipo llei \
  --datos redes-infopol/publicaciones/2026-05-15-EJEMPLO/01-llei-art-379-cp/datos.json \
  --output /tmp/test-render.png
```

Si genera `test-render-1.png` hasta `test-render-4.png` (4 slides del carrusel), está funcionando. Ábrelos en Vista Previa para confirmar.

## Si falla

Posibles causas:
- **"ModuleNotFoundError: playwright"** → vuelve a ejecutar el `pip3 install`
- **"No browser executable found"** → ejecuta de nuevo `python3 -m playwright install chromium`
- **"Permission denied"** → añade `sudo` antes del `pip3 install`
- **Renderiza pero las slides salen vacías** → el JSX puede tener un nombre de variable distinto al esperado. Avísame y lo ajusto.

## Una vez instalado

Las tareas programadas automáticas usarán este script SIN que tengas que hacer nada más. Cuando un paquete diario esté listo, encontrarás directamente los PNGs dentro de la carpeta del paquete (no solo el brief).
