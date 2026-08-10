import { NextResponse } from "next/server";
import { requireApiRole } from "@/lib/auth/requireApiRole";
import { adminSupabase } from "@/lib/supabase/admin";

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const access = await requireApiRole(["owner", "admin", "manager"]);
  if ("response" in access) return access.response;
  const { id } = await params;
  const { data: contract, error } = await adminSupabase.from("contracts").select("id, status, signed, signed_at").eq("id", id).single();
  if (error || !contract) return NextResponse.json({ error: "Contract not found." }, { status: 404 });
  if (contract.status !== "Draft" || contract.signed || contract.signed_at) {
    return NextResponse.json({ error: "Only unsigned draft contracts can be deleted." }, { status: 409 });
  }
  const { error: deleteError } = await adminSupabase.from("contracts").delete().eq("id", id);
  if (deleteError) {
    console.error("Contract deletion failed", deleteError);
    return NextResponse.json({ error: "Unable to delete the contract." }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}
