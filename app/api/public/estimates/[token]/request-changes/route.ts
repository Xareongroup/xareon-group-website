import { NextResponse } from "next/server";
import { logCustomerActivity } from "@/lib/activity/logActivity";
import { getRequestMetadata } from "@/lib/portal/request";
import { adminSupabase } from "@/lib/supabase/admin";

export async function POST(request: Request, { params }: { params: Promise<{ token: string }> }) {
  try {
    const { token } = await params;
    const { estimateId, comment } = await request.json();
    if (typeof estimateId !== "string" || typeof comment !== "string" || !comment.trim()) return NextResponse.json({ error: "A request message is required." }, { status: 400 });
    const { data: estimate, error } = await adminSupabase.from("estimates").select("id, customer_id, estimate_number").eq("id", estimateId).eq("signature_token", token).maybeSingle();
    if (error) throw error;
    if (!estimate) return NextResponse.json({ error: "Estimate not found." }, { status: 404 });
    const { ipAddress, userAgent } = getRequestMetadata(request);
    await logCustomerActivity(adminSupabase, estimate.customer_id, "estimate_viewed", "Estimate changes requested", `Customer requested changes to Estimate #${estimate.estimate_number}: ${comment.trim()} [IP: ${ipAddress ?? "unknown"}; agent: ${userAgent ?? "unknown"}]`, { type: "estimate", id: estimate.id });
    return NextResponse.json({ success: true });
  } catch (error) { console.error("Estimate change request failed", error); return NextResponse.json({ error: "Unable to submit request." }, { status: 500 }); }
}
