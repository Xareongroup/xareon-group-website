"use client";
import DocumentPrintButton from "@/components/documents/DocumentPrintButton";

type PrintInvoiceButtonProps = {
  className?: string;
  invoiceId?: string;
};

export default function PrintInvoiceButton({ className, invoiceId }: PrintInvoiceButtonProps) {
  if (invoiceId) {
    return <button type="button" onClick={() => window.open(`/admin/invoices/${invoiceId}/preview?print=1`, "_blank", "noopener,noreferrer")} className={className}>Print</button>;
  }

  return <DocumentPrintButton className={className} label="Print" />;
}
