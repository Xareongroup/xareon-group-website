import { describe, expect, it, vi } from "vitest";

import { findCustomerEmailMatches } from "@/lib/leads/customerEmailMatches";

function createSupabaseMock(result: { data: unknown[] | null; error: unknown }) {
  const limit = vi.fn().mockResolvedValue(result);
  const order = vi.fn().mockReturnValue({ limit });
  const ilike = vi.fn().mockReturnValue({ order });
  const select = vi.fn().mockReturnValue({ ilike });
  const from = vi.fn().mockReturnValue({ select });

  return { client: { from }, from, select, ilike, order, limit };
}

describe("findCustomerEmailMatches", () => {
  it("returns no customers when the email has no matches", async () => {
    const mock = createSupabaseMock({ data: [], error: null });

    await expect(findCustomerEmailMatches(mock.client as never, "new@example.com")).resolves.toEqual([]);
    expect(mock.ilike).toHaveBeenCalledWith("email", "new@example.com");
    expect(mock.limit).toHaveBeenCalledWith(2);
  });

  it("returns a single existing customer for a single email match", async () => {
    const customer = { id: "customer-1", customer_number: "CUS-2026-00001", first_name: "Ada", last_name: "Lovelace" };
    const mock = createSupabaseMock({ data: [customer], error: null });

    await expect(findCustomerEmailMatches(mock.client as never, "ada@example.com")).resolves.toEqual([customer]);
  });

  it("returns multiple matches for explicit conflict handling", async () => {
    const customers = [
      { id: "customer-1", customer_number: "CUS-2026-00001", first_name: "Ada", last_name: "Lovelace" },
      { id: "customer-2", customer_number: "CUS-2026-00002", first_name: "Ada", last_name: "Lovelace" },
    ];
    const mock = createSupabaseMock({ data: customers, error: null });

    await expect(findCustomerEmailMatches(mock.client as never, "ada@example.com")).resolves.toEqual(customers);
  });

  it("does not convert a database error into a customer match", async () => {
    const mock = createSupabaseMock({ data: null, error: new Error("database unavailable") });

    await expect(findCustomerEmailMatches(mock.client as never, "ada@example.com")).rejects.toThrow("database unavailable");
  });
});
