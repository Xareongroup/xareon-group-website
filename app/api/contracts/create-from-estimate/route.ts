import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

import { getNextDocumentNumber } from "@/lib/documentNumbers";


export async function POST(
  request: Request
) {

  try {


    const body =
      await request.json();


    const {
      estimateId
    } = body;



    if (!estimateId) {

      return NextResponse.json(
        {
          error:
            "Estimate ID is required."
        },
        {
          status: 400
        }
      );

    }



    const supabase =
      await createClient();





    // Get estimate


    const {
      data: estimate,
      error: estimateError
    }
    =
    await supabase

      .from("estimates")

      .select(`
        *,
        customer:customers(
          id,
          first_name,
          last_name
        ),
        jobs(
          id
        )
      `)

      .eq(
        "id",
        estimateId
      )

      .single();





    if (estimateError)
      throw estimateError;





    if (
      estimate.signature_status !== "Signed"
    ) {

      throw new Error(
        "Estimate must be signed before creating a contract."
      );

    }







    // Generate contract number


    const contractNumber =
      await getNextDocumentNumber(
        supabase,
        "contract"
      );








    // Create contract


    const {
      data: contract,
      error: contractError
    }
    =
    await supabase

      .from("contracts")

      .insert({


        contract_number:
          contractNumber,



        title:
          `${estimate.customer?.first_name ?? ""} ${estimate.customer?.last_name ?? ""} Service Agreement`,



        customer_id:
          estimate.customer_id,



        estimate_id:
          estimate.id,



        job_id:
          estimate.jobs?.id ?? null,



        status:
          "Draft",



        issue_date:
          new Date()
            .toISOString()
            .split("T")[0],



        scope_of_work:
          estimate.notes
            ??
          "Scope of work transferred from approved estimate.",



        payment_terms:
          estimate.terms
            ??
          "Payment terms transferred from approved estimate.",



        warranty:
          "XAREON GROUP warrants workmanship according to the terms agreed upon in this service contract.",



        terms:
          estimate.terms,



        notes:
          estimate.notes,



        signature_token:
          crypto.randomUUID(),



      })

      .select()

      .single();







    if (contractError)
      throw contractError;







    return NextResponse.json({

      success: true,

      contractId:
        contract.id,

    });




  }

  catch(error:any) {


    console.error(
      "CREATE CONTRACT ERROR:",
      error
    );



    return NextResponse.json(

      {
        error:
          error.message ??
          "Unable to create contract."
      },

      {
        status:500
      }

    );

  }

}