import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [
    { count: customers },
    { count: estimates },
    { count: jobs },
    { count: invoices },
  ] = await Promise.all([
    supabase.from("customers").select("*", { count: "exact", head: true }),
    supabase.from("estimates").select("*", { count: "exact", head: true }),
    supabase.from("jobs").select("*", { count: "exact", head: true }),
    supabase.from("invoices").select("*", { count: "exact", head: true }),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">

      {/* ====================================================== */}
      {/* Header */}
      {/* ====================================================== */}

      <div className="border-b border-slate-200 pb-6">

        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
          Dashboard
        </h1>

        <p className="mt-2 text-slate-600">
          Welcome back,
          <span className="ml-1 font-semibold text-slate-900">
            {user?.email}
          </span>
        </p>

      </div>

      {/* ====================================================== */}
      {/* Statistics */}
      {/* ====================================================== */}

      <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">

        <StatCard
          title="Customers"
          value={customers ?? 0}
          color="blue"
        />

        <StatCard
          title="Estimates"
          value={estimates ?? 0}
          color="emerald"
        />

        <StatCard
          title="Jobs"
          value={jobs ?? 0}
          color="amber"
        />

        <StatCard
          title="Invoices"
          value={invoices ?? 0}
          color="violet"
        />

      </div>

      {/* ====================================================== */}
      {/* Quick Actions */}
      {/* ====================================================== */}

      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <h2 className="text-xl font-semibold text-slate-900">
          Quick Actions
        </h2>

        <p className="mt-2 text-slate-500">
          Quickly create new records from one place.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">

          <a
            href="/admin/customers/new"
            className="rounded-xl bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700"
          >
            + Customer
          </a>

          <a
            href="/admin/estimates/new"
            className="rounded-xl bg-emerald-600 px-5 py-3 font-medium text-white transition hover:bg-emerald-700"
          >
            + Estimate
          </a>

          <a
            href="/admin/invoices/new"
            className="rounded-xl bg-violet-600 px-5 py-3 font-medium text-white transition hover:bg-violet-700"
          >
            + Invoice
          </a>

        </div>

      </div>

    </div>
  );
}

function StatCard({
  title,
  value,
  color,
}: {
  title: string;
  value: number;
  color: "blue" | "emerald" | "amber" | "violet";
}) {
  const colors = {
    blue: "text-blue-600 bg-blue-50",
    emerald: "text-emerald-600 bg-emerald-50",
    amber: "text-amber-600 bg-amber-50",
    violet: "text-violet-600 bg-violet-50",
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">

      <div
        className={`inline-flex rounded-xl px-3 py-2 text-sm font-semibold ${colors[color]}`}
      >
        {title}
      </div>

      <p className="mt-6 text-5xl font-extrabold tracking-tight text-slate-900">
        {value}
      </p>

    </div>
  );
}