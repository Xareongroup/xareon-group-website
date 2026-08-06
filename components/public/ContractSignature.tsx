"use client";

import { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";

export default function ContractSignature({ contract }: { contract: { signature_token: string | null } }) {
  const signatureRef = useRef<SignatureCanvas>(null);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function signContract() {
    const signature = signatureRef.current?.isEmpty() ? null : signatureRef.current?.getTrimmedCanvas().toDataURL("image/png");
    if (!name.trim() || !signature) return setMessage("Please provide your full name and signature.");
    if (!contract.signature_token) return setMessage("This contract is not ready for signing.");
    try {
      setSaving(true); setMessage("Submitting signature...");
      const response = await fetch(`/api/public/signatures/contract/${contract.signature_token}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: name.trim(), signature }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Unable to sign contract.");
      setMessage("Contract signed. Your signed PDF is available in the portal.");
    } catch (error) {
      console.error("Contract signature failed", error);
      setMessage(error instanceof Error ? error.message : "Unable to sign contract.");
    } finally { setSaving(false); }
  }

  return <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"><h3 className="mb-4 text-xl font-semibold">Customer Approval</h3><p className="mb-5 text-sm text-slate-600">By signing below, you agree to this service contract and authorize XAREON GROUP to perform the described work.</p><label className="mb-2 block text-sm font-medium">Full Name</label><input className="mb-5 w-full rounded-lg border border-slate-300 p-3" placeholder="Enter your full name" value={name} onChange={(event) => setName(event.target.value)} /><label className="mb-2 block text-sm font-medium">Signature</label><div className="overflow-hidden rounded-lg border border-slate-300 bg-white"><SignatureCanvas ref={signatureRef} canvasProps={{ className: "h-48 w-full" }} /></div><button type="button" onClick={() => signatureRef.current?.clear()} className="mt-3 rounded-lg border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50">Clear Signature</button><button type="button" onClick={signContract} disabled={saving} className="mt-5 w-full rounded-lg bg-green-600 px-4 py-3 font-semibold text-white hover:bg-green-700 disabled:bg-slate-400">{saving ? "Submitting..." : "Approve & Sign Contract"}</button>{message && <p className="mt-4 text-sm text-slate-600">{message}</p>}</div>;
}
