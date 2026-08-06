# Service-role Supabase access inventory

`lib/supabase/admin.ts` is marked `server-only`; its service-role client bypasses RLS and must only be imported by server modules. This inventory is a code review, not proof of live deployment configuration.

| Surface | Why service role is used | Protection | Review outcome |
|---|---|---|---|
| `/api/contact` | Generate lead number, create lead/activity, private photo upload | Turnstile validation plus server-side field validation | Intended public ingress; rate limiting/WAF should be configured at deployment |
| `/api/leads/[id]`, `/convert` | Update/delete/convert leads and preserve activity history | `requireApiRole`; owner-only delete, owner/admin/manager conversion | Protected |
| `/api/payments`, `/api/payments/[id]`, `/receipt` | Record/refund/delete payments and generate receipts | `requireApiRole` with accounting/management roles | Protected |
| `/api/estimates/[id]/convert` | Controlled estimate-to-job conversion | `requireApiRole` | Protected |
| `/api/invoices/[id]/pdf`, `/email` | Render PDF, record document, email customer | **Now requires** owner/admin/manager/accounting | Fixed during this review; was unauthenticated |
| Public estimate/contract signing and estimate change request | Mutate a single document, signature audit, signed PDF storage | Document-specific signing token; request metadata and replay checks | Intentional public bearer-token flow; token lifecycle remains a risk |
| `/portal/[token]` helpers and document route | Securely assemble customer-specific data and short-lived storage URLs | Portal token is validated server-side; each record query is scoped by customer ID | Protected by application layer; service role bypass means this scope is critical |
| Automation engine/actions/reminder processor | Create system tasks/logs, query workflow state, send emails | Server-only; scheduler endpoint requires cron bearer secret; task/log RLS protects UI reads | Staging scheduler execution remains operationally blocked |
| Financial/report/dashboard/search helpers | Cross-table server aggregates and internal dashboard views | Must only be reached from role-protected admin pages/routes | Verify every caller retains a role guard during future changes |

## Required guard pattern

Routes that accept an authenticated internal user must call `requireApiRole` themselves; a page/layout guard is not sufficient for an API request. Public routes must use a document/portal bearer token or an anti-abuse control such as Turnstile, and must restrict all service-role queries to that scoped resource.

## Remaining review items

- Add rate limiting to the public contact and token-signing endpoints at Vercel/WAF level.
- Maintain regression tests for internal PDF/email routes returning `401/403` when unauthenticated.
- Avoid adding new `adminSupabase` imports to client components or shared browser modules.
