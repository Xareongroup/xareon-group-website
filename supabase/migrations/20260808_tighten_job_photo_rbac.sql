-- STAGING-FIRST follow-up: split job-photo writes so update permission cannot
-- implicitly grant delete permission. No business data or schema is changed.

drop policy if exists "rbac job photos write" on public.job_photos;

create policy "rbac job photos create" on public.job_photos for insert to authenticated
  with check (public.has_permission('jobs', 'update') or public.can_access_assigned_job(job_id));
create policy "rbac job photos update" on public.job_photos for update to authenticated
  using (public.has_permission('jobs', 'update') or public.can_access_assigned_job(job_id))
  with check (public.has_permission('jobs', 'update') or public.can_access_assigned_job(job_id));
create policy "rbac job photos delete" on public.job_photos for delete to authenticated
  using (public.has_permission('jobs', 'delete'));
