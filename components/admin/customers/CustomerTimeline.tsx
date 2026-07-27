import {
  User,
  FileText,
  Hammer,
  Receipt,
  CreditCard,
} from "lucide-react";

const timeline = [
  {
    title: "Customer Created",
    date: "Today",
    icon: User,
    color: "bg-blue-100 text-blue-600",
  },
  {
    title: "Estimate Approved",
    date: "Yesterday",
    icon: FileText,
    color: "bg-purple-100 text-purple-600",
  },
  {
    title: "Job Completed",
    date: "2 Days Ago",
    icon: Hammer,
    color: "bg-orange-100 text-orange-600",
  },
  {
    title: "Invoice Sent",
    date: "Last Week",
    icon: Receipt,
    color: "bg-green-100 text-green-600",
  },
  {
    title: "Payment Received",
    date: "Last Week",
    icon: CreditCard,
    color: "bg-emerald-100 text-emerald-600",
  },
];

export default function CustomerTimeline() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-xl font-semibold">
        Activity Timeline
      </h2>

      <div className="space-y-6">
        {timeline.map((item, index) => {
          const Icon = item.icon;

          return (
            <div
              key={index}
              className="flex gap-4"
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-full ${item.color}`}
              >
                <Icon className="h-5 w-5" />
              </div>

              <div className="flex-1 border-b border-slate-100 pb-6 last:border-none">
                <p className="font-semibold text-slate-900">
                  {item.title}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  {item.date}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}