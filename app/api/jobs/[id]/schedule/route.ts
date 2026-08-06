import { NextResponse } from "next/server";

import { logCustomerActivity } from "@/lib/activity/logActivity";
import { requireApiRole } from "@/lib/auth/requireApiRole";
import { createClient } from "@/lib/supabase/server";
import { triggerAutomation } from "@/lib/automation/automationEngine";

type ScheduleRequest = {
  assigned_employee_id?: string | null;
  scheduled_date: string;
  start_time?: string | null;
  end_time?: string | null;
};

function overlaps(start: string, end: string | null, existingStart: string | null, existingEnd: string | null) {
  if (!existingStart) return false;
  const candidateEnd = end || start;
  const scheduledEnd = existingEnd || existingStart;
  return start < scheduledEnd && candidateEnd > existingStart;
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const access = await requireApiRole(["owner", "admin", "manager", "dispatcher"]);
  if ("response" in access) return access.response;

  const { id } = await params;
  const body = await request.json() as ScheduleRequest;
  if (!body.scheduled_date) return NextResponse.json({ error: "A scheduled date is required." }, { status: 400 });
  if (body.end_time && body.start_time && body.end_time <= body.start_time) return NextResponse.json({ error: "End time must be after start time." }, { status: 422 });

  const supabase = await createClient();
  const { data: job, error: jobError } = await supabase
    .from("jobs")
    .select("id,job_number,customer_id,assigned_employee_id,scheduled_date,start_time,end_time")
    .eq("id", id)
    .single();
  if (jobError || !job) return NextResponse.json({ error: "Job not found." }, { status: 404 });

  const employeeId = body.assigned_employee_id === undefined ? job.assigned_employee_id : body.assigned_employee_id;
  const startTime = body.start_time === undefined ? job.start_time : body.start_time;
  const endTime = body.end_time === undefined ? job.end_time : body.end_time;

  if (employeeId && startTime) {
    const weekday = new Date(`${body.scheduled_date}T12:00:00`).getDay();
    const [{ data: availability, error: availabilityError }, { data: employee }] = await Promise.all([
      supabase.from("employee_availability").select("is_available,start_time,end_time").eq("employee_id", employeeId).eq("weekday", weekday).maybeSingle(),
      supabase.from("employees").select("first_name,last_name").eq("id", employeeId).maybeSingle(),
    ]);
    if (availabilityError) return NextResponse.json({ error: availabilityError.message }, { status: 500 });
    const technicianName = employee ? `${employee.first_name} ${employee.last_name}` : "Technician";
    if (availability && (!availability.is_available || !availability.start_time || !availability.end_time || startTime < availability.start_time || (endTime && endTime > availability.end_time))) {
      return NextResponse.json({ error: `Cannot schedule. ${technicianName} is unavailable at the requested time.` }, { status: 422 });
    }

    const { data: assignedJobs, error: conflictQueryError } = await supabase
      .from("jobs")
      .select("id,job_number,start_time,end_time")
      .eq("assigned_employee_id", employeeId)
      .eq("scheduled_date", body.scheduled_date)
      .neq("id", id)
      .in("status", ["Scheduled", "Confirmed", "In Progress"]);
    if (conflictQueryError) return NextResponse.json({ error: conflictQueryError.message }, { status: 500 });
    const conflict = (assignedJobs ?? []).find((candidate) => overlaps(startTime!, endTime ?? null, candidate.start_time, candidate.end_time));
    if (conflict) return NextResponse.json({ error: `Scheduling conflict with job ${conflict.job_number ?? conflict.id}.` }, { status: 409 });
  }

  const { error: updateError } = await supabase.from("jobs").update({
    assigned_employee_id: employeeId,
    scheduled_date: body.scheduled_date,
    start_time: startTime,
    end_time: endTime,
    status: "Scheduled",
  }).eq("id", id);
  if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 });

  const changedEmployee = job.assigned_employee_id !== employeeId;
  const changedSchedule = job.scheduled_date !== body.scheduled_date || job.start_time !== startTime || job.end_time !== endTime;
  if (changedEmployee) await logCustomerActivity(supabase, job.customer_id, "job_assigned", "Technician assignment updated", `Job #${job.job_number ?? id} was assigned to a different technician.`, { type: "job", id });
  if (changedSchedule) await logCustomerActivity(supabase, job.customer_id, "job_assigned", "Job schedule updated", `Job #${job.job_number ?? id} was scheduled for ${body.scheduled_date}${startTime ? ` at ${startTime}` : ""}.`, { type: "job", id });
  if (changedEmployee || changedSchedule) await triggerAutomation({ event: "job_scheduled", entityType: "job", entityId: id, customerId: job.customer_id, title: `Job #${job.job_number ?? id} is scheduled for ${body.scheduled_date}${startTime ? ` at ${startTime}` : ""}.` });

  return NextResponse.json({ success: true });
}
