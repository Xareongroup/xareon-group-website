# Production deployment checklist

## Before deployment

- [ ] Production environment variables are configured and environment-specific.
- [ ] Vercel Preview and Production variables are scoped correctly; `NEXT_PUBLIC_SITE_URL` is the canonical HTTPS production host.
- [ ] No service-role, cron, email, Stripe, or Turnstile secrets are public or committed.
- [ ] Migration list matches the approved staging candidate; backup is verified.
- [ ] RLS policy inventory is reviewed, including assignment-scoped jobs and financial permissions.
- [ ] `customer-documents`, `lead-photos`, and `expense-receipts` storage buckets/policies are verified.
- [ ] Resend domain/sender and Turnstile hostnames are verified.
- [ ] Vercel runtime logs/alerts and Supabase database/storage logs are reachable by the release owner.
- [ ] Automation cron remains disabled unless separately approved; scheduler secret is absent or controlled.
- [ ] Owner/manager/employee/contractor/customer portal regression tests pass.

## After deployment

- [ ] Sign in as owner and confirm CRM navigation.
- [ ] Submit a non-production-safe test lead and confirm lead activity/email behavior.
- [ ] Create/view an estimate and verify portal review/signing.
- [ ] Create/sign a contract and verify signed document access.
- [ ] Create/view invoice, record a controlled payment, and verify balances.
- [ ] Verify customer portal data isolation and secure document download.
- [ ] Verify financial/reporting totals against known data.
- [ ] If approved, run an authenticated scheduler dry run, then one monitored execution.
- [ ] Review application logs, automation failures, and database errors.
