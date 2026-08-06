import { describe, expect, it, vi } from "vitest";
import { getNextDocumentNumber } from "@/lib/documentNumbers";

describe("customer number generation", () => {
  it("uses the dedicated customer generator instead of the legacy sequences ledger", async () => {
    const rpc = vi.fn().mockResolvedValue({ data: "CUS-2026-00001", error: null });
    await expect(getNextDocumentNumber({ rpc } as never, "customer")).resolves.toBe("CUS-2026-00001");
    expect(rpc).toHaveBeenCalledWith("generate_customer_number");
  });
});
