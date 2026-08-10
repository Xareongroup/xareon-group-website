import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { requireApiRole } from "@/lib/auth/requireApiRole";

import { randomUUID } from "crypto";



export async function POST(
  request: Request
) {

  const access = await requireApiRole(["owner", "admin", "manager", "sales"]);
  if ("response" in access) return access.response;


  try {


    const {
      customerId,
    } = await request.json();





    if(!customerId){

      return NextResponse.json(
        {
          error:
          "Customer ID is required."
        },
        {
          status:400
        }
      );

    }







    const supabase =
      await createClient();







    const {
      data: customer,
      error: customerError,
    } =
      await supabase

        .from("customers")

        .select(`
          id,
          first_name,
          last_name
        `)

        .eq(
          "id",
          customerId
        )

        .single();







    if(customerError || !customer){

      return NextResponse.json(
        {
          error:
          "Customer not found."
        },
        {
          status:404
        }
      );

    }









    const newToken =
      randomUUID();








    const {
      error:updateError,
    } =
      await supabase

        .from("customers")

        .update({

          portal_token:
          newToken,

          portal_created_at:
          new Date().toISOString(),

        })

        .eq(
          "id",
          customerId
        );







    if(updateError){

      throw updateError;

    }









    await supabase

      .from("customer_activity")

      .insert({

        customer_id:
          customer.id,

        activity_type:
          "portal_regenerated",

        title:
          "Customer Portal Link Regenerated",

        description:
          "A new customer portal link was generated.",

      });









    return NextResponse.json({

      success:true,

      portalToken:
      newToken,

    });




  }


  catch(error:any){


    console.error(
      "REGENERATE PORTAL ERROR:",
      error
    );



    return NextResponse.json(

      {
        error:
        error.message ??
        "Unable to regenerate portal."
      },

      {
        status:500
      }

    );


  }


}
