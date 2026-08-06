-- Adds a production-compatible customer number generator without creating a
-- database sequence or modifying existing customer records.
-- Format: CUS-YYYY-#####. An advisory transaction lock prevents concurrent
-- callers from receiving the same number.

create or replace function public.generate_customer_number()
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  next_number integer;
begin
  perform pg_advisory_xact_lock(hashtext('public.customers.customer_number'));

  select coalesce(max(right(customer_number, 5)::integer), 0) + 1
    into next_number
    from public.customers
   where customer_number ~ ('^CUS-' || extract(year from current_date)::text || '-[0-9]{5}$');

  return 'CUS-' || extract(year from current_date)::text || '-' || lpad(next_number::text, 5, '0');
end;
$$;

grant execute on function public.generate_customer_number() to authenticated, service_role;
