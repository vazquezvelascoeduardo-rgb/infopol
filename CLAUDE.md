# InfoPol — Web (PWA)

App de consulta i estudi per a agents/aspirants de policia local de Catalunya. Es una **PWA** instal·lable, funciona offline. Domini de producció: **infopol.app** (GitHub Pages).

Aquest repo és la **web/PWA**. L'app mòbil germana viu a `C:\Users\edugu\Documents\infopolapp\` (Expo + React Native). Comparteixen **el mateix projecte de Supabase** per auth + dades d'usuari.

## Stack

- Vite 5 + React 18 + TypeScript estricte
- React Router 6 (lazy routes)
- Tailwind 3 + CSS custom (rebranding 2026: tokens `--ink`, `--terracotta`, `--paper`, etc. a `index.css`)
- vite-plugin-pwa (service worker / manifest)
- @supabase/supabase-js (auth + DB compartida amb la mòbil)
- expo-sqlite NO — la web usa localStorage; la sincronització real viu a `lib/sync*.ts` i només es fa servir si l'usuari està autenticat.
- Despliegue: GitHub Pages workflow (`.github/workflows/deploy.yml`) — push a `main` o `claude/configure-infopol-Eq74r` desplega.
- Sense backend propi a aquest repo. Tot el contingut estàtic (`content/*.md|html` + `src/data/*.json`) + Supabase per persistència d'usuari.

## Estructura

```
infopol/
├── content/                 ← fitxes en Markdown/HTML organizadas per módul
├── src/
│   ├── pages/               ← rutes (Home, Operativa, Leyes, Login, Profile,
│   │                           Test, Academia, Retos, Noticies, etc.)
│   ├── components/          ← Layout, Sidebar, UserButton, RequireAuth, etc.
│   ├── lib/                 ← supabase.ts, auth.tsx, db.ts, content.ts,
│   │                           cataleg-*.ts, i18n.tsx, theme.ts, sync*.ts
│   ├── data/                ← checklists JSON (penal, trafico)
│   ├── index.css            ← tokens del rebranding 2026 + utilitats CSS
│   └── App.tsx              ← router amb rutes públiques i privades
├── public/
├── _import*/                ← (gitignored) carpetes d'importació HTML→MD
├── supabase/                ← (a infopolapp/supabase, no aquí)
├── .env.local               ← VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY
└── .github/workflows/deploy.yml
```

## Idioma

UI i contingut **en català**. Comentaris de commits també en català. L'usuari (Eduardo) parla amb mi en castellà — jo li responc en castellà però el codi/UI/copy van en **català**.

## Supabase

- Project ID: **`dnjblfqantxdqfvqbqqi`**
- Region: `eu-west-1`, Postgres 17
- URL: `https://dnjblfqantxdqfvqbqqi.supabase.co`
- Credencials a `.env.local` (gitignored) i a GitHub Secrets (`VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`) per al build de Pages.
- **MCP de Supabase està connectat** en l'entorn de l'Eduardo → puc llegir DB, logs, edge functions vía MCP. **NO** puc gestionar Auth Providers ni Redirect URLs (això només des del dashboard UI).
- L'app mòbil (`infopolapp/`) usa el **mateix projecte Supabase** — sessió compartida.

## Auth (estat actual)

