import Link from "next/link";
import { notFound } from "next/navigation";

import { requireRole } from "@/lib/auth/requireRole";
import { createClient } from "@/lib/supabase/server";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EmployeeDetailsPage({ params }: Props) {
  const { role } = await requireRole([
    "owner", "admin", "manager", "dispatcher", "technician", "accounting", "sales", "employee", "contractor",
  ]);
  const { id } = await params;
  const supabase = await createClient();
  const { data: employee, error } = await supabase
    .from("employees")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !employee) notFound();

  const { data: assignedJobs } = await supabase
    .from("jobs")
    .select("id,status,invoice_id")
    .eq("assigned_employee_id", id);
  const jobs = assignedJobs ?? [];
  const invoiceIds = jobs.map((job) => job.invoice_id).filter((invoiceId): invoiceId is string => Boolean(invoiceId));
  const { data: invoices } = invoiceIds.length
    ? await supabase.from("invoices").select("id,total").in("id", invoiceIds)
    : { data: [] };
  const activeJobs = jobs.filter((job) => ["Scheduled", "Confirmed", "In Progress"].includes(job.status ?? "")).length;
  const completedJobs = jobs.filter((job) => job.status === "Completed").length;
  const revenue = (invoices ?? []).reduce((total, invoice) => total + Number(invoice.total ?? 0), 0);

  const canManage = ["owner", "admin", "manager"].includes(role);

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link href="/admin/employees" className="text-sm font-medium text-blue-600 hover:text-blue-700">
            ← Employees
          </Link>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            {employee.first_name} {employee.last_name}
          </h1>
        </div>
        {canManage && (
          <Link href={`/admin/employees/${employee.id}/edit`} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
            Edit employee
          </Link>
        )}
      </div>

      <dl className="grid gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:grid-cols-2">
        <div><dt className="text-sm text-slate-500">Role</dt><dd className="mt-1 font-medium text-slate-900">{employee.role}</dd></div>
        <div><dt className="text-sm text-slate-500">Status</dt><dd className="mt-1 font-medium text-slate-900">{employee.status}</dd></div>
        <div><dt className="text-sm text-slate-500">Email</dt><dd className="mt-1 font-medium text-slate-900">{employee.email ?? "—"}</dd></div>
        <div><dt className="text-sm text-slate-500">Phone</dt><dd className="mt-1 font-medium text-slate-900">{employee.phone ?? "—"}</dd></div>
        <div><dt className="text-sm text-slate-500">Hire date</dt><dd className="mt-1 font-medium text-slate-900">{employee.hire_date ?? "—"}</dd></div>
        <div><dt className="text-sm text-slate-500">Hourly rate</dt><dd className="mt-1 font-medium text-slate-900">{employee.hourly_rate == null ? "—" : `$${employee.hourly_rate.toFixed(2)}`}</dd></div>
        <div className="sm:col-span-2"><dt className="text-sm text-slate-500">Notes</dt><dd className="mt-1 whitespace-pre-wrap font-medium text-slate-900">{employee.notes ?? "—"}</dd></div>
      </dl>

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Job Performance</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3"><Metric label="Active jobs" value={String(activeJobs)} /><Metric label="Completed jobs" value={String(completedJobs)} /><Metric label="Assigned revenue" value={`$${revenue.toFixed(2)}`} /></div>
      </section>
      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Assigned Job History</h2>
        {jobs.length ? <p className="mt-3 text-sm text-slate-600">{jobs.length} assigned job{jobs.length === 1 ? "" : "s"} recorded. Customer ratings remain ready for a future review integration.</p> : <p className="mt-3 text-sm text-slate-500">No assigned jobs yet.</p>}
      </section>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl bg-slate-50 p-4"><p className="text-sm text-slate-500">{label}</p><p className="mt-1 text-xl font-semibold text-slate-900">{value}</p></div>;
}
