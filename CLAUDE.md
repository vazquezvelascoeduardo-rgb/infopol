# InfoPol — Context per a Claude Code

## Descripció del projecte

InfoPol és una aplicació mòbil per a policies i aspirants als Mossos d'Esquadra.
Construïda amb React + Vite (frontend) i Express.js (backend), empaquetada com a app nativa amb Capacitor.

- **Idioma**: Català (tota la UI i contingut)
- **Stack**: React 18, React Router v6, Vite 6, Express 4, Capacitor 8
- **Modes**: Operativa (agents en actiu) · Acadèmia (aspirants a Mossos)

## Estructura de fitxers clau

```
src/
  data/
    news.js          ← Notícies diàries (actualitzat automàticament)
    infractions.js   ← Catàleg d'infraccions de trànsit
    protocols.js     ← Protocols operatius pas a pas
    academia.js      ← Temari, tests i flashcards
  screens/
    operativa/
      ScreenNoticies.jsx      ← Pantalla de notícies (filtre per cat/àmbit)
      ScreenOperativaHome.jsx ← Inici mode operativa
      ScreenInfraccions.jsx   ← Cercador d'infraccions
      ScreenProtocol.jsx      ← Protocols
      ScreenFitxa.jsx         ← Detall d'infracció
      ScreenMapa.jsx          ← Mapa d'incidències
    academia/
      ...
  components/
    Icon.jsx    ← Biblioteca d'icones SVG
    Shared.jsx  ← Components reutilitzables (StatusBar, TabBar, NavHeader…)
  tokens.js     ← Sistema de disseny (colors, tipografia, espaiat)
server/
  index.js      ← API Express (importa NEWS de src/data/news.js)
```

## Tasca automatitzada: Notícies diàries

Cada dia a les 22:00 (CEST), el workflow `.github/workflows/daily-news.yml`
executa Claude Code per actualitzar `src/data/news.js` amb les notícies del dia.

### Estructura de `src/data/news.js`

```js
export const NEWS_CATS = {
  normatiu:      { label, solid, soft, ink },  // canvis legislatius
  politica:      { ... },
  economia:      { ... },
  cultura:       { ... },
  descobriments: { ... },                       // ciència, premis, tecnologia
  esports:       { ... },
  successos:     { ... },                       // fets policials, sentències
  internacional: { ... },
};

export const NEWS = [
  {
    id: 'n-YYYYMMDD-NNN',   // identificador únic
    date: 'YYYY-MM-DD',
    dateLabel: 'DD·MM',
    cat: 'politica',         // clau de NEWS_CATS
    scope: 'cat',            // 'cat' | 'esp' | 'int'
    tag: 'Font o etiqueta',  // font o referència curta
    title: 'Títol en català',
    desc: 'Resum breu en català (2-3 frases màxim).',
    url: 'https://...',      // link a la notícia o null
  },
  // ... més notícies, ordenades de més nova a més antiga
];
```

### Regles per actualitzar les notícies
1. Afegir les notícies noves **al principi** de l'array `NEWS`
2. Eliminar notícies amb `date` anterior a fa **30 dies**
3. IDs únics: format `n-YYYYMMDD-NNN` (NNN = 001, 002…)
4. Títols i descripcions sempre en **català**
5. Descripcions **objectives i neutrals** (sense opinió)
6. Màxim **20 notícies per dia** per evitar duplicació excessiva
7. No modificar `NEWS_CATS` (estable, no canvia cada dia)

### Cobertura mínima per sessió
- **Catalunya (cat)**: ≥ 3 notícies
- **Espanya (esp)**: ≥ 3 notícies
- **Internacional (int)**: ≥ 2 notícies
- **Esports**: ≥ 1 notícia
- **Descobriments/Ciència**: ≥ 1 notícia
- **Successos/Policia**: ≥ 1 notícia

## Sistema de disseny (`src/tokens.js`)

Colors de categoria:
- `leyes`     → `#E89421` (groc-ataronjat)
- `operativa` → `#3B6BF5` (blau)
- `transito`  → `#9C4FE0` (lila)
- `alcohol`   → `#E04F5F` (vermell)
- `atajos`    → `#1FB286` (verd)
- `academia`  → `#FF7A1A` (taronja)
- `physical`  → `#0BB4C2` (turquesa)
- `psico`     → `#F0B400` (groc)

## Comandes útils

```bash
npm run dev      # Inicia Vite (port 5173) + Express (port 3001) en paral·lel
npm run build    # Build de producció a /dist
npm run server   # Només el servidor Express
```
