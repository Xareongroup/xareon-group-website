import { resend } from "@/lib/resend";
import { NextResponse } from "next/server";
import { adminSupabase } from "@/lib/supabase/admin";

export async function POST(req: Request) {
  try {
    
    const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;

       if (!turnstileSecret) {
      return NextResponse.json(
        { success: false, error: "Missing TURNSTILE_SECRET_KEY" },
        { status: 500 }
      );
    }
    
const formData = await req.formData();

const name = formData.get("name") as string;
const email = formData.get("email") as string;
const phone = formData.get("phone") as string;
const service = formData.get("service") as string;
const propertyType = formData.get("propertyType") as string;
const city = formData.get("city") as string;
const description = formData.get("description") as string;
const turnstileToken = formData.get("turnstileToken") as string;

const photos = formData.getAll("photos") as File[];
console.log("Number of uploaded photos:", photos.length);

photos.forEach((photo) => {
  console.log(photo.name, photo.size, photo.type);
});

    const [firstName, ...lastNameParts] = name.trim().split(/\s+/);
    const lastName = lastNameParts.join(" ") || "Customer";
    const { data: leadNumber, error: leadNumberError } = await adminSupabase.rpc("generate_lead_number");
    if (leadNumberError) throw leadNumberError;

    const photoRecords = await Promise.all(photos.filter((photo) => photo.size > 0).map(async (photo) => {
      const safeName = photo.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const path = `website/${crypto.randomUUID()}-${safeName}`;
      const { error: uploadError } = await adminSupabase.storage.from("lead-photos").upload(path, photo, { contentType: photo.type, upsert: false });
      if (uploadError) throw uploadError;
      return { path, name: photo.name, type: photo.type, size: photo.size };
    }));

    const { data: lead, error: leadError } = await adminSupabase
      .from("leads")
      .insert({
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
      })
      .select("id")
      .single();
    if (leadError || !lead) throw leadError ?? new Error("Unable to create lead.");

    await adminSupabase.from("lead_activities").insert({ lead_id: lead.id, activity_type: "lead_created", description: "Lead submitted through the website quote form." });

    // Validate required fields
    if (
      !name ||
      !email ||
      !phone ||
      !service ||
      !propertyType ||
      !city ||
      !description ||
      !turnstileToken
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Please complete all required fields.",
        },
        { status: 400 }
      );
    }

    // Verify Turnstile token
    const verifyResponse = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          secret: turnstileSecret,
          response: turnstileToken,
        }),
      }
    );

    const verifyResult = await verifyResponse.json();

    if (!verifyResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Security verification failed.",
        },
        { status: 400 }
      );
    }
const attachments = await Promise.all(
  photos.map(async (photo) => {
    const buffer = Buffer.from(await photo.arrayBuffer());

    return {
      filename: photo.name,
      content: buffer.toString("base64"),
    };
  })
);
    const { data, error } = await resend.emails.send({
      from: "XAREON GROUP <info@xareongroup.com>",
      to: "info@xareongroup.com",
      replyTo: email,
      attachments,
      subject: `New Free Estimate Request - ${name}`,

      html: `
        <div style="font-family:Arial,sans-serif;max-width:700px;margin:auto;padding:20px">

          <h1 style="color:#2563eb;margin-bottom:0;">
            XAREON GROUP
          </h1>

          <p style="margin-top:5px;color:#666;">
            Shield of Integrity
          </p>

          <hr>

          <h2>New Free Estimate Request</h2>

          <table style="width:100%;border-collapse:collapse">

            <tr>
              <td style="padding:8px;font-weight:bold;">Name</td>
              <td>${name}</td>
            </tr>

            <tr>
              <td style="padding:8px;font-weight:bold;">Email</td>
              <td>${email}</td>
            </tr>

            <tr>
              <td style="padding:8px;font-weight:bold;">Phone</td>
              <td>${phone}</td>
            </tr>

            <tr>
              <td style="padding:8px;font-weight:bold;">Service</td>
              <td>${service}</td>
            </tr>

            <tr>
              <td style="padding:8px;font-weight:bold;">Property Type</td>
              <td>${propertyType}</td>
            </tr>

            <tr>
              <td style="padding:8px;font-weight:bold;">City</td>
              <td>${city}</td>
            </tr>

          </table>

          <hr>

          <h3>Project Description</h3>

          <p style="white-space:pre-line;">
            ${description}
          </p>

        </div>
      `,
    });

    if (error) {
      console.error("Resend Error:", error);

      return NextResponse.json(
        {
          success: false,
          error: "Unable to send email.",
        },
        { status: 500 }
      );
    }

    await adminSupabase.from("lead_activities").insert({ lead_id: lead.id, activity_type: "email_sent", description: "New lead email notification sent to info@xareongroup.com." });

    console.log("Email sent:", data);

    return NextResponse.json({
      success: true,
      message: "Estimate request submitted successfully.",
    });

  } catch (error) {
    console.error("Contact API Error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error.",
      },
      {
        status: 500,
      }
    );
  }
}
