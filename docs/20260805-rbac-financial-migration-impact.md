# RBAC and financial foundation migration impact

## Scope

The prepared migrations create only new RBAC and financial tables, indexes,
functions, triggers, storage bucket metadata, and RLS policies. They do not
alter, delete, rename, or update records in `customers`, `estimates`, `jobs`,
`invoices`, `payments`, or `contracts`.

## New objects

- `public.user_roles` and `public.role_permissions`
- `public.expense_categories`, `public.vendors`, and `public.expenses`
- indexes supporting foreign keys, role lookups, reporting dates, and category
  lookups
- an `expense-receipts` private storage bucket
- timestamp triggers on mutable new tables
- RLS policies for the new tables and new bucket objects only

## Data impact

- Existing business tables are referenced only by nullable foreign keys with
  `ON DELETE SET NULL`; no existing row is changed by creating these references.
- Default expense categories are inserted only into the new table and are
  idempotent (`ON CONFLICT DO NOTHING`).
- No existing RLS policy is dropped, renamed, or replaced.

## Access rollout controls

1. Create RBAC roles and permissions first.
2. Seed and verify at least one owner role in staging.
3. Run the RBAC staging tests with an owner session.
4. Apply the financial access policies only as part of the same reviewed
   migration sequence. Their policy predicates grant access exclusively through
   `has_permission`; no broad authenticated-user financial policy is created.

## Production status

Prepared for review only. These migrations must not be applied to production
until staging verification and clean application validation are complete.
