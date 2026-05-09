# InfoPol · Backend setup (Supabase)

L'app és 100% client-side per defecte (PWA + GitHub Pages + localStorage). El backend és **opcional**: si no està configurat, el botó de login del menú lateral roman ocult i tot el progrés viu només al dispositiu.

Aquesta guia documenta els passos per activar la **Phase 1**: autenticació amb Google i Apple Sign-In + esquema de taules a Supabase. La sincronització real (testStats, failures, customization, favorites, leaderboard) entrarà a la Phase 2 sense canviar res del que es descriu aquí.

## 1) Crear el projecte Supabase

1. Crea un compte gratuït a https://supabase.com.
2. **New project**:
   - Nom: `infopol-prod` (o el que vulguis).
   - Regió: **Frankfurt (eu-central-1)** o **París (eu-west-3)** — les més properes a Catalunya.
   - Genera una password forta per a la base de dades i guarda-la al gestor de contrasenyes.
3. Espera 1-2 minuts mentre Supabase provisiona el projecte.

## 2) Aplicar l'esquema SQL

1. Obre **SQL Editor** al dashboard del projecte.
2. **New query**, copia el contingut de `supabase/schema.sql` d'aquest repositori.
3. **Run**. Hauries de veure “Success. No rows returned”.

Això crea les taules `profiles`, `topic_progress`, `failures`, `favorites`, la vista `leaderboard` i les Row-Level Security policies. També instal·la un trigger que crea automàticament una fila a `profiles` quan es registra un usuari nou.

## 3) Configurar OAuth (Google + Apple)

### Google

1. Obre https://console.cloud.google.com → **APIs & Services → Credentials**.
2. **Create credentials → OAuth client ID** (tipus *Web application*).
3. Authorized redirect URIs: afegeix `https://<el-teu-project>.supabase.co/auth/v1/callback` (substituint `<el-teu-project>`).
4. Copia *Client ID* i *Client secret*.
5. Al dashboard de Supabase: **Authentication → Providers → Google** → activa, enganxa Client ID/Secret, **Save**.

### Apple Sign-In *(opcional · requereix compte Apple Developer 99 $/any)*

Si encara no tens compte Apple Dev, salta aquest pas i deixa el botó d'Apple deshabilitat (el client el mostra però el provider tornarà error fins que el configuris).

1. https://developer.apple.com → **Certificates, Identifiers & Profiles**.
2. Crea un *Service ID* + *Sign In with Apple* configuration apuntant a `https://<el-teu-project>.supabase.co/auth/v1/callback`.
3. Genera la clau privada (`.p8`) i obté el *Key ID* + *Team ID*.
4. Al dashboard de Supabase: **Authentication → Providers → Apple** → enganxa els valors, **Save**.

### URLs vàlides per als redirects

A **Authentication → URL Configuration** afegeix els teus dominis:

- `https://infopol.app` (producció)
- `http://localhost:5173` (desenvolupament)

## 4) Variables d'entorn al client

A l'arrel del repositori crea un fitxer `.env.local` (no es puja al git, està al `.gitignore`):

```
VITE_SUPABASE_URL=https://<el-teu-project>.supabase.co
VITE_SUPABASE_ANON_KEY=<la-teva-anon-key-pública>
```

Les dues claus surten de **Project Settings → API** al dashboard de Supabase. Copia la *Project URL* i la **anon public** (NO la `service_role`, que és secreta i mai pot tocar el client).

Després torna a fer build:

```bash
npm run build
```

A partir d'aquest moment, el menú lateral mostrarà el botó **Iniciar sessió** amb les opcions de Google i Apple.

## 5) Producció (GitHub Actions)

Si fas servir GitHub Pages amb Actions per publicar l'app, afegeix les dues variables com a **Repository secrets** (Settings → Secrets and variables → Actions):

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

I al workflow de build (per exemple `.github/workflows/deploy.yml`) passa-les com a `env`:

```yaml
- run: npm run build
  env:
    VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
    VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
```

## 6) Què queda per a la Phase 2

Aquesta primera fase deixa el client preparat (`lib/supabase.ts`, `lib/auth.tsx`, `LoginModal`, schema SQL amb RLS), però la **sincronització de progrés encara no s'executa**. Els pròxims passos:

- Migració de localStorage → Supabase la primera vegada que l'usuari entra (push de `testStats`, `failures`, `customization`, `favorites`).
- Hooks `useSyncedTopicStats()`, `useSyncedFailures()` que llegeixen/escriuen a Supabase quan hi ha sessió i a localStorage si no.
- Pàgina `/lliga` real que llegeix de la vista `leaderboard`.
- Reconciliació quan l'usuari canvia de dispositiu (last-write-wins per topic + merge per failures).

Quan tinguis el projecte creat i les variables al `.env.local`, dius-ho i continuo amb la Phase 2.
