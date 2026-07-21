import "./print.css";
import { notFound } from "next/navigation";
import Link from "next/link";

import PrintButton from "@/components/admin/estimates/PrintButton";
import DownloadPDFButton from "@/components/admin/estimates/DownloadPDFButton";

import { createClient } from "@/lib/supabase/server";
import { formatCurrency } from "@/lib/utils/currency";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EstimatePreviewPage({
  params,
}: PageProps) {
  const { id } = await params;

  const supabase = await createClient();

  const { data: estimate, error } = await supabase
    .from("estimates")
    .select(`
      *,
      customer:customers(
        first_name,
        last_name,
        email,
        phone,
        address
      )
    `)
    .eq("id", id)
    .single();

  if (error || !estimate) {
    notFound();
  }

  const { data: items } = await supabase
    .from("estimate_items")
    .select("*")
    .eq("estimate_id", id)
    .order("sort_order");

  return (
    <div className="mx-auto max-w-[8.5in] space-y-4 p-3">
      {/* Toolbar */}

      <div className="flex justify-between print:hidden">
        <Link
          href={`/admin/estimates/${id}`}
          className="rounded-lg border border-slate-300 px-5 py-2 font-medium transition hover:bg-slate-100"
        >
          ← Back
        </Link>

        <div className="flex gap-3">
          <PrintButton />

          <DownloadPDFButton estimate={estimate} />
        </div>
      </div>

      {/* Printable Document */}

      <div className="estimate-print relative overflow-hidden rounded-2xl bg-white p-6 shadow-xl">
        {/* Watermark */}

        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <img
            src="/logo/xareon1-logo.png"
            alt=""
            aria-hidden="true"
            className="w-[520px] object-contain opacity-[0.035]"
          />
        </div>

                {/* ====================================================== */}
        {/* Header */}
        {/* ====================================================== */}

        <div className="relative z-10 mb-5 flex items-start justify-between border-b-2 border-slate-200 pb-5">

          {/* Company */}

          <div className="flex items-start gap-8">

            <img
              src="/logo/xareon1-logo.png"
              alt="XAREON Group"
              className="h-36 w-36 object-contain"
            />

            <div>

              <h1 className="text-3xl font-extrabold tracking-wide text-blue-700">
                XAREON GROUP
              </h1>

              <p className="mt-1 text-sm font-semibold uppercase tracking-[0.35em] text-slate-500">
                Shield of Integrity
              </p>

              <div className="mt-5 space-y-0.5 text-sm leading-5 text-slate-600">

                <p>Professional Home Repair & Installation Services</p>

                <p>Serving the Greater DMV Metro Area</p>

                <p>(202) 286-8497</p>

                <p>info@xareongroup.com</p>

                <p>www.xareongroup.com</p>

              </div>

            </div>

          </div>

          {/* Estimate Details */}

          <div className="min-w-[220px] rounded-xl border border-blue-200 bg-blue-50 p-3.5">

            <h2 className="mb-3 text-right text-2xl font-extrabold tracking-[0.25em] text-blue-700">
              ESTIMATE
            </h2>

            <div className="space-y-1.5 text-sm">

              <div className="flex items-center justify-between">

                <span className="font-semibold text-slate-600">
                  Status
                </span>

                <span
                  className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider
                    ${
                      estimate.status?.toLowerCase() === "approved"
                        ? "bg-green-100 text-green-700"
                        : estimate.status?.toLowerCase() === "accepted"
                        ? "bg-emerald-100 text-emerald-700"
                        : estimate.status?.toLowerCase() === "pending"
                        ? "bg-amber-100 text-amber-700"
                        : estimate.status?.toLowerCase() === "rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-slate-100 text-slate-700"
                    }`}
                >
                  {estimate.status}
                </span>

              </div>

                            <div className="flex justify-between">

                <span className="font-semibold text-slate-600">
                  Issue Date
                </span>

                <span>
                  {estimate.issue_date
                    ? new Date(
                        estimate.issue_date
                      ).toLocaleDateString()
                    : "-"}
                </span>

              </div>

              <div className="flex justify-between">

                <span className="font-semibold text-slate-600">
                  Valid Until
                </span>

                <span>
                  {estimate.expiration_date
                    ? new Date(
                        estimate.expiration_date
                      ).toLocaleDateString()
                    : "-"}
                </span>

              </div>

            </div>

          </div>

        </div>

        {/* ====================================================== */}
        {/* Customer */}
        {/* ====================================================== */}

        <div className="relative z-10 mb-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">

          <h3 className="mb-4 text-lg font-bold text-slate-800">
            Prepared For
          </h3>

          <div className="grid gap-x-8 gap-y-3 md:grid-cols-2">

            <div>

              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Customer
              </p>

              <p className="mt-0.5 text-lg font-bold text-slate-900">
                {estimate.customer?.first_name}{" "}
                {estimate.customer?.last_name}
              </p>

            </div>

            <div>

              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Email
              </p>

              <p className="mt-0.5 text-sm text-slate-700">
                {estimate.customer?.email || "—"}
              </p>

            </div>

            <div>

              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Phone
              </p>

              <p className="mt-0.5 text-sm text-slate-700">
                {estimate.customer?.phone || "—"}
              </p>

            </div>

            <div>

              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Address
              </p>

              <p className="mt-0.5 text-sm text-slate-700">
                {estimate.customer?.address || "—"}
              </p>

            </div>

          </div>

        </div>

                {/* ====================================================== */}
        {/* Line Items */}
        {/* ====================================================== */}

        <table className="relative z-10 mb-6 w-full border-collapse overflow-hidden rounded-xl border border-slate-200">

          <thead>

            <tr className="bg-blue-700 text-white">

              <th className="px-4 py-2 text-left text-sm font-semibold">
                Description
              </th>

              <th className="px-3 py-2 text-center text-sm font-semibold">
                Qty
              </th>

              <th className="px-3 py-2 text-center text-sm font-semibold">
                Unit
              </th>

              <th className="px-4 py-2 text-right text-sm font-semibold">
                Unit Price
              </th>

              <th className="px-4 py-2 text-right text-sm font-semibold">
                Total
              </th>

            </tr>

          </thead>

          <tbody>

            {(items ?? []).length > 0 ? (

              (items ?? []).map((item: any) => (

                <tr
                  key={item.id}
                  className="border-b border-slate-200 even:bg-slate-50"
                >

                  <td className="px-4 py-2 align-top">
                    {item.description}
                  </td>

                  <td className="px-3 py-2 text-center whitespace-nowrap">
                    {item.quantity}
                  </td>

                  <td className="px-3 py-2 text-center whitespace-nowrap">
                    {item.unit}
                  </td>

                  <td className="px-4 py-2 text-right whitespace-nowrap">
                    {formatCurrency(item.unit_price)}
                  </td>

                  <td className="px-4 py-2 text-right font-bold text-blue-700 whitespace-nowrap">
                    {formatCurrency(item.total)}
                  </td>

                </tr>

              ))

            ) : (

              <tr>

                <td
                  colSpan={5}
                  className="px-4 py-4 text-center text-slate-500"
                >
                  No line items found.
                </td>

              </tr>

            )}

          </tbody>

        </table>
                        {/* ====================================================== */}
        {/* Totals */}
        {/* ====================================================== */}

        <div className="relative z-10 mb-6 flex justify-end">

          <div className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200">

            <div className="bg-blue-700 px-5 py-3">

              <h3 className="text-base font-bold text-white">
                Estimate Summary
              </h3>

            </div>

            <div className="space-y-3 bg-white p-4">

              <div className="flex justify-between text-slate-700">

                <span>Subtotal</span>

                <span className="font-medium">
                  {formatCurrency(estimate.subtotal ?? 0)}
                </span>

              </div>

              <div className="flex justify-between text-slate-700">

                <span>Tax</span>

                <span className="font-medium">
                  {formatCurrency(estimate.tax ?? 0)}
                </span>

              </div>

              <div className="flex justify-between text-slate-700">

                <span>Discount</span>

                <span className="font-medium">
                  -{formatCurrency(estimate.discount ?? 0)}
                </span>

              </div>

              <div className="border-t pt-3">

                <div className="flex items-center justify-between">

                  <span className="text-xl font-bold">
                    TOTAL
                  </span>

                  <span className="text-3xl font-extrabold text-blue-700">
                    {formatCurrency(estimate.total ?? 0)}
                  </span>

                </div>

              </div>

            </div>

          </div>

        </div>

        {/* ====================================================== */}
        {/* Notes */}
        {/* ====================================================== */}

        {estimate.notes && (

          <div className="mb-6 overflow-hidden rounded-2xl border border-slate-200">

            <div className="bg-slate-100 px-5 py-3">

              <h3 className="text-base font-bold">
                Notes
              </h3>

            </div>

            <div className="whitespace-pre-wrap p-4 leading-6 text-sm text-slate-700">

              {estimate.notes}

            </div>

          </div>

        )}

        {/* ====================================================== */}
        {/* Terms */}
        {/* ====================================================== */}

        {estimate.terms && (

          <div className="mb-6 overflow-hidden rounded-2xl border border-slate-200">

            <div className="bg-slate-100 px-5 py-3">

              <h3 className="text-base font-bold">
                Terms & Conditions
              </h3>

            </div>

            <div className="whitespace-pre-wrap p-4 leading-6 text-sm text-slate-700">

              {estimate.terms}

            </div>

          </div>

        )}

                {/* ====================================================== */}
        {/* Acceptance */}
        {/* ====================================================== */}

        <div className="mt-8">

          <h3 className="mb-6 text-lg font-bold text-slate-800">
            Acceptance
          </h3>

          <div className="grid grid-cols-2 gap-10">

            <div>

              <div className="mb-10 border-b-2 border-slate-400" />

              <p className="text-sm font-semibold text-slate-700">
                Customer Signature
              </p>

            </div>

            <div>

              <div className="mb-10 border-b-2 border-slate-400" />

              <p className="text-sm font-semibold text-slate-700">
                Date
              </p>

            </div>

          </div>

        </div>

        {/* ====================================================== */}
        {/* Footer */}
        {/* ====================================================== */}

        <div className="mt-8 border-t border-slate-200 pt-5 text-center">

          <h4 className="text-base font-bold text-blue-700">
            Thank You for Choosing XAREON GROUP
          </h4>

          <p className="mt-2 text-sm text-slate-600">
            We appreciate the opportunity to earn your business.
          </p>

          <p className="mt-1 text-sm text-slate-600">
            Professional Home Repair & Installation Services
          </p>

          <div className="mt-4 flex flex-wrap justify-center gap-3 text-xs text-slate-500">

            <span>(202) 286-8497</span>

            <span>•</span>

            <span>info@xareongroup.com</span>

            <span>•</span>

            <span>www.xareongroup.com</span>

          </div>

        </div>

      </div>

    </div>

  );
}