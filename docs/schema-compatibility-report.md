# Live Supabase schema compatibility report

Source: `lib/supabase/database.types.ts`, generated from the linked project on 2026-08-05.

| File area | Live table / column | Application mismatch | Recommended fix |
| --- | --- | --- | --- |
| Financials pages, `FinancialsClient`, `JobProfitabilityCard`, `getFinancialSummary` | No `expenses`, `expense_categories`, or `vendors` table | The UI queries tables that do not exist in production. | Defer the financial module behind a roadmap flag until its approved additive migration is deployed and types are regenerated. Do not add client-side fallbacks that silently invent data. |
| RBAC helpers | No `user_roles` or `role_permissions` table | The Phase 1 helpers cannot resolve a production role. | Keep the additive RBAC migration unapplied; use authenticated-session guards only until the RBAC schema is approved for staging. |
| Contract forms, previews, and signing pages | `contracts` has `terms`, `notes`, `signed`; it has no `title`, `scope_of_work`, `payment_terms`, `warranty`, or `signature_status` | The app reads/writes absent columns. | Store the contract body in `terms`, use `notes` for internal notes, and derive signing state from `signed` / `signed_at`. Remove title and section-specific writes. |
| Invoice pages and portal | `invoices.payment_notes`; no `invoices.notes` | Portal and detail queries request `notes`. | Select and render `payment_notes`; omit the UI section when it is empty. |
| Invoice payment presentation | `payments.reference_number`; `invoice_payments` is a separate legacy relation | Search and some views use `reference`; payment logic mixes the relations. | Use `payments` and `reference_number` for all mutations and reads; reserve `invoice_payments` only for legacy read-only reconciliation if required. |
| Customer domain types | `customers.zip_code`; no `customers.zip` | Local `Customer` model requires `zip`. | Rename the application property to `zip_code`, or map it at the UI boundary. |
| Estimate options/forms | `estimate_number` is a number and generated; `estimate_code` is nullable | Local options expect a string and try to write `estimate_number`. | Display `String(estimate_number)` and never insert/update it. |
| Jobs pages and scheduling | `job_number` and `title` are nullable; employee relation is `assigned_employee_id` | Local types require non-null values and use a `technician` relation alias. | Use display fallbacks, and select `assigned_employee:employees(...)` or map `assigned_employee_id`. |
| Customer documents and job photos | Several live nullable fields (`created_at`, `caption`, `signed_date`, `status`) | Local UI types model them as required. | Make UI types nullable and render fallbacks. |

## Migration status

`20260805_add_rbac_primitives.sql` remains an unapplied proposal. No migration should be applied until the application no longer assumes columns or tables absent from the current live schema, and staging validation passes.
