import Link from "next/link";
import type { ExpenseReport } from "@/lib/financials/getFinancialSummary";

const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const labels = { today: "Today", week: "Weekly", month: "Monthly", quarter: "Quarterly", year: "Annually", ytd: "Year-to-date" } as const;

export default function ExpenseReportDashboard({ report }: { report: ExpenseReport }) {
  return <div className="mx-auto max-w-7xl space-y-6 px-6 py-8">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><h1 className="text-3xl font-bold text-slate-900">Expenses</h1><p className="mt-1 text-slate-600">Posted expenses for the selected period.</p></div><div className="flex flex-wrap gap-2">{Object.entries(labels).map(([period, label]) => <Link key={period} href={`/admin/financials/expenses?period=${period}`} className={`rounded-lg px-3 py-2 text-sm font-medium ${report.period === period ? "bg-blue-700 text-white" : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"}`}>{label}</Link>)}</div></div>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{[["Total expenses", report.total], ["Expense count", report.count], ["Average expense", report.average], ["Largest category", report.categories[0]?.total ?? 0]].map(([label, value]) => <div key={label as string} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-sm text-slate-500">{label}</p><p className="mt-2 text-2xl font-bold text-slate-900">{typeof value === "number" && String(label).includes("count") ? value : money.format(Number(value))}</p>{label === "Largest category" && <p className="mt-1 text-sm text-slate-500">{report.categories[0]?.name ?? "—"}</p>}</div>)}</div>
    <div className="grid gap-6 lg:grid-cols-2"><Breakdown title="Category breakdown" rows={report.categories} /><Breakdown title="Vendor spending" rows={report.vendors} /></div>
  </div>;
}
function Breakdown({ title, rows }: { title: string; rows: Array<{ name: string; total: number }> }) { return <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><h2 className="text-lg font-semibold text-slate-900">{title}</h2>{rows.length ? <ul className="mt-4 divide-y divide-slate-100">{rows.map((row) => <li key={row.name} className="flex justify-between py-3 text-sm"><span className="text-slate-700">{row.name}</span><span className="font-semibold">{money.format(row.total)}</span></li>)}</ul> : <p className="mt-4 text-sm text-slate-500">No posted expenses in this period.</p>}</section>; }
