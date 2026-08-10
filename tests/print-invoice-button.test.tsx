import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import PrintInvoiceButton from "@/components/admin/invoices/PrintInvoiceButton";
import DocumentPrintButton from "@/components/documents/DocumentPrintButton";

describe("PrintInvoiceButton", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("calls the browser print action when clicked", () => {
    const print = vi.spyOn(window, "print").mockImplementation(() => undefined);

    render(<PrintInvoiceButton className="invoice-print-button" />);

    const button = screen.getByRole("button", { name: "Print" });
    expect(button).toHaveClass("invoice-print-button");

    fireEvent.click(button);

    expect(print).toHaveBeenCalledOnce();
  });

  it("uses the shared document print control", () => {
    render(<DocumentPrintButton label="Print Estimate" className="document-print-action" />);
    expect(screen.getByRole("button", { name: "Print Estimate" })).toHaveClass("document-print-action");
  });

  it("keeps invoice documents visible within the shared print isolation boundary", () => {
    const printStyles = readFileSync(join(process.cwd(), "app", "globals.css"), "utf8");
    expect(printStyles).toMatch(/\.document-print,\s*\.document-print \*/);
    expect(printStyles).toMatch(/\.print-area,\s*\.document-print \{/);
  });
});
