import { NextResponse } from "next/server";
import { adminSupabase } from "@/lib/supabase/admin";

interface RouteProps {
  params: Promise<{
    id: string;
  }>;
}

export async function POST(
  request: Request,
  { params }: RouteProps
) {
  const { id } = await params;

  const supabase = adminSupabase;

  // Load estimate
  const { data: estimate, error } = await supabase
    .from("estimates")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !estimate) {
    return NextResponse.json({
      success: false,
      error: error?.message ?? "Estimate not found.",
    });
  }

  // Prevent duplicate conversion
  const { data: existingInvoice } = await supabase
    .from("invoices")
    .select("id")
    .eq("estimate_id", estimate.id)
    .maybeSingle();

  if (existingInvoice) {
    return NextResponse.json({
      success: false,
      alreadyConverted: true,
      invoiceId: existingInvoice.id,
      message: "This estimate has already been converted.",
    });
  }

  // Load estimate items
  const { data: items, error: itemsError } = await supabase
    .from("estimate_items")
    .select("*")
    .eq("estimate_id", id)
    .order("sort_order");

  if (itemsError) {
    return NextResponse.json({
      success: false,
      error: itemsError.message,
    });
  }

  // Generate next invoice number
  const { count: invoiceCount } = await supabase
    .from("invoices")
    .select("id", {
      count: "exact",
      head: true,
    });

  const invoiceNumber = `INV-${String(
    (invoiceCount ?? 0) + 1
  ).padStart(6, "0")}`;

  console.log("Generated Invoice Number:", invoiceNumber);

  // Create invoice
  const { data: invoice, error: invoiceError } = await supabase
    .from("invoices")
    .insert({
      customer_id: estimate.customer_id,
      estimate_id: estimate.id,
      invoice_number: invoiceNumber,
      subtotal: estimate.subtotal,
      tax: estimate.tax,
      total: estimate.total,
      balance_due: estimate.total,
      status: "Draft",
      issued_at: new Date().toISOString(),
      paid_at: null,
    })
    .select()
    .single();

  if (invoiceError || !invoice) {
    return NextResponse.json({
      success: false,
      error: invoiceError?.message ?? "Failed to create invoice.",
    });
  }

  // Copy estimate items
  if (items.length > 0) {
    const invoiceItems = items.map((item) => ({
      invoice_id: invoice.id,
      description: item.description,
      quantity: item.quantity,
      unit: item.unit,
      unit_price: item.unit_price,
      discount: item.discount,
      taxable: item.taxable,
      total: item.total,
      sort_order: item.sort_order,
    }));

    const { error: invoiceItemsError } = await supabase
      .from("invoice_items")
      .insert(invoiceItems);

    if (invoiceItemsError) {
      return NextResponse.json({
        success: false,
        error: invoiceItemsError.message,
      });
    }
  }

  return NextResponse.json({
    success: true,
    invoice,
  });
}