-- Additive sales-pipeline foundation. This migration creates new tables and
-- indexes only; it does not change or remove any existing CRM records.

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  lead_number text not null unique,
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text not null,
  address text,
  service_type text,
  message text,
  photos jsonb not null default '[]'::jsonb,
  source text not null default 'Website',
  status text not null default 'New',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  converted_customer_id uuid references public.customers(id) on delete set null,
  assigned_to uuid references public.employees(id) on delete set null,
  constraint leads_source_check check (source in ('Website','Google Ads','Thumbtack','Angi','Referral','Facebook','Instagram','Other')),
  constraint leads_status_check check (status in ('New','Contacted','Estimate Scheduled','Estimate Sent','Negotiating','Converted','Lost'))
);

create table if not exists public.lead_activities (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  activity_type text not null,
  description text,
  created_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null
);

create index if not exists leads_status_created_idx on public.leads(status, created_at desc);
create index if not exists leads_source_created_idx on public.leads(source, created_at desc);
create index if not exists leads_assigned_to_idx on public.leads(assigned_to);
create index if not exists lead_activities_lead_created_idx on public.lead_activities(lead_id, created_at desc);

insert into storage.buckets (id, name, public)
values ('lead-photos', 'lead-photos', false)
on conflict (id) do nothing;

create or replace function public.generate_lead_number()
returns text language plpgsql security definer set search_path = public as $$
declare
  year_text text := to_char(current_date, 'YYYY');
  next_value integer;
begin
  perform pg_advisory_xact_lock(hashtext('xareon:lead_number:' || year_text));
  select coalesce(max(nullif(substring(lead_number from 11), '')::integer), 0) + 1
    into next_value
    from public.leads
    where lead_number like ('LEAD-' || year_text || '-%');
  return 'LEAD-' || year_text || '-' || lpad(next_value::text, 5, '0');
end;
$$;

grant execute on function public.generate_lead_number() to authenticated, service_role;

create or replace function public.leads_set_updated_at()
returns trigger language plpgsql as $$ begin new.updated_at = now(); return new; end; $$;
drop trigger if exists leads_set_updated_at on public.leads;
create trigger leads_set_updated_at before update on public.leads for each row execute function public.leads_set_updated_at();

alter table public.leads enable row level security;
alter table public.lead_activities enable row level security;

insert into public.role_permissions (role, resource, can_create, can_read, can_update, can_delete) values
  ('manager', 'leads', true, true, true, false),
  ('employee', 'leads', false, true, true, false)
on conflict (role, resource) do update set
  can_create = excluded.can_create, can_read = excluded.can_read,
  can_update = excluded.can_update, can_delete = excluded.can_delete;

create policy "rbac leads read" on public.leads for select to authenticated using (public.has_permission('leads', 'read'));
create policy "rbac leads create" on public.leads for insert to authenticated with check (public.has_permission('leads', 'create'));
create policy "rbac leads update" on public.leads for update to authenticated using (public.has_permission('leads', 'update')) with check (public.has_permission('leads', 'update'));
create policy "rbac leads delete" on public.leads for delete to authenticated using (public.has_permission('leads', 'delete'));
create policy "rbac lead activities read" on public.lead_activities for select to authenticated using (public.has_permission('leads', 'read'));
create policy "rbac lead activities create" on public.lead_activities for insert to authenticated with check (public.has_permission('leads', 'update'));
