"use client";

import { useState } from "react";

export default function ExpenseReceiptButton({ expenseId, hasReceipt }: { expenseId: string; hasReceipt: boolean }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function viewReceipt() {
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch(`/api/financials/expenses/${expenseId}/receipt`);
      const result = await response.json() as { url?: string; error?: string };
      if (!response.ok || !result.url) throw new Error(result.error ?? "Receipt is unavailable.");
      window.open(result.url, "_blank", "noopener,noreferrer");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Receipt is unavailable.");
    } finally {
      setLoading(false);
    }
  }

  if (!hasReceipt) return <>—</>;
  return <div className="space-y-2"><button type="button" onClick={() => void viewReceipt()} disabled={loading} className="text-blue-700 hover:underline disabled:text-slate-400">{loading ? "Opening…" : "View receipt"}</button>{message && <p className="text-sm text-red-600">{message}</p>}</div>;
}
