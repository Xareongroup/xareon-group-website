import { describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ requireApiRole: vi.fn(), from: vi.fn() }));
vi.mock("@/lib/auth/requireApiRole", () => ({ requireApiRole: mocks.requireApiRole }));
vi.mock("@/lib/supabase/admin", () => ({ adminSupabase: { from: mocks.from, storage: { from: vi.fn() } } }));

import { POST } from "@/app/api/contracts/[id]/pdf/route";

describe("contract PDF authorization", () => {
  it("denies unauthenticated PDF generation before reading contract data", async () => {
    mocks.requireApiRole.mockResolvedValue({ response: new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 }) });
    const response = await POST(new Request("http://localhost/api/contracts/contract-1/pdf", { method: "POST" }), { params: Promise.resolve({ id: "contract-1" }) });
    expect(response.status).toBe(401);
    expect(mocks.from).not.toHaveBeenCalled();
  });
});
