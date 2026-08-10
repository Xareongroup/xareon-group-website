import { NextResponse } from "next/server";
import { pdf } from "@react-pdf/renderer";
import React from "react";

import ContractPDF from "@/components/documents/ContractPDF";
import { requireApiRole } from "@/lib/auth/requireApiRole";
import { recordCustomerDocument } from "@/lib/documents/recordCustomerDocument";
import { adminSupabase } from "@/lib/supabase/admin";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const access = await requireApiRole(["owner", "admin", "manager", "accounting"]);
  if ("response" in access) return access.response;

  try {
    const { id } = await params;
    const { data: contract, error: contractError } = await adminSupabase
      .from("contracts")
      .select("*")
      .eq("id", id)
      .single();

    if (contractError || !contract) {
      return NextResponse.json({ error: "Contract not found." }, { status: 404 });
    }
    if (!contract.customer_id) {
      return NextResponse.json({ error: "This contract is not linked to a customer." }, { status: 422 });
    }

    const { data: customer, error: customerError } = await adminSupabase
      .from("customers")
      .select("*")
      .eq("id", contract.customer_id)
      .single();
    if (customerError || !customer) {
      return NextResponse.json({ error: "Contract customer not found." }, { status: 404 });
    }

    const buffer = await pdf(React.createElement(ContractPDF, { contract, customer }) as never).toBuffer();
    const filePath = `contracts/${id}.pdf`;
    const { error: uploadError } = await adminSupabase.storage
      .from("customer-documents")
      .upload(filePath, buffer, { contentType: "application/pdf", upsert: true });
    if (uploadError) throw uploadError;

    const { error: updateError } = await adminSupabase
      .from("contracts")
      .update({ pdf_url: filePath })
      .eq("id", id);
    if (updateError) throw updateError;

    const document = await recordCustomerDocument(adminSupabase, {
      customerId: contract.customer_id,
      documentType: contract.signed ? "Signed Contract" : "Contract",
      title: `${contract.signed ? "Signed contract" : "Contract"} #${contract.contract_number ?? id}`,
      fileUrl: filePath,
      status: contract.status,
      signedDate: contract.signed_at,
    });
    if (!document) throw new Error("Customer document registration failed.");

    return NextResponse.json({
      success: true,
      url: `/api/admin/customer-documents/${document.id}/download`,
    });
  } catch (error) {
    console.error("Contract PDF generation failed", error);
    return NextResponse.json(
      { error: "Unable to generate the contract PDF. Please try again." },
      { status: 500 },
    );
  }
}
