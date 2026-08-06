import "server-only";
import { adminSupabase } from "@/lib/supabase/admin";
import type { AutomationContext } from "@/lib/automation/automationEvents";

export async function writeAutomationLog(context: AutomationContext, actionType: string, status: "Succeeded" | "Skipped" | "Failed", details: Record<string, unknown> = {}) {
  const { error } = await adminSupabase.from("automation_logs").insert({ event_type: context.event, action_type: actionType, status, entity_type: context.entityType, entity_id: context.entityId, customer_id: context.customerId ?? null, details: details as never });
  if (error) console.error("Automation log write failed", error);
}

export async function createAutomationTask(context: AutomationContext, input: { title: string; description?: string; dueDate?: Date; priority?: "Low" | "Normal" | "High" | "Urgent"; assignedUser?: string | null }) {
  const { error } = await adminSupabase.from("tasks").insert({ title: input.title, description: input.description ?? null, due_date: input.dueDate?.toISOString() ?? null, priority: input.priority ?? "Normal", assigned_user: input.assignedUser ?? null, related_type: context.entityType, related_id: context.entityId, customer_id: context.customerId ?? null });
  await writeAutomationLog(context, "create_task", error ? "Failed" : "Succeeded", { title: input.title, error: error?.message });
  if (error) throw error;
}

/** Prevents a scheduled processor from creating the same open follow-up repeatedly. */
export async function createAutomationTaskOnce(context: AutomationContext, input: { title: string; description?: string; dueDate?: Date; priority?: "Low" | "Normal" | "High" | "Urgent"; assignedUser?: string | null }) {
  if (await hasOpenAutomationTask(context, input.title)) {
    await writeAutomationLog(context, "create_task", "Skipped", { title: input.title, reason: "An open task already exists." });
    return false;
  }
  await createAutomationTask(context, input);
  return true;
}

export async function hasOpenAutomationTask(context: AutomationContext, title: string) {
  const { data: existing, error } = await adminSupabase
    .from("tasks")
    .select("id")
    .eq("related_type", context.entityType)
    .eq("related_id", context.entityId)
    .eq("title", title)
    .in("status", ["Open", "In Progress"])
    .limit(1);
  if (error) throw error;
  return Boolean(existing?.length);
}
