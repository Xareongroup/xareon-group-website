-- Creates the private bucket already referenced by the estimate, contract,
-- invoice, receipt, and portal document workflows. No existing files or
-- policies are changed. Portal downloads use server-generated signed URLs.

insert into storage.buckets (id, name, public)
values ('customer-documents', 'customer-documents', false)
on conflict (id) do update set public = false;
