import { NextResponse } from "next/server";

import { requireApiRole } from "@/lib/auth/requireApiRole";
import { deleteExpense, updateExpense } from "@/lib/financials/expenseService";
import type { TablesUpdate } from "@/lib/supabase/database.types";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: RouteContext) {
  const access = await requireApiRole(["owner", "admin", "manager", "accounting"]);
  if ("response" in access) return access.response;
  try {
    await updateExpense((await params).id, (await request.json()) as TablesUpdate<"expenses">);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Expense update failed", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to update the expense." }, { status: 400 });
  }
}

export async function DELETE(_: Request, { params }: RouteContext) {
  const access = await requireApiRole(["owner", "admin", "accounting"]);
  if ("response" in access) return access.response;
  try {
    await deleteExpense((await params).id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Expense deletion failed", error);
    return NextResponse.json({ error: "Unable to delete the expense." }, { status: 400 });
  }
}
