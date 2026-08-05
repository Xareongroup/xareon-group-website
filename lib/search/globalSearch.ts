import { adminSupabase } from "@/lib/supabase/admin";

export interface SearchCustomer { id: string; name: string; email: string | null; phone: string | null; }
export interface SearchJob { id: string; job_number: string | null; title: string | null; status: string | null; }
export interface SearchEstimate { id: string; estimate_number: number; status: string; total: number; }
export interface SearchInvoice { id: string; invoice_number: string | null; status: string | null; total: number | null; }
export interface SearchPayment { id: string; amount: number; reference: string | null; }
export interface SearchEmployee { id: string; name: string; role: string; status: string; }
export interface SearchVendor { id: string; name: string; company: string | null; }

export interface GlobalSearchResult {
  customers: SearchCustomer[];
  jobs: SearchJob[];
  estimates: SearchEstimate[];
  invoices: SearchInvoice[];
  payments: SearchPayment[];
  employees: SearchEmployee[];
  vendors: SearchVendor[];
}

const emptyResults = (): GlobalSearchResult => ({ customers: [], jobs: [], estimates: [], invoices: [], payments: [], employees: [], vendors: [] });

export async function globalSearch(query: string): Promise<GlobalSearchResult> {
  const search = query.trim().replace(/[(),.%_]/g, "");
  if (search.length < 2) return emptyResults();
  const estimateFilter = /^\d+$/.test(search)
    ? `estimate_number.eq.${search},estimate_code.ilike.%${search}%`
    : `estimate_code.ilike.%${search}%`;

  const [customersResult, jobsResult, estimatesResult, invoicesResult, paymentsResult, employeesResult, vendorsResult] = await Promise.all([
    adminSupabase.from("customers").select("id,first_name,last_name,email,phone").or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`).limit(5),
    adminSupabase.from("jobs").select("id,job_number,title,status").or(`job_number.ilike.%${search}%,title.ilike.%${search}%`).limit(5),
    adminSupabase.from("estimates").select("id,estimate_number,status,total").or(estimateFilter).limit(5),
    adminSupabase.from("invoices").select("id,invoice_number,status,total").or(`invoice_number.ilike.%${search}%`).limit(5),
    adminSupabase.from("payments").select("id,amount,reference:reference_number").or(`reference_number.ilike.%${search}%`).limit(5),
    adminSupabase.from("employees").select("id,first_name,last_name,role,status").or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%`).limit(5),
    adminSupabase.from("vendors").select("id,name,company").or(`name.ilike.%${search}%,company.ilike.%${search}%`).limit(5),
  ]);

  const error = [customersResult.error, jobsResult.error, estimatesResult.error, invoicesResult.error, paymentsResult.error, employeesResult.error, vendorsResult.error].find(Boolean);
  if (error) throw error;

  return {
    customers: (customersResult.data ?? []).map((customer) => ({ id: customer.id, name: `${customer.first_name} ${customer.last_name}`.trim(), email: customer.email, phone: customer.phone })),
    jobs: jobsResult.data ?? [],
    estimates: estimatesResult.data ?? [],
    invoices: invoicesResult.data ?? [],
    payments: paymentsResult.data ?? [],
    employees: (employeesResult.data ?? []).map((employee) => ({ id: employee.id, name: `${employee.first_name} ${employee.last_name}`, role: employee.role, status: employee.status })),
    vendors: vendorsResult.data ?? [],
  };
}
