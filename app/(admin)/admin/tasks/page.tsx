import Link from "next/link";
import Card from "@/components/ui/Card";
import { requireRole } from "@/lib/auth/requireRole";
import { createClient } from "@/lib/supabase/server";

const badge: Record<string, string> = { Open: "bg-blue-100 text-blue-700", "In Progress": "bg-amber-100 text-amber-700", Completed: "bg-emerald-100 text-emerald-700", Cancelled: "bg-slate-100 text-slate-700" };

export default async function TasksPage() {
  const { user, role } = await requireRole(["owner", "admin", "manager", "employee", "contractor"]);
  const supabase = await createClient();
  let query = supabase.from("tasks").select("id,title,description,due_date,status,priority,related_type,related_id,created_at").order("due_date", { ascending: true, nullsFirst: false });
  if (role === "employee" || role === "contractor") query = query.eq("assigned_user", user.id);
  const { data: tasks, error } = await query;
  if (error) throw new Error("Unable to load tasks.");
  const now = new Date();
  const open = (tasks ?? []).filter((task) => task.status !== "Completed" && task.status !== "Cancelled");
  const overdue = open.filter((task) => task.due_date && new Date(task.due_date) < now);
  const today = open.filter((task) => task.due_date?.slice(0, 10) === now.toISOString().slice(0, 10));
  return <div className="space-y-8"><div><h1 className="text-3xl font-bold text-slate-900">Tasks</h1><p className="mt-2 text-slate-600">Follow-ups and workflow actions assigned to your team.</p></div><div className="grid gap-4 sm:grid-cols-3"><Card title="My Open Tasks"><p className="text-3xl font-bold">{open.length}</p></Card><Card title="Due Today"><p className="text-3xl font-bold text-amber-600">{today.length}</p></Card><Card title="Overdue"><p className="text-3xl font-bold text-red-600">{overdue.length}</p></Card></div><Card title={role === "owner" || role === "admin" || role === "manager" ? "All Tasks" : "My Tasks"}><div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="border-b text-slate-500"><tr><th className="p-3">Task</th><th className="p-3">Priority</th><th className="p-3">Due</th><th className="p-3">Status</th><th className="p-3">Related record</th></tr></thead><tbody>{tasks?.map((task) => <tr key={task.id} className="border-b"><td className="p-3"><p className="font-medium text-slate-900">{task.title}</p><p className="text-slate-500">{task.description}</p></td><td className="p-3">{task.priority}</td><td className="p-3">{task.due_date ? new Date(task.due_date).toLocaleDateString() : "—"}</td><td className="p-3"><span className={`rounded-full px-2 py-1 text-xs font-medium ${badge[task.status] ?? badge.Open}`}>{task.status}</span></td><td className="p-3">{task.related_id ? <Link className="text-blue-600 hover:underline" href={`/admin/${task.related_type}s/${task.related_id}`}>{task.related_type}</Link> : "—"}</td></tr>)}</tbody></table>{!tasks?.length && <p className="p-6 text-slate-500">No tasks found.</p>}</div></Card></div>;
}
