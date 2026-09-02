import { NextResponse } from "next/server";

import { resend } from "@/lib/resend";
import { adminSupabase } from "@/lib/supabase/admin";
import { triggerAutomation } from "@/lib/automation/automationEngine";
import {
  escapeHtml,
  ESTIMATE_UPLOAD_LIMITS,
  estimateRequestSchema,
  hasMatchingImageSignature,
  imageExtensionForMime,
  safeDisplayFileName,
} from "@/lib/estimate-request";

const scalarFields = ["name", "email", "phone", "service", "propertyType", "city", "description", "turnstileToken"] as const;
const allowedFormFields = new Set<string>([...scalarFields, "photos"]);

function validationError(error: string, status = 400) {
  return NextResponse.json({ success: false, error }, { status });
}

function isUploadedFile(value: FormDataEntryValue): value is File {
  return typeof value !== "string"
    && typeof value.name === "string"
    && typeof value.type === "string"
    && typeof value.size === "number"
    && typeof value.arrayBuffer === "function"
    && typeof value.slice === "function";
}

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

    const contentType = request.headers.get("content-type") ?? "";
    if (!contentType.toLowerCase().startsWith("multipart/form-data")) return validationError("Expected a multipart form submission.");
    const contentLength = Number(request.headers.get("content-length") ?? 0);
    if (Number.isFinite(contentLength) && contentLength > ESTIMATE_UPLOAD_LIMITS.maxRequestBytes) {
      return validationError("The request is too large.", 413);
    }

    let formData: FormData;
    try {
      formData = await request.formData();
    } catch {
      return validationError("The form submission could not be read.");
    }
    if ([...formData.keys()].some((key) => !allowedFormFields.has(key))) return validationError("The request contains unexpected fields.");
    if (scalarFields.some((field) => formData.getAll(field).length !== 1)) return validationError("The request contains missing or repeated fields.");

    const parsed = estimateRequestSchema.safeParse(Object.fromEntries(scalarFields.map((field) => [field, formData.get(field)])));
    if (!parsed.success) return validationError(parsed.error.issues[0]?.message ?? "Please check the submitted fields.");
    const { name, email, phone, service, propertyType, city, description, turnstileToken } = parsed.data;

    const photoValues = formData.getAll("photos");
    if (photoValues.some((value) => !isUploadedFile(value))) return validationError("Every upload must be a valid image file.");
    const photos = photoValues as File[];
    if (photos.length > ESTIMATE_UPLOAD_LIMITS.maxFiles) return validationError(`Upload no more than ${ESTIMATE_UPLOAD_LIMITS.maxFiles} photos.`);
    if (photos.some((photo) => photo.size === 0)) return validationError("Empty image files are not accepted.");
    if (photos.some((photo) => photo.size > ESTIMATE_UPLOAD_LIMITS.maxFileBytes)) return validationError("Each image must be 4 MB or smaller.", 413);
    if (photos.reduce((total, photo) => total + photo.size, 0) > ESTIMATE_UPLOAD_LIMITS.maxCombinedFileBytes) return validationError("Combined image uploads must be 4 MB or smaller.", 413);
    if (photos.some((photo) => !imageExtensionForMime(photo.type))) return validationError("Only JPG, PNG, and WEBP images are accepted.");
    for (const photo of photos) {
      if (!(await hasMatchingImageSignature(photo))) return validationError("An uploaded image does not match its declared file type.");
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

    const photoRecords = await Promise.all(photos.map(async (photo, index) => {
      const displayName = safeDisplayFileName(photo.name, index);
      const extension = imageExtensionForMime(photo.type);
      const path = `website/${crypto.randomUUID()}${extension}`;
      const { error: uploadError } = await adminSupabase.storage.from("lead-photos").upload(path, photo, { contentType: photo.type, upsert: false });
      if (uploadError) {
        console.error("Lead photo upload failed:", { error: uploadError });
        throw new Error("Unable to upload lead photo.");
      }
      return { path, name: displayName, type: photo.type, size: photo.size };
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

    const attachments = await Promise.all(photos.map(async (photo, index) => ({
      filename: safeDisplayFileName(photo.name, index),
      content: Buffer.from(await photo.arrayBuffer()).toString("base64"),
    })));
    const safe = {
      leadNumber: escapeHtml(String(lead.lead_number)),
      name: escapeHtml(name), email: escapeHtml(email), phone: escapeHtml(phone),
      service: escapeHtml(service), propertyType: escapeHtml(propertyType), city: escapeHtml(city),
      description: escapeHtml(description),
    };
    const { data: emailData, error: emailError } = await resend.emails.send({
      from: "XAREON GROUP <info@xareongroup.com>",
      to: "info@xareongroup.com",
      replyTo: email,
      attachments,
      subject: `New Free Estimate Request - ${name}`,
      html: `<div style="font-family:Arial,sans-serif;max-width:700px;margin:auto;padding:20px"><h1 style="color:#2563eb">XAREON GROUP</h1><h2>New Free Estimate Request</h2><p><strong>Lead:</strong> ${safe.leadNumber}</p><p><strong>Name:</strong> ${safe.name}<br/><strong>Email:</strong> ${safe.email}<br/><strong>Phone:</strong> ${safe.phone}<br/><strong>Service:</strong> ${safe.service}<br/><strong>Property:</strong> ${safe.propertyType}<br/><strong>City:</strong> ${safe.city}</p><h3>Project Description</h3><p style="white-space:pre-line">${safe.description}</p></div>`,
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
