import "server-only";
import { resend } from "@/lib/resend";
import { adminSupabase } from "@/lib/supabase/admin";
import { createAutomationTaskOnce, writeAutomationLog } from "@/lib/automation/automationActions";
import type { AutomationContext } from "@/lib/automation/automationEvents";

function nextBusinessDay() { const date = new Date(); date.setDate(date.getDate() + 1); if (date.getDay() === 6) date.setDate(date.getDate() + 2); if (date.getDay() === 0) date.setDate(date.getDate() + 1); date.setHours(9, 0, 0, 0); return date; }

async function ownerRecipients() {
  const { data: roles } = await adminSupabase.from("user_roles").select("employee_id,user_id").in("role", ["owner", "admin"]);
  const employeeIds = (roles ?? []).flatMap((role) => role.employee_id ? [role.employee_id] : []);
  if (!employeeIds.length) return { emails: ["info@xareongroup.com"], userId: null };
  const { data: employees } = await adminSupabase.from("employees").select("email").in("id", employeeIds);
  return { emails: (employees ?? []).flatMap((employee) => employee.email ? [employee.email] : []), userId: roles?.[0]?.user_id ?? null };
}

export async function triggerAutomation(context: AutomationContext) {
  try {
    const owners = await ownerRecipients();
    const taskByEvent = {
      lead_created: ["Follow up with new lead", "New website lead requires follow-up.", "High"],
      estimate_pending: ["Follow up on pending estimate", "An estimate is awaiting customer review.", "High"],
      estimate_approved: ["Prepare next project step", "Customer approved an estimate.", "Normal"],
      contract_signed: ["Review signed contract", "Customer signed a service agreement.", "Normal"],
      job_completed: ["Request customer review", "A completed job is ready for a review request.", "Normal"],
      invoice_due: ["Follow up on invoice", "An invoice requires payment follow-up.", "High"],
    } as const;
    const task = taskByEvent[context.event as keyof typeof taskByEvent];
    if (task) await createAutomationTaskOnce(context, { title: task[0], description: context.title ?? task[1], dueDate: nextBusinessDay(), priority: task[2], assignedUser: owners.userId });

    const customerEvents = new Set(["estimate_created", "estimate_sent", "contract_created", "job_scheduled", "appointment_reminder", "job_completed", "invoice_created", "payment_received"]);
    const portalRequired = new Set(["estimate_created", "estimate_sent", "contract_created", "invoice_created"]);
    const recipientEmail = context.recipientEmail;
    const canNotifyCustomer = Boolean(recipientEmail) && (!portalRequired.has(context.event) || Boolean(context.portalUrl));
    if (customerEvents.has(context.event) && canNotifyCustomer) {
      const labels: Record<string, string> = { estimate_created: "Your XAREON estimate is ready", estimate_sent: "Your XAREON estimate is ready", contract_created: "Your XAREON service agreement is ready", job_scheduled: "Your XAREON appointment is confirmed", appointment_reminder: "XAREON appointment reminder", job_completed: "Your XAREON project has been completed", invoice_created: "Your XAREON invoice is ready", payment_received: "Your XAREON payment receipt" };
      const { error } = await resend.emails.send({ from: "XAREON GROUP <info@xareongroup.com>", to: recipientEmail!, subject: labels[context.event], html: `<h2>${labels[context.event]}</h2><p>Hello ${context.recipientName ?? "Customer"},</p><p>${context.title ?? "There is an update to your XAREON project."}</p>${context.portalUrl ? `<p><a href="${context.portalUrl}">View your project portal</a></p>` : ""}` });
      await writeAutomationLog(context, "send_email", error ? "Failed" : "Succeeded", { recipient: recipientEmail, error: error?.message });
    } else if (customerEvents.has(context.event)) {
      await writeAutomationLog(context, "send_email", "Skipped", { reason: context.recipientEmail ? "A secure portal URL was required but not supplied by the event handler." : "No customer email was supplied by the event handler." });
    }
    if (!task && !customerEvents.has(context.event)) await writeAutomationLog(context, "event_received", "Succeeded", { reason: "Event recorded; no immediate action is configured." });
  } catch (error) { console.error("Automation event failed", { event: context.event, error }); await writeAutomationLog(context, "engine", "Failed", { error: error instanceof Error ? error.message : "Unknown error" }); }
}
