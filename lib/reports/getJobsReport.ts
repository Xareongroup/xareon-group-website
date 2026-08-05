import { adminSupabase } from "@/lib/supabase/admin";
import { getReportStartDate } from "./dateRange";

export interface JobsReport {
  totalJobs: number;
  scheduledJobs: number;
  inProgressJobs: number;
  completedJobs: number;
  cancelledJobs: number;
  highPriorityJobs: number;
  mediumPriorityJobs: number;
  lowPriorityJobs: number;
  completionRate: number;
}

export async function getJobsReport(
  range: string = "30d"
): Promise<JobsReport> {
  const supabase = adminSupabase;

  let query = supabase
    .from("jobs")
    .select("status, priority, created_at");

  const startDate = getReportStartDate(range);

  if (startDate) {
    query = query.gte("created_at", startDate);
  }

  const { data: jobs, error } = await query;

  if (error) {
    throw error;
  }

  const rows = jobs ?? [];

  const totalJobs = rows.length;

  const scheduledJobs = rows.filter(
    (job) => job.status === "Scheduled"
  ).length;

  const inProgressJobs = rows.filter(
    (job) => job.status === "In Progress"
  ).length;

  const completedJobs = rows.filter(
    (job) => job.status === "Completed"
  ).length;

  const cancelledJobs = rows.filter(
    (job) => job.status === "Cancelled"
  ).length;

  const highPriorityJobs = rows.filter(
    (job) => job.priority === "High"
  ).length;

  const mediumPriorityJobs = rows.filter(
    (job) => job.priority === "Medium"
  ).length;

  const lowPriorityJobs = rows.filter(
    (job) => job.priority === "Low"
  ).length;

  const completionRate =
    totalJobs === 0
      ? 0
      : (completedJobs / totalJobs) * 100;

  return {
    totalJobs,
    scheduledJobs,
    inProgressJobs,
    completedJobs,
    cancelledJobs,
    highPriorityJobs,
    mediumPriorityJobs,
    lowPriorityJobs,
    completionRate,
  };
}
