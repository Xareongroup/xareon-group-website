# Automation production readiness

## Components

- `automationEngine`: accepts server-side business event contexts; creates follow-up tasks and only sends email when explicit recipient data is supplied.
- `automationActions`: writes logs and uses an open-task lookup to prevent duplicate follow-up tasks.
- `processReminders`: processes pending estimates, next-day appointments, and due/overdue invoices. Its dry-run path is read-only.
- `/api/internal/automation/process-reminders`: requires `Authorization: Bearer <AUTOMATION_CRON_SECRET>` and fails closed when the secret is absent.

## Production requirements

1. Set `AUTOMATION_CRON_SECRET`, `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, and `NEXT_PUBLIC_SITE_URL` as deployment secrets/configuration.
2. Complete an authenticated staging dry run, then one controlled execution, and review Tasks plus Automation History.
3. Configure a trusted external scheduler for one daily request. Do not schedule the endpoint from browser code.
4. Monitor failed automation logs and alert on repeated failures.

## Safety characteristics

- Dry runs do not write tasks, logs, or documents and never email.
- Open task checks prevent repeated estimate, appointment, and invoice reminder tasks.
- Estimate/contract/invoice customer messages require both recipient email and a portal URL; otherwise the action is logged as skipped.
- Errors are logged server-side and returned as generic `500` responses to callers.

No production scheduler is enabled by this repository.
