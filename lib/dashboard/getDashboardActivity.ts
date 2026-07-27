import { adminSupabase } from "@/lib/supabase/admin";

export async function getDashboardActivity() {
  const supabase = adminSupabase;

  const [
    paymentsResult,
    invoicesResult,
    jobsResult,
    customersResult,
  ] = await Promise.all([
    supabase
      .from("payments")
      .select(`
        id,
        amount,
        payment_date,
        payment_method,
        invoice:invoices(
          invoice_number,
          customer:customers(
            first_name,
            last_name
          )
        )
      `)
      .order("payment_date", { ascending: false })
      .limit(5),

    supabase
      .from("invoices")
      .select(`
        id,
        invoice_number,
        status,
        total,
        created_at,
        customer:customers(
          first_name,
          last_name
        )
      `)
      .order("created_at", { ascending: false })
      .limit(5),

    supabase
      .from("jobs")
      .select(`
        id,
        title,
        status,
        scheduled_date
      `)
      .order("scheduled_date", { ascending: true })
      .limit(5),

    supabase
      .from("customers")
      .select(`
        id,
        first_name,
        last_name,
        created_at
      `)
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  return {
    recentPayments: paymentsResult.data ?? [],
    recentInvoices: invoicesResult.data ?? [],
    upcomingJobs: jobsResult.data ?? [],
    recentCustomers: customersResult.data ?? [],
  };
}