# 📱 Agente RRSS InfoPol

Sistema automático para gestionar Instagram y TikTok de InfoPol.

## 📂 Qué hay en esta carpeta

```
redes-infopol/
├── calendario-editorial.xlsx   ← tu calendario (Excel, ábrelo y edítalo)
├── plantillas/                 ← deja aquí las 6 plantillas que diseñes
├── publicaciones/              ← el agente deja aquí los paquetes listos
│   └── AAAA-MM-DD/             ← una carpeta por día
│       ├── 01-noticia-mañana/
│       ├── 02-noticia-mañana/
│       ├── 03-calendario-10h/
│       └── ...
└── historico/                  ← muévete aquí lo ya publicado
```

## 🔄 Cómo funciona el flujo

Hay **3 momentos automáticos cada día** (las tareas programadas):

| Hora | Qué hace el agente |
|------|---------------------|
| **06:00** | Lee el calendario editorial, busca info de cada publicación del día y prepara los paquetes (imagen + caption + hashtags) |
| **11:00** | Busca noticias policiales/jurídicas relevantes de España y Catalunya. Selecciona máximo 3. Las prepara como paquete |
| **19:00** | Igual que 11:00 pero por la tarde, para captar lo nuevo del día |

Cuando un paquete está listo, lo encuentras en `publicaciones/AAAA-MM-DD/` con:
- **imagen.png** → la imagen lista para subir
- **caption.txt** → el texto del post + hashtags
- **fuentes.txt** → de dónde sacó la info (solo para noticias)

## 🚀 Qué tienes que hacer tú

### Configuración inicial (una vez)
1. **Diseña las 6 plantillas** con Claude Design (o como prefieras) y déjalas en `plantillas/`
2. **Pásamelas en Cowork** para que las pueda usar (yo las dejaré integradas en el sistema)
3. **Edita la pestaña "Tipos de contenido"** del calendario y dime exactamente qué quieres en cada tipo
4. **Rellena el calendario** con las publicaciones de los próximos días/semanas

### Día a día
1. Revisa cada mañana la carpeta del día en `publicaciones/`
2. Abre cada paquete, mira imagen + caption
3. Si te gusta → súbelo a Instagram/TikTok desde el móvil
4. Si no te gusta → me dices qué cambiar
5. Después del paquete a `historico/`

## ✏️ Cómo se rellena el calendario

Abre `calendario-editorial.xlsx`. Tiene 3 pestañas:

**Calendario** — Donde planificas. Cada fila = una publicación. Rellena:
- Fecha y Hora (cuándo quieres publicar)
- Red (Instagram, TikTok o ambas)
- Tipo de contenido (de los 6 que tengas)
- Tema (qué quieres tratar, sé específico)
- Notas (cualquier instrucción especial)

**Tipos de contenido** — Define los 6 tipos de la academia.

**Instrucciones** — Resumen rápido.

## 📰 Sobre las noticias automáticas (11h y 19h)

El agente busca en fuentes oficiales y prensa:
- BOE / DOGC
- Mossos d'Esquadra (notas de prensa)
- Policía Nacional, Guardia Civil
- Sentencias TSJC, Audiencia Nacional, TS
- Prensa generalista en temas policiales/jurídicos

**Criterio de selección**:
- Relevancia para opositor de policía local catalana
- Que aporte valor formativo (no chismes ni morbo)
- Máximo 3 por revisión
- Si no hay nada interesante, NO publica nada

## 🆘 Si algo falla

- El agente solo corre cuando **Claude desktop está abierto** en tu Mac
- Si una tarea no se ejecutó: abre Claude desktop y pídeme "ejecuta la tarea de noticias ahora"
- Las tareas programadas se ven en el menú "Tareas programadas" de Cowork

## 📝 Notas

- Idioma de contenido: catalán (con opción de mezclar castellano en notas)
- Las plantillas pueden ser PNG, HTML o cualquier formato que me pases
- Los textos los genero en catalán por defecto (avísame si quieres mezclar)
