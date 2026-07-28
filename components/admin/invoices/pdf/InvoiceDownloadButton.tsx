"use client";

import { PDFDownloadLink } from "@react-pdf/renderer";

import InvoicePDF from "./InvoicePDF";

import {
  InvoicePdfData,
  InvoicePdfItem,
} from "@/types/invoicePdf";

interface Props {
  invoice: InvoicePdfData;
  items: InvoicePdfItem[];
}

export default function InvoiceDownloadButton({
  invoice,
  items,
}: Props) {
  return (
    <PDFDownloadLink
      document={
        <InvoicePDF
          invoice={invoice}
          items={items}
        />
      }
      fileName={`${invoice.invoice_number}.pdf`}
    >
      {({ loading }) => (
        <button
          className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 font-medium transition hover:bg-slate-50 disabled:opacity-60"
          disabled={loading}
        >
          {loading
            ? "Preparing PDF..."
            : "Download PDF"}
        </button>
      )}
    </PDFDownloadLink>
  );
}