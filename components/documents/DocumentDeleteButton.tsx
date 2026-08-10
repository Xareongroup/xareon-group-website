"use client";

import { useState } from "react";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

type DocumentKind = "estimates" | "invoices" | "contracts";

export default function DocumentDeleteButton({ kind, id, label, onDeleted }: { kind: DocumentKind; id: string; label: string; onDeleted?: () => void }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  async function remove() {
    setLoading(true);
    setMessage(null);
    try {
      const response = await fetch(`/api/${kind}/${id}`, { method: "DELETE" });
      const body = await response.json() as { error?: string };
      if (!response.ok) throw new Error(body.error ?? "Unable to delete this document.");
      setOpen(false);
      onDeleted?.();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to delete this document.");
    } finally {
      setLoading(false);
    }
  }
  return <><button type="button" onClick={() => setOpen(true)} className="inline-flex min-h-11 items-center justify-center rounded-lg border border-red-300 px-4 text-sm font-medium text-red-700 transition hover:bg-red-50">Delete</button>{message && <p className="text-sm text-red-600" role="alert">{message}</p>}<ConfirmDialog open={open} title={`Delete ${label}?`} description="This cannot be undone. Deletion is allowed only when this document is still an eligible draft." confirmText="Delete" loading={loading} onConfirm={() => void remove()} onCancel={() => setOpen(false)} /></>;
}
