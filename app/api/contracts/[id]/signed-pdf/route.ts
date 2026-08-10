import { NextResponse } from "next/server";

import * as React from "react";

import { createClient } from "@/lib/supabase/server";
import { requireApiRole } from "@/lib/auth/requireApiRole";

import { pdf } from "@react-pdf/renderer";

import SignedContractPDF from "@/components/documents/SignedContractPDF";
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


  const access = await requireApiRole(["owner", "admin", "manager"]);
  if ("response" in access) return access.response;

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
      PRIVATE DOCUMENT STORAGE
    */


    // Keep only a storage path. Private documents are delivered through an
    // authenticated signed-URL route, never by a public bucket URL.








    /*
      SAVE SIGNED PDF STORAGE PATH
    */


    const {

      error:updateError,

    } =

      await supabase

        .from("contracts")

        .update({

          signed_pdf_url:
            fileName,

        })

        .eq(
          "id",
          id
        );







    if(updateError)
      throw updateError;

    let customerDocument: { id: string } | null = null;
    if (contract.customer_id) {
      const document = {
        documentType: "Signed Contract" as const,
        title: `Contract #${contract.contract_number ?? id} - Signed`,
        fileUrl: fileName,
        status: "Signed",
        signedDate: contract.signed_at ?? new Date().toISOString(),
      };
      customerDocument = await recordCustomerDocument(supabase, {
        customerId: contract.customer_id,
        ...document,
      });

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

      url: customerDocument ? `/api/admin/customer-documents/${customerDocument.id}/download` : null,

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
