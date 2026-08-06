import { NextRequest, NextResponse } from "next/server";
import { getPortalInvoice } from "@/lib/portal/data";
import { createPortalCheckout } from "@/lib/payments/paymentService";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const invoiceId = typeof body.invoiceId === "string" ? body.invoiceId : "";
    const portalToken = typeof body.portalToken === "string" ? body.portalToken : "";
    if (!invoiceId || !portalToken) return NextResponse.json({ error: "Invoice access could not be verified." }, { status: 400 });
    const data = await getPortalInvoice(portalToken, invoiceId);
    if (!data) return NextResponse.json({ error: "Invoice not found." }, { status: 404 });
    const checkout = await createPortalCheckout({ invoice: data.invoice, customer: data.customer, portalToken, origin: request.nextUrl.origin });
    return NextResponse.json(checkout);
  } catch (error) {
    console.error("Stripe checkout creation failed", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Online payment is unavailable." }, { status: 503 });
  }
}
