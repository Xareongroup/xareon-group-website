import { adminSupabase } from "@/lib/supabase/admin";
import { getReportStartDate } from "./dateRange";

export interface BusinessMetrics {
  totalRevenue: number;
  outstandingBalance: number;
  paidInvoices: number;
  unpaidInvoices: number;
  averageInvoice: number;
  invoiceCount: number;
}

export async function getBusinessMetrics(
  range: string = "30d"
): Promise<BusinessMetrics> {
  const supabase = adminSupabase;

  let query = supabase
    .from("invoices")
    .select("total,balance_due,status,created_at");

  const startDate = getReportStartDate(range);

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
