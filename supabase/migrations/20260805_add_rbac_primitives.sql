-- Additive RBAC hardening for the new financial foundation. No existing
-- business table, record, column, trigger, or policy is modified or removed.

create table if not exists public.user_roles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('owner', 'admin', 'manager', 'employee', 'contractor', 'customer')),
  customer_id uuid references public.customers(id) on delete set null,
  employee_id uuid references public.employees(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.role_permissions (
  id uuid primary key default gen_random_uuid(),
  role text not null check (role in ('owner', 'admin', 'manager', 'employee', 'contractor', 'customer')),
  resource text not null,
  can_create boolean not null default false,
  can_read boolean not null default false,
  can_update boolean not null default false,
  can_delete boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (role, resource)
);

create index if not exists user_roles_role_idx on public.user_roles(role);
create index if not exists user_roles_customer_id_idx on public.user_roles(customer_id);
create index if not exists user_roles_employee_id_idx on public.user_roles(employee_id);
create index if not exists role_permissions_role_resource_idx on public.role_permissions(role, resource);

create or replace function public.rbac_set_updated_at()
returns trigger language plpgsql as $$ begin new.updated_at = now(); return new; end; $$;
create trigger user_roles_set_updated_at before update on public.user_roles for each row execute function public.rbac_set_updated_at();
create trigger role_permissions_set_updated_at before update on public.role_permissions for each row execute function public.rbac_set_updated_at();

alter table public.user_roles enable row level security;
alter table public.role_permissions enable row level security;

create policy "users can read their own role" on public.user_roles for select to authenticated using (user_id = auth.uid());
create policy "authenticated users can read role permissions" on public.role_permissions for select to authenticated using (true);

insert into public.role_permissions (role, resource, can_create, can_read, can_update, can_delete) values
  ('owner', '*', true, true, true, true),
  ('admin', '*', true, true, true, false),
  ('manager', 'customers', true, true, true, false),
  ('manager', 'jobs', true, true, true, false),
  ('manager', 'invoices', true, true, true, false),
  ('manager', 'financials', true, true, true, false),
  ('employee', 'jobs', false, true, true, false),
  ('contractor', 'assigned-jobs', false, true, true, false),
  ('customer', 'portal', false, true, false, false)
on conflict (role, resource) do nothing;

create or replace function public.has_permission(target_resource text, target_action text)
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce(exists (
    select 1 from public.user_roles ur join public.role_permissions rp on rp.role = ur.role
    where ur.user_id = auth.uid() and rp.resource in (target_resource, '*')
      and case target_action when 'create' then rp.can_create when 'read' then rp.can_read when 'update' then rp.can_update when 'delete' then rp.can_delete else false end
  ), false)
$$;

create policy "rbac read financial categories" on public.expense_categories for select to authenticated using (public.has_permission('financials', 'read'));
create policy "rbac create financial categories" on public.expense_categories for insert to authenticated with check (public.has_permission('financials', 'create'));
create policy "rbac update financial categories" on public.expense_categories for update to authenticated using (public.has_permission('financials', 'update')) with check (public.has_permission('financials', 'update'));
create policy "rbac delete financial categories" on public.expense_categories for delete to authenticated using (public.has_permission('financials', 'delete'));

create policy "rbac read financial vendors" on public.vendors for select to authenticated using (public.has_permission('financials', 'read'));
create policy "rbac create financial vendors" on public.vendors for insert to authenticated with check (public.has_permission('financials', 'create'));
create policy "rbac update financial vendors" on public.vendors for update to authenticated using (public.has_permission('financials', 'update')) with check (public.has_permission('financials', 'update'));
create policy "rbac delete financial vendors" on public.vendors for delete to authenticated using (public.has_permission('financials', 'delete'));

create policy "rbac read financial expenses" on public.expenses for select to authenticated using (public.has_permission('financials', 'read'));
create policy "rbac create financial expenses" on public.expenses for insert to authenticated with check (public.has_permission('financials', 'create'));
create policy "rbac update financial expenses" on public.expenses for update to authenticated using (public.has_permission('financials', 'update')) with check (public.has_permission('financials', 'update'));
create policy "rbac delete financial expenses" on public.expenses for delete to authenticated using (public.has_permission('financials', 'delete'));

create policy "rbac read expense receipts" on storage.objects for select to authenticated using (bucket_id = 'expense-receipts' and public.has_permission('financials', 'read'));
create policy "rbac create expense receipts" on storage.objects for insert to authenticated with check (bucket_id = 'expense-receipts' and public.has_permission('financials', 'create'));
create policy "rbac update expense receipts" on storage.objects for update to authenticated using (bucket_id = 'expense-receipts' and public.has_permission('financials', 'update')) with check (bucket_id = 'expense-receipts' and public.has_permission('financials', 'update'));
create policy "rbac delete expense receipts" on storage.objects for delete to authenticated using (bucket_id = 'expense-receipts' and public.has_permission('financials', 'delete'));
