"use client";

export default function DownloadContractPDFButton({ id }: { id: string }) {
  async function download() {
    const response = await fetch(`/api/contracts/${id}/pdf`, { method: "POST" });
    if (!response.ok) throw new Error("Unable to create the contract PDF.");
    const url = URL.createObjectURL(await response.blob());
    window.open(url, "_blank", "noopener,noreferrer");
    window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
  }
  return <button type="button" onClick={() => void download()} className="rounded-lg bg-emerald-600 px-4 py-2 font-medium text-white transition hover:bg-emerald-700">Download PDF</button>;
}
