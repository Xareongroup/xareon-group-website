# XAREON QA and automated testing

## Commands

- `npm run lint` — static linting.
- `npm run typecheck` — strict TypeScript check.
- `npm run test` — deterministic Vitest workflow/calculation tests.
- `npm run test:coverage` — Vitest coverage report.
- `npm run test:e2e` — Playwright browser checks.
- `npm run build` — production integration build.

## Test architecture

Unit tests cover calculation and transformation rules. Route and data-access tests must mock Supabase clients; use a dedicated Supabase project (never production) for integration tests. E2E uses a local app and a seeded admin storage state supplied through `E2E_AUTH_STATE`. Email, Stripe, and Resend must be mocked or pointed at test credentials.

## Workflow checklist

- Customer: create, edit, archive/restore, search, portal token and portal isolation.
- Estimate: customer selection, line items, totals, save, signing, conversion to job/invoice.
- Job: create, assignment, status, completion, history, invoice linkage.
- Invoice/payment: number, line items, totals, record payment, balance/status recalculation.
- Contracts/documents: create, send/sign, PDF, storage and customer visibility.
- Financials: categories/vendors, expense CRUD, receipt upload, job link, dashboard/report totals.
- Security: admin redirect, API invalid input rejection, portal cross-customer denial, RLS policies.
- UI: every sidebar/back/create/edit/delete/archive/download/email/copy-link control; required fields and error/success states on every form.

## Deployment checklist

1. Apply all `supabase/migrations` to a staging project and regenerate typed DB definitions.
2. Seed isolated test users/customers/data and configure `E2E_AUTH_STATE`.
3. Configure test storage, Stripe, Resend, and Supabase credentials; never use production keys.
4. Run lint, typecheck, test, E2E, and build successfully.
5. Manually verify receipt upload, PDFs, mail delivery, portal isolation, responsive layout, and financial totals.

## Known limitations

Playwright authenticated workflows intentionally require a seeded authenticated state; this repository does not contain test Supabase credentials or seed data. Browser binaries may need `npx playwright install` in CI. Live Supabase RLS and migration tests belong in a dedicated staging environment.
