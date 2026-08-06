"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const statuses = ["New", "Contacted", "Estimate Scheduled", "Estimate Sent", "Negotiating", "Converted", "Lost"];
const sources = ["Website", "Google Ads", "Thumbtack", "Angi", "Referral", "Facebook", "Instagram", "Other"];

export interface EditableLead { id: string; first_name: string; last_name: string; email: string; phone: string; address: string | null; service_type: string | null; message: string | null; status: string; source: string; }

export default function LeadEditForm({ lead }: { lead: EditableLead }) {
  const router = useRouter();
  const [values, setValues] = useState({ ...lead, address: lead.address ?? "", service_type: lead.service_type ?? "", message: lead.message ?? "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  function update(name: keyof typeof values, value: string) { setValues((current) => ({ ...current, [name]: value })); }
  async function submit(event: React.FormEvent) { event.preventDefault(); setSaving(true); setError(""); const response = await fetch(`/api/leads/${lead.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values) }); const result = await response.json(); setSaving(false); if (!response.ok) return setError(result.error ?? "Unable to save lead."); router.push(`/admin/leads/${lead.id}`); router.refresh(); }
  return <form onSubmit={submit} className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><div className="grid gap-5 md:grid-cols-2"><Field label="First Name" value={values.first_name} onChange={(value) => update("first_name", value)} required/><Field label="Last Name" value={values.last_name} onChange={(value) => update("last_name", value)} required/><Field label="Email" value={values.email} onChange={(value) => update("email", value)} type="email" required/><Field label="Phone" value={values.phone} onChange={(value) => update("phone", value)} required/><Field label="Address" value={values.address} onChange={(value) => update("address", value)}/><Field label="Service Type" value={values.service_type} onChange={(value) => update("service_type", value)}/><label className="block"><span className="text-sm font-medium">Status</span><select value={values.status} onChange={(event) => update("status", event.target.value)} className="mt-1 w-full rounded-lg border px-3 py-2">{statuses.map((status) => <option key={status}>{status}</option>)}</select></label><label className="block"><span className="text-sm font-medium">Source</span><select value={values.source} onChange={(event) => update("source", event.target.value)} className="mt-1 w-full rounded-lg border px-3 py-2">{sources.map((source) => <option key={source}>{source}</option>)}</select></label></div><label className="block"><span className="text-sm font-medium">Customer Message</span><textarea value={values.message} onChange={(event) => update("message", event.target.value)} rows={6} className="mt-1 w-full rounded-lg border px-3 py-2"/></label>{error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}<div className="flex justify-end gap-3"><button type="button" onClick={() => router.back()} className="rounded-lg border px-4 py-2">Cancel</button><button disabled={saving} className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white disabled:opacity-60">{saving ? "Saving…" : "Save Lead"}</button></div></form>;
}
function Field({ label, value, onChange, type = "text", required = false }: { label: string; value: string; onChange: (value: string) => void; type?: string; required?: boolean }) { return <label className="block"><span className="text-sm font-medium">{label}</span><input type={type} value={value} required={required} onChange={(event) => onChange(event.target.value)} className="mt-1 w-full rounded-lg border px-3 py-2"/></label>; }
