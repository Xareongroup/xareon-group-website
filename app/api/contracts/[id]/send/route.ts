import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

import { resend } from "@/lib/resend";
import { logCustomerActivity } from "@/lib/activity/logActivity";
import { recordCustomerDocument } from "@/lib/documents/recordCustomerDocument";



export async function POST(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  }
) {


  try {


    const { id } =
      await params;



    const supabase =
      await createClient();







    /*
      GET CONTRACT
    */


    const {
      data: contract,
      error: contractError,

    } =
      await supabase

        .from("contracts")

        .select(`

          *,

          customer:customers(

            first_name,
            last_name,
            email

          )

        `)

        .eq(
          "id",
          id
        )

        .single();







    if(contractError)
      throw contractError;





    if(!contract)
      throw new Error(
        "Contract not found."
      );







    const customer =

      Array.isArray(contract.customer)

        ? contract.customer[0]

        : contract.customer;







    if(!customer?.email){

      throw new Error(
        "Customer email not found."
      );

    }








    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL
      ??
      "http://localhost:3000";




    const signingUrl =

      `${siteUrl}/sign/contract/${contract.signature_token}`;








    /*
      SEND EMAIL
    */


    await resend.emails.send({

      from:
        "XAREON GROUP <info@xareongroup.com>",


      to:
        customer.email,


      subject:
        "Your XAREON GROUP Service Contract is Ready for Review",



      html:

      `

      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111827">


        <h2>
          XAREON GROUP
        </h2>


        <p>
          Hello ${customer.first_name} ${customer.last_name},
        </p>


        <p>
          Your service contract with XAREON GROUP is ready for your review.
        </p>


        <p>
          Please review the agreement and complete your electronic signature:
        </p>


        <p>

          <a

          href="${signingUrl}"

          style="
          display:inline-block;
          padding:12px 20px;
          background:#2563eb;
          color:white;
          text-decoration:none;
          border-radius:8px;
          "

          >

          Review & Sign Contract

          </a>

        </p>



        <p>
          Thank you for choosing XAREON GROUP.
        </p>



        <p>
          Shield of Integrity
        </p>


      </div>

      `,

    });







    /*
      UPDATE STATUS
    */


    await supabase

      .from("contracts")

      .update({

        status:
          "Sent",

      })

      .eq(
        "id",
        id
      );

    if (contract.customer_id) {
      await recordCustomerDocument(supabase, {
        customerId: contract.customer_id,
        documentType: "Contract",
        title: `Contract #${contract.contract_number ?? id}`,
        fileUrl: `/admin/contracts/${id}/preview`,
        status: "Sent",
      });

      await logCustomerActivity(
        supabase,
        contract.customer_id,
        "contract_sent",
        "Contract sent",
        `Contract #${contract.contract_number ?? id} was emailed to ${customer.email}.`,
        { type: "contract", id },
      );
    }








    return NextResponse.json({

      success:true,

      message:
        "Contract sent successfully.",

    });






  }

  catch(error:any){


    console.error(

      "SEND CONTRACT ERROR:",

      error

    );



    return NextResponse.json(

      {

        error:

          error.message ??

          "Unable to send contract."

      },

      {

        status:500

      }

    );


  }

}
