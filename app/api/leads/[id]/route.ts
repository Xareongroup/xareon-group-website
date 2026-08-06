import { NextResponse } from "next/server";

import { requireApiRole } from "@/lib/auth/requireApiRole";
import { adminSupabase } from "@/lib/supabase/admin";

const statuses = ["New", "Contacted", "Estimate Scheduled", "Estimate Sent", "Negotiating", "Converted", "Lost"];
const sources = ["Website", "Google Ads", "Thumbtack", "Angi", "Referral", "Facebook", "Instagram", "Other"];

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const access = await requireApiRole(["owner", "admin", "manager", "employee"]);
  if ("response" in access) return access.response;
  const { id } = await params;
  const body = await request.json();
  const { data: existing, error: existingError } = await adminSupabase.from("leads").select("status").eq("id", id).single();
  if (existingError || !existing) return NextResponse.json({ error: "Lead not found." }, { status: 404 });
  if (body.status && !statuses.includes(body.status)) return NextResponse.json({ error: "Invalid lead status." }, { status: 400 });
  if (body.source && !sources.includes(body.source)) return NextResponse.json({ error: "Invalid lead source." }, { status: 400 });
  const update = {
    first_name: body.first_name,
    last_name: body.last_name,
    email: body.email,
    phone: body.phone,
    address: body.address || null,
    service_type: body.service_type || null,
    message: body.message || null,
    status: body.status,
    source: body.source,
  };
  const { error } = await adminSupabase.from("leads").update(update).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (body.status && body.status !== existing.status) {
    await adminSupabase.from("lead_activities").insert({ lead_id: id, activity_type: "status_changed", description: `Status changed from ${existing.status} to ${body.status}.`, created_by: access.user.id });
  }
  return NextResponse.json({ success: true });
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const access = await requireApiRole(["owner"]);
  if ("response" in access) return access.response;
  const { id } = await params;
  const { data: lead, error: leadError } = await adminSupabase.from("leads").select("photos").eq("id", id).single();
  if (leadError || !lead) return NextResponse.json({ error: "Lead not found." }, { status: 404 });
  const photos = Array.isArray(lead.photos) ? lead.photos : [];
  const paths = photos.map((photo) => typeof photo === "object" && photo !== null && "path" in photo && typeof photo.path === "string" ? photo.path : null).filter((path): path is string => Boolean(path));
  if (paths.length) {
    const { error: storageError } = await adminSupabase.storage.from("lead-photos").remove(paths);
    if (storageError) return NextResponse.json({ error: storageError.message }, { status: 500 });
  }
  // lead_activities are removed by the database foreign-key cascade.
  const { error } = await adminSupabase.from("leads").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
