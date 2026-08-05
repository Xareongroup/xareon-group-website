import { adminSupabase } from "@/lib/supabase/admin";
import { getReportStartDate } from "./dateRange";

export interface InvoiceReport {
  totalInvoices: number;
  draftInvoices: number;
  sentInvoices: number;
  viewedInvoices: number;
  paidInvoices: number;
  partiallyPaidInvoices: number;
  overdueInvoices: number;
  cancelledInvoices: number;
  totalInvoiced: number;
  outstandingBalance: number;
  averageInvoiceValue: number;
  collectionRate: number;
}

export async function getInvoiceReport(
  range: string = "30d"
): Promise<InvoiceReport> {
  const supabase = adminSupabase;

  let query = supabase
    .from("invoices")
    .select("status, total, balance_due, created_at");

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

  const draftInvoices = rows.filter(
    (invoice) => invoice.status === "Draft"
  ).length;

  const sentInvoices = rows.filter(
    (invoice) => invoice.status === "Sent"
  ).length;

  const viewedInvoices = rows.filter(
    (invoice) => invoice.status === "Viewed"
  ).length;

  const paidInvoices = rows.filter(
    (invoice) => invoice.status === "Paid"
  ).length;

  const partiallyPaidInvoices = rows.filter(
    (invoice) => invoice.status === "Partially Paid"
  ).length;

  const overdueInvoices = rows.filter(
    (invoice) => invoice.status === "Overdue"
  ).length;

  const cancelledInvoices = rows.filter(
    (invoice) => invoice.status === "Cancelled"
  ).length;

  const totalInvoiced = rows.reduce(
    (sum, invoice) => sum + Number(invoice.total ?? 0),
    0
  );

  const outstandingBalance = rows.reduce(
    (sum, invoice) => sum + Number(invoice.balance_due ?? 0),
    0
  );

  const averageInvoiceValue =
    totalInvoices === 0
      ? 0
      : totalInvoiced / totalInvoices;

  const collectionRate =
    totalInvoiced === 0
      ? 0
      : ((totalInvoiced - outstandingBalance) / totalInvoiced) * 100;

  return {
    totalInvoices,
    draftInvoices,
    sentInvoices,
    viewedInvoices,
    paidInvoices,
    partiallyPaidInvoices,
    overdueInvoices,
    cancelledInvoices,
    totalInvoiced,
    outstandingBalance,
    averageInvoiceValue,
    collectionRate,
  };
}
