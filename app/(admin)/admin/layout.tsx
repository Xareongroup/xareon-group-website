import { requireRole } from "@/lib/auth/requireRole";

import AdminShell from "@/components/admin/AdminShell";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole(["owner", "admin", "manager", "dispatcher", "technician", "accounting", "sales", "employee", "contractor"]);

  return (
    <AdminShell>
      {children}
    </AdminShell>
  );
}
