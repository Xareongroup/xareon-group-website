import Link from "next/link";
import { notFound } from "next/navigation";

import PaymentForm from "@/components/admin/payments/PaymentForm";
import { adminSupabase } from "@/lib/supabase/admin";
import { formatCurrency } from "@/lib/utils/currency";

export default async function NewPaymentPage({ searchParams }: { searchParams: Promise<{ invoice?: string }> }) {
  const { invoice: invoiceId } = await searchParams;
  const { data: openInvoices, error } = await adminSupabase
    .from("invoices")
    .select("id, invoice_number, total, balance_due, customer:customers(first_name,last_name)")
    .gt("balance_due", 0)
    .neq("status", "Cancelled")
    .order("due_date", { ascending: true });
  if (error) throw error;

  if (!invoiceId) {
    return <div className="mx-auto max-w-4xl space-y-6 px-6 py-8">
      <div><h1 className="text-3xl font-bold">Record Payment</h1><p className="mt-1 text-slate-600">Choose an outstanding invoice to record a deposit, partial, or final payment.</p></div>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {(openInvoices ?? []).length === 0 ? <p className="p-8 text-center text-slate-500">There are no outstanding invoices.</p> : <ul className="divide-y divide-slate-100">{(openInvoices ?? []).map((invoice) => {
          const customer = Array.isArray(invoice.customer) ? invoice.customer[0] : invoice.customer;
          return <li key={invoice.id} className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-semibold">{invoice.invoice_number ?? "Invoice"}</p><p className="text-sm text-slate-600">{customer ? `${customer.first_name} ${customer.last_name}` : "Unknown customer"} · Balance {formatCurrency(Number(invoice.balance_due ?? 0))}</p></div><Link href={`/admin/payments/new?invoice=${invoice.id}`} className="rounded-lg bg-blue-600 px-4 py-2 text-center font-medium text-white hover:bg-blue-700">Select</Link></li>;
        })}</ul>}
      </div>
    </div>;
  }

  const selected = (openInvoices ?? []).find((invoice) => invoice.id === invoiceId);
  if (!selected) notFound();
  const customer = Array.isArray(selected.customer) ? selected.customer[0] : selected.customer;
  return <div className="mx-auto max-w-4xl space-y-6 px-6 py-8"><Link href="/admin/payments/new" className="text-sm font-medium text-blue-600 hover:underline">← Choose another invoice</Link><div><h1 className="text-3xl font-bold">Record Payment</h1><p className="mt-1 text-slate-600">Payments recalculate the invoice balance immediately.</p></div><PaymentForm invoice={{ ...selected, customer: customer ?? null }} /></div>;
}
