"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const statuses = ["New", "Contacted", "Estimate Scheduled", "Estimate Sent", "Negotiating", "Converted", "Lost"];

export default function LeadActions({ leadId, status }: { leadId: string; status: string }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [nextStatus, setNextStatus] = useState(status);

  async function updateStatus() {
    if (nextStatus === status) return;
    setSaving(true);
    const response = await fetch(`/api/leads/${leadId}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: nextStatus }) });
    const result = await response.json();
    setSaving(false);
    if (!response.ok) return window.alert(result.error ?? "Unable to change lead status.");
    router.refresh();
  }
  async function deleteLead() {
    if (!window.confirm("Delete this lead, its activity history, and uploaded photos? This cannot be undone.")) return;
    setSaving(true);
    const response = await fetch(`/api/leads/${leadId}`, { method: "DELETE" });
    const result = await response.json();
    setSaving(false);
    if (!response.ok) return window.alert(result.error ?? "Unable to delete lead.");
    router.push("/admin/leads");
    router.refresh();
  }
  return <div className="flex flex-wrap gap-2"><select value={nextStatus} onChange={(event) => setNextStatus(event.target.value)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm">{statuses.map((item) => <option key={item}>{item}</option>)}</select><button type="button" onClick={updateStatus} disabled={saving || nextStatus === status} className="rounded-lg border px-3 py-2 text-sm font-medium hover:bg-slate-50 disabled:opacity-50">Change Status</button><button type="button" onClick={deleteLead} disabled={saving} className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-50">Delete Lead</button></div>;
}
