import { adminSupabase } from "@/lib/supabase/admin";

export interface BusinessMetrics {
  totalRevenue: number;
  outstandingBalance: number;
  paidInvoices: number;
  unpaidInvoices: number;
  averageInvoice: number;
  invoiceCount: number;
}

export async function getBusinessMetrics(): Promise<BusinessMetrics> {
  const supabase = adminSupabase;

  const { data: invoices } = await supabase
    .from("invoices")
    .select("total,balance_due,status");

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