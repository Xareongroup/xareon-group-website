import Link from "next/link";

import { adminSupabase } from "@/lib/supabase/admin";
import { formatCurrency } from "@/lib/utils/currency";

export default async function PaymentsPage() {
  const supabase = adminSupabase;

  const { data: payments } = await supabase
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
    .order("payment_date", { ascending: false });

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">

      <div className="mb-8 flex items-center justify-between">

        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Payments
          </h1>

          <p className="mt-2 text-slate-600">
            View and manage all recorded payments.
          </p>
        </div>

      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        <table className="min-w-full">

          <thead className="bg-slate-50">

            <tr className="text-left text-sm font-semibold text-slate-600">

              <th className="px-6 py-4">Date</th>

              <th className="px-6 py-4">Invoice</th>

              <th className="px-6 py-4">Customer</th>

              <th className="px-6 py-4">Method</th>

              <th className="px-6 py-4 text-right">
                Amount
              </th>

              <th className="px-6 py-4 text-right">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {!payments || payments.length === 0 ? (

              <tr>

                <td
                  colSpan={6}
                  className="px-6 py-10 text-center text-slate-500"
                >
                  No payments found.
                </td>

              </tr>

            ) : (

              payments.map((payment: any) => (

                <tr
                  key={payment.id}
                  className="border-t hover:bg-slate-50"
                >

                  <td className="px-6 py-4">
                    {new Date(
                      payment.payment_date
                    ).toLocaleDateString()}
                  </td>

                  <td className="px-6 py-4 font-medium">

                    {payment.invoice?.invoice_number}

                  </td>

                  <td className="px-6 py-4">

                    {payment.invoice?.customer
                      ? `${payment.invoice.customer.first_name} ${payment.invoice.customer.last_name}`
                      : "Unknown"}

                  </td>

                  <td className="px-6 py-4">

                    {payment.payment_method}

                  </td>

                  <td className="px-6 py-4 text-right font-semibold text-emerald-600">

                    {formatCurrency(payment.amount)}

                  </td>

                  <td className="px-6 py-4 text-right">

                    <Link
                      href={`/admin/payments/${payment.id}`}
                      className="font-medium text-blue-600 hover:text-blue-700"
                    >
                      View
                    </Link>

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}