# Guia completa d'implementació — InfoPol App

> Pas a pas per crear l'app sencera des de zero amb Claude Code, seguint exactament el disseny del paquet de handoff.

---

## 0 · Prerequisits (instal·la una sola vegada)

```bash
# Node 20+ i pnpm
brew install node pnpm        # macOS
# o: winget install OpenJS.NodeJS  (Windows)

# Expo CLI i EAS
npm i -g expo-cli eas-cli

# Claude Code
npm i -g @anthropic-ai/claude-code

# iOS: Xcode des de l'App Store
# Android: Android Studio + SDK 34
```

Crea un compte a [Expo](https://expo.dev) i a [Mapbox](https://mapbox.com) (per al mapa).

---

## 1 · Crea el projecte

```bash
npx create-expo-app infopol-app --template blank-typescript
cd infopol-app
```

Copia la carpeta `design_handoff_infopol/` que has descarregat **dins l'arrel del projecte**. Quedarà:

```
infopol-app/
├─ design_handoff_infopol/    ← el paquet de handoff
├─ app/                       ← Expo Router
├─ package.json
└─ ...
```

Instal·la les dependències base:

```bash
pnpm add expo-router expo-linking expo-constants expo-status-bar \
         react-native-safe-area-context react-native-screens \
         react-native-gesture-handler react-native-reanimated \
         @expo/vector-icons lucide-react-native \
         zustand @tanstack/react-query \
         expo-sqlite drizzle-orm \
         @rnmapbox/maps \
         expo-haptics expo-localization i18n-js \
         react-native-svg

pnpm add -D drizzle-kit @types/react
```

Activa Expo Router i Reanimated al `babel.config.js` segons la doc oficial d'Expo.

---

## 2 · Inicia Claude Code i dona-li el context

Al terminal, dins l'arrel del projecte:

```bash
claude
```

Crea un fitxer `CLAUDE.md` a l'arrel amb aquest contingut (Claude Code el llegirà sempre):

```md
# InfoPol — context permanent

Estàs implementant l'app InfoPol seguint **exactament** el disseny de
`design_handoff_infopol/`.

Stack: React Native + Expo (TS) + Expo Router + Zustand + Drizzle/SQLite.
Idioma: català (ca) com a default, prepara i18n per (es).

REGLES:
1. SEMPRE consulta `design_handoff_infopol/README.md` abans d'implementar
   una pantalla — té tokens, mides, copy literal i estats exactes.
2. Els colors, mides, radis i ombres han de ser PIXEL PERFECT amb el JSX
   de referència (`screens-*.jsx`).
3. Crea components atòmics seguint l'inventari del README.
4. Cada commit ha d'incloure només una pantalla o capa de tokens.
5. NO inventis copy — usa el text exacte del prototip.
```

---

## 3 · Ordre exacte d'implementació (un prompt per fase)

Copia i enganxa aquests prompts a Claude Code, **un de cada vegada**. Espera que acabi i revisa abans del següent.

### Fase 1 · Tokens i tema

```
Llegeix design_handoff_infopol/README.md secció "Design tokens" i
design_handoff_infopol/tokens.jsx. Crea src/theme/tokens.ts amb totes
les constants de color, type-scale, radii i shadows traduïdes a React
Native (StyleSheet). Crea també src/theme/ThemeProvider.tsx que
exposi el theme via context. Configura les fonts Manrope i JetBrains
Mono amb expo-font.
```

### Fase 2 · Icones i atoms compartits

```
Llegeix design_handoff_infopol/shared.jsx. Recrea cadascun d'aquests
components a src/components/ usant lucide-react-native enlloc del set
inline:
- InfoPolLogo, InfoPolWordmark
- Pill, CategoryTag
- DuoButton (clau: inset bottom shadow 4px)
- CatIcon
- ColorCard (border-top 3px de color de categoria)
- ProgressBar
- SearchField
- SectionHead
Cada component al seu fitxer .tsx amb props tipades. Inclou Storybook
opcional o un fitxer de showcase.
```

### Fase 3 · Navegació i tab bars

```
Configura Expo Router amb dos stacks paral·lels:
- (operativa)/_layout.tsx amb tabs: Inici, Lleis, Protocols, Mapa, Tu
- (academia)/_layout.tsx amb tabs: Pla, Temari, Tests, Stats, Tu
Reutilitza el TabBar custom del prototip (shared.jsx) — accent color
canvia segons el mode. Afegeix també (auth)/login i index.tsx amb el
landing públic.
```

### Fase 4 · State, BD i i18n

```
1. Crea src/store/ amb slices Zustand: auth, prefs, progress, tests,
   flashcards, fisiques (segons "State management" del README).
2. Configura Drizzle + expo-sqlite. Crea taules: users, articles,
   infractions, questions, attempts, flashcards, missions.
3. Configura i18n-js amb dos fitxers: locales/ca.json i locales/es.json.
   Extreu tot el copy del prototip a ca.json.
```

### Fase 5 · Pantalles públiques

```
Implementa src/screens/Landing.tsx i src/screens/Onboarding.tsx
seguint screens-landing.jsx pixel-perfect. Mides, copy, paleta i
animacions tal com es descriu al README seccions 1 i 2.
```

### Fase 6 · Mode Operativa (5 pantalles)

```
Implementa, una per commit:
1. screens/operativa/Home.tsx (README §3)
2. screens/operativa/Infraccions.tsx (§4) amb FlatList virtualitzada
3. screens/operativa/FitxaInfraccio.tsx (§5) amb tabs
4. screens/operativa/Protocol.tsx (§6) — amb estat de pas + progress
5. screens/operativa/Mapa.tsx (§7) amb @rnmapbox/maps i pins drop-shape
Carrega les dades de mostra via Drizzle des de seeds/.
```

### Fase 7 · Mode Acadèmia (7 pantalles)

```
Implementa, una per commit:
1. screens/academia/Home.tsx (dashboard, §8)
2. screens/academia/Temari.tsx (camí en zigzag, §9) — usa Reanimated
   per al "!" badge bouncing
3. screens/academia/Test.tsx (§10) amb timer + estats correct/wrong
4. screens/academia/Flashcards.tsx (§11) amb gestos de swipe
   (gesture-handler) i algoritme SM-2 al store
5. screens/academia/Stats.tsx (§12) amb gràfic SVG custom
6. screens/academia/Fisiques.tsx (§13) amb calculadora segons
   sexe/edat (taula de barems oficial Mossos)
7. screens/Perfil.tsx (§14)
```

### Fase 8 · Gamificació

```
Implementa al store la lògica de:
- XP: +24 correcte, +5 bonus ratxa, level-up cada 1000
- Ratxa: increment a mitjanit si ≥1 lliçó completada; congelació amb gem
- Gemes: missions diàries, 50 per congelar ratxa
- Lliga setmanal: top 5 puja, bottom 5 baixa
Notificacions locals amb expo-notifications a les 19:00.
Tot segons "Gamification" del README.
```

### Fase 9 · Backend i sincronització

```
Crea un backend mínim amb Hono + Postgres (o Supabase si prefereixes
zero-ops). Endpoints:
- POST /auth (magic link)
- GET /articles, /infractions, /questions (cacheable)
- POST /attempts, /flashcards/review
- GET /leaderboard/weekly
- GET /incidents (real-time via SSE o WebSockets)
Sync offline-first: descarrega catàlegs en bulk al primer login.
```

### Fase 10 · Polish i llançament

```
1. Splash + iconaapp (expo-splash-screen) amb el wordmark sobre
   fons #FF7A1A
2. Animacions de transició 280ms ease-out (react-navigation/transitions)
3. Haptics a botons clau (expo-haptics)
4. Tests E2E amb Maestro per als 3 flows crítics:
   - Buscar infracció
   - Completar test
   - Repassar flashcards
5. EAS Build i submissió:
   eas build --platform all
   eas submit
```

---

## 4 · Validació visual

A cada fase, demana a Claude Code:

```
Fes un screenshot de la pantalla [X] amb el simulador i compara-la
amb la imatge del prototip (obre InfoPol App.html, captura la
pantalla equivalent al canvas). Llista les diferències i corregeix.
```

---

## 5 · Estructura final del projecte

```
src/
├─ app/                    # Expo Router screens
│  ├─ (auth)/login.tsx
│  ├─ (operativa)/
│  ├─ (academia)/
│  └─ _layout.tsx
├─ components/
│  ├─ atoms/               # Pill, DuoButton, ProgressBar...
│  ├─ molecules/           # Mission, ToolTile, PathNode...
│  └─ organisms/           # TabBar, NavHeader...
├─ screens/                # Implementacions
├─ store/                  # Zustand slices
├─ db/                     # Drizzle schema + migrations
├─ services/               # API clients
├─ theme/                  # tokens, ThemeProvider
├─ locales/                # ca.json, es.json
└─ utils/
```

---

## 6 · Dades reals que necessites obtenir

Abans de publicar:

1. **Catàleg SCT** d'infraccions (LSV / RGC / RGV) — pots demanar accés institucional o usar l'API pública del SCT.
2. **Base de dades d'articles** (CP, LECrim, FCS, LO 4/2015) — BOE té API JSON oberta.
3. **Banc de preguntes oficials Mossos** — històric de proves publicades a la Generalitat.
4. **Logo real d'InfoPol** + assets de marca.
5. **Mapbox token** i estil personalitzat.

---

## 7 · Cost estimat

- Claude Code: \~$30–80 segons quants prompts
- Expo + EAS: gratis fins a 30 builds/mes
- Mapbox: gratis fins a 50k usuaris actius/mes
- Backend (Supabase free tier): gratis al principi
- App Store + Play Store: \$99/any + \$25 únic

---

## 8 · Cronograma realista

| Setmana | Fase | Resultat |
|---|---|---|
| 1 | 1–3 | Tokens, atoms, navegació funcionant |
| 2 | 4–5 | BD, i18n, landing + onboarding |
| 3–4 | 6 | Mode Operativa complet amb dades mock |
| 5–6 | 7 | Mode Acadèmia complet |
| 7 | 8 | Gamificació i notificacions |
| 8 | 9 | Backend i sincronització |
| 9 | 10 | Polish, tests, builds |
| 10 | — | Submissió a stores (review 1–7 dies) |

---

**Próxim pas concret ara mateix:**

```bash
mkdir infopol-app && cd infopol-app
npx create-expo-app . --template blank-typescript
# copia design_handoff_infopol/ aquí
claude
# enganxa el prompt de la Fase 1
```

Quan tinguis Claude Code corrent, comença per la **Fase 1**. No saltis fases — cada una construeix sobre l'anterior.
