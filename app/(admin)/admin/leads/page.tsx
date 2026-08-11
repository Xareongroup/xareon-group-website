import Link from "next/link";

import MobileRecordCard from "@/components/admin/MobileRecordCard";
import StatusBadge from "@/components/admin/StatusBadge";
import { createClient } from "@/lib/supabase/server";

const statuses = [
  "New",
  "Contacted",
  "Estimate Scheduled",
  "Estimate Sent",
  "Negotiating",
  "Converted",
  "Lost",
];

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const { status, q } = await searchParams;
  const supabase = await createClient();
  let query = supabase
    .from("leads")
    .select("id, lead_number, first_name, last_name, service_type, phone, source, status, created_at")
    .order("created_at", { ascending: false });

  if (status && statuses.includes(status)) {
    query = query.eq("status", status);
  }
  if (q) {
    query = query.or(
      `lead_number.ilike.%${q}%,first_name.ilike.%${q}%,last_name.ilike.%${q}%,email.ilike.%${q}%`
    );
  }

  const { data: leads, error } = await query;
  if (error) throw error;

  const allLeads = leads ?? [];
  const counts = Object.fromEntries(
    statuses.map((name) => [
      name,
      allLeads.filter((lead) => lead.status === name).length,
    ])
  );

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-6 py-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Leads</h1>
        <p className="mt-1 text-slate-600">
          Manage incoming service requests before they become customers.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
        {[
          ["Total Leads", allLeads.length],
          ["New Leads", counts.New],
          ["Contacted", counts.Contacted],
          ["Estimate Sent", counts["Estimate Sent"]],
          ["Converted", counts.Converted],
          ["Lost", counts.Lost],
        ].map(([label, value]) => (
          <div
            key={label as string}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <p className="text-sm text-slate-500">{label}</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
          </div>
        ))}
      </div>

      <form className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search lead, customer, email…"
          className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
        />
        <select
          name="status"
          defaultValue={status ?? ""}
          className="rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
        >
          <option value="">All statuses</option>
          {statuses.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
        <button className="min-h-11 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white">
          Filter
        </button>
      </form>

      <div className="space-y-3 md:hidden">
        {allLeads.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-10 text-center text-slate-500 shadow-sm">
            No leads found.
          </div>
        ) : (
          allLeads.map((lead) => (
            <MobileRecordCard
              key={lead.id}
              title={`${lead.first_name} ${lead.last_name}`}
              subtitle={lead.lead_number ?? "Lead"}
              badge={<StatusBadge status={lead.status} />}
              fields={[
                { label: "Service", value: lead.service_type ?? "Not specified" },
                { label: "Phone", value: lead.phone ?? "Not provided" },
                { label: "Source", value: lead.source ?? "Not specified" },
                {
                  label: "Created",
                  value: new Date(lead.created_at).toLocaleDateString(),
                },
              ]}
              actions={
                <Link
                  href={`/admin/leads/${lead.id}`}
                  className="inline-flex min-h-11 items-center justify-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition hover:bg-blue-700"
                >
                  View lead
                </Link>
              }
            />
          ))
        )}
      </div>

      <div className="hidden overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm md:block">
        <table className="min-w-full">
          <thead className="bg-slate-50 text-left text-sm text-slate-600">
            <tr>
              <th className="px-5 py-3">Lead #</th>
              <th className="px-5 py-3">Customer</th>
              <th className="px-5 py-3">Service</th>
              <th className="px-5 py-3">Phone</th>
              <th className="px-5 py-3">Source</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Created</th>
              <th className="px-5 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {allLeads.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-10 text-center text-slate-500">
                  No leads found.
                </td>
              </tr>
            ) : (
              allLeads.map((lead) => (
                <tr key={lead.id} className="border-t">
                  <td className="px-5 py-4 font-medium">{lead.lead_number}</td>
                  <td className="px-5 py-4">
                    {lead.first_name} {lead.last_name}
                  </td>
                  <td className="px-5 py-4">{lead.service_type ?? "—"}</td>
                  <td className="px-5 py-4">{lead.phone}</td>
                  <td className="px-5 py-4">{lead.source}</td>
                  <td className="px-5 py-4"><StatusBadge status={lead.status} /></td>
                  <td className="px-5 py-4">{new Date(lead.created_at).toLocaleDateString()}</td>
                  <td className="px-5 py-4">
                    <Link href={`/admin/leads/${lead.id}`} className="font-medium text-blue-600">
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
