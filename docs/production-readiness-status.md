# Production readiness status

## Ready for controlled staging release

- Lead capture, CRM workflow, document/signature foundations, scheduling, employee dispatch, financial module, customer portal access layer, and automation task/log foundations.
- Generated Supabase database type file and migration history through `20260816`.
- Current local validation: TypeScript, Vitest, and Next build pass.
- Scheduler automated coverage verifies missing-secret failure, invalid authorization denial, authenticated dry-run dispatch, dry-run non-mutation, and duplicate reminder suppression.
- Service-role access inventory and database/portal token reviews are complete. Invoice PDF and invoice email endpoints now require explicit internal API roles.

## Needs configuration or verification before production

- Configure production-specific Supabase, Resend, Turnstile, and canonical site URL values.
- Compare the live production migration/RLS policy inventory to this approved migration sequence.
- Verify backup/restore procedure and private storage bucket policies.
- Set `AUTOMATION_CRON_SECRET` only when the scheduler is approved; first run staging dry-run and controlled execution.
- Complete the controlled Vercel Preview scheduler run. This workspace cannot obtain the Preview URL or secret without Vercel account access, so no remote dry run or database-writing execution has occurred.

## Phase 5 scheduler validation status

- **Dry run:** not executed remotely. The required Vercel Preview deployment URL and deployment-scoped `AUTOMATION_CRON_SECRET` are not available to this workspace.
- **Controlled execution:** not executed. It is correctly gated behind the same missing authenticated Preview access; no staging tasks, automation logs, emails, notifications, or other records were created by this validation attempt.
- **Idempotency:** automated coverage passes for dry-run non-mutation and open-task duplicate suppression. The second-run behavior still requires the controlled Preview execution after access is supplied.
- Complete authenticated end-to-end production-candidate tests with non-customer test records and a review of service-role routes.
- Validate live RLS and storage policy parity; repository history alone cannot establish effective remote policies.

## Future development, not a launch prerequisite

- Payment gateway activation/Stripe checkout workflow.
- Automated SMS and recurring automation delivery.
- Automated scheduler monitoring/alerting integration.
- Broader integration-test coverage for automation dry-run/execution behavior.

## Launch position

**Not ready for an unrestricted production launch** until configuration, live RLS parity, backup rehearsal, and controlled staging scheduler validation are complete.

## Recommended launch sequence

1. Confirm backups, production environment scope, Vercel observability, and the live migration/RLS/storage inventory.
2. Deploy the reviewed artifact and run owner/manager/employee/contractor plus portal isolation smoke tests.
3. Verify public lead capture, signing, internal invoice email/PDF authorization, and financial reports.
4. Keep production automation cron disabled; perform staging dry-run and controlled execution first.
5. Obtain release-owner approval before enabling any production scheduler or payment integration.
