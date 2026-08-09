import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import PrintInvoiceButton from "@/components/admin/invoices/PrintInvoiceButton";

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
});
