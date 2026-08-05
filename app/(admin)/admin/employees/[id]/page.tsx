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
    </div>
  );
}
