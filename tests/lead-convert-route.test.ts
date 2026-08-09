import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  from: vi.fn(),
  rpc: vi.fn(),
  findCustomerEmailMatches: vi.fn(),
  logCustomerActivity: vi.fn(),
}));

vi.mock("@/lib/auth/requireApiRole", () => ({
  requireApiRole: vi.fn().mockResolvedValue({ user: { id: "owner-user" }, role: "owner" }),
}));

vi.mock("@/lib/supabase/admin", () => ({
  adminSupabase: { from: mocks.from, rpc: mocks.rpc },
}));

vi.mock("@/lib/leads/customerEmailMatches", () => ({
  findCustomerEmailMatches: mocks.findCustomerEmailMatches,
}));

vi.mock("@/lib/activity/logActivity", () => ({
  logCustomerActivity: mocks.logCustomerActivity,
}));

import { POST } from "@/app/api/leads/[id]/convert/route";

const lead = {
  id: "lead-1",
  lead_number: "LEAD-2026-00001",
  first_name: "Test",
  last_name: "Lead",
  email: "testlead@example.com",
  phone: "2025550100",
  address: "123 Main Street",
  message: "TV mounting request",
  photos: [],
  source: "Website",
  converted_customer_id: null,
};

function leadTable() {
  return {
    select: vi.fn().mockReturnValue({
      eq: vi.fn().mockReturnValue({
        single: vi.fn().mockResolvedValue({ data: lead, error: null }),
      }),
    }),
    update: vi.fn().mockReturnValue({
      eq: vi.fn().mockResolvedValue({ error: null }),
    }),
  };
}

function request(body: Record<string, unknown> = {}) {
  return new Request("http://localhost/api/leads/lead-1/convert", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/leads/[id]/convert", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.from.mockImplementation((table: string) => {
      if (table === "leads") return leadTable();
      if (table === "lead_activities") return { insert: vi.fn().mockResolvedValue({ error: null }) };
      if (table === "customers") {
        return {
          insert: vi.fn().mockReturnValue({
            select: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({ data: { id: "customer-new", customer_number: "CUS-2026-00005" }, error: null }),
            }),
          }),
        };
      }
      throw new Error(`Unexpected table: ${table}`);
    });
    mocks.rpc.mockResolvedValue({ data: "CUS-2026-00005", error: null });
    mocks.logCustomerActivity.mockResolvedValue(undefined);
  });

  it("creates a customer when the lead email has no existing customer", async () => {
    mocks.findCustomerEmailMatches.mockResolvedValue([]);

    const response = await POST(request(), { params: Promise.resolve({ id: "lead-1" }) });

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({ success: true, customerId: "customer-new", linkedExistingCustomer: false });
    expect(mocks.rpc).toHaveBeenCalledWith("generate_customer_number");
  });

  it("requests confirmation before linking one existing customer", async () => {
    mocks.findCustomerEmailMatches.mockResolvedValue([
      { id: "customer-existing", customer_number: "CUS-2026-00001", first_name: "Test", last_name: "Customer" },
    ]);

    const response = await POST(request(), { params: Promise.resolve({ id: "lead-1" }) });

    expect(response.status).toBe(409);
    await expect(response.json()).resolves.toMatchObject({ code: "existing_customer", customer: { id: "customer-existing" } });
  });

  it("returns a safe conflict when several customers share the lead email", async () => {
    mocks.findCustomerEmailMatches.mockResolvedValue([
      { id: "customer-1", customer_number: "CUS-2026-00001", first_name: "Test", last_name: "Customer" },
      { id: "customer-2", customer_number: "CUS-2026-00002", first_name: "Test", last_name: "Customer" },
    ]);

    const response = await POST(request(), { params: Promise.resolve({ id: "lead-1" }) });

    expect(response.status).toBe(409);
    await expect(response.json()).resolves.toMatchObject({
      code: "multiple_existing_customers",
      error: "Multiple customer records use this email. Resolve the duplicate customer records before converting this lead.",
    });
    expect(mocks.rpc).not.toHaveBeenCalled();
  });

  it("does not expose lookup errors to the user", async () => {
    mocks.findCustomerEmailMatches.mockRejectedValue(new Error("JSON object requested, multiple rows returned"));

    const response = await POST(request(), { params: Promise.resolve({ id: "lead-1" }) });

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({ error: "Unable to check existing customers." });
  });
});
