# Database security posture

## Effective target posture from migration history

The early production-parity baseline includes broad authenticated policies. The intended effective posture is the **later corrective sequence**, not the baseline by itself:

- `20260805` adds role/permission primitives and financial RLS.
- `20260806` applies financial and invoice/payment policies.
- `20260807` removes known permissive CRM policies and creates RBAC policies for customers, estimates, contracts, documents, jobs, and photos.
- `20260808` narrows job-photo mutations.
- `20260813` replaces job/photo access with employee/contractor assignment-scoped reads and management-only writes.
- `20260816` limits automation logs to owner/admin/manager and tasks to managers or their assignee.

## Isolation controls

- **Customer portal**: all portal data utilities validate the portal token, resolve one customer, and filter estimates, contracts, invoices, payments, jobs, documents, and activities by that customer ID.
- **Employee/contractor jobs**: `can_access_assigned_job` matches `auth.uid()` through `user_roles.employee_id` to `jobs.assigned_employee_id`; job photo reads use the same predicate. Writes are management-only.
- **Financials**: expense, vendor, category, invoice, payment, and item access is permission-based and financial pages add server role guards.
- **Customer documents**: the `customer-documents` bucket is declared private. Portal document responses create short-lived signed URLs only after customer ownership lookup.

## Required live verification before launch

Repository migration history cannot prove the remote policy state. In the production candidate, compare `pg_policies`, table RLS flags, and `storage.objects` policies against migrations 20260805–20260816. Confirm no `TO authenticated USING (true)` policies remain on CRM, financial, or customer-document resources unless explicitly approved.

## Storage review

`customer-documents` is private by migration. Verify `lead-photos` and `expense-receipts` buckets/policies separately in the live project, including upload content/size limits and signed URL expiry. Existing legacy public URLs remain a documented migration risk and should not be silently converted during launch.
