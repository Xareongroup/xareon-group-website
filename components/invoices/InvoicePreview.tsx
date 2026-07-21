"use client";

import Link from "next/link";
import { formatCurrency } from "@/lib/utils/currency";

interface InvoicePreviewProps {
  invoice: any;
  customer: any;
  items: any[];
}

export default function InvoicePreview({
  invoice,
  customer,
  items,
}: InvoicePreviewProps) {
  return (
    <div className="min-h-screen bg-slate-100 p-6 print:bg-white print:p-0">

      <div className="mx-auto max-w-5xl rounded-2xl bg-white p-8 shadow-xl print:rounded-none print:p-8 print:shadow-none">

        {/* ====================================================== */}
        {/* Header */}
        {/* ====================================================== */}

        <div className="mb-6 flex items-start justify-between border-b border-slate-200 pb-6">

          <div>

            <h1 className="text-4xl font-extrabold tracking-tight text-blue-700">
              XAREON GROUP
            </h1>

            <p className="mt-2 text-sm text-slate-600">
              Professional Home Repair & Installation Services
            </p>

            <p className="text-sm text-slate-600">
              Serving the Greater DMV Metro Area
            </p>

            <p className="mt-2 text-sm text-slate-600">
              info@xareongroup.com
            </p>

            <p className="text-sm text-slate-600">
              (202) 286-8497
            </p>

          </div>

          <div className="min-w-[230px] rounded-2xl border border-slate-200 bg-slate-50 p-5 text-right">

            <h2 className="text-4xl font-extrabold tracking-tight text-slate-900">
              INVOICE
            </h2>

            <div className="mt-4 space-y-2 text-sm">

              <div className="flex justify-between">
                <span className="font-medium text-slate-500">
                  Number
                </span>

                <span>{invoice.invoice_number}</span>
              </div>

              <div className="flex justify-between items-center">

                <span className="font-medium text-slate-500">
                  Status
                </span>

                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
                  {invoice.status}
                </span>

              </div>

              <div className="flex justify-between">
                <span className="font-medium text-slate-500">
                  Issue Date
                </span>

                <span>
                  {invoice.issued_at
                    ? new Date(invoice.issued_at).toLocaleDateString()
                    : "-"}
                </span>

              </div>

              <div className="flex justify-between">
                <span className="font-medium text-slate-500">
                  Paid Date
                </span>

                <span>
                  {invoice.paid_at
                    ? new Date(invoice.paid_at).toLocaleDateString()
                    : "-"}
                </span>

              </div>

            </div>

          </div>

        </div>

        {/* ====================================================== */}
        {/* Bill To */}
        {/* ====================================================== */}

        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6">

          <h3 className="mb-5 text-lg font-semibold text-slate-900">
            Bill To
          </h3>

          <div className="grid gap-x-10 gap-y-4 md:grid-cols-2">

            <div>

              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Customer
              </p>

              <p className="mt-1 text-lg font-semibold text-slate-900">
                {customer
                  ? `${customer.first_name} ${customer.last_name}`
                  : "Unknown Customer"}
              </p>

            </div>

            <div>

              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Email
              </p>

              <p className="mt-1 text-sm">
                {customer?.email || "—"}
              </p>

            </div>

            <div>

              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Phone
              </p>

              <p className="mt-1 text-sm">
                {customer?.phone || "—"}
              </p>

            </div>

            <div>

              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Address
              </p>

              <p className="mt-1 whitespace-pre-line text-sm">
                {customer?.address || "—"}
              </p>

            </div>

          </div>

        </div>

        {/* ====================================================== */}
        {/* Items */}
        {/* ====================================================== */}

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">

          <table className="min-w-full">

            <thead className="bg-slate-50 text-xs uppercase tracking-[0.18em] text-slate-500">

              <tr>

                <th className="px-6 py-3 text-left">
                  Description
                </th>

                <th className="px-4 py-3 text-center">
                  Qty
                </th>

                <th className="px-4 py-3 text-center">
                  Unit
                </th>

                <th className="px-6 py-3 text-right">
                  Unit Price
                </th>

                <th className="px-6 py-3 text-right">
                  Discount
                </th>

                <th className="px-6 py-3 text-right">
                  Total
                </th>

              </tr>

                        </thead>

            <tbody>

              {items.map((item) => (

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
                    {formatCurrency(item.unit_price)}
                  </td>

                  <td className="px-6 py-3 text-right whitespace-nowrap">
                    {formatCurrency(item.discount ?? 0)}
                  </td>

                  <td className="px-6 py-3 text-right font-semibold whitespace-nowrap">
                    {formatCurrency(item.total)}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

        {/* ====================================================== */}
        {/* Totals */}
        {/* ====================================================== */}

        <div className="mt-6 flex justify-end">

          <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-slate-50 p-6">

            <h3 className="mb-5 text-lg font-semibold text-slate-900">
              Invoice Summary
            </h3>

            <div className="space-y-3">

              <div className="flex items-center justify-between">

                <span className="text-slate-600">
                  Subtotal
                </span>

                <span className="font-medium">
                  {formatCurrency(invoice.subtotal)}
                </span>

              </div>

              <div className="flex items-center justify-between">

                <span className="text-slate-600">
                  Tax
                </span>

                <span className="font-medium">
                  {formatCurrency(invoice.tax)}
                </span>

              </div>

              <div className="border-t border-slate-300 pt-4">

                <div className="flex items-center justify-between">

                  <span className="text-xl font-bold text-slate-900">
                    Total
                  </span>

                  <span className="text-2xl font-extrabold text-slate-900">
                    {formatCurrency(invoice.total)}
                  </span>

                </div>

              </div>

            </div>

          </div>

        </div>

        {/* ====================================================== */}
        {/* Footer */}
        {/* ====================================================== */}

        <div className="mt-12 border-t border-slate-200 pt-6 text-center text-sm text-slate-500 print:block">

          <p>
            Thank you for choosing <strong>XAREON GROUP</strong>.
          </p>

          <p className="mt-1">
            We appreciate your business and look forward to serving you again.
          </p>

        </div>

        {/* ====================================================== */}
        {/* Action Buttons */}
        {/* ====================================================== */}

        <div className="mt-8 flex flex-wrap justify-end gap-3 print:hidden">

          <Link
            href={`/admin/invoices/${invoice.id}`}
            className="rounded-xl border border-slate-300 px-6 py-3 font-medium transition hover:bg-slate-100"
          >
            ← Back
          </Link>

          <button
            onClick={() => window.print()}
            className="rounded-xl bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700"
          >
            Print Invoice
          </button>

        </div>

      </div>

    </div>
  );
}