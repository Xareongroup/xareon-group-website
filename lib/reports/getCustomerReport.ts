import { adminSupabase } from "@/lib/supabase/admin";
import { getReportStartDate } from "./dateRange";

export interface CustomerReport {
  totalCustomers: number;
  activeCustomers: number;
  inactiveCustomers: number;
  averageJobsPerCustomer: number;
}

export async function getCustomerReport(
  range: string = "30d"
): Promise<CustomerReport> {
  const supabase = adminSupabase;

  const startDate = getReportStartDate(range);

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
