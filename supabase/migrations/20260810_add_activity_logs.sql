-- Additive audit log for customer-facing workflow events. No existing data,
-- tables, or policies are removed.
create table if not exists public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers(id) on delete cascade,
  entity_type text not null,
  entity_id uuid,
  event_type text not null,
  title text not null,
  description text,
  actor_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists activity_logs_customer_created_idx on public.activity_logs(customer_id, created_at desc);
alter table public.activity_logs enable row level security;
create policy "rbac read activity logs" on public.activity_logs for select to authenticated using (public.has_permission('customers', 'read'));
create policy "rbac create activity logs" on public.activity_logs for insert to authenticated with check (public.has_permission('customers', 'update'));
