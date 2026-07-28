import { adminSupabase } from "@/lib/supabase/admin";

export interface SearchCustomer {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
}

export interface SearchJob {
  id: string;
  job_number: string | null;
  title: string | null;
  status: string | null;
}

export interface SearchInvoice {
  id: string;
  invoice_number: string | null;
  status: string | null;
  total: number | null;
}

export interface SearchPayment {
  id: string;
  amount: number | null;
  reference: string | null;
}

export interface GlobalSearchResult {
  customers: SearchCustomer[];
  jobs: SearchJob[];
  invoices: SearchInvoice[];
  payments: SearchPayment[];
}

export async function globalSearch(
  query: string
): Promise<GlobalSearchResult> {
  const search = query.trim();

  if (search.length < 2) {
    return {
      customers: [],
      jobs: [],
      invoices: [],
      payments: [],
    };
  }

  const supabase = adminSupabase;

  const [
    customersResult,
    jobsResult,
    invoicesResult,
    paymentsResult,
  ] = await Promise.all([
    supabase
      .from("customers")
      .select("id,name,email,phone")
      .or(
        `name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`
      )
      .limit(5),

    supabase
      .from("jobs")
      .select("id,job_number,title,status")
      .or(
        `job_number.ilike.%${search}%,title.ilike.%${search}%`
      )
      .limit(5),

    supabase
      .from("invoices")
      .select("id,invoice_number,status,total")
      .or(
        `invoice_number.ilike.%${search}%`
      )
      .limit(5),

    supabase
      .from("payments")
      .select("id,amount,reference")
      .or(
        `reference.ilike.%${search}%`
      )
      .limit(5),
  ]);

  return {
    customers: customersResult.data ?? [],
    jobs: jobsResult.data ?? [],
    invoices: invoicesResult.data ?? [],
    payments: paymentsResult.data ?? [],
  };
}