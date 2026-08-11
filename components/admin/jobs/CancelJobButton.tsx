"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CancelJobButton({ jobId }: { jobId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function cancelJob() {
    if (!window.confirm("Cancel this job? Its record and history will be preserved.")) return;
    setLoading(true);
    const response = await fetch(`/api/jobs/${jobId}/cancel`, { method: "POST" });
    const result = await response.json();
    setLoading(false);
    if (!response.ok) return window.alert(result.error ?? "Unable to cancel job.");
    router.refresh();
  }

  return <button type="button" onClick={cancelJob} disabled={loading} className="min-h-11 rounded-lg border border-red-200 px-4 py-2 font-medium text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60">
    {loading ? "Cancelling…" : "Cancel Job"}
  </button>;
}
