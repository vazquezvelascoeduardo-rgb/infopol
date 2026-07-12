-- InfoPol Chat — esquema del RAG (idempotent, es pot re-executar).
-- Executa-ho al SQL Editor del projecte dnjblfqantxdqfvqbqqi
-- (o amb `supabase db push` si fas servir el CLI).

create extension if not exists vector;

-- Fragments del corpus amb el seu embedding (Gemini text-embedding-004, 768 dims).
create table if not exists public.chat_docs (
  id         bigserial primary key,
  source     text not null,            -- clau d'agrupació (per a replace/purge)
  title      text not null,
  kind       text not null default 'document',
  content    text not null,
  embedding  vector(768) not null,
  created_at timestamptz not null default now()
);

-- Només l'Edge Function (service role) hi accedeix: RLS sense polítiques.
alter table public.chat_docs enable row level security;

create index if not exists chat_docs_source_idx on public.chat_docs (source);
-- HNSW per a cerca per similitud de cosinus.
create index if not exists chat_docs_embedding_idx
  on public.chat_docs using hnsw (embedding vector_cosine_ops);

-- Cerca semàntica: retorna els fragments més semblants a la consulta.
create or replace function public.match_chat_docs(
  query_embedding vector(768),
  match_count int default 8
)
returns table (
  id bigint,
  source text,
  title text,
  kind text,
  content text,
  similarity float
)
language sql stable
security definer set search_path = public
as $$
  select d.id, d.source, d.title, d.kind, d.content,
         1 - (d.embedding <=> query_embedding) as similarity
  from public.chat_docs d
  order by d.embedding <=> query_embedding
  limit match_count;
$$;

-- Comptador de consultes per usuari i dia (límit diari a la funció).
create table if not exists public.chat_usage (
  user_id uuid not null references auth.users(id) on delete cascade,
  day     date not null,
  count   int  not null default 0,
  primary key (user_id, day)
);
alter table public.chat_usage enable row level security;
