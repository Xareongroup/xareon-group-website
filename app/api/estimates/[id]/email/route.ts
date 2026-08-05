import { NextResponse } from "next/server";
import { renderEstimatePdf } from "@/lib/pdf/renderEstimatePdf";

import { createClient } from "@/lib/supabase/server";
import { resend } from "@/lib/resend";

interface RouteProps {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(
  request: Request,
  { params }: RouteProps
) {
  try {
    const { id } = await params;

    const supabase = await createClient();

    // Load estimate and customer
    const { data: estimate, error: estimateError } = await supabase
      .from("estimates")
      .select(`
        *,
        customer:customers(*)
      `)
      .eq("id", id)
      .single();

    if (estimateError || !estimate) {
      return NextResponse.json(
        {
          success: false,
          message: "Estimate not found.",
        },
        { status: 404 }
      );
    }
    if (!estimate.customer?.email) {
      return NextResponse.json({ success: false, message: "The estimate customer has no email address." }, { status: 422 });
    }

    const { data: items } = await supabase
  .from("estimate_items")
  .select("*")
  .eq("estimate_id", id)
  .order("sort_order");

const pdfBuffer = await renderEstimatePdf({
  estimate,
  customer: estimate.customer,
  items: items ?? [],
});

console.log("PDF generated:", pdfBuffer.length, "bytes");

    // Send the email
    const { data, error } = await resend.emails.send({
      from: "XAREON GROUP <info@xareongroup.com>",

      to: estimate.customer.email,

      subject: `Estimate #${estimate.estimate_number} from XAREON GROUP`,

      html: `
        <div style="font-family:Arial,sans-serif;max-width:700px;margin:auto;padding:30px">

          <h1 style="margin:0;color:#2563eb;">
            XAREON GROUP
          </h1>

          <p style="margin-top:6px;color:#666;">
            Shield of Integrity
          </p>

          <hr style="margin:25px 0;">

          <h2>Hello ${estimate.customer.first_name},</h2>

          <p>
            Thank you for choosing
            <strong>XAREON GROUP</strong>.
          </p>

          <p>
            Your estimate has been attached to this email as a PDF.
          </p>

          <p>
            Please review it and let us know if you have any questions.
          </p>

          <br>

          <p>
            Thank you for your business.
          </p>

          <br>

          <strong>XAREON GROUP</strong><br/>
          Shield of Integrity

        </div>
      `,

      attachments: [
        {
          filename: `Estimate-${estimate.estimate_number}.pdf`,
          content: pdfBuffer.toString("base64"),
        },
      ],
    });

    if (error) {
      console.error("RESEND ERROR:", error);

      return NextResponse.json(
        {
          success: false,
          error,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Estimate emailed successfully.",
      data,
    });

  } catch (error: any) {
    console.error("EMAIL ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: error?.message,
        stack:
          process.env.NODE_ENV === "development"
            ? error?.stack
            : undefined,
      },
      { status: 500 }
    );
  }
}
