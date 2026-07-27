import Link from "next/link";
import Card from "@/components/ui/Card";
import { CalendarDays } from "lucide-react";

interface UpcomingJob {
  id: string;
  customer: string;
  service: string;
  scheduledFor: string;
  href?: string;
}

interface UpcomingJobsProps {
  jobs: UpcomingJob[];
}

export default function UpcomingJobs({
  jobs,
}: UpcomingJobsProps) {
  return (
    <Card
      title="Upcoming Jobs"
      description="Scheduled work"
    >
      {jobs.length === 0 ? (
        <div className="py-10 text-center text-sm text-slate-500">
          No upcoming jobs.
        </div>
      ) : (
        <div className="space-y-5">
          {jobs.map((job) => {

            const content = (
              <div className="flex items-start gap-4">

                <div className="rounded-lg bg-orange-50 p-2">

                  <CalendarDays className="h-5 w-5 text-orange-600" />

                </div>

                <div className="min-w-0 flex-1">

                  <p className="font-medium text-slate-900">
                    {job.customer}
                  </p>

                  <p className="text-sm text-slate-500">
                    {job.service}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    {job.scheduledFor}
                  </p>

                </div>

              </div>
            );

            return job.href ? (
              <Link
                key={job.id}
                href={job.href}
              >
                {content}
              </Link>
            ) : (
              <div key={job.id}>
                {content}
              </div>
            );

          })}
        </div>
      )}
    </Card>
  );
}