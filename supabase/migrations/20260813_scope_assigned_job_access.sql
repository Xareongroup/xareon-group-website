-- STAGING-FIRST job assignment scoping.
--
-- Impact: replaces only the existing jobs/job_photos RBAC policies. It does
-- not change tables, columns, constraints, or business data. Calendar events
-- use public.jobs, so this also scopes calendar visibility.
--
-- Rollback: replace these named policies with the prior policies from
-- 20260807_replace_permissive_crm_rls.sql after an approved security review.

create or replace function public.can_access_assigned_job(target_job_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles ur
    join public.jobs j on j.id = target_job_id
    where ur.user_id = auth.uid()
      and ur.role in ('employee', 'contractor')
      and ur.employee_id = j.assigned_employee_id
  )
$$;

create or replace function public.can_manage_jobs(target_action text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(exists (
    select 1
    from public.user_roles ur
    join public.role_permissions rp on rp.role = ur.role
    where ur.user_id = auth.uid()
      and ur.role in ('owner', 'admin', 'manager')
      and rp.resource in ('jobs', '*')
      and case target_action
        when 'create' then rp.can_create
        when 'read' then rp.can_read
        when 'update' then rp.can_update
        when 'delete' then rp.can_delete
        else false
      end
  ), false)
$$;

drop policy if exists "rbac jobs operational" on public.jobs;
drop policy if exists "rbac jobs operational write" on public.jobs;
drop policy if exists "rbac jobs operational update" on public.jobs;
drop policy if exists "rbac jobs operational delete" on public.jobs;
drop policy if exists "rbac job photos" on public.job_photos;
drop policy if exists "rbac job photos write" on public.job_photos;

create policy "rbac jobs assignment scoped read"
on public.jobs for select to authenticated
using (
  public.can_manage_jobs('read')
  or public.can_access_assigned_job(id)
);

create policy "rbac jobs management create"
on public.jobs for insert to authenticated
with check (
  public.can_manage_jobs('create')
);

create policy "rbac jobs management update"
on public.jobs for update to authenticated
using (
  public.can_manage_jobs('update')
)
with check (
  public.can_manage_jobs('update')
);

create policy "rbac jobs management delete"
on public.jobs for delete to authenticated
using (
  public.can_manage_jobs('delete')
);

create policy "rbac job photos assignment scoped read"
on public.job_photos for select to authenticated
using (
  public.can_manage_jobs('read')
  or public.can_access_assigned_job(job_id)
);

create policy "rbac job photos management write"
on public.job_photos for all to authenticated
using (
  public.can_manage_jobs('update')
)
with check (
  public.can_manage_jobs('update')
);
