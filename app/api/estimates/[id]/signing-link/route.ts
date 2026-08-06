import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: estimate, error } = await supabase.from("estimates").select("signature_token").eq("id", id).single();
  if (error || !estimate) return NextResponse.json({ error: "Estimate not found." }, { status: 404 });
  const signatureToken = estimate.signature_token ?? crypto.randomUUID();
  if (!estimate.signature_token) {
    const { error: updateError } = await supabase.from("estimates").update({ signature_token: signatureToken, signature_status: "Pending" }).eq("id", id);
    if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 });
  }
  return NextResponse.json({ signingLink: `${process.env.NEXT_PUBLIC_SITE_URL ?? new URL(request.url).origin}/sign/estimate/${signatureToken}` });
}
