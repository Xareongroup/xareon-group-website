import { NextResponse } from "next/server";
import { adminSupabase } from "@/lib/supabase/admin";
import { recalculateInvoice } from "@/lib/invoices/recalculateInvoice";

export async function POST(request: Request) {
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

    // Create the payment
    const { error } = await supabase
      .from("payments")
      .insert({
        invoice_id,
        amount,
        payment_method,
        payment_date,
        reference_number,
        notes,
      });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    // Update invoice totals and status
    await recalculateInvoice(invoice_id);

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