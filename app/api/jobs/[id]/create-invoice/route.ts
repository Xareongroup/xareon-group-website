import { NextResponse } from "next/server";
import { logCustomerActivity } from "@/lib/activity/logActivity";
import { createClient } from "@/lib/supabase/server";
import { triggerAutomation } from "@/lib/automation/automationEngine";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const supabase = await createClient();

  // Load the job
  const { data: job, error: jobError } = await supabase
    .from("jobs")
    .select("*")
    .eq("id", id)
    .single();

  console.log("Job:", job);
  console.log("Job Error:", jobError);

  if (jobError || !job) {
    return NextResponse.json(
      {
        error: jobError?.message ?? "Job not found.",
      },
      { status: 404 }
    );
  }

  // Prevent duplicate invoices
  if (job.invoice_id) {
    return NextResponse.json({
      success: true,
      invoiceId: job.invoice_id,
    });
  }

  // Generate invoice number
  const { data: invoiceNumber, error: numberError } =
    await supabase.rpc("generate_invoice_number");

  console.log("Invoice Number:", invoiceNumber);
  console.log("Invoice Number Error:", numberError);

  if (numberError) {
    return NextResponse.json(
      {
        error: numberError.message,
      },
      { status: 500 }
    );
  }

  const estimate = job.estimate_id
    ? await supabase.from("estimates").select("id,subtotal,tax,total").eq("id", job.estimate_id).single()
    : { data: null, error: null };
  if (estimate.error) {
    return NextResponse.json({ error: estimate.error.message }, { status: 500 });
  }

  const estimateItems = job.estimate_id
    ? await supabase.from("estimate_items").select("description,quantity,unit,unit_price,discount,taxable,total,sort_order").eq("estimate_id", job.estimate_id).order("sort_order")
    : { data: [], error: null };
  if (estimateItems.error) {
    return NextResponse.json({ error: estimateItems.error.message }, { status: 500 });
  }

  // Create invoice from the linked estimate when available, so it carries the
  // approved scope, materials/labor line items, taxes, and discounts forward.
  const { data: invoice, error: invoiceError } = await supabase
    .from("invoices")
    .insert({
      invoice_number: invoiceNumber,
      customer_id: job.customer_id,
      job_id: job.id,
      estimate_id: job.estimate_id,
      status: "Draft",
      subtotal: estimate.data?.subtotal ?? 0,
      tax: estimate.data?.tax ?? 0,
      total: estimate.data?.total ?? 0,
      balance_due: estimate.data?.total ?? 0,
    })
    .select()
    .single();

  console.log("Invoice:", invoice);
  console.log("Invoice Error:", invoiceError);

  if (invoiceError || !invoice) {
    return NextResponse.json(
      {
        error: invoiceError?.message ?? "Unable to create invoice.",
        details: invoiceError,
      },
      { status: 500 }
    );
  }

  if (estimateItems.data?.length) {
    const { error: itemError } = await supabase.from("invoice_items").insert(
      estimateItems.data.map((item) => ({
        invoice_id: invoice.id,
        description: item.description,
        quantity: item.quantity,
        unit: item.unit,
        unit_price: item.unit_price,
        discount: item.discount,
        taxable: item.taxable,
        total: item.total,
        sort_order: item.sort_order,
      })),
    );
    if (itemError) {
      await supabase.from("invoices").delete().eq("id", invoice.id);
      return NextResponse.json({ error: itemError.message }, { status: 500 });
    }
  }

  // Link invoice back to job
  const { error: updateError } = await supabase
    .from("jobs")
    .update({
      invoice_id: invoice.id,
    })
    .eq("id", job.id);

  console.log("Update Error:", updateError);

  if (updateError) {
    return NextResponse.json(
      {
        error: updateError.message,
      },
      { status: 500 }
    );
  }

  await logCustomerActivity(
    supabase,
    job.customer_id,
    "invoice_created",
    "Invoice created from job",
    `Invoice ${invoiceNumber} was created from job ${job.job_number ?? ""}.`.trim(),
    { type: "invoice", id: invoice.id },
  );
  await triggerAutomation({ event: "invoice_created", entityType: "invoice", entityId: invoice.id, customerId: job.customer_id, title: `Invoice #${invoiceNumber} was created for job ${job.job_number ?? ""}.`.trim() });

  return NextResponse.json({
    success: true,
    invoiceId: invoice.id,
  });
}
