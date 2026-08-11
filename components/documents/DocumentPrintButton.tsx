"use client";

export default function DocumentPrintButton({ className, label = "Print / Save PDF" }: { className?: string; label?: string }) {
  return <button type="button" onClick={() => window.print()} className={className}>{label}</button>;
}
