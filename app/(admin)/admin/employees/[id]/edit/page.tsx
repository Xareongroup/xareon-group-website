import { notFound } from "next/navigation";

import EmployeeForm from "@/components/admin/employees/EmployeeForm";
import { requireRole } from "@/lib/auth/requireRole";
import { createClient } from "@/lib/supabase/server";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditEmployeePage({ params }: Props) {
  await requireRole(["owner", "admin", "manager"]);
  const { id } = await params;
  const supabase = await createClient();
  const { data: employee, error } = await supabase
    .from("employees")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !employee) notFound();

  return (
    <div className="mx-auto max-w-xl px-6 py-8">
      <EmployeeForm
        employee={{
          id: employee.id,
          first_name: employee.first_name,
          last_name: employee.last_name,
          email: employee.email ?? "",
          phone: employee.phone ?? "",
          role: employee.role,
          status: employee.status,
        }}
        redirectTo={`/admin/employees/${employee.id}`}
      />
    </div>
  );
}
