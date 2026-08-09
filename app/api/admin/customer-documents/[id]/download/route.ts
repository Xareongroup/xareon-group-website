import { NextResponse } from "next/server";

import { adminSupabase } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

const SIGNED_URL_TTL_SECONDS = 60;

/**
 * Resolves a private customer document for an authenticated staff user.
 * Metadata is read through the session client first, allowing database RLS to
 * authorize access before the server-only service role mints a signed URL.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: document, error } = await supabase
    .from("customer_documents")
    .select("id, file_url")
    .eq("id", id)
    .maybeSingle();

  // RLS deliberately makes unavailable and unauthorized documents indistinguishable.
  if (error || !document) return NextResponse.json({ error: "Document not found" }, { status: 404 });

  // Preserve legacy internal application documents, but never redirect from a
  // database value to an arbitrary external URL.
  if (document.file_url.startsWith("/")) {
    return NextResponse.redirect(new URL(document.file_url, request.url));
  }

  const { data, error: signedUrlError } = await adminSupabase.storage
    .from("customer-documents")
    .createSignedUrl(document.file_url, SIGNED_URL_TTL_SECONDS);

  if (signedUrlError || !data?.signedUrl) {
    console.error("Unable to create customer document signed URL", signedUrlError);
    return NextResponse.json({ error: "Document is unavailable" }, { status: 404 });
  }

  return NextResponse.redirect(data.signedUrl);
}
