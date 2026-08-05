"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export type EmployeeFormData = {
  id?: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
};

type Props = {
  employee?: EmployeeFormData | null;
  onSaved?: () => void;
  redirectTo?: string;
};

const emptyForm: EmployeeFormData = {
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  role: "Technician",
  status: "Active",
};

export default function EmployeeForm({
  employee,
  onSaved,
  redirectTo,
}: Props) {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(false);
  const [form, setForm] =
    useState<EmployeeFormData>(emptyForm);

  useEffect(() => {
    if (employee) {
      setForm(employee);
    } else {
      setForm(emptyForm);
    }
  }, [employee]);

  function update(
    field: keyof EmployeeFormData,
    value: string
  ) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);

    let error;

    if (form.id) {
      ({ error } = await supabase
        .from("employees")
        .update({
          first_name: form.first_name,
          last_name: form.last_name,
          email: form.email,
          phone: form.phone,
          role: form.role,
          status: form.status,
        })
        .eq("id", form.id));
    } else {
      ({ error } = await supabase
        .from("employees")
        .insert({
          first_name: form.first_name,
          last_name: form.last_name,
          email: form.email,
          phone: form.phone,
          role: form.role,
          status: form.status,
        }));
    }

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert(
      form.id
        ? "Employee updated successfully!"
        : "Employee added successfully!"
    );

    setForm(emptyForm);

    onSaved?.();
    if (redirectTo) {
      router.push(redirectTo);
      router.refresh();
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <h2 className="text-xl font-semibold">
        {form.id ? "Edit Employee" : "Add Employee"}
      </h2>

      <input
        className="w-full rounded-xl border p-3"
        placeholder="First Name"
        value={form.first_name}
        onChange={(e) =>
          update("first_name", e.target.value)
        }
        required
      />

      <input
        className="w-full rounded-xl border p-3"
        placeholder="Last Name"
        value={form.last_name}
        onChange={(e) =>
          update("last_name", e.target.value)
        }
        required
      />

      <input
        type="email"
        className="w-full rounded-xl border p-3"
        placeholder="Email"
        value={form.email}
        onChange={(e) =>
          update("email", e.target.value)
        }
      />

      <input
        className="w-full rounded-xl border p-3"
        placeholder="Phone Number"
        value={form.phone}
        onChange={(e) =>
          update("phone", e.target.value)
        }
      />

      <select
        className="w-full rounded-xl border p-3"
        value={form.role}
        onChange={(e) =>
          update("role", e.target.value)
        }
      >
        <option>Technician</option>
        <option>Manager</option>
        <option>Office Staff</option>
      </select>

      <select
        className="w-full rounded-xl border p-3"
        value={form.status}
        onChange={(e) =>
          update("status", e.target.value)
        }
      >
        <option>Active</option>
        <option>Inactive</option>
      </select>

      <button
        disabled={loading}
        className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
      >
        {loading
          ? "Saving..."
          : form.id
          ? "Update Employee"
          : "Add Employee"}
      </button>
    </form>
  );
}
