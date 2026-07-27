import { NextResponse } from "next/server";

import { adminSupabase } from "@/lib/supabase/admin";
import { recalculateInvoice } from "@/lib/invoices/recalculateInvoice";

interface RouteProps {
  params: Promise<{
    id: string;
  }>;
}

export async function PUT(
  request: Request,
  { params }: RouteProps
) {
  try {
    const { id } = await params;

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
    if (!invoice_id || amount == null) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    const supabase = adminSupabase;

    // Update payment
    const { error } = await supabase
      .from("payments")
      .update({
        amount,
        payment_method,
        payment_date,
        reference_number,
        notes,
      })
      .eq("id", id);

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    // Refresh invoice totals and status
    await recalculateInvoice(invoice_id);

    return NextResponse.json({
      success: true,
      message: "Payment updated successfully.",
    });
  } catch (error) {
    console.error("PUT /api/payments/[id]", error);

    return NextResponse.json(
      {
        error: "Unexpected server error.",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: RouteProps
) {
  try {
    const { id } = await params;

    const supabase = adminSupabase;

    // Load the payment so we know which invoice to update
    const { data: payment, error: paymentError } = await supabase
      .from("payments")
      .select("invoice_id")
      .eq("id", id)
      .single();

    if (paymentError || !payment) {
      return NextResponse.json(
        { error: "Payment not found." },
        { status: 404 }
      );
    }

    // Delete the payment
    const { error } = await supabase
      .from("payments")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    // Refresh invoice totals and status
    await recalculateInvoice(payment.invoice_id);

    return NextResponse.json({
      success: true,
      message: "Payment deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE /api/payments/[id]", error);

    return NextResponse.json(
      {
        error: "Unexpected server error.",
      },
      { status: 500 }
    );
  }
}