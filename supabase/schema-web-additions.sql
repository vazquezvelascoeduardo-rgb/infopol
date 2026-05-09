-- ════════════════════════════════════════════════════════════════════
--   InfoPol — Addicions web a l'esquema de Supabase compartit
--
--   AQUEST FITXER NOMÉS conté afegits que no existeixen al projecte
--   Supabase de la mòbil i que la web necessita. NO toca cap taula
--   existent (profiles, user_progress, attempts, flashcards_progress,
--   missions_progress, subscriptions, ai_usage, push_tokens).
--
--   Còpia'l al SQL Editor del MATEIX projecte Supabase que fa servir
--   la mòbil i executa'l. És idempotent — pots tornar a executar-lo
--   sense por.
-- ════════════════════════════════════════════════════════════════════

-- ─── 1) Customització de Reptes (avatar/tema) a profiles ────────
-- Quatre columnes addicionals per persistir les eleccions de la
-- pàgina /retos: color uniforme, mascota guia, insígnia de banda i
-- tema de l'app. Tots opcionals i amb default 0.

alter table public.profiles
  add column if not exists avatar_color smallint not null default 0,
  add column if not exists avatar_pet   smallint not null default 0,
  add column if not exists avatar_badge smallint not null default 0,
  add column if not exists theme        smallint not null default 0;


-- ─── 2) Favorits ─────────────────────────────────────────────────
-- Lleis, operatives i fitxes marcades per l'usuari. La mòbil pot
-- afegir aquesta funcionalitat reutilitzant la mateixa taula sense
-- canvis.

create table if not exists public.favorites (
  user_id     uuid not null references auth.users(id) on delete cascade,
  kind        text not null,        -- 'law' | 'operativa' | 'topic' | 'fitxa'
  slug        text not null,
  module_slug text,                  -- modul:slug per a navegació
  title       text,
  created_at  timestamptz not null default now(),
  primary key (user_id, kind, slug)
);

alter table public.favorites enable row level security;

drop policy if exists "favorites own" on public.favorites;
create policy "favorites own"
  on public.favorites for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);


-- ─── 3) Vista leaderboard (només si no existeix ja) ──────────────
-- Top usuaris per XP — depèn de la taula user_progress que ja existeix
-- al teu esquema.

create or replace view public.leaderboard as
  select
    p.id,
    coalesce(p.name, split_part(coalesce(p.email, 'agent'), '@', 1)) as display_name,
    p.cuerpo,
    p.department,
    coalesce(p.avatar_color, 0) as avatar_color,
    coalesce(p.avatar_pet,   0) as avatar_pet,
    coalesce(up.xp, 0) as total_xp,
    coalesce(up.level, 1) as level,
    coalesce(up.gems, 0) as gems,
    coalesce(up.streak_count, 0) as streak_count,
    up.streak_last_date
  from public.profiles p
  left join public.user_progress up on up.user_id = p.id
  order by total_xp desc;

-- La vista hereta el RLS de profiles + user_progress.
