"use client";

import { useState } from "react";


interface Props {

  invoiceId: string;

}



export default function EmailInvoiceButton({

  invoiceId,

}: Props) {


  const [loading, setLoading] =
    useState(false);



  async function sendInvoiceEmail(){


    try {


      setLoading(true);



      const response =

        await fetch(

          `/api/invoices/${invoiceId}/email`,

          {

            method:"POST",

          }

        );





      const result =
        await response.json();





      if(!response.ok){

        throw new Error(
          result.error ??
          "Unable to send invoice."
        );

      }





      alert(
        "Invoice emailed successfully."
      );



    }

    catch(error:any){


      alert(
        error.message ??
        "Email failed."
      );


    }

    finally{


      setLoading(false);


    }


  }






  return (

    <button

      type="button"

      onClick={sendInvoiceEmail}

      disabled={loading}

      className="
      rounded-lg
      bg-blue-600
      px-5
      py-2.5
      font-medium
      text-white
      transition
      hover:bg-blue-700
      disabled:bg-slate-400
      "

    >

      {
        loading
        ? "Sending..."
        : "Email Invoice"
      }


    </button>

  );


}