import { adminSupabase } from "@/lib/supabase/admin";

export async function getUpcomingJobs() {
  const supabase = adminSupabase;

  const today = new Date()
    .toISOString()
    .split("T")[0];

  const { data } = await supabase
    .from("jobs")
    .select(`
      *,
      customer:customers(
        first_name,
        last_name
      )
    `)
    .gte("scheduled_date", today)
    .order("scheduled_date")
    .limit(100);

  return data ?? [];
}