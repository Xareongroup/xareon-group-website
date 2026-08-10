"use client";
import DocumentPrintButton from "@/components/documents/DocumentPrintButton";

type PrintInvoiceButtonProps = {
  className?: string;
};

export default function PrintInvoiceButton({ className }: PrintInvoiceButtonProps) {
  return <DocumentPrintButton className={className} label="Print" />;
}
