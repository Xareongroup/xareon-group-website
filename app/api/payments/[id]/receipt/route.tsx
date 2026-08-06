import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";

import PaymentReceiptPDF from "@/components/pdf/PaymentReceiptPDF";
import { adminSupabase } from "@/lib/supabase/admin";
import { requireApiRole } from "@/lib/auth/requireApiRole";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const access = await requireApiRole(["owner", "admin", "manager", "accounting"]);
  if ("response" in access) return access.response;
  const { id } = await params;
  const { data: payment, error: paymentError } = await adminSupabase
    .from("payments").select("id, amount, payment_date, payment_method, reference_number, invoice:invoices(*)").eq("id", id).single();
  if (paymentError || !payment || !payment.invoice) return NextResponse.json({ error: "Payment not found." }, { status: 404 });
  const invoice = Array.isArray(payment.invoice) ? payment.invoice[0] : payment.invoice;
  if (!invoice?.customer_id) return NextResponse.json({ error: "Payment customer not found." }, { status: 404 });
  const { data: customer, error: customerError } = await adminSupabase
    .from("customers").select("first_name, last_name, email, phone, address").eq("id", invoice.customer_id).single();
  if (customerError || !customer) return NextResponse.json({ error: "Payment customer not found." }, { status: 404 });
  const pdfBuffer = await renderToBuffer(<PaymentReceiptPDF payment={payment} invoice={invoice} customer={customer} />);
  const body = pdfBuffer.buffer.slice(pdfBuffer.byteOffset, pdfBuffer.byteOffset + pdfBuffer.byteLength) as ArrayBuffer;
  return new NextResponse(body, { headers: { "Content-Type": "application/pdf", "Content-Disposition": `inline; filename=receipt-${payment.id}.pdf` } });
}
