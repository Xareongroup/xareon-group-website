import { NextResponse } from "next/server";

import { renderToBuffer } from "@react-pdf/renderer";

import { Resend } from "resend";

import { adminSupabase } from "@/lib/supabase/admin";

import InvoicePDF from "@/components/pdf/InvoicePDF";



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





    if(invoiceError || !invoice){

      throw new Error(
        "Invoice not found."
      );

    }








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





    if(customerError || !customer){

      throw new Error(
        "Customer not found."
      );

    }






    if(!customer.email){

      throw new Error(
        "Customer email address is missing."
      );

    }









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


    await resend.emails.send({

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







    return NextResponse.json({

      success:true,

      message:
        "Invoice emailed successfully.",

    });





  }

  catch(error:any){


    console.error(
      "EMAIL INVOICE ERROR:",
      error
    );



    return NextResponse.json(

      {

        error:
          error.message ??
          "Unable to send invoice email."

      },

      {

        status:500

      }

    );


  }


}
