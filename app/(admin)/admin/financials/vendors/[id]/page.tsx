import Link from "next/link";
import { notFound } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { formatCurrency } from "@/lib/utils/currency";

export default async function VendorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: vendor, error } = await supabase.from("vendors").select("*").eq("id", id).single();
  if (error || !vendor) notFound();
  const { data: expenses, error: expensesError } = await supabase
    .from("expenses")
    .select("id, expense_number, date, amount, payment_method, description, category:expense_categories(name)")
    .eq("vendor_id", id)
    .order("date", { ascending: false });
  if (expensesError) throw expensesError;
  const transactions = expenses ?? [];
  const totalPaid = transactions.reduce((total, expense) => total + Number(expense.amount ?? 0), 0);

  return <div className="mx-auto max-w-5xl space-y-6 px-6 py-8">
    <div className="flex items-center justify-between"><div><Link href="/admin/financials/vendors" className="text-sm font-medium text-blue-600">← Vendors / Payees</Link><h1 className="mt-2 text-3xl font-bold">{vendor.name}</h1></div><Link href={`/admin/financials/vendors/${vendor.id}/edit`} className="rounded-xl bg-blue-600 px-4 py-2 font-medium text-white">Edit Vendor</Link></div>
    <dl className="grid gap-5 rounded-2xl border bg-white p-6 shadow-sm md:grid-cols-2"><div><dt className="text-sm text-slate-500">Company</dt><dd>{vendor.company ?? "—"}</dd></div><div><dt className="text-sm text-slate-500">Category</dt><dd>{vendor.category ?? "—"}</dd></div><div><dt className="text-sm text-slate-500">Email</dt><dd>{vendor.email ?? "—"}</dd></div><div><dt className="text-sm text-slate-500">Phone</dt><dd>{vendor.phone ?? "—"}</dd></div><div className="md:col-span-2"><dt className="text-sm text-slate-500">Address</dt><dd>{vendor.address ?? "—"}</dd></div><div className="md:col-span-2"><dt className="text-sm text-slate-500">Notes</dt><dd>{vendor.notes ?? "—"}</dd></div></dl>
    <section className="overflow-hidden rounded-2xl border bg-white shadow-sm"><div className="flex items-center justify-between border-b p-6"><h2 className="text-lg font-semibold">Transactions</h2><p className="font-semibold">Total paid: {formatCurrency(totalPaid)}</p></div><table className="min-w-full"><thead className="bg-slate-50 text-left text-sm text-slate-600"><tr><th className="px-6 py-3">Date</th><th className="px-6 py-3">Expense</th><th className="px-6 py-3">Category</th><th className="px-6 py-3">Payment method</th><th className="px-6 py-3 text-right">Amount</th></tr></thead><tbody>{transactions.length === 0 ? <tr><td colSpan={5} className="px-6 py-10 text-center text-slate-500">No expense transactions recorded.</td></tr> : transactions.map((expense) => { const category = Array.isArray(expense.category) ? expense.category[0] : expense.category; return <tr key={expense.id} className="border-t"><td className="px-6 py-4">{expense.date ? new Date(expense.date).toLocaleDateString() : "—"}</td><td className="px-6 py-4"><Link className="font-medium text-blue-600" href={`/admin/financials/expenses/${expense.id}`}>{expense.expense_number ?? expense.description ?? "Expense"}</Link></td><td className="px-6 py-4">{category?.name ?? "Uncategorized"}</td><td className="px-6 py-4">{expense.payment_method ?? "—"}</td><td className="px-6 py-4 text-right font-semibold">{formatCurrency(Number(expense.amount ?? 0))}</td></tr>; })}</tbody></table></section>
  </div>;
}
