import { NextResponse } from "next/server";

import { renderToBuffer } from "@react-pdf/renderer";

import { Resend } from "resend";

import { adminSupabase } from "@/lib/supabase/admin";
import { requireApiRole } from "@/lib/auth/requireApiRole";

import InvoicePDF from "@/components/pdf/InvoicePDF";
import { logCustomerActivity } from "@/lib/activity/logActivity";
import { recordCustomerDocument } from "@/lib/documents/recordCustomerDocument";



const resend = new Resend(
  process.env.RESEND_API_KEY
);



interface RouteProps {

  params: Promise<{
    id: string;
  }>;

}





export async function POST(

  request: Request,

  { params }: RouteProps

) {


  try {
    const access = await requireApiRole(["owner", "admin", "manager", "accounting"]);
    if ("response" in access) return access.response;


    const { id } =
      await params;



    const supabase =
      adminSupabase;





    /*
      GET INVOICE
    */


    const {
      data: invoice,
      error: invoiceError,

    } = await supabase

      .from("invoices")

      .select("*")

      .eq(
        "id",
        id
      )

      .single();





    if(invoiceError || !invoice) return NextResponse.json({ error: "Invoice not found." }, { status: 404 });
    if (!invoice.customer_id) return NextResponse.json({ error: "This invoice is not linked to a customer." }, { status: 422 });








    /*
      GET CUSTOMER
    */


    const {
      data: customer,
      error: customerError,

    } = await supabase

      .from("customers")

      .select("*")

      .eq(
        "id",
        invoice.customer_id
      )

      .single();





    if(customerError || !customer) return NextResponse.json({ error: "Invoice customer not found." }, { status: 404 });






    if(!customer.email) return NextResponse.json({ error: "The customer does not have an email address." }, { status: 422 });









    /*
      GET ITEMS
    */


    const {
      data: items,

    } = await supabase

      .from("invoice_items")

      .select("*")

      .eq(
        "invoice_id",
        id
      )

      .order(
        "sort_order"
      );









    /*
      GENERATE PDF
    */


    const pdfBuffer =

      await renderToBuffer(

        <InvoicePDF

          invoice={invoice}

          customer={customer}

          items={items ?? []}

        />

      );








    /*
      SEND EMAIL
    */


    const { error: emailError } = await resend.emails.send({

      from:
        "XAREON Group <info@xareongroup.com>",


      to:
        customer.email,


      subject:
        `Invoice ${invoice.invoice_number} from XAREON Group`,


      html:

      `
      <div style="font-family:Arial,sans-serif">

        <h2>
          XAREON GROUP
        </h2>

        <p>
          Hello ${`${customer.first_name ?? ""} ${customer.last_name ?? ""}`.trim() || "Customer"},
        </p>

        <p>
          Please find your invoice attached.
        </p>

        <p>
          Invoice Number:
          <strong>
          ${invoice.invoice_number}
          </strong>
        </p>

        <p>
          Thank you for choosing XAREON GROUP.
        </p>

        <br />

        <p>
          Shield of Integrity
        </p>

      </div>
      `,


      attachments: [

        {

          filename:
            `${invoice.invoice_number}.pdf`,

          content:
            pdfBuffer,

        },

      ],


    });
    if (emailError) {
      console.error("Invoice email provider rejected delivery", emailError);
      return NextResponse.json({ error: "Unable to send the invoice email. Please try again." }, { status: 502 });
    }

    await recordCustomerDocument(supabase, {
      customerId: customer.id,
      documentType: "Invoice",
      title: `Invoice #${invoice.invoice_number ?? id}`,
      fileUrl: `/api/invoices/${id}/pdf`,
      status: "Sent",
    });

    await logCustomerActivity(
      supabase,
      customer.id,
      "invoice_sent",
      "Invoice sent",
      `Invoice #${invoice.invoice_number ?? id} was emailed to ${customer.email}.`,
      { type: "invoice", id },
    );







    return NextResponse.json({

      success:true,

      message:
        "Invoice emailed successfully.",

    });





  }

  catch(error){


    console.error(
      "EMAIL INVOICE ERROR:",
      error
    );



    return NextResponse.json(

      {

        error: "Unable to send invoice email. Please try again."

      },

      {

        status:500

      }

    );


  }


}
