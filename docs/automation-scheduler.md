# Automation reminder scheduler (staging)

The reminder processor is deliberately **not scheduled by the application**. Configure an external scheduler only in staging after a release review.

## Required environment variables

- `AUTOMATION_CRON_SECRET`: a high-entropy secret available only to the staging deployment and its scheduler.
- Existing server-only credentials used by the automation service: `SUPABASE_SERVICE_ROLE_KEY` and `RESEND_API_KEY`.

Never expose any of these variables with a `NEXT_PUBLIC_` prefix, in browser code, logs, or a URL query parameter.

## Authenticated request

```
POST https://<staging-host>/api/internal/automation/process-reminders
Authorization: Bearer <AUTOMATION_CRON_SECRET>
```

The endpoint rejects a missing/incorrect token with `401`. If the server secret is missing it fails closed with `503`; it does not process reminders.

## Dry run

Before a controlled scheduler test, make the same authenticated request with `?dryRun=true`:

```
POST https://<staging-host>/api/internal/automation/process-reminders?dryRun=true
Authorization: Bearer <AUTOMATION_CRON_SECRET>
```

Dry runs perform read-only eligibility and duplicate checks. They never create tasks, write automation logs, send emails, or update records. The response includes `mode: "dry-run"`, planned estimate/appointment/invoice reminders, and `tasksCreated: 0`.

## Recommended cadence

Run once daily during a low-traffic period. The processor is idempotent for open estimate and invoice follow-up tasks, so a retried request does not create duplicate open tasks. Appointment reminders are prepared for the following day.

## Security requirements

- Use a scheduler that can set an HTTPS `Authorization` header.
- Restrict scheduler credentials to the staging environment.
- Use HTTPS and rotate the secret through deployment configuration.
- Monitor `/admin/automation` for failures; do not place secrets in automation-log details.
- Do not enable this request against production until its separately approved release gate.
