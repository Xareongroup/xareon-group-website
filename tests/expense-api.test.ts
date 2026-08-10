import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  requireApiRole: vi.fn(),
  createExpense: vi.fn(),
  updateExpense: vi.fn(),
  deleteExpense: vi.fn(),
  storageFrom: vi.fn(),
  from: vi.fn(),
}));

vi.mock("@/lib/auth/requireApiRole", () => ({ requireApiRole: mocks.requireApiRole }));
vi.mock("@/lib/financials/expenseService", () => ({
  createExpense: mocks.createExpense,
  updateExpense: mocks.updateExpense,
  deleteExpense: mocks.deleteExpense,
}));
vi.mock("@/lib/supabase/admin", () => ({ adminSupabase: { from: mocks.from, storage: { from: mocks.storageFrom } } }));

import { DELETE, PATCH } from "@/app/api/financials/expenses/[id]/route";
import { POST } from "@/app/api/financials/expenses/route";
import { GET as getReceipt } from "@/app/api/financials/expenses/[id]/receipt/route";

const context = { params: Promise.resolve({ id: "expense-1" }) };

describe("expense server endpoints", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.requireApiRole.mockResolvedValue({ user: { id: "owner-1" }, role: "owner" });
  });

  it("creates expenses through the server handler", async () => {
    mocks.createExpense.mockResolvedValue({ id: "expense-1", expense_number: "EXP-2026-00001" });
    const response = await POST(new Request("http://localhost/api/financials/expenses", { method: "POST", body: JSON.stringify({ description: "Materials" }) }));
    expect(response.status).toBe(201);
    expect(mocks.createExpense).toHaveBeenCalledOnce();
  });

  it("updates and deletes through authorized server handlers", async () => {
    await expect(PATCH(new Request("http://localhost/api/financials/expenses/expense-1", { method: "PATCH", body: JSON.stringify({ description: "Updated", amount: 100 }) }), context)).resolves.toMatchObject({ status: 200 });
    await expect(DELETE(new Request("http://localhost/api/financials/expenses/expense-1", { method: "DELETE" }), context)).resolves.toMatchObject({ status: 200 });
    expect(mocks.updateExpense).toHaveBeenCalledWith("expense-1", expect.any(Object));
    expect(mocks.deleteExpense).toHaveBeenCalledWith("expense-1");
  });

  it("denies unauthenticated expense mutations", async () => {
    mocks.requireApiRole.mockResolvedValue({ response: new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 }) });
    const response = await POST(new Request("http://localhost/api/financials/expenses", { method: "POST", body: "{}" }));
    expect(response.status).toBe(401);
    expect(mocks.createExpense).not.toHaveBeenCalled();
  });

  it("denies receipt access before reading private storage", async () => {
    mocks.requireApiRole.mockResolvedValue({ response: new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 }) });
    const response = await getReceipt(new Request("http://localhost/api/financials/expenses/expense-1/receipt"), context);
    expect(response.status).toBe(403);
    expect(mocks.from).not.toHaveBeenCalled();
    expect(mocks.storageFrom).not.toHaveBeenCalled();
  });
});
