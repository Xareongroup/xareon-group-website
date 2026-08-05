import type { Tables } from "@/lib/supabase/database.types";

export type Expense = Tables<"expenses">;
export type Category = Tables<"expense_categories">;
export type Vendor = Tables<"vendors">;
export type JobOption = Pick<Tables<"jobs">, "id" | "job_number" | "title" | "status" | "scheduled_date" | "completed_date">;
export type InvoiceSummary = Pick<Tables<"invoices">, "id" | "total" | "amount_paid" | "balance_due" | "status" | "issue_date" | "job_id">;

export const currency = (value: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value || 0);
