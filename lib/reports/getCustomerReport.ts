import { adminSupabase } from "@/lib/supabase/admin";

export interface CustomerReport {
  totalCustomers: number;
  activeCustomers: number;
  inactiveCustomers: number;
  averageJobsPerCustomer: number;
}

function getStartDate(range: string): string | null {
  const now = new Date();

  switch (range) {
    case "today":
      now.setHours(0, 0, 0, 0);
      return now.toISOString();

    case "30d":
      now.setDate(now.getDate() - 30);
      return now.toISOString();

    case "90d":
      now.setDate(now.getDate() - 90);
      return now.toISOString();

    case "year":
      return new Date(now.getFullYear(), 0, 1).toISOString();

    default:
      return null;
  }
}

export async function getCustomerReport(
  range: string = "30d"
): Promise<CustomerReport> {
  const supabase = adminSupabase;

  const startDate = getStartDate(range);

  let customersQuery = supabase
    .from("customers")
    .select("id, created_at");

  let jobsQuery = supabase
    .from("jobs")
    .select("customer_id, created_at");

  if (startDate) {
    customersQuery = customersQuery.gte("created_at", startDate);
    jobsQuery = jobsQuery.gte("created_at", startDate);
  }

  const [
    { data: customers, error: customerError },
    { data: jobs, error: jobsError },
  ] = await Promise.all([
    customersQuery,
    jobsQuery,
  ]);

  if (customerError) {
    throw customerError;
  }

  if (jobsError) {
    throw jobsError;
  }

  const customerRows = customers ?? [];
  const jobRows = jobs ?? [];

  const totalCustomers = customerRows.length;

  const activeCustomerIds = new Set(
    jobRows
      .map((job) => job.customer_id)
      .filter(Boolean)
  );

  const activeCustomers = activeCustomerIds.size;

  const inactiveCustomers =
    totalCustomers - activeCustomers;

  const averageJobsPerCustomer =
    totalCustomers === 0
      ? 0
      : jobRows.length / totalCustomers;

  return {
    totalCustomers,
    activeCustomers,
    inactiveCustomers,
    averageJobsPerCustomer,
  };
}