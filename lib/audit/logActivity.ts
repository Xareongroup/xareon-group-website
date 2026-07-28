import { AuditLog } from "@/types/audit";

export async function logActivity(
  activity: Omit<AuditLog, "id" | "createdAt">
) {
  // Future implementation:
  // await supabase.from("audit_logs").insert(...)

  console.log("[AUDIT]", {
    ...activity,
    createdAt: new Date().toISOString(),
  });
}