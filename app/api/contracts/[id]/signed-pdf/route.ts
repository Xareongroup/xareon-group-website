import { NextResponse } from "next/server";

import * as React from "react";

import { createClient } from "@/lib/supabase/server";

import { pdf } from "@react-pdf/renderer";

import SignedContractPDF from "@/components/documents/SignedContractPDF";
import { logCustomerActivity } from "@/lib/activity/logActivity";



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
            email,
            phone,
            address
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








    /*
      GENERATE SIGNED PDF
    */


    const pdfDocument =

      React.createElement(

        SignedContractPDF,

        {
          contract,
          customer,
        }

      );







    const buffer =

      await pdf(

        pdfDocument as any

      )

      .toBuffer();








    /*
      UPLOAD PDF
    */


    const fileName =

      `contracts/signed-${id}-${Date.now()}.pdf`;






    const {

      error: uploadError,

    } =

      await supabase.storage

        .from(
          "customer-documents"
        )

        .upload(

          fileName,

          buffer,

          {

            contentType:
              "application/pdf",

            upsert:true,

          }

        );







    if(uploadError)
      throw uploadError;








    /*
      GET PUBLIC URL
    */


    const {

      data:urlData,

    } =

      supabase.storage

        .from(
          "customer-documents"
        )

        .getPublicUrl(

          fileName

        );








    /*
      SAVE SIGNED PDF URL
    */


    const {

      error:updateError,

    } =

      await supabase

        .from("contracts")

        .update({

          signed_pdf_url:
            urlData.publicUrl,

        })

        .eq(
          "id",
          id
        );







    if(updateError)
      throw updateError;

    if (contract.customer_id) {
      const document = {
        customer_id: contract.customer_id,
        document_type: "signed_agreement",
        title: `Contract #${contract.contract_number ?? id} - Signed`,
        file_url: urlData.publicUrl,
        status: "Signed",
        signed_date: contract.signed_at ?? new Date().toISOString(),
      };
      const { data: existingDocument } = await supabase
        .from("customer_documents")
        .select("id")
        .eq("customer_id", contract.customer_id)
        .eq("document_type", "signed_agreement")
        .eq("title", document.title)
        .maybeSingle();
      const documentResult = existingDocument
        ? await supabase.from("customer_documents").update(document).eq("id", existingDocument.id)
        : await supabase.from("customer_documents").insert(document);
      if (documentResult.error) throw documentResult.error;

      await logCustomerActivity(
        supabase,
        contract.customer_id,
        "contract_signed",
        "Contract signed",
        `Contract #${contract.contract_number ?? id} was signed by the customer.`,
        { type: "contract", id },
      );
    }







    return NextResponse.json({

      success:true,

      url:
        urlData.publicUrl,

    });





  }

  catch(error:any){


    console.error(

      "SIGNED CONTRACT PDF ERROR:",

      error

    );




    return NextResponse.json(

      {

        error:

          error.message ??

          "Unable to generate signed contract PDF."

      },

      {

        status:500

      }

    );

  }


}
