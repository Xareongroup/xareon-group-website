import { NextResponse } from "next/server";

import { logCustomerActivity } from "@/lib/activity/logActivity";
import { requireApiRole } from "@/lib/auth/requireApiRole";
import { createClient } from "@/lib/supabase/server";

export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const access = await requireApiRole(["owner", "admin", "manager", "dispatcher"]);
  if ("response" in access) return access.response;

  const { id } = await params;
  const supabase = await createClient();
  const { data: job, error: jobError } = await supabase
    .from("jobs")
    .select("id, job_number, customer_id, status")
    .eq("id", id)
    .single();
  if (jobError || !job) return NextResponse.json({ error: "Job not found." }, { status: 404 });
  if (job.status === "Completed") return NextResponse.json({ error: "Completed jobs cannot be cancelled." }, { status: 409 });

  const { error } = await supabase.from("jobs").update({ status: "Cancelled" }).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await logCustomerActivity(
    supabase,
    job.customer_id,
    "job_cancelled",
    "Job cancelled",
    `Job #${job.job_number ?? id} was cancelled.`,
    { type: "job", id },
  );
  return NextResponse.json({ success: true });
}
