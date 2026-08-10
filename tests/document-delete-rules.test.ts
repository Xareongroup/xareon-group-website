import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ requireApiRole: vi.fn(), from: vi.fn() }));
vi.mock("@/lib/auth/requireApiRole", () => ({ requireApiRole: mocks.requireApiRole }));
vi.mock("@/lib/supabase/admin", () => ({ adminSupabase: { from: mocks.from } }));

import { DELETE as deleteEstimate } from "@/app/api/estimates/[id]/route";
import { DELETE as deleteInvoice } from "@/app/api/invoices/[id]/route";
import { DELETE as deleteContract } from "@/app/api/contracts/[id]/route";

const context = { params: Promise.resolve({ id: "document-1" }) };
const request = () => new Request("http://localhost/api/documents/document-1", { method: "DELETE" });

function rowQuery(row: unknown) {
  return {
    select: vi.fn(() => ({
      eq: vi.fn(() => ({ single: vi.fn().mockResolvedValue({ data: row, error: null }) })),
    })),
    delete: vi.fn(() => ({ eq: vi.fn().mockResolvedValue({ error: null }) })),
  };
}

describe("document deletion restrictions", () => {
  beforeEach(() => { vi.clearAllMocks(); mocks.requireApiRole.mockResolvedValue({ user: { id: "owner" }, role: "owner" }); });

  it("blocks non-draft estimates", async () => {
    mocks.from.mockReturnValueOnce(rowQuery({ id: "document-1", status: "Sent" }));
    expect((await deleteEstimate(request(), context)).status).toBe(409);
  });

  it("blocks invoices that already have payments", async () => {
    mocks.from.mockReturnValueOnce(rowQuery({ id: "document-1", status: "Draft" }));
    mocks.from.mockReturnValueOnce({ select: vi.fn(() => ({ eq: vi.fn(() => ({ limit: vi.fn().mockResolvedValue({ data: [{ id: "payment-1" }], error: null }) })) })) });
    expect((await deleteInvoice(request(), context)).status).toBe(409);
  });

  it("blocks signed contracts", async () => {
    mocks.from.mockReturnValueOnce(rowQuery({ id: "document-1", status: "Draft", signed: true, signed_at: "2026-08-09" }));
    expect((await deleteContract(request(), context)).status).toBe(409);
  });
});
