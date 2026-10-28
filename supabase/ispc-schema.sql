create table public.ispc_admins (
 user_id uuid primary key references auth.users(id),
 created_at timestamptz not null default now()
);
create table public.ispc_access (
 user_id uuid primary key references auth.users(id),
 email text not null,
 active boolean not null default true,
 granted_at timestamptz not null default now()
);
create table public.ispc_topics (
 slug text primary key,
 title text not null,
 module text not null,
 source_count integer not null default 0,
 question_count integer not null default 0
);
create table public.ispc_questions (
 id text primary key,
 topic_slug text not null references public.ispc_topics(slug),
 text text not null,
 options jsonb not null check (jsonb_array_length(options)=4),
 correct integer not null check (correct between 0 and 3),
 reference text not null,
 explanation text,
 source_hash text not null,
 source_page integer not null,
 reviewed boolean not null default false
);
create index ispc_questions_topic_idx on public.ispc_questions(topic_slug);
alter table public.ispc_admins enable row level security;
alter table public.ispc_access enable row level security;
alter table public.ispc_topics enable row level security;
alter table public.ispc_questions enable row level security;
revoke all on public.ispc_admins,public.ispc_access,public.ispc_topics,public.ispc_questions from anon,authenticated;
grant select on public.ispc_admins,public.ispc_access,public.ispc_topics,public.ispc_questions to authenticated;
create policy ispc_admin_self on public.ispc_admins for select to authenticated using(user_id=(select auth.uid()));
create policy ispc_access_self on public.ispc_access for select to authenticated using(user_id=(select auth.uid()) or exists(select 1 from public.ispc_admins where user_id=(select auth.uid())));
create policy ispc_topics_authorized on public.ispc_topics for select to authenticated using(exists(select 1 from public.ispc_access where user_id=(select auth.uid()) and active));
create policy ispc_questions_authorized on public.ispc_questions for select to authenticated using(reviewed and exists(select 1 from public.ispc_access where user_id=(select auth.uid()) and active));
create function public.ispc_set_access(target_email text, enabled boolean) returns void
language plpgsql security definer set search_path='' as $$
declare target_id uuid;
begin
 if auth.uid() is null or not exists(select 1 from public.ispc_admins where user_id=auth.uid()) then
  raise exception 'Accés reservat a administradors' using errcode='42501';
 end if;
 select id into target_id from auth.users where lower(email)=lower(trim(target_email)) and email_confirmed_at is not null;
 if target_id is null then raise exception 'Aquest correu no té un compte verificat a InfoPol'; end if;
 if exists(select 1 from public.ispc_admins where user_id=target_id) and not enabled then
  raise exception 'No es pot desactivar un administrador';
 end if;
 insert into public.ispc_access(user_id,email,active) values(target_id,lower(trim(target_email)),enabled)
 on conflict(user_id) do update set active=excluded.active,email=excluded.email;
end;
$$;
revoke all on function public.ispc_set_access(text,boolean) from public,anon;
grant execute on function public.ispc_set_access(text,boolean) to authenticated;
insert into public.ispc_admins(user_id) select id from auth.users where lower(email) in ('vazquezvelascoeduardo@gmail.com','eduguapo98@gmail.com');
insert into public.ispc_access(user_id,email) select u.id,u.email from auth.users u join public.ispc_admins a on a.user_id=u.id;
create schema if not exists ispc_private;
revoke all on schema ispc_private from public;
grant usage on schema ispc_private to authenticated;
alter function public.ispc_set_access(text,boolean) set schema ispc_private;
create function public.ispc_set_access(target_email text, enabled boolean) returns void
language sql security invoker set search_path='' as $$
 select ispc_private.ispc_set_access(target_email,enabled);
$$;
revoke all on function public.ispc_set_access(text,boolean) from public,anon;
grant execute on function public.ispc_set_access(text,boolean) to authenticated;

