"use client";

export default function DownloadContractPDFButton({ id }: { id: string }) {
  async function download() {
    const response = await fetch(`/api/contracts/${id}/pdf`, { method: "POST" });
    if (!response.ok) throw new Error("Unable to create the contract PDF.");
    const data = await response.json() as { url?: string };
    if (!data.url) throw new Error("Unable to open the contract PDF.");
    window.open(data.url, "_blank", "noopener,noreferrer");
  }
  return <button type="button" onClick={() => void download()} className="rounded-lg bg-emerald-600 px-4 py-2 font-medium text-white transition hover:bg-emerald-700">Download PDF</button>;
}
