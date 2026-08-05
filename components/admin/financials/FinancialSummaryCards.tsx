import { currency } from "./types";

export default function FinancialSummaryCards({ revenue, paidRevenue, outstanding, expenses, profit }: { revenue: number; paidRevenue: number; outstanding: number; expenses: number; profit: number }) {
  const margin = revenue ? profit / revenue * 100 : 0;
  return <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{[["Total Revenue", currency(revenue)],["Paid Revenue", currency(paidRevenue)],["Outstanding", currency(outstanding)],["Total Expenses", currency(expenses)],["Gross Profit", currency(profit)],["Profit Margin", `${margin.toFixed(1)}%`]].map(([label, value]) => <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-sm text-slate-500">{label}</p><p className="mt-2 text-2xl font-bold text-slate-900">{value}</p></div>)}</div>;
}
