import { SupabaseClient } from "@supabase/supabase-js";

export type DocumentSequence =
  | "customer"
  | "estimate"
  | "job"
  | "contract"
  | "invoice";

export async function getNextDocumentNumber(
  supabase: SupabaseClient,
  sequence: DocumentSequence
): Promise<string> {
  // These document types have authoritative production functions and must not
  // fall back to the legacy generic `sequences` ledger.
  if (sequence === "customer") {
    const { data, error } = await supabase.rpc("generate_customer_number");
    if (error) throw error;
    return data as string;
  }

  if (sequence === "contract") {
    const { data, error } = await supabase.rpc("generate_contract_number");
    if (error) throw error;
    return data as string;
  }

  const { data, error } = await supabase.rpc(
    "next_document_number",
    {
      sequence_name: sequence,
    }
  );

  if (error) {
    throw error;
  }

  return data as string;
}
