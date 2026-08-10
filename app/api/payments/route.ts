import { NextResponse } from "next/server";
import { adminSupabase } from "@/lib/supabase/admin";
import { recalculateInvoice } from "@/lib/invoices/recalculateInvoice";
import { requireApiRole } from "@/lib/auth/requireApiRole";
import { logCustomerActivity } from "@/lib/activity/logActivity";
import { triggerAutomation } from "@/lib/automation/automationEngine";
import { recordCustomerDocument } from "@/lib/documents/recordCustomerDocument";

export async function POST(request: Request) {
  const access = await requireApiRole(["owner", "admin", "accounting"]);
  if ("response" in access) return access.response;
  try {
    const body = await request.json();

    const {
      invoice_id,
      amount,
      payment_method,
      payment_date,
      reference_number,
      notes,
    } = body;

    // Validate required fields
    if (!invoice_id || !amount) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    const supabase = adminSupabase;

    const { data: invoice, error: invoiceError } = await supabase
      .from("invoices")
      .select("id, invoice_number, customer_id, balance_due, status")
      .eq("id", invoice_id)
      .single();
    if (invoiceError || !invoice) return NextResponse.json({ error: "Invoice not found." }, { status: 404 });
    if (Number(amount) <= 0) return NextResponse.json({ error: "Payment amount must be greater than zero." }, { status: 400 });
    if (Number(amount) > Number(invoice.balance_due ?? 0)) return NextResponse.json({ error: "Payment exceeds the remaining invoice balance." }, { status: 422 });

    // Create the payment. Multiple partial payments remain valid until the
    // invoice balance reaches zero.
    const { data: payment, error } = await supabase
      .from("payments")
      .insert({
        invoice_id,
        amount,
        payment_method,
        payment_date,
        reference_number,
        notes,
      })
      .select("id")
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    // Update invoice totals and status
    await recalculateInvoice(invoice_id);

    await logCustomerActivity(
      supabase,
      invoice.customer_id,
      "payment_received",
      "Payment received",
      `Payment of $${Number(amount).toFixed(2)} was recorded for invoice #${invoice.invoice_number ?? invoice_id}.`,
      { type: "payment", id: payment?.id },
    );
    if (invoice.customer_id && payment) {
      await recordCustomerDocument(supabase, {
        customerId: invoice.customer_id,
        documentType: "Payment Receipt",
        title: `Receipt for invoice #${invoice.invoice_number ?? invoice_id}`,
        fileUrl: `/api/payments/${payment.id}/receipt`,
        status: "Paid",
      });
    }
    await triggerAutomation({ event: "payment_received", entityType: "payment", entityId: payment?.id ?? invoice.id, customerId: invoice.customer_id, title: `Payment of $${Number(amount).toFixed(2)} was received for invoice #${invoice.invoice_number ?? invoice.id}.` });

    return NextResponse.json({
      success: true,
      message: "Payment recorded successfully.",
    });

  } catch (error) {
    console.error("Payment API Error:", error);

    return NextResponse.json(
      {
        error: "Unexpected server error.",
      },
      { status: 500 }
    );
  }
}
