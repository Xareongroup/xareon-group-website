import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ requireApiRole: vi.fn(), from: vi.fn(), send: vi.fn() }));
vi.mock("@/lib/auth/requireApiRole", () => ({ requireApiRole: mocks.requireApiRole }));
vi.mock("@/lib/supabase/admin", () => ({ adminSupabase: { from: mocks.from } }));
vi.mock("@react-pdf/renderer", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@react-pdf/renderer")>()),
  renderToBuffer: vi.fn(),
}));
vi.mock("resend", () => ({ Resend: class { emails = { send: mocks.send }; } }));

import { POST } from "@/app/api/invoices/[id]/email/route";

describe("invoice email route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.requireApiRole.mockResolvedValue({ user: { id: "owner" }, role: "owner" });
  });

  it("returns a safe error when the invoice has no customer email", async () => {
    mocks.from
      .mockReturnValueOnce({ select: vi.fn(() => ({ eq: vi.fn(() => ({ single: vi.fn().mockResolvedValue({ data: { id: "invoice-1", customer_id: "customer-1" }, error: null }) })) })) })
      .mockReturnValueOnce({ select: vi.fn(() => ({ eq: vi.fn(() => ({ single: vi.fn().mockResolvedValue({ data: { id: "customer-1", email: null }, error: null }) })) })) });

    const response = await POST(new Request("http://localhost/api/invoices/invoice-1/email", { method: "POST" }), { params: Promise.resolve({ id: "invoice-1" }) });
    await expect(response.json()).resolves.toEqual({ error: "The customer does not have an email address." });
    expect(response.status).toBe(422);
    expect(mocks.send).not.toHaveBeenCalled();
  });
});
