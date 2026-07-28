import { adminSupabase } from "@/lib/supabase/admin";

export interface BusinessMetrics {
  totalRevenue: number;
  outstandingBalance: number;
  paidInvoices: number;
  unpaidInvoices: number;
  averageInvoice: number;
  invoiceCount: number;
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

export async function getBusinessMetrics(
  range: string = "30d"
): Promise<BusinessMetrics> {
  const supabase = adminSupabase;

  let query = supabase
    .from("invoices")
    .select("total,balance_due,status,created_at");

  const startDate = getStartDate(range);

  if (startDate) {
    query = query.gte("created_at", startDate);
  }

  const { data: invoices, error } = await query;

  if (error) {
    throw error;
  }

  const rows = invoices ?? [];

  const invoiceCount = rows.length;

  const totalRevenue = rows.reduce(
    (sum, invoice) => sum + Number(invoice.total ?? 0),
    0
  );

  const outstandingBalance = rows.reduce(
    (sum, invoice) => sum + Number(invoice.balance_due ?? 0),
    0
  );

  const paidInvoices = rows.filter(
    (invoice) => invoice.status === "Paid"
  ).length;

  const unpaidInvoices = rows.filter(
    (invoice) => invoice.status !== "Paid"
  ).length;

  const averageInvoice =
    invoiceCount === 0
      ? 0
      : totalRevenue / invoiceCount;

  return {
    totalRevenue,
    outstandingBalance,
    paidInvoices,
    unpaidInvoices,
    averageInvoice,
    invoiceCount,
  };
}