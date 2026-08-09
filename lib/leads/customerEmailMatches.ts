import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/lib/supabase/database.types";

export type ExistingCustomerMatch = Pick<
  Database["public"]["Tables"]["customers"]["Row"],
  "id" | "customer_number" | "first_name" | "last_name"
>;

/**
 * Email is not unique in the legacy customer schema. Fetch a bounded result
 * set so conversion can make an explicit, safe decision instead of relying on
 * PostgREST's single-row response mode.
 */
export async function findCustomerEmailMatches(
  supabase: SupabaseClient<Database>,
  email: string
): Promise<ExistingCustomerMatch[]> {
  const { data, error } = await supabase
    .from("customers")
    .select("id, customer_number, first_name, last_name")
    .ilike("email", email)
    .order("created_at", { ascending: true })
    .limit(2);

  if (error) throw error;

  return data ?? [];
}
