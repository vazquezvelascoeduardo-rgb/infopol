# Handoff: InfoPol — Mobile App

## Overview
InfoPol is a mobile app concept with two integrated modes for the Spanish/Catalan police community:

1. **Mode Operativa** — for active police officers. Quick reference for traffic infractions, articles (Penal Code, LECrim, FCS, LSV), step-by-step procedural protocols, and an incidents map.
2. **Mode Acadèmia** — gamified study app (Duolingo-style) for candidates preparing the Mossos d'Esquadra public exam. Daily plan, official exam tests, flashcards with spaced repetition, physical-test calculator, statistics, weekly leaderboard.

Inspired by the structure of [infopol.app](https://infopol.app); the visual identity in this handoff is **original** (logo, typography, components are not copies of the live site's branding).

## About the Design Files
The HTML files in this bundle are **design references** — interactive prototypes built with React (Babel-transpiled JSX) showing intended look and behavior. **They are not production code to copy directly.**

Recreate these designs in the target codebase's environment using its established patterns. If no environment exists yet, the recommended stack is:
- **React Native + Expo** (mobile-first, both iOS and Android)
- or **Next.js + Tailwind** for a web companion

## Fidelity
**High-fidelity (hifi).** Pixel-perfect mockups with final colors, typography, spacing, and exact iconography. Implement pixel-by-pixel using the codebase's libraries — but do replace the inline SVG icon set with a proper icon library (e.g. `lucide-react-native`).

## Target language
All UI copy is in **Catalan** (`ca`). Provide an i18n hook from day 1 — Spanish (`es`) is a near-future requirement.

---

## Information architecture

```
Public
  └─ Landing
  └─ Onboarding (mode selector: operativa / acadèmia / ambdós)

Authenticated
  ├─ MODE OPERATIVA  (tab bar: Inici · Lleis · Protocols · Mapa · Tu)
  │   ├─ Home
  │   ├─ Lleis (search + categories)
  │   ├─ Cercador d'infraccions
  │   │   └─ Fitxa d'infracció (tabs: Resum · Llei · Procediment · Diligència)
  │   ├─ Protocols pas a pas (★ key differentiator)
  │   ├─ Mapa d'incidències
  │   └─ Actualitat normativa
  │
  ├─ MODE ACADÈMIA  (tab bar: Pla · Temari · Tests · Stats · Tu)
  │   ├─ Home (pla diari + missions + lliga)
  │   ├─ Temari (camí d'aprenentatge en zigzag, 17 blocs)
  │   ├─ Tests Mossos (oficial / cronometrat / per tema)
  │   │   └─ Pantalla pregunta amb feedback +XP
  │   ├─ Flashcards (repàs espaiat, 4 ratings: malament / difícil / bé / fàcil)
  │   ├─ Estadístiques (gràfic 12 setmanes, rendiment per tema)
  │   ├─ Físiques (calculadora segons sexe/edat)
  │   ├─ Psicotècnics
  │   └─ Lliga setmanal (rànquing)
  │
  └─ Compartit
      └─ Perfil (nivell, XP, ratxa, insígnies, configuració)
```

---

## Design tokens

### Colors (hex)

**Surfaces**
| Token | Value | Use |
|---|---|---|
| `bg` | `#F6F4EF` | App background (warm off-white) |
| `card` | `#FFFFFF` | Card surfaces |
| `ink` | `#13131A` | Primary text |
| `inkSoft` | `#3A3A45` | Secondary text |
| `inkMuted` | `#7A7A85` | Tertiary text / metadata |
| `inkFaint` | `#B8B8C0` | Disabled / placeholder |
| `hairline` | `rgba(19,19,26,0.08)` | Borders |
| `hairlineStrong` | `rgba(19,19,26,0.14)` | Stronger borders |

**Category palette** — each section owns a hue. `solid` is for fills/icons, `soft` for tinted backgrounds, `ink` for text on `soft`.

| Category | Solid | Soft | Ink |
|---|---|---|---|
| `leyes` (amber) | `#E89421` | `#FBE7C2` | `#6B3F08` |
| `operativa` (blue) | `#3B6BF5` | `#D8E2FE` | `#0E2B7A` |
| `transito` (purple) | `#9C4FE0` | `#EBDAFB` | `#4A1B7A` |
| `alcohol` (red) | `#E04F5F` | `#FBDADC` | `#7A1B22` |
| `atajos` (green) | `#1FB286` | `#CDF0E1` | `#0B5A3D` |
| `tests` (blue) | `#3B6BF5` | `#D8E2FE` | `#0E2B7A` |
| `academia` (terracotta) | `#FF7A1A` | `#FFE0CB` | `#7A2E04` |
| `physical` (teal) | `#0BB4C2` | `#CCEEF1` | `#0A4F56` |
| `psico` (mustard) | `#F0B400` | `#FCEFB8` | `#5C4400` |

The terracotta `academia` is the primary brand-positive color; the blue `operativa` is the secondary.

### Typography
- Display + body: **Manrope** 400/500/600/700/800 (Google Fonts)
- Numeric/code: **JetBrains Mono** 400/600/700
- Letter spacing: large titles use `-0.6` to `-1.4`; UPPERCASE kickers use `+1.0` to `+1.4`

**Type scale (px)**

| Use | Size | Weight | Line-height |
|---|---|---|---|
| Hero title | 38 | 800 | 1.02 |
| Page title (large) | 28 | 800 | 1.05 |
| Card title | 16–22 | 800 | 1.1–1.2 |
| Body | 13–14 | 500–700 | 1.4–1.5 |
| Kicker (uppercase) | 10.5–11 | 800 | 1.0 |
| Mono code/badge | 10–12 | 600–800 | 1.0 |

### Radius
| Token | Value |
|---|---|
| sm | 10 |
| md | 14 |
| lg | 20 |
| xl | 28 |
| pill | 999 |

### Shadows
- `card`: `0 1px 0 rgba(19,19,26,0.04), 0 6px 18px rgba(19,19,26,0.05)`
- `pop`: `0 8px 24px rgba(19,19,26,0.12), 0 2px 4px rgba(19,19,26,0.06)`
- **Duo button bottom**: `inset 0 -4px 0 rgba(0,0,0,0.18)` — gives the 3D press feel
- **Duo icon tile bottom**: `inset 0 -3px 0 rgba(0,0,0,0.18)`

### Iconography
The prototype uses an inline stroke-icon set (see `tokens.jsx → Icon`). Replace with Lucide / Phosphor / equivalent. Stroke-width 2.0–2.4, 24px viewBox.

---

## Component inventory

These atoms are defined in `shared.jsx`. Recreate them as first-class components in the target codebase:

| Component | Description |
|---|---|
| `InfoPolLogo`, `InfoPolWordmark` | App mark — replace with the real brand asset before launch |
| `StatusBar`, `HomeIndicator` | Native chrome — provided by the OS in production, drop in the prototype-only versions |
| `Pill`, `CategoryTag` | Uppercase tag with rounded background |
| `DuoButton` | Primary CTA with inset bottom shadow (Duolingo-style) |
| `CatIcon` | Square category icon tile (size 36/40/44/48; rounded 9–14) |
| `ColorCard` | White card with 3px solid color top border + soft shadow |
| `TabBar` | Bottom navigation, 5 tabs, active color follows mode |
| `Phone` | Device frame (drop in production; just use safe-area insets) |
| `SectionHead` | Kicker + title + optional action link |
| `SearchField` | Pill-shaped search with mic icon |
| `ProgressBar` | Horizontal progress with inset bottom shadow |
| `Streak`, `GemBadge` | Gamification HUD pills (flame + count, gem + count) |
| `Mission` | Daily mission row (done / active / locked) |
| `ToolTile` | 2-col grid tile for academia tools |
| `PathNode`, `PathConnector`, `Ring` | Learning-path zigzag with circular nodes |
| `Option` | Test answer button (idle / correct / wrong states) |
| `RatingBtn` | Flashcard rating button (4 levels) |
| `BigStat`, `PhysicTest` | Stat tiles |
| `Pin` | Map pin (drop-shaped) |

---

## Screen-by-screen specs

> Every screen is 320×660 in the prototype (proportional to a typical iPhone viewport scaled-down for canvas display). Use real device dimensions in implementation.

### 1. Landing (public)
- Top bar: wordmark + "Entrar" black pill button
- Hero: kicker "Per la teva feina · Per la teva oposició" + display title with `pol` highlighted in `cat.academia.solid` (`#FF7A1A`)
- Primary CTA: full-width DuoButton in `academia` color, "Comença gratis" with bolt icon
- Social proof row: 4 overlapping avatar circles + "+12.400 agents i opositors"
- Two large mode-preview cards: blue (operativa) + terracotta (academia) with feature chips
- 2×2 grid: Lleis / Infraccions / Protocols / Tests Mossos
- Testimonial card with 5 stars

### 2. Onboarding (mode selector)
- Step indicator "Pas 2 de 3"
- Title "Per què fas servir InfoPol?"
- 3 selectable cards: "Soc policia en actiu" / "Estic opositant" / "Les dues coses"
- Each card: large category icon, title, description, tag chips, radio circle (filled when selected)
- Sticky bottom CTA

### 3. Operativa Home
- Top bar: wordmark + bell + user round icons
- Salutation with mode + shift kicker, "Bon dia, agent Roca"
- Search field (pill)
- 2-col big cards: **Lleis** (amber) + **Operativa** (blue), each with kicker + title + desc + "Obrir →"
- Full-width superbuscador card (purple top border): icon + kicker + title + 5 filter chips
- 2×2 small tiles: Catàleg infraccions / Alcoholèmia / Recursos ràpids / Mapa d'incidències
- "Star feature" full-bleed blue card: Protocols pas a pas with 3 icon chips
- Actualitat list with date-tag-title-desc format

### 4. Cercador d'infraccions
- Page title "Infraccions" with kicker + filter button
- Search field
- Horizontal scrolling chip filter row (Totes / Greus / Molt greus / LSV / RGC) with counts
- List of `InfraccionRow`s — left border colored by severity, code mono badge, article kicker, severity tag, title, € amount + points + chevron

### 5. Fitxa d'infracció
- NavHeader with back button + kicker "Art. 77.c · LSV" + title "Alcohol > 0,60 mg/l"
- Hero card (red `cat.alcohol`): "Molt greu · Penal" pill, large `1.000 €` + `+ 6 punts`, 2×2 stat grid (delicte, detenció, permís, diligència)
- Tabs: Resum / Llei / Procediment / Diligència — active is filled solid
- Article block with italic legal text and 3 penalty pills
- Numbered checklist (1–5) of operational steps with chevrons

### 6. Protocols pas a pas (★)
- Step progress bar at top "Pas 3 de 6 · 50%"
- Hero situation card (blue): "Situació" kicker + question
- Action card: numbered badge + title + 3 bullet points + warning callout (yellow soft, with bolt icon)
- Sticky bottom: "← Anterior" outlined + "Següent pas →" duo

### 7. Mapa d'incidències
- Fake map (SVG): roads, parks, 5 colored pins (drop-shape rotated -45°), pulsing center "you" dot
- Legend chips
- "Properes a tu" list — distance + time + status

### 8. Acadèmia Home
- Top bar: wordmark + divider + "Acadèmia" kicker, streak (flame + 23) + gem (420) badges on right
- Hero plan card (terracotta) with progress bar 1/3 + "Continuar" white button + next mission preview
- Missions list: 3 rows (done / active with progress / locked)
- Tools 2-col grid: Temari (with progress) / Tests / Flashcards / Simulacre / Físiques / Psicotècnics
- Lliga setmanal preview card with top 4 leaderboard, current user highlighted with `cat.academia.soft` background

### 9. Temari (camí d'aprenentatge)
- Header with global progress card (64%, ring chart on right)
- Zigzag learning path: nodes alternating left/right-aligned, connected by short vertical bars
- Node states: `done` (check, full color), `active` (with `!` red badge + soft glow), `locked` (gray, lock icon)
- Each node has an attached info card: Bloc N kicker + title + sub + optional progress bar

### 10. Test Mossos (cronometrat)
- Top bar: X close + thin progress bar (47%) + clock pill (red mono "47:12")
- Counter row: streak + "Pregunta 24/50" + "21 correctes ✓"
- Question card: "Tema 8 · Drets fonamentals" kicker + question text
- 4 options A/B/C/D — visual states: `idle` / `correct` (green) / `wrong` (red), letter badge fills with state color
- Feedback callout (green soft): check icon + "Excel·lent! +24 XP" + explanation
- Bottom DuoButton "Següent →"

### 11. Flashcards
- Page header + progress bar (8/24)
- Card stack: 3 stacked rectangles, top one with topic pill + counter + question + "Toca per girar" hint
- Below: 4 spaced-repetition rating buttons (Malament <1d / Difícil 2d / Bé 5d / Fàcil 14d)

### 12. Estadístiques
- 2×2 big-stat grid: Dies seguits 23 (flame) / Encerts 78% / Preguntes 412 / Temps 48h
- 12-week activity bar chart, current week (index 10) filled solid, others tinted soft
- "Rendiment per tema" rows with progress + percentage

### 13. Físiques (calculadora)
- User inputs row: Sexe / Edat
- 4 test cards (Course-navette, Circuit d'agilitat, Press de banca, Salt horitzontal) — left border teal (apte) or red (no apte), with mark + unit + rating stars + progress bar
- Footer summary callout

### 14. Perfil (compartit)
- Hero blue header with avatar (initials in terracotta circle), name, TIP/badge ID, "Editar" outlined button
- 3-stat row in semi-transparent tiles: Nivell 12 / XP 14.820 / Ratxa 23 dies
- 4×2 badges grid (8 total, last 4 locked)
- Settings list: Mode operativa per defecte / Notificacions / Oposició objectiu / Privacitat

---

## Interactions & behavior

### Navigation
- Tab bar slides between mode (operativa ↔ acadèmia) — preserve scroll position per tab
- Back chevron returns to previous screen with iOS-style horizontal swipe
- Modal screens (test, flashcards) use vertical slide-up

### Gamification (acadèmia)
- **Streak** increments at midnight if at least 1 lesson completed; freezes at 1 missed day with grace token
- **XP** awarded per question (24 XP correct, 0 wrong, +5 streak bonus); level up every 1000 XP
- **Gems** earned via daily missions; spent on streak freezes (50) and test reveals (10)
- **Lliga** weekly: top 5 promote, bottom 5 demote. League tiers: Bronze → Plata → Or → Diamant

### Spaced repetition (flashcards)
SM-2-based intervals:
- Malament → reset to <1d
- Difícil → ×1.2 from previous interval
- Bé → ×2.5
- Fàcil → ×3.5

### Map
- Real implementation: MapLibre GL Native or Mapbox.
- Pins clustered when zoomed out. "Properes a tu" list refreshes on viewport change.

### Tests
- Cronometrat: 50 questions / 50 minutes, autosubmit at 0
- Per tema: no timer, instant feedback per question
- Simulacre oficial: 100 questions / 90 minutes, only result at the end

### Animations
- Card press: scale 0.98 / 100ms
- Streak fire: subtle pulse (`@keyframes pulse 2s`)
- Map "you" dot: outer halo pulses 1.5× / 2s
- Path node "active": 5px glow halo + bouncing `!` badge
- Page transitions: 280ms ease-out

---

## State management

Use any modern store (Zustand, Redux Toolkit, Pinia). Slices needed:

- **`auth`** — user, role (active / opositor / both), department
- **`prefs`** — language (ca/es), default mode, notification time, theme
- **`progress`** — XP, level, streak, gems, league tier, league rank
- **`temari`** — block completion %, lesson states
- **`tests`** — attempts history, accuracy per topic, current session
- **`flashcards`** — deck state, due cards (SM-2), next review
- **`fisiques`** — user marks per test, last calculation
- **`incidents`** — map markers (real-time push)
- **`lleis`** — local cache of articles, last sync timestamp (offline-first)

Network: most static reference data (articles, infraccions catalog) should ship offline-first via SQLite (WatermelonDB or Drizzle/expo-sqlite); only news, leaderboard, and incidents are realtime.

---

## Assets needed
- **Real logo & wordmark** — replace `InfoPolLogo` / `InfoPolWordmark`
- **Icon library** — replace inline `Icon` component with Lucide
- **Map tiles** — Mapbox or MapLibre style URL
- **Avatar placeholder** image
- **Splash screen** matching landing hero

---

## Data sources to integrate
- **Catàleg SCT** of traffic infractions (LSV, RGC, RGV)
- **CP / LECrim / FCS / LO 4/2015** article database
- **Mossos d'Esquadra** official exam question bank
- **Incidents feed** (police-internal API; mocked in prototype)

---

## Files in this bundle

| File | Role |
|---|---|
| `InfoPol App.html` | Entry point — mounts the prototype with all screens shown side-by-side on a Design Canvas |
| `tokens.jsx` | Design tokens (colors, type, radii, shadows) + `Icon` component |
| `shared.jsx` | All shared UI atoms (logo, frame, buttons, cards, etc.) |
| `screens-landing.jsx` | Landing + Onboarding screens |
| `screens-operativa.jsx` | Operativa: Home / Infraccions / Fitxa / Protocol / Mapa |
| `screens-academia.jsx` | Acadèmia: Home / Temari / Test / Flashcards / Stats / Físiques / Perfil |
| `design-canvas.jsx` | Canvas wrapper (prototype-only, do not port) |
| `ios-frame.jsx` | iOS device chrome reference (prototype-only) |

To preview: open `InfoPol App.html` in a browser. All screens are panned in a zoomable canvas; double-click any artboard to focus.
