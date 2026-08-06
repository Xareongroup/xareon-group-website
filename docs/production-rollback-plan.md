# Production rollback plan

## Before deployment

1. Create and verify a managed Supabase database backup and storage recovery plan.
2. Record the current deployment version, migration list, environment variable names, and active RLS policies.
3. Keep the previous application deployment available for one-click platform rollback.

## Database migrations

Migrations are not automatically reversible. Use an explicit, reviewed compensating migration only after restoring a backup is determined unnecessary. Never drop/rename production tables as a rollback shortcut. For a failed migration, stop rollout, preserve logs, restore to a point before the migration if required, and reconcile application version with schema version.

## Application rollback

Redeploy the last known-good application artifact. Verify login, customer portal token access, lead submission, and invoice read access. Do not roll back application code across an incompatible migration without the database recovery decision.

## Secrets

Restore only from the secure deployment secret manager. Rotate service-role, Resend, Stripe, Turnstile, or scheduler secrets if accidental disclosure is suspected; regenerate affected portal tokens if a portal token leak is suspected.

## Incident procedure

1. Disable outbound automation scheduler and payment/webhook integrations.
2. Preserve application and database logs.
3. Restrict access to owners/admins.
4. Assess data integrity and customer impact.
5. Recover, validate in staging, then obtain explicit approval before re-enabling services.
