import { adminSupabase } from "@/lib/supabase/admin";

export interface SearchResult {
  id: string;
  type: "customer" | "invoice" | "job" | "payment";
  title: string;
  subtitle: string;
  href: string;
}

export async function globalSearch(
  query: string
): Promise<SearchResult[]> {
  const supabase = adminSupabase;

  const term = query.trim();

  if (!term) {
    return [];
  }

  const [customers, invoices, jobs] = await Promise.all([
    supabase
      .from("customers")
      .select("id,first_name,last_name")
      .or(`first_name.ilike.%${term}%,last_name.ilike.%${term}%`)
      .limit(5),

    supabase
      .from("invoices")
      .select("id,invoice_number")
      .ilike("invoice_number", `%${term}%`)
      .limit(5),

    supabase
      .from("jobs")
      .select("id,title")
      .ilike("title", `%${term}%`)
      .limit(5),
  ]);

  return [
    ...(customers.data ?? []).map((c) => ({
      id: c.id,
      type: "customer" as const,
      title: `${c.first_name} ${c.last_name}`,
      subtitle: "Customer",
      href: `/admin/customers/${c.id}`,
    })),

    ...(invoices.data ?? []).map((i) => ({
      id: i.id,
      type: "invoice" as const,
      title: i.invoice_number,
      subtitle: "Invoice",
      href: `/admin/invoices/${i.id}`,
    })),

    ...(jobs.data ?? []).map((j) => ({
      id: j.id,
      type: "job" as const,
      title: j.title,
      subtitle: "Job",
      href: `/admin/jobs/${j.id}`,
    })),
  ];
}