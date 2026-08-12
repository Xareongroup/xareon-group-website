"use client";

import Link from "next/link";
import { formatCurrency } from "@/lib/utils/currency";
import type { Tables } from "@/lib/supabase/database.types";
import DocumentPrintButton from "@/components/documents/DocumentPrintButton";

interface InvoicePreviewProps {
  invoice: Tables<"invoices">;
  customer: Tables<"customers"> | null;
  items: Tables<"invoice_items">[];
}

export default function InvoicePreview({
  invoice,
  customer,
  items,
}: InvoicePreviewProps) {
  return (
    <div className="min-h-screen bg-slate-100 p-6 print:bg-white print:p-0">

      <div className="document-print mx-auto max-w-[8.5in] rounded-2xl bg-white p-6 shadow-xl print:rounded-none print:p-0 print:shadow-none">

        {/* ====================================================== */}
        {/* Header */}
        {/* ====================================================== */}

        <div className="mb-6 flex items-start justify-between border-b border-slate-200 pb-6">

          <div className="flex items-start gap-8">

            <img src="/logo/xareon1-logo.png" alt="XAREON Group" className="h-36 w-36 object-contain" />

            <div>

            <h1 className="text-3xl font-extrabold tracking-wide text-blue-700">
              XAREON GROUP
            </h1>

            <p className="mt-1 text-sm font-semibold uppercase tracking-[0.35em] text-slate-500">
              Shield of Integrity
            </p>

            <p className="mt-5 text-sm text-slate-600">
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

            <p className="text-sm text-slate-600">www.xareongroup.com</p>

            </div>

          </div>

          <div className="min-w-[220px] rounded-xl border border-blue-200 bg-blue-50 p-3.5">

            <h2 className="text-right text-2xl font-extrabold tracking-[0.25em] text-blue-700">
              INVOICE
            </h2>

            <div className="mt-4 space-y-2 text-sm">

              <div className="flex justify-between">
                <span className="font-medium text-slate-500">
                  Number
                </span>

                <span>{invoice.invoice_number ?? "Pending"}</span>
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
                  {invoice.issue_date
                    ? new Date(invoice.issue_date).toLocaleDateString()
                    : "-"}
                </span>

              </div>

              <div className="flex justify-between">
                <span className="font-medium text-slate-500">
                  Due Date
                </span>

                <span>
                  {invoice.due_date
                    ? new Date(invoice.due_date).toLocaleDateString()
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

            <thead className="bg-blue-700 text-xs uppercase tracking-[0.18em] text-white">

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
                    {formatCurrency(item.unit_price ?? 0)}
                  </td>

                  <td className="px-6 py-3 text-right whitespace-nowrap">
                    {formatCurrency(item.discount ?? 0)}
                  </td>

                  <td className="px-6 py-3 text-right font-semibold whitespace-nowrap">
                    {formatCurrency(item.total ?? 0)}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

        {/* ====================================================== */}
        {/* Totals */}
        {/* ====================================================== */}

        <div className="print-keep-together mt-6 flex justify-end">

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
                  {formatCurrency(invoice.subtotal ?? 0)}
                </span>

              </div>

              <div className="flex items-center justify-between"><span className="text-slate-600">Discount</span><span className="font-medium">-{formatCurrency(items.reduce((sum, item) => sum + Number(item.discount ?? 0), 0))}</span></div>

              <div className="flex items-center justify-between"><span className="text-slate-600">Amount Paid</span><span className="font-medium">{formatCurrency(invoice.amount_paid ?? 0)}</span></div>

              <div className="flex items-center justify-between">

                <span className="text-slate-600">
                  Tax
                </span>

                <span className="font-medium">
                  {formatCurrency(invoice.tax ?? 0)}
                </span>

              </div>

              <div className="border-t border-slate-300 pt-4">

                <div className="flex items-center justify-between">

                  <span className="text-xl font-bold text-slate-900">
                    Total
                  </span>

                  <span className="text-2xl font-extrabold text-slate-900">
                    {formatCurrency(invoice.total ?? 0)}
                  </span>

                </div>

              </div>

              <div className="flex items-center justify-between border-t border-slate-300 pt-4 text-lg font-bold text-blue-700"><span>Balance Due</span><span>{formatCurrency(invoice.balance_due ?? 0)}</span></div>

            </div>

          </div>

        </div>

        {(invoice.payment_notes || invoice.payment_method) && <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200"><div className="bg-slate-100 px-5 py-3 font-bold">Notes & Payment Terms</div><div className="whitespace-pre-wrap p-4 text-sm text-slate-700">{invoice.payment_notes ?? "Payment method: " + (invoice.payment_method ?? "—")}</div></div>}

        {/* ====================================================== */}
        {/* Footer */}
        {/* ====================================================== */}

        <div className="print-keep-together mt-12 border-t border-slate-200 pt-6 text-center text-sm text-slate-500 print:block">

          <p>This document was prepared by <strong>XAREON GROUP</strong>.</p>
          <p className="mt-1">Shield of Integrity | www.xareongroup.com | info@xareongroup.com</p>

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

          <DocumentPrintButton label="Print Invoice" className="rounded-xl bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700" />

        </div>

      </div>

    </div>
  );
}
