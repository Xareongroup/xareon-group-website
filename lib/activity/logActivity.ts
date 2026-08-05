import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";

export type CustomerActivityType = "customer_created" | "customer_updated" | "estimate_created" | "estimate_approved" | "job_created" | "job_assigned" | "job_completed" | "invoice_created" | "invoice_sent" | "payment_received" | "expense_created";

/** Best-effort activity writer. A business mutation must not be rolled back solely because timeline logging fails. */
export async function logCustomerActivity(supabase: SupabaseClient<Database>, customerId: string | null | undefined, activityType: CustomerActivityType, title: string, description?: string) {
  if (!customerId) return;
  const { error } = await supabase.from("customer_activity").insert({ customer_id: customerId, activity_type: activityType, title, description: description ?? null });
  if (error) console.error("Customer activity logging failed", error);
}
