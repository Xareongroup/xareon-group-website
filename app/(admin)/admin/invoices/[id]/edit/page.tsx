"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

type Option = { id: string; label: string };

export default function EditInvoicePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [customers, setCustomers] = useState<Option[]>([]);
  const [estimates, setEstimates] = useState<Option[]>([]);
  const [jobs, setJobs] = useState<Option[]>([]);
  const [form, setForm] = useState({ customer_id: "", estimate_id: "", job_id: "", status: "Draft", issue_date: "", due_date: "", subtotal: "0", tax: "0", total: "0", balance_due: "0", payment_notes: "" });

  useEffect(() => {
    async function load() {
      const [invoiceResult, customersResult, estimatesResult, jobsResult] = await Promise.all([
        supabase.from("invoices").select("*").eq("id", id).single(),
        supabase.from("customers").select("id,first_name,last_name").order("first_name"),
        supabase.from("estimates").select("id,estimate_number").order("estimate_number"),
        supabase.from("jobs").select("id,job_number,title").order("created_at", { ascending: false }),
      ]);
      if (invoiceResult.error || !invoiceResult.data) { setError(invoiceResult.error?.message ?? "Invoice not found."); setLoading(false); return; }
      const invoice = invoiceResult.data;
      setForm({ customer_id: invoice.customer_id ?? "", estimate_id: invoice.estimate_id ?? "", job_id: invoice.job_id ?? "", status: invoice.status ?? "Draft", issue_date: invoice.issue_date ?? "", due_date: invoice.due_date ?? "", subtotal: String(invoice.subtotal ?? 0), tax: String(invoice.tax ?? 0), total: String(invoice.total ?? 0), balance_due: String(invoice.balance_due ?? 0), payment_notes: invoice.payment_notes ?? "" });
      setCustomers((customersResult.data ?? []).map((customer) => ({ id: customer.id, label: `${customer.first_name} ${customer.last_name}` })));
      setEstimates((estimatesResult.data ?? []).map((estimate) => ({ id: estimate.id, label: `Estimate #${estimate.estimate_number}` })));
      setJobs((jobsResult.data ?? []).map((job) => ({ id: job.id, label: `${job.job_number ?? "Unnumbered job"} · ${job.title ?? ""}` })));
      setLoading(false);
    }
    void load();
  }, [id, supabase]);

  async function save(event: React.FormEvent) {
    event.preventDefault(); setSaving(true); setError("");
    const { error: updateError } = await supabase.from("invoices").update({ customer_id: form.customer_id || null, estimate_id: form.estimate_id || null, job_id: form.job_id || null, status: form.status, issue_date: form.issue_date || null, due_date: form.due_date || null, subtotal: Number(form.subtotal), tax: Number(form.tax), total: Number(form.total), balance_due: Number(form.balance_due), payment_notes: form.payment_notes || null }).eq("id", id);
    setSaving(false);
    if (updateError) return setError(updateError.message);
    router.push(`/admin/invoices/${id}`); router.refresh();
  }

  if (loading) return <div className="p-8 text-slate-500">Loading invoice…</div>;
  if (error && !form.status) return <div className="p-8 text-red-600">{error}</div>;
  const select = (label: string, field: "customer_id" | "estimate_id" | "job_id", options: Option[]) => <label className="block text-sm font-medium text-slate-700">{label}<select value={form[field]} onChange={(event) => setForm({ ...form, [field]: event.target.value })} className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2"><option value="">None</option>{options.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}</select></label>;
  const input = (label: string, field: keyof typeof form, type = "text") => <label className="block text-sm font-medium text-slate-700">{label}<input type={type} value={form[field]} onChange={(event) => setForm({ ...form, [field]: event.target.value })} className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2" /></label>;

  return <form onSubmit={save} className="mx-auto max-w-4xl space-y-6 p-6"><div className="flex items-center justify-between"><div><h1 className="text-3xl font-bold text-slate-900">Edit Invoice</h1><p className="mt-1 text-slate-500">Update existing invoice details.</p></div><div className="flex gap-3"><button type="button" onClick={() => router.push(`/admin/invoices/${id}`)} className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 font-medium text-slate-700">Cancel</button><button disabled={saving} className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white disabled:opacity-60">{saving ? "Saving..." : "Save Changes"}</button></div></div><div className="grid gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-2">{select("Customer", "customer_id", customers)}{select("Estimate", "estimate_id", estimates)}{select("Job", "job_id", jobs)}<label className="block text-sm font-medium text-slate-700">Status<select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })} className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2">{["Draft", "Sent", "Viewed", "Paid", "Partially Paid", "Overdue", "Cancelled"].map((status) => <option key={status}>{status}</option>)}</select></label>{input("Issue date", "issue_date", "date")}{input("Due date", "due_date", "date")}{input("Subtotal", "subtotal", "number")}{input("Tax", "tax", "number")}{input("Total", "total", "number")}{input("Balance due", "balance_due", "number")}<label className="block text-sm font-medium text-slate-700 md:col-span-2">Payment notes<textarea value={form.payment_notes} onChange={(event) => setForm({ ...form, payment_notes: event.target.value })} className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2" rows={4} /></label>{error && <p className="text-sm text-red-600 md:col-span-2">{error}</p>}</div></form>;
}
