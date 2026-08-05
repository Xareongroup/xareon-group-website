"use client";

import { useState } from "react";


interface Props {

  contractId: string;

}



export default function EmailContractButton({

  contractId,

}: Props) {


  const [loading, setLoading] =
    useState(false);





  async function sendContractEmail(){


    try {


      setLoading(true);



      const response =

        await fetch(

          `/api/contracts/${contractId}/email`,

          {

            method:"POST",

          }

        );





      const result =
        await response.json();





      if(!response.ok){

        throw new Error(
          result.error ??
          "Unable to send contract."
        );

      }





      alert(
        "Contract emailed successfully."
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

      onClick={sendContractEmail}

      disabled={loading}

      className="
      rounded-xl
      bg-blue-600
      px-5
      py-3
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
        : "Email Contract"
      }


    </button>

  );


}