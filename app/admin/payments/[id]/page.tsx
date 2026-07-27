import Link from "next/link";
import { notFound } from "next/navigation";

import { adminSupabase } from "@/lib/supabase/admin";
import { formatCurrency } from "@/lib/utils/currency";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PaymentDetailsPage({
  params,
}: PageProps) {
  const { id } = await params;

  const supabase = adminSupabase;

  const { data: payment, error } = await supabase
    .from("payments")
    .select(`
      *,
      invoice:invoices(
        id,
        invoice_number,
        customer:customers(
          first_name,
          last_name
        )
      )
    `)
    .eq("id", id)
    .single();

  if (error || !payment) {
    notFound();
  }

  const customer =
    Array.isArray(payment.invoice?.customer)
      ? payment.invoice.customer[0]
      : payment.invoice?.customer;

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">

      <div className="mb-8 flex items-center justify-between">

        <div>

          <h1 className="text-3xl font-bold">
            Payment Details
          </h1>

          <p className="mt-2 text-slate-600">
            Review payment information.
          </p>

        </div>

        <Link
          href="/admin/payments"
          className="rounded-lg border px-4 py-2 hover:bg-slate-50"
        >
          Back
        </Link>

      </div>

      <div className="rounded-2xl border bg-white p-8 shadow-sm">

        <div className="grid gap-6 md:grid-cols-2">

          <div>

            <p className="text-sm text-slate-500">
              Invoice
            </p>

            <p className="font-semibold">
              {payment.invoice?.invoice_number}
            </p>

          </div>

          <div>

            <p className="text-sm text-slate-500">
              Customer
            </p>

            <p className="font-semibold">
              {customer
                ? `${customer.first_name} ${customer.last_name}`
                : "Unknown"}
            </p>

          </div>

          <div>

            <p className="text-sm text-slate-500">
              Amount
            </p>

            <p className="text-xl font-bold text-emerald-600">
              {formatCurrency(payment.amount)}
            </p>

          </div>

          <div>

            <p className="text-sm text-slate-500">
              Method
            </p>

            <p className="font-semibold">
              {payment.payment_method}
            </p>

          </div>

          <div>

            <p className="text-sm text-slate-500">
              Payment Date
            </p>

            <p className="font-semibold">
              {new Date(
                payment.payment_date
              ).toLocaleDateString()}
            </p>

          </div>

          <div>

            <p className="text-sm text-slate-500">
              Reference
            </p>

            <p className="font-semibold">
              {payment.reference_number || "—"}
            </p>

          </div>

        </div>

        <div className="mt-8">

          <p className="text-sm text-slate-500">
            Notes
          </p>

          <div className="mt-2 rounded-xl bg-slate-50 p-4">
            {payment.notes || "No notes."}
          </div>

        </div>

        <div className="mt-10 flex justify-end gap-3">

          <Link
            href={`/admin/payments/${payment.id}/edit`}
            className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
          >
            Edit Payment
          </Link>

          <Link
            href={`/admin/invoices/${payment.invoice?.id}`}
            className="rounded-lg border px-5 py-3 hover:bg-slate-50"
          >
            View Invoice
          </Link>

        </div>

      </div>

    </div>
  );
}