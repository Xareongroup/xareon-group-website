import { CreditCard, FileText, Hammer, Link2, Receipt, RefreshCw, User } from "lucide-react";

import { createClient } from "@/lib/supabase/server";

interface Props {
  customerId: string;
}

interface TimelineActivity {
  id: string;
  activity_type: string;
  title: string;
  description: string | null;
  created_at: string | null;
}

export default async function CustomerTimeline({ customerId }: Props) {
  const supabase = await createClient();
  const [auditResult, legacyResult] = await Promise.all([
    supabase
      .from("activity_logs")
      .select("id, event_type, title, description, created_at")
      .eq("customer_id", customerId)
      .order("created_at", { ascending: false }),
    supabase
      .from("customer_activity")
      .select("id, activity_type, title, description, created_at")
      .eq("customer_id", customerId)
      .order("created_at", { ascending: false }),
  ]);

  if (auditResult.error || legacyResult.error) {
    console.error("Timeline Error:", auditResult.error ?? legacyResult.error);
  }

  // Historical customer_activity records remain visible during the gradual
  // migration. New workflow events are written to activity_logs with actor
  // and entity context.
  const activities: TimelineActivity[] = [
    ...(auditResult.data ?? []).map((item) => ({
      id: `audit-${item.id}`,
      activity_type: item.event_type,
      title: item.title,
      description: item.description,
      created_at: item.created_at,
    })),
    ...(legacyResult.data ?? []).map((item) => ({
      id: `legacy-${item.id}`,
      activity_type: item.activity_type,
      title: item.title,
      description: item.description,
      created_at: item.created_at,
    })),
  ].sort((left, right) => (right.created_at ?? "").localeCompare(left.created_at ?? ""));

  function getIcon(type: string) {
    switch (type) {
      case "portal_created":
      case "portal_regenerated":
        return type === "portal_created" ? Link2 : RefreshCw;
      case "estimate_created":
      case "estimate_sent":
      case "estimate_signed":
      case "contract_created":
      case "contract_sent":
      case "contract_signed":
        return FileText;
      case "invoice_created":
      case "invoice_sent":
        return Receipt;
      case "payment_received":
        return CreditCard;
      case "job_created":
      case "job_cancelled":
        return Hammer;
      default:
        return User;
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-xl font-semibold">Activity Timeline</h2>
      {activities.length === 0 ? (
        <p className="text-sm text-slate-500">No activity recorded yet.</p>
      ) : (
        <div className="space-y-6">
          {activities.map((item) => {
            const Icon = getIcon(item.activity_type);
            return (
              <div key={item.id} className="flex gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 border-b border-slate-100 pb-6">
                  <p className="font-semibold text-slate-900">{item.title}</p>
                  {item.description && <p className="mt-1 text-sm text-slate-600">{item.description}</p>}
                  <p className="mt-2 text-xs text-slate-400">
                    {item.created_at ? new Date(item.created_at).toLocaleString() : "—"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
