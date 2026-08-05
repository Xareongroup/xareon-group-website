import { adminSupabase } from "@/lib/supabase/admin";

export const financialPeriods = ["today", "week", "month", "quarter", "year", "ytd"] as const;
export type FinancialPeriod = (typeof financialPeriods)[number];

export interface FinancialSummary {
  period: FinancialPeriod;
  startsOn: string;
  endsOn: string;
  /** Value invoiced during the selected period, excluding cancelled invoices. */
  revenue: number;
  /** Cash recorded in the payments ledger during the selected period. */
  payments: number;
  /** Posted expenses only; pending expenses are intentionally excluded from profit. */
  expenses: number;
  profit: number;
  paidInvoices: number;
  outstanding: number;
  invoiceCount: number;
  jobCount: number;
  expenseCount: number;
  profitMargin: number;
}

export interface ExpenseReport {
  period: FinancialPeriod;
  startsOn: string;
  endsOn: string;
  total: number;
  count: number;
  average: number;
  categories: Array<{ name: string; total: number }>;
  vendors: Array<{ name: string; total: number }>;
}

function dateOnly(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function getFinancialPeriodBounds(period: FinancialPeriod, now = new Date()) {
  const end = new Date(now);
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);

  switch (period) {
    case "week":
      start.setDate(start.getDate() - 6);
      break;
    case "month":
      start.setDate(1);
      break;
    case "quarter":
      start.setMonth(Math.floor(start.getMonth() / 3) * 3, 1);
      break;
    case "year":
    case "ytd":
      start.setMonth(0, 1);
      break;
  }

  return { start: dateOnly(start), end: dateOnly(end) };
}

/**
 * Server-only financial aggregation. Figures are calculated from the source
 * ledgers on every request so the browser never derives accounting totals.
 */
export async function getFinancialSummary(period: FinancialPeriod = "month"): Promise<FinancialSummary> {
  const { start, end } = getFinancialPeriodBounds(period);
  const [invoicesResult, paymentsResult, expensesResult, jobsResult] = await Promise.all([
    adminSupabase.from("invoices").select("id,total,status,balance_due,issue_date").gte("issue_date", start).lte("issue_date", end),
    adminSupabase.from("payments").select("amount,payment_date").gte("payment_date", start).lte("payment_date", end),
    adminSupabase.from("expenses").select("amount,status,date").gte("date", start).lte("date", end),
    adminSupabase.from("jobs").select("id,created_at").gte("created_at", `${start}T00:00:00.000Z`).lte("created_at", `${end}T23:59:59.999Z`),
  ]);

  for (const result of [invoicesResult, paymentsResult, expensesResult, jobsResult]) {
    if (result.error) throw result.error;
  }

  const invoices = invoicesResult.data ?? [];
  const payments = paymentsResult.data ?? [];
  const expenses = expensesResult.data ?? [];
  const revenue = invoices
    .filter((invoice) => invoice.status !== "Cancelled")
    .reduce((total, invoice) => total + Number(invoice.total ?? 0), 0);
  const paymentsReceived = payments.reduce((total, payment) => total + Number(payment.amount ?? 0), 0);
  const postedExpenses = expenses.filter((expense) => expense.status !== "Pending");
  const totalExpenses = postedExpenses.reduce((total, expense) => total + Number(expense.amount ?? 0), 0);
  const profit = revenue - totalExpenses;

  return {
    period,
    startsOn: start,
    endsOn: end,
    revenue,
    payments: paymentsReceived,
    expenses: totalExpenses,
    profit,
    paidInvoices: invoices.filter((invoice) => invoice.status === "Paid").length,
    outstanding: invoices.reduce((total, invoice) => total + Number(invoice.balance_due ?? 0), 0),
    invoiceCount: invoices.length,
    jobCount: jobsResult.data?.length ?? 0,
    expenseCount: postedExpenses.length,
    profitMargin: revenue === 0 ? 0 : (profit / revenue) * 100,
  };
}

/** Server-side expense report; no financial totals are derived in the browser. */
export async function getExpenseReport(period: FinancialPeriod = "month"): Promise<ExpenseReport> {
  const { start, end } = getFinancialPeriodBounds(period);
  const { data, error } = await adminSupabase
    .from("expenses")
    .select("amount,status,date,category:expense_categories(name),vendor:vendors(name)")
    .gte("date", start)
    .lte("date", end)
    .neq("status", "Pending");
  if (error) throw error;

  const rows = data ?? [];
  const categoryTotals = new Map<string, number>();
  const vendorTotals = new Map<string, number>();
  let total = 0;
  for (const expense of rows) {
    const amount = Number(expense.amount ?? 0);
    total += amount;
    const category = Array.isArray(expense.category) ? expense.category[0]?.name : expense.category?.name;
    const vendor = Array.isArray(expense.vendor) ? expense.vendor[0]?.name : expense.vendor?.name;
    categoryTotals.set(category ?? "Uncategorized", (categoryTotals.get(category ?? "Uncategorized") ?? 0) + amount);
    vendorTotals.set(vendor ?? "No vendor", (vendorTotals.get(vendor ?? "No vendor") ?? 0) + amount);
  }
  const byTotal = ([, a]: [string, number], [, b]: [string, number]) => b - a;
  return {
    period, startsOn: start, endsOn: end, total, count: rows.length,
    average: rows.length ? total / rows.length : 0,
    categories: Array.from(categoryTotals.entries()).sort(byTotal).map(([name, categoryTotal]) => ({ name, total: categoryTotal })),
    vendors: Array.from(vendorTotals.entries()).sort(byTotal).map(([name, vendorTotal]) => ({ name, total: vendorTotal })),
  };
}
