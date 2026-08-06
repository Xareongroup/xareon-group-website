import { NextResponse } from "next/server";
import * as React from "react";
import { pdf } from "@react-pdf/renderer";
import SignedContractPDF from "@/components/documents/SignedContractPDF";
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
    const { data: contract, error } = await adminSupabase.from("contracts").select("*").eq("signature_token", token).maybeSingle();
    if (error) throw error;
    if (!contract) return NextResponse.json({ error: "Signing link is invalid or expired." }, { status: 404 });
    if (contract.signed_at) return NextResponse.json({ error: "This contract has already been signed." }, { status: 409 });
    if (!contract.customer_id) return NextResponse.json({ error: "This contract has no customer." }, { status: 422 });
    const { data: customer, error: customerError } = await adminSupabase.from("customers").select("*").eq("id", contract.customer_id).single();
    if (customerError) throw customerError;
    const signedAt = new Date().toISOString();
    const { ipAddress, userAgent } = getRequestMetadata(request);
    const patch = { status: "Signed", signed: true, signed_at: signedAt, signed_by_name: signerName, signed_signature: body.signature, signed_ip: ipAddress };
    const { error: updateError } = await adminSupabase.from("contracts").update(patch).eq("id", contract.id);
    if (updateError) throw updateError;
    const { error: auditError } = await adminSupabase.from("document_signatures").insert({ customer_id: customer.id, document_type: "contract", document_id: contract.id, signer_name: signerName, signature_data: body.signature, signed_at: signedAt, ip_address: ipAddress, user_agent: userAgent });
    if (auditError) throw auditError;
    const buffer = await pdf(React.createElement(SignedContractPDF, { contract: { ...contract, ...patch }, customer }) as any).toBuffer();
    const filePath = `customers/${customer.id}/contracts/contract-${contract.contract_number ?? contract.id}-signed.pdf`;
    const { error: uploadError } = await adminSupabase.storage.from("customer-documents").upload(filePath, buffer, { contentType: "application/pdf", upsert: true });
    if (uploadError) throw uploadError;
    const { error: pdfUpdateError } = await adminSupabase.from("contracts").update({ signed_pdf_url: filePath }).eq("id", contract.id);
    if (pdfUpdateError) throw pdfUpdateError;
    await recordCustomerDocument(adminSupabase, { customerId: customer.id, documentType: "Signed Contract", title: `Contract #${contract.contract_number ?? contract.id} - Signed`, fileUrl: filePath, status: "Signed", signedDate: signedAt });
    await logCustomerActivity(adminSupabase, customer.id, "contract_signed", "Contract signed", `Contract #${contract.contract_number ?? contract.id} was signed by ${signerName}.`, { type: "contract", id: contract.id });
    await triggerAutomation({ event: "contract_signed", entityType: "contract", entityId: contract.id, customerId: customer.id, title: `Contract #${contract.contract_number ?? contract.id} was signed by ${signerName}.` });
    return NextResponse.json({ success: true, signedAt, filePath });
  } catch (error) {
    console.error("Portal contract signing failed", error);
    return NextResponse.json({ error: "Unable to sign this contract." }, { status: 500 });
  }
}
