-- Atomic, data-safe expense creation and numbering.
-- This migration does not alter existing expense records. It adds a private
-- yearly counter and allocates/inserts an expense in one database transaction.

create table if not exists public.expense_number_counters (
  expense_year integer primary key check (expense_year between 2000 and 9999),
  last_value integer not null default 0 check (last_value >= 0),
  updated_at timestamptz not null default now()
);

alter table public.expense_number_counters enable row level security;

create or replace function public.create_expense_with_number(
  p_date date,
  p_category_id uuid,
  p_vendor_id uuid,
  p_customer_id uuid,
  p_job_id uuid,
  p_employee_id uuid,
  p_description text,
  p_amount numeric,
  p_payment_method text,
  p_status text,
  p_notes text
)
returns table (id uuid, expense_number text)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_year integer;
  v_existing_max integer;
  v_next_value integer;
begin
  if p_date is null or p_description is null or btrim(p_description) = '' or p_amount is null or p_amount < 0 then
    raise exception 'Invalid expense payload.' using errcode = '22023';
  end if;

  v_year := extract(year from p_date)::integer;

  -- Serializes initialization and allocation for a single calendar year.
  perform pg_advisory_xact_lock(hashtext(format('public.expenses.%s', v_year)));

  -- Existing well-formed values seed the counter. Malformed values are ignored.
  select coalesce(max(right(e.expense_number, 5)::integer), 0)
    into v_existing_max
    from public.expenses e
   where e.expense_number ~ ('^EXP-' || v_year::text || '-[0-9]{5}$');

  insert into public.expense_number_counters (expense_year, last_value)
  values (v_year, v_existing_max)
  on conflict (expense_year) do update
    set last_value = greatest(public.expense_number_counters.last_value, excluded.last_value),
        updated_at = now();

  update public.expense_number_counters
     set last_value = last_value + 1,
         updated_at = now()
   where expense_year = v_year
  returning last_value into v_next_value;

  begin
    insert into public.expenses (
      expense_number, date, category_id, vendor_id, customer_id, job_id,
      employee_id, description, amount, payment_method, status, notes
    ) values (
      'EXP-' || v_year::text || '-' || lpad(v_next_value::text, 5, '0'),
      p_date, p_category_id, p_vendor_id, p_customer_id, p_job_id,
      p_employee_id, btrim(p_description), p_amount, p_payment_method, p_status, p_notes
    )
    returning expenses.id, expenses.expense_number into id, expense_number;
  exception when unique_violation then
    raise exception 'Unable to allocate a unique expense number. Please try again.' using errcode = '23505';
  end;

  return next;
end;
$$;

revoke all on function public.create_expense_with_number(date, uuid, uuid, uuid, uuid, uuid, text, numeric, text, text, text) from public, anon, authenticated;
grant execute on function public.create_expense_with_number(date, uuid, uuid, uuid, uuid, uuid, text, numeric, text, text, text) to service_role;
