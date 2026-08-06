import { NextResponse } from "next/server";

import { requireApiRole } from "@/lib/auth/requireApiRole";
import { logCustomerActivity } from "@/lib/activity/logActivity";
import { adminSupabase } from "@/lib/supabase/admin";

type ConvertLeadRequest = {
  linkExistingCustomer?: boolean;
};

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const access = await requireApiRole(["owner", "admin", "manager"]);
  if ("response" in access) return access.response;
  const { id } = await params;
  const { data: lead, error: leadError } = await adminSupabase.from("leads").select("*").eq("id", id).single();
  if (leadError || !lead) return NextResponse.json({ error: "Lead not found." }, { status: 404 });
  if (lead.converted_customer_id) return NextResponse.json({ customerId: lead.converted_customer_id });

  const body = await request.json().catch(() => ({})) as ConvertLeadRequest;
  const email = lead.email.trim().toLowerCase();
  const { data: existingCustomer, error: existingCustomerError } = await adminSupabase
    .from("customers")
    .select("id, customer_number, first_name, last_name")
    .ilike("email", email)
    .maybeSingle();

  if (existingCustomerError) {
    return NextResponse.json({ error: existingCustomerError.message }, { status: 500 });
  }

  if (existingCustomer && !body.linkExistingCustomer) {
    return NextResponse.json({
      error: "Existing customer found.",
      code: "existing_customer",
      customer: existingCustomer,
    }, { status: 409 });
  }

  let customerId = existingCustomer?.id;
  let customerNumber = existingCustomer?.customer_number ?? null;

  if (!customerId) {
    const { data: generatedCustomerNumber, error: numberError } = await adminSupabase.rpc("generate_customer_number");
    if (numberError || !generatedCustomerNumber) return NextResponse.json({ error: numberError?.message ?? "Unable to generate customer number." }, { status: 500 });

    const photoReferences = Array.isArray(lead.photos) && lead.photos.length
      ? `\n\nLead photo references: ${lead.photos.map((photo) => typeof photo === "object" && photo && "name" in photo ? String(photo.name) : "Uploaded photo").join(", ")}`
      : "";
    const { data: customer, error: customerError } = await adminSupabase.from("customers").insert({
      customer_number: generatedCustomerNumber,
      first_name: lead.first_name,
      last_name: lead.last_name,
      email: lead.email,
      phone: lead.phone,
      address: lead.address,
      notes: `${lead.message ?? ""}${photoReferences}`.trim() || null,
      status: "Active",
    }).select("id, customer_number").single();
    if (customerError || !customer) return NextResponse.json({ error: customerError?.message ?? "Unable to create customer." }, { status: 500 });
    customerId = customer.id;
    customerNumber = customer.customer_number;
  }

  const { error: updateError } = await adminSupabase.from("leads").update({ converted_customer_id: customerId, status: "Converted" }).eq("id", id);
  if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 });
  await adminSupabase.from("lead_activities").insert({ lead_id: id, activity_type: "converted", description: `${existingCustomer ? "Linked to existing" : "Converted to"} customer ${customerNumber ?? customerId}.`, created_by: access.user.id });
  await logCustomerActivity(
    adminSupabase,
    customerId,
    "customer_created",
    existingCustomer ? "Lead linked to existing customer" : "Lead converted to customer",
    `Lead ${lead.lead_number} (${lead.source}) was ${existingCustomer ? "linked" : "converted"}.`,
    { type: "lead", id },
  );
  return NextResponse.json({ success: true, customerId, linkedExistingCustomer: Boolean(existingCustomer) });
}
