import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { requireApiRole } from "@/lib/auth/requireApiRole";

import { getNextDocumentNumber } from "@/lib/documentNumbers";
import { triggerAutomation } from "@/lib/automation/automationEngine";


export async function POST(
  request: Request
) {

  const access = await requireApiRole(["owner", "admin", "manager"]);
  if ("response" in access) return access.response;

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



        customer_id:
          estimate.customer_id,



        estimate_id:
          estimate.id,



        job_id: estimate.jobs[0]?.id ?? null,



        status:
          "Draft",



        issue_date:
          new Date()
            .toISOString()
            .split("T")[0],



        terms:
          estimate.terms ?? estimate.notes ?? "",



        notes:
          estimate.notes,



        signature_token:
          crypto.randomUUID(),



      })

      .select()

      .single();







    if (contractError)
      throw contractError;

    await triggerAutomation({ event: "contract_created", entityType: "contract", entityId: contract.id, customerId: estimate.customer_id, title: `Contract #${contractNumber} was created.` });







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
