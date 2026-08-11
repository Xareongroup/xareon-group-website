-- Corrects policy overlap left by 20260808 when 20260813 switches job-photo
-- writes to management-only access. This migration changes RLS policies only:
-- it does not alter tables, columns, storage objects, or business records.
--
-- Rollback (only after security review): recreate the three dropped policies
-- from 20260808. Do not restore them while management-only writes are intended.

drop policy if exists "rbac job photos create" on public.job_photos;
drop policy if exists "rbac job photos update" on public.job_photos;
drop policy if exists "rbac job photos delete" on public.job_photos;

-- 20260813 creates this policy. Recreate it defensively only if it is absent
-- when this correction is applied after that migration.
do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'job_photos'
      and policyname = 'rbac job photos management write'
  ) then
    create policy "rbac job photos management write"
    on public.job_photos for all to authenticated
    using (public.can_manage_jobs('update'))
    with check (public.can_manage_jobs('update'));
  end if;
end;
$$;
