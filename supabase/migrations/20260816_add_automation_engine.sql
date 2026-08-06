-- STAGING-FIRST automation foundation. Additive tables only; no existing
-- workflow, customer, or financial records are changed.

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  assigned_user uuid references auth.users(id) on delete set null,
  due_date timestamptz,
  status text not null default 'Open' check (status in ('Open', 'In Progress', 'Completed', 'Cancelled')),
  priority text not null default 'Normal' check (priority in ('Low', 'Normal', 'High', 'Urgent')),
  related_type text,
  related_id uuid,
  customer_id uuid references public.customers(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.automation_logs (
  id uuid primary key default gen_random_uuid(),
  event_type text not null,
  action_type text not null,
  status text not null check (status in ('Succeeded', 'Skipped', 'Failed')),
  entity_type text,
  entity_id uuid,
  customer_id uuid references public.customers(id) on delete set null,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists tasks_assigned_status_due_idx on public.tasks(assigned_user, status, due_date);
create index if not exists tasks_related_idx on public.tasks(related_type, related_id);
create index if not exists automation_logs_event_created_idx on public.automation_logs(event_type, created_at desc);

alter table public.tasks enable row level security;
alter table public.automation_logs enable row level security;

create policy "rbac automation managers tasks" on public.tasks for all to authenticated
using (exists (select 1 from public.user_roles where user_id = auth.uid() and role in ('owner', 'admin', 'manager')))
with check (exists (select 1 from public.user_roles where user_id = auth.uid() and role in ('owner', 'admin', 'manager')));
create policy "rbac assigned users read tasks" on public.tasks for select to authenticated using (assigned_user = auth.uid());
create policy "rbac assigned users update tasks" on public.tasks for update to authenticated using (assigned_user = auth.uid()) with check (assigned_user = auth.uid());
create policy "rbac automation managers logs" on public.automation_logs for select to authenticated using (exists (select 1 from public.user_roles where user_id = auth.uid() and role in ('owner', 'admin', 'manager')));
