"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { createClient } from "@/lib/supabase/client";
import { formatCurrency } from "@/lib/utils/currency";

interface Estimate {
  id: string;
  estimate_number: string | null;
  status: string;
  issue_date: string | null;
  total: number | null;
  customer: {
    first_name: string;
    last_name: string;
  } | null;
}

function getStatusColor(status: string) {
  switch (status) {
    case "Draft":
      return "bg-slate-100 text-slate-700";

    case "Sent":
      return "bg-blue-100 text-blue-700";

    case "Viewed":
      return "bg-purple-100 text-purple-700";

    case "Approved":
      return "bg-green-100 text-green-700";

    case "Rejected":
      return "bg-red-100 text-red-700";

    case "Expired":
      return "bg-orange-100 text-orange-700";

    default:
      return "bg-slate-100 text-slate-700";
  }
}

export default function EstimatesPage() {
  const supabase = createClient();

  const [estimates, setEstimates] =
    useState<Estimate[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  async function loadEstimates() {
    setLoading(true);

    const { data, error } = await supabase
      .from("estimates")
      .select(`
        id,
        estimate_number,
        status,
        issue_date,
        total,
        customer:customers (
          first_name,
          last_name
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {

      console.error(error);
      setError(error.message);

    } else {

      const estimates: Estimate[] =
        (data ?? []).map((estimate: any) => ({
          ...estimate,
          customer: Array.isArray(estimate.customer)
            ? estimate.customer[0] ?? null
            : estimate.customer,
        }));

      setEstimates(estimates);

    }

    setLoading(false);
  }

  useEffect(() => {
    void loadEstimates();
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">

      {/* ====================================================== */}
      {/* Page Header */}
      {/* ====================================================== */}

      <div className="mb-8 flex flex-col gap-6 border-b border-slate-200 pb-6 lg:flex-row lg:items-end lg:justify-between">

        <div>

          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
            Estimates
          </h1>

          <p className="mt-2 text-base text-slate-500">
            Create, manage, and track customer estimates.
          </p>

        </div>

        <Link
          href="/admin/estimates/new"
          className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700"
        >
          + New Estimate
        </Link>

      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        {loading ? (

          <div className="p-12 text-center text-slate-500">
            Loading estimates...
          </div>

        ) : error ? (

          <div className="p-12 text-center text-red-600">
            {error}
          </div>

        ) : estimates.length === 0 ? (

          <div className="p-12 text-center">

            <div className="mb-4 text-5xl">
              📄
            </div>

            <h3 className="text-xl font-semibold">
              No Estimates Yet
            </h3>

            <p className="mt-2 text-slate-500">
              Create your first estimate to get started.
            </p>

            <Link
              href="/admin/estimates/new"
              className="mt-6 inline-flex rounded-lg bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700"
            >
              Create Estimate
            </Link>

          </div>

        ) : (

          <table className="min-w-full">

            <thead className="bg-slate-50 text-xs uppercase tracking-[0.18em] text-slate-500">

              <tr>

                <th className="px-6 py-3 text-left">
                  Estimate #
                </th>

                <th className="px-6 py-3 text-left">
                  Customer
                </th>

                <th className="px-6 py-3 text-left">
                  Status
                </th>

                <th className="px-6 py-3 text-left">
                  Date
                </th>

                <th className="px-6 py-3 text-right">
                  Total
                </th>

                <th className="px-6 py-3 text-center">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody>

              {estimates.map((estimate) => (

                <tr
                  key={estimate.id}
                  className="border-t border-slate-100 transition-colors hover:bg-slate-50"
                >

                  <td className="px-6 py-3 font-semibold text-slate-900">

                    {estimate.estimate_number ?? "Pending"}

                  </td>

                  <td className="px-6 py-3">

                    {estimate.customer
                      ? `${estimate.customer.first_name} ${estimate.customer.last_name}`
                      : "Unknown Customer"}

                  </td>

                  <td className="px-6 py-3">

                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${getStatusColor(
                        estimate.status
                      )}`}
                    >
                      {estimate.status}
                    </span>

                  </td>

                  <td className="px-6 py-3">

                    {estimate.issue_date
                      ? new Date(
                          estimate.issue_date
                        ).toLocaleDateString()
                      : "-"}

                  </td>

                  <td className="px-6 py-3 text-right font-semibold">

                    {formatCurrency(estimate.total ?? 0)}

                  </td>

                  <td className="px-6 py-3">

                    <div className="flex justify-center gap-2">

                      <Link
                        href={`/admin/estimates/${estimate.id}`}
                        className="rounded-md border border-slate-300 px-3 py-1.5 text-sm transition hover:bg-slate-100"
                      >
                        View
                      </Link>

                      <Link
                        href={`/admin/estimates/${estimate.id}/edit`}
                        className="rounded-md border border-slate-300 px-3 py-1.5 text-sm transition hover:bg-slate-100"
                      >
                        Edit
                      </Link>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        )}

      </div>

    </div>
  );
}