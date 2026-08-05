import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";


interface RouteProps {

  params: Promise<{
    id: string;
  }>;

}



export async function POST(

  request: Request,

  { params }: RouteProps

) {


  try {


    const { id } =
      await params;


    const body =
      await request.json();



    const {
      amount,
      method,
      notes,

    } = body;





    if (!amount || Number(amount) <= 0) {

      return NextResponse.json(

        {
          error:
            "Valid payment amount is required."
        },

        {
          status: 400
        }

      );

    }







    const supabase =
      await createClient();








    /*
      GET INVOICE
    */


    const {

      data: invoice,

      error: invoiceError,

    } = await supabase

      .from("invoices")

      .select("*")

      .eq(
        "id",
        id
      )

      .single();





    if (invoiceError || !invoice) {

      throw new Error(
        "Invoice not found."
      );

    }









    /*
      CREATE PAYMENT RECORD
    */


    const {

      error: paymentError,

    } = await supabase

      .from("payments")

      .insert({

        invoice_id:
          id,


        amount:
          Number(amount),


        payment_method:
          method ?? null,


        notes:
          notes ?? null,


        payment_date:
          new Date()
            .toISOString(),

      });





    if (paymentError) {

      throw paymentError;

    }









    /*
      GET ALL PAYMENTS
    */


    const {

      data: payments,

      error: paymentsError,

    } = await supabase

      .from("payments")

      .select("amount")

      .eq(
        "invoice_id",
        id
      );





    if (paymentsError) {

      throw paymentsError;

    }








    const amountPaid =

      payments?.reduce(

        (sum, payment) =>

          sum +
          Number(payment.amount ?? 0),

        0

      ) ?? 0;








    const total =

      Number(
        invoice.total ?? 0
      );





    const balanceDue =

      Math.max(

        total - amountPaid,

        0

      );








    let status =
      "Sent";



    if (amountPaid >= total) {

      status =
        "Paid";

    }

    else if (amountPaid > 0) {

      status =
        "Partially Paid";

    }









    /*
      UPDATE INVOICE
    */


    const {

      error: updateError,

    } = await supabase

      .from("invoices")

      .update({

        amount_paid:
          amountPaid,


        balance_due:
          balanceDue,


        status,


        payment_date:
          new Date()
            .toISOString(),


      })

      .eq(
        "id",
        id
      );







    if(updateError){

      throw updateError;

    }








    return NextResponse.json({

      success:true,

      status,

      amount_paid:
        amountPaid,

      balance_due:
        balanceDue,

    });






  }

  catch(error:any){


    console.error(

      "PAYMENT ERROR:",

      error

    );



    return NextResponse.json(

      {

        error:

          error.message ??

          "Unable to record payment."

      },

      {

        status:500

      }

    );


  }


}
