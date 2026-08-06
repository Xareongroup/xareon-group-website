import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { resend } from "@/lib/resend";
import { renderEstimatePdf } from "@/lib/pdf/renderEstimatePdf";
import { logCustomerActivity } from "@/lib/activity/logActivity";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: estimate, error } = await supabase.from("estimates").select("*,customer:customers(*)").eq("id", id).single();
    if (error || !estimate) return NextResponse.json({ error: "Estimate not found." }, { status: 404 });
    const customer = Array.isArray(estimate.customer) ? estimate.customer[0] : estimate.customer;
    if (!customer?.email) return NextResponse.json({ error: "The estimate customer has no email address." }, { status: 422 });

    const signatureToken = estimate.signature_token ?? crypto.randomUUID();
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? new URL(request.url).origin;
    const signingLink = `${siteUrl}/sign/estimate/${signatureToken}`;
    const { data: items, error: itemsError } = await supabase.from("estimate_items").select("*").eq("estimate_id", id).order("sort_order");
    if (itemsError) throw itemsError;
    const pdfBuffer = await renderEstimatePdf({ estimate, customer, items: items ?? [] });
    const documentUrl = `/api/estimates/${id}/pdf`;

    const { error: emailError } = await resend.emails.send({
      from: "XAREON GROUP <info@xareongroup.com>",
      to: customer.email,
      subject: `XAREON Group Estimate #${estimate.estimate_number ?? ""}`,
      html: `<div style="font-family:Arial,sans-serif;line-height:1.6"><p>Dear ${customer.first_name},</p><p>Please review your estimate.</p><p><a href="${signingLink}">Review and approve your estimate</a></p><p>Thank you.<br/>XAREON Group</p></div>`,
      attachments: [{ filename: `Estimate-${estimate.estimate_number ?? id}.pdf`, content: pdfBuffer.toString("base64") }],
    });
    if (emailError) throw emailError;

    const sentAt = new Date().toISOString();
    const { error: updateError } = await supabase.from("estimates").update({ sent_at: sentAt, signature_status: "Pending", signature_token: signatureToken, status: "Sent" }).eq("id", id);
    if (updateError) throw updateError;
    const { data: existingDocument } = await supabase.from("customer_documents").select("id").eq("customer_id", customer.id).eq("document_type", "estimate").eq("title", `Estimate #${estimate.estimate_number ?? id}`).maybeSingle();
    const document = { customer_id: customer.id, document_type: "estimate", title: `Estimate #${estimate.estimate_number ?? id}`, file_url: documentUrl, status: "Sent" };
    const documentResult = existingDocument ? await supabase.from("customer_documents").update(document).eq("id", existingDocument.id) : await supabase.from("customer_documents").insert(document);
    if (documentResult.error) throw documentResult.error;
    await logCustomerActivity(
      supabase,
      customer.id,
      "estimate_sent",
      "Estimate sent",
      `Estimate #${estimate.estimate_number ?? id} was emailed to ${customer.email}.`,
      { type: "estimate", id },
    );
    return NextResponse.json({ success: true, signingLink });
  } catch (error) {
    console.error("SEND ESTIMATE ERROR:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to send estimate." }, { status: 500 });
  }
}
