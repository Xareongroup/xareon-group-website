import { createClient } from "@/lib/supabase/server";

const money = (value: number) => new Intl.NumberFormat("en-US", { style:"currency", currency:"USD" }).format(value);

export default async function JobProfitabilityCard({ jobId }: { jobId: string }) {
  const supabase = await createClient();
  const [{ data: invoices }, { data: expenses }] = await Promise.all([
    supabase.from("invoices").select("total").eq("job_id", jobId).neq("status", "Cancelled"),
    supabase.from("expenses").select("amount, category:expense_categories(name)").eq("job_id", jobId),
  ]);
  const revenue = (invoices ?? []).reduce((sum, invoice) => sum + Number(invoice.total ?? 0), 0);
  const costs = (expenses ?? []).reduce((sum, expense) => sum + Number(expense.amount ?? 0), 0);
  const profit = revenue - costs;
  const margin = revenue ? (profit / revenue) * 100 : 0;
  return <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><h2 className="mb-5 text-lg font-semibold text-slate-900">Job Profitability</h2><div className="space-y-3 text-sm"><div className="flex justify-between"><span className="text-slate-500">Invoice revenue</span><b>{money(revenue)}</b></div><div className="flex justify-between"><span className="text-slate-500">Total costs</span><b>{money(costs)}</b></div><div className="flex justify-between border-t pt-3"><span className="font-medium">Profit</span><b className={profit >= 0 ? "text-green-700" : "text-red-700"}>{money(profit)}</b></div><div className="flex justify-between"><span className="text-slate-500">Profit margin</span><b>{margin.toFixed(1)}%</b></div></div></div>;
}
