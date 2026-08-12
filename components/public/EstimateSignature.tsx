"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import SignatureCanvas from "react-signature-canvas";

type EstimateSignatureProps = { estimate: { signature_token: string | null }; portalToken?: string };

export default function EstimateSignature({ estimate, portalToken }: EstimateSignatureProps) {
  const router = useRouter();
  const signatureRef = useRef<SignatureCanvas>(null);
  const redirectTimer = useRef<number | null>(null);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [completed, setCompleted] = useState(false);

  useEffect(() => () => { if (redirectTimer.current) window.clearTimeout(redirectTimer.current); }, []);

  async function approveEstimate() {
    const signature = signatureRef.current?.isEmpty() ? null : signatureRef.current?.getTrimmedCanvas().toDataURL("image/png");
    if (!name.trim() || !signature) return setMessage("Please provide your full name and signature.");
    if (!estimate.signature_token) return setMessage("This estimate is not ready for signing.");

    try {
      setSaving(true); setMessage("Submitting approval...");
      const response = await fetch(`/api/public/signatures/estimate/${estimate.signature_token}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: name.trim(), signature }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Unable to sign estimate.");
      setCompleted(true); setMessage("Thank you! Your estimate has been signed successfully.");
      if (portalToken) redirectTimer.current = window.setTimeout(() => { router.refresh(); router.push(`/portal/${encodeURIComponent(portalToken)}`); }, 2500);
    } catch (error) {
      console.error("Estimate signature failed", error);
      setMessage(error instanceof Error ? error.message : "Unable to approve estimate.");
    } finally { setSaving(false); }
  }

  if (completed) return <div role="status" className="mt-8 rounded-xl border border-green-200 bg-green-50 p-6 text-green-800">{message}{portalToken && <p className="mt-2 text-sm">Returning you to your portal...</p>}</div>;

  return <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"><h3 className="mb-4 text-xl font-semibold">Customer Approval</h3><p className="mb-5 text-sm text-slate-600">By signing below, you approve this estimate and authorize XAREON GROUP to proceed with the work described.</p><label className="mb-2 block text-sm font-medium">Full Name</label><input className="mb-5 w-full rounded-lg border border-slate-300 p-3" placeholder="Enter your full name" value={name} onChange={(event) => setName(event.target.value)} /><label className="mb-2 block text-sm font-medium">Signature</label><div className="overflow-hidden rounded-lg border border-slate-300 bg-white"><SignatureCanvas ref={signatureRef} canvasProps={{ className: "h-48 w-full" }} /></div><button type="button" onClick={() => signatureRef.current?.clear()} className="mt-3 rounded-lg border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50">Clear Signature</button><button type="button" onClick={approveEstimate} disabled={saving} className="mt-5 w-full rounded-lg bg-green-600 px-4 py-3 font-semibold text-white hover:bg-green-700 disabled:bg-slate-400">{saving ? "Submitting..." : "Approve & Sign Estimate"}</button>{message && <p role="alert" className="mt-4 text-sm text-slate-600">{message}</p>}</div>;
}
