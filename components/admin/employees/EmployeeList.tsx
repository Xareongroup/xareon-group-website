"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/lib/supabase/database.types";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

type Employee = Database["public"]["Tables"]["employees"]["Row"];
const managementRoles = new Set(["owner", "admin", "manager"]);

export default function EmployeeList() {
  const supabase = createClient();

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [canManage, setCanManage] = useState(false);
  const [employeeToDeactivate, setEmployeeToDeactivate] =
    useState<Employee | null>(null);
  const [deactivating, setDeactivating] = useState(false);

  useEffect(() => {
    void Promise.all([loadEmployees(), loadAccess()]);
  }, []);

  async function loadEmployees() {
    setLoading(true);

    const { data, error } = await supabase
      .from("employees")
      .select("*")
      .order("first_name");

    if (!error && data) {
      setEmployees(data);
    }

    setLoading(false);
  }

  async function loadAccess() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .maybeSingle();

    setCanManage(managementRoles.has(data?.role ?? ""));
  }

  async function handleDeactivate() {
    if (!employeeToDeactivate) return;

    setDeactivating(true);

    const { error } = await supabase
      .from("employees")
      .update({ status: "Inactive" })
      .eq("id", employeeToDeactivate.id);

    setDeactivating(false);

    if (error) {
      alert(error.message);
      return;
    }

    setEmployees((prev) =>
      prev.map((employee) =>
        employee.id === employeeToDeactivate.id
          ? { ...employee, status: "Inactive" }
          : employee
      )
    );
    setEmployeeToDeactivate(null);
  }

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        Loading employees...
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 p-6">
        <h2 className="text-xl font-semibold">
          Team Members
        </h2>
      </div>

      {employees.length === 0 ? (
        <div className="p-8 text-center text-slate-500">
          No employees found.
        </div>
      ) : (
        <div className="divide-y divide-slate-200">
          {employees.map((employee) => (
            <div
              key={employee.id}
              className="flex items-center justify-between p-5"
            >
              <div>
                <h3 className="font-semibold">
                  {employee.first_name} {employee.last_name}
                </h3>

                <p className="text-sm text-slate-500">
                  {employee.role}
                </p>

                {employee.email && (
                  <p className="text-sm text-slate-400">
                    {employee.email}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    employee.status === "Active"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {employee.status}
                </span>

                <Link
                  href={`/admin/employees/${employee.id}`}
                  className="rounded-lg bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700 hover:bg-slate-200"
                >
                  View
                </Link>

                {canManage && (
                  <>
                    <Link
                      href={`/admin/employees/${employee.id}/edit`}
                      className="rounded-lg bg-blue-50 px-3 py-1 text-sm font-medium text-blue-600 hover:bg-blue-100"
                    >
                      Edit
                    </Link>

                    <button
                      onClick={() => setEmployeeToDeactivate(employee)}
                      disabled={employee.status === "Inactive"}
                      className="rounded-lg bg-red-50 px-3 py-1 text-sm font-medium text-red-600 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Deactivate
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={Boolean(employeeToDeactivate)}
        title="Deactivate employee"
        description="Are you sure you want to remove this employee?"
        confirmText="Deactivate"
        loading={deactivating}
        onConfirm={handleDeactivate}
        onCancel={() => setEmployeeToDeactivate(null)}
      />
    </div>
  );
}
