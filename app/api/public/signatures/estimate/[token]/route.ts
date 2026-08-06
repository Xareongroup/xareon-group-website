import { NextResponse } from "next/server";
import { generateSignedEstimatePDF } from "@/components/documents/renderSignedEstimate";
import { logCustomerActivity } from "@/lib/activity/logActivity";
import { recordCustomerDocument } from "@/lib/documents/recordCustomerDocument";
import { getRequestMetadata, isSignatureData } from "@/lib/portal/request";
import { adminSupabase } from "@/lib/supabase/admin";
import { triggerAutomation } from "@/lib/automation/automationEngine";

export async function POST(request: Request, { params }: { params: Promise<{ token: string }> }) {
  try {
    const { token } = await params;
    const body = await request.json();
    const signerName = typeof body.name === "string" ? body.name.trim() : "";
    if (!signerName || !isSignatureData(body.signature)) return NextResponse.json({ error: "A full name and signature are required." }, { status: 400 });
    const { data: estimate, error } = await adminSupabase.from("estimates").select("*").eq("signature_token", token).maybeSingle();
    if (error) throw error;
    if (!estimate) return NextResponse.json({ error: "Signing link is invalid or expired." }, { status: 404 });
    if (estimate.signed_at) return NextResponse.json({ error: "This estimate has already been signed." }, { status: 409 });
    const { data: customer, error: customerError } = await adminSupabase.from("customers").select("*").eq("id", estimate.customer_id).single();
    if (customerError) throw customerError;
    const { data: items, error: itemsError } = await adminSupabase.from("estimate_items").select("*").eq("estimate_id", estimate.id).order("sort_order");
    if (itemsError) throw itemsError;
    const signedAt = new Date().toISOString();
    const { ipAddress, userAgent } = getRequestMetadata(request);
    const patch = { status: "Approved", signature_status: "Signed", signed_at: signedAt, signed_by_name: signerName, signed_signature: body.signature, signed_ip: ipAddress };
    const { error: updateError } = await adminSupabase.from("estimates").update(patch).eq("id", estimate.id);
    if (updateError) throw updateError;
    const { error: auditError } = await adminSupabase.from("document_signatures").insert({ customer_id: customer.id, document_type: "estimate", document_id: estimate.id, signer_name: signerName, signature_data: body.signature, signed_at: signedAt, ip_address: ipAddress, user_agent: userAgent });
    if (auditError) throw auditError;
    const pdfBuffer = await generateSignedEstimatePDF({ ...estimate, ...patch }, customer, items ?? []);
    const filePath = `customers/${customer.id}/estimates/estimate-${estimate.estimate_number}-signed.pdf`;
    const { error: uploadError } = await adminSupabase.storage.from("customer-documents").upload(filePath, pdfBuffer, { contentType: "application/pdf", upsert: true });
    if (uploadError) throw uploadError;
    const { error: pdfUpdateError } = await adminSupabase.from("estimates").update({ signed_pdf_url: filePath }).eq("id", estimate.id);
    if (pdfUpdateError) throw pdfUpdateError;
    await recordCustomerDocument(adminSupabase, { customerId: customer.id, documentType: "Signed Estimate", title: `Estimate #${estimate.estimate_number} - Signed`, fileUrl: filePath, status: "Signed", signedDate: signedAt });
    await logCustomerActivity(adminSupabase, customer.id, "estimate_approved", "Estimate approved", `Estimate #${estimate.estimate_number} was approved and signed by ${signerName}.`, { type: "estimate", id: estimate.id });
    await triggerAutomation({ event: "estimate_approved", entityType: "estimate", entityId: estimate.id, customerId: customer.id, title: `Estimate #${estimate.estimate_number} was approved by ${signerName}.` });
    return NextResponse.json({ success: true, signedAt, filePath });
  } catch (error) {
    console.error("Portal estimate signing failed", error);
    return NextResponse.json({ error: "Unable to sign this estimate." }, { status: 500 });
  }
}
