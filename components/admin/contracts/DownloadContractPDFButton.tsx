"use client";

import { useState } from "react";

export default function DownloadContractPDFButton({ id }: { id: string }) {
  const [message, setMessage] = useState<string | null>(null);

  async function download() {
    try {
      setMessage(null);
      const response = await fetch(`/api/contracts/${id}/pdf`, { method: "POST" });
      const data = await response.json() as { error?: string; url?: string };
      if (!response.ok || !data.url) throw new Error(data.error ?? "Unable to create the contract PDF.");
      window.open(data.url, "_blank", "noopener,noreferrer");
    } catch (error) {
      console.error("Contract PDF download failed", error);
      setMessage("Unable to generate the contract PDF. Please try again.");
    }
  }
  return <div className="space-y-1"><button type="button" onClick={() => void download()} className="rounded-lg bg-emerald-600 px-4 py-2 font-medium text-white transition hover:bg-emerald-700">Download PDF</button>{message && <p className="text-sm text-red-600" role="alert">{message}</p>}</div>;
}
