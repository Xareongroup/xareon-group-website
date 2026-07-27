import PrintButton from "@/components/ui/PrintButton";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { adminSupabase } from "@/lib/supabase/admin";
import { formatCurrency } from "@/lib/utils/currency";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function InvoiceDetailsPage({
  params,
}: PageProps) {
  const { id } = await params;

  const supabase = adminSupabase;

  // Load Invoice
  const { data: invoice, error: invoiceError } = await supabase
    .from("invoices")
    .select("*")
    .eq("id", id)
    .single();

  if (invoiceError || !invoice) {
    notFound();
  }

  // Load Customer
  const { data: customer } = await supabase
    .from("customers")
    .select("*")
    .eq("id", invoice.customer_id)
    .single();

    // Load Job
const { data: job } = await supabase
  .from("jobs")
  .select(`
    *,
    estimate:estimates(
      estimate_number
    )
  `)
  .eq("id", invoice.job_id)
  .single();

  // Load Invoice Items
  const { data: items } = await supabase
    .from("invoice_items")
    .select("*")
    .eq("invoice_id", id)
    .order("sort_order");

  // Load Payments
  const { data: payments } = await supabase
  .from("payments")
  .select("*")
  .eq("invoice_id", id)
  .order("payment_date", { ascending: false });  

  const statusStyles: Record<string, string> = {
  Draft: "bg-slate-100 text-slate-700",
  Sent: "bg-blue-100 text-blue-700",
  Paid: "bg-emerald-100 text-emerald-700",
  Overdue: "bg-red-100 text-red-700",
  Cancelled: "bg-slate-200 text-slate-600",
};

  return (

    <div className="print-area mx-auto max-w-7xl px-6 py-8">

      {/* ====================================================== */}
      {/* Professional Invoice Header */}
      {/* ====================================================== */}

      <div className="mb-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

  <div className="print:hidden border-b border-slate-200 px-8 py-4">

    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

      <Link
        href="/admin/invoices"
        className="text-sm font-medium text-blue-600 hover:text-blue-700"
      >
        ← Back to Invoices
      </Link>

      <div className="flex flex-wrap gap-3">

  <Link
    href={`/admin/invoices/${invoice.id}/edit`}
    className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium transition hover:bg-slate-100"
  >
    Edit
  </Link>

  <Link
    href={`/admin/invoices/${invoice.id}/preview`}
    className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium transition hover:bg-slate-100"
  >
    Preview
  </Link>

  <Link
    href={`/admin/invoices/${invoice.id}/payments/new`}
    className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
  >
    Record Payment
  </Link>

  <PrintButton />

</div>

    </div>

  </div>

<div className="bg-gradient-to-r from-[#0B3D91] via-[#1656C1] to-[#2F7DFF] px-8 py-4">

  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

    <div>

      <p className="text-sm font-semibold uppercase tracking-[0.35em] text-blue-100">
        XAREON GROUP
      </p>

      <h2 className="mt-1 text-2xl font-bold text-white">
        Professional Home Repair & Installation Services
      </h2>

      <p className="mt-1 text-sm text-blue-100">
        SHIELD OF INTEGRITY
      </p>

    </div>

    <div className="text-sm text-right text-blue-100 space-y-1">

      <p>(202) 286-8497</p>

      <p>info@xareongroup.com</p>

      <p>www.xareongroup.com</p>

    </div>

  </div>

</div>

  <div className="bg-white px-8 py-10">

    <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">

      <div className="flex items-start gap-6">

  <div className="relative h-45 w-55 flex-shrink-0">

    <Image
  src="/logo/xareon1-logo.png"
  alt="XAREON Group Logo"
  fill
  sizes="200px"
  className="object-contain"
  priority
/>

  </div>

  <div>

    <p className="text-sm font-bold uppercase tracking-[0.30em] text-blue-600">
      XAREON GROUP
    </p>

    <p className="mt-1 text-sm font-medium uppercase tracking-[0.18em] text-slate-500">
      SHIELD OF INTEGRITY
    </p>

    <h1 className="mt-4 text-5xl font-black tracking-tight text-slate-900">
      INVOICE
    </h1>

    <p className="mt-3 text-xl font-semibold text-slate-600">
      {invoice.invoice_number}
    </p>

  </div>

</div>

      <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-7 shadow-sm lg:w-80">

  <div className="mb-6">

    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
      Invoice Status
    </p>

    <div className="mt-3">

      <span
        className={`inline-flex rounded-full px-4 py-2 text-sm font-semibold ${
          statusStyles[invoice.status] ??
          "bg-slate-100 text-slate-700"
        }`}
      >
        {invoice.status}
      </span>

    </div>

  </div>

  <div className="space-y-5">

    <div className="flex items-center justify-between">

      <span className="text-slate-500">
        Issue Date
      </span>

      <span className="font-semibold text-slate-900">
        {invoice.issue_date
          ? new Date(invoice.issue_date).toLocaleDateString()
          : "—"}
      </span>

    </div>

    <div className="flex items-center justify-between">

      <span className="text-slate-500">
        Due Date
      </span>

      <span className="font-semibold text-slate-900">
        {invoice.due_date
          ? new Date(invoice.due_date).toLocaleDateString()
          : "—"}
      </span>

    </div>

  </div>

  <div className="my-6 border-t border-slate-200"></div>

  <div>

    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
      Balance Due
    </p>

    <p className="mt-3 text-4xl font-black text-blue-600">
      {formatCurrency(invoice.balance_due ?? invoice.total ?? 0)}
    </p>

  </div>

</div>
    </div>

  </div>

</div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_380px]">

        <div className="space-y-6">

          {/* ====================================================== */}
{/* From / Bill To */}
{/* ====================================================== */}

<div className="grid gap-6 lg:grid-cols-2">

  {/* FROM */}

  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

    <h2 className="mb-5 text-lg font-semibold text-slate-900">
      From
    </h2>

    <div className="space-y-3">

      <div>
        <p className="text-xl font-bold text-slate-900">
          XAREON GROUP
        </p>

        <p className="text-sm uppercase tracking-[0.25em] text-blue-600">
          Shield of Integrity
        </p>
      </div>

      <div className="pt-4 space-y-2 text-sm text-slate-600">

        <p>📞 (202) 286-8497</p>

        <p>✉️ info@xareongroup.com</p>

        <p>🌐 www.xareongroup.com</p>

        <p>
          Professional Home Repair &
          Installation Services
        </p>

      </div>

    </div>

  </div>

  {/* BILL TO */}

  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

    <h2 className="mb-5 text-lg font-semibold text-slate-900">
      Bill To
    </h2>

    <div className="space-y-4">

      <div>

        <p className="text-xl font-semibold text-slate-900">

          {customer
            ? `${customer.first_name} ${customer.last_name}`
            : "Unknown Customer"}

        </p>

      </div>

      <div>

        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Address
        </p>

        <p className="mt-1 whitespace-pre-line">
          {customer?.address || "—"}
        </p>

      </div>

      <div>

        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Phone
        </p>

        <p className="mt-1">
          {customer?.phone || "—"}
        </p>

      </div>

      <div>

        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Email
        </p>

        <p className="mt-1">
          {customer?.email || "—"}
        </p>

      </div>

    </div>

  </div>

</div>
{/* ====================================================== */}
{/* Job Information */}
{/* ====================================================== */}

<div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

  <h2 className="mb-6 text-lg font-semibold text-slate-900">
    Job Information
  </h2>

  <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
        Job Number
      </p>

      <p className="mt-2 text-base font-medium text-slate-900">
        {job?.job_number ?? "—"}
      </p>
    </div>

    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
        Estimate
      </p>

      <p className="mt-2 text-base font-medium text-slate-900">
        {job?.estimate?.estimate_number ?? "—"}
      </p>
    </div>

    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
        Completed
      </p>

      <p className="mt-2 text-base font-medium text-slate-900">
        {job?.completed_date
          ? new Date(job.completed_date).toLocaleDateString()
          : "—"}
      </p>
    </div>

    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
        Status
      </p>

      <p className="mt-2">
        <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">
          {job?.status ?? "—"}
        </span>
      </p>
    </div>

  </div>

</div>
          {/* ====================================================== */}
{/* Invoice Information */}
{/* ====================================================== */}

<div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

  <h2 className="mb-6 text-lg font-semibold text-slate-900">
    Invoice Information
  </h2>

  <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

    <div>

      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
        Invoice Number
      </p>

      <p className="mt-2 text-base font-medium text-slate-900">
        {invoice.invoice_number}
      </p>

    </div>

    <div>

      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
        Issue Date
      </p>

      <p className="mt-2 text-base text-slate-900">
        {invoice.issue_date
          ? new Date(invoice.issue_date).toLocaleDateString()
          : "—"}
      </p>

    </div>

    <div>

      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
        Due Date
      </p>

      <p className="mt-2 text-base text-slate-900">
        {invoice.due_date
          ? new Date(invoice.due_date).toLocaleDateString()
          : "—"}
      </p>

    </div>

    <div>

      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
        Paid Date
      </p>

      <p className="mt-2 text-base text-slate-900">
        {invoice.paid_at
          ? new Date(invoice.paid_at).toLocaleDateString()
          : "—"}
      </p>

    </div>

  </div>

</div>

        
          {/* ====================================================== */}
          {/* Line Items */}
          {/* ====================================================== */}

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            <table className="min-w-full">

              <thead className="bg-slate-50 text-xs uppercase tracking-[0.18em] text-slate-500">

                <tr>

                  <th className="px-6 py-3 text-left">
                    Description
                  </th>

                  <th className="px-4 py-3 text-center whitespace-nowrap">
                    Qty
                  </th>

                  <th className="px-4 py-3 text-center whitespace-nowrap">
                    Unit
                  </th>

                  <th className="px-6 py-3 text-right whitespace-nowrap">
                    Unit Price
                  </th>

                  <th className="px-6 py-3 text-right whitespace-nowrap">
                    Discount
                  </th>

                  <th className="px-6 py-3 text-right whitespace-nowrap">
                    Total
                  </th>

                </tr>

              </thead>

              <tbody>

                {items && items.length > 0 ? (

                  items.map((item: any) => (

                    <tr
                      key={item.id}
                      className="border-t border-slate-100 transition-colors hover:bg-slate-50"
                    >

                      <td className="px-6 py-3 align-top">
                        {item.description}
                      </td>

                      <td className="px-4 py-3 text-center whitespace-nowrap">
                        {item.quantity}
                      </td>

                      <td className="px-4 py-3 text-center whitespace-nowrap">
                        {item.unit}
                      </td>

                      <td className="px-6 py-3 text-right whitespace-nowrap">
                        {formatCurrency(item.unit_price ?? 0)}
                      </td>

                      <td className="px-6 py-3 text-right whitespace-nowrap">
                        {formatCurrency(item.discount ?? 0)}
                      </td>

                      <td className="px-6 py-3 text-right font-semibold whitespace-nowrap">
                        {formatCurrency(item.total ?? 0)}
                      </td>

                    </tr>

                  ))

                ) : (

                  <tr>

                    <td
                      colSpan={6}
                      className="px-6 py-8 text-center text-slate-500"
                    >
                      No line items found.
                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>

        </div>

                {/* ====================================================== */}
        {/* Right Sidebar */}
        {/* ====================================================== */}

        <div className="space-y-6 xl:sticky xl:top-6 xl:self-start">

          {/* Payment Summary */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <h2 className="mb-6 text-xl font-bold text-slate-900">
              Payment Summary
            </h2>

            <div className="space-y-4">

              <div className="flex items-center justify-between">
                <span className="text-slate-600">
                  Subtotal
                </span>

                <span className="font-medium">
                  {formatCurrency(invoice.subtotal ?? 0)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-600">
                  Tax
                </span>

                <span className="font-medium">
                  {formatCurrency(invoice.tax ?? 0)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-600">
                  Total
                </span>

                <span className="font-medium">
                  {formatCurrency(invoice.total ?? 0)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-600">
                  Paid
                </span>

                <span className="font-medium text-emerald-600">
                  {formatCurrency(
                    (invoice.total ?? 0) -
                    (invoice.balance_due ?? invoice.total ?? 0)
                  )}
                </span>
              </div>

              <div className="border-t border-slate-200 pt-5">

                <div className="flex items-center justify-between">

                  <span className="text-lg font-bold text-slate-900">
                    Balance Due
                  </span>

                  <span className="text-3xl font-black text-blue-600">
                    {formatCurrency(invoice.balance_due ?? invoice.total ?? 0)}
                  </span>

                </div>

              </div>

            </div>

          </div>

          {/* Payment History */}

<div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

  <h2 className="mb-6 text-xl font-bold text-slate-900">
    Payment History
  </h2>

  {!payments || payments.length === 0 ? (

    <p className="text-slate-500">
      No payments recorded.
    </p>

  ) : (

    <div className="space-y-4">

      {payments.map((payment) => (

        <div
          key={payment.id}
          className="rounded-xl border border-slate-200 p-4"
        >

          <div className="flex items-center justify-between">

            <div>

              <p className="font-semibold">
                {payment.payment_method}
              </p>

              <p className="text-sm text-slate-500">
                {new Date(payment.payment_date).toLocaleDateString()}
              </p>

            </div>

            <div className="text-lg font-bold text-emerald-600">
              {formatCurrency(payment.amount)}
            </div>

          </div>

          {payment.reference_number && (

            <p className="mt-3 text-sm text-slate-500">
              Reference: {payment.reference_number}
            </p>

          )}

          {payment.notes && (

            <p className="mt-2 text-sm text-slate-600">
              {payment.notes}
            </p>

          )}

        </div>

      ))}

    </div>

  )}

</div>

          {/* Payment Terms */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <h2 className="mb-4 text-lg font-semibold text-slate-900">
              Payment Terms
            </h2>

            <div className="space-y-3 text-sm leading-6 text-slate-600">

              <p>
                Thank you for choosing <strong>XAREON GROUP</strong>.
              </p>

              <p>
                Payment is due on or before the invoice due date unless other
                arrangements have been made.
              </p>

              <p>
                Questions about this invoice?
                <br />
                <span className="font-medium">
                  info@xareongroup.com
                </span>
                <br />
                <span className="font-medium">
                  (202) 286-8497
                </span>
              </p>

              <div className="rounded-xl bg-blue-50 p-4">

                <p className="font-semibold text-blue-900">
                  XAREON Guarantee
                </p>

                <p className="mt-2 text-blue-800">
                  We stand behind the quality of our workmanship and strive to
                  deliver reliable, professional service on every project.
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}