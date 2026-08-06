import { notFound } from "next/navigation";

import EmployeeForm from "@/components/admin/employees/EmployeeForm";
import EmployeeSkillsEditor from "@/components/admin/employees/EmployeeSkillsEditor";
import EmployeeAvailabilityEditor from "@/components/admin/employees/EmployeeAvailabilityEditor";
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
    <div className="mx-auto max-w-3xl space-y-6 px-6 py-8">
      <EmployeeForm
        employee={{
          id: employee.id,
          first_name: employee.first_name,
          last_name: employee.last_name,
          email: employee.email ?? "",
          phone: employee.phone ?? "",
          role: employee.role,
          status: employee.status,
          address: employee.address ?? "",
          emergency_contact_name: employee.emergency_contact_name ?? "",
          emergency_contact_phone: employee.emergency_contact_phone ?? "",
          profile_photo_url: employee.profile_photo_url ?? "",
          hire_date: employee.hire_date ?? "",
          notes: employee.notes ?? "",
        }}
        redirectTo={`/admin/employees/${employee.id}`}
      />
      <div className="grid gap-6 lg:grid-cols-2"><EmployeeSkillsEditor employeeId={employee.id} /><EmployeeAvailabilityEditor employeeId={employee.id} /></div>
    </div>
  );
}
