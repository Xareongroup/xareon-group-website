import type { Category, Expense, Vendor } from "./types";
import { currency } from "./types";

export default function FinancialCharts({ expenses, categories, vendors }: { expenses: Expense[]; categories: Category[]; vendors: Vendor[] }) {
  const spending = expenses.reduce<Record<string, number>>((totals, expense) => { const vendor = vendors.find((item) => item.id === expense.vendor_id)?.name ?? "No vendor"; totals[vendor] = (totals[vendor] ?? 0) + Number(expense.amount); return totals; }, {});
  return <div className="grid gap-6 md:grid-cols-2"><div className="rounded-2xl border bg-white p-6 shadow-sm"><h2 className="font-semibold">Expenses by Category</h2><ul className="mt-4 space-y-2 text-sm">{categories.map((category) => <li key={category.id} className="flex justify-between"><span>{category.name}</span><span>{currency(expenses.filter((expense) => expense.category_id === category.id).reduce((sum, expense) => sum + Number(expense.amount), 0))}</span></li>)}</ul></div><div className="rounded-2xl border bg-white p-6 shadow-sm"><h2 className="font-semibold">Vendor Spending</h2><ul className="mt-4 space-y-2 text-sm">{Object.entries(spending).map(([vendor, total]) => <li key={vendor} className="flex justify-between"><span>{vendor}</span><span>{currency(total)}</span></li>)}</ul></div></div>;
}
