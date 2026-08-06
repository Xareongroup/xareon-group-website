import "server-only";
import { logCustomerActivity } from "@/lib/activity/logActivity";
import { resend } from "@/lib/resend";
import { adminSupabase } from "@/lib/supabase/admin";
type NotificationType = "estimate_ready" | "contract_ready" | "invoice_ready" | "payment_receipt";
export type CustomerNotificationInput = { customerId: string; firstName: string; email: string; type: NotificationType; subject: string; message: string; actionLabel: string; actionUrl: string };
export async function sendCustomerNotification(input: CustomerNotificationInput) { const { error } = await resend.emails.send({ from: "XAREON GROUP <info@xareongroup.com>", to: input.email, subject: input.subject, html: `<div style="font-family:Arial,sans-serif;line-height:1.6;color:#0f172a"><h2>XAREON GROUP</h2><p>Hello ${input.firstName},</p><p>${input.message}</p><p><a href="${input.actionUrl}" style="display:inline-block;background:#2563eb;color:#fff;padding:12px 18px;border-radius:8px;text-decoration:none">${input.actionLabel}</a></p><p>Thank you,<br/>XAREON GROUP</p></div>` }); if (error) throw error; await logCustomerActivity(adminSupabase, input.customerId, "document_created", "Email sent", `${input.type.replace(/_/g, " ")} notification sent to ${input.email}.`, { type: "notification" }); }
