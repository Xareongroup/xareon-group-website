import { adminSupabase } from "@/lib/supabase/admin";

export interface PaymentReport {
  totalPayments: number;
  totalCollected: number;
  averagePayment: number;
  invoicesPaid: number;
  outstandingInvoices: number;
  collectionRate: number;
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

export async function getPaymentReport(
  range: string = "30d"
): Promise<PaymentReport> {
  const supabase = adminSupabase;

  const startDate = getStartDate(range);

  let paymentsQuery = supabase
    .from("payments")
    .select("amount, created_at");

  let invoicesQuery = supabase
    .from("invoices")
    .select("status, total, balance_due, created_at");

  if (startDate) {
    paymentsQuery = paymentsQuery.gte("created_at", startDate);
    invoicesQuery = invoicesQuery.gte("created_at", startDate);
  }

  const [
    { data: payments, error: paymentsError },
    { data: invoices, error: invoicesError },
  ] = await Promise.all([
    paymentsQuery,
    invoicesQuery,
  ]);

  if (paymentsError) {
    throw paymentsError;
  }

  if (invoicesError) {
    throw invoicesError;
  }

  const paymentRows = payments ?? [];
  const invoiceRows = invoices ?? [];

  const totalPayments = paymentRows.length;

  const totalCollected = paymentRows.reduce(
    (sum, payment) => sum + Number(payment.amount ?? 0),
    0
  );

  const averagePayment =
    totalPayments === 0
      ? 0
      : totalCollected / totalPayments;

  const invoicesPaid = invoiceRows.filter(
    (invoice) => invoice.status === "Paid"
  ).length;

  const outstandingInvoices = invoiceRows.filter(
    (invoice) => Number(invoice.balance_due ?? 0) > 0
  ).length;

  const totalInvoiced = invoiceRows.reduce(
    (sum, invoice) => sum + Number(invoice.total ?? 0),
    0
  );

  const collectionRate =
    totalInvoiced === 0
      ? 0
      : (totalCollected / totalInvoiced) * 100;

  return {
    totalPayments,
    totalCollected,
    averagePayment,
    invoicesPaid,
    outstandingInvoices,
    collectionRate,
  };
}