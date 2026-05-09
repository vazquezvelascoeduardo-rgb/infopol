-- ════════════════════════════════════════════════════════════════════
--   InfoPol — esquema Supabase (Phase 1)
--
--   Còpia aquest fitxer al SQL Editor del teu projecte Supabase i
--   executa'l UNA sola vegada. Crea les 4 taules de sincronització
--   amb Row-Level Security (cada usuari només llegeix/escriu les
--   seves files, excepte el leaderboard de profiles que és públic).
--
--   Les taules són opt-in: l'app local funciona sense backend i,
--   quan l'usuari s'autentica, el client puja el progrés del seu
--   localStorage. Vegeu lib/sync.ts per a la lògica de sync.
-- ════════════════════════════════════════════════════════════════════

-- ─── 1) profiles ──────────────────────────────────────────────────
-- Una fila per cada usuari registrat. Auto-creada via trigger quan
-- es registra un user nou (auth.users → profiles). El `display_name`
-- es pot editar des dels settings de l'app.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_color smallint not null default 0,
  avatar_pet smallint not null default 0,
  avatar_badge smallint not null default 0,
  theme smallint not null default 0,
  total_xp integer not null default 0,
  streak_days integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Lectura pública (per al leaderboard de la lliga).
drop policy if exists "profiles read all" on public.profiles;
create policy "profiles read all"
  on public.profiles for select
  using (true);

-- Cada usuari només pot escriure el seu perfil.
drop policy if exists "profiles upsert own" on public.profiles;
create policy "profiles upsert own"
  on public.profiles for insert
  with check (auth.uid() = id);

drop policy if exists "profiles update own" on public.profiles;
create policy "profiles update own"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Trigger: en registrar-se un usuari nou crea la fila a profiles.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'name',
      split_part(new.email, '@', 1)
    )
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();


-- ─── 2) topic_progress ────────────────────────────────────────────
-- Una fila per (user, tema). Mateixa forma que TopicStats al client.

create table if not exists public.topic_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  topic_slug text not null,
  attempts integer not null default 0,
  best numeric(4,1) not null default 0,
  last numeric(4,1) not null default 0,
  total_correct integer not null default 0,
  total_wrong integer not null default 0,
  total_blank integer not null default 0,
  total_questions integer not null default 0,
  total_seconds integer not null default 0,
  last_at timestamptz,
  primary key (user_id, topic_slug)
);

alter table public.topic_progress enable row level security;

drop policy if exists "topic_progress own" on public.topic_progress;
create policy "topic_progress own"
  on public.topic_progress for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);


-- ─── 3) failures (SRS / Leitner) ──────────────────────────────────
-- Cua de repàs Anki: cada pregunta fallada amb el seu calendari.

create table if not exists public.failures (
  user_id uuid not null references auth.users(id) on delete cascade,
  question_id text not null,
  topic_slug text not null,
  ease smallint not null default 0,           -- "box" Leitner
  last_review timestamptz,
  next_review timestamptz,
  reviews integer not null default 0,
  learned boolean not null default false,
  primary key (user_id, question_id)
);

alter table public.failures enable row level security;

drop policy if exists "failures own" on public.failures;
create policy "failures own"
  on public.failures for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index if not exists failures_due_idx
  on public.failures (user_id, next_review)
  where learned = false;


-- ─── 4) favorites ────────────────────────────────────────────────
-- Fitxes / temes / operatives marcats com a favorits per l'usuari.

create table if not exists public.favorites (
  user_id uuid not null references auth.users(id) on delete cascade,
  kind text not null,            -- 'law' | 'operativa' | 'topic' | 'fitxa'
  slug text not null,
  module_slug text,              -- modul:slug per a navegació
  title text,
  created_at timestamptz not null default now(),
  primary key (user_id, kind, slug)
);

alter table public.favorites enable row level security;

drop policy if exists "favorites own" on public.favorites;
create policy "favorites own"
  on public.favorites for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);


-- ─── 5) leaderboard view ──────────────────────────────────────────
-- Vista pública (sense PII real, només display_name + total_xp) per
-- mostrar el top-N a la pàgina de Reptes.

create or replace view public.leaderboard as
  select
    id,
    coalesce(display_name, 'Agent') as display_name,
    avatar_color,
    avatar_pet,
    total_xp,
    streak_days
  from public.profiles
  order by total_xp desc;

-- La vista hereta el RLS de profiles (que és select públic), així que
-- no cal cap policy addicional.
