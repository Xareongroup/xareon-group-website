import Card from "@/components/ui/Card";
import { requireRole } from "@/lib/auth/requireRole";
import { createClient } from "@/lib/supabase/server";

export default async function AutomationPage() {
  await requireRole(["owner", "admin", "manager"]);
  const supabase = await createClient();
  const { data: logs, error } = await supabase.from("automation_logs").select("id,event_type,action_type,status,details,created_at").order("created_at", { ascending: false }).limit(100);
  if (error) throw new Error("Unable to load automation history.");
  const successful = (logs ?? []).filter((log) => log.status === "Succeeded").length;
  const failed = (logs ?? []).filter((log) => log.status === "Failed").length;
  return <div className="space-y-8"><div><h1 className="text-3xl font-bold text-slate-900">Automation History</h1><p className="mt-2 text-slate-600">Server-side workflow execution and delivery results.</p></div><div className="grid gap-4 sm:grid-cols-3"><Card title="Recent Events"><p className="text-3xl font-bold">{logs?.length ?? 0}</p></Card><Card title="Succeeded"><p className="text-3xl font-bold text-emerald-600">{successful}</p></Card><Card title="Failed"><p className="text-3xl font-bold text-red-600">{failed}</p></Card></div><Card title="Latest Automation Activity"><div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="border-b text-slate-500"><tr><th className="p-3">Date</th><th className="p-3">Event</th><th className="p-3">Action</th><th className="p-3">Status</th><th className="p-3">Details</th></tr></thead><tbody>{logs?.map((log) => <tr className="border-b" key={log.id}><td className="p-3">{new Date(log.created_at).toLocaleString()}</td><td className="p-3 font-medium">{log.event_type}</td><td className="p-3">{log.action_type}</td><td className={`p-3 font-medium ${log.status === "Failed" ? "text-red-600" : log.status === "Succeeded" ? "text-emerald-600" : "text-slate-600"}`}>{log.status}</td><td className="max-w-xs truncate p-3 text-slate-500">{JSON.stringify(log.details)}</td></tr>)}</tbody></table>{!logs?.length && <p className="p-6 text-slate-500">No automation events recorded yet.</p>}</div></Card></div>;
}
