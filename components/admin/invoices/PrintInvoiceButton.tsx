"use client";

type PrintInvoiceButtonProps = {
  className?: string;
};

export default function PrintInvoiceButton({ className }: PrintInvoiceButtonProps) {
  return (
    <button type="button" onClick={() => window.print()} className={className}>
      Print
    </button>
  );
}
