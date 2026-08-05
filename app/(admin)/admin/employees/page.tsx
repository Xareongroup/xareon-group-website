"use client";

import EmployeeForm from "@/components/admin/employees/EmployeeForm";
import EmployeeList from "@/components/admin/employees/EmployeeList";

export default function EmployeesPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          Employees
        </h1>

        <p className="mt-2 text-slate-500">
          Manage technicians and team members.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div>
          <EmployeeForm />
        </div>

        <div className="lg:col-span-2">
          <EmployeeList />
        </div>
      </div>
    </div>
  );
}
