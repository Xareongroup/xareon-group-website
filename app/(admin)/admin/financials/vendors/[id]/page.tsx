import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function VendorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: vendor, error } = await supabase.from("vendors").select("*").eq("id", id).single();
  if (error || !vendor) notFound();
  return <div className="mx-auto max-w-3xl space-y-6 px-6 py-8"><div className="flex items-center justify-between"><div><Link href="/admin/financials/vendors" className="text-sm font-medium text-blue-600">← Vendors / Payees</Link><h1 className="mt-2 text-3xl font-bold">{vendor.name}</h1></div><Link href={`/admin/financials/vendors/${vendor.id}/edit`} className="rounded-xl bg-blue-600 px-4 py-2 font-medium text-white">Edit Vendor</Link></div><dl className="grid gap-5 rounded-2xl border bg-white p-6 shadow-sm md:grid-cols-2"><div><dt className="text-sm text-slate-500">Company</dt><dd>{vendor.company ?? "—"}</dd></div><div><dt className="text-sm text-slate-500">Category</dt><dd>{vendor.category ?? "—"}</dd></div><div><dt className="text-sm text-slate-500">Email</dt><dd>{vendor.email ?? "—"}</dd></div><div><dt className="text-sm text-slate-500">Phone</dt><dd>{vendor.phone ?? "—"}</dd></div><div className="md:col-span-2"><dt className="text-sm text-slate-500">Address</dt><dd>{vendor.address ?? "—"}</dd></div><div className="md:col-span-2"><dt className="text-sm text-slate-500">Notes</dt><dd>{vendor.notes ?? "—"}</dd></div></dl></div>;
}
