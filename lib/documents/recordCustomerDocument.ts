import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/lib/supabase/database.types";

type CustomerDocumentInput = {
  customerId: string | null | undefined;
  documentType: "Estimate" | "Signed Estimate" | "Contract" | "Signed Contract" | "Invoice" | "Payment Receipt";
  title: string;
  fileUrl: string;
  status?: string | null;
  signedDate?: string | null;
};

/** Registers a generated artifact once in the existing customer document vault. */
export async function recordCustomerDocument(
  supabase: SupabaseClient<Database>,
  input: CustomerDocumentInput,
) {
  if (!input.customerId) return;

  const { data: existing, error: lookupError } = await supabase
    .from("customer_documents")
    .select("id")
    .eq("customer_id", input.customerId)
    .eq("file_url", input.fileUrl)
    .maybeSingle();
  if (lookupError) {
    console.error("Customer document lookup failed", lookupError);
    return;
  }
  if (existing) return;

  const { error } = await supabase.from("customer_documents").insert({
    customer_id: input.customerId,
    document_type: input.documentType,
    title: input.title,
    file_url: input.fileUrl,
    status: input.status ?? null,
    signed_date: input.signedDate ?? null,
  });
  if (error) console.error("Customer document registration failed", error);
}
