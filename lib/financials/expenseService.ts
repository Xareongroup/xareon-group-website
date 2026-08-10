import "server-only";

import type { Database, TablesInsert, TablesUpdate } from "@/lib/supabase/database.types";
import { adminSupabase } from "@/lib/supabase/admin";

export type ExpenseInput = Omit<TablesInsert<"expenses">, "expense_number">;

type GeneratedCreateExpenseArgs =
  Database["public"]["Functions"]["create_expense_with_number"]["Args"];

// PostgREST-generated function argument types do not currently retain the
// nullable PostgreSQL parameter metadata for this RPC. Keep the correction
// local to the server-side boundary so optional expense relationships remain
// null in PostgreSQL rather than being replaced with sentinel values.
type CreateExpenseArgs = Omit<
  GeneratedCreateExpenseArgs,
  | "p_category_id"
  | "p_vendor_id"
  | "p_customer_id"
  | "p_job_id"
  | "p_employee_id"
  | "p_notes"
> & {
  p_category_id: string | null;
  p_vendor_id: string | null;
  p_customer_id: string | null;
  p_job_id: string | null;
  p_employee_id: string | null;
  p_notes: string | null;
};

const paymentMethods = new Set(["Cash", "Credit Card", "Bank Transfer", "Check"]);
const statuses = new Set(["Paid", "Pending", "Reimbursed"]);

export function validateExpenseInput(input: ExpenseInput): string | null {
  if (!input.description?.trim()) return "Description is required.";
  if (!input.date) return "Expense date is required.";
  if (!Number.isFinite(Number(input.amount)) || Number(input.amount) <= 0) {
    return "Amount must be greater than zero.";
  }
  if (input.payment_method && !paymentMethods.has(input.payment_method)) {
    return "Select a valid payment method.";
  }
  if (input.status && !statuses.has(input.status)) return "Select a valid status.";
  return null;
}

export async function createExpense(input: ExpenseInput) {
  const validationError = validateExpenseInput(input);
  if (validationError) throw new Error(validationError);
  const expenseDate = input.date;
  if (!expenseDate) throw new Error("Expense date is required.");

  const args: CreateExpenseArgs = {
    p_date: expenseDate,
    p_category_id: input.category_id ?? null,
    p_vendor_id: input.vendor_id ?? null,
    p_customer_id: input.customer_id ?? null,
    p_job_id: input.job_id ?? null,
    p_employee_id: input.employee_id ?? null,
    p_description: input.description,
    p_amount: input.amount,
    p_payment_method: input.payment_method ?? "Cash",
    p_status: input.status ?? "Paid",
    p_notes: input.notes ?? null,
  };

  // The local type above reflects the database function's nullable UUID/text
  // parameters. The generated Supabase type marks those arguments as string,
  // so this narrow boundary assertion is required until its generator models
  // nullable function arguments.
  const { data, error } = await adminSupabase
    .rpc("create_expense_with_number", args as GeneratedCreateExpenseArgs)
    .single();
  if (error || !data) {
    console.error("Atomic expense creation failed", error);
    throw new Error(error?.code === "23505" ? "Unable to allocate a unique expense number. Please try again." : "Unable to create the expense.");
  }
  return data;
}

export async function updateExpense(id: string, input: TablesUpdate<"expenses">) {
  const validationError = validateExpenseInput(input as ExpenseInput);
  if (validationError) throw new Error(validationError);
  const { error } = await adminSupabase.from("expenses").update(input).eq("id", id);
  if (error) throw new Error("Unable to update the expense.");
}

export async function deleteExpense(id: string) {
  const { error } = await adminSupabase.from("expenses").delete().eq("id", id);
  if (error) throw new Error("Unable to delete the expense.");
}
