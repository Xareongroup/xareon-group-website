import { NextResponse } from "next/server";
import { requireApiRole } from "@/lib/auth/requireApiRole";
import { adminSupabase } from "@/lib/supabase/admin";

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const access = await requireApiRole(["owner", "admin", "manager", "sales"]);
  if ("response" in access) return access.response;
  const { id } = await params;
  const { data: estimate, error } = await adminSupabase.from("estimates").select("id, status").eq("id", id).single();
  if (error || !estimate) return NextResponse.json({ error: "Estimate not found." }, { status: 404 });
  if (estimate.status !== "Draft") return NextResponse.json({ error: "Only draft estimates can be deleted." }, { status: 409 });
  const { error: deleteError } = await adminSupabase.from("estimates").delete().eq("id", id);
  if (deleteError) {
    console.error("Estimate deletion failed", deleteError);
    return NextResponse.json({ error: "Unable to delete the estimate." }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}
