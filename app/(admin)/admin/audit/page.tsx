import Card from "@/components/ui/Card";

const logs = [
  {
    user: "Administrator",
    action: "Created Customer",
    resource: "John Smith",
    time: "2 minutes ago",
  },
  {
    user: "Dispatcher",
    action: "Scheduled Job",
    resource: "TV Mount",
    time: "18 minutes ago",
  },
  {
    user: "Accounting",
    action: "Recorded Payment",
    resource: "Invoice #104",
    time: "1 hour ago",
  },
];

export default function AuditPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">
          Audit Log
        </h1>

        <p className="text-slate-600">
          Track every important action across the business.
        </p>
      </div>

      <Card title="Recent Activity">
        <div className="divide-y">
          {logs.map((log, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-4"
            >
              <div>
                <p className="font-medium">
                  {log.user}
                </p>

                <p className="text-sm text-slate-600">
                  {log.action}
                </p>

                <p className="text-xs text-slate-400">
                  {log.resource}
                </p>
              </div>

              <span className="text-sm text-slate-500">
                {log.time}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}