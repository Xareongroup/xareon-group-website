import { notFound } from "next/navigation";

import { adminSupabase } from "@/lib/supabase/admin";
import PaymentForm from "@/components/admin/payments/PaymentForm";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditPaymentPage({
  params,
}: PageProps) {
  const { id } = await params;

  const supabase = adminSupabase;

  // Load the payment
  const { data: payment, error: paymentError } = await supabase
    .from("payments")
    .select("*")
    .eq("id", id)
    .single();

  if (paymentError || !payment) {
    notFound();
  }

  // Load the related invoice
  const { data: invoice, error: invoiceError } = await supabase
    .from("invoices")
    .select(`
      id,
      invoice_number,
      total,
      balance_due,
      customer:customers(
        first_name,
        last_name
      )
    `)
    .eq("id", payment.invoice_id)
    .single();

  if (invoiceError || !invoice) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">

      <div className="mb-8">

        <h1 className="text-3xl font-bold">
          Edit Payment
        </h1>

        <p className="mt-2 text-slate-600">
          Update the payment information below.
        </p>

      </div>

      <PaymentForm
        invoice={invoice}
        payment={payment}
        mode="edit"
      />

    </div>
  );
}