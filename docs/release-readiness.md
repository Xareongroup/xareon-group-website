# XAREON CRM release readiness

## Scope and status

This document records the staging-validated CRM, Financials, and RBAC release state as of 2026-08-05. All rollout and validation work described here was performed against the staging Supabase project only. Production remains unchanged.

## Migration history

| Version | Migration | Purpose |
| --- | --- | --- |
| 20260800 | `production_parity_baseline` | Production-parity baseline for existing CRM tables, relationships, functions, triggers, indexes, RLS, and grants. |
| 20260804 | `create_financials` | Adds `expenses`, `expense_categories`, `vendors`, receipt storage, indexes, and financial foundations. |
| 20260805 | `add_rbac_primitives` | Adds `user_roles`, `role_permissions`, the `has_permission` helper, and financial-table RBAC policies. |
| 20260806 | `fix_invoice_financial_rls` | Adds role-scoped policies for `invoices`, `invoice_items`, `invoice_payments`, and `payments`. |

`20260801_initial_core_schema.sql` is intentionally not part of the staging execution sequence; the production-parity baseline supersedes it.

## Current validation

| Check | Result | Coverage |
| --- | --- | --- |
| `npm run typecheck` | Passing | Application and generated Supabase type compatibility. |
| `npm run build` | Passing | Next.js production build. |
| `npm run test` | Passing | Existing Vitest suite. |
| Authenticated Playwright staging smoke tests | Passing (2); portal UI check skipped | Owner CRM/invoice/payment/expense flow; manager invoice access; employee and contractor financial denials. |

The portal browser smoke test is intentionally environment-gated. Before production release, run it with `STAGING_APP_URL` pointing at an application deployment configured for staging Supabase.

## RBAC model

| Role | Intended access |
| --- | --- |
| Owner | Full CRM and financial administration, including destructive operations allowed by permissions. |
| Manager | Customer, job, invoice, and financial operational work: create, read, and update; no delete permission. |
| Employee | Job-focused access only; cannot administer financial records. |
| Contractor | Restricted assigned-job access; cannot administer financial records. |
| Customer | Portal-only access; no direct CRM or financial administration. |

Enforcement uses `user_roles`, `role_permissions`, and `public.has_permission(resource, action)`. Financial and invoice/payment policies grant access only where that helper authorizes it; they do not use broad authenticated access.

## Financial model

- **Expenses:** records a date, amount, payment method, status, description, notes, receipt URL, and optional customer, job, employee, vendor, and category relationships.
- **Vendors:** stores supplier/contractor identity and contact details for expense association.
- **Expense categories:** seeded system categories cover contractor payments, lead fees, insurance, vehicles, materials, tools, and miscellaneous costs.
- **Job profitability:** compares job-linked expense totals with invoice revenue to provide revenue, expenses, profit, outstanding balances, and margin calculations.

## Required production deployment checklist

1. Take and verify a restorable production database backup.
2. Review each pending migration line-by-line, confirming that it is additive and contains no destructive schema or data operation.
3. Confirm the production migration order and record the planned versions before execution.
4. Prepare and review a rollback plan for each migration. For policy migrations, retain the exact prior policy definitions so they can be restored; do not use destructive rollback actions without approval.
5. Verify production environment variables, including Supabase URL, publishable key, service-role key, site URL, email provider configuration, and any storage configuration.
6. Apply migrations only from the production-linked deployment environment after approval.
7. Immediately run post-deployment smoke tests:
   - customer and estimate creation;
   - estimate-to-job conversion;
   - invoice creation and payment recording;
   - owner and manager permitted operations;
   - employee and contractor financial denials;
   - customer portal access;
   - expense, vendor, category, and job-profitability calculations.
8. Monitor application errors, database logs, RLS denials, and dashboard totals before declaring the release complete.

## Release gate

Production deployment is ready for review, not automatic execution. The remaining validation prerequisite is a browser-level portal smoke test against a deployed staging application, followed by the approved production checklist above.
