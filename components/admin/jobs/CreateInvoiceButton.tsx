"use client";

import { useState } from "react";

interface Props {
  jobId: string;
}

export default function CreateInvoiceButton({
  jobId,
}: Props) {
  const [loading, setLoading] = useState(false);

  async function createInvoice() {
    try {
      setLoading(true);

      const response = await fetch(
        `/api/jobs/${jobId}/create-invoice`,
        {
          method: "POST",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      window.location.href = `/admin/invoices/${data.invoiceId}`;

    } catch (error) {
      console.error(error);
      alert("Unable to create invoice.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={createInvoice}
      disabled={loading}
      className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
    >
      {loading ? "Creating..." : "Create Invoice"}
    </button>
  );
}