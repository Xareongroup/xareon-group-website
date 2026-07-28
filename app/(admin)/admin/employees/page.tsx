"use client";

import { useState } from "react";

import EmployeeForm, {
  EmployeeFormData,
} from "@/components/admin/employees/EmployeeForm";
import EmployeeList from "@/components/admin/employees/EmployeeList";

export default function EmployeesPage() {
  const [selectedEmployee, setSelectedEmployee] =
    useState<EmployeeFormData | null>(null);

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
          <EmployeeForm employee={selectedEmployee} />
        </div>

        <div className="lg:col-span-2">
          <EmployeeList
            onEdit={(employee) => setSelectedEmployee(employee)}
          />
        </div>
      </div>
    </div>
  );
}