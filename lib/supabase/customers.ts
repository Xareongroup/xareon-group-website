import { createClient } from "./client";
import { Customer } from "./types";

export async function getCustomers(): Promise<Customer[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    throw error;
  }

  return data ?? [];
}