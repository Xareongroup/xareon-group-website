interface CustomerAnalyticsProps {
  totalCustomers: number;
  activeCustomers: number;
  inactiveCustomers: number;
  averageJobsPerCustomer: number;
}

export default function CustomerAnalytics({
  totalCustomers,
  activeCustomers,
  inactiveCustomers,
  averageJobsPerCustomer,
}: CustomerAnalyticsProps) {
  const activeRate =
    totalCustomers > 0
      ? (activeCustomers / totalCustomers) * 100
      : 0;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            Customer Analytics
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Understand customer engagement and activity.
          </p>
        </div>

        <div className="rounded-full bg-indigo-100 px-4 py-2 text-sm font-semibold text-indigo-700">
          {activeRate.toFixed(1)}% Active
        </div>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-4">
        <div className="rounded-xl border border-slate-200 p-6">
          <p className="text-sm text-slate-500">
            Total Customers
          </p>

          <h3 className="mt-2 text-3xl font-bold text-slate-900">
            {totalCustomers}
          </h3>
        </div>

        <div className="rounded-xl border border-slate-200 p-6">
          <p className="text-sm text-slate-500">
            Active
          </p>

          <h3 className="mt-2 text-3xl font-bold text-emerald-600">
            {activeCustomers}
          </h3>
        </div>

        <div className="rounded-xl border border-slate-200 p-6">
          <p className="text-sm text-slate-500">
            Inactive
          </p>

          <h3 className="mt-2 text-3xl font-bold text-red-600">
            {inactiveCustomers}
          </h3>
        </div>

        <div className="rounded-xl border border-slate-200 p-6">
          <p className="text-sm text-slate-500">
            Avg. Jobs / Customer
          </p>

          <h3 className="mt-2 text-3xl font-bold text-blue-600">
            {averageJobsPerCustomer.toFixed(1)}
          </h3>
        </div>
      </div>

      <div className="mt-8 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
        <p className="text-slate-500">
          Customer growth trends and retention analytics will be added here.
        </p>
      </div>
    </div>
  );
}