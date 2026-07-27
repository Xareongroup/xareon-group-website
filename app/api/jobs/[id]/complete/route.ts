import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const supabase = await createClient();

  // Verify the job exists
  const { data: job, error: jobError } = await supabase
    .from("jobs")
    .select("id, status")
    .eq("id", id)
    .single();

  if (jobError || !job) {
    return NextResponse.json(
      { error: "Job not found." },
      { status: 404 }
    );
  }

  // Already completed
  if (job.status === "Completed") {
    return NextResponse.json({
      success: true,
    });
  }

  // Update the job
  const { error: updateError } = await supabase
    .from("jobs")
    .update({
      status: "Completed",
      completed_date: new Date().toISOString(),
    })
    .eq("id", id);

  if (updateError) {
    console.error(updateError);

    return NextResponse.json(
      { error: updateError.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
  });
}