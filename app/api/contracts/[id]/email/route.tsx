import { NextResponse } from "next/server";

import { renderToBuffer } from "@react-pdf/renderer";

import { resend } from "@/lib/resend";

import { createClient } from "@/lib/supabase/server";
import { requireApiRole } from "@/lib/auth/requireApiRole";

import ContractPDF from "@/components/documents/ContractPDF";


interface RouteProps {

  params: Promise<{
    id: string;
  }>;

}



export async function POST(

  request: Request,

  { params }: RouteProps

) {


  const access = await requireApiRole(["owner", "admin", "manager"]);
  if ("response" in access) return access.response;

  try {


    const { id } = await params;



    const supabase =
      await createClient();





    /*
      GET CONTRACT
    */


    const {

      data: contract,

      error: contractError,

    } = await supabase

      .from("contracts")

      .select("*")

      .eq(
        "id",
        id
      )

      .single();





    if (contractError || !contract) {

      throw new Error(
        "Contract not found."
      );

    }
    if (!contract.customer_id) {
      throw new Error("Contract is not linked to a customer.");
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
        contract.customer_id
      )

      .single();





    if (customerError || !customer) {

      throw new Error(
        "Customer not found."
      );

    }






    if (!customer.email) {

      throw new Error(
        "Customer email address is missing."
      );

    }










    /*
      CREATE PDF
    */


    const pdfBuffer =

      await renderToBuffer(

        <ContractPDF

          contract={contract}

          customer={customer}

        />

      );









    /*
      SEND EMAIL
    */


    const emailResult =

      await resend.emails.send({

        from:

          "XAREON Group <info@xareongroup.com>",


        to:

          customer.email,



        subject:

          `Service Contract ${contract.contract_number ?? ""} - XAREON Group`,



        html:

        `

        <div style="font-family:Arial,sans-serif; line-height:1.5">


          <h2>
            XAREON GROUP
          </h2>


          <p>
            Hello ${customer.first_name ?? "Customer"},
          </p>


          <p>
            Please find your service contract attached.
          </p>


          <p>
            Contract Number:
            <strong>
              ${contract.contract_number ?? "-"}
            </strong>
          </p>


          <p>
            Thank you for choosing XAREON GROUP.
          </p>


          <br/>


          <p>
            Shield of Integrity
          </p>


        </div>

        `,



        attachments: [

          {

            filename:

              `${contract.contract_number ?? "contract"}.pdf`,


            content:

              pdfBuffer,

          },

        ],

      });







    if (emailResult.error) {

      throw new Error(
        emailResult.error.message
      );

    }








    /*
      UPDATE CONTRACT STATUS
    */


    const {

      error: updateError,

    } = await supabase

      .from("contracts")

      .update({

        status:
          "Sent",


        sent_at:
          new Date()
            .toISOString(),


        sent_to:
          customer.email,

      })

      .eq(
        "id",
        id
      );





    if (updateError) {

      throw updateError;

    }









    return NextResponse.json({

      success: true,

      message:
        "Contract emailed successfully.",

    });






  }

  catch (error: any) {


    console.error(

      "EMAIL CONTRACT ERROR:",

      error

    );



    return NextResponse.json(

      {

        error:

          error.message ??

          "Unable to send contract email.",

      },

      {

        status: 500,

      }

    );


  }


}
