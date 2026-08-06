import Link from "next/link";

import {
  financialPeriods,
  getExpenseReport,
  getFinancialSummary,
  type FinancialPeriod,
} from "@/lib/financials/getFinancialSummary";

const labels = { today: "Today", week: "Weekly", month: "Monthly", quarter: "Quarterly", year: "Annually", ytd: "Year-to-date" } as const;
const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

export default async function FinancialReportsPage({ searchParams }: { searchParams: Promise<{ period?: string }> }) {
  const { period: requestedPeriod } = await searchParams;
  const period = financialPeriods.includes(requestedPeriod as FinancialPeriod) ? requestedPeriod as FinancialPeriod : "month";
  const [summary, expenses] = await Promise.all([getFinancialSummary(period), getExpenseReport(period)]);

  return <div className="mx-auto max-w-7xl space-y-6 px-6 py-8">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><h1 className="text-3xl font-bold text-slate-900">Financial Reports</h1><p className="mt-1 text-slate-600">Server-calculated performance for the selected period.</p></div><div className="flex flex-wrap gap-2">{Object.entries(labels).map(([value, label]) => <Link key={value} href={`/admin/financials/reports?period=${value}`} className={`rounded-lg px-3 py-2 text-sm font-medium ${period === value ? "bg-blue-700 text-white" : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"}`}>{label}</Link>)}</div></div>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><Metric label="Revenue" value={money.format(summary.revenue)} /><Metric label="Payments received" value={money.format(summary.payments)} /><Metric label="Outstanding balance" value={money.format(summary.outstanding)} /><Metric label="Expenses" value={money.format(summary.expenses)} /><Metric label="Net profit" value={money.format(summary.profit)} /><Metric label="Profit margin" value={`${summary.profitMargin.toFixed(1)}%`} /><Metric label="Invoices issued" value={String(summary.invoiceCount)} /><Metric label="Jobs created" value={String(summary.jobCount)} /></div>
    <div className="grid gap-6 lg:grid-cols-2"><Breakdown title="Expense categories" rows={expenses.categories} /><Breakdown title="Vendor spending" rows={expenses.vendors} /></div>
  </div>;
}

function Metric({ label, value }: { label: string; value: string }) { return <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-sm text-slate-500">{label}</p><p className="mt-2 text-2xl font-bold text-slate-900">{value}</p></section>; }
function Breakdown({ title, rows }: { title: string; rows: Array<{ name: string; total: number }> }) { return <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><h2 className="text-lg font-semibold text-slate-900">{title}</h2>{rows.length ? <ul className="mt-4 divide-y divide-slate-100">{rows.map((row) => <li key={row.name} className="flex justify-between py-3 text-sm"><span>{row.name}</span><span className="font-semibold">{money.format(row.total)}</span></li>)}</ul> : <p className="mt-4 text-sm text-slate-500">No expenses recorded for this period.</p>}</section>; }
