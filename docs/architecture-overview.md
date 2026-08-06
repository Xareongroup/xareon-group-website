# XAREON architecture overview

## Platform modules

- **Public website / lead capture**: the contact form validates Turnstile, uploads optional lead photos to private storage, creates a lead through a server-only Supabase client, records lead activity, and sends the existing Resend notification.
- **CRM**: leads convert to customers, which become the central record for estimates, jobs, contracts, invoices, payments, documents, and activity.
- **Documents and signatures**: estimates, contracts, invoices, receipts, and signed PDFs are recorded as customer documents. Public signature routes validate a document-specific signing token and write a signature audit record.
- **Operations**: jobs connect customers, estimates, invoices, scheduling, employee assignment, photos, skills, and availability.
- **Finance**: invoices and payments support revenue/balance reporting. Expenses, vendors, and categories supply profitability and financial reports through server-side aggregators.
- **Customer portal**: `/portal/[token]` is token-authenticated server-side; every document, estimate, contract, invoice, payment, job, and activity query is constrained to that validated customer.
- **Automation**: business events write automation logs and idempotent tasks. The protected reminder processor is external-scheduler ready but intentionally unscheduled.

## Core data flow

`Website lead → lead activities → customer → estimate → signed estimate → job → contract/signature → invoice → payment → customer documents/activity → reports/automation`.

Jobs also connect to employee availability and scheduling. Financial summaries read invoices, payments, expenses, and jobs server-side.

## Authentication and authorization

Admin sessions use Supabase Auth with server-side session clients. `user_roles` maps each identity to a platform role. Pages use `requireRole`; protected route handlers should independently use `requireApiRole`. Supabase RLS is the data-layer enforcement boundary.

Owner/admin have platform-level access; manager access is operational and policy-driven; employee/contractor access is assignment-scoped for jobs and task-scoped for automation; customers use portal tokens and are isolated to their own records.

## Trust boundaries

- Browser clients use only public Supabase/Turnstile/Stripe publishable values.
- `adminSupabase` is marked `server-only` and uses `SUPABASE_SERVICE_ROLE_KEY` for narrowly scoped server workflows.
- Resend, Stripe secret, Turnstile secret, service-role, and cron credentials must remain deployment secrets.
