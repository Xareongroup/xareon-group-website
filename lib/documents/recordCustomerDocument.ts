import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/lib/supabase/database.types";

export const CUSTOMER_DOCUMENT_TYPES = [
  "Estimate",
  "Signed Estimate",
  "Contract",
  "Signed Contract",
  "Invoice",
  "Payment Receipt",
] as const;

export type CustomerDocumentType = (typeof CUSTOMER_DOCUMENT_TYPES)[number];

type CustomerDocumentInput = {
  customerId: string | null | undefined;
  documentType: CustomerDocumentType;
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
  if (!input.customerId) return null;

  const { data: existing, error: lookupError } = await supabase
    .from("customer_documents")
    .select("id")
    .eq("customer_id", input.customerId)
    .eq("file_url", input.fileUrl)
    .maybeSingle();
  if (lookupError) {
    console.error("Customer document lookup failed", lookupError);
    return null;
  }
  if (existing) return existing;

  const { data, error } = await supabase.from("customer_documents").insert({
    customer_id: input.customerId,
    document_type: input.documentType,
    title: input.title,
    file_url: input.fileUrl,
    status: input.status ?? null,
    signed_date: input.signedDate ?? null,
  }).select("id").single();
  if (error) {
    console.error("Customer document registration failed", error);
    return null;
  }

  return data;
}
