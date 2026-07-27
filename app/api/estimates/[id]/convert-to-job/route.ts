import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const supabase = await createClient();

  // 1. Load estimate + customer
  const { data: estimate, error: estimateError } = await supabase
    .from("estimates")
    .select(`
      *,
      customer:customers(
        phone,
        address
      )
    `)
    .eq("id", id)
    .single();

  if (estimateError || !estimate) {
    return NextResponse.json(
      { error: "Estimate not found." },
      { status: 404 }
    );
  }

  // 2. Check if a job already exists
  const { data: existingJob } = await supabase
    .from("jobs")
    .select("id")
    .eq("estimate_id", id)
    .maybeSingle();

  if (existingJob) {
    return NextResponse.json({
      success: true,
      jobId: existingJob.id,
    });
  }

  // 3. Generate job number
  const { data: jobNumber, error: numberError } =
    await supabase.rpc("generate_job_number");

  if (numberError || !jobNumber) {
    return NextResponse.json(
      { error: "Unable to generate job number." },
      { status: 500 }
    );
  }

  // 4. Create job
  const { data: newJob, error: insertError } = await supabase
    .from("jobs")
    .insert({
      job_number: jobNumber,

      customer_id: estimate.customer_id,
      estimate_id: estimate.id,

      title:
        estimate.title ??
        `Job for ${estimate.estimate_number}`,

      description: estimate.description ?? "",

      status: "Scheduled",
      priority: "Normal",

      notes: estimate.notes,

      service_address:
        estimate.customer?.address ?? "",

      customer_phone:
        estimate.customer?.phone ?? "",
    })
    .select("id")
    .single();

  if (insertError) {
    console.error(insertError);

    return NextResponse.json(
      { error: insertError.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    jobId: newJob.id,
  });
}