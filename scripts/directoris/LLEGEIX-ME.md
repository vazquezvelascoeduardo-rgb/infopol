# Directoris d'Actualitat (personalitats, premis, esports)

Tot surt de **`dades.mjs`**. És l'única font: la web, l'app i Supabase
en són còpies generades. No editis els fitxers generats a mà.

## Per què és així

Abans hi havia tres còpies que ningú no mantenia igual: la web llegia
Supabase (reescrit cada setmana per una IA amb poques cerques), la web
tenia uns fitxers de reserva de maig i l'app, unes fitxes pròpies. El
setembre de 2026 la web encara deia que Starmer governava el Regne Unit i
Orbán, Hongria.

## Com s'actualitza

1. Canvia `dades.mjs`. **Només dades comprovades en una font actual.** Si
   un càrrec no es pot confirmar, fora. Marca `recent` (últim argument de
   `E(...)`) el que hagi canviat els últims tres mesos, i canvia
   `ACTUALITZAT`.
2. `node scripts/directoris/publica.mjs` des de l'arrel de la web. Escriu:
   - `src/lib/personalitats.ts`, `premis.ts`, `esports.ts` (reserva de la web)
   - `infopol-app/src/content/actualitat-*.ts` (fitxes de l'app)
   - `scripts/directoris/sortida/*.json` (files per a Supabase)
3. Web: `npm run build`, commit i `git push`.
4. App: `npx tsc --noEmit`, commit, `git push` i `eas update --branch production`.
5. Supabase (quan el push de la web ja hi és, perquè el JSON es baixa de
   GitHub). Per a cada categoria:

```sql
-- a) Demana el fitxer. pg_net és asíncron: torna un id.
select net.http_get(
  'https://raw.githubusercontent.com/vazquezvelascoeduardo-rgb/infopol/refs/heads/claude/configure-infopol-Eq74r/scripts/directoris/sortida/personalitats.json'
) as id;

-- b) Uns segons després, amb aquell id:
begin;
delete from public.directories where category = 'personalitats';
insert into public.directories (
  category, section_key, section_title, section_short_label, section_icon, section_accent,
  section_sort, subsection_title, subsection_icon, subsection_compact, subsection_sort,
  position, name, detail, flag, url, recent, entry_sort
)
select * from jsonb_to_recordset(
  (select content::jsonb from net._http_response where id = <ID> and status_code = 200)
) as x(
  category text, section_key text, section_title text, section_short_label text, section_icon text,
  section_accent text, section_sort int, subsection_title text, subsection_icon text,
  subsection_compact boolean, subsection_sort int, position text, name text, detail text,
  flag text, url text, recent boolean, entry_sort int
);
commit;
```

Comprova després que el nombre de files coincideix amb el que diu
`publica.mjs`.

## Compte amb el cron

A Supabase hi ha l'edge function `update-directories` (crons
`update-directories-weekly` i `update-directories-thursday`), que revisa
aquests grups amb Claude Haiku i en pot reescriure les files. Si torna a
estar activa, pot desfer dades verificades.
