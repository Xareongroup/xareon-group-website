import { adminSupabase } from "@/lib/supabase/admin";

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

export async function getRevenueReport(
  range: string = "30d"
): Promise<RevenueReport> {
  const supabase = adminSupabase;

  let query = supabase
    .from("invoices")
    .select("total, created_at");

  const startDate = getStartDate(range);

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