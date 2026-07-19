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
    <div className="mx-auto max-w-7xl">
      <h1 className="text-4xl font-bold text-slate-900">
        Dashboard
      </h1>

      <p className="mt-2 text-slate-600">
        Welcome back, {user?.email}
      </p>

      <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Customers" value={customers ?? 0} />
        <StatCard title="Estimates" value={estimates ?? 0} />
        <StatCard title="Jobs" value={jobs ?? 0} />
        <StatCard title="Invoices" value={invoices ?? 0} />
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
}: {
  title: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-md">
      <h2 className="text-lg font-semibold text-slate-700">{title}</h2>
      <p className="mt-3 text-4xl font-bold text-blue-600">{value}</p>
    </div>
  );
}