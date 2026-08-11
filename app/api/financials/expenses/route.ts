import { NextResponse } from "next/server";

import { requireApiRole } from "@/lib/auth/requireApiRole";
import { createExpense, type ExpenseInput } from "@/lib/financials/expenseService";

export async function POST(request: Request) {
  const access = await requireApiRole(["owner", "admin", "manager", "accounting"]);
  if ("response" in access) return access.response;

  try {
    const expense = await createExpense((await request.json()) as ExpenseInput);
    return NextResponse.json({ expense }, { status: 201 });
  } catch (error) {
    console.error("Expense creation failed", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to create the expense." }, { status: 400 });
  }
}
