import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";

export type CustomerActivityType =
  | "customer_created" | "customer_updated" | "estimate_created" | "estimate_sent"
  | "estimate_viewed" | "estimate_approved" | "estimate_signed" | "job_created"
  | "job_assigned" | "job_completed" | "job_cancelled" | "invoice_created" | "invoice_sent"
  | "payment_received" | "contract_created" | "contract_sent" | "contract_signed"
  | "document_created" | "expense_created";

/** Best-effort activity writer. A business mutation must not be rolled back solely because timeline logging fails. */
export async function logCustomerActivity(
  supabase: SupabaseClient<Database>, customerId: string | null | undefined,
  activityType: CustomerActivityType, title: string, description?: string,
  entity?: { type: string; id?: string | null },
) {
  if (!customerId) return;
  const { data: auth } = await supabase.auth.getUser();
  const { error } = await supabase.from("activity_logs").insert({
    customer_id: customerId, event_type: activityType,
    entity_type: entity?.type ?? "customer", entity_id: entity?.id ?? null,
    title, description: description ?? null, actor_id: auth.user?.id ?? null,
  });
  if (error) console.error("Activity audit logging failed", error);
}
