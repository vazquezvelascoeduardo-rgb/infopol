# InfoPol — Instruccions per a Claude Code

## Descripció del projecte

InfoPol és una aplicació mòbil (React + Vite + Capacitor) per a policies, amb dues modes:
- **Operativa**: Consulta jurídica, protocols, mapa d'incidències, notícies
- **Acadèmia**: Temari, tests, flashcards i estadístiques

**Backend**: Express.js a `server/index.js` (port 3001)  
**Frontend**: React + React Router a `src/`  
**Notícies**: `server/data/news.json` (actualitzat diàriament)

---

## Rutina diària de notícies — 22:00h

Cada dia a les 22:00h aquesta sessió executa la **cerca exhaustiva de notícies** i actualitza `server/data/news.json`.

### Pas 1 — Cerques a fer (WebSearch)

Fes totes aquestes cerques en paral·lel:

1. `noticias Cataluña política hoy [data d'avui]`
2. `noticias España política economía hoy [data d'avui]`
3. `noticias internacionales hoy [data d'avui]`
4. `noticias policiales judiciales España Cataluña hoy [data d'avui]`
5. `deportes fútbol baloncesto España hoy [data d'avui]`
6. `cultura premios descubrimientos ciencia España hoy [data d'avui]`

### Pas 2 — Categories i etiquetes (camp `tag`)

Usa sempre el format `Categoria · ÀMBIT`:

| Categoria | Àmbit CAT | Àmbit ESP | Àmbit INT |
|-----------|-----------|-----------|-----------|
| Política | `Política · CAT` | `Política · ESP` | `Política · INT` |
| Economia | `Economia · CAT` | `Economia · ESP` | `Economia · INT` |
| Esports | `Esports · CAT` | `Esports · ESP` | `Esports · INT` |
| Policial | `Policial · CAT` | `Policial · ESP` | — |
| Cultura | `Cultura · CAT` | `Cultura · ESP` | `Cultura · INT` |
| Ciència | `Ciència · CAT` | `Ciència · ESP` | `Ciència · INT` |
| Premis | `Premis · CAT` | `Premis · ESP` | `Premis · INT` |
| Judicial | `Judicial · CAT` | `Judicial · ESP` | — |
| Internacional | — | — | `Internacional` |

Per a normativa policial/legal existent: usa el format `LO X/YYYY`, `RD X/YYYY`, `Circ. X/YYYY`.

### Pas 3 — Format de cada entrada

```json
{
  "id": "nXXX",
  "date": "YYYY-MM-DD",
  "dateLabel": "MM·DD",
  "tag": "Categoria · ÀMBIT",
  "title": "Titular breu en català (màx. 90 caràcters)",
  "desc": "Resum de 1-2 frases en català. Dades concretes: xifres, noms, llocs. (màx. 160 caràcters)",
  "url": "https://url-article-original"
}
```

**Regles d'estil:**
- Títol i descripció **sempre en català**
- Títol directe, sense verb ("Catalunya obre expedient a..." no "Catalunya ha obert...")
- Descripció amb dades concretes: noms, xifres, llocs
- URL: sempre l'article original, mai pàgines d'inici
- Si no hi ha URL fiable, posa `null`

### Pas 4 — Actualitzar el fitxer

1. Llegeix `server/data/news.json`
2. Obté el `id` més alt actual (format `nXXX`) i incrementa
3. Preposa les noves entrades d'avui al PRINCIPI de l'array (newest first)
4. Apunta a tenir **6-10 noves entrades per dia** cobrint totes les categories
5. Escriu el fitxer actualitzat

### Pas 5 — Commit i push

```bash
git add server/data/news.json
git commit -m "news: actualització [DATA]"
git push -u origin [branca]
```

---

## Estructura del fitxer de notícies

`server/data/news.json` — array JSON, newest first:

```json
[
  { "id": "nXXX", "date": "...", "dateLabel": "...", "tag": "...", "title": "...", "desc": "...", "url": "..." },
  ...
]
```

El servidor llegeix el fitxer en cada petició GET /api/news.  
El frontend mostra les 8 primeres entrades a `ScreenOperativaHome.jsx`.

---

## Estructura del projecte

```
server/
  index.js          — API Express (port 3001)
  data/
    news.json       — Dades de notícies (actualitzat diàriament)
src/
  screens/
    operativa/
      ScreenOperativaHome.jsx  — Pantalla principal (mostra notícies)
  data/             — Dades estàtiques (acadèmia, infraccions, protocols)
  tokens.js         — Sistema de disseny (colors, fonts, radis)
```
