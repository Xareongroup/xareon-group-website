-- Additive employee-management foundation. No existing employee, job, or role
-- records are removed or rewritten. Apply to staging and regenerate types before
-- enabling the profile/skills/availability UI that depends on these columns.

alter table public.employees
  add column if not exists address text,
  add column if not exists emergency_contact_name text,
  add column if not exists emergency_contact_phone text,
  add column if not exists profile_photo_url text;

create table if not exists public.employee_skills (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid not null references public.employees(id) on delete cascade,
  skill text not null,
  created_at timestamptz not null default now(),
  unique (employee_id, skill)
);

create table if not exists public.employee_availability (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid not null references public.employees(id) on delete cascade,
  weekday smallint not null check (weekday between 0 and 6),
  is_available boolean not null default true,
  start_time time,
  end_time time,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (employee_id, weekday),
  check ((not is_available) or (start_time is not null and end_time is not null and end_time > start_time))
);

create index if not exists employee_skills_skill_idx on public.employee_skills(skill);
create index if not exists employee_availability_employee_weekday_idx on public.employee_availability(employee_id, weekday);

alter table public.employee_skills enable row level security;
alter table public.employee_availability enable row level security;

create policy "rbac employee skills read" on public.employee_skills for select to authenticated using (public.has_permission('employees', 'read'));
create policy "rbac employee skills manage" on public.employee_skills for all to authenticated using (public.has_permission('employees', 'update')) with check (public.has_permission('employees', 'update'));
create policy "rbac employee availability read" on public.employee_availability for select to authenticated using (public.has_permission('employees', 'read'));
create policy "rbac employee availability manage" on public.employee_availability for all to authenticated using (public.has_permission('employees', 'update')) with check (public.has_permission('employees', 'update'));
