# InfoPol · Backend setup (Supabase)

L'app web és 100% client-side per defecte (PWA + GitHub Pages + localStorage). El backend és **opcional**: si no està configurat, el botó de login del menú lateral roman ocult i tot el progrés viu només al dispositiu.

> **Important**: la web comparteix el mateix projecte Supabase que **l'app mòbil**. Login únic, mateixos usuaris, mateixes dades sincronitzades en temps real entre les dues plataformes. **No** crear un projecte nou.

## 1) Reaprofitar el projecte Supabase de la mòbil

A Supabase → **Project Settings → API**:

- Copia *Project URL* → `VITE_SUPABASE_URL`
- Copia *anon public* (NO la `service_role`) → `VITE_SUPABASE_ANON_KEY`

Crea `.env.local` a l'arrel del repo (ja està al `.gitignore`):

```
VITE_SUPABASE_URL=https://<el-teu-project>.supabase.co
VITE_SUPABASE_ANON_KEY=<la-teva-anon-key-pública>
```

## 2) Aplicar les addicions web a l'esquema

L'esquema mestre viu al projecte Supabase i el manté el repo de l'app mòbil. La web només **afegeix** les columnes de customització (avatar/tema) a `profiles` i una taula `favorites`. Tot és additiu i idempotent: la mòbil no es veu afectada.

A Supabase → **SQL Editor → New query**, copia i executa `supabase/schema-web-additions.sql`. Hauries de veure “Success. No rows returned”.

Si en el futur la mòbil vol fer servir aquestes mateixes columnes/taula, ja les trobarà al projecte sense haver de canviar res.

## 3) URLs vàlides per als redirects d'auth

A **Authentication → URL Configuration → Redirect URLs**, afegeix:

- `https://infopol.app` (producció web)
- `http://localhost:5173` (dev)

Els proveïdors OAuth (Google, Apple) que ja tinguis configurats per a la mòbil ja funcionen — la URL de callback de Supabase (`https://<projecte>.supabase.co/auth/v1/callback`) és la mateixa.

## 4) Convenció `question_id` (CRÍTICA)

Per a què el progrés flueixi entre web i mòbil cal que **tots dos clients** escriguin a `attempts.question_id` (i `flashcards_progress.card_id` quan apliqui) amb el mateix format:

```
<topic-slug>:<question-index>
```

Exemples:

```
ce78:0          → primera pregunta del tema "ce78"
ce78:42         → 43a pregunta del tema "ce78"
cp-10-1995:7    → 8a pregunta del Codi Penal
transit-lsv:3   → 4a pregunta de la LSV
```

La web ja escriu en aquest format des de `src/lib/db.ts` (helpers `makeQuestionId` / `parseQuestionId`). Si la mòbil avui escriu un altre format, el progrés viurà en universos paral·lels al mateix projecte fins que no s'alineï. Si fa servir UUIDs aleatoris, calcular-ne el mapeig estable abans de mig­rar.

## 5) Producció (GitHub Actions)

Si fas servir GitHub Pages amb Actions per publicar la web, afegeix les dues claus com a **Repository secrets** (Settings → Secrets and variables → Actions):

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

I al workflow de build:

```yaml
- run: npm run build
  env:
    VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
    VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
```

## Què hi ha al backend

L'esquema mestre (gestionat pel repo mòbil):

| Taula | Què guarda |
|---|---|
| `profiles` | Nom, email, cuerpo, dept, tip number + (web) avatar_color/pet/badge/theme |
| `user_progress` | XP, level, gems, streak, badges (jsonb) |
| `attempts` | Log granular: cada intent (pregunta + selected + correct + temps) |
| `attempts_user_summary` | Vista agregada per (user, question_id) |
| `flashcards_progress` | SRS / Anki: per card_id → interval_days, next_review |
| `missions_progress` | Reptes diaris (mission_id + date + progress + done) |
| `subscriptions` | Premium / billing (gestionat per la mòbil) |
| `ai_usage` | Comptador d'ús de funcions IA |
| `push_tokens` | Tokens APNs/FCM (només mòbil) |
| `favorites` *(web)* | Lleis/fitxes/operatives marcades |
| `leaderboard` *(view)* | Top XP per a la lliga |

## Mapeig web → tables

| Concepte web | Taula |
|---|---|
| `useGlobalStats` (XP/level/gems/streak) | `user_progress` |
| Per-topic stats (millor nota, intents) | `attempts` agregat per topic-slug |
| Failures / repàs Anki | `flashcards_progress` |
| Customització Reptes | `profiles.avatar_*` |
| Reptes diaris | `missions_progress` |
| Favorits | `favorites` |
| Lliga setmanal | `leaderboard` (view) |

## Phase 2 — pendent

Aquesta primera fase deixa el client preparat (auth, profile, types, accessors). Encara falta:

- Migració localStorage → Supabase la primera vegada que l'usuari entra (push de testStats, failures, customization, favorites).
- Hooks `useSyncedTopicStats()`, `useSyncedFailures()`, `useSyncedMissions()` que llegeixen/escriuen a Supabase quan hi ha sessió i fan fallback a localStorage si no.
- Pàgina `/lliga` que llegeix de la vista `leaderboard`.
- Reconciliació quan l'usuari canvia de dispositiu (last-write-wins per pregunta + merge per failures).

Quan tinguis les claus al `.env.local` i hagis aplicat `schema-web-additions.sql`, ja pots provar el login. Després passem a Phase 2.
