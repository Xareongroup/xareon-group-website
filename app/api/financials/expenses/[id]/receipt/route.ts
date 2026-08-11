import { NextResponse } from "next/server";

import { requireApiRole } from "@/lib/auth/requireApiRole";
import { adminSupabase } from "@/lib/supabase/admin";

type RouteContext = { params: Promise<{ id: string }> };
const receiptRoles = ["owner", "admin", "manager", "accounting"] as const;

async function findExpense(id: string) {
  const { data, error } = await adminSupabase
    .from("expenses")
    .select("id, receipt_url")
    .eq("id", id)
    .single();
  if (error || !data) throw new Error("Expense not found.");
  return data;
}

export async function GET(_: Request, { params }: RouteContext) {
  const access = await requireApiRole([...receiptRoles]);
  if ("response" in access) return access.response;
  try {
    const expense = await findExpense((await params).id);
    if (!expense.receipt_url) return NextResponse.json({ error: "No receipt is attached." }, { status: 404 });
    const { data, error } = await adminSupabase.storage
      .from("expense-receipts")
      .createSignedUrl(expense.receipt_url, 60);
    if (error || !data?.signedUrl) throw new Error("Receipt is unavailable.");
    return NextResponse.json({ url: data.signedUrl });
  } catch (error) {
    console.error("Expense receipt access failed", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Receipt is unavailable." }, { status: 404 });
  }
}

export async function POST(request: Request, { params }: RouteContext) {
  const access = await requireApiRole([...receiptRoles]);
  if ("response" in access) return access.response;
  try {
    const id = (await params).id;
    const expense = await findExpense(id);
    const formData = await request.formData();
    const file = formData.get("file");
    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json({ error: "Select a receipt file to upload." }, { status: 400 });
    }
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "Receipt files must be 10 MB or smaller." }, { status: 400 });
    }

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const path = `expenses/${id}/${crypto.randomUUID()}-${safeName}`;
    const { error: uploadError } = await adminSupabase.storage
      .from("expense-receipts")
      .upload(path, file, { contentType: file.type || "application/octet-stream", upsert: false });
    if (uploadError) throw new Error("Unable to upload the receipt.");

    const { error: updateError } = await adminSupabase
      .from("expenses")
      .update({ receipt_url: path })
      .eq("id", id);
    if (updateError) {
      await adminSupabase.storage.from("expense-receipts").remove([path]);
      throw new Error("Unable to attach the receipt.");
    }

    if (expense.receipt_url) {
      const { error: removeError } = await adminSupabase.storage
        .from("expense-receipts")
        .remove([expense.receipt_url]);
      if (removeError) console.error("Previous expense receipt cleanup failed", removeError);
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Expense receipt upload failed", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to upload the receipt." }, { status: 400 });
  }
}
