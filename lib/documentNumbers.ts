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
  // Contracts use the production sequence/function that predates the generic
  // `sequences` ledger. Calling `next_document_number('contract')` fails when
  // no matching ledger row exists, even though the contract sequence is live.
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
