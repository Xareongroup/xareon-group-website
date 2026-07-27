import Link from "next/link";
import { CalendarDays, ChevronRight } from "lucide-react";

import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

interface Job {
  id: string;
  job_number: string | null;
  title: string | null;
  status: string;
  priority: string | null;
  technician: string | null;
  scheduled_date: string | null;

  customers: {
    id: string;
    first_name: string;
    last_name: string;
  } | null;
}

interface JobsTodayProps {
  jobs: Job[];
}

export default function JobsToday({
  jobs,
}: JobsTodayProps) {
  const today = new Date().toISOString().split("T")[0];

  const todaysJobs = jobs.filter((job) => {
    if (!job.scheduled_date) return false;

    return job.scheduled_date.startsWith(today);
  });

  return (
    <Card
      title="Today's Jobs"
      description="Scheduled work for today"
    >
      {todaysJobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <CalendarDays className="mb-4 h-10 w-10 text-slate-300" />

          <p className="font-medium text-slate-700">
            No jobs scheduled today
          </p>

          <p className="mt-2 text-sm text-slate-500">
            Enjoy the free schedule or create a new job.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-slate-200">
          {todaysJobs.map((job) => (
            <Link
              key={job.id}
              href={`/admin/jobs/${job.id}`}
              className="flex items-center justify-between py-4 transition hover:bg-slate-50"
            >
              <div>
                <h3 className="font-semibold text-slate-900">
                  {job.title || "Untitled Job"}
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  {job.customers
                    ? `${job.customers.first_name} ${job.customers.last_name}`
                    : "Unknown Customer"}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Technician: {job.technician || "Unassigned"}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Job #{job.job_number || "—"}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {job.priority && (
                  <Badge variant="warning">
                    {job.priority}
                  </Badge>
                )}

                <Badge variant="info">
                  {job.status}
                </Badge>

                <ChevronRight className="h-5 w-5 text-slate-400" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </Card>
  );
}