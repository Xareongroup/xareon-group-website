import { adminSupabase } from "@/lib/supabase/admin";
import { getReportStartDate } from "./dateRange";

export interface MonthlyRevenue {
  month: string;
  revenue: number;
}

export interface RevenueReport {
  totalRevenue: number;
  totalInvoices: number;
  averageInvoice: number;
  monthlyRevenue: MonthlyRevenue[];
}

export async function getRevenueReport(
  range: string = "30d"
): Promise<RevenueReport> {
  const supabase = adminSupabase;

  let query = supabase
    .from("invoices")
    .select("total, created_at");

  const startDate = getReportStartDate(range);

  if (startDate) {
    query = query.gte("created_at", startDate);
  }

  const { data: invoices, error } = await query;

  if (error) {
    throw error;
  }

  const rows = invoices ?? [];

  const totalInvoices = rows.length;

  const totalRevenue = rows.reduce(
    (sum, invoice) => sum + Number(invoice.total ?? 0),
    0
  );

  const averageInvoice =
    totalInvoices === 0
      ? 0
      : totalRevenue / totalInvoices;

  const monthMap = new Map<string, number>();

  rows.forEach((invoice) => {
    if (!invoice.created_at) return;
    const date = new Date(invoice.created_at);

    const month = date.toLocaleString("en-US", {
      month: "short",
    });

    monthMap.set(
      month,
      (monthMap.get(month) ?? 0) +
        Number(invoice.total ?? 0)
    );
  });

  const monthlyRevenue: MonthlyRevenue[] =
    Array.from(monthMap.entries()).map(
      ([month, revenue]) => ({
        month,
        revenue,
      })
    );

  return {
    totalRevenue,
    totalInvoices,
    averageInvoice,
    monthlyRevenue,
  };
}
