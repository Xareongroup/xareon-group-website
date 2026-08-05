import ConvertToJobButton from "@/components/admin/estimates/ConvertToJobButton";
import Link from "next/link";
import { notFound } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { formatCurrency } from "@/lib/utils/currency";
import CreateContractButton from "@/components/admin/contracts/CreateContractButton";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EstimateDetailsPage({
  params,
}: PageProps) {
  const { id } = await params;

  const supabase = await createClient();

  // Load Estimate
  const { data: estimate, error: estimateError } = await supabase
  .from("estimates")
  .select(`
    *,
    customer:customers(
      id,
      first_name,
      last_name,
      email,
      phone,
      address
    ),
    jobs(
      id
    )
  `)
    .eq("id", id)
    .single();

  if (estimateError || !estimate) {
    notFound();
  }

  // Load Line Items
  const { data: items } = await supabase
    .from("estimate_items")
    .select("*")
    .eq("estimate_id", id)
    .order("sort_order");

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">

      {/* ====================================================== */}
      {/* Page Header */}
      {/* ====================================================== */}

      <div className="mb-8 flex flex-col gap-6 border-b border-slate-200 pb-6 lg:flex-row lg:items-end lg:justify-between">

        <div>

          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
            Estimate {estimate.estimate_number ?? "Pending"}
          </h1>

          <p className="mt-2 text-base text-slate-500">
            View estimate details, customer information, and pricing summary.
          </p>

        </div>

        <div className="flex flex-wrap gap-3">

          <Link
            href="/admin/estimates"
            className="rounded-lg border border-slate-300 px-4 py-2 font-medium transition hover:bg-slate-100"
          >
            Back
          </Link>

          <Link
            href={`/admin/estimates/${estimate.id}/edit`}
            className="rounded-lg border border-slate-300 px-4 py-2 font-medium transition hover:bg-slate-100"
          >
            Edit
          </Link>

          <Link
            href={`/admin/estimates/${estimate.id}/preview`}
            className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700"
          >
            Preview
          </Link>

          <ConvertToJobButton
  estimateId={estimate.id}
/>

<CreateContractButton

  estimateId={estimate.id}

  signed={
    estimate.signature_status === "Signed"
  }

/>
      
        </div>

      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_380px]">

        <div className="space-y-6">

          {/* Customer */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <h2 className="mb-5 text-lg font-semibold text-slate-900">
              Customer
            </h2>

            <div className="space-y-3">

              <div>

                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Name
                </p>

                <p className="mt-1 text-base font-medium text-slate-900">
                  {estimate.customer
                    ? `${estimate.customer.first_name} ${estimate.customer.last_name}`
                    : "Unknown Customer"}
                </p>

              </div>

                            <div>

                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Email
                </p>

                <p className="mt-1 text-base text-slate-900">
                  {estimate.customer?.email || "—"}
                </p>

              </div>

              <div>

                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Phone
                </p>

                <p className="mt-1 text-base text-slate-900">
                  {estimate.customer?.phone || "—"}
                </p>

              </div>

              <div>

                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Address
                </p>

                <p className="mt-1 text-base text-slate-900 whitespace-pre-line">
                  {estimate.customer?.address || "—"}
                </p>

              </div>

            </div>

          </div>

          {/* ====================================================== */}
          {/* Estimate Information */}
          {/* ====================================================== */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <h2 className="mb-5 text-lg font-semibold text-slate-900">
              Estimate Information
            </h2>

            <div className="grid gap-5 md:grid-cols-3">

              <div>

                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Status
                </p>

                <p className="mt-1 inline-flex rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
                  {estimate.status}
                </p>

              </div>

              <div>

                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Issue Date
                </p>

                <p className="mt-1 text-base text-slate-900">
                  {estimate.issue_date
                    ? new Date(
                        estimate.issue_date
                      ).toLocaleDateString()
                    : "-"}
                </p>

              </div>

              <div>

                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Expiration
                </p>

                <p className="mt-1 text-base text-slate-900">
                  {estimate.expiration_date
                    ? new Date(
                        estimate.expiration_date
                      ).toLocaleDateString()
                    : "-"}
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

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <h2 className="mb-5 text-lg font-semibold text-slate-900">
              Totals
            </h2>

            <div className="space-y-3">

              <div className="flex items-center justify-between">

                <span className="text-slate-600">
                  Subtotal
                </span>

                <span className="font-medium">
                  {formatCurrency(estimate.subtotal ?? 0)}
                </span>

              </div>

                            <div className="flex items-center justify-between">

                <span className="text-slate-600">
                  Tax
                </span>

                <span className="font-medium">
                  {formatCurrency(estimate.tax ?? 0)}
                </span>

              </div>

              <div className="flex items-center justify-between">

                <span className="text-slate-600">
                  Discount
                </span>

                <span className="font-medium">
                  {formatCurrency(estimate.discount ?? 0)}
                </span>

              </div>

              <div className="border-t border-slate-200 pt-4">

                <div className="flex items-center justify-between">

                  <span className="text-lg font-semibold text-slate-900">
                    Total
                  </span>

                  <span className="text-2xl font-bold text-slate-900">
                    {formatCurrency(estimate.total ?? 0)}
                  </span>

                </div>

              </div>

            </div>

          </div>

          {/* ====================================================== */}
          {/* Notes */}
          {/* ====================================================== */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <h2 className="mb-4 text-lg font-semibold text-slate-900">
              Notes
            </h2>

            <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">
              {estimate.notes || "No notes provided."}
            </p>

          </div>

          {/* ====================================================== */}
          {/* Terms & Conditions */}
          {/* ====================================================== */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <h2 className="mb-4 text-lg font-semibold text-slate-900">
              Terms & Conditions
            </h2>

            <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">
              {estimate.terms || "No terms provided."}
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}