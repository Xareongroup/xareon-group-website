import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { logCustomerActivity } from "@/lib/activity/logActivity";
import { recordCustomerDocument } from "@/lib/documents/recordCustomerDocument";

import {
  generateSignedEstimatePDF,
} from "@/components/documents/renderSignedEstimate";


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


    const supabase =
      await createClient();



    // Get estimate

    const {
      data: estimate,
      error: estimateError,
    } =
      await supabase
        .from("estimates")
        .select("*")
        .eq(
          "id",
          id
        )
        .single();


    if (estimateError)
      throw estimateError;




    // Get customer

    const {
      data: customer,
      error: customerError,
    }
    =
      await supabase
        .from("customers")
        .select("*")
        .eq(
          "id",
          estimate.customer_id
        )
        .single();



    if(customerError)
      throw customerError;





    // Get estimate items

    const {
      data: items,
      error:itemError
    }
    =
      await supabase
        .from("estimate_items")
        .select("*")
        .eq(
          "estimate_id",
          estimate.id
        )
        .order(
          "sort_order"
        );



    if(itemError)
      throw itemError;





    // Generate PDF

    const pdfBuffer =
      await generateSignedEstimatePDF(
        estimate,
        customer,
        items ?? []
      );





    // Storage path

    const filePath =
      `customers/${customer.id}/estimates/estimate-${estimate.estimate_number}-signed.pdf`;





    // Upload PDF

    const {
      error: uploadError
    }
    =
      await supabase.storage
        .from(
          "customer-documents"
        )
        .upload(
          filePath,
          pdfBuffer,
          {
            contentType:
              "application/pdf",

            upsert:true,
          }
        );



    if(uploadError)
      throw uploadError;







    // Save customer document record

    await recordCustomerDocument(supabase, {
      customerId: customer.id,
      documentType: "Signed Estimate",
      title: `Estimate #${estimate.estimate_number} - Signed`,
      fileUrl: filePath,
      status: "Signed",
      signedDate: estimate.signed_at,
    });







    // Save PDF path in estimate

    const {
      error:updateError
    }
    =
      await supabase
        .from("estimates")
        .update({

          signed_pdf_url:
            filePath,

        })
        .eq(
          "id",
          estimate.id
        );



    if(updateError)
      throw updateError;

    await logCustomerActivity(
      supabase,
      customer.id,
      "estimate_signed",
      "Estimate signed",
      `Estimate #${estimate.estimate_number ?? id} was signed by the customer.`,
      { type: "estimate", id },
    );






    return NextResponse.json({

      success:true,

      filePath,

    });



  }
  catch(error:any){


    console.error(
      "SIGNED PDF ERROR:",
      error
    );


    return NextResponse.json(

      {
        error:
          error.message ??
          "Failed creating signed PDF"
      },

      {
        status:500
      }

    );

  }

}
