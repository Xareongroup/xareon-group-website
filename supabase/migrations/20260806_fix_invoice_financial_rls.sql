-- Staging invoice/payment RLS reconciliation.
-- The production-parity baseline enables RLS for these tables but defines no
-- policies, which denies every authenticated CRM invoice workflow. These
-- policies use the additive RBAC helper introduced in 20260805.
--
-- owner: full access through the '*' permission
-- manager: invoice operational access (create/read/update, no delete)
-- employee, contractor, and customer: no direct financial administration

create policy "rbac read invoices" on public.invoices
  for select to authenticated using (public.has_permission('invoices', 'read'));
create policy "rbac create invoices" on public.invoices
  for insert to authenticated with check (public.has_permission('invoices', 'create'));
create policy "rbac update invoices" on public.invoices
  for update to authenticated using (public.has_permission('invoices', 'update')) with check (public.has_permission('invoices', 'update'));
create policy "rbac delete invoices" on public.invoices
  for delete to authenticated using (public.has_permission('invoices', 'delete'));

create policy "rbac read invoice items" on public.invoice_items
  for select to authenticated using (public.has_permission('invoices', 'read'));
create policy "rbac create invoice items" on public.invoice_items
  for insert to authenticated with check (public.has_permission('invoices', 'create'));
create policy "rbac update invoice items" on public.invoice_items
  for update to authenticated using (public.has_permission('invoices', 'update')) with check (public.has_permission('invoices', 'update'));
create policy "rbac delete invoice items" on public.invoice_items
  for delete to authenticated using (public.has_permission('invoices', 'delete'));

create policy "rbac read invoice payments" on public.invoice_payments
  for select to authenticated using (public.has_permission('invoices', 'read'));
create policy "rbac create invoice payments" on public.invoice_payments
  for insert to authenticated with check (public.has_permission('invoices', 'create'));
create policy "rbac update invoice payments" on public.invoice_payments
  for update to authenticated using (public.has_permission('invoices', 'update')) with check (public.has_permission('invoices', 'update'));
create policy "rbac delete invoice payments" on public.invoice_payments
  for delete to authenticated using (public.has_permission('invoices', 'delete'));

create policy "rbac read payments" on public.payments
  for select to authenticated using (public.has_permission('invoices', 'read'));
create policy "rbac create payments" on public.payments
  for insert to authenticated with check (public.has_permission('invoices', 'create'));
create policy "rbac update payments" on public.payments
  for update to authenticated using (public.has_permission('invoices', 'update')) with check (public.has_permission('invoices', 'update'));
create policy "rbac delete payments" on public.payments
  for delete to authenticated using (public.has_permission('invoices', 'delete'));
