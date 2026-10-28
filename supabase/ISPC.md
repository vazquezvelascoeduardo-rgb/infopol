# Tests privats ISPC

La web (`/ispc`) i l'app (`/ispc`, tests amb prefix `ispc-`) comparteixen el banc privat de Supabase.

## Accés

- `ispc_admins`: administradors, assignats exclusivament des del servidor.
- `ispc_access`: permisos explícits amb un indicador `active`. Només es poden llegir els propis permisos; l'administrador pot consultar la llista.
- `ispc_topics` i `ispc_questions`: lectura amb RLS per a membres actius. Les preguntes necessiten `reviewed = true`.
- `ispc_set_access`: RPC pública amb `SECURITY INVOKER`, delegada a una funció del esquema no exposat `ispc_private`. Aquesta comprova `auth.uid()` i la pertinença a `ispc_admins` abans de consultar usuaris o canviar permisos. No accepta metadades editables per l'usuari com a autorització.
- Els clients no tenen permisos d'escriptura a les taules. `anon` no pot consultar-les ni executar la RPC.

La funció privilegiada interna és intencionada: permet localitzar un compte verificat per correu sense exposar `auth.users`. La RPC i les polítiques s'han comprovat amb usuaris autoritzats, no autoritzats i revocats, i contra l'autoassignació de permisos.

## Contingut

Els PDF, els textos extrets, els candidats i el banc revisat viuen fora del repositori públic. No s'han d'afegir a `src`, `public`, `content` ni a migracions SQL. El fitxer `ispc-schema.sql` conté només l'esquema inicial, sense preguntes.

`scripts/inventari-ispc.py` inventaria i extreu PDF d'un ZIP amb PyMuPDF. `scripts/extreu-ispc.py` extreu candidats amb correcció marcada: **no publica preguntes**, ni les considera revisades. Cal comprovar el context, la classificació, les opcions i la vigència abans de marcar `reviewed`.

La primera tanda és de 130 preguntes adaptades, cinc per cadascuna de les 26 unitats disponibles. No representa la cobertura completa de les 3.112 pàgines. L'estructura permet ampliar-les per unitat. Cada pregunta conserva document, pàgina i empremta SHA-256 de la font.

Les preguntes es carreguen en memòria amb la sessió de l'usuari. No entren al paquet públic, al precache PWA ni als punts de recuperació de l'app. La web conserva només identificadors i resultats, com els tests existents. Es revalida l'accés cada 30 segons i en recuperar el focus; la revocació bloqueja immediatament les noves consultes al servidor. Com qualsevol contingut llegit, una còpia feta per un usuari autoritzat no es pot retirar del seu dispositiu.

## Verificació

- Web: `npm run build`.
- App: `npx tsc --noEmit` i `npm test -- src/lib/ispc.test.ts`.
- UI web: servidor Vite amb URL Supabase fictícia `https://ispc-test.supabase.co` i clau pública fictícia; executar `node scripts/prova-ispc-ui.cjs <directori-node_modules-del-runtime>/`. Les respostes es simulen i no es consulta el servidor real. Requereix Playwright i Edge.
- No es modifica la puntuació prèvia de cada plataforma: la web penalitza 0,25 per error; l'app conserva el seu càlcul habitual.
