import { describe, expect, it } from "vitest";
import { CUSTOMER_DOCUMENT_TYPES } from "@/lib/documents/recordCustomerDocument";

describe("customer document types", () => {
  it("matches the production customer_documents constraint", () => {
    expect(CUSTOMER_DOCUMENT_TYPES).toEqual([
      "Estimate",
      "Signed Estimate",
      "Contract",
      "Signed Contract",
      "Invoice",
      "Payment Receipt",
    ]);
  });

  it("does not permit legacy lowercase document values", () => {
    expect(CUSTOMER_DOCUMENT_TYPES).not.toContain("estimate");
    expect(CUSTOMER_DOCUMENT_TYPES).not.toContain("contract");
    expect(CUSTOMER_DOCUMENT_TYPES).not.toContain("invoice");
    expect(CUSTOMER_DOCUMENT_TYPES).not.toContain("receipt");
    expect(CUSTOMER_DOCUMENT_TYPES).not.toContain("signed_agreement");
  });
});
