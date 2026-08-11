import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  rpc: vi.fn(),
}));

vi.mock("server-only", () => ({}));
vi.mock("@/lib/supabase/admin", () => ({ adminSupabase: { rpc: mocks.rpc } }));

import { createExpense, validateExpenseInput } from "@/lib/financials/expenseService";

const baseExpense = {
  date: "2026-08-09",
  category_id: "category-1",
  vendor_id: "vendor-1",
  customer_id: "customer-1",
  job_id: "job-1",
  employee_id: null,
  description: "Bathroom materials",
  amount: 750,
  payment_method: "Credit Card",
  status: "Paid",
  receipt_url: null,
  notes: "Home Depot materials",
};

describe("expense workflow", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.rpc.mockReturnValue({
      single: vi.fn().mockResolvedValue({ data: { id: "expense-1", expense_number: "EXP-2026-00001" }, error: null }),
    });
  });

  it("creates a linked job expense through the atomic server RPC", async () => {
    await expect(createExpense(baseExpense)).resolves.toEqual({ id: "expense-1", expense_number: "EXP-2026-00001" });
    expect(mocks.rpc).toHaveBeenCalledWith("create_expense_with_number", expect.objectContaining({
      p_job_id: "job-1",
      p_customer_id: "customer-1",
      p_vendor_id: "vendor-1",
      p_amount: 750,
    }));
  });

  it("supports contractor-payment expenses through the existing employee relation", async () => {
    await expect(createExpense({ ...baseExpense, employee_id: "contractor-1", description: "ABC Electric contractor payment" })).resolves.toMatchObject({ expense_number: "EXP-2026-00001" });
  });

  it("rejects invalid amounts before attempting a database write", async () => {
    await expect(createExpense({ ...baseExpense, amount: 0 })).rejects.toThrow("Amount must be greater than zero.");
    expect(mocks.rpc).not.toHaveBeenCalled();
  });

  it("requires a category-ready, valid expense payload", () => {
    expect(validateExpenseInput({ ...baseExpense, description: "" })).toBe("Description is required.");
    expect(validateExpenseInput({ ...baseExpense, payment_method: "Crypto" })).toBe("Select a valid payment method.");
  });

  it("preserves unique numbers returned for simultaneous atomic create requests", async () => {
    mocks.rpc
      .mockReturnValueOnce({ single: vi.fn().mockResolvedValue({ data: { id: "expense-1", expense_number: "EXP-2026-00001" }, error: null }) })
      .mockReturnValueOnce({ single: vi.fn().mockResolvedValue({ data: { id: "expense-2", expense_number: "EXP-2026-00002" }, error: null }) });

    const created = await Promise.all([createExpense(baseExpense), createExpense({ ...baseExpense, description: "Second expense" })]);
    expect(new Set(created.map((expense) => expense.expense_number)).size).toBe(2);
    expect(created.map((expense) => expense.expense_number)).toEqual(["EXP-2026-00001", "EXP-2026-00002"]);
  });

  it("surfaces a duplicate allocation conflict safely", async () => {
    mocks.rpc.mockReturnValue({ single: vi.fn().mockResolvedValue({ data: null, error: { code: "23505" } }) });
    await expect(createExpense(baseExpense)).rejects.toThrow("Unable to allocate a unique expense number. Please try again.");
  });
});
