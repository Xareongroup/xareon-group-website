"use client";
import { useState } from "react";

export function EstimateChangeRequest({ estimateId, token }: { estimateId: string; token: string }) {
  const [open, setOpen] = useState(false); const [comment, setComment] = useState(""); const [message, setMessage] = useState("");
  async function submit() { const response = await fetch(`/api/public/estimates/${token}/request-changes`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ estimateId, comment }) }); const result = await response.json(); setMessage(response.ok ? "Your request was sent to XAREON GROUP." : result.error ?? "Unable to send request."); if (response.ok) setComment(""); }
  return <div>{open ? <div className="space-y-3"><textarea className="w-full rounded-lg border p-3 text-sm" value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Tell us what you would like changed." /><button type="button" onClick={submit} className="rounded-lg border border-blue-600 px-4 py-2 text-sm font-semibold text-blue-700">Send Request</button>{message && <p className="text-sm text-slate-600">{message}</p>}</div> : <button type="button" onClick={() => setOpen(true)} className="rounded-lg border border-blue-600 px-4 py-2 text-sm font-semibold text-blue-700">Request Changes</button>}</div>;
}
