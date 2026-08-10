import { NextResponse } from "next/server";
import { requireApiRole } from "@/lib/auth/requireApiRole";
import { adminSupabase } from "@/lib/supabase/admin";

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const access = await requireApiRole(["owner", "admin", "accounting"]);
  if ("response" in access) return access.response;
  const { id } = await params;
  const { data: invoice, error } = await adminSupabase.from("invoices").select("id, status").eq("id", id).single();
  if (error || !invoice) return NextResponse.json({ error: "Invoice not found." }, { status: 404 });
  if (invoice.status !== "Draft") return NextResponse.json({ error: "Only draft invoices can be deleted." }, { status: 409 });
  const { data: payments, error: paymentError } = await adminSupabase.from("payments").select("id").eq("invoice_id", id).limit(1);
  if (paymentError) return NextResponse.json({ error: "Unable to verify invoice payments." }, { status: 500 });
  if (payments?.length) return NextResponse.json({ error: "Invoices with payments cannot be deleted." }, { status: 409 });
  const { error: deleteError } = await adminSupabase.from("invoices").delete().eq("id", id);
  if (deleteError) {
    console.error("Invoice deletion failed", deleteError);
    return NextResponse.json({ error: "Unable to delete the invoice." }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}
