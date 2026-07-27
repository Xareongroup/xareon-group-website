import { adminSupabase } from "@/lib/supabase/admin";

export interface RevenueDataPoint {
  month: string;
  revenue: number;
}

export interface DashboardStats {
  totalRevenue: number;
  outstandingBalance: number;
  paidThisMonth: number;
  monthlyRevenue: number;
  monthlyInvoices: number;
  customerCount: number;
  activeJobs: number;
  pendingEstimates: number;
  revenueData: RevenueDataPoint[];
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = adminSupabase;

  const [
    invoicesResult,
    customersResult,
    jobsResult,
    estimatesResult,
  ] = await Promise.all([
    supabase
      .from("invoices")
      .select("total,balance_due,status,paid_at,created_at"),

    supabase
      .from("customers")
      .select("id", { count: "exact" }),

    supabase
      .from("jobs")
      .select("id,status"),

    supabase
      .from("estimates")
      .select("id,status"),
  ]);

  const invoices = invoicesResult.data ?? [];

  const totalRevenue = invoices.reduce(
    (sum, invoice) => sum + Number(invoice.total ?? 0),
    0
  );

  const outstandingBalance = invoices.reduce(
    (sum, invoice) => sum + Number(invoice.balance_due ?? 0),
    0
  );

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const paidThisMonth = invoices
    .filter(
      (invoice) =>
        invoice.status === "Paid" &&
        invoice.paid_at &&
        new Date(invoice.paid_at) >= startOfMonth
    )
    .reduce(
      (sum, invoice) => sum + Number(invoice.total ?? 0),
      0
    );

  const monthlyRevenue = invoices
    .filter(
      (invoice) =>
        invoice.created_at &&
        new Date(invoice.created_at) >= startOfMonth
    )
    .reduce(
      (sum, invoice) => sum + Number(invoice.total ?? 0),
      0
    );

  const monthlyInvoices = invoices.filter(
    (invoice) =>
      invoice.created_at &&
      new Date(invoice.created_at) >= startOfMonth
  ).length;

  const customerCount = customersResult.count ?? 0;

  const activeJobs = (jobsResult.data ?? []).filter(
    (job) =>
      job.status !== "Completed" &&
      job.status !== "Cancelled"
  ).length;

  const pendingEstimates = (estimatesResult.data ?? []).filter(
    (estimate) => estimate.status === "Pending"
  ).length;

  // Build monthly revenue data for the chart
  const revenueByMonth = new Map<string, number>();

  invoices.forEach((invoice) => {
    if (!invoice.created_at) return;

    const date = new Date(invoice.created_at);

    const month = date.toLocaleString("en-US", {
      month: "short",
    });

    revenueByMonth.set(
      month,
      (revenueByMonth.get(month) ?? 0) +
        Number(invoice.total ?? 0)
    );
  });

  const revenueData: RevenueDataPoint[] = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ].map((month) => ({
    month,
    revenue: revenueByMonth.get(month) ?? 0,
  }));

  return {
    totalRevenue,
    outstandingBalance,
    paidThisMonth,
    monthlyRevenue,
    monthlyInvoices,
    customerCount,
    activeJobs,
    pendingEstimates,
    revenueData,
  };
}