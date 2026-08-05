# Phase 2 staging Supabase rollout plan

## Target gate

Run this plan only against a distinct, user-confirmed staging project. The
currently linked project is `utqsyxldydpoaglnhfsl` (`xareon-business`) and must
not be treated as staging without explicit confirmation.

## Preconditions

1. Link the workspace to the staging project (`supabase link --project-ref <staging-ref>`).
2. Capture a staging-only schema/data backup and record row counts for
   `customers`, `estimates`, `jobs`, `invoices`, `payments`, and `contracts`.
3. Set an owner test user in staging after RBAC migration deployment.
4. Confirm `npm run typecheck`, `npm run build`, and `npm run test` are green.

## Deployment sequence

1. Review `20260804_create_financials.sql` and `20260805_add_rbac_primitives.sql`.
2. Apply both migrations to staging with `supabase db push --linked`.
3. Regenerate `lib/supabase/database.types.ts` from staging:

   ```powershell
   supabase gen types typescript --linked --schema public | Set-Content -Encoding utf8 lib\supabase\database.types.ts
   ```

4. Re-enable typed financial/RBAC modules and remove their temporary deferred
   type-check annotations only after regenerated staging types include the new
   tables.

## Verification

- Compare pre/post row counts and sampled records for the six existing CRM tables.
- Confirm all existing CRM pages and customer portal workflows load and mutate
  only their intended records.
- Verify RLS with anonymous, customer, employee, manager, admin, and owner
  sessions. Owner must be verified before any access-policy change.
- Verify financial permissions independently: read, create, update, delete, and
  `expense-receipts` storage access.
- Run expense creation/editing, vendor management, dashboard-calculation, and
  role-restriction staging tests.

## Production gate

Do not link to or push the production project until the migration review,
staging verification evidence, regenerated types, and the complete test suite
are approved.
