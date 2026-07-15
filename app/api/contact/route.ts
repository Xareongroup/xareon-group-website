import { NextResponse } from "next/server";
import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;

if (!apiKey) {
  throw new Error("RESEND_API_KEY is not defined");
}

const resend = new Resend(apiKey);
export async function POST(req: Request) {
  try {
    const { name, email, phone, message } = await req.json();

    await resend.emails.send({
      from: "info@xareongroup.com",
      to: "info@xareongroup.com",
      subject: `New Estimate Request from ${name}`,
      replyTo: email,
      html: `
        <h2>New Estimate Request</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Project:</strong></p>
        <p>${message}</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false },
      { status: 500 }
    );
  }
}