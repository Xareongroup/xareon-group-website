-- STAGING-FIRST Stripe payment foundation.
-- Additive only: existing payment records remain unchanged and continue to be
-- treated as completed/offline payments unless their provider fields are set.

alter table public.payments
  add column if not exists payment_provider text,
  add column if not exists provider_transaction_id text,
  add column if not exists provider_checkout_session_id text,
  add column if not exists provider_status text,
  add column if not exists refunded_amount numeric(12,2) not null default 0,
  add column if not exists refunded_at timestamptz,
  add column if not exists provider_metadata jsonb not null default '{}'::jsonb;

create unique index if not exists payments_provider_transaction_unique
  on public.payments(payment_provider, provider_transaction_id)
  where provider_transaction_id is not null;

create table if not exists public.payment_provider_events (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  provider_event_id text not null,
  event_type text not null,
  status text not null default 'Processing' check (status in ('Processing', 'Succeeded', 'Skipped', 'Failed')),
  payment_id uuid references public.payments(id) on delete set null,
  details jsonb not null default '{}'::jsonb,
  received_at timestamptz not null default now(),
  processed_at timestamptz,
  unique(provider, provider_event_id)
);

create index if not exists payment_provider_events_status_received_idx
  on public.payment_provider_events(status, received_at desc);

alter table public.payment_provider_events enable row level security;

create policy "rbac read payment provider events" on public.payment_provider_events
  for select to authenticated using (public.has_permission('financials', 'read'));

-- Provider events are written exclusively by the server-only webhook client.
