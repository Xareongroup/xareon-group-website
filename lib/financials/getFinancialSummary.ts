import { adminSupabase } from "@/lib/supabase/admin";

export interface FinancialSummary { revenue:number; expenses:number; profit:number; paidInvoices:number; outstanding:number; profitMargin:number; }
export async function getFinancialSummary(): Promise<FinancialSummary> {
  const [{ data: invoices, error: invoiceError }, { data: expenses, error: expenseError }] = await Promise.all([
    adminSupabase.from("invoices").select("total,status,balance_due"), adminSupabase.from("expenses").select("amount,status")
  ]);
  if (invoiceError) throw invoiceError; if (expenseError) throw expenseError;
  const rows=invoices ?? []; const revenue=rows.filter(x=>x.status!=="Cancelled").reduce((sum,x)=>sum+Number(x.total ?? 0),0);
  const paidInvoices=rows.filter(x=>x.status==="Paid").length; const outstanding=rows.reduce((sum,x)=>sum+Number(x.balance_due ?? 0),0);
  const totalExpenses=(expenses ?? []).filter(x=>x.status!=="Pending").reduce((sum,x)=>sum+Number(x.amount ?? 0),0); const profit=revenue-totalExpenses;
  return { revenue, expenses:totalExpenses, profit, paidInvoices, outstanding, profitMargin:revenue ? profit/revenue*100 : 0 };
}
