"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { EmployeeFormData } from "./EmployeeForm";

type Props = {
  onEdit?: (employee: EmployeeFormData) => void;
};

type Employee = {
  id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  role: string;
  status: string;
};

export default function EmployeeList({ onEdit }: Props) {
  const supabase = createClient();

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEmployees();
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

  async function handleDelete(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this employee?"
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("employees")
      .delete()
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    setEmployees((prev) =>
      prev.filter((employee) => employee.id !== id)
    );
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

                <button
                  onClick={() =>
                    onEdit?.({
                      id: employee.id,
                      first_name: employee.first_name,
                      last_name: employee.last_name,
                      email: employee.email ?? "",
                      phone: employee.phone ?? "",
                      role: employee.role,
                      status: employee.status,
                    })
                  }
                  className="rounded-lg bg-blue-50 px-3 py-1 text-sm font-medium text-blue-600 hover:bg-blue-100"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(employee.id)}
                  className="rounded-lg bg-red-50 px-3 py-1 text-sm font-medium text-red-600 hover:bg-red-100"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}