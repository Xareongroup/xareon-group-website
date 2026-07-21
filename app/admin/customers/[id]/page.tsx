import Link from "next/link";
import { notFound } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import DeleteCustomerButton from "@/components/admin/DeleteCustomerButton";

export default async function CustomerDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();

  const { data: customer, error } = await supabase
    .from("customers")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !customer) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">

      {/* ====================================================== */}
      {/* Header */}
      {/* ====================================================== */}

      <div className="mb-8 flex flex-col gap-6 border-b border-slate-200 pb-6 md:flex-row md:items-start md:justify-between">

        <div>

          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
            {customer.first_name} {customer.last_name}
          </h1>

          <p className="mt-2 text-slate-500">
            Customer Details
          </p>

        </div>

        <div className="flex flex-wrap gap-3">

          <Link
            href={`/admin/customers/${customer.id}/edit`}
            className="rounded-xl border border-slate-300 px-5 py-3 font-medium transition hover:bg-slate-100"
          >
            Edit Customer
          </Link>

          <DeleteCustomerButton customerId={customer.id} />

        </div>

      </div>

      {/* ====================================================== */}
      {/* Content */}
      {/* ====================================================== */}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_380px]">

        {/* Left Column */}

        <div className="space-y-6">

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <h2 className="mb-6 text-lg font-semibold text-slate-900">
              Customer Information
            </h2>

            <div className="grid gap-6 md:grid-cols-2">

              <div>

                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  First Name
                </p>

                <p className="mt-2 font-medium text-slate-900">
                  {customer.first_name}
                </p>

              </div>

              <div>

                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Last Name
                </p>

                <p className="mt-2 font-medium text-slate-900">
                  {customer.last_name}
                </p>

              </div>

              <div>

                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Email
                </p>

                <p className="mt-2">
                  {customer.email || "—"}
                </p>

              </div>

              <div>

                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Phone
                </p>

                <p className="mt-2">
                  {customer.phone || "—"}
                </p>

              </div>

              <div className="md:col-span-2">

                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Address
                </p>

                <p className="mt-2 whitespace-pre-wrap">
                  {customer.address || "—"}
                </p>

              </div>

            </div>

          </div>

        </div>

        {/* Right Sidebar */}

        <div className="space-y-6 xl:sticky xl:top-6 xl:self-start">

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <h2 className="mb-5 text-lg font-semibold text-slate-900">
              Notes
            </h2>

            <div className="whitespace-pre-wrap text-slate-700">

              {customer.notes || "No notes available."}

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}