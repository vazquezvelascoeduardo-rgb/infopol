# InfoPol — Guia per a Claude Code

## Tasca diària: recerca de notícies (22:00)

Cada dia a les 22:00 has de fer una recerca exhaustiva de notícies i afegir-les a `server/news.json`.

### Procediment

1. Usa **WebSearch** per buscar notícies recents (últimes 24h) de cada categoria.
2. Per cada notícia, redacta un resum curt (2-3 frases màxim) en **català**.
3. Afegeix totes les notícies noves a `server/news.json` al principi de l'array (les més recents primer).
4. Fes commit i push a la branca actual.

### Categories a buscar (cerca entre 1 i 3 notícies per categoria)

| Categoria | `tag` a usar | Paraules clau de cerca |
|-----------|-------------|------------------------|
| Política catalana | `Política · Cat` | "Catalunya política", "Govern català", "Generalitat", "independentisme" |
| Política espanyola | `Política · ESP` | "España política", "Congreso", "Pedro Sánchez", "govern espanyol" |
| Política internacional | `Política · INT` | "internacional politics", "UE", "ONU", "geopolítica" |
| Economia | `Economia` | "economia Espanya", "PIB", "inflació", "mercat laboral" |
| Cultura | `Cultura` | "cultura Catalunya", "cinema", "música", "art", "literatura" |
| Ciència i descobriments | `Ciència` | "descobriment científic", "recerca", "innovació", "medicina" |
| Esports | `Esports` | "Barça", "esports Catalunya", "Espanyol", "tennis", "ciclisme" |
| Policial i judicial | `Policial` | "policial Catalunya", "detinguts", "sentència", "Mossos d'Esquadra", "judicial ESP" |
| Premis i reconeixements | `Premis` | "premi", "reconeixement", "guardó", "Nobel", "Oscar" |

### Format de cada notícia

```json
{
  "id": "n-YYYYMMDD-NN",
  "date": "YYYY-MM-DD",
  "dateLabel": "MM·DD",
  "tag": "Categoria · Àmbit",
  "title": "Títol de la notícia en català",
  "desc": "Resum de 2-3 frases en català. Clar, concís i informatiu.",
  "url": "https://enllaç-a-la-noticia-completa.com"
}
```

**Exemples d'id:** `n-20260621-01`, `n-20260621-02`, etc.

### Regles

- Escriu **sempre en català**.
- El `title` màxim 80 caràcters.
- El `desc` màxim 200 caràcters.
- Prioritza fonts fiables: El País, La Vanguardia, El Periódico, Ara, VilaWeb, El Mundo, ABC, Reuters, BBC, El Punt Avui.
- No dupliquis notícies que ja estiguin al fitxer (comprova els títols existents).
- Mantén l'array a un màxim de 100 items (elimina els més antics si cal).

### Com actualitzar news.json

Llegeix `server/news.json`, afegeix les noves notícies al principi de l'array i escriu el fitxer. Exemple de comanda:

```bash
# Comprova les últimes notícies ja existents
cat server/news.json | head -30
```

### Commit i push

```bash
git add server/news.json
git commit -m "news: actualització diària $(date '+%Y-%m-%d')"
git push -u origin HEAD
```

### Notificació

Quan acabis, envia una notificació push amb:
- Quantes notícies noves has afegit
- Les categories cobertes
- Si hi ha hagut algun problema

---

## Estructura del projecte

- `server/index.js` — API Express (port 3001)
- `server/news.json` — notícies (font de veritat)
- `src/screens/operativa/ScreenOperativaHome.jsx` — pantalla principal (fa fetch de /api/news)
- `src/data/` — dades estàtiques (infraccions, protocols, academia)

## Branca de desenvolupament

Treballa sempre a: `claude/great-dijkstra-tvsoor`
