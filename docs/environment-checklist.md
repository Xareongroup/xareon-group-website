# Environment checklist

| Variable | Classification | Purpose | Required in |
|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Public | Supabase project URL used by browser and server clients | staging, production |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Public | Browser Supabase authentication/data client | staging, production |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only | Trusted server workflows, private storage, portal access, automation | staging, production |
| `RESEND_API_KEY` | Server-only | Customer/internal email delivery | staging, production if email is enabled |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Public | Quote-form Turnstile widget | staging, production |
| `TURNSTILE_SECRET_KEY` | Server-only | Turnstile verification in `/api/contact` | staging, production |
| `NEXT_PUBLIC_SITE_URL` | Public configuration | Canonical portal, signing, and email links | staging, production |
| `AUTOMATION_CRON_SECRET` | Server-only | Bearer token for reminder processor | staging before scheduler test; production only after approval |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Public | Future/customer payment UI integration | only when Stripe is enabled |
| `STRIPE_SECRET_KEY` | Server-only | Stripe server operations | only when Stripe is enabled |
| `NODE_ENV` | Runtime | Environment behavior | supplied by deployment runtime |

## Pre-release checks

- Confirm each public variable points to the intended environment; never reuse staging URLs or keys in production.
- Confirm server-only values are not prefixed `NEXT_PUBLIC_`, committed, logged, or supplied to client components.
- `AUTOMATION_CRON_SECRET` is currently a configuration blocker for a controlled staging scheduler run. Do not add it to production until scheduler approval.
- Configure Resend sender/domain verification and Turnstile hostnames separately for staging and production.
