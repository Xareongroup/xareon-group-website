-- STAGING-FIRST RBAC policy replacement.
-- Preconditions: 20260805_add_rbac_primitives.sql and
-- 20260806_fix_invoice_financial_rls.sql have been applied and the owner is
-- present in public.user_roles. This migration changes policies only; it does
-- not alter or delete business records, tables, columns, or files.
--
-- Rollback: restore the prior named policies from the production-parity
-- baseline only after an approved security review. Do not reintroduce broad
-- authenticated policies in production.

insert into public.role_permissions (role, resource, can_create, can_read, can_update, can_delete) values
  ('manager', 'estimates', true, true, true, false),
  ('manager', 'contracts', true, true, true, false),
  ('manager', 'documents', true, true, true, false),
  ('employee', 'jobs', false, true, true, false)
on conflict (role, resource) do update set
  can_create = excluded.can_create, can_read = excluded.can_read,
  can_update = excluded.can_update, can_delete = excluded.can_delete;

create or replace function public.can_access_assigned_job(target_job_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.user_roles ur join public.jobs j on j.id = target_job_id
    where ur.user_id = auth.uid() and ur.role = 'contractor'
      and ur.employee_id = j.assigned_employee_id
  )
$$;

-- Remove only the known permissive CRM policies from the verified baseline.
drop policy if exists "Authenticated users can delete contracts" on public.contracts;
drop policy if exists "Authenticated users can insert contracts" on public.contracts;
drop policy if exists "Authenticated users can update contracts" on public.contracts;
drop policy if exists "Authenticated users can view contracts" on public.contracts;
drop policy if exists "Authenticated users can delete customers" on public.customers;
drop policy if exists "Authenticated users can insert customers" on public.customers;
drop policy if exists "Authenticated users can update customers" on public.customers;
drop policy if exists "Authenticated users can view customers" on public.customers;
drop policy if exists "Authenticated users can delete estimates" on public.estimates;
drop policy if exists "Authenticated users can insert estimates" on public.estimates;
drop policy if exists "Authenticated users can update estimates" on public.estimates;
drop policy if exists "Authenticated users can view estimates" on public.estimates;
drop policy if exists "Authenticated users can delete estimate items" on public.estimate_items;
drop policy if exists "Authenticated users can insert estimate items" on public.estimate_items;
drop policy if exists "Authenticated users can update estimate items" on public.estimate_items;
drop policy if exists "Authenticated users can view estimate items" on public.estimate_items;
drop policy if exists "Authenticated users can delete jobs" on public.jobs;
drop policy if exists "Authenticated users can insert jobs" on public.jobs;
drop policy if exists "Authenticated users can update jobs" on public.jobs;
drop policy if exists "Authenticated users can view jobs" on public.jobs;
drop policy if exists "job_photos_delete" on public.job_photos;
drop policy if exists "job_photos_insert" on public.job_photos;
drop policy if exists "job_photos_select" on public.job_photos;
drop policy if exists "job_photos_update" on public.job_photos;
drop policy if exists "Allow authenticated users customer documents" on public.customer_documents;
drop policy if exists "Allow authenticated users delete documents" on public.customer_documents;
drop policy if exists "Allow authenticated users insert documents" on public.customer_documents;
drop policy if exists "Allow authenticated users to delete documents" on public.customer_documents;
drop policy if exists "Allow authenticated users to insert documents" on public.customer_documents;
drop policy if exists "Allow authenticated users to update documents" on public.customer_documents;
drop policy if exists "Allow authenticated users to view documents" on public.customer_documents;
drop policy if exists "Allow authenticated users view documents" on public.customer_documents;

create policy "rbac customers read" on public.customers for select to authenticated using (public.has_permission('customers', 'read'));
create policy "rbac customers create" on public.customers for insert to authenticated with check (public.has_permission('customers', 'create'));
create policy "rbac customers update" on public.customers for update to authenticated using (public.has_permission('customers', 'update')) with check (public.has_permission('customers', 'update'));
create policy "rbac customers delete" on public.customers for delete to authenticated using (public.has_permission('customers', 'delete'));
create policy "rbac estimates read" on public.estimates for select to authenticated using (public.has_permission('estimates', 'read'));
create policy "rbac estimates create" on public.estimates for insert to authenticated with check (public.has_permission('estimates', 'create'));
create policy "rbac estimates update" on public.estimates for update to authenticated using (public.has_permission('estimates', 'update')) with check (public.has_permission('estimates', 'update'));
create policy "rbac estimates delete" on public.estimates for delete to authenticated using (public.has_permission('estimates', 'delete'));
create policy "rbac estimate items read" on public.estimate_items for select to authenticated using (public.has_permission('estimates', 'read'));
create policy "rbac estimate items create" on public.estimate_items for insert to authenticated with check (public.has_permission('estimates', 'create'));
create policy "rbac estimate items update" on public.estimate_items for update to authenticated using (public.has_permission('estimates', 'update')) with check (public.has_permission('estimates', 'update'));
create policy "rbac estimate items delete" on public.estimate_items for delete to authenticated using (public.has_permission('estimates', 'delete'));
create policy "rbac contracts read" on public.contracts for select to authenticated using (public.has_permission('contracts', 'read'));
create policy "rbac contracts create" on public.contracts for insert to authenticated with check (public.has_permission('contracts', 'create'));
create policy "rbac contracts update" on public.contracts for update to authenticated using (public.has_permission('contracts', 'update')) with check (public.has_permission('contracts', 'update'));
create policy "rbac contracts delete" on public.contracts for delete to authenticated using (public.has_permission('contracts', 'delete'));
create policy "rbac documents read" on public.customer_documents for select to authenticated using (public.has_permission('documents', 'read'));
create policy "rbac documents create" on public.customer_documents for insert to authenticated with check (public.has_permission('documents', 'create'));
create policy "rbac documents update" on public.customer_documents for update to authenticated using (public.has_permission('documents', 'update')) with check (public.has_permission('documents', 'update'));
create policy "rbac documents delete" on public.customer_documents for delete to authenticated using (public.has_permission('documents', 'delete'));
create policy "rbac jobs operational" on public.jobs for select to authenticated
  using (public.has_permission('jobs', 'read') or public.can_access_assigned_job(id));
create policy "rbac jobs operational write" on public.jobs for insert to authenticated
  with check (public.has_permission('jobs', 'create'));
create policy "rbac jobs operational update" on public.jobs for update to authenticated
  using (public.has_permission('jobs', 'update') or public.can_access_assigned_job(id))
  with check (public.has_permission('jobs', 'update') or public.can_access_assigned_job(id));
create policy "rbac jobs operational delete" on public.jobs for delete to authenticated
  using (public.has_permission('jobs', 'delete'));
create policy "rbac job photos" on public.job_photos for select to authenticated
  using (public.has_permission('jobs', 'read') or public.can_access_assigned_job(job_id));
create policy "rbac job photos write" on public.job_photos for all to authenticated
  using (public.has_permission('jobs', 'update') or public.can_access_assigned_job(job_id))
  with check (public.has_permission('jobs', 'update') or public.can_access_assigned_job(job_id));
