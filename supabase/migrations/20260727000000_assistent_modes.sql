-- InfoPol Assistent — suport de 3 modes sobre la base de coneixement existent.
--
-- Afegeix a kb_documents una etiqueta de modes: així l'Eduardo pot carregar
-- documents que només vegi un mode concret (p. ex. plantilles de minutes
-- només per al Diligenciador). Per defecte, un document és visible a tots
-- els modes, de manera que els 104 documents actuals segueixen funcionant.
--
-- Idempotent: es pot re-executar sense fer mal.

-- 1) Columna de modes -------------------------------------------------------
alter table public.kb_documents
  add column if not exists modes text[] not null default array['operativa','diligencia','servei'];

comment on column public.kb_documents.modes is
  'Modes de l''assistent que poden veure aquest document: operativa, diligencia, servei.';

create index if not exists kb_documents_modes_idx on public.kb_documents using gin (modes);

-- 2) Cerca vectorial filtrada per mode --------------------------------------
-- Mateixa convenció que match_kb_documents (l''embedding arriba com a text).
create or replace function public.match_kb_documents_mode(
  query_embedding text,
  match_count integer default 8,
  p_mode text default 'operativa'
)
returns table (
  id uuid,
  title text,
  source text,
  kind text,
  content text,
  similarity double precision
)
language sql
stable
security definer
set search_path = public
as $$
  select
    d.id,
    d.title,
    d.source,
    d.kind,
    d.content,
    1 - (d.embedding <=> query_embedding::vector) as similarity
  from public.kb_documents d
  where d.embedding is not null
    and (p_mode is null or p_mode = any (d.modes))
  order by d.embedding <=> query_embedding::vector
  limit greatest(1, least(match_count, 20));
$$;

comment on function public.match_kb_documents_mode is
  'Cerca semàntica a kb_documents restringida als documents visibles per a un mode.';

revoke all on function public.match_kb_documents_mode(text, integer, text) from public, anon;
grant execute on function public.match_kb_documents_mode(text, integer, text) to service_role;