- `src/lib/supabase.ts` — client; `isBackendEnabled` és `false` si falten les variables (mode local-only).
- `src/lib/auth.tsx` — `AuthProvider` + `useAuth()`. Mètodes:
  - `signInWithGoogle()` — OAuth amb redirect.
  - `signInWithPassword(email, password)` — email + contrasenya.
  - `signUpWithPassword(email, password, name?)` — retorna `{ needsEmailConfirmation }`.
  - `requestPasswordReset(email)`.
  - `signOut()` + `refresh()`.
  - **Sense Apple a la web** (la mòbil sí el manté per requisit d'App Store).
- `src/lib/db.ts` — accés tipat a `profiles`, `user_progress`, `attempts`, `flashcards_progress`, `missions_progress`, `favorites`, `leaderboard`. Convenció clau: `question_id = "<topic-slug>:<index>"` compartida amb la mòbil.
- `src/pages/Login.tsx` — pantalla de login amb email + Google + reset.
- `src/pages/Profile.tsx` — `/perfil` amb dades de `profiles` + estadístiques de `user_progress` (XP, level, gems, streak).
- `src/components/UserButton.tsx` — botó del header (Entrar si no hi ha sessió, avatar amb inicial si sí).
- `src/components/RequireAuth.tsx` — wrapper per a rutes privades. Si `isBackendEnabled === false`, no protegeix.
- `src/components/Sidebar.tsx` — la "session card" enllaça a `/login` (abans obria modal; modal eliminat).

### Rutes públiques vs privades

**Públiques** (sense sessió):
- `/`, `/login`, `/avis-legal`, `/privacitat`
- `/operativa/*` (Trànsit, Penal, taules)
- `/superbuscador`, `/cerca`
- `/leyes/s/transit/cataleg-d-infraccions-de-transit-sct-2026` (catàleg SCT)
- `/calculadora-alcohol`
- `/noticies`, `/noticies/:slug`, `/cultura-general`, `/cultura-general/:id` (esquer per a registres)

**Privades** (`<RequireAuth>`):
- `/leyes` (índex), `/leyes/s/:m`, `/leyes/s/:m/:slug` excepte el catàleg SCT
- `/recursos`
- `/academia`, `/retos`
- `/test`, `/test/logros`, `/test/:slug`
- `/perfil`

Si vols afegir una nova fitxa pública dins `/leyes`, amplia `PUBLIC_LEYES_CARDS` a `App.tsx`.

## Convencions

- TypeScript estricte. Lazy imports per a totes les pàgines (`lazy(() => import(...))`).
- Tailwind + classes CSS del rebranding 2026 (`shell`, `topbar`, `searchbar`, `icon-btn`, `eyebrow`, `sb-*`, etc.). Veure `index.css`.
- Tokens de color: `var(--ink)`, `var(--terracotta)`, `var(--paper)`, `var(--paper-2)`, `var(--line)`, `var(--text-2)`, `var(--text-3)`. **Preferir tokens** sobre colors hardcodejats.
- Iconografia: SVG inline + emojis. La marca usa `BrandShield` (escut amb la "i" en cercle + barra terracota).
- i18n: `useT()` retorna `t(key)`. Claus duplicades en `'es'` i `'ca'` dins `lib/i18n.tsx`. Idioma per defecte: castellà; toggle al sidebar.
- Per afegir contingut legal: crea `.md` o `.html` a `content/<modul>/`. Veure `README.md`.

## Cosas a NO fer

- No introduir backend propi en aquest repo — la PWA és estàtica + Supabase.
- No commitejar `.env.local`, `_import*/`, `dist/`, ni claus.
- No tocar el contingut de `content/` per motius de codi (és de l'Eduardo, edita Markdown ell mateix).
- No revertir els canvis del rebranding 2026 (Layout topbar, brand-shield, tokens) sense parlar-ho primer.
- No saltar `git fetch` abans de començar — la branca pot tenir canvis remots no descarregats. **Aquesta lliçó es va aprendre el 2026-05-09**: una sessió va treballar sobre una versió obsoleta de la branca durant hores i va calgur fer reset perquè el remot tenia 100+ commits que no estàvem veient.

## Fluxe de treball

- Abans d'edicions grans: confirmar pla amb l'usuari.
- **Commits freqüents** mentre es treballa (per no perdre progrés si la sessió cau).
- Mensatges de commit en català, breus i descriptius (veure `git log --oneline`).
- L'Eduardo prefereix anar pas a pas, no ràfagues grans.
- Després de canvis als rutes/auth, **build de producció** (`npm run build`) per validar.
