import { NextResponse } from "next/server";
import { getPortalDocument } from "@/lib/portal/data";
import { adminSupabase } from "@/lib/supabase/admin";

export async function GET(request: Request, { params }: { params: Promise<{ token: string; id: string }> }) {
  const { token, id } = await params;
  const document = await getPortalDocument(token, id);
  if (!document) return NextResponse.json({ error: "Document not found." }, { status: 404 });
  // Legacy application routes remain available only after token and customer
  // ownership validation above. Do not trust database-provided external URLs.
  if (document.file_url.startsWith("/")) return NextResponse.redirect(new URL(document.file_url, request.url));
  const { data, error } = await adminSupabase.storage.from("customer-documents").createSignedUrl(document.file_url, 60);
  if (error || !data?.signedUrl) return NextResponse.json({ error: "Document is unavailable." }, { status: 404 });
  return NextResponse.redirect(data.signedUrl);
}
