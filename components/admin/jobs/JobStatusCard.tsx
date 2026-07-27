import Link from "next/link";
import { CalendarDays, User, ArrowRight } from "lucide-react";

interface JobStatusCardProps {
  id: string;
  title: string;
  customer: string;
  scheduledDate?: string | null;
  status: string;
}

export default function JobStatusCard({
  id,
  title,
  customer,
  scheduledDate,
  status,
}: JobStatusCardProps) {
  const statusColors: Record<string, string> = {
    Scheduled: "bg-blue-100 text-blue-700",
    "In Progress": "bg-amber-100 text-amber-700",
    Completed: "bg-emerald-100 text-emerald-700",
    Cancelled: "bg-red-100 text-red-700",
  };

  return (
    <Link
      href={`/admin/jobs/${id}`}
      className="block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="flex items-start justify-between">
        <h3 className="text-lg font-semibold text-slate-900">
          {title}
        </h3>

        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            statusColors[status] ??
            "bg-slate-100 text-slate-700"
          }`}
        >
          {status}
        </span>
      </div>

      <div className="mt-5 space-y-3">

        <div className="flex items-center gap-2 text-sm text-slate-600">
          <User className="h-4 w-4" />
          {customer}
        </div>

        <div className="flex items-center gap-2 text-sm text-slate-600">
          <CalendarDays className="h-4 w-4" />
          {scheduledDate ?? "Not Scheduled"}
        </div>

      </div>

      <div className="mt-5 flex justify-end text-blue-600">
        <ArrowRight className="h-5 w-5" />
      </div>
    </Link>
  );
}