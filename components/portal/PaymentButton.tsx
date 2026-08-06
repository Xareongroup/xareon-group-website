"use client";

import { useState } from "react";

export function PaymentButton({ balanceDue, invoiceId, portalToken }: { balanceDue: number | null; invoiceId: string; portalToken: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const balance = Number(balanceDue ?? 0);
  if (balance <= 0) return null;
  async function pay() {
    setLoading(true); setError("");
    try {
      const response = await fetch("/api/stripe/create-checkout-session", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ invoiceId, portalToken }) });
      const data = await response.json();
      if (!response.ok || !data.url) throw new Error(data.error ?? "Online payment is unavailable.");
      window.location.assign(data.url);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Online payment is unavailable."); setLoading(false); }
  }
  return <div><button type="button" onClick={pay} disabled={loading} className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white disabled:opacity-60">{loading ? "Opening secure checkout…" : `Pay $${balance.toFixed(2)}`}</button>{error && <p role="alert" className="mt-2 text-sm text-red-600">{error}</p>}</div>;
}
