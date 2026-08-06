import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";

import { adminSupabase } from "@/lib/supabase/admin";
import { requireApiRole } from "@/lib/auth/requireApiRole";
import { recordCustomerDocument } from "@/lib/documents/recordCustomerDocument";
import InvoicePDF from "@/components/pdf/InvoicePDF";

interface RouteProps {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(
  request: Request,
  { params }: RouteProps
) {
  const access = await requireApiRole(["owner", "admin", "manager", "accounting"]);
  if ("response" in access) return access.response;
  const { id } = await params;

  const supabase = adminSupabase;

  // Load invoice
  const { data: invoice, error } = await supabase
    .from("invoices")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !invoice) {
    return NextResponse.json(
      { error: "Invoice not found." },
      { status: 404 }
    );
  }
  if (!invoice.customer_id) {
    return NextResponse.json({ error: "Invoice is not linked to a customer." }, { status: 422 });
  }

  await recordCustomerDocument(supabase, {
    customerId: invoice.customer_id,
    documentType: "Invoice",
    title: `Invoice #${invoice.invoice_number ?? id}`,
    fileUrl: `/api/invoices/${id}/pdf`,
    status: invoice.status,
  });

  // Load customer
  const { data: customer } = await supabase
    .from("customers")
    .select("*")
    .eq("id", invoice.customer_id)
    .single();

  // Load invoice items
  const { data: items } = await supabase
    .from("invoice_items")
    .select("*")
    .eq("invoice_id", id)
    .order("sort_order");

  const pdfBuffer = await renderToBuffer(
    <InvoicePDF
      invoice={invoice}
      customer={customer}
      items={items ?? []}
    />
  );

  return new NextResponse(new Uint8Array(pdfBuffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${invoice.invoice_number ?? invoice.id}.pdf"`,
    },
  });
}
