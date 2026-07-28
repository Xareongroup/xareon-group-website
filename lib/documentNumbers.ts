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