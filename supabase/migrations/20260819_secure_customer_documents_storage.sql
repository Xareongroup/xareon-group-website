-- Replaces only the permissive customer-documents storage object policies.
-- The bucket remains private and no storage object, customer document record,
-- or business record is changed.
--
-- Portal downloads deliberately use the server-side portal access layer and a
-- service-role signed URL after the document is checked against the token's
-- customer. Customers therefore receive no direct storage.objects policy.

drop policy if exists "Authenticated users can delete customer documents" on storage.objects;
drop policy if exists "Authenticated users can upload customer documents" on storage.objects;
drop policy if exists "Authenticated users can view customer documents" on storage.objects;
drop policy if exists "customer documents update" on storage.objects;
drop policy if exists "customer documents view" on storage.objects;

create policy "rbac customer documents storage read"
on storage.objects for select to authenticated
using (
  bucket_id = 'customer-documents'
  and public.has_permission('documents', 'read')
);

create policy "rbac customer documents storage create"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'customer-documents'
  and public.has_permission('documents', 'create')
);

create policy "rbac customer documents storage update"
on storage.objects for update to authenticated
using (
  bucket_id = 'customer-documents'
  and public.has_permission('documents', 'update')
)
with check (
  bucket_id = 'customer-documents'
  and public.has_permission('documents', 'update')
);

create policy "rbac customer documents storage delete"
on storage.objects for delete to authenticated
using (
  bucket_id = 'customer-documents'
  and public.has_permission('documents', 'delete')
);
