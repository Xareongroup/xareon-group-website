import Link from "next/link";
import type { FinancialSummary } from "@/lib/financials/getFinancialSummary";

const periodLabels = {
  today: "Today",
  week: "Weekly",
  month: "Monthly",
  quarter: "Quarterly",
  year: "Annually",
  ytd: "Year-to-date",
} as const;

const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

export default function FinancialDashboard({ summary }: { summary: FinancialSummary }) {
  const cards = [
    ["Revenue", summary.revenue, `/admin/invoices?from=${summary.startsOn}&to=${summary.endsOn}`],
    ["Payments received", summary.payments, `/admin/payments?from=${summary.startsOn}&to=${summary.endsOn}`],
    ["Expenses", summary.expenses, `/admin/financials/expenses?from=${summary.startsOn}&to=${summary.endsOn}`],
    ["Net profit", summary.profit, `/admin/financials?period=${summary.period}`],
  ] as const;

  return <div className="space-y-6">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div><h1 className="text-2xl font-bold text-slate-900">Financial Dashboard</h1><p className="text-sm text-slate-500">Ledger-based performance for the selected period.</p></div>
      <div className="flex flex-wrap gap-2">{Object.entries(periodLabels).map(([period, label]) => <Link key={period} href={`/admin/financials?period=${period}`} className={`rounded-lg px-3 py-2 text-sm font-medium ${summary.period === period ? "bg-blue-700 text-white" : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"}`}>{label}</Link>)}</div>
    </div>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{cards.map(([label, value, href]) => <Link key={label} href={href} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-300 hover:shadow"><p className="text-sm text-slate-500">{label}</p><p className={`mt-2 text-2xl font-bold ${label === "Net profit" && value < 0 ? "text-red-600" : "text-slate-900"}`}>{money.format(value)}</p></Link>)}</div>
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <div className="rounded-xl border border-slate-200 bg-white p-4"><p className="text-sm text-slate-500">Outstanding invoices</p><p className="mt-1 text-xl font-semibold">{money.format(summary.outstanding)}</p></div>
      <div className="rounded-xl border border-slate-200 bg-white p-4"><p className="text-sm text-slate-500">Invoices issued</p><p className="mt-1 text-xl font-semibold">{summary.invoiceCount}</p></div>
      <div className="rounded-xl border border-slate-200 bg-white p-4"><p className="text-sm text-slate-500">Jobs created</p><p className="mt-1 text-xl font-semibold">{summary.jobCount}</p></div>
      <div className="rounded-xl border border-slate-200 bg-white p-4"><p className="text-sm text-slate-500">Profit margin</p><p className="mt-1 text-xl font-semibold">{summary.profitMargin.toFixed(1)}%</p></div>
    </div>
  </div>;
}
