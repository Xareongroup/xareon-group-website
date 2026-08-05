import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

import {
  pdf,
} from "@react-pdf/renderer";

import ContractPDF from "@/components/documents/ContractPDF";

import React from "react";



export async function POST(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      id:string;
    }>;
  }
) {


  try {


    const { id } =
      await params;



    const supabase =
      await createClient();





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





    if(contractError)
      throw contractError;



    if(!contract)
      throw new Error(
        "Contract not found."
      );
    if (!contract.customer_id) throw new Error("Contract is not linked to a customer.");







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






    if(customerError)
      throw customerError;



    if(!customer)
      throw new Error(
        "Customer not found."
      );









    const element = React.createElement(
      ContractPDF,
      {
        contract,
        customer,
      }
    );





    const buffer =
      await pdf(
        element as any
      )
      .toBuffer();







    const fileName =
      `contracts/${id}.pdf`;







    const {
      error: uploadError

    } = await supabase.storage

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







    const {
      data:urlData

    } = supabase.storage

      .from(
        "customer-documents"
      )

      .getPublicUrl(
        fileName
      );







    await supabase

      .from("contracts")

      .update({

        pdf_url:
          urlData.publicUrl,

      })

      .eq(
        "id",
        id
      );







    return NextResponse.json({

      success:true,

      url:
        urlData.publicUrl,

    });



  }


  catch(error:any){


    console.error(
      "CONTRACT PDF ERROR:",
      error
    );



    return NextResponse.json(

      {
        error:
          error?.message ??
          "PDF generation failed."
      },

      {
        status:500
      }

    );


  }


}
