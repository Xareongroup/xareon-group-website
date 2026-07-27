import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

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

  // Create invoice
  const { data: invoice, error: invoiceError } = await supabase
    .from("invoices")
    .insert({
      invoice_number: invoiceNumber,
      customer_id: job.customer_id,
      job_id: job.id,
      status: "Draft",
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

  return NextResponse.json({
    success: true,
    invoiceId: invoice.id,
  });
}