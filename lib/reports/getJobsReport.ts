import { adminSupabase } from "@/lib/supabase/admin";

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

function getStartDate(range: string): string | null {
  const now = new Date();

  switch (range) {
    case "today":
      now.setHours(0, 0, 0, 0);
      return now.toISOString();

    case "30d":
      now.setDate(now.getDate() - 30);
      return now.toISOString();

    case "90d":
      now.setDate(now.getDate() - 90);
      return now.toISOString();

    case "year":
      return new Date(now.getFullYear(), 0, 1).toISOString();

    default:
      return null;
  }
}

export async function getJobsReport(
  range: string = "30d"
): Promise<JobsReport> {
  const supabase = adminSupabase;

  let query = supabase
    .from("jobs")
    .select("status, priority, created_at");

  const startDate = getStartDate(range);

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