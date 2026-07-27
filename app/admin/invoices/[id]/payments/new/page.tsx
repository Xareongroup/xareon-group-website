import Link from "next/link";
import { notFound } from "next/navigation";

import { adminSupabase } from "@/lib/supabase/admin";
import PaymentForm from "@/components/admin/payments/PaymentForm";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function NewInvoicePaymentPage({
  params,
}: PageProps) {
  const { id } = await params;

  const supabase = adminSupabase;

  const { data: invoice } = await supabase
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
    .eq("id", id)
    .single();

  if (!invoice) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">

      <div>

        <Link
          href={`/admin/invoices/${id}`}
          className="text-sm text-blue-600 hover:underline"
        >
          ← Back to Invoice
        </Link>

        <h1 className="mt-3 text-3xl font-bold">
          Record Payment
        </h1>

        <p className="mt-2 text-slate-600">
          Invoice {invoice.invoice_number}
        </p>

      </div>

      <PaymentForm invoice={invoice} />

    </div>
  );
}