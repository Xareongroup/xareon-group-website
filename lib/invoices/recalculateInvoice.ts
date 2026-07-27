import { adminSupabase } from "@/lib/supabase/admin";

export async function recalculateInvoice(invoiceId: string) {
  const supabase = adminSupabase;

  // Load invoice
  const { data: invoice, error: invoiceError } = await supabase
    .from("invoices")
    .select("id, total")
    .eq("id", invoiceId)
    .single();

  if (invoiceError || !invoice) {
    throw new Error("Invoice not found.");
  }

  // Load all payments
  const { data: payments, error: paymentsError } = await supabase
    .from("payments")
    .select("amount")
    .eq("invoice_id", invoiceId);

  if (paymentsError) {
    throw paymentsError;
  }

  const totalPaid = payments.reduce(
    (sum, payment) => sum + Number(payment.amount),
    0
  );

  const balanceDue = Math.max(
    Number(invoice.total) - totalPaid,
    0
  );

  let status = "Sent";

  if (balanceDue === 0) {
    status = "Paid";
  } else if (totalPaid > 0) {
    status = "Partially Paid";
  }

  const { error: updateError } = await supabase
    .from("invoices")
    .update({
      balance_due: balanceDue,
      status,
      paid_at:
        balanceDue === 0
          ? new Date().toISOString()
          : null,
    })
    .eq("id", invoiceId);

  if (updateError) {
    throw updateError;
  }

  return {
    totalPaid,
    balanceDue,
    status,
  };
}