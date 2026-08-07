# Stripe integration (staging foundation)

## Scope

The portal payment flow uses Stripe Checkout only after a server-side portal-token ownership check. Stripe confirms payment through a signed webhook; the webhook then writes the CRM payment record, recalculates the invoice, logs the customer activity, and triggers the existing payment-received automation.

`Portal invoice → server checkout session → Stripe-hosted Checkout → signed webhook → payments / provider event ledger → invoice recalculation / activity / automation`

## Required variables

| Variable | Classification | Staging requirement |
|---|---|---|
| `STRIPE_SECRET_KEY` | Server-only | Must be a Stripe test key beginning `sk_test_` |
| `STRIPE_WEBHOOK_SECRET` | Server-only | Stripe test webhook signing secret for `/api/stripe/webhook` |
| `STRIPE_PAYMENTS_ENABLED` | Server-only | Set exactly `true` only for controlled staging tests |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Public | Optional for future Stripe.js UI; Checkout redirect does not require it today |
| `NEXT_PUBLIC_SITE_URL` | Public configuration | Canonical staging URL used in portal/email links |

## Safety guard

The Stripe server client refuses to initialize unless all of the following are true:

- `STRIPE_PAYMENTS_ENABLED=true`
- the secret key begins with `sk_test_`
- `VERCEL_ENV` is not `production`

This repository therefore cannot create live payments. Do not set a live Stripe key or enable payments in the production environment.

## Staging setup

1. Add test-only Stripe variables to Vercel Preview/Staging.
2. Configure Stripe CLI or a test-mode webhook endpoint: `https://<preview>/api/stripe/webhook`.
3. Subscribe to `checkout.session.completed`, `payment_intent.payment_failed`, and `charge.refunded`.
4. Use a Stripe test card against a staging-only invoice and verify the payment, receipt/activity, invoice balance, provider event, and duplicate webhook handling.
5. Disable `STRIPE_PAYMENTS_ENABLED` after testing if payments should remain unavailable.

## Phase 6.1 validation status

**Foundation verification: complete.** The additive staging migration `20260817_add_stripe_payment_foundation.sql` is present both locally and on the linked staging database. Generated database types confirm the `payments` provider fields and the `payment_provider_events` ledger relationship.

The migration intentionally uses `payment_provider` (rather than a generic `provider`) and records refunds as `refunded_amount` / `refunded_at`; it does not include a `provider_refund_id`. That is the deployed schema contract and no schema change was made during this verification pass.

A read-only staging check found 11 existing payment records, zero Stripe-provider payment records, and zero provider-event records. No existing payment business data, provider event, or production record was changed. The unique `(provider, provider_event_id)` constraint and the partial unique Stripe transaction index provide the two idempotency gates for webhooks and CRM payment writes.

The repository validation suite confirms that the integration fails closed when payment enablement is absent, a live key is supplied, or `VERCEL_ENV=production`.

External Stripe staging validation remains operationally blocked in this local checkout: no local `.env.local` exists, no preview deployment URL is available here, and no test-mode Stripe credentials or staging portal invoice/token were supplied. Consequently, no Checkout Session, webhook, payment, refund, email, or provider-event row has been created by this validation pass.

Before marking Stripe staging validation complete, an authorized operator must perform the following against Preview/Staging only:

1. Confirm `STRIPE_PAYMENTS_ENABLED=true`, an `sk_test_` key, and a `whsec_` endpoint secret are configured in the Preview environment.
2. Use a staging customer portal token and an invoice with a positive balance to create a Checkout Session. Confirm the server-calculated remaining balance equals the Checkout amount.
3. Complete a test-card payment and forward or deliver `checkout.session.completed`; confirm exactly one `payments` row and one `payment_provider_events` ledger row, and that the invoice balance recalculates.
4. Replay the same provider event and confirm it returns as a duplicate with no additional payment, activity, task, email, or ledger row.
5. Send `payment_intent.payment_failed` and confirm a failed/ignored provider event creates no CRM payment. Issue a test refund and deliver `charge.refunded`; confirm refund metadata is stored and the invoice balance is recalculated.

## Webhook controls

The webhook requires Stripe signature verification over the raw request body. `payment_provider_events` records provider event IDs uniquely; completed/skipped duplicate events return successfully without creating another payment. Refund events update provider refund fields before recalculating the invoice.

## Production prerequisites

Separate product/legal/security approval is required before any production activation: live key review, webhook endpoint verification, reconciliation/chargeback process, tax/refund policy, support runbook, monitoring, and payment-specific RLS regression tests.
