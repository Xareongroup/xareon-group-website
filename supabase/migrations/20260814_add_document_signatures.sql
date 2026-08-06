-- STAGING-FIRST signature audit ledger.
-- Existing estimate/contract signature fields remain the workflow source of
-- truth. This additive table preserves immutable signing metadata for portal
-- and future document types without changing historical records.

create table if not exists public.document_signatures (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers(id) on delete cascade,
  document_type text not null check (document_type in ('estimate', 'contract', 'receipt')),
  document_id uuid not null,
  signer_name text not null,
  signature_data text not null,
  signed_at timestamptz not null default now(),
  ip_address text,
  user_agent text,
  created_at timestamptz not null default now(),
  unique (document_type, document_id)
);

create index if not exists document_signatures_customer_id_idx on public.document_signatures(customer_id);
create index if not exists document_signatures_document_idx on public.document_signatures(document_type, document_id);

alter table public.document_signatures enable row level security;

-- Portal signatures are written only by token-validated server routes using
-- the service role. Staff reads continue through their source documents.
