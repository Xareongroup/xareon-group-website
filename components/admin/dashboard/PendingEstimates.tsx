import Link from "next/link";
import { ChevronRight, FileText } from "lucide-react";

import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

interface Estimate {
  id: string;
  estimate_number: number;
  status: string;
  total: number | null;
  expiration_date: string | null;

  customers: {
    id: string;
    first_name: string;
    last_name: string;
  } | null;
}

interface PendingEstimatesProps {
  estimates: Estimate[];
}

export default function PendingEstimates({
  estimates,
}: PendingEstimatesProps) {
  const pending = estimates.filter(
    (estimate) =>
      estimate.status !== "Accepted" &&
      estimate.status !== "Rejected"
  );

  return (
    <Card
      title="Pending Estimates"
      description="Estimates awaiting customer action"
    >
      {pending.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <FileText className="mb-4 h-10 w-10 text-slate-300" />

          <p className="font-medium text-slate-700">
            No pending estimates
          </p>

          <p className="mt-2 text-sm text-slate-500">
            You're all caught up.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-slate-200">
          {pending.slice(0, 5).map((estimate) => (
            <Link
              key={estimate.id}
              href={`/admin/estimates/${estimate.id}`}
              className="flex items-center justify-between py-4 transition hover:bg-slate-50"
            >
              <div>
                <h3 className="font-semibold text-slate-900">
                  Estimate #{estimate.estimate_number}
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  {estimate.customers
                    ? `${estimate.customers.first_name} ${estimate.customers.last_name}`
                    : "Unknown Customer"}
                </p>

                <p className="text-sm font-medium text-slate-700">
                  ${Number(estimate.total ?? 0).toFixed(2)}
                </p>

                <p className="text-xs text-slate-400">
                  Expires: {estimate.expiration_date ?? "No expiration"}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Badge variant="warning">
                  {estimate.status}
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