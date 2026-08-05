create extension if not exists pgcrypto;

create table if not exists public.expense_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  group_name text not null default 'Other',
  description text,
  is_system boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.vendors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  company text,
  phone text,
  email text,
  address text,
  category text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.expenses (
  id uuid primary key default gen_random_uuid(),
  expense_number text not null unique,
  date date not null default current_date,
  category_id uuid references public.expense_categories(id) on delete set null,
  vendor_id uuid references public.vendors(id) on delete set null,
  customer_id uuid references public.customers(id) on delete set null,
  job_id uuid references public.jobs(id) on delete set null,
  employee_id uuid references public.employees(id) on delete set null,
  description text not null,
  amount numeric(12,2) not null check (amount >= 0),
  payment_method text not null default 'Cash' check (payment_method in ('Cash','Credit Card','Bank Transfer','Check')),
  status text not null default 'Paid' check (status in ('Paid','Pending','Reimbursed')),
  receipt_url text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists expenses_date_idx on public.expenses(date desc);
create index if not exists expenses_job_id_idx on public.expenses(job_id);
create index if not exists expenses_customer_id_idx on public.expenses(customer_id);
create index if not exists expenses_category_id_idx on public.expenses(category_id);
create index if not exists expenses_vendor_id_idx on public.expenses(vendor_id);

insert into public.expense_categories (name, group_name, is_system) values
  ('Contractor Payments','Labor',true),('Subcontractors','Labor',true),('Temporary Labor','Labor',true),('Freelancers','Labor',true),
  ('Third Party Lead Fees','Marketing',true),('Advertising','Marketing',true),('Promotions','Marketing',true),
  ('Gas/Fuel','Vehicles',true),('Vehicle Insurance','Vehicles',true),('Vehicle Maintenance','Vehicles',true),('Repairs','Vehicles',true),('Registration','Vehicles',true),
  ('General Liability Insurance','Insurance',true),('Business Insurance','Insurance',true),('Other Insurance','Insurance',true),
  ('Construction Materials','Materials',true),('Supplies','Materials',true),('Project Materials','Materials',true),
  ('Tools','Equipment',true),('Equipment Purchases','Equipment',true),('Equipment Rental','Equipment',true),
  ('Software','Technology',true),('Subscriptions','Technology',true),('Online Services','Technology',true),
  ('Office Supplies','Office',true),('Phone','Office',true),('Internet','Office',true),('Miscellaneous','Other',true)
on conflict (name) do nothing;

create or replace function public.set_updated_at() returns trigger language plpgsql as $$ begin new.updated_at = now(); return new; end; $$;
drop trigger if exists expenses_set_updated_at on public.expenses;
create trigger expenses_set_updated_at before update on public.expenses for each row execute function public.set_updated_at();
drop trigger if exists vendors_set_updated_at on public.vendors;
create trigger vendors_set_updated_at before update on public.vendors for each row execute function public.set_updated_at();
drop trigger if exists expense_categories_set_updated_at on public.expense_categories;
create trigger expense_categories_set_updated_at before update on public.expense_categories for each row execute function public.set_updated_at();

alter table public.expense_categories enable row level security;
alter table public.vendors enable row level security;
alter table public.expenses enable row level security;
create policy "authenticated financial access" on public.expense_categories for all to authenticated using (true) with check (true);
create policy "authenticated financial access" on public.vendors for all to authenticated using (true) with check (true);
create policy "authenticated financial access" on public.expenses for all to authenticated using (true) with check (true);

insert into storage.buckets (id, name, public) values ('expense-receipts','expense-receipts',false) on conflict (id) do nothing;
create policy "authenticated expense receipt access" on storage.objects for all to authenticated using (bucket_id = 'expense-receipts') with check (bucket_id = 'expense-receipts');
