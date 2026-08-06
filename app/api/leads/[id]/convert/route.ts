import { NextResponse } from "next/server";

import { requireApiRole } from "@/lib/auth/requireApiRole";
import { adminSupabase } from "@/lib/supabase/admin";

export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const access = await requireApiRole(["owner", "admin", "manager"]);
  if ("response" in access) return access.response;
  const { id } = await params;
  const { data: lead, error: leadError } = await adminSupabase.from("leads").select("*").eq("id", id).single();
  if (leadError || !lead) return NextResponse.json({ error: "Lead not found." }, { status: 404 });
  if (lead.converted_customer_id) return NextResponse.json({ customerId: lead.converted_customer_id });

  const { data: customerNumber, error: numberError } = await adminSupabase.rpc("generate_customer_number");
  if (numberError) return NextResponse.json({ error: numberError.message }, { status: 500 });
  const { data: customer, error: customerError } = await adminSupabase.from("customers").insert({
    customer_number: customerNumber,
    first_name: lead.first_name,
    last_name: lead.last_name,
    email: lead.email,
    phone: lead.phone,
    address: lead.address,
    notes: lead.message,
    status: "Active",
  }).select("id").single();
  if (customerError || !customer) return NextResponse.json({ error: customerError?.message ?? "Unable to create customer." }, { status: 500 });

  const { error: updateError } = await adminSupabase.from("leads").update({ converted_customer_id: customer.id, status: "Converted" }).eq("id", id);
  if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 });
  await adminSupabase.from("lead_activities").insert({ lead_id: id, activity_type: "converted", description: `Converted to customer ${customerNumber}.`, created_by: access.user.id });
  return NextResponse.json({ success: true, customerId: customer.id });
}
