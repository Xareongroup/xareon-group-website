import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireApiRole } from "@/lib/auth/requireApiRole";
import { logCustomerActivity } from "@/lib/activity/logActivity";
import { triggerAutomation } from "@/lib/automation/automationEngine";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const access = await requireApiRole(["owner", "admin", "manager", "dispatcher"]);
  if ("response" in access) return access.response;
  const { id } = await params;

  const supabase = await createClient();

  // Verify the job exists
  const { data: job, error: jobError } = await supabase
    .from("jobs")
    .select("id, status, customer_id, job_number")
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
  await logCustomerActivity(supabase, job.customer_id, "job_completed", "Job completed", `Job #${job.job_number ?? id} was marked completed.`, { type: "job", id });
  await triggerAutomation({ event: "job_completed", entityType: "job", entityId: id, customerId: job.customer_id, title: `Job #${job.job_number ?? id} has been completed.` });

  return NextResponse.json({
    success: true,
  });
}
