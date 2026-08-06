import { NextResponse } from "next/server";

import { resend } from "@/lib/resend";
import { adminSupabase } from "@/lib/supabase/admin";
import { triggerAutomation } from "@/lib/automation/automationEngine";

export async function POST(request: Request) {
  try {
    const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const resendKey = process.env.RESEND_API_KEY;
    if (!turnstileSecret || !supabaseUrl || !serviceRoleKey || !resendKey) {
      console.error("Quote form configuration missing:", {
        TURNSTILE_SECRET_KEY: Boolean(turnstileSecret),
        NEXT_PUBLIC_SUPABASE_URL: Boolean(supabaseUrl),
        SUPABASE_SERVICE_ROLE_KEY: Boolean(serviceRoleKey),
        RESEND_API_KEY: Boolean(resendKey),
      });
      return NextResponse.json({ success: false, error: "Quote form is not configured." }, { status: 500 });
    }

    const formData = await request.formData();
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();
    const service = String(formData.get("service") ?? "").trim();
    const propertyType = String(formData.get("propertyType") ?? "").trim();
    const city = String(formData.get("city") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();
    const turnstileToken = String(formData.get("turnstileToken") ?? "");
    const photos = formData.getAll("photos").filter((value): value is File => value instanceof File && value.size > 0);

    if (!name || !email || !phone || !service || !propertyType || !city || !description || !turnstileToken) {
      return NextResponse.json({ success: false, error: "Please complete all required fields." }, { status: 400 });
    }

    const verification = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret: turnstileSecret, response: turnstileToken }),
    });
    const verificationResult = await verification.json() as { success?: boolean };
    if (!verificationResult.success) {
      console.error("Turnstile verification failed for quote form.");
      return NextResponse.json({ success: false, error: "Security verification failed." }, { status: 400 });
    }

    const [firstName, ...lastNameParts] = name.split(/\s+/);
    const lastName = lastNameParts.join(" ") || "Customer";
    const { data: leadNumber, error: leadNumberError } = await adminSupabase.rpc("generate_lead_number");
    if (leadNumberError || !leadNumber) {
      console.error("Lead number generation failed:", leadNumberError);
      return NextResponse.json({ success: false, error: "Unable to create your request." }, { status: 500 });
    }

    const photoRecords = await Promise.all(photos.map(async (photo) => {
      const safeName = photo.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const path = `website/${crypto.randomUUID()}-${safeName}`;
      const { error: uploadError } = await adminSupabase.storage.from("lead-photos").upload(path, photo, { contentType: photo.type, upsert: false });
      if (uploadError) {
        console.error("Lead photo upload failed:", { name: photo.name, error: uploadError });
        throw new Error("Unable to upload lead photo.");
      }
      return { path, name: photo.name, type: photo.type, size: photo.size };
    }));

    const { data: lead, error: leadError } = await adminSupabase.from("leads").insert({
      lead_number: leadNumber,
      first_name: firstName,
      last_name: lastName,
      email,
      phone,
      address: city,
      service_type: service,
      message: `${propertyType} property in ${city}\n\n${description}`,
      photos: photoRecords,
      source: "Website",
      status: "New",
    }).select("id,lead_number").single();
    if (leadError || !lead) {
      console.error("Lead creation failed:", leadError);
      if (photoRecords.length) await adminSupabase.storage.from("lead-photos").remove(photoRecords.map((photo) => photo.path));
      return NextResponse.json({ success: false, error: "Unable to create your request." }, { status: 500 });
    }
    console.info("Website lead created:", { leadId: lead.id, leadNumber: lead.lead_number });

    const { error: createdActivityError } = await adminSupabase.from("lead_activities").insert({
      lead_id: lead.id,
      activity_type: "lead_created",
      description: "Lead submitted through the website quote form.",
    });
    if (createdActivityError) console.error("Lead created activity insert failed:", createdActivityError);
    await triggerAutomation({ event: "lead_created", entityId: lead.id, entityType: "lead", title: `${name} requested ${service}. Phone: ${phone}.`, recipientEmail: email, recipientName: name });

    const attachments = await Promise.all(photos.map(async (photo) => ({
      filename: photo.name,
      content: Buffer.from(await photo.arrayBuffer()).toString("base64"),
    })));
    const { data: emailData, error: emailError } = await resend.emails.send({
      from: "XAREON GROUP <info@xareongroup.com>",
      to: "info@xareongroup.com",
      replyTo: email,
      attachments,
      subject: `New Free Estimate Request - ${name}`,
      html: `<div style="font-family:Arial,sans-serif;max-width:700px;margin:auto;padding:20px"><h1 style="color:#2563eb">XAREON GROUP</h1><h2>New Free Estimate Request</h2><p><strong>Lead:</strong> ${lead.lead_number}</p><p><strong>Name:</strong> ${name}<br/><strong>Email:</strong> ${email}<br/><strong>Phone:</strong> ${phone}<br/><strong>Service:</strong> ${service}<br/><strong>Property:</strong> ${propertyType}<br/><strong>City:</strong> ${city}</p><h3>Project Description</h3><p style="white-space:pre-line">${description}</p></div>`,
    });
    if (emailError) {
      // The request is safely captured even if the notification provider is unavailable.
      console.error("Resend quote notification failed:", emailError);
      return NextResponse.json({ success: true, leadNumber: lead.lead_number, warning: "Request saved; email notification failed." });
    }
    console.info("Quote notification sent:", { leadId: lead.id, emailId: emailData?.id });
    const { error: emailActivityError } = await adminSupabase.from("lead_activities").insert({
      lead_id: lead.id,
      activity_type: "email_sent",
      description: "New lead email notification sent to info@xareongroup.com.",
    });
    if (emailActivityError) console.error("Lead email activity insert failed:", emailActivityError);

    return NextResponse.json({ success: true, leadNumber: lead.lead_number, message: "Estimate request submitted successfully." });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json({ success: false, error: "Internal server error." }, { status: 500 });
  }
}
