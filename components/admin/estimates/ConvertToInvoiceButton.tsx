"use client";
import { useRouter } from "next/navigation";

interface Props {
  estimateId: string;
}

export default function ConvertToInvoiceButton({
  estimateId,
}: Props) {
  const router = useRouter();

  async function handleConvert() {
    const response = await fetch(
      `/api/estimates/${estimateId}/convert`,
      {
        method: "POST",
      }
    );

    const result = await response.json();

if (result.invoice?.id) {
  router.push(`/admin/invoices/${result.invoice.id}`);
  return;
}

if (result.alreadyConverted) {
  router.push(`/admin/invoices/${result.invoiceId}`);
  return;
}

alert(result.message ?? "Unable to convert estimate.");
  }

  return (
    <button
      onClick={handleConvert}
      className="rounded-lg bg-emerald-600 px-4 py-2 font-medium text-white hover:bg-emerald-700"
    >
      Convert to Invoice
    </button>
  );
}