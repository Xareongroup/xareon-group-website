import Link from "next/link";
import Card from "@/components/ui/Card";
import {
  UserPlus,
  FileText,
  DollarSign,
  Briefcase,
  LucideIcon,
} from "lucide-react";

type ActivityType =
  | "customer"
  | "estimate"
  | "invoice"
  | "payment"
  | "job";

interface ActivityItem {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  time: string;
  href?: string;
}

interface RecentActivityProps {
  activities: ActivityItem[];
}

const icons: Record<ActivityType, LucideIcon> = {
  customer: UserPlus,
  estimate: FileText,
  invoice: FileText,
  payment: DollarSign,
  job: Briefcase,
};

export default function RecentActivity({
  activities,
}: RecentActivityProps) {
  return (
    <Card
      title="Recent Activity"
      description="Latest updates across your business"
    >
      {activities.length === 0 ? (
        <div className="py-10 text-center text-sm text-slate-500">
          No recent activity.
        </div>
      ) : (
        <div className="space-y-5">
          {activities.map((activity) => {
            const Icon = icons[activity.type];

            const content = (
              <div className="flex items-start gap-4">

                <div className="rounded-lg bg-blue-50 p-2">

                  <Icon className="h-5 w-5 text-blue-600" />

                </div>

                <div className="min-w-0 flex-1">

                  <p className="font-medium text-slate-900">
                    {activity.title}
                  </p>

                  <p className="text-sm text-slate-500">
                    {activity.description}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    {activity.time}
                  </p>

                </div>

              </div>
            );

            return activity.href ? (
              <Link key={activity.id} href={activity.href}>
                {content}
              </Link>
            ) : (
              <div key={activity.id}>
                {content}
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}