import JobsStatusChart from "./charts/JobsStatusChart";

interface JobsAnalyticsProps {
  totalJobs: number;
  completedJobs: number;
  scheduledJobs: number;
  inProgressJobs: number;
  cancelledJobs: number;
}

export default function JobsAnalytics({
  totalJobs,
  completedJobs,
  scheduledJobs,
  inProgressJobs,
  cancelledJobs,
}: JobsAnalyticsProps) {
  const completionRate =
    totalJobs > 0 ? (completedJobs / totalJobs) * 100 : 0;

  const cards = [
    {
      label: "Completed",
      value: completedJobs,
      color: "text-emerald-600",
    },
    {
      label: "Scheduled",
      value: scheduledJobs,
      color: "text-blue-600",
    },
    {
      label: "In Progress",
      value: inProgressJobs,
      color: "text-amber-600",
    },
    {
      label: "Cancelled",
      value: cancelledJobs,
      color: "text-red-600",
    },
  ];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            Jobs Analytics
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Track job completion and operational performance.
          </p>
        </div>

        <div className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
          {completionRate.toFixed(1)}% Complete
        </div>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-xl border border-slate-200 p-6"
          >
            <p className="text-sm text-slate-500">
              {card.label}
            </p>

            <h3 className={`mt-2 text-3xl font-bold ${card.color}`}>
              {card.value}
            </h3>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <JobsStatusChart
          completed={completedJobs}
          scheduled={scheduledJobs}
          inProgress={inProgressJobs}
          cancelled={cancelledJobs}
        />
      </div>
    </div>
  );
}