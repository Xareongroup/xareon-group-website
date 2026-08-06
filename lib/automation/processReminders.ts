import "server-only";

import { createAutomationTaskOnce, hasOpenAutomationTask, writeAutomationLog } from "@/lib/automation/automationActions";
import { adminSupabase } from "@/lib/supabase/admin";
import type { AutomationContext } from "@/lib/automation/automationEvents";

const daysAgo = (days: number) => new Date(Date.now() - days * 86_400_000).toISOString();

/**
 * Safe to invoke repeatedly from a protected scheduler. It only creates open
 * follow-up tasks once; delivery is intentionally left to approved notification
 * automation rather than sending duplicate customer email from a cron run.
 */
export async function processReminders({ dryRun = false }: { dryRun?: boolean } = {}) {
  const results = { mode: dryRun ? "dry-run" : "execute", pendingEstimateReminders: 0, appointmentReminders: 0, invoiceReminders: 0, tasksCreated: 0 };
  const { data: estimates, error: estimateError } = await adminSupabase
    .from("estimates").select("id,customer_id,estimate_number,created_at,status")
    .in("status", ["Sent", "Pending"])
    .lte("created_at", daysAgo(3));
  if (estimateError) throw estimateError;
  for (const estimate of estimates ?? []) {
    const context: AutomationContext = { event: "estimate_pending", entityType: "estimate", entityId: estimate.id, customerId: estimate.customer_id, title: `Estimate ${estimate.estimate_number} is still pending.` };
    const title = "Follow up on pending estimate";
    const created = dryRun ? !(await hasOpenAutomationTask(context, title)) : await createAutomationTaskOnce(context, { title, description: context.title, priority: "High" });
    if (created) { results.pendingEstimateReminders++; if (!dryRun) results.tasksCreated++; }
  }

  const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
  const date = tomorrow.toISOString().slice(0, 10);
  const { data: jobs, error: jobError } = await adminSupabase.from("jobs").select("id,customer_id,job_number,title").eq("scheduled_date", date).neq("status", "Cancelled");
  if (jobError) throw jobError;
  for (const job of jobs ?? []) {
    const context: AutomationContext = { event: "appointment_reminder", entityType: "job", entityId: job.id, customerId: job.customer_id, title: `Appointment reminder: ${job.job_number} ${job.title}.` };
    const title = "Send appointment reminder";
    const created = dryRun ? !(await hasOpenAutomationTask(context, title)) : await createAutomationTaskOnce(context, { title, description: context.title, priority: "Normal" });
    if (created) {
      results.appointmentReminders++;
      if (!dryRun) { results.tasksCreated++; await writeAutomationLog(context, "reminder_ready", "Succeeded", { scheduled_for: date }); }
    }
  }

  const { data: invoices, error: invoiceError } = await adminSupabase.from("invoices").select("id,customer_id,invoice_number,due_date,status").in("status", ["Sent", "Overdue"]).lte("due_date", new Date().toISOString().slice(0, 10));
  if (invoiceError) throw invoiceError;
  for (const invoice of invoices ?? []) {
    const context: AutomationContext = { event: "invoice_due", entityType: "invoice", entityId: invoice.id, customerId: invoice.customer_id, title: `Invoice ${invoice.invoice_number} requires payment follow-up.` };
    const title = "Follow up on invoice";
    const created = dryRun ? !(await hasOpenAutomationTask(context, title)) : await createAutomationTaskOnce(context, { title, description: context.title, priority: "High" });
    if (created) { results.invoiceReminders++; if (!dryRun) results.tasksCreated++; }
  }
  return results;
}
