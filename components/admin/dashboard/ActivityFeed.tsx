import Link from "next/link";
import {
  Activity,
  ChevronRight,
  FileText,
  Hammer,
  Receipt,
} from "lucide-react";

import Card from "@/components/ui/Card";

interface ActivityItem {
  id: string;
  type: "estimate" | "job" | "invoice";
  title: string;
  description: string;
  date: string;
  href: string;
}

interface ActivityFeedProps {
  activities: ActivityItem[];
}

export default function ActivityFeed({
  activities,
}: ActivityFeedProps) {

  const iconMap = {
    estimate: FileText,
    job: Hammer,
    invoice: Receipt,
  };

  return (
    <Card
      title="Recent Activity"
      description="Latest activity across your business"
    >

      {activities.length === 0 ? (

        <div className="flex flex-col items-center justify-center py-12">

          <Activity className="mb-4 h-10 w-10 text-slate-300" />

          <p className="font-medium text-slate-700">
            No recent activity
          </p>

          <p className="mt-2 text-sm text-slate-500">
            Activity will appear here as you create estimates,
            schedule jobs, and send invoices.
          </p>

        </div>

      ) : (

        <div className="divide-y divide-slate-200">

          {activities.slice(0, 8).map((item) => {

            const Icon = iconMap[item.type];

            return (

              <Link
                key={`${item.type}-${item.id}`}
                href={item.href}
                className="flex items-center justify-between py-4 transition hover:bg-slate-50"
              >

                <div className="flex items-start gap-4">

                  <div className="rounded-lg bg-blue-50 p-2">

                    <Icon className="h-5 w-5 text-blue-600" />

                  </div>

                  <div>

                    <h3 className="font-semibold text-slate-900">
                      {item.title}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      {item.description}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      {item.date}
                    </p>

                  </div>

                </div>

                <ChevronRight className="h-5 w-5 text-slate-400" />

              </Link>

            );

          })}

        </div>

      )}

    </Card>
  );
}