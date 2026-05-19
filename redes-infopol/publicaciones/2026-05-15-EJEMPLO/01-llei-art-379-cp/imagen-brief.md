# 🎨 Brief de imagen — Carrusel "Llei en 60 segons"

## Plantilla a usar
`plantillas/Plantilla Resum de Llei.html` (controlada por `plantilla-llei.jsx`)

## Cómo generar las 4 slides

**Opción rápida (manual con Claude Design)**:
1. Abre la plantilla `plantilla-llei.jsx` en Claude Design
2. Sustituye el primer objeto del array `LAWS` por el contenido de `datos.json` → `jsx_objeto_LAW`
3. Exporta como 4 PNGs (uno por slide)
4. Sube como carrusel a Instagram y como foto-post a TikTok

**Opción headless (próxima fase)**: el agente lo hará solo con Playwright/Puppeteer.

## Contenido específico de cada slide

### Slide 1 — Portada
- Color de banda lateral: **#E04F5F** (rojo, rama Alcohol)
- Número central: **379.2**
- Sobre el número: "CODI PENAL · ART. 379.2" en banda amarilla
- Bajo el número: "en 60 segons"
- CTA esquina: "Llisca →"

### Slide 2 — Què diu (cita textual)
- Cita entre comillas amarillas grandes: el texto de `quote`
- Tipografía: Manrope, color azul marino/ink
- Pie: "Art. 379.2 CP"

### Slide 3 — Exemple pràctic
- Icono ilustrativo: 🍺 / etilòmetre (icon `beaker`)
- Texto de `exampleTitle` arriba
- 3 bullets de `bullets[]`

### Slide 4 — Recorda
- Frase resumen destacada en amarillo:
  > "Per sobre de 0,60 mg/l ja és **delicte penal**, no només infracció."
- CTA inferior: "📌 Guarda-ho · 🔄 Comparteix · 💬 Comenta"

## Reglas de marca
- Tipografía: Manrope (display) + JetBrains Mono (mono)
- Token color rama "alcohol": solid #E04F5F, soft #FBDADC, ink #7A1B22
- Logo InfoPol abajo a la izquierda en todas las slides
