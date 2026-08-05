import Link from "next/link";
import { adminSupabase } from "@/lib/supabase/admin";
import { formatCurrency } from "@/lib/utils/currency";
import { financialPeriods, getFinancialPeriodBounds, type FinancialPeriod } from "@/lib/financials/getFinancialSummary";

const labels = { today: "Today", week: "Weekly", month: "Monthly", quarter: "Quarterly", year: "Annually", ytd: "Year-to-date" } as const;

export default async function PaymentsPage({ searchParams }: { searchParams: Promise<{ period?: string }> }) {
  const { period: requestedPeriod } = await searchParams;
  const period = financialPeriods.includes(requestedPeriod as FinancialPeriod) ? requestedPeriod as FinancialPeriod : "month";
  const { start, end } = getFinancialPeriodBounds(period);
  const { data, error } = await adminSupabase.from("payments").select(`id,amount,payment_date,payment_method,invoice:invoices(id,invoice_number,customer:customers(first_name,last_name))`).gte("payment_date", start).lte("payment_date", end).order("payment_date", { ascending: false });
  if (error) throw error;
  const payments = data ?? [];
  const total = payments.reduce((sum, payment) => sum + Number(payment.amount ?? 0), 0);
  const average = payments.length ? total / payments.length : 0;
  return <div className="mx-auto max-w-7xl space-y-6 px-6 py-8">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><h1 className="text-3xl font-bold text-slate-900">Payments</h1><p className="mt-1 text-slate-600">Recorded payment history for the selected period.</p></div><div className="flex flex-wrap gap-2">{Object.entries(labels).map(([value, label]) => <Link key={value} href={`/admin/payments?period=${value}`} className={`rounded-lg px-3 py-2 text-sm font-medium ${period === value ? "bg-blue-700 text-white" : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"}`}>{label}</Link>)}</div></div>
    <div className="grid gap-4 sm:grid-cols-3"><Metric label="Total payments" value={formatCurrency(total)} /><Metric label="Payment count" value={String(payments.length)} /><Metric label="Average payment" value={formatCurrency(average)} /></div>
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><table className="min-w-full"><thead className="bg-slate-50"><tr className="text-left text-sm font-semibold text-slate-600"><th className="px-6 py-4">Date</th><th className="px-6 py-4">Invoice</th><th className="px-6 py-4">Customer</th><th className="px-6 py-4">Method</th><th className="px-6 py-4 text-right">Amount</th><th className="px-6 py-4 text-right">Actions</th></tr></thead><tbody>{payments.length === 0 ? <tr><td colSpan={6} className="px-6 py-10 text-center text-slate-500">No payments found for this period.</td></tr> : payments.map((payment) => { const invoice = Array.isArray(payment.invoice) ? payment.invoice[0] : payment.invoice; const customer = invoice && (Array.isArray(invoice.customer) ? invoice.customer[0] : invoice.customer); return <tr key={payment.id} className="border-t hover:bg-slate-50"><td className="px-6 py-4">{payment.payment_date ? new Date(payment.payment_date).toLocaleDateString() : "—"}</td><td className="px-6 py-4 font-medium">{invoice?.invoice_number ?? "—"}</td><td className="px-6 py-4">{customer ? `${customer.first_name} ${customer.last_name}` : "Unknown"}</td><td className="px-6 py-4">{payment.payment_method ?? "—"}</td><td className="px-6 py-4 text-right font-semibold text-emerald-600">{formatCurrency(payment.amount)}</td><td className="px-6 py-4 text-right"><Link href={`/admin/payments/${payment.id}`} className="font-medium text-blue-600 hover:text-blue-700">View</Link></td></tr>; })}</tbody></table></div>
  </div>;
}
function Metric({ label, value }: { label: string; value: string }) { return <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-sm text-slate-500">{label}</p><p className="mt-2 text-2xl font-bold text-slate-900">{value}</p></div>; }
