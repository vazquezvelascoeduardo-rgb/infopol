# InfoPol — CLAUDE.md

## Projecte

Aplicació mòbil (React 18 + Vite + Capacitor) per a agents de policia.
**Idioma de l'app:** Català.
**Branca de treball:** `claude/great-dijkstra-l06kx0`

---

## Rutina diària de notícies (cada dia a les 22 h)

Aquesta sessió s'executa automàticament cada nit. La tasca és:

1. **Buscar notícies d'avui** en les categories i àmbits següents.
2. **Afegir-les** a `src/data/news.js` al principi de l'array `NOTICIAS`.
3. **Fer commit i push** a la branca de treball.
4. **Enviar una notificació** amb el resum de les notícies afegides.

### Categories a cobrir

| Categoria | Clau (`cat`) |
|-----------|-------------|
| Política  | `politica`  |
| Economia  | `economia`  |
| Cultura / Premis | `cultura` |
| Esports   | `esports`   |
| Policia / Successos / Legal | `policia` |
| Descobriments / Ciència | `descobriment` |
| Societat / General | `societat` |

### Àmbits (`scope`)

- `Catalunya`
- `Espanya`
- `Internacional`

### Queries de cerca recomanades (WebSearch)

Substitueix `[data]` per la data d'avui en format «8 de juny de 2026»:

```
noticias Cataluña hoy [data] política economía
noticias España hoy [data] actualidad
noticias internacionales hoy [data]
noticias policiales España Cataluña sucesos [data]
noticias deportes España [data] fútbol Mundial
descubrimiento científico cultural [data]
noticias economía España [data]
premios cultura [data]
```

### Format de cada notícia

```javascript
{
  id: 'news-YYYYMMDD-NNN',   // NNN = 001, 002, 003...
  date: 'YYYY-MM-DD',
  dateLabel: 'MM·DD',
  cat: 'politica',            // vegeu taula de categories
  scope: 'Catalunya',         // Catalunya | Espanya | Internacional
  tag: 'Internacional · Política',  // «Àmbit · Categoria» legible
  title: 'Títol clar i informatiu en català',
  desc: 'Resum de 1-2 frases en català. Inclou el fet principal i context mínim.',
  url: 'https://url-noticia-original',
}
```

### Normes de contingut

- **Mínim 8, màxim 15 notícies** per sessió diària.
- **Equilibri d'àmbits**: almenys 2 de Catalunya, 2 d'Espanya, 3 d'Internacional.
- **Equilibri de categories**: no repetir la mateixa categoria més de 3 vegades.
- **Sempre en català**: títols i descripcions, fins i tot si la font és en castellà.
- **URL real**: posar el link a la notícia original. Si no hi ha URL fiable, posar `null`.
- **Historial màxim**: 90 dies. Eliminar entrades anteriors a `date < avui - 90 dies`.

### Com afegir les notícies

Obre `src/data/news.js` i insereix el nou bloc de notícies **al principi** de l'array,
just sota el comentari inicial, amb el comentari de data:

```javascript
export const NOTICIAS = [

  // ── YYYY-MM-DD ──────────────────────────────────────────────────

  { ...nova notícia 1... },
  { ...nova notícia 2... },
  ...

  // ── (notícies anteriors) ─────────────────────────────────────────
  { ...notícia anterior... },
```

### Commit i push

```bash
git add src/data/news.js
git commit -m "noticias: actualització YYYY-MM-DD (N notícies)"
git push -u origin claude/great-dijkstra-l06kx0
```

### Notificació final

Un cop fet el push, enviar una notificació `PushNotification` amb:

```
InfoPol notícies YYYY-MM-DD: N articles afegits. Àmbits: Catalunya (X), Espanya (X), Internacional (X). Titulars: [primera notícia]; [segona]; [tercera].
```

---

## Estructura del projecte

```
src/
  data/
    news.js          ← Notícies generals (actualitzades per la rutina)
    infractions.js   ← Catàleg d'infraccions de trànsit i penals
    protocols.js     ← Protocols operatius pas a pas
    academia.js      ← Temari i preguntes d'examen
  screens/
    operativa/
      ScreenOperativaHome.jsx   ← Pantalla inici (mostra les 4 darreres notícies)
      ScreenNoticias.jsx        ← Pantalla completa de notícies (/operativa/noticias)
      ScreenInfraccions.jsx
      ScreenFitxa.jsx
      ScreenProtocol.jsx
      ScreenMapa.jsx
    academia/
      ...
  components/
    Shared.jsx   ← Components reutilitzables (StatusBar, NavHeader, SectionHead, Pill...)
    Icon.jsx
  tokens.js      ← Colors, fonts, radis, ombres
  App.jsx        ← Routing
server/
  index.js       ← Express API mock (notícies disponibles a /api/news)
```

## Colors per àmbit (tokens.js)

| Àmbit | Token |
|-------|-------|
| Catalunya | `T.cat.operativa` (blau) |
| Espanya | `T.cat.leyes` (ambre) |
| Internacional | `T.cat.transito` (porpra) |
