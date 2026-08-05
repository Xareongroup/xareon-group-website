import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";


export async function POST(
  request: Request,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {

  try {

    const { id } = await params;

    const supabase = await createClient();


    // Get estimate

    const {
      data: estimate,
      error: estimateError,
    } =
      await supabase
        .from("estimates")
        .select(`
          *,
          customers(
            first_name,
            last_name,
            email
          )
        `)
        .eq("id", id)
        .single();



    if (estimateError)
      throw estimateError;



    if (!estimate.customers?.email) {
      throw new Error(
        "Customer email not found."
      );
    }



    // Update sending status

    const {
      error: updateError
    } =
      await supabase
        .from("estimates")
        .update({

          sent_at:
            new Date().toISOString(),

          signature_status:
            "Pending"

        })
        .eq(
          "id",
          id
        );


    if(updateError)
      throw updateError;



    const signingLink =
      `${process.env.NEXT_PUBLIC_SITE_URL}/sign/estimate/${estimate.signature_token}`;




    /*
      Email will be connected next
      using Resend

      For now return the link
    */


    return NextResponse.json({

      success:true,

      signingLink,

      customer:
      estimate.customers.email

    });



  }
  catch(error:any){


    console.error(
      "SEND ESTIMATE ERROR:",
      error
    );


    return NextResponse.json(
      {
        error:
        error.message ??
        "Failed sending estimate"
      },
      {
        status:500
      }
    );

  }

}