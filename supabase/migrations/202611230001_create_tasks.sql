-- Aplicar en el proyecto Supabase de esta demostración, revisado por Orquestador.
begin;

create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  title text not null,
  description text not null default '',
  status text not null default 'pending',
  priority text not null default 'medium',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint tasks_title_valid check (
    char_length(title) between 1 and 120
    and title = btrim(title)
    and title ~ '[^[:space:]]'
    and title !~ '[[:cntrl:]]'
  ),
  constraint tasks_description_valid check (char_length(description) <= 500),
  constraint tasks_status_valid check (status in ('pending', 'in_progress', 'done')),
  constraint tasks_priority_valid check (priority in ('low', 'medium', 'high'))
);

create index tasks_owner_created_idx on public.tasks (owner_id, created_at desc);
alter table public.tasks enable row level security;

revoke all on public.tasks from anon, authenticated;
grant select, delete on public.tasks to authenticated;
grant insert (owner_id, title, description, status, priority) on public.tasks to authenticated;
grant update (title, description, status, priority) on public.tasks to authenticated;

create policy tasks_select_own on public.tasks for select to authenticated
  using (owner_id = (select auth.uid()));
create policy tasks_insert_own on public.tasks for insert to authenticated
  with check (owner_id = (select auth.uid()));
create policy tasks_update_own on public.tasks for update to authenticated
  using (owner_id = (select auth.uid()))
  with check (owner_id = (select auth.uid()));
create policy tasks_delete_own on public.tasks for delete to authenticated
  using (owner_id = (select auth.uid()));

create function public.set_task_updated_at() returns trigger
language plpgsql set search_path = '' as $$
begin
  new.updated_at = pg_catalog.now();
  return new;
end;
$$;
revoke all on function public.set_task_updated_at() from public;
create trigger tasks_set_updated_at before update on public.tasks
  for each row execute function public.set_task_updated_at();

commit;
